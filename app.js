import * as ui from './modules/ui-controller.js';
import { appStore } from './modules/stores/index.js';
import WeatherService from './modules/weather-service.js';
import LocationService from './modules/location-service.js';
import { logger } from './modules/logger.js';

(async function init() {
  logger.info('App initialising started...');
  ui.setupEventListeners();

  let city;
  const unit = appStore.getUnit();
  const lang = appStore.getLang();
  const theme = appStore.getTheme();
  try {
    const weatherService = new WeatherService();
    const locationService = new LocationService();
    const coords = await locationService.executeWithFallback();
    city = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude, lang, unit);
    appStore.setCity(city.name);
    ui.displayWeather(city, unit, lang);
  } catch (err) {
    ui.handleSearch();
  }

  ui.setupSelectors(lang, unit, theme);
  ui.setTheme(theme);
  logger.info('App intialised successfully...');
})();

/* ---------------------------------- NOTES --------------------------------- */
/**
 * adauga un buton de refresh pentru a reface datele
 * adauga un buton de stergere a textului din input-uri
 */
