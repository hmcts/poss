import type { WaTask, WaTaskMapping } from '../data-model/schemas.ts';
import { getTasksForState, getTasksForEvent, getAlignmentSummary, getEventWaContext } from '../wa-task-engine/index.ts';
import { getWaTaskBadge, getWaTaskTooltip } from './index.ts';

// ── Types ───────────────────────────────────────────────────────────

export interface NodeWaBadge {
  label: string;
  colour: string;
}

export interface StateDetailTask {
  taskName: string;
  alignment: string;
  badge: { label: string; colour: string; icon: string };
  tooltip: string;
}

export interface TransitionWaTask {
  targetStateId: string;
  targetStateLabel: string;
  condition: string;
  isSystemTriggered: boolean;
  isTimeBased: boolean;
  events: Array<{
    eventName: string;
    waTasks: StateDetailTask[];
  }>;
}

export interface EventMatrixWaColumn {
  taskName: string;
  alignment: string;
  colourDot: string;
}

export interface WaFilterOption {
  value: string;
  label: string;
}

// ── Colour constants ────────────────────────────────────────────────

const COLOUR_GREEN = '#22C55E';
const COLOUR_AMBER = '#F59E0B';
const COLOUR_RED = '#EF4444';

// ── getNodeWaBadge ──────────────────────────────────────────────────

export function getNodeWaBadge(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): NodeWaBadge | null {
  const tasks = getTasksForState(stateId, events, waMappings, waTasks);
  if (tasks.length === 0) return null;

  const summary = getAlignmentSummary(tasks, waMappings);
  let colour: string;
  if (summary.gap > 0) {
    colour = COLOUR_RED;
  } else if (summary.partial > 0) {
    colour = COLOUR_AMBER;
  } else {
    colour = COLOUR_GREEN;
  }

  const label = tasks.length === 1 ? '1 task' : `${tasks.length} tasks`;
  return { label, colour };
}

// ── getStateDetailWaTasks ───────────────────────────────────────────

export function getStateDetailWaTasks(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): StateDetailTask[] {
  const tasks = getTasksForState(stateId, events, waMappings, waTasks);
  return tasks.map((task) => {
    const badge = getWaTaskBadge(task.alignment);
    const mapping = waMappings.find((m) => m.waTaskId === task.id);
    const tooltip = mapping ? getWaTaskTooltip(task, mapping) : task.taskName;
    return {
      taskName: task.taskName,
      alignment: task.alignment,
      badge,
      tooltip,
    };
  });
}

// ── getEventMatrixWaColumn ──────────────────────────────────────────

export function getEventMatrixWaColumn(
  eventName: string,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): EventMatrixWaColumn | null {
  const context = getEventWaContext(eventName, waMappings, waTasks);
  if (!context) return null;

  const badge = getWaTaskBadge(context.alignment);
  return {
    taskName: context.task.taskName,
    alignment: context.alignment,
    colourDot: badge.colour,
  };
}

// ── getWaTaskFilterOptions ──────────────────────────────────────────

export function getWaTaskFilterOptions(
  waTasks: WaTask[],
): WaFilterOption[] {
  const taskOptions: WaFilterOption[] = waTasks.map((task) => ({
    value: task.taskName,
    label: task.taskName,
  }));

  return [
    ...taskOptions,
    { value: '__none__', label: 'No WA Task' },
    { value: '__gaps__', label: 'WA Gaps' },
  ];
}

// ── filterEventsByWaTask ────────────────────────────────────────────

// ── getTransitionWaTasks ─────────────────────────────────────────────

export function getTransitionWaTasks(
  stateId: string,
  states: Array<{ id: string; uiLabel: string }>,
  transitions: Array<{ from: string; to: string; condition: string | null; isSystemTriggered: boolean; isTimeBased: boolean }>,
  events: Array<{ state: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): TransitionWaTask[] {
  const outgoing = transitions.filter((t) => t.from === stateId);
  const eventsAtState = events.filter((e) => e.state === stateId);

  return outgoing.map((transition) => {
    const targetState = states.find((s) => s.id === transition.to);

    // For each event at this state, resolve its WA tasks
    const eventEntries = eventsAtState.map((event) => {
      const tasks = getTasksForEvent(event.name, waMappings, waTasks);
      const detailTasks: StateDetailTask[] = tasks.map((task) => {
        const badge = getWaTaskBadge(task.alignment);
        const mapping = waMappings.find((m) => m.waTaskId === task.id);
        const tooltip = mapping ? getWaTaskTooltip(task, mapping) : task.taskName;
        return { taskName: task.taskName, alignment: task.alignment, badge, tooltip };
      });
      return { eventName: event.name, waTasks: detailTasks };
    });

    return {
      targetStateId: transition.to,
      targetStateLabel: targetState?.uiLabel ?? transition.to,
      condition: transition.condition ?? '',
      isSystemTriggered: transition.isSystemTriggered,
      isTimeBased: transition.isTimeBased,
      events: eventEntries.filter((e) => e.waTasks.length > 0),
    };
  });
}

export function filterEventsByWaTask(
  events: Array<{ state: string; name: string; [key: string]: unknown }>,
  waTaskFilter: string,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): Array<{ state: string; name: string; [key: string]: unknown }> {
  if (!waTaskFilter || waTaskFilter === '') return events;

  if (waTaskFilter === '__none__') {
    return events.filter((event) => {
      const tasks = getTasksForEvent(event.name, waMappings, waTasks);
      return tasks.length === 0;
    });
  }

  if (waTaskFilter === '__gaps__') {
    return events.filter((event) => {
      const tasks = getTasksForEvent(event.name, waMappings, waTasks);
      return tasks.some((t) => t.alignment === 'gap');
    });
  }

  // Filter by task name: show events mapped to a task with this name
  return events.filter((event) => {
    const tasks = getTasksForEvent(event.name, waMappings, waTasks);
    return tasks.some((t) => t.taskName === waTaskFilter);
  });
}
