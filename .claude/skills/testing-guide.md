---
name: testing-guide
description: Comprehensive testing guide for GraniteFungiForager - includes Vitest setup, test structure, coverage reporting, and debugging strategies
triggers:
  - test
  - vitest
  - coverage
  - "npm test"
  - "test:watch"
  - "test:ui"
  - debugging tests
  - test failure
  - unit test
  - integration test
---

# Testing Guide - GraniteFungiForager

## Development Commands

### Local Development Server
```bash
npm run dev
# or
python -m http.server 8000
```
Then open http://localhost:8000

### Production Server
```bash
npm start
```

### Running Tests
```bash
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode (re-run on changes)
npm run test:ui         # Run tests with interactive UI
npm run test:coverage   # Run tests with coverage report
```

## Testing Infrastructure

- **Framework:** Vitest 4.0.14 with jsdom environment
- **Total Tests:** 470 comprehensive tests
- **Pass Rate:** 468 passing, 2 skipped for jsdom limitations (100% pass rate)
- **Coverage Tool:** @vitest/coverage-v8
- **Test Duration:** ~5 seconds for full suite

## Module Test Coverage

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

## Test Structure

```
tests/
├── unit/              # 8 comprehensive test files
├── helpers/           # Mock data and test utilities
├── setup.js           # Global test configuration
└── README.md          # Detailed test documentation
```

## Testing Guidelines

### Writing New Tests

1. **Test Files:** Located in `tests/unit/` matching module names (e.g., `weather.test.js`)
2. **Mock Data:** Shared mocks in `tests/helpers/mockData.js`
3. **Coverage:** Aim for 100% coverage on new modules
4. **Test Structure:** Use `describe` blocks for grouping, clear test names
5. **Assertions:** Use Vitest's `expect` API with descriptive messages

### Test File Template

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { functionToTest } from '../src/modules/yourModule.js';

describe('Module Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('functionToTest', () => {
    it('should handle normal case', () => {
      const result = functionToTest(input);
      expect(result).toBe(expected);
    });

    it('should handle edge case', () => {
      const result = functionToTest(edgeInput);
      expect(result).toBe(edgeExpected);
    });

    it('should throw error for invalid input', () => {
      expect(() => functionToTest(invalid)).toThrow();
    });
  });
});
```

## Debugging Tests

### Local Debugging

1. **Browser Console:** Check console for errors (F12)
2. **Run Specific Test:** `npx vitest tests/unit/modulename.test.js`
3. **Interactive UI:** `npm run test:ui` for visual debugging
4. **Watch Mode:** `npm run test:watch` to re-run on changes

### Common Debug Patterns

```javascript
// Check global state
console.log(currentWeatherData);

// Verify authentication
console.log(authManager.isAuthenticated());

// Inspect DOM state
console.log(document.querySelector('#elementId'));

// Mock inspection
console.log(vi.mocked(mockFunction).mock.calls);
```

### Debugging CI Test Failures

**Test failures in CI but pass locally:**
- Check Node version matches CI (18.x, 20.x, or 22.x)
- Clear and reinstall: `rm -rf node_modules && npm ci`
- Check for environment-specific code (timezones, file paths)
- Review detailed logs in GitHub Actions

**Common Issues:**
- Date/time tests may fail due to timezone differences
- File path separators differ on Windows vs Linux
- Node version differences in async behavior

## Coverage Reporting

### Generate Coverage Report

```bash
npm run test:coverage
```

This generates reports in multiple formats:
- **Text:** Console output summary
- **HTML:** `coverage/index.html` (open in browser for detailed view)
- **LCOV:** `coverage/lcov.info` (for CI integration)
- **JSON:** `coverage/coverage-final.json` (for programmatic access)

### Coverage Artifacts in CI

- Generated on Node.js 20.x only
- Access: Download from Actions → Workflow run → Artifacts
- Retention: 30 days

## Performance Testing

### Current Benchmarks

- **Full test suite:** ~5 seconds
- **Individual module:** <1 second
- **Watch mode startup:** ~2 seconds
- **Coverage generation:** +2 seconds overhead

### Optimization Tips

1. Use `test.skip()` for long-running tests during development
2. Use `test.only()` to focus on specific tests
3. Mock heavy dependencies (API calls, DOM operations)
4. Use `beforeEach` for setup, `afterEach` for cleanup
5. Avoid global state mutations between tests

## Best Practices

### Test Organization
- **One describe block per function/component**
- **Group related tests** (normal cases, edge cases, errors)
- **Clear test names:** "should [expected behavior] when [condition]"
- **Arrange-Act-Assert pattern** in each test

### Mocking Strategy
- **Mock external APIs** (Open-Meteo, iNaturalist)
- **Mock localStorage/sessionStorage** for storage tests
- **Mock timers** for date/time-dependent tests
- **Use test helpers** from `tests/helpers/mockData.js`

### Edge Cases to Test
- **Null/undefined inputs**
- **Empty arrays/objects**
- **Extreme values** (very high/low temperatures, dates)
- **Network failures** (offline scenarios)
- **Authentication states** (logged in/out)

## Integration with CI/CD

Tests run automatically on:
- **Push to:** `main`, `develop`, `claude/**` branches
- **Pull requests to:** `main`, `develop` branches

For CI/CD details, see the `cicd-guide` skill.

## Quick Reference

### Essential Test Commands
```bash
npm test                  # Run all 470 tests
npm run test:watch        # Watch mode for development
npm run test:ui           # Interactive test UI
npm run test:coverage     # Generate coverage reports
npx vitest run --reporter=verbose  # Detailed output
```

### Test File Locations
- Unit tests: `tests/unit/*.test.js`
- Test helpers: `tests/helpers/mockData.js`
- Test setup: `tests/setup.js`
- Config: `vitest.config.js`

### Coverage Goals
- **Target:** 100% coverage on new modules
- **Current:** 468/470 tests passing (99.6%)
- **Threshold:** All tests must pass before merge
