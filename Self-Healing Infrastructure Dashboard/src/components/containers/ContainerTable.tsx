import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
import { StatusBadge, toneForStatus } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { useSystem } from '../../contexts/SystemContext';
import type { ContainerInfo } from '../../types';

export function ContainerTable({ filter = '', limit }: {filter?: string;limit?: number;}) {
  const { containers } = useSystem();
  const [selected, setSelected] = useState<ContainerInfo | null>(null);

  const rows = containers.
  filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())).
  slice(0, limit ?? containers.length);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-5 py-3 font-medium">Container</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
              <th scope="col" className="px-5 py-3 font-medium">CPU</th>
              <th scope="col" className="px-5 py-3 font-medium">Memory</th>
              <th scope="col" className="px-5 py-3 font-medium">Restarts</th>
              <th scope="col" className="px-5 py-3 font-medium">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) =>
            <tr
              key={c.id}
              onClick={() => setSelected(c)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(c)}
              className="cursor-pointer transition-colors hover:bg-white/[0.03]">
              
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <BoxIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    <div>
                      <p className="font-mono text-sm text-slate-100">{c.name}</p>
                      <p className="font-mono text-[11px] text-slate-600">{c.image}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <motion.div key={c.status} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
                    <StatusBadge tone={toneForStatus(c.status)} label={c.status} pulse={c.status !== 'RUNNING'} />
                  </motion.div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-9 font-mono text-xs tabular-nums text-slate-300">{c.cpu}%</span>
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-base-750">
                      <motion.span
                      className="block h-full rounded-full bg-indigo-500"
                      initial={false}
                      animate={{ width: `${Math.min(100, c.cpu * 4)}%` }} />
                    
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-300">
                  {c.memoryMb} MB
                  <span className="text-slate-600"> / {c.memoryLimitMb}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                  className={
                  c.restarts > 0 ?
                  'font-mono text-xs font-semibold text-amber-400' :
                  'font-mono text-xs text-slate-400'
                  }>
                  
                    {c.restarts}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{c.uptime}</td>
              </tr>
            )}
          </tbody>
        </table>
        {rows.length === 0 ?
        <p className="px-5 py-10 text-center text-sm text-slate-500">No containers match this filter.</p> :
        null}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        subtitle={selected?.image}>
        
        {selected ?
        <div className="space-y-4">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
            ['Status', selected.status],
            ['Ports', selected.ports],
            ['CPU', `${selected.cpu}%`],
            ['Memory', `${selected.memoryMb} MB / ${selected.memoryLimitMb} MB`],
            ['Restart count', String(selected.restarts)],
            ['Uptime', selected.uptime],
            ['Restart policy', 'unless-stopped'],
            ['Health check', 'CMD curl -f localhost/health · 15s']].
            map(([k, v]) =>
            <div key={k} className="rounded-lg border border-line bg-base-800 px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-wider text-slate-500">{k}</dt>
                  <dd className="mt-1 font-mono text-sm text-slate-200">{v}</dd>
                </div>
            )}
            </dl>
            <div className="rounded-lg border border-line bg-base-900 p-4">
              <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">Recent logs</p>
              <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-400">
{`[info]  started ${selected.name} (${selected.image})
[info]  health check passed in 42ms
[warn]  gc pause 118ms
[info]  handled 1,284 requests in last 60s`}
              </pre>
            </div>
          </div> :
        null}
      </Modal>
    </>);

}