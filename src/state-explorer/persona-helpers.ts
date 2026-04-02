import type { ReferenceDataBlob, Persona } from '../ref-data/schema.ts';

export function getPersonasForState(
  blob: ReferenceDataBlob | null | undefined,
  stateId: string,
): Array<Persona> {
  if (!blob) return [];
  const personaIds = new Set(
    blob.personaStateAssocs
      .filter((a) => a.stateId === stateId)
      .map((a) => a.personaId),
  );
  return blob.personas.filter((p) => personaIds.has(p.id));
}
