---
name: interactions-module
description: UI interactions module - county click handlers, species selection, modal system, foraging reports UI, top 5 species rankings, and accessibility features for GraniteFungiForager
triggers:
  - interactions
  - UI
  - modal
  - county click
  - species selection
  - user interface
  - event handlers
  - accessibility
  - rankings
  - foraging reports UI
  - county details
---

# Interactions Module Guide

## Overview

**File:** `src/modules/interactions.js` (1,200+ lines)
**Tests:** 67 tests in `tests/unit/interactions.test.js`

The interactions module is the largest and most complex UI component in GraniteFungiForager. It handles all user interactions with the map, species selection, modal dialogs, foraging reports submission, and accessibility features.

**Key Responsibilities:**
- 🗺️ County click handlers with detailed recommendations
- 🍄 Species selection and real-time map updates
- 📊 Top 5 species rankings with visual probability indicators
- 📝 Foraging reports submission interface
- 🔐 Authentication-aware GPS coordinate display
- ♿ WCAG AAA accessibility compliance
- 📱 Mobile-responsive touch interactions
- 🎨 Auto-collapsing species cards for mobile devices

---

## Module Architecture

### Initialization Flow

```javascript
// app.js imports and initializes
import { initInteractions, initEnhancedMapInteractions } from './src/modules/interactions.js';

// During app initialization (app.js:85-90)
initInteractions();                    // Basic UI interactions
initEnhancedMapInteractions();        // County click handlers
```

### Main Initialization Functions

#### 1. `initInteractions()` - Basic UI Setup

**What It Does:**
- Species selector dropdown change handler
- Map update triggers
- Initial species card display
- Species info card event listeners

```javascript
export function initInteractions() {
  const speciesSelect = document.getElementById('species-select');

  if (speciesSelect) {
    speciesSelect.addEventListener('change', (event) => {
      const selectedSpecies = event.target.value;

      // Update map colors
      updateMapForSpecies(selectedSpecies);

      // Update species information card
      displaySpeciesInfo(selectedSpecies);
    });

    // Initialize with default species (chanterelles)
    updateMapForSpecies('chanterelles');
    displaySpeciesInfo('chanterelles');
  }
}
```

#### 2. `initEnhancedMapInteractions()` - County Handlers

**What It Does:**
- Adds click handlers to all 10 NH county map elements
- Opens modal with county-specific recommendations
- Displays top 5 species rankings
- Shows public lands information (authentication-protected)

```javascript
export function initEnhancedMapInteractions() {
  const counties = [
    'coos', 'grafton', 'carroll', 'belknap', 'sullivan',
    'merrimack', 'strafford', 'cheshire', 'hillsborough', 'rockingham'
  ];

  counties.forEach((county) => {
    const countyElement = document.getElementById(`county-${county}`);

    if (countyElement) {
      countyElement.addEventListener('click', () => {
        showCountyDetails(county);
      });

      // Add hover effect
      countyElement.style.cursor = 'pointer';
    }
  });
}
```

---

## Species Selection System

### Species Selector Dropdown

**HTML Element:** `<select id="species-select">` in `index.html`

**Available Species (29 total):**
- Chanterelles (Cantharellus cibarius complex)
- Morels (Morchella spp.)
- Chicken of the Woods (Laetiporus sulphureus)
- Maitake (Grifola frondosa)
- Lion's Mane (Hericium erinaceus)
- Oyster Mushroom (Pleurotus ostreatus)
- King Bolete (Boletus edulis complex - 7 subspecies)
- Black Trumpet (Craterellus fallax)
- Hedgehog (Hydnum spp. - 3 subgenera)
- ... and 20 more DHHS Tier 1 species

### Species Display Workflow

```javascript
function displaySpeciesInfo(speciesId) {
  const species = getSpeciesData(speciesId);
  const card = document.getElementById('species-card');

  if (!species || !card) return;

  card.innerHTML = generateSpeciesCardHTML(species);
  card.style.display = 'block';

  // Mobile auto-collapse (v3.5.1)
  if (window.innerHeight < 768) {
    const details = card.querySelector('details');
    if (details) {
      details.open = false; // Collapse on mobile
    }
  }
}
```

