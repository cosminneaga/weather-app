import WeatherService from '../modules/weather-service.js';
import ErrorHandler from './error/handler.js';
import {
  convertDateUnixToLocaleTime,
  convertVisibilityLength,
  convertWindSpeedInKm,
  getTemperatureSymbol,
  getWindSpeedSuffix,
} from '../modules/utils.js';
import { getTranslation } from '../modules/config.js';
import { appStore } from './stores/index.js';
import { logger } from './logger.js';
import { CONFIG } from '../modules/config.js';
const weatherService = new WeatherService();

const elements = {
  app: document.querySelector('#app'),
  cityInput: document.querySelector('#city-input'),
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('#search-btn'),
  downloadLogsBtn: document.querySelector('#download-logs-button'),
  card: document.querySelector('#weather-card'),
  cityName: document.querySelector('#city-name'),
  cityDetails: document.querySelector('#city-details'),
  restartBtn: document.querySelector('#restart'),
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
  searchHistory: {
    title: document.querySelector('#search-history-title-heading'),
    container: document.querySelector('#search-history-container'),
    list: document.querySelector('#weather-search-history-list'),
    clearBtn: document.querySelector('#search-history-clear-button')
  }
};

export const setupEnvironmentElements = () => {
  switch (CONFIG.ENVIRONMENT) {
    case 'development':
      elements.downloadLogsBtn.parentElement.classList.remove('hidden');
      break;
    default:
      elements.downloadLogsBtn.parentElement.classList.add('hidden');
      break;
  }
};

export const setupTimers = () => {
  setInterval(() => {
    elements.cityDetails.textContent = `${appStore.getDetails()} -- ${appStore.getCityTimestampToNow()}`;
  }, CONFIG.TIMER.WEATHER);
};

export const setupEventListeners = () => {
  elements.searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    appStore.setCity(getCityInput().trim());
    logger.info('Form submitted', appStore.getAll());
    await handleSearch();
    appStore.countUpUiUpdate();
  });

  elements.error.closeBtn.addEventListener('click', () => {
    clearCityInput();
    hideError();
    appStore.countUpUiUpdate();
  });

  elements.selector.language.select.addEventListener('change', async (event) => {
    appStore.setLang(event.target.value);
    logger.info('Language changed', appStore.getAll());
    await handleSearch();
    appStore.countUpUiUpdate();
  });

  elements.selector.temperature.select.addEventListener('change', async (event) => {
    appStore.setUnit(event.target.value);
    logger.info('Unit changed', appStore.getAll());
    await handleSearch();
    appStore.countUpUiUpdate();
  });

  elements.selector.theme.select.addEventListener('change', (event) => {
    appStore.setTheme(event.target.value);
    logger.info('Theme changed', appStore.getAll());
    setTheme(appStore.getTheme());
  });

  elements.searchHistory.clearBtn.addEventListener('click', () => {
    appStore.clearHistory();
    logger.info('Searching history clear.', appStore.getAll());
    displaySearchHistoryAndSetupEvents(appStore.getHistory());
    appStore.countUpUiUpdate();
  });

  elements.restartBtn.addEventListener('click', () => {
    handleSearch(false);
  });

  elements.downloadLogsBtn.addEventListener('click', () => {
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(logger.getLogs())}`;
    const a = document.createElement('a');
    a.setAttribute('href', data);
    a.setAttribute('download', 'logs.txt');
    document.body.appendChild(a);
    a.click();
    a.remove();
    appStore.countUpUiUpdate();
  });
};

export const setupSelectors = (lang, unit, theme) => {
  elements.selector.language.select.value = lang;
  elements.selector.temperature.select.value = unit;
  elements.selector.theme.select.value = theme;
};

export const handleSearch = async (cacheEnabled = true) => {
  const {
    data: { city, lang, unit, list },
  } = appStore;
  showLoading();

  try {
    const cityWeather = await weatherService.getCurrentWeather(city, lang, unit, cacheEnabled);
    if (cityWeather.isFallback) throw new Error(JSON.stringify(cityWeather));

    displayWeather(cityWeather, unit, lang);
    clearCityInput();
  } catch (error) {
    const handler = new ErrorHandler('DISPLAY_WEATHER').get();

    if (error instanceof TypeError || error instanceof ReferenceError) {
      showError(`"${error.message}" ${handler.message}`);
    } else {
      const json = JSON.parse(error.message);
      displayWeather(json, unit, lang);
      showError(`"${json.fallbackReason}" ${handler.message}`);
    }
  }

  hideLoading();
};

export const displayWeather = async (city_weather, unit, lang) => {
  const {
    name,
    weather,
    main: { humidity, pressure, temp },
    wind: { speed },
    visibility,
    sys: { sunrise, sunset },
  } = city_weather;

  elements.cityName.textContent = name;
  elements.cityDetails.textContent = `${appStore.getDetails()} -- ${appStore.getCityTimestampToNow()}`;
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
  displaySearchHistoryAndSetupEvents(appStore.getHistory());
  appStore.countUpUiUpdate();
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
    history,
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

  elements.searchHistory.title.textContent = history.title;
};

const displaySearchHistoryAndSetupEvents = (data) => {
  if (data.length <= 0) {
    elements.searchHistory.container.classList.add('hidden');
  } else {
    elements.searchHistory.container.classList.remove('hidden');
  }

  elements.searchHistory.list.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.setAttribute('data-city', JSON.stringify(item));
    const span = document.createElement('span');
    span.textContent = item?.name + ' ';
    li.appendChild(span);
    span.addEventListener('click', (event) => {
      appStore.setCity(JSON.parse(li.dataset.city).name);
      handleSearch();
      appStore.countUpHistoryLoad();
    });

    const button = document.createElement('button');
    button.innerHTML = '<i class="ri-lg ri-close-circle-line"></i>';
    button.addEventListener('click', function (event) {
      appStore.removeFromHistory(JSON.parse(li.dataset.city));
      li.remove();
    });
    li.appendChild(button);
    elements.searchHistory.list.appendChild(li);
  });
};

export const showLoading = () => {
  elements.loading.classList.remove('hidden');
  appStore.countUpUiUpdate();
};

export const hideLoading = () => {
  elements.loading.classList.add('hidden');
  appStore.countUpUiUpdate();
};

export const showError = (message) => {
  elements.error.container.classList.remove('hidden');
  elements.error.message.textContent = message;
  appStore.countUpUiUpdate();
};

export const hideError = () => {
  elements.error.container.classList.add('hidden');
  elements.error.message.textContent = '';
  appStore.countUpUiUpdate();
};

export const setTheme = (theme) => {
  elements.app.className = `container ${theme}`;
  appStore.countUpUiUpdate();
};

const getCityInput = () => {
  return elements.cityInput.value;
  appStore.countUpUiUpdate();
};

const clearCityInput = () => {
  elements.cityInput.value = '';
  appStore.countUpUiUpdate();
};
