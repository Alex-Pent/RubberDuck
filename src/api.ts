import type { Guide, SearchRequest, SearchResults, SearchStatus } from './types'

const BASE: string = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

async function http<T>(path: string, init?: RequestInit, signal?: AbortSignal): Promise<T> {
  const requestUrl = `${BASE || ''}${path}`
  const res = await fetch(requestUrl, {
    ...init,
    signal,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status)
  return (await res.json()) as T
}

export const api = {
  startSearch: (req: SearchRequest, signal?: AbortSignal) =>
    http<{ searchId: string }>('/api/search', { method: 'POST', body: JSON.stringify(req) }, signal),
  getStatus: (id: string, signal?: AbortSignal) =>
    http<SearchStatus>(`/api/search/${encodeURIComponent(id)}/status`, undefined, signal),
  getResults: (id: string, signal?: AbortSignal) =>
    http<SearchResults>(`/api/search/${encodeURIComponent(id)}/results`, undefined, signal),
  getCachedResults: async (req: SearchRequest, signal?: AbortSignal): Promise<SearchResults | null> => {
    try {
      const q = new URLSearchParams({ request: JSON.stringify(req) })
      const r = await http<SearchResults>(`/api/search/cached?${q}`, undefined, signal)
      return { ...r, cached: true }
    } catch {
      return null
    }
  },
  getGuide: (toolId: string, signal?: AbortSignal) =>
    http<Guide>(`/api/tools/${encodeURIComponent(toolId)}/guide`, undefined, signal),
}
