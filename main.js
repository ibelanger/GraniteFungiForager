// main.js - Entry point for the NH Mushroom Map App
import { setupWeather, fetchWeatherData, currentWeatherData, countyWeatherData, updateWeatherDisplay, countyTowns } from './weather.js';
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
    setupMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData, updateWeatherDisplay, updateRecommendations, publicLandData});

    // --- Populate dropdowns ---
    function populateSeasonDropdown(seasonSelect) {
        const seasons = [
            { value: 'spring', label: 'Spring (April-May)' },
            { value: 'summer', label: 'Summer (June-August)' },
            { value: 'fall', label: 'Fall (September-November)' }
        ];
        seasonSelect.innerHTML = '';
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.value;
            option.textContent = season.label;
            if (season.value === 'summer') option.selected = true;
            seasonSelect.appendChild(option);
        });
    }
    function populateSpeciesDropdown(speciesSelect, speciesData) {
        speciesSelect.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Tier 1 Species';
        speciesSelect.appendChild(allOption);
        for (const key in speciesData) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = speciesData[key].name;
            speciesSelect.appendChild(option);
        }
    }
    populateSeasonDropdown(seasonSelect);
    populateSpeciesDropdown(speciesSelect, speciesData);

    let selectedCounty = null;

    // --- Region (county) click: update selected county and weather display ---
    regions.forEach(region => {
        region.addEventListener('click', function() {
            selectedCounty = this.getAttribute('data-county') || this.getAttribute('data-name') || null;
            updateWeatherDisplay(selectedCounty);
        });
    });

    // --- Weather fetch on load ---
    fetchWeatherData(countyTowns, statusText, weatherStatus, () => updateWeatherDisplay(selectedCounty), () => {
        updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        updateWeatherDisplay(selectedCounty);
    });

    // --- Manual controls toggle ---
    autoWeatherCheckbox.addEventListener('change', function() {
        manualControls.style.display = this.checked ? 'none' : '';
        if (this.checked) {
            // If auto-weather is enabled, fetch weather again
            fetchWeatherData(countyTowns, statusText, weatherStatus, () => updateWeatherDisplay(selectedCounty), () => {
                updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
                updateWeatherDisplay(selectedCounty);
            });
        } else {
            // If manual, update map with manual slider values
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
            updateWeatherDisplay(selectedCounty);
        }
    });

    // --- Manual slider listeners (show/hide manual controls) ---
    function updateManualWeatherDisplay() {
        rainfallValue.textContent = rainfallSlider.value;
        soilTempValue.textContent = soilTempSlider.value + '°F';
        airTempValue.textContent = airTempSlider.value + '°F';
    }
    rainfallSlider.addEventListener('input', debounce(function() {
        rainfallValue.textContent = this.value;
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.rainfall = parseFloat(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
            updateWeatherDisplay(selectedCounty);
        }
    }, 200));
    soilTempSlider.addEventListener('input', debounce(function() {
        soilTempValue.textContent = this.value + '°F';
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.soilTemp = parseInt(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
            updateWeatherDisplay(selectedCounty);
        }
    }, 200));
    airTempSlider.addEventListener('input', debounce(function() {
        airTempValue.textContent = this.value + '°F';
        if (!autoWeatherCheckbox.checked) {
            currentWeatherData.airTemp = parseInt(this.value);
            updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
            updateWeatherDisplay(selectedCounty);
        }
    }, 200));

    // --- Species select change ---
    speciesSelect.addEventListener('change', function() {
        updateRecommendations(null, speciesSelect.value, publicLandData);
        updateSpeciesDisplay(speciesSelect.value, speciesData);
        updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        updateWeatherDisplay(selectedCounty);
    });

    // --- Season select change ---
    seasonSelect.addEventListener('change', function() {
        currentWeatherData.season = this.value;
        updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
        updateWeatherDisplay(selectedCounty);
    });

    // --- Initial map/weather (ensure map is colored on load) ---
    updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData});
    updateWeatherDisplay(selectedCounty);
});
