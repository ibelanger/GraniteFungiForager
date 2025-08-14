// speciesMapping.js - Maps iNaturalist species to DHHS Tier 1 species

import { speciesData } from './species.js';

/**
 * Mapping between iNaturalist taxon names and our DHHS Tier 1 species
 * Based on scientific names and common variations found in iNaturalist
 */
export const iNatSpeciesMapping = {
    // Morels - Multiple species mapped to single DHHS category
    morels: {
        scientificNames: [
            'Morchella americana',
            'Morchella angusticeps', 
            'Morchella elata',
            'Morchella punctipes',
            'Morchella esculenta', // Common misidentification
            'Morchella conica',    // Synonym for M. elata
            'Morchella rufobrunnea' // Western species sometimes found
        ],
        commonNames: [
            'Black Morel',
            'Yellow Morel', 
            'Half-free Morel',
            'Common Morel',
            'Morel'
        ],
        iNatTaxonIds: [
            47378,  // Morchella
            121653, // Morchella americana  
            121655, // Morchella angusticeps
            47379,  // Morchella elata
            343400  // Morchella punctipes
        ]
    },

    // Chanterelles - Multiple species in complex
    chanterelles: {
        scientificNames: [
            'Cantharellus cinnabarinus',
            'Cantharellus flavus', 
            'Cantharellus lateritius',
            'Cantharellus cibarius',
            'Cantharellus formosus',    // Pacific Golden - actually found in NH
            'Cantharellus roseocanus',  // Rainbow Chanterelle - found in NH
            'Cantharellus enelensis',   // Appalachian chanterelle
            'Craterellus tubaeformis'   // Yellowfoot/Winter Chanterelle - closely related
        ],
        commonNames: [
            'Red Chanterelle',
            'Smooth Chanterelle',
            'Golden Chanterelle',
            'Pacific Golden Chanterelle',
            'Rainbow Chanterelle', 
            'Yellowfoot',
            'Winter Chanterelle',
            'Chanterelle'
        ],
        iNatTaxonIds: [
            47718,  // Cantharellus genus
            47719,  // C. cibarius (Golden Chanterelle - found in NH)
            343238, // C. enelensis (Appalachian Chanterelle - found in NH)  
            49628,  // C. cinnabarinus
            117770, // C. lateritius
            120443, // C. formosus
            499666, // C. roseocanus
            350511  // Craterellus tubaeformis (Winter Chanterelle)
        ]
    },


    // Black Trumpets
    blacktrumpets: {
        scientificNames: [
            'Craterellus fallax',
            'Craterellus cornucopioides',
            'Craterellus calicornucopioides'
        ],
        commonNames: [
            'Black Trumpet',
            'Horn of Plenty',
            'Trumpet of Death'
        ],
        iNatTaxonIds: [
            48785,  // Craterellus
            48786,  // C. cornucopioides
            343142  // C. fallax
        ]
    },

    // Beefsteak Polypore
    beefsteak: {
        scientificNames: [
            'Fistulina hepatica'
        ],
        commonNames: [
            'Beefsteak Polypore',
            'Beefsteak Fungus',
            'Ox Tongue'
        ],
        iNatTaxonIds: [
            55074   // Fistulina hepatica
        ]
    },

    // Cauliflower Mushroom  
    cauliflower: {
        scientificNames: [
            'Sparassis spathulata',
            'Sparassis herbstii',
            'Sparassis crispa'  // European, but sometimes misidentified
        ],
        commonNames: [
            'Cauliflower Mushroom',
            'Wood Cauliflower'
        ],
        iNatTaxonIds: [
            49283,  // Sparassis
            194521, // S. spathulata  
            194522  // S. herbstii
        ]
    },

    // Matsutake
    matsutake: {
        scientificNames: [
            'Tricholoma matsutake',
            'Tricholoma magnivelare' // American matsutake
        ],
        commonNames: [
            'Matsutake',
            'Pine Mushroom',
            'American Matsutake'
        ],
        iNatTaxonIds: [
            49836,  // T. matsutake
            49837   // T. magnivelare  
        ]
    },


    // Lobster Mushroom
    lobster: {
        scientificNames: [
            'Hypomyces lactifluorum'
        ],
        commonNames: [
            'Lobster Mushroom'
        ],
        iNatTaxonIds: [
            48215   // Hypomyces lactifluorum
        ]
    },

    // Trumpet Chanterelle (Winter Chanterelle)
    trumpetchanterelle: {
        scientificNames: [
            'Craterellus tubaeformis'
        ],
        commonNames: [
            'Yellowfoot',
            'Winter Chanterelle',
            'Trumpet Chanterelle'
        ],
        iNatTaxonIds: [
            350511  // Craterellus tubaeformis
        ]
    },

    // Sweet Tooth Hedgehog
    sweettooth: {
        scientificNames: [
            'Hydnum subolympicum'
        ],
        commonNames: [
            'Sweet Tooth',
            'Hedgehog Mushroom'
        ],
        iNatTaxonIds: [
            793363  // Hydnum subolympicum
        ]
    },

    // Depressed Hedgehog
    depressedhedgehog: {
        scientificNames: [
            'Hydnum umbilicatum'
        ],
        commonNames: [
            'Depressed Hedgehog',
            'Belly Button Hedgehog'
        ],
        iNatTaxonIds: [
            48421   // Hydnum umbilicatum
        ]
    },

    // White Hedgehog
    whitehedgehog: {
        scientificNames: [
            'Hydnum albidum'
        ],
        commonNames: [
            'White Hedgehog'
        ],
        iNatTaxonIds: [
            351036  // Hydnum albidum
        ]
    },

    // Jelly Ear
    jellyear: {
        scientificNames: [
            'Auricularia americana'
        ],
        commonNames: [
            'Jelly Tree Ear',
            'Wood Ear',
            'Tree Ear'
        ],
        iNatTaxonIds: [
            356394  // Auricularia americana
        ]
    },

    // King Bolete Species - Broken out individually
    boletusSubcaerulescens: {
        scientificNames: [
            'Boletus subcaerulescens'
        ],
        commonNames: [
            'Pine King Bolete',
            'Almost Bluing King Bolete'
        ],
        iNatTaxonIds: [
            194181   // B. subcaerulescens (123 observations)
        ]
    },

    boletusVariipes: {
        scientificNames: [
            'Boletus variipes'
        ],
        commonNames: [
            'Two-colored King Bolete',
            'Variable-footed King Bolete'
        ],
        iNatTaxonIds: [
            194218   // B. variipes (1,195 observations)
        ]
    },

    boletusEdulis: {
        scientificNames: [
            'Boletus edulis',
            'Boletus edulis var. chippewaensis'
        ],
        commonNames: [
            'King Bolete',
            'Porcini',
            'Penny Bun',
            'Chippewa King Bolete'
        ],
        iNatTaxonIds: [
            48701,   // Boletus edulis (26,352 observations)
            543052   // B. chippewaensis (943 observations)
        ]
    },

    boletusAtkinsonii: {
        scientificNames: [
            'Boletus atkinsonii'
        ],
        commonNames: [
            'Atkinson\'s King Bolete',
            'Cracked King Bolete'
        ],
        iNatTaxonIds: [
            350203   // B. atkinsonii (78 observations)
        ]
    },

    boletus_separans: {
        scientificNames: [
            'Boletus separans'
        ],
        commonNames: [
            'Lilac-tinted King Bolete',
            'Lilac Bolete'
        ],
        iNatTaxonIds: [
            350217   // B. separans (1,546 observations)
        ]
    },

    boletusNobilis: {
        scientificNames: [
            'Boletus nobilis'
        ],
        commonNames: [
            'Noble King Bolete',
            'Tall King Bolete'
        ],
        iNatTaxonIds: [
            500013   // B. nobilis (187 observations)
        ]
    },

    boletusChippewaensis: {
        scientificNames: [
            'Boletus chippewaensis'
        ],
        commonNames: [
            'Chippewa King Bolete',
            'Hemlock King Bolete'
        ],
        iNatTaxonIds: [
            543052   // B. chippewaensis (943 observations)
        ]
    },

    // Lion's Mane
    hericium: {
        scientificNames: [
            'Hericium erinaceus'
        ],
        commonNames: [
            'Lion\'s Mane Mushroom',
            'Bearded Tooth Mushroom'
        ],
        iNatTaxonIds: [
            1520823  // Hericium erinaceus (most active ID)
        ]
    },

    // Maitake / Hen of the Woods
    maitake: {
        scientificNames: [
            'Grifola frondosa'
        ],
        commonNames: [
            'Hen of the Woods',
            'Maitake'
        ],
        iNatTaxonIds: [
            53714   // Grifola frondosa
        ]
    },

    // Blewit
    blewit: {
        scientificNames: [
            'Lepista nuda',
            'Collybia nuda'  // Current classification
        ],
        commonNames: [
            'Blewit',
            'Wood Blewit'
        ],
        iNatTaxonIds: [
            1525548  // Collybia nuda (current classification)
        ]
    },

    // Oyster Mushroom
    oyster: {
        scientificNames: [
            'Pleurotus ostreatus'
        ],
        commonNames: [
            'Oyster Mushroom'
        ],
        iNatTaxonIds: [
            1196165  // Pleurotus ostreatus (most active ID)
        ]
    },

    // Wine Cap Stropharia
    winecap: {
        scientificNames: [
            'Stropharia rugosoannulata'
        ],
        commonNames: [
            'Wine-cap Stropharia',
            'King Stropharia'
        ],
        iNatTaxonIds: [
            119151  // Stropharia rugosoannulata
        ]
    },

    // Shaggy Mane
    shaggymane: {
        scientificNames: [
            'Coprinus comatus'
        ],
        commonNames: [
            'Shaggy Mane',
            'Lawyer\'s Wig'
        ],
        iNatTaxonIds: [
            47392   // Coprinus comatus
        ]
    },

    // Corrugated-cap Milky
    corrugatedmilky: {
        scientificNames: [
            'Lactifluus corrugis'
        ],
        commonNames: [
            'Corrugated-cap Milky'
        ],
        iNatTaxonIds: [
            351317  // Lactifluus corrugis
        ]
    },

    // Orange Milky
    orangemilky: {
        scientificNames: [
            'Lactifluus hygrophoroides'
        ],
        commonNames: [
            'Hygrophorus Milkcap',
            'Orange Milky'
        ],
        iNatTaxonIds: [
            351320  // Lactifluus hygrophoroides
        ]
    },

    // Tawny Milky
    tawnymilky: {
        scientificNames: [
            'Lactifluus volemus'
        ],
        commonNames: [
            'Weeping Milk Cap',
            'Tawny Milky',
            'Voluminous Milky'
        ],
        iNatTaxonIds: [
            1366740  // Lactifluus volemus (most active ID)
        ]
    }
};

