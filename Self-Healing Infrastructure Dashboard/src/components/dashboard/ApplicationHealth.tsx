import React from 'react';
import { LayersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { StatusBadge, toneForStatus } from '../ui/StatusBadge';
import { useSystem } from '../../contexts/SystemContext';

const LABEL: Record<string, string> = {
  online: 'Online',
  offline: 'Down',
  recovering: 'Recovering',
  degraded: 'Degraded'
};

export function ApplicationHealth() {
  const { appServices } = useSystem();
  const allUp = appServices.every((s) => s.status === 'online');

  return (
    <Card>
      <CardHeader
        title="Application Health"
        subtitle="Synthetic checks from eu-central-1"
        icon={<LayersIcon className="h-4 w-4" />}
        action={<StatusBadge tone={allUp ? 'ok' : 'danger'} label={allUp ? 'All Healthy' : 'Degraded'} />} />
      
      <ul className="divide-y divide-line">
        {appServices.map((s) =>
        <li key={s.id} className="px-5 py-3.5">
            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-base-750 text-slate-300">
                <s.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{s.name}</p>
                <p className="truncate font-mono text-xs text-slate-500">{s.endpoint}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-mono text-xs text-slate-300">{s.status === 'online' ? `${s.responseMs} ms` : '—'}</p>
                <p className="font-mono text-[11px] text-slate-600">{s.successRate}% ok</p>
              </div>
              <motion.div key={s.status} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}>
                <StatusBadge
                tone={toneForStatus(s.status)}
                label={LABEL[s.status]}
                pulse={s.status !== 'online'} />
              
              </motion.div>
            </div>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-base-750">
              <motion.div
              className={
              s.status === 'online' ?
              'h-full rounded-full bg-emerald-500' :
              s.status === 'offline' ?
              'h-full rounded-full bg-red-500' :
              'h-full rounded-full bg-amber-500'
              }
              initial={false}
              animate={{ width: s.status === 'online' ? `${s.successRate}%` : s.status === 'offline' ? '8%' : '55%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
            
            </div>
          </li>
        )}
      </ul>
    </Card>);

}