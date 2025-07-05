import WeatherService from './modules/weather-service.js';
import LocationService from './modules/location-service.js';
import * as ui from './modules/ui-controller.js';
import { appStore } from './modules/stores/index.js';
import { logger } from './modules/logger.js';

(async function init() {
  console.time('app-init');
  logger.info('App initialising started...');
  window.dayjs.extend(window.dayjs_plugin_relativeTime);
  ui.setupEventListeners();
  ui.setupEnvironmentElements();
  ui.setupTimers();

  const unit = appStore.getUnit();
  const lang = appStore.getLang();
  const theme = appStore.getTheme();
  window.dayjs.locale(lang);
  try {
    const weatherService = new WeatherService();
    const locationService = new LocationService();
    const coords = await locationService.executeWithFallback();
    const city = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude, lang, unit);
    appStore.setCity(city.name);

    switch (coords.source) {
      case 'ip':
        appStore.setDetails('ip');
        break;
      case 'gps':
        appStore.setDetails('gps');
        break;
    }

    ui.displayWeather(city, unit, lang);
  } catch (err) {
    logger.error('[APP-INIT]', err);

    appStore.setDetails('default');
    ui.handleSearch();
  }

  ui.setupSelectors(lang, unit, theme);
  ui.setTheme(theme);
  logger.info('App intialised successfully...');
  appStore.countUpAppLoad();
  console.timeEnd('app-init');
})();

/* ---------------------------------- NOTES --------------------------------- */
/**
 * adauga un buton de refresh pentru a reface datele
 * adauga un buton de stergere a textului din input-uri
 */
