
import React from "react";
import { StudentRankProps } from "./StudentRankCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";
import { useBreakpoint } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface TopStudentsSectionProps {
  students: StudentRankProps[];
}

const TopStudentsSection: React.FC<TopStudentsSectionProps> = ({ students }) => {
  const topThree = students.slice(0, 3);
  const { isMobile, isTablet } = useBreakpoint();
  
  if (topThree.length < 3) {
    return null; // Don't show if we don't have at least 3 students
  }

  return (
    <div className="mb-12 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent rounded-3xl" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4 py-8">
        {/* Second place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.2,
            type: "spring",
            bounce: 0.4
          }}
        >
          <Card className="glass-card text-center py-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <motion.div 
              className="mb-4 inline-flex items-center justify-center"
              animate={{ 
                y: [0, -8, 0],
                rotateZ: [0, -5, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Medal className="h-12 w-12 text-gray-400 drop-shadow-md" />
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Avatar className="h-20 w-20 mx-auto border-4 border-gray-200 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <AvatarImage src={topThree[1]?.avatarUrl} alt={`${topThree[1]?.firstName} ${topThree[1]?.lastName}`} />
                  <AvatarFallback className="text-xl bg-gray-200">
                    {topThree[1]?.firstName.charAt(0)}{topThree[1]?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="absolute -right-1 -top-1 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                2
              </div>
            </div>
            <h3 className="mt-4 font-medium text-lg">
              {topThree[1]?.firstName} {topThree[1]?.lastName}
            </h3>
            <div className="mt-2 flex justify-center gap-2">
              <motion.span 
                className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {topThree[1]?.averageGrade.toFixed(1)}
              </motion.span>
            </div>
          </Card>
        </motion.div>

        {/* First place */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            bounce: 0.5
          }}
        >
          <Card className="glass-card text-center py-8 relative overflow-hidden transform md:-translate-y-4 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
            <motion.div 
              className="absolute inset-0"
              initial={{ background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)" }}
              animate={{ 
                background: [
                  "radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
                  "radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%)",
                  "radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)"
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="mb-4 inline-flex items-center justify-center"
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-14 w-14 text-yellow-500 drop-shadow-lg" />
              </motion.div>
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-200 shadow-lg ring-4 ring-yellow-100/50">
                  <AvatarImage src={topThree[0]?.avatarUrl} alt={`${topThree[0]?.firstName} ${topThree[0]?.lastName}`} />
                  <AvatarFallback className="text-2xl bg-yellow-100">
                    {topThree[0]?.firstName.charAt(0)}{topThree[0]?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div 
                className="absolute -right-1 -top-1 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white shadow-lg text-lg font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                1
              </motion.div>
            </div>
            <motion.h3 
              className="mt-4 font-semibold text-xl"
              animate={{ 
                background: ["linear-gradient(to right, #f59f0b, #fbbf24)", "linear-gradient(to right, #f59f0b, #fbbf24)"]
              }}
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {topThree[0]?.firstName} {topThree[0]?.lastName}
            </motion.h3>
            <div className="mt-2 flex justify-center gap-2">
              <motion.span 
                className="px-4 py-2 bg-yellow-100 rounded-full text-sm font-semibold text-yellow-800 shadow-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {topThree[0]?.averageGrade.toFixed(1)}
              </motion.span>
            </div>
            
            <motion.div 
              className="absolute -z-10 inset-0"
              initial={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 75%)" }}
              animate={{ 
                backgroundImage: [
                  "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 75%)",
                  "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.25) 0%, transparent 75%)",
                  "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 75%)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </Card>
        </motion.div>

        {/* Third place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.4,
            type: "spring",
            bounce: 0.4
          }}
        >
          <Card className="glass-card text-center py-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700 to-amber-600"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <motion.div 
              className="mb-4 inline-flex items-center justify-center"
              animate={{ 
                y: [0, -8, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            >
              <Medal className="h-12 w-12 text-amber-700 drop-shadow-md" />
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Avatar className="h-20 w-20 mx-auto border-4 border-amber-200 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <AvatarImage src={topThree[2]?.avatarUrl} alt={`${topThree[2]?.firstName} ${topThree[2]?.lastName}`} />
                  <AvatarFallback className="text-xl bg-amber-100">
                    {topThree[2]?.firstName.charAt(0)}{topThree[2]?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="absolute -right-1 -top-1 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                3
              </div>
            </div>
            <h3 className="mt-4 font-medium text-lg">
              {topThree[2]?.firstName} {topThree[2]?.lastName}
            </h3>
            <div className="mt-2 flex justify-center gap-2">
              <motion.span 
                className="px-3 py-1.5 bg-amber-100 rounded-full text-sm font-medium text-amber-800 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {topThree[2]?.averageGrade.toFixed(1)}
              </motion.span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TopStudentsSection;
