import type { WaTask, EventTaskAssoc, PersonaTaskAssoc } from './schema.ts';

export interface WaTaskAssocs {
  eventTaskAssocs: EventTaskAssoc[];
  personaTaskAssocs: PersonaTaskAssoc[];
}

/**
 * Generate a unique WA task ID with the "wa-task-" prefix.
 */
export function generateWaTaskId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `wa-task-${random}`;
}

/**
 * Returns true if the WA task can be deleted (no associations reference it).
 * Returns false if eventTaskAssocs or personaTaskAssocs reference this waTaskId.
 */
export function isWaTaskDeletable(waTaskId: string, assocs: WaTaskAssocs): boolean {
  const inEventTaskAssocs = assocs.eventTaskAssocs.some((a) => a.waTaskId === waTaskId);
  const inPersonaTaskAssocs = assocs.personaTaskAssocs.some((a) => a.waTaskId === waTaskId);
  return !inEventTaskAssocs && !inPersonaTaskAssocs;
}

/**
 * Returns a new waTasks array with the matching task patched.
 * Does not mutate the input array.
 */
export function applyWaTaskEdit(
  waTasks: WaTask[],
  id: string,
  patch: Partial<Omit<WaTask, 'id'>>,
): WaTask[] {
  return waTasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
}

/**
 * Appends a new WA task with default values.
 * Defaults: taskContext = 'claim', alignment = 'gap', taskName = '', triggerDescription = ''.
 * Does not mutate the input array.
 */
export function addNewWaTask(waTasks: WaTask[]): WaTask[] {
  const newTask: WaTask = {
    id: generateWaTaskId(),
    taskName: '',
    triggerDescription: '',
    taskContext: 'claim',
    alignment: 'gap',
  };
  return [...waTasks, newTask];
}

/**
 * Returns a new waTasks array with the task matching `id` removed.
 * Does not mutate the input array.
 */
export function deleteWaTask(waTasks: WaTask[], id: string): WaTask[] {
  return waTasks.filter((t) => t.id !== id);
}
