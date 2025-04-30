import React, { useState } from "react";
import StudentRankCard, { StudentRankProps } from "./StudentRankCard";
import StudentProfile from "./StudentProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Globe, School } from "lucide-react";
import LeaderboardLoading from "./LeaderboardLoading";

interface LeaderboardListProps {
  students: StudentRankProps[];
  isLoading: boolean;
  currentUserId?: string;
  onEditProfile?: () => void;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ 
  students, 
  isLoading,
  currentUserId,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState<string>("overall");
  const [selectedStudent, setSelectedStudent] = useState<StudentRankProps | null>(null);
  
  // Group students by their studyGroup (if present)
  const groupedStudents = students.reduce((acc, student) => {
    const group = student.studyGroup || "Неизвестная группа";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(student);
    return acc;
  }, {} as Record<string, StudentRankProps[]>);
  
  // Sort each group by the same ranking logic
  Object.keys(groupedStudents).forEach(group => {
    groupedStudents[group] = [...groupedStudents[group]].sort((a, b) => {
      const scoreA = (a.attendancePercent * 0.3) + (a.scorePercent * 0.3) + (a.averageGrade * 20 * 0.4);
      const scoreB = (b.attendancePercent * 0.3) + (b.scorePercent * 0.3) + (b.averageGrade * 20 * 0.4);
      return scoreB - scoreA;
    }).map((student, index) => ({
      ...student,
      rank: index + 1 // Recalculate rank within group
    }));
  });
  
  const renderStudentsList = (studentsList: StudentRankProps[]) => {
    if (studentsList.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Нет доступных данных о студентах</p>
          </Card>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {studentsList.map((student, index) => (
            <motion.div
              key={student.studentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: Math.min(index * 0.08, 1.5), // Cap the delay for better performance with large lists
                type: "spring",
                stiffness: 100 
              }}
            >
              <StudentRankCard 
                {...student} 
                onClick={() => setSelectedStudent(student)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (isLoading) {
    return <LeaderboardLoading />;
  }

  // If a student is selected, show their profile
  if (selectedStudent) {
    return (
      <StudentProfile 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        isCurrentUser={currentUserId === selectedStudent.studentId}
        onEdit={currentUserId === selectedStudent.studentId ? onEditProfile : undefined}
      />
    );
  }

  const groupNames = Object.keys(groupedStudents).sort();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[400px] mb-6">
          <TabsTrigger value="overall" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Общий</span>
          </TabsTrigger>
          
          {groupNames.slice(0, 3).map(group => (
            <TabsTrigger key={group} value={group} className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span className="truncate">{group}</span>
            </TabsTrigger>
          ))}
          
          {groupNames.length > 3 && (
            <TabsTrigger value="more-groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Еще...</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Overall ranking tab */}
        <TabsContent value="overall" className="space-y-4">
          <h2 className="text-xl font-medium mb-4">Общий рейтинг студентов</h2>
          {renderStudentsList(students)}
        </TabsContent>
        
        {/* Group tabs */}
        {groupNames.map(group => (
          <TabsContent key={group} value={group} className="space-y-4">
            <h2 className="text-xl font-medium mb-4">Рейтинг студентов: {group}</h2>
            {renderStudentsList(groupedStudents[group])}
          </TabsContent>
        ))}
        
        {/* More groups tab */}
        {groupNames.length > 3 && (
          <TabsContent value="more-groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupNames.slice(3).map(group => (
                <Card 
                  key={group} 
                  className="p-4 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => setActiveTab(group)}
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    {group}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {groupedStudents[group].length} студентов
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
};

export default LeaderboardList;
