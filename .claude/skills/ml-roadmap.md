---
name: ml-roadmap
description: Machine learning pipeline and accuracy improvement roadmap for GraniteFungiForager - user tracking, iNaturalist integration, and model training plans
triggers:
  - machine learning
  - ML pipeline
  - accuracy improvement
  - iNaturalist
  - observation data
  - model training
  - prediction accuracy
  - foragingReports
---

# Machine Learning Roadmap

## Overview

The `src/ml/accuracy-improvement-pipeline.js` contains a **completed framework** for improving prediction accuracy from 60-70% baseline to target 85-90% through community data collection, expert validation, and research integration.

## Current Status

### ✅ Implemented Components

1. **User Success Tracking** (`foragingReports.js`)
   - Community data collection system
   - Success/failure tracking with species, location, conditions
   - Data validation and storage management
   - Integration with iNaturalist for observation validation
   - **84 comprehensive tests**

2. **iNaturalist API Integration** (`iNaturalistIntegration.js`)
   - Real-world observation data fetching
   - Intelligent caching system (24-hour cache with exponential backoff)
   - Species mapping to DHHS Tier 1 species
   - Rate limiting and error handling
   - **60 comprehensive tests**

3. **Species-Specific Analyzers**
   - Boletus edulis complex support (7 species)
   - Hedgehog subgenera variations (3 types)
   - Morel variety tracking (4 types)
   - Specialized observation pattern analysis

4. **Data Analysis Tools**
   - `observationAnalysis.js` - Analyzes iNaturalist patterns
   - `speciesCoverageAudit.js` - Data quality assurance
   - `speciesMapping.js` - Name normalization

### ⏳ Framework Exists, Awaiting Data/Partnerships

1. **Expert Validation Systems**
   - Framework in place
   - Needs partnerships with:
     - NH mycological societies
     - DHHS food safety inspectors
     - Academic mycologists
     - Certified foraging instructors

2. **Academic Research Integration**
   - Ongoing literature review
   - Sources identified (see Research Sources below)
   - Continuous integration of new studies

## ML Pipeline Architecture

### Data Collection Flow

```
User Foraging Reports
         ↓
   Validation Layer
         ↓
   Storage (localStorage)
         ↓
   iNaturalist Cross-Reference
         ↓
   Pattern Analysis
         ↓
   Model Training Data
```

### Data Sources

1. **User Reports** (`foragingReports.js`)
   - Species found
   - Location (county-level)
   - Weather conditions at time
   - Success/failure outcome
   - User confidence level

2. **iNaturalist Observations** (`iNaturalistIntegration.js`)
   - GPS-tagged observations
   - Expert-verified identifications
   - Temporal patterns (when species appear)
   - Geographic distribution
   - Associated habitats

3. **Weather Data** (`weather.js`)
   - Real-time conditions
   - Historical correlation with observations
   - Soil temperature estimates
   - Precipitation patterns

4. **Research Literature**
   - Peer-reviewed studies
   - Field guides
   - Local mycological knowledge
   - Cultivation data

### Model Training Strategy

#### Phase 1: Data Collection (Current)
- Accumulate user foraging reports
- Build iNaturalist observation dataset
- Validate data quality
- Establish baseline accuracy metrics

#### Phase 2: Feature Engineering
**Input Features:**
- Air temperature (current, 7-day average, 30-day average)
- Soil temperature (calculated, validated against reports)
- Precipitation (24h, 7-day, 30-day)
- Season (calendar + phenological)
- County/region
- Oak coverage (new Dec 2025)
- Moss association (new Dec 2025)
- Elevation
- Soil pH
- Host tree presence

**Target Variable:**
- Binary success/failure
- Probability of finding species (0-100%)

#### Phase 3: Model Selection
**Candidate Models:**
1. **Random Forest** - Good for non-linear relationships, interpretable
2. **Gradient Boosting** (XGBoost, LightGBM) - High accuracy, handles missing data
3. **Neural Networks** - Can capture complex patterns, requires more data
4. **Ensemble Methods** - Combine multiple models for robustness

**Initial Choice:** Random Forest for interpretability and smaller data requirements

#### Phase 4: Training & Validation
- **Train/Test Split:** 80/20
- **Cross-Validation:** 5-fold
- **Metrics:**
  - Accuracy
  - Precision/Recall
  - F1 Score
  - AUC-ROC
  - Calibration (predicted vs actual probabilities)

#### Phase 5: Deployment
- Replace hardcoded probability calculations with trained model
- A/B test model vs current algorithm
- Monitor accuracy in production
- Continuous learning from new reports

## Research Sources Integration

### Current Sources (December 2025)

1. **MushroomExpert.com** (Michael Kuo)
   - Species identification
   - Ecology and habitat notes
   - Lookalike warnings

2. **USDA PNW-GTR-576** (Pilz et al. 2003)
   - Chanterelle ecology
   - Pacific Northwest forest patterns (adapted for NH)

3. **Mihail 2014 McIlvainea**
   - Morel soil temperature thresholds
   - Phenological models

