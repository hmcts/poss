# Story: Display Node Detail Panel with Mapped Catalogue Items

## User Story
**As a** business analyst
**I want** to click a graph node and see its state details, associated events, and mapped catalogue items
**so that** I can understand exactly what requirements cover each state.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, step 5-6)
- Extends the existing State Explorer detail panel pattern
- Shows state info, events at that state, mapped catalogue items per event, and gaps

## Acceptance Criteria

**AC1: Panel opens on node click**
- **Given** the coverage graph is displayed
- **When** the analyst clicks a state node
- **Then** a detail panel opens showing the state name, technical name, and completeness

**AC2: Events listed with catalogue mappings**
- **Given** the detail panel is open for a state
- **When** the analyst views the events section
- **Then** each event at that state is listed with its mapped catalogue item refs and match confidence

**AC3: Gaps highlighted in the panel**
- **Given** the detail panel is open and some events have no catalogue mappings
- **When** the analyst views the events section
- **Then** uncovered events are visually marked as gaps with a distinct indicator

**AC4: Panel closes on outside click or second node click**
- **Given** the detail panel is open
- **When** the analyst clicks outside the panel or clicks a different node
- **Then** the panel closes (or updates to the new node)

## Out of Scope
- Edge/transition detail panel (can follow same pattern)
- Editing catalogue items from the panel
- Persona filtering within the panel
