# Story — WA Enum Definitions

## User story

As a downstream feature developer, I want typed enum objects for WA task context and alignment status so that all WA features use a single, validated set of domain values.

---

## Context / scope

- Module: `src/data-model/` (new file `wa-enums.ts`)
- Follows the existing pattern in `src/data-model/enums.ts` (`as const` object + inferred type)
- Two enums defined:
  - `WaTaskContext`: `claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general`
  - `WaAlignmentStatus`: `aligned`, `partial`, `gap`
- These enums are consumed by `WaTaskSchema` (see story-wa-schemas.md) and by downstream features (wa-ingestion, wa-task-engine)

---

## Acceptance criteria

**AC-1 -- WaTaskContext enum contains all five context values**
- Given the `WaTaskContext` object is imported from `wa-enums.ts`,
- When I access its values,
- Then it contains exactly: `claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general` (five values, no more, no fewer).

**AC-2 -- WaAlignmentStatus enum contains all three alignment tiers**
- Given the `WaAlignmentStatus` object is imported from `wa-enums.ts`,
- When I access its values,
- Then it contains exactly: `aligned`, `partial`, `gap` (three values, no more, no fewer).

**AC-3 -- TypeScript types are inferred and exported**
- Given `WaTaskContext` and `WaAlignmentStatus` are defined as `as const` objects,
- When I import `WaTaskContextValue` and `WaAlignmentStatusValue` types,
- Then TypeScript restricts assignment to only the values defined in the respective enum objects.

**AC-4 -- Enum values are string literals**
- Given a consumer reads a value from `WaTaskContext` or `WaAlignmentStatus`,
- When they check the runtime type,
- Then each value is a string (not a number or symbol).

**AC-5 -- File is co-located with existing enums**
- Given the new file `wa-enums.ts` is created,
- When I inspect the directory structure,
- Then it resides in `src/data-model/` alongside the existing `enums.ts`.

---

## Out of scope

- Zod schema definitions using these enums (covered in story-wa-schemas.md)
- Populating tasks or mappings with these values (wa-ingestion concern)
- Re-exporting from an index file (implementation decision for Codey)
