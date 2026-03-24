# Handoff: Alex -> Nigel (data-loading)

## Summary

Feature spec complete for `data-loading`. This is a TECHNICAL feature (no user stories needed).

## What to Test

5 exported functions from `src/data-loading/index.ts`:

1. **loadModelData** -- async, reads JSON fixtures. For unit tests, use inline data instead of disk I/O.
2. **populateStore** -- sets store state with provided data arrays.
3. **getModelDataForClaimType** -- pure filter by claimType. Transitions filtered by matching `from` to state IDs.
4. **getAllClaimTypeIds** -- returns all 7 ClaimTypeId values.
5. **createPopulatedStore** -- convenience: create + populate in one call.

## Key Edge Cases

- Unknown claimTypeId in getModelDataForClaimType returns empty arrays
- Empty input arrays
- populateStore merges (only replaces fields provided)
- getAllClaimTypeIds always returns exactly 7

## Spec Location

`.blueprint/features/feature_data-loading/FEATURE_SPEC.md`
