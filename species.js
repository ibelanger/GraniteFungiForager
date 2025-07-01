// species.js - Species info card and data

// ENHANCED Species Data - Complete with ALL DHHS Tier 1 Species
export const speciesData = {
    beefsteak: {
        name: 'Beefsteak Polypore (Fistulina hepatica)',
        tempRange: [60, 80],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.7, fall: 1.0 },
        hostTrees: ['oak', 'chestnut'],
        microhabitat: 'wounds or bases of living oaks',
        soilPreference: 'well-drained, rich forest soils',
        identificationNotes: {
            'Texture': 'Meaty, juicy, reddish flesh',
            'Pores': 'Distinct, large pores on underside',
            'Color': 'Deep red to pink, beef-like appearance'
        },
        regions: {
            'Coos County': 0.2,
            'Grafton County': 0.3,
            'Carroll County': 0.2,
            'Sullivan County': 0.4,
            'Merrimack County': 0.5,
            'Belknap County': 0.4,
            'Cheshire County': 0.6,
            'Hillsborough County': 0.5,
            'Strafford County': 0.3,
            'Rockingham County': 0.2
        }
    },
    blacktrumpets: {
        name: 'Black Trumpet (Craterellus fallax/cornucopioides)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['oak', 'beech', 'maple'],
        microhabitat: 'mossy hardwood slopes, stream banks',
        soilPreference: 'moist, rich, well-drained',
        identificationNotes: {
            'Shape': 'Trumpet/funnel-shaped, thin flesh',
            'Color': 'Dark gray to black',
            'Spore Print': 'White to pale yellow'
        },
        regions: {
            'Coos County': 0.3,
            'Grafton County': 0.5,
            'Carroll County': 0.4,
            'Sullivan County': 0.7,
            'Merrimack County': 0.7,
            'Belknap County': 0.6,
            'Cheshire County': 0.8,
            'Hillsborough County': 0.7,
            'Strafford County': 0.5,
            'Rockingham County': 0.3
        }
    },
    cauliflower: {
        name: 'Cauliflower Mushroom (Sparassis spathulata/herbstii)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.6, fall: 1.0 },
        hostTrees: ['pine', 'hemlock'],
        microhabitat: 'base of conifers, especially pine stumps',
        soilPreference: 'acidic, sandy soils',
        identificationNotes: {
            'Shape': 'Large, ruffled, cauliflower-like',
            'Color': 'Cream to pale yellow',
            'Texture': 'Brittle, easily broken'
        },
        regions: {
            'Coos County': 0.4,
            'Grafton County': 0.5,
            'Carroll County': 0.6,
            'Sullivan County': 0.5,
            'Merrimack County': 0.5,
            'Belknap County': 0.6,
            'Cheshire County': 0.5,
            'Hillsborough County': 0.4,
            'Strafford County': 0.3,
            'Rockingham County': 0.2
        }
    },
    goldenchanterelle: {
        name: 'Golden Chanterelle (Cantharellus cibarius/flavus)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 0.8, fall: 1.0 },
        hostTrees: ['oak', 'beech', 'birch', 'hemlock'],
        microhabitat: 'mossy hardwood/conifer forests, stream edges',
        soilPreference: 'moist, well-drained, mossy',
        identificationNotes: {
            'Gills': 'False gills, blunt ridges',
            'Color': 'Bright yellow to gold',
            'Smell': 'Fruity, apricot-like aroma'
        },
        regions: {
            'Coos County': 0.7,
            'Grafton County': 0.8,
            'Carroll County': 0.8,
            'Sullivan County': 0.7,
            'Merrimack County': 0.7,
            'Belknap County': 0.6,
            'Cheshire County': 0.6,
            'Hillsborough County': 0.5,
            'Strafford County': 0.4,
            'Rockingham County': 0.3
        }
    },
    trumpetchanterelle: {
        name: 'Trumpet Chanterelle (Craterellus tubaeformis)',
        tempRange: [50, 70],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['conifer', 'birch'],
        microhabitat: 'mossy conifer forests, bog edges',
        soilPreference: 'moist, mossy, acidic',
        identificationNotes: {
            'Shape': 'Small, trumpet-shaped',
            'Color': 'Gray-brown cap, yellow stem',
            'Gills': 'Blunt, widely spaced ridges'
        },
        regions: {
            'Coos County': 0.6,
            'Grafton County': 0.7,
            'Carroll County': 0.7,
            'Sullivan County': 0.5,
            'Merrimack County': 0.5,
            'Belknap County': 0.5,
            'Cheshire County': 0.4,
            'Hillsborough County': 0.3,
            'Strafford County': 0.3,
            'Rockingham County': 0.2
        }
    },
    russula: {
        name: 'Russula (Russula spp.)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0 },
        hostTrees: ['oak', 'beech', 'birch', 'conifer'],
        microhabitat: 'mixed hardwood/conifer forests',
        soilPreference: 'varied, well-drained',
        identificationNotes: {
            'Cap': 'Brightly colored, brittle',
            'Gills': 'White, attached',
            'Taste': 'Mild to acrid, some edible, some toxic'
        },
        regions: {
            'Coos County': 0.6,
            'Grafton County': 0.7,
            'Carroll County': 0.7,
            'Sullivan County': 0.6,
            'Merrimack County': 0.6,
            'Belknap County': 0.6,
            'Cheshire County': 0.6,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.4
        }
    },
    hedgehog: {
        name: 'Hedgehog Mushroom (Hydnum repandum/umbilicatum)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['beech', 'oak', 'conifer'],
        microhabitat: 'mossy hardwood/conifer forests',
        soilPreference: 'moist, mossy, well-drained',
        identificationNotes: {
            'Spines': 'Teeth/spines under cap',
            'Color': 'Pale orange to tan',
            'Texture': 'Firm, brittle'
        },
        regions: {
            'Coos County': 0.7,
            'Grafton County': 0.7,
            'Carroll County': 0.7,
            'Sullivan County': 0.6,
            'Merrimack County': 0.6,
            'Belknap County': 0.6,
            'Cheshire County': 0.6,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.4
        }
    },
    jellyear: {
        name: 'Jelly Ear (Auricularia americana/auricula-judae)',
        tempRange: [45, 70],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.5, summer: 0.7, fall: 1.0 },
        hostTrees: ['elder', 'hardwood'],
        microhabitat: 'dead elder, hardwood logs',
        soilPreference: 'moist, near water',
        identificationNotes: {
            'Texture': 'Jelly-like, rubbery',
            'Color': 'Brown, ear-shaped',
            'Habitat': 'On dead wood, especially elder'
        },
        regions: {
            'Coos County': 0.3,
            'Grafton County': 0.4,
            'Carroll County': 0.4,
            'Sullivan County': 0.5,
            'Merrimack County': 0.5,
            'Belknap County': 0.5,
            'Cheshire County': 0.5,
            'Hillsborough County': 0.5,
            'Strafford County': 0.6,
            'Rockingham County': 0.6
        }
    },
    kingbolete: {
        name: 'King Bolete (Boletus edulis group)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['spruce', 'pine', 'hemlock', 'oak'],
        microhabitat: 'mixed conifer/hardwood forests',
        soilPreference: 'well-drained, rich',
        identificationNotes: {
            'Cap': 'Brown, sticky when wet',
            'Pores': 'White to yellow, not gills',
            'Stipe': 'Thick, reticulated (netted)'
        },
        regions: {
            'Coos County': 0.7,
            'Grafton County': 0.8,
            'Carroll County': 0.8,
            'Sullivan County': 0.6,
            'Merrimack County': 0.6,
            'Belknap County': 0.6,
            'Cheshire County': 0.6,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.4
        }
    },
    hericium: {
        name: 'Lion’s Mane (Hericium erinaceus)',
        tempRange: [50, 70],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.7, fall: 1.0 },
        hostTrees: ['beech', 'oak', 'maple'],
        microhabitat: 'wounds, cavities, or dead areas of living hardwood trees',
        soilPreference: 'rich, moist, decaying wood',
        identificationNotes: {
            'Spines': 'Long, white, icicle-like',
            'Habitat': 'On dead or dying hardwoods',
            'Texture': 'Soft, watery when fresh'
        },
        regions: {
            'Coos County': 0.3,
            'Grafton County': 0.4,
            'Carroll County': 0.4,
            'Sullivan County': 0.5,
            'Merrimack County': 0.5,
            'Belknap County': 0.5,
            'Cheshire County': 0.5,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.5
        }
    },
    lobster: {
        name: 'Lobster Mushroom (Hypomyces lactifluorum)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0 },
        hostTrees: ['hardwood', 'conifer'],
        microhabitat: 'parasitized Lactarius/Russula species',
        soilPreference: 'acidic forest soils where host mushrooms grow',
        identificationNotes: {
            'Texture': 'Firm, dense flesh unlike typical mushrooms',
            'Color': 'Bright orange-red exterior',
            'Host': 'Always on Lactarius or Russula host'
        },
        regions: {
            'Coos County': 0.3,
            'Grafton County': 0.4,
            'Carroll County': 0.4,
            'Sullivan County': 0.5,
            'Merrimack County': 0.5,
            'Belknap County': 0.5,
            'Cheshire County': 0.5,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.5
        }
    },
    maitake: {
        name: 'Maitake / Hen of the Woods (Grifola frondosa)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.2, summer: 0.4, fall: 1.0 },
        hostTrees: ['oak (primarily)'],
        microhabitat: 'base of mature oak trees, on roots',
        soilPreference: 'rich, well-drained soils around oak trees',
        identificationNotes: {
            'Habitat': 'Always at base of oaks, can return to same spot annually',
            'Shape': 'Large, clustered, frond-like',
            'Color': 'Gray-brown to tan'
        },
        regions: {
            'Coos County': 0.2,
            'Grafton County': 0.3,
            'Carroll County': 0.3,
            'Sullivan County': 0.6,
            'Merrimack County': 0.7,
            'Belknap County': 0.6,
            'Cheshire County': 0.8,
            'Hillsborough County': 0.7,
            'Strafford County': 0.5,
            'Rockingham County': 0.4
        }
    },
    blewit: {
        name: 'Blewit (Lepista nuda)',
        tempRange: [45, 65],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.4, fall: 1.0 },
        hostTrees: ['leaf litter decomposers'],
        microhabitat: 'decomposing leaves, compost piles, rich organic matter',
        soilPreference: 'rich organic matter with neutral to slightly alkaline pH',
        identificationNotes: {
            'Habitat': 'In leaf litter, compost, and rich organic soils',
            'Color': 'Lilac to purple cap and gills',
            'Spore Print': 'Pale pink'
        },
        regions: {
            'Coos County': 0.2,
            'Grafton County': 0.3,
            'Carroll County': 0.3,
            'Sullivan County': 0.4,
            'Merrimack County': 0.5,
            'Belknap County': 0.5,
            'Cheshire County': 0.5,
            'Hillsborough County': 0.5,
            'Strafford County': 0.5,
            'Rockingham County': 0.5
        }
    }
};

