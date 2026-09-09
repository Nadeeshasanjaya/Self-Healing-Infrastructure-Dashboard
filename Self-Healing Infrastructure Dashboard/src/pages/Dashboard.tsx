import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BellIcon, BoxIcon, HeartPulseIcon, HistoryIcon, ZapIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Segmented } from '../components/ui/Controls';
import { MetricCards } from '../components/dashboard/MetricCards';
import { InfrastructureHealth } from '../components/dashboard/InfrastructureHealth';
import { ApplicationHealth } from '../components/dashboard/ApplicationHealth';
import { HealingFlow } from '../components/selfhealing/HealingFlow';
import { HealingStats } from '../components/selfhealing/HealingStats';
import { HealEventsTimeline } from '../components/selfhealing/HealEventsTimeline';
import { ContainerTable } from '../components/containers/ContainerTable';
import { AlertsPanel } from '../components/alerts/AlertsPanel';
import { DeploymentTable } from '../components/deployments/DeploymentTable';
import { AreaTrend, ChartLegend } from '../components/charts/Charts';
import { useSystem } from '../contexts/SystemContext';
import { deployments } from '../data/mockData';
import { buildSeries } from '../utils/series';

type Range = '1h' | '6h' | '24h';

export function Dashboard() {
  const { healEvents, alerts } = useSystem();
  const [range, setRange] = useState<Range>('6h');

  const points = range === '1h' ? 20 : range === '6h' ? 32 : 48;
  const step = range === '1h' ? 3 : range === '6h' ? 12 : 30;

  const usage = useMemo(
    () =>
    buildSeries(
      [
      { key: 'cpu', base: 32, variance: 14 },
      { key: 'memory', base: 48, variance: 10 }],

      points,
      5,
      step
    ),
    [points, step]
  );

  const usageSeries = [
  { key: 'cpu', name: 'CPU %', color: '#6366f1' },
  { key: 'memory', name: 'Memory %', color: '#22c55e' }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Overview"
        description="Live health of infrastructure, applications and the automated recovery engine."
        actions={
        <Segmented
          label="Time range"
          value={range}
          onChange={(v: Range) => setRange(v)}
          options={[
          { value: '1h', label: '1H' },
          { value: '6h', label: '6H' },
          { value: '24h', label: '24H' }]
          } />

        } />
      

      <MetricCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InfrastructureHealth />
        </div>
        <ApplicationHealth />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader
            title="Self-Healing Activity"
            subtitle="Recovery pipeline state machine"
            icon={<HeartPulseIcon className="h-4 w-4" />}
            action={
            <Link
              to="/self-healing"
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 hover:text-indigo-200">
              
                Open <ArrowRightIcon className="h-3 w-3" />
              </Link>
            } />
          
          <div className="p-4">
            <HealingFlow />
          </div>
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Recovery Performance</h2>
                <p className="text-xs text-slate-500">Rolling 30-day window</p>
              </div>
              <ZapIcon className="h-4 w-4 text-amber-400" />
            </div>
            <HealingStats />
          </Card>

          <Card>
            <CardHeader
              title="Recent Self-Healing Events"
              subtitle="Detection · warning · recovery · success"
              icon={<HistoryIcon className="h-4 w-4" />} />
            
            <HealEventsTimeline events={healEvents} limit={6} />
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Resource Utilisation"
          subtitle={`CPU and memory over the last ${range}`}
          action={<ChartLegend series={usageSeries} />} />
        
        <div className="p-4">
          <AreaTrend data={usage} series={usageSeries} unit="%" domain={[0, 100]} height={240} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Container Monitoring"
            subtitle="Docker Engine 25.0.3"
            icon={<BoxIcon className="h-4 w-4" />}
            action={
            <Link
              to="/containers"
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 hover:text-indigo-200">
              
                All containers <ArrowRightIcon className="h-3 w-3" />
              </Link>
            } />
          
          <ContainerTable limit={4} />
        </Card>

        <Card>
          <CardHeader
            title="Active Alerts"
            subtitle={`${alerts.filter((a) => a.severity !== 'resolved').length} open`}
            icon={<BellIcon className="h-4 w-4" />}
            action={
            <Link
              to="/alerts"
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 hover:text-indigo-200">
              
                View <ArrowRightIcon className="h-3 w-3" />
              </Link>
            } />
          
          <AlertsPanel alerts={alerts.slice(0, 4)} compact />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Deployment History"
          subtitle="Jenkins pipeline selfhealops/main"
          icon={<HistoryIcon className="h-4 w-4" />}
          action={
          <Link
            to="/deployments"
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 hover:text-indigo-200">
            
              Full history <ArrowRightIcon className="h-3 w-3" />
            </Link>
          } />
        
        <DeploymentTable deployments={deployments.slice(0, 4)} />
      </Card>
    </div>);

}