import type { WaTask, WaTaskMapping } from '../data-model/schemas.ts';
import { getTasksForEvent } from '../wa-task-engine/index.ts';
import { getWaTaskBadge } from './index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface TaskCard {
  taskName: string;
  badge: { label: string; colour: string; icon: string };
  triggerDescription: string;
  notes: string;
  context: string;
}

export interface TimelineChip {
  taskName: string;
  alignment: string;
  colour: string;
}

export interface AlignmentWarning {
  type: string;
  message: string;
}

// ── shouldShowWaToggle ──────────────────────────────────────────────

export function shouldShowWaToggle(
  waTasks: WaTask[] | null | undefined,
  waMappings: WaTaskMapping[] | null | undefined,
): boolean {
  if (!waTasks || !waMappings) return false;
  return waTasks.length > 0 && waMappings.length > 0;
}

// ── getEventTaskCards ───────────────────────────────────────────────

export function getEventTaskCards(
  eventName: string,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): TaskCard[] {
  const tasks = getTasksForEvent(eventName, waMappings, waTasks);
  return tasks.map((task) => {
    const mapping = waMappings.find((m) => m.waTaskId === task.id);
    const badge = getWaTaskBadge(task.alignment);
    return {
      taskName: task.taskName,
      badge,
      triggerDescription: task.triggerDescription,
      notes: mapping?.alignmentNotes ?? '',
      context: task.taskContext,
    };
  });
}

// ── getTimelineChips ────────────────────────────────────────────────

export function getTimelineChips(
  eventName: string,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): TimelineChip[] {
  const tasks = getTasksForEvent(eventName, waMappings, waTasks);
  return tasks.map((task) => {
    const badge = getWaTaskBadge(task.alignment);
    return {
      taskName: task.taskName,
      alignment: task.alignment,
      colour: badge.colour,
    };
  });
}

// ── getAlignmentWarning ─────────────────────────────────────────────

export function getAlignmentWarning(
  eventName: string,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): AlignmentWarning | null {
  const tasks = getTasksForEvent(eventName, waMappings, waTasks);
  if (tasks.length === 0) return null;
  const hasPartial = tasks.some((t) => t.alignment === 'partial');
  if (!hasPartial) return null;
  const partialNames = tasks
    .filter((t) => t.alignment === 'partial')
    .map((t) => t.taskName);
  return {
    type: 'partial',
    message: `Partial alignment: ${partialNames.join(', ')}`,
  };
}

// ── isPaymentRelatedState ───────────────────────────────────────────

export function isPaymentRelatedState(
  technicalName: string | null | undefined,
): boolean {
  if (!technicalName) return false;
  if (technicalName === 'PENDING_CASE_ISSUED') return true;
  return technicalName.toUpperCase().includes('PAYMENT');
}

// ── getEmptyStateMessage ────────────────────────────────────────────

export function getEmptyStateMessage(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): string | null {
  if (!waTasks || waTasks.length === 0 || !waMappings || waMappings.length === 0) {
    return null;
  }
  const eventsAtState = events.filter((e) => e.state === stateId);
  for (const evt of eventsAtState) {
    const tasks = getTasksForEvent(evt.name, waMappings, waTasks);
    if (tasks.length > 0) return null;
  }
  return 'No caseworker tasks at this state';
}
