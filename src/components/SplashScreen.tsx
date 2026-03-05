import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center text-white z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-full shadow-2xl mb-6">
          <Shield size={80} className="text-red-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter mb-2">SAFE HAVEN</h1>
        <p className="text-red-100 font-medium tracking-wide uppercase text-xs">Your Personal Safety Companion</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12"
      >
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
