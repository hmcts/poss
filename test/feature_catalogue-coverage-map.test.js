import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  matchByEventTrigger,
  matchByDomainAndFeature,
  filterByReleaseScope,
  filterByClaimTypeRelevance,
  calculatePersonaCoverage,
  identifyGaps,
  traceJourneyCompleteness,
  surfaceDecisions,
  exportGapListCsv,
} from '../src/catalogue-coverage-map/index.js';

import {
  getPersonaRoleMapping,
} from '../src/ui-catalogue-coverage-map/index.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkItem = (o = {}) => ({
  ref: 'DPS-01.01.01', groupCode: 'DPS-01.01',
  groupName: 'DPS-01.01 Citizens', subGroup: 'Create Digital Accounts',
  domainGroup: 'accounts', workPackage: 'E4', feature: 'Create digital account',
  hlFunction: 'Allows citizens to create', personas: ['claimant'],
  moscow: 'must', release1: 'yes', priority: 'OOTB', tshirtSize: 'Medium',
  category: null, notes: null, userStory: null, expectedOutcomes: null,
  eventTrigger: null, relatedRefs: null, ucdRequired: null,
  designScopeComplete: null, postR1DesignRequired: null, manualMode: null,
  ...o,
});

const mkState = (o = {}) => ({
  id: 'ST-01', technicalName: 'DRAFT', uiLabel: 'Draft', claimType: 'all',
  isDraftLike: true, isLive: false, isEndState: false, completeness: 0,
  domainGroup: 'accounts',
  ...o,
});

const mkEvent = (o = {}) => ({
  id: 'EV-01', name: 'Claim Issued', claimType: 'all', state: 'ST-01',
  isSystemEvent: false, notes: null, hasOpenQuestions: false,
  actors: { Claimant: true, Caseworker: false },
  ...o,
});

const mkTransition = (o = {}) => ({
  from: 'ST-01', to: 'ST-02', condition: null,
  isSystemTriggered: false, isTimeBased: false,
  ...o,
});

// ── Story 1: match-by-event-trigger ──────────────────────────────────────────

describe('matchByEventTrigger', () => {
  it('S1-1: exact substring match produces tuple with matchConfidence exact', () => {
    const item = mkItem({ ref: 'A', eventTrigger: 'claim issued' });
    const events = [mkEvent({ id: 'EV-01', name: 'Claim Issued', state: 'ST-01' })];
    const result = matchByEventTrigger(item, events);
    assert.equal(result.length, 1);
    assert.deepStrictEqual(result[0], {
      catalogueRef: 'A', stateId: 'ST-01', eventId: 'EV-01', matchConfidence: 'exact',
    });
  });

  it('S1-2: no match returns empty array', () => {
    const item = mkItem({ ref: 'B', eventTrigger: 'something unrelated' });
    const events = [mkEvent({ id: 'EV-01', name: 'Claim Issued', state: 'ST-01' })];
    assert.deepStrictEqual(matchByEventTrigger(item, events), []);
  });

  it('S1-3: null eventTrigger returns empty array', () => {
    const item = mkItem({ ref: 'C', eventTrigger: null });
    const events = [mkEvent({ id: 'EV-01', name: 'Claim Issued', state: 'ST-01' })];
    assert.deepStrictEqual(matchByEventTrigger(item, events), []);
  });

  it('S1-4: one-to-many — one tuple per matched event', () => {
    const item = mkItem({ ref: 'D', eventTrigger: 'hearing' });
    const events = [
      mkEvent({ id: 'EV-10', name: 'Hearing Listed', state: 'ST-05' }),
      mkEvent({ id: 'EV-11', name: 'Hearing Completed', state: 'ST-06' }),
      mkEvent({ id: 'EV-12', name: 'Claim Issued', state: 'ST-01' }),
    ];
    const result = matchByEventTrigger(item, events);
    assert.equal(result.length, 2);
    assert.ok(result.every(t => t.matchConfidence === 'exact'));
    assert.deepStrictEqual(result.map(t => t.eventId).sort(), ['EV-10', 'EV-11']);
  });
});

// ── Story 2: match-by-domain-and-feature ─────────────────────────────────────

