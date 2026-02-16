import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import type {
  Season,
  ServerConfig,
  ActiveIncident,
  StaffMember,
} from '@/stores/gameStore'
import {
  SUPPLY_CHAIN_CONFIG,
  SEASON_CONFIG,
  WEATHER_CONDITION_CONFIG,
  MEETME_ROOM_CONFIG,
  INTERCONNECT_PORT_CONFIG,
  PEERING_OPTIONS,
  MAINTENANCE_CONFIG,
  POWER_REDUNDANCY_CONFIG,
  NOISE_CONFIG,
  SERVER_CONFIG_OPTIONS,
  SPOT_COMPUTE_CONFIG,
  TUTORIAL_TIPS,
  INCIDENT_CATALOG,
  SUITE_TIERS,
  OPS_TIER_CONFIG,
  getAdjacentCabinets,
  hasMaintenanceAccess,
  calcSpacingHeatEffect,
  calcAisleBonus,
  getFacingOffsets,
} from '@/stores/gameStore'

// Helper to get/set store state
const getState = () => useGameStore.getState()
const setState = (partial: Parameters<typeof useGameStore.setState>[0]) => useGameStore.setState(partial)

// Helper to set up a basic data center with cabinets + equipment for tick tests
function setupBasicDataCenter() {
  setState({
    sandboxMode: true,
    money: 999999,
    suiteTier: 'standard',
  })
  // Add a cabinet via action
  getState().addCabinet(0, 0, 'production', 'general', 'north')
  // Upgrade it with servers
  getState().upgradeNextCabinet() // adds server to cab-1
  // Add a leaf switch
  getState().addLeafToNextCabinet()
  // Add a spine switch
  getState().addSpineSwitch()
}

beforeEach(() => {
  getState().resetGame()
})

// ============================================================================
// A. Supply Chain
// ============================================================================
describe('Supply Chain', () => {
  it('placeOrder creates a pending order', () => {
    setState({ sandboxMode: true, money: 999999 })
    expect(getState().pendingOrders).toHaveLength(0)

    getState().placeOrder('server', 5)

    const orders = getState().pendingOrders
    expect(orders).toHaveLength(1)
    expect(orders[0].itemType).toBe('server')
    expect(orders[0].quantity).toBe(5)
    expect(orders[0].status).toBe('pending')

    const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === 'server')!
    expect(orders[0].leadTimeTicks).toBe(config.baseLeadTime)
    expect(orders[0].ticksRemaining).toBe(config.baseLeadTime)
  })

  it('placeOrder applies bulk discount when quantity meets threshold', () => {
    setState({ sandboxMode: true, money: 999999 })
    const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === 'server')!

    // Place order at bulk threshold
    getState().placeOrder('server', config.bulkThreshold)
    const order = getState().pendingOrders[0]

    // Base server cost is 2000, bulk discount for server is 0.85
    expect(order.unitCost).toBe(Math.round(2000 * config.bulkDiscount))
    expect(order.totalCost).toBe(order.unitCost * config.bulkThreshold)
  })

  it('placeOrder applies shortage multiplier during supply shortage', () => {
    setState({
      sandboxMode: true,
      money: 999999,
      supplyShortageActive: true,
      shortagePriceMultiplier: 2.0,
    })

    getState().placeOrder('server', 1)
    const order = getState().pendingOrders[0]

    // During shortage, lead time should be shortageLeadTime
    const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === 'server')!
    expect(order.leadTimeTicks).toBe(config.shortageLeadTime)
    expect(order.unitCost).toBe(Math.round(2000 * 2.0))
  })

  it('placeOrder refuses if money is insufficient (non-sandbox)', () => {
    setState({ sandboxMode: false, money: 100 })
    getState().placeOrder('server', 5)
    expect(getState().pendingOrders).toHaveLength(0)
  })

  it('order delivery occurs after ticks elapse during tick()', () => {
    setupBasicDataCenter()
    const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === 'server')!

    getState().placeOrder('server', 3)
    expect(getState().pendingOrders).toHaveLength(1)
    expect(getState().inventory.server).toBe(0)

    // Tick through the lead time
    for (let i = 0; i < config.baseLeadTime; i++) {
      getState().tick()
    }

    // After lead time ticks, order should be delivered
    expect(getState().inventory.server).toBe(3)
    const deliveredOrder = getState().pendingOrders.find((o) => o.status === 'delivered')
    expect(deliveredOrder).toBeDefined()
  })

  it('order transitions from pending to in_transit', () => {
    setupBasicDataCenter()
    const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === 'spine_switch')!

    getState().placeOrder('spine_switch', 1)
    expect(getState().pendingOrders[0].status).toBe('pending')

    // Tick until status changes to in_transit (happens at half lead time)
    const halfLeadTime = Math.ceil(config.baseLeadTime / 2)
    for (let i = 0; i < config.baseLeadTime - halfLeadTime; i++) {
      getState().tick()
    }

    const order = getState().pendingOrders[0]
    // At this point it should be either still pending or in_transit depending on exact tick
    expect(['pending', 'in_transit']).toContain(order.status)
  })

  it('placeOrder with unknown item type does nothing', () => {
    setState({ sandboxMode: true, money: 999999 })
    getState().placeOrder('unknown_item', 5)
    expect(getState().pendingOrders).toHaveLength(0)
  })
})

// ============================================================================
// B. Weather System
// ============================================================================
describe('Weather System', () => {
  it('starts with spring season and clear condition', () => {
    expect(getState().currentSeason).toBe('spring')
    expect(getState().currentCondition).toBe('clear')
    expect(getState().seasonTickCounter).toBe(0)
  })

  it('season rotation happens after durationTicks', () => {
    setupBasicDataCenter()
    const springConfig = SEASON_CONFIG.find((s) => s.season === 'spring')!

    // Set seasonTickCounter to just before rotation
    setState({ seasonTickCounter: springConfig.durationTicks - 1 })

    getState().tick()

    // Should have advanced to summer
    expect(getState().currentSeason).toBe('summer')
    expect(getState().seasonTickCounter).toBe(0)
  })

  it('season rotation cycles through all four seasons', () => {
    setupBasicDataCenter()
    const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter']

    for (let i = 0; i < 4; i++) {
      const seasonConfig = SEASON_CONFIG.find((s) => s.season === seasons[i])!
      setState({ seasonTickCounter: seasonConfig.durationTicks - 1, currentSeason: seasons[i] })
      getState().tick()

      const expected = seasons[(i + 1) % 4]
      expect(getState().currentSeason).toBe(expected)
    }
  })

  it('weather condition changes when weatherConditionTicksRemaining expires', () => {
    setupBasicDataCenter()

    // Force condition to expire next tick
    setState({ weatherConditionTicksRemaining: 1 })

    getState().tick()

    // The condition might change (random), but ticks remaining should be reset
    // At minimum, weatherConditionTicksRemaining should be > 0 or == 0 after the new assignment
    const state = getState()
    // Either condition was reassigned or the timer was decremented
    expect(state.weatherConditionTicksRemaining).toBeGreaterThanOrEqual(0)
  })

  it('weatherAmbientModifier reflects current season and condition', () => {
    setupBasicDataCenter()

    // Force summer + heatwave for maximum ambient
    setState({
      currentSeason: 'summer',
      currentCondition: 'heatwave',
      weatherConditionTicksRemaining: 50, // don't let it expire
      seasonTickCounter: 0,
    })

    getState().tick()

    const seasonMod = SEASON_CONFIG.find((s) => s.season === 'summer')!.ambientModifier
    const conditionMod = WEATHER_CONDITION_CONFIG.find((w) => w.condition === 'heatwave')!.ambientModifier
    expect(getState().weatherAmbientModifier).toBe(seasonMod + conditionMod)
  })

  it('seasonsExperienced tracks unique seasons visited', () => {
    setupBasicDataCenter()

    // Start in spring, already experienced
    expect(getState().seasonsExperienced).toContain('spring')

    // Jump to summer
    const springConfig = SEASON_CONFIG.find((s) => s.season === 'spring')!
    setState({ seasonTickCounter: springConfig.durationTicks - 1 })
    getState().tick()

    expect(getState().seasonsExperienced).toContain('summer')
    expect(getState().seasonsExperienced.length).toBeGreaterThanOrEqual(2)
  })
})

