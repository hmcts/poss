# Implementation Plan -- data-model

## Test Feedback

FEEDBACK: {"rating":4,"issues":["ZR-8 is labelled as a rejection case but actually tests acceptance (misleading grouping)","No test for ClaimTypeSchema valid case outside the rejection block","No negative test for store (e.g. store not sharing state between instances)","Feature spec mentions utility helper stubs (getEventsForState etc.) but no tests cover them"],"rec":"proceed"}

## Summary

Implement the foundational data model as Zod schemas, a ClaimTypeId enum object, a KNOWN_ROLES constant, and a Zustand vanilla store factory. All exports go through a barrel file at `src/data-model/index.js` (TypeScript `.ts` source). Zod and Zustand must be added as dependencies first.

## Files to Create/Modify

| Path | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `zod` and `zustand` dependencies |
| `src/data-model/schemas.ts` | Create | Zod schemas: StateSchema, TransitionSchema, EventSchema, ClaimTypeSchema |
| `src/data-model/enums.ts` | Create | ClaimTypeId enum object (7 members), KNOWN_ROLES constant |
| `src/data-model/store.ts` | Create | createPossessionsStore factory using Zustand vanilla createStore |
| `src/data-model/index.ts` | Create | Barrel re-exporting all public API |
| `tsconfig.json` | Create (if absent) | TypeScript config so `.ts` source compiles/runs |

## Implementation Steps

1. **Add dependencies** -- `npm install zod zustand`. Addresses: all tests (runtime imports).
2. **Ensure TypeScript execution** -- Verify or add `tsconfig.json` with `moduleResolution: "bundler"` or Node16, and confirm `node --experimental-strip-types` or `tsx` is available so `node:test` can import `.ts` via `.js` extensions. Addresses: test runner ability to load source.
3. **Create `src/data-model/enums.ts`** -- Define `ClaimTypeId` as a frozen plain object with 7 keys/values (`MAIN_CLAIM_ENGLAND`, `ACCELERATED_CLAIM_WALES`, `COUNTER_CLAIM`, `COUNTER_CLAIM_MAIN_CLAIM_CLOSED`, `ENFORCEMENT`, `APPEALS`, `GENERAL_APPLICATIONS`). Export `KNOWN_ROLES` as `['Judge', 'Caseworker', 'Claimant', 'Defendant']`. Addresses: CT-1, CT-2, RO-1, RO-2, RO-3.
4. **Create `src/data-model/schemas.ts`** -- Define `StateSchema` (z.object with id, technicalName, uiLabel, claimType as z.string; isDraftLike, isLive, isEndState as z.boolean; completeness as z.number().int().min(0).max(100)). Addresses: ST-1 to ST-4, ZR-1, ZR-2.
5. **In same file, define `TransitionSchema`** -- z.object with from, to as z.string, condition as z.string().nullable(), isSystemTriggered and isTimeBased as z.boolean(). Addresses: TR-1 to TR-3, ZR-3, ZR-4.
6. **In same file, define `EventSchema`** -- z.object with id, name, claimType, state as z.string; isSystemEvent, hasOpenQuestions as z.boolean; notes as z.string; actors as z.record(z.string(), z.boolean()). Addresses: EV-1 to EV-5, ZR-5, ZR-6.
7. **In same file, define `ClaimTypeSchema`** -- z.object with id, name, description as z.string(). Addresses: ZR-7, ZR-8.
8. **Create `src/data-model/store.ts`** -- Export `createPossessionsStore` that calls Zustand's `createStore` with initial state: `{ claimTypes: [], states: [], transitions: [], events: [], activeClaimType: null }`. Addresses: SS-1, SS-2, SS-3.
9. **Create `src/data-model/index.ts`** -- Barrel file re-exporting `ClaimTypeId`, `KNOWN_ROLES`, all four schemas, and `createPossessionsStore`. Addresses: all tests (import resolution).
10. **Run tests** -- `node --experimental-strip-types --test test/feature_data-model.test.js` and verify all 24 tests pass.

## Risks/Questions

- The test imports from `../src/data-model/index.js` but source is `.ts`. Node's `--experimental-strip-types` (v22.6+) resolves `.js` to `.ts` automatically; confirm the container's Node version supports this, or use `tsx` as a loader.
- `package.json` currently has no `name`, `type`, or `scripts` fields -- may need `"type": "module"` for ESM imports to work.
- Feature spec mentions type utility helper stubs (`getEventsForState`, etc.) but no tests cover them -- defer to a follow-up or ask Alex for clarification.
- KNOWN_ROLES has only 4 entries now; OQ1 remains open until data-ingestion provides the full ~30 roles.
