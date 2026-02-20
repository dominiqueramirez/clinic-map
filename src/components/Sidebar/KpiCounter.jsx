import React from 'react';

/**
 * KPI counter showing total clinics and labeled count.
 */
export default function KpiCounter({ clinics, labeledNames }) {
  const total = clinics.length;
  const labeled = labeledNames.size;
  const mapped = clinics.filter((c) => c.lat != null && c.lon != null).length;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-va-panel rounded-lg p-2 text-center">
        <div className="text-2xl font-bold text-va-gold">{total}</div>
        <div className="text-[10px] text-va-muted uppercase tracking-wide">Total</div>
      </div>
      <div className="bg-va-panel rounded-lg p-2 text-center">
        <div className="text-2xl font-bold text-va-gold">{mapped}</div>
        <div className="text-[10px] text-va-muted uppercase tracking-wide">Mapped</div>
      </div>
      <div className="bg-va-panel rounded-lg p-2 text-center">
        <div className="text-2xl font-bold text-va-gold">{labeled}</div>
        <div className="text-[10px] text-va-muted uppercase tracking-wide">Labeled</div>
      </div>
    </div>
  );
}
