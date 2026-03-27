import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  getWaTaskBadge,
  getWaTaskTooltip,
  enrichEventWithWaTask,
  enrichAvailableActions,
  prepareWaTaskPanel,
  getStateWaTaskCount,
} from '../src/ui-wa-tasks/index.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── Helpers ──────────────────────────────────────────────────────────

function findTask(id) {
  return waTasks.find((t) => t.id === id);
}

function findMapping(taskId) {
  return waMappings.find((m) => m.waTaskId === taskId);
}

function mockEvent(name, state = 'TEST_STATE') {
  return { id: `evt-${name}`, name, state, actors: { caseworker: true } };
}

// ── 1. Badge and Tooltip Display Metadata ────────────────────────────

describe('WA Task Badge and Tooltip Display Metadata', () => {
  it('BT-1: aligned status returns green badge', () => {
    const badge = getWaTaskBadge('aligned');
    assert.deepStrictEqual(badge, {
      label: 'Aligned',
      colour: '#22C55E',
      icon: 'check',
    });
  });

  it('BT-2: partial status returns amber badge', () => {
    const badge = getWaTaskBadge('partial');
    assert.deepStrictEqual(badge, {
      label: 'Partial',
      colour: '#F59E0B',
      icon: 'warning',
    });
  });

  it('BT-3: gap status returns red badge', () => {
    const badge = getWaTaskBadge('gap');
    assert.deepStrictEqual(badge, {
      label: 'Gap',
      colour: '#EF4444',
      icon: 'cross',
    });
  });

  it('BT-4: unknown alignment falls back to neutral grey badge', () => {
    const badge = getWaTaskBadge('unknown');
    assert.deepStrictEqual(badge, {
      label: 'Unknown',
      colour: '#6B7280',
      icon: 'unknown',
    });

    // Also test a completely arbitrary string
    const badge2 = getWaTaskBadge('nonsense-value');
    assert.equal(badge2.colour, '#6B7280', 'Arbitrary string also falls back to grey');
  });

  it('BT-5: tooltip for aligned task includes notes suffix', () => {
    const task = findTask('wa-task-01');
    const mapping = findMapping('wa-task-01');
    const tooltip = getWaTaskTooltip(task, mapping);
    assert.equal(
      tooltip,
      'New Claim -- Listing required -- Triggered by: New claim received -- system auto-assigns hearing centre | Note: Case Issued is a system event that triggers post-payment; hearing centre allocation exists in CASE_ISSUED state'
    );
  });

  it('BT-6: tooltip with empty alignmentNotes omits the notes suffix', () => {
    const task = findTask('wa-task-01');
    const emptyMapping = { waTaskId: 'wa-task-01', eventIds: ['Case Issued'], alignmentNotes: '' };
    const tooltip = getWaTaskTooltip(task, emptyMapping);
    assert.equal(
      tooltip,
      'New Claim -- Listing required -- Triggered by: New claim received -- system auto-assigns hearing centre'
    );
    assert.ok(!tooltip.includes('| Note:'), 'No notes suffix when alignmentNotes is empty');
  });

  it('BT-7: tooltip structure is deterministic for any task/mapping pair', () => {
    // Test with a partial task (wa-task-04)
    const task = findTask('wa-task-04');
    const mapping = findMapping('wa-task-04');
    const tooltip = getWaTaskTooltip(task, mapping);

    assert.ok(tooltip.startsWith(task.taskName), 'Starts with taskName');
    assert.ok(tooltip.includes(' -- Triggered by: '), 'Contains trigger separator');
    assert.ok(tooltip.includes(task.triggerDescription), 'Contains triggerDescription');
    assert.ok(tooltip.includes('| Note: '), 'Partial task has non-empty notes');
    assert.ok(tooltip.includes(mapping.alignmentNotes), 'Contains alignmentNotes');
  });
});

// ── 2. WA Event Enrichment ───────────────────────────────────────────

