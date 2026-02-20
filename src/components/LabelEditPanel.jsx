import React, { useCallback } from 'react';

/**
 * Floating panel (top-right of map) for editing a selected clinic's label.
 * Fields: display text, X/Y offset, per-label font size, reset.
 */
export default function LabelEditPanel({
  clinic,
  labelSettings,
  onChange,
  onReset,
  onClose,
}) {
  if (!clinic) return null;

  const offset = labelSettings.offsets[clinic.n] || { x: 0, y: -30 };
  const displayName = labelSettings.displayNames[clinic.n] ?? clinic.n;
  const fontSize =
    offset.fs != null ? offset.fs : labelSettings.globalFontSize;

  const handleTextChange = useCallback(
    (e) => {
      onChange('displayName', clinic.n, e.target.value);
    },
    [clinic.n, onChange]
  );

  const handleOffsetX = useCallback(
    (e) => {
      onChange('offsetX', clinic.n, Number(e.target.value) || 0);
    },
    [clinic.n, onChange]
  );

  const handleOffsetY = useCallback(
    (e) => {
      onChange('offsetY', clinic.n, Number(e.target.value) || 0);
    },
    [clinic.n, onChange]
  );

  const handleFontSize = useCallback(
    (delta) => {
      onChange('fontSize', clinic.n, Math.max(8, fontSize + delta));
    },
    [clinic.n, fontSize, onChange]
  );

  const handleReset = useCallback(() => {
    onReset(clinic.n);
  }, [clinic.n, onReset]);

  return (
    <div
      className="absolute top-4 right-4 w-64 bg-va-deepblue text-white rounded-xl shadow-2xl p-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-bold text-va-gold leading-tight">
            {clinic.n}
          </div>
          <div className="text-[10px] text-va-muted">
            {clinic.c}, {clinic.s}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg leading-none ml-2"
        >
          ×
        </button>
      </div>

      {/* Display Text */}
      <div className="mb-3">
        <label className="text-[10px] text-gray-400 block mb-0.5">
          Label Text (use Enter for new line)
        </label>
        <textarea
          value={displayName}
          onChange={handleTextChange}
          rows={3}
          className="w-full bg-va-panel border border-va-muted/30 rounded px-2 py-1 text-[11px] text-white resize-none outline-none focus:border-va-gold"
        />
      </div>

      {/* Offset X / Y */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">Offset X</label>
          <input
            type="number"
            value={Math.round(offset.x)}
            onChange={handleOffsetX}
            className="w-full bg-va-panel border border-va-muted/30 rounded px-2 py-1 text-[11px] text-white text-center outline-none focus:border-va-gold"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">Offset Y</label>
          <input
            type="number"
            value={Math.round(offset.y)}
            onChange={handleOffsetY}
            className="w-full bg-va-panel border border-va-muted/30 rounded px-2 py-1 text-[11px] text-white text-center outline-none focus:border-va-gold"
          />
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-3">
        <label className="text-[10px] text-gray-400 block mb-0.5">Font Size</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSize(-2)}
            className="w-7 h-7 rounded bg-va-panel hover:bg-va-blue text-white text-sm font-bold"
          >
            −
          </button>
          <span className="text-sm font-bold text-va-gold flex-1 text-center">
            {fontSize}
          </span>
          <button
            onClick={() => handleFontSize(2)}
            className="w-7 h-7 rounded bg-va-panel hover:bg-va-blue text-white text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="w-full text-[10px] py-1.5 rounded bg-va-stroke/40 hover:bg-va-stroke/60 text-white transition"
      >
        Reset This Label
      </button>
    </div>
  );
}
