import type { NodeType, LayerColors } from './types'

// ── Simulation Constants ───────────────────────────────────────
export const SIM = {
  revenuePerServer: 12,
  powerCostPerKW: 0.50,
  heatPerServer: 1.5,
  heatPerLeaf: 0.3,
  airCoolingRate: 2.0,
  ambientTemp: 22,
  throttleTemp: 80,
  criticalTemp: 95,
}

// ── Power Draw ─────────────────────────────────────────────────
export const POWER_DRAW = {
  server: 450,
  leaf_switch: 150,
  spine_switch: 250,
}

// ── Equipment Costs ────────────────────────────────────────────
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

export { COSTS }

// ── Traffic Constants ──────────────────────────────────────────
export const TRAFFIC = {
  gbpsPerServer: 1,
  linkCapacityGbps: 10,
}

// ── Capacity Limits ────────────────────────────────────────────
export const MAX_SERVERS_PER_CABINET = 4
export const MAX_CABINETS = 50
export const MAX_SPINES = 8
export const MAX_SAVE_SLOTS = 3

// ── Default Layer Colors ───────────────────────────────────────
export const DEFAULT_COLORS: Record<NodeType, LayerColors> = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

// ── Time-of-Day Constants ──────────────────────────────────────
export const MINUTES_PER_TICK = 15
