import type { Performance, PerformanceInput } from '../types/performance';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  const data = await response.json() as T;

  if (!response.ok) {
    const errorData = data as { error?: string };
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function getPerformances(): Promise<Performance[]> {
  const data = await fetchJson<{ performances: Performance[] }>(`${API_BASE}/performances`);
  return data.performances;
}

export async function getPerformance(id: number): Promise<Performance> {
  return fetchJson<Performance>(`${API_BASE}/performances/${id}`);
}

export async function createPerformance(input: PerformanceInput & { youtubeUrl: string }): Promise<Performance> {
  return fetchJson<Performance>(`${API_BASE}/admin/performances`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export async function updatePerformance(id: number, input: Partial<PerformanceInput> & { youtubeUrl?: string }): Promise<Performance> {
  return fetchJson<Performance>(`${API_BASE}/admin/performances/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  });
}

export async function deletePerformance(id: number): Promise<void> {
  await fetchJson<{ success: boolean }>(`${API_BASE}/admin/performances/${id}`, {
    method: 'DELETE'
  });
}