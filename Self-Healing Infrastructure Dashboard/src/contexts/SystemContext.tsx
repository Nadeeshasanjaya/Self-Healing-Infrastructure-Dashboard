import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  appServices as baseAppServices,
  containers as baseContainers,
  initialAlerts,
  initialHealEvents } from
'../data/mockData';
import type { AlertItem, AppService, ContainerInfo, HealEvent } from '../types';
import { clock } from '../utils/format';

export const HEAL_STAGES = [
  'NORMAL',
  'FAILURE DETECTED',
  'RECOVERY INITIATED',
  'CONTAINER RESTARTED',
  'HEALTH CHECK PASSED',
  'SYSTEM RECOVERED'
] as const;

export type HealStage = (typeof HEAL_STAGES)[number];

export type SystemStatus = 'HEALTHY' | 'CRITICAL' | 'RECOVERING';

interface Metrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface SystemContextValue {
  metrics: Metrics;
  uptime: string;
  systemStatus: SystemStatus;
  stageIndex: number;
  simulating: boolean;
  appServices: AppService[];
  containers: ContainerInfo[];
  alerts: AlertItem[];
  healEvents: HealEvent[];
  stats: {
    totalIncidents: number;
    autoRecovered: number;
    manual: number;
    successRate: number;
    avgRecoverySec: number;
  };
  lastRefresh: string;
  simulateFailure: () => void;
  refresh: () => void;
  acknowledgeAlert: (id: string) => void;
  clearResolved: () => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

const BASE_METRICS: Metrics = { cpu: 32, memory: 48, disk: 41, network: 62 };

let eventSeq = 100;

export function SystemProvider({ children }: {children: React.ReactNode;}) {
  const [metrics, setMetrics] = useState<Metrics>(BASE_METRICS);
  const [stageIndex, setStageIndex] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [appServices, setAppServices] = useState<AppService[]>(baseAppServices);
  const [containers, setContainers] = useState<ContainerInfo[]>(baseContainers);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [healEvents, setHealEvents] = useState<HealEvent[]>(initialHealEvents);
  const [lastRefresh, setLastRefresh] = useState(clock());
  const [stats, setStats] = useState({
    totalIncidents: 12,
    autoRecovered: 11,
    manual: 1,
    successRate: 91.7,
    avgRecoverySec: 18
  });
  const timers = useRef<number[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

  const setApi = useCallback((status: AppService['status'], responseMs: number) => {
    setAppServices((prev) =>
    prev.map((s) => s.id === 'api' ? { ...s, status, responseMs, lastChecked: 'just now' } : s)
    );
  }, []);

  const checkApiHealth = useCallback(async () => {
    const url = `${API_BASE_URL}/health`;
    try {
      const start = performance.now();
      const response = await fetch(url, { cache: 'no-store' });
      const responseMs = Math.round(performance.now() - start);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      setApi('online', responseMs);
      return true;
    } catch (error) {
      setApi('offline', 0);
      return false;
    }
  }, [API_BASE_URL, setApi]);

  useEffect(() => {
    void checkApiHealth();
  }, [checkApiHealth]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((m) => ({
        cpu: jitter(m.cpu, simulating && stageIndex > 0 && stageIndex < 4 ? 88 : BASE_METRICS.cpu),
        memory: jitter(m.memory, simulating && stageIndex > 0 && stageIndex < 4 ? 74 : BASE_METRICS.memory),
        disk: jitter(m.disk, BASE_METRICS.disk, 0.4),
        network: jitter(m.network, BASE_METRICS.network)
      }));
    }, 2000);
    return () => window.clearInterval(id);
  }, [simulating, stageIndex]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const pushEvent = useCallback((source: string, message: string, kind: HealEvent['kind']) => {
    eventSeq += 1;
    setHealEvents((prev) => [{ id: `e${eventSeq}`, time: clock(), source, message, kind }, ...prev].slice(0, 40));
  }, []);

  const setApiContainer = useCallback((patch: Partial<ContainerInfo>) => {
    setContainers((prev) => prev.map((c) => c.name === 'api-container' ? { ...c, ...patch } : c));
  }, []);

