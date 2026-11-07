import { useMemo, useRef, useState } from 'react'
import type { Answers, SearchResults, Tool } from '../types'
import { useT, type TKey } from '../i18n'
import { useFocusOnMount } from '../lib'
import ToolCard, { type SortMode } from './ToolCard'
import CompareTable from './CompareTable'
import Modal from './Modal'
import Duck from './Duck'
import { BusinessField, ExistingToolsField, ProblemField, SizeBudgetFields } from './IntakeFields'

const MAX_COMPARE = 3

export default function ResultsList({
  answers,
  results,
  secondFor,
  onRerun,
  onChoose,
  onRank,
  onStartOver,
}: {
  answers: Answers
  results: SearchResults
  secondFor: Tool | null
  onRerun: (a: Answers) => void
  onChoose: (t: Tool) => void
  onRank: () => void
  onStartOver: () => void
}) {
  const { t } = useT()
  const h1 = useFocusOnMount<HTMLHeadingElement>()
  const [sort, setSort] = useState<SortMode>('fit')
  const [picked, setPicked] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Answers>(answers)
  const editRef = useRef<HTMLDivElement>(null)

  // "Add a second tool" shows complementary tools only (falls back to everything else).
  const pool = useMemo(() => {
    if (!secondFor) return results.tools
    const others = results.tools.filter((x) => x.id !== secondFor.id)
    const pairIds = new Set(secondFor.pairsWith.map((p) => p.id))
    const fits = others.filter((x) => pairIds.has(x.id) || x.pairsWith.some((p) => p.id === secondFor.id))
    return fits.length ? fits : others
  }, [results.tools, secondFor])

  const sortScore = (x: Tool, s: SortMode) =>
    s === 'price' ? x.breakdown.price : s === 'ease' ? x.breakdown.easeOfSetup : x.overallScore
  const ordered = useMemo(() => {
    const rank = (x: Tool) => (sort === 'fit' ? x.overallScore : 0.4 * x.overallScore + 0.6 * sortScore(x, sort))
    return [...pool].sort((a, b) => rank(b) - rank(a)).slice(0, 5)
  }, [pool, sort])

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_COMPARE ? [...p, id] : p))
  const comparedTools = ordered.filter((x) => picked.includes(x.id))

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setDraft({ ...draft, [k]: v })
  const openEdit = (focusId?: string) => {
    setDraft(answers)
    setEditing(true)
    setTimeout(() => {
      editRef.current?.scrollIntoView({ block: 'start' })
      ;(focusId ? document.getElementById(focusId) : editRef.current?.querySelector<HTMLElement>('select,input,textarea,button'))?.focus()
    }, 0)
  }

  const chips: { label: string; focus: string }[] = [
    { label: answers.businessType === 'Other' && answers.businessOther ? answers.businessOther : answers.businessType, focus: 'r-biz' },
    answers.size && { label: answers.size, focus: 'r-size' },
    answers.budget && { label: answers.budget, focus: 'r-size' },
    ...answers.categories.map((c) => ({ label: c, focus: 'r-problem-text' })),
    answers.freeText && { label: `“${answers.freeText.length > 40 ? answers.freeText.slice(0, 40) + '…' : answers.freeText}”`, focus: 'r-problem-text' },
    answers.existingTools.length > 0 && { label: `Uses ${answers.existingTools.join(', ')}`, focus: 'r-existing' },
  ].filter(Boolean) as { label: string; focus: string }[]

  const few = ordered.length < 3 && !secondFor

  const mailto = (() => {
    const lines = ordered.map((x, i) => `${i + 1}. ${x.name} (match ${x.overallScore}/100) - ${x.pricing.startingPrice} - ${x.website}`)
    const body = [`${t('app.name')}: ${t('results.title')}`, '', results.interpretedProblem, '', ...lines, '', t('results.footer')].join('\n')
    return `mailto:?subject=${encodeURIComponent(`${t('app.name')}: ${t('results.title')}`)}&body=${encodeURIComponent(body)}`
  })()

  return (
    <div>
      <div className="print-only mb-4">
        <p className="font-bold">{t('app.name')} · {new Date().toLocaleDateString()}</p>
        <p>{chips.map((c) => c.label).join(' · ')}</p>
      </div>
      <h1 ref={h1} tabIndex={-1} className="mb-2 text-3xl sm:text-4xl">{t('results.title')}</h1>
      {results.cached && <p role="status" className="mb-3 rounded-xl bg-elevated p-3 font-bold">{t('results.cached')}</p>}
      <p className="mb-4 text-lg"><strong>{t('results.interpreted')}</strong> {results.interpretedProblem}</p>

      <div className="no-print mb-4 flex flex-wrap gap-3">
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          <span aria-hidden="true">🖨</span>{t('share.print')}
        </button>
        <a href={mailto} className="btn-secondary">
          <span aria-hidden="true">✉</span>{t('share.email')}
        </a>
      </div>

      <section aria-labelledby="answers-h" className="no-print card mb-6">
        <h2 id="answers-h" className="mb-2 text-lg">{t('results.yourAnswers')}</h2>
        <ul className="flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <li key={i}>
              <button type="button" onClick={() => openEdit(c.focus)} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-elevated px-4 font-bold text-info hover:bg-line">
                {c.label}<span className="text-sm underline">{t('results.edit')}</span>
              </button>
            </li>
          ))}
        </ul>
        {editing && (
          <div ref={editRef} className="mt-6 space-y-6 border-t border-line pt-6">
            <p className="text-muted">{t('results.editHint')}</p>
            <BusinessField a={draft} set={set} idPrefix="r-" />
            <div id="r-size"><SizeBudgetFields a={draft} set={set} idPrefix="r-" /></div>
            <ProblemField a={draft} set={set} idPrefix="r-" />
            <ExistingToolsField a={draft} set={set} idPrefix="r-" />
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary" disabled={!draft.businessType || (draft.categories.length === 0 && !draft.freeText.trim())} onClick={() => { setEditing(false); onRerun(draft) }}>
                {t('results.rerun')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>{t('results.cancelEdit')}</button>
            </div>
          </div>
        )}
      </section>

      {secondFor && <p role="status" className="mb-4 rounded-xl bg-elevated p-3 font-bold">{t('results.second', { name: secondFor.name })}</p>}

      {ordered.length === 0 ? (
        <div className="card text-center">
          <Duck size={96} className="mx-auto mb-2" />
          <h2 className="mb-2 text-2xl">{t('results.none.title')}</h2>
          <p className="mb-4">{t('results.few.body')}</p>
          <button type="button" className="btn-primary" onClick={() => openEdit()}>{t('results.few.cta')}</button>
        </div>
      ) : (
        <>
          <fieldset className="no-print mb-6">
            <legend className="mb-2 text-xl font-bold">{t('results.sortLabel')}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(['fit', 'price', 'ease'] as SortMode[]).map((m) => (
                <label key={m} className="choice">
                  <input type="radio" name="sort" checked={sort === m} onChange={() => setSort(m)} />
                  <span>{t(`results.sort.${m}` as TKey)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {few && (
            <div role="status" className="mb-6 rounded-2xl border-2 border-orange bg-elevated p-5">
              <h2 className="text-xl">{t('results.few.title')}</h2>
              <p className="mb-3">{t('results.few.body')}</p>
              <button type="button" className="btn-secondary" onClick={() => openEdit()}>{t('results.few.cta')}</button>
            </div>
          )}

          <ol className="space-y-6" aria-label={t('results.title')}>
            {ordered.map((x, i) => (
              <li key={x.id}>
                <ToolCard
                  tool={x}
                  rank={i + 1}
                  sort={sort}
                  sortScore={sortScore(x, sort)}
                  userTools={answers.existingTools}
                  compared={picked.includes(x.id)}
                  compareDisabled={picked.length >= MAX_COMPARE}
                  onToggleCompare={() => toggle(x.id)}
                  onGuide={() => onChoose(x)}
                />
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-muted">
        <p>{t('results.footer')}</p>
        <button type="button" className="no-print btn-ghost" onClick={onStartOver}>{t('results.startOver')}</button>
      </div>

      {picked.length > 0 && (
        <div role="region" aria-label={t('compare.title')} className="no-print sticky bottom-0 z-20 -mx-4 mt-6 border-t-2 border-info bg-surface p-3 shadow-lg">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <p className="font-bold" role="status">{t('compare.bar', { n: picked.length })}{picked.length < 2 && ` · ${t('compare.min')}`}</p>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={() => setPicked([])}>{t('compare.clear')}</button>
              <button type="button" className="btn-primary" disabled={picked.length < 2} onClick={() => setComparing(true)}>{t('compare.open')}</button>
            </div>
          </div>
        </div>
      )}

      <Modal open={comparing} onClose={() => setComparing(false)} title={t('compare.title')} wide>
        <CompareTable tools={comparedTools} onChoose={(x) => { setComparing(false); onChoose(x) }} />
      </Modal>
    </div>
  )
}
