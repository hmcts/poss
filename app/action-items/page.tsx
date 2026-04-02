'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../providers';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import {
  getActionItems,
  getActionItemSummary,
  filterActionItems,
  sortActionItems,
  exportActionItemsCsv,
} from '../../src/ui-action-items/index';
import {
  getAboutSection,
  getAboutSections,
} from '../../src/ui-about-action-items/index.js';

type SortDir = 'asc' | 'desc';

export default function ActionItemsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const { modelData, refData } = useApp();

  const waTasks = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappings = useMemo(() => blobToWaMappings(refData), [refData]);

  const allItems = useMemo(
    () => getActionItems(modelData.states, modelData.transitions, modelData.events, waTasks, waMappings),
    [modelData, waTasks, waMappings],
  );

  const summary = useMemo(() => getActionItemSummary(allItems), [allItems]);

  const filtered = useMemo(
    () =>
      filterActionItems(allItems, {
        category: categoryFilter,
        priority: priorityFilter,
        search: search || null,
      }),
    [allItems, categoryFilter, priorityFilter, search],
  );

  const sorted = useMemo(
    () => sortActionItems(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir],
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleExportCsv = () => {
    const csv = exportActionItemsCsv(sorted);
    const blob = new Blob([csv.content], { type: csv.mimeType + ';charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csv.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Action Items</h1>
            <p className="text-sm text-slate-400 mt-1">
              Prioritised issues from model health checks and WA task alignment
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Export CSV
          </button>
        </div>
        <AboutPanel />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total" value={summary.total} colour="#6B7280" />
        <SummaryCard label="High" value={summary.high} colour="#EF4444" />
        <SummaryCard label="Medium" value={summary.medium} colour="#F59E0B" />
        <SummaryCard label="Low" value={summary.low} colour="#22C55E" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <select
          value={categoryFilter ?? ''}
          onChange={(e) => setCategoryFilter(e.target.value || null)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Categories</option>
          <option value="Model Completeness">Model Completeness</option>
          <option value="WA Task Alignment">WA Task Alignment</option>
        </select>
        <select
          value={priorityFilter ?? ''}
          onChange={(e) => setPriorityFilter(e.target.value || null)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200 placeholder:text-slate-500 w-60"
        />
        <span className="text-xs text-slate-500 ml-auto">{sorted.length} items</span>
      </div>

      {/* Items Table */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700/30">
              {['priority', 'category', 'type', 'title', 'detail', 'suggestion'].map((col) => (
                <th
                  key={col}
                  className="py-2 px-3 cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortKey === col && (sortDir === 'asc' ? ' \u25B2' : ' \u25BC')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-xs">{item.category}</td>
                <td className="py-2.5 px-3 text-slate-400 text-xs">{item.type}</td>
                <td className="py-2.5 px-3 text-slate-200">
                  {item.linkPath ? (
                    <a href={item.linkPath} className="hover:text-indigo-300 transition-colors">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </td>
                <td className="py-2.5 px-3 text-slate-400 text-xs max-w-xs truncate">{item.detail}</td>
                <td className="py-2.5 px-3 text-slate-400 text-xs max-w-xs truncate">{item.suggestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AboutPanel() {
  const [open, setOpen] = useState(false);
  const sections = getAboutSections();
  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium">About this page — how items are sourced, prioritised, and what the scores mean</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 text-sm text-slate-400 border-t border-slate-700/30 pt-4">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="text-slate-200 font-medium mb-1">{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, colour }: { label: string; value: number; colour: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold" style={{ color: colour }}>{value}</div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colours: Record<string, { bg: string; text: string }> = {
    high: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
    medium: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    low: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  };
  const c = colours[priority] ?? colours.low;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {priority}
    </span>
  );
}
