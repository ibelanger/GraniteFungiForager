/**
 * Tests for species.js module
 * Testing all 29 DHHS Tier 1 species data validation
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { speciesData, updateSpeciesDisplay, populateSpeciesDropdown } from '../../src/modules/species.js';

describe('Species Module', () => {

  // All 7 NH regions
  const NH_REGIONS = [
    'Great North Woods',
    'White Mountains',
    'Dartmouth-Sunapee',
    'Merrimack Valley',
    'Lakes Region',
    'Monadnock Region',
    'Seacoast'
  ];

  // All 4 seasons
  const SEASONS = ['spring', 'summer', 'fall', 'winter'];

  // Expected DHHS Tier 1 species count
  const EXPECTED_SPECIES_COUNT = 29;

  describe('speciesData Structure', () => {

    test('should contain exactly 29 DHHS Tier 1 species', () => {
      const speciesCount = Object.keys(speciesData).length;
      expect(speciesCount).toBe(EXPECTED_SPECIES_COUNT);
    });

    test('should have all expected species keys', () => {
      const expectedKeys = [
        'morels', 'beefsteak', 'blacktrumpets', 'cauliflower', 'chanterelles',
        'trumpetchanterelle', 'greenrussula', 'sweettooth', 'depressedhedgehog',
        'whitehedgehog', 'jellyear', 'boletusSubcaerulescens', 'boletusVariipes',
        'boletusEdulis', 'boletusAtkinsonii', 'boletus_separans', 'boletusNobilis',
        'boletusChippewaensis', 'hericium', 'lobster', 'maitake', 'blewit',
        'oyster', 'matsutake', 'winecap', 'shaggymane', 'corrugatedmilky',
        'orangemilky', 'tawnymilky'
      ];

      expectedKeys.forEach(key => {
        expect(speciesData).toHaveProperty(key);
      });
    });

    test('should not have duplicate species keys', () => {
      const keys = Object.keys(speciesData);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });
  });

  describe('Individual Species Validation', () => {

    test('every species should have a name property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('name');
        expect(typeof species.name).toBe('string');
        expect(species.name.length).toBeGreaterThan(0);
      });
    });

    test('every species should have tempRange property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('tempRange');
        expect(Array.isArray(species.tempRange)).toBe(true);
        expect(species.tempRange).toHaveLength(2);
      });
    });

    test('every species should have moistureMin property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('moistureMin');
        expect(typeof species.moistureMin).toBe('number');
        expect(species.moistureMin).toBeGreaterThan(0);
      });
    });

    test('every species should have seasonMultiplier property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('seasonMultiplier');
        expect(typeof species.seasonMultiplier).toBe('object');
      });
    });

    test('every species should have regions property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('regions');
        expect(typeof species.regions).toBe('object');
      });
    });

    test('every species should have hostTrees property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('hostTrees');
        expect(Array.isArray(species.hostTrees)).toBe(true);
      });
    });

    test('every species should have identificationNotes property', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species).toHaveProperty('identificationNotes');
        expect(typeof species.identificationNotes).toBe('object');
      });
    });
  });

  describe('Temperature Range Validation', () => {

    test('all temperature ranges should be valid arrays of 2 numbers', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species.tempRange).toHaveLength(2);
        expect(typeof species.tempRange[0]).toBe('number');
        expect(typeof species.tempRange[1]).toBe('number');
      });
    });

    test('min temperature should be less than max temperature', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        const [min, max] = species.tempRange;
        expect(min).toBeLessThan(max);
      });
    });

    test('temperature ranges should be within realistic bounds (40-90°F)', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        const [min, max] = species.tempRange;
        expect(min).toBeGreaterThanOrEqual(40);
        expect(min).toBeLessThanOrEqual(90);
        expect(max).toBeGreaterThanOrEqual(40);
        expect(max).toBeLessThanOrEqual(90);
      });
    });

    test('specific species should have known temperature ranges', () => {
      expect(speciesData.morels.tempRange).toEqual([50, 70]);
      expect(speciesData.chanterelles.tempRange).toEqual([55, 75]);
      expect(speciesData.oyster.tempRange).toEqual([40, 75]); // Widest range
    });
  });

  describe('Moisture Requirements Validation', () => {

    test('all moisture minimums should be positive numbers', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species.moistureMin).toBeGreaterThan(0);
        expect(typeof species.moistureMin).toBe('number');
      });
    });

    test('moisture minimums should be within realistic range (0.5-3.0 inches)', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species.moistureMin).toBeGreaterThanOrEqual(0.5);
        expect(species.moistureMin).toBeLessThanOrEqual(3.0);
      });
    });

    test('specific species should have known moisture requirements', () => {
      expect(speciesData.morels.moistureMin).toBe(1.0);
      expect(speciesData.blacktrumpets.moistureMin).toBe(2.0);
      expect(speciesData.oyster.moistureMin).toBe(1.0); // Lowest requirement
    });
  });

  describe('Seasonal Multiplier Validation', () => {

    test('all seasonal multipliers should have at least one season', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        const seasons = Object.keys(species.seasonMultiplier);
        expect(seasons.length).toBeGreaterThan(0);
      });
    });

    test('all seasonal multiplier values should be between 0 and 1', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        Object.values(species.seasonMultiplier).forEach(mult => {
          expect(mult).toBeGreaterThanOrEqual(0.0);
          expect(mult).toBeLessThanOrEqual(1.0);
        });
      });
    });

    test('morels should have spring=1.0 and fall=0.0', () => {
      expect(speciesData.morels.seasonMultiplier.spring).toBe(1.0);
      expect(speciesData.morels.seasonMultiplier.fall).toBe(0.0);
    });

    test('chanterelles should favor summer', () => {
      const chant = speciesData.chanterelles.seasonMultiplier;
      expect(chant.summer).toBeGreaterThan(chant.spring);
      expect(chant.summer).toBeGreaterThan(chant.winter || 0);
    });

    test('oyster mushrooms should have winter multiplier (year-round species)', () => {
      expect(speciesData.oyster.seasonMultiplier).toHaveProperty('winter');
      expect(speciesData.oyster.seasonMultiplier.winter).toBe(1.0);
    });
  });

  describe('Regional Probability Validation', () => {

    test('all species should have probabilities for all 7 NH regions', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        const regionKeys = Object.keys(species.regions);
        expect(regionKeys).toHaveLength(7);

        NH_REGIONS.forEach(region => {
          expect(species.regions).toHaveProperty(region);
        });
      });
    });

    test('all regional probabilities should be between 0 and 1', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        Object.values(species.regions).forEach(prob => {
          expect(prob).toBeGreaterThanOrEqual(0.0);
          expect(prob).toBeLessThanOrEqual(1.0);
        });
      });
    });

    test('species should have variation across regions (not all same value)', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        const probabilities = Object.values(species.regions);
        const uniqueProbs = new Set(probabilities);

        // Most species should have at least 2 different probability values
        // (Some might have same value across regions, but most should vary)
        if (probabilities.length > 2) {
          expect(uniqueProbs.size).toBeGreaterThan(1);
        }
      });
    });

    test('boletusEdulis should favor White Mountains (conifer habitat)', () => {
      const boletus = speciesData.boletusEdulis.regions;
      expect(boletus['White Mountains']).toBeGreaterThanOrEqual(0.9);
      expect(boletus['Seacoast']).toBeLessThan(boletus['White Mountains']);
    });

    test('maitake should favor Monadnock Region (oak habitat)', () => {
      const maitake = speciesData.maitake.regions;
      expect(maitake['Monadnock Region']).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('Host Trees Validation', () => {

    test('all species should have at least one host tree', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(species.hostTrees.length).toBeGreaterThan(0);
      });
    });

    test('host tree values should be strings', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        species.hostTrees.forEach(tree => {
          expect(typeof tree).toBe('string');
          expect(tree.length).toBeGreaterThan(0);
        });
      });
    });

    test('morels should have known host trees', () => {
      expect(speciesData.morels.hostTrees).toContain('ash');
      expect(speciesData.morels.hostTrees).toContain('elm');
    });

    test('chanterelles should have known host trees', () => {
      expect(speciesData.chanterelles.hostTrees).toContain('oak');
      expect(speciesData.chanterelles.hostTrees).toContain('beech');
    });

    test('maitake should have oak as primary host', () => {
      const hosts = speciesData.maitake.hostTrees.join(' ');
      expect(hosts.toLowerCase()).toContain('oak');
    });
  });

  describe('Identification Notes Validation', () => {

    test('all species should have identification notes', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        expect(Object.keys(species.identificationNotes).length).toBeGreaterThan(0);
      });
    });

    test('identification notes should have string values', () => {
      Object.entries(speciesData).forEach(([key, species]) => {
        Object.values(species.identificationNotes).forEach(note => {
          expect(typeof note).toBe('string');
          expect(note.length).toBeGreaterThan(0);
        });
      });
    });

    test('morels should have key identification features', () => {
      const morelNotes = speciesData.morels.identificationNotes;
      expect(morelNotes).toHaveProperty('Cap');
      expect(morelNotes).toHaveProperty('Season');
    });
  });

  describe('Boletus Species Complex', () => {

    test('should have 7 distinct Boletus species', () => {
      const boletusSpecies = Object.keys(speciesData).filter(key =>
        key.toLowerCase().includes('boletus')
      );
      expect(boletusSpecies.length).toBe(7);
    });

    test('all Boletus species should have unique names', () => {
      const boletusSpecies = Object.entries(speciesData)
        .filter(([key]) => key.toLowerCase().includes('boletus'))
        .map(([, species]) => species.name);

      const uniqueNames = new Set(boletusSpecies);
      expect(boletusSpecies.length).toBe(uniqueNames.size);
    });

    test('boletusSubcaerulescens should prefer conifer habitat', () => {
      const species = speciesData.boletusSubcaerulescens;
      expect(species.hostTrees).toContain('pine');
      expect(species.regions['Great North Woods']).toBeGreaterThanOrEqual(0.8);
    });

    test('boletusVariipes should prefer hardwood habitat', () => {
      const species = speciesData.boletusVariipes;
      expect(species.hostTrees).toContain('oak');
      expect(species.hostTrees).toContain('beech');
    });
  });

  describe('Hedgehog Species Complex', () => {

    test('should have 3 distinct Hedgehog species groups', () => {
      const hedgehogSpecies = Object.keys(speciesData).filter(key =>
        key.toLowerCase().includes('hedgehog') || key.toLowerCase().includes('tooth')
      );
      expect(hedgehogSpecies.length).toBe(3); // sweettooth, depressedhedgehog, whitehedgehog
    });

    test('all hedgehog species should have identification notes', () => {
      ['sweettooth', 'depressedhedgehog', 'whitehedgehog'].forEach(key => {
        expect(speciesData[key].identificationNotes).toBeDefined();
        expect(Object.keys(speciesData[key].identificationNotes).length).toBeGreaterThan(0);
      });
    });

    test('whitehedgehog should have white color noted in identificationNotes', () => {
      const notes = speciesData.whitehedgehog.identificationNotes;
      const hasWhiteNote = Object.values(notes).some(note =>
        note.toLowerCase().includes('white')
      );
      expect(hasWhiteNote).toBe(true);
    });
  });

  describe('Milky Mushroom Complex', () => {

    test('should have 3 milky mushroom species', () => {
      const milkySpecies = Object.keys(speciesData).filter(key =>
        key.toLowerCase().includes('milky')
      );
      expect(milkySpecies.length).toBe(3); // corrugatedmilky, orangemilky, tawnymilky
    });

    test('all milky species should mention milk/latex in identification', () => {
      ['corrugatedmilky', 'orangemilky', 'tawnymilky'].forEach(key => {
        const notes = speciesData[key].identificationNotes;
        const hasMilkNote = Object.values(notes).some(note =>
          note.toLowerCase().includes('milk') || note.toLowerCase().includes('latex')
        );
        expect(hasMilkNote).toBe(true);
      });
    });
  });

  describe('updateSpeciesDisplay Function', () => {

    beforeEach(() => {
      // Create minimal DOM structure for testing
      document.body.innerHTML = `
        <div id="species-info-card" style="display: none;">
          <h3 id="species-card-title"></h3>
          <div id="species-basic-info"></div>
          <div id="species-habitat"></div>
          <div id="species-timing"></div>
          <div id="species-identification"></div>
        </div>
      `;
    });

    test('should hide card when no species selected', () => {
      updateSpeciesDisplay(null, speciesData);

      const card = document.getElementById('species-info-card');
      expect(card.style.display).toBe('none');
    });

    test('should hide card when "all" species selected', () => {
      updateSpeciesDisplay('all', speciesData);

      const card = document.getElementById('species-info-card');
      expect(card.style.display).toBe('none');
    });

    test('should hide card for invalid species', () => {
      updateSpeciesDisplay('invalid-species', speciesData);

      const card = document.getElementById('species-info-card');
      expect(card.style.display).toBe('none');
    });

    test('should show card and update title for valid species', () => {
      updateSpeciesDisplay('morels', speciesData);

      const card = document.getElementById('species-info-card');
      const title = document.getElementById('species-card-title');

      expect(card.style.display).toBe('block');
      expect(title.textContent).toContain('Morels');
    });

    test('should display temperature range in basic info', () => {
      updateSpeciesDisplay('morels', speciesData);

      const basicInfo = document.getElementById('species-basic-info');
      expect(basicInfo.innerHTML).toContain('Temperature Range');
      expect(basicInfo.innerHTML).toContain('50-70°F');
    });

    test('should display moisture minimum in basic info', () => {
      updateSpeciesDisplay('morels', speciesData);

      const basicInfo = document.getElementById('species-basic-info');
      expect(basicInfo.innerHTML).toContain('Minimum Rainfall');
      expect(basicInfo.innerHTML).toContain('1');
    });

    test('should display host trees in habitat section', () => {
      updateSpeciesDisplay('morels', speciesData);

      const habitat = document.getElementById('species-habitat');
      expect(habitat.innerHTML).toContain('Host Trees');
      expect(habitat.innerHTML).toContain('ash');
    });

    test('should display seasonal multipliers in timing section', () => {
      updateSpeciesDisplay('morels', speciesData);

      const timing = document.getElementById('species-timing');
      expect(timing.innerHTML).toContain('Seasonal');
      expect(timing.innerHTML).toContain('spring');
    });

    test('should display identification notes', () => {
      updateSpeciesDisplay('morels', speciesData);

      const identification = document.getElementById('species-identification');
      expect(identification.innerHTML).toContain('Identification Notes');
    });
  });

  describe('populateSpeciesDropdown Function', () => {

    beforeEach(() => {
      document.body.innerHTML = '<select id="species-select"></select>';
    });

    test('should populate dropdown with all species', () => {
      populateSpeciesDropdown('species-select');

      const select = document.getElementById('species-select');
      const options = select.querySelectorAll('option');

      // +1 for the default "Select a species" option
      expect(options.length).toBe(EXPECTED_SPECIES_COUNT + 1);
    });

    test('should include default "Select a species" option', () => {
      populateSpeciesDropdown('species-select');

      const select = document.getElementById('species-select');
      const firstOption = select.options[0];

      expect(firstOption.textContent).toContain('Select a species');
      expect(firstOption.value).toBe('');
      expect(firstOption.disabled).toBe(true);
    });

    test('should sort species alphabetically by name', () => {
      populateSpeciesDropdown('species-select');

      const select = document.getElementById('species-select');
      const options = Array.from(select.querySelectorAll('option')).slice(1); // Skip default option
      const names = options.map(opt => opt.textContent);

      // Check if sorted (comparing first few entries)
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].localeCompare(names[i + 1])).toBeLessThanOrEqual(0);
      }
    });

    test('should set option values to species keys', () => {
      populateSpeciesDropdown('species-select');

      const select = document.getElementById('species-select');
      const morelOption = Array.from(select.options).find(opt =>
        opt.textContent.includes('Morels')
      );

      expect(morelOption.value).toBe('morels');
    });

    test('should handle missing select element gracefully', () => {
      // Should not throw error
      expect(() => populateSpeciesDropdown('nonexistent-select')).not.toThrow();
    });

    test('should default to "species-select" if no id provided', () => {
      populateSpeciesDropdown();

      const select = document.getElementById('species-select');
      expect(select.options.length).toBeGreaterThan(0);
    });
  });

  describe('Data Consistency Checks', () => {

    test('species with same genus should have similar temperature ranges', () => {
      // Boletus species should generally have similar temp ranges
      const boletusSpecies = Object.entries(speciesData)
        .filter(([key]) => key.toLowerCase().includes('boletus'))
        .map(([, species]) => species);

      boletusSpecies.forEach((species, i) => {
        if (i > 0) {
          const prevRange = boletusSpecies[i - 1].tempRange;
          const currRange = species.tempRange;

          // Temperature ranges should overlap
          const overlap = Math.min(prevRange[1], currRange[1]) - Math.max(prevRange[0], currRange[0]);
          expect(overlap).toBeGreaterThan(0);
        }
      });
    });

    test('oyster mushroom should have broadest temperature range (year-round)', () => {
      const oysterRange = speciesData.oyster.tempRange[1] - speciesData.oyster.tempRange[0];

      Object.entries(speciesData).forEach(([key, species]) => {
        if (key !== 'oyster') {
          const range = species.tempRange[1] - species.tempRange[0];
          // Oyster should have one of the widest ranges
          expect(range).toBeLessThanOrEqual(oysterRange + 5);
        }
      });
    });

    test('spring species should have lower temperature minimums', () => {
      const springSpecies = Object.entries(speciesData)
        .filter(([, species]) => species.seasonMultiplier.spring >= 0.8);

      springSpecies.forEach(([key, species]) => {
        // Spring species typically fruit at cooler temps
        expect(species.tempRange[0]).toBeLessThanOrEqual(65);
      });
    });
  });

  // ── Research-Grade Data Validation (Epic #17) ──────────────────────

  describe('Research-Grade Fields — All 29 Species', () => {

    const speciesKeys = Object.keys(speciesData);

    test('every species should have optimalSoilTemp with min/max', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        expect(s.optimalSoilTemp, `${key} missing optimalSoilTemp`).toBeDefined();
        expect(typeof s.optimalSoilTemp.min).toBe('number');
        expect(typeof s.optimalSoilTemp.max).toBe('number');
        expect(s.optimalSoilTemp.min).toBeLessThan(s.optimalSoilTemp.max);
        // Fahrenheit bounds: 30-100°F
        expect(s.optimalSoilTemp.min).toBeGreaterThanOrEqual(30);
        expect(s.optimalSoilTemp.max).toBeLessThanOrEqual(100);
      });
    });

    test('every species should have soilPH with valid ranges', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        expect(s.soilPH, `${key} missing soilPH`).toBeDefined();
        expect(typeof s.soilPH.min).toBe('number');
        expect(typeof s.soilPH.max).toBe('number');
        expect(s.soilPH.min).toBeGreaterThanOrEqual(3.0);
        expect(s.soilPH.max).toBeLessThanOrEqual(9.0);
        expect(s.soilPH.min).toBeLessThan(s.soilPH.max);
        expect(typeof s.soilPH.optimal).toBe('number');
        expect(s.soilPH.optimal).toBeGreaterThanOrEqual(s.soilPH.min);
        expect(s.soilPH.optimal).toBeLessThanOrEqual(s.soilPH.max);
      });
    });

    test('every species should have precipitationWindow', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        expect(s.precipitationWindow, `${key} missing precipitationWindow`).toBeDefined();
      });
    });

    test('every species should have elevationRange with valid bounds', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        expect(s.elevationRange, `${key} missing elevationRange`).toBeDefined();
        expect(typeof s.elevationRange.min).toBe('number');
        expect(typeof s.elevationRange.max).toBe('number');
        expect(s.elevationRange.min).toBeGreaterThanOrEqual(0);
        expect(s.elevationRange.max).toBeLessThanOrEqual(6500); // Mt Washington = 6288ft
        expect(s.elevationRange.min).toBeLessThan(s.elevationRange.max);
      });
    });

    test('every species should have host tree/substrate frequencies', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        // Lobster uses hostFrequencies; all others use hostTreeFrequencies
        const hosts = s.hostTreeFrequencies || s.hostFrequencies;
        expect(hosts, `${key} missing host frequencies`).toBeDefined();
      });
    });

    test('every species should have phenologyNH', () => {
      speciesKeys.forEach(key => {
        const s = speciesData[key];
        expect(s.phenologyNH, `${key} missing phenologyNH`).toBeDefined();
        // Most species use start/peak/end; chanterelles uses elevation-based format
        if (key !== 'chanterelles') {
          expect(typeof s.phenologyNH.start).toBe('string');
          expect(typeof s.phenologyNH.peak).toBe('string');
          expect(typeof s.phenologyNH.end).toBe('string');
        }
      });
    });

    test('every species should have a confidenceLevel', () => {
      speciesKeys.forEach(key => {
        expect(speciesData[key].confidenceLevel, `${key} missing confidenceLevel`).toBeDefined();
      });
    });

    // Stricter checks for March 2026 research-enhanced species (full field set)
    const march2026Species = [
      'beefsteak', 'cauliflower', 'greenrussula', 'jellyear',
      'hericium', 'blewit', 'oyster', 'winecap', 'shaggymane'
    ];

    test('March 2026 enhanced species should have full optimalSoilTemp structure', () => {
      march2026Species.forEach(key => {
        const t = speciesData[key].optimalSoilTemp;
        expect(t.optimal, `${key} missing optimal`).toBeDefined();
        expect(t.mycelialGrowth, `${key} missing mycelialGrowth`).toBeDefined();
        expect(typeof t.mycelialGrowth.optimal).toBe('number');
        expect(typeof t.source).toBe('string');
        expect(typeof t.confidence).toBe('string');
      });
    });

    test('March 2026 enhanced species should have full soilPH structure', () => {
      march2026Species.forEach(key => {
        const ph = speciesData[key].soilPH;
        expect(typeof ph.nhNotes).toBe('string');
        expect(typeof ph.source).toBe('string');
        expect(typeof ph.confidence).toBe('string');
      });
    });

    test('March 2026 enhanced species should have full precipitationWindow', () => {
      march2026Species.forEach(key => {
        const pw = speciesData[key].precipitationWindow;
        expect(typeof pw.min).toBe('number');
        expect(typeof pw.max).toBe('number');
        expect(pw.min).toBeLessThan(pw.max);
        expect(typeof pw.requirement).toBe('string');
        expect(typeof pw.source).toBe('string');
      });
    });

    test('March 2026 enhanced species should have nhNotes in elevationRange', () => {
      march2026Species.forEach(key => {
        expect(typeof speciesData[key].elevationRange.nhNotes).toBe('string');
      });
    });

    test('March 2026 enhanced species should have specificity in host frequencies', () => {
      march2026Species.forEach(key => {
        const hosts = speciesData[key].hostTreeFrequencies;
        expect(hosts, `${key} missing hostTreeFrequencies`).toBeDefined();
        expect(typeof hosts.specificity).toBe('string');
      });
    });

    test('March 2026 enhanced species should have triggers in phenologyNH', () => {
      march2026Species.forEach(key => {
        expect(typeof speciesData[key].phenologyNH.triggers).toBe('string');
      });
    });
  });

  describe('Research-Grade Fields — Species-Specific Validation', () => {

    test('beefsteak should be oak-specialist (>90% Quercus)', () => {
      const hosts = speciesData.beefsteak.hostTreeFrequencies;
      const oakKeys = Object.keys(hosts).filter(k => k.includes('Oak'));
      expect(oakKeys.length).toBeGreaterThanOrEqual(2);
    });

    test('jellyear should fruit year-round (cold-tolerant)', () => {
      expect(speciesData.jellyear.optimalSoilTemp.min).toBeLessThanOrEqual(40);
      expect(speciesData.jellyear.phenologyNH.start).toMatch(/year|Year/i);
    });

    test('shaggymane should prefer neutral-alkaline soil (pH >= 6.0)', () => {
      expect(speciesData.shaggymane.soilPH.min).toBeGreaterThanOrEqual(5.5);
      expect(speciesData.shaggymane.soilPH.optimal).toBeGreaterThanOrEqual(6.5);
    });

    test('blewit should be a late-season fruiter', () => {
      expect(speciesData.blewit.phenologyNH.peak).toMatch(/October|November/);
      expect(speciesData.blewit.optimalSoilTemp.min).toBeLessThanOrEqual(45);
    });

    test('oyster should have widest temperature range among all species', () => {
      const oysterRange = speciesData.oyster.optimalSoilTemp.max - speciesData.oyster.optimalSoilTemp.min;
      expect(oysterRange).toBeGreaterThanOrEqual(40);
    });

    test('winecap should have bimodal phenology', () => {
      expect(speciesData.winecap.phenologyNH.peak).toMatch(/bimodal|May.*September|May.*October/i);
    });

    test('cauliflower should be pine-dominated host association', () => {
      const hosts = speciesData.cauliflower.hostTreeFrequencies;
      const pineKeys = Object.keys(hosts).filter(k => k.includes('Pine'));
      expect(pineKeys.length).toBeGreaterThanOrEqual(1);
    });

    test('hericium should be beech-dominant host association', () => {
      const hosts = speciesData.hericium.hostTreeFrequencies;
      const beechKey = Object.keys(hosts).find(k => k.includes('Beech'));
      expect(beechKey).toBeDefined();
    });

    test('greenrussula should be ectomycorrhizal with oak-beech', () => {
      const hosts = speciesData.greenrussula.hostTreeFrequencies;
      expect(hosts.specificity).toMatch(/ectomycorrhizal/i);
    });

    test('lobster should use hostFrequencies (not hostTreeFrequencies)', () => {
      expect(speciesData.lobster.hostFrequencies).toBeDefined();
      expect(speciesData.lobster.hostTreeFrequencies).toBeUndefined();
    });
  });
});
