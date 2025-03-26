
import React from "react";
import { Trophy, Award, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-mobile";

export interface StudentRankProps {
  rank: number;
  studentId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  attendancePercent: number;
  scorePercent: number;
  averageGrade: number;
}

const StudentRankCard: React.FC<StudentRankProps> = ({
  rank,
  studentId,
  firstName,
  lastName,
  avatarUrl,
  attendancePercent,
  scorePercent,
  averageGrade,
}) => {
  const { isMobile } = useBreakpoint();
  
  // Calculate overall ranking score (weighted average)
  const overallScore = (attendancePercent * 0.3) + (scorePercent * 0.3) + (averageGrade * 20 * 0.4);
  
  // Determine badge and animation based on rank
  const getBadgeForRank = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="text-lg font-bold">{rank}</span>;
  };
  
  // Set animation delay based on rank for staggered entrance
  const animationDelay = `${(rank - 1) * 100}ms`;
  
  // Get initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05, duration: 0.3 }}
      className="neo-blur rounded-lg p-4 mb-4 transition-all hover:translate-y-[-2px] hover:shadow-lg"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-8 h-8">
          {getBadgeForRank(rank)}
        </div>
        
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={avatarUrl} alt={`${firstName} ${}`} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">ID: {studentId}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-2 py-1">
            <Award className="h-3.5 w-3.5" />
            <span>{overallScore.toFixed(1)}</span>
          </Badge>
          <Badge className="sm:hidden flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary border-none">
            <span>{overallScore.toFixed(1)}</span>
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Посещаемость</span>
            <span className="font-medium">{attendancePercent}%</span>
          </div>
          <Progress value={attendancePercent} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Баллы</span>
            <span className="font-medium">{scorePercent}%</span>
          </div>
          <Progress value={scorePercent} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Оценка</span>
            <span className="font-medium">{averageGrade.toFixed(1)}</span>
          </div>
          <Progress value={averageGrade * 20} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
};

export default StudentRankCard;
