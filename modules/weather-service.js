import { sleep } from '../modules/utils.js';
import { MOCK_DATA, OPEN_WEATHER_API_HOST, OPEN_WEATHER_API_KEY } from '../modules/config.js';

export const getCurrentWeather = async (city) => {
    await sleep(500);
    const request = await fetch(`${OPEN_WEATHER_API_HOST}?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
    if (request.status === 404) {
        throw new Error('Orasul nu a fost gasit.')
    }

    if (!request.status === 200) {
        throw new Error('A aparut o eroare... Reincearca.')
    }

    const json = await request.json();
    return json;
};

export const getWeatherByCoords = async (latitude, longitude) => {
    // Similar, dar pentru coordonate
};