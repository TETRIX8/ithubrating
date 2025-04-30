
import React from "react";
import { motion } from "framer-motion";
import { StudentRankProps } from "./StudentRankCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Book, ChevronLeft, User } from "lucide-react";
import RatingStars from "./RatingStars";

interface StudentProfileProps {
  student: StudentRankProps & { description?: string };
  onClose: () => void;
  isCurrentUser: boolean;
  onEdit?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, 
  onClose, 
  isCurrentUser,
  onEdit
}) => {
  const { firstName, lastName, avatarUrl, attendancePercent, scorePercent, averageGrade, description, studyGroup, rank } = student;
  
  // Calculate overall score
  const overallScore = (attendancePercent * 0.3) + (scorePercent * 0.3) + (averageGrade * 20 * 0.4);
  
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl p-6 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="flex items-center gap-2 hover:bg-indigo-50"
        >
          <ChevronLeft size={18} />
          <span>Назад</span>
        </Button>
        
        {isCurrentUser && onEdit && (
          <Button 
            onClick={onEdit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            Редактировать
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-3xl">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white shadow-md">
              #{rank}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <RatingStars 
              rating={averageGrade} 
              maxRating={5}
              size="lg"
              colorScheme={rank <= 3 ? (rank === 1 ? "gold" : rank === 2 ? "blue" : "purple") : "gold"}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {firstName} {lastName}
          </h2>
          
          {studyGroup && (
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Book size={16} />
              <span>Группа: {studyGroup}</span>
            </p>
          )}
          
          <div className="mt-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 font-semibold text-indigo-700 mb-2">
              <Award size={18} />
              <span>Общий рейтинг: {overallScore.toFixed(1)}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Посещаемость</span>
                  <span className="font-semibold">{attendancePercent}%</span>
                </div>
                <Progress value={attendancePercent} className="h-2" indicatorClassName={getScoreColor(attendancePercent)} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Баллы</span>
                  <span className="font-semibold">{scorePercent}%</span>
                </div>
                <Progress value={scorePercent} className="h-2" indicatorClassName={getScoreColor(scorePercent)} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Оценка</span>
                  <span className="font-semibold">{averageGrade.toFixed(1)}</span>
                </div>
                <Progress value={averageGrade * 20} className="h-2" indicatorClassName={getScoreColor(averageGrade * 20)} />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
              <User size={18} className="text-indigo-600" />
              <span>О студенте</span>
            </h3>
            
            <div className="bg-white/70 rounded-lg border border-gray-200 p-4">
              {description ? (
                <p className="text-gray-700">{description}</p>
              ) : (
                <p className="text-gray-500 italic">Описание не добавлено</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