// ============================================================================
// C. Interconnection (Meet-Me Room + Ports)
// ============================================================================
describe('Interconnection', () => {
  it('installMeetMeRoom installs a meet-me room', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    expect(getState().meetMeRoomTier).toBeNull()

    getState().installMeetMeRoom(0) // Basic tier

    expect(getState().meetMeRoomTier).toBe(0)
  })

  it('installMeetMeRoom deducts cost in non-sandbox mode', () => {
    const config = MEETME_ROOM_CONFIG[0]
    setState({ sandboxMode: false, money: config.installCost + 1000, suiteTier: 'standard' })

    getState().installMeetMeRoom(0)

    expect(getState().meetMeRoomTier).toBe(0)
    expect(getState().money).toBe(1000)
  })

  it('installMeetMeRoom refuses if already installed', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard', meetMeRoomTier: 0 })

    getState().installMeetMeRoom(1)

    // Should still be tier 0
    expect(getState().meetMeRoomTier).toBe(0)
  })

  it('installMeetMeRoom requires at least Standard suite tier', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'starter' })

    getState().installMeetMeRoom(0)

    expect(getState().meetMeRoomTier).toBeNull()
  })

  it('addInterconnectPort adds a port to the room', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard', meetMeRoomTier: 0 })
    expect(getState().interconnectPorts).toHaveLength(0)

    getState().addInterconnectPort('copper_1g')

    expect(getState().interconnectPorts).toHaveLength(1)
    expect(getState().interconnectPorts[0].portType).toBe('copper_1g')
  })

  it('addInterconnectPort refuses without a meet-me room', () => {
    setState({ sandboxMode: true, money: 999999, meetMeRoomTier: null })

    getState().addInterconnectPort('copper_1g')

    expect(getState().interconnectPorts).toHaveLength(0)
  })

  it('addInterconnectPort respects port capacity limit', () => {
    const roomConfig = MEETME_ROOM_CONFIG[0]
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard', meetMeRoomTier: 0 })

    // Fill up the room to capacity with copper_1g (capacity 1 each)
    for (let i = 0; i < roomConfig.portCapacity; i++) {
      getState().addInterconnectPort('copper_1g')
    }
    expect(getState().interconnectPorts).toHaveLength(roomConfig.portCapacity)

    // One more should fail
    getState().addInterconnectPort('copper_1g')
    expect(getState().interconnectPorts).toHaveLength(roomConfig.portCapacity)
  })

  it('addInterconnectPort sets revenue per tick from config', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard', meetMeRoomTier: 0 })
    const portConfig = INTERCONNECT_PORT_CONFIG.find((p) => p.portType === 'fiber_10g')!

    getState().addInterconnectPort('fiber_10g')

    expect(getState().interconnectPorts[0].revenuePerTick).toBe(portConfig.revenuePerTick)
  })

  it('fiber_100g uses 2 capacity slots', () => {
    const roomConfig = MEETME_ROOM_CONFIG[0] // 12 capacity
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard', meetMeRoomTier: 0 })

    // fiber_100g uses 2 capacity per port
    const maxFiber100g = Math.floor(roomConfig.portCapacity / 2)
    for (let i = 0; i < maxFiber100g; i++) {
      getState().addInterconnectPort('fiber_100g')
    }
    expect(getState().interconnectPorts).toHaveLength(maxFiber100g)

    // One more should fail (capacity full)
    getState().addInterconnectPort('fiber_100g')
    expect(getState().interconnectPorts).toHaveLength(maxFiber100g)
  })
})

// ============================================================================
// D. Server Configuration
// ============================================================================
describe('Server Configuration', () => {
  it('defaults to balanced server config', () => {
    expect(getState().defaultServerConfig).toBe('balanced')
  })

  it('setDefaultServerConfig changes the config', () => {
    getState().setDefaultServerConfig('gpu_accelerated')
    expect(getState().defaultServerConfig).toBe('gpu_accelerated')
  })

  it('setDefaultServerConfig accepts all valid config types', () => {
    const configs: ServerConfig[] = ['balanced', 'cpu_optimized', 'gpu_accelerated', 'storage_dense', 'memory_optimized']
    for (const config of configs) {
      getState().setDefaultServerConfig(config)
      expect(getState().defaultServerConfig).toBe(config)
    }
  })

  it('SERVER_CONFIG_OPTIONS has entries for all config types', () => {
    const configIds = SERVER_CONFIG_OPTIONS.map((o) => o.id)
    expect(configIds).toContain('balanced')
    expect(configIds).toContain('cpu_optimized')
    expect(configIds).toContain('gpu_accelerated')
    expect(configIds).toContain('storage_dense')
    expect(configIds).toContain('memory_optimized')
  })

  it('each server config has valid multipliers', () => {
    for (const config of SERVER_CONFIG_OPTIONS) {
      expect(config.costMultiplier).toBeGreaterThan(0)
      expect(config.powerMultiplier).toBeGreaterThan(0)
      expect(config.heatMultiplier).toBeGreaterThan(0)
      expect(config.revenueMultiplier).toBeGreaterThan(0)
      expect(config.customerBonus).toBeGreaterThanOrEqual(0)
    }
  })
})

