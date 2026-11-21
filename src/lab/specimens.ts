import type { CabinetEnvironment, CabinetFacing, CoolingUnitType, ChillerTier, TrafficLink, LiquidCoolingType } from '@/stores/gameStore'
import { generateLayout } from '@/stores/gameStore'

// The Lab drives the real DataCenterScene through its public API, so every
// specimen here is rendered by exactly the code the game ships.

export type LabMode = 'specimens' | 'stress'

export type StateOverride = 'none' | 'warm' | 'throttled' | 'fire' | 'incident' | 'maintenance' | 'offline' | 'aging' | 'ecc'

export type Density = 'standard' | 'high_density' | 'extreme_density'

export interface CabinetVisual {
  heatLevel: number
  isThrottled: boolean
  isOnFire: boolean
  hasIncident: boolean
  inMaintenance: boolean
  serverAge: number
  liquidCooling: LiquidCoolingType
  eccFaultedGpus: number
  gpuCount: number
}

export interface CabinetSpec {
  id: string
  col: number
  row: number
  servers: number
  leaf: boolean
  environment: CabinetEnvironment
  facing: CabinetFacing
  density: Density
  podId: string | null
  powerOn: boolean
  visual: CabinetVisual
}

export interface PodSpec {
  id: string
  cabinetIds: string[]
}

export interface LabScenario {
  cols: number
  cabinetRows: number
  spineSlots: number
  cabinets: CabinetSpec[]
  pods: PodSpec[]
  spines: { id: string; powerOn: boolean }[]
  pdus: { id: string; col: number; row: number; overloaded: boolean }[]
  cableTrays: { id: string; col: number; row: number }[]
  coolingUnits: { id: string; col: number; row: number; type: CoolingUnitType; operational: boolean }[]
  chillers: { id: string; col: number; row: number; tier: ChillerTier; operational: boolean }[]
  rowLegend: { gridRow: number; label: string }[]
}

const NORMAL: CabinetVisual = {
  heatLevel: 35,
  isThrottled: false,
  isOnFire: false,
  hasIncident: false,
  inMaintenance: false,
  serverAge: 0,
  liquidCooling: 'none',
  eccFaultedGpus: 0,
  gpuCount: 0,
}

// Enterprise layout: 14 cols, 5 cabinet rows. generateLayout puts cabinet
// rows on grid rows 1, 3, 5, 7, 9 (alternating south / north facing) with
// aisles on 2, 4, 6, 8 and corridors on 0 and 10.
const COLS = 14
const CABINET_ROWS = 5
export const LAB_LAYOUT = generateLayout(CABINET_ROWS, COLS)

function facingFor(gridRow: number): CabinetFacing {
  const row = LAB_LAYOUT.cabinetRows.find((r) => r.gridRow === gridRow)
  return row?.facing ?? 'south'
}

function cab(id: string, col: number, row: number, overrides: Partial<CabinetSpec> = {}): CabinetSpec {
  return {
    id,
    col,
    row,
    servers: 4,
    leaf: true,
    environment: 'production',
    facing: facingFor(row),
    density: 'standard',
    podId: null,
    powerOn: true,
    visual: { ...NORMAL },
    ...overrides,
  }
}

/** Fill-level and environment catalog for one cabinet row (front or rear view) */
function catalogRow(prefix: string, row: number): CabinetSpec[] {
  const out: CabinetSpec[] = []
  for (let s = 0; s <= 4; s++) out.push(cab(`${prefix}-s${s}`, s, row, { servers: s, leaf: false }))
  for (let s = 0; s <= 4; s++) out.push(cab(`${prefix}-s${s}l`, 5 + s, row, { servers: s, leaf: true }))
  out.push(cab(`${prefix}-lab`, 10, row, { environment: 'lab' }))
  out.push(cab(`${prefix}-mgmt`, 11, row, { environment: 'management' }))
  out.push(cab(`${prefix}-off`, 12, row, { powerOn: false }))
  out.push(cab(`${prefix}-aging`, 13, row, { visual: { ...NORMAL, serverAge: 700 } }))
  return out
}

function stateRow(row: number): CabinetSpec[] {
  return [
    cab('st-normal', 0, row),
    cab('st-warm', 1, row, { visual: { ...NORMAL, heatLevel: 65 } }),
    cab('st-throttled', 2, row, { visual: { ...NORMAL, heatLevel: 85, isThrottled: true } }),
    cab('st-fire', 3, row, { visual: { ...NORMAL, heatLevel: 97, isThrottled: true, isOnFire: true } }),
    cab('st-incident', 4, row, { visual: { ...NORMAL, hasIncident: true } }),
    cab('st-maint', 5, row, { visual: { ...NORMAL, inMaintenance: true } }),
    cab('st-offline', 6, row, { powerOn: false }),
    cab('st-aging', 7, row, { visual: { ...NORMAL, serverAge: 760 } }),
  ]
}

