---
name: authentication-module
description: Deep dive into authentication.js - conservation-focused authentication system protecting sensitive GPS coordinates with session management
triggers:
  - authentication.js
  - auth module
  - auth system
  - SimpleAuth
  - isAuthenticated
  - login system
  - session management
  - location protection
---

# Authentication Module Deep Dive

## Module: `src/modules/authentication.js`

### Purpose
Provides password-based authentication to protect sensitive GPS coordinates and trail data for wild mushroom foraging locations. Conservation-focused design prevents over-harvesting by limiting access to detailed location information.

### Test Coverage
- **56 tests** covering:
  - Login flow and validation
  - Session management (24-hour persistence)
  - Security validation
  - Event-driven UI updates
  - localStorage integration

## Key Features

### 1. Conservation-Focused Design

**Philosophy:** Balance educational access with conservation by protecting sensitive location data while keeping general information public.

**Protected Data:**
- GPS coordinates (latitude/longitude)
- Specific trail names and markers
- Parking lot locations
- Contact information for land managers

**Public Data:**
- County-level climate information
- General soil types
- Elevation ranges
- Seasonal timing guidance

### 2. Simple Password-Based Authentication

**Current Passwords:**
- `granite2024`
- `forager123`

**Security Level:** Client-side only - suitable for conservation purposes, NOT high-security applications.

**Why Client-Side:**
- No server infrastructure needed
- Static hosting compatible (GitHub Pages)
- Sufficient deterrent for casual access
- Educational project scope

### 3. 24-Hour Session Management

**Session Lifecycle:**
1. User logs in with password
2. Session token stored in localStorage
3. Token expires after 24 hours
4. Automatic cleanup of expired sessions
5. User prompted to re-authenticate

**Storage Structure:**
```javascript
localStorage.setItem('authSession', JSON.stringify({
  token: 'hashed_password',
  timestamp: Date.now(),
  expiresAt: Date.now() + (24 * 60 * 60 * 1000)
}));
```

### 4. Event-Driven UI Updates

**Custom Events:**
- `authStateChanged` - Fired when login/logout occurs
- Listened to by `publicLands.js` and `interactions.js`
- Enables reactive UI updates without tight coupling

**Event Pattern:**
```javascript
// Fire event
window.dispatchEvent(new CustomEvent('authStateChanged', {
  detail: { isAuthenticated: true }
}));

// Listen for event
window.addEventListener('authStateChanged', (e) => {
  if (e.detail.isAuthenticated) {
    showProtectedData();
  } else {
    hideProtectedData();
  }
});
```

## SimpleAuth Class

### Constructor
```javascript
constructor() {
  this.validPasswords = ['granite2024', 'forager123'];
  this.sessionKey = 'authSession';
  this.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
}
```

### Key Methods

#### isAuthenticated()
```javascript
isAuthenticated() {
  const session = this.getSession();
  if (!session) return false;

  // Check expiration
  if (Date.now() > session.expiresAt) {
    this.logout();
    return false;
  }

  return true;
}
```

#### login(password)
```javascript
login(password) {
  if (this.validPasswords.includes(password)) {
    const session = {
      token: this.hashPassword(password),
      timestamp: Date.now(),
      expiresAt: Date.now() + this.sessionDuration
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(session));

    // Fire event
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: true }
    }));

    return true;
  }
  return false;
}
```

#### logout()
```javascript
logout() {
  localStorage.removeItem(this.sessionKey);

  // Fire event
  window.dispatchEvent(new CustomEvent('authStateChanged', {
    detail: { isAuthenticated: false }
  }));
}
```

## Global Export

### authManager Instance
```javascript
import { authManager } from './modules/authentication.js';

// Check authentication
if (authManager.isAuthenticated()) {
  // Show protected data
}

// Login user
const success = authManager.login(password);

// Logout user
authManager.logout();
```

## Integration Points

### Used By
1. **publicLands.js** - Shows/hides GPS coordinates based on auth state
2. **interactions.js** - Displays login modal when needed
3. **app.js** - Initializes auth state on page load

### Integration Pattern
```javascript
// In publicLands.js
window.addEventListener('authStateChanged', (e) => {
  if (e.detail.isAuthenticated) {
    displayGPSCoordinates();
  } else {
    displayLoginPrompt();
  }
});
```

## Modal Interface

### Login Modal Structure
```html
<div class="modal" id="authModal">
  <div class="modal-content">
    <h2>Access Protected Location Data</h2>
    <p>Enter password to view GPS coordinates and trail information</p>
    <input type="password" id="authPassword" placeholder="Password">
    <button onclick="attemptLogin()">Login</button>
    <p class="auth-error" id="authError"></p>
  </div>
</div>
```

### Display Login Modal
```javascript
import { showModal } from './modules/interactions.js';

showModal('Authentication Required', `
  <p>GPS coordinates are protected to prevent over-harvesting.</p>
  <input type="password" id="authPassword" placeholder="Enter password">
  <button id="authSubmit">Access Locations</button>
