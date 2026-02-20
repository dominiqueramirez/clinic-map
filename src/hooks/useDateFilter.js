import { useMemo } from 'react';
import { parseDate } from '../utils/dateUtils';

/**
 * Returns a Set of clinic names that should have visible labels
 * based on date range and/or recentN filter.
 *
 * - If recentN is set, returns the N most recently opened clinic names
 *   (optionally intersected with the date range if both are active).
 * - If only date range is set, returns clinics within that range.
 * - If nothing is set, returns all clinic names.
 *
 * @param {Array} clinics
 * @param {Date|null} dateFrom
 * @param {Date|null} dateTo
 * @param {number|null} recentN
 * @returns {Set<string>}
 */
export function useDateFilter(clinics, dateFrom, dateTo, recentN) {
  return useMemo(() => {
    if (!clinics || clinics.length === 0) return new Set();

    // First apply date range filter if set
    let filtered = clinics;
    if (dateFrom || dateTo) {
      filtered = clinics.filter((clinic) => {
        const d = parseDate(clinic.date);
        if (!d) return false;
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
        return true;
      });
    }

    // If recentN is set, sort by date desc and take top N
    if (recentN != null && recentN > 0) {
      const sorted = [...filtered].sort((a, b) => {
        const da = parseDate(a.date);
        const db = parseDate(b.date);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
      });
      return new Set(sorted.slice(0, recentN).map((c) => c.n));
    }

    return new Set(filtered.map((c) => c.n));
  }, [clinics, dateFrom, dateTo, recentN]);
}
