# Handoff: Alex -> Nigel

## Feature: uncertainty-display

Feature spec is complete at `FEATURE_SPEC.md`. This is a pure logic module (no UI/React). Seven exported functions covering uncertainty classification, colour mapping, badge generation, event indicators, state classification, and summary aggregation.

Key decisions:
- Threshold boundaries: 100/50/0 for complete/partial/low/unknown
- Colour language follows existing codebase conventions (green/amber/grey)
- getUncertaintyColor accepts any string but returns grey for unrecognised levels
- overallLevel in summary uses worst-case across all states

Ready for test specification and implementation.
