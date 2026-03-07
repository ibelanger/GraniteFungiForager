#!/usr/bin/env bash
# =============================================================================
# create-issues.sh — GraniteFungiForager GitHub Issues Bootstrap
# =============================================================================
# Creates all labels, milestones, and 26 structured issues consolidating:
#  - Species research gaps (12 species at 41% needing research-grade data)
#  - Soil data integration (matsutake shiro, morel floodplain, pH engine)
#  - CI/CD technical debt (ESLint, Codecov)
#  - ML roadmap (ACCURACY_IMPROVEMENT_PLAN.md)
#  - Offline enhancements, expert partnerships, testing infrastructure
#
# Prerequisites:
#   gh auth login                          # authenticate to GitHub
#   gh auth status                         # verify auth
#
# Usage:
#   chmod +x .github/scripts/create-issues.sh
#   ./.github/scripts/create-issues.sh
#
# The script is idempotent: existing labels/milestones with the same name
# are skipped. Duplicate issues are NOT detected - run only once.
# =============================================================================

set -euo pipefail

REPO="ibelanger/GraniteFungiForager"

# Verify gh auth
if ! gh auth status --hostname github.com &>/dev/null; then
  echo "ERROR: Not authenticated. Run: gh auth login"
  exit 1
fi

echo "=== GraniteFungiForager Issues Bootstrap ==="
echo "Repo: $REPO"
echo ""

# =============================================================================
# STEP 1: Labels
# =============================================================================
echo "--- Creating Labels ---"

create_label() {
  local name="$1" color="$2" desc="$3"
  if gh label list --repo "$REPO" --json name --jq '.[].name' | grep -qx "$name"; then
    echo "  [skip] label '$name' already exists"
  else
    gh label create "$name" --color "$color" --description "$desc" --repo "$REPO"
    echo "  [ok]   created label '$name'"
  fi
}

create_label "research"           "0075ca" "Species data research tasks"
create_label "data-quality"       "e4e669" "Data completeness and accuracy"
create_label "probability-engine" "d93f0b" "mapCalculations.js changes"
create_label "enhancement"        "a2eeef" "Feature improvements"
create_label "technical-debt"     "ee0701" "CI/CD and code quality"
create_label "ml-roadmap"         "5319e7" "Machine learning roadmap"
create_label "ui-ux"              "f9d0c4" "UI/UX improvements"
create_label "infrastructure"     "bfd4f2" "Offline, service worker, CI"
create_label "good-first-issue"   "7057ff" "Approachable starter tasks"
create_label "epic"               "1d76db" "Parent tracking issue"

echo ""

# =============================================================================
# STEP 2: Milestones
# =============================================================================
echo "--- Creating Milestones ---"

create_milestone() {
  local title="$1" desc="$2"
  if gh api "repos/$REPO/milestones" --jq '.[].title' | grep -qF "$title"; then
    echo "  [skip] milestone '$title' already exists"
  else
    gh api "repos/$REPO/milestones" --method POST \
      --field title="$title" \
      --field description="$desc"
    echo "  [ok]   created milestone '$title'"
  fi
}

create_milestone \
  "v3.6.0 - Research Complete" \
  "All 29 species at research grade + soil pH integrated into probability engine"

create_milestone \
  "v3.7.0 - ML Foundation" \
  "First ML model trained, offline enhancements, expert validation partnerships"

create_milestone \
  "v4.0.0 - Advanced Features" \
  "Expert partnerships, advanced analytics, photo identification"

echo ""

# =============================================================================
# Helper: resolve milestone number by title
# =============================================================================
get_milestone_number() {
  gh api "repos/$REPO/milestones" --jq ".[] | select(.title == \"$1\") | .number"
}

# =============================================================================
# STEP 3: Issues — EPIC GROUP A: Species Research
# =============================================================================
echo "--- Creating Epic A: Species Research Issues ---"

M360=$(get_milestone_number "v3.6.0 - Research Complete")

# Issue A1 — Epic: All 29 species at research grade
EPIC_A=$(gh issue create --repo "$REPO" \
  --title "[Epic] Complete research-grade data for all 29 DHHS Tier 1 species" \
  --label "epic,research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Overview

Currently **17 of 29 species (59%)** have research-grade data fields in `species.js`:
- `optimalSoilTemp` — soil temperature range with source citation
- `soilPH` — min/max/optimal pH with source
- `precipitationWindow` — rainfall timing requirements
- `elevationRange` — NH-specific elevation bands
- `hostTreeFrequencies` — quantified host tree associations
- `phenologyNH` — New Hampshire-specific fruiting calendar

The remaining **12 species (41%)** have only basic data (temp range, moisture min, season multiplier). This epic tracks bringing all to research grade.

## Already complete (17 species)
Morels, Golden/Funnel Chanterelles, Matsutake, Maitake, King Boletes (7 species), Hedgehogs (3 species), Milk Caps (3 species), Black Trumpets

## Needs research enhancement (12 species)
- [ ] #<!-- beefsteak --> Beefsteak Polypore (Fistulina hepatica)
- [ ] #<!-- cauliflower --> Cauliflower Mushroom (Sparassis americana)
- [ ] #<!-- trumpet --> Trumpet Chanterelle (Craterellus tubaeformis)
- [ ] #<!-- russula --> Green Quilted Russula (Russula virescens)
- [ ] #<!-- jellyear --> Jelly Ear (Auricularia auricula-judae)
- [ ] #<!-- hericium --> Lion's Mane / Hericium (3 NH species)
- [ ] #<!-- lobster --> Lobster Mushroom (precipitationWindow + elevation)
- [ ] #<!-- blewit --> Blewit (Lepista nuda)
- [ ] #<!-- oyster --> Oyster Mushroom (3 NH species)
- [ ] #<!-- winecap --> Wine Cap (Stropharia rugoso-annulata)
- [ ] #<!-- shaggymane --> Shaggy Mane (Coprinus comatus)
- [ ] #<!-- tests --> Add validation tests for all new research fields

## References
- `src/modules/species.js` — species database
- `tests/unit/species.test.js` — 62 tests; must maintain 100% pass rate
BODY
)" 2>&1 | grep -oP '#\d+' | head -1)

echo "  [ok] Epic A created: $EPIC_A"

# Issue A2 — Beefsteak Polypore
gh issue create --repo "$REPO" \
  --title "Research-enhance: Beefsteak Polypore (Fistulina hepatica)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Beefsteak Polypore entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — oak root-zone temps; fruiting in warm summer soils (65-75°F)
