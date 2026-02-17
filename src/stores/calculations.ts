import type {
  Cabinet,
  SpineSwitch,
  CabinetEnvironment,
  CabinetFacing,
  CustomerType,
  SuiteTier,
  TrafficLink,
  TrafficStats,
  PlacementHint,
  DataCenterLayout,
  DataCenterRow,
  CableRun,
  PDU,
  PDUConfig,
  CoolingUnit,
  ChillerPlant,
  CoolingPipe,
  Zone,
  ZoneRequirement,
  DedicatedRowInfo,
} from './types'

import { SIM, POWER_DRAW, TRAFFIC } from './constants'
import { CUSTOMER_TYPE_CONFIG, COOLING_UNIT_CONFIG, ENVIRONMENT_CONFIG, BASE_AMBIENT_DISSIPATION, UNCONNECTED_CRAH_PENALTY } from './configs/equipment'
import { SUITE_TIERS, SPACING_CONFIG, ZONE_BONUS_CONFIG, AISLE_CONTAINMENT_CONFIG } from './configs/infrastructure'
import { REPUTATION_TIERS, getReputationTier } from './configs/progression'
import { getChillerConnection } from './chiller'

// Re-export getReputationTier so consumers can import from calculations or gameStore
export { getReputationTier, REPUTATION_TIERS }

// ── Cooling Overhead ───────────────────────────────────────────

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

/** Management bonus: each active mgmt server reduces cooling overhead by 3%, capped at 30% */
const MGMT_BONUS_PER_SERVER = 0.03
const MGMT_BONUS_CAP = 0.30

export function calcManagementBonus(cabinets: Cabinet[]): number {
  let mgmtServers = 0
  for (const cab of cabinets) {
    if (cab.environment === 'management' && cab.powerStatus) {
      mgmtServers += cab.serverCount
    }
  }
  return Math.min(MGMT_BONUS_CAP, mgmtServers * MGMT_BONUS_PER_SERVER)
}

// ── Stats Calculation ──────────────────────────────────────────

