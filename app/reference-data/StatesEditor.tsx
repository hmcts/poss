'use client';

import { useState } from 'react';
import type { RefState, StateEventAssoc, PersonaStateAssoc } from '../../src/ref-data/schema.js';
import {
  generateStateId,
  isStateDeletable,
  applyStateEdit,
  addNewState,
  deleteState,
} from '../../src/ref-data/states-editor-logic.js';

export { generateStateId, isStateDeletable, applyStateEdit, addNewState, deleteState };

// ── Component ────────────────────────────────────────────────────────────────

interface StatesEditorProps {
  states: RefState[];
  assocs: {
    stateEventAssocs: StateEventAssoc[];
    personaStateAssocs: PersonaStateAssoc[];
  };
  onChange: (updated: RefState[]) => void;
}

export default function StatesEditor({ states, assocs, onChange }: StatesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  function handleEdit(state: RefState) {
    setEditingId(state.id);
    setEditDraft({ name: state.name, description: state.description });
    setConfirmDeleteId(null);
  }

  function handleSave(id: string) {
    onChange(applyStateEdit(states, id, editDraft));
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }

  function handleAdd() {
    const updated = addNewState(states);
    const newState = updated[updated.length - 1];
    onChange(updated);
    setEditingId(newState.id);
    setEditDraft({ name: '', description: '' });
  }

  function handleDeleteConfirm(id: string) {
    onChange(deleteState(states, id));
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <button onClick={handleAdd}>Add state</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {states.map((state) => {
            const isEditing = editingId === state.id;
            const isConfirming = confirmDeleteId === state.id;
            const deletable = isStateDeletable(state.id, assocs);

            if (isEditing) {
              return (
                <tr key={state.id}>
                  <td>{state.id}</td>
                  <td>
                    <input
                      value={editDraft.name}
                      onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                      aria-label="Name"
                    />
                  </td>
                  <td>
                    <input
                      value={editDraft.description}
                      onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                      aria-label="Description"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(state.id)}>Save</button>{' '}
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={state.id}>
                <td>{state.id}</td>
                <td>{state.name}</td>
                <td>{state.description}</td>
                <td>
                  <button onClick={() => handleEdit(state)}>Edit</button>{' '}
                  {isConfirming ? (
                    <>
                      Delete this state?{' '}
                      <button onClick={() => handleDeleteConfirm(state.id)}>Confirm</button>{' '}
                      <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => deletable && setConfirmDeleteId(state.id)}
                      disabled={!deletable}
                      title={!deletable ? 'Cannot delete: state has existing associations' : undefined}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
