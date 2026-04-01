'use client';

import { useState } from 'react';
import type { WaTask, EventTaskAssoc, PersonaTaskAssoc } from '../../src/ref-data/schema.js';
import { WaTaskContext, WaAlignmentStatus } from '../../src/data-model/enums.js';
import {
  generateWaTaskId,
  isWaTaskDeletable,
  applyWaTaskEdit,
  addNewWaTask,
  deleteWaTask,
} from '../../src/ref-data/wa-tasks-editor-logic.js';

export { generateWaTaskId, isWaTaskDeletable, applyWaTaskEdit, addNewWaTask, deleteWaTask };

// ── Types ─────────────────────────────────────────────────────────────────────

interface WaTasksEditorProps {
  waTasks: WaTask[];
  assocs: {
    eventTaskAssocs: EventTaskAssoc[];
    personaTaskAssocs: PersonaTaskAssoc[];
  };
  onChange: (updated: WaTask[]) => void;
}

type EditDraft = {
  taskName: string;
  triggerDescription: string;
  taskContext: string;
  alignment: string;
};

// ── Alignment colour helper ───────────────────────────────────────────────────

function alignmentColour(alignment: string): string {
  if (alignment === WaAlignmentStatus.ALIGNED) return '#00703c';
  if (alignment === WaAlignmentStatus.PARTIAL) return '#b58900';
  return '#c00';
}

// ── Component ────────────────────────────────────────────────────────────────

export default function WaTasksEditor({ waTasks, assocs, onChange }: WaTasksEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft>({
    taskName: '',
    triggerDescription: '',
    taskContext: WaTaskContext.CLAIM,
    alignment: WaAlignmentStatus.GAP,
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleEdit(task: WaTask) {
    setEditingId(task.id);
    setEditDraft({
      taskName: task.taskName,
      triggerDescription: task.triggerDescription,
      taskContext: task.taskContext,
      alignment: task.alignment,
    });
    setConfirmDeleteId(null);
  }

  function handleSave(id: string) {
    onChange(
      applyWaTaskEdit(waTasks, id, {
        taskName: editDraft.taskName,
        triggerDescription: editDraft.triggerDescription,
        taskContext: editDraft.taskContext as WaTask['taskContext'],
        alignment: editDraft.alignment as WaTask['alignment'],
      }),
    );
    setEditingId(null);
  }

  function handleCancel(id: string) {
    // If the task is new and still blank, remove it
    const task = waTasks.find((t) => t.id === id);
    if (task && task.taskName === '' && task.triggerDescription === '') {
      onChange(deleteWaTask(waTasks, id));
    }
    setEditingId(null);
  }

  function handleAdd() {
    const updated = addNewWaTask(waTasks);
    const newTask = updated[updated.length - 1];
    onChange(updated);
    setEditingId(newTask.id);
    setEditDraft({
      taskName: '',
      triggerDescription: '',
      taskContext: WaTaskContext.CLAIM,
      alignment: WaAlignmentStatus.GAP,
    });
    setConfirmDeleteId(null);
  }

  function handleDeleteConfirm(id: string) {
    onChange(deleteWaTask(waTasks, id));
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Task Name</th>
            <th style={thStyle}>Trigger Description</th>
            <th style={thStyle}>Context</th>
            <th style={thStyle}>Alignment</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {waTasks.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                No WA tasks. Click &quot;Add WA task&quot; to create one.
              </td>
            </tr>
          )}
          {waTasks.map((task) => {
            const isEditing = editingId === task.id;
            const isConfirmingDelete = confirmDeleteId === task.id;
            const deletable = isWaTaskDeletable(task.id, assocs);

            if (isEditing) {
              return (
                <tr key={task.id} style={rowStyle}>
                  <td style={tdStyle}>
                    <span style={monoStyle}>{task.id}</span>
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={editDraft.taskName}
                      onChange={(e) => setEditDraft((d) => ({ ...d, taskName: e.target.value }))}
                      style={inputStyle}
                      aria-label="Task name"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={editDraft.triggerDescription}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, triggerDescription: e.target.value }))
                      }
                      style={inputStyle}
                      aria-label="Trigger description"
                    />
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={editDraft.taskContext}
                      onChange={(e) => setEditDraft((d) => ({ ...d, taskContext: e.target.value }))}
                      style={selectStyle}
                      aria-label="Context"
                    >
                      {Object.values(WaTaskContext).map((ctx) => (
                        <option key={ctx} value={ctx}>
                          {ctx}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={editDraft.alignment}
                      onChange={(e) => setEditDraft((d) => ({ ...d, alignment: e.target.value }))}
                      style={{ ...selectStyle, color: alignmentColour(editDraft.alignment), fontWeight: 600 }}
                      aria-label="Alignment"
                    >
                      {Object.values(WaAlignmentStatus).map((al) => (
                        <option key={al} value={al}>
                          {al}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleSave(task.id)} style={btnPrimary}>
                      Save
                    </button>{' '}
                    <button onClick={() => handleCancel(task.id)} style={btnSecondary}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={task.id} style={rowStyle}>
                <td style={tdStyle}>
                  <span style={monoStyle}>{task.id}</span>
                </td>
                <td style={tdStyle}>{task.taskName}</td>
                <td style={tdStyle}>{task.triggerDescription}</td>
                <td style={tdStyle}>{task.taskContext}</td>
                <td style={tdStyle}>
                  <span style={{ color: alignmentColour(task.alignment), fontWeight: 600 }}>
                    {task.alignment}
                  </span>
                </td>
                <td style={tdStyle}>
                  {isConfirmingDelete ? (
                    <span>
                      <span style={{ marginRight: '0.5rem', color: '#c00' }}>Delete this task?</span>
                      <button
                        onClick={() => handleDeleteConfirm(task.id)}
                        style={{ ...btnDanger, marginRight: '0.25rem' }}
                      >
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} style={btnSecondary}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(task)}
                        style={{ ...btnSecondary, marginRight: '0.25rem' }}
                        aria-label={`Edit ${task.taskName}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletable && setConfirmDeleteId(task.id)}
                        disabled={!deletable}
                        title={
                          deletable
                            ? undefined
                            : 'Cannot delete: this task has existing associations'
                        }
                        style={deletable ? btnDanger : btnDisabled}
                        aria-label={`Delete ${task.taskName}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '0.75rem' }}>
        <button onClick={handleAdd} style={btnPrimary}>
          + Add WA task
        </button>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid #ccc',
  background: '#f5f5f5',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #eee',
  verticalAlign: 'middle',
};

const rowStyle: React.CSSProperties = {};

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.85em',
  color: '#555',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.25rem 0.4rem',
  border: '1px solid #bbb',
  borderRadius: '3px',
  fontSize: '0.95em',
};

const selectStyle: React.CSSProperties = {
  padding: '0.25rem 0.4rem',
  border: '1px solid #bbb',
  borderRadius: '3px',
  fontSize: '0.95em',
  background: '#fff',
};

const btnBase: React.CSSProperties = {
  padding: '0.25rem 0.6rem',
  borderRadius: '3px',
  border: '1px solid transparent',
  cursor: 'pointer',
  fontSize: '0.9em',
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: '#005ea5',
  color: '#fff',
  borderColor: '#005ea5',
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: '#fff',
  color: '#333',
  borderColor: '#bbb',
};

const btnDanger: React.CSSProperties = {
  ...btnBase,
  background: '#c00',
  color: '#fff',
  borderColor: '#c00',
};

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  background: '#eee',
  color: '#999',
  borderColor: '#ddd',
  cursor: 'not-allowed',
};