describe('WA Event Enrichment', () => {
  it('EE-1: mapped event is enriched with waTask metadata', () => {
    const event = mockEvent('Case Issued');
    const result = enrichEventWithWaTask(event, waMappings, waTasks);

    assert.ok(result.waTask, 'waTask must be defined for mapped event');
    assert.equal(result.waTask.taskName, 'New Claim -- Listing required');
    assert.equal(result.waTask.alignment, 'aligned');
    assert.ok(typeof result.waTask.notes === 'string' && result.waTask.notes.length > 0,
      'notes must be a non-empty string');
  });

  it('EE-2: unmapped event has waTask undefined', () => {
    const event = mockEvent('Transfer Case');
    const result = enrichEventWithWaTask(event, waMappings, waTasks);

    assert.equal(result.waTask, undefined, 'waTask must be undefined for unmapped event');
  });

  it('EE-3: original event fields are preserved (additive enrichment)', () => {
    const event = mockEvent('Case Issued');
    event.extraField = 'should survive';
    const result = enrichEventWithWaTask(event, waMappings, waTasks);

    assert.equal(result.id, event.id, 'id preserved');
    assert.equal(result.name, event.name, 'name preserved');
    assert.equal(result.state, event.state, 'state preserved');
    assert.deepStrictEqual(result.actors, event.actors, 'actors preserved');
    assert.equal(result.extraField, 'should survive', 'extra fields preserved');
  });

  it('EE-4: batch enrichment returns correct count with correct waTask values', () => {
    const actions = [
      mockEvent('Case Issued'),
      mockEvent('Allocate hearing centre'),
      mockEvent('Transfer Case'),
      mockEvent('Make an application'),
      mockEvent('Upload your documents'),
    ];
    const results = enrichAvailableActions(actions, waMappings, waTasks);

    assert.equal(results.length, 5, 'Returns one result per input');
    assert.ok(results[0].waTask, 'Case Issued should have waTask');
    assert.ok(results[1].waTask, 'Allocate hearing centre should have waTask');
    assert.equal(results[2].waTask, undefined, 'Transfer Case has no waTask');
    assert.ok(results[3].waTask, 'Make an application should have waTask');
    assert.ok(results[4].waTask, 'Upload your documents should have waTask');
  });

  it('EE-5: batch enrichment with empty input returns empty array', () => {
    const results = enrichAvailableActions([], waMappings, waTasks);
    assert.ok(Array.isArray(results), 'Must return an array');
    assert.equal(results.length, 0);
  });

  it('EE-6: WaEnrichedEvent has waTask property, not indicator', () => {
    const event = mockEvent('Case Issued');
    const result = enrichEventWithWaTask(event, waMappings, waTasks);

    assert.ok('waTask' in result, 'Result has waTask property');
    assert.ok(!('indicator' in result), 'Result does not have indicator property (that belongs to ui-case-walk EnrichedEvent)');
  });
});

// ── 3. Panel Preparation and State-Level Counts ──────────────────────

