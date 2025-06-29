/**
 * WeatherService provides methods to fetch and manage weather data for cities and coordinates,
 * extending Storage for persistent search and favourite management.
 *
 * @class
 * @extends Storage
 */
import { isValidCity } from '../modules/utils.js';
import { MOCK_DATA, CONFIG, API_ENDPOINTS } from '../modules/config.js';
import ErrorHandler from './error/handler.js';
import Storage from './storage.js';
import { logger } from './logger.js';


export default class WeatherService extends Storage {
  constructor() {
    super({
      searched: [],
      favourites: [],
    });
  }

  /**
   * Fetches the current weather data for a specified city.
   *
   * @async
   * @param {string} city - The name of the city to fetch weather for.
   * @param {string} lang - The language code for the response (e.g., 'en', 'ro').
   * @param {string} unit - The unit system for temperature ('metric', 'imperial', etc.).
   * @returns {Promise<Object>} The weather data as a JSON object. Returns fallback data with `isFallback: true` if an error occurs.
   */
  async getCurrentWeather(city, lang, unit) {
    try {
      const cityWithoutDiacritics = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!isValidCity(cityWithoutDiacritics)) new ErrorHandler('CITY_INVALID').throw();

      const request = await fetch(
        this._buildWeatherUrl(API_ENDPOINTS.WEATHER, { q: cityWithoutDiacritics, lang: lang, units: unit })
      );
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();
      const exists = this.contains(json, 'searched', 'name');
      if (!exists) {
        this.unshift(json, 'searched');
      } else {
        this.moveToTop(exists.index, 'searched');
      }

      return json;
    } catch (error) {
      logger.error('[getCurrentWeather] Generic data has been displayed:', error);

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
  async getWeatherByCoords(latitude, longitude, lang, unit) {
    try {
      const request = await fetch(
        this._buildWeatherUrl(API_ENDPOINTS.WEATHER, { lat: latitude, lon: longitude, lang: lang, units: unit })
      );
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();
      const exists = this.contains(json, 'searched', 'name');
      if (!exists) {
        this.unshift(json, 'searched');
      } else {
        this.moveToTop(exists.index, 'searched');
      }

      return json;
    } catch (error) {
      logger.error('[getWeatherByCoords] Generic data has been displayed:', error);

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

  getSearched() {
    return this.getItem('searched');
  }

  getFavourites() {
    return this.getItem('favourites');
  }
}
