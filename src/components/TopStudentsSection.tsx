
import React from "react";
import { StudentRankProps } from "./StudentRankCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-100/30 to-transparent rounded-3xl" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4 py-8">
        {/* Second place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glass-card text-center py-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <div className="mb-4 inline-flex items-center justify-center">
              <Medal className="h-12 w-12 text-gray-400 drop-shadow-md" />
            </div>
            <div className="relative">
              <Avatar className="h-20 w-20 mx-auto border-4 border-gray-200 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <AvatarImage src={topThree[1]?.avatarUrl} alt={`${topThree[1]?.firstName} ${topThree[1]?.lastName}`} />
                <AvatarFallback className="text-xl bg-gray-200">
                  {topThree[1]?.firstName.charAt(0)}{topThree[1]?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                2
              </div>
            </div>
            <h3 className="mt-4 font-medium text-lg">
              {topThree[1]?.firstName} {topThree[1]?.lastName}
            </h3>
            <div className="mt-2 flex justify-center gap-2">
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                {topThree[1]?.averageGrade.toFixed(1)}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* First place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card text-center py-8 relative overflow-hidden transform md:-translate-y-4 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-yellow-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <div className="mb-4 inline-flex items-center justify-center animate-float">
              <Trophy className="h-14 w-14 text-yellow-500 drop-shadow-lg" />
            </div>
            <div className="relative">
              <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-200 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AvatarImage src={topThree[0]?.avatarUrl} alt={`${topThree[0]?.firstName} ${topThree[0]?.lastName}`} />
                <AvatarFallback className="text-2xl bg-yellow-100">
                  {topThree[0]?.firstName.charAt(0)}{topThree[0]?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white shadow-lg text-lg font-bold">
                1
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-xl">
              {topThree[0]?.firstName} {topThree[0]?.lastName}
            </h3>
            <div className="mt-2 flex justify-center gap-2">
              <span className="px-4 py-2 bg-yellow-100 rounded-full text-sm font-semibold text-yellow-800 shadow-sm">
                {topThree[0]?.averageGrade.toFixed(1)}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Third place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="glass-card text-center py-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700 to-amber-600"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <div className="mb-4 inline-flex items-center justify-center">
              <Medal className="h-12 w-12 text-amber-700 drop-shadow-md" />
            </div>
            <div className="relative">
              <Avatar className="h-20 w-20 mx-auto border-4 border-amber-200 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <AvatarImage src={topThree[2]?.avatarUrl} alt={`${topThree[2]?.firstName} ${topThree[2]?.lastName}`} />
                <AvatarFallback className="text-xl bg-amber-100">
                  {topThree[2]?.firstName.charAt(0)}{topThree[2]?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -top-1 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                3
              </div>
            </div>
            <h3 className="mt-4 font-medium text-lg">
              {topThree[2]?.firstName} {topThree[2]?.lastName}
            </h3>
            <div className="mt-2 flex justify-center gap-2">
              <span className="px-3 py-1.5 bg-amber-100 rounded-full text-sm font-medium text-amber-800 shadow-sm">
                {topThree[2]?.averageGrade.toFixed(1)}
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TopStudentsSection;
