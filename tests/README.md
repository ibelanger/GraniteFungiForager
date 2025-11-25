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

## Test Results

**Latest Run:**
```
Test Files  1 passed (1)
Tests       26 passed (26)
Duration    ~3s
```

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

### High Priority (Core Business Logic)
1. **`mapCalculations.js`** - Probability calculation engine
   - `calculateProbability()` - Multi-factor probability calculations
   - `getProbabilityColor()` - Color code mapping
   - `getTopSpeciesForCounty()` - Species ranking

2. **`authentication.js`** - Security-critical functionality
   - Password validation
   - Session expiry logic
   - localStorage interactions

3. **`foragingReports.js`** - Data integrity for ML pipeline
   - Report CRUD operations
   - Accuracy calculations
   - Data serialization

### Medium Priority
4. **`species.js`** - Data validation
   - Species data structure completeness
   - Temperature ranges validity
   - Regional probability weights

5. **`iNaturalistIntegration.js`** - API integration
   - Request formatting
   - Response parsing
   - Error handling

### Lower Priority
6. **`interactions.js`** - DOM-heavy UI logic
7. **`publicLands.js`** - Location data retrieval

## Coverage Goals

- **Core Logic:** 90%+ (mapCalculations, weather, authentication)
- **Data Management:** 80%+ (foragingReports, species)
- **Utilities:** 70%+ (helpers, mapping functions)
- **UI/DOM:** 40%+ (interactions, display functions)
- **Overall Target:** 70% code coverage

## Continuous Integration

To run tests in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

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
