import type { ReactNode } from 'react'
import { useT } from '../i18n'
import Duck from './Duck'
import WaveDecor from './WaveDecor'

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
  const { t } = useT()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-5 focus:py-3 focus:font-bold focus:text-onduck"
      >
        {t('nav.skip')}
      </a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <button type="button" onClick={onHome} aria-label={t('nav.home')} className="flex min-h-[44px] items-center gap-2 rounded-full px-2 text-xl font-bold text-ink">
            <Duck size={36} />
            {t('app.name')}
          </button>
          <nav aria-label={t('nav.main')}>
            <ul className="flex flex-wrap items-center gap-1 sm:gap-3">
              <li><button type="button" className="btn-ghost" onClick={onHow}>{t('nav.how')}</button></li>
              <li><button type="button" className="btn-ghost" onClick={onRank}>{t('results.howRank')}</button></li>
              <li><button type="button" className="btn-ghost" onClick={onSba}>{t('nav.sba')}</button></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="mt-8 bg-surface">
        <WaveDecor />
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-muted">
          <div>
            <p>{t('results.footer')}</p>
            <p className="mt-1 flex items-center gap-2 text-sm"><Duck size={24} />{t('footer.credit')}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
