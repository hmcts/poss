## Handoff Summary
**For:** Nigel (skipping Cass -- technical feature)
**Feature:** data-ingestion

### Key Decisions
- Two Excel format variants: Format A (Y/N actor columns) and Format B (free-text permissions). Parsing logic must branch on sheet name. See FEATURE_SPEC.md section 6, R1/R2.
- State/transition data is hand-coded JSON (from PDF diagrams), not parsed. Events are parsed from Excel.
- The empty "Counter Claim - Main Claim Closed" sheet is a known gap -- output empty array, log warning.
- Format B role matching is permissive (warn on unrecognised text, do not fail).
- `BreathingSpaceEntry` is a new type not yet in `src/data-model/schemas.ts` -- needs adding.

### Files Created
- `.blueprint/features/feature_data-ingestion/FEATURE_SPEC.md`

### Open Questions
- OQ1: Strict vs permissive Format B role matching (spec recommends permissive)
- OQ2: Whether "Counter Claim - Main Claim Closed" will ever be populated

### Critical Context
- **Key functions to test:** Format A parser, Format B parser (with role fuzzy-matching), open-question detector, completeness calculator, breathing-space/stayed label resolver, full pipeline end-to-end.
- **Data contracts:** All output must validate against Zod schemas in `src/data-model/schemas.ts`. Output files land in `data/`.
- **Edge cases:** Empty sheet (Counter Claim - Main Claim Closed); conditional "State after" values in breathing space matrix; events with no notes (hasOpenQuestions = false); states with zero events (completeness = 0); Format B cells with multiple roles in one string; Y/N columns with blank cells (treat as N).
- **Determinism:** Same inputs must produce byte-identical output. Test by running twice and diffing.
