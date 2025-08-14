// observationAnalysis.js - Analysis system for iNaturalist observations and validation

import { iNatClient, obsProcessor } from './iNaturalistIntegration.js';
import { speciesMapper } from './speciesMapping.js';
import { reportsManager } from './foragingReports.js';
import { countyRegions } from './mapCalculations.js';
import { calculateProbability } from './mapCalculations.js';
import { currentWeatherData } from './weather.js';

/**
 * NH County geographic boundaries for filtering observations
 * Approximate lat/lng boundaries for each county
 */
export const nhCountyBoundaries = {
    coos: {
        name: 'Coos County',
        bounds: { north: 45.3057, south: 44.3895, east: -70.8737, west: -71.6056 }
    },
    grafton: {
        name: 'Grafton County', 
        bounds: { north: 44.3895, south: 43.5284, east: -71.4703, west: -72.5570 }
    },
    carroll: {
        name: 'Carroll County',
        bounds: { north: 44.3895, south: 43.5284, east: -70.8737, west: -71.4703 }
    },
    sullivan: {
        name: 'Sullivan County',
        bounds: { north: 43.5284, south: 42.9335, east: -71.8761, west: -72.5570 }
    },
    merrimack: {
        name: 'Merrimack County',
        bounds: { north: 43.5284, south: 42.9335, east: -71.4703, west: -71.8761 }
    },
    belknap: {
        name: 'Belknap County', 
        bounds: { north: 43.5284, south: 43.1979, east: -71.1814, west: -71.4703 }
    },
    cheshire: {
        name: 'Cheshire County',
        bounds: { north: 43.2081, south: 42.6929, east: -71.8761, west: -72.5570 }
    },
    hillsborough: {
        name: 'Hillsborough County',
        bounds: { north: 43.2081, south: 42.6929, east: -71.4703, west: -71.8761 }
    },
    strafford: {
        name: 'Strafford County',
        bounds: { north: 43.5284, south: 43.1979, east: -70.7341, west: -71.1814 }
    },
    rockingham: {
        name: 'Rockingham County',
        bounds: { north: 43.1979, south: 42.6929, east: -70.7341, west: -71.4703 }
    }
};

/**
 * Observation Analysis Engine
 * Validates predictions against iNaturalist scientific observations
 */
export class ObservationAnalyzer {
    constructor() {
        this.analysisCache = new Map();
        this.validationResults = new Map();
    }

    /**
     * Determine which NH county an observation belongs to
     */
    determineCounty(lat, lng) {
        if (!lat || !lng || lat < 42.69 || lat > 45.31 || lng < -72.56 || lng > -70.73) {
            return null; // Outside NH boundaries
        }

        for (const [countyKey, countyData] of Object.entries(nhCountyBoundaries)) {
            const bounds = countyData.bounds;
            if (lat >= bounds.south && lat <= bounds.north && 
                lng >= bounds.west && lng <= bounds.east) {
                return countyKey;
            }
        }

        return null; // Couldn't determine county
    }

    /**
     * Filter observations by NH counties with geographic assignment
     */
    assignCountiesToObservations(observations) {
        return observations
            .map(obs => {
                const county = obs.location?.lat && obs.location?.lng 
                    ? this.determineCounty(obs.location.lat, obs.location.lng)
                    : null;
                
                return {
                    ...obs,
                    nhCounty: county,
                    nhRegion: county ? countyRegions[county] : null
                };
            })
            .filter(obs => obs.nhCounty); // Only keep observations within NH
    }

    /**
     * Analyze seasonal patterns from observations
     */
    analyzeSeasonalPatterns(observations, dhhlsSpecies) {
        const seasonalData = {};
        const monthToSeason = {
            '01': 'winter', '02': 'winter', '03': 'spring',
            '04': 'spring', '05': 'spring', '06': 'summer', 
            '07': 'summer', '08': 'summer', '09': 'fall',
            '10': 'fall', '11': 'fall', '12': 'winter'
        };

        observations.forEach(obs => {
            if (obs.date?.observed) {
                const month = obs.date.observed.substring(5, 7);
                const season = monthToSeason[month];
                
                if (!seasonalData[season]) {
                    seasonalData[season] = { count: 0, months: {} };
                }
                
                seasonalData[season].count++;
                seasonalData[season].months[month] = (seasonalData[season].months[month] || 0) + 1;
            }
        });

        // Calculate seasonal probabilities
        const totalObservations = observations.length;
        const seasonalProbabilities = {};
        
        Object.entries(seasonalData).forEach(([season, data]) => {
            seasonalProbabilities[season] = data.count / totalObservations;
        });

        return {
            dhhlsSpecies: dhhlsSpecies,
            totalObservations: totalObservations,
            seasonalBreakdown: seasonalData,
            seasonalProbabilities: seasonalProbabilities,
            peakSeason: Object.entries(seasonalProbabilities)
                .sort(([,a], [,b]) => b - a)[0]?.[0]
        };
    }

