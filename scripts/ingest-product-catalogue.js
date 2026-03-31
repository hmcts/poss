/**
 * ingest-product-catalogue.js
 *
 * Parses ProductCatalogue-CivilPossessionMaster.v1.0.xlsx ("All Data" sheet)
 * into a clean JSON file at data/product-catalogue.json.
 *
 * Cleans:
 *   - Trims whitespace on all categorical columns
 *   - Normalises Release 1 → yes | no | tbc
 *   - Normalises MoSCoW → must | should | could | wont | welsh | unknown
 *   - Strips deleted rows (writes them separately to data/product-catalogue-deleted.json)
 *   - Extracts structured personas[] from free-text "As a…" field
 *   - Derives domainGroup enum from DPS group code prefix
 *   - Normalises WP to clean codes (C1–C11, E1–E4, TBC)
 *
 * Usage: node scripts/ingest-product-catalogue.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const XLSX_PATH = path.resolve(
  __dirname,
  '../.business_context/ProductCatalogue-CivilPossessionMaster.v1.0.xlsx',
);
const OUT_DIR = path.resolve(__dirname, '../data');

// ── Domain group mapping ────────────────────────────────────────────────────

const DOMAIN_GROUPS = {
  'DPS-01': 'accounts',
  'DPS-02': 'claims',        // submit, respond, counterclaim, gen apps
  'DPS-03': 'case-management',
  'DPS-04': 'documents',
  'DPS-05': 'hearings',
  'DPS-06': 'enforcement',
  'DPS-07': 'payments',
  'DPS-11': 'admin',
};

// Finer sub-group mapping where the top-level is too broad
const DOMAIN_SUBGROUPS = {
  'DPS-02.01': 'claims-submit',
  'DPS-02.02': 'claims-respond',
  'DPS-02.03': 'claims-counterclaim',
  'DPS-02.04': 'claims-general-application',
  'DPS-03.01': 'case-management',
  'DPS-03.02': 'case-management-tracking',
  'DPS-03.03': 'case-management-welsh',
  'DPS-03.04': 'case-management-low-automation',
  'DPS-03.05': 'case-management-access',
  'DPS-03.06': 'case-management-parties',
  'DPS-05.01': 'hearings-schedule',
  'DPS-05.02': 'hearings-conduct',
  'DPS-05.03': 'hearings-orders',
  'DPS-06.01': 'enforcement-application',
  'DPS-06.02': 'enforcement-risk-assessment',
  'DPS-06.03': 'enforcement-eviction',
};

// ── Persona normalisation ───────────────────────────────────────────────────

// Map messy free-text persona strings to canonical role identifiers
const PERSONA_PATTERNS = [
  // System / automated
  [/\bsystem\b/i, 'system'],

  // Judicial
  [/\bjudge\b/i, 'judge'],

  // Court staff
  [/\bcourt\s*user\s*administrator\b/i, 'court-admin'],
  [/\bcourt\s*admin(?:istrator)?\b/i, 'court-admin'],
  [/\blisting\s*officer\b/i, 'court-staff'],
  [/\bcourt\s*staff\b/i, 'court-staff'],
  [/\bcaseworker\b/i, 'caseworker'],
  [/\bcourt\s*user\b/i, 'court-staff'],
  [/\bhmcts\b/i, 'hmcts'],

  // Bailiff
  [/\bbailiff\b/i, 'bailiff'],

  // Claimant side
  [/\bclaimant\s*(?:[-–]\s*)?lip\b/i, 'claimant-lip'],
  [/\bclaimant\s*org\b/i, 'claimant-org'],
  [/\bclaimant\b/i, 'claimant'],

  // Defendant side
  [/\bdefendant\s*(?:[-–]\s*)?lip\b/i, 'defendant-lip'],
  [/\bdefendant\s*org\b/i, 'defendant-org'],
  [/\bdefendant\b/i, 'defendant'],

  // Representatives
  [/\blegal\s*rep(?:resentative)?s?\s*[-–]?\s*defendant\b/i, 'legal-rep-defendant'],
  [/\blegal\s*rep(?:resentative)?s?\s*[-–]?\s*claimant\b/i, 'legal-rep-claimant'],
  [/\blegal\s*rep(?:resentative)?/i, 'legal-rep'],
  [/\bhlpas\b/i, 'legal-rep'],
  [/\bduty\s*advis/i, 'legal-rep'],

  // Litigation friend
  [/\blitigation\s*friend\b/i, 'litigation-friend'],
  [/\blitigant\s*friend\b/i, 'litigation-friend'],

  // Organisations
  [/\bsocial\s*landlord/i, 'claimant-org'],
  [/\bprivate\s*landlord\s*compan/i, 'claimant-org'],
  [/\bprofessional\s*(?:org|user)\b/i, 'professional-org'],
  [/\borganisation/i, 'professional-org'],
  [/\badministrator\s*user\b/i, 'org-admin'],

  // Citizen (generic — fallback for unspecified LiP)
  [/\bcitizen\b/i, 'citizen'],

  // Non-party / third party
  [/\bnon[\s'/]*(?:third[\s-]*)?party\b/i, 'non-party'],
  [/\bthird[\s-]*party\b/i, 'non-party'],

  // Any other party / generic party
  [/\bany\s*other\s*party\b/i, 'other-party'],
  [/\bparty\s*that\s*submitted\b/i, 'applicant'],

  // Generic user / litigant fallbacks
  [/\bas\s*a\s*user\b/i, 'citizen'],
  [/\bas\s*a\s*litigant\b(?!\s*friend)/i, 'citizen'],
  [/\bwelsh\s*language\s*user\b/i, 'citizen'],
];

function extractPersonas(rawField) {
  if (!rawField) return [];

  const matched = new Set();

  // Split on newlines, "or", commas to get individual fragments
  const fragments = rawField
    .split(/\r?\n|(?:^|\s)or(?:\s|$)/i)
    .flatMap(f => f.split(/,(?![^(]*\))/)) // split on commas not inside parens
    .map(f => f.trim())
    .filter(f => f.length > 2);

  for (const fragment of fragments) {
    for (const [pattern, role] of PERSONA_PATTERNS) {
      if (pattern.test(fragment)) {
        matched.add(role);
      }
    }
  }

  return [...matched].sort();
}

// ── Normalisation helpers ───────────────────────────────────────────────────

function normaliseMoscow(raw) {
  if (!raw) return 'unknown';
  const v = raw.trim().toLowerCase();
  if (v === 'must') return 'must';
  if (v === 'should') return 'should';
  if (v === 'could') return 'could';
  if (v === 'wont' || v === "won't") return 'wont';
  if (v === 'welsh') return 'welsh';
  return 'unknown';
}

function normaliseRelease1(raw) {
  if (!raw) return 'tbc';
  const v = raw.trim().toLowerCase();
  if (v.startsWith('yes')) return 'yes';
  if (v.startsWith('no')) return 'no';
  return 'tbc';
}

function normaliseWP(raw) {
  if (!raw) return null;
  const v = raw.trim().toUpperCase();
  if (/^[CE]\d+$/.test(v)) return v;
  if (v === 'TBC') return 'tbc';
  if (v.includes('DUPE')) return 'duplicate';
  return v.trim() || null;
}

function deriveDomainGroup(groupCode) {
  if (!groupCode) return 'unknown';
  // Try exact sub-group match first
  if (DOMAIN_SUBGROUPS[groupCode]) return DOMAIN_SUBGROUPS[groupCode];
  // Fall back to top-level prefix (DPS-01, DPS-02, etc.)
  const prefix = groupCode.replace(/^(DPS-?\d+).*/, '$1');
  return DOMAIN_GROUPS[prefix] || 'unknown';
}