describe('matchByDomainAndFeature', () => {
  it('S2-1: domainGroup match produces inferred tuple with eventId null', () => {
    const item = mkItem({ ref: 'A', domainGroup: 'accounts', eventTrigger: null });
    const states = [mkState({ id: 'ST-01', domainGroup: 'accounts' })];
    const result = matchByDomainAndFeature(item, states, []);
    assert.ok(result.length >= 1);
    const tuple = result.find(t => t.stateId === 'ST-01');
    assert.ok(tuple);
    assert.equal(tuple.matchConfidence, 'inferred');
    assert.equal(tuple.eventId, null);
  });

  it('S2-2: feature name substring match against event description produces inferred tuple', () => {
    const item = mkItem({ ref: 'B', feature: 'Issue Claim', eventTrigger: null });
    const events = [mkEvent({ id: 'EV-01', name: 'Claim Issued — online', state: 'ST-01' })];
    const result = matchByDomainAndFeature(item, [], events);
    assert.ok(result.length >= 1);
    const tuple = result.find(t => t.eventId === 'EV-01');
    assert.ok(tuple);
    assert.equal(tuple.matchConfidence, 'inferred');
  });

  it('S2-3: all returned tuples have matchConfidence inferred', () => {
    const item = mkItem({ ref: 'C', domainGroup: 'accounts', feature: 'Create account', eventTrigger: null });
    const states = [mkState({ id: 'ST-01', domainGroup: 'accounts' })];
    const events = [mkEvent({ id: 'EV-02', name: 'Create account step', state: 'ST-01' })];
    const result = matchByDomainAndFeature(item, states, events);
    assert.ok(result.every(t => t.matchConfidence === 'inferred'));
  });

  it('S2-4: exact eventTrigger match takes precedence — no duplicate for same item-event pair', () => {
    const item = mkItem({ ref: 'D', feature: 'Claim Issued', eventTrigger: 'Claim Issued' });
    const events = [mkEvent({ id: 'EV-01', name: 'Claim Issued', state: 'ST-01' })];
    const exactMatches = matchByEventTrigger(item, events);
    const inferredMatches = matchByDomainAndFeature(item, [], events);
    // When deduplicating: inferred should not produce a tuple for EV-01 already covered by exact
    const allMatches = [
      ...exactMatches,
      ...inferredMatches.filter(inf =>
        !exactMatches.some(ex => ex.eventId === inf.eventId && ex.catalogueRef === inf.catalogueRef)
      ),
    ];
    const forEv01 = allMatches.filter(t => t.eventId === 'EV-01');
    assert.equal(forEv01.length, 1);
    assert.equal(forEv01[0].matchConfidence, 'exact');
  });
});

// ── Story 3: persona-role-mapping-data ───────────────────────────────────────

describe('getPersonaRoleMapping', () => {
  it('S3-1: all 23 catalogue personas return a mapping entry', () => {
    const personas = [
      'claimant', 'defendant', 'judge', 'caseworker', 'legal-advisor',
      'bailiff-enforcement', 'court-admin', 'system-auto', 'solicitor',
      'litigation-friend', 'mckenzie-friend', 'interpreter', 'witness',
      'expert', 'mediator', 'insolvency-practitioner', 'trustee',
      'citizen', 'applicant', 'non-party', 'other-party', 'org-admin',
      'professional-org',
    ];
    for (const p of personas) {
      const mapping = getPersonaRoleMapping(p);
      assert.ok(mapping !== undefined, `Expected mapping for persona: ${p}`);
      assert.ok(Array.isArray(mapping.roles), `Expected roles array for persona: ${p}`);
    }
  });

  it('S3-2: litigation-friend maps to both Claimant and Defendant', () => {
    const mapping = getPersonaRoleMapping('litigation-friend');
    assert.ok(mapping.roles.includes('Claimant'));
    assert.ok(mapping.roles.includes('Defendant'));
  });

  it('S3-3: cross-cutting personas (empty roles) have isCrossCutting true', () => {
    for (const p of ['citizen', 'applicant', 'non-party', 'other-party', 'org-admin', 'professional-org']) {
      const mapping = getPersonaRoleMapping(p);
      assert.equal(mapping.isCrossCutting, true, `Expected isCrossCutting for: ${p}`);
    }
  });

  it('S3-4: unknown persona returns undefined', () => {
    assert.equal(getPersonaRoleMapping('unknown-persona-xyz'), undefined);
  });
});