- [ ] `soilPH` — tolerates wide range 4.0-7.0; oak-acidified soils common host
- [ ] `precipitationWindow` — needs 1-2 weeks sustained moisture before parasite emergence
- [ ] `elevationRange` — found 200-1500ft in NH oak stands; rare above 1200ft
- [ ] `hostTreeFrequencies` — oak spp. 90%+, chestnut oak, red oak; occasional beech
- [ ] `phenologyNH` — July-October peak; warm summer days + recent rain

## Research Sources
- MushroomExpert.com (Michael Kuo) — Fistulina hepatica ecology
- CABI Species page — host range, environmental tolerances
- iNaturalist NH observations — phenology validation

## File
`src/modules/species.js` — search for `beefsteak` or `Fistulina`

## Acceptance Criteria
- All fields present with cited sources
- `tests/unit/species.test.js` updated with range validation
- `npm test` passes with 470+ tests
BODY
)" > /dev/null && echo "  [ok] A2: Beefsteak Polypore"

# Issue A3 — Cauliflower Mushroom
gh issue create --repo "$REPO" \
  --title "Research-enhance: Cauliflower Mushroom (Sparassis americana)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Cauliflower Mushroom entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — pine root-zone parasite; fruiting when soil cools to 50-65°F
- [ ] `soilPH` — prefers acidic pine soils pH 4.0-5.5
- [ ] `precipitationWindow` — late summer rains trigger; needs 2-3 weeks sustained moisture
- [ ] `elevationRange` — 200-2500ft in NH; follows pine distribution
- [ ] `hostTreeFrequencies` — Eastern White Pine 70%, Red Pine 20%, Pitch Pine 10%
- [ ] `phenologyNH` — August-October; base of living pine trees

## Research Sources
- USDA Forest Service — Sparassis crispa/americana ecology
- Index Fungorum — taxonomy and distribution
- North American Mycological Association records

## File
`src/modules/species.js` — search for `cauliflower` or `Sparassis`

## Acceptance Criteria
- All fields present with cited sources
- `tests/unit/species.test.js` updated
- `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A3: Cauliflower Mushroom"

# Issue A4 — Trumpet Chanterelle
gh issue create --repo "$REPO" \
  --title "Research-enhance: Trumpet Chanterelle (Craterellus tubaeformis)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Trumpet Chanterelle entry in `src/modules/species.js`.
Critically: distinguish data from the Golden Chanterelle (C. cibarius) which fruiting earlier/warmer.

## Fields to Add
- [ ] `optimalSoilTemp` — cooler preference than C. cibarius; 45-60°F optimal
- [ ] `soilPH` — sphagnum bog and wet conifer preference; pH 4.0-5.0
- [ ] `precipitationWindow` — requires sustained moisture, mossy/boggy substrate
- [ ] `elevationRange` — found higher elevations in NH (500-3000ft) in spruce-fir
- [ ] `hostTreeFrequencies` — conifer mycorrhizal: Spruce 40%, Fir 30%, Hemlock 20%, Pine 10%
- [ ] `phenologyNH` — September-November; later than golden chanterelle; frost-tolerant

## Research Sources
- USDA PNW-GTR-576 — Pacific chanterelle ecology (applicable to NE species)
- Petersen (1979) — Cantharelloid fungi of northeastern North America
- MushroomExpert.com — C. tubaeformis page

## File
`src/modules/species.js` — search for `trumpet` or `tubaeformis`

## Acceptance Criteria
- Data clearly differentiated from C. cibarius/C. lateritius entries
- All fields present with cited sources
- `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A4: Trumpet Chanterelle"

# Issue A5 — Green Russula
gh issue create --repo "$REPO" \
  --title "Research-enhance: Green Quilted Russula (Russula virescens)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Green Quilted Russula entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — heat-tolerant summer species; optimal 65-80°F soil
