# Handoff: Nigel -> Codey

## Feature
ui-scenario-analysis

## Test Location
`test/feature_ui-scenario-analysis.test.js`

## Test Spec
`test/artifacts/feature_ui-scenario-analysis/test-spec.md`

## Test Count
19 tests (USA-01 through USA-19)

## Notes for Codey
- All 7 functions need to be exported from `src/ui-scenario-analysis/index.ts`
- Bridge file needed at `src/ui-scenario-analysis/index.js`
- getImpactHighlights returns a Map<string, string> not a plain object
- getImpactSummary receives the raw model data + toggle IDs, internally calls analyzeImpact
- applyToggles calls toggleState (for each state), then toggleEvent (for each event), then toggleRole (for each role) in sequence
- Test fixtures use s1 as draft/initial, s2 as live/issued, s3 as end/closed, s4 as orphan
- Removing s2 breaks path from s1->s3, making s3 unreachable and s4 stays orphaned
