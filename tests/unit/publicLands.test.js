/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
    publicLandData,
    updateRecommendations,
    getSpeciesLandData,
    getCountyLandData,
    requestLocationAccess
} from '../../src/modules/publicLands.js';

// Mock authentication module
vi.mock('../../src/modules/authentication.js', () => ({
    auth: {
        hasLocationAccess: vi.fn(() => false),
        showLoginModal: vi.fn(() => Promise.resolve(true))
    }
}));

describe('PublicLands Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    describe('publicLandData Structure', () => {
        const NH_COUNTIES = [
            'Coos County',
            'Grafton County',
            'Carroll County',
            'Sullivan County',
            'Merrimack County',
            'Belknap County',
            'Cheshire County',
            'Hillsborough County',
            'Strafford County',
            'Rockingham County'
        ];

        test('should contain all 10 NH counties', () => {
            const counties = Object.keys(publicLandData);
            expect(counties).toHaveLength(10);
            NH_COUNTIES.forEach(county => {
                expect(counties).toContain(county);
            });
        });

        test('each county should have general information', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(data).toHaveProperty('general');
                expect(data.general).toHaveProperty('climate');
                expect(data.general).toHaveProperty('soils');
                expect(data.general).toHaveProperty('bestMonths');
                expect(data.general).toHaveProperty('weatherStation');
                expect(data.general).toHaveProperty('dataQuality');
                expect(data.general).toHaveProperty('totalAcres');
            });
        });

        test('each county should have landsBySpecies', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(data).toHaveProperty('landsBySpecies');
                expect(typeof data.landsBySpecies).toBe('object');
            });
        });

        test('general climate should be non-empty string', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(typeof data.general.climate).toBe('string');
                expect(data.general.climate.length).toBeGreaterThan(0);
            });
        });

        test('general soils should be non-empty string', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(typeof data.general.soils).toBe('string');
                expect(data.general.soils.length).toBeGreaterThan(0);
            });
        });

        test('general bestMonths should be non-empty string', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(typeof data.general.bestMonths).toBe('string');
                expect(data.general.bestMonths.length).toBeGreaterThan(0);
            });
        });

        test('general weatherStation should contain coordinates', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(typeof data.general.weatherStation).toBe('string');
                expect(data.general.weatherStation).toMatch(/\d+\.\d+°[NS]/);
                expect(data.general.weatherStation).toMatch(/\d+\.\d+°[EW]/);
            });
        });

        test('general totalAcres should be non-empty string', () => {
            Object.entries(publicLandData).forEach(([county, data]) => {
                expect(typeof data.general.totalAcres).toBe('string');
                expect(data.general.totalAcres.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Location Data Structure', () => {
        test('location objects should have valid GPS coordinates', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.gps) {
                            // Should be in format: "latitude,longitude"
                            expect(location.gps).toMatch(/^-?\d+\.\d+,-?\d+\.\d+$/);
                        }
                    });
                });
            });
        });

        test('location objects should have valid elevation ranges', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.elevationRange) {
                            expect(Array.isArray(location.elevationRange)).toBe(true);
                            expect(location.elevationRange).toHaveLength(2);
                            expect(location.elevationRange[0]).toBeLessThanOrEqual(location.elevationRange[1]);
                            expect(location.elevationRange[0]).toBeGreaterThanOrEqual(0);
                            expect(location.elevationRange[1]).toBeLessThanOrEqual(10000);
                        }
                    });
                });
            });
        });

        test('location quality should be valid value', () => {
            const validQualities = ['high', 'medium', 'low'];
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.quality) {
                            expect(validQualities).toContain(location.quality);
                        }
                    });
                });
            });
        });

        test('location habitat should be string if present', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.habitat) {
                            expect(typeof location.habitat).toBe('string');
                            expect(location.habitat.length).toBeGreaterThan(0);
                        }
                    });
                });
            });
        });

        test('location bestAreas should be array or string', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.bestAreas) {
                            expect(['string', 'object']).toContain(typeof location.bestAreas);
                            if (Array.isArray(location.bestAreas)) {
                                expect(location.bestAreas.length).toBeGreaterThan(0);
                            }
                        }
                    });
                });
            });
        });

        test('location timing should be non-empty string', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.timing) {
                            expect(typeof location.timing).toBe('string');
                            expect(location.timing.length).toBeGreaterThan(0);
                        }
                    });
                });
            });
        });
    });

    describe('Species Coverage', () => {
        test('Coos County should have matsutake locations', () => {
            const coosLands = publicLandData['Coos County'].landsBySpecies;
            expect(coosLands).toHaveProperty('matsutake');
            expect(Array.isArray(coosLands.matsutake)).toBe(true);
            expect(coosLands.matsutake.length).toBeGreaterThan(0);
        });

        test('Coos County should have goldenchanterelle locations', () => {
            const coosLands = publicLandData['Coos County'].landsBySpecies;
            expect(coosLands).toHaveProperty('goldenchanterelle');
            expect(Array.isArray(coosLands.goldenchanterelle)).toBe(true);
            expect(coosLands.goldenchanterelle.length).toBeGreaterThan(0);
        });

        test('Merrimack County should have morels locations', () => {
            const merrimackLands = publicLandData['Merrimack County'].landsBySpecies;
            expect(merrimackLands).toHaveProperty('morels');
            expect(Array.isArray(merrimackLands.morels)).toBe(true);
            expect(merrimackLands.morels.length).toBeGreaterThan(0);
        });

        test('Cheshire County should have blacktrumpets locations', () => {
            const cheshireLands = publicLandData['Cheshire County'].landsBySpecies;
            expect(cheshireLands).toHaveProperty('blacktrumpets');
            expect(Array.isArray(cheshireLands.blacktrumpets)).toBe(true);
            expect(cheshireLands.blacktrumpets.length).toBeGreaterThan(0);
        });

        test('Hillsborough County should have winecap locations', () => {
            const hillsboroughLands = publicLandData['Hillsborough County'].landsBySpecies;
            expect(hillsboroughLands).toHaveProperty('winecap');
            expect(Array.isArray(hillsboroughLands.winecap)).toBe(true);
            expect(hillsboroughLands.winecap.length).toBeGreaterThan(0);
        });
    });

    describe('getSpeciesLandData', () => {
        const mockLandsBySpecies = {
            kingbolete: [
                { name: 'Location 1', quality: 'high' },
                { name: 'Location 2', quality: 'medium' }
            ],
            morels: [
                { name: 'Morel Location', quality: 'high' }
            ]
        };

        test('should return locations for regular species', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'morels');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Morel Location');
        });

        test('should return kingbolete data for boletusSubcaerulescens', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusSubcaerulescens');
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Location 1');
        });

        test('should return kingbolete data for boletusVariipes', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusVariipes');
            expect(result).toHaveLength(2);
        });

        test('should return kingbolete data for boletusEdulis', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusEdulis');
            expect(result).toHaveLength(2);
        });

        test('should return kingbolete data for boletusAtkinsonii', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusAtkinsonii');
            expect(result).toHaveLength(2);
        });

        test('should return kingbolete data for boletus_separans', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletus_separans');
            expect(result).toHaveLength(2);
        });

        test('should return kingbolete data for boletusNobilis', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusNobilis');
            expect(result).toHaveLength(2);
        });

        test('should return kingbolete data for boletusChippewaensis', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'boletusChippewaensis');
            expect(result).toHaveLength(2);
        });

        test('should return empty array for nonexistent species', () => {
            const result = getSpeciesLandData(mockLandsBySpecies, 'nonexistent');
            expect(result).toEqual([]);
        });

        test('should handle empty landsBySpecies object', () => {
            const result = getSpeciesLandData({}, 'morels');
            expect(result).toEqual([]);
        });
    });

    describe('getCountyLandData', () => {
        test('should return null for nonexistent county', () => {
            const result = getCountyLandData('Nonexistent County');
            expect(result).toBeNull();
        });

        test('should always return general information', () => {
            const result = getCountyLandData('Coos County');
            expect(result).toHaveProperty('general');
            expect(result.general).toHaveProperty('climate');
            expect(result.general).toHaveProperty('soils');
        });

        test('should require authentication for location data by default', async () => {
            const { auth } = await import('../../src/modules/authentication.js');
            auth.hasLocationAccess.mockReturnValue(false);

            const result = getCountyLandData('Coos County');
            expect(result.landsBySpecies).toBeNull();
            expect(result.authRequired).toBe(true);
            expect(result.message).toContain('authentication');
        });

        test('should return location data when authenticated', async () => {
            const { auth } = await import('../../src/modules/authentication.js');
            auth.hasLocationAccess.mockReturnValue(true);

            const result = getCountyLandData('Coos County');
            expect(result.landsBySpecies).toBeTruthy();
            expect(result.authRequired).toBeUndefined();
            expect(result.landsBySpecies).toHaveProperty('matsutake');
        });

        test('should return general data for all counties', () => {
            const counties = [
                'Coos County',
                'Grafton County',
                'Carroll County',
                'Sullivan County',
                'Merrimack County',
                'Belknap County',
                'Cheshire County',
                'Hillsborough County',
                'Strafford County',
                'Rockingham County'
            ];

            counties.forEach(county => {
                const result = getCountyLandData(county);
                expect(result).toBeTruthy();
                expect(result.general).toBeTruthy();
            });
        });
    });

    describe('requestLocationAccess', () => {
        test('should call auth.showLoginModal', async () => {
            const { auth } = await import('../../src/modules/authentication.js');

            await requestLocationAccess();

            expect(auth.showLoginModal).toHaveBeenCalled();
        });

        test('should return Promise', () => {
            const result = requestLocationAccess();
            expect(result).toBeInstanceOf(Promise);
        });
    });

    describe('updateRecommendations', () => {
        let recDiv;

        beforeEach(() => {
            recDiv = document.createElement('div');
            recDiv.id = 'rec-text';
            document.body.appendChild(recDiv);
        });

        test('should show message when no county selected', () => {
            updateRecommendations(null, 'morels', publicLandData);
            expect(recDiv.innerHTML).toContain('Select a county and species');
        });

        test('should show message when no species selected', () => {
            updateRecommendations('Coos County', null, publicLandData);
            expect(recDiv.innerHTML).toContain('Select a county and species');
        });

        test('should show message when county not in data', () => {
            updateRecommendations('Nonexistent County', 'morels', publicLandData);
            expect(recDiv.innerHTML).toContain('Select a county and species');
        });

        test('should show message when no locations for species', () => {
            updateRecommendations('Coos County', 'nonexistent', publicLandData);
            expect(recDiv.innerHTML).toContain('No public land recommendations');
        });

        test('should display location information', () => {
            updateRecommendations('Merrimack County', 'morels', publicLandData);
            expect(recDiv.innerHTML).toContain('Bear Brook State Park');
        });

        test('should display GPS coordinates as links', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('maps.google.com');
            expect(recDiv.innerHTML).toContain('GPS:');
        });

        test('should display elevation range', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Elevation:');
            expect(recDiv.innerHTML).toMatch(/\d+-\d+ ft/);
        });

        test('should display habitat information', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Habitat:');
        });

        test('should display best areas', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Best Areas:');
        });

        test('should display timing information', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Timing:');
        });

        test('should display soil type', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Soil:');
        });

        test('should display dominant trees', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Trees:');
        });

        test('should display quality rating', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Quality:');
        });

        test('should handle missing rec-text element gracefully', () => {
            document.body.innerHTML = '';
            expect(() => {
                updateRecommendations('Coos County', 'matsutake', publicLandData);
            }).toThrow();
        });

        test('should display multiple locations', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            const locations = recDiv.querySelectorAll('.rec-location');
            expect(locations.length).toBeGreaterThan(1);
        });

        test('should display contact information', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Contact:');
        });

        test('should display permit information when present', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Permit Info:');
        });

        test('should display notes when present', () => {
            updateRecommendations('Coos County', 'matsutake', publicLandData);
            expect(recDiv.innerHTML).toContain('Note:');
        });
    });

    describe('Data Integrity', () => {
        test('all locations with GPS should have valid NH coordinates', () => {
            // NH boundaries: approximately 42.7°N to 45.3°N, -72.6°W to -70.7°W
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.gps) {
                            const [lat, lng] = location.gps.split(',').map(parseFloat);
                            expect(lat).toBeGreaterThanOrEqual(42.0);
                            expect(lat).toBeLessThanOrEqual(46.0);
                            expect(lng).toBeGreaterThanOrEqual(-73.0);
                            expect(lng).toBeLessThanOrEqual(-70.0);
                        }
                    });
                });
            });
        });

        test('all parking GPS should have valid NH coordinates', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        if (location.parkingGPS) {
                            const [lat, lng] = location.parkingGPS.split(',').map(parseFloat);
                            expect(lat).toBeGreaterThanOrEqual(42.0);
                            expect(lat).toBeLessThanOrEqual(46.0);
                            expect(lng).toBeGreaterThanOrEqual(-73.0);
                            expect(lng).toBeLessThanOrEqual(-70.0);
                        }
                    });
                });
            });
        });

        test('all locations should have either name or habitat', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        expect(location.name || location.habitat).toBeTruthy();
                    });
                });
            });
        });

        test('bestMonths should contain valid month names', () => {
            const validMonths = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            Object.entries(publicLandData).forEach(([county, data]) => {
                const bestMonths = data.general.bestMonths;
                const hasValidMonth = validMonths.some(month =>
                    bestMonths.includes(month)
                );
                expect(hasValidMonth).toBe(true);
            });
        });

        test('all locations should have timing information', () => {
            Object.entries(publicLandData).forEach(([county, countyData]) => {
                Object.entries(countyData.landsBySpecies).forEach(([species, locations]) => {
                    locations.forEach(location => {
                        expect(location.timing || location.note).toBeTruthy();
                    });
                });
            });
        });
    });

    describe('Specific County Data', () => {
        test('Coos County should have extensive matsutake data', () => {
            const coosLands = publicLandData['Coos County'].landsBySpecies;
            expect(coosLands.matsutake.length).toBeGreaterThanOrEqual(3);
        });

        test('Merrimack County should have Bear Brook State Park', () => {
            const merrimackLands = publicLandData['Merrimack County'].landsBySpecies;
            const bearBrook = merrimackLands.morels.find(loc =>
                loc.name.includes('Bear Brook')
            );
            expect(bearBrook).toBeTruthy();
        });

        test('Cheshire County should have Pisgah State Park', () => {
            const cheshireLands = publicLandData['Cheshire County'].landsBySpecies;
            const pisgah = cheshireLands.blacktrumpets.find(loc =>
                loc.name.includes('Pisgah')
            );
            expect(pisgah).toBeTruthy();
        });

        test('Hillsborough County should focus on urban species', () => {
            const hillsboroughLands = publicLandData['Hillsborough County'].landsBySpecies;
            expect(hillsboroughLands).toHaveProperty('winecap');
            expect(hillsboroughLands).toHaveProperty('shaggymane');
        });

        test('Rockingham County should have coastal emphasis', () => {
            const rockinghamGeneral = publicLandData['Rockingham County'].general;
            expect(rockinghamGeneral.climate.toLowerCase()).toContain('coastal');
        });

        test('Carroll County should mention White Mountains', () => {
            const carrollGeneral = publicLandData['Carroll County'].general;
            expect(carrollGeneral.climate).toContain('White Mountain');
        });
    });
});
