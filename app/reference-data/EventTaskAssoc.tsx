'use client';

import { useState } from 'react';
import type { RefEvent, WaTask, EventTaskAssoc } from '../../src/ref-data/schema.js';
import {
  isTaskLinked,
  getAssocNotes,
  toggleTaskLink,
  updateNotes,
  alignmentBadgeColour,
} from '../../src/ref-data/event-task-assoc-logic.js';

interface EventTaskAssocProps {
  events: RefEvent[];
  waTasks: WaTask[];
  eventTaskAssocs: EventTaskAssoc[];
  onChange: (updated: EventTaskAssoc[]) => void;
}

const BADGE_STYLES: Record<'green' | 'amber' | 'red', React.CSSProperties> = {
  green: { background: '#16a34a', color: '#fff' },
  amber: { background: '#d97706', color: '#fff' },
  red: { background: '#dc2626', color: '#fff' },
};

export default function EventTaskAssocEditor({
  events,
  waTasks,
  eventTaskAssocs,
  onChange,
}: EventTaskAssocProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  function handleToggle(waTaskId: string) {
    if (!selectedEventId) return;
    const updated = toggleTaskLink(selectedEventId, waTaskId, eventTaskAssocs);
    onChange(updated);
  }

  function handleNotesChange(waTaskId: string, notes: string) {
    if (!selectedEventId) return;
    const updated = updateNotes(selectedEventId, waTaskId, notes, eventTaskAssocs);
    onChange(updated);
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {/* Left panel: event list */}
      <div style={{ minWidth: '220px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((event) => {
            const isSelected = selectedEventId === event.id;
            return (
              <li
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                style={{
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  background: isSelected ? '#4f46e5' : 'transparent',
                  color: isSelected ? '#fff' : 'inherit',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  borderRadius: '4px',
                }}
              >
                {event.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right panel: WA task checklist */}
      <div style={{ flex: 1 }}>
        {selectedEventId === null ? (
          <p>Select an event to manage its WA task associations</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {waTasks.map((task) => {
              const checked = isTaskLinked(selectedEventId, task.id, eventTaskAssocs);
              const notes = getAssocNotes(selectedEventId, task.id, eventTaskAssocs);
              const badgeColour = alignmentBadgeColour(task.alignment);
              const badgeStyle = BADGE_STYLES[badgeColour];

              return (
                <li key={task.id} style={{ padding: '0.35rem 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(task.id)}
                    />
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        ...badgeStyle,
                      }}
                    >
                      {task.alignment}
                    </span>
                    <span>{task.taskName}</span>
                  </div>
                  {checked && (
                    <div style={{ marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                      <input
                        type="text"
                        value={notes}
                        placeholder="Alignment notes…"
                        onChange={(e) => handleNotesChange(task.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.2rem 0.4rem',
                          fontSize: '0.85rem',
                          border: '1px solid #4b5563',
                          borderRadius: '4px',
                          background: '#1e293b',
                          color: '#f1f5f9',
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
