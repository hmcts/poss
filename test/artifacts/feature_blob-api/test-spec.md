# Test Specification — blob-api

## Understanding

`app/api/reference-data/route.ts` exposes two Next.js App Router handlers:
- `GET /api/reference-data` — reads the reference data blob and returns it as JSON
- `PUT /api/reference-data` — validates a payload against `ReferenceDataBlobSchema` and writes it to blob storage

Both handlers delegate storage I/O to `src/ref-data/blob-client.ts`. The route is the HTTP boundary; the blob-client is the I/O boundary. Tests mock the blob-client entirely and test only the route's HTTP contract.

### Mocking Strategy

`mock.module('../src/ref-data/blob-client.js', ...)` replaces `readReferenceData` and `writeReferenceData` with controllable stubs. The route handlers are imported directly and called with plain Web API `Request` objects — no Next.js server required.

### Key Behaviours

**GET:**
- Happy path: calls `readReferenceData()`, returns `200` + JSON body + `Content-Type: application/json`
- `readReferenceData` returns `EMPTY_SEED` — route returns it unchanged as `200` (not a special case)
- `readReferenceData` throws — route returns `500` + `{ error: string }`

**PUT:**
- Valid body + `writeReferenceData` succeeds → `204 No Content`
- Body fails `ReferenceDataBlobSchema` validation → `400` + `{ error: string }`
- Body is unparseable JSON → `400` or `500` (see Ambiguity A1 below)
- `writeReferenceData` throws → `500` + `{ error: string }`

### Ambiguities Noted

| # | Item | Resolution |
|---|------|------------|
| A1 | `request.json()` throws when body is invalid JSON — spec doesn't say if route catches this or lets Next.js handle it | Test documents the observable behaviour; test is marked `// AMBIGUOUS` — passes if 400 or 500 is returned |
| A2 | Zod error summary format: `zodError.errors.map(e => e.message).join('; ')` vs `zodError.message` | Test only checks shape `{ error: string }`, not the exact string |
| A3 | 204 body: `NextResponse` with status 204 — `Response.body` should be null; test checks for absence of meaningful body | Accept `null` body or empty body |
| A4 | `Content-Type` header on 500 responses — spec doesn't specify | Test only checks GET 200 has correct Content-Type; error responses not checked |

## AC → Test ID Mapping

| AC | Test ID | Scenario |
|----|---------|----------|
| GET 200 + JSON body | G-1 | `readReferenceData` resolves → response status 200 |
| GET 200 + JSON body | G-2 | `readReferenceData` resolves → body parses as valid JSON |
| GET 200 + JSON body | G-3 | `readReferenceData` resolves → body matches returned data exactly |
| GET Content-Type header | G-4 | Response `Content-Type` header contains `application/json` |
| GET EMPTY_SEED transparent | G-5 | `readReferenceData` returns `EMPTY_SEED` → route returns it as 200 unchanged |
| GET 500 on throw | G-6 | `readReferenceData` throws → status 500 |
| GET 500 error body | G-7 | `readReferenceData` throws → body is `{ error: string }` with error message |
| PUT 204 on valid body | P-1 | Valid `ReferenceDataBlob` body → status 204 |
| PUT 204 no body | P-2 | Valid body → response body is null or empty |
| PUT calls writeReferenceData | P-3 | Valid body → `writeReferenceData` called with parsed data |
| PUT 400 on invalid body | P-4 | Body missing required fields → status 400 |
| PUT 400 error body | P-5 | Invalid body → response body is `{ error: string }` |
| PUT 400 does not call write | P-6 | Invalid body → `writeReferenceData` NOT called |
| PUT 500 on write throw | P-7 | `writeReferenceData` throws → status 500 |
| PUT 500 error body | P-8 | `writeReferenceData` throws → body is `{ error: string }` with error message |
| PUT 400 on non-JSON body | P-9 | Body is not parseable JSON → 400 or 500 (ambiguous — A1) |

## Assumptions

1. The route file will be at `app/api/reference-data/route.ts` with `.js` bridge.
2. `readReferenceData` and `writeReferenceData` are the only exports from `src/ref-data/blob-client.ts` that the route uses.
3. Node 18+ globals include `Request` and `Response` — no polyfill needed.
4. The test imports `GET` and `PUT` as named exports from `../app/api/reference-data/route.js`.
5. Tests will fail to import until Codey creates the route file — this is intentional (contract-first).
6. `mock.module()` must be called before any import of the module under test.
