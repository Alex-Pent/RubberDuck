import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'es'

/**
 * All user-facing copy lives here as keys. Spanish falls back to English for any
 * missing key, so translators can fill `es` in gradually.
 */
const en = {
  'app.name': 'RubberDuck',
  'app.tagline': 'Find the right AI tool for your business, in plain English.',
  'nav.home': 'RubberDuck home',
  'nav.how': 'How it works',
  'nav.sba': 'SBA resources',
  'nav.lang': 'Language',
  'nav.skip': 'Skip to main content',
  'nav.main': 'Main navigation',

  'intake.title': "Tell us what's slowing you down",
  'intake.intro': 'Answer a few quick questions. It takes about two minutes. No sign-up needed.',
  'intake.step': 'Step {n} of {total}',
  'intake.progress': 'Progress',
  'intake.s1': 'Your business',
  'intake.s2': 'Size and budget',
  'intake.s3': 'The problem',
  'intake.s4': 'What you use',
  'intake.bizType': 'What kind of business do you run?',
  'intake.bizType.choose': 'Choose one…',
  'intake.bizOther': 'Tell us what you do',
  'intake.bizOther.ph': 'For example: dog grooming',
  'intake.size': 'How many people work in your business?',
  'intake.budget': 'How much could you spend each month on this tool?',
  'intake.problem': 'What is the problem?',
  'intake.problem.chips': 'Pick the closest topic',
  'intake.problem.text': 'Or describe it in your own words',
  'intake.problem.ph': 'Tell us what is eating up your time…',
  'intake.problem.examples': 'Tap an example to start:',
  'intake.problem.hint': 'You can pick a topic, type, or do both.',
  'intake.existing': 'What do you already use?',
  'intake.existing.help': 'AI or not, this helps us find tools that work with what you have.',
  'intake.existing.ph': 'Type or pick, then press Enter',
  'intake.existing.remove': 'Remove {name}',
  'intake.existing.add': 'Add {name}',
  'intake.back': 'Back',
  'intake.next': 'Next',
  'intake.submit': 'Find my tools',
  'intake.err.biz': 'Please choose your type of business.',
  'intake.err.bizOther': 'Please tell us what kind of business you run.',
  'intake.err.problem': 'Please pick a topic or describe the problem. Either one is fine.',
  'intake.mic': 'Speak your answer',
  'intake.mic.stop': 'Stop listening',
  'intake.mic.listening': 'Listening… speak now.',
  'intake.mic.unsupported': 'Voice input is not available in this browser.',
  'intake.mic.error': "We couldn't hear that. Please try again or type instead.",

  'loading.title': 'Searching for tools that fit',
  'loading.sub': 'This can take up to a minute. Please keep this page open.',
  'loading.cancel': 'Cancel',
  'loading.step.understand': 'Understanding your problem',
  'loading.step.search': 'Searching for tools',
  'loading.step.price': 'Checking prices and integrations',
  'loading.step.rank': 'Ranking your matches',
  'loading.done': 'Done',
  'loading.inprogress': 'In progress',
  'loading.waiting': 'Waiting',
  'loading.timeout.title': 'This is taking longer than usual',
  'loading.timeout.body': 'Sorry about that. Nothing was lost. You can try again.',
  'loading.error.title': 'Something went wrong',
  'loading.error.body': 'We could not finish your search. Nothing you typed was lost.',
  'loading.retry': 'Try again',
  'loading.cached': 'Show saved results',
  'loading.edit': 'Change my answers',

  'results.title': 'Your best matches',
  'results.yourAnswers': 'Your answers',
  'results.edit': 'Change',
  'results.editHint': 'Change an answer, then search again.',
  'results.rerun': 'Search again',
  'results.cancelEdit': 'Cancel',
  'results.interpreted': 'What we understood:',
  'results.cached': 'These are saved results from an earlier search.',
  'results.sortLabel': 'What matters most?',
  'results.sort.fit': 'Best fit',
  'results.sort.price': 'Lowest price',
  'results.sort.ease': 'Easiest setup',
  'results.few.title': 'We found fewer than 3 good matches',
  'results.few.body': 'We would rather be honest than pad the list. Try changing your answers, such as a bigger budget or a different topic.',
  'results.few.cta': 'Change my answers',
  'results.none.title': 'We could not find a good match',
  'results.footer': 'Rankings are not paid placements. No tool can pay to move up.',
  'results.howRank': 'How we rank',
  'results.startOver': 'Start over',

  'card.rank': 'Rank {n}',
  'card.match': 'Match score',
  'card.outOf': 'out of 100',
  'card.from': 'From {price}',
  'card.freeYes': 'Free plan: yes',
  'card.freeNo': 'Free plan: no',
  'card.why': "Why it's #{n}",
  'card.whyAlt': 'Why we recommend it',
  'card.sortedBy': 'Sorted by {what}: {score} out of 100',
  'results.second': 'Showing tools that pair well with {name}.',
  'results.edited': 'Your answers changed. Search again to update the list.',
  'card.worksWith': 'Works with {name}',
  'card.worksNone': 'Works with {n} common tools',
  'card.setup': 'Setup: about {n} min',
  'card.privacy': 'Privacy: {level}',
  'card.privacy.good': 'good',
  'card.privacy.ok': 'okay',
  'card.privacy.weak': 'needs a look',
  'card.details': 'See score details',
  'card.hideDetails': 'Hide score details',
  'card.compare': 'Compare',
  'card.compareHint': 'Pick up to 3',
  'card.choose': 'Choose this tool',
  'card.pairs': 'Combine for more',
  'card.pairs.add': 'Add as a second tool',
  'card.sources': 'Sources',
  'card.verified': 'Last verified: {date}',
  'card.confidence': 'Confidence: {level}',
  'card.confidence.high': 'High',
  'card.confidence.medium': 'Medium',
  'card.confidence.low': 'Low – double-check before you buy',
  'card.opens': '(opens in a new tab)',
  'card.visit': 'Visit website',

  'breakdown.title': 'How this score adds up',
  'breakdown.fit': 'Fit to your problem',
  'breakdown.price': 'Price',
  'breakdown.reviews': 'Reviews',
  'breakdown.integrations': 'Works with your tools',
  'breakdown.easeOfSetup': 'Ease of setup',
  'breakdown.privacy': 'Privacy and trust',
  'breakdown.level.great': 'Great',
  'breakdown.level.good': 'Good',
  'breakdown.level.fair': 'Fair',
  'breakdown.level.weak': 'Weak',

  'compare.bar': '{n} selected to compare',
  'compare.open': 'Compare tools',
  'compare.clear': 'Clear',
  'compare.min': 'Pick at least 2 tools to compare.',
  'compare.title': 'Side-by-side comparison',
  'compare.close': 'Close comparison',
  'compare.caption': 'Comparison of the tools you selected. Each column is one tool.',
  'compare.row.price': 'Starting price',
  'compare.row.free': 'Free plan',
  'compare.row.score': 'Match score',
  'compare.row.setup': 'Setup time',
  'compare.row.features': 'Main features',
  'compare.row.integrations': 'Works with',
  'compare.row.pros': 'Good things',
  'compare.row.cons': 'Watch out for',
  'compare.yes': 'Yes',
  'compare.no': 'No',
  'compare.max': 'You can compare up to 3 tools.',

  'guide.back': 'Back to results',
  'guide.title': 'Get the most out of {name}',
  'guide.loading': 'Getting your setup guide ready…',
  'guide.error': 'We could not load the guide. Please try again.',
  'guide.does': 'What it does for you',
  'guide.setup': 'Setup checklist',
  'guide.setup.progress': '{done} of {total} steps done',
  'guide.setup.minutes': 'About {n} min',
  'guide.tips': 'Tips to get more value',
  'guide.tutorials': 'Tutorials and setup guides',
  'guide.type.video': 'Video',
  'guide.type.article': 'Article',
  'guide.connect': 'Connect it with what you use',
  'guide.connect.none': 'You told us you do not use other tools yet. You can skip this part.',
  'guide.connect.body': 'Look for "Integrations" or "Connected apps" in {name}. Then follow the steps below.',
  'guide.connect.s1': 'Open {name} and go to Settings, then Integrations.',
  'guide.connect.s2': 'Find {other} in the list and choose Connect.',
  'guide.connect.s3': 'Sign in to {other} when asked, and allow access.',
  'guide.connect.s4': 'Do one small test, such as a single customer, before you rely on it.',
  'guide.cost': 'Cost reminder',
  'guide.cost.try': 'Try free first. Most tools offer a free trial or free plan. Test with real work for a week before you pay.',
  'guide.cost.price': 'Starting price: {price}.',
  'guide.remind': 'Check back in 30 days',
  'guide.remind.body': 'After a month, ask yourself: is this saving me time? If not, cancel or try another tool.',
  'guide.remind.email': 'Email (optional)',
  'guide.remind.cta': 'Remind me',
  'guide.remind.thanks': 'Got it. We will remind you in 30 days. (Demo only: nothing was sent.)',
  'guide.second': 'Add a second tool',
  'guide.second.body': 'Some tools work even better together.',

  'how.title': 'How it works',
  'how.1': 'Tell us about your business and what is slowing you down.',
  'how.2': 'We search for AI tools and check prices, reviews and privacy.',
  'how.3': 'You get a short ranked list with plain-English reasons.',
  'how.4': 'Pick one and we walk you through setting it up.',
  'how.free': 'It is free to use. We do not take money to rank a tool higher.',
  'rank.title': 'How we rank',
  'rank.intro': 'Each tool gets a score from 0 to 100. The score is a mix of six things:',
  'rank.fit': 'Fit to your problem: does it solve what you described?',
  'rank.price': 'Price: is it within your budget?',
  'rank.reviews': 'Reviews: what do real customers say?',
  'rank.integrations': 'Works with your tools: will it connect to what you already use?',
  'rank.ease': 'Ease of setup: how fast can a busy person get going?',
  'rank.privacy': 'Privacy and trust: how careful is it with your customer data?',
  'rank.unpaid': 'No tool pays us to rank higher. If we are not sure about something, we say so with a confidence label.',
  'rank.weights': 'When you pick "Lowest price" or "Easiest setup", we give that item extra weight and re-sort the list.',

  'sba.title': 'Free help for small businesses',
  'sba.intro': 'Real people can help you for free or low cost.',
  'sba.sba': 'SBA.gov – guides, loans and local offices',
  'sba.sbdc': 'Find a local SBDC – free one-on-one advising',
  'sba.score': 'SCORE – free mentors who have run businesses',
  'common.close': 'Close',
  'common.loading': 'Loading…',
  'common.newTab': '(opens in a new tab)',
}

