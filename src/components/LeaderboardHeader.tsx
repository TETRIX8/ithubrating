
import React from "react";
import { Trophy, Medal, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LeaderboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Рейтинг успеваемости
        </h1>
        <p className="text-muted-foreground">
          Лучшие студенты текущего семестра по успеваемости, баллам и посещаемости
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardContent className="flex items-center p-4">
            <Trophy className="h-8 w-8 mr-4 text-blue-500" />
            <div>
              <h3 className="font-medium">Успеваемость</h3>
              <p className="text-sm text-muted-foreground">Средняя оценка</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardContent className="flex items-center p-4">
            <Medal className="h-8 w-8 mr-4 text-amber-500" />
            <div>
              <h3 className="font-medium">Баллы за задания</h3>
              <p className="text-sm text-muted-foreground">% от максимума</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-l-4 border-l-green-500">
          <CardContent className="flex items-center p-4">
            <Star className="h-8 w-8 mr-4 text-green-500" />
            <div>
              <h3 className="font-medium">Посещаемость</h3>
              <p className="text-sm text-muted-foreground">% посещенных занятий</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
