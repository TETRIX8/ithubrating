import React from "react";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Загрузка" }) => {
  // Инлайн-стили для анимаций
  const styles = {
    spinSlow: {
      animation: "spin-slow 3s linear infinite",
    },
    spinSlowReverse: {
      animation: "spin-slow 3s linear infinite reverse",
    },
    spinSlowDouble: {
      animation: "spin-slow 2s linear infinite",
    },
    bounce: {
      animation: "bounce 0.6s infinite",
    },
    bounceDelay1: {
      animation: "bounce 0.6s infinite 0.1s",
    },
    bounceDelay2: {
      animation: "bounce 0.6s infinite 0.2s",
    },
    slideUp: {
      animation: "slide-up 0.8s ease-out forwards",
    },
    fadeInDelay: {
      animation: "fade-in-delay 1.5s ease-out forwards",
    },
    gradientText: {
      background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {/* Анимированные круги */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-t-3 border-primary"
          style={styles.spinSlow}
        ></div>
        <div
          className="absolute inset-2 rounded-full border-r-3 border-blue-400"
          style={styles.spinSlowReverse}
        ></div>
        <div
          className="absolute inset-4 rounded-full border-b-3 border-blue-300"
          style={styles.spinSlowDouble}
        ></div>
      </div>

      {/* Основной текст с точками */}
      <div className="flex items-center mt-3">
        <span className="text-primary text-lg font-medium">{text}</span>
        <span
          className="w-2 h-2 rounded-full bg-blue-500 ml-1"
          style={styles.bounce}
        ></span>
        <span
          className="w-2 h-2 rounded-full bg-blue-500 ml-1"
          style={styles.bounceDelay1}
        ></span>
        <span
          className="w-2 h-2 rounded-full bg-blue-500 ml-1"
          style={styles.bounceDelay2}
        ></span>
      </div>

      {/* Анимированный заголовок рейтинга */}
      <div className="mt-4 overflow-hidden">
        <h2
          className="text-2xl font-bold"
          style={{ ...styles.gradientText, ...styles.slideUp }}
        >
          Рейтинг самых лучших учеников Ithub
        </h2>
      </div>

      {/* Демо текст */}
      <div className="mt-3 max-w-xs mx-auto">
        <div
          className="text-gray-600 text-sm"
          style={styles.fadeInDelay}
        >
          Демонстрация работы API LXP
        </div>
      </div>

      {/* Инлайн-определение анимаций */}
      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in-delay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
