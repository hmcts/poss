'use client';

import { useState } from 'react';
import type { RefState, RefEvent, StateEventAssoc } from '../../src/ref-data/schema.js';
import {
  countAssociations,
  isEventAssociated,
  toggleAssociation,
} from '../../src/ref-data/state-event-assoc-logic.js';

interface StateEventAssocProps {
  states: RefState[];
  events: RefEvent[];
  stateEventAssocs: StateEventAssoc[];
  onChange: (updated: StateEventAssoc[]) => void;
}

export default function StateEventAssocEditor({
  states,
  events,
  stateEventAssocs,
  onChange,
}: StateEventAssocProps) {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  function handleToggle(eventId: string) {
    if (!selectedStateId) return;
    const updated = toggleAssociation(selectedStateId, eventId, stateEventAssocs);
    onChange(updated);
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Left panel: state list */}
      <div style={{ minWidth: '200px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {states.map((state) => {
            const count = countAssociations(state.id, stateEventAssocs);
            const isSelected = selectedStateId === state.id;
            return (
              <li
                key={state.id}
                onClick={() => setSelectedStateId(state.id)}
                style={{
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  background: isSelected ? '#e0e7ff' : 'transparent',
                  fontWeight: isSelected ? 'bold' : 'normal',
                }}
              >
                {state.name}{' '}
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: '1.5rem',
                    textAlign: 'center',
                    background: '#6366f1',
                    color: '#fff',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    padding: '0 0.4rem',
                  }}
                >
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right panel: event checklist or empty state */}
      <div style={{ flex: 1 }}>
        {selectedStateId === null ? (
          <p>Select a state to manage its events</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {events.map((event) => {
              const checked = isEventAssociated(selectedStateId, event.id, stateEventAssocs);
              return (
                <li key={event.id} style={{ padding: '0.25rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(event.id)}
                    />
                    {event.name}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
