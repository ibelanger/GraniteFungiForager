# CI/CD Documentation - GraniteFungiForager

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for the GraniteFungiForager project.

## Overview

GraniteFungiForager uses **GitHub Actions** to automatically test code changes, ensuring quality and preventing regressions. The CI/CD pipeline runs on every push and pull request.

## Workflow File

**Location:** `.github/workflows/test.yml`

## Triggers

The CI/CD pipeline runs automatically when:

### Push Events
- Push to `main` branch
- Push to `develop` branch
- Push to any `claude/**` branch (AI-assisted development)

### Pull Request Events
- Pull request opened against `main`
- Pull request opened against `develop`
- Pull request synchronized (new commits pushed)

## Jobs

### 1. Test Job

**Purpose:** Run the test suite across multiple Node.js versions

**Strategy:** Matrix testing on Node.js 18.x, 20.x, and 22.x

**Steps:**
1. **Checkout code** - Downloads repository code
2. **Setup Node.js** - Installs specified Node version with npm caching
3. **Install dependencies** - Runs `npm ci` (clean install)
4. **Run tests** - Executes `npm test` (26 tests via Vitest)
5. **Generate coverage** - Creates coverage report (Node 20.x only)
6. **Upload artifacts** - Saves coverage reports for 30 days

**Test Results:**
```bash
✓ tests/unit/weather.test.js (26 tests)
  ✓ calculateSoilTemp (13 tests)
  ✓ getCurrentSeason (5 tests)
  ✓ countyTowns (4 tests)
  ✓ currentWeatherData (2 tests)
  ✓ getWeatherData (2 tests)

Test Files  1 passed (1)
Tests       26 passed (26)
Duration    ~3s
```

### 2. Lint Check Job

**Purpose:** Validate code style and structure

**Steps:**
1. **Checkout code**
2. **Setup Node.js 20.x**
3. **Install dependencies**
4. **Validate package.json** - Ensures valid JSON structure

**Future Enhancements:**
- ESLint integration (commented out, ready to enable)
- Prettier formatting checks
- JavaScript/CSS linting

### 3. Security Audit Job

**Purpose:** Check for known vulnerabilities in dependencies

**Steps:**
1. **Checkout code**
2. **Setup Node.js 20.x**
3. **Run npm audit** - Checks for security vulnerabilities (moderate+ level)
4. **Check outdated deps** - Lists outdated packages (informational)

**Note:** This job continues on error to avoid blocking on non-critical issues

### 4. Test Summary Job

**Purpose:** Aggregate results and provide final status

**Depends On:** test, lint-check, dependency-audit

**Steps:**
1. **Check all job results**
2. **Report status** - Displays pass/fail for each job
3. **Fail if tests failed** - Blocks merge if critical tests fail

## Coverage Reports

Coverage reports are generated on Node.js 20.x and include:

- **Text report** - Console output with line/branch/function coverage
- **HTML report** - Interactive web-based coverage viewer
- **LCOV report** - Machine-readable format for tools like Codecov
- **JSON report** - Programmatic access to coverage data

**Accessing Coverage:**
1. Go to Actions tab on GitHub
2. Click on a workflow run
3. Download "coverage-report" artifact
4. Open `coverage/index.html` in browser

## Status Badges

The README displays a live status badge:

```markdown
[![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml)
```

**Badge States:**
- 🟢 **Passing** - All tests passed
- 🔴 **Failing** - One or more tests failed
- 🟡 **In Progress** - Tests currently running

## Local Development

**Before pushing code, run tests locally:**

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with interactive UI
npm run test:ui
```

## Pull Request Requirements

For a PR to be merged:

1. ✅ All tests must pass (26/26)
2. ✅ Lint checks must pass
3. ✅ No critical security vulnerabilities
4. ✅ Code review approval
5. 📊 Coverage should not decrease (recommended)

## Troubleshooting

### Test Failures

**If tests fail in CI but pass locally:**

1. Check Node version matches CI (18.x, 20.x, or 22.x)
2. Clear node_modules and reinstall: `rm -rf node_modules && npm ci`
3. Check for environment-specific code (timezones, file paths)
4. Review test output in GitHub Actions logs

**Common Issues:**
- Date/time tests may fail due to timezone differences
- File path separators differ on Windows vs Linux
- Node version differences in async behavior

### Coverage Report Missing

Coverage is only generated on Node 20.x:
- Check the "Test on Node 20.x" job
- Download artifacts from the workflow summary page
- Coverage artifacts expire after 30 days

### Dependency Audit Warnings

The audit job may warn about vulnerabilities:
- Review the specific packages flagged
- Check if they're dev dependencies (lower risk)
- Update with `npm update` or `npm audit fix`
- For critical issues, consider replacing dependencies

## Future Enhancements

### Planned Additions

1. **ESLint Integration**
   - Uncomment ESLint step in lint-check job
   - Add `.eslintrc.js` configuration
   - Run: `npm run lint`

2. **Codecov Integration**
   - Uncomment Codecov upload step
   - Add CODECOV_TOKEN secret to repository
   - Get coverage trends and PR comparisons

3. **Deployment Automation**
   - Auto-deploy to GitHub Pages on main branch push
   - Deployment previews for pull requests
   - Automated versioning and release notes

4. **Performance Testing**
   - Lighthouse CI for performance metrics
   - Bundle size tracking
   - Load time regression detection

5. **E2E Testing**
   - Playwright or Cypress integration
   - Full user flow testing
   - Visual regression testing

## Workflow Optimization

### Caching

The workflow uses npm caching to speed up builds:
- `cache: 'npm'` in setup-node action
- Caches `~/.npm` directory
- Reuses dependencies between runs

**Average Speedup:** 30-60 seconds per run

### Matrix Strategy

Testing on multiple Node versions:
- **Node 18.x** - LTS maintenance mode
- **Node 20.x** - Current LTS (primary)
- **Node 22.x** - Latest stable

**fail-fast: false** - Tests continue even if one version fails

## Monitoring

### GitHub Actions Dashboard

View workflow runs:
1. Go to repository → Actions tab
2. See recent runs, status, duration
3. Click run for detailed logs
4. Download artifacts (coverage reports)

### Email Notifications

GitHub sends email notifications for:
- Failed workflow runs
- Fixed workflow runs (after previous failure)

**Configure:** Settings → Notifications → Actions

## Security Considerations

### Secrets Management

No secrets are currently used in workflows.

**If adding secrets:**
1. Repository Settings → Secrets and variables → Actions
2. Add secret (e.g., CODECOV_TOKEN)
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

### Permissions

Workflow uses default permissions:
- **Read** repository contents
- **Write** to pull request comments (for test results)

**GITHUB_TOKEN** is automatically provided with scoped permissions.

## Cost & Limits

**GitHub Actions is free for public repositories** ✅

**Limits for free tier:**
- 2,000 minutes/month for private repos (N/A for public)
- 500 MB artifact storage
- Unlimited workflow runs for public repos

**Current Usage:**
- ~3 seconds per test run
- ~100 KB coverage artifacts
- Well within limits

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [npm ci vs npm install](https://docs.npmjs.com/cli/v8/commands/npm-ci)
- [Codecov GitHub Action](https://github.com/codecov/codecov-action)

## Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check `tests/README.md` for testing details
4. Open an issue with `ci-cd` label

---

**Last Updated:** 2025-11-29
**Workflow Version:** 1.0.0
**Maintained By:** GraniteFungiForager Team
