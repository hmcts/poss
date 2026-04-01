'use client';

import { useState } from 'react';
import type { Persona, PersonaStateAssoc, PersonaEventAssoc, PersonaTaskAssoc } from '../../src/ref-data/schema.js';
import {
  generatePersonaId,
  isPersonaDeletable,
  applyPersonaEdit,
  addNewPersona,
  deletePersona,
  rolesToString,
  rolesFromString,
} from '../../src/ref-data/personas-editor-logic.js';

export {
  generatePersonaId,
  isPersonaDeletable,
  applyPersonaEdit,
  addNewPersona,
  deletePersona,
  rolesToString,
  rolesFromString,
};

// ── Component ────────────────────────────────────────────────────────────────

interface PersonasEditorProps {
  personas: Persona[];
  assocs: {
    personaStateAssocs: PersonaStateAssoc[];
    personaEventAssocs: PersonaEventAssoc[];
    personaTaskAssocs: PersonaTaskAssoc[];
  };
  onChange: (updated: Persona[]) => void;
}

export default function PersonasEditor({ personas, assocs, onChange }: PersonasEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ rolesStr: string; isCrossCutting: boolean }>({
    rolesStr: '',
    isCrossCutting: false,
  });

  function handleEdit(persona: Persona) {
    setEditingId(persona.id);
    setEditDraft({
      rolesStr: rolesToString(persona.roles),
      isCrossCutting: persona.isCrossCutting,
    });
    setConfirmDeleteId(null);
  }

  function handleSave(id: string) {
    onChange(
      applyPersonaEdit(personas, id, {
        roles: rolesFromString(editDraft.rolesStr),
        isCrossCutting: editDraft.isCrossCutting,
      }),
    );
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }

  function handleAdd() {
    const updated = addNewPersona(personas);
    const newPersona = updated[updated.length - 1];
    onChange(updated);
    setEditingId(newPersona.id);
    setEditDraft({ rolesStr: '', isCrossCutting: false });
  }

  function handleDeleteConfirm(id: string) {
    onChange(deletePersona(personas, id));
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <button onClick={handleAdd}>Add persona</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Roles</th>
            <th>Is Cross-Cutting</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => {
            const isEditing = editingId === persona.id;
            const isConfirming = confirmDeleteId === persona.id;
            const deletable = isPersonaDeletable(persona.id, assocs);

            if (isEditing) {
              return (
                <tr key={persona.id}>
                  <td>{persona.id}</td>
                  <td>
                    <input
                      value={editDraft.rolesStr}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, rolesStr: e.target.value }))
                      }
                      aria-label="Roles"
                      placeholder="e.g. Judge, Caseworker"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editDraft.isCrossCutting}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, isCrossCutting: e.target.checked }))
                      }
                      aria-label="Is Cross-Cutting"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(persona.id)}>Save</button>{' '}
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={persona.id}>
                <td>{persona.id}</td>
                <td>{rolesToString(persona.roles)}</td>
                <td>{persona.isCrossCutting ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(persona)}>Edit</button>{' '}
                  {isConfirming ? (
                    <>
                      Delete this persona?{' '}
                      <button onClick={() => handleDeleteConfirm(persona.id)}>Confirm</button>{' '}
                      <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => deletable && setConfirmDeleteId(persona.id)}
                      disabled={!deletable}
                      title={
                        !deletable
                          ? 'Cannot delete: persona has existing associations'
                          : undefined
                      }
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
