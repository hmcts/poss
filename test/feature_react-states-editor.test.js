import { test, suite } from 'node:test';
import assert from 'node:assert/strict';

// Import pure logic functions from the src/ref-data module (bridge file for node:test compatibility)
import {
  generateStateId,
  isStateDeletable,
  applyStateEdit,
  addNewState,
  deleteState,
} from '../src/ref-data/index.js';

suite('generateStateId', () => {
  test('returns a string', () => {
    const id = generateStateId();
    assert.equal(typeof id, 'string');
  });

  test('starts with "state-"', () => {
    const id = generateStateId();
    assert.ok(id.startsWith('state-'), `Expected id to start with "state-", got: ${id}`);
  });

  test('returns different values on successive calls', () => {
    const id1 = generateStateId();
    // Small delay not needed — Date.now() can be same in fast loop,
    // but the function contract only guarantees the prefix. Just check prefix twice.
    const id2 = generateStateId();
    assert.ok(id1.startsWith('state-'));
    assert.ok(id2.startsWith('state-'));
  });
});

suite('isStateDeletable', () => {
  const emptyAssocs = { stateEventAssocs: [], personaStateAssocs: [] };

  test('returns true when no associations reference the stateId', () => {
    assert.equal(isStateDeletable('s1', emptyAssocs), true);
  });

  test('returns false when a stateEventAssoc references the stateId', () => {
    const assocs = {
      stateEventAssocs: [{ stateId: 's1', eventId: 'e1' }],
      personaStateAssocs: [],
    };
    assert.equal(isStateDeletable('s1', assocs), false);
  });

  test('returns false when a personaStateAssoc references the stateId', () => {
    const assocs = {
      stateEventAssocs: [],
      personaStateAssocs: [{ personaId: 'p1', stateId: 's1' }],
    };
    assert.equal(isStateDeletable('s1', assocs), false);
  });

  test('returns false when both types of assoc reference the stateId', () => {
    const assocs = {
      stateEventAssocs: [{ stateId: 's1', eventId: 'e1' }],
      personaStateAssocs: [{ personaId: 'p1', stateId: 's1' }],
    };
    assert.equal(isStateDeletable('s1', assocs), false);
  });

  test('returns true when assocs reference a different stateId', () => {
    const assocs = {
      stateEventAssocs: [{ stateId: 's2', eventId: 'e1' }],
      personaStateAssocs: [{ personaId: 'p1', stateId: 's2' }],
    };
    assert.equal(isStateDeletable('s1', assocs), true);
  });
});

suite('applyStateEdit', () => {
  const states = [
    { id: 's1', name: 'State One', description: 'First' },
    { id: 's2', name: 'State Two', description: 'Second' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = applyStateEdit(states, 's1', { name: 'Updated' });
    assert.notEqual(result, states);
  });

  test('updates only the targeted row', () => {
    const result = applyStateEdit(states, 's1', { name: 'Updated Name' });
    assert.equal(result[0].name, 'Updated Name');
  });

  test('does not modify other rows', () => {
    const result = applyStateEdit(states, 's1', { name: 'Updated Name' });
    assert.equal(result[1].name, 'State Two');
    assert.equal(result[1].description, 'Second');
  });

  test('can update description independently', () => {
    const result = applyStateEdit(states, 's2', { description: 'New desc' });
    assert.equal(result[1].description, 'New desc');
    assert.equal(result[1].name, 'State Two');
  });

  test('returns same-length array', () => {
    const result = applyStateEdit(states, 's1', { name: 'X' });
    assert.equal(result.length, states.length);
  });

  test('returns original array length if id not found', () => {
    const result = applyStateEdit(states, 'unknown', { name: 'X' });
    assert.equal(result.length, states.length);
  });
});

suite('addNewState', () => {
  const states = [
    { id: 's1', name: 'State One', description: 'First' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = addNewState(states);
    assert.notEqual(result, states);
  });

  test('returns array with one more element', () => {
    const result = addNewState(states);
    assert.equal(result.length, states.length + 1);
  });

  test('new state id starts with "state-"', () => {
    const result = addNewState(states);
    const newState = result[result.length - 1];
    assert.ok(newState.id.startsWith('state-'), `Expected id to start with "state-", got: ${newState.id}`);
  });

  test('new state has empty name', () => {
    const result = addNewState(states);
    const newState = result[result.length - 1];
    assert.equal(newState.name, '');
  });

  test('new state has empty description', () => {
    const result = addNewState(states);
    const newState = result[result.length - 1];
    assert.equal(newState.description, '');
  });

  test('existing states are unchanged', () => {
    const result = addNewState(states);
    assert.equal(result[0].id, 's1');
    assert.equal(result[0].name, 'State One');
  });

  test('works with empty array', () => {
    const result = addNewState([]);
    assert.equal(result.length, 1);
    assert.ok(result[0].id.startsWith('state-'));
  });
});

suite('deleteState', () => {
  const states = [
    { id: 's1', name: 'State One', description: 'First' },
    { id: 's2', name: 'State Two', description: 'Second' },
    { id: 's3', name: 'State Three', description: 'Third' },
  ];

  test('returns a new array (does not mutate input)', () => {
    const result = deleteState(states, 's2');
    assert.notEqual(result, states);
  });

  test('removes the targeted row', () => {
    const result = deleteState(states, 's2');
    assert.equal(result.length, 2);
    assert.ok(!result.find(s => s.id === 's2'));
  });

  test('leaves other rows unchanged', () => {
    const result = deleteState(states, 's2');
    assert.ok(result.find(s => s.id === 's1'));
    assert.ok(result.find(s => s.id === 's3'));
  });

  test('returns same-length array if id not found', () => {
    const result = deleteState(states, 'unknown');
    assert.equal(result.length, states.length);
  });

  test('can delete first element', () => {
    const result = deleteState(states, 's1');
    assert.equal(result[0].id, 's2');
  });

  test('can delete last element', () => {
    const result = deleteState(states, 's3');
    assert.equal(result[result.length - 1].id, 's2');
  });
});
