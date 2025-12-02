/**
 * Vitest Global Setup
 * Runs before each test file
 */

import { beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage for tests that use it
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

// Setup global mocks before each test
beforeEach(() => {
  // Reset localStorage mock
  global.localStorage = localStorageMock;
  localStorageMock.clear();

  // Mock window.location if needed
  delete window.location;
  window.location = { href: 'http://localhost:8000' };

  // Mock fetch for API calls (individual tests can override)
  global.fetch = vi.fn();

  // Mock console methods to reduce noise (tests can restore if needed)
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks();
  vi.restoreAllMocks();

  // Clear localStorage
  localStorageMock.clear();

  // Clear any timers
  vi.clearAllTimers();
});
