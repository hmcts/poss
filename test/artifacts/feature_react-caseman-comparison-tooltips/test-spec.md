# Test Spec — react-caseman-comparison-tooltips

## Understanding

Pure UI feature: 10 tooltips added to the Caseman Comparison page. No logic module exists in the spec, so tests target a small helper module `src/ui-caseman-tooltips/index.js` that Codey must create alongside the React changes. The helper centralises all static tooltip strings and the one dynamic builder (Tooltip 7 domain blocks), making them unit-testable without a DOM.

The helper exports:
- `getTooltipText(key)` — returns a static string for each of the 9 fixed tooltip keys
- `buildDomainTooltip(domain, count, waTaskNames)` — builds the dynamic domain-block tooltip string

## AC to Test ID Mapping

| Tooltip | AC | Test ID | Description |
|---------|----|---------|-------------|
| T1 Covered card | summary-card AC1 | TT-1 | getTooltipText('covered') returns threshold string |
| T1 Partial card | summary-card AC2 | TT-2 | getTooltipText('partial') returns threshold string |
| T1 Gap card | summary-card AC3 | TT-3 | getTooltipText('gap') returns threshold string |
| T3 Italic legend | summary-card AC4 | TT-4 | getTooltipText('italicRows') returns verbatim string |
| T4 Export button | summary-card AC5 | TT-5 | getTooltipText('exportJson') returns verbatim string |
| T5 New badge | states AC1 | TT-6 | getTooltipText('badgeNew') returns verbatim string |
| T6 No match badge | states AC2 | TT-7 | getTooltipText('badgeNoMatch') returns verbatim string |
| T7 Domain block | tasks AC1 | TT-8 | buildDomainTooltip with tasks returns "Domain: N events — WA tasks: ..." |
| T7 Domain no tasks | tasks AC2 | TT-9 | buildDomainTooltip with no tasks returns "No WA tasks covering this domain" |
| T8 Unclassified block | tasks AC3 | TT-10 | getTooltipText('unclassifiedBlock') returns verbatim data-quality string |
| T9 Source auto | events AC1 | TT-11 | getTooltipText('sourceAuto') returns verbatim string |
| T10 Unclassified option | events AC3 | TT-12 | getTooltipText('unclassifiedOption') returns verbatim 83% string |
| All keys | structural | TT-13 | All getTooltipText keys return non-empty strings |
| Unknown key | structural | TT-14 | getTooltipText with unknown key returns empty string or throws |

## Key Assumptions

- Bridge module is at `src/ui-caseman-tooltips/index.js`.
- `getTooltipText` returns the exact verbatim strings from the feature spec.
- `buildDomainTooltip('Unclassified', ...)` is NOT used — Unclassified uses getTooltipText('unclassifiedBlock') instead.
- `buildDomainTooltip` format: `"${domain}: ${count} events — WA tasks: ${names}"` or `"${domain}: ${count} events — No WA tasks covering this domain"`.
