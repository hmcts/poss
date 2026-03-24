import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getFilterOptions,
  applyFiltersAndSearch,
  prepareTableData,
  prepareCsvDownload,
  getEventMatrixSummary,
  getUniqueStates,
  getUniqueClaimTypes,
} from '../src/ui-event-matrix/index.js';

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
    state: 'CASE_ISSUED', isSystemEvent: false, notes: 'Defendant submits',
    hasOpenQuestions: true, actors: { Judge: false, Caseworker: false, Defendant: true },
  },
];

// ── 1. getFilterOptions ─────────────────────────────────────────────

describe('getFilterOptions', () => {
  it('UEM-01: extracts sorted unique claim types', () => {
    const opts = getFilterOptions(events);
    assert.deepStrictEqual(opts.claimTypes, ['ENFORCEMENT', 'MAIN_CLAIM_ENGLAND']);
  });

  it('UEM-02: extracts sorted unique states', () => {
    const opts = getFilterOptions(events);
    assert.deepStrictEqual(opts.states, ['CASE_ISSUED', 'CASE_PROGRESSION', 'PENDING_CASE_ISSUED']);
  });

  it('UEM-03: extracts sorted unique roles from actor keys', () => {
    const opts = getFilterOptions(events);
    assert.deepStrictEqual(opts.roles, ['Caseworker', 'Claimant', 'Defendant', 'Judge']);
  });
});

// ── 2. applyFiltersAndSearch ────────────────────────────────────────

describe('applyFiltersAndSearch', () => {
  it('UEM-04: no filters + empty query returns all events', () => {
    const result = applyFiltersAndSearch(events, {}, '');
    assert.equal(result.length, events.length);
  });

  it('UEM-05: applies filter then search in sequence', () => {
    // Filter to MAIN_CLAIM_ENGLAND (3 events), then search for "issue" (1 match)
    const result = applyFiltersAndSearch(events, { claimType: 'MAIN_CLAIM_ENGLAND' }, 'issue');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-001');
  });

  it('UEM-06: filter narrows before search applies', () => {
    // Filter to ENFORCEMENT, then search for "hearing"
    const result = applyFiltersAndSearch(events, { claimType: 'ENFORCEMENT' }, 'hearing');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'evt-003');
  });

  it('UEM-07: search with no filter match returns empty', () => {
    const result = applyFiltersAndSearch(events, {}, 'nonexistent query xyz');
    assert.equal(result.length, 0);
  });
});

// ── 3. prepareTableData ─────────────────────────────────────────────

describe('prepareTableData', () => {
  it('UEM-08: returns correct headers and row count', () => {
    const roles = ['Judge', 'Caseworker'];
    const table = prepareTableData(events, roles);
    assert.deepStrictEqual(table.headers, roles);
    assert.equal(table.rows.length, events.length);
  });

  it('UEM-09: each row has an indicator object', () => {
    const roles = ['Judge'];
    const table = prepareTableData(events, roles);
    for (const row of table.rows) {
      assert.ok('indicator' in row);
      assert.ok('hasOpenQuestions' in row.indicator);
      assert.ok('indicatorType' in row.indicator);
      assert.ok('indicatorColor' in row.indicator);
    }
  });

  it('UEM-10: open-question event gets warning indicator', () => {
    const roles = ['Judge'];
    const table = prepareTableData([events[2]], roles); // evt-003 has open questions
    assert.equal(table.rows[0].indicator.hasOpenQuestions, true);
    assert.equal(table.rows[0].indicator.indicatorType, 'warning');
  });
});

// ── 4. prepareCsvDownload ───────────────────────────────────────────

describe('prepareCsvDownload', () => {
  it('UEM-11: returns correct filename and mimeType', () => {
    const download = prepareCsvDownload(events);
    assert.equal(download.filename, 'event-matrix.csv');
    assert.equal(download.mimeType, 'text/csv');
  });

  it('UEM-12: content is a non-empty CSV string', () => {
    const download = prepareCsvDownload(events);
    assert.ok(typeof download.content === 'string');
    assert.ok(download.content.length > 0);
    const lines = download.content.split('\n');
    assert.ok(lines.length >= 2); // header + at least one data row
  });
});

// ── 5. getEventMatrixSummary ────────────────────────────────────────

describe('getEventMatrixSummary', () => {
  it('UEM-13: returns correct total and filtered counts', () => {
    const filtered = [events[0], events[1]];
    const summary = getEventMatrixSummary(events, filtered);
    assert.equal(summary.total, 4);
    assert.equal(summary.filtered, 2);
  });

  it('UEM-14: counts open questions from filtered events', () => {
    const filtered = [events[2], events[3]]; // both have open questions
    const summary = getEventMatrixSummary(events, filtered);
    assert.equal(summary.openQuestions, 2);
  });

  it('UEM-15: counts system events from filtered events', () => {
    const summary = getEventMatrixSummary(events, events);
    assert.equal(summary.systemEvents, 1); // only evt-002 is system
  });
});

// ── 6. getUniqueStates / getUniqueClaimTypes ────────────────────────

describe('getUniqueStates / getUniqueClaimTypes', () => {
  it('UEM-16: getUniqueStates returns sorted unique states', () => {
    const states = getUniqueStates(events);
    assert.deepStrictEqual(states, ['CASE_ISSUED', 'CASE_PROGRESSION', 'PENDING_CASE_ISSUED']);
  });

  it('UEM-17: getUniqueClaimTypes returns sorted unique claim types', () => {
    const types = getUniqueClaimTypes(events);
    assert.deepStrictEqual(types, ['ENFORCEMENT', 'MAIN_CLAIM_ENGLAND']);
  });
});

// ── 7. Edge Cases ───────────────────────────────────────────────────

describe('Edge cases -- empty input', () => {
  it('UEM-18: all functions handle empty arrays', () => {
    const opts = getFilterOptions([]);
    assert.deepStrictEqual(opts.claimTypes, []);
    assert.deepStrictEqual(opts.states, []);
    assert.deepStrictEqual(opts.roles, []);

    assert.deepStrictEqual(applyFiltersAndSearch([], {}, ''), []);
    assert.deepStrictEqual(applyFiltersAndSearch([], {}, 'test'), []);

    const table = prepareTableData([], ['Judge']);
    assert.deepStrictEqual(table.headers, ['Judge']);
    assert.deepStrictEqual(table.rows, []);

    const download = prepareCsvDownload([]);
    assert.ok(download.content.length > 0); // at least header row
    assert.equal(download.filename, 'event-matrix.csv');

    const summary = getEventMatrixSummary([], []);
    assert.equal(summary.total, 0);
    assert.equal(summary.filtered, 0);
    assert.equal(summary.openQuestions, 0);
    assert.equal(summary.systemEvents, 0);

    assert.deepStrictEqual(getUniqueStates([]), []);
    assert.deepStrictEqual(getUniqueClaimTypes([]), []);
  });
});
