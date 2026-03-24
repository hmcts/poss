import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  filterEvents,
  searchEvents,
  eventsToActorGrid,
  eventsToCsv,
  getOpenQuestionCount,
} from '../src/event-matrix/index.js';

// ── Fixtures ────────────────────────────────────────────────────────

const events = [
  {
    id: 'evt-001', name: 'Issue Claim', claimType: 'MAIN_CLAIM_ENGLAND',
    state: 'CASE_ISSUED', isSystemEvent: false, notes: 'Standard issuance',
    hasOpenQuestions: false, actors: { Judge: false, Caseworker: true, Claimant: true },
  },
  {
    id: 'evt-002', name: 'Auto Payment Check', claimType: 'MAIN_CLAIM_ENGLAND',
    state: 'PENDING_CASE_ISSUED', isSystemEvent: true, notes: 'System checks payment',
    hasOpenQuestions: false, actors: { Judge: false, Caseworker: false, Claimant: false },
  },
  {
    id: 'evt-003', name: 'Schedule Hearing', claimType: 'ENFORCEMENT',
    state: 'CASE_PROGRESSION', isSystemEvent: false, notes: 'TBC - needs judge review',
    hasOpenQuestions: true, actors: { Judge: true, Caseworker: true, Claimant: false },
  },
  {
    id: 'evt-004', name: 'Submit Response', claimType: 'MAIN_CLAIM_ENGLAND',
    state: 'CASE_ISSUED', isSystemEvent: false, notes: 'Defendant submits, "quoted text"',
    hasOpenQuestions: true, actors: { Judge: false, Caseworker: false, Claimant: false },
  },
];

// ── 1. Filter Engine ────────────────────────────────────────────────

describe('filterEvents', () => {
  it('FE-1: no filters returns all events', () => {
    const result = filterEvents(events, {});
    assert.equal(result.length, events.length);
  });

  it('FE-2: filter by claimType', () => {
    const result = filterEvents(events, { claimType: 'ENFORCEMENT' });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-003');
  });

  it('FE-3: filter by role returns events where role is true', () => {
    const result = filterEvents(events, { role: 'Judge' });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-003');
  });

  it('FE-4: filter by systemOnly=true', () => {
    const result = filterEvents(events, { systemOnly: true });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-002');
  });

  it('FE-5: multiple filters combine with AND logic', () => {
    const result = filterEvents(events, { claimType: 'MAIN_CLAIM_ENGLAND', role: 'Caseworker' });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-001');
  });

  it('FE-6: filter by state', () => {
    const result = filterEvents(events, { state: 'CASE_ISSUED' });
    assert.equal(result.length, 2);
    assert.ok(result.every(e => e.state === 'CASE_ISSUED'));
  });
});

// ── 2. Search ───────────────────────────────────────────────────────

describe('searchEvents', () => {
  it('SE-1: empty query returns all events', () => {
    const result = searchEvents(events, '');
    assert.equal(result.length, events.length);
  });

  it('SE-2: matches event name case-insensitively', () => {
    const result = searchEvents(events, 'issue claim');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-001');
  });

  it('SE-3: matches notes field', () => {
    const result = searchEvents(events, 'judge review');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-003');
  });

  it('SE-4: whitespace-only query returns all events', () => {
    const result = searchEvents(events, '   ');
    assert.equal(result.length, events.length);
  });
});

// ── 3. Actor Grid ───────────────────────────────────────────────────

describe('eventsToActorGrid', () => {
  it('AG-1: headers match provided roles array', () => {
    const roles = ['Judge', 'Caseworker', 'Claimant'];
    const grid = eventsToActorGrid(events, roles);
    assert.deepStrictEqual(grid.headers, roles);
  });

  it('AG-2: actors boolean array is parallel to headers', () => {
    const roles = ['Judge', 'Caseworker'];
    const grid = eventsToActorGrid([events[0]], roles);
    assert.equal(grid.rows.length, 1);
    assert.deepStrictEqual(grid.rows[0].actors, [false, true]);
    assert.equal(grid.rows[0].event.id, 'evt-001');
  });

  it('AG-3: missing role key defaults to false', () => {
    const roles = ['Judge', 'BailiffEnforcement'];
    const grid = eventsToActorGrid([events[0]], roles);
    assert.deepStrictEqual(grid.rows[0].actors, [false, false]);
  });
});

// ── 4. CSV Export ───────────────────────────────────────────────────

describe('eventsToCsv', () => {
  it('CS-1: produces valid CSV with header row', () => {
    const csv = eventsToCsv([events[0]]);
    const lines = csv.split('\n');
    assert.ok(lines[0].startsWith('State,Event,System,Notes,'));
    assert.ok(lines.length >= 2);
  });

  it('CS-2: escapes fields containing commas or quotes', () => {
    const csv = eventsToCsv([events[3]]);
    const lines = csv.split('\n');
    const dataLine = lines[1];
    // The notes field contains a comma and quotes — must be escaped
    assert.ok(dataLine.includes('"'), 'Fields with special chars should be quoted');
  });

  it('CS-3: system column shows Y or N', () => {
    const csv = eventsToCsv([events[1]]);
    const lines = csv.split('\n');
    const cols = lines[1].split(',');
    // System column is 3rd (index 2)
    assert.equal(cols[2], 'Y');
  });
});

// ── 5. Open Questions ───────────────────────────────────────────────

describe('getOpenQuestionCount', () => {
  it('OQ-1: returns correct count of events with open questions', () => {
    const count = getOpenQuestionCount(events);
    assert.equal(count, 2);
  });

  it('OQ-2: returns 0 for events with no open questions', () => {
    const count = getOpenQuestionCount([events[0], events[1]]);
    assert.equal(count, 0);
  });
});

// ── 6. Edge Cases ───────────────────────────────────────────────────

describe('Edge cases — empty input', () => {
  it('EC-1: all functions handle empty arrays', () => {
    assert.deepStrictEqual(filterEvents([], {}), []);
    assert.deepStrictEqual(searchEvents([], 'test'), []);
    const grid = eventsToActorGrid([], ['Judge']);
    assert.deepStrictEqual(grid.headers, ['Judge']);
    assert.deepStrictEqual(grid.rows, []);
    assert.equal(eventsToCsv([]).split('\n').length, 1); // header only
    assert.equal(getOpenQuestionCount([]), 0);
  });
});
