// weather.js - Weather data fetching and display using Open-Meteo API

// Weather state management
export let currentWeatherData = {
    rainfall: 2.0,
    soilTemp: 65,
    airTemp: 70,
    season: 'summer',
    lastUpdated: null
};

export let countyWeatherData = {};

// County-to-town mapping with coordinates for Open-Meteo API
export const countyTowns = {
    'coos': { name: 'Gorham', lat: 44.3895, lon: -71.1814 },
    'grafton': { name: 'Hanover', lat: 43.7022, lon: -72.2896 }, 
    'carroll': { name: 'Ossipee', lat: 43.6901, lon: -71.1017 },
    'sullivan': { name: 'Newport', lat: 43.3708, lon: -72.1761 },
    'merrimack': { name: 'Concord', lat: 43.2081, lon: -71.5376 },
    'belknap': { name: 'Laconia', lat: 43.5284, lon: -71.4703 },
    'cheshire': { name: 'Keene', lat: 42.9335, lon: -72.2815 },
    'hillsborough': { name: 'Manchester', lat: 42.9956, lon: -71.4548 },
    'strafford': { name: 'Dover', lat: 43.1979, lon: -70.8737 },
    'rockingham': { name: 'Exeter', lat: 42.9814, lon: -70.9478 }
};

/**
 * Calculate soil temperature from air temperature and weather conditions
 * @param {number} airTemp - Air temperature in Fahrenheit
 * @param {number} humidity - Relative humidity percentage
 * @param {number} precipitation - Recent precipitation
 * @returns {number} Estimated soil temperature in Fahrenheit
 */
function calculateSoilTemp(airTemp, humidity = 70, precipitation = 0) {
    // Soil temperature estimation based on air temp with moisture adjustments
    let soilTemp = airTemp - 8; // Base soil temp offset
    
    // Adjust for moisture - wet soil stays cooler
    if (precipitation > 0.1) {
        soilTemp -= Math.min(5, precipitation * 2);
    }
    
    // Adjust for humidity - high humidity moderates temperature
    if (humidity > 80) {
        soilTemp += 2;
    } else if (humidity < 50) {
        soilTemp -= 2;
    }
    
    return Math.round(soilTemp);
}

/**
 * Determine season based on current month
 * @returns {string} Current season
 */
function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 5) return 'spring';
    else if (month >= 6 && month <= 8) return 'summer';
    else if (month >= 9 && month <= 11) return 'fall';
    else return 'winter';
}

/**
 * Fetch weather data for all NH counties using Open-Meteo API
 * @param {Function} onComplete - Callback when weather fetch completes
 * @param {Function} onUpdate - Callback for UI updates
 */
