/**
 * seed.ts — One-shot script to build and write the ReferenceDataBlob to Azure Blob Storage.
 *
 * WARNING: Re-running this script will OVERWRITE any manual edits made to the blob via the UI.
 * Only run this script to reinitialise reference data from source files.
 *
 * Pure transformation functions are exported individually for testing.
 * main() is called at the bottom when this file is executed directly.
 */

import pkg from '@next/env';
pkg.loadEnvConfig(process.cwd());

import type { Persona, RefEvent, EventTaskAssoc, RefState, StateEventAssoc, RefTransition } from './schema.ts';
import { ReferenceDataBlobSchema } from './schema.ts';
import { writeReferenceData } from './blob-client.ts';

// ── Local types ──────────────────────────────────────────────────────────────

type WaMapping = {
  waTaskId: string;
  eventIds: string[];
  alignmentNotes: string;
};

type IngestedState = {
  id: string;
  technicalName: string;
  uiLabel: string;
  claimType: string;
};

type IngestedEvent = {
  id: string;
  name: string;
  claimType: string;
  state: string;
  actors: Record<string, boolean>;
  isSystemEvent: boolean;
  notes: string;
  hasOpenQuestions: boolean;
};


// ── Pure transformation functions ────────────────────────────────────────────

/**
 * Converts a human-readable name to a URL-safe slug.
 * Lowercase, replace non-alphanumeric runs with hyphens, trim leading/trailing hyphens.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Converts a persona role mapping object to an array of Persona records.
 * The object key becomes the `id` field.
 */
export function personasFromMap(
  raw: Record<string, { roles: string[]; isCrossCutting: boolean }>,
): Persona[] {
  return Object.entries(raw).map(([id, value]) => ({ id, ...value }));
}

/**
 * Extracts unique events from WA mappings.
 * Deduplicates by raw event name, emitting { id: slugify(name), name, description: '' }.
 */
export function eventsFromMappings(mappings: WaMapping[]): RefEvent[] {
  const seen = new Map<string, true>();
  const events: RefEvent[] = [];
  for (const mapping of mappings) {
    for (const name of mapping.eventIds) {
      if (!seen.has(name)) {
        seen.set(name, true);
        events.push({ id: slugify(name), name, description: '', actors: {}, isSystemEvent: false, hasOpenQuestions: false, notes: '' });
      }
    }
  }
  return events;
}

/**
 * Explodes WA mappings into event-task association rows.
 * Entries with empty eventIds[] produce zero rows.
 */
export function eventTaskAssocsFromMappings(mappings: WaMapping[]): EventTaskAssoc[] {
  const assocs: EventTaskAssoc[] = [];
  for (const mapping of mappings) {
    for (const name of mapping.eventIds) {
      assocs.push({
        eventId: slugify(name),
        waTaskId: mapping.waTaskId,
        alignmentNotes: mapping.alignmentNotes,
      });
    }
  }
  return assocs;
}

/**
 * Flattens ingested state files into RefState records.
 * Maps technicalName → name, sets description to empty string.
 */
export function statesFromIngested(
  files: Array<{ states: IngestedState[] }>,
): RefState[] {
  return files.flatMap(f => f.states).map(s => ({
    id: s.id,
    name: s.uiLabel,
    description: '',
    claimType: s.claimType,
  }));
}

/**
 * Flattens ingested event files into RefEvent records.
 * Deduplicates by id (first occurrence wins).
 */
export function eventsFromIngested(
  files: Array<{ claimType: string; events: IngestedEvent[] }>,
): RefEvent[] {
  const seen = new Map<string, true>();
  const events: RefEvent[] = [];
  for (const file of files) {
    for (const ev of file.events) {
      if (!seen.has(ev.id)) {
        seen.set(ev.id, true);
        events.push({
          id: ev.id,
          name: ev.name,
          description: '',
          isSystemEvent: ev.isSystemEvent,
          notes: ev.notes,
          actors: {},
          hasOpenQuestions: false,
        });
      }
    }
  }
  return events;
}

