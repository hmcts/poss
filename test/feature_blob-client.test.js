/**
 * Tests for src/ref-data/blob-client.ts
 *
 * Mocking strategy: `mock.module()` (Node 22+ built-in) replaces
 * `@azure/storage-blob` entirely. The SDK is NOT installed — all Azure calls
 * go through the mock. Each test group configures its own mock behaviour via
 * the shared `mockState` object that the factory closure captures.
 *
 * Blob-client resolves env vars at call time, so tests mutate `process.env`
 * directly and restore it in `after()` / `afterEach` equivalent cleanup.
 */

import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

// ── Mock state shared between mock factory and tests ────────────────────────

/**
 * Controls what the mocked Azure SDK methods return or throw on each call.
 * Tests configure this before calling the module under test.
 */
const mockState = {
  downloadResult: null,  // null → return valid JSON string; string → return that; Error → throw
  uploadError: null,     // null → resolve; Error → throw
  lastUploadArgs: null,  // captured: { content, length, options }
  lastContainerName: null,
  lastBlobName: null,
};

function resetMockState() {
  mockState.downloadResult = null;
  mockState.uploadError = null;
  mockState.lastUploadArgs = null;
  mockState.lastContainerName = null;
  mockState.lastBlobName = null;
}

// ── Minimal valid ReferenceDataBlob JSON ─────────────────────────────────────

const VALID_BLOB_CONTENT = JSON.stringify({
  states: [{ id: 's1', name: 'State One', description: 'desc' }],
  events: [{ id: 'e1', name: 'Event One', description: 'desc' }],
  waTasks: [],
  personas: [{ id: 'p1', roles: ['Caseworker'], isCrossCutting: false }],
  stateEventAssocs: [{ stateId: 's1', eventId: 'e1' }],
  eventTaskAssocs: [],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
});

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

// ── Helper: turn a string into a Node Readable stream ────────────────────────

import { Readable } from 'node:stream';

function stringToReadable(str) {
  const readable = new Readable();
  readable.push(str);
  readable.push(null);
  return readable;
}

// ── Mock @azure/storage-blob before any import of blob-client ────────────────

await mock.module('@azure/storage-blob', {
  namedExports: {
    BlobServiceClient: {
      fromConnectionString: (_connStr) => ({
        getContainerClient: (containerName) => {
          mockState.lastContainerName = containerName;
          return {
            getBlockBlobClient: (blobName) => {
              mockState.lastBlobName = blobName;
              return {
                download: async () => {
                  if (mockState.downloadResult instanceof Error) {
                    throw mockState.downloadResult;
                  }
                  const content = mockState.downloadResult ?? VALID_BLOB_CONTENT;
                  return {
                    readableStreamBody: stringToReadable(content),
                  };
                },
                upload: async (content, length, options) => {
                  if (mockState.uploadError instanceof Error) {
                    throw mockState.uploadError;
                  }
                  mockState.lastUploadArgs = { content, length, options };
                },
              };
            },
          };
        },
      }),
    },
  },
});

// ── Import module under test (after mock is registered) ──────────────────────
// This import will fail until Codey creates the file — intentional contract-first.

import {
  readReferenceData,
  writeReferenceData,
} from '../src/ref-data/blob-client.js';

// ── Env var helpers ──────────────────────────────────────────────────────────

const CONN_STR = 'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';

function setEnv({ connStr = CONN_STR, container = undefined } = {}) {
  if (connStr !== undefined) {
    process.env.AZURE_STORAGE_CONNECTION_STRING = connStr;
  } else {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;
  }

  if (container !== undefined) {
    process.env.AZURE_STORAGE_CONTAINER = container;
  } else {
    delete process.env.AZURE_STORAGE_CONTAINER;
  }
}

