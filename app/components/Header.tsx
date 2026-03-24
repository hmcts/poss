'use client';

import { useApp } from '../providers';
import { getHealthBadge } from '../../src/ui-app-shell/index';

export function Header() {
  const { modelData } = useApp();
  const badge = getHealthBadge(modelData.states, modelData.transitions, modelData.events);

  return (
    <header className="h-14 border-b border-slate-700/30 bg-slate-900/40 backdrop-blur-sm flex items-center justify-between px-8">
      <span className="text-[13px] text-slate-500 hidden md:block font-medium">Process Model Explorer</span>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: badge.color, boxShadow: `0 0 8px ${badge.color}40` }} />
          <span className="text-[12px] text-slate-500">
            Model Health: <span className="font-medium text-slate-300">{badge.label}</span>
          </span>
        </div>

      </div>
    </header>
  );
}
