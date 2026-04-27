'use client';

import { useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ReferenceDataBlob } from '../src/ref-data/schema';
import { blobToEvents, blobToTransitions } from '../src/ref-data/adapter';
import { getModelIdsFromBlob } from '../src/data-loading/index';
import { getDefaultTheme, toggleTheme as toggle, getThemeClass } from '../src/app-shell/index';
import { AppContext, type ModelData } from './context';

export { AppContext } from './context';

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const EMPTY_MODEL: ModelData = { states: [], transitions: [], events: [] };

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeClaimType, setActiveClaimType] = useState<string>('');
  const [theme, setTheme] = useState(getDefaultTheme);
  const [modelData, setModelData] = useState<ModelData>(EMPTY_MODEL);
  const [refData, setRefData] = useState<ReferenceDataBlob | null>(null);
  const [refDataLoading, setRefDataLoading] = useState(false);
  const [refDataError, setRefDataError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => toggle(t));
  }, []);

  const handleSetClaimType = useCallback((id: string) => {
    setActiveClaimType(id);
    setModelData({
      states: refData?.states.filter((s) => s.claimType === id) ?? [],
      transitions: blobToTransitions(refData, []),
      events: blobToEvents(refData, id),
    });
  }, [refData]);

  const reloadRefData = useCallback(() => {
    setRefDataError(null);
    setRefetchTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setRefDataLoading(true);
    fetch('/api/reference-data')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setRefData(data as ReferenceDataBlob);
          setRefDataLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setRefDataError(err instanceof Error ? err.message : String(err));
          setRefDataLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [refetchTrigger]);

  // When refData loads, pick the first available model if none selected
  useEffect(() => {
    if (!refData) {
      setModelData(EMPTY_MODEL);
      return;
    }
    const models = getModelIdsFromBlob(refData);
    const active = models.includes(activeClaimType) ? activeClaimType : (models[0] ?? '');
    if (active !== activeClaimType) setActiveClaimType(active);
    setModelData({
      states: refData.states.filter((s) => s.claimType === active),
      transitions: blobToTransitions(refData, []),
      events: blobToEvents(refData, active),
    });
  }, [refData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.className = getThemeClass(theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        activeClaimType,
        setActiveClaimType: handleSetClaimType,
        theme,
        toggleTheme: handleToggleTheme,
        modelData,
        setModelData,
        refData,
        refDataLoading,
        refDataError,
        reloadRefData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
