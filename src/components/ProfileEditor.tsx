
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, Upload, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/utils/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileEditorProps {
  userData: UserData;
  onUpdate: (updatedData: Partial<UserData>) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ userData, onUpdate, onCancel }) => {
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [description, setDescription] = useState(userData.description || "");
  const [avatarUrl, setAvatarUrl] = useState(userData.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Изображение слишком большое. Максимальный размер 2МБ");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(data.publicUrl);
      toast.success("Аватар успешно загружен");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Ошибка при загрузке аватара");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use the studentId from userData to update the profile in Supabase
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ 
          last_name: lastName,
          avatar_url: avatarUrl,
          description: description 
        })
        .eq('student_id', userData.studentId);
      
      if (error) throw error;
      
      // Update the UI with new data
      onUpdate({
        lastName,
        avatar: avatarUrl,
        description
      });
      
      toast.success("Профиль успешно обновлен");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Не удалось обновить профиль");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Редактирование профиля
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg bg-indigo-50">
              <AvatarImage src={avatarUrl} alt={`${userData.firstName} ${lastName}`} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white text-2xl">
                {userData.firstName.charAt(0)}{lastName.charAt(0) || userData.lastName?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            
            <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
              <Upload size={16} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
                disabled={isUploading}
              />
            </label>
          </div>
          
          {isUploading && (
            <p className="text-sm text-indigo-600 mt-2 animate-pulse">Загружается...</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <Input 
            value={userData.firstName}
            disabled
            className="bg-gray-100 text-gray-500"
            title="Имя нельзя изменить"
          />
          <p className="text-xs text-gray-500 mt-1">Имя нельзя изменить</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
          <Input 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Введите фамилию"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите о себе"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          >
            Сохранить
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileEditor;
