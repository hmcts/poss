/**
 * Tests for ref-data-transitions-editor feature.
 * T-TR1 through T-TR7.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  RefTransitionSchema,
  ReferenceDataBlobSchema,
} from '../src/ref-data/index.js';

import {
  transitionsFromIngested,
} from '../src/ref-data/seed.js';

import {
  pickTransitionsForClaim,
} from '../src/ref-data/adapter.js';

// Minimal valid blob (without transitions, for augmentation)
function minimalBlob(overrides = {}) {
  return {
    states: [],
    events: [],
    waTasks: [],
    personas: [],
    stateEventAssocs: [],
    eventTaskAssocs: [],
    personaStateAssocs: [],
    personaEventAssocs: [],
    personaTaskAssocs: [],
    transitions: [],
    ...overrides,
  };
}

const validTransition = {
  id: 'tr-1',
  fromStateId: 'mce-draft',
  toStateId: 'mce-submitted',
  condition: 'Claimant submits',
  isSystemTriggered: false,
  isTimeBased: false,
};

// ── T-TR1 ────────────────────────────────────────────────────────────────────

describe('T-TR1: RefTransitionSchema parses a valid transition object', () => {
  test('parses valid transition', () => {
    const result = RefTransitionSchema.safeParse(validTransition);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.id, 'tr-1');
      assert.equal(result.data.fromStateId, 'mce-draft');
      assert.equal(result.data.toStateId, 'mce-submitted');
      assert.equal(result.data.condition, 'Claimant submits');
      assert.equal(result.data.isSystemTriggered, false);
      assert.equal(result.data.isTimeBased, false);
    }
  });
});

// ── T-TR2 ────────────────────────────────────────────────────────────────────

describe('T-TR2: RefTransitionSchema fails parse on missing required fields', () => {
  test('rejects object with only id', () => {
    const result = RefTransitionSchema.safeParse({ id: 'tr-1' });
    assert.equal(result.success, false);
  });

  test('rejects empty object', () => {
    const result = RefTransitionSchema.safeParse({});
    assert.equal(result.success, false);
  });
});

// ── T-TR3 ────────────────────────────────────────────────────────────────────

describe('T-TR3: ReferenceDataBlobSchema accepts blob with transitions populated', () => {
  test('parses blob with one transition', () => {
    const blob = minimalBlob({ transitions: [validTransition] });
    const result = ReferenceDataBlobSchema.safeParse(blob);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.transitions.length, 1);
      assert.equal(result.data.transitions[0].id, 'tr-1');
    }
  });
});

// ── T-TR4 ────────────────────────────────────────────────────────────────────

describe('T-TR4: ReferenceDataBlobSchema accepts blob with empty transitions', () => {
  test('parses blob with empty transitions array', () => {
    const blob = minimalBlob({ transitions: [] });
    const result = ReferenceDataBlobSchema.safeParse(blob);
    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data.transitions, []);
    }
  });

  test('default transitions is [] when field omitted', () => {
    const blobWithoutTransitions = {
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
    const result = ReferenceDataBlobSchema.safeParse(blobWithoutTransitions);
    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data.transitions, []);
    }
  });
});

// ── T-TR5 ────────────────────────────────────────────────────────────────────

describe('T-TR5: transitionsFromIngested returns correct RefTransition[]', () => {
  test('converts ingested transitions to RefTransition[]', () => {
    const ingestedStateData = {
      states: [
        { id: 'mce-draft', technicalName: 'DRAFT', uiLabel: 'Draft', claimType: 'MAIN_CLAIM_ENGLAND' },
        { id: 'mce-submitted', technicalName: 'SUBMITTED', uiLabel: 'Submitted', claimType: 'MAIN_CLAIM_ENGLAND' },
      ],
      transitions: [
        {
          from: 'mce-draft',
          to: 'mce-submitted',
          condition: 'Claimant submits',
          isSystemTriggered: false,
          isTimeBased: false,
        },
        {
          from: 'mce-submitted',
          to: 'mce-with-judge',
          condition: 'Refer to judge',
          isSystemTriggered: false,
          isTimeBased: false,
        },
      ],
    };

    const result = transitionsFromIngested(ingestedStateData);
    assert.equal(result.length, 2);

    const first = result[0];
    assert.equal(first.fromStateId, 'mce-draft');
    assert.equal(first.toStateId, 'mce-submitted');
    assert.equal(first.condition, 'Claimant submits');
    assert.equal(first.isSystemTriggered, false);
    assert.equal(first.isTimeBased, false);
    assert.ok(typeof first.id === 'string' && first.id.length > 0, 'id should be non-empty string');

    const second = result[1];
    assert.equal(second.fromStateId, 'mce-submitted');
    assert.equal(second.toStateId, 'mce-with-judge');
    assert.equal(second.condition, 'Refer to judge');
  });

  test('sets isSystemTriggered and isTimeBased from source', () => {
    const data = {
      states: [],
      transitions: [
        { from: 'a', to: 'b', condition: 'auto', isSystemTriggered: true, isTimeBased: true },
      ],
    };
    const result = transitionsFromIngested(data);
    assert.equal(result[0].isSystemTriggered, true);
    assert.equal(result[0].isTimeBased, true);
  });
});

// ── T-TR6 ────────────────────────────────────────────────────────────────────

describe('T-TR6: transitionsFromIngested returns [] for empty/missing transitions', () => {
  test('returns [] for empty array input', () => {
    const result = transitionsFromIngested([]);
    assert.deepEqual(result, []);
  });

  test('returns [] for input with no transitions', () => {
    const result = transitionsFromIngested({ states: [], transitions: [] });
    assert.deepEqual(result, []);
  });

  test('returns [] for input with missing transitions field', () => {
    const result = transitionsFromIngested({ states: [] });
    assert.deepEqual(result, []);
  });

  test('returns [] for null/undefined input', () => {
    assert.deepEqual(transitionsFromIngested(null), []);
    assert.deepEqual(transitionsFromIngested(undefined), []);
  });
});

// ── T-TR7 ────────────────────────────────────────────────────────────────────

describe('T-TR7: pickTransitionsForClaim returns blob transitions when non-empty, falls back to ingested', () => {
  test('returns blob transitions when blob.transitions is non-empty', () => {
    const blobTransitions = [validTransition];
    const ingestedTransitions = [
      { ...validTransition, id: 'ingested-1', condition: 'from ingested' },
    ];
    const blob = minimalBlob({ transitions: blobTransitions });

    const result = pickTransitionsForClaim(blob, ingestedTransitions);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'tr-1');
    assert.equal(result[0].condition, 'Claimant submits');
  });

  test('falls back to ingestedTransitions when blob.transitions is empty', () => {
    const ingestedTransitions = [
      { ...validTransition, id: 'ingested-1', condition: 'from ingested' },
    ];
    const blob = minimalBlob({ transitions: [] });

    const result = pickTransitionsForClaim(blob, ingestedTransitions);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'ingested-1');
    assert.equal(result[0].condition, 'from ingested');
  });

  test('falls back to ingestedTransitions when blob is null', () => {
    const ingestedTransitions = [validTransition];
    const result = pickTransitionsForClaim(null, ingestedTransitions);
    assert.deepEqual(result, ingestedTransitions);
  });

  test('returns [] when both blob transitions and ingested are empty', () => {
    const blob = minimalBlob({ transitions: [] });
    const result = pickTransitionsForClaim(blob, []);
    assert.deepEqual(result, []);
  });
});
