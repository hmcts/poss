import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { filterEventsByPersona, getPersonaLabel } from '../src/event-matrix/persona-filter.js';

const makeEvent = (id) => ({
  id,
  name: `Event ${id}`,
  claimType: 'MAIN',
  state: 'StateA',
  isSystemEvent: false,
  notes: '',
  hasOpenQuestions: false,
  actors: {},
});

const makeBlob = (personaEventAssocs) => ({
  states: [],
  events: [],
  waTasks: [],
  personas: [],
  stateEventAssocs: [],
  eventTaskAssocs: [],
  personaStateAssocs: [],
  personaEventAssocs,
  personaTaskAssocs: [],
});

describe('filterEventsByPersona', () => {
  it('T-PM1: returns all events when personaId is null', () => {
    const events = [makeEvent('e1'), makeEvent('e2'), makeEvent('e3')];
    const blob = makeBlob([{ personaId: 'p1', eventId: 'e1' }]);
    const result = filterEventsByPersona(events, blob, null);
    assert.deepEqual(result, events);
  });

  it('T-PM2: returns only events whose id appears in personaEventAssocs for the persona', () => {
    const events = [makeEvent('e1'), makeEvent('e2'), makeEvent('e3')];
    const blob = makeBlob([
      { personaId: 'p1', eventId: 'e1' },
      { personaId: 'p1', eventId: 'e3' },
      { personaId: 'p2', eventId: 'e2' },
    ]);
    const result = filterEventsByPersona(events, blob, 'p1');
    assert.equal(result.length, 2);
    assert.equal(result[0].id, 'e1');
    assert.equal(result[1].id, 'e3');
  });

  it('T-PM3: returns [] when no events match the persona\'s assocs', () => {
    const events = [makeEvent('e1'), makeEvent('e2')];
    const blob = makeBlob([
      { personaId: 'p2', eventId: 'e1' },
      { personaId: 'p2', eventId: 'e2' },
    ]);
    const result = filterEventsByPersona(events, blob, 'p1');
    assert.deepEqual(result, []);
  });

  it('T-PM4: returns all events when blob is null (graceful fallback)', () => {
    const events = [makeEvent('e1'), makeEvent('e2')];
    const result = filterEventsByPersona(events, null, 'p1');
    assert.deepEqual(result, events);
  });

  it('T-PM5: returns all events when personaId is null even with a non-null blob', () => {
    const events = [makeEvent('e1'), makeEvent('e2')];
    const blob = makeBlob([
      { personaId: 'p1', eventId: 'e1' },
    ]);
    const result = filterEventsByPersona(events, blob, null);
    assert.deepEqual(result, events);
  });
});

describe('getPersonaLabel', () => {
  it('T-PM6: persona label shows roles comma-separated', () => {
    const persona = { id: 'p1', roles: ['Judge', 'Caseworker'], isCrossCutting: false };
    assert.equal(getPersonaLabel(persona), 'Judge, Caseworker');
  });
});
