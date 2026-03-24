## Handoff: Nigel (Tester) -> Implementation
**Feature:** data-ingestion

### Spec Rating
FEEDBACK: {"rating":4,"issues":["BreathingSpaceEntry shape undefined","Format B matching algorithm unspecified","Event index base (0 vs 1) ambiguous","Stayed vs BreathingSpace structural differences unclear","State label lookup rules not detailed"],"rec":"proceed"}

### Tests Created
- **Test spec:** `test/artifacts/feature_data-ingestion/test-spec.md`
- **Test file:** `test/feature_data-ingestion.test.js` (node:test runner)
- **25 test cases** across 8 describe blocks

### What Tests Pin Down
- Format A: Y/N -> boolean, blank = false, ID = `{claimTypeId}:{0-based index}`
- Format B: comma/semicolon split, case-insensitive KNOWN_ROLES match, permissive on unknowns
- Open questions: 6 markers, case-insensitive, empty string = false
- Completeness: 0 for empty, rounded integer, (clean/total)*100
- BreathingSpaceEntry: expects stateFrom, stateTo, isConditional, conditions[]

### Assumptions for Implementer
- All tests skip gracefully until `src/data-ingestion/index.js` exists
- BreathingSpaceEntrySchema must be exported from the ingestion module
- 2/3 completeness rounds to 67 (Math.round)
- loadStatesAndTransitions is async and reads from `src/data-ingestion/states/`
