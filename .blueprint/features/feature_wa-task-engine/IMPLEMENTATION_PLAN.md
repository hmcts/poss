# Implementation Plan — wa-task-engine

## Overview
Pure query module with 7 exported functions that resolve WA tasks for events/states, summarise alignment, and filter by context. All functions are stateless and operate on in-memory arrays passed as parameters.

## Files to Create
1. `src/wa-task-engine/index.ts` — TypeScript source with all 7 functions
2. `src/wa-task-engine/index.js` — ESM bridge file (re-exports from `.ts`)

## Function Signatures (from tests — parameter order is authoritative)

| Function | Signature |
|----------|-----------|
| getTasksForEvent | `(eventName: string, mappings: WaTaskMapping[], tasks: WaTask[]): WaTask[]` |
| getTasksForState | `(stateId: string, events: {state:string,name:string}[], mappings: WaTaskMapping[], tasks: WaTask[]): WaTask[]` |
| getAlignmentSummary | `(tasks: WaTask[], mappings: WaTaskMapping[]): { aligned: number, partial: number, gap: number }` |
| getUnmappedTasks | `(tasks: WaTask[], mappings: WaTaskMapping[]): WaTask[]` |
| getPartialTasks | `(tasks: WaTask[], mappings: WaTaskMapping[]): Array<{ task: WaTask, missing: string }>` |
| getEventWaContext | `(eventName: string, mappings: WaTaskMapping[], tasks: WaTask[]): { task: WaTask, alignment: string, notes: string } \| null` |
| filterTasksByContext | `(tasks: WaTask[], context: string): WaTask[]` |

## Key Design Decisions

1. **Parameter order follows the tests**, not the feature spec. Tests call `getTasksForEvent('Case Issued', waMappings, waTasks)` — mappings before tasks.
2. **Event matching is case-sensitive exact string equality** against `WaTaskMapping.eventIds[]`.
3. **getEventWaContext returns the first matching mapping** when multiple mappings reference the same event (e.g. "Upload your documents" maps to 4 tasks — returns the first).
4. **getAlignmentSummary counts from task.alignment field only** — mappings param accepted but unused for counting.
5. **getPartialTasks pairs each partial task with alignmentNotes** from the corresponding mapping (lookup by `waTaskId`).
6. **getUnmappedTasks filters by alignment === 'gap'** — does not check eventIds.
7. **State-level resolution deduplicates by task id** using a Set.
8. **All edge cases return empty arrays or null** — never throw.

## Implementation Steps

1. Create `src/wa-task-engine/` directory
2. Implement `index.ts` with all 7 functions
3. Create `index.js` bridge file following the `wa-ingestion/index.js` pattern
4. Run tests, iterate until all 23 pass

## Test Coverage
23 tests across 4 describe blocks:
- Event-Level Resolution: 6 tests (EV-1 through EV-6)
- State-Level Resolution: 5 tests (ST-1 through ST-5)
- Alignment Queries: 6 tests (AL-1 through AL-6)
- Context Filtering: 6 tests (CF-1 through CF-6)