// Update species info card
export function updateSpeciesDisplay(selectedSpecies, speciesData) {
    const speciesCard = document.getElementById('species-info-card');
    const cardTitle = document.getElementById('species-card-title');
    const basicInfo = document.getElementById('species-basic-info');
    const habitat = document.getElementById('species-habitat');
    const timing = document.getElementById('species-timing');
    const identification = document.getElementById('species-identification');

    if (!selectedSpecies || selectedSpecies === 'all') {
        speciesCard.style.display = 'none';
        return;
    }

    const species = speciesData[selectedSpecies];
    if (!species) {
        speciesCard.style.display = 'none';
        return;
    }

    // Show the card and update title
    speciesCard.style.display = 'block';
    cardTitle.textContent = species.name;

    // Basic Info
    let basicHtml = '';
    if (species.tempRange) {
        basicHtml += `<strong>Temperature Range:</strong> ${species.tempRange[0]}-${species.tempRange[1]}°F<br>`;
    }
    if (species.moistureMin) {
        basicHtml += `<strong>Minimum Rainfall:</strong> ${species.moistureMin}" (past 7-10 days)<br>`;
    }
    if (species.soilPreference) {
        basicHtml += `<strong>Soil Preference:</strong> ${species.soilPreference}<br>`;
    }
    basicInfo.innerHTML = basicHtml;

    // Habitat Information
    let habitatHtml = '<strong>Habitat & Host Trees:</strong><br>';
    if (species.hostTrees) {
        habitatHtml += `<em>Host Trees:</em> ${species.hostTrees.join(', ')}<br>`;
    }
    if (species.microhabitat) {
        habitatHtml += `<em>Microhabitat:</em> ${species.microhabitat}<br>`;
    }
    if (species.preferredSites) {
        habitatHtml += `<em>Preferred Sites:</em> ${species.preferredSites.join(', ')}<br>`;
    }
    habitat.innerHTML = habitatHtml;

    // Timing Information
    let timingHtml = '<strong>Seasonal Information:</strong><br>';
    if (species.seasonMultiplier) {
        const seasons = Object.entries(species.seasonMultiplier)
            .map(([season, mult]) => `${season}: ${mult}`)
            .join(', ');
        timingHtml += `<em>Seasonal Priority:</em> ${seasons}<br>`;
    }
    if (species.elevationTiming) {
        timingHtml += `<em>Elevation Timing:</em><br>`;
        Object.entries(species.elevationTiming).forEach(([elevation, timing]) => {
            timingHtml += `&nbsp;&nbsp;${elevation} elevation: ${timing}<br>`;
        });
    }
    timing.innerHTML = timingHtml;

    // Identification Notes
    let idHtml = '';
    if (species.identificationNotes) {
        idHtml += '<strong>Identification Notes:</strong><br>';
        Object.entries(species.identificationNotes).forEach(([key, note]) => {
            idHtml += `<em>${key}:</em> ${note}<br>`;
        });
    }
    if (species.subgenusDetails) {
        idHtml += '<strong>Subgenus Groups:</strong><br>';
        Object.entries(species.subgenusDetails).forEach(([subgenus, note]) => {
            idHtml += `<em>${subgenus}:</em> ${note}<br>`;
        });
    }
    if (species.species) {
        idHtml += '<strong>Species Details:</strong><br>';
        Object.entries(species.species).forEach(([speciesName, note]) => {
            idHtml += `<em>${speciesName}:</em> ${note}<br>`;
        });
    }
    identification.innerHTML = idHtml;
}
