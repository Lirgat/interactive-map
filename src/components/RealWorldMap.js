import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import './styles/RealWorldMap.css';

// URL для данных карты мира
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

const RealWorldMap = ({ onCountryClick, selectedCountry, selectedDisease, selectedAnimal, selectedYear }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Данные о вспышках болезней
  const outbreaks = [
    { name: "Россия", coordinates: [100, 60], risk: "high", cases: 145, lastOutbreak: "2026-05-15", genotype: "2.3.4.4b" },
    { name: "Китай", coordinates: [105, 35], risk: "high", cases: 234, lastOutbreak: "2026-06-01", genotype: "2.3.4.4b" },
    { name: "Индия", coordinates: [78, 20], risk: "high", cases: 312, lastOutbreak: "2026-05-28", genotype: "H5N1" },
    { name: "США", coordinates: [-100, 40], risk: "medium", cases: 89, lastOutbreak: "2026-04-20", genotype: "Gen.7" },
    { name: "Бразилия", coordinates: [-55, -15], risk: "medium", cases: 67, lastOutbreak: "2026-05-10", genotype: "H5N1" },
    { name: "Германия", coordinates: [10, 51], risk: "low", cases: 12, lastOutbreak: "2026-03-15", genotype: "H5" },
    { name: "Франция", coordinates: [2, 46], risk: "medium", cases: 34, lastOutbreak: "2026-05-05", genotype: "Gen.2" },
    { name: "Вьетнам", coordinates: [108, 16], risk: "high", cases: 178, lastOutbreak: "2026-05-30", genotype: "2.3.4.4b" },
    { name: "Индонезия", coordinates: [120, -5], risk: "high", cases: 198, lastOutbreak: "2026-05-25", genotype: "H5N1" },
    { name: "Египет", coordinates: [29, 26], risk: "medium", cases: 45, lastOutbreak: "2026-04-28", genotype: "H5" },
    { name: "Нигерия", coordinates: [8, 9], risk: "high", cases: 89, lastOutbreak: "2026-05-20", genotype: "H5N1" },
    { name: "Украина", coordinates: [32, 49], risk: "medium", cases: 23, lastOutbreak: "2026-05-12", genotype: "H5" },
    { name: "Казахстан", coordinates: [68, 48], risk: "low", cases: 8, lastOutbreak: "2026-04-30", genotype: "H5" },
    { name: "Япония", coordinates: [138, 36], risk: "low", cases: 5, lastOutbreak: "2026-04-25", genotype: "H5" },
    { name: "Великобритания", coordinates: [-2, 54], risk: "low", cases: 7, lastOutbreak: "2026-04-18", genotype: "H5" },
    { name: "ЮАР", coordinates: [25, -30], risk: "medium", cases: 34, lastOutbreak: "2026-05-08", genotype: "H5N1" },
    { name: "Турция", coordinates: [35, 39], risk: "medium", cases: 28, lastOutbreak: "2026-05-14", genotype: "H5" },
    { name: "Пакистан", coordinates: [69, 30], risk: "high", cases: 67, lastOutbreak: "2026-05-22", genotype: "H5N1" },
    { name: "Бангладеш", coordinates: [90, 24], risk: "high", cases: 123, lastOutbreak: "2026-05-27", genotype: "2.3.4.4b" },
    { name: "Мьянма", coordinates: [96, 22], risk: "medium", cases: 45, lastOutbreak: "2026-05-19", genotype: "H5" }
  ];

  // Фильтрация данных
  const getFilteredOutbreaks = () => {
    let filtered = [...outbreaks];
    
    if (selectedDisease && selectedDisease !== '') {
      // В реальном приложении здесь будет фильтрация по болезни
      console.log('Filter by disease:', selectedDisease);
    }
    
    if (selectedAnimal && selectedAnimal !== '') {
      console.log('Filter by animal:', selectedAnimal);
    }
    
    return filtered;
  };

  const filteredOutbreaks = getFilteredOutbreaks();

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFA500';
      case 'low': return '#FFD700';
      default: return '#E0E0E0';
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

  const handleMouseEnter = (outbreak, evt) => {
    setTooltipContent(outbreak);
    setTooltipPosition({ x: evt.clientX + 10, y: evt.clientY - 50 });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const getMarkerSize = (risk) => {
    switch(risk) {
      case 'high': return 12;
      case 'medium': return 9;
      case 'low': return 6;
      default: return 6;
    }
  };

  return (
    <div className="realmap-wrapper">
      <div className="realmap-header">
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color high-risk"></div>
            <span>Высокий риск (активные вспышки)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium-risk"></div>
            <span>Средний риск (единичные случаи)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-risk"></div>
            <span>Низкий риск (стабильная ситуация)</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker-example"></div>
            <span>Очаг заболевания</span>
          </div>
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
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#D4E6F1"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        fill: "#007aff",
                        stroke: "#fff",
                        strokeWidth: 1,
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.3s ease"
                      },
                      pressed: { outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>
            
            {filteredOutbreaks.map((outbreak, idx) => (
              <Marker
                key={idx}
                coordinates={outbreak.coordinates}
                onMouseEnter={(evt) => handleMouseEnter(outbreak, evt)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onCountryClick(outbreak)}
              >
                <circle
                  r={getMarkerSize(outbreak.risk)}
                  fill={getRiskColor(outbreak.risk)}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  opacity={0.9}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            <strong>{tooltipContent.name}</strong>
            <div className="tooltip-risk">Риск: {getRiskText(tooltipContent.risk)}</div>
            <div>Случаев: {tooltipContent.cases}</div>
            <div>Последняя вспышка: {tooltipContent.lastOutbreak}</div>
            {tooltipContent.genotype && <div>Генотип: {tooltipContent.genotype}</div>}
            <div className="tooltip-hint">Кликните для деталей</div>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="country-details">
          <h4>📍 {selectedCountry.name}</h4>
          <p>Уровень риска: <strong className={`risk-${selectedCountry.risk}`}>{getRiskText(selectedCountry.risk)}</strong></p>
          <p>📊 Зарегистрировано случаев: <strong>{selectedCountry.cases}</strong></p>
          <p>📅 Последняя вспышка: {selectedCountry.lastOutbreak}</p>
          {selectedCountry.genotype && <p>🧬 Генотип: {selectedCountry.genotype}</p>}
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
