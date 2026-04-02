import type { RefEvent, StateEventAssoc, EventTaskAssoc, PersonaEventAssoc } from './schema.ts';

export interface EventAssocs {
  stateEventAssocs: StateEventAssoc[];
  eventTaskAssocs: EventTaskAssoc[];
  personaEventAssocs: PersonaEventAssoc[];
}

/**
 * Generate a unique event ID with the "event-" prefix.
 */
export function generateEventId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `event-${random}`;
}

/**
 * Returns true if the event can be deleted (no associations reference it).
 * Returns false if any of the three assoc arrays contain this eventId.
 */
export function isEventDeletable(eventId: string, assocs: EventAssocs): boolean {
  const inStateEventAssocs = assocs.stateEventAssocs.some((a) => a.eventId === eventId);
  const inEventTaskAssocs = assocs.eventTaskAssocs.some((a) => a.eventId === eventId);
  const inPersonaEventAssocs = assocs.personaEventAssocs.some((a) => a.eventId === eventId);
  return !inStateEventAssocs && !inEventTaskAssocs && !inPersonaEventAssocs;
}

/**
 * Returns a new events array with the matching event patched.
 * Does not mutate the input array.
 */
export function applyEventEdit(
  events: RefEvent[],
  id: string,
  patch: Partial<RefEvent>
): RefEvent[] {
  return events.map((e) => (e.id === id ? { ...e, ...patch } : e));
}

/**
 * Appends a new blank event in edit-ready state.
 * Returns the updated array and the generated ID.
 */
export function addNewEvent(events: RefEvent[]): { events: RefEvent[]; newId: string } {
  const newId = generateEventId();
  const newEvent: RefEvent = { id: newId, name: '', description: '', actors: {}, isSystemEvent: false, hasOpenQuestions: false, notes: '' };
  return { events: [...events, newEvent], newId };
}

/**
 * Returns a new events array with the event matching `id` removed.
 * Does not mutate the input array.
 */
export function deleteEvent(events: RefEvent[], id: string): RefEvent[] {
  return events.filter((e) => e.id !== id);
}
