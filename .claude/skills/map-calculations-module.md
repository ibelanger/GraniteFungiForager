---
name: map-calculations-module
description: Deep dive into mapCalculations.js - multi-factor probability engine with research-backed multipliers for mushroom foraging predictions
triggers:
  - mapCalculations.js
  - map calculations
  - probability engine
  - probability calculations
  - calculateProbability
  - getProbabilityColor
  - temperature weighting
  - oak proximity
---

# Map Calculations Module Deep Dive

## Module: `src/modules/mapCalculations.js`

### Purpose
Multi-factor probability engine that calculates county-specific foraging probabilities by combining weather data, species requirements, regional patterns, and research-backed environmental multipliers.

### Test Coverage
- **48 tests** covering:
  - Probability calculations
  - Temperature/moisture weighting
  - Color coding (0-100% scale)
  - Regional multipliers
  - Edge cases (extreme temps, missing data)

## Key Features

### 1. Multi-Factor Probability Algorithm

**Base Formula:**
```
Probability = Base × TempFactor × MoistureFactor × SeasonMultiplier × RegionalWeight
× OakProximity × MossAssociation × SoilTempOptimal
```

**Factors:**
1. **Base Probability** - Starting point (typically 50%)
2. **Temperature Factor** - Air temperature within species range
3. **Moisture Factor** - Precipitation/humidity requirements
4. **Season Multiplier** - Seasonal peak timing (from species data)
5. **Regional Weight** - Geographic suitability (from species data)
6. **Oak Proximity Multiplier** - NEW (Dec 2025) - Critical for Maitake, Milk Caps
7. **Moss Association Multiplier** - NEW (Dec 2025) - Boosts Black Trumpets
8. **Soil Temp Optimal** - NEW (Dec 2025) - Precision temperature windows

### 2. Research-Backed Multipliers (December 2025)

#### Oak Proximity Multiplier
**For species with `oakMandatory: true`:**
```javascript
if (species.hostTreeFrequencies?.oakMandatory) {
  const oakCoverage = getOakCoverageByCounty(county);
  probability *= (oakCoverage / 100); // 0.0 to 1.0 multiplier

  // Example: Maitake in Grafton County
  // oakCoverage = 75% → multiplier = 0.75
  // Without oak: probability drops significantly
}
```

**Affected Species:**
- Maitake (Grifola frondosa) - 85% oak association
- Milk Caps (Lactifluus volemus) - 90% oak association
- Lactifluus corrugis - 95% oak association

#### Moss Association Multiplier
**For species preferring mossy habitats:**
```javascript
if (species.mossAssociation && precipitation > 2.0) {
  probability *= 1.3; // 30% boost in high-rainfall conditions

  // Example: Black Trumpets in Lakes Region after heavy rain
  // Base probability: 60%
  // With moss boost: 78%
}
```

**Affected Species:**
- Black Trumpets (Craterellus fallax)
- Some Chanterelle varieties

#### Species-Specific Optimal Temperature Ranges
**Using `optimalSoilTemp` data:**
```javascript
if (species.optimalSoilTemp && soilTemp) {
  const [min, max] = species.optimalSoilTemp.range;

  if (soilTemp >= min && soilTemp <= max) {
    probability *= 1.5; // 50% boost in optimal range
  } else if (soilTemp < min - 10 || soilTemp > max + 10) {
    probability *= 0.3; // 70% reduction outside range
  }
}
```

**Example: Morels**
- Optimal soil temp: 50-60°F
- Current: 55°F → 1.5x boost
- Current: 45°F → Normal calculation
- Current: 35°F → 0.3x reduction

### 3. County-to-Region Mapping

**7 NH Geographic Regions:**
```javascript
const countyRegions = {
  'Coos': 'Great North Woods',
  'Grafton': 'White Mountains',
  'Carroll': 'White Mountains',
  'Belknap': 'Lakes Region',
  'Merrimack': 'Merrimack Valley',
  'Strafford': 'Seacoast',
  'Sullivan': 'Dartmouth-Lake Sunapee',
  'Cheshire': 'Monadnock Region',
  'Hillsborough': 'Merrimack Valley',
  'Rockingham': 'Seacoast'
};
```

