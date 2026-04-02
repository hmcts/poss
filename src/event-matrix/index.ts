/**
 * Event Matrix — logic layer
 *
 * Pure functions for filtering, searching, transforming, and exporting
 * the HMCTS possession event model data.
 */

// ── Types ───────────────────────────────────────────────────────────

interface Event {
  id: string;
  name: string;
  claimType: string;
  state: string;
  isSystemEvent: boolean;
  notes: string;
  hasOpenQuestions: boolean;
  actors: Record<string, boolean>;
}

interface FilterCriteria {
  claimType?: string;
  state?: string;
  role?: string;
  systemOnly?: boolean;
}

interface ActorGridRow {
  event: Event;
  actors: boolean[];
}

interface ActorGrid {
  headers: string[];
  rows: ActorGridRow[];
}

// ── Filter Engine ───────────────────────────────────────────────────

export function filterEvents(events: Event[], filters: FilterCriteria): Event[] {
  return events.filter((event) => {
    if (filters.claimType !== undefined && event.claimType !== filters.claimType) {
      return false;
    }
    if (filters.state !== undefined && event.state !== filters.state) {
      return false;
    }
    if (filters.role !== undefined && event.actors[filters.role] !== true) {
      return false;
    }
    if (filters.systemOnly === true && !event.isSystemEvent) {
      return false;
    }
    return true;
  });
}

// ── Search ──────────────────────────────────────────────────────────

export function searchEvents(events: Event[], query: string): Event[] {
  const trimmed = query.trim();
  if (trimmed === '') {
    return events;
  }
  const lower = trimmed.toLowerCase();
  return events.filter(
    (event) =>
      event.name.toLowerCase().includes(lower) ||
      event.notes.toLowerCase().includes(lower)
  );
}

// ── Actor Grid Transform ────────────────────────────────────────────

export function eventsToActorGrid(events: Event[], roles: string[]): ActorGrid {
  return {
    headers: roles,
    rows: events.map((event) => ({
      event,
      actors: roles.map((role) => event.actors[role] ?? false),
    })),
  };
}

// ── CSV Export ───────────────────────────────────────────────────────

function csvEscape(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

export function eventsToCsv(events: Event[]): string {
  // Collect all unique actor keys across all events, sorted for consistency
  const actorKeysSet = new Set<string>();
  for (const event of events) {
    for (const key of Object.keys(event.actors)) {
      actorKeysSet.add(key);
    }
  }
  const actorKeys = Array.from(actorKeysSet).sort();

  const headerParts = ['State', 'Event', 'System', 'Notes', ...actorKeys];
  const lines = [headerParts.join(',')];

  for (const event of events) {
    const row = [
      csvEscape(event.state),
      csvEscape(event.name),
      event.isSystemEvent ? 'Y' : 'N',
      csvEscape(event.notes),
      ...actorKeys.map((key) => (event.actors[key] ? 'Y' : 'N')),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n');
}

// ── Open Questions Count ────────────────────────────────────────────

export function getOpenQuestionCount(events: Event[]): number {
  return events.filter((event) => event.hasOpenQuestions === true).length;
}

// ── Persona Filter ──────────────────────────────────────────────────

export { filterEventsByPersona, getPersonaLabel } from './persona-filter.ts';