/**
 * Species Mapper class for correlating iNaturalist data with DHHS species
 */
export class SpeciesMapper {
    constructor() {
        this.reverseMapping = this.buildReverseMapping();
        this.taxonIdMapping = this.buildTaxonIdMapping();
    }

    /**
     * Build reverse mapping from scientific names to DHHS species
     */
    buildReverseMapping() {
        const reverse = new Map();
        
        Object.entries(iNatSpeciesMapping).forEach(([dhhlsKey, mapping]) => {
            // Map scientific names
            mapping.scientificNames.forEach(sciName => {
                reverse.set(sciName.toLowerCase(), dhhlsKey);
            });
            
            // Map common names
            mapping.commonNames.forEach(commonName => {
                reverse.set(commonName.toLowerCase(), dhhlsKey);
            });
        });
        
        return reverse;
    }

    /**
     * Build mapping from iNaturalist taxon IDs to DHHS species
     */
    buildTaxonIdMapping() {
        const mapping = new Map();
        
        Object.entries(iNatSpeciesMapping).forEach(([dhhlsKey, data]) => {
            data.iNatTaxonIds.forEach(taxonId => {
                mapping.set(taxonId, dhhlsKey);
            });
        });
        
        return mapping;
    }

    /**
     * Map iNaturalist observation to DHHS species
     */
    mapObservationToSpecies(observation) {
        if (!observation.taxon) {
            return null;
        }

        // Try mapping by taxon ID first (most reliable)
        const speciesByTaxonId = this.taxonIdMapping.get(observation.taxon.id);
        if (speciesByTaxonId) {
            return {
                dhhlsSpecies: speciesByTaxonId,
                confidence: 'high',
                matchMethod: 'taxon_id',
                matchedValue: observation.taxon.id
            };
        }

        // Try mapping by scientific name
        if (observation.taxon.name) {
            const speciesByScientific = this.reverseMapping.get(observation.taxon.name.toLowerCase());
            if (speciesByScientific) {
                return {
                    dhhlsSpecies: speciesByScientific,
                    confidence: 'high',
                    matchMethod: 'scientific_name',
                    matchedValue: observation.taxon.name
                };
            }
        }

        // Try mapping by common name
        if (observation.taxon.preferred_common_name) {
            const speciesByCommon = this.reverseMapping.get(observation.taxon.preferred_common_name.toLowerCase());
            if (speciesByCommon) {
                return {
                    dhhlsSpecies: speciesByCommon,
                    confidence: 'medium',
                    matchMethod: 'common_name', 
                    matchedValue: observation.taxon.preferred_common_name
                };
            }
        }

        // Check for exact genus matches only (more strict)
        const genusName = observation.taxon.name ? observation.taxon.name.split(' ')[0] : '';
        if (genusName && genusName.length > 3) { // Avoid matching very short genus names
            for (const [dhhlsKey, mapping] of Object.entries(iNatSpeciesMapping)) {
                const hasExactGenusMatch = mapping.scientificNames.some(name => {
                    const mappingGenus = name.split(' ')[0];
                    return mappingGenus.toLowerCase() === genusName.toLowerCase();
                });
                
                if (hasExactGenusMatch) {
                    return {
                        dhhlsSpecies: dhhlsKey,
                        confidence: 'low',
                        matchMethod: 'genus_match',
                        matchedValue: genusName
                    };
                }
            }
        }

        return null; // No match found
    }

