'use client';

import { useState } from 'react';
import type { RefEvent, StateEventAssoc, EventTaskAssoc, PersonaEventAssoc } from '../../src/ref-data/schema.js';
import {
  isEventDeletable,
  applyEventEdit,
  addNewEvent,
  deleteEvent,
} from '../../src/ref-data/events-editor-logic.js';

interface EventsEditorProps {
  events: RefEvent[];
  assocs: {
    stateEventAssocs: StateEventAssoc[];
    eventTaskAssocs: EventTaskAssoc[];
    personaEventAssocs: PersonaEventAssoc[];
  };
  onChange: (updated: RefEvent[]) => void;
}

export default function EventsEditor({ events, assocs, onChange }: EventsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<RefEvent>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleEditClick(event: RefEvent) {
    setEditingId(event.id);
    setEditDraft({ name: event.name, description: event.description });
    setConfirmDeleteId(null);
  }

  function handleSave(id: string) {
    onChange(applyEventEdit(events, id, editDraft));
    setEditingId(null);
    setEditDraft({});
  }

  function handleCancel(id: string) {
    // If this is a newly added (blank) event being cancelled, remove it
    const event = events.find((e) => e.id === id);
    if (event && event.name === '' && event.description === '') {
      onChange(deleteEvent(events, id));
    }
    setEditingId(null);
    setEditDraft({});
  }

  function handleAddEvent() {
    const result = addNewEvent(events);
    onChange(result.events);
    setEditingId(result.newId);
    setEditDraft({ name: '', description: '' });
    setConfirmDeleteId(null);
  }

  function handleDeleteConfirm(id: string) {
    onChange(deleteEvent(events, id));
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                No events. Click &quot;Add event&quot; to create one.
              </td>
            </tr>
          )}
          {events.map((event) => {
            const isEditing = editingId === event.id;
            const isConfirmingDelete = confirmDeleteId === event.id;
            const deletable = isEventDeletable(event.id, assocs);

            if (isEditing) {
              return (
                <tr key={event.id} style={rowStyle}>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85em', color: '#555' }}>
                      {event.id}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={editDraft.name ?? ''}
                      onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                      style={inputStyle}
                      aria-label="Event name"
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={editDraft.description ?? ''}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, description: e.target.value }))
                      }
                      style={inputStyle}
                      aria-label="Event description"
                    />
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleSave(event.id)} style={btnPrimary}>
                      Save
                    </button>{' '}
                    <button onClick={() => handleCancel(event.id)} style={btnSecondary}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={event.id} style={rowStyle}>
                <td style={tdStyle}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.85em', color: '#555' }}>
                    {event.id}
                  </span>
                </td>
                <td style={tdStyle}>{event.name}</td>
                <td style={tdStyle}>{event.description}</td>
                <td style={tdStyle}>
                  {isConfirmingDelete ? (
                    <span>
                      <span style={{ marginRight: '0.5rem', color: '#c00' }}>Delete this event?</span>
                      <button
                        onClick={() => handleDeleteConfirm(event.id)}
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
                        onClick={() => handleEditClick(event)}
                        style={{ ...btnSecondary, marginRight: '0.25rem' }}
                        aria-label={`Edit ${event.name}`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deletable && setConfirmDeleteId(event.id)}
                        disabled={!deletable}
                        title={
                          deletable
                            ? undefined
                            : 'Cannot delete: this event has existing associations'
                        }
                        style={deletable ? btnDanger : btnDisabled}
                        aria-label={`Delete ${event.name}`}
                      >
                        🗑 Delete
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
        <button onClick={handleAddEvent} style={btnPrimary}>
          + Add event
        </button>
      </div>
    </div>
  );
}

// Minimal inline styles — the editor shell owns the overall layout
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.25rem 0.4rem',
  border: '1px solid #bbb',
  borderRadius: '3px',
  fontSize: '0.95em',
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
