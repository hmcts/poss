## Handoff Summary
**For:** Cass
**Feature:** wa-ingestion

### Key Decisions
- Event mappings use event names (e.g. "Case Issued") not generated IDs, because event model IDs are index-based and unstable; wa-task-engine resolves names to IDs downstream
- Citizen-only footnote for tasks 9-12 is captured within `alignmentNotes` text (no schema extension needed)
- Task context assignments are inferred from R1A descriptions — see Section 4 table in the spec for the full mapping
- The `data/` directory is a new convention (backlog specifies it); existing ingestion uses `src/data-ingestion/states/`
- JSON files are hand-authored (not programmatically parsed from .docx) since the analysis markdown is the authoritative source

### Files Created
- .blueprint/features/feature_wa-ingestion/FEATURE_SPEC.md

### Open Questions
- Should `eventIds` use event names or generated IDs? Spec recommends names, but needs confirmation.
- Should multi-state events capture which states in the mapping, or just event names?
- Exact task context assignments (Section 4) are inferred and may need business team validation.

### Critical Context
This feature produces two static JSON files (`data/wa-tasks.json`, `data/wa-mappings.json`) plus a validation script. It is data authoring, not logic. The 17 tasks split into 7 aligned, 9 partial, 1 gap — each tier has different data quality requirements for `alignmentNotes`. The upstream schemas (`WaTaskSchema`, `WaTaskMappingSchema`) are already implemented in `src/data-model/schemas.ts`. Stories should have explicit acceptance criteria per alignment tier and verify all 17 tasks are present.
