import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore, getPlacementHints } from './gameStore'

// Reset store state before each test
beforeEach(() => {
  useGameStore.setState(useGameStore.getInitialState())
})

// Starter tier layout: cabinet rows at gridRow 1 (facing south) and gridRow 3 (facing north)
// Columns 0–3, aisles at gridRow 2, corridors at gridRow 0 and 4
const STARTER_ROW_0 = 1 // gridRow for first cabinet row (facing south)
const STARTER_ROW_1 = 3 // gridRow for second cabinet row (facing north)

describe('cabinet placement', () => {
  describe('addCabinet', () => {
    it('places a cabinet at a valid cabinet row position', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, STARTER_ROW_0, 'production', 'general', 'north')

      const state = useGameStore.getState()
      expect(state.cabinets).toHaveLength(1)
      expect(state.cabinets[0].col).toBe(0)
      expect(state.cabinets[0].row).toBe(STARTER_ROW_0)
      expect(state.cabinets[0].environment).toBe('production')
      expect(state.cabinets[0].customerType).toBe('general')
      // Facing is enforced by the row layout (row 0 faces south), not by user input
      expect(state.cabinets[0].facing).toBe('south')
      expect(state.cabinets[0].serverCount).toBe(1)
      expect(state.cabinets[0].powerStatus).toBe(true)
    })

    it('deducts the cabinet cost from player money', () => {
      const moneyBefore = useGameStore.getState().money

      useGameStore.getState().addCabinet(0, STARTER_ROW_0, 'production')

      const moneyAfter = useGameStore.getState().money
      expect(moneyAfter).toBe(moneyBefore - 2000)
    })

    it('exits placement mode after placing a cabinet', () => {
      const { enterPlacementMode, addCabinet } = useGameStore.getState()

      enterPlacementMode('production', 'general')
      expect(useGameStore.getState().placementMode).toBe(true)

      addCabinet(0, STARTER_ROW_0, 'production')
      expect(useGameStore.getState().placementMode).toBe(false)
    })

    it('rejects placement on an occupied tile', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, STARTER_ROW_0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(1)

      // Try to place on the same tile
      useGameStore.getState().addCabinet(0, STARTER_ROW_0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(1)
    })

    it('rejects placement outside grid bounds', () => {
      // Starter tier: 4 cols, cabinet rows at gridRow 1 and 3
      const { addCabinet } = useGameStore.getState()

      addCabinet(5, STARTER_ROW_0, 'production') // col out of bounds (max 3)
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      addCabinet(0, 10, 'production') // row beyond grid
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      addCabinet(-1, STARTER_ROW_0, 'production') // negative col
      expect(useGameStore.getState().cabinets).toHaveLength(0)
    })

    it('rejects placement on aisle or corridor rows', () => {
      const { addCabinet } = useGameStore.getState()

      // Row 0 is the top corridor
      addCabinet(0, 0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      // Row 2 is a cold aisle
      addCabinet(0, 2, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(0)

      // Row 4 is the bottom corridor
      addCabinet(0, 4, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(0)
    })

    it('rejects placement when player has insufficient funds', () => {
      useGameStore.setState({ money: 100 })

      useGameStore.getState().addCabinet(0, STARTER_ROW_0, 'production')
      expect(useGameStore.getState().cabinets).toHaveLength(0)
      expect(useGameStore.getState().money).toBe(100)
    })

    it('places cabinets with different environments and customer types', () => {
      const { addCabinet } = useGameStore.getState()

      addCabinet(0, STARTER_ROW_0, 'lab', 'ai_training', 'south')

      const cab = useGameStore.getState().cabinets[0]
      expect(cab.environment).toBe('lab')
      expect(cab.customerType).toBe('ai_training')
      // Facing enforced by row layout (south for row 0)
      expect(cab.facing).toBe('south')
    })

    it('enforces row-level facing regardless of user input', () => {
      const { addCabinet } = useGameStore.getState()

      // Row at gridRow 1 faces south; passing 'north' should be overridden
      addCabinet(0, STARTER_ROW_0, 'production', 'general', 'north')
      expect(useGameStore.getState().cabinets[0].facing).toBe('south')

      // Row at gridRow 3 faces north; passing 'south' should be overridden
      useGameStore.getState().addCabinet(0, STARTER_ROW_1, 'production', 'general', 'south')
      expect(useGameStore.getState().cabinets[1].facing).toBe('north')
    })

    it('places multiple cabinets at different positions', () => {
      const store = useGameStore.getState()

      store.addCabinet(0, STARTER_ROW_0, 'production')
      useGameStore.getState().addCabinet(1, STARTER_ROW_0, 'production')
      useGameStore.getState().addCabinet(2, STARTER_ROW_0, 'lab')

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
        1, STARTER_ROW_0,
        state.placementEnvironment,
        state.placementCustomerType,
        state.placementFacing,
      )

      const result = useGameStore.getState()
      expect(result.cabinets).toHaveLength(1)
      expect(result.cabinets[0].col).toBe(1)
      expect(result.cabinets[0].row).toBe(STARTER_ROW_0)
      expect(result.placementMode).toBe(false)
    })

    it('handleTileClick does nothing when placement mode is inactive', () => {
      // Simulates the guard in GameCanvas.handleTileClick
      const state = useGameStore.getState()
      expect(state.placementMode).toBe(false)

      // handleTileClick checks placementMode before calling addCabinet
      if (state.placementMode) {
        state.addCabinet(0, STARTER_ROW_0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
      }

      expect(useGameStore.getState().cabinets).toHaveLength(0)
    })

    it('successive placements work correctly', () => {
      // Place first cabinet
      useGameStore.getState().enterPlacementMode('production', 'general')
      let state = useGameStore.getState()
      state.addCabinet(0, STARTER_ROW_0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
      expect(useGameStore.getState().placementMode).toBe(false)

      // Place second cabinet (must re-enter placement mode)
      useGameStore.getState().enterPlacementMode('production', 'general')
      state = useGameStore.getState()
      state.addCabinet(1, STARTER_ROW_0, state.placementEnvironment, state.placementCustomerType, state.placementFacing)

      const result = useGameStore.getState()
      expect(result.cabinets).toHaveLength(2)
      expect(result.placementMode).toBe(false)
    })
  })

  describe('getPlacementHints', () => {
    it('returns first-cabinet tip when hovering a valid cabinet row with no cabinets', () => {
      const hints = getPlacementHints(0, STARTER_ROW_0, [], 'starter')
      const messages = hints.map((h) => h.message)
      // Should show row info and first-cabinet tip
      expect(messages.some(m => m.includes('Row 1'))).toBe(true)
      expect(messages.some(m => m.includes('First cabinet'))).toBe(true)
    })

    it('returns aisle hint when hovering an aisle row', () => {
      // gridRow 2 is the cold aisle in starter tier
      const hints = getPlacementHints(0, 2, [], 'starter')
      const messages = hints.map((h) => h.message)
      expect(messages.some(m => m.includes('Cold aisle'))).toBe(true)
      expect(messages.some(m => m.includes('no cabinet placement'))).toBe(true)
    })

    it('returns corridor hint when hovering a corridor row', () => {
      const hints = getPlacementHints(0, 0, [], 'starter')
      const messages = hints.map((h) => h.message)
      expect(messages.some(m => m.includes('corridor'))).toBe(true)
    })

    it('returns row facing info when row has existing cabinets', () => {
      const existingCab = {
        id: 'cab-1',
        col: 0,
        row: STARTER_ROW_1, // gridRow 3, facing north
        environment: 'production' as const,
        customerType: 'general' as const,
        serverCount: 1,
        hasLeafSwitch: false,
        powerStatus: true,
        heatLevel: 22,
        serverAge: 0,
        facing: 'north' as const,
      }

      const hints = getPlacementHints(1, STARTER_ROW_1, [existingCab], 'starter')
      const facingHints = hints.filter((h) => h.message.includes('North'))
      expect(facingHints.length).toBeGreaterThan(0)
    })
  })

  describe('aisle containment', () => {
    it('installAisleContainment installs containment on an aisle', () => {
      // Need standard tier for containment
      useGameStore.setState({ money: 999999, suiteTier: 'standard' })

      useGameStore.getState().installAisleContainment(0)

      expect(useGameStore.getState().aisleContainments).toContain(0)
    })

    it('installAisleContainment deducts cost', () => {
      useGameStore.setState({ money: 20000, suiteTier: 'standard' })

      useGameStore.getState().installAisleContainment(0)

      expect(useGameStore.getState().money).toBe(20000 - 15000)
      expect(useGameStore.getState().aisleContainments).toContain(0)
    })

    it('installAisleContainment refuses at starter tier', () => {
      useGameStore.setState({ money: 999999, suiteTier: 'starter' })

      useGameStore.getState().installAisleContainment(0)

      expect(useGameStore.getState().aisleContainments).toHaveLength(0)
    })

    it('installAisleContainment refuses if already installed', () => {
      useGameStore.setState({ money: 999999, suiteTier: 'standard', aisleContainments: [0] })

      useGameStore.getState().installAisleContainment(0)

      // Should still only have one entry
      expect(useGameStore.getState().aisleContainments.filter(id => id === 0)).toHaveLength(1)
    })

    it('installAisleContainment refuses with insufficient funds', () => {
      useGameStore.setState({ money: 100, suiteTier: 'standard' })

      useGameStore.getState().installAisleContainment(0)

      expect(useGameStore.getState().aisleContainments).toHaveLength(0)
    })

    it('aisleContainments reset on resetGame', () => {
      useGameStore.setState({ aisleContainments: [0, 1] })

      useGameStore.getState().resetGame()

      expect(useGameStore.getState().aisleContainments).toHaveLength(0)
    })
  })
})
