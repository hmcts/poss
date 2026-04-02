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
 * Builds state-event association rows from ingested event and state files.
 * For each ingested event, finds the matching state by technicalName === event.state.
 * Logs a warning to stderr (and skips) if no state match is found.
 */
export function stateEventAssocsFromIngested(
  eventFiles: Array<{ claimType: string; events: IngestedEvent[] }>,
  stateFiles: Array<{ states: IngestedState[] }>,
): StateEventAssoc[] {
  // Build lookup: technicalName → stateId (first match wins across all claim types)
  const stateByTechnicalName = new Map<string, string>();
  for (const file of stateFiles) {
    for (const st of file.states) {
      if (!stateByTechnicalName.has(st.technicalName)) {
        stateByTechnicalName.set(st.technicalName, st.id);
      }
    }
  }

  const assocs: StateEventAssoc[] = [];
  const seen = new Set<string>();
  for (const file of eventFiles) {
    for (const ev of file.events) {
      const stateId = stateByTechnicalName.get(ev.state);
      if (!stateId) {
        if (ev.state) {
          console.warn(`stateEventAssocsFromIngested: no state match for "${ev.state}" (event "${ev.id}") — skipping`);
        }
        continue;
      }
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