export function calcStats(cabinets: Cabinet[], spines: SpineSwitch[]) {
  let itPower = 0
  let heatSum = 0
  let activeCabs = 0

  for (const cab of cabinets) {
    if (cab.powerStatus) {
      const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]
      itPower += cab.serverCount * POWER_DRAW.server * custConfig.powerMultiplier
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
  const mgmtBonus = calcManagementBonus(cabinets)
  const overhead = coolingOverheadFactor(avgHeat) * (1 - mgmtBonus)
  const coolingPower = Math.round(itPower * overhead)
  const pue = itPower > 0 ? +((itPower + coolingPower) / itPower).toFixed(2) : 0

  return { totalPower: itPower, coolingPower, avgHeat, pue, mgmtBonus }
}

// ── Traffic Calculation ────────────────────────────────────────

export function calcTraffic(cabinets: Cabinet[], spines: SpineSwitch[], demandMultiplier = 1): TrafficStats {
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

  const links: TrafficLink[] = []
  const spineLoad: Record<string, number> = {}
  const spineCapacity: Record<string, number> = {}

  for (const spine of activeSpines) {
    spineLoad[spine.id] = 0
    spineCapacity[spine.id] = 0
  }

  const totalSpines = spines.length
  const downSpines = totalSpines - activeSpines.length
  const isRedirecting = downSpines > 0 && leafCabinets.length > 0

  let totalFlows = 0
  let totalBw = 0
  let totalCap = 0
  let redirectedFlows = 0

  for (const cab of leafCabinets) {
    const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]
    const cabTraffic = cab.serverCount * TRAFFIC.gbpsPerServer * demandMultiplier * custConfig.bandwidthMultiplier
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

/** Variant of calcTraffic that uses a custom link capacity (for optical interconnect tech) */
export function calcTrafficWithCapacity(cabinets: Cabinet[], spines: SpineSwitch[], demandMultiplier: number, linkCapacity: number): TrafficStats {
  const emptyStats: TrafficStats = {
    totalFlows: 0, totalBandwidthGbps: 0, totalCapacityGbps: 0,
    redirectedFlows: 0, links: [], spineUtilization: {},
  }
  const activeSpines = spines.filter((s) => s.powerStatus)
  const leafCabinets = cabinets.filter((c) => c.hasLeafSwitch && c.powerStatus)
  if (activeSpines.length === 0 || leafCabinets.length === 0) return emptyStats

  const links: TrafficLink[] = []
  const spineLoad: Record<string, number> = {}
  const spineCapacity: Record<string, number> = {}
  for (const spine of activeSpines) { spineLoad[spine.id] = 0; spineCapacity[spine.id] = 0 }

  const downSpines = spines.length - activeSpines.length
  const isRedirecting = downSpines > 0 && leafCabinets.length > 0
  let totalFlows = 0, totalBw = 0, totalCap = 0, redirectedFlows = 0

  for (const cab of leafCabinets) {
    const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]
    const cabTraffic = cab.serverCount * TRAFFIC.gbpsPerServer * demandMultiplier * custConfig.bandwidthMultiplier
    const perSpineBw = cabTraffic / activeSpines.length
    for (const spine of activeSpines) {
      const bandwidth = Math.min(perSpineBw, linkCapacity)
      const utilization = bandwidth / linkCapacity
      const redirected = isRedirecting
      links.push({ leafCabinetId: cab.id, spineId: spine.id, bandwidthGbps: +bandwidth.toFixed(2), capacityGbps: linkCapacity, utilization: +utilization.toFixed(3), redirected })
      spineLoad[spine.id] += bandwidth; spineCapacity[spine.id] += linkCapacity
      totalFlows++; totalBw += bandwidth; totalCap += linkCapacity
      if (redirected) redirectedFlows++
    }
  }
  const spineUtilization: Record<string, number> = {}
  for (const spine of activeSpines) {
    const cap = spineCapacity[spine.id]
    spineUtilization[spine.id] = cap > 0 ? +(spineLoad[spine.id] / cap).toFixed(3) : 0
  }
  return { totalFlows, totalBandwidthGbps: +totalBw.toFixed(2), totalCapacityGbps: +totalCap.toFixed(2), redirectedFlows, links, spineUtilization }
}

// ── Cooling Unit Helpers ───────────────────────────────────────

/** Calculate the effective cooling rate for a specific cabinet from all nearby cooling units. */
export function calcCabinetCooling(
  cab: Cabinet,
  coolingUnits: CoolingUnit[],
  allCabinets: Cabinet[],
  chillerPlants: ChillerPlant[] = [],
  coolingPipes: CoolingPipe[] = [],
): number {
  let totalCooling = BASE_AMBIENT_DISSIPATION
  for (const unit of coolingUnits) {
    if (!unit.operational) continue
    const config = COOLING_UNIT_CONFIG.find((c) => c.type === unit.type)
    if (!config) continue
    const dist = Math.abs(unit.col - cab.col) + Math.abs(unit.row - cab.row)
    if (dist > config.range) continue

    const servedCount = allCabinets.filter((c) =>
      c.powerStatus && Math.abs(unit.col - c.col) + Math.abs(unit.row - c.row) <= config.range
    ).length

    const efficiency = servedCount <= config.maxCabinets
      ? 1.0
      : config.maxCabinets / servedCount

    let chillerMult = 1.0
    if (config.waterUsage > 0 && config.type === 'crah') {
      const connection = getChillerConnection(unit, chillerPlants, coolingPipes)
      if (connection.connected) {
        chillerMult = 1.0 + connection.efficiencyBonus
      } else if (chillerPlants.length > 0) {
        chillerMult = UNCONNECTED_CRAH_PENALTY
      }
    }

    totalCooling += config.coolingRate * efficiency * chillerMult
  }
  return totalCooling
}

// ── Infrastructure Layout Helpers ──────────────────────────────

export function manhattanDist(c1: number, r1: number, c2: number, r2: number): number {
  return Math.abs(c1 - c2) + Math.abs(r1 - r2)
}

/** Get cabinets within range of a PDU */
export function getCabinetsInPDURange(pdu: PDU, cabinets: Cabinet[], pduConfig: PDUConfig): Cabinet[] {
  return cabinets.filter((c) => manhattanDist(pdu.col, pdu.row, c.col, c.row) <= pduConfig.range)
}

/** Calculate current load on a PDU in kW */
export function getPDULoad(pdu: PDU, cabinets: Cabinet[], pduConfig: PDUConfig): number {
  const served = getCabinetsInPDURange(pdu, cabinets, pduConfig)
  let loadW = 0
  for (const cab of served) {
    if (!cab.powerStatus) continue
    const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]
    loadW += cab.serverCount * POWER_DRAW.server * custConfig.powerMultiplier
    if (cab.hasLeafSwitch) loadW += POWER_DRAW.leaf_switch
  }
  return loadW / 1000
}

