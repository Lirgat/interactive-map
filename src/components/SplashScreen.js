import React from 'react';
import { motion } from 'framer-motion';
import './styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="splash-content">
        <motion.div 
          className="logos-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="logo-row top-row">
            <img src="/images/mva.svg" alt="МГАВМиБ" className="splash-logo mva-logo" />
            <img src="/images/msh_kolos.png" alt="Минсельхоз" className="splash-logo msh-logo" />
          </div>
          <div className="logo-row bottom-row">
            <img src="/images/priotity.svg" alt="Приоритет 2030" className="splash-logo priority-logo" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="splash-title"
        >
          ФГБОУ ВО МГАВМиБ - МВА имени К.И. Скрябина
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="splash-subtitle"
        >
          Единая платформа прогнозирования и управления эпизоотическими рисками
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
