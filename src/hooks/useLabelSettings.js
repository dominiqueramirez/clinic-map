import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'va-clinics-label-settings';
const DEBOUNCE_MS = 300;

/** Default label offsets for clinics that need pre-positioning */
const DEFAULT_OFFSETS = {
  'Garner Clinic': { x: 0, y: -30 },
  'Havelock Clinic': { x: 30, y: 4 },
  'Wilmington Clinic': { x: 30, y: 22 },
  'Rock Hill CBOC': { x: 30, y: 4 },
  'Mount Pleasant Clinic': { x: 30, y: 22 },
  'Noonan Jr. Clinic (Thomas P. Noonan Jr.)': { x: -20, y: -4 },
  'Yonkers Clinic': { x: -20, y: 16 },
  'Providence Mental Health Building': { x: -20, y: -4 },
};

function getDefaultSettings() {
  return {
    globalFontSize: 14,
    offsets: { ...DEFAULT_OFFSETS },
    displayNames: {},
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw);
    return {
      globalFontSize: parsed.globalFontSize ?? 14,
      offsets: { ...DEFAULT_OFFSETS, ...(parsed.offsets || {}) },
      displayNames: parsed.displayNames || {},
    };
  } catch {
    return getDefaultSettings();
  }
}

/**
 * Hook to manage label settings with localStorage persistence.
 * Debounces writes to avoid thrashing during drag operations.
 */
export function useLabelSettings() {
  const [labelSettings, setLabelSettings] = useState(loadFromStorage);
  const timerRef = useRef(null);

  // Debounced save to localStorage
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labelSettings));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [labelSettings]);

  const updateOffset = useCallback((clinicName, offset) => {
    setLabelSettings((prev) => ({
      ...prev,
      offsets: {
        ...prev.offsets,
        [clinicName]: { ...(prev.offsets[clinicName] || {}), ...offset },
      },
    }));
  }, []);

  const updateDisplayName = useCallback((clinicName, displayName) => {
    setLabelSettings((prev) => ({
      ...prev,
      displayNames: {
        ...prev.displayNames,
        [clinicName]: displayName,
      },
    }));
  }, []);

  const updateFontSize = useCallback((clinicName, fs) => {
    setLabelSettings((prev) => ({
      ...prev,
      offsets: {
        ...prev.offsets,
        [clinicName]: { ...(prev.offsets[clinicName] || { x: 0, y: -30 }), fs },
      },
    }));
  }, []);

  const setGlobalFontSize = useCallback((size) => {
    setLabelSettings((prev) => ({
      ...prev,
      globalFontSize: size,
    }));
  }, []);

  const resetLabel = useCallback((clinicName) => {
    setLabelSettings((prev) => {
      const newOffsets = { ...prev.offsets };
      const newNames = { ...prev.displayNames };
      // Restore default offset if exists, otherwise remove
      if (DEFAULT_OFFSETS[clinicName]) {
        newOffsets[clinicName] = { ...DEFAULT_OFFSETS[clinicName] };
      } else {
        delete newOffsets[clinicName];
      }
      delete newNames[clinicName];
      return { ...prev, offsets: newOffsets, displayNames: newNames };
    });
  }, []);

  const resetAll = useCallback(() => {
    const defaults = getDefaultSettings();
    setLabelSettings(defaults);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const importSettings = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      setLabelSettings((prev) => ({
        globalFontSize: parsed.globalFontSize ?? prev.globalFontSize,
        offsets: { ...prev.offsets, ...(parsed.offsets || {}) },
        displayNames: { ...prev.displayNames, ...(parsed.displayNames || {}) },
      }));
    } catch (e) {
      console.error('Failed to import label settings:', e);
    }
  }, []);

  const exportSettings = useCallback(() => {
    return JSON.stringify(labelSettings, null, 2);
  }, [labelSettings]);

  return {
    labelSettings,
    updateOffset,
    updateDisplayName,
    updateFontSize,
    setGlobalFontSize,
    resetLabel,
    resetAll,
    importSettings,
    exportSettings,
  };
}
