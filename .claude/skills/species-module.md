---
name: species-module
description: Deep dive into species.js - complete DHHS Tier 1 species database with research-backed data, temperature ranges, and identification details
triggers:
  - species.js
  - species module
  - species database
  - DHHS Tier 1
  - mushroom data
  - species data
  - allSpecies
  - getSpeciesById
---

# Species Module Deep Dive

## Module: `src/modules/species.js`

### Purpose
Maintains the complete database of New Hampshire DHHS Tier 1 wild mushroom species with research-backed foraging data, including temperature ranges, moisture requirements, seasonal patterns, and identification notes.

### Test Coverage
- **62 tests** covering:
  - Species data validation
  - DHHS Tier 1 compliance
  - Temperature range accuracy
  - Regional data completeness
  - Edge cases for subspecies groups

## Key Features

### 1. Complete DHHS Tier 1 Database

**29 species total** (including subspecies variations):
- Morels (Morchella spp.) - 4 varieties
- Chanterelles (Cantharellus cibarius complex)
- Chicken of the Woods (Laetiporus sulphureus)
- Hen of the Woods/Maitake (Grifola frondosa)
- Lion's Mane (Hericium erinaceus)
- Black Trumpets (Craterellus fallax)
- Oyster Mushrooms (Pleurotus ostreatus)
- Wine Caps (Stropharia rugosoannulata)
- Hedgehogs (Hydnum spp.) - 3 subgenera
- Boletus edulis complex - 7 species
- Lobster Mushroom (Hypomyces lactifluorum)
- Matsutake (Tricholoma magnivelare)
- And more...

### 2. Species-Specific Skills

For detailed information on specific species groups:
- **Boletus edulis complex:** See `boletus-group` skill
- **Hedgehog variations:** See `hedgehog-group` skill
- **Morel varieties:** See `morel-group` skill

### 3. Research-Backed Data Fields (Added December 2025)

Each species now includes enhanced fields based on peer-reviewed research:

#### **optimalSoilTemp**
```javascript
{
  range: [50, 60],        // °F optimal range
  confidence: "High",     // High/Medium/Low
  source: "Mihail 2014 McIlvainea"
}
```

#### **soilPH**
```javascript
{
  range: [5.5, 6.5],      // pH range
  nhChallenges: "Granite soil tends acidic (4.5-5.5), may require lime"
}
```

#### **precipitationWindow**
```javascript
{
  correlation: "7-10 days",  // Days after rain
  amount: ">1 inch",         // Rainfall threshold
  notes: "Strong correlation with sustained moisture"
}
```

#### **elevationRange**
```javascript
{
  feet: [0, 3000],
  phenologyDelay: "+1 week per 1000ft elevation"
}
```

#### **hostTreeFrequencies**
```javascript
{
  'oak': 85,           // 85% of observations
  'beech': 10,
  'maple': 5,
  oakMandatory: true   // Critical for probability calculations
}
```

#### **phenologyNH**
```javascript
{
  peakWeeks: "weeks 2-4 of May",
  earlyDate: "April 15 (southern valleys)",
  lateDate: "June 15 (northern mountains)"
}
```

#### **confidenceLevel**
- **High:** Well-researched with multiple peer-reviewed sources
- **Medium:** Good field data, limited academic research
- **Low:** Anecdotal or needs more validation

#### **safetyRating**
```javascript
{
  level: "Advanced",      // Beginner/Intermediate/Advanced/Expert
  warnings: ["Has toxic lookalikes", "Requires expert confirmation"],
  lookalikeRisk: "HIGH"
}
```

### 4. Primary Research Sources

- **MushroomExpert.com** (Michael Kuo) - Species identification and ecology
- **USDA PNW-GTR-576** (Pilz et al. 2003) - Chanterelle ecology
- **Mihail 2014 McIlvainea** - Morel soil temperature thresholds
- **boletes.wpamushroomclub.org** - Boletus edulis complex identification
- **PMC peer-reviewed studies** - Cultivation and field data

## Traditional Data Structure

### Core Fields (All Species)

```javascript
{
  id: "morel",
  name: "Morels",
  scientificName: "Morchella spp.",
  description: "Honeycomb-capped spring mushrooms...",

  // Temperature requirements
  tempRange: [50, 70],           // °F air temperature

  // Moisture requirements
  moistureMin: 60,               // Minimum % moisture

  // Seasonal multipliers
  seasonMultiplier: {
    spring: 3.0,                 // Peak season (3x probability)
    summer: 0.5,
    fall: 0.2,
    winter: 0.0
  },

  // Regional probability weights (7 NH regions)
  regions: {
    'Seacoast': 0.7,
    'Merrimack Valley': 0.8,
    'Lakes Region': 0.9,
    'White Mountains': 1.0,      // Best region
    'Great North Woods': 0.95,
    'Monadnock Region': 0.85,
    'Dartmouth-Lake Sunapee': 0.9
  },

  // Identification notes
  identificationNotes: [
    "Hollow cap and stem",
    "Honeycomb pattern on cap",
    // ...
  ],

  // Foraging tips
  foragingTips: [
    "Search near dead elm, ash, apple trees",
    "South-facing slopes warm first",
    // ...
  ]
}
```

## Global Exports

### allSpecies Array
```javascript
import { allSpecies } from './modules/species.js';

// Get all species
console.log(allSpecies); // Array of 29 species objects

// Filter by season
const springSpecies = allSpecies.filter(s =>
  s.seasonMultiplier.spring > 1.5
);
```

### getSpeciesById Function
```javascript
import { getSpeciesById } from './modules/species.js';

const morel = getSpeciesById('morel');
console.log(morel.name); // "Morels"
```

