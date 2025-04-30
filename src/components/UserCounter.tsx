
import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserCounter = () => {
  const { data: userCount, isLoading } = useQuery({
    queryKey: ["userCount"],
    queryFn: async () => {
      // Fetch count of student profiles from supabase
      const { count, error } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching user count:", error);
        return 0;
      }
      
      return count || 0;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <div className="bg-indigo-100 p-2 rounded-full">
        <Users className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Зарегистрировано студентов</p>
        <p className="text-lg font-bold">
          {isLoading ? (
            <span className="inline-flex items-center">
              <span className="loader-dot"></span>
              <span className="loader-dot"></span>
              <span className="loader-dot"></span>
            </span>
          ) : (
            userCount
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default UserCounter;
