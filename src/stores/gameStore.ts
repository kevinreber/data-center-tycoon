import { create } from 'zustand'

export type ViewMode = 'cabinet' | 'above_cabinet'

export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'

export interface RackNode {
  id: string
  type: NodeType
  powerStatus: boolean
  heatLevel: number
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
  racks: RackNode[]
  totalPower: number
  money: number
  pue: number
  avgHeat: number
  viewMode: ViewMode
  layerVisibility: LayerVisibility
  layerOpacity: LayerOpacity
  layerColors: LayerColorOverrides
  addRack: (type: NodeType) => void
  togglePower: (id: string) => void
  setViewMode: (mode: ViewMode) => void
  toggleLayerVisibility: (type: NodeType) => void
  setLayerOpacity: (type: NodeType, opacity: number) => void
  setLayerColor: (type: NodeType, colors: LayerColors | null) => void
}

export const DEFAULT_COLORS: Record<NodeType, LayerColors> = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

const POWER_DRAW: Record<RackNode['type'], number> = {
  server: 450,
  leaf_switch: 150,
  spine_switch: 250,
}

const RACK_COST: Record<RackNode['type'], number> = {
  server: 2000,
  leaf_switch: 5000,
  spine_switch: 12000,
}

function calcStats(racks: RackNode[]) {
  const activeRacks = racks.filter((r) => r.powerStatus)
  const totalPower = activeRacks.reduce((sum, r) => sum + POWER_DRAW[r.type], 0)
  const avgHeat =
    activeRacks.length > 0
      ? Math.round(activeRacks.reduce((sum, r) => sum + r.heatLevel, 0) / activeRacks.length)
      : 0
  // PUE: ratio of total facility power to IT power (1.0 = perfect, typical DCs are 1.3-1.8)
  const pue = activeRacks.length > 0 ? +(1.2 + activeRacks.length * 0.02).toFixed(2) : 0
  return { totalPower, avgHeat, pue }
}

let nextId = 1

export const useGameStore = create<GameState>((set) => ({
  racks: [],
  totalPower: 0,
  money: 50000,
  pue: 0,
  avgHeat: 0,
  viewMode: 'cabinet' as ViewMode,
  layerVisibility: { server: true, leaf_switch: true, spine_switch: true },
  layerOpacity: { server: 1, leaf_switch: 1, spine_switch: 1 },
  layerColors: { server: null, leaf_switch: null, spine_switch: null },
  addRack: (type) =>
    set((state) => {
      const cost = RACK_COST[type]
      if (state.money < cost) return state
      const node: RackNode = {
        id: `node-${nextId++}`,
        type,
        powerStatus: true,
        heatLevel: Math.floor(Math.random() * 60) + 20,
      }
      const newRacks = [...state.racks, node]
      const stats = calcStats(newRacks)
      return {
        racks: newRacks,
        money: state.money - cost,
        ...stats,
      }
    }),
  togglePower: (id) =>
    set((state) => {
      const newRacks = state.racks.map((r) =>
        r.id === id ? { ...r, powerStatus: !r.powerStatus } : r
      )
      return {
        racks: newRacks,
        ...calcStats(newRacks),
      }
    }),
  setViewMode: (mode) => set({ viewMode: mode }),
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
