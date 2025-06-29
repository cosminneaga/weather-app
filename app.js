import * as ui from './modules/ui-controller.js';
import AppStore from './modules/stores/index.js';
import WeatherService from './modules/weather-service.js';
import LocationService from './modules/location-service.js';
import { logger } from './modules/logger.js';

// logger.info('Logger test started');
// logger.debug('Debug message', { test: true });
// logger.warn('Warning message');
// logger.error('Error message', new Error('Test error'));

(async function init() {
  logger.info('App initialising started...');
  ui.setupEventListeners();

  let city, appStore;
  const weatherService = new WeatherService();

  try {
    const locationService = new LocationService();
    const coords = await locationService.executeWithFallback();
    city = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude, 'ro', 'metric');
    appStore = new AppStore();
    appStore.setCity(city.name);
    appStore.setUnit('metric');
    appStore.setLang('ro');
    appStore.setTheme('light');
    ui.displayWeather(city, appStore.getUnit(), appStore.getLang(), weatherService.getSearched());
  } catch (err) {
    appStore = new AppStore();
    appStore.setCity('Cluj');
    appStore.setUnit('metric');
    appStore.setLang('ro');
    appStore.setTheme('light');
    ui.handleSearch({
      data: {
        city: appStore.getCity(),
        lang: appStore.getLang(),
        unit: appStore.getUnit(),
      },
    });
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
