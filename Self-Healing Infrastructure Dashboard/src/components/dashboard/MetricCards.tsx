import React, { useMemo } from 'react';
import { ClockIcon, CpuIcon, HardDriveIcon, MemoryStickIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Sparkline } from '../charts/Charts';
import { StatusBadge } from '../ui/StatusBadge';
import { useSystem } from '../../contexts/SystemContext';
import { sparkline } from '../../utils/series';

function MetricCard({
  label,
  value,
  icon,
  color,
  data,
  status,
  tone








}: {label: string;value: string;icon: React.ReactNode;color: string;data?: ReturnType<typeof sparkline>;status: string;tone: 'ok' | 'warn' | 'danger' | 'info';}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg border border-line bg-base-750 p-2 text-slate-400">{icon}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        </div>
        <StatusBadge tone={tone} label={status} dot={false} />
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-white transition-all duration-500">
        {value}
      </p>
      <div className="mt-3 h-12">
        {data ?
        <Sparkline data={data} color={color} /> :

        <div className="flex h-full items-end gap-3 text-[11px] text-slate-500">
            <span>Since last reboot</span>
          </div>
        }
      </div>
    </Card>);

}

export function MetricCards() {
  const { metrics, uptime } = useSystem();
  const cpuData = useMemo(() => sparkline(32, 11), []);
  const memData = useMemo(() => sparkline(48, 23), []);
  const diskData = useMemo(() => sparkline(41, 37), []);

  const cpuTone = metrics.cpu > 80 ? 'danger' : metrics.cpu > 60 ? 'warn' : 'ok';
  const memTone = metrics.memory > 80 ? 'danger' : metrics.memory > 65 ? 'warn' : 'ok';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="CPU Usage"
        value={`${metrics.cpu}%`}
        icon={<CpuIcon className="h-4 w-4" />}
        color="#6366f1"
        data={cpuData}
        status={cpuTone === 'ok' ? 'Normal' : cpuTone === 'warn' ? 'Elevated' : 'Critical'}
        tone={cpuTone} />
      
      <MetricCard
        label="Memory Usage"
        value={`${metrics.memory}%`}
        icon={<MemoryStickIcon className="h-4 w-4" />}
        color="#22c55e"
        data={memData}
        status={memTone === 'ok' ? 'Normal' : memTone === 'warn' ? 'Elevated' : 'Critical'}
        tone={memTone} />
      
      <MetricCard
        label="Disk Usage"
        value={`${metrics.disk}%`}
        icon={<HardDriveIcon className="h-4 w-4" />}
        color="#38bdf8"
        data={diskData}
        status="Normal"
        tone="ok" />
      
      <MetricCard
        label="Server Uptime"
        value={uptime}
        icon={<ClockIcon className="h-4 w-4" />}
        color="#f59e0b"
        status="Stable"
        tone="info" />
      
    </div>);

}