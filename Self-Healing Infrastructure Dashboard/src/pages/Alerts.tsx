import React, { useMemo, useState } from 'react';
import { BellIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, SearchInput, Segmented } from '../components/ui/Controls';
import { AlertsPanel } from '../components/alerts/AlertsPanel';
import { useSystem } from '../contexts/SystemContext';
import type { AlertSeverity } from '../types';

type Filter = 'all' | AlertSeverity;

export function Alerts() {
  const { alerts, clearResolved } = useSystem();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    resolved: alerts.filter((a) => a.severity === 'resolved').length
  };

  const visible = useMemo(
    () =>
    alerts.
    filter((a) => filter === 'all' ? true : a.severity === filter).
    filter(
      (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.source.toLowerCase().includes(query.toLowerCase())
    ),
    [alerts, filter, query]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Alertmanager notifications routed from Prometheus rules and the recovery engine."
        actions={
        <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search alerts…" className="w-56" />
            <Button icon={<Trash2Icon className="h-3.5 w-3.5" />} onClick={clearResolved}>
              Clear resolved
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
        { label: 'Critical', value: counts.critical, tone: 'text-red-400', border: 'border-red-500/25' },
        { label: 'Warning', value: counts.warning, tone: 'text-amber-400', border: 'border-amber-500/25' },
        { label: 'Resolved', value: counts.resolved, tone: 'text-emerald-400', border: 'border-emerald-500/25' }].
        map((c) =>
        <Card key={c.label} className={`p-5 ${c.border}`}>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{c.label}</p>
            <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${c.tone}`}>{c.value}</p>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader
          title="Alert Feed"
          subtitle={`${visible.length} shown`}
          icon={<BellIcon className="h-4 w-4" />}
          action={
          <Segmented
            label="Alert filter"
            value={filter}
            onChange={(v: Filter) => setFilter(v)}
            options={[
            { value: 'all', label: 'All' },
            { value: 'critical', label: 'Critical' },
            { value: 'warning', label: 'Warning' },
            { value: 'resolved', label: 'Resolved' }]
            } />

          } />
        
        <AlertsPanel alerts={visible} />
      </Card>
    </div>);

}