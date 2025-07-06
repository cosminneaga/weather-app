
import Storage from '../storage.js';
import { CONFIG, MOCK_DATA, getTranslation } from '../config.js';
import { AppStoreError } from '../error/types.js';

export default class AppStore extends Storage {
  constructor(city, unit, lang, theme, favourites = [], history = []) {
    super({
      city: city,
      unit: unit,
      lang: lang,
      theme: theme,
      favourites: favourites,
      history: history,
      favouritesLimit: 10,
      historyLimit: 10,
      benchmark: {
        appLoad: 0,
        apiCall: 0,
        uiUpdate: 0,
        historyLoad: 0,
      },
      timestamp: dayjs(),
      maxAge: CONFIG.CACHE.CITY,
      cityData: MOCK_DATA,
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
   * Retrieves the details from the data object.
   * @returns {Object} The details stored in the data object.
   */
  getDetails() {
    return this.data.details;
  }

  /**
   * Retrieves the list of favourite items from the store data.
   * @returns {Array} An array containing the user's favourite items.
   */
  getFavourites() {
    return this.data.favourites;
  }

  /**
   * Retrieves the history data from the store.
   * @returns {Array} The history of weather data.
   */
  getHistory() {
    return this.data.history;
  }

  /**
   * Retrieves the benchmark data from the store.
   * @returns {*} The benchmark data stored in this.data.benchmark.
   */
  getBenchmark() {
    return this.data.benchmark;
  }

  /**
   * Returns the current timestamp stored in the data object.
   * @returns {string} The timestamp value.
   */
  getTimestamp() {
    return this.data.timestamp;
  }

  /**
   * Returns a human-readable string representing the time elapsed from the stored timestamp to now.
   * @returns {string} A relative time string (e.g., "3 hours ago").
   */
  getToNow() {
    dayjs.locale(appStore.getLang());
    return dayjs().to(this.data.timestamp);
  }

  /**
   * Retrieves the maximum age value from the data store.
   * @returns {number} The maximum age stored in the data.
   */
  getMaxAge() {
    return this.data.maxAge;
  }

  /**
   * Retrieves the city data from the store.
   * @returns {Object} The city data object.
   */
  getCityData() {
    return this.data.cityData;
  }

  /**
   * Returns a human-readable relative time string from the city's timestamp to now.
   * Sets the locale based on the current language.
   * @returns {string} A string representing the time elapsed since the city's timestamp (e.g., "3 hours ago").
   */
  getCityTimestampToNow() {
    dayjs.locale(this.getLang());
    return dayjs().to(this.data.cityData.timestamp);
  }

  findInHistoryByName(cityName) {
    const city = this.getHistory().find(city => city.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() == cityName.toLowerCase());
    this.setItem(city, 'cityData');
    return city;
  }

  findInHistoryByCoords(lat, lon) {    
    const city = this.getHistory().find(city => city.coord.lat === lat && city.coord.lon === lon);
    this.setItem(city, 'cityData');
    return city;
  }

  /**
   * Sets the current city in the store and updates the store's state.
   * @param {string} city - The name of the city to set.
   */
  setCity(city) {
    this.setItem(city, 'city');
  }

  /**
   * Sets the unit of measurement for weather data and updates the store.
   * @param {string} unit - The unit to set (e.g., 'metric', 'imperial').
   */
  setUnit(unit) {
    this.setItem(unit, 'unit');
  }

  /**
   * Sets the application's language.
   * @param {string} lang - The language code to set (e.g., 'en', 'ro').
   */
  setLang(lang) {
    this.setItem(lang, 'lang');
    this.setCityData(this.data.cityData);
  }

  /**
   * Sets the application's theme and updates the store with the new theme value.
   * @param {string} theme - The name of the theme to set (e.g., 'light', 'dark').
   */
  setTheme(theme) {
    this.setItem(theme, 'theme');
  }

  /**
   * Retrieves the message details from the city data.
   * @returns {string} The message from the city details.
   */
  getDetails() {
    return this.data.cityData.details.message;
  }
  
  /**
   * Generates city details based on the provided type.
   *
   * @param {string} type - The type of city details to generate. Must be one of the values in CONFIG.DATA_TYPE (e.g., "default", "ip", "gps").
   * @returns {{ type: string, message: string }} An object containing the type and the corresponding translated message.
   * @throws {AppStoreError} If the provided type is not valid.
   */
  generateDetails(type) {
    if (!CONFIG.DATA_TYPE.includes(type)) throw new AppStoreError('City details type must be one of the followings: "default", "ip", "gps"');

    const lang = this.getLang();
    const translation = getTranslation(lang);

    return {
      type: type,
      message: translation.cityDetails[type]
    };
  }

  /**
   * Stores city data along with the current timestamp.
   * @param {Object} cityData - The data object containing information about the city.
   * @returns {void}
   */
  setCityData(cityData) {
    this.setItem({
      ...cityData,
      timestamp: cityData.timestamp ? cityData.timestamp : dayjs(),
      details: { ...this.generateDetails(cityData.source) }
    }, 'cityData');
  }

  /**
   * Increments the app load benchmark counter by 1.
   * @method
   * @returns {void}
   */
  countUpAppLoad() {
    this.data.benchmark.appLoad += 1;
  }

  /**
   * Increments the API call count in the benchmark data object by 1.
   * @method
   * @returns {void}
   */
  countUpApiCall() {
    this.data.benchmark.apiCall += 1;
  }

  /**
   * Increments the UI update benchmark counter by 1.
   * @method
   * @returns {void}
   */
  countUpUiUpdate() {
    this.data.benchmark.uiUpdate += 1;
  }

  /**
   * Increments the `historyLoad` counter in the `benchmark` data object by 1.
   * @method
   * @returns {void}
   */
  countUpHistoryLoad() {
    this.data.benchmark.historyLoad += 1;
  }

  /**
   * Adds a data item to the favourites list.
   * If the favourites list has reached its limit, removes the last item before adding.
   * If the item already exists (based on the 'name' property), moves it to the top.
   * Otherwise, adds the item to the top of the favourites list.
   *
   * @param {Object} data - The data item to add to favourites.
   */
  addToFavourites(data) {
    if (this.data.favourites.length >= this.data.favouritesLimit) {
      this.pop('favourites');
    }
    const exists = this.contains(data, 'favourites', 'name');
    if (exists) {
      return this.moveToTop(exists.index, 'favourites');
    }
    this.unshift(data, 'favourites');
  }

  /**
   * Adds a data entry to the history array, ensuring the history does not exceed the specified limit.
   * If the entry already exists (based on the 'name' property), it moves the existing entry to the top.
   * Otherwise, it adds the new entry to the top of the history.
   *
   * @param {Object} data - The data object to add to the history.
   */
  addToHistory(data) {
    if (this.data.history.length >= this.data.historyLimit) {
      this.pop('history');
    }
    const exists = this.contains(data, 'history', 'name');
    if (exists) {
      return this.moveToTop(exists.index, 'history');
    }
    this.unshift({
      ...data,
      timestamp: data.timestamp ? data.timestamp : dayjs(),
      details: { ...this.generateDetails(data.source) }
    }, 'history');
  }

  /**
   * Removes a city from the list of favourites.
   *
   * @param {Object} data - The city object to remove from favourites.
   * @throws {AppStoreError} If the city is not found in the list of favourites.
   */
  removeFromFavourites(data) {
    const exists = this.contains(data, 'favourites', 'name');
    if (!exists) throw new AppStoreError(`City "${data.name}" has not been found in the list of favourites.`);
    this.splice(exists.index, 'favourites');
  }

  /**
   * Removes a city from the history list.
   * 
   * @param {Object} data - The city data object to remove from history.
   * @throws {AppStoreError} If the city is not found in the history.
   */
  removeFromHistory(data) {
    const exists = this.contains(data, 'history', 'name');
    if (!exists) throw new AppStoreError(`City "${data.name}" has not been found in the history.`);
    this.splice(exists.index, 'history');
  }

  clearFavourites() {
    this.clear([], 'favourites');
  }

  clearHistory() {
    this.clear([], 'history');
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
export const appStore = new AppStore(
  CONFIG.DEFAULT.CITY,
  CONFIG.DEFAULT.UNIT,
  CONFIG.DEFAULT.LANG,
  CONFIG.DEFAULT.THEME,
);