/**
 * Maps CCD state IDs (as used in ingested event files) to model state IDs.
 * Key: `${claimType}:${ccdStateId}` — value: state id in the blob.
 *
 * CCD state IDs are more granular than the possession model states;
 * multiple CCD IDs map to a single model state.
 */
const CCD_STATE_MAP: Record<string, string> = {
  // ── Main Claim England ────────────────────────────────────────────────────
  'MAIN_CLAIM_ENGLAND:AWAITING_SUBMISSION_TO_HMCTS': 'mce-draft',
  'MAIN_CLAIM_ENGLAND:AWAITING_RESUBMISSION_TO_HMCTS': 'mce-draft',
  'MAIN_CLAIM_ENGLAND:REQUESTED_FOR_DELETION': 'mce-draft',
  'MAIN_CLAIM_ENGLAND:PENDING_CASE_ISSUED': 'mce-submitted',
  'MAIN_CLAIM_ENGLAND:CASE_ISSUED': 'mce-submitted',
  'MAIN_CLAIM_ENGLAND:CASE_PROGRESSION': 'mce-with-judge',
  'MAIN_CLAIM_ENGLAND:JUDICIAL_REFERRAL': 'mce-with-judge',
  'MAIN_CLAIM_ENGLAND:CASE_STAYED': 'mce-with-judge',
  'MAIN_CLAIM_ENGLAND:BREATHING_SPACE': 'mce-with-judge',
  'MAIN_CLAIM_ENGLAND:HEARING_READINESS': 'mce-listed-for-hearing',
  'MAIN_CLAIM_ENGLAND:PREPARE_FOR_HEARING_CONDUCT_HEARING': 'mce-listed-for-hearing',
  'MAIN_CLAIM_ENGLAND:DECISION_OUTCOME': 'mce-order-made',
  'MAIN_CLAIM_ENGLAND:ALL_FINAL_ORDERS_ISSUED': 'mce-order-made',
  'MAIN_CLAIM_ENGLAND:CLOSED': 'mce-closed',
  // ── Appeals ───────────────────────────────────────────────────────────────
  'APPEALS:AWAITING_SUBMISSION_TO_HMCTS': 'app-notice-filed',
  'APPEALS:AWAITING_RESUBMISSION_TO_HMCTS': 'app-notice-filed',
  'APPEALS:PENDING_CASE_ISSUED': 'app-notice-filed',
  'APPEALS:DRAFT_DISCARDED': 'app-notice-filed',
  'APPEALS:CASE_ISSUED': 'app-notice-filed',
  'APPEALS:JUDICIAL_REFERRAL': 'app-permission-review',
  'APPEALS:CASE_PROGRESSION': 'app-permission-granted',
  'APPEALS:CASE_STAYED': 'app-appeal-hearing',
  'APPEALS:BREATHING_SPACE': 'app-appeal-hearing',
  'APPEALS:HEARING_READINESS': 'app-appeal-hearing',
  'APPEALS:PREPARE_FOR_HEARING_CONDUCT_HEARING': 'app-appeal-hearing',
  'APPEALS:DECISION_OUTCOME': 'app-appeal-decided',
  'APPEALS:ALL_FINAL_ORDERS_ISSUED': 'app-appeal-decided',
  'APPEALS:CLOSED': 'app-dismissed',
  // ── Counter Claim ─────────────────────────────────────────────────────────
  'COUNTER_CLAIM:AWAITING_SUBMISSION_TO_HMCTS': 'cc-draft',
  'COUNTER_CLAIM:AWAITING_RESUBMISSION_TO_HMCTS': 'cc-draft',
  'COUNTER_CLAIM:REQUESTED_FOR_DELETION': 'cc-draft',
  'COUNTER_CLAIM:PENDING_CASE_ISSUED': 'cc-filed',
  'COUNTER_CLAIM:CASE_ISSUED': 'cc-filed',
  'COUNTER_CLAIM:CASE_PROGRESSION': 'cc-with-judge',
  'COUNTER_CLAIM:JUDICIAL_REFERRAL': 'cc-with-judge',
  'COUNTER_CLAIM:CASE_STAYED': 'cc-with-judge',
  'COUNTER_CLAIM:BREATHING_SPACE': 'cc-with-judge',
  'COUNTER_CLAIM:HEARING_READINESS': 'cc-heard-together',
  'COUNTER_CLAIM:PREPARE_FOR_HEARING_CONDUCT_HEARING': 'cc-heard-together',
  'COUNTER_CLAIM:DECISION_OUTCOME': 'cc-determined',
  'COUNTER_CLAIM:ALL_FINAL_ORDERS_ISSUED': 'cc-determined',
  'COUNTER_CLAIM:CLOSED': 'cc-closed',
  // ── Enforcement ───────────────────────────────────────────────────────────
  'ENFORCEMENT:AWAITING_SUBMISSION_TO_HMCTS': 'enf-warrant-requested',
  'ENFORCEMENT:AWAITING_RESUBMISSION_TO_HMCTS': 'enf-warrant-requested',
  'ENFORCEMENT:REQUESTED_FOR_DELETION': 'enf-warrant-requested',
  'ENFORCEMENT:PENDING_CASE_ISSUED': 'enf-warrant-requested',
  'ENFORCEMENT:DRAFT_DISCARDED': 'enf-warrant-requested',
  'ENFORCEMENT:CASE_PROGRESSION': 'enf-warrant-issued',
  'ENFORCEMENT:AWAITING_BAILIFF_ALLOCATION': 'enf-warrant-issued',
  'ENFORCEMENT:JUDICIAL_REFERRAL': 'enf-with-bailiff',
  'ENFORCEMENT:AWAITING_PROPERTY_VISIT': 'enf-with-bailiff',
  'ENFORCEMENT:CASE_STAYED': 'enf-suspended',
  'ENFORCEMENT:BREATHING_SPACE': 'enf-suspended',
  'ENFORCEMENT:HEARING_READINESS': 'enf-eviction-scheduled',
  'ENFORCEMENT:PREPARE_FOR_HEARING_CONDUCT_HEARING': 'enf-eviction-scheduled',
  'ENFORCEMENT:AWAITING_SCHEDULING': 'enf-eviction-scheduled',
  'ENFORCEMENT:AWAITING_ENFORCEMENT_OUTCOME': 'enf-executed',
  'ENFORCEMENT:WRIT_ISSUED': 'enf-executed',
  'ENFORCEMENT:CLOSED': 'enf-executed',
  // ── General Applications ──────────────────────────────────────────────────
  'GENERAL_APPLICATIONS:AWAITING_SUBMISSION_TO_HMCTS': 'ga-draft',
  'GENERAL_APPLICATIONS:DRAFT_AWAITING_CATEGORISATION': 'ga-draft',
  'GENERAL_APPLICATIONS:PENDING_CASE_ISSUED': 'ga-draft',
  'GENERAL_APPLICATIONS:DRAFT_DISCARDED': 'ga-draft',
  'GENERAL_APPLICATIONS:CASE_ISSUED': 'ga-filed',
  'GENERAL_APPLICATIONS:JUDICIAL_REFERRAL': 'ga-with-judge',
  'GENERAL_APPLICATIONS:CASE_PROGRESSION': 'ga-with-judge',
  'GENERAL_APPLICATIONS:AWAITING_ADDITIONAL_PAYMENT': 'ga-with-judge',
  'GENERAL_APPLICATIONS:CASE_STAYED': 'ga-with-judge',
  'GENERAL_APPLICATIONS:BREATHING_SPACE': 'ga-with-judge',
  'GENERAL_APPLICATIONS:HEARING_READINESS': 'ga-order-made',
  'GENERAL_APPLICATIONS:PREPARE_FOR_HEARING_CONDUCT_HEARING': 'ga-order-made',
  'GENERAL_APPLICATIONS:DECISION_OUTCOME': 'ga-order-made',
  'GENERAL_APPLICATIONS:ALL_FINAL_ORDERS_ISSUED': 'ga-order-made',
  'GENERAL_APPLICATIONS:CLOSED': 'ga-closed',
};

