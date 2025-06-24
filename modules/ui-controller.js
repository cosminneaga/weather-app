import WeatherService, * as service from "../modules/weather-service.js";
import {
  convertDateUnixToLocaleTime,
  convertVisibilityLength,
  convertWindSpeedInKm,
  isValidCity,
  getTemperatureSymbol,
  getWindSpeedSuffix,
} from "../modules/utils.js";
import { CONFIG, getTranslation } from "../modules/config.js";
import ErrorHandler from "./error-handler.js";
import AppStore from "./stores/index.js";

const elements = {
  cityInput: document.querySelector("#city-input"),
  searchForm: document.querySelector("#search-form"),
  searchBtn: document.querySelector("#search-btn"),
  card: document.querySelector("#weather-card"),
  cityName: document.querySelector("#city-name"),
  icon: document.querySelector("#icon"),
  temperature: document.querySelector("#temperature"),
  description: document.querySelector("#description"),
  humidity: document.querySelector("#humidity"),
  pressure: document.querySelector("#pressure"),
  wind: document.querySelector("#wind"),
  visibility: document.querySelector("#visibility"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  loading: document.querySelector("#loading"),
  error: {
    container: document.querySelector("#error-container"),
    closeBtn: document.querySelector("#error-close"),
    message: document.querySelector("#error-message"),
  },
  selector: {
    language: {
      label: document.querySelector('label[for="selector-language"]'),
      select: document.querySelector("#selector-language"),
    },
    temperature: {
      label: document.querySelector('label[for="selector-temperature"]'),
      select: document.querySelector("#selector-temperature"),
    },
    theme: {
      label: document.querySelector('label[for="selector-theme"]'),
      select: document.querySelector("#selector-theme"),
    },
  },
};

export const setupEventListeners = () => {
  elements.searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const appStore = new AppStore();
    appStore.setCity(getCityInput().trim());
    await handleSearch();
  });

  elements.error.closeBtn.addEventListener("click", () => {
    clearCityInput();
    hideError();
  });

  elements.selector.language.select.addEventListener("change", async (event) => {
    const appStore = new AppStore();
    appStore.setLang(event.target.value);
    await handleSearch();
  });

  elements.selector.temperature.select.addEventListener("change", async (event) => {
    const appStore = new AppStore();
    appStore.setUnit(event.target.value);
    await handleSearch();
  });

  elements.selector.theme.select.addEventListener("change", (event) => {
    const appStore = new AppStore();
    appStore.setTheme(event.target.value);
  });
};

export const handleSearch = async () => {
  showLoading();
  const appStore = new AppStore();
  const city = appStore.getCity();
  const language = appStore.getLang();
  const unit = appStore.getUnit();

  try {
    const weatherService = new WeatherService();
    const cityWeather = await weatherService.getCurrentWeather(city, language, unit);
    if (cityWeather.isFallback) throw new Error(JSON.stringify(cityWeather));
    displayWeather(cityWeather, language);
    clearCityInput();
  } catch (error) {
    const json = JSON.parse(error.message);
    displayWeather(json);
    const handler = new ErrorHandler("DISPLAY_WEATHER").get();
    showError(`"${json.fallbackReason}" ${handler.message}`);
  }

  hideLoading();
};

export const showLoading = () => {
  elements.loading.classList.remove("hidden");
};

export const hideLoading = () => {
  elements.loading.classList.add("hidden");
};

export const showError = (message) => {
  elements.error.container.classList.remove("hidden");
  elements.error.message.textContent = message;
};

export const hideError = () => {
  elements.error.container.classList.add("hidden");
  elements.error.message.textContent = "";
};

export const displayWeather = async (city_weather, language = "ro") => {
  const {
    name,
    weather,
    main: { humidity, pressure, temp },
    wind: { speed },
    visibility,
    sys: { sunrise, sunset },
  } = city_weather;
  const appStore = new AppStore();

  elements.cityName.textContent = name;
  elements.icon.src = WeatherService._buildIconUrl(weather[0].icon);
  elements.temperature.textContent = `${temp.toFixed(1)}${getTemperatureSymbol(appStore.getUnit())}`;
  elements.description.textContent = weather.map((item) => item.description).join(", ");
  elements.humidity.children[1].textContent = `${humidity}%`;
  elements.pressure.children[1].textContent = `${pressure} hPa`;
  elements.wind.children[1].textContent = `${convertWindSpeedInKm(speed)} ${getWindSpeedSuffix(appStore.getUnit())}`;
  elements.visibility.children[1].textContent = `${convertVisibilityLength(visibility)}`;
  elements.sunrise.children[1].innerHTML = `${convertDateUnixToLocaleTime(sunrise)}`;
  elements.sunset.children[1].innerHTML = `${convertDateUnixToLocaleTime(sunset)}`;

  displayTranslation(language);
};

export const displayTranslation = (language) => {
  const { humidity, pressure, wind, visibility, sunset, sunrise } = getTranslation(language);

  elements.humidity.children[0].textContent = humidity;
  elements.pressure.children[0].textContent = pressure;
  elements.wind.children[0].textContent = wind;
  elements.visibility.children[0].textContent = visibility;
  elements.sunrise.children[0].textContent = sunrise;
  elements.sunset.children[0].textContent = sunset;
};

export const getCityInput = () => {
  return elements.cityInput.value;
};

export const clearCityInput = () => {
  elements.cityInput.value = "";
};
