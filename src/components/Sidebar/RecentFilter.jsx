import React, { useCallback } from 'react';

const PRESETS = [5, 10, 15, 20];

/**
 * "Recent N" filter — labels only the N most recently opened clinics.
 */
export default function RecentFilter({ recentN, onRecentNChange }) {
  const handleClear = useCallback(() => {
    onRecentNChange(null);
  }, [onRecentNChange]);

  return (
    <div className="bg-va-panel rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-va-muted uppercase tracking-wide">
          Recent Openings
        </span>
        {recentN && (
          <span className="text-[10px] bg-va-gold text-va-deepblue rounded-full px-2 py-0.5 font-bold">
            Top {recentN}
          </span>
        )}
      </div>

      <div className="flex gap-1">
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => onRecentNChange(n)}
            className={`flex-1 text-[11px] py-1 rounded transition ${
              recentN === n
                ? 'bg-va-gold text-va-deepblue font-bold'
                : 'bg-va-blue hover:bg-va-blue/80 text-white'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="flex-1 text-[11px] py-1 rounded bg-va-stroke/40 hover:bg-va-stroke/60 text-white transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