### Species Card HTML Structure (v3.5.1 Compact Layout)

**Height:** ~300px (down from ~680px pre-v3.5.1)

**Key Features:**
- 2-column chip layout for temperature and moisture
- Inline host tree tags
- Color-coded seasonal badges
- Collapsible advanced details (`<details>` element)
- WCAG AAA contrast compliance

```html
<div class="species-card">
  <h3>🍄 Chanterelles</h3>
  <p class="scientific-name">Cantharellus cibarius complex</p>

  <!-- 2-Column Compact Grid -->
  <div class="conditions-grid">
    <div class="condition-chip">
      <span class="chip-label">🌡️ Soil Temp</span>
      <span class="chip-value">55-65°F</span>
    </div>
    <div class="condition-chip">
      <span class="chip-label">💧 Moisture</span>
      <span class="chip-value">High</span>
    </div>
  </div>

  <!-- Host Trees as Inline Tags -->
  <div class="host-trees">
    <strong>Host Trees:</strong>
    <span class="tree-tag">🌲 Hemlock</span>
    <span class="tree-tag">🌲 Oak</span>
    <span class="tree-tag">🌲 Birch</span>
  </div>

  <!-- Seasonal Timing with Color Badges -->
  <div class="seasonal-timing">
    <span class="season-badge season-spring">Spring: Low</span>
    <span class="season-badge season-summer">Summer: Peak</span>
    <span class="season-badge season-fall">Fall: Good</span>
    <span class="season-badge season-winter">Winter: None</span>
  </div>

  <!-- Collapsible Advanced Details -->
  <details>
    <summary>🔍 Advanced Details</summary>
    <div class="advanced-content">
      <p><strong>Elevation:</strong> 500-2500 ft</p>
      <p><strong>ID Notes:</strong> Golden-yellow, false gills, apricot smell</p>
      <p><strong>Habitat:</strong> Mixed hardwood/conifer forests</p>
    </div>
  </details>
</div>
```

### Auto-Collapse on Mobile (v3.5.1)

**Feature:** When clicking a county on mobile (viewport height < 768px), species card automatically collapses to header-only view.

**Benefits:**
- Both species name AND county probability visible simultaneously
- No more forced scrolling that hides species ID information
- Sticky positioning keeps card accessible while scrolling

**Implementation:**
```javascript
function showCountyDetails(countyName) {
  // ... modal display code ...

  // Auto-collapse species card on mobile
  if (window.innerHeight < 768) {
    const speciesCard = document.getElementById('species-card');
    if (speciesCard) {
      const details = speciesCard.querySelector('details');
      if (details && details.open) {
        details.open = false; // Collapse to header only
      }
    }
  }
}
```

---

## County Details Modal System

### Modal Architecture

**Components:**
1. **Modal Container** - Overlay background
2. **County Details Card** - Main content
3. **Close Button** - Dismiss modal
4. **Top 5 Rankings** - Visual probability indicators
5. **Public Lands** - GPS coordinates (authentication-protected)

### Modal Trigger Flow

```javascript
function showCountyDetails(countyName) {
  // 1. Get county data
  const countyData = getCountyData(countyName);
  const currentSpecies = getCurrentSelectedSpecies();

  // 2. Calculate probabilities for all species
  const allProbabilities = calculateAllSpeciesProbabilities(countyName);

  // 3. Sort and get top 5
  const top5 = allProbabilities
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  // 4. Generate modal HTML
  const modalHTML = generateCountyModalHTML(
    countyName,
    countyData,
    currentSpecies,
    top5
  );

  // 5. Display modal
  const modal = document.getElementById('county-modal');
  modal.innerHTML = modalHTML;
  modal.style.display = 'block';

  // 6. Add close handlers
  addModalCloseHandlers(modal);

  // 7. Auto-collapse species card on mobile (v3.5.1)
  if (window.innerHeight < 768) {
    const speciesCard = document.getElementById('species-card');
    if (speciesCard) {
      const details = speciesCard.querySelector('details');
      if (details && details.open) {
        details.open = false;
      }
    }
  }
}
```

