/**
 * Mock Data for Testing
 * Shared test fixtures and helper data
 */

/**
 * Mock weather data for testing
 */
export const mockWeatherData = {
  typical: {
    airTemp: 65,
    humidity: 70,
    precipitation: 0.5,
    soilTemp: 56 // 65 - 8 (base) - 1 (precip 0.5*2) = 56
  },
  hot: {
    airTemp: 85,
    humidity: 50,
    precipitation: 0,
    soilTemp: 75
  },
  cold: {
    airTemp: 45,
    humidity: 60,
    precipitation: 1.0,
    soilTemp: 33
  },
  rainy: {
    airTemp: 60,
    humidity: 90,
    precipitation: 3.0,
    soilTemp: 46
  },
  dry: {
    airTemp: 70,
    humidity: 30,
    precipitation: 0,
    soilTemp: 60
  }
};

/**
 * Mock county data
 */
export const mockCounties = [
  'coos',
  'grafton',
  'carroll',
  'sullivan',
  'merrimack',
  'belknap',
  'cheshire',
  'hillsborough',
  'strafford',
  'rockingham'
];

/**
 * Mock Open-Meteo API response
 */
export const mockOpenMeteoResponse = {
  latitude: 43.2081,
  longitude: -71.5376,
  timezone: 'America/New_York',
  current: {
    temperature_2m: 65.5,
    relative_humidity_2m: 72,
    precipitation: 0.02,
    rain: 0.02,
    showers: 0
  },
  hourly: {
    temperature_2m: Array(24).fill(65),
    relative_humidity_2m: Array(24).fill(70),
    precipitation_probability: Array(24).fill(30),
    precipitation: Array(24).fill(0.1),
    rain: Array(24).fill(0.05),
    showers: Array(24).fill(0.05),
    soil_temperature_0cm: Array(24).fill(60),
    soil_temperature_6cm: Array(24).fill(58),
    soil_temperature_18cm: Array(24).fill(56),
    soil_moisture_0_to_1cm: Array(24).fill(0.3),
    soil_moisture_1_to_3cm: Array(24).fill(0.35),
    soil_moisture_3_to_9cm: Array(24).fill(0.4)
  },
  daily: {
    rain_sum: [0.5],
    showers_sum: [0.2],
    precipitation_sum: [0.7]
  }
};

/**
 * Mock species data for testing probability calculations
 */
export const mockSpeciesData = {
  morels: {
    name: 'Morels (4 varieties)',
    tempRange: [50, 70],
    moistureMin: 1.0,
    seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0 },
    regions: {
      'Great North Woods': 0.6,
      'White Mountains': 0.8,
      'Lakes Region': 0.7,
      'Seacoast': 0.4,
      'Merrimack Valley': 0.6,
      'Monadnock Region': 0.7,
      'Connecticut Valley': 0.7
    }
  },
  chanterelles: {
    name: 'Chanterelles (3 varieties)',
    tempRange: [60, 75],
    moistureMin: 1.5,
    seasonMultiplier: { spring: 0.3, summer: 1.0, fall: 0.8 },
    regions: {
      'Great North Woods': 0.8,
      'White Mountains': 0.9,
      'Lakes Region': 0.7,
      'Seacoast': 0.5,
      'Merrimack Valley': 0.6,
      'Monadnock Region': 0.7,
      'Connecticut Valley': 0.7
    }
  }
};

/**
 * Helper function to create mock localStorage
 */
export function createMockLocalStorage() {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
}

/**
 * Helper function to mock fetch responses
 */
export function createMockFetch(responseData, options = {}) {
  const {
    ok = true,
    status = 200,
    statusText = 'OK',
    delay = 0
  } = options;

  return vi.fn(() =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          ok,
          status,
          statusText,
          json: async () => responseData,
          text: async () => JSON.stringify(responseData)
        });
      }, delay)
    )
  );
}
