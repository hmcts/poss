# Story: Calculate Per-Persona Coverage Percentage

## User Story
**As a** business analyst
**I want** to see what percentage of a persona's relevant states and transitions have catalogue coverage
**so that** I can assess whether the requirements for that persona are complete.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R2)
- Uses persona-role mapping to resolve catalogue persona to KNOWN_ROLES
- Filters events to those where the resolved role has `actors[role] === true`
- Cross-cutting personas (no role mapping) are flagged and excluded from journey calculations

## Acceptance Criteria

**AC1: Coverage output shape**
- **Given** a persona ID and the mapping engine results
- **When** coverage is calculated
- **Then** the result contains `{ persona, resolvedRoles, totalStates, coveredStates, totalTransitions, coveredTransitions, coveragePct, isCrossCutting }`

**AC2: Only persona-relevant events counted**
- **Given** a persona that resolves to role "Claimant"
- **When** coverage is calculated
- **Then** only states/transitions with events where `actors.Claimant === true` are counted in the total

**AC3: Coverage percentage correct**
- **Given** 10 persona-relevant states and 7 have at least one mapped catalogue item
- **When** coverage is calculated
- **Then** `coveragePct` is 70

**AC4: Cross-cutting personas flagged**
- **Given** a persona like "citizen" with no role mapping
- **When** coverage is calculated
- **Then** `isCrossCutting` is true and `coveragePct` is null

## Out of Scope
- Path-based journey tracing (separate story)
- Aggregate (all-persona) coverage calculation
- UI rendering of coverage data
