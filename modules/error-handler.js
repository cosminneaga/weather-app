export default class ErrorHandler {
  constructor(value) {
    this.value = value;
    this.errors = [
      { name: "CITY_INVALID", code: null, message: "Orasul nu e valid... Te rog introdu un oras valid." },
      {
        name: "CITY_NOT_FOUND",
        code: 404,
        message: "Orasul nu a fost gasit... Reincerca sa accesezi datele pentru un alt oras.",
      },
      { name: "NETWORK", code: null, message: "A aparut o eroare de retea... Reincerca mai tarziu." },
      { name: "AUTH", code: 401, message: "Autentificare nereusita... Te rog incerca folosind alt token." },
      { name: "SERVER", code: 500, message: "A aparut o eroare la server... Te rog incearca mai tarziu." },
      { name: "GENERAL", code: null, message: "A aparut o eroare... Reincearca." },
    ];
  }

  get() {
    let key = "";
    switch (typeof this.value) {
      case "number":
        key = "code";
        break;
      case "string":
        key = "name";
        break;
      default:
        key = "code";
        break;
    }

    return this.errors.find((error) => error[key] === this.value);
  }

  throw() {
    const error = this.get();
    throw new Error(error.message);
  }
}
