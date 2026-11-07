import type { Guide, SearchRequest, SearchResults, SearchStatus } from './types'
import { guides, interpreted, pickScenario, scenarios, type ScenarioKey } from './mock/data'

/**
 * The ONLY file that talks to the backend.
 *
 * Switch to the real backend by setting, in `.env`:
 *   VITE_USE_MOCK=false
 *   VITE_API_BASE_URL=https://your-backend.example.com   (or leave empty to use /api on the same origin)
 */
export const USE_MOCK: boolean = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'
const BASE: string = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

async function http<T>(path: string, init?: RequestInit, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    signal,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status)
  return (await res.json()) as T
}

/* ----------------------------- real client ----------------------------- */

const real = {
  startSearch: (req: SearchRequest, signal?: AbortSignal) =>
    http<{ searchId: string }>('/api/search', { method: 'POST', body: JSON.stringify(req) }, signal),
  getStatus: (id: string, signal?: AbortSignal) =>
    http<SearchStatus>(`/api/search/${encodeURIComponent(id)}/status`, undefined, signal),
  getResults: (id: string, signal?: AbortSignal) =>
    http<SearchResults>(`/api/search/${encodeURIComponent(id)}/results`, undefined, signal),
  /** Optional endpoint: GET /api/search/cached?businessType=... returns SearchResults or 404. */
  getCachedResults: async (req: SearchRequest, signal?: AbortSignal): Promise<SearchResults | null> => {
    try {
      const q = new URLSearchParams({ businessType: req.businessType, category: req.category ?? '' })
      const r = await http<SearchResults>(`/api/search/cached?${q}`, undefined, signal)
      return { ...r, cached: true }
    } catch {
      return null
    }
  },
  getGuide: (toolId: string, signal?: AbortSignal) =>
    http<Guide>(`/api/tools/${encodeURIComponent(toolId)}/guide`, undefined, signal),
}

/* ------------------------------ mock client ------------------------------ */

const MOCK_DURATION_MS = 7000 // pretend the search takes ~7s so the demo stays snappy
const MOCK_STAGES = [
  'Understanding your problem',
  'Searching for tools',
  'Checking prices and integrations',
  'Ranking your matches',
]
const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })

const mockSearches = new Map<string, { startedAt: number; key: ScenarioKey; req: SearchRequest }>()

function mockResultsFor(req: SearchRequest, key: ScenarioKey): SearchResults {
  let tools = scenarios[key].map((t) => ({ ...t }))
  // Make "works with" highlight the owner's own tools first, and add a gentle fit boost.
  const mine = req.existingTools.map((s) => s.toLowerCase())
  tools = tools.map((t) => {
    const hits = t.worksWith.filter((w) => mine.includes(w.toLowerCase())).length
    return { ...t, overallScore: Math.min(100, t.overallScore + hits * 2) }
  })
  tools.sort((a, b) => b.overallScore - a.overallScore)
  // "Free" budget with no free tier → lower the rank a little, honestly.
  if (req.budget === 'free') tools = tools.filter((t) => t.pricing.freeTier || t.overallScore > 80)
  // Rewrite "why" to reference rank 1 positively and mention the user's tools when relevant.
  return { interpretedProblem: interpreted[key], tools }
}

const mock = {
  async startSearch(req: SearchRequest, signal?: AbortSignal) {
    await sleep(300, signal)
    const searchId = `mock-${Date.now()}`
    mockSearches.set(searchId, { startedAt: Date.now(), key: pickScenario(req), req })
    return { searchId }
  },
  async getStatus(id: string, signal?: AbortSignal): Promise<SearchStatus> {
    await sleep(150, signal)
    const s = mockSearches.get(id)
    if (!s) throw new ApiError('Unknown search', 404)
    const pct = Math.min(100, ((Date.now() - s.startedAt) / MOCK_DURATION_MS) * 100)
    const idx = Math.min(MOCK_STAGES.length - 1, Math.floor((pct / 100) * MOCK_STAGES.length))
    return { stage: MOCK_STAGES[idx], percent: Math.round(pct), done: pct >= 100 }
  },
  async getResults(id: string, signal?: AbortSignal): Promise<SearchResults> {
    await sleep(200, signal)
    const s = mockSearches.get(id)
    if (!s) throw new ApiError('Unknown search', 404)
    return mockResultsFor(s.req, s.key)
  },
  async getCachedResults(req: SearchRequest): Promise<SearchResults | null> {
    return { ...mockResultsFor(req, pickScenario(req)), cached: true }
  },
  async getGuide(toolId: string, signal?: AbortSignal): Promise<Guide> {
    await sleep(400, signal)
    const g = guides[toolId]
    if (!g) throw new ApiError('No guide', 404)
    return g
  },
}

export const api = USE_MOCK ? mock : real
