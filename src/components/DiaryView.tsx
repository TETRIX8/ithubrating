
import React, { useState } from "react";
import { DiaryData } from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DiaryViewProps {
  diaryData: DiaryData[] | null;
  isLoading: boolean;
}

const DiaryView: React.FC<DiaryViewProps> = ({ diaryData, isLoading }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  
  // Get unique study periods
  const studyPeriods = React.useMemo(() => {
    if (!diaryData) return [];
    
    const periods = diaryData.map(entry => entry.studyPeriod.name);
    return [...new Set(periods)];
  }, [diaryData]);
  
  // Filter disciplines by selected period
  const filteredDisciplines = React.useMemo(() => {
    if (!diaryData) return [];
    
    if (!selectedPeriod) {
      // If no period is selected, select the first one by default
      if (studyPeriods.length > 0 && !selectedPeriod) {
        setSelectedPeriod(studyPeriods[0]);
      }
      return diaryData;
    }
    
    return diaryData.filter(entry => entry.studyPeriod.name === selectedPeriod);
  }, [diaryData, selectedPeriod, studyPeriods]);

  // Function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  
  // Calculate grade percentage
  const calculateGradePercentage = (score: number, maxScore: number) => {
    if (maxScore === 0) return 0;
    return (score / maxScore) * 100;
  };
  
  // Get teacher name
  const getTeacherName = (discipline: DiaryData["discipline"]) => {
    if (!discipline.teachers || discipline.teachers.length === 0) {
      return "Не назначен";
    }
    
    const teacher = discipline.teachers[0].user;
    return `${teacher.lastName} ${teacher.firstName.charAt(0)}. ${teacher.middleName ? teacher.middleName.charAt(0) + '.' : ''}`;
  };
  
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl animate-pulse">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!diaryData || diaryData.length === 0) {
    return (
      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Дневник успеваемости</CardTitle>
            <CardDescription>Ваши учебные дисциплины и оценки</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">Нет данных о дисциплинах</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Дневник успеваемости</CardTitle>
          <CardDescription>Ваши учебные дисциплины и оценки</CardDescription>
        </CardHeader>
        <CardContent>
          {studyPeriods.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {studyPeriods.map((period) => (
                  <button
                    key={period}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedPeriod === period
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Дисциплина</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead>Преподаватель</TableHead>
                  <TableHead className="text-center">Посещаемость</TableHead>
                  <TableHead className="text-center">Баллы</TableHead>
                  <TableHead className="text-center">Оценка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisciplines.map((discipline) => {
                  const scorePercentage = calculateGradePercentage(
                    discipline.scoreForAnsweredTasks,
                    discipline.maxScoreForAnsweredTasks
                  );
                  
                  return (
                    <TableRow 
                      key={discipline.disciplineId}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{discipline.discipline.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(discipline.studyPeriod.startDate)} - {formatDate(discipline.studyPeriod.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {discipline.discipline.code}
                      </TableCell>
                      <TableCell>
                        {getTeacherName(discipline.discipline)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              discipline.disciplineAttendance.percent > 80
                                ? "bg-green-100 text-green-800"
                                : discipline.disciplineAttendance.percent > 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {discipline.disciplineAttendance.percent}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {discipline.disciplineAttendance.visited}/{discipline.disciplineAttendance.total}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-4 border-gray-100">
                            <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
                              <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={scorePercentage > 80 ? "#22c55e" : scorePercentage > 60 ? "#eab308" : "#ef4444"}
                                strokeWidth="3"
                                strokeDasharray={`${scorePercentage}, 100`}
                                strokeDashoffset="25"
                              />
                            </svg>
                            <div className="text-sm font-semibold">
                              {discipline.scoreForAnsweredTasks}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            из {discipline.maxScoreForAnsweredTasks}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div 
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            discipline.disciplineGrade === "Отлично"
                              ? "bg-green-100 text-green-800"
                              : discipline.disciplineGrade === "Хорошо"
                              ? "bg-blue-100 text-blue-800"
                              : discipline.disciplineGrade === "Удовлетворительно"
                              ? "bg-yellow-100 text-yellow-800"
                              : discipline.disciplineGrade === "Неудовлетворительно"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {discipline.disciplineGrade || "Нет оценки"}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiaryView;
