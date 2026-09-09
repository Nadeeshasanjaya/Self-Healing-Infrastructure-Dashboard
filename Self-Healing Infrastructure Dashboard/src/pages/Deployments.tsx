import React, { useMemo, useState } from 'react';
import { RocketIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { SearchInput, Segmented } from '../components/ui/Controls';
import { DeploymentTable } from '../components/deployments/DeploymentTable';
import { deployments } from '../data/mockData';

type EnvFilter = 'all' | 'Production' | 'Staging' | 'Development';

export function Deployments() {
  const [env, setEnv] = useState<EnvFilter>('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
    deployments.
    filter((d) => env === 'all' ? true : d.environment === env).
    filter(
      (d) =>
      d.version.toLowerCase().includes(query.toLowerCase()) ||
      d.commit.toLowerCase().includes(query.toLowerCase())
    ),
    [env, query]
  );

  const success = deployments.filter((d) => d.status === 'SUCCESS').length;
  const rate = Math.round(success / deployments.length * 1000) / 10;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deployment History"
        description="Jenkins pipeline runs and the resulting release state per environment."
        actions={
        <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search version or commit…" className="w-60" />
            <Segmented
            label="Environment"
            value={env}
            onChange={(v: EnvFilter) => setEnv(v)}
            options={[
            { value: 'all', label: 'All' },
            { value: 'Production', label: 'Prod' },
            { value: 'Staging', label: 'Staging' },
            { value: 'Development', label: 'Dev' }]
            } />
          
          </>
        } />
      

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
        { label: 'Total deployments', value: String(deployments.length), tone: 'text-slate-100' },
        { label: 'Successful', value: String(success), tone: 'text-emerald-400' },
        { label: 'Failed / rolled back', value: String(deployments.length - success), tone: 'text-red-400' },
        { label: 'Success rate', value: `${rate}%`, tone: 'text-indigo-300' }].
        map((s) =>
        <Card key={s.label} className="p-5">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${s.tone}`}>{s.value}</p>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader title="Pipeline Runs" subtitle={`${rows.length} shown`} icon={<RocketIcon className="h-4 w-4" />} />
        <DeploymentTable deployments={rows} detailed />
      </Card>
    </div>);

}