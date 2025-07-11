export const MOCK_DATA = {
  coord: {
    lon: 10.99,
    lat: 44.34,
  },
  weather: [
    {
      id: 501,
      main: 'Rain',
      description: 'moderate rain',
      icon: '10d',
    },
  ],
  base: 'stations',
  main: {
    temp: 95,
    feels_like: 85,
    temp_min: 83,
    temp_max: 98,
    pressure: 1015,
    humidity: 64,
    sea_level: 1015,
    grnd_level: 933,
  },
  visibility: 10000,
  wind: {
    speed: 0.62,
    deg: 349,
    gust: 1.18,
  },
  rain: {
    '1h': 3.16,
  },
  clouds: {
    all: 100,
  },
  dt: 1661870592,
  sys: {
    type: 2,
    id: 2075663,
    country: 'IT',
    sunrise: 1661834187,
    sunset: 1661882248,
  },
  timezone: 7200,
  id: 3163858,
  name: 'Zocca',
  cod: 200,
  timestamp: dayjs('2025-01-01')
};

export const CONFIG = {
  API_KEY: 'de99069cbd2c774fc89fd542da802b06',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  ICON_BASE_URL: 'https://openweathermap.org/img/wn',
  MAX_HISTORY_ITEMS: 10,
  ENVIRONMENT: 'development',
  LOGGING: {
    ENABLED: true,
    LEVEL: 'debug', // 'debug', 'info', 'warn', 'error'
    MAX_LOGS: 100,
    CONSOLE_ENABLED: false,
  },
  DEFAULT: {
    CITY: 'Cluj',
    UNIT: 'metric',
    LANG: 'ro',
    THEME: 'light',
  },
  DATA_TYPE: ['default', 'ip', 'gps', 'api'],
  TIMER: {
    WEATHER: 30000,
    BENCHMARK: 60000,
  },
  CACHE: {
    CITY: 10 * 60 * 1000,
    // CITY: 120000,
  }
};

export const API_ENDPOINTS = {
  WEATHER: 'weather',
  FORECAST: {
    HOURLY: 'forecast/hourly',
    DAILY: 'forecast/daily',
    CLIMATIC: 'forecast/climate',
    BASE: 'forecast',
  },
};

export const TRANSLATION = {
  ro: {
    inputPlaceholder: 'Introdu numele orașului',
    label: {
      selector: {
        language: 'Selectează limbă',
        temperature: 'Selectează unitate temperatură',
        theme: 'Selectează temă',
      },
    },
    cityDetails: {
      default: 'Oras default',
      gps: 'GPS locator',
      ip: 'IP locator',
      api: 'Cautare prin API'
    },
    searchButton: 'Caută',
    humidity: 'Umiditate',
    pressure: 'Presiune',
    wind: 'Vănt',
    visibility: 'Vizibilitate',
    sunrise: 'Răsărit',
    sunset: 'Apus',
    loading: 'Se incarca datele vremii...',
    history: {
      title: 'Cautari recente'
    }
  },
  en: {
    inputPlaceholder: 'Enter city name',
    label: {
      selector: {
        language: 'Select language',
        temperature: 'Select temperature unit',
        theme: 'Select theme',
      },
    },
    cityDetails: {
      default: 'Default city',
      gps: 'GPS location',
      ip: 'IP location',
      api: 'API search'
    },
    searchButton: 'Search',
    humidity: 'Humidity',
    pressure: 'Pressure',
    wind: 'Wind',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    loading: 'Loading weather data...',
    history: {
      title: 'Recent searches'
    }
  },
};
export const getTranslation = (lang) => TRANSLATION[lang];
