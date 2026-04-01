import { createStore } from 'zustand/vanilla';
import { ClaimTypeId } from '../data-model/enums.ts';

// -- Route Configuration ------------------------------------------------------

export const ROUTES = [
  { path: '/state-explorer', label: 'State Explorer', icon: 'map' },
  { path: '/event-matrix', label: 'Event Matrix', icon: 'grid' },
  { path: '/work-allocation', label: 'Work Allocation', icon: 'clipboard' },
  { path: '/action-items', label: 'Action Items', icon: 'list' },
  { path: '/digital-twin', label: 'Digital Twin', icon: 'cpu' },
  { path: '/caseman-comparison', label: 'Caseman Comparison', icon: 'compare' },
  { path: '/product-catalogue', label: 'Product Catalogue', icon: 'catalogue' },
  { path: '/coverage-map', label: 'Coverage Map', icon: 'coverage' },
  { path: '/journey', label: 'Journey Explorer', icon: 'journey' },
  { path: '/reference-data', label: 'Reference Data', icon: 'database' },
] as const;

// -- Claim Types --------------------------------------------------------------

const claimTypeNames: Record<string, string> = {
  MAIN_CLAIM_ENGLAND: 'Main Claim (England)',
  ACCELERATED_CLAIM_WALES: 'Accelerated Claim (Wales)',
  COUNTER_CLAIM: 'Counter Claim',
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: 'Counter Claim (Main Claim Closed)',
  ENFORCEMENT: 'Enforcement',
  APPEALS: 'Appeals',
  GENERAL_APPLICATIONS: 'General Applications',
};

export const CLAIM_TYPES = Object.values(ClaimTypeId).map((id) => ({
  id,
  name: claimTypeNames[id] ?? id,
}));

// -- Theme Utilities ----------------------------------------------------------

export function getDefaultTheme(): string {
  return 'dark';
}

export function toggleTheme(theme: string): string {
  return theme === 'dark' ? 'light' : 'dark';
}

export function getThemeClass(theme: string): string {
  return theme === 'dark' ? 'theme-dark' : 'theme-light';
}

// -- App Store ----------------------------------------------------------------

export interface AppShellState {
  activeClaimType: string | null;
  setActiveClaimType: (claimType: string | null) => void;
}

export function createAppStore() {
  return createStore<AppShellState>()((set) => ({
    activeClaimType: null,
    setActiveClaimType: (claimType: string | null) =>
      set({ activeClaimType: claimType }),
  }));
}
