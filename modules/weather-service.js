/**
 * WeatherService provides methods to fetch weather data from an external API,
 * handle errors gracefully, and manage weather-related data in the application.
 *
 * @class
 * @classdesc
 * This service supports fetching current weather by city name or geographic coordinates,
 * constructs API URLs, and provides utility methods for retrieving searched and favourite cities.
 * On error, it returns fallback mock data and logs the error.
 *
 * @example
 * const weatherService = new WeatherService();
 * const weather = await weatherService.getCurrentWeather('London', 'en', 'metric');
 */
import { isValidCity } from '../modules/utils.js';
import { MOCK_DATA, CONFIG, API_ENDPOINTS } from '../modules/config.js';
import ErrorHandler from './error/handler.js';
import { logger } from './logger.js';
import { appStore } from './stores/index.js';

export default class WeatherService {
  /**
   * Fetches the current weather data for a specified city.
   *
   * @async
   * @param {string} city - The name of the city to fetch weather for.
   * @param {string} lang - The language code for the response (e.g., 'en', 'ro').
   * @param {string} unit - The unit system for temperature ('metric', 'imperial', etc.).
   * @returns {Promise<Object>} The weather data as a JSON object. Returns fallback data with `isFallback: true` if an error occurs.
   */
  async getCurrentWeather(city, lang, unit, cacheEnabled = true) {
    try {
      const cityWithoutDiacritics = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!isValidCity(cityWithoutDiacritics)) new ErrorHandler('CITY_INVALID').throw();

      if (cacheEnabled) {
        const history = this._findInHistory(cityWithoutDiacritics);
        if (history) return history;
      }

      const request = await fetch(
        this._buildWeatherUrl(API_ENDPOINTS.WEATHER, { q: cityWithoutDiacritics, lang: lang, units: unit })
      );
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();

      appStore.addToHistory({
        ...json,
        source: 'api',
      });
      appStore.setCityData({
        ...json,
        source: 'api',
      });
      logger.info('[getCurrentWeather] City data has been retrieved and added to history', json);
      appStore.countUpApiCall();

      return json;
    } catch (error) {
      logger.error('[getCurrentWeather] MOCK_DATA has been loaded to UI', error);
      appStore.setCityData({
        ...MOCK_DATA,
        source: 'default'
      });

      return {
        ...MOCK_DATA,
        isFallback: true,
        fallbackReason: error.message,
      };
    }
  }

  /**
   * Fetches weather data based on geographic coordinates.
   *
   * @async
   * @param {number} latitude - The latitude of the location.
   * @param {number} longitude - The longitude of the location.
   * @param {string} lang - The language code for the response (e.g., 'en', 'ro').
   * @param {string} unit - The unit system for temperature (e.g., 'metric', 'imperial').
   * @returns {Promise<Object>} The weather data as a JSON object. If an error occurs, returns fallback mock data with error details.
   */
  async getWeatherByCoords(latitude, longitude, lang, unit, source, cacheEnabled = true) {
    try {
      if (cacheEnabled) {
        const history = this._findInHistory(latitude, longitude);
        if (history) return history;
      }

      const request = await fetch(
        this._buildWeatherUrl(API_ENDPOINTS.WEATHER, { lat: latitude, lon: longitude, lang: lang, units: unit })
      );
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();
      appStore.addToHistory({ ...json, source: source });
      appStore.setCityData({ ...json, source: source });
      logger.info('[getWeatherByCoords] City data has been retrieved and added to history', json);
      appStore.countUpApiCall();

      return json;
    } catch (error) {
      logger.error('[getWeatherByCoords] MOCK_DATA has been loaded to UI', error);
      appStore.setCityData({
        ...MOCK_DATA,
        source: 'default'
      })

      return {
        ...MOCK_DATA,
        isFallback: true,
        fallbackReason: error.message,
      };
    }
  }

  /**
   * Builds a weather API URL with the specified endpoint and query parameters.
   *
   * @private
   * @param {string} endpoint - The API endpoint to append to the base URL.
   * @param {Object} [params={}] - Additional query parameters to include in the URL.
   * @param {string} [params.city] - The city name to query; must be valid or an error is thrown.
   * @returns {string} The fully constructed URL as a string.
   * @throws {Error} If the provided city parameter is invalid.
   */
  _buildWeatherUrl(endpoint, params = {}) {
    const url = new URL(`${CONFIG.API_BASE_URL}/${endpoint}`);
    url.searchParams.set('appid', CONFIG.API_KEY);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }

  /**
   * Builds the full URL for a weather icon image based on the provided icon name.
   *
   * @private
   * @param {string} icon_name - The name of the weather icon.
   * @returns {string} The complete URL to the weather icon image.
   */
  _buildIconUrl(icon_name) {
    const url = new URL(`${CONFIG.ICON_BASE_URL}/${icon_name}@2x.png`);

    return url.toString();
  }

  _findInHistory(...args) {
    if (args.length < 1 || args.length > 2) new ErrorHandler('GENERAL').throw();

    let history;
    switch (args.length) {
      case 1:
        history = appStore.findInHistoryByName(args[0]);
        break;
      case 2:
        args = [parseFloat(args[0].toFixed(4)), parseFloat(args[1].toFixed(4))]
        history = appStore.findInHistoryByCoords(args[0], args[1]);
        break;
    }
    
    if (history) {
      if (Math.abs(dayjs(history.timestamp).diff(dayjs())) >= appStore.getMaxAge()) {
        appStore.removeFromHistory(history);
        return undefined;
      }
      
      appStore.setCityData({ ...history });
      appStore.addToHistory(history);
    }

    return history;
  }
}