    /**
     * Get all possible iNaturalist names for a DHHS species
     */
    getINaturalistNamesForSpecies(dhhlsKey) {
        const mapping = iNatSpeciesMapping[dhhlsKey];
        if (!mapping) {
            return null;
        }

        return {
            scientificNames: mapping.scientificNames,
            commonNames: mapping.commonNames,
            taxonIds: mapping.iNatTaxonIds
        };
    }

    /**
     * Filter observations by DHHS species 
     */
    filterObservationsBySpecies(observations, dhhlsSpecies) {
        console.log(`🔍 Filtering ${observations.length} observations for species: ${dhhlsSpecies}`);
        
        const mapped = observations
            .map(obs => ({
                observation: obs,
                mapping: this.mapObservationToSpecies(obs)
            }));
        
        // Debug: Show mapping attempts
        const mappingAttempts = mapped.slice(0, 5).map(item => ({
            taxonName: item.observation.taxon?.name,
            taxonId: item.observation.taxon?.id,
            mappingResult: item.mapping
        }));
        console.log(`🧬 Sample mapping attempts:`, mappingAttempts);
        
        const filtered = mapped.filter(item => item.mapping && item.mapping.dhhlsSpecies === dhhlsSpecies);
        
        // Debug: Show what was actually matched
        if (filtered.length > 0) {
            const matchedDetails = filtered.map(item => ({
                taxonName: item.observation.taxon?.name,
                matchMethod: item.mapping.matchMethod,
                matchedValue: item.mapping.matchedValue,
                confidence: item.mapping.confidence
            }));
            console.log(`🎯 Actually matched observations:`, matchedDetails);
        }
        
        const result = filtered.map(item => ({
            ...item.observation,
            dhhlsMapping: item.mapping
        }));
            
        console.log(`✅ Successfully mapped ${result.length} observations to ${dhhlsSpecies}`);
        return result;
    }

