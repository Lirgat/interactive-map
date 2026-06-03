import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import './styles/RealWorldMap.css';

// URL для данных карты мира
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

const RealWorldMap = ({ onCountryClick, selectedCountry, selectedDisease, selectedAnimal, selectedYear }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  // Статусы стран (на основе данных из презентации)
  const countryStatus = {
    // Неблагополучные территории (красные) - с активными вспышками
    "Russia": { status: "unfavorable", risk: "high", cases: 145, genotype: "2.3.4.4b", lastOutbreak: "2026-05-15" },
    "China": { status: "unfavorable", risk: "high", cases: 234, genotype: "2.3.4.4b", lastOutbreak: "2026-06-01" },
    "India": { status: "unfavorable", risk: "high", cases: 312, genotype: "H5N1", lastOutbreak: "2026-05-28" },
    "Vietnam": { status: "unfavorable", risk: "high", cases: 178, genotype: "2.3.4.4b", lastOutbreak: "2026-05-30" },
    "Indonesia": { status: "unfavorable", risk: "high", cases: 198, genotype: "H5N1", lastOutbreak: "2026-05-25" },
    "Nigeria": { status: "unfavorable", risk: "high", cases: 89, genotype: "H5N1", lastOutbreak: "2026-05-20" },
    "Pakistan": { status: "unfavorable", risk: "high", cases: 67, genotype: "H5N1", lastOutbreak: "2026-05-22" },
    "Bangladesh": { status: "unfavorable", risk: "high", cases: 123, genotype: "2.3.4.4b", lastOutbreak: "2026-05-27" },
    "United States of America": { status: "unfavorable", risk: "medium", cases: 89, genotype: "Gen.7", lastOutbreak: "2026-04-20" },
    "Brazil": { status: "unfavorable", risk: "medium", cases: 67, genotype: "H5N1", lastOutbreak: "2026-05-10" },
    "France": { status: "unfavorable", risk: "medium", cases: 34, genotype: "Gen.2", lastOutbreak: "2026-05-05" },
    "Ukraine": { status: "unfavorable", risk: "medium", cases: 23, genotype: "H5", lastOutbreak: "2026-05-12" },
    "South Africa": { status: "unfavorable", risk: "medium", cases: 34, genotype: "H5N1", lastOutbreak: "2026-05-08" },
    
    // Благополучные территории (зеленые)
    "Australia": { status: "favorable", risk: "low", cases: 3, lastOutbreak: "2026-04-20" },
    "Canada": { status: "favorable", risk: "low", cases: 2, lastOutbreak: "2026-04-15" },
    "Argentina": { status: "favorable", risk: "low", cases: 1, lastOutbreak: "2026-04-10" },
    "Norway": { status: "favorable", risk: "low", cases: 0, lastOutbreak: null },
    "Sweden": { status: "favorable", risk: "low", cases: 0, lastOutbreak: null },
    "Finland": { status: "favorable", risk: "low", cases: 0, lastOutbreak: null },
    "New Zealand": { status: "favorable", risk: "low", cases: 0, lastOutbreak: null },
    "Iceland": { status: "favorable", risk: "low", cases: 0, lastOutbreak: null },
    "Germany": { status: "favorable", risk: "low", cases: 12, lastOutbreak: "2026-03-15" },
    "Japan": { status: "favorable", risk: "low", cases: 5, lastOutbreak: "2026-04-25" },
    "United Kingdom": { status: "favorable", risk: "low", cases: 7, lastOutbreak: "2026-04-18" },
    "Kazakhstan": { status: "favorable", risk: "low", cases: 8, lastOutbreak: "2026-04-30" },
    
    // Территории с неизвестным статусом (белые)
    "Greenland": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Saudi Arabia": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Iran": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Iraq": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Afghanistan": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Somalia": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Sudan": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Libya": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Yemen": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Myanmar": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "Syria": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null },
    "North Korea": { status: "unknown", risk: "unknown", cases: null, lastOutbreak: null }
  };

  // Получение цвета страны на основе статуса
  const getCountryColor = (countryName) => {
    const status = countryStatus[countryName];
    if (!status) return "#E0E0E0"; // Серый для стран без данных
    
    switch(status.status) {
      case 'favorable':
        return '#4CAF50'; // Зеленый - благополучные
      case 'unfavorable':
        return '#FF4444'; // Красный - неблагополучные
      case 'unknown':
        return '#FFFFFF'; // Белый - неизвестный статус
      default:
        return '#E0E0E0';
    }
  };

  // Получение текста статуса
  const getStatusText = (status) => {
    switch(status) {
      case 'favorable': return 'Благополучная';
      case 'unfavorable': return 'Неблагополучная';
      case 'unknown': return 'Статус неизвестен';
      default: return 'Нет данных';
    }
  };

  const getRiskText = (risk) => {
    switch(risk) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Нет данных';
    }
  };

  const handleCountryMouseEnter = (geo, evt) => {
    const countryName = geo.properties.name;
    const status = countryStatus[countryName];
    if (status) {
      setTooltipContent({
        name: countryName,
        status: status.status,
        risk: status.risk,
        cases: status.cases,
        lastOutbreak: status.lastOutbreak,
        genotype: status.genotype
      });
      setTooltipPosition({ x: evt.clientX + 10, y: evt.clientY - 50 });
    }
  };

  const handleCountryMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleZoomIn = () => {
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  return (
    <div className="realmap-wrapper">
      <div className="realmap-header">
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color favorable"></div>
            <span>Благополучные территории</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unfavorable"></div>
            <span>Неблагополучные территории</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unknown"></div>
            <span>Территории с неизвестным статусом</span>
          </div>
          <div className="legend-item">
            <div className="legend-color no-data"></div>
            <span>Нет данных</span>
          </div>
        </div>
        
        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn} title="Приблизить">
            🔍+
          </button>
          <button className="map-control-btn" onClick={handleZoomOut} title="Отдалить">
            🔍-
          </button>
          <button className="map-control-btn" onClick={handleReset} title="Сбросить вид">
            🏠
          </button>
        </div>
        
        <div className="map-filters-info">
          {selectedDisease && selectedDisease !== '' && (
            <span className="filter-badge">
              🦠 {selectedDisease === 'bird_flu' ? 'Грипп птиц' : 
                  selectedDisease === 'newcastle' ? 'Болезнь Ньюкасла' :
                  selectedDisease === 'rrss' ? 'РРСС' :
                  selectedDisease === 'rotavirus' ? 'Ротавирус КРС' : 'Бруцеллёз'}
            </span>
          )}
          {selectedAnimal && selectedAnimal !== '' && (
            <span className="filter-badge">
              🐾 {selectedAnimal === 'cattle' ? 'КРС' :
                  selectedAnimal === 'sheep' ? 'МРС' :
                  selectedAnimal === 'pigs' ? 'Свиньи' :
                  selectedAnimal === 'poultry' ? 'Птица' : 'Лошади'}
            </span>
          )}
          {selectedYear && selectedYear !== '' && (
            <span className="filter-badge">📅 {selectedYear}</span>
          )}
        </div>
      </div>

      <div className="realmap-container">
        <ComposableMap
          projectionConfig={{
            scale: 147,
            center: [0, 20]
          }}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={(newPosition) => setPosition(newPosition)}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo.properties.name)}
                    stroke="#FFFFFF"
                    strokeWidth={0.8}
                    onMouseEnter={(evt) => handleCountryMouseEnter(geo, evt)}
                    onMouseLeave={handleCountryMouseLeave}
                    onClick={() => {
                      const countryName = geo.properties.name;
                      const status = countryStatus[countryName];
                      if (status) {
                        onCountryClick({
                          name: countryName,
                          status: status.status,
                          risk: status.risk,
                          cases: status.cases,
                          lastOutbreak: status.lastOutbreak,
                          genotype: status.genotype
                        });
                      } else {
                        onCountryClick({
                          name: countryName,
                          status: "no_data",
                          risk: "unknown",
                          cases: null,
                          lastOutbreak: null
                        });
                      }
                    }}
                    style={{
                      default: { 
                        outline: "none",
                        transition: "all 0.3s ease"
                      },
                      hover: { 
                        fill: "#007aff",
                        stroke: "#fff",
                        strokeWidth: 1.5,
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.3s ease",
                        filter: "brightness(0.95)"
                      },
                      pressed: { outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            <strong>{tooltipContent.name}</strong>
            <div className="tooltip-status">Статус: {getStatusText(tooltipContent.status)}</div>
            {tooltipContent.risk && tooltipContent.risk !== 'unknown' && (
              <>
                <div className="tooltip-risk">Уровень риска: {getRiskText(tooltipContent.risk)}</div>
                {tooltipContent.cases !== null && tooltipContent.cases > 0 && (
                  <div>Зарегистрировано случаев: {tooltipContent.cases}</div>
                )}
                {tooltipContent.lastOutbreak && <div>Последняя вспышка: {tooltipContent.lastOutbreak}</div>}
                {tooltipContent.genotype && <div>Генотип: {tooltipContent.genotype}</div>}
              </>
            )}
            <div className="tooltip-hint">Кликните для детальной информации</div>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="country-details">
          <h4>📍 {selectedCountry.name}</h4>
          {selectedCountry.status && (
            <p>Статус территории: <strong className={`status-${selectedCountry.status}`}>{getStatusText(selectedCountry.status)}</strong></p>
          )}
          {selectedCountry.risk && selectedCountry.risk !== 'unknown' && selectedCountry.risk !== 'no_data' && (
            <>
              <p>Уровень риска: <strong className={`risk-${selectedCountry.risk}`}>{getRiskText(selectedCountry.risk)}</strong></p>
              {selectedCountry.cases > 0 && <p>📊 Зарегистрировано случаев: <strong>{selectedCountry.cases}</strong></p>}
              {selectedCountry.lastOutbreak && <p>📅 Последняя вспышка: {selectedCountry.lastOutbreak}</p>}
              {selectedCountry.genotype && <p>🧬 Генотип: {selectedCountry.genotype}</p>}
            </>
          )}
          {selectedDisease && selectedDisease !== '' && (
            <p>🦠 Болезнь: {
              selectedDisease === 'bird_flu' ? 'Грипп птиц' : 
              selectedDisease === 'newcastle' ? 'Болезнь Ньюкасла' :
              selectedDisease === 'rrss' ? 'РРСС' :
              selectedDisease === 'rotavirus' ? 'Ротавирус КРС' : 'Бруцеллёз'
            }</p>
          )}
          {selectedAnimal && selectedAnimal !== '' && (
            <p>🐾 Вид животных: {
              selectedAnimal === 'cattle' ? 'КРС' :
              selectedAnimal === 'sheep' ? 'МРС' :
              selectedAnimal === 'pigs' ? 'Свиньи' :
              selectedAnimal === 'poultry' ? 'Птица' : 'Лошади'
            }</p>
          )}
          <div className="details-note">Данные на {new Date().toLocaleDateString('ru-RU')}</div>
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;
