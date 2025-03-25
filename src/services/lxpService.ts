
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const API_URL = "https://api.newlxp.ru/graphql";

// Type definitions
export interface StudentProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface StudentPerformanceData {
  studentId: string;
  studyPeriodName: string;
  studyPeriodStatus: "STARTED" | "FINISHED";
  attendancePercent: number;
  scorePoints: number;
  maxScorePoints: number;
  averageGrade: number;
}

export interface StudentLeaderboardEntry {
  studentId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  attendancePercent: number;
  scorePercent: number;
  averageGrade: number;
}

// Process discipline data to calculate student performance
const calculateStudentPerformance = (disciplineData: any): StudentPerformanceData[] => {
  if (!disciplineData || !disciplineData.searchStudentDisciplines) {
    return [];
  }

  // Group by study period
  const studyPeriodGroups = disciplineData.searchStudentDisciplines.reduce((acc: any, discipline: any) => {
    const periodName = discipline.studyPeriod?.name || 'Unknown';
    
    if (!acc[periodName]) {
      acc[periodName] = {
        disciplines: [],
        status: discipline.studyPeriod?.status || 'STARTED'
      };
    }
    
    acc[periodName].disciplines.push(discipline);
    return acc;
  }, {});

  // Calculate performance metrics for each study period
  return Object.entries(studyPeriodGroups).map(([periodName, data]: [string, any]) => {
    const disciplines = data.disciplines;
    const studentId = disciplines[0]?.studentId;
    
    // Calculate overall attendance
    const totalAttendance = disciplines.reduce((sum: number, discipline: any) => 
      sum + (discipline.disciplineAttendance?.percent || 0), 0);
    const avgAttendance = disciplines.length > 0 ? totalAttendance / disciplines.length : 0;
    
    // Calculate score points
    const totalScorePoints = disciplines.reduce((sum: number, discipline: any) => 
      sum + (discipline.scoreForAnsweredTasks || 0), 0);
    const totalMaxScorePoints = disciplines.reduce((sum: number, discipline: any) => 
      sum + (discipline.maxScoreForAnsweredTasks || discipline.discipline?.maxScore || 100), 0);
    
    // Calculate average grade (using number conversion for grades)
    let gradesCount = 0;
    const totalGradePoints = disciplines.reduce((sum: number, discipline: any) => {
      const grade = parseGrade(discipline.disciplineGrade || discipline.disciplineGrade_V2);
      if (grade > 0) {
        gradesCount++;
        return sum + grade;
      }
      return sum;
    }, 0);
    
    const avgGrade = gradesCount > 0 ? totalGradePoints / gradesCount : 0;
    
    return {
      studentId,
      studyPeriodName: periodName,
      studyPeriodStatus: data.status,
      attendancePercent: Math.round(avgAttendance),
      scorePoints: totalScorePoints,
      maxScorePoints: totalMaxScorePoints,
      averageGrade: avgGrade
    };
  });
};

// Helper to parse grade strings to numbers
const parseGrade = (grade: string | null | undefined): number => {
  if (!grade) return 0;
  
  // Handle numeric grades
  if (!isNaN(Number(grade))) {
    return Number(grade);
  }
  
  // Handle letter grades (you can expand this based on your grading system)
  const gradeMap: Record<string, number> = {
    'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1,
    'Отлично': 5, 'Хорошо': 4, 'Удовлетворительно': 3, 'Неудовлетворительно': 2
  };
  
  return gradeMap[grade] || 0;
};

// Store student profile in Supabase
export const storeStudentProfile = async (profile: StudentProfileData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('student_profiles')
      .upsert({
        student_id: profile.id,
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        avatar_url: profile.avatarUrl
      });
    
    if (error) throw new Error(error.message);
  } catch (error: any) {
    console.error("Error storing student profile:", error);
    throw new Error(`Failed to store student profile: ${error.message}`);
  }
};

// Store student performance data in Supabase
export const storeStudentPerformance = async (performance: StudentPerformanceData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('student_performance')
      .upsert({
        student_id: performance.studentId,
        study_period_name: performance.studyPeriodName,
        study_period_status: performance.studyPeriodStatus,
        attendance_percent: performance.attendancePercent,
        score_points: performance.scorePoints,
        max_score_points: performance.maxScorePoints,
        average_grade: performance.averageGrade
      });
    
    if (error) throw new Error(error.message);
  } catch (error: any) {
    console.error("Error storing student performance:", error);
    throw new Error(`Failed to store student performance: ${error.message}`);
  }
};

// Process and store LXP data after successful login
export const processLxpData = async (userData: any, diaryData: any): Promise<void> => {
  try {
    if (!userData || !diaryData) {
      console.error("Invalid data received from LXP");
      return;
    }
    
    // Store student profile
    const profile: StudentProfileData = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName || "Unknown",
      email: userData.email,
      avatarUrl: userData.avatar
    };
    
    await storeStudentProfile(profile);
    
    // Calculate and store performance data
    const performanceData = calculateStudentPerformance(diaryData);
    
    for (const performance of performanceData) {
      await storeStudentPerformance(performance);
    }
    
    toast.success("Данные успешно загружены и сохранены");
  } catch (error: any) {
    console.error("Error processing LXP data:", error);
    toast.error(`Ошибка сохранения данных: ${error.message}`);
  }
};

// Get leaderboard data for current study period
export const getLeaderboardData = async (): Promise<StudentLeaderboardEntry[]> => {
  try {
    // Get all student performances for the current/latest period
    const { data: performances, error: performanceError } = await supabase
      .from('student_performance')
      .select('*')
      .eq('study_period_status', 'STARTED');
    
    if (performanceError) throw new Error(performanceError.message);
    
    // Get all student profiles
    const { data: profiles, error: profileError } = await supabase
      .from('student_profiles')
      .select('*');
    
    if (profileError) throw new Error(profileError.message);
    
    // Create a map of student profiles by ID for easy lookup
    const profileMap = profiles.reduce((map: Record<string, any>, profile: any) => {
      map[profile.student_id] = profile;
      return map;
    }, {});
    
    // Create leaderboard entries by combining profile and performance data
    const leaderboardEntries = performances.map((performance: any) => {
      const profile = profileMap[performance.student_id] || {};
      const scorePercent = performance.max_score_points > 0 
        ? (performance.score_points / performance.max_score_points) * 100 
        : 0;
      
      return {
        studentId: performance.student_id,
        firstName: profile.first_name || 'Unknown',
        lastName: profile.last_name || 'Student',
        avatarUrl: profile.avatar_url,
        attendancePercent: performance.attendance_percent,
        scorePercent: Math.round(scorePercent),
        averageGrade: performance.average_grade
      };
    });
    
    // Sort by a combined ranking score (weighted average)
    return leaderboardEntries.sort((a, b) => {
      const scoreA = (a.attendancePercent * 0.3) + (a.scorePercent * 0.3) + (a.averageGrade * 20 * 0.4);
      const scoreB = (b.attendancePercent * 0.3) + (b.scorePercent * 0.3) + (b.averageGrade * 20 * 0.4);
      return scoreB - scoreA;
    });
  } catch (error: any) {
    console.error("Error fetching leaderboard data:", error);
    toast.error(`Ошибка получения данных рейтинга: ${error.message}`);
    return [];
  }
};

export default {
  processLxpData,
  getLeaderboardData,
  storeStudentProfile,
  storeStudentPerformance
};
