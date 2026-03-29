/**
 * Tooltip text constants and builders for the Caseman Comparison page.
 * All static tooltip strings are centralised here so React components
 * can import them and unit tests can verify them without a DOM.
 *
 * Codey: import from this module in Tooltip.tsx usages rather than
 * inlining the strings directly in JSX.
 */

const TOOLTIP_STRINGS = {
  // Summary card labels (tooltip 1)
  covered: 'Similarity > 0.8 — near-identical event name wording.',
  partial: 'Similarity 0.5–0.8 — related events but different granularity or phrasing.',
  gap: 'Similarity < 0.5 — no close match found in the new service model.',

  // Events tab controls (tooltips 3, 4, 9, 10)
  italicRows: 'Italic rows are auto-derived by name similarity. Normal weight = manually curated by a BA. Click any row to edit.',
  exportJson: 'Downloads in-session edits as caseman-mappings.json. Commit to repo to make curated mappings the new team baseline.',
  sourceAuto: 'Classification derived by name similarity. May be inaccurate — click Edit to override.',
  unclassifiedOption: 'Events with no BMS task code. Represents 83% of all events.',

  // States tab badges (tooltips 5, 6)
  badgeNew: 'Exists in new service model only — may be new functionality or a finer-grained breakdown of a Caseman status.',
  badgeNoMatch: 'No similar-named new service state found. May be a genuine gap or simply a naming difference.',

  // Tasks tab unclassified block (tooltip 8)
  unclassifiedBlock: "413 of 497 Caseman events have no BMS task code and cannot be classified by domain. This is a data quality issue in Caseman's source data, not a gap in the new service.",
};

/**
 * Returns the static tooltip string for a given key.
 * Returns '' for unknown keys.
 * @param {string} key
 * @returns {string}
 */
export function getTooltipText(key) {
  return TOOLTIP_STRINGS[key] ?? '';
}

/**
 * Builds the dynamic tooltip string for a domain block in the Tasks tab (tooltip 7).
 * @param {string} domain - domain name
 * @param {number} count - event count for this domain
 * @param {string[]|null|undefined} waTaskNames - names of WA tasks covering this domain
 * @returns {string}
 */
export function buildDomainTooltip(domain, count, waTaskNames) {
  const tasks = Array.isArray(waTaskNames) && waTaskNames.length > 0
    ? `WA tasks: ${waTaskNames.join(', ')}`
    : 'No WA tasks covering this domain';
  return `${domain}: ${count} events — ${tasks}`;
}
