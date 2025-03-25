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
  avatar: string;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  isLead: boolean;
  roles: string[];
  phoneNumber: string;
  legalDocumentsApprovedAt: string;
  notificationsSettings: {
    isPushDailyDigestOnEmail: boolean;
    __typename: string;
  };
  assignedSuborganizations: {
    suborganization: {
      name: string;
      __typename: string;
    };
    __typename: string;
  }[];
  teacher: {
    assignedDisciplines_V2: {
      discipline: {
        name: string;
        code: string;
        studyPeriods: {
          name: string;
          startDate: string;
          endDate: string;
          __typename: string;
        }[];
        __typename: string;
      };
      __typename: string;
    }[];
    __typename: string;
  };
  __typename: string;
}

export interface DiaryData {
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
  discipline: {
    maxScore: number;
    code: string;
    studyHoursCount: number;
    archivedAt: string | null;
    id: string;
    name: string;
    teachers: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        middleName: string;
        __typename: string;
      };
      __typename: string;
    }[];
    __typename: string;
  };
  disciplineAttendance: {
    percent: number;
    total: number;
    visited: number;
    __typename: string;
  };
  scoreForAnsweredTasks: number;
  disciplineGrade: string;
  disciplineGrade_V2: string;
  maxScoreForAnsweredTasks: number;
  hasRetake: boolean;
  retakeScore: number | null;
  __typename: string;
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

export const getDiaryData = async (token: string, userId: string): Promise<DiaryData[]> => {
  const query = `
    query SearchStudentDisciplinesForDisciplinesTableWithPeriod($input: SearchStudentDisciplinesInput!, $studyPeriodEndDate: String) {
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
        discipline {
          maxScore
          code
          studyHoursCount
          archivedAt
          id
          name
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
        disciplineAttendance {
          percent
          total
          visited
          __typename
        }
        scoreForAnsweredTasks
        disciplineGrade(studyPeriodEndDate: $studyPeriodEndDate)
        disciplineGrade_V2(studyPeriodEndDate: $studyPeriodEndDate)
        maxScoreForAnsweredTasks
        retakeScore
        hasRetake
        __typename
      }
    }
  `;
  
  const variables = {
    input: {
      studentId: userId
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
      operationName: "SearchStudentDisciplinesForDisciplinesTableWithPeriod",
      query, 
      variables 
    }, { headers });
    
    return response.data.data.searchStudentDisciplines || [];
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
