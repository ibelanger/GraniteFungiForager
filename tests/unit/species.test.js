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
});
