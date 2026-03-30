# Story: Match Catalogue Items by domainGroup and Feature Name

## User Story
**As a** business analyst
**I want** catalogue items to be matched to states and events using `domainGroup` and `feature` fields when no `eventTrigger` match exists
**so that** items without explicit event triggers still appear on the coverage map.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R1)
- This is the secondary/fallback matching strategy
- `domainGroup` matches against state domain groupings; `feature` matches against event descriptions
- Matches from this strategy have confidence `inferred`

## Acceptance Criteria

**AC1: domainGroup match**
- **Given** a catalogue item with a `domainGroup` that matches a state's domain grouping
- **When** the mapping engine runs
- **Then** a tuple `{ catalogueRef, stateId, eventId: null, matchConfidence: 'inferred' }` is produced linking the item to that state

**AC2: Feature name match**
- **Given** a catalogue item with a `feature` name that appears as a substring in an event description (case-insensitive)
- **When** the mapping engine runs
- **Then** a tuple with `matchConfidence: 'inferred'` is produced for that event

**AC3: Inferred matches flagged distinctly**
- **Given** mapping tuples produced by domainGroup or feature matching
- **When** results are returned
- **Then** every such tuple has `matchConfidence: 'inferred'` (never `exact`)

**AC4: eventTrigger match takes precedence**
- **Given** a catalogue item that matches an event via both `eventTrigger` (exact) and `feature` (inferred)
- **When** the mapping engine runs
- **Then** only the `exact` match tuple is produced for that item-event pair (no duplicate)

## Out of Scope
- ML/NLP fuzzy matching
- Manual override of inferred matches
- UI presentation of confidence indicators
