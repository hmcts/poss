/**
 * ingest-event-model.js
 *
 * Parses "Event Model Possession Service V0.1.xlsx" into 7 per-claim-type JSON files
 * at src/data-ingestion/events/{CLAIM_TYPE_ID}.json
 *
 * Usage: node scripts/ingest-event-model.js
 *
 * Pure helper functions are exported individually for testing.
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
  '../.business_context/Event Model Possession Service V0.1.xlsx',
);
const OUT_DIR = path.resolve(__dirname, '../src/data-ingestion/events');

// ── Sheet → ClaimTypeId mapping ──────────────────────────────────────────────
// ACCELERATED_CLAIM_WALES is intentionally mapped to a sheet name that does not
// exist in the workbook — the Accelerated Claims sheet uses a different format
// that is not yet ingested. This produces an empty events file.

export const SHEET_MAP = {
  'Main Claim':                      'MAIN_CLAIM_ENGLAND',
  'Counter Claim':                   'COUNTER_CLAIM',
  'Counter Claim - Main Claim Clos': 'COUNTER_CLAIM_MAIN_CLAIM_CLOSED',
  'Accelerated Claims (Wales)':      'ACCELERATED_CLAIM_WALES',
  'Enforcement':                     'ENFORCEMENT',
  'General Applications':            'GENERAL_APPLICATIONS',
  'Appeals':                         'APPEALS',
};

// ── Actor header → KNOWN_ROLE mapping ───────────────────────────────────────

export const HEADER_TO_ROLE = {
  'Claimant (unrepresented)':                   'Claimant',
  'Claimant (represented)':                     'Claimant',
  'Claimant (with litigation friend)':          'Claimant',
  'Claimant litigation friend (unrepresented)': 'Claimant',
  'Claimant litigation friend (represented)':   'Claimant',
  'Claimant legal representative':              'Claimant',

  'Defendant (unrepresented)':                   'Defendant',
  'Defendant (represented)':                     'Defendant',
  'Defendant (with litigation friend)':          'Defendant',
  'Defendant litigation friend (unrepresented)': 'Defendant',
  'Defendant litigation friend (represented)':   'Defendant',
  'Defendant legal representative':              'Defendant',

  'Claimant barrister':  'LegalAdvisor',
  'Defendant barrister': 'LegalAdvisor',
  'Duty solicitor':      'LegalAdvisor',

  'County court Judge': 'Judge',
  'High court Judge':   'Judge',

  'Hearing Centre Team Leader':    'CourtAdmin',
  'Hearing Centre Administrator':  'CourtAdmin',
  'CTSC Team Leader':              'CourtAdmin',
  'CTSC Administrator':            'CourtAdmin',
  'WLU Team Leader':               'CourtAdmin',
  'WLU Administrator':             'CourtAdmin',

  'High Court Enforcement Officer': 'BailiffEnforcement',
  'Bailiff Team Leader':            'BailiffEnforcement',
  'Bailiff ':                       'BailiffEnforcement',
  'Bailiff Administrator':          'BailiffEnforcement',
};

const KNOWN_ROLES = [
  'Judge', 'Caseworker', 'Claimant', 'Defendant',
  'LegalAdvisor', 'BailiffEnforcement', 'CourtAdmin', 'SystemAuto',
];

// System event column header
const SYSTEM_EVENT_COL = 'System Event';

// Names that look like column headers — skip any row where event name is one of these
const HEADER_LIKE_NAMES = new Set([
  'event', 'event name', 'event ', 'events',
  'techncial state name', 'technical state name', 'technical state',
  'suggested label', 'state label',
]);

// ── Pure helpers ─────────────────────────────────────────────────────────────

/**
 * Converts a string to a URL-safe slug.
 */
export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Detects open questions in a notes string.
 * Returns false for null/undefined input.
 */
export function detectOpenQuestions(notes) {
  if (notes == null) return false;
  if (!notes) return false;
  const s = String(notes);
  return (
    /\?/.test(s) ||
    /\bTBC\b/i.test(s) ||
    /\bTBD\b/i.test(s) ||
    /\bplaceholder\b/i.test(s) ||
    /\bquestion\b/i.test(s) ||
    /Alex to check/i.test(s)
  );
}

/**
 * Carries the current state forward if cellValue is blank.
 * @param {string} current - current accumulated state name
 * @param {string|undefined} cellValue - raw cell value from the row
 * @returns {string} the new current state
 */
export function carryForwardState(current, cellValue) {
  if (cellValue !== undefined && cellValue !== null && String(cellValue).trim() !== '') {
    return String(cellValue).trim();
  }
  return current;
}

/**
 * Rolls up actor column values into a canonical actors map.
 *
 * @param {Record<string,string>} headerToRole - map of column header → KNOWN_ROLE
 * @param {object} row - row object from sheet_to_json
 * @param {string} systemEventCol - key name of the "System Event" column
 * @returns {{ actors: Record<string,boolean>, hasTbc: boolean }}
 */
