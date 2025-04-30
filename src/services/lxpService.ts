import { supabase } from "@/integrations/supabase/client";
import { UserData, DiaryData } from "@/utils/api";

export const processLxpData = async (userData: UserData, diaryData: DiaryData) => {
  try {
    // Calculate attendance percentage
    const totalClasses = diaryData.total_lessons;
    const attendedClasses = diaryData.attended_lessons;
    const attendancePercent = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    // Calculate average score percentage
    const totalScores = diaryData.total_scores;
    const scorePercent = totalClasses > 0 ? (totalScores / totalClasses) : 0;

    // Extract average grade
    const averageGrade = diaryData.average_grade;

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
    const { error: upsertError } = await supabase
      .from('student_performance')
      .upsert([
        {
          student_id: userData.studentId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          avatar_url: userData.avatar,
          attendance_percent: attendancePercent,
          score_percent: scorePercent,
          average_grade: averageGrade,
          email: userData.email,
          study_group: diaryData.study_group,
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
    const { data, error } = await supabase
      .from('student_performance')
      .select('*')
      .order('average_grade', { ascending: false })
      .order('score_percent', { ascending: false })
      .order('attendance_percent', { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard data:", error);
      throw error;
    }

    return data || [];
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
    
    // Update student_performance to reflect the changes in the leaderboard
    await supabase
      .from('student_performance')
      .update({
        last_name: data.lastName,
        avatar_url: data.avatarUrl
      })
      .eq('student_id', studentId);
      
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