4. **boletes.wpamushroomclub.org**
   - Boletus edulis complex identification
   - Regional variation patterns

5. **PMC Peer-Reviewed Studies**
   - Cultivation data
   - Field study results
   - Climate impact research

### Ongoing Literature Review

**Search Strategy:**
- Google Scholar alerts for mushroom keywords
- Mycological journal monitoring (Mycologia, Fungi, McIlvainea)
- Regional field guide updates
- Climate change impact studies

**Integration Process:**
1. Identify relevant study
2. Extract quantitative data (temp ranges, timing, etc.)
3. Add to species data with `source` citation
4. Update `confidenceLevel` based on study quality
5. Add tests to validate new data

## Accuracy Targets

### Current Baseline (v3.3.0)
- **Estimated Accuracy:** 60-70%
- **Based on:** Hardcoded temperature ranges + seasonal multipliers
- **Limitations:**
  - No learning from actual outcomes
  - Simplified environmental factors
  - No species-specific phenology models

### Phase 1 Target (6 months, 100+ user reports)
- **Accuracy:** 70-75%
- **Improvements:**
  - Oak proximity multiplier validation
  - Precipitation window correlation
  - Regional calibration

### Phase 2 Target (1 year, 500+ user reports)
- **Accuracy:** 75-80%
- **Improvements:**
  - Species-specific models
  - Elevation adjustments
  - Soil pH factors
  - Machine learning integration

### Phase 3 Target (2 years, 1000+ user reports + expert validation)
- **Accuracy:** 85-90%
- **Improvements:**
  - Ensemble models
  - Microhabitat predictions
  - Confidence intervals
  - Real-time model updates

## Data Privacy & Ethics

### User Data Protection
- **No personal information collected**
- County-level location only (not GPS)
- localStorage only (no server upload)
- Future: Option to share anonymized data for research

### Conservation Ethics
- Protect sensitive species locations
- Monitor for over-harvesting patterns
- Close areas if reports show depletion
- Promote sustainable foraging practices

### Academic Collaboration
- Open to partnerships with universities
- Data sharing agreements respect privacy
- Co-authorship on research publications
- Community benefit requirements

## Technical Implementation

### Storage Schema

**User Report Structure:**
```javascript
{
  id: "uuid-v4",
  timestamp: "2025-12-05T10:30:00Z",
  species: "morel",
  county: "Grafton",
  success: true,
  confidence: "high", // low/medium/high
  weather: {
    temperature: 58,
    soilTemperature: 48,
    precipitation24h: 0.5,
    season: "spring"
  },
  notes: "Found near dead ash tree"
}
```

**iNaturalist Observation:**
```javascript
{
  id: 123456,
  species: "Morchella esculenta",
  mappedSpecies: "morel",
  location: {
    lat: 43.6422,
    lon: -72.0147,
    county: "Grafton"
  },
  observedOn: "2025-05-15",
  researchGrade: true,
  photos: ["url1", "url2"]
}
```

### Analysis Functions

**Pattern Detection:**
```javascript
// Analyze temporal patterns
function analyzeSeasonalTiming(species) {
  const observations = getObservations(species);
  const datesByYear = groupByYear(observations);

  return {
    peakWeek: calculatePeakWeek(datesByYear),
    startDate: calculateStartDate(datesByYear),
    endDate: calculateEndDate(datesByYear),
    variance: calculateVariance(datesByYear)
  };
}
```

**Geographic Clustering:**
```javascript
// Find hotspots
function findHotspots(species, radius = 10) {
  const observations = getObservations(species);
  const clusters = dbscan(observations, radius);

  return clusters.map(cluster => ({
    center: calculateCenter(cluster),
    density: cluster.length,
    confidence: calculateConfidence(cluster)
  }));
}
```

## Quick Reference

### Check User Report Count
```javascript
import { getReportCount } from './modules/foragingReports.js';
console.log(`Total reports: ${getReportCount()}`);
```

### Fetch iNaturalist Data
```javascript
import { fetchObservations } from './modules/iNaturalistIntegration.js';
const observations = await fetchObservations('morel', 'Grafton');
```

### Run Species Coverage Audit
```javascript
import { auditSpeciesCoverage } from './modules/speciesCoverageAudit.js';
const report = auditSpeciesCoverage();
console.log(report);
```

### Analyze Observation Patterns
```javascript
import { analyzeSeasonalPatterns } from './modules/observationAnalysis.js';
const patterns = analyzeSeasonalPatterns('chanterelle');
console.log(patterns);
```

## Future Work

### Short Term (3-6 months)
- [ ] Validate oak proximity impact with user reports
- [ ] Correlate precipitation windows with success rates
- [ ] Build initial training dataset (100+ reports)
- [ ] Create analytics dashboard for pattern visualization

### Medium Term (6-12 months)
- [ ] Train first machine learning model
- [ ] A/B test model vs algorithm
- [ ] Integrate elevation data
- [ ] Add confidence intervals to predictions

### Long Term (1-2 years)
- [ ] Expert validation partnership
- [ ] Academic research collaboration
- [ ] Publish accuracy improvement study
- [ ] Open-source ML model for community use
