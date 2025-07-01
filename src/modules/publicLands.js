// publicLands.js - Public land location data and recommendations

export const publicLandData = {
    'Coos County': {
        generalTips: [
            'Focus on mixed conifer-hardwood edges at 1000-2500ft elevation',
            'Check north-facing slopes for cooler, moister conditions',
            'Look for areas with recent selective logging (2-5 years old)',
            'Stream corridors often provide ideal moisture levels'
        ],
        locations: [
            {
                name: 'White Mountain National Forest - North Zone',
                type: 'National Forest',
                access: 'Multiple trailheads off Route 2 and Route 16',
                species: ['King Bolete', 'Chanterelles', 'Matsutake', 'Hericium'],
                microhabitats: ['Mixed conifer stands', 'Hardwood slopes', 'Stream banks'],
                notes: 'Vast area - focus on accessible trails with mixed forest'
            },
            {
                name: 'Coleman State Park',
                type: 'State Park',
                access: 'Route 26, Stewartstown',
                species: ['Chanterelles', 'Black Trumpets', 'Oyster Mushrooms'],
                microhabitats: ['Lakeside hardwoods', 'Boggy areas'],
                notes: 'Small park, check edges and picnic areas'
            },
            {
                name: 'Connecticut Lakes State Forest',
                type: 'State Forest',
                access: 'Route 3 north of Pittsburg',
                species: ['King Bolete', 'Matsutake', 'Hedgehogs'],
                microhabitats: ['Boreal forest', 'Wet meadow edges'],
                notes: 'Remote area, high elevation species'
            }
        ]
    },
    
    'Grafton County': {
        generalTips: [
            'Excellent diversity - elevation ranges from 400-4000+ feet',
            'Check oak-dominated lower elevations for different species',
            'Higher elevations (2000+ft) often productive for boletes',
            'College towns have well-maintained trail systems'
        ],
        locations: [
            {
                name: 'White Mountain National Forest - Central',
                type: 'National Forest',
                access: 'I-93, Route 112 (Kancamagus), Route 302',
                species: ['King Bolete', 'Chanterelles', 'Matsutake', 'Hedgehogs', 'Maitake'],
                microhabitats: ['Beech-birch-maple forests', 'Hemlock groves', 'Oak stands'],
                notes: 'Prime foraging - diverse elevations and forest types'
            },
            {
                name: 'Sculptured Rocks Natural Area',
                type: 'Natural Area',
                access: 'Route 118, Groton',
                species: ['Black Trumpets', 'Oyster Mushrooms', 'Wine Cap'],
                microhabitats: ['Riverside hardwoods', 'Rocky outcrops'],
                notes: 'Small area, check along river trail'
            },
            {
                name: 'Cardigan State Park',
                type: 'State Park',
                access: 'Off Route 118, Orange',
                species: ['Chanterelles', 'Hedgehogs', 'Russula'],
                microhabitats: ['Mid-elevation hardwood-conifer mix'],
                notes: 'Good trail access, mixed elevations'
            }
        ]
    },
    
    'Carroll County': {
        generalTips: [
            'Mountain terrain with excellent drainage',
            'Focus on north-facing slopes in summer heat',
            'Tourist areas may be over-picked - try off-trail locations',
            'Late summer into fall most productive'
        ],
        locations: [
            {
                name: 'White Mountain National Forest - Eastern Zone',
                type: 'National Forest',
                access: 'Route 16, Route 302, numerous trailheads',
                species: ['King Bolete', 'Chanterelles', 'Matsutake', 'Hedgehogs'],
                microhabitats: ['Mountain hardwood', 'Conifer slopes', 'Valley bottoms'],
                notes: 'Extensive area - focus on lesser-known trails'
            },
            {
                name: 'Cathedral Ledge State Park',
                type: 'State Park',
                access: 'Route 16, North Conway',
                species: ['Oyster Mushrooms', 'Hericium', 'Wine Cap'],
                microhabitats: ['Base of cliffs', 'Mixed hardwood'],
                notes: 'Small park, check lower slopes and parking areas'
            },
            {
                name: 'Diana\'s Baths Trail Area',
                type: 'WMNF Trail',
                access: 'West Side Road, North Conway',
                species: ['Black Trumpets', 'Chanterelles', 'Hedgehogs'],
                microhabitats: ['Stream corridors', 'Moist hardwood slopes'],
                notes: 'Popular trail - explore off main path'
            }
        ]
    },
    
    'Sullivan County': {
        generalTips: [
            'Lower elevation county with rich hardwood forests',
            'Excellent for oak-associated species',
            'Connecticut River valley often productive',
            'Mix of private/public land - respect boundaries'
        ],
        locations: [
            {
                name: 'Pillsbury State Park',
                type: 'State Park',
                access: 'Route 31, Washington',
                species: ['Chanterelles', 'Black Trumpets', 'Maitake', 'Oyster Mushrooms'],
                microhabitats: ['Pond edges', 'Hardwood slopes', 'Old growth areas'],
                notes: 'Remote park with diverse habitats'
            },
            {
                name: 'Mount Sunapee State Park',
                type: 'State Park',
                access: 'Route 103, Newbury',
                species: ['King Bolete', 'Chanterelles', 'Hedgehogs', 'Russula'],
                microhabitats: ['Mountain hardwood', 'Ski trail edges'],
                notes: 'Check around ski trails and natural areas'
            },
            {
                name: 'Gile State Forest',
                type: 'State Forest',
                access: 'Route 10, Springfield area',
                species: ['Maitake', 'Oyster Mushrooms', 'Wine Cap', 'Beefsteak Polypore'],
                microhabitats: ['Oak-dominated forests', 'Stream valleys'],
                notes: 'Good for oak-associated species'
            }
        ]
    },
    
    'Merrimack County': {
        generalTips: [
            'Mix of urban areas and state forests',
            'Check state forest roads for access',
            'Concord area has good trail systems',
            'Lower elevation species dominate'
        ],
        locations: [
            {
                name: 'Bear Brook State Park',
                type: 'State Park',
                access: 'Route 28, Allenstown',
                species: ['Chanterelles', 'Black Trumpets', 'Oyster Mushrooms', 'Wine Cap', 'Maitake'],
                microhabitats: ['Mixed hardwood-pine', 'Wetland edges', 'Old fields'],
                notes: 'Large park with diverse habitats and good trail access'
            },
            {
                name: 'Hopkinton-Everett Reservoir',
                type: 'Flood Control Area',
                access: 'Route 202, Hopkinton',
                species: ['Oyster Mushrooms', 'Black Trumpets', 'Jelly Ear'],
                microhabitats: ['Floodplain hardwoods', 'Dead timber'],
                notes: 'Water level dependent, best in late summer/fall'
            },
            {
                name: 'Blackwater Dam State Park',
                type: 'State Park',
                access: 'Route 11, Webster',
                species: ['Chanterelles', 'Hedgehogs', 'Wine Cap'],
                microhabitats: ['Lakeside forests', 'Mixed hardwood'],
                notes: 'Small park, check around water features'
            }
        ]
    },
    
    'Belknap County': {
        generalTips: [
            'Lakes region with diverse microclimates',
            'Island habitats may be less picked',
            'Focus on north shores for moisture retention',
            'Mix of elevation creates habitat diversity'
        ],
        locations: [
            {
                name: 'Belknap Mountain State Forest',
                type: 'State Forest',
                access: 'Route 11A, Gilford',
                species: ['Chanterelles', 'King Bolete', 'Hedgehogs', 'Russula'],
                microhabitats: ['Mountain hardwood', 'Ridge lines', 'Protected valleys'],
                notes: 'Good elevation range, multiple trail access points'
            },
            {
                name: 'Ellacoya State Park',
                type: 'State Park',
                access: 'Route 11, Gilford',
                species: ['Oyster Mushrooms', 'Wine Cap', 'Jelly Ear'],
                microhabitats: ['Lakefront hardwoods', 'Beach edge forests'],
                notes: 'Small area, check around facilities and edges'
            },
            {
                name: 'Gunstock Mountain Resort Area',
                type: 'Recreation Area',
                access: 'Route 11A, Gilford',
                species: ['Chanterelles', 'Hedgehogs', 'Black Trumpets'],
                microhabitats: ['Ski trail edges', 'Mid-elevation hardwood'],
                notes: 'Check permission for non-ski season access'
            }
        ]
    },
    
    'Cheshire County': {
        generalTips: [
            'Excellent hardwood forests in Connecticut River valley',
            'Monadnock region provides elevation diversity',
            'Focus on rich, well-drained soils',
            'Long growing season benefits many species'
        ],
        locations: [
            {
                name: 'Monadnock State Park',
                type: 'State Park',
                access: 'Route 124, Jaffrey',
                species: ['Chanterelles', 'King Bolete', 'Hedgehogs', 'Russula', 'Maitake'],
                microhabitats: ['Mountain hardwood', 'Protected valleys', 'Stream corridors'],
                notes: 'Popular mountain, multiple trail options and elevations'
            },
            {
                name: 'Rhododendron State Park',
                type: 'State Park',
                access: 'Route 119, Fitzwilliam',
                species: ['Black Trumpets', 'Chanterelles', 'Oyster Mushrooms'],
                microhabitats: ['Acidic soil areas', 'Rhododendron groves', 'Mixed hardwood'],
                notes: 'Unique habitat, check around bloom areas in season'
            },
            {
                name: 'Pisgah State Park',
                type: 'State Park',
                access: 'Route 63, Chesterfield',
                species: ['Maitake', 'Chanterelles', 'Black Trumpets', 'Wine Cap', 'Beefsteak Polypore'],
                microhabitats: ['Oak forests', 'Wetland edges', 'Old field succession'],
                notes: 'Large park with diverse habitats, multiple access points'
            }
        ]
    },
    
    'Hillsborough County': {
        generalTips: [
            'Most populous county - competition may be higher',
            'Focus on less accessible areas',
            'Urban parks can be surprisingly productive',
            'Southern exposure affects timing and species'
        ],
        locations: [
            {
                name: 'Fox State Forest',
                type: 'State Forest',
                access: 'Route 136, Hillsborough',
                species: ['Chanterelles', 'Black Trumpets', 'Oyster Mushrooms', 'Wine Cap'],
                microhabitats: ['Demonstration forests', 'Wetland borders', 'Trail systems'],
                notes: 'Educational forest with marked trails and diverse management'
            },
            {
                name: 'Greenfield State Park',
                type: 'State Park',
                access: 'Route 136, Greenfield',
                species: ['Oyster Mushrooms', 'Wine Cap', 'Jelly Ear', 'Chanterelles'],
                microhabitats: ['Pond edges', 'Mixed hardwood', 'Camping area edges'],
                notes: 'Small park, check around water features and facilities'
            },
            {
                name: 'Massabesic Lake Area',
                type: 'Manchester Water Works',
                access: 'Various points off Route 121',
                species: ['Black Trumpets', 'Chanterelles', 'Hedgehogs'],
                microhabitats: ['Protected watershed forests', 'Lake edges'],
                notes: 'Large protected area - check access restrictions'
            }
        ]
    },
    
    'Strafford County': {
        generalTips: [
            'Coastal plain influence creates unique conditions',
            'Mix of sandy and clay soils affects species',
            'University area has well-studied forests',
            'Earlier season than northern counties'
        ],
        locations: [
            {
                name: 'Blue Job Mountain State Forest',
                type: 'State Forest',
                access: 'Crown Point Road, Farmington',
                species: ['Chanterelles', 'Hedgehogs', 'Russula', 'Oyster Mushrooms'],
                microhabitats: ['Mountain hardwood', 'Fire tower area', 'Protected slopes'],
                notes: 'Small mountain with good trail access and views'
            },
            {
                name: 'Pawtuckaway State Park',
                type: 'State Park',
                access: 'Route 156, Nottingham',
                species: ['Maitake', 'Chanterelles', 'Black Trumpets', 'Wine Cap'],
                microhabitats: ['Lake edges', 'Boulder fields', 'Mixed forest'],
                notes: 'Unique geology creates diverse microhabitats'
            },
            {
                name: 'Great Bay National Wildlife Refuge',
                type: 'National Wildlife Refuge',
                access: 'Route 4, Newington',
                species: ['Oyster Mushrooms', 'Jelly Ear', 'Wine Cap'],
                microhabitats: ['Salt marsh edges', 'Upland forests', 'Edge habitats'],
                notes: 'Coastal influence, check regulations for access'
            }
        ]
    },
    
    'Rockingham County': {
        generalTips: [
            'Coastal influence affects moisture and temperature',
            'Urban pressure may impact some locations',
            'Focus on state parks and protected areas',
            'Earlier fruiting season due to warmer temperatures'
        ],
        locations: [
            {
                name: 'Pawtuckaway State Park (Eastern Section)',
                type: 'State Park',
                access: 'Route 101, Epping',
                species: ['Chanterelles', 'Black Trumpets', 'Oyster Mushrooms', 'Wine Cap'],
                microhabitats: ['Hardwood ridges', 'Wetland borders', 'Boulder areas'],
                notes: 'Large park with diverse elevation and soil types'
            },
            {
                name: 'Bear Brook State Park (Eastern Extension)',
                type: 'State Park',
                access: 'Route 28, Deerfield',
                species: ['Black Trumpets', 'Chanterelles', 'Maitake', 'Wine Cap'],
                microhabitats: ['Pine-oak forests', 'Stream valleys'],
                notes: 'Extension of Merrimack County park, different soil types'
            },
            {
                name: 'Kingston State Park',
                type: 'State Park',
                access: 'Route 125, Kingston',
                species: ['Oyster Mushrooms', 'Wine Cap', 'Jelly Ear'],
                microhabitats: ['Beach pond edges', 'Pine groves'],
                notes: 'Small coastal plain park, unique sandy soils'
            },
            {
                name: 'Exeter River Local Access',
                type: 'Town Conservation Land',
                access: 'Various points along Route 108',
                species: ['Black Trumpets', 'Oyster Mushrooms', 'Chanterelles'],
                microhabitats: ['River corridor forests', 'Floodplain hardwoods'],
                notes: 'Multiple small access points, check local regulations'
            }
        ]
    }
};

/**
 * Get public land recommendations for a specific county
 * @param {string} county - County name
 * @returns {Object} County-specific land data
 */
export function getCountyLandData(county) {
    return publicLandData[county] || null;
}

/**
 * Search for locations by species
 * @param {string} species - Species name to search for
 * @returns {Array} Array of locations where species can be found
 */
export function getLocationsBySpecies(species) {
    const results = [];
    
    Object.entries(publicLandData).forEach(([county, data]) => {
        data.locations.forEach(location => {
            if (location.species.includes(species)) {
                results.push({
                    county,
                    ...location
                });
            }
        });
    });
    
    return results;
}

/**
 * Get all unique species mentioned in public land data
 * @returns {Array} Array of unique species names
 */
export function getAllSpeciesInLandData() {
    const speciesSet = new Set();
    
    Object.values(publicLandData).forEach(countyData => {
        countyData.locations.forEach(location => {
            location.species.forEach(species => {
                speciesSet.add(species);
            });
        });
    });
    
    return Array.from(speciesSet).sort();
}
