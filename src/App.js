import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealWorldMap from './components/RealWorldMap';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState('bird_flu');
  const [selectedAnimal, setSelectedAnimal] = useState('poultry');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    console.log('Selected:', country);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div 
          className="main-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="content-wrapper">
            <Sidebar 
              selectedDisease={selectedDisease}
              setSelectedDisease={setSelectedDisease}
              selectedAnimal={selectedAnimal}
              setSelectedAnimal={setSelectedAnimal}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
            />
            <RealWorldMap 
              onCountryClick={handleCountryClick}
              selectedCountry={selectedCountry}
              selectedDisease={selectedDisease}
              selectedAnimal={selectedAnimal}
              selectedYear={selectedYear}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
