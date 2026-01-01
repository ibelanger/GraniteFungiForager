# CLAUDE.md

This file provides quick reference guidance for Claude Code when working with the GraniteFungiForager codebase.

**For detailed module documentation**, see [`.claude/skills/`](./.claude/skills/) - focused, triggerable deep-dives for each major system.

---

## Project Overview

**GraniteFungiForager v3.5.2** is a client-side web application providing interactive probability maps for foraging New Hampshire's DHHS Tier 1 wild mushroom species. Combines real-time weather data with mycological research to calculate county-specific foraging probabilities. Features offline capability, ML-powered accuracy improvement, and conservation-focused location protection.

**Live:** https://ibelanger.github.io/GraniteFungiForager/

**Tech Stack:** Vanilla JavaScript (ES6 modules), no build process, no framework dependencies

---

## Quick Commands

```bash
# Development
npm run dev              # Local server (http://localhost:8000)
npm start                # Production server

# Testing
npm test                 # Run all 470 tests
npm run test:watch       # Watch mode (re-run on changes)
npm run test:ui          # Interactive test UI
npm run test:coverage    # Generate coverage reports

# Status: 468/470 passing (100% pass rate on testable code)
```

---

## File Structure

```
GraniteFungiForager/
├── index.html           # Entry point
├── app.js               # Application controller
├── sw.js                # Service worker (offline capability)
├── package.json         # Dependencies
├── vitest.config.js     # Test configuration
├── .github/workflows/   # CI/CD (test.yml, deploy.yml)
├── src/
│   ├── styles.css       # Single CSS file (no build step)
│   ├── modules/         # 11 feature modules
│   │   ├── weather.js
│   │   ├── species.js
│   │   ├── mapCalculations.js
│   │   ├── interactions.js
│   │   ├── publicLands.js
│   │   ├── authentication.js
│   │   ├── foragingReports.js
│   │   ├── iNaturalistIntegration.js
│   │   ├── speciesMapping.js
│   │   ├── observationAnalysis.js
│   │   └── speciesCoverageAudit.js
│   └── ml/
│       └── accuracy-improvement-pipeline.js
├── tests/
│   ├── unit/            # 8 test files (470 tests)
│   ├── helpers/         # Mock data
│   └── README.md
├── docs/
│   └── design-system/
├── .claude/
│   ├── skills/          # Detailed module docs (7 skills)
│   ├── scripts/         # context-bar.sh
│   └── settings.json
├── CLAUDE.md            # This file
├── README.md            # User documentation
├── CHANGELOG.md         # Version history
└── ACCURACY_IMPROVEMENT_PLAN.md  # ML roadmap
```

---

## Module Documentation

**For detailed documentation on each module, use the `.claude/skills/` system:**

- **`weather-module`** - Weather API integration, soil temp calculations
- **`species-module`** - DHHS Tier 1 species database (29 species)
- **`map-calculations-module`** - Probability engine with research-backed multipliers
- **`authentication-module`** - Conservation-focused location protection
- **`testing-guide`** - Vitest setup, coverage, debugging
- **`cicd-guide`** - GitHub Actions workflows, deployment
- **`ml-roadmap`** - Accuracy improvement pipeline (60-70% → 85-90% target)

These skills are triggered automatically by Claude Code based on keywords in your requests.

---

## Critical Development Conventions

### ES6 Module System
- All modules use `export` and `import` statements
- No build step required - code runs directly in browser
- No transpilation (modern browser requirement)

### Code Style
- **Functions:** camelCase
- **Classes:** PascalCase
- **Constants:** UPPER_CASE
- **Files:** kebab-case.js

### Testing Requirements
- All tests must pass before merging (`npm test`)
- Aim for 100% coverage on new modules
- Use Vitest's `expect` API with descriptive messages
- Mock external APIs (Open-Meteo, iNaturalist)

### Global State Management
- Modules export global objects (e.g., `currentWeatherData` in weather.js)
- Event-driven communication via custom events (e.g., `authStateChanged`)
- No external state management library

### Offline Capability (NEW v3.5.2)
- Service worker caches species data and UI assets
- IndexedDB queues foraging reports when offline
- Auto-sync when connection restored
- Toast notifications for status updates

---

## Data Flow

```
User Input → interactions.js
                ↓
         species.js (database)
                ↓
         weather.js (API fetch)
                ↓
    mapCalculations.js (probability engine)
                ↓
         Update SVG map colors
                ↓
    County click → Modal with details
```

---

## Key Features by Module

