/**
 * Tests for iNaturalistIntegration.js module
 * Testing API client, data processing, and observation analysis
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  NH_BOUNDARIES,
  NH_PLACE_ID,
  INaturalistClient,
  ObservationProcessor
} from '../../src/modules/iNaturalistIntegration.js';

describe('iNaturalist Integration Module', () => {

  describe('NH_BOUNDARIES Constant', () => {

    test('should have all required boundary coordinates', () => {
      expect(NH_BOUNDARIES).toHaveProperty('swlat');
      expect(NH_BOUNDARIES).toHaveProperty('swlng');
      expect(NH_BOUNDARIES).toHaveProperty('nelat');
      expect(NH_BOUNDARIES).toHaveProperty('nelng');
    });

    test('should have valid latitude values', () => {
      expect(NH_BOUNDARIES.swlat).toBeGreaterThan(40);
      expect(NH_BOUNDARIES.swlat).toBeLessThan(50);
      expect(NH_BOUNDARIES.nelat).toBeGreaterThan(40);
      expect(NH_BOUNDARIES.nelat).toBeLessThan(50);
    });

    test('should have valid longitude values', () => {
      expect(NH_BOUNDARIES.swlng).toBeGreaterThan(-80);
      expect(NH_BOUNDARIES.swlng).toBeLessThan(-70);
      expect(NH_BOUNDARIES.nelng).toBeGreaterThan(-80);
      expect(NH_BOUNDARIES.nelng).toBeLessThan(-70);
    });

    test('northeast should be north of southwest', () => {
      expect(NH_BOUNDARIES.nelat).toBeGreaterThan(NH_BOUNDARIES.swlat);
    });

    test('northeast should be east of southwest', () => {
      expect(NH_BOUNDARIES.nelng).toBeGreaterThan(NH_BOUNDARIES.swlng);
    });

    test('should match known NH boundaries approximately', () => {
      // NH southern border ~42.7°N
      expect(NH_BOUNDARIES.swlat).toBeCloseTo(42.7, 0);
      // NH northern border ~45.3°N
      expect(NH_BOUNDARIES.nelat).toBeCloseTo(45.3, 0);
    });
  });

  describe('NH_PLACE_ID Constant', () => {

    test('should be null (using bounding box instead)', () => {
      expect(NH_PLACE_ID).toBeNull();
    });
  });

  describe('INaturalistClient Class', () => {

    let client;

    beforeEach(() => {
      client = new INaturalistClient();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    describe('Constructor', () => {

      test('should initialize with default values', () => {
        expect(client.lastRequestTime).toBe(0);
        expect(client.requestCount).toBe(0);
        expect(client.cache).toBeInstanceOf(Map);
        expect(client.cacheExpiry).toBe(1000 * 60 * 60); // 1 hour
      });

      test('should have empty cache initially', () => {
        expect(client.cache.size).toBe(0);
      });
    });

    describe('rateLimitDelay', () => {

      test('should delay if request too soon after previous', async () => {
        client.lastRequestTime = Date.now();

        const startTime = Date.now();
        const delayPromise = client.rateLimitDelay();

        // Advance timers to simulate delay
        await vi.advanceTimersByTimeAsync(600);
        await delayPromise;

        expect(client.lastRequestTime).toBeGreaterThan(startTime);
      });

      test('should not delay if enough time has passed', async () => {
        client.lastRequestTime = Date.now() - 1000; // 1 second ago

        const startTime = Date.now();
        await client.rateLimitDelay();

        // Should complete immediately (or very quickly)
        expect(Date.now() - startTime).toBeLessThan(100);
      });

      test('should increment request count', async () => {
        const initialCount = client.requestCount;

        await client.rateLimitDelay();

        expect(client.requestCount).toBe(initialCount + 1);
      });

      test('should add extra delay every 50 requests', async () => {
        client.requestCount = 49;
        client.lastRequestTime = Date.now() - 1000;

        const delayPromise = client.rateLimitDelay();

        // Should trigger extra 2000ms delay on 50th request
        await vi.advanceTimersByTimeAsync(2000);
        await delayPromise;

        expect(client.requestCount).toBe(50);
      });
    });

    describe('buildURL', () => {

      test('should build URL with base endpoint', () => {
        const url = client.buildURL('/observations', {});

        expect(url).toContain('api.inaturalist.org/v1/observations');
      });

      test('should include NH bounding box coordinates', () => {
        const url = client.buildURL('/observations', {});

        expect(url).toContain('swlat=');
        expect(url).toContain('swlng=');
        expect(url).toContain('nelat=');
        expect(url).toContain('nelng=');
      });

      test('should include iconic_taxa=Fungi', () => {
        const url = client.buildURL('/observations', {});

        expect(url).toContain('iconic_taxa=Fungi');
      });

      test('should include quality_grade=research', () => {
        const url = client.buildURL('/observations', {});

        expect(url).toContain('quality_grade=research');
      });

      test('should include per_page parameter', () => {
        const url = client.buildURL('/observations', {});

        expect(url).toContain('per_page=200');
      });

      test('should merge custom parameters', () => {
        const url = client.buildURL('/observations', { year: 2024, month: 6 });

        expect(url).toContain('year=2024');
        expect(url).toContain('month=6');
      });

      test('should handle array parameters', () => {
        const url = client.buildURL('/observations', { taxon_id: [123, 456] });

        expect(url).toContain('taxon_id%5B%5D=123'); // URL encoded []
        expect(url).toContain('taxon_id%5B%5D=456');
      });

      test('should exclude null and undefined parameters', () => {
        const url = client.buildURL('/observations', { year: 2024, month: null, day: undefined });

        expect(url).toContain('year=2024');
        expect(url).not.toContain('month');
        expect(url).not.toContain('day');
      });
    });

    describe('makeRequest', () => {

      test('should make fetch request to URL', async () => {
        const mockData = { results: [], total_results: 0 };
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => mockData
        }));

        client.lastRequestTime = Date.now() - 1000; // Prevent rate limit delay

        const url = 'https://api.inaturalist.org/v1/observations';
        const result = await client.makeRequest(url);

        expect(global.fetch).toHaveBeenCalledWith(url);
        expect(result).toEqual(mockData);
      });

      test('should cache successful responses', async () => {
        const mockData = { results: [], total_results: 0 };
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => mockData
        }));

        client.lastRequestTime = Date.now() - 1000;

        const url = 'https://api.inaturalist.org/v1/observations';
        await client.makeRequest(url);

        expect(client.cache.has(url)).toBe(true);
      });

      test('should return cached data if not expired', async () => {
        const mockData = { results: [], total_results: 0 };
        const url = 'https://api.inaturalist.org/v1/observations';

        // Set cache
        client.cache.set(url, {
          data: mockData,
          timestamp: Date.now()
        });

        global.fetch = vi.fn();

        const result = await client.makeRequest(url);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result).toEqual(mockData);
      });

      test('should refetch if cache expired', async () => {
        const oldData = { results: ['old'], total_results: 1 };
        const newData = { results: ['new'], total_results: 1 };
        const url = 'https://api.inaturalist.org/v1/observations';

        // Set expired cache
        client.cache.set(url, {
          data: oldData,
          timestamp: Date.now() - (client.cacheExpiry + 1000)
        });

        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => newData
        }));

        client.lastRequestTime = Date.now() - 1000;

        const result = await client.makeRequest(url);

        expect(global.fetch).toHaveBeenCalled();
        expect(result).toEqual(newData);
      });

      test('should throw error on failed request', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        }));

        client.lastRequestTime = Date.now() - 1000;

        const url = 'https://api.inaturalist.org/v1/observations';

        await expect(client.makeRequest(url)).rejects.toThrow('API request failed');
      });

      test('should handle network errors', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

        client.lastRequestTime = Date.now() - 1000;

        const url = 'https://api.inaturalist.org/v1/observations';

        await expect(client.makeRequest(url)).rejects.toThrow('Network error');
      });
    });

    describe('getObservations', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000; // Prevent rate limit
      });

      test('should return formatted observation data', async () => {
        const mockResponse = {
          results: [{ id: 1 }, { id: 2 }],
          total_results: 2,
          page: 1,
          per_page: 200
        };

        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => mockResponse
        }));

        const result = await client.getObservations();

        expect(result.observations).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.page).toBe(1);
        expect(result.per_page).toBe(200);
      });

      test('should calculate total pages', async () => {
        const mockResponse = {
          results: [],
          total_results: 450,
          page: 1,
          per_page: 200
        };

        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => mockResponse
        }));

        const result = await client.getObservations();

        expect(result.pages).toBe(3); // 450 / 200 = 2.25 → 3 pages
      });

      test('should pass custom parameters', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [], total_results: 0 })
        }));

        await client.getObservations({ year: 2024, month: 5 });

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('year=2024');
        expect(calledUrl).toContain('month=5');
      });
    });

    describe('getSeasonalObservations', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000;
      });

      test('should include year and month parameters', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [], total_results: 0 })
        }));

        await client.getSeasonalObservations(2024, 6);

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('year=2024');
        expect(calledUrl).toContain('month=6');
      });
    });

    describe('getDateRangeObservations', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000;
      });

      test('should include d1 and d2 parameters', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [], total_results: 0 })
        }));

        await client.getDateRangeObservations('2024-05-01', '2024-05-31');

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('d1=2024-05-01');
        expect(calledUrl).toContain('d2=2024-05-31');
      });
    });

    describe('getAllObservations', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000;
      });

      test('should fetch multiple pages', async () => {
        let callCount = 0;
        global.fetch = vi.fn(() => {
          callCount++;
          // Advance timers for each fetch to handle rate limiting
          vi.advanceTimersByTime(600);
          return Promise.resolve({
            ok: true,
            json: async () => ({
              results: callCount <= 3 ? [{ id: callCount }] : [],
              total_results: 3,
              page: callCount,
              per_page: 1
            })
          });
        });

        const resultPromise = client.getAllObservations({}, 3);
        await vi.runAllTimersAsync();
        const result = await resultPromise;

        expect(result.observations).toHaveLength(3);
        expect(result.fetchedPages).toBe(3);
      });

      test('should respect maxPages limit', async () => {
        global.fetch = vi.fn(() => {
          vi.advanceTimersByTime(600);
          return Promise.resolve({
            ok: true,
            json: async () => ({
              results: [{ id: 1 }],
              total_results: 1000,
              page: 1,
              per_page: 200
            })
          });
        });

        const resultPromise = client.getAllObservations({}, 2);
        await vi.runAllTimersAsync();
        await resultPromise;

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      test('should stop when no more pages', async () => {
        let callCount = 0;
        global.fetch = vi.fn(() => {
          callCount++;
          return Promise.resolve({
            ok: true,
            json: async () => ({
              results: callCount === 1 ? [{ id: 1 }] : [],
              total_results: 1,
              page: callCount,
              per_page: 200
            })
          });
        });

        await client.getAllObservations({}, 5);

        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    describe('searchTaxon', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000;
      });

      test('should search taxa endpoint', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [{ id: 123, name: 'Morchella' }] })
        }));

        const result = await client.searchTaxon('Morchella');

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('/taxa');
        expect(calledUrl).toContain('q=Morchella');
      });

      test('should return taxa results', async () => {
        const mockTaxa = [{ id: 123, name: 'Morchella' }];
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: mockTaxa })
        }));

        const result = await client.searchTaxon('Morchella');

        expect(result).toEqual(mockTaxa);
      });

      test('should limit to 10 results per page', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [] })
        }));

        await client.searchTaxon('Fungi');

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('per_page=10');
      });
    });

    describe('getTaxonObservations', () => {

      beforeEach(() => {
        client.lastRequestTime = Date.now() - 1000;
      });

      test('should include taxon_id parameter', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [], total_results: 0 })
        }));

        await client.getTaxonObservations(47169); // Morchella

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('taxon_id=47169');
      });

      test('should merge date range parameters', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
          ok: true,
          json: async () => ({ results: [], total_results: 0 })
        }));

        await client.getTaxonObservations(47169, { d1: '2024-04-01', d2: '2024-05-31' });

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('taxon_id=47169');
        expect(calledUrl).toContain('d1=2024-04-01');
        expect(calledUrl).toContain('d2=2024-05-31');
      });
    });

    describe('clearCache', () => {

      test('should clear all cached data', () => {
        client.cache.set('url1', { data: {}, timestamp: Date.now() });
        client.cache.set('url2', { data: {}, timestamp: Date.now() });

        expect(client.cache.size).toBe(2);

        client.clearCache();

        expect(client.cache.size).toBe(0);
      });
    });

    describe('getStats', () => {

      test('should return current statistics', () => {
        client.requestCount = 5;
        client.lastRequestTime = 1609459200000;

        const stats = client.getStats();

        expect(stats.requestCount).toBe(5);
        expect(stats.cacheSize).toBe(0);
        expect(stats.lastRequestTime).toContain('2021-01-01');
      });
    });
  });

  describe('ObservationProcessor Class', () => {

    let processor;

    beforeEach(() => {
      processor = new ObservationProcessor();
    });

    describe('Constructor', () => {

      test('should initialize with empty processed data', () => {
        expect(processor.processedData).toBeInstanceOf(Map);
        expect(processor.processedData.size).toBe(0);
      });
    });

    describe('processObservations', () => {

      test('should process raw observation into structured format', () => {
        const rawObs = [{
          id: 12345,
          taxon: {
            id: 47169,
            name: 'Morchella',
            preferred_common_name: 'Morel',
            rank: 'genus'
          },
          location: '43.2,-71.5',
          place_guess: 'Manchester, NH',
          observed_on: '2024-05-15',
          created_at: '2024-05-16T10:00:00Z',
          time_observed_at: '2024-05-15T14:30:00Z',
          quality_grade: 'research',
          num_identification_agreements: 5,
          community_taxon: {},
          photos: [
            { id: 1, url: 'https://example.com/photo.jpg', square_url: 'sq.jpg', medium_url: 'med.jpg' }
          ],
          user: { id: 123, login: 'user123' }
        }];

        const processed = processor.processObservations(rawObs);

        expect(processed).toHaveLength(1);
        expect(processed[0].id).toBe(12345);
        expect(processed[0].taxon.name).toBe('Morchella');
        expect(processed[0].location.lat).toBe(43.2);
        expect(processed[0].location.lng).toBe(-71.5);
      });

      test('should handle missing location data', () => {
        const rawObs = [{
          id: 12345,
          taxon: { name: 'Test' },
          location: null
        }];

        const processed = processor.processObservations(rawObs);

        expect(processed[0].location.lat).toBeNull();
        expect(processed[0].location.lng).toBeNull();
      });

      test('should handle missing photos', () => {
        const rawObs = [{
          id: 12345,
          taxon: { name: 'Test' },
          photos: null
        }];

        const processed = processor.processObservations(rawObs);

        expect(processed[0].photos).toEqual([]);
      });

      test('should process multiple observations', () => {
        const rawObs = [
          { id: 1, taxon: { name: 'Species1' } },
          { id: 2, taxon: { name: 'Species2' } },
          { id: 3, taxon: { name: 'Species3' } }
        ];

        const processed = processor.processObservations(rawObs);

        expect(processed).toHaveLength(3);
      });
    });

    describe('groupByMonth', () => {

      test('should group observations by month', () => {
        const observations = [
          { date: { observed: '2024-05-15' } },
          { date: { observed: '2024-05-20' } },
          { date: { observed: '2024-06-10' } }
        ];

        const grouped = processor.groupByMonth(observations);

        expect(grouped['05']).toHaveLength(2);
        expect(grouped['06']).toHaveLength(1);
      });

      test('should handle observations without dates', () => {
        const observations = [
          { date: { observed: '2024-05-15' } },
          { date: { observed: null } }
        ];

        const grouped = processor.groupByMonth(observations);

        expect(grouped['05']).toHaveLength(1);
        expect(Object.keys(grouped)).toHaveLength(1);
      });

      test('should return empty object for no observations', () => {
        const grouped = processor.groupByMonth([]);

        expect(grouped).toEqual({});
      });
    });

    describe('groupByTaxon', () => {

      test('should group observations by taxon name', () => {
        const observations = [
          { taxon: { name: 'Morchella' } },
          { taxon: { name: 'Morchella' } },
          { taxon: { name: 'Cantharellus' } }
        ];

        const grouped = processor.groupByTaxon(observations);

        expect(grouped['Morchella']).toHaveLength(2);
        expect(grouped['Cantharellus']).toHaveLength(1);
      });

      test('should handle unknown taxon names', () => {
        const observations = [
          { taxon: { name: null } },
          { taxon: { name: undefined } }
        ];

        const grouped = processor.groupByTaxon(observations);

        expect(grouped['Unknown']).toBeDefined();
      });
    });

    describe('analyzePatterns', () => {

      test('should calculate total observations', () => {
        const observations = [
          { id: 1, taxon: { name: 'A' }, date: { observed: '2024-05-15' } },
          { id: 2, taxon: { name: 'B' }, date: { observed: '2024-06-10' } }
        ];

        const analysis = processor.analyzePatterns(observations);

        expect(analysis.totalObservations).toBe(2);
      });

      test('should count unique species', () => {
        const observations = [
          { taxon: { name: 'Morchella' }, date: { observed: '2024-05-15' } },
          { taxon: { name: 'Morchella' }, date: { observed: '2024-05-20' } },
          { taxon: { name: 'Cantharellus' }, date: { observed: '2024-06-10' } }
        ];

        const analysis = processor.analyzePatterns(observations);

        expect(analysis.uniqueSpecies).toBe(2);
      });

      test('should provide monthly breakdown', () => {
        const observations = [
          { taxon: { name: 'A' }, date: { observed: '2024-05-15' } },
          { taxon: { name: 'B' }, date: { observed: '2024-05-20' } },
          { taxon: { name: 'C' }, date: { observed: '2024-06-10' } }
        ];

        const analysis = processor.analyzePatterns(observations);

        expect(analysis.monthlyBreakdown).toHaveLength(2);
        expect(analysis.monthlyBreakdown[0].month).toBe('05');
        expect(analysis.monthlyBreakdown[0].count).toBe(2);
      });

      test('should provide species breakdown sorted by count', () => {
        const observations = [
          { taxon: { name: 'Morchella', commonName: 'Morel' }, date: { observed: '2024-05-15' } },
          { taxon: { name: 'Morchella', commonName: 'Morel' }, date: { observed: '2024-05-20' } },
          { taxon: { name: 'Morchella', commonName: 'Morel' }, date: { observed: '2024-05-25' } },
          { taxon: { name: 'Cantharellus', commonName: 'Chanterelle' }, date: { observed: '2024-06-10' } }
        ];

        const analysis = processor.analyzePatterns(observations);

        expect(analysis.speciesBreakdown[0].species).toBe('Morchella');
        expect(analysis.speciesBreakdown[0].count).toBe(3);
        expect(analysis.speciesBreakdown[0].commonName).toBe('Morel');
        expect(analysis.speciesBreakdown[1].species).toBe('Cantharellus');
        expect(analysis.speciesBreakdown[1].count).toBe(1);
      });

      test('should calculate unique months per species', () => {
        const observations = [
          { taxon: { name: 'Morchella' }, date: { observed: '2024-05-15' } },
          { taxon: { name: 'Morchella' }, date: { observed: '2024-05-20' } },
          { taxon: { name: 'Morchella' }, date: { observed: '2024-06-10' } }
        ];

        const analysis = processor.analyzePatterns(observations);

        expect(analysis.speciesBreakdown[0].months).toBe(2); // May and June
      });

      test('should handle empty observations array', () => {
        const analysis = processor.analyzePatterns([]);

        expect(analysis.totalObservations).toBe(0);
        expect(analysis.uniqueSpecies).toBe(0);
        expect(analysis.monthlyBreakdown).toEqual([]);
        expect(analysis.speciesBreakdown).toEqual([]);
      });
    });
  });

  describe('Integration Tests', () => {

    let client;
    let processor;

    beforeEach(() => {
      client = new INaturalistClient();
      processor = new ObservationProcessor();
      vi.useFakeTimers();
      client.lastRequestTime = Date.now() - 1000;
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    test('should fetch and process observations end-to-end', async () => {
      const mockResponse = {
        results: [
          {
            id: 123,
            taxon: { id: 47169, name: 'Morchella', preferred_common_name: 'Morel', rank: 'genus' },
            location: '43.2,-71.5',
            observed_on: '2024-05-15',
            quality_grade: 'research',
            photos: []
          }
        ],
        total_results: 1,
        page: 1,
        per_page: 200
      };

      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: async () => mockResponse
      }));

      const result = await client.getObservations({ year: 2024, month: 5 });
      const processed = processor.processObservations(result.observations);
      const analysis = processor.analyzePatterns(processed);

      expect(processed).toHaveLength(1);
      expect(analysis.totalObservations).toBe(1);
      expect(analysis.uniqueSpecies).toBe(1);
    });

    test('should cache and reuse data correctly', async () => {
      const mockResponse = { results: [{ id: 1 }], total_results: 1 };

      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: async () => mockResponse
      }));

      // First request
      await client.getObservations({ year: 2024 });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second request (should use cache)
      await client.getObservations({ year: 2024 });
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1, used cache
    });
  });
});
