// weather.js - Weather data fetching and display

// Weather state
export let currentWeatherData = {
    rainfall: 2.0,
    soilTemp: 65,
    airTemp: 70,
    season: 'summer',
    lastUpdated: null
};
export let countyWeatherData = {};

// Add countyTowns mapping for weather queries
export const countyTowns = {
    'Coos County': 'Gorham',
    'Grafton County': 'Hanover',
    'Carroll County': 'Ossipee',
    'Sullivan County': 'Newport',
    'Merrimack County': 'Concord',
    'Belknap County': 'Laconia',
    'Cheshire County': 'Keene',
    'Hillsborough County': 'Manchester',
    'Strafford County': 'Dover',
    'Rockingham County': 'Exeter'
};

// Weather setup (attach listeners if needed)
export function setupWeather() {
    // This can be used to attach weather-related event listeners if needed
}

// Fetch weather data for all counties
export function fetchWeatherData(countyTowns, statusText, weatherStatus, updateWeatherDisplay, updateMap) {
    if (!countyTowns) return;
    if (statusText) statusText.textContent = 'Loading weather data...';
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'true');
    const counties = Object.keys(countyTowns);
    let fetches = counties.map(county => {
        const town = countyTowns[county];
        const url = `https://wttr.in/${encodeURIComponent(town)},NH?format=j1`;
        return fetch(url)
            .then(async response => {
                const contentType = response.headers.get('content-type') || '';
                if (!contentType.includes('application/json')) {
                    throw new Error('Non-JSON response');
                }
                try {
                    return await response.json();
                } catch (e) {
                    throw new Error('Invalid JSON');
                }
            })
            .then(data => {
                if (!data.current_condition || !Array.isArray(data.current_condition) || !data.current_condition[0] || !data.weather || !Array.isArray(data.weather)) {
                    throw new Error('Unexpected weather data format');
                }
                const current = data.current_condition[0];
                const recent = data.weather.slice(0, 7);
                const rainfall = recent.reduce((sum, day) => sum + parseFloat(day.precipMM || 0), 0) * 0.0394;
                const airTemp = Math.round((parseFloat(current.temp_C) * 9/5) + 32);
                const soilTemp = Math.round(airTemp - 8);
                const month = new Date().getMonth() + 1;
                let season = 'summer';
                if (month >= 4 && month <= 5) season = 'spring';
                else if (month >= 9 && month <= 11) season = 'fall';
                countyWeatherData[county] = {
                    rainfall,
                    airTemp,
                    soilTemp,
                    season,
                    lastUpdated: new Date()
                };
            })
            .catch(error => {
                countyWeatherData[county] = null;
                console.error(`Weather fetch error for ${county}:`, error);
            });
    });
    Promise.all(fetches).then(() => {
        if (statusText) statusText.textContent = 'Weather updated.';
        if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'false');
        if (typeof updateWeatherDisplay === 'function') updateWeatherDisplay();
        if (typeof updateMap === 'function') updateMap();
    });
}

// Placeholder for updateWeatherDisplay (to be implemented in main.js or here)
export function updateWeatherDisplay(county = null) {
    // Get DOM elements
    const rainfallDisplay = document.getElementById('rainfall-display');
    const soilTempDisplay = document.getElementById('soil-temp-display');
    const airTempDisplay = document.getElementById('air-temp-display');
    const statusText = document.getElementById('status-text');
    const autoWeatherCheckbox = document.getElementById('auto-weather');

    let weather = currentWeatherData;
    let countyLabel = '';
    if (county && countyWeatherData[county]) {
        weather = countyWeatherData[county];
        countyLabel = ` (${county})`;
    }
    const { rainfall, soilTemp, airTemp, lastUpdated } = weather || {};
    const rainfallStr = (rainfall !== undefined && rainfall !== null) ? `${rainfall.toFixed(2)} inches` : 'N/A';
    const soilTempStr = (soilTemp !== undefined && soilTemp !== null) ? `${soilTemp}°F` : 'N/A';
    const airTempStr = (airTemp !== undefined && airTemp !== null) ? `${airTemp}°F` : 'N/A';

    if (rainfallDisplay) rainfallDisplay.textContent = `Rainfall${countyLabel}: ${rainfallStr}`;
    if (soilTempDisplay) soilTempDisplay.textContent = `Soil Temp${countyLabel}: ${soilTempStr}`;
    if (airTempDisplay) airTempDisplay.textContent = `Air Temp${countyLabel}: ${airTempStr}`;

    let source = '';
    if (autoWeatherCheckbox && autoWeatherCheckbox.checked) {
        source = 'Data Source: wttr.in';
        if (lastUpdated) {
            const date = new Date(lastUpdated);
            source += ` (updated ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`;
        }
    } else {
        source = 'Data Source: Manual Override';
    }
    if (statusText) statusText.textContent = source + (county ? ` for ${county}` : '');
}
