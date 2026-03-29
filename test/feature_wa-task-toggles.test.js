import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  computeEffectiveEnabledEvents,
  isEventBlockedByTasks,
  getDisabledTaskCount,
  getTaskToggleState,
  getEventBlockedReason,
  getEffectiveDisabledCount,
} from '../src/ui-wa-tasks/digital-twin-helpers.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── Mock data (MAIN_CLAIM_ENGLAND sample) ────────────────────────────
// Real WA-mapped event names from wa-mappings.json
const EVENTS = [
  { id: 'evt-case-issued', name: 'Case Issued' },             // wa-task-01 (single)
  { id: 'evt-respond', name: 'Respond to Claim' },            // wa-task-03, wa-task-04 (two)
  { id: 'evt-make-app', name: 'Make an application' },        // wa-task-06, wa-task-07, wa-task-08 (three)
  { id: 'evt-upload', name: 'Upload your documents' },        // wa-task-09..12 (four)
  { id: 'evt-transfer', name: 'Transfer Case' },              // no WA mapping
  { id: 'evt-allocate', name: 'Allocate hearing centre' },    // wa-task-02 (single)
  { id: 'evt-flags', name: 'Create case flags' },             // wa-task-13, wa-task-14 (two)
];

const ALL_IDS = new Set(EVENTS.map((e) => e.id));

// ══════════════════════════════════════════════════════════════════════
// Story 1 — WA Task Checkboxes and Event Blocking Logic
// ══════════════════════════════════════════════════════════════════════

describe('computeEffectiveEnabledEvents — core blocking derivation', () => {
  it('T-1-1: empty disabledTasks returns enabledEvents unchanged', () => {
    const result = computeEffectiveEnabledEvents(ALL_IDS, new Set(), EVENTS, waTasks, waMappings, true);
    assert.deepStrictEqual(result, ALL_IDS);
  });

  it('T-1-2: all tasks unchecked blocks the event', () => {
    // Respond to Claim maps to wa-task-03 and wa-task-04
    const disabled = new Set(['wa-task-03', 'wa-task-04']);
    const result = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(result.has('evt-respond'), false, 'Respond to Claim should be blocked');
  });

  it('T-1-3: at least one task checked keeps event enabled', () => {
    // Only wa-task-03 disabled; wa-task-04 still active
    const disabled = new Set(['wa-task-03']);
    const result = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(result.has('evt-respond'), true, 'Respond to Claim should remain enabled');
  });

  it('T-1-4: events without WA tasks are unaffected', () => {
    const disabled = new Set(['wa-task-01', 'wa-task-02', 'wa-task-03', 'wa-task-04']);
    const result = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(result.has('evt-transfer'), true, 'Transfer Case has no WA mapping and must pass through');
  });

  it('T-1-5: showWaTasks=false disengages task blocking', () => {
    const disabled = new Set(['wa-task-03', 'wa-task-04']);
    const result = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, false);
    assert.deepStrictEqual(result, ALL_IDS, 'Task blocking has no effect when WA toggle is off');
  });
});

