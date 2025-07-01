export const sleep = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

export const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city);
};

export const convertWindSpeedInKm = (speed) => {
  return (speed * 3.6).toFixed(1);
};

export const convertDateUnixToLocaleTime = (timestamp) => {
  return dayjs.unix(timestamp).format('HH:mm');
};

export const convertVisibilityLength = (value) => {
  if (value <= 999) {
    return `${value} m`;
  }

  return `${(value / 1000).toFixed(1)} km`;
};

export const convertTemperature = (value, unit) => {
  // [(26 * 9/5) + 32] 26 'C' = 78.8 F
  // [(78 - 32) * 5/9] 78 'F' = 25.5 C

  switch (unit) {
    case 'C':
      return `${((value * 9) / 5 + 32).toFixed(1)} °F`;
    case 'F':
      return `${(((value - 32) * 5) / 9).toFixed(1)} °C`;
  }
};

export const getTemperatureSymbol = (unit) => {
  switch (unit) {
    case 'standard':
      return '°K';
    case 'metric':
      return '°C';
    case 'imperial':
      return '°F';
  }
};

export const getWindSpeedSuffix = (unit) => {
  switch (unit) {
    case 'standard':
      return 'm/s';
    case 'metric':
      return 'm/s';
    case 'imperial':
      return 'm/h';
  }
};
