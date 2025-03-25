
import React from "react";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Загрузка" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-blue-400 animate-spin-slow" style={{ animationDirection: "reverse" }}></div>
        <div className="absolute inset-4 rounded-full border-b-2 border-blue-300 animate-spin-slow" style={{ animationDuration: "2s" }}></div>
      </div>
      <div className="flex items-center mt-3">
        <span className="text-primary text-lg font-medium">{text}</span>
        <span className="loader-dot"></span>
        <span className="loader-dot"></span>
        <span className="loader-dot"></span>
      </div>
      <div className="mt-3 max-w-xs">
        <div className="typing-demo text-gray-600 text-sm">
          Демонстрация работы API LXP
        </div>
      </div>
    </div>
  );
};

export default Loading;
