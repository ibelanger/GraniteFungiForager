// main.js - Entry point for the NH Mushroom Map App
import { setupWeather, fetchWeatherData, currentWeatherData, countyWeatherData } from './weather.js';
import { setupMap, updateMap } from './map.js';
import { speciesData, updateSpeciesDisplay } from './species.js';
import { publicLandData, updateRecommendations } from './publicLand.js';
import { setupAccessibility } from './accessibility.js';
import { debounce } from './utils.js';

// Main app initialization
window.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const regions = document.querySelectorAll('.region');
    const speciesSelect = document.getElementById('species');
    const seasonSelect = document.getElementById('season');
    const autoWeatherCheckbox = document.getElementById('auto-weather');
    const rainfallSlider = document.getElementById('rainfall');
    const soilTempSlider = document.getElementById('soil-temp');
    const airTempSlider = document.getElementById('air-temp');
    const rainfallValue = document.getElementById('rainfall-value');
    const soilTempValue = document.getElementById('soil-temp-value');
    const airTempValue = document.getElementById('air-temp-value');
    const weatherStatus = document.getElementById('weather-status');
    const statusText = document.getElementById('status-text');
    const manualControls = document.getElementById('manual-controls');
    const weatherDisplay = document.getElementById('weather-display');

    // Setup accessibility
    setupAccessibility({speciesSelect, seasonSelect, autoWeatherCheckbox, rainfallSlider, soilTempSlider, airTempSlider, regions});

    // Setup weather (attach listeners if needed)
    setupWeather();

    // Setup map (attach region listeners)
    setupMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData, updateWeatherDisplay, updateRecommendations});

    // Debounced slider listeners
    rainfallSlider.addEventListener('input', debounce(function() {
        rainfallValue.textContent = this.value;
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.rainfall = parseFloat(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        }
    }, 200));
    soilTempSlider.addEventListener('input', debounce(function() {
        soilTempValue.textContent = this.value + '°F';
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.soilTemp = parseInt(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        }
    }, 200));
    airTempSlider.addEventListener('input', debounce(function() {
        airTempValue.textContent = this.value + '°F';
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.airTemp = parseInt(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        }
    }, 200));

    // Species select change
    speciesSelect.addEventListener('change', function() {
        updateRecommendations(null, speciesSelect.value, publicLandData);
        updateSpeciesDisplay(speciesSelect.value, speciesData);
        updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
    });

    // Season select change
    seasonSelect.addEventListener('change', function() {
        currentWeatherData.season = this.value;
        updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
    });

    // Auto weather checkbox
    autoWeatherCheckbox.addEventListener('change', function() {
        // Implement toggleWeatherMode logic here if needed
    });

    // Initial map/weather
    // You must pass the required arguments to fetchWeatherData
    // For example, if you have countyTowns, pass it here:
    // fetchWeatherData(countyTowns, statusText, weatherStatus, () => updateWeatherDisplay(), () => updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData}));
    // For now, just call updateMap to ensure the map is colored on load
    updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
});