- [ ] `soilPH` — deciduous hardwood mycorrhizal; pH 5.0-6.5
- [ ] `precipitationWindow` — appears 5-10 days after significant rain (1-2")
- [ ] `elevationRange` — below 2000ft in NH; follows oak/beech distribution
- [ ] `hostTreeFrequencies` — Oak 60%, Beech 30%, Birch 10%
- [ ] `phenologyNH` — June-September; peak summer fruiting

## Research Sources
- MushroomExpert.com — Russula virescens page
- Kibby & Fatto (1990) — Russula monograph for eastern North America
- European Russula literature (Sarnari) for ecology baseline

## File
`src/modules/species.js` — search for `russula` or `virescens`

## Acceptance Criteria
- All fields present with cited sources; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A5: Green Russula"

# Issue A6 — Jelly Ear
gh issue create --repo "$REPO" \
  --title "Research-enhance: Jelly Ear (Auricularia auricula-judae)" \
  --label "research,data-quality,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Jelly Ear entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — substrate (wood) temp not soil; active 35-65°F (cold-tolerant)
- [ ] `soilPH` — saprobe on hardwood, esp. elder; pH 5.0-7.0
- [ ] `precipitationWindow` — high moisture requirement; rehydrates after drying; needs 3+ days consecutive rain
- [ ] `elevationRange` — 0-2000ft in NH; elder/alder riparian preference
- [ ] `hostTreeFrequencies` — Elder (Sambucus) 50%, other hardwood deadwood 40%, Alder 10%
- [ ] `phenologyNH` — year-round in NH; peak spring and fall; notable cold fruiter

## Research Sources
- Stamets, "Growing Gourmet and Medicinal Mushrooms" (2000) — cultivation ecology
- Index Fungorum — Auricularia distribution
- iNaturalist observations — NH phenology validation

## Notes
Jelly ear is a **good-first-issue** as it has simpler ecology (saprobe, not mycorrhizal).

## File
`src/modules/species.js` — search for `jelly` or `Auricularia`

## Acceptance Criteria
- All fields present with cited sources; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A6: Jelly Ear"

# Issue A7 — Lion's Mane / Hericium
gh issue create --repo "$REPO" \
  --title "Research-enhance: Lion's Mane / Hericium (H. erinaceus, coralloides, americanum)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Hericium entries in `src/modules/species.js`.
All three NH species are hardwood wound saprobes/parasites; distinguish per-species data.

## Species to Differentiate
1. **H. erinaceus** — single globe, beech/oak wounds; most prized
2. **H. coralloides** — branching coral, dead hardwood; wider distribution
3. **H. americanum** — branching from single point; beech dominant

## Fields to Add (per species)
- [ ] `optimalSoilTemp` — substrate (wood) not soil; fruiting 50-70°F ambient
- [ ] `soilPH` — hardwood wound parasite; host tree determines pH context; 5.5-7.0
- [ ] `precipitationWindow` — late summer/fall rain triggers; 1-2 weeks moisture needed
- [ ] `elevationRange` — 200-2500ft in NH; follows mature beech/maple distribution
- [ ] `hostTreeFrequencies` — H. erinaceus: Beech 50%, Oak 30%, Maple 20%; adjust per species
- [ ] `phenologyNH` — August-November; peak September-October after first frosts

## Research Sources
- Stamets, "Growing Gourmet and Medicinal Mushrooms"
- MushroomExpert.com — Hericium species pages
- NH forest inventory data — mature beech stand distribution

## File
`src/modules/species.js` — search for `hericium` or `lionsm`

## Acceptance Criteria
- Three species differentiated with individual probability profiles
- All fields present with cited sources; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A7: Lion's Mane / Hericium"

# Issue A8 — Lobster Mushroom
gh issue create --repo "$REPO" \
  --title "Research-enhance: Lobster Mushroom — complete precipitationWindow and elevation data" \
  --label "research,data-quality,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Complete the partially-enhanced Lobster Mushroom entry in `src/modules/species.js`.
This species already has some research data but is missing key fields.

## Fields to Complete
- [ ] `precipitationWindow` — *currently missing*; Hypomyces parasiticus (the parasite that creates lobster mushroom) needs 2-3 weeks sustained moisture for host Russula/Lactarius fruiting
- [ ] `elevationRange` — verify and complete NH-specific elevation bands
- [ ] `hostFrequencies` — verify Russula 70%, Lactarius 30% ratio against NH iNaturalist data
- [ ] Verify existing `soilPH` data against NH forest soil surveys

## Notes
Lobster mushroom is an unusual case — it's a parasitic ascomycete (*Hypomyces lactifluorum*)
growing on Russula or Lactarius species. Probability depends on host fruiting, not direct
mycorrhizal relationships.

## Research Sources
- MushroomExpert.com — Hypomyces lactifluorum page
- Beug et al. — North American species of Hypomyces

## File
`src/modules/species.js` — search for `lobster` or `Hypomyces`

## Acceptance Criteria
- `precipitationWindow` field added; elevation data complete; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A8: Lobster Mushroom"

# Issue A9 — Blewit
gh issue create --repo "$REPO" \
  --title "Research-enhance: Blewit (Lepista nuda / Clitocybe nuda)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Blewit entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — late-season cold-adapted species; prefers 40-55°F; frost-tolerant
- [ ] `soilPH` — broadly tolerant 5.5-8.0; often found in compost/rich organic soil; higher pH than most NH species
- [ ] `precipitationWindow` — late-season moisture; 1-2 weeks of consistent rain or snowmelt
- [ ] `elevationRange` — 0-2000ft in NH; garden edges, compost areas, mixed woods
- [ ] `hostTreeFrequencies` — saprobe, not mycorrhizal; organic-rich soil/duff; mixed woods 60%, disturbed areas 40%
- [ ] `phenologyNH` — October-December; one of the latest NH Tier 1 species; often after first frost

## Research Sources
- Arora, "Mushrooms Demystified" (1986) — Clitocybe/Lepista ecology
- North American Fungi database — Lepista nuda records
- NH mycological society records

## Notes
Blewit's broad pH tolerance and late fruiting make it unusual in the NH context where most species prefer acidic granite soils. May be more common in agricultural valley soils.

## File
`src/modules/species.js` — search for `blewit` or `Lepista`

## Acceptance Criteria
- All fields present with cited sources; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A9: Blewit"

# Issue A10 — Oyster Mushroom
gh issue create --repo "$REPO" \
  --title "Research-enhance: Oyster Mushroom (P. ostreatus, populinus, pulmonarius — 3 NH species)" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to all Oyster Mushroom entries in `src/modules/species.js`.
Differentiate the three NH species by their distinct seasonal and habitat profiles.

## Species to Differentiate
1. **P. ostreatus** — pearl/winter oyster; cold-season fruiter (35-60°F); on hardwood
2. **P. pulmonarius** — summer/phoenix oyster; warm-season (55-80°F); on beech/maple
3. **P. populinus** — aspen oyster; riparian cottonwood/aspen; NH's rarest of three

## Fields to Add (per species)
- [ ] `optimalSoilTemp` — substrate (wood) temp; highly variable by species (see above)
- [ ] `soilPH` — broadly pH tolerant (5.5-7.5); saprobe on standing/fallen hardwood
- [ ] `precipitationWindow` — P. ostreatus: late fall/early spring; P. pulmonarius: summer rains; P. populinus: spring moisture
- [ ] `elevationRange` — follows host tree distribution: cottonwood at lower elevations/riparian
- [ ] `hostTreeFrequencies` — P. ostreatus: Beech 40%, Oak 30%, Maple 20%, other 10%
- [ ] `phenologyNH` — distinct seasonal windows per species

## Research Sources
- Stamets, "Growing Gourmet and Medicinal Mushrooms"
- MushroomExpert.com — Pleurotus species pages
- USDA Forest Service — hardwood deadwood ecology

## File
`src/modules/species.js` — search for `oyster` or `Pleurotus`

## Acceptance Criteria
- Three species clearly differentiated; all fields present; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A10: Oyster Mushroom"

# Issue A11 — Wine Cap
gh issue create --repo "$REPO" \
  --title "Research-enhance: Wine Cap (Stropharia rugoso-annulata)" \
  --label "research,data-quality,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Wine Cap entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — prefers 55-75°F; spring and fall peaks avoid summer heat
- [ ] `soilPH` — wood chip/straw substrate preferred; pH 5.5-7.5
- [ ] `precipitationWindow` — needs 1-2 weeks consistent moisture; wood chip substrate retains moisture well
- [ ] `elevationRange` — 0-1500ft in NH; primarily human-modified landscapes (gardens, paths, parks)
- [ ] `hostTreeFrequencies` — saprobe on wood chips/straw; not mycorrhizal; habitat: mulch beds 50%, forest edges 30%, lawns 20%
- [ ] `phenologyNH` — May-June and September-October; bimodal NH fruiting; avoid hot July-August

## Research Sources
- Stamets, "Growing Gourmet and Medicinal Mushrooms"
- USDA extension publications on edible fungi cultivation
- MushroomExpert.com — Stropharia rugoso-annulata page

## Notes
Wine cap is unique among NH Tier 1 as it thrives in cultivated wood-chip beds — this should be noted in the species entry as an important habitat modifier.

## File
`src/modules/species.js` — search for `winecap` or `Stropharia`

## Acceptance Criteria
- All fields present with cited sources; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A11: Wine Cap"

# Issue A12 — Shaggy Mane
gh issue create --repo "$REPO" \
  --title "Research-enhance: Shaggy Mane (Coprinus comatus)" \
  --label "research,data-quality,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Add research-grade fields to the Shaggy Mane entry in `src/modules/species.js`.

## Fields to Add
- [ ] `optimalSoilTemp` — disturbed/compact soil specialist; 50-70°F optimal; avoids very hot/dry
- [ ] `soilPH` — alkaline-tolerant; pH 6.0-8.0; often in roadside soil and disturbed ground
- [ ] `precipitationWindow` — needs 1-2 days rain to trigger; short post-rain window (autodigests quickly)
- [ ] `elevationRange` — 0-1500ft in NH; almost entirely human-disturbed landscapes
- [ ] `hostTreeFrequencies` — saprobe; not mycorrhizal; substrate: lawns/paths 50%, disturbed soil 30%, meadow edges 20%
- [ ] `phenologyNH` — May-June and September-November; avoids hot summer; appears rapidly after rain

## Safety Note
Include in species data: autodigestion begins within hours of maturity. Must be harvested and consumed same day. This is safety-critical for the DHHS context.

## Research Sources
- Arora, "Mushrooms Demystified" (1986)
- MushroomExpert.com — Coprinus comatus page
- North American Fungi database records

## File
`src/modules/species.js` — search for `shaggymane` or `Coprinus`

## Acceptance Criteria
- All fields present with safety note documented; `npm test` passes
BODY
)" > /dev/null && echo "  [ok] A12: Shaggy Mane"

