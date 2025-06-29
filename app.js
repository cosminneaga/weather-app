import * as ui from './modules/ui-controller.js';
import { appStore } from './modules/stores/index.js';
import WeatherService from './modules/weather-service.js';
import LocationService from './modules/location-service.js';
import { logger } from './modules/logger.js';

(async function init() {
  logger.info('App initialising started...');
  ui.setupEventListeners();

  let city;
  try {
    const weatherService = new WeatherService();
    const locationService = new LocationService();
    const coords = await locationService.executeWithFallback();
    city = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude, 'ro', 'metric');
    appStore.setCity(city.name);
    ui.displayWeather(city, appStore.getUnit(), appStore.getLang(), weatherService.getSearched());
  } catch (err) {
    ui.handleSearch();
  }

  ui.setupSelectors(appStore.getLang(), appStore.getUnit(), appStore.getTheme());
  ui.setTheme(appStore.getTheme());
  logger.info('App intialising ended...');
})();

/* ---------------------------------- NOTES --------------------------------- */
/**
 * adauga un buton de refresh pentru a reface datele
 * adauga un buton de reset pentru a reveni la orasul initial
 * adauga un buton de favorite pentru a salva orasul curent in localStorage
 * adauga un buton de stergere a orasului din favorite
 * adauga un buton de stergere a textului din input-uri
 */
