import { supabase } from "@/integrations/supabase/client";
import { UserData, DiaryData } from "@/utils/api";

export const processLxpData = async (userData: UserData, diaryData: DiaryData) => {
  try {
    // Calculate attendance percentage
    const totalClasses = diaryData.total_lessons || 0;
    const attendedClasses = diaryData.attended_lessons || 0;
    const attendancePercent = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    // Calculate average score percentage
    const totalScores = diaryData.total_scores || 0;
    const scorePercent = totalClasses > 0 ? (totalScores / totalClasses) : 0;

    // Extract average grade
    const averageGrade = diaryData.average_grade || 0;

    // Check if the user already has a profile
    const { data: existingProfile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('student_id', userData.studentId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error checking existing profile:", profileError);
      throw profileError;
    }

    if (!existingProfile) {
      // Create a new student profile
      const { error: insertProfileError } = await supabase
        .from('student_profiles')
        .insert([
          {
            student_id: userData.studentId,
            first_name: userData.firstName,
            last_name: userData.lastName,
            avatar_url: userData.avatar,
            email: userData.email,
          },
        ]);

      if (insertProfileError) {
        console.error("Error creating student profile:", insertProfileError);
        throw insertProfileError;
      }
    }

    // Upsert student performance data
    // Create a new table for student_performance with our own schema that matches what we're using
    const { error: upsertError } = await supabase
      .from('student_performance')
      .upsert([
        {
          student_id: userData.studentId,
          attendance_percent: attendancePercent,
          average_grade: averageGrade,
          score_points: totalScores,
          max_score_points: totalClasses * 100, // Assuming maximum score is 100 per class
          study_period_name: "Current Period",
          study_period_status: "STARTED"
        },
      ], { onConflict: 'student_id' });

    if (upsertError) {
      console.error("Error upserting student performance:", upsertError);
      throw upsertError;
    }

    console.log(`LXP data processed and saved for student ID: ${userData.studentId}`);
  } catch (error) {
    console.error("Error processing LXP data:", error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    // Fetch data from student_performance table
    const { data: performanceData, error: perfError } = await supabase
      .from('student_performance')
      .select('*')
      .order('average_grade', { ascending: false });

    if (perfError) {
      console.error("Error fetching performance data:", perfError);
      throw perfError;
    }

    // Fetch student profile data
    const { data: profilesData, error: profilesError } = await supabase
      .from('student_profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles data:", profilesError);
      throw profilesError;
    }

    // Join the data and map to StudentRankProps format
    const leaderboardData = performanceData.map((perf, index) => {
      // Find matching profile
      const profile = profilesData.find(p => p.student_id === perf.student_id) || {};
      
      return {
        rank: index + 1,
        studentId: perf.student_id,
        firstName: profile.first_name || "Unknown",
        lastName: profile.last_name || "Student",
        avatarUrl: profile.avatar_url,
        attendancePercent: perf.attendance_percent || 0,
        scorePercent: (perf.score_points / (perf.max_score_points || 1)) * 100,
        averageGrade: perf.average_grade || 0,
        description: profile.description,
        studyGroup: perf.study_period_name
      };
    });

    return leaderboardData || [];
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    throw error;
  }
};

export const hasUserConsent = (userId: string): boolean => {
  const consent = localStorage.getItem(`consent_${userId}`);
  return consent === 'true';
};

export const saveUserConsent = (userId: string): void => {
  localStorage.setItem(`consent_${userId}`, 'true');
};

export const removeUserConsent = async (userId: string) => {
  localStorage.removeItem(`consent_${userId}`);
  console.log(`User ${userId} removed from leaderboard`);
};

export const getUserAuth = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error getting user authentication:", error);
    return null;
  }
};

export const saveUserAuth = (user: any) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user authentication:", error);
  }
};

export const clearUserAuth = () => {
  localStorage.removeItem('user');
};

export const clearLeaderboardData = async () => {
  try {
    const { error } = await supabase
      .from('student_performance')
      .delete()
      .neq('student_id', null);

    if (error) {
      console.error("Error clearing leaderboard data:", error);
      throw error;
    }

    console.log("Leaderboard data cleared successfully");
  } catch (error) {
    console.error("Error clearing leaderboard data:", error);
    throw error;
  }
};

export interface ProfileUpdateData {
  lastName?: string;
  avatarUrl?: string;
  description?: string;
}

// Add this function to update user profile
export const updateUserProfile = async (studentId: string, data: ProfileUpdateData) => {
  try {
    // Update student_profile in the database
    const { error } = await supabase
      .from('student_profiles')
      .update({
        last_name: data.lastName,
        avatar_url: data.avatarUrl,
        description: data.description
      })
      .eq('student_id', studentId);
      
    if (error) throw error;
    
    // Fetch student performance to update only what we need
    const { data: perfData } = await supabase
      .from('student_performance')
      .select('*')
      .eq('student_id', studentId)
      .single();
      
    if (perfData) {
      // Keep all the performance data intact, just update the display fields
      await supabase
        .from('student_performance')
        .update({
          student_id: perfData.student_id,
          attendance_percent: perfData.attendance_percent,
          average_grade: perfData.average_grade,
          score_points: perfData.score_points,
          max_score_points: perfData.max_score_points,
          study_period_name: perfData.study_period_name,
          study_period_status: perfData.study_period_status
        })
        .eq('student_id', studentId);
    }
      
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
