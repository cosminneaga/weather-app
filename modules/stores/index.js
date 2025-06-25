export default class AppStore {
  constructor(city, unit, lang, theme, list = []) {
    const storage = JSON.parse(localStorage.getItem(this.constructor.name));
    if (storage) {
      this.city = storage.city;
      this.unit = storage.unit;
      this.lang = storage.lang;
      this.theme = storage.theme;
      this.list = storage.list;
      return;
    }

    this.city = city;
    this.unit = unit;
    this.lang = lang;
    this.theme = theme;
    this.list = list;

    const data = {
      city: this.city,
      unit: this.unit,
      lang: this.lang,
      theme: this.theme,
      list: this.list,
    };
    localStorage.setItem(this.constructor.name, JSON.stringify(data));
  }

  getAll() {
    return this;
  }

  getCity() {
    return this.city;
  }

  getUnit() {
    return this.unit;
  }

  getLang() {
    return this.lang;
  }

  getTheme() {
    return this.theme;
  }

  getList() {
    return this.list;
  }

  setCity(city) {
    this.city = city;
    this._setToLocalStorage({ city: city });
  }

  setUnit(unit) {
    this.unit = unit;
    this._setToLocalStorage({ unit: unit });
  }

  setLang(lang) {
    this.lang = lang;
    this._setToLocalStorage({ lang: lang });
  }

  setTheme(theme) {
    this.theme = theme;
    this._setToLocalStorage({ theme: theme });
  }

  addToList(item) {
    if (this.list.length > 30) this.list = [];
    this.list.unshift(item);
    this._setToLocalStorage(this.list);
  }

  addToListCitiesHistory(city) {
    const cityFound = this.list.find((item) => item?.name === city?.name);
    if (cityFound) {
      return;
    }

    this.addToList(city);
  }

  removeCityFromListByName(city_name) {
    const cityFound = this.list.find((item) => item.name === city_name);
    if (!cityFound) {
      return;
    }
    const index = this.list.indexOf(cityFound);
    this.list.splice(index, 1);
    this._setToLocalStorage({ list: this.list });
  }

  _setToLocalStorage({
    city = this.city,
    unit = this.unit,
    lang = this.lang,
    theme = this.theme,
    list = this.list,
  } = {}) {
    localStorage.setItem(this.constructor.name, JSON.stringify({ city, unit, lang, theme, list }));
  }

  getFromLocalStorage() {
    return JSON.parse(localStorage.getItem(this.constructor.name));
  }
}
