import { useEffect, useId, useRef, useState } from 'react'
import { useT } from '../i18n'

/* Geometry (SVG user units). */
const W = 800
const H = 160
const BASE = 100
const STEP = 4
const PAD = 20
const DUCK_H = 84
const DUCK_W = Math.round((DUCK_H * 835) / 865)
const SUBMERGED = 0.3 // share of the duck's height that sits below the waterline

/* Wave. "+ w*t" makes the pattern travel right to left. */
const A1 = 10, K1 = (2 * Math.PI) / 260, W1 = 1.2
const A2 = 4, K2 = (2 * Math.PI) / 130, W2 = 1.9
const waveY = (x: number, t: number) => BASE + A1 * Math.sin(K1 * x + W1 * t) + A2 * Math.sin(K2 * x + W2 * t)
// A fainter second wave for depth (lower amplitude, different speed and wavelength).
const backY = (x: number, t: number) => BASE - 6 + 5 * Math.sin((2 * Math.PI / 340) * x + 0.8 * t + 1.3) + 2 * Math.sin((2 * Math.PI / 170) * x + 1.4 * t)

const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function line(fn: (x: number, t: number) => number, t: number) {
  let d = ''
  for (let x = -PAD; x <= W + PAD; x += STEP) d += `${d ? 'L' : 'M'}${x} ${fn(x, t).toFixed(2)} `
  return d
}

const CROSS_SECONDS = 8 // one trip across the pond
const OFF = DUCK_W // start/finish just off-screen so the wrap is never seen
const duckXAt = (time: number) => lerp(-OFF, W + OFF, (time % CROSS_SECONDS) / CROSS_SECONDS)

