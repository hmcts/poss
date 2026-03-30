# Implementation Plan — catalogue-coverage-map

## Summary

Implement the pure-logic mapping engine (`src/catalogue-coverage-map/`) and persona-role UI helper (`src/ui-catalogue-coverage-map/`) that together produce catalogue-to-state coverage data. All 44 logic tests in `test/feature_catalogue-coverage-map.test.js` drive the scope; React UI stories (S10–S14) are deferred to a Playwright phase. A static data file (`data/persona-role-mapping.json`) is required before any persona-aware functions can pass.

---

## Files to Create

| Path | Action | Purpose |
|---|---|---|
| `data/persona-role-mapping.json` | Create | Static mapping of 23 catalogue personas → KNOWN_ROLES + isCrossCutting flag |
| `src/catalogue-coverage-map/index.ts` | Create | All logic exports: match, filter, coverage, gap, journey, decision, CSV |
| `src/catalogue-coverage-map/index.js` | Create | JS re-export shim (mirrors pattern from `src/product-catalogue/index.js`) |
| `src/ui-catalogue-coverage-map/index.ts` | Create | `getPersonaRoleMapping` — reads persona-role-mapping.json |
| `src/ui-catalogue-coverage-map/index.js` | Create | JS re-export shim |

---

## Implementation Steps

**Step 1 — Data file: `data/persona-role-mapping.json`**
Create the 23-entry JSON object keyed by persona ID. Each entry: `{ roles: string[], isCrossCutting: boolean }`. Six personas (`citizen`, `applicant`, `non-party`, `other-party`, `org-admin`, `professional-org`) get `roles: [], isCrossCutting: true`. `litigation-friend` maps to `["Claimant", "Defendant"]`. Remaining 16 map per OQ1 resolution in FEATURE_SPEC.md.
_Addresses: S3-1, S3-2, S3-3, S3-4_

**Step 2 — `src/ui-catalogue-coverage-map/index.ts` + JS shim**
Export `getPersonaRoleMapping(personaId)` — imports the JSON, returns the matching entry or `undefined`.
_Addresses: S3-1 to S3-4_

**Step 3 — Module scaffolding: `src/catalogue-coverage-map/index.ts` + JS shim**
Create the module with all eight export stubs (throw `not implemented` temporarily). Confirm the test file can import without runtime errors.
_Addresses: import resolution for all test groups_

**Step 4 — `filterByReleaseScope(items, scope)`**
Pure filter: `'r1'` → `release1 === 'yes'`; `'r1+tbc'` → `release1 !== 'no'`; `'all'` → all. Return a new array (no mutation).
_Addresses: S4-1 to S4-4_

**Step 5 — `filterByClaimTypeRelevance(items, claimTypeId)`**
Pure filter using `domainGroup` prefix rules: `claims-counterclaim` → include only when claimTypeId includes `COUNTERCLAIM`; `enforcement-` prefix → include only when claimTypeId includes `ENFORCEMENT`; everything else → always include.
_Addresses: S5-1 to S5-4_

**Step 6 — `matchByEventTrigger(item, events)`**
Case-insensitive substring match of `item.eventTrigger` against each `event.name`. Return `MappingTuple[]` with `matchConfidence: 'exact'`. Return `[]` when `eventTrigger` is null or no match.
_Addresses: S1-1 to S1-4_

**Step 7 — `matchByDomainAndFeature(item, states, events)`**
Two inferred-match passes: (1) `item.domainGroup === state.domainGroup` → tuple with `eventId: null`; (2) case-insensitive substring of `item.feature` in `event.name` → tuple with the event's stateId. All returned tuples have `matchConfidence: 'inferred'`. No deduplication needed here — caller deduplicates against exact matches.
_Addresses: S2-1 to S2-4_

**Step 8 — `identifyGaps(mappings, events, persona?)`**
Group events by stateId. For each state: zero mappings + `hasOpenQuestions` → `critical`; zero mappings → `gap`; some but not all events covered → `partial`; all covered → omit from list. Sort output: critical → gap → partial.
_Addresses: S7-1 to S7-4_

**Step 9 — `calculatePersonaCoverage(persona, mappings, states, events, roleMapping)`**
If `roleMapping.isCrossCutting` → return shape with `isCrossCutting: true, coveragePct: null`. Otherwise filter events to those where `actors[role] === true` for any resolved role. Count unique stateIds from relevant events as `totalStates`; count stateIds present in mappings as `coveredStates`. `coveragePct = Math.round(coveredStates / totalStates * 100)`.
_Addresses: S6-1 to S6-4_

**Step 10 — `traceJourneyCompleteness(persona, coverageMap, graph)`**
Return `null` immediately when `persona === null`. Otherwise enumerate all paths from the first non-terminal state to any `isEndState: true` node (DFS with cycle guard). For each path, compute average coverage from `coverageMap`. Report `bestPathCoverage`, `worstPathCoverage`, `canReachTerminal`, and `blockingGaps` (states with coverage 0).
_Addresses: S8-1 to S8-4_

**Step 11 — `surfaceDecisions(events, items)`**
Two passes: (1) events with `hasOpenQuestions === true` → `{ source: 'model', id: event.id, ...}`; (2) items where `userStory === null || ucdRequired === null || notes?.includes('TBC')` → `{ source: 'catalogue', ref: item.ref, ...}`. Concatenate and return.
_Addresses: S9-1 to S9-4_

**Step 12 — `exportGapListCsv(gaps, persona?)`**
CSV headers: `State, Event, Severity, Persona, Domain Group, Open Questions, Also Has WA Gap`. Map gaps to rows with `hasWaGap` → `'yes'`/`'no'`. Filename: `coverage-gaps-{persona}.csv` when persona truthy, otherwise `coverage-gaps-all.csv`. Return `{ content, filename, mimeType: 'text/csv' }`.
_Addresses: S15-1 to S15-4_

---

## Key Data Contracts per Function

| Function | Inputs | Output type |
|---|---|---|
| `matchByEventTrigger` | `(item, events[])` | `MappingTuple[]` — `matchConfidence: 'exact'` |
| `matchByDomainAndFeature` | `(item, states[], events[])` | `MappingTuple[]` — `matchConfidence: 'inferred'` |
| `getPersonaRoleMapping` | `(personaId: string)` | `{ roles: string[], isCrossCutting: boolean } \| undefined` |
| `filterByReleaseScope` | `(items[], scope: 'r1'\|'r1+tbc'\|'all')` | `CatalogueItem[]` (new array) |
| `filterByClaimTypeRelevance` | `(items[], claimTypeId: string)` | `CatalogueItem[]` (new array) |
| `calculatePersonaCoverage` | `(persona, mappings[], states[], events[], roleMapping)` | `CoverageResult` |
| `identifyGaps` | `(mappings[], events[], persona?)` | `Gap[]` ordered critical → gap → partial |
| `traceJourneyCompleteness` | `(persona\|null, coverageMap, graph)` | `JourneyResult \| null` |
| `surfaceDecisions` | `(events[], items[])` | `Decision[]` |
| `exportGapListCsv` | `(gaps[], persona?)` | `{ content, filename, mimeType: 'text/csv' }` |
