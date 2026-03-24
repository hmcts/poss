import { createStore } from 'zustand/vanilla';
import type { State, Transition, Event, ClaimType } from './schemas.ts';

export interface PossessionsState {
  claimTypes: ClaimType[];
  states: State[];
  transitions: Transition[];
  events: Event[];
  activeClaimType: string | null;
}

export function createPossessionsStore() {
  return createStore<PossessionsState>()(() => ({
    claimTypes: [],
    states: [],
    transitions: [],
    events: [],
    activeClaimType: null,
  }));
}
