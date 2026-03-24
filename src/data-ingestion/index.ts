import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { z } from 'zod';
import { KNOWN_ROLES } from '../data-model/enums.ts';
import {
  BreathingSpaceEntrySchema,
  StateSchema,
  TransitionSchema,
} from '../data-model/schemas.ts';
import type { BreathingSpaceEntry, Event, State, Transition } from '../data-model/schemas.ts';

export { BreathingSpaceEntrySchema };

// ── Open Question Detector ──────────────────────────────────────────

const OPEN_MARKERS = [
  /\?/i,
  /\bTBC\b/i,
  /\bTBD\b/i,
  /\bplaceholder\b/i,
  /\bquestion\b/i,
  /Alex to check/i,
];

export function detectOpenQuestions(notes: string): boolean {
  if (!notes) return false;
  return OPEN_MARKERS.some((re) => re.test(notes));
}

// ── Completeness Calculator ─────────────────────────────────────────

export function computeCompleteness(events: { hasOpenQuestions: boolean }[]): number {
  if (events.length === 0) return 0;
  const clean = events.filter((e) => !e.hasOpenQuestions).length;
  return Math.round((clean / events.length) * 100);
}

// ── Format A Parser ─────────────────────────────────────────────────

const FORMAT_A_META_KEYS = new Set(['name', 'state', 'notes', 'isSystemEvent']);

export function parseFormatASheet(rows: Record<string, any>[], claimTypeId: string): Event[] {
  return rows.map((row, index) => {
    const actors: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(row)) {
      if (FORMAT_A_META_KEYS.has(key)) continue;
      actors[key] = value === 'Y';
    }
    return {
      id: `${claimTypeId}:${index}`,
      name: row.name,
      claimType: claimTypeId,
      state: row.state,
      isSystemEvent: row.isSystemEvent ?? false,
      notes: row.notes ?? '',
      hasOpenQuestions: detectOpenQuestions(row.notes ?? ''),
      actors,
    };
  });
}

// ── Format B Parser ─────────────────────────────────────────────────

const ROLE_LOOKUP = new Map(KNOWN_ROLES.map((r) => [r.toLowerCase(), r]));

export function parseFormatBSheet(rows: Record<string, any>[], claimTypeId: string): Event[] {
  return rows.map((row, index) => {
    const actors: Record<string, boolean> = {};
    const whoStr: string = row.whoPermissions ?? '';
    const tokens = whoStr.split(/[,;]/).map((t: string) => t.trim()).filter(Boolean);
    for (const token of tokens) {
      const canonical = ROLE_LOOKUP.get(token.toLowerCase());
      if (canonical) {
        actors[canonical] = true;
      } else {
        console.warn(`Unrecognised role: "${token}"`);
      }
    }
    return {
      id: `${claimTypeId}:${index}`,
      name: row.name,
      claimType: claimTypeId,
      state: row.state,
      isSystemEvent: row.isSystemEvent ?? false,
      notes: row.notes ?? '',
      hasOpenQuestions: detectOpenQuestions(row.notes ?? ''),
      actors,
    };
  });
}

// ── Breathing Space / Stayed Parsers ────────────────────────────────

export function parseBreathingSpaceMatrix(rows: unknown[]): BreathingSpaceEntry[] {
  return rows.map((row) => BreathingSpaceEntrySchema.parse(row));
}

export function parseStayedMatrix(rows: unknown[]): BreathingSpaceEntry[] {
  return rows.map((row) => BreathingSpaceEntrySchema.parse(row));
}

// ── State & Transition Loader ───────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadStatesAndTransitions(
  claimTypeId: string,
): Promise<{ states: State[]; transitions: Transition[] }> {
  const filePath = join(__dirname, 'states', `${claimTypeId}.json`);
  const raw = JSON.parse(await readFile(filePath, 'utf-8'));
  return {
    states: z.array(StateSchema).parse(raw.states),
    transitions: z.array(TransitionSchema).parse(raw.transitions),
  };
}
