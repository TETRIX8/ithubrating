
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { removeUserConsent } from "@/services/lxpService";
import { UserData } from "@/utils/api";
import { UserCircle, LogOut, XCircle } from "lucide-react";

interface ProfileOptionsProps {
  userData: UserData;
  onLogout: () => void;
}

const ProfileOptions: React.FC<ProfileOptionsProps> = ({ userData, onLogout }) => {
  const handleRemoveFromLeaderboard = () => {
    removeUserConsent(userData.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        {userData.avatar ? (
          <img 
            src={userData.avatar} 
            alt={`${userData.firstName} ${userData.lastName}`} 
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full flex items-center gap-2">
              <XCircle size={18} />
              Удалить меня из рейтинга
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
          className="w-full flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default ProfileOptions;
