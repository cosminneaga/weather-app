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
  DEFAULT_UNITS: "metric",
  DEFAULT_LANG: "en",
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: "",
  FORECAST: "",
};

export const ERROR_MESSAGES = [
  { name: "CITY_INVALID", code: null, message: "Orasul nu e valid... Te rog introdu un oras valid." },
  {
    name: "CITY_NOT_FOUND",
    code: 404,
    message: "Orasul nu a fost gasit... Reincerca sa accesezi datele pentru un alt oras.",
  },
  { name: "NETWORK", code: null, message: "A aparut o eroare de retea... Reincerca mai tarziu." },
  { name: "AUTH", code: 401, message: "Autentificare nereusita... Te rog incerca folosind alt token." },
  { name: "SERVER", code: 500, message: "A aparut o eroare la server... Te rog incearca mai tarziu." },
  { name: "GENERAL", code: null, message: "A aparut o eroare... Reincearca." },
];

export const getErrorMessage = (value) => {
  let key = "";
  switch (typeof value) {
    case "number":
      key = "code";
      break;
    case "string":
      key = "name";
      break;
    default:
      key = "code";
      break;
  }

  return ERROR_MESSAGES.find((error) => error[key] === value) || null;
};
