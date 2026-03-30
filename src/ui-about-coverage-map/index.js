const ABOUT_SECTIONS = {
  whatItDoes: {
    key: 'whatItDoes',
    heading: 'What this page does',
    body: 'Maps the 289 product catalogue requirements to the possession case state model, then calculates how much of each state is covered by defined requirements. Select a persona and release scope to scope the analysis, click a state node to inspect its events and mapped features, and scroll below the graph to review cross-cutting requirements that do not attach to a specific state.',
  },
  howCoverageIsCalculated: {
    key: 'howCoverageIsCalculated',
    heading: 'How coverage is calculated',
    body: 'Coverage is calculated per state. First, the engine identifies all events at that state that are relevant to the selected persona (using the actor flags in the event model). It then counts how many of those events have at least one catalogue item matched to them. Coverage % = covered events ÷ total persona-relevant events × 100. States with no persona-relevant events are shown as "not applicable" (grey).',
  },
  matchingStrategies: {
    key: 'matchingStrategies',
    heading: 'How catalogue items are matched to states',
    body: 'Two strategies are used. (1) Exact match — the catalogue item\'s eventTrigger field is compared against event names using a case-insensitive substring search. Tuples produced this way carry matchConfidence: "exact". (2) Inferred match — if no exact match exists, the item\'s domainGroup is compared against state domain groupings, and the item\'s feature name is compared against event descriptions. Tuples produced this way carry matchConfidence: "inferred". Exact matches take precedence: if an item matches an event via both strategies, only the exact tuple is kept.',
  },
  personaRoleMapping: {
    key: 'personaRoleMapping',
    heading: 'Persona-to-role mapping',
    body: 'The catalogue uses 23 persona labels; the event model uses 8 KNOWN_ROLES (Judge, Caseworker, Claimant, Defendant, LegalAdvisor, BailiffEnforcement, CourtAdmin, SystemAuto). A static mapping file translates catalogue personas to roles so that persona-based filtering can query the actor flags in the event model. Six personas (citizen, applicant, non-party, other-party, org-admin, professional-org) have no role mapping and are flagged as cross-cutting — coverage is not calculated for them. litigation-friend maps to both Claimant and Defendant.',
  },
  releaseScope: {
    key: 'releaseScope',
    heading: 'Release scope toggle',
    body: 'R1 — includes only items marked release1: "yes" (234 items). R1+TBC (default) — includes items marked "yes" or "tbc" (262 items). All — includes all 289 items regardless of release flag. Changing scope affects which catalogue items are used for matching, coverage calculation, gap identification, and the cross-cutting section. It does not affect the state model itself.',
  },
  crossCutting: {
    key: 'crossCutting',
    heading: 'Cross-cutting requirements',
    body: 'Catalogue items that have no mapping tuple for any event or state appear in the Cross-Cutting Requirements section below the graph. These are requirements that span multiple states or the entire service (e.g. account management, payments, notifications, accessibility). They are grouped by domainGroup for readability. They are intentionally excluded from node-level coverage percentages — including them would artificially inflate coverage for states they happen to share a domain with.',
  },
  assumptions: {
    key: 'assumptions',
    heading: 'Assumptions and limitations',
    body: 'Coverage at 100% does not mean requirements are complete — it means every persona-relevant event at a state has at least one catalogue item pointing to it. The quality and completeness of those items is not assessed here. Inferred matches are best-effort heuristics based on text similarity; they may be incorrect. Items flagged "wont" in MoSCoW are included unless explicitly filtered out. The event model\'s hasOpenQuestions flag drives the critical gap severity — if that flag is not maintained, critical gaps will be under-reported.',
  },
};

export function getAboutSection(key) {
  return ABOUT_SECTIONS[key] ?? null;
}

export function getAboutSections() {
  return Object.values(ABOUT_SECTIONS);
}
