import 'fake-indexeddb/auto'
import { beforeEach } from 'vitest'

// Cada teste começa com banco e preferências limpos.
beforeEach(async () => {
  localStorage.clear()
  const { db } = await import('../src/db/schema')
  await db.open()
  await Promise.all(db.tables.map((t) => t.clear()))
})
