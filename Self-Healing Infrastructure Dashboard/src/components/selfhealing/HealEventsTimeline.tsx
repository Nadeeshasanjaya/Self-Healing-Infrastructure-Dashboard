import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertOctagonIcon, AlertTriangleIcon, CheckCircle2Icon, RefreshCwIcon } from 'lucide-react';
import type { HealEvent, HealEventKind } from '../../types';
import { cx } from '../../utils/format';

const KIND: Record<HealEventKind, {icon: typeof CheckCircle2Icon;color: string;label: string;}> = {
  detection: { icon: AlertOctagonIcon, color: 'text-red-400 border-red-500/30 bg-red-500/10', label: 'Detection' },
  warning: { icon: AlertTriangleIcon, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', label: 'Warning' },
  recovery: { icon: RefreshCwIcon, color: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10', label: 'Recovery' },
  success: { icon: CheckCircle2Icon, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', label: 'Success' }
};

export function HealEventsTimeline({ events, limit = 12 }: {events: HealEvent[];limit?: number;}) {
  return (
    <ul className="relative px-5 py-4">
      <span className="absolute bottom-6 left-[38px] top-8 w-px bg-line" aria-hidden="true" />
      <AnimatePresence initial={false}>
        {events.slice(0, limit).map((e) => {
          const k = KIND[e.kind];
          const Icon = k.icon;
          return (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex gap-4 pb-4 last:pb-0">
              
              <span
                className={cx(
                  'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                  k.color
                )}>
                
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-xs text-slate-500">{e.time}</span>
                  <span className="text-sm font-medium text-slate-200">{e.source}</span>
                  <span className={cx('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', k.color)}>
                    {k.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{e.message}</p>
              </div>
            </motion.li>);

        })}
      </AnimatePresence>
    </ul>);

}