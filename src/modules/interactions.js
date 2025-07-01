// interactions.js - User interface interaction handlers

import { speciesData } from './species.js';
import { getCountyLandData } from './publicLands.js';
import { getCountyInfo, updateMap } from './mapCalculations.js';
import { updateWeatherDisplay } from './weather.js';

/**
 * Display detailed species information
 * @param {string} speciesKey - Species identifier
 */
export function displaySpeciesInfo(speciesKey) {
    const species = speciesData[speciesKey];
    if (!species) return;
    
    const infoPanel = document.getElementById('species-info');
    if (!infoPanel) return;
    
    // Create species information HTML
    const infoHTML = `
        <div class="species-card">
            <h3>${species.name}</h3>
            
            <div class="info-section">
                <h4>🌡️ Growing Conditions</h4>
                <p><strong>Temperature Range:</strong> ${species.tempRange[0]}°F - ${species.tempRange[1]}°F (soil)</p>
                <p><strong>Minimum Moisture:</strong> ${species.moistureMin}" rainfall (past 7-10 days)</p>
                ${species.soilPreference ? `<p><strong>Soil Preference:</strong> ${species.soilPreference}</p>` : ''}
            </div>
            
            ${species.hostTrees ? `
            <div class="info-section">
                <h4>🌳 Habitat & Host Trees</h4>
                <p><strong>Host Trees:</strong> ${species.hostTrees.join(', ')}</p>
                ${species.microhabitat ? `<p><strong>Microhabitat:</strong> ${species.microhabitat}</p>` : ''}
                ${species.preferredSites ? `<p><strong>Preferred Sites:</strong> ${species.preferredSites.join(', ')}</p>` : ''}
            </div>
            ` : ''}
            
            ${species.seasonMultiplier ? `
            <div class="info-section">
                <h4>📅 Seasonal Timing</h4>
                <div class="season-grid">
                    ${Object.entries(species.seasonMultiplier).map(([season, mult]) => 
                        `<div class="season-item">
                            <span class="season-name">${season.charAt(0).toUpperCase() + season.slice(1)}</span>
                            <span class="season-value">${(mult * 100).toFixed(0)}%</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
            
            ${species.elevationTiming ? `
            <div class="info-section">
                <h4>⛰️ Elevation Timing</h4>
                ${Object.entries(species.elevationTiming).map(([elevation, timing]) => 
                    `<p><strong>${elevation} elevation:</strong> ${timing}</p>`
                ).join('')}
            </div>
            ` : ''}
            
            ${species.identificationNotes ? `
            <div class="info-section">
                <h4>🔍 Identification Notes</h4>
                ${Object.entries(species.identificationNotes).map(([key, note]) => 
                    `<p><strong>${key}:</strong> ${note}</p>`
                ).join('')}
            </div>
            ` : ''}
            
            ${species.subgenusDetails ? `
            <div class="info-section">
                <h4>🧬 Subgenus Groups</h4>
                ${Object.entries(species.subgenusDetails).map(([subgenus, note]) => 
                    `<p><strong>${subgenus}:</strong> ${note}</p>`
                ).join('')}
            </div>
            ` : ''}
            
            ${species.species ? `
            <div class="info-section">
                <h4>🍄 Species Details</h4>
                ${Object.entries(species.species).map(([speciesName, note]) => 
                    `<p><strong>${speciesName}:</strong> ${note}</p>`
                ).join('')}
            </div>
            ` : ''}
            
            <div class="info-section">
                <h4>🔗 Reference Links</h4>
                ${species.mushroomExpertLink ? 
                    `<p><a href="${species.mushroomExpertLink}" target="_blank" rel="noopener">MushroomExpert.com Identification Guide</a></p>` : ''}
                ${species.boleteKeyLink ? 
                    `<p><a href="${species.boleteKeyLink}" target="_blank" rel="noopener">Boletes WPA Club Key</a></p>` : ''}
            </div>
        </div>
    `;
    
    infoPanel.innerHTML = infoHTML;
    infoPanel.style.display = 'block';
}

/**
 * Display county-specific information on main page
 * @param {string} county - County name
 */
export function displayCountyInfo(county) {
    const speciesSelect = document.getElementById('species-select');
    const currentSpecies = speciesSelect?.value || 'chanterelles';
    
    // Get county information
    const countyInfo = getCountyInfo(county, currentSpecies);
    const landData = getCountyLandData(county);
    
    // Find or create county info panel on main page
    let countyPanel = document.getElementById('county-info');
    if (!countyPanel) {
        // Create county info panel if it doesn't exist
        countyPanel = document.createElement('div');
        countyPanel.id = 'county-info';
        countyPanel.className = 'county-info-panel';
        
        // Insert after the species info panel
        const speciesInfo = document.getElementById('species-info');
        if (speciesInfo) {
            speciesInfo.parentNode.insertBefore(countyPanel, speciesInfo.nextSibling);
        } else {
            // Fallback: add to map section
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.appendChild(countyPanel);
            }
        }
    }
    
    // Update county panel content
    const countyHTML = `
        <div class="county-details">
            <div class="county-header">
                <h3>📍 ${county} Information</h3>
                <button class="clear-btn" onclick="clearCountyInfo()">Clear</button>
            </div>
            
            <div class="probability-display" style="background-color: ${countyInfo.color};">
                <h4>${countyInfo.species} Probability: ${(countyInfo.probability * 100).toFixed(1)}%</h4>
            </div>
            
            <div class="current-conditions">
                <h4>📊 Current Conditions</h4>
                <div class="conditions-grid">
                    <div class="condition-item">
                        <span class="condition-label">Rainfall (7 days):</span>
                        <span class="condition-value">${countyInfo.weather.rainfall?.toFixed(2) || 'N/A'}"</span>
                    </div>
                    <div class="condition-item">
                        <span class="condition-label">Soil Temperature:</span>
                        <span class="condition-value">${countyInfo.weather.soilTemp || 'N/A'}°F</span>
                    </div>
                    <div class="condition-item">
                        <span class="condition-label">Air Temperature:</span>
                        <span class="condition-value">${countyInfo.weather.airTemp || 'N/A'}°F</span>
                    </div>
                </div>
            </div>
            
            <div class="recommendations">
                <h4>💡 Recommendations</h4>
                <ul>
                    ${countyInfo.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            ${landData && landData.general ? `
            <div class="general-info">
                <h4>🏞️ General Information</h4>
                <ul>
                    <li><strong>Climate:</strong> ${landData.general.climate}</li>
                    <li><strong>Soils:</strong> ${landData.general.soils}</li>
                    <li><strong>Best Months:</strong> ${landData.general.bestMonths}</li>
                    <li><strong>Total Acres:</strong> ${landData.general.totalAcres}</li>
                </ul>
            </div>
            ` : ''}
            
            ${landData && landData.landsBySpecies ? `
            <div class="locations-info">
                <h4>📍 Specific Locations by Species</h4>
                <div class="locations-grid">
                    ${Object.entries(landData.landsBySpecies).slice(0, 2).map(([species, locations]) => `
                        <div class="species-section">
                            <h5>🍄 ${species.charAt(0).toUpperCase() + species.slice(1)}</h5>
                            ${locations.slice(0, 2).map(location => `
                                <div class="location-card">
                                    <h6>${location.name}</h6>
                                    ${location.gps ? `<p><strong>GPS:</strong> ${location.gps}</p>` : ''}
                                    ${location.access ? `<p><strong>Access:</strong> ${location.access}</p>` : ''}
                                    ${location.timing ? `<p><strong>Best Timing:</strong> ${location.timing}</p>` : ''}
                                    ${location.note ? `<p class="location-notes">${location.note}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    countyPanel.innerHTML = countyHTML;
    countyPanel.style.display = 'block';
    
    // Scroll to county info
    countyPanel.scrollIntoView({ behavior: 'smooth' });
    
    // Update weather display for this county
    updateWeatherDisplay(county);
}

/**
 * Close county information modal
 */
export function closeCountyModal() {
    const modal = document.getElementById('county-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset weather display to general data
    updateWeatherDisplay();
}

/**
 * Handle county map click
 * @param {Event} event - Click event
 */
export function handleCountyClick(event) {
    const county = event.target.getAttribute('data-county');
    if (county) {
        displayCountyInfo(county);
    }
}
/**
 * Clear county information from main page
 */
export function clearCountyInfo() {
    const countyPanel = document.getElementById('county-info');
    if (countyPanel) {
        countyPanel.style.display = 'none';
    }
    
    // Reset weather display to general data
    updateWeatherDisplay();
}
/**
 * Handle species selection change
 * @param {Event} event - Change event
 */
export function handleSpeciesChange(event) {
    const selectedSpecies = event.target.value;
    
    // Update species information display
    displaySpeciesInfo(selectedSpecies);
    
    // Update map colors
    updateMap(selectedSpecies);
}

/**
 * Setup manual control sliders with live updates
 */
export function setupManualControls() {
    const controls = [
        { id: 'rainfall', display: 'rainfall-value', unit: '"', decimals: 1 },
        { id: 'soil-temp', display: 'soil-temp-value', unit: '°F', decimals: 0 },
        { id: 'air-temp', display: 'air-temp-value', unit: '°F', decimals: 0 }
    ];
    
    controls.forEach(control => {
        const slider = document.getElementById(control.id);
        const display = document.getElementById(control.display);
        
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                display.textContent = `${value.toFixed(control.decimals)}${control.unit}`;
                updateMap(); // Update map in real-time
            });
        }
    });
}

/**
 * Setup tooltips for map counties
 */
export function setupMapTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    
    // Add hover listeners to county elements
    document.querySelectorAll('[data-county]').forEach(county => {
        county.addEventListener('mouseenter', (e) => {
            const countyName = e.target.getAttribute('data-county');
            const probability = e.target.getAttribute('data-probability');
            const species = e.target.getAttribute('data-species');
            
            tooltip.innerHTML = `
                <strong>${countyName}</strong><br>
                ${species}: ${probability}%<br>
                <em>Click for details</em>
            `;
            tooltip.style.display = 'block';
        });
        
        county.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
        
        county.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        county.addEventListener('click', handleCountyClick);
    });
}

/**
 * Initialize all interaction handlers
 */
export function initInteractions() {
    // Setup species selection
    const speciesSelect = document.getElementById('species-select');
    if (speciesSelect) {
        // Populate species dropdown
        const speciesOptions = Object.entries(speciesData).map(([key, species]) => 
            `<option value="${key}">${species.name}</option>`
        ).join('');
        speciesSelect.innerHTML = speciesOptions;
        
        // Set default selection and display
        const defaultSpecies = 'chanterelles';
        speciesSelect.value = defaultSpecies;
        displaySpeciesInfo(defaultSpecies);
        
        // Add change handler
        speciesSelect.addEventListener('change', handleSpeciesChange);
    }
    
    // Setup manual controls
    setupManualControls();
    
    // Setup map interactions
    setupMapTooltips();
    
    // Setup update button
    const updateButton = document.getElementById('update-map');
    if (updateButton) {
        updateButton.addEventListener('click', () => updateMap());
    }
    
    // Make close function globally available
    window.closeCountyModal = closeCountyModal;
    
    console.log('UI interactions initialized');
}
// Make clear function globally available for onclick
window.clearCountyInfo = clearCountyInfo;