function gpuRow(row: number): { cabinets: CabinetSpec[]; pods: PodSpec[] } {
  const cabinets: CabinetSpec[] = []
  const podA: string[] = []
  const podB: string[] = []
  // Small pod: 4 cabinets, 1 GPU node each (matches what createGPUPod builds)
  for (let i = 0; i < 4; i++) {
    const id = `gpu-a${i}`
    podA.push(id)
    cabinets.push(cab(id, i, row, { servers: 1, density: 'high_density', podId: 'pod-a', visual: { ...NORMAL, liquidCooling: 'rear_door_hx', gpuCount: 16 } }))
  }
  // Medium pod: 8 cabinets, varying node counts
  for (let i = 0; i < 8; i++) {
    const id = `gpu-b${i}`
    podB.push(id)
    const ecc = i === 3 ? 6 : 0
    cabinets.push(cab(id, 4 + i, row, { servers: 1 + (i % 4), density: 'high_density', podId: 'pod-b', visual: { ...NORMAL, liquidCooling: 'direct_to_chip', gpuCount: 16, eccFaultedGpus: ecc } }))
  }
  const immersion = { ...NORMAL, liquidCooling: 'single_phase_immersion' as const, gpuCount: 16 }
  cabinets.push(cab('gpu-x0', 12, row, { servers: 4, density: 'extreme_density', visual: immersion }))
  cabinets.push(cab('gpu-x1', 13, row, { servers: 2, density: 'extreme_density', powerOn: false, visual: immersion }))
  return { cabinets, pods: [{ id: 'pod-a', cabinetIds: podA }, { id: 'pod-b', cabinetIds: podB }] }
}

function baseScenario(): Omit<LabScenario, 'cabinets' | 'pods' | 'rowLegend'> {
  return {
    cols: COLS,
    cabinetRows: CABINET_ROWS,
    spineSlots: 8,
    spines: Array.from({ length: 8 }, (_, i) => ({ id: `spine-${i}`, powerOn: i < 6 })),
    // Infrastructure sits on the front corridor (grid row 10) so no cabinet row hides it
    pdus: [
      { id: 'pdu-ok', col: 0, row: 10, overloaded: false },
      { id: 'pdu-hot', col: 1, row: 10, overloaded: true },
    ],
    cableTrays: [2, 3].map((col) => ({ id: `tray-${col}`, col, row: 10 })),
    coolingUnits: [
      { id: 'cu-fan', col: 4, row: 10, type: 'fan_tray', operational: true },
      { id: 'cu-crac', col: 5, row: 10, type: 'crac', operational: true },
      { id: 'cu-crah', col: 6, row: 10, type: 'crah', operational: true },
      { id: 'cu-imm', col: 7, row: 10, type: 'immersion_pod', operational: true },
      { id: 'cu-crac-fail', col: 8, row: 10, type: 'crac', operational: false },
      { id: 'cu-imm-fail', col: 9, row: 10, type: 'immersion_pod', operational: false },
    ],
    chillers: [
      { id: 'ch-basic', col: 11, row: 10, tier: 'basic', operational: true },
      { id: 'ch-adv', col: 12, row: 10, tier: 'advanced', operational: true },
      { id: 'ch-fail', col: 13, row: 10, tier: 'basic', operational: false },
    ],
  }
}

export function buildSpecimenScenario(): LabScenario {
  const gpu = gpuRow(9)
  return {
    ...baseScenario(),
    cabinets: [
      ...catalogRow('f', 1),
      ...catalogRow('r', 3),
      ...stateRow(5),
      // Rear-view GPU racks (row 7 cols 12–13 stay clear of the pods' InfiniBand switches)
      cab('gpu-r-hx', 12, 7, { servers: 2, density: 'high_density', visual: { ...NORMAL, liquidCooling: 'rear_door_hx' } }),
      cab('gpu-r-d2c', 13, 7, { servers: 4, density: 'high_density', visual: { ...NORMAL, liquidCooling: 'direct_to_chip' } }),
      ...gpu.cabinets,
    ],
    pods: gpu.pods,
    rowLegend: [
      { gridRow: 1, label: 'Front view (south-facing): 0–4 servers without leaf, 0–4 with leaf, lab, management, offline, aging' },
      { gridRow: 3, label: 'Rear view (north-facing): same catalog as the front row' },
      { gridRow: 5, label: 'States: normal, warm, throttled, fire, incident, maintenance, offline, aging' },
      { gridRow: 7, label: 'Rear-view GPU racks: rear-door heat exchanger, direct-to-chip (InfiniBand switches sit between rows 7 and 9)' },
      { gridRow: 9, label: 'GPU: small pod (rear-door HX), medium pod (direct-to-chip; 4th cabinet has 6 ECC-faulted GPUs), extreme density immersion, same offline' },
      { gridRow: 10, label: 'Corridor: PDU, overloaded PDU, 2 cable trays, fan tray, CRAC, CRAH, immersion pod, failed CRAC, failed immersion, chiller, advanced chiller, failed chiller' },
    ],
  }
}

