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
        <div className="logo-wrapper">
          <a href="https://mgavm.ru/" target="_blank" rel="noopener noreferrer">
            <img src="/images/mva.svg" alt="МГАВМиБ" className="academy-logo-img" />
          </a>
          <div className="academy-info">
            <h1>ФГБОУ ВО МГАВМиБ - МВА имени К.И. Скрябина</h1>
            <p>Единая платформа прогнозирования и управления эпизоотическими рисками</p>
          </div>
        </div>
      </div>
      <div className="header-right">
        <a href="https://mcx.gov.ru/" target="_blank" rel="noopener noreferrer">
          <img src="/images/msh_kolos.png" alt="Минсельхоз" className="partner-logo msh" />
        </a>
        <a href="https://priority2030.ru/" target="_blank" rel="noopener noreferrer">
          <img src="/images/priotity.svg" alt="Приоритет" className="partner-logo" />
        </a>
      </div>
    </header>
  );
};

export default Header;
