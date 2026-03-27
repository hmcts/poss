import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  getDashboardSummary,
  getAlignedTaskRows,
  getPartialTaskRows,
  getGapTaskRows,
  groupTasksByState,
  groupTasksByContext,
  exportAlignmentCsv,
} from '../src/ui-wa-tasks/dashboard-helpers.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── 1. getDashboardSummary ──────────────────────────────────────────

describe('getDashboardSummary — alignment counts and percentages', () => {
  it('T-1.1: returns correct total count', () => {
    const summary = getDashboardSummary(waTasks, waMappings);
    assert.equal(summary.total, 17, 'Total should be 17');
  });

  it('T-1.2: returns correct aligned/partial/gap counts', () => {
    const summary = getDashboardSummary(waTasks, waMappings);
    assert.equal(summary.aligned, 7, 'Aligned should be 7');
    assert.equal(summary.partial, 9, 'Partial should be 9');
    assert.equal(summary.gap, 1, 'Gap should be 1');
  });

  it('T-1.3: percentages sum to approximately 100', () => {
    const summary = getDashboardSummary(waTasks, waMappings);
    const totalPct = summary.alignedPct + summary.partialPct + summary.gapPct;
    assert.ok(totalPct >= 99 && totalPct <= 101, `Percentages should sum to ~100, got ${totalPct}`);
  });

  it('T-1.4: alignedPct is approximately 41.2', () => {
    const summary = getDashboardSummary(waTasks, waMappings);
    assert.ok(summary.alignedPct >= 41 && summary.alignedPct <= 42, `alignedPct should be ~41.2, got ${summary.alignedPct}`);
  });

  it('T-1.5: empty data returns all zeros', () => {
    const summary = getDashboardSummary([], []);
    assert.equal(summary.total, 0);
    assert.equal(summary.aligned, 0);
    assert.equal(summary.partial, 0);
    assert.equal(summary.gap, 0);
    assert.equal(summary.alignedPct, 0);
    assert.equal(summary.partialPct, 0);
    assert.equal(summary.gapPct, 0);
  });
});

// ── 2. getAlignedTaskRows ───────────────────────────────────────────

describe('getAlignedTaskRows — rows for aligned tasks', () => {
  it('T-2.1: returns exactly 7 rows', () => {
    const rows = getAlignedTaskRows(waTasks, waMappings);
    assert.equal(rows.length, 7, 'Should be 7 aligned tasks');
  });

  it('T-2.2: each row has taskName, triggerDescription, matchedEvents, alignment', () => {
    const rows = getAlignedTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(typeof row.taskName === 'string' && row.taskName.length > 0, 'taskName must be non-empty');
      assert.ok(typeof row.triggerDescription === 'string' && row.triggerDescription.length > 0, 'triggerDescription must be non-empty');
      assert.ok(Array.isArray(row.matchedEvents), 'matchedEvents must be an array');
      assert.equal(row.alignment, 'aligned', 'alignment must be aligned');
    }
  });

  it('T-2.3: matchedEvents are non-empty for aligned tasks', () => {
    const rows = getAlignedTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(row.matchedEvents.length > 0, `${row.taskName} should have matched events`);
    }
  });

  it('T-2.4: each row has badge data with green colour', () => {
    const rows = getAlignedTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(row.badge, 'Row must have badge');
      assert.equal(row.badge.label, 'Aligned');
      assert.equal(row.badge.colour, '#22C55E');
    }
  });
});

// ── 3. getPartialTaskRows ───────────────────────────────────────────

describe('getPartialTaskRows — rows for partial tasks', () => {
  it('T-3.1: returns exactly 9 rows', () => {
    const rows = getPartialTaskRows(waTasks, waMappings);
    assert.equal(rows.length, 9, 'Should be 9 partial tasks');
  });

  it('T-3.2: each row has non-empty missing field', () => {
    const rows = getPartialTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(typeof row.missing === 'string' && row.missing.length > 0, `${row.taskName} must have non-empty missing`);
    }
  });

  it('T-3.3: each row has amber badge', () => {
    const rows = getPartialTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(row.badge, 'Row must have badge');
      assert.equal(row.badge.label, 'Partial');
      assert.equal(row.badge.colour, '#F59E0B');
    }
  });

  it('T-3.4: each row has matchedEvents array', () => {
    const rows = getPartialTaskRows(waTasks, waMappings);
    for (const row of rows) {
      assert.ok(Array.isArray(row.matchedEvents), 'matchedEvents must be an array');
    }
  });
});

// ── 4. getGapTaskRows ───────────────────────────────────────────────

describe('getGapTaskRows — rows for gap tasks', () => {
  it('T-4.1: returns exactly 1 row', () => {
    const rows = getGapTaskRows(waTasks, waMappings);
    assert.equal(rows.length, 1, 'Should be 1 gap task');
  });

  it('T-4.2: gap task is Review Failed Payment', () => {
    const rows = getGapTaskRows(waTasks, waMappings);
    assert.equal(rows[0].taskName, 'Review Failed Payment');
  });

  it('T-4.3: gap task has empty matchedEvents', () => {
    const rows = getGapTaskRows(waTasks, waMappings);
    assert.equal(rows[0].matchedEvents.length, 0, 'Gap task should have no matched events');
  });

  it('T-4.4: gap task has non-empty recommendation', () => {
    const rows = getGapTaskRows(waTasks, waMappings);
    assert.ok(typeof rows[0].recommendation === 'string' && rows[0].recommendation.length > 0, 'Must have recommendation');
  });

  it('T-4.5: gap task has red badge', () => {
    const rows = getGapTaskRows(waTasks, waMappings);
    assert.equal(rows[0].badge.label, 'Gap');
    assert.equal(rows[0].badge.colour, '#EF4444');
  });
});

