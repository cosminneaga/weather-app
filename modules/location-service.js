import { LocationServiceError, LocationServiceAPIError, LocationServiceGPSError } from './error/types.js';
import {logger} from './logger.js';

export default class LocationService {
  constructor() {
    this.host = 'https://ipapi.co/json';
  }

  async executeWithFallback() {
    try {
      return await this.getByGPS();
    } catch (error) {
      return await this.getByAPI();
    }
  }

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
    } catch (error) {
      logger.error(`API location failed: ${error.message}`, error);
      throw new LocationServiceAPIError(error.message);
    }
  }

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
