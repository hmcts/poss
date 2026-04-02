/**
 * Tests for feature: ref-data-app-context
 *
 * Runnable: node --test test/feature_ref-data-app-context.test.js
 *
 * What is tested here:
 *   T-C1  Schema conformance — API GET response matches ReferenceDataBlobSchema
 *   T-C2  Empty seed — GET returns 200 + EMPTY_SEED (not a 4xx)
 *   T-C3  Error path — GET returns 500 + { error: string } when storage throws
 *   T-C4  AppContext smoke — providers module exports AppContext
 *   T-C5  (SKIPPED) Initial state values — needs React Testing Library
 *   T-C6  (SKIPPED) Loading state transitions — needs React Testing Library
 *   T-C7  (SKIPPED) Fetch failure sets refDataError — needs React Testing Library
 *   T-C8  (SKIPPED) reloadRefData() resets error + loading — needs React Testing Library
 *   T-C9  (BLOCKED) Story-04 blob→modelData — blocked on ref-data-blob-adapter feature
 */

import { suite, test, mock, before, after } from 'node:test';
import assert from 'node:assert/strict';

// ── Shared fixtures ──────────────────────────────────────────────────────────

const VALID_BLOB = {
  states:            [{ id: 's1', name: 'State One', description: 'desc', claimType: 'MAIN_CLAIM_ENGLAND' }],
  events:            [{ id: 'e1', name: 'Event One', description: 'desc' }],
  waTasks:           [{ id: 'wt1', triggerDescription: 'T', taskName: 'N', taskContext: 'claim', alignment: 'aligned' }],
  personas:          [{ id: 'p1', roles: ['Caseworker'], isCrossCutting: false }],
  stateEventAssocs:  [{ stateId: 's1', eventId: 'e1' }],
  eventTaskAssocs:   [{ eventId: 'e1', waTaskId: 'wt1', alignmentNotes: '' }],
  personaStateAssocs:[{ personaId: 'p1', stateId: 's1' }],
  personaEventAssocs:[{ personaId: 'p1', eventId: 'e1' }],
  personaTaskAssocs: [{ personaId: 'p1', waTaskId: 'wt1' }],
};

const EMPTY_SEED = {
  states: [], events: [], waTasks: [], personas: [],
  stateEventAssocs: [], eventTaskAssocs: [],
  personaStateAssocs: [], personaEventAssocs: [], personaTaskAssocs: [],
};

// ── Mock blob-client before importing the route ──────────────────────────────

const blobMock = { readResult: null };

function resetBlobMock() { blobMock.readResult = null; }

await mock.module('../src/ref-data/blob-client.js', {
  namedExports: {
    readReferenceData: async () => {
      const r = blobMock.readResult;
      if (r instanceof Error) throw r;
      return r ?? VALID_BLOB;
    },
    writeReferenceData: async () => {},
  },
});

// Import route after mock is registered.
// Will fail until Codey creates app/api/reference-data/route.ts (contract-first).
let GET;
try {
  const routeModule = await import('../app/api/reference-data/route.js');
  GET = routeModule.GET;
} catch {
  GET = null;
}

// ── Schema import ────────────────────────────────────────────────────────────

let ReferenceDataBlobSchema;
try {
  const schemaModule = await import('../src/ref-data/index.js');
  ReferenceDataBlobSchema = schemaModule.ReferenceDataBlobSchema;
} catch {
  ReferenceDataBlobSchema = null;
}

function makeGetRequest() {
  return new Request('http://localhost/api/reference-data');
}

// ── Suite: API route schema conformance ─────────────────────────────────────

