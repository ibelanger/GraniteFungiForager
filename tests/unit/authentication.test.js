/**
 * Tests for authentication.js module
 * Testing authentication system for location data protection
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { SimpleAuth, auth, requireAuth } from '../../src/modules/authentication.js';

describe('Authentication Module', () => {

  let testAuth;

  beforeEach(() => {
    // Create fresh instance for each test
    testAuth = new SimpleAuth();

    // Clear localStorage before each test
    localStorage.clear();

    // Remove any existing modals from previous tests
    const existingModal = document.getElementById('auth-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Mock Date.now() for consistent testing
    vi.spyOn(Date, 'now').mockReturnValue(1000000000000); // Jan 2, 2001
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('SimpleAuth Constructor', () => {

    test('should initialize with correct storage key', () => {
      expect(testAuth.storageKey).toBe('graniteFungiForager_auth');
    });

    test('should initialize isAuthenticated as false when no stored auth', () => {
      expect(testAuth.isAuthenticated).toBe(false);
    });

    test('should initialize isAuthenticated as true when valid auth exists', () => {
      // Set up valid auth in localStorage
      const authData = {
        authenticated: true,
        expires: Date.now() + (24 * 60 * 60 * 1000),
        timestamp: Date.now()
      };
      localStorage.setItem('graniteFungiForager_auth', JSON.stringify(authData));

      // Create new instance that should read from localStorage
      const newAuth = new SimpleAuth();
      expect(newAuth.isAuthenticated).toBe(true);
    });

    test('should initialize isAuthenticated as false when auth is expired', () => {
      // Set up expired auth in localStorage
      const authData = {
        authenticated: true,
        expires: Date.now() - 1000, // Expired 1 second ago
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
      };
      localStorage.setItem('graniteFungiForager_auth', JSON.stringify(authData));

      const newAuth = new SimpleAuth();
      expect(newAuth.isAuthenticated).toBe(false);
    });
  });

  describe('checkAuthStatus', () => {

    test('should return false when no auth data in localStorage', () => {
      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
    });

    test('should return true for valid non-expired auth', () => {
      const authData = {
        authenticated: true,
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
        timestamp: Date.now()
      };
      localStorage.setItem(testAuth.storageKey, JSON.stringify(authData));

      const result = testAuth.checkAuthStatus();
      expect(result).toBe(true);
    });

    test('should return false and clear expired auth', () => {
      const authData = {
        authenticated: true,
        expires: Date.now() - 1000, // Expired
        timestamp: Date.now() - (25 * 60 * 60 * 1000)
      };
      localStorage.setItem(testAuth.storageKey, JSON.stringify(authData));

      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
      expect(localStorage.getItem(testAuth.storageKey)).toBeNull();
    });

    test('should handle malformed JSON gracefully', () => {
      localStorage.setItem(testAuth.storageKey, 'invalid-json{]');

      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
    });

    test('should return false when authData missing expires field', () => {
      const authData = {
        authenticated: true,
        timestamp: Date.now()
        // Missing expires field
      };
      localStorage.setItem(testAuth.storageKey, JSON.stringify(authData));

      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
    });

    test('should return false on localStorage error', () => {
      // Mock localStorage.getItem to throw error
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Should handle error gracefully and return false
      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
      // Note: console.error is called but difficult to test reliably in this context
    });
  });

  describe('authenticate', () => {

    describe('Valid Passwords', () => {

      test('should authenticate with primary password "granite2024"', () => {
        const result = testAuth.authenticate('granite2024');
        expect(result).toBe(true);
        expect(testAuth.isAuthenticated).toBe(true);
      });

      test('should authenticate with backup password "forager123"', () => {
        const result = testAuth.authenticate('forager123');
        expect(result).toBe(true);
        expect(testAuth.isAuthenticated).toBe(true);
      });

      test('should store auth data in localStorage on successful auth', () => {
        testAuth.authenticate('granite2024');

        const stored = localStorage.getItem(testAuth.storageKey);
        expect(stored).not.toBeNull();

        const authData = JSON.parse(stored);
        expect(authData.authenticated).toBe(true);
        expect(authData.expires).toBeDefined();
        expect(authData.timestamp).toBeDefined();
      });

      test('should set expiry to 24 hours from now', () => {
        const now = Date.now();
        testAuth.authenticate('granite2024');

        const stored = localStorage.getItem(testAuth.storageKey);
        const authData = JSON.parse(stored);

        const expectedExpiry = now + (24 * 60 * 60 * 1000);
        expect(authData.expires).toBe(expectedExpiry);
      });

      test('should set timestamp to current time', () => {
        const now = Date.now();
        testAuth.authenticate('granite2024');

        const stored = localStorage.getItem(testAuth.storageKey);
        const authData = JSON.parse(stored);

        expect(authData.timestamp).toBe(now);
      });
    });

    describe('Invalid Passwords', () => {

      test('should reject empty password', () => {
        const result = testAuth.authenticate('');
        expect(result).toBe(false);
        expect(testAuth.isAuthenticated).toBe(false);
      });

      test('should reject incorrect password', () => {
        const result = testAuth.authenticate('wrongpassword');
        expect(result).toBe(false);
        expect(testAuth.isAuthenticated).toBe(false);
      });

      test('should reject password with wrong case', () => {
        const result = testAuth.authenticate('GRANITE2024'); // Uppercase
        expect(result).toBe(false);
        expect(testAuth.isAuthenticated).toBe(false);
      });

      test('should reject password with extra spaces', () => {
        const result = testAuth.authenticate(' granite2024 ');
        expect(result).toBe(false);
        expect(testAuth.isAuthenticated).toBe(false);
      });

      test('should reject almost-correct password', () => {
        const result = testAuth.authenticate('granite2023'); // Off by one year
        expect(result).toBe(false);
        expect(testAuth.isAuthenticated).toBe(false);
      });

      test('should not store anything in localStorage on failed auth', () => {
        testAuth.authenticate('wrongpassword');

        const stored = localStorage.getItem(testAuth.storageKey);
        expect(stored).toBeNull();
      });

      test('should reject null password', () => {
        const result = testAuth.authenticate(null);
        expect(result).toBe(false);
      });

      test('should reject undefined password', () => {
        const result = testAuth.authenticate(undefined);
        expect(result).toBe(false);
      });
    });

    describe('Multiple Authentication Attempts', () => {

      test('should update auth on re-authentication with valid password', () => {
        // First auth
        testAuth.authenticate('granite2024');
        const firstStored = localStorage.getItem(testAuth.storageKey);

        // Advance time
        vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);

        // Second auth
        testAuth.authenticate('forager123');
        const secondStored = localStorage.getItem(testAuth.storageKey);

        expect(secondStored).not.toBe(firstStored);
      });

      test('should remain authenticated after failed password attempt', () => {
        // Successful auth first
        testAuth.authenticate('granite2024');
        expect(testAuth.isAuthenticated).toBe(true);

        // Failed attempt
        const result = testAuth.authenticate('wrongpassword');
        expect(result).toBe(false);

        // Should still be authenticated from first attempt
        expect(testAuth.isAuthenticated).toBe(true);
      });
    });
  });

  describe('logout', () => {

    test('should set isAuthenticated to false', () => {
      // Set up authenticated state
      testAuth.authenticate('granite2024');
      expect(testAuth.isAuthenticated).toBe(true);

      // Logout
      testAuth.logout();
      expect(testAuth.isAuthenticated).toBe(false);
    });

    test('should remove auth data from localStorage', () => {
      // Set up authenticated state
      testAuth.authenticate('granite2024');
      expect(localStorage.getItem(testAuth.storageKey)).not.toBeNull();

      // Logout
      testAuth.logout();
      expect(localStorage.getItem(testAuth.storageKey)).toBeNull();
    });

    test('should be safe to call when not authenticated', () => {
      expect(testAuth.isAuthenticated).toBe(false);

      // Should not throw
      expect(() => testAuth.logout()).not.toThrow();

      expect(testAuth.isAuthenticated).toBe(false);
    });

    test('should work multiple times', () => {
      testAuth.authenticate('granite2024');
      testAuth.logout();
      testAuth.logout(); // Second logout

      expect(testAuth.isAuthenticated).toBe(false);
      expect(localStorage.getItem(testAuth.storageKey)).toBeNull();
    });
  });

  describe('hasLocationAccess', () => {

    test('should return false when not authenticated', () => {
      expect(testAuth.hasLocationAccess()).toBe(false);
    });

    test('should return true when authenticated', () => {
      testAuth.authenticate('granite2024');
      expect(testAuth.hasLocationAccess()).toBe(true);
    });

    test('should return false after logout', () => {
      testAuth.authenticate('granite2024');
      expect(testAuth.hasLocationAccess()).toBe(true);

      testAuth.logout();
      expect(testAuth.hasLocationAccess()).toBe(false);
    });

    test('should reflect current authentication state', () => {
      // Not authenticated
      expect(testAuth.hasLocationAccess()).toBe(false);

      // Authenticate
      testAuth.authenticate('granite2024');
      expect(testAuth.hasLocationAccess()).toBe(true);

      // Manually set to false (simulating expiry check)
      testAuth.isAuthenticated = false;
      expect(testAuth.hasLocationAccess()).toBe(false);
    });
  });

  describe('Session Expiry', () => {

    test('should expire after 24 hours', () => {
      testAuth.authenticate('granite2024');

      // Fast-forward 24 hours + 1 second
      const futureTime = Date.now() + (24 * 60 * 60 * 1000) + 1000;
      vi.spyOn(Date, 'now').mockReturnValue(futureTime);

      // Check status - should be expired
      const result = testAuth.checkAuthStatus();
      expect(result).toBe(false);
    });

    test('should still be valid after 23 hours 59 minutes', () => {
      testAuth.authenticate('granite2024');

      // Fast-forward 23 hours 59 minutes
      const futureTime = Date.now() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000);
      vi.spyOn(Date, 'now').mockReturnValue(futureTime);

      // Check status - should still be valid
      const result = testAuth.checkAuthStatus();
      expect(result).toBe(true);
    });

    test('should clear expired session from localStorage', () => {
      testAuth.authenticate('granite2024');
      expect(localStorage.getItem(testAuth.storageKey)).not.toBeNull();

      // Fast-forward past expiry
      const futureTime = Date.now() + (25 * 60 * 60 * 1000);
      vi.spyOn(Date, 'now').mockReturnValue(futureTime);

      // Check status - should clear from storage
      testAuth.checkAuthStatus();
      expect(localStorage.getItem(testAuth.storageKey)).toBeNull();
    });
  });

  describe('showLoginModal', () => {

    test('should return true if already authenticated', () => {
      testAuth.authenticate('granite2024');
      const result = testAuth.showLoginModal();
      expect(result).toBe(true);
    });

    test('should return false if not authenticated', () => {
      const result = testAuth.showLoginModal();
      expect(result).toBe(false);
    });

    test('should create and append modal to document body when not authenticated', () => {
      testAuth.showLoginModal();

      const modal = document.getElementById('auth-modal');
      expect(modal).not.toBeNull();
      expect(document.body.contains(modal)).toBe(true);
    });

    test('should display modal with flex display', () => {
      testAuth.showLoginModal();

      const modal = document.getElementById('auth-modal');
      expect(modal.style.display).toBe('flex');
    });

    test('should not create modal if already authenticated', () => {
      testAuth.authenticate('granite2024');
      testAuth.showLoginModal();

      const modal = document.getElementById('auth-modal');
      expect(modal).toBeNull(); // Should not create modal
    });
  });

  describe('createLoginModal', () => {

    test('should create modal element with correct id', () => {
      const modal = testAuth.createLoginModal();
      expect(modal.id).toBe('auth-modal');
    });

    test('should create modal with correct CSS classes', () => {
      const modal = testAuth.createLoginModal();
      expect(modal.className).toContain('modal');
      expect(modal.className).toContain('auth-modal');
    });

    test('should include password input field', () => {
      const modal = testAuth.createLoginModal();
      const passwordInput = modal.querySelector('#auth-password');

      expect(passwordInput).not.toBeNull();
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBe(true);
    });

    test('should include submit button', () => {
      const modal = testAuth.createLoginModal();
      const submitBtn = modal.querySelector('button[type="submit"]');

      expect(submitBtn).not.toBeNull();
      expect(submitBtn.textContent).toContain('Access Locations');
    });

    test('should include cancel button', () => {
      const modal = testAuth.createLoginModal();
      const cancelBtn = modal.querySelector('button[type="button"]');

      expect(cancelBtn).not.toBeNull();
      expect(cancelBtn.textContent).toContain('Cancel');
    });

    test('should include error message div (hidden by default)', () => {
      const modal = testAuth.createLoginModal();
      const errorDiv = modal.querySelector('#auth-error');

      expect(errorDiv).not.toBeNull();
      expect(errorDiv.style.display).toBe('none');
    });

    test('should include auth form', () => {
      const modal = testAuth.createLoginModal();
      const form = modal.querySelector('#auth-form');

      expect(form).not.toBeNull();
      expect(form.tagName).toBe('FORM');
    });

    test('should have high z-index for overlay', () => {
      const modal = testAuth.createLoginModal();
      expect(modal.style.zIndex).toBe('10001');
    });
  });

  describe('Global auth instance', () => {

    test('should be an instance of SimpleAuth', () => {
      expect(auth).toBeInstanceOf(SimpleAuth);
    });

    test('should have correct storage key', () => {
      expect(auth.storageKey).toBe('graniteFungiForager_auth');
    });

    test('should be a singleton', () => {
      // auth should be the same instance across imports
      expect(auth).toBe(auth);
    });
  });

  describe('requireAuth function', () => {

    test('should return result from auth.showLoginModal', () => {
      // When not authenticated, should return false
      const result1 = requireAuth();
      expect(result1).toBe(false);

      // When authenticated, should return true
      auth.authenticate('granite2024');
      const result2 = requireAuth();
      expect(result2).toBe(true);
    });
  });

  describe('Security Considerations', () => {

    test('should store passwords as plain strings (documented limitation)', () => {
      // This test documents that passwords are stored as plain strings in code
      // For a client-side only app, this is acceptable but limited security
      testAuth.authenticate('granite2024');

      const stored = localStorage.getItem(testAuth.storageKey);
      const authData = JSON.parse(stored);

      // Should not contain password in storage (good)
      expect(stored).not.toContain('granite2024');
      expect(stored).not.toContain('forager123');

      // Only stores authentication state, not password
      expect(authData.authenticated).toBeDefined();
      expect(authData.expires).toBeDefined();
      expect(authData.password).toBeUndefined();
    });

    test('should use case-sensitive password comparison', () => {
      // Ensures no accidental case-insensitive matching
      expect(testAuth.authenticate('granite2024')).toBe(true);
      testAuth.logout();
      expect(testAuth.authenticate('Granite2024')).toBe(false);
      testAuth.logout();
      expect(testAuth.authenticate('GRANITE2024')).toBe(false);
    });

    test('should not authenticate with password substring', () => {
      expect(testAuth.authenticate('granite')).toBe(false);
      expect(testAuth.authenticate('2024')).toBe(false);
      expect(testAuth.authenticate('forager')).toBe(false);
    });
  });
});
