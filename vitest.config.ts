import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Node 25 ships a stubbed `localStorage` global without methods, which
    // shadows jsdom's implementation. test-setup.ts replaces it with an
    // in-memory Storage so save/load + prestige tests can exercise persistence.
    setupFiles: ['./test-setup.ts'],
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
