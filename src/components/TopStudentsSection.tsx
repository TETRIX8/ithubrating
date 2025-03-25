
import React from "react";
import { StudentRankProps } from "./StudentRankCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface TopStudentsSectionProps {
  students: StudentRankProps[];
}

const TopStudentsSection: React.FC<TopStudentsSectionProps> = ({ students }) => {
  const topThree = students.slice(0, 3);
  
  if (topThree.length < 3) {
    return null; // Don't show if we don't have at least 3 students
  }

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Second place */}
        <Card className="glass-card text-center py-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
          <div className="mb-4 inline-flex items-center justify-center">
            <Medal className="h-12 w-12 text-gray-400" />
          </div>
          <div className="relative">
            <Avatar className="h-20 w-20 mx-auto border-4 border-gray-200 group-hover:scale-110 transition-transform">
              <AvatarImage src={topThree[1]?.avatarUrl} alt={`${topThree[1]?.firstName} ${topThree[1]?.lastName}`} />
              <AvatarFallback className="text-xl">
                {topThree[1]?.firstName.charAt(0)}{topThree[1]?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -top-1 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
              2
            </div>
          </div>
          <h3 className="mt-4 font-medium text-lg">
            {topThree[1]?.firstName} {topThree[1]?.lastName}
          </h3>
          <div className="mt-2 flex justify-center gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
              {topThree[1]?.averageGrade.toFixed(1)}
            </span>
          </div>
        </Card>

        {/* First place */}
        <Card className="glass-card text-center py-8 relative overflow-hidden transform md:-translate-y-4 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
          <div className="mb-4 inline-flex items-center justify-center">
            <Trophy className="h-14 w-14 text-yellow-500" />
          </div>
          <div className="relative">
            <Avatar className="h-24 w-24 mx-auto border-4 border-yellow-200 group-hover:scale-110 transition-transform">
              <AvatarImage src={topThree[0]?.avatarUrl} alt={`${topThree[0]?.firstName} ${topThree[0]?.lastName}`} />
              <AvatarFallback className="text-2xl">
                {topThree[0]?.firstName.charAt(0)}{topThree[0]?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -top-1 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
              1
            </div>
          </div>
          <h3 className="mt-4 font-semibold text-xl">
            {topThree[0]?.firstName} {topThree[0]?.lastName}
          </h3>
          <div className="mt-2 flex justify-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 rounded-md text-sm">
              {topThree[0]?.averageGrade.toFixed(1)}
            </span>
          </div>
        </Card>

        {/* Third place */}
        <Card className="glass-card text-center py-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700 to-amber-600"></div>
          <div className="mb-4 inline-flex items-center justify-center">
            <Medal className="h-12 w-12 text-amber-700" />
          </div>
          <div className="relative">
            <Avatar className="h-20 w-20 mx-auto border-4 border-amber-200 group-hover:scale-110 transition-transform">
              <AvatarImage src={topThree[2]?.avatarUrl} alt={`${topThree[2]?.firstName} ${topThree[2]?.lastName}`} />
              <AvatarFallback className="text-xl">
                {topThree[2]?.firstName.charAt(0)}{topThree[2]?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -top-1 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
              3
            </div>
          </div>
          <h3 className="mt-4 font-medium text-lg">
            {topThree[2]?.firstName} {topThree[2]?.lastName}
          </h3>
          <div className="mt-2 flex justify-center gap-2">
            <span className="px-2 py-1 bg-amber-100 rounded-md text-sm">
              {topThree[2]?.averageGrade.toFixed(1)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TopStudentsSection;
