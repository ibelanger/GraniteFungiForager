// species.js - Species info card and data

// ENHANCED Species Data - Complete with ALL DHHS Tier 1 Species
// Updated August 2025 - Aligned with DHHS February 2024 Official List
export const speciesData = {
    morels: {
        name: 'Morels (Morchella americana, M. angusticeps, M. elata, M. punctipes)',
        tempRange: [50, 70],
        moistureMin: 1.0,
        seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0 },
        hostTrees: ['ash', 'elm', 'apple', 'tulip poplar'],
        microhabitat: 'old orchards, burned areas, river bottoms, ash groves',
        soilPreference: 'rich, well-drained, slightly alkaline',
        identificationNotes: {
            'Cap': 'Honeycomb-like pitted surface, hollow stem',
            'Attachment': 'Cap attached to stem at base',
            'Season': 'Spring only - April through May',
            'Habitat': 'Around dying trees, especially ash and elm'
        },
        regions: {
            'Great North Woods': 0.6,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.8,
            'Merrimack Valley': 0.9,
            'Lakes Region': 0.7,
            'Monadnock Region': 0.8,
            'Seacoast': 0.6
        }
    },
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
            'Great North Woods': 0.2,
            'White Mountains': 0.25,
            'Dartmouth-Sunapee': 0.4,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.4,
            'Monadnock Region': 0.6,
            'Seacoast': 0.25
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
            'Great North Woods': 0.3,
            'White Mountains': 0.45,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.7,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.8,
            'Seacoast': 0.4
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
            'Great North Woods': 0.4,
            'White Mountains': 0.55,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.45,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.5,
            'Seacoast': 0.25
        }
    },
    chanterelles: {
        name: 'Chanterelles (C. cinnabarinus, C. flavus, C. lateritius, C. cibarius group)',
        alias: 'goldenchanterelle',
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
            'Great North Woods': 0.7,
            'White Mountains': 0.8,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.7,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.6,
            'Seacoast': 0.35
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
            'Great North Woods': 0.6,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.4,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.4,
            'Seacoast': 0.25
        }
    },
    greenrussula: {
        name: 'Green Quilted Russula (Russula parvoviresens, R. crustosa)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0 },
        hostTrees: ['oak', 'beech', 'hardwood'],
        microhabitat: 'hardwood forests, especially with oak and beech',
        soilPreference: 'rich, well-drained hardwood forest soils',
        identificationNotes: {
            'Cap': 'Green with quilted/areolate (cracked) surface pattern',
            'Gills': 'White, brittle, break like chalk',
            'Taste': 'Mild - these species are edible (unlike many Russulas)',
            'Surface': 'Distinctive cracked, quilted appearance on cap'
        },
        regions: {
            'Great North Woods': 0.6,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.55,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.6,
            'Seacoast': 0.45
        }
    },
    sweettooth: {
        name: 'Sweet Tooth (Hydnum repandum group - subgenus Hydnum)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['hardwood', 'mixed'],
        microhabitat: 'hardwood and mixed forests',
        soilPreference: 'rich, well-drained forest soils',
        identificationNotes: {
            'Size': 'Large - often 4 to 6 inches across',
            'Color': 'Light buff color, cream to pale orange',
            'Cap': 'Lacks central depression, teeth slightly decurrent',
            'Stem': 'Generally off-center, larger toward base',
            'Species': 'H. repandum, H. subolympicum (most common in NH)'
        },
        regions: {
            'Great North Woods': 0.7,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.55,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.6,
            'Seacoast': 0.45
        }
    },
    depressedhedgehog: {
        name: 'Depressed Hedgehog (Hydnum umbilicatum group - subgenus Rufescentia)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['hardwood', 'mixed'],
        microhabitat: 'hardwood and mixed forests',
        soilPreference: 'rich, well-drained forest soils',
        identificationNotes: {
            'Size': 'Small - usually less than 2 inches across',
            'Color': 'Darker, more orange color than Sweet Tooth',
            'Cap': 'Generally has dimple near center',
            'Stem': 'Often centrally attached, does not expand downward',
            'Species': 'H. umbilicatum, H. subconnatum, H. cuspidatum'
        },
        regions: {
            'Great North Woods': 0.6,
            'White Mountains': 0.6,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.5,
            'Seacoast': 0.4
        }
    },
    whitehedgehog: {
        name: 'White Hedgehog (Hydnum albidum group - subgenus Alba)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['hardwood', 'mixed'],
        microhabitat: 'hardwood and mixed forests',
        soilPreference: 'rich, well-drained forest soils',
        identificationNotes: {
            'Color': 'White to pale cream - distinguishing feature',
            'Size': 'Small to medium, generally less than 3 inches',
            'Staining1': 'H. alboaurantiacum stains bright orange quickly',
            'Staining2': 'H. albidum stains slowly orange',
            'Staining3': 'H. albomagnum barely stains after an hour'
        },
        regions: {
            'Great North Woods': 0.5,
            'White Mountains': 0.5,
            'Dartmouth-Sunapee': 0.4,
            'Merrimack Valley': 0.4,
            'Lakes Region': 0.4,
            'Monadnock Region': 0.4,
            'Seacoast': 0.3
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
            'Great North Woods': 0.3,
            'White Mountains': 0.4,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.5,
            'Seacoast': 0.6
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
            'Stipe': 'Thick, often with reticulation (netting)',
            'Species': 'B. edulis, B. atkinsonii, B. chippewaensis, B. nobilis, B. separans, B. subcaerulescens, B. variipes'
        },
        regions: {
            'Great North Woods': 0.7,
            'White Mountains': 0.8,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.55,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.6,
            'Seacoast': 0.45
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
            'Great North Woods': 0.3,
            'White Mountains': 0.4,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.5,
            'Seacoast': 0.5
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
            'Great North Woods': 0.3,
            'White Mountains': 0.4,
            'Dartmouth-Sunapee': 0.5,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.5,
            'Seacoast': 0.5
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
            'Great North Woods': 0.2,
            'White Mountains': 0.3,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.6,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.8,
            'Seacoast': 0.45
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
            'Great North Woods': 0.2,
            'White Mountains': 0.3,
            'Dartmouth-Sunapee': 0.4,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.5,
            'Seacoast': 0.5
        }
    },
    oyster: {
        name: 'Oyster Mushroom (Pleurotus ostreatus, P. populinus, P. pulmonarius)',
        tempRange: [40, 75],
        moistureMin: 1.0,
        seasonMultiplier: { spring: 0.6, summer: 0.4, fall: 0.8, winter: 1.0 },
        hostTrees: ['hardwood', 'dying trees', 'logs'],
        microhabitat: 'dead and dying hardwood trees, logs, stumps',
        soilPreference: 'grows on wood, not soil',
        identificationNotes: {
            'Shape': 'Fan or oyster-shaped, no stem or short lateral stem',
            'Gills': 'White, running down stem',
            'Habitat': 'Always on wood - dead trees, logs, stumps',
            'Season': 'Year-round, peak fall/winter'
        },
        regions: {
            'Great North Woods': 0.7,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.8,
            'Merrimack Valley': 0.8,
            'Lakes Region': 0.7,
            'Monadnock Region': 0.8,
            'Seacoast': 0.8
        }
    },
    matsutake: {
        name: 'Matsutake (Tricholoma magnivelare)',
        tempRange: [45, 65],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.3, fall: 1.0, winter: 0.0 },
        hostTrees: ['pine', 'hemlock', 'spruce'],
        microhabitat: 'under conifers in sandy, well-drained soils',
        soilPreference: 'sandy, acidic, well-drained conifer duff',
        identificationNotes: {
            'Smell': 'Distinctive spicy, cinnamon-like aroma',
            'Cap': 'White to brown, often with soil debris',
            'Gills': 'White, attached, often torn',
            'Habitat': 'Buried in conifer duff, often only cap visible'
        },
        regions: {
            'Great North Woods': 0.8,
            'White Mountains': 0.9,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.4,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.5,
            'Seacoast': 0.3
        }
    },
    winecap: {
        name: 'Wine Cap / King Stropharia (Stropharia rugosoannulata)',
        tempRange: [55, 80],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.5, summer: 1.0, fall: 0.8, winter: 0.1 },
        hostTrees: ['hardwood chips', 'mulch', 'compost'],
        microhabitat: 'wood chip mulch, gardens, landscaped areas',
        soilPreference: 'rich, organic matter, wood chips',
        identificationNotes: {
            'Cap': 'Wine-red to brown, fading to tan',
            'Ring': 'Large, persistent white ring on stem',
            'Gills': 'Purple-brown to black spores',
            'Habitat': 'Wood chip mulch, especially fresh chips'
        },
        regions: {
            'Great North Woods': 0.3,
            'White Mountains': 0.4,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.8,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.7,
            'Seacoast': 0.9
        }
    },
    shaggymane: {
        name: 'Shaggy Mane (Coprinus comatus)',
        tempRange: [50, 75],
        moistureMin: 1.0,
        seasonMultiplier: { spring: 0.7, summer: 0.6, fall: 1.0, winter: 0.2 },
        hostTrees: ['none - grows in soil'],
        microhabitat: 'lawns, disturbed soil, roadsides, waste areas',
        soilPreference: 'rich, disturbed, often near human activity',
        identificationNotes: {
            'Cap': 'White, shaggy scales, elongated bell shape',
            'Gills': 'White turning black, self-digesting',
            'Timing': 'Must harvest before gills turn black',
            'Habitat': 'Disturbed soil, lawns, urban areas'
        },
        regions: {
            'Great North Woods': 0.4,
            'White Mountains': 0.5,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.8,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.7,
            'Seacoast': 0.8
        }
    },
    corrugatedmilky: {
        name: 'Corrugated-cap Milky (Lactifluus corrugis)',
        tempRange: [60, 80],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0, winter: 0.1 },
        hostTrees: ['hardwood', 'oak', 'hickory'],
        microhabitat: 'hardwood forests, especially oak-hickory',
        soilPreference: 'rich, well-drained hardwood forest soils',
        identificationNotes: {
            'Cap': 'Orange-brown with corrugated (wrinkled) surface',
            'Milk': 'White latex that does not change color',
            'Gills': 'Close, white to cream, stain brown when bruised',
            'Habitat': 'Always associated with hardwood trees'
        },
        regions: {
            'Great North Woods': 0.4,
            'White Mountains': 0.5,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.8,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.8,
            'Seacoast': 0.7
        }
    },
    orangemilky: {
        name: 'Orange Milky (Lactifluus hygrophoroides)',
        tempRange: [60, 80],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0, winter: 0.1 },
        hostTrees: ['hardwood', 'oak', 'pine'],
        microhabitat: 'hardwood and mixed forests',
        soilPreference: 'rich, well-drained forest soils',
        identificationNotes: {
            'Cap': 'Orange to orange-brown, smooth',
            'Milk': 'White latex that does not change color',
            'Gills': 'White, widely spaced, some forked',
            'Bruising': 'Cap and stem bruise brown when handled'
        },
        regions: {
            'Great North Woods': 0.4,
            'White Mountains': 0.5,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.7,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.7,
            'Seacoast': 0.6
        }
    },
    tawnymilky: {
        name: 'Tawny or Voluminous Milky (Lactifluus volemus)',
        tempRange: [60, 80],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0, winter: 0.1 },
        hostTrees: ['hardwood', 'oak', 'beech'],
        microhabitat: 'hardwood forests, especially oak-beech',
        soilPreference: 'rich, well-drained hardwood forest soils',
        identificationNotes: {
            'Cap': 'Tawny orange-brown, velvety when young',
            'Milk': 'Abundant white latex that dries yellowish',
            'Smell': 'Distinctive fishy or seafood odor',
            'Gills': 'Close, cream colored, stain brown from latex'
        },
        regions: {
            'Great North Woods': 0.5,
            'White Mountains': 0.6,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.8,
            'Lakes Region': 0.7,
            'Monadnock Region': 0.8,
            'Seacoast': 0.7
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

/**
 * Populate species dropdown with all available species
 * @param {string} selectId - ID of the select element
 * @param {string} defaultSpecies - Default species to select
 */
export function populateSpeciesDropdown(selectId = 'species-select', defaultSpecies = 'chanterelles') {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.warn(`Species dropdown element ${selectId} not found`);
        return;
    }
    
    // Clear existing options
    selectElement.innerHTML = '';
    
    // Create options from speciesData, sorted alphabetically by common name
    const speciesOptions = Object.entries(speciesData)
        .sort(([,a], [,b]) => {
            // Extract common name (part before parentheses)
            const nameA = a.name.split('(')[0].trim();
            const nameB = b.name.split('(')[0].trim();
            return nameA.localeCompare(nameB);
        })
        .map(([key, species]) => `<option value="${key}">${species.name}</option>`)
        .join('');
    
    selectElement.innerHTML = speciesOptions;
    
    // Set default selection if species exists
    if (speciesData[defaultSpecies]) {
        selectElement.value = defaultSpecies;
    } else {
        // Fallback to first available species
        const firstKey = Object.keys(speciesData)[0];
        if (firstKey) {
            selectElement.value = firstKey;
            console.warn(`Default species '${defaultSpecies}' not found, using '${firstKey}'`);
        }
    }
    
    console.log(`✅ Species dropdown populated with ${Object.keys(speciesData).length} species`);
}