### Top 5 Species Rankings Display

**Visual Indicators:**
- 🥇 Gold badge (1st place, highest probability)
- 🥈 Silver badge (2nd place)
- 🥉 Bronze badge (3rd place)
- Color-coded probability percentages with strong shadows (WCAG AAA)

**Example Output:**
```
Top 5 Species for Grafton County:

🥇 Chanterelles         ███████████░░░░ 72.5%
🥈 Black Trumpets       ████████░░░░░░░ 58.3%
🥉 Morels              ██████░░░░░░░░░ 45.0%
   King Bolete          ████░░░░░░░░░░ 32.1%
   Maitake             ███░░░░░░░░░░░ 28.7%
```

**HTML Structure:**
```html
<div class="top-5-rankings">
  <h4>🏆 Top 5 Species Today</h4>

  <div class="ranking-item rank-1">
    <span class="rank-badge">🥇</span>
    <span class="species-name">Chanterelles</span>
    <div class="probability-bar">
      <div class="probability-fill" style="width: 72.5%"></div>
    </div>
    <span class="probability-value">72.5%</span>
  </div>

  <!-- Ranks 2-5 similar structure -->
</div>
```

### Public Lands Integration (Authentication-Protected)

**Feature:** GPS coordinates and trail names only shown if user is authenticated.

**Authentication Check:**
```javascript
import { authManager } from './authentication.js';

function generatePublicLandsHTML(countyName) {
  const locations = getPublicLandsData(countyName);

  if (authManager.isAuthenticated()) {
    // Show full GPS coordinates and trails
    return `
      <h4>📍 Public Foraging Locations</h4>
      <ul>
        <li>
          <strong>White Mountain National Forest</strong><br>
          GPS: 44.2706°N, 71.3033°W<br>
          Trail: Lincoln Woods Trail<br>
          Permit: None required for personal use
        </li>
      </ul>
    `;
  } else {
    // Show general information only
    return `
      <h4>📍 Public Foraging Locations</h4>
      <p>🔒 <a href="#" onclick="showAuthModal()">Log in</a> to view GPS coordinates and trail names.</p>
      <p>General info: White Mountain National Forest allows personal mushroom foraging.</p>
    `;
  }
}
```

---

## Foraging Reports UI

### Report Submission Interface

**Location:** County modal → "Submit Foraging Report" section

**Form Fields:**
- Species (dropdown)
- Success (radio buttons: Yes/No)
- Confidence (dropdown: Low/Medium/High)
- Notes (textarea)
- Submit button

**HTML Structure:**
```html
<div class="foraging-report-form">
  <h4>📝 Share Your Findings</h4>

  <label for="report-species">Species Found:</label>
  <select id="report-species">
    <option value="chanterelles">Chanterelles</option>
    <option value="morel">Morels</option>
    <!-- ... all 29 species ... -->
  </select>

  <label>Success:</label>
  <div class="radio-group">
    <label>
      <input type="radio" name="success" value="true" checked>
      Found mushrooms
    </label>
    <label>
      <input type="radio" name="success" value="false">
      No luck today
    </label>
  </div>

  <label for="report-confidence">Confidence Level:</label>
  <select id="report-confidence">
    <option value="high">High - Expert identification</option>
    <option value="medium">Medium - Fairly sure</option>
    <option value="low">Low - Need verification</option>
  </select>

  <label for="report-notes">Notes (optional):</label>
  <textarea id="report-notes" rows="3" placeholder="Habitat, conditions, observations..."></textarea>

  <button onclick="submitForagingReport()">Submit Report</button>
</div>
```

### Report Submission Handler

