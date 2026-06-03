import React from 'react';
import { motion } from 'framer-motion';
import './styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="splash-content">
        <motion.div 
          className="logo-animation"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#007aff" strokeWidth="3" fill="none"/>
            <path d="M60 20 L60 100 M20 60 L100 60" stroke="#007aff" strokeWidth="3"/>
            <circle cx="60" cy="60" r="15" fill="#007aff"/>
            <path d="M60 45 L75 60 L60 75 L45 60 Z" fill="white"/>
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="splash-title"
        >
          Единая платформа прогнозирования
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="splash-subtitle"
        >
          Ветеринарное благополучие АПК
        </motion.p>
        
        <motion.div
          className="loading-bar"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5 }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
