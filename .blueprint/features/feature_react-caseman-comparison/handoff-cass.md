## Handoff Summary
**For:** Nigel
**Feature:** react-caseman-comparison

### Key Decisions
- Stories are in dependency order: data-prep must be complete before any tab story can be tested
- `source: "auto"` vs `source: "curated"` is a first-class distinction — both rendering (italic/faded) and export correctness depend on it
- Coverage % formula is `(covered + partial * 0.5) / total * 100`; partial is half-credit, not zero
- BA edits live in React component state only; they reach `data/caseman-mappings.json` only on explicit export — never auto-save
- Tasks tab block chart is a custom SVG component with no existing pattern; treat as net-new and include a visible accessible table fallback

### Files Created
- `story-caseman-data-prep.md`
- `story-caseman-states-tab.md`
- `story-caseman-events-tab.md`
- `story-caseman-tasks-tab.md`

### Open Questions
- None inherited from Alex's handoff that affect story scope; open questions (max state count per claim type, WA domain linkage via events vs manual) are flagged in the spec but do not block story implementation at prototype fidelity

### Critical Context
- data-prep AC3 (auto-match thresholds) and AC4 (mapping precedence) are the core rules all three tabs rely on — test these exhaustively with edge cases (empty task codes, all-gap dataset, partial JSON file)
- Events tab AC4–AC6 cover the full BA editing loop; test Save/Cancel state isolation (cancelling must not dirty the row), summary card recalculation after edits, and that the exported JSON contains only curated rows (or clearly marks source)
- Tasks tab block chart: test that block widths sum to 100% of chart width, WA band spans are correct for multi-domain tasks, and coverage colours update when `wa-mappings.json` changes domain linkage
- Deep links (Events AC3) require `newEventName` or `newStateName` to be non-null — test gap rows produce no link element at all
- CSV export (Events AC6): test comma and newline escaping; column order must match Rule 7 exactly
