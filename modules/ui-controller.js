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

const elements = {
  cityInput: document.querySelector("#city-input"),
  searchForm: document.querySelector("#search-form"),
  searchBtn: document.querySelector("#search-btn"),
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
    await handleSearch({ city_name: getCityInput().trim() });
  });

  elements.error.closeBtn.addEventListener("click", () => {
    clearCityInput();
    hideError();
  });

  elements.selector.language.select.addEventListener("change", async (event) => {
    CONFIG.DEFAULT_LANG = event.target.value;
    await handleSearch({ unit: CONFIG.DEFAULT_UNIT, language: CONFIG.DEFAULT_LANG });
  });

  elements.selector.temperature.select.addEventListener("change", async (event) => {
    CONFIG.DEFAULT_UNIT = event.target.value;
    await handleSearch({ unit: CONFIG.DEFAULT_UNIT, language: CONFIG.DEFAULT_LANG });
  });

  elements.selector.theme.select.addEventListener("change", (event) => {
    console.log("Theme", event.target.value);
  });
};

export const handleSearch = async ({ city_name = "Bucharest", language = "ro", unit = "metric" } = {}) => {
  showLoading();

  try {
    const weatherService = new WeatherService();
    const cityWeather = await weatherService.getCurrentWeather(city_name, language, unit);
    if (cityWeather.isFallback) throw new Error(JSON.stringify(cityWeather));
    displayWeather(cityWeather, language);
    clearCityInput();
  } catch (error) {
    const json = JSON.parse(error.message);
    displayWeather(json);
    showError(`${json.fallbackReason} Din cauza acestei erori un oras default numit ${json.name} a fost afisat...`);
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

  elements.cityName.textContent = name;
  elements.icon.src = WeatherService._buildIconUrl(weather[0].icon);
  elements.temperature.textContent = `${temp.toFixed(1)}${getTemperatureSymbol(CONFIG.DEFAULT_UNIT)}`;
  elements.description.textContent = weather[0].description;
  elements.humidity.children[1].textContent = `${humidity}%`;
  elements.pressure.children[1].textContent = `${pressure} hPa`;
  elements.wind.children[1].textContent = `${convertWindSpeedInKm(speed)} ${getWindSpeedSuffix(CONFIG.DEFAULT_UNIT)}`;
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
