/**
 * adapter.ts — Pure functions converting ReferenceDataBlob to ModelData-compatible shapes.
 * No side effects, no React, no DOM.
 */

import type { ReferenceDataBlob } from './schema.ts';
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

    // Cast to any to read optional enriched fields defensively
    const r = ref as Record<string, unknown>;

    events.push({
      id: ref.id,
      name: ref.name,
      claimType: claimTypeId,
      state: assoc.stateId,
      isSystemEvent: typeof r['isSystemEvent'] === 'boolean' ? r['isSystemEvent'] : false,
      notes: typeof r['notes'] === 'string' ? r['notes'] : '',
      hasOpenQuestions: typeof r['hasOpenQuestions'] === 'boolean' ? r['hasOpenQuestions'] : false,
      actors: r['actors'] !== null && typeof r['actors'] === 'object' ? r['actors'] as Record<string, boolean> : {},
    });
  }

  return events;
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
