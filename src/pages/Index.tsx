
import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import ApiResponse from "@/components/ApiResponse";
import Loading from "@/components/Loading";
import { getUserData, UserData } from "@/utils/api";
import { toast } from "sonner";

const Index = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"login" | "loading" | "data">("login");

  const handleLoginSuccess = async (token: string) => {
    setAccessToken(token);
    setIsLoading(true);
    setStep("loading");
    
    try {
      // Artificial delay to show the loading animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = await getUserData(token);
      setUserData(data);
      setStep("data");
      toast.success("Авторизация успешна");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setStep("login");
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
    setAccessToken(null);
    setUserData(null);
    setStep("login");
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
            <span className="text-lg font-medium">LXP API Demo</span>
          </div>
          
          {step === "data" && (
            <button
              onClick={resetToLogin}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Выйти
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-7xl mx-auto">
          {step === "login" && (
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Демонстрация работы API LXP
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Войдите в систему, чтобы увидеть работу GraphQL API сервиса LXP
              </p>
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            {step === "login" && (
              <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
            )}
            
            {step === "loading" && <Loading />}
            
            {step === "data" && userData && accessToken && (
              <ApiResponse userData={userData} accessToken={accessToken} />
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <p>
            Демонстрация работы с API сервиса LXP &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
