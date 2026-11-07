import { useId } from 'react'

export type DuckAnimate = 'none' | 'bob' | 'paddle'

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
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className="block"
    >
      {title && <title id={titleId}>{title}</title>}
      <ellipse cx="100" cy="176" rx="72" ry="8" fill="#3DB8C9" opacity="0.25" />
      <path d="M46 116 Q20 100 28 76 Q52 86 62 106 Z" fill="#FFC93C" />
      <path d="M40 120 C40 92 70 84 100 86 C140 88 160 110 156 134 C152 160 124 172 96 172 C62 172 40 152 40 120 Z" fill="#FFC93C" />
      <circle cx="128" cy="64" r="32" fill="#FFC93C" />
      <path d="M154 62 C170 57 184 61 187 70 C184 79 168 81 154 76 Z" fill="#FF8A3D" />
      <circle cx="144" cy="72" r="5" fill="#FF8A3D" opacity="0.35" />
      <circle cx="137" cy="56" r="4.5" fill="#0F1219" />
      <circle cx="138.6" cy="54.4" r="1.4" fill="#FFFFFF" />
      <path d="M68 120 C82 102 116 106 126 126 C116 144 80 146 68 120 Z" fill="#E8A91F" />
      <ellipse cx="114" cy="44" rx="9" ry="5" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 114 44)" />
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

  if (animate === 'paddle') {
    return (
      <div className={`duck-lane relative w-full overflow-hidden ${className}`} style={{ height: size + 16 }} aria-hidden="true">
        <span className="duck-paddle absolute top-0" style={{ ['--duck' as string]: `${size}px` }}>{svg}</span>
        <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-4 w-full" focusable="false">
          <path d="M0 8 Q25 0 50 8 T100 8 T150 8 T200 8 T250 8 T300 8 T350 8 T400 8" fill="none" stroke="#3DB8C9" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    )
  }

  return <span className={`inline-block ${className}`}>{svg}</span>
}
