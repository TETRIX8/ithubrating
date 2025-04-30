import axios from "axios";

const API_URL = "https://api.newlxp.ru/graphql";

interface SignInInput {
  email: string;
  password: string;
}

interface SignInResponse {
  user: {
    id: string;
    isLead: boolean;
    __typename: string;
  };
  accessToken: string;
  __typename: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  studentId?: string;
  password?: string;
  description?: string;
  // Additional properties needed by ApiResponse.tsx
  roles: string[];
  phoneNumber?: string;
  createdAt: string;
  assignedSuborganizations: Array<{
    suborganization: {
      name: string;
      __typename: string;
    };
    __typename: string;
  }>;
  notificationsSettings: {
    isPushDailyDigestOnEmail: boolean;
    __typename: string;
  };
  teacher?: {
    assignedDisciplines_V2: Array<{
      discipline: {
        name: string;
        code: string;
        studyPeriods: Array<{
          name: string;
          startDate: string;
          endDate: string;
          __typename: string;
        }>;
        __typename: string;
      };
      __typename: string;
    }>;
    __typename: string;
  };
  __typename: string;
}

export interface DiaryData {
  searchStudentDisciplines: Array<{
    studentId: string;
    disciplineId: string;
    studyPeriod: {
      endDate: string;
      id: string;
      name: string;
      startDate: string;
      status: string;
      archivedAt: string | null;
      __typename: string;
    };
    academicDifferenceDisciplines: Array<any> | null;
    discipline: {
      maxScore: number;
      code: string;
      studyHoursCount: number;
      archivedAt: string | null;
      suborganization: {
        id: string;
        organizationId: string;
        __typename: string;
      };
      teachers: Array<{
        user: {
          id: string;
          firstName: string;
          lastName: string;
          middleName: string;
          __typename: string;
        };
        __typename: string;
      }>;
      id: string;
      name: string;
      __typename: string;
    };
    disciplineAttendance: {
      percent: number;
      total: number;
      visited: number;
      __typename: string;
    };
    studentRecalculationScore: {
      academicDifferenceAbsoluteScore: number;
      __typename: string;
    } | null;
    academicDifferenceDisciplineGrade: string | null;
    learningGroup: {
      id: string;
      name: string;
      __typename: string;
    };
    scoreForAnsweredTasks: number;
    disciplineGrade: string | number | null;
    disciplineGrade_V2: string | null;
    retakeDisciplineGrade: string | null;
    maxScoreForAnsweredTasks: number;
    scoreForAnsweredRetakeTasks: number;
    retakeScore: number | null;
    hasRetake: boolean;
    __typename: string;
  }>;
  // Add these fields for lxpService.ts
  total_lessons?: number;
  attended_lessons?: number;
  total_scores?: number;
  average_grade?: number;
  study_group?: string;
}

export const signIn = async (credentials: SignInInput): Promise<string> => {
  const query = `
    query SignIn($input: SignInInput!) {
      signIn(input: $input) {
        user {
          id
          isLead
          __typename
        }
        accessToken
        __typename
      }
    }
  `;
  
  const variables = {
    input: credentials
  };
  
  try {
    const response = await axios.post(API_URL, { query, variables });
    return response.data.data.signIn.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("HTTP Error:", error.response.status);
      console.error(error.response.data);
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};

export const getUserData = async (token: string): Promise<UserData> => {
  const query = `
    query GetMe {
      getMe {
        avatar
        createdAt
        email
        firstName
        lastName
        id
        isLead
        roles
        phoneNumber
        legalDocumentsApprovedAt
        notificationsSettings {
          isPushDailyDigestOnEmail
          __typename
        }
        assignedSuborganizations {
          suborganization {
            name
            __typename
          }
          __typename
        }
        teacher {
          assignedDisciplines_V2 {
            discipline {
              name
              code
              studyPeriods {
                name
                startDate
                endDate
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `;
  
  const headers = { Authorization: `Bearer ${token}` };
  
  try {
    const response = await axios.post(API_URL, { query }, { headers });
    return response.data.data.getMe;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("HTTP Error:", error.response.status);
      console.error(error.response.data);
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};

export const getDiaryData = async (token: string, studentId: string): Promise<DiaryData> => {
  const query = `
    query SearchStudentDisciplines($input: SearchStudentDisciplinesInput!, $studyPeriodEndDate: String) {
      searchStudentDisciplines(input: $input) {
        studentId
        disciplineId
        studyPeriod {
          endDate
          id
          name
          startDate
          status
          archivedAt
          __typename
        }
        academicDifferenceDisciplines {
          id
          maxScore
          teachers {
            user {
              id
              firstName
              lastName
              middleName
              __typename
            }
            __typename
          }
          __typename
        }
        discipline {
          maxScore
          code
          studyHoursCount
          archivedAt
          suborganization {
            id
            organizationId
            __typename
          }
          teachers {
            user {
              id
              firstName
              lastName
              middleName
              __typename
            }
            __typename
          }
          id
          name
          __typename
        }
        disciplineAttendance {
          percent
          total
          visited
          __typename
        }
        studentRecalculationScore {
          academicDifferenceAbsoluteScore
          __typename
        }
        academicDifferenceDisciplineGrade
        learningGroup {
          id
          name
          __typename
        }
        scoreForAnsweredTasks
        disciplineGrade(studyPeriodEndDate: $studyPeriodEndDate)
        disciplineGrade_V2(studyPeriodEndDate: $studyPeriodEndDate)
        retakeDisciplineGrade
        maxScoreForAnsweredTasks
        scoreForAnsweredRetakeTasks
        retakeScore
        hasRetake
        __typename
      }
    }
  `;
  
  const variables = {
    input: {
      studentId: studentId
    },
    studyPeriodEndDate: "2025-06-29T21:00:00.000Z"
  };
  
  const headers = { 
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "apollographql-client-name": "web"
  };
  
  try {
    const response = await axios.post(API_URL, { 
      operationName: "SearchStudentDisciplines",
      query, 
      variables 
    }, { headers });
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("HTTP Error:", error.response.status);
      console.error(error.response.data);
    } else {
      console.error("Error:", error);
    }
    throw error;
  }
};
