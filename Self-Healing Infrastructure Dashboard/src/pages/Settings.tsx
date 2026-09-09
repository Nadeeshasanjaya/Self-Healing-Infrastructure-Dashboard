import React, { useState } from 'react';
import { PlugZapIcon, SettingsIcon, SlidersHorizontalIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, Select } from '../components/ui/Controls';
import { StatusBadge } from '../components/ui/StatusBadge';
import { cx } from '../utils/format';

const INTEGRATIONS = [
{ name: 'Spring Boot Actuator', endpoint: 'http://api:8080/actuator', ready: true },
{ name: 'Prometheus', endpoint: 'http://prometheus:9090/api/v1', ready: true },
{ name: 'Docker Engine API', endpoint: 'unix:///var/run/docker.sock', ready: true },
{ name: 'AWS CloudWatch', endpoint: 'eu-central-1 · cloudwatch', ready: false },
{ name: 'Jenkins', endpoint: 'http://jenkins:8080/api/json', ready: false }];


function Toggle({ label, description, defaultOn }: {label: string;description: string;defaultOn?: boolean;}) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cx(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200',
          on ? 'border-emerald-500/40 bg-emerald-500/25' : 'border-line bg-base-750'
        )}>
        
        <span
          className={cx(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-slate-200 transition-all duration-200',
            on ? 'left-6' : 'left-1'
          )} />
        
      </button>
    </div>);

}

export function Settings() {
  const [interval, setIntervalValue] = useState('15');
  const [threshold, setThreshold] = useState('3');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Monitoring cadence, recovery policy and future backend integrations."
        actions={<Button variant="primary">Save changes</Button>} />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Monitoring" subtitle="Probe cadence and thresholds" icon={<SlidersHorizontalIcon className="h-4 w-4" />} />
          <div className="divide-y divide-line">
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-100">Health check interval</p>
                <p className="mt-0.5 text-xs text-slate-500">How often each target is probed.</p>
              </div>
              <Select
                label="Health check interval"
                value={interval}
                onChange={setIntervalValue}
                options={[
                { value: '5', label: '5 seconds' },
                { value: '15', label: '15 seconds' },
                { value: '30', label: '30 seconds' },
                { value: '60', label: '60 seconds' }]
                } />
              
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-100">Failure threshold</p>
                <p className="mt-0.5 text-xs text-slate-500">Consecutive failures before recovery triggers.</p>
              </div>
              <Select
                label="Failure threshold"
                value={threshold}
                onChange={setThreshold}
                options={[
                { value: '2', label: '2 failures' },
                { value: '3', label: '3 failures' },
                { value: '5', label: '5 failures' }]
                } />
              
            </div>
            <Toggle label="Collect container metrics" description="Pull cAdvisor stats for every running container." defaultOn />
            <Toggle label="Retain 30-day history" description="Store metric history for long-range dashboards." defaultOn />
          </div>
        </Card>

        <Card>
          <CardHeader title="Recovery Policy" subtitle="Automation behaviour" icon={<SettingsIcon className="h-4 w-4" />} />
          <div className="divide-y divide-line">
            <Toggle label="Automatic recovery" description="Let the engine act without operator approval." defaultOn />
            <Toggle label="Restart unhealthy containers" description="Issue a Docker restart when probes fail." defaultOn />
            <Toggle label="Escalate after 2 failed recoveries" description="Page the on-call engineer via webhook." defaultOn />
            <Toggle label="Auto rollback failed deploys" description="Revert to the last healthy image tag." />
            <Toggle label="Maintenance mode" description="Pause all automated recovery actions." />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Backend Integrations"
          subtitle="Mock data today — swap in these endpoints when the backend lands"
          icon={<PlugZapIcon className="h-4 w-4" />} />
        
        <ul className="divide-y divide-line">
          {INTEGRATIONS.map((i) =>
          <li key={i.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100">{i.name}</p>
                <p className="truncate font-mono text-xs text-slate-500">{i.endpoint}</p>
              </div>
              <StatusBadge tone={i.ready ? 'info' : 'neutral'} label={i.ready ? 'Mapped' : 'Planned'} dot={false} />
            </li>
          )}
        </ul>
      </Card>
    </div>);

}