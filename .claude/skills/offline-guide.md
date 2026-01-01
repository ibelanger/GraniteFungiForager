---
name: offline-guide
description: Progressive Web App (PWA) offline capability guide - service worker, caching strategies, IndexedDB queue, background sync for GraniteFungiForager
triggers:
  - offline
  - service worker
  - PWA
  - progressive web app
  - cache
  - IndexedDB
  - background sync
  - offline mode
  - sync reports
  - offline capability
---

# Offline Capability Guide (PWA)

## Overview

**Version Added:** v3.5.2 (January 2026)

GraniteFungiForager implements full Progressive Web App (PWA) offline capability, enabling field use without internet connectivity. The system caches species data, queues foraging reports offline, and automatically syncs when connection is restored.

**Key Features:**
- 📦 **Cached Species Database** - All 29 DHHS Tier 1 species available offline
- 🌐 **Smart Weather Caching** - 5-minute cache with stale-while-revalidate
- 💾 **Offline Report Queue** - IndexedDB stores reports until connection restored
- 🔄 **Background Sync** - Automatic upload when online
- 📱 **Toast Notifications** - User feedback for online/offline state changes

---

## Architecture Overview

### Service Worker (`sw.js`)

**File:** `sw.js` (372 lines)
**Cache Version:** `gff-v3.5.2`

The service worker implements a dual-cache strategy:
1. **Static Cache** (`gff-v3.5.2-static`) - UI assets and species data
2. **Data Cache** (`gff-v3.5.2-data`) - API responses with expiration

**Lifecycle Events:**
```javascript
// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('gff-') &&
              cacheName !== CACHE_NAME &&
              cacheName !== DATA_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
```

---

## Caching Strategies

### 1. Cache-First Strategy (Static Assets)

**Used For:**
- Species database (`src/modules/species.js`)
- UI modules (`src/modules/*.js`)
- Stylesheets (`src/styles.css`)
- HTML (`index.html`)
- Google Fonts

**How It Works:**
```javascript
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Serve from cache immediately
    // Update cache in background
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});

    return cachedResponse;
  }

  // Not in cache - fetch from network
  const response = await fetch(request);
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  return response;
}
```

**Benefits:**
- Instant load times for species data
- App works completely offline once visited
- Background updates keep cache fresh

### 2. Network-First Strategy (API Data)

**Used For:**
- Weather API (Open-Meteo) - 5-minute cache
- iNaturalist API - 24-hour cache

**How It Works:**
```javascript
async function networkFirstStrategy(request, cacheName, maxAge = null) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      // Store with expiration timestamp
      if (maxAge) {
        const headers = new Headers(response.headers);
        headers.set('sw-cache-time', Date.now().toString());

        const cachedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });

        cache.put(request, cachedResponse);
      } else {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    // Network failed - check cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check expiration
      if (maxAge) {
        const cacheTime = cachedResponse.headers.get('sw-cache-time');
        if (cacheTime && (Date.now() - parseInt(cacheTime)) > maxAge) {
          throw new Error('Cached response expired and network unavailable');
        }
      }

      return cachedResponse;
    }

    throw error;
  }
}
```

**Benefits:**
- Fresh weather data when online
- Graceful degradation to cache when offline
- Prevents stale data with expiration checks

---

## IndexedDB Offline Queue

### Database Schema

**Database Name:** `GraniteFungiForagerDB`
**Version:** 1
**Object Store:** `pendingReports`

**Schema:**
```javascript
{
  keyPath: 'id',  // UUID v4
  indexes: {
    'timestamp': { unique: false },
    'synced': { unique: false }
  }
}
```

**Report Structure:**
```javascript
{
  id: "uuid-v4",
  timestamp: "2026-01-01T10:30:00Z",
  species: "morel",
  county: "Grafton",
  success: true,
  confidence: "high",
  weather: {
    temperature: 58,
    soilTemperature: 48,
    precipitation24h: 0.5,
    season: "spring"
  },
  notes: "Found near dead ash tree",
  synced: false,         // Set to true after upload
  queuedAt: 1704106200000,  // Timestamp when queued
  syncedAt: null          // Timestamp when synced
}
```

### Queue Operations

#### 1. Queue Report (Offline)

**Triggered by:** User submits foraging report while offline

```javascript
async function queueReport(report) {
  const db = await openReportsDatabase();
  const transaction = db.transaction([REPORTS_STORE], 'readwrite');
  const store = transaction.objectStore(REPORTS_STORE);

  // Add metadata
  report.synced = false;
  report.queuedAt = Date.now();

  await new Promise((resolve, reject) => {
    const request = store.add(report);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // Register for background sync
  if ('sync' in self.registration) {
    await self.registration.sync.register('sync-foraging-reports');
  }
}
```

