# 🍄 GraniteFungiForager v3.12.1


[![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GraniteFungiForager** - NH Tier 1 Wild Mushroom Probability Map with interactive foraging conditions based on real-time weather data, peer-reviewed research, and mycological expertise. Now with **offline capability** for field use!

## 🌐 **LIVE APPLICATION**
**Try it now:** https://ibelanger.github.io/GraniteFungiForager/

## 🆕 **What's New in v3.12.1** (August 2026)

### 🩹 **Structural Cleanup & Accessibility Fixes**
Closes epic #69 — the post-multi-point-sampling audit's remaining structural and accessibility findings:
- Map legend now renders (its container element was missing entirely)
- Removed the dead authored SVG color palette that was always overwritten at runtime
- Removed the dead `#county-modal` (county detail has always rendered inline)
- Sticky species card now auto-compacts on scroll at every viewport width, not just mobile
- County-label and probability-badge text now meets WCAG AA contrast (4.5:1+) on gold/goldenrod map fills
- Fixed a duplicated "county" word in county aria-labels

## 🆕 **What's New in v3.12.0** (August 2026)

### 📍 **Per-Site Weather, Merged Conditions Card, Collapsible County Panel**
Three UI/data improvements building on the multi-point weather sampling work:
- Individual location cards (public-land sites) now show their own sample point's weather — not just the county-wide median — when a GPS match exists, surfacing real intra-county variance down to the trailhead level
- The "Data Source" status widget and the county detail panel's "Current Conditions" have been merged into one always-populated Conditions card, positioned in the left rail on desktop and directly under the map on mobile; it now defaults to a genuine statewide median instead of quietly reusing Merrimack's reading, and pairs each species' Soil Temp/Min Rain requirement against the actual current reading (e.g. `66°F / 55-75°F ✓`)
- The county detail panel's sections are now independently collapsible, with Top 5 and Recommendations open by default so the most-used info is immediately visible without scrolling past everything else

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

## 🆕 **What's New in v3.11.1** (July 2026)

### 🛠️ **Weather Status & Map Accuracy Fixes**
Two correctness bugs found post-v3.11.0:
- The map's hover tooltip could show a stale, inaccurate probability that didn't match the same species/county's number in the detail panel below it — the map's color/tooltip data wasn't being refreshed when live weather finished loading or auto-refreshed, only on direct interaction (species change, slider, button click). It now stays in sync automatically.
- A county whose live weather fetch failed and silently fell back to cached data could still be counted toward "✓ Live" status, hiding the fact that its numbers weren't current.

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

## 🆕 **What's New in v3.11.0** (July 2026)

### 🌦️ **Multi-Point Weather Sampling**
Each county now samples 3-4 geographically-diverse points instead of one town coordinate, aggregated via median with a visible range:
- Fixes cases where a single sample point missed a real storm by miles — one county's old anchor was ~4.4 miles from the nearest real gauge and undercounted a real rainfall event by 4x
- "Current Conditions" now shows the spread alongside the value, e.g. `0.28" (range 0.21"–0.77")`, so you can see how uniform (or patchy) conditions really are across the county
- Total weather API requests unchanged — still one batched request per county

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

## 🆕 **What's New in v3.10.2** (July 2026)

### 🍄 **Probability Model Accuracy Audit**
A user report that Wine Cap and Shaggy Mane were showing as top predictions despite nobody finding them led to a full audit of the 29-species probability model:
- Fixed a structural bug where Wine Cap, Shaggy Mane, and Oyster Mushroom couldn't be scored low by any weather condition — they now correctly drop during dry spells and spike during their real spring/fall fruiting windows
- Corrected 18 species whose seasonal data contradicted their own research notes (e.g. Wine Cap was coded to peak in summer despite its own notes describing a "summer pause during heat")
- Added missing winter-season data to 22 species that were silently defaulting to an inflated placeholder value
- Rebalanced 11 species (Matsutake was the worst) whose baseline probability already exceeded their own realistic ceiling before weather was even factored in

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

## 🆕 **What's New in v3.10.1** (July 2026)

### 🛠️ **Front-End UX/QC Fixes**
A source-code audit surfaced and fixed 10 usability/reliability issues:
- Fixed the "Top 5 Most Likely Species" temperature indicator, which always showed ❌ regardless of actual conditions
- Weather auto-refresh now runs on a single interval that correctly respects the Live Data toggle
- Manual condition sliders no longer recalculate twice per drag tick
- Weather fetches now time out after 8s so one stalled county can't block the rest
- Switching Live→Manual now seeds sliders from the last real weather reading instead of jumping to fixed defaults
- Larger touch targets on sliders and the Live Data checkbox for field use with gloves/cold hands
- The county map now scales cleanly on narrow phones without letterboxing
- Minor CSS/markup fixes (missing color variable, duplicate emoji, mobile breakpoint check)

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

## 🆕 **What's New in v3.10.0** (May 2026)

### 💚 **Support the Project**
A donate widget is now in the footer — help keep GraniteFungiForager free and ad-free:
- **One-time:** PayPal (paypal.me/IBelanger) or Venmo (@Ian-Belanger)
- **Monthly:** $1.99/month PayPal subscription via hosted button

*Previous release notes in [CHANGELOG.md](./CHANGELOG.md)*

### ⚠️ **Requirements**
- **HTTPS Required** - Service worker only works on HTTPS (GitHub Pages ✓)
- **Modern Browsers** - Chrome, Firefox, Safari, Edge (service worker support)

---

## 🆕 **What's New in v3.5.1** (December 2025)

### 📱 **UX Tightening & Mobile Optimization**
- **Reduced Header Footprint** - 50% smaller on desktop, even smaller on mobile for more map visibility
- **Weather Data Consistency** - Unified display order (Soil Temp → Rainfall → Air Temp) across species card and county details
- **Compact Data Source Card** - 2-line format with status + controls, removed redundant sidebar weather card
- **Manual Settings** - Compact styling matching Data Source card for hypothetical weather scenarios
- **County Names** - Fixed capitalization (Grafton instead of grafton)

### 🎨 **Accessibility & UI (v3.5.0)**
- **WCAG AAA Compliance** - All text elements meet 7:1+ contrast ratio
- **County Map Labels** - White text with shadows and stroke outlines for readability
- **Probability Badges** - Multi-layered shadows for clear visibility on all backgrounds
- **Field-Ready** - Optimized for mobile foraging in all lighting conditions

## 🍄 **What's New in v3.5.0** (December 2025)

### 🍄 **MAJOR: King Boletes & Hedgehogs Enhancement - 10 Species Added**
- **King Bolete Complex (7 species)** - All Boletus edulis group species now enhanced with comprehensive research-backed data
- **Hedgehog Subgenera (3 species)** - All Hydnum groups enhanced with DNA taxonomy and user field observations
- **Total Enhanced**: 17 of 29 species (59% complete, up from 24% in v3.4.0)
- **Estimated Accuracy**: 72-77% (up from 70-75% in v3.4.0)

### 🌲 **King Bolete Complex - 7 Species Enhanced**
- **Boletus edulis** (Type species, HIGH) - Norway Spruce 50%, conifer specialist, fixed taxonomic naming
- **B. subcaerulescens** (Pine King, MEDIUM-HIGH) - Spruce 70%, pine 20%
- **B. variipes** (Two-colored, MEDIUM-HIGH) - Oak 60%, summer fruiting
- **B. atkinsonii** (Atkinson's, MEDIUM) - Oak 40%, June-Sept extended season
- **B. separans** (Lilac-tinted, MEDIUM-HIGH) - Red Oak 60%, extended season
- **B. nobilis** (Noble, MEDIUM) - Oak-Beech 90%, high elevation specialist
- **B. chippewaensis** (Chippewa, MEDIUM-HIGH) - Hemlock 70% specialist

### 🦔 **Hedgehog Subgenera - 3 Species Enhanced**
- **Sweet Tooth** (HIGH) - Merrimack County user-verified, Beech 35-40%, prolific late summer
- **Depressed Hedgehog** (MEDIUM-HIGH) - 9 eastern species, small size diagnostic, oak 35-45%
- **White Hedgehog** (MEDIUM-HIGH) - DNA-based ID (Swenie et al. 2018), staining tests critical

### 🎯 **Enhanced Features**
- **User Field Observations** - Merrimack County late summer data integrated, increased regional probabilities
- **Species-Specific Host Trees** - Percentage-based host associations for all Boletus species
- **Elevation-Based Phenology** - 7-14 day delays per 1000 feet for mountain species
- **Taxonomic Accuracy** - Fixed Boletus edulis naming (was incorrectly labeled as var. chippewaensis)

### 📚 **New Research Sources**
6+ additional peer-reviewed sources including boletes.wpamushroomclub.org, Swenie et al. 2018 DNA taxonomy, user field observations from Merrimack County.

## 🆕 **What's New in v3.4.0** (December 2025)

### 🔬 **Research-Backed Species Data Integration**
- **7 Key Species Enhanced** - Morels, Chanterelles, Matsutake, Maitake, Lobster Mushroom, Milk Caps (3), Black Trumpets
- **13 New Data Fields** - Optimal soil temperatures, pH requirements, precipitation windows, elevation ranges, host tree frequencies
- **Confidence Levels** - All enhanced data includes confidence ratings (High/Medium/Low) and source citations
- **Enhanced Safety Protocols** - Critical identification checks for morels, chanterelles, milk caps, and lobster mushrooms

## 🆕 **What's New in v3.3.0** (December 2025)

### 🧪 **MAJOR: 100% Test Coverage Achieved**
- **470 Comprehensive Tests** - Complete validation of all application functionality
- **100% Pass Rate** - All 468 tests passing, 2 properly skipped (jsdom limitations)
- **100% Module Coverage** - All 8 core modules thoroughly tested
- **Professional Documentation** - Complete test suite guide in `tests/README.md`

### 🔧 **Quality Improvements**
- **Browser Compatibility** - Fixed form field access in `interactions.js` for cross-browser support
- **CI/CD Configuration** - Updated to Vitest 4.x with proper v8 coverage provider
- **GitHub Pages Deployment** - Automated deployment workflow on every push to main
- **Test Infrastructure** - Vitest 4.0.14 with jsdom environment and comprehensive mocking

### 📊 **Testing Metrics**
- **Test Files**: 8 comprehensive test suites
- **Coverage**: Weather (26), Maps (48), Auth (56), Reports (84), Species (62), iNaturalist (60), Lands (65), UI (67)
- **Duration**: ~5 seconds for full suite
- **Documentation**: Detailed breakdown of all tests with examples and best practices


## 🆕 **What's New in v3.2.1** (August 2025)

### 🔒 **NEW: Authentication System for Location Data Protection**
- **Password-Protected GPS Coordinates** - Sensitive foraging locations now require authentication to prevent over-harvesting
- **Conservation-Focused Design** - General habitat information remains public for educational purposes
- **Seamless User Experience** - Modal-based authentication with 24-hour session persistence
- **Responsible Foraging** - Protects sensitive ecological locations while maintaining educational access

### 📊 **Enhanced Data Protection**
- **Protected Information**: GPS coordinates, specific trail names, parking locations, contact details
- **Public Information**: Climate data, soil types, elevation ranges, seasonal timing, habitat descriptions
- **Two Access Passwords**: `granite2024` and `forager123` for accessing detailed location data
- **Session Management**: 24-hour authentication with automatic cleanup

## 🆕 **What's New in v3.2** (August 2024)

### 🎯 Enhanced User Experience
- **Top 5 Species Rankings** - Click any county to see the 5 most likely species with current conditions
- **Visual Condition Indicators** - See temperature, moisture, and seasonal matches at a glance
- **Improved Species Selection** - Alphabetical ordering with clear "Select a species" default
- **Fixed Tooltip System** - Single, enhanced tooltips with species-specific information

### 🍄 Expanded Species Database
- **King Bolete Complex Breakdown** - 7 individual Boletus species with distinct ecological requirements
- **29 Total Species** - Complete DHHS Tier 1 coverage plus subspecies variations
- **Enhanced Species Cards** - Detailed identification notes and habitat preferences

### 🗺️ Better Map Interaction
- **No-Species-Selected Handling** - Clear messaging when no species is chosen
- **Neutral Map Colors** - Visual feedback when no species is active
- **Enhanced County Clicks** - Immediate feedback and smooth scrolling to information

## 📋 **DHHS Compliance**
✅ **Complete with ALL 29 species variants** (Updated August 2024)
✅ **Scientifically accurate subspecies** (Boletus 7-species, Hedgehog 3-subgenera)
✅ **Real-time weather integration** for probability calculations

GraniteFungiForager is the most comprehensive tool for New Hampshire mushroom foragers, providing county-specific probability maps, detailed species identification, and public lands recommendations.

🔍 **Key Features**
- **Complete DHHS Tier 1 Species Database** - 29 species including subspecies variants
- **Real-time Weather Integration** - Live probability calculations with 5-minute auto-refresh
- **Interactive County Map** - Click for detailed recommendations and top species rankings
- **Scientific Accuracy** - Individual species with distinct ecological requirements
- **Protected Public Lands Database** - Password-protected GPS coordinates and access information
- **Conservation-Focused Authentication** - Protects sensitive locations from over-harvesting
- **Mobile Responsive** - Optimized for field use on all devices
- **Community Data** - Foraging success tracking and validation system

🛠️ **Built using:** Vanilla HTML, CSS, JavaScript (client-side only)

📌 **License & Future Plans**  
This project is licensed under the [MIT License](./LICENSE), allowing free use and contributions.

⚠️ **Heads up:** Future versions of this project may include premium features or datasets offered under a separate commercial license. Community contributions and feedback are encouraged!

## 🏗️ Project Structure
```
GraniteFungiForager/
├── index.html                    # Main application entry point
├── app.js                        # Application controller
├── package.json                  # Dependencies and scripts
├── vitest.config.js              # Test configuration
├── .github/workflows/            # CI/CD pipelines
│   ├── test.yml                  # Automated testing
│   └── deploy.yml                # GitHub Pages deployment
├── src/
│   ├── styles.css                # Application styling
│   ├── modules/                  # Feature modules (11 files)
│   │   ├── weather.js            # Weather integration (26 tests)
│   │   ├── species.js            # Species database (62 tests)
│   │   ├── mapCalculations.js   # Probability engine (48 tests)
│   │   ├── interactions.js       # UI interactions (67 tests)
│   │   ├── publicLands.js        # Location data (65 tests)
│   │   ├── authentication.js     # Auth system (56 tests)
│   │   ├── foragingReports.js    # User data collection (84 tests)
│   │   ├── iNaturalistIntegration.js  # External API (60 tests)
│   │   ├── speciesMapping.js     # Name normalization
│   │   ├── observationAnalysis.js     # ML analysis
│   │   └── speciesCoverageAudit.js    # Data QA
│   └── ml/
│       └── accuracy-improvement-pipeline.js  # ML framework
├── tests/
│   ├── unit/                     # 8 test files (470 tests)
│   ├── helpers/                  # Mock data and utilities
│   ├── setup.js                  # Test configuration
│   └── README.md                 # Test documentation
├── docs/
│   ├── design-system/            # UI design system documentation
│   └── archive/                  # Archived historical documents
├── CLAUDE.md                     # Development guidance
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidelines
├── ACCURACY_IMPROVEMENT_PLAN.md  # ML roadmap
├── CODE_OF_CONDUCT.md            # Community guidelines
└── LICENSE                       # MIT License
```

## 🚀 Quick Start
```bash
git clone https://github.com/yourusername/GraniteFungiForager.git
cd GraniteFungiForager

# Install dependencies (for testing/development)
npm install

# Start development server
npm run dev
# Or: python -m http.server 8000

# Open in browser
# http://localhost:8000

# Run tests
npm test                  # Run all 470 tests
npm run test:watch        # Watch mode
npm run test:ui           # Interactive UI
npm run test:coverage     # Coverage report
```

## 🧪 Testing & Quality Assurance

**v3.3.0 Achievement: 100% Test Coverage**

- **470 comprehensive tests** (468 passing, 2 properly skipped)
- **100% pass rate** across all 8 core modules
- **~5 seconds** for full test suite
- **CI/CD integration** with GitHub Actions

See [tests/README.md](./tests/README.md) for detailed test documentation.

## 🔒 **Using the Authentication System**

### **Accessing Protected Location Data**
1. **Select a species** and click on any county
2. **View general information** (freely available): climate, soil types, timing, elevation
3. **For detailed locations**: Click "🔑 Access Location Data" when you see the authentication prompt
4. **Enter password**: Use `granite2024` or `forager123`
5. **Access granted**: GPS coordinates, trail names, and detailed access information will appear

### **Why Authentication?**
- **Prevents over-harvesting** at specific GPS locations
- **Protects sensitive ecosystems** from excessive foraging pressure  
- **Maintains educational value** - general habitat info remains freely available
- **Supports conservation** - follows responsible foraging practices
- **24-hour sessions** - stay logged in for field use

### **For Developers**
- **Client-side only** - No server-side authentication required
- **Conservation-focused** - Not high-security, designed to prevent casual over-harvesting
- **Configurable passwords** - Easy to change in `src/modules/authentication.js`
- **Session management** - Automatic cleanup and expiration handling

## 🚀 **Development & Contributing**

**Want to contribute?** Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**See our roadmap:** [ACCURACY_IMPROVEMENT_PLAN.md](./ACCURACY_IMPROVEMENT_PLAN.md) shows completed features and future development.

**Technical Documentation:** [CLAUDE.md](./CLAUDE.md) contains detailed architecture and development guidance.
