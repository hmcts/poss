import type { WaTask, WaTaskMapping } from '../data-model/schemas.ts';
import { getAlignmentSummary } from '../wa-task-engine/index.ts';
import { getWaTaskBadge } from './index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface DashboardSummary {
  total: number;
  aligned: number;
  partial: number;
  gap: number;
  alignedPct: number;
  partialPct: number;
  gapPct: number;
}

export interface AlignedTaskRow {
  taskName: string;
  triggerDescription: string;
  matchedEvents: string[];
  alignment: string;
  badge: { label: string; colour: string; icon: string };
}

export interface PartialTaskRow {
  taskName: string;
  triggerDescription: string;
  matchedEvents: string[];
  missing: string;
  alignment: string;
  badge: { label: string; colour: string; icon: string };
}

export interface GapTaskRow {
  taskName: string;
  triggerDescription: string;
  matchedEvents: string[];
  recommendation: string;
  alignment: string;
  badge: { label: string; colour: string; icon: string };
}

// ── Helpers ─────────────────────────────────────────────────────────

function getMappingForTask(taskId: string, mappings: WaTaskMapping[]): WaTaskMapping | undefined {
  return mappings.find((m) => m.waTaskId === taskId);
}

function roundPct(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100 * 10) / 10;
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

// ── 1. getDashboardSummary ──────────────────────────────────────────

export function getDashboardSummary(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): DashboardSummary {
  const counts = getAlignmentSummary(waTasks, waMappings);
  const total = counts.aligned + counts.partial + counts.gap;

  return {
    total,
    aligned: counts.aligned,
    partial: counts.partial,
    gap: counts.gap,
    alignedPct: roundPct(counts.aligned, total),
    partialPct: roundPct(counts.partial, total),
    gapPct: roundPct(counts.gap, total),
  };
}

// ── 2. getAlignedTaskRows ───────────────────────────────────────────

export function getAlignedTaskRows(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): AlignedTaskRow[] {
  return waTasks
    .filter((t) => t.alignment === 'aligned')
    .map((task) => {
      const mapping = getMappingForTask(task.id, waMappings);
      return {
        taskName: task.taskName,
        triggerDescription: task.triggerDescription,
        matchedEvents: mapping?.eventIds ?? [],
        alignment: 'aligned',
        badge: getWaTaskBadge('aligned'),
      };
    });
}

// ── 3. getPartialTaskRows ───────────────────────────────────────────

export function getPartialTaskRows(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): PartialTaskRow[] {
  return waTasks
    .filter((t) => t.alignment === 'partial')
    .map((task) => {
      const mapping = getMappingForTask(task.id, waMappings);
      return {
        taskName: task.taskName,
        triggerDescription: task.triggerDescription,
        matchedEvents: mapping?.eventIds ?? [],
        missing: mapping?.alignmentNotes ?? '',
        alignment: 'partial',
        badge: getWaTaskBadge('partial'),
      };
    });
}

// ── 4. getGapTaskRows ───────────────────────────────────────────────

export function getGapTaskRows(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): GapTaskRow[] {
  return waTasks
    .filter((t) => t.alignment === 'gap')
    .map((task) => {
      const mapping = getMappingForTask(task.id, waMappings);
      return {
        taskName: task.taskName,
        triggerDescription: task.triggerDescription,
        matchedEvents: mapping?.eventIds ?? [],
        recommendation: mapping?.alignmentNotes ?? '',
        alignment: 'gap',
        badge: getWaTaskBadge('gap'),
      };
    });
}

// ── 5. groupTasksByState ────────────────────────────────────────────

export function groupTasksByState(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
  events: Array<{ state: string; name: string }>,
): Record<string, WaTask[]> {
  if (events.length === 0) return {};

  const result: Record<string, WaTask[]> = {};

  // Build a map of event name -> states where it appears
  const eventToStates = new Map<string, Set<string>>();
  for (const event of events) {
    if (!eventToStates.has(event.name)) {
      eventToStates.set(event.name, new Set());
    }
    eventToStates.get(event.name)!.add(event.state);
  }

  // For each task, find which states its mapped events appear in
  for (const task of waTasks) {
    const mapping = getMappingForTask(task.id, waMappings);
    if (!mapping) continue;

    const states = new Set<string>();
    for (const eventName of mapping.eventIds) {
      const eventStates = eventToStates.get(eventName);
      if (eventStates) {
        for (const state of eventStates) {
          states.add(state);
        }
      }
    }

    for (const state of states) {
      if (!result[state]) {
        result[state] = [];
      }
      // Deduplicate by task id within each state
      if (!result[state].some((t) => t.id === task.id)) {
        result[state].push(task);
      }
    }
  }

  return result;
}

// ── 6. groupTasksByContext ──────────────────────────────────────────

export function groupTasksByContext(
  waTasks: WaTask[],
): Record<string, WaTask[]> {
  if (waTasks.length === 0) return {};

  const result: Record<string, WaTask[]> = {};

  for (const task of waTasks) {
    const ctx = task.taskContext;
    if (!result[ctx]) {
      result[ctx] = [];
    }
    result[ctx].push(task);
  }

  return result;
}

// ── 7. exportAlignmentCsv ──────────────────────────────────────────

export function exportAlignmentCsv(
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): string {
  const header = 'Task Name,Trigger,Alignment,Matched Events,Alignment Notes';
  const mappingByTaskId = new Map(waMappings.map((m) => [m.waTaskId, m]));

  const rows = waTasks.map((task) => {
    const mapping = mappingByTaskId.get(task.id);
    const matchedEvents = mapping?.eventIds?.join(';') ?? '';
    const notes = mapping?.alignmentNotes ?? '';

    return [
      csvEscape(task.taskName),
      csvEscape(task.triggerDescription),
      csvEscape(task.alignment),
      csvEscape(matchedEvents),
      csvEscape(notes),
    ].join(',');
  });

  return [header, ...rows].join('\n');
}
