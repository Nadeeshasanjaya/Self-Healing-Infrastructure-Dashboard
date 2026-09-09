export interface BackendService {
  name: string;
  status: string;
  responseTime: number;
}

const API_BASE_URL = '/api';

export async function getBackendServices(): Promise<BackendService[]> {
  const response = await fetch(`${API_BASE_URL}/services`);

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

export async function getBackendHealth(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.text();
}