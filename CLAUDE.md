# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GraniteFungiForager v3.3.0** is a client-side web application that provides interactive probability maps for foraging New Hampshire's official DHHS Tier 1 wild mushroom species. The application combines real-time weather data with mycological expertise to calculate county-specific foraging probabilities, with conservation-focused authentication protecting sensitive location data.

**Live Application:** https://ibelanger.github.io/GraniteFungiForager/

### Recent Enhancements (December 2025)

**Research-Backed Data Integration:** The application now incorporates peer-reviewed mycological research for improved foraging accuracy:

- **Enhanced Species Data:** Added detailed research-backed fields to key species:
  - `optimalSoilTemp` - Precise temperature ranges with confidence levels and sources
  - `soilPH` - pH requirements with NH-specific notes
  - `precipitationWindow` - 30-day correlation windows vs. simple "days after rain"
  - `elevationRange` - Elevation-based phenological delays
  - `hostTreeFrequencies` - Percentage-based host tree associations
  - `phenologyNH` - NH-specific timing data
  - `confidenceLevel` - Data quality indicators (High/Medium/Low)
  - `safetyRating` - Safety classifications with critical warnings

- **Enhanced Probability Calculations:** New research-backed multipliers in `mapCalculations.js`:
  - **Oak Proximity Multiplier** - Critical for Maitake and Milk Caps (oakMandatory flag)
  - **Moss Association Multiplier** - Boosts for Black Trumpets in high-rainfall areas
  - **Species-Specific Optimal Ranges** - Precise temperature windows for each species
  - **Regional Soil pH Considerations** - NH granite soil challenges factored in

- **Primary Research Sources:**
  - MushroomExpert.com (Michael Kuo) - Species identification and ecology
  - USDA PNW-GTR-576 (Pilz et al. 2003) - Chanterelle ecology
  - Mihail 2014 McIlvainea - Morel soil temperature thresholds
  - boletes.wpamushroomclub.org - Boletus edulis complex identification
  - PMC peer-reviewed studies - Cultivation and field data

- **Species Enhanced with Research Data:**
  - Morels (Morchella spp.) - HIGH confidence
  - Chanterelles (Cantharellus cibarius complex) - HIGH confidence
  - Matsutake (Tricholoma magnivelare) - MEDIUM confidence
  - Maitake (Grifola frondosa) - HIGH confidence for oak association
  - Lobster Mushroom (Hypomyces lactifluorum) - MEDIUM-HIGH confidence
  - Milk Caps (Lactifluus volemus, L. corrugis, L. hygrophoroides) - HIGH confidence
  - Black Trumpets (Craterellus fallax) - MEDIUM-HIGH confidence

- **Future Work Noted:**
  - Toxic lookalike species data (planned for future revision)
  - GPS marking feature for perennial species like Maitake (handled in separate tool)

**All 468 tests continue to pass** - enhancements are backward-compatible and non-breaking.

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

- **Run Tests:**
  ```bash
  npm test                # Run all tests once
  npm run test:watch      # Run tests in watch mode (re-run on changes)
  npm run test:ui         # Run tests with interactive UI
  npm run test:coverage   # Run tests with coverage report
  ```

- **Testing Infrastructure:**
  - Framework: Vitest 4.0.14 with jsdom environment
  - 470 comprehensive tests (468 passing, 2 skipped for jsdom limitations)
  - 100% pass rate across all 8 core modules
  - Complete test documentation in `tests/README.md`

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
   - **Tests:** 26 tests covering soil temp calculations, season detection, county mappings

2. **`species.js`** - Species database and identification
   - Complete DHHS Tier 1 species data (29 species including subspecies variations)
   - Specialized support for Boletus 7-species group and Hedgehog 3-subgenera
   - Temperature ranges, moisture requirements, seasonal multipliers
   - Host tree associations and microhabitat preferences
   - **NEW (Dec 2025):** Research-enhanced data fields:
     - Optimal soil temperature with confidence levels and sources
     - Soil pH requirements with NH-specific challenges
     - Precipitation windows (7-30 day correlations)
     - Elevation ranges with phenological delays
     - Host tree frequencies with percentage associations
     - NH-specific phenology timing
     - Confidence levels and safety ratings
   - **Tests:** 62 tests validating all species data and edge cases