/** Check if a PDU is overloaded */
export function isPDUOverloaded(pdu: PDU, cabinets: Cabinet[], pduConfig: PDUConfig): boolean {
  return getPDULoad(pdu, cabinets, pduConfig) > pdu.maxCapacityKW
}

/** Calculate the cable length between a cabinet and the spine row */
export function calcCableLength(cabCol: number, cabRow: number, _spineSlot: number, gridRows: number): number {
  return cabRow + 1 + Math.abs(cabCol - Math.floor(gridRows / 2))
}

/** Get the front (intake) and rear (exhaust) tile offsets for a given facing direction. */
export function getFacingOffsets(facing: CabinetFacing, col: number, row: number) {
  switch (facing) {
    case 'north': return { front: { col, row: row - 1 }, rear: { col, row: row + 1 }, sides: [{ col: col - 1, row }, { col: col + 1, row }] }
    case 'south': return { front: { col, row: row + 1 }, rear: { col, row: row - 1 }, sides: [{ col: col - 1, row }, { col: col + 1, row }] }
    case 'east':  return { front: { col: col + 1, row }, rear: { col: col - 1, row }, sides: [{ col, row: row - 1 }, { col, row: row + 1 }] }
    case 'west':  return { front: { col: col - 1, row }, rear: { col: col + 1, row }, sides: [{ col, row: row - 1 }, { col, row: row + 1 }] }
  }
}

/** Calculate hot/cold aisle cooling bonus based on cabinet layout and containment. */
export function calcAisleBonus(cabinets: Cabinet[], suiteTier: SuiteTier = 'starter', aisleContainments: number[] = []): number {
  if (cabinets.length < 2) return 0

  const layout = SUITE_TIERS[suiteTier].layout
  let bonus = 0

  for (const aisle of layout.aisles) {
    const rowAbove = layout.cabinetRows.find(r => r.id === aisle.betweenRows[0])
    const rowBelow = layout.cabinetRows.find(r => r.id === aisle.betweenRows[1])
    if (!rowAbove || !rowBelow) continue

    const hasAboveCabs = cabinets.some(c => c.row === rowAbove.gridRow)
    const hasBelowCabs = cabinets.some(c => c.row === rowBelow.gridRow)

    if (hasAboveCabs && hasBelowCabs) {
      bonus += SPACING_CONFIG.properAisleBonusPerPair

      if (aisleContainments.includes(aisle.id)) {
        bonus += AISLE_CONTAINMENT_CONFIG.coolingBonusPerAisle
      }
    }
  }

  const maxBonus = SPACING_CONFIG.maxAisleSpacingBonus + AISLE_CONTAINMENT_CONFIG.maxContainmentBonus
  return Math.min(maxBonus, bonus)
}

/** Count aisle violations — with row-enforced facing, violations are always 0 */
export function countAisleViolations(): number {
  return 0
}

/** Get orthogonally adjacent cabinets (N/S/E/W only, no diagonals) */
export function getAdjacentCabinets(cab: Cabinet, cabinets: Cabinet[]): Cabinet[] {
  return cabinets.filter((c) =>
    c.id !== cab.id && (
      (c.col === cab.col && Math.abs(c.row - cab.row) === 1) ||
      (c.row === cab.row && Math.abs(c.col - cab.col) === 1)
    )
  )
}

