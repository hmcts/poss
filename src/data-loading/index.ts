import type { StoreApi } from 'zustand/vanilla';
import { ClaimTypeId } from '../data-model/enums.ts';
import type { State, Transition, Event, ClaimType } from '../data-model/schemas.ts';
import { createPossessionsStore } from '../data-model/store.ts';
import type { PossessionsState } from '../data-model/store.ts';
import { loadStatesAndTransitions } from '../data-ingestion/index.ts';

// ── getAllClaimTypeIds ───────────────────────────────────────────────

export function getAllClaimTypeIds(): string[] {
  return Object.values(ClaimTypeId);
}

// ── getModelDataForClaimType ────────────────────────────────────────

export function getModelDataForClaimType(
  allStates: State[],
  allTransitions: Transition[],
  allEvents: Event[],
  claimTypeId: string,
): { states: State[]; transitions: Transition[]; events: Event[] } {
  const states = allStates.filter((s) => s.claimType === claimTypeId);
  const stateIds = new Set(states.map((s) => s.id));
  const transitions = allTransitions.filter((t) => stateIds.has(t.from));
  const events = allEvents.filter((e) => e.claimType === claimTypeId);
  return { states, transitions, events };
}

// ── populateStore ───────────────────────────────────────────────────

export function populateStore(
  store: StoreApi<PossessionsState>,
  data: {
    claimTypes?: ClaimType[];
    states?: State[];
    transitions?: Transition[];
    events?: Event[];
  },
): void {
  store.setState(data);
}

// ── createPopulatedStore ────────────────────────────────────────────

export function createPopulatedStore(
  claimTypes: ClaimType[],
  states: State[],
  transitions: Transition[],
  events: Event[],
): StoreApi<PossessionsState> {
  const store = createPossessionsStore();
  populateStore(store, { claimTypes, states, transitions, events });
  return store;
}

// ── loadModelData ───────────────────────────────────────────────────

export async function loadModelData(
  claimTypeId: string,
): Promise<{ states: State[]; transitions: Transition[]; events: Event[] }> {
  try {
    const { states, transitions } = await loadStatesAndTransitions(claimTypeId);
    return { states, transitions, events: [] };
  } catch {
    return { states: [], transitions: [], events: [] };
  }
}
