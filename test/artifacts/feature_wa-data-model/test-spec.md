# Test Spec: wa-data-model

## Understanding
This feature adds Work Allocation (WA) domain types to the existing data-model module.
Three stories add: (1) WA-specific enums for task context and alignment status,
(2) Zod schemas for WA tasks and task-to-event mappings with enum-constrained fields,
(3) Zustand store slice extending the existing store with WA arrays and replace-semantics setters.
Tests validate enum membership, schema parse/reject behaviour, and store get/set contracts.
All imports go through the existing `index.js` bridge file, which Codey will extend.

## AC to Test ID Mapping

| Story | AC | Test ID | What it checks |
|-------|-----|---------|----------------|
| wa-enums | AC-1 | WE-1 | WaTaskContext has exactly 5 values |
| wa-enums | AC-2 | WE-2 | WaAlignmentStatus has exactly 3 values |
| wa-enums | AC-3 | WE-3 | Types restrict to defined values (runtime proxy) |
| wa-enums | AC-4 | WE-4 | All enum values are strings |
| wa-enums | AC-5 | WE-5 | Exports exist (importable from bridge) |
| wa-schemas | AC-1 | WS-1 | WaTaskSchema accepts valid task |
| wa-schemas | AC-2 | WS-2 | WaTaskSchema rejects missing fields |
| wa-schemas | AC-3 | WS-3 | WaTaskSchema rejects invalid enum values |
| wa-schemas | AC-4 | WS-4 | WaTaskMappingSchema accepts valid mapping |
| wa-schemas | AC-5 | WS-5 | WaTaskMappingSchema accepts empty eventIds |
| wa-schemas | AC-6 | WS-6 | WaTaskMappingSchema accepts empty alignmentNotes |
| wa-schemas | AC-7 | WS-7 | Schemas survive JSON round-trip |
| wa-store | AC-1 | WST-1 | Store initialises with empty WA arrays |
| wa-store | AC-2 | WST-2 | setWaTasks sets the tasks array |
| wa-store | AC-3 | WST-3 | setWaTasks overwrites (replace, not merge) |
| wa-store | AC-4 | WST-4 | setWaMappings sets the mappings array |
| wa-store | AC-5 | WST-5 | setWaMappings overwrites (replace, not merge) |
| wa-store | AC-6 | WST-6 | Core store state unaffected by WA setters |

## Key Assumptions
- Codey will re-export all WA symbols from `src/data-model/index.js`
- WaTaskContext and WaAlignmentStatus follow `as const` object pattern (like ClaimTypeId)
- Zod schemas use `z.enum()` constrained to the WA enum values
- Store extends the existing `createPossessionsStore` function (not a separate store)
- `setWaTasks`/`setWaMappings` are actions on the store state (accessed via `getState()`)