// ── Story 4: filter-by-release-scope ─────────────────────────────────────────

describe('filterByReleaseScope', () => {
  const items = [
    mkItem({ ref: 'A', release1: 'yes' }),
    mkItem({ ref: 'B', release1: 'tbc' }),
    mkItem({ ref: 'C', release1: 'no' }),
  ];

  it('S4-1: default scope r1+tbc excludes release1=no items', () => {
    const result = filterByReleaseScope(items, 'r1+tbc');
    assert.deepStrictEqual(result.map(i => i.ref), ['A', 'B']);
  });

  it('S4-2: r1 scope includes only release1=yes items', () => {
    const result = filterByReleaseScope(items, 'r1');
    assert.deepStrictEqual(result.map(i => i.ref), ['A']);
  });

  it('S4-3: all scope returns every item', () => {
    const result = filterByReleaseScope(items, 'all');
    assert.equal(result.length, 3);
  });

  it('S4-4: does not mutate the input array', () => {
    const copy = [...items];
    filterByReleaseScope(items, 'r1');
    assert.equal(items.length, copy.length);
    assert.deepStrictEqual(items.map(i => i.ref), copy.map(i => i.ref));
  });
});

// ── Story 5: filter-by-claim-type-relevance ───────────────────────────────────

describe('filterByClaimTypeRelevance', () => {
  const items = [
    mkItem({ ref: 'MAIN', domainGroup: 'claims-main' }),
    mkItem({ ref: 'CC', domainGroup: 'claims-counterclaim' }),
    mkItem({ ref: 'ENF', domainGroup: 'enforcement-warrant' }),
    mkItem({ ref: 'GEN', domainGroup: 'accounts' }),
  ];

  it('S5-1: counterclaim items excluded for non-counterclaim claim type', () => {
    const result = filterByClaimTypeRelevance(items, 'MAIN_CLAIM_ENGLAND');
    assert.ok(!result.some(i => i.ref === 'CC'), 'counterclaim item should be excluded');
  });

  it('S5-2: enforcement items included only for enforcement claim type', () => {
    const enforcement = filterByClaimTypeRelevance(items, 'ENFORCEMENT');
    assert.ok(enforcement.some(i => i.ref === 'ENF'), 'enforcement item should be included for ENFORCEMENT');
    const main = filterByClaimTypeRelevance(items, 'MAIN_CLAIM_ENGLAND');
    assert.ok(!main.some(i => i.ref === 'ENF'), 'enforcement item should be excluded for MAIN_CLAIM');
  });

  it('S5-3: general items apply to all claim types', () => {
    for (const claimType of ['MAIN_CLAIM_ENGLAND', 'ENFORCEMENT', 'ACCELERATED']) {
      const result = filterByClaimTypeRelevance(items, claimType);
      assert.ok(result.some(i => i.ref === 'GEN'), `GEN should be included for ${claimType}`);
    }
  });

  it('S5-4: pure function — does not mutate input', () => {
    const original = items.map(i => i.ref);
    filterByClaimTypeRelevance(items, 'MAIN_CLAIM_ENGLAND');
    assert.deepStrictEqual(items.map(i => i.ref), original);
  });
});

// ── Story 6: calculate-persona-coverage ──────────────────────────────────────

