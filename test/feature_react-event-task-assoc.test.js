import { suite, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getLinkedTaskIds,
  isTaskLinked,
  getAssocNotes,
  toggleTaskLink,
  updateNotes,
  alignmentBadgeColour,
} from '../src/ref-data/event-task-assoc-logic.js';

const ASSOCS = [
  { eventId: 'e1', waTaskId: 't1', alignmentNotes: 'note A' },
  { eventId: 'e1', waTaskId: 't2', alignmentNotes: '' },
  { eventId: 'e2', waTaskId: 't1', alignmentNotes: 'note B' },
];

suite('getLinkedTaskIds', () => {
  test('returns waTaskIds for the given eventId', () => {
    const result = getLinkedTaskIds('e1', ASSOCS);
    assert.deepEqual(result.sort(), ['t1', 't2']);
  });

  test('returns single waTaskId for event with one link', () => {
    const result = getLinkedTaskIds('e2', ASSOCS);
    assert.deepEqual(result, ['t1']);
  });

  test('returns empty array for unknown eventId', () => {
    const result = getLinkedTaskIds('e99', ASSOCS);
    assert.deepEqual(result, []);
  });

  test('returns empty array for empty assocs', () => {
    const result = getLinkedTaskIds('e1', []);
    assert.deepEqual(result, []);
  });
});

suite('isTaskLinked', () => {
  test('returns true when pair exists', () => {
    assert.equal(isTaskLinked('e1', 't1', ASSOCS), true);
  });

  test('returns false when only eventId matches', () => {
    assert.equal(isTaskLinked('e1', 't99', ASSOCS), false);
  });

  test('returns false when only waTaskId matches', () => {
    assert.equal(isTaskLinked('e99', 't1', ASSOCS), false);
  });

  test('returns false for empty assocs', () => {
    assert.equal(isTaskLinked('e1', 't1', []), false);
  });
});

suite('getAssocNotes', () => {
  test('returns alignmentNotes when pair exists with notes', () => {
    assert.equal(getAssocNotes('e1', 't1', ASSOCS), 'note A');
  });

  test('returns empty string when pair exists with no notes', () => {
    assert.equal(getAssocNotes('e1', 't2', ASSOCS), '');
  });

  test('returns empty string when pair does not exist', () => {
    assert.equal(getAssocNotes('e1', 't99', ASSOCS), '');
  });

  test('returns empty string for empty assocs', () => {
    assert.equal(getAssocNotes('e1', 't1', []), '');
  });
});

suite('toggleTaskLink', () => {
  test('removes entry if linked', () => {
    const result = toggleTaskLink('e1', 't1', ASSOCS);
    assert.equal(result.length, ASSOCS.length - 1);
    assert.ok(!result.some((a) => a.eventId === 'e1' && a.waTaskId === 't1'));
  });

  test('adds entry with alignmentNotes "" if not linked', () => {
    const result = toggleTaskLink('e1', 't3', ASSOCS);
    assert.equal(result.length, ASSOCS.length + 1);
    const added = result.find((a) => a.eventId === 'e1' && a.waTaskId === 't3');
    assert.ok(added);
    assert.equal(added.alignmentNotes, '');
  });

  test('does not mutate input array', () => {
    const original = [...ASSOCS];
    toggleTaskLink('e1', 't3', ASSOCS);
    assert.deepEqual(ASSOCS, original);
  });

  test('handles empty assocs by adding new entry', () => {
    const result = toggleTaskLink('e1', 't1', []);
    assert.deepEqual(result, [{ eventId: 'e1', waTaskId: 't1', alignmentNotes: '' }]);
  });

  test('does not affect other associations when removing', () => {
    const result = toggleTaskLink('e1', 't1', ASSOCS);
    assert.ok(result.some((a) => a.eventId === 'e1' && a.waTaskId === 't2'));
    assert.ok(result.some((a) => a.eventId === 'e2' && a.waTaskId === 't1'));
  });
});

suite('updateNotes', () => {
  test('updates alignmentNotes for existing assoc', () => {
    const result = updateNotes('e1', 't1', 'updated note', ASSOCS);
    const updated = result.find((a) => a.eventId === 'e1' && a.waTaskId === 't1');
    assert.ok(updated);
    assert.equal(updated.alignmentNotes, 'updated note');
  });

  test('does not change other assocs when updating', () => {
    const result = updateNotes('e1', 't1', 'updated note', ASSOCS);
    const other = result.find((a) => a.eventId === 'e1' && a.waTaskId === 't2');
    assert.ok(other);
    assert.equal(other.alignmentNotes, '');
  });

  test('is no-op if pair not linked', () => {
    const result = updateNotes('e1', 't99', 'note', ASSOCS);
    assert.deepEqual(result, ASSOCS);
  });

  test('does not mutate input array', () => {
    const original = ASSOCS.map((a) => ({ ...a }));
    updateNotes('e1', 't1', 'changed', ASSOCS);
    assert.deepEqual(ASSOCS, original);
  });

  test('returns same length array', () => {
    const result = updateNotes('e1', 't1', 'new note', ASSOCS);
    assert.equal(result.length, ASSOCS.length);
  });
});

suite('alignmentBadgeColour', () => {
  test('"aligned" returns "green"', () => {
    assert.equal(alignmentBadgeColour('aligned'), 'green');
  });

  test('"partial" returns "amber"', () => {
    assert.equal(alignmentBadgeColour('partial'), 'amber');
  });

  test('"gap" returns "red"', () => {
    assert.equal(alignmentBadgeColour('gap'), 'red');
  });

  test('unknown value returns "red" as defensive fallback', () => {
    assert.equal(alignmentBadgeColour('unknown'), 'red');
  });
});
