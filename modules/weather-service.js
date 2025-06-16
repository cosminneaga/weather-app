import { sleep } from '../modules/utils.js';
import { MOCK_DATA } from '../modules/config.js';

export const getCurrentWeather = async (city) => {
    // Simuleaza delay API (~1 secunda)
    // Returneaza MOCK_DATA cu numele orasului actualizat
    // Gestioneaza erorile
    await sleep(1000);
    return MOCK_DATA;
};

export const getWeatherByCoords = async (latitude, longitude) => {
    // Similar, dar pentru coordonate
};