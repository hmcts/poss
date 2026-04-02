import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  RefStateSchema,
  RefEventSchema,
  PersonaSchema,
  WaTaskSchema,
  StateEventAssocSchema,
  EventTaskAssocSchema,
  PersonaStateAssocSchema,
  PersonaEventAssocSchema,
  PersonaTaskAssocSchema,
  ReferenceDataBlobSchema,
} from '../src/ref-data/index.js';

// ── RefStateSchema ────────────────────────────────────────────────────

describe('RefStateSchema', () => {
  const valid = { id: 'state-001', name: 'Case Issued', description: 'Claim has been issued', claimType: 'MAIN_CLAIM_ENGLAND' };

  it('RS-1: accepts valid state with id, name, description', () => {
    const result = RefStateSchema.safeParse(valid);
    assert.ok(result.success, `Valid RefState rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('RS-2: rejects when any required field is missing', () => {
    for (const field of ['id', 'name', 'description']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = RefStateSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── RefEventSchema ────────────────────────────────────────────────────

describe('RefEventSchema', () => {
  const valid = { id: 'evt-001', name: 'Issue Claim', description: 'Claimant initiates proceedings' };

  it('RE-1: accepts valid event with id, name, description', () => {
    const result = RefEventSchema.safeParse(valid);
    assert.ok(result.success, `Valid RefEvent rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('RE-2: rejects when any required field is missing', () => {
    for (const field of ['id', 'name', 'description']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = RefEventSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── PersonaSchema ─────────────────────────────────────────────────────

describe('PersonaSchema', () => {
  const valid = { id: 'judge', roles: ['Judge'], isCrossCutting: false };

  it('PE-1: accepts valid persona with id, roles array, isCrossCutting boolean', () => {
    const result = PersonaSchema.safeParse(valid);
    assert.ok(result.success, `Valid Persona rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('PE-2: accepts persona with empty roles array', () => {
    const result = PersonaSchema.safeParse({ ...valid, roles: [] });
    assert.ok(result.success, 'Empty roles array should be accepted');
  });

  it('PE-3: rejects non-array roles, non-boolean isCrossCutting, and missing fields', () => {
    const nonArrayRoles = PersonaSchema.safeParse({ ...valid, roles: 'Judge' });
    assert.equal(nonArrayRoles.success, false, 'roles as string should be rejected');

    const nonBoolCross = PersonaSchema.safeParse({ ...valid, isCrossCutting: 'yes' });
    assert.equal(nonBoolCross.success, false, 'isCrossCutting as string should be rejected');

    for (const field of ['id', 'roles', 'isCrossCutting']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = PersonaSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── WaTaskSchema (re-export) ──────────────────────────────────────────

describe('WaTaskSchema (re-exported from src/data-model)', () => {
  const valid = {
    id: 'wa-001',
    triggerDescription: 'Claim issued',
    taskName: 'Review claim',
    taskContext: 'general',
    alignment: 'aligned',
  };

  it('WT-1: is exported and accepts a valid WA task', () => {
    assert.equal(typeof WaTaskSchema, 'object', 'WaTaskSchema should be a Zod object schema');
    const result = WaTaskSchema.safeParse(valid);
    assert.ok(result.success, `Valid WaTask rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('WT-2: rejects an invalid taskContext enum value', () => {
    const result = WaTaskSchema.safeParse({ ...valid, taskContext: 'UNKNOWN_CONTEXT' });
    assert.equal(result.success, false, 'Invalid taskContext enum value should be rejected');
  });
});

// ── StateEventAssocSchema ─────────────────────────────────────────────

describe('StateEventAssocSchema', () => {
  const valid = { stateId: 'state-001', eventId: 'evt-001' };

  it('SA-1: accepts valid association with stateId and eventId', () => {
    const result = StateEventAssocSchema.safeParse(valid);
    assert.ok(result.success, `Valid StateEventAssoc rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('SA-2: rejects when stateId or eventId is missing', () => {
    for (const field of ['stateId', 'eventId']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = StateEventAssocSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── EventTaskAssocSchema ──────────────────────────────────────────────

describe('EventTaskAssocSchema', () => {
  const valid = { eventId: 'evt-001', waTaskId: 'wa-001', alignmentNotes: 'Fully aligned' };

  it('ET-1: accepts valid association with all three required fields', () => {
    const result = EventTaskAssocSchema.safeParse(valid);
    assert.ok(result.success, `Valid EventTaskAssoc rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('ET-2: accepts empty string for alignmentNotes', () => {
    const result = EventTaskAssocSchema.safeParse({ ...valid, alignmentNotes: '' });
    assert.ok(result.success, 'Empty alignmentNotes string should be accepted');
  });

  it('ET-3: rejects when any required field is missing or alignmentNotes is not a string', () => {
    for (const field of ['eventId', 'waTaskId', 'alignmentNotes']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = EventTaskAssocSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }

    const nullNotes = EventTaskAssocSchema.safeParse({ ...valid, alignmentNotes: null });
    assert.equal(nullNotes.success, false, 'null alignmentNotes should be rejected');
  });
});

// ── PersonaStateAssocSchema ───────────────────────────────────────────

describe('PersonaStateAssocSchema', () => {
  const valid = { personaId: 'judge', stateId: 'state-001' };

  it('PS-1: accepts valid association with personaId and stateId', () => {
    const result = PersonaStateAssocSchema.safeParse(valid);
    assert.ok(result.success, `Valid PersonaStateAssoc rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('PS-2: rejects when personaId or stateId is missing', () => {
    for (const field of ['personaId', 'stateId']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = PersonaStateAssocSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── PersonaEventAssocSchema ───────────────────────────────────────────

describe('PersonaEventAssocSchema', () => {
  const valid = { personaId: 'judge', eventId: 'evt-001' };

  it('PEV-1: accepts valid association with personaId and eventId', () => {
    const result = PersonaEventAssocSchema.safeParse(valid);
    assert.ok(result.success, `Valid PersonaEventAssoc rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('PEV-2: rejects when personaId or eventId is missing', () => {
    for (const field of ['personaId', 'eventId']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = PersonaEventAssocSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── PersonaTaskAssocSchema ────────────────────────────────────────────

describe('PersonaTaskAssocSchema', () => {
  const valid = { personaId: 'judge', waTaskId: 'wa-001' };

  it('PT-1: accepts valid association with personaId and waTaskId', () => {
    const result = PersonaTaskAssocSchema.safeParse(valid);
    assert.ok(result.success, `Valid PersonaTaskAssoc rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('PT-2: rejects when personaId or waTaskId is missing', () => {
    for (const field of ['personaId', 'waTaskId']) {
      const incomplete = { ...valid };
      delete incomplete[field];
      const result = PersonaTaskAssocSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Missing ${field} should be rejected`);
    }
  });
});

// ── ReferenceDataBlobSchema ───────────────────────────────────────────

describe('ReferenceDataBlobSchema', () => {
  const validBlob = {
    states: [{ id: 'state-001', name: 'Case Issued', description: 'Claim has been issued', claimType: 'MAIN_CLAIM_ENGLAND' }],
    events: [{ id: 'evt-001', name: 'Issue Claim', description: 'Claimant initiates proceedings' }],
    waTasks: [{
      id: 'wa-001',
      triggerDescription: 'Claim issued',
      taskName: 'Review claim',
      taskContext: 'general',
      alignment: 'aligned',
    }],
    personas: [{ id: 'judge', roles: ['Judge'], isCrossCutting: false }],
    stateEventAssocs: [{ stateId: 'state-001', eventId: 'evt-001' }],
    eventTaskAssocs: [{ eventId: 'evt-001', waTaskId: 'wa-001', alignmentNotes: '' }],
    personaStateAssocs: [{ personaId: 'judge', stateId: 'state-001' }],
    personaEventAssocs: [{ personaId: 'judge', eventId: 'evt-001' }],
    personaTaskAssocs: [{ personaId: 'judge', waTaskId: 'wa-001' }],
  };

  it('RDB-1: accepts a valid blob with all nine arrays populated', () => {
    const result = ReferenceDataBlobSchema.safeParse(validBlob);
    assert.ok(result.success, `Valid blob rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('RDB-2: accepts a blob with all nine arrays empty', () => {
    const emptyBlob = {
      states: [],
      events: [],
      waTasks: [],
      personas: [],
      stateEventAssocs: [],
      eventTaskAssocs: [],
      personaStateAssocs: [],
      personaEventAssocs: [],
      personaTaskAssocs: [],
    };
    const result = ReferenceDataBlobSchema.safeParse(emptyBlob);
    assert.ok(result.success, 'Blob with all empty arrays should be accepted');
  });

  it('RDB-3: rejects a blob missing any of the nine required arrays', () => {
    const keys = Object.keys(validBlob);
    assert.equal(keys.length, 9, 'Sanity: validBlob must have exactly 9 keys');
    for (const key of keys) {
      const incomplete = { ...validBlob };
      delete incomplete[key];
      const result = ReferenceDataBlobSchema.safeParse(incomplete);
      assert.equal(result.success, false, `Blob missing "${key}" array should be rejected`);
    }
  });
});

// ── Bridge file / export surface ──────────────────────────────────────

describe('Module export surface', () => {
  it('BF-1: all ten symbols are exported from src/ref-data/index.js', () => {
    const symbols = [
      RefStateSchema,
      RefEventSchema,
      PersonaSchema,
      WaTaskSchema,
      StateEventAssocSchema,
      EventTaskAssocSchema,
      PersonaStateAssocSchema,
      PersonaEventAssocSchema,
      PersonaTaskAssocSchema,
      ReferenceDataBlobSchema,
    ];
    for (const sym of symbols) {
      assert.notEqual(sym, undefined, 'Each schema must be a defined export');
    }
  });

  it('BF-2: each exported schema has a .safeParse method (is a Zod schema)', () => {
    const schemas = {
      RefStateSchema,
      RefEventSchema,
      PersonaSchema,
      WaTaskSchema,
      StateEventAssocSchema,
      EventTaskAssocSchema,
      PersonaStateAssocSchema,
      PersonaEventAssocSchema,
      PersonaTaskAssocSchema,
      ReferenceDataBlobSchema,
    };
    for (const [name, schema] of Object.entries(schemas)) {
      assert.equal(typeof schema.safeParse, 'function', `${name}.safeParse should be a function`);
    }
  });

  it('BF-3: WaTaskSchema is the same object re-exported (not a redefinition)', async () => {
    const dataModel = await import('../src/data-model/index.js');
    assert.strictEqual(
      WaTaskSchema,
      dataModel.WaTaskSchema,
      'WaTaskSchema from src/ref-data must be the same reference as src/data-model'
    );
  });
});
