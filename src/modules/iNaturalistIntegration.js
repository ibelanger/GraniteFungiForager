// iNaturalistIntegration.js - iNaturalist API integration for mushroom observation data

/**
 * iNaturalist API Integration for NH Mushroom Observations
 * Correlates scientific observations with GraniteFungiForager predictions
 * 
 * Based on iNaturalist API documentation and best practices
 */

// NH Geographic boundaries for API queries
export const NH_BOUNDARIES = {
    // New Hampshire bounding box coordinates  
    swlat: 42.6929,   // Southwest latitude (southern border)
    swlng: -72.5570,  // Southwest longitude (western border) 
    nelat: 45.3057,   // Northeast latitude (northern border)
    nelng: -70.7341   // Northeast longitude (eastern border)
};

// NH Place ID for iNaturalist - Note: Using bounding box instead due to place_id issues
export const NH_PLACE_ID = null; // Will use bounding box coordinates instead

// Rate limiting configuration
const API_BASE_URL = 'https://api.inaturalist.org/v1';
const RATE_LIMIT_DELAY = 600; // 600ms between requests (100 calls/minute max)
const MAX_PER_PAGE = 200;     // Maximum observations per API call

/**
 * iNaturalist API client for NH mushroom observations
 */
export class INaturalistClient {
    constructor() {
        this.lastRequestTime = 0;
        this.requestCount = 0;
        this.cache = new Map();
        this.cacheExpiry = 1000 * 60 * 60; // 1 hour cache
    }

    /**
     * Rate limiting helper
     */
    async rateLimitDelay() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        this.lastRequestTime = Date.now();
        this.requestCount++;
        
