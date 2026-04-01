import { test, suite } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateEventId,
  isEventDeletable,
  applyEventEdit,
  addNewEvent,
  deleteEvent,
} from '../src/ref-data/events-editor-logic.js';

const makeEvent = (id, name = 'Event Name', description = 'Desc') => ({ id, name, description });

const emptyAssocs = { stateEventAssocs: [], eventTaskAssocs: [], personaEventAssocs: [] };

suite('generateEventId', () => {
  test('returns a string', () => {
    assert.equal(typeof generateEventId(), 'string');
  });

  test('starts with "event-"', () => {
    assert.match(generateEventId(), /^event-/);
  });

  test('two calls return different values', () => {
    assert.notEqual(generateEventId(), generateEventId());
  });
});

suite('isEventDeletable', () => {
  test('returns true when all assoc arrays are empty', () => {
    assert.equal(isEventDeletable('event-1', emptyAssocs), true);
  });

  test('returns false when eventId appears in stateEventAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      stateEventAssocs: [{ stateId: 'state-1', eventId: 'event-1' }],
    };
    assert.equal(isEventDeletable('event-1', assocs), false);
  });

  test('returns false when eventId appears in eventTaskAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      eventTaskAssocs: [{ eventId: 'event-1', waTaskId: 'task-1', alignmentNotes: '' }],
    };
    assert.equal(isEventDeletable('event-1', assocs), false);
  });

  test('returns false when eventId appears in personaEventAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      personaEventAssocs: [{ personaId: 'persona-1', eventId: 'event-1' }],
    };
    assert.equal(isEventDeletable('event-1', assocs), false);
  });

  test('returns true when eventId does NOT appear in any array (other events do)', () => {
    const assocs = {
      stateEventAssocs: [{ stateId: 'state-1', eventId: 'event-2' }],
      eventTaskAssocs: [{ eventId: 'event-3', waTaskId: 'task-1', alignmentNotes: '' }],
      personaEventAssocs: [{ personaId: 'persona-1', eventId: 'event-4' }],
    };
    assert.equal(isEventDeletable('event-1', assocs), true);
  });

  test('returns false when eventId appears in multiple arrays', () => {
    const assocs = {
      stateEventAssocs: [{ stateId: 'state-1', eventId: 'event-1' }],
      eventTaskAssocs: [{ eventId: 'event-1', waTaskId: 'task-1', alignmentNotes: '' }],
      personaEventAssocs: [{ personaId: 'persona-1', eventId: 'event-1' }],
    };
    assert.equal(isEventDeletable('event-1', assocs), false);
  });
});

suite('applyEventEdit', () => {
  test('returns a new array reference', () => {
    const events = [makeEvent('event-1')];
    const result = applyEventEdit(events, 'event-1', { name: 'New Name' });
    assert.notEqual(result, events);
  });

  test('updates name of matching event', () => {
    const events = [makeEvent('event-1', 'Old Name')];
    const result = applyEventEdit(events, 'event-1', { name: 'New Name' });
    assert.equal(result[0].name, 'New Name');
  });

  test('updates description of matching event', () => {
    const events = [makeEvent('event-1', 'Name', 'Old Desc')];
    const result = applyEventEdit(events, 'event-1', { description: 'New Desc' });
    assert.equal(result[0].description, 'New Desc');
  });

  test('does not mutate original array', () => {
    const events = [makeEvent('event-1', 'Original')];
    applyEventEdit(events, 'event-1', { name: 'Changed' });
    assert.equal(events[0].name, 'Original');
  });

  test('returns unchanged array when id not found', () => {
    const events = [makeEvent('event-1')];
    const result = applyEventEdit(events, 'event-999', { name: 'X' });
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'Event Name');
  });
});

suite('addNewEvent', () => {
  test('returns object with events and newId', () => {
    const result = addNewEvent([]);
    assert.ok('events' in result);
    assert.ok('newId' in result);
  });

  test('newId starts with "event-"', () => {
    const { newId } = addNewEvent([]);
    assert.match(newId, /^event-/);
  });

  test('returned events array has one more item than input', () => {
    const events = [makeEvent('event-1')];
    const { events: result } = addNewEvent(events);
    assert.equal(result.length, 2);
  });

  test('new event id matches newId', () => {
    const { events, newId } = addNewEvent([]);
    assert.equal(events[0].id, newId);
  });

  test('new event name and description are empty strings', () => {
    const { events } = addNewEvent([]);
    assert.equal(events[0].name, '');
    assert.equal(events[0].description, '');
  });
});

suite('deleteEvent', () => {
  test('returns array with one fewer item', () => {
    const events = [makeEvent('event-1'), makeEvent('event-2')];
    const result = deleteEvent(events, 'event-1');
    assert.equal(result.length, 1);
  });

  test('returns new array reference (no mutation)', () => {
    const events = [makeEvent('event-1')];
    const result = deleteEvent(events, 'event-1');
    assert.notEqual(result, events);
  });

  test('removed event is the one with matching id', () => {
    const events = [makeEvent('event-1'), makeEvent('event-2')];
    const result = deleteEvent(events, 'event-1');
    assert.equal(result[0].id, 'event-2');
  });

  test('other events are unchanged', () => {
    const events = [makeEvent('event-1', 'Keep Me'), makeEvent('event-2', 'Remove Me')];
    const result = deleteEvent(events, 'event-2');
    assert.equal(result[0].name, 'Keep Me');
  });

  test('returns empty array when last event is removed', () => {
    const result = deleteEvent([makeEvent('event-1')], 'event-1');
    assert.equal(result.length, 0);
  });

  test('returns same-length array when id not found', () => {
    const events = [makeEvent('event-1')];
    const result = deleteEvent(events, 'event-999');
    assert.equal(result.length, 1);
  });
});
