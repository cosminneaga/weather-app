import * as ui from "./modules/ui-controller.js";
import AppStore from "./modules/stores/index.js";
import WeatherService from "./modules/weather-service.js";
import ErrorHandler from "./modules/error-handler.js";
import { getCoords } from "./modules/location-service.js";

(async function init() {
  let city,
    appStore = null;
  const weatherService = new WeatherService();
  if (!localStorage.getItem("AppStore")) {
    const coords = await getCoords();
    city = await weatherService.getWeatherByCoords(coords.latitude, coords.longitude, "ro", "metric");
    appStore = new AppStore(city.name, "metric", "ro", "light");
  } else {
    appStore = new AppStore();
    city = await weatherService.getCurrentWeather(appStore.getCity(), appStore.getLang(), appStore.getUnit());
  }

  ui.setupEventListeners();
  ui.displayWeather(city, appStore.getUnit(), appStore.getLang(), weatherService.getSearched());
  ui.setupSelectors(appStore.getLang(), appStore.getUnit(), appStore.getTheme());
  ui.setTheme(appStore.getTheme());
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
