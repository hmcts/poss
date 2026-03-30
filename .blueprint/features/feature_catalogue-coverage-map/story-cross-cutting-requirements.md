# Story: Display Cross-Cutting Requirements Section

## User Story
**As a** business analyst
**I want** catalogue items that do not map to specific states (e.g. accounts, notifications) shown in a separate section
**so that** I can review them without them being forced onto graph nodes where they do not belong.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (section 4, "Unmappable items")
- Cross-cutting items have `matchConfidence: 'none'` from the mapping engine
- Examples: account creation, notifications, accessibility requirements

## Acceptance Criteria

**AC1: Unmapped items shown separately**
- **Given** catalogue items with no mapping tuples (matchConfidence 'none' for all events)
- **When** the coverage map page renders
- **Then** they appear in a "Cross-Cutting Requirements" section below or beside the graph

**AC2: Items grouped by domainGroup**
- **Given** multiple unmapped catalogue items
- **When** the cross-cutting section renders
- **Then** items are grouped by their `domainGroup` field

**AC3: Count displayed**
- **Given** unmapped items exist
- **When** the section header renders
- **Then** it shows the total count (e.g. "Cross-Cutting Requirements (24)")

**AC4: Items not included in graph coverage percentages**
- **Given** unmapped catalogue items
- **When** coverage percentages are calculated for graph nodes
- **Then** these items do not inflate or deflate node-level coverage numbers

## Out of Scope
- Linking cross-cutting items to specific personas
- Filtering cross-cutting items by MoSCoW priority