describe('getDisabledTaskCount — disabled task counter', () => {
  it('T-1-6: returns correct count', () => {
    const disabled = new Set(['wa-task-01', 'wa-task-02', 'wa-task-03']);
    assert.equal(getDisabledTaskCount(disabled), 3);
  });

  it('T-1-6b: empty set returns 0', () => {
    assert.equal(getDisabledTaskCount(new Set()), 0);
  });

  it('T-1-7: reset (empty set) clears all task toggles', () => {
    const disabled = new Set(['wa-task-01', 'wa-task-05', 'wa-task-09']);
    const reset = new Set();
    assert.equal(getDisabledTaskCount(reset), 0);
    const result = computeEffectiveEnabledEvents(ALL_IDS, reset, EVENTS, waTasks, waMappings, true);
    assert.deepStrictEqual(result, ALL_IDS);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Story 2 — Parent Event Override, Visual Feedback, Summary Indicator
// ══════════════════════════════════════════════════════════════════════

describe('getTaskToggleState — checkbox interactivity', () => {
  it('T-2-1: parent event disabled makes task checkbox non-interactive', () => {
    const enabledEvents = new Set(['evt-transfer']); // evt-respond NOT enabled
    const state = getTaskToggleState('wa-task-03', new Set(), enabledEvents);
    assert.equal(state.interactive, false);
  });

  it('T-2-2: parent event enabled makes task checkbox interactive', () => {
    const state = getTaskToggleState('wa-task-03', new Set(), ALL_IDS);
    assert.equal(state.interactive, true);
  });

  it('T-2-4: task toggle state preserved through parent disable/re-enable', () => {
    const disabled = new Set(['wa-task-03']);
    // Parent disabled -- task still in disabledTasks
    const stateOff = getTaskToggleState('wa-task-03', disabled, new Set());
    assert.equal(stateOff.checked, false, 'Task remains unchecked while parent disabled');
    // Parent re-enabled -- task still unchecked
    const stateOn = getTaskToggleState('wa-task-03', disabled, ALL_IDS);
    assert.equal(stateOn.checked, false, 'Task remains unchecked after parent re-enabled');
  });
});

describe('getEventBlockedReason — distinguishes event-level from task-level', () => {
  it('T-2-3a: returns event-disabled when event not in enabledEvents', () => {
    const enabled = new Set(); // nothing enabled
    const reason = getEventBlockedReason('evt-respond', 'Respond to Claim', enabled, new Set(), waTasks, waMappings);
    assert.equal(reason, 'event-disabled');
  });

  it('T-2-3b: returns all-tasks-disabled when event enabled but all tasks unchecked', () => {
    const disabled = new Set(['wa-task-03', 'wa-task-04']);
    const reason = getEventBlockedReason('evt-respond', 'Respond to Claim', ALL_IDS, disabled, waTasks, waMappings);
    assert.equal(reason, 'all-tasks-disabled');
  });

  it('T-2-3c: returns null when event enabled and at least one task active', () => {
    const disabled = new Set(['wa-task-03']); // wa-task-04 still active
    const reason = getEventBlockedReason('evt-respond', 'Respond to Claim', ALL_IDS, disabled, waTasks, waMappings);
    assert.equal(reason, null);
  });
});

describe('getEffectiveDisabledCount — combined count', () => {
  it('T-2-5: includes both event-level and task-blocked events', () => {
    // Disable evt-transfer and evt-flags at event level (2 events)
    const enabled = new Set([...ALL_IDS].filter((id) => id !== 'evt-transfer' && id !== 'evt-flags'));
    // Disable all tasks for Case Issued (wa-task-01) -> blocks evt-case-issued (1 more)
    const disabled = new Set(['wa-task-01']);
    const count = getEffectiveDisabledCount(enabled, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(count, 3, '2 event-level + 1 task-blocked = 3');
  });

  it('T-2-6: ignores task blocking when WA toggle is off', () => {
    const enabled = new Set([...ALL_IDS].filter((id) => id !== 'evt-transfer' && id !== 'evt-flags'));
    const disabled = new Set(['wa-task-01']);
    const count = getEffectiveDisabledCount(enabled, disabled, EVENTS, waTasks, waMappings, false);
    assert.equal(count, 2, 'Only event-level disabled count when WA off');
  });
});

// ══════════════════════════════════════════════════════════════════════
// Story 3 — Auto-Walk Recalculation, Reset, and Toggle Interaction
// ══════════════════════════════════════════════════════════════════════

describe('isEventBlockedByTasks — single-event blocking check', () => {
  it('T-3-1: single-task event blocks immediately when its task is unchecked', () => {
    // Case Issued has only wa-task-01
    const blocked = isEventBlockedByTasks('Case Issued', new Set(['wa-task-01']), waTasks, waMappings);
    assert.equal(blocked, true);
  });

  it('T-3-1b: single-task event not blocked when its task is checked', () => {
    const blocked = isEventBlockedByTasks('Case Issued', new Set(), waTasks, waMappings);
    assert.equal(blocked, false);
  });
});

describe('computeEffectiveEnabledEvents — toggle interaction scenarios', () => {
  it('T-3-2: WA toggle off/on preserves disabledTasks', () => {
    const disabled = new Set(['wa-task-01']);
    // WA off -- no blocking
    const off = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, false);
    assert.equal(off.has('evt-case-issued'), true, 'Not blocked when WA off');
    // WA back on -- same disabledTasks set, blocking resumes
    const on = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(on.has('evt-case-issued'), false, 'Blocked again when WA on');
  });

  it('T-3-3: re-checking a task restores the event', () => {
    // Both tasks disabled -> blocked
    const allOff = new Set(['wa-task-03', 'wa-task-04']);
    const blocked = computeEffectiveEnabledEvents(ALL_IDS, allOff, EVENTS, waTasks, waMappings, true);
    assert.equal(blocked.has('evt-respond'), false);
    // Re-check wa-task-04
    const oneOn = new Set(['wa-task-03']);
    const restored = computeEffectiveEnabledEvents(ALL_IDS, oneOn, EVENTS, waTasks, waMappings, true);
    assert.equal(restored.has('evt-respond'), true, 'Event restored when one task re-checked');
  });

  it('T-3-4: reset clears all and restores full set', () => {
    const disabled = new Set(['wa-task-01', 'wa-task-03', 'wa-task-04', 'wa-task-06', 'wa-task-07', 'wa-task-08']);
    const reset = new Set();
    const result = computeEffectiveEnabledEvents(ALL_IDS, reset, EVENTS, waTasks, waMappings, true);
    assert.deepStrictEqual(result, ALL_IDS, 'Full event set restored after reset');
  });

  it('T-3-5: task and event toggles are independent', () => {
    // Uncheck the only task for Case Issued
    const disabled = new Set(['wa-task-01']);
    // Disable event at event level too
    const withoutCaseIssued = new Set([...ALL_IDS].filter((id) => id !== 'evt-case-issued'));
    const r1 = computeEffectiveEnabledEvents(withoutCaseIssued, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(r1.has('evt-case-issued'), false, 'Blocked at event level');
    // Re-enable event at event level -- task still disabled so still blocked
    const r2 = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(r2.has('evt-case-issued'), false, 'Still blocked by task toggle');
  });

  it('T-3-6: mixed events -- unmapped pass through regardless', () => {
    // Disable every WA task
    const allTaskIds = waTasks.map((t) => t.id);
    const disabled = new Set(allTaskIds);
    const result = computeEffectiveEnabledEvents(ALL_IDS, disabled, EVENTS, waTasks, waMappings, true);
    assert.equal(result.has('evt-transfer'), true, 'Transfer Case has no WA mapping, passes through');
    // Mapped events should be blocked
    assert.equal(result.has('evt-case-issued'), false, 'Case Issued is mapped and should be blocked');
    assert.equal(result.has('evt-respond'), false, 'Respond to Claim is mapped and should be blocked');
  });
});
