---
name: weather-module
description: Deep dive into weather.js module - real-time weather data integration, soil temperature calculations, and county mappings
triggers:
  - weather.js
  - weather module
  - Open-Meteo
  - soil temperature
  - county weather
  - currentWeatherData
  - getWeatherData
  - weather API
---

# Weather Module Deep Dive

## Module: `src/modules/weather.js`

### Purpose
Fetches and processes real-time weather data from the Open-Meteo API, calculating county-specific conditions including soil temperature estimates for mushroom foraging predictions.

### Test Coverage
- **26 tests** covering:
  - Soil temp calculations
  - Season detection
  - County coordinate mappings
  - Error handling for offline scenarios
  - Auto-refresh system

## Key Features

### 1. Weather Data Integration
- **API:** Open-Meteo (no API key required)
- **Data Points:** Air temperature, precipitation, soil moisture, cloud cover
- **Refresh Rate:** 5-minute intervals when tab is visible
- **Counties Covered:** All 10 NH counties

### 2. County-to-Coordinate Mapping

The module uses hardcoded coordinates for representative towns in each county:

```javascript
const countyTowns = {
  'Coos': { lat: 44.4959, lon: -71.1786 },        // Berlin
  'Grafton': { lat: 43.6422, lon: -72.0147 },     // Lebanon
  'Carroll': { lat: 43.8781, lon: -71.1284 },     // Conway
  'Belknap': { lat: 43.5278, lon: -71.4703 },     // Laconia
  'Merrimack': { lat: 43.2081, lon: -71.5376 },   // Concord
  'Strafford': { lat: 43.1939, lon: -70.8803 },   // Dover
  'Sullivan': { lat: 43.3759, lon: -72.2814 },    // Claremont
  'Cheshire': { lat: 42.9333, lon: -72.2781 },    // Keene
  'Hillsborough': { lat: 42.9956, lon: -71.4548 },// Manchester
  'Rockingham': { lat: 42.9708, lon: -70.8678 }   // Portsmouth
};
```

### 3. Soil Temperature Calculation

The module estimates soil temperature algorithmically since Open-Meteo doesn't provide direct soil temp data:

**Algorithm:**
```javascript
// Base soil temp from air temp with lag/damping
let soilTemp = airTemp * 0.85; // Soil lags behind air by ~15%

// Recent precipitation increases soil moisture, cools surface
if (precipitation24h > 5) {
  soilTemp -= 2; // Significant cooling from wet soil
} else if (precipitation24h > 1) {
  soilTemp -= 1; // Moderate cooling
}

// Cloud cover affects soil temperature
if (cloudCover > 70) {
  soilTemp -= 1; // Overcast = cooler soil
} else if (cloudCover < 30) {
  soilTemp += 1; // Clear = warmer soil
}

return Math.round(soilTemp);
```

**Factors:**
- **Air temperature** (85% correlation - soil lags behind air)
- **Recent precipitation** (cools soil surface)
- **Cloud cover** (affects solar heating)

### 4. Auto-Refresh System

**Behavior:**
- Refreshes every 5 minutes when tab is visible
- Pauses when tab is hidden (performance optimization)
- Resumes on tab visibility change

**Implementation:**
```javascript
// Check visibility before refresh
if (!document.hidden) {
  await getWeatherData();
}
```

## Global State Management

### currentWeatherData Object

**Structure:**
```javascript
{
  counties: {
    'Grafton': {
      temperature: 58,
      soilTemperature: 48,
      precipitation: 0.5,
      season: 'fall',
      lastUpdated: '2025-12-05T10:30:00Z'
    },
    // ... other counties
  },
  isLoading: false,
  error: null
}
```

### Accessing Weather Data

**From other modules:**
```javascript
import { currentWeatherData, getWeatherData } from './modules/weather.js';

// Access current data
const temp = currentWeatherData.counties['Grafton'].temperature;
const soilTemp = currentWeatherData.counties['Grafton'].soilTemperature;

// Force refresh
await getWeatherData();
```

## Error Handling

### Offline Scenarios
- Displays user-friendly error messages
- Retains last successful data
- Auto-retries on next refresh interval
- Provides fallback mode for offline use

### API Failures
- Catches and logs API errors
- Updates `currentWeatherData.error` state
- Shows error notification to user
- Continues app functionality with stale data

## Integration Points

### Used By
1. **mapCalculations.js** - Probability calculations based on weather
2. **interactions.js** - Displays weather in county detail modals
3. **foragingReports.js** - Logs weather conditions with success reports
4. **app.js** - Initializes on page load

### Dependencies
- **Open-Meteo API** - External weather data source
- **Browser Geolocation** (optional) - Could be added for user location

## Season Detection

**Seasons based on meteorological calendar:**
- **Spring:** March 1 - May 31
- **Summer:** June 1 - August 31
- **Fall:** September 1 - November 30
- **Winter:** December 1 - February 28/29

**Used for:**
- Species seasonal multipliers
- UI display
- Phenological predictions

## Performance Optimizations

1. **Cached API responses** - Prevents excessive API calls
2. **Visibility-based refresh** - Pauses when tab hidden
3. **Batch county updates** - Single API call for all counties
4. **Minimal DOM updates** - Only updates changed data

## Common Tasks

### Modify Soil Temperature Algorithm
1. Update calculation in `calculateSoilTemperature()` function
2. Add tests in `tests/unit/weather.test.js`
3. Verify probability calculations still work
4. Test with extreme conditions (cold, hot, wet, dry)

### Add New County
1. Add coordinates to `countyTowns` object
2. Update county mappings in `mapCalculations.js`
3. Add tests for new county
4. Update documentation

### Change Refresh Interval
```javascript
// In weather.js
const REFRESH_INTERVAL = 5 * 60 * 1000; // Change this value
```

## API Reference

### Open-Meteo API Endpoint
```
https://api.open-meteo.com/v1/forecast
?latitude={lat}
&longitude={lon}
&current=temperature_2m,precipitation,cloud_cover
&daily=precipitation_sum
&timezone=America/New_York
```

### Response Format
```json
{
  "current": {
    "temperature_2m": 15.2,
    "precipitation": 0.0,
    "cloud_cover": 45
  },
  "daily": {
    "precipitation_sum": [0.5, 1.2, 0.0, ...]
  }
}
```

## Debugging Tips

### Check Weather Data State
```javascript
// In browser console
console.log(window.currentWeatherData);
```

### Force Refresh
```javascript
// In browser console
await window.getWeatherData();
```

### Test Offline Mode
1. Open browser DevTools
2. Go to Network tab
3. Select "Offline" in throttling dropdown
4. Wait for next refresh cycle
5. Verify error handling works

## Future Enhancements

- **Forecast data** - 7-day predictions for planning
- **Historical data** - Compare current conditions to historical averages
- **User location** - Auto-select county based on GPS
- **Weather alerts** - Notify users of favorable conditions
- **Microclimate data** - Elevation-based temperature adjustments
