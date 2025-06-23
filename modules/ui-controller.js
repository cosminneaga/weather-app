import WeatherService, * as service from "../modules/weather-service.js";
import * as utils from "../modules/utils.js";

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
};

export const setupEventListeners = () => {
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  elements.searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    handleSearch(elements.cityInput.value);
  });

  elements.error.closeBtn.addEventListener("click", () => {
    clearCityInput();
    hideError();
  });
};

export const handleSearch = async (city_name, type = "weather") => {
  showLoading();

  try {
    if (!utils.isValidCity(city_name)) throw new Error("Numele orasului nu e corect.");

    const weatherService = new WeatherService(type);
    const cityWeather = await weatherService.getCurrentWeather(city_name);
    if (cityWeather.isFallback) throw new Error(JSON.stringify(cityWeather));
    displayWeather(cityWeather);
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

export const displayWeather = async (cityWeather) => {
  elements.cityName.textContent = cityWeather.name;
  elements.icon.src = WeatherService._buildIconUrl(cityWeather.weather[0].icon);
  elements.temperature.textContent = `${cityWeather.main.temp.toFixed(1)} C`;
  elements.description.textContent = cityWeather.weather[0].description;
  elements.humidity.children[0].textContent = `${cityWeather.main.humidity}%`;
  elements.pressure.children[0].textContent = `${cityWeather.main.pressure} hPa`;
  elements.wind.children[0].textContent = `${utils.convertWindSpeedInKm(cityWeather.wind.speed)} km/h`;
  elements.visibility.children[0].textContent = `${utils.convertVisibilityLength(cityWeather.visibility)}`;
  elements.sunrise.children[0].textContent = `${utils.convertDateUnixToLocaleTime(cityWeather.sys.sunrise)}`;
  elements.sunset.children[0].textContent = `${utils.convertDateUnixToLocaleTime(cityWeather.sys.sunset)}`;
};

export const getCityInput = () => {
  return elements.cityInput.value;
};

export const clearCityInput = () => {
  elements.cityInput.value = "";
};
