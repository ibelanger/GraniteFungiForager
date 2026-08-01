/**
 * Tests for weather.js module
 * Testing weather calculations and data fetching
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  calculateSoilTemp,
  getCurrentSeason,
  countySamplePoints,
  currentWeatherData,
  getWeatherData,
  median,
  aggregateCountyWeather,
  fetchWeatherData,
  countyWeatherData,
  updateWeatherDisplay,
  toggleWeatherMode,
  findSiteWeather,
  getStatewideWeather
} from '../../src/modules/weather.js';
import { mockWeatherData, mockOpenMeteoResponse, mockOpenMeteoBatchResponse, createMockFetch } from '../helpers/mockData.js';

describe('Weather Module', () => {

  describe('calculateSoilTemp', () => {

    test('should calculate baseline soil temp (8°F cooler than air)', () => {
      // With no precipitation and moderate humidity, soil should be ~8°F cooler
      const result = calculateSoilTemp(70, 70, 0);
      expect(result).toBe(62); // 70 - 8 = 62
    });

    test('should adjust for precipitation (cooler with rain)', () => {
      const dryResult = calculateSoilTemp(70, 70, 0);
      const wetResult = calculateSoilTemp(70, 70, 2.0);

      expect(wetResult).toBeLessThan(dryResult);
      // With 2" precipitation: 70 - 8 - min(5, 2*2) = 70 - 8 - 4 = 58
      expect(wetResult).toBe(58);
    });

    test('should cap precipitation adjustment at 5°F', () => {
      const result = calculateSoilTemp(70, 70, 10); // Extreme rain
      // Should cap at: 70 - 8 - 5 = 57
      expect(result).toBe(57);
    });

    test('should adjust for high humidity (warmer with >80% humidity)', () => {
      const normalResult = calculateSoilTemp(70, 70, 0);
      const humidResult = calculateSoilTemp(70, 85, 0);

      expect(humidResult).toBeGreaterThan(normalResult);
      // 70 - 8 + 2 = 64
      expect(humidResult).toBe(64);
    });

    test('should adjust for low humidity (cooler with <50% humidity)', () => {
      const normalResult = calculateSoilTemp(70, 70, 0);
      const dryAirResult = calculateSoilTemp(70, 40, 0);

      expect(dryAirResult).toBeLessThan(normalResult);
      // 70 - 8 - 2 = 60
      expect(dryAirResult).toBe(60);
    });

    test('should handle combined effects (rain + low humidity)', () => {
      const result = calculateSoilTemp(70, 40, 1.5);
      // 70 - 8 (base) - 3 (rain: 1.5*2) - 2 (low humidity) = 57
      expect(result).toBe(57);
    });

    test('should handle combined effects (rain + high humidity)', () => {
      const result = calculateSoilTemp(70, 85, 1.0);
      // 70 - 8 (base) - 2 (rain: 1.0*2) + 2 (high humidity) = 62
      expect(result).toBe(62);
    });

    test('should handle extreme cold temperatures', () => {
      const result = calculateSoilTemp(32, 60, 0);
      expect(result).toBe(24); // 32 - 8 = 24
      expect(typeof result).toBe('number');
    });

    test('should handle extreme hot temperatures', () => {
      const result = calculateSoilTemp(95, 60, 0);
      expect(result).toBe(87); // 95 - 8 = 87
      expect(typeof result).toBe('number');
    });

    test('should return rounded integer values', () => {
      const result = calculateSoilTemp(70.7, 65, 0.3);
      expect(Number.isInteger(result)).toBe(true);
    });

    test('should handle zero precipitation', () => {
      const result = calculateSoilTemp(65, 70, 0);
      expect(result).toBe(57); // 65 - 8 = 57 (no precip adjustment)
    });

    test('should handle minimal precipitation (< 0.1 inch)', () => {
      const result = calculateSoilTemp(65, 70, 0.05);
      expect(result).toBe(57); // No adjustment for trace amounts
    });

    test('should match mockData expectations', () => {
      const typical = calculateSoilTemp(
        mockWeatherData.typical.airTemp,
        mockWeatherData.typical.humidity,
        mockWeatherData.typical.precipitation
      );
      expect(typical).toBe(mockWeatherData.typical.soilTemp);
    });
  });

  describe('getCurrentSeason', () => {

    test('should return "spring" for April-May (months 4-5)', () => {
      // Mock Date for April
      vi.setSystemTime(new Date('2024-04-15'));
      expect(getCurrentSeason()).toBe('spring');

      // Mock Date for May
      vi.setSystemTime(new Date('2024-05-20'));
      expect(getCurrentSeason()).toBe('spring');
    });

    test('should return "summer" for June-August (months 6-8)', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      expect(getCurrentSeason()).toBe('summer');

      vi.setSystemTime(new Date('2024-07-20'));
      expect(getCurrentSeason()).toBe('summer');

      vi.setSystemTime(new Date('2024-08-25'));
      expect(getCurrentSeason()).toBe('summer');
    });

    test('should return "fall" for September-November (months 9-11)', () => {
      vi.setSystemTime(new Date('2024-09-15'));
      expect(getCurrentSeason()).toBe('fall');

      vi.setSystemTime(new Date('2024-10-20'));
      expect(getCurrentSeason()).toBe('fall');

      vi.setSystemTime(new Date('2024-11-25'));
      expect(getCurrentSeason()).toBe('fall');
    });

    test('should return "winter" for December-March (months 12, 1-3)', () => {
      vi.setSystemTime(new Date('2024-12-15'));
      expect(getCurrentSeason()).toBe('winter');

      vi.setSystemTime(new Date('2024-01-20'));
      expect(getCurrentSeason()).toBe('winter');

      vi.setSystemTime(new Date('2024-02-14'));
      expect(getCurrentSeason()).toBe('winter');

      vi.setSystemTime(new Date('2024-03-25'));
      expect(getCurrentSeason()).toBe('winter');
    });

    test('should handle boundary months correctly', () => {
      // First day of spring
      vi.setSystemTime(new Date('2024-04-01'));
      expect(getCurrentSeason()).toBe('spring');

      // Last day of spring
      vi.setSystemTime(new Date('2024-05-31'));
      expect(getCurrentSeason()).toBe('spring');

      // First day of summer
      vi.setSystemTime(new Date('2024-06-01'));
      expect(getCurrentSeason()).toBe('summer');
    });
  });

  describe('countySamplePoints', () => {

    test('should contain all 10 NH counties', () => {
      const expectedCounties = [
        'coos', 'grafton', 'carroll', 'sullivan', 'merrimack',
        'belknap', 'cheshire', 'hillsborough', 'strafford', 'rockingham'
      ];

      const actualCounties = Object.keys(countySamplePoints);
      expect(actualCounties).toHaveLength(10);
      expectedCounties.forEach(county => {
        expect(actualCounties).toContain(county);
      });
    });

    test('should sample 3-5 points per county', () => {
      Object.entries(countySamplePoints).forEach(([county, points]) => {
        expect(Array.isArray(points), `${county} should be an array of points`).toBe(true);
        expect(points.length, `${county} should have 3-5 sample points`).toBeGreaterThanOrEqual(3);
        expect(points.length, `${county} should have 3-5 sample points`).toBeLessThanOrEqual(5);
      });
    });

    test('should have valid coordinates for every sample point', () => {
      Object.entries(countySamplePoints).forEach(([county, points]) => {
        points.forEach(point => {
          expect(point).toHaveProperty('name');
          expect(point).toHaveProperty('lat');
          expect(point).toHaveProperty('lon');

          // Validate NH latitude range (approximately 42.7 to 45.3)
          expect(point.lat).toBeGreaterThan(42.5);
          expect(point.lat).toBeLessThan(45.5);

          // Validate NH longitude range (approximately -72.5 to -70.6)
          expect(point.lon).toBeGreaterThan(-73);
          expect(point.lon).toBeLessThan(-70);
        });
      });
    });

    test('should have unique point names within each county', () => {
      Object.entries(countySamplePoints).forEach(([county, points]) => {
        const names = points.map(p => p.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size, `${county} should not have duplicate point names`).toBe(names.length);
      });
    });

    test('should have specific known anchor points', () => {
      expect(countySamplePoints.merrimack[0].name).toBe('Concord');
      expect(countySamplePoints.cheshire[0].name).toBe('Keene');
      // Hillsborough's old anchor (42.9956,-71.4548) undercounted a real
      // storm 4x vs the KMHT gauge — replaced with the corrected point
      expect(countySamplePoints.hillsborough[0].lat).toBeCloseTo(42.9326, 3);
      expect(countySamplePoints.hillsborough[0].lon).toBeCloseTo(-71.4358, 3);
    });
  });

  describe('median', () => {

    test('should return the middle value for an odd-length array', () => {
      expect(median([1, 3, 2])).toBe(2);
    });

    test('should average the two middle values for an even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    test('should handle a single-element array', () => {
      expect(median([5])).toBe(5);
    });

    test('should not depend on input order', () => {
      expect(median([5, 1, 3])).toBe(median([1, 3, 5]));
    });

    test('should not mutate the input array', () => {
      const input = [3, 1, 2];
      median(input);
      expect(input).toEqual([3, 1, 2]);
    });

    test('should throw on an empty array', () => {
      expect(() => median([])).toThrow();
    });
  });

  describe('aggregateCountyWeather', () => {
    const points = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    const makePoint = (rainfall, airTemp, soilTemp) => ({
      rainfall, airTemp, soilTemp, humidity: 70, currentPrecipitation: 0, soilMoisture: 0.3
    });

    test('should compute median and range across valid sample points', () => {
      const result = aggregateCountyWeather(
        [makePoint(0.2, 60, 55), makePoint(0.7, 65, 60), makePoint(1.4, 70, 65)],
        points,
        'fall'
      );

      expect(result.rainfall).toBe(0.7); // median of 0.2, 0.7, 1.4
      expect(result.airTemp).toBe(65);
      expect(result.soilTemp).toBe(60);
      expect(result.rainfallRange).toEqual([0.2, 1.4]);
      expect(result.soilTempRange).toEqual([55, 65]);
      expect(result.airTempRange).toEqual([60, 70]);
      expect(result.sampleCount).toBe(3);
      expect(result.season).toBe('fall');
      expect(result.town).toBe('A'); // anchor point's name
    });

    test('should aggregate from remaining points when one sample point is malformed', () => {
      const result = aggregateCountyWeather(
        [makePoint(0.5, 60, 55), null, makePoint(1.0, 64, 59)],
        points
      );
      expect(result.sampleCount).toBe(2);
      expect(result.rainfall).toBe(0.75); // median of 0.5, 1.0
    });

    test('should stamp the county identity onto the aggregated result (#68)', () => {
      const result = aggregateCountyWeather(
        [makePoint(0.2, 60, 55), makePoint(0.7, 65, 60)],
        [{ name: 'A' }, { name: 'B' }],
        'fall',
        'rockingham'
      );
      expect(result.county).toBe('rockingham');
    });

    test('should default county to null when not provided', () => {
      const result = aggregateCountyWeather([makePoint(0.2, 60, 55)], [{ name: 'A' }]);
      expect(result.county).toBeNull();
    });

    test('should retain per-site readings positionally paired with points, skipping malformed entries (#67)', () => {
      const sitePoints = [
        { name: 'Site A', lat: 43.1, lon: -71.1 },
        { name: 'Site B', lat: 43.2, lon: -71.2 },
        { name: 'Site C', lat: 43.3, lon: -71.3 }
      ];
      const result = aggregateCountyWeather(
        [makePoint(0.2, 60, 55), null, makePoint(1.4, 70, 65)],
        sitePoints
      );

      expect(result.sites).toHaveLength(2);
      expect(result.sites[0]).toEqual({ name: 'Site A', lat: 43.1, lon: -71.1, rainfall: 0.2, airTemp: 60, soilTemp: 55 });
      // Site B (index 1, the null/malformed entry) must be skipped, not misaligned —
      // Site C's reading should stay attached to "Site C", not shift into Site B's slot.
      expect(result.sites[1]).toEqual({ name: 'Site C', lat: 43.3, lon: -71.3, rainfall: 1.4, airTemp: 70, soilTemp: 65 });
    });

    test('should throw when every sample point is malformed', () => {
      expect(() => aggregateCountyWeather([null, null, null], points)).toThrow();
    });
  });

  describe('findSiteWeather (#67)', () => {
    const sites = [
      { name: 'Nash Stream', lat: 44.7089, lon: -71.4828, rainfall: 0.5, airTemp: 58, soilTemp: 52 },
      { name: 'Gorham', lat: 44.3895, lon: -71.1814, rainfall: 1.1, airTemp: 62, soilTemp: 56 }
    ];

    test('matches a location GPS string to its sample point', () => {
      expect(findSiteWeather('44.7089,-71.4828', sites)).toEqual(sites[0]);
    });

    test('matches within a small floating-point epsilon', () => {
      expect(findSiteWeather('44.70891,-71.48281', sites)).toEqual(sites[0]);
    });

    test('returns null when no site is within tolerance', () => {
      expect(findSiteWeather('10,10', sites)).toBeNull();
    });

    test('returns null for missing/malformed gps or sites', () => {
      expect(findSiteWeather(null, sites)).toBeNull();
      expect(findSiteWeather('not-a-coord', sites)).toBeNull();
      expect(findSiteWeather('44.7089,-71.4828', undefined)).toBeNull();
      expect(findSiteWeather('44.7089,-71.4828', [])).toBeNull();
    });
  });

  describe('getStatewideWeather (#82)', () => {
    beforeEach(() => {
      Object.keys(countyWeatherData).forEach(k => delete countyWeatherData[k]);
    });

    test('returns null when no county data has loaded', () => {
      expect(getStatewideWeather()).toBeNull();
    });

    test('medians across counties rather than aliasing a single one (e.g. Merrimack)', () => {
      countyWeatherData.coos = { rainfall: 0.5, airTemp: 55, soilTemp: 50 };
      countyWeatherData.merrimack = { rainfall: 2.0, airTemp: 65, soilTemp: 60 };
      countyWeatherData.cheshire = { rainfall: 3.5, airTemp: 75, soilTemp: 70 };

      const result = getStatewideWeather();
      expect(result.rainfall).toBe(2.0); // median of [0.5, 2.0, 3.5]
      expect(result.airTemp).toBe(65);
      expect(result.soilTemp).toBe(60);
      expect(result.sampleCount).toBe(3);
      expect(result.rainfallRange).toEqual([0.5, 3.5]);
    });

    test('excludes errored counties from the aggregate', () => {
      countyWeatherData.coos = { rainfall: 0.5, airTemp: 55, soilTemp: 50 };
      countyWeatherData.grafton = { error: 'timeout', rainfall: null, airTemp: null, soilTemp: null };

      const result = getStatewideWeather();
      expect(result.sampleCount).toBe(1);
      expect(result.rainfall).toBe(0.5);
    });
  });

  describe('fetchWeatherData', () => {
    beforeEach(() => {
      // Clear any state from previous tests
      Object.keys(countyWeatherData).forEach(k => delete countyWeatherData[k]);
    });

    test('should aggregate a successful batched response into rainfallRange/sampleCount', async () => {
      global.fetch = createMockFetch(mockOpenMeteoBatchResponse);

      await fetchWeatherData();

      const hillsborough = countyWeatherData.hillsborough;
      expect(hillsborough.error).toBeUndefined();
      expect(hillsborough.rainfallRange).toBeDefined();
      expect(hillsborough.sampleCount).toBe(mockOpenMeteoBatchResponse.length);
    });

    test('should set the standard error shape when the whole batch request fails', async () => {
      global.fetch = createMockFetch({ error: true, reason: 'bad request' }, { ok: false, status: 400, statusText: 'Bad Request' });

      await fetchWeatherData();

      const hillsborough = countyWeatherData.hillsborough;
      expect(hillsborough.rainfall).toBeNull();
      expect(hillsborough.soilTemp).toBeNull();
      expect(hillsborough.airTemp).toBeNull();
      expect(hillsborough.hasData).toBe(false);
      expect(hillsborough.error).toBeTruthy();
    });

    test('should still aggregate when one array entry is malformed', async () => {
      const partiallyBadResponse = [mockOpenMeteoBatchResponse[0], {}, mockOpenMeteoBatchResponse[2]];
      global.fetch = createMockFetch(partiallyBadResponse);

      await fetchWeatherData();

      const hillsborough = countyWeatherData.hillsborough;
      expect(hillsborough.error).toBeUndefined();
      expect(hillsborough.sampleCount).toBe(2);
    });
  });

  describe('currentWeatherData', () => {

    test('should have initial default values', () => {
      expect(currentWeatherData).toHaveProperty('rainfall');
      expect(currentWeatherData).toHaveProperty('soilTemp');
      expect(currentWeatherData).toHaveProperty('airTemp');
      expect(currentWeatherData).toHaveProperty('season');
      expect(currentWeatherData).toHaveProperty('lastUpdated');
    });

    test('should have reasonable default values', () => {
      expect(currentWeatherData.rainfall).toBeGreaterThanOrEqual(0);
      expect(currentWeatherData.soilTemp).toBeGreaterThan(0);
      expect(currentWeatherData.airTemp).toBeGreaterThan(0);
      expect(['spring', 'summer', 'fall', 'winter']).toContain(currentWeatherData.season);
    });
  });

  describe('getWeatherData', () => {

    test('should return weather data object with required properties', () => {
      const result = getWeatherData();

      expect(result).toHaveProperty('rainfall');
      expect(result).toHaveProperty('soilTemp');
      expect(result).toHaveProperty('airTemp');
      expect(result).toHaveProperty('season');

      // In test environment with no DOM, should return default manual values
      expect(typeof result.rainfall).toBe('number');
      expect(typeof result.soilTemp).toBe('number');
      expect(typeof result.airTemp).toBe('number');
      expect(['spring', 'summer', 'fall', 'winter']).toContain(result.season);
    });

    test('should return default values when no county specified', () => {
      const result = getWeatherData(null);

      // Should return manual override defaults when DOM elements don't exist
      expect(result.rainfall).toBe(2.0);
      expect(result.soilTemp).toBe(65);
      expect(result.airTemp).toBe(70);
      expect(result.season).toBe('summer');
    });
  });

  describe('updateWeatherDisplay / toggleWeatherMode', () => {
    beforeEach(() => {
      Object.keys(countyWeatherData).forEach(k => delete countyWeatherData[k]);
      currentWeatherData.rainfall = 2.0;
      currentWeatherData.soilTemp = 65;
      currentWeatherData.airTemp = 70;
      currentWeatherData.lastUpdated = new Date();
      currentWeatherData.error = null;

      document.body.innerHTML = `
        <div id="weather-status"><span id="status-text"></span></div>
        <input type="checkbox" id="auto-weather" checked>
        <div id="manual-controls"></div>
        <div id="weather-display"></div>
        <input type="range" id="rainfall" min="0" max="6" step="0.1" value="2.0">
        <input type="range" id="soil-temp" min="35" max="85" step="1" value="65">
        <input type="range" id="air-temp" min="35" max="95" step="1" value="70">
      `;
    });

    test('shows "✓ Live" when every county fetch succeeded', () => {
      Object.keys(countySamplePoints).forEach(county => {
        countyWeatherData[county] = { rainfall: 1, soilTemp: 60, airTemp: 65, lastUpdated: new Date() };
      });

      updateWeatherDisplay();

      expect(document.getElementById('status-text').textContent).toMatch(/^✓ Live/);
    });

    test('shows a partial-failure status instead of "✓ Live" when some counties failed', () => {
      const counties = Object.keys(countySamplePoints);
      counties.forEach((county, i) => {
        countyWeatherData[county] = i < 2
          ? { error: 'Request timed out', hasData: false }
          : { rainfall: 1, soilTemp: 60, airTemp: 65, lastUpdated: new Date() };
      });

      updateWeatherDisplay();

      const text = document.getElementById('status-text').textContent;
      expect(text).not.toMatch(/^✓ Live/);
      expect(text).toContain(`${counties.length - 2}/${counties.length}`);
    });

    test('shows partial status when a failed county falls back to cached data (not swallowed as "✓ Live")', () => {
      // Reproduces the bug where the cache-fallback path set error: null on a
      // stale reading, which made getFetchSummary() count it as a live
      // success even though the real-time fetch for that county failed.
      const counties = Object.keys(countySamplePoints);
      counties.forEach((county, i) => {
        countyWeatherData[county] = i < 2
          ? { rainfall: 1, soilTemp: 60, airTemp: 65, lastUpdated: new Date(), cached: true, error: null }
          : { rainfall: 1, soilTemp: 60, airTemp: 65, lastUpdated: new Date() };
      });

      updateWeatherDisplay();

      const text = document.getElementById('status-text').textContent;
      expect(text).not.toMatch(/^✓ Live/);
      expect(text).toContain(`${counties.length - 2}/${counties.length}`);
    });

    test('unchecking Live Data immediately updates the status text (no desync)', () => {
      Object.keys(countySamplePoints).forEach(county => {
        countyWeatherData[county] = { rainfall: 1, soilTemp: 60, airTemp: 65, lastUpdated: new Date() };
      });
      updateWeatherDisplay();
      expect(document.getElementById('status-text').textContent).toMatch(/^✓ Live/);

      document.getElementById('auto-weather').checked = false;
      toggleWeatherMode();

      expect(document.getElementById('status-text').textContent).toBe('Manual Override');
    });

    test('seeds manual sliders from the selected county, not just the general reading', () => {
      countyWeatherData.rockingham = { rainfall: 1.12, soilTemp: 58, airTemp: 62, lastUpdated: new Date() };
      // General reading intentionally differs from Rockingham's, so a pass
      // here proves the seed used the selected county, not the fallback.
      currentWeatherData.rainfall = 0.5;
      currentWeatherData.soilTemp = 70;
      currentWeatherData.airTemp = 75;

      updateWeatherDisplay('rockingham'); // simulate the user having clicked Rockingham

      document.getElementById('auto-weather').checked = false;
      toggleWeatherMode();

      expect(document.getElementById('rainfall').value).toBe('1.1');
      expect(document.getElementById('soil-temp').value).toBe('58');
      expect(document.getElementById('air-temp').value).toBe('62');
    });
  });
});
