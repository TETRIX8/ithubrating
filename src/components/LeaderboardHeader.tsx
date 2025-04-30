
import React from "react";
import { motion } from "framer-motion";
import { Award, LockKeyhole } from "lucide-react";
import UserCounter from "./UserCounter";
import { Button } from "@/components/ui/button";

interface LeaderboardHeaderProps {
  isAuthenticated: boolean;
  onLoginClick?: () => void;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({ 
  isAuthenticated, 
  onLoginClick 
}) => {
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4 shadow-lg">
          {isAuthenticated ? (
            <Award className="h-6 w-6 text-purple-600" />
          ) : (
            <LockKeyhole className="h-6 w-6 text-amber-600" />
          )}
        </div>
        <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
          Рейтинг успеваемости
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Лучшие студенты по показателям успеваемости и обучению в системе LXP
        </p>

        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="glass-card p-6 max-w-xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-purple-100">
              <h3 className="text-xl font-medium mb-3 text-purple-700">Необходима авторизация</h3>
              <p className="text-gray-600 mb-4">
                Для доступа к рейтингу успеваемости необходимо авторизоваться в системе LXP
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all"
                onClick={onLoginClick}
              >
                Авторизоваться
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-center mt-6">
          <UserCounter />
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardHeader;
