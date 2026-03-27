import { createStore } from 'zustand/vanilla';
import type { State, Transition, Event, ClaimType, WaTask, WaTaskMapping } from './schemas.ts';

export interface PossessionsState {
  claimTypes: ClaimType[];
  states: State[];
  transitions: Transition[];
  events: Event[];
  activeClaimType: string | null;
  waTasks: WaTask[];
  waMappings: WaTaskMapping[];
  setWaTasks: (tasks: WaTask[]) => void;
  setWaMappings: (mappings: WaTaskMapping[]) => void;
}

export function createPossessionsStore() {
  return createStore<PossessionsState>()((set) => ({
    claimTypes: [],
    states: [],
    transitions: [],
    events: [],
    activeClaimType: null,
    waTasks: [],
    waMappings: [],
    setWaTasks: (tasks) => set({ waTasks: tasks }),
    setWaMappings: (mappings) => set({ waMappings: mappings }),
  }));
}
