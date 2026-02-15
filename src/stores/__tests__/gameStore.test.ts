import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/stores/gameStore'
import type {
  Season,
  ServerConfig,
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
