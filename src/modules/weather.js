// weather.js - Weather data fetching and display

// Weather state management
export let currentWeatherData = {
    rainfall: 2.0,
    soilTemp: 65,
    airTemp: 70,
    season: 'summer',
    lastUpdated: null
};

export let countyWeatherData = {};

// County-to-town mapping for weather API queries
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

/**
 * Fetch weather data for all NH counties
 * @param {Function} onComplete - Callback when weather fetch completes
 * @param {Function} onUpdate - Callback for UI updates
 */
export async function fetchWeatherData(onComplete, onUpdate) {
    const statusText = document.getElementById('status-text');
    const weatherStatus = document.getElementById('weather-status');
    
    if (statusText) statusText.textContent = 'Loading weather data...';
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'true');
    
    const counties = Object.keys(countyTowns);
    const fetchPromises = counties.map(async county => {
        const town = countyTowns[county];
        const url = `https://wttr.in/${encodeURIComponent(town)},NH?format=j1`;
        
        try {
            const response = await fetch(url);
            const contentType = response.headers.get('content-type') || '';
            
            if (!contentType.includes('application/json')) {
                throw new Error('Non-JSON response');
            }
            
            const data = await response.json();
            
            if (!data.current_condition?.[0] || !data.weather) {
                throw new Error('Unexpected weather data format');
            }
            
            const current = data.current_condition[0];
            const recent = data.weather.slice(0, 7);
            
            // Calculate rainfall over past 7 days
            const rainfall = recent.reduce((sum, day) => {
                return sum + parseFloat(day.precipMM || 0);
            }, 0) * 0.0394; // Convert mm to inches
            
            // Temperature calculations
            const airTemp = Math.round((parseFloat(current.temp_C) * 9/5) + 32);
            const soilTemp = Math.round(airTemp - 8); // Soil temp approximation
            
            // Determine season
            const month = new Date().getMonth() + 1;
            let season = 'summer';
            if (month >= 4 && month <= 5) season = 'spring';
            else if (month >= 9 && month <= 11) season = 'fall';
            else if (month >= 12 || month <= 3) season = 'winter';
            
            countyWeatherData[county] = {
                rainfall,
                airTemp,
                soilTemp,
                season,
                lastUpdated: new Date(),
                town
            };
            
            // Update current weather if this is a central county
            if (county === 'Merrimack County') {
                currentWeatherData = { ...countyWeatherData[county] };
            }
            
        } catch (error) {
            console.error(`Weather fetch error for ${county}:`, error);
            countyWeatherData[county] = null;
        }
    });
    
    await Promise.all(fetchPromises);
    
    if (statusText) statusText.textContent = 'Weather data loaded';
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'false');
    
    // Call callbacks
    if (onUpdate) onUpdate();
    if (onComplete) onComplete();
}

/**
 * Update weather display for specific county or current data
 * @param {string} county - Optional county to display data for
 */
export function updateWeatherDisplay(county = null) {
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
    
    // Format display values
    const rainfallStr = (rainfall !== undefined && rainfall !== null) 
        ? `${rainfall.toFixed(2)} inches` : 'N/A';
    const soilTempStr = (soilTemp !== undefined && soilTemp !== null) 
        ? `${soilTemp}°F` : 'N/A';
    const airTempStr = (airTemp !== undefined && airTemp !== null) 
        ? `${airTemp}°F` : 'N/A';
    
    // Update display elements
    if (rainfallDisplay) rainfallDisplay.textContent = `${rainfallStr}${countyLabel}`;
    if (soilTempDisplay) soilTempDisplay.textContent = `${soilTempStr}${countyLabel}`;
    if (airTempDisplay) airTempDisplay.textContent = `${airTempStr}${countyLabel}`;
    
    // Update status text
    let source = '';
    if (autoWeatherCheckbox?.checked) {
        source = 'Data Source: wttr.in';
        if (lastUpdated) {
            const date = new Date(lastUpdated);
            source += ` (updated ${date.toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit'
            })})`;
        }
    } else {
        source = 'Data Source: Manual Override';
    }
    
    if (statusText) {
        statusText.textContent = source + (county ? ` for ${county}` : '');
    }
}

/**
 * Get weather data for calculations
 * @param {string} county - County name
 * @returns {Object} Weather data object
 */
export function getWeatherData(county = null) {
    const autoWeatherCheckbox = document.getElementById('auto-weather');
    
    if (autoWeatherCheckbox?.checked) {
        return county && countyWeatherData[county] 
            ? countyWeatherData[county] 
            : currentWeatherData;
    } else {
        // Return manual override values
        const rainfallSlider = document.getElementById('rainfall');
        const soilTempSlider = document.getElementById('soil-temp');
        const airTempSlider = document.getElementById('air-temp');
        const seasonSelect = document.getElementById('season');
        
        return {
            rainfall: parseFloat(rainfallSlider?.value || 2.0),
            soilTemp: parseInt(soilTempSlider?.value || 65),
            airTemp: parseInt(airTempSlider?.value || 70),
            season: seasonSelect?.value || 'summer'
        };
    }
}

/**
 * Toggle between automatic weather and manual override
 */
export function toggleWeatherMode() {
    const autoWeatherCheckbox = document.getElementById('auto-weather');
    const manualControls = document.getElementById('manual-controls');
    const weatherDisplay = document.getElementById('weather-display');
    
    if (autoWeatherCheckbox?.checked) {
        if (manualControls) manualControls.style.display = 'none';
        if (weatherDisplay) weatherDisplay.style.display = 'block';
        updateWeatherDisplay();
    } else {
        if (manualControls) manualControls.style.display = 'block';
        if (weatherDisplay) weatherDisplay.style.display = 'none';
    }
}

/**
 * Initialize weather module
 */
export function initWeather() {
    const autoWeatherCheckbox = document.getElementById('auto-weather');
    const refreshButton = document.getElementById('refresh-weather');
    
    // Set up event listeners
    if (autoWeatherCheckbox) {
        autoWeatherCheckbox.addEventListener('change', toggleWeatherMode);
    }
    
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            fetchWeatherData(null, updateWeatherDisplay);
        });
    }
    
    // Initialize display
    toggleWeatherMode();
    
    // Initial weather fetch
    fetchWeatherData(null, updateWeatherDisplay);
}
