import { useEffect, useRef, type ReactNode } from 'react'
import { useT } from '../i18n'

/** Uses the native <dialog>: focus trap, Esc to close, and focus return come built in. */
export default function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const { t } = useT()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  const id = `dlg-${title.replace(/\W+/g, '-')}`
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-auto rounded-2xl bg-white p-0 text-ink shadow-xl ${wide ? 'max-w-5xl' : 'max-w-xl'}`}
    >
      {open && (
        <div className="p-5 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={id} className="text-2xl">{title}</h2>
            <button type="button" className="btn-secondary shrink-0" onClick={onClose}>
              {t('common.close')}
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
