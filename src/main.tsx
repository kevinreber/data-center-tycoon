import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'
import { useGameStore } from './stores/gameStore'

initAnalytics()

// Dev-only: expose the store on window so we can drive the app from playwright/devtools for screenshots & debugging.
if (import.meta.env.DEV) {
  ;(window as unknown as { __store: typeof useGameStore }).__store = useGameStore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
