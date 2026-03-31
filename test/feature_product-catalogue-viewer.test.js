import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  filterCatalogue, sortCatalogue, getCatalogueSummary, exportCatalogueCsv,
} from '../src/product-catalogue/index.js';

import {
  getSummaryCards, truncatePersonas, getExpandedDetail,
} from '../src/ui-product-catalogue/index.js';

// ── Shared Fixtures ─────────────────────────────────────────────────────
const mkItem = (o = {}) => ({
  ref: 'DPS-01.01.01', groupCode: 'DPS-01.01',
  groupName: 'DPS-01.01 Citizens & professionals users',
  subGroup: 'Create Digital Accounts', domainGroup: 'accounts',
  workPackage: 'E4', feature: 'Create digital account',
  hlFunction: 'Allows citizens to create', personas: ['claimant'],
  moscow: 'must', release1: 'yes', priority: 'OOTB',
  tshirtSize: 'Medium', category: null, notes: null,
  userStory: null, expectedOutcomes: null, eventTrigger: null,
  relatedRefs: null, ucdRequired: null, designScopeComplete: null,
  postR1DesignRequired: null, manualMode: null, ...o,
});

const fItems = [
  mkItem({ ref: 'A', domainGroup: 'accounts',          moscow: 'must',   personas: ['claimant'] }),
  mkItem({ ref: 'B', domainGroup: 'accounts',          moscow: 'should', personas: ['judge'] }),
  mkItem({ ref: 'C', domainGroup: 'hearings-schedule', moscow: 'must',   personas: ['claimant', 'judge'] }),
  mkItem({ ref: 'D', domainGroup: 'payments',          moscow: 'could',  personas: ['caseworker'] }),
  mkItem({ ref: 'E', domainGroup: 'payments',          moscow: 'must',   personas: ['judge', 'caseworker'] }),
];

const sItems = [
  mkItem({ ref: 'DPS-01.01.01', feature: 'Create digital account', userStory: 'create an account', notes: null }),
  mkItem({ ref: 'DPS-05.01.01', feature: 'Schedule hearing', hlFunction: 'Enables scheduling', userStory: null, notes: 'Requires bailiff availability' }),
  mkItem({ ref: 'DPS-07.01.01', feature: 'Process payment', hlFunction: 'Payment processing', userStory: 'make a payment', notes: null }),
];

// ── Story 1: catalogue-data-model ───────────────────────────────────────
describe('filterCatalogue (AC-1-3, AC-1-4, AC-1-5)', () => {
  it('DM-3: domainGroup filter', () => {
    const r = filterCatalogue(fItems, { domainGroups: ['accounts'] });
    assert.deepStrictEqual(r.map(i => i.ref), ['A', 'B']);
  });
  it('DM-4: moscow filter', () => {
    assert.deepStrictEqual(filterCatalogue(fItems, { moscow: ['must'] }).map(i => i.ref), ['A', 'C', 'E']);
  });
  it('DM-5: personas filter (array-includes OR)', () => {
    assert.deepStrictEqual(filterCatalogue(fItems, { personas: ['judge'] }).map(i => i.ref), ['B', 'C', 'E']);
  });
  it('DM-6: AND across domainGroups + moscow', () => {
    assert.deepStrictEqual(filterCatalogue(fItems, { domainGroups: ['accounts', 'payments'], moscow: ['must'] }).map(i => i.ref), ['A', 'E']);
  });
  it('DM-7: AND across domainGroups + personas', () => {
    const r = filterCatalogue(fItems, { domainGroups: ['accounts'], personas: ['judge'] });
    assert.equal(r.length, 1);
    assert.equal(r[0].ref, 'B');
  });
  it('DM-8: empty filters returns all', () => {
    assert.equal(filterCatalogue(fItems, {}).length, 5);
  });
  it('DM-9: text search matches feature', () => {
    assert.equal(filterCatalogue(sItems, { search: 'account' })[0].ref, 'DPS-01.01.01');
  });
  it('DM-10: text search matches ref', () => {
    assert.equal(filterCatalogue(sItems, { search: 'DPS-05' })[0].ref, 'DPS-05.01.01');
  });
  it('DM-11: text search matches notes (null-safe)', () => {
    assert.equal(filterCatalogue(sItems, { search: 'bailiff' })[0].ref, 'DPS-05.01.01');
  });
  it('DM-12: empty search returns all', () => {
    assert.equal(filterCatalogue(sItems, { search: '' }).length, 3);
  });
});

describe('sortCatalogue (AC-1-6)', () => {
  const items = [
    mkItem({ ref: 'DPS-02.01.01', moscow: 'should' }),
    mkItem({ ref: 'DPS-01.01.03', moscow: 'must' }),
    mkItem({ ref: 'DPS-10.01.01', moscow: 'could' }),
    mkItem({ ref: 'DPS-01.01.01', moscow: 'must' }),
  ];
  it('DM-13: ref ascending', () => {
    assert.deepStrictEqual(sortCatalogue(items, 'ref', 'asc').map(i => i.ref),
      ['DPS-01.01.01', 'DPS-01.01.03', 'DPS-02.01.01', 'DPS-10.01.01']);
  });
  it('DM-14: ref descending', () => {
    assert.deepStrictEqual(sortCatalogue(items, 'ref', 'desc').map(i => i.ref),
      ['DPS-10.01.01', 'DPS-02.01.01', 'DPS-01.01.03', 'DPS-01.01.01']);
  });
  it('DM-15: moscow ascending', () => {
    assert.deepStrictEqual(sortCatalogue(items, 'moscow', 'asc').map(i => i.moscow),
      ['could', 'must', 'must', 'should']);
  });
});

