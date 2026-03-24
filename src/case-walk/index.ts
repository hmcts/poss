import type { State, Transition, Event, BreathingSpaceEntry } from '../data-model/schemas.ts';

// ── Simulation Type ─────────────────────────────────────────────────

export interface Simulation {
  claimTypeId: string;
  currentStateId: string;
  history: { stateId: string; stateName: string }[];
  states: State[];
  transitions: Transition[];
  events: Event[];
}

// ── createSimulation ────────────────────────────────────────────────

export function createSimulation(
  claimTypeId: string,
  states: State[],
  transitions: Transition[],
  events: Event[],
): Simulation {
  const incomingTargets = new Set(transitions.map((t) => t.to));
  const initial = states.find(
    (s) => s.isDraftLike && !incomingTargets.has(s.id),
  );
  if (!initial) {
    throw new Error(`No initial state found for claim type ${claimTypeId}`);
  }
  return {
    claimTypeId,
    currentStateId: initial.id,
    history: [{ stateId: initial.id, stateName: initial.uiLabel }],
    states,
    transitions,
    events,
  };
}

// ── getAvailableEvents ──────────────────────────────────────────────

export function getAvailableEvents(simulation: Simulation): Event[] {
  return simulation.events.filter(
    (e) =>
      e.state === simulation.currentStateId &&
      e.claimType === simulation.claimTypeId,
  );
}

// ── applyEvent ──────────────────────────────────────────────────────

export function applyEvent(simulation: Simulation, eventId: string): Simulation {
  const event = simulation.events.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }
  if (event.state !== simulation.currentStateId) {
    throw new Error(
      `Event ${eventId} is not valid in current state ${simulation.currentStateId}`,
    );
  }

  const transition = simulation.transitions.find(
    (t) => t.from === simulation.currentStateId,
  );
  if (!transition) {
    throw new Error(
      `No transition from state ${simulation.currentStateId}`,
    );
  }

  const nextState = simulation.states.find((s) => s.id === transition.to);
  if (!nextState) {
    throw new Error(`Target state ${transition.to} not found`);
  }

  return {
    ...simulation,
    currentStateId: transition.to,
    history: [
      ...simulation.history,
      { stateId: nextState.id, stateName: nextState.uiLabel },
    ],
  };
}

// ── isDeadEnd ───────────────────────────────────────────────────────

export function isDeadEnd(simulation: Simulation): boolean {
  const available = getAvailableEvents(simulation);
  if (available.length > 0) return false;
  const currentState = simulation.states.find(
    (s) => s.id === simulation.currentStateId,
  );
  return currentState ? !currentState.isEndState : false;
}

// ── isEndState ──────────────────────────────────────────────────────

export function isEndState(simulation: Simulation): boolean {
  const currentState = simulation.states.find(
    (s) => s.id === simulation.currentStateId,
  );
  return currentState?.isEndState ?? false;
}

// ── getHistory ──────────────────────────────────────────────────────

export function getHistory(
  simulation: Simulation,
): { stateId: string; stateName: string }[] {
  return simulation.history;
}

// ── filterEventsByRole ──────────────────────────────────────────────

export function filterEventsByRole(events: Event[], role: string): Event[] {
  return events.filter((e) => e.actors[role] === true);
}

// ── getReturnStates ─────────────────────────────────────────────────

export function getReturnStates(
  simulation: Simulation,
  breathingSpaceEntries: BreathingSpaceEntry[],
): State[] {
  const matching = breathingSpaceEntries.filter(
    (entry) => entry.stateFrom === simulation.currentStateId,
  );
  return matching
    .map((entry) => simulation.states.find((s) => s.id === entry.stateTo))
    .filter((s): s is State => s !== undefined);
}
