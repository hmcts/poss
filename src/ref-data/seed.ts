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

import type { Persona, RefEvent, EventTaskAssoc, RefState } from './schema.ts';
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
        events.push({ id: slugify(name), name, description: '' });
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

  const ingestedFiles = await Promise.all(
    stateFiles.map(async f => JSON.parse(await fs.readFile(f, 'utf-8'))),
  );

  const blob = {
    states: statesFromIngested(ingestedFiles),
    events: eventsFromMappings(waMappings),
    waTasks,
    personas: personasFromMap(personaRoleMapping),
    stateEventAssocs: [],
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