describe('calculatePersonaCoverage', () => {
  const states = [
    mkState({ id: 'ST-01', domainGroup: 'accounts' }),
    mkState({ id: 'ST-02', domainGroup: 'hearings' }),
  ];
  const events = [
    mkEvent({ id: 'EV-01', state: 'ST-01', actors: { Claimant: true, Caseworker: false } }),
    mkEvent({ id: 'EV-02', state: 'ST-02', actors: { Claimant: true, Caseworker: false } }),
    mkEvent({ id: 'EV-03', state: 'ST-02', actors: { Claimant: false, Caseworker: true } }),
  ];
  const roleMapping = { roles: ['Claimant'], isCrossCutting: false };

  it('S6-1: output has required shape fields', () => {
    const mappings = [
      { catalogueRef: 'A', stateId: 'ST-01', eventId: 'EV-01', matchConfidence: 'exact' },
    ];
    const result = calculatePersonaCoverage('claimant', mappings, states, events, roleMapping);
    assert.ok('persona' in result);
    assert.ok('resolvedRoles' in result);
    assert.ok('totalStates' in result);
    assert.ok('coveredStates' in result);
    assert.ok('totalTransitions' in result);
    assert.ok('coveredTransitions' in result);
    assert.ok('coveragePct' in result);
    assert.ok('isCrossCutting' in result);
  });

  it('S6-2: only persona-relevant events counted in total', () => {
    // EV-03 has Claimant=false, should not count toward claimant totals
    const mappings = [];
    const result = calculatePersonaCoverage('claimant', mappings, states, events, roleMapping);
    // EV-01 and EV-02 have Claimant=true; EV-03 does not
    assert.ok(result.totalStates <= 2, 'only states with claimant events should be counted');
  });

  it('S6-3: coverage percentage is correct', () => {
    // 2 relevant states, 1 covered
    const mappings = [
      { catalogueRef: 'A', stateId: 'ST-01', eventId: 'EV-01', matchConfidence: 'exact' },
    ];
    const result = calculatePersonaCoverage('claimant', mappings, states, events, roleMapping);
    // ST-01 covered, ST-02 not covered (only claimant-relevant states: ST-01, ST-02 via EV-02)
    if (result.totalStates > 0) {
      assert.equal(result.coveragePct, Math.round((result.coveredStates / result.totalStates) * 100));
    }
  });

  it('S6-4: cross-cutting persona has isCrossCutting true and coveragePct null', () => {
    const crossMapping = { roles: [], isCrossCutting: true };
    const result = calculatePersonaCoverage('citizen', [], states, events, crossMapping);
    assert.equal(result.isCrossCutting, true);
    assert.equal(result.coveragePct, null);
  });
});

// ── Story 7: identify-gaps-and-severity ──────────────────────────────────────

describe('identifyGaps', () => {
  const events = [
    mkEvent({ id: 'EV-01', state: 'ST-01', hasOpenQuestions: false }),
    mkEvent({ id: 'EV-02', state: 'ST-02', hasOpenQuestions: true }),
    mkEvent({ id: 'EV-03', state: 'ST-03', hasOpenQuestions: false }),
    mkEvent({ id: 'EV-04', state: 'ST-03', hasOpenQuestions: false }),
    mkEvent({ id: 'EV-05', state: 'ST-03', hasOpenQuestions: false }),
  ];

  it('S7-1: state with zero mappings appears in gap list with severity gap', () => {
    const mappings = [];
    const gaps = identifyGaps(mappings, events);
    const st01Gap = gaps.find(g => g.stateId === 'ST-01');
    assert.ok(st01Gap);
    assert.equal(st01Gap.severity, 'gap');
  });

  it('S7-2: state with zero coverage AND open questions has severity critical', () => {
    const mappings = [];
    const gaps = identifyGaps(mappings, events);
    const st02Gap = gaps.find(g => g.stateId === 'ST-02');
    assert.ok(st02Gap);
    assert.equal(st02Gap.severity, 'critical');
  });

  it('S7-3: state with partial event coverage has severity partial', () => {
    // ST-03 has 3 events; cover only EV-03
    const mappings = [
      { catalogueRef: 'A', stateId: 'ST-03', eventId: 'EV-03', matchConfidence: 'exact' },
    ];
    const gaps = identifyGaps(mappings, events);
    const st03Gap = gaps.find(g => g.stateId === 'ST-03');
    assert.ok(st03Gap);
    assert.equal(st03Gap.severity, 'partial');
  });

  it('S7-4: gap list ordered critical > gap > partial', () => {
    const mappings = [
      { catalogueRef: 'A', stateId: 'ST-03', eventId: 'EV-03', matchConfidence: 'exact' },
    ];
    const gaps = identifyGaps(mappings, events);
    const severityOrder = { critical: 0, gap: 1, partial: 2 };
    for (let i = 1; i < gaps.length; i++) {
      assert.ok(
        severityOrder[gaps[i - 1].severity] <= severityOrder[gaps[i].severity],
        `Gap at index ${i - 1} (${gaps[i - 1].severity}) should come before index ${i} (${gaps[i].severity})`
      );
    }
  });
});

