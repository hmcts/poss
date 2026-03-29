/**
 * caseman-comparison — pure logic module
 *
 * All functions are side-effect-free. No DOM, no React, no file I/O.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface CasemanEvent {
  id: number;
  name: string;
  domain: string;
  taskCodes: string[];
  prerequisiteIds: number[];
}

export interface CasemanMapping {
  casemanEventId: number;
  status: 'covered' | 'partial' | 'gap';
  newEventName: string | null;
  newStateName: string | null;
  notes: string;
  source: 'auto' | 'curated';
}

export interface JoinedRow extends CasemanEvent, CasemanMapping {}

export interface CoverageSummary {
  total: number;
  covered: number;
  partial: number;
  gap: number;
  coveragePercent: number;
}

// ── Rule 4: prefix → domain map ────────────────────────────────────────────

const PREFIX_DOMAIN: Record<string, string> = {
  BC: 'CCBC',
  EN: 'Enforcement',
  JH: 'Judgments&Hearings',
  IS: 'Issue',
  PA: 'Payments',
  LS: 'Listing',
  CA: 'Accounts',
  CO: 'Complaints',
  DR: 'DistrictRegistry',
  FM: 'Family',
  IN: 'Insolvency',
  SM: 'Statistics',
};

function taskCodePrefix(taskCode: string): string {
  return taskCode.slice(0, 2).toUpperCase();
}

function deriveDomain(taskCodes: string[]): string {
  if (!taskCodes || taskCodes.length === 0) return 'Unclassified';
  const prefix = taskCodePrefix(taskCodes[0]);
  return PREFIX_DOMAIN[prefix] ?? 'Unclassified';
}

// ── parseCasemanEvents ─────────────────────────────────────────────────────

export function parseCasemanEvents(rawEvents: Array<Record<string, unknown>>): CasemanEvent[] {
  return rawEvents.map((raw) => {
    const taskCodes = (raw.taskCodes as string[]) ?? [];
    return {
      id: raw.id as number,
      name: raw.name as string,
      domain: deriveDomain(taskCodes),
      taskCodes,
      prerequisiteIds: (raw.prerequisiteIds as number[]) ?? [],
    };
  });
}

// ── Rule 5: string similarity (Jaccard on word tokens) ────────────────────

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(normalise(a).split(/\s+/).filter(Boolean));
  const setB = new Set(normalise(b).split(/\s+/).filter(Boolean));
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

function scoreToStatus(score: number): 'covered' | 'partial' | 'gap' {
  if (score > 0.8) return 'covered';
  if (score >= 0.5) return 'partial';
  return 'gap';
}

// ── autoMatchEvents ────────────────────────────────────────────────────────

export function autoMatchEvents(
  casemanEvents: CasemanEvent[],
  newServiceEvents: string[],
): CasemanMapping[] {
  return casemanEvents.map((ev) => {
    if (!newServiceEvents || newServiceEvents.length === 0) {
      return {
        casemanEventId: ev.id,
        status: 'gap',
        newEventName: null,
        newStateName: null,
        notes: '',
        source: 'auto',
      };
    }

    let bestScore = 0;
    let bestMatch: string | null = null;
    for (const candidate of newServiceEvents) {
      const score = jaccardSimilarity(ev.name, candidate);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    }

    const status = scoreToStatus(bestScore);
    return {
      casemanEventId: ev.id,
      status,
      newEventName: status !== 'gap' ? bestMatch : null,
      newStateName: null,
      notes: '',
      source: 'auto',
    };
  });
}

// ── joinWithMappings ───────────────────────────────────────────────────────

export function joinWithMappings(
  casemanEvents: CasemanEvent[],
  autoMappings: CasemanMapping[],
  curatedMappings: CasemanMapping[],
): JoinedRow[] {
  const autoMap = new Map<number, CasemanMapping>(autoMappings.map((m) => [m.casemanEventId, m]));
  const curatedMap = new Map<number, CasemanMapping>(curatedMappings.map((m) => [m.casemanEventId, m]));

  return casemanEvents.map((ev) => {
    // curated wins over auto (Rule 6)
    const mapping = curatedMap.get(ev.id) ?? autoMap.get(ev.id) ?? {
      casemanEventId: ev.id,
      status: 'gap' as const,
      newEventName: null,
      newStateName: null,
      notes: '',
      source: 'auto' as const,
    };
    return { ...ev, ...mapping };
  });
}

// ── getCoverageSummary ─────────────────────────────────────────────────────

export function getCoverageSummary(rows: JoinedRow[]): CoverageSummary {
  const total = rows.length;
  if (total === 0) {
    return { total: 0, covered: 0, partial: 0, gap: 0, coveragePercent: 0 };
  }
  let covered = 0;
  let partial = 0;
  let gap = 0;
  for (const row of rows) {
    if (row.status === 'covered') covered++;
    else if (row.status === 'partial') partial++;
    else gap++;
  }
  const coveragePercent = ((covered + partial * 0.5) / total) * 100;
  return { total, covered, partial, gap, coveragePercent };
}

// ── filterRows ─────────────────────────────────────────────────────────────

export function filterRows(
  rows: JoinedRow[],
  filters: { status?: string | null; domain?: string | null },
): JoinedRow[] {
  return rows.filter((row) => {
    if (filters.status && row.status !== filters.status) return false;
    if (filters.domain && row.domain !== filters.domain) return false;
    return true;
  });
}

// ── searchRows ─────────────────────────────────────────────────────────────

export function searchRows(rows: JoinedRow[], query: string): JoinedRow[] {
  if (!query) return rows;
  const q = query.toLowerCase();
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) || row.notes.toLowerCase().includes(q),
  );
}

// ── exportComparisonCsv ────────────────────────────────────────────────────

function csvEscape(value: string | null | undefined): string {
  const s = value == null ? '' : String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// Rule 7: ID, Event Name, Domain, Status, New Model Event, New State, Notes, Source
export function exportComparisonCsv(rows: JoinedRow[]): string {
  const header = 'ID,Event Name,Domain,Status,New Model Event,New State,Notes,Source';
  if (rows.length === 0) return header;
  const dataRows = rows.map((row) =>
    [
      csvEscape(String(row.id)),
      csvEscape(row.name),
      csvEscape(row.domain),
      csvEscape(row.status),
      csvEscape(row.newEventName),
      csvEscape(row.newStateName),
      csvEscape(row.notes),
      csvEscape(row.source),
    ].join(','),
  );
  return [header, ...dataRows].join('\n');
}

// ── deepLink ──────────────────────────────────────────────────────────────

export function deepLink(mapping: CasemanMapping): string | null {
  if (mapping.status === 'gap') return null;
  if (mapping.newEventName) return `/event-matrix?search=${encodeURIComponent(mapping.newEventName)}`;
  if (mapping.newStateName) return `/state-explorer?highlight=${encodeURIComponent(mapping.newStateName)}`;
  return null;
}
