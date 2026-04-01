import { suite, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAssociatedEventIds,
  countAssociations,
  toggleAssociation,
  isEventAssociated,
} from '../src/ref-data/state-event-assoc-logic.js';

const ASSOCS = [
  { stateId: 's1', eventId: 'e1' },
  { stateId: 's1', eventId: 'e2' },
  { stateId: 's2', eventId: 'e1' },
];

suite('getAssociatedEventIds', () => {
  test('returns eventIds for the given stateId', () => {
    const result = getAssociatedEventIds('s1', ASSOCS);
    assert.deepEqual(result.sort(), ['e1', 'e2']);
  });

  test('returns empty array for unknown stateId', () => {
    const result = getAssociatedEventIds('s99', ASSOCS);
    assert.deepEqual(result, []);
  });

  test('returns only eventIds for the given stateId, not others', () => {
    const result = getAssociatedEventIds('s2', ASSOCS);
    assert.deepEqual(result, ['e1']);
  });

  test('returns empty array for empty assocs', () => {
    const result = getAssociatedEventIds('s1', []);
    assert.deepEqual(result, []);
  });
});

suite('countAssociations', () => {
  test('returns correct count for state with multiple associations', () => {
    assert.equal(countAssociations('s1', ASSOCS), 2);
  });

  test('returns correct count for state with one association', () => {
    assert.equal(countAssociations('s2', ASSOCS), 1);
  });

  test('returns 0 for unknown stateId', () => {
    assert.equal(countAssociations('s99', ASSOCS), 0);
  });

  test('returns 0 for empty assocs', () => {
    assert.equal(countAssociations('s1', []), 0);
  });
});

suite('toggleAssociation', () => {
  test('adds a new association when pair does not exist', () => {
    const result = toggleAssociation('s1', 'e3', ASSOCS);
    assert.equal(result.length, ASSOCS.length + 1);
    assert.ok(result.some((a) => a.stateId === 's1' && a.eventId === 'e3'));
  });

  test('removes an existing association when pair exists', () => {
    const result = toggleAssociation('s1', 'e1', ASSOCS);
    assert.equal(result.length, ASSOCS.length - 1);
    assert.ok(!result.some((a) => a.stateId === 's1' && a.eventId === 'e1'));
  });

  test('does not mutate the input array', () => {
    const original = [...ASSOCS];
    toggleAssociation('s1', 'e3', ASSOCS);
    assert.deepEqual(ASSOCS, original);
  });

  test('does not affect other associations when removing', () => {
    const result = toggleAssociation('s1', 'e1', ASSOCS);
    // s1/e2 and s2/e1 should still be present
    assert.ok(result.some((a) => a.stateId === 's1' && a.eventId === 'e2'));
    assert.ok(result.some((a) => a.stateId === 's2' && a.eventId === 'e1'));
  });

  test('adds to empty assocs array', () => {
    const result = toggleAssociation('s1', 'e1', []);
    assert.deepEqual(result, [{ stateId: 's1', eventId: 'e1' }]);
  });
});

suite('isEventAssociated', () => {
  test('returns true when pair exists', () => {
    assert.equal(isEventAssociated('s1', 'e1', ASSOCS), true);
  });

  test('returns false when stateId matches but eventId does not', () => {
    assert.equal(isEventAssociated('s1', 'e99', ASSOCS), false);
  });

  test('returns false when eventId matches but stateId does not', () => {
    assert.equal(isEventAssociated('s99', 'e1', ASSOCS), false);
  });

  test('returns false for empty assocs', () => {
    assert.equal(isEventAssociated('s1', 'e1', []), false);
  });
});
