/**
 * Tests for app/api/reference-data/route.ts
 *
 * Mocking strategy: `mock.module()` replaces src/ref-data/blob-client.js before
 * the route is imported. Each test group resets the mock state via a shared
 * `blobMock` object. Route handlers are called directly with plain Web API
 * Request objects — no Next.js server required.
 *
 * Tests will fail to import until Codey creates the route file (contract-first).
 */

import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

// ── Mock state shared between mock factory and tests ────────────────────────

/**
 * Controls what the mocked blob-client functions do on each call.
 * Tests configure this before calling the route handler.
 */
const blobMock = {
  readResult: null,       // null → resolves with VALID_BLOB; object → resolves with that; Error → throws
  writeError: null,       // null → resolves; Error → throws
  writeCallArgs: null,    // captured argument passed to writeReferenceData
  writeCallCount: 0,
};

function resetBlobMock() {
  blobMock.readResult = null;
  blobMock.writeError = null;
  blobMock.writeCallArgs = null;
  blobMock.writeCallCount = 0;
}

// ── Test fixtures ────────────────────────────────────────────────────────────

const VALID_BLOB = {
  states: [{ id: 's1', name: 'State One', description: 'desc' }],
  events: [{ id: 'e1', name: 'Event One', description: 'desc' }],
  waTasks: [{ id: 'wt1', triggerDescription: 'T', taskName: 'N', taskContext: 'claim', alignment: 'aligned' }],
  personas: [{ id: 'p1', roles: ['Caseworker'], isCrossCutting: false }],
  stateEventAssocs: [{ stateId: 's1', eventId: 'e1' }],
  eventTaskAssocs: [{ eventId: 'e1', waTaskId: 'wt1', alignmentNotes: '' }],
  personaStateAssocs: [{ personaId: 'p1', stateId: 's1' }],
  personaEventAssocs: [{ personaId: 'p1', eventId: 'e1' }],
  personaTaskAssocs: [{ personaId: 'p1', waTaskId: 'wt1' }],
};

