export default class Storage {
  constructor(data) {
    const storage = JSON.parse(localStorage.getItem(this.constructor.name));
    if (storage) {
      this.data = storage;
      return;
    }

    this.data = data;
    localStorage.setItem(this.constructor.name, JSON.stringify(data));
  }

  /**
   * Adds a new item to the beginning of the specified array in storage and updates the stored data.
   *
   * @param {*} data - The data item to add to the beginning of the array.
   * @param {string} name - The key name of the array in the storage object.
   */
  unshift(data, name) {
    this.data[name].unshift(data);
    this.set({ [name]: this.data[name] });
  }

  /**
   * Adds a new item to the specified array in the storage and updates the storage.
   *
   * @param {*} data - The data item to be added to the array.
   * @param {string} name - The name of the array in the storage to which the data will be added.
   */
  push(data, name) {
    this.data[name].push(data);
    this.set({ [name]: this.data[name] });
  }

  /**
   * Checks if an item with a matching property value exists in the specified collection.
   *
   * @param {Object} data - The object containing the property to match.
   * @param {string} name - The name of the collection within `this.data` to search.
   * @param {string} property - The property name to compare between `data` and items in the collection.
   * @returns {boolean} Returns `true` if an item with a matching property value exists, otherwise `false`.
   */
  contains(data, name, property) {
    const item = this.data[name].find((item) => item[property] === data[property]);
    if (!item) {
      return false;
    }

    return true;
  }

  /**
   * Stores a value in the internal data object and persists it using the set method.
   *
   * @param {*} data - The value to store.
   * @param {string} name - The key under which the value will be stored.
   */
  setItem(data, name) {
    this.data[name] = data;
    this.set({ [name]: this.data[name] });
  }

  getItem(name) {
    return this.data[name];
  }

  /**
   * Updates the stored data in localStorage by merging the current data with the provided data object.
   * The merged data is saved under the class name as the key.
   *
   * @param {Object} [data={}] - The data to merge with the existing stored data.
   * @returns {Object} The updated data retrieved from storage.
   */
  set({ ...data } = {}) {
    localStorage.setItem(this.constructor.name, JSON.stringify({ ...this.data, ...data }));
    return this.get();
  }

  /**
   * Retrieves and parses the stored data from localStorage using the class name as the key.
   * @returns {any} The parsed data from localStorage, or null if no data is found.
   */
  get() {
    return JSON.parse(localStorage.getItem(this.constructor.name));
  }
}
