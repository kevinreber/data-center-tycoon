import { create } from 'zustand'

export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'

export interface Cabinet {
  id: string
  serverCount: number     // 1–4 servers per cabinet
  hasLeafSwitch: boolean  // ToR switch mounted on top
  powerStatus: boolean
  heatLevel: number
}

export interface SpineSwitch {
  id: string
  powerStatus: boolean
}

export interface LayerColors {
  top: number
  side: number
  front: number
}

export type LayerVisibility = Record<NodeType, boolean>
export type LayerOpacity = Record<NodeType, number>
export type LayerColorOverrides = Record<NodeType, LayerColors | null>

interface GameState {
  cabinets: Cabinet[]
  spineSwitches: SpineSwitch[]
  totalPower: number
  money: number
  pue: number
  avgHeat: number
  layerVisibility: LayerVisibility
  layerOpacity: LayerOpacity
  layerColors: LayerColorOverrides
  addCabinet: () => void
  upgradeNextCabinet: () => void
  addLeafToNextCabinet: () => void
  addSpineSwitch: () => void
  toggleCabinetPower: (id: string) => void
  toggleSpinePower: (id: string) => void
  toggleLayerVisibility: (type: NodeType) => void
  setLayerOpacity: (type: NodeType, opacity: number) => void
  setLayerColor: (type: NodeType, colors: LayerColors | null) => void
}

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

function calcStats(cabinets: Cabinet[], spines: SpineSwitch[]) {
  let totalPower = 0
  let heatSum = 0
  let activeCabs = 0

  for (const cab of cabinets) {
    if (cab.powerStatus) {
      totalPower += cab.serverCount * POWER_DRAW.server
      if (cab.hasLeafSwitch) totalPower += POWER_DRAW.leaf_switch
      heatSum += cab.heatLevel
      activeCabs++
    }
  }

  for (const spine of spines) {
    if (spine.powerStatus) {
      totalPower += POWER_DRAW.spine_switch
    }
  }

  const avgHeat = activeCabs > 0 ? Math.round(heatSum / activeCabs) : 0
  const totalNodes = cabinets.length + spines.length
  const pue = totalNodes > 0 ? +(1.2 + totalNodes * 0.02).toFixed(2) : 0

  return { totalPower, avgHeat, pue }
}

let nextCabId = 1
let nextSpineId = 1

export const useGameStore = create<GameState>((set) => ({
  cabinets: [],
  spineSwitches: [],
  totalPower: 0,
  money: 50000,
  pue: 0,
  avgHeat: 0,
  layerVisibility: { server: true, leaf_switch: true, spine_switch: true },
  layerOpacity: { server: 1, leaf_switch: 1, spine_switch: 1 },
  layerColors: { server: null, leaf_switch: null, spine_switch: null },

  addCabinet: () =>
    set((state) => {
      if (state.money < COSTS.cabinet) return state
      if (state.cabinets.length >= MAX_CABINETS) return state
      const cab: Cabinet = {
        id: `cab-${nextCabId++}`,
        serverCount: 1,
        hasLeafSwitch: false,
        powerStatus: true,
        heatLevel: Math.floor(Math.random() * 40) + 30,
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
        i === idx
          ? { ...c, serverCount: c.serverCount + 1, heatLevel: Math.min(90, c.heatLevel + 10) }
          : c
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
      return { cabinets: newCabinets, ...calcStats(newCabinets, state.spineSwitches) }
    }),

  toggleSpinePower: (id) =>
    set((state) => {
      const newSpines = state.spineSwitches.map((s) =>
        s.id === id ? { ...s, powerStatus: !s.powerStatus } : s
      )
      return { spineSwitches: newSpines, ...calcStats(state.cabinets, newSpines) }
    }),

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
}))
