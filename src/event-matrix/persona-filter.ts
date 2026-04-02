import type { ReferenceDataBlob } from '../ref-data/schema.ts';

interface Event {
  id: string;
  [key: string]: unknown;
}

export function filterEventsByPersona(
  events: Event[],
  blob: ReferenceDataBlob | null | undefined,
  personaId: string | null,
): Event[] {
  if (!personaId || !blob) return events;
  const allowed = new Set(
    blob.personaEventAssocs
      .filter((a) => a.personaId === personaId)
      .map((a) => a.eventId),
  );
  return events.filter((e) => allowed.has(e.id));
}

export function getPersonaLabel(persona: { id: string; roles: string[] }): string {
  return persona.roles.join(', ');
}
