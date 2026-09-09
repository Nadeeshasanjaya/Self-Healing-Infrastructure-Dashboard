import React, { useMemo } from 'react';
import { BoxIcon, CloudIcon, CpuIcon, HardDriveIcon, MemoryStickIcon, NetworkIcon, ServerIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AreaTrend, ChartLegend } from '../components/charts/Charts';
import { InfrastructureHealth } from '../components/dashboard/InfrastructureHealth';
import { useSystem } from '../contexts/SystemContext';
import { ec2Instance } from '../data/mockData';
import { buildSeries } from '../utils/series';

function Meter({ label, value, sub, icon }: {label: string;value: number;sub: string;icon: React.ReactNode;}) {
  const tone = value > 80 ? 'bg-red-500' : value > 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="rounded-lg border border-line bg-base-750/50 p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
          {icon}
          {label}
        </span>
        <span className="font-mono text-sm tabular-nums text-slate-100">{value}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-800">
        <div className={`h-full rounded-full transition-all duration-700 ${tone}`} style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 font-mono text-[11px] text-slate-600">{sub}</p>
    </div>);

}

export function Infrastructure() {
  const { metrics, uptime } = useSystem();
  const net = useMemo(
    () =>
    buildSeries(
      [
      { key: 'in', base: 184, variance: 60, max: 400 },
      { key: 'out', base: 96, variance: 40, max: 400 }],

      30,
      18,
      10
    ),
    []
  );
  const netSeries = [
  { key: 'in', name: 'Inbound MB/s', color: '#38bdf8' },
  { key: 'out', name: 'Outbound MB/s', color: '#a855f7' }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Infrastructure"
        description="Compute, runtime and platform components backing the Self-HealOps stack."
        actions={<StatusBadge tone="ok" label="7 / 7 Online" pulse />} />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="AWS EC2 Instance"
            subtitle={`${ec2Instance.instanceId} · ${ec2Instance.type}`}
            icon={<CloudIcon className="h-4 w-4" />}
            action={<StatusBadge tone="ok" label={ec2Instance.state} pulse />} />
          
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
            ['Region / AZ', ec2Instance.region],
            ['AMI', ec2Instance.ami],
            ['Public IP', ec2Instance.publicIp],
            ['Private IP', ec2Instance.privateIp],
            ['Security group', ec2Instance.securityGroup],
            ['Key pair', ec2Instance.keyPair],
            ['vCPU', `${ec2Instance.vcpu} cores`],
            ['RAM', `${ec2Instance.ramGb} GB`],
            ['Launched', ec2Instance.launchedAt]].
            map(([k, v]) =>
            <div key={k} className="rounded-lg border border-line bg-base-800 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">{k}</p>
                <p className="mt-1 truncate font-mono text-xs text-slate-200" title={v}>
                  {v}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Resource Pressure" subtitle="node_exporter · 15s scrape" icon={<ServerIcon className="h-4 w-4" />} />
          <div className="space-y-3 p-5">
            <Meter label="CPU" value={metrics.cpu} sub={`${ec2Instance.vcpu} vCPU · load 0.42`} icon={<CpuIcon className="h-3.5 w-3.5" />} />
            <Meter
              label="RAM"
              value={metrics.memory}
              sub={`${Math.round(metrics.memory / 100 * ec2Instance.ramGb * 10) / 10} GB / ${ec2Instance.ramGb} GB`}
              icon={<MemoryStickIcon className="h-3.5 w-3.5" />} />
            
            <Meter
              label="Disk"
              value={metrics.disk}
              sub={`${ec2Instance.diskUsedGb} GB / ${ec2Instance.diskGb} GB (gp3)`}
              icon={<HardDriveIcon className="h-3.5 w-3.5" />} />
            
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Network Throughput"
            subtitle="eth0 · last 5 hours"
            icon={<NetworkIcon className="h-4 w-4" />}
            action={<ChartLegend series={netSeries} />} />
          
          <div className="p-4">
            <AreaTrend data={net} series={netSeries} unit=" MB/s" height={220} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Docker Status" subtitle="Engine 25.0.3" icon={<BoxIcon className="h-4 w-4" />} action={<StatusBadge tone="ok" label="Running" pulse />} />
          <ul className="divide-y divide-line">
            {[
            ['Containers running', '7'],
            ['Containers stopped', '0'],
            ['Images', '14'],
            ['Volumes', '6'],
            ['Networks', '3'],
            ['Storage driver', 'overlay2'],
            ['Engine uptime', uptime]].
            map(([k, v]) =>
            <li key={k} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-400">{k}</span>
                <span className="font-mono text-slate-200">{v}</span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <InfrastructureHealth />
    </div>);

}