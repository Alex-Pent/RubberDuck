import { useId, useState } from 'react'
import type { Breakdown } from '../types'
import { useT, type TKey } from '../i18n'
import { levelFor } from '../lib'

const KEYS: (keyof Breakdown)[] = ['fit', 'price', 'reviews', 'integrations', 'easeOfSetup', 'privacy']

export default function ScoreBreakdown({ breakdown }: { breakdown: Breakdown }) {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div>
      <button type="button" className="no-print btn-ghost -ml-3" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        {open ? t('card.hideDetails') : t('card.details')}
      </button>
      <div id={id} hidden={!open} className="print-show">
        <h4 className="mb-2 font-bold">{t('breakdown.title')}</h4>
        <ul className="space-y-3">
          {KEYS.map((k) => {
            const v = breakdown[k]
            const level = t(`breakdown.level.${levelFor(v)}` as TKey)
            return (
              <li key={k}>
                <div className="flex justify-between gap-3">
                  <span>{t(`breakdown.${k}` as TKey)}</span>
                  <span className="font-bold">{v}/100 · {level}</span>
                </div>
                <div role="meter" aria-label={t(`breakdown.${k}` as TKey)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} aria-valuetext={`${v} out of 100, ${level}`} className="mt-1 h-3 overflow-hidden rounded-full border border-edge bg-surface">
                  <div className="h-full bg-info" style={{ width: `${v}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
