import type { Persona, PersonaStateAssoc, PersonaEventAssoc, PersonaTaskAssoc } from './schema.ts';

export interface PersonaAssocs {
  personaStateAssocs: PersonaStateAssoc[];
  personaEventAssocs: PersonaEventAssoc[];
  personaTaskAssocs: PersonaTaskAssoc[];
}

/**
 * Generate a unique persona ID with the "persona-" prefix.
 */
export function generatePersonaId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `persona-${random}`;
}

/**
 * Returns true if the persona can be deleted (no associations reference it).
 * Returns false if any of the three assoc arrays contain this personaId.
 */
export function isPersonaDeletable(personaId: string, assocs: PersonaAssocs): boolean {
  const inPersonaStateAssocs = assocs.personaStateAssocs.some((a) => a.personaId === personaId);
  const inPersonaEventAssocs = assocs.personaEventAssocs.some((a) => a.personaId === personaId);
  const inPersonaTaskAssocs = assocs.personaTaskAssocs.some((a) => a.personaId === personaId);
  return !inPersonaStateAssocs && !inPersonaEventAssocs && !inPersonaTaskAssocs;
}

/**
 * Returns a new personas array with the matching persona patched.
 * Does not mutate the input array.
 */
export function applyPersonaEdit(
  personas: Persona[],
  id: string,
  patch: Partial<Omit<Persona, 'id'>>,
): Persona[] {
  return personas.map((p) => (p.id === id ? { ...p, ...patch } : p));
}

/**
 * Appends a new blank persona with default values.
 * Returns the updated array.
 */
export function addNewPersona(personas: Persona[]): Persona[] {
  const newPersona: Persona = {
    id: generatePersonaId(),
    roles: [],
    isCrossCutting: false,
  };
  return [...personas, newPersona];
}

/**
 * Returns a new personas array with the persona matching `id` removed.
 * Does not mutate the input array.
 */
export function deletePersona(personas: Persona[], id: string): Persona[] {
  return personas.filter((p) => p.id !== id);
}

/**
 * Joins a roles array into a comma-separated display string.
 */
export function rolesToString(roles: string[]): string {
  return roles.join(', ');
}

/**
 * Splits a comma-separated string into a roles array.
 * Trims whitespace and filters empty strings.
 */
export function rolesFromString(s: string): string[] {
  return s
    .split(',')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
}
