/**
 * Tests for foragingReports.js module
 * Testing ML pipeline data collection and accuracy tracking
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ForagingReport, ForagingReportsManager } from '../../src/modules/foragingReports.js';
import { mockForagingReports } from '../helpers/mockData.js';

describe('Foraging Reports Module', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock Date.now() and Date constructor for consistent testing
    vi.spyOn(Date, 'now').mockReturnValue(1609459200000); // Jan 1, 2021 00:00:00 GMT
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1609459200000)); // Jan 1, 2021 00:00:00 GMT
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('ForagingReport Class', () => {

    describe('Constructor', () => {

      test('should create report with default values when no data provided', () => {
        const report = new ForagingReport();

        expect(report.id).toMatch(/^report_\d+_[a-z0-9]+$/);
        expect(report.date).toBe('2021-01-01'); // Based on mocked Date.now()
        expect(report.timestamp).toBe(1609459200000);
        expect(report.county).toBe('');
        expect(report.species).toBe('');
        expect(report.predicted_probability).toBe(0);
        expect(report.actual_success).toBe(false);
        expect(report.quantity_found).toBe('none');
        expect(report.confidence_level).toBe('medium');
      });

      test('should create report with provided data', () => {
        const data = {
          county: 'grafton',
          species: 'morels',
          predicted_probability: 0.75,
          actual_success: true,
          quantity_found: 'moderate',
          confidence_level: 'high'
        };

        const report = new ForagingReport(data);

        expect(report.county).toBe('grafton');
        expect(report.species).toBe('morels');
        expect(report.predicted_probability).toBe(0.75);
        expect(report.actual_success).toBe(true);
        expect(report.quantity_found).toBe('moderate');
        expect(report.confidence_level).toBe('high');
      });

      test('should create report with weather conditions', () => {
        const report = new ForagingReport(mockForagingReports.successfulMorels);

        expect(report.weather_conditions.rainfall_7day).toBe(1.5);
        expect(report.weather_conditions.soil_temp).toBe(58);
        expect(report.weather_conditions.air_temp).toBe(65);
        expect(report.weather_conditions.humidity).toBe(70);
        expect(report.weather_conditions.season).toBe('spring');
      });

      test('should create report with location details', () => {
        const report = new ForagingReport(mockForagingReports.successfulMorels);

        expect(report.location_details.elevation).toBe(1200);
        expect(report.location_details.habitat).toBe('mixed hardwoods');
        expect(report.location_details.gps_coords).toEqual([44.0, -71.5]);
        expect(report.location_details.access_notes).toBe('Public trail access');
      });

      test('should accept custom id and timestamp', () => {
        const customId = 'report_custom_123';
        const customTimestamp = 1234567890000;

        const report = new ForagingReport({
          id: customId,
          timestamp: customTimestamp
        });

        expect(report.id).toBe(customId);
        expect(report.timestamp).toBe(customTimestamp);
      });

      test('should handle partial weather conditions data', () => {
        const report = new ForagingReport({
          weather_conditions: {
            rainfall_7day: 2.0,
            soil_temp: 55
            // Missing air_temp, humidity, season
          }
        });

        expect(report.weather_conditions.rainfall_7day).toBe(2.0);
        expect(report.weather_conditions.soil_temp).toBe(55);
        // Defaults to currentWeatherData.airTemp (varies by test environment)
        expect(typeof report.weather_conditions.air_temp).toBe('number');
        expect(report.weather_conditions.humidity).toBe(70); // Default
      });
    });

    describe('generateId', () => {

      test('should generate unique IDs', () => {
        const report1 = new ForagingReport();
        const report2 = new ForagingReport();

        expect(report1.id).not.toBe(report2.id);
      });

      test('should generate IDs with correct format', () => {
        const report = new ForagingReport();

        expect(report.id).toMatch(/^report_\d+_[a-z0-9]+$/);
        expect(report.id).toContain('report_');
      });

      test('should include timestamp in ID', () => {
        const report = new ForagingReport();

        expect(report.id).toContain('1609459200000');
      });
    });

    describe('toJSON', () => {

      test('should serialize all report properties', () => {
        const report = new ForagingReport(mockForagingReports.successfulMorels);
        const json = report.toJSON();

        expect(json).toHaveProperty('id');
        expect(json).toHaveProperty('date');
        expect(json).toHaveProperty('timestamp');
        expect(json).toHaveProperty('county');
        expect(json).toHaveProperty('species');
        expect(json).toHaveProperty('predicted_probability');
        expect(json).toHaveProperty('actual_success');
        expect(json).toHaveProperty('quantity_found');
        expect(json).toHaveProperty('confidence_level');
        expect(json).toHaveProperty('weather_conditions');
        expect(json).toHaveProperty('location_details');
        expect(json).toHaveProperty('user_notes');
        expect(json).toHaveProperty('photo_uploaded');
        expect(json).toHaveProperty('verified_by_expert');
      });

      test('should serialize with correct data types', () => {
        const report = new ForagingReport(mockForagingReports.successfulMorels);
        const json = report.toJSON();

        expect(typeof json.id).toBe('string');
        expect(typeof json.date).toBe('string');
        expect(typeof json.timestamp).toBe('number');
        expect(typeof json.predicted_probability).toBe('number');
        expect(typeof json.actual_success).toBe('boolean');
        expect(typeof json.weather_conditions).toBe('object');
        expect(typeof json.location_details).toBe('object');
      });

      test('should be JSON stringifiable', () => {
        const report = new ForagingReport(mockForagingReports.successfulMorels);
        const json = report.toJSON();

        expect(() => JSON.stringify(json)).not.toThrow();
        const stringified = JSON.stringify(json);
        expect(stringified).toBeTruthy();
      });
    });
  });

  describe('ForagingReportsManager Class', () => {

    let manager;

    beforeEach(() => {
      manager = new ForagingReportsManager();
    });

    describe('Constructor', () => {

      test('should initialize with correct storage key', () => {
        expect(manager.storageKey).toBe('graniteFungiForager_reports');
      });

      test('should initialize with empty reports array when no stored data', () => {
        expect(manager.reports).toEqual([]);
        expect(manager.reports).toHaveLength(0);
      });

      test('should initialize observers array', () => {
        expect(manager.observers).toEqual([]);
        expect(Array.isArray(manager.observers)).toBe(true);
      });

      test('should load existing reports from localStorage on initialization', () => {
        const storedReports = [mockForagingReports.successfulMorels];
        localStorage.setItem('graniteFungiForager_reports', JSON.stringify(storedReports));

        const newManager = new ForagingReportsManager();

        expect(newManager.reports).toHaveLength(1);
        expect(newManager.reports[0].species).toBe('morels');
      });
    });

    describe('loadReports', () => {

      test('should return empty array when no data in localStorage', () => {
        const reports = manager.loadReports();

        expect(reports).toEqual([]);
        expect(reports).toHaveLength(0);
      });

      test('should load and parse reports from localStorage', () => {
        const storedData = [
          mockForagingReports.successfulMorels,
          mockForagingReports.unsuccessfulChanterelles
        ];
        localStorage.setItem(manager.storageKey, JSON.stringify(storedData));

        const reports = manager.loadReports();

        expect(reports).toHaveLength(2);
        expect(reports[0]).toBeInstanceOf(ForagingReport);
        expect(reports[1]).toBeInstanceOf(ForagingReport);
      });

      test('should handle corrupted JSON gracefully', () => {
        localStorage.setItem(manager.storageKey, 'invalid-json{]');

        const reports = manager.loadReports();

        expect(reports).toEqual([]);
      });

      test('should handle localStorage errors gracefully', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
          throw new Error('localStorage error');
        });

        const reports = manager.loadReports();

        expect(reports).toEqual([]);
      });

      test('should convert loaded data to ForagingReport instances', () => {
        const storedData = [mockForagingReports.successfulMorels];
        localStorage.setItem(manager.storageKey, JSON.stringify(storedData));

        const reports = manager.loadReports();

        expect(reports[0]).toBeInstanceOf(ForagingReport);
        expect(reports[0].species).toBe('morels');
        expect(reports[0].county).toBe('grafton');
      });
    });

    describe('saveReports', () => {

      test('should save reports to localStorage', () => {
        manager.reports = [new ForagingReport(mockForagingReports.successfulMorels)];
        manager.saveReports();

        const stored = localStorage.getItem(manager.storageKey);
        expect(stored).not.toBeNull();

        const parsed = JSON.parse(stored);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].species).toBe('morels');
      });

      test('should save empty array when no reports', () => {
        manager.reports = [];
        manager.saveReports();

        const stored = localStorage.getItem(manager.storageKey);
        const parsed = JSON.parse(stored);

        expect(parsed).toEqual([]);
      });

      test('should serialize reports using toJSON', () => {
        const report = new ForagingReport(mockForagingReports.successfulBlackTrumpets);
        manager.reports = [report];
        manager.saveReports();

        const stored = localStorage.getItem(manager.storageKey);
        const parsed = JSON.parse(stored);

        expect(parsed[0]).toHaveProperty('id');
        expect(parsed[0]).toHaveProperty('weather_conditions');
        expect(parsed[0]).toHaveProperty('location_details');
      });

      test('should handle localStorage errors gracefully', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('localStorage quota exceeded');
        });

        manager.reports = [new ForagingReport()];

        expect(() => manager.saveReports()).not.toThrow();
      });
    });

    describe('addReport', () => {

      test('should add report to reports array', () => {
        expect(manager.reports).toHaveLength(0);

        manager.addReport(mockForagingReports.successfulMorels);

        expect(manager.reports).toHaveLength(1);
      });

      test('should create ForagingReport instance from data', () => {
        const report = manager.addReport(mockForagingReports.successfulMorels);

        expect(report).toBeInstanceOf(ForagingReport);
        expect(report.species).toBe('morels');
      });

      test('should return the created report', () => {
        const report = manager.addReport(mockForagingReports.successfulMorels);

        expect(report.county).toBe('grafton');
        expect(report.actual_success).toBe(true);
      });

      test('should save reports to localStorage after adding', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const stored = localStorage.getItem(manager.storageKey);
        const parsed = JSON.parse(stored);

        expect(parsed).toHaveLength(1);
      });

      test('should add multiple reports', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);
        manager.addReport(mockForagingReports.successfulBlackTrumpets);

        expect(manager.reports).toHaveLength(3);
      });
    });

    describe('getAllReports', () => {

      test('should return empty array when no reports', () => {
        const reports = manager.getAllReports();

        expect(reports).toEqual([]);
      });

      test('should return all reports', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);

        const reports = manager.getAllReports();

        expect(reports).toHaveLength(2);
      });

      test('should return a copy of reports array', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const reports = manager.getAllReports();
        reports.push(new ForagingReport());

        // Original should be unchanged
        expect(manager.reports).toHaveLength(1);
      });
    });

    describe('getReportsByCounty', () => {

      beforeEach(() => {
        manager.addReport(mockForagingReports.successfulMorels); // grafton
        manager.addReport(mockForagingReports.unsuccessfulChanterelles); // merrimack
        manager.addReport(mockForagingReports.successfulBlackTrumpets); // cheshire
      });

      test('should return reports for specific county', () => {
        const graftonReports = manager.getReportsByCounty('grafton');

        expect(graftonReports).toHaveLength(1);
        expect(graftonReports[0].county).toBe('grafton');
      });

      test('should return empty array for county with no reports', () => {
        const coosReports = manager.getReportsByCounty('coos');

        expect(coosReports).toEqual([]);
      });

      test('should return multiple reports for same county', () => {
        manager.addReport({ ...mockForagingReports.successfulMorels, species: 'chanterelles' });

        const graftonReports = manager.getReportsByCounty('grafton');

        expect(graftonReports).toHaveLength(2);
      });

      test('should be case-sensitive', () => {
        const reports = manager.getReportsByCounty('Grafton'); // Capitalized

        expect(reports).toHaveLength(0);
      });
    });

    describe('getReportsBySpecies', () => {

      beforeEach(() => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);
        manager.addReport(mockForagingReports.successfulBlackTrumpets);
      });

      test('should return reports for specific species', () => {
        const morelReports = manager.getReportsBySpecies('morels');

        expect(morelReports).toHaveLength(1);
        expect(morelReports[0].species).toBe('morels');
      });

      test('should return empty array for species with no reports', () => {
        const maitakeReports = manager.getReportsBySpecies('maitake');

        expect(maitakeReports).toEqual([]);
      });

      test('should return multiple reports for same species', () => {
        manager.addReport({ ...mockForagingReports.successfulMorels, county: 'coos' });

        const morelReports = manager.getReportsBySpecies('morels');

        expect(morelReports).toHaveLength(2);
      });
    });

    describe('getReportsByDateRange', () => {

      beforeEach(() => {
        manager.addReport({ ...mockForagingReports.successfulMorels, date: '2021-05-15' });
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, date: '2021-07-20' });
        manager.addReport({ ...mockForagingReports.successfulBlackTrumpets, date: '2021-09-10' });
      });

      test('should return reports within date range', () => {
        const reports = manager.getReportsByDateRange('2021-07-01', '2021-09-30');

        expect(reports).toHaveLength(2);
      });

      test('should include reports on start date', () => {
        const reports = manager.getReportsByDateRange('2021-05-15', '2021-06-01');

        expect(reports).toHaveLength(1);
        expect(reports[0].date).toBe('2021-05-15');
      });

      test('should include reports on end date', () => {
        const reports = manager.getReportsByDateRange('2021-09-01', '2021-09-10');

        expect(reports).toHaveLength(1);
        expect(reports[0].date).toBe('2021-09-10');
      });

      test('should return empty array when no reports in range', () => {
        const reports = manager.getReportsByDateRange('2020-01-01', '2020-12-31');

        expect(reports).toEqual([]);
      });

      test('should handle single-day range', () => {
        const reports = manager.getReportsByDateRange('2021-07-20', '2021-07-20');

        expect(reports).toHaveLength(1);
      });
    });

    describe('calculateAccuracyStats', () => {

      test('should return zero stats when no reports', () => {
        const stats = manager.calculateAccuracyStats();

        expect(stats.totalReports).toBe(0);
        expect(stats.overallAccuracy).toBe(0);
        expect(stats.bySpecies).toEqual({});
        expect(stats.byCounty).toEqual({});
        expect(stats.averageProbabilityWhenSuccessful).toBe(0);
        expect(stats.averageProbabilityWhenUnsuccessful).toBe(0);
      });

      test('should calculate overall accuracy', () => {
        manager.addReport(mockForagingReports.successfulMorels); // success
        manager.addReport(mockForagingReports.unsuccessfulChanterelles); // fail
        manager.addReport(mockForagingReports.successfulBlackTrumpets); // success

        const stats = manager.calculateAccuracyStats();

        expect(stats.totalReports).toBe(3);
        expect(stats.successfulForaging).toBe(2);
        expect(stats.overallAccuracy).toBeCloseTo(2/3, 2);
      });

      test('should calculate species-specific accuracy', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport(mockForagingReports.successfulBlackTrumpets);

        const stats = manager.calculateAccuracyStats();

        expect(stats.bySpecies['morels'].total).toBe(2);
        expect(stats.bySpecies['morels'].successful).toBe(1);
        expect(stats.bySpecies['morels'].accuracy).toBe(0.5);

        expect(stats.bySpecies['blacktrumpets'].total).toBe(1);
        expect(stats.bySpecies['blacktrumpets'].successful).toBe(1);
        expect(stats.bySpecies['blacktrumpets'].accuracy).toBe(1.0);
      });

      test('should calculate county-specific accuracy', () => {
        manager.addReport(mockForagingReports.successfulMorels); // grafton, success
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, county: 'grafton' }); // grafton, fail

        const stats = manager.calculateAccuracyStats();

        expect(stats.byCounty['grafton'].total).toBe(2);
        expect(stats.byCounty['grafton'].successful).toBe(1);
        expect(stats.byCounty['grafton'].accuracy).toBe(0.5);
      });

      test('should calculate average probability when successful', () => {
        manager.addReport({ ...mockForagingReports.successfulMorels, predicted_probability: 0.8, actual_success: true });
        manager.addReport({ ...mockForagingReports.successfulBlackTrumpets, predicted_probability: 0.6, actual_success: true });

        const stats = manager.calculateAccuracyStats();

        expect(stats.averageProbabilityWhenSuccessful).toBeCloseTo(0.7, 2);
      });

      test('should calculate average probability when unsuccessful', () => {
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, predicted_probability: 0.3, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, predicted_probability: 0.5, actual_success: false });

        const stats = manager.calculateAccuracyStats();

        expect(stats.averageProbabilityWhenUnsuccessful).toBeCloseTo(0.4, 2);
      });

      test('should handle all successful reports', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.successfulBlackTrumpets);

        const stats = manager.calculateAccuracyStats();

        expect(stats.overallAccuracy).toBe(1.0);
        expect(stats.averageProbabilityWhenUnsuccessful).toBe(0);
      });

      test('should handle all unsuccessful reports', () => {
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });

        const stats = manager.calculateAccuracyStats();

        expect(stats.overallAccuracy).toBe(0);
        expect(stats.averageProbabilityWhenSuccessful).toBe(0);
      });
    });

    describe('exportReports', () => {

      test('should export reports as JSON string', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const exported = manager.exportReports();

        expect(typeof exported).toBe('string');
        expect(() => JSON.parse(exported)).not.toThrow();
      });

      test('should include export metadata', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const exported = JSON.parse(manager.exportReports());

        expect(exported).toHaveProperty('exportDate');
        expect(exported).toHaveProperty('version');
        expect(exported).toHaveProperty('totalReports');
        expect(exported).toHaveProperty('accuracyStats');
        expect(exported).toHaveProperty('reports');
      });

      test('should include all reports', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);

        const exported = JSON.parse(manager.exportReports());

        expect(exported.totalReports).toBe(2);
        expect(exported.reports).toHaveLength(2);
      });

      test('should include accuracy statistics', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const exported = JSON.parse(manager.exportReports());

        expect(exported.accuracyStats).toHaveProperty('totalReports');
        expect(exported.accuracyStats).toHaveProperty('overallAccuracy');
      });

      test('should be pretty-printed with indentation', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const exported = manager.exportReports();

        expect(exported).toContain('\n');
        expect(exported).toContain('  '); // 2-space indentation
      });
    });

    describe('exportReportsCSV', () => {

      test('should return empty string when no reports', () => {
        const csv = manager.exportReportsCSV();

        expect(csv).toBe('');
      });

      test('should include CSV headers', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const csv = manager.exportReportsCSV();
        const lines = csv.split('\n');

        expect(lines[0]).toContain('ID');
        expect(lines[0]).toContain('Date');
        expect(lines[0]).toContain('County');
        expect(lines[0]).toContain('Species');
        expect(lines[0]).toContain('Predicted_Probability');
      });

      test('should export all reports as CSV rows', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);

        const csv = manager.exportReportsCSV();
        const lines = csv.split('\n');

        expect(lines).toHaveLength(3); // Header + 2 data rows
      });

      test('should quote all CSV values', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const csv = manager.exportReportsCSV();
        const lines = csv.split('\n');

        expect(lines[1]).toMatch(/^".*",".*",".*"/); // Values are quoted
      });

      test('should escape quotes in user notes', () => {
        manager.addReport({
          ...mockForagingReports.successfulMorels,
          user_notes: 'Found near "old growth" forest'
        });

        const csv = manager.exportReportsCSV();

        expect(csv).toContain('""old growth""'); // Escaped quotes
      });

      test('should handle null GPS coordinates', () => {
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);

        const csv = manager.exportReportsCSV();

        expect(() => csv.split('\n')).not.toThrow();
      });

      test('should format GPS coordinates as comma-separated', () => {
        manager.addReport(mockForagingReports.successfulMorels);

        const csv = manager.exportReportsCSV();

        expect(csv).toContain('44,'); // GPS coords
      });
    });

    describe('Observer Pattern', () => {

      test('should subscribe observers', () => {
        const callback = vi.fn();

        manager.subscribe(callback);

        expect(manager.observers).toContain(callback);
      });

      test('should notify observers when reports are saved', () => {
        const callback = vi.fn();
        manager.subscribe(callback);

        manager.addReport(mockForagingReports.successfulMorels);

        expect(callback).toHaveBeenCalled();
      });

      test('should pass reports and stats to observers', () => {
        const callback = vi.fn();
        manager.subscribe(callback);

        manager.addReport(mockForagingReports.successfulMorels);

        expect(callback).toHaveBeenCalledWith(
          expect.any(Array),
          expect.objectContaining({
            totalReports: expect.any(Number),
            overallAccuracy: expect.any(Number)
          })
        );
      });

      test('should unsubscribe observers', () => {
        const callback = vi.fn();
        manager.subscribe(callback);
        manager.unsubscribe(callback);

        manager.addReport(mockForagingReports.successfulMorels);

        expect(callback).not.toHaveBeenCalled();
      });

      test('should handle multiple observers', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        manager.subscribe(callback1);
        manager.subscribe(callback2);

        manager.addReport(mockForagingReports.successfulMorels);

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      test('should handle observer errors gracefully', () => {
        const errorCallback = vi.fn(() => {
          throw new Error('Observer error');
        });
        const successCallback = vi.fn();

        manager.subscribe(errorCallback);
        manager.subscribe(successCallback);

        expect(() => manager.addReport(mockForagingReports.successfulMorels)).not.toThrow();
        expect(successCallback).toHaveBeenCalled();
      });
    });

    describe('clearAllReports', () => {

      test('should clear all reports from memory', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.addReport(mockForagingReports.unsuccessfulChanterelles);

        manager.clearAllReports();

        expect(manager.reports).toEqual([]);
        expect(manager.reports).toHaveLength(0);
      });

      test('should clear reports from localStorage', () => {
        manager.addReport(mockForagingReports.successfulMorels);
        manager.clearAllReports();

        const stored = localStorage.getItem(manager.storageKey);
        const parsed = JSON.parse(stored);

        expect(parsed).toEqual([]);
      });

      test('should notify observers after clearing', () => {
        const callback = vi.fn();
        manager.subscribe(callback);

        manager.addReport(mockForagingReports.successfulMorels);
        callback.mockClear(); // Reset call count

        manager.clearAllReports();

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('getValidationInsights', () => {

      test('should return empty insights when no reports', () => {
        const insights = manager.getValidationInsights();

        expect(insights).toEqual([]);
      });

      test('should identify species with low accuracy', () => {
        // Add 3 morel reports with 1/3 success rate (33%)
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: true });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });

        const insights = manager.getValidationInsights();

        const speciesInsight = insights.find(i => i.type === 'low_species_accuracy');
        expect(speciesInsight).toBeDefined();
        expect(speciesInsight.species).toBe('morels');
        expect(speciesInsight.accuracy).toBeCloseTo(0.33, 2);
      });

      test('should not flag species with insufficient data', () => {
        // Only 2 reports (need >= 3)
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });

        const insights = manager.getValidationInsights();

        const speciesInsight = insights.find(i => i.type === 'low_species_accuracy');
        expect(speciesInsight).toBeUndefined();
      });

      test('should not flag species with good accuracy', () => {
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: true });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: true });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: true });

        const insights = manager.getValidationInsights();

        const speciesInsight = insights.find(i => i.type === 'low_species_accuracy');
        expect(speciesInsight).toBeUndefined();
      });

      test('should identify counties with low accuracy', () => {
        // Add 3 grafton reports with 1/3 success rate
        manager.addReport({ ...mockForagingReports.successfulMorels, county: 'grafton', actual_success: true });
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, county: 'grafton', actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulBlackTrumpets, county: 'grafton', actual_success: false });

        const insights = manager.getValidationInsights();

        const countyInsight = insights.find(i => i.type === 'low_county_accuracy');
        expect(countyInsight).toBeDefined();
        expect(countyInsight.county).toBe('grafton');
      });

      test('should identify high prediction inaccuracy', () => {
        // Add 5 high-probability predictions with low success rate
        for (let i = 0; i < 5; i++) {
          manager.addReport({
            ...mockForagingReports.successfulMorels,
            predicted_probability: 0.8,
            actual_success: i < 2 // Only 2/5 successful = 40%
          });
        }

        const insights = manager.getValidationInsights();

        const highPredInsight = insights.find(i => i.type === 'high_prediction_inaccuracy');
        expect(highPredInsight).toBeDefined();
        expect(highPredInsight.accuracy).toBeCloseTo(0.4, 2);
      });

      test('should not flag high predictions with insufficient data', () => {
        // Only 4 high predictions (need >= 5)
        for (let i = 0; i < 4; i++) {
          manager.addReport({
            ...mockForagingReports.successfulMorels,
            predicted_probability: 0.8,
            actual_success: false
          });
        }

        const insights = manager.getValidationInsights();

        const highPredInsight = insights.find(i => i.type === 'high_prediction_inaccuracy');
        expect(highPredInsight).toBeUndefined();
      });

      test('should not flag high predictions with good accuracy', () => {
        // 5 high predictions with 90% success
        for (let i = 0; i < 5; i++) {
          manager.addReport({
            ...mockForagingReports.successfulMorels,
            predicted_probability: 0.8,
            actual_success: i < 4 // 4/5 successful
          });
        }

        const insights = manager.getValidationInsights();

        const highPredInsight = insights.find(i => i.type === 'high_prediction_inaccuracy');
        expect(highPredInsight).toBeUndefined();
      });

      test('should include recommendations in insights', () => {
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });

        const insights = manager.getValidationInsights();

        const insight = insights[0];
        expect(insight).toHaveProperty('recommendation');
        expect(typeof insight.recommendation).toBe('string');
      });

      test('should return multiple insights for different issues', () => {
        // Low species accuracy
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });
        manager.addReport({ ...mockForagingReports.successfulMorels, actual_success: false });

        // Low county accuracy (different county)
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, county: 'merrimack', actual_success: false });
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, county: 'merrimack', actual_success: false });
        manager.addReport({ ...mockForagingReports.unsuccessfulChanterelles, county: 'merrimack', actual_success: false });

        const insights = manager.getValidationInsights();

        expect(insights.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
