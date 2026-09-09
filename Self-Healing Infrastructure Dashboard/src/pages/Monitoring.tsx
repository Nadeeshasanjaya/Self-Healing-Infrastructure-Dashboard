import React, { useMemo, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Segmented, Select } from '../components/ui/Controls';
import { AreaTrend, BarTrend, ChartLegend, LineTrend } from '../components/charts/Charts';
import { buildSeries } from '../utils/series';

type Range = '1h' | '6h' | '24h' | '7d';

export function Monitoring() {
  const [range, setRange] = useState<Range>('6h');
  const [target, setTarget] = useState('all');

  const cfg = {
    '1h': { points: 24, step: 3 },
    '6h': { points: 36, step: 10 },
    '24h': { points: 48, step: 30 },
    '7d': { points: 42, step: 240 }
  }[range];

  const cpu = useMemo(
    () => buildSeries([{ key: 'cpu', base: 32, variance: 16 }], cfg.points, 3, cfg.step),
    [cfg]
  );
  const memory = useMemo(
    () => buildSeries([{ key: 'memory', base: 48, variance: 12 }], cfg.points, 9, cfg.step),
    [cfg]
  );
  const network = useMemo(
    () =>
    buildSeries(
      [
      { key: 'in', base: 184, variance: 70, max: 400 },
      { key: 'out', base: 96, variance: 45, max: 400 }],

      cfg.points,
      14,
      cfg.step
    ),
    [cfg]
  );
  const requests = useMemo(
    () => buildSeries([{ key: 'rps', base: 420, variance: 160, max: 900 }], cfg.points, 21, cfg.step),
    [cfg]
  );
  const latency = useMemo(
    () =>
    buildSeries(
      [
      { key: 'p50', base: 96, variance: 30, max: 600 },
      { key: 'p95', base: 240, variance: 90, max: 900 }],

      cfg.points,
      27,
      cfg.step
    ),
    [cfg]
  );
  const restarts = useMemo(
    () => buildSeries([{ key: 'restarts', base: 0.6, variance: 2, max: 4 }], 14, 33, 60),
    []
  );

  const charts = [
  {
    title: 'CPU usage over time',
    subtitle: 'node_cpu_seconds_total',
    node: <AreaTrend data={cpu} series={[{ key: 'cpu', name: 'CPU %', color: '#6366f1' }]} unit="%" domain={[0, 100]} />,
    legend: [{ key: 'cpu', name: 'CPU %', color: '#6366f1' }]
  },
  {
    title: 'Memory usage over time',
    subtitle: 'node_memory_MemAvailable_bytes',
    node:
    <AreaTrend data={memory} series={[{ key: 'memory', name: 'Memory %', color: '#22c55e' }]} unit="%" domain={[0, 100]} />,

    legend: [{ key: 'memory', name: 'Memory %', color: '#22c55e' }]
  },
  {
    title: 'Network traffic',
    subtitle: 'node_network_receive/transmit_bytes',
    node:
    <LineTrend
      data={network}
      series={[
      { key: 'in', name: 'Inbound MB/s', color: '#38bdf8' },
      { key: 'out', name: 'Outbound MB/s', color: '#a855f7' }]
      }
      unit=" MB/s" />,


    legend: [
    { key: 'in', name: 'Inbound MB/s', color: '#38bdf8' },
    { key: 'out', name: 'Outbound MB/s', color: '#a855f7' }]

  },
  {
    title: 'Request rate',
    subtitle: 'http_server_requests_seconds_count',
    node: <AreaTrend data={requests} series={[{ key: 'rps', name: 'Requests/s', color: '#f59e0b' }]} unit=" rps" />,
    legend: [{ key: 'rps', name: 'Requests/s', color: '#f59e0b' }]
  },
  {
    title: 'Response time',
    subtitle: 'http_server_requests_seconds (quantiles)',
    node:
    <LineTrend
      data={latency}
      series={[
      { key: 'p50', name: 'p50 ms', color: '#22c55e' },
      { key: 'p95', name: 'p95 ms', color: '#ef4444' }]
      }
      unit=" ms" />,


    legend: [
    { key: 'p50', name: 'p50 ms', color: '#22c55e' },
    { key: 'p95', name: 'p95 ms', color: '#ef4444' }]

  },
  {
    title: 'Container restart count',
    subtitle: 'docker_container_restart_total · last 14 intervals',
    node: <BarTrend data={restarts} series={[{ key: 'restarts', name: 'Restarts', color: '#818cf8' }]} />,
    legend: [{ key: 'restarts', name: 'Restarts', color: '#818cf8' }]
  }];


  return (
    <div>
      <PageHeader
        title="Monitoring"
        description="Prometheus-backed metrics across nodes, containers and the API gateway."
        actions={
        <>
            <Select
            label="Target"
            value={target}
            onChange={setTarget}
            options={[
            { value: 'all', label: 'All targets' },
            { value: 'api', label: 'api-container' },
            { value: 'mysql', label: 'mysql-container' },
            { value: 'nginx', label: 'nginx-container' }]
            } />
          
            <Segmented
            label="Time range"
            value={range}
            onChange={(v: Range) => setRange(v)}
            options={[
            { value: '1h', label: '1H' },
            { value: '6h', label: '6H' },
            { value: '24h', label: '24H' },
            { value: '7d', label: '7D' }]
            } />
          
          </>
        } />
      

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {charts.map((c) =>
        <Card key={c.title}>
            <CardHeader title={c.title} subtitle={c.subtitle} action={<ChartLegend series={c.legend} />} />
            <div className="p-4">{c.node}</div>
          </Card>
        )}
      </div>
    </div>);

}