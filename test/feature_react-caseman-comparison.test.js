import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  parseCasemanEvents,
  autoMatchEvents,
  joinWithMappings,
  getCoverageSummary,
  filterRows,
  searchRows,
  exportComparisonCsv,
  deepLink,
} from '../src/caseman-comparison/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────

const mkEvent = (id, name, taskCodes = [], prerequisiteIds = []) =>
  ({ id, name, domain: 'Unclassified', taskCodes, prerequisiteIds });

const mkParsed = (id, name, domain, taskCodes = []) =>
  ({ id, name, domain, taskCodes, prerequisiteIds: [] });

const mkMapping = (casemanEventId, status, overrides = {}) => ({
  casemanEventId, status,
  newEventName: null, newStateName: null, notes: '', source: 'auto',
  ...overrides,
});

const mkRow = (id, name, domain, status, overrides = {}) => ({
  id, name, domain, taskCodes: [], prerequisiteIds: [],
  casemanEventId: id, status, newEventName: null, newStateName: null,
  notes: '', source: 'auto', ...overrides,
});

// ── parseCasemanEvents ────────────────────────────────────────────────────

describe('parseCasemanEvents — domain derivation (data-prep AC2)', () => {
  it('DP-1: JH prefix → Judgments&Hearings', () => {
    const result = parseCasemanEvents([{ id: 1, name: 'Hearing Listed', taskCodes: ['JH001'], prerequisiteIds: [] }]);
    assert.equal(result[0].domain, 'Judgments&Hearings');
  });

  it('DP-2: EN prefix → Enforcement', () => {
    const result = parseCasemanEvents([{ id: 2, name: 'Bailiff Warrant', taskCodes: ['EN010'], prerequisiteIds: [] }]);
    assert.equal(result[0].domain, 'Enforcement');
  });

  it('DP-3: no task codes → Unclassified', () => {
    const result = parseCasemanEvents([{ id: 3, name: 'Unknown', taskCodes: [], prerequisiteIds: [] }]);
    assert.equal(result[0].domain, 'Unclassified');
  });

  it('DP-4: all 12 prefix-to-domain mappings', () => {
    const cases = [
      ['BC001', 'CCBC'], ['EN001', 'Enforcement'], ['JH001', 'Judgments&Hearings'],
      ['IS001', 'Issue'], ['PA001', 'Payments'], ['LS001', 'Listing'],
      ['CA001', 'Accounts'], ['CO001', 'Complaints'], ['DR001', 'DistrictRegistry'],
      ['FM001', 'Family'], ['IN001', 'Insolvency'], ['SM001', 'Statistics'],
    ];
    const raw = cases.map(([code, _], i) => ({ id: i + 1, name: `Event ${i}`, taskCodes: [code], prerequisiteIds: [] }));
    const result = parseCasemanEvents(raw);
    for (let i = 0; i < cases.length; i++) {
      assert.equal(result[i].domain, cases[i][1], `prefix ${cases[i][0]}`);
    }
  });
});

// ── autoMatchEvents ───────────────────────────────────────────────────────

describe('autoMatchEvents — threshold bucketing (data-prep AC3)', () => {
  it('DP-5: score >0.8 → covered, source auto', () => {
    const events = [mkParsed(1, 'Submit Possession Claim', 'Issue')];
    const result = autoMatchEvents(events, ['Submit Possession Claim']);
    assert.equal(result[0].status, 'covered');
    assert.equal(result[0].source, 'auto');
  });

  it('DP-6: score 0.5–0.8 → partial, source auto', () => {
    // "Claim Filed" vs "Claim Submitted" — share "claim", jaccard = 1/3 ≈ 0.33 (gap)
    // Use words that yield intersection/union in the 0.5–0.8 range:
    // "bailiff warrant issued" vs "bailiff warrant executed" → intersection={bailiff,warrant} union={bailiff,warrant,issued,executed} = 2/4 = 0.5
    const events = [mkParsed(1, 'bailiff warrant issued', 'Enforcement')];
    const result = autoMatchEvents(events, ['bailiff warrant executed']);
    assert.equal(result[0].status, 'partial');
    assert.equal(result[0].source, 'auto');
  });

  it('DP-7: score <0.5 → gap, source auto, newEventName null', () => {
    const events = [mkParsed(1, 'Bailiff Warrant Issued', 'Enforcement')];
    const result = autoMatchEvents(events, ['Submit Possession Claim']);
    assert.equal(result[0].status, 'gap');
    assert.equal(result[0].source, 'auto');
    assert.equal(result[0].newEventName, null);
  });

  it('DP-8: empty candidate list → gap for all', () => {
    const events = [mkParsed(1, 'Any Event', 'Issue'), mkParsed(2, 'Another Event', 'Issue')];
    const result = autoMatchEvents(events, []);
    assert.ok(result.every(r => r.status === 'gap'));
    assert.ok(result.every(r => r.source === 'auto'));
  });
});

