/**
 * ErrorHandler class extends Storage to handle application errors with localization support.
 * It maps error codes or names to user-friendly messages in different languages.
 *
 * @class
 * @extends Storage
 *
 */
import Storage from '../storage.js';
import { appStore } from '../stores/index.js';

export default class ErrorHandler extends Storage {
  constructor(value) {
    super({
      list: [],
    });

    this.value = value;
    this.language = appStore.getLang() || 'ro';
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
          en: 'Netwrok error... Retry later.',
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
   * Retrieves an error object matching the current value and formats its message based on the selected language.
   *
   * The method determines the key to search by (`code` for numbers, `name` for strings) and finds the corresponding error in the `errors` array.
   * It then returns a new object with all properties of the found error, but with the `message` property localized to the current language.
   *
   * @returns {Object} The matched error object with a localized message, or `undefined` if no match is found.
   */
  get() {
    let key = '';
    switch (typeof this.value) {
      case 'number':
        key = 'code';
        break;
      case 'string':
        key = 'name';
        break;
      default:
        key = 'code';
        break;
    }

    const error = this.errors.find((error) => error[key] === this.value);
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
    this.setItem(error, 'list');

    throw new Error(error.message);
  }
}
