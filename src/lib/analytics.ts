declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const DEFAULT_MEASUREMENT_ID = 'G-M4NL7V305J'
const envId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const measurementId = envId && envId.length > 0 ? envId : DEFAULT_MEASUREMENT_ID

const hasValidId = (id: string | undefined): id is string =>
  typeof id === 'string' && id.startsWith('G-') && id.length > 2

let initialized = false

export const initAnalytics = (): void => {
  if (initialized) return
  if (typeof window === 'undefined') return
  if (!hasValidId(measurementId)) return

  window.dataLayer = window.dataLayer || []
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args)
  }
  window.gtag = gtag

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', measurementId, { send_page_view: true })

  initialized = true
}

export const isAnalyticsEnabled = (): boolean =>
  initialized && typeof window !== 'undefined' && typeof window.gtag === 'function'

export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsEnabled()) return
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  })
}

export { measurementId as gaMeasurementId }
