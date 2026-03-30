# Story: Filter Catalogue Items by Release Scope Toggle

## User Story
**As a** business analyst
**I want** to toggle between R1 only, R1+TBC, and All catalogue items
**so that** coverage calculations reflect the release scope I am analysing.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R7)
- R1 only: `release1 === "yes"` (234 items)
- R1+TBC: `release1 !== "no"` (262 items, **default**)
- All: all 289 items

## Acceptance Criteria

**AC1: Default scope is R1+TBC**
- **Given** no explicit toggle selection
- **When** the release scope filter is applied
- **Then** items where `release1 !== "no"` are included (262 items expected)

**AC2: R1 only excludes TBC and No**
- **Given** the toggle is set to "R1 only"
- **When** the filter is applied
- **Then** only items where `release1 === "yes"` are included

**AC3: All includes every item**
- **Given** the toggle is set to "All"
- **When** the filter is applied
- **Then** all 289 items are included regardless of `release1` value

**AC4: Pure function, no side effects**
- **Given** a list of catalogue items and a scope setting
- **When** the filter function is called
- **Then** it returns a new filtered array without mutating the input

## Out of Scope
- UI toggle component (separate story)
- Visual dimming of excluded items on the graph
