import React, { useEffect, useMemo, useState } from 'react';
import { getBackendServices, type BackendService } from '../api/backend';

import { LayersIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { SearchInput, Segmented } from '../components/ui/Controls';
import { StatusBadge, toneForStatus } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { ApplicationHealth } from '../components/dashboard/ApplicationHealth';
import { useSystem } from '../contexts/SystemContext';
import { infraServices } from '../data/mockData';

type Layer = 'all' | 'platform' | 'application';

export function Services() {
  const { appServices } = useSystem();

const [backendServices, setBackendServices] = useState<BackendService[]>([]);
const [query, setQuery] = useState('');
const [layer, setLayer] = useState<Layer>('all');
const [detail, setDetail] = useState<{name: string;rows: [string, string][];} | null>(null);

useEffect(() => {
  const loadServices = async () => {
    try {
      const data = await getBackendServices();
      setBackendServices(data);
    } catch (error) {
      console.error('Failed to load backend services:', error);
    }
  };

  // Load immediately
  loadServices();

  // Refresh every 5 seconds
  const interval = setInterval(loadServices, 5000);

  // Stop the timer when leaving the page
  return () => clearInterval(interval);
}, []);

  const rows = useMemo(() => {
    const platform = infraServices.map((s) => ({
      id: s.id,
      name: s.name,
      layer: 'Platform',
      detail: s.description,
      status: s.status,
      responseMs: s.responseMs,
      extra: s.version,
      host: s.host,
      uptime: s.uptime
    }));
    const application = backendServices.map((s, index) => ({
  id: `backend-${index}`,
  name: s.name,
  layer: 'Application',
  detail: `GET /api/services`,
  status: s.status.toLowerCase(),
  responseMs: s.responseTime,
  extra: 'Live backend data',
  host: 'localhost:8081',
  uptime: 'Live'
}));
    return [...platform, ...application].
    filter((r) => layer === 'all' ? true : layer === 'platform' ? r.layer === 'Platform' : r.layer === 'Application').
    filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
  }, [backendServices, layer, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Every platform and application service tracked by the health registry."
        actions={
        <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search services…" className="w-56" />
            <Segmented
            label="Service layer"
            value={layer}
            onChange={(v: Layer) => setLayer(v)}
            options={[
            { value: 'all', label: 'All' },
            { value: 'platform', label: 'Platform' },
            { value: 'application', label: 'Application' }]
            } />
          
          </>
        } />
      

      <Card>
        <CardHeader title="Service Registry" subtitle={`${rows.length} services`} icon={<LayersIcon className="h-4 w-4" />} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-5 py-3 font-medium">Service</th>
                <th scope="col" className="px-5 py-3 font-medium">Layer</th>
                <th scope="col" className="px-5 py-3 font-medium">Endpoint / detail</th>
                <th scope="col" className="px-5 py-3 font-medium">Response</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) =>
              <tr
                key={`${r.layer}-${r.id}`}
                tabIndex={0}
                onClick={() =>
                setDetail({
                  name: r.name,
                  rows: [
                  ['Layer', r.layer],
                  ['Detail', r.detail],
                  ['Host', r.host],
                  ['Response time', `${r.responseMs} ms`],
                  ['Uptime', r.uptime],
                  ['Meta', r.extra]]

                })
                }
                onKeyDown={(e) =>
                e.key === 'Enter' &&
                setDetail({
                  name: r.name,
                  rows: [
                  ['Layer', r.layer],
                  ['Detail', r.detail],
                  ['Host', r.host],
                  ['Response time', `${r.responseMs} ms`],
                  ['Uptime', r.uptime],
                  ['Meta', r.extra]]

                })
                }
                className="cursor-pointer transition-colors hover:bg-white/[0.03]">
                
                  <td className="px-5 py-3.5 text-slate-100">{r.name}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{r.layer}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{r.detail}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-300">
                    {r.status === 'offline' ? '—' : `${r.responseMs} ms`}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge tone={toneForStatus(r.status)} label={r.status} pulse={r.status !== 'online'} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {rows.length === 0 ?
          <p className="px-5 py-10 text-center text-sm text-slate-500">No services match your search.</p> :
          null}
        </div>
      </Card>

      <ApplicationHealth />

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name ?? ''} subtitle="Service details">
        {detail ?
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {detail.rows.map(([k, v]) =>
          <div key={k} className="rounded-lg border border-line bg-base-800 px-4 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">{k}</dt>
                <dd className="mt-1 font-mono text-sm text-slate-200">{v}</dd>
              </div>
          )}
          </dl> :
        null}
      </Modal>
    </div>);

}
