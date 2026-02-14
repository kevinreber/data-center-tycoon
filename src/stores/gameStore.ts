import { create } from 'zustand'

export interface RackNode {
  id: string
  type: 'server' | 'leaf_switch' | 'spine_switch'
  powerStatus: boolean
  heatLevel: number
}

interface GameState {
  racks: RackNode[]
  totalPower: number
  addRack: (type: RackNode['type']) => void
  togglePower: (id: string) => void
}

let nextId = 1

export const useGameStore = create<GameState>((set) => ({
  racks: [],
  totalPower: 0,
  addRack: (type) =>
    set((state) => {
      const node: RackNode = {
        id: `node-${nextId++}`,
        type,
        powerStatus: true,
        heatLevel: Math.floor(Math.random() * 60) + 20,
      }
      const newRacks = [...state.racks, node]
      return {
        racks: newRacks,
        totalPower: newRacks.filter((r) => r.powerStatus).length * 450,
      }
    }),
  togglePower: (id) =>
    set((state) => {
      const newRacks = state.racks.map((r) =>
        r.id === id ? { ...r, powerStatus: !r.powerStatus } : r
      )
      return {
        racks: newRacks,
        totalPower: newRacks.filter((r) => r.powerStatus).length * 450,
      }
    }),
}))
