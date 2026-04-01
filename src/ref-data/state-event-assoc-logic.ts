import type { StateEventAssoc } from './schema.ts';

export function getAssociatedEventIds(stateId: string, assocs: StateEventAssoc[]): string[] {
  return assocs.filter((a) => a.stateId === stateId).map((a) => a.eventId);
}

export function countAssociations(stateId: string, assocs: StateEventAssoc[]): number {
  return assocs.filter((a) => a.stateId === stateId).length;
}

export function toggleAssociation(
  stateId: string,
  eventId: string,
  assocs: StateEventAssoc[],
): StateEventAssoc[] {
  const exists = assocs.some((a) => a.stateId === stateId && a.eventId === eventId);
  if (exists) {
    return assocs.filter((a) => !(a.stateId === stateId && a.eventId === eventId));
  }
  return [...assocs, { stateId, eventId }];
}

export function isEventAssociated(
  stateId: string,
  eventId: string,
  assocs: StateEventAssoc[],
): boolean {
  return assocs.some((a) => a.stateId === stateId && a.eventId === eventId);
}
