// authentication.js - Simple authentication for premium features

/**
 * Simple authentication system for accessing premium location data
 * Uses localStorage to persist login state
 */

export class SimpleAuth {
    constructor() {
        this.storageKey = 'graniteFungiForager_auth';
        this.isAuthenticated = this.checkAuthStatus();
    }
    
    /**
     * Check if user is currently authenticated
     */
    checkAuthStatus() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return false;
            
            const authData = JSON.parse(stored);
            const now = Date.now();
            
            // Check if auth token is still valid (24 hour expiry)
            if (authData.expires && now < authData.expires) {
                return true;
            } else {
                // Clear expired auth
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }
    
    /**
     * Password authentication using SHA-256 hash comparison.
     * Plaintext passwords are never stored in source.
     * To update passwords: compute SHA-256 hex of new password and replace the hash below.
     *   node -e "require('crypto').createHash('sha256').update('newpassword').digest('hex')"
     * Note: rotate these passwords since prior plaintext versions existed in git history.
     * @param {string} password - The password to check
     */
    async authenticate(password) {
        if (password == null || typeof password !== 'string') return false;

        const validHashes = [
            '9d35a69bf19f233406aa143e5d311ac33b424340e7b8a6b3c987395e6d95b480',
            '68adc86be73fa9c4e586e56c8cca9a84feae68ee0f09df097c10fb4945de6b4c',
        ];

        const encoded = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hex = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (validHashes.includes(hex)) {
            const authData = {
                authenticated: true,
                expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                timestamp: Date.now()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(authData));
            this.isAuthenticated = true;
            return true;
        }

        return false;
    }
    
    /**
     * Logout and clear authentication
     */
    logout() {
        localStorage.removeItem(this.storageKey);
        this.isAuthenticated = false;
    }
    
    /**
     * Check if user has access to premium features (location data)
     */
    hasLocationAccess() {
        return this.isAuthenticated;
    }
    
    /**
     * Show login modal if not authenticated
     */
    showLoginModal() {
        if (this.isAuthenticated) return true;
        
        const modal = this.createLoginModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Focus password input
        const passwordInput = modal.querySelector('#auth-password');
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
        }
        
        return false;
    }
    
    /**
     * Create login modal HTML
     */
    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'modal auth-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeAuthModal()"></div>
            <div class="modal-content auth-modal-content">
                <div class="modal-header">
                    <h3>🔒 Access Location Data</h3>
                    <button class="close-btn" onclick="closeAuthModal()">&times;</button>
                </div>
                <div class="auth-content">
                    <p>Enter password to access detailed foraging location information:</p>
                    <form id="auth-form" onsubmit="return handleAuthSubmit(event)">
                        <div class="form-group">
                            <label for="auth-password">Password:</label>
                            <input type="password" id="auth-password" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">Access Locations</button>
                            <button type="button" onclick="closeAuthModal()" class="cancel-btn">Cancel</button>
                        </div>
                        <div id="auth-error" class="error-message" style="display: none;">
                            Invalid password. Please try again.
                        </div>
                    </form>
                    <div class="auth-info">
                        <p><small>This protects sensitive location data from over-harvesting.</small></p>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        const content = modal.querySelector('.auth-modal-content');
        content.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        return modal;
    }
}

// Global auth instance
export const auth = new SimpleAuth();

// Global functions for modal interaction
window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.remove();
    }
};

window.handleAuthSubmit = async function(event) {
    event.preventDefault();

    const password = document.getElementById('auth-password').value;
    const errorDiv = document.getElementById('auth-error');

    if (await auth.authenticate(password)) {
        // Success - close modal and refresh display
        window.closeAuthModal();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-toast';
        successMsg.innerHTML = '✅ Location access granted!';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10002;
        `;
        document.body.appendChild(successMsg);
        
        setTimeout(() => successMsg.remove(), 3000);
        
        // Trigger refresh of any location-dependent displays
        const event = new CustomEvent('authStateChanged', { detail: { authenticated: true } });
        document.dispatchEvent(event);
        
    } else {
        // Show error
        errorDiv.style.display = 'block';
        document.getElementById('auth-password').value = '';
        document.getElementById('auth-password').focus();
    }
    
    return false;
};

// Export authentication status checker
export function requireAuth() {
    return auth.showLoginModal();
}