import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertOctagonIcon, AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import type { AlertItem, AlertSeverity } from '../../types';
import { cx } from '../../utils/format';

const SEVERITY: Record<AlertSeverity, {icon: typeof AlertOctagonIcon;wrap: string;text: string;label: string;}> = {
  critical: { icon: AlertOctagonIcon, wrap: 'border-red-500/25 bg-red-500/[0.06]', text: 'text-red-400', label: 'Critical' },
  warning: { icon: AlertTriangleIcon, wrap: 'border-amber-500/25 bg-amber-500/[0.06]', text: 'text-amber-400', label: 'Warning' },
  resolved: { icon: CheckCircle2Icon, wrap: 'border-emerald-500/25 bg-emerald-500/[0.06]', text: 'text-emerald-400', label: 'Resolved' }
};

export function AlertsPanel({ alerts, compact = false }: {alerts: AlertItem[];compact?: boolean;}) {
  const { acknowledgeAlert } = useSystem();

  if (alerts.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <CheckCircle2Icon className="mx-auto h-6 w-6 text-emerald-500/60" />
        <p className="mt-2 text-sm text-slate-400">No alerts match the current filter.</p>
      </div>);

  }

  return (
    <ul className="space-y-2 p-4">
      <AnimatePresence initial={false}>
        {alerts.map((a) => {
          const s = SEVERITY[a.severity];
          const Icon = s.icon;
          return (
            <motion.li
              key={a.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className={cx('rounded-lg border px-4 py-3', s.wrap)}>
              
              <div className="flex items-start gap-3">
                <Icon className={cx('mt-0.5 h-4 w-4 shrink-0', s.text)} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <p className="text-sm font-semibold text-slate-100">{a.title}</p>
                    <span className={cx('text-[10px] font-bold uppercase tracking-wider', s.text)}>{s.label}</span>
                  </div>
                  {!compact ? <p className="mt-1 text-xs text-slate-400">{a.message}</p> : null}
                  <p className="mt-1 font-mono text-[11px] text-slate-600">
                    {a.source} · {a.timestamp}
                  </p>
                </div>
                {a.acknowledged ?
                <span className="shrink-0 rounded border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                    Acked
                  </span> :

                <button
                  type="button"
                  onClick={() => acknowledgeAlert(a.id)}
                  className="shrink-0 rounded border border-line px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200">
                  
                    Ack
                  </button>
                }
              </div>
            </motion.li>);

        })}
      </AnimatePresence>
    </ul>);

}