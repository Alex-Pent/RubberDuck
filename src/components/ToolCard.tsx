import type { Tool } from '../types'
import { useT, type TKey } from '../i18n'
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
  const sortName = sort === 'price' ? t('results.sort.price') : t('results.sort.ease')

  return (
    <article aria-labelledby={titleId} className="card">
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
          </p>
          <p className="text-muted">{tool.pricing.notes}</p>
        </div>
        <div className="rounded-2xl border-2 border-edge bg-elevated px-4 py-2 text-center" aria-label={`${t('card.match')}: ${tool.overallScore} ${t('card.outOf')}`}>
          <p className="text-sm font-bold" aria-hidden="true">{t('card.match')}</p>
          <p className="text-3xl font-bold text-ink" aria-hidden="true">{tool.overallScore}</p>
          <p className="text-sm" aria-hidden="true">{t('card.outOf')}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-elevated p-4">
        <p className="font-bold">{sort === 'fit' ? t('card.why', { n: rank }) : t('card.whyAlt')}</p>
        <p>{tool.whyRanked}</p>
        {sort !== 'fit' && <p className="mt-1 text-muted">{t('card.sortedBy', { what: sortName, score: sortScore })}</p>}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        <li className="badge"><span aria-hidden="true">🔗</span>{mine ? t('card.worksWith', { name: mine }) : t('card.worksNone', { n: tool.worksWith.length })}</li>
        <li className="badge"><span aria-hidden="true">⏱</span>{t('card.setup', { n: tool.setupMinutes })}</li>
        <li className="badge"><span aria-hidden="true">🔒</span>{t('card.privacy', { level: t(privKey) })}</li>
      </ul>

      <div className="mt-3"><ScoreBreakdown breakdown={tool.breakdown} /></div>

      {tool.pairsWith.length > 0 && (
        <section aria-label={t('card.pairs')} className="mt-4 rounded-xl border border-dashed border-edge p-4">
          <h4 className="mb-2 font-bold"><span aria-hidden="true">➕ </span>{t('card.pairs')}</h4>
          <ul className="space-y-1">
            {tool.pairsWith.map((p) => (
              <li key={p.id}><strong>{p.name}</strong>: {p.reason}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span>{t('card.sources')}:</span>
        {tool.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-info">
            {s.title}<span className="sr-only"> {t('card.opens')}</span>
          </a>
        ))}
        <span>{t('card.verified', { date: fmtDate(tool.lastVerified, lang) })}</span>
        <span className="inline-flex items-center gap-1 font-bold text-ink">
          <span aria-hidden="true" className="tracking-widest text-info">{'●'.repeat(dots)}<span className="text-edge">{'●'.repeat(3 - dots)}</span></span>
          {t('card.confidence', { level: t(`card.confidence.${tool.confidence}` as TKey) })}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
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
