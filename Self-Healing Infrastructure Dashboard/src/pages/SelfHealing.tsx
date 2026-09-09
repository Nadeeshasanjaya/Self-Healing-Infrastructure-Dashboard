import React, { useMemo, useState } from 'react';
import {
  ActivityIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  HeartPulseIcon,
  ListChecksIcon,
  PlayIcon,
  SearchCheckIcon,
  ShieldAlertIcon,
  WrenchIcon } from
'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, Segmented } from '../components/ui/Controls';
import { StatusBadge, toneForStatus } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { HealingFlow } from '../components/selfhealing/HealingFlow';
import { HealingStats } from '../components/selfhealing/HealingStats';
import { HealEventsTimeline } from '../components/selfhealing/HealEventsTimeline';
import { useSystem } from '../contexts/SystemContext';
import { detectionRules, incidents, recoveryActions } from '../data/mockData';
import type { Incident } from '../types';
import { cx } from '../utils/format';

const PIPELINE = [
{ label: 'Health Check', icon: ActivityIcon, detail: 'HTTP + TCP probes every 15s' },
{ label: 'Failure Detection', icon: ShieldAlertIcon, detail: '3 consecutive failures' },
{ label: 'Decision Engine', icon: BrainCircuitIcon, detail: 'Match rule → pick action' },
{ label: 'Recovery Action', icon: WrenchIcon, detail: 'Restart · reload · scale' },
{ label: 'Verification', icon: SearchCheckIcon, detail: 'Re-probe and confirm' }];


type Tab = 'rules' | 'actions' | 'incidents';