# Issue A13 — Tests for new research fields
gh issue create --repo "$REPO" \
  --title "Add validation tests for all newly research-enhanced species fields" \
  --label "research,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Once all 12 species in the research epic are enhanced, add comprehensive test coverage for the new fields in `tests/unit/species.test.js`.

## Tests to Add
For each of the 12 newly-enhanced species, verify:
- [ ] `soilPH.min` is a number between 3.0 and 9.0
- [ ] `soilPH.max` is a number greater than `soilPH.min`
- [ ] `soilPH.optimal` is between `soilPH.min` and `soilPH.max`
- [ ] `optimalSoilTemp` exists and has `min`/`max` properties in valid Fahrenheit range (30-90)
- [ ] `precipitationWindow` exists and has at least `minDays`/`amount` properties
- [ ] `elevationRange` exists with `min`/`max` values in valid NH range (0-6288)
- [ ] `hostTreeFrequencies` (if mycorrhizal) sums to ~1.0 (±0.05)
- [ ] `phenologyNH` exists and references valid NH months

## Affected File
`tests/unit/species.test.js` — currently 62 tests; this adds ~100 tests (8 checks × 12 species + margin)

## Prerequisite
Depends on completion of issues: Beefsteak Polypore, Cauliflower, Trumpet Chanterelle, Green Russula, Jelly Ear, Hericium, Lobster, Blewit, Oyster, Wine Cap, Shaggy Mane

## Acceptance Criteria
- 100+ new tests added
- All 570+ tests pass (`npm test`)
- Coverage remains at or above current level
BODY
)" > /dev/null && echo "  [ok] A13: Species field validation tests"

echo ""

# =============================================================================
# STEP 4: Issues — EPIC GROUP B: Soil Data Integration
# =============================================================================
echo "--- Creating Epic B: Soil Data Integration Issues ---"

# Issue B14 — Epic: Soil Data Integration
EPIC_B=$(gh issue create --repo "$REPO" \
  --title "[Epic] Integrate soilPH data from species.js into probability engine" \
  --label "epic,probability-engine,data-quality" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Overview

`soilPH` objects with `min`/`max`/`optimal` fields **already exist** in `species.js` for 18 species, all with peer-reviewed source citations. However, `mapCalculations.js` only contains **one** pH factor:

```js
// mapCalculations.js line ~129 — only existing pH logic
if (species === 'morel') probability *= 0.9; // NH granite soil penalty
```

This epic tracks integrating the existing pH data into the probability engine and refining soil data for the two most soil-sensitive species: matsutake and morel.

## Child Issues
- [ ] #<!-- ph-engine --> mapCalculations.js: Add soil pH multiplier to probability engine
- [ ] #<!-- matsutake --> Matsutake: Validate and expand shiro formation soil conditions
- [ ] #<!-- morel --> Morel: Granular soil type mapping and county-level pH integration

## Impact
Proper soil pH integration affects the probability of **18 species** across all 10 NH counties. It's the single largest accuracy improvement available from existing (already-researched) data.

## Files
- `src/modules/mapCalculations.js` — probability engine (line ~129)
- `src/modules/species.js` — soilPH data already exists here
- `tests/unit/mapCalculations.test.js` — update with pH test cases
BODY
)" 2>&1 | grep -oP '#\d+' | head -1)

echo "  [ok] Epic B created: $EPIC_B"

# Issue B15 — pH multiplier in mapCalculations.js
gh issue create --repo "$REPO" \
  --title "mapCalculations.js: Add soil pH multiplier to probability engine" \
  --label "probability-engine,enhancement" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Read the `soilPH` data already present in `species.js` and apply pH-based probability multipliers in `mapCalculations.js`.

## Current State
- `species.js`: soilPH objects with `{min, max, optimal, source}` exist for 18 species
- `mapCalculations.js`: only one hardcoded pH factor (morel × 0.9 granite penalty, line ~129)

## Implementation Plan

