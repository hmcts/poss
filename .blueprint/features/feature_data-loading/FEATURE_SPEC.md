# Feature Spec: data-loading

## Purpose

Wire ingestion JSON output into the Zustand store. Provide pure-logic functions to load fixture data, populate the store, and query it by claim type.

## Module

`src/data-loading/index.ts`

## Exported Functions

### `loadModelData(claimTypeId: string): Promise<{ states: State[], transitions: Transition[], events: Event[] }>`

Loads states and transitions from the JSON fixture file for the given claim type via the data-ingestion `loadStatesAndTransitions` function. Returns `{ states, transitions, events }` where events is an empty array (events come from Excel parsing at build time, not from JSON fixtures). If the JSON file does not exist, returns `{ states: [], transitions: [], events: [] }`.

### `populateStore(store: StoreApi<PossessionsState>, data: { claimTypes?: ClaimType[], states?: State[], transitions?: Transition[], events?: Event[] }): void`

Sets store state with the provided data. Merges into existing state (uses `store.setState`). Each field provided replaces the corresponding array in the store.

### `getModelDataForClaimType(allStates: State[], allTransitions: Transition[], allEvents: Event[], claimTypeId: string): { states: State[], transitions: Transition[], events: Event[] }`

Pure filter function. Filters `allStates` where `state.claimType === claimTypeId`, filters `allTransitions` where the transition's `from` state is in the filtered states set, and filters `allEvents` where `event.claimType === claimTypeId`. Returns the filtered triple. Unknown claimTypeId returns empty arrays.

### `getAllClaimTypeIds(): string[]`

Returns all values from the `ClaimTypeId` enum as an array of strings. Always returns exactly 7 IDs.

### `createPopulatedStore(claimTypes: ClaimType[], states: State[], transitions: Transition[], events: Event[]): StoreApi<PossessionsState>`

Convenience function. Creates a new Possessions store via `createPossessionsStore()` and populates it with the provided data in one call. Returns the populated store.

## Dependencies

- `src/data-model/store.ts` -- `createPossessionsStore`, `PossessionsState`
- `src/data-model/schemas.ts` -- `State`, `Transition`, `Event`, `ClaimType`
- `src/data-model/enums.ts` -- `ClaimTypeId`
- `src/data-ingestion/index.ts` -- `loadStatesAndTransitions`

## Notes

- This is a pure-logic module. No React/DOM.
- `getModelDataForClaimType` filters transitions by checking if `transition.from` matches any state ID in the filtered states set. This ensures transitions are scoped to the correct claim type.
- `loadModelData` is async; all other functions are synchronous.

---

## React Integration (implemented via vibe coding)

The React component layer does NOT use the Zustand store or `loadModelData` for data loading. Instead:

- **`app/providers.tsx`** implements a React Context (`AppProvider`) with `useState`
- **Sample data generator** (`createSampleData`) produces distinct process models per claim type with realistic states, transitions, and events
- **No `useModelData` hook** — components access data via `useApp()` context hook returning `{ modelData, activeClaimType, setActiveClaimType }`
- Switching claim types regenerates sample data and re-renders all consuming components

### Why the deviation
The real ingestion pipeline (`loadStatesAndTransitions`) depends on JSON fixtures from Excel/PDF parsing. For rapid prototyping, sample data per claim type was more practical. The Zustand store and `loadModelData`/`populateStore` functions remain available for future integration with real data.

### To connect real data
Replace `createSampleData()` in `app/providers.tsx` with calls to `loadModelData()` + `getModelDataForClaimType()`, or wire the Zustand store via `useSyncExternalStore`.