describe('WA Task Panel Preparation and State-Level Counts', () => {
  // Build mock events at a state that has mixed alignment tasks
  const mixedStateEvents = [
    { state: 'STATE_MIXED', name: 'Case Issued' },           // wa-task-01 aligned
    { state: 'STATE_MIXED', name: 'Respond to Claim' },      // wa-task-03 aligned, wa-task-04 partial
    { state: 'STATE_MIXED', name: 'Some unmapped event' },
    { state: 'OTHER_STATE', name: 'Make an application' },   // different state, should not appear
  ];

  // Events that include a gap task
  const gapStateEvents = [
    { state: 'STATE_GAP', name: 'Case Issued' },             // wa-task-01 aligned
    { state: 'STATE_GAP', name: 'Respond to Claim' },        // wa-task-03 aligned, wa-task-04 partial
    { state: 'STATE_GAP', name: 'Upload your documents' },   // wa-task-09 partial (no gap from events alone)
  ];

  const emptyStateEvents = [
    { state: 'STATE_EMPTY', name: 'Some unmapped event' },
    { state: 'STATE_EMPTY', name: 'Another unmapped event' },
  ];

  it('PC-1: panel for mixed-alignment state returns enriched task list', () => {
    const panel = prepareWaTaskPanel('STATE_MIXED', mixedStateEvents, waMappings, waTasks);

    assert.ok(panel.tasks, 'Panel must have a tasks array');
    assert.ok(panel.tasks.length > 0, 'Panel should have tasks for mapped events');

    for (const item of panel.tasks) {
      assert.ok(item.task, 'Each panel item must have a task');
      assert.ok(item.badge, 'Each panel item must have a badge');
      assert.ok(typeof item.badge.label === 'string', 'Badge has label');
      assert.ok(typeof item.badge.colour === 'string', 'Badge has colour');
      assert.ok(typeof item.badge.icon === 'string', 'Badge has icon');
      assert.ok(typeof item.tooltip === 'string', 'Each panel item must have a tooltip string');
    }
  });

  it('PC-2: panel includes alignment summary and hasGaps flag', () => {
    const panel = prepareWaTaskPanel('STATE_MIXED', mixedStateEvents, waMappings, waTasks);

    assert.ok(typeof panel.summary === 'object' || typeof panel.aligned !== 'undefined',
      'Panel must include alignment summary');

    // Check the summary has the count fields
    const summary = panel.summary || panel;
    assert.ok(typeof summary.aligned === 'number', 'Has aligned count');
    assert.ok(typeof summary.partial === 'number', 'Has partial count');
    assert.ok(typeof summary.gap === 'number', 'Has gap count');
    assert.ok(typeof panel.hasGaps === 'boolean', 'Has hasGaps flag');
  });

  it('PC-3: panel for state with no WA-triggering events returns empty panel', () => {
    const panel = prepareWaTaskPanel('STATE_EMPTY', emptyStateEvents, waMappings, waTasks);

    assert.ok(Array.isArray(panel.tasks), 'tasks must be an array');
    assert.equal(panel.tasks.length, 0, 'No tasks for unmapped events');
    assert.equal(panel.hasGaps, false, 'hasGaps is false when no tasks');

    const summary = panel.summary || panel;
    assert.equal(summary.aligned, 0);
    assert.equal(summary.partial, 0);
    assert.equal(summary.gap, 0);
  });

  it('PC-4: state count returns correct totals by alignment', () => {
    const counts = getStateWaTaskCount('STATE_MIXED', mixedStateEvents, waMappings, waTasks);

    assert.ok(typeof counts.total === 'number', 'Has total');
    assert.ok(typeof counts.aligned === 'number', 'Has aligned');
    assert.ok(typeof counts.partial === 'number', 'Has partial');
    assert.ok(typeof counts.gap === 'number', 'Has gap');
    assert.equal(counts.total, counts.aligned + counts.partial + counts.gap,
      'Total equals sum of tiers');
    assert.ok(counts.total > 0, 'STATE_MIXED should have tasks');
  });

  it('PC-5: state count for state with no tasks returns all zeros', () => {
    const counts = getStateWaTaskCount('STATE_EMPTY', emptyStateEvents, waMappings, waTasks);
    assert.deepStrictEqual(counts, { total: 0, aligned: 0, partial: 0, gap: 0 });
  });

  it('PC-6: tasks are deduplicated per state', () => {
    const dupeEvents = [
      { state: 'STATE_DUPE', name: 'Respond to Claim' },
      { state: 'STATE_DUPE', name: 'Respond to Claim' },
    ];
    const panel = prepareWaTaskPanel('STATE_DUPE', dupeEvents, waMappings, waTasks);
    const taskIds = panel.tasks.map((item) => item.task.id);
    const uniqueIds = new Set(taskIds);
    assert.equal(taskIds.length, uniqueIds.size, 'No duplicate tasks in panel');

    const counts = getStateWaTaskCount('STATE_DUPE', dupeEvents, waMappings, waTasks);
    assert.equal(counts.total, uniqueIds.size, 'Count matches deduplicated set');
  });
});
