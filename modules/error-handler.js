import { CONFIG } from "./config.js";

export default class ErrorHandler {
  constructor(value, language = "ro") {
    this.value = value;
    this.language = language;
    this.errors = [
      {
        name: "CITY_INVALID",
        code: null,
        message: {
          ro: "Orasul nu e valid... Te rog introdu un oras valid.",
          en: "The city is invalid... Please enter a valid city.",
        },
      },
      {
        name: "CITY_NOT_FOUND",
        code: 404,
        message: {
          ro: "Orasul nu a fost gasit... Reincerca sa accesezi datele pentru un alt oras.",
          en: "The city wasn't found... Retry to access the data of another city",
        },
      },
      {
        name: "NETWORK",
        code: null,
        message: {
          ro: "A aparut o eroare de retea... Reincerca mai tarziu.",
          en: "Netwrok error... Retry later.",
        },
      },
      {
        name: "AUTH",
        code: 401,
        message: {
          ro: "Autentificare nereusita... Te rog incerca folosind alt token.",
          en: "Authentication unsuccessful... Please try using another token.",
        },
      },
      {
        name: "SERVER",
        code: 500,
        message: {
          ro: "A aparut o eroare la server... Te rog incearca mai tarziu.",
          en: "A server error arised... Please try again later.",
        },
      },
      {
        name: "GENERAL",
        code: null,
        message: {
          ro: "A aparut o eroare... Reincearca.",
          en: "An error arised... Retry.",
        },
      },
      {
        name: "DISPLAY_WEATHER",
        code: null,
        message: {
          ro: "Din cauza acestei erori un oras default va fi afisat.",
          en: "Due to an error a default city will be displayed.",
        },
      },
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

    const error = this.errors.find((error) => error[key] === this.value);
    return {
      ...error,
      message: error.message[this.language],
    };
  }

  throw() {
    const error = this.get();
    throw new Error(error.message);
  }
}
