# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GraniteFungiForager v3.2** is a client-side web application that provides interactive probability maps for foraging New Hampshire's official DHHS Tier 1 wild mushroom species. The application combines real-time weather data with mycological expertise to calculate county-specific foraging probabilities.

**Live Application:** https://ibelanger.github.io/GraniteFungiForager/

## Development Commands

- **Local Development Server:**
  ```bash
  npm run dev
  # or
  python -m http.server 8000
  ```
  Then open http://localhost:8000

- **Start Production Server:**
  ```bash
  npm start
  ```

- **Tests:** Currently no test framework is configured. Tests would need to be set up if adding functionality.

## Architecture Overview

### Core Structure
The application uses **modular ES6 JavaScript** with a clean separation of concerns:

- **Entry Point:** `index.html` + `app.js` (main application controller)
- **Module System:** ES6 imports/exports with client-side modules
- **No Build Process:** Pure client-side application with no compilation step
- **No Framework Dependencies:** Vanilla HTML/CSS/JavaScript only

### Key Modules (`src/modules/`)

1. **`weather.js`** - Weather data integration
   - Fetches real-time weather from Open-Meteo API 
   - County-to-coordinate mapping for all 10 NH counties
   - Calculates soil temperature from air temperature and precipitation
   - Auto-refresh system (5-minute intervals)

2. **`species.js`** - Species database and identification
   - Complete DHHS Tier 1 species data (29 species including subspecies variations)
   - Specialized support for Boletus 7-species group and Hedgehog 3-subgenera
   - Temperature ranges, moisture requirements, seasonal multipliers
   - Host tree associations and microhabitat preferences

3. **`mapCalculations.js`** - Probability engine
   - Multi-factor probability calculations (weather + region + season)
   - County-to-region mapping for NH geographic zones
   - Temperature, moisture, and seasonal weighting algorithms

4. **`interactions.js`** - UI interactions and modal system
   - County click handlers for detailed recommendations
   - Species selection and real-time map updates
   - Modal system for county details with accessibility features

5. **`publicLands.js`** - Location recommendations
   - GPS coordinates for public foraging locations
   - Access information and permit requirements

### Data Flow
1. **Weather Module** fetches real-time data and updates global state
2. **Map Calculations** processes weather + species data → probability scores
3. **UI Interactions** updates map colors and handles user interactions
4. **Species Display** shows dynamic information cards based on selections

### Key Features
- **Interactive SVG County Map:** Clean grid layout (4 rows × 3 columns) representing NH counties
- **Real-time Weather Integration:** County-specific weather data with auto-refresh
- **Species Information Cards:** Dynamic display with identification notes and foraging tips
- **Accessibility:** ARIA labels, keyboard navigation, modal system
- **Mobile Responsive:** Touch-friendly interface for field use
- **Offline Capability:** Service worker registration (HTTPS only)

## Machine Learning Pipeline

The `src/ml/accuracy-improvement-pipeline.js` contains a framework for improving prediction accuracy from 60-70% to 85-90% through:
- User success tracking and validation
- iNaturalist API integration for observation data
- Expert validation systems
- Academic research integration
- Species-specific analyzers for complex groups (Boletus, Hedgehog, etc.)

## Important Technical Notes

### Weather API Integration
- Uses Open-Meteo API (no API key required)
- County coordinates hardcoded in `weather.js:countyTowns`
- Soil temperature calculated algorithmically from air temperature + precipitation
- Error handling for offline/API failure scenarios

### Species Data Structure
- Each species has `tempRange`, `moistureMin`, `seasonMultiplier`, and `regions` properties
- Regional probability weights for 7 NH geographic regions
- Specialized handling for subspecies groups (Boletus edulis complex, Hedgehog subgenera)

### Map Implementation
- Clean rectangular county grid (no overlapping polygons)
- Geographic accuracy: Coos → Grafton/Belknap/Carroll → Sullivan/Merrimack/Strafford → Cheshire/Hillsborough/Rockingham
- Color-coded probability visualization with smooth transitions
- Icons show geographic features (mountains 🏔️, lakes 🌊, forests 🌲, coast 🌊)

### Performance Considerations
- Auto-refresh pauses when tab is not visible
- Weather data cached to prevent excessive API calls
- Modal system with proper cleanup and event management
- Responsive design optimized for mobile field use

## Safety and Compliance

The application includes comprehensive safety warnings and follows responsible foraging practices:
- Never eat unidentified mushrooms warning
- Local regulations and permit requirements
- Sustainable harvesting practices
- Multiple expert source consultation recommendations