import React, { useCallback } from 'react';
import { toInputDate, fromInputDate } from '../../utils/dateUtils';

const PRESETS = [
  { label: '1 mo', months: 1 },
  { label: '3 mo', months: 3 },
  { label: '6 mo', months: 6 },
  { label: '12 mo', months: 12 },
  { label: 'All', months: null },
];

/**
 * Date range filter with preset buttons and manual From/To pickers.
 */
export default function DateFilterPanel({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  labeledCount,
}) {
  const handlePreset = useCallback(
    (months) => {
      if (months === null) {
        onDateFromChange(null);
        onDateToChange(null);
        return;
      }
      const now = new Date();
      const from = new Date(now);
      from.setMonth(from.getMonth() - months);
      onDateFromChange(from);
      onDateToChange(now);
    },
    [onDateFromChange, onDateToChange]
  );

  const handleClear = useCallback(() => {
    onDateFromChange(null);
    onDateToChange(null);
  }, [onDateFromChange, onDateToChange]);

  return (
    <div className="bg-va-panel rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-va-muted uppercase tracking-wide">
          Date Filter
        </span>
        <span className="text-[10px] bg-va-gold text-va-deepblue rounded-full px-2 py-0.5 font-bold">
          {labeledCount} labeled
        </span>
      </div>

      {/* Presets */}
      <div className="flex gap-1 mb-2">
        {PRESETS.map(({ label, months }) => (
          <button
            key={label}
            onClick={() => handlePreset(months)}
            className="flex-1 text-[10px] py-1 rounded bg-va-blue hover:bg-va-blue/80 text-white transition"
          >
            {label}
          </button>
        ))}
      </div>

      {/* From / To pickers */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-400 w-8">From</label>
          <input
            type="date"
            value={toInputDate(dateFrom)}
            onChange={(e) => onDateFromChange(fromInputDate(e.target.value))}
            className="flex-1 bg-va-deepblue border border-va-muted/30 rounded px-2 py-0.5 text-[11px] text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-400 w-8">To</label>
          <input
            type="date"
            value={toInputDate(dateTo)}
            onChange={(e) => onDateToChange(fromInputDate(e.target.value))}
            className="flex-1 bg-va-deepblue border border-va-muted/30 rounded px-2 py-0.5 text-[11px] text-white"
          />
        </div>
      </div>

      <button
        onClick={handleClear}
        className="mt-2 w-full text-[10px] py-1 rounded bg-va-stroke/40 hover:bg-va-stroke/60 text-white transition"
      >
        Clear Date Filter
      </button>
    </div>
  );
}
