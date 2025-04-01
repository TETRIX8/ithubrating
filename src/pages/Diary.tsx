
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAuth } from "@/services/lxpService";
import { getDiaryData, DiaryData, UserData } from "@/utils/api";
import { toast } from "sonner";

const Diary = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserData = getUserAuth();
        const token = localStorage.getItem("accessToken");
        
        if (!storedUserData || !token) {
          toast.error("Необходимо авторизоваться");
          navigate("/");
          return;
        }
        
        setUserData(storedUserData);
        
        // Load diary data
        const diary = await getDiaryData(token, storedUserData.id);
        setDiaryData(diary);
      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("Ошибка авторизации, попробуйте войти снова");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData || !diaryData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Данные не найдены</h2>
        <p className="text-gray-600 mb-6">Необходимо авторизоваться, чтобы получить доступ к дневнику</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Дневник студента</h1>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Назад
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Информация о студенте</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Имя:</p>
            <p className="font-medium">{userData.firstName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{userData.email}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Успеваемость</h2>
        
        {diaryData && diaryData.searchStudentDisciplines && diaryData.searchStudentDisciplines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Дисциплина</th>
                  <th className="border px-4 py-2 text-center">Посещаемость</th>
                  <th className="border px-4 py-2 text-center">Баллы</th>
                  <th className="border px-4 py-2 text-center">Оценка</th>
                </tr>
              </thead>
              <tbody>
                {diaryData.searchStudentDisciplines.map((discipline, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border px-4 py-3">
                      <div className="font-medium">{discipline.discipline.name}</div>
                      <div className="text-sm text-gray-500">
                        {discipline.studyPeriod.name}
                      </div>
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <div className="inline-flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          discipline.disciplineAttendance.percent >= 70 ? 'bg-green-500' : 
                          discipline.disciplineAttendance.percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        {discipline.disciplineAttendance.percent}%
                      </div>
                    </td>
                    <td className="border px-4 py-3 text-center">
                      {discipline.scoreForAnsweredTasks} / {discipline.maxScoreForAnsweredTasks || discipline.discipline.maxScore}
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <span className={`font-medium ${
                        (discipline.disciplineGrade === 'Отлично' || discipline.disciplineGrade === '5') ? 'text-green-600' :
                        (discipline.disciplineGrade === 'Хорошо' || discipline.disciplineGrade === '4') ? 'text-blue-600' :
                        (discipline.disciplineGrade === 'Удовлетворительно' || discipline.disciplineGrade === '3') ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {discipline.disciplineGrade || discipline.disciplineGrade_V2 || 'Н/Д'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Данные об успеваемости отсутствуют
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
