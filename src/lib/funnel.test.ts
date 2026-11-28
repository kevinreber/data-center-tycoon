import { describe, it, expect, beforeEach, vi } from 'vitest'
import { funnelEventsBetween, startFunnelTracking, trackFunnelEvent, resetFunnelForTests } from './funnel'
import type { FunnelState } from './funnel'
import * as analytics from './analytics'
import { useGameStore } from '@/stores/gameStore'

const base: FunnelState = {
  cabinets: [],
  spineSwitches: [],
  tickCount: 0,
  tutorialEnabled: true,
  tutorialCompleted: false,
  showWelcomeModal: true,
  isDemo: false,
}

describe('funnelEventsBetween', () => {
  it('reports the welcome modal choice', () => {
    expect(funnelEventsBetween(base, { ...base, showWelcomeModal: false })).toEqual(['tutorial_started'])
    expect(funnelEventsBetween(base, { ...base, showWelcomeModal: false, tutorialEnabled: false })).toEqual(['tutorial_skipped'])
  })

  it('reports the first cabinet, first spine, and tick 50', () => {
    const playing = { ...base, showWelcomeModal: false }
    expect(funnelEventsBetween(playing, { ...playing, cabinets: [{}] })).toEqual(['first_cabinet_placed'])
    expect(funnelEventsBetween(playing, { ...playing, spineSwitches: [{}] })).toEqual(['network_complete'])
    expect(funnelEventsBetween({ ...playing, tickCount: 49 }, { ...playing, tickCount: 50 })).toEqual(['tick_50_reached'])
  })

  it('reports tutorial completion', () => {
    expect(funnelEventsBetween(base, { ...base, tutorialCompleted: true })).toEqual(['tutorial_completed'])
  })

  it('ignores jumps from loading a save', () => {
    const playing = { ...base, showWelcomeModal: false }
    const loaded = { ...playing, cabinets: [{}, {}, {}], spineSwitches: [{}, {}], tickCount: 400 }
    expect(funnelEventsBetween(playing, loaded)).toEqual([])
  })

  it('ignores build milestones in demo mode', () => {
    const playing = { ...base, showWelcomeModal: false }
    expect(funnelEventsBetween(playing, { ...playing, isDemo: true, cabinets: [{}], spineSwitches: [{}] })).toEqual([])
  })
})

describe('funnel tracking', () => {
  beforeEach(() => {
    resetFunnelForTests()
    useGameStore.getState().resetGame()
    vi.restoreAllMocks()
  })

  it('sends each event once per page load', () => {
    const spy = vi.spyOn(analytics, 'trackEvent')
    trackFunnelEvent('game_started')
    trackFunnelEvent('game_started')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('game_started')
  })

  it('fires from real store actions', () => {
    const spy = vi.spyOn(analytics, 'trackEvent')
    const stop = startFunnelTracking(useGameStore)
    useGameStore.getState().skipTutorial()
    stop()
    expect(spy).toHaveBeenCalledWith('tutorial_skipped')
  })
})
