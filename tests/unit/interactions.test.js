/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import {
    displaySpeciesInfo,
    displayCountyInfo,
    closeCountyModal,
    handleCountyClick,
    openForagingReport,
    closeForagingReport,
    showForagingStats,
    closeStatsModal,
    exportForagingData,
    closeExportModal,
    downloadJSON,
    downloadCSV,
    closeValidationResults,
    clearCountyInfo,
    handleSpeciesChange,
    setupManualControls,
    initInteractions
} from '../../src/modules/interactions.js';

// Mock dependencies
vi.mock('../../src/modules/species.js', () => ({
    speciesData: {
        morels: {
            name: 'Morels (Morchella americana)',
            tempRange: [50, 70],
            moistureMin: 1.0,
            seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0, winter: 0.0 },
            hostTrees: ['ash', 'elm', 'apple'],
            microhabitat: 'old orchards',
            soilPreference: 'rich, well-drained',
            identificationNotes: {
                cap: 'honeycomb appearance',
                stem: 'hollow',
                color: 'yellow-brown to gray-brown'
            },
            regions: {
                'Great North Woods': 0.6,
                'White Mountains': 0.7,
                'Dartmouth-Sunapee': 0.5,
                'Merrimack Valley': 0.6,
                'Lakes Region': 0.5,
                'Monadnock Region': 0.5,
                'Seacoast': 0.4
            }
        },
        chanterelles: {
            name: 'Chanterelles (Cantharellus cibarius)',
            tempRange: [60, 75],
            moistureMin: 1.5,
            seasonMultiplier: { spring: 0.3, summer: 1.0, fall: 0.8, winter: 0.0 },
            hostTrees: ['oak', 'beech', 'hemlock'],
            microhabitat: 'mossy forest floors',
            soilPreference: 'well-drained acidic soils',
            identificationNotes: {
                gills: 'false gills',
                color: 'golden yellow',
                smell: 'fruity apricot-like'
            },
            regions: {
                'Great North Woods': 0.7,
                'White Mountains': 0.8,
                'Dartmouth-Sunapee': 0.6,
                'Merrimack Valley': 0.5,
                'Lakes Region': 0.6,
                'Monadnock Region': 0.5,
                'Seacoast': 0.4
            }
        }
    },
    populateSpeciesDropdown: vi.fn(),
    updateSpeciesDisplay: vi.fn()
}));

vi.mock('../../src/modules/publicLands.js', () => ({
    getCountyLandData: vi.fn((county) => {
        if (county === 'Coos County') {
            return {
                general: {
                    climate: 'cool, humid',
                    soils: 'acidic',
                    bestMonths: 'May-October',
                    totalAcres: '100,000'
                },
                authRequired: false,
                landsBySpecies: {
                    morels: [
                        {
                            name: 'Test Location',
                            gps: '44.5,-71.5',
                            access: 'public',
                            timing: 'May-June'
                        }
                    ]
                }
            };
        }
        return null;
    }),
    requestLocationAccess: vi.fn()
}));

vi.mock('../../src/modules/mapCalculations.js', () => ({
    getCountyInfo: vi.fn((countyKey, species) => ({
        species: 'Morels',
        probability: 0.75,
        color: '#4CAF50',
        weather: {
            rainfall: 1.2,
            soilTemp: 65,
            airTemp: 70
        },
        recommendations: [
            'Good conditions for foraging',
            'Check north-facing slopes'
        ]
    })),
    updateMap: vi.fn(),
    getTopSpeciesForCounty: vi.fn(() => [
        {
            key: 'morels',
            name: 'Morels',
            probability: 0.85,
            color: '#4CAF50',
            tempRange: [50, 70],
            currentTemp: 65,
            moistureMin: 1.0,
            currentMoisture: 1.2,
            seasonMultiplier: { spring: 1.0, summer: 0.1, fall: 0.0 },
            currentSeason: 'spring',
            hostTrees: ['ash', 'elm']
        },
        {
            key: 'chanterelles',
            name: 'Chanterelles',
            probability: 0.72,
            color: '#FFC107',
            tempRange: [60, 75],
            currentTemp: 65,
            moistureMin: 1.5,
            currentMoisture: 1.2,
            seasonMultiplier: { spring: 0.3, summer: 1.0, fall: 0.8 },
            currentSeason: 'spring',
            hostTrees: ['oak', 'beech']
        }
    ])
}));

