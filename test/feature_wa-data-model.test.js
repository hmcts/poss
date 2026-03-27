import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  WaTaskContext,
  WaAlignmentStatus,
  WaTaskSchema,
  WaTaskMappingSchema,
  createPossessionsStore,
} from '../src/data-model/index.js';

// ── 1. WA Enums (story-wa-enums.md) ─────────────────────────────────

describe('WA Enums — WaTaskContext', () => {
  it('WE-1: WaTaskContext has exactly 5 context values', () => {
    const values = Object.values(WaTaskContext);
    assert.equal(values.length, 5, `Expected 5 task contexts, got ${values.length}`);
    const expected = ['claim', 'counterclaim', 'gen-app', 'claim-counterclaim', 'general'];
    for (const v of expected) {
      assert.ok(values.includes(v), `Missing task context value: ${v}`);
    }
  });

  it('WE-2: WaAlignmentStatus has exactly 3 alignment tiers', () => {
    const values = Object.values(WaAlignmentStatus);
    assert.equal(values.length, 3, `Expected 3 alignment statuses, got ${values.length}`);
    const expected = ['aligned', 'partial', 'gap'];
    for (const v of expected) {
      assert.ok(values.includes(v), `Missing alignment status: ${v}`);
    }
  });

  it('WE-3: enum objects are frozen (no accidental mutation)', () => {
    assert.ok(Object.isFrozen(WaTaskContext) || !Object.isExtensible(WaTaskContext),
      'WaTaskContext should be frozen or non-extensible (as const)');
    assert.ok(Object.isFrozen(WaAlignmentStatus) || !Object.isExtensible(WaAlignmentStatus),
      'WaAlignmentStatus should be frozen or non-extensible (as const)');
  });

  it('WE-4: all enum values are strings', () => {
    for (const v of Object.values(WaTaskContext)) {
      assert.equal(typeof v, 'string', `WaTaskContext value ${v} must be a string`);
    }
    for (const v of Object.values(WaAlignmentStatus)) {
      assert.equal(typeof v, 'string', `WaAlignmentStatus value ${v} must be a string`);
    }
  });

  it('WE-5: enums are importable from the bridge module', () => {
    assert.ok(WaTaskContext !== undefined, 'WaTaskContext must be exported');
    assert.ok(WaAlignmentStatus !== undefined, 'WaAlignmentStatus must be exported');
    assert.equal(typeof WaTaskContext, 'object', 'WaTaskContext must be an object');
    assert.equal(typeof WaAlignmentStatus, 'object', 'WaAlignmentStatus must be an object');
  });
});

// ── 2. WA Schemas (story-wa-schemas.md) ──────────────────────────────

