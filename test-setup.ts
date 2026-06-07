// Vitest setup: ensure a working localStorage in the test environment.
//
// Node 25 ships a stubbed `localStorage` global without methods, which
// shadows jsdom's implementation. Replace it with a simple in-memory
// Storage so the game's save/load + prestige code paths can run in tests.

class MemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length(): number {
    return this.store.size
  }
  clear(): void {
    this.store.clear()
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }
  removeItem(key: string): void {
    this.store.delete(key)
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

const memoryStorage = new MemoryStorage()
Object.defineProperty(globalThis, 'localStorage', {
  value: memoryStorage,
  writable: true,
  configurable: true,
})
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: memoryStorage,
    writable: true,
    configurable: true,
  })
}

// Reset between tests so save slots and prestige state don't leak.
import { beforeEach } from 'vitest'
beforeEach(() => {
  memoryStorage.clear()
})
