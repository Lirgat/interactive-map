import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import './styles/RealWorldMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

// Расширенные данные по годам с детальной информацией
const yearlyData = {
  2024: {
    "Russia": { 
      status: "favorable", 
      risk: "low", 
      cases: 12, 
      genotype: "H5", 
      lastOutbreak: "2024-03-10", 
      animals: ["poultry"],
      mortality: "2.3%",
      vaccines: ["ВГП-Инакт", "Авифлю-М"],
      regions: ["Московская обл.", "Краснодарский край"]
    },
    "China": { 
      status: "unfavorable", 
      risk: "medium", 
      cases: 45, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2024-05-15", 
      animals: ["poultry", "pigs"],
      mortality: "5.1%",
      vaccines: ["Re-11", "Re-12"],
      regions: ["Guangdong", "Hunan"]
    },
    "India": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 78, 
      genotype: "H5N1", 
      lastOutbreak: "2024-06-20", 
      animals: ["poultry", "cattle"],
      mortality: "8.2%",
      vaccines: ["INFLUVAC", "H5N1-Vac"],
      regions: ["Maharashtra", "West Bengal"]
    },
    "Vietnam": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 56, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2024-07-01", 
      animals: ["poultry"],
      mortality: "6.8%",
      vaccines: ["NAVET-ASFVAC"],
      regions: ["Mekong Delta", "Red River Delta"]
    },
    "Indonesia": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 67, 
      genotype: "H5N1", 
      lastOutbreak: "2024-06-25", 
      animals: ["poultry"],
      mortality: "7.5%",
      vaccines: ["Vaksin AI"],
      regions: ["Java", "Bali"]
    },
    "USA": { 
      status: "favorable", 
      risk: "low", 
      cases: 8, 
      genotype: "Gen.2", 
      lastOutbreak: "2024-02-10", 
      animals: ["poultry"],
      mortality: "1.2%",
      vaccines: ["AI-Vac 2024"],
      regions: ["California", "Iowa"]
    }
  },
  2025: {
    "Russia": { 
      status: "unfavorable", 
      risk: "medium", 
      cases: 56, 
      genotype: "H5", 
      lastOutbreak: "2025-08-10", 
      animals: ["poultry", "pigs"],
      mortality: "3.8%",
      vaccines: ["ВГП-Инакт", "Флу-М"],
      regions: ["Московская обл.", "Ленинградская обл.", "Краснодарский край"]
    },
    "China": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 123, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2025-10-15", 
      animals: ["poultry", "pigs"],
      mortality: "6.2%",
      vaccines: ["Re-13", "Re-14"],
      regions: ["Guangdong", "Hunan", "Sichuan"]
    },
    "India": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 189, 
      genotype: "H5N1", 
      lastOutbreak: "2025-11-20", 
      animals: ["poultry", "cattle"],
      mortality: "9.1%",
      vaccines: ["INFLUVAC Plus", "H5N1-Vac 2.0"],
      regions: ["Maharashtra", "West Bengal", "Kerala"]
    },
    "USA": { 
      status: "unfavorable", 
      risk: "medium", 
      cases: 34, 
      genotype: "Gen.7", 
      lastOutbreak: "2025-07-15", 
      animals: ["poultry", "pigs"],
      mortality: "2.8%",
      vaccines: ["AI-Vac 2025"],
      regions: ["California", "Iowa", "Minnesota"]
    },
    "France": { 
      status: "unfavorable", 
      risk: "medium", 
      cases: 23, 
      genotype: "Gen.2", 
      lastOutbreak: "2025-08-20", 
      animals: ["poultry"],
      mortality: "3.2%",
      vaccines: ["VaxFlu AI"],
      regions: ["Brittany", "Pays de la Loire"]
    },
    "Nigeria": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 56, 
      genotype: "H5N1", 
      lastOutbreak: "2025-10-10", 
      animals: ["poultry"],
      mortality: "11.3%",
      vaccines: ["NIPVAC"],
      regions: ["Kano", "Kaduna"]
    }
  },
  2026: {
    "Russia": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 145, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2026-05-15", 
      animals: ["poultry", "pigs"],
      mortality: "5.2%",
      vaccines: ["ВГП-Инакт 2026", "Авифлю-Про"],
      regions: ["Московская обл.", "Ленинградская обл.", "Краснодарский край", "Ростовская обл."],
      controlMeasures: "Введён карантин в 4 регионах, проводится вакцинация",
      economicDamage: "145 млн рублей"
    },
    "China": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 234, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2026-06-01", 
      animals: ["poultry", "pigs"],
      mortality: "7.8%",
      vaccines: ["Re-15", "Re-16"],
      regions: ["Guangdong", "Hunan", "Sichuan", "Zhejiang"],
      controlMeasures: "Массовая вакцинация, контроль транспорта",
      economicDamage: "890 млн юаней"
    },
    "India": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 312, 
      genotype: "H5N1", 
      lastOutbreak: "2026-05-28", 
      animals: ["poultry", "cattle"],
      mortality: "10.5%",
      vaccines: ["INFLUVAC Pro", "H5N1-Vac 2026"],
      regions: ["Maharashtra", "West Bengal", "Kerala", "Uttar Pradesh"],
      controlMeasures: "Экстренная вакцинация, зонирование",
      economicDamage: "1.2 млрд рупий"
    },
    "Vietnam": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 178, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2026-05-30", 
      animals: ["poultry"],
      mortality: "8.9%",
      vaccines: ["NAVET-AI 2026"],
      regions: ["Mekong Delta", "Red River Delta", "Central Coast"],
      controlMeasures: "Контроль рынков птицы",
      economicDamage: "456 млрд донгов"
    },
    "USA": { 
      status: "unfavorable", 
      risk: "medium", 
      cases: 89, 
      genotype: "Gen.7", 
      lastOutbreak: "2026-04-20", 
      animals: ["poultry", "pigs"],
      mortality: "4.1%",
      vaccines: ["AI-Vac 2026"],
      regions: ["California", "Iowa", "Minnesota", "Nebraska"],
      controlMeasures: "Дезинфекция ферм",
      economicDamage: "234 млн долларов"
    },
    "Germany": { 
      status: "favorable", 
      risk: "low", 
      cases: 12, 
      genotype: "H5", 
      lastOutbreak: "2026-03-15", 
      animals: ["poultry"],
      mortality: "1.8%",
      vaccines: ["Vectormune AI"],
      regions: ["Lower Saxony", "Bavaria"],
      controlMeasures: "Наблюдение за дикими птицами"
    },
    "Bangladesh": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 123, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2026-05-27", 
      animals: ["poultry"],
      mortality: "12.3%",
      vaccines: ["Bimevax"],
      regions: ["Dhaka", "Chittagong"],
      controlMeasures: "Экстренная вакцинация",
      economicDamage: "345 млн так"
    }
  },
  2027: {
    "Russia": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 167, 
      genotype: "2.3.4.4b", 
      lastOutbreak: "2027-03-15", 
      animals: ["poultry", "pigs", "cattle"],
      mortality: "6.1%",
      vaccines: ["ВГП-Инакт 2027", "Авифлю-Эксперт"],
      regions: ["Московская обл.", "Ленинградская обл.", "Краснодарский край", "Ростовская обл.", "Ставропольский край"],
      controlMeasures: "Полный карантин в 5 регионах, усиление биозащиты",
      economicDamage: "234 млн рублей",
      forecast: "Рост числа вспышек ожидается в 2-3 квартале"
    },
    "China": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 289, 
      genotype: "2.3.4.4c", 
      lastOutbreak: "2027-04-01", 
      animals: ["poultry", "pigs"],
      mortality: "9.2%",
      vaccines: ["Re-17", "Re-18"],
      regions: ["Guangdong", "Hunan", "Sichuan", "Zhejiang", "Fujian"],
      controlMeasures: "Массовая вакцинация, ограничения на перемещение",
      economicDamage: "1.5 млрд юаней",
      forecast: "Ожидается стабилизация к концу года"
    },
    "India": { 
      status: "unfavorable", 
      risk: "high", 
      cases: 356, 
      genotype: "H5N1", 
      lastOutbreak: "2027-03-28", 
      animals: ["poultry", "cattle"],
      mortality: "11.8%",
      vaccines: ["INFLUVAC Max", "H5N1-Vac 2027"],
      regions: ["Maharashtra", "West Bengal", "Kerala", "Uttar Pradesh", "Tamil Nadu"],
      controlMeasures: "Экстренные меры, зонирование, вакцинация",
      economicDamage: "1.8 млрд рупий",
      forecast: "Пик ожидается во 2-м квартале"
    }
  }
};