`);
```

## Security Considerations

### Current Security Level
- **Client-side only** - Not secure against determined attackers
- **Password in source code** - Visible in network requests and source
- **No server validation** - All logic runs in browser
- **Suitable for:** Conservation awareness, educational deterrent

### NOT Suitable For
- Protecting truly sensitive data
- Preventing access to determined individuals
- Compliance with security regulations
- Personal health information
- Financial data

### Why This is Acceptable Here
1. **Conservation goal** - Raise awareness, not absolute security
2. **Static hosting** - No server infrastructure available
3. **Educational project** - Not commercial application
4. **Data sensitivity** - Public trail locations, not personal data
5. **Barrier to entry** - Prevents casual scraping and abuse

## Session Storage

### localStorage Key
```javascript
'authSession'
```

### Session Data Structure
```javascript
{
  token: "7c9e7c9e7c9e...",           // Hashed password
  timestamp: 1701791400000,          // Login time
  expiresAt: 1701877800000           // Expiration time (24h later)
}
```

### Automatic Cleanup
- Expired sessions automatically removed on `isAuthenticated()` check
- No manual cleanup required
- Browser localStorage limits prevent accumulation

## Common Tasks

### Add New Password
```javascript
// In authentication.js constructor
this.validPasswords = [
  'granite2024',
  'forager123',
  'newPassword123'  // Add here
];
```

### Change Session Duration
```javascript
// In authentication.js constructor
this.sessionDuration = 48 * 60 * 60 * 1000; // 48 hours instead of 24
```

### Add Custom Auth Logic
```javascript
// Example: Require email + password
login(email, password) {
  const validUsers = {
    'user@example.com': 'password123'
  };

  if (validUsers[email] === password) {
    // Create session...
    return true;
  }
  return false;
}
```

### Listen for Auth State Changes
```javascript
// In any module
window.addEventListener('authStateChanged', (e) => {
  console.log('Auth state changed:', e.detail.isAuthenticated);
  updateUI();
});
```

## UI/UX Patterns

### Inline Protection Display
```javascript
// Show different content based on auth
const locationInfo = authManager.isAuthenticated()
  ? `GPS: ${lat}, ${lon}`
  : `<button onclick="showLogin()">Login to view coordinates</button>`;
```

### Modal on County Click
```javascript
// In interactions.js county click handler
if (!authManager.isAuthenticated()) {
  showModal('Login Required', 'Please log in to view location data');
  return;
}

// Show county details with GPS
showCountyDetails(county);
```

### Session Expiration Notice
```javascript
// Check session age and warn before expiration
const session = authManager.getSession();
if (session) {
  const timeRemaining = session.expiresAt - Date.now();
  const hoursRemaining = timeRemaining / (60 * 60 * 1000);

  if (hoursRemaining < 1) {
    showNotification('Session expires in less than 1 hour');
  }
}
```

## Testing Strategy

### Authentication Flow Tests
- Valid password login succeeds
- Invalid password login fails
- Session persists across page reloads
- Session expires after 24 hours
- Logout clears session
- Events fire correctly

### Integration Tests
- `authStateChanged` event listeners work
- Protected data hides when logged out
- Login modal displays correctly
- Multiple logins don't create duplicate sessions

### Edge Cases
- Expired session cleanup
- Multiple tabs/windows sync
- localStorage quota exceeded
- Corrupted session data handling

## Future Enhancements

### Possible Improvements
- **Server-side validation** - If backend added later
- **Token-based auth** - JWT or similar for better security
- **User accounts** - Individual users with permissions
- **Rate limiting** - Prevent brute force attempts
- **OAuth integration** - Login with Google, GitHub, etc.
- **Access levels** - Different tiers of location data
- **Audit logging** - Track who accessed what data

### Conservation Enhancements
- **Certification requirement** - Require foraging certification
- **Seasonal access** - Limit access during peak seasons
- **Harvest reporting** - Track who's foraging where
- **Impact monitoring** - Close areas if over-harvested

## Quick Reference

### Essential Methods
```javascript
// Check if user is logged in
authManager.isAuthenticated() // returns boolean

// Login user
authManager.login('password') // returns boolean

// Logout user
authManager.logout() // void

// Get session data
authManager.getSession() // returns object or null
```

### Event Handling
```javascript
// Listen for auth changes
window.addEventListener('authStateChanged', handler);

// Fire auth change event (done automatically by auth module)
window.dispatchEvent(new CustomEvent('authStateChanged', {
  detail: { isAuthenticated: true }
}));
```

### Common Patterns
```javascript
// Protect data display
if (authManager.isAuthenticated()) {
  showGPSCoordinates();
} else {
  showLoginButton();
}

// Protect function execution
function viewSensitiveData() {
  if (!authManager.isAuthenticated()) {
    showLoginModal();
    return;
  }
  // ... show data
}
```
