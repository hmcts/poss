import { getLowCompletenessStates, getUnreachableStates, canReachEndState } from '../model-health/index.ts';
import { getOpenQuestionsList } from '../ui-model-health/index.ts';
import { getUnmappedTasks, getPartialTasks } from '../wa-task-engine/index.ts';

// -- Types --------------------------------------------------------------------

export interface ActionItem {
  id: string;
  type: string;
  category: string;
  priority: string;
  title: string;
  detail: string;
  suggestion: string;
  state: string | null;
  claimType: string | null;
  linkPath: string | null;
}

// -- Helpers ------------------------------------------------------------------

function buildId(category: string, type: string, sourceId: string): string {
  return `${category}-${type}-${sourceId}`;
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
const CATEGORY_RANK: Record<string, number> = { 'Model Completeness': 0, 'WA Task Alignment': 1 };

// -- Exported Functions -------------------------------------------------------

export function getActionItems(
  states: any[],
  transitions: any[],
  events: any[],
  waTasks: any[],
  waMappings: any[],
): ActionItem[] {
  const items: ActionItem[] = [];

  // 1. Open questions from events
  const oqList = getOpenQuestionsList(events);
  for (const e of oqList.events) {
    items.push({
      id: buildId('Model Completeness', 'open-question', e.id),
      type: 'open-question',
      category: 'Model Completeness',
      priority: 'medium',
      title: `Open question: ${e.name}`,
      detail: e.notes,
      suggestion: 'Resolve open question before finalising model.',
      state: e.state,
      claimType: null,
      linkPath: `/event-matrix?search=${encodeURIComponent(e.name)}`,
    });
  }

  // 2. Low completeness states
  const lowStates = getLowCompletenessStates(states);
  for (const s of lowStates) {
    items.push({
      id: buildId('Model Completeness', 'low-completeness', s.id),
      type: 'low-completeness',
      category: 'Model Completeness',
      priority: 'medium',
      title: `Low completeness: ${s.uiLabel} (${s.completeness}%)`,
      detail: 'State has low model completeness.',
      suggestion: 'Add missing transitions and events.',
      state: s.id,
      claimType: s.claimType ?? null,
      linkPath: `/state-explorer?highlight=${s.id}`,
    });
  }

  // 3. Unreachable states
  const unreachable = getUnreachableStates(states, transitions);
  for (const s of unreachable) {
    items.push({
      id: buildId('Model Completeness', 'unreachable', s.id),
      type: 'unreachable',
      category: 'Model Completeness',
      priority: 'high',
      title: `Unreachable state: ${s.uiLabel}`,
      detail: 'No incoming transitions reach this state.',
      suggestion: 'Add a transition leading to this state or remove it.',
      state: s.id,
      claimType: s.claimType ?? null,
      linkPath: `/state-explorer?highlight=${s.id}`,
    });
  }

  // 4. No end path (per claim type)
  const claimTypes = [...new Set(states.map((s: any) => s.claimType).filter(Boolean))];
  for (const ct of claimTypes) {
    const ctStates = states.filter((s: any) => s.claimType === ct);
    const ctTransitions = transitions.filter((t: any) => {
      const fromState = states.find((s: any) => s.id === t.from);
      return fromState && fromState.claimType === ct;
    });
    if (!canReachEndState(ctStates, ctTransitions)) {
      items.push({
        id: buildId('Model Completeness', 'no-end-path', ct),
        type: 'no-end-path',
        category: 'Model Completeness',
        priority: 'high',
        title: `No end path: ${ct}`,
        detail: 'Cannot reach an end state from initial states.',
        suggestion: 'Add transitions to connect initial states to end states.',
        state: null,
        claimType: ct,
        linkPath: '/state-explorer',
      });
    }
  }

  // 5. WA gap tasks
  const gapTasks = getUnmappedTasks(waTasks, waMappings);
  for (const t of gapTasks) {
    items.push({
      id: buildId('WA Task Alignment', 'wa-gap', t.id),
      type: 'wa-gap',
      category: 'WA Task Alignment',
      priority: 'high',
      title: `WA gap: ${t.taskName}`,
      detail: `No matching event for WA task "${t.taskName}".`,
      suggestion: `Add event for "${t.taskName}" or update mapping.`,
      state: null,
      claimType: null,
      linkPath: '/work-allocation',
    });
  }

  // 6. WA partial tasks
  const partialTasks = getPartialTasks(waTasks, waMappings);
  for (const { task, missing } of partialTasks) {
    items.push({
      id: buildId('WA Task Alignment', 'wa-partial', task.id),
      type: 'wa-partial',
      category: 'WA Task Alignment',
      priority: 'medium',
      title: `WA partial: ${task.taskName}`,
      detail: missing,
      suggestion: `Refine event granularity: ${missing}`,
      state: null,
      claimType: null,
      linkPath: '/work-allocation',
    });
  }

  // 7. No WA task events (exclude system events)
  const allMappedEventIds = new Set<string>();
  for (const m of waMappings) {
    for (const eid of m.eventIds) {
      allMappedEventIds.add(eid);
    }
  }
  for (const e of events) {
    if (!e.isSystemEvent && !allMappedEventIds.has(e.name)) {
      items.push({
        id: buildId('WA Task Alignment', 'no-wa-task', e.id),
        type: 'no-wa-task',
        category: 'WA Task Alignment',
        priority: 'low',
        title: `No WA task: ${e.name}`,
        detail: `Event "${e.name}" has no associated WA task.`,
        suggestion: 'Consider whether this event needs a WA task.',
        state: e.state ?? null,
        claimType: null,
        linkPath: `/event-matrix?search=${encodeURIComponent(e.name)}`,
      });
    }
  }

  return sortActionItems(items);
}

export function getActionItemSummary(items: ActionItem[]): { total: number; high: number; medium: number; low: number } {
  const result = { total: items.length, high: 0, medium: 0, low: 0 };
  for (const item of items) {
    if (item.priority === 'high') result.high++;
    else if (item.priority === 'medium') result.medium++;
    else if (item.priority === 'low') result.low++;
  }
  return result;
}

export function filterActionItems(
  items: ActionItem[],
  filters: { category?: string | null; priority?: string | null; search?: string | null; claimType?: string | null },
): ActionItem[] {
  return items.filter((item) => {
    if (filters.category != null && item.category !== filters.category) return false;
    if (filters.priority != null && item.priority !== filters.priority) return false;
    if (filters.claimType != null && item.claimType !== filters.claimType) return false;
    if (filters.search != null) {
      const term = filters.search.toLowerCase();
      const haystack = `${item.title} ${item.detail} ${item.state ?? ''}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}

export function sortActionItems(items: ActionItem[], sortKey?: string, sortDir?: string): ActionItem[] {
  const sorted = [...items];
  if (sortKey) {
    const dir = sortDir === 'desc' ? -1 : 1;
    sorted.sort((a, b) => {
      const aVal = String((a as any)[sortKey] ?? '');
      const bVal = String((b as any)[sortKey] ?? '');
      return dir * aVal.localeCompare(bVal);
    });
  } else {
    sorted.sort((a, b) => {
      const pA = PRIORITY_RANK[a.priority] ?? 99;
      const pB = PRIORITY_RANK[b.priority] ?? 99;
      if (pA !== pB) return pA - pB;
      const cA = CATEGORY_RANK[a.category] ?? 99;
      const cB = CATEGORY_RANK[b.category] ?? 99;
      if (cA !== cB) return cA - cB;
      return a.title.localeCompare(b.title);
    });
  }
  return sorted;
}

export function exportActionItemsCsv(items: ActionItem[]): { content: string; filename: string; mimeType: string } {
  const header = 'Priority,Category,Type,Title,Detail,Suggestion,State,Claim Type';
  const rows = items.map((item) => {
    return [
      csvEscape(item.priority ?? ''),
      csvEscape(item.category ?? ''),
      csvEscape(item.type ?? ''),
      csvEscape(item.title ?? ''),
      csvEscape(item.detail ?? ''),
      csvEscape(item.suggestion ?? ''),
      csvEscape(item.state ?? ''),
      csvEscape(item.claimType ?? ''),
    ].join(',');
  });
  const content = [header, ...rows].join('\n');
  return { content, filename: 'action-items.csv', mimeType: 'text/csv' };
}
