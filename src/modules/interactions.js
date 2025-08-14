// interactions.js - User interface interaction handlers

import { speciesData, populateSpeciesDropdown } from './species.js';
import { getCountyLandData } from './publicLands.js';
import { getCountyInfo, updateMap } from './mapCalculations.js';
import { updateWeatherDisplay } from './weather.js';
import { reportsManager } from './foragingReports.js';
import { observationAnalyzer } from './observationAnalysis.js';

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
export function displayCountyInfo(county, countyKey = null) {
    const speciesSelect = document.getElementById('species-select');
    const currentSpecies = speciesSelect?.value || 'chanterelles';
    
    // If no countyKey provided, try to derive it from county name
    if (!countyKey) {
        const keyMap = {
            'Coos County': 'coos',
            'Grafton County': 'grafton', 
            'Carroll County': 'carroll',
            'Sullivan County': 'sullivan',
            'Merrimack County': 'merrimack',
            'Belknap County': 'belknap',
            'Cheshire County': 'cheshire',
            'Hillsborough County': 'hillsborough',
            'Strafford County': 'strafford',
            'Rockingham County': 'rockingham'
        };
        countyKey = keyMap[county] || county.toLowerCase();
    }
    
    // Get county information
    const countyInfo = getCountyInfo(countyKey, currentSpecies);
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
                <div class="county-actions">
                    <button class="report-success-btn" onclick="openForagingReport('${countyKey}', '${currentSpecies}', ${countyInfo.probability})">
                        📊 Report Foraging Results
                    </button>
                    <button class="clear-btn" onclick="clearCountyInfo()">Clear</button>
                </div>
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
            
            <div class="data-analytics">
                <h4>📊 Community Data & Analytics</h4>
                <div class="analytics-actions">
                    <button class="data-btn" onclick="showForagingStats('${countyKey}', '${currentSpecies}')">
                        📊 View Success Statistics
                    </button>
                    <button class="data-btn" onclick="validateWithiNaturalist('${currentSpecies}')">
                        🔬 Validate with iNaturalist
                    </button>
                    <button class="data-btn" onclick="exportForagingData()">
                        📁 Export Community Data
                    </button>
                </div>
            </div>
        </div>
    `;
    
    countyPanel.innerHTML = countyHTML;
    countyPanel.style.display = 'block';
    
    // Scroll to county info
    countyPanel.scrollIntoView({ behavior: 'smooth' });
    
    // Update weather display for this county (use countyKey for weather data)
    updateWeatherDisplay(countyKey);
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
    const countyKey = event.target.getAttribute('data-county');
    if (countyKey) {
        // Convert county key to display name
        const countyDisplayNames = {
            'coos': 'Coos County',
            'grafton': 'Grafton County',
            'carroll': 'Carroll County', 
            'sullivan': 'Sullivan County',
            'merrimack': 'Merrimack County',
            'belknap': 'Belknap County',
            'cheshire': 'Cheshire County',
            'hillsborough': 'Hillsborough County',
            'strafford': 'Strafford County',
            'rockingham': 'Rockingham County'
        };
        const county = countyDisplayNames[countyKey] || countyKey;
        displayCountyInfo(county, countyKey);
    }
}
/**
 * Open foraging report modal
 * @param {string} countyKey - County identifier
 * @param {string} species - Species key
 * @param {number} probability - Predicted probability
 */
export function openForagingReport(countyKey, species, probability) {
    // Check if modal already exists
    let modal = document.getElementById('foraging-report-modal');
    if (!modal) {
        modal = createForagingReportModal();
    }
    
    // Pre-fill form data
    const form = modal.querySelector('#foraging-report-form');
    if (form) {
        form.county.value = countyKey;
        form.species.value = species;
        form.predicted_probability.value = probability.toFixed(3);
        form.date.value = new Date().toISOString().split('T')[0];
    }
    
    // Show modal
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Create foraging report modal
 */
function createForagingReportModal() {
    const modal = document.createElement('div');
    modal.id = 'foraging-report-modal';
    modal.className = 'modal foraging-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'report-modal-title');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeForagingReport()"></div>
        <div class="modal-content report-modal-content">
            <div class="modal-header">
                <h3 id="report-modal-title">📊 Report Your Foraging Results</h3>
                <button class="close-btn" onclick="closeForagingReport()" aria-label="Close report form">&times;</button>
            </div>
            
            <form id="foraging-report-form" class="report-form">
                <div class="form-section">
                    <h4>🎯 Prediction Details</h4>
                    <div class="form-row">
                        <label for="county">County:</label>
                        <select name="county" id="report-county" required>
                            <option value="coos">Coos</option>
                            <option value="grafton">Grafton</option>
                            <option value="carroll">Carroll</option>
                            <option value="sullivan">Sullivan</option>
                            <option value="merrimack">Merrimack</option>
                            <option value="belknap">Belknap</option>
                            <option value="cheshire">Cheshire</option>
                            <option value="hillsborough">Hillsborough</option>
                            <option value="strafford">Strafford</option>
                            <option value="rockingham">Rockingham</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <label for="species">Target Species:</label>
                        <select name="species" id="report-species" required></select>
                    </div>
                    
                    <div class="form-row">
                        <label for="predicted_probability">Predicted Probability:</label>
                        <input type="number" name="predicted_probability" id="report-probability" 
                               step="0.001" min="0" max="1" readonly>
                    </div>
                    
                    <div class="form-row">
                        <label for="date">Foraging Date:</label>
                        <input type="date" name="date" id="report-date" required>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>✅ Results</h4>
                    <div class="form-row">
                        <label for="actual_success">Did you find the target species?</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="actual_success" value="true" required>
                                <span>Yes, found them! 🍄</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="actual_success" value="false" required>
                                <span>No, didn't find any 😞</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-row success-details" style="display: none;">
                        <label for="quantity_found">Quantity Found:</label>
                        <select name="quantity_found" id="report-quantity">
                            <option value="none">None</option>
                            <option value="light">Light (1-5 specimens)</option>
                            <option value="moderate">Moderate (6-20 specimens)</option>
                            <option value="heavy">Heavy (20+ specimens)</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <label for="confidence_level">How confident are you in this identification?</label>
                        <select name="confidence_level" id="report-confidence" required>
                            <option value="low">Low - Not entirely sure</option>
                            <option value="medium">Medium - Fairly confident</option>
                            <option value="high">High - Very confident</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>📍 Location Details (Optional)</h4>
                    <div class="form-row">
                        <label for="elevation">Elevation (feet):</label>
                        <input type="number" name="elevation" id="report-elevation" min="0" max="10000" step="50">
                    </div>
                    
                    <div class="form-row">
                        <label for="habitat">Habitat Description:</label>
                        <input type="text" name="habitat" id="report-habitat" 
                               placeholder="e.g., north-facing beech slope, old apple orchard">
                    </div>
                    
                    <div class="form-row">
                        <label for="access_notes">Access Notes:</label>
                        <input type="text" name="access_notes" id="report-access" 
                               placeholder="e.g., parking available, 0.5 mile hike from road">
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>💭 Additional Notes</h4>
                    <div class="form-row">
                        <label for="user_notes">Notes (weather observations, other species found, etc.):</label>
                        <textarea name="user_notes" id="report-notes" rows="3"
                                  placeholder="Any additional observations that might help improve predictions..."></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Submit Report</button>
                    <button type="button" class="cancel-btn" onclick="closeForagingReport()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate species dropdown
    const speciesSelect = modal.querySelector('#report-species');
    if (speciesSelect) {
        Object.entries(speciesData).forEach(([key, species]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = species.name.split(' (')[0]; // Get short name
            speciesSelect.appendChild(option);
        });
    }
    
    // Setup form handlers
    setupForagingReportHandlers(modal);
    
    return modal;
}

/**
 * Setup foraging report form event handlers
 */
function setupForagingReportHandlers(modal) {
    const form = modal.querySelector('#foraging-report-form');
    const successRadios = form.querySelectorAll('input[name="actual_success"]');
    const successDetails = form.querySelector('.success-details');
    
    // Show/hide quantity field based on success
    successRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'true') {
                successDetails.style.display = 'block';
                form.quantity_found.value = 'light'; // Default to light
            } else {
                successDetails.style.display = 'none';
                form.quantity_found.value = 'none';
            }
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForagingReport(form);
    });
}

/**
 * Submit foraging report
 */
function submitForagingReport(form) {
    const formData = new FormData(form);
    const reportData = {
        county: formData.get('county'),
        species: formData.get('species'),
        predicted_probability: parseFloat(formData.get('predicted_probability')),
        actual_success: formData.get('actual_success') === 'true',
        quantity_found: formData.get('quantity_found'),
        confidence_level: formData.get('confidence_level'),
        date: formData.get('date'),
        location_details: {
            elevation: formData.get('elevation') ? parseInt(formData.get('elevation')) : null,
            habitat: formData.get('habitat') || '',
            access_notes: formData.get('access_notes') || ''
        },
        user_notes: formData.get('user_notes') || ''
    };
    
    try {
        // Add report to storage
        const report = reportsManager.addReport(reportData);
        
        // Show success message
        showReportSubmissionSuccess(report);
        
        // Close modal
        closeForagingReport();
        
        console.log('Foraging report submitted:', report.id);
    } catch (error) {
        console.error('Error submitting foraging report:', error);
        showReportSubmissionError(error.message);
    }
}

/**
 * Show report submission success message
 */
function showReportSubmissionSuccess(report) {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.innerHTML = `
        <div class="toast-content">
            <h4>✅ Report Submitted!</h4>
            <p>Thank you for contributing to foraging accuracy improvement.</p>
            <p><strong>Report ID:</strong> ${report.id}</p>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    // Remove after 5 seconds
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

/**
 * Show report submission error message
 */
function showReportSubmissionError(errorMessage) {
    const message = document.createElement('div');
    message.className = 'error-toast';
    message.innerHTML = `
        <div class="toast-content">
            <h4>❌ Submission Failed</h4>
            <p>Error: ${errorMessage}</p>
            <p>Please try again or check your browser's console for details.</p>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    // Remove after 8 seconds
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => message.remove(), 300);
    }, 8000);
}

/**
 * Close foraging report modal
 */
export function closeForagingReport() {
    const modal = document.getElementById('foraging-report-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Show foraging statistics for a county/species combination
 */
export function showForagingStats(countyKey, species) {
    const stats = reportsManager.calculateAccuracyStats();
    const countyReports = reportsManager.getReportsByCounty(countyKey);
    const speciesReports = reportsManager.getReportsBySpecies(species);
    const countySpeciesReports = countyReports.filter(r => r.species === species);
    
    const insights = reportsManager.getValidationInsights();
    
    // Create stats modal
    let modal = document.getElementById('stats-modal');
    if (!modal) {
        modal = createStatsModal();
    }
    
    // Update content
    const content = modal.querySelector('#stats-content');
    content.innerHTML = `
        <div class="stats-section">
            <h4>📊 Overall Community Statistics</h4>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.totalReports}</div>
                    <div class="stat-label">Total Reports</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${(stats.overallAccuracy * 100).toFixed(1)}%</div>
                    <div class="stat-label">Overall Accuracy</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Object.keys(stats.bySpecies).length}</div>
                    <div class="stat-label">Species Tracked</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Object.keys(stats.byCounty).length}</div>
                    <div class="stat-label">Counties with Data</div>
                </div>
            </div>
        </div>
        
        <div class="stats-section">
            <h4>📍 ${countyKey.charAt(0).toUpperCase() + countyKey.slice(1)} County Statistics</h4>
            <div class="county-stats">
                <p><strong>Total Reports:</strong> ${countyReports.length}</p>
                ${stats.byCounty[countyKey] ? `
                    <p><strong>Success Rate:</strong> ${(stats.byCounty[countyKey].accuracy * 100).toFixed(1)}%</p>
                    <p><strong>Successful Finds:</strong> ${stats.byCounty[countyKey].successful} / ${stats.byCounty[countyKey].total}</p>
                ` : '<p>No data available for this county yet.</p>'}
            </div>
        </div>
        
        <div class="stats-section">
            <h4>🍄 ${species.charAt(0).toUpperCase() + species.slice(1)} Statistics</h4>
            <div class="species-stats">
                <p><strong>Total Reports:</strong> ${speciesReports.length}</p>
                ${stats.bySpecies[species] ? `
                    <p><strong>Success Rate:</strong> ${(stats.bySpecies[species].accuracy * 100).toFixed(1)}%</p>
                    <p><strong>Successful Finds:</strong> ${stats.bySpecies[species].successful} / ${stats.bySpecies[species].total}</p>
                ` : '<p>No data available for this species yet.</p>'}
            </div>
        </div>
        
        <div class="stats-section">
            <h4>🎯 ${species} in ${countyKey} County</h4>
            <div class="combined-stats">
                <p><strong>Specific Reports:</strong> ${countySpeciesReports.length}</p>
                ${countySpeciesReports.length > 0 ? `
                    <p><strong>Success Rate:</strong> ${((countySpeciesReports.filter(r => r.actual_success).length / countySpeciesReports.length) * 100).toFixed(1)}%</p>
                    <p><strong>Average Predicted Probability:</strong> ${(countySpeciesReports.reduce((sum, r) => sum + r.predicted_probability, 0) / countySpeciesReports.length * 100).toFixed(1)}%</p>
                ` : '<p>No specific data for this combination yet. Be the first to report!</p>'}
            </div>
        </div>
        
        ${insights.length > 0 ? `
        <div class="stats-section">
            <h4>💡 Validation Insights</h4>
            <div class="insights-list">
                ${insights.map(insight => `
                    <div class="insight-item">
                        <strong>${insight.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                        ${insight.recommendation}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${stats.totalReports === 0 ? `
        <div class="stats-section">
            <div class="no-data-message">
                <h4>🌟 Help Build the Community Database!</h4>
                <p>No foraging reports have been submitted yet. Be the first to contribute by reporting your foraging results!</p>
                <p>Your reports help improve prediction accuracy for everyone in the community.</p>
            </div>
        </div>
        ` : ''}
    `;
    
    // Show modal
    modal.style.display = 'flex';
}

/**
 * Create statistics modal
 */
function createStatsModal() {
    const modal = document.createElement('div');
    modal.id = 'stats-modal';
    modal.className = 'modal stats-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeStatsModal()"></div>
        <div class="modal-content stats-modal-content">
            <div class="modal-header">
                <h3>📊 Foraging Statistics & Community Data</h3>
                <button class="close-btn" onclick="closeStatsModal()">&times;</button>
            </div>
            <div id="stats-content" class="stats-content">
                <!-- Content populated dynamically -->
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

/**
 * Close statistics modal
 */
export function closeStatsModal() {
    const modal = document.getElementById('stats-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Export foraging data
 */
export function exportForagingData() {
    const stats = reportsManager.calculateAccuracyStats();
    
    if (stats.totalReports === 0) {
        alert('No foraging data available to export yet. Submit some reports first!');
        return;
    }
    
    // Show export options modal
    let modal = document.getElementById('export-modal');
    if (!modal) {
        modal = createExportModal();
    }
    
    // Update stats in modal
    modal.querySelector('#export-stats').innerHTML = `
        <p><strong>Total Reports:</strong> ${stats.totalReports}</p>
        <p><strong>Overall Accuracy:</strong> ${(stats.overallAccuracy * 100).toFixed(1)}%</p>
        <p><strong>Species Covered:</strong> ${Object.keys(stats.bySpecies).length}</p>
        <p><strong>Counties with Data:</strong> ${Object.keys(stats.byCounty).length}</p>
    `;
    
    modal.style.display = 'flex';
}

/**
 * Create export modal
 */
function createExportModal() {
    const modal = document.createElement('div');
    modal.id = 'export-modal';
    modal.className = 'modal export-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeExportModal()"></div>
        <div class="modal-content export-modal-content">
            <div class="modal-header">
                <h3>📁 Export Community Foraging Data</h3>
                <button class="close-btn" onclick="closeExportModal()">&times;</button>
            </div>
            <div class="export-content">
                <div class="export-section">
                    <h4>📊 Data Summary</h4>
                    <div id="export-stats">
                        <!-- Stats populated dynamically -->
                    </div>
                </div>
                
                <div class="export-section">
                    <h4>📁 Export Options</h4>
                    <div class="export-buttons">
                        <button class="export-btn json-export" onclick="downloadJSON()">
                            📄 Download JSON
                            <small>Complete data with metadata</small>
                        </button>
                        <button class="export-btn csv-export" onclick="downloadCSV()">
                            📊 Download CSV  
                            <small>Spreadsheet format for analysis</small>
                        </button>
                    </div>
                </div>
                
                <div class="export-section">
                    <h4>ℹ️ Data Usage</h4>
                    <div class="usage-info">
                        <p>This data is contributed by the GraniteFungiForager community to improve mushroom foraging predictions.</p>
                        <ul>
                            <li>Use for research and analysis</li>
                            <li>Help improve prediction algorithms</li>
                            <li>Share insights with the mycological community</li>
                            <li>Contribute to sustainable foraging practices</li>
                        </ul>
                        <p><strong>Note:</strong> Location data may be approximated for privacy protection.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

/**
 * Close export modal
 */
export function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Download data as JSON
 */
export function downloadJSON() {
    const data = reportsManager.exportReports();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `graniteFungiForager_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeExportModal();
}

/**
 * Download data as CSV
 */
export function downloadCSV() {
    const data = reportsManager.exportReportsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `graniteFungiForager_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeExportModal();
}

/**
 * Validate predictions with iNaturalist scientific observations
 */
export async function validateWithiNaturalist(species) {
    // Show loading modal first
    showValidationLoadingModal(species);
    
    try {
        // Get date range for recent observations (last 3 years)
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        console.log(`Starting iNaturalist validation for ${species}...`);
        
        // Validate with iNaturalist data
        const validationResult = await observationAnalyzer.validatePredictions(species, {
            d1: startDate,
            d2: endDate
        });
        
        // Cross-validate with user reports
        const crossValidation = await observationAnalyzer.crossValidateWithUserReports(species);
        
        // Show results
        showValidationResults(validationResult, crossValidation);
        
    } catch (error) {
        console.error('iNaturalist validation error:', error);
        showValidationError(species, error.message);
    }
}

/**
 * Show validation loading modal
 */
function showValidationLoadingModal(species) {
    let modal = document.getElementById('validation-loading-modal');
    if (!modal) {
        modal = createValidationLoadingModal();
    }
    
    modal.querySelector('#validation-species').textContent = species;
    modal.style.display = 'flex';
}

/**
 * Create validation loading modal
 */
function createValidationLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'validation-loading-modal';
    modal.className = 'modal validation-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content validation-loading-content">
            <div class="modal-header">
                <h3>🔬 Validating Predictions with iNaturalist</h3>
            </div>
            <div class="validation-loading">
                <div class="loading-spinner"></div>
                <h4>Analyzing <span id="validation-species"></span> observations...</h4>
                <div class="validation-steps">
                    <div class="step active">📡 Fetching iNaturalist observations</div>
                    <div class="step">📍 Filtering NH geographic data</div>
                    <div class="step">🧬 Mapping species taxonomy</div>
                    <div class="step">📊 Analyzing seasonal patterns</div>
                    <div class="step">🎯 Comparing with predictions</div>
                </div>
                <p class="loading-note">This may take 30-60 seconds due to API rate limits...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate steps
    setTimeout(() => animateValidationSteps(modal), 1000);
    
    return modal;
}

/**
 * Animate validation steps
 */
function animateValidationSteps(modal) {
    const steps = modal.querySelectorAll('.step');
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 8000); // 8 seconds per step
}

/**
 * Show validation results
 */
function showValidationResults(validationResult, crossValidation) {
    // Close loading modal
    const loadingModal = document.getElementById('validation-loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
    
    let modal = document.getElementById('validation-results-modal');
    if (!modal) {
        modal = createValidationResultsModal();
    }
    
    const content = modal.querySelector('#validation-content');
    
    if (validationResult.validationStatus === 'no_data') {
        content.innerHTML = `
            <div class="validation-section">
                <div class="no-data-message">
                    <h4>📭 No iNaturalist Data Available</h4>
                    <p>No scientific observations found for <strong>${validationResult.dhhlsSpecies}</strong> in New Hampshire.</p>
                    <p>This could mean:</p>
                    <ul>
                        <li>The species is rare in NH</li>
                        <li>Few people have observed and reported this species</li>
                        <li>The species may have different scientific names in iNaturalist</li>
                    </ul>
                    <p><strong>Recommendation:</strong> Rely on user reports and local expertise for this species.</p>
                </div>
            </div>
        `;
    } else if (validationResult.validationStatus === 'success') {
        content.innerHTML = generateValidationSuccessHTML(validationResult, crossValidation);
    } else {
        content.innerHTML = `
            <div class="validation-section">
                <div class="error-message">
                    <h4>❌ Validation Error</h4>
                    <p>Error validating ${validationResult.dhhlsSpecies}: ${validationResult.error}</p>
                </div>
            </div>
        `;
    }
    
    modal.style.display = 'flex';
}

/**
 * Generate HTML for successful validation results
 */
function generateValidationSuccessHTML(validation, crossValidation) {
    const seasonal = validation.seasonalAnalysis;
    const regional = validation.regionalAnalysis;
    const modelComp = validation.modelComparison;
    
    return `
        <div class="validation-section">
            <h4>📊 iNaturalist Observation Summary</h4>
            <div class="validation-stats-grid">
                <div class="validation-stat">
                    <div class="stat-number">${validation.observationCount}</div>
                    <div class="stat-label">NH Observations</div>
                </div>
                <div class="validation-stat">
                    <div class="stat-number">${seasonal.peakSeason || 'N/A'}</div>
                    <div class="stat-label">Peak Season</div>
                </div>
                <div class="validation-stat">
                    <div class="stat-number">${regional.topCounty || 'N/A'}</div>
                    <div class="stat-label">Top County</div>
                </div>
                <div class="validation-stat">
                    <div class="stat-number">${Math.round(modelComp.averageAccuracy * 100)}%</div>
                    <div class="stat-label">Model Accuracy</div>
                </div>
            </div>
        </div>
        
        <div class="validation-section">
            <h4>📅 Seasonal Pattern Analysis</h4>
            <div class="seasonal-comparison">
                ${Object.entries(seasonal.seasonalProbabilities || {}).map(([season, prob]) => `
                    <div class="season-bar">
                        <span class="season-name">${season.charAt(0).toUpperCase() + season.slice(1)}</span>
                        <div class="season-bar-container">
                            <div class="season-bar-fill" style="width: ${prob * 100}%"></div>
                        </div>
                        <span class="season-percentage">${Math.round(prob * 100)}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="validation-section">
            <h4>🗺️ Regional Distribution</h4>
            <div class="regional-breakdown">
                ${Object.entries(regional.regionalProbabilities || {}).map(([region, prob]) => `
                    <div class="region-item">
                        <strong>${region}:</strong> ${Math.round(prob * 100)}% of observations
                        <div class="region-bar">
                            <div class="region-bar-fill" style="width: ${prob * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="validation-section">
            <h4>🎯 Model Accuracy Assessment</h4>
            <div class="accuracy-breakdown">
                <div class="accuracy-overall">
                    <h5>Overall Grade: <span class="grade-${modelComp.accuracyGrade}">${modelComp.accuracyGrade.toUpperCase()}</span></h5>
                </div>
                ${modelComp.comparisonData.map(comp => `
                    <div class="accuracy-item">
                        <span class="condition">${comp.condition.season} in ${comp.condition.county}:</span>
                        <span class="accuracy">${Math.round(comp.accuracy * 100)}% accurate</span>
                        <small>(Model: ${Math.round(comp.modelPrediction * 100)}%, Observed: ${Math.round(comp.observationFrequency * 100)}%)</small>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${crossValidation.status === 'success' ? `
        <div class="validation-section">
            <h4>🤝 Cross-Validation with User Reports</h4>
            <div class="cross-validation">
                <p><strong>Data Sources:</strong> ${crossValidation.userReports} user reports + ${crossValidation.iNatObservations} iNaturalist observations</p>
                <p><strong>Seasonal Correlation:</strong> <span class="correlation-${crossValidation.correlationGrade}">${Math.round(crossValidation.seasonalCorrelation * 100)}% (${crossValidation.correlationGrade})</span></p>
            </div>
        </div>
        ` : `
        <div class="validation-section">
            <h4>🤝 Cross-Validation Status</h4>
            <p>Insufficient user report data for cross-validation. Submit more reports to enable this feature!</p>
        </div>
        `}
        
        ${validation.recommendations.length > 0 ? `
        <div class="validation-section">
            <h4>💡 Recommendations</h4>
            <div class="recommendations-list">
                ${validation.recommendations.map(rec => `
                    <div class="recommendation-item priority-${rec.priority}">
                        <div class="rec-header">
                            <strong>${rec.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                            <span class="priority-badge">${rec.priority} priority</span>
                        </div>
                        <p>${rec.message}</p>
                        <small class="evidence">${rec.evidence}</small>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

/**
 * Create validation results modal
 */
function createValidationResultsModal() {
    const modal = document.createElement('div');
    modal.id = 'validation-results-modal';
    modal.className = 'modal validation-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeValidationResults()"></div>
        <div class="modal-content validation-results-content">
            <div class="modal-header">
                <h3>🔬 iNaturalist Validation Results</h3>
                <button class="close-btn" onclick="closeValidationResults()">&times;</button>
            </div>
            <div id="validation-content" class="validation-content">
                <!-- Content populated dynamically -->
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

/**
 * Show validation error
 */
function showValidationError(species, errorMessage) {
    // Close loading modal
    const loadingModal = document.getElementById('validation-loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
    
    const message = document.createElement('div');
    message.className = 'error-toast';
    message.innerHTML = `
        <div class="toast-content">
            <h4>🔬 Validation Error</h4>
            <p>Could not validate ${species} with iNaturalist data</p>
            <p><strong>Error:</strong> ${errorMessage}</p>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        max-width: 400px;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => message.remove(), 300);
    }, 8000);
}

/**
 * Close validation results modal
 */
export function closeValidationResults() {
    const modal = document.getElementById('validation-results-modal');
    if (modal) {
        modal.style.display = 'none';
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
        // Populate species dropdown using the proper function
        populateSpeciesDropdown('species-select', 'chanterelles');
        
        // Set default selection and display
        const defaultSpecies = 'chanterelles';
        if (speciesSelect.querySelector(`option[value="${defaultSpecies}"]`)) {
            speciesSelect.value = defaultSpecies;
            displaySpeciesInfo(defaultSpecies);
        } else {
            // Fallback to first option if chanterelles not found
            const firstOption = speciesSelect.querySelector('option');
            if (firstOption) {
                speciesSelect.value = firstOption.value;
                displaySpeciesInfo(firstOption.value);
            }
        }
        
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
    
    // Make functions globally available for onclick handlers
    window.closeCountyModal = closeCountyModal;
    window.openForagingReport = openForagingReport;
    window.closeForagingReport = closeForagingReport;
    window.showForagingStats = showForagingStats;
    window.closeStatsModal = closeStatsModal;
    window.exportForagingData = exportForagingData;
    window.closeExportModal = closeExportModal;
    window.downloadJSON = downloadJSON;
    window.downloadCSV = downloadCSV;
    window.validateWithiNaturalist = validateWithiNaturalist;
    window.closeValidationResults = closeValidationResults;
    
    console.log('UI interactions initialized');
}
// Make clear function globally available for onclick
window.clearCountyInfo = clearCountyInfo;

// Add to your existing interactions.js module
export function initEnhancedMapInteractions() {
    const counties = document.querySelectorAll('.county');
    
    counties.forEach(county => {
        // Enhanced hover effects
        county.addEventListener('mouseenter', (e) => {
            const countyKey = e.target.dataset.county;
            const countyDisplayNames = {
                'coos': 'Coos County',
                'grafton': 'Grafton County',
                'carroll': 'Carroll County', 
                'sullivan': 'Sullivan County',
                'merrimack': 'Merrimack County',
                'belknap': 'Belknap County',
                'cheshire': 'Cheshire County',
                'hillsborough': 'Hillsborough County',
                'strafford': 'Strafford County',
                'rockingham': 'Rockingham County'
            };
            const countyName = countyDisplayNames[countyKey] || countyKey;
            showCountyTooltip(e, countyName);
        });
        
        county.addEventListener('mouseleave', hideCountyTooltip);
        
        // Enhanced click handling
        county.addEventListener('click', (e) => {
            const countyKey = e.target.dataset.county;
            const countyDisplayNames = {
                'coos': 'Coos County',
                'grafton': 'Grafton County',
                'carroll': 'Carroll County', 
                'sullivan': 'Sullivan County',
                'merrimack': 'Merrimack County',
                'belknap': 'Belknap County',
                'cheshire': 'Cheshire County',
                'hillsborough': 'Hillsborough County',
                'strafford': 'Strafford County',
                'rockingham': 'Rockingham County'
            };
            const countyName = countyDisplayNames[countyKey] || countyKey;
            // Use handleCountyClick instead of separate functions
            displayCountyInfo(countyName, countyKey);
        });
        
        // Keyboard accessibility
        county.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                county.click();
            }
        });
        
        // Make focusable for keyboard navigation
        county.setAttribute('tabindex', '0');
        county.setAttribute('role', 'button');
        const countyKey = county.dataset.county;
        const countyDisplayNames = {
            'coos': 'Coos County',
            'grafton': 'Grafton County',
            'carroll': 'Carroll County', 
            'sullivan': 'Sullivan County',
            'merrimack': 'Merrimack County',
            'belknap': 'Belknap County',
            'cheshire': 'Cheshire County',
            'hillsborough': 'Hillsborough County',
            'strafford': 'Strafford County',
            'rockingham': 'Rockingham County'
        };
        const countyName = countyDisplayNames[countyKey] || countyKey;
        county.setAttribute('aria-label', `View ${countyName} county recommendations`);
    });
}

function showCountyTooltip(event, countyName) {
    // Enhanced tooltip with probability info
    const tooltip = document.createElement('div');
    tooltip.className = 'enhanced-tooltip';
    tooltip.innerHTML = `
        <strong>${countyName.toUpperCase()}</strong><br>
        <em>Click for detailed recommendations</em>
    `;
    
    // Position and style tooltip
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-size: 0.9rem;
        pointer-events: none;
        z-index: 1000;
        left: ${event.pageX + 10}px;
        top: ${event.pageY - 10}px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(tooltip);
}

function hideCountyTooltip() {
    const tooltip = document.querySelector('.enhanced-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}