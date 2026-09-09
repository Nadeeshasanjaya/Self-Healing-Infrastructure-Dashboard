import {
  ActivityIcon,
  BoxIcon,
  CloudIcon,
  DatabaseIcon,
  GaugeIcon,
  GlobeIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  MonitorIcon,
  ServerIcon,
  ShieldCheckIcon,
  TerminalIcon,
  WorkflowIcon } from
'lucide-react';
import type {
  AlertItem,
  AppService,
  ContainerInfo,
  Deployment,
  DetectionRule,
  HealEvent,
  Incident,
  InfraService } from
'../types';

export const infraServices: InfraService[] = [
{
  id: 'ec2',
  name: 'AWS EC2',
  description: 't3.large · eu-central-1a',
  icon: CloudIcon,
  status: 'online',
  responseMs: 24,
  lastChecked: '3s ago',
  version: 'Amazon Linux 2023',
  host: '10.0.1.14',
  uptime: '12d 04h 32m'
},
{
  id: 'docker',
  name: 'Docker Engine',
  description: '7 containers running',
  icon: BoxIcon,
  status: 'online',
  responseMs: 11,
  lastChecked: '3s ago',
  version: '25.0.3',
  host: 'unix:///var/run/docker.sock',
  uptime: '12d 04h 30m'
},
{
  id: 'nginx',
  name: 'Nginx',
  description: 'Reverse proxy · TLS termination',
  icon: GlobeIcon,
  status: 'online',
  responseMs: 8,
  lastChecked: '4s ago',
  version: '1.25.4',
  host: '10.0.1.14:443',
  uptime: '4d 12h 05m'
},
{
  id: 'mysql',
  name: 'MySQL',
  description: 'Primary · 42 connections',
  icon: DatabaseIcon,
  status: 'online',
  responseMs: 17,
  lastChecked: '4s ago',
  version: '8.0.36',
  host: '10.0.2.21:3306',
  uptime: '12d 04h 28m'
},
{
  id: 'jenkins',
  name: 'Jenkins',
  description: 'CI/CD · 3 agents idle',
  icon: WorkflowIcon,
  status: 'online',
  responseMs: 62,
  lastChecked: '6s ago',
  version: '2.452 LTS',
  host: '10.0.3.9:8080',
  uptime: '9d 18h 11m'
},
{
  id: 'prometheus',
  name: 'Prometheus',
  description: 'Scraping 14 targets',
  icon: ActivityIcon,
  status: 'online',
  responseMs: 21,
  lastChecked: '2s ago',
  version: '2.51.1',
  host: '10.0.3.10:9090',
  uptime: '9d 18h 09m'
},
{
  id: 'grafana',
  name: 'Grafana',
  description: '6 dashboards · 2 alert rules',
  icon: GaugeIcon,
  status: 'online',
  responseMs: 35,
  lastChecked: '5s ago',
  version: '10.4.1',
  host: '10.0.3.11:3000',
  uptime: '9d 18h 08m'
}];


export const appServices: AppService[] = [
{
  id: 'api',
  name: 'Backend API',
  endpoint: 'GET /api/v1/health',
  icon: ServerIcon,
  status: 'online',
  responseMs: 96,
  successRate: 99.94,
  lastChecked: '2s ago'
},
{
  id: 'frontend',
  name: 'Frontend',
  endpoint: 'GET /',
  icon: MonitorIcon,
  status: 'online',
  responseMs: 142,
  successRate: 99.99,
  lastChecked: '2s ago'
},
{
  id: 'database',
  name: 'Database',
  endpoint: 'SELECT 1',
  icon: DatabaseIcon,
  status: 'online',
  responseMs: 17,
  successRate: 100,
  lastChecked: '3s ago'
},
{
  id: 'auth',
  name: 'Authentication',
  endpoint: 'POST /auth/introspect',
  icon: KeyRoundIcon,
  status: 'online',
  responseMs: 74,
  successRate: 99.87,
  lastChecked: '3s ago'
}];