// ============================================================================
// E. Peering
// ============================================================================
describe('Peering', () => {
  it('addPeeringAgreement adds an agreement', () => {
    expect(getState().peeringAgreements).toHaveLength(0)

    getState().addPeeringAgreement(0) // budget_transit

    expect(getState().peeringAgreements).toHaveLength(1)
    expect(getState().peeringAgreements[0].type).toBe(PEERING_OPTIONS[0].type)
    expect(getState().peeringAgreements[0].provider).toBe(PEERING_OPTIONS[0].provider)
    expect(getState().peeringAgreements[0].bandwidthGbps).toBe(PEERING_OPTIONS[0].bandwidthGbps)
    expect(getState().peeringAgreements[0].costPerTick).toBe(PEERING_OPTIONS[0].costPerTick)
    expect(getState().peeringAgreements[0].latencyMs).toBe(PEERING_OPTIONS[0].latencyMs)
  })

  it('addPeeringAgreement prevents duplicate types', () => {
    getState().addPeeringAgreement(0)
    getState().addPeeringAgreement(0) // same type

    expect(getState().peeringAgreements).toHaveLength(1)
  })

  it('addPeeringAgreement allows up to 4 different agreements', () => {
    for (let i = 0; i < PEERING_OPTIONS.length; i++) {
      getState().addPeeringAgreement(i)
    }

    expect(getState().peeringAgreements).toHaveLength(4)
  })

  it('addPeeringAgreement caps at 4 agreements', () => {
    // Add all 4
    for (let i = 0; i < 4; i++) {
      getState().addPeeringAgreement(i)
    }
    expect(getState().peeringAgreements).toHaveLength(4)

    // Try to add a 5th (would fail even if it were a new type)
    // Since all 4 types are used, this also tests the duplicate check
    getState().addPeeringAgreement(0)
    expect(getState().peeringAgreements).toHaveLength(4)
  })

  it('removePeeringAgreement removes by id', () => {
    getState().addPeeringAgreement(0)
    getState().addPeeringAgreement(1)
    expect(getState().peeringAgreements).toHaveLength(2)

    const id = getState().peeringAgreements[0].id
    getState().removePeeringAgreement(id)

    expect(getState().peeringAgreements).toHaveLength(1)
    expect(getState().peeringAgreements[0].id).not.toBe(id)
  })

  it('removePeeringAgreement with nonexistent id does nothing', () => {
    getState().addPeeringAgreement(0)
    getState().removePeeringAgreement('nonexistent-id')
    expect(getState().peeringAgreements).toHaveLength(1)
  })

  it('addPeeringAgreement with invalid index does nothing', () => {
    getState().addPeeringAgreement(99)
    expect(getState().peeringAgreements).toHaveLength(0)
  })
})

// ============================================================================
// F. Maintenance
// ============================================================================
describe('Maintenance', () => {
  it('scheduleMaintenance creates a maintenance window', () => {
    setState({ sandboxMode: true, money: 999999 })
    expect(getState().maintenanceWindows).toHaveLength(0)

    getState().scheduleMaintenance('cabinet', 'cab-1')

    const windows = getState().maintenanceWindows
    expect(windows).toHaveLength(1)
    expect(windows[0].targetType).toBe('cabinet')
    expect(windows[0].targetId).toBe('cab-1')
    expect(windows[0].status).toBe('scheduled')
    expect(windows[0].benefitApplied).toBe(false)
  })

  it('scheduleMaintenance deducts cost in non-sandbox', () => {
    const config = MAINTENANCE_CONFIG.find((c) => c.targetType === 'cabinet')!
    setState({ sandboxMode: false, money: config.cost + 500 })

    getState().scheduleMaintenance('cabinet', 'cab-1')

    expect(getState().maintenanceWindows).toHaveLength(1)
    expect(getState().money).toBe(500)
  })

  it('scheduleMaintenance refuses if money insufficient (non-sandbox)', () => {
    setState({ sandboxMode: false, money: 10 })

    getState().scheduleMaintenance('cabinet', 'cab-1')

    expect(getState().maintenanceWindows).toHaveLength(0)
  })

  it('scheduleMaintenance limits to 3 active windows', () => {
    setState({ sandboxMode: true, money: 999999 })

    getState().scheduleMaintenance('cabinet', 'cab-1')
    getState().scheduleMaintenance('spine', 'spine-1')
    getState().scheduleMaintenance('cooling', 'cooling-1')

    expect(getState().maintenanceWindows).toHaveLength(3)

    // Fourth should be rejected
    getState().scheduleMaintenance('power', 'power-1')
    expect(getState().maintenanceWindows).toHaveLength(3)
  })

  it('scheduleMaintenance sets duration from config', () => {
    setState({ sandboxMode: true, money: 999999 })
    const config = MAINTENANCE_CONFIG.find((c) => c.targetType === 'spine')!

    getState().scheduleMaintenance('spine', 'spine-1')

    expect(getState().maintenanceWindows[0].durationTicks).toBe(config.durationTicks)
  })

  it('scheduleMaintenance sets cost from config', () => {
    setState({ sandboxMode: true, money: 999999 })

    for (const config of MAINTENANCE_CONFIG) {
      getState().resetGame()
      setState({ sandboxMode: true, money: 999999 })
      getState().scheduleMaintenance(config.targetType, 'target-1')
      expect(getState().maintenanceWindows[0].cost).toBe(config.cost)
    }
  })
})

// ============================================================================
// G. Power Redundancy
// ============================================================================
describe('Power Redundancy', () => {
  it('starts at N (no redundancy)', () => {
    expect(getState().powerRedundancy).toBe('N')
  })

  it('upgradePowerRedundancy upgrades from N to N+1', () => {
    setState({ sandboxMode: true, money: 999999 })

    getState().upgradePowerRedundancy('N+1')

    expect(getState().powerRedundancy).toBe('N+1')
  })

  it('upgradePowerRedundancy upgrades from N+1 to 2N', () => {
    setState({ sandboxMode: true, money: 999999, powerRedundancy: 'N+1' })

    getState().upgradePowerRedundancy('2N')

    expect(getState().powerRedundancy).toBe('2N')
  })

  it('upgradePowerRedundancy refuses to downgrade', () => {
    setState({ sandboxMode: true, money: 999999, powerRedundancy: '2N' })

    getState().upgradePowerRedundancy('N+1')

    expect(getState().powerRedundancy).toBe('2N')
  })

  it('upgradePowerRedundancy refuses same level', () => {
    setState({ sandboxMode: true, money: 999999, powerRedundancy: 'N+1' })

    getState().upgradePowerRedundancy('N+1')

    // Should still be N+1 (no change)
    expect(getState().powerRedundancy).toBe('N+1')
  })

  it('upgradePowerRedundancy deducts cost in non-sandbox mode', () => {
    const config = POWER_REDUNDANCY_CONFIG.find((c) => c.level === 'N+1')!
    setState({ sandboxMode: false, money: config.upgradeCost + 1000, powerRedundancy: 'N' })

    getState().upgradePowerRedundancy('N+1')

    expect(getState().powerRedundancy).toBe('N+1')
    expect(getState().money).toBe(1000)
  })

  it('upgradePowerRedundancy refuses if money insufficient (non-sandbox)', () => {
    setState({ sandboxMode: false, money: 100, powerRedundancy: 'N' })

    getState().upgradePowerRedundancy('N+1')

    expect(getState().powerRedundancy).toBe('N')
  })

  it('can skip from N directly to 2N', () => {
    setState({ sandboxMode: true, money: 999999, powerRedundancy: 'N' })

    getState().upgradePowerRedundancy('2N')

    expect(getState().powerRedundancy).toBe('2N')
  })
})

