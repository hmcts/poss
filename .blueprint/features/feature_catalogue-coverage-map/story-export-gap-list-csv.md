# Story: Export Gap List as CSV

## User Story
**As a** business analyst
**I want** to export the current gap list as a CSV file
**so that** I can share it in backlog refinement sessions and track resolution offline.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, step 8)
- Follows existing `exportCatalogueCsv` pattern from `src/product-catalogue/index.ts`
- Includes "also has WA gap" cross-reference column (OQ2 resolution)

## Acceptance Criteria

**AC1: CSV contains gap details**
- **Given** the gap list has entries
- **When** the analyst clicks the export button
- **Then** a CSV file downloads containing columns: State, Event, Severity, Persona, Domain Group, Open Questions

**AC2: WA cross-reference column included**
- **Given** a gap item that also appears as a WA gap
- **When** the CSV is generated
- **Then** the "Also Has WA Gap" column shows "yes" for that row

**AC3: Filters reflected in export**
- **Given** a persona is selected and release scope is set to "R1 only"
- **When** the CSV is exported
- **Then** it contains only gaps matching the active filters

**AC4: Filename includes context**
- **Given** the analyst exports with persona "claimant" selected
- **When** the file downloads
- **Then** the filename is `coverage-gaps-claimant.csv` (or `coverage-gaps-all.csv` if no persona selected)

## Out of Scope
- Exporting the full mapping tuples (not just gaps)
- PDF export format
- Automated email distribution of the CSV
