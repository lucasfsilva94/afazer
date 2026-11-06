const PATHS = {
  home: 'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6',
  list: 'M9 6h12M9 12h12M9 18h12 M3.5 6l1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2',
  cal: 'M3 10h18M8 3v4M16 3v4 M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5M12 7v5l3 2',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  repeat: 'M17 2l4 4-4 4 M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4 M21 13v2a3 3 0 0 1-3 3H3',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z',
  more: 'M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  x: 'M6 6l12 12M18 6L6 18',
  chevL: 'M15 5l-7 7 7 7',
  chevR: 'M9 5l7 7-7 7',
  tag: 'M3 12V4h8l10 10-8 8z M7.5 7.5v.01',
  alert: 'M12 3l10 18H2z M12 10v5M12 18v.5',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4z M10 21h4',
  sub: 'M5 4v10a3 3 0 0 0 3 3h11 M15 13l4 4-4 4',
  inbox: 'M3 13l3-8h12l3 8v6H3z M3 13h5l1 3h6l1-3h5',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  sparkle: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
}

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 18, strokeWidth = 1.75 }: { name: IconName; size?: number; strokeWidth?: number }) {
  return (
    <svg
      className="od-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

/** Barras 1–3 para a prioridade (não depende só de cor). */
export function PrioBars({ level }: { level: 1 | 2 | 3 }) {
  const bar = (i: number, h: number) => (
    <rect key={i} x={3 + i * 7} y={20 - h} width="5" height={h} rx="1" fill="currentColor" opacity={i < level ? 1 : 0.28} />
  )
  return (
    <svg className="od-icon" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      {bar(0, 8)}
      {bar(1, 13)}
      {bar(2, 18)}
    </svg>
  )
}
