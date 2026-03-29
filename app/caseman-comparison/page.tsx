'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../providers';
import casemanEvents from '../../data/caseman-events.json';
import casemanMappings from '../../data/caseman-mappings.json';
import waTasks from '../../data/wa-tasks.json';
import waMappings from '../../data/wa-mappings.json';
import {
  parseCasemanEvents,
  autoMatchEvents,
  joinWithMappings,
  getCoverageSummary,
  type CasemanMapping,
  type JoinedRow,
  type CoverageSummary,
} from '../../src/caseman-comparison/index';
import StatesTab from './StatesTab';
import EventsTab from './EventsTab';
import TasksTab from './TasksTab';
import { Tooltip } from './Tooltip';
import { getTooltipText } from '../../src/ui-caseman-tooltips/index';

type ActiveTab = 'states' | 'events' | 'tasks';

export default function CasemanComparisonPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('states');
  const [editedMappings, setEditedMappings] = useState<CasemanMapping[]>([]);

  const { modelData } = useApp();

  const parsedEvents = useMemo(
    () => parseCasemanEvents(casemanEvents as Array<Record<string, unknown>>),
    [],
  );

  const autoMappings = useMemo(
    () => autoMatchEvents(parsedEvents, modelData.events.map((e) => e.name)),
    [parsedEvents, modelData.events],
  );

  const joinedRows = useMemo(
    () => joinWithMappings(parsedEvents, autoMappings, [
      ...(casemanMappings as CasemanMapping[]),
      ...editedMappings,
    ]),
    [parsedEvents, autoMappings, editedMappings],
  );

  const summary: CoverageSummary = useMemo(
    () => getCoverageSummary(joinedRows),
    [joinedRows],
  );

  const onMappingEdit = (mapping: CasemanMapping) => {
    setEditedMappings((prev) => {
      const idx = prev.findIndex((m) => m.casemanEventId === mapping.casemanEventId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = mapping;
        return next;
      }
      return [...prev, mapping];
    });
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'states', label: 'States' },
    { id: 'events', label: 'Events' },
    { id: 'tasks', label: 'Tasks' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Caseman Comparison</h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare Caseman legacy events and statuses against the new HMCTS possessions service model
          </p>
        </div>
        <AboutPanel />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total Events" value={summary.total} colour="#6B7280" />
        <SummaryCard
          label={<Tooltip content={getTooltipText('covered')}>Covered</Tooltip>}
          value={summary.covered}
          colour="#22C55E"
        />
        <SummaryCard
          label={<Tooltip content={getTooltipText('partial')}>Partial</Tooltip>}
          value={summary.partial}
          colour="#F59E0B"
        />
        <SummaryCard
          label={<Tooltip content={getTooltipText('gap')}>Gap</Tooltip>}
          value={summary.gap}
          colour="#EF4444"
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-900/50 border border-slate-700/30 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-5 py-2 text-sm font-medium rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'states' && (
        <StatesTab modelData={modelData} />
      )}

      {activeTab === 'events' && (
        <EventsTab rows={joinedRows} summary={summary} onMappingEdit={onMappingEdit} />
      )}

      {activeTab === 'tasks' && (
        <TasksTab
          casemanEvents={parsedEvents}
          waTasks={waTasks as Array<{ id: string; taskName: string; alignment: string }>}
          waMappings={waMappings as Array<{ waTaskId: string; eventIds: string[]; alignmentNotes: string }>}
        />
      )}
    </div>
  );
}

function AboutPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium">About this page — how to read it and how conclusions are reached</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 text-sm text-slate-400 border-t border-slate-700/30 pt-4">
          <div>
            <h3 className="text-slate-200 font-medium mb-1">What this page does</h3>
            <p>
              This page compares the legacy CCBC/Caseman system against the new HMCTS Possessions
              service across three dimensions: <strong className="text-slate-300">States</strong> (case
              status model), <strong className="text-slate-300">Events</strong> (the 497 standard events
              in Caseman's reference data), and <strong className="text-slate-300">Tasks</strong> (the
              513 BMS task codes vs the 17 R1A Work Allocation tasks). The goal is to surface gaps in
              coverage — areas where the new service has not yet modelled something Caseman handles, or
              where the granularity differs significantly.
            </p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">How coverage is calculated</h3>
            <p className="mb-2">
              Event coverage is auto-derived using <strong className="text-slate-300">Jaccard word-token
              similarity</strong> between each Caseman event name and the new service's event names.
              The thresholds are:
            </p>
            <ul className="space-y-1 list-none">
              <li><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
                <strong className="text-slate-300">Covered</strong> — similarity &gt; 0.8 (near-identical wording)</li>
              <li><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2" />
                <strong className="text-slate-300">Partial</strong> — similarity 0.5–0.8 (related but different granularity or phrasing)</li>
              <li><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />
                <strong className="text-slate-300">Gap</strong> — similarity &lt; 0.5 (no close match found)</li>
            </ul>
            <p className="mt-2">
              The coverage percentage weights partial matches at 50%: <code className="text-slate-300 bg-slate-800 px-1 rounded">(covered + partial × 0.5) / 497</code>.
            </p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Limitations of the auto-match baseline</h3>
            <p>
              Auto-matching on event names alone is a rough first pass. Caseman uses terse, operational
              names (e.g. "N30 JUDGMENT BY DEFAULT") while the new service uses citizen-facing language
              (e.g. "Make an application"). Many real matches will be missed, and some false matches
              will appear. The baseline should be treated as a starting point, not a conclusion.
            </p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">How to improve the analysis</h3>
            <p>
              On the <strong className="text-slate-300">Events</strong> tab, expand any row and use the
              inline edit form to override the auto-derived classification. Set the correct status,
              map it to the corresponding new service event, and add a note explaining the relationship.
              When done, click <strong className="text-slate-300">Export Mappings JSON</strong> and
              commit the file to the repository. On next load, your curated mappings take precedence
              over the auto-derived baseline — rows you've reviewed are shown in normal weight;
              unreviewed auto-derived rows remain in italic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, colour }: { label: React.ReactNode; value: number; colour: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold" style={{ color: colour }}>{value}</div>
    </div>
  );
}
