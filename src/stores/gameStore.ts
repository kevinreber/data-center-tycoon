import { create } from 'zustand'

export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'
export type GameSpeed = 0 | 1 | 2 | 3

export interface Cabinet {
  id: string
  serverCount: number     // 1–4 servers per cabinet
  hasLeafSwitch: boolean  // ToR switch mounted on top
  powerStatus: boolean
  heatLevel: number       // °C, dynamic per tick
}

export interface SpineSwitch {
  id: string
  powerStatus: boolean
}

// ── Traffic / Network Types ─────────────────────────────────────

/** A single leaf-to-spine connection carrying traffic */
export interface TrafficLink {
  leafCabinetId: string
  spineId: string
  bandwidthGbps: number     // current traffic on this link
  capacityGbps: number      // max capacity of this link
  utilization: number       // 0–1
  redirected: boolean       // true if this link is carrying extra load due to a spine going down
}

export interface TrafficStats {
  totalFlows: number
  totalBandwidthGbps: number
  totalCapacityGbps: number
  redirectedFlows: number
  links: TrafficLink[]
  spineUtilization: Record<string, number>  // spineId → 0–1
}

export interface LayerColors {
  top: number
  side: number
  front: number
}

export type LayerVisibility = Record<NodeType, boolean>
export type LayerOpacity = Record<NodeType, number>
export type LayerColorOverrides = Record<NodeType, LayerColors | null>

// ── Simulation Constants ──────────────────────────────────────────

export const SIM = {
  revenuePerServer: 12,       // $ per tick per active server
  powerCostPerKW: 0.50,       // $ per tick per kW of IT power draw
  heatPerServer: 1.5,         // °C per tick per active server in a cabinet
  heatPerLeaf: 0.3,           // °C per tick per active leaf switch
  airCoolingRate: 2.0,        // °C removed per tick per cabinet by air cooling
  ambientTemp: 22,            // minimum temperature (room ambient °C)
  throttleTemp: 80,           // servers produce half revenue above this
  criticalTemp: 95,           // equipment takes damage above this
}

/** Cooling overhead as a fraction of IT power, based on average heat */
export function coolingOverheadFactor(avgHeat: number): number {
  if (avgHeat <= 30) return 0.15
  if (avgHeat <= 40) return 0.20
  if (avgHeat <= 50) return 0.30
  if (avgHeat <= 60) return 0.45
  if (avgHeat <= 70) return 0.65
  if (avgHeat <= 80) return 0.90
  return 1.2 + (avgHeat - 80) * 0.05
}

// ── Existing Constants ────────────────────────────────────────────

export const DEFAULT_COLORS: Record<NodeType, LayerColors> = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

export const MAX_SERVERS_PER_CABINET = 4
export const MAX_CABINETS = 32  // 8x4 grid
export const MAX_SPINES = 6

const COSTS = {
  cabinet: 2000,
  server: 2000,
  leaf_switch: 5000,
  spine_switch: 12000,
}

export const RACK_COST: Record<string, number> = {
  cabinet: COSTS.cabinet,
  server: COSTS.server,
  leaf_switch: COSTS.leaf_switch,
  spine_switch: COSTS.spine_switch,
}

const POWER_DRAW = {
  server: 450,
  leaf_switch: 150,
  spine_switch: 250,
}

export { POWER_DRAW }

// ── Traffic Constants ────────────────────────────────────────────

const TRAFFIC = {
  gbpsPerServer: 1,         // each active server generates 1 Gbps of east-west traffic
  linkCapacityGbps: 10,     // each leaf→spine uplink is 10 Gbps
}

export { TRAFFIC }

/** Calculate traffic flows across the leaf-spine fabric */
function calcTraffic(cabinets: Cabinet[], spines: SpineSwitch[]): TrafficStats {
  const emptyStats: TrafficStats = {
    totalFlows: 0,
    totalBandwidthGbps: 0,
    totalCapacityGbps: 0,
    redirectedFlows: 0,
    links: [],
    spineUtilization: {},
  }

  const activeSpines = spines.filter((s) => s.powerStatus)
  const leafCabinets = cabinets.filter((c) => c.hasLeafSwitch && c.powerStatus)

  if (activeSpines.length === 0 || leafCabinets.length === 0) return emptyStats

  // Each leaf cabinet distributes its server traffic evenly across all active spines (ECMP)
  const links: TrafficLink[] = []
  const spineLoad: Record<string, number> = {}
  const spineCapacity: Record<string, number> = {}

  for (const spine of activeSpines) {
    spineLoad[spine.id] = 0
    spineCapacity[spine.id] = 0
  }

  // Detect if redirection is happening: are there powered-off spines while traffic exists?
  const totalSpines = spines.length
  const downSpines = totalSpines - activeSpines.length
  const isRedirecting = downSpines > 0 && leafCabinets.length > 0

  let totalFlows = 0
  let totalBw = 0
  let totalCap = 0
  let redirectedFlows = 0

  for (const cab of leafCabinets) {
    const cabTraffic = cab.serverCount * TRAFFIC.gbpsPerServer
    const perSpineBw = cabTraffic / activeSpines.length

    for (const spine of activeSpines) {
      const capacity = TRAFFIC.linkCapacityGbps
      const bandwidth = Math.min(perSpineBw, capacity)
      const utilization = bandwidth / capacity
      const redirected = isRedirecting

      links.push({
        leafCabinetId: cab.id,
        spineId: spine.id,
        bandwidthGbps: +bandwidth.toFixed(2),
        capacityGbps: capacity,
        utilization: +utilization.toFixed(3),
        redirected,
      })

      spineLoad[spine.id] += bandwidth
      spineCapacity[spine.id] += capacity
      totalFlows++
      totalBw += bandwidth
      totalCap += capacity
      if (redirected) redirectedFlows++
    }
  }

  // Calculate per-spine utilization
  const spineUtilization: Record<string, number> = {}
  for (const spine of activeSpines) {
    const cap = spineCapacity[spine.id]
    spineUtilization[spine.id] = cap > 0 ? +(spineLoad[spine.id] / cap).toFixed(3) : 0
  }

  return {
    totalFlows,
    totalBandwidthGbps: +totalBw.toFixed(2),
    totalCapacityGbps: +totalCap.toFixed(2),
    redirectedFlows,
    links,
    spineUtilization,
  }
}

