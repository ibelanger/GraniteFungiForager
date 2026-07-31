// weather.js - Weather data fetching and display using Open-Meteo API

// Weather state management
export let currentWeatherData = {
    rainfall: 2.0,
    soilTemp: 65,
    airTemp: 70,
    season: 'summer',
    lastUpdated: null
};

export const countyWeatherData = {};

// Tracks the last county the user actually looked at (via updateWeatherDisplay),
// so manual-mode slider seeding and Live-mode redisplay use the right county's
// data instead of always falling back to the general/Merrimack-anchored reading.
let selectedCounty = null;

const WEATHER_CACHE_KEY = 'gff-weather-cache-v1';
const WEATHER_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// County-to-sample-points mapping for Open-Meteo API. Each county samples
// 3-4 geographically-diverse points (rather than one town) since a single
// coordinate can miss a county's real conditions by miles — e.g. Hillsborough
// spans Manchester to the MA border with genuinely different microclimates,
// and one point can sit outside a localized summer convective storm cell
// that a gauge a few miles away would catch. See getWeatherData()/
// aggregateCountyWeather() for how these are combined via median + range.
export const countySamplePoints = {
    'coos': [
        { name: 'Gorham', lat: 44.3895, lon: -71.1814 },
        { name: 'Nash Stream State Forest', lat: 44.7089, lon: -71.4828 },
        { name: 'Coleman State Park', lat: 44.8500, lon: -71.3500 },
        { name: 'WMNF Presidential Range', lat: 44.3128, lon: -71.3032 }
    ],
    'grafton': [
        { name: 'Hanover', lat: 43.7022, lon: -72.2896 },
        { name: 'Connecticut River Valley', lat: 43.9778, lon: -72.0000 },
        { name: 'WMNF Elevation Gradient', lat: 44.0579, lon: -71.5376 },
        { name: 'Lincoln (Franconia Notch area)', lat: 44.04562, lon: -71.67008 }
    ],
    'carroll': [
        { name: 'Ossipee', lat: 43.6901, lon: -71.1017 },
        { name: 'Conway/Bartlett (WMNF)', lat: 44.0684, lon: -71.2286 },
        { name: 'Echo Lake State Park', lat: 44.0822, lon: -71.1956 },
        { name: 'Tamworth', lat: 43.8598, lon: -71.26313 }
    ],
    'sullivan': [
        { name: 'Newport', lat: 43.3708, lon: -72.1761 },
        { name: 'Connecticut River Valley (farm sites)', lat: 43.3500, lon: -72.2000 },
        { name: 'Mount Sunapee Area', lat: 43.3167, lon: -72.0833 },
        { name: 'Upland Hardwood Forests', lat: 43.4000, lon: -72.1500 }
    ],
    'merrimack': [
        { name: 'Concord', lat: 43.2081, lon: -71.5376 },
        { name: 'Bear Brook State Park', lat: 43.1667, lon: -71.3333 },
        { name: 'Franklin', lat: 43.44424, lon: -71.6473 }
    ],
    'belknap': [
        { name: 'Laconia', lat: 43.5284, lon: -71.4703 },
        { name: 'Belknap Mountain Range', lat: 43.5167, lon: -71.4500 },
        { name: 'Alton', lat: 43.4523, lon: -71.21757 }
    ],
    'cheshire': [
        { name: 'Keene', lat: 42.9335, lon: -72.2815 },
        { name: 'Pisgah State Park', lat: 42.8667, lon: -72.4167 },
        { name: 'Monadnock Region', lat: 42.8600, lon: -72.1000 },
        { name: 'Cheshire Oak Ridge', lat: 42.9000, lon: -72.3000 }
    ],
    'hillsborough': [
        // Old anchor (42.9956,-71.4548) was ~4.4 miles from the nearest real
        // gauge (KMHT) and undercounted a summer storm 4x — replaced, not kept.
        { name: 'Manchester (KMHT area)', lat: 42.9326, lon: -71.4358 },
        { name: 'Fox State Forest', lat: 42.9167, lon: -71.9167 },
        { name: 'Nashua', lat: 42.76537, lon: -71.46757 },
        { name: 'Milford', lat: 42.83536, lon: -71.64896 }
    ],
    'strafford': [
        { name: 'Dover', lat: 43.1979, lon: -70.8737 },
        { name: 'Blue Job State Forest', lat: 43.2333, lon: -71.0500 },
        { name: 'Rochester', lat: 43.30453, lon: -70.97562 }
    ],
    'rockingham': [
        { name: 'Exeter', lat: 42.9814, lon: -70.9478 },
        { name: 'Pawtuckaway State Park', lat: 43.1000, lon: -71.1833 },
        { name: 'Hampton', lat: 42.93759, lon: -70.83894 }
    ]
};

