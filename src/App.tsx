import { useCallback, useEffect, useState } from 'react'
import { emptyAnswers, type Answers, type SearchResults, type Tool } from './types'
import { boot, toRequest } from './lib'
import { useT } from './i18n'
import Layout from './components/Layout'
import { DuckSprite } from './components/Duck'
import Modal from './components/Modal'
import IntakeWizard from './components/IntakeWizard'
import ProgressView from './components/ProgressView'
import ResultsList from './components/ResultsList'
import GuidePage from './components/GuidePage'

type Screen = 'intake' | 'loading' | 'results' | 'guide'
type Dlg = null | 'how' | 'rank' | 'sba'

/* Saved on this device only, so a refresh does not send someone back to the start. */
const SAVE_KEY = 'rd.session.v1'
interface Saved { screen: Screen; answers: Answers; results: SearchResults | null; chosenId: string | null }
function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Saved
    if (!s || typeof s !== 'object' || !s.answers) return null
    const answers = { ...emptyAnswers, ...s.answers }
    const results = s.results && Array.isArray(s.results.tools) ? s.results : null
    const chosen = results?.tools.find((x) => x.id === s.chosenId)
    const screen: Screen = results && s.screen === 'guide' && chosen ? 'guide' : results && s.screen !== 'intake' ? 'results' : 'intake'
    return { screen, answers, results, chosenId: chosen ? chosen.id : null }
  } catch {
    return null
  }
}

export default function App() {
  const { t } = useT()
  const [saved] = useState(loadSaved)
  const [screen, setScreenState] = useState<Screen>(saved?.screen ?? 'intake')
  const [answers, setAnswers] = useState<Answers>(saved?.answers ?? emptyAnswers)
  const [results, setResults] = useState<SearchResults | null>(saved?.results ?? null)
  const [chosen, setChosen] = useState<Tool | null>(saved?.results?.tools.find((x) => x.id === saved.chosenId) ?? null)
  const [restored, setRestored] = useState(saved?.screen === 'results' || saved?.screen === 'guide')
  const [secondFor, setSecondFor] = useState<Tool | null>(null)
  const [dlg, setDlg] = useState<Dlg>(null)

  // Light browser-history support so the Back button moves between screens, not out of the app.
  const go = useCallback((s: Screen, replace = false) => {
    setScreenState(s)
    window.history[replace ? 'replaceState' : 'pushState']({ s }, '')
  }, [])
  useEffect(() => {
    boot.done = true
    window.history.replaceState({ s: screen }, '')
    const onPop = (e: PopStateEvent) => {
      const s = (e.state?.s ?? 'intake') as Screen
      setScreenState(s === 'loading' ? 'intake' : s)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    try {
      const s: Saved = { screen: screen === 'loading' ? 'intake' : screen, answers, results, chosenId: chosen?.id ?? null }
      localStorage.setItem(SAVE_KEY, JSON.stringify(s))
    } catch {
      /* storage can be blocked; the app still works */
    }
  }, [screen, answers, results, chosen])

  const search = (a: Answers) => { setAnswers(a); setSecondFor(null); setRestored(false); go('loading') }
  const startOver = () => { setResults(null); setChosen(null); setSecondFor(null); setRestored(false); go('intake') }

  const safeScreen: Screen =
    (screen === 'results' && !results) || (screen === 'guide' && (!chosen || !results)) ? 'intake' : screen

  return (
    <>
    <DuckSprite />
    <Layout onHome={startOver} onHow={() => setDlg('how')} onSba={() => setDlg('sba')} onRank={() => setDlg('rank')}>
      {restored && (safeScreen === 'results' || safeScreen === 'guide') && (
        <div role="status" className="card mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold">{t('saved.welcome')}</p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={startOver}>{t('results.startOver')}</button>
            <button type="button" className="btn-ghost" onClick={() => setRestored(false)}>{t('common.close')}</button>
          </div>
        </div>
      )}
      {safeScreen === 'intake' && <IntakeWizard answers={answers} setAnswers={setAnswers} onSubmit={() => search(answers)} />}
      {safeScreen === 'loading' && (
        <ProgressView
          request={toRequest(answers)}
          onDone={(r) => { setResults(r); go('results', true) }}
          onCancel={() => go('intake', true)}
          onEdit={() => go('intake', true)}
        />
      )}
      {safeScreen === 'results' && results && (
        <ResultsList
          answers={answers}
          results={results}
          secondFor={secondFor}
          onRerun={search}
          onChoose={(tool) => { setChosen(tool); go('guide') }}
          onRank={() => setDlg('rank')}
          onStartOver={startOver}
        />
      )}
      {safeScreen === 'guide' && chosen && (
        <GuidePage
          tool={chosen}
          answers={answers}
          onBack={() => { setSecondFor(null); go('results') }}
          onSecond={() => { setSecondFor(chosen); go('results') }}
        />
      )}

      <Modal open={dlg === 'how'} onClose={() => setDlg(null)} title={t('how.title')}>
        <ol className="list-decimal space-y-2 pl-6">
          {(['how.1', 'how.2', 'how.3', 'how.4'] as const).map((k) => <li key={k}>{t(k)}</li>)}
        </ol>
        <p className="mt-4 font-bold">{t('how.free')}</p>
      </Modal>
      <Modal open={dlg === 'rank'} onClose={() => setDlg(null)} title={t('rank.title')}>
        <p className="mb-3">{t('rank.intro')}</p>
        <ul className="list-disc space-y-1 pl-6">
          {(['rank.fit', 'rank.price', 'rank.reviews', 'rank.integrations', 'rank.ease', 'rank.privacy'] as const).map((k) => <li key={k}>{t(k)}</li>)}
        </ul>
        <p className="mt-4">{t('rank.weights')}</p>
        <p className="mt-2 font-bold">{t('rank.unpaid')}</p>
      </Modal>
      <Modal open={dlg === 'sba'} onClose={() => setDlg(null)} title={t('sba.title')}>
        <p className="mb-3">{t('sba.intro')}</p>
        <ul className="space-y-1">
          {([['sba.sba', 'https://www.sba.gov/'], ['sba.sbdc', 'https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers-sbdc'], ['sba.score', 'https://www.score.org/']] as const).map(([k, href]) => (
            <li key={k}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-bold text-info">
                {t(k)}<span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </Layout>
    </>
  )
}
