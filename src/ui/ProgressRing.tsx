/** Anel de progresso em SVG. `value` vai de 0 a 1. */
export function ProgressRing({ value, size = 120, label }: { value: number; size?: number; label: string }) {
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  const pct = Math.round(v * 100)
  return (
    <div className="ring" role="img" aria-label={`${label}: ${pct}%`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="trk" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="val"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
        />
      </svg>
      <div className="ring-txt" aria-hidden="true">
        {pct}%
      </div>
    </div>
  )
}
