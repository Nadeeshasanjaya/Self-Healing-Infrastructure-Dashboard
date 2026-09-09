import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import type { SeriesPoint } from '../../types';

const AXIS = { stroke: '#475569', fontSize: 10, tickLine: false, axisLine: false };

function ChartTooltip({ unit }: {unit?: string;}) {
  return (
    <Tooltip
      cursor={{ stroke: '#334155', strokeWidth: 1 }}
      contentStyle={{
        background: '#0a0f1a',
        border: '1px solid #1c2637',
        borderRadius: 8,
        fontSize: 12,
        color: '#e2e8f0'
      }}
      labelStyle={{ color: '#94a3b8', fontSize: 11 }}
      formatter={(v: number | string, name: string) => [`${v}${unit ?? ''}`, name]} />);


}

export function Sparkline({ data, color }: {data: SeriesPoint[];color: string;}) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#spark-${color.replace('#', '')})`}
          isAnimationActive={false} />
        
      </AreaChart>
    </ResponsiveContainer>);

}

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

export function AreaTrend({
  data,
  series,
  unit,
  height = 220,
  domain






}: {data: SeriesPoint[];series: SeriesConfig[];unit?: string;height?: number;domain?: [number, number];}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          {series.map((s) =>
          <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        <CartesianGrid stroke="#16203f" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="t" {...AXIS} minTickGap={28} />
        <YAxis {...AXIS} width={44} domain={domain} />
        <ChartTooltip unit={unit} />
        {series.map((s) =>
        <Area
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color}
          strokeWidth={2}
          fill={`url(#g-${s.key})`}
          isAnimationActive={false} />

        )}
      </AreaChart>
    </ResponsiveContainer>);

}

export function LineTrend({
  data,
  series,
  unit,
  height = 220





}: {data: SeriesPoint[];series: SeriesConfig[];unit?: string;height?: number;}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="#16203f" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="t" {...AXIS} minTickGap={28} />
        <YAxis {...AXIS} width={44} />
        <ChartTooltip unit={unit} />
        {series.map((s) =>
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false} />

        )}
      </LineChart>
    </ResponsiveContainer>);

}

export function BarTrend({
  data,
  series,
  unit,
  height = 220





}: {data: SeriesPoint[];series: SeriesConfig[];unit?: string;height?: number;}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="#16203f" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="t" {...AXIS} minTickGap={28} />
        <YAxis {...AXIS} width={44} allowDecimals={false} />
        <ChartTooltip unit={unit} />
        {series.map((s) =>
        <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        )}
      </BarChart>
    </ResponsiveContainer>);

}

export function ChartLegend({ series }: {series: SeriesConfig[];}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {series.map((s) =>
      <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="h-1.5 w-4 rounded-full" style={{ background: s.color }} />
          {s.name}
        </span>
      )}
    </div>);

}