3. **`mapCalculations.js`** - Probability engine
   - Multi-factor probability calculations (weather + region + season)
   - County-to-region mapping for NH geographic zones
   - Temperature, moisture, and seasonal weighting algorithms
   - **Tests:** 48 tests covering probability calculations and color coding

4. **`interactions.js`** - UI interactions and modal system
   - County click handlers for detailed recommendations
   - Species selection and real-time map updates
   - Modal system for county details with accessibility features
   - Top 5 species rankings per county with visual indicators
   - **Tests:** 67 tests for UI interactions, modals, and event handling

5. **`publicLands.js`** - Location recommendations
   - GPS coordinates for public foraging locations (authentication protected)
   - Access information and permit requirements
   - Integration with authentication system for conservation
   - **Tests:** 65 tests covering all 10 counties and authentication integration

6. **`authentication.js`** - Location data protection
   - Password-based authentication for sensitive GPS coordinates
   - 24-hour session management with localStorage
   - Conservation-focused access control system
   - Modal interface for seamless user experience
   - **Tests:** 56 tests for authentication flow, session management, and security

7. **`foragingReports.js`** - User success tracking and validation
   - Community data collection for ML accuracy improvement
   - Success/failure tracking with species, location, and conditions
   - Data validation and storage management
   - Integration with iNaturalist for observation validation
   - **Tests:** 84 tests covering data collection, validation, and storage

8. **`iNaturalistIntegration.js`** - External observation data
   - iNaturalist API integration for real-world observation data
   - Intelligent caching system (24-hour cache with exponential backoff)
   - Species mapping to DHHS Tier 1 species
   - Rate limiting and error handling
   - **Tests:** 60 tests for API integration, caching, and error scenarios

9. **`speciesMapping.js`** - Species name normalization
   - Maps iNaturalist scientific names to internal species IDs
   - Handles subspecies variations and common name mappings
   - Supports Boletus complex and Hedgehog subgenera variations

10. **`observationAnalysis.js`** - ML data analysis
    - Analyzes iNaturalist observation patterns
    - Species distribution and seasonal timing analysis
    - Geographic clustering and habitat preference detection

11. **`speciesCoverageAudit.js`** - Data quality assurance
    - Audits species data completeness across all DHHS Tier 1 species
    - Validates temperature ranges, moisture requirements, regional data
    - Generates reports on missing or inconsistent data

### Data Flow
1. **Weather Module** fetches real-time data and updates global state
2. **Map Calculations** processes weather + species data → probability scores
3. **UI Interactions** updates map colors and handles user interactions
4. **Species Display** shows dynamic information cards based on selections

### Key Features
- **Interactive SVG County Map:** Clean grid layout (4 rows × 3 columns) representing NH counties
- **Real-time Weather Integration:** County-specific weather data with auto-refresh
- **Species Information Cards:** Dynamic display with identification notes and foraging tips
- **Authentication System:** Password protection for sensitive GPS coordinates and trail data
- **Community Data Collection:** User success tracking, iNaturalist integration, analytics dashboard
- **Conservation Focus:** Protects sensitive locations while maintaining educational access
- **Accessibility:** ARIA labels, keyboard navigation, modal system
- **Mobile Responsive:** Touch-friendly interface for field use
- **Modern Design:** Google Fonts integration (Crimson Pro, DM Mono, Newsreader) with mushroom-themed aesthetics
- **Offline Capability:** Service worker registration (HTTPS only)

### Testing & Quality Assurance (v3.3.0)

The project has achieved **100% test coverage** across all core modules:

