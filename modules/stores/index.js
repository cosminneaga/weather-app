/**
 * AppStore class extends Storage to manage application state for a weather app.
 * Handles city, unit, language, theme, and a list (e.g., city history).
 *
 * @class
 * @extends Storage
 *
 * @param {string} city - The initial city for the weather app.
 * @param {string} unit - The unit of measurement (e.g., 'metric', 'imperial').
 * @param {string} lang - The language code (e.g., 'en', 'ro').
 * @param {string} theme - The theme of the app (e.g., 'light', 'dark').
 * @param {Array} [list=[]] - The initial list (e.g., city history).
 */
import Storage from '../storage.js';
import { CONFIG } from '../config.js';

export default class AppStore extends Storage {
  constructor(city, unit, lang, theme, list = []) {
    super({
      city: city,
      unit: unit,
      lang: lang,
      theme: theme,
      list: list,
    });
  }

  /**
   * Retrieves all data stored in the current instance.
   * @returns {*} The data stored in the instance.
   */
  getAll() {
    return this.data;
  }

  /**
   * Retrieves the current city from the store's data.
   * @returns {string} The name of the current city.
   */
  getCity() {
    return this.data.city;
  }

  /**
   * Returns the current unit of measurement.
   * @returns {string} The unit of measurement (e.g., 'metric' or 'imperial').
   */
  getUnit() {
    return this.data.unit;
  }

  /**
   * Retrieves the current language setting from the store's data.
   * @returns {string} The current language code.
   */
  getLang() {
    return this.data.lang;
  }

  /**
   * Retrieves the current theme from the store data.
   * @returns {string} The current theme.
   */
  getTheme() {
    return this.data.theme;
  }

  /**
   * Retrieves the list from the store's data.
   *
   * @returns {Array} The current list stored in the data object.
   */
  getList() {
    return this.data.list;
  }

  /**
   * Sets the current city in the store and updates the store's state.
   *
   * @param {string} city - The name of the city to set.
   */
  setCity(city) {
    this.data.city = city;
    this.set({ city: city });
  }

  /**
   * Sets the unit of measurement for weather data and updates the store.
   *
   * @param {string} unit - The unit to set (e.g., 'metric', 'imperial').
   */
  setUnit(unit) {
    this.data.unit = unit;
    this.set({ unit: unit });
  }

  /**
   * Sets the application's language.
   *
   * @param {string} lang - The language code to set (e.g., 'en', 'ro').
   */
  setLang(lang) {
    this.data.lang = lang;
    this.set({ lang: lang });
  }

  /**
   * Sets the application's theme and updates the store with the new theme value.
   *
   * @param {string} theme - The name of the theme to set (e.g., 'light', 'dark').
   */
  setTheme(theme) {
    this.data.theme = theme;
    this.set({ theme: theme });
  }

  /**
   * Adds a data item to the specified list. If the list exceeds 30 items, it is cleared before adding.
   *
   * @param {*} data - The data item to add to the list.
   * @param {string} [name='list'] - The name of the list property to add the item to.
   */
  addToList(data, name = 'list') {
    if (this.data.list.length > 30) this.data.list = [];
    this.unshift(data, name);
  }

  /**
   * Adds a city to the list of city history if it does not already exist.
   *
   * @param {Object} city - The city object to add to the history list.
   * @param {string} city.name - The name of the city.
   * @returns {void}
   */
  addToListCitiesHistory(city) {
    const cityFound = this.data.list.find((item) => item?.name === city?.name);
    if (cityFound) {
      return;
    }

    this.addToList(city);
  }

  /**
   * Removes a city from the list by its name.
   *
   * @param {string} city_name - The name of the city to remove from the list.
   * @returns {void}
   */
  removeCityFromListByName(city_name) {
    const cityFound = this.data.list.find((item) => item.name === city_name);
    if (!cityFound) {
      return;
    }
    const index = this.data.list.indexOf(cityFound);
    this.list.splice(index, 1);
    this._setToLocalStorage({ list: this.list });
  }
}

// Singleton Pattern
/**
 * Initializes the main application store with default configuration values.
 *
 * @constant
 * @type {AppStore}
 * @param {string} CONFIG.DEFAULT.CITY - The default city for the weather app.
 * @param {string} CONFIG.DEFAULT.UNIT - The default unit of measurement (e.g., metric or imperial).
 * @param {string} CONFIG.DEFAULT.LANG - The default language for the app.
 * @param {string} CONFIG.DEFAULT.THEME - The default theme for the app (e.g., light or dark).
 */
export const appStore = new AppStore(CONFIG.DEFAULT.CITY, CONFIG.DEFAULT.UNIT, CONFIG.DEFAULT.LANG, CONFIG.DEFAULT.THEME);