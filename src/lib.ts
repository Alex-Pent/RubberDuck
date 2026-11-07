import { useEffect, useRef } from 'react'
import type { Answers, SearchRequest } from './types'

export function toRequest(a: Answers): SearchRequest {
  return {
    businessType: a.businessType === 'Other' && a.businessOther.trim() ? a.businessOther.trim() : a.businessType,
    size: a.size,
    budget: a.budget,
    // The API takes one string, so several topics are joined with commas.
    category: a.categories.length ? a.categories.join(', ') : undefined,
    freeText: a.freeText.trim() || undefined,
    existingTools: a.existingTools,
  }
}

/** Set once the first screen has mounted, so only later screen changes move focus. */
export const boot = { done: false }

/** Move keyboard/screen-reader focus to a heading when a screen appears (not on first page load, so the skip link stays first). */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!boot.done) return
    ref.current?.focus()
    window.scrollTo({ top: 0 })
  }, [])
  return ref
}

export const fmtDate = (iso: string, lang = 'en') => {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function levelFor(n: number): 'great' | 'good' | 'fair' | 'weak' {
  return n >= 85 ? 'great' : n >= 70 ? 'good' : n >= 55 ? 'fair' : 'weak'
}
