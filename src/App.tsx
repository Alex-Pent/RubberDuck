import { useCallback, useEffect, useState } from 'react'
import { emptyAnswers, type Answers, type SearchResults, type Tool } from './types'
import { toRequest } from './lib'
import { useT } from './i18n'
import Layout from './components/Layout'
import Modal from './components/Modal'
import IntakeWizard from './components/IntakeWizard'
import ProgressView from './components/ProgressView'
import ResultsList from './components/ResultsList'
import GuidePage from './components/GuidePage'

type Screen = 'intake' | 'loading' | 'results' | 'guide'
type Dlg = null | 'how' | 'rank' | 'sba'

export default function App() {
  const { t } = useT()
  const [screen, setScreenState] = useState<Screen>('intake')
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [chosen, setChosen] = useState<Tool | null>(null)
  const [secondFor, setSecondFor] = useState<Tool | null>(null)
  const [dlg, setDlg] = useState<Dlg>(null)

  // Light browser-history support so the Back button moves between screens, not out of the app.
  const go = useCallback((s: Screen, replace = false) => {
    setScreenState(s)
    window.history[replace ? 'replaceState' : 'pushState']({ s }, '')
  }, [])
  useEffect(() => {
    window.history.replaceState({ s: 'intake' }, '')
    const onPop = (e: PopStateEvent) => {
      const s = (e.state?.s ?? 'intake') as Screen
      setScreenState(s === 'loading' ? 'intake' : s)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const search = (a: Answers) => { setAnswers(a); setSecondFor(null); go('loading') }
  const startOver = () => { setResults(null); setChosen(null); setSecondFor(null); go('intake') }

  const safeScreen: Screen =
    (screen === 'results' && !results) || (screen === 'guide' && (!chosen || !results)) ? 'intake' : screen

  return (
    <Layout onHome={startOver} onHow={() => setDlg('how')} onSba={() => setDlg('sba')} onRank={() => setDlg('rank')}>
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
  )
}
