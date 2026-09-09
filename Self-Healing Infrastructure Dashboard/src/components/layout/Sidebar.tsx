import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ActivityIcon,
  BellIcon,
  BoxIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
  RocketIcon,
  ServerIcon,
  SettingsIcon,
  ShieldCheckIcon,
  LayersIcon } from
'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { cx } from '../../utils/format';

const NAV = [
{ to: '/', label: 'Dashboard', icon: LayoutDashboardIcon, end: true },
{ to: '/infrastructure', label: 'Infrastructure', icon: ServerIcon },
{ to: '/services', label: 'Services', icon: LayersIcon },
{ to: '/containers', label: 'Containers', icon: BoxIcon },
{ to: '/monitoring', label: 'Monitoring', icon: ActivityIcon },
{ to: '/self-healing', label: 'Self-Healing', icon: HeartPulseIcon },
{ to: '/alerts', label: 'Alerts', icon: BellIcon },
{ to: '/deployments', label: 'Deployment History', icon: RocketIcon },
{ to: '/settings', label: 'Settings', icon: SettingsIcon }];


export function Sidebar({ mobileOpen, onNavigate }: {mobileOpen: boolean;onNavigate: () => void;}) {
  const { alerts, systemStatus } = useSystem();
  const openAlerts = alerts.filter((a) => a.severity !== 'resolved' && !a.acknowledged).length;

  return (
    <aside
      className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-base-850 transition-transform duration-300 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      aria-label="Primary navigation">
      
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
          <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-white">Self-HealOps</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">v1.4.2</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Operations</p>
        <ul className="space-y-1">
          {NAV.map((item) =>
          <li key={item.to}>
              <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
              cx(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                isActive ?
                'bg-indigo-500/10 text-white shadow-[inset_2px_0_0_0_#6366f1]' :
                'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              )
              }>
              
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.label === 'Alerts' && openAlerts > 0 ?
              <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-red-400">
                    {openAlerts}
                  </span> :
              null}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="border-t border-line p-4">
        <div className="rounded-lg border border-line bg-base-800 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Recovery Engine</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cx(
                'h-2 w-2 rounded-full',
                systemStatus === 'HEALTHY' ? 'bg-emerald-400 animate-pulse-ring' : 'bg-amber-400 animate-pulse'
              )} />
            
            <span className="font-mono text-xs text-slate-300">
              {systemStatus === 'HEALTHY' ? 'ARMED · IDLE' : 'ACTIVE · WORKING'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Watching 7 targets · 5 rules</p>
        </div>
      </div>
    </aside>);

}