/**
 * Calculate soil temperature from air temperature and weather conditions
 * @param {number} airTemp - Air temperature in Fahrenheit
 * @param {number} humidity - Relative humidity percentage
 * @param {number} precipitation - Recent precipitation
 * @returns {number} Estimated soil temperature in Fahrenheit
 */
export function calculateSoilTemp(airTemp, humidity = 70, precipitation = 0) {
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
export function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 5) return 'spring';
    else if (month >= 6 && month <= 8) return 'summer';
    else if (month >= 9 && month <= 11) return 'fall';
    else return 'winter';
}

/**
 * Median of a numeric array. Does not mutate the input.
 * @param {number[]} numbers
 * @returns {number} median value
 */
export function median(numbers) {
    if (!numbers || numbers.length === 0) {
        throw new Error('median() requires at least one number');
    }
    const sorted = [...numbers].sort((a, b) => a - b); // copy first — sort() mutates in place
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Parse a single Open-Meteo location-array entry into scalar readings.
 * @param {Object} pointData - One entry from a batched Open-Meteo response
 * @returns {Object|null} {rainfall, airTemp, soilTemp, humidity, currentPrecipitation, soilMoisture}, or null if malformed
 */
function parseSinglePointWeather(pointData) {
    if (!pointData?.current || !pointData?.daily) return null;

    const { current, daily, hourly } = pointData;

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

    return {
        rainfall: Math.max(0, rainfall), // Ensure non-negative
        airTemp,
        soilTemp,
        humidity: current.relative_humidity_2m || 70,
        currentPrecipitation: current.precipitation || 0,
        soilMoisture: hourly?.soil_moisture_3_to_9cm?.at(-1) ?? null
    };
}

/**
 * Aggregate multiple sample-point readings for a county into a single
 * weather object via median (robust to one point sitting on a missed or
 * phantom storm cell), plus a min/max range so the UI can show real
 * local variability instead of false single-number precision.
 * @param {Array<Object|null>} perPointResults - parseSinglePointWeather() outputs, in sample-point order
 * @param {Array<{name: string}>} points - the county's sample points (for the display label)
 * @param {string} [season] - current season, defaults to getCurrentSeason()
 * @param {string} [county] - lowercase county key this aggregate belongs to (e.g. 'coos') — stamped
 *   onto the result so downstream consumers (pH/oak-region probability logic, per-site location
 *   cards) have reliable county identity without depending on the outer countyWeatherData key (#68)
 * @returns {Object} aggregated county weather object
 * @throws {Error} if every sample point failed to parse
 */
export function aggregateCountyWeather(perPointResults, points, season = getCurrentSeason(), county = null) {
    const valid = perPointResults.filter(r => r !== null);
    if (valid.length === 0) {
        throw new Error('No valid sample points returned usable data');
    }

    const rainfalls = valid.map(r => r.rainfall);
    const airTemps = valid.map(r => r.airTemp);
    const soilTemps = valid.map(r => r.soilTemp);
    const moistures = valid.map(r => r.soilMoisture).filter(v => v != null);

    // Per-site breakdown, positionally paired with `points` (not `valid` —
    // that's already been filtered and would misalign) — preserved so
    // individual location cards can show their own site's reading rather
    // than only the county-wide aggregate (#67).
    const sites = points
        .map((point, i) => {
            const r = perPointResults[i];
            return r ? { name: point.name, lat: point.lat, lon: point.lon, rainfall: r.rainfall, airTemp: r.airTemp, soilTemp: r.soilTemp } : null;
        })
        .filter(Boolean);

    return {
        county,
        rainfall: median(rainfalls),
        airTemp: Math.round(median(airTemps)),
        soilTemp: Math.round(median(soilTemps)),
        season,
        lastUpdated: new Date(),
        town: points[0].name,
        // Additional data for advanced calculations
        humidity: median(valid.map(r => r.humidity)),
        currentPrecipitation: median(valid.map(r => r.currentPrecipitation)),
        soilMoisture: moistures.length ? median(moistures) : null,
        // Spread across sample points — surfaces real local variability in the UI
        rainfallRange: [Math.min(...rainfalls), Math.max(...rainfalls)],
        soilTempRange: [Math.min(...soilTemps), Math.max(...soilTemps)],
        airTempRange: [Math.min(...airTemps), Math.max(...airTemps)],
        sampleCount: valid.length,
        sites
    };
}

/**
 * Load the last persisted weather snapshot, if any and still fresh.
 * @returns {{ savedAt: number, countyWeatherData: Object, currentWeatherData: Object }|null}
 */
function loadWeatherCache() {
    try {
        const raw = localStorage.getItem(WEATHER_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.savedAt || (Date.now() - parsed.savedAt) > WEATHER_CACHE_TTL_MS) return null;
        return parsed;
    } catch {
        return null; // localStorage unavailable/corrupt — treat as no cache
    }
}

/**
 * Persist the current weather snapshot so a cold load (or a fetch that fails
 * outright) has something better than blank/default values to show.
 */
function saveWeatherCache() {
    try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
            savedAt: Date.now(),
            countyWeatherData,
            currentWeatherData
        }));
    } catch {
        // Storage full/unavailable — non-fatal, just skip persistence
    }
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_FETCH_ATTEMPTS = 3;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function backoffDelay(attempt) {
    return 400 * 2 ** (attempt - 1) + Math.random() * 150; // exponential + jitter
}