## Integration Points

### Used By
1. **mapCalculations.js** - Probability calculations using temp/moisture/season
2. **interactions.js** - Species info cards and selection
3. **foragingReports.js** - Success tracking by species
4. **iNaturalistIntegration.js** - Maps iNaturalist observations to species
5. **speciesMapping.js** - Name normalization

### Dependencies
- **None** - Pure data module with no external dependencies

## Specialized Species Groups

### Boletus edulis Complex (7 species)

See `boletus-group` skill for detailed information on:
- Boletus edulis (King Bolete)
- B. variipes (Two-colored Bolete)
- B. subcaerulescens (Bluing Bolete)
- B. chippewaensis (Chippewa Bolete)
- B. atkinsonii (Atkinson's Bolete)
- B. nobilis (Noble Bolete)
- B. russellii (Russell's Bolete)

### Hedgehog Subgenera (3 variations)

See `hedgehog-group` skill for:
- Hydnum repandum (Sweet Tooth)
- H. umbilicatum (Belly Button Hedgehog)
- H. albidum (White Hedgehog)

### Morel Varieties (4 types)

See `morel-group` skill for:
- Black Morels (Morchella elata group)
- Yellow Morels (M. esculenta group)
- Half-free Morels (M. punctipes)
- Burn Morels (M. tomentosa)

## Common Tasks

### Add New Species
1. Add species object to `allSpecies` array in `species.js`
2. Include all required fields (id, name, scientificName, tempRange, etc.)
3. Add research-backed fields if available (optimalSoilTemp, soilPH, etc.)
4. Add tests in `tests/unit/species.test.js`:
   - Validate data structure
   - Check temperature ranges
   - Verify regional data
5. Update species mapping in `speciesMapping.js` if needed
6. Add to appropriate skill (boletus-group, etc.) if part of complex

### Update Species Data
1. Find species by ID in `allSpecies` array
2. Update fields with new research data
3. Add source to `optimalSoilTemp.source` or similar
4. Update confidence level if improving data quality
5. Update tests if changing ranges or structure
6. Document changes in CHANGELOG.md

### Add Research Data to Existing Species
```javascript
// Example: Adding soil pH data to Chanterelles
{
  id: "chanterelle",
  // ... existing fields ...
  soilPH: {
    range: [4.5, 6.0],
    nhChallenges: "Prefers acidic NH granite soils, no amendment needed"
  },
  confidenceLevel: "High",
  dataSource: "USDA PNW-GTR-576 (Pilz et al. 2003)"
}
```

## NH Geographic Regions

The 7 regions used in regional probability weights:

1. **Seacoast** - Coastal areas, milder winters
2. **Merrimack Valley** - Central corridor, mixed forests
3. **Lakes Region** - Central lakes, moderate climate
4. **White Mountains** - High elevation, cooler, longer seasons
5. **Great North Woods** - Northern forests, shortest growing season
6. **Monadnock Region** - SW hills, mixed hardwoods
7. **Dartmouth-Lake Sunapee** - W-central, diverse habitats

## Data Validation

### Required Fields
Every species must have:
- `id` (string, unique, kebab-case)
- `name` (string)
- `scientificName` (string with genus + species)
- `description` (string, 1-2 sentences)
- `tempRange` (array of 2 numbers, °F)
- `moistureMin` (number, 0-100%)
- `seasonMultiplier` (object with spring/summer/fall/winter)
- `regions` (object with 7 NH regions)
- `identificationNotes` (array of strings)
- `foragingTips` (array of strings)

### Optional Enhanced Fields
- `optimalSoilTemp` (object)
- `soilPH` (object)
- `precipitationWindow` (object)
- `elevationRange` (object)
- `hostTreeFrequencies` (object)
- `phenologyNH` (object)
- `confidenceLevel` (string)
- `safetyRating` (object)

### Validation Tests
Located in `tests/unit/species.test.js`:
- All required fields present
- Temperature ranges valid (min < max, reasonable values)
- Moisture values 0-100
- Season multipliers sum to reasonable total
- Regional weights 0-1
- No duplicate IDs

## Safety and Compliance

### DHHS Tier 1 Compliance
All species in the database are on the **New Hampshire DHHS Tier 1 list** of approved wild mushrooms for commercial sale. This ensures:
- Species are generally safe when properly identified
- Multiple identification characteristics available
- No deadly lookalikes (though some have toxic lookalikes)
- Commercial harvesters can legally sell these species

### Safety Warnings
All species include:
- **Identification notes** with key distinguishing features
- **Foraging tips** including lookalike warnings
- **safetyRating** field (when available) with expertise level
- Recommendations to consult multiple expert sources

## Future Enhancements

Noted in CLAUDE.md for future revisions:
- **Toxic lookalike species data** - Detailed lookalike comparisons
- **GPS marking feature** - Track perennial species locations (Maitake, etc.)
- **Phenology models** - Predictive flowering based on accumulated degree-days
- **Microhabitat data** - Soil composition, canopy cover, competing vegetation
- **Climate change impacts** - Range shifts and timing changes

## Quick Reference

### Get All Spring Species
```javascript
const springSpecies = allSpecies.filter(s => s.seasonMultiplier.spring >= 1.5);
```

### Get Species by Region
```javascript
const whiteM mountainSpecies = allSpecies.filter(s => s.regions['White Mountains'] >= 0.9);
```

### Get High-Confidence Species
```javascript
const highConfidence = allSpecies.filter(s => s.confidenceLevel === 'High');
```

### Check if Species Needs Oak Trees
```javascript
const needsOak = allSpecies.filter(s => s.hostTreeFrequencies?.oakMandatory);
```
