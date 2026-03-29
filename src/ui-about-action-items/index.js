/**
 * About-panel content constants for the Action Items page.
 * Each section has a key, heading, and body text.
 * Centralised here so tests can verify content without a DOM.
 */

const ABOUT_SECTIONS = {
  whatItDoes: {
    key: 'whatItDoes',
    heading: 'What this page does',
    body: 'A consolidated list of outstanding issues drawn from two sources — model completeness checks and WA task alignment gaps. The purpose is to help prioritise analytical and design work by surfacing what is currently incomplete or misaligned in the data model and task mappings.',
  },
  twoSources: {
    key: 'twoSources',
    heading: 'Two sources',
    body: 'Model completeness items come from model-health and uncertainty-display logic applied to live model data — they flag states with low completeness, open questions, and reachability problems. WA alignment items come from wa-task-engine applied to wa-mappings.json — they flag tasks with no event mapping, partial alignment, or missing coverage. Neither source is exhaustive: they surface what is currently modelled. Gaps in the source data will produce gaps in the item list.',
  },
  priorityAlgorithm: {
    key: 'priorityAlgorithm',
    heading: 'Priority algorithm',
    body: 'High priority = blocking issues: gap tasks with no event mapping, unreachable states, or end-state not reachable. Medium priority = partial issues: partial alignment, low-completeness states (below 50% of fields populated), open questions. Low priority = informational items unlikely to block delivery. Priority is assigned automatically from the item type — it is a starting point, not a definitive assessment.',
  },
  modelHealthScore: {
    key: 'modelHealthScore',
    heading: 'Model health score',
    body: 'A composite of four factors: open question count, low-completeness state count, unreachable state count, and end-state reachability. Bands: Good (80% or above), Fair (50–79%), Poor (below 50%). Thresholds are heuristic — they reflect a rough sense of model maturity, not a precise or standardised measure. The score will improve as model data is filled in and open questions are resolved.',
  },
  waAlignmentPct: {
    key: 'waAlignmentPct',
    heading: 'WA alignment %',
    body: 'Calculated as (aligned + partial × 0.5) / 17. The denominator 17 is the total number of R1A Work Allocation tasks. Partial alignment counts as half-aligned, reflecting that some but not all events for that task have been mapped. A task with no mapping at all contributes zero. The percentage will increase as wa-mappings.json is completed.',
  },
  suggestions: {
    key: 'suggestions',
    heading: 'Suggestions',
    body: 'Resolution text shown in the Suggestion column is auto-generated from templates based on the item type. It is a starting point to indicate the kind of work needed — it may not capture full context for every item. Treat suggestions as prompts for investigation, not instructions.',
  },
  notPersisted: {
    key: 'notPersisted',
    heading: 'Items are not persisted',
    body: 'The item list is recalculated fresh on every page load from live model data and wa-mappings.json. There is no "mark as resolved" function — items disappear automatically when the underlying data changes. If an item persists, the root cause has not been addressed in the source data.',
  },
};

/**
 * Returns the section object for a given key, or null for unknown keys.
 * @param {string} key
 * @returns {{ key: string, heading: string, body: string } | null}
 */
export function getAboutSection(key) {
  return ABOUT_SECTIONS[key] ?? null;
}

/**
 * Returns all about sections as an ordered array.
 * @returns {Array<{ key: string, heading: string, body: string }>}
 */
export function getAboutSections() {
  return Object.values(ABOUT_SECTIONS);
}
