import React from 'react';
import { REGION_COLORS } from '../../constants/design';
import { REGION_NAMES } from '../../utils/regions';

/**
 * Map legend showing region dot/bar colors, positioned bottom-left.
 */
export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="font-semibold mb-1 text-white/80 text-[10px] uppercase tracking-wider">Regions</div>
      {REGION_NAMES.map((region) => (
        <div key={region} className="flex items-center gap-2 mb-0.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: REGION_COLORS[region] }}
          />
          <span className="text-white/80">{region}</span>
        </div>
      ))}
    </div>
  );
}
