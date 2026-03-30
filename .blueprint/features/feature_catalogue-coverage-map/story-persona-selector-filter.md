# Story: Persona Selector Filters Graph and Metrics

## User Story
**As a** business analyst
**I want** to select a persona and see the graph, gap list, and summary recalculate for that persona
**so that** I can analyse coverage for one user type at a time.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, steps 3-4)
- Persona list comes from the catalogue's distinct persona values
- "No persona selected" shows aggregate coverage across all personas
- Selection affects graph colours, gap list, and summary metrics simultaneously

## Acceptance Criteria

**AC1: Persona dropdown populated from catalogue**
- **Given** the coverage map page loads
- **When** the persona selector renders
- **Then** it lists all distinct personas from the catalogue data, plus an "All personas" default option

**AC2: Graph recolours on persona selection**
- **Given** a persona is selected
- **When** the graph updates
- **Then** nodes show coverage for only that persona's relevant events, and irrelevant states are dimmed

**AC3: Gap list filters to persona**
- **Given** a persona is selected
- **When** the gap list updates
- **Then** it shows only gaps relevant to that persona's resolved roles

**AC4: Default is aggregate**
- **Given** no persona is explicitly selected
- **When** the page displays
- **Then** coverage reflects all catalogue items (aggregate view)

## Out of Scope
- Multi-persona comparison (side-by-side)
- Persona journey path highlighting on the graph
