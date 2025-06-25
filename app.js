import * as ui from "./modules/ui-controller.js";
import AppStore from "./modules/stores/index.js";
import WeatherService from "./modules/weather-service.js";
import { getCoords } from "./modules/location-service.js";

(function init() {
  const appStore = new AppStore("Cluj", "metric", "ro", "light");
  ui.setupEventListeners();
  ui.setTheme();

  const city = getCoords().then(async (coordinates) => {
    const weatherService = new WeatherService();
    const weatherByCoordinates = await weatherService.getWeatherByCoords(coordinates.latitude, coordinates.longitude);
    appStore.setCity(weatherByCoordinates.name);

    ui.handleSearch();
    ui.setupSelectors(appStore.getLang(), appStore.getUnit(), appStore.getTheme());
  });
})();

/* ---------------------------------- NOTES --------------------------------- */
/**
 * controale pentru unitatile de masura (C/F, km/h, m/s, etc.)
 * adauga un buton de refresh pentru a reface datele
 * adauga un buton de reset pentru a reveni la orasul initial
 * adauga un buton de favorite pentru a salva orasul curent in localStorage
 * adauga un buton de stergere a orasului din favorite
 * adauga un buton de stergere a textului din input-uri
 */
