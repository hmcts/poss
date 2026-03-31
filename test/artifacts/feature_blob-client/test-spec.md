# Test Specification — blob-client

## Understanding

`blob-client.ts` is a thin server-only I/O module that reads and writes a single Azure Blob Storage JSON document (`reference-data.json`) and validates it against `ReferenceDataBlobSchema`. It exports two async functions: `readReferenceData()` and `writeReferenceData(data)`.

The entire `@azure/storage-blob` SDK is mocked at module level using `mock.module()` from `node:test`. The mock chain follows: `BlobServiceClient.fromConnectionString(connStr)` → `.getContainerClient(container)` → `.getBlockBlobClient("reference-data.json")` → `.download()` / `.upload()`.

### Key Behaviours

- **read — happy path:** resolves env vars, downloads blob, parses JSON, validates with Zod, returns typed object
- **read — cold start:** Azure 404 (`BlobNotFound` / `ContainerNotFound`) → returns empty seed (9 empty arrays), does not throw
- **read — schema mismatch:** invalid JSON shape → throws (ZodError or similar)
- **read — missing env var:** no `AZURE_STORAGE_CONNECTION_STRING` → throws with descriptive message
- **write — happy path:** serialises to JSON, calls upload with `overwrite: true` and `content-type: application/json`, resolves void
- **write — storage error:** SDK error propagates unmodified, does not swallow
- **write — missing env var:** same guard as read
- **container name:** defaults to `"reference-data"` if `AZURE_STORAGE_CONTAINER` unset; uses env var when set
- **blob name:** always `"reference-data.json"` (hardcoded — not configurable)

### Ambiguities Noted

1. The spec says schema mismatch "throws ZodError or similar" — test checks `err.name === 'ZodError'` but also accepts any Error with a meaningful message.
2. The cold-start path does not call `ReferenceDataBlobSchema.parse()` on the seed — the returned shape must match the schema but the test cannot observe _how_ it was built.
3. `ContainerNotFound` is listed alongside `BlobNotFound` as a 404 catch — both are tested.
4. `writeReferenceData` does not validate its argument (Rule 3) — no test is written for "write with invalid data" because that is explicitly out of scope for this module.

## AC → Test ID Mapping

| AC | Test ID | Scenario |
|----|---------|----------|
| Read happy path | R-1 | Downloads blob, parses, validates, returns typed data |
| Read happy path | R-2 | Returns all 9 keys, each an array |
| Read cold start (BlobNotFound) | R-3 | Azure 404 BlobNotFound → empty seed, no throw |
| Read cold start (ContainerNotFound) | R-4 | Azure 404 ContainerNotFound → empty seed, no throw |
| Read cold start shape | R-5 | Empty seed passes ReferenceDataBlobSchema.parse |
| Read schema mismatch | R-6 | Downloaded JSON fails Zod → throws |
| Read missing env var | R-7 | No AZURE_STORAGE_CONNECTION_STRING → throws with descriptive message |
| Read non-404 error propagates | R-8 | Azure 500-class error → propagates, does not swallow |
| Write happy path | W-1 | Calls upload with serialised JSON content |
| Write overwrite flag | W-2 | upload called with overwrite: true |
| Write content-type header | W-3 | upload called with blobContentType: "application/json" |
| Write returns void | W-4 | Resolves to undefined |
| Write storage error propagates | W-5 | SDK upload throws → propagates unmodified |
| Write missing env var | W-6 | No AZURE_STORAGE_CONNECTION_STRING → throws with descriptive message |
| Container name default | E-1 | AZURE_STORAGE_CONTAINER unset → getContainerClient called with "reference-data" |
| Container name from env | E-2 | AZURE_STORAGE_CONTAINER set → getContainerClient called with that value |
| Blob name hardcoded | E-3 | getBlockBlobClient always called with "reference-data.json" |

## Assumptions

- `src/ref-data/blob-client.js` bridge file will be created by Codey — imports are contract-first and will fail until then
- `@azure/storage-blob` is not installed; entire module is mocked via `mock.module()`
- `AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_CONTAINER` are manipulated directly on `process.env` in tests and restored after each test
- The Azure SDK error type used for cold-start detection is an object with `statusCode === 404` and `code === "BlobNotFound"` or `"ContainerNotFound"`
- `readReferenceData` downloads blob content as a buffer/stream; tests mock `.download()` to return an object with a `readableStreamBody` property that emits a JSON string
- Alternatively, if the implementation uses `.downloadToBuffer()`, the mock returns a Buffer — tests cover the more common `download()` → stream pattern; the actual contract is "returns parseable JSON string", so either is acceptable
- `writeReferenceData` is not expected to return any value (resolves `undefined`)