/** Check if a cabinet has maintenance access (at least 1 orthogonally adjacent empty tile) */
export function hasMaintenanceAccess(cab: Cabinet, cabinets: Cabinet[], gridCols: number, gridRows: number): boolean {
  const directions = [
    { col: cab.col, row: cab.row - 1 },
    { col: cab.col, row: cab.row + 1 },
    { col: cab.col - 1, row: cab.row },
    { col: cab.col + 1, row: cab.row },
  ]
  for (const dir of directions) {
    if (dir.col < 0 || dir.col >= gridCols || dir.row < 0 || dir.row >= gridRows) continue
    const occupied = cabinets.some((c) => c.col === dir.col && c.row === dir.row)
    if (!occupied) return true
  }
  return false
}

/** Calculate spacing heat effect for a cabinet. */
export function calcSpacingHeatEffect(cab: Cabinet, cabinets: Cabinet[]): number {
  if (!cab.powerStatus) return 0

  const adjacent = getAdjacentCabinets(cab, cabinets)
  let effect = 0

  effect += adjacent.length * SPACING_CONFIG.adjacentHeatPenalty

  if (adjacent.length >= 3) {
    effect += SPACING_CONFIG.surroundedHeatBonus
  }

  const offsets = getFacingOffsets(cab.facing, cab.col, cab.row)
  const frontOccupied = cabinets.some((c) => c.col === offsets.front.col && c.row === offsets.front.row)
  const rearOccupied = cabinets.some((c) => c.col === offsets.rear.col && c.row === offsets.rear.row)

  if (!frontOccupied) effect -= SPACING_CONFIG.openFrontCoolingBonus
  if (!rearOccupied) effect -= SPACING_CONFIG.openRearCoolingBonus

  return effect
}

/** Check how many cable runs are not routed through trays */
export function countMessyCables(cableRuns: CableRun[]): number {
  return cableRuns.filter((c) => !c.usesTrays).length
}

// ── Zone Adjacency ─────────────────────────────────────────────

/** Find connected clusters of cabinets sharing the same key using flood-fill adjacency */
function findClusters(cabinets: Cabinet[], keyFn: (c: Cabinet) => string): Map<string, Cabinet[][]> {
  const result = new Map<string, Cabinet[][]>()
  const visited = new Set<string>()

  const tileMap = new Map<string, Cabinet>()
  for (const cab of cabinets) {
    tileMap.set(`${cab.col},${cab.row}`, cab)
  }

  for (const cab of cabinets) {
    const posKey = `${cab.col},${cab.row}`
    if (visited.has(posKey)) continue
    visited.add(posKey)

    const groupKey = keyFn(cab)
    const cluster: Cabinet[] = [cab]
    const queue = [cab]

    while (queue.length > 0) {
      const current = queue.pop()!
      const adjacentPositions = [
        `${current.col - 1},${current.row}`,
        `${current.col + 1},${current.row}`,
        `${current.col},${current.row - 1}`,
        `${current.col},${current.row + 1}`,
      ]
      for (const adjPos of adjacentPositions) {
        if (visited.has(adjPos)) continue
        const neighbor = tileMap.get(adjPos)
        if (neighbor && keyFn(neighbor) === groupKey) {
          visited.add(adjPos)
          cluster.push(neighbor)
          queue.push(neighbor)
        }
      }
    }

    if (!result.has(groupKey)) result.set(groupKey, [])
    result.get(groupKey)!.push(cluster)
  }

  return result
}

