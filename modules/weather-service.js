import { isValidCity } from "../modules/utils.js";
import { MOCK_DATA, CONFIG } from "../modules/config.js";
import ErrorHandler from "./error-handler.js";
import AppStore from "./stores/index.js";

export default class WeatherService extends AppStore {
  constructor() {
    super();
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
      if (!isValidCity(city)) new ErrorHandler("CITY_INVALID").throw();

      const request = await fetch(this._buildWeatherUrl("weather", { q: city, lang: lang, units: unit }));
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();
      this.addToList({
        type: "REQUEST",
        handler: "getCurrentWeather",
        data: json,
      });

      return json;
    } catch (error) {
      console.warn("Date generice au fost afisate cauzate de eroare la apelare API:", error.message);
      this.addToList({
        type: "ERROR",
        handler: "getCurrentWeather",
        data: { message: error.message },
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
  async getWeatherByCoords(latitude, longitude, lang, unit) {
    try {
      const request = await fetch(
        this._buildWeatherUrl("weather", { lat: latitude, lon: longitude, lang: lang, unit: unit })
      );
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }
      const json = await request.json();
      this.addToList({
        type: "REQUEST",
        handler: "getWeatherByCoords",
        data: json,
      });

      return json;
    } catch (error) {
      console.warn("Date generice au fost afisate cauzate de eroare la apelare API:", error.message);
      this.addToList({
        type: "ERROR",
        handler: "getWeatherByCoords",
        data: { message: error.message },
      });

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
    url.searchParams.set("appid", CONFIG.API_KEY);

    Object.entries(params).forEach(([key, value]) => {
      if (key === "city" && !isValidCity(value)) new ErrorHandler("CITY_INVALID").throw();
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
}
