import type {
  SuiteTier,
  SuiteConfig,
  DataCenterLayout,
  DataCenterRow,
  Aisle,
  AisleType,
  CabinetFacing,
  CabinetEnvironment,
  CustomerType,
  PowerRedundancyConfig,
  PDUConfig,
  CableTrayConfig,
  BuswayConfig,
  CrossConnectConfig,
  InRowCoolingConfig,
} from '../types'

// ── PDU Options ─────────────────────────────────────────────────

export const PDU_OPTIONS: PDUConfig[] = [
  { label: 'Basic PDU', cost: 3000, maxCapacityKW: 10, range: 2, description: 'Small power distribution unit. Supports a few nearby cabinets.' },
  { label: 'Metered PDU', cost: 8000, maxCapacityKW: 30, range: 3, description: 'Mid-range PDU with metered outputs. Covers a full row of cabinets.' },
  { label: 'Intelligent PDU', cost: 18000, maxCapacityKW: 80, range: 4, description: 'Enterprise-grade intelligent PDU. High capacity, wide coverage radius.' },
]

// ── Cable Tray Options ──────────────────────────────────────────

export const CABLE_TRAY_OPTIONS: CableTrayConfig[] = [
  { label: 'Small Tray', cost: 500, capacityUnits: 4, description: 'Compact cable tray. Fits a few cable runs.' },
  { label: 'Standard Tray', cost: 1200, capacityUnits: 8, description: 'Standard-width cable tray. Handles a moderate bundle.' },
  { label: 'Heavy-Duty Tray', cost: 2500, capacityUnits: 16, description: 'Wide heavy-duty cable tray. Supports dense cabling layouts.' },
]

// ── Hot/Cold Aisle Configuration ────────────────────────────────

export const AISLE_CONFIG = {
  coolingBonusPerPair: 0.08,    // 8% cooling overhead reduction per properly paired row
  maxCoolingBonus: 0.25,        // maximum 25% reduction from aisle enforcement
  heatPenaltyViolation: 0.5,   // extra °C/tick per cabinet violating aisle layout
  messyCablingPenalty: 0.02,    // extra incident chance per messy (untray'd) cable run
  maxCableLength: 8,            // max cable length before signal degradation
  degradedCablePenalty: 0.10,   // 10% bandwidth penalty on over-length cables
}

// ── Row-Based Data Center Layout Generator ──────────────────────

/** Generate the pre-built row layout for a given number of cabinet rows and columns */
export function generateLayout(numRows: number, cols: number): DataCenterLayout {
  const cabinetRows: DataCenterRow[] = []
  const aisles: Aisle[] = []

  // Layout structure: corridor + (row + aisle)... + row + corridor
  // Each cabinet row takes 1 grid row, each aisle takes 1 grid row, corridors take 1 grid row each
  const corridorTop = 0
  let gridRow = 1 // start after top corridor

  for (let i = 0; i < numRows; i++) {
    // Alternate facing: even rows face south, odd rows face north
    // This creates cold aisles between pairs (fronts face each other)
    const facing: CabinetFacing = i % 2 === 0 ? 'south' : 'north'
    cabinetRows.push({ id: i, gridRow, facing, slots: cols })
    gridRow++

    // Add aisle between this row and the next (not after the last row)
    if (i < numRows - 1) {
      const currentFacing = facing
      const nextFacing: CabinetFacing = (i + 1) % 2 === 0 ? 'south' : 'north'
      // Determine aisle type from adjacent row facings:
      // "facing south" means front/intake is south, exhaust is north
      let aisleType: AisleType = 'neutral'
      if (currentFacing === 'south' && nextFacing === 'north') {
        // Both fronts face the aisle
        aisleType = 'cold'
      } else if (currentFacing === 'north' && nextFacing === 'south') {
        // Both backs face the aisle
        aisleType = 'hot'
      }
      aisles.push({ id: i, gridRow, type: aisleType, betweenRows: [i, i + 1], width: 1 })
      gridRow++
    }
  }

  const corridorBottom = gridRow
  const totalGridRows = gridRow + 1

  return { cabinetRows, aisles, totalGridRows, corridorTop, corridorBottom }
}

