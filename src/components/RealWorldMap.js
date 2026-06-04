import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { yearlyData, favorableCountries } from '../data/countryData';
import PhylogenyChart from './PhylogenyChart';
import './styles/RealWorldMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

// Данные о очагах заболеваний в России
const russiaOutbreaks = [
  // Высокий риск
  { id: 1, name: "Птицефабрика 'Московская'", location: "Московская область", coordinates: [37.8, 55.7], disease: "Грипп птиц H5N1", date: "2026-05-15", animals: "Птица", cases: 14500, risk: "high", genotype: "2.3.4.4b" },
  { id: 2, name: "Свинокомплекс 'Краснодарский'", location: "Краснодарский край", coordinates: [39.3, 45.0], disease: "АЧС", date: "2026-05-10", animals: "Свиньи", cases: 3200, risk: "high", genotype: "Gen.II" },
  { id: 3, name: "Птицефабрика 'Ростовская'", location: "Ростовская область", coordinates: [39.7, 47.2], disease: "Грипп птиц H5N1", date: "2026-05-20", animals: "Птица", cases: 8900, risk: "high", genotype: "2.3.4.4b" },
  { id: 4, name: "Птицеводческий комплекс 'Свердловский'", location: "Свердловская область", coordinates: [60.6, 56.8], disease: "Болезнь Ньюкасла", date: "2026-04-28", animals: "Птица", cases: 8900, risk: "high", genotype: "Gen.VII" },
  { id: 5, name: "Птицефабрика 'Ставропольская'", location: "Ставропольский край", coordinates: [41.9, 45.0], disease: "Грипп птиц H5N1", date: "2026-05-12", animals: "Птица", cases: 6700, risk: "high", genotype: "2.3.4.4b" },
  { id: 6, name: "Свиноводческий комплекс 'Волгоградский'", location: "Волгоградская область", coordinates: [44.5, 48.7], disease: "АЧС", date: "2026-05-08", animals: "Свиньи", cases: 2100, risk: "high", genotype: "Gen.II" },
  { id: 7, name: "Птицефабрика 'Воронежская'", location: "Воронежская область", coordinates: [39.2, 51.7], disease: "Грипп птиц H5N1", date: "2026-05-18", animals: "Птица", cases: 5600, risk: "high", genotype: "2.3.4.4b" },
  { id: 8, name: "Свинокомплекс 'Белгородский'", location: "Белгородская область", coordinates: [36.6, 50.6], disease: "АЧС", date: "2026-05-14", animals: "Свиньи", cases: 2800, risk: "high", genotype: "Gen.II" },
  
  // Средний риск
  { id: 9, name: "Ферма 'Казанская'", location: "Республика Татарстан", coordinates: [49.1, 55.8], disease: "РРСС", date: "2026-05-05", animals: "Свиньи", cases: 1800, risk: "medium", genotype: "PRRSV-2" },
  { id: 10, name: "Молочная ферма 'Ленинградская'", location: "Ленинградская область", coordinates: [30.3, 59.9], disease: "Бруцеллёз КРС", date: "2026-04-20", animals: "КРС", cases: 450, risk: "medium", genotype: "B.abortus" },
  { id: 11, name: "Ферма 'Нижегородская'", location: "Нижегородская область", coordinates: [44.0, 56.3], disease: "РРСС", date: "2026-04-25", animals: "Свиньи", cases: 1200, risk: "medium", genotype: "PRRSV-1" },
  { id: 12, name: "Молочный комплекс 'Вологодский'", location: "Вологодская область", coordinates: [39.9, 59.2], disease: "Бруцеллёз КРС", date: "2026-04-18", animals: "КРС", cases: 320, risk: "medium", genotype: "B.melitensis" },
  { id: 13, name: "Птицефабрика 'Липецкая'", location: "Липецкая область", coordinates: [39.6, 52.6], disease: "Болезнь Ньюкасла", date: "2026-05-02", animals: "Птица", cases: 3400, risk: "medium", genotype: "Gen.II" },
  { id: 14, name: "Ферма 'Саратовская'", location: "Саратовская область", coordinates: [46.0, 51.5], disease: "Ротавирус КРС", date: "2026-04-30", animals: "КРС", cases: 280, risk: "medium", genotype: "G6P[5]" },
  
  // Низкий риск
  { id: 15, name: "Ферма 'Тверская'", location: "Тверская область", coordinates: [35.9, 56.9], disease: "Ротавирус КРС", date: "2026-04-10", animals: "КРС", cases: 95, risk: "low", genotype: "G8P[1]" },
  { id: 16, name: "Птицефабрика 'Калужская'", location: "Калужская область", coordinates: [36.3, 54.5], disease: "Болезнь Ньюкасла", date: "2026-04-05", animals: "Птица", cases: 450, risk: "low", genotype: "Gen.I" }
];

