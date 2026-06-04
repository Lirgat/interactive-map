import html2pdf from 'html2pdf.js';

// Создаем HTML для PDF
const generateHTML = (data, summaryStats, selectedYear) => {
  const getRiskText = (risk) => {
    if (risk === 'high') return 'Высокий';
    if (risk === 'medium') return 'Средний';
    return 'Низкий';
  };

  const getStatusText = (status) => {
    return status === 'unfavorable' ? 'Неблагополучная' : 'Благополучная';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Аналитический отчёт</title>
      <style>
        body {
          font-family: 'DejaVu Sans', 'Arial', sans-serif;
          margin: 20px;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #007aff;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #007aff;
          margin: 0;
          font-size: 24px;
        }
        .header h2 {
          color: #666;
          margin: 10px 0 0 0;
          font-size: 18px;
        }
        .date {
          text-align: right;
          color: #888;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e0e0e0;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #007aff;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 11px;
        }
        th {
          background: #007aff;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        tr:nth-child(even) {
          background: #f8f9fa;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #888;
          border-top: 1px solid #e0e0e0;
          padding-top: 15px;
        }
        .risk-high { color: #ff4444; font-weight: bold; }
        .risk-medium { color: #ffa500; font-weight: bold; }
        .risk-low { color: #34c759; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Аналитический отчёт</h1>
        <h2>Единая платформа прогнозирования эпизоотической ситуации</h2>
      </div>
      
      <div class="date">
        Дата формирования: ${new Date().toLocaleDateString('ru-RU')}<br/>
        Период анализа: ${selectedYear} год
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">${summaryStats.totalCountries}</div>
          <div class="stat-label">Всего стран</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.unfavorableCount}</div>
          <div class="stat-label">Неблагополучные</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.favorableCount}</div>
          <div class="stat-label">Благополучные</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.totalCases}</div>
          <div class="stat-label">Всего случаев</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.avgMortality}%</div>
          <div class="stat-label">Средняя летальность</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${summaryStats.highRiskCount}</div>
          <div class="stat-label">Высокий риск</div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Страна</th>
            <th>Статус</th>
            <th>Риск</th>
            <th>Случаи</th>
            <th>Летальность</th>
            <th>Генотип</th>
            <th>Последняя вспышка</th>
           </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              <td>${item.country || ''}</td>
              <td>${getStatusText(item.status)}</td>
              <td class="risk-${item.risk}">${getRiskText(item.risk)}</td>
              <td>${item.cases || 0}</td>
              <td>${item.mortality || '0%'}</td>
              <td>${item.genotype || '-'}</td>
              <td>${item.lastOutbreak || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        ФГБОУ ВО МГАВМиБ - МВА имени К.И. Скрябина<br/>
        Единая платформа прогнозирования и управления эпизоотическими рисками
      </div>
    </body>
    </html>
  `;
};

// Экспорт в PDF с русским текстом через HTML
export const exportToPDFWithRussianText = (data, summaryStats, selectedYear) => {
  try {
    const element = document.createElement('div');
    element.innerHTML = generateHTML(data, summaryStats, selectedYear);
    document.body.appendChild(element);
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `epizootic_report_${selectedYear}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    });
    
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    return false;
  }
};