#### 2. Retrieve Pending Reports

```javascript
function getAllPendingReports(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REPORTS_STORE], 'readonly');
    const store = transaction.objectStore(REPORTS_STORE);
    const index = store.index('synced');
    const request = index.getAll(false); // Get unsynced only

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}
```

#### 3. Mark as Synced

```javascript
function markReportsAsSynced(db, reportIds) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REPORTS_STORE], 'readwrite');
    const store = transaction.objectStore(REPORTS_STORE);

    const updates = reportIds.map(id => {
      return new Promise((res, rej) => {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const report = getRequest.result;
          if (report) {
            report.synced = true;
            report.syncedAt = Date.now();
            const putRequest = store.put(report);
            putRequest.onsuccess = () => res();
            putRequest.onerror = () => rej(putRequest.error);
          } else {
            res(); // Report not found, skip
          }
        };
        getRequest.onerror = () => rej(getRequest.error);
      });
    });

    Promise.all(updates).then(() => resolve()).catch(reject);
  });
}
```

---

## Background Sync

### Sync Event Handler

**Triggered by:** Connection restored after being offline

```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-foraging-reports') {
    event.waitUntil(syncPendingReports());
  }
});

async function syncPendingReports() {
  const db = await openReportsDatabase();
  const reports = await getAllPendingReports(db);

  if (reports.length === 0) {
    return;
  }

  // Notify client to merge reports into reportsManager
  const clients = await self.clients.matchAll();

  if (clients.length > 0) {
    clients[0].postMessage({
      type: 'SYNC_REPORTS',
      reports: reports
    });

    // Mark reports as synced
    await markReportsAsSynced(db, reports.map(r => r.id));
  }
}
```

### Client-Side Sync Handler (`app.js`)

**Location:** `app.js:155-172`

```javascript
handleServiceWorkerMessage(event) {
  const { data } = event;

  if (data && data.type === 'SYNC_REPORTS') {
    console.log('[App] Received sync reports message from service worker');

    // Merge reports from IndexedDB into reportsManager
    data.reports.forEach((report) => {
      try {
        reportsManager.addReport(report, { skipDuplicateCheck: false });
      } catch (error) {
        console.error('[App] Failed to merge report:', error);
      }
    });

    this.showToast(`✅ Synced ${data.reports.length} offline report(s)`, 'success');
  }
}
```

---

## Online/Offline Event Handlers

### Connection Restored (`app.js:127-142`)

```javascript
handleOnline() {
  console.log('[App] Connection restored');
  this.showToast('📶 Back online - syncing data...', 'success');

  // Trigger service worker sync
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('sync-foraging-reports');
    }).catch((error) => {
      console.error('[App] Background sync registration failed:', error);
    });
  }

  // Resume auto-refresh
  this.setupAutoRefresh();
}
```

### Connection Lost (`app.js:147-150`)

```javascript
handleOffline() {
  console.log('[App] Connection lost');
  this.showToast('📴 Offline mode - reports will sync when reconnected', 'info');
}
```

---

## Toast Notification System

**Location:** `app.js:177-243`

**Features:**
- Color-coded by type (success, info, warning, error)
- Slide-in/slide-out animations
- 4-second auto-dismiss
- Fixed position (top-right corner)
- Non-blocking UI

**Usage:**
```javascript
// Success notification
this.showToast('✅ Synced 3 offline report(s)', 'success');

// Info notification
this.showToast('📴 Offline mode - reports will sync when reconnected', 'info');

// Warning notification
this.showToast('⚠️ Weather data may be outdated', 'warning');

// Error notification
this.showToast('❌ Failed to sync reports', 'error');
```

**Implementation:**
```javascript
showToast(message, type = 'info') {
  // Create container if doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const colors = {
    success: '#27ae60',
    info: '#3498db',
    warning: '#f39c12',
    error: '#e74c3c'
  };

  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-family: 'Newsreader', serif;
    font-size: 0.95rem;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
```

---

## Testing Offline Mode

### Manual Testing Steps

1. **Initial Visit (Online):**
   - Open https://ibelanger.github.io/GraniteFungiForager/
   - Open DevTools → Application → Service Workers
   - Verify service worker registered and activated
   - Check Cache Storage for `gff-v3.5.2-static` and `gff-v3.5.2-data`