// ── Stats Calculation ─────────────────────────────────────────────

function calcStats(cabinets: Cabinet[], spines: SpineSwitch[]) {
  let itPower = 0
  let heatSum = 0
  let activeCabs = 0

  for (const cab of cabinets) {
    if (cab.powerStatus) {
      itPower += cab.serverCount * POWER_DRAW.server
      if (cab.hasLeafSwitch) itPower += POWER_DRAW.leaf_switch
      heatSum += cab.heatLevel
      activeCabs++
    }
  }

  for (const spine of spines) {
    if (spine.powerStatus) {
      itPower += POWER_DRAW.spine_switch
    }
  }

  const avgHeat = activeCabs > 0 ? Math.round(heatSum / activeCabs) : SIM.ambientTemp
  const overhead = coolingOverheadFactor(avgHeat)
  const coolingPower = Math.round(itPower * overhead)
  const pue = itPower > 0 ? +((itPower + coolingPower) / itPower).toFixed(2) : 0

  return { totalPower: itPower, coolingPower, avgHeat, pue }
}

// ── State Interface ───────────────────────────────────────────────

interface GameState {
  cabinets: Cabinet[]
  spineSwitches: SpineSwitch[]

  // Computed stats
  totalPower: number      // IT equipment watts
  coolingPower: number    // Cooling system watts
  money: number
  pue: number
  avgHeat: number

  // Simulation
  gameSpeed: GameSpeed
  tickCount: number
  revenue: number         // revenue earned last tick
  expenses: number        // total expenses last tick
  powerCost: number       // power portion of expenses
  coolingCost: number     // cooling portion of expenses

  // Visual
  layerVisibility: LayerVisibility
  layerOpacity: LayerOpacity
  layerColors: LayerColorOverrides

  // Traffic
  trafficStats: TrafficStats
  trafficVisible: boolean

  // Actions
  addCabinet: () => void
  upgradeNextCabinet: () => void
  addLeafToNextCabinet: () => void
  addSpineSwitch: () => void
  toggleCabinetPower: (id: string) => void
  toggleSpinePower: (id: string) => void
  toggleLayerVisibility: (type: NodeType) => void
  setLayerOpacity: (type: NodeType, opacity: number) => void
  setLayerColor: (type: NodeType, colors: LayerColors | null) => void
  setGameSpeed: (speed: GameSpeed) => void
  toggleTrafficVisible: () => void
  tick: () => void
}

let nextCabId = 1
let nextSpineId = 1

