import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Answers, Guide, Tool } from '../types'
import { useT } from '../i18n'
import { useFocusOnMount } from '../lib'

const storeKey = (id: string) => `rd.checklist.${id}`
const loadChecked = (id: string): Record<number, boolean> => {
  try { return JSON.parse(localStorage.getItem(storeKey(id)) ?? '{}') } catch { return {} }
}

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="card">
    <h2 id={id} className="mb-3 text-2xl">{title}</h2>
    {children}
  </section>
)

export default function GuidePage({
  tool,
  answers,
  onBack,
  onSecond,
}: {
  tool: Tool
  answers: Answers
  onBack: () => void
  onSecond: () => void
}) {
  const { t } = useT()
  const h1 = useFocusOnMount<HTMLHeadingElement>()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [error, setError] = useState(false)
  const [checked, setChecked] = useState<Record<number, boolean>>(() => loadChecked(tool.id))
  const [email, setEmail] = useState('')
  const [reminded, setReminded] = useState(false)

  useEffect(() => {
    const ctl = new AbortController()
    setGuide(null); setError(false)
    api.getGuide(tool.id, ctl.signal).then(setGuide).catch((e) => e.name !== 'AbortError' && setError(true))
    return () => ctl.abort()
  }, [tool.id])

  const toggle = (i: number) => {
    const next = { ...checked, [i]: !checked[i] }
    setChecked(next)
    try { localStorage.setItem(storeKey(tool.id), JSON.stringify(next)) } catch { /* private mode */ }
  }

  const matching = tool.worksWith.filter((w) => answers.existingTools.some((u) => u.toLowerCase() === w.toLowerCase()))
  const done = guide ? guide.setupSteps.filter((_, i) => checked[i]).length : 0

  return (
    <div className="mx-auto max-w-3xl">
      <button type="button" className="btn-ghost -ml-3 mb-2" onClick={onBack}><span aria-hidden="true">←</span> {t('guide.back')}</button>
      <h1 ref={h1} tabIndex={-1} className="mb-2 text-3xl sm:text-4xl">{t('guide.title', { name: tool.name })}</h1>
      <p className="mb-6 text-lg text-muted">{tool.summary}</p>

      {error && <p role="alert" className="err">{t('guide.error')}</p>}
      {!guide && !error && <p role="status" className="card">{t('guide.loading')}</p>}

      {guide && (
        <div className="space-y-6">
          <Section id="g-does" title={t('guide.does')}>
            <ul className="list-disc space-y-2 pl-6">{guide.whatItDoes.map((x) => <li key={x}>{x}</li>)}</ul>
          </Section>

          <Section id="g-setup" title={t('guide.setup')}>
            <p className="mb-3 font-bold" role="status">{t('guide.setup.progress', { done, total: guide.setupSteps.length })}</p>
            <div className="mb-4 h-3 overflow-hidden rounded-full border border-[#6B7280]" aria-hidden="true">
              <div className="h-full bg-accent transition-all" style={{ width: `${(done / guide.setupSteps.length) * 100}%` }} />
            </div>
            <ul className="space-y-3">
              {guide.setupSteps.map((s, i) => (
                <li key={s.title}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-cream">
                    <input type="checkbox" className="mt-1 h-6 w-6 shrink-0 accent-[#0F5F5C]" checked={!!checked[i]} onChange={() => toggle(i)} />
                    <span>
                      <span className={`block font-bold ${checked[i] ? 'line-through' : ''}`}>{s.title} <span className="font-normal text-muted">· {t('guide.setup.minutes', { n: s.minutes })}</span></span>
                      <span className="block text-muted">{s.detail}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="g-tips" title={t('guide.tips')}>
            <ol className="list-decimal space-y-2 pl-6">{guide.tips.map((x) => <li key={x}>{x}</li>)}</ol>
          </Section>

          <Section id="g-res" title={t('guide.tutorials')}>
            <ul className="space-y-2">
              {guide.resources.map((r) => (
                <li key={r.title} className="flex flex-wrap items-center gap-x-3">
                  <span className="badge">{r.type === 'video' ? '▶ ' : '📄 '}{t(r.type === 'video' ? 'guide.type.video' : 'guide.type.article')}</span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-bold text-accent">
                    {r.title}<span className="sr-only"> {t('common.newTab')}</span>
                  </a>
                  <span className="text-muted">{r.source}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="g-connect" title={t('guide.connect')}>
            {matching.length === 0 ? (
              <p>{t('guide.connect.none')}</p>
            ) : (
              <div className="space-y-4">
                <p>{t('guide.connect.body', { name: tool.name })}</p>
                {matching.map((m) => (
                  <div key={m}>
                    <h3 className="mb-1 text-lg">{tool.name} + {m}</h3>
                    <ol className="list-decimal space-y-1 pl-6">
                      {(['s1', 's2', 's3', 's4'] as const).map((k) => <li key={k}>{t(`guide.connect.${k}`, { name: tool.name, other: m })}</li>)}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section id="g-cost" title={t('guide.cost')}>
            <p className="mb-2">{t('guide.cost.price', { price: tool.pricing.startingPrice })} {tool.pricing.notes}</p>
            <p className="rounded-xl bg-accent-soft p-3 font-bold">{t('guide.cost.try')}</p>
          </Section>

          <Section id="g-remind" title={t('guide.remind')}>
            <p className="mb-3">{t('guide.remind.body')}</p>
            {reminded ? (
              <p role="status" className="font-bold">{t('guide.remind.thanks')}</p>
            ) : (
              <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); setReminded(true) }}>
                <div className="min-w-[14rem] flex-1">
                  <label htmlFor="remind-email" className="mb-1 block font-bold">{t('guide.remind.email')}</label>
                  <input id="remind-email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn-secondary">{t('guide.remind.cta')}</button>
              </form>
            )}
          </Section>

          <div className="card text-center">
            <p className="mb-3 font-bold">{t('guide.second.body')}</p>
            <button type="button" className="btn-primary" onClick={onSecond}>{t('guide.second')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
