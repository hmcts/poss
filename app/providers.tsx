'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { State, Transition, Event } from '../src/data-model/schemas';
import { CLAIM_TYPES } from '../src/app-shell/index';
import { getDefaultTheme, toggleTheme as toggle, getThemeClass } from '../src/app-shell/index';
import MAIN_CLAIM_ENGLAND_DATA from '../src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json';
import ACCELERATED_CLAIM_WALES_DATA from '../src/data-ingestion/states/ACCELERATED_CLAIM_WALES.json';
import COUNTER_CLAIM_JSON from '../src/data-ingestion/states/COUNTER_CLAIM.json';
import COUNTER_CLAIM_MAIN_CLAIM_CLOSED_DATA from '../src/data-ingestion/states/COUNTER_CLAIM_MAIN_CLAIM_CLOSED.json';
import ENFORCEMENT_DATA from '../src/data-ingestion/states/ENFORCEMENT.json';
import APPEALS_DATA from '../src/data-ingestion/states/APPEALS.json';
import GENERAL_APPLICATIONS_DATA from '../src/data-ingestion/states/GENERAL_APPLICATIONS.json';

// ── Model Data Context ──────────────────────────────────────────────

interface ModelData {
  states: State[];
  transitions: Transition[];
  events: Event[];
}

interface AppContextValue {
  activeClaimType: string;
  setActiveClaimType: (id: string) => void;
  theme: string;
  toggleTheme: () => void;
  modelData: ModelData;
  setModelData: (data: ModelData) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

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

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => toggle(t));
  }, []);

  const handleSetClaimType = useCallback((id: string) => {
    setActiveClaimType(id);
    setModelData({ ...INGESTED_MODEL[id] ?? INGESTED_MODEL['MAIN_CLAIM_ENGLAND'], events: [] });
  }, []);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
