# Story: Filter Catalogue Items by Claim-Type Relevance

## User Story
**As a** business analyst
**I want** catalogue items scoped to the correct claim types based on their `domainGroup`
**so that** coverage calculations are not inflated by requirements irrelevant to the active claim type.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (Rule R6)
- `claims-counterclaim` (12 items) -> Counter Claim types only
- `enforcement-*` (29 items) -> Enforcement only
- `claims-general-application` (21 items) -> General Applications only
- Remaining 227 items -> all claim types

## Acceptance Criteria

**AC1: Counterclaim items scoped correctly**
- **Given** catalogue items with `domainGroup === "claims-counterclaim"`
- **When** the active claim type is MAIN_CLAIM_ENGLAND
- **Then** those items are excluded from the filtered set

**AC2: Enforcement items scoped correctly**
- **Given** catalogue items with `domainGroup` matching `enforcement-*`
- **When** the active claim type is ENFORCEMENT
- **Then** those items are included; when the claim type is anything else, they are excluded

**AC3: General items apply to all claim types**
- **Given** catalogue items with `domainGroup` not matching any claim-type-specific pattern
- **When** any claim type is active
- **Then** those items are included

**AC4: Pure function with ClaimTypeId input**
- **Given** a list of catalogue items and a `ClaimTypeId` value
- **When** the relevance filter is called
- **Then** it returns only items relevant to that claim type

## Out of Scope
- Cross-claim-type comparison views
- UI claim type selector (exists in app-shell)
