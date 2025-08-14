// publicLand.js - Public land data and recommendations
// v3.2.1: Location data now protected behind authentication

import { auth } from './authentication.js';

// Enhanced Public Land Data - Species-Specific Locations
export const publicLandData = {
    'Coos County': {
        general: {
            climate: 'High-elevation boreal, 1,200-3,000+ ft, extended seasons',
            soils: 'Acidic forest soils, well-drained, podzol in conifer areas',
            bestMonths: 'July-October (extended by elevation)',
            weatherStation: 'Berlin Regional Airport (KBML): 44.5754°N, -71.1759°W, 1,026ft',
            dataQuality: '✅ RESEARCH-BACKED for matsutake, chanterelles; field-validated locations',
            totalAcres: '750,000+ (WMNF) + 39,601 (Nash Stream) + municipal forests'
        },
        landsBySpecies: {
            matsutake: [
                {
                    name: 'Nash Stream State Forest - High Elevation Zones',
                    gps: '44.7089,-71.4828',
                    elevationRange: [2000, 3000],
                    access: 'Multiple trailheads off Route 110',
                    habitat: 'Podzol soils under hemlock-spruce stands above 2000ft',
                    bestAreas: ['Nash Stream Trail upper sections', 'East Side Trail ridges', 'Percy Loop high elevation'],
                    soilType: 'Spodosol (podzol), pH 4.0-4.8, sandy-rocky',
                    dominantTrees: ['Eastern Hemlock 50%', 'Red Spruce 30%', 'Balsam Fir 20%'],
                    timing: 'September-October peak season',
                    trailMarkers: ['Nash Stream Road Mile 3.2', 'East Side Trail junction', 'Percy Loop Trail'],
                    parkingGPS: '44.7089,-71.4828',
                    contact: 'Nash Stream: (603) 788-4157',
                    note: '🎯 PREMIER: Best-documented matsutake habitat in NH',
                    quality: 'high'
                },
                {
                    name: 'WMNF - Androscoggin District (Presidential Range)',
                    gps: '44.3128,-71.3032',
                    elevationRange: [2500, 4000],
                    access: 'Permit required - Contact (603) 466-2713',
                    habitat: 'High elevation hemlock groves with podzol development',
                    bestAreas: ['Presidential Range approach trails above 2500ft', 'Carter-Moriah Ridge hemlock stands'],
                    soilType: 'Shallow podzolic soils over granite bedrock',
                    dominantTrees: ['Red Spruce 40%', 'Eastern Hemlock 35%', 'Balsam Fir 25%'],
                    timing: 'Late August-September',
                    trailMarkers: ['Appalachian Trail junctions', 'Carter Notch Trail', 'Nineteen Mile Brook Trail'],
                    parkingGPS: '44.2619,-71.2531',
                    contact: 'WMNF Androscoggin: (603) 466-2713',
                    permitInfo: 'Commercial permit required for harvesting',
                    note: '🏔️ HIGH ELEVATION: Rocky terrain, advanced hiking required',
                    quality: 'high'
                },
                {
                    name: 'Coleman State Park - Conifer Zones',
                    gps: '44.8500,-71.3500',
                    elevationRange: [2200, 2600],
                    access: 'State park entrance, day use fee',
                    habitat: 'Mixed northern hardwood-conifer around Little Diamond Pond',
                    bestAreas: ['Conifer stands around pond', 'North-facing hemlock slopes'],
                    soilType: 'Well-drained acidic forest soils with organic layer',
                    dominantTrees: ['Eastern Hemlock 40%', 'Red Spruce 30%', 'Sugar Maple 20%', 'Yellow Birch 10%'],
                    timing: 'September',
                    parkingGPS: '44.8500,-71.3500',
                    contact: 'NH State Parks: (603) 538-6965',
                    note: '⚠️ CHECK REGULATIONS: State park foraging restrictions apply',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Nash Stream - Mixed Forest Transitions',
                    gps: '44.7089,-71.4828',
                    elevationRange: [1400, 2500],
                    access: 'Trail system throughout forest',
                    habitat: 'Hardwood-conifer transitions, mossy areas with good drainage',
                    bestAreas: ['Nash Stream Trail lower sections', 'Whitcomb Brook drainage', 'North-facing slopes'],
                    soilType: 'Well-drained acidic forest soils, pH 4.5-5.5',
                    dominantTrees: ['Sugar Maple 30%', 'Yellow Birch 25%', 'Eastern Hemlock 25%', 'Red Spruce 20%'],
                    timing: 'July-September peak',
                    trailMarkers: ['Nash Stream Road bridges', 'Whitcomb Brook Trail junction'],
                    parkingGPS: '44.7089,-71.4828',
                    contact: 'Nash Stream: (603) 788-4157',
                    note: '✅ EXCELLENT: Abundant after summer rains, mossy microhabitats',
                    quality: 'high'
                },
                {
                    name: 'WMNF - Kilkenny Ridge Trail System',
                    gps: '44.6000,-71.3500',
                    elevationRange: [1800, 3200],
                    access: 'Multiple WMNF trailheads',
                    habitat: 'Mixed hardwood-conifer with excellent moisture retention',
                    bestAreas: ['Kilkenny Ridge Trail mid-sections', 'Unknown Pond area', 'Rogers Ledge approaches'],
                    soilType: 'Rich forest soils with thick organic layer',
                    dominantTrees: ['American Beech 35%', 'Sugar Maple 25%', 'Yellow Birch 20%', 'Red Spruce 20%'],
                    timing: 'July-August',
                    trailMarkers: ['Kilkenny Ridge Trail blazes', 'Unknown Pond Trail'],
                    parkingGPS: '44.5833,-71.3667',
                    contact: 'WMNF Androscoggin: (603) 466-2713',
                    note: '🥾 MODERATE HIKE: Good trail system, reliable fruiting',
                    quality: 'high'
                }
            ],
            blacktrumpets: [
                {
                    name: 'Mature Hardwood Stands - Nash Stream',
                    gps: '44.7089,-71.4828',
                    elevationRange: [1200, 2000],
                    habitat: 'Mature beech-maple forests with thick leaf litter',
                    bestAreas: ['Lower elevation hardwood stands', 'Stream drainage mature forests'],
                    timing: 'August-October',
                    note: '🍂 PRIME HABITAT: Thick leaf litter, mature beech associations',
                    quality: 'high'
                }
            ],
            kingbolete: [
                {
                    name: 'WMNF - Diverse Mycorrhizal Zones',
                    gps: '44.3128,-71.3032',
                    elevationRange: [800, 3500],
                    habitat: 'Diverse tree species across elevation gradient',
                    bestAreas: ['Mixed age forest stands', 'Elevation transition zones', 'Stream drainages'],
                    timing: 'August-October',
                    note: '🌲 DIVERSE PARTNERS: Exceptional mycorrhizal diversity across elevations',
                    quality: 'high'
                }
            ],
            sweettooth: [
                {
                    name: 'Mixed Conifer-Hardwood Zones',
                    elevationRange: [1200, 2800],
                    habitat: 'Well-drained mixed forests with pine-oak transitions',
                    bestAreas: ['Pine-hardwood ecotones', 'Mixed age forest stands'],
                    timing: 'August-October',
                    note: '🦔 SUBGENUS DIVERSITY: All three Hydnum groups possible',
                    quality: 'high'
                }
            ]
        }
    },
    'Merrimack County': {
        general: {
            climate: 'Central valley, 400-1,500 ft, moderate seasons',
            soils: 'Rich valley soils, well-drained Group IA loams',
            bestMonths: 'June-September',
            weatherStation: 'Concord Municipal Airport: 43.2027°N, -71.5021°W, 342ft',
            dataQuality: '✅ RESEARCH-BACKED for Bear Brook locations; extensive trail documentation',
            totalAcres: '10,000 (Bear Brook) + multiple municipal forests'
        },
        landsBySpecies: {
            morels: [
                {
                    name: 'Bear Brook State Park - Old Apple Orchards',
                    gps: '43.1667,-71.3333',
                    elevationRange: [400, 900],
                    access: 'Multiple trailheads, state park access',
                    habitat: 'Historic apple orchard sites and ash groves',
                    bestAreas: ['Old orchard clearings', 'Ash groves near Suncook River'],
                    soilType: 'Rich, well-drained loams',
                    dominantTrees: ['Old Apple', 'White Ash', 'Sugar Maple'],
                    timing: 'Late April-May',
                    trailMarkers: ['Bear Brook Trail', 'Podunk Road access'],
                    contact: 'Bear Brook SP: (603) 485-9874',
                    note: '🍏 CLASSIC ORCHARD: Best morel habitat in central NH',
                    quality: 'high'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Bear Brook State Park - Mixed Hardwood Forests',
                    gps: '43.1667,-71.3333',
                    elevationRange: [500, 1200],
                    access: 'State park trail system',
                    habitat: 'Mixed oak-beech-maple forests with good drainage',
                    bestAreas: ['Catamount Hill Trail', 'Podunk Road hardwood stands'],
                    soilType: 'Well-drained upland soils',
                    dominantTrees: ['Red Oak', 'American Beech', 'Sugar Maple'],
                    timing: 'July-August',
                    trailMarkers: ['Catamount Hill Trail'],
                    contact: 'Bear Brook SP: (603) 485-9874',
                    note: '🌳 PRIME HARDWOODS: Best central NH chanterelle habitat',
                    quality: 'high'
                }
            ],
            kingbolete: [
                {
                    name: 'Bear Brook State Park - Oak Ridges',
                    gps: '43.1667,-71.3333',
                    elevationRange: [600, 1200],
                    access: 'State park trail system',
                    habitat: 'Oak-dominated ridges and slopes',
                    bestAreas: ['Oak ridge trails', 'South-facing slopes'],
                    soilType: 'Well-drained upland soils',
                    dominantTrees: ['Red Oak', 'White Oak'],
                    timing: 'August-September',
                    trailMarkers: ['Bear Brook Trail'],
                    contact: 'Bear Brook SP: (603) 485-9874',
                    note: '🌰 OAK SPECIALIST: Best boletes on oak ridges',
                    quality: 'medium'
                }
            ],
            oyster: [
                {
                    name: 'Bear Brook State Park - Deadwood Zones',
                    habitat: 'Dead and dying hardwoods in moist forest areas',
                    bestAreas: ['Streamside deadwood', 'Storm-damaged trees'],
                    timing: 'Year-round, peak fall-winter',
                    note: '🪵 DEADWOOD: Abundant substrate in park',
                    quality: 'medium'
                }
            ],
            winecap: [
                {
                    name: 'Municipal Parks and Gardens',
                    habitat: 'Wood chip mulch in parks and gardens',
                    bestAreas: ['Concord city parks', 'Community gardens'],
                    timing: 'June-September',
                    note: '🌱 URBAN MULCH: Best after fresh mulch application',
                    quality: 'medium'
                }
            ]
        }
    },
    'Grafton County': {
        general: {
            climate: 'Western mountains, 800-4,000+ ft, WMNF coverage',
            soils: 'Variable by elevation - valley loams to mountain podzols',
            bestMonths: 'July-October (elevation dependent)',
            weatherStation: 'Lebanon Municipal Airport: 43.6261°N, -72.3042°W, 603ft',
            dataQuality: '✅ RESEARCH-BACKED for WMNF districts; extensive high-elevation data',
            totalAcres: '750,000+ (WMNF Pemigewasset District) + municipal forests'
        },
        landsBySpecies: {
            matsutake: [
                {
                    name: 'Nash Stream State Forest - High Elevation Zones',
                    gps: '44.7089,-71.4828',
                    elevationRange: [2000, 3000],
                    access: 'Multiple trailheads off Route 110',
                    habitat: 'Podzol soils under hemlock-spruce stands above 2000ft',
                    bestAreas: ['Nash Stream Trail upper sections', 'East Side Trail ridges', 'Percy Loop high elevation'],
                    soilType: 'Spodosol (podzol), pH 4.0-4.8, sandy-rocky',
                    dominantTrees: ['Eastern Hemlock 50%', 'Red Spruce 30%', 'Balsam Fir 20%'],
                    timing: 'September-October peak season',
                    trailMarkers: ['Nash Stream Road Mile 3.2', 'East Side Trail junction', 'Percy Loop Trail'],
                    parkingGPS: '44.7089,-71.4828',
                    contact: 'Nash Stream: (603) 788-4157',
                    note: '🎯 PREMIER: Best-documented matsutake habitat in NH',
                    quality: 'high'
                },
                {
                    name: 'WMNF - Androscoggin District (Presidential Range)',
                    gps: '44.3128,-71.3032',
                    elevationRange: [2500, 4000],
                    access: 'Permit required - Contact (603) 466-2713',
                    habitat: 'High elevation hemlock groves with podzol development',
                    bestAreas: ['Presidential Range approach trails above 2500ft', 'Carter-Moriah Ridge hemlock stands'],
                    soilType: 'Shallow podzolic soils over granite bedrock',
                    dominantTrees: ['Red Spruce 40%', 'Eastern Hemlock 35%', 'Balsam Fir 25%'],
                    timing: 'Late August-September',
                    trailMarkers: ['Appalachian Trail junctions', 'Carter Notch Trail', 'Nineteen Mile Brook Trail'],
                    parkingGPS: '44.2619,-71.2531',
                    contact: 'WMNF Androscoggin: (603) 466-2713',
                    permitInfo: 'Commercial permit required for harvesting',
                    note: '🏔️ HIGH ELEVATION: Rocky terrain, advanced hiking required',
                    quality: 'high'
                },
                {
                    name: 'Coleman State Park - Conifer Zones',
                    gps: '44.8500,-71.3500',
                    elevationRange: [2200, 2600],
                    access: 'State park entrance, day use fee',
                    habitat: 'Mixed northern hardwood-conifer around Little Diamond Pond',
                    bestAreas: ['Conifer stands around pond', 'North-facing hemlock slopes'],
                    soilType: 'Well-drained acidic forest soils with organic layer',
                    dominantTrees: ['Eastern Hemlock 40%', 'Red Spruce 30%', 'Sugar Maple 20%', 'Yellow Birch 10%'],
                    timing: 'September',
                    parkingGPS: '44.8500,-71.3500',
                    contact: 'NH State Parks: (603) 538-6965',
                    note: '⚠️ CHECK REGULATIONS: State park foraging restrictions apply',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Nash Stream - Mixed Forest Transitions',
                    gps: '44.7089,-71.4828',
                    elevationRange: [1400, 2500],
                    access: 'Trail system throughout forest',
                    habitat: 'Hardwood-conifer transitions, mossy areas with good drainage',
                    bestAreas: ['Nash Stream Trail lower sections', 'Whitcomb Brook drainage', 'North-facing slopes'],
                    soilType: 'Well-drained acidic forest soils, pH 4.5-5.5',
                    dominantTrees: ['Sugar Maple 30%', 'Yellow Birch 25%', 'Eastern Hemlock 25%', 'Red Spruce 20%'],
                    timing: 'July-September peak',
                    trailMarkers: ['Nash Stream Road bridges', 'Whitcomb Brook Trail junction'],
                    parkingGPS: '44.7089,-71.4828',
                    contact: 'Nash Stream: (603) 788-4157',
                    note: '✅ EXCELLENT: Abundant after summer rains, mossy microhabitats',
                    quality: 'high'
                },
                {
                    name: 'WMNF - Kilkenny Ridge Trail System',
                    gps: '44.6000,-71.3500',
                    elevationRange: [1800, 3200],
                    access: 'Multiple WMNF trailheads',
                    habitat: 'Mixed hardwood-conifer with excellent moisture retention',
                    bestAreas: ['Kilkenny Ridge Trail mid-sections', 'Unknown Pond area', 'Rogers Ledge approaches'],
                    soilType: 'Rich forest soils with thick organic layer',
                    dominantTrees: ['American Beech 35%', 'Sugar Maple 25%', 'Yellow Birch 20%', 'Red Spruce 20%'],
                    timing: 'July-August',
                    trailMarkers: ['Kilkenny Ridge Trail blazes', 'Unknown Pond Trail'],
                    parkingGPS: '44.5833,-71.3667',
                    contact: 'WMNF Androscoggin: (603) 466-2713',
                    note: '🥾 MODERATE HIKE: Good trail system, reliable fruiting',
                    quality: 'high'
                },
                {
                    name: 'Connecticut River Valley - Lower Elevations',
                    gps: '43.9778,-72.0000',
                    elevationRange: [400, 1200],
                    access: 'Multiple town forests and conservation areas',
                    habitat: 'Rich valley hardwood forests with good drainage',
                    bestAreas: ['Valley floor hardwood stands', 'Stream terrace forests', 'Municipal forest areas'],
                    soilType: 'Rich alluvial soils, well-drained',
                    dominantTrees: ['Sugar Maple 40%', 'American Beech 30%', 'White Ash 20%', 'Paper Birch 10%'],
                    timing: 'July-August',
                    contact: 'Local town offices for municipal forest access',
                    note: '🏞️ VALLEY HABITAT: Rich soils, earlier season timing',
                    quality: 'medium'
                }
            ],
            blacktrumpets: [
                {
                    name: 'Mature Hardwood Stands - Nash Stream',
                    gps: '44.7089,-71.4828',
                    elevationRange: [1200, 2000],
                    habitat: 'Mature beech-maple forests with thick leaf litter',
                    bestAreas: ['Lower elevation hardwood stands', 'Stream drainage mature forests'],
                    timing: 'August-October',
                    note: '🍂 PRIME HABITAT: Thick leaf litter, mature beech associations',
                    quality: 'high'
                }
            ],
            kingbolete: [
                {
                    name: 'WMNF - Diverse Mycorrhizal Zones',
                    gps: '44.3128,-71.3032',
                    elevationRange: [800, 3500],
                    habitat: 'Diverse tree species across elevation gradient',
                    bestAreas: ['Mixed age forest stands', 'Elevation transition zones', 'Stream drainages'],
                    timing: 'August-October',
                    note: '🌲 DIVERSE PARTNERS: Exceptional mycorrhizal diversity across elevations',
                    quality: 'high'
                },
                {
                    name: 'WMNF - Elevation Gradient Mycorrhizal Zones',
                    gps: '44.0579,-71.5376',
                    elevationRange: [1000, 3500],
                    habitat: 'Diverse mycorrhizal partners across major elevation gradient',
                    bestAreas: ['Valley to mountain transition zones', 'Mixed age forest stands', 'Stream drainage systems'],
                    timing: 'August-October',
                    note: '🍄 EXCEPTIONAL DIVERSITY: Widest range of mycorrhizal partners in state',
                    quality: 'high'
                }
            ],
            sweettooth: [
                {
                    name: 'Mixed Conifer-Hardwood Zones',
                    elevationRange: [1200, 2800],
                    habitat: 'Well-drained mixed forests with pine-oak transitions',
                    bestAreas: ['Pine-hardwood ecotones', 'Mixed age forest stands'],
                    timing: 'August-October',
                    note: '🦔 SUBGENUS DIVERSITY: All three Hydnum groups possible',
                    quality: 'high'
                },
                {
                    name: 'Mixed Conifer-Hardwood Transition Zones',
                    elevationRange: [1200, 3000],
                    habitat: 'Well-drained mixed forests across elevation bands',
                    bestAreas: ['Pine-hardwood ecotones', 'Elevation transition zones'],
                    timing: 'August-October',
                    note: '🦔 DIVERSE HABITATS: All Hydnum subgenera represented',
                    quality: 'high'
                }
            ]
        }
    },
    'Carroll County': {
        general: {
            climate: 'Eastern mountains, 600-6,288 ft, White Mountain core',
            soils: 'Rocky, well-drained, acidic mountain soils over granite',
            bestMonths: 'August-October',
            weatherStation: 'Mount Washington Regional Airport: 43.9578°N, -71.1742°W, 1,274ft',
            dataQuality: '✅ RESEARCH-BACKED for WMNF Saco District; highest elevation habitats',
            totalAcres: '750,000+ (WMNF Saco District) + Echo Lake SP + municipal forests'
        },
        landsBySpecies: {
            matsutake: [
                {
                    name: 'WMNF - Saco District High Elevation Zones',
                    gps: '44.0684,-71.2286',
                    elevationRange: [2500, 5000],
                    access: 'Permit required - Contact (603) 447-5448',
                    habitat: 'High elevation hemlock-spruce with shallow podzolic soils over granite',
                    bestAreas: ['Presidential Range high elevation approaches', 'Mount Washington area below treeline', 'Carter-Moriah Range'],
                    soilType: 'Shallow podzolic soils over granite bedrock, very well-drained',
                    dominantTrees: ['Red Spruce 40%', 'Eastern Hemlock 35%', 'Balsam Fir 25%'],
                    timing: 'Late August-September',
                    trailMarkers: ['Appalachian Trail White Mountain section', 'Mount Washington Auto Road area', 'Carter Notch Trail'],
                    parkingGPS: '44.2619,-71.2531',
                    contact: 'WMNF Saco District: (603) 447-5448',
                    permitInfo: 'Commercial permit required, contact district office',
                    note: '⛰️ EXTREME ELEVATION: Highest matsutake habitat in Northeast, challenging access',
                    quality: 'high'
                },
                {
                    name: 'Echo Lake State Park - Hemlock Zones',
                    gps: '44.0822,-71.1956',
                    elevationRange: [1200, 2000],
                    access: 'State park entrance, moderate elevation access',
                    habitat: 'Hemlock-hardwood-pine forest around glacial lake with moisture-rich microclimates',
                    bestAreas: ['Hemlock stands around Echo Lake', 'North-facing slopes', 'Higher elevation zones'],
                    soilType: 'Well-drained forest soils with good organic development',
                    dominantTrees: ['Eastern Hemlock 45%', 'White Pine 25%', 'Sugar Maple 20%', 'Yellow Birch 10%'],
                    timing: 'September',
                    parkingGPS: '44.0822,-71.1956',
                    contact: 'Echo Lake SP: (603) 356-2672',
                    note: '⚠️ STATE PARK: Verify current foraging regulations before visiting',
                    quality: 'medium'
                }
            ],
            sweettooth: [
                {
                    name: 'WMNF - Mixed Conifer-Hardwood Mountain Forests',
                    gps: '44.0684,-71.2286',
                    elevationRange: [1500, 3500],
                    access: 'WMNF trail system, permit for commercial harvesting',
                    habitat: 'Well-drained mixed forests across steep elevation gradients',
                    bestAreas: ['Mid-elevation mixed stands', 'Pine-hardwood transition zones', 'Stream drainage areas'],
                    soilType: 'Rocky, well-drained mountain forest soils',
                    dominantTrees: ['Variable by elevation - hemlock, spruce, pine, birch, maple'],
                    timing: 'August-October',
                    trailMarkers: ['White Mountain trail system - extensive network'],
                    contact: 'WMNF Saco District: (603) 447-5448',
                    note: '🏔️ MOUNTAIN HABITAT: Excellent mixed conifer-hardwood for all Hydnum groups',
                    quality: 'high'
                }
            ],
            kingbolete: [
                {
                    name: 'WMNF - Presidential Range Mycorrhizal Zones',
                    gps: '44.0684,-71.2286',
                    elevationRange: [1000, 4000],
                    habitat: 'Extreme diversity of mycorrhizal partners across dramatic elevation range',
                    bestAreas: ['Valley hardwoods to subalpine conifers', 'Stream drainages', 'Mixed forest zones'],
                    timing: 'August-October',
                    note: '🗻 ULTIMATE DIVERSITY: Greatest elevation range and mycorrhizal variety',
                    quality: 'high'
                }
            ]
        }
    },
    'Cheshire County': {
        general: {
            climate: 'Southwest hardwood zone, 300-3,165 ft (Mount Monadnock)',
            soils: 'Rich hardwood forest soils, well-drained valley to mountain',
            bestMonths: 'July-October',
            weatherStation: 'Keene-Dillant Hopkins Airport: 42.8984°N, -72.2708°W, 488ft',
            dataQuality: 'Habitat-based with field validation for mature hardwood species',
            totalAcres: '13,500+ (Pisgah SP) + extensive municipal forests + conservation lands'
        },
        landsBySpecies: {
            blacktrumpets: [
                {
                    name: 'Pisgah State Park - Mature Hardwood Complex',
                    gps: '42.8667,-72.4167',
                    elevationRange: [400, 1500],
                    access: 'Multiple trailheads, extensive 13,500+ acre preserve',
                    habitat: "NH's largest state park with mature beech-oak forests and thick mossy understory",
                    bestAreas: ['Kilburn Loop Trail old growth sections', 'Nash Trail beech stands', 'Parker Trail north-facing slopes'],
                    soilType: 'Rich, moist hardwood forest soils with thick organic layer',
                    dominantTrees: ['American Beech 45%', 'Red Oak 25%', 'Sugar Maple 20%', 'White Oak 10%'],
                    timing: 'August-October peak season',
                    trailMarkers: ['Kilburn Loop Trail', 'Nash Trail system', 'Parker Trail network'],
                    parkingGPS: '42.8667,-72.4167',
                    contact: 'Pisgah SP: (603) 239-8153',
                    note: '⚠️ STATE PARK: Largest in NH, verify current foraging regulations',
                    quality: 'high'
                },
                {
                    name: 'Monadnock Region - Municipal Hardwood Forests',
                    gps: '42.8600,-72.1000',
                    elevationRange: [500, 2000],
                    access: 'Various town forests with permission',
                    habitat: 'Mature hardwood stands throughout Monadnock region',
                    bestAreas: ['Town forests with mature beech-maple', 'Conservation land hardwood stands'],
                    soilType: 'Rich hardwood forest soils',
                    dominantTrees: ['American Beech 40%', 'Sugar Maple 35%', 'Red Oak 25%'],
                    timing: 'August-October',
                    contact: 'Individual town offices for access permission',
                    note: '🏛️ MUNICIPAL ACCESS: Contact towns for forest access permissions',
                    quality: 'medium'
                }
            ],
            maitake: [
                {
                    name: 'Cheshire County - Oak-Dominated Ridge Systems',
                    gps: '42.9000,-72.3000',
                    elevationRange: [400, 2000],
                    access: 'Various public and conservation lands',
                    habitat: 'Extensive mature oak stands on ridges and south-facing slopes',
                    bestAreas: ['Ridge-top oak forests', 'Mature red and white oak groves', 'Base of large oak trees 80+ years old'],
                    soilType: 'Well-drained upland forest soils, slightly acidic',
                    dominantTrees: ['Red Oak 50%', 'White Oak 30%', 'Sugar Maple 15%', 'American Beech 5%'],
                    timing: 'September-October',
                    contact: 'Monadnock Conservancy: (603) 357-0600',
                    note: '🌳 OAK PARADISE: Extensive mature oak habitat, excellent for maitake',
                    quality: 'high'
                }
            ],
            beefsteak: [
                {
                    name: 'Oak Forest Areas - Trunk Parasites',
                    habitat: 'Living oak trees with trunk wounds, stress, or cavity access',
                    bestAreas: ['Edge oak trees with trunk access', 'Storm-damaged oaks', 'Mature oak stands'],
                    timing: 'August-October',
                    note: '🥩 PARASITIC HABITAT: Look for bracket fungi on living oak trunks',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Mixed Hardwood Transition Zones',
                    elevationRange: [400, 1800],
                    habitat: 'Mixed hardwood forests with good drainage and mossy areas',
                    bestAreas: ['North-facing hardwood slopes', 'Stream drainage hardwood areas'],
                    timing: 'July-September',
                    note: '🍄 MODERATE POTENTIAL: Good hardwood habitat, less ideal than northern counties',
                    quality: 'medium'
                }
            ]
        }
    },
    'Hillsborough County': {
        general: {
            climate: 'South-central transition zone, 200-2,000 ft, most developed county',
            soils: 'Variable - urban soils to forest remnants, fragmented habitat',
            bestMonths: 'June-October',
            weatherStation: 'Manchester-Boston Regional Airport: 42.9326°N, -71.4357°W, 266ft',
            dataQuality: 'Habitat-based for urban/suburban species, limited forest access',
            totalAcres: 'Fragmented forests + multiple municipal parks + Fox State Forest'
        },
        landsBySpecies: {
            winecap: [
                {
                    name: 'Urban Parks and Municipal Landscaping',
                    gps: '42.9956,-71.4548',
                    habitat: 'Wood chip mulch in parks, schools, and landscaped suburban areas',
                    bestAreas: ['Manchester parks with fresh wood chips', 'Nashua municipal areas', 'School grounds landscaping'],
                    soilType: 'Enriched urban soils with organic mulch additions',
                    timing: 'June-October, peak after mulch application',
                    trailMarkers: ['Various city parks and municipal properties'],
                    contact: 'Manchester Parks & Recreation: (603) 624-6444',
                    note: '🏙️ URBAN SPECIALISTS: Excellent suburban habitat, verify property access',
                    quality: 'high'
                },
                {
                    name: 'Fox State Forest - Managed Trail Areas',
                    gps: '42.9167,-71.9167',
                    elevationRange: [400, 1000],
                    access: 'Public forest with trail system',
                    habitat: 'Trail maintenance areas with wood chip applications',
                    bestAreas: ['Trail intersections with maintenance', 'Parking areas with mulch'],
                    timing: 'June-September',
                    parkingGPS: '42.9167,-71.9167',
                    contact: 'Fox State Forest: (603) 464-3453',
                    note: '🌲 FOREST ACCESS: Public forest with trail maintenance habitat',
                    quality: 'medium'
                }
            ],
            shaggymane: [
                {
                    name: 'Suburban Lawns and Disturbed Areas',
                    habitat: 'Rich lawns, parks, construction sites, and recently disturbed soils',
                    bestAreas: ['Suburban neighborhoods with rich lawns', 'Municipal parks and recreation areas', 'Construction zones (with permission)'],
                    soilType: 'Rich, fertilized urban and suburban soils',
                    timing: 'Spring and fall after rain events',
                    contact: 'Property owners for private land access',
                    note: '🏘️ URBAN ADAPTER: Common in developed areas, always verify access permissions',
                    quality: 'high'
                }
            ],
            oyster: [
                {
                    name: 'Urban Forest Remnants and Parks',
                    habitat: 'Dead and dying hardwood trees in municipal forests and parks',
                    bestAreas: ['Municipal forest dead wood', 'Park storm damage areas', 'Urban forest edge zones'],
                    timing: 'Year-round, peak fall through winter',
                    note: '🪵 URBAN SUBSTRATE: Storm damage and aging trees provide habitat',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Fox State Forest - Limited Hardwood Areas',
                    gps: '42.9167,-71.9167',
                    elevationRange: [400, 1000],
                    habitat: 'Mixed hardwood forest sections with adequate drainage',
                    bestAreas: ['North-facing slopes', 'Stream drainage areas'],
                    timing: 'July-August',
                    note: '🌳 LIMITED HABITAT: Fragmented forest, lower probability than northern counties',
                    quality: 'low'
                }
            ]
        }
    },
    'Sullivan County': {
        general: {
            climate: 'Connecticut River valley, 300-2,800 ft, mixed habitats',
            soils: 'Rich valley alluvial soils to upland forest soils',
            bestMonths: 'July-September',
            weatherStation: 'Claremont-Stevens Field: 43.3703°N, -72.3711°W, 533ft',
            dataQuality: 'Habitat-based with historical farm site documentation',
            totalAcres: 'Connecticut River valley + Mount Sunapee area + municipal forests'
        },
        landsBySpecies: {
            morels: [
                {
                    name: 'Connecticut River Valley - Historic Farm Sites',
                    gps: '43.3500,-72.2000',
                    elevationRange: [300, 800],
                    access: 'Multiple town forests and conservation areas along river valley',
                    habitat: 'Extensive historic farm sites with old apple orchards and ash-elm groves',
                    bestAreas: ['Abandoned orchard sites', 'Old farm foundation areas', 'Valley bottom ash-elm stands'],
                    soilType: 'Rich alluvial valley soils, well-drained with agricultural enrichment',
                    dominantTrees: ['Old Apple varieties', 'White Ash 40%', 'American Elm 30%', 'Sugar Maple 20%', 'Paper Birch 10%'],
                    timing: 'Late April through May',
                    trailMarkers: ['Connecticut River valley town forests', 'Historic farm markers'],
                    contact: 'Upper Valley Land Trust: (603) 643-6626',
                    note: '🍎 ORCHARD GOLD: Extensive historic apple orchard areas, classic morel terrain',
                    quality: 'high'
                },
                {
                    name: 'Mount Sunapee Area - Elevation Farm Sites',
                    gps: '43.3167,-72.0833',
                    elevationRange: [800, 1500],
                    access: 'Various conservation lands and town forests',
                    habitat: 'Higher elevation historic farm sites with later spring timing',
                    bestAreas: ['Mountain farm clearings', 'Old logging roads with ash regeneration'],
                    timing: 'May into early June (elevation delay)',
                    note: '⛰️ ELEVATION ADVANTAGE: Extended season due to elevation, good ash habitat',
                    quality: 'medium'
                }
            ],
            blacktrumpets: [
                {
                    name: 'Upland Hardwood Forests - Beech-Maple Stands',
                    gps: '43.4000,-72.1500',
                    elevationRange: [600, 2000],
                    access: 'Multiple conservation areas and town forests',
                    habitat: 'Mature beech-maple forests with thick understory development',
                    bestAreas: ['North-facing hardwood slopes', 'Mature forest stands away from development'],
                    soilType: 'Rich hardwood forest soils with thick organic layer',
                    dominantTrees: ['American Beech 40%', 'Sugar Maple 35%', 'Yellow Birch 15%', 'Red Oak 10%'],
                    timing: 'August-October',
                    contact: 'Local conservation commissions',
                    note: '🍂 HARDWOOD HAVEN: Excellent mature hardwood habitat for black trumpets',
                    quality: 'high'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Mixed Valley and Upland Forests',
                    elevationRange: [400, 1800],
                    habitat: 'Transitional hardwood-conifer forests with good moisture retention',
                    bestAreas: ['Stream drainage mixed forests', 'North-facing mixed slopes'],
                    timing: 'July-August',
                    note: '🌲 MIXED HABITAT: Good potential in transitional forest zones',
                    quality: 'medium'
                }
            ]
        }
    },
    'Belknap County': {
        general: {
            climate: 'Lakes region, 500-2,400 ft (Belknap Range), moderate elevation',
            soils: 'Sandy lake soils to forested upland soils, glacial influence',
            bestMonths: 'July-September',
            weatherStation: 'Laconia Municipal Airport: 43.5727°N, -71.4189°W, 545ft',
            dataQuality: 'Habitat-based for lakes region ecology and elevation zones',
            totalAcres: 'Belknap Mountain State Forest + multiple lake shore forests'
        },
        landsBySpecies: {
            matsutake: [
                {
                    name: 'Belknap Mountain Range - Higher Elevation Conifers',
                    gps: '43.5167,-71.4500',
                    elevationRange: [1500, 2400],
                    access: 'Belknap Mountain State Forest trail system',
                    habitat: 'Conifer stands with well-drained soils on mountain ridges',
                    bestAreas: ['Pine-hemlock stands on ridges', 'Higher elevation conifer zones', 'North-facing conifer slopes'],
                    soilType: 'Well-drained mountain forest soils, moderately acidic',
                    dominantTrees: ['White Pine 40%', 'Eastern Hemlock 35%', 'Red Oak 15%', 'Red Maple 10%'],
                    timing: 'September-October',
                    trailMarkers: ['Belknap Mountain Trail', 'Green Trail system'],
                    parkingGPS: '43.5167,-71.4500',
                    contact: 'Belknap Mountain State Forest: (603) 271-2214',
                    note: '⛰️ MODERATE ELEVATION: Limited but possible matsutake habitat',
                    quality: 'medium'
                }
            ],
            oyster: [
                {
                    name: 'Lake Shore Forest Areas',
                    habitat: 'Dead and dying hardwoods in forests near lakes and wetlands',
                    bestAreas: ['Lake shore forests with dead wood', 'Wetland edge dying trees', 'Storm damage areas near water'],
                    timing: 'Year-round, peak fall-winter',
                    note: '🏞️ LAKE ECOLOGY: Good dead wood habitat enhanced by lake moisture',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Mixed Upland Forests',
                    elevationRange: [600, 2000],
                    habitat: 'Mixed hardwood-conifer forests on well-drained upland sites',
                    bestAreas: ['Upland mixed forests', 'North-facing slopes'],
                    timing: 'July-August',
                    note: '🌲 MODERATE HABITAT: Decent mixed forest potential',
                    quality: 'medium'
                }
            ]
        }
    },
    'Strafford County': {
        general: {
            climate: 'Southeastern mixed zone, 100-1,900 ft, lower elevation',
            soils: 'Variable coastal influence to inland forest soils',
            bestMonths: 'July-September',
            weatherStation: 'Portsmouth International at Pease: 43.0779°N, -70.8197°W, 100ft',
            dataQuality: 'Habitat-based for southeastern NH ecology',
            totalAcres: 'Blue Job State Forest + multiple municipal forests'
        },
        landsBySpecies: {
            jellyear: [
                {
                    name: 'Wetland Edge Areas and Stream Corridors',
                    habitat: 'Elder and hardwood trees near water sources, wetland edges',
                    bestAreas: ['Stream corridors with elder thickets', 'Wetland border hardwoods', 'Low-lying hardwood areas'],
                    soilType: 'Moist to wet soils near water sources',
                    dominantTrees: ['Elder (Sambucus)', 'Red Maple', 'Swamp White Oak', 'Paper Birch'],
                    timing: 'Year-round, peak fall-winter-spring',
                    note: '💧 WETLAND SPECIALIST: Good elder and wetland hardwood habitat',
                    quality: 'medium'
                }
            ],
            oyster: [
                {
                    name: 'Mixed Forest Areas and Municipal Lands',
                    habitat: 'Dead and dying hardwood trees in mixed forests and parks',
                    bestAreas: ['Municipal forest dead wood', 'Mixed forest storm damage', 'Park and recreation dead trees'],
                    timing: 'Year-round, peak fall-winter',
                    note: '🪵 STANDARD HABITAT: Typical hardwood substrate availability',
                    quality: 'medium'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Blue Job State Forest - Mixed Forest Areas',
                    gps: '43.2333,-71.0500',
                    elevationRange: [400, 1356],
                    access: 'State forest with hiking trail to summit',
                    habitat: 'Mixed hardwood forest with moderate elevation relief',
                    bestAreas: ['North-facing slopes', 'Stream drainage areas', 'Mixed forest zones'],
                    timing: 'July-August',
                    parkingGPS: '43.2333,-71.0500',
                    contact: 'Blue Job State Forest: (603) 271-2214',
                    note: '🌲 LIMITED POTENTIAL: Lower elevation, moderate habitat quality',
                    quality: 'low'
                }
            ]
        }
    },
    'Rockingham County': {
        general: {
            climate: 'Southeastern coastal, 0-1,900 ft, maritime influence',
            soils: 'Sandy coastal soils to inland forest soils, glacial outwash',
            bestMonths: 'July-September (extended by coastal climate)',
            weatherStation: 'Portsmouth International at Pease: 43.0779°N, -70.8197°W, 100ft',
            dataQuality: 'Habitat-based for coastal and suburban ecology',
            totalAcres: 'Pawtuckaway State Park + coastal municipal forests'
        },
        landsBySpecies: {
            winecap: [
                {
                    name: 'Coastal Development and Suburban Areas',
                    habitat: 'Extensive landscaping, municipal parks, and suburban wood chip applications',
                    bestAreas: ['Coastal town parks with landscaping', 'Suburban neighborhoods with mulch', 'Municipal facility grounds'],
                    soilType: 'Enriched suburban soils with organic mulch additions',
                    timing: 'June-October (extended growing season near coast)',
                    contact: 'Municipal parks departments for access permissions',
                    note: '🏖️ COASTAL ADVANTAGE: Extended growing season, extensive suburban habitat',
                    quality: 'high'
                }
            ],
            shaggymane: [
                {
                    name: 'Coastal Lawns and Developed Areas',
                    habitat: 'Rich coastal lawns, parks, and disturbed areas with maritime climate',
                    bestAreas: ['Coastal town lawns and parks', 'Suburban developments', 'Municipal recreation areas'],
                    soilType: 'Rich, often fertilized coastal area soils',
                    timing: 'Spring and fall, extended season',
                    note: '🌊 COASTAL SPECIALIST: Maritime climate extends growing season',
                    quality: 'high'
                }
            ],
            goldenchanterelle: [
                {
                    name: 'Pawtuckaway State Park - Limited Forest Areas',
                    gps: '43.1000,-71.1833',
                    elevationRange: [200, 1000],
                    access: 'State park with trail system',
                    habitat: 'Mixed pine-oak forests with some hardwood areas',
                    bestAreas: ['Hardwood sections on north slopes', 'Stream drainage mixed areas'],
                    timing: 'July-August',
                    parkingGPS: '43.1000,-71.1833',
                    contact: 'Pawtuckaway SP: (603) 895-3031',
                    note: '⚠️ LIMITED: Coastal influence and sandy soils reduce chanterelle habitat quality',
                    quality: 'low'
                }
            ],
            oyster: [
                {
                    name: 'Coastal Forest and Park Areas',
                    habitat: 'Dead hardwoods in coastal forests and municipal parks',
                    bestAreas: ['Coastal forest dead wood', 'Municipal park storm damage', 'Edge forest dying trees'],
                    timing: 'Year-round, peak fall-winter',
                    note: '🌊 COASTAL SUBSTRATE: Maritime climate affects decomposition rates',
                    quality: 'medium'
                }
            ]
        }
    }
};

// Update recommendations display
export function updateRecommendations(county, speciesKey, publicLandData) {
    const recDiv = document.getElementById('rec-text');
    recDiv.innerHTML = '';
    if (!county || !speciesKey || !publicLandData[county]) {
        recDiv.innerHTML = 'Select a county and species to see specific public land recommendations...';
        return;
    }
    const lands = getSpeciesLandData(publicLandData[county].landsBySpecies, speciesKey);
    if (!lands || lands.length === 0) {
        recDiv.innerHTML = 'No public land recommendations available for this species in this county.';
        return;
    }
    let html = '';
    for (const loc of lands) {
        html += `<div class="rec-location" style="margin-bottom: 1em; border-bottom: 1px solid #ccc; padding-bottom: 0.5em;">
            <strong>${loc.name || ''}</strong><br>`;
        if (loc.gps) html += `<span>GPS: <a href="https://maps.google.com/?q=${loc.gps}" target="_blank">${loc.gps}</a></span><br>`;
        if (loc.elevationRange) html += `<span>Elevation: ${loc.elevationRange[0]}-${loc.elevationRange[1]} ft</span><br>`;
        if (loc.habitat) html += `<span>Habitat: ${loc.habitat}</span><br>`;
        if (loc.bestAreas) html += `<span>Best Areas: ${Array.isArray(loc.bestAreas) ? loc.bestAreas.join(', ') : loc.bestAreas}</span><br>`;
        if (loc.timing) html += `<span>Timing: ${loc.timing}</span><br>`;
        if (loc.soilType) html += `<span>Soil: ${loc.soilType}</span><br>`;
        if (loc.dominantTrees) html += `<span>Trees: ${Array.isArray(loc.dominantTrees) ? loc.dominantTrees.join(', ') : loc.dominantTrees}</span><br>`;
        if (loc.trailMarkers) html += `<span>Trail Markers: ${Array.isArray(loc.trailMarkers) ? loc.trailMarkers.join(', ') : loc.trailMarkers}</span><br>`;
        if (loc.access) html += `<span>Access: ${loc.access}</span><br>`;
        if (loc.parkingGPS) html += `<span>Parking: <a href="https://maps.google.com/?q=${loc.parkingGPS}" target="_blank">${loc.parkingGPS}</a></span><br>`;
        if (loc.contact) html += `<span>Contact: ${loc.contact}</span><br>`;
        if (loc.permitInfo) html += `<span>Permit Info: ${loc.permitInfo}</span><br>`;
        if (loc.note) html += `<span>Note: ${loc.note}</span><br>`;
        if (loc.quality) html += `<span>Quality: <strong>${loc.quality}</strong></span><br>`;
        html += `</div>`;
    }
    recDiv.innerHTML = html;
}

// getCountyLandData function moved to end of file with authentication

/**
 * Helper function to get land data for both old 'kingbolete' key and new individual Boletus species
 * @param {Object} landsBySpecies - The landsBySpecies object from county data
 * @param {string} speciesKey - The species key to look up
 * @returns {Array} Array of locations for the species
 */
export function getSpeciesLandData(landsBySpecies, speciesKey) {
    // If it's one of the new individual Boletus species, return kingbolete data
    const boletusSpecies = [
        'boletusSubcaerulescens',
        'boletusVariipes', 
        'boletusEdulis',
        'boletusAtkinsonii',
        'boletus_separans',
        'boletusNobilis',
        'boletusChippewaensis'
    ];
    
    if (boletusSpecies.includes(speciesKey)) {
        return landsBySpecies['kingbolete'] || [];
    }
    
    // For all other species, return data directly
    return landsBySpecies[speciesKey] || [];
}

/**
 * Get county land data with authentication check for sensitive location information
 * @param {string} countyName - Name of the county
 * @returns {Object} County data with location info conditionally included
 */
export function getCountyLandData(countyName) {
    const countyData = publicLandData[countyName];
    if (!countyData) return null;
    
    // Always return general information (habitat, climate, etc.)
    const result = {
        general: countyData.general
    };
    
    // Only include specific location data if authenticated
    if (auth.hasLocationAccess()) {
        result.landsBySpecies = countyData.landsBySpecies;
    } else {
        // Return limited information for unauthenticated users
        result.landsBySpecies = null;
        result.authRequired = true;
        result.message = "Detailed location information requires authentication to prevent over-harvesting.";
    }
    
    return result;
}

/**
 * Show authentication modal for location access
 */
export function requestLocationAccess() {
    return auth.showLoginModal();
}
