import { useId } from 'react'
import { DUCK_PATHS, DUCK_VIEWBOX } from './duckArt'

/** Mount once near the app root. Defines the artwork that every <Duck /> references. */
export function DuckSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <symbol id="duck-art" viewBox={DUCK_VIEWBOX} dangerouslySetInnerHTML={{ __html: DUCK_PATHS }} />
    </svg>
  )
}

export type DuckAnimate = 'none' | 'bob'

/** The mascot, inlined. Animations are CSS-only and switch off under prefers-reduced-motion. */
export default function Duck({
  size = 120,
  className = '',
  animate = 'none',
  title,
}: {
  size?: number
  className?: string
  animate?: DuckAnimate
  /** Give a text description only when the duck carries meaning; otherwise it is hidden from screen readers. */
  title?: string
}) {
  const titleId = useId()
  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 835 865"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className="block"
    >
      {title && <title id={titleId}>{title}</title>}
      <use href="#duck-art" />
    </svg>
  )

  if (animate === 'bob') {
    return (
      <span className={`duck-bob relative inline-block ${className}`} style={{ width: size, height: size + 8 }}>
        <span className="duck-bob-body block">{svg}</span>
        <svg aria-hidden="true" viewBox="0 0 100 12" className="duck-ripple absolute bottom-0 left-0 w-full" focusable="false">
          <ellipse cx="50" cy="6" rx="38" ry="4" fill="none" stroke="#3DB8C9" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </span>
    )
  }

  return <span className={`inline-block ${className}`}>{svg}</span>
}