export const containers: ContainerInfo[] = [
{
  id: 'c1',
  name: 'api-container',
  image: 'selfhealops/api:1.4.2',
  status: 'RUNNING',
  cpu: 12,
  memoryMb: 256,
  memoryLimitMb: 1024,
  restarts: 2,
  uptime: '4d 12h',
  ports: '8080:8080'
},
{
  id: 'c2',
  name: 'mysql-container',
  image: 'mysql:8.0.36',
  status: 'RUNNING',
  cpu: 8,
  memoryMb: 512,
  memoryLimitMb: 2048,
  restarts: 0,
  uptime: '4d 12h',
  ports: '3306:3306'
},
{
  id: 'c3',
  name: 'nginx-container',
  image: 'nginx:1.25.4-alpine',
  status: 'RUNNING',
  cpu: 2,
  memoryMb: 64,
  memoryLimitMb: 256,
  restarts: 0,
  uptime: '4d 12h',
  ports: '80:80, 443:443'
},
{
  id: 'c4',
  name: 'prometheus-container',
  image: 'prom/prometheus:2.51.1',
  status: 'RUNNING',
  cpu: 5,
  memoryMb: 348,
  memoryLimitMb: 1024,
  restarts: 1,
  uptime: '9d 18h',
  ports: '9090:9090'
},
{
  id: 'c5',
  name: 'grafana-container',
  image: 'grafana/grafana:10.4.1',
  status: 'RUNNING',
  cpu: 3,
  memoryMb: 192,
  memoryLimitMb: 512,
  restarts: 0,
  uptime: '9d 18h',
  ports: '3000:3000'
},
{
  id: 'c6',
  name: 'jenkins-container',
  image: 'jenkins/jenkins:2.452-lts',
  status: 'RUNNING',
  cpu: 9,
  memoryMb: 768,
  memoryLimitMb: 2048,
  restarts: 0,
  uptime: '9d 18h',
  ports: '8081:8080'
},
{
  id: 'c7',
  name: 'redis-container',
  image: 'redis:7.2-alpine',
  status: 'RUNNING',
  cpu: 1,
  memoryMb: 48,
  memoryLimitMb: 256,
  restarts: 0,
  uptime: '4d 12h',
  ports: '6379:6379'
}];


export const initialAlerts: AlertItem[] = [
{
  id: 'a1',
  title: 'High CPU usage',
  source: 'api-container',
  message: 'CPU held above 85% for 4 minutes on api-container.',
  severity: 'warning',
  timestamp: '21:38:02',
  acknowledged: false
},
{
  id: 'a2',
  title: 'Container stopped',
  source: 'docker-engine',
  message: 'api-container exited with code 137 (OOMKilled).',
  severity: 'critical',
  timestamp: '21:42:15',
  acknowledged: false
},
{
  id: 'a3',
  title: 'Database connection failure',
  source: 'mysql-container',
  message: 'Connection pool exhausted — 3 retries failed before recovery.',
  severity: 'critical',
  timestamp: '19:04:51',
  acknowledged: true
},
{
  id: 'a4',
  title: 'High memory usage',
  source: 'jenkins-container',
  message: 'Heap usage reached 82% of the configured 2 GB limit.',
  severity: 'warning',
  timestamp: '18:12:37',
  acknowledged: false
},
{
  id: 'a5',
  title: 'Recovery successful',
  source: 'recovery-engine',
  message: 'api-container restarted and passed health check in 11s.',
  severity: 'resolved',
  timestamp: '21:42:26',
  acknowledged: true
},
{
  id: 'a6',
  title: 'Disk pressure warning',
  source: 'aws-ec2',
  message: '/var/lib/docker reached 78% of allocated volume.',
  severity: 'warning',
  timestamp: '15:47:09',
  acknowledged: true
},
{
  id: 'a7',
  title: 'Recovery successful',
  source: 'recovery-engine',
  message: 'nginx-container reloaded after failed config validation.',
  severity: 'resolved',
  timestamp: '11:20:44',
  acknowledged: true
}];


export const initialHealEvents: HealEvent[] = [
{ id: 'e1', time: '21:42:15', source: 'API Container', message: 'Failure detected — health endpoint returned 503', kind: 'detection' },
{ id: 'e2', time: '21:42:17', source: 'Recovery Engine', message: 'Restart initiated — policy "restart-on-unhealthy"', kind: 'warning' },
{ id: 'e3', time: '21:42:21', source: 'API Container', message: 'Container restarted — new instance a83f21c', kind: 'recovery' },
{ id: 'e4', time: '21:42:25', source: 'Health Check', message: 'Passed — 3 consecutive 200 OK responses', kind: 'success' },
{ id: 'e5', time: '21:42:26', source: 'System', message: 'Fully recovered — traffic restored to api-container', kind: 'success' }];


export const deployments: Deployment[] = [
{ id: 'd1', version: 'v1.4.2', commit: 'a83f21c', status: 'SUCCESS', environment: 'Production', author: 'm.arslan', duration: '3m 12s', time: '10 min ago', pipeline: '#482' },
{ id: 'd2', version: 'v1.4.1', commit: '72bc921', status: 'SUCCESS', environment: 'Production', author: 'm.arslan', duration: '2m 58s', time: '2 hours ago', pipeline: '#481' },
{ id: 'd3', version: 'v1.4.0', commit: '92ac812', status: 'FAILED', environment: 'Production', author: 'j.becker', duration: '1m 04s', time: '5 hours ago', pipeline: '#480' },
{ id: 'd4', version: 'v1.4.0-rc3', commit: '4de7a10', status: 'SUCCESS', environment: 'Staging', author: 'j.becker', duration: '3m 41s', time: '7 hours ago', pipeline: '#479' },
{ id: 'd5', version: 'v1.3.9', commit: 'c19f043', status: 'ROLLED_BACK', environment: 'Production', author: 's.iyer', duration: '4m 22s', time: '1 day ago', pipeline: '#476' },
{ id: 'd6', version: 'v1.3.8', commit: 'be2210f', status: 'SUCCESS', environment: 'Production', author: 's.iyer', duration: '3m 05s', time: '2 days ago', pipeline: '#472' },
{ id: 'd7', version: 'v1.3.7', commit: '0aa93bd', status: 'SUCCESS', environment: 'Development', author: 'm.arslan', duration: '2m 12s', time: '3 days ago', pipeline: '#468' }];