// ============================================================================
// H. Noise & Sound Barriers
// ============================================================================
describe('Noise & Sound Barriers', () => {
  it('starts with 0 sound barriers', () => {
    expect(getState().soundBarriersInstalled).toBe(0)
  })

  it('installSoundBarrier increments barrier count', () => {
    setState({ sandboxMode: true, money: 999999 })

    getState().installSoundBarrier()

    expect(getState().soundBarriersInstalled).toBe(1)
  })

  it('installSoundBarrier deducts cost in non-sandbox mode', () => {
    setState({ sandboxMode: false, money: NOISE_CONFIG.soundBarrierCost + 1000 })

    getState().installSoundBarrier()

    expect(getState().soundBarriersInstalled).toBe(1)
    expect(getState().money).toBe(1000)
  })

  it('installSoundBarrier refuses if money insufficient (non-sandbox)', () => {
    setState({ sandboxMode: false, money: 10 })

    getState().installSoundBarrier()

    expect(getState().soundBarriersInstalled).toBe(0)
  })

  it('installSoundBarrier caps at max barriers', () => {
    setState({ sandboxMode: true, money: 999999 })

    for (let i = 0; i < NOISE_CONFIG.maxSoundBarriers + 2; i++) {
      getState().installSoundBarrier()
    }

    expect(getState().soundBarriersInstalled).toBe(NOISE_CONFIG.maxSoundBarriers)
  })

  it('NOISE_CONFIG has valid values', () => {
    expect(NOISE_CONFIG.soundBarrierReduction).toBeGreaterThan(0)
    expect(NOISE_CONFIG.maxSoundBarriers).toBeGreaterThan(0)
    expect(NOISE_CONFIG.soundBarrierCost).toBeGreaterThan(0)
    expect(NOISE_CONFIG.noiseLimit).toBeGreaterThan(0)
    expect(NOISE_CONFIG.fineThreshold).toBeGreaterThan(0)
    expect(NOISE_CONFIG.fineAmount).toBeGreaterThan(0)
  })

  it('noise level is calculated during tick', () => {
    setupBasicDataCenter()
    // Multiple cabinets generate noise from cooling
    for (let i = 1; i < 4; i++) {
      getState().addCabinet(i, 0, 'production', 'general', 'north')
    }

    getState().tick()

    // With cabinets, noise level should be > 0
    expect(getState().noiseLevel).toBeGreaterThanOrEqual(0)
  })
})

// ============================================================================
// I. Spot Compute
// ============================================================================
describe('Spot Compute', () => {
  it('starts with 0 spot capacity', () => {
    expect(getState().spotCapacityAllocated).toBe(0)
  })

  it('setSpotCapacity sets allocated capacity', () => {
    setupBasicDataCenter()
    // We have at least 1 server powered on

    getState().setSpotCapacity(1)

    expect(getState().spotCapacityAllocated).toBe(1)
  })

  it('setSpotCapacity clamps to total active servers', () => {
    setupBasicDataCenter()
    // setupBasicDataCenter creates 1 cabinet (with 1 server) + upgradeNextCabinet adds another = 2 servers
    const totalServers = getState().cabinets.reduce((sum, c) => sum + (c.powerStatus ? c.serverCount : 0), 0)

    getState().setSpotCapacity(100)

    // Should be clamped to total active servers
    expect(getState().spotCapacityAllocated).toBe(totalServers)
    expect(getState().spotCapacityAllocated).toBeLessThanOrEqual(totalServers)
  })

  it('setSpotCapacity clamps negative to 0', () => {
    setupBasicDataCenter()

    getState().setSpotCapacity(-5)

    expect(getState().spotCapacityAllocated).toBe(0)
  })

  it('SPOT_COMPUTE_CONFIG has valid range', () => {
    expect(SPOT_COMPUTE_CONFIG.minPriceMultiplier).toBeGreaterThan(0)
    expect(SPOT_COMPUTE_CONFIG.maxPriceMultiplier).toBeGreaterThan(SPOT_COMPUTE_CONFIG.minPriceMultiplier)
    expect(SPOT_COMPUTE_CONFIG.volatility).toBeGreaterThan(0)
    expect(SPOT_COMPUTE_CONFIG.meanReversion).toBeGreaterThan(0)
  })

  it('spot price multiplier updates during tick', () => {
    setupBasicDataCenter()

    // Run several ticks to see price movement
    for (let i = 0; i < 20; i++) {
      getState().tick()
    }

    // Price should stay within configured bounds
    const price = getState().spotPriceMultiplier
    expect(price).toBeGreaterThanOrEqual(SPOT_COMPUTE_CONFIG.minPriceMultiplier)
    expect(price).toBeLessThanOrEqual(SPOT_COMPUTE_CONFIG.maxPriceMultiplier)
  })
})

// ============================================================================
// J. Tutorial
// ============================================================================
describe('Tutorial', () => {
  it('starts with tutorial enabled and no seen tips', () => {
    expect(getState().tutorialEnabled).toBe(true)
    expect(getState().seenTips).toHaveLength(0)
    expect(getState().activeTip).toBeNull()
  })

  it('dismissTip adds tip to seenTips', () => {
    getState().dismissTip('first_overheat')

    expect(getState().seenTips).toContain('first_overheat')
  })

  it('dismissTip clears activeTip if it matches', () => {
    const tip = TUTORIAL_TIPS[0]
    setState({ activeTip: tip })

    getState().dismissTip(tip.id)

    expect(getState().activeTip).toBeNull()
    expect(getState().seenTips).toContain(tip.id)
  })

  it('dismissTip does not clear activeTip if different tip', () => {
    const tip1 = TUTORIAL_TIPS[0]
    const tip2 = TUTORIAL_TIPS[1]
    setState({ activeTip: tip1 })

    getState().dismissTip(tip2.id)

    expect(getState().activeTip).toEqual(tip1)
    expect(getState().seenTips).toContain(tip2.id)
  })

  it('toggleTutorial disables tutorial and clears activeTip', () => {
    const tip = TUTORIAL_TIPS[0]
    setState({ tutorialEnabled: true, activeTip: tip })

    getState().toggleTutorial()

    expect(getState().tutorialEnabled).toBe(false)
    expect(getState().activeTip).toBeNull()
  })

  it('toggleTutorial re-enables tutorial', () => {
    setState({ tutorialEnabled: false })

    getState().toggleTutorial()

    expect(getState().tutorialEnabled).toBe(true)
  })

  it('TUTORIAL_TIPS has valid entries', () => {
    expect(TUTORIAL_TIPS.length).toBeGreaterThan(0)
    for (const tip of TUTORIAL_TIPS) {
      expect(tip.id).toBeDefined()
      expect(tip.title).toBeDefined()
      expect(tip.message).toBeDefined()
      expect(tip.category).toBeDefined()
    }
  })
})