export function SelfHealing() {
  const { simulateFailure, simulating, stageIndex, systemStatus, healEvents } = useSystem();
  const [tab, setTab] = useState<Tab>('rules');
  const [incident, setIncident] = useState<Incident | null>(null);

  const activePipelineStep = useMemo(() => {
    if (!simulating) return -1;
    return [-1, 1, 2, 3, 4, 4][stageIndex];
  }, [simulating, stageIndex]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Self-Healing"
        description="Detection rules, recovery actions and the automated incident lifecycle."
        actions={
        <>
            <StatusBadge
            tone={systemStatus === 'HEALTHY' ? 'ok' : systemStatus === 'CRITICAL' ? 'danger' : 'warn'}
            label={`Engine ${simulating ? 'working' : 'armed'}`}
            pulse />
          
            <Button variant="danger" icon={<PlayIcon className="h-3.5 w-3.5" />} onClick={simulateFailure} disabled={simulating}>
              {simulating ? 'Simulation running…' : 'Simulate Failure'}
            </Button>
          </>
        } />
      

      <Card className="p-5">
        <div className="mb-5 flex items-center gap-2">
          <HeartPulseIcon className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">Recovery pipeline</h2>
        </div>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.map((p, i) => {
            const active = activePipelineStep === i;
            const done = activePipelineStep > i;
            return (
              <li
                key={p.label}
                className={cx(
                  'relative rounded-lg border px-4 py-4 transition-all duration-500',
                  active ?
                  'border-indigo-500/50 bg-indigo-500/10' :
                  done ?
                  'border-emerald-500/30 bg-emerald-500/[0.06]' :
                  'border-line bg-base-750/40'
                )}>
                
                <div className="flex items-center gap-2">
                  <p.icon
                    className={cx(
                      'h-4 w-4 transition-colors duration-500',
                      active ? 'text-indigo-300' : done ? 'text-emerald-400' : 'text-slate-500'
                    )} />
                  
                  <span className="font-mono text-[10px] text-slate-600">0{i + 1}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-100">{p.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{p.detail}</p>
                {active ?
                <span className="absolute right-3 top-3 h-2 w-2 animate-ping rounded-full bg-indigo-400" /> :
                null}
              </li>);

          })}
        </ol>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Live Recovery State"
            subtitle={simulating ? 'Simulated incident in progress' : 'Idle — awaiting failure signal'}
            icon={<HeartPulseIcon className="h-4 w-4" />} />
          
          <div className="p-4">
            <HealingFlow />
          </div>
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-100">Recovery statistics</h2>
            <HealingStats />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-base-750/50 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Automatic vs manual</p>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-base-800">
                  <span className="h-full bg-emerald-500" style={{ width: '91.7%' }} />
                  <span className="h-full bg-amber-500" style={{ width: '8.3%' }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-400">Automatic 91.7%</span>
                  <span className="text-amber-400">Manual 8.3%</span>
                </div>
              </div>
              <div className="rounded-lg border border-line bg-base-750/50 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Engine status</p>
                <ul className="mt-3 space-y-2 font-mono text-xs text-slate-400">
                  <li className="flex justify-between"><span>Watchers</span><span className="text-slate-200">7 targets</span></li>
                  <li className="flex justify-between"><span>Active rules</span><span className="text-slate-200">4 / 5</span></li>
                  <li className="flex justify-between"><span>Cooldown</span><span className="text-slate-200">60s</span></li>
                  <li className="flex justify-between"><span>Escalation</span><span className="text-slate-200">PagerDuty</span></li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Recent Self-Healing Events"
              subtitle="Newest first"
              icon={<ListChecksIcon className="h-4 w-4" />} />
            
            <HealEventsTimeline events={healEvents} limit={8} />
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Engine Configuration"
          subtitle="Rules, actions and incident history"
          action={
          <Segmented
            label="Configuration tabs"
            value={tab}
            onChange={(v: Tab) => setTab(v)}
            options={[
            { value: 'rules', label: 'Detection rules' },
            { value: 'actions', label: 'Recovery actions' },
            { value: 'incidents', label: 'Incidents' }]
            } />

          } />
        

        {tab === 'rules' ?
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3 font-medium">Rule</th>
                  <th scope="col" className="px-5 py-3 font-medium">Condition</th>
                  <th scope="col" className="px-5 py-3 font-medium">Threshold</th>
                  <th scope="col" className="px-5 py-3 font-medium">Action</th>
                  <th scope="col" className="px-5 py-3 font-medium">Triggered</th>
                  <th scope="col" className="px-5 py-3 font-medium">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {detectionRules.map((r) =>
              <tr key={r.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5 text-slate-100">{r.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{r.condition}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{r.threshold}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-300">{r.action}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{r.triggered}×</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={r.enabled ? 'ok' : 'neutral'} label={r.enabled ? 'Enabled' : 'Disabled'} />
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div> :
        null}

        {tab === 'actions' ?
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {recoveryActions.map((a) =>
          <div key={a.id} className="rounded-lg border border-line bg-base-750/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-100">{a.name}</p>
                  <StatusBadge tone={a.successRate === 100 ? 'ok' : 'warn'} label={`${a.successRate}%`} dot={false} />
                </div>
                <p className="mt-1 font-mono text-[11px] text-slate-500">{a.runtime}</p>
                <div className="mt-3 flex gap-4 font-mono text-xs text-slate-400">
                  <span>{a.runs} runs</span>
                  <span>avg {a.avgSec}s</span>
                </div>
              </div>
          )}
          </div> :
        null}

        {tab === 'incidents' ?
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3 font-medium">Service</th>
                  <th scope="col" className="px-5 py-3 font-medium">Trigger</th>
                  <th scope="col" className="px-5 py-3 font-medium">Detected</th>
                  <th scope="col" className="px-5 py-3 font-medium">Mode</th>
                  <th scope="col" className="px-5 py-3 font-medium">Duration</th>
                  <th scope="col" className="px-5 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {incidents.map((i) =>
              <tr
                key={i.id}
                tabIndex={0}
                onClick={() => setIncident(i)}
                onKeyDown={(e) => e.key === 'Enter' && setIncident(i)}
                className="cursor-pointer transition-colors hover:bg-white/[0.03]">
                
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-100">{i.service}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{i.trigger}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{i.detectedAt}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={i.recoveryMode === 'Automatic' ? 'info' : 'warn'} label={i.recoveryMode} dot={false} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{i.durationSec}s</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={toneForStatus(i.status)} label={i.status} />
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div> :
        null}
      </Card>

      <Modal
        open={Boolean(incident)}
        onClose={() => setIncident(null)}
        title={incident ? `Incident · ${incident.service}` : ''}
        subtitle={incident?.trigger}
        footer={
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
            Resolved by the recovery engine without operator input.
          </div>
        }>
        
        {incident ?
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
          ['Detected at', incident.detectedAt],
          ['Resolved at', incident.resolvedAt],
          ['Recovery mode', incident.recoveryMode],
          ['Action taken', incident.action],
          ['Duration', `${incident.durationSec}s`],
          ['Result', incident.status]].
          map(([k, v]) =>
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