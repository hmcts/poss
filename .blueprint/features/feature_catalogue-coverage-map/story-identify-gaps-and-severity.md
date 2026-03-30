# Story: Identify Gaps and Classify Severity

## User Story
**As a** business analyst
**I want** states and transitions with no catalogue coverage identified and classified by severity
**so that** I can prioritise which gaps to address first.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R3)
- Three severity levels: critical (gap + open questions), gap (zero coverage), partial (some but not all events covered)
- Operates on the mapping tuples produced by the mapping engine

## Acceptance Criteria

**AC1: Gap identified when zero mappings**
- **Given** a state/transition with zero mapped catalogue items for the selected persona
- **When** gap analysis runs
- **Then** it appears in the gap list with severity `gap`

**AC2: Critical gap when open questions present**
- **Given** a state with zero catalogue coverage AND events flagged `hasOpenQuestions`
- **When** gap analysis runs
- **Then** it appears with severity `critical`

**AC3: Partial coverage identified**
- **Given** a state with 3 of 5 events covered by catalogue items
- **When** gap analysis runs
- **Then** it appears with severity `partial` and includes the count of uncovered events

**AC4: Gap list is ordered by severity**
- **Given** gaps of mixed severity
- **When** the gap list is returned
- **Then** critical gaps appear first, then gaps, then partial

## Out of Scope
- CSV export of gap list (separate story)
- UI rendering of gap indicators
- Aggregate vs persona-filtered gaps (uses the already-filtered mapping set)
