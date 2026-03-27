# Implementation Plan — wa-ingestion

## Overview

Create two static JSON data files (17 WA tasks, 17 WA mappings) and a validation module, sourced from the R1A alignment analysis. Three bridge `.js` files are also needed so Node can resolve `.js` imports to `.ts` sources.

## Files to Create/Modify

### 1. `src/data-model/schemas.js` (new — bridge file)
Re-exports all schemas from `schemas.ts` so tests can import `../src/data-model/schemas.js`.

### 2. `src/data-model/enums.js` (new — bridge file)
Re-exports all enums from `enums.ts` so tests can import `../src/data-model/enums.js`.

### 3. `data/wa-tasks.json` (new)
Array of 17 WA task objects. Each has: `id`, `triggerDescription`, `taskName`, `taskContext`, `alignment`.
- IDs: `wa-task-01` through `wa-task-17` (zero-padded)
- Alignment distribution: 7 aligned (1,2,3,8,13,14,15), 9 partial (4,5,6,7,9,10,11,12,16), 1 gap (17)
- Context groupings: claim(1,2,10), counterclaim(5,12), claim-counterclaim(4,9), gen-app(6,7,8,11), general(3,13,14,15,16,17)
- Data sourced from `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`

### 4. `data/wa-mappings.json` (new)
Array of 17 mapping objects. Each has: `waTaskId`, `eventIds`, `alignmentNotes`.
- Aligned tasks: non-empty eventIds, notes optional but present
- Partial tasks: non-empty eventIds AND non-empty alignmentNotes
- Gap task (17): empty eventIds, non-empty alignmentNotes
- Tasks 9-12: alignmentNotes must contain "citizen" substring (citizen-only footnote)

### 5. `src/wa-ingestion/index.ts` (new)
Exports `validateWaData(tasks, mappings)` returning `{ success: boolean, errors: string[] }`.
Validates:
- Schema conformance (each task against WaTaskSchema, each mapping against WaTaskMappingSchema)
- Record counts (exactly 17 each)
- Referential integrity (every mapping.waTaskId must exist in tasks)

### 6. `src/wa-ingestion/index.js` (new — bridge file)
Re-exports `validateWaData` from `index.ts`.

## Implementation Order

1. Bridge files (`schemas.js`, `enums.js`) — unblocks test imports
2. `data/wa-tasks.json` — unblocks TD-* tests
3. `data/wa-mappings.json` — unblocks MD-* tests
4. `src/wa-ingestion/index.ts` + `index.js` — unblocks VD-* tests

## Test Expectations (from test file)

- **TD-1**: 17 tasks, IDs wa-task-01..17, unique
- **TD-2**: All pass WaTaskSchema.safeParse
- **TD-3**: 7 aligned [1,2,3,8,13,14,15], 9 partial [4,5,6,7,9,10,11,12,16], 1 gap [17]
- **TD-4**: Context groups: claim[1,2,10], counterclaim[5,12], claim-counterclaim[4,9], gen-app[6,7,8,11], general[3,13,14,15,16,17]
- **TD-5**: Non-empty taskName and triggerDescription
- **MD-1**: 17 mappings, unique waTaskIds, all reference valid task IDs
- **MD-1b**: All pass WaTaskMappingSchema.safeParse
- **MD-2**: 7 aligned mappings have non-empty string eventIds
- **MD-3**: 9 partial mappings have non-empty eventIds AND non-empty alignmentNotes
- **MD-4**: wa-task-17 has eventIds=[], non-empty alignmentNotes
- **MD-5**: Tasks 9-12 mappings have "citizen" in alignmentNotes
- **VD-1/2**: validateWaData(valid,valid) => { success: true, errors: [] }
- **VD-3**: Invalid task record => { success: false, errors: [...] }
- **VD-4**: Wrong count => { success: false }
- **VD-5**: Bad waTaskId ref => { success: false, errors: [...] }
- **VD-6**: Result has boolean success and errors property