vi.mock('../../src/modules/weather.js', () => ({
    updateWeatherDisplay: vi.fn()
}));

vi.mock('../../src/modules/foragingReports.js', () => ({
    reportsManager: {
        addReport: vi.fn((data) => ({
            id: 'test-report-123',
            ...data
        })),
        calculateAccuracyStats: vi.fn(() => ({
            totalReports: 10,
            overallAccuracy: 0.75,
            bySpecies: {
                morels: { total: 5, successful: 4, accuracy: 0.8 }
            },
            byCounty: {
                coos: { total: 3, successful: 2, accuracy: 0.67 }
            }
        })),
        getReportsByCounty: vi.fn(() => [
            { species: 'morels', actual_success: true }
        ]),
        getReportsBySpecies: vi.fn(() => [
            { county: 'coos', actual_success: true }
        ]),
        getValidationInsights: vi.fn(() => []),
        exportReports: vi.fn(() => JSON.stringify({ reports: [] })),
        exportReportsCSV: vi.fn(() => 'id,county,species\n1,coos,morels')
    }
}));

vi.mock('../../src/modules/observationAnalysis.js', () => ({
    observationAnalyzer: {
        validatePredictions: vi.fn(),
        crossValidateWithUserReports: vi.fn()
    }
}));

describe('Interactions Module', () => {
    // Helper function to create a properly configured species select
    const createSpeciesSelect = (selectedValue = 'morels') => {
        const select = document.createElement('select');
        select.id = 'species-select';

        // Add options
        const morelsOption = document.createElement('option');
        morelsOption.value = 'morels';
        morelsOption.textContent = 'Morels';
        select.appendChild(morelsOption);

        const chanterellesOption = document.createElement('option');
        chanterellesOption.value = 'chanterelles';
        chanterellesOption.textContent = 'Chanterelles';
        select.appendChild(chanterellesOption);

        // Set selected value
        select.value = selectedValue;
        return select;
    };

    beforeEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();

        // Mock scrollIntoView (not implemented in jsdom)
        Element.prototype.scrollIntoView = vi.fn();
    });

    describe('displaySpeciesInfo', () => {
        test('should display species information', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('morels');

            expect(infoPanel.innerHTML).toContain('Morels');
            expect(infoPanel.innerHTML).toContain('50°F - 70°F');
            expect(infoPanel.innerHTML).toContain('1.0" rainfall (past 7-10 days)');
            expect(infoPanel.style.display).toBe('block');
        });

        test('should handle missing species gracefully', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('nonexistent');

            expect(infoPanel.innerHTML).toBe('');
        });

        test('should handle missing info panel gracefully', () => {
            expect(() => displaySpeciesInfo('morels')).not.toThrow();
        });

        test('should display temperature range', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('morels');

            expect(infoPanel.innerHTML).toContain('🌡️ Growing Conditions');
            expect(infoPanel.innerHTML).toContain('Temperature Range');
        });

        test('should display host trees', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('morels');

            expect(infoPanel.innerHTML).toContain('🌳 Habitat & Host Trees');
            expect(infoPanel.innerHTML).toContain('ash, elm, apple');
        });

        test('should display seasonal multipliers', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('morels');

            expect(infoPanel.innerHTML).toContain('📅 Seasonal Timing');
            expect(infoPanel.innerHTML).toContain('Spring');
            expect(infoPanel.innerHTML).toContain('100%'); // spring: 1.0
        });

        test('should display identification notes', () => {
            const infoPanel = document.createElement('div');
            infoPanel.id = 'species-info';
            document.body.appendChild(infoPanel);

            displaySpeciesInfo('morels');

            expect(infoPanel.innerHTML).toContain('🔍 Identification Notes');
            expect(infoPanel.innerHTML).toContain('cap');
            expect(infoPanel.innerHTML).toContain('honeycomb appearance');
        });
    });

    describe('displayCountyInfo', () => {
        test('should display county information panel', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel).toBeTruthy();
            expect(countyPanel.innerHTML).toContain('Coos County');
            expect(countyPanel.style.display).toBe('block');
        });

        test('should show message when no species selected', () => {
            const speciesSelect = document.createElement('select');
            speciesSelect.id = 'species-select';
            speciesSelect.value = '';
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('Please select a species first');
        });

        test('should display probability', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('75.0%'); // 0.75 * 100
        });

        test('should display current conditions', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('📊 Current Conditions');
            expect(countyPanel.innerHTML).toContain('1.20"'); // rainfall
            expect(countyPanel.innerHTML).toContain('65°F'); // soil temp
        });

        test('should display recommendations', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('💡 Recommendations');
            expect(countyPanel.innerHTML).toContain('Good conditions for foraging');
        });

        test('should display top species rankings', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('🏆 Top 5 Most Likely Species');
            expect(countyPanel.innerHTML).toContain('Morels');
            expect(countyPanel.innerHTML).toContain('Chanterelles');
        });

        test('should display general land information', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('🏞️ General Information');
            expect(countyPanel.innerHTML).toContain('cool, humid');
        });

        test('should include report foraging results button', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('📊 Report Foraging Results');
            expect(countyPanel.innerHTML).toContain('openForagingReport');
        });

        test('should include data analytics buttons', () => {
            const speciesSelect = createSpeciesSelect('morels');
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('📊 Community Data & Analytics');
            expect(countyPanel.innerHTML).toContain('View Success Statistics');
            expect(countyPanel.innerHTML).toContain('Validate with iNaturalist');
        });
    });

    describe('closeCountyModal', () => {
        test('should hide county modal', () => {
            const modal = document.createElement('div');
            modal.id = 'county-modal';
            modal.style.display = 'block';
            document.body.appendChild(modal);

            closeCountyModal();

            expect(modal.style.display).toBe('none');
        });

        test('should handle missing modal gracefully', () => {
            expect(() => closeCountyModal()).not.toThrow();
        });
    });

    describe('handleCountyClick', () => {
        test('should display county info on click', () => {
            const speciesSelect = document.createElement('select');
            speciesSelect.id = 'species-select';
            speciesSelect.value = 'morels';
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            const county = document.createElement('div');
            county.setAttribute('data-county', 'coos');
            document.body.appendChild(county);

            const event = { target: county };
            handleCountyClick(event);

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel).toBeTruthy();
            expect(countyPanel.innerHTML).toContain('Coos County');
        });

        test('should handle missing data-county attribute', () => {
            const county = document.createElement('div');
            const event = { target: county };

            expect(() => handleCountyClick(event)).not.toThrow();
        });
    });

    describe('openForagingReport', () => {
        test('should create and show foraging report modal', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            expect(modal).toBeTruthy();
            expect(modal.style.display).toBe('flex');
            expect(modal.getAttribute('aria-hidden')).toBe('false');
        });

        test('should pre-fill form with provided data', () => {
            openForagingReport('coos', 'morels', 0.85);

            const modal = document.getElementById('foraging-report-modal');
            const form = modal.querySelector('#foraging-report-form');

            // Access form fields by name attribute
            const countyField = form.querySelector('[name="county"]');
            const speciesField = form.querySelector('[name="species"]');
            const probField = form.querySelector('[name="predicted_probability"]');

            expect(countyField.value).toBe('coos');
            expect(speciesField.value).toBe('morels');
            expect(probField.value).toBe('0.850');
        });

        test('should set current date as default', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const form = modal.querySelector('#foraging-report-form');
            const dateField = form.querySelector('[name="date"]');
            const today = new Date().toISOString().split('T')[0];

            expect(dateField.value).toBe(today);
        });

        test('should reuse existing modal if present', () => {
            openForagingReport('coos', 'morels', 0.75);
            const firstModal = document.getElementById('foraging-report-modal');

            openForagingReport('grafton', 'chanterelles', 0.65);
            const secondModal = document.getElementById('foraging-report-modal');

            expect(firstModal).toBe(secondModal);
        });

        test('should include all NH counties in dropdown', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const countySelect = modal.querySelector('#report-county');
            const options = Array.from(countySelect.options).map(o => o.value);

            expect(options).toContain('coos');
            expect(options).toContain('grafton');
            expect(options).toContain('carroll');
            expect(options).toHaveLength(10); // All 10 NH counties
        });

        test('should include species dropdown', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const speciesSelect = modal.querySelector('#report-species');
            const options = Array.from(speciesSelect.options).map(o => o.value);

            expect(options).toContain('morels');
            expect(options).toContain('chanterelles');
        });

        test('should include success/failure radio buttons', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const radios = modal.querySelectorAll('input[name="actual_success"]');

            expect(radios).toHaveLength(2);
            expect(radios[0].value).toBe('true');
            expect(radios[1].value).toBe('false');
        });
    });

    describe('closeForagingReport', () => {
        test('should hide foraging report modal', () => {
            openForagingReport('coos', 'morels', 0.75);
            const modal = document.getElementById('foraging-report-modal');

            closeForagingReport();

            expect(modal.style.display).toBe('none');
            expect(modal.getAttribute('aria-hidden')).toBe('true');
        });

        test('should handle missing modal gracefully', () => {
            expect(() => closeForagingReport()).not.toThrow();
        });
    });

    describe('showForagingStats', () => {
        test('should create and show stats modal', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            expect(modal).toBeTruthy();
            expect(modal.style.display).toBe('flex');
        });

        test('should display overall statistics', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            const content = modal.querySelector('#stats-content');

            expect(content.innerHTML).toContain('Overall Community Statistics');
            expect(content.innerHTML).toContain('10'); // totalReports
            expect(content.innerHTML).toContain('75.0%'); // overallAccuracy
        });

        test('should display county-specific statistics', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            const content = modal.querySelector('#stats-content');

            expect(content.innerHTML).toContain('Coos County Statistics');
            expect(content.innerHTML).toContain('66.7%'); // coos accuracy
        });

        test('should display species-specific statistics', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            const content = modal.querySelector('#stats-content');

            expect(content.innerHTML).toContain('Morels Statistics');
            expect(content.innerHTML).toContain('80.0%'); // morels accuracy
        });

        test('should display combined county+species stats', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            const content = modal.querySelector('#stats-content');

            expect(content.innerHTML).toContain('morels in coos County');
        });
    });

    describe('closeStatsModal', () => {
        test('should hide stats modal', () => {
            showForagingStats('coos', 'morels');
            const modal = document.getElementById('stats-modal');

            closeStatsModal();

            expect(modal.style.display).toBe('none');
        });

        test('should handle missing modal gracefully', () => {
            expect(() => closeStatsModal()).not.toThrow();
        });
    });

    describe('exportForagingData', () => {
        test('should create and show export modal', () => {
            exportForagingData();

            const modal = document.getElementById('export-modal');
            expect(modal).toBeTruthy();
            expect(modal.style.display).toBe('flex');
        });

        test('should display export statistics', () => {
            exportForagingData();

            const modal = document.getElementById('export-modal');
            const stats = modal.querySelector('#export-stats');

            expect(stats.innerHTML).toContain('10'); // totalReports
            expect(stats.innerHTML).toContain('75.0%'); // overallAccuracy
        });

        test('should include JSON export button', () => {
            exportForagingData();

            const modal = document.getElementById('export-modal');
            expect(modal.innerHTML).toContain('📄 Download JSON');
            expect(modal.innerHTML).toContain('downloadJSON()');
        });

        test('should include CSV export button', () => {
            exportForagingData();

            const modal = document.getElementById('export-modal');
            expect(modal.innerHTML).toContain('📊 Download CSV');
            expect(modal.innerHTML).toContain('downloadCSV()');
        });
    });

    describe('closeExportModal', () => {
        test('should hide export modal', () => {
            exportForagingData();
            const modal = document.getElementById('export-modal');

            closeExportModal();

            expect(modal.style.display).toBe('none');
        });

        test('should handle missing modal gracefully', () => {
            expect(() => closeExportModal()).not.toThrow();
        });
    });

    describe('downloadJSON', () => {
        test('should create download link for JSON', () => {
            // Mock URL.createObjectURL
            global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            global.URL.revokeObjectURL = vi.fn();

            // Spy on createElement
            const createElementSpy = vi.spyOn(document, 'createElement');

            downloadJSON();

            // Verify link was created
            const linkCalls = createElementSpy.mock.results.filter(
                r => r.value?.tagName === 'A'
            );
            expect(linkCalls.length).toBeGreaterThan(0);
        });

        test('should close export modal after download', () => {
            global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            global.URL.revokeObjectURL = vi.fn();

            exportForagingData();
            const modal = document.getElementById('export-modal');

            downloadJSON();

            expect(modal.style.display).toBe('none');
        });
    });

    describe('downloadCSV', () => {
        test('should create download link for CSV', () => {
            global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            global.URL.revokeObjectURL = vi.fn();

            const createElementSpy = vi.spyOn(document, 'createElement');

            downloadCSV();

            const linkCalls = createElementSpy.mock.results.filter(
                r => r.value?.tagName === 'A'
            );
            expect(linkCalls.length).toBeGreaterThan(0);
        });

        test('should close export modal after download', () => {
            global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            global.URL.revokeObjectURL = vi.fn();

            exportForagingData();
            const modal = document.getElementById('export-modal');

            downloadCSV();

            expect(modal.style.display).toBe('none');
        });
    });

    describe('closeValidationResults', () => {
        test('should hide validation results modal', () => {
            const modal = document.createElement('div');
            modal.id = 'validation-results-modal';
            modal.style.display = 'flex';
            document.body.appendChild(modal);

            closeValidationResults();

            expect(modal.style.display).toBe('none');
        });

        test('should handle missing modal gracefully', () => {
            expect(() => closeValidationResults()).not.toThrow();
        });
    });

    describe('clearCountyInfo', () => {
        test('should hide county info panel', () => {
            const countyPanel = document.createElement('div');
            countyPanel.id = 'county-info';
            countyPanel.style.display = 'block';
            document.body.appendChild(countyPanel);

            clearCountyInfo();

            expect(countyPanel.style.display).toBe('none');
        });

        test('should handle missing panel gracefully', () => {
            expect(() => clearCountyInfo()).not.toThrow();
        });
    });

    describe('handleSpeciesChange', () => {
        test('should update species display and map', async () => {
            const { updateSpeciesDisplay } = await import('../../src/modules/species.js');
            const { updateMap } = await import('../../src/modules/mapCalculations.js');

            const select = document.createElement('select');
            select.value = 'morels';
            const event = { target: select };

            handleSpeciesChange(event);

            expect(updateSpeciesDisplay).toHaveBeenCalled();
            expect(updateMap).toHaveBeenCalledWith('morels');
        });
    });

    describe('setupManualControls', () => {
        test('should setup slider event listeners', () => {
            const rainfall = document.createElement('input');
            rainfall.id = 'rainfall';
            rainfall.type = 'range';
            rainfall.value = '1.5';
            document.body.appendChild(rainfall);

            const rainfallValue = document.createElement('span');
            rainfallValue.id = 'rainfall-value';
            document.body.appendChild(rainfallValue);

            setupManualControls();

            // Trigger input event
            rainfall.value = '2.5';
            rainfall.dispatchEvent(new Event('input'));

            expect(rainfallValue.textContent).toBe('2.5"');
        });

        test('should setup soil temp slider', () => {
            const soilTemp = document.createElement('input');
            soilTemp.id = 'soil-temp';
            soilTemp.type = 'range';
            soilTemp.value = '65';
            document.body.appendChild(soilTemp);

            const soilTempValue = document.createElement('span');
            soilTempValue.id = 'soil-temp-value';
            document.body.appendChild(soilTempValue);

            setupManualControls();

            soilTemp.value = '70';
            soilTemp.dispatchEvent(new Event('input'));

            expect(soilTempValue.textContent).toBe('70°F');
        });

        test('should setup air temp slider', () => {
            const airTemp = document.createElement('input');
            airTemp.id = 'air-temp';
            airTemp.type = 'range';
            airTemp.value = '75';
            document.body.appendChild(airTemp);

            const airTempValue = document.createElement('span');
            airTempValue.id = 'air-temp-value';
            document.body.appendChild(airTempValue);

            setupManualControls();

            airTemp.value = '80';
            airTemp.dispatchEvent(new Event('input'));

            expect(airTempValue.textContent).toBe('80°F');
        });

        test('should handle missing controls gracefully', () => {
            expect(() => setupManualControls()).not.toThrow();
        });
    });

    describe('initInteractions', () => {
        test('should initialize species dropdown', async () => {
            const { populateSpeciesDropdown } = await import('../../src/modules/species.js');

            const speciesSelect = document.createElement('select');
            speciesSelect.id = 'species-select';
            document.body.appendChild(speciesSelect);

            initInteractions();

            expect(populateSpeciesDropdown).toHaveBeenCalledWith('species-select');
        });

        test('should attach change handler to species select', () => {
            const speciesSelect = document.createElement('select');
            speciesSelect.id = 'species-select';
            document.body.appendChild(speciesSelect);

            initInteractions();

            // Verify event listener was added by checking internal property
            expect(speciesSelect.onchange || speciesSelect.eventListeners).toBeDefined();
        });

        test('should setup update button click handler', () => {
            const updateButton = document.createElement('button');
            updateButton.id = 'update-map';
            document.body.appendChild(updateButton);

            initInteractions();

            // Verify event listener exists
            expect(updateButton.onclick || updateButton.eventListeners).toBeDefined();
        });

        test('should make functions globally available', () => {
            initInteractions();

            expect(window.closeCountyModal).toBeDefined();
            expect(window.displayCountyInfo).toBeDefined();
            expect(window.openForagingReport).toBeDefined();
            expect(window.closeForagingReport).toBeDefined();
            expect(window.showForagingStats).toBeDefined();
            expect(window.exportForagingData).toBeDefined();
            expect(window.downloadJSON).toBeDefined();
            expect(window.downloadCSV).toBeDefined();
        });

        test('should handle missing elements gracefully', () => {
            expect(() => initInteractions()).not.toThrow();
        });
    });

    describe('Modal Creation', () => {
        test('should create foraging report modal with correct structure', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            expect(modal.className).toContain('modal');
            expect(modal.getAttribute('role')).toBe('dialog');
            expect(modal.querySelector('.modal-overlay')).toBeTruthy();
            expect(modal.querySelector('.modal-content')).toBeTruthy();
        });

        test('should create stats modal with correct structure', () => {
            showForagingStats('coos', 'morels');

            const modal = document.getElementById('stats-modal');
            expect(modal.className).toContain('modal');
            expect(modal.querySelector('.modal-overlay')).toBeTruthy();
            expect(modal.querySelector('#stats-content')).toBeTruthy();
        });

        test('should create export modal with correct structure', () => {
            exportForagingData();

            const modal = document.getElementById('export-modal');
            expect(modal.className).toContain('modal');
            expect(modal.querySelector('.modal-overlay')).toBeTruthy();
            expect(modal.querySelector('#export-stats')).toBeTruthy();
        });
    });

    describe('Form Validation', () => {
        test('should mark required fields in foraging report', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const form = modal.querySelector('#foraging-report-form');

            const countyField = form.querySelector('[name="county"]');
            const speciesField = form.querySelector('[name="species"]');
            const dateField = form.querySelector('[name="date"]');

            expect(countyField.hasAttribute('required')).toBe(true);
            expect(speciesField.hasAttribute('required')).toBe(true);
            expect(dateField.hasAttribute('required')).toBe(true);
        });

        test('should have readonly predicted probability field', () => {
            openForagingReport('coos', 'morels', 0.75);

            const modal = document.getElementById('foraging-report-modal');
            const form = modal.querySelector('#foraging-report-form');
            const probField = form.querySelector('[name="predicted_probability"]');

            expect(probField.hasAttribute('readonly')).toBe(true);
        });
    });

    describe('Accessibility', () => {
        test('should set aria-hidden on foraging modal', () => {
            openForagingReport('coos', 'morels', 0.75);
            const modal = document.getElementById('foraging-report-modal');

            expect(modal.getAttribute('aria-hidden')).toBe('false');

            closeForagingReport();

            expect(modal.getAttribute('aria-hidden')).toBe('true');
        });

        test('should have aria-labelledby on foraging modal', () => {
            openForagingReport('coos', 'morels', 0.75);
            const modal = document.getElementById('foraging-report-modal');

            expect(modal.getAttribute('aria-labelledby')).toBe('report-modal-title');
        });

        test('should have close button with aria-label', () => {
            openForagingReport('coos', 'morels', 0.75);
            const modal = document.getElementById('foraging-report-modal');
            const closeBtn = modal.querySelector('.close-btn');

            expect(closeBtn.getAttribute('aria-label')).toBe('Close report form');
        });
    });

    describe('Data Analytics Integration', () => {
        test('should include analytics action buttons in county info', () => {
            const speciesSelect = document.createElement('select');
            speciesSelect.id = 'species-select';
            speciesSelect.value = 'morels';
            document.body.appendChild(speciesSelect);

            const speciesInfo = document.createElement('div');
            speciesInfo.id = 'species-info';
            document.body.appendChild(speciesInfo);

            displayCountyInfo('Coos County', 'coos');

            const countyPanel = document.getElementById('county-info');
            expect(countyPanel.innerHTML).toContain('showForagingStats');
            expect(countyPanel.innerHTML).toContain('validateWithiNaturalist');
            expect(countyPanel.innerHTML).toContain('exportForagingData');
        });
    });
});
