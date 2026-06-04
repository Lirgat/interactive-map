import React, { useState, useEffect } from 'react';
import { yearlyData } from '../data/countryData';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { exportToPDFWithRussianText } from '../utils/pdfExportRussian';
import '../utils/chartConfig';
import './styles/AnalyticsPage.css';

// Динамический импорт для графиков
let Line, Bar;

const loadChartModules = async () => {
  try {
    const reactChartJs2 = await import('react-chartjs-2');
    Line = reactChartJs2.Line;
    Bar = reactChartJs2.Bar;
    return true;
  } catch (error) {
    console.error('Error loading chart modules:', error);
    return false;
  }
};

const AnalyticsPage = ({ onBackToMap }) => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('cases');
  const [sortDirection, setSortDirection] = useState('desc');
  const [chartType, setChartType] = useState('line');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [yearlyStats, setYearlyStats] = useState({});
  const [topCountries, setTopCountries] = useState([]);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    totalCountries: 0,
    unfavorableCount: 0,
    favorableCount: 0,
    totalCases: 0,
    avgMortality: 0,
    highRiskCount: 0
  });

  // Загрузка модулей графиков
  useEffect(() => {
    loadChartModules().then(setChartsLoaded);
  }, []);

  // Загрузка данных при изменении года
  useEffect(() => {
    loadData();
    calculateYearlyStats();
    calculateTopCountries();
  }, [selectedYear]);

  const loadData = () => {
    const yearData = yearlyData[selectedYear] || {};
    const countries = Object.keys(yearData).map(countryName => ({
      country: countryName,
      ...yearData[countryName],
      year: selectedYear
    }));
    setAnalyticsData(countries);
    calculateSummary(countries);
  };

  const calculateYearlyStats = () => {
    const years = ['2024', '2025', '2026', '2027'];
    const stats = {};
    
    years.forEach(year => {
      const yearData = yearlyData[year] || {};
      const countries = Object.values(yearData);
      const unfavorable = countries.filter(c => c.status === 'unfavorable');
      const totalCases = unfavorable.reduce((sum, c) => sum + (c.cases || 0), 0);
      const avgMortality = unfavorable.length > 0 
        ? (unfavorable.reduce((sum, c) => {
            const mortality = parseFloat(c.mortality) || 0;
            return sum + mortality;
          }, 0) / unfavorable.length).toFixed(1)
        : 0;
      const highRisk = unfavorable.filter(c => c.risk === 'high').length;
      
      stats[year] = {
        unfavorableCount: unfavorable.length,
        totalCases: totalCases,
        avgMortality: parseFloat(avgMortality),
        highRiskCount: highRisk,
        totalCountries: countries.length
      };
    });
    
    setYearlyStats(stats);
  };

  const calculateTopCountries = () => {
    const currentYearData = yearlyData[selectedYear] || {};
    const countries = Object.entries(currentYearData)
      .filter(([_, data]) => data.status === 'unfavorable')
      .map(([name, data]) => ({
        name: name,
        cases: data.cases || 0,
        mortality: parseFloat(data.mortality) || 0
      }))
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 5);
    
    setTopCountries(countries);
  };

  const calculateSummary = (data) => {
    const unfavorable = data.filter(c => c.status === 'unfavorable');
    const favorable = data.filter(c => c.status === 'favorable');
    const totalCases = unfavorable.reduce((sum, c) => sum + (c.cases || 0), 0);
    const avgMortality = unfavorable.length > 0 
      ? (unfavorable.reduce((sum, c) => {
          const mortality = parseFloat(c.mortality) || 0;
          return sum + mortality;
        }, 0) / unfavorable.length).toFixed(1)
      : 0;
    const highRisk = unfavorable.filter(c => c.risk === 'high');

    setSummaryStats({
      totalCountries: data.length,
      unfavorableCount: unfavorable.length,
      favorableCount: favorable.length,
      totalCases: totalCases,
      avgMortality: avgMortality,
      highRiskCount: highRisk.length
    });
  };

  const getYearlyChartData = () => {
    const years = ['2024', '2025', '2026', '2027'];
    return {
      labels: years,
      datasets: [
        {
          label: 'Неблагополучные страны',
          data: years.map(y => yearlyStats[y]?.unfavorableCount || 0),
          borderColor: '#ff3b30',
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Всего случаев',
          data: years.map(y => yearlyStats[y]?.totalCases || 0),
          borderColor: '#007aff',
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Средняя летальность (%)',
          data: years.map(y => yearlyStats[y]?.avgMortality || 0),
          borderColor: '#34c759',
          backgroundColor: 'rgba(52, 199, 89, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const getTopCountriesChartData = () => {
    return {
      labels: topCountries.map(c => c.name),
      datasets: [
        {
          label: 'Количество случаев',
          data: topCountries.map(c => c.cases),
          backgroundColor: 'rgba(255, 59, 48, 0.7)',
          borderColor: '#ff3b30',
          borderWidth: 1
        },
        {
          label: 'Летальность (%)',
          data: topCountries.map(c => c.mortality),
          backgroundColor: 'rgba(52, 199, 89, 0.7)',
          borderColor: '#34c759',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 11 }, usePointStyle: true, boxWidth: 8 }
      },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Количество', font: { size: 10 } } },
      y1: { position: 'right', beginAtZero: true, title: { display: true, text: 'Летальность (%)', font: { size: 10 } }, grid: { drawOnChartArea: false } }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Количество случаев', font: { size: 10 } } },
      y1: { position: 'right', beginAtZero: true, title: { display: true, text: 'Летальность (%)', font: { size: 10 } }, grid: { drawOnChartArea: false } }
    }
  };

  const getFilteredData = () => {
    let filtered = [...analyticsData];
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => c.country.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'cases') {
        aVal = a.cases || 0;
        bVal = b.cases || 0;
      } else if (sortField === 'mortality') {
        aVal = parseFloat(a.mortality) || 0;
        bVal = parseFloat(b.mortality) || 0;
      } else if (sortField === 'country') {
        aVal = a.country;
        bVal = b.country;
      }
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return filtered;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Экспорт в CSV
  const exportToCSV = () => {
    const filtered = getFilteredData();
    const headers = ['Страна', 'Статус', 'Риск', 'Случаи', 'Летальность', 'Генотип', 'Последняя вспышка', 'Эконом. ущерб'];
    const rows = filtered.map(c => [
      c.country,
      c.status === 'unfavorable' ? 'Неблагополучная' : 'Благополучная',
      c.risk === 'high' ? 'Высокий' : c.risk === 'medium' ? 'Средний' : 'Низкий',
      c.cases || 0,
      c.mortality || '0%',
      c.genotype || '-',
      c.lastOutbreak || '-',
      c.economicDamage || '-'
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `epizootic_report_${selectedYear}.csv`);
  };

  // Экспорт в Excel
  const exportToExcel = () => {
    try {
      const filtered = getFilteredData();
      const wsData = filtered.map(c => ({
        'Страна': c.country || '',
        'Статус': c.status === 'unfavorable' ? 'Неблагополучная' : 'Благополучная',
        'Уровень риска': c.risk === 'high' ? 'Высокий' : c.risk === 'medium' ? 'Средний' : 'Низкий',
        'Количество случаев': (c.cases || 0).toString(),
        'Летальность': c.mortality || '0%',
        'Генотип': c.genotype || '-',
        'Последняя вспышка': c.lastOutbreak || '-',
        'Пораженные виды': c.animals?.map(a => 
          a === 'poultry' ? 'Птица' : a === 'cattle' ? 'КРС' : a === 'pigs' ? 'Свиньи' : a === 'sheep' ? 'МРС' : 'Лошади'
        ).join(', ') || '-',
        'Затронутые регионы': c.regions?.join(', ') || '-',
        'Мероприятия': c.controlMeasures || '-',
        'Экономический ущерб': c.economicDamage || '-',
        'Прогноз': c.forecast || '-'
      }));
      
      const ws = XLSX.utils.json_to_sheet(wsData);
      ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 25 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Отчёт ${selectedYear}`);
      XLSX.writeFile(wb, `epizootic_report_${selectedYear}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Ошибка при экспорте в Excel');
    }
  };

  // Экспорт в PDF
  const exportToPDF = () => {
    const filtered = getFilteredData();
    const success = exportToPDFWithRussianText(filtered, summaryStats, selectedYear);
    if (!success) {
      alert('Ошибка при экспорте в PDF');
    }
  };

  const filteredData = getFilteredData();

  const getRiskBadgeClass = (risk) => {
    if (risk === 'high') return 'risk-badge-high';
    if (risk === 'medium') return 'risk-badge-medium';
    return 'risk-badge-low';
  };

  const getRiskText = (risk) => {
    if (risk === 'high') return 'Высокий';
    if (risk === 'medium') return 'Средний';
    return 'Низкий';
  };

  const renderChart = () => {
    if (!chartsLoaded || !Line || !Bar) {
      return <div className="chart-placeholder"><p>Загрузка графиков...</p></div>;
    }
    return chartType === 'line' 
      ? <Line key="line-chart" data={getYearlyChartData()} options={chartOptions} />
      : <Bar key="bar-chart" data={getYearlyChartData()} options={chartOptions} />;
  };

  const renderTopChart = () => {
    if (!chartsLoaded || !Bar) {
      return <div className="chart-placeholder"><p>Загрузка графиков...</p></div>;
    }
    return <Bar key="top-bar-chart" data={getTopCountriesChartData()} options={barOptions} />;
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-title">
          <button className="back-to-map-btn" onClick={onBackToMap} title="Вернуться к карте">←</button>
          <h2>Аналитические отчёты</h2>
        </div>
        <div className="export-buttons">
          <button className="export-btn csv" onClick={exportToCSV}>CSV</button>
          <button className="export-btn excel" onClick={exportToExcel}>Excel</button>
          <button className="export-btn pdf" onClick={exportToPDF}>PDF</button>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Динамика эпизоотической ситуации (2024-2027)</h3>
            <div className="chart-type-switch">
              <button className={chartType === 'line' ? 'active' : ''} onClick={() => setChartType('line')}>Линия</button>
              <button className={chartType === 'bar' ? 'active' : ''} onClick={() => setChartType('bar')}>Столбцы</button>
            </div>
          </div>
          <div className="chart-wrapper">{renderChart()}</div>
        </div>
        {topCountries.length > 0 && (
          <div className="chart-card">
            <div className="chart-header"><h3>Топ-5 стран по количеству случаев ({selectedYear})</h3></div>
            <div className="chart-wrapper">{renderTopChart()}</div>
          </div>
        )}
      </div>

      <div className="analytics-stats">
        <div className="stat-card"><div className="stat-value">{summaryStats.totalCountries}</div><div className="stat-label">Всего стран</div></div>
        <div className="stat-card unfavorable"><div className="stat-value">{summaryStats.unfavorableCount}</div><div className="stat-label">Неблагополучные</div></div>
        <div className="stat-card favorable"><div className="stat-value">{summaryStats.favorableCount}</div><div className="stat-label">Благополучные</div></div>
        <div className="stat-card"><div className="stat-value">{summaryStats.totalCases}</div><div className="stat-label">Всего случаев</div></div>
        <div className="stat-card"><div className="stat-value">{summaryStats.avgMortality}%</div><div className="stat-label">Средняя летальность</div></div>
        <div className="stat-card high-risk"><div className="stat-value">{summaryStats.highRiskCount}</div><div className="stat-label">Высокий риск</div></div>
      </div>

      <div className="analytics-filters">
        <div className="filter-group"><label>Год</label><select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027 (прогноз)</option></select></div>
        <div className="filter-group"><label>Статус</label><select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}><option value="all">Все</option><option value="unfavorable">Неблагополучные</option><option value="favorable">Благополучные</option></select></div>
        <div className="filter-group"><label>Поиск</label><input type="text" placeholder="Название страны..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      </div>

      <div className="analytics-table-container">
        <table className="analytics-table">
          <thead><tr><th onClick={() => handleSort('country')}>Страна {sortField === 'country' && (sortDirection === 'asc' ? '↑' : '↓')}</th><th>Статус</th><th>Риск</th><th onClick={() => handleSort('cases')}>Случаи {sortField === 'cases' && (sortDirection === 'asc' ? '↑' : '↓')}</th><th onClick={() => handleSort('mortality')}>Летальность {sortField === 'mortality' && (sortDirection === 'asc' ? '↑' : '↓')}</th><th>Генотип</th><th>Последняя вспышка</th><th>Пораженные виды</th><th>Эконом. ущерб</th></tr></thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className={item.status === 'unfavorable' ? 'row-unfavorable' : 'row-favorable'}>
                <td className="country-cell">{item.country}</td>
                <td><span className={`status-badge ${item.status}`}>{item.status === 'unfavorable' ? 'Неблагополучная' : 'Благополучная'}</span></td>
                <td>{item.risk && <span className={getRiskBadgeClass(item.risk)}>{getRiskText(item.risk)}</span>}</td>
                <td>{item.cases || 0}</td>
                <td>{item.mortality || '0%'}</td>
                <td>{item.genotype || '-'}</td>
                <td>{item.lastOutbreak || '-'}</td>
                <td>{item.animals?.map(a => a === 'poultry' ? 'Птица' : a === 'cattle' ? 'КРС' : a === 'pigs' ? 'Свиньи' : a === 'sheep' ? 'МРС' : 'Лошади').join(', ') || '-'}</td>
                <td>{item.economicDamage || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