const RealWorldMap = ({ onCountryClick, selectedCountry, selectedDisease, selectedAnimal, selectedYear }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [currentData, setCurrentData] = useState(yearlyData[2026]);
  const [showPhylogeny, setShowPhylogeny] = useState(false);

  useEffect(() => {
    if (selectedYear && yearlyData[selectedYear]) {
      setCurrentData(yearlyData[selectedYear]);
    } else if (!selectedYear) {
      setCurrentData(yearlyData[2026]);
    }
  }, [selectedYear]);

  // Функция открытия филогенетического дерева
  const openPhylogenyChart = () => {
    if (selectedDisease === 'bird_flu') {
      setShowPhylogeny(true);
    }
  };

  // Фильтрация очагов по выбранной болезни и животному
  const getFilteredOutbreaks = () => {
    let filtered = [...russiaOutbreaks];
    
    // Фильтр по болезни (если выбрано не "Все")
    if (selectedDisease && selectedDisease !== 'all' && selectedDisease !== '') {
      const diseaseMap = {
        'bird_flu': ['Грипп птиц', 'H5N1'],
        'newcastle': ['Болезнь Ньюкасла'],
        'rrss': ['РРСС'],
        'rotavirus': ['Ротавирус'],
        'brucellosis': ['Бруцеллёз']
      };
      const matchingDiseases = diseaseMap[selectedDisease] || [];
      filtered = filtered.filter(o => 
        matchingDiseases.some(d => o.disease.includes(d))
      );
    }
    
    // Фильтр по животному
    if (selectedAnimal && selectedAnimal !== '') {
      const animalMap = {
        'poultry': 'Птица',
        'pigs': 'Свиньи',
        'cattle': 'КРС',
        'sheep': 'МРС',
        'horses': 'Лошади'
      };
      const targetAnimal = animalMap[selectedAnimal];
      if (targetAnimal) {
        filtered = filtered.filter(o => o.animals === targetAnimal);
      }
    }
    
    return filtered;
  };

  const matchesFilters = (countryName) => {
    const yearData = currentData[countryName];
    if (!yearData) return false;
    
    // Если выбрано "Все заболевания" - не фильтруем по болезни
    if (selectedDisease && selectedDisease !== 'all' && selectedDisease !== '') {
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
    
    if (selectedAnimal && selectedAnimal !== '' && !yearData.animals?.includes(selectedAnimal)) {
      return false;
    }
    
    return true;
  };

  const getCountryColor = (countryName) => {
    if (!matchesFilters(countryName)) {
      return "#e0e0e0";
    }
    
    const yearData = currentData[countryName];
    if (yearData) {
      return yearData.status === 'favorable' ? '#27ae60' : '#e74c3c';
    }
    if (favorableCountries.includes(countryName)) {
      return '#27ae60';
    }
    return "#e0e0e0";
  };

  const getStatusText = (status) => status === 'favorable' ? 'Благополучная' : 'Неблагополучная';
  const getRiskText = (risk) => risk === 'high' ? 'Высокий' : risk === 'medium' ? 'Средний' : 'Низкий';

  const getAnimalNames = (animals) => {
    const names = { 'cattle': 'КРС', 'sheep': 'МРС', 'pigs': 'Свиньи', 'poultry': 'Птица', 'horses': 'Лошади' };
    return animals?.map(a => names[a]).join(', ') || 'Нет данных';
  };

  const getMarkerColor = (risk) => {
    switch(risk) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffa500';
      default: return '#ffd700';
    }
  };

  const getMarkerSize = (risk) => {
    switch(risk) {
      case 'high': return 6;
      case 'medium': return 5;
      default: return 4;
    }
  };

  const handleMouseEnter = (outbreak, evt) => {
    setTooltipContent(outbreak);
    setTooltipPosition({ x: evt.clientX + 12, y: evt.clientY - 40 });
  };

  const handleMouseLeave = () => setTooltipContent(null);

  const handleZoomIn = () => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  const handleZoomOut = () => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  const handleReset = () => setPosition({ coordinates: [0, 20], zoom: 1 });

  const filteredOutbreaks = getFilteredOutbreaks();

  // Проверка, нужно ли показывать ссылку на отчёт по гриппу птиц
  const showBirdFluReport = () => {
    return selectedDisease === 'bird_flu' && selectedCountry?.name === 'Russia';
  };

  return (
    <div className="realmap-wrapper">
      <div className="realmap-header">
        <div className="map-legend">
          <div className="legend-item"><div className="legend-color favorable"></div><span>Благополучные территории</span></div>
          <div className="legend-item"><div className="legend-color unfavorable"></div><span>Неблагополучные территории</span></div>
          <div className="legend-item"><div className="legend-color no-data"></div><span>Нет данных / Не соответствует фильтрам</span></div>
          <div className="legend-item"><div className="legend-marker high"></div><span>Очаг (высокий риск)</span></div>
          <div className="legend-item"><div className="legend-marker medium"></div><span>Очаг (средний риск)</span></div>
          <div className="legend-item"><div className="legend-marker low"></div><span>Очаг (низкий риск)</span></div>
        </div>
        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn}>+</button>
          <button className="map-control-btn" onClick={handleZoomOut}>-</button>
          <button className="map-control-btn" onClick={handleReset}>⌂</button>
          {selectedDisease === 'bird_flu' && (
            <button className="phylogeny-btn" onClick={openPhylogenyChart}>
              Филодинамика H5N1
            </button>
          )}
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
                      default: { outline: "none", transition: "all 0.2s ease" },
                      hover: { 
                        fill: getCountryColor(geo.properties.name) === "#e74c3c" ? "#c0392b" :
                               getCountryColor(geo.properties.name) === "#27ae60" ? "#1e8449" : "#bdc3c7",
                        strokeWidth: 1,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      },
                      pressed: { outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>
            
            {/* Маркеры очагов заболеваний */}
            {filteredOutbreaks.map((outbreak) => (
              <Marker
                key={outbreak.id}
                coordinates={outbreak.coordinates}
                onMouseEnter={(evt) => handleMouseEnter(outbreak, evt)}
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  r={getMarkerSize(outbreak.risk)}
                  fill={getMarkerColor(outbreak.risk)}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  opacity={0.9}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        
        {tooltipContent && (
          <div className="map-tooltip" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            <div className="tooltip-header">📍 {tooltipContent.name}</div>
            <div className="tooltip-row"><span className="tooltip-label">Регион:</span> {tooltipContent.location}</div>
            <div className="tooltip-row"><span className="tooltip-label">Заболевание:</span> {tooltipContent.disease}</div>
            <div className="tooltip-row"><span className="tooltip-label">Вид животных:</span> {tooltipContent.animals}</div>
            <div className="tooltip-row"><span className="tooltip-label">Количество:</span> {tooltipContent.cases.toLocaleString()}</div>
            <div className="tooltip-row"><span className="tooltip-label">Дата:</span> {tooltipContent.date}</div>
            <div className="tooltip-row"><span className="tooltip-label">Генотип:</span> {tooltipContent.genotype}</div>
            <div className="tooltip-hint">Кликните на страну для деталей</div>
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
                {selectedCountry.economicDamage && <div className="details-row"><span className="details-label">Экономический ущерб:</span> {selectedCountry.economicDamage}</div>}
                {selectedCountry.forecast && <div className="details-row forecast"><span className="details-label">Прогноз:</span> {selectedCountry.forecast}</div>}
              </>
            )}
            {/* Ссылка на отчёт по гриппу птиц для России */}
            {showBirdFluReport() && (
              <div className="details-link">
                <a 
                  href="https://mgavm.ru/upload/docs/interactive.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="birdflu-link"
                >
                  📄 Подробный аналитический отчёт по гриппу птиц в Российской Федерации
                </a>
              </div>
            )}
          </div>
          <div className="details-footer">Единая платформа прогнозирования | {new Date().toLocaleDateString('ru-RU')}</div>
        </div>
      )}

      {showPhylogeny && (
        <PhylogenyChart onClose={() => setShowPhylogeny(false)} />
      )}
    </div>
  );
};

export default RealWorldMap;