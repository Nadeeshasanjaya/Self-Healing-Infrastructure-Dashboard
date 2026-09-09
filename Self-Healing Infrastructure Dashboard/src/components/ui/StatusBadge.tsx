import React from 'react';
import { cx } from '../../utils/format';

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

const TONES: Record<Tone, {wrap: string;dot: string;}> = {
  ok: { wrap: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
  warn: { wrap: 'bg-amber-500/10 text-amber-400 border-amber-500/25', dot: 'bg-amber-400' },
  danger: { wrap: 'bg-red-500/10 text-red-400 border-red-500/25', dot: 'bg-red-400' },
  info: { wrap: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25', dot: 'bg-indigo-400' },
  neutral: { wrap: 'bg-slate-500/10 text-slate-400 border-slate-500/25', dot: 'bg-slate-400' }
};

interface StatusBadgeProps {
  tone: Tone;
  label: string;
  pulse?: boolean;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ tone, label, pulse = false, dot = true, className }: StatusBadgeProps) {
  const t = TONES[tone];
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300',
        t.wrap,
        className
      )}>
      
      {dot ?
      <span className="relative flex h-1.5 w-1.5">
          {pulse ? <span className={cx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', t.dot)} /> : null}
          <span className={cx('relative inline-flex h-1.5 w-1.5 rounded-full', t.dot)} />
        </span> :
      null}
      {label}
    </span>);

}

export function toneForStatus(status: string): Tone {
  switch (status) {
    case 'online':
    case 'ONLINE':
    case 'RUNNING':
    case 'SUCCESS':
    case 'resolved':
    case 'Recovered':
      return 'ok';
    case 'degraded':
    case 'recovering':
    case 'RESTARTING':
    case 'warning':
    case 'ROLLED_BACK':
      return 'warn';
    case 'offline':
    case 'STOPPED':
    case 'FAILED':
    case 'critical':
    case 'Escalated':
      return 'danger';
    default:
      return 'neutral';
  }
}