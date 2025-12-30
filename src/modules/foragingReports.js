// foragingReports.js - User feedback collection and accuracy tracking system

import { currentWeatherData } from './weather.js';

/**
 * Foraging Report Data Structure
 * Matches the structure defined in ACCURACY_IMPROVEMENT_PLAN.md
 */
export class ForagingReport {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.date = data.date || new Date().toISOString().split('T')[0];
        this.timestamp = data.timestamp || Date.now();
        this.county = data.county || '';
        this.species = data.species || '';
        this.predicted_probability = data.predicted_probability || 0;
        this.actual_success = data.actual_success || false;
        this.quantity_found = data.quantity_found || 'none'; // none, light, moderate, heavy
        this.confidence_level = data.confidence_level || 'medium'; // low, medium, high
        
        this.weather_conditions = {
            rainfall_7day: data.weather_conditions?.rainfall_7day || currentWeatherData.rainfall || 0,
            soil_temp: data.weather_conditions?.soil_temp || currentWeatherData.soilTemp || 0,
            air_temp: data.weather_conditions?.air_temp || currentWeatherData.airTemp || 0,
            humidity: data.weather_conditions?.humidity || 70,
            season: data.weather_conditions?.season || currentWeatherData.season || 'summer'
        };
        
        this.location_details = {
            elevation: data.location_details?.elevation || null,
            habitat: data.location_details?.habitat || '',
            gps_coords: data.location_details?.gps_coords || null,
            access_notes: data.location_details?.access_notes || ''
        };
        
        this.user_notes = data.user_notes || '';
        this.photo_uploaded = data.photo_uploaded || false;
        this.verified_by_expert = data.verified_by_expert || false;
    }
    
    generateId() {
        return 'report_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }
    
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            timestamp: this.timestamp,
            county: this.county,
            species: this.species,
            predicted_probability: this.predicted_probability,
            actual_success: this.actual_success,
            quantity_found: this.quantity_found,
            confidence_level: this.confidence_level,
            weather_conditions: this.weather_conditions,
            location_details: this.location_details,
            user_notes: this.user_notes,
            photo_uploaded: this.photo_uploaded,
            verified_by_expert: this.verified_by_expert
        };
    }
}

/**
 * Foraging Reports Manager - Handles storage, retrieval, and analysis
 */
export class ForagingReportsManager {
    constructor() {
        this.storageKey = 'graniteFungiForager_reports';
        this.reports = this.loadReports();
        this.observers = [];
    }
    
    /**
     * Load reports from localStorage
     */
    loadReports() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return [];
            
