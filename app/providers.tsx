'use client';

import { useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { State, Transition } from '../src/data-model/schemas';
import type { ReferenceDataBlob } from '../src/ref-data/schema';
import { CLAIM_TYPES } from '../src/app-shell/index';
import { getDefaultTheme, toggleTheme as toggle, getThemeClass } from '../src/app-shell/index';
import MAIN_CLAIM_ENGLAND_DATA from '../src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json';
import ACCELERATED_CLAIM_WALES_DATA from '../src/data-ingestion/states/ACCELERATED_CLAIM_WALES.json';
import COUNTER_CLAIM_JSON from '../src/data-ingestion/states/COUNTER_CLAIM.json';
import COUNTER_CLAIM_MAIN_CLAIM_CLOSED_DATA from '../src/data-ingestion/states/COUNTER_CLAIM_MAIN_CLAIM_CLOSED.json';
import ENFORCEMENT_DATA from '../src/data-ingestion/states/ENFORCEMENT.json';
import APPEALS_DATA from '../src/data-ingestion/states/APPEALS.json';
import GENERAL_APPLICATIONS_DATA from '../src/data-ingestion/states/GENERAL_APPLICATIONS.json';
import { AppContext, type ModelData } from './context';

export { AppContext } from './context';

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Ingested model map ───────────────────────────────────────────────

const INGESTED_MODEL: Record<string, { states: State[]; transitions: Transition[] }> = {
  MAIN_CLAIM_ENGLAND: MAIN_CLAIM_ENGLAND_DATA as { states: State[]; transitions: Transition[] },
  ACCELERATED_CLAIM_WALES: ACCELERATED_CLAIM_WALES_DATA as { states: State[]; transitions: Transition[] },
  COUNTER_CLAIM: COUNTER_CLAIM_JSON as { states: State[]; transitions: Transition[] },
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: COUNTER_CLAIM_MAIN_CLAIM_CLOSED_DATA as { states: State[]; transitions: Transition[] },
  ENFORCEMENT: ENFORCEMENT_DATA as { states: State[]; transitions: Transition[] },
  APPEALS: APPEALS_DATA as { states: State[]; transitions: Transition[] },
  GENERAL_APPLICATIONS: GENERAL_APPLICATIONS_DATA as { states: State[]; transitions: Transition[] },
};

// ── Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeClaimType, setActiveClaimType] = useState<string>(CLAIM_TYPES[0].id);
  const [theme, setTheme] = useState(getDefaultTheme);
  const [modelData, setModelData] = useState<ModelData>(() => ({ ...INGESTED_MODEL[CLAIM_TYPES[0].id] ?? INGESTED_MODEL['MAIN_CLAIM_ENGLAND'], events: [] }));
  const [refData, setRefData] = useState<ReferenceDataBlob | null>(null);
  const [refDataLoading, setRefDataLoading] = useState(false);
  const [refDataError, setRefDataError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => toggle(t));
  }, []);

  const handleSetClaimType = useCallback((id: string) => {
    setActiveClaimType(id);
    setModelData({ ...INGESTED_MODEL[id] ?? INGESTED_MODEL['MAIN_CLAIM_ENGLAND'], events: [] });
  }, []);

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
