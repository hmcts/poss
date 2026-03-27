import type { WaTask, WaTaskMapping } from '../data-model/schemas.ts';
import {
  getEventWaContext,
  getTasksForState,
  getAlignmentSummary,
} from '../wa-task-engine/index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface WaTaskBadge {
  label: string;
  colour: string;
  icon: string;
}

export interface WaTaskMeta {
  taskName: string;
  alignment: string;
  context?: string;
  notes: string;
}

export interface WaEnrichedEvent {
  [key: string]: unknown;
  waTask?: WaTaskMeta;
}

export interface WaTaskPanelItem {
  task: WaTask;
  badge: WaTaskBadge;
  tooltip: string;
}

export interface WaTaskPanelData {
  tasks: WaTaskPanelItem[];
  summary: { aligned: number; partial: number; gap: number };
  hasGaps: boolean;
}

export interface WaTaskCountSummary {
  total: number;
  aligned: number;
  partial: number;
  gap: number;
}

// ── Badge ───────────────────────────────────────────────────────────

const BADGE_MAP: Record<string, WaTaskBadge> = {
  aligned: { label: 'Aligned', colour: '#22C55E', icon: 'check' },
  partial: { label: 'Partial', colour: '#F59E0B', icon: 'warning' },
  gap:     { label: 'Gap',     colour: '#EF4444', icon: 'cross' },
};

export function getWaTaskBadge(alignment: string): WaTaskBadge {
  return BADGE_MAP[alignment] ?? { label: 'Unknown', colour: '#6B7280', icon: 'unknown' };
}

// ── Tooltip ─────────────────────────────────────────────────────────

export function getWaTaskTooltip(task: WaTask, mapping: WaTaskMapping): string {
  let tooltip = `${task.taskName} -- Triggered by: ${task.triggerDescription}`;
  if (mapping.alignmentNotes && mapping.alignmentNotes.length > 0) {
    tooltip += ` | Note: ${mapping.alignmentNotes}`;
  }
  return tooltip;
}

// ── Event Enrichment ────────────────────────────────────────────────

export function enrichEventWithWaTask(
  event: Record<string, unknown>,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaEnrichedEvent {
  const context = getEventWaContext(event.name as string, mappings, tasks);
  if (!context) {
    return { ...event } as WaEnrichedEvent;
  }
  return {
    ...event,
    waTask: {
      taskName: context.task.taskName,
      alignment: context.alignment,
      notes: context.notes,
    },
  } as WaEnrichedEvent;
}

// ── Batch Enrichment ────────────────────────────────────────────────

export function enrichAvailableActions(
  actions: Record<string, unknown>[],
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaEnrichedEvent[] {
  return actions.map((action) => enrichEventWithWaTask(action, mappings, tasks));
}

// ── Panel Preparation ───────────────────────────────────────────────

export function prepareWaTaskPanel(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaTaskPanelData {
  const resolvedTasks = getTasksForState(stateId, events, mappings, tasks);

  const panelTasks: WaTaskPanelItem[] = resolvedTasks.map((task) => {
    const mapping = mappings.find((m) => m.waTaskId === task.id);
    return {
      task,
      badge: getWaTaskBadge(task.alignment),
      tooltip: mapping ? getWaTaskTooltip(task, mapping) : task.taskName,
    };
  });

  const summary = getAlignmentSummary(resolvedTasks, mappings);
  const hasGaps = summary.gap > 0;

  return { tasks: panelTasks, summary, hasGaps };
}

// ── State-Level Counts ──────────────────────────────────────────────

export function getStateWaTaskCount(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaTaskCountSummary {
  const resolvedTasks = getTasksForState(stateId, events, mappings, tasks);
  const summary = getAlignmentSummary(resolvedTasks, mappings);
  return {
    total: summary.aligned + summary.partial + summary.gap,
    ...summary,
  };
}
