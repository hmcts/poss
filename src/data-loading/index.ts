import type { State, Transition, Event } from '../data-model/schemas.ts';
import type { ReferenceDataBlob } from '../ref-data/schema.ts';

// ── getModelIdsFromBlob ─────────────────────────────────────────────
// Derives the list of unique user-defined model IDs from blob.states[].claimType.

export function getModelIdsFromBlob(blob: ReferenceDataBlob | null | undefined): string[] {
  if (!blob || !Array.isArray(blob.states)) return [];
  const seen = new Set<string>();
  for (const s of blob.states) {
    if (s.claimType) seen.add(s.claimType);
  }
  return Array.from(seen);
}

// ── getModelDataForClaimType ────────────────────────────────────────
// Filters all states/transitions/events down to a single model ID.

export function getModelDataForClaimType(
  allStates: State[],
  allTransitions: Transition[],
  allEvents: Event[],
  claimTypeId: string,
): { states: State[]; transitions: Transition[]; events: Event[] } {
  const states = allStates.filter((s) => s.claimType === claimTypeId);
  const stateIds = new Set(states.map((s) => s.id));
  const transitions = allTransitions.filter((t) => stateIds.has(t.from));
  const events = allEvents.filter((e) => e.claimType === claimTypeId);
  return { states, transitions, events };
}
