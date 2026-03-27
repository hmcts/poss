# Implementation Plan: wa-data-model

## Summary
Add Work Allocation (WA) enums, Zod schemas, and Zustand store slice to the existing `src/data-model/` module. Follows established patterns: `as const` enums in `enums.ts`, Zod schemas in `schemas.ts`, Zustand store in `store.ts`. All new exports added to `index.ts` and the `index.js` bridge file.

## Files to Create/Modify

| Path | Action | Purpose |
|------|--------|---------|
| `src/data-model/enums.ts` | Modify | Add `WaTaskContext` and `WaAlignmentStatus` as `as const` objects |
| `src/data-model/schemas.ts` | Modify | Add `WaTaskSchema` and `WaTaskMappingSchema` using Zod with enum-constrained fields |
| `src/data-model/store.ts` | Modify | Extend `PossessionsState` with `waTasks`, `waMappings` arrays and setter actions |
| `src/data-model/index.ts` | Modify | Re-export new WA symbols |
| `src/data-model/index.js` | Modify | Mirror index.ts re-exports (bridge file) |

## Implementation Steps

1. Add `WaTaskContext` and `WaAlignmentStatus` enums to `enums.ts` using `as const` pattern (matching `ClaimTypeId`)
2. Add `WaTaskSchema` and `WaTaskMappingSchema` to `schemas.ts` using `z.enum()` constrained to WA enum values
3. Extend `PossessionsState` interface in `store.ts` with WA state fields and setter actions
4. Update `createPossessionsStore` to initialise WA arrays as empty and provide setter implementations
5. Update `index.ts` to re-export `WaTaskContext`, `WaAlignmentStatus`, `WaTaskSchema`, `WaTaskMappingSchema`
6. Update `index.js` to mirror `index.ts` exports
7. Run tests, fix any issues

## Risks/Questions
- Enum objects need `Object.freeze()` to satisfy WE-3 test (TypeScript `as const` alone doesn't make runtime objects frozen)
- Store interface must include action types (`setWaTasks`, `setWaMappings`) alongside state fields
