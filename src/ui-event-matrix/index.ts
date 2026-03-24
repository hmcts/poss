/**
 * UI Event Matrix — orchestration layer
 *
 * Composes event-matrix and uncertainty-display functions into a
 * UI-ready API for the event matrix view.
 */

import {
  filterEvents,
  searchEvents,
  eventsToActorGrid,
  eventsToCsv,
} from '../event-matrix/index.js';

import { getEventIndicator } from '../uncertainty-display/index.js';

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

interface EventIndicator {
  hasOpenQuestions: boolean;
  indicatorType: 'warning' | 'none';
  indicatorColor: string;
}

interface FilterOptions {
  claimTypes: string[];
  states: string[];
  roles: string[];
}

interface TableRow {
  event: Event;
  actors: boolean[];
  indicator: EventIndicator;
}

interface TableData {
  headers: string[];
  rows: TableRow[];
}

interface CsvDownload {
  content: string;
  filename: string;
  mimeType: string;
}

interface EventMatrixSummary {
  total: number;
  filtered: number;
  openQuestions: number;
  systemEvents: number;
}

// ── Exported Functions ──────────────────────────────────────────────

export function getFilterOptions(events: Event[]): FilterOptions {
  const claimTypeSet = new Set<string>();
  const stateSet = new Set<string>();
  const roleSet = new Set<string>();

  for (const event of events) {
    claimTypeSet.add(event.claimType);
    stateSet.add(event.state);
    for (const role of Object.keys(event.actors)) {
      roleSet.add(role);
    }
  }

  return {
    claimTypes: Array.from(claimTypeSet).sort(),
    states: Array.from(stateSet).sort(),
    roles: Array.from(roleSet).sort(),
  };
}

export function applyFiltersAndSearch(
  events: Event[],
  filters: FilterCriteria,
  searchQuery: string,
): Event[] {
  const filtered = filterEvents(events, filters);
  return searchEvents(filtered, searchQuery);
}

export function prepareTableData(events: Event[], roles: string[]): TableData {
  const grid = eventsToActorGrid(events, roles);
  return {
    headers: grid.headers,
    rows: grid.rows.map((row) => ({
      event: row.event,
      actors: row.actors,
      indicator: getEventIndicator(row.event) as EventIndicator,
    })),
  };
}

export function prepareCsvDownload(events: Event[]): CsvDownload {
  return {
    content: eventsToCsv(events),
    filename: 'event-matrix.csv',
    mimeType: 'text/csv',
  };
}

export function getEventMatrixSummary(
  events: Event[],
  filteredEvents: Event[],
): EventMatrixSummary {
  return {
    total: events.length,
    filtered: filteredEvents.length,
    openQuestions: filteredEvents.filter((e) => e.hasOpenQuestions).length,
    systemEvents: filteredEvents.filter((e) => e.isSystemEvent).length,
  };
}

export function getUniqueStates(events: Event[]): string[] {
  return Array.from(new Set(events.map((e) => e.state))).sort();
}

export function getUniqueClaimTypes(events: Event[]): string[] {
  return Array.from(new Set(events.map((e) => e.claimType))).sort();
}