**Regional Characteristics:**
- **Great North Woods** - Longest winters, shortest growing season
- **White Mountains** - High elevation, cooler temps, ideal for boletes
- **Lakes Region** - Moderate climate, high humidity
- **Seacoast** - Milder winters, earlier springs
- **Merrimack Valley** - Central corridor, mixed conditions
- **Monadnock Region** - SW hills, diverse hardwoods
- **Dartmouth-Lake Sunapee** - W-central, good mix of habitats

### 4. Color-Coded Probability Visualization

**Probability Scale:**
- **0-20%** - Red (#c0392b) - Very unlikely
- **21-40%** - Orange-red (#d35400) - Unlikely
- **41-60%** - Orange (#e67e22) - Possible
- **61-80%** - Yellow-green (#f39c12) - Likely
- **81-100%** - Green (#27ae60) - Highly likely

**Implementation:**
```javascript
function getProbabilityColor(probability) {
  if (probability > 80) return '#27ae60'; // Green
  if (probability > 60) return '#f39c12'; // Yellow-green
  if (probability > 40) return '#e67e22'; // Orange
  if (probability > 20) return '#d35400'; // Orange-red
  return '#c0392b'; // Red
}
```

## Key Functions

### calculateProbability(species, county, weatherData)

**Purpose:** Calculate foraging probability for a specific species in a county.

**Parameters:**
- `species` - Species object from species.js
- `county` - County name (string)
- `weatherData` - Current weather data for county

**Returns:** Number (0-100) representing probability percentage

**Algorithm:**
```javascript
function calculateProbability(species, county, weatherData) {
  let probability = 50; // Base

  // 1. Temperature factor
  const temp = weatherData.temperature;
  if (temp < species.tempRange[0] || temp > species.tempRange[1]) {
    probability *= 0.5; // Outside range = 50% reduction
  } else {
    // Optimal temperature curve (bell curve centered on midpoint)
    const midpoint = (species.tempRange[0] + species.tempRange[1]) / 2;
    const distance = Math.abs(temp - midpoint);
    const rangeDiff = species.tempRange[1] - species.tempRange[0];
    const tempScore = 1 - (distance / rangeDiff);
    probability *= (0.7 + tempScore * 0.6); // 0.7 to 1.3 multiplier
  }

  // 2. Moisture factor
  const moisture = weatherData.precipitation;
  if (moisture < species.moistureMin) {
    probability *= 0.6; // Too dry
  } else {
    probability *= 1.2; // Adequate moisture
  }

  // 3. Season multiplier
  const season = weatherData.season;
  probability *= species.seasonMultiplier[season];

  // 4. Regional weight
  const region = countyRegions[county];
  probability *= species.regions[region];

  // 5. Oak proximity (NEW)
  if (species.hostTreeFrequencies?.oakMandatory) {
    probability *= getOakMultiplier(county);
  }

  // 6. Moss association (NEW)
  if (species.mossAssociation && moisture > 2.0) {
    probability *= 1.3;
  }

  // 7. Optimal soil temp (NEW)
  if (species.optimalSoilTemp) {
    probability *= getSoilTempMultiplier(species, weatherData.soilTemperature);
  }

  // Cap at 0-100
  return Math.max(0, Math.min(100, probability));
}
```

### updateMapColors(selectedSpecies)

**Purpose:** Update county colors on map based on probabilities.

**Parameters:**
- `selectedSpecies` - Species object to calculate probabilities for

**Side Effects:**
- Updates SVG county fill colors
- Updates county data attributes

**Implementation:**
```javascript
function updateMapColors(selectedSpecies) {
  const counties = document.querySelectorAll('.county');

  counties.forEach(county => {
    const countyName = county.dataset.county;
    const weather = currentWeatherData.counties[countyName];

    const probability = calculateProbability(
      selectedSpecies,
      countyName,
      weather
    );

    const color = getProbabilityColor(probability);
    county.style.fill = color;
    county.dataset.probability = probability;
  });
}
```

## Integration Points

### Used By
1. **app.js** - Initial map rendering
2. **interactions.js** - Species selection updates
3. **County detail modals** - Probability display

### Dependencies
1. **weather.js** - `currentWeatherData` for calculations
2. **species.js** - Species data (temp ranges, moisture, seasons, regions)
3. **DOM** - SVG county elements for color updates

## Oak Coverage by County

**Oak forest coverage estimates (% of forest land):**
```javascript
const oakCoverageByCounty = {
  'Rockingham': 85,     // Southern, abundant oak
  'Hillsborough': 80,
  'Strafford': 75,
  'Merrimack': 70,
  'Cheshire': 70,
  'Belknap': 65,
  'Sullivan': 60,
  'Grafton': 45,        // More conifer at elevation
  'Carroll': 40,
  'Coos': 25            // Northern, limited oak
};
```

**Source:** NH Forest Inventory data, USDA Forest Service

## Common Tasks

### Modify Temperature Weighting
```javascript
// In calculateProbability function
// Current: Linear distance from midpoint
// New: Gaussian curve for more gradual falloff
const tempScore = Math.exp(-Math.pow(distance / (rangeDiff / 2), 2));
```

### Add New Environmental Factor
```javascript
// Example: Add elevation adjustment
if (species.elevationRange) {
  const countyElevation = getCountyAverageElevation(county);
  const [minElev, maxElev] = species.elevationRange.feet;

  if (countyElevation >= minElev && countyElevation <= maxElev) {
    probability *= 1.2; // Optimal elevation
  } else if (countyElevation > maxElev) {
    probability *= 0.7; // Too high
  }
}
```

### Adjust Color Thresholds
```javascript
// Make colors more conservative (higher thresholds)
function getProbabilityColor(probability) {
  if (probability > 90) return '#27ae60'; // Green (was 80)
  if (probability > 70) return '#f39c12'; // Yellow (was 60)
  if (probability > 50) return '#e67e22'; // Orange (was 40)
  if (probability > 30) return '#d35400'; // Orange-red (was 20)
  return '#c0392b'; // Red
}
```

### Test Probability Calculation
```javascript
// In browser console or test file
import { calculateProbability } from './modules/mapCalculations.js';
import { getSpeciesById } from './modules/species.js';
import { currentWeatherData } from './modules/weather.js';

const morel = getSpeciesById('morel');
const weather = currentWeatherData.counties['Grafton'];
const prob = calculateProbability(morel, 'Grafton', weather);

console.log(`Morel probability in Grafton: ${prob}%`);
```

## Edge Cases Handled

1. **Missing weather data** - Returns default 50% or last known value
2. **Extreme temperatures** - Caps probability at 0-100%
3. **Null species data** - Returns 0% with error log
4. **Invalid county** - Returns 0% with warning
5. **Future dates** - Uses current weather (no forecast yet)

## Performance Optimizations

1. **Cached calculations** - Probability calculated once per species/county/weather update
2. **Minimal DOM updates** - Only updates changed counties
3. **Debounced updates** - Weather changes trigger single map update
4. **Efficient selectors** - Uses `data-county` attributes for O(n) updates

## Future Enhancements

### Planned Improvements
- **Precipitation window correlation** - Use 7-30 day rainfall patterns
- **Elevation-based adjustments** - Phenological delays with altitude
- **Soil pH factors** - Granite soil acidity impacts
- **Historical probability tracking** - Learn from user success reports
- **Confidence intervals** - Show probability ranges, not point estimates
- **Machine learning integration** - Train on iNaturalist + user report data

## Quick Reference

### Calculate Probability for Species
```javascript
const probability = calculateProbability(species, county, weatherData);
```

### Get Color for Probability
```javascript
const color = getProbabilityColor(85); // Returns '#27ae60' (green)
```

### Update Map for Selected Species
```javascript
updateMapColors(selectedSpecies);
```

### Get County Region
```javascript
const region = countyRegions['Grafton']; // Returns 'White Mountains'
```