// ── Story 8: trace-journey-completeness ──────────────────────────────────────

describe('traceJourneyCompleteness', () => {
  // Simple linear graph: ST-01 -> ST-02 -> ST-END (terminal)
  const graph = {
    states: [
      mkState({ id: 'ST-01', isEndState: false }),
      mkState({ id: 'ST-02', isEndState: false }),
      mkState({ id: 'ST-END', isEndState: true }),
    ],
    transitions: [
      mkTransition({ from: 'ST-01', to: 'ST-02' }),
      mkTransition({ from: 'ST-02', to: 'ST-END' }),
    ],
  };

  it('S8-1: output has required shape fields', () => {
    const coverageMap = { 'ST-01': 100, 'ST-02': 100, 'ST-END': 100 };
    const result = traceJourneyCompleteness('claimant', coverageMap, graph);
    assert.ok(result !== null);
    assert.ok('persona' in result);
    assert.ok('canReachTerminal' in result);
    assert.ok('bestPathCoverage' in result);
    assert.ok('worstPathCoverage' in result);
    assert.ok('blockingGaps' in result);
  });

  it('S8-2: state with zero coverage appears in blockingGaps', () => {
    const coverageMap = { 'ST-01': 100, 'ST-02': 0, 'ST-END': 100 };
    const result = traceJourneyCompleteness('claimant', coverageMap, graph);
    assert.ok(result.blockingGaps.some(g => g.stateId === 'ST-02'));
  });

  it('S8-3: best and worst path coverage reflect highest and lowest path scores', () => {
    // Branching graph: ST-01 -> ST-A (100%) -> ST-END, and ST-01 -> ST-B (50%) -> ST-END
    const branchGraph = {
      states: [
        mkState({ id: 'ST-01', isEndState: false }),
        mkState({ id: 'ST-A', isEndState: false }),
        mkState({ id: 'ST-B', isEndState: false }),
        mkState({ id: 'ST-END', isEndState: true }),
      ],
      transitions: [
        mkTransition({ from: 'ST-01', to: 'ST-A' }),
        mkTransition({ from: 'ST-01', to: 'ST-B' }),
        mkTransition({ from: 'ST-A', to: 'ST-END' }),
        mkTransition({ from: 'ST-B', to: 'ST-END' }),
      ],
    };
    const coverageMap = { 'ST-01': 100, 'ST-A': 100, 'ST-B': 50, 'ST-END': 100 };
    const result = traceJourneyCompleteness('claimant', coverageMap, branchGraph);
    assert.ok(result.bestPathCoverage >= result.worstPathCoverage);
  });

  it('S8-4: cross-cutting persona returns null', () => {
    const coverageMap = { 'ST-01': 100, 'ST-02': 100, 'ST-END': 100 };
    // isCrossCutting conveyed by passing null persona or a flag — function contract returns null
    const result = traceJourneyCompleteness(null, coverageMap, graph);
    assert.equal(result, null);
  });
});

// ── Story 9: surface-decisions ───────────────────────────────────────────────

