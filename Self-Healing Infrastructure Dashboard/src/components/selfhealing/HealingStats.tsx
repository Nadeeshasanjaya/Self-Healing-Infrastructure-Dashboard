import React from 'react';
import { useSystem } from '../../contexts/SystemContext';
import { cx } from '../../utils/format';

export function HealingStats({ columns = 5 }: {columns?: 3 | 5;}) {
  const { stats } = useSystem();

  const items = [
  { label: 'Total incidents', value: String(stats.totalIncidents), tone: 'text-slate-100' },
  { label: 'Auto recovered', value: String(stats.autoRecovered), tone: 'text-emerald-400' },
  { label: 'Manual interventions', value: String(stats.manual), tone: 'text-amber-400' },
  { label: 'Recovery success rate', value: `${stats.successRate}%`, tone: 'text-emerald-400' },
  { label: 'Avg recovery time', value: `${stats.avgRecoverySec}s`, tone: 'text-indigo-300' }];


  return (
    <div
      className={cx(
        'grid grid-cols-2 gap-3',
        columns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3'
      )}>
      
      {items.map((i) =>
      <div key={i.label} className="rounded-lg border border-line bg-base-750/50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">{i.label}</p>
          <p className={cx('mt-1.5 font-mono text-xl font-semibold tabular-nums', i.tone)}>{i.value}</p>
        </div>
      )}
    </div>);

}