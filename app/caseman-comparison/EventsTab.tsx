'use client';

import React, { useState, useMemo } from 'react';
import {
  filterRows,
  searchRows,
  deepLink,
  exportComparisonCsv,
  type JoinedRow,
  type CoverageSummary,
  type CasemanMapping,
} from '../../src/caseman-comparison/index';
import { Tooltip } from './Tooltip';
import { getTooltipText } from '../../src/ui-caseman-tooltips/index';

interface EventsTabProps {
  rows: JoinedRow[];
  summary: CoverageSummary;
  onMappingEdit: (mapping: CasemanMapping) => void;
}

const STATUS_ORDER: Record<string, number> = { gap: 0, partial: 1, covered: 2 };

function defaultSort(rows: JoinedRow[]): JoinedRow[] {
  return [...rows].sort((a, b) => {
    const statusDiff = (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3);
    if (statusDiff !== 0) return statusDiff;
    return a.id - b.id;
  });
}

export default function EventsTab({ rows, summary: _summary, onMappingEdit }: EventsTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const domains = useMemo(() => {
    const set = new Set(rows.map((r) => r.domain));
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const afterFilter = filterRows(rows, {
      status: statusFilter || null,
      domain: domainFilter || null,
    });
    return searchRows(afterFilter, search);
  }, [rows, statusFilter, domainFilter, search]);

  const sorted = useMemo(() => defaultSort(filtered), [filtered]);

  const handleRowClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExportCsv = () => {
    const csv = exportComparisonCsv(sorted);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'caseman-comparison.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const mappings: CasemanMapping[] = rows.map((row) => ({
      casemanEventId: row.casemanEventId,
      status: row.status,
      newEventName: row.newEventName,
      newStateName: row.newStateName,
      notes: row.notes,
      source: row.source,
    }));
    const json = JSON.stringify(mappings, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'caseman-mappings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header with export buttons */}
      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Export CSV
          </button>
          <Tooltip content={getTooltipText('exportJson')} position="bottom">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
            >
              Export Mappings JSON
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 items-center flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Statuses</option>
          <option value="covered">Covered</option>
          <option value="partial">Partial</option>
          <option value="gap">Gap</option>
        </select>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Domains</option>
          {domains.map((d) => (
            d === 'Unclassified'
              ? (
                // Native <option> does not support React children tooltips; use title attribute instead
                <option key={d} value={d} title={getTooltipText('unclassifiedOption')}>
                  {d}
                </option>
              )
              : (
                <option key={d} value={d}>
                  {d}
                </option>
              )
          ))}
        </select>

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200 placeholder:text-slate-500 w-60"
        />

        <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
          {sorted.length} events
          <Tooltip content={getTooltipText('italicRows')} position="bottom">
            <span className="cursor-default text-slate-400">ⓘ</span>
          </Tooltip>
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700/30">
              <th className="py-2 px-3 w-16">ID</th>
              <th className="py-2 px-3">Event Name</th>
              <th className="py-2 px-3">Domain</th>
              <th className="py-2 px-3 w-24">Status</th>
              <th className="py-2 px-3">New Model Event</th>
              <th className="py-2 px-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <React.Fragment key={`row-${row.id}`}>
                <tr
                  onClick={() => handleRowClick(row.id)}
                  className={[
                    'border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-colors',
                    expandedId === row.id ? 'bg-slate-800/20' : '',
                  ].join(' ')}
                >
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{row.id}</td>
                  <td
                    className={[
                      'py-2.5 px-3',
                      row.source === 'auto' ? 'text-slate-500 italic' : 'text-slate-200',
                    ].join(' ')}
                  >
                    {row.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{row.domain}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td
                    className={[
                      'py-2.5 px-3 text-xs max-w-xs truncate',
                      row.source === 'auto' ? 'text-slate-500 italic' : 'text-slate-300',
                    ].join(' ')}
                  >
                    {row.newEventName ?? '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs max-w-xs truncate">
                    {row.notes || '—'}
                  </td>
                </tr>

                {expandedId === row.id && (
                  <tr key={`expand-${row.id}`} className="border-b border-slate-800/50 bg-slate-900/40">
                    <td colSpan={6} className="px-4 py-4">
                      <DetailPanel row={row} onMappingEdit={onMappingEdit} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            No events match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'covered' | 'partial' | 'gap' }) {
  const styles: Record<string, { bg: string; text: string }> = {
    covered: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
    partial: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    gap: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  };
  const s = styles[status] ?? styles.gap;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  row,
  onMappingEdit,
}: {
  row: JoinedRow;
  onMappingEdit: (mapping: CasemanMapping) => void;
}) {
  const link = deepLink(row);

  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<'covered' | 'partial' | 'gap'>(row.status);
  const [editNewEventName, setEditNewEventName] = useState(row.newEventName ?? '');
  const [editNotes, setEditNotes] = useState(row.notes ?? '');

  const handleSave = () => {
    onMappingEdit({
      casemanEventId: row.id,
      status: editStatus,
      newEventName: editNewEventName || null,
      newStateName: row.newStateName,
      notes: editNotes,
      source: 'curated',
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditStatus(row.status);
    setEditNewEventName(row.newEventName ?? '');
    setEditNotes(row.notes ?? '');
    setEditing(false);
  };

  return (
    <div className="space-y-3 text-xs text-slate-300">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 max-w-xl">
        <div>
          <span className="text-slate-500 uppercase tracking-wide text-[10px]">Prerequisite IDs</span>
          <p className="mt-0.5 text-slate-300">
            {row.prerequisiteIds && row.prerequisiteIds.length > 0
              ? row.prerequisiteIds.join(', ')
              : 'None'}
          </p>
        </div>
        <div>
          <span className="text-slate-500 uppercase tracking-wide text-[10px]">Task Codes</span>
          <p className="mt-0.5 text-slate-300">
            {row.taskCodes && row.taskCodes.length > 0
              ? row.taskCodes.join(', ')
              : 'None'}
          </p>
        </div>
        <div>
          <span className="text-slate-500 uppercase tracking-wide text-[10px]">Source</span>
          <p className="mt-0.5 text-slate-300">
            {row.source === 'auto' ? (
              <Tooltip content={getTooltipText('sourceAuto')}>
                <span>{row.source}</span>
              </Tooltip>
            ) : (
              row.source
            )}
          </p>
        </div>
        {row.newStateName && (
          <div>
            <span className="text-slate-500 uppercase tracking-wide text-[10px]">New State</span>
            <p className="mt-0.5 text-slate-300">{row.newStateName}</p>
          </div>
        )}
      </div>

      {link && (
        <div>
          <a
            href={link}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors"
          >
            View in Model →
          </a>
        </div>
      )}

      {/* Inline edit form */}
      {!editing ? (
        <div>
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Edit mapping
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3 border-t border-slate-700/40 pt-3 max-w-xl">
          <p className="text-slate-400 uppercase tracking-wide text-[10px] font-medium">Edit mapping</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide text-[10px]">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as 'covered' | 'partial' | 'gap')}
                className="w-full px-2 py-1.5 text-xs bg-slate-900/70 border border-slate-700/40 rounded-md text-slate-200"
              >
                <option value="covered">covered</option>
                <option value="partial">partial</option>
                <option value="gap">gap</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 uppercase tracking-wide text-[10px]">New Model Event</label>
              <input
                type="text"
                value={editNewEventName}
                onChange={(e) => setEditNewEventName(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-slate-900/70 border border-slate-700/40 rounded-md text-slate-200 placeholder:text-slate-600"
                placeholder="Event name..."
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 uppercase tracking-wide text-[10px]">Notes</label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
              className="w-full px-2 py-1.5 text-xs bg-slate-900/70 border border-slate-700/40 rounded-md text-slate-200 placeholder:text-slate-600 resize-none"
              placeholder="Add notes..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600/80 border border-indigo-500/40 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
