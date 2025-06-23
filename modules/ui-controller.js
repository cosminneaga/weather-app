import WeatherService, * as service from "../modules/weather-service.js";
import {
  convertDateUnixToLocaleTime,
  convertVisibilityLength,
  convertWindSpeedInKm,
  isValidCity,
} from "../modules/utils.js";

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
    const cityName = getCityInput().trim();
    handleSearch(cityName);
  });

  elements.error.closeBtn.addEventListener("click", () => {
    clearCityInput();
    hideError();
  });
};

export const handleSearch = async (city_name, type = "weather") => {
  showLoading();

  try {
    if (!isValidCity(city_name)) throw new Error("Numele orasului nu e corect.");

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
  const {
    name,
    weather,
    main: { humidity, pressure, temp },
    wind: { speed },
    visibility,
    sys: { sunrise, sunset },
  } = cityWeather;

  elements.cityName.textContent = name;
  elements.icon.src = WeatherService._buildIconUrl(weather[0].icon);
  elements.temperature.textContent = `${temp.toFixed(1)} C`;
  elements.description.textContent = weather[0].description;
  elements.humidity.children[0].textContent = `${humidity}%`;
  elements.pressure.children[0].textContent = `${pressure} hPa`;
  elements.wind.children[0].textContent = `${convertWindSpeedInKm(speed)} km/h`;
  elements.visibility.children[0].textContent = `${convertVisibilityLength(visibility)}`;

  elements.sunrise.children[0].innerHTML = `${convertDateUnixToLocaleTime(sunrise)}`;
  elements.sunset.children[0].innerHTML = `${convertDateUnixToLocaleTime(sunset)}`;
};

export const getCityInput = () => {
  return elements.cityInput.value;
};

export const clearCityInput = () => {
  elements.cityInput.value = "";
};
