import React, { useEffect } from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/Sidebar.css';

const Sidebar = ({ selectedDisease, setSelectedDisease, selectedAnimal, setSelectedAnimal, selectedYear, setSelectedYear, isOpen, onClose, onMenuChange }) => {
  
  const diseaseAnimalMapping = {
    'bird_flu': {
      name: 'Грипп птиц',
      animals: ['poultry', 'pigs', 'cattle'],
      animalLabels: ['Птица', 'Свиньи', 'КРС']
    },
    'newcastle': {
      name: 'Болезнь Ньюкасла',
      animals: ['poultry'],
      animalLabels: ['Птица']
    },
    'rrss': {
      name: 'РРСС',
      animals: ['pigs'],
      animalLabels: ['Свиньи']
    },
    'rotavirus': {
      name: 'Ротавирус КРС',
      animals: ['cattle'],
      animalLabels: ['КРС']
    },
    'brucellosis': {
      name: 'Бруцеллёз',
      animals: ['cattle', 'sheep', 'pigs', 'horses'],
      animalLabels: ['КРС', 'МРС', 'Свиньи', 'Лошади']
    }
  };

  const diseaseOptions = [
    { value: 'bird_flu', label: 'Грипп птиц' },
    { value: 'newcastle', label: 'Болезнь Ньюкасла' },
    { value: 'rrss', label: 'РРСС' },
    { value: 'rotavirus', label: 'Ротавирус КРС' },
    { value: 'brucellosis', label: 'Бруцеллёз' }
  ];

  const allAnimalOptions = [
    { value: 'cattle', label: 'КРС' },
    { value: 'sheep', label: 'МРС' },
    { value: 'pigs', label: 'Свиньи' },
    { value: 'poultry', label: 'Птица' },
    { value: 'horses', label: 'Лошади' }
  ];

  const defaultMenuOption = { value: 'dashboard', label: 'Панель управления' };
  const defaultDiseaseOption = diseaseOptions[0];
  const defaultYearOption = { value: '2026', label: '2026' };

  const menuOptions = [
    { value: 'dashboard', label: 'Панель управления' },
    { value: 'reports', label: 'Аналитические отчёты' },
    { value: 'alerts', label: 'Система оповещений' },
    { value: 'settings', label: 'Настройки платформы' }
  ];

  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027 (прогноз)' }
  ];

  const getAvailableAnimals = () => {
    if (!selectedDisease) {
      return allAnimalOptions;
    }
    const allowedAnimals = diseaseAnimalMapping[selectedDisease]?.animals || [];
    return allAnimalOptions.filter(animal => allowedAnimals.includes(animal.value));
  };

  useEffect(() => {
    if (!selectedDisease) {
      setSelectedDisease(defaultDiseaseOption.value);
    }
    if (!selectedYear) {
      setSelectedYear(defaultYearOption.value);
    }
  }, []);

  useEffect(() => {
    if (selectedDisease) {
      const availableAnimals = getAvailableAnimals();
      if (selectedAnimal && !availableAnimals.some(a => a.value === selectedAnimal)) {
        setSelectedAnimal('');
      }
      if (!selectedAnimal && availableAnimals.length > 0) {
        setSelectedAnimal(availableAnimals[0].value);
      }
    }
  }, [selectedDisease]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '6px',
      borderColor: state.isFocused ? '#007aff' : '#d0d0d0',
      boxShadow: state.isFocused ? '0 0 0 1px #007aff' : 'none',
      minHeight: '36px',
      '&:hover': {
        borderColor: '#007aff'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: 'absolute'
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#f0f7ff' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#333333',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#007aff'
      }
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#888888',
      '&:hover': {
        color: '#007aff'
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#e0e0e0'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333333'
    })
  };

  const availableAnimals = getAvailableAnimals();
  const selectedDiseaseInfo = selectedDisease ? diseaseAnimalMapping[selectedDisease] : null;
  
  const currentDiseaseOption = diseaseOptions.find(option => option.value === selectedDisease) || defaultDiseaseOption;
  const currentYearOption = yearOptions.find(option => option.value === selectedYear) || defaultYearOption;
  const currentAnimalOption = availableAnimals.find(option => option.value === selectedAnimal);

  const handleMenuSelect = (option) => {
    if (option && onMenuChange) {
      onMenuChange(option.value);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside 
          className="sidebar"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="sidebar-header">
            <h3>Параметры анализа</h3>
            <button className="sidebar-close" onClick={onClose}>×</button>
          </div>

          <div className="sidebar-section">
            <label className="section-label">Раздел</label>
            <Select
              options={menuOptions}
              styles={customStyles}
              placeholder="Выберите раздел"
              defaultValue={defaultMenuOption}
              onChange={handleMenuSelect}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>

          <div className="sidebar-section">
            <label className="section-label">Заболевание</label>
            <Select
              options={diseaseOptions}
              styles={customStyles}
              placeholder="Выберите заболевание"
              value={currentDiseaseOption}
              onChange={(option) => setSelectedDisease(option?.value || '')}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {selectedDiseaseInfo && (
              <div className="info-note">
                <span className="info-label">Восприимчивые виды:</span>
                <span>{selectedDiseaseInfo.animalLabels.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <label className="section-label">Вид животного</label>
            <Select
              options={availableAnimals}
              styles={customStyles}
              placeholder={selectedDisease ? "Выберите вид животного" : "Сначала выберите заболевание"}
              value={currentAnimalOption}
              onChange={(option) => setSelectedAnimal(option?.value || '')}
              isDisabled={!selectedDisease || availableAnimals.length === 0}
              noOptionsMessage={() => "Нет восприимчивых видов"}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            {!selectedDisease && (
              <div className="info-note warning">
                <span>Необходимо выбрать заболевание</span>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <label className="section-label">Период анализа</label>
            <Select
              options={yearOptions}
              styles={customStyles}
              placeholder="Выберите год"
              value={currentYearOption}
              onChange={(option) => setSelectedYear(option?.value || '')}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>

          <div className="stats-panel">
            <div className="stat-card">
              <div className="stat-value">30%</div>
              <div className="stat-label">Снижение экономического ущерба</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1.5-2</div>
              <div className="stat-label">Срок регистрации препаратов</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">70%</div>
              <div className="stat-label">Точность прогнозирования</div>
            </div>
          </div>

          {(selectedDisease || selectedAnimal || selectedYear) && (
            <div className="active-filters">
              <div className="active-filters-title">Активные фильтры</div>
              {selectedDisease && (
                <div className="active-filter">
                  <button className="filter-remove" onClick={() => setSelectedDisease(defaultDiseaseOption.value)}>×</button>
                  <span>Заболевание: {diseaseOptions.find(d => d.value === selectedDisease)?.label}</span>
                </div>
              )}
              {selectedAnimal && (
                <div className="active-filter">
                  <button className="filter-remove" onClick={() => setSelectedAnimal('')}>×</button>
                  <span>Вид: {allAnimalOptions.find(a => a.value === selectedAnimal)?.label}</span>
                </div>
              )}
              {selectedYear && (
                <div className="active-filter">
                  <button className="filter-remove" onClick={() => setSelectedYear(defaultYearOption.value)}>×</button>
                  <span>Период: {selectedYear} год</span>
                </div>
              )}
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