/** The duck glides across a moving wave every few seconds. The bar underneath shows `percent`. */
export default function PondProgress({ percent, className = '' }: { percent?: number; className?: string }) {
  const { t } = useT()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Refs to the SVG parts we update every frame (no React state per frame).
  const areaRef = useRef<SVGPathElement>(null) // clip for the submerged duck
  const fillRef = useRef<SVGPathElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const backRef = useRef<SVGPathElement>(null)
  const aboveClipRef = useRef<SVGPathElement>(null)
  const duckA = useRef<SVGGElement>(null)
  const duckB = useRef<SVGGElement>(null)
  const ripples = useRef<(SVGEllipseElement | null)[]>([])

  const render = useRef<(now: number, dt: number, still: boolean) => void>(() => {})

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Animation state lives in a ref created once. (Re-creating it on re-render made the duck jump at every status update.)
  const state = useRef({ y: BASE, rot: 0, lastRipple: -1, ripIdx: 0, rip: [] as { x: number; y: number; t0: number }[] })

  useEffect(() => {
    render.current = (tNow, dt, still) => {
      const s = state.current
      const time = tNow / 1000
      const x = still ? W / 2 : duckXAt(time)

      const base = line(waveY, time)
      const area = `${base}L${W + PAD} ${H} L${-PAD} ${H} Z`
      areaRef.current?.setAttribute('d', area)
      fillRef.current?.setAttribute('d', area)
      lineRef.current?.setAttribute('d', base)
      backRef.current?.setAttribute('d', line(backY, time))
      aboveClipRef.current?.setAttribute('d', `${base}L${W + PAD} -60 L${-PAD} -60 Z`)

      // Smooth, not twitchy: use the wave averaged over the duck's body, then ease toward it.
      const avgY = (waveY(x - 22, time) + waveY(x, time) + waveY(x + 22, time)) / 3
      const slope = Math.atan2(waveY(x + 22, time) - waveY(x - 22, time), 44) * (180 / Math.PI)
      let deg = 0
      if (still) {
        s.y = avgY
      } else {
        s.y = lerp(s.y, avgY, 1 - Math.pow(1 - 0.12, dt * 60))
        s.rot = lerp(s.rot, clamp(slope * 0.7, -14, 14), 1 - Math.pow(1 - 0.08, dt * 60))
        deg = s.rot
      }
      const lift = still ? 0 : Math.sin(time * 2.2) * 1
      const y = s.y + SUBMERGED * DUCK_H + lift
      const tf = `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)})`
      duckA.current?.setAttribute('transform', tf)
      duckB.current?.setAttribute('transform', tf)

      // Ripples at the waterline while the duck is on screen.
      if (!still) {
        if (tNow - s.lastRipple > 900 && x > 0 && x < W) {
          s.lastRipple = tNow
          s.rip[s.ripIdx % 3] = { x, y: waveY(x, time), t0: tNow }
          s.ripIdx++
        }
        for (let i = 0; i < 3; i++) {
          const el = ripples.current[i]
          const r = s.rip[i]
          if (!el || !r) continue
          const k = (tNow - r.t0) / 1200
          if (k >= 1) { el.setAttribute('opacity', '0'); continue }
          el.setAttribute('cx', r.x.toFixed(1))
          el.setAttribute('cy', r.y.toFixed(1))
          el.setAttribute('rx', (10 + 40 * k).toFixed(1))
          el.setAttribute('ry', (2 + 7 * k).toFixed(1))
          el.setAttribute('opacity', (0.6 * (1 - k)).toFixed(2))
        }
      } else {
        ripples.current.forEach((el) => el?.setAttribute('opacity', '0'))
      }
    }
  }, [])

  // Animated: one rAF loop, paused while the tab is hidden.
  useEffect(() => {
    if (reduced) return
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      render.current(now, Math.min(0.1, (now - last) / 1000), false)
      last = now
      raf = requestAnimationFrame(frame)
    }
    const start = () => { last = performance.now(); raf = requestAnimationFrame(frame) }
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) start() }
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis) }
  }, [reduced])

  // Reduced motion: draw one static frame. The bar and text carry the progress.
  useEffect(() => {
    if (reduced) render.current(0, 0, true)
  }, [reduced])

  const known = percent !== undefined
  const shown = known ? Math.round(clamp(percent, 0, 100)) : 0
  const label = t('loading.pond')

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={known ? shown : undefined}
      aria-valuetext={known ? `${shown}%` : t('loading.working')}
      className={className}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block w-full" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`above-${uid}`}><path ref={aboveClipRef} d="" /></clipPath>
          <clipPath id={`below-${uid}`}><path ref={areaRef} d="" /></clipPath>
        </defs>

        <path ref={backRef} d="" fill="none" stroke="#3DB8C9" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={fillRef} d="" fill="#3DB8C9" fillOpacity="0.15" />

        {/* Duck: the part above the water is solid, the part under it is dimmed so it sits IN the water. */}
        <g clipPath={`url(#above-${uid})`}>
          <g ref={duckA} transform={`translate(${-DUCK_W} ${BASE})`}>
            <use href="#duck-art" x={-DUCK_W / 2} y={-DUCK_H} width={DUCK_W} height={DUCK_H} />
          </g>
        </g>
        <g clipPath={`url(#below-${uid})`} opacity="0.35">
          <g ref={duckB} transform={`translate(${-DUCK_W} ${BASE})`}>
            <use href="#duck-art" x={-DUCK_W / 2} y={-DUCK_H} width={DUCK_W} height={DUCK_H} />
          </g>
        </g>

        {[0, 1, 2].map((i) => (
          <ellipse key={i} ref={(el) => { ripples.current[i] = el }} cx="0" cy="0" rx="10" ry="2" fill="none" stroke="#3DB8C9" strokeWidth="2" opacity="0" />
        ))}
        <path ref={lineRef} d="" fill="none" stroke="#3DB8C9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="mt-1 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full border border-edge bg-elevated" aria-hidden="true">
          <div className="h-full rounded-full bg-info" style={{ width: known ? `${shown}%` : '0%' }} />
        </div>
        <p className="min-w-[4.5rem] text-right font-bold tabular-nums">{known ? `${shown}%` : t('loading.working')}</p>
      </div>
    </div>
  )
}
