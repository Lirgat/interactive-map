import React from 'react';
import Select from 'react-select';
import './styles/Sidebar.css';

const Sidebar = ({ selectedDisease, setSelectedDisease, selectedAnimal, setSelectedAnimal, selectedYear, setSelectedYear }) => {
  
  const menuOptions = [
    { value: 'dashboard', label: '📊 Дашборд' },
    { value: 'reports', label: '📄 Отчёты' },
    { value: 'alerts', label: '🔔 Оповещения' },
    { value: 'settings', label: '⚙️ Настройки' }
  ];

  const diseaseOptions = [
    { value: 'bird_flu', label: '🦠 Грипп птиц (H5N1)' },
    { value: 'newcastle', label: '🐔 Болезнь Ньюкасла' },
    { value: 'rrss', label: '🐷 РРСС' },
    { value: 'rotavirus', label: '🐄 Ротавирус КРС' },
    { value: 'brucellosis', label: '🦠 Бруцеллёз' }
  ];

  const animalOptions = [
    { value: 'cattle', label: '🐄 КРС' },
    { value: 'sheep', label: '🐑 МРС' },
    { value: 'pigs', label: '🐷 Свиньи' },
    { value: 'poultry', label: '🐔 Птица' },
    { value: 'horses', label: '🐴 Лошади' }
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
      borderRadius: '10px',
      borderColor: '#e0e0e0',
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
        backgroundColor: state.isSelected ? '#007aff' : '#f0f0f0'
      }
    })
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <label className="section-label">
          <span className="label-icon">☰</span>
          Меню
        </label>
        <Select
          options={menuOptions}
          styles={customStyles}
          placeholder="Выберите раздел"
          onChange={(option) => console.log('Menu selected:', option)}
        />
      </div>

      <div className="sidebar-section">
        <label className="section-label">
          <span className="label-icon">🦠</span>
          Болезнь
        </label>
        <Select
          options={diseaseOptions}
          styles={customStyles}
          placeholder="Выберите болезнь"
          value={diseaseOptions.find(option => option.value === selectedDisease)}
          onChange={(option) => setSelectedDisease(option?.value || '')}
        />
      </div>

      <div className="sidebar-section">
        <label className="section-label">
          <span className="label-icon">🐾</span>
          Вид животных
        </label>
        <Select
          options={animalOptions}
          styles={customStyles}
          placeholder="Выберите вид"
          value={animalOptions.find(option => option.value === selectedAnimal)}
          onChange={(option) => setSelectedAnimal(option?.value || '')}
        />
      </div>

      <div className="sidebar-section">
        <label className="section-label">
          <span className="label-icon">📅</span>
          Год
        </label>
        <Select
          options={yearOptions}
          styles={customStyles}
          placeholder="Выберите год"
          value={yearOptions.find(option => option.value === selectedYear)}
          onChange={(option) => setSelectedYear(option?.value || '')}
        />
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <div className="stat-value">30%</div>
          <div className="stat-label">Снижение экономического ущерба</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1.5-2</div>
          <div className="stat-label">года на регистрацию биопрепаратов</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">70%</div>
          <div className="stat-label">точность прогноза</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
