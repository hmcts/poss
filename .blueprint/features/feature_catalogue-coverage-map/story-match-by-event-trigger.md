# Story: Match Catalogue Items to Events by eventTrigger

## User Story
**As a** business analyst
**I want** catalogue items to be automatically matched to state model events using the `eventTrigger` field
**so that** I can see which events have defined product requirements without manual cross-referencing.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R1)
- This is the primary matching strategy in the mapping engine
- `eventTrigger` is a free-text field on catalogue items; event names come from the state model
- Match confidence is either `exact` (substring match found) or `none` (no match)

## Acceptance Criteria

**AC1: Exact substring match**
- **Given** a catalogue item with `eventTrigger` containing text that matches an event name (case-insensitive substring)
- **When** the mapping engine runs
- **Then** a mapping tuple `{ catalogueRef, stateId, eventId, matchConfidence: 'exact' }` is produced

**AC2: No match returns empty**
- **Given** a catalogue item with `eventTrigger` that does not match any event name
- **When** the mapping engine runs
- **Then** no mapping tuple is produced for that item-event pair

**AC3: Null eventTrigger skipped**
- **Given** a catalogue item where `eventTrigger` is null
- **When** the mapping engine runs
- **Then** the item is skipped for eventTrigger matching (may still match via other strategies)

**AC4: One-to-many mapping**
- **Given** a catalogue item whose `eventTrigger` matches multiple events
- **When** the mapping engine runs
- **Then** one mapping tuple is produced per matched event

## Out of Scope
- Matching by `domainGroup` or `feature` (separate story)
- Confidence scoring beyond exact/none for this strategy
- Manual override of matches
- UI rendering of matches
