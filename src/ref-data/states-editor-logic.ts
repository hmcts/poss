import type { RefState, StateEventAssoc, PersonaStateAssoc } from './schema.ts';

export interface StateAssocs {
  stateEventAssocs: StateEventAssoc[];
  personaStateAssocs: PersonaStateAssoc[];
}

export function generateStateId(): string {
  return `state-${Date.now()}`;
}

export function isStateDeletable(stateId: string, assocs: StateAssocs): boolean {
  const hasStateEvent = assocs.stateEventAssocs.some((a) => a.stateId === stateId);
  const hasPersonaState = assocs.personaStateAssocs.some((a) => a.stateId === stateId);
  return !hasStateEvent && !hasPersonaState;
}

export function applyStateEdit(
  states: RefState[],
  id: string,
  patch: Partial<Omit<RefState, 'id'>>,
): RefState[] {
  return states.map((s) => (s.id === id ? { ...s, ...patch } : s));
}

export function addNewState(states: RefState[]): RefState[] {
  const newState: RefState = { id: generateStateId(), name: '', description: '', claimType: '' };
  return [...states, newState];
}

export function deleteState(states: RefState[], id: string): RefState[] {
  return states.filter((s) => s.id !== id);
}