/** Calculate all zone adjacency bonuses from cabinet layout */
export function calcZones(cabinets: Cabinet[]): Zone[] {
  if (cabinets.length < ZONE_BONUS_CONFIG.minClusterSize) return []

  const zones: Zone[] = []
  let zoneId = 1

  const envClusters = findClusters(cabinets, (c) => c.environment)
  for (const [envKey, clusters] of envClusters) {
    const bonusCfg = ZONE_BONUS_CONFIG.environmentBonus[envKey as CabinetEnvironment]
    for (const cluster of clusters) {
      if (cluster.length >= ZONE_BONUS_CONFIG.minClusterSize) {
        const bonus = bonusCfg.revenueBonus + bonusCfg.heatReduction
        zones.push({
          id: `zone-env-${zoneId++}`,
          type: 'environment',
          key: envKey as CabinetEnvironment,
          cabinetIds: cluster.map((c) => c.id),
          tiles: cluster.map((c) => ({ col: c.col, row: c.row })),
          bonus,
        })
      }
    }
  }

  const prodCabinets = cabinets.filter((c) => c.environment === 'production')
  const custClusters = findClusters(prodCabinets, (c) => c.customerType)
  for (const [custKey, clusters] of custClusters) {
    const bonusCfg = ZONE_BONUS_CONFIG.customerBonus[custKey as CustomerType]
    for (const cluster of clusters) {
      if (cluster.length >= ZONE_BONUS_CONFIG.minClusterSize) {
        zones.push({
          id: `zone-cust-${zoneId++}`,
          type: 'customer',
          key: custKey as CustomerType,
          cabinetIds: cluster.map((c) => c.id),
          tiles: cluster.map((c) => ({ col: c.col, row: c.row })),
          bonus: bonusCfg.revenueBonus + bonusCfg.heatReduction,
        })
      }
    }
  }

  return zones
}

/** Check if a zone requirement is met by the current zones */
export function isZoneRequirementMet(zones: Zone[], req: ZoneRequirement): boolean {
  return zones.some((z) => z.type === req.type && z.key === req.key && z.cabinetIds.length >= req.minSize)
}

// ── Mixed-Environment Penalty ──────────────────────────────────

/** Check which cabinets have the mixed-environment penalty. */
export function calcMixedEnvPenalties(cabinets: Cabinet[]): Set<string> {
  const penalized = new Set<string>()
  for (const cab of cabinets) {
    const adjacent = getAdjacentCabinets(cab, cabinets)
    if (adjacent.length > 0 && adjacent.every((a) => a.environment !== cab.environment)) {
      penalized.add(cab.id)
    }
  }
  return penalized
}

// ── Dedicated Row Bonus ────────────────────────────────────────

/** Calculate which cabinet rows are "dedicated" (fully filled, all same environment). */
export function calcDedicatedRows(cabinets: Cabinet[], suiteTier: SuiteTier): DedicatedRowInfo[] {
  const layout = SUITE_TIERS[suiteTier].layout
  const result: DedicatedRowInfo[] = []

  for (const row of layout.cabinetRows) {
    const rowCabs = cabinets.filter((c) => c.row === row.gridRow)
    if (rowCabs.length >= row.slots && rowCabs.length > 0) {
      const env = rowCabs[0].environment
      if (rowCabs.every((c) => c.environment === env)) {
        result.push({
          rowId: row.id,
          gridRow: row.gridRow,
          environment: env,
          cabinetCount: rowCabs.length,
        })
      }
    }
  }

  return result
}

// ── Suite / Layout Helpers ─────────────────────────────────────

/** Get the effective limits for a given suite tier */
export function getSuiteLimits(tier: SuiteTier) {
  const config = SUITE_TIERS[tier]
  return { maxCabinets: config.maxCabinets, maxSpines: config.maxSpines, cols: config.cols, rows: config.rows, layout: config.layout }
}

/** Find which cabinet row (if any) a grid position belongs to */
export function getCabinetRowAtGrid(gridRow: number, layout: DataCenterLayout): DataCenterRow | undefined {
  return layout.cabinetRows.find(r => r.gridRow === gridRow)
}

/** Get the valid grid rows where cabinets can be placed for a suite tier */
export function getValidCabinetGridRows(tier: SuiteTier): number[] {
  return SUITE_TIERS[tier].layout.cabinetRows.map(r => r.gridRow)
}