export function rollUpActors(headerToRole, row, systemEventCol) {
  const actors = Object.fromEntries(KNOWN_ROLES.map(r => [r, false]));
  let hasTbc = false;

  for (const [header, role] of Object.entries(headerToRole)) {
    if (role === 'SystemAuto') continue; // handled separately
    const raw = row[header];
    if (raw === undefined) continue;
    const v = String(raw).trim().toUpperCase();
    if (v === 'Y') {
      actors[role] = true;
    } else if (v === 'TBC') {
      hasTbc = true;
    }
  }

  // SystemAuto is driven by the dedicated system-event column
  if (systemEventCol) {
    const raw = row[systemEventCol];
    if (raw !== undefined) {
      const v = String(raw).trim().toUpperCase();
      if (v === 'Y') actors.SystemAuto = true;
      else if (v === 'TBC') hasTbc = true;
    }
  }

  return { actors, hasTbc };
}

/**
 * Resolves the event name from a row, trying multiple possible column keys.
 */
function getEventName(row) {
  const v =
    row.name ??
    row['Event name'] ??
    row['Event '] ??
    row['Event'] ??
    row.__EMPTY_3;
  return v != null ? String(v).trim() : '';
}

/**
 * Resolves the technical state name from a row.
 * Only falls back to positional __EMPTY_2 for sheets using the Main Claim column layout.
 */
function getStateName(row) {
  // Named keys come first; use ?? (not ||) so blank string doesn't fall through
  if ('state' in row) return String(row.state ?? '').trim();
  if ('Technical state name' in row) return String(row['Technical state name'] ?? '').trim();
  if ('Technical State' in row) return String(row['Technical State'] ?? '').trim();
  if ('Technical State Name' in row) return String(row['Technical State Name'] ?? '').trim();
  if ('Techncial State Name' in row) return String(row['Techncial State Name'] ?? '').trim();
  // Positional fallback only for Main Claim layout where no named state key exists
  if ('__EMPTY_2' in row && !('Technical state name' in row)) {
    return String(row.__EMPTY_2 ?? '').trim();
  }
  return '';
}

/**
 * Resolves the system-event flag from a row.
 */
function getSystemEvent(row) {
  const v =
    row['System Event'] ??
    row['System event?'] ??
    row.__EMPTY_4;
  return v != null ? String(v).trim().toUpperCase() : '';
}

/**
 * Resolves notes from a row.
 */
function getNotes(row) {
  const v = row.notes ?? row['Notes'] ?? row.__EMPTY_5;
  return v != null ? String(v) : '';
}

/**
 * Builds an array of event objects from sheet rows.
 *
 * @param {object[]} rows - rows from XLSX.utils.sheet_to_json(ws)
 * @param {string} claimTypeId - ClaimTypeId enum value
 * @param {Record<string,string>} headerMap - column header → KNOWN_ROLE (pass {} for no actor mapping)
 * @returns {object[]}
 */
export function buildEvents(rows, claimTypeId, headerMap) {
  const events = [];
  const seen = new Set();
  let currentState = '';

  for (const row of rows) {
    // Carry forward state
    const stateCell = getStateName(row);
    currentState = carryForwardState(currentState, stateCell || undefined);

    const name = getEventName(row);
    if (!name) continue;
    if (HEADER_LIKE_NAMES.has(name.toLowerCase())) continue;

    const id = slugify(claimTypeId + '-' + name);

    if (seen.has(id)) {
      console.warn(`[ingest-event-model] Duplicate event id "${id}" — skipping`);
      continue;
    }
    seen.add(id);

    const systemEventRaw = getSystemEvent(row);
    const notes = getNotes(row);

    const { actors, hasTbc } = rollUpActors(headerMap, row, SYSTEM_EVENT_COL);

    // Override SystemAuto from isSystemEvent / System Event col on the row
    if (systemEventRaw === 'Y') actors.SystemAuto = true;

    const hasOpenQuestions = hasTbc || detectOpenQuestions(notes);

    events.push({
      id,
      name,
      claimType: claimTypeId,
      state: currentState,
      actors,
      isSystemEvent: systemEventRaw === 'Y',
      notes,
      hasOpenQuestions,
    });
  }

  return events;
}

// ── Sheet normalisation for main() ──────────────────────────────────────────

/**
 * Detects the column layout of a raw-array sheet and returns normalised row objects
 * with consistent property names (name, state, isSystemEvent, notes, plus actor headers).
 *
 * Supports two layouts:
 *   A — Main Claim: actor headers in row 1 (0-indexed); data from row 2
 *   B — Enforcement / GenApps: row 0 has named columns; actor headers in row 2; data from row 3
 *
 * For sheets with no recognised actor columns, falls back to default sheet_to_json keys.
 *
 * Returns { normRows, headerKeyToRole }
 */
