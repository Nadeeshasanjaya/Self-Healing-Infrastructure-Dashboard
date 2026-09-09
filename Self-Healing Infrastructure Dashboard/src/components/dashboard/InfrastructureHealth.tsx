import React, { useEffect, useState } from 'react';
import { ServerCogIcon } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { StatusBadge, toneForStatus } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import {
  getBackendServices,
  type BackendService
} from '../../api/backend';

export function InfrastructureHealth() {
  const [services, setServices] = useState<BackendService[]>([]);
  const [selected, setSelected] = useState<BackendService | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getBackendServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to load infrastructure health:', error);
      }
    };

    // Load immediately
    loadServices();

    // Refresh every 5 seconds
    const interval = setInterval(loadServices, 5000);

    // Cleanup when component is removed
    return () => clearInterval(interval);
  }, []);

  const onlineCount = services.filter(
    (service) => service.status.toLowerCase() === 'online'
  ).length;

  return (
    <>
      <Card>
        <CardHeader
          title="Infrastructure Health"
          subtitle={`${services.length} components monitored · Live backend checks`}
          icon={<ServerCogIcon className="h-4 w-4" />}
          action={
            <StatusBadge
              tone={onlineCount === services.length ? 'ok' : 'warning'}
              label={`${onlineCount}/${services.length} Online`}
            />
          }
        />

        <ul className="divide-y divide-line">
          {services.map((service, index) => (
            <li key={`${service.name}-${index}`}>
              <button
                type="button"
                onClick={() => setSelected(service)}
                className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-base-750 text-slate-300">
                  <ServerCogIcon className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {service.name}
                  </span>

                  <span className="block truncate text-xs text-slate-500">
                    Live health check
                  </span>
                </span>

                <span className="hidden w-24 text-right font-mono text-xs text-slate-400 sm:block">
                  {service.responseTime} ms
                </span>

                <StatusBadge
                  tone={toneForStatus(service.status.toLowerCase())}
                  label={service.status}
                  pulse={service.status.toLowerCase() !== 'online'}
                />
              </button>
            </li>
          ))}
        </ul>

        {services.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Loading infrastructure health...
          </p>
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle="Live service health"
      >
        {selected && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['Status', selected.status],
              ['Response time', `${selected.responseTime} ms`],
              ['Source', 'Spring Boot backend'],
              ['Refresh interval', '5 seconds']
            ].map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-line bg-base-800 px-4 py-3"
              >
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  {key}
                </dt>

                <dd className="mt-1 font-mono text-sm text-slate-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </>
  );
}