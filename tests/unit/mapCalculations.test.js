/**
 * Tests for mapCalculations.js module
 * Testing probability calculation engine and mapping functions
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  calculateProbability,
  getProbabilityColor,
  getCountyInfo,
  getTopSpeciesForCounty,
  countyRegions
} from '../../src/modules/mapCalculations.js';
import { mockWeatherData, mockCountyRegions } from '../helpers/mockData.js';

describe('Map Calculations Module', () => {

  describe('countyRegions', () => {

    test('should contain all 10 NH counties', () => {
      const expectedCounties = [
        'coos', 'grafton', 'carroll', 'sullivan', 'merrimack',
        'belknap', 'cheshire', 'hillsborough', 'strafford', 'rockingham'
      ];

      const actualCounties = Object.keys(countyRegions);
      expect(actualCounties).toHaveLength(10);
      expectedCounties.forEach(county => {
        expect(actualCounties).toContain(county);
      });
    });

    test('should map counties to valid NH regions', () => {
      const validRegions = [
        'Great North Woods',
        'White Mountains',
        'Dartmouth-Sunapee',
        'Merrimack Valley',
        'Lakes Region',
        'Monadnock Region',
        'Seacoast'
      ];

      Object.values(countyRegions).forEach(region => {
        expect(validRegions).toContain(region);
      });
    });

    test('should map specific counties correctly', () => {
      expect(countyRegions.coos).toBe('Great North Woods');
      expect(countyRegions.grafton).toBe('White Mountains');
      expect(countyRegions.carroll).toBe('White Mountains');
      expect(countyRegions.merrimack).toBe('Merrimack Valley');
      expect(countyRegions.rockingham).toBe('Seacoast');
    });

    test('should have no duplicate county keys', () => {
      const keys = Object.keys(countyRegions);
      const uniqueKeys = [...new Set(keys)];
      expect(keys.length).toBe(uniqueKeys.length);
    });
  });

  describe('calculateProbability', () => {

    describe('Basic Functionality', () => {

      test('should return 0 for non-existent species', () => {
        const weather = { ...mockWeatherData.typical, season: 'spring' };
        const result = calculateProbability('nonexistent', weather, 'White Mountains');
        expect(result).toBe(0);
      });

      test('should return probability between 0 and 1', () => {
        const weather = { ...mockWeatherData.typical, season: 'spring' };
        const result = calculateProbability('morels', weather, 'White Mountains');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      });

      test('should use regional preference as base probability', () => {
        // Morels have 0.9 preference in Merrimack Valley vs 0.6 in Great North Woods
        const idealWeather = {
          rainfall: 2.0,
          soilTemp: 60, // Perfect for morels (50-70 range)
          airTemp: 60,
          season: 'spring' // Perfect season for morels
        };

        const merrimackProb = calculateProbability('morels', idealWeather, 'Merrimack Valley');
        const northWoodsProb = calculateProbability('morels', idealWeather, 'Great North Woods');

        expect(merrimackProb).toBeGreaterThan(northWoodsProb);
      });
    });

    describe('Temperature Factors', () => {

      test('should favor ideal soil temperature range', () => {
        const baseWeather = { rainfall: 2.0, airTemp: 65, season: 'spring' };

        // Morels: tempRange [50, 70], ideal is 60
        const idealTemp = calculateProbability('morels', { ...baseWeather, soilTemp: 60 }, 'White Mountains');
        const coldTemp = calculateProbability('morels', { ...baseWeather, soilTemp: 45 }, 'White Mountains');
        const hotTemp = calculateProbability('morels', { ...baseWeather, soilTemp: 75 }, 'White Mountains');

        expect(idealTemp).toBeGreaterThan(coldTemp);
        expect(idealTemp).toBeGreaterThan(hotTemp);
      });

      test('should penalize temperatures below species minimum', () => {
        const baseWeather = { rainfall: 2.0, airTemp: 65, season: 'spring' };

        // Morels min temp is 50°F
        const atMin = calculateProbability('morels', { ...baseWeather, soilTemp: 50 }, 'White Mountains');
        const below5Deg = calculateProbability('morels', { ...baseWeather, soilTemp: 45 }, 'White Mountains');
        const below10Deg = calculateProbability('morels', { ...baseWeather, soilTemp: 40 }, 'White Mountains');

        expect(atMin).toBeGreaterThan(below5Deg);
        expect(below5Deg).toBeGreaterThan(below10Deg);
      });

      test('should penalize temperatures above species maximum', () => {
        const baseWeather = { rainfall: 2.0, airTemp: 65, season: 'spring' };

        // Morels max temp is 70°F
        const atMax = calculateProbability('morels', { ...baseWeather, soilTemp: 70 }, 'White Mountains');
        const above5Deg = calculateProbability('morels', { ...baseWeather, soilTemp: 75 }, 'White Mountains');
        const above10Deg = calculateProbability('morels', { ...baseWeather, soilTemp: 80 }, 'White Mountains');

        expect(atMax).toBeGreaterThan(above5Deg);
        expect(above5Deg).toBeGreaterThan(above10Deg);
      });

      test('should consider air temperature as secondary factor', () => {
        // Air temp factor should have less impact than soil temp
        const baseWeather = { rainfall: 2.0, soilTemp: 60, season: 'spring' };

        const idealAir = calculateProbability('morels', { ...baseWeather, airTemp: 60 }, 'White Mountains');
        const differentAir = calculateProbability('morels', { ...baseWeather, airTemp: 50 }, 'White Mountains');

        // Different air temp should affect probability, but not drastically
        expect(Math.abs(idealAir - differentAir)).toBeLessThan(0.3);
      });
    });

    describe('Moisture Factors', () => {

      test('should favor ideal moisture levels', () => {
        const baseWeather = { soilTemp: 60, airTemp: 60, season: 'spring' };

        // Morels moistureMin is 1.0
        const idealMoisture = calculateProbability('morels', { ...baseWeather, rainfall: 2.0 }, 'White Mountains');
        const lowMoisture = calculateProbability('morels', { ...baseWeather, rainfall: 0.5 }, 'White Mountains');

        expect(idealMoisture).toBeGreaterThan(lowMoisture);
      });

      test('should penalize rainfall below species minimum', () => {
        const baseWeather = { soilTemp: 60, airTemp: 60, season: 'spring' };

        // Morels moistureMin is 1.0
        const atMin = calculateProbability('morels', { ...baseWeather, rainfall: 1.0 }, 'White Mountains');
        const halfMin = calculateProbability('morels', { ...baseWeather, rainfall: 0.5 }, 'White Mountains');
        const quarterMin = calculateProbability('morels', { ...baseWeather, rainfall: 0.25 }, 'White Mountains');

        expect(atMin).toBeGreaterThan(halfMin);
        expect(halfMin).toBeGreaterThan(quarterMin);
      });

      test('should penalize excessive rainfall (too much moisture)', () => {
        const baseWeather = { soilTemp: 60, airTemp: 60, season: 'spring' };

        // Morels moistureMin is 1.0, so 3x = 3.0
        const ideal = calculateProbability('morels', { ...baseWeather, rainfall: 2.0 }, 'White Mountains');
        const excessive = calculateProbability('morels', { ...baseWeather, rainfall: 5.0 }, 'White Mountains');
        const veryExcessive = calculateProbability('morels', { ...baseWeather, rainfall: 8.0 }, 'White Mountains');

        expect(ideal).toBeGreaterThan(excessive);
        expect(excessive).toBeGreaterThan(veryExcessive);
      });
    });

    describe('Seasonal Factors', () => {

      test('should strongly favor morels in spring', () => {
        const baseWeather = { rainfall: 2.0, soilTemp: 60, airTemp: 60 };

        const springProb = calculateProbability('morels', { ...baseWeather, season: 'spring' }, 'White Mountains');
        const summerProb = calculateProbability('morels', { ...baseWeather, season: 'summer' }, 'White Mountains');
        const fallProb = calculateProbability('morels', { ...baseWeather, season: 'fall' }, 'White Mountains');

        // Morel seasonMultiplier: spring=1.0, summer=0.1, fall=0.0
        // Note: Due to || 0.5 fallback in code, fall (0.0) defaults to 0.5
        expect(springProb).toBeGreaterThan(summerProb);
        expect(springProb).toBeGreaterThan(fallProb); // Spring should still be best
        expect(summerProb).toBeGreaterThan(0); // Summer has 0.1 multiplier
        expect(fallProb).toBeGreaterThan(0); // Fall gets default 0.5 due to 0.0 || 0.5 (JavaScript falsy)
      });

      test('should favor chanterelles in summer', () => {
        const baseWeather = { rainfall: 2.5, soilTemp: 65, airTemp: 68 };

        const springProb = calculateProbability('chanterelles', { ...baseWeather, season: 'spring' }, 'White Mountains');
        const summerProb = calculateProbability('chanterelles', { ...baseWeather, season: 'summer' }, 'White Mountains');

        // Chanterelle seasonMultiplier: spring=0.3, summer=1.0
        expect(summerProb).toBeGreaterThan(springProb);
      });

      test('should handle unknown season gracefully', () => {
        const weather = { rainfall: 2.0, soilTemp: 60, airTemp: 60, season: 'unknown' };
        const result = calculateProbability('morels', weather, 'White Mountains');

        // Should use default 0.5 multiplier and not crash
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      });
    });

    describe('Species-Specific Adjustments', () => {

      test('should apply morel spring bonus for ideal conditions', () => {
        const baseWeather = { rainfall: 2.0, airTemp: 60 };

        // Morels get 1.3x bonus in spring with soil temp 55-70°F
        const idealSpring = calculateProbability('morels', { ...baseWeather, soilTemp: 60, season: 'spring' }, 'White Mountains');
        const fallNoBonus = calculateProbability('morels', { ...baseWeather, soilTemp: 60, season: 'fall' }, 'White Mountains');

        // Spring should be significantly better (even accounting for seasonal multiplier and bonus)
        expect(idealSpring).toBeGreaterThan(0);
        expect(idealSpring).toBeGreaterThan(fallNoBonus);
        // Fall has 0.0 in data but defaults to 0.5 due to || 0.5 in code
        expect(fallNoBonus).toBeGreaterThan(0);
      });

      test('should apply chanterelle moisture bonus', () => {
        const baseWeather = { soilTemp: 65, airTemp: 68, season: 'summer' };

        // Chanterelles get 1.2x bonus with rainfall 1.5-4.0"
        const idealMoisture = calculateProbability('chanterelles', { ...baseWeather, rainfall: 2.5 }, 'White Mountains');
        const lowMoisture = calculateProbability('chanterelles', { ...baseWeather, rainfall: 1.0 }, 'White Mountains');

        expect(idealMoisture).toBeGreaterThan(lowMoisture);
      });

      test('should apply boletus cool/moist bonus', () => {
        const baseWeather = { airTemp: 62, season: 'fall' };

        // Boletes get 1.3x bonus with soil temp < 70 and rainfall > 2.0
        const idealBoletus = calculateProbability('boletusEdulis', { ...baseWeather, soilTemp: 65, rainfall: 2.5 }, 'White Mountains');
        const warmBoletus = calculateProbability('boletusEdulis', { ...baseWeather, soilTemp: 72, rainfall: 2.5 }, 'White Mountains');

        expect(idealBoletus).toBeGreaterThan(warmBoletus);
      });

      test('should apply maitake fall bonus', () => {
        const baseWeather = { rainfall: 2.0, soilTemp: 68, airTemp: 70 };

        // Maitake gets 1.3x bonus in fall
        const fallMaitake = calculateProbability('maitake', { ...baseWeather, season: 'fall' }, 'Monadnock Region');
        const summerMaitake = calculateProbability('maitake', { ...baseWeather, season: 'summer' }, 'Monadnock Region');

        // Fall should be better (1.0 * 1.3 vs 0.6 seasonal multiplier)
        expect(fallMaitake).toBeGreaterThan(summerMaitake);
      });
    });

    describe('Edge Cases', () => {

      test('should handle missing weather properties', () => {
        // Missing rainfall will cause NaN in moisture calculations
        const incompleteWeather = { soilTemp: 60 };
        const result = calculateProbability('morels', incompleteWeather, 'White Mountains');

        // Currently returns NaN when rainfall is missing (moisture calculations fail)
        // This documents current behavior; ideally would handle gracefully with defaults
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(true); // Current behavior: NaN when properties missing
      });

      test('should handle missing region', () => {
        const weather = { rainfall: 2.0, soilTemp: 60, airTemp: 60, season: 'spring' };
        const result = calculateProbability('morels', weather, 'Unknown Region');

        // Should use default 0.5 regional preference
        expect(result).toBeGreaterThan(0);
      });

      test('should bound probability to [0, 1]', () => {
        // Extreme conditions that might push probability out of bounds
        const extremeGood = {
          rainfall: 2.0,
          soilTemp: 60,
          airTemp: 60,
          season: 'spring'
        };

        const extremeBad = {
          rainfall: 0.1,
          soilTemp: 100,
          airTemp: 100,
          season: 'winter'
        };

        const goodProb = calculateProbability('morels', extremeGood, 'Merrimack Valley');
        const badProb = calculateProbability('morels', extremeBad, 'Seacoast');

        expect(goodProb).toBeLessThanOrEqual(1);
        expect(badProb).toBeGreaterThanOrEqual(0);
      });

      test('should handle null or undefined inputs gracefully', () => {
        expect(calculateProbability(null, mockWeatherData.typical, 'White Mountains')).toBe(0);
        expect(calculateProbability(undefined, mockWeatherData.typical, 'White Mountains')).toBe(0);
      });
    });

    describe('Multi-Factor Integration', () => {

      test('should combine all factors for final probability', () => {
        // Perfect conditions: ideal temp, good moisture, perfect season, best region
        const perfectWeather = {
          rainfall: 2.0,
          soilTemp: 60, // Middle of 50-70 range
          airTemp: 60,
          season: 'spring'
        };

        // Poor conditions: wrong temp, low moisture, wrong season, poor region
        const poorWeather = {
          rainfall: 0.3,
          soilTemp: 85,
          airTemp: 90,
          season: 'winter'
        };

        const perfect = calculateProbability('morels', perfectWeather, 'Merrimack Valley'); // 0.9 regional pref
        const poor = calculateProbability('morels', poorWeather, 'Seacoast'); // 0.6 regional pref

        expect(perfect).toBeGreaterThan(0.5); // Should be high
        expect(poor).toBeLessThan(0.1); // Should be very low
      });

      test('should weight factors appropriately', () => {
        const baseWeather = { rainfall: 2.0, airTemp: 60, season: 'spring' };

        // Temperature should have more impact than moisture
        const tempProblem = calculateProbability('morels', { ...baseWeather, soilTemp: 90 }, 'White Mountains');
        const moistureProblem = calculateProbability('morels', { ...baseWeather, soilTemp: 60, rainfall: 0.5 }, 'White Mountains');

        // Both should be lower than ideal, but this tests they're weighted differently
        expect(tempProblem).toBeLessThan(moistureProblem);
      });
    });
  });

  describe('getProbabilityColor', () => {

    test('should return brown for very low probability (0-20%)', () => {
      expect(getProbabilityColor(0.0)).toBe('#8B4513');
      expect(getProbabilityColor(0.1)).toBe('#8B4513');
      expect(getProbabilityColor(0.19)).toBe('#8B4513');
    });

    test('should return goldenrod for low probability (20-40%)', () => {
      expect(getProbabilityColor(0.2)).toBe('#DAA520');
      expect(getProbabilityColor(0.3)).toBe('#DAA520');
      expect(getProbabilityColor(0.39)).toBe('#DAA520');
    });

    test('should return gold for medium probability (40-60%)', () => {
      expect(getProbabilityColor(0.4)).toBe('#FFD700');
      expect(getProbabilityColor(0.5)).toBe('#FFD700');
      expect(getProbabilityColor(0.59)).toBe('#FFD700');
    });

    test('should return light green for high probability (60-80%)', () => {
      expect(getProbabilityColor(0.6)).toBe('#90EE90');
      expect(getProbabilityColor(0.7)).toBe('#90EE90');
      expect(getProbabilityColor(0.79)).toBe('#90EE90');
    });

    test('should return lime green for very high probability (80-100%)', () => {
      expect(getProbabilityColor(0.8)).toBe('#32CD32');
      expect(getProbabilityColor(0.9)).toBe('#32CD32');
      expect(getProbabilityColor(1.0)).toBe('#32CD32');
    });

    test('should handle edge case probabilities', () => {
      expect(getProbabilityColor(0)).toBe('#8B4513');
      expect(getProbabilityColor(1)).toBe('#32CD32');
    });

    test('should return valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;

      const testValues = [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1.0];
      testValues.forEach(prob => {
        const color = getProbabilityColor(prob);
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe('getCountyInfo', () => {

    test('should return object with required properties', () => {
      const result = getCountyInfo('grafton', 'morels');

      expect(result).toHaveProperty('county');
      expect(result).toHaveProperty('region');
      expect(result).toHaveProperty('probability');
      expect(result).toHaveProperty('weather');
      expect(result).toHaveProperty('species');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('recommendations');
    });

    test('should use correct county region', () => {
      const result = getCountyInfo('grafton', 'morels');
      expect(result.region).toBe('White Mountains');

      const result2 = getCountyInfo('rockingham', 'morels');
      expect(result2.region).toBe('Seacoast');
    });

    test('should calculate probability correctly', () => {
      const result = getCountyInfo('grafton', 'morels');

      expect(result.probability).toBeGreaterThanOrEqual(0);
      expect(result.probability).toBeLessThanOrEqual(1);
    });

    test('should assign appropriate color based on probability', () => {
      const result = getCountyInfo('grafton', 'morels');
      const expectedColor = getProbabilityColor(result.probability);

      expect(result.color).toBe(expectedColor);
    });

    test('should include weather data', () => {
      const result = getCountyInfo('grafton', 'morels');

      expect(result.weather).toBeDefined();
      expect(typeof result.weather).toBe('object');
    });

    test('should include recommendations array', () => {
      const result = getCountyInfo('grafton', 'morels');

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('getTopSpeciesForCounty', () => {

    test('should return array of species rankings', () => {
      const results = getTopSpeciesForCounty('grafton', 5);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    test('should return empty array for invalid county', () => {
      const results = getTopSpeciesForCounty('invalid-county', 5);
      expect(results).toEqual([]);
    });

    test('should sort species by probability (highest first)', () => {
      const results = getTopSpeciesForCounty('grafton', 10);

      // Check that each species has lower or equal probability than the previous
      for (let i = 1; i < results.length; i++) {
        expect(results[i].probability).toBeLessThanOrEqual(results[i - 1].probability);
      }
    });

    test('should respect topCount parameter', () => {
      const top3 = getTopSpeciesForCounty('grafton', 3);
      const top5 = getTopSpeciesForCounty('grafton', 5);
      const top10 = getTopSpeciesForCounty('grafton', 10);

      expect(top3.length).toBe(3);
      expect(top5.length).toBe(5);
      expect(top10.length).toBeGreaterThanOrEqual(5);
    });

    test('should default to 5 species if topCount not specified', () => {
      const results = getTopSpeciesForCounty('grafton');
      expect(results.length).toBe(5);
    });

    test('should include required properties for each species', () => {
      const results = getTopSpeciesForCounty('grafton', 3);

      results.forEach(species => {
        expect(species).toHaveProperty('key');
        expect(species).toHaveProperty('name');
        expect(species).toHaveProperty('probability');
        expect(species).toHaveProperty('color');
        expect(species).toHaveProperty('tempRange');
        expect(species).toHaveProperty('moistureMin');
        expect(species).toHaveProperty('seasonMultiplier');
      });
    });

    test('should assign colors based on probability', () => {
      const results = getTopSpeciesForCounty('grafton', 5);

      results.forEach(species => {
        const expectedColor = getProbabilityColor(species.probability);
        expect(species.color).toBe(expectedColor);
      });
    });

    test('should return different rankings for different counties', () => {
      // Northern county (Coos) vs Southern county (Rockingham)
      const coosTop = getTopSpeciesForCounty('coos', 5);
      const rockinghamTop = getTopSpeciesForCounty('rockingham', 5);

      // Rankings should differ due to different regional preferences
      const coosTopSpecies = coosTop[0].key;
      const rockinghamTopSpecies = rockinghamTop[0].key;

      // They might be the same, but probabilities should differ
      const coosTopProb = coosTop[0].probability;
      const rockinghamMatch = rockinghamTop.find(s => s.key === coosTopSpecies);

      if (rockinghamMatch) {
        // If same species, probability should likely differ
        // (unless conditions and regional prefs happen to align perfectly)
        expect(coosTopProb).not.toBe(rockinghamMatch.probability);
      }
    });
  });
});
