# GraniteFungiForager Testing Suite

This directory contains automated tests for the GraniteFungiForager application using Vitest.

## Test Framework

- **Framework:** [Vitest](https://vitest.dev/) v4.0.14
- **Environment:** jsdom (simulates browser DOM)
- **Coverage Tool:** c8
- **Test Runner:** Vitest CLI

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── unit/              # Unit tests for individual modules
│   └── weather.test.js
├── integration/       # Integration tests (coming soon)
├── helpers/          # Shared test utilities and mock data
│   └── mockData.js
├── setup.js          # Global test setup and mocks
└── README.md         # This file
```

## Current Test Coverage

### Weather Module (`weather.test.js`) - **26 tests**

#### ✅ `calculateSoilTemp()` - 13 tests
Tests the soil temperature calculation algorithm:
- Baseline calculation (8°F offset from air temp)
- Precipitation adjustments (cooler with rain)
- Humidity adjustments (warmer with high humidity, cooler with low humidity)
- Combined weather effects
- Extreme temperature handling
- Edge cases and validation

#### ✅ `getCurrentSeason()` - 5 tests
Tests season determination based on month:
- Spring (April-May)
- Summer (June-August)
- Fall (September-November)
- Winter (December-March)
- Boundary month handling

#### ✅ `countyTowns` - 4 tests
Validates county-to-coordinate mapping:
- All 10 NH counties present
- Valid GPS coordinates within NH boundaries
- Unique town names
- Specific county seats

#### ✅ `currentWeatherData` - 2 tests
Validates weather state structure:
- Required properties present
- Reasonable default values

#### ✅ `getWeatherData()` - 2 tests
Tests weather data retrieval:
- Required properties in response
- Default values in test environment

### Map Calculations Module (`mapCalculations.test.js`) - **48 tests**

#### ✅ `countyRegions` - 4 tests
Validates county-to-region mapping:
- All 10 NH counties mapped
- Valid NH geographic regions
- Specific county mappings (Grafton → White Mountains, etc.)
- No duplicate county keys

#### ✅ `calculateProbability()` - 28 tests
Tests multi-factor probability engine:
- Temperature factors (ideal range, penalties for extremes)
- Moisture factors (rainfall requirements)
- Seasonal multipliers (spring morels, summer chanterelles, fall boletes)
- Species-specific bonuses (morel spring bonus, chanterelle moisture bonus)
- Edge cases (missing data, null inputs, bounds checking)
- Multi-factor integration

#### ✅ `getProbabilityColor()` - 7 tests
Tests color-coding system:
- All probability ranges (0-20%, 20-40%, 40-60%, 60-80%, 80-100%)
- Edge case probabilities
- Valid hex color codes

#### ✅ `getCountyInfo()` - 6 tests
Tests county information aggregation:
- Required properties
- Correct region mapping
- Probability calculation
- Color assignment
- Weather data inclusion

#### ✅ `getTopSpeciesForCounty()` - 8 tests
Tests species ranking system:
- Species array structure
- Invalid county handling
- Sorting by probability
- Configurable topCount parameter
- Required properties for each species

### Authentication Module (`authentication.test.js`) - **56 tests**

#### ✅ `SimpleAuth` class - 45 tests
Tests authentication system for location data protection:
- Constructor initialization (storage key, initial auth state)
- `checkAuthStatus()` - session validation and expiry
- `authenticate()` - password validation (granite2024, forager123)
- `logout()` - session cleanup
- `hasLocationAccess()` - access control
- Session expiry (24-hour timeout)
- Modal system (`showLoginModal()`, `createLoginModal()`)
- DOM structure and styling
- Security considerations (case-sensitive, no password storage)

#### ✅ Global exports - 11 tests
Tests module exports:
- Global `auth` instance (singleton pattern)
- `requireAuth()` function
- Security validations

### Foraging Reports Module (`foragingReports.test.js`) - **84 tests**

#### ✅ `ForagingReport` class - 12 tests
Tests individual report structure:
- Constructor with defaults, partial data, and full data
- ID generation (uniqueness, format, timestamp)
- JSON serialization (all properties, correct types)
- Weather conditions handling
- Location details handling

#### ✅ `ForagingReportsManager` class - 72 tests
Tests ML pipeline data collection system:
- Constructor and initialization
- localStorage persistence (load/save with error handling)
- CRUD operations:
  - `addReport()` - report creation
  - `getAllReports()` - retrieve all reports
  - `getReportsByCounty()` - filter by county
  - `getReportsBySpecies()` - filter by species
  - `getReportsByDateRange()` - date range queries
- Statistical analysis:
  - `calculateAccuracyStats()` - overall, species-specific, county-specific accuracy
  - Average probabilities for successful/unsuccessful foraging
- Export functionality:
  - `exportReports()` - JSON export with metadata
  - `exportReportsCSV()` - CSV export with proper escaping
- Observer pattern (subscribe/unsubscribe/notify)
- Data management (`clearAllReports()`)
- Validation insights (`getValidationInsights()` - identifies low accuracy patterns)

## Test Results

**Latest Run:**
```
Test Files  4 passed (4)
Tests       214 passed (214)
Duration    ~4s
```

**Breakdown:**
- `weather.test.js`: 26 tests ✅
- `mapCalculations.test.js`: 48 tests ✅
- `authentication.test.js`: 56 tests ✅
- `foragingReports.test.js`: 84 tests ✅

## Writing New Tests

### 1. Create a new test file

```javascript
import { describe, test, expect } from 'vitest';
import { yourFunction } from '../../src/modules/yourModule.js';

describe('Your Module', () => {
  describe('yourFunction', () => {
    test('should do something', () => {
      const result = yourFunction(input);
      expect(result).toBe(expected);
    });
  });
});
```

### 2. Use mock data

Import shared mock data from `helpers/mockData.js`:

```javascript
import { mockWeatherData, mockSpeciesData } from '../helpers/mockData.js';
```

### 3. Mock DOM elements

For tests that interact with the DOM:

```javascript
import { beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <div id="my-element"></div>
  `;
});
```

### 4. Mock fetch requests

Global fetch is mocked in `setup.js`. Override in individual tests:

```javascript
import { vi } from 'vitest';

test('should fetch data', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({ data: 'mock' })
    })
  );

  // Your test code
});
```

### 5. Mock system time

For testing date/time-dependent code:

```javascript
import { vi } from 'vitest';

test('should check season', () => {
  vi.setSystemTime(new Date('2024-06-15')); // Summer
  expect(getCurrentSeason()).toBe('summer');
});
```

## Testing Best Practices

### ✅ DO:
- **Test pure functions first** - Functions without side effects are easiest to test
- **Use descriptive test names** - "should calculate soil temp with precipitation"
- **Test edge cases** - Zero values, extreme values, null/undefined
- **Group related tests** - Use nested `describe()` blocks
- **Keep tests focused** - One assertion per test when possible
- **Use mock data** - Share common fixtures in `helpers/mockData.js`
- **Clean up after tests** - The global `afterEach()` in `setup.js` handles this

### ❌ DON'T:
- **Don't test implementation details** - Test behavior, not internals
- **Don't make tests dependent** - Each test should run independently
- **Don't use real API calls** - Mock all external dependencies
- **Don't ignore failing tests** - Fix or remove them
- **Don't test third-party code** - Only test your own code

## Next Steps: Expanding Test Coverage

### ✅ Completed - High Priority (Core Business Logic)
1. **✅ `weather.js`** - Weather data integration (26 tests)
   - Temperature and moisture calculations
   - Season determination
   - County coordinates mapping

2. **✅ `mapCalculations.js`** - Probability calculation engine (48 tests)
   - Multi-factor probability calculations
   - Color code mapping
   - Species ranking and county information

3. **✅ `authentication.js`** - Security-critical functionality (56 tests)
   - Password validation
   - Session expiry logic
   - localStorage interactions
   - Modal system

4. **✅ `foragingReports.js`** - Data integrity for ML pipeline (84 tests)
   - Report CRUD operations
   - Accuracy calculations
   - Data serialization (JSON/CSV)
   - Observer pattern
   - Validation insights

### 🔄 In Progress - Medium Priority
5. **`species.js`** - Data validation
   - Species data structure completeness
   - Temperature ranges validity
   - Regional probability weights
   - All 29 DHHS Tier 1 species validation

6. **`iNaturalistIntegration.js`** - API integration
   - Request formatting
   - Response parsing
   - Error handling
   - Rate limiting

### ⏳ Pending - Lower Priority
7. **`interactions.js`** - DOM-heavy UI logic
8. **`publicLands.js`** - Location data retrieval

## Coverage Goals

- **Core Logic:** ✅ **90%+ achieved** (weather, mapCalculations, authentication, foragingReports)
- **Data Management:** 🔄 **In progress** (foragingReports ✅, species pending)
- **Utilities:** 70%+ (helpers, mapping functions)
- **UI/DOM:** 40%+ (interactions, display functions)
- **Overall Target:** 🎯 **~60% achieved**, targeting 70%

### Current Test Statistics
- **Total Test Files:** 4
- **Total Tests:** 214
- **Modules Tested:** 4/11 (36%)
- **High-Priority Modules:** 4/4 (100%) ✅
- **All Tests Passing:** ✅ 214/214

## Continuous Integration

**GitHub Actions CI/CD is configured and running!** ✅

The project uses GitHub Actions to automatically run tests on every push and pull request.

### Current Setup

**Workflow:** `.github/workflows/test.yml`

**Runs on:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**Test Matrix:**
- Node.js 18.x, 20.x, 22.x
- Ubuntu latest

**Jobs:**
1. **Test** - Runs test suite on all Node versions
2. **Lint Check** - Validates code structure and package.json
3. **Security Audit** - Checks for vulnerabilities in dependencies
4. **Test Summary** - Aggregates results and reports status

**Artifacts:**
- Coverage reports saved for 30 days
- Download from Actions → Workflow run → Artifacts

### Status Badge

Check current test status: [![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml)

### For Contributors

**Before submitting a PR:**
```bash
# Run tests locally
npm test

# Generate coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**CI will automatically:**
- Run all 26 tests
- Generate coverage reports
- Check for security vulnerabilities
- Report status on your PR

See `.github/CICD.md` for detailed CI/CD documentation.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [jsdom Documentation](https://github.com/jsdom/jsdom)
- [CLAUDE.md - Testing Section](../CLAUDE.md#tests)

## Questions?

For questions or issues with tests:
1. Check this README first
2. Review existing tests in `unit/weather.test.js` for examples
3. Consult [Vitest documentation](https://vitest.dev/)
4. Open an issue on GitHub
