import * as config from "./modules/config.js";
import * as ui from "./modules/ui-controller.js";
import ErrorHandler from "./modules/error.js";
import WeatherService from "./modules/weather-service.js";

ui.handleSearch("Cluj");
ui.setupEventListeners();

// const weatherService = new WeatherService();
// console.log(weatherService);
// weatherService.getCurrentWeather("Clujan").then((res) => console.log(res));
