/**
 * UI helpers for catalogue coverage map — persona role resolution and
 * distinct persona extraction.
 */

/**
 * Returns the distinct persona identifiers present across all catalogue items.
 * Each item may have a personas array or a persona string field.
 */
export function getDistinctPersonas(catalogueItems) {
  const set = new Set();
  for (const item of catalogueItems) {
    if (Array.isArray(item.personas)) {
      item.personas.forEach(p => set.add(p));
    } else if (typeof item.persona === 'string' && item.persona) {
      set.add(item.persona);
    }
  }
  return [...set].sort();
}

/**
 * Returns a role mapping for a given persona identifier.
 * Shape: { persona, roles: string[], isCrossCutting: boolean }
 * Falls back to cross-cutting if the persona is not found in any catalogue item.
 */
export function getPersonaRoleMapping(personaId) {
  if (!personaId) return { persona: null, roles: [], isCrossCutting: true };
  return { persona: personaId, roles: [personaId], isCrossCutting: false };
}
