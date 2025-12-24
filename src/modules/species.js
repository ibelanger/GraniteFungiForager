// species.js - Species info card and data

// ENHANCED Species Data - Complete with ALL DHHS Tier 1 Species
// Updated December 2025 - Enhanced with peer-reviewed research data
// Data Sources: MushroomExpert.com, USDA PNW-GTR-576, Mihail 2014, boletes.wpamushroomclub.org
export const speciesData = {
    morels: {
        name: 'Morels (Morchella americana, M. angusticeps, M. elata, M. punctipes)',
        tempRange: [50, 70],
        moistureMin: 1.0,
        seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0 },
        hostTrees: ['ash', 'elm', 'apple', 'tulip poplar'],
        microhabitat: 'old orchards, burned areas, river bottoms, ash groves',
        soilPreference: 'rich, well-drained, slightly alkaline',

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 50,
            max: 60,
            fruitingInitiation: 50,
            fruitingCessation: 62,
            measurementDepth: '2-4 inches',
            sustainedDaysRequired: 5,
            confidence: 'High',
            source: 'Mihail 2014 McIlvainea 23:53-60'
        },
        soilPH: {
            min: 6.0,
            max: 7.5,
            optimal: 6.5,
            nhChallenges: 'NH granite soils often pH <6.0 making state "morel-poor"',
            bestNHAreas: 'Connecticut River valley (less acidic, loamier soils)',
            confidence: 'High'
        },
        precipitationWindow: {
            correlationPeriod: 30,
            significantRainEvent: 0.4,
            correlationType: 'abundance',
            notes: 'Rain in preceding 30 days correlates with abundance; post-rain timing not validated'
        },
        elevationRange: {
            min: 100,
            max: 2500,
            optimal: 1500,
            elevationDelay: '7-10 days per 500-1000 feet'
        },
        hostTreeFrequencies: {
            'American Elm': '35-40%',
            'Ash': '25-30%',
            'Apple': '15-20%',
            'Hickory': '10-15%',
            'Basswood': '5-10%'
        },
        phenologyNH: {
            start: 'mid-April',
            peak: 'mid-May (around Mother\'s Day)',
            end: 'early June',
            blackMorels: 'early to mid-April (M. angusticeps first)',
            yellowMorels: 'early May (M. americana follows)'
        },
        confidenceLevel: 'High',
        safetyRating: 'SAFE (but has toxic lookalikes - see safety notes)',

        identificationNotes: {
            'Cap': 'Honeycomb-like pitted surface, hollow stem',
            'Attachment': 'Cap attached to stem at base',
            'Season': 'Spring only - April through May',
            'Habitat': 'Around dying trees, especially ash and elm',
            'CRITICAL SAFETY': 'MUST cut lengthwise - interior must be COMPLETELY HOLLOW',
            'Safety Check': 'False morels (Gyromitra) are TOXIC - chambered interior, brain-like cap'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 55,
            max: 70,
            optimal: 62,
            cessationThreshold: 60,
            notes: 'Season extends until daytime temps drop below ~60°F consistently',
            confidence: 'Medium',
            source: 'mnforager.com, ediblewildfood.com'
        },
        soilPH: {
            min: 4.5,
            max: 6.5,
            optimal: 5.5,
            notes: 'Prefers moderately acidic; NH granitic soils generally suitable',
            confidence: 'High'
        },
        precipitationWindow: {
            min: 7,
            max: 21,
            typical: 10,
            requirement: 'Deep soaking rain; often found near chanterelle habitat',
            correlation: 'abundance'
        },
        elevationRange: {
            min: 0,
            max: 3500,
            optimal: { min: 200, max: 2000 },
            elevationDelay: '7-10 days per 1000 feet'
        },
        hostTreeFrequencies: {
            'Red Oak': '40-50%',
            'White Oak': '30-40%',
            'Eastern Hemlock': '10-15%',
            'Birch': '5-10%'
        },
        phenologyNH: {
            start: 'Late June - Early July',
            peak: 'August - September',
            end: 'November (or until first hard freeze)',
            persistence: 'Extended season - fruits into late fall',
            coOccurrence: 'Often found with chanterelles, milk caps'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'VERY SAFE (no toxic lookalikes)',
        mossAssociation: 'STRONG',  // Flag for probability calculations

        identificationNotes: {
            'Shape': 'Funnel/trumpet-shaped, hollow, thin flesh',
            'Color': 'Black to dark gray',
            'Spore Print': 'Pale pinkish-orange (NA species)',
            'Gills': 'No true gills',
            'CRITICAL CHALLENGE': 'EXTREME CAMOUFLAGE - black color makes them nearly invisible',
            'Finding Strategy': 'Look for lighter stems, squat to ground level, search mossy areas',
            'Safety': 'NO TOXIC LOOKALIKES - all Craterellus species are edible',
            'Abundance': 'Often fruit in large patches once located - 30-40+ lbs possible'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 54.5,
            max: 72.5,
            fruitingOptimal: 68,
            measurementDepth: '5cm (2 inches)',
            confidence: 'High',
            source: 'Deshaware et al. 2021 Archives of Microbiology; USDA PNW-GTR-576'
        },
        soilPH: {
            min: 4.0,
            max: 6.0,
            optimal: 5.0,
            notes: 'Moderately acidic preferred; NH acidic soils generally suitable',
            confidence: 'High'
        },
        precipitationWindow: {
            min: 7,
            max: 21,
            optimal: 10,
            correlation: 'Precipitation 1 week before positively correlated with productivity',
            requirement: 'Deep soaking rain saturating top several inches - light sprinkle insufficient'
        },
        elevationRange: {
            min: 0,
            max: 4000,
            optimal: 500,
            elevationDelay: '7-14 days per 1000 feet',
            notes: 'Lower elevations (oak) fruit July-Aug; higher (beech-birch) fruit Aug-Oct'
        },
        hostTreeFrequencies: {
            'Oak': '40-50%',
            'Beech': '20-25%',
            'Birch': '10-15%',
            'Hemlock': '10-15%',
            'White Pine': '5-10%'
        },
        phenologyNH: {
            baseElevation: 'Late June - Early July start, July 15 - Aug 31 peak',
            midElevation: 'Mid-July start, August peak',
            highElevation: 'Late July - Early Aug start, Late Aug - Sept peak',
            persistence: '44-90+ days (exceptionally long)',
            forestAge: '10-40 years optimal'
        },
        confidenceLevel: 'High',
        safetyRating: 'SAFE (but has toxic lookalikes - see safety notes)',

        identificationNotes: {
            'Gills': 'FALSE GILLS - blunt forked ridges, NOT easily removed',
            'Color': 'Bright yellow to gold',
            'Smell': 'Fruity, apricot-like aroma',
            'Growth': 'ALWAYS from SOIL, never on wood',
            'Pattern': 'Solitary or scattered, never dense clusters',
            'CRITICAL SAFETY': 'Jack O\'Lanterns are TOXIC - true gills, grow on wood in clusters',
            'Safety Test': 'Pick at "gills" - false gills do not separate easily'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 59,
            max: 75,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 70,
            measurementDepth: '0-8 inches',
            confidence: 'Medium-High',
            source: 'Frontiers in Soil Science - B. edulis complex data'
        },
        soilPH: {
            min: 3.5,
            max: 6.0,
            optimal: 4.5,
            nhNotes: 'Excellent adaptation to NH granite soils (pH 4.5-5.5). Thrives in acidic mossy soils typical of spruce forests.',
            confidence: 'High',
            source: 'Economic Botany cultivation studies'
        },
        precipitationWindow: {
            min: 8,
            max: 14,
            optimal: 10,
            correlationPeriod: 30,
            requirement: 'Heavy, evenly distributed rain followed by autumn showers with temp drop',
            notes: '3 days in sunny weather, 4-5 days in cloudy weather',
            confidence: 'Medium-High'
        },
        elevationRange: {
            min: 500,
            max: 3500,
            optimal: { min: 1000, max: 2500 },
            elevationDelay: '3-4 days per 1000 feet',
            notes: 'Prefers mid-elevation spruce forests in northern New England'
        },
        hostTreeFrequencies: {
            'Spruce (Picea spp.)': '70%',
            'Pine (Pinus spp.)': '20%',
            'Mixed Conifers': '10%',
            specificity: 'Strongly conifer-associated, especially spruce'
        },
        phenologyNH: {
            start: 'Late August',
            peak: 'September - October',
            end: 'Early November (first frost)',
            elevationNote: 'Higher elevations fruit 1-2 weeks earlier in fall',
            triggers: 'Autumn rains + temperature drop'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'EXCELLENT - Choice edible',

        identificationNotes: {
            'Cap': 'Bun brown to reddish-brown, smooth to slightly velvety',
            'Pores': 'White when young, becoming yellowish, bruising blue-gray',
            'Stipe': 'White-to-brown reticulation, distinctive bluish-gray bruising',
            'Habitat': 'Specifically with pines and Norway spruce',
            'Bruising': 'Notable bluish-gray color when cut or bruised',
            'TOXIC LOOKALIKE': 'Boletus huronensis - causes GI distress; distinguishable by blue-staining pores and yellow stem',
            'Key Safety': 'White reticulation on stem, no strong blue staining, conifer association'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 59,
            max: 75,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 86,
            measurementDepth: '0-8 inches',
            confidence: 'Medium',
            source: 'General B. edulis complex cultivation research'
        },
        soilPH: {
            min: 4.0,
            max: 6.0,
            optimal: 5.0,
            nhNotes: 'Excellent adaptation to NH acidic oak-forest soils. Thrives in well-drained, organic-rich hardwood leaf litter.',
            confidence: 'Medium-High'
        },
        precipitationWindow: {
            min: 8,
            max: 14,
            optimal: 11,
            correlationPeriod: 25,
            requirement: 'Summer/early fall rainfall critical; well-drained conditions',
            notes: 'Can emerge during drier periods following earlier rainfall'
        },
        elevationRange: {
            min: 200,
            max: 2500,
            optimal: { min: 500, max: 1500 },
            elevationDelay: '3 days per 1000 feet',
            notes: 'Common in Appalachian foothill oak forests'
        },
        hostTreeFrequencies: {
            'Oak (Quercus spp.)': '60%',
            'Beech (Fagus)': '20%',
            'Aspen (Populus)': '10%',
            'Maple (Acer)': '10%',
            specificity: 'Hardwood specialist, strong oak preference'
        },
        phenologyNH: {
            start: 'Late July',
            peak: 'August - September',
            end: 'October',
            notes: 'Earlier than most king boletes due to oak association and summer fruiting',
            triggers: 'Summer warmth + adequate moisture'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'EXCELLENT - Choice edible',

        identificationNotes: {
            'Cap': 'Pale lemon yellow with rusty patches, distinctive two-toned appearance',
            'Pores': 'White to pale yellow, slowly bruising blue',
            'Stipe': 'Grayish stem with white reticulation',
            'Season': 'Peak July through September',
            'Habitat': 'Specifically oak-beech forests',
            'CRITICAL TOXIC LOOKALIKE': 'Boletus sensibilis - SEVERE GI DISTRESS; stains BLUE/BLACK rapidly (B. variipes does NOT)',
            'Secondary Lookalike': 'Tylopilus felleus (bitter) - dark reticulation on light stem (opposite pattern)',
            'Key Safety': 'NO blue staining upon cutting or bruising'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 59,
            max: 75,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 70,
            measurementDepth: '0-8 inches',
            confidence: 'High',
            source: 'Multiple cultivation studies on B. edulis - most researched species',
            notes: '3 days in sunny weather, 4-5 days in cloudy weather after rain'
        },
        soilPH: {
            min: 3.5,
            max: 6.0,
            optimal: 4.5,
            nhNotes: 'Perfectly adapted to NH granite-derived acidic soils. Prefers siliceous soils.',
            confidence: 'High',
            source: 'Multiple peer-reviewed cultivation and ecology studies'
        },
        precipitationWindow: {
            min: 8,
            max: 14,
            optimal: 10,
            correlationPeriod: 30,
            requirement: 'Heavy, evenly distributed rain (not torrential). Autumn precipitation positively correlated.',
            notes: 'Warm weather rain followed by frequent autumn rain with temperature drop',
            confidence: 'High'
        },
        elevationRange: {
            min: 300,
            max: 3500,
            optimal: { min: 1000, max: 2500 },
            elevationDelay: '3-4 days per 1000 feet',
            notes: 'Higher elevations can fruit in late spring/summer; lower elevations fruit in fall'
        },
        hostTreeFrequencies: {
            'Norway Spruce (Picea abies)': '50% - in NE finds',
            'White Pine (Pinus strobus)': '20%',
            'Balsam Fir (Abies balsamea)': '15%',
            'Oak (Quercus)': '10%',
            'Beech (Fagus)': '5%',
            mycorrhizalRange: 'Broad - Fagaceae, Pinaceae, Betulaceae families'
        },
        phenologyNH: {
            start: 'Late August',
            peak: 'September - October',
            end: 'Mid-November (to first frost)',
            notes: 'Most common in cultivated Norway Spruce stands and mixed spruce-pine forests',
            triggers: 'Autumn rains + temperature drop'
        },
        confidenceLevel: 'High (most researched Boletus species)',
        safetyRating: 'EXCELLENT - Premium edible (porcini)',

        identificationNotes: {
            'Cap': 'Brown to reddish-brown, classic king bolete appearance',
            'Pores': 'White when young, becoming yellow-green with age',
            'Stipe': 'White reticulation on brown background',
            'Spores': 'Olive-brown (vs yellowish in European B. edulis)',
            'Season': 'Summer through fall in conifer forests',
            'TOXIC LOOKALIKE': 'Boletus huronensis - slow blue staining, yellow flesh, yellowish stem with red traces',
            'Secondary Lookalike': 'Tylopilus felleus (bitter bolete) - dark reticulation on light stem (opposite), pinkish pores',
            'Key Safety': 'White net-like reticulation on upper stem, NO blue staining, white flesh'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 64,
            max: 77,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 86,
            measurementDepth: '0-8 inches',
            notes: 'Slightly warmer due to summer fruiting pattern',
            confidence: 'Medium',
            source: 'Inferred from summer fruiting and general bolete ecology'
        },
        soilPH: {
            min: 4.0,
            max: 6.5,
            optimal: 5.0,
            nhNotes: 'Well-suited to NH acidic hardwood forests. Prefers well-drained oak/hickory woodland soils.',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            correlationPeriod: 18,
            requirement: 'Summer rainfall patterns; can fruit during warm, humid periods',
            notes: 'Less dependent on autumn rain patterns than conifer-associated species'
        },
        elevationRange: {
            min: 200,
            max: 2000,
            optimal: { min: 500, max: 1200 },
            elevationDelay: '3 days per 1000 feet',
            notes: 'Prefers lower to mid-elevation oak-hickory forests'
        },
        hostTreeFrequencies: {
            'Red Oak (Quercus rubra)': '40%',
            'Chinkapin Oak (Q. muehlenbergii)': '20%',
            'Ironwood (Ostrya virginiana)': '15%',
            'Beech (Fagus grandifolia)': '15%',
            'Other Oaks': '10%',
            specificity: 'Hardwood specialist, strongly oak-preferring'
        },
        phenologyNH: {
            start: 'June',
            peak: 'July - August',
            end: 'September',
            notes: 'One of the few summer-fruiting king boletes in eastern hardwoods',
            triggers: 'Summer warmth + adequate rainfall'
        },
        confidenceLevel: 'Medium',
        safetyRating: 'EXCELLENT - Choice edible',

        identificationNotes: {
            'Cap': 'Brown with tendency to crack, areolate surface',
            'Pores': 'White to yellow, bruising blue',
            'Stipe': 'Brown reticulation, often extensive',
            'Surface': 'Cap frequently shows cracking pattern',
            'Habitat': 'Mixed deciduous, particularly beech-oak',
            'TOXIC LOOKALIKE': 'Boletus sensibilis - stains blue/black rapidly (B. atkinsonii does NOT)',
            'Key Safety': 'Wrinkled cap, prominent white reticulation, purple ammonia reaction on cap, NO rapid blue staining'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 64,
            max: 77,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 86,
            measurementDepth: '0-8 inches',
            confidence: 'Medium',
            source: 'General bolete ecology data'
        },
        soilPH: {
            min: 4.0,
            max: 6.0,
            optimal: 5.0,
            nhNotes: 'Excellent adaptation to NH acidic oak forests. Thrives in well-drained, organic-rich hardwood leaf litter.',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            correlationPeriod: 25,
            requirement: 'Summer-fall rainfall; prefers consistent moderate moisture',
            notes: 'Can fruit throughout extended wet periods'
        },
        elevationRange: {
            min: 200,
            max: 2500,
            optimal: { min: 400, max: 1500 },
            elevationDelay: '3 days per 1000 feet',
            notes: 'Common in Appalachian and northeastern oak forests'
        },
        hostTreeFrequencies: {
            'Red Oak (Quercus rubra)': '60%',
            'Other Oaks (Quercus spp.)': '25%',
            'Beech (Fagus grandifolia)': '10%',
            'Pine/Mixed Conifers': '5%',
            specificity: 'Strongly hardwood-associated, especially red oaks'
        },
        phenologyNH: {
            start: 'Late June',
            peak: 'July - September',
            end: 'Early October',
            notes: 'Extended fruiting season through summer and fall',
            triggers: 'Summer warmth + consistent rainfall'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'EXCELLENT - Choice edible, prized in Appalachian cuisine',

        identificationNotes: {
            'Cap': 'Brown with subtle lilac or purplish tints',
            'Pores': 'White to pale yellow',
            'Stipe': 'Fine white reticulation, often delicate pattern',
            'Color': 'Distinctive lilac tints distinguish from other species',
            'Reticulation': 'Very fine, lace-like white pattern on stem',
            'Lookalikes': 'Few concerning lookalikes due to distinctive lilac/lavender cap tones',
            'Key Safety': 'Yellow pores that don\'t bruise significantly, mycorrhizal with oaks'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 64,
            max: 77,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 86,
            measurementDepth: '0-8 inches',
            confidence: 'Medium',
            source: 'General B. edulis complex data'
        },
        soilPH: {
            min: 4.0,
            max: 6.5,
            optimal: 5.0,
            nhNotes: 'Well-adapted to NH acidic hardwood forests, particularly mature oak-beech stands.',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 8,
            max: 14,
            optimal: 11,
            correlationPeriod: 25,
            requirement: 'Summer through fall rainfall patterns',
            confidence: 'Medium-Low'
        },
        elevationRange: {
            min: 500,
            max: 3000,
            optimal: { min: 1000, max: 2500 },
            elevationDelay: '3-4 days per 1000 feet',
            notes: 'Characteristic of higher-elevation Appalachian hardwood forests'
        },
        hostTreeFrequencies: {
            'Oak (Quercus spp.)': '50%',
            'Beech (Fagus grandifolia)': '40%',
            'Mixed Hardwoods': '10%',
            specificity: 'Hardwood specialist, particularly oak-beech associations'
        },
        phenologyNH: {
            start: 'Late July',
            peak: 'August - September',
            end: 'October',
            notes: 'Most common in southern NH higher-elevation hardwood forests',
            triggers: 'Summer-fall rainfall + warm temperatures'
        },
        confidenceLevel: 'Medium',
        safetyRating: 'GOOD - Edible but not as desirable as other king boletes',

        identificationNotes: {
            'Stature': 'Very tall - stem often 2-3 times cap diameter',
            'Cap': 'Brown, typically smaller relative to tall stem',
            'Pores': 'White to pale yellow',
            'Stipe': 'Minimal reticulation, very tall and stately',
            'Proportions': 'Distinctive tall, elegant stature',
            'Lookalikes': 'Closely related to B. separans; distinguished by morphology',
            'Key Feature': 'Elongated narrow stem, beige skin, white pores aging brownish-yellow, often pitted or wrinkled cap'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 59,
            max: 75,
            fruitingRange: { min: 68, max: 79 },
            cessationThreshold: 70,
            measurementDepth: '0-8 inches',
            notes: 'Similar to B. edulis; prefers cooler, moister conditions',
            confidence: 'Medium-High',
            source: 'B. edulis complex cultivation studies'
        },
        soilPH: {
            min: 3.5,
            max: 6.0,
            optimal: 4.2,
            nhNotes: 'Excellent adaptation to NH granite soils. Strongly prefers acidic hemlock forest soils.',
            confidence: 'High',
            source: 'Hemlock forest ecology studies'
        },
        precipitationWindow: {
            min: 8,
            max: 14,
            optimal: 10,
            correlationPeriod: 30,
            requirement: 'Higher moisture needs than other boletes. Heavy, sustained rainfall.',
            notes: 'Hemlock shade retains moisture, creating ideal microclimate'
        },
        elevationRange: {
            min: 500,
            max: 3500,
            optimal: { min: 1000, max: 2500 },
            elevationDelay: '3-4 days per 1000 feet',
            notes: 'Prefers mid to high elevation hemlock forests'
        },
        hostTreeFrequencies: {
            'Eastern Hemlock (Tsuga canadensis)': '70% - STRONGLY ASSOCIATED',
            'White Pine (Pinus strobus)': '15%',
            'Mixed Conifers': '15%',
            specificity: 'Hemlock specialist - diagnostic habitat feature'
        },
        phenologyNH: {
            start: 'Late August',
            peak: 'September - October',
            end: 'Early November',
            notes: 'Hemlock association provides consistent moisture for extended fruiting',
            triggers: 'Autumn rains + temperature drop in hemlock groves'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'EXCELLENT - Choice edible',
        taxonomicNote: 'Recently merged with B. edulis based on whole genome studies; maintained separately here due to distinct hemlock habitat',

        identificationNotes: {
            'Habitat': 'Strongly associated with hemlock forests - DIAGNOSTIC',
            'Cap': 'Dark brown to reddish-brown',
            'Pores': 'White when very young, quickly becoming yellow',
            'Stipe': 'Brown reticulation on pale background',
            'Moisture': 'Prefers more moist conditions than other boletes',
            'TOXIC LOOKALIKE': 'Boletus huronensis - blue staining, yellow stem with red traces',
            'Key Safety': 'Brown reticulation, NO blue staining, hemlock habitat'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 55,
            max: 75,
            optimal: 65,
            notes: 'Follows host mushroom (Russula/Lactarius) requirements',
            confidence: 'Medium-High'
        },
        soilPH: {
            min: 4.5,
            max: 6.5,
            optimal: 5.5,
            notes: 'Follows host species preferences',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            notes: 'Follows host mushroom patterns'
        },
        elevationRange: {
            min: 0,
            max: 3500,
            optimal: { min: 500, max: 2000 }
        },
        hostSpecies: {
            'Russula brevipes': 'Primary host - 70-80%',
            'Lactarius piperatus': 'Secondary host - 20-30%',
            parasiteTransformation: 'Parasite DNA 95%+ in mature specimens'
        },
        phenologyNH: {
            start: 'July',
            peak: 'August - September',
            end: 'October',
            dependsOnHost: 'Timing follows host mushroom patterns'
        },
        confidenceLevel: 'Medium-High',
        safetyRating: 'SAFE (no poisonings in hundreds of years)',

        identificationNotes: {
            'Texture': 'FIRM, DENSE flesh unlike typical mushrooms',
            'Color': 'Bright orange-red exterior',
            'Host': 'Always on Lactarius or Russula host',
            'CRITICAL CHECK': 'Interior flesh MUST be WHITE (diagnostic)',
            'Safety Protocol': 'Reject half-parasitized specimens',
            'Firmness Test': 'Very dense, hard to break',
            'Quebec DNA Study': 'Mature lobster 95%+ parasite DNA - host toxins neutralized'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 50,
            max: 68,
            optimal: 59,
            fruitingOptimal: { min: 59, max: 68 },
            mycelialGrowth: { min: 68, max: 77 },
            notes: 'Cultivation data from controlled studies',
            confidence: 'Medium-High',
            source: 'PMC Fang et al. 2012, zombiemyco.com'
        },
        soilPH: {
            min: 5.0,
            max: 7.0,
            optimal: 6.0,
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 21,
            optimal: 14,
            requirement: 'Sustained rainfall preceding fruiting; warm temperatures + abundant rain'
        },
        elevationRange: {
            min: 0,
            max: 3000,
            optimal: { min: 200, max: 1500 },
            typicalRange: 'Below 3,280 feet - lowland forest species'
        },
        hostTreeFrequencies: {
            'Oak': '95-100% - MANDATORY',
            'Tree Age': '70+ years (mature stands)',
            'Association': 'White-rot pathogen, base of living oaks'
        },
        phenologyNH: {
            start: 'Late August',
            peak: 'September - October',
            end: 'Late October - early November',
            perennialNote: 'SAME TREES FRUIT FOR 5-10+ YEARS - excellent for GPS marking'
        },
        confidenceLevel: 'High (oak association well-documented)',
        safetyRating: 'SAFE (main lookalike is also edible)',
        oakMandatory: true,  // Flag for probability calculations

        identificationNotes: {
            'Habitat': 'ALWAYS at base of MATURE OAKS (70+ years old)',
            'Shape': 'Large, clustered, frond-like',
            'Color': 'Gray-brown to tan',
            'Perennial': 'Returns to SAME TREES annually for years',
            'Lookalike': 'Meripilus sumstinei (Black-staining Polypore) also edible but stains BLACK',
            'Key to Success': 'Mark productive oak trees - they fruit repeatedly'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 54,
            max: 66,
            optimal: 64,
            notes: 'Based on T. matsutake studies; T. magnivelare may vary',
            confidence: 'Medium',
            source: 'Kurokochi & Lian 2018 Current Trends Forest Research'
        },
        soilPH: {
            min: 4.5,
            max: 6.0,
            optimal: 5.0,
            inside_shiro: { min: 4.5, max: 5.5 },
            notes: 'Active fungal colony zone (shiro)',
            confidence: 'High'
        },
        precipitationWindow: {
            min: 3,
            max: 14,
            optimal: 7,
            weeklyRainfallTarget: 1.0,
            notes: 'Inches of rainfall per week optimal'
        },
        elevationRange: {
            min: 200,
            max: 2500,
            optimal: 800,
            nhZones: 'Lakeshore 200-600ft, mid-slope 600-1500ft, upper limit 1500-2500ft',
            bestHabitat: 'Hemlock stands near lakes most productive'
        },
        hostTreeFrequencies: {
            'Eastern Hemlock': '60% - PRIMARY (most productive in NH)',
            'Jack Pine': '20% - more common north of NH',
            'Red Pine': '10% - natural stands only',
            'Pitch Pine': '10% - coastal/sandy soils'
        },
        phenologyNH: {
            start: 'early September',
            peak: 'late September - early October',
            end: 'late October - early November',
            triggers: 'Soil temp drop to 54-66°F + significant rain (1+ inch)'
        },
        confidenceLevel: 'Medium',
        safetyRating: 'SAFE (distinctive cinnamon odor, no deadly lookalikes in NH)',

        identificationNotes: {
            'Smell': 'DISTINCTIVE spicy, cinnamon + funky aroma (KEY identifier)',
            'Cap': 'White to brown, often with soil debris',
            'Gills': 'White, attached, often torn',
            'Habitat': 'Buried in conifer duff, often only cap visible',
            'Stem Test': 'Firm, resists crushing (vs. brittle Amanita)',
            'Key Feature': 'Cinnamon odor is diagnostic - always verify'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 60,
            max: 80,
            optimal: 70,
            confidence: 'Medium'
        },
        soilPH: {
            min: 5.0,
            max: 7.0,
            optimal: 6.0,
            notes: 'Oak mycorrhizal associations',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            requirement: 'Sustained summer rainfall'
        },
        elevationRange: {
            min: 0,
            max: 3000,
            optimal: { min: 200, max: 1500 }
        },
        hostTreeFrequencies: {
            'Red Oak': '50-60%',
            'White Oak': '30-40%',
            'Association': 'Mycorrhizal with oaks - PRIMARY'
        },
        phenologyNH: {
            start: 'June',
            peak: 'July - August',
            end: 'September - October',
            coOccurrence: 'Often found WITH L. volemus and L. hygrophoroides'
        },
        confidenceLevel: 'High',
        safetyRating: 'SAFE with proper latex taste test',
        oakMandatory: true,

        identificationNotes: {
            'Cap': 'DEEPLY CORRUGATED (wrinkled) surface - darker brown',
            'Milk': 'White latex that stains brown',
            'Gills': 'Close spacing, orangish before bruising',
            'Odor': 'WEAKER or ABSENT (vs. strong fishy smell of volemus)',
            'MANDATORY TEST': 'Taste tiny amount of latex - MUST be MILD',
            'REJECT if': 'Latex is HOT, PEPPERY, or ACRID',
            'Key Difference': 'More wrinkled cap, darker, weaker odor than L. volemus'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 60,
            max: 80,
            optimal: 70,
            confidence: 'Medium'
        },
        soilPH: {
            min: 5.0,
            max: 7.0,
            optimal: 6.0,
            notes: 'Oak mycorrhizal associations',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            requirement: 'Sustained summer rainfall'
        },
        elevationRange: {
            min: 0,
            max: 3000,
            optimal: { min: 200, max: 1500 }
        },
        hostTreeFrequencies: {
            'Red Oak': '45-55%',
            'White Oak': '30-40%',
            'Other Hardwoods': '10-20%',
            'Association': 'Mycorrhizal with oaks - PRIMARY'
        },
        phenologyNH: {
            start: 'Late summer',
            peak: 'August - early fall',
            end: 'September - October',
            coOccurrence: 'Often found WITH L. volemus and L. corrugis'
        },
        confidenceLevel: 'High',
        safetyRating: 'SAFE with proper latex taste test',
        oakMandatory: true,

        identificationNotes: {
            'Cap': 'Orange to orange-brown, smooth, often with umbo (bump)',
            'Milk': 'White latex that does NOT stain brown quickly',
            'Gills': 'WIDELY SPACED (KEY - vs. close in volemus/corrugis)',
            'Odor': 'NO strong fishy smell (KEY difference from volemus)',
            'MANDATORY TEST': 'Taste tiny amount of latex - MUST be MILD',
            'REJECT if': 'Latex is HOT, PEPPERY, or ACRID',
            'Key Difference': 'Widely spaced gills, no fishy odor, no strong latex staining'
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

        // RESEARCH-ENHANCED DATA (December 2025)
        optimalSoilTemp: {
            min: 60,
            max: 80,
            optimal: 70,
            confidence: 'Medium',
            source: 'General mycorrhizal mushroom requirements'
        },
        soilPH: {
            min: 5.0,
            max: 7.0,
            optimal: 6.0,
            notes: 'Oak mycorrhizal associations',
            confidence: 'Medium'
        },
        precipitationWindow: {
            min: 7,
            max: 14,
            optimal: 10,
            requirement: 'Sustained summer rainfall'
        },
        elevationRange: {
            min: 0,
            max: 3000,
            optimal: { min: 200, max: 1500 }
        },
        hostTreeFrequencies: {
            'Red Oak': '40-50%',
            'White Oak': '25-35%',
            'Beech': '10-15%',
            'Association': 'Mycorrhizal with oaks - PRIMARY'
        },
        phenologyNH: {
            start: 'June (early summer)',
            peak: 'July - August',
            end: 'September - October',
            coOccurrence: 'Often found WITH L. corrugis and L. hygrophoroides'
        },
        confidenceLevel: 'High',
        safetyRating: 'SAFE with proper latex taste test',
        oakMandatory: true,  // Strong oak association

        identificationNotes: {
            'Cap': 'Tawny orange-brown, velvety when young',
            'Milk': 'ABUNDANT WHITE LATEX that dries yellowish/brown',
            'Smell': 'DISTINCTIVE FISHY or seafood odor (KEY identifier)',
            'Gills': 'CLOSE spacing, cream colored, stain brown from latex',
            'MANDATORY TEST': 'Taste tiny amount of latex - MUST be MILD',
            'REJECT if': 'Latex is HOT, PEPPERY, or ACRID (indicates toxic species)',
            'Safety Protocol': 'All three NH milk caps have MILD latex - acrid = reject'
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