export const useGameStore = create<GameState>((set) => ({
  cabinets: [],
  spineSwitches: [],
  totalPower: 0,
  coolingPower: 0,
  money: 50000,
  pue: 0,
  avgHeat: SIM.ambientTemp,

  // Simulation
  gameSpeed: 1,
  tickCount: 0,
  revenue: 0,
  expenses: 0,
  powerCost: 0,
  coolingCost: 0,

  // Visual
  layerVisibility: { server: true, leaf_switch: true, spine_switch: true },
  layerOpacity: { server: 1, leaf_switch: 1, spine_switch: 1 },
  layerColors: { server: null, leaf_switch: null, spine_switch: null },

  // Traffic
  trafficStats: {
    totalFlows: 0,
    totalBandwidthGbps: 0,
    totalCapacityGbps: 0,
    redirectedFlows: 0,
    links: [],
    spineUtilization: {},
  },
  trafficVisible: true,

  // ── Build Actions ───────────────────────────────────────────

  addCabinet: () =>
    set((state) => {
      if (state.money < COSTS.cabinet) return state
      if (state.cabinets.length >= MAX_CABINETS) return state
      const cab: Cabinet = {
        id: `cab-${nextCabId++}`,
        serverCount: 1,
        hasLeafSwitch: false,
        powerStatus: true,
        heatLevel: SIM.ambientTemp,
      }
      const newCabinets = [...state.cabinets, cab]
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.cabinet,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  upgradeNextCabinet: () =>
    set((state) => {
      if (state.money < COSTS.server) return state
      const idx = state.cabinets.findIndex((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
      if (idx === -1) return state
      const newCabinets = state.cabinets.map((c, i) =>
        i === idx ? { ...c, serverCount: c.serverCount + 1 } : c
      )
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.server,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  addLeafToNextCabinet: () =>
    set((state) => {
      if (state.money < COSTS.leaf_switch) return state
      const idx = state.cabinets.findIndex((c) => !c.hasLeafSwitch)
      if (idx === -1) return state
      const newCabinets = state.cabinets.map((c, i) =>
        i === idx ? { ...c, hasLeafSwitch: true } : c
      )
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.leaf_switch,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  addSpineSwitch: () =>
    set((state) => {
      if (state.money < COSTS.spine_switch) return state
      if (state.spineSwitches.length >= MAX_SPINES) return state
      const spine: SpineSwitch = {
        id: `spine-${nextSpineId++}`,
        powerStatus: true,
      }
      const newSpines = [...state.spineSwitches, spine]
      return {
        spineSwitches: newSpines,
        money: state.money - COSTS.spine_switch,
        ...calcStats(state.cabinets, newSpines),
      }
    }),

  toggleCabinetPower: (id) =>
    set((state) => {
      const newCabinets = state.cabinets.map((c) =>
        c.id === id ? { ...c, powerStatus: !c.powerStatus } : c
      )
      return {
        cabinets: newCabinets,
        ...calcStats(newCabinets, state.spineSwitches),
        trafficStats: calcTraffic(newCabinets, state.spineSwitches),
      }
    }),

  toggleSpinePower: (id) =>
    set((state) => {
      const newSpines = state.spineSwitches.map((s) =>
        s.id === id ? { ...s, powerStatus: !s.powerStatus } : s
      )
      return {
        spineSwitches: newSpines,
        ...calcStats(state.cabinets, newSpines),
        trafficStats: calcTraffic(state.cabinets, newSpines),
      }
    }),

  // ── Visual Actions ──────────────────────────────────────────

  toggleLayerVisibility: (type) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [type]: !state.layerVisibility[type],
      },
    })),

  setLayerOpacity: (type, opacity) =>
    set((state) => ({
      layerOpacity: {
        ...state.layerOpacity,
        [type]: Math.max(0, Math.min(1, opacity)),
      },
    })),

  setLayerColor: (type, colors) =>
    set((state) => ({
      layerColors: {
        ...state.layerColors,
        [type]: colors,
      },
    })),

  // ── Simulation Actions ──────────────────────────────────────

  setGameSpeed: (speed) => set({ gameSpeed: speed }),

  toggleTrafficVisible: () =>
    set((state) => ({ trafficVisible: !state.trafficVisible })),

  tick: () =>
    set((state) => {
      if (state.cabinets.length === 0 && state.spineSwitches.length === 0) {
        return { tickCount: state.tickCount + 1 }
      }

      // 1. Update heat per cabinet
      const newCabinets = state.cabinets.map((cab) => {
        let heat = cab.heatLevel

        if (cab.powerStatus) {
          // Heat generation from active equipment
          heat += cab.serverCount * SIM.heatPerServer
          if (cab.hasLeafSwitch) heat += SIM.heatPerLeaf
        }

        // Air cooling dissipation (always active, even for powered-off cabs)
        heat -= SIM.airCoolingRate

        // Clamp to ambient minimum and 100 max
        heat = Math.max(SIM.ambientTemp, Math.min(100, heat))

        return { ...cab, heatLevel: Math.round(heat * 10) / 10 }
      })

      // 2. Calculate stats with updated heat
      const stats = calcStats(newCabinets, state.spineSwitches)

      // 3. Calculate revenue
      let activeServers = 0
      let throttledServers = 0
      for (const cab of newCabinets) {
        if (cab.powerStatus) {
          if (cab.heatLevel >= SIM.throttleTemp) {
            throttledServers += cab.serverCount
          } else {
            activeServers += cab.serverCount
          }
        }
      }
      // Throttled servers earn half revenue
      const revenue = activeServers * SIM.revenuePerServer +
        throttledServers * SIM.revenuePerServer * 0.5

      // 4. Calculate expenses
      const powerCost = +(stats.totalPower / 1000 * SIM.powerCostPerKW).toFixed(2)
      const coolingCost = +(stats.coolingPower / 1000 * SIM.powerCostPerKW).toFixed(2)
      const expenses = +(powerCost + coolingCost).toFixed(2)

      // 5. Update money
      const netIncome = revenue - expenses
      const newMoney = Math.round((state.money + netIncome) * 100) / 100

      // 6. Calculate traffic flows
      const trafficStats = calcTraffic(newCabinets, state.spineSwitches)

      return {
        cabinets: newCabinets,
        tickCount: state.tickCount + 1,
        revenue: +revenue.toFixed(2),
        expenses,
        powerCost,
        coolingCost,
        money: newMoney,
        trafficStats,
        ...stats,
      }
    }),
}))
