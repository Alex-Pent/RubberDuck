import { useId, useState } from 'react'
import { TOOL_SUGGESTIONS } from '../options'
import { useT } from '../i18n'

export default function ChipInput({
  value,
  onChange,
  inputId,
}: {
  value: string[]
  onChange: (v: string[]) => void
  inputId: string
}) {
  const { t } = useT()
  const [text, setText] = useState('')
  const [active, setActive] = useState(-1)
  const [open, setOpen] = useState(false)
  const listId = useId()
  const has = (n: string) => value.some((v) => v.toLowerCase() === n.toLowerCase())
  const suggestions = TOOL_SUGGESTIONS.filter((s) => !has(s) && s.toLowerCase().includes(text.trim().toLowerCase()))

  const add = (raw: string) => {
    const name = raw.trim()
    if (!name || has(name)) return setText('')
    // "None" and real tools exclude each other.
    const isNone = name.toLowerCase() === 'none'
    const next = isNone ? ['None'] : [...value.filter((v) => v !== 'None'), name]
    onChange(next)
    setText('')
    setActive(-1)
  }
  const remove = (n: string) => onChange(value.filter((v) => v !== n))

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2" aria-label={t('intake.existing')}>
          {value.map((v) => (
            <li key={v} className="flex items-center rounded-full bg-accent-soft pl-4 font-bold text-accent">
              {v}
              <button type="button" onClick={() => remove(v)} aria-label={t('intake.existing.remove', { name: v })} className="ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-lg hover:bg-white">
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <input
          id={inputId}
          className="field"
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-describedby={`${inputId}-help`}
          autoComplete="off"
          placeholder={t('intake.existing.ph')}
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onBlur={() => { setOpen(false); if (text.trim()) add(text) }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(suggestions.length - 1, a + 1)) }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
            else if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(active >= 0 ? suggestions[active] : text)
            } else if (e.key === 'Escape') setOpen(false)
            else if (e.key === 'Backspace' && !text && value.length) remove(value[value.length - 1])
          }}
        />
        <ul id={listId} role="listbox" aria-label="Suggestions" hidden={!(open && suggestions.length > 0)} className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border-2 border-[#6B7280] bg-white shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={s}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); add(s) }}
              className={`flex min-h-[44px] cursor-pointer items-center px-4 ${i === active ? 'bg-accent text-white' : 'hover:bg-accent-soft'}`}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
      <p id={`${inputId}-help`} className="mt-2 text-muted">{t('intake.existing.help')}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick add">
        {TOOL_SUGGESTIONS.filter((s) => !has(s)).map((s) => (
          <button key={s} type="button" onClick={() => add(s)} aria-label={t('intake.existing.add', { name: s })} className="min-h-[44px] rounded-full border-2 border-dashed border-[#6B7280] bg-white px-4 font-bold hover:bg-accent-soft">
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}
