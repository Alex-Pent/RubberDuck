/** Low-opacity decorative waves. Purely visual, hidden from assistive tech. */
export default function WaveDecor({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1200 40" preserveAspectRatio="none" className={`block h-8 w-full ${className}`}>
      <path d="M0 20 Q50 4 100 20 T200 20 T300 20 T400 20 T500 20 T600 20 T700 20 T800 20 T900 20 T1000 20 T1100 20 T1200 20" fill="none" stroke="#3DB8C9" strokeOpacity="0.22" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M0 30 Q50 14 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 T900 30 T1000 30 T1100 30 T1200 30" fill="none" stroke="#3DB8C9" strokeOpacity="0.12" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
