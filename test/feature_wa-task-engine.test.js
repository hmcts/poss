import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  getTasksForEvent,
  getTasksForState,
  getAlignmentSummary,
  getUnmappedTasks,
  getPartialTasks,
  getEventWaContext,
  filterTasksByContext,
} from '../src/wa-task-engine/index.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── 1. Event-Level Resolution (story-event-level-resolution.md) ─────

describe('Event-Level WA Task Resolution', () => {
  it('EV-1: getTasksForEvent("Case Issued") returns wa-task-01', () => {
    const result = getTasksForEvent('Case Issued', waMappings, waTasks);
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.equal(result.length, 1, 'Case Issued maps to exactly 1 task');
    assert.equal(result[0].id, 'wa-task-01');
    assert.equal(result[0].taskName, 'New Claim -- Listing required');
  });

  it('EV-2: getTasksForEvent("Make an application") returns 3 tasks (06, 07, 08)', () => {
    const result = getTasksForEvent('Make an application', waMappings, waTasks);
    assert.equal(result.length, 3, 'Make an application maps to 3 tasks');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-06', 'wa-task-07', 'wa-task-08']);
  });

  it('EV-3: unknown event returns empty array', () => {
    const result = getTasksForEvent('Non-Existent Event', waMappings, waTasks);
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.equal(result.length, 0);
  });

  it('EV-4: event name matching is case-sensitive ("case issued" returns [])', () => {
    const result = getTasksForEvent('case issued', waMappings, waTasks);
    assert.equal(result.length, 0, 'Lowercase "case issued" must not match "Case Issued"');
  });

  it('EV-5: getEventWaContext("Upload your documents") returns task, alignment, and notes', () => {
    const result = getEventWaContext('Upload your documents', waMappings, waTasks);
    assert.ok(result !== null, 'Mapped event must not return null');
    assert.ok(result.task, 'Result must have a task property');
    assert.ok(
      ['wa-task-09', 'wa-task-10', 'wa-task-11', 'wa-task-12'].includes(result.task.id),
      `Task id ${result.task.id} should be one of the Upload your documents mapped tasks`
    );
    assert.ok(
      ['aligned', 'partial', 'gap'].includes(result.alignment),
      'alignment must be a valid WaAlignmentStatusValue'
    );
    assert.equal(typeof result.notes, 'string', 'notes must be a string');
    assert.ok(result.notes.length > 0, 'notes must be non-empty for a mapped event');
  });

  it('EV-6: getEventWaContext returns null for unmapped event', () => {
    const result = getEventWaContext('Some Event With No WA Task', waMappings, waTasks);
    assert.equal(result, null);
  });
});

// ── 2. State-Level Resolution (story-state-level-resolution.md) ─────

describe('State-Level WA Task Resolution', () => {
  // Mock events: minimal objects with state and name fields matching real mapping data
  const mockEventsWithWaTasks = [
    { state: 'STATE_A', name: 'Case Issued' },
    { state: 'STATE_A', name: 'Allocate hearing centre' },
    { state: 'STATE_B', name: 'Some unrelated event' },
  ];

  it('ST-1: state with WA-triggering events returns non-empty result', () => {
    const result = getTasksForState('STATE_A', mockEventsWithWaTasks, waMappings, waTasks);
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.ok(result.length > 0, 'STATE_A has events with WA mappings');
  });

  it('ST-2: tasks are deduplicated by WaTask.id', () => {
    // Both events at STATE_DUP map to "Respond to Claim" which triggers wa-task-03 and wa-task-04
    const dupeEvents = [
      { state: 'STATE_DUP', name: 'Respond to Claim' },
      { state: 'STATE_DUP', name: 'Respond to Claim' },
    ];
    const result = getTasksForState('STATE_DUP', dupeEvents, waMappings, waTasks);
    const ids = result.map((t) => t.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, 'No duplicate task IDs in result');
  });

  it('ST-3: state with no WA-triggering events returns empty array', () => {
    const noWaEvents = [
      { state: 'STATE_EMPTY', name: 'Some unrelated event' },
      { state: 'STATE_EMPTY', name: 'Another unrelated event' },
    ];
    const result = getTasksForState('STATE_EMPTY', noWaEvents, waMappings, waTasks);
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.equal(result.length, 0);
  });

  it('ST-4: unknown state ID returns empty array (no exception)', () => {
    const result = getTasksForState('UNKNOWN_STATE', mockEventsWithWaTasks, waMappings, waTasks);
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.equal(result.length, 0);
  });

  it('ST-5: multiple different tasks at one state are all returned', () => {
    // STATE_MULTI has events mapping to different tasks
    const multiEvents = [
      { state: 'STATE_MULTI', name: 'Case Issued' },           // wa-task-01
      { state: 'STATE_MULTI', name: 'Make an application' },    // wa-task-06, 07, 08
    ];
    const result = getTasksForState('STATE_MULTI', multiEvents, waMappings, waTasks);
    const ids = result.map((t) => t.id).sort();
    assert.ok(ids.includes('wa-task-01'), 'Should include wa-task-01 from Case Issued');
    assert.ok(ids.includes('wa-task-06'), 'Should include wa-task-06 from Make an application');
    assert.ok(ids.includes('wa-task-07'), 'Should include wa-task-07 from Make an application');
    assert.ok(ids.includes('wa-task-08'), 'Should include wa-task-08 from Make an application');
    assert.equal(ids.length, 4, 'Should return 4 distinct tasks');
  });
});