function normaliseSheet(ws) {
  const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  if (rawRows.length === 0) return { normRows: [], headerKeyToRole: {} };

  // Find the first row containing at least one known actor header
  let actorHeaderRowIndex = -1;
  for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
    if (rawRows[i].some(cell => HEADER_TO_ROLE[String(cell).trim()] !== undefined)) {
      actorHeaderRowIndex = i;
      break;
    }
  }

  if (actorHeaderRowIndex === -1) {
    // No actor columns — fall back to default json rows
    return {
      normRows: XLSX.utils.sheet_to_json(ws, { defval: '' }),
      headerKeyToRole: {},
    };
  }

  const actorHeaderRow = rawRows[actorHeaderRowIndex];

  // Build col-index → role map from the actor header row
  const colIndexToRole = {};
  for (let col = 0; col < actorHeaderRow.length; col++) {
    const trimmed = String(actorHeaderRow[col]).trim();
    if (HEADER_TO_ROLE[trimmed]) {
      colIndexToRole[col] = HEADER_TO_ROLE[trimmed];
    }
  }

  // Determine which column holds each meta field.
  // We look at the first row that has named column labels (could be row 0 or row 1).
  // For Main Claim: row 0 is External/Internal grouping, row 1 is the name headers
  // For Enforcement/GenApps: row 0 is the name headers
  let nameCol = -1, stateCol = -1, sysEventCol = -1, notesCol = -1;

  // Scan rows 0..actorHeaderRowIndex for the meta column header row
  for (let i = 0; i < actorHeaderRowIndex; i++) {
    const r = rawRows[i];
    for (let col = 0; col < r.length; col++) {
      const v = String(r[col]).trim().toLowerCase();
      if (/^event(\s+name)?$/.test(v) || v === 'event ') nameCol = col;
      else if (v === 'techncial state name' || v === 'technical state name') stateCol = col;
      else if (v === 'system event' || v === 'system event?') sysEventCol = col;
      else if (v === 'notes') notesCol = col;
    }
    if (nameCol !== -1) break; // found the meta header row
  }

  // Defaults for Main Claim layout (col indices from the actual workbook)
  if (nameCol === -1) nameCol = 3;
  if (stateCol === -1) stateCol = 2;
  if (sysEventCol === -1) sysEventCol = 4;
  if (notesCol === -1) notesCol = 5;

  // Build normalized row objects from data rows (after the actor header row)
  const dataStartRow = actorHeaderRowIndex + 1;
  const normRows = [];
  for (let i = dataStartRow; i < rawRows.length; i++) {
    const r = rawRows[i];
    const obj = {
      name: String(r[nameCol] ?? '').trim(),
      state: String(r[stateCol] ?? '').trim(),
      isSystemEvent: String(r[sysEventCol] ?? '').trim().toUpperCase() === 'Y',
      notes: String(r[notesCol] ?? ''),
    };
    // Attach actor column values using the actor header string as key
    for (const [col, role] of Object.entries(colIndexToRole)) {
      const header = String(actorHeaderRow[col]).trim();
      obj[header] = String(r[col] ?? '').trim();
    }
    normRows.push(obj);
  }

  // Build header-key → role map using actor header strings as keys
  const headerKeyToRole = {};
  for (const [col, role] of Object.entries(colIndexToRole)) {
    const header = String(actorHeaderRow[col]).trim();
    headerKeyToRole[header] = role;
  }

  return { normRows, headerKeyToRole };
}

// ── main() ───────────────────────────────────────────────────────────────────

export async function main() {
  const wb = XLSX.readFile(XLSX_PATH);

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const [sheetName, claimTypeId] of Object.entries(SHEET_MAP)) {
    const ws = wb.Sheets[sheetName];

    if (!ws) {
      // Sheet doesn't exist — write empty events file
      const outPath = path.join(OUT_DIR, `${claimTypeId}.json`);
      fs.writeFileSync(outPath, JSON.stringify({ claimType: claimTypeId, events: [] }, null, 2));
      console.log(`${claimTypeId}: 0 events (sheet "${sheetName}" not found)`);
      continue;
    }

    const { normRows, headerKeyToRole } = normaliseSheet(ws);
    const events = buildEvents(normRows, claimTypeId, headerKeyToRole);

    const outPath = path.join(OUT_DIR, `${claimTypeId}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ claimType: claimTypeId, events }, null, 2));
    console.log(`${claimTypeId}: ${events.length} events → ${outPath}`);
  }
}

// Run main() when executed directly
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] != null &&
  (process.argv[1].endsWith('ingest-event-model.js') ||
    import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop()));

if (isMain) {
  main().catch(err => {
    console.error('ingest-event-model failed:', err);
    process.exit(1);
  });
}