// ── Main ────────────────────────────────────────────────────────────────────

const wb = XLSX.readFile(XLSX_PATH);
const ws = wb.Sheets['All Data'];
const raw = XLSX.utils.sheet_to_json(ws);

console.log(`Read ${raw.length} rows from "All Data" sheet`);

const active = [];
const deleted = [];

for (const row of raw) {
  const isDeleted = !!row['Deleted'];
  const groupCode = (row['Group code'] || '').trim();

  const record = {
    ref: (row['Unique Ref'] || '').trim(),
    groupCode,
    groupName: (row['Grouping ref'] || '').trim(),
    subGroup: (row['Sub Grouping'] || '').trim(),
    domainGroup: deriveDomainGroup(groupCode),
    workPackage: normaliseWP(row['WP']),
    feature: (row['Feature/Use Case'] || '').trim(),
    hlFunction: (row['HL Function'] || '').trim(),
    tshirtSize: (row['T-Shirt Sizing (tech)'] || '').trim() || null,
    manualMode: (row['Manual Mode?'] || '').trim() || null,

    // User story components
    personas: extractPersonas(row['As a....']),
    personasRaw: (row['As a....'] || '').trim() || null,
    eventTrigger: (row['in the event'] || '').trim() || null,
    userStory: (row['I want ... User story (Level 2)'] || '').trim() || null,
    expectedOutcomes: (row['Expected outcomes'] || '').trim() || null,

    // Classification
    moscow: normaliseMoscow(row['MoSCoW']),
    priority: (row['Priority'] || '').trim() || null,
    release1: normaliseRelease1(row['Release 1']),
    release1Detail: (row['Release 1'] || '').trim() || null,
    hldMapping: (row['Estimated HLD Mapping based on Product Blueprint'] || '').trim() || null,
    category: (row['Category'] || '').trim() || null,

    // UCD tracking
    ucdRequired: (row['UCD Required?'] || '').trim() || null,
    designScopeComplete: (row['Release 1 Design Scope Complete?'] || '').trim() || null,
    postR1DesignRequired: (row['Is post Release 1 Design required?'] || '').trim() || null,

    // Notes
    notes: (row['Notes/Comment'] || '').trim() || null,
    related: (row['Related'] || '').trim() || null,
  };

  if (isDeleted) {
    deleted.push(record);
  } else {
    active.push(record);
  }
}

