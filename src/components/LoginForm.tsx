import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess: (token: string) => void;
  onError: (error: Error) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Пожалуйста, введите email и пароль");
      return;
    }
    
    setIsLoading(true);
    
    try {
      localStorage.setItem("temp_password", password);
      
      const token = await signIn({ email, password });
      onSuccess(token);
    } catch (error: any) {
      localStorage.removeItem("temp_password");
      toast.error("Ошибка авторизации. Пожалуйста, проверьте email и пароль.");
      console.error("Login error:", error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-scale-in">
      <div className="glass-card rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-medium text-center mb-6">Вход в систему LXP</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium block text-gray-700">
              Электронная почта
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="name@example.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium block text-gray-700">
                Пароль
              </label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white rounded-lg px-4 py-3 font-medium transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
              </div>
            ) : (
              "Войти"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
