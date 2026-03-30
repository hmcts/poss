# Handoff: Nigel → Codey
## Feature: catalogue-coverage-map

---

## What Was Done

Nigel produced:

1. **test/artifacts/feature_catalogue-coverage-map/test-spec.md** — full AC-to-test mapping for all 15 stories; stories 10-14 flagged as UI-only (Playwright).
2. **test/feature_catalogue-coverage-map.test.js** — 44 logic tests using `node:test` runner, covering all 40 AC-mapped test IDs (S1–S9, S15). Stories 10-14 are excluded (Playwright scope).

---

## Test Structure Summary

| Group | Tests | Covers |
|---|---|---|
| `matchByEventTrigger` | S1-1 to S1-4 | Story 1 AC1-AC4 |
| `matchByDomainAndFeature` | S2-1 to S2-4 | Story 2 AC1-AC4 |
| `getPersonaRoleMapping` | S3-1 to S3-4 | Story 3 AC1-AC4 |
| `filterByReleaseScope` | S4-1 to S4-4 | Story 4 AC1-AC4 |
| `filterByClaimTypeRelevance` | S5-1 to S5-4 | Story 5 AC1-AC4 |
| `calculatePersonaCoverage` | S6-1 to S6-4 | Story 6 AC1-AC4 |
| `identifyGaps` | S7-1 to S7-4 | Story 7 AC1-AC4 |
| `traceJourneyCompleteness` | S8-1 to S8-4 | Story 8 AC1-AC4 |
| `surfaceDecisions` | S9-1 to S9-4 | Story 9 AC1-AC4 |
| `exportGapListCsv` | S15-1 to S15-4 | Story 15 AC1-AC4 |

---

## Imports Required from Codey

### `src/catalogue-coverage-map/index.js`
```js
export { matchByEventTrigger }         // (item, events) → MappingTuple[]
export { matchByDomainAndFeature }     // (item, states, events) → MappingTuple[]
export { filterByReleaseScope }        // (items, scope) → CatalogueItem[]
export { filterByClaimTypeRelevance }  // (items, claimTypeId) → CatalogueItem[]
export { calculatePersonaCoverage }    // (persona, mappings, states, events, roleMapping) → CoverageResult
export { identifyGaps }                // (mappings, events, persona?) → Gap[]
export { traceJourneyCompleteness }    // (persona, coverageMap, graph) → JourneyResult | null
export { surfaceDecisions }            // (events, items) → Decision[]
export { exportGapListCsv }            // (gaps, persona?) → { content, filename, mimeType }
```

### `src/ui-catalogue-coverage-map/index.js`
```js
export { getPersonaRoleMapping }       // (personaId) → { roles: string[], isCrossCutting: boolean } | undefined
```

---

## Key Contracts

### MappingTuple
```js
{ catalogueRef: string, stateId: string, eventId: string | null, matchConfidence: 'exact' | 'inferred' }
```

### CoverageResult (R2)
```js
{
  persona: string,
  resolvedRoles: string[],
  totalStates: number,
  coveredStates: number,
  totalTransitions: number,
  coveredTransitions: number,
  coveragePct: number | null,   // null when isCrossCutting
  isCrossCutting: boolean,
}
```

### Gap (R3)
```js
{ stateId: string, eventId: string | null, severity: 'critical' | 'gap' | 'partial', ... }
// ordered: critical first, then gap, then partial
```

### JourneyResult (R4)
```js
{
  persona: string | null,
  canReachTerminal: boolean,
  bestPathCoverage: number,
  worstPathCoverage: number,
  blockingGaps: Array<{ stateId: string }>,
}
// returns null when persona is cross-cutting (passed as null)
```

### Decision (R5)
```js
{ source: 'model' | 'catalogue', id?: string, ref?: string, ... }
```

### exportGapListCsv return
```js
{ content: string, filename: string, mimeType: 'text/csv' }
// filename: 'coverage-gaps-{persona}.csv' or 'coverage-gaps-all.csv'
```

### Persona-role mapping data
- Lives in `data/persona-role-mapping.json` (or loaded by `getPersonaRoleMapping`)
- 23 entries, each: `{ roles: string[], isCrossCutting: boolean }`
- `litigation-friend` maps to `["Claimant", "Defendant"]`
- 6 personas (citizen, applicant, non-party, other-party, org-admin, professional-org) have `roles: []` and `isCrossCutting: true`

---

## Notes for Codey

- `traceJourneyCompleteness` receives `persona = null` for cross-cutting personas — return `null` directly.
- `filterByReleaseScope` default scope `'r1+tbc'` means `release1 !== 'no'`.
- `filterByClaimTypeRelevance` patterns: `claims-counterclaim` → counterclaim only; `enforcement-*` → enforcement only; everything else → all.
- `identifyGaps` severity logic: zero mappings + `hasOpenQuestions` → `critical`; zero mappings → `gap`; some but not all events covered → `partial`.
- `surfaceDecisions` incomplete catalogue criteria: `userStory === null` OR `ucdRequired === null` OR `notes` contains `"TBC"`.
- The graph passed to `traceJourneyCompleteness` is `{ states: State[], transitions: Transition[] }`.
- Terminal states are identified by `isEndState: true` on the State object.
- Stories 10-14 (render-coverage-on-graph, node-detail-panel, cross-cutting-requirements, persona-selector-filter, summary-dashboard-cards) require a React UI component — not covered by these tests; test via Playwright separately.
