import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore, getPlacementHints } from './gameStore'

// Reset store state before each test
beforeEach(() => {
  useGameStore.setState(useGameStore.getInitialState())
})

describe('cabinet placement', () => {
  describe('addCabinet', () => {
    it('places a cabinet at the specified grid position', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, 0, 'production', 'general', 'north')

      const state = useGameStore.getState()
      expect(state.cabinets).toHaveLength(1)
      expect(state.cabinets[0].col).toBe(0)
      expect(state.cabinets[0].row).toBe(0)
      expect(state.cabinets[0].environment).toBe('production')
      expect(state.cabinets[0].customerType).toBe('general')
      expect(state.cabinets[0].facing).toBe('north')
      expect(state.cabinets[0].serverCount).toBe(1)
      expect(state.cabinets[0].powerStatus).toBe(true)
    })

    it('deducts the cabinet cost from player money', () => {
      const moneyBefore = useGameStore.getState().money

      useGameStore.getState().addCabinet(0, 0, 'production')

      const moneyAfter = useGameStore.getState().money
      expect(moneyAfter).toBe(moneyBefore - 2000)
    })

    it('exits placement mode after placing a cabinet', () => {
      const { enterPlacementMode, addCabinet } = useGameStore.getState()

      enterPlacementMode('production', 'general')
      expect(useGameStore.getState().placementMode).toBe(true)

      addCabinet(0, 0, 'production')
      expect(useGameStore.getState().placementMode).toBe(false)
    })

    it('rejects placement on an occupied tile', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, 0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(1)

      // Try to place on the same tile
      useGameStore.getState().addCabinet(0, 0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(1)
    })

    it('rejects placement outside grid bounds', () => {
      // Starter tier grid is 5x5
      const { addCabinet } = useGameStore.getState()

      addCabinet(5, 0, 'production') // col out of bounds (max col = 4)
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      addCabinet(0, 5, 'production') // row out of bounds (max row = 4)
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      addCabinet(-1, 0, 'production') // negative col
      expect(useGameStore.getState().cabinets).toHaveLength(0)
    })

    it('rejects placement when player has insufficient funds', () => {
      useGameStore.setState({ money: 100 })

      useGameStore.getState().addCabinet(0, 0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(0)
      expect(useGameStore.getState().money).toBe(100)
    })

    it('places cabinets with different environments and customer types', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, 0, 'lab', 'ai_training', 'south')

      const cab = useGameStore.getState().cabinets[0]
      expect(cab.environment).toBe('lab')
      expect(cab.customerType).toBe('ai_training')
      expect(cab.facing).toBe('south')
    })

    it('places multiple cabinets at different positions', () => {
      const store = useGameStore.getState()

      store.addCabinet(0, 0, 'production')
      useGameStore.getState().addCabinet(1, 0, 'production')
      useGameStore.getState().addCabinet(2, 0, 'lab')

      const state = useGameStore.getState()
      expect(state.cabinets).toHaveLength(3)
      expect(state.cabinets[0].col).toBe(0)
      expect(state.cabinets[1].col).toBe(1)
      expect(state.cabinets[2].col).toBe(2)
    })
  })

  describe('placement mode', () => {
    it('enterPlacementMode activates placement mode with correct settings', () => {
      useGameStore.getState().enterPlacementMode('lab', 'streaming', 'south')

      const state = useGameStore.getState()
      expect(state.placementMode).toBe(true)
      expect(state.placementEnvironment).toBe('lab')
      expect(state.placementCustomerType).toBe('streaming')
      expect(state.placementFacing).toBe('south')
    })

    it('exitPlacementMode deactivates placement mode', () => {
      useGameStore.getState().enterPlacementMode('production', 'general')
      expect(useGameStore.getState().placementMode).toBe(true)

      useGameStore.getState().exitPlacementMode()
      expect(useGameStore.getState().placementMode).toBe(false)
    })

    it('preserves facing when not explicitly provided', () => {
      useGameStore.getState().enterPlacementMode('production', 'general', 'south')
      expect(useGameStore.getState().placementFacing).toBe('south')

      // Enter again without specifying facing — should keep 'south'
      useGameStore.getState().enterPlacementMode('lab', 'enterprise')
      expect(useGameStore.getState().placementFacing).toBe('south')
    })
  })

  describe('tile click handler flow', () => {
    it('simulates the full placement flow: enter mode → click tile → cabinet placed', () => {
      // This mirrors how GameCanvas.handleTileClick works
      const { enterPlacementMode } = useGameStore.getState()
      enterPlacementMode('production', 'general', 'north')

      // Simulate what handleTileClick does when a tile is clicked
      const state = useGameStore.getState()
      expect(state.placementMode).toBe(true)
      state.addCabinet(
        1, 1,
        state.placementEnvironment,
        state.placementCustomerType,
        state.placementFacing,
      )

      const result = useGameStore.getState()
      expect(result.cabinets).toHaveLength(1)
      expect(result.cabinets[0].col).toBe(1)
      expect(result.cabinets[0].row).toBe(1)
      expect(result.placementMode).toBe(false)
    })

    it('handleTileClick does nothing when placement mode is inactive', () => {
      // Simulates the guard in GameCanvas.handleTileClick
      const state = useGameStore.getState()
      expect(state.placementMode).toBe(false)

      // handleTileClick checks placementMode before calling addCabinet
      if (state.placementMode) {
        state.addCabinet(0, 0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
      }

      expect(useGameStore.getState().cabinets).toHaveLength(0)
    })

    it('successive placements work correctly', () => {
      // Place first cabinet
      useGameStore.getState().enterPlacementMode('production', 'general')
      let state = useGameStore.getState()
      state.addCabinet(0, 0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
      expect(useGameStore.getState().placementMode).toBe(false)

      // Place second cabinet (must re-enter placement mode)
      useGameStore.getState().enterPlacementMode('production', 'general')
      state = useGameStore.getState()
      state.addCabinet(1, 0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)

      const result = useGameStore.getState()
      expect(result.cabinets).toHaveLength(2)
      expect(result.placementMode).toBe(false)
    })
  })

  describe('getPlacementHints', () => {
    it('returns first-cabinet tip when no cabinets exist', () => {
      const hints = getPlacementHints(0, 0, [], 'starter')
      const messages = hints.map((h) => h.message)
      expect(messages.some(m => m.includes('Open placement'))).toBe(true)
      expect(messages.some(m => m.includes('Leave rows between cabinets'))).toBe(true)
    })

    it('returns aisle facing hint when row has existing cabinets', () => {
      const existingCab = {
        id: 'cab-1',
        col: 0,
        row: 0,
        environment: 'production' as const,
        customerType: 'general' as const,
        serverCount: 1,
        hasLeafSwitch: false,
        powerStatus: true,
        heatLevel: 22,
        serverAge: 0,
        facing: 'north' as const,
      }

      const hints = getPlacementHints(1, 0, [existingCab], 'starter')
      const facingHints = hints.filter((h) => h.message.includes('north'))
      expect(facingHints.length).toBeGreaterThan(0)
    })
  })
})
