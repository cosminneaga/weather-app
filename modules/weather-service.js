import { isValidCity } from "../modules/utils.js";
import { MOCK_DATA, CONFIG } from "../modules/config.js";
import ErrorHandler from "./error-handler.js";

export default class WeatherService {
  /**
   * Retrieves the current weather data for a specified city.
   * If the request fails, returns fallback mock data with error details.
   *
   * @async
   * @param {string} city - The name of the city to fetch weather data for.
   * @returns {Promise<Object>} The weather data as a JSON object. If fallback is used, includes `isFallback` and `fallbackReason` properties.
   */
  async getCurrentWeather(city) {
    try {
      if (!isValidCity(city)) new ErrorHandler("CITY_INVALID").throw();

      const request = await fetch(WeatherService._buildWeatherUrl("weather", { q: city }));
      if (!request.ok) {
        new ErrorHandler(request.status).throw();
      }

      return await request.json();
    } catch (error) {
      console.warn("Date generice au fost afisate cauzate de eroare la apelare API:", error.message);

      return {
        ...MOCK_DATA,
        isFallback: true,
        fallbackReason: error.message,
      };
    }
  }

  async getWeatherByCoords(latitude, longitude) {
    // Similar, dar pentru coordonate
  }

  /**
   * Builds a weather API URL with the specified endpoint and query parameters.
   *
   * @private
   * @static
   * @param {string} endpoint - The API endpoint to append to the base URL.
   * @param {Object} [params={}] - Additional query parameters to include in the URL.
   * @param {string} [params.city] - The city name to query; must be valid or an error is thrown.
   * @returns {string} The fully constructed URL as a string.
   * @throws {Error} If the provided city parameter is invalid.
   */
  static _buildWeatherUrl(endpoint, params = {}) {
    const url = new URL(`${CONFIG.API_BASE_URL}/${endpoint}`);

    url.searchParams.set("appid", CONFIG.API_KEY);
    url.searchParams.set("units", CONFIG.DEFAULT_UNIT);
    url.searchParams.set("lang", CONFIG.DEFAULT_LANG);

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
   * @static
   * @param {string} icon_name - The name of the weather icon.
   * @returns {string} The complete URL to the weather icon image.
   */
  static _buildIconUrl(icon_name) {
    const url = new URL(`${CONFIG.ICON_BASE_URL}/${icon_name}@2x.png`);

    return url.toString();
  }
}
