# Story -- WA Data Validation Script

## User story

As a **developer maintaining the WA data files**, I want a validation script that checks both `data/wa-tasks.json` and `data/wa-mappings.json` against their Zod schemas so that I can verify data correctness at build time and get clear error messages when something is wrong.

---

## Context / scope

- This is a build-time validation script, not a UI feature.
- Follows the existing ingestion/validation pattern in `src/data-ingestion/index.ts`.
- Validates against `WaTaskSchema` and `WaTaskMappingSchema` from `src/data-model/schemas.ts`.
- The script reads the two JSON files, parses each record through the relevant Zod schema, and reports success or failure.
- Full feature spec: `.blueprint/features/feature_wa-ingestion/FEATURE_SPEC.md`

---

## Acceptance criteria

**AC-1 -- Script validates wa-tasks.json against WaTaskSchema**
- Given `data/wa-tasks.json` contains 17 valid task records,
- When the validation script is executed,
- Then every record is parsed through `WaTaskSchema` without error,
- And the script reports that all 17 task records passed validation.

**AC-2 -- Script validates wa-mappings.json against WaTaskMappingSchema**
- Given `data/wa-mappings.json` contains 17 valid mapping records,
- When the validation script is executed,
- Then every record is parsed through `WaTaskMappingSchema` without error,
- And the script reports that all 17 mapping records passed validation.

**AC-3 -- Validation failure reports which record failed and why**
- Given a task or mapping record that violates its schema (e.g. missing `taskName`, invalid `taskContext` enum value, wrong type for `eventIds`),
- When the validation script is executed,
- Then the script reports failure,
- And the error output identifies which record failed (by index or ID),
- And the error output includes the Zod validation error message describing what was wrong.

**AC-4 -- Script checks record counts**
- Given the validation script is executed,
- When both files are parsed,
- Then the script verifies that `wa-tasks.json` contains exactly 17 records,
- And that `wa-mappings.json` contains exactly 17 records,
- And if either count is wrong, the script reports a count mismatch error.

**AC-5 -- Script checks waTaskId referential integrity**
- Given both files are parsed,
- When the validation script runs,
- Then it verifies that every `waTaskId` in `wa-mappings.json` matches an `id` in `wa-tasks.json`,
- And that every task `id` has exactly one corresponding mapping,
- And if any mismatch is found, the script reports which IDs are missing or duplicated.

**AC-6 -- Script exits with appropriate status code**
- Given the validation script completes,
- When all checks pass, then the script exits with code 0 and prints a success summary,
- When any check fails, then the script exits with a non-zero code and prints all errors before exiting.

---

## Out of scope

- Validating eventIds against the event model (referential integrity between event names and the actual event data is a downstream concern for wa-task-engine)
- Automated re-ingestion or file generation (the JSON files are hand-authored)
- CI/CD pipeline integration (the script is run manually or via npm script; pipeline setup is separate)
- Runtime validation at application startup
