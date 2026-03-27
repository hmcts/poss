# Story — WA Zustand Store Slice

## User story

As a downstream feature developer, I want a `waTask` slice in the Zustand store so that WA task and mapping data can be set once (by wa-ingestion) and read by all consuming features from a single source of truth.

---

## Context / scope

- Module: `src/data-model/store.ts` (extend existing store)
- The existing `PossessionsState` interface and `createPossessionsStore` function are extended, not replaced
- The `waTask` slice adds: `waTasks: WaTask[]`, `waMappings: WaTaskMapping[]`, `setWaTasks`, `setWaMappings`
- Store starts with empty arrays; wa-ingestion populates them later
- `setWaTasks` replaces the entire `waTasks` array; `setWaMappings` replaces the entire `waMappings` array
- Types `WaTask` and `WaTaskMapping` come from `wa-schemas.ts` (see story-wa-schemas.md)
- Full feature spec: `.blueprint/features/feature_wa-data-model/FEATURE_SPEC.md`

---

## Acceptance criteria

**AC-1 -- Store initialises with empty WA arrays**
- Given a new store is created via `createPossessionsStore()`,
- When I read `waTasks` and `waMappings` from the store state,
- Then both are empty arrays (`[]`).

**AC-2 -- setWaTasks replaces the tasks array**
- Given a store with an empty `waTasks` array,
- When `setWaTasks` is called with an array of valid `WaTask` objects,
- Then `waTasks` in the store state equals the provided array.

**AC-3 -- setWaTasks overwrites previous tasks**
- Given a store where `setWaTasks` has already been called with task set A,
- When `setWaTasks` is called again with task set B,
- Then `waTasks` in the store state equals task set B (set A is fully replaced, not merged).

**AC-4 -- setWaMappings replaces the mappings array**
- Given a store with an empty `waMappings` array,
- When `setWaMappings` is called with an array of valid `WaTaskMapping` objects,
- Then `waMappings` in the store state equals the provided array.

**AC-5 -- setWaMappings overwrites previous mappings**
- Given a store where `setWaMappings` has already been called with mapping set A,
- When `setWaMappings` is called again with mapping set B,
- Then `waMappings` in the store state equals mapping set B (set A is fully replaced, not merged).

**AC-6 -- Existing core store state is unaffected**
- Given a store with existing core state (`claimTypes`, `states`, `transitions`, `events`, `activeClaimType`),
- When `setWaTasks` or `setWaMappings` is called,
- Then the core state fields remain unchanged.

---

## Out of scope

- Schema validation within the store actions (schemas validate at parse time, before data reaches the store)
- Query or filter logic over WA tasks (wa-task-engine concern)
- Populating the store with real data (wa-ingestion concern)
- Creating a separate store for WA data (the slice extends the existing store)
- Subscribing to store changes or reactive updates (consumer concern)