### 1. Add NH County Soil pH Lookup Table
```js
// Add to mapCalculations.js
const NH_COUNTY_SOIL_PH = {
  'Coos':         { avgPH: 4.8, texture: 'sandy-loam' },   // boreal granite
  'Grafton':      { avgPH: 5.0, texture: 'loam' },          // mixed granite/valley
  'Carroll':      { avgPH: 5.1, texture: 'sandy-loam' },
  'Belknap':      { avgPH: 5.3, texture: 'loam' },
  'Merrimack':    { avgPH: 5.5, texture: 'loam' },
  'Sullivan':     { avgPH: 6.0, texture: 'silt-loam' },     // CT River valley
  'Cheshire':     { avgPH: 6.1, texture: 'silt-loam' },     // CT River valley
  'Hillsborough': { avgPH: 5.6, texture: 'loam' },
  'Rockingham':   { avgPH: 5.8, texture: 'sandy-loam' },
  'Strafford':    { avgPH: 5.7, texture: 'loam' }
};
```
Source: USDA NRCS Web Soil Survey NH county aggregates

### 2. Add pH Multiplier Function
```js
function calculatePHMultiplier(species, county) {
  const soilPH = speciesData[species]?.soilPH;
  const countySoil = NH_COUNTY_SOIL_PH[county];
  if (!soilPH || !countySoil) return 1.0;

  const { min, max, optimal } = soilPH;
  const ph = countySoil.avgPH;

  if (ph < min || ph > max) return 0.6;           // outside tolerance
  if (ph === optimal) return 1.0;                  // perfect

  // Linear scale: 1.0 at optimal, 0.7 at tolerance boundary
  const distFromOptimal = Math.abs(ph - optimal);
  const range = ph < optimal ? (optimal - min) : (max - optimal);
  return 1.0 - (0.3 * distFromOptimal / range);
}
```

### 3. Integrate into calculateProbability()
- Apply `calculatePHMultiplier()` as a factor in the probability calculation
- Weight: 15% of total (soil pH is influential but not dominant)
- Remove the hardcoded morel granite penalty (line ~129) — it's now covered by the general mechanism

### 4. Update Tests
- [ ] Add county × species pH multiplier tests in `tests/unit/mapCalculations.test.js`
- [ ] Verify morel probabilities shift correctly for CT River valley vs granite counties
- [ ] Verify matsutake probabilities reflect acidic hemlock stand preference

## Files
- `src/modules/mapCalculations.js` — add table + function + integration
- `tests/unit/mapCalculations.test.js` — add pH multiplier tests

## Acceptance Criteria
- pH multiplier implemented and integrated
- Morel probability noticeably higher in Cheshire/Sullivan than Coos
- All tests pass (`npm test`)
BODY
)" > /dev/null && echo "  [ok] B15: pH multiplier in mapCalculations.js"

# Issue B16 — Matsutake shiro soil conditions
gh issue create --repo "$REPO" \
  --title "Matsutake: Validate and expand shiro formation soil conditions for NH hemlock stands" \
  --label "research,data-quality,probability-engine" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Validate and significantly expand the matsutake soil data in `src/modules/species.js` to accurately model shiro (mycelial mat) formation requirements in NH Eastern Hemlock stands.

## Current State
The matsutake entry has Kurokochi & Lian 2018 data:
- pH 4.5-5.5 (inside shiro zone)
- Host trees: Eastern Hemlock 60%, Jack Pine 20%, Red Pine 10%, Pitch Pine 10%

## Missing Data to Add

### Shiro Formation Conditions
- [ ] Soil texture requirement: **well-drained sandy loam** is critical; heavy clay or wet soils prevent shiro formation
  - Source: Ogawa (1978), Smith & Trappe (1972)
- [ ] Organic horizon depth: matsutake **inhibited by thick O horizon** (>3cm); thrives in thin duff layers
  - This is counterintuitive (most mushrooms prefer rich organic soil) — note explicitly
  - Source: Dunham et al. (2003) — matsutake ecology in North America
- [ ] Add `soilComposition` field:
  ```js
  soilComposition: {
    texture: 'sandy-loam',
    drainage: 'well-drained',
    organicMatter: 'low',
    notes: 'Inhibited by thick organic horizons >3cm; prefers mineral soil exposure'
  }
  ```

### NH Hemlock Stand Requirements for Shiro Development
- [ ] Stand age: **>60 years** for established shiro networks
- [ ] Canopy closure: **>70%** to maintain cool, moist understory microclimate
- [ ] Disturbance: **no logging within 15 years** — shiro networks are easily disrupted
- [ ] Add `habitatRequirements.shiroConditions` object:
  ```js
  shiroConditions: {
    minimumStandAge: 60,        // years
    canopyClosure: 0.70,        // 70% minimum
    disturbanceFreeYears: 15,
    hostDensityPerAcre: 30      // mature hemlocks per acre minimum
  }
  ```

### pH Validation
- [ ] Verify Kurokochi & Lian 2018 pH 4.5-5.5 against NH hemlock stand soil surveys
  - NH hemlock stands: typically pH 4.3-5.2 (slightly more acidic than Japan baseline)
  - Consider updating to pH 4.3-5.2 NH-specific range

### County-Specific NH Context
- [ ] Best NH matsutake counties: Grafton (White Mtn hemlock), Carroll (Ossipee Plains pine), Coos (boreal edge)
- [ ] Document in `nhNotes` field

## Research Sources
- Ogawa (1978) — Ecology of Tricholoma matsutake in Japan
- Dunham et al. (2003) — Characteristics of matsutake and associated soils
- Smith & Trappe (1972) — The ectomycorrhizal fungus Amanita ponderosa
- USDA Forest Service — Eastern Hemlock ecology in New England

## Files
- `src/modules/species.js` — matsutake entry (lines 1372-1443)
- `src/modules/mapCalculations.js` — update matsutake probability multiplier once data added

## Acceptance Criteria
- `soilComposition` field added with texture, drainage, organic matter
- `habitatRequirements.shiroConditions` added with stand age, canopy, disturbance thresholds
- NH-specific hemlock stand context documented
- pH range validated/updated
- `npm test` passes
BODY
)" > /dev/null && echo "  [ok] B16: Matsutake shiro soil conditions"

# Issue B17 — Morel soil type mapping
gh issue create --repo "$REPO" \
  --title "Morel: Granular soil type mapping and county-level pH integration for NH" \
  --label "research,data-quality,probability-engine" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Significantly expand morel soil data in `src/modules/species.js` and update `mapCalculations.js` to reflect NH's complex morel habitat — particularly the contrast between granite highlands (poor) and Connecticut River valley (excellent).

## Current State
- Has Mihail 2014 data: pH 6.0-7.5, optimal 6.5
- NH challenge already noted: "NH granite soils often pH <6.0 making state 'morel-poor'"
- Only pH data; no soil texture, no county-specific data, no floodplain bonus

