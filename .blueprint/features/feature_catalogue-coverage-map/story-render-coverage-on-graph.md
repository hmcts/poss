# Story: Render Coverage Colour-Coding on Graph Nodes and Edges

## User Story
**As a** business analyst
**I want** state graph nodes and edges colour-coded by catalogue coverage level
**so that** I can immediately see where coverage is strong and where gaps exist.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, happy path step 2)
- Extends existing State Explorer React Flow graph
- Colours: green (fully covered), amber (partial), red (no coverage), grey (not applicable)
- Colour must not be the sole indicator -- text labels/icons required for accessibility

## Acceptance Criteria

**AC1: Fully covered nodes are green**
- **Given** a state where all persona-relevant events have at least one mapped catalogue item
- **When** the coverage graph renders
- **Then** the node has a green background with a coverage badge showing "100%"

**AC2: Uncovered nodes are red**
- **Given** a state with zero mapped catalogue items for the active filter
- **When** the coverage graph renders
- **Then** the node has a red background with a "gap" text label

**AC3: Partial coverage nodes are amber**
- **Given** a state where some but not all events have catalogue coverage
- **When** the coverage graph renders
- **Then** the node has an amber background with a badge showing the coverage percentage

**AC4: Accessibility -- not colour alone**
- **Given** any coverage-coded node
- **When** the graph renders
- **Then** a text label or icon supplements the colour (e.g. percentage badge, gap icon)

## Out of Scope
- Click-to-drill-down behaviour (separate story)
- Persona filtering toggle UI
- Edge coverage styling (can be a follow-on)
