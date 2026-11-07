import { useState } from 'react'
import type { Answers } from '../types'
import { useT } from '../i18n'
import { useFocusOnMount } from '../lib'
import Duck from './Duck'
import { BusinessField, ExistingToolsField, ProblemField, SizeBudgetFields } from './IntakeFields'

const TOTAL = 4

export default function IntakeWizard({
  answers,
  setAnswers,
  onSubmit,
}: {
  answers: Answers
  setAnswers: (a: Answers) => void
  onSubmit: () => void
}) {
  const { t } = useT()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<{ biz?: string; size?: string; budget?: string; problem?: string }>({})
  const h1 = useFocusOnMount<HTMLHeadingElement>()
  const [stepHeading, setStepHeading] = useState<HTMLHeadingElement | null>(null)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers({ ...answers, [k]: v })
  const titles = [t('intake.s1'), t('intake.s2'), t('intake.s3'), t('intake.s4')]

  const validate = (s: number) => {
    const e: typeof errors = {}
    if (s === 1) {
      if (!answers.businessType) e.biz = t('intake.err.biz')
      else if (answers.businessType === 'Other' && !answers.businessOther.trim()) e.biz = t('intake.err.bizOther')
    }
    if (s === 2) {
      if (!answers.size) e.size = t('intake.err.size')
      if (!answers.budget) e.budget = t('intake.err.budget')
    }
    if (s === 3 && answers.categories.length === 0 && !answers.freeText.trim()) e.problem = t('intake.err.problem')
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const go = (n: number) => {
    setStep(n)
    // Move focus to the new step's heading so screen readers announce it.
    setTimeout(() => stepHeading?.focus(), 0)
  }
  const next = () => validate(step) && go(step + 1)
  const submit = () => {
    for (const s of [1, 2, 3]) if (!validate(s)) return go(s)
    onSubmit()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]">
            <circle cx="100" cy="125" r="55" fill="none" stroke="#3DB8C9" strokeOpacity="0.18" strokeWidth="2" />
            <circle cx="100" cy="125" r="75" fill="none" stroke="#3DB8C9" strokeOpacity="0.1" strokeWidth="2" />
          </svg>
          <Duck size={160} animate="bob" className="relative" />
        </div>
        <div className="relative rounded-2xl border-2 border-line bg-surface p-5 shadow-sm sm:before:absolute sm:before:-left-[11px] sm:before:top-1/2 sm:before:-mt-2.5 sm:before:h-5 sm:before:w-5 sm:before:rotate-45 sm:before:border-b-2 sm:before:border-l-2 sm:before:border-line sm:before:bg-surface sm:before:content-['']">
          <h1 ref={h1} tabIndex={-1} className="mb-2 text-3xl sm:text-4xl">{t('intake.title')}</h1>
          <p className="text-muted">{t('intake.intro')}</p>
        </div>
      </div>

      <nav aria-label={t('intake.progress')} className="mb-6">
        <ol className="grid grid-cols-4 gap-2">
          {titles.map((title, i) => {
            const n = i + 1
            const state = n < step ? 'done' : n === step ? 'current' : 'todo'
            return (
              <li key={title} aria-current={state === 'current' ? 'step' : undefined}>
                <div className={`h-2 rounded-full ${state === 'todo' ? 'bg-line' : 'bg-accent'}`} />
                <p className={`mt-1 hidden text-sm sm:block ${state === 'current' ? 'font-bold' : 'text-muted'}`}>
                  {state === 'done' && <span aria-hidden="true">✓ </span>}{title}
                </p>
              </li>
            )
          })}
        </ol>
        <p className="mt-2 font-bold sm:hidden">{t('intake.step', { n: step, total: TOTAL })}: {titles[step - 1]}</p>
        <p className="mt-2 hidden text-muted sm:block">{t('intake.step', { n: step, total: TOTAL })}</p>
      </nav>

      <form
        className="card space-y-6"
        noValidate
        onSubmit={(e) => { e.preventDefault(); step < TOTAL ? next() : submit() }}
      >
        <h2 ref={setStepHeading} tabIndex={-1} className="text-2xl">{titles[step - 1]}</h2>
        {step === 1 && <BusinessField a={answers} set={set} error={errors.biz} />}
        {step === 2 && <SizeBudgetFields a={answers} set={set} errors={errors} />}
        {step === 3 && <ProblemField a={answers} set={set} error={errors.problem} />}
        {step === 4 && <ExistingToolsField a={answers} set={set} />}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          {step > 1 ? <button type="button" className="btn-secondary" onClick={() => go(step - 1)}>{t('intake.back')}</button> : <span />}
          {step < TOTAL ? (
            <button type="submit" className="btn-primary">{t('intake.next')}</button>
          ) : (
            <button type="submit" className="btn-primary text-lg">{t('intake.submit')}</button>
          )}
        </div>
      </form>
    </div>
  )
}
