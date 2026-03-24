import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  ClaimTypeId,
  StateSchema,
  TransitionSchema,
  EventSchema,
  ClaimTypeSchema,
  KNOWN_ROLES,
  createPossessionsStore,
} from '../src/data-model/index.js';

// ── 1. ClaimType enum ────────────────────────────────────────────────

describe('ClaimType enum', () => {
  it('CT-1: has exactly 7 members', () => {
    const values = Object.values(ClaimTypeId);
    assert.equal(values.length, 7, `Expected 7 claim types, got ${values.length}`);
  });

  it('CT-2: contains the correct identifiers from System Spec section 5', () => {
    const expected = [
      'MAIN_CLAIM_ENGLAND',
      'ACCELERATED_CLAIM_WALES',
      'COUNTER_CLAIM',
      'COUNTER_CLAIM_MAIN_CLAIM_CLOSED',
      'ENFORCEMENT',
      'APPEALS',
      'GENERAL_APPLICATIONS',
    ];
    const values = Object.values(ClaimTypeId);
    for (const id of expected) {
      assert.ok(values.includes(id), `Missing claim type identifier: ${id}`);
    }
  });
});

// ── 2. State interface/schema ────────────────────────────────────────

describe('State schema', () => {
  const validState = {
    id: 'MAIN_CLAIM_ENGLAND:CASE_ISSUED',
    technicalName: 'CASE_ISSUED',
    uiLabel: 'Case Issued',
    claimType: 'MAIN_CLAIM_ENGLAND',
    isDraftLike: false,
    isLive: true,
    isEndState: false,
    completeness: 75,
  };

  it('ST-1: accepts a valid state with all required fields', () => {
    const result = StateSchema.safeParse(validState);
    assert.ok(result.success, `Valid state rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('ST-2: completeness must be in range 0-100', () => {
    const tooLow = StateSchema.safeParse({ ...validState, completeness: -1 });
    assert.equal(tooLow.success, false, 'completeness -1 should be rejected');

    const tooHigh = StateSchema.safeParse({ ...validState, completeness: 101 });
    assert.equal(tooHigh.success, false, 'completeness 101 should be rejected');

    const zero = StateSchema.safeParse({ ...validState, completeness: 0 });
    assert.ok(zero.success, 'completeness 0 should be accepted');

    const hundred = StateSchema.safeParse({ ...validState, completeness: 100 });
    assert.ok(hundred.success, 'completeness 100 should be accepted');
  });

  it('ST-3: boolean flags are required, not optional', () => {
    for (const flag of ['isDraftLike', 'isLive', 'isEndState']) {
      const missing = { ...validState };
      delete missing[flag];
      const result = StateSchema.safeParse(missing);
      assert.equal(result.success, false, `Missing ${flag} should be rejected`);
    }
  });

  it('ST-4: survives JSON round-trip without data loss', () => {
    const result = StateSchema.parse(validState);
    const roundTripped = JSON.parse(JSON.stringify(result));
    assert.deepStrictEqual(roundTripped, result);
  });
});

// ── 3. Transition interface/schema ───────────────────────────────────

describe('Transition schema', () => {
  const validTransition = {
    from: 'MAIN_CLAIM_ENGLAND:CASE_ISSUED',
    to: 'MAIN_CLAIM_ENGLAND:JUDICIAL_REFERRAL',
    condition: null,
    isSystemTriggered: false,
    isTimeBased: false,
  };

  it('TR-1: accepts a valid transition with from/to references', () => {
    const result = TransitionSchema.safeParse(validTransition);
    assert.ok(result.success, `Valid transition rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('TR-2: condition accepts both string and null', () => {
    const withCondition = TransitionSchema.safeParse({
      ...validTransition,
      condition: 'hearing has taken place',
    });
    assert.ok(withCondition.success, 'String condition should be accepted');

    const withNull = TransitionSchema.safeParse({ ...validTransition, condition: null });
    assert.ok(withNull.success, 'Null condition should be accepted');
  });

  it('TR-3: trigger flags are required booleans', () => {
    for (const flag of ['isSystemTriggered', 'isTimeBased']) {
      const missing = { ...validTransition };
      delete missing[flag];
      const result = TransitionSchema.safeParse(missing);
      assert.equal(result.success, false, `Missing ${flag} should be rejected`);

      const wrongType = { ...validTransition, [flag]: 'yes' };
      const result2 = TransitionSchema.safeParse(wrongType);
      assert.equal(result2.success, false, `String value for ${flag} should be rejected`);
    }
  });
});

// ── 4. Event interface/schema ────────────────────────────────────────

describe('Event schema', () => {
  const validEvent = {
    id: 'evt-001',
    name: 'Issue Claim',
    claimType: 'MAIN_CLAIM_ENGLAND',
    state: 'MAIN_CLAIM_ENGLAND:CASE_ISSUED',
    isSystemEvent: false,
    notes: 'Standard issuance event',
    hasOpenQuestions: false,
    actors: { Judge: true, Caseworker: false },
  };

  it('EV-1: accepts a valid event with actors as Record<string, boolean>', () => {
    const result = EventSchema.safeParse(validEvent);
    assert.ok(result.success, `Valid event rejected: ${JSON.stringify(result.error?.issues)}`);
  });

  it('EV-2: hasOpenQuestions is a required boolean', () => {
    const missing = { ...validEvent };
    delete missing.hasOpenQuestions;
    const result = EventSchema.safeParse(missing);
    assert.equal(result.success, false, 'Missing hasOpenQuestions should be rejected');
  });

  it('EV-3: notes is a required string field', () => {
    const missing = { ...validEvent };
    delete missing.notes;
    const result = EventSchema.safeParse(missing);
    assert.equal(result.success, false, 'Missing notes should be rejected');
  });

  it('EV-4: actors must be a record of string to boolean, not arbitrary values', () => {
    const badActors = { ...validEvent, actors: { Judge: 'yes' } };
    const result = EventSchema.safeParse(badActors);
    assert.equal(result.success, false, 'Non-boolean actor value should be rejected');
  });

  it('EV-5: survives JSON round-trip without data loss', () => {
    const result = EventSchema.parse(validEvent);
    const roundTripped = JSON.parse(JSON.stringify(result));
    assert.deepStrictEqual(roundTripped, result);
  });
});

// ── 5. Role type — KNOWN_ROLES constant ──────────────────────────────

describe('Role type', () => {
  it('RO-1: KNOWN_ROLES is exported and is a non-empty array', () => {
    assert.ok(Array.isArray(KNOWN_ROLES), 'KNOWN_ROLES must be an array');
    assert.ok(KNOWN_ROLES.length > 0, 'KNOWN_ROLES must not be empty');
  });

  it('RO-2: KNOWN_ROLES contains only strings', () => {
    for (const role of KNOWN_ROLES) {
      assert.equal(typeof role, 'string', `Role ${role} must be a string`);
    }
  });

  it('RO-3: KNOWN_ROLES includes commonly referenced roles', () => {
    const expected = ['Judge', 'Caseworker', 'Claimant', 'Defendant'];
    for (const role of expected) {
      assert.ok(
        KNOWN_ROLES.some((r) => r.toLowerCase() === role.toLowerCase()),
        `KNOWN_ROLES should include ${role} (case-insensitive)`
      );
    }
  });
});

// ── 6. Zod schema validation — reject malformed data ─────────────────

describe('Zod schema validation — rejection cases', () => {
  it('ZR-1: State rejects missing id', () => {
    const result = StateSchema.safeParse({
      technicalName: 'X',
      uiLabel: 'X',
      claimType: 'MAIN_CLAIM_ENGLAND',
      isDraftLike: false,
      isLive: false,
      isEndState: false,
      completeness: 0,
    });
    assert.equal(result.success, false);
  });

  it('ZR-2: State rejects non-numeric completeness', () => {
    const result = StateSchema.safeParse({
      id: 'x:y',
      technicalName: 'Y',
      uiLabel: 'Y',
      claimType: 'MAIN_CLAIM_ENGLAND',
      isDraftLike: false,
      isLive: false,
      isEndState: false,
      completeness: 'high',
    });
    assert.equal(result.success, false);
  });

  it('ZR-3: Transition rejects missing from field', () => {
    const result = TransitionSchema.safeParse({
      to: 'x:y',
      condition: null,
      isSystemTriggered: false,
      isTimeBased: false,
    });
    assert.equal(result.success, false);
  });

  it('ZR-4: Transition rejects missing to field', () => {
    const result = TransitionSchema.safeParse({
      from: 'x:y',
      condition: null,
      isSystemTriggered: false,
      isTimeBased: false,
    });
    assert.equal(result.success, false);
  });

  it('ZR-5: Event rejects missing name', () => {
    const result = EventSchema.safeParse({
      id: 'e1',
      claimType: 'MAIN_CLAIM_ENGLAND',
      state: 'x:y',
      isSystemEvent: false,
      notes: '',
      hasOpenQuestions: false,
      actors: {},
    });
    assert.equal(result.success, false);
  });

  it('ZR-6: Event rejects missing actors field', () => {
    const result = EventSchema.safeParse({
      id: 'e1',
      name: 'Test',
      claimType: 'MAIN_CLAIM_ENGLAND',
      state: 'x:y',
      isSystemEvent: false,
      notes: '',
      hasOpenQuestions: false,
    });
    assert.equal(result.success, false);
  });

  it('ZR-7: ClaimType schema rejects missing description', () => {
    const result = ClaimTypeSchema.safeParse({
      id: 'MAIN_CLAIM_ENGLAND',
      name: 'Main Claim (England)',
    });
    assert.equal(result.success, false);
  });

  it('ZR-8: ClaimType schema accepts valid claim type', () => {
    const result = ClaimTypeSchema.safeParse({
      id: 'MAIN_CLAIM_ENGLAND',
      name: 'Main Claim (England)',
      description: 'Standard possession claim for England',
    });
    assert.ok(result.success, `Valid ClaimType rejected: ${JSON.stringify(result.error?.issues)}`);
  });
});

// ── 7. Zustand store skeleton ────────────────────────────────────────

describe('Zustand store skeleton', () => {
  it('SS-1: createPossessionsStore is a callable function', () => {
    assert.equal(typeof createPossessionsStore, 'function');
  });

  it('SS-2: store initialises with empty collections for each domain concept', () => {
    const store = createPossessionsStore();
    const state = store.getState();

    assert.ok(Array.isArray(state.claimTypes), 'claimTypes should be an array');
    assert.equal(state.claimTypes.length, 0, 'claimTypes should start empty');

    assert.ok(Array.isArray(state.states), 'states should be an array');
    assert.equal(state.states.length, 0, 'states should start empty');

    assert.ok(Array.isArray(state.transitions), 'transitions should be an array');
    assert.equal(state.transitions.length, 0, 'transitions should start empty');

    assert.ok(Array.isArray(state.events), 'events should be an array');
    assert.equal(state.events.length, 0, 'events should start empty');
  });

  it('SS-3: store has activeClaimType initialised to null', () => {
    const store = createPossessionsStore();
    const state = store.getState();
    assert.equal(state.activeClaimType, null, 'activeClaimType should start as null');
  });
});
