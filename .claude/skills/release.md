---
name: release
description: Finalize changes with proper documentation updates before committing or pushing. Use when committing, pushing, updating docs, finalizing releases, or preparing deployments.
triggers:
  - commit
  - push
  - release
  - "git commit"
  - "git push"
  - deploy
  - deployment
  - finalize
  - changelog
  - version bump
  - publish
---

# Release Assistant - GraniteFungiForager

Ensures all administrative documentation is reviewed and updated before committing or pushing changes.

## When to Use This Skill

Trigger this skill when asked to:
- Commit changes
- Push and/or commit
- Update documentation for a release
- Finalize / release changes
- Prepare for deployment
- Create a release or version bump

---

## Administrative Files to Check

Always review these files for necessary updates:

| File | When to Update |
|------|----------------|
| **package.json** `"version"` | Bump on every feature/fix (patch: x.x.X, minor: x.X.0, major: X.0.0) |
| **CHANGELOG.md** | Add `## [x.y.z] - YYYY-MM-DD` entry with Added/Changed/Fixed/Technical Details/Files Modified sections |
| **README.md** | Update version badge in title (`# 🍄 GraniteFungiForager vX.Y.Z`) and "What's New" section if user-facing features changed |
| **CLAUDE.md** | Update version in Project Overview line and Version History table if a new release |
| **sw.js** | Bump `CACHE_NAME` constant (e.g. `gff-v3.5.2`) to match new version — required for service worker cache busting |

### Files That Rarely Need Changes
| File | When to Update |
|------|----------------|
| **package-lock.json** | Auto-updated by `npm install` — never edit manually |
| **.github/workflows/** | Only when changing CI/CD behavior |
| **vitest.config.js** | Only when changing test configuration |

---

## Workflow

### 1. Analyze Changes
```bash
git diff --stat
git status
git diff HEAD
```

### 2. Run Tests
```bash
npm test
```
All tests must pass before committing. Current baseline: **470 tests, 100% pass rate**.
If tests fail, fix them before proceeding — never commit broken tests.

### 3. Review Admin Files
Check each file in the table above. Determine:
- Is this a patch (bug fix, docs, chore), minor (new feature, backwards-compatible), or major (breaking change)?
- What version string changes are needed?
- What CHANGELOG entry is needed?

### 4. Check GitHub Issues
```bash
gh issue list --state open
```
Review if any open issues are resolved by this work. If so:
- Add a comment referencing the commit
- Close the issue with a closing keyword in the commit message (e.g. `closes #42`)

### 5. Report to User
Show the user:
- Which files need updates and why
- Proposed version bump (patch / minor / major)
- Draft CHANGELOG entry
- Any issues that will be closed

**Wait for user confirmation on version bump before proceeding.**

### 6. Update Admin Files
Make all necessary updates:
- `package.json` version
- `CHANGELOG.md` new entry (move items from `[Unreleased]` if applicable)
- `README.md` version in title + "What's New" section
- `CLAUDE.md` version references
- `sw.js` CACHE_NAME constant

### 7. Commit
Use conventional commit format with scope:

```
feat(species): add Lion's Mane research-backed data

closes #42

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Commit type prefixes:**
| Prefix | Use for |
|--------|---------|
| `feat:` | New feature or species data addition |
| `fix:` | Bug fix |
| `docs:` | Documentation only (CHANGELOG, README, skills) |
| `test:` | Adding or fixing tests |
| `style:` | UI/CSS changes, no logic change |
| `refactor:` | Code restructure, no behavior change |
| `chore:` | Maintenance, dependency updates, config |
| `ci:` | GitHub Actions / CI/CD changes |
| `perf:` | Performance improvements |

### 8. Push (if requested)
```bash
git push origin main
```
Confirm with the user before pushing to `main`. Pushes trigger auto-deploy to GitHub Pages.

---

## CHANGELOG Entry Format

Follow the existing Keep a Changelog + Semantic Versioning conventions in this repo:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- **Feature Name** - Description of what was added

### Changed
- **Thing Changed** - What changed and why

### Fixed
- **Bug Fixed** - What was broken and how it was fixed

### Technical Details
- Tests: X/Y passing (100% pass rate maintained)
- Any other technical notes

### Files Modified
- **CREATED:** filename.js (N lines) - purpose
- **MODIFIED:** filename.js (+N/-N lines) - what changed
```

Move relevant items from `## [Unreleased]` into the new version entry.

---

## Version Bump Decision Guide

| Change Type | Bump | Example |
|-------------|------|---------|
| Bug fix, typo, small refactor | **patch** x.x.X | 3.5.2 → 3.5.3 |
| New species data, new feature, new skill | **minor** x.X.0 | 3.5.2 → 3.6.0 |
| New major capability (offline, ML, auth) | **minor** x.X.0 | 3.5.2 → 3.6.0 |
| Breaking change or full architecture overhaul | **major** X.0.0 | 3.5.2 → 4.0.0 |

> This is a client-side app — "breaking change" means the app no longer works the same way for existing users (e.g., cache invalidation strategy changes, removed public API, localStorage schema change).

---

## Important Rules

- NEVER skip the test run (`npm test`) before committing
- NEVER skip the documentation review step
- ALWAYS show the user the proposed changes before making them
- ALWAYS bump `package.json` version and `sw.js` CACHE_NAME together
- If no admin updates are needed, explicitly state that to the user
- Ask for user confirmation before pushing to `main` (triggers live deployment)
- The `main` branch auto-deploys to https://ibelanger.github.io/GraniteFungiForager/ — treat pushes as production releases