    /**
     * Analyze regional patterns from observations
     */
    analyzeRegionalPatterns(observations, dhhlsSpecies) {
        const regionalData = {};
        const countyData = {};

        observations.forEach(obs => {
            if (obs.nhRegion) {
                regionalData[obs.nhRegion] = (regionalData[obs.nhRegion] || 0) + 1;
            }
            if (obs.nhCounty) {
                countyData[obs.nhCounty] = (countyData[obs.nhCounty] || 0) + 1;
            }
        });

        const totalObservations = observations.length;
        
        // Calculate regional probabilities
        const regionalProbabilities = {};
        Object.entries(regionalData).forEach(([region, count]) => {
            regionalProbabilities[region] = count / totalObservations;
        });

        const countyProbabilities = {};
        Object.entries(countyData).forEach(([county, count]) => {
            countyProbabilities[county] = count / totalObservations;
        });

        return {
            dhhlsSpecies: dhhlsSpecies,
            totalObservations: totalObservations,
            regionalBreakdown: regionalData,
            regionalProbabilities: regionalProbabilities,
            countyBreakdown: countyData,
            countyProbabilities: countyProbabilities,
            topRegion: Object.entries(regionalProbabilities)
                .sort(([,a], [,b]) => b - a)[0]?.[0],
            topCounty: Object.entries(countyProbabilities)
                .sort(([,a], [,b]) => b - a)[0]?.[0]
        };
    }

