/**
 * About-panel content constants for the Work Allocation Dashboard page.
 * Each section has a key, heading, and body text.
 * Centralised here so tests can verify content without a DOM.
 */

const ABOUT_SECTIONS = {
  whatItDoes: {
    key: 'whatItDoes',
    heading: 'What this page does',
    body: 'This page maps the 17 R1A Work Allocation tasks against the new HMCTS possessions service event model to show the alignment status of each task. For every task it records whether a direct event model counterpart exists, a related event exists at different granularity or context, or no event is modelled at all. The goal is to surface gaps and partial matches so that missing event model coverage can be identified and addressed before service build.',
  },
  alignmentCategories: {
    key: 'alignmentCategories',
    heading: 'Alignment categories',
    body: 'Aligned (7 tasks): a direct event model counterpart exists with matching context and granularity — manual cross-reference is documented in R1A_WA_Tasks_vs_Event_Model_Analysis.md. Partial (9 tasks): a related event exists but at different granularity (e.g. WA expects a sub-typed adjournment; the event model has a generic "make an application") or different context (e.g. citizen upload vs professional upload). Gap (1 task): "Review Failed Payment" — no failed payment event is modelled; payment outcome is implied in the Submit and Pay / Case Issued flow rather than surfaced as a discrete event.',
  },
  scopeAssumption: {
    key: 'scopeAssumption',
    heading: 'Scope assumption',
    body: 'Only the 17 tasks listed in the R1A Work Allocation Task Names document are covered by this analysis. Future phases may add further tasks as service design progresses. This dashboard does not represent full caseworker task coverage for the possession service — it reflects only the tasks scoped for Release 1A.',
  },
  byContextAssumption: {
    key: 'byContextAssumption',
    heading: 'By Context view assumption',
    body: 'The context classification used in the By Context view (claim, counterclaim, general application, general) is taken directly from the R1A Work Allocation Task Names document. It is not derived from the event model. If the R1A document reclassifies a task, the context shown here will not automatically update — the source data in wa-tasks.json must be updated manually.',
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
