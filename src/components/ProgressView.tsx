import { useEffect, useState } from 'react'
import { api } from '../api'
import type { SearchRequest, SearchResults, SearchStatus } from '../types'
import { useT, type TKey } from '../i18n'
import { useFocusOnMount } from '../lib'
import Duck from './Duck'
import PondProgress from './PondProgress'

const TIMEOUT_MS = 90_000
const POLL_MS = 1500
const STEPS: TKey[] = ['loading.step.understand', 'loading.step.search', 'loading.step.price', 'loading.step.rank']

type Phase = 'running' | 'timeout' | 'error'

export default function ProgressView({
  request,
  onDone,
  onCancel,
  onEdit,
}: {
  request: SearchRequest
  onDone: (r: SearchResults) => void
  onCancel: () => void
  onEdit: () => void
}) {
  const { t } = useT()
  const h1 = useFocusOnMount<HTMLHeadingElement>()
  const [status, setStatus] = useState<SearchStatus>({ stage: '', percent: 0, done: false })
  const [phase, setPhase] = useState<Phase>('running')
  const [attempt, setAttempt] = useState(0)
  const [cached, setCached] = useState<SearchResults | null>(null)

  useEffect(() => {
    const ctl = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    const started = Date.now()
    setPhase('running')
    setStatus({ stage: '', percent: 0, done: false })

    const fail = async (p: Phase) => {
      if (ctl.signal.aborted) return
      setPhase(p)
      // Offer saved results if the API has any.
      api.getCachedResults(request, ctl.signal).then((c) => !ctl.signal.aborted && setCached(c)).catch(() => {})
    }

    const run = async () => {
      try {
        const { searchId } = await api.startSearch(request, ctl.signal)
        const poll = async () => {
          if (ctl.signal.aborted) return
          if (Date.now() - started > TIMEOUT_MS) return fail('timeout')
          try {
            const s = await api.getStatus(searchId, ctl.signal)
            if (ctl.signal.aborted) return
            setStatus(s)
            if (s.done) {
              const r = await api.getResults(searchId, ctl.signal)
              if (!ctl.signal.aborted) onDone(r)
              return
            }
          } catch (e) {
            if ((e as Error).name === 'AbortError') return
            return fail('error')
          }
          timer = setTimeout(poll, POLL_MS)
        }
        poll()
      } catch (e) {
        if ((e as Error).name !== 'AbortError') fail('error')
      }
    }
    run()
    return () => {
      ctl.abort()
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  const current = status.done ? STEPS.length : Math.min(STEPS.length - 1, Math.floor(status.percent / 25))

  if (phase !== 'running') {
    const isTimeout = phase === 'timeout'
    return (
      <div className="mx-auto max-w-xl text-center">
        <Duck size={96} className="mx-auto mb-3" />
        <h1 ref={h1} tabIndex={-1} className="mb-3 text-3xl">{t(isTimeout ? 'loading.timeout.title' : 'loading.error.title')}</h1>
        <p role="alert" className="mb-6 text-lg text-muted">{t(isTimeout ? 'loading.timeout.body' : 'loading.error.body')}</p>
        <div className="flex flex-col items-center gap-3">
          <button type="button" className="btn-primary" onClick={() => setAttempt((a) => a + 1)}>{t('loading.retry')}</button>
          {cached && <button type="button" className="btn-secondary" onClick={() => onDone(cached)}>{t('loading.cached')}</button>}
          <button type="button" className="btn-ghost" onClick={onEdit}>{t('loading.edit')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 ref={h1} tabIndex={-1} className="mb-2 text-3xl sm:text-4xl">{t('loading.title')}</h1>
      <p className="mb-4 text-muted">{t('loading.sub')}</p>

      <div className="card">
        <PondProgress percent={status.percent} className="mb-5" />
        <ol className="space-y-3">
          {STEPS.map((k, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'wait'
            return (
              <li key={k} aria-current={state === 'active' ? 'step' : undefined} className={`flex min-h-[44px] items-center gap-3 text-lg ${state === 'wait' ? 'text-muted' : 'font-bold'}`}>
                <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-base ${state === 'done' ? 'border-accent bg-accent text-onduck' : state === 'active' ? 'border-info text-info' : 'border-edge'}`}>
                  {state === 'done' ? '✓' : state === 'active' ? '…' : i + 1}
                </span>
                <span>{t(k)}</span>
                <span className="ml-auto text-sm font-normal text-muted">
                  {state === 'done' ? t('loading.done') : state === 'active' ? t('loading.inprogress') : t('loading.waiting')}
                </span>
              </li>
            )
          })}
        </ol>
        <p className="sr-only" role="status" aria-live="polite">{status.stage}</p>
      </div>

      <div aria-hidden="true" className="mt-6 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card">
            <div className="skeleton mb-3 h-6 w-1/3 rounded" />
            <div className="skeleton mb-2 h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button type="button" className="btn-secondary" onClick={onCancel}>{t('loading.cancel')}</button>
      </div>
    </div>
  )
}