        // Extra delay every 50 requests to be safe
        if (this.requestCount % 50 === 0) {
            console.log(`iNaturalist API: ${this.requestCount} requests made, taking extra delay`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    /**
     * Build API URL with parameters
     */
    buildURL(endpoint, params) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        
        // Add standard parameters for NH fungi observations
        const standardParams = {
            iconic_taxa: 'Fungi',
            // Use bounding box instead of place_id for more reliable results
            swlat: NH_BOUNDARIES.swlat,
            swlng: NH_BOUNDARIES.swlng, 
            nelat: NH_BOUNDARIES.nelat,
            nelng: NH_BOUNDARIES.nelng,
            quality_grade: 'research', // Only research-grade observations
            per_page: MAX_PER_PAGE,
            ...params
        };

        Object.entries(standardParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(`${key}[]`, v));
                } else {
                    url.searchParams.append(key, value);
                }
            }
        });

        return url.toString();
    }

    /**
     * Make cached API request
     */
    async makeRequest(url) {
        // Check cache first
        const cacheKey = url;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            console.log('iNaturalist API: Using cached data');
            return cached.data;
        }

        // Rate limit
        await this.rateLimitDelay();

        try {
            console.log(`iNaturalist API: Fetching ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
            
        } catch (error) {
            console.error('iNaturalist API Error:', error);
            throw error;
        }
    }

    /**
     * Get fungi observations in NH for a date range
     */
    async getObservations(params = {}) {
        const url = this.buildURL('/observations', params);
        const response = await this.makeRequest(url);
        
        return {
            observations: response.results || [],
            total: response.total_results || 0,
            page: response.page || 1,
            per_page: response.per_page || MAX_PER_PAGE,
            pages: Math.ceil((response.total_results || 0) / (response.per_page || MAX_PER_PAGE))
        };
    }

    /**
     * Get observations for a specific county in NH
     */
    async getCountyObservations(countyName, dateRange = {}) {
        // County-specific geographic filtering could be added here
        // For now, use general NH boundary and filter by county in results
        
        const params = {
            ...dateRange,
            // Additional filtering can be added
        };

        const result = await this.getObservations(params);
        
        // Post-process to filter by county if location data is available
        // This would require additional logic to match lat/lng to counties
        
        return result;
    }

    /**
     * Get observations for a specific month/season
     */
    async getSeasonalObservations(year, month) {
        const params = {
            year: year,
            month: month
        };

        return await this.getObservations(params);
    }

    /**
     * Get observations for a date range
     */
    async getDateRangeObservations(startDate, endDate) {
        const params = {
            d1: startDate, // YYYY-MM-DD format
            d2: endDate    // YYYY-MM-DD format
        };

        return await this.getObservations(params);
    }

    /**
     * Get all observations with pagination
     */
    async getAllObservations(params = {}, maxPages = 5) {
        let allObservations = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore && currentPage <= maxPages) {
            const pageParams = { ...params, page: currentPage };
            const result = await this.getObservations(pageParams);
            
            allObservations = allObservations.concat(result.observations);
            
            hasMore = currentPage < result.pages;
            currentPage++;
            
            console.log(`iNaturalist: Fetched page ${currentPage - 1}/${Math.min(result.pages, maxPages)}, total observations: ${allObservations.length}`);
        }

        return {
            observations: allObservations,
            total: allObservations.length,
            fetchedPages: currentPage - 1
        };
    }

    /**
     * Search for specific taxon by name
     */
    async searchTaxon(taxonName) {
        const url = this.buildURL('/taxa', { q: taxonName, per_page: 10 });
        const response = await this.makeRequest(url);
        
        return response.results || [];
    }

    /**
     * Get observations for a specific taxon ID
     */
    async getTaxonObservations(taxonId, dateRange = {}) {
        const params = {
            taxon_id: taxonId,
            ...dateRange
        };

        return await this.getObservations(params);
    }

    /**
     * Clear cache (useful for testing or fresh data)
     */
    clearCache() {
        this.cache.clear();
        console.log('iNaturalist API cache cleared');
    }

    /**
     * Get API usage statistics
     */
    getStats() {
        return {
            requestCount: this.requestCount,
            cacheSize: this.cache.size,
            lastRequestTime: new Date(this.lastRequestTime).toISOString()
        };
    }
}

/**
 * Observation data processor for analysis
 */
export class ObservationProcessor {
    constructor() {
        this.processedData = new Map();
    }

    /**
     * Process raw iNaturalist observations into analysis format
     */
    processObservations(observations) {
        return observations.map(obs => ({
            id: obs.id,
            taxon: {
                id: obs.taxon?.id,
                name: obs.taxon?.name,
                commonName: obs.taxon?.preferred_common_name,
                rank: obs.taxon?.rank
            },
            location: {
                lat: obs.location ? parseFloat(obs.location.split(',')[0]) : null,
                lng: obs.location ? parseFloat(obs.location.split(',')[1]) : null,
                placeGuess: obs.place_guess
            },
            date: {
                observed: obs.observed_on,
                created: obs.created_at,
                timeObserved: obs.time_observed_at
            },
            quality: {
                grade: obs.quality_grade,
                numIdentifications: obs.num_identification_agreements,
                communityTaxon: obs.community_taxon
            },
            photos: obs.photos ? obs.photos.map(photo => ({
                id: photo.id,
                url: photo.url,
                squareUrl: photo.square_url,
                mediumUrl: photo.medium_url
            })) : [],
            user: {
                id: obs.user?.id,
                login: obs.user?.login
            }
        }));
    }

    /**
     * Group observations by month for seasonal analysis
     */
    groupByMonth(processedObservations) {
        const byMonth = {};
        
        processedObservations.forEach(obs => {
            if (obs.date.observed) {
                const month = obs.date.observed.substring(5, 7); // Extract MM from YYYY-MM-DD
                if (!byMonth[month]) {
                    byMonth[month] = [];
                }
                byMonth[month].push(obs);
            }
        });

        return byMonth;
    }

    /**
     * Group observations by taxon for species analysis
     */
    groupByTaxon(processedObservations) {
        const byTaxon = {};
        
        processedObservations.forEach(obs => {
            const taxonName = obs.taxon.name || 'Unknown';
            if (!byTaxon[taxonName]) {
                byTaxon[taxonName] = [];
            }
            byTaxon[taxonName].push(obs);
        });

        return byTaxon;
    }

    /**
     * Analyze observation patterns
     */
    analyzePatterns(processedObservations) {
        const byMonth = this.groupByMonth(processedObservations);
        const byTaxon = this.groupByTaxon(processedObservations);

        return {
            totalObservations: processedObservations.length,
            uniqueSpecies: Object.keys(byTaxon).length,
            monthlyBreakdown: Object.entries(byMonth).map(([month, obs]) => ({
                month: month,
                count: obs.length,
                species: new Set(obs.map(o => o.taxon.name)).size
            })),
            speciesBreakdown: Object.entries(byTaxon).map(([species, obs]) => ({
                species: species,
                count: obs.length,
                commonName: obs[0]?.taxon.commonName,
                months: new Set(obs.map(o => o.date.observed?.substring(5, 7)).filter(Boolean)).size
            })).sort((a, b) => b.count - a.count)
        };
    }
}

// Create global instances
export const iNatClient = new INaturalistClient();
export const obsProcessor = new ObservationProcessor();

// Export for debugging
if (typeof window !== 'undefined') {
    window.iNaturalistClient = iNatClient;
    window.observationProcessor = obsProcessor;
}