import type { EventTaskAssoc } from './schema.ts';

export function getLinkedTaskIds(eventId: string, assocs: EventTaskAssoc[]): string[] {
  return assocs.filter((a) => a.eventId === eventId).map((a) => a.waTaskId);
}

export function isTaskLinked(eventId: string, waTaskId: string, assocs: EventTaskAssoc[]): boolean {
  return assocs.some((a) => a.eventId === eventId && a.waTaskId === waTaskId);
}

export function getAssocNotes(eventId: string, waTaskId: string, assocs: EventTaskAssoc[]): string {
  const assoc = assocs.find((a) => a.eventId === eventId && a.waTaskId === waTaskId);
  return assoc ? assoc.alignmentNotes : '';
}

export function toggleTaskLink(
  eventId: string,
  waTaskId: string,
  assocs: EventTaskAssoc[],
): EventTaskAssoc[] {
  const exists = assocs.some((a) => a.eventId === eventId && a.waTaskId === waTaskId);
  if (exists) {
    return assocs.filter((a) => !(a.eventId === eventId && a.waTaskId === waTaskId));
  }
  return [...assocs, { eventId, waTaskId, alignmentNotes: '' }];
}

export function updateNotes(
  eventId: string,
  waTaskId: string,
  notes: string,
  assocs: EventTaskAssoc[],
): EventTaskAssoc[] {
  const linked = assocs.some((a) => a.eventId === eventId && a.waTaskId === waTaskId);
  if (!linked) return assocs;
  return assocs.map((a) =>
    a.eventId === eventId && a.waTaskId === waTaskId ? { ...a, alignmentNotes: notes } : a,
  );
}

export function alignmentBadgeColour(alignment: string): 'green' | 'amber' | 'red' {
  if (alignment === 'aligned') return 'green';
  if (alignment === 'partial') return 'amber';
  return 'red';
}
