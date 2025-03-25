
import React, { useState } from "react";
import { UserData } from "@/utils/api";

interface ApiResponseProps {
  userData: UserData;
  accessToken: string;
}

const ApiResponse: React.FC<ApiResponseProps> = ({ userData, accessToken }) => {
  const [activeTab, setActiveTab] = useState<"user" | "disciplines" | "token">("user");
  
  const truncateToken = (token: string) => {
    if (token.length <= 40) return token;
    return token.substring(0, 20) + "..." + token.substring(token.length - 20);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return (
    <div className="w-full max-w-5xl animate-slide-up">
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <div className="flex items-center mb-8">
          {userData.avatar && (
            <div className="mr-4">
              <img
                src={userData.avatar}
                alt={userData.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-medium text-gray-900">{userData.firstName}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <div className="flex mt-1 space-x-2">
              {userData.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "user"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("user")}
            >
              Личные данные
            </button>
            <button
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "disciplines"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("disciplines")}
            >
              Дисциплины
            </button>
            <button
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === "token"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("token")}
            >
              Токен доступа
            </button>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 transition-all duration-300">
          {activeTab === "user" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Информация о пользователе</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="text-gray-900 font-mono text-sm">{userData.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="text-gray-900">{userData.phoneNumber || "Не указан"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Дата регистрации</p>
                    <p className="text-gray-900">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Подразделения</p>
                    <div className="space-y-1 mt-1">
                      {userData.assignedSuborganizations.map((item, index) => (
                        <p key={index} className="text-gray-900">
                          {item.suborganization.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Уведомления по email</p>
                    <p className="text-gray-900">
                      {userData.notificationsSettings.isPushDailyDigestOnEmail
                        ? "Включены"
                        : "Отключены"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "disciplines" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Дисциплины</h3>
              
              {userData.teacher?.assignedDisciplines_V2.length > 0 ? (
                <div className="space-y-6">
                  {userData.teacher.assignedDisciplines_V2.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/60 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md"
                    >
                      <h4 className="font-medium text-gray-900">{item.discipline.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 font-mono">
                        {item.discipline.code}
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        {item.discipline.studyPeriods.map((period, pidx) => (
                          <div key={pidx} className="text-sm">
                            <p className="text-gray-700 font-medium">{period.name}</p>
                            <p className="text-gray-500 text-xs">
                              {formatDate(period.startDate)} - {formatDate(period.endDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Нет назначенных дисциплин</p>
              )}
            </div>
          )}

          {activeTab === "token" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Токен авторизации</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 font-mono text-sm break-all">
                <span className="text-gray-700">{truncateToken(accessToken)}</span>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => navigator.clipboard.writeText(accessToken)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Копировать полный токен
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="https://github.com/TETRIX8/lxpapi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub Проекта
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiResponse;
