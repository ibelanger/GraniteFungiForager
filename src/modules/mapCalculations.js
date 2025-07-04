// mapCalculations.js - Probability calculation and map visualization

import { getWeatherData } from './weather.js';
import { speciesData } from './species.js';

// NH County regions for species probability calculations
export const countyRegions = {
    'Coos County': 'Great North Woods',
    'Grafton County': 'White Mountains', 
    'Carroll County': 'White Mountains',
    'Sullivan County': 'Dartmouth-Sunapee',
    'Merrimack County': 'Merrimack Valley',
    'Belknap County': 'Lakes Region',
    'Cheshire County': 'Monadnock Region',
    'Hillsborough County': 'Merrimack Valley',
    'Strafford County': 'Seacoast',
    'Rockingham County': 'Seacoast'
};

/**
 * Calculate mushroom probability for a given species and conditions
 * @param {string} speciesKey - Key for species in speciesData
 * @param {Object} weather - Weather conditions object
 * @param {string} region - Geographic region
 * @returns {number} Probability score (0-1)
 */
export function calculateProbability(speciesKey, weather, region) {
    const species = speciesData[speciesKey];
    if (!species) return 0;
    
    const { rainfall, soilTemp, airTemp, season } = weather;
    
    // Base probability from regional preference
    let probability = species.regions[region] || 0.5;
    
    // Temperature factor (soil temperature is primary)
    const [minTemp, maxTemp] = species.tempRange;
    let tempFactor = 1.0;
    
    if (soilTemp < minTemp) {
        tempFactor = Math.max(0.1, 1 - (minTemp - soilTemp) * 0.05);
    } else if (soilTemp > maxTemp) {
        tempFactor = Math.max(0.1, 1 - (soilTemp - maxTemp) * 0.05);
    }
    
    // Air temperature consideration (less critical than soil)
    const airTempOptimal = (minTemp + maxTemp) / 2;
    const airTempDeviation = Math.abs(airTemp - airTempOptimal);
    const airTempFactor = Math.max(0.7, 1 - airTempDeviation * 0.01);
    
    // Combined temperature factor
    const finalTempFactor = (tempFactor * 0.7) + (airTempFactor * 0.3);
    
    // Moisture factor
    let moistureFactor = 1.0;
    if (rainfall < species.moistureMin) {
        moistureFactor = Math.max(0.2, rainfall / species.moistureMin);
    } else if (rainfall > species.moistureMin * 3) {
        // Too much moisture can be bad
        moistureFactor = Math.max(0.6, 1 - (rainfall - species.moistureMin * 3) * 0.1);
    }
    
    // Seasonal factor
    const seasonalMultiplier = species.seasonMultiplier[season] || 0.5;
    
    // Combine all factors
    probability = probability * finalTempFactor * moistureFactor * seasonalMultiplier;
    
    // Apply special species adjustments
    probability = applySpeciesAdjustments(speciesKey, probability, weather, season);
    
    // Ensure probability stays within bounds
    return Math.max(0, Math.min(1, probability));
}

/**
 * Apply species-specific adjustments to probability
 * @param {string} speciesKey - Species identifier
 * @param {number} baseProbability - Base calculated probability
 * @param {Object} weather - Weather conditions
 * @param {string} season - Current season
 * @returns {number} Adjusted probability
 */
function applySpeciesAdjustments(speciesKey, baseProbability, weather, season) {
    let adjustedProbability = baseProbability;
    
    // Species-specific logic
    switch (speciesKey) {
        case 'morels':
            // Morels need specific spring conditions
            if (season === 'spring' && weather.soilTemp >= 55 && weather.soilTemp <= 70) {
                adjustedProbability *= 1.3;
            }
            break;
            
        case 'chanterelles':
            // Chanterelles love consistent moisture
            if (weather.rainfall > 1.5 && weather.rainfall < 4.0) {
                adjustedProbability *= 1.2;
            }
            break;
            
        case 'kingbolete':
            // King boletes prefer cooler, moist conditions
            if (weather.soilTemp < 70 && weather.rainfall > 2.0) {
                adjustedProbability *= 1.25;
            }
            break;
            
        case 'blacktrumpets':
            // Black trumpets love fall moisture
            if (season === 'fall' && weather.rainfall > 2.5) {
                adjustedProbability *= 1.4;
            }
            break;
            
        case 'maitake':
            // Maitake peaks in fall around oaks
            if (season === 'fall') {
                adjustedProbability *= 1.3;
            }
            break;
            
        case 'matsutake':
            // Matsutake prefers drier conditions after rain
            if (weather.rainfall > 1.0 && weather.rainfall < 2.5) {
                adjustedProbability *= 1.2;
            }
            break;
    }
    
    return adjustedProbability;
}

/**
 * Get color for probability value
 * @param {number} probability - Probability value (0-1)
 * @returns {string} CSS color value
 */
export function getProbabilityColor(probability) {
    if (probability < 0.2) return '#8B4513';      // Brown - Very Low
    if (probability < 0.4) return '#DAA520';      // Goldenrod - Low
    if (probability < 0.6) return '#FFD700';      // Gold - Medium
    if (probability < 0.8) return '#90EE90';      // Light Green - High
    return '#32CD32';                             // Lime Green - Very High
}

/**
 * Update map colors based on current species and conditions
 * @param {string} selectedSpecies - Currently selected species
 */
