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
        name: 'Sweet Tooth (Hydnum subgenus Hydnum - H. subolympicum group)',
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
            'Primary_Species': 'H. subolympicum (not H. repandum - European species)',
            'Other_Species': 'H. washingtonium, H. vagabundum',
            'Research_Note': 'DNA studies show H. repandum does not occur in North America'
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
        name: 'Depressed Hedgehog (Hydnum subgenus Rufescentia - 9 eastern species)',
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
            'Confirmed_NH_Species': 'H. umbilicatum, H. subconnatum, H. cuspidatum',
            'Key_Difference': 'Teeth are NOT decurrent (vs. Sweet Tooth)',
            'Research_Note': 'H. rufescens is European - 9 species documented in eastern US'
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
        name: 'White Hedgehog (Hydnum subgenus Alba - 3 eastern species)',
        tempRange: [55, 75],
        moistureMin: 1.5,
        seasonMultiplier: { spring: 0.1, summer: 0.7, fall: 1.0 },
        hostTrees: ['hardwood', 'mixed'],
        microhabitat: 'hardwood and mixed forests',
        soilPreference: 'rich, well-drained forest soils',
        identificationNotes: {
            'Color': 'White to pale cream - distinguishing feature',
            'Size': 'H. albidum/alboaurantiacum: <3 inches, H. albomagnum: 3-4 inches',
            'H_alboaurantiacum': 'Stains bright orange quickly on handling',
            'H_albidum': 'Stains slowly orange over time',
            'H_albomagnum': 'Barely stains after an hour',
            'Research_Source': 'Swenie RA, Baroni TJ, Matheny PB (2018) - DNA-based classification'
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
    // King Bolete Complex - Split into Individual Species
    boletusSubcaerulescens: {
        name: 'Pine King Bolete (Boletus subcaerulescens)',
        tempRange: [50, 70],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 0.8, fall: 1.0 },
        hostTrees: ['pine', 'norway spruce', 'spruce'],
        microhabitat: 'conifer forests, especially pine and Norway spruce plantations',
        soilPreference: 'acidic, well-drained conifer soils',
        identificationNotes: {
            'Cap': 'Bun brown to reddish-brown, smooth to slightly velvety',
            'Pores': 'White when young, becoming yellowish, bruising blue-gray',
            'Stipe': 'White-to-brown reticulation, distinctive bluish-gray bruising',
            'Habitat': 'Specifically with pines and Norway spruce',
            'Bruising': 'Notable bluish-gray color when cut or bruised'
        },
        regions: {
            'Great North Woods': 0.9,  // Excellent conifer habitat
            'White Mountains': 0.8,   // Good mixed conifer forests
            'Dartmouth-Sunapee': 0.6, // Some conifer stands
            'Merrimack Valley': 0.5,  // Limited conifer habitat
            'Lakes Region': 0.7,      // Good conifer areas
            'Monadnock Region': 0.6,  // Some conifer stands
            'Seacoast': 0.4          // Limited conifer habitat
        }
    },
    boletusVariipes: {
        name: 'Two-colored King Bolete (Boletus variipes)',
        tempRange: [60, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.1, summer: 1.0, fall: 0.8 },
        hostTrees: ['oak', 'beech', 'mixed hardwood'],
        microhabitat: 'oak-beech forests, mature hardwood stands',
        soilPreference: 'rich, well-drained hardwood forest soils',
        identificationNotes: {
            'Cap': 'Pale lemon yellow with rusty patches, distinctive two-toned appearance',
            'Pores': 'White to pale yellow, slowly bruising blue',
            'Stipe': 'Grayish stem with white reticulation',
            'Season': 'Peak July through September',
            'Habitat': 'Specifically oak-beech forests'
        },
        regions: {
            'Great North Woods': 0.5,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.8,  // Good oak-beech habitat
            'Merrimack Valley': 0.7,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.9,   // Excellent oak-beech forests
            'Seacoast': 0.6
        }
    },
    boletusEdulis: {
        name: 'King Bolete (Boletus edulis var. chippewaensis)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0 },
        hostTrees: ['spruce', 'fir', 'hemlock', 'conifer'],
        microhabitat: 'mature conifer forests, especially spruce-fir',
        soilPreference: 'acidic, rich conifer forest soils',
        identificationNotes: {
            'Cap': 'Brown to reddish-brown, classic king bolete appearance',
            'Pores': 'White when young, becoming yellow-green with age',
            'Stipe': 'White reticulation on brown background',
            'Spores': 'Olive-brown (vs yellowish in European B. edulis)',
            'Season': 'Summer through fall in conifer forests'
        },
        regions: {
            'Great North Woods': 0.9,
            'White Mountains': 0.9,
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.5,
            'Lakes Region': 0.7,
            'Monadnock Region': 0.6,
            'Seacoast': 0.3
        }
    },
    boletusAtkinsonii: {
        name: 'Atkinson\'s King Bolete (Boletus atkinsonii)',
        tempRange: [55, 75],
        moistureMin: 1.8,
        seasonMultiplier: { spring: 0.2, summer: 0.8, fall: 1.0 },
        hostTrees: ['beech', 'oak', 'mixed deciduous'],
        microhabitat: 'mixed deciduous forests, especially beech-oak associations',
        soilPreference: 'rich, well-drained deciduous forest soils',
        identificationNotes: {
            'Cap': 'Brown with tendency to crack, areolate surface',
            'Pores': 'White to yellow, bruising blue',
            'Stipe': 'Brown reticulation, often extensive',
            'Surface': 'Cap frequently shows cracking pattern',
            'Habitat': 'Mixed deciduous, particularly beech-oak'
        },
        regions: {
            'Great North Woods': 0.6,
            'White Mountains': 0.7,
            'Dartmouth-Sunapee': 0.8,
            'Merrimack Valley': 0.7,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.8,
            'Seacoast': 0.5
        }
    },
    boletus_separans: {
        name: 'Lilac-tinted King Bolete (Boletus separans)',
        tempRange: [55, 75],
        moistureMin: 1.8,
        seasonMultiplier: { spring: 0.2, summer: 0.7, fall: 1.0 },
        hostTrees: ['mixed deciduous', 'oak', 'hickory'],
        microhabitat: 'mixed deciduous forests, oak-hickory associations',
        soilPreference: 'rich, slightly acidic deciduous forest soils',
        identificationNotes: {
            'Cap': 'Brown with subtle lilac or purplish tints',
            'Pores': 'White to pale yellow',
            'Stipe': 'Fine white reticulation, often delicate pattern',
            'Color': 'Distinctive lilac tints distinguish from other species',
            'Reticulation': 'Very fine, lace-like white pattern on stem'
        },
        regions: {
            'Great North Woods': 0.4,
            'White Mountains': 0.6,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.6,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.7,
            'Seacoast': 0.4
        }
    },
    boletusNobilis: {
        name: 'Noble King Bolete (Boletus nobilis)',
        tempRange: [55, 75],
        moistureMin: 2.0,
        seasonMultiplier: { spring: 0.2, summer: 0.7, fall: 1.0 },
        hostTrees: ['mixed deciduous', 'beech', 'maple'],
        microhabitat: 'mixed deciduous forests, rich woodland soils',
        soilPreference: 'very rich, deep deciduous forest soils',
        identificationNotes: {
            'Stature': 'Very tall - stem often 2-3 times cap diameter',
            'Cap': 'Brown, typically smaller relative to tall stem',
            'Pores': 'White to pale yellow',
            'Stipe': 'Minimal reticulation, very tall and stately',
            'Proportions': 'Distinctive tall, elegant stature'
        },
        regions: {
            'Great North Woods': 0.5,
            'White Mountains': 0.6,
            'Dartmouth-Sunapee': 0.7,
            'Merrimack Valley': 0.6,
            'Lakes Region': 0.5,
            'Monadnock Region': 0.7,
            'Seacoast': 0.4
        }
    },
    boletusChippewaensis: {
        name: 'Chippewa King Bolete (Boletus chippewaensis)',
        tempRange: [50, 70],
        moistureMin: 2.2,
        seasonMultiplier: { spring: 0.1, summer: 0.9, fall: 1.0 },
        hostTrees: ['hemlock', 'pine', 'mixed conifer'],
        microhabitat: 'hemlock-dominated forests, cool conifer stands',
        soilPreference: 'moist, acidic, rich conifer soils',
        identificationNotes: {
            'Habitat': 'Strongly associated with hemlock forests',
            'Cap': 'Dark brown to reddish-brown',
            'Pores': 'White when very young, quickly becoming yellow',
            'Stipe': 'Brown reticulation on pale background',
            'Moisture': 'Prefers more moist conditions than other boletes'
        },
        regions: {
            'Great North Woods': 0.8,
            'White Mountains': 0.9,  // Excellent hemlock habitat
            'Dartmouth-Sunapee': 0.6,
            'Merrimack Valley': 0.4,
            'Lakes Region': 0.6,
            'Monadnock Region': 0.5,
            'Seacoast': 0.3
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
 * Populate species dropdown with all available species (alphabetically sorted)
 * @param {string} selectId - ID of the select element
 */
export function populateSpeciesDropdown(selectId = 'species-select') {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.warn(`Species dropdown element ${selectId} not found`);
        return;
    }
    
    // Clear existing options
    selectElement.innerHTML = '';
    
    // Add default "Select one" option at the top
    const defaultOption = '<option value="" disabled selected>-- Select a species --</option>';
    
    // Create options from speciesData, sorted alphabetically by name
    const speciesOptions = Object.entries(speciesData)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([key, species]) => `<option value="${key}">${species.name}</option>`)
        .join('');
    
    selectElement.innerHTML = defaultOption + speciesOptions;
    
    // Leave the default "Select a species" option selected
    // Don't auto-select any specific species
    
    console.log(`✅ Species dropdown populated with ${Object.keys(speciesData).length} species`);
}
