# Handoff: Alex -> Nigel (ui-event-matrix)

## Feature Summary
Pure logic orchestration layer for the event matrix UI. Composes `event-matrix` and `uncertainty-display` modules into 7 exported functions that a future React UI will consume.

## Key Design Decisions
1. `applyFiltersAndSearch` applies filters first, then search -- order matters for performance (filters narrow the set before substring matching).
2. `prepareTableData` enriches each actor grid row with an `EventIndicator` from uncertainty-display.
3. `prepareCsvDownload` wraps the CSV string with download metadata (filename, mimeType).
4. `getFilterOptions` extracts roles from `event.actors` keys, not from KNOWN_ROLES -- this ensures only roles present in the data appear as options.
5. `getEventMatrixSummary` operates on both the full and filtered event sets to provide context.

## Testing Guidance
- ~15-20 tests covering all 7 functions
- Test prefix: UEM-
- Use the same fixture pattern as feature_event-matrix.test.js (inline event objects)
- Verify composition: ensure applyFiltersAndSearch correctly chains filter then search
- Verify indicator enrichment in prepareTableData
- Verify summary stats with various filter combinations
- All functions must handle empty arrays

## Files to Reference
- Feature spec: `.blueprint/features/feature_ui-event-matrix/FEATURE_SPEC.md`
- Dependency: `src/event-matrix/index.ts`
- Dependency: `src/uncertainty-display/index.ts`
- Data model: `src/data-model/schemas.ts`, `src/data-model/enums.ts`
