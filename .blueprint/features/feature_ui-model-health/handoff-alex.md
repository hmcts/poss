# Handoff: Alex -> Nigel

Feature: ui-model-health
Spec: .blueprint/features/feature_ui-model-health/FEATURE_SPEC.md

## Summary
Pure-logic view-model module with 6 exported functions that transform model-health and uncertainty-display outputs into dashboard-ready structures. No DOM, no side effects.

## Key decisions
- Reuses model-health and uncertainty-display as upstream dependencies
- ClaimType name formatting uses simple ID-to-label mapping via ClaimTypeId keys
- Colour scheme: green/amber/red for good/fair/poor
- Icon strings: unicode checkmark/cross characters

## Test focus areas
- Each function returns correct shape
- Edge cases: empty arrays, all-good data, all-poor data
- Threshold parameter for low-completeness
- Per-claim-type reachability with mixed results
- Colour mapping for each score level
