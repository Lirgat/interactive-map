import React, { useEffect } from 'react';
import Select from 'react-select';
import './styles/Sidebar.css';

const Sidebar = ({ selectedDisease, setSelectedDisease, selectedAnimal, setSelectedAnimal, selectedYear, setSelectedYear }) => {
  
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
    { value: 'bird_flu', label: 'Грипп птиц (H5N1)' },
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

  const getAvailableAnimals = () => {
    if (!selectedDisease) {
      return allAnimalOptions;
    }
    const allowedAnimals = diseaseAnimalMapping[selectedDisease]?.animals || [];
    return allAnimalOptions.filter(animal => allowedAnimals.includes(animal.value));
  };

  useEffect(() => {
    if (selectedDisease && selectedAnimal) {
      const availableAnimals = getAvailableAnimals();
      const isAnimalAvailable = availableAnimals.some(a => a.value === selectedAnimal);
      if (!isAnimalAvailable) {
        setSelectedAnimal('');
      }
    }
  }, [selectedDisease]);

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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: '#d0d0d0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#007aff'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007aff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:hover': {
        backgroundColor: state.isSelected ? '#007aff' : '#f5f5f5'
      }
    })
  };

  const availableAnimals = getAvailableAnimals();
  const selectedDiseaseInfo = selectedDisease ? diseaseAnimalMapping[selectedDisease] : null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Фильтры анализа</h3>
      </div>

      <div className="sidebar-section">
        <label className="section-label">Меню навигации</label>
        <Select
          options={menuOptions}
          styles={customStyles}
          placeholder="Выберите раздел"
          onChange={(option) => console.log('Menu selected:', option)}
        />
      </div>

      <div className="sidebar-section">
        <label className="section-label">Заболевание</label>
        <Select
          options={diseaseOptions}
          styles={customStyles}
          placeholder="Выберите заболевание"
          value={diseaseOptions.find(option => option.value === selectedDisease)}
          onChange={(option) => setSelectedDisease(option?.value || '')}
        />
        {selectedDiseaseInfo && (
          <div className="info-note">
            <span className="info-text">Восприимчивые виды: {selectedDiseaseInfo.animalLabels.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <label className="section-label">Вид животного</label>
        <Select
          options={availableAnimals}
          styles={customStyles}
          placeholder={selectedDisease ? "Выберите вид животного" : "Сначала выберите заболевание"}
          value={availableAnimals.find(option => option.value === selectedAnimal)}
          onChange={(option) => setSelectedAnimal(option?.value || '')}
          isDisabled={!selectedDisease}
          noOptionsMessage={() => "Нет восприимчивых видов для выбранного заболевания"}
        />
        {!selectedDisease && (
          <div className="info-note warning">
            <span className="info-text">Необходимо выбрать заболевание</span>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <label className="section-label">Период анализа</label>
        <Select
          options={yearOptions}
          styles={customStyles}
          placeholder="Выберите год"
          value={yearOptions.find(option => option.value === selectedYear)}
          onChange={(option) => setSelectedYear(option?.value || '')}
        />
      </div>

      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-value">30%</div>
          <div className="stat-label">Снижение экономического ущерба</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1.5-2</div>
          <div className="stat-label">года на регистрацию биопрепаратов</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">70%</div>
          <div className="stat-label">точность прогнозирования</div>
        </div>
      </div>

      {(selectedDisease || selectedAnimal || selectedYear) && (
        <div className="active-filters">
          <div className="active-filters-title">Активные фильтры:</div>
          {selectedDisease && (
            <div className="active-filter">
              <button className="filter-remove" onClick={() => setSelectedDisease('')}>×</button>
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
              <button className="filter-remove" onClick={() => setSelectedYear('')}>×</button>
              <span>Период: {selectedYear} год</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
