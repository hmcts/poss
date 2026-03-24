# Test Spec: data-loading

## Module Under Test
`src/data-loading/index.ts` (imported via `../src/data-loading/index.js`)

## Test ID Prefix
DL-

## Test Strategy
- All tests use inline fixture data (no disk I/O)
- Tests cover all 5 exported functions
- Edge cases: empty arrays, unknown claim types, partial population

## Test Cases

### getAllClaimTypeIds
- DL-1: Returns exactly 7 IDs
- DL-2: Contains all expected ClaimTypeId values
- DL-3: Returns strings (not objects)

### getModelDataForClaimType
- DL-4: Filters states by claimType
- DL-5: Filters transitions by matching from-state IDs
- DL-6: Filters events by claimType
- DL-7: Unknown claimType returns empty arrays
- DL-8: Empty input arrays return empty arrays
- DL-9: Does not include transitions from other claim types
- DL-10: Mixed claim types -- only returns requested type

### populateStore
- DL-11: Populates store with claimTypes
- DL-12: Populates store with states, transitions, events
- DL-13: Partial populate only updates provided fields
- DL-14: Overwrites previous data for provided fields

### createPopulatedStore
- DL-15: Creates store with all data accessible via getState()
- DL-16: Store has correct claimTypes count
- DL-17: Store has correct states count
- DL-18: Created store has default activeClaimType of null

## Coverage Target
18 tests, all using inline data.