// ── Summary stats ───────────────────────────────────────────────────────────

const allPersonas = new Set();
active.forEach(r => r.personas.forEach(p => allPersonas.add(p)));

const moscowCounts = {};
active.forEach(r => {
  moscowCounts[r.moscow] = (moscowCounts[r.moscow] || 0) + 1;
});

const domainCounts = {};
active.forEach(r => {
  domainCounts[r.domainGroup] = (domainCounts[r.domainGroup] || 0) + 1;
});

const wpCounts = {};
active.forEach(r => {
  const wp = r.workPackage || 'none';
  wpCounts[wp] = (wpCounts[wp] || 0) + 1;
});

console.log(`\nActive: ${active.length} | Deleted: ${deleted.length}`);
console.log(`\nMoSCoW:`, moscowCounts);
console.log(`Release 1 yes:`, active.filter(r => r.release1 === 'yes').length);
console.log(`Release 1 no:`, active.filter(r => r.release1 === 'no').length);
console.log(`Release 1 tbc:`, active.filter(r => r.release1 === 'tbc').length);
console.log(`\nDomain groups:`, domainCounts);
console.log(`\nWork packages:`, wpCounts);
console.log(`\nCanonical personas (${allPersonas.size}):`, [...allPersonas].sort().join(', '));

// Check for unmatched persona fields
const unmatched = active.filter(r => r.personasRaw && r.personas.length === 0);
if (unmatched.length > 0) {
  console.log(`\nWARNING: ${unmatched.length} rows have persona text but no matches:`);
  unmatched.forEach(r => console.log(`  ${r.ref}: "${r.personasRaw?.substring(0, 80)}"`));
}

// ── Write output ────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(OUT_DIR, 'product-catalogue.json'),
  JSON.stringify(active, null, 2),
);
console.log(`\nWritten data/product-catalogue.json (${active.length} records)`);

fs.writeFileSync(
  path.join(OUT_DIR, 'product-catalogue-deleted.json'),
  JSON.stringify(deleted, null, 2),
);
console.log(`Written data/product-catalogue-deleted.json (${deleted.length} records)`);