2. **Test Offline Species Data:**
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Refresh page
   - **Expected:** Page loads completely, species data visible
   - Select different species → **Expected:** All species info displays

3. **Test Offline Report Queue:**
   - While offline, click county on map
   - Submit foraging report
   - Open DevTools → Application → IndexedDB → GraniteFungiForagerDB
   - **Expected:** Report in `pendingReports` store with `synced: false`

4. **Test Background Sync:**
   - Uncheck "Offline" in DevTools
   - **Expected:** Toast notification "📶 Back online - syncing data..."
   - Wait 2-3 seconds
   - **Expected:** Toast notification "✅ Synced 1 offline report(s)"
   - Check IndexedDB → **Expected:** Report now has `synced: true` and `syncedAt` timestamp

5. **Test Cache Expiration:**
   - Go online
   - Open DevTools → Application → Cache Storage → `gff-v3.5.2-data`
   - Find weather API response
   - Check headers for `sw-cache-time`
   - Wait 6 minutes (weather cache is 5 minutes)
   - Refresh page
   - **Expected:** New network request for weather data

### Automated Testing (Future Work)

**Recommended Tools:**
- **Workbox** - Google's service worker library with testing utilities
- **Playwright** - Browser automation for offline testing
- **MSW (Mock Service Worker)** - API mocking for consistent tests

**Test Scenarios:**
```javascript
describe('Offline Capability', () => {
  test('species data available offline', async () => {
    await page.goto('https://ibelanger.github.io/GraniteFungiForager/');
    await page.context().setOffline(true);
    const speciesCard = await page.locator('.species-card');
    expect(await speciesCard.isVisible()).toBe(true);
  });

  test('reports queue when offline', async () => {
    await page.context().setOffline(true);
    await page.click('#county-grafton');
    await page.fill('#report-notes', 'Found near oak tree');
    await page.click('#submit-report');

    const db = await page.evaluate(() => {
      return indexedDB.databases();
    });
    expect(db.some(d => d.name === 'GraniteFungiForagerDB')).toBe(true);
  });

  test('sync on reconnect', async () => {
    // Queue report offline
    await page.context().setOffline(true);
    await submitReport();

    // Go online
    await page.context().setOffline(false);

    // Wait for sync
    await page.waitForSelector('.toast-success');
    const toast = await page.textContent('.toast-success');
    expect(toast).toContain('Synced');
  });
});
```

---

## Troubleshooting

### Service Worker Not Registering

**Symptoms:** No service worker in DevTools, offline mode doesn't work

**Causes:**
1. **HTTP instead of HTTPS** - Service workers require HTTPS (or localhost)
2. **Browser doesn't support service workers** - Check `'serviceWorker' in navigator`
3. **sw.js file missing or 404** - Verify file exists at `/sw.js`

**Fix:**
```javascript
// app.js:575-581
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service worker registered');
  }).catch((error) => {
    console.log('Service worker registration failed:', error);
  });
}
```

### Reports Not Syncing

**Symptoms:** Reports stuck in IndexedDB with `synced: false`

**Causes:**
1. **Background Sync not supported** - Check `'sync' in ServiceWorkerRegistration.prototype`
2. **Service worker message handler not registered**
3. **reportsManager not imported** - Check `app.js:14`

**Debug Steps:**
```javascript
// Check if sync is supported
if ('sync' in ServiceWorkerRegistration.prototype) {
  console.log('✅ Background Sync supported');
} else {
  console.log('❌ Background Sync not supported - manual sync required');
}

// Check service worker active
navigator.serviceWorker.ready.then((registration) => {
  console.log('✅ Service worker active:', registration.active);
});

// Check message handler
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('📨 Service worker message:', event.data);
});
```

### Stale Cache Data

**Symptoms:** Old species data showing after updates, wrong probability calculations

**Causes:**
1. **Cache version not updated** - Check `sw.js:4` CACHE_VERSION
2. **Old service worker still active** - Check DevTools → Application → Service Workers

**Fix:**
```javascript
// Bump cache version in sw.js
const CACHE_VERSION = 'gff-v3.5.3'; // increment version

// Force update in DevTools
// Application → Service Workers → Update button
// Or: Application → Service Workers → Unregister → Refresh
```

### IndexedDB Quota Exceeded

**Symptoms:** Error "QuotaExceededError" when queuing reports

**Causes:**
- Too many unsynced reports (storage limit ~50MB on mobile)
- Other apps using storage quota

