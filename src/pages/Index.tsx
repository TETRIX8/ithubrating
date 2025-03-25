import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import ApiResponse from "@/components/ApiResponse";
import Loading from "@/components/Loading";
import SplashScreen from "@/components/SplashScreen";
import LeaderboardHeader from "@/components/LeaderboardHeader";
import LeaderboardList from "@/components/LeaderboardList";
import TopStudentsSection from "@/components/TopStudentsSection";
import { getUserData, UserData, getDiaryData, DiaryData } from "@/utils/api";
import { StudentRankProps } from "@/components/StudentRankCard";
import { toast } from "sonner";
import { Github, Book } from "lucide-react";
import { processLxpData, getLeaderboardData } from "@/services/lxpService";

type AppStep = "splash" | "login" | "loading" | "data" | "leaderboard";

const Index = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AppStep>("splash");
  const [students, setStudents] = useState<StudentRankProps[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        setStep("leaderboard");
        loadLeaderboardData();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const loadLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const leaderboardData = await getLeaderboardData();
      
      const rankedStudents = leaderboardData.map((student, index) => ({
        ...student,
        rank: index + 1
      }));
      
      setStudents(rankedStudents);
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
      
      const data = await getUserData(token);
      setUserData(data);
      
      localStorage.setItem("studentId", data.id);
      
      console.log("Fetching diary data for student ID:", data.id);
      const diary = await getDiaryData(token, data.id);
      setDiaryData(diary);
      console.log("Diary data received:", diary);
      
      await processLxpData(data, diary);
      
      await loadLeaderboardData();
      
      setStep("data");
      toast.success("Авторизация успешна. Данные добавлены в рейтинг.");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setStep("leaderboard");
      toast.error("Ошибка при получении данных пользователя");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: Error) => {
    console.error("Login error:", error);
    toast.error("Ошибка авторизации");
  };

  const resetToLogin = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("studentId");
    setAccessToken(null);
    setUserData(null);
    setDiaryData(null);
    setStep("leaderboard");
  };

  const switchToLeaderboard = () => {
    setStep("leaderboard");
  };

  const switchToLogin = () => {
    setStep("login");
  };

  const renderContent = () => {
    switch (step) {
      case "splash":
        return <SplashScreen onComplete={() => setStep("leaderboard")} />;
      case "login":
        return (
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Авторизация в системе LXP
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Войдите, чтобы просмотреть свои данные и добавить себя в рейтинг студентов
            </p>
            <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </div>
        );
      case "loading":
        return <Loading />;
      case "data":
        return userData && accessToken ? (
          <ApiResponse userData={userData} accessToken={accessToken} />
        ) : null;
      case "leaderboard":
        return (
          <>
            <LeaderboardHeader />
            
            {students.length > 0 && (
              <TopStudentsSection students={students} />
            )}
            
            <LeaderboardList 
              students={students} 
              isLoading={isLoadingLeaderboard} 
            />
            
            {students.length === 0 && !isLoadingLeaderboard && (
              <div className="text-center mt-8">
                <p className="text-muted-foreground mb-4">
                  Пока нет данных в рейтинге. Войдите в систему, чтобы добавить себя!
                </p>
                <button
                  onClick={switchToLogin}
                  className="bg-primary text-white rounded-lg px-4 py-2.5 hover:bg-primary/90 transition-colors"
                >
                  Авторизоваться
                </button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-medium">Рейтинг студентов LXP</span>
          </div>
          
          <div className="flex items-center gap-4">
            {step === "data" && (
              <button
                onClick={() => navigate("/diary")}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Book size={20} />
                <span className="hidden sm:inline">Дневник</span>
              </button>
            )}
            
            <a 
              href="https://github.com/TETRIX8/lxpapi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            
            {step === "leaderboard" && !userData && (
              <button
                onClick={switchToLogin}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Войти
              </button>
            )}
            
            {step === "data" && (
              <button
                onClick={resetToLogin}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Выйти
              </button>
            )}
            
            {step !== "leaderboard" && step !== "splash" && (
              <button
                onClick={switchToLeaderboard}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Рейтинг
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <p>
            Рейтинг успеваемости студентов LXP &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
