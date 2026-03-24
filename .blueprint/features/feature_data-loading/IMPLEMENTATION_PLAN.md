# Implementation Plan: data-loading

## Files to Create

1. `src/data-loading/index.ts` -- main module with all exported functions
2. `src/data-loading/index.js` -- bridge file for ESM import resolution

## Function Implementations

### `getAllClaimTypeIds(): string[]`
- Import `ClaimTypeId` from `../data-model/enums.ts`
- Return `Object.values(ClaimTypeId)`

### `getModelDataForClaimType(allStates, allTransitions, allEvents, claimTypeId)`
- Filter states where `state.claimType === claimTypeId`
- Build a Set of filtered state IDs
- Filter transitions where `transition.from` is in the state ID set
- Filter events where `event.claimType === claimTypeId`
- Return `{ states, transitions, events }`

### `populateStore(store, data)`
- Call `store.setState(data)` to merge provided fields into store state

### `createPopulatedStore(claimTypes, states, transitions, events)`
- Call `createPossessionsStore()` to create a new store
- Call `populateStore(store, { claimTypes, states, transitions, events })`
- Return the store

### `loadModelData(claimTypeId): Promise<{ states, transitions, events }>`
- Call `loadStatesAndTransitions(claimTypeId)` from data-ingestion
- Return `{ states, transitions, events: [] }`
- Catch file-not-found errors and return empty arrays

## Dependencies
- zustand/vanilla (StoreApi type)
- src/data-model/enums.ts (ClaimTypeId)
- src/data-model/schemas.ts (types)
- src/data-model/store.ts (createPossessionsStore, PossessionsState)
- src/data-ingestion/index.ts (loadStatesAndTransitions)
