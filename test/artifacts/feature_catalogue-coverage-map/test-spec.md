# Test Spec: catalogue-coverage-map

## Understanding
This feature builds a mapping engine that links product catalogue items (289 requirements)
to the state/event model, then calculates per-persona coverage, identifies gaps, traces
journey completeness, and surfaces open decisions. Stories 1-9 and 15 are pure logic
(testable with Node test runner). Stories 10-14 are UI/component rendering (tested via
Playwright). The mapping engine (stories 1-2) produces tuples that all downstream stories
consume. Persona-role mapping (story 3) is a prerequisite for persona-based analysis
(stories 6, 8, 13).

## AC-to-Test Mapping

| Story | ID | AC | Test ID | Testable |
|-------|----|----|---------|----------|
| 1 match-by-event-trigger | S1 | AC1 exact substring | S1-1 | logic |
| 1 match-by-event-trigger | S1 | AC2 no match empty | S1-2 | logic |
| 1 match-by-event-trigger | S1 | AC3 null skipped | S1-3 | logic |
| 1 match-by-event-trigger | S1 | AC4 one-to-many | S1-4 | logic |
| 2 match-by-domain-and-feature | S2 | AC1 domainGroup match | S2-1 | logic |
| 2 match-by-domain-and-feature | S2 | AC2 feature name match | S2-2 | logic |
| 2 match-by-domain-and-feature | S2 | AC3 inferred confidence | S2-3 | logic |
| 2 match-by-domain-and-feature | S2 | AC4 exact takes precedence | S2-4 | logic |
| 3 persona-role-mapping-data | S3 | AC1 all 23 entries | S3-1 | logic |
| 3 persona-role-mapping-data | S3 | AC2 multi-role | S3-2 | logic |
| 3 persona-role-mapping-data | S3 | AC3 cross-cutting flag | S3-3 | logic |
| 3 persona-role-mapping-data | S3 | AC4 loader function | S3-4 | logic |
| 4 filter-by-release-scope | S4 | AC1 default R1+TBC | S4-1 | logic |
| 4 filter-by-release-scope | S4 | AC2 R1 only | S4-2 | logic |
| 4 filter-by-release-scope | S4 | AC3 All | S4-3 | logic |
| 4 filter-by-release-scope | S4 | AC4 pure function | S4-4 | logic |
| 5 filter-by-claim-type-relevance | S5 | AC1 counterclaim scoped | S5-1 | logic |
| 5 filter-by-claim-type-relevance | S5 | AC2 enforcement scoped | S5-2 | logic |
| 5 filter-by-claim-type-relevance | S5 | AC3 general applies all | S5-3 | logic |
| 5 filter-by-claim-type-relevance | S5 | AC4 pure function | S5-4 | logic |
| 6 calculate-persona-coverage | S6 | AC1 output shape | S6-1 | logic |
| 6 calculate-persona-coverage | S6 | AC2 only relevant events | S6-2 | logic |
| 6 calculate-persona-coverage | S6 | AC3 percentage correct | S6-3 | logic |
| 6 calculate-persona-coverage | S6 | AC4 cross-cutting flagged | S6-4 | logic |
| 7 identify-gaps-and-severity | S7 | AC1 gap on zero mappings | S7-1 | logic |
| 7 identify-gaps-and-severity | S7 | AC2 critical with OQ | S7-2 | logic |
| 7 identify-gaps-and-severity | S7 | AC3 partial coverage | S7-3 | logic |
| 7 identify-gaps-and-severity | S7 | AC4 ordered by severity | S7-4 | logic |
| 8 trace-journey-completeness | S8 | AC1 output shape | S8-1 | logic |
| 8 trace-journey-completeness | S8 | AC2 blocking gaps | S8-2 | logic |
| 8 trace-journey-completeness | S8 | AC3 best/worst paths | S8-3 | logic |
| 8 trace-journey-completeness | S8 | AC4 cross-cutting null | S8-4 | logic |
| 9 surface-decisions | S9 | AC1 model OQs collected | S9-1 | logic |
| 9 surface-decisions | S9 | AC2 catalogue incomplete | S9-2 | logic |
| 9 surface-decisions | S9 | AC3 source attribution | S9-3 | logic |
| 9 surface-decisions | S9 | AC4 no duplicates | S9-4 | logic |
| 10 render-coverage-on-graph | S10 | AC1-4 | -- | UI-only, tested via Playwright |
| 11 node-detail-panel | S11 | AC1-4 | -- | UI-only, tested via Playwright |
| 12 cross-cutting-requirements | S12 | AC1-4 | -- | UI-only, tested via Playwright |
| 13 persona-selector-filter | S13 | AC1-4 | -- | UI-only, tested via Playwright |
| 14 summary-dashboard-cards | S14 | AC1-4 | -- | UI-only, tested via Playwright |
| 15 export-gap-list-csv | S15 | AC1 CSV columns | S15-1 | logic |
| 15 export-gap-list-csv | S15 | AC2 WA cross-ref | S15-2 | logic |
| 15 export-gap-list-csv | S15 | AC3 filters reflected | S15-3 | logic |
| 15 export-gap-list-csv | S15 | AC4 filename context | S15-4 | logic |

## Key Assumptions
- `matchByEventTrigger(item, events)` returns mapping tuples; case-insensitive substring match
- `matchByDomainAndFeature(item, states, events)` returns inferred tuples; deduplicates against exact matches
- `getPersonaRoleMapping(personaId)` returns `{ roles: string[], isCrossCutting: boolean }` or undefined
- `filterByReleaseScope(items, scope)` accepts `'r1'|'r1+tbc'|'all'`; default is `'r1+tbc'`
- `filterByClaimTypeRelevance(items, claimTypeId)` uses domainGroup pattern matching
- `calculatePersonaCoverage(persona, mappings, states, events, roleMapping)` returns R2 shape
- `identifyGaps(mappings, events, persona?)` returns ordered gap list per R3
- `traceJourneyCompleteness(persona, coverageMap, graph)` returns R4 shape or null
- `surfaceDecisions(events, items)` returns unified decision list per R5
- `exportGapListCsv(gaps, persona?)` returns `{ content, filename, mimeType }` per story 15
- Event model events have `actors: Record<string, boolean>` and `hasOpenQuestions: boolean`
- State graph has `from`/`to` transitions; terminal states are `isEndState: true`