// ── Floor Plan Config (Custom Row Mode) ─────────────────────────

/** Floor plan dimensions for custom row mode — larger grids give players room to space rows */
export const FLOOR_PLAN_CONFIG: Record<SuiteTier, { totalGridRows: number; maxCabinetRows: number }> = {
  starter:      { totalGridRows: 9,  maxCabinetRows: 2 },
  standard:     { totalGridRows: 11, maxCabinetRows: 3 },
  professional: { totalGridRows: 13, maxCabinetRows: 4 },
  enterprise:   { totalGridRows: 15, maxCabinetRows: 5 },
}

/** Wider aisles give extra cooling bonus per additional row of width beyond 1 */
export const WIDE_AISLE_COOLING_BONUS = 0.03

/** Minimum gap (in grid rows) between any two cabinet rows — fire code */
export const MIN_ROW_GAP = 1

/** Build a complete DataCenterLayout from player-placed cabinet rows */
export function buildLayoutFromRows(
  placedRows: DataCenterRow[],
  floorPlanTotalRows: number,
): DataCenterLayout {
  const sorted = [...placedRows].sort((a, b) => a.gridRow - b.gridRow)
  const aisles: Aisle[] = []

  // Detect aisles between adjacent cabinet row pairs
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i]
    const next = sorted[i + 1]
    const gapStart = current.gridRow + 1
    const gapWidth = next.gridRow - current.gridRow - 1

    if (gapWidth > 0) {
      // Determine aisle type from facing of adjacent rows
      let aisleType: AisleType = 'neutral'
      if (current.facing === 'south' && next.facing === 'north') {
        aisleType = 'cold'
      } else if (current.facing === 'north' && next.facing === 'south') {
        aisleType = 'hot'
      }
      aisles.push({
        id: i,
        gridRow: gapStart,
        type: aisleType,
        betweenRows: [current.id, next.id],
        width: gapWidth,
      })
    }
  }

  return {
    cabinetRows: sorted,
    aisles,
    totalGridRows: floorPlanTotalRows,
    corridorTop: 0,
    corridorBottom: floorPlanTotalRows - 1,
  }
}

// ── Aisle Containment Config ────────────────────────────────────

/** Aisle containment upgrade config */
export const AISLE_CONTAINMENT_CONFIG = {
  cost: 15000,                  // cost per aisle
  coolingBonusPerAisle: 0.06,   // 6% extra cooling per contained aisle
  maxContainmentBonus: 0.20,    // max 20% bonus from containment alone
  minSuiteTier: 'standard' as SuiteTier,
  description: 'Physical containment panels (doors/curtains) prevent hot/cold air mixing. Improves cooling efficiency.',
  benefits: [
    '+6% cooling efficiency per contained aisle',
    'Reduces thermal bleed between rows',
    'Lower PUE (Power Usage Effectiveness)',
    'Required for high-density deployments',
  ],
}

// ── Spacing & Adjacency Configuration ───────────────────────────

/** Realistic spacing & adjacency configuration */
export const SPACING_CONFIG = {
  // Heat penalties for dense placement
  adjacentHeatPenalty: 0.3,       // +0.3°C/tick per orthogonally adjacent cabinet
  surroundedHeatBonus: 0.8,      // additional +0.8°C/tick if surrounded on 3+ sides (trapped hot air)

  // Enhanced aisle bonuses (rewards leaving gaps between cabinet rows)
  properAisleBonusPerPair: 0.12, // 12% cooling bonus per row pair with 1+ tile gap AND opposing faces
  narrowAisleBonusPerPair: 0.05, // 5% bonus for back-to-back rows with opposing faces (no gap)
  maxAisleSpacingBonus: 0.30,    // cap at 30% total cooling overhead reduction

  // Airflow bonuses (cabinet front/rear facing empty space)
  openFrontCoolingBonus: 0.3,    // +0.3°C/tick extra cooling if intake side faces empty tile
  openRearCoolingBonus: 0.2,     // +0.2°C/tick extra cooling if exhaust side faces empty tile

  // Maintenance access
  noAccessMaintenanceCostMult: 2.0, // 2x maintenance cost if no adjacent empty tile
  noAccessResolutionMult: 1.5,      // 1.5x incident resolution time if cabinet has no access

  // Fire spread between adjacent cabinets
  fireSpreadChance: 0.12,        // 12% chance per tick that fire spreads to each adjacent cabinet
  fireSpreadMaxPerTick: 2,       // max cabinets fire can spread to per tick
}

