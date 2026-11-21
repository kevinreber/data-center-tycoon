import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_RENDERER_STYLE, RENDERER_STORAGE_KEY, loadRendererStyle, saveRendererStyle, shouldShowRendererToggle } from './rendererPreference'
import { useGameStore } from './gameStore'

const OTHER = DEFAULT_RENDERER_STYLE === 'classic' ? 'v2' : 'classic'

describe('renderer preference', () => {
  beforeEach(() => localStorage.clear())

  it('defaults when nothing is set or the stored value is junk', () => {
    expect(loadRendererStyle('')).toBe(DEFAULT_RENDERER_STYLE)
    localStorage.setItem(RENDERER_STORAGE_KEY, 'fancy')
    expect(loadRendererStyle('')).toBe(DEFAULT_RENDERER_STYLE)
    expect(loadRendererStyle('?renderer=fancy')).toBe(DEFAULT_RENDERER_STYLE)
  })

  it('URL parameter overrides the saved choice without persisting it', () => {
    saveRendererStyle(OTHER)
    expect(loadRendererStyle(`?renderer=${DEFAULT_RENDERER_STYLE}`)).toBe(DEFAULT_RENDERER_STYLE)
    expect(localStorage.getItem(RENDERER_STORAGE_KEY)).toBe(OTHER)
    localStorage.clear()
    expect(loadRendererStyle(`?demo=true&renderer=${OTHER}`)).toBe(OTHER)
    expect(localStorage.getItem(RENDERER_STORAGE_KEY)).toBeNull()
  })

  it('saves non-default choices and clears the key for the default', () => {
    saveRendererStyle(OTHER)
    expect(loadRendererStyle('')).toBe(OTHER)
    saveRendererStyle(DEFAULT_RENDERER_STYLE)
    expect(localStorage.getItem(RENDERER_STORAGE_KEY)).toBeNull()
  })

  it('shows the Settings toggle in dev, preview, or when the player opted in', () => {
    const prod = { DEV: false }
    expect(shouldShowRendererToggle(OTHER, prod)).toBe(true)
    expect(shouldShowRendererToggle(DEFAULT_RENDERER_STYLE, { DEV: true })).toBe(true)
    expect(shouldShowRendererToggle(DEFAULT_RENDERER_STYLE, { DEV: false, VITE_ENABLE_LAB: 'true' })).toBe(true)
    // Production players on the default only see it once v2 is the default
    expect(shouldShowRendererToggle(DEFAULT_RENDERER_STYLE, prod)).toBe(DEFAULT_RENDERER_STYLE === 'v2')
  })

  it('store action updates state, persists, and survives resetGame', () => {
    useGameStore.getState().setRendererStyle(OTHER)
    expect(useGameStore.getState().rendererStyle).toBe(OTHER)
    expect(localStorage.getItem(RENDERER_STORAGE_KEY)).toBe(OTHER)
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().rendererStyle).toBe(OTHER)
    useGameStore.getState().setRendererStyle(DEFAULT_RENDERER_STYLE)
  })
})
