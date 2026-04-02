'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  ReferenceDataBlob,
  RefState,
  RefEvent,
  StateEventAssoc,
  EventTaskAssoc,
  PersonaStateAssoc,
  PersonaEventAssoc,
  PersonaTaskAssoc,
} from '../../src/ref-data/schema';
import StateEventAssocEditor from './StateEventAssoc';
import EventTaskAssocEditor from './EventTaskAssoc';
import PersonaAssoc from './PersonaAssoc';
import TransitionsEditor from './TransitionsEditor';

// ---------------------------------------------------------------------------
// Exported prop interfaces for downstream editor components
// ---------------------------------------------------------------------------

export interface StatesEditorProps {
  states: RefState[];
  assocs: {
    stateEventAssocs: StateEventAssoc[];
    personaStateAssocs: PersonaStateAssoc[];
  };
  onChange: (updated: RefState[]) => void;
}

export interface EventsEditorProps {
  events: RefEvent[];
  assocs: {
    stateEventAssocs: StateEventAssoc[];
    eventTaskAssocs: EventTaskAssoc[];
    personaEventAssocs: PersonaEventAssoc[];
  };
  onChange: (updated: RefEvent[]) => void;
}

// ---------------------------------------------------------------------------
// Exported pure logic helpers (also tested in unit tests)
// ---------------------------------------------------------------------------

/**
 * Returns true when baseline and current differ (deep JSON comparison).
 * Returns false if both are null, or if they are deeply equal.
 */
export function hasUnsavedChanges(
  baseline: ReferenceDataBlob | null,
  current: ReferenceDataBlob | null,
): boolean {
  if (baseline === null && current === null) return false;
  if (baseline === null || current === null) return true;
  return JSON.stringify(baseline) !== JSON.stringify(current);
}

/**
 * Returns a new ReferenceDataBlob with data[key] replaced by updated.
 * All other keys are shallow-copied unchanged.
 */
export function mergeEntityUpdate<K extends keyof ReferenceDataBlob>(
  data: ReferenceDataBlob,
  key: K,
  updated: ReferenceDataBlob[K],
): ReferenceDataBlob {
  return { ...data, [key]: updated };
}

// ---------------------------------------------------------------------------
// Stub editor components (placeholders for downstream feature implementation)
// ---------------------------------------------------------------------------

export function StatesEditor(_props: StatesEditorProps) {
  return <div>States Editor (coming soon)</div>;
}

export function EventsEditor(_props: EventsEditorProps) {
  return <div>Events Editor (coming soon)</div>;
}

// ---------------------------------------------------------------------------
// Tab types
// ---------------------------------------------------------------------------

type TabKey = 'states' | 'events' | 'waTasks' | 'personas' | 'associations' | 'transitions';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'states', label: 'States' },
  { key: 'events', label: 'Events' },
  { key: 'waTasks', label: 'WA Tasks' },
  { key: 'personas', label: 'Personas' },
  { key: 'associations', label: 'Associations' },
  { key: 'transitions', label: 'Transitions' },
];

// ---------------------------------------------------------------------------
// Toast type
// ---------------------------------------------------------------------------

interface Toast {
  message: string;
  type: 'success' | 'error';
}

// ---------------------------------------------------------------------------
// Main shell component
// ---------------------------------------------------------------------------

export function ReferenceDataShell() {
  const [baseline, setBaseline] = useState<ReferenceDataBlob | null>(null);
  const [current, setCurrent] = useState<ReferenceDataBlob | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('states');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Fetch on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/reference-data');
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        const data: ReferenceDataBlob = await res.json();
        if (!cancelled) {
          setBaseline(data);
          setCurrent(data);
          setFetchError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-clear toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch('/api/reference-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current),
      });
      if (res.status === 204) {
        setBaseline(current);
        setToast({ message: 'Saved successfully', type: 'success' });
      } else {
        const body = await res.json().catch(() => ({}));
        const message = (body as { error?: string }).error ?? `HTTP ${res.status}`;
        setToast({ message, type: 'error' });
      }
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : String(err),
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [current]);

  const unsaved = hasUnsavedChanges(baseline, current);

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse p-6 text-slate-400">Loading reference data...</div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="p-6 text-red-400">
        <p className="font-semibold">Failed to load reference data</p>
        <p className="text-sm mt-1">{fetchError}</p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Reference Data Editor</h1>
        <div className="flex items-center gap-2">
          {unsaved && (
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
          )}
          <button
            onClick={handleSave}
            disabled={!unsaved || saving}
            className={[
              'px-4 py-2 rounded text-sm font-medium transition-colors',
              unsaved && !saving
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={[
            'px-4 py-3 rounded text-sm font-medium',
            toast.type === 'success'
              ? 'bg-green-800 text-green-100'
              : 'bg-red-800 text-red-100',
          ].join(' ')}
        >
          {toast.message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-64">
        {activeTab === 'states' && (
          <StatesEditor
            states={current.states}
            assocs={{
              stateEventAssocs: current.stateEventAssocs,
              personaStateAssocs: current.personaStateAssocs,
            }}
            onChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'states', updated) : c)}
          />
        )}

        {activeTab === 'events' && (
          <EventsEditor
            events={current.events}
            assocs={{
              stateEventAssocs: current.stateEventAssocs,
              eventTaskAssocs: current.eventTaskAssocs,
              personaEventAssocs: current.personaEventAssocs,
            }}
            onChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'events', updated) : c)}
          />
        )}

        {activeTab === 'waTasks' && <div />}
        {activeTab === 'personas' && <div />}
        {activeTab === 'transitions' && (
          <TransitionsEditor
            blob={current}
            onChange={(updated) => setCurrent(updated)}
          />
        )}
        {activeTab === 'associations' && (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">State ↔ Event</h2>
              <StateEventAssocEditor
                states={current.states}
                events={current.events}
                stateEventAssocs={current.stateEventAssocs}
                onChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'stateEventAssocs', updated) : c)}
              />
            </section>
            <section>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">Event ↔ WA Task</h2>
              <EventTaskAssocEditor
                events={current.events}
                waTasks={current.waTasks}
                eventTaskAssocs={current.eventTaskAssocs}
                onChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'eventTaskAssocs', updated) : c)}
              />
            </section>
            <section>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">Persona Associations</h2>
              <PersonaAssoc
                personas={current.personas}
                states={current.states}
                events={current.events}
                waTasks={current.waTasks}
                personaStateAssocs={current.personaStateAssocs}
                personaEventAssocs={current.personaEventAssocs}
                personaTaskAssocs={current.personaTaskAssocs}
                onStateAssocsChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'personaStateAssocs', updated) : c)}
                onEventAssocsChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'personaEventAssocs', updated) : c)}
                onTaskAssocsChange={(updated) => setCurrent((c) => c ? mergeEntityUpdate(c, 'personaTaskAssocs', updated) : c)}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
