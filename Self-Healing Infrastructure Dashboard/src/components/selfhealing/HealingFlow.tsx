import React from 'react';
import { motion } from 'framer-motion';
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  ShieldCheckIcon,
  StethoscopeIcon } from
'lucide-react';
import { HEAL_STAGES, useSystem } from '../../contexts/SystemContext';
import { cx } from '../../utils/format';

const STAGE_META = [
{ icon: ActivityIcon, color: 'emerald', hint: 'All probes green' },
{ icon: AlertTriangleIcon, color: 'red', hint: 'Health probe returned 503' },
{ icon: ShieldCheckIcon, color: 'amber', hint: 'Policy restart-on-unhealthy matched' },
{ icon: RefreshCwIcon, color: 'amber', hint: 'Docker API restart issued' },
{ icon: StethoscopeIcon, color: 'indigo', hint: '3 consecutive 200 OK' },
{ icon: CheckCircle2Icon, color: 'emerald', hint: 'Traffic restored' }];


const COLORS: Record<string, {active: string;ring: string;text: string;}> = {
  emerald: { active: 'border-emerald-500/50 bg-emerald-500/10', ring: 'bg-emerald-400', text: 'text-emerald-300' },
  red: { active: 'border-red-500/50 bg-red-500/10', ring: 'bg-red-400', text: 'text-red-300' },
  amber: { active: 'border-amber-500/50 bg-amber-500/10', ring: 'bg-amber-400', text: 'text-amber-300' },
  indigo: { active: 'border-indigo-500/50 bg-indigo-500/10', ring: 'bg-indigo-400', text: 'text-indigo-300' }
};

export function HealingFlow() {
  const { stageIndex, simulating } = useSystem();

  return (
    <ol className="space-y-0" aria-label="Self-healing pipeline">
      {HEAL_STAGES.map((stage, i) => {
        const meta = STAGE_META[i];
        const c = COLORS[meta.color];
        const isActive = simulating ? i === stageIndex : i === 0;
        const isDone = simulating && i < stageIndex;
        const Icon = meta.icon;
        return (
          <li key={stage}>
            <div
              className={cx(
                'flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-500',
                isActive ? c.active : isDone ? 'border-line bg-base-750/60' : 'border-transparent bg-base-850/40'
              )}>
              
              <span
                className={cx(
                  'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-500',
                  isActive || isDone ? 'border-line bg-base-800' : 'border-line/60 bg-base-850'
                )}>
                
                <Icon
                  className={cx(
                    'h-4 w-4 transition-colors duration-500',
                    isActive ? c.text : isDone ? 'text-slate-400' : 'text-slate-600',
                    isActive && i === 3 && 'animate-spin'
                  )} />
                
                {isActive ?
                <span className={cx('absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full', c.ring)} /> :
                null}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cx(
                    'block font-mono text-xs font-semibold tracking-wider transition-colors duration-500',
                    isActive ? c.text : isDone ? 'text-slate-300' : 'text-slate-600'
                  )}>
                  
                  {stage}
                </span>
                <span className="block truncate text-[11px] text-slate-600">{meta.hint}</span>
              </span>
              {isDone ? <CheckCircle2Icon className="h-4 w-4 shrink-0 text-emerald-500/70" /> : null}
            </div>
            {i < HEAL_STAGES.length - 1 ?
            <div className="relative ml-8 h-5 w-px overflow-hidden bg-line">
                {simulating && i === stageIndex ?
              <motion.span
                className="absolute inset-x-0 h-3 bg-indigo-400"
                animate={{ y: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} /> :

              null}
              </div> :
            null}
          </li>);

      })}
    </ol>);

}