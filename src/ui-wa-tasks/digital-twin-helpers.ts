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

// ── isEventBlockedByTasks ────────────────────────────────────────────

export function isEventBlockedByTasks(
  eventName: string,
  disabledTasks: Set<string>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): boolean {
  const tasks = getTasksForEvent(eventName, waMappings, waTasks);
  if (tasks.length === 0) return false;
  return tasks.every((t) => disabledTasks.has(t.id));
}

// ── computeEffectiveEnabledEvents ───────────────────────────────────

export function computeEffectiveEnabledEvents(
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  events: Array<{ id: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
  showWaTasks: boolean,
): Set<string> {
  if (!showWaTasks || disabledTasks.size === 0) return enabledEvents;
  const result = new Set(enabledEvents);
  for (const evt of events) {
    if (!result.has(evt.id)) continue;
    if (isEventBlockedByTasks(evt.name, disabledTasks, waTasks, waMappings)) {
      result.delete(evt.id);
    }
  }
  return result;
}

// ── getDisabledTaskCount ────────────────────────────────────────────

export function getDisabledTaskCount(disabledTasks: Set<string>): number {
  return disabledTasks.size;
}

// ── getTaskToggleState ──────────────────────────────────────────────

export function getTaskToggleState(
  taskId: string,
  disabledTasks: Set<string>,
  enabledEvents: Set<string>,
  waTasks?: WaTask[],
  waMappings?: WaTaskMapping[],
  events?: Array<{ id: string; name: string }>,
): { checked: boolean; interactive: boolean } {
  const checked = !disabledTasks.has(taskId);
  if (waTasks && waMappings && events) {
    const taskEventNames = waMappings
      .filter((m) => m.waTaskId === taskId)
      .flatMap((m) => m.eventIds);
    const parentIds = events
      .filter((e) => taskEventNames.includes(e.name))
      .map((e) => e.id);
    const interactive = parentIds.some((id) => enabledEvents.has(id));
    return { checked, interactive };
  }
  const interactive = enabledEvents.size > 1;
  return { checked, interactive };
}

// ── getEventBlockedReason ───────────────────────────────────────────

export function getEventBlockedReason(
  eventId: string,
  eventName: string,
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): 'event-disabled' | 'all-tasks-disabled' | null {
  if (!enabledEvents.has(eventId)) return 'event-disabled';
  if (isEventBlockedByTasks(eventName, disabledTasks, waTasks, waMappings)) {
    return 'all-tasks-disabled';
  }
  return null;
}

// ── getEffectiveDisabledCount ───────────────────────────────────────

export function getEffectiveDisabledCount(
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  allEvents: Array<{ id: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
  showWaTasks: boolean,
): number {
  const effective = computeEffectiveEnabledEvents(
    enabledEvents, disabledTasks, allEvents, waTasks, waMappings, showWaTasks,
  );
  return allEvents.length - effective.size;
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
  stateLabel?: string,
): string | null {
  if (!waTasks || waTasks.length === 0 || !waMappings || waMappings.length === 0) {
    return null;
  }
  const eventsAtState = events.filter((e) => e.state === stateId);
  for (const evt of eventsAtState) {
    const tasks = getTasksForEvent(evt.name, waMappings, waTasks);
    if (tasks.length > 0) return null;
  }
  const label = stateLabel ?? stateId;
  return `No caseworker tasks at ${label}`;
}
