'use client';

import Link from 'next/link';
import { getNavigationItems } from '../src/ui-app-shell/index';

const descriptions: Record<string, string> = {
  '/state-explorer': 'Interactive graph visualisation of state transitions and dependencies',
  '/event-matrix': 'Searchable event table with actor roles and CSV export',
  '/digital-twin': 'Step-through case simulation with what-if analysis',
};

export default function HomePage() {
  const navItems = getNavigationItems();

  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <h2 className="text-2xl font-semibold text-slate-100 mb-2 tracking-tight">
        Process Model Explorer
      </h2>
      <p className="text-slate-500 text-sm mb-12">
        Explore possession case processes, state machines, and event models.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="group p-6 rounded-xl border border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-200 text-left"
          >
            <div className="text-base font-medium text-slate-200 mb-2 group-hover:text-indigo-300 transition-colors">
              {item.label}
            </div>
            <div className="text-[13px] text-slate-500 leading-relaxed">
              {descriptions[item.path]}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