#### Test Suite Overview
- **Total Tests:** 470 tests (468 passing, 2 skipped)
- **Pass Rate:** 100% on all testable functionality
- **Test Duration:** ~5 seconds for full suite
- **Coverage Tool:** @vitest/coverage-v8

#### Module Test Coverage
| Module | Tests | Key Areas |
|--------|-------|-----------|
| weather.js | 26 | Soil temp calculations, season detection, county mappings |
| mapCalculations.js | 48 | Probability engine, temperature/moisture factors, color coding |
| authentication.js | 56 | Login flow, session management, security validation |
| foragingReports.js | 84 | Data collection, validation, storage, ML integration |
| species.js | 62 | Species data validation, DHHS Tier 1 compliance |
| iNaturalistIntegration.js | 60 | API integration, caching, rate limiting, error handling |
| publicLands.js | 65 | All 10 counties, authentication integration, data protection |
| interactions.js | 67 | UI interactions, modals, event handling, accessibility |

#### Test Structure
```
tests/
├── unit/              # 8 comprehensive test files
├── helpers/           # Mock data and test utilities
├── setup.js           # Global test configuration
└── README.md          # Detailed test documentation
```

#### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode for development
npm run test:ui         # Interactive test UI
npm run test:coverage   # Generate coverage reports
```

### CI/CD Pipeline

#### GitHub Actions Workflows

**Test Workflow** (`.github/workflows/test.yml`):

The test workflow ensures code quality through automated testing on every push and pull request.

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

1. **test** - Matrix testing across Node.js versions
   - **Strategy:** Tests on Node 18.x, 20.x, and 22.x
   - **Steps:**
     - Checkout code
     - Setup Node.js with npm caching
     - Install dependencies (`npm ci`)
     - Run test suite (`npm test`)
     - Generate coverage report (Node 20.x only)
     - Upload coverage artifacts (30-day retention)
   - **Test Results:** 470 tests (468 passing, 2 skipped)
   - **Duration:** ~5 seconds

2. **lint-check** - Code quality validation
   - Validates package.json structure
   - Future: ESLint integration (commented out, ready to enable)
   - Future: Prettier formatting checks

3. **dependency-audit** - Security scanning
   - Runs `npm audit` at moderate+ severity level
   - Checks for outdated dependencies (informational)
   - Continues on error to avoid blocking on non-critical issues

4. **test-summary** - Results aggregation
   - Depends on: test, lint-check, dependency-audit
   - Reports pass/fail status for each job
   - Fails pipeline if critical tests fail
   - Blocks merge if required checks don't pass

**Coverage Reports:**
- Generated on Node.js 20.x only
- Formats: text, HTML, LCOV, JSON
- Access: Download from Actions → Workflow run → Artifacts
- Retention: 30 days

**Deploy Workflow** (`.github/workflows/deploy.yml`):
- **Trigger:** Push to `main` branch
- **Target:** GitHub Pages (https://ibelanger.github.io/GraniteFungiForager/)
- **Process:**
  - Checkout code
  - Deploy to gh-pages branch
  - Jekyll disabled (.nojekyll file)
- **Result:** Zero-downtime automated deployment

#### Status Badges

The README displays live build status:
```markdown
[![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)]
```

**Badge States:**
- 🟢 Passing - All tests passed
- 🔴 Failing - One or more tests failed
- 🟡 In Progress - Tests currently running

#### Local Testing Before Push

**Run tests locally to catch issues early:**
```bash
# Run all tests
npm test                  # 470 tests in ~5 seconds

# Watch mode (re-run on changes)
npm run test:watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

#### Pull Request Requirements

For a PR to be merged:
1. ✅ All 470 tests must pass
2. ✅ Lint checks must pass
3. ✅ No critical security vulnerabilities
4. ✅ Code review approval
5. 📊 Coverage should not decrease (recommended)

#### Troubleshooting CI Failures

**Test failures in CI but pass locally:**
- Check Node version matches CI (18.x, 20.x, or 22.x)
- Clear and reinstall: `rm -rf node_modules && npm ci`
- Check for environment-specific code (timezones, file paths)
- Review detailed logs in GitHub Actions

