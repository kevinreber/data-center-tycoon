import { trackEvent } from './analytics'

export type FunnelEvent =
  | 'game_started'
  | 'tutorial_started'
  | 'tutorial_skipped'
  | 'first_cabinet_placed'
  | 'network_complete'
  | 'tick_50_reached'
  | 'tutorial_completed'

export interface FunnelState {
  cabinets: readonly unknown[]
  spineSwitches: readonly unknown[]
  tickCount: number
  tutorialEnabled: boolean
  tutorialCompleted: boolean
  showWelcomeModal: boolean
  isDemo: boolean
}

/**
 * Milestones crossed between two store snapshots. Transitions are exact
 * (0 to 1 cabinet, tick 49 to 50) so loading a save or the demo, which jumps
 * straight to a built floor, does not count as the player reaching them.
 */
export function funnelEventsBetween(prev: FunnelState, next: FunnelState): FunnelEvent[] {
  const events: FunnelEvent[] = []

  if (prev.showWelcomeModal && !next.showWelcomeModal) {
    events.push(next.tutorialEnabled ? 'tutorial_started' : 'tutorial_skipped')
  }
  if (!prev.tutorialCompleted && next.tutorialCompleted) events.push('tutorial_completed')

  if (next.isDemo) return events

  if (prev.cabinets.length === 0 && next.cabinets.length === 1) events.push('first_cabinet_placed')
  if (prev.spineSwitches.length === 0 && next.spineSwitches.length === 1) events.push('network_complete')
  if (prev.tickCount === 49 && next.tickCount === 50) events.push('tick_50_reached')

  return events
}

const sent = new Set<FunnelEvent>()

/** Sends each funnel event at most once per page load. */
export function trackFunnelEvent(event: FunnelEvent): void {
  if (sent.has(event)) return
  sent.add(event)
  trackEvent(event)
}

interface SubscribableStore {
  getState: () => FunnelState
  subscribe: (listener: (state: FunnelState, prev: FunnelState) => void) => () => void
}

export function startFunnelTracking(store: SubscribableStore): () => void {
  return store.subscribe((state, prev) => {
    for (const event of funnelEventsBetween(prev, state)) trackFunnelEvent(event)
  })
}

export function resetFunnelForTests(): void {
  sent.clear()
}