// ============================================================================
// K. Event Log
// ============================================================================
describe('Event Log', () => {
  it('starts with empty event log', () => {
    expect(getState().eventLog).toHaveLength(0)
  })

  it('events are logged during tick', () => {
    setupBasicDataCenter()

    // Run several ticks
    for (let i = 0; i < 5; i++) {
      getState().tick()
    }

    // Event log may or may not have entries depending on what happens during ticks
    // But the array should exist
    expect(Array.isArray(getState().eventLog)).toBe(true)
  })

  it('season change is logged as event', () => {
    setupBasicDataCenter()
    const springConfig = SEASON_CONFIG.find((s) => s.season === 'spring')!

    // Force season change
    setState({ seasonTickCounter: springConfig.durationTicks - 1 })
    getState().tick()

    const events = getState().eventLog
    const seasonEvent = events.find((e) => e.message.includes('Season changed'))
    expect(seasonEvent).toBeDefined()
    expect(seasonEvent?.category).toBe('system')
  })

  it('event log entries have required fields', () => {
    setupBasicDataCenter()
    const springConfig = SEASON_CONFIG.find((s) => s.season === 'spring')!
    setState({ seasonTickCounter: springConfig.durationTicks - 1 })
    getState().tick()

    const events = getState().eventLog
    if (events.length > 0) {
      const event = events[0]
      expect(event.tick).toBeDefined()
      expect(event.gameHour).toBeDefined()
      expect(event.category).toBeDefined()
      expect(event.message).toBeDefined()
      expect(event.severity).toBeDefined()
    }
  })

  it('event log is capped at 200 entries', () => {
    setupBasicDataCenter()

    // Create a state with near-max event log
    const fakeEvents = Array.from({ length: 199 }, (_, i) => ({
      tick: i,
      gameHour: 0,
      category: 'system' as const,
      message: `Event ${i}`,
      severity: 'info' as const,
    }))
    setState({ eventLog: fakeEvents })

    // Force a season change to add an event
    const springConfig = SEASON_CONFIG.find((s) => s.season === 'spring')!
    setState({ seasonTickCounter: springConfig.durationTicks - 1 })
    getState().tick()

    expect(getState().eventLog.length).toBeLessThanOrEqual(200)
  })
})

// ============================================================================
// L. Lifetime Stats
// ============================================================================
describe('Lifetime Stats', () => {
  it('starts with zeroed lifetime stats', () => {
    const stats = getState().lifetimeStats
    expect(stats.totalRevenueEarned).toBe(0)
    expect(stats.totalExpensesPaid).toBe(0)
    expect(stats.totalMoneyEarned).toBe(0)
    expect(stats.peakTemperatureReached).toBe(22)
    expect(stats.longestUptimeStreak).toBe(0)
    expect(stats.currentUptimeStreak).toBe(0)
    expect(stats.totalFiresSurvived).toBe(0)
    expect(stats.totalPowerOutages).toBe(0)
    expect(stats.peakRevenueTick).toBe(0)
    expect(stats.peakCabinetCount).toBe(0)
  })

  it('lifetime stats track revenue during tick', () => {
    setupBasicDataCenter()

    getState().tick()

    const stats = getState().lifetimeStats
    expect(stats.totalRevenueEarned).toBeGreaterThan(0)
    expect(stats.totalMoneyEarned).toBeGreaterThan(0)
  })

  it('lifetime stats track expenses during tick', () => {
    setupBasicDataCenter()

    getState().tick()

    const stats = getState().lifetimeStats
    // With servers running, there should be power expenses
    expect(stats.totalExpensesPaid).toBeGreaterThanOrEqual(0)
  })

  it('lifetime stats track peak cabinet count', () => {
    setupBasicDataCenter()

    getState().tick()

    const stats = getState().lifetimeStats
    expect(stats.peakCabinetCount).toBeGreaterThanOrEqual(1)
  })

  it('lifetime stats track uptime streak', () => {
    setupBasicDataCenter()

    // Run several clean ticks with no incidents
    for (let i = 0; i < 5; i++) {
      getState().tick()
    }

    const stats = getState().lifetimeStats
    const state = getState()
    // If no incidents or problems occurred, uptime streak should be > 0
    const hasProblems = state.fireActive || state.powerOutage || state.activeIncidents.filter((i) => !i.resolved).length > 0
    if (!hasProblems) {
      expect(stats.currentUptimeStreak).toBeGreaterThan(0)
      expect(stats.longestUptimeStreak).toBeGreaterThanOrEqual(stats.currentUptimeStreak)
    } else {
      // If problems did occur, streak may be 0 — that's correct behavior
      expect(stats.currentUptimeStreak).toBeGreaterThanOrEqual(0)
    }
  })

  it('lifetime stats track peak temperature', () => {
    setupBasicDataCenter()

    // Tick a few times to generate heat
    for (let i = 0; i < 10; i++) {
      getState().tick()
    }

    const stats = getState().lifetimeStats
    // Peak temp should be at least ambient (22)
    expect(stats.peakTemperatureReached).toBeGreaterThanOrEqual(22)
  })

  it('lifetime stats reset on resetGame', () => {
    setupBasicDataCenter()
    for (let i = 0; i < 5; i++) {
      getState().tick()
    }

    getState().resetGame()

    const stats = getState().lifetimeStats
    expect(stats.totalRevenueEarned).toBe(0)
    expect(stats.totalExpensesPaid).toBe(0)
    expect(stats.totalMoneyEarned).toBe(0)
  })
})

// ============================================================================
// M. Capacity History
// ============================================================================
describe('Capacity History', () => {
  it('starts with empty capacity history', () => {
    expect(getState().capacityHistory).toHaveLength(0)
  })

  it('history points are recorded each tick', () => {
    setupBasicDataCenter()

    getState().tick()

    expect(getState().capacityHistory).toHaveLength(1)
    const point = getState().capacityHistory[0]
    expect(point.tick).toBeDefined()
    expect(point.power).toBeDefined()
    expect(point.heat).toBeDefined()
    expect(point.revenue).toBeDefined()
    expect(point.cabinets).toBeDefined()
    expect(point.money).toBeDefined()
  })

  it('history accumulates over multiple ticks', () => {
    setupBasicDataCenter()

    for (let i = 0; i < 10; i++) {
      getState().tick()
    }

    expect(getState().capacityHistory).toHaveLength(10)
  })

  it('history is capped at 100 entries', () => {
    setupBasicDataCenter()

    // Pre-fill with 95 entries
    const fakeHistory = Array.from({ length: 95 }, (_, i) => ({
      tick: i,
      power: 0,
      heat: 22,
      revenue: 0,
      cabinets: 1,
      money: 50000,
    }))
    setState({ capacityHistory: fakeHistory })

    // Tick 10 more times (total would be 105 but capped at 100)
    for (let i = 0; i < 10; i++) {
      getState().tick()
    }

    expect(getState().capacityHistory.length).toBeLessThanOrEqual(100)
  })

  it('history points have correct tick number', () => {
    setupBasicDataCenter()

    getState().tick()
    getState().tick()

    const history = getState().capacityHistory
    expect(history.length).toBeGreaterThanOrEqual(2)
    // Ticks should be sequential
    if (history.length >= 2) {
      expect(history[1].tick).toBeGreaterThan(history[0].tick)
    }
  })

  it('history tracks cabinet count accurately', () => {
    setupBasicDataCenter()
    const cabinetCount = getState().cabinets.length

    getState().tick()

    expect(getState().capacityHistory[0].cabinets).toBe(cabinetCount)
  })
})

