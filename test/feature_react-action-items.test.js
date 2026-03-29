import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  getActionItems,
  getActionItemSummary,
  filterActionItems,
  sortActionItems,
  exportActionItemsCsv,
} from '../src/ui-action-items/index.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── Helpers ─────────────────────────────────────────────────────────

const mkItem = (overrides) => ({
  id: 'test-id', type: 'unreachable', category: 'Model Completeness',
  priority: 'high', title: 'Test', detail: 'Detail', suggestion: 'Fix it',
  state: null, claimType: null, linkPath: null, ...overrides,
});

// ── 1. getActionItems — collection ──────────────────────────────────

describe('getActionItems — WA gap and partial items from real data (AC-1-4)', () => {
  const items = getActionItems([], [], [], waTasks, waMappings);

  it('T-1-3b: exactly 1 wa-gap item (high) for wa-task-17', () => {
    const gaps = items.filter((i) => i.type === 'wa-gap');
    assert.equal(gaps.length, 1);
    assert.equal(gaps[0].priority, 'high');
    assert.ok(gaps[0].title.includes('Review Failed Payment'));
    assert.equal(gaps[0].category, 'WA Task Alignment');
    assert.equal(gaps[0].linkPath, '/work-allocation');
  });

  it('T-1-4: exactly 9 wa-partial items (medium)', () => {
    const partials = items.filter((i) => i.type === 'wa-partial');
    assert.equal(partials.length, 9);
    for (const p of partials) {
      assert.equal(p.priority, 'medium');
      assert.equal(p.category, 'WA Task Alignment');
      assert.ok(p.suggestion.startsWith('Refine event granularity:'));
    }
  });
});

describe('getActionItems — model completeness items (AC-1-1, AC-1-2, AC-1-3)', () => {
  it('T-1-1: open questions produce medium-priority items', () => {
    const events = [
      { id: 'e1', name: 'Submit Claim', state: 'DRAFT', hasOpenQuestions: true, notes: 'Budget unclear for hearing fees', isSystemEvent: false },
      { id: 'e2', name: 'Auto Timeout', state: 'PENDING', hasOpenQuestions: true, notes: 'Timing unknown', isSystemEvent: true },
    ];
    const items = getActionItems([], [], events, [], []);
    const oqs = items.filter((i) => i.type === 'open-question');
    assert.equal(oqs.length, 2, 'Both events including system event produce open-question items');
    assert.equal(oqs[0].priority, 'medium');
    assert.equal(oqs[0].category, 'Model Completeness');
    assert.ok(oqs[0].linkPath.includes('/event-matrix?search='));
  });

  it('T-1-5: no-wa-task items exclude system events', () => {
    const events = [
      { id: 'e1', name: 'Submit Claim', state: 'DRAFT', isSystemEvent: false },
      { id: 'e2', name: 'System Timeout', state: 'PENDING', isSystemEvent: true },
    ];
    const items = getActionItems([], [], events, waTasks, waMappings);
    const noWa = items.filter((i) => i.type === 'no-wa-task');
    const names = noWa.map((i) => i.title);
    assert.ok(!names.some((n) => n.includes('System Timeout')), 'System events excluded');
  });
});

// ── 2. getActionItemSummary ─────────────────────────────────────────

describe('getActionItemSummary (AC-1-6)', () => {
  it('T-1-6: returns correct counts by priority', () => {
    const items = [
      mkItem({ priority: 'high' }), mkItem({ priority: 'high' }),
      mkItem({ priority: 'medium' }), mkItem({ priority: 'medium' }), mkItem({ priority: 'medium' }),
      mkItem({ priority: 'low' }),
    ];
    const summary = getActionItemSummary(items);
    assert.deepStrictEqual(summary, { total: 6, high: 2, medium: 3, low: 1 });
  });
});

// ── 3. filterActionItems ────────────────────────────────────────────