| Feature | Module | Line Count | Tests |
|---------|--------|------------|-------|
| Real-time weather | weather.js | ~300 | 26 |
| Species database | species.js | ~2,500 | 62 |
| Probability calculation | mapCalculations.js | ~400 | 48 |
| UI/interactions | interactions.js | ~1,200 | 67 |
| Authentication | authentication.js | ~200 | 56 |
| Location data | publicLands.js | ~400 | 65 |
| User reports | foragingReports.js | ~500 | 84 |
| iNaturalist integration | iNaturalistIntegration.js | ~600 | 60 |

---

## Adding New Features

1. **Create module** in `src/modules/` with clear single responsibility
2. **Write tests first** in `tests/unit/` before implementation
3. **Update this file** with high-level summary
4. **Create detailed skill** in `.claude/skills/` if significant feature
5. **Import in app.js** if initialization needed
6. **Run tests** - ensure all 470+ tests pass

---

## Common Patterns

### Weather Data Access
```javascript
import { currentWeatherData } from './modules/weather.js';
const temp = currentWeatherData.counties['Grafton'].temperature;
```

### Authentication Check
```javascript
import { authManager } from './modules/authentication.js';
if (authManager.isAuthenticated()) { /* show protected data */ }
```

### Modal Display
```javascript
import { showModal } from './modules/interactions.js';
showModal('Title', 'HTML content');
```

### Offline Report Queueing
```javascript
// In foraging reports - automatically queued when offline
reportsManager.addReport(reportData);
// Service worker syncs when online
```

---

## AI Model Selection Preferences

**Planning Mode (EnterPlanMode):**
- **Model:** Claude Opus 4.5 (opus)
- **Extended Thinking:** ENABLED
- Use for: Complex architectural decisions, implementation planning, exploring edge cases

**Execution Mode (Default):**
- **Model:** Claude Sonnet 4.5 (sonnet)
- Use for: Coding, testing, documentation updates, bug fixes, refactoring

**Simple Tasks:**
- **Model:** Claude Haiku (haiku)
- Use for: Version number updates, simple file reads, repetitive tasks

---

## Performance & Optimization

- **Auto-refresh:** Pauses when tab not visible
- **Weather caching:** Prevents excessive API calls (5-minute cache)
- **Service worker:** Caches static assets and species data
- **Responsive design:** Mobile-first, field-ready UI
- **No build step:** Direct browser execution (faster dev)

---

## Safety & Compliance

- **DHHS Tier 1 Species:** All 29 species approved for commercial sale in NH
- **Conservation Focus:** Protected GPS coordinates with authentication
- **Safety Warnings:** "Never eat unidentified mushrooms" prominently displayed
- **Research-Backed:** Peer-reviewed sources for all species data

---

## Version History (Recent)

- **v3.5.2** (Jan 2026) - Offline capability (service worker, IndexedDB queue), documentation restructuring
- **v3.5.1** (Dec 2025) - UX tightening, mobile optimization, weather display consistency
- **v3.5.0** (Dec 2025) - King Boletes & Hedgehogs enhancement (10 species)
- **v3.4.0** (Dec 2025) - Research-backed data integration (peer-reviewed sources)
- **v3.3.0** (Dec 2025) - 100% test coverage (470 tests)

See [CHANGELOG.md](./CHANGELOG.md) for complete history.

---

## Quick Debugging

```bash
# Browser console
console.log(window.currentWeatherData);        # Check weather state
console.log(window.mushroomApp.getStatus());   # App status
window.enableDebug();                           # Enable debug panel
window.coverageAuditor.printCoverageReport();   # Species mapping coverage
```

---

## Testing Checklist

Before committing:
- [ ] All tests pass: `npm test`
- [ ] No console errors in browser (F12)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Mobile responsive (viewport < 768px)
- [ ] Offline mode works (DevTools → Network → Offline)
- [ ] Service worker updates properly

---

## CI/CD Pipeline

**GitHub Actions:**
- Test workflow runs on push/PR (3 Node versions: 18.x, 20.x, 22.x)
- Deploy workflow auto-deploys to GitHub Pages on push to `main`
- Coverage reports retained for 30 days

**Status:** [![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml)

For details, trigger the `cicd-guide` skill or see `.github/workflows/`.

---

## Resources

- **Skills:** [`.claude/skills/`](./.claude/skills/) - Detailed module documentation
- **Tests:** [tests/README.md](./tests/README.md) - Test structure and helpers
- **Accuracy Plan:** [ACCURACY_IMPROVEMENT_PLAN.md](./ACCURACY_IMPROVEMENT_PLAN.md) - ML roadmap
- **Design System:** [docs/design-system/](./docs/design-system/) - UI components and patterns

---

*For module-specific details, Claude Code will automatically load the appropriate skill based on your query keywords.*
