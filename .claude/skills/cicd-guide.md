---
name: cicd-guide
description: Complete CI/CD pipeline documentation for GitHub Actions workflows, deployment, and troubleshooting build failures
triggers:
  - CI/CD
  - GitHub Actions
  - pipeline
  - deploy
  - deployment
  - workflow
  - build failing
  - test workflow
  - continuous integration
  - gh-pages
  - status badge
---

# CI/CD Pipeline Guide - GraniteFungiForager

## GitHub Actions Workflows

### Test Workflow (`.github/workflows/test.yml`)

The test workflow ensures code quality through automated testing on every push and pull request.

#### Triggers
- **Push to:** `main`, `develop`, or `claude/**` branches
- **Pull requests to:** `main` or `develop` branches

#### Jobs

##### 1. test - Matrix Testing Across Node.js Versions

**Strategy:** Tests on Node 18.x, 20.x, and 22.x

**Steps:**
1. Checkout code
2. Setup Node.js with npm caching
3. Install dependencies (`npm ci`)
4. Run test suite (`npm test`)
5. Generate coverage report (Node 20.x only)
6. Upload coverage artifacts (30-day retention)

**Test Results:** 470 tests (468 passing, 2 skipped)
**Duration:** ~5 seconds

##### 2. lint-check - Code Quality Validation

- Validates package.json structure
- **Future:** ESLint integration (commented out, ready to enable)
- **Future:** Prettier formatting checks

##### 3. dependency-audit - Security Scanning

- Runs `npm audit` at moderate+ severity level
- Checks for outdated dependencies (informational)
- Continues on error to avoid blocking on non-critical issues

##### 4. test-summary - Results Aggregation

- **Depends on:** test, lint-check, dependency-audit
- Reports pass/fail status for each job
- Fails pipeline if critical tests fail
- Blocks merge if required checks don't pass

#### Coverage Reports

- **Generated on:** Node.js 20.x only
- **Formats:** text, HTML, LCOV, JSON
- **Access:** Download from Actions → Workflow run → Artifacts
- **Retention:** 30 days

### Deploy Workflow (`.github/workflows/deploy.yml`)

