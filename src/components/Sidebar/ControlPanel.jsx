import React, { useRef, useCallback } from 'react';
import { parseCsv } from '../../utils/csvParser';

/**
 * Global controls: font size, export/import settings, CSV upload, reset.
 */
export default function ControlPanel({
  globalFontSize,
  onGlobalFontSizeChange,
  onExport,
  onImport,
  onCsvUpload,
  uploadMode,
  onUploadModeChange,
  onResetAll,
  onExportImage,
  overlayImage,
  onOverlayImageChange,
  overlayOpacity,
  onOverlayOpacityChange,
}) {
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const overlayInputRef = useRef(null);
  const [exportScale, setExportScale] = React.useState(3);

  // ---- Overlay Image ----
  const handleOverlayFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onOverlayImageChange(url);
      e.target.value = '';
    },
    [onOverlayImageChange]
  );

  // ---- Font Size ----
  const handleFontChange = useCallback(
    (delta) => onGlobalFontSizeChange(Math.max(8, globalFontSize + delta)),
    [globalFontSize, onGlobalFontSizeChange]
  );

  // ---- Export ----
  const handleExport = useCallback(() => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'va-clinic-label-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [onExport]);

  // ---- Import ----
  const handleImportFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          onImport(ev.target.result);
        } catch (err) {
          console.error('Import error:', err);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [onImport]
  );

  // ---- CSV Upload ----
  const handleCsvFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const clinics = parseCsv(ev.target.result);
        if (clinics.length > 0) {
          onCsvUpload(clinics);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [onCsvUpload]
  );

  const btnClass =
    'w-full text-[10px] py-1.5 rounded transition text-white';

  return (
    <div className="bg-va-panel rounded-lg p-3 space-y-3">
      <div className="text-xs font-semibold text-va-muted uppercase tracking-wide">
        Controls
      </div>

      {/* Global Font Size */}
      <div>
        <label className="text-[10px] text-gray-400">Global Font Size</label>
        <div className="flex items-center gap-2 mt-0.5">
          <button
            onClick={() => handleFontChange(-2)}
            className="w-7 h-7 rounded bg-va-blue hover:bg-va-blue/80 text-white text-sm font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={globalFontSize}
            onChange={(e) => onGlobalFontSizeChange(Number(e.target.value) || 12)}
            className="w-14 bg-va-deepblue border border-va-muted/30 rounded px-2 py-1 text-center text-[11px] text-white"
          />
          <button
            onClick={() => handleFontChange(2)}
            className="w-7 h-7 rounded bg-va-blue hover:bg-va-blue/80 text-white text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Export / Import */}
      <div className="grid grid-cols-2 gap-1">
        <button onClick={handleExport} className={`${btnClass} bg-va-blue hover:bg-va-blue/80`}>
          Export Settings
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`${btnClass} bg-va-blue hover:bg-va-blue/80`}
        >
          Import Settings
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>

      {/* CSV Upload */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-[10px] text-gray-400">CSV Upload</label>
          <div className="flex text-[9px]">
            <button
              onClick={() => onUploadModeChange('replace')}
              className={`px-2 py-0.5 rounded-l border border-va-muted/30 ${
                uploadMode === 'replace'
                  ? 'bg-va-gold text-va-deepblue font-bold'
                  : 'bg-va-deepblue text-gray-400'
              }`}
            >
              Replace
            </button>
            <button
              onClick={() => onUploadModeChange('append')}
              className={`px-2 py-0.5 rounded-r border border-va-muted/30 border-l-0 ${
                uploadMode === 'append'
                  ? 'bg-va-gold text-va-deepblue font-bold'
                  : 'bg-va-deepblue text-gray-400'
              }`}
            >
              Append
            </button>
          </div>
        </div>
        <button
          onClick={() => csvInputRef.current?.click()}
          className={`${btnClass} bg-va-blue hover:bg-va-blue/80`}
        >
          Upload CSV
        </button>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleCsvFile}
        />
      </div>

      {/* Map Overlay Image */}
      <div>
        <label className="text-[10px] text-gray-400">Map Overlay Image</label>
        <button
          onClick={() => overlayInputRef.current?.click()}
          className={`${btnClass} bg-va-blue hover:bg-va-blue/80 mt-0.5`}
        >
          {overlayImage ? 'Change Overlay' : 'Upload Overlay'}
        </button>
        <input
          ref={overlayInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleOverlayFile}
        />
        {overlayImage && (
          <>
            <div className="flex items-center gap-2 mt-1.5">
              <label className="text-[9px] text-gray-400 w-14">Opacity</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={overlayOpacity}
                onChange={(e) => onOverlayOpacityChange(Number(e.target.value))}
                className="flex-1 h-1 accent-va-gold"
              />
              <span className="text-[10px] text-gray-300 w-8 text-right">
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
            <button
              onClick={() => onOverlayImageChange(null)}
              className={`${btnClass} bg-va-stroke/40 hover:bg-va-stroke/60 mt-1`}
            >
              Remove Overlay
            </button>
          </>
        )}
      </div>

      {/* Export Image */}
      <div>
        <label className="text-[10px] text-gray-400">Export Map as PNG</label>
        <div className="flex items-center gap-1 mt-0.5 mb-1">
          {[2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setExportScale(s)}
              className={`flex-1 text-[10px] py-0.5 rounded transition ${
                exportScale === s
                  ? 'bg-va-gold text-va-deepblue font-bold'
                  : 'bg-va-deepblue border border-va-muted/30 text-gray-400'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
        <button
          onClick={() => onExportImage(exportScale)}
          className={`${btnClass} bg-green-700 hover:bg-green-600 font-semibold`}
        >
          📷 Export Image ({exportScale}×)
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onResetAll}
        className={`${btnClass} bg-red-800/60 hover:bg-red-800/80`}
      >
        Reset to Default
      </button>
    </div>
  );
}
