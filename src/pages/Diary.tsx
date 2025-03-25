
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryData, DiaryData } from "@/utils/api";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { Book, Calendar, ArrowLeft, ChevronRight, BarChart4 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Diary = () => {
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");
  
  useEffect(() => {
    const fetchDiaryData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const studentId = localStorage.getItem("studentId");
        
        if (!token || !studentId) {
          toast.error("Необходима авторизация");
          navigate("/");
          return;
        }
        
        const data = await getDiaryData(token, studentId);
        setDiaryData(data);
      } catch (error) {
        console.error("Error fetching diary data:", error);
        toast.error("Ошибка при получении данных дневника");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiaryData();
  }, [navigate]);
  
  const getGradeColor = (grade: string | number | null) => {
    if (!grade) return "text-gray-400";
    
    if (typeof grade === "string") {
      switch(grade) {
        case "FIVE": return "text-green-600 font-medium";
        case "FOUR": return "text-blue-600 font-medium";
        case "THREE": return "text-yellow-600 font-medium";
        case "TWO": return "text-red-600 font-medium";
        default: return "text-gray-600";
      }
    } else {
      switch(grade) {
        case 5: return "text-green-600 font-medium";
        case 4: return "text-blue-600 font-medium";
        case 3: return "text-yellow-600 font-medium";
        case 2: return "text-red-600 font-medium";
        default: return "text-gray-600";
      }
    }
  };
  
  const getGradeText = (grade: string | number | null) => {
    if (!grade) return "—";
    
    if (typeof grade === "string") {
      switch(grade) {
        case "FIVE": return "5";
        case "FOUR": return "4";
        case "THREE": return "3";
        case "TWO": return "2";
        default: return grade;
      }
    }
    
    return grade;
  };
  
  const getAttendanceColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const filterDisciplines = (disciplines: DiaryData["searchStudentDisciplines"]) => {
    if (activeTab === "current") {
      return disciplines.filter(d => 
        d.studyPeriod?.status === "STARTED" || 
        (Array.isArray(d.studyPeriod) && d.studyPeriod[0]?.status === "STARTED")
      );
    } else {
      return disciplines.filter(d => 
        d.studyPeriod?.status === "FINISHED" || 
        (Array.isArray(d.studyPeriod) && d.studyPeriod[0]?.status === "FINISHED")
      );
    }
  };
  
  if (isLoading) {
    return <Loading text="Загрузка дневника" />;
  }
  
  const disciplines = diaryData?.searchStudentDisciplines || [];
  const filteredDisciplines = filterDisciplines(disciplines);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="py-6 px-8 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Назад</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium flex items-center">
              <Book className="mr-2" /> Дневник успеваемости
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("current")}
                className={`px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === "current" 
                    ? "bg-white shadow text-primary" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Текущий семестр
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`px-4 py-2 rounded-md flex items-center text-sm ${
                  activeTab === "archived" 
                    ? "bg-white shadow text-primary" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                Архив оценок
              </button>
            </div>
            
            <div className="text-gray-600 text-sm">
              {activeTab === "current" ? "Весенний семестр 24-25" : "Осенний семестр 24-25"}
            </div>
          </div>
          
          {filteredDisciplines.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Предмет</TableHead>
                    <TableHead>Преподаватель</TableHead>
                    <TableHead className="text-center">Посещаемость</TableHead>
                    <TableHead className="text-center">Баллы</TableHead>
                    <TableHead className="text-center">Итоговая оценка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisciplines.map((discipline) => {
                    const studyPeriod = Array.isArray(discipline.studyPeriod) 
                      ? discipline.studyPeriod[0] 
                      : discipline.studyPeriod;
                      
                    const teachers = discipline.discipline.teachers.map(t => 
                      `${t.user.lastName} ${t.user.firstName[0]}.${t.user.middleName ? ` ${t.user.middleName[0]}.` : ''}`
                    ).join(", ");
                    
                    return (
                      <TableRow key={discipline.disciplineId}>
                        <TableCell className="font-medium">
                          {discipline.discipline.name}
                          <div className="text-xs text-gray-500 mt-1">
                            {discipline.discipline.code} • {discipline.discipline.studyHoursCount} ч.
                          </div>
                        </TableCell>
                        <TableCell>{teachers || "—"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                              <div 
                                className={`h-2.5 rounded-full ${getAttendanceColor(discipline.disciplineAttendance.percent)}`} 
                                style={{ width: `${discipline.disciplineAttendance.percent}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {discipline.disciplineAttendance.percent}% ({discipline.disciplineAttendance.visited}/{discipline.disciplineAttendance.total})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">
                            {discipline.scoreForAnsweredTasks}
                          </span>
                          <span className="text-gray-400">
                            /{discipline.maxScoreForAnsweredTasks}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-lg ${getGradeColor(discipline.disciplineGrade_V2)}`}>
                            {getGradeText(discipline.disciplineGrade_V2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border">
              <div className="text-gray-500">
                {activeTab === "current" 
                  ? "В текущем семестре нет дисциплин" 
                  : "В архиве нет дисциплин"}
              </div>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            Данные успеваемости обновляются в конце каждого учебного дня
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-gray-500 text-sm border-t">
        <div className="max-w-7xl mx-auto">
          <p>
            Демонстрация работы с API сервиса LXP &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Diary;