suite('API route: GET /api/reference-data — schema conformance', () => {
  before(resetBlobMock);
  after(resetBlobMock);

  // T-C1
  test('T-C1: response body conforms to ReferenceDataBlobSchema for a valid blob', async () => {
    assert.ok(GET, 'app/api/reference-data/route.ts must export GET — create it first');
    assert.ok(ReferenceDataBlobSchema, 'ReferenceDataBlobSchema must be exported from src/ref-data/index.js');
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.doesNotThrow(() => ReferenceDataBlobSchema.parse(body), 'response body must conform to ReferenceDataBlobSchema');
  });

  // T-C2
  test('T-C2: returns 200 + EMPTY_SEED when readReferenceData returns empty seed', async () => {
    assert.ok(GET, 'app/api/reference-data/route.ts must export GET — create it first');
    blobMock.readResult = EMPTY_SEED;
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 200, 'must return 200 for empty seed — not 4xx or 5xx');
    const body = await response.json();
    assert.deepEqual(body, EMPTY_SEED, 'body must equal EMPTY_SEED');
    if (ReferenceDataBlobSchema) {
      assert.doesNotThrow(() => ReferenceDataBlobSchema.parse(body), 'empty seed must conform to schema');
    }
  });

  // T-C3
  test('T-C3: returns 500 + { error: string } when readReferenceData throws', async () => {
    assert.ok(GET, 'app/api/reference-data/route.ts must export GET — create it first');
    blobMock.readResult = new Error('Azure storage unavailable');
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 500, 'must return 500 on storage error');
    const body = await response.json();
    assert.ok(body !== null && typeof body === 'object', 'body must be an object');
    assert.ok(typeof body.error === 'string' && body.error.length > 0, 'body.error must be a non-empty string');
  });
});

// ── Suite: AppContext shape ──────────────────────────────────────────────────

suite('AppContext shape', () => {
  // T-C4
  test('T-C4: providers module exports AppContext', async () => {
    let providersModule = null;
    try {
      providersModule = await import('../app/providers.js');
    } catch {
      // File may not exist yet — fail with a clear message
    }
    assert.ok(providersModule !== null, 'app/providers.tsx must exist and be importable as app/providers.js');
    assert.ok(
      providersModule.AppContext !== undefined,
      'app/providers.tsx must export AppContext',
    );
  });

  // T-C5 — SKIPPED: needs React Testing Library
  test('T-C5: AppContext initial state has refData=null, refDataLoading=false, refDataError=null', {
    skip: 'Requires React Testing Library — cannot render React context in node:test',
  }, async () => {
    // Render <AppProvider> and read context values via a consumer.
    // Assert: refData === null, refDataLoading === false, refDataError === null.
  });

  // T-C6 — SKIPPED: needs React Testing Library
  test('T-C6: refDataLoading transitions false→true→false across successful fetch lifecycle', {
    skip: 'Requires React Testing Library — fetch + state transition testing not possible in node:test',
  }, async () => {
    // Mock fetch to return VALID_BLOB.
    // Render <AppProvider>; assert loading=true mid-flight, false after resolution.
  });

  // T-C7 — SKIPPED: needs React Testing Library
  test('T-C7: fetch failure sets refDataError to non-empty string, refDataLoading=false, no throw', {
    skip: 'Requires React Testing Library — fetch mock inside React lifecycle not testable in node:test',
  }, async () => {
    // Mock fetch to reject.
    // Render <AppProvider>; assert refDataError is non-empty, refDataLoading=false.
    // Assert app does not throw.
  });

  // T-C8 — SKIPPED: needs React Testing Library
  test('T-C8: reloadRefData() resets refDataError to null and refDataLoading to true before re-fetching', {
    skip: 'Requires React Testing Library — stateful React hook interaction not testable in node:test',
  }, async () => {
    // Render <AppProvider> in error state.
    // Call reloadRefData(); assert refDataError=null, refDataLoading=true.
    // Await fetch completion; assert refDataLoading=false, refData set.
  });
});

// ── BLOCKED: Story-04 — ref-data-blob-adapter dependency ────────────────────

suite('Story-04: blob events → modelData (BLOCKED)', () => {
  // T-C9 — BLOCKED: depends on ref-data-blob-adapter feature (blobToEvents function)
  test('T-C9: modelData.events populated from blob after fetch; re-derived on claim type change', {
    skip: 'BLOCKED — depends on ref-data-blob-adapter feature (blobToEvents). Do not implement until that feature is merged.',
  }, async () => {
    // Stub blobToEvents to return a known event array.
    // Render <AppProvider>; mock fetch to return VALID_BLOB.
    // Assert modelData.events equals stubbed result.
    // Simulate setClaimType(); assert blobToEvents called with new claim type.
    // Simulate fetch failure; assert modelData.events remains [].
  });
});
