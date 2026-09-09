import type { LucideIcon } from 'lucide-react';

export type ServiceStatus = 'online' | 'degraded' | 'offline' | 'recovering';

export interface InfraService {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: ServiceStatus;
  responseMs: number;
  lastChecked: string;
  version: string;
  host: string;
  uptime: string;
}

export interface AppService {
  id: string;
  name: string;
  endpoint: string;
  icon: LucideIcon;
  status: ServiceStatus;
  responseMs: number;
  successRate: number;
  lastChecked: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: 'RUNNING' | 'RESTARTING' | 'STOPPED';
  cpu: number;
  memoryMb: number;
  memoryLimitMb: number;
  restarts: number;
  uptime: string;
  ports: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'resolved';

export interface AlertItem {
  id: string;
  title: string;
  source: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
}

export type HealEventKind = 'detection' | 'warning' | 'recovery' | 'success';

export interface HealEvent {
  id: string;
  time: string;
  source: string;
  message: string;
  kind: HealEventKind;
}

export interface Deployment {
  id: string;
  version: string;
  commit: string;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  environment: 'Production' | 'Staging' | 'Development';
  author: string;
  duration: string;
  time: string;
  pipeline: string;
}

export interface Incident {
  id: string;
  service: string;
  trigger: string;
  detectedAt: string;
  resolvedAt: string;
  recoveryMode: 'Automatic' | 'Manual';
  action: string;
  durationSec: number;
  status: 'Recovered' | 'Escalated';
}

export interface DetectionRule {
  id: string;
  name: string;
  condition: string;
  threshold: string;
  action: string;
  enabled: boolean;
  triggered: number;
}

export interface SeriesPoint {
  t: string;
  [key: string]: string | number;
}