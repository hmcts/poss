## Handoff Summary
**For:** Nigel (skipping Cass -- technical feature, no user stories)
**Feature:** data-model

### Key Decisions
- All types must be JSON-serialisable: `Record<Role, boolean>` instead of `Map`, no `Date` objects
- State IDs use `claimTypeId:TECHNICAL_NAME` format for cross-claim-type uniqueness (interpretation, not in system spec)
- Role type starts as `string` with a `KNOWN_ROLES` constant, tightened to a union once data-ingestion extracts the full ~30 from Excel
- Zod recommended for schema validation (runtime + TypeScript inference), but implementation may choose JSON Schema with ajv
- `completeness` is required (default 0), not optional -- uncertainty must be explicit per system spec principles

### Files Created
- .blueprint/features/feature_data-model/FEATURE_SPEC.md

### Open Questions
- OQ1: Exact list of ~30 roles unknown until Excel columns are extracted by data-ingestion
- OQ2: Whether `completeness` should be optional or required (recommended: required, default 0)
- OQ3: Whether `condition` on Transition should be `string | null` or omitted for unconditional transitions (recommended: `string | null`)

### Critical Context
Nigel should focus tests on: (1) type completeness against System Spec section 5 -- every field accounted for, (2) Zod/JSON schema validation accepting valid data and rejecting malformed data (wrong types, missing fields, out-of-range completeness, unknown roles, duplicate IDs), (3) ClaimType enum has exactly 7 members, (4) all types survive JSON round-trip without data loss, (5) Zustand store initialises with correct typed shape. No UI or runtime behaviour to test -- this is purely types, schemas, and store skeleton.
