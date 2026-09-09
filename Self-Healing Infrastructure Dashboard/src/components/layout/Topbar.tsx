import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon, MenuIcon, RefreshCwIcon } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { StatusBadge } from '../ui/StatusBadge';
import { cx } from '../../utils/format';

export function Topbar({ onOpenMenu }: {onOpenMenu: () => void;}) {
  const { systemStatus, alerts, refresh, lastRefresh } = useSystem();
  const [spinning, setSpinning] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = alerts.filter((a) => !a.acknowledged).length;

  const tone = systemStatus === 'HEALTHY' ? 'ok' : systemStatus === 'CRITICAL' ? 'danger' : 'warn';

  const handleRefresh = () => {
    setSpinning(true);
    refresh();
    window.setTimeout(() => setSpinning(false), 700);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-base-900/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="rounded-lg border border-line p-2 text-slate-400 hover:text-white lg:hidden">
        
        <MenuIcon className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold tracking-tight text-white">Self-HealOps</h1>
        <p className="hidden truncate text-xs text-slate-500 sm:block">
          Infrastructure Automation &amp; Recovery Platform
        </p>
      </div>

      <StatusBadge
        tone={tone}
        pulse
        label={`SYSTEM ${systemStatus}`}
        className="hidden sm:inline-flex" />
      

      <button
        type="button"
        onClick={handleRefresh}
        aria-label="Refresh data"
        title={`Last refreshed ${lastRefresh}`}
        className="rounded-lg border border-line bg-base-850 p-2 text-slate-400 transition-colors hover:text-white">
        
        <RefreshCwIcon className={cx('h-4 w-4', spinning && 'animate-spin')} />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setNotifOpen((v) => !v)}
          aria-label={`Notifications, ${unread} unread`}
          aria-expanded={notifOpen}
          className="relative rounded-lg border border-line bg-base-850 p-2 text-slate-400 transition-colors hover:text-white">
          
          <BellIcon className="h-4 w-4" />
          {unread > 0 ?
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-bold text-white">
              {unread}
            </span> :
          null}
        </button>
        {notifOpen ?
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-base-850 shadow-2xl">
            <p className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Notifications
            </p>
            <ul className="max-h-72 overflow-y-auto">
              {alerts.slice(0, 6).map((a) =>
            <li key={a.id} className="border-b border-line/60 px-4 py-3 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-slate-200">{a.title}</p>
                    <span className="font-mono text-[10px] text-slate-500">{a.timestamp}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{a.source}</p>
                </li>
            )}
            </ul>
          </div> :
        null}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-line bg-base-850 py-1.5 pl-1.5 pr-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20 font-mono text-xs font-bold text-indigo-300">
          MA
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-xs font-semibold text-slate-200">M. Arslan</span>
          <span className="block text-[10px] text-slate-500">SRE Lead</span>
        </span>
        <ChevronDownIcon className="hidden h-3.5 w-3.5 text-slate-500 md:block" />
      </div>
    </header>);

}