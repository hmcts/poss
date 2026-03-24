import { getDefaultTheme } from '../app-shell/index.js';

// -- Next.js Configuration ----------------------------------------------------

export function getNextConfig() {
  return {
    port: 3000,
    output: 'export' as const,
    distDir: 'out',
    images: { unoptimized: true },
  };
}

// -- Tailwind Theme Tokens ----------------------------------------------------

export function getTailwindThemeTokens() {
  const amber = '#d97706'; // amber-600
  return {
    draft: amber,
    live: '#16a34a',       // green-600
    end: '#1e293b',        // slate-800
    uncertain: '#6b7280',  // gray-500
    warning: amber,
  };
}

// -- Theme Provider Config ----------------------------------------------------

export function getThemeProviderConfig() {
  return {
    defaultTheme: getDefaultTheme(),
    themes: ['light', 'dark'],
    storageKey: 'poss-theme',
  };
}

// -- Path Aliases -------------------------------------------------------------

export function getPathAliases() {
  return {
    '@/src/*': ['./src/*'],
  };
}

// -- App Metadata -------------------------------------------------------------

export function getAppMetadata() {
  return {
    title: 'HMCTS Possessions Process Tool',
    description: 'Prototype tool for exploring HMCTS possession case processes, states, and events.',
  };
}