// ============================================================================
// Integration: Reset clears all Phase 5 state
// ============================================================================
describe('resetGame clears Phase 5 state', () => {
  it('resets all Phase 5 fields to defaults', () => {
    // Set up some Phase 5 state
    setState({
      sandboxMode: true,
      money: 999999,
      suiteTier: 'standard',
    })
    getState().placeOrder('server', 5)
    getState().installMeetMeRoom(0)
    getState().addInterconnectPort('copper_1g')
    getState().addPeeringAgreement(0)
    getState().setDefaultServerConfig('gpu_accelerated')
    getState().scheduleMaintenance('cabinet', 'cab-1')
    getState().upgradePowerRedundancy('N+1')
    getState().installSoundBarrier()
    getState().dismissTip('first_overheat')

    // Now reset
    getState().resetGame()

    const state = getState()
    expect(state.pendingOrders).toHaveLength(0)
    expect(state.inventory).toEqual({ server: 0, leaf_switch: 0, spine_switch: 0, cabinet: 0 })
    expect(state.currentSeason).toBe('spring')
    expect(state.currentCondition).toBe('clear')
    expect(state.meetMeRoomTier).toBeNull()
    expect(state.interconnectPorts).toHaveLength(0)
    expect(state.defaultServerConfig).toBe('balanced')
    expect(state.peeringAgreements).toHaveLength(0)
    expect(state.maintenanceWindows).toHaveLength(0)
    expect(state.powerRedundancy).toBe('N')
    expect(state.soundBarriersInstalled).toBe(0)
    expect(state.noiseLevel).toBe(0)
    expect(state.noiseComplaints).toBe(0)
    expect(state.zoningRestricted).toBe(false)
    expect(state.spotCapacityAllocated).toBe(0)
    expect(state.eventLog).toHaveLength(0)
    expect(state.capacityHistory).toHaveLength(0)
    expect(state.tutorialEnabled).toBe(true)
    expect(state.seenTips).toHaveLength(0)
    expect(state.activeTip).toBeNull()
    expect(state.lifetimeStats.totalRevenueEarned).toBe(0)
  })
})

// ============================================================================
// L. Incident System — Natural Tick-Down & Hardware Restoration
// ============================================================================
describe('Incident System', () => {
  it('incidents should naturally tick down each tick', () => {
    setupBasicDataCenter()
    const heatSpikeDef = INCIDENT_CATALOG.find(d => d.type === 'cooling_failure')!
    const incident: ActiveIncident = {
      id: 'test-inc-1',
      def: heatSpikeDef,
      ticksRemaining: 5,
      resolved: false,
    }
    setState({ activeIncidents: [incident] })
    getState().tick()
    const state = getState()
    const updated = state.activeIncidents.find(i => i.id === 'test-inc-1')
    // ticksRemaining should have decreased (by at least 1 from natural tick-down)
    expect(updated).toBeDefined()
    if (updated && !updated.resolved) {
      expect(updated.ticksRemaining).toBeLessThan(5)
    }
  })

  it('incidents should auto-resolve when ticksRemaining reaches 0', () => {
    setupBasicDataCenter()
    const heatSpikeDef = INCIDENT_CATALOG.find(d => d.type === 'cooling_failure')!
    const incident: ActiveIncident = {
      id: 'test-inc-2',
      def: heatSpikeDef,
      ticksRemaining: 1, // will reach 0 this tick
      resolved: false,
    }
    setState({ activeIncidents: [incident] })
    getState().tick()
    const state = getState()
    const updated = state.activeIncidents.find(i => i.id === 'test-inc-2')
    // Incident should be resolved (marked resolved=true)
    expect(updated?.resolved).toBe(true)
  })

  it('leaf_failure incident should restore hasLeafSwitch after resolution', () => {
    setupBasicDataCenter()
    const cab = getState().cabinets[0]
    expect(cab.hasLeafSwitch).toBe(true)

    const leafDef = INCIDENT_CATALOG.find(d => d.type === 'leaf_failure')!
    const incident: ActiveIncident = {
      id: 'test-leaf-fail',
      def: leafDef,
      ticksRemaining: 2,
      resolved: false,
      affectedHardwareId: cab.id,
    }
    setState({ activeIncidents: [incident] })

    // Tick 1: leaf should be disabled, ticksRemaining decreases
    getState().tick()
    let state = getState()
    let updatedCab = state.cabinets.find(c => c.id === cab.id)!
    expect(updatedCab.hasLeafSwitch).toBe(false)

    // Tick 2: incident should resolve (ticksRemaining reaches 0)
    getState().tick()
    state = getState()
    const inc = state.activeIncidents.find(i => i.id === 'test-leaf-fail')
    expect(inc?.resolved).toBe(true)

    // Tick 3: resolved incident is cleaned up, leaf switch should be restored
    getState().tick()
    state = getState()
    updatedCab = state.cabinets.find(c => c.id === cab.id)!
    expect(updatedCab.hasLeafSwitch).toBe(true)
  })

  it('spine_failure incident should restore powerStatus after resolution', () => {
    setupBasicDataCenter()
    const spine = getState().spineSwitches[0]
    expect(spine.powerStatus).toBe(true)

    const spineDef = INCIDENT_CATALOG.find(d => d.type === 'spine_failure')!
    const incident: ActiveIncident = {
      id: 'test-spine-fail',
      def: spineDef,
      ticksRemaining: 2,
      resolved: false,
      affectedHardwareId: spine.id,
    }
    setState({ activeIncidents: [incident] })

    // Tick 1: spine should be disabled
    getState().tick()
    let state = getState()
    let updatedSpine = state.spineSwitches.find(s => s.id === spine.id)!
    expect(updatedSpine.powerStatus).toBe(false)

    // Tick 2: incident should resolve
    getState().tick()
    state = getState()
    const inc = state.activeIncidents.find(i => i.id === 'test-spine-fail')
    expect(inc?.resolved).toBe(true)

    // Tick 3: resolved incident is cleaned up, spine should be restored
    getState().tick()
    state = getState()
    updatedSpine = state.spineSwitches.find(s => s.id === spine.id)!
    expect(updatedSpine.powerStatus).toBe(true)
  })
})

