# Contributing to GraniteFungiForager

Thank you for your interest in contributing to GraniteFungiForager! This document provides guidelines for contributing to the project.

## 🍄 **Project Vision**

GraniteFungiForager aims to be the most accurate and comprehensive mushroom foraging tool for New Hampshire, combining:
- **Scientific accuracy** through data-driven predictions
- **Conservation responsibility** through protected location data
- **Community engagement** through user success tracking
- **Educational value** for both beginners and experts

## 🚀 **Current Development Focus**

**Phase 3.3 - Quality & Polish (Current Priority)**
- Bug hunting and cross-browser testing
- UI/UX improvements and accessibility
- Mobile optimization for field use
- Performance optimization and caching

**Future Phases - Data & Advanced Features**
- Real user data collection and ML model training
- Photo identification capabilities
- Expert validation networks
- Offline mode and advanced mobile features

## 🛠️ **Development Setup**

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic HTML/CSS/JavaScript knowledge
- Git for version control

### Local Development
```bash
# Clone the repository
git clone https://github.com/ibelanger/GraniteFungiForager.git
cd GraniteFungiForager

# Start local development server
python -m http.server 8000
# OR
npm run dev

# Open in browser
open http://localhost:8000
```

### Project Structure
```
NHMushroom/
├── index.html                 # Main application entry point
├── app.js                     # Application controller and initialization
├── src/
│   ├── modules/               # Feature modules (ES6)
│   │   ├── weather.js         # Weather API integration
│   │   ├── species.js         # Species database and display
│   │   ├── publicLands.js     # Location data with authentication
│   │   ├── mapCalculations.js # Probability calculations
│   │   ├── interactions.js    # UI interactions and event handling
│   │   ├── authentication.js  # Location data protection
│   │   ├── foragingReports.js # User success tracking
│   │   └── iNaturalistIntegration.js # Scientific data validation
│   ├── ml/                    # Machine learning pipeline
│   └── styles.css             # Application styling
├── docs/                      # Documentation
├── CLAUDE.md                  # Development guidance for AI assistants
├── ACCURACY_IMPROVEMENT_PLAN.md # Technical roadmap
└── CHANGELOG.md               # Version history
```

## 📋 **How to Contribute**

### 1. **Bug Reports**
Found a bug? Please report it!

**Before submitting:**
- Check existing issues to avoid duplicates
- Test in multiple browsers if possible
- Include steps to reproduce

**Include in your report:**
- Browser and version
- Device type (desktop/mobile)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 2. **Feature Suggestions**
We welcome ideas for improvements!

**Good feature suggestions:**
- **Quality & Polish**: UI improvements, accessibility, performance
- **Field usability**: Mobile experience, offline capabilities  
- **Data accuracy**: New data sources, validation methods
- **Conservation**: Better location protection methods

**Please avoid:**
- Features that compromise conservation goals
- Complex dependencies or build processes
- Features requiring server-side infrastructure

### 3. **Code Contributions**

#### **Pull Request Process**
1. **Fork** the repository
2. **Create a feature branch** from `main`
3. **Make your changes** following our guidelines
4. **Test thoroughly** across browsers and devices
5. **Update documentation** as needed
6. **Submit a pull request** with clear description

#### **Code Style Guidelines**
- **ES6 modules** - Use import/export, avoid global variables
- **Vanilla JavaScript** - No frameworks, keep dependencies minimal
- **Clean functions** - Small, focused functions with clear names
- **Comments** - Document complex logic and API integrations
- **Accessibility** - Include ARIA labels and keyboard navigation
- **Mobile-first** - Ensure responsive design for field use

#### **Testing Requirements**
- **Cross-browser testing** - Chrome, Firefox, Safari, Edge
- **Mobile testing** - iOS Safari, Chrome Android
- **Authentication testing** - Verify login/logout flows work correctly
- **API error handling** - Test with network failures and timeouts
- **Accessibility testing** - Screen readers and keyboard navigation

### 4. **Documentation Improvements**
Documentation is always appreciated!

**Areas needing help:**
- User guides and tutorials
- API documentation improvements
- Code examples and best practices
- Accessibility documentation

## 🔬 **Special Contribution Areas**

### **Mycological Expertise**
- **Species data validation** - Review and improve species information
- **Regional expertise** - NH-specific habitat and timing knowledge
- **Scientific accuracy** - Validate ecological requirements and distributions

### **Conservation & Ethics**
- **Location protection** - Improve authentication and access control systems
- **Sustainable practices** - Documentation and user education
- **Ethical foraging** - Guidelines and best practices

### **Data & Research**
- **User experience research** - Field testing and usability studies
- **Accuracy validation** - Compare predictions with real foraging results
- **Scientific partnerships** - Connect with mycological societies and researchers

## 🚫 **What We Don't Accept**

- **Precise GPS coordinates in public code** - Use authentication system
- **Build system complexity** - Keep the project buildless and simple
- **External dependencies** - Avoid npm packages and frameworks unless essential
- **Server-side requirements** - Maintain client-side only architecture
- **Features that compromise conservation** - Location data must remain protected

## 📊 **Current Priorities for Contributors**

### **High Priority (Quality & Polish)**
1. **Cross-browser compatibility** testing and fixes
2. **Mobile UX improvements** for field use
3. **Accessibility enhancements** (ARIA, keyboard navigation)
4. **Performance optimization** (loading times, caching)
5. **Error handling** improvements throughout the application

### **Medium Priority (Enhancement)**
1. **Loading state indicators** for API calls and data processing
2. **Offline functionality** improvements
3. **Touch interaction** enhancements for mobile devices
4. **Visual polish** and consistent styling

### **Lower Priority (Advanced Features)**
1. **Photo upload and identification** systems
2. **Advanced analytics** and data visualization
3. **Social features** and community building
4. **Integration with external APIs** and services

## 🧪 **Testing Guidelines**

### **Manual Testing Checklist**
- [ ] **Authentication**: Login/logout, session persistence, error handling
- [ ] **Weather data**: API failures, network timeouts, cache behavior
- [ ] **Species selection**: All 29 species load correctly with proper information
- [ ] **County interactions**: Click handling, modal display, data loading
- [ ] **Mobile responsiveness**: Touch targets, scrolling, landscape/portrait
- [ ] **Accessibility**: Screen reader compatibility, keyboard navigation

### **Browser Testing Matrix**
| Browser | Desktop | Mobile | Priority |
|---------|---------|--------|----------|
| Chrome | ✅ Required | ✅ Required | High |
| Firefox | ✅ Required | ⚠️ Nice-to-have | High |
| Safari | ✅ Required | ✅ Required | High |
| Edge | ⚠️ Nice-to-have | ⚠️ Nice-to-have | Medium |

## 📞 **Getting Help**

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - For sensitive topics or private coordination

## 🏆 **Recognition**

Contributors will be acknowledged in:
- **CHANGELOG.md** - For significant contributions
- **README.md** - For ongoing contributors
- **About section** - For major feature contributors

## 📄 **License**

By contributing to GraniteFungiForager, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

## 🌱 **Conservation Notice**

GraniteFungiForager prioritizes conservation and sustainable foraging practices. All contributions should support these goals:

- **Protect sensitive locations** from over-harvesting
- **Educate responsibly** about mushroom identification and foraging
- **Promote sustainable practices** in the foraging community
- **Support scientific research** and conservation efforts

Thank you for helping make GraniteFungiForager a valuable tool for the New Hampshire foraging community while protecting our natural resources! 🍄🌲