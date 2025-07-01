// map.js - Map rendering, coloring, and region selection

// Probability color scale
export function getProbabilityColor(probability) {
    if (probability >= 0.8) return '#228B22'; // Very High - Forest Green
    if (probability >= 0.6) return '#90EE90'; // High - Light Green
    if (probability >= 0.4) return '#FFD700'; // Moderate - Gold
    if (probability >= 0.2) return '#FFA500'; // Low - Orange
    return '#FF6B6B'; // Very Low - Light Red
}

// Probability calculation (unchanged, matches V8 logic)
export function calculateProbability(regionName, selectedSpecies, conditions, speciesData) {
    let baseProbs = [];
    if (selectedSpecies === 'all') {
        for (const key in speciesData) {
            const sp = speciesData[key];
            if (sp.regions && sp.regions[regionName]) baseProbs.push(sp.regions[regionName]);
        }
        if (baseProbs.length === 0) return 0.2; // fallback
        var baseProb = baseProbs.reduce((a, b) => a + b, 0) / baseProbs.length;
        var seasonMult = 1;
        var moistureMin = 1.5;
        var tempRange = [50, 75];
    } else {
        const sp = speciesData[selectedSpecies];
        if (!sp || !sp.regions || !sp.regions[regionName]) return 0.2;
        var baseProb = sp.regions[regionName];
        var seasonMult = sp.seasonMultiplier ? (sp.seasonMultiplier[conditions.season] || 1) : 1;
        var moistureMin = sp.moistureMin || 1.5;
        var tempRange = sp.tempRange || [50, 75];
    }
    let weatherMult = 1;
    if (conditions.rainfall < moistureMin) weatherMult *= 0.6;
    if (conditions.soilTemp < tempRange[0] || conditions.soilTemp > tempRange[1]) weatherMult *= 0.7;
    let prob = baseProb * seasonMult * weatherMult;
    prob = Math.max(0, Math.min(1, prob));
    return prob;
}

// Setup map event listeners and update logic (matches V8: only attaches listeners, does not generate SVG)
export function setupMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData, updateWeatherDisplay, updateRecommendations, publicLandData}) {
    regions.forEach(region => {
        region.setAttribute('tabindex', '0');
        region.setAttribute('role', 'button');
        region.setAttribute('aria-label', `Region: ${region.getAttribute('data-region')}`);
        region.addEventListener('click', function() {
            const selectedCounty = this.getAttribute('data-region');
            updateWeatherDisplay(selectedCounty);
            updateRecommendations(selectedCounty, speciesSelect.value, publicLandData);
        });
        region.addEventListener('focus', function() {
            const selectedCounty = this.getAttribute('data-region');
            updateWeatherDisplay(selectedCounty);
            updateRecommendations(selectedCounty, speciesSelect.value, publicLandData);
        });
        region.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const selectedCounty = this.getAttribute('data-region');
                updateWeatherDisplay(selectedCounty);
                updateRecommendations(selectedCounty, speciesSelect.value, publicLandData);
            }
        });
    });
}

// Update map coloring (matches V8: only colors existing SVG regions)
export function updateMap({regions, speciesSelect, countyWeatherData, currentWeatherData, speciesData}) {
    const selectedSpecies = speciesSelect.value;
    regions.forEach(region => {
        const regionName = region.getAttribute('data-region');
        const countyWeather = countyWeatherData[regionName] || currentWeatherData;
        const conditions = {
            rainfall: countyWeather.rainfall,
            soilTemp: countyWeather.soilTemp,
            airTemp: countyWeather.airTemp,
            season: countyWeather.season
        };
        const probability = calculateProbability(regionName, selectedSpecies, conditions, speciesData);
        const color = getProbabilityColor(probability);
        const zone = region.querySelector('.zone');
        if (zone) {
            zone.style.fill = color;
            zone.setAttribute('data-probability', Math.round(probability * 100));
        }
    });
}
