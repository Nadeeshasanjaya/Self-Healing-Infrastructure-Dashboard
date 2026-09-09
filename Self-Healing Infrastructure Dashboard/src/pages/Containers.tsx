import React, { useMemo, useState } from 'react';
import { BoxIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { SearchInput } from '../components/ui/Controls';
import { StatusBadge } from '../components/ui/StatusBadge';
import { BarTrend } from '../components/charts/Charts';
import { ContainerTable } from '../components/containers/ContainerTable';
import { useSystem } from '../contexts/SystemContext';
import { buildSeries } from '../utils/series';

export function Containers() {
  const { containers } = useSystem();
  const [query, setQuery] = useState('');

  const running = containers.filter((c) => c.status === 'RUNNING').length;
  const restarts = containers.reduce((sum, c) => sum + c.restarts, 0);
  const memory = containers.reduce((sum, c) => sum + c.memoryMb, 0);

  const restartSeries = useMemo(
    () => buildSeries([{ key: 'restarts', base: 0.5, variance: 2, max: 4 }], 14, 41, 60),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Containers"
        description="Docker workloads, resource footprint and restart behaviour."
        actions={
        <>
            <SearchInput value={query} onChange={setQuery} placeholder="Filter containers…" className="w-56" />
            <StatusBadge tone={running === containers.length ? 'ok' : 'warn'} label={`${running}/${containers.length} running`} pulse />
          </>
        } />
      

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
        { label: 'Containers', value: String(containers.length), tone: 'text-slate-100' },
        { label: 'Running', value: String(running), tone: 'text-emerald-400' },
        { label: 'Total restarts', value: String(restarts), tone: 'text-amber-400' },
        { label: 'Memory allocated', value: `${memory} MB`, tone: 'text-indigo-300' }].
        map((s) =>
        <Card key={s.label} className="p-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${s.tone}`}>{s.value}</p>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader title="Container Monitoring" subtitle="cAdvisor metrics via Prometheus" icon={<BoxIcon className="h-4 w-4" />} />
        <ContainerTable filter={query} />
      </Card>

      <Card>
        <CardHeader title="Restart Activity" subtitle="Restarts per hour across all containers" />
        <div className="p-4">
          <BarTrend data={restartSeries} series={[{ key: 'restarts', name: 'Restarts', color: '#818cf8' }]} height={200} />
        </div>
      </Card>
    </div>);

}