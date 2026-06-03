import React from 'react';
import './styles/Header.css';

const Header = ({ onToggleSidebar, isSidebarOpen, currentPage, onNavigateToMap }) => {
  return (
    <header className="header">
      <div className="header-left">
        {currentPage === 'map' && (
          <button className="sidebar-toggle" onClick={onToggleSidebar} title={isSidebarOpen ? "Скрыть панель" : "Показать панель"}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        )}
        {currentPage === 'analytics' && (
          <button className="back-button" onClick={onNavigateToMap} title="Вернуться к карте">
            ← Назад к карте
          </button>
        )}
        <div className="academy-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="2" y="2" width="36" height="36" rx="6" fill="#007aff" opacity="0.1"/>
            <rect x="2" y="2" width="36" height="36" rx="6" stroke="#007aff" strokeWidth="1.5"/>
            <text x="20" y="26" textAnchor="middle" fill="#007aff" fontSize="13" fontWeight="bold" fontFamily="Arial">МВА</text>
          </svg>
        </div>
        <div className="academy-info">
          <h1>ФГБОУ ВО МГАВМиБ - МВА имени К.И. Скрябина</h1>
          <p>Единая платформа прогнозирования и управления эпизоотическими рисками</p>
        </div>
      </div>
      <div className="header-right">
        <div className="partner">ГК ВИК</div>
        <div className="partner">НИИ гриппа</div>
        <div className="partner">ФМБА России</div>
        <div className="partner">Россельхознадзор</div>
      </div>
    </header>
  );
};

export default Header;
