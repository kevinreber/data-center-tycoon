import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // The Hardware Lab (lab.html) is a dev/preview-only page. It is always
  // served by the dev server, but production builds only include it when
  // VITE_ENABLE_LAB=true (set for Vercel Preview deployments only).
  const includeLab = command === 'serve' || env.VITE_ENABLE_LAB === 'true'

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          ...(includeLab ? { lab: path.resolve(__dirname, 'lab.html') } : {}),
        },
        output: {
          manualChunks: {
            phaser: ['phaser'],
          },
        },
      },
    },
  }
})
