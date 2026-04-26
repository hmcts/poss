import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { WaTaskSchema, WaTaskMappingSchema } from '../src/data-model/schemas.js';
import { WaTaskContext, WaAlignmentStatus } from '../src/data-model/enums.js';
import { validateWaData } from '../src/wa-ingestion/index.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// Helper: extract task number from id string "wa-task-NN" -> NN
function taskNum(id) {
  return parseInt(id.replace('wa-task-', ''), 10);
}

// ── 1. WA Task Data (story-wa-task-data.md) ──────────────────────────

describe('WA Task Data -- data/wa-tasks.json', () => {
  it('TD-1: contains exactly 17 tasks with unique sequential IDs', () => {
    assert.equal(waTasks.length, 17, `Expected 17 tasks, got ${waTasks.length}`);
    const ids = waTasks.map((t) => t.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, 17, 'All 17 task IDs must be unique');
    for (let i = 1; i <= 17; i++) {
      const expected = `wa-task-${String(i).padStart(2, '0')}`;
      assert.ok(ids.includes(expected), `Missing task ID: ${expected}`);
    }
  });

  it('TD-2: every task validates against WaTaskSchema', () => {
    for (const task of waTasks) {
      const result = WaTaskSchema.safeParse(task);
      assert.ok(result.success, `Task ${task.id} failed schema validation: ${JSON.stringify(result.error?.issues)}`);
    }
  });

  it('TD-3: alignment tier counts are 7 aligned, 9 partial, 1 gap', () => {
    const aligned = waTasks.filter((t) => t.alignment === WaAlignmentStatus.ALIGNED);
    const partial = waTasks.filter((t) => t.alignment === WaAlignmentStatus.PARTIAL);
    const gap = waTasks.filter((t) => t.alignment === WaAlignmentStatus.GAP);

    assert.equal(aligned.length, 7, `Expected 7 aligned, got ${aligned.length}`);
    assert.equal(partial.length, 9, `Expected 9 partial, got ${partial.length}`);
    assert.equal(gap.length, 1, `Expected 1 gap, got ${gap.length}`);

    const alignedNums = aligned.map((t) => taskNum(t.id)).sort((a, b) => a - b);
    assert.deepStrictEqual(alignedNums, [1, 2, 3, 8, 13, 14, 15]);

    const partialNums = partial.map((t) => taskNum(t.id)).sort((a, b) => a - b);
    assert.deepStrictEqual(partialNums, [4, 5, 6, 7, 9, 10, 11, 12, 16]);

    const gapNums = gap.map((t) => taskNum(t.id));
    assert.deepStrictEqual(gapNums, [17]);
  });

  it('TD-4: task context groupings match the specification', () => {
    const byContext = {};
    for (const task of waTasks) {
      if (!byContext[task.taskContext]) byContext[task.taskContext] = [];
      byContext[task.taskContext].push(taskNum(task.id));
    }
    for (const key of Object.keys(byContext)) {
      byContext[key].sort((a, b) => a - b);
    }

    assert.deepStrictEqual(byContext[WaTaskContext.CLAIM], [1, 2, 10],
      'claim context should contain tasks 1, 2, 10');
    assert.deepStrictEqual(byContext[WaTaskContext.COUNTERCLAIM], [5, 12],
      'counterclaim context should contain tasks 5, 12');
    assert.deepStrictEqual(byContext[WaTaskContext.CLAIM_COUNTERCLAIM], [4, 9],
      'claim-counterclaim context should contain tasks 4, 9');
    assert.deepStrictEqual(byContext[WaTaskContext.GEN_APP], [6, 7, 8, 11],
      'gen-app context should contain tasks 6, 7, 8, 11');
    assert.deepStrictEqual(byContext[WaTaskContext.GENERAL], [3, 13, 14, 15, 16, 17],
      'general context should contain tasks 3, 13, 14, 15, 16, 17');
  });

  it('TD-5: every task has non-empty taskName and triggerDescription', () => {
    for (const task of waTasks) {
      assert.ok(task.taskName && task.taskName.trim().length > 0,
        `Task ${task.id} has empty taskName`);
      assert.ok(task.triggerDescription && task.triggerDescription.trim().length > 0,
        `Task ${task.id} has empty triggerDescription`);
    }
  });
});

// ── 2. WA Mapping Data (story-wa-mapping-data.md) ────────────────────