    /**
     * Group observations by DHHS species
     */
    groupObservationsByDHHLSSpecies(observations) {
        const grouped = {};
        const unmapped = [];

        observations.forEach(obs => {
            const mapping = this.mapObservationToSpecies(obs);
            
            if (mapping) {
                const species = mapping.dhhlsSpecies;
                if (!grouped[species]) {
                    grouped[species] = [];
                }
                grouped[species].push({
                    ...obs,
                    dhhlsMapping: mapping
                });
            } else {
                unmapped.push(obs);
            }
        });

        return {
            mapped: grouped,
            unmapped: unmapped,
            mappingStats: {
                totalObservations: observations.length,
                mappedObservations: observations.length - unmapped.length,
                unmappedObservations: unmapped.length,
                mappedSpecies: Object.keys(grouped).length
            }
        };
    }

    /**
     * Get mapping statistics
     */
    getMappingStats() {
        const totalDHHLSSpecies = Object.keys(iNatSpeciesMapping).length;
        const totalScientificNames = Object.values(iNatSpeciesMapping)
            .reduce((sum, mapping) => sum + mapping.scientificNames.length, 0);
        const totalCommonNames = Object.values(iNatSpeciesMapping)
            .reduce((sum, mapping) => sum + mapping.commonNames.length, 0);
        const totalTaxonIds = Object.values(iNatSpeciesMapping)
            .reduce((sum, mapping) => sum + mapping.iNatTaxonIds.length, 0);

        return {
            dhhlsSpeciesCount: totalDHHLSSpecies,
            scientificNamesCount: totalScientificNames,
            commonNamesCount: totalCommonNames,
            taxonIdsCount: totalTaxonIds,
            reverseMappingSize: this.reverseMapping.size,
            taxonIdMappingSize: this.taxonIdMapping.size
        };
    }
}

// Create global instance
export const speciesMapper = new SpeciesMapper();

// Export for debugging
if (typeof window !== 'undefined') {
    window.speciesMapper = speciesMapper;
    window.iNatSpeciesMapping = iNatSpeciesMapping;
}