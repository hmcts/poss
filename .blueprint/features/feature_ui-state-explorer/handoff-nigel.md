# Handoff: Nigel -> Codey (ui-state-explorer)

## Tests Written
18 tests in `test/feature_ui-state-explorer.test.js`, prefix USE-1 through USE-18.

## Test Spec
`test/artifacts/feature_ui-state-explorer/test-spec.md`

## Key Implementation Notes
1. `calculateAutoLayout` must do topological layering: nodes with no incoming edges at y=0, dependents in subsequent layers. Nodes in same layer spread horizontally.
2. `prepareGraphData` calls `buildGraph` then `calculateAutoLayout`.
3. `prepareNodeWithBadge` delegates to `getCompletenessBadge` from uncertainty-display.
4. `prepareStateDetailPanel` delegates to `getStateDetail` from state-explorer, then enriches events with `getEventIndicator` from uncertainty-display. `actors` field on formatted events must be an array of actor names (those with `true` value).
5. Legend functions return static arrays matching the color/style constants from state-explorer and uncertainty-display.
6. All functions must be pure.

## Files to Create
- `src/ui-state-explorer/index.ts` (implementation)
- `src/ui-state-explorer/index.js` (bridge)

## Run Tests
```bash
node --experimental-strip-types --test test/feature_ui-state-explorer.test.js
```
