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
 * Simplified versions of actual speciesData from species.js
 */
export const mockSpeciesData = {
  morels: {
    name: 'Morels (4 varieties)',
    tempRange: [50, 70],
    moistureMin: 1.0,
    seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0, winter: 0.0 },
    hostTrees: ['ash', 'elm', 'apple'],
    regions: {
      'Great North Woods': 0.6,
      'White Mountains': 0.7,
      'Dartmouth-Sunapee': 0.8,
      'Merrimack Valley': 0.9,
      'Lakes Region': 0.7,
      'Monadnock Region': 0.8,
      'Seacoast': 0.6
    }
  },
  chanterelles: {
    name: 'Chanterelles (4 varieties)',
    tempRange: [60, 75],
    moistureMin: 1.5,
    seasonMultiplier: { spring: 0.3, summer: 1.0, fall: 0.8, winter: 0.0 },
    hostTrees: ['oak', 'beech'],
    regions: {
      'Great North Woods': 0.8,
      'White Mountains': 0.9,
      'Dartmouth-Sunapee': 0.8,
      'Merrimack Valley': 0.6,
      'Lakes Region': 0.7,
      'Monadnock Region': 0.7,
      'Seacoast': 0.5
    }
  },
  blacktrumpets: {
    name: 'Black Trumpet',
    tempRange: [55, 75],
    moistureMin: 2.0,
    seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0, winter: 0.0 },
    hostTrees: ['oak', 'beech', 'maple'],
    regions: {
      'Great North Woods': 0.3,
      'White Mountains': 0.45,
      'Dartmouth-Sunapee': 0.7,
      'Merrimack Valley': 0.7,
      'Lakes Region': 0.6,
      'Monadnock Region': 0.8,
      'Seacoast': 0.4
    }
  },
  boletusEdulis: {
    name: 'King Bolete (Boletus edulis)',
    tempRange: [55, 70],
    moistureMin: 1.8,
    seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0, winter: 0.0 },
    hostTrees: ['spruce', 'pine', 'hemlock'],
    regions: {
      'Great North Woods': 0.9,
      'White Mountains': 0.95,
      'Dartmouth-Sunapee': 0.7,
      'Merrimack Valley': 0.5,
      'Lakes Region': 0.7,
      'Monadnock Region': 0.6,
      'Seacoast': 0.3
    }
  },
  maitake: {
    name: 'Maitake (Grifola frondosa)',
    tempRange: [60, 75],
    moistureMin: 1.5,
    seasonMultiplier: { spring: 0.1, summer: 0.6, fall: 1.0, winter: 0.0 },
    hostTrees: ['oak'],
    regions: {
      'Great North Woods': 0.3,
      'White Mountains': 0.4,
      'Dartmouth-Sunapee': 0.6,
      'Merrimack Valley': 0.7,
      'Lakes Region': 0.5,
      'Monadnock Region': 0.7,
      'Seacoast': 0.4
    }
  }
};

/**
 * Mock NH county-to-region mapping
 */
export const mockCountyRegions = {
  'coos': 'Great North Woods',
  'grafton': 'White Mountains',
  'carroll': 'White Mountains',
  'sullivan': 'Dartmouth-Sunapee',
  'merrimack': 'Merrimack Valley',
  'belknap': 'Lakes Region',
  'cheshire': 'Monadnock Region',
  'hillsborough': 'Merrimack Valley',
  'strafford': 'Seacoast',
  'rockingham': 'Seacoast'
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
 * Mock foraging report data for testing
 */
export const mockForagingReports = {
  successfulMorels: {
    county: 'grafton',
    species: 'morels',
    predicted_probability: 0.75,
    actual_success: true,
    quantity_found: 'moderate',
    confidence_level: 'high',
    weather_conditions: {
      rainfall_7day: 1.5,
      soil_temp: 58,
      air_temp: 65,
      humidity: 70,
      season: 'spring'
    },
    location_details: {
      elevation: 1200,
      habitat: 'mixed hardwoods',
      gps_coords: [44.0, -71.5],
      access_notes: 'Public trail access'
    },
    user_notes: 'Found near dead elm trees',
    photo_uploaded: true,
    verified_by_expert: false
  },
  unsuccessfulChanterelles: {
    county: 'merrimack',
    species: 'chanterelles',
    predicted_probability: 0.45,
    actual_success: false,
    quantity_found: 'none',
    confidence_level: 'medium',
    weather_conditions: {
      rainfall_7day: 0.5,
      soil_temp: 62,
      air_temp: 72,
      humidity: 50,
      season: 'summer'
    },
    location_details: {
      elevation: 800,
      habitat: 'oak forest',
      gps_coords: null,
      access_notes: ''
    },
    user_notes: 'Too dry this week',
    photo_uploaded: false,
    verified_by_expert: false
  },
  successfulBlackTrumpets: {
    county: 'cheshire',
    species: 'blacktrumpets',
    predicted_probability: 0.82,
    actual_success: true,
    quantity_found: 'heavy',
    confidence_level: 'high',
    weather_conditions: {
      rainfall_7day: 2.5,
      soil_temp: 65,
      air_temp: 68,
      humidity: 85,
      season: 'fall'
    },
    location_details: {
      elevation: 1000,
      habitat: 'beech-maple forest',
      gps_coords: [42.9, -72.1],
      access_notes: 'Conservation land'
    },
    user_notes: 'Excellent fruiting year',
    photo_uploaded: true,
    verified_by_expert: true
  }
};

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