```javascript
import { reportsManager } from './foragingReports.js';
import { currentWeatherData } from './weather.js';

function submitForagingReport() {
  // 1. Collect form data
  const species = document.getElementById('report-species').value;
  const success = document.querySelector('input[name="success"]:checked').value === 'true';
  const confidence = document.getElementById('report-confidence').value;
  const notes = document.getElementById('report-notes').value;
  const county = getCurrentCounty(); // From modal context

  // 2. Get current weather data
  const weatherData = currentWeatherData.counties[county];

  // 3. Create report object
  const report = {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    species: species,
    county: county,
    success: success,
    confidence: confidence,
    weather: {
      temperature: weatherData.temperature,
      soilTemperature: weatherData.soilTemperature,
      precipitation24h: weatherData.precipitation24h,
      season: weatherData.season
    },
    notes: notes
  };

  // 4. Save via reportsManager
  try {
    reportsManager.addReport(report);

    // 5. Show success message
    showToast('✅ Report submitted successfully!', 'success');

    // 6. Clear form
    document.getElementById('report-notes').value = '';

    // 7. Update analytics (if online)
    if (navigator.onLine) {
      updateAnalytics(report);
    } else {
      // Queue for offline sync (service worker handles this)
      queueOfflineReport(report);
    }
  } catch (error) {
    showToast('❌ Failed to submit report', 'error');
    console.error('Report submission error:', error);
  }
}
```

---

## Accessibility Features (WCAG AAA)

### Keyboard Navigation

**Supported Actions:**
- `Tab` - Navigate through interactive elements
- `Enter` - Activate buttons, open modals
- `Escape` - Close modal dialogs
- `Arrow Keys` - Navigate species dropdown
- `Space` - Toggle radio buttons, checkboxes

**Implementation:**
```javascript
// Escape key closes modal (app.js:321-326)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('county-modal');
    if (modal && modal.style.display === 'block') {
      closeCountyModal();
    }
  }
});
```

### ARIA Labels and Roles

**County Map Elements:**
```html
<g id="county-grafton"
   role="button"
   tabindex="0"
   aria-label="Grafton County - Click for detailed foraging recommendations">
  <!-- SVG path -->
</g>
```

**Modal Dialogs:**
```html
<div id="county-modal"
     role="dialog"
     aria-labelledby="modal-title"
     aria-modal="true">
  <div class="county-details">
    <h2 id="modal-title">Grafton County Details</h2>
    <!-- Content -->
  </div>
</div>
```

**Form Inputs:**
```html
<label for="report-species">Species Found:</label>
<select id="report-species" aria-required="true">
  <option value="chanterelles">Chanterelles</option>
</select>
```

### Contrast Compliance (v3.5.0+)

**County Map Labels:**
- White text with drop-shadow and stroke outline
- Readable on all background colors (green, brown, orange, red)
- Minimum 7:1 contrast ratio

**Probability Display Banner:**
- Forced white text with text-shadow
- Ensures "King Bolete Probability: 5.2%" always readable
- Works on all colored backgrounds

**Species Rankings Badges:**
- Multi-layered shadow technique
- Maximum contrast on all probability percentages
- Examples: 22.0% yellow, 4.5% brown, 72.5% green

**CSS Implementation:**
```css
/* County map labels (src/styles.css) */
.county-label {
  fill: white;
  stroke: rgba(0, 0, 0, 0.8);
  stroke-width: 2px;
  paint-order: stroke;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
}

/* Probability badges */
.probability-value {
  color: white;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000,
     0    0   5px rgba(0, 0, 0, 0.9);
  font-weight: 700;
}
```

### Focus Indicators

**All Interactive Elements:**
```css
button:focus,
select:focus,
input:focus,
.county-element:focus {
  outline: 3px solid #2C7A3A; /* NH green */
  outline-offset: 2px;
}
```

### Screen Reader Support

**Hidden Text for Context:**
```html
<span class="sr-only">Current probability for Chanterelles in Grafton County:</span>
<span class="probability-value" aria-live="polite">72.5%</span>
```

**Live Region Updates:**
```javascript
// Update probability display with ARIA live region
function updateProbabilityDisplay(probability) {
  const display = document.getElementById('probability-display');
  display.setAttribute('aria-live', 'polite');
  display.textContent = `${probability.toFixed(1)}%`;
}
```

---

## Map Update System

### Color Coding Algorithm

**Probability Ranges:**
- 🟢 High (≥65%): `#27ae60` (green)
- 🟡 Good (45-64%): `#f39c12` (orange)
- 🟠 Medium (25-44%): `#d68910` (darker orange)
- 🔴 Low (<25%): `#922b21` (dark red)