/**
 * Fetch a county's batched Open-Meteo URL, retrying with backoff on 429/5xx
 * and on transient network/timeout errors. Non-retryable HTTP errors (4xx
 * other than 429) throw immediately on the first attempt.
 */
async function fetchWithRetry(url) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s per attempt
        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_FETCH_ATTEMPTS) {
                    await sleep(backoffDelay(attempt));
                    continue;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            lastError = error;
            const isTransient = error.name === 'AbortError' || error instanceof TypeError;
            if (isTransient && attempt < MAX_FETCH_ATTEMPTS) {
                await sleep(backoffDelay(attempt));
                continue;
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    throw lastError;
}

/**
 * Fetch weather data for all NH counties using Open-Meteo API, sampling
 * multiple points per county in one batched request and aggregating via
 * median (see aggregateCountyWeather). Retries transient failures with
 * backoff and falls back to the last cached reading (per county) when a
 * fetch fails outright — see fetchWithRetry/loadWeatherCache.
 * @param {Function} onComplete - Callback when weather fetch completes
 * @param {Function} onUpdate - Callback for UI updates
 */
export async function fetchWeatherData(onComplete, onUpdate) {
    const statusText = document.getElementById('status-text');
    const weatherStatus = document.getElementById('weather-status');

    const cacheSnapshot = loadWeatherCache();
    const isFirstLoad = Object.keys(countyWeatherData).length === 0;
    if (isFirstLoad && cacheSnapshot) {
        Object.assign(countyWeatherData, cacheSnapshot.countyWeatherData);
        currentWeatherData = { ...cacheSnapshot.currentWeatherData };
        if (statusText) {
            const cacheTime = new Date(cacheSnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            statusText.textContent = `Loading weather data from Open-Meteo... (showing cached data from ${cacheTime})`;
        }
        if (onUpdate) onUpdate();
    } else if (statusText) {
        statusText.textContent = 'Loading weather data from Open-Meteo...';
    }
    if (weatherStatus) weatherStatus.setAttribute('aria-busy', 'true');

    const counties = Object.keys(countySamplePoints);
    const fetchPromises = counties.map(async county => {
        const points = countySamplePoints[county];
        const label = points[0].name;
        const latitude = points.map(p => p.lat).join(',');
        const longitude = points.map(p => p.lon).join(',');

        // Open-Meteo API URL with required parameters. Comma-separated
        // lat/lon lists batch all of this county's sample points into one
        // request (verified: returns a JSON array, one entry per point, in
        // the same order as requested) — keeps total request count at 10,
        // same as the single-point-per-county baseline.
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&longitude=${longitude}&` +
            `current=temperature_2m,relative_humidity_2m,precipitation,rain,showers&` +
            `hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,showers,` +
            `soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,` +
            `soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&` +
            `daily=rain_sum,showers_sum,precipitation_sum&` +
            `temperature_unit=fahrenheit&precipitation_unit=inch&` +
            `timezone=America/New_York&past_days=7&forecast_days=1`;

        try {
            const response = await fetchWithRetry(url);
            const data = await response.json();
            const dataArray = Array.isArray(data) ? data : [data]; // defensive normalization

            // Map array entries back to sample points by position — Open-Meteo's
            // location_id field is absent on the first entry, so it can't be
            // relied on for this mapping.
            const perPointResults = dataArray.map(parseSinglePointWeather);
            const season = getCurrentSeason();
            countyWeatherData[county] = aggregateCountyWeather(perPointResults, points, season, county);

            // Update current weather if this is the central county
            if (county === 'merrimack') {
                currentWeatherData = { ...countyWeatherData[county] };
            }

            console.log(`✅ Weather data fetched for ${county} (${points.length} points, ${countyWeatherData[county].sampleCount} valid):`, {
                airTemp: countyWeatherData[county].airTemp,
                soilTemp: countyWeatherData[county].soilTemp,
                rainfall: countyWeatherData[county].rainfall.toFixed(2),
                season
            });

        } catch (error) {
            const errorMessage = error.name === 'AbortError' ? 'Request timed out' : error.message;
            console.error(`❌ Weather fetch error for ${county} (${label}):`, errorMessage);

            // Fall back to the last cached reading for this county, if fresh
            // enough, rather than going straight to a bare error state.
            const cachedEntry = cacheSnapshot?.countyWeatherData?.[county];
            if (cachedEntry && !cachedEntry.error) {
                countyWeatherData[county] = { ...cachedEntry, cached: true, error: null };
                console.warn(`⚠️ Using cached weather for ${county} (live fetch failed: ${errorMessage})`);
            } else {
                // Set error indicator instead of misleading fallback data
                countyWeatherData[county] = {
                    rainfall: null,
                    airTemp: null,
                    soilTemp: null,
                    season: getCurrentSeason(),
                    lastUpdated: new Date(),
                    town: label,
                    error: errorMessage,
                    hasData: false
                };
            }
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

    saveWeatherCache();

    // Call callbacks
    if (onUpdate) onUpdate();
    if (onComplete) onComplete();

    console.log(`🌤️ Weather fetch complete: ${successfulFetches}/${totalCounties} counties successful`);
}

/**
 * Capitalize county name for display (e.g., 'grafton' -> 'Grafton')
 * @param {string} county - County key in lowercase
 * @returns {string} Capitalized county name
 */
function capitalizeCounty(county) {
    if (!county) return '';
    return county.charAt(0).toUpperCase() + county.slice(1);
}

/**
 * Overall fetch completeness/success across all counties, so the status line
 * can distinguish "fully live" from "live but some counties failed" instead
 * of collapsing both into the same "✓ Live" string.
 * @returns {{ total: number, successful: number, complete: boolean }}
 */
function getFetchSummary() {
    const total = Object.keys(countySamplePoints).length;
    const attempted = Object.keys(countyWeatherData).length;
    const successful = Object.values(countyWeatherData).filter(d => d && !d.error).length;
    return { total, successful, complete: attempted >= total };
}

/**
 * Update weather display for specific county or current data
 * @param {string} county - Optional county to display data for
 */
export function updateWeatherDisplay(county = null) {
    const statusText = document.getElementById('status-text');
    const autoWeatherCheckbox = document.getElementById('auto-weather');

    let weather = currentWeatherData;
    let dataStatus = 'general';

    // Better county data lookup with debugging
    if (county) {
        selectedCounty = county;
        console.log(`[updateWeatherDisplay] Looking for county: ${county}`);
        console.log(`[updateWeatherDisplay] Available counties:`, Object.keys(countyWeatherData));

        if (countyWeatherData[county]) {
            weather = countyWeatherData[county];
            dataStatus = 'county-specific';
            console.log(`[updateWeatherDisplay] Found county data:`, weather);
        } else {
            console.warn(`[updateWeatherDisplay] County ${county} not found in weather data`);
            dataStatus = 'fallback-to-general';
        }
    }
    
    const { lastUpdated, error } = weather || {};

    // Update status text with detailed information
    let source = '';
    if (autoWeatherCheckbox?.checked) {
        if (error) {
            source = `⚠️ API Error`;
        } else {
            const { total, successful, complete } = getFetchSummary();
            source = (complete && successful < total) ? `⚠️ Partial (${successful}/${total})` : '✓ Live';
            if (lastUpdated) {
                const date = new Date(lastUpdated);
                source += ` • ${date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`;
            }
            if (weather?.cached) {
                source += ' • Cached';
            }
        }

        // Add county indicator with capitalized name
        if (county) {
            const countyName = capitalizeCounty(county);
            if (dataStatus === 'county-specific') {
                source += ` • ${countyName}`;
            } else if (dataStatus === 'fallback-to-general') {
                source += ` • General (${countyName} unavailable)`;
            }
        }
    } else {
        source = 'Manual Override';
    }

    if (statusText) {
        statusText.textContent = source;
    }

    // Console logging for debugging
    if (error) {
        console.warn(`⚠️ Weather data error${county ? ` for ${capitalizeCounty(county)}` : ''}: ${error}`);
    }
    if (county && dataStatus === 'fallback-to-general') {
        console.warn(`⚠️ ${capitalizeCounty(county)} data not available, using general weather data`);
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
            // The county being evaluated, regardless of which data source
            // supplied the numbers above — pH/oak-region adjustments (#68)
            // are properties of the county itself, not of the reading.
            county: county || null,
            rainfall: weatherData.rainfall ?? null,
            soilTemp: weatherData.soilTemp ?? null,
            airTemp: weatherData.airTemp ?? null,
            season: weatherData.season || getCurrentSeason(),
            // Additional data for advanced calculations
            humidity: weatherData.humidity ?? null,
            soilMoisture: weatherData.soilMoisture ?? null,
            hasData: !!(weatherData.rainfall !== undefined && weatherData.soilTemp !== undefined),
            dataSource: county && countyWeatherData[county] ? 'county-specific' : 'general',
            error: weatherData.error || null,
            // Multi-point sample spread, when available (absent on the static default)
            rainfallRange: weatherData.rainfallRange,
            soilTempRange: weatherData.soilTempRange,
            airTempRange: weatherData.airTempRange,
            sampleCount: weatherData.sampleCount
        };
    } else {
        // Return manual override values
        const rainfallSlider = document.getElementById('rainfall');
        const soilTempSlider = document.getElementById('soil-temp');
        const airTempSlider = document.getElementById('air-temp');
        const seasonSelect = document.getElementById('season');

        return {
            // Manual mode still needs the county being evaluated: pH/oak-region
            // multipliers apply regardless of whether the reading came from a
            // live fetch or the manual sliders (#68).
            county: county || null,
            rainfall: parseFloat(rainfallSlider?.value || 2.0),
            soilTemp: parseInt(soilTempSlider?.value || 65),
            airTemp: parseInt(airTempSlider?.value || 70),
            season: seasonSelect?.value || 'summer'
        };
    }
}

/**
 * Seed the manual override sliders from the last successful weather fetch,
 * so switching Live -> Manual starts from today's real conditions instead
 * of jumping to fixed defaults.
 */
function seedManualControlsFromLastWeather() {
    // Prefer the county the user actually selected over the general/Merrimack-
    // anchored reading, so Live→Manual starts from what they were looking at.
    const selected = selectedCounty && countyWeatherData[selectedCounty];
    const source = (selected && !selected.error) ? selected : currentWeatherData;

    if (!source.lastUpdated) return; // no live data fetched yet

    const sliders = [
        { id: 'rainfall', value: source.rainfall, decimals: 1 },
        { id: 'soil-temp', value: source.soilTemp, decimals: 0 },
        { id: 'air-temp', value: source.airTemp, decimals: 0 }
    ];

    sliders.forEach(({ id, value, decimals }) => {
        if (value == null) return;
        const slider = document.getElementById(id);
        if (!slider) return;

        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        slider.value = Math.min(max, Math.max(min, value)).toFixed(decimals);
        slider.dispatchEvent(new Event('input'));
    });
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
        updateWeatherDisplay(selectedCounty);
    } else {
        if (manualControls) manualControls.style.display = 'block';
        if (weatherDisplay) weatherDisplay.style.display = 'none';
        seedManualControlsFromLastWeather();
        updateWeatherDisplay(selectedCounty);
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

    // Periodic auto-refresh is handled by app.js's setupAutoRefresh(), which
    // gates on this same auto-weather checkbox — kept in one place to avoid
    // two independent timers double-fetching.
}