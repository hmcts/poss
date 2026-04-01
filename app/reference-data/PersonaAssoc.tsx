'use client';

import { useState } from 'react';
import type {
  Persona,
  RefState,
  RefEvent,
  WaTask,
  PersonaStateAssoc,
  PersonaEventAssoc,
  PersonaTaskAssoc,
} from '../../src/ref-data/schema.js';
import {
  getPersonaCounts,
  toggleStateAssoc,
  toggleEventAssoc,
  toggleTaskAssoc,
  filterItems,
  isStateAssociated,
  isEventAssociated,
  isTaskAssociated,
} from '../../src/ref-data/persona-assoc-logic.js';

interface PersonaAssocProps {
  personas: Persona[];
  states: RefState[];
  events: RefEvent[];
  waTasks: WaTask[];
  personaStateAssocs: PersonaStateAssoc[];
  personaEventAssocs: PersonaEventAssoc[];
  personaTaskAssocs: PersonaTaskAssoc[];
  onStateAssocsChange: (updated: PersonaStateAssoc[]) => void;
  onEventAssocsChange: (updated: PersonaEventAssoc[]) => void;
  onTaskAssocsChange: (updated: PersonaTaskAssoc[]) => void;
}

interface ChecklistSectionProps<T extends { id: string; name?: string; taskName?: string }> {
  label: string;
  items: T[];
  query: string;
  onQueryChange: (q: string) => void;
  isChecked: (item: T) => boolean;
  onToggle: (item: T) => void;
  getLabel: (item: T) => string;
}

function ChecklistSection<T extends { id: string; name?: string; taskName?: string }>({
  label,
  items,
  query,
  onQueryChange,
  isChecked,
  onToggle,
  getLabel,
}: ChecklistSectionProps<T>) {
  const filtered = filterItems(items, query);

  return (
    <section
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: 0,
      }}
    >
      <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold' }}>{label}</h3>
      <input
        type="text"
        placeholder={`Filter ${label.toLowerCase()}…`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        style={{
          padding: '0.25rem 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '0.875rem',
        }}
      />
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          overflowY: 'auto',
          maxHeight: '400px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
        }}
      >
        {filtered.map((item) => (
          <li
            key={item.id}
            style={{
              padding: '0.25rem 0.5rem',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked(item)}
                onChange={() => onToggle(item)}
              />
              {getLabel(item)}
            </label>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ padding: '0.5rem', color: '#9ca3af', fontSize: '0.875rem' }}>
            No results
          </li>
        )}
      </ul>
    </section>
  );
}

export default function PersonaAssoc({
  personas,
  states,
  events,
  waTasks,
  personaStateAssocs,
  personaEventAssocs,
  personaTaskAssocs,
  onStateAssocsChange,
  onEventAssocsChange,
  onTaskAssocsChange,
}: PersonaAssocProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [stateQuery, setStateQuery] = useState('');
  const [eventQuery, setEventQuery] = useState('');
  const [taskQuery, setTaskQuery] = useState('');

  function selectPersona(id: string) {
    setSelectedPersonaId(id);
    setStateQuery('');
    setEventQuery('');
    setTaskQuery('');
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Left panel: persona list */}
      <div style={{ minWidth: '200px', maxWidth: '260px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {personas.map((persona) => {
            const counts = getPersonaCounts(
              persona.id,
              personaStateAssocs,
              personaEventAssocs,
              personaTaskAssocs,
            );
            const isSelected = selectedPersonaId === persona.id;
            return (
              <li
                key={persona.id}
                onClick={() => selectPersona(persona.id)}
                style={{
                  cursor: 'pointer',
                  padding: '0.4rem 0.6rem',
                  background: isSelected ? '#e0e7ff' : 'transparent',
                  borderRadius: '4px',
                  marginBottom: '0.25rem',
                }}
              >
                <div style={{ fontWeight: isSelected ? 'bold' : 'normal', fontSize: '0.875rem' }}>
                  {persona.id}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>
                  {counts.states} states · {counts.events} events · {counts.tasks} tasks
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedPersonaId === null ? (
          <p style={{ color: '#6b7280' }}>Select a persona to manage its associations</p>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <ChecklistSection
              label="States"
              items={states}
              query={stateQuery}
              onQueryChange={setStateQuery}
              isChecked={(state) =>
                isStateAssociated(selectedPersonaId, state.id, personaStateAssocs)
              }
              onToggle={(state) => {
                const updated = toggleStateAssoc(
                  selectedPersonaId,
                  state.id,
                  personaStateAssocs,
                );
                onStateAssocsChange(updated);
              }}
              getLabel={(state) => state.name ?? state.id}
            />
            <ChecklistSection
              label="Events"
              items={events}
              query={eventQuery}
              onQueryChange={setEventQuery}
              isChecked={(event) =>
                isEventAssociated(selectedPersonaId, event.id, personaEventAssocs)
              }
              onToggle={(event) => {
                const updated = toggleEventAssoc(
                  selectedPersonaId,
                  event.id,
                  personaEventAssocs,
                );
                onEventAssocsChange(updated);
              }}
              getLabel={(event) => event.name ?? event.id}
            />
            <ChecklistSection
              label="WA Tasks"
              items={waTasks}
              query={taskQuery}
              onQueryChange={setTaskQuery}
              isChecked={(task) =>
                isTaskAssociated(selectedPersonaId, task.id, personaTaskAssocs)
              }
              onToggle={(task) => {
                const updated = toggleTaskAssoc(
                  selectedPersonaId,
                  task.id,
                  personaTaskAssocs,
                );
                onTaskAssocsChange(updated);
              }}
              getLabel={(task) => task.taskName ?? task.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