describe('WA Schemas — WaTaskSchema', () => {
  const validTask = {
    id: 'wa-task-001',
    triggerDescription: 'Claim issued triggers review',
    taskName: 'Review claim application',
    taskContext: 'claim',
    alignment: 'aligned',
  };

  it('WS-1: accepts a valid task object with all required fields', () => {
    const result = WaTaskSchema.safeParse(validTask);
    assert.ok(result.success, `Valid task rejected: ${JSON.stringify(result.error?.issues)}`);
    assert.equal(result.data.id, validTask.id);
    assert.equal(result.data.taskName, validTask.taskName);
    assert.equal(result.data.taskContext, validTask.taskContext);
    assert.equal(result.data.alignment, validTask.alignment);
  });

  it('WS-2: rejects task with missing required fields', () => {
    for (const field of ['id', 'triggerDescription', 'taskName', 'taskContext', 'alignment']) {
      const incomplete = { ...validTask };
      delete incomplete[field];
      const result = WaTaskSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });

  it('WS-3: rejects invalid enum values for taskContext and alignment', () => {
    const badContext = WaTaskSchema.safeParse({ ...validTask, taskContext: 'unknown' });
    assert.equal(badContext.success, false, 'Invalid taskContext "unknown" should be rejected');

    const badAlignment = WaTaskSchema.safeParse({ ...validTask, alignment: 'full' });
    assert.equal(badAlignment.success, false, 'Invalid alignment "full" should be rejected');

    const numericContext = WaTaskSchema.safeParse({ ...validTask, taskContext: 42 });
    assert.equal(numericContext.success, false, 'Numeric taskContext should be rejected');
  });
});

describe('WA Schemas — WaTaskMappingSchema', () => {
  const validMapping = {
    waTaskId: 'wa-task-001',
    eventIds: ['evt-001', 'evt-002'],
    alignmentNotes: 'Fully mapped to existing events',
  };

  it('WS-4: accepts a valid mapping with event IDs', () => {
    const result = WaTaskMappingSchema.safeParse(validMapping);
    assert.ok(result.success, `Valid mapping rejected: ${JSON.stringify(result.error?.issues)}`);
    assert.deepStrictEqual(result.data.eventIds, validMapping.eventIds);
    assert.equal(result.data.waTaskId, validMapping.waTaskId);
  });

  it('WS-5: accepts a mapping with an empty eventIds array (gap task)', () => {
    const gapMapping = { ...validMapping, eventIds: [], alignmentNotes: 'No matching events -- gap task' };
    const result = WaTaskMappingSchema.safeParse(gapMapping);
    assert.ok(result.success, `Gap mapping with empty eventIds should be accepted`);
    assert.deepStrictEqual(result.data.eventIds, []);
  });

  it('WS-6: accepts an empty alignmentNotes string (fully aligned)', () => {
    const alignedMapping = { ...validMapping, alignmentNotes: '' };
    const result = WaTaskMappingSchema.safeParse(alignedMapping);
    assert.ok(result.success, `Empty alignmentNotes should be accepted for aligned tasks`);
    assert.equal(result.data.alignmentNotes, '');
  });

  it('WS-7: schemas survive JSON round-trip without data loss', () => {
    const task = WaTaskSchema.parse({
      id: 'wa-rt-001',
      triggerDescription: 'RT test',
      taskName: 'Round-trip task',
      taskContext: 'general',
      alignment: 'gap',
    });
    const taskRoundTripped = JSON.parse(JSON.stringify(task));
    assert.deepStrictEqual(taskRoundTripped, task);

    const mapping = WaTaskMappingSchema.parse(validMapping);
    const mappingRoundTripped = JSON.parse(JSON.stringify(mapping));
    assert.deepStrictEqual(mappingRoundTripped, mapping);
  });

  it('WS-8: rejects mapping with missing required fields', () => {
    for (const field of ['waTaskId', 'eventIds', 'alignmentNotes']) {
      const incomplete = { ...validMapping };
      delete incomplete[field];
      const result = WaTaskMappingSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });

  it('WS-9: rejects eventIds containing non-string elements', () => {
    const badIds = { ...validMapping, eventIds: [123, true] };
    const result = WaTaskMappingSchema.safeParse(badIds);
    assert.equal(result.success, false, 'Non-string elements in eventIds should be rejected');
  });
});

// ── 3. WA Store Slice (story-wa-store.md) ────────────────────────────

describe('WA Store Slice', () => {
  const taskA = {
    id: 'wa-task-a',
    triggerDescription: 'Task A trigger',
    taskName: 'Task A',
    taskContext: 'claim',
    alignment: 'aligned',
  };
  const taskB = {
    id: 'wa-task-b',
    triggerDescription: 'Task B trigger',
    taskName: 'Task B',
    taskContext: 'counterclaim',
    alignment: 'partial',
  };

  const mappingA = { waTaskId: 'wa-task-a', eventIds: ['evt-001'], alignmentNotes: '' };
  const mappingB = { waTaskId: 'wa-task-b', eventIds: [], alignmentNotes: 'Gap task' };

  it('WST-1: store initialises with empty waTasks and waMappings arrays', () => {
    const store = createPossessionsStore();
    const state = store.getState();
    assert.ok(Array.isArray(state.waTasks), 'waTasks should be an array');
    assert.equal(state.waTasks.length, 0, 'waTasks should start empty');
    assert.ok(Array.isArray(state.waMappings), 'waMappings should be an array');
    assert.equal(state.waMappings.length, 0, 'waMappings should start empty');
  });

  it('WST-2: setWaTasks sets the tasks array', () => {
    const store = createPossessionsStore();
    store.getState().setWaTasks([taskA]);
    const state = store.getState();
    assert.equal(state.waTasks.length, 1);
    assert.deepStrictEqual(state.waTasks[0], taskA);
  });

  it('WST-3: setWaTasks overwrites previous tasks (replace, not merge)', () => {
    const store = createPossessionsStore();
    store.getState().setWaTasks([taskA]);
    store.getState().setWaTasks([taskB]);
    const state = store.getState();
    assert.equal(state.waTasks.length, 1, 'Should have 1 task after replace, not 2');
    assert.deepStrictEqual(state.waTasks[0], taskB);
  });

  it('WST-4: setWaMappings sets the mappings array', () => {
    const store = createPossessionsStore();
    store.getState().setWaMappings([mappingA]);
    const state = store.getState();
    assert.equal(state.waMappings.length, 1);
    assert.deepStrictEqual(state.waMappings[0], mappingA);
  });

  it('WST-5: setWaMappings overwrites previous mappings (replace, not merge)', () => {
    const store = createPossessionsStore();
    store.getState().setWaMappings([mappingA]);
    store.getState().setWaMappings([mappingB]);
    const state = store.getState();
    assert.equal(state.waMappings.length, 1, 'Should have 1 mapping after replace, not 2');
    assert.deepStrictEqual(state.waMappings[0], mappingB);
  });

  it('WST-6: core store state is unaffected by WA setters', () => {
    const store = createPossessionsStore();
    const coreBefore = {
      claimTypes: store.getState().claimTypes,
      states: store.getState().states,
      transitions: store.getState().transitions,
      events: store.getState().events,
      activeClaimType: store.getState().activeClaimType,
    };

    store.getState().setWaTasks([taskA, taskB]);
    store.getState().setWaMappings([mappingA, mappingB]);

    const coreAfter = {
      claimTypes: store.getState().claimTypes,
      states: store.getState().states,
      transitions: store.getState().transitions,
      events: store.getState().events,
      activeClaimType: store.getState().activeClaimType,
    };

    assert.deepStrictEqual(coreAfter, coreBefore, 'Core state must remain unchanged after WA setters');
  });
});
