import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { yearlyData, favorableCountries } from '../data/countryData';
import './styles/RealWorldMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

const RealWorldMap = ({ onCountryClick, selectedCountry, selectedDisease, selectedAnimal, selectedYear }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [currentData, setCurrentData] = useState(yearlyData[2026]);

  useEffect(() => {
    if (selectedYear && yearlyData[selectedYear]) {
      setCurrentData(yearlyData[selectedYear]);
    } else if (!selectedYear) {
      setCurrentData(yearlyData[2026]);
    }
  }, [selectedYear]);

  const matchesFilters = (countryName) => {
    const yearData = currentData[countryName];
    if (!yearData) return false;
    
    if (selectedDisease) {
      const diseaseGenotypes = {
        'bird_flu': ['H5N1', '2.3.4.4b', '2.3.4.4c', 'H5'],
        'newcastle': ['Gen.2', 'Gen.7'],
        'rrss': ['RRSS'],
        'rotavirus': ['Rotavirus'],
        'brucellosis': ['Brucella']
      };
      const matchingGenotypes = diseaseGenotypes[selectedDisease] || [];
      if (!matchingGenotypes.some(gen => yearData.genotype?.includes(gen))) {
        return false;
      }
    }
    
    if (selectedAnimal && !yearData.animals?.includes(selectedAnimal)) {
      return false;
    }
    
    return true;
  };

  const getCountryColor = (countryName) => {
    if (!matchesFilters(countryName)) {
      return "#bdc3c7";
    }
    
    const yearData = currentData[countryName];
    if (yearData) {
      return yearData.status === 'favorable' ? '#27ae60' : '#e74c3c';
    }
    if (favorableCountries.includes(countryName)) {
      return '#27ae60';
    }
    return "#bdc3c7";
  };

  const getStatusText = (status) => status === 'favorable' ? 'Благополучная' : 'Неблагополучная';
  const getRiskText = (risk) => risk === 'high' ? 'Высокий' : risk === 'medium' ? 'Средний' : 'Низкий';

  const getAnimalNames = (animals) => {
    const names = { 'cattle': 'КРС', 'sheep': 'МРС', 'pigs': 'Свиньи', 'poultry': 'Птица', 'horses': 'Лошади' };
    return animals?.map(a => names[a]).join(', ') || 'Нет данных';
  };

  const handleCountryMouseEnter = (geo, evt) => {
    const countryName = geo.properties.name;
    const yearData = currentData[countryName];
    
    if (yearData && matchesFilters(countryName)) {
      setTooltipContent({
        name: countryName,
        status: yearData.status,
        risk: yearData.risk,
        cases: yearData.cases,
        lastOutbreak: yearData.lastOutbreak,
        genotype: yearData.genotype,
        animals: yearData.animals,
        mortality: yearData.mortality,
        regions: yearData.regions,
        economicDamage: yearData.economicDamage,
        forecast: yearData.forecast,
        controlMeasures: yearData.controlMeasures
      });
      setTooltipPosition({ x: evt.clientX + 12, y: evt.clientY - 40 });
    }
  };

  const handleCountryMouseLeave = () => setTooltipContent(null);

  const handleZoomIn = () => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  const handleZoomOut = () => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  const handleReset = () => setPosition({ coordinates: [0, 20], zoom: 1 });

  return (
    <div className="realmap-wrapper">
      <div className="realmap-header">
        <div className="map-legend">
          <div className="legend-item"><div className="legend-color favorable"></div><span>Благополучные территории</span></div>
          <div className="legend-item"><div className="legend-color unfavorable"></div><span>Неблагополучные территории</span></div>
          <div className="legend-item"><div className="legend-color no-data"></div><span>Нет данных / Не соответствует фильтрам</span></div>
        </div>
        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn}>+</button>
          <button className="map-control-btn" onClick={handleZoomOut}>-</button>
          <button className="map-control-btn" onClick={handleReset}>⌂</button>
        </div>
      </div>

      <div className="realmap-container">
        <ComposableMap projectionConfig={{ scale: 147, center: [0, 20] }} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup zoom={position.zoom} center={position.coordinates}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo.properties.name)}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    onMouseEnter={(evt) => handleCountryMouseEnter(geo, evt)}
                    onMouseLeave={handleCountryMouseLeave}
                    onClick={() => {
                      const yearData = currentData[geo.properties.name];
                      if (yearData && matchesFilters(geo.properties.name)) {
                        onCountryClick({
                          name: geo.properties.name,
                          ...yearData,
                          year: selectedYear || 2026
                        });
                      }
                    }}
                    style={{
                      default: { outline: "none", border: "none" },
                      hover: { 
                        fill: getCountryColor(geo.properties.name) === "#e74c3c" ? "#c0392b" :
                               getCountryColor(geo.properties.name) === "#27ae60" ? "#1e8449" : "#95a5a6",
                        stroke: "#ffffff",
                        strokeWidth: 0.8,
                        cursor: "pointer",
                        outline: "none",
                        border: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            <div className="tooltip-header">{tooltipContent.name}</div>
            <div className="tooltip-row"><span className="tooltip-label">Статус:</span> {getStatusText(tooltipContent.status)}</div>
            <div className="tooltip-row"><span className="tooltip-label">Риск:</span> {getRiskText(tooltipContent.risk)}</div>
            <div className="tooltip-row"><span className="tooltip-label">Случаев:</span> {tooltipContent.cases}</div>
            <div className="tooltip-row"><span className="tooltip-label">Последняя вспышка:</span> {tooltipContent.lastOutbreak}</div>
            <div className="tooltip-row"><span className="tooltip-label">Генотип:</span> {tooltipContent.genotype}</div>
            <div className="tooltip-row"><span className="tooltip-label">Пораженные виды:</span> {getAnimalNames(tooltipContent.animals)}</div>
            <div className="tooltip-row"><span className="tooltip-label">Летальность:</span> {tooltipContent.mortality}</div>
            {tooltipContent.regions && <div className="tooltip-row"><span className="tooltip-label">Регионы:</span> {tooltipContent.regions.join(', ')}</div>}
            {tooltipContent.controlMeasures && <div className="tooltip-row"><span className="tooltip-label">Мероприятия:</span> {tooltipContent.controlMeasures}</div>}
            <div className="tooltip-hint">Кликните для детальной информации</div>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="country-details">
          <div className="details-header">{selectedCountry.name}</div>
          <div className="details-content">
            <div className="details-row"><span className="details-label">Период:</span> {selectedCountry.year} год</div>
            <div className="details-row"><span className="details-label">Статус:</span> <span className={`status-badge ${selectedCountry.status}`}>{getStatusText(selectedCountry.status)}</span></div>
            {selectedCountry.risk && (
              <>
                <div className="details-row"><span className="details-label">Уровень риска:</span> <span className={`risk-badge ${selectedCountry.risk}`}>{getRiskText(selectedCountry.risk)}</span></div>
                <div className="details-row"><span className="details-label">Количество случаев:</span> {selectedCountry.cases}</div>
                <div className="details-row"><span className="details-label">Последняя вспышка:</span> {selectedCountry.lastOutbreak}</div>
                <div className="details-row"><span className="details-label">Генотип:</span> {selectedCountry.genotype}</div>
                <div className="details-row"><span className="details-label">Пораженные виды:</span> {getAnimalNames(selectedCountry.animals)}</div>
                <div className="details-row"><span className="details-label">Летальность:</span> {selectedCountry.mortality}</div>
                {selectedCountry.regions && <div className="details-row"><span className="details-label">Затронутые регионы:</span> {selectedCountry.regions.join(', ')}</div>}
                {selectedCountry.controlMeasures && <div className="details-row"><span className="details-label">Мероприятия:</span> {selectedCountry.controlMeasures}</div>}
                {selectedCountry.economicDamage && <div className="details-row"><span className="details-label">Экономический ущерб:</span> {selectedCountry.economicDamage}</div>}
                {selectedCountry.forecast && <div className="details-row forecast"><span className="details-label">Прогноз:</span> {selectedCountry.forecast}</div>}
              </>
            )}
          </div>
          <div className="details-footer">Единая платформа прогнозирования | {new Date().toLocaleDateString('ru-RU')}</div>
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;
