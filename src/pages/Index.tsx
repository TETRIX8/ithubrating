import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import ApiResponse from "@/components/ApiResponse";
import Loading from "@/components/Loading";
import SplashScreen from "@/components/SplashScreen";
import LeaderboardHeader from "@/components/LeaderboardHeader";
import LeaderboardList from "@/components/LeaderboardList";
import TopStudentsSection from "@/components/TopStudentsSection";
import ConsentDialog from "@/components/ConsentDialog";
import ProfileOptions from "@/components/ProfileOptions";
import { getUserData, UserData, getDiaryData, DiaryData } from "@/utils/api";
import { StudentRankProps } from "@/components/StudentRankCard";
import { toast } from "sonner";
import { Github, Book, User, LogOut } from "lucide-react";
import { 
  processLxpData, 
  getLeaderboardData, 
  hasUserConsent, 
  saveUserConsent,
  getUserAuth,
  saveUserAuth,
  clearUserAuth,
  clearLeaderboardData,
  updateUserProfile
} from "@/services/lxpService";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type AppStep = "splash" | "login" | "loading" | "data" | "leaderboard" | "profileEdit";

const Index = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AppStep>("splash");
  const [students, setStudents] = useState<StudentRankProps[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear leaderboard data on initial load
  useEffect(() => {
    const clearData = async () => {
      try {
        // Clear the leaderboard data in Supabase
        await clearLeaderboardData();
        console.log("Leaderboard data cleared successfully");
      } catch (error) {
        console.error("Error clearing leaderboard data:", error);
      }
    };

    clearData();
  }, []);

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        // Always go to login step after splash screen
        const storedUserData = getUserAuth();
        
        if (storedUserData && storedUserData.token) {
          // If credentials exist, try to restore session
          restoreUserSession(storedUserData);
        } else {
          // Otherwise force login
          setStep("login");
        }
      }, 3000); // Splash screen time: 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const restoreUserSession = async (storedUser: any) => {
    try {
      console.log("Attempting to restore user session:", storedUser);
      setIsLoading(true);
      
      // Save token to localStorage for API calls
      if (storedUser.token) {
        localStorage.setItem("accessToken", storedUser.token);
        setAccessToken(storedUser.token);
        
        // Try to verify the token by fetching user data
        try {
          const freshUserData = await getUserData(storedUser.token);
          setUserData(freshUserData);
          setIsAuthenticated(true);
          
          // Fetch diary data as well
          const diaryData = await getDiaryData(storedUser.token, freshUserData.id);
          setDiaryData(diaryData);
          
          // Process user data into leaderboard
          if (hasUserConsent(freshUserData.id)) {
            await processLxpData(freshUserData, diaryData);
          } else {
            setShowConsentDialog(true);
          }
          
          // Show leaderboard with fresh data
          await loadLeaderboardData();
          setStep("leaderboard");
          toast.success("Сессия восстановлена успешно");
        } catch (error) {
          console.error("Failed to verify token:", error);
          setStep("login");
          clearUserAuth();
          localStorage.removeItem("accessToken");
          toast.error("Сессия истекла. Необходимо войти заново");
        }
      } else {
        setStep("login");
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      clearUserAuth();
      localStorage.removeItem("accessToken");
      setStep("login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const leaderboardData = await getLeaderboardData();
      
      // We're already getting properly formatted StudentRankProps objects from getLeaderboardData
      setStudents(leaderboardData);
    } catch (error) {
      console.error("Error loading leaderboard data:", error);
      toast.error("Ошибка при загрузке данных рейтинга");
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleLoginSuccess = async (token: string) => {
    setAccessToken(token);
    setIsLoading(true);
    setStep("loading");
    
    try {
      localStorage.setItem("accessToken", token);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user data
      const data = await getUserData(token);

      // Store the credentials - include the token and any password if provided
      const credentials: UserData & { token: string } = {
        ...data,
        token: token
      };
      
      // Check if we have password from login form in localStorage
      const tempPassword = localStorage.getItem("temp_password");
      if (tempPassword) {
        credentials.password = tempPassword;
        localStorage.removeItem("temp_password"); // Clear temporary storage
      }
      
      setUserData(data);
      setIsAuthenticated(true);
      
      // Save user authentication data with credentials
      saveUserAuth(credentials);
      
      console.log("Fetching diary data for student ID:", data.id);
      const diary = await getDiaryData(token, data.id);
      setDiaryData(diary);
      console.log("Diary data received:", diary);
      
      if (!hasUserConsent(data.id)) {
        setStep("data");
        setShowConsentDialog(true);
      } else {
        await processLxpData(data, diary);
        await loadLeaderboardData();
        setStep("leaderboard");
        toast.success("Авторизация успешна. Данные уже в рейтинге.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsAuthenticated(false);
      setStep("login");
      toast.error("Ошибка при получении данных пользователя");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentAccept = async () => {
    if (userData && diaryData) {
      saveUserConsent(userData.id);
      await processLxpData(userData, diaryData);
      await loadLeaderboardData();
      setStep("leaderboard");
      toast.success("Данные добавлены в рейтинг");
    }
    setShowConsentDialog(false);
  };

  const handleConsentDecline = () => {
    setShowConsentDialog(false);
    setStep("leaderboard");
    toast.info("Данные не будут добавлены в р��йтинг");
  };

  const handleLoginError = (error: Error) => {
    console.error("Login error:", error);
    toast.error("Ошибка авторизации");
    setIsAuthenticated(false);
  };

  const resetToLogin = () => {
    clearUserAuth();
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUserData(null);
    setDiaryData(null);
    setIsAuthenticated(false);
    setStep("login");
    toast.success("Вы вышли из системы");
  };

  const switchToLeaderboard = () => {
    if (!isAuthenticated) {
      setStep("login");
      toast.error("Необходимо авторизоваться для просмотра рейтинга");
    } else {
      setStep("leaderboard");
    }
  };

  const switchToLogin = () => {
    setStep("login");
  };

  const navigateToDiary = () => {
    if (userData && accessToken) {
      navigate("/diary");
    } else {
      toast.error("Необходимо авторизоваться");
      setStep("login");
    }
  };

  const handleProfileUpdate = async (updatedData: Partial<UserData>) => {
    if (!userData) return;
    
    try {
      // Update the UI first for better UX
      setUserData({
        ...userData,
        ...updatedData
      });
      
      // Update student data in the leaderboard
      const updatedStudents = students.map(student => {
        if (student.studentId === userData.studentId) {
          return {
            ...student,
            firstName: userData.firstName,
            lastName: updatedData.lastName || student.lastName,
            avatarUrl: updatedData.avatar || student.avatarUrl,
            description: updatedData.description
          };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      
      // Update in Supabase and process data for leaderboard
      if (updatedData.lastName || updatedData.avatar) {
        await updateUserProfile(userData.studentId!, {
          lastName: updatedData.lastName,
          avatarUrl: updatedData.avatar,
          description: updatedData.description
        });
        
        // Refresh leaderboard data after profile update
        await loadLeaderboardData();
      }
      
      setStep("leaderboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Ошибка при обновлении профиля");
    }
  };

  const renderContent = () => {
    switch (step) {
      case "splash":
        return <SplashScreen onComplete={() => {
          if (isAuthenticated) {
            setStep("leaderboard");
          } else {
            setStep("login");
          }
        }} />;
      case "login":
        return (
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Авторизация в системе LXP
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Войдите, чтобы просмотреть свои данные и добавить себя в рейтинг студентов
            </p>
            <div className="glass-card p-8 rounded-2xl max-w-md mx-auto shadow-xl bg-white/80 backdrop-blur-md border border-white/50">
              <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
            </div>
          </div>
        );
      case "loading":
        return <Loading />;
      case "data":
        return userData ? (
          <ProfileOptions 
            userData={userData} 
            onLogout={resetToLogin} 
            onUpdate={handleProfileUpdate}
          />
        ) : null;
      case "leaderboard":
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          setStep("login");
          return (
            <div className="text-center animate-fade-in">
              <h1 className="text-3xl font-bold mb-4">Необходима авторизация</h1>
              <p className="text-gray-600 mb-6">
                Для доступа к рейтингу успеваемости необходимо войти в систему
              </p>
              <Button 
                onClick={switchToLogin}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-6 py-3"
              >
                Авторизоваться
              </Button>
            </div>
          );
        }
        
        return (
          <>
            <LeaderboardHeader 
              isAuthenticated={isAuthenticated} 
              onLoginClick={switchToLogin}
            />
            
            {students.length > 0 && (
              <TopStudentsSection students={students} />
            )}
            
            <LeaderboardList 
              students={students} 
              isLoading={isLoadingLeaderboard} 
              currentUserId={userData?.studentId}
              onEditProfile={() => setStep("data")}
            />
            
            {students.length === 0 && !isLoadingLeaderboard && (
              <div className="glass-card text-center mt-8 p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50">
                <p className="text-muted-foreground mb-6">
                  Пока нет данных в рейтинге. Войдите в систему, чтобы добавить себя!
                </p>
                <Button
                  onClick={switchToLogin}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-6 py-3 hover:shadow-lg hover:translate-y-[-2px] transition-all"
                >
                  Авторизоваться
                </Button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-indigo-50/30">
      <header className="py-4 px-8 backdrop-blur-md bg-white/80 sticky top-0 z-10 shadow-sm border-b border-indigo-100/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent hidden md:block">
              Рейтинг студентов LXP
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {userData && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      {userData.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={`${userData.firstName} ${userData.lastName || ''}`} 
                          className="h-8 w-8 rounded-full ring-2 ring-primary/20"
                        />
                      ) : (
                        <User size={20} className="text-primary" />
                      )}
                      <span className="hidden sm:inline font-medium">{userData.firstName} {userData.lastName || ''}</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 rounded-xl shadow-lg">
                  <div className="p-4 bg-gradient-to-b from-indigo-50 to-white rounded-t-xl">
                    <div className="flex items-center gap-3 mb-3">
                      {userData.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={`${userData.firstName} ${userData.lastName || ''}`} 
                          className="h-12 w-12 rounded-full ring-2 ring-white/80"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg ring-2 ring-white/80">
                          {userData.firstName.charAt(0)}{userData.lastName?.charAt(0) || ''}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{userData.firstName} {userData.lastName || ''}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-white hover:bg-indigo-50" onClick={() => navigate("/diary")}>
                        <Book className="mr-2 h-4 w-4 text-indigo-600" />
                        <span>Дневник</span>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-white hover:bg-red-50 text-red-500 hover:text-red-600" onClick={resetToLogin}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Выйти</span>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <a 
              href="https://github.com/TETRIX8/lxpapi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            
            {!isAuthenticated && step !== "login" && step !== "splash" && (
              <Button
                onClick={switchToLogin}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <footer className="py-8 px-8 text-center bg-gradient-to-b from-transparent to-blue-50/80">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm">
            Рейтинг успеваемости студентов LXP &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      
      <ConsentDialog 
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    </div>
  );
};

export default Index;
