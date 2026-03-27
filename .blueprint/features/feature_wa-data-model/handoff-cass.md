## Handoff Summary
**For:** Nigel
**Feature:** wa-data-model

### Key Decisions
- Split into 3 stories: enums, schemas, store slice (matches the natural dependency chain)
- AC style adapted for infrastructure feature: no UI routes; Given/When/Then targets parse calls and store reads
- Schema permissiveness is explicit: empty `eventIds` and empty `alignmentNotes` are both valid (downstream enforcement is wa-ingestion's job)
- Store uses replace semantics (not merge) for both `setWaTasks` and `setWaMappings`

### Files Created
- .blueprint/features/feature_wa-data-model/story-wa-enums.md
- .blueprint/features/feature_wa-data-model/story-wa-schemas.md
- .blueprint/features/feature_wa-data-model/story-wa-store.md

### Open Questions
- None (Alex's open questions on file organisation and eventIds validation were resolved in the feature spec recommendations)

### Critical Context
Stories follow a dependency order: enums first, then schemas (which consume enums), then store (which consumes schema types). Each story's ACs map directly to unit tests: enum membership checks, Zod parse/reject calls, and Zustand get/set assertions. The existing patterns in `src/data-model/enums.ts`, `schemas.ts`, and `store.ts` are the reference implementations -- WA files follow the same conventions.
