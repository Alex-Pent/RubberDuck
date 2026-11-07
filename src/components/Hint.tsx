import type { ReactNode } from 'react'

/**
 * A "?" button that opens a plain-English note. The note is rendered inline by <HintNote>
 * (not as a floating popup), so it works at 200% zoom, on phones and with keyboards.
 */
export function HintButton({ term, id, open, onToggle, className = 'ml-1' }: { term: string; id: string; open: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      aria-label={`What does "${term}" mean?`}
      onClick={onToggle}
      className={`no-print inline-flex h-11 w-11 items-center justify-center rounded-full align-middle ${className}`}
    >
      <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold ${open ? 'border-accent bg-accent text-onduck' : 'border-edge text-ink'}`}>?</span>
    </button>
  )
}

export function HintNote({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  return (
    <p id={id} hidden={!open} className="no-print mt-2 rounded-xl border border-line bg-elevated p-3 text-base font-normal text-ink">
      {children}
    </p>
  )
}