// ── Suite Tier Config ───────────────────────────────────────────

export const SUITE_TIERS: Record<SuiteTier, SuiteConfig> = {
  starter: {
    tier: 'starter',
    label: 'Starter Suite',
    description: 'A small colocation closet. Two cabinet rows with a cold aisle between them.',
    cols: 5,
    rows: 2,
    maxCabinets: 8,
    maxSpines: 2,
    upgradeCost: 0,
    color: '#88aacc',
    layout: generateLayout(2, 5),
  },
  standard: {
    tier: 'standard',
    label: 'Standard Suite',
    description: 'A proper server room with hot/cold aisle separation.',
    cols: 8,
    rows: 3,
    maxCabinets: 18,
    maxSpines: 4,
    upgradeCost: 40000,
    color: '#00ff88',
    layout: generateLayout(3, 8),
  },
  professional: {
    tier: 'professional',
    label: 'Professional Suite',
    description: 'A full-size data hall with multiple aisle pairs and containment options.',
    cols: 10,
    rows: 4,
    maxCabinets: 32,
    maxSpines: 6,
    upgradeCost: 120000,
    color: '#00aaff',
    layout: generateLayout(4, 10),
  },
  enterprise: {
    tier: 'enterprise',
    label: 'Enterprise Suite',
    description: 'A massive hyperscale facility. Maximum capacity with full aisle containment.',
    cols: 14,
    rows: 5,
    maxCabinets: 50,
    maxSpines: 8,
    upgradeCost: 350000,
    color: '#ff66ff',
    layout: generateLayout(5, 14),
  },
}

/** Ordered list of suite tiers for progression */
export const SUITE_TIER_ORDER: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']

// ── Busway Options ──────────────────────────────────────────────

export const BUSWAY_OPTIONS: BuswayConfig[] = [
  { label: 'Light Busway', cost: 5000, capacityKW: 20, range: 3, description: 'Overhead busway for light power distribution. Serves nearby cabinets.' },
  { label: 'Medium Busway', cost: 12000, capacityKW: 50, range: 4, description: 'Standard overhead busway. Good coverage and capacity.' },
  { label: 'Heavy Busway', cost: 25000, capacityKW: 120, range: 5, description: 'Heavy-duty overhead busway. Maximum power distribution for dense deployments.' },
]

// ── Cross-Connect Options ───────────────────────────────────────

export const CROSSCONNECT_OPTIONS: CrossConnectConfig[] = [
  { label: 'Small Patch Panel', cost: 2000, portCount: 12, bandwidthBonus: 0.05, description: 'Basic cross-connect with 12 ports. Improves local traffic routing.' },
  { label: 'Medium Patch Panel', cost: 5000, portCount: 24, bandwidthBonus: 0.10, description: 'Standard patch panel with 24 ports. Better traffic optimization.' },
  { label: 'HD Patch Panel', cost: 10000, portCount: 48, bandwidthBonus: 0.15, description: 'High-density panel with 48 ports. Maximum network optimization.' },
]

// ── In-Row Cooling Options ──────────────────────────────────────

export const INROW_COOLING_OPTIONS: InRowCoolingConfig[] = [
  { label: 'Small In-Row Unit', cost: 8000, coolingBonus: 1.0, range: 1, description: 'Compact in-row cooling unit. Provides targeted cooling to adjacent cabinets.' },
  { label: 'Standard In-Row Unit', cost: 18000, coolingBonus: 2.0, range: 2, description: 'Standard in-row cooling. Good cooling radius for mid-size deployments.' },
  { label: 'High-Capacity In-Row', cost: 35000, coolingBonus: 3.5, range: 3, description: 'Enterprise in-row cooling with maximum capacity and wide coverage.' },
]