## Data to Add

### Soil Composition Requirements
- [ ] Add `soilComposition` field:
  ```js
  soilComposition: {
    preferredTexture: 'loam',       // silty-loam or loam strongly preferred
    avoidTexture: 'clay,sandy',     // clay = waterlogged; sandy = pH too low and drains too fast
    organicMatter: 'moderate-high', // mull humus from deciduous leaf litter
    drainage: 'moderate'            // moist but not saturated
  }
  ```

### Floodplain / Alluvial Bonus
- [ ] Floodplain soils (alluvial deposits) have:
  - pH naturally buffered to 6.0-7.0 by calcium from upland geology
  - Silt/loam texture from annual flood deposition
  - This is why CT River valley is NH's best morel region
- [ ] Add `habitatModifiers.floodplain` bonus factor: 1.4x probability

### NH County Soil Profile
- [ ] Add county-specific data from USDA NRCS Web Soil Survey:
  ```js
  nhCountySoilProfile: {
    'Sullivan':     { avgPH: 6.0, texture: 'silt-loam', morelSuitability: 'high' },
    'Cheshire':     { avgPH: 6.1, texture: 'silt-loam', morelSuitability: 'high' },
    'Hillsborough': { avgPH: 5.6, texture: 'loam',      morelSuitability: 'moderate' },
    'Grafton':      { avgPH: 5.0, texture: 'loam',      morelSuitability: 'low-moderate' },
    'Belknap':      { avgPH: 5.3, texture: 'loam',      morelSuitability: 'low' },
    'Merrimack':    { avgPH: 5.5, texture: 'loam',      morelSuitability: 'low' },
    'Rockingham':   { avgPH: 5.8, texture: 'sandy-loam', morelSuitability: 'low' },
    'Strafford':    { avgPH: 5.7, texture: 'loam',      morelSuitability: 'low' },
    'Carroll':      { avgPH: 5.1, texture: 'sandy-loam', morelSuitability: 'very-low' },
    'Coos':         { avgPH: 4.8, texture: 'sandy-loam', morelSuitability: 'very-low' }
  }
  ```

### Fire Morel Habitat
- [ ] Document fire morel (post-burn) habitat: morels fruit prolifically 1-2 years post-wildfire
  - In NH context: rare but does occur; note the 2023 White Mountains fire areas
  - Add `habitatModifiers.recentBurn` multiplier: 2.0x for 1-2 years post-burn

### mapCalculations.js Updates
- [ ] Remove hardcoded morel 0.9× granite penalty (line ~129) — now handled by county pH lookup
- [ ] Add CT River valley county bonus (Sullivan + Cheshire): 1.35× multiplier
- [ ] Integrate `nhCountySoilProfile` into probability calculation
- [ ] Validate against iNaturalist NH morel observations (infrastructure exists in `iNaturalistIntegration.js`)

## Research Sources
- Mihail (2014) — Morel biology and cultivation
- Pilz et al. (2004) — Ecology and management of morel harvesting
- USDA NRCS Web Soil Survey — NH county soil data (websoilsurvey.sc.egov.usda.gov)
- iNaturalist — NH morel observations for validation

## Files
- `src/modules/species.js` — morel entry (lines 7-81)
- `src/modules/mapCalculations.js` — update morel-specific probability factors
- `tests/unit/mapCalculations.test.js` — add county-morel probability tests

## Acceptance Criteria
- `soilComposition` and `nhCountySoilProfile` fields added
- Fire morel habitat documented
- mapCalculations.js updated: CT River valley bonus implemented
- Sullivan + Cheshire morel probabilities measurably higher than Coos + Carroll
- `npm test` passes
BODY
)" > /dev/null && echo "  [ok] B17: Morel soil type mapping"

echo ""

# =============================================================================
# STEP 5: Issues — GROUP C: CI/CD & Technical Debt
# =============================================================================
echo "--- Creating Group C: CI/CD Issues ---"

gh issue create --repo "$REPO" \
  --title "Set up ESLint configuration and integrate into CI/CD workflow" \
  --label "technical-debt,infrastructure" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Configure ESLint for the project and integrate it into the GitHub Actions CI workflow.
The CI workflow in `.github/workflows/test.yml` already has a commented-out linting step.

## Current State
- `.github/workflows/test.yml` has a placeholder/commented ESLint step
- No `.eslintrc.json` or `.eslintrc.js` exists in the project
- No `lint` script in `package.json`

## Implementation Steps
- [ ] Create `.eslintrc.json` with rules appropriate for vanilla ES6 browser code:
  ```json
  {
    "env": { "browser": true, "es2022": true },
    "parserOptions": { "ecmaVersion": 2022, "sourceType": "module" },
    "rules": {
      "no-unused-vars": "warn",
      "no-console": "off",
      "semi": ["error", "always"],
      "prefer-const": "warn"
    }
  }
  ```
- [ ] Add to `package.json`: `"lint": "eslint src/ app.js"`
- [ ] Add `eslint` as devDependency: `npm install --save-dev eslint`
- [ ] Uncomment/update the ESLint step in `.github/workflows/test.yml`
- [ ] Fix any linting errors across `src/modules/*.js` and `app.js`
- [ ] Ensure lint runs on all 3 Node versions (18.x, 20.x, 22.x)

## Files
- `.github/workflows/test.yml` — uncomment ESLint step
- `.eslintrc.json` — create new
- `package.json` — add lint script and eslint devDependency

## Acceptance Criteria
- `npm run lint` runs without errors
- CI workflow passes lint step on all 3 Node versions
- No existing test breakage
BODY
)" > /dev/null && echo "  [ok] C18: ESLint setup"

gh issue create --repo "$REPO" \
  --title "Enable Codecov coverage tracking and add badge to README" \
  --label "technical-debt,infrastructure,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Enable the Codecov integration that is currently commented out in `.github/workflows/test.yml`.

## Current State
- Coverage is generated by `npm run test:coverage` using Vitest
- Codecov upload step is commented out in the CI workflow
- No badge in `README.md`