#### Configuration
- **Trigger:** Push to `main` branch
- **Target:** GitHub Pages (https://ibelanger.github.io/GraniteFungiForager/)
- **Process:**
  - Checkout code
  - Deploy to gh-pages branch
  - Jekyll disabled (.nojekyll file)
- **Result:** Zero-downtime automated deployment

#### Deployment Steps

1. Code pushed to `main` branch
2. GitHub Actions triggers deploy workflow
3. Workflow checks out code
4. Deploys to `gh-pages` branch
5. GitHub Pages serves updated site
6. Live site updates within 1-2 minutes

## Status Badges

The README displays live build status:
```markdown
[![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)]
```

### Badge States
- 🟢 **Passing** - All tests passed
- 🔴 **Failing** - One or more tests failed
- 🟡 **In Progress** - Tests currently running

## Local Testing Before Push

**Run tests locally to catch issues early:**

```bash
# Run all tests
npm test                  # 470 tests in ~5 seconds

# Watch mode (re-run on changes)
npm run test:watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## Pull Request Requirements

For a PR to be merged:
1. ✅ All 470 tests must pass
2. ✅ Lint checks must pass
3. ✅ No critical security vulnerabilities
4. ✅ Code review approval
5. 📊 Coverage should not decrease (recommended)

## Troubleshooting CI Failures

### Test Failures in CI but Pass Locally

**Common Causes:**
1. **Node version mismatch:** Check Node version matches CI (18.x, 20.x, or 22.x)
2. **Dependency issues:** Clear and reinstall: `rm -rf node_modules && npm ci`
3. **Environment-specific code:** Check for timezone, file path, or platform differences
4. **Review logs:** Check detailed logs in GitHub Actions

### Common Issues

#### Date/Time Tests
- **Problem:** Tests pass locally but fail in CI due to timezone differences
- **Solution:** Use fixed dates in tests, mock `Date.now()`, or use UTC

#### File Paths
- **Problem:** Path separators differ on Windows (`\`) vs Linux (`/`)
- **Solution:** Use `path.join()` or normalize paths in tests

#### Async Behavior
- **Problem:** Different Node versions handle async differently
- **Solution:** Use `await` properly, add timeouts for race conditions

#### Caching Issues
- **Problem:** npm cache causes stale dependencies
- **Solution:** Clear cache in workflow or use `npm ci` instead of `npm install`

### Debugging Workflow Failures

#### View Detailed Logs

1. Go to GitHub Actions tab
2. Click on failing workflow run
3. Click on failed job
4. Expand failed step to see logs
5. Look for error messages and stack traces

#### Download Artifacts

1. Go to workflow run summary
2. Scroll to "Artifacts" section
3. Download coverage reports or logs
4. Inspect locally for detailed analysis

#### Re-run Failed Jobs

1. Click "Re-run jobs" button on workflow run
2. Select "Re-run failed jobs" or "Re-run all jobs"
3. Check if failure is consistent or intermittent

## Development Best Practices

### Before Committing

1. **Run tests locally:** `npm test`
2. **Check coverage:** `npm run test:coverage`
3. **Verify no linting errors** (when ESLint is enabled)
4. **Review changed files:** `git status`
5. **Test in browser:** `npm run dev` and manual testing

### CI Optimization

- **Workflow uses npm caching:** 30-60s speedup on builds
- **Matrix strategy with `fail-fast: false`:** Continues testing all Node versions
- **Parallel job execution:** test, lint-check, dependency-audit run concurrently
- **Artifact retention:** 30 days for coverage reports

### Multi-Version Node.js Compatibility

The project tests on 3 Node.js versions to ensure compatibility:
- **Node 18.x** - LTS minimum supported version
- **Node 20.x** - Current LTS (coverage generated here)
- **Node 22.x** - Latest stable

**Why multiple versions?**
- Different async/await behavior
- Different module resolution
- Different API availability
- Ensures broad compatibility

## Workflow Configuration Files

### Test Workflow Location
`.github/workflows/test.yml`

**Key Configuration:**
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
  fail-fast: false
```

### Deploy Workflow Location
`.github/workflows/deploy.yml`

**Key Configuration:**
```yaml
on:
  push:
    branches: [ main ]
```

## Security & Audit

### npm audit

Runs automatically on every push and PR:
```bash
npm audit --audit-level=moderate
```

**Severity Levels:**
- **Critical:** Blocks merge
- **High:** Blocks merge
- **Moderate:** Warning only
- **Low:** Informational

### Dependency Updates

Check for outdated dependencies:
```bash
npm outdated
```

Update dependencies:
```bash
npm update
```

For major version updates, review breaking changes first.

## Deployment

### GitHub Pages Setup

1. **Repository Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `root`
4. **Custom domain:** (optional)

### Deployment Verification

After deployment:
1. Visit https://ibelanger.github.io/GraniteFungiForager/
2. Check browser console for errors (F12)
3. Test key features: map interactions, species selection, authentication
4. Verify service worker registration (HTTPS only)

### Rollback Procedure

If deployment breaks production:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main  # Use with caution!
```

## Monitoring & Alerts

### Build Status Monitoring

- **Email notifications:** GitHub sends emails on workflow failures
- **Status badges:** Check README for build status
- **GitHub Actions tab:** View all workflow runs

### Performance Monitoring

Track CI/CD performance:
- Test duration trend (should stay ~5 seconds)
- Deployment time (should stay <2 minutes)
- Artifact upload time
- Cache hit rate

## Quick Reference

### Essential Commands
```bash
# Local testing before push
npm test                  # Run all tests
npm run test:coverage     # Check coverage

# View workflow status
gh run list               # List recent workflow runs
gh run view               # View specific run details
gh run watch              # Watch workflow in real-time

# Manual deployment trigger (if needed)
git push origin main      # Triggers deploy workflow
```

### Workflow Files
- Test workflow: `.github/workflows/test.yml`
- Deploy workflow: `.github/workflows/deploy.yml`
- Status badge: In `README.md`

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Tests fail in CI only | Check Node version, timezone, file paths |
| Slow builds | Check npm cache, optimize test suite |
| Deployment not updating | Clear browser cache, check gh-pages branch |
| Security vulnerabilities | Run `npm audit fix`, review breaking changes |
| Coverage not generating | Verify Node 20.x job, check artifact upload |