// ── Noise & Community Relations Config ──────────────────────────

export const NOISE_CONFIG = {
  airCoolingPerCabinet: 2,        // dB per cabinet with air cooling
  waterCoolingPerCabinet: 1,      // dB per cabinet with water cooling
  generatorNoise: 15,             // dB per running generator
  spineNoise: 1,                  // dB per spine switch
  noiseLimit: 70,                 // default max dB
  soundBarrierReduction: 5,       // dB reduced per barrier
  maxSoundBarriers: 5,
  soundBarrierCost: 5000,
  complaintInterval: 10,          // ticks between complaints when over limit
  fineThreshold: 5,               // complaints before fines
  fineAmount: 5000,
  zoningRestrictionThreshold: 10, // complaints before zoning restriction
  reputationPenaltyPerComplaint: 2,
}

// ── Power Redundancy Config ─────────────────────────────────────

export const POWER_REDUNDANCY_CONFIG: PowerRedundancyConfig[] = [
  { level: 'N', label: 'N (No Redundancy)', costMultiplier: 1.0, failureProtection: 0, upgradeCost: 0, maintenanceCostPerTick: 0, description: 'No redundancy. Any power failure causes full outage.' },
  { level: 'N+1', label: 'N+1 (Single Redundant)', costMultiplier: 1.3, failureProtection: 0.70, upgradeCost: 30000, maintenanceCostPerTick: 8, description: 'One backup path. Survives most single failures.' },
  { level: '2N', label: '2N (Fully Redundant)', costMultiplier: 2.0, failureProtection: 0.95, upgradeCost: 80000, maintenanceCostPerTick: 20, description: 'Fully redundant power. Required for gold contracts.' },
]

// ── Zone Adjacency Bonus Config ─────────────────────────────────

export const ZONE_BONUS_CONFIG = {
  minClusterSize: 3,                            // minimum adjacent cabinets to form a zone
  // Environment zone bonuses (applied per-cabinet in the zone)
  environmentBonus: {
    production: { revenueBonus: 0.08, heatReduction: 0, label: 'Production Zone', description: '+8% revenue from shared infrastructure efficiency' },
    lab: { revenueBonus: 0, heatReduction: 0.10, label: 'Lab Zone', description: '-10% heat from consolidated cooling' },
    management: { revenueBonus: 0, heatReduction: 0.05, label: 'Management Zone', description: '-5% heat from centralized monitoring' },
  } as Record<CabinetEnvironment, { revenueBonus: number; heatReduction: number; label: string; description: string }>,
  // Customer type zone bonuses
  customerBonus: {
    general: { revenueBonus: 0.05, heatReduction: 0, label: 'General Zone', description: '+5% revenue from dedicated infrastructure' },
    ai_training: { revenueBonus: 0.10, heatReduction: 0, label: 'AI Training Zone', description: '+10% revenue from optimized GPU interconnects' },
    streaming: { revenueBonus: 0.07, heatReduction: 0, label: 'Streaming Zone', description: '+7% revenue from CDN co-location' },
    crypto: { revenueBonus: 0.06, heatReduction: 0, label: 'Crypto Zone', description: '+6% revenue from shared mining pools' },
    enterprise: { revenueBonus: 0.08, heatReduction: 0, label: 'Enterprise Zone', description: '+8% revenue from dedicated SLA infrastructure' },
  } as Record<CustomerType, { revenueBonus: number; heatReduction: number; label: string; description: string }>,
}

// ── Mixed-Environment Penalty Config ────────────────────────────

export const MIXED_ENV_PENALTY_CONFIG = {
  heatPenalty: 0.05,        // +5% extra heat (multiplier on heat generation)
  revenuePenalty: 0.03,     // -3% revenue penalty
}

// ── Dedicated Row Bonus Config ──────────────────────────────────

export const DEDICATED_ROW_BONUS_CONFIG = {
  efficiencyBonus: 0.08,    // +8% efficiency (revenue for production, cooling for lab/management)
}
