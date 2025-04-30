
import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import UserCounter from "./UserCounter";

const LeaderboardHeader = () => {
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
          <Award className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3 text-gradient">
          Рейтинг успеваемости
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Лучшие студенты по показателям успеваемости и обучению в системе LXP
        </p>
        
        <div className="flex justify-center mt-6">
          <UserCounter />
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardHeader;
