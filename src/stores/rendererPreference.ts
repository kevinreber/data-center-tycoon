// Hardware renderer preference (display setting, not game state: it is never
// written to save slots and survives resetGame / prestige).

export type RendererStyle = 'classic' | 'v2'

/** Flip to 'v2' to make the new hardware renderer the default for everyone */
export const DEFAULT_RENDERER_STYLE: RendererStyle = 'classic'

export const RENDERER_STORAGE_KEY = 'fabric-tycoon-renderer'

function isRendererStyle(value: unknown): value is RendererStyle {
  return value === 'classic' || value === 'v2'
}

/**
 * Initial renderer: `?renderer=v2|classic` wins (shareable test links, not
 * persisted), then the player's saved choice, then the default.
 */
export function loadRendererStyle(search: string = typeof window !== 'undefined' ? window.location.search : ''): RendererStyle {
  const fromUrl = new URLSearchParams(search).get('renderer')
  if (isRendererStyle(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(RENDERER_STORAGE_KEY)
    if (isRendererStyle(saved)) return saved
  } catch {
    // localStorage unavailable (private mode / sandboxed iframe)
  }
  return DEFAULT_RENDERER_STYLE
}

export function saveRendererStyle(style: RendererStyle) {
  try {
    if (style === DEFAULT_RENDERER_STYLE) localStorage.removeItem(RENDERER_STORAGE_KEY)
    else localStorage.setItem(RENDERER_STORAGE_KEY, style)
  } catch {
    // localStorage unavailable; the choice still applies for this session
  }
}

/**
 * The Settings toggle is hidden from production players while v2 is opt-in.
 * It shows in dev and Lab-enabled preview builds, once v2 is the default, or
 * whenever the active renderer differs from the default (so anyone who opted
 * in through a link can switch back).
 */
export function shouldShowRendererToggle(current: RendererStyle, env: { DEV: boolean; VITE_ENABLE_LAB?: string }): boolean {
  return env.DEV || env.VITE_ENABLE_LAB === 'true' || DEFAULT_RENDERER_STYLE === 'v2' || current !== DEFAULT_RENDERER_STYLE
}
