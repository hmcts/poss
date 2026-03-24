import { ROUTES, CLAIM_TYPES, toggleTheme, getThemeClass } from '../app-shell/index.ts';
import { getModelHealthSummary } from '../model-health/index.ts';

// -- Route Active -------------------------------------------------------------

export function isRouteActive(routePath: string, currentPath: string): boolean {
  return currentPath === routePath || currentPath.startsWith(routePath + '/');
}

// -- Navigation Items ---------------------------------------------------------

export function getNavigationItems() {
  return ROUTES.map((route) => ({
    path: route.path,
    label: route.label,
    icon: route.icon,
    isActive: (currentPath: string) => isRouteActive(route.path, currentPath),
  }));
}

// -- Claim Type Selector ------------------------------------------------------

export function getClaimTypeSelectorOptions() {
  return CLAIM_TYPES.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));
}

// -- Theme Toggle State -------------------------------------------------------

export function getThemeToggleState(currentTheme: string) {
  return {
    currentTheme,
    nextTheme: toggleTheme(currentTheme),
    cssClass: getThemeClass(currentTheme),
    icon: currentTheme === 'dark' ? 'sun' : 'moon',
  };
}

// -- Health Badge --------------------------------------------------------------

interface State {
  id: string;
  technicalName: string;
  uiLabel: string;
  claimType: string;
  isDraftLike: boolean;
  isLive: boolean;
  isEndState: boolean;
  completeness: number;
}

interface Transition {
  from: string;
  to: string;
  condition: string | null;
  isSystemTriggered: boolean;
  isTimeBased: boolean;
}

interface Event {
  id: string;
  name: string;
  claimType: string;
  state: string;
  isSystemEvent: boolean;
  notes: string;
  hasOpenQuestions: boolean;
  actors: Record<string, boolean>;
}

const BADGE_COLORS: Record<string, string> = {
  good: '#16a34a',
  fair: '#d97706',
  poor: '#dc2626',
};

const BADGE_LABELS: Record<string, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

export function getHealthBadge(
  states: State[],
  transitions: Transition[],
  events: Event[],
) {
  const summary = getModelHealthSummary(states, transitions, events);
  return {
    score: summary.overallScore,
    color: BADGE_COLORS[summary.overallScore] ?? '#6b7280',
    label: BADGE_LABELS[summary.overallScore] ?? 'Unknown',
  };
}

// -- Layout Config ------------------------------------------------------------

export function getLayoutConfig() {
  return {
    sidebarWidth: 256,
    headerHeight: 64,
    breakpoint: 768,
  };
}
