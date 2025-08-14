// speciesCoverageAudit.js - Audit tool for species mapping coverage

import { speciesData } from './species.js';
import { iNatSpeciesMapping } from './speciesMapping.js';

/**
 * Complete Species Coverage Audit
 * Checks which DHHS Tier 1 species have iNaturalist mapping vs which are missing
 */
export class SpeciesCoverageAuditor {
    
    /**
     * Get all species from species.js
     */
    getAllSpeciesKeys() {
        return Object.keys(speciesData);
    }
    
    /**
     * Get all species that have iNaturalist mapping
     */
    getMappedSpeciesKeys() {
        return Object.keys(iNatSpeciesMapping);
    }
    
    /**
     * Get species missing from iNaturalist mapping
     */
    getMissingMappings() {
        const allSpecies = this.getAllSpeciesKeys();
        const mappedSpecies = this.getMappedSpeciesKeys();
        
        return allSpecies.filter(species => !mappedSpecies.includes(species));
    }
    
    /**
     * Get species that have mapping but not in main species list
     */
    getExtraMappings() {
        const allSpecies = this.getAllSpeciesKeys();
        const mappedSpecies = this.getMappedSpeciesKeys();
        
        return mappedSpecies.filter(species => !allSpecies.includes(species));
    }
    
    /**
     * Generate comprehensive coverage report
     */
    generateCoverageReport() {
        const allSpecies = this.getAllSpeciesKeys();
        const mappedSpecies = this.getMappedSpeciesKeys();
        const missingMappings = this.getMissingMappings();
        const extraMappings = this.getExtraMappings();
        
        const coveragePercentage = ((mappedSpecies.length - extraMappings.length) / allSpecies.length * 100).toFixed(1);
        
        return {
            totalDHHLSSpecies: allSpecies.length,
            speciesWithMapping: mappedSpecies.length - extraMappings.length,
            coveragePercentage: parseFloat(coveragePercentage),
            
            // Complete lists
            allSpecies: allSpecies.map(key => ({
                key: key,
                name: speciesData[key]?.name || 'Unknown',
                hasiNatMapping: mappedSpecies.includes(key)
            })),
            
            // Missing mappings (high priority)
            missingMappings: missingMappings.map(key => ({
                key: key,
                name: speciesData[key]?.name || 'Unknown',
                scientificName: this.extractScientificName(speciesData[key]?.name)
            })),
            
            // Extra mappings (cleanup needed)
            extraMappings: extraMappings.map(key => ({
                key: key,
                mappingExists: true,
                inMainSpeciesList: false
            })),
            
            // Summary
            summary: {
                status: coveragePercentage >= 90 ? 'excellent' : 
                       coveragePercentage >= 75 ? 'good' : 
                       coveragePercentage >= 50 ? 'fair' : 'poor',
                
                priority: missingMappings.length > 0 ? 'high' : 'low',
                message: `${coveragePercentage}% coverage - ${missingMappings.length} species need mapping`
            }
        };
    }
    
    /**
     * Extract scientific name from full species name
     */
    extractScientificName(fullName) {
        if (!fullName) return null;
        
        // Extract text within parentheses
        const match = fullName.match(/\(([^)]+)\)/);
        if (match) {
            // Get first scientific name if multiple
            return match[1].split(',')[0].trim();
        }
        
        return null;
    }
    
    /**
     * Test specific species mapping in iNaturalist API
     */
    async testSpeciesMapping(speciesKey) {
        const speciesInfo = speciesData[speciesKey];
        if (!speciesInfo) {
            return { error: `Species ${speciesKey} not found in speciesData` };
        }
        
        const scientificName = this.extractScientificName(speciesInfo.name);
        if (!scientificName) {
            return { error: `Could not extract scientific name from: ${speciesInfo.name}` };
        }
        
        try {
            // Test API call to see if species exists in iNaturalist
            const searchUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&per_page=3`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const exactMatch = data.results.find(result => 
                    result.name.toLowerCase() === scientificName.toLowerCase()
                );
                
                return {
                    speciesKey: speciesKey,
                    scientificName: scientificName,
                    found: true,
                    exactMatch: !!exactMatch,
                    taxonId: exactMatch?.id || data.results[0].id,
                    suggestions: data.results.slice(0, 3).map(r => ({
                        name: r.name,
                        id: r.id,
                        commonName: r.preferred_common_name,
                        observationCount: r.observations_count
                    }))
                };
            } else {
                return {
                    speciesKey: speciesKey,
                    scientificName: scientificName,
                    found: false,
                    suggestions: []
                };
            }
        } catch (error) {
            return {
                speciesKey: speciesKey,
                scientificName: scientificName,
                error: error.message
            };
        }
    }
    
    /**
     * Test all missing species mappings
     */
    async testAllMissingMappings() {
        const missingMappings = this.getMissingMappings();
        const results = [];
        
        for (const speciesKey of missingMappings) {
            console.log(`Testing ${speciesKey}...`);
            const result = await this.testSpeciesMapping(speciesKey);
            results.push(result);
            
            // Small delay to respect API limits
            await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        return results;
    }
    
    /**
     * Print coverage report to console
     */
    printCoverageReport() {
        const report = this.generateCoverageReport();
        
        console.log('\n🔬 SPECIES COVERAGE AUDIT REPORT');
        console.log('=====================================');
        console.log(`📊 Coverage: ${report.coveragePercentage}% (${report.speciesWithMapping}/${report.totalDHHLSSpecies} species)`);
        console.log(`📈 Status: ${report.summary.status.toUpperCase()}`);
        console.log(`🚨 Priority: ${report.summary.priority.toUpperCase()}`);
        console.log(`💡 ${report.summary.message}`);
        
        if (report.missingMappings.length > 0) {
            console.log('\n❌ MISSING MAPPINGS (Need to Add):');
            report.missingMappings.forEach(species => {
                console.log(`   • ${species.key}: "${species.name}"`);
                if (species.scientificName) {
                    console.log(`     → Scientific: ${species.scientificName}`);
                }
            });
        }
        
        if (report.extraMappings.length > 0) {
            console.log('\n⚠️  EXTRA MAPPINGS (Cleanup Needed):');
            report.extraMappings.forEach(species => {
                console.log(`   • ${species.key}: exists in mapping but not in main species list`);
            });
        }
        
        console.log('\n✅ SUCCESSFULLY MAPPED:');
        const mappedSpecies = report.allSpecies.filter(s => s.hasiNatMapping);
        mappedSpecies.forEach(species => {
            console.log(`   • ${species.key}: "${species.name}"`);
        });
        
        console.log('\n=====================================\n');
        
        return report;
    }
}

// Create global instance
export const coverageAuditor = new SpeciesCoverageAuditor();

// Export for browser console access
if (typeof window !== 'undefined') {
    window.coverageAuditor = coverageAuditor;
}