import type { PersonaStateAssoc, PersonaEventAssoc, PersonaTaskAssoc } from './schema.ts';

export function getPersonaCounts(
  personaId: string,
  stateAssocs: PersonaStateAssoc[],
  eventAssocs: PersonaEventAssoc[],
  taskAssocs: PersonaTaskAssoc[],
): { states: number; events: number; tasks: number } {
  return {
    states: stateAssocs.filter(a => a.personaId === personaId).length,
    events: eventAssocs.filter(a => a.personaId === personaId).length,
    tasks: taskAssocs.filter(a => a.personaId === personaId).length,
  };
}

export function toggleStateAssoc(
  personaId: string,
  stateId: string,
  assocs: PersonaStateAssoc[],
): PersonaStateAssoc[] {
  const exists = assocs.some(a => a.personaId === personaId && a.stateId === stateId);
  if (exists) {
    return assocs.filter(a => !(a.personaId === personaId && a.stateId === stateId));
  }
  return [...assocs, { personaId, stateId }];
}

export function toggleEventAssoc(
  personaId: string,
  eventId: string,
  assocs: PersonaEventAssoc[],
): PersonaEventAssoc[] {
  const exists = assocs.some(a => a.personaId === personaId && a.eventId === eventId);
  if (exists) {
    return assocs.filter(a => !(a.personaId === personaId && a.eventId === eventId));
  }
  return [...assocs, { personaId, eventId }];
}

export function toggleTaskAssoc(
  personaId: string,
  waTaskId: string,
  assocs: PersonaTaskAssoc[],
): PersonaTaskAssoc[] {
  const exists = assocs.some(a => a.personaId === personaId && a.waTaskId === waTaskId);
  if (exists) {
    return assocs.filter(a => !(a.personaId === personaId && a.waTaskId === waTaskId));
  }
  return [...assocs, { personaId, waTaskId }];
}

export function filterItems<T extends { name?: string; taskName?: string; id: string }>(
  items: T[],
  query: string,
): T[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item => {
    const label = (item.taskName ?? item.name ?? '').toLowerCase();
    return label.includes(q);
  });
}

export function isStateAssociated(
  personaId: string,
  stateId: string,
  assocs: PersonaStateAssoc[],
): boolean {
  return assocs.some(a => a.personaId === personaId && a.stateId === stateId);
}

export function isEventAssociated(
  personaId: string,
  eventId: string,
  assocs: PersonaEventAssoc[],
): boolean {
  return assocs.some(a => a.personaId === personaId && a.eventId === eventId);
}

export function isTaskAssociated(
  personaId: string,
  waTaskId: string,
  assocs: PersonaTaskAssoc[],
): boolean {
  return assocs.some(a => a.personaId === personaId && a.waTaskId === waTaskId);
}
