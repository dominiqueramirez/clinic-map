import React from 'react';
import { REGION_COLORS } from '../../constants/design';
import { REGION_NAMES, groupByRegion } from '../../utils/regions';

/**
 * Horizontal bar chart showing clinic count per region.
 */
export default function RegionBarChart({ clinics }) {
  const groups = groupByRegion(clinics);
  const max = Math.max(1, ...REGION_NAMES.map((r) => groups[r]?.length || 0));

  return (
    <div className="bg-va-panel rounded-lg p-3">
      <div className="text-xs font-semibold text-va-muted uppercase tracking-wide mb-2">
        By Region
      </div>
      <div className="space-y-1.5">
        {REGION_NAMES.map((region) => {
          const count = groups[region]?.length || 0;
          const pct = (count / max) * 100;
          return (
            <div key={region} className="flex items-center gap-2">
              <span className="text-[11px] w-16 text-right text-gray-300">
                {region}
              </span>
              <div className="flex-1 h-4 bg-va-deepblue rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: REGION_COLORS[region],
                  }}
                />
              </div>
              <span className="text-[11px] w-5 text-gray-300">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