  const simulateFailure = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const schedule = (delay: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, delay));
    };

    // 1 & 2 — API down, status critical
    setStageIndex(1);
    setApi('offline', 0);
    setApiContainer({ status: 'STOPPED', cpu: 0 });
    pushEvent('API Container', 'Failure detected — health endpoint returned 503', 'detection');
    eventSeq += 1;
    setAlerts((prev) => [
    {
      id: `sim-${eventSeq}`,
      title: 'Container stopped',
      source: 'api-container',
      message: 'Simulated failure — api-container stopped responding to health probes.',
      severity: 'critical',
      timestamp: clock(),
      acknowledged: false
    },
    ...prev]
    );

    // 3/4 — recovery initiated
    schedule(2200, () => {
      setStageIndex(2);
      pushEvent('Recovery Engine', 'Restart initiated — policy "restart-on-unhealthy"', 'warning');
    });

    // 5 — container restarting
    schedule(4200, () => {
      setStageIndex(3);
      setApi('recovering', 0);
      setApiContainer({ status: 'RESTARTING' });
      pushEvent('API Container', 'Container restarting — pulling last healthy image', 'recovery');
    });

    // 6 — health check running
    schedule(6400, () => {
      setStageIndex(4);
      pushEvent('Health Check', 'Passed — 3 consecutive 200 OK responses', 'success');
    });

    // 7 & 8 — API online, recovery success
    schedule(8400, () => {
      setStageIndex(5);
      setApi('online', 96);
      setContainers((prev) =>
      prev.map((c) =>
      c.name === 'api-container' ?
      { ...c, status: 'RUNNING', cpu: 12, restarts: c.restarts + 1, uptime: '0d 00h' } :
      c
      )
      );
      pushEvent('System', 'Fully recovered — traffic restored to api-container', 'success');
      eventSeq += 1;
      setAlerts((prev) => [
      {
        id: `sim-ok-${eventSeq}`,
        title: 'Recovery successful',
        source: 'recovery-engine',
        message: 'api-container restarted and passed health check automatically.',
        severity: 'resolved',
        timestamp: clock(),
        acknowledged: false
      },
      ...prev]
      );
      setStats((s) => {
        const totalIncidents = s.totalIncidents + 1;
        const autoRecovered = s.autoRecovered + 1;
        return {
          totalIncidents,
          autoRecovered,
          manual: s.manual,
          successRate: Math.round(autoRecovered / totalIncidents * 1000) / 10,
          avgRecoverySec: Math.round((s.avgRecoverySec * s.totalIncidents + 8) / totalIncidents * 10) / 10
        };
      });
    });

    schedule(11500, () => {
      setSimulating(false);
      setStageIndex(0);
    });
  }, [pushEvent, setApi, setApiContainer, simulating]);

  const refresh = useCallback(() => {
    setLastRefresh(clock());
    setMetrics((m) => ({
      cpu: jitter(m.cpu, BASE_METRICS.cpu),
      memory: jitter(m.memory, BASE_METRICS.memory),
      disk: jitter(m.disk, BASE_METRICS.disk, 0.4),
      network: jitter(m.network, BASE_METRICS.network)
    }));
    void checkApiHealth();
  }, [checkApiHealth]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const clearResolved = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => a.severity !== 'resolved'));
  }, []);

  const systemStatus: SystemStatus =
  stageIndex === 0 ? 'HEALTHY' : stageIndex === 1 ? 'CRITICAL' : stageIndex === 5 ? 'HEALTHY' : 'RECOVERING';

  const value = useMemo<SystemContextValue>(
    () => ({
      metrics,
      uptime: '12d 04h 32m',
      systemStatus,
      stageIndex,
      simulating,
      appServices,
      containers,
      alerts,
      healEvents,
      stats,
      lastRefresh,
      simulateFailure,
      refresh,
      acknowledgeAlert,
      clearResolved
    }),
    [
    metrics,
    systemStatus,
    stageIndex,
    simulating,
    appServices,
    containers,
    alerts,
    healEvents,
    stats,
    lastRefresh,
    simulateFailure,
    refresh,
    acknowledgeAlert,
    clearResolved]

  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

function jitter(current: number, target: number, factor = 1): number {
  const next = current + (target - current) * 0.4 + (Math.random() - 0.5) * 4 * factor;
  return Math.round(Math.min(99, Math.max(1, next)));
}

export function useSystem(): SystemContextValue {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
}