/** Enterprise-size load test: 50 cabinets, 8 spines, 2 GPU pods */
export function buildStressScenario(): LabScenario {
  const cabinets: CabinetSpec[] = []
  for (const row of [1, 3, 5, 7]) {
    for (let col = 0; col < 9; col++) {
      const n = (row * 7 + col * 3) % 5
      cabinets.push(cab(`s-${row}-${col}`, col, row, {
        servers: n,
        leaf: (row + col) % 3 !== 0,
        environment: col % 6 === 5 ? 'management' : col % 7 === 6 ? 'lab' : 'production',
        visual: { ...NORMAL, heatLevel: 30 + ((row * 13 + col * 11) % 55) },
      }))
    }
  }
  const gpu = gpuRow(9)
  const gpuCabs = gpu.cabinets.filter((c) => c.podId !== null)
  cabinets.push(...gpuCabs)
  cabinets.push(cab('s-9-12', 12, 9), cab('s-9-13', 13, 9, { servers: 2 }))
  return {
    ...baseScenario(),
    cabinets,
    pods: gpu.pods,
    rowLegend: [{ gridRow: 0, label: `Stress test: ${cabinets.length} cabinets, 8 spines, 2 GPU pods with InfiniBand fabrics` }],
  }
}

export function applyOverride(spec: CabinetSpec, override: StateOverride): { powerOn: boolean; visual: CabinetVisual } {
  const visual = { ...spec.visual }
  let powerOn = spec.powerOn
  switch (override) {
    case 'none':
      break
    case 'warm':
      visual.heatLevel = 65
      break
    case 'throttled':
      visual.heatLevel = 85
      visual.isThrottled = true
      break
    case 'fire':
      visual.heatLevel = 97
      visual.isThrottled = true
      visual.isOnFire = true
      break
    case 'incident':
      visual.hasIncident = true
      break
    case 'maintenance':
      visual.inMaintenance = true
      break
    case 'offline':
      powerOn = false
      break
    case 'aging':
      visual.serverAge = 760
      break
    case 'ecc':
      // Only GPU cabinets have GPUs to fault
      if (spec.density !== 'standard') visual.eccFaultedGpus = Math.max(1, Math.round(visual.gpuCount / 2))
      break
  }
  // The game only reports throttling for powered cabinets
  if (!powerOn) visual.isThrottled = false
  return { powerOn, visual }
}

/** Leaf-to-spine traffic for every cabinet with a leaf switch (ECMP across powered spines) */
export function buildTrafficLinks(scenario: LabScenario): TrafficLink[] {
  const spines = scenario.spines.filter((s) => s.powerOn)
  const links: TrafficLink[] = []
  for (const c of scenario.cabinets) {
    if (!c.leaf || !c.powerOn || c.servers === 0) continue
    spines.forEach((s, i) => {
      const utilization = Math.min(1, (c.servers / 4) * (0.35 + ((c.col + i) % 4) * 0.2))
      links.push({ leafCabinetId: c.id, spineId: s.id, bandwidthGbps: utilization * 10, capacityGbps: 10, utilization, redirected: false })
    })
  }
  return links
}

/** Synthetic InfiniBand fabric per pod: 4 rails, one IB leaf + spine per rail */
export function buildIBFabrics(scenario: LabScenario) {
  const fabrics: { id: string; podId: string; railCount: number; leafSwitchIds: string[]; spineSwitchIds: string[]; linkIds: string[] }[] = []
  const switches: { id: string; type: 'ib_leaf' | 'ib_spine'; podId: string; rail: number; operational: boolean }[] = []
  const links: { id: string; fromSwitchId: string; toSwitchId: string; fabricId: string; rail: number; status: 'healthy' | 'flapping' | 'down' }[] = []
  for (const pod of scenario.pods) {
    const fabricId = `ib-${pod.id}`
    const leafSwitchIds: string[] = []
    const spineSwitchIds: string[] = []
    const linkIds: string[] = []
    for (let rail = 0; rail < 4; rail++) {
      const leafId = `${fabricId}-leaf-${rail}`
      const spineId = `${fabricId}-spine-${rail}`
      leafSwitchIds.push(leafId)
      spineSwitchIds.push(spineId)
      switches.push({ id: leafId, type: 'ib_leaf', podId: pod.id, rail, operational: !(pod.id === 'pod-b' && rail === 3) })
      switches.push({ id: spineId, type: 'ib_spine', podId: pod.id, rail, operational: true })
      const up = `${leafId}-up`
      links.push({ id: up, fromSwitchId: leafId, toSwitchId: spineId, fabricId, rail, status: 'healthy' })
      linkIds.push(up)
      pod.cabinetIds.forEach((cabId, i) => {
        const id = `${leafId}-${cabId}`
        const status = pod.id === 'pod-b' && rail === 1 && i === 2 ? 'flapping' : pod.id === 'pod-b' && rail === 2 && i === 5 ? 'down' : 'healthy'
        links.push({ id, fromSwitchId: leafId, toSwitchId: cabId, fabricId, rail, status })
        linkIds.push(id)
      })
    }
    fabrics.push({ id: fabricId, podId: pod.id, railCount: 4, leafSwitchIds, spineSwitchIds, linkIds })
  }
  return { fabrics, switches, links }
}
