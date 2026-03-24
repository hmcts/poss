import type { State, Transition, Event } from '../data-model/schemas.ts';

// ── Toggle Types ────────────────────────────────────────────────────

export interface ToggleSet {
  states?: string[];
  events?: string[];
  roles?: string[];
}

export interface ToggleStateResult {
  states: State[];
  transitions: Transition[];
  events: Event[];
}

export interface ImpactResult {
  micro: { removedEvents: Event[]; unavailableCount: number };
  meso: { deadEndStates: string[]; degradedPaths: number };
  macro: { unreachableStates: string[]; canReachEnd: boolean };
  summary: string;
}

// ── toggleState ─────────────────────────────────────────────────────

export function toggleState(
  states: State[],
  transitions: Transition[],
  events: Event[],
  stateId: string,
): ToggleStateResult {
  return {
    states: states.filter((s) => s.id !== stateId),
    transitions: transitions.filter((t) => t.from !== stateId && t.to !== stateId),
    events: events.filter((e) => e.state !== stateId),
  };
}

// ── toggleRole ──────────────────────────────────────────────────────

export function toggleRole(events: Event[], role: string): Event[] {
  return events.filter((e) => {
    const activeActors = Object.entries(e.actors).filter(([, can]) => can);
    // If this role is the sole performer, remove the event
    if (activeActors.length === 1 && activeActors[0][0] === role) {
      return false;
    }
    return true;
  });
}

// ── toggleEvent ─────────────────────────────────────────────────────

export function toggleEvent(events: Event[], eventId: string): Event[] {
  return events.filter((e) => e.id !== eventId);
}

// ── findUnreachableStates ───────────────────────────────────────────

function findInitialStates(states: State[], transitions: Transition[]): State[] {
  const incomingTargets = new Set(transitions.map((t) => t.to));
  return states.filter((s) => s.isDraftLike && !incomingTargets.has(s.id));
}

export function findUnreachableStates(states: State[], transitions: Transition[]): string[] {
  if (states.length === 0) return [];

  const initials = findInitialStates(states, transitions);
  if (initials.length === 0) {
    // No initial states found — all states are unreachable
    return states.map((s) => s.id);
  }

  // BFS from initial states
  const visited = new Set<string>();
  const queue = initials.map((s) => s.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const t of transitions) {
      if (t.from === current && !visited.has(t.to)) {
        queue.push(t.to);
      }
    }
  }

  return states.filter((s) => !visited.has(s.id)).map((s) => s.id);
}

// ── findBlockedEvents ───────────────────────────────────────────────

export function findBlockedEvents(events: Event[], states: State[]): Event[] {
  const stateIds = new Set(states.map((s) => s.id));
  return events.filter((e) => !stateIds.has(e.state));
}

// ── canReachEndState ────────────────────────────────────────────────

export function canReachEndState(states: State[], transitions: Transition[]): boolean {
  if (states.length === 0) return false;

  const endStateIds = new Set(states.filter((s) => s.isEndState).map((s) => s.id));
  if (endStateIds.size === 0) return false;

  const initials = findInitialStates(states, transitions);
  if (initials.length === 0) return false;

  // BFS from initial states
  const visited = new Set<string>();
  const queue = initials.map((s) => s.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    if (endStateIds.has(current)) return true;
    for (const t of transitions) {
      if (t.from === current && !visited.has(t.to)) {
        queue.push(t.to);
      }
    }
  }

  return false;
}

// ── analyzeImpact ───────────────────────────────────────────────────

export function analyzeImpact(
  states: State[],
  transitions: Transition[],
  events: Event[],
  toggles: ToggleSet,
): ImpactResult {
  let currentStates = states;
  let currentTransitions = transitions;
  let currentEvents = events;

  // Apply state toggles
  for (const stateId of toggles.states ?? []) {
    const result = toggleState(currentStates, currentTransitions, currentEvents, stateId);
    currentStates = result.states;
    currentTransitions = result.transitions;
    currentEvents = result.events;
  }

  // Apply event toggles
  for (const eventId of toggles.events ?? []) {
    currentEvents = toggleEvent(currentEvents, eventId);
  }

  // Apply role toggles
  for (const role of toggles.roles ?? []) {
    currentEvents = toggleRole(currentEvents, role);
  }

  // Compute removed events (diff between original and current)
  const currentEventIds = new Set(currentEvents.map((e) => e.id));
  const removedEvents = events.filter((e) => !currentEventIds.has(e.id));

  // Micro
  const micro = {
    removedEvents,
    unavailableCount: removedEvents.length,
  };

  // Macro
  const unreachableStates = findUnreachableStates(currentStates, currentTransitions);
  const canReachEnd = canReachEndState(currentStates, currentTransitions);
  const macro = {
    unreachableStates,
    canReachEnd: canReachEnd,
  };

  // Meso: find dead-end states (reachable, not end state, no outgoing transitions)
  const reachableStateIds = new Set(
    currentStates.filter((s) => !unreachableStates.includes(s.id)).map((s) => s.id),
  );
  const statesWithOutgoing = new Set(currentTransitions.map((t) => t.from));
  const deadEndStates = currentStates
    .filter(
      (s) => reachableStateIds.has(s.id) && !s.isEndState && !statesWithOutgoing.has(s.id),
    )
    .map((s) => s.id);

  const meso = {
    deadEndStates,
    degradedPaths: deadEndStates.length,
  };

  // Summary
  const summary =
    `${unreachableStates.length} states unreachable, ` +
    `${removedEvents.length} events blocked, ` +
    `${deadEndStates.length} dead-end states`;

  return { micro, meso, macro, summary };
}
