const pad = (n: number) => String(n).padStart(2, '0')

/** Data local como YYYY-MM-DD. */
export const ymd = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Hora local como HH:mm. */
export const hm = (d: Date): string => `${pad(d.getHours())}:${pad(d.getMinutes())}`

export const parseYmd = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayStr = (now: Date = new Date()): string => ymd(now)

export const addDays = (s: string, n: number): string => {
  const d = parseYmd(s)
  d.setDate(d.getDate() + n)
  return ymd(d)
}

export const daysInMonth = (y: number, m0: number): number => new Date(y, m0 + 1, 0).getDate()

/** Soma meses mantendo o dia, ou o último dia do mês quando ele é mais curto. */
export const addMonths = (s: string, n: number): string => {
  const [y, m, d] = s.split('-').map(Number)
  const total = y * 12 + (m - 1) + n
  const ny = Math.floor(total / 12)
  const nm = total % 12
  return `${ny}-${pad(nm + 1)}-${pad(Math.min(d, daysInMonth(ny, nm)))}`
}

/** Último instante do dia (23:59:59.999). */
export const endOfDay = (s: string): Date => {
  const d = parseYmd(s)
  d.setHours(23, 59, 59, 999)
  return d
}

/** Instante do prazo: data + horário, ou o fim do dia quando não há horário. */
export const dueInstant = (dueDate: string, dueTime: string | null): Date => {
  if (!dueTime) return endOfDay(dueDate)
  const [h, mi] = dueTime.split(':').map(Number)
  const d = parseYmd(dueDate)
  d.setHours(h, mi, 0, 0)
  return d
}

export const DEFAULT_REMINDER_TIME = '09:00'

/** Instante do aviso: prazo (09:00 se não houver horário) menos os minutos. */
export const reminderAt = (dueDate: string, dueTime: string | null, minutesBefore: number): number => {
  const [h, mi] = (dueTime ?? DEFAULT_REMINDER_TIME).split(':').map(Number)
  const d = parseYmd(dueDate)
  d.setHours(h, mi, 0, 0)
  return d.getTime() - minutesBefore * 60_000
}

const short = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })
const long = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

export const fmtShort = (s: string) => short.format(parseYmd(s)).replace(/\./g, '')
export const fmtLong = (s: string) => long.format(parseYmd(s))
export const fmtMonth = (y: number, m0: number) => monthYear.format(new Date(y, m0, 1))

/** Hoje / Amanhã / Ontem / "5 nov", com horário quando existe. */
export const dueLabel = (dueDate: string, dueTime: string | null, now: Date = new Date()): string => {
  const t = todayStr(now)
  const base =
    dueDate === t ? 'Hoje' : dueDate === addDays(t, 1) ? 'Amanhã' : dueDate === addDays(t, -1) ? 'Ontem' : fmtShort(dueDate)
  return dueTime ? `${base}, ${dueTime}` : base
}

/** Domingo da semana de uma data. */
export const weekStart = (s: string): string => addDays(s, -parseYmd(s).getDay())
