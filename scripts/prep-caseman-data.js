/**
 * prep-caseman-data.js
 *
 * One-time script: reads three CSVs and writes data/caseman-events.json
 *
 * Usage: node scripts/prep-caseman-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE = path.resolve(__dirname, '../.business_context/SUPS-Caseman/app/caseman_database_source/reference_data/data/common');
const OUT_DIR = path.resolve(__dirname, '../data');

// ── Simple CSV row parser (handles basic quoting, strips CR) ─────────────────

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else if (ch !== '\r') {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function readCSV(filename) {
  const raw = fs.readFileSync(path.join(BASE, filename), 'utf8');
  return raw.split('\n').filter(l => l.trim()).map(parseCSVLine);
}

// ── Read CSVs ────────────────────────────────────────────────────────────────

const eventRows = readCSV('standard_events.csv');
const taskRows = readCSV('tasks.csv');
const prereqRows = readCSV('pre_req_events.csv');

// Build set of valid task codes from tasks.csv (col 0)
const validTaskCodes = new Set(taskRows.map(r => r[0]).filter(Boolean));

// Build prerequisite map: event_id → [prerequisite_event_ids]
// pre_req_events.csv: col 0 = event_id, col 1 = prerequisite_event_id
const prereqMap = new Map();
for (const row of prereqRows) {
  const eventId = parseInt(row[0], 10);
  const prereqId = parseInt(row[1], 10);
  if (!isNaN(eventId) && !isNaN(prereqId)) {
    if (!prereqMap.has(eventId)) prereqMap.set(eventId, []);
    prereqMap.get(eventId).push(prereqId);
  }
}

// ── Parse standard_events.csv ─────────────────────────────────────────────────
// Columns: 0=id, 1=type, 2=name, 3=?, 4=?, 5=task_code, 6=?, 7=?, 8=?, 9=?, 10=?

const casemanEvents = [];

for (const row of eventRows) {
  const rawId = row[0];
  const id = parseInt(rawId, 10);
  if (isNaN(id)) continue; // skip malformed rows

  const name = (row[2] || '').trim();
  if (!name) continue;

  // column 5 = task code reference (e.g. "EN1", "JH12", "CO2")
  const taskCodeRef = (row[5] || '').trim();

  // Resolve: if the code exists verbatim in tasks.csv, use it
  // Otherwise look for zero-padded variant (e.g. "CO2" might also match "CO002")
  const taskCodes = [];
  if (taskCodeRef) {
    if (validTaskCodes.has(taskCodeRef)) {
      taskCodes.push(taskCodeRef);
    } else {
      // Try zero-padded: "EN1" → "EN001", "JH12" → "JH012"
      const match = taskCodeRef.match(/^([A-Za-z]{2})(\d+)$/);
      if (match) {
        const paddedCode = match[1].toUpperCase() + match[2].padStart(3, '0');
        if (validTaskCodes.has(paddedCode)) {
          taskCodes.push(paddedCode);
        } else {
          // Use as-is anyway — it gives us the 2-letter prefix for domain derivation
          taskCodes.push(taskCodeRef.toUpperCase());
        }
      }
    }
  }

  const prerequisiteIds = prereqMap.get(id) || [];

  casemanEvents.push({ id, name, taskCodes, prerequisiteIds });
}

console.log(`Parsed ${casemanEvents.length} events from standard_events.csv`);

if (casemanEvents.length !== 497) {
  console.warn(`WARNING: expected 497 events, got ${casemanEvents.length}`);
}

// ── Write output ──────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

fs.writeFileSync(
  path.join(OUT_DIR, 'caseman-events.json'),
  JSON.stringify(casemanEvents, null, 2),
);

console.log(`Written data/caseman-events.json (${casemanEvents.length} events)`);

// ── Write empty mappings file if it doesn't exist ─────────────────────────────

const mappingsPath = path.join(OUT_DIR, 'caseman-mappings.json');
if (!fs.existsSync(mappingsPath)) {
  fs.writeFileSync(mappingsPath, '[]');
  console.log('Written data/caseman-mappings.json (empty array)');
} else {
  console.log('data/caseman-mappings.json already exists — not overwriting');
}
