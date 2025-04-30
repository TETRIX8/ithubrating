
import React, { useState } from "react";
import { Trophy, Award, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-mobile";
import RatingStars from "./RatingStars";

export interface StudentRankProps {
  rank: number;
  studentId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  attendancePercent: number;
  scorePercent: number;
  averageGrade: number;
  studyGroup?: string;
  description?: string; // Add this field for storing profile description
}

interface StudentRankCardProps extends StudentRankProps {
  onClick?: () => void; // Add click handler prop
}

const StudentRankCard: React.FC<StudentRankCardProps> = ({
  rank,
  studentId,
  firstName,
  lastName,
  avatarUrl,
  attendancePercent,
  scorePercent,
  averageGrade,
  studyGroup,
  onClick // Add this prop
}) => {
  const { isMobile } = useBreakpoint();
  const [showRating, setShowRating] = useState(false);
  
  // Calculate overall ranking score (weighted average)
  const overallScore = (attendancePercent * 0.3) + (scorePercent * 0.3) + (averageGrade * 20 * 0.4);
  
  // Get color based on rank
  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-yellow-50";
    if (rank === 2) return "bg-gray-400 text-gray-50";
    if (rank === 3) return "bg-amber-700 text-amber-50";
    return "bg-primary/10 text-primary";
  };
  
  // Determine badge and animation based on rank
  const getBadgeForRank = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className={`flex items-center justify-center w-6 h-6 rounded-full ${getRankColor(rank)} text-sm font-bold`}>{rank}</span>;
  };
  
  // Get initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  // Get color based on score for progress bars
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-emerald-400";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05, duration: 0.3 }}
      className="glass-card rounded-lg p-4 mb-4 transition-all hover:translate-y-[-2px] hover:shadow-lg cursor-pointer"
      onClick={onClick} // Add onClick handler
      whileHover={{ 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        scale: 1.01
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-8 h-8">
          {getBadgeForRank(rank)}
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20 cursor-pointer"
            onClick={() => setShowRating(!showRating)}>
            <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate text-gray-800">
            {firstName} {lastName}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <p className="text-gray-500 truncate">ID: {studentId}</p>
            {studyGroup && (
              <>
                <span className="text-gray-300">•</span>
                <p className="text-gray-500 truncate">Группа: {studyGroup}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
            <Award className="h-3.5 w-3.5 text-indigo-600" />
            <span className="font-bold text-indigo-600">{overallScore.toFixed(1)}</span>
          </Badge>
          <Badge className="sm:hidden flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-600 border-none">
            <span>{overallScore.toFixed(1)}</span>
          </Badge>
        </div>
      </div>
      
      {showRating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <RatingStars 
            rating={averageGrade} 
            maxRating={5} 
            size={isMobile ? "sm" : "md"}
            colorScheme={rank <= 3 ? (rank === 1 ? "gold" : rank === 2 ? "blue" : "purple") : "gold"}
          />
        </motion.div>
      )}
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Посещаемость</span>
            <span className="font-semibold">{attendancePercent}%</span>
          </div>
          <Progress value={attendancePercent} className="h-2" indicatorClassName={getScoreColor(attendancePercent)} />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Баллы</span>
            <span className="font-semibold">{scorePercent}%</span>
          </div>
          <Progress value={scorePercent} className="h-2" indicatorClassName={getScoreColor(scorePercent)} />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Оценка</span>
            <span className="font-semibold">{averageGrade.toFixed(1)}</span>
          </div>
          <Progress value={averageGrade * 20} className="h-2" indicatorClassName={getScoreColor(averageGrade * 20)} />
        </div>
      </div>
    </motion.div>
  );
};

export default StudentRankCard;