/**
 * Builds state-event association rows from ingested event and state files.
 * Matches ev.state (CCD state ID) against CCD_STATE_MAP keyed by claimType + CCD ID.
 * Deduplicates by stateId:eventId pair.
 */
export function stateEventAssocsFromIngested(
  eventFiles: Array<{ claimType: string; events: IngestedEvent[] }>,
  _stateFiles: Array<{ states: IngestedState[] }>,
): StateEventAssoc[] {
  const assocs: StateEventAssoc[] = [];
  const seen = new Set<string>();
  for (const file of eventFiles) {
    for (const ev of file.events) {
      const stateId = CCD_STATE_MAP[`${file.claimType}:${ev.state}`];
      if (!stateId) continue;
      const key = `${stateId}:${ev.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        assocs.push({ stateId, eventId: ev.id });
      }
    }
  }
  return assocs;
}

// ── Ingested transition type ─────────────────────────────────────────────────

type IngestedTransition = {
  from: string;
  to: string;
  condition: string;
  isSystemTriggered: boolean;
  isTimeBased: boolean;
};

/**
 * Converts an ingested state file's transitions array to RefTransition[].
 * Accepts the full state file object ({ states, transitions }) or an array
 * (treated as empty). Returns [] for null/undefined or missing transitions.
 */
export function transitionsFromIngested(
  input: { states?: unknown[]; transitions?: IngestedTransition[] } | null | undefined | unknown[],
): RefTransition[] {
  if (!input || Array.isArray(input)) return [];
  const raw = (input as { transitions?: IngestedTransition[] }).transitions;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map((t, i) => ({
    id: `tr-${t.from}-${t.to}-${i}`,
    fromStateId: t.from,
    toStateId: t.to,
    condition: t.condition ?? '',
    isSystemTriggered: t.isSystemTriggered ?? false,
    isTimeBased: t.isTimeBased ?? false,
  }));
}

// ── main() ───────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const cwd = process.cwd();

  // Read static data files
  const waTasks = JSON.parse(
    await fs.readFile(path.join(cwd, 'data/wa-tasks.json'), 'utf-8'),
  );
  const personaRoleMapping = JSON.parse(
    await fs.readFile(path.join(cwd, 'data/persona-role-mapping.json'), 'utf-8'),
  );
  const waMappings: WaMapping[] = JSON.parse(
    await fs.readFile(path.join(cwd, 'data/wa-mappings.json'), 'utf-8'),
  );

  // Glob state ingestion files
  const statesDir = path.join(cwd, 'src/data-ingestion/states');
  const stateFiles = (await fs.readdir(statesDir))
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(statesDir, f));

  const ingestedStateFiles = await Promise.all(
    stateFiles.map(async f => JSON.parse(await fs.readFile(f, 'utf-8'))),
  );

  // Glob event ingestion files
  const eventsDir = path.join(cwd, 'src/data-ingestion/events');
  const eventJsonFiles = (await fs.readdir(eventsDir))
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(eventsDir, f));

  const ingestedEventFiles = await Promise.all(
    eventJsonFiles.map(async f => JSON.parse(await fs.readFile(f, 'utf-8'))),
  );

  const blob = {
    states: statesFromIngested(ingestedStateFiles),
    events: eventsFromIngested(ingestedEventFiles),
    waTasks,
    personas: personasFromMap(personaRoleMapping),
    stateEventAssocs: stateEventAssocsFromIngested(ingestedEventFiles, ingestedStateFiles),
    eventTaskAssocs: eventTaskAssocsFromMappings(waMappings),
    personaStateAssocs: [],
    personaEventAssocs: [],
    personaTaskAssocs: [],
  };

  const validated = ReferenceDataBlobSchema.parse(blob);
  await writeReferenceData(validated);

  console.log(
    `Seeded: ${validated.states.length} states, ${validated.events.length} events, ` +
    `${validated.waTasks.length} waTasks, ${validated.personas.length} personas, ` +
    `${validated.eventTaskAssocs.length} eventTaskAssocs`,
  );
}

// Only run main() when this file is executed directly (not when imported for tests).
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] != null &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop()!);

if (isMain) {
  main().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
