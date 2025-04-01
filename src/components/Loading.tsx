
import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Загрузка" }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-4 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-24 h-24">
        <motion.div 
          className="absolute inset-0 rounded-full border-t-4 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 rounded-full border-r-4 border-blue-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 rounded-full border-b-4 border-blue-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0.8, 1] }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary/60 opacity-50 blur-sm"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
      
      <motion.div 
        className="flex items-center mt-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-primary text-lg font-medium mr-2">{text}</span>
        <motion.span 
          className="inline-block h-2 w-2 rounded-full bg-primary mx-0.5"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
        <motion.span 
          className="inline-block h-2 w-2 rounded-full bg-primary mx-0.5"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
        <motion.span 
          className="inline-block h-2 w-2 rounded-full bg-primary mx-0.5"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4,
            repeat: Infinity,
            repeatType: "loop" 
          }}
        />
      </motion.div>
      
      <motion.div 
        className="mt-6 max-w-xs mx-auto relative overflow-hidden p-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="typing-demo text-gray-600 text-sm">
          Демонстрация работы API LXP
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-primary/30"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loading;
