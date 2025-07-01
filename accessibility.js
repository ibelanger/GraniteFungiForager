// accessibility.js - ARIA, keyboard, and focus styles

export function setupAccessibility({speciesSelect, seasonSelect, autoWeatherCheckbox, rainfallSlider, soilTempSlider, airTempSlider, regions}) {
    // Add ARIA labels
    if (speciesSelect) speciesSelect.setAttribute('aria-label', 'Select mushroom species');
    if (seasonSelect) seasonSelect.setAttribute('aria-label', 'Select season');
    if (autoWeatherCheckbox) autoWeatherCheckbox.setAttribute('aria-label', 'Use live weather data');
    if (rainfallSlider) rainfallSlider.setAttribute('aria-label', 'Set recent rainfall in inches');
    if (soilTempSlider) soilTempSlider.setAttribute('aria-label', 'Set soil temperature in Fahrenheit');
    if (airTempSlider) airTempSlider.setAttribute('aria-label', 'Set air temperature in Fahrenheit');

    // Add keyboard accessibility for map regions
    if (regions) {
        regions.forEach(region => {
            region.setAttribute('tabindex', '0');
            region.setAttribute('role', 'button');
            region.setAttribute('aria-label', `Region: ${region.getAttribute('data-region')}`);
        });
    }

    // Improve color contrast in legend
    document.querySelectorAll('.legend-color').forEach(el => {
        el.style.border = '1px solid #333';
    });

    // Add focus styles for accessibility
    const style = document.createElement('style');
    style.innerHTML = `
    .region:focus .zone {
        stroke: #FFD700 !important;
        stroke-width: 3px !important;
    }
    button:focus, select:focus, input:focus {
        outline: 2px solid #FFD700 !important;
        outline-offset: 2px;
    }`;
    document.head.appendChild(style);
}
