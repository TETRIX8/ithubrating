
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface SplashScreenProps {
  duration?: number;
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  duration = 5000, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, duration / 50);

    const timer = setTimeout(() => {
      clearInterval(interval);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="relative flex flex-col items-center justify-center gap-6 p-8 animate-float">
        <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-blue-400 animate-spin-slow" style={{ animationDirection: "reverse" }}></div>
          <div className="absolute inset-4 rounded-full border-b-4 border-blue-300 animate-spin-slow" style={{ animationDuration: "3s" }}></div>
          
          <div className="text-5xl font-bold text-white tracking-widest animate-pulse-soft">
            A-K
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wider animate-fade-in">
          A-K project
        </h1>
        
        <div className="w-64 h-2 bg-blue-200/30 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 text-blue-100 flex items-center gap-2">
          <Loader className="animate-spin h-4 w-4" />
          <span className="animate-pulse-soft">Loading experience</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full max-w-md mx-auto text-center">
        <div className="typing-demo text-blue-100 text-sm mx-auto w-64">
          Демонстрация работы API LXP
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
