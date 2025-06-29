import WeatherService from '../modules/weather-service.js';
import {
  convertDateUnixToLocaleTime,
  convertVisibilityLength,
  convertWindSpeedInKm,
  getTemperatureSymbol,
  getWindSpeedSuffix,
} from '../modules/utils.js';
import { getTranslation } from '../modules/config.js';
import ErrorHandler from './error/handler.js';
import AppStore from './stores/index.js';
const weatherService = new WeatherService();

const elements = {
  app: document.querySelector('#app'),
  cityInput: document.querySelector('#city-input'),
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('#search-btn'),
  card: document.querySelector('#weather-card'),
  cityName: document.querySelector('#city-name'),
  icon: document.querySelector('#icon'),
  temperature: document.querySelector('#temperature'),
  description: document.querySelector('#description'),
  humidity: document.querySelector('#humidity'),
  pressure: document.querySelector('#pressure'),
  wind: document.querySelector('#wind'),
  visibility: document.querySelector('#visibility'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  loading: document.querySelector('#loading'),
  loadingMessage: document.querySelector('#loading-message'),
  error: {
    container: document.querySelector('#error-container'),
    closeBtn: document.querySelector('#error-close'),
    message: document.querySelector('#error-message'),
  },
  selector: {
    language: {
      label: document.querySelector('label[for="selector-language"]'),
      select: document.querySelector('#selector-language'),
    },
    temperature: {
      label: document.querySelector('label[for="selector-temperature"]'),
      select: document.querySelector('#selector-temperature'),
    },
    theme: {
      label: document.querySelector('label[for="selector-theme"]'),
      select: document.querySelector('#selector-theme'),
    },
  },
  searchHistoryList: document.querySelector('#weather-search-history-list'),
};

export const setupEventListeners = () => {
  const appStore = new AppStore();
  elements.searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    appStore.setCity(getCityInput().trim());
    await handleSearch(appStore);
  });

  elements.error.closeBtn.addEventListener('click', () => {
    clearCityInput();
    hideError();
  });

  elements.selector.language.select.addEventListener('change', async (event) => {
    appStore.setLang(event.target.value);
    await handleSearch(appStore);
  });

  elements.selector.temperature.select.addEventListener('change', async (event) => {
    appStore.setUnit(event.target.value);
    await handleSearch(appStore);
  });

  elements.selector.theme.select.addEventListener('change', (event) => {
    appStore.setTheme(event.target.value);
    setTheme(appStore.getTheme());
  });
};

export const setupSelectors = (lang, unit, theme) => {
  elements.selector.language.select.value = lang;
  elements.selector.temperature.select.value = unit;
  elements.selector.theme.select.value = theme;
};

export const handleSearch = async (data) => {
  const { city, lang, unit, list } = data.data;
  showLoading();
  try {
    const cityWeather = await weatherService.getCurrentWeather(city, lang, unit);
    if (cityWeather.isFallback) throw new Error(JSON.stringify(cityWeather));

    displayWeather(cityWeather, unit, lang, weatherService.getSearched());
    clearCityInput();
  } catch (error) {
    const handler = new ErrorHandler('DISPLAY_WEATHER').get();

    if (error instanceof TypeError || error instanceof ReferenceError) {
      showError(`"${error.message}" ${handler.message}`);
    } else {
      const json = JSON.parse(error.message);
      displayWeather(json, unit, lang, weatherService.getSearched());
      showError(`"${json.fallbackReason}" ${handler.message}`);
    }
  }

  hideLoading();
};

export const displayWeather = async (city_weather, unit, lang, history) => {
  const {
    name,
    weather,
    main: { humidity, pressure, temp },
    wind: { speed },
    visibility,
    sys: { sunrise, sunset },
  } = city_weather;

  elements.cityName.textContent = name;
  elements.icon.src = weatherService._buildIconUrl(weather[0].icon);
  elements.temperature.textContent = `${temp.toFixed(1)}${getTemperatureSymbol(unit)}`;
  elements.description.textContent = weather.map((item) => item.description).join(', ');
  elements.humidity.children[1].textContent = `${humidity}%`;
  elements.pressure.children[1].textContent = `${pressure} hPa`;
  elements.wind.children[1].textContent = `${convertWindSpeedInKm(speed)} ${getWindSpeedSuffix(unit)}`;
  elements.visibility.children[1].textContent = `${convertVisibilityLength(visibility)}`;
  elements.sunrise.children[1].innerHTML = `${convertDateUnixToLocaleTime(sunrise)}`;
  elements.sunset.children[1].innerHTML = `${convertDateUnixToLocaleTime(sunset)}`;

  displayTranslation(lang);
  displaySearchHistoryAndSetupEvents(history);
};

const displayTranslation = (language) => {
  const {
    humidity,
    pressure,
    wind,
    visibility,
    sunset,
    sunrise,
    inputPlaceholder,
    searchButton,
    label: { selector },
    loading,
  } = getTranslation(language);

  elements.humidity.children[0].textContent = humidity;
  elements.pressure.children[0].textContent = pressure;
  elements.wind.children[0].textContent = wind;
  elements.visibility.children[0].textContent = visibility;
  elements.sunrise.children[0].textContent = sunrise;
  elements.sunset.children[0].textContent = sunset;

  elements.cityInput.placeholder = inputPlaceholder;
  elements.searchBtn.innerText = searchButton;

  elements.selector.language.label.textContent = selector.language;
  elements.selector.temperature.label.textContent = selector.temperature;
  elements.selector.theme.label.textContent = selector.theme;

  elements.loadingMessage.textContent = loading;
};

export const setTheme = (theme) => {
  elements.app.className = `container ${theme}`;
};

const getCityInput = () => {
  return elements.cityInput.value;
};

const clearCityInput = () => {
  elements.cityInput.value = '';
};

const displaySearchHistoryAndSetupEvents = (data) => {
  elements.searchHistoryList.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.setAttribute('data-city', JSON.stringify(item));
    li.textContent = item?.name + ' ';

    const button = document.createElement('button');
    button.id = 'search-history-delete-item';
    button.textContent = 'X';
    button.addEventListener('click', function (event) {
      const city_name = JSON.parse(li.dataset.city).name;
      appStore.removeCityFromListByName(city_name);
      li.remove();
    });
    li.appendChild(button);
    elements.searchHistoryList.appendChild(li);
    setupEventListeners();
  });
};


export const showLoading = () => {
  elements.loading.classList.remove('hidden');
};

export const hideLoading = () => {
  elements.loading.classList.add('hidden');
};

export const showError = (message) => {
  elements.error.container.classList.remove('hidden');
  elements.error.message.textContent = message;
};

export const hideError = () => {
  elements.error.container.classList.add('hidden');
  elements.error.message.textContent = '';
};