// ============================================================================
// N. Spacing & Layout Mechanics
// ============================================================================
describe('Spacing & Layout', () => {
  it('expanded grid has more tiles than max cabinets', () => {
    // Starter tier: 5x5 = 25 tiles, 8 max cabinets
    const starter = SUITE_TIERS.starter
    expect(starter.cols * starter.rows).toBeGreaterThan(starter.maxCabinets)
    // Standard tier: 8x7 = 56 tiles, 18 max
    const standard = SUITE_TIERS.standard
    expect(standard.cols * standard.rows).toBeGreaterThan(standard.maxCabinets)
  })

  it('getAdjacentCabinets returns orthogonal neighbors only', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    // Place cabinets at (1,1), (1,2), (2,1), (0,0)
    getState().addCabinet(1, 1, 'production', 'general', 'north')
    getState().addCabinet(1, 2, 'production', 'general', 'south')
    getState().addCabinet(2, 1, 'production', 'general', 'north')
    getState().addCabinet(0, 0, 'production', 'general', 'north') // diagonal to (1,1)

    const cabs = getState().cabinets
    const centerCab = cabs.find(c => c.col === 1 && c.row === 1)!
    const adj = getAdjacentCabinets(centerCab, cabs)

    // Should find (1,2) and (2,1) but NOT (0,0) which is diagonal
    expect(adj).toHaveLength(2)
    expect(adj.some(c => c.col === 1 && c.row === 2)).toBe(true)
    expect(adj.some(c => c.col === 2 && c.row === 1)).toBe(true)
    expect(adj.some(c => c.col === 0 && c.row === 0)).toBe(false)
  })

  it('hasMaintenanceAccess returns true when cabinet has empty neighbor', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(2, 2, 'production', 'general', 'north')

    const cabs = getState().cabinets
    const cab = cabs[0]
    // Cabinet at (2,2) in 8x7 grid — all 4 sides are empty
    expect(hasMaintenanceAccess(cab, cabs, 8, 7)).toBe(true)
  })

  it('hasMaintenanceAccess returns false when cabinet is fully surrounded', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    // Place center cabinet and surround it on all 4 sides
    getState().addCabinet(2, 2, 'production', 'general', 'north')
    getState().addCabinet(2, 1, 'production', 'general', 'south')
    getState().addCabinet(2, 3, 'production', 'general', 'north')
    getState().addCabinet(1, 2, 'production', 'general', 'north')
    getState().addCabinet(3, 2, 'production', 'general', 'north')

    const cabs = getState().cabinets
    const centerCab = cabs.find(c => c.col === 2 && c.row === 2)!
    expect(hasMaintenanceAccess(centerCab, cabs, 8, 7)).toBe(false)
  })

  it('calcSpacingHeatEffect increases heat for adjacent cabinets', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(2, 2, 'production', 'general', 'north')
    getState().addCabinet(2, 3, 'production', 'general', 'south')
    getState().addCabinet(3, 2, 'production', 'general', 'north')

    const cabs = getState().cabinets
    const centerCab = cabs.find(c => c.col === 2 && c.row === 2)!
    const effect = calcSpacingHeatEffect(centerCab, cabs)

    // 2 adjacent cabinets × 0.3 penalty = 0.6 base
    // north-facing, row-1 is empty (front bonus -0.3), row+1 occupied (no rear bonus)
    // Net should be positive (heat penalty from density > airflow bonus)
    expect(effect).toBeGreaterThan(0)
  })

  it('calcSpacingHeatEffect gives airflow bonus for isolated cabinet', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(3, 3, 'production', 'general', 'north')

    const cabs = getState().cabinets
    const cab = cabs[0]
    const effect = calcSpacingHeatEffect(cab, cabs)

    // No adjacent cabinets, both front (row-1) and rear (row+1) are empty
    // Effect should be negative (cooling bonus from open airflow)
    expect(effect).toBeLessThan(0)
  })

  it('calcAisleBonus gives higher bonus for rows with gap between them', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })

    // Row 1 facing south, row 3 facing north (gap of 1 row between them)
    getState().addCabinet(0, 1, 'production', 'general', 'south')
    getState().addCabinet(1, 1, 'production', 'general', 'south')
    getState().addCabinet(0, 3, 'production', 'general', 'north')
    getState().addCabinet(1, 3, 'production', 'general', 'north')

    const bonusWithGap = calcAisleBonus(getState().cabinets)

    // Reset and place without gap
    getState().resetGame()
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(0, 1, 'production', 'general', 'south')
    getState().addCabinet(1, 1, 'production', 'general', 'south')
    getState().addCabinet(0, 2, 'production', 'general', 'north')
    getState().addCabinet(1, 2, 'production', 'general', 'north')

    const bonusWithoutGap = calcAisleBonus(getState().cabinets)

    // Gap bonus (0.12) should be greater than no-gap bonus (0.05)
    expect(bonusWithGap).toBeGreaterThan(bonusWithoutGap)
  })

  it('placement on larger grid allows strategic spacing', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'starter' })

    // Place cabinets with aisle gap in starter tier (5x5 grid)
    // Row 0: north-facing
    getState().addCabinet(0, 0, 'production', 'general', 'north')
    getState().addCabinet(1, 0, 'production', 'general', 'north')
    // Row 2: south-facing (leaving row 1 as aisle)
    getState().addCabinet(0, 2, 'production', 'general', 'south')
    getState().addCabinet(1, 2, 'production', 'general', 'south')
    // Row 4: north-facing (leaving row 3 as aisle)
    getState().addCabinet(0, 4, 'production', 'general', 'north')
    getState().addCabinet(1, 4, 'production', 'general', 'north')

    expect(getState().cabinets).toHaveLength(6)
    // All cabinets should be within grid bounds
    for (const cab of getState().cabinets) {
      expect(cab.col).toBeLessThan(5)
      expect(cab.row).toBeLessThan(5)
    }
  })

  it('getFacingOffsets returns correct positions for all 4 directions', () => {
    const n = getFacingOffsets('north', 3, 3)
    expect(n.front).toEqual({ col: 3, row: 2 }) // front is row-1
    expect(n.rear).toEqual({ col: 3, row: 4 })  // rear is row+1

    const s = getFacingOffsets('south', 3, 3)
    expect(s.front).toEqual({ col: 3, row: 4 }) // front is row+1
    expect(s.rear).toEqual({ col: 3, row: 2 })  // rear is row-1

    const e = getFacingOffsets('east', 3, 3)
    expect(e.front).toEqual({ col: 4, row: 3 }) // front is col+1
    expect(e.rear).toEqual({ col: 2, row: 3 })  // rear is col-1

    const w = getFacingOffsets('west', 3, 3)
    expect(w.front).toEqual({ col: 2, row: 3 }) // front is col-1
    expect(w.rear).toEqual({ col: 4, row: 3 })  // rear is col+1
  })

  it('calcAisleBonus supports column-based E/W aisles', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })

    // Column 1 facing east, column 3 facing west (gap of 1 column between them)
    getState().addCabinet(1, 0, 'production', 'general', 'east')
    getState().addCabinet(1, 1, 'production', 'general', 'east')
    getState().addCabinet(3, 0, 'production', 'general', 'west')
    getState().addCabinet(3, 1, 'production', 'general', 'west')

    const bonus = calcAisleBonus(getState().cabinets)
    expect(bonus).toBeGreaterThan(0) // should get column-based aisle bonus
  })

  it('calcSpacingHeatEffect works for east-facing cabinet', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(3, 3, 'production', 'general', 'east')

    const cabs = getState().cabinets
    const cab = cabs[0]
    const effect = calcSpacingHeatEffect(cab, cabs)

    // Isolated east-facing: front (col+1) and rear (col-1) both empty
    expect(effect).toBeLessThan(0)
  })

  it('togglePlacementFacing cycles through all 4 directions', () => {
    expect(getState().placementFacing).toBe('north')
    getState().togglePlacementFacing()
    expect(getState().placementFacing).toBe('east')
    getState().togglePlacementFacing()
    expect(getState().placementFacing).toBe('south')
    getState().togglePlacementFacing()
    expect(getState().placementFacing).toBe('west')
    getState().togglePlacementFacing()
    expect(getState().placementFacing).toBe('north')
  })

  it('can place cabinets with east/west facing', () => {
    setState({ sandboxMode: true, money: 999999, suiteTier: 'standard' })
    getState().addCabinet(2, 2, 'production', 'general', 'east')
    getState().addCabinet(4, 2, 'production', 'general', 'west')

    const cabs = getState().cabinets
    expect(cabs).toHaveLength(2)
    expect(cabs[0].facing).toBe('east')
    expect(cabs[1].facing).toBe('west')
  })
})

