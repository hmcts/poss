# Story: Coverage Summary Dashboard Cards

## User Story
**As a** business analyst
**I want** summary cards showing coverage percentage, gap count, and per-domain-group breakdown
**so that** I get an at-a-glance overview without reading every node on the graph.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, step 7)
- Summary panel includes: total coverage %, gap count, items with open questions, per-domain-group breakdown
- Updates dynamically when persona or release scope toggles change

## Acceptance Criteria

**AC1: Total coverage percentage displayed**
- **Given** the coverage map is loaded
- **When** the summary panel renders
- **Then** it shows the overall coverage percentage for the active filters

**AC2: Gap count displayed**
- **Given** gaps exist in the current view
- **When** the summary panel renders
- **Then** it shows the count of states/transitions with zero coverage

**AC3: Domain group breakdown displayed**
- **Given** catalogue items span multiple domain groups
- **When** the summary panel renders
- **Then** each domain group shows its own coverage percentage

**AC4: Cards update on filter change**
- **Given** the summary panel is displayed
- **When** the analyst changes persona selection or release scope toggle
- **Then** all summary cards recalculate and update

## Out of Scope
- Per-claim-type comparison cards
- Historical coverage trend tracking
- Drill-down from summary cards to filtered views