**Common Issues:**
- Date/time tests may fail due to timezone differences
- File path separators differ on Windows vs Linux
- Node version differences in async behavior

#### Development Best Practices
- All tests must pass before merging
- Coverage reports generated on Node 20.x
- Security audits run automatically on every push
- Multi-version Node.js compatibility ensured
- Workflow uses npm caching for faster builds (30-60s speedup)
- Matrix strategy with `fail-fast: false` continues testing all versions

## Machine Learning Pipeline

The `src/ml/accuracy-improvement-pipeline.js` contains a **completed framework** for improving prediction accuracy from 60-70% to 85-90% through:
- ✅ User success tracking and validation (`foragingReports.js` - **IMPLEMENTED**)
- ✅ iNaturalist API integration for observation data (`iNaturalistIntegration.js` - **IMPLEMENTED**)  
- ⏳ Expert validation systems (framework exists, partnerships needed)
- ⏳ Academic research integration (ongoing literature review)
- ✅ Species-specific analyzers for complex groups (Boletus, Hedgehog, etc. - **IMPLEMENTED**)

**Current Status:** All technical infrastructure is complete and deployed. The system is ready for data collection and model training once sufficient user reports are gathered.

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
- Modern styling with Google Fonts: Crimson Pro (headers), Newsreader (body), DM Mono (code)
- Mushroom-themed aesthetic with earthy color palette

### Authentication System
- Uses simple password-based authentication (`granite2024`, `forager123`)
- Client-side only implementation suitable for conservation purposes (not high-security)
- 24-hour session persistence using localStorage with automatic cleanup
- Event-driven UI updates (`authStateChanged` custom events)
- Protected data: GPS coordinates, trail names, parking locations, contact information
- Public data: Climate information, soil types, elevation ranges, seasonal timing

### Performance Considerations
- Auto-refresh pauses when tab is not visible
- Weather data cached to prevent excessive API calls
- Modal system with proper cleanup and event management
- Responsive design optimized for mobile field use
- Authentication state managed efficiently with minimal storage footprint

## Coding Conventions & Best Practices

### Module Structure
- **ES6 Modules:** All modules use `export` and `import` statements
- **No Build Step:** Code runs directly in browser (no transpilation)
- **Global State:** Managed through exported objects (e.g., `currentWeatherData` in weather.js)
- **Event-Driven:** Custom events for cross-module communication (e.g., `authStateChanged`)

### Code Style
- **Function Documentation:** JSDoc comments for all public functions
- **Naming Conventions:**
  - camelCase for functions and variables
  - PascalCase for classes (e.g., `SimpleAuth`, `MushroomApp`)
  - UPPER_CASE for constants
- **Error Handling:** Try-catch blocks with user-friendly error messages
- **Async/Await:** Preferred over promise chains for readability

### Testing Guidelines
- **Test Files:** Located in `tests/unit/` matching module names (e.g., `weather.test.js`)
- **Mock Data:** Shared mocks in `tests/helpers/mockData.js`
- **Coverage:** Aim for 100% coverage on new modules
- **Test Structure:** Use `describe` blocks for grouping, clear test names
- **Assertions:** Use Vitest's `expect` API with descriptive messages

### Adding New Features
1. **Create Module:** Add to `src/modules/` with clear single responsibility
2. **Write Tests First:** Create test file in `tests/unit/` before implementation
3. **Update Documentation:** Add to this CLAUDE.md file
4. **Import in app.js:** Add initialization in main application controller
5. **Run Tests:** Ensure all tests pass (`npm test`)
6. **Manual Testing:** Test in browser with `npm run dev`

### Common Patterns

#### Weather Data Access
```javascript
import { currentWeatherData, getWeatherData } from './modules/weather.js';
// Access current data
const temp = currentWeatherData.counties['Grafton'].temperature;
```

#### Authentication Checks
```javascript
import { authManager } from './modules/authentication.js';
if (authManager.isAuthenticated()) {
  // Show protected data
}
```

