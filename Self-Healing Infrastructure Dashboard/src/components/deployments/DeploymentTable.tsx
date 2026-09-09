import React from 'react';
import { GitCommitHorizontalIcon } from 'lucide-react';
import { StatusBadge, toneForStatus } from '../ui/StatusBadge';
import type { Deployment } from '../../types';

export function DeploymentTable({ deployments, detailed = false }: {deployments: Deployment[];detailed?: boolean;}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-wider text-slate-500">
            <th scope="col" className="px-5 py-3 font-medium">Version</th>
            <th scope="col" className="px-5 py-3 font-medium">Commit</th>
            <th scope="col" className="px-5 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 font-medium">Environment</th>
            {detailed ? <th scope="col" className="px-5 py-3 font-medium">Author</th> : null}
            {detailed ? <th scope="col" className="px-5 py-3 font-medium">Duration</th> : null}
            <th scope="col" className="px-5 py-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {deployments.map((d) =>
          <tr key={d.id} className="transition-colors hover:bg-white/[0.03]">
              <td className="px-5 py-3.5">
                <p className="font-mono text-sm text-slate-100">{d.version}</p>
                <p className="font-mono text-[11px] text-slate-600">pipeline {d.pipeline}</p>
              </td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 rounded border border-line bg-base-850 px-2 py-1 font-mono text-xs text-slate-300">
                  <GitCommitHorizontalIcon className="h-3.5 w-3.5 text-slate-500" />
                  {d.commit}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge tone={toneForStatus(d.status)} label={d.status.replace('_', ' ')} />
              </td>
              <td className="px-5 py-3.5 text-xs text-slate-300">{d.environment}</td>
              {detailed ? <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{d.author}</td> : null}
              {detailed ? <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{d.duration}</td> : null}
              <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{d.time}</td>
            </tr>
          )}
        </tbody>
      </table>
      {deployments.length === 0 ?
      <p className="px-5 py-10 text-center text-sm text-slate-500">No deployments match this filter.</p> :
      null}
    </div>);

}