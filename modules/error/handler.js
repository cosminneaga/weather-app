
/**
 * ErrorHandler class manages application errors, providing localized messages and error handling utilities.
 *
 * @class
 * @example
 * import { errorHandler } from './handler.js';
 * try {
 *   errorHandler.throw('CITY_NOT_FOUND');
 * } catch (e) {
 *   console.error(e.message);
 * }
 */
import { appStore } from '../stores/index.js';
import { logger } from '../logger.js';

export default class ErrorHandler {
  constructor(value) {
    this.value = value;
    this.language = appStore.getLang();
    this.errors = [
      {
        name: 'CITY_INVALID',
        code: null,
        message: {
          ro: 'Orasul nu e valid... Te rog introdu un oras valid.',
          en: 'The city is invalid... Please enter a valid city.',
        },
      },
      {
        name: 'CITY_NOT_FOUND',
        code: 404,
        message: {
          ro: 'Orasul nu a fost gasit... Reincerca sa accesezi datele pentru un alt oras.',
          en: "The city wasn't found... Retry to access the data of another city",
        },
      },
      {
        name: 'NETWORK',
        code: null,
        message: {
          ro: 'A aparut o eroare de retea... Reincerca mai tarziu.',
          en: 'Network error... Retry later.',
        },
      },
      {
        name: 'AUTH',
        code: 401,
        message: {
          ro: 'Autentificare nereusita... Te rog incerca folosind alt token.',
          en: 'Authentication unsuccessful... Please try using another token.',
        },
      },
      {
        name: 'SERVER',
        code: 500,
        message: {
          ro: 'A aparut o eroare la server... Te rog incearca mai tarziu.',
          en: 'A server error arised... Please try again later.',
        },
      },
      {
        name: 'GENERAL',
        code: null,
        message: {
          ro: 'A aparut o eroare... Reincearca.',
          en: 'An error arised... Retry.',
        },
      },
      {
        name: 'DISPLAY_WEATHER',
        code: null,
        message: {
          ro: 'Din cauza acestei erori un oras default va fi afisat.',
          en: 'Due to an error a default city will be displayed.',
        },
      },
    ];
  }


  /**
   * Retrieves an error object by its code (number) or name (string).
   *
   * @param {string|number} value - The error code (number) or name (string) to look up.
   * @returns {Object} The matched error object with a localized message.
   * @throws {TypeError} If the value is not a string or number.
   * @throws {Error} If the value does not match any known error code or name.
   */
  get() {
    if (!['string', 'number'].includes(typeof this.value)) throw new TypeError(`The type of ${this.value} must be "number" or "string"`);

    let key = null;
    switch (typeof this.value) {
      case 'number':
        const codes = this.errors.map((item) => item.code).filter((item) => item !== null);
        if (!codes.includes(this.value)) throw new Error(`The value '${this.value}' should be one of the followings: ${codes.join(',')}`);
        key = 'code';
        break;
      case 'string':
        const names = this.errors.map((item) => item.name);
        if (!names.includes(this.value)) throw new Error(`The value '${this.value}' should be one of the followings: ${codes.join(',')}`);
        key = 'name';
        break;
    }

    const error = this.errors.find((error) => error[key] === this.value);
    logger.debug('[ErrorHandler.get] Has been triggered', { data: this.value, error: error });
    return {
      ...error,
      message: error.message[this.language],
    };
  }

  /**
   * Throws an error using the current error object.
   * Retrieves the current error, stores it in a list, and then throws a new Error with the error's message.
   * @throws {Error} Throws an error with the current error's message.
   */
  throw() {
    const error = this.get();
    logger.debug('[ErrorHandler.throw] Has been triggered', { data: this.value, error: error });
    throw new Error(error.message);
  }
}