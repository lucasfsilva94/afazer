import { useSyncExternalStore } from 'react'

// Um único relógio compartilhado: "atrasada" muda com o tempo, sem um timer por linha.
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined
let snapshot = Date.now()

function subscribe(cb: () => void) {
  if (listeners.size === 0) {
    snapshot = Date.now()
    timer = setInterval(() => {
      snapshot = Date.now()
      listeners.forEach((l) => l())
    }, 30_000)
  }
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0) clearInterval(timer)
  }
}

export const useNow = (): Date => new Date(useSyncExternalStore(subscribe, () => snapshot))
