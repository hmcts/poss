/**
 * context.ts — AppContext definition (no JSX, importable in node:test).
 * AppProvider lives in providers.tsx; this file exports only the context object and types.
 */

import { createContext } from 'react';
import type { State, Transition, Event } from '../src/data-model/schemas.ts';
import type { ReferenceDataBlob } from '../src/ref-data/schema.ts';

export interface ModelData {
  states: State[];
  transitions: Transition[];
  events: Event[];
}

export interface AppContextValue {
  activeClaimType: string;
  setActiveClaimType: (id: string) => void;
  theme: string;
  toggleTheme: () => void;
  modelData: ModelData;
  setModelData: (data: ModelData) => void;
  refData: ReferenceDataBlob | null;
  refDataLoading: boolean;
  refDataError: string | null;
  reloadRefData: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
