## Handoff Summary
**For:** Codey
**Feature:** data-model

### Key Decisions
- Tests use Node.js built-in test runner (node:test), not Jest
- All imports from `../src/data-model/index.js` barrel file
- Zod `safeParse` used for all schema validation tests (contract assumes Zod)
- Store factory exported as `createPossessionsStore` returning a Zustand vanilla store
- KNOWN_ROLES tested case-insensitively for core roles (Judge, Caseworker, Claimant, Defendant)

### Files Created
- ./test/artifacts/feature_data-model/test-spec.md
- ./test/feature_data-model.test.js

### Open Questions
- OQ1 from Alex still open: exact ~30 roles unknown until data-ingestion
- Whether `name` on Event should reject empty strings (currently not tested)

### Critical Context
The test file expects these named exports from `../src/data-model/index.js`: `ClaimTypeId` (enum object with 7 members), `StateSchema`, `TransitionSchema`, `EventSchema`, `ClaimTypeSchema` (all Zod schemas), `KNOWN_ROLES` (string array), and `createPossessionsStore` (factory function returning a Zustand vanilla store with `getState()`). The store's initial state must have: `claimTypes`, `states`, `transitions`, `events` (all empty arrays) and `activeClaimType` (null).
