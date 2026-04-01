import { test, suite } from 'node:test';
import assert from 'node:assert/strict';

import {
  generateWaTaskId,
  isWaTaskDeletable,
  applyWaTaskEdit,
  addNewWaTask,
  deleteWaTask,
} from '../src/ref-data/wa-tasks-editor-logic.js';

// ── generateWaTaskId ──────────────────────────────────────────────────────────

suite('generateWaTaskId', () => {
  test('returns a string', () => {
    const id = generateWaTaskId();
    assert.equal(typeof id, 'string');
  });

  test('starts with "wa-task-"', () => {
    const id = generateWaTaskId();
    assert.ok(id.startsWith('wa-task-'), `Expected id to start with "wa-task-", got: ${id}`);
  });

  test('successive calls both return values with correct prefix', () => {
    const id1 = generateWaTaskId();
    const id2 = generateWaTaskId();
    assert.ok(id1.startsWith('wa-task-'));
    assert.ok(id2.startsWith('wa-task-'));
  });
});

// ── isWaTaskDeletable ─────────────────────────────────────────────────────────

suite('isWaTaskDeletable', () => {
  const emptyAssocs = { eventTaskAssocs: [], personaTaskAssocs: [] };

  test('returns true when no assocs reference the task id', () => {
    assert.equal(isWaTaskDeletable('wa-task-1', emptyAssocs), true);
  });

  test('returns false when eventTaskAssocs contains a record with matching waTaskId', () => {
    const assocs = {
      eventTaskAssocs: [{ eventId: 'e1', waTaskId: 'wa-task-1', alignmentNotes: '' }],
      personaTaskAssocs: [],
    };
    assert.equal(isWaTaskDeletable('wa-task-1', assocs), false);
  });

  test('returns false when personaTaskAssocs contains a record with matching waTaskId', () => {
    const assocs = {
      eventTaskAssocs: [],
      personaTaskAssocs: [{ personaId: 'p1', waTaskId: 'wa-task-1' }],
    };
    assert.equal(isWaTaskDeletable('wa-task-1', assocs), false);
  });

  test('returns false when both assoc arrays reference the task', () => {
    const assocs = {
      eventTaskAssocs: [{ eventId: 'e1', waTaskId: 'wa-task-1', alignmentNotes: '' }],
      personaTaskAssocs: [{ personaId: 'p1', waTaskId: 'wa-task-1' }],
    };
    assert.equal(isWaTaskDeletable('wa-task-1', assocs), false);
  });

  test('returns true when assocs reference a different task id', () => {
    const assocs = {
      eventTaskAssocs: [{ eventId: 'e1', waTaskId: 'wa-task-2', alignmentNotes: '' }],
      personaTaskAssocs: [{ personaId: 'p1', waTaskId: 'wa-task-2' }],
    };
    assert.equal(isWaTaskDeletable('wa-task-1', assocs), true);
  });
});

// ── applyWaTaskEdit ───────────────────────────────────────────────────────────

suite('applyWaTaskEdit', () => {
  const tasks = [
    { id: 'wa-task-1', taskName: 'Task One', triggerDescription: 'Trigger A', taskContext: 'claim', alignment: 'aligned' },
    { id: 'wa-task-2', taskName: 'Task Two', triggerDescription: 'Trigger B', taskContext: 'general', alignment: 'gap' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-1', { taskName: 'Updated' });
    assert.notEqual(result, tasks);
  });

  test('updates the targeted row with patch fields', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-1', { taskName: 'Updated Name' });
    assert.equal(result[0].taskName, 'Updated Name');
  });

  test('does not modify other rows', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-1', { taskName: 'Updated Name' });
    assert.equal(result[1].taskName, 'Task Two');
    assert.equal(result[1].triggerDescription, 'Trigger B');
  });

  test('can update alignment independently', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-2', { alignment: 'partial' });
    assert.equal(result[1].alignment, 'partial');
    assert.equal(result[1].taskName, 'Task Two');
  });

  test('can update taskContext independently', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-1', { taskContext: 'counterclaim' });
    assert.equal(result[0].taskContext, 'counterclaim');
  });

  test('returns same-length array', () => {
    const result = applyWaTaskEdit(tasks, 'wa-task-1', { taskName: 'X' });
    assert.equal(result.length, tasks.length);
  });

  test('returns same-length array if id not found', () => {
    const result = applyWaTaskEdit(tasks, 'unknown', { taskName: 'X' });
    assert.equal(result.length, tasks.length);
  });
});