// ── 3. Alignment Queries (story-alignment-queries.md) ───────────────

describe('Alignment Summary, Gap, and Partial Task Queries', () => {
  it('AL-1: getAlignmentSummary returns { aligned: 7, partial: 9, gap: 1 }', () => {
    const summary = getAlignmentSummary(waTasks, waMappings);
    assert.deepStrictEqual(summary, { aligned: 7, partial: 9, gap: 1 });
  });

  it('AL-2: aligned + partial + gap equals total task count (17)', () => {
    const summary = getAlignmentSummary(waTasks, waMappings);
    const total = summary.aligned + summary.partial + summary.gap;
    assert.equal(total, 17, `Sum of alignment tiers must equal 17, got ${total}`);
  });

  it('AL-3: getUnmappedTasks returns exactly wa-task-17 (Review Failed Payment)', () => {
    const gaps = getUnmappedTasks(waTasks, waMappings);
    assert.ok(Array.isArray(gaps), 'Must return an array');
    assert.equal(gaps.length, 1, 'Exactly 1 gap task');
    assert.equal(gaps[0].id, 'wa-task-17');
    assert.equal(gaps[0].taskName, 'Review Failed Payment');
    assert.equal(gaps[0].alignment, 'gap');
  });

  it('AL-4: getPartialTasks returns 9 items each with task and missing fields', () => {
    const partials = getPartialTasks(waTasks, waMappings);
    assert.ok(Array.isArray(partials), 'Must return an array');
    assert.equal(partials.length, 9, 'Expected 9 partial tasks');
    for (const entry of partials) {
      assert.ok(entry.task, 'Each entry must have a task property');
      assert.equal(entry.task.alignment, 'partial', `Task ${entry.task.id} must be partial`);
      assert.equal(typeof entry.missing, 'string', 'missing must be a string');
      assert.ok(entry.missing.length > 0, `missing must be non-empty for ${entry.task.id}`);
    }
  });

  it('AL-5: specific alignmentNotes for wa-task-04 and wa-task-16', () => {
    const partials = getPartialTasks(waTasks, waMappings);

    const task04 = partials.find((p) => p.task.id === 'wa-task-04');
    assert.ok(task04, 'wa-task-04 must be in partial results');
    assert.ok(
      task04.missing.includes('Response and counterclaim are modelled as separate events'),
      `wa-task-04 missing should contain expected text, got: "${task04.missing}"`
    );

    const task16 = partials.find((p) => p.task.id === 'wa-task-16');
    assert.ok(task16, 'wa-task-16 must be in partial results');
    assert.ok(
      task16.missing.includes('judicial order workflow'),
      `wa-task-16 missing should contain "judicial order workflow", got: "${task16.missing}"`
    );
    assert.ok(
      task16.missing.includes('to be determined'),
      `wa-task-16 missing should contain "to be determined", got: "${task16.missing}"`
    );
  });

  it('AL-6: empty tasks array produces zero counts and empty results', () => {
    const summary = getAlignmentSummary([], waMappings);
    assert.deepStrictEqual(summary, { aligned: 0, partial: 0, gap: 0 });

    const gaps = getUnmappedTasks([], waMappings);
    assert.deepStrictEqual(gaps, []);

    const partials = getPartialTasks([], waMappings);
    assert.deepStrictEqual(partials, []);
  });
});

// ── 4. Context Filtering (story-context-filtering.md) ───────────────

describe('Filter WA Tasks by Context Type', () => {
  it('CF-1: filterTasksByContext("gen-app") returns 4 tasks', () => {
    const result = filterTasksByContext(waTasks, 'gen-app');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-06', 'wa-task-07', 'wa-task-08', 'wa-task-11']);
  });

  it('CF-2: filterTasksByContext("general") returns 6 tasks', () => {
    const result = filterTasksByContext(waTasks, 'general');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-03', 'wa-task-13', 'wa-task-14', 'wa-task-15', 'wa-task-16', 'wa-task-17']);
  });

  it('CF-3: filterTasksByContext("claim") returns 3 tasks', () => {
    const result = filterTasksByContext(waTasks, 'claim');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-01', 'wa-task-02', 'wa-task-10']);
  });

  it('CF-4: filterTasksByContext("counterclaim") returns 2 tasks', () => {
    const result = filterTasksByContext(waTasks, 'counterclaim');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-05', 'wa-task-12']);
  });

  it('CF-5: filterTasksByContext("claim-counterclaim") returns 2 tasks', () => {
    const result = filterTasksByContext(waTasks, 'claim-counterclaim');
    const ids = result.map((t) => t.id).sort();
    assert.deepStrictEqual(ids, ['wa-task-04', 'wa-task-09']);
  });

  it('CF-6: empty tasks array returns empty result', () => {
    const result = filterTasksByContext([], 'general');
    assert.ok(Array.isArray(result), 'Must return an array');
    assert.equal(result.length, 0);
  });
});