#### Modal Display
```javascript
import { showModal, hideModal } from './modules/interactions.js';
showModal('Title', 'Content HTML');
```

### File Organization
```
GraniteFungiForager/
├── index.html                    # Main entry point
├── app.js                        # Application controller
├── package.json                  # Dependencies and scripts
├── vitest.config.js              # Test configuration
├── .github/workflows/            # CI/CD pipelines
│   ├── test.yml                  # Automated testing
│   └── deploy.yml                # GitHub Pages deployment
├── src/
│   ├── styles.css                # Main stylesheet (modern design)
│   ├── modules/                  # Feature modules (11 files)
│   │   ├── weather.js            # Weather integration
│   │   ├── species.js            # Species database
│   │   ├── mapCalculations.js   # Probability engine
│   │   ├── interactions.js       # UI interactions
│   │   ├── publicLands.js        # Location data
│   │   ├── authentication.js     # Auth system
│   │   ├── foragingReports.js    # User data collection
│   │   ├── iNaturalistIntegration.js  # External API
│   │   ├── speciesMapping.js     # Name normalization
│   │   ├── observationAnalysis.js     # ML analysis
│   │   └── speciesCoverageAudit.js    # Data QA
│   └── ml/
│       └── accuracy-improvement-pipeline.js  # ML framework
├── tests/
│   ├── unit/                     # 8 test files (470 tests)
│   ├── helpers/                  # Mock data
│   ├── setup.js                  # Test configuration
│   └── README.md                 # Test documentation
├── docs/
│   ├── design-system/
│   │   └── GraniteFungiForager_UI_Design_System_v2_MASTER.md
│   └── archive/                  # Archived historical documents
│       └── Project_Roadmap_UI_Planning_ARCHIVED.md
├── CLAUDE.md                     # This file (Development guidance)
├── README.md                     # User documentation
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidelines
├── ACCURACY_IMPROVEMENT_PLAN.md  # ML roadmap
├── CODE_OF_CONDUCT.md            # Community guidelines
└── LICENSE                       # MIT License
```

## Safety and Compliance

The application includes comprehensive safety warnings and follows responsible foraging practices:
- Never eat unidentified mushrooms warning
- Local regulations and permit requirements
- Sustainable harvesting practices
- Multiple expert source consultation recommendations

## Version History

- **v3.3.0** (December 2025) - 100% test coverage, 470 comprehensive tests, modern styling
- **v3.2.1** (August 2025) - Authentication system for location data protection
- **v3.2.0** (August 2025) - Top 5 rankings, expanded species database (29 species)
- **v3.1.0** - Community data collection, iNaturalist integration
- **v3.0.0** - Initial ML pipeline framework

## Quick Reference for AI Assistants

### When Adding Features
1. Always run tests first: `npm test`
2. Create test file before implementing feature
3. Follow ES6 module pattern (no build step required)
4. Update this CLAUDE.md with new module documentation
5. Ensure tests pass before committing
6. Check browser compatibility (Chrome, Firefox, Safari, Edge)

### When Debugging
1. Check browser console for errors (F12)
2. Run specific test file: `npx vitest tests/unit/modulename.test.js`
3. Use `npm run test:ui` for interactive debugging
4. Check `currentWeatherData` and other global state objects
5. Verify authentication state with `authManager.isAuthenticated()`

### When Modifying Calculations
1. Update tests in corresponding test file first
2. Verify probability ranges stay 0-100%
3. Check edge cases (null data, extreme temperatures, etc.)
4. Test with different species and counties
5. Validate color coding updates correctly

### Common Tasks
- **Add new species:** Update `src/modules/species.js` and add tests
- **Modify probability calculation:** Update `src/modules/mapCalculations.js` and tests
- **Change styling:** Edit `src/styles.css` (no build step needed)
- **Add county data:** Update `publicLands.js` with new location
- **Fix authentication:** Check `authentication.js` and localStorage state