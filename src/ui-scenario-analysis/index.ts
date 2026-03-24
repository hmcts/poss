import type { State, Transition, Event } from '../data-model/schemas.ts';
import {
  toggleState,
  toggleRole,
  toggleEvent,
  analyzeImpact,
} from '../scenario-analysis/index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface ToggleableItem {
  id: string;
  label: string;
  isToggled: boolean;
}

export interface ToggleableEvent {
  id: string;
  label: string;
  state: string;
  isToggled: boolean;
}

export interface ImpactLevel {
  count: number;
  items: string[];
}

export interface MacroImpactLevel extends ImpactLevel {
  canReachEnd: boolean;
}

export interface FormattedImpact {
  micro: ImpactLevel;
  meso: ImpactLevel;
  macro: MacroImpactLevel;
  summary: string;
  _removedStateIds: string[];
}

export interface ToggleState {
  stateIds: string[];
  roles: string[];
  eventIds: string[];
}

export type HighlightCategory = 'removed' | 'unreachable' | 'affected' | 'normal';

// ── getToggleableStates ─────────────────────────────────────────────

export function getToggleableStates(states: State[]): ToggleableItem[] {
  return states.map((s) => ({
    id: s.id,
    label: s.uiLabel,
    isToggled: false,
  }));
}

// ── getToggleableRoles ──────────────────────────────────────────────

export function getToggleableRoles(roles: string[]): ToggleableItem[] {
  return roles.map((r) => ({
    id: r,
    label: r,
    isToggled: false,
  }));
}

// ── getToggleableEvents ─────────────────────────────────────────────

export function getToggleableEvents(events: Event[]): ToggleableEvent[] {
  return events.map((e) => ({
    id: e.id,
    label: e.name,
    state: e.state,
    isToggled: false,
  }));
}

// ── applyToggles ────────────────────────────────────────────────────

export function applyToggles(
  states: State[],
  transitions: Transition[],
  events: Event[],
  toggledStateIds: string[],
  toggledRoles: string[],
  toggledEventIds: string[],
): { states: State[]; transitions: Transition[]; events: Event[] } {
  let currentStates = states;
  let currentTransitions = transitions;
  let currentEvents = events;

  // Apply state toggles
  for (const stateId of toggledStateIds) {
    const result = toggleState(currentStates, currentTransitions, currentEvents, stateId);
    currentStates = result.states;
    currentTransitions = result.transitions;
    currentEvents = result.events;
  }

  // Apply event toggles
  for (const eventId of toggledEventIds) {
    currentEvents = toggleEvent(currentEvents, eventId);
  }

  // Apply role toggles
  for (const role of toggledRoles) {
    currentEvents = toggleRole(currentEvents, role);
  }

  return {
    states: currentStates,
    transitions: currentTransitions,
    events: currentEvents,
  };
}

// ── getImpactSummary ────────────────────────────────────────────────

export function getImpactSummary(
  states: State[],
  transitions: Transition[],
  events: Event[],
  toggledStateIds: string[],
  toggledRoles: string[],
  toggledEventIds: string[],
): FormattedImpact {
  const impact = analyzeImpact(states, transitions, events, {
    states: toggledStateIds,
    roles: toggledRoles,
    events: toggledEventIds,
  });

  return {
    micro: {
      count: impact.micro.unavailableCount,
      items: impact.micro.removedEvents.map((e) => e.name),
    },
    meso: {
      count: impact.meso.degradedPaths,
      items: impact.meso.deadEndStates,
    },
    macro: {
      count: impact.macro.unreachableStates.length,
      items: impact.macro.unreachableStates,
      canReachEnd: impact.macro.canReachEnd,
    },
    summary: impact.summary,
    _removedStateIds: toggledStateIds,
  };
}

// ── getImpactHighlights ─────────────────────────────────────────────

export function getImpactHighlights(
  originalStates: State[],
  impactResult: FormattedImpact,
): Map<string, HighlightCategory> {
  const removedSet = new Set(impactResult._removedStateIds);
  const unreachableSet = new Set(impactResult.macro.items);
  const deadEndSet = new Set(impactResult.meso.items);

  const highlights = new Map<string, HighlightCategory>();

  for (const state of originalStates) {
    if (removedSet.has(state.id)) {
      highlights.set(state.id, 'removed');
    } else if (unreachableSet.has(state.id)) {
      highlights.set(state.id, 'unreachable');
    } else if (deadEndSet.has(state.id)) {
      highlights.set(state.id, 'affected');
    } else {
      highlights.set(state.id, 'normal');
    }
  }

  return highlights;
}

// ── createEmptyToggleState ──────────────────────────────────────────

export function createEmptyToggleState(): ToggleState {
  return {
    stateIds: [],
    roles: [],
    eventIds: [],
  };
}
