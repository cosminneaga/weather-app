// Cum arată datele unei API meteo?
// Temperatură, umiditate, vânt, descriere...
export const MOCK_DATA = {
  coord: {
    lon: 10.99,
    lat: 44.34,
  },
  weather: [
    {
      id: 501,
      main: "Rain",
      description: "moderate rain",
      icon: "10d",
    },
  ],
  base: "stations",
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
    "1h": 3.16,
  },
  clouds: {
    all: 100,
  },
  dt: 1661870592,
  sys: {
    type: 2,
    id: 2075663,
    country: "IT",
    sunrise: 1661834187,
    sunset: 1661882248,
  },
  timezone: 7200,
  id: 3163858,
  name: "Zocca",
  cod: 200,
};

export const CONFIG = {
  API_KEY: "de99069cbd2c774fc89fd542da802b06",
  API_BASE_URL: "https://api.openweathermap.org/data/2.5",
  ICON_BASE_URL: "https://openweathermap.org/img/wn",
  DEFAULT_UNIT: "metric",
  DEFAULT_LANG: "ro",
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: "",
  FORECAST: "",
};

export const TRANSLATION = {
  ro: {
    inputPlaceholder: "Introdu numele orașului",
    label: {
      selector: {
        language: "Selectează limbă",
        temperature: "Selectează unitate temperatură",
        theme: "Selectează temă",
      },
    },
    searchButton: "Caută",
    humidity: "Umiditate",
    pressure: "Presiune",
    wind: "Vănt",
    visibility: "Vizibilitate",
    sunrise: "Răsărit",
    sunset: "Apus",
  },
  en: {
    inputPlaceholder: "Enter city name",
    label: {
      selector: {
        language: "Select language",
        temperature: "Select temperature unit",
        theme: "Select theme",
      },
    },
    searchButton: "Search",
    humidity: "Humidity",
    pressure: "Pressure",
    wind: "Wind",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
  },
};
export const getTranslation = (lang) => {
  return TRANSLATION[lang];
};
