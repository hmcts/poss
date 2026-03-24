# Implementation Plan: data-ingestion

FEEDBACK: {"rating":4,"issues":["parseBreathingSpaceMatrix/parseStayedMatrix tests pass pre-shaped objects rather than raw matrix data, so they test validation not parsing","loadStatesAndTransitions test needs fixture files in src/data-ingestion/states/ to work - no setup/teardown provided","No test for Format A actor columns beyond the explicit Y/N/blank set (e.g. lowercase y)","No test for the full pipeline (ingest script end-to-end)","BreathingSpaceEntrySchema test is solid but no negative case for bad conditions type"],"rec":"proceed"}

## Summary

Create `src/data-ingestion/index.ts` exporting pure functions (parseFormatASheet, parseFormatBSheet, detectOpenQuestions, computeCompleteness, parseBreathingSpaceMatrix, parseStayedMatrix, BreathingSpaceEntrySchema) and an async loadStatesAndTransitions loader. Add BreathingSpaceEntrySchema to the data model. All functions operate on in-memory data structures; Excel I/O is a separate concern tested outside this spec.

## Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/data-ingestion/index.ts` | Main module; exports all functions and schema |
| Create | `src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json` | Hand-coded states/transitions fixture (minimum for tests) |
| Modify | `src/data-model/schemas.ts` | Add BreathingSpaceEntrySchema export |

## Implementation Steps

1. **Add BreathingSpaceEntrySchema to data-model** -- In `src/data-model/schemas.ts`, add a Zod schema: `{ stateFrom: z.string(), stateTo: z.string(), isConditional: z.boolean(), conditions: z.array(z.string()) }`. Export it. This unblocks schema conformance tests.

2. **Create `src/data-ingestion/index.ts` with re-export of BreathingSpaceEntrySchema** -- Import from `../data-model/schemas.ts` and re-export. This unblocks the BreathingSpaceEntrySchema describe block (2 tests).

3. **Implement `detectOpenQuestions(notes: string): boolean`** -- Case-insensitive regex test against markers: `?`, `TBC`, `TBD`, `placeholder`, `question`, `Alex to check`. Return false for empty string. Unblocks 4 tests.

4. **Implement `computeCompleteness(events: {hasOpenQuestions: boolean}[]): number`** -- Return 0 for empty array. Otherwise `Math.round((clean / total) * 100)`. Unblocks 4 tests.

5. **Implement `parseFormatASheet(rows, claimTypeId): Event[]`** -- For each row: generate id as `{claimTypeId}:{index}`, convert Y/N/blank actor columns to boolean record, call detectOpenQuestions on notes, build Event object. Actor columns are all keys except name/state/notes/isSystemEvent. Unblocks 4 tests.

6. **Implement `parseFormatBSheet(rows, claimTypeId): Event[]`** -- Split whoPermissions on `,` or `;`, trim each token, case-insensitive match against KNOWN_ROLES from enums.ts. Matched roles get canonical casing as key with value true. Unrecognised tokens logged via console.warn, not thrown. Unblocks 4 tests.

7. **Implement `parseBreathingSpaceMatrix(rows): BreathingSpaceEntry[]`** -- Validate each row against BreathingSpaceEntrySchema, return typed array. Unblocks 2 tests.

8. **Implement `parseStayedMatrix(rows): BreathingSpaceEntry[]`** -- Same shape/logic as breathing space parser. Unblocks 1 test.

9. **Create minimal `src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json`** -- Include at least one State (with id, technicalName, uiLabel, claimType, isDraftLike, isLive, isEndState, completeness) and one Transition. This is the fixture loadStatesAndTransitions reads.

10. **Implement `loadStatesAndTransitions(claimTypeId): Promise<{states: State[], transitions: Transition[]}>`** -- Async function that reads `src/data-ingestion/states/{claimTypeId}.json`, parses with StateSchema/TransitionSchema arrays, returns result. Unblocks 2 tests.

## Risks / Questions

- **BreathingSpaceEntrySchema ownership:** The feature spec says it must be added to `src/data-model/schemas.ts`, but the tests import it from the ingestion module. Plan: define in data-model, re-export from ingestion index. Confirm with data-model owner this is acceptable.
- **loadStatesAndTransitions file path:** Tests call `load('MAIN_CLAIM_ENGLAND')` with no base-path config. Implementation must resolve relative to project root or use `import.meta.url`. Needs care for both test and build contexts.
- **Format B role matching semantics:** Tests expect canonical casing output (e.g. input `"judge"` produces key `"Judge"`). Implementation must map matched tokens back to the KNOWN_ROLES canonical string.
- **Test import path:** Tests import from `../src/data-ingestion/index.js` (JS extension). TypeScript must be compiled or use `--experimental-strip-types` as noted. Confirm the `.js` extension resolves to `.ts` under strip-types mode.
