export const sleep = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

export const isValidCity = (city) => {
    // Gol? Prea scurt? Conține cifre/simboluri?
    return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city)
}

export const convertWindSpeed = (speed, unit) => {
    // Convertește m/s în km/h (×3.6)
}

export const convertDateUnixToLocale = (timestamp) => {
    // Formatează timpurile Unix în ore locale (pentru răsărit și apus)
}

export const convertVisibilityLength = (value) => {
    // example 10000 = 10 km
    // 1000 = 1 km
    // 100 = 100 m
}

export const convertTemperature = (value, unit) => {
    // [(26 * 9/5) + 32] 26 'C' = 78.8 F
    // [(78 - 32) * 5/9] 78 'F' = 25.5 C
}