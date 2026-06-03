import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealWorldMap from './components/RealWorldMap';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

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
          <Header />
          <div className="content-wrapper">
            <Sidebar 
              selectedDisease={selectedDisease}
              setSelectedDisease={setSelectedDisease}
              selectedAnimal={selectedAnimal}
              setSelectedAnimal={setSelectedAnimal}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <RealWorldMap 
              onCountryClick={handleCountryClick}
              selectedCountry={selectedCountry}
              selectedDisease={selectedDisease}
              selectedAnimal={selectedAnimal}
              selectedYear={selectedYear}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
