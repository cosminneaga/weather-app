/**
 * LocationService provides methods to retrieve the user's geographic location using either
 * the device's GPS or a remote API as a fallback. It handles errors and logs relevant information.
 *
 * @class
 */
import { LocationServiceError, LocationServiceAPIError, LocationServiceGPSError } from './error/types.js';
import {logger} from './logger.js';

export default class LocationService {
  constructor() {
    this.host = 'https://ipapi.co/json';
  }

  /**
   * Attempts to retrieve the location using GPS. If that fails, falls back to retrieving the location via an API.
   * @returns {Promise<any>} A promise that resolves with the location data from either GPS or API.
   * @throws {Error} If both GPS and API retrieval fail.
   */
  async executeWithFallback() {
    try {
      return await this.getByGPS();
    } catch (error) {
      return await this.getByAPI();
    }
  }

  /**
   * Retrieves the user's location data from a remote API.
   *
   * @async
   * @returns {Promise<{latitude: number, longitude: number, source: string, accuracy: string}>}
   *   An object containing latitude, longitude, source, and accuracy of the location.
   * @throws {LocationServiceAPIError} If the API request fails.
   */
  async getByAPI() {
    try {
      const response = await fetch(this.host);
      const data = await response.json();
      const result = {
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'ip',
        accuracy: 'city',
      };
      logger.info('Location retrieved using API', result);
      return result;
    } catch (error) {
      logger.error(`API location failed: ${error.message}`, error);
      throw new LocationServiceAPIError(error.message);
    }
  }

  /**
   * Retrieves the current geographic location using the device's GPS.
   *
   * @async
   * @function
   * @param {PositionOptions} [options] - Optional geolocation API options.
   * @returns {Promise<{latitude: number, longitude: number, source: string, accuracy: string}>}
   *   An object containing latitude, longitude, source ('gps'), and accuracy ('precise').
   * @throws {LocationServiceGPSError} If geolocation retrieval fails.
   */
  async getByGPS(options) {
    try {
      const data = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
      const result = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        source: 'gps',
        accuracy: 'precise',
      };
      logger.info('Location retrieved using GPS:', result);
      return result;
    } catch (error) {
      logger.error(`Geolocation failed: ${error.message}`, error);
      throw new LocationServiceGPSError(error.message);
    }
  }
}
