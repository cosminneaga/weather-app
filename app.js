import * as config from "./modules/config.js";
import * as ui from "./modules/ui-controller.js";
import ErrorHandler from "./modules/error-handler.js";
import WeatherService from "./modules/weather-service.js";
import AppStore from "./modules/stores/index.js";

(function init() {
  ui.showLoading();
  new AppStore("Cluj", "metric", "en", "light");
  ui.setupSelectorDefaults();
  ui.setupEventListeners();
  ui.handleSearch();
  ui.hideLoading();
})();

// obtine orasul la first render din locatia GPS - folosind coordonatele sau numele orasului
// controale pentru unitatile de masura (C/F, km/h, m/s, etc.)
// adauga un buton de refresh pentru a reface datele
// adauga un buton de reset pentru a reveni la orasul initial
// adauga un buton de favorite pentru a salva orasul curent in localStorage
// adauga un buton de stergere a orasului din favorite
// adauga un buton de stergere a textului din input-uri