// ── joinWithMappings ──────────────────────────────────────────────────────

describe('joinWithMappings — mapping precedence (data-prep AC4)', () => {
  const events = [mkParsed(1, 'Event One', 'Issue'), mkParsed(2, 'Event Two', 'CCBC')];
  const auto = [mkMapping(1, 'gap'), mkMapping(2, 'partial')];

  it('DP-9: curated entry overrides auto for same event ID', () => {
    const curated = [mkMapping(1, 'covered', { source: 'curated', newEventName: 'New Event' })];
    const rows = joinWithMappings(events, auto, curated);
    assert.equal(rows[0].status, 'covered');
    assert.equal(rows[0].source, 'curated');
    assert.equal(rows[0].newEventName, 'New Event');
  });

  it('DP-10: events absent from curated file receive auto mapping', () => {
    const curated = [mkMapping(1, 'covered', { source: 'curated' })];
    const rows = joinWithMappings(events, auto, curated);
    assert.equal(rows[1].status, 'partial');
    assert.equal(rows[1].source, 'auto');
  });

  it('DP-11: no duplicate event IDs in output', () => {
    const rows = joinWithMappings(events, auto, []);
    const ids = rows.map(r => r.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('DP-12: empty curated mappings → all auto-derived', () => {
    const rows = joinWithMappings(events, auto, []);
    assert.ok(rows.every(r => r.source === 'auto'));
  });
});

// ── getCoverageSummary ────────────────────────────────────────────────────

describe('getCoverageSummary — coverage formula (data-prep AC5)', () => {
  it('DP-13: 40 covered / 20 partial / 40 gap → 50%', () => {
    const rows = [
      ...Array(40).fill(null).map((_, i) => mkRow(i, `E${i}`, 'Issue', 'covered')),
      ...Array(20).fill(null).map((_, i) => mkRow(100 + i, `P${i}`, 'Issue', 'partial')),
      ...Array(40).fill(null).map((_, i) => mkRow(200 + i, `G${i}`, 'Issue', 'gap')),
    ];
    const s = getCoverageSummary(rows);
    assert.equal(s.total, 100);
    assert.equal(s.covered, 40);
    assert.equal(s.partial, 20);
    assert.equal(s.gap, 40);
    assert.equal(s.coveragePercent, 50);
  });

  it('DP-14: all covered → 100%', () => {
    const rows = Array(10).fill(null).map((_, i) => mkRow(i, `E${i}`, 'Issue', 'covered'));
    const s = getCoverageSummary(rows);
    assert.equal(s.coveragePercent, 100);
  });

  it('DP-15: all gap → 0%', () => {
    const rows = Array(10).fill(null).map((_, i) => mkRow(i, `E${i}`, 'Issue', 'gap'));
    const s = getCoverageSummary(rows);
    assert.equal(s.coveragePercent, 0);
  });

  it('DP-16: empty dataset → 0 counts, 0%', () => {
    const s = getCoverageSummary([]);
    assert.deepStrictEqual(s, { total: 0, covered: 0, partial: 0, gap: 0, coveragePercent: 0 });
  });
});

// ── filterRows ────────────────────────────────────────────────────────────

describe('filterRows — AND-combining filters (data-prep AC6)', () => {
  const rows = [
    mkRow(1, 'Claim Issued', 'Issue', 'covered'),
    mkRow(2, 'Bailiff Warrant', 'Enforcement', 'gap'),
    mkRow(3, 'Payment Made', 'Payments', 'partial'),
    mkRow(4, 'Hearing Listed', 'Judgments&Hearings', 'gap'),
  ];

  it('DP-17: status + domain filters are both applied (AND)', () => {
    const result = filterRows(rows, { status: 'gap', domain: 'Enforcement' });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 2);
  });

  it('DP-18: status-only filter returns correct subset', () => {
    const result = filterRows(rows, { status: 'gap' });
    assert.equal(result.length, 2);
    assert.ok(result.every(r => r.status === 'gap'));
  });

  it('DP-19: no filters → full dataset returned', () => {
    const result = filterRows(rows, {});
    assert.equal(result.length, 4);
  });
});

// ── searchRows ────────────────────────────────────────────────────────────

describe('searchRows — case-insensitive search (data-prep AC6)', () => {
  const rows = [
    mkRow(1, 'Claim Issued', 'Issue', 'covered', { notes: 'Standard issue flow' }),
    mkRow(2, 'Bailiff Warrant', 'Enforcement', 'gap', { notes: 'Enforcement action required' }),
    mkRow(3, 'Hearing Listed', 'Judgments&Hearings', 'partial', { notes: '' }),
  ];

  it('DP-20: matches event name case-insensitively', () => {
    const result = searchRows(rows, 'CLAIM');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });

  it('DP-21: matches notes field', () => {
    const result = searchRows(rows, 'enforcement action');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 2);
  });

  it('DP-22: no match → empty array', () => {
    const result = searchRows(rows, 'xyz_no_match_xyz');
    assert.deepStrictEqual(result, []);
  });
});

// ── exportComparisonCsv ───────────────────────────────────────────────────

describe('exportComparisonCsv — Rule 7 column order and escaping (events-tab AC6)', () => {
  it('EX-1: column order matches Rule 7 exactly', () => {
    const rows = [mkRow(1, 'Claim Issued', 'Issue', 'covered')];
    const csv = exportComparisonCsv(rows);
    const header = csv.split('\n')[0];
    assert.equal(header, 'ID,Event Name,Domain,Status,New Model Event,New State,Notes,Source');
  });

  it('EX-2: value containing comma is quoted', () => {
    const rows = [mkRow(1, 'Claim, Issued', 'Issue', 'covered')];
    const csv = exportComparisonCsv(rows);
    assert.ok(csv.includes('"Claim, Issued"'));
  });

  it('EX-3: value containing newline is quoted', () => {
    const rows = [mkRow(1, 'Claim\nIssued', 'Issue', 'covered')];
    const csv = exportComparisonCsv(rows);
    assert.ok(csv.includes('"Claim\nIssued"'));
  });

  it('EX-4: empty array → header row only', () => {
    const csv = exportComparisonCsv([]);
    assert.equal(csv, 'ID,Event Name,Domain,Status,New Model Event,New State,Notes,Source');
  });
});

// ── deepLink ──────────────────────────────────────────────────────────────

describe('deepLink — Rule 8 deep links (events-tab AC3)', () => {
  it('EX-5: covered row with newEventName → /event-matrix?search=', () => {
    const m = mkMapping(1, 'covered', { newEventName: 'Submit Claim' });
    assert.equal(deepLink(m), '/event-matrix?search=Submit%20Claim');
  });

  it('EX-6: covered row with newStateName → /state-explorer?highlight=', () => {
    const m = mkMapping(1, 'covered', { newStateName: 'HEARING_LISTED' });
    assert.equal(deepLink(m), '/state-explorer?highlight=HEARING_LISTED');
  });

  it('EX-7: gap row → no link (null)', () => {
    const m = mkMapping(1, 'gap');
    assert.equal(deepLink(m), null);
  });
});
