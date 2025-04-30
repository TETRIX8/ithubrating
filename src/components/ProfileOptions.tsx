
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { removeUserConsent, processLxpData } from "@/services/lxpService";
import { UserData, getDiaryData } from "@/utils/api";
import { UserCircle, LogOut, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileOptionsProps {
  userData: UserData;
  onLogout: () => void;
}

const ProfileOptions: React.FC<ProfileOptionsProps> = ({ userData, onLogout }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRemoveFromLeaderboard = async () => {
    try {
      await removeUserConsent(userData.id);
      toast.success("Вы были успешно удалены из рейтинга");
    } catch (error) {
      console.error("Error removing from leaderboard:", error);
      toast.error("Ошибка при удалении из рейтинга");
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      toast.info("Обновление данных...");
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Токен авторизации не найден. Пожалуйста, войдите снова.");
        return;
      }
      
      // Fetch new diary data
      const diaryData = await getDiaryData(token, userData.id);
      
      if (!diaryData) {
        toast.error("Не удалось получить данные дневника");
        return;
      }
      
      // Process and update the leaderboard data
      await processLxpData(userData, diaryData);
      
      toast.success("Данные успешно обновлены");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Ошибка при обновлении данных");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-md mx-auto border border-purple-200/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {userData.avatar ? (
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={userData.avatar} 
            alt={`${userData.firstName} ${userData.lastName || ''}`} 
            className="h-20 w-20 rounded-full object-cover mx-auto sm:mx-0 ring-4 ring-purple-200/20"
          />
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-20 w-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto sm:mx-0 ring-4 ring-purple-100/10"
          >
            <UserCircle className="h-14 w-14 text-purple-500/60" />
          </motion.div>
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
            {userData.firstName} {userData.lastName || ''}
          </h2>
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 border-purple-200/20 hover:border-purple-400/40 transition-colors"
          onClick={handleRefreshData}
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Обновление..." : "Обновить данные"}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full flex items-center gap-2 hover:bg-destructive/90 transition-colors">
              <XCircle size={18} />
              Удалить меня из рейтинга
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white/95 backdrop-blur-lg border border-white/30">
            <AlertDialogHeader>
              <AlertDialogTitle>Удаление из рейтинга</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить свои данные из рейтинга? Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveFromLeaderboard}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 border-purple-200/20 hover:border-purple-400/40 transition-colors"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Выйти
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileOptions;