export async function fetchWeatherData(onComplete, onUpdate) {
    const statusText = document.getElementById('status-text');
    const weatherStatus = document.getElementById('weather-status');
    
    if (statusText) statusText.textContent = 'Loading weather data from Open-Meteo...';
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'true');
    
    const counties = Object.keys(countyTowns);
    const fetchPromises = counties.map(async county => {
        const location = countyTowns[county];
        
        // Open-Meteo API URL with required parameters
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${location.lat}&longitude=${location.lon}&` +
            `current=temperature_2m,relative_humidity_2m,precipitation,rain,showers&` +
            `hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,showers,` +
            `soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,` +
            `soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&` +
            `daily=rain_sum,showers_sum,precipitation_sum&` +
            `temperature_unit=fahrenheit&precipitation_unit=inch&` +
            `timezone=America/New_York&past_days=7&forecast_days=1`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.current || !data.daily) {
                throw new Error('Unexpected API response structure');
            }
            
            // Extract current conditions
            const current = data.current;
            const daily = data.daily;
            const hourly = data.hourly;
            
            // Calculate 7-day rainfall total from daily data
            const rainfall = daily.precipitation_sum
                ? daily.precipitation_sum.slice(0, 8).reduce((sum, val) => sum + (val || 0), 0)
                : 0;
            
            // Get current air temperature
            const airTemp = Math.round(current.temperature_2m || 70);
            
            // Calculate soil temperature using multiple methods
            let soilTemp;
            if (hourly?.soil_temperature_6cm && hourly.soil_temperature_6cm.length > 0) {
                // Use actual soil temperature from API if available
                const recentSoilTemp = hourly.soil_temperature_6cm
                    .filter(temp => temp !== null)
                    .slice(-12) // Last 12 hours
                    .reduce((sum, temp, _, arr) => sum + temp / arr.length, 0);
                soilTemp = Math.round(recentSoilTemp || airTemp - 8);
            } else {
                // Fallback to calculated soil temperature
                soilTemp = calculateSoilTemp(
                    airTemp, 
                    current.relative_humidity_2m || 70,
                    current.precipitation || 0
                );
            }
            
            // Get current season
            const season = getCurrentSeason();
            
            countyWeatherData[county] = {
                rainfall: Math.max(0, rainfall), // Ensure non-negative
                airTemp,
                soilTemp,
                season,
                lastUpdated: new Date(),
                town: location.name,
                // Additional data for advanced calculations
                humidity: current.relative_humidity_2m || 70,
                currentPrecipitation: current.precipitation || 0,
                soilMoisture: hourly?.soil_moisture_3_to_9cm?.[hourly.soil_moisture_3_to_9cm.length - 1] || null
            };
            
            // Update current weather if this is the central county
            if (county === 'merrimack') {
                currentWeatherData = { ...countyWeatherData[county] };
            }
            
            console.log(`✅ Weather data fetched for ${county} (${location.name}):`, {
                airTemp,
                soilTemp,
                rainfall: rainfall.toFixed(2),
                season
            });
            
        } catch (error) {
            console.error(`❌ Weather fetch error for ${county} (${location.name}):`, error.message);
            
            // Set error indicator instead of misleading fallback data
            countyWeatherData[county] = {
                rainfall: null,
                airTemp: null,
                soilTemp: null,
                season: getCurrentSeason(),
                lastUpdated: new Date(),
                town: location.name,
                error: error.message,
                hasData: false
            };
        }
    });
    
    await Promise.all(fetchPromises);
    
    // Update status with results
    const successfulFetches = Object.values(countyWeatherData).filter(data => !data?.error).length;
    const totalCounties = counties.length;
    
    if (statusText) {
        statusText.textContent = `Weather data loaded (${successfulFetches}/${totalCounties} counties successful)`;
    }
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'false');
    
    // Call callbacks
    if (onUpdate) onUpdate();
    if (onComplete) onComplete();
    
    console.log(`🌤️ Weather fetch complete: ${successfulFetches}/${totalCounties} counties successful`);
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
    let dataStatus = 'general';
    
    // Better county data lookup with debugging
    if (county) {
        console.log(`[updateWeatherDisplay] Looking for county: ${county}`);
        console.log(`[updateWeatherDisplay] Available counties:`, Object.keys(countyWeatherData));
        
        if (countyWeatherData[county]) {
            weather = countyWeatherData[county];
            countyLabel = ` (${county})`;
            dataStatus = 'county-specific';
            console.log(`[updateWeatherDisplay] Found county data:`, weather);
        } else {
            console.warn(`[updateWeatherDisplay] County ${county} not found in weather data`);
            dataStatus = 'fallback-to-general';
        }
    }
    
    const { rainfall, soilTemp, airTemp, lastUpdated, error } = weather || {};
    
    // Format display values with clear indication of missing data
    const rainfallStr = (rainfall !== undefined && rainfall !== null) 
        ? `${rainfall.toFixed(2)}"` : (error ? 'Error' : 'Loading...');
    const soilTempStr = (soilTemp !== undefined && soilTemp !== null) 
        ? `${soilTemp}°F` : (error ? 'Error' : 'Loading...');
    const airTempStr = (airTemp !== undefined && airTemp !== null) 
        ? `${airTemp}°F` : (error ? 'Error' : 'Loading...');
    
    // Update display elements
    if (rainfallDisplay) rainfallDisplay.textContent = `${rainfallStr}${countyLabel}`;
    if (soilTempDisplay) soilTempDisplay.textContent = `${soilTempStr}${countyLabel}`;
    if (airTempDisplay) airTempDisplay.textContent = `${airTempStr}${countyLabel}`;
    
    // Update status text with detailed information
    let source = '';
    if (autoWeatherCheckbox?.checked) {
        if (error) {
            source = `⚠️ Data Source: Open-Meteo API (${error})`;
        } else {
            source = 'Data Source: Open-Meteo API';
            if (lastUpdated) {
                const date = new Date(lastUpdated);
                source += ` (updated ${date.toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute: '2-digit'
                })})`;
            }
        }
        
        // Add data status indicator
        if (county) {
            if (dataStatus === 'county-specific') {
                source += ` ✓ County-specific data for ${county}`;
            } else if (dataStatus === 'fallback-to-general') {
                source += ` ⚠️ Using general data (${county} data unavailable)`;
            }
        }
    } else {
        source = 'Data Source: Manual Override';
    }
    
    if (statusText) {
        statusText.textContent = source;
    }
    
    // Console logging for debugging
    if (error) {
        console.warn(`⚠️ Weather data error${county ? ` for ${county}` : ''}: ${error}`);
    }
    if (county && dataStatus === 'fallback-to-general') {
        console.warn(`⚠️ County ${county} data not available, using general weather data`);
    }
}

/**
 * Get weather data for calculations
 * @param {string} county - County name
 * @returns {Object} Weather data object
 */
export function getWeatherData(county = null) {
    console.log('[getWeatherData] county:', county);
    console.log('[getWeatherData] available counties:', Object.keys(countyWeatherData));
    const autoWeatherCheckbox = document.getElementById('auto-weather');
    
    if (autoWeatherCheckbox?.checked) {
        let weatherData;
        
        if (county && countyWeatherData[county]) {
            weatherData = countyWeatherData[county];
            console.log(`[getWeatherData] Using county-specific data for ${county}:`, weatherData);
        } else {
            weatherData = currentWeatherData;
            console.log(`[getWeatherData] Using general weather data (county ${county} not found):`, weatherData);
        }
        
        // Return actual data without fallbacks to avoid misleading information
        return {
            rainfall: weatherData.rainfall ?? null,
            soilTemp: weatherData.soilTemp ?? null,
            airTemp: weatherData.airTemp ?? null,
            season: weatherData.season || getCurrentSeason(),
            // Additional data for advanced calculations
            humidity: weatherData.humidity ?? null,
            soilMoisture: weatherData.soilMoisture ?? null,
            hasData: !!(weatherData.rainfall !== undefined && weatherData.soilTemp !== undefined),
            dataSource: county && countyWeatherData[county] ? 'county-specific' : 'general',
            error: weatherData.error || null
        };
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
 * Get detailed weather information for a specific county
 * @param {string} county - County name
 * @returns {Object} Detailed weather information
 */
export function getDetailedWeatherInfo(county) {
    const weatherData = countyWeatherData[county];
    if (!weatherData) return null;
    
    return {
        county,
        town: weatherData.town,
        conditions: {
            airTemp: weatherData.airTemp,
            soilTemp: weatherData.soilTemp,
            rainfall7Day: weatherData.rainfall,
            humidity: weatherData.humidity || 'N/A',
            soilMoisture: weatherData.soilMoisture || 'N/A'
        },
        timing: {
            season: weatherData.season,
            lastUpdated: weatherData.lastUpdated,
            isStale: weatherData.lastUpdated && 
                (Date.now() - new Date(weatherData.lastUpdated).getTime()) > 3600000 // 1 hour
        },
        quality: {
            hasError: !!weatherData.error,
            errorMessage: weatherData.error || null,
            dataSource: 'Open-Meteo API'
        }
    };
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
            console.log('🔄 Manual weather refresh triggered');
            fetchWeatherData(null, updateWeatherDisplay);
        });
    }
    
    // Initialize display
    toggleWeatherMode();
    
    // Initial weather fetch
    console.log('🌤️ Initializing weather module with Open-Meteo API');
    fetchWeatherData(null, updateWeatherDisplay);
    
    // Set up automatic refresh every 15 minutes
    setInterval(() => {
        const autoWeatherCheckbox = document.getElementById('auto-weather');
        if (autoWeatherCheckbox?.checked) {
            console.log('🔄 Auto-refresh weather data');
            fetchWeatherData(null, updateWeatherDisplay);
        }
    }, 15 * 60 * 1000); // 15 minutes
}