const favorableCountries = [
  "Australia", "Canada", "Argentina", "Norway", "Sweden", 
  "Finland", "New Zealand", "Iceland", "Greenland", "Japan"
];

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

  const matchesDisease = (countryName, disease) => {
    if (!disease) return true;
    const yearData = currentData[countryName];
    if (!yearData) return false;
    const diseaseGenotypes = {
      'bird_flu': ['H5N1', '2.3.4.4b', '2.3.4.4c', 'H5'],
      'newcastle': ['Gen.2', 'Gen.7'],
      'rrss': ['RRSS'],
      'rotavirus': ['Rotavirus'],
      'brucellosis': ['Brucella']
    };
    const matchingGenotypes = diseaseGenotypes[disease] || [];
    return matchingGenotypes.some(gen => yearData.genotype?.includes(gen));
  };

  const matchesAnimal = (countryName, animal) => {
    if (!animal) return true;
    const yearData = currentData[countryName];
    if (!yearData) return false;
    return yearData.animals?.includes(animal);
  };

  const getCountryColor = (countryName) => {
    if (selectedDisease && !matchesDisease(countryName, selectedDisease)) {
      return "#D1D5DB";
    }
    if (selectedAnimal && !matchesAnimal(countryName, selectedAnimal)) {
      return "#D1D5DB";
    }
    
    const yearData = currentData[countryName];
    if (yearData) {
      return yearData.status === 'favorable' ? '#10B981' : '#EF4444';
    }
    if (favorableCountries.includes(countryName)) {
      return '#10B981';
    }
    return '#D1D5DB';
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'favorable': return 'Благополучная';
      case 'unfavorable': return 'Неблагополучная';
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

  const getAnimalNames = (animals) => {
    const names = {
      'cattle': 'КРС',
      'sheep': 'МРС',
      'pigs': 'Свиньи',
      'poultry': 'Птица',
      'horses': 'Лошади'
    };
    return animals?.map(a => names[a]).join(', ') || 'Нет данных';
  };

  const handleCountryMouseEnter = (geo, evt) => {
    const countryName = geo.properties.name;
    const yearData = currentData[countryName];
    
    if (yearData) {
      setTooltipContent({
        name: countryName,
        status: yearData.status,
        risk: yearData.risk,
        cases: yearData.cases,
        lastOutbreak: yearData.lastOutbreak,
        genotype: yearData.genotype,
        animals: yearData.animals,
        mortality: yearData.mortality,
        vaccines: yearData.vaccines,
        regions: yearData.regions,
        controlMeasures: yearData.controlMeasures,
        economicDamage: yearData.economicDamage,
        forecast: yearData.forecast
      });
      setTooltipPosition({ x: evt.clientX + 15, y: evt.clientY - 50 });
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
            <div className="legend-color no-data"></div>
            <span>Нет данных / Не соответствует фильтрам</span>
          </div>
        </div>
        
        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn}>+</button>
          <button className="map-control-btn" onClick={handleZoomOut}>-</button>
          <button className="map-control-btn" onClick={handleReset}>⌂</button>
        </div>
      </div>

      <div className="realmap-container">
        <ComposableMap projectionConfig={{ scale: 147, center: [0, 20] }} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={(newPosition) => setPosition(newPosition)}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const isFilteredOut = (selectedDisease && !matchesDisease(countryName, selectedDisease)) ||
                                        (selectedAnimal && !matchesAnimal(countryName, selectedAnimal));
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isFilteredOut ? "#D1D5DB" : getCountryColor(countryName)}
                      stroke="#FFFFFF"
                      strokeWidth={0.6}
                      onMouseEnter={(evt) => handleCountryMouseEnter(geo, evt)}
                      onMouseLeave={handleCountryMouseLeave}
                      onClick={() => {
                        const yearData = currentData[countryName];
                        if (yearData) {
                          onCountryClick({
                            name: countryName,
                            status: yearData.status,
                            risk: yearData.risk,
                            cases: yearData.cases,
                            lastOutbreak: yearData.lastOutbreak,
                            genotype: yearData.genotype,
                            animals: yearData.animals,
                            mortality: yearData.mortality,
                            vaccines: yearData.vaccines,
                            regions: yearData.regions,
                            controlMeasures: yearData.controlMeasures,
                            economicDamage: yearData.economicDamage,
                            forecast: yearData.forecast,
                            year: selectedYear || 2026
                          });
                        } else {
                          onCountryClick({
                            name: countryName,
                            status: 'no_data',
                            risk: 'unknown',
                            cases: null,
                            year: selectedYear || 2026
                          });
                        }
                      }}
                      style={{
                        default: { outline: "none", transition: "all 0.2s ease" },
                        hover: { 
                          fill: getCountryColor(countryName) === "#EF4444" ? "#DC2626" :
                                 getCountryColor(countryName) === "#10B981" ? "#059669" : "#6B7280",
                          stroke: "#fff",
                          strokeWidth: 1.5,
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s ease"
                        },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            <div className="tooltip-header">{tooltipContent.name}</div>
            <div className="tooltip-section">
              <div className="tooltip-row"><span className="tooltip-label">Статус:</span> {getStatusText(tooltipContent.status)}</div>
              <div className="tooltip-row"><span className="tooltip-label">Уровень риска:</span> {getRiskText(tooltipContent.risk)}</div>
              <div className="tooltip-row"><span className="tooltip-label">Зарегистрировано случаев:</span> {tooltipContent.cases}</div>
              <div className="tooltip-row"><span className="tooltip-label">Последняя вспышка:</span> {tooltipContent.lastOutbreak}</div>
              <div className="tooltip-row"><span className="tooltip-label">Генотип:</span> {tooltipContent.genotype}</div>
              <div className="tooltip-row"><span className="tooltip-label">Пораженные виды:</span> {getAnimalNames(tooltipContent.animals)}</div>
              <div className="tooltip-row"><span className="tooltip-label">Летальность:</span> {tooltipContent.mortality || 'Нет данных'}</div>
              {tooltipContent.regions && (
                <div className="tooltip-row"><span className="tooltip-label">Затронутые регионы:</span> {tooltipContent.regions.join(', ')}</div>
              )}
            </div>
            <div className="tooltip-hint">Кликните для просмотра детальной информации</div>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div className="country-details">
          <div className="details-header">📍 {selectedCountry.name}</div>
          <div className="details-content">
            <div className="details-row">
              <span className="details-label">Период анализа:</span>
              <span className="details-value">{selectedCountry.year} год</span>
            </div>
            <div className="details-row">
              <span className="details-label">Эпизоотический статус:</span>
              <span className={`status-badge ${selectedCountry.status}`}>{getStatusText(selectedCountry.status)}</span>
            </div>
            {selectedCountry.risk && selectedCountry.risk !== 'unknown' && (
              <>
                <div className="details-row">
                  <span className="details-label">Уровень биологической угрозы:</span>
                  <span className={`risk-badge ${selectedCountry.risk}`}>{getRiskText(selectedCountry.risk)}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Количество зарегистрированных случаев:</span>
                  <span className="details-value">{selectedCountry.cases}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Дата последней вспышки:</span>
                  <span className="details-value">{selectedCountry.lastOutbreak}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Генотип возбудителя:</span>
                  <span className="details-value">{selectedCountry.genotype}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Пораженные виды животных:</span>
                  <span className="details-value">{getAnimalNames(selectedCountry.animals)}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Уровень летальности:</span>
                  <span className="details-value">{selectedCountry.mortality || 'Нет данных'}</span>
                </div>
                {selectedCountry.vaccines && (
                  <div className="details-row">
                    <span className="details-label">Применяемые вакцины:</span>
                    <span className="details-value">{selectedCountry.vaccines.join(', ')}</span>
                  </div>
                )}
                {selectedCountry.regions && (
                  <div className="details-row">
                    <span className="details-label">Затронутые административные территории:</span>
                    <span className="details-value">{selectedCountry.regions.join(', ')}</span>
                  </div>
                )}
                {selectedCountry.controlMeasures && (
                  <div className="details-row">
                    <span className="details-label">Проводимые противоэпизоотические мероприятия:</span>
                    <span className="details-value">{selectedCountry.controlMeasures}</span>
                  </div>
                )}
                {selectedCountry.economicDamage && (
                  <div className="details-row">
                    <span className="details-label">Экономический ущерб:</span>
                    <span className="details-value">{selectedCountry.economicDamage}</span>
                  </div>
                )}
                {selectedCountry.forecast && (
                  <div className="details-row">
                    <span className="details-label">Прогноз развития эпизоотической ситуации:</span>
                    <span className="details-value forecast">{selectedCountry.forecast}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="details-footer">Данные Единой платформы прогнозирования | {new Date().toLocaleDateString('ru-RU')}</div>
        </div>
      )}
    </div>
  );
};

export default RealWorldMap;
