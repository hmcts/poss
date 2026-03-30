# Story: Surface Decisions from Open Questions and Incomplete Items

## User Story
**As a** business analyst
**I want** a unified list of open questions from the event model and incomplete catalogue items
**so that** I can see all unresolved decisions in one place and prioritise them.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R5)
- Event model flags: `hasOpenQuestions`
- Catalogue incompleteness: `userStory === null`, `ucdRequired === null`, notes containing "TBC"

## Acceptance Criteria

**AC1: Event model open questions collected**
- **Given** events with `hasOpenQuestions === true`
- **When** the decision surface is built
- **Then** each such event appears in the decision list with `source: 'model'`

**AC2: Catalogue incomplete items collected**
- **Given** catalogue items where `userStory === null` OR `ucdRequired === null` OR `notes` contains "TBC"
- **When** the decision surface is built
- **Then** each such item appears in the decision list with `source: 'catalogue'`

**AC3: Source attribution present**
- **Given** the decision list
- **When** it is returned
- **Then** every entry has a `source` field indicating `'model'` or `'catalogue'`

**AC4: No duplicates**
- **Given** an event that has `hasOpenQuestions` AND a catalogue item mapped to it with "TBC" in notes
- **When** the decision surface is built
- **Then** both appear as separate entries (one per source), not merged

## Out of Scope
- Prioritisation ranking algorithm (decisions are listed, not scored)
- UI rendering of the decision list
- Editing or resolving decisions through the UI