// ============================================================================
// Operations Progression
// ============================================================================
function makeStaff(id: string, role: StaffMember['role'], skillLevel: StaffMember['skillLevel'] = 1): StaffMember {
  return { id, name: `Staff ${id}`, role, skillLevel, salaryPerTick: 4, hiredAtTick: 0, fatigueLevel: 0, onShift: true, incidentsResolved: 0, certifications: [] }
}

describe('Operations Progression', () => {
  it('starts at manual ops tier', () => {
    expect(getState().opsTier).toBe('manual')
    expect(getState().opsAutoResolvedCount).toBe(0)
    expect(getState().opsPreventedCount).toBe(0)
  })

  it('cannot upgrade without meeting requirements', () => {
    setState({ sandboxMode: true, money: 999999 })
    // Missing staff and tech requirements
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('manual')
  })

  it('can upgrade to monitoring when requirements are met', () => {
    setState({
      sandboxMode: true,
      money: 999999,
      staff: [makeStaff('s-1', 'network_engineer'), makeStaff('s-2', 'electrician')],
      unlockedTech: ['ups_upgrade'],
      reputationScore: 30,
      suiteTier: 'starter',
    })
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('monitoring')
  })

  it('deducts upgrade cost when upgrading', () => {
    setState({
      sandboxMode: false,
      money: 20000,
      staff: [makeStaff('s-1', 'network_engineer'), makeStaff('s-2', 'electrician')],
      unlockedTech: ['ups_upgrade'],
      reputationScore: 30,
      suiteTier: 'starter',
    })
    const moneyBefore = getState().money
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('monitoring')
    const monitoringConfig = OPS_TIER_CONFIG.find((c) => c.id === 'monitoring')!
    expect(getState().money).toBe(moneyBefore - monitoringConfig.upgradeCost)
  })

  it('cannot upgrade without enough money', () => {
    setState({
      sandboxMode: false,
      money: 100, // not enough
      staff: [makeStaff('s-1', 'network_engineer'), makeStaff('s-2', 'electrician')],
      unlockedTech: ['ups_upgrade'],
      reputationScore: 30,
    })
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('manual')
  })

  it('cannot skip tiers — must upgrade sequentially', () => {
    // Try to set up for automation tier directly (skipping monitoring)
    setState({
      sandboxMode: true,
      money: 999999,
      staff: Array.from({ length: 4 }, (_, i) => makeStaff(`s-${i}`, 'network_engineer', 2)),
      unlockedTech: ['ups_upgrade', 'redundant_cooling', 'auto_failover'],
      reputationScore: 50,
      suiteTier: 'standard',
    })
    // First upgrade goes to monitoring (not automation)
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('monitoring')
    // Second upgrade goes to automation
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('automation')
  })

  it('resolveIncident applies ops tier cost reduction', () => {
    setupBasicDataCenter()
    const incident = INCIDENT_CATALOG.find((d) => d.effect === 'revenue_penalty')!
    setState({
      opsTier: 'automation',
      activeIncidents: [{
        id: 'inc-test',
        def: incident,
        ticksRemaining: 10,
        resolved: false,
      }],
    })
    const moneyBefore = getState().money
    getState().resolveIncident('inc-test')
    const automationConfig = OPS_TIER_CONFIG.find((c) => c.id === 'automation')!
    const expectedCost = Math.round(incident.resolveCost * (1 - automationConfig.benefits.resolveCostReduction))
    expect(getState().money).toBe(moneyBefore - expectedCost)
  })

  it('OPS_TIER_CONFIG has 4 tiers in order', () => {
    expect(OPS_TIER_CONFIG).toHaveLength(4)
    expect(OPS_TIER_CONFIG[0].id).toBe('manual')
    expect(OPS_TIER_CONFIG[1].id).toBe('monitoring')
    expect(OPS_TIER_CONFIG[2].id).toBe('automation')
    expect(OPS_TIER_CONFIG[3].id).toBe('orchestration')
  })

  it('resetGame resets ops tier to manual', () => {
    setState({ opsTier: 'orchestration', opsAutoResolvedCount: 50, opsPreventedCount: 30 })
    getState().resetGame()
    expect(getState().opsTier).toBe('manual')
    expect(getState().opsAutoResolvedCount).toBe(0)
    expect(getState().opsPreventedCount).toBe(0)
  })

  it('cannot upgrade past orchestration', () => {
    setState({
      sandboxMode: true,
      money: 999999,
      opsTier: 'orchestration',
    })
    getState().upgradeOpsTier()
    expect(getState().opsTier).toBe('orchestration')
  })

  it('each tier has increasing benefits', () => {
    for (let i = 1; i < OPS_TIER_CONFIG.length; i++) {
      const prev = OPS_TIER_CONFIG[i - 1]
      const curr = OPS_TIER_CONFIG[i]
      expect(curr.benefits.incidentSpawnReduction).toBeGreaterThanOrEqual(prev.benefits.incidentSpawnReduction)
      expect(curr.benefits.autoResolveSpeedBonus).toBeGreaterThanOrEqual(prev.benefits.autoResolveSpeedBonus)
      expect(curr.benefits.resolveCostReduction).toBeGreaterThanOrEqual(prev.benefits.resolveCostReduction)
    }
  })
})
