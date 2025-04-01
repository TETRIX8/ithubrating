
import React from "react";
import StudentRankCard, { StudentRankProps } from "./StudentRankCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardListProps {
  students: StudentRankProps[];
  isLoading: boolean;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card key={index} className="p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-transparent shimmer"></div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px] max-w-full" />
                  <Skeleton className="h-4 w-[200px] max-w-full" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="space-y-2 hidden sm:block">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="space-y-2 hidden sm:block">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
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
        {students.map((student, index) => (
          <motion.div
            key={student.studentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.08,
              type: "spring",
              stiffness: 100 
            }}
          >
            <StudentRankCard {...student} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaderboardList;
