import { createStore } from 'zustand/vanilla';

// -- Service Name -------------------------------------------------------------

export const APP_NAME = 'Statesmith';

// -- Route Configuration ------------------------------------------------------

export const ROUTES = [
  { path: '/state-explorer', label: 'State Explorer', icon: 'map' },
  { path: '/event-matrix', label: 'Event Matrix', icon: 'grid' },
  { path: '/work-allocation', label: 'Work Allocation', icon: 'clipboard' },
  { path: '/digital-twin', label: 'Digital Twin', icon: 'cpu' },
  { path: '/journey', label: 'Journey Explorer', icon: 'journey' },
  { path: '/reference-data', label: 'Reference Data', icon: 'database' },
  { path: '/product-catalog', label: 'Product Catalogue', icon: 'package' },
] as const;

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
