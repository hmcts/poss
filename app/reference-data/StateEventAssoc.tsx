'use client';

import { useState } from 'react';
import type { RefState, RefEvent, StateEventAssoc } from '../../src/ref-data/schema.js';
import {
  countAssociations,
  isEventAssociated,
  toggleAssociation,
  groupStatesByClaimType,
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
      {/* Left panel: state list grouped by claim type */}
      <div style={{ minWidth: '220px', maxWidth: '260px', overflowY: 'auto', maxHeight: '500px' }}>
        {groupStatesByClaimType(states).map((group) => (
          <div key={group.label} style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', padding: '0.25rem 0.5rem' }}>
              {group.label}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {group.states.map((state) => {
                const count = countAssociations(state.id, stateEventAssocs);
                const isSelected = selectedStateId === state.id;
                return (
                  <li
                    key={state.id}
                    onClick={() => setSelectedStateId(state.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.25rem 0.5rem',
                      background: isSelected ? '#4f46e5' : 'transparent',
                      color: isSelected ? '#fff' : 'inherit',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      fontSize: '0.875rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: '3px',
                    }}
                  >
                    {state.name}
                    <span style={{ minWidth: '1.5rem', textAlign: 'center', background: '#6366f1', color: '#fff', borderRadius: '9999px', fontSize: '0.75rem', padding: '0 0.4rem' }}>
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