export function updateMap(selectedSpecies = null) {
    const speciesSelect = document.getElementById('species-select');
    const currentSpecies = selectedSpecies || speciesSelect?.value || 'chanterelles';
    
    // Get current weather conditions
    const weather = getWeatherData();
    
    // Update each county
    Object.entries(countyRegions).forEach(([county, region]) => {
        // Get county-specific weather if available
        const countyWeather = getWeatherData(county);
        
        // Calculate probability
        const probability = calculateProbability(currentSpecies, countyWeather, region);
        
        // Get map element
        const mapElement = document.querySelector(`[data-county="${county}"]`);
        if (mapElement) {
            const color = getProbabilityColor(probability);
            mapElement.style.fill = color;
            
            // Update tooltip data
            mapElement.setAttribute('data-probability', (probability * 100).toFixed(1));
            mapElement.setAttribute('data-species', currentSpecies);
        }
    });
    
    // Update legend if it exists
    updateLegend();
}

/**
 * Update map legend with current color scale
 */
function updateLegend() {
    const legend = document.getElementById('map-legend');
    if (!legend) return;
    
    const legendData = [
        { range: '0-20%', color: '#8B4513', label: 'Very Low' },
        { range: '20-40%', color: '#DAA520', label: 'Low' },
        { range: '40-60%', color: '#FFD700', label: 'Medium' },
        { range: '60-80%', color: '#90EE90', label: 'High' },
        { range: '80-100%', color: '#32CD32', label: 'Very High' }
    ];
    
    legend.innerHTML = legendData.map(item => 
        `<div class="legend-item">
            <div class="legend-color" style="background-color: ${item.color}"></div>
            <span class="legend-text">${item.range} - ${item.label}</span>
        </div>`
    ).join('');
}

/**
 * Get detailed county information for display
 * @param {string} county - County name
 * @param {string} species - Species key
 * @returns {Object} County information object
 */
export function getCountyInfo(county, species) {
    const region = countyRegions[county];
    const weather = getWeatherData(county);
    const probability = calculateProbability(species, weather, region);
    const speciesInfo = speciesData[species];
    
    return {
        county,
        region,
        probability,
        weather,
        species: speciesInfo?.name || species,
        color: getProbabilityColor(probability),
        recommendations: generateRecommendations(county, species, probability, weather)
    };
}

/**
 * Generate specific recommendations for county/species combination
 * @param {string} county - County name
 * @param {string} species - Species key
 * @param {number} probability - Calculated probability
 * @param {Object} weather - Weather conditions
 * @returns {Array} Array of recommendation strings
 */
function generateRecommendations(county, species, probability, weather) {
    const recommendations = [];
    const speciesInfo = speciesData[species];
    
    // Probability-based recommendations
    if (probability > 0.7) {
        recommendations.push('🍄 Excellent conditions - high success probability!');
    } else if (probability > 0.5) {
        recommendations.push('✅ Good conditions - worth checking preferred habitats');
    } else if (probability > 0.3) {
        recommendations.push('⚠️ Marginal conditions - focus on optimal microhabitats');
    } else {
        recommendations.push('❌ Poor conditions - consider waiting or trying other species');
    }
    
    // Weather-specific recommendations
    if (weather.rainfall < speciesInfo?.moistureMin) {
        recommendations.push('💧 Low moisture - check stream valleys and north-facing slopes');
    } else if (weather.rainfall > 3.0) {
        recommendations.push('🌧️ High moisture - avoid saturated soils, seek well-drained areas');
    }
    
    // Temperature recommendations
    const [minTemp, maxTemp] = speciesInfo?.tempRange || [50, 80];
    if (weather.soilTemp < minTemp) {
        recommendations.push('🌡️ Cool soils - try south-facing slopes and lower elevations');
    } else if (weather.soilTemp > maxTemp) {
        recommendations.push('❄️ Warm soils - seek higher elevations and shaded areas');
    }
    
    // Seasonal recommendations
    if (weather.season === 'spring') {
        recommendations.push('🌱 Spring season - check south-facing slopes that warm first');
    } else if (weather.season === 'fall') {
        recommendations.push('🍂 Fall season - look for consistent moisture in leaf litter');
    }
    
    // Host tree recommendations
    if (speciesInfo?.hostTrees?.length > 0) {
        const trees = speciesInfo.hostTrees.slice(0, 3).join(', ');
        recommendations.push(`🌳 Focus on areas with: ${trees}`);
    }
    
    return recommendations;
}

/**
 * Initialize map calculations module
 */
export function initMapCalculations() {
    // Set up species selection change handler
    const speciesSelect = document.getElementById('species-select');
    if (speciesSelect) {
        speciesSelect.addEventListener('change', (e) => {
            updateMap(e.target.value);
        });
    }
    
    // Set up manual control change handlers
    const manualControls = ['rainfall', 'soil-temp', 'air-temp', 'season'];
    manualControls.forEach(controlId => {
        const control = document.getElementById(controlId);
        if (control) {
            control.addEventListener('change', () => updateMap());
            control.addEventListener('input', () => updateMap());
        }
    });
    
    // Initial map update
    updateMap();
}
// Add to your existing mapCalculations.js
export function updateCountyColors() {
    const counties = document.querySelectorAll('.county');
    const currentSpecies = getCurrentSpecies();
    
    counties.forEach(county => {
        const countyName = county.dataset.county;
        const probability = calculateCountyProbability(countyName, currentSpecies);
        const color = getProbabilityColor(probability);
        
        // Smooth color transition
        county.style.transition = 'fill 0.5s ease';
        county.setAttribute('fill', color);
        
        // Store probability for tooltips
        county.dataset.probability = probability;
    });
}

function getProbabilityColor(probability) {
    if (probability >= 80) return '#2E7D32';      // Excellent
    if (probability >= 60) return '#4CAF50';      // Very Good  
    if (probability >= 40) return '#8BC34A';      // Good
    if (probability >= 20) return '#CDDC39';      // Fair
    return '#FF9800';                             // Poor
}