## Implementation Steps
- [ ] Register the project at [codecov.io](https://codecov.io)
- [ ] Add `CODECOV_TOKEN` to GitHub repository Secrets (Settings → Secrets → Actions)
- [ ] Uncomment the Codecov upload step in `.github/workflows/test.yml`
- [ ] Add coverage badge to `README.md`: `[![codecov](https://codecov.io/gh/ibelanger/GraniteFungiForager/badge.svg)](https://codecov.io/gh/ibelanger/GraniteFungiForager)`

## Files
- `.github/workflows/test.yml` — uncomment Codecov step
- `README.md` — add badge

## Acceptance Criteria
- Codecov badge appears in README
- Coverage report uploaded on each push to main/PR
- This is a **good-first-issue** for a new contributor
BODY
)" > /dev/null && echo "  [ok] C19: Codecov integration"

echo ""

# =============================================================================
# STEP 6: Issues — GROUP D: UI/UX
# =============================================================================
echo "--- Creating Group D: UI/UX Issues ---"

gh issue create --repo "$REPO" \
  --title "Unify UI consistency between species card and county details modal" \
  --label "ui-ux,enhancement,good-first-issue" \
  --milestone "$M360" \
  --body "$(cat <<'BODY'
## Goal
Standardize the visual design between the species card and county details modal components.
This is noted in `CHANGELOG.md` as an unreleased improvement.

## Issues to Fix
- [ ] **Colors**: Audit colors used in species card (`.species-card`) vs county details modal — standardize to the design system palette in `docs/design-system/`
- [ ] **Emoji usage**: Some views use mushroom emoji (🍄), others don't — pick a consistent convention and apply it
- [ ] **Typography**: Align font sizes, spacing, and header hierarchy between the two components
- [ ] **Probability display**: Ensure probability percentage formatting is consistent (decimal places, color coding)
- [ ] **Mobile**: Verify both components are responsive at viewport < 768px after changes

## Files
- `src/styles.css` — main styling
- `src/modules/interactions.js` — modal HTML generation (search for `showModal`)
- `docs/design-system/` — reference design tokens

## Testing
- [ ] Visual check in Chrome, Firefox, Safari
- [ ] Mobile check at 375px and 768px viewport widths
- [ ] Run `npm test` to confirm no JS logic regressions

## Acceptance Criteria
- Both components use identical color values for probability levels
- Emoji usage is consistent throughout
- Typography is aligned
- Mobile responsive
BODY
)" > /dev/null && echo "  [ok] D20: UI consistency"

echo ""

# =============================================================================
# STEP 7: Issues — EPIC GROUP E: ML Roadmap
# =============================================================================
echo "--- Creating Epic E: ML Accuracy Roadmap Issues ---"

M370=$(get_milestone_number "v3.7.0 - ML Foundation")

# Issue E21 — Epic: ML Accuracy
EPIC_E=$(gh issue create --repo "$REPO" \
  --title "[Epic] ML accuracy improvement: from ~75% to 85-90% target" \
  --label "epic,ml-roadmap" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Overview
Tracks the full ML accuracy improvement pipeline documented in `ACCURACY_IMPROVEMENT_PLAN.md`.

**Current accuracy**: ~72-77% (estimated from algorithm design)
**Target**: 85-90% (ML-enhanced predictions)

**Infrastructure already built** in:
- `src/modules/foragingReports.js` — user report collection
- `src/modules/iNaturalistIntegration.js` — iNaturalist data integration
- `src/ml/accuracy-improvement-pipeline.js` — ML pipeline scaffold

**What's needed**: User data accumulation + model training + validation

## Phases
- [ ] #<!-- ml-short --> Short-term: Validate algorithm factors with real user data
- [ ] #<!-- ml-medium --> Medium-term: Train first ML model, A/B test vs algorithm

## Success Metrics
- 500+ foraging reports with outcome data
- ML model trained and A/B tested
- Confidence intervals shown to users
- Accuracy measurably above 80%
BODY
)" 2>&1 | grep -oP '#\d+' | head -1)

echo "  [ok] Epic E created: $EPIC_E"

# Issue E22 — Short-term ML
gh issue create --repo "$REPO" \
  --title "Short-term ML: Validate algorithm probability factors with collected foraging data" \
  --label "ml-roadmap,data-quality" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Goal
Use the first 100+ collected foraging reports to validate (or correct) the existing algorithm's probability factors.

## Tasks
- [ ] Review `foragingReports.js` to confirm all relevant outcome data is being captured (success/fail, exact location, date, conditions)
- [ ] Validate oak proximity impact: does probability improve measurably in oak-associated counties?
- [ ] Correlate precipitation window lengths with species-specific success rates
- [ ] Build an analytics view in the app showing "prediction accuracy by species"
- [ ] Document any algorithm multipliers that should be adjusted based on data
- [ ] Create a feedback loop: update `mapCalculations.js` factors with validated multipliers

## Prerequisite
~100 submitted foraging reports with outcome data (success/failure and conditions)

## Files
- `src/ml/accuracy-improvement-pipeline.js` — analysis utilities
- `src/modules/foragingReports.js` — report data structure
- `src/modules/mapCalculations.js` — factors to validate/update

## Acceptance Criteria
- Analysis conducted on 100+ reports
- At least 3 algorithm factors validated or corrected
- Corrections implemented and tested
BODY
)" > /dev/null && echo "  [ok] E22: Short-term ML validation"

# Issue E23 — Medium-term ML
gh issue create --repo "$REPO" \
  --title "Medium-term ML: Train first model and A/B test vs current algorithm" \
  --label "ml-roadmap,enhancement" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Goal
Train the first ML model using accumulated foraging report data and A/B test it against the current algorithm.

## Prerequisites
- 500+ foraging reports with complete outcome data
- Short-term validation issue completed first

## Tasks
- [ ] Feature engineering for training data:
  - Air temperature, soil temperature, precipitation, season, county
  - Oak coverage, moss coverage, elevation, soil pH, host tree presence
  - Days since last rain, soil moisture estimate
- [ ] Train Random Forest model (initial model choice from `ACCURACY_IMPROVEMENT_PLAN.md`)
- [ ] Evaluate model accuracy on held-out test set (target: >80%)
- [ ] Implement A/B test: 50% users see algorithm predictions, 50% see ML predictions
- [ ] Add confidence intervals to probability display (both models)
- [ ] Integrate elevation-based phenological delays into calculations (data exists in species.js but unused)
- [ ] After A/B test: if ML wins, migrate all users to ML model

## Files
- `src/ml/accuracy-improvement-pipeline.js` — expand with training and inference code
- `src/modules/interactions.js` — add confidence interval display
- `src/modules/mapCalculations.js` — add elevation phenological delay

