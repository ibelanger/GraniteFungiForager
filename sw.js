// GraniteFungiForager Service Worker
// Provides offline capability for mushroom species data and foraging reports

const CACHE_VERSION = 'gff-v3.5.2';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DATA_CACHE_NAME = `${CACHE_VERSION}-data`;
const WEATHER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/src/styles.css',
  '/src/modules/species.js',
  '/src/modules/weather.js',
  '/src/modules/mapCalculations.js',
  '/src/modules/interactions.js',
  '/src/modules/authentication.js',
  '/src/modules/publicLands.js',
  '/src/modules/foragingReports.js',
  '/src/modules/iNaturalistIntegration.js',
  '/src/modules/speciesMapping.js',
  '/src/modules/observationAnalysis.js',
  '/src/modules/speciesCoverageAudit.js'
];

// IndexedDB configuration for offline foraging reports
const DB_NAME = 'GraniteFungiForagerDB';
const DB_VERSION = 1;
const REPORTS_STORE = 'pendingReports';

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old version caches
            if (cacheName.startsWith('gff-') && cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

/**
 * Fetch event - handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different resource types with appropriate caching strategies

  // Weather API requests - Network first with cache fallback
  if (url.hostname === 'api.open-meteo.com') {
    event.respondWith(networkFirstStrategy(request, DATA_CACHE_NAME, WEATHER_CACHE_DURATION));
    return;
  }

  // iNaturalist API requests - Network first with cache fallback
  if (url.hostname === 'api.inaturalist.org') {
    event.respondWith(networkFirstStrategy(request, DATA_CACHE_NAME, 24 * 60 * 60 * 1000)); // 24hr cache
    return;
  }

  // Google Fonts - Cache first (fonts rarely change)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Static assets - Cache first with network update
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/src/')) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, CACHE_NAME));
});

/**
 * Cache-first strategy: Serve from cache, update in background
 */
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Network error - ignore, we have cache
    });

    return cachedResponse;
  }

  // Not in cache - fetch from network
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    throw error;
  }
}

/**
 * Network-first strategy: Try network, fallback to cache
 */
async function networkFirstStrategy(request, cacheName, maxAge = null) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      // Clone response and add timestamp for cache expiration
      const responseToCache = response.clone();

      if (maxAge) {
        // Store with expiration timestamp
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-time', Date.now().toString());

        const cachedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        });

        cache.put(request, cachedResponse);
      } else {
        cache.put(request, responseToCache);
      }
    }

    return response;
  } catch (error) {
    // Network failed - try cache
    console.log('[Service Worker] Network failed, checking cache...');
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cached response is expired
      if (maxAge) {
        const cacheTime = cachedResponse.headers.get('sw-cache-time');
        if (cacheTime && (Date.now() - parseInt(cacheTime)) > maxAge) {
          console.log('[Service Worker] Cached response expired');
          throw new Error('Cached response expired and network unavailable');
        }
      }

      console.log('[Service Worker] Serving from cache');
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Background Sync - Upload pending foraging reports when back online
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);

  if (event.tag === 'sync-foraging-reports') {
    event.waitUntil(syncPendingReports());
  }
});

/**
 * Sync pending foraging reports to localStorage
 * Note: In a no-backend application, we sync to localStorage instead of server
 */
async function syncPendingReports() {
  console.log('[Service Worker] Syncing pending reports...');

  try {
    const db = await openReportsDatabase();
    const reports = await getAllPendingReports(db);

    console.log(`[Service Worker] Found ${reports.length} pending reports`);

    if (reports.length === 0) {
      return;
    }

    // In a full-stack app, this would POST to server
    // For GraniteFungiForager, we sync to localStorage
    const clients = await self.clients.matchAll();

    if (clients.length > 0) {
      // Notify client to handle sync (client will merge into reportsManager)
      clients[0].postMessage({
        type: 'SYNC_REPORTS',
        reports: reports
      });

      // Mark reports as synced
      await markReportsAsSynced(db, reports.map(r => r.id));

      console.log('[Service Worker] Reports synced successfully');
    }
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error; // Retry later
  }
}

/**
 * Open IndexedDB database for offline reports
 */
function openReportsDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create reports store if it doesn't exist
      if (!db.objectStoreNames.contains(REPORTS_STORE)) {
        const store = db.createObjectStore(REPORTS_STORE, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        console.log('[Service Worker] Created IndexedDB object store');
      }
    };
  });
}

/**
 * Get all pending (unsynced) reports from IndexedDB
 */
function getAllPendingReports(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REPORTS_STORE], 'readonly');
    const store = transaction.objectStore(REPORTS_STORE);
    const index = store.index('synced');
    const request = index.getAll(false); // Get unsynced reports

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Mark reports as synced in IndexedDB
 */
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

    Promise.all(updates)
      .then(() => resolve())
      .catch(reject);
  });
}

/**
 * Message handler - receive commands from client
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'QUEUE_REPORT') {
    // Queue foraging report for offline sync
    event.waitUntil(queueReport(event.data.report));
  }
});

/**
 * Queue a foraging report in IndexedDB for later sync
 */
async function queueReport(report) {
  console.log('[Service Worker] Queuing report for offline sync');

  try {
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

    console.log('[Service Worker] Report queued successfully');

    // Register for background sync
    if ('sync' in self.registration) {
      await self.registration.sync.register('sync-foraging-reports');
    }
  } catch (error) {
    console.error('[Service Worker] Failed to queue report:', error);
    throw error;
  }
}

console.log('[Service Worker] Loaded successfully');
