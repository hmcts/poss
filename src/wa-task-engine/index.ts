import type { WaTask, WaTaskMapping } from '../data-model/schemas.ts';

/**
 * Find all WA tasks triggered by a given event name.
 * Matches event name against each mapping's eventIds array (case-sensitive exact match).
 */
export function getTasksForEvent(
  eventName: string,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaTask[] {
  const matchingTaskIds = mappings
    .filter((m) => m.eventIds.includes(eventName))
    .map((m) => m.waTaskId);

  return tasks.filter((t) => matchingTaskIds.includes(t.id));
}

/**
 * Find all WA tasks for events at a given state, deduplicated by task id.
 */
export function getTasksForState(
  stateId: string,
  events: Array<{ state: string; name: string }>,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): WaTask[] {
  const eventsAtState = events.filter((e) => e.state === stateId);
  const seenIds = new Set<string>();
  const result: WaTask[] = [];

  for (const event of eventsAtState) {
    const matched = getTasksForEvent(event.name, mappings, tasks);
    for (const task of matched) {
      if (!seenIds.has(task.id)) {
        seenIds.add(task.id);
        result.push(task);
      }
    }
  }

  return result;
}

/**
 * Count tasks by alignment status.
 */
export function getAlignmentSummary(
  tasks: WaTask[],
  _mappings: WaTaskMapping[],
): { aligned: number; partial: number; gap: number } {
  let aligned = 0;
  let partial = 0;
  let gap = 0;

  for (const task of tasks) {
    if (task.alignment === 'aligned') aligned++;
    else if (task.alignment === 'partial') partial++;
    else if (task.alignment === 'gap') gap++;
  }

  return { aligned, partial, gap };
}

/**
 * Return tasks with alignment === 'gap'.
 */
export function getUnmappedTasks(
  tasks: WaTask[],
  _mappings: WaTaskMapping[],
): WaTask[] {
  return tasks.filter((t) => t.alignment === 'gap');
}

/**
 * Return partial tasks paired with their alignmentNotes from the mapping.
 */
export function getPartialTasks(
  tasks: WaTask[],
  mappings: WaTaskMapping[],
): Array<{ task: WaTask; missing: string }> {
  const mappingByTaskId = new Map(mappings.map((m) => [m.waTaskId, m]));

  return tasks
    .filter((t) => t.alignment === 'partial')
    .map((task) => {
      const mapping = mappingByTaskId.get(task.id);
      return {
        task,
        missing: mapping?.alignmentNotes ?? '',
      };
    });
}

/**
 * Get WA context for a single event. Returns the first matching mapping/task, or null.
 */
export function getEventWaContext(
  eventName: string,
  mappings: WaTaskMapping[],
  tasks: WaTask[],
): { task: WaTask; alignment: string; notes: string } | null {
  const mapping = mappings.find((m) => m.eventIds.includes(eventName));
  if (!mapping) return null;

  const task = tasks.find((t) => t.id === mapping.waTaskId);
  if (!task) return null;

  return {
    task,
    alignment: task.alignment,
    notes: mapping.alignmentNotes,
  };
}

/**
 * Filter tasks by taskContext value (exact match).
 */
export function filterTasksByContext(
  tasks: WaTask[],
  context: string,
): WaTask[] {
  return tasks.filter((t) => t.taskContext === context);
}
