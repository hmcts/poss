## Handoff Summary
**For:** Cass
**Feature:** wa-task-engine

### Key Decisions
- Event matching uses `Event.name` (human-readable strings like "Case Issued"), not index-based `Event.id`, consistent with wa-ingestion's design
- Deduplication in `getTasksForState` is by `WaTask.id` -- same task triggered by multiple events at one state appears once
- `getUnmappedTasks` filters by `alignment === 'gap'` (the field is authoritative), not by checking empty `eventIds`
- `getPartialTasks` uses `alignmentNotes` from the mapping as the `missing` explanation text
- All 7 functions are pure and stateless -- no store access, no side effects, arrays in/arrays out

### Files Created
- .blueprint/features/feature_wa-task-engine/FEATURE_SPEC.md

### Open Questions
- Exact vs case-insensitive event name matching (recommendation: exact equality)
- Whether to support multiple mapping records per task ID (recommendation: yes, for future-proofing)

### Critical Context
This is a pure logic layer (Layer 1) module. It sits between wa-ingestion (data) and ui-wa-tasks (UI orchestration). The 7 functions defined here are the complete query API for WA task resolution -- ui-wa-tasks composes them into UI-ready structures but should not duplicate any resolution logic. Event name matching is the critical integration seam; acceptance criteria must specify exact string matching against `Event.name`.
