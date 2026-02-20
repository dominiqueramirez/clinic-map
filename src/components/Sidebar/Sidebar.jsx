import React from 'react';
import KpiCounter from './KpiCounter';
import RegionBarChart from './RegionBarChart';
import DateFilterPanel from './DateFilterPanel';
import RecentFilter from './RecentFilter';
import ClinicList from './ClinicList';
import ControlPanel from './ControlPanel';

/**
 * Left sidebar (285px fixed width) containing all controls and info panels.
 */
export default function Sidebar({
  clinics,
  labeledNames,
  dateFrom,
  dateTo,
  recentN,
  onDateFromChange,
  onDateToChange,
  onRecentNChange,
  selectedClinic,
  onSelectClinic,
  searchQuery,
  onSearchChange,
  labelSettings,
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
  return (
    <aside
      className="flex flex-col h-full bg-va-deepblue text-white overflow-hidden"
      style={{ width: 285, minWidth: 285 }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold leading-tight text-va-gold">
          VA New Clinics
        </h1>
        <p className="text-xs text-va-muted mt-0.5">Location Dashboard</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-4 pb-4 space-y-4">
        <KpiCounter clinics={clinics} labeledNames={labeledNames} />

        <RegionBarChart clinics={clinics} />

        <DateFilterPanel
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={onDateFromChange}
          onDateToChange={onDateToChange}
          labeledCount={labeledNames.size}
        />

        <RecentFilter
          recentN={recentN}
          onRecentNChange={onRecentNChange}
        />

        <ClinicList
          clinics={clinics}
          labeledNames={labeledNames}
          selectedClinic={selectedClinic}
          onSelectClinic={onSelectClinic}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <ControlPanel
          globalFontSize={labelSettings.globalFontSize}
          onGlobalFontSizeChange={onGlobalFontSizeChange}
          onExport={onExport}
          onImport={onImport}
          onCsvUpload={onCsvUpload}
          uploadMode={uploadMode}
          onUploadModeChange={onUploadModeChange}
          onResetAll={onResetAll}
          onExportImage={onExportImage}
          overlayImage={overlayImage}
          onOverlayImageChange={onOverlayImageChange}
          overlayOpacity={overlayOpacity}
          onOverlayOpacityChange={onOverlayOpacityChange}
        />
      </div>
    </aside>
  );
}
