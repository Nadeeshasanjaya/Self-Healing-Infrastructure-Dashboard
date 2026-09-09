import React from 'react';
import { cx } from '../../utils/format';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cx(
        'rounded-xl border border-line bg-base-800/80 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]',
        className
      )}>
      
      {children}
    </Tag>);

}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cx('flex items-start justify-between gap-4 border-b border-line px-5 py-4', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon ? <span className="text-slate-400 shrink-0">{icon}</span> : null}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 truncate">{title}</h2>
          {subtitle ? <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>);

}