**Implementation:**
```javascript
function updateMapForSpecies(speciesId) {
  const counties = [
    'coos', 'grafton', 'carroll', 'belknap', 'sullivan',
    'merrimack', 'strafford', 'cheshire', 'hillsborough', 'rockingham'
  ];

  counties.forEach((county) => {
    const probability = calculateProbability(speciesId, county);
    const color = getProbabilityColor(probability);
    const countyElement = document.getElementById(`county-${county}`);

    if (countyElement) {
      countyElement.style.fill = color;
      countyElement.setAttribute('data-probability', probability);
    }
  });
}

function getProbabilityColor(probability) {
  if (probability >= 65) return '#27ae60';      // High
  if (probability >= 45) return '#f39c12';      // Good
  if (probability >= 25) return '#d68910';      // Medium
  return '#922b21';                              // Low
}
```

### Smooth Transitions

**CSS Animations:**
```css
.county-element {
  transition: fill 0.3s ease-in-out;
}

.county-element:hover {
  opacity: 0.8;
  filter: brightness(1.1);
}
```

---

## Mobile Responsiveness

### Touch Interactions

**Tap Handling:**
```javascript
countyElement.addEventListener('touchstart', (event) => {
  event.preventDefault(); // Prevent double-tap zoom
  showCountyDetails(county);
});
```

### Viewport-Aware Features

**Sticky Species Card (Mobile):**
```css
@media (max-width: 768px) {
  .species-card {
    position: sticky;
    top: 0;
    z-index: 100;
    max-height: 60px; /* When collapsed */
    overflow: hidden;
  }

  .species-card details[open] {
    max-height: 400px; /* When expanded */
  }
}
```

**Modal Adjustments:**
```css
@media (max-width: 768px) {
  .county-details {
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    margin: 1rem auto;
  }
}
```

---

## Testing

### Test Coverage

**File:** `tests/unit/interactions.test.js` (67 tests)

**Test Categories:**
1. Species selection (12 tests)
2. Map updates (15 tests)
3. Modal system (18 tests)
4. Top 5 rankings (10 tests)
5. Accessibility (12 tests)

**Example Tests:**
```javascript
describe('Species Selection', () => {
  test('should update map when species changed', () => {
    const select = document.getElementById('species-select');
    select.value = 'morel';
    select.dispatchEvent(new Event('change'));

    const grafton = document.getElementById('county-grafton');
    expect(grafton.style.fill).toBeTruthy();
  });

  test('should display species info card', () => {
    displaySpeciesInfo('chanterelles');
    const card = document.getElementById('species-card');
    expect(card.style.display).toBe('block');
    expect(card.innerHTML).toContain('Chanterelles');
  });
});

describe('Modal System', () => {
  test('should open county modal on click', () => {
    showCountyDetails('grafton');
    const modal = document.getElementById('county-modal');
    expect(modal.style.display).toBe('block');
  });

  test('should close modal on Escape key', () => {
    showCountyDetails('grafton');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    const modal = document.getElementById('county-modal');
    expect(modal.style.display).toBe('none');
  });

  test('should show top 5 rankings', () => {
    showCountyDetails('grafton');
    const rankings = document.querySelectorAll('.ranking-item');
    expect(rankings.length).toBe(5);
  });
});

describe('Accessibility', () => {
  test('should have ARIA labels on counties', () => {
    const grafton = document.getElementById('county-grafton');
    expect(grafton.getAttribute('aria-label')).toContain('Grafton County');
  });

  test('should support keyboard navigation', () => {
    const select = document.getElementById('species-select');
    select.focus();
    expect(document.activeElement).toBe(select);
  });
});
```

---

## Common Patterns

### Opening Modal Programmatically

```javascript
import { showCountyDetails } from './modules/interactions.js';

// Open Grafton County details
showCountyDetails('grafton');
```

### Closing Modal Programmatically

```javascript
function closeCountyModal() {
  const modal = document.getElementById('county-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Make globally accessible
window.closeCountyModal = closeCountyModal;
```

### Getting Current Species Selection