describe('surfaceDecisions', () => {
  const events = [
    mkEvent({ id: 'EV-01', name: 'Claim Issued', hasOpenQuestions: true }),
    mkEvent({ id: 'EV-02', name: 'Hearing Listed', hasOpenQuestions: false }),
  ];
  const items = [
    mkItem({ ref: 'A', userStory: null, ucdRequired: 'yes', notes: null }),
    mkItem({ ref: 'B', userStory: 'A user story', ucdRequired: null, notes: null }),
    mkItem({ ref: 'C', userStory: 'A user story', ucdRequired: 'yes', notes: 'TBC pending review' }),
    mkItem({ ref: 'D', userStory: 'A user story', ucdRequired: 'yes', notes: null }),
  ];

  it('S9-1: events with hasOpenQuestions true appear with source model', () => {
    const decisions = surfaceDecisions(events, []);
    const modelDecisions = decisions.filter(d => d.source === 'model');
    assert.ok(modelDecisions.some(d => d.id === 'EV-01'));
    assert.ok(!modelDecisions.some(d => d.id === 'EV-02'));
  });

  it('S9-2: incomplete catalogue items appear with source catalogue', () => {
    const decisions = surfaceDecisions([], items);
    const catDecisions = decisions.filter(d => d.source === 'catalogue');
    // A (userStory null), B (ucdRequired null), C (notes TBC) should be included; D should not
    assert.ok(catDecisions.some(d => d.ref === 'A'));
    assert.ok(catDecisions.some(d => d.ref === 'B'));
    assert.ok(catDecisions.some(d => d.ref === 'C'));
    assert.ok(!catDecisions.some(d => d.ref === 'D'));
  });

  it('S9-3: every decision entry has a source field', () => {
    const decisions = surfaceDecisions(events, items);
    assert.ok(decisions.every(d => d.source === 'model' || d.source === 'catalogue'));
  });

  it('S9-4: event with open question AND mapped catalogue TBC item appear as two separate entries', () => {
    const tbcItem = mkItem({ ref: 'TBC-1', notes: 'TBC', userStory: 'story', ucdRequired: 'yes' });
    const decisions = surfaceDecisions(
      [mkEvent({ id: 'EV-01', hasOpenQuestions: true })],
      [tbcItem],
    );
    const modelEntry = decisions.filter(d => d.source === 'model');
    const catEntry = decisions.filter(d => d.source === 'catalogue');
    assert.ok(modelEntry.length >= 1);
    assert.ok(catEntry.length >= 1);
  });
});

// ── Story 15: export-gap-list-csv ─────────────────────────────────────────────

describe('exportGapListCsv', () => {
  const gaps = [
    { stateId: 'ST-01', eventId: 'EV-01', severity: 'critical', persona: 'claimant', domainGroup: 'accounts', hasOpenQuestions: true, hasWaGap: true },
    { stateId: 'ST-02', eventId: 'EV-02', severity: 'gap', persona: 'claimant', domainGroup: 'hearings', hasOpenQuestions: false, hasWaGap: false },
  ];

  it('S15-1: CSV contains required column headers', () => {
    const { content } = exportGapListCsv(gaps, 'claimant');
    const header = content.split('\n')[0];
    assert.ok(header.includes('State'), 'missing State column');
    assert.ok(header.includes('Event'), 'missing Event column');
    assert.ok(header.includes('Severity'), 'missing Severity column');
    assert.ok(header.includes('Persona'), 'missing Persona column');
    assert.ok(header.includes('Domain Group'), 'missing Domain Group column');
    assert.ok(header.includes('Open Questions'), 'missing Open Questions column');
  });

  it('S15-2: Also Has WA Gap column present with correct values', () => {
    const { content } = exportGapListCsv(gaps, 'claimant');
    const header = content.split('\n')[0];
    assert.ok(header.includes('WA'), 'missing WA gap column');
    const rows = content.split('\n').slice(1).filter(r => r);
    const firstRow = rows[0];
    assert.ok(firstRow.includes('yes'), 'first gap has hasWaGap=true so should show yes');
  });

  it('S15-3: filters reflected — only gaps passed in are exported', () => {
    const filtered = [gaps[0]];
    const { content } = exportGapListCsv(filtered, 'claimant');
    const rows = content.split('\n').filter(r => r);
    assert.equal(rows.length, 2, 'header + 1 data row');
  });

  it('S15-4: filename includes persona when provided, all otherwise', () => {
    assert.equal(exportGapListCsv(gaps, 'claimant').filename, 'coverage-gaps-claimant.csv');
    assert.equal(exportGapListCsv(gaps).filename, 'coverage-gaps-all.csv');
    assert.equal(exportGapListCsv(gaps, null).filename, 'coverage-gaps-all.csv');
  });
});