**Fix:**
```javascript
// Implement quota management in future version
async function checkQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const percentUsed = (estimate.usage / estimate.quota) * 100;

    if (percentUsed > 80) {
      console.warn(`⚠️ Storage ${percentUsed.toFixed(1)}% full`);
      // Option 1: Sync immediately
      // Option 2: Delete oldest synced reports
      // Option 3: Alert user
    }
  }
}
```

---

## Browser Support

### Service Workers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 40+ | ✅ Full |
| Firefox | 44+ | ✅ Full |
| Safari | 11.1+ | ✅ Full |
| Edge | 17+ | ✅ Full |
| iOS Safari | 11.3+ | ✅ Full |
| Android Chrome | 40+ | ✅ Full |

### Background Sync

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 49+ | ✅ Full |
| Firefox | ❌ | ⚠️ Not supported (manual sync fallback) |
| Safari | ❌ | ⚠️ Not supported (manual sync fallback) |
| Edge | 79+ | ✅ Full |
| iOS Safari | ❌ | ⚠️ Not supported (manual sync fallback) |

**Fallback Strategy:** If Background Sync not supported, reports remain queued and user must manually trigger sync by refreshing page when online.

### IndexedDB

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 24+ | ✅ Full |
| Firefox | 16+ | ✅ Full |
| Safari | 10+ | ✅ Full |
| Edge | 12+ | ✅ Full |
| iOS Safari | 10+ | ✅ Full |

---

## Performance Considerations

### Cache Size

**Static Cache:**
- HTML: ~15 KB
- CSS: ~45 KB
- JavaScript modules: ~120 KB (8 modules)
- Google Fonts: ~50 KB
- **Total:** ~230 KB

**Data Cache:**
- Weather API responses: ~3 KB each (10 counties = 30 KB)
- iNaturalist API: Variable (1-20 KB per species)
- **Total:** ~50-100 KB

**IndexedDB:**
- Average report: ~500 bytes
- 100 queued reports: ~50 KB

**Total Offline Storage:** ~350 KB (minimal impact on device storage)

### Network Performance

**First Visit (Online):**
1. Load page assets (~230 KB)
2. Service worker registration (~10 KB)
3. Cache static assets (background)
4. Fetch weather data (~30 KB)
5. **Total:** ~270 KB, ~2-3 seconds on 4G

**Return Visit (Online):**
1. Serve from cache (instant)
2. Update cache in background
3. Fetch fresh weather data
4. **Total:** < 1 second load time

**Offline Visit:**
1. Serve from cache (instant)
2. Show stale weather data (with indicator)
3. **Total:** < 500ms load time

---

## Future Enhancements

### Short Term (v3.6.0)
- [ ] **Quota management** - Alert user if storage > 80% full
- [ ] **Sync status indicator** - Show pending report count in UI
- [ ] **Manual sync button** - Allow user to trigger sync without waiting
- [ ] **Offline indicator** - Persistent badge showing offline mode

### Medium Term (v3.7.0)
- [ ] **Workbox integration** - Replace custom service worker with Workbox
- [ ] **Push notifications** - Alert user when sync completes
- [ ] **Selective sync** - Allow user to delete queued reports
- [ ] **Conflict resolution** - Handle duplicate reports gracefully

### Long Term (v4.0.0)
- [ ] **Offline map editing** - Cache county map SVG for offline use
- [ ] **Differential sync** - Only sync changed data
- [ ] **Peer-to-peer sync** - Share reports between nearby devices (WebRTC)
- [ ] **Background fetch** - Download large datasets while offline

---

## Quick Reference

### Check Service Worker Status
```javascript
navigator.serviceWorker.ready.then((registration) => {
  console.log('Active:', registration.active);
  console.log('Waiting:', registration.waiting);
  console.log('Installing:', registration.installing);
});
```

### Check Cache Contents
```javascript
caches.open('gff-v3.5.2-static').then((cache) => {
  cache.keys().then((keys) => {
    console.log('Cached files:', keys.map(k => k.url));
  });
});
```

### Check IndexedDB Reports
```javascript
const request = indexedDB.open('GraniteFungiForagerDB', 1);
request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction(['pendingReports'], 'readonly');
  const store = tx.objectStore('pendingReports');
  const getAll = store.getAll();
  getAll.onsuccess = () => {
    console.log('Queued reports:', getAll.result);
  };
};
```

### Force Service Worker Update
```javascript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    registration.update();
  });
});
```

### Clear All Caches
```javascript
caches.keys().then((keys) => {
  keys.forEach((key) => {
    if (key.startsWith('gff-')) {
      caches.delete(key);
    }
  });
});
```