/** Get the enforced facing for a given grid row, or null if not a cabinet row */
export function getRowFacing(gridRow: number, tier: SuiteTier): CabinetFacing | null {
  const row = getCabinetRowAtGrid(gridRow, SUITE_TIERS[tier].layout)
  return row ? row.facing : null
}

// ── Placement Strategy Hints ───────────────────────────────────

/** Contextual strategy hints shown during placement mode */
export function getPlacementHints(
  col: number,
  row: number,
  cabinets: Cabinet[],
  suiteTier: SuiteTier,
  placementEnv?: CabinetEnvironment,
  placementCust?: CustomerType,
): PlacementHint[] {
  const hints: PlacementHint[] = []
  const layout = SUITE_TIERS[suiteTier].layout

  const cabinetRow = getCabinetRowAtGrid(row, layout)
  if (!cabinetRow) {
    const aisle = layout.aisles.find(a => a.gridRow === row)
    if (aisle) {
      const typeLabel = aisle.type === 'cold' ? 'Cold' : aisle.type === 'hot' ? 'Hot' : 'Neutral'
      hints.push({ message: `${typeLabel} aisle — technician walkway, no cabinet placement`, type: 'info' })
    } else {
      hints.push({ message: 'Main corridor — no cabinet placement', type: 'info' })
    }
    return hints
  }

  const facingLabel = cabinetRow.facing === 'north' ? 'North (▲)' : 'South (▼)'
  hints.push({ message: `Row ${cabinetRow.id + 1} — facing ${facingLabel}`, type: 'info' })

  if (placementEnv) {
    const adjacentSameEnv = cabinets.filter(
      (c) => c.environment === placementEnv && ((c.col === col && Math.abs(c.row - row) === 1) || (c.row === row && Math.abs(c.col - col) === 1))
    )
    const adjacentSameCust = placementCust ? cabinets.filter(
      (c) => c.customerType === placementCust && c.environment === 'production' && ((c.col === col && Math.abs(c.row - row) === 1) || (c.row === row && Math.abs(c.col - col) === 1))
    ) : []

    if (adjacentSameEnv.length >= 2) {
      const envCfg = ZONE_BONUS_CONFIG.environmentBonus[placementEnv]
      hints.push({ message: `Zone bonus! 3+ adjacent ${envCfg.label} cabinets: ${envCfg.description}`, type: 'tip' })
    } else if (adjacentSameEnv.length === 1) {
      hints.push({ message: `Place one more ${ENVIRONMENT_CONFIG[placementEnv].name} cabinet adjacent to form a zone`, type: 'info' })
    }

    if (adjacentSameCust.length >= 2 && placementEnv === 'production') {
      const custCfg = ZONE_BONUS_CONFIG.customerBonus[placementCust!]
      hints.push({ message: `Zone bonus! 3+ adjacent ${custCfg.label} cabinets: ${custCfg.description}`, type: 'tip' })
    }
  }

  const rowCabs = cabinets.filter((c) => c.row === row)
  const neighbors = rowCabs.filter((c) => Math.abs(c.col - col) <= 1 && c.col !== col)
  const hotNeighbors = neighbors.filter((c) => c.heatLevel >= 60)
  const critNeighbors = neighbors.filter((c) => c.heatLevel >= SIM.throttleTemp)

  if (critNeighbors.length > 0) {
    hints.push({ message: 'Adjacent to overheating cabinet — thermal throttle risk', type: 'warning' })
  } else if (hotNeighbors.length > 0) {
    hints.push({ message: 'Warm neighbor nearby — monitor cooling', type: 'warning' })
  }

  if (rowCabs.length >= cabinetRow.slots - 1) {
    hints.push({ message: 'Row nearly full — consider other rows', type: 'info' })
  }

  if (cabinets.length === 0) {
    hints.push({ message: 'First cabinet! Aisle cooling improves with cabinets on both sides', type: 'tip' })
  }

  return hints
}

// ── Time Formatting ────────────────────────────────────────────

/** Format a game hour (float 0–24) as "HH:MM" */
export function formatGameTime(hour: number): string {
  const h = ((Math.floor(hour) % 24) + 24) % 24
  const m = Math.floor((hour % 1) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
