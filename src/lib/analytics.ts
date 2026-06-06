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

const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug_mode') === 'true'
}

let initialized = false

export const initAnalytics = (): void => {
  if (initialized) return
  if (typeof window === 'undefined') return
  if (!hasValidId(measurementId)) return

  window.dataLayer = window.dataLayer || []
  // Must push the Arguments object (not a real Array). gtag.js's command processor
  // checks for arguments-shape when reading queued 'js'/'config' entries; pushing
  // a real Array silently fails to initialize the tag.
  const gtag: Window['gtag'] = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag = gtag

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: true,
    debug_mode: isDebugMode(),
  })

  if (isDebugMode()) {
    console.log('[GA] initialized', { measurementId, debug_mode: true })
  }

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