describe('WA Mapping Data -- data/wa-mappings.json', () => {
  it('MD-1: contains exactly 17 mappings with valid unique waTaskIds', () => {
    assert.equal(waMappings.length, 17, `Expected 17 mappings, got ${waMappings.length}`);
    const taskIds = new Set(waTasks.map((t) => t.id));
    const mappingTaskIds = waMappings.map((m) => m.waTaskId);
    const uniqueMappingIds = new Set(mappingTaskIds);
    assert.equal(uniqueMappingIds.size, 17, 'All 17 mapping waTaskIds must be unique');
    for (const mid of mappingTaskIds) {
      assert.ok(taskIds.has(mid), `Mapping references unknown task ID: ${mid}`);
    }
  });

  it('MD-1b: every task validates against WaTaskMappingSchema', () => {
    for (const mapping of waMappings) {
      const result = WaTaskMappingSchema.safeParse(mapping);
      assert.ok(result.success, `Mapping for ${mapping.waTaskId} failed schema validation: ${JSON.stringify(result.error?.issues)}`);
    }
  });

  it('MD-2: aligned task mappings have non-empty eventIds', () => {
    const alignedTaskIds = new Set(
      waTasks.filter((t) => t.alignment === WaAlignmentStatus.ALIGNED).map((t) => t.id)
    );
    const alignedMappings = waMappings.filter((m) => alignedTaskIds.has(m.waTaskId));

    assert.equal(alignedMappings.length, 7, 'Should have 7 aligned mappings');
    for (const m of alignedMappings) {
      assert.ok(Array.isArray(m.eventIds) && m.eventIds.length > 0,
        `Aligned mapping ${m.waTaskId} must have non-empty eventIds`);
      for (const eid of m.eventIds) {
        assert.equal(typeof eid, 'string', `eventId must be a string in ${m.waTaskId}`);
        assert.ok(eid.trim().length > 0, `eventId must be non-empty in ${m.waTaskId}`);
      }
    }
  });

  it('MD-3: partial task mappings have eventIds and explanatory alignmentNotes', () => {
    const partialTaskIds = new Set(
      waTasks.filter((t) => t.alignment === WaAlignmentStatus.PARTIAL).map((t) => t.id)
    );
    const partialMappings = waMappings.filter((m) => partialTaskIds.has(m.waTaskId));

    assert.equal(partialMappings.length, 9, 'Should have 9 partial mappings');
    for (const m of partialMappings) {
      assert.ok(Array.isArray(m.eventIds) && m.eventIds.length > 0,
        `Partial mapping ${m.waTaskId} must have non-empty eventIds`);
      assert.ok(m.alignmentNotes && m.alignmentNotes.trim().length > 0,
        `Partial mapping ${m.waTaskId} must have non-empty alignmentNotes`);
    }
  });

  it('MD-4: gap task (wa-task-17) has empty eventIds with explanatory note', () => {
    const gapMapping = waMappings.find((m) => m.waTaskId === 'wa-task-17');
    assert.ok(gapMapping, 'Mapping for wa-task-17 (Failed Payment) must exist');
    assert.deepStrictEqual(gapMapping.eventIds, [],
      'Gap mapping eventIds must be an empty array');
    assert.ok(gapMapping.alignmentNotes && gapMapping.alignmentNotes.trim().length > 0,
      'Gap mapping must have non-empty alignmentNotes explaining missing event');
  });

  it('MD-5: citizen-only footnote is present in mappings for tasks 9-12', () => {
    const citizenTaskIds = ['wa-task-09', 'wa-task-10', 'wa-task-11', 'wa-task-12'];
    for (const tid of citizenTaskIds) {
      const mapping = waMappings.find((m) => m.waTaskId === tid);
      assert.ok(mapping, `Mapping for ${tid} must exist`);
      assert.ok(
        mapping.alignmentNotes.toLowerCase().includes('citizen'),
        `Mapping ${tid} alignmentNotes must include citizen-only footnote (expected substring "citizen")`
      );
    }
  });
});

// ── 3. WA Validation Script (story-wa-validation.md) ─────────────────

describe('WA Validation Script -- validateWaData()', () => {
  it('VD-1: returns success when validating the actual wa-tasks data', () => {
    const result = validateWaData(waTasks, waMappings);
    assert.equal(result.success, true,
      `Validation should pass for correct data but got errors: ${JSON.stringify(result.errors)}`);
  });

  it('VD-2: returns success with no errors array or empty errors', () => {
    const result = validateWaData(waTasks, waMappings);
    assert.ok(
      !result.errors || result.errors.length === 0,
      'Successful validation should have no errors'
    );
  });

  it('VD-3: returns failure with error details for invalid task records', () => {
    const badTasks = [...waTasks.slice(0, 16), { id: 'wa-task-17', taskName: '' }];
    const result = validateWaData(badTasks, waMappings);
    assert.equal(result.success, false, 'Validation should fail for invalid task record');
    assert.ok(result.errors && result.errors.length > 0,
      'Failed validation must include error details');
  });

  it('VD-4: returns failure when record counts are wrong', () => {
    const shortTasks = waTasks.slice(0, 10);
    const result = validateWaData(shortTasks, waMappings);
    assert.equal(result.success, false, 'Validation should fail when task count is not 17');
  });

  it('VD-5: returns failure when waTaskId referential integrity is broken', () => {
    const badMappings = waMappings.map((m) => ({ ...m }));
    badMappings[0] = { ...badMappings[0], waTaskId: 'wa-task-99' };
    const result = validateWaData(waTasks, badMappings);
    assert.equal(result.success, false,
      'Validation should fail when mapping references non-existent task');
    assert.ok(result.errors && result.errors.length > 0,
      'Referential integrity failure must include error details');
  });

  it('VD-6: result object has success boolean and errors array', () => {
    const result = validateWaData(waTasks, waMappings);
    assert.equal(typeof result.success, 'boolean', 'result.success must be a boolean');
    assert.ok('errors' in result, 'result must have an errors property');
  });
});
