export interface Bar {
  label: string
  value: number
  highlight?: boolean
}

const W = 720
const H = 240
const PAD = { l: 36, r: 12, t: 28, b: 32 }

/** Gráfico de barras em SVG, com grade, eixo Y, valor sobre a barra e rótulo acessível. */
export function BarChart({ data, title }: { data: Bar[]; title: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const top = Math.max(4, Math.ceil(max / 4) * 4) // eixo em passos inteiros
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const slot = iw / Math.max(1, data.length)
  const bw = Math.min(40, slot * 0.6)
  const y = (v: number) => PAD.t + ih - (v / top) * ih
  const summary = `${title}. ${data.map((d) => `${d.label}: ${d.value}`).join('; ')}`

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
      <title>{title}</title>
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (top / 4) * i
        return (
          <g key={i}>
            <line className="grid-l" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = PAD.l + slot * i + (slot - bw) / 2
        const h = (d.value / top) * ih
        return (
          <g key={i}>
            <rect className={`b${d.highlight ? ' now' : ''}`} x={x} y={y(d.value)} width={bw} height={h} rx="3" />
            {d.value > 0 && (
              <text className="val-t" x={x + bw / 2} y={y(d.value) - 6} textAnchor="middle">
                {d.value}
              </text>
            )}
            <text className={d.highlight ? 'lbl-now' : undefined} x={x + bw / 2} y={H - 10} textAnchor="middle">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
