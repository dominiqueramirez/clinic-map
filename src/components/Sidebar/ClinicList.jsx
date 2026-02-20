import React, { useMemo } from 'react';
import { REGION_COLORS } from '../../constants/design';
import { REGION_NAMES, groupByRegion, getRegionColor } from '../../utils/regions';

/**
 * Clinic list grouped by region with search and selection.
 */
export default function ClinicList({
  clinics,
  labeledNames,
  selectedClinic,
  onSelectClinic,
  searchQuery,
  onSearchChange,
}) {
  const groups = useMemo(() => groupByRegion(clinics), [clinics]);

  const filteredGroups = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return groups;
    const result = {};
    for (const region of REGION_NAMES) {
      result[region] = (groups[region] || []).filter(
        (c) =>
          c.n.toLowerCase().includes(q) ||
          c.c.toLowerCase().includes(q) ||
          c.s.toLowerCase().includes(q)
      );
    }
    return result;
  }, [groups, searchQuery]);

  return (
    <div className="bg-va-panel rounded-lg p-3">
      <div className="text-xs font-semibold text-va-muted uppercase tracking-wide mb-2">
        Clinics
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search clinics…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-va-deepblue border border-va-muted/30 rounded px-2 py-1 text-[11px] text-white placeholder-gray-500 mb-2 outline-none focus:border-va-gold"
      />

      {/* Grouped list */}
      <div className="space-y-2 max-h-52 overflow-y-auto sidebar-scroll">
        {REGION_NAMES.map((region) => {
          const items = filteredGroups[region] || [];
          if (items.length === 0) return null;
          return (
            <div key={region}>
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: REGION_COLORS[region] }}
              >
                {region}
              </div>
              {items.map((clinic) => {
                const isLabeled = labeledNames.has(clinic.n);
                const isSelected = selectedClinic?.n === clinic.n;
                const isMapped = clinic.lat != null && clinic.lon != null;
                return (
                  <button
                    key={clinic.n}
                    onClick={() => onSelectClinic(clinic)}
                    className={`w-full text-left flex items-center gap-1.5 py-0.5 px-1 rounded text-[11px] transition ${
                      isSelected
                        ? 'bg-va-gold/20 text-va-gold'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: isLabeled
                          ? '#f5c400'
                          : getRegionColor(clinic.s),
                      }}
                    />
                    <span className="truncate">
                      {clinic.n}
                      {!isMapped && (
                        <span className="ml-1 text-yellow-500" title="Missing coordinates">⚠</span>
                      )}
                    </span>
                    <span className="ml-auto text-[9px] text-gray-500 flex-shrink-0">
                      {clinic.s}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
