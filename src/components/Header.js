import React from 'react';
import './styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-section">
        <div className="academy-logo">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#007aff" opacity="0.2"/>
            <text x="20" y="26" textAnchor="middle" fill="#007aff" fontSize="12" fontWeight="bold">МВА</text>
          </svg>
        </div>
        <div className="academy-name">
          <h2>МГАВМиБ - МВА имени К.И. Скрябина</h2>
          <p>Единая платформа прогнозирования и управления рисками</p>
        </div>
      </div>
      <div className="partner-logos">
        <div className="logo-item">
          <svg width="35" height="35" viewBox="0 0 35 35">
            <rect x="5" y="5" width="25" height="25" rx="5" fill="#007aff" opacity="0.8"/>
            <text x="17.5" y="23" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ВИК</text>
          </svg>
        </div>
        <div className="logo-item">
          <svg width="35" height="35" viewBox="0 0 35 35">
            <circle cx="17.5" cy="17.5" r="12.5" fill="#007aff" opacity="0.7"/>
            <text x="17.5" y="22" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">НИИ</text>
          </svg>
        </div>
        <div className="logo-item">
          <svg width="35" height="35" viewBox="0 0 35 35">
            <path d="M5 17.5 L17.5 5 L30 17.5 L17.5 30 Z" fill="#007aff" opacity="0.6"/>
            <text x="17.5" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">ФМБА</text>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