    /**
     * Validate our prediction model against iNaturalist observations
     */
    async validatePredictions(dhhlsSpecies, dateRange = {}) {
        try {
            console.log(`🔬 Starting validation for ${dhhlsSpecies}...`);
            
            // Get iNaturalist observations
            const rawObservations = await iNatClient.getAllObservations(dateRange, 3); // Limit to 3 pages
            console.log(`📡 Retrieved ${rawObservations.observations.length} total fungi observations from iNaturalist`);
            
            // Process and filter observations
            const processedObs = obsProcessor.processObservations(rawObservations.observations);
            console.log(`📍 Processed ${processedObs.length} observations`);
            
            const nhObservations = this.assignCountiesToObservations(processedObs);
            console.log(`🗺️ Found ${nhObservations.length} observations within NH boundaries`);
            
            // Map to DHHS species
            const speciesObservations = speciesMapper.filterObservationsBySpecies(nhObservations, dhhlsSpecies);
            console.log(`🧬 Found ${speciesObservations.length} observations matching ${dhhlsSpecies}`);
            
            // Debug: Show sample taxon names
            if (nhObservations.length > 0) {
                const sampleTaxa = nhObservations.slice(0, 5).map(obs => obs.taxon?.name).filter(Boolean);
                console.log(`📋 Sample species found:`, sampleTaxa);
            }
            
            // Debug: Show the mapped observations
            if (speciesObservations.length > 0) {
                const mappedTaxa = speciesObservations.map(obs => ({
                    name: obs.taxon?.name,
                    id: obs.taxon?.id,
                    date: obs.date?.observed,
                    county: obs.nhCounty
                }));
                console.log(`🍄 Mapped ${dhhlsSpecies} observations:`, mappedTaxa);
            }
            
            // Require minimum observations for meaningful analysis  
            if (speciesObservations.length === 0) {
                return {
                    dhhlsSpecies: dhhlsSpecies,
                    validationStatus: 'no_data',
                    message: `No iNaturalist observations found for ${dhhlsSpecies} in NH`,
                    observationCount: 0
                };
            }
            
            // Show limited data warning for small samples
            if (speciesObservations.length < 10) {
                console.log(`⚠️ Small sample size: Only ${speciesObservations.length} observations. Results may be less reliable.`);
            }

            // Analyze patterns
            const seasonalAnalysis = this.analyzeSeasonalPatterns(speciesObservations, dhhlsSpecies);
            const regionalAnalysis = this.analyzeRegionalPatterns(speciesObservations, dhhlsSpecies);
            
            // Compare with our current model predictions
            const modelComparison = await this.compareWithModel(dhhlsSpecies, speciesObservations);
            
            const validationResult = {
                dhhlsSpecies: dhhlsSpecies,
                validationStatus: 'success',
                observationCount: speciesObservations.length,
                dataSource: 'iNaturalist',
                dateRange: dateRange,
                seasonalAnalysis: seasonalAnalysis,
                regionalAnalysis: regionalAnalysis,
                modelComparison: modelComparison,
                recommendations: this.generateRecommendations(seasonalAnalysis, regionalAnalysis, modelComparison),
                timestamp: new Date().toISOString()
            };

            // Cache the results
            this.validationResults.set(dhhlsSpecies, validationResult);
            return validationResult;

        } catch (error) {
            console.error(`Validation error for ${dhhlsSpecies}:`, error);
            return {
                dhhlsSpecies: dhhlsSpecies,
                validationStatus: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Compare iNaturalist data with our current prediction model
     */
    async compareWithModel(dhhlsSpecies, observations) {
        const modelData = [];
        const observationData = [];

        // Sample various conditions and compare
        const sampleConditions = [
            { season: 'spring', county: 'grafton' },
            { season: 'summer', county: 'coos' },
            { season: 'fall', county: 'merrimack' },
            { season: 'fall', county: 'cheshire' }
        ];

        sampleConditions.forEach(condition => {
            // Get model prediction
            const weather = { ...currentWeatherData, season: condition.season };
            const region = countyRegions[condition.county];
            const modelPrediction = calculateProbability(dhhlsSpecies, weather, region);
            
            // Get observation frequency for same conditions
            const matchingObs = observations.filter(obs => {
                const obsMonth = obs.date?.observed?.substring(5, 7);
                const obsSeason = this.monthToSeason(obsMonth);
                return obsSeason === condition.season && obs.nhCounty === condition.county;
            });
            
            const observationFrequency = matchingObs.length / observations.length;
            
            modelData.push({
                condition: condition,
                modelPrediction: modelPrediction,
                observationFrequency: observationFrequency,
                observationCount: matchingObs.length,
                accuracy: modelPrediction > 0 ? 
                    1 - Math.abs(modelPrediction - observationFrequency) : 
                    (observationFrequency === 0 ? 1 : 0)
            });
        });

        const averageAccuracy = modelData.reduce((sum, d) => sum + d.accuracy, 0) / modelData.length;
        
        return {
            comparisonData: modelData,
            averageAccuracy: averageAccuracy,
            accuracyGrade: averageAccuracy > 0.8 ? 'excellent' : 
                          averageAccuracy > 0.6 ? 'good' : 
                          averageAccuracy > 0.4 ? 'fair' : 'poor'
        };
    }

    /**
     * Helper function to convert month to season
     */
    monthToSeason(month) {
        const monthToSeason = {
            '01': 'winter', '02': 'winter', '03': 'spring',
            '04': 'spring', '05': 'spring', '06': 'summer', 
            '07': 'summer', '08': 'summer', '09': 'fall',
            '10': 'fall', '11': 'fall', '12': 'winter'
        };
        return monthToSeason[month] || 'unknown';
    }

    /**
     * Generate recommendations based on validation results
     */
    generateRecommendations(seasonalAnalysis, regionalAnalysis, modelComparison) {
        const recommendations = [];

        // Seasonal recommendations
        if (seasonalAnalysis.peakSeason) {
            const currentModel = modelComparison.comparisonData.find(d => d.condition.season === seasonalAnalysis.peakSeason);
            if (currentModel && currentModel.accuracy < 0.7) {
                recommendations.push({
                    type: 'seasonal_adjustment',
                    priority: 'high',
                    message: `Consider increasing ${seasonalAnalysis.peakSeason} multiplier - iNaturalist shows this as peak season`,
                    evidence: `${Math.round(seasonalAnalysis.seasonalProbabilities[seasonalAnalysis.peakSeason] * 100)}% of observations occur in ${seasonalAnalysis.peakSeason}`
                });
            }
        }

        // Regional recommendations
        if (regionalAnalysis.topRegion) {
            recommendations.push({
                type: 'regional_validation',
                priority: 'medium',
                message: `${regionalAnalysis.topRegion} shows highest observation frequency`,
                evidence: `${Math.round(regionalAnalysis.regionalProbabilities[regionalAnalysis.topRegion] * 100)}% of observations in this region`
            });
        }

        // Overall accuracy recommendation
        if (modelComparison.averageAccuracy < 0.6) {
            recommendations.push({
                type: 'model_accuracy',
                priority: 'high',
                message: 'Model accuracy is below 60% - consider updating multipliers',
                evidence: `Average accuracy: ${Math.round(modelComparison.averageAccuracy * 100)}%`
            });
        }

        return recommendations;
    }

    /**
     * Cross-validate with user reports
     */
    async crossValidateWithUserReports(dhhlsSpecies) {
        const userReports = reportsManager.getReportsBySpecies(dhhlsSpecies);
        const iNatValidation = this.validationResults.get(dhhlsSpecies);
        
        if (!iNatValidation || userReports.length === 0) {
            return {
                status: 'insufficient_data',
                userReports: userReports.length,
                iNatObservations: iNatValidation?.observationCount || 0
            };
        }

        // Compare user report patterns with iNaturalist patterns
        const userSeasonalPattern = this.analyzeUserReportSeasons(userReports);
        const iNatSeasonalPattern = iNatValidation.seasonalAnalysis.seasonalProbabilities;
        
        const seasonalCorrelation = this.calculateSeasonalCorrelation(userSeasonalPattern, iNatSeasonalPattern);
        
        return {
            status: 'success',
            dhhlsSpecies: dhhlsSpecies,
            userReports: userReports.length,
            iNatObservations: iNatValidation.observationCount,
            seasonalCorrelation: seasonalCorrelation,
            correlationGrade: seasonalCorrelation > 0.7 ? 'high' : 
                             seasonalCorrelation > 0.4 ? 'moderate' : 'low',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Analyze user report seasonal patterns
     */
    analyzeUserReportSeasons(userReports) {
        const seasonalCounts = {};
        const monthToSeason = {
            '01': 'winter', '02': 'winter', '03': 'spring',
            '04': 'spring', '05': 'spring', '06': 'summer', 
            '07': 'summer', '08': 'summer', '09': 'fall',
            '10': 'fall', '11': 'fall', '12': 'winter'
        };

        userReports.forEach(report => {
            if (report.date) {
                const month = report.date.substring(5, 7);
                const season = monthToSeason[month];
                seasonalCounts[season] = (seasonalCounts[season] || 0) + 1;
            }
        });

        const total = userReports.length;
        const seasonalProbabilities = {};
        Object.entries(seasonalCounts).forEach(([season, count]) => {
            seasonalProbabilities[season] = count / total;
        });

        return seasonalProbabilities;
    }

    /**
     * Calculate correlation between user reports and iNaturalist seasonal patterns
     */
    calculateSeasonalCorrelation(userPattern, iNatPattern) {
        const seasons = ['spring', 'summer', 'fall', 'winter'];
        let correlation = 0;
        let validComparisons = 0;

        seasons.forEach(season => {
            const userFreq = userPattern[season] || 0;
            const iNatFreq = iNatPattern[season] || 0;
            
            if (userFreq > 0 || iNatFreq > 0) {
                const diff = Math.abs(userFreq - iNatFreq);
                correlation += (1 - diff);
                validComparisons++;
            }
        });

        return validComparisons > 0 ? correlation / validComparisons : 0;
    }

    /**
     * Get all validation results
     */
    getAllValidationResults() {
        return Object.fromEntries(this.validationResults);
    }

    /**
     * Clear cache and validation results
     */
    clearCache() {
        this.analysisCache.clear();
        this.validationResults.clear();
        console.log('Observation analysis cache cleared');
    }
}

// Create global instance
export const observationAnalyzer = new ObservationAnalyzer();

// Export for debugging
if (typeof window !== 'undefined') {
    window.observationAnalyzer = observationAnalyzer;
    window.nhCountyBoundaries = nhCountyBoundaries;
}