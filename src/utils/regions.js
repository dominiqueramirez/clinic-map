import { REGION_COLORS } from '../constants/design';

/**
 * Maps US state abbreviations to census regions.
 */
const STATE_TO_REGION = {
  CT: 'Northeast', ME: 'Northeast', MA: 'Northeast', NH: 'Northeast',
  RI: 'Northeast', VT: 'Northeast', NJ: 'Northeast', NY: 'Northeast',
  PA: 'Northeast',

  IL: 'Midwest', IN: 'Midwest', MI: 'Midwest', OH: 'Midwest',
  WI: 'Midwest', IA: 'Midwest', KS: 'Midwest', MN: 'Midwest',
  MO: 'Midwest', NE: 'Midwest', ND: 'Midwest', SD: 'Midwest',

  DE: 'South', FL: 'South', GA: 'South', MD: 'South',
  NC: 'South', SC: 'South', VA: 'South', DC: 'South',
  WV: 'South', AL: 'South', KY: 'South', MS: 'South',
  TN: 'South', AR: 'South', LA: 'South', OK: 'South', TX: 'South',

  AZ: 'West', CO: 'West', ID: 'West', MT: 'West',
  NV: 'West', NM: 'West', UT: 'West', WY: 'West',
  AK: 'West', CA: 'West', HI: 'West', OR: 'West', WA: 'West',
};

/** Get region for a state abbreviation */
export function getRegion(stateAbbr) {
  return STATE_TO_REGION[stateAbbr] || 'Other';
}

/** Get color for a state abbreviation */
export function getRegionColor(stateAbbr) {
  return REGION_COLORS[getRegion(stateAbbr)] || REGION_COLORS.Other;
}

/** All region names in display order */
export const REGION_NAMES = ['Northeast', 'Midwest', 'South', 'West'];

/**
 * Group clinics by region.
 * Returns { Northeast: [...], Midwest: [...], South: [...], West: [...] }
 */
export function groupByRegion(clinics) {
  const groups = {};
  for (const r of REGION_NAMES) groups[r] = [];
  for (const clinic of clinics) {
    const region = getRegion(clinic.s);
    if (!groups[region]) groups[region] = [];
    groups[region].push(clinic);
  }
  return groups;
}
