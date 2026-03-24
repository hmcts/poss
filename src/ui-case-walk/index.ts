import type { State, Transition, Event, BreathingSpaceEntry } from '../data-model/schemas.ts';
import type { CompletenessBadge, EventIndicator } from '../uncertainty-display/index.ts';
import {
  createSimulation,
  getAvailableEvents,
  applyEvent,
  isDeadEnd,
  isEndState,
  getHistory,
  filterEventsByRole,
  getReturnStates,
} from '../case-walk/index.ts';
import type { Simulation } from '../case-walk/index.ts';
import { getCompletenessBadge, getEventIndicator } from '../uncertainty-display/index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface EnrichedSimulation {
  simulation: Simulation;
  currentState: State;
  badge: CompletenessBadge;
}

export interface EnrichedEvent extends Event {
  indicator: EventIndicator;
}

export interface ActionsPanel {
  events: EnrichedEvent[];
  hasDeadEnd: boolean;
  hasEndState: boolean;
  statusMessage: string;
}

export interface TimelineEntry {
  stateId: string;
  stateName: string;
  badge: CompletenessBadge;
  stepNumber: number;
}

export interface SimulationStatusResult {
  status: 'active' | 'dead-end' | 'completed';
  message: string;
}

export interface BreathingSpaceInfo {
  isInBreathingSpace: boolean;
  returnStates: State[];
}

// ── Helpers ─────────────────────────────────────────────────────────

function enrichSimulation(simulation: Simulation): EnrichedSimulation {
  const currentState = simulation.states.find(
    (s) => s.id === simulation.currentStateId,
  );
  if (!currentState) {
    throw new Error(`Current state ${simulation.currentStateId} not found`);
  }
  const badge = getCompletenessBadge(currentState);
  return { simulation, currentState, badge };
}

// ── initializeSimulation ────────────────────────────────────────────

export function initializeSimulation(
  claimTypeId: string,
  states: State[],
  transitions: Transition[],
  events: Event[],
): EnrichedSimulation {
  const simulation = createSimulation(claimTypeId, states, transitions, events);
  return enrichSimulation(simulation);
}

// ── getAvailableActionsPanel ────────────────────────────────────────

export function getAvailableActionsPanel(
  simulation: Simulation,
  roleFilter?: string,
): ActionsPanel {
  let available = getAvailableEvents(simulation);
  if (roleFilter && roleFilter.length > 0) {
    available = filterEventsByRole(available, roleFilter);
  }

  const enrichedEvents: EnrichedEvent[] = available.map((event) => ({
    ...event,
    indicator: getEventIndicator(event),
  }));

  const deadEnd = isDeadEnd(simulation);
  const endState = isEndState(simulation);

  let statusMessage: string;
  if (endState) {
    statusMessage = 'Case has reached an end state.';
  } else if (deadEnd) {
    statusMessage = 'No available events. This is a dead-end state.';
  } else {
    statusMessage = `${enrichedEvents.length} event(s) available.`;
  }

  return {
    events: enrichedEvents,
    hasDeadEnd: deadEnd,
    hasEndState: endState,
    statusMessage,
  };
}

// ── advanceSimulation ───────────────────────────────────────────────

export function advanceSimulation(
  input: EnrichedSimulation | Simulation,
  eventId: string,
): EnrichedSimulation {
  const simulation = 'simulation' in input ? input.simulation : input;
  const newSimulation = applyEvent(simulation, eventId);
  return enrichSimulation(newSimulation);
}

// ── getSimulationTimeline ───────────────────────────────────────────

export function getSimulationTimeline(simulation: Simulation): TimelineEntry[] {
  const history = getHistory(simulation);
  return history.map((entry, index) => {
    const state = simulation.states.find((s) => s.id === entry.stateId);
    const badge = state
      ? getCompletenessBadge(state)
      : { label: '0%', level: 'unknown', color: { background: '#F3F4F6', border: '#9CA3AF', text: '#000000' } };
    return {
      stateId: entry.stateId,
      stateName: entry.stateName,
      badge,
      stepNumber: index + 1,
    };
  });
}

// ── getSimulationStatus ─────────────────────────────────────────────

export function getSimulationStatus(
  simulation: Simulation,
): SimulationStatusResult {
  if (isEndState(simulation)) {
    return {
      status: 'completed',
      message: 'The case has reached a terminal state.',
    };
  }
  if (isDeadEnd(simulation)) {
    return {
      status: 'dead-end',
      message: 'The case is stuck with no available events and is not in an end state.',
    };
  }
  return {
    status: 'active',
    message: 'The simulation is active with events available.',
  };
}

// ── getRoleFilterOptions ────────────────────────────────────────────

export function getRoleFilterOptions(events: Event[]): string[] {
  const roles = new Set<string>();
  for (const event of events) {
    for (const [role, active] of Object.entries(event.actors)) {
      if (active === true) {
        roles.add(role);
      }
    }
  }
  return [...roles].sort();
}

// ── getBreathingSpaceInfo ───────────────────────────────────────────

export function getBreathingSpaceInfo(
  simulation: Simulation,
  breathingSpaceEntries: BreathingSpaceEntry[],
): BreathingSpaceInfo {
  const returnStates = getReturnStates(simulation, breathingSpaceEntries);
  return {
    isInBreathingSpace: returnStates.length > 0,
    returnStates,
  };
}