describe('getCatalogueSummary (AC-1-7)', () => {
  it('DM-16: correct breakdowns', () => {
    const items = [
      mkItem({ domainGroup: 'accounts',         moscow: 'must',   release1: 'yes', personas: ['claimant', 'judge'] }),
      mkItem({ domainGroup: 'accounts',         moscow: 'must',   release1: 'yes', personas: ['defendant'] }),
      mkItem({ domainGroup: 'payments',          moscow: 'must',   release1: 'yes', personas: ['caseworker'] }),
      mkItem({ domainGroup: 'payments',          moscow: 'should', release1: 'yes', personas: ['judge', 'admin'] }),
      mkItem({ domainGroup: 'hearings-schedule', moscow: 'should', release1: 'no',  personas: ['claimant'] }),
      mkItem({ domainGroup: 'hearings-schedule', moscow: 'could',  release1: 'tbc', personas: ['defendant'] }),
    ];
    const s = getCatalogueSummary(items);
    assert.equal(s.total, 6);
    assert.deepStrictEqual(
      [s.moscowBreakdown.must, s.moscowBreakdown.should, s.moscowBreakdown.could,
       s.moscowBreakdown.wont, s.moscowBreakdown.welsh, s.moscowBreakdown.unknown],
      [3, 2, 1, 0, 0, 0]);
    assert.deepStrictEqual(s.release1Breakdown, { yes: 4, no: 1, tbc: 1 });
    assert.equal(s.domainGroupCount, 3);
    assert.equal(s.personaCount, 5);
  });
});

// ── Story 2: catalogue-page (pure helpers only) ─────────────────────────
describe('UI orchestration helpers (AC-2-2, AC-2-6, AC-2-7)', () => {
  it('UI-1: getSummaryCards returns card with total', () => {
    const cards = getSummaryCards([mkItem(), mkItem({ domainGroup: 'payments', personas: ['judge'] })]);
    assert.ok(Array.isArray(cards) && cards.length > 0);
    const total = cards.find(c => /total/i.test(c.label));
    assert.ok(total);
    assert.equal(total.value, 2);
  });
  it('UI-2: truncatePersonas 7 items -> 3 visible + 4 overflow', () => {
    const r = truncatePersonas(['a','b','c','d','e','f','g'], 3);
    assert.equal(r.visible.length, 3);
    assert.equal(r.overflow, 4);
  });
  it('UI-3: truncatePersonas 2 items -> all visible, 0 overflow', () => {
    const r = truncatePersonas(['a','b'], 3);
    assert.equal(r.visible.length, 2);
    assert.equal(r.overflow, 0);
  });
  it('UI-4: getExpandedDetail returns detail fields', () => {
    const d = getExpandedDetail(mkItem({
      hlFunction: 'HL', userStory: 'Story', expectedOutcomes: 'Out',
      eventTrigger: 'Trig', notes: 'N', relatedRefs: 'R',
      personas: ['a','b'], ucdRequired: 'yes',
      designScopeComplete: 'no', postR1DesignRequired: 'yes',
      manualMode: 'partial', tshirtSize: 'Large',
    }));
    assert.ok(d.hlFunction);
    assert.ok(d.userStory);
    assert.ok(Array.isArray(d.personas));
  });
});

// ── Story 3: catalogue-export ───────────────────────────────────────────
const HDR = 'Ref,Group Code,Group Name,Sub Group,Domain Group,Work Package,Feature,HL Function,Personas,MoSCoW,Release 1,Priority,T-Shirt Size,Category,Notes';

describe('exportCatalogueCsv (AC-3-1 to AC-3-4)', () => {
  const item = mkItem({ personas: ['claimant', 'defendant', 'judge'], notes: 'Some notes' });

  it('EX-1: correct header row', () => {
    assert.equal(exportCatalogueCsv([item], false).content.split('\n')[0], HDR);
  });
  it('EX-2: correct field serialisation', () => {
    const row = exportCatalogueCsv([item], false).content.split('\n')[1];
    assert.ok(row.includes('claimant; defendant; judge'), 'personas joined with "; "');
    assert.ok(!row.includes('null'), 'null fields not serialised as "null"');
  });
  it('EX-3: filename unfiltered', () => {
    const { filename, mimeType } = exportCatalogueCsv([item], false);
    assert.equal(filename, 'product-catalogue.csv');
    assert.equal(mimeType, 'text/csv');
  });
  it('EX-4: filename filtered', () => {
    assert.equal(exportCatalogueCsv([item], true).filename, 'product-catalogue-filtered.csv');
  });
  it('EX-5: empty array returns header only', () => {
    const lines = exportCatalogueCsv([], false).content.split('\n').filter(l => l);
    assert.equal(lines.length, 1);
    assert.equal(lines[0], HDR);
  });
});