```javascript
function getCurrentSelectedSpecies() {
  const select = document.getElementById('species-select');
  return select ? select.value : 'chanterelles';
}
```

### Updating Probability Display

```javascript
function updateProbabilityDisplay(species, county, probability) {
  const display = document.getElementById('probability-display');
  if (display) {
    display.textContent = `${species} in ${county}: ${probability.toFixed(1)}%`;
    display.setAttribute('aria-live', 'polite');
  }
}
```

---

## Troubleshooting

### Modal Not Opening

**Symptoms:** Clicking county does nothing

**Debug Steps:**
1. Check console for errors
2. Verify `initEnhancedMapInteractions()` called in app.js
3. Confirm county element IDs match pattern: `county-{name}`
4. Test event listener:
   ```javascript
   document.getElementById('county-grafton').addEventListener('click', () => {
     console.log('County clicked!');
   });
   ```

### Species Card Not Updating

**Symptoms:** Card shows wrong species or doesn't update

**Debug Steps:**
1. Check `displaySpeciesInfo()` is called
2. Verify species data exists in `species.js`
3. Test manually:
   ```javascript
   import { displaySpeciesInfo } from './modules/interactions.js';
   displaySpeciesInfo('morel');
   ```

### Top 5 Rankings Wrong

**Symptoms:** Incorrect species shown or wrong order

**Debug Steps:**
1. Verify probability calculations in `mapCalculations.js`
2. Check weather data is loaded (`currentWeatherData`)
3. Test probability calculation:
   ```javascript
   import { calculateProbability } from './modules/mapCalculations.js';
   const prob = calculateProbability('chanterelles', 'grafton');
   console.log('Chanterelles in Grafton:', prob);
   ```

### Accessibility Issues

**Symptoms:** Screen reader not announcing changes, keyboard navigation broken

**Debug Steps:**
1. Test with screen reader (NVDA, JAWS, VoiceOver)
2. Verify ARIA labels:
   ```javascript
   const grafton = document.getElementById('county-grafton');
   console.log('ARIA label:', grafton.getAttribute('aria-label'));
   ```
3. Check focus management:
   ```javascript
   document.getElementById('species-select').focus();
   console.log('Focused element:', document.activeElement.id);
   ```

---

## Future Enhancements

### Short Term (v3.6.0)
- [ ] **Probability history graph** - Show 7-day trend for selected species/county
- [ ] **Compare counties** - Side-by-side comparison of 2-3 counties
- [ ] **Export rankings** - Download top 5 as PDF/image
- [ ] **Keyboard shortcuts** - Number keys 1-8 to select species

### Medium Term (v3.7.0)
- [ ] **Interactive tutorials** - First-time user walkthrough
- [ ] **Custom probability alerts** - Notify when species reaches threshold
- [ ] **Species search** - Autocomplete search instead of dropdown
- [ ] **Map zoom/pan** - Interactive map controls

### Long Term (v4.0.0)
- [ ] **AR overlay** - Camera view with species identification
- [ ] **3D terrain map** - Elevation-aware visualization
- [ ] **Multi-species mode** - Show probabilities for all species simultaneously
- [ ] **Social sharing** - Share county recommendations to social media

---

## Quick Reference

### Show County Modal
```javascript
import { showCountyDetails } from './modules/interactions.js';
showCountyDetails('grafton');
```

### Update Species Display
```javascript
import { displaySpeciesInfo } from './modules/interactions.js';
displaySpeciesInfo('morel');
```

### Get Top 5 Species for County
```javascript
import { getTop5Species } from './modules/interactions.js';
const top5 = getTop5Species('grafton');
console.log(top5); // [{ species: 'chanterelles', probability: 72.5 }, ...]
```

### Check Authentication Status
```javascript
import { authManager } from './modules/authentication.js';
if (authManager.isAuthenticated()) {
  // Show GPS coordinates
} else {
  // Show login prompt
}
```

### Submit Foraging Report
```javascript
import { submitForagingReport } from './modules/interactions.js';
submitForagingReport({
  species: 'morel',
  county: 'grafton',
  success: true,
  confidence: 'high',
  notes: 'Found near ash trees'
});
```