            const data = JSON.parse(stored);
            return data.map(reportData => new ForagingReport(reportData));
        } catch (error) {
            console.error('Error loading foraging reports:', error);
            return [];
        }
    }
    
    /**
     * Save reports to localStorage
     */
    saveReports() {
        try {
            const data = this.reports.map(report => report.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.notifyObservers();
        } catch (error) {
            console.error('Error saving foraging reports:', error);
        }
    }
    
    /**
     * Add a new foraging report
     */
    addReport(reportData) {
        const report = new ForagingReport(reportData);
        this.reports.push(report);
        this.saveReports();
        
        console.log('Foraging report added:', report.id);
        return report;
    }
    
    /**
     * Get all reports
     */
    getAllReports() {
        return [...this.reports];
    }
    
    /**
     * Get reports by county
     */
    getReportsByCounty(county) {
        return this.reports.filter(report => report.county === county);
    }
    
    /**
     * Get reports by species
     */
    getReportsBySpecies(species) {
        return this.reports.filter(report => report.species === species);
    }
    
    /**
     * Get reports by date range
     */
    getReportsByDateRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        return this.reports.filter(report => {
            const reportTime = new Date(report.date).getTime();
            return reportTime >= start && reportTime <= end;
        });
    }
    
    /**
     * Calculate accuracy statistics
     */
    calculateAccuracyStats() {
        if (this.reports.length === 0) {
            return {
                totalReports: 0,
                overallAccuracy: 0,
                bySpecies: {},
                byCounty: {},
                averageProbabilityWhenSuccessful: 0,
                averageProbabilityWhenUnsuccessful: 0
            };
        }
        
        const stats = {
            totalReports: this.reports.length,
            successfulForaging: 0,
            bySpecies: {},
            byCounty: {},
            probabilityStats: {
                successful: [],
                unsuccessful: []
            }
        };
        
        // Process each report
        this.reports.forEach(report => {
            const success = report.actual_success;
            const species = report.species;
            const county = report.county;
            const probability = report.predicted_probability;
            
            if (success) {
                stats.successfulForaging++;
                stats.probabilityStats.successful.push(probability);
            } else {
                stats.probabilityStats.unsuccessful.push(probability);
            }
            
            // Species stats
            if (!stats.bySpecies[species]) {
                stats.bySpecies[species] = { total: 0, successful: 0, accuracy: 0 };
            }
            stats.bySpecies[species].total++;
            if (success) stats.bySpecies[species].successful++;
            stats.bySpecies[species].accuracy = stats.bySpecies[species].successful / stats.bySpecies[species].total;
            
            // County stats
            if (!stats.byCounty[county]) {
                stats.byCounty[county] = { total: 0, successful: 0, accuracy: 0 };
            }
            stats.byCounty[county].total++;
            if (success) stats.byCounty[county].successful++;
            stats.byCounty[county].accuracy = stats.byCounty[county].successful / stats.byCounty[county].total;
        });
        
        // Calculate overall accuracy
        stats.overallAccuracy = stats.successfulForaging / stats.totalReports;
        
        // Calculate average probabilities
        stats.averageProbabilityWhenSuccessful = stats.probabilityStats.successful.length > 0 
            ? stats.probabilityStats.successful.reduce((a, b) => a + b, 0) / stats.probabilityStats.successful.length 
            : 0;
            
        stats.averageProbabilityWhenUnsuccessful = stats.probabilityStats.unsuccessful.length > 0
            ? stats.probabilityStats.unsuccessful.reduce((a, b) => a + b, 0) / stats.probabilityStats.unsuccessful.length
            : 0;
        
        return stats;
    }
    
    /**
     * Export reports as JSON for analysis
     */
    exportReports() {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '3.5.0',
            totalReports: this.reports.length,
            accuracyStats: this.calculateAccuracyStats(),
            reports: this.reports.map(report => report.toJSON())
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    /**
     * Export reports as CSV for spreadsheet analysis
     */
    exportReportsCSV() {
        if (this.reports.length === 0) return '';
        
        const headers = [
            'ID', 'Date', 'County', 'Species', 'Predicted_Probability', 'Actual_Success',
            'Quantity_Found', 'Confidence_Level', 'Rainfall_7day', 'Soil_Temp', 'Air_Temp',
            'Humidity', 'Season', 'Elevation', 'Habitat', 'GPS_Coords', 'User_Notes'
        ];
        
        const rows = this.reports.map(report => [
            report.id,
            report.date,
            report.county,
            report.species,
            report.predicted_probability,
            report.actual_success,
            report.quantity_found,
            report.confidence_level,
            report.weather_conditions.rainfall_7day,
            report.weather_conditions.soil_temp,
            report.weather_conditions.air_temp,
            report.weather_conditions.humidity,
            report.weather_conditions.season,
            report.location_details.elevation || '',
            report.location_details.habitat || '',
            report.location_details.gps_coords ? report.location_details.gps_coords.join(',') : '',
            report.user_notes.replace(/"/g, '""') // Escape quotes for CSV
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        return csvContent;
    }
    
    /**
     * Subscribe to report updates
     */
    subscribe(callback) {
        this.observers.push(callback);
    }
    
    /**
     * Unsubscribe from report updates
     */
    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    /**
     * Notify observers of changes
     */
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.reports, this.calculateAccuracyStats());
            } catch (error) {
                console.error('Error notifying observer:', error);
            }
        });
    }
    
    /**
     * Clear all reports (for testing or reset)
     */
    clearAllReports() {
        this.reports = [];
        this.saveReports();
        console.log('All foraging reports cleared');
    }
    
    /**
     * Get validation insights for improving predictions
     */
    getValidationInsights() {
        const stats = this.calculateAccuracyStats();
        const insights = [];
        
        // Identify species with low accuracy
        Object.entries(stats.bySpecies).forEach(([species, data]) => {
            if (data.total >= 3 && data.accuracy < 0.6) {
                insights.push({
                    type: 'low_species_accuracy',
                    species: species,
                    accuracy: data.accuracy,
                    sampleSize: data.total,
                    recommendation: `Review ${species} prediction model - accuracy is ${Math.round(data.accuracy * 100)}%`
                });
            }
        });
        
        // Identify counties with low accuracy
        Object.entries(stats.byCounty).forEach(([county, data]) => {
            if (data.total >= 3 && data.accuracy < 0.6) {
                insights.push({
                    type: 'low_county_accuracy',
                    county: county,
                    accuracy: data.accuracy,
                    sampleSize: data.total,
                    recommendation: `Review ${county} county multipliers - accuracy is ${Math.round(data.accuracy * 100)}%`
                });
            }
        });
        
        // Check if high predictions are actually successful
        const highPredictionSuccess = this.reports.filter(r => r.predicted_probability > 0.7 && r.actual_success).length;
        const totalHighPredictions = this.reports.filter(r => r.predicted_probability > 0.7).length;
        
        if (totalHighPredictions >= 5) {
            const highPredAccuracy = highPredictionSuccess / totalHighPredictions;
            if (highPredAccuracy < 0.8) {
                insights.push({
                    type: 'high_prediction_inaccuracy',
                    accuracy: highPredAccuracy,
                    sampleSize: totalHighPredictions,
                    recommendation: `High probability predictions (>70%) are only ${Math.round(highPredAccuracy * 100)}% accurate - review threshold calculations`
                });
            }
        }
        
        return insights;
    }
}

// Create global instance
export const reportsManager = new ForagingReportsManager();

// Export for debugging
window.foragingReports = reportsManager;