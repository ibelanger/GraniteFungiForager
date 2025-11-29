# 🍄 GraniteFungiForager v3.2.1

[![Tests](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml/badge.svg)](https://github.com/ibelanger/GraniteFungiForager/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GraniteFungiForager** - NH Tier 1 Wild Mushroom Probability Map with interactive foraging conditions based on real-time weather data and mycological expertise.

## 🌐 **LIVE APPLICATION**
**Try it now:** https://ibelanger.github.io/GraniteFungiForager/

## 🆕 **What's New in v3.2.1** (August 2025)

### 🔒 **NEW: Authentication System for Location Data Protection**
- **Password-Protected GPS Coordinates** - Sensitive foraging locations now require authentication to prevent over-harvesting
- **Conservation-Focused Design** - General habitat information remains public for educational purposes
- **Seamless User Experience** - Modal-based authentication with 24-hour session persistence
- **Responsible Foraging** - Protects sensitive ecological locations while maintaining educational access

### 📊 **Enhanced Data Protection**
- **Protected Information**: GPS coordinates, specific trail names, parking locations, contact details
- **Public Information**: Climate data, soil types, elevation ranges, seasonal timing, habitat descriptions
- **Two Access Passwords**: `granite2024` and `forager123` for accessing detailed location data
- **Session Management**: 24-hour authentication with automatic cleanup

## 🆕 **What's New in v3.2** (August 2024)

### 🎯 Enhanced User Experience
- **Top 5 Species Rankings** - Click any county to see the 5 most likely species with current conditions
- **Visual Condition Indicators** - See temperature, moisture, and seasonal matches at a glance
- **Improved Species Selection** - Alphabetical ordering with clear "Select a species" default
- **Fixed Tooltip System** - Single, enhanced tooltips with species-specific information

### 🍄 Expanded Species Database
- **King Bolete Complex Breakdown** - 7 individual Boletus species with distinct ecological requirements
- **29 Total Species** - Complete DHHS Tier 1 coverage plus subspecies variations
- **Enhanced Species Cards** - Detailed identification notes and habitat preferences

### 🗺️ Better Map Interaction
- **No-Species-Selected Handling** - Clear messaging when no species is chosen
- **Neutral Map Colors** - Visual feedback when no species is active
- **Enhanced County Clicks** - Immediate feedback and smooth scrolling to information

## 📋 **DHHS Compliance**
✅ **Complete with ALL 29 species variants** (Updated August 2024)
✅ **Scientifically accurate subspecies** (Boletus 7-species, Hedgehog 3-subgenera)
✅ **Real-time weather integration** for probability calculations

GraniteFungiForager is the most comprehensive tool for New Hampshire mushroom foragers, providing county-specific probability maps, detailed species identification, and public lands recommendations.

🔍 **Key Features**
- **Complete DHHS Tier 1 Species Database** - 29 species including subspecies variants
- **Real-time Weather Integration** - Live probability calculations with 5-minute auto-refresh
- **Interactive County Map** - Click for detailed recommendations and top species rankings
- **Scientific Accuracy** - Individual species with distinct ecological requirements
- **Protected Public Lands Database** - Password-protected GPS coordinates and access information
- **Conservation-Focused Authentication** - Protects sensitive locations from over-harvesting
- **Mobile Responsive** - Optimized for field use on all devices
- **Community Data** - Foraging success tracking and validation system

🛠️ **Built using:** Vanilla HTML, CSS, JavaScript (client-side only)

📌 **License & Future Plans**  
This project is licensed under the [MIT License](./LICENSE), allowing free use and contributions.

⚠️ **Heads up:** Future versions of this project may include premium features or datasets offered under a separate commercial license. Community contributions and feedback are encouraged!

## 🏗️ Project Structure
NHMushroom/
├── index.html                 # Main application
├── app.js                     # Application controller
├── src/
│   ├── modules/               # Feature modules
│   │   ├── weather.js         # Weather integration
│   │   ├── species.js         # Species data & display
│   │   ├── publicLands.js     # Location recommendations
│   │   ├── mapCalculations.js # Probability engine
│   │   ├── interactions.js    # UI interactions
│   │   └── authentication.js  # Location data authentication
│   ├── styles.css             # Application styles
│   └── data/                  # Data files (if any)
├── assets/                    # Static assets (images, etc.)
├── docs/                      # Documentation
├── package.json               # Project metadata (if using npm)
├── LICENSE                    # License file
├── README.md                  # Project readme
└── ...                        # Other files and folders

## 🚀 Quick Start
```bash
git clone https://github.com/yourusername/GraniteFungiForager.git
cd GraniteFungiForager
# Open index.html in a modern browser
# Or serve with a local HTTP server for full functionality
python -m http.server 8000
```

## 🔒 **Using the Authentication System**

### **Accessing Protected Location Data**
1. **Select a species** and click on any county
2. **View general information** (freely available): climate, soil types, timing, elevation
3. **For detailed locations**: Click "🔑 Access Location Data" when you see the authentication prompt
4. **Enter password**: Use `granite2024` or `forager123`
5. **Access granted**: GPS coordinates, trail names, and detailed access information will appear

### **Why Authentication?**
- **Prevents over-harvesting** at specific GPS locations
- **Protects sensitive ecosystems** from excessive foraging pressure  
- **Maintains educational value** - general habitat info remains freely available
- **Supports conservation** - follows responsible foraging practices
- **24-hour sessions** - stay logged in for field use

### **For Developers**
- **Client-side only** - No server-side authentication required
- **Conservation-focused** - Not high-security, designed to prevent casual over-harvesting
- **Configurable passwords** - Easy to change in `src/modules/authentication.js`
- **Session management** - Automatic cleanup and expiration handling

## 🚀 **Development & Contributing**

**Want to contribute?** Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**See our roadmap:** [ACCURACY_IMPROVEMENT_PLAN.md](./ACCURACY_IMPROVEMENT_PLAN.md) shows completed features and future development.

**Technical Documentation:** [CLAUDE.md](./CLAUDE.md) contains detailed architecture and development guidance.