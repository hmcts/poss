# Story: Create Persona-to-Role Mapping Data File

## User Story
**As a** business analyst
**I want** the 23 catalogue personas mapped to the 8 KNOWN_ROLES in a static data file
**so that** persona-based filtering can connect catalogue requirements to event model actors.

## Context
- Feature spec: `.blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md` (OQ1 resolution)
- KNOWN_ROLES: Judge, Caseworker, Claimant, Defendant, LegalAdvisor, BailiffEnforcement, CourtAdmin, SystemAuto
- 6 personas (citizen, applicant, non-party, other-party, org-admin, professional-org) map to no role
- `litigation-friend` maps to both Claimant and Defendant

## Acceptance Criteria

**AC1: Mapping file created**
- **Given** the resolved persona-role mapping from the feature spec
- **When** `data/persona-role-mapping.json` is loaded
- **Then** it contains an entry for each of the 23 catalogue personas with an array of zero or more KNOWN_ROLES

**AC2: Multi-role mapping**
- **Given** the persona `litigation-friend`
- **When** its mapping is looked up
- **Then** it resolves to `["Claimant", "Defendant"]`

**AC3: Cross-cutting personas flagged**
- **Given** a persona with an empty roles array (e.g. `citizen`, `applicant`)
- **When** its mapping is looked up
- **Then** it includes `"isCrossCutting": true`

**AC4: Loader function available**
- **Given** the mapping file exists
- **When** the mapping engine imports it
- **Then** a typed function returns the mapping for any persona ID, or `undefined` for unknown personas

## Out of Scope
- UI for editing persona-role mappings
- Dynamic role discovery from event model columns