const EMPTY_SEED = {
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

// ── Mock blob-client before importing the route ──────────────────────────────

await mock.module('../src/ref-data/blob-client.js', {
  namedExports: {
    readReferenceData: async () => {
      const r = blobMock.readResult;
      if (r instanceof Error) throw r;
      return r ?? VALID_BLOB;
    },
    writeReferenceData: async (data) => {
      blobMock.writeCallCount += 1;
      blobMock.writeCallArgs = data;
      if (blobMock.writeError instanceof Error) throw blobMock.writeError;
    },
  },
});

// ── Import route under test (after mock is registered) ───────────────────────
// This import will fail until Codey creates app/api/reference-data/route.ts

import { GET, PUT } from '../app/api/reference-data/route.js';

// ── Request helpers ──────────────────────────────────────────────────────────

function makeGetRequest() {
  return new Request('http://localhost/api/reference-data');
}

function makePutRequest(body) {
  return new Request('http://localhost/api/reference-data', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeRawPutRequest(rawBody, contentType = 'application/json') {
  return new Request('http://localhost/api/reference-data', {
    method: 'PUT',
    body: rawBody,
    headers: { 'Content-Type': contentType },
  });
}

// ── GET — happy path ─────────────────────────────────────────────────────────

describe('GET /api/reference-data — happy path', () => {
  before(resetBlobMock);
  after(resetBlobMock);

  it('G-1: returns status 200 when readReferenceData resolves', async () => {
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 200, 'status must be 200');
  });

  it('G-2: response body is valid JSON', async () => {
    const response = await GET(makeGetRequest());
    const text = await response.text();
    assert.doesNotThrow(() => JSON.parse(text), 'body must be parseable JSON');
  });

  it('G-3: response body matches the data returned by readReferenceData', async () => {
    const response = await GET(makeGetRequest());
    const body = await response.json();
    assert.deepEqual(body, VALID_BLOB, 'body must equal the blob returned by readReferenceData');
  });

  it('G-4: Content-Type header contains application/json', async () => {
    const response = await GET(makeGetRequest());
    const contentType = response.headers.get('content-type') ?? '';
    assert.ok(
      contentType.includes('application/json'),
      `Content-Type must include "application/json", got: "${contentType}"`,
    );
  });
});

// ── GET — EMPTY_SEED is transparent ─────────────────────────────────────────

describe('GET /api/reference-data — EMPTY_SEED pass-through', () => {
  before(() => {
    resetBlobMock();
    blobMock.readResult = EMPTY_SEED;
  });
  after(resetBlobMock);

  it('G-5: returns 200 and passes EMPTY_SEED through unchanged', async () => {
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 200, 'status must be 200 for empty seed');
    const body = await response.json();
    assert.deepEqual(body, EMPTY_SEED, 'EMPTY_SEED must be returned as-is');
  });
});

// ── GET — error path ─────────────────────────────────────────────────────────

describe('GET /api/reference-data — storage error', () => {
  before(() => {
    resetBlobMock();
    blobMock.readResult = new Error('Azure storage unavailable');
  });
  after(resetBlobMock);

  it('G-6: returns status 500 when readReferenceData throws', async () => {
    const response = await GET(makeGetRequest());
    assert.equal(response.status, 500, 'status must be 500');
  });

  it('G-7: error body is { error: string } containing the error message', async () => {
    const response = await GET(makeGetRequest());
    const body = await response.json();
    assert.ok(
      body !== null && typeof body === 'object',
      'body must be an object',
    );
    assert.ok(
      typeof body.error === 'string' && body.error.length > 0,
      'body.error must be a non-empty string',
    );
    assert.ok(
      body.error.includes('Azure storage unavailable'),
      `body.error should contain the thrown message, got: "${body.error}"`,
    );
  });
});

// ── PUT — happy path ─────────────────────────────────────────────────────────

describe('PUT /api/reference-data — valid body', () => {
  before(resetBlobMock);
  after(resetBlobMock);

  it('P-1: returns status 204 when body is valid and writeReferenceData succeeds', async () => {
    const response = await PUT(makePutRequest(VALID_BLOB));
    assert.equal(response.status, 204, 'status must be 204 No Content');
  });

  it('P-2: response has no meaningful body (null or empty)', async () => {
    const response = await PUT(makePutRequest(VALID_BLOB));
    // 204 must not carry a body — body should be null or an empty readable
    const text = await response.text();
    assert.ok(
      response.body === null || text === '' || text === undefined,
      `204 response must not carry a body, got: "${text}"`,
    );
  });

  it('P-3: writeReferenceData is called with the parsed request body', async () => {
    resetBlobMock();
    await PUT(makePutRequest(VALID_BLOB));
    assert.equal(blobMock.writeCallCount, 1, 'writeReferenceData must be called exactly once');
    assert.deepEqual(blobMock.writeCallArgs, VALID_BLOB, 'writeReferenceData must receive the parsed body');
  });
});

// ── PUT — validation failure ─────────────────────────────────────────────────

describe('PUT /api/reference-data — schema validation failure', () => {
  before(resetBlobMock);
  after(resetBlobMock);

  it('P-4: returns status 400 when body is missing required fields', async () => {
    const invalid = { states: 'not-an-array' }; // fails ReferenceDataBlobSchema
    const response = await PUT(makePutRequest(invalid));
    assert.equal(response.status, 400, 'status must be 400 Bad Request');
  });

  it('P-5: 400 response body is { error: string }', async () => {
    const invalid = { states: 'not-an-array' };
    const response = await PUT(makePutRequest(invalid));
    const body = await response.json();
    assert.ok(
      body !== null && typeof body === 'object',
      'body must be an object',
    );
    assert.ok(
      typeof body.error === 'string' && body.error.length > 0,
      'body.error must be a non-empty string describing the validation failure',
    );
  });

  it('P-6: writeReferenceData is NOT called when validation fails', async () => {
    resetBlobMock();
    const invalid = { states: 'not-an-array' };
    await PUT(makePutRequest(invalid));
    assert.equal(
      blobMock.writeCallCount,
      0,
      'writeReferenceData must not be called when validation fails',
    );
  });

  it('P-4b: returns 400 when body is an empty object (all required fields missing)', async () => {
    const response = await PUT(makePutRequest({}));
    assert.equal(response.status, 400, 'empty object must fail schema validation with 400');
  });
});

// ── PUT — write error ────────────────────────────────────────────────────────

describe('PUT /api/reference-data — writeReferenceData throws', () => {
  before(() => {
    resetBlobMock();
    blobMock.writeError = new Error('Blob storage write failed');
  });
  after(resetBlobMock);

  it('P-7: returns status 500 when writeReferenceData throws', async () => {
    const response = await PUT(makePutRequest(VALID_BLOB));
    assert.equal(response.status, 500, 'status must be 500 Internal Server Error');
  });

  it('P-8: 500 response body is { error: string } containing the error message', async () => {
    const response = await PUT(makePutRequest(VALID_BLOB));
    const body = await response.json();
    assert.ok(
      body !== null && typeof body === 'object',
      'body must be an object',
    );
    assert.ok(
      typeof body.error === 'string' && body.error.length > 0,
      'body.error must be a non-empty string',
    );
    assert.ok(
      body.error.includes('Blob storage write failed'),
      `body.error should contain the thrown message, got: "${body.error}"`,
    );
  });
});

// ── PUT — unparseable JSON body (ambiguous — see A1 in test-spec.md) ─────────

describe('PUT /api/reference-data — unparseable JSON body', () => {
  before(resetBlobMock);
  after(resetBlobMock);

  it('P-9: returns 400 or 500 when body is not valid JSON (AMBIGUOUS — see spec A1)', async () => {
    // AMBIGUOUS: spec does not define whether request.json() parse failure
    // produces a 400 (if caught by route) or 500 (if not). Either is acceptable.
    // This test documents the observable behaviour and prevents silent success (2xx).
    const response = await PUT(makeRawPutRequest('{ not valid json }'));
    assert.ok(
      response.status === 400 || response.status === 500,
      `status must be 400 or 500 for unparseable body, got: ${response.status}`,
    );
    // Body must still be JSON with an error field
    const body = await response.json();
    assert.ok(
      typeof body.error === 'string' && body.error.length > 0,
      'error response body must be { error: string }',
    );
  });
});
