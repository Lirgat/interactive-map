// Данные о вспышках болезней по странам
export const diseaseOutbreaks = {
  'Russia': { 
    risk: 'high', 
    cases: 145, 
    lastOutbreak: '2026-05-15', 
    coordinates: [60, 100],
    diseases: ['bird_flu', 'newcastle'],
    animals: ['poultry', 'pigs']
  },
  'China': { 
    risk: 'high', 
    cases: 234, 
    lastOutbreak: '2026-06-01', 
    coordinates: [35, 105],
    diseases: ['bird_flu', 'rrss'],
    animals: ['poultry', 'pigs']
  },
  'India': { 
    risk: 'high', 
    cases: 312, 
    lastOutbreak: '2026-05-28', 
    coordinates: [20, 78],
    diseases: ['bird_flu', 'rotavirus'],
    animals: ['poultry', 'cattle']
  },
  'United States of America': { 
    risk: 'medium', 
    cases: 89, 
    lastOutbreak: '2026-04-20', 
    coordinates: [40, -100],
    diseases: ['newcastle', 'rrss'],
    animals: ['poultry', 'pigs']
  },
  'Brazil': { 
    risk: 'medium', 
    cases: 67, 
    lastOutbreak: '2026-05-10', 
    coordinates: [-15, -55],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Germany': { 
    risk: 'low', 
    cases: 12, 
    lastOutbreak: '2026-03-15', 
    coordinates: [51, 10],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'France': { 
    risk: 'medium', 
    cases: 34, 
    lastOutbreak: '2026-05-05', 
    coordinates: [46, 2],
    diseases: ['newcastle'],
    animals: ['poultry']
  },
  'Vietnam': { 
    risk: 'high', 
    cases: 178, 
    lastOutbreak: '2026-05-30', 
    coordinates: [16, 108],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Thailand': { 
    risk: 'medium', 
    cases: 56, 
    lastOutbreak: '2026-05-18', 
    coordinates: [15, 101],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Indonesia': { 
    risk: 'high', 
    cases: 198, 
    lastOutbreak: '2026-05-25', 
    coordinates: [-5, 120],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Egypt': { 
    risk: 'medium', 
    cases: 45, 
    lastOutbreak: '2026-04-28', 
    coordinates: [26, 29],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Nigeria': { 
    risk: 'high', 
    cases: 89, 
    lastOutbreak: '2026-05-20', 
    coordinates: [9, 8],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Ukraine': { 
    risk: 'medium', 
    cases: 23, 
    lastOutbreak: '2026-05-12', 
    coordinates: [49, 32],
    diseases: ['bird_flu'],
    animals: ['poultry']
  },
  'Kazakhstan': { 
    risk: 'low', 
    cases: 8, 
    lastOutbreak: '2026-04-30', 
    coordinates: [48, 68],
    diseases: ['bird_flu'],
    animals: ['poultry']
  }
};

// Функция для фильтрации данных по болезни
export const filterByDisease = (data, disease) => {
  if (!disease) return data;
  const filtered = {};
  Object.entries(data).forEach(([country, info]) => {
    if (info.diseases && info.diseases.includes(disease)) {
      filtered[country] = info;
    }
  });
  return filtered;
};

// Функция для фильтрации данных по виду животных
export const filterByAnimal = (data, animal) => {
  if (!animal) return data;
  const filtered = {};
  Object.entries(data).forEach(([country, info]) => {
    if (info.animals && info.animals.includes(animal)) {
      filtered[country] = info;
    }
  });
  return filtered;
};
