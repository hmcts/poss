## Handoff Summary
**For:** Cass
**Feature:** wa-data-model

### Key Decisions
- WA schemas are separate from core schemas (new files within `src/data-model/`, not appended to existing `schemas.ts`)
- The `waTask` slice extends the existing Zustand store rather than creating a separate store
- Referential integrity between `WaTaskMapping.eventIds` and `Event.id` is NOT enforced at schema level -- that is wa-ingestion's responsibility
- `alignmentNotes` is a required string on mappings (not optional), but may be empty for fully aligned tasks
- Gap tasks (e.g. Failed Payment) have an empty `eventIds` array -- schema does not enforce non-empty

### Files Created
- .blueprint/features/feature_wa-data-model/FEATURE_SPEC.md

### Open Questions
- File organisation: new `wa-schemas.ts`/`wa-enums.ts` files vs appending to existing files (recommendation: new files)
- Whether `eventIds` should be validated as non-empty for aligned/partial tasks (recommendation: no, keep schema permissive)

### Critical Context
The R1A analysis (`.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`) defines 17 tasks: 7 aligned, 9 partial, 1 gap. The five `WaTaskContext` enum values map to domain groupings (claim, counterclaim, gen-app, claim-counterclaim, general). Stories should cover both schema validation (valid/invalid inputs) and store operations (set/get). This is a small feature (M effort) -- expect 2-4 stories. Downstream consumers are wa-ingestion (immediate) and wa-task-engine (next).