export const incidents: Incident[] = [
{ id: 'i1', service: 'api-container', trigger: 'Health endpoint 503 × 3', detectedAt: 'Today 21:42:15', resolvedAt: 'Today 21:42:26', recoveryMode: 'Automatic', action: 'Container restart', durationSec: 11, status: 'Recovered' },
{ id: 'i2', service: 'mysql-container', trigger: 'Connection pool exhausted', detectedAt: 'Today 19:04:51', resolvedAt: 'Today 19:05:19', recoveryMode: 'Automatic', action: 'Connection pool flush', durationSec: 28, status: 'Recovered' },
{ id: 'i3', service: 'nginx-container', trigger: 'Config validation failed', detectedAt: 'Today 11:20:31', resolvedAt: 'Today 11:20:44', recoveryMode: 'Automatic', action: 'Reload with last good config', durationSec: 13, status: 'Recovered' },
{ id: 'i4', service: 'api-container', trigger: 'OOMKilled (exit 137)', detectedAt: 'Yesterday 23:11:02', resolvedAt: 'Yesterday 23:11:20', recoveryMode: 'Automatic', action: 'Restart with raised memory limit', durationSec: 18, status: 'Recovered' },
{ id: 'i5', service: 'jenkins-container', trigger: 'Agent disconnected', detectedAt: 'Yesterday 14:38:44', resolvedAt: 'Yesterday 14:52:10', recoveryMode: 'Manual', action: 'Operator re-registered agent', durationSec: 806, status: 'Escalated' },
{ id: 'i6', service: 'prometheus-container', trigger: 'Scrape target timeout', detectedAt: '2 days ago 08:19:07', resolvedAt: '2 days ago 08:19:23', recoveryMode: 'Automatic', action: 'Target re-registration', durationSec: 16, status: 'Recovered' }];


export const detectionRules: DetectionRule[] = [
{ id: 'r1', name: 'Unhealthy HTTP probe', condition: 'health endpoint != 200', threshold: '3 consecutive failures', action: 'Restart container', enabled: true, triggered: 5 },
{ id: 'r2', name: 'CPU saturation', condition: 'container CPU > 90%', threshold: 'sustained 5 min', action: 'Scale replica + notify', enabled: true, triggered: 2 },
{ id: 'r3', name: 'Memory pressure', condition: 'container memory > 90% limit', threshold: 'sustained 2 min', action: 'Restart with raised limit', enabled: true, triggered: 3 },
{ id: 'r4', name: 'Database connectivity', condition: 'SELECT 1 fails', threshold: '2 consecutive failures', action: 'Flush connection pool', enabled: true, triggered: 1 },
{ id: 'r5', name: 'Disk pressure', condition: 'volume usage > 85%', threshold: 'single evaluation', action: 'Prune docker artifacts', enabled: false, triggered: 0 }];


export const recoveryActions = [
{ id: 'ra1', name: 'Restart container', runtime: 'Docker API', avgSec: 11, runs: 7, successRate: 100 },
{ id: 'ra2', name: 'Flush connection pool', runtime: 'Spring Boot Actuator', avgSec: 28, runs: 2, successRate: 100 },
{ id: 'ra3', name: 'Reload configuration', runtime: 'Nginx signal', avgSec: 13, runs: 3, successRate: 100 },
{ id: 'ra4', name: 'Prune docker artifacts', runtime: 'Docker API', avgSec: 42, runs: 1, successRate: 100 },
{ id: 'ra5', name: 'Escalate to on-call', runtime: 'Webhook', avgSec: 0, runs: 1, successRate: 0 }];


export const ec2Instance = {
  instanceId: 'i-0af31c92be7d40a19',
  type: 't3.large',
  region: 'eu-central-1a',
  ami: 'ami-0e872aee57663ae2d (Amazon Linux 2023)',
  publicIp: '3.___.___.___ (placeholder)',
  privateIp: '10.0.1.14',
  state: 'running',
  launchedAt: '12d 04h 32m ago',
  vcpu: 2,
  ramGb: 8,
  diskGb: 100,
  diskUsedGb: 41,
  networkIn: '184 MB/s',
  networkOut: '96 MB/s',
  securityGroup: 'sg-selfhealops-web',
  keyPair: 'selfhealops-prod'
};

export const navIcons = { dashboard: LayoutDashboardIcon, terminal: TerminalIcon, shield: ShieldCheckIcon };