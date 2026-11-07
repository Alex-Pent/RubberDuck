import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

/* Web Speech API isn't in lib.dom types. */
type SR = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>; resultIndex: number }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}
const getSR = (): (new () => SR) | null => {
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Appends finished phrases to the text box. Hidden if the browser can't do it. */
export default function MicButton({ onText }: { onText: (phrase: string) => void }) {
  const { t, lang } = useT()
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(false)
  const rec = useRef<SR | null>(null)
  const Ctor = getSR()

  useEffect(() => () => rec.current?.stop(), [])
  if (!Ctor) return <p className="text-muted" role="note">{t('intake.mic.unsupported')}</p>

  const toggle = () => {
    if (listening) return rec.current?.stop()
    setError(false)
    const r = new Ctor()
    r.lang = lang === 'es' ? 'es-US' : 'en-US'
    r.interimResults = false
    r.continuous = false
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) onText(e.results[i][0].transcript.trim())
      }
    }
    r.onerror = () => { setError(true); setListening(false) }
    r.onend = () => setListening(false)
    rec.current = r
    setListening(true)
    r.start()
  }

  return (
    <div>
      <button type="button" onClick={toggle} aria-pressed={listening} className={listening ? 'btn-primary' : 'btn-secondary'}>
        <span aria-hidden="true">🎤</span>
        {listening ? t('intake.mic.stop') : t('intake.mic')}
      </button>
      <span role="status" className="ml-3 text-muted">
        {listening ? t('intake.mic.listening') : error ? t('intake.mic.error') : ''}
      </span>
    </div>
  )
}
