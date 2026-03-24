import type { State, Transition, Event } from '../data-model/schemas.js';
import {
  getModelHealthSummary,
  getLowCompletenessStates,
  getUnreachableStates,
  canReachEndState,
} from '../model-health/index.js';
import {
  getUncertaintyLevel,
  getUncertaintyColor,
} from '../uncertainty-display/index.js';

// ── Types ───────────────────────────────────────────────────────────

export interface HealthColor {
  background: string;
  text: string;
  border: string;
}

export interface HealthSummaryCard {
  score: 'good' | 'fair' | 'poor';
  scoreColor: HealthColor;
  scoreLabel: string;
  openQuestions: number;
  lowCompletenessCount: number;
  unreachableCount: number;
  hasValidEndPath: boolean;
}

export interface OpenQuestionEvent {
  id: string;
  name: string;
  state: string;
  notes: string;
}

export interface OpenQuestionsList {
  count: number;
  events: OpenQuestionEvent[];
}

export interface LowCompletenessEntry {
  id: string;
  label: string;
  completeness: number;
  level: string;
  color: HealthColor;
}

export interface LowCompletenessPanel {
  threshold: number;
  states: LowCompletenessEntry[];
}

export interface UnreachableStateEntry {
  id: string;
  label: string;
}

export interface UnreachableStatesPanel {
  count: number;
  states: UnreachableStateEntry[];
}

export interface EndStateReachabilityEntry {
  claimTypeId: string;
  claimTypeName: string;
  canReach: boolean;
  icon: string;
}

// ── Colour palettes ─────────────────────────────────────────────────

const HEALTH_COLORS: Record<string, HealthColor> = {
  good: { background: '#D1FAE5', text: '#065F46', border: '#10B981' },
  fair: { background: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  poor: { background: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
};

const SCORE_LABELS: Record<string, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const CLAIM_TYPE_NAMES: Record<string, string> = {
  MAIN_CLAIM_ENGLAND: 'Main Claim (England)',
  ACCELERATED_CLAIM_WALES: 'Accelerated Claim (Wales)',
  COUNTER_CLAIM: 'Counter Claim',
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: 'Counter Claim (Main Closed)',
  ENFORCEMENT: 'Enforcement',
  APPEALS: 'Appeals',
  GENERAL_APPLICATIONS: 'General Applications',
};

// ── Exported functions ──────────────────────────────────────────────

export function getHealthSummaryCard(
  states: State[],
  transitions: Transition[],
  events: Event[],
): HealthSummaryCard {
  const summary = getModelHealthSummary(states, transitions, events);
  return {
    score: summary.overallScore,
    scoreColor: getOverallHealthColor(summary.overallScore),
    scoreLabel: SCORE_LABELS[summary.overallScore] ?? 'Unknown',
    openQuestions: summary.openQuestions,
    lowCompletenessCount: summary.lowCompletenessStates.length,
    unreachableCount: summary.unreachableStates.length,
    hasValidEndPath: summary.hasValidEndPath,
  };
}

export function getOpenQuestionsList(events: Event[]): OpenQuestionsList {
  const filtered = events.filter(e => e.hasOpenQuestions);
  return {
    count: filtered.length,
    events: filtered.map(e => ({
      id: e.id,
      name: e.name,
      state: e.state,
      notes: e.notes,
    })),
  };
}

export function getLowCompletenessPanel(
  states: State[],
  threshold: number = 50,
): LowCompletenessPanel {
  const lowStates = getLowCompletenessStates(states, threshold);
  return {
    threshold,
    states: lowStates.map(s => {
      const level = getUncertaintyLevel(s.completeness);
      const color = getUncertaintyColor(level);
      return {
        id: s.id,
        label: s.uiLabel,
        completeness: s.completeness,
        level,
        color: { background: color.background, text: color.text, border: color.border },
      };
    }),
  };
}

export function getUnreachableStatesPanel(
  states: State[],
  transitions: Transition[],
): UnreachableStatesPanel {
  const unreachable = getUnreachableStates(states, transitions);
  return {
    count: unreachable.length,
    states: unreachable.map(s => ({
      id: s.id,
      label: s.uiLabel,
    })),
  };
}

export function getEndStateReachability(
  claimTypeDataMap: Record<string, { states: State[]; transitions: Transition[] }>,
): EndStateReachabilityEntry[] {
  return Object.entries(claimTypeDataMap).map(([claimTypeId, data]) => {
    const reachable = canReachEndState(data.states, data.transitions);
    return {
      claimTypeId,
      claimTypeName: CLAIM_TYPE_NAMES[claimTypeId] ?? claimTypeId,
      canReach: reachable,
      icon: reachable ? '\u2713' : '\u2717',
    };
  });
}

export function getOverallHealthColor(score: string): HealthColor {
  return HEALTH_COLORS[score] ?? HEALTH_COLORS['poor'];
}
