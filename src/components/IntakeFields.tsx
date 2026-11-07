import type { ReactNode } from 'react'
import type { Answers } from '../types'
import { BUDGETS, BUSINESS_TYPES, CATEGORIES, EXAMPLE_PROMPTS, SIZES } from '../options'
import { useT } from '../i18n'
import ChipInput from './ChipInput'
import MicButton from './MicButton'
import Duck from './Duck'

type Set = <K extends keyof Answers>(k: K, v: Answers[K]) => void
interface P { a: Answers; set: Set; error?: string; idPrefix?: string }

export const ErrorMsg = ({ id, children }: { id: string; children: ReactNode }) => (
  <p id={id} role="alert" className="err"><span aria-hidden="true">⚠</span>{children}</p>
)

export function BusinessField({ a, set, error, idPrefix = '' }: P) {
  const { t } = useT()
  return (
    <div>
      <label htmlFor={`${idPrefix}biz`} className="mb-2 block text-xl font-bold">{t('intake.bizType')}</label>
      <select
        id={`${idPrefix}biz`}
        className="field"
        value={a.businessType}
        aria-invalid={!!error && !a.businessType}
        aria-describedby={error ? `${idPrefix}biz-err` : undefined}
        onChange={(e) => set('businessType', e.target.value)}
      >
        <option value="">{t('intake.bizType.choose')}</option>
        {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      {a.businessType === 'Other' && (
        <div className="mt-4">
          <label htmlFor={`${idPrefix}biz-other`} className="mb-2 block font-bold">{t('intake.bizOther')}</label>
          <input id={`${idPrefix}biz-other`} className="field" value={a.businessOther} placeholder={t('intake.bizOther.ph')} onChange={(e) => set('businessOther', e.target.value)} />
        </div>
      )}
      {error && <ErrorMsg id={`${idPrefix}biz-err`}>{error}</ErrorMsg>}
    </div>
  )
}

function RadioTiles({ legend, name, options, value, onChange, error }: { legend: string; name: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="mb-2 text-xl font-bold">{legend}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((o) => (
          <label key={o} className="choice">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <ErrorMsg id={`${name}-err`}>{error}</ErrorMsg>}
    </fieldset>
  )
}

export function SizeBudgetFields({ a, set, idPrefix = '', errors }: P & { errors?: { size?: string; budget?: string } }) {
  const { t } = useT()
  return (
    <div className="space-y-8">
      <RadioTiles legend={t('intake.size')} name={`${idPrefix}size`} options={SIZES} value={a.size} onChange={(v) => set('size', v)} error={errors?.size} />
      <RadioTiles legend={t('intake.budget')} name={`${idPrefix}budget`} options={BUDGETS} value={a.budget} onChange={(v) => set('budget', v)} error={errors?.budget} />
    </div>
  )
}

export function ProblemField({ a, set, error, idPrefix = '' }: P) {
  const { t } = useT()
  const taId = `${idPrefix}problem-text`
  return (
    <div className="space-y-6">
      <p className="text-muted">{t('intake.problem.hint')}</p>
      <fieldset>
        <legend className="mb-2 text-xl font-bold">{t('intake.problem.chips')}</legend>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={a.categories.includes(c)}
              onClick={() => set('categories', a.categories.includes(c) ? a.categories.filter((x) => x !== c) : [...a.categories, c])}
              className={`min-h-[44px] rounded-full border-2 px-4 py-2 font-bold ${a.categories.includes(c) ? 'border-accent bg-accent text-onduck' : 'border-edge bg-surface hover:bg-elevated'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Duck size={72} className="hidden shrink-0 sm:block" />
        <div className="relative flex-1 rounded-3xl border-2 border-edge bg-elevated p-4 sm:before:absolute sm:before:-left-[11px] sm:before:top-8 sm:before:h-5 sm:before:w-5 sm:before:rotate-45 sm:before:border-b-2 sm:before:border-l-2 sm:before:border-edge sm:before:bg-elevated sm:before:content-['']">
        <label htmlFor={taId} className="mb-2 block text-xl font-bold">{t('intake.problem.text')}</label>
        <textarea
          id={taId}
          rows={4}
          className="field"
          value={a.freeText}
          placeholder={t('intake.problem.ph')}
          aria-invalid={!!error}
          aria-describedby={error ? `${idPrefix}problem-err` : undefined}
          onChange={(e) => set('freeText', e.target.value)}
        />
        <div className="mt-3"><MicButton onText={(p) => set('freeText', (a.freeText ? a.freeText.trimEnd() + ' ' : '') + p)} /></div>
        <p className="mb-2 mt-4 font-bold">{t('intake.problem.examples')}</p>
        <ul className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((ex) => (
            <li key={ex}>
              <button type="button" onClick={() => set('freeText', ex)} className="min-h-[44px] rounded-xl border-2 border-dashed border-edge bg-surface px-4 py-2 text-left hover:bg-line">
                “{ex}”
              </button>
            </li>
          ))}
        </ul>
        </div>
      </div>
      {error && <ErrorMsg id={`${idPrefix}problem-err`}>{error}</ErrorMsg>}
    </div>
  )
}

export function ExistingToolsField({ a, set, idPrefix = '' }: P) {
  const { t } = useT()
  const id = `${idPrefix}existing`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xl font-bold">{t('intake.existing')}</label>
      <ChipInput inputId={id} value={a.existingTools} onChange={(v) => set('existingTools', v)} />
    </div>
  )
}
