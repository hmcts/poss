# Story: Trace Persona Journey Completeness to Terminal States

## User Story
**As a** business analyst
**I want** to know whether a persona can reach a terminal state with full catalogue coverage along the path
**so that** I can identify blocking gaps that prevent a complete user journey.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R4)
- Terminal states: CLOSED, DRAFT_DISCARDED
- Traces all paths from initial state to terminal states in the state graph
- Reports best-covered and worst-covered paths

## Acceptance Criteria

**AC1: Output shape**
- **Given** a persona and the coverage map
- **When** journey completeness is calculated
- **Then** the result contains `{ persona, canReachTerminal, bestPathCoverage, worstPathCoverage, blockingGaps }`

**AC2: Blocking gaps identified**
- **Given** a path where a state has zero catalogue coverage for the persona
- **When** journey completeness is calculated
- **Then** that state appears in `blockingGaps` with its stateId

**AC3: Best and worst paths reported**
- **Given** multiple paths to terminal states with different coverage levels
- **When** journey completeness is calculated
- **Then** `bestPathCoverage` is the highest coverage percentage and `worstPathCoverage` is the lowest

**AC4: Cross-cutting personas excluded**
- **Given** a persona flagged as `isCrossCutting`
- **When** journey completeness is requested
- **Then** the function returns null (journey tracing is not applicable)

## Out of Scope
- Visual highlighting of paths on the graph
- Handling of BREATHING_SPACE / CASE_STAYED interruption loops
- Comparing journeys across personas
