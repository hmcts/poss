import { test, suite } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Logic functions under test
// These mirror the exported implementations from
// app/reference-data/ReferenceDataShell.tsx — tested here as pure JS logic.
// ---------------------------------------------------------------------------

/**
 * Returns true when baseline and current differ (deep JSON comparison).
 * Returns false if both are null, or if they are deeply equal.
 *
 * @param {object|null} baseline
 * @param {object|null} current
 * @returns {boolean}
 */
function hasUnsavedChanges(baseline, current) {
  if (baseline === null && current === null) return false;
  if (baseline === null || current === null) return true;
  return JSON.stringify(baseline) !== JSON.stringify(current);
}

/**
 * Returns a new ReferenceDataBlob with data[key] replaced by updated.
 * All other keys are unchanged (shallow-copied).
 *
 * @param {object} data - ReferenceDataBlob
 * @param {string} key - keyof ReferenceDataBlob
 * @param {any} updated - new value for data[key]
 * @returns {object}
 */
function mergeEntityUpdate(data, key, updated) {
  return { ...data, [key]: updated };
}

// ---------------------------------------------------------------------------
// Minimal test fixture
// ---------------------------------------------------------------------------

const emptyBlob = () => ({
  states: [],
  events: [],
  waTasks: [],
  personas: [],
  stateEventAssocs: [],
  eventTaskAssocs: [],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
});

const sampleState = (id = 's1', name = 'Draft') => ({
  id,
  name,
  description: 'A draft state',
});

const sampleEvent = (id = 'e1', name = 'Submit') => ({
  id,
  name,
  description: 'An event',
});

// ---------------------------------------------------------------------------
// Suite: hasUnsavedChanges
// ---------------------------------------------------------------------------

suite('hasUnsavedChanges', () => {
  test('returns false when both baseline and current are null', () => {
    assert.equal(hasUnsavedChanges(null, null), false);
  });

  test('returns true when baseline is null but current is not null', () => {
    assert.equal(hasUnsavedChanges(null, emptyBlob()), true);
  });

  test('returns true when current is null but baseline is not null', () => {
    assert.equal(hasUnsavedChanges(emptyBlob(), null), true);
  });

  test('returns false when baseline equals current (both empty blobs)', () => {
    assert.equal(hasUnsavedChanges(emptyBlob(), emptyBlob()), false);
  });

  test('returns false when baseline and current are the same object reference', () => {
    const blob = emptyBlob();
    assert.equal(hasUnsavedChanges(blob, blob), false);
  });

  test('returns true when current has a modified state name', () => {
    const baseline = { ...emptyBlob(), states: [sampleState('s1', 'Draft')] };
    const current = { ...emptyBlob(), states: [sampleState('s1', 'Modified Draft')] };
    assert.equal(hasUnsavedChanges(baseline, current), true);
  });

  test('returns true when an item is added to the states array', () => {
    const baseline = { ...emptyBlob(), states: [sampleState('s1')] };
    const current = { ...emptyBlob(), states: [sampleState('s1'), sampleState('s2')] };
    assert.equal(hasUnsavedChanges(baseline, current), true);
  });

  test('returns true when an item is removed from the states array', () => {
    const baseline = { ...emptyBlob(), states: [sampleState('s1'), sampleState('s2')] };
    const current = { ...emptyBlob(), states: [sampleState('s1')] };
    assert.equal(hasUnsavedChanges(baseline, current), true);
  });

  test('returns false when blobs with populated arrays are deeply equal', () => {
    const blob1 = {
      ...emptyBlob(),
      states: [sampleState('s1', 'Draft'), sampleState('s2', 'Active')],
      events: [sampleEvent('e1', 'Submit')],
    };
    const blob2 = {
      ...emptyBlob(),
      states: [sampleState('s1', 'Draft'), sampleState('s2', 'Active')],
      events: [sampleEvent('e1', 'Submit')],
    };
    assert.equal(hasUnsavedChanges(blob1, blob2), false);
  });
});

// ---------------------------------------------------------------------------
// Suite: mergeEntityUpdate
// ---------------------------------------------------------------------------

suite('mergeEntityUpdate', () => {
  test('returns a new object (does not return the same reference)', () => {
    const data = emptyBlob();
    const result = mergeEntityUpdate(data, 'states', []);
    assert.notEqual(result, data);
  });

  test('does not mutate the input object', () => {
    const data = { ...emptyBlob(), states: [sampleState('s1')] };
    const original = JSON.stringify(data);
    mergeEntityUpdate(data, 'states', [sampleState('s2')]);
    assert.equal(JSON.stringify(data), original);
  });

  test('updates the states array in the returned blob', () => {
    const data = emptyBlob();
    const newStates = [sampleState('s1', 'Draft'), sampleState('s2', 'Active')];
    const result = mergeEntityUpdate(data, 'states', newStates);
    assert.deepEqual(result.states, newStates);
  });

  test('updates the events array in the returned blob', () => {
    const data = emptyBlob();
    const newEvents = [sampleEvent('e1', 'Submit'), sampleEvent('e2', 'Respond')];
    const result = mergeEntityUpdate(data, 'events', newEvents);
    assert.deepEqual(result.events, newEvents);
  });

  test('updates the waTasks array in the returned blob', () => {
    const data = emptyBlob();
    const newTasks = [{ id: 'wt1', name: 'Review claim', description: '', roles: [] }];
    const result = mergeEntityUpdate(data, 'waTasks', newTasks);
    assert.deepEqual(result.waTasks, newTasks);
  });

  test('leaves all other keys unchanged when updating states', () => {
    const data = {
      ...emptyBlob(),
      events: [sampleEvent('e1')],
      personas: [{ id: 'p1', roles: ['Judge'], isCrossCutting: false }],
    };
    const result = mergeEntityUpdate(data, 'states', [sampleState('s1')]);
    assert.deepEqual(result.events, data.events);
    assert.deepEqual(result.personas, data.personas);
    assert.deepEqual(result.waTasks, data.waTasks);
    assert.deepEqual(result.stateEventAssocs, data.stateEventAssocs);
    assert.deepEqual(result.eventTaskAssocs, data.eventTaskAssocs);
    assert.deepEqual(result.personaStateAssocs, data.personaStateAssocs);
    assert.deepEqual(result.personaEventAssocs, data.personaEventAssocs);
    assert.deepEqual(result.personaTaskAssocs, data.personaTaskAssocs);
  });

  test('leaves all other keys unchanged when updating events', () => {
    const data = {
      ...emptyBlob(),
      states: [sampleState('s1')],
      stateEventAssocs: [{ stateId: 's1', eventId: 'e1' }],
    };
    const result = mergeEntityUpdate(data, 'events', [sampleEvent('e2')]);
    assert.deepEqual(result.states, data.states);
    assert.deepEqual(result.stateEventAssocs, data.stateEventAssocs);
  });

  test('the updated key equals the provided updated value', () => {
    const data = emptyBlob();
    const updatedPersonas = [
      { id: 'p1', roles: ['Judge'], isCrossCutting: false },
      { id: 'p2', roles: ['Caseworker'], isCrossCutting: true },
    ];
    const result = mergeEntityUpdate(data, 'personas', updatedPersonas);
    assert.equal(result.personas, updatedPersonas); // same reference
  });
});
