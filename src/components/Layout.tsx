import type { ReactNode } from 'react'
import { useT, type Lang } from '../i18n'

export default function Layout({
  children,
  onHome,
  onHow,
  onSba,
  onRank,
}: {
  children: ReactNode
  onHome: () => void
  onHow: () => void
  onSba: () => void
  onRank: () => void
}) {
  const { t, lang, setLang } = useT()
  const langs: { code: Lang; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' },
  ]
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        {t('nav.skip')}
      </a>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <button type="button" onClick={onHome} aria-label={t('nav.home')} className="flex min-h-[44px] items-center gap-2 rounded-xl px-1 text-xl font-bold text-accent">
            <span aria-hidden="true" className="text-2xl">🦆</span>
            {t('app.name')}
          </button>
          <nav aria-label={t('nav.main')}>
            <ul className="flex flex-wrap items-center gap-1 sm:gap-3">
              <li><button type="button" className="btn-ghost" onClick={onHow}>{t('nav.how')}</button></li>
              <li><button type="button" className="btn-ghost" onClick={onSba}>{t('nav.sba')}</button></li>
              <li>
                <div role="group" aria-label={t('nav.lang')} className="flex overflow-hidden rounded-xl border-2 border-accent">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      lang={l.code}
                      aria-pressed={lang === l.code}
                      aria-label={l.name}
                      onClick={() => setLang(l.code)}
                      className={`min-h-[44px] min-w-[44px] px-3 font-bold ${lang === l.code ? 'bg-accent text-white' : 'bg-white text-accent hover:bg-accent-soft'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="mt-8 border-t border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-muted">
          <p>{t('results.footer')}</p>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={onRank}>{t('results.howRank')}</button>
            <button type="button" className="btn-ghost" onClick={onSba}>{t('nav.sba')}</button>
          </div>
        </div>
      </footer>
    </>
  )
}