## Acceptance Criteria
- ML model trained with >80% accuracy on test set
- A/B test implemented and collecting data
- Confidence intervals visible in UI
BODY
)" > /dev/null && echo "  [ok] E23: Medium-term ML model"

echo ""

# =============================================================================
# STEP 8: Issues — GROUP F, G, H: Offline, Expert Validation, Testing
# =============================================================================
echo "--- Creating Groups F, G, H: Infrastructure Issues ---"

# Issue F24 — Offline v3.6.0
gh issue create --repo "$REPO" \
  --title "Offline capability v3.6.0 enhancements: quota management, sync indicator, manual sync" \
  --label "infrastructure,enhancement" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Goal
Implement the v3.6.0 offline enhancements documented in `.claude/skills/offline-guide.md`.

## Tasks
- [ ] **Quota management**: Alert user when IndexedDB storage >80% full (currently no quota tracking)
  - Check quota with `navigator.storage.estimate()`
  - Show toast warning when approaching limit
- [ ] **Sync status indicator**: Show count of pending (unsynced) foraging reports in UI header
  - Pull count from IndexedDB queue
  - Update dynamically when online status changes
- [ ] **Manual sync button**: Allow user to trigger sync on demand (don't wait for auto-sync)
  - Add button to header or settings panel
  - Show spinner during sync, success/fail toast after
- [ ] **Offline badge**: Persistent visual indicator when in offline mode
  - Small banner or icon in corner; dismiss-able but re-appears when offline
- [ ] **Service worker cache version**: Update `CACHE_VERSION` in `sw.js` after any changes to force refresh

## Files
- `sw.js` — quota management, cache version update
- `src/modules/interactions.js` — sync indicator, manual sync button, offline badge UI
- `src/styles.css` — styles for new UI elements

## Acceptance Criteria
- Quota warning appears at 80% IndexedDB usage
- Sync status shows pending report count
- Manual sync button works and shows feedback
- Offline badge visible when navigator.onLine is false
- `npm test` passes
BODY
)" > /dev/null && echo "  [ok] F24: Offline enhancements"

# Issue G25 — Expert Validation Partnerships
gh issue create --repo "$REPO" \
  --title "Establish expert validation partnerships for species data accuracy" \
  --label "research,enhancement" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Goal
Establish formal expert review of the species data in `species.js`. Currently 0/29 species have been reviewed by a credentialed mycologist. Per `ACCURACY_IMPROVEMENT_PLAN.md`, expert validation is a key pathway to 85-90% accuracy.

## Tasks
- [ ] Draft an outreach email to the **NH Mycological Society** requesting volunteer expert review of probability multipliers and species data
- [ ] Contact **DHHS NH** food safety inspectors to review identification notes for all 29 Tier 1 species (critical for safety accuracy)
- [ ] Identify academic mycologist contacts at **UNH** (Department of Biological Sciences) or **Plymouth State** for formal collaboration
- [ ] Create a structured **Expert Review Template** (Google Form or GitHub Issue template) covering:
  - Species name, reviewer credentials
  - Probability multiplier accuracy (1-5 scale)
  - Missing ecological factors
  - Source recommendations
  - Overall confidence rating
- [ ] Document any corrections from expert review as follow-up GitHub issues
- [ ] Add "Expert Reviewed" badge/flag to species entries that have been validated

## Success Metrics
- At least 5 of 29 species reviewed by an expert
- DHHS safety review completed for identification notes
- At least one formal academic collaboration established

## Acceptance Criteria
- Expert Review Template created
- Outreach documented (even if no responses yet)
- Any corrections implemented in `species.js`
BODY
)" > /dev/null && echo "  [ok] G25: Expert validation partnerships"

# Issue H26 — Integration Tests
gh issue create --repo "$REPO" \
  --title "Add integration tests and automated offline mode testing (Playwright + MSW)" \
  --label "infrastructure,technical-debt" \
  --milestone "$M370" \
  --body "$(cat <<'BODY'
## Goal
Add integration tests as referenced in `tests/README.md` ("coming soon"). Unit tests cover individual module logic; integration tests verify the full data flow and offline scenarios end-to-end.

## Tasks

### Setup
- [ ] Add Playwright as a devDependency: `npm install --save-dev playwright @playwright/test`
- [ ] Add MSW (Mock Service Worker) for API mocking: `npm install --save-dev msw`
- [ ] Create `tests/integration/` directory
- [ ] Add `test:integration` script to `package.json`
- [ ] Add integration test job to `.github/workflows/test.yml` (separate from unit tests)

### Integration Tests to Write
- [ ] **Full data flow**: species selection → Open-Meteo weather fetch (mocked via MSW) → probability calculation → SVG map update
- [ ] **Offline mode**: navigator.onLine = false → foraging report submitted → queued in IndexedDB → sync triggered when online
- [ ] **iNaturalist integration**: iNaturalist API fetch (mocked) → species observation data displayed in county modal
- [ ] **Authentication flow**: unauthenticated → location data hidden → login → location data revealed
- [ ] **Service worker**: page load → SW registered → static assets cached → offline page served from cache

### Notes
- Use Playwright's `page.route()` for API mocking (simpler than MSW for Playwright context)
- Tests should run against `npm run dev` (localhost:8000)
- CI integration tests should use Playwright's headless mode

## Files
- `tests/integration/` — new directory with test files
- `package.json` — add test:integration script
- `.github/workflows/test.yml` — add integration test job

## Acceptance Criteria
- 5+ integration tests written and passing
- Offline scenario test works (IndexedDB queue verified)
- Integration tests run in CI on push to main/PR
BODY
)" > /dev/null && echo "  [ok] H26: Integration tests"

echo ""
echo "=== All issues created! ==="
echo ""
echo "Next steps:"
echo "1. Visit https://github.com/$REPO/issues to review all issues"
echo "2. Update Epic A ($EPIC_A) body to reference actual child issue numbers"
echo "3. Update Epic B ($EPIC_B) body to reference actual child issue numbers"
echo "4. Update Epic E ($EPIC_E) body to reference actual child issue numbers"
echo "5. Use milestone view to confirm v3.6.0 (~20 issues) and v3.7.0 (~6 issues)"
echo ""
echo "Milestones:"
echo "  v3.6.0 - Research Complete: species research + soil pH + CI/CD + UI"
echo "  v3.7.0 - ML Foundation:     ML model + offline + expert validation + integration tests"