function clearEnv() {
  delete process.env.AZURE_STORAGE_CONNECTION_STRING;
  delete process.env.AZURE_STORAGE_CONTAINER;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('readReferenceData — happy path', () => {
  before(() => {
    setEnv();
    resetMockState();
    // mockState.downloadResult = null → mock returns VALID_BLOB_CONTENT
  });

  after(clearEnv);

  it('R-1: downloads blob, parses JSON, and returns a typed object', async () => {
    const result = await readReferenceData();
    assert.ok(result !== null && typeof result === 'object', 'should return an object');
  });

  it('R-2: returned object has all 9 expected array keys', async () => {
    const result = await readReferenceData();
    const expectedKeys = [
      'states', 'events', 'waTasks', 'personas',
      'stateEventAssocs', 'eventTaskAssocs',
      'personaStateAssocs', 'personaEventAssocs', 'personaTaskAssocs',
    ];
    for (const key of expectedKeys) {
      assert.ok(key in result, `Missing key: ${key}`);
      assert.ok(Array.isArray(result[key]), `${key} should be an array`);
    }
  });
});

describe('readReferenceData — cold start (blob not found)', () => {
  before(() => {
    setEnv();
    resetMockState();
  });

  after(() => {
    clearEnv();
    resetMockState();
  });

  it('R-3: BlobNotFound (404) → returns empty seed, does not throw', async () => {
    const err = Object.assign(new Error('BlobNotFound'), { statusCode: 404, code: 'BlobNotFound' });
    mockState.downloadResult = err;

    const result = await readReferenceData();
    assert.deepEqual(result, EMPTY_SEED, 'should return empty seed matching expected shape');
  });

  it('R-4: ContainerNotFound (404) → returns empty seed, does not throw', async () => {
    const err = Object.assign(new Error('ContainerNotFound'), { statusCode: 404, code: 'ContainerNotFound' });
    mockState.downloadResult = err;

    const result = await readReferenceData();
    assert.deepEqual(result, EMPTY_SEED, 'should return empty seed for ContainerNotFound');
  });

  it('R-5: empty seed shape passes ReferenceDataBlobSchema.parse (valid Zod type)', async () => {
    const err = Object.assign(new Error('BlobNotFound'), { statusCode: 404, code: 'BlobNotFound' });
    mockState.downloadResult = err;

    const { ReferenceDataBlobSchema } = await import('../src/ref-data/index.js');
    const result = await readReferenceData();

    // Must not throw — if shape is wrong, Zod will throw here
    assert.doesNotThrow(() => ReferenceDataBlobSchema.parse(result), 'empty seed must satisfy ReferenceDataBlobSchema');
  });
});

describe('readReferenceData — schema validation', () => {
  before(() => {
    setEnv();
    resetMockState();
  });

  after(() => {
    clearEnv();
    resetMockState();
  });

  it('R-6: downloaded JSON that fails Zod schema → throws with ZodError or descriptive error', async () => {
    // Missing required fields — not a valid ReferenceDataBlob
    mockState.downloadResult = JSON.stringify({ states: 'not-an-array' });

    await assert.rejects(
      () => readReferenceData(),
      (err) => {
        // Accept ZodError by name, or any Error with a meaningful message
        const isZodError = err.name === 'ZodError';
        const hasMessage = typeof err.message === 'string' && err.message.length > 0;
        assert.ok(isZodError || hasMessage, `Expected ZodError or descriptive error, got: ${err}`);
        return true;
      },
      'should throw on schema mismatch',
    );
  });
});

describe('readReferenceData — missing environment variable', () => {
  after(clearEnv);

  it('R-7: AZURE_STORAGE_CONNECTION_STRING not set → throws with descriptive message', async () => {
    clearEnv();

    await assert.rejects(
      () => readReferenceData(),
      (err) => {
        assert.ok(err instanceof Error, 'should throw an Error');
        assert.match(
          err.message,
          /AZURE_STORAGE_CONNECTION_STRING/,
          'error message must mention the missing env var name',
        );
        return true;
      },
      'should throw when connection string env var is absent',
    );
  });
});

describe('readReferenceData — non-404 storage error propagates', () => {
  before(() => {
    setEnv();
    resetMockState();
  });

  after(() => {
    clearEnv();
    resetMockState();
  });

  it('R-8: Azure authentication error (403) → propagates unmodified, does not swallow', async () => {
    const authErr = Object.assign(new Error('AuthenticationFailed'), { statusCode: 403, code: 'AuthenticationFailed' });
    mockState.downloadResult = authErr;

    await assert.rejects(
      () => readReferenceData(),
      (err) => {
        assert.equal(err.message, 'AuthenticationFailed', 'should propagate the original error message');
        return true;
      },
      'non-404 error must propagate',
    );
  });
});

describe('writeReferenceData — happy path', () => {
  before(() => {
    setEnv();
    resetMockState();
  });

  after(() => {
    clearEnv();
    resetMockState();
  });

  it('W-1: serialises data to JSON and passes content to upload', async () => {
    await writeReferenceData(EMPTY_SEED);

    assert.ok(mockState.lastUploadArgs !== null, 'upload should have been called');
    const parsed = JSON.parse(mockState.lastUploadArgs.content);
    assert.deepEqual(parsed, EMPTY_SEED, 'uploaded content should match serialised input');
  });

  it('W-2: calls upload with overwrite: true', async () => {
    await writeReferenceData(EMPTY_SEED);

    assert.ok(mockState.lastUploadArgs !== null, 'upload should have been called');
    assert.equal(
      mockState.lastUploadArgs.options?.overwrite,
      true,
      'overwrite option must be true',
    );
  });

  it('W-3: calls upload with blobContentType "application/json"', async () => {
    await writeReferenceData(EMPTY_SEED);

    assert.ok(mockState.lastUploadArgs !== null, 'upload should have been called');
    assert.equal(
      mockState.lastUploadArgs.options?.blobHTTPHeaders?.blobContentType,
      'application/json',
      'blobContentType must be set to application/json',
    );
  });

  it('W-4: resolves to undefined (returns void)', async () => {
    const result = await writeReferenceData(EMPTY_SEED);
    assert.equal(result, undefined, 'writeReferenceData should resolve to undefined');
  });
});

describe('writeReferenceData — error handling', () => {
  before(() => {
    setEnv();
    resetMockState();
  });

  after(() => {
    clearEnv();
    resetMockState();
  });

  it('W-5: storage upload error propagates unmodified', async () => {
    const storageErr = Object.assign(new Error('InternalServerError'), { statusCode: 500, code: 'InternalServerError' });
    mockState.uploadError = storageErr;

    await assert.rejects(
      () => writeReferenceData(EMPTY_SEED),
      (err) => {
        assert.equal(err.message, 'InternalServerError', 'should propagate original upload error');
        return true;
      },
      'upload errors must not be swallowed',
    );
  });

  it('W-6: AZURE_STORAGE_CONNECTION_STRING not set → throws with descriptive message', async () => {
    clearEnv();

    await assert.rejects(
      () => writeReferenceData(EMPTY_SEED),
      (err) => {
        assert.ok(err instanceof Error, 'should throw an Error');
        assert.match(
          err.message,
          /AZURE_STORAGE_CONNECTION_STRING/,
          'error message must mention the missing env var name',
        );
        return true;
      },
      'should throw when connection string env var is absent',
    );
  });
});

describe('Environment variable handling — container name', () => {
  after(() => {
    clearEnv();
    resetMockState();
  });

  it('E-1: AZURE_STORAGE_CONTAINER not set → getContainerClient called with "reference-data"', async () => {
    setEnv({ container: undefined });
    resetMockState();

    await readReferenceData();

    assert.equal(
      mockState.lastContainerName,
      'reference-data',
      'should default container name to "reference-data"',
    );
  });

  it('E-2: AZURE_STORAGE_CONTAINER set to custom value → getContainerClient called with that value', async () => {
    setEnv({ container: 'my-custom-container' });
    resetMockState();

    await readReferenceData();

    assert.equal(
      mockState.lastContainerName,
      'my-custom-container',
      'should use AZURE_STORAGE_CONTAINER env var value',
    );
  });

  it('E-3: getBlockBlobClient always called with "reference-data.json" (hardcoded blob name)', async () => {
    setEnv();
    resetMockState();

    await readReferenceData();

    assert.equal(
      mockState.lastBlobName,
      'reference-data.json',
      'blob name must be hardcoded to "reference-data.json"',
    );
  });
});
