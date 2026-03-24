import type { State, Event } from '../data-model/schemas.js';

// ── Types ───────────────────────────────────────────────────────────

export type UncertaintyLevel = 'complete' | 'partial' | 'low' | 'unknown';

export interface UncertaintyColor {
  background: string;
  border: string;
  text: string;
}

export interface CompletenessBadge {
  label: string;
  level: string;
  color: UncertaintyColor;
}

export interface EventIndicator {
  hasOpenQuestions: boolean;
  indicatorType: 'warning' | 'none';
  indicatorColor: string;
}

export interface StateClassification {
  complete: State[];
  partial: State[];
  low: State[];
  unknown: State[];
}

export interface UncertaintySummary {
  totalStates: number;
  completeCount: number;
  uncertainCount: number;
  openQuestionEvents: number;
  overallLevel: string;
}

// ── Colour palettes ─────────────────────────────────────────────────

const COLOR_MAP: Record<string, UncertaintyColor> = {
  complete: { background: '#D1FAE5', border: '#10B981', text: '#000000' },
  partial:  { background: '#FEF3C7', border: '#F59E0B', text: '#000000' },
  low:      { background: '#FDE68A', border: '#D97706', text: '#000000' },
  unknown:  { background: '#F3F4F6', border: '#9CA3AF', text: '#000000' },
};

const LEVEL_PRIORITY: Record<string, number> = {
  unknown: 0,
  low: 1,
  partial: 2,
  complete: 3,
};

// ── Exported functions ──────────────────────────────────────────────

export function getUncertaintyLevel(completeness: number): UncertaintyLevel {
  if (completeness === 100) return 'complete';
  if (completeness >= 50) return 'partial';
  if (completeness > 0) return 'low';
  return 'unknown';
}

export function getUncertaintyColor(level: string): UncertaintyColor {
  return COLOR_MAP[level] ?? COLOR_MAP['unknown'];
}

export function getCompletenessLabel(completeness: number): string {
  return `${completeness}%`;
}

export function getCompletenessBadge(state: State): CompletenessBadge {
  const level = getUncertaintyLevel(state.completeness);
  const color = getUncertaintyColor(level);
  const label = getCompletenessLabel(state.completeness);
  return { label, level, color };
}

export function getEventIndicator(event: Event): EventIndicator {
  if (event.hasOpenQuestions) {
    return {
      hasOpenQuestions: true,
      indicatorType: 'warning',
      indicatorColor: '#F59E0B',
    };
  }
  return {
    hasOpenQuestions: false,
    indicatorType: 'none',
    indicatorColor: 'transparent',
  };
}

export function classifyStates(states: State[]): StateClassification {
  const result: StateClassification = {
    complete: [],
    partial: [],
    low: [],
    unknown: [],
  };
  for (const state of states) {
    const level = getUncertaintyLevel(state.completeness);
    result[level].push(state);
  }
  return result;
}

export function getUncertaintySummary(
  states: State[],
  events: Event[],
): UncertaintySummary {
  const completeCount = states.filter((s) => s.completeness === 100).length;
  const uncertainCount = states.length - completeCount;
  const openQuestionEvents = events.filter((e) => e.hasOpenQuestions).length;

  let overallLevel: string = 'unknown';
  if (states.length > 0) {
    let worstPriority = Infinity;
    for (const state of states) {
      const level = getUncertaintyLevel(state.completeness);
      const priority = LEVEL_PRIORITY[level] ?? 0;
      if (priority < worstPriority) {
        worstPriority = priority;
        overallLevel = level;
      }
    }
  }

  return {
    totalStates: states.length,
    completeCount,
    uncertainCount,
    openQuestionEvents,
    overallLevel,
  };
}
