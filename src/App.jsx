import React, { useState, useCallback, useRef } from 'react';
import defaultClinics from './data/clinics';
import { useLabelSettings } from './hooks/useLabelSettings';
import { useDateFilter } from './hooks/useDateFilter';
import { exportMapAsPng } from './utils/exportImage';
import Sidebar from './components/Sidebar/Sidebar';
import MapCanvas from './components/Map/MapCanvas';
import LabelEditPanel from './components/LabelEditPanel';

export default function App() {
  // ── Clinic data ──
  const [clinics, setClinics] = useState(defaultClinics);

  // ── Label settings (persisted to localStorage) ──
  const {
    labelSettings,
    updateOffset,
    updateDisplayName,
    updateFontSize,
    setGlobalFontSize,
    resetLabel,
    resetAll,
    importSettings,
    exportSettings,
  } = useLabelSettings();

  // ── Filters ──
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [recentN, setRecentN] = useState(null);

  // ── UI state ──
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadMode, setUploadMode] = useState('replace');
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const mapRef = useRef(null);

  // ── Derived: which clinic names should be labeled ──
  const labeledNames = useDateFilter(clinics, dateFrom, dateTo, recentN);

  // ── Handlers ──
  const handleSelectClinic = useCallback((clinic) => {
    setSelectedClinic(clinic);
  }, []);

  const handleOffsetChange = useCallback(
    (clinicName, offset) => {
      updateOffset(clinicName, offset);
    },
    [updateOffset]
  );

  const handleLabelClick = useCallback((clinic) => {
    setSelectedClinic(clinic);
  }, []);

  /** Unified handler for LabelEditPanel changes */
  const handleLabelChange = useCallback(
    (field, clinicName, value) => {
      switch (field) {
        case 'displayName':
          updateDisplayName(clinicName, value);
          break;
        case 'offsetX':
          updateOffset(clinicName, { x: value });
          break;
        case 'offsetY':
          updateOffset(clinicName, { y: value });
          break;
        case 'fontSize':
          updateFontSize(clinicName, value);
          break;
        default:
          break;
      }
    },
    [updateOffset, updateDisplayName, updateFontSize]
  );

  const handleCsvUpload = useCallback(
    (newClinics) => {
      if (uploadMode === 'replace') {
        setClinics(newClinics);
      } else {
        setClinics((prev) => {
          const existing = new Set(prev.map((c) => c.n));
          const fresh = newClinics.filter((c) => !existing.has(c.n));
          return [...prev, ...fresh];
        });
      }
    },
    [uploadMode]
  );

  const handleExportImage = useCallback(
    (scale) => {
      const svgEl = mapRef.current?.getSvgEl();
      if (svgEl) {
        exportMapAsPng(svgEl, { scale }).catch((err) =>
          console.error('Export failed:', err)
        );
      }
    },
    []
  );

  const handleResetAll = useCallback(() => {
    resetAll();
    setClinics(defaultClinics);
    setDateFrom(null);
    setDateTo(null);
    setRecentN(null);
    setSelectedClinic(null);
    setSearchQuery('');
  }, [resetAll]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        clinics={clinics}
        labeledNames={labeledNames}
        dateFrom={dateFrom}
        dateTo={dateTo}
        recentN={recentN}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onRecentNChange={setRecentN}
        selectedClinic={selectedClinic}
        onSelectClinic={handleSelectClinic}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        labelSettings={labelSettings}
        onGlobalFontSizeChange={setGlobalFontSize}
        onExport={exportSettings}
        onImport={importSettings}
        onCsvUpload={handleCsvUpload}
        uploadMode={uploadMode}
        onUploadModeChange={setUploadMode}
        onResetAll={handleResetAll}
        onExportImage={handleExportImage}
        overlayImage={overlayImage}
        onOverlayImageChange={setOverlayImage}
        overlayOpacity={overlayOpacity}
        onOverlayOpacityChange={setOverlayOpacity}
      />

      {/* Map area */}
      <div className="flex-1 relative">
        <MapCanvas
          ref={mapRef}
          clinics={clinics}
          labeledNames={labeledNames}
          labelSettings={labelSettings}
          selectedClinic={selectedClinic}
          onSelectClinic={handleSelectClinic}
          onOffsetChange={handleOffsetChange}
          onLabelClick={handleLabelClick}
          overlayImage={overlayImage}
          overlayOpacity={overlayOpacity}
        />

        {/* Floating label edit panel */}
        <LabelEditPanel
          clinic={selectedClinic}
          labelSettings={labelSettings}
          onChange={handleLabelChange}
          onReset={resetLabel}
          onClose={() => setSelectedClinic(null)}
        />
      </div>
    </div>
  );
}
