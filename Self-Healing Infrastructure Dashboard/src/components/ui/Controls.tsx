import React from 'react';
import { SearchIcon } from 'lucide-react';
import { cx } from '../../utils/format';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className





}: {value: string;onChange: (v: string) => void;placeholder?: string;className?: string;}) {
  return (
    <div className={cx('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-line bg-base-850 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 transition-colors focus:border-indigo-500/50" />
      
    </div>);

}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label





}: {options: {value: T;label: string;}[];value: T;onChange: (v: T) => void;label: string;}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg border border-line bg-base-850 p-0.5">
      {options.map((o) =>
      <button
        key={o.value}
        role="tab"
        aria-selected={value === o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cx(
          'rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors duration-200',
          value === o.value ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-400 hover:text-slate-200'
        )}>
        
          {o.label}
        </button>
      )}
    </div>);

}

export function Button({
  children,
  onClick,
  variant = 'ghost',
  icon,
  disabled,
  className,
  type = 'button'








}: {children: React.ReactNode;onClick?: () => void;variant?: 'ghost' | 'primary' | 'danger';icon?: React.ReactNode;disabled?: boolean;className?: string;type?: 'button' | 'submit';}) {
  const variants = {
    ghost: 'border-line bg-base-850 text-slate-300 hover:text-white hover:border-slate-600',
    primary: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25',
    danger: 'border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}>
      
      {icon}
      {children}
    </button>);

}

export function Select({
  value,
  onChange,
  options,
  label,
  className






}: {value: string;onChange: (v: string) => void;options: {value: string;label: string;}[];label: string;className?: string;}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cx(
        'rounded-lg border border-line bg-base-850 px-3 py-2 text-xs font-medium text-slate-300 transition-colors focus:border-indigo-500/50',
        className
      )}>
      
      {options.map((o) =>
      <option key={o.value} value={o.value} className="bg-base-850">
          {o.label}
        </option>
      )}
    </select>);

}