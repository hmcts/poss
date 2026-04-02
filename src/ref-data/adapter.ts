/**
 * adapter.ts — Pure functions converting ReferenceDataBlob to ModelData-compatible shapes.
 * No side effects, no React, no DOM.
 */

import type { ReferenceDataBlob, RefTransition } from './schema.ts';
import type { Event } from '../data-model/schemas.ts';

type WaMapping = {
  waTaskId: string;
  eventIds: string[];
  alignmentNotes: string;
};

/**
 * Converts blob events to the Event[] shape for a given claimTypeId.
 * Filters via stateEventAssocs → states.claimType chain.
 * Deduplicates by eventId (first stateEventAssoc wins).
 * Returns [] for null/undefined blob or when claimTypeId has no matching states.
 */
export function blobToEvents(
  blob: ReferenceDataBlob | null | undefined,
  claimTypeId: string,
): Event[] {
  if (!blob) return [];

  // Collect state ids that belong to this claim type
  const stateIds = new Set<string>(
    blob.states.filter(s => s.claimType === claimTypeId).map(s => s.id),
  );
  if (stateIds.size === 0) return [];

  // Build fast lookup: eventId → RefEvent
  const eventById = new Map(blob.events.map(ev => [ev.id, ev]));

  const seen = new Set<string>();
  const events: Event[] = [];

  for (const assoc of blob.stateEventAssocs) {
    if (!stateIds.has(assoc.stateId)) continue;
    if (seen.has(assoc.eventId)) continue;
    seen.add(assoc.eventId);

    const ref = eventById.get(assoc.eventId);
    if (!ref) continue;

    events.push({
      id: ref.id,
      name: ref.name,
      claimType: claimTypeId,
      state: assoc.stateId,
      isSystemEvent: ref.isSystemEvent ?? false,
      notes: ref.notes ?? '',
      hasOpenQuestions: ref.hasOpenQuestions ?? false,
      actors: ref.actors ?? {},
    });
  }

  return events;
}

/**
 * Returns the WA task list from the blob.
 * Returns [] for null/undefined blob.
 */
export function blobToWaTasks(
  blob: ReferenceDataBlob | null | undefined,
): ReferenceDataBlob['waTasks'] {
  return blob?.waTasks ?? [];
}

/**
 * Returns blob.transitions when non-empty, otherwise falls back to ingestedTransitions.
 * Returns ingestedTransitions for null/undefined blob.
 */
export function pickTransitionsForClaim(
  blob: ReferenceDataBlob | null | undefined,
  ingestedTransitions: RefTransition[],
): RefTransition[] {
  if (!blob || !blob.transitions || blob.transitions.length === 0) return ingestedTransitions;
  return blob.transitions;
}

/**
 * Converts blob transitions to the Transition[] shape (from/to) used by ModelData.
 * When blob.transitions is non-empty, uses them; otherwise uses ingestedTransitions.
 * ingestedTransitions should already be in Transition shape (from/to).
 */
export function blobToTransitions(
  blob: ReferenceDataBlob | null | undefined,
  ingestedTransitions: Array<{ from: string; to: string; condition: string | null; isSystemTriggered: boolean; isTimeBased: boolean }>,
): Array<{ from: string; to: string; condition: string | null; isSystemTriggered: boolean; isTimeBased: boolean }> {
  if (blob && blob.transitions && blob.transitions.length > 0) {
    return blob.transitions.map(t => ({
      from: t.fromStateId,
      to: t.toStateId,
      condition: t.condition,
      isSystemTriggered: t.isSystemTriggered,
      isTimeBased: t.isTimeBased,
    }));
  }
  return ingestedTransitions;
}

/**
 * Converts blob eventTaskAssocs into task-centric WA mapping objects.
 * Groups by waTaskId; first-encountered alignmentNotes wins per task.
 * Returns [] for null/undefined blob or empty eventTaskAssocs.
 */
export function blobToWaMappings(
  blob: ReferenceDataBlob | null | undefined,
): WaMapping[] {
  if (!blob || !blob.eventTaskAssocs.length) return [];

  const map = new Map<string, WaMapping>();

  for (const assoc of blob.eventTaskAssocs) {
    if (!map.has(assoc.waTaskId)) {
      map.set(assoc.waTaskId, {
        waTaskId: assoc.waTaskId,
        eventIds: [],
        alignmentNotes: assoc.alignmentNotes,
      });
    }
    map.get(assoc.waTaskId)!.eventIds.push(assoc.eventId);
  }

  return Array.from(map.values());
}
