/**
 * Tests for weather.js module
 * Testing weather calculations and data fetching
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  calculateSoilTemp,
  getCurrentSeason,
  countyTowns,
  currentWeatherData,
  getWeatherData
} from '../../src/modules/weather.js';
import { mockWeatherData, mockOpenMeteoResponse } from '../helpers/mockData.js';

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

  describe('countyTowns', () => {

    test('should contain all 10 NH counties', () => {
      const expectedCounties = [
        'coos', 'grafton', 'carroll', 'sullivan', 'merrimack',
        'belknap', 'cheshire', 'hillsborough', 'strafford', 'rockingham'
      ];

      const actualCounties = Object.keys(countyTowns);
      expect(actualCounties).toHaveLength(10);
      expectedCounties.forEach(county => {
        expect(actualCounties).toContain(county);
      });
    });

    test('should have valid coordinates for each county', () => {
      Object.entries(countyTowns).forEach(([county, data]) => {
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('lat');
        expect(data).toHaveProperty('lon');

        // Validate NH latitude range (approximately 42.7 to 45.3)
        expect(data.lat).toBeGreaterThan(42.5);
        expect(data.lat).toBeLessThan(45.5);

        // Validate NH longitude range (approximately -72.5 to -70.6)
        expect(data.lon).toBeGreaterThan(-73);
        expect(data.lon).toBeLessThan(-70);
      });
    });

    test('should have unique town names for each county', () => {
      const townNames = Object.values(countyTowns).map(d => d.name);
      const uniqueNames = new Set(townNames);
      expect(uniqueNames.size).toBe(townNames.length);
    });

    test('should have specific known county seats', () => {
      expect(countyTowns.merrimack.name).toBe('Concord');
      expect(countyTowns.hillsborough.name).toBe('Manchester');
      expect(countyTowns.cheshire.name).toBe('Keene');
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
});
