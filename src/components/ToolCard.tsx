import type { Tool } from '../types'
import { useId, useState } from 'react'
import { useT, type TKey } from '../i18n'
import { HintButton, HintNote } from './Hint'
import { fmtDate } from '../lib'
import Duck from './Duck'
import ScoreBreakdown from './ScoreBreakdown'

export type SortMode = 'fit' | 'price' | 'ease'

export default function ToolCard({
  tool,
  rank,
  sort,
  sortScore,
  userTools,
  compared,
  compareDisabled,
  onToggleCompare,
  onGuide,
}: {
  tool: Tool
  rank: number
  sort: SortMode
  sortScore: number
  userTools: string[]
  compared: boolean
  compareDisabled: boolean
  onToggleCompare: () => void
  onGuide: () => void
}) {
  const { t, lang } = useT()
  const mine = tool.worksWith.find((w) => userTools.some((u) => u.toLowerCase() === w.toLowerCase()))
  const priv = tool.breakdown.privacy
  const privKey: TKey = priv >= 80 ? 'card.privacy.good' : priv >= 65 ? 'card.privacy.ok' : 'card.privacy.weak'
  const dots = tool.confidence === 'high' ? 3 : tool.confidence === 'medium' ? 2 : 1
  const titleId = `tool-${tool.id}`
  const [hint, setHint] = useState<string | null>(null)
  const hid = useId().replace(/:/g, '')
  const tog = (k: string) => setHint(hint === k ? null : k)
  const hb = (k: 'score' | 'free' | 'works' | 'confidence', className?: string) => (
    <HintButton term={t(`gloss.term.${k}` as TKey)} id={`${hid}-${k}`} open={hint === k} onToggle={() => tog(k)} className={className} />
  )
  const sortName = sort === 'price' ? t('results.sort.price') : t('results.sort.ease')
  const visibleSources = (tool.sources || []).filter((s) => s && s.url && s.title)

  return (
    <article aria-labelledby={titleId} className="card print-card">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          {rank === 1 && sort === 'fit' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent py-1 pl-1.5 pr-3 text-sm font-bold text-onduck">
              <Duck size={22} />
              <span><span className="sr-only">{t('card.rank', { n: 1 })}: </span>{t('card.best')}</span>
            </span>
          ) : (
            <span className="rounded-full border border-edge bg-elevated px-3 py-1 text-sm font-bold">{t('card.rank', { n: rank })}</span>
          )}
          <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-xl bg-elevated text-2xl font-bold text-info">
            {tool.logoUrl ? <img src={tool.logoUrl} alt="" className="h-10 w-10" /> : tool.name[0]}
          </div>
        </div>
        <div className="min-w-[12rem] flex-1">
          <h3 id={titleId} className="text-2xl">{tool.name}</h3>
          <p className="mt-1">{tool.summary}</p>
          <p className="mt-2 font-bold">
            {t('card.from', { price: tool.pricing.startingPrice })} ·{' '}
            <span>{tool.pricing.freeTier ? t('card.freeYes') : t('card.freeNo')}</span>
            {hb('free')}
          </p>
          <HintNote id={`${hid}-free`} open={hint === 'free'}>{t('gloss.free')}</HintNote>
          <p className="text-muted">{tool.pricing.notes}</p>
        </div>
        <div className="rounded-2xl border-2 border-edge bg-elevated px-4 py-2 text-center">
          <p className="text-sm font-bold">{t('card.match')}{hb('score', '-my-3 ml-0')}</p>
          <p className="text-3xl font-bold text-ink">{tool.overallScore}</p>
          <p className="text-sm">{t('card.outOf')}</p>
        </div>
      </div>
      <HintNote id={`${hid}-score`} open={hint === 'score'}>{t('gloss.score')}</HintNote>

      <div className="mt-4 rounded-xl bg-elevated p-4">
        <p className="font-bold">{sort === 'fit' ? t('card.why', { n: rank }) : t('card.whyAlt')}</p>
        <p>{tool.whyRanked}</p>
        {sort !== 'fit' && <p className="mt-1 text-muted">{t('card.sortedBy', { what: sortName, score: sortScore })}</p>}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        <li className="badge"><span aria-hidden="true">🔗</span>{mine ? t('card.worksWith', { name: mine }) : t('card.worksNone', { n: tool.worksWith.length })}{hb('works', '-my-3 -mr-3 ml-0')}</li>
        <li className="badge"><span aria-hidden="true">⏱</span>{t('card.setup', { n: tool.setupMinutes })}</li>
        <li className="badge"><span aria-hidden="true">🔒</span>{t('card.privacy', { level: t(privKey) })}</li>
      </ul>
      <HintNote id={`${hid}-works`} open={hint === 'works'}>{t('gloss.works')}</HintNote>

      <div className="mt-3"><ScoreBreakdown breakdown={tool.breakdown} /></div>
      <p className="print-only">Website: {tool.website}</p>

      {tool.pairsWith.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-edge p-4">
          <h4 className="mb-2 font-bold"><span aria-hidden="true">➕ </span>{t('card.pairs')}</h4>
          <ul className="space-y-1">
            {tool.pairsWith.map((p) => (
              <li key={p.id}><strong>{p.name}</strong>: {p.reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span>{t('card.sources')}:</span>
        {visibleSources.length > 0 ? visibleSources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="print-url inline-flex min-h-[44px] items-center text-info">
            {s.title}<span className="sr-only"> {t('card.opens')}</span>
          </a>
        )) : (
          <a href={tool.website} target="_blank" rel="noopener noreferrer" className="print-url inline-flex min-h-[44px] items-center text-info">
            {t('card.visit')}<span className="sr-only"> {t('card.opens')}</span>
          </a>
        )}
        <span>{t('card.verified', { date: fmtDate(tool.lastVerified, lang) })}</span>
        <span className="inline-flex items-center gap-1 font-bold text-ink">
          <span aria-hidden="true" className="tracking-widest text-info">{'●'.repeat(dots)}<span className="text-edge">{'●'.repeat(3 - dots)}</span></span>
          {t('card.confidence', { level: t(`card.confidence.${tool.confidence}` as TKey) })}
          {hb('confidence', '-my-3')}
        </span>
      </div>
      <HintNote id={`${hid}-confidence`} open={hint === 'confidence'}>{t('gloss.confidence')}</HintNote>

      <div className="no-print mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <label className={`flex min-h-[44px] items-center gap-3 ${compareDisabled && !compared ? 'opacity-60' : 'cursor-pointer'}`}>
          <input type="checkbox" className="h-6 w-6 accent-[#FFC93C]" checked={compared} disabled={compareDisabled && !compared} onChange={onToggleCompare} />
          <span className="font-bold">{t('card.compare')}<span className="sr-only">: {tool.name}</span></span>
          {compareDisabled && !compared && <span className="text-sm">{t('compare.max')}</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={onGuide}>
            {t('card.guide')}<span className="sr-only">: {tool.name}</span>
          </button>
          <a href={tool.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t('card.choose')}<span aria-hidden="true">↗</span><span className="sr-only">: {tool.name} {t('card.opens')}</span>
          </a>
        </div>
      </div>
    </article>
  )
}