// ── addNewWaTask ──────────────────────────────────────────────────────────────

suite('addNewWaTask', () => {
  const tasks = [
    { id: 'wa-task-1', taskName: 'Task One', triggerDescription: 'Trigger A', taskContext: 'claim', alignment: 'aligned' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = addNewWaTask(tasks);
    assert.notEqual(result, tasks);
  });

  test('appends exactly one new element', () => {
    const result = addNewWaTask(tasks);
    assert.equal(result.length, tasks.length + 1);
  });

  test('new task id starts with "wa-task-"', () => {
    const result = addNewWaTask(tasks);
    const newTask = result[result.length - 1];
    assert.ok(newTask.id.startsWith('wa-task-'), `Expected id to start with "wa-task-", got: ${newTask.id}`);
  });

  test('new task has default taskContext of "claim"', () => {
    const result = addNewWaTask(tasks);
    const newTask = result[result.length - 1];
    assert.equal(newTask.taskContext, 'claim');
  });

  test('new task has default alignment of "gap"', () => {
    const result = addNewWaTask(tasks);
    const newTask = result[result.length - 1];
    assert.equal(newTask.alignment, 'gap');
  });

  test('new task has empty taskName', () => {
    const result = addNewWaTask(tasks);
    const newTask = result[result.length - 1];
    assert.equal(newTask.taskName, '');
  });

  test('new task has empty triggerDescription', () => {
    const result = addNewWaTask(tasks);
    const newTask = result[result.length - 1];
    assert.equal(newTask.triggerDescription, '');
  });

  test('existing tasks are unchanged', () => {
    const result = addNewWaTask(tasks);
    assert.equal(result[0].id, 'wa-task-1');
    assert.equal(result[0].taskName, 'Task One');
  });

  test('works with empty array', () => {
    const result = addNewWaTask([]);
    assert.equal(result.length, 1);
    assert.ok(result[0].id.startsWith('wa-task-'));
  });
});

// ── deleteWaTask ──────────────────────────────────────────────────────────────

suite('deleteWaTask', () => {
  const tasks = [
    { id: 'wa-task-1', taskName: 'Task One', triggerDescription: 'A', taskContext: 'claim', alignment: 'aligned' },
    { id: 'wa-task-2', taskName: 'Task Two', triggerDescription: 'B', taskContext: 'general', alignment: 'gap' },
    { id: 'wa-task-3', taskName: 'Task Three', triggerDescription: 'C', taskContext: 'counterclaim', alignment: 'partial' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = deleteWaTask(tasks, 'wa-task-2');
    assert.notEqual(result, tasks);
  });

  test('removes the targeted task', () => {
    const result = deleteWaTask(tasks, 'wa-task-2');
    assert.equal(result.length, 2);
    assert.ok(!result.find((t) => t.id === 'wa-task-2'));
  });

  test('does not remove other tasks', () => {
    const result = deleteWaTask(tasks, 'wa-task-2');
    assert.ok(result.find((t) => t.id === 'wa-task-1'));
    assert.ok(result.find((t) => t.id === 'wa-task-3'));
  });

  test('returns same-length array if id not found', () => {
    const result = deleteWaTask(tasks, 'unknown');
    assert.equal(result.length, tasks.length);
  });

  test('can delete first element', () => {
    const result = deleteWaTask(tasks, 'wa-task-1');
    assert.equal(result[0].id, 'wa-task-2');
  });

  test('can delete last element', () => {
    const result = deleteWaTask(tasks, 'wa-task-3');
    assert.equal(result[result.length - 1].id, 'wa-task-2');
  });
});