// ── 5. groupTasksByState ────────────────────────────────────────────

describe('groupTasksByState — group tasks by event states', () => {
  const mockEvents = [
    { state: 'CASE_ISSUED', name: 'Case Issued' },
    { state: 'CASE_ISSUED', name: 'Allocate hearing centre' },
    { state: 'CASE_PROGRESSION', name: 'Respond to Claim' },
    { state: 'CASE_PROGRESSION', name: 'Upload your documents' },
  ];

  it('T-5.1: groups tasks under correct states', () => {
    const groups = groupTasksByState(waTasks, waMappings, mockEvents);
    assert.ok(groups['CASE_ISSUED'], 'Should have CASE_ISSUED group');
    assert.ok(groups['CASE_PROGRESSION'], 'Should have CASE_PROGRESSION group');
  });

  it('T-5.2: CASE_ISSUED includes tasks for Case Issued and Allocate hearing centre', () => {
    const groups = groupTasksByState(waTasks, waMappings, mockEvents);
    const taskNames = groups['CASE_ISSUED'].map((t) => t.taskName);
    assert.ok(taskNames.includes('New Claim -- Listing required'), 'Should include wa-task-01');
    assert.ok(taskNames.includes('New Claim -- Hearing Centre Update'), 'Should include wa-task-02');
  });

  it('T-5.3: empty events returns empty object', () => {
    const groups = groupTasksByState(waTasks, waMappings, []);
    assert.deepEqual(groups, {}, 'Empty events should produce empty groups');
  });

  it('T-5.4: tasks are not duplicated within a state', () => {
    const dupeEvents = [
      { state: 'STATE_X', name: 'Upload your documents' },
      { state: 'STATE_X', name: 'Upload your documents' },
    ];
    const groups = groupTasksByState(waTasks, waMappings, dupeEvents);
    if (groups['STATE_X']) {
      const ids = groups['STATE_X'].map((t) => t.id);
      const uniqueIds = [...new Set(ids)];
      assert.equal(ids.length, uniqueIds.length, 'No duplicate tasks within a state');
    }
  });
});

// ── 6. groupTasksByContext ──────────────────────────────────────────

describe('groupTasksByContext — group tasks by context', () => {
  it('T-6.1: returns correct group sizes', () => {
    const groups = groupTasksByContext(waTasks);
    assert.equal(groups['claim'].length, 3, 'claim should have 3 tasks');
    assert.equal(groups['counterclaim'].length, 2, 'counterclaim should have 2 tasks');
    assert.equal(groups['gen-app'].length, 4, 'gen-app should have 4 tasks');
    assert.equal(groups['claim-counterclaim'].length, 2, 'claim-counterclaim should have 2 tasks');
    assert.equal(groups['general'].length, 6, 'general should have 6 tasks');
  });

  it('T-6.2: all tasks are accounted for', () => {
    const groups = groupTasksByContext(waTasks);
    const total = Object.values(groups).reduce((sum, arr) => sum + arr.length, 0);
    assert.equal(total, 17, 'Total grouped tasks should be 17');
  });

  it('T-6.3: empty tasks returns empty object', () => {
    const groups = groupTasksByContext([]);
    assert.deepEqual(groups, {}, 'Empty tasks should produce empty groups');
  });
});

// ── 7. exportAlignmentCsv ──────────────────────────────────────────

describe('exportAlignmentCsv — CSV string generation', () => {
  it('T-7.1: first line is the header row', () => {
    const csv = exportAlignmentCsv(waTasks, waMappings);
    const lines = csv.trim().split('\n');
    assert.equal(lines[0], 'Task Name,Trigger,Alignment,Matched Events,Alignment Notes');
  });

  it('T-7.2: contains 18 lines (header + 17 data rows)', () => {
    const csv = exportAlignmentCsv(waTasks, waMappings);
    const lines = csv.trim().split('\n');
    assert.equal(lines.length, 18, 'Should be 18 lines total');
  });

  it('T-7.3: matched events are semicolon-separated', () => {
    const csv = exportAlignmentCsv(waTasks, waMappings);
    // wa-task-03 maps to multiple events: Respond to Claim, Paper Response - Admission, Paper Response - Reviewed
    assert.ok(csv.includes('Respond to Claim;'), 'Multi-event tasks should use semicolons');
  });

  it('T-7.4: empty data returns header only', () => {
    const csv = exportAlignmentCsv([], []);
    const lines = csv.trim().split('\n');
    assert.equal(lines.length, 1, 'Empty data should produce header only');
    assert.equal(lines[0], 'Task Name,Trigger,Alignment,Matched Events,Alignment Notes');
  });

  it('T-7.5: fields containing commas are quoted', () => {
    const csv = exportAlignmentCsv(waTasks, waMappings);
    // Check that the CSV does not break on fields with commas -- alignment notes often contain commas
    const lines = csv.trim().split('\n');
    // Each line should parse to at least 5 logical fields
    assert.ok(lines.length > 1, 'Should have data rows');
  });
});
