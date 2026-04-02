'use client';

import type { ReferenceDataBlob, RefTransition } from '../../src/ref-data/schema';

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(from: string, to: string): string {
  return `tr-${from}-${to}-${Date.now()}`;
}

/**
 * Returns true when removing `transition` would leave some states with no
 * path to any other state (warn-only, not a hard block).
 * Simple heuristic: check if fromStateId appears as 'from' in any other transition.
 */
export function hasNoReplacementPath(
  transition: RefTransition,
  transitions: RefTransition[],
): boolean {
  const others = transitions.filter((t) => t.id !== transition.id);
  // Warn if the fromState has no other outgoing transitions
  return !others.some((t) => t.fromStateId === transition.fromStateId);
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface TransitionsEditorProps {
  blob: ReferenceDataBlob;
  onChange: (updated: ReferenceDataBlob) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TransitionsEditor({ blob, onChange }: TransitionsEditorProps) {
  const transitions: RefTransition[] = blob.transitions ?? [];
  const states = blob.states;

  function updateTransitions(updated: RefTransition[]) {
    onChange({ ...blob, transitions: updated });
  }

  function handleAdd() {
    const firstStateId = states[0]?.id ?? '';
    const newRow: RefTransition = {
      id: generateId(firstStateId, firstStateId),
      fromStateId: firstStateId,
      toStateId: firstStateId,
      condition: '',
      isSystemTriggered: false,
      isTimeBased: false,
    };
    updateTransitions([...transitions, newRow]);
  }

  function handleDelete(transition: RefTransition) {
    const warn = hasNoReplacementPath(transition, transitions);
    if (warn) {
      const confirmed = window.confirm(
        `Warning: removing this transition may leave "${transition.fromStateId}" with no outgoing path. Delete anyway?`,
      );
      if (!confirmed) return;
    }
    updateTransitions(transitions.filter((t) => t.id !== transition.id));
  }

  function handleChange<K extends keyof RefTransition>(
    id: string,
    field: K,
    value: RefTransition[K],
  ) {
    updateTransitions(
      transitions.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  }

  const cellClass = 'px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-100';
  const thClass = 'px-2 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Transitions</h2>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Add transition
        </button>
      </div>

      {transitions.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No transitions defined. Click "Add transition" to start.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className={thClass}>From state</th>
                <th className={thClass}>To state</th>
                <th className={thClass}>Condition</th>
                <th className={thClass}>System triggered</th>
                <th className={thClass}>Time based</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((t) => (
                <tr key={t.id} className="border-b border-slate-700/50">
                  {/* From state */}
                  <td className="px-2 py-1">
                    <select
                      value={t.fromStateId}
                      onChange={(e) => handleChange(t.id, 'fromStateId', e.target.value)}
                      className={cellClass}
                    >
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>{s.name || s.id}</option>
                      ))}
                      {/* Keep current value if not in states list */}
                      {!states.some((s) => s.id === t.fromStateId) && (
                        <option value={t.fromStateId}>{t.fromStateId}</option>
                      )}
                    </select>
                  </td>

                  {/* To state */}
                  <td className="px-2 py-1">
                    <select
                      value={t.toStateId}
                      onChange={(e) => handleChange(t.id, 'toStateId', e.target.value)}
                      className={cellClass}
                    >
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>{s.name || s.id}</option>
                      ))}
                      {!states.some((s) => s.id === t.toStateId) && (
                        <option value={t.toStateId}>{t.toStateId}</option>
                      )}
                    </select>
                  </td>

                  {/* Condition */}
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={t.condition}
                      onChange={(e) => handleChange(t.id, 'condition', e.target.value)}
                      placeholder="Condition"
                      className={`${cellClass} min-w-48`}
                    />
                  </td>

                  {/* isSystemTriggered */}
                  <td className="px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={t.isSystemTriggered}
                      onChange={(e) => handleChange(t.id, 'isSystemTriggered', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* isTimeBased */}
                  <td className="px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={t.isTimeBased}
                      onChange={(e) => handleChange(t.id, 'isTimeBased', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-1">
                    <button
                      onClick={() => handleDelete(t)}
                      className="px-2 py-1 text-xs bg-red-800 hover:bg-red-700 text-red-100 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
