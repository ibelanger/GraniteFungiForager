// app.js - Main application controller and initialization

import { initWeather } from './src/modules/weather.js';
import { initMapCalculations } from './src/modules/mapCalculations.js';
import { initInteractions } from './src/modules/interactions.js';
import { initEnhancedMapInteractions } from './src/modules/interactions.js';
import { reportsManager } from './src/modules/foragingReports.js';
import { iNatClient, obsProcessor } from './src/modules/iNaturalistIntegration.js';
import { speciesMapper } from './src/modules/speciesMapping.js';
import { observationAnalyzer } from './src/modules/observationAnalysis.js';
import { coverageAuditor } from './src/modules/speciesCoverageAudit.js';

/**
 * Application configuration
 */
const appConfig = {
    version: '3.5.0',
    title: 'GraniteFungiForager - NH Tier 1 Mushroom Map',
    author: 'GraniteFungiForager',
    updateInterval: 300000, // 5 minutes for auto-refresh
    debug: false
};

/**
 * Application state management
 */
class MushroomApp {
    constructor() {
        this.initialized = false;
        this.currentSpecies = 'chanterelles';
        this.autoRefreshTimer = null;
        this.lastWeatherUpdate = null;
    }
    
    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;
        
        try {
            console.log(`Initializing ${appConfig.title} v${appConfig.version}`);
            
            // Show loading state
            this.showLoading();
            
            // Initialize modules in order
            await this.initModules();
            
            // Setup auto-refresh
            this.setupAutoRefresh();
            
            // Hide loading state
            this.hideLoading();
            
            this.initialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    /**
     * Initialize all application modules
     */
    async initModules() {
        // Initialize weather module
        await initWeather();
        console.log('Weather module initialized');
        
        // Initialize map calculations
        initMapCalculations();
        console.log('Map calculations initialized');
        
        // Initialize UI interactions
        initInteractions();
        console.log('UI interactions initialized');
        
        // Initialize enhanced map interactions (county click handlers)
        initEnhancedMapInteractions();
        console.log('Enhanced map interactions initialized');
        
        // Setup additional event listeners
        this.setupGlobalEventListeners();
    }
    
    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle visibility change (pause/resume auto-refresh)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Handle orientation change for mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(this.handleResize.bind(this), 100);
        });
    }
    
    /**
     * Setup automatic refresh of weather data
     */
    setupAutoRefresh() {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
        }
        
        this.autoRefreshTimer = setInterval(() => {
            if (!document.hidden) {
                this.refreshWeatherData();
            }
        }, appConfig.updateInterval);
    }
    
    /**
     * Refresh weather data
     */
    async refreshWeatherData() {
        try {
            const weatherModule = await import('./src/modules/weather.js');
            await weatherModule.fetchWeatherData(
                () => console.log('Auto-refresh completed'),
                weatherModule.updateWeatherDisplay
            );
            this.lastWeatherUpdate = new Date();
        } catch (error) {
            console.error('Auto-refresh failed:', error);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust map size if needed
        const map = document.getElementById('nh-map');
        if (map) {
            // Force redraw of SVG map
            map.style.width = '100%';
            map.style.height = 'auto';
        }
        
        // Adjust modal positioning
        const modal = document.getElementById('county-modal');
        if (modal && modal.style.display === 'block') {
            this.centerModal(modal);
        }
    }
    
    /**
     * Handle visibility change (tab focus/blur)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause auto-refresh when tab is not visible
            if (this.autoRefreshTimer) {
                clearInterval(this.autoRefreshTimer);
            }
        } else {
            // Resume auto-refresh when tab becomes visible
            this.setupAutoRefresh();
            
            // Check if weather data is stale
            if (this.lastWeatherUpdate && 
                Date.now() - this.lastWeatherUpdate > appConfig.updateInterval * 2) {
                this.refreshWeatherData();
            }
        }
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(event) {
        // ESC key - close modal
        if (event.key === 'Escape') {
            const modal = document.getElementById('county-modal');
            if (modal && modal.style.display === 'block') {
                window.closeCountyModal();
            }
        }
        
        // R key - refresh weather (Ctrl+R or Cmd+R)
        if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            this.refreshWeatherData();
        }
        
        // Number keys 1-8 - select species
        if (event.key >= '1' && event.key <= '8') {
            const speciesSelect = document.getElementById('species-select');
            if (speciesSelect && speciesSelect.options[event.key - 1]) {
                speciesSelect.selectedIndex = event.key - 1;
                speciesSelect.dispatchEvent(new Event('change'));
            }
        }
    }
    
    /**
     * Center modal in viewport
     */
    centerModal(modal) {
        const modalContent = modal.querySelector('.county-details');
        if (modalContent) {
            modalContent.style.marginTop = '2rem';
            modalContent.style.marginBottom = '2rem';
        }
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        const loading = document.getElementById('loading-overlay') || this.createLoadingOverlay();
        loading.style.display = 'flex';
    }
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    /**
     * Create loading overlay element
     */
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>Loading GraniteFungiForager...</h3>
                <p>Fetching weather data and initializing map</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: inherit;
        `;
        
        const content = overlay.querySelector('.loading-content');
        content.style.cssText = `
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    /**
     * Show error message to user
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()">Reload Page</button>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        const button = errorDiv.querySelector('button');
        button.style.cssText = `
            background: white;
            color: #ff4444;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    /**
     * Get application status
     */
    getStatus() {
        return {
            version: appConfig.version,
            initialized: this.initialized,
            currentSpecies: this.currentSpecies,
            lastWeatherUpdate: this.lastWeatherUpdate,
            autoRefreshActive: !!this.autoRefreshTimer
        };
    }
    
    /**
     * Enable debug mode
     */
    enableDebug() {
        appConfig.debug = true;
        console.log('Debug mode enabled');
        
        // Add debug info to page
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1rem;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            max-width: 300px;
        `;
        
        const updateDebugInfo = () => {
            const status = this.getStatus();
            debugPanel.innerHTML = `
                <h4>Debug Info</h4>
                <p>Version: ${status.version}</p>
                <p>Initialized: ${status.initialized}</p>
                <p>Current Species: ${status.currentSpecies}</p>
                <p>Last Weather Update: ${status.lastWeatherUpdate ? 
                    status.lastWeatherUpdate.toLocaleTimeString() : 'Never'}</p>
                <p>Auto-refresh: ${status.autoRefreshActive ? 'Active' : 'Inactive'}</p>
            `;
        };
        
        updateDebugInfo();
        setInterval(updateDebugInfo, 1000);
        document.body.appendChild(debugPanel);
    }
    
    /**
     * Cleanup application resources
     */
    destroy() {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
        }
        
        // Remove global event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        document.removeEventListener('keydown', this.handleKeyboard);
        
        this.initialized = false;
        console.log('Application destroyed');
    }
}

// Create global app instance
const app = new MushroomApp();

/**
 * Initialize application when DOM is ready
 */
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        app.init();
    }
}

/**
 * Export app instance and utilities for external access
 */
export { app, appConfig };

/**
 * Global functions for backward compatibility
 */
window.mushroomApp = app;
window.enableDebug = () => app.enableDebug();

/**
 * Auto-initialize when module loads
 */
initializeApp();

/**
 * Handle any unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (appConfig.debug) {
        app.showError(`Unhandled error: ${event.reason.message || event.reason}`);
    }
});

/**
 * Service worker registration for offline capability (future enhancement)
 */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service worker registered');
    }).catch((error) => {
        console.log('Service worker registration failed:', error);
    });
}
