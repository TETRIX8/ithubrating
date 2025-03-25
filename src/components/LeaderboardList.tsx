
import React from "react";
import StudentRankCard, { StudentRankProps } from "./StudentRankCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardListProps {
  students: StudentRankProps[];
  isLoading: boolean;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Нет доступных данных о студентах</p>
      </Card>
    );
  }

  return (
    <div>
      {students.map((student) => (
        <StudentRankCard key={student.studentId} {...student} />
      ))}
    </div>
  );
};

export default LeaderboardList;