describe('filterActionItems (AC-2-1 to AC-2-4)', () => {
  const items = [
    mkItem({ id: '1', category: 'Model Completeness', priority: 'high', title: 'Unreachable state: Hearing Listed', detail: 'No incoming transitions', state: 'HEARING_LISTED' }),
    mkItem({ id: '2', category: 'Model Completeness', priority: 'medium', title: 'Low completeness: Draft (20%)', detail: 'Missing transitions', state: 'DRAFT' }),
    mkItem({ id: '3', category: 'WA Task Alignment', priority: 'high', title: 'WA gap: Review Failed Payment', detail: 'No event', state: null }),
    mkItem({ id: '4', category: 'WA Task Alignment', priority: 'medium', title: 'WA partial: Review Counterclaim', detail: 'Coarser granularity', state: null }),
    mkItem({ id: '5', category: 'WA Task Alignment', priority: 'low', title: 'No WA task for event: Adjourn', detail: 'Informational', state: 'LISTED' }),
  ];

  it('T-2-1: filters by category', () => {
    const mc = filterActionItems(items, { category: 'Model Completeness' });
    assert.equal(mc.length, 2);
    assert.ok(mc.every((i) => i.category === 'Model Completeness'));
    const all = filterActionItems(items, { category: null });
    assert.equal(all.length, 5);
  });

  it('T-2-2: filters by priority', () => {
    const high = filterActionItems(items, { priority: 'high' });
    assert.equal(high.length, 2);
    assert.ok(high.every((i) => i.priority === 'high'));
  });

  it('T-2-3: text search across title, detail, state (case-insensitive)', () => {
    const hearing = filterActionItems(items, { search: 'hearing' });
    assert.equal(hearing.length, 1);
    assert.equal(hearing[0].id, '1');
    const trans = filterActionItems(items, { search: 'transitions' });
    assert.equal(trans.length, 2);
  });

  it('T-2-4: composes multiple filters', () => {
    const result = filterActionItems(items, { category: 'Model Completeness', priority: 'high' });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, '1');
    const none = filterActionItems(items, { category: 'Model Completeness', priority: 'high', search: 'gap' });
    assert.equal(none.length, 0);
  });
});

// ── 4. sortActionItems ──────────────────────────────────────────────

describe('sortActionItems (AC-2-5)', () => {
  const items = [
    mkItem({ priority: 'low', category: 'WA Task Alignment', title: 'Zebra' }),
    mkItem({ priority: 'high', category: 'Model Completeness', title: 'Alpha' }),
    mkItem({ priority: 'high', category: 'WA Task Alignment', title: 'Beta' }),
    mkItem({ priority: 'medium', category: 'Model Completeness', title: 'Gamma' }),
  ];

  it('T-2-5a: default sort: priority desc, category, title asc', () => {
    const sorted = sortActionItems(items);
    assert.deepStrictEqual(sorted.map((i) => i.title), ['Alpha', 'Beta', 'Gamma', 'Zebra']);
  });

  it('T-2-5b: custom sort by title ascending', () => {
    const sorted = sortActionItems(items, 'title', 'asc');
    assert.deepStrictEqual(sorted.map((i) => i.title), ['Alpha', 'Beta', 'Gamma', 'Zebra']);
  });
});

// ── 5. exportActionItemsCsv ─────────────────────────────────────────

describe('exportActionItemsCsv (AC-3-1 to AC-3-4)', () => {
  const header = 'Priority,Category,Type,Title,Detail,Suggestion,State,Claim Type';

  it('T-3-1: correct headers, rows, and null handling', () => {
    const items = [
      mkItem({ priority: 'high', category: 'Model Completeness', type: 'unreachable', title: 'Unreachable', detail: 'No transitions', suggestion: 'Add one', state: 'HEARING', claimType: 'MAIN' }),
      mkItem({ priority: 'medium', category: 'WA Task Alignment', type: 'wa-partial', title: 'Partial', detail: 'Coarser', suggestion: 'Refine', state: null, claimType: null }),
    ];
    const result = exportActionItemsCsv(items);
    assert.equal(result.filename, 'action-items.csv');
    assert.equal(result.mimeType, 'text/csv');
    const lines = result.content.split('\n');
    assert.equal(lines[0], header);
    assert.ok(lines[1].includes('high'));
    assert.ok(lines[2].includes('medium'));
    assert.ok(!lines[2].includes('null'), 'null values exported as empty strings');
  });

  it('T-3-2: CSV escapes commas, quotes, and newlines', () => {
    const items = [mkItem({
      title: 'WA gap: Review Failed Payment, urgent',
      detail: 'No "Failed Payment" event exists',
      suggestion: 'Add event.\nReview in Event Matrix.',
    })];
    const result = exportActionItemsCsv(items);
    assert.ok(result.content.includes('"WA gap: Review Failed Payment, urgent"'), 'Comma field is quoted');
    assert.ok(result.content.includes('""Failed Payment""'), 'Quotes are doubled');
  });

  it('T-3-3: empty array produces header-only CSV', () => {
    const result = exportActionItemsCsv([]);
    const lines = result.content.trim().split('\n');
    assert.equal(lines.length, 1);
    assert.equal(lines[0], header);
  });

  it('T-3-4: exports only the items passed (caller filters)', () => {
    const items = Array.from({ length: 10 }, (_, i) => mkItem({ id: `i${i}`, priority: i < 3 ? 'high' : 'medium' }));
    const filtered = filterActionItems(items, { priority: 'high' });
    const result = exportActionItemsCsv(filtered);
    const dataLines = result.content.trim().split('\n').slice(1);
    assert.equal(dataLines.length, 3);
  });
});