const es: Partial<Record<keyof typeof en, string>> = {
  'app.tagline': 'Encuentre la herramienta de IA adecuada para su negocio, en lenguaje sencillo.',
  'nav.how': 'Cómo funciona',
  'nav.sba': 'Recursos de la SBA',
  'nav.lang': 'Idioma',
  'nav.skip': 'Saltar al contenido principal',
  'intake.title': 'Cuéntenos qué le quita tiempo',
  'intake.back': 'Atrás',
  'intake.next': 'Siguiente',
  'intake.submit': 'Buscar mis herramientas',
  'loading.title': 'Buscando herramientas para usted',
  'loading.cancel': 'Cancelar',
  'card.choose': 'Elegir esta herramienta',
  'results.footer': 'Las clasificaciones no son anuncios pagados.',
}

export type TKey = keyof typeof en
const dict: Record<Lang, Partial<Record<TKey, string>>> = { en, es }

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey, vars?: Record<string, string | number>) => string
}
const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('rd.lang') as Lang) || 'en'
    } catch {
      return 'en'
    }
  })
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('rd.lang', l)
    } catch {
      /* ignore */
    }
  }, [])
  const t = useCallback<I18n['t']>(
    (key, vars) => {
      let s = dict[lang][key] ?? en[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
      return s
    },
    [lang],
  )
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useT() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useT outside I18nProvider')
  return c
}
