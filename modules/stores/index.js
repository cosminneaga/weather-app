import Storage from "../storage.js";

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

  getAll() {
    return this.data;
  }

  getCity() {
    return this.data.city;
  }

  getUnit() {
    return this.data.unit;
  }

  getLang() {
    return this.data.lang;
  }

  getTheme() {
    return this.data.theme;
  }

  getList() {
    return this.data.list;
  }

  setCity(city) {
    this.data.city = city;
    this.set({ city: city });
  }

  setUnit(unit) {
    this.data.unit = unit;
    this.set({ unit: unit });
  }

  setLang(lang) {
    this.data.lang = lang;
    this.set({ lang: lang });
  }

  setTheme(theme) {
    this.data.theme = theme;
    this.set({ theme: theme });
  }

  addToList(data, name = "list") {
    if (this.data.list.length > 30) this.data.list = [];
    this.unshift(data, name);
  }

  addToListCitiesHistory(city) {
    const cityFound = this.data.list.find((item) => item?.name === city?.name);
    if (cityFound) {
      return;
    }

    this.addToList(city);
  }

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
