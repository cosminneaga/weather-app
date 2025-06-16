import * as service from '../modules/weather-service.js';

const elements = {
    cityInput: document.querySelector('input#city-input'),
    searchBtn: document.querySelector('button#search-btn'),
    cityName: document.querySelector('span#city-name'),
    temperature: document.querySelector('span#temperature'),
    description: document.querySelector('div#description'),
    humidity: document.querySelector('div#humidity'),
    pressure: document.querySelector('div#pressure'),
    wind: document.querySelector('div#wind'),
    visibility: document.querySelector('div#visibility'),
    sunrise: document.querySelector('div#sunrise'),
    sunset: document.querySelector('div#sunset'),
    loading: document.querySelector('div#loading'),
    error: {
        container: document.querySelector('div#error-container'),
        closeBtn: document.querySelector('button#error-close'),
        message: document.querySelector('div#error-message'),
    }
};

export const setupEventListeners = () => {
    // Submit în form (enter din search field sau click pe buton)
}

export const handleSearch = async () => {
    // Validează input
    // Arată loading
    // Apelează weather service
    // Ascunde loading, arată rezultat
    // Gestionează erorile
}

export const showLoading = () => {
    elements.loading.classList.remove('hidden');
}

export const hideLoading = () => {
    elements.loading.classList.add('hidden');
}

export const showError = (message) => {
    elements.error.container.classList.remove('hidden');
    elements.error.message.textContent = message;
}

export const hideError = () => {
    elements.error.container.classList.add('hidden');
    elements.error.message.textContent = '';
}

export const displayWeather = async () => {
    showLoading();

    try {
        const cityWeather = await service.getCurrentWeather('Oradea');
        console.log(cityWeather);
        elements.cityName.textContent = cityWeather.name;
        elements.temperature.textContent = cityWeather.main.temp;

        elements.description.textContent = cityWeather.weather[0].description;

        elements.humidity.children[0].textContent = `${cityWeather.main.humidity}%`;
        elements.pressure.children[0].textContent = `${cityWeather.main.pressure} hPa`;
        elements.wind.children[0].textContent = `${cityWeather.wind.speed} km/h`;
        elements.visibility.children[0].textContent = `${cityWeather.visibility} km`;
        elements.sunrise.children[0].textContent = `${cityWeather.sys.sunrise}`;
        elements.sunset.children[0].textContent = `${cityWeather.sys.sunset}`;
    } catch (error) {
        showError(error.message);
    }

    hideLoading();
}

export const getCityInput = () => {

}

export const clearCityInput = () => {

}