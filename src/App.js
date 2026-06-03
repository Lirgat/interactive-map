import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealWorldMap from './components/RealWorldMap';
import AnalyticsPage from './components/AnalyticsPage';
import './App.css';

// Варианты анимации для страниц
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('map');
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
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuChange = (menuItem) => {
    if (menuItem === 'dashboard') {
      setCurrentPage('map');
    } else if (menuItem === 'reports') {
      setCurrentPage('analytics');
    }
  };

  const navigateToMap = () => {
    setCurrentPage('map');
  };

  return (
    <div className="App">
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      
      {!showSplash && (
        <div className="main-container">
          <Header 
            onToggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
            currentPage={currentPage}
            onNavigateToMap={navigateToMap}
          />
          <div className="content-wrapper">
            <AnimatePresence mode="wait">
              {currentPage === 'map' && (
                <motion.div
                  key="map-page"
                  className="page-container"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  style={{ display: 'flex', width: '100%', gap: '16px' }}
                >
                  <Sidebar 
                    selectedDisease={selectedDisease}
                    setSelectedDisease={setSelectedDisease}
                    selectedAnimal={selectedAnimal}
                    setSelectedAnimal={setSelectedAnimal}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    isOpen={isSidebarOpen}
                    onClose={toggleSidebar}
                    onMenuChange={handleMenuChange}
                  />
                  <RealWorldMap 
                    onCountryClick={handleCountryClick}
                    selectedCountry={selectedCountry}
                    selectedDisease={selectedDisease}
                    selectedAnimal={selectedAnimal}
                    selectedYear={selectedYear}
                    isSidebarOpen={isSidebarOpen}
                  />
                </motion.div>
              )}
              {currentPage === 'analytics' && (
                <motion.div
                  key="analytics-page"
                  className="page-container"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  style={{ width: '100%' }}
                >
                  <AnalyticsPage onBackToMap={navigateToMap} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
