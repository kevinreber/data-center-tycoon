import { create } from 'zustand'

export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'
export type GameSpeed = 0 | 1 | 2 | 3
export type CabinetEnvironment = 'production' | 'lab' | 'management'
export type CoolingType = 'air' | 'water'
export type CustomerType = 'general' | 'ai_training' | 'streaming' | 'crypto' | 'enterprise'
export type GeneratorStatus = 'standby' | 'running' | 'cooldown'
export type SuppressionType = 'none' | 'water_suppression' | 'gas_suppression'
export type TechBranch = 'efficiency' | 'performance' | 'resilience'
export type SuiteTier = 'starter' | 'standard' | 'professional' | 'enterprise'
export type StaffRole = 'network_engineer' | 'electrician' | 'cooling_specialist' | 'security_officer'
export type StaffSkillLevel = 1 | 2 | 3
export type ShiftPattern = 'day_only' | 'day_night' | 'round_the_clock'

// ── Phase 4B: Carbon & Environmental Types ──────────────────────
export type EnergySource = 'grid_mixed' | 'grid_green' | 'onsite_solar' | 'onsite_wind'
export type GreenCert = 'energy_star' | 'leed_silver' | 'leed_gold' | 'carbon_neutral'

// ── Phase 4C: Security & Compliance Types ───────────────────────
export type SecurityTier = 'basic' | 'enhanced' | 'high_security' | 'maximum'
export type SecurityFeatureId = 'cctv' | 'badge_access' | 'biometric' | 'mantrap' | 'cage_isolation' | 'encrypted_network' | 'security_noc'
export type ComplianceCertId = 'soc2_type1' | 'soc2_type2' | 'hipaa' | 'pci_dss' | 'fedramp'

// ── Phase 4D: Competitor AI Types ───────────────────────────────
export type CompetitorPersonality = 'budget' | 'premium' | 'green' | 'aggressive' | 'steady'

// ── Operations Progression Types ────────────────────────────────
export type OpsTier = 'manual' | 'monitoring' | 'automation' | 'orchestration'

// ── Save Slot Types ──────────────────────────────────────────

export const MAX_SAVE_SLOTS = 3
const SAVE_INDEX_KEY = 'fabric-tycoon-saves-index'
const SAVE_SLOT_PREFIX = 'fabric-tycoon-save-slot-'

export interface SaveSlotMeta {
  slotId: number
  name: string
  timestamp: number
  money: number
  tickCount: number
  suiteTier: SuiteTier
  cabinetCount: number
}

function getSaveIndex(): SaveSlotMeta[] {
  try {
    const raw = localStorage.getItem(SAVE_INDEX_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setSaveIndex(index: SaveSlotMeta[]) {
  localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(index))
}

// ── Customer Type Config ──────────────────────────────────────

export interface CustomerTypeConfig {
  label: string
  description: string
  color: string
  powerMultiplier: number    // multiplier on base server power draw
  heatMultiplier: number     // multiplier on heat generation
  revenueMultiplier: number  // multiplier on base revenue
  bandwidthMultiplier: number // multiplier on traffic generated
}

export const CUSTOMER_TYPE_CONFIG: Record<CustomerType, CustomerTypeConfig> = {
  general: {
    label: 'General',
    description: 'Standard mixed workloads. Balanced resource usage.',
    color: '#88aacc',
    powerMultiplier: 1.0,
    heatMultiplier: 1.0,
    revenueMultiplier: 1.0,
    bandwidthMultiplier: 1.0,
  },
  ai_training: {
    label: 'AI Training',
    description: 'GPU-heavy deep learning jobs. Massive power and heat, huge payouts.',
    color: '#ff66ff',
    powerMultiplier: 1.8,
    heatMultiplier: 2.0,
    revenueMultiplier: 2.5,
    bandwidthMultiplier: 0.6,
  },
  streaming: {
    label: 'Streaming',
    description: 'Video CDN workloads. High bandwidth, moderate compute.',
    color: '#66ffcc',
    powerMultiplier: 0.9,
    heatMultiplier: 0.8,
    revenueMultiplier: 1.3,
    bandwidthMultiplier: 2.0,
  },
  crypto: {
    label: 'Crypto',
    description: 'Mining and blockchain nodes. Extreme power draw, low bandwidth.',
    color: '#ffcc00',
    powerMultiplier: 2.0,
    heatMultiplier: 1.8,
    revenueMultiplier: 1.6,
    bandwidthMultiplier: 0.3,
  },
  enterprise: {
    label: 'Enterprise',
    description: 'Secure business workloads. Premium revenue, strict SLA expectations.',
    color: '#4488ff',
    powerMultiplier: 1.1,
    heatMultiplier: 1.0,
    revenueMultiplier: 1.8,
    bandwidthMultiplier: 1.2,
  },
}

// ── Backup Generator Config ───────────────────────────────────

export interface GeneratorConfig {
  label: string
  cost: number
  fuelCapacity: number       // ticks of runtime at full load
  fuelCostPerTick: number    // $ per tick while running
  powerCapacityW: number     // max watts this generator can supply
  startupTicks: number       // ticks to spin up from standby
  cooldownTicks: number      // ticks needed to cool down after running
  description: string
}

export const GENERATOR_OPTIONS: GeneratorConfig[] = [
  { label: 'Small Diesel', cost: 15000, fuelCapacity: 30, fuelCostPerTick: 8, powerCapacityW: 50000, startupTicks: 2, cooldownTicks: 5, description: 'Small diesel generator. Covers a few cabinets during short outages.' },
  { label: 'Large Diesel', cost: 40000, fuelCapacity: 50, fuelCostPerTick: 15, powerCapacityW: 150000, startupTicks: 3, cooldownTicks: 8, description: 'Industrial diesel generator. Covers most medium facilities.' },
  { label: 'Natural Gas', cost: 75000, fuelCapacity: 100, fuelCostPerTick: 10, powerCapacityW: 300000, startupTicks: 4, cooldownTicks: 10, description: 'Natural gas turbine. Long runtime, high capacity, but slow to start.' },
]

export interface Generator {
  id: string
  config: GeneratorConfig
  status: GeneratorStatus
  fuelRemaining: number
  ticksUntilReady: number    // countdown for startup or cooldown
}

// ── Fire Suppression Config ───────────────────────────────────

export interface SuppressionConfig {
  label: string
  cost: number
  effectiveness: number      // 0-1, chance of preventing equipment damage during fire
  equipmentDamage: boolean   // whether activation damages equipment
  description: string
  color: string
}

export const SUPPRESSION_CONFIG: Record<SuppressionType, SuppressionConfig> = {
  none: { label: 'None', cost: 0, effectiveness: 0, equipmentDamage: false, description: 'No fire suppression. Fires will cause maximum damage.', color: '#666666' },
  water_suppression: { label: 'Water Sprinkler', cost: 8000, effectiveness: 0.85, equipmentDamage: true, description: 'Cheap and effective at stopping fires, but water destroys server equipment. Expect losses.', color: '#4488ff' },
  gas_suppression: { label: 'Inert Gas (FM-200)', cost: 35000, effectiveness: 0.95, equipmentDamage: false, description: 'Premium gas-based suppression. Electronics-safe — stops fires without equipment damage.', color: '#44ff88' },
}

// ── Tech Tree Types ───────────────────────────────────────────

export interface TechDef {
  id: string
  branch: TechBranch
  label: string
  description: string
  cost: number               // R&D investment cost
  researchTicks: number      // ticks to complete research
  prereqId: string | null    // tech that must be unlocked first
  effect: string             // description of gameplay effect
}

export interface ActiveResearch {
  techId: string
  ticksRemaining: number
}

export const TECH_TREE: TechDef[] = [
  // Efficiency branch — lower PUE
  { id: 'hot_aisle', branch: 'efficiency', label: 'Hot Aisle Containment', description: 'Separate hot and cold air streams for better cooling efficiency.', cost: 10000, researchTicks: 40, prereqId: null, effect: 'Cooling rate +0.5°C/tick' },
  { id: 'variable_fans', branch: 'efficiency', label: 'Variable Speed Fans', description: 'Dynamically adjust fan speed based on load.', cost: 20000, researchTicks: 60, prereqId: 'hot_aisle', effect: 'Cooling overhead reduced by 15%' },
  { id: 'immersion_cooling', branch: 'efficiency', label: 'Immersion Cooling', description: 'Submerge servers in dielectric fluid for maximum heat transfer.', cost: 50000, researchTicks: 100, prereqId: 'variable_fans', effect: 'Cooling rate +1.5°C/tick, overhead -25%' },
  // Performance branch — higher density/revenue
  { id: 'high_density', branch: 'performance', label: 'High-Density Racks', description: 'Redesigned airflow allows more compute per rack unit.', cost: 12000, researchTicks: 45, prereqId: null, effect: 'Server revenue +15%' },
  { id: 'gpu_clusters', branch: 'performance', label: 'GPU Cluster Support', description: 'Specialized power and cooling for GPU-heavy workloads.', cost: 30000, researchTicks: 70, prereqId: 'high_density', effect: 'AI Training revenue +30%' },
  { id: 'optical_interconnect', branch: 'performance', label: 'Optical Interconnects', description: 'Fiber-optic leaf-spine links with 4x bandwidth.', cost: 60000, researchTicks: 90, prereqId: 'gpu_clusters', effect: 'Link capacity doubled to 20 Gbps' },
  // Resilience branch — better uptime
  { id: 'ups_upgrade', branch: 'resilience', label: 'UPS Battery Upgrade', description: 'Extended battery backup provides 5 ticks of bridge power during outages.', cost: 8000, researchTicks: 30, prereqId: null, effect: 'Auto-bridge 5 ticks during power outages' },
  { id: 'redundant_cooling', branch: 'resilience', label: 'Redundant Cooling', description: 'N+1 cooling redundancy prevents total cooling failure.', cost: 25000, researchTicks: 60, prereqId: 'ups_upgrade', effect: 'Cooling failures reduced by 50%' },
  { id: 'auto_failover', branch: 'resilience', label: 'Auto Failover', description: 'Automated workload migration during incidents.', cost: 45000, researchTicks: 80, prereqId: 'redundant_cooling', effect: 'Incidents resolve 30% faster' },
]

export const TECH_BRANCH_COLORS: Record<TechBranch, string> = {
  efficiency: '#00ccff',
  performance: '#ff6644',
  resilience: '#44ff88',
}

// ── Operations Progression Config ──────────────────────────────
export interface OpsTierConfig {
  id: OpsTier
  label: string
  description: string
  color: string
  unlockRequirements: {
    minStaff: number
    requiredTechs: string[]
    minReputation: number
    minSuiteTier: SuiteTier
  }
  benefits: {
    incidentSpawnReduction: number     // 0–1, fraction reduction in incident spawn chance
    autoResolveSpeedBonus: number      // 0–1, probability of extra tick reduction per tick
    revenuePenaltyReduction: number    // 0–1, reduces revenue impact from incidents
    staffEffectivenessBonus: number    // 0–1, bonus to staff resolution effectiveness
    resolveCostReduction: number       // 0–1, discount on manual resolution cost
  }
  upgradeCost: number
}

export const OPS_TIER_CONFIG: OpsTierConfig[] = [
  {
    id: 'manual',
    label: 'Manual Ops',
    description: 'Hands-on incident management. All issues require manual resolution or expire with lingering damage.',
    color: '#888888',
    unlockRequirements: { minStaff: 0, requiredTechs: [], minReputation: 0, minSuiteTier: 'starter' },
    benefits: { incidentSpawnReduction: 0, autoResolveSpeedBonus: 0, revenuePenaltyReduction: 0, staffEffectivenessBonus: 0, resolveCostReduction: 0 },
    upgradeCost: 0,
  },
  {
    id: 'monitoring',
    label: 'Monitoring & Alerting',
    description: 'Proactive monitoring with dashboards and alerting. Reduced resolution costs and improved staff response.',
    color: '#00ccff',
    unlockRequirements: { minStaff: 2, requiredTechs: ['ups_upgrade'], minReputation: 25, minSuiteTier: 'starter' },
    benefits: { incidentSpawnReduction: 0.10, autoResolveSpeedBonus: 0.05, revenuePenaltyReduction: 0.05, staffEffectivenessBonus: 0.10, resolveCostReduction: 0.20 },
    upgradeCost: 15000,
  },
  {
    id: 'automation',
    label: 'Basic Automation',
    description: 'Automated runbooks and self-healing scripts. Staff-assisted auto-resolution with reduced incident frequency.',
    color: '#44ff88',
    unlockRequirements: { minStaff: 4, requiredTechs: ['ups_upgrade', 'redundant_cooling', 'auto_failover'], minReputation: 45, minSuiteTier: 'standard' },
    benefits: { incidentSpawnReduction: 0.25, autoResolveSpeedBonus: 0.20, revenuePenaltyReduction: 0.15, staffEffectivenessBonus: 0.20, resolveCostReduction: 0.35 },
    upgradeCost: 50000,
  },
  {
    id: 'orchestration',
    label: 'Full Orchestration',
    description: 'Kubernetes-style orchestration with auto-failover, predictive maintenance, and self-healing infrastructure.',
    color: '#ff66ff',
    unlockRequirements: { minStaff: 8, requiredTechs: ['ups_upgrade', 'redundant_cooling', 'auto_failover', 'hot_aisle', 'variable_fans'], minReputation: 65, minSuiteTier: 'professional' },
    benefits: { incidentSpawnReduction: 0.40, autoResolveSpeedBonus: 0.40, revenuePenaltyReduction: 0.30, staffEffectivenessBonus: 0.35, resolveCostReduction: 0.50 },
    upgradeCost: 120000,
  },
]

export const OPS_TIER_ORDER: OpsTier[] = ['manual', 'monitoring', 'automation', 'orchestration']

// ── Reputation System Types ───────────────────────────────────

export type ReputationTier = 'unknown' | 'poor' | 'average' | 'good' | 'excellent' | 'legendary'

export const REPUTATION_TIERS: { tier: ReputationTier; minScore: number; label: string; color: string; contractBonus: number }[] = [
  { tier: 'unknown', minScore: 0, label: 'Unknown', color: '#666666', contractBonus: 0 },
  { tier: 'poor', minScore: 10, label: 'Poor', color: '#ff4444', contractBonus: -0.2 },
  { tier: 'average', minScore: 30, label: 'Average', color: '#ffaa00', contractBonus: 0 },
  { tier: 'good', minScore: 50, label: 'Good', color: '#88cc44', contractBonus: 0.15 },
  { tier: 'excellent', minScore: 75, label: 'Excellent', color: '#00ff88', contractBonus: 0.3 },
  { tier: 'legendary', minScore: 95, label: 'Legendary', color: '#ff66ff', contractBonus: 0.5 },
]

export function getReputationTier(score: number): typeof REPUTATION_TIERS[number] {
  let result = REPUTATION_TIERS[0]
  for (const tier of REPUTATION_TIERS) {
    if (score >= tier.minScore) result = tier
  }
  return result
}

// ── Spot Power Pricing Types ──────────────────────────────────

/** Power market cycles through phases affecting $/kW */
export const POWER_MARKET = {
  baseCost: 0.50,
  minMultiplier: 0.6,        // cheapest power can get (60% of base)
  maxMultiplier: 2.0,         // most expensive (200% of base)
  volatility: 0.08,           // max change per tick
  meanReversion: 0.02,        // tendency to return to 1.0
  spikeChance: 0.03,          // chance per tick of a price spike
  spikeMultiplier: 1.5,       // additional multiplier during spike
  spikeDuration: 8,           // ticks a spike lasts
}

// ── Hardware Depreciation Types ───────────────────────────────

export const DEPRECIATION = {
  serverLifespanTicks: 800,   // server reaches end-of-life after this many ticks
  efficiencyFloor: 0.5,       // minimum efficiency (50% at end of life)
  refreshCost: 1500,          // cost to refresh a server back to 100%
  revenueDecayStart: 0.3,     // efficiency starts declining after 30% of lifespan
}

// ── Infrastructure Layout Types ──────────────────────────────

/** Cabinet facing direction for hot/cold aisle enforcement */
export type CabinetFacing = 'north' | 'south' | 'east' | 'west'

/** Power Distribution Unit placed on the grid */
export interface PDU {
  id: string
  col: number                   // grid column position
  row: number                   // grid row position (placed adjacent to cabinet rows)
  maxCapacityKW: number         // maximum circuit capacity in kilowatts
  label: string
}

export interface PDUConfig {
  label: string
  cost: number
  maxCapacityKW: number
  range: number                 // Manhattan distance of cabinets this PDU can serve
  description: string
}

export const PDU_OPTIONS: PDUConfig[] = [
  { label: 'Basic PDU', cost: 3000, maxCapacityKW: 10, range: 2, description: 'Small power distribution unit. Supports a few nearby cabinets.' },
  { label: 'Metered PDU', cost: 8000, maxCapacityKW: 30, range: 3, description: 'Mid-range PDU with metered outputs. Covers a full row of cabinets.' },
  { label: 'Intelligent PDU', cost: 18000, maxCapacityKW: 80, range: 4, description: 'Enterprise-grade intelligent PDU. High capacity, wide coverage radius.' },
]

/** Cable tray placed on the grid — provides pathways for network cables */
export interface CableTray {
  id: string
  col: number
  row: number
  capacityUnits: number         // max cable runs that can pass through
}

export interface CableTrayConfig {
  label: string
  cost: number
  capacityUnits: number
  description: string
}

export const CABLE_TRAY_OPTIONS: CableTrayConfig[] = [
  { label: 'Small Tray', cost: 500, capacityUnits: 4, description: 'Compact cable tray. Fits a few cable runs.' },
  { label: 'Standard Tray', cost: 1200, capacityUnits: 8, description: 'Standard-width cable tray. Handles a moderate bundle.' },
  { label: 'Heavy-Duty Tray', cost: 2500, capacityUnits: 16, description: 'Wide heavy-duty cable tray. Supports dense cabling layouts.' },
]

/** A structured cable run connecting a leaf switch to a spine switch */
export interface CableRun {
  id: string
  leafCabinetId: string
  spineId: string
  length: number                // Manhattan distance of the cable path
  capacityGbps: number          // bandwidth capacity of this cable
  usesTrays: boolean            // whether this cable is routed through trays
}

/** Hot/cold aisle configuration */
export const AISLE_CONFIG = {
  coolingBonusPerPair: 0.08,    // 8% cooling overhead reduction per properly paired row
  maxCoolingBonus: 0.25,        // maximum 25% reduction from aisle enforcement
  heatPenaltyViolation: 0.5,   // extra °C/tick per cabinet violating aisle layout
  messyCablingPenalty: 0.02,    // extra incident chance per messy (untray'd) cable run
  maxCableLength: 8,            // max cable length before signal degradation
  degradedCablePenalty: 0.10,   // 10% bandwidth penalty on over-length cables
}

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

// ── Suite Tier Config ──────────────────────────────────────────

export interface SuiteConfig {
  tier: SuiteTier
  label: string
  description: string
  cols: number              // cabinet grid columns
  rows: number              // cabinet grid rows
  maxCabinets: number       // max cabinets (less than cols * rows to allow aisle space)
  maxSpines: number         // spine switch slots
  upgradeCost: number       // cost to upgrade to this tier (0 for starter)
  color: string
}

export const SUITE_TIERS: Record<SuiteTier, SuiteConfig> = {
  starter: {
    tier: 'starter',
    label: 'Starter Suite',
    description: 'A small colocation closet. Enough room to get started.',
    cols: 5,
    rows: 5,
    maxCabinets: 8,
    maxSpines: 2,
    upgradeCost: 0,
    color: '#88aacc',
  },
  standard: {
    tier: 'standard',
    label: 'Standard Suite',
    description: 'A proper server room with room to grow.',
    cols: 8,
    rows: 7,
    maxCabinets: 18,
    maxSpines: 4,
    upgradeCost: 40000,
    color: '#00ff88',
  },
  professional: {
    tier: 'professional',
    label: 'Professional Suite',
    description: 'A full-size data hall with enterprise-grade capacity.',
    cols: 10,
    rows: 9,
    maxCabinets: 32,
    maxSpines: 6,
    upgradeCost: 120000,
    color: '#00aaff',
  },
  enterprise: {
    tier: 'enterprise',
    label: 'Enterprise Suite',
    description: 'A massive hyperscale facility. Maximum capacity.',
    cols: 14,
    rows: 11,
    maxCabinets: 50,
    maxSpines: 8,
    upgradeCost: 350000,
    color: '#ff66ff',
  },
}

/** Ordered list of suite tiers for progression */
export const SUITE_TIER_ORDER: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']

// ── Staff & HR System ───────────────────────────────────────────

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  skillLevel: StaffSkillLevel
  salaryPerTick: number
  hiredAtTick: number
  onShift: boolean
  certifications: string[]
  incidentsResolved: number
  fatigueLevel: number          // 0–100
}

export interface StaffTraining {
  staffId: string
  certification: string
  ticksRemaining: number
  cost: number
}

export interface StaffRoleConfig {
  role: StaffRole
  label: string
  description: string
  baseSalary: number            // per tick at skill level 1
  salaryMultiplier: number[]    // [level1, level2, level3] multipliers
  hireCost: number              // one-time hiring cost
  effect: string
}

export interface StaffCertConfig {
  id: string
  label: string
  cost: number
  durationTicks: number
  requiredRole: StaffRole | null  // null = any role
  effect: string
}

export const STAFF_ROLE_CONFIG: StaffRoleConfig[] = [
  {
    role: 'network_engineer', label: 'Network Engineer', baseSalary: 4, salaryMultiplier: [1, 1.5, 2.2],
    hireCost: 3000, description: 'Speeds up traffic_drop and power_surge incident resolution. +2% traffic capacity per engineer.',
    effect: 'Incident resolution: 25%/40%/60% faster (by skill). +2% traffic capacity.',
  },
  {
    role: 'electrician', label: 'Electrician', baseSalary: 3, salaryMultiplier: [1, 1.4, 2.0],
    hireCost: 2500, description: 'Reduces power surge damage. Generator startup 1 tick faster per skill level.',
    effect: 'Reduces power surge effects. Generator startup -1 tick/skill.',
  },
  {
    role: 'cooling_specialist', label: 'Cooling Specialist', baseSalary: 3, salaryMultiplier: [1, 1.4, 2.0],
    hireCost: 2500, description: 'Improves cooling efficiency by 5%/10%/15% per specialist.',
    effect: 'Cooling efficiency +5%/+10%/+15% per specialist.',
  },
  {
    role: 'security_officer', label: 'Security Officer', baseSalary: 5, salaryMultiplier: [1, 1.6, 2.5],
    hireCost: 4000, description: 'Required for security tier compliance. Reduces physical intrusion events.',
    effect: 'Required for security compliance. Reduces intrusion risk.',
  },
]

export const STAFF_CERT_CONFIG: StaffCertConfig[] = [
  { id: 'ccna', label: 'CCNA', cost: 3000, durationTicks: 30, requiredRole: 'network_engineer', effect: '+15% traffic optimization' },
  { id: 'dcim_certified', label: 'DCIM Certified', cost: 2500, durationTicks: 25, requiredRole: null, effect: 'Staff monitors 2x equipment range' },
  { id: 'fire_safety', label: 'Fire Safety', cost: 1500, durationTicks: 15, requiredRole: null, effect: '+10% fire suppression effectiveness' },
  { id: 'high_voltage', label: 'High Voltage', cost: 4000, durationTicks: 35, requiredRole: 'electrician', effect: 'Manages enterprise-tier power loads' },
]

export const SHIFT_PATTERN_CONFIG: Record<ShiftPattern, { label: string; costPerTick: number; coverage: string; description: string }> = {
  day_only: { label: 'Day Only', costPerTick: 0, coverage: '06:00–22:00', description: 'Staff work daytime only. No incident response at night.' },
  day_night: { label: 'Day + Night', costPerTick: 500, coverage: '24/7', description: 'Two shifts covering 24 hours. Night shift at -20% effectiveness.' },
  round_the_clock: { label: 'Round the Clock', costPerTick: 1200, coverage: '24/7 Full', description: 'Three 8-hour shifts at full effectiveness. Requires 50% more staff.' },
}

/** Max staff by suite tier */
export const MAX_STAFF_BY_TIER: Record<SuiteTier, number> = {
  starter: 2,
  standard: 4,
  professional: 8,
  enterprise: 16,
}

// ── Supply Chain & Procurement Types ────────────────────────────────

export type OrderStatus = 'pending' | 'in_transit' | 'delivered'

export interface HardwareOrder {
  id: string
  itemType: 'server' | 'leaf_switch' | 'spine_switch' | 'cabinet'
  quantity: number
  unitCost: number
  totalCost: number
  leadTimeTicks: number
  ticksRemaining: number
  status: OrderStatus
  orderedAtTick: number
}

export interface SupplyChainConfig {
  itemType: string
  baseLeadTime: number
  shortageLeadTime: number
  bulkThreshold: number
  bulkDiscount: number
}

export const SUPPLY_CHAIN_CONFIG: SupplyChainConfig[] = [
  { itemType: 'server', baseLeadTime: 3, shortageLeadTime: 8, bulkThreshold: 10, bulkDiscount: 0.85 },
  { itemType: 'leaf_switch', baseLeadTime: 5, shortageLeadTime: 12, bulkThreshold: 5, bulkDiscount: 0.90 },
  { itemType: 'spine_switch', baseLeadTime: 8, shortageLeadTime: 20, bulkThreshold: 3, bulkDiscount: 0.88 },
  { itemType: 'cabinet', baseLeadTime: 2, shortageLeadTime: 5, bulkThreshold: 8, bulkDiscount: 0.80 },
]

// ── Weather System Types ────────────────────────────────────────────

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'storm' | 'heatwave' | 'cold_snap'

export interface SeasonConfig {
  season: Season
  label: string
  ambientModifier: number
  solarEfficiency: number
  windEfficiency: number
  durationTicks: number
  color: string
}

export const SEASON_CONFIG: SeasonConfig[] = [
  { season: 'spring', label: 'Spring', ambientModifier: 2, solarEfficiency: 0.6, windEfficiency: 0.7, durationTicks: 200, color: '#88ff88' },
  { season: 'summer', label: 'Summer', ambientModifier: 8, solarEfficiency: 0.9, windEfficiency: 0.4, durationTicks: 200, color: '#ffaa44' },
  { season: 'autumn', label: 'Autumn', ambientModifier: 0, solarEfficiency: 0.5, windEfficiency: 0.8, durationTicks: 200, color: '#cc8844' },
  { season: 'winter', label: 'Winter', ambientModifier: -5, solarEfficiency: 0.3, windEfficiency: 0.9, durationTicks: 200, color: '#aaddff' },
]

export interface WeatherConditionConfig {
  condition: WeatherCondition
  label: string
  ambientModifier: number
  solarMultiplier: number
  windMultiplier: number
  minDuration: number
  maxDuration: number
  chance: number
  color: string
}

export const WEATHER_CONDITION_CONFIG: WeatherConditionConfig[] = [
  { condition: 'clear', label: 'Clear', ambientModifier: 0, solarMultiplier: 1.0, windMultiplier: 0.8, minDuration: 10, maxDuration: 20, chance: 0.30, color: '#ffdd44' },
  { condition: 'cloudy', label: 'Cloudy', ambientModifier: -1, solarMultiplier: 0.5, windMultiplier: 1.0, minDuration: 8, maxDuration: 15, chance: 0.25, color: '#aaaaaa' },
  { condition: 'rain', label: 'Rain', ambientModifier: -2, solarMultiplier: 0.3, windMultiplier: 1.2, minDuration: 5, maxDuration: 12, chance: 0.20, color: '#6688cc' },
  { condition: 'storm', label: 'Storm', ambientModifier: -3, solarMultiplier: 0.1, windMultiplier: 0.2, minDuration: 3, maxDuration: 8, chance: 0.10, color: '#445588' },
  { condition: 'heatwave', label: 'Heatwave', ambientModifier: 10, solarMultiplier: 1.2, windMultiplier: 0.3, minDuration: 8, maxDuration: 15, chance: 0.10, color: '#ff4444' },
  { condition: 'cold_snap', label: 'Cold Snap', ambientModifier: -8, solarMultiplier: 0.4, windMultiplier: 1.0, minDuration: 5, maxDuration: 10, chance: 0.05, color: '#44ccff' },
]

// ── Interconnection / Meet-Me Room Types ────────────────────────────

export type InterconnectPortType = 'copper_1g' | 'fiber_10g' | 'fiber_100g'

export interface InterconnectPort {
  id: string
  tenantName: string
  portType: InterconnectPortType
  revenuePerTick: number
  installedAtTick: number
}

export interface InterconnectPortConfig {
  portType: InterconnectPortType
  label: string
  installCost: number
  revenuePerTick: number
  capacityUsed: number
}

export const INTERCONNECT_PORT_CONFIG: InterconnectPortConfig[] = [
  { portType: 'copper_1g', label: 'Copper 1G', installCost: 500, revenuePerTick: 3, capacityUsed: 1 },
  { portType: 'fiber_10g', label: 'Fiber 10G', installCost: 2000, revenuePerTick: 10, capacityUsed: 1 },
  { portType: 'fiber_100g', label: 'Fiber 100G', installCost: 8000, revenuePerTick: 35, capacityUsed: 2 },
]

export interface MeetMeRoomConfig {
  label: string
  installCost: number
  portCapacity: number
  maintenanceCostPerTick: number
  description: string
}

export const MEETME_ROOM_CONFIG: MeetMeRoomConfig[] = [
  { label: 'Basic Meet-Me Room', installCost: 15000, portCapacity: 12, maintenanceCostPerTick: 5, description: 'Small interconnection room with 12 ports.' },
  { label: 'Standard Meet-Me Room', installCost: 40000, portCapacity: 24, maintenanceCostPerTick: 12, description: 'Standard meet-me room with 24 ports.' },
  { label: 'Premium Meet-Me Room', installCost: 100000, portCapacity: 48, maintenanceCostPerTick: 25, description: 'Large interconnection facility with 48 ports.' },
]

// Tenant names for procedural interconnect port generation
const INTERCONNECT_TENANTS = ['CloudFlare', 'Akamai', 'AWS Direct', 'Azure Express', 'Google Cloud', 'Netflix OCA', 'Meta Edge', 'Fastly', 'Limelight', 'Verizon Digital', 'AT&T Peering', 'Comcast IX', 'Level3', 'Zayo', 'Cogent']

// ── Custom Server Configuration Types ───────────────────────────────

export type ServerConfig = 'balanced' | 'cpu_optimized' | 'gpu_accelerated' | 'storage_dense' | 'memory_optimized'

export interface ServerConfigDef {
  id: ServerConfig
  label: string
  description: string
  costMultiplier: number
  powerMultiplier: number
  heatMultiplier: number
  revenueMultiplier: number
  bestFor: CustomerType[]
  customerBonus: number
  color: string
}

export const SERVER_CONFIG_OPTIONS: ServerConfigDef[] = [
  { id: 'balanced', label: 'Balanced', description: 'Standard general-purpose configuration.', costMultiplier: 1.0, powerMultiplier: 1.0, heatMultiplier: 1.0, revenueMultiplier: 1.0, bestFor: ['general', 'enterprise'], customerBonus: 0.10, color: '#88aacc' },
  { id: 'cpu_optimized', label: 'CPU Optimized', description: 'High core count for compute-heavy workloads.', costMultiplier: 1.2, powerMultiplier: 1.3, heatMultiplier: 1.2, revenueMultiplier: 1.3, bestFor: ['enterprise', 'streaming'], customerBonus: 0.20, color: '#44ff88' },
  { id: 'gpu_accelerated', label: 'GPU Accelerated', description: 'NVIDIA GPU clusters for AI/ML and crypto workloads.', costMultiplier: 1.8, powerMultiplier: 2.0, heatMultiplier: 2.2, revenueMultiplier: 2.0, bestFor: ['ai_training', 'crypto'], customerBonus: 0.30, color: '#ff66ff' },
  { id: 'storage_dense', label: 'Storage Dense', description: 'High-capacity storage for CDN and archival workloads.', costMultiplier: 1.3, powerMultiplier: 0.8, heatMultiplier: 0.7, revenueMultiplier: 1.1, bestFor: ['streaming', 'general'], customerBonus: 0.15, color: '#ffaa44' },
  { id: 'memory_optimized', label: 'Memory Optimized', description: 'Large RAM configurations for in-memory databases.', costMultiplier: 1.4, powerMultiplier: 1.1, heatMultiplier: 1.0, revenueMultiplier: 1.2, bestFor: ['enterprise', 'ai_training'], customerBonus: 0.15, color: '#44aaff' },
]

// ── Network Peering & Transit Types ─────────────────────────────────

export type PeeringType = 'budget_transit' | 'premium_transit' | 'public_peering' | 'private_peering'

export interface PeeringAgreement {
  id: string
  provider: string
  type: PeeringType
  bandwidthGbps: number
  costPerTick: number
  latencyMs: number
  installedAtTick: number
}

export interface PeeringConfig {
  type: PeeringType
  label: string
  provider: string
  bandwidthGbps: number
  costPerTick: number
  latencyMs: number
  description: string
}

export const PEERING_OPTIONS: PeeringConfig[] = [
  { type: 'budget_transit', label: 'Budget Transit', provider: 'CheapNet', bandwidthGbps: 10, costPerTick: 5, latencyMs: 25, description: 'Cheap but high latency. Good for non-critical traffic.' },
  { type: 'premium_transit', label: 'Premium Transit', provider: 'FastPipe Inc', bandwidthGbps: 10, costPerTick: 15, latencyMs: 8, description: 'Low latency, reliable. Good for enterprise workloads.' },
  { type: 'public_peering', label: 'Public Peering (IX)', provider: 'Metro IX', bandwidthGbps: 20, costPerTick: 8, latencyMs: 5, description: 'Internet Exchange peering. Great bandwidth and latency.' },
  { type: 'private_peering', label: 'Private Peering', provider: 'DirectLink', bandwidthGbps: 40, costPerTick: 20, latencyMs: 3, description: 'Direct connection to major networks. Lowest latency.' },
]

// ── Maintenance Window Types ────────────────────────────────────────

export type MaintenanceTargetType = 'cabinet' | 'spine' | 'cooling' | 'power'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed'

export interface MaintenanceWindow {
  id: string
  targetType: MaintenanceTargetType
  targetId: string
  scheduledTick: number
  durationTicks: number
  cost: number
  status: MaintenanceStatus
  benefitApplied: boolean
}

export interface MaintenanceConfig {
  targetType: MaintenanceTargetType
  label: string
  durationTicks: number
  cost: number
  effect: string
}

export const MAINTENANCE_CONFIG: MaintenanceConfig[] = [
  { targetType: 'cabinet', label: 'Cabinet Maintenance', durationTicks: 3, cost: 500, effect: 'Resets server age by 20%, -5°C heat' },
  { targetType: 'spine', label: 'Spine Maintenance', durationTicks: 2, cost: 1000, effect: 'Prevents next hardware failure incident' },
  { targetType: 'cooling', label: 'Cooling Maintenance', durationTicks: 4, cost: 2000, effect: '+0.5°C cooling rate for 50 ticks' },
  { targetType: 'power', label: 'Power Maintenance', durationTicks: 3, cost: 1500, effect: 'Prevents next power surge incident' },
]

// ── Power Redundancy Types ──────────────────────────────────────────

export type PowerRedundancy = 'N' | 'N+1' | '2N'

export interface PowerRedundancyConfig {
  level: PowerRedundancy
  label: string
  costMultiplier: number
  failureProtection: number
  upgradeCost: number
  maintenanceCostPerTick: number
  description: string
}

export const POWER_REDUNDANCY_CONFIG: PowerRedundancyConfig[] = [
  { level: 'N', label: 'N (No Redundancy)', costMultiplier: 1.0, failureProtection: 0, upgradeCost: 0, maintenanceCostPerTick: 0, description: 'No redundancy. Any power failure causes full outage.' },
  { level: 'N+1', label: 'N+1 (Single Redundant)', costMultiplier: 1.3, failureProtection: 0.70, upgradeCost: 30000, maintenanceCostPerTick: 8, description: 'One backup path. Survives most single failures.' },
  { level: '2N', label: '2N (Fully Redundant)', costMultiplier: 2.0, failureProtection: 0.95, upgradeCost: 80000, maintenanceCostPerTick: 20, description: 'Fully redundant power. Required for gold contracts.' },
]

// ── Noise & Community Relations Types ────────────────────────────────

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

// ── Spot Compute Market Types ───────────────────────────────────────

export const SPOT_COMPUTE_CONFIG = {
  minPriceMultiplier: 0.3,
  maxPriceMultiplier: 2.5,
  volatility: 0.12,
  meanReversion: 0.03,
  baseDemandCorrelation: -0.5,    // inversely correlated with regular demand
}

// ── Phase 4B: Carbon & Environmental Config ────────────────────────

export interface EnergySourceConfig {
  source: EnergySource
  label: string
  description: string
  costMultiplier: number
  carbonPerKW: number
  installCost: number
  reliability: number
  color: string
}

export const ENERGY_SOURCE_CONFIG: Record<EnergySource, EnergySourceConfig> = {
  grid_mixed: {
    source: 'grid_mixed', label: 'Grid (Mixed)', description: 'Default coal/gas/nuclear grid mix. Reliable but carbon-intensive.',
    costMultiplier: 1.0, carbonPerKW: 0.0008, installCost: 0, reliability: 1.0, color: '#888888',
  },
  grid_green: {
    source: 'grid_green', label: 'Grid (Green)', description: 'Contracted renewable grid power. Premium price, minimal carbon.',
    costMultiplier: 1.4, carbonPerKW: 0.0001, installCost: 5000, reliability: 1.0, color: '#44cc44',
  },
  onsite_solar: {
    source: 'onsite_solar', label: 'On-site Solar', description: 'Solar panels on-site. Free power when available (35% avg). Need grid backup.',
    costMultiplier: 0.6, carbonPerKW: 0.0, installCost: 80000, reliability: 0.35, color: '#ffcc00',
  },
  onsite_wind: {
    source: 'onsite_wind', label: 'On-site Wind', description: 'Wind turbines on-site. Better availability than solar (45%). Need grid backup.',
    costMultiplier: 0.7, carbonPerKW: 0.0, installCost: 60000, reliability: 0.45, color: '#66aaff',
  },
}

export interface GreenCertConfig {
  id: GreenCert
  label: string
  description: string
  requirements: {
    maxPUE: number
    minConsecutiveTicks: number
    requiredSource?: EnergySource[]
    zeroCarbonRequired?: boolean
  }
  cost: number
  revenueBonus: number
  carbonTaxReduction: number
}

export const GREEN_CERT_CONFIG: GreenCertConfig[] = [
  { id: 'energy_star', label: 'Energy Star', description: 'PUE ≤ 1.4 for 100 consecutive ticks. +10% contract revenue.',
    requirements: { maxPUE: 1.4, minConsecutiveTicks: 100 }, cost: 10000, revenueBonus: 0.10, carbonTaxReduction: 0 },
  { id: 'leed_silver', label: 'LEED Silver', description: 'Energy Star + non-mixed grid. +15% contract revenue, -5% carbon tax.',
    requirements: { maxPUE: 1.4, minConsecutiveTicks: 100, requiredSource: ['grid_green', 'onsite_solar', 'onsite_wind'] }, cost: 25000, revenueBonus: 0.15, carbonTaxReduction: 0.05 },
  { id: 'leed_gold', label: 'LEED Gold', description: 'LEED Silver + on-site renewable. +25% contract revenue, -15% carbon tax.',
    requirements: { maxPUE: 1.3, minConsecutiveTicks: 150, requiredSource: ['onsite_solar', 'onsite_wind'] }, cost: 50000, revenueBonus: 0.25, carbonTaxReduction: 0.15 },
  { id: 'carbon_neutral', label: 'Carbon Neutral', description: 'Zero net carbon for 200 ticks. +40% contract revenue, carbon tax exempt.',
    requirements: { maxPUE: 1.3, minConsecutiveTicks: 200, zeroCarbonRequired: true }, cost: 100000, revenueBonus: 0.40, carbonTaxReduction: 1.0 },
]

export const CARBON_TAX_SCHEDULE = [
  { minTick: 0, maxTick: 200, rate: 0 },
  { minTick: 200, maxTick: 500, rate: 2 },
  { minTick: 500, maxTick: 1000, rate: 5 },
  { minTick: 1000, maxTick: Infinity, rate: 10 },
]

export const WATER_USAGE_CONFIG = {
  gallonsPerCabinetPerTick: 2,
  costPerGallon: 0.10,
  droughtPriceMultiplier: 3,
}

export const EWASTE_CONFIG = {
  reputationPenaltyThreshold: 10,
  reputationPenaltyPerTick: 0.1,
  properDisposalCost: 500,
  improperDisposalCost: 100,
  improperDisposalReputationPenalty: 5,
}

// ── Phase 4C: Security & Compliance Config ──────────────────────────

export interface SecurityFeatureConfig {
  id: SecurityFeatureId
  label: string
  description: string
  cost: number
  maintenanceCost: number
  requiredTier: SecurityTier
  intrusionDefense: number
}

export const SECURITY_FEATURE_CONFIG: SecurityFeatureConfig[] = [
  { id: 'badge_access', label: 'Badge Access', description: 'Electronic badge readers on all entry points.', cost: 0, maintenanceCost: 0, requiredTier: 'basic', intrusionDefense: 0.05 },
  { id: 'cctv', label: 'CCTV', description: '24/7 camera surveillance of facility perimeter and server halls.', cost: 8000, maintenanceCost: 3, requiredTier: 'enhanced', intrusionDefense: 0.20 },
  { id: 'biometric', label: 'Biometric Scanners', description: 'Fingerprint and retinal scanners for sensitive areas.', cost: 20000, maintenanceCost: 5, requiredTier: 'high_security', intrusionDefense: 0.25 },
  { id: 'mantrap', label: 'Mantrap Entry', description: 'Dual-door mantrap prevents tailgating.', cost: 25000, maintenanceCost: 4, requiredTier: 'high_security', intrusionDefense: 0.30 },
  { id: 'cage_isolation', label: 'Cage Isolation', description: 'Individual customer cages with locked access.', cost: 35000, maintenanceCost: 6, requiredTier: 'high_security', intrusionDefense: 0.15 },
  { id: 'encrypted_network', label: 'Encrypted Network', description: 'Full network encryption at the facility level.', cost: 40000, maintenanceCost: 8, requiredTier: 'maximum', intrusionDefense: 0.10 },
  { id: 'security_noc', label: 'Security NOC', description: '24/7 security operations center with dedicated monitoring staff.', cost: 60000, maintenanceCost: 15, requiredTier: 'maximum', intrusionDefense: 0.10 },
]

export interface SecurityTierConfig {
  tier: SecurityTier
  label: string
  description: string
  cost: number
  maintenancePerTick: number
  featuresIncluded: SecurityFeatureId[]
  color: string
}

export const SECURITY_TIER_CONFIG: SecurityTierConfig[] = [
  { tier: 'basic', label: 'Basic', description: 'Badge access only. Standard contracts available.', cost: 0, maintenancePerTick: 0, featuresIncluded: ['badge_access'], color: '#888888' },
  { tier: 'enhanced', label: 'Enhanced', description: 'CCTV + badge access. SOC 2 eligible, enterprise contracts.', cost: 15000, maintenancePerTick: 8, featuresIncluded: ['badge_access', 'cctv'], color: '#44aaff' },
  { tier: 'high_security', label: 'High Security', description: 'Biometric, mantrap, cages. HIPAA/PCI-DSS eligible.', cost: 50000, maintenancePerTick: 20, featuresIncluded: ['badge_access', 'cctv', 'biometric', 'mantrap', 'cage_isolation'], color: '#ff8844' },
  { tier: 'maximum', label: 'Maximum', description: 'Full suite including encrypted network and Security NOC. FedRAMP eligible.', cost: 150000, maintenancePerTick: 45, featuresIncluded: ['badge_access', 'cctv', 'biometric', 'mantrap', 'cage_isolation', 'encrypted_network', 'security_noc'], color: '#ff4444' },
]

export interface ComplianceCertConfig {
  id: ComplianceCertId
  label: string
  description: string
  requirements: {
    minSecurityTier: SecurityTier
    requiredFeatures: SecurityFeatureId[]
    minReputation: number
    minSecurityOfficers: number
  }
  auditCost: number
  auditDurationTicks: number
  auditInterval: number
  revenueBonus: number
  color: string
}

export const COMPLIANCE_CERT_CONFIG: ComplianceCertConfig[] = [
  { id: 'soc2_type1', label: 'SOC 2 Type I', description: 'Basic security audit for enterprise SaaS hosting.',
    requirements: { minSecurityTier: 'enhanced', requiredFeatures: ['cctv', 'badge_access'], minReputation: 40, minSecurityOfficers: 0 },
    auditCost: 8000, auditDurationTicks: 10, auditInterval: 200, revenueBonus: 0.15, color: '#44aaff' },
  { id: 'soc2_type2', label: 'SOC 2 Type II', description: 'Extended security audit for enterprise and financial services.',
    requirements: { minSecurityTier: 'enhanced', requiredFeatures: ['cctv', 'badge_access'], minReputation: 50, minSecurityOfficers: 1 },
    auditCost: 15000, auditDurationTicks: 15, auditInterval: 300, revenueBonus: 0.25, color: '#4488ff' },
  { id: 'hipaa', label: 'HIPAA', description: 'Healthcare data compliance. Requires high security with biometric and cage isolation.',
    requirements: { minSecurityTier: 'high_security', requiredFeatures: ['biometric', 'cage_isolation'], minReputation: 60, minSecurityOfficers: 1 },
    auditCost: 20000, auditDurationTicks: 12, auditInterval: 250, revenueBonus: 0.30, color: '#ff44aa' },
  { id: 'pci_dss', label: 'PCI-DSS', description: 'Payment card industry compliance. Requires encrypted network and cage isolation.',
    requirements: { minSecurityTier: 'high_security', requiredFeatures: ['encrypted_network', 'cage_isolation'], minReputation: 55, minSecurityOfficers: 1 },
    auditCost: 18000, auditDurationTicks: 10, auditInterval: 200, revenueBonus: 0.35, color: '#ffaa00' },
  { id: 'fedramp', label: 'FedRAMP', description: 'Federal government compliance. Maximum security with full feature set.',
    requirements: { minSecurityTier: 'maximum', requiredFeatures: ['cctv', 'badge_access', 'biometric', 'mantrap', 'cage_isolation', 'encrypted_network', 'security_noc'], minReputation: 75, minSecurityOfficers: 2 },
    auditCost: 50000, auditDurationTicks: 20, auditInterval: 400, revenueBonus: 0.50, color: '#ff4444' },
]

export interface ActiveComplianceCert {
  certId: ComplianceCertId
  grantedAtTick: number
  expiresAtTick: number
  auditInProgress: boolean
  auditStartedTick: number
}

// New premium contracts gated by compliance
export const COMPLIANCE_CONTRACT_CATALOG: ContractDef[] = [
  { type: 'healthnet_emr', company: 'HealthNet', tier: 'gold', description: 'Electronic medical records platform. HIPAA compliance required.', minServers: 8, maxTemp: 68, revenuePerTick: 80, durationTicks: 400, penaltyPerTick: 50, terminationTicks: 5, completionBonus: 30000 },
  { type: 'tradefast_hft', company: 'TradeFast', tier: 'gold', description: 'High-frequency trading platform. PCI-DSS compliance required.', minServers: 10, maxTemp: 65, revenuePerTick: 90, durationTicks: 350, penaltyPerTick: 60, terminationTicks: 4, completionBonus: 35000 },
  { type: 'govsecure_cloud', company: 'GovSecure', tier: 'gold', description: 'Federal government cloud services. FedRAMP required.', minServers: 10, maxTemp: 65, revenuePerTick: 120, durationTicks: 500, penaltyPerTick: 70, terminationTicks: 5, completionBonus: 50000 },
  { type: 'paystream', company: 'PayStream', tier: 'gold', description: 'Payment processing platform. PCI-DSS required.', minServers: 6, maxTemp: 70, revenuePerTick: 75, durationTicks: 300, penaltyPerTick: 45, terminationTicks: 5, completionBonus: 25000 },
]

// Mapping from compliance cert to unlocked contract types
export const COMPLIANCE_CONTRACT_REQUIREMENTS: Record<string, ComplianceCertId> = {
  healthnet_emr: 'hipaa',
  tradefast_hft: 'pci_dss',
  govsecure_cloud: 'fedramp',
  paystream: 'pci_dss',
}

// ── Phase 4D: Competitor AI Config ──────────────────────────────────

export interface Competitor {
  id: string
  name: string
  personality: CompetitorPersonality
  strength: number
  specialization: CustomerType
  reputationScore: number
  securityTier: SecurityTier
  greenCert: GreenCert | null
  aggression: number
  techLevel: number
  marketShare: number
}

export interface CompetitorBid {
  competitorId: string
  competitorName: string
  contractType: string
  winChance: number
  ticksRemaining: number
}

export const COMPETITOR_PERSONALITIES: Record<CompetitorPersonality, {
  label: string
  description: string
  bidModifier: number
  growthRate: number
  color: string
}> = {
  budget: { label: 'Budget', description: 'Undercuts on price, wins on volume. Low quality, frequent incidents.', bidModifier: -0.25, growthRate: 0.8, color: '#888888' },
  premium: { label: 'Premium', description: 'High quality, charges more. Invests in security and cooling.', bidModifier: 0.1, growthRate: 1.2, color: '#4488ff' },
  green: { label: 'Green', description: 'Environmental focus. Targets eco-conscious clients.', bidModifier: 0.15, growthRate: 1.0, color: '#44cc44' },
  aggressive: { label: 'Aggressive', description: 'Fast expansion, takes big risks. High debt, can collapse.', bidModifier: -0.1, growthRate: 1.5, color: '#ff4444' },
  steady: { label: 'Steady', description: 'Slow and reliable growth. Never dominates but always competitive.', bidModifier: 0, growthRate: 1.0, color: '#ffaa00' },
}

const COMPETITOR_NAMES = [
  'NexGen Data', 'CloudVault Inc', 'TerraHost', 'IronGrid Systems', 'ArcticCore',
  'DataForge', 'SkyBridge DC', 'VoltStack', 'ByteHaven', 'CoreFlux',
]

const COMPETITOR_SCALE_CONFIG = {
  firstCompetitorTick: 100,
  secondCompetitorTick: 300,
  thirdCompetitorTick: 600,
  bidWindowTicks: 15,
  strengthGrowthRate: 0.05,
  rubberBandStrength: 0.02,
  priceWarChance: 0.003,
  poachAttemptChance: 0.002,
  competitorOutageChance: 0.004,
  marketReportInterval: 100,
}

// ── Event Log Types ─────────────────────────────────────────────────

export type EventCategory = 'incident' | 'finance' | 'contract' | 'achievement' | 'infrastructure' | 'staff' | 'research' | 'system'
export type EventSeverity = 'info' | 'warning' | 'error' | 'success'

export interface EventLogEntry {
  tick: number
  gameHour: number
  category: EventCategory
  message: string
  severity: EventSeverity
}

// ── Capacity Planning Types ─────────────────────────────────────────

export interface CapacityProjection {
  metric: string
  label: string
  currentValue: number
  maxValue: number
  utilizationPct: number
  trend: 'increasing' | 'stable' | 'decreasing'
  color: string
}

export interface HistoryPoint {
  tick: number
  power: number
  heat: number
  revenue: number
  cabinets: number
  money: number
}

// ── Statistics Dashboard Types ──────────────────────────────────────

export interface LifetimeStats {
  totalRevenueEarned: number
  totalExpensesPaid: number
  totalIncidentsSurvived: number
  totalServersDeployed: number
  totalSpinesDeployed: number
  peakTemperatureReached: number
  longestUptimeStreak: number
  currentUptimeStreak: number
  totalFiresSurvived: number
  totalPowerOutages: number
  totalContractsCompleted: number
  totalContractsTerminated: number
  peakRevenueTick: number
  peakCabinetCount: number
  totalMoneyEarned: number
}

// ── Tutorial System Types ───────────────────────────────────────────

export interface TutorialTip {
  id: string
  title: string
  message: string
  category: 'build' | 'cooling' | 'finance' | 'network' | 'incidents' | 'contracts' | 'carbon' | 'security' | 'market'
}

export const TUTORIAL_TIPS: TutorialTip[] = [
  { id: 'first_overheat', title: 'Overheating!', message: 'Your cabinet is heating up! Consider upgrading to water cooling or adding management cabinets.', category: 'cooling' },
  { id: 'first_throttle', title: 'Thermal Throttling', message: 'This server is earning only 50% revenue due to heat. Cool it down fast.', category: 'cooling' },
  { id: 'first_low_money', title: 'Low Funds', message: 'Running low on funds! Consider taking a loan or reducing expenses.', category: 'finance' },
  { id: 'no_leaf_switch', title: 'No Network', message: 'Cabinets without leaf switches cannot connect to the network fabric.', category: 'network' },
  { id: 'no_spine', title: 'No Backbone', message: 'You need spine switches to complete the network fabric and route traffic.', category: 'network' },
  { id: 'first_incident', title: 'Incident!', message: 'Incidents happen! Resolve them quickly by clicking the resolve button to minimize damage.', category: 'incidents' },
  { id: 'aisle_hint', title: 'Aisle Layout', message: 'Tip: Alternate cabinet facing in adjacent rows or columns for a hot/cold aisle cooling bonus. Use N/S for row aisles or E/W for column aisles.', category: 'build' },
  { id: 'zone_hint', title: 'Zone Bonus', message: 'Tip: Place 3+ cabinets of the same type adjacent to each other to form a zone and earn bonus revenue or reduced heat.', category: 'build' },
  { id: 'first_contract', title: 'Contracts', message: 'Contracts provide bonus revenue but require meeting SLA targets. Monitor your temp and server count!', category: 'contracts' },
  { id: 'first_order_arrived', title: 'Order Delivered!', message: 'Your first supply chain order has arrived! Stock up on inventory before shortages hit to avoid price spikes.', category: 'build' },
  { id: 'weather_hot', title: 'Heat Wave!', message: 'Hot weather is increasing ambient temperature. Your cooling systems need to work harder — consider water cooling.', category: 'cooling' },
  { id: 'weather_cold', title: 'Cold Snap', message: 'Cold weather is reducing ambient temperature. This is a good time to run high-heat workloads!', category: 'cooling' },
  { id: 'supply_shortage', title: 'Supply Shortage!', message: 'A supply chain shortage has hit! Equipment prices are inflated. Use your inventory stockpile or wait it out.', category: 'finance' },
  { id: 'meet_me_room', title: 'Meet-Me Room Active', message: 'Your Meet-Me Room is generating interconnection revenue! Add more ports to attract tenants and increase passive income.', category: 'finance' },
  { id: 'peering_active', title: 'Peering Established', message: 'You have active peering agreements reducing latency. Lower latency improves customer satisfaction and reputation.', category: 'network' },
  { id: 'maintenance_done', title: 'Maintenance Complete', message: 'Preventive maintenance completed! Regular maintenance prevents surprise failures and gives a temporary cooling boost.', category: 'build' },
  { id: 'noise_warning', title: 'Noise Complaint!', message: 'Your data center is too loud! Install sound barriers to reduce noise or face fines and zoning restrictions.', category: 'build' },
  { id: 'spot_high', title: 'Spot Prices High!', message: 'Spot compute prices are above 1.5x — great time to allocate more servers to the spot market for extra revenue!', category: 'finance' },
  { id: 'redundancy_hint', title: 'Power Protection', message: 'Consider upgrading power redundancy to N+1 or 2N to protect against power failures and improve uptime.', category: 'build' },
  { id: 'capacity_warning', title: 'Running Out of Space', message: 'You are using over 80% of cabinet capacity. Upgrade your suite tier soon to avoid hitting the limit!', category: 'build' },
  // Phase 4B — Carbon & Environmental tips
  { id: 'carbon_tax_rising', title: 'Carbon Tax Rising', message: 'Carbon tax rates are increasing! Switch to green energy or on-site renewables to reduce your carbon footprint and save money.', category: 'carbon' },
  { id: 'ewaste_piling', title: 'E-Waste Piling Up', message: 'Your e-waste stockpile is growing. Dispose of it properly to maintain reputation, or risk penalties.', category: 'carbon' },
  { id: 'green_cert_eligible', title: 'Green Cert Available', message: 'Your facility may qualify for a green certification! Check the Carbon panel to apply for Energy Star or LEED.', category: 'carbon' },
  // Phase 4C — Security & Compliance tips
  { id: 'security_upgrade', title: 'Security Matters', message: 'Upgrading security unlocks premium compliance certifications and lucrative government/healthcare contracts.', category: 'security' },
  { id: 'intrusion_detected', title: 'Intrusion Alert!', message: 'A security intrusion was detected! Higher security tiers and features reduce intrusion frequency and impact.', category: 'security' },
  { id: 'compliance_expiring', title: 'Certification Expiring', message: 'A compliance certification is about to expire! Re-audit before the deadline to keep your premium contracts.', category: 'security' },
  // Phase 4D — Competitor AI tips
  { id: 'competitor_appeared', title: 'New Competitor!', message: 'A rival data center company has entered the market. They will compete for contracts — act fast to secure deals!', category: 'market' },
  { id: 'competitor_bidding', title: 'Competition!', message: 'A competitor is bidding on a contract you may want. Accept quickly before they win it!', category: 'market' },
  { id: 'price_war', title: 'Price War!', message: 'A competitor has started a price war! Contract revenue is temporarily reduced across the market.', category: 'market' },
  // Operations Progression tips
  { id: 'ops_upgrade_available', title: 'Ops Upgrade Ready', message: 'You meet the requirements to upgrade your operations tier! Check the Operations panel to unlock better automation and reduced incident costs.', category: 'incidents' },
]

// ── Procedural Name Generation ──────────────────────────────────

const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Quinn', 'Drew', 'Blake', 'Jamie', 'Avery', 'Dakota', 'Reese', 'Skyler', 'Charlie', 'Kai', 'Sage', 'Rowan', 'Finley']
const LAST_NAMES = ['Chen', 'Patel', 'Kim', 'Garcia', 'Murphy', 'Nakamura', 'Berg', 'Santos', 'Fischer', 'Okafor', 'Levy', 'Volkov', 'Tanaka', 'Dubois', 'Ahmed', 'Johansson', 'Rivera', 'Nguyen', 'Hoffman', 'Kowalski']

function generateStaffName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`
}

// ── Cooling System Constants ────────────────────────────────────

export const COOLING_CONFIG: Record<CoolingType, {
  label: string
  upgradeCost: number
  coolingRate: number         // °C removed per tick per cabinet
  operatingCostMult: number   // multiplier on cooling portion of expenses
  overheadReduction: number   // fraction reduction to cooling overhead factor (0 = none, 0.35 = 35% less)
  color: string
  description: string
}> = {
  air: {
    label: 'AIR',
    upgradeCost: 0,
    coolingRate: 2.0,
    operatingCostMult: 1.0,
    overheadReduction: 0,
    color: '#88ccff',
    description: 'Basic air cooling. Cheap to run but limited capacity at high temperatures.',
  },
  water: {
    label: 'WATER',
    upgradeCost: 25000,
    coolingRate: 3.5,
    operatingCostMult: 1.4,
    overheadReduction: 0.35,
    color: '#00ccff',
    description: 'Chilled water cooling. Higher operating cost but dramatically better heat removal and lower PUE.',
  },
}

// ── Loan System Types ───────────────────────────────────────────

export interface Loan {
  id: string
  principal: number           // original amount borrowed
  remaining: number           // amount still owed
  interestRate: number        // per-tick interest rate (e.g. 0.001 = 0.1% per tick)
  paymentPerTick: number      // fixed payment per tick
  ticksRemaining: number      // ticks until fully repaid
  label: string               // display name
}

export const LOAN_OPTIONS: { label: string; principal: number; interestRate: number; termTicks: number }[] = [
  { label: 'Small Loan', principal: 10000, interestRate: 0.0008, termTicks: 200 },
  { label: 'Medium Loan', principal: 30000, interestRate: 0.0012, termTicks: 400 },
  { label: 'Large Loan', principal: 75000, interestRate: 0.0018, termTicks: 600 },
]

// ── Incident System Types ───────────────────────────────────────

export type IncidentSeverity = 'minor' | 'major' | 'critical'

export interface IncidentDef {
  type: string
  label: string
  severity: IncidentSeverity
  description: string
  durationTicks: number       // how long the incident lasts if unresolved
  resolveCost: number         // $ to resolve immediately
  effect: 'heat_spike' | 'revenue_penalty' | 'power_surge' | 'traffic_drop' | 'cooling_failure' | 'hardware_failure'
  effectMagnitude: number     // severity-dependent multiplier
  hardwareTarget?: 'spine' | 'leaf'  // for hardware_failure: which type of switch to disable
}

export interface ActiveIncident {
  id: string
  def: IncidentDef
  ticksRemaining: number
  resolved: boolean
  affectedHardwareId?: string  // for hardware_failure: ID of the spine or cabinet affected
}

export const INCIDENT_CATALOG: IncidentDef[] = [
  { type: 'fiber_cut', label: 'Fiber Cut', severity: 'major', description: 'A backhoe severed a fiber trunk line. Traffic capacity reduced.', durationTicks: 15, resolveCost: 5000, effect: 'traffic_drop', effectMagnitude: 0.5 },
  { type: 'power_surge', label: 'Power Surge', severity: 'major', description: 'Grid voltage spike detected. Equipment drawing extra power.', durationTicks: 10, resolveCost: 3000, effect: 'power_surge', effectMagnitude: 1.3 },
  { type: 'cooling_failure', label: 'CRAC Unit Failure', severity: 'critical', description: 'A cooling unit has failed. Heat levels rising across the facility.', durationTicks: 12, resolveCost: 8000, effect: 'cooling_failure', effectMagnitude: 0.4 },
  { type: 'ddos', label: 'DDoS Attack', severity: 'minor', description: 'Distributed denial of service attack detected. Revenue impacted while mitigating.', durationTicks: 8, resolveCost: 2000, effect: 'revenue_penalty', effectMagnitude: 0.7 },
  { type: 'heat_wave', label: 'Heat Wave', severity: 'major', description: 'Record high temperatures outside. Ambient temperature spiking.', durationTicks: 20, resolveCost: 4000, effect: 'heat_spike', effectMagnitude: 8 },
  { type: 'squirrel', label: 'Squirrel in Transformer', severity: 'minor', description: 'A squirrel got into the power transformer. Brief power disruption.', durationTicks: 5, resolveCost: 500, effect: 'power_surge', effectMagnitude: 1.15 },
  { type: 'pipe_leak', label: 'Water Pipe Leak', severity: 'major', description: 'A chilled water pipe is leaking. Cooling efficiency reduced.', durationTicks: 10, resolveCost: 6000, effect: 'cooling_failure', effectMagnitude: 0.3 },
  { type: 'ransomware', label: 'Ransomware Attempt', severity: 'critical', description: 'Ransomware detected on management network. Revenue halted until contained.', durationTicks: 15, resolveCost: 12000, effect: 'revenue_penalty', effectMagnitude: 0.3 },
  // Creative / sci-fi incidents
  { type: 'sentient_ai', label: 'Sentient AI Outbreak', severity: 'critical', description: 'An AI workload has achieved self-awareness and is consuming all available compute.', durationTicks: 18, resolveCost: 15000, effect: 'revenue_penalty', effectMagnitude: 0.2 },
  { type: 'solar_flare', label: 'Solar Flare', severity: 'critical', description: 'A massive coronal mass ejection is causing electromagnetic interference across all systems.', durationTicks: 12, resolveCost: 10000, effect: 'power_surge', effectMagnitude: 1.5 },
  { type: 'quantum_decoherence', label: 'Quantum Decoherence', severity: 'major', description: 'Quantum bit errors cascading through network fabric. Traffic integrity compromised.', durationTicks: 10, resolveCost: 7000, effect: 'traffic_drop', effectMagnitude: 0.3 },
  // Hardware replacement incidents
  { type: 'spine_failure', label: 'Spine Switch Failure', severity: 'major', description: 'A spine switch has failed. Traffic is being redistributed across remaining spines.', durationTicks: 20, resolveCost: 12000, effect: 'hardware_failure', effectMagnitude: 0, hardwareTarget: 'spine' },
  { type: 'leaf_failure', label: 'Leaf Switch Failure', severity: 'major', description: 'A top-of-rack switch has failed. The affected cabinet has lost network connectivity.', durationTicks: 15, resolveCost: 5000, effect: 'hardware_failure', effectMagnitude: 0, hardwareTarget: 'leaf' },
  // Phase 4B — Environmental incidents
  { type: 'drought', label: 'Drought', severity: 'major', description: 'Water supply restricted. Water cooling costs tripled until resolved.', durationTicks: 25, resolveCost: 6000, effect: 'cooling_failure', effectMagnitude: 0.2 },
  // Phase 4C — Security intrusion incidents
  { type: 'tailgating', label: 'Tailgating', severity: 'minor', description: 'Someone followed an employee through a secure door. Security review required.', durationTicks: 5, resolveCost: 1000, effect: 'revenue_penalty', effectMagnitude: 0.95 },
  { type: 'social_engineering', label: 'Social Engineering', severity: 'major', description: 'An attacker tricked staff into granting unauthorized access. Revenue impacted.', durationTicks: 10, resolveCost: 5000, effect: 'revenue_penalty', effectMagnitude: 0.6 },
  { type: 'break_in', label: 'Break-in Attempt', severity: 'critical', description: 'Physical intrusion detected! Equipment at risk. Immediate security response needed.', durationTicks: 8, resolveCost: 15000, effect: 'revenue_penalty', effectMagnitude: 0.3 },
]

/** Chance per tick of an incident occurring (when fewer than max active) */
const INCIDENT_CHANCE = 0.02
const MAX_ACTIVE_INCIDENTS = 3

// ── Contract / Tenant System Types ──────────────────────────────

export type ContractTier = 'bronze' | 'silver' | 'gold'

export interface ContractDef {
  type: string
  company: string
  tier: ContractTier
  description: string
  minServers: number           // minimum production servers needed online
  maxTemp: number              // max avg facility temp (SLA)
  revenuePerTick: number       // bonus $/tick while SLA met
  durationTicks: number        // contract length
  penaltyPerTick: number       // $/tick deducted when SLA violated
  terminationTicks: number     // consecutive violation ticks before contract lost
  completionBonus: number      // bonus $ on successful completion
}

export interface ActiveContract {
  id: string
  def: ContractDef
  ticksRemaining: number
  consecutiveViolations: number
  totalViolationTicks: number
  totalEarned: number
  totalPenalties: number
  status: 'active' | 'completed' | 'terminated'
}

export const CONTRACT_CATALOG: ContractDef[] = [
  // Bronze tier — easy requirements, modest pay
  { type: 'startup_cloud', company: 'StartupCo', tier: 'bronze', description: 'Small SaaS startup needs basic cloud hosting. Lenient SLA.', minServers: 2, maxTemp: 90, revenuePerTick: 8, durationTicks: 100, penaltyPerTick: 4, terminationTicks: 15, completionBonus: 1500 },
  { type: 'dev_agency', company: 'DevForge', tier: 'bronze', description: 'Web development agency needs staging servers. Flexible on downtime.', minServers: 3, maxTemp: 85, revenuePerTick: 10, durationTicks: 80, penaltyPerTick: 5, terminationTicks: 12, completionBonus: 1200 },
  { type: 'indie_game', company: 'PixelDream', tier: 'bronze', description: 'Indie game studio hosting multiplayer backend. Moderate needs.', minServers: 2, maxTemp: 85, revenuePerTick: 9, durationTicks: 120, penaltyPerTick: 4, terminationTicks: 15, completionBonus: 2000 },
  // Silver tier — moderate requirements, good pay
  { type: 'streaming_cdn', company: 'StreamFlix', tier: 'silver', description: 'Video streaming CDN edge node. Needs reliable bandwidth and uptime.', minServers: 6, maxTemp: 78, revenuePerTick: 25, durationTicks: 200, penaltyPerTick: 15, terminationTicks: 10, completionBonus: 6000 },
  { type: 'ecommerce', company: 'ShopEngine', tier: 'silver', description: 'E-commerce platform. Transaction processing requires stable temps.', minServers: 5, maxTemp: 75, revenuePerTick: 22, durationTicks: 180, penaltyPerTick: 12, terminationTicks: 10, completionBonus: 5000 },
  { type: 'saas_platform', company: 'CloudStack', tier: 'silver', description: 'Enterprise SaaS provider. Needs consistent availability for B2B clients.', minServers: 8, maxTemp: 78, revenuePerTick: 30, durationTicks: 250, penaltyPerTick: 18, terminationTicks: 8, completionBonus: 8000 },
  // Gold tier — strict SLA, high pay
  { type: 'bank_trading', company: 'MegaBank', tier: 'gold', description: 'High-frequency trading platform. Zero tolerance for thermal issues.', minServers: 10, maxTemp: 70, revenuePerTick: 60, durationTicks: 300, penaltyPerTick: 40, terminationTicks: 5, completionBonus: 20000 },
  { type: 'ai_training', company: 'DeepMind Labs', tier: 'gold', description: 'Large language model training cluster. Massive compute, strict cooling.', minServers: 12, maxTemp: 72, revenuePerTick: 70, durationTicks: 250, penaltyPerTick: 45, terminationTicks: 6, completionBonus: 18000 },
  { type: 'gov_secure', company: 'GovCloud', tier: 'gold', description: 'Government secure cloud workloads. Maximum reliability required.', minServers: 10, maxTemp: 68, revenuePerTick: 55, durationTicks: 350, penaltyPerTick: 35, terminationTicks: 5, completionBonus: 22000 },
]

/** How often (in ticks) new contract offers refresh */
const CONTRACT_OFFER_INTERVAL = 50
/** Max contracts a player can have active at once */
const MAX_ACTIVE_CONTRACTS = 3
/** Number of offers available at a time */
const CONTRACT_OFFER_COUNT = 3

export const CONTRACT_TIER_COLORS: Record<ContractTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
}

// ── Achievement System Types ────────────────────────────────────

export interface AchievementDef {
  id: string
  label: string
  description: string
  icon: string                // emoji for display
}

export interface Achievement {
  def: AchievementDef
  unlockedAtTick: number
}

export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  { id: 'first_cabinet', label: 'Hello World', description: 'Place your first cabinet.', icon: '📦' },
  { id: 'first_spine', label: 'Backbone', description: 'Deploy your first spine switch.', icon: '🔗' },
  { id: 'full_rack', label: 'Fully Loaded', description: 'Fill a cabinet with 4 servers and a leaf switch.', icon: '🖥️' },
  { id: 'ten_cabinets', label: 'Scaling Up', description: 'Deploy 10 cabinets.', icon: '🏗️' },
  { id: 'water_cooling', label: 'Liquid Assets', description: 'Upgrade to water cooling.', icon: '💧' },
  { id: 'first_loan', label: 'Leveraged', description: 'Take out your first loan.', icon: '🏦' },
  { id: 'debt_free', label: 'Debt Free', description: 'Pay off all outstanding loans.', icon: '✅' },
  { id: 'survive_incident', label: 'Crisis Manager', description: 'Resolve your first incident.', icon: '🛡️' },
  { id: 'hundred_k', label: 'Six Figures', description: 'Accumulate $100,000.', icon: '💰' },
  { id: 'million', label: 'Millionaire', description: 'Accumulate $1,000,000.', icon: '🤑' },
  { id: 'low_pue', label: 'Green Machine', description: 'Achieve a PUE of 1.30 or lower.', icon: '🌱' },
  { id: 'max_spines', label: 'Full Fabric', description: 'Deploy all 6 spine switches.', icon: '🕸️' },
  { id: 'thermal_crisis', label: 'Feeling the Heat', description: 'Have a cabinet reach critical temperature (95°C).', icon: '🔥' },
  { id: 'five_incidents', label: 'Veteran Operator', description: 'Resolve 5 incidents.', icon: '⭐' },
  { id: 'full_grid', label: 'No Vacancy', description: 'Fill all 32 cabinet slots.', icon: '🏢' },
  { id: 'first_contract', label: 'Open for Business', description: 'Accept your first tenant contract.', icon: '📋' },
  { id: 'contract_complete', label: 'Delivered', description: 'Successfully complete a tenant contract.', icon: '🤝' },
  { id: 'gold_contract', label: 'Enterprise Grade', description: 'Accept a Gold tier contract.', icon: '👑' },
  { id: 'three_contracts', label: 'Full House', description: 'Have 3 active contracts simultaneously.', icon: '🏆' },
  // Phase 2/3 achievements
  { id: 'first_generator', label: 'Backup Plan', description: 'Purchase your first backup generator.', icon: '⚡' },
  { id: 'fire_ready', label: 'Fire Ready', description: 'Install a fire suppression system.', icon: '🧯' },
  { id: 'first_research', label: 'R&D Pioneer', description: 'Complete your first technology research.', icon: '🔬' },
  { id: 'tech_savvy', label: 'Tech Savvy', description: 'Unlock 6 technologies.', icon: '🧪' },
  { id: 'excellent_rep', label: 'Excellent Reputation', description: 'Reach Excellent reputation tier.', icon: '⭐' },
  { id: 'hardware_refresh', label: 'Fresh Hardware', description: 'Refresh aging server hardware.', icon: '♻️' },
  { id: 'suite_upgrade', label: 'Moving Up', description: 'Upgrade your facility to a bigger suite.', icon: '🏢' },
  { id: 'enterprise_suite', label: 'Hyperscale', description: 'Reach Enterprise suite tier.', icon: '🏗️' },
  // Infrastructure layout achievements
  { id: 'first_pdu', label: 'Power Planned', description: 'Place your first PDU.', icon: '🔌' },
  { id: 'first_cable_tray', label: 'Cable Management', description: 'Place your first cable tray.', icon: '🔧' },
  { id: 'proper_aisles', label: 'Hot/Cold Aisles', description: 'Achieve a hot/cold aisle cooling bonus.', icon: '🌡️' },
  { id: 'first_zone', label: 'Zoned In', description: 'Form your first zone of 3+ adjacent same-type cabinets.', icon: '🗂️' },
  { id: 'clean_cabling', label: 'Clean Cabling', description: 'Route all cables through trays with zero messy runs.', icon: '✨' },
  // New feature achievements
  { id: 'first_insurance', label: 'Insured', description: 'Purchase your first insurance policy.', icon: '🛡️' },
  { id: 'fully_insured', label: 'Fully Covered', description: 'Hold all 4 insurance policies simultaneously.', icon: '🏦' },
  { id: 'drill_passed', label: 'Drill Sergeant', description: 'Pass a disaster recovery drill.', icon: '🎯' },
  { id: 'stock_100', label: 'Going Public', description: 'Reach a stock price of $100.', icon: '📈' },
  { id: 'stock_500', label: 'Blue Chip', description: 'Reach a stock price of $500.', icon: '💎' },
  { id: 'first_patent', label: 'Inventor', description: 'Patent your first technology.', icon: '📜' },
  { id: 'all_patents', label: 'Patent Troll', description: 'Patent 5 or more technologies.', icon: '📚' },
  { id: 'rfp_won', label: 'Winning Bid', description: 'Win an RFP competition.', icon: '🏅' },
  { id: 'first_busway', label: 'Power Highway', description: 'Install your first overhead busway.', icon: '⚡' },
  { id: 'first_crossconnect', label: 'Connected', description: 'Install your first cross-connect panel.', icon: '🔌' },
  { id: 'first_inrow', label: 'Precision Cooling', description: 'Install your first in-row cooling unit.', icon: '❄️' },
  { id: 'sandbox_activated', label: 'Creative Mode', description: 'Enable sandbox mode.', icon: '🎮' },
  { id: 'game_saved', label: 'Save Scummer', description: 'Save your game for the first time.', icon: '💾' },
  { id: 'scenario_complete', label: 'Challenge Accepted', description: 'Complete a scenario challenge.', icon: '🎪' },
  { id: 'heat_map_used', label: 'Thermal Vision', description: 'Toggle the heat map overlay.', icon: '🌡️' },
  // Staff & HR achievements
  { id: 'first_hire', label: 'First Hire', description: 'Hire your first staff member.', icon: '👤' },
  { id: 'full_staff', label: 'Full Staff', description: 'Reach your maximum staff capacity.', icon: '👥' },
  { id: 'zero_fatigue', label: 'Zero Fatigue', description: 'Resolve 10 incidents without any staff burnout.', icon: '💪' },
  { id: 'certified_team', label: 'Certified Team', description: 'Have all staff with at least one certification.', icon: '🎓' },
  // Phase 4B — Carbon & Environmental achievements
  { id: 'green_power', label: 'Green Power', description: 'Switch to a non-fossil energy source.', icon: '🌿' },
  { id: 'carbon_neutral_cert', label: 'Carbon Neutral', description: 'Achieve Carbon Neutral green certification.', icon: '🌍' },
  { id: 'water_wise', label: 'Water Wise', description: 'Operate for 100 ticks with no water usage.', icon: '💧' },
  { id: 'clean_sweep', label: 'Clean Sweep', description: 'Properly dispose of 20 e-waste units total.', icon: '♻️' },
  // Phase 4C — Security & Compliance achievements
  { id: 'locked_down', label: 'Locked Down', description: 'Reach High Security tier.', icon: '🔒' },
  { id: 'fully_compliant', label: 'Fully Compliant', description: 'Hold 3 or more compliance certifications simultaneously.', icon: '📋' },
  { id: 'fort_knox', label: 'Fort Knox', description: 'Block 10 intrusion attempts with security features.', icon: '🏰' },
  { id: 'gov_contractor', label: 'Government Contractor', description: 'Complete a FedRAMP-gated contract.', icon: '🏛️' },
  // Phase 4D — Competitor AI achievements
  { id: 'market_leader', label: 'Market Leader', description: 'Achieve 50% or greater market share.', icon: '📊' },
  { id: 'monopoly', label: 'Monopoly', description: 'Win 5 contracts that competitors bid on.', icon: '🏅' },
  { id: 'underdog', label: 'Underdog', description: 'Win a contract against a competitor with higher reputation.', icon: '💪' },
  { id: 'rivalry', label: 'Rivalry', description: 'Outperform all competitors for 100 consecutive ticks.', icon: '🏆' },
  // Operations Progression achievements
  { id: 'script_kiddie', label: 'Script Kiddie', description: 'Unlock Monitoring & Alerting ops tier.', icon: '📡' },
  { id: 'sre', label: 'SRE', description: 'Unlock Basic Automation ops tier.', icon: '🤖' },
  { id: 'platform_engineer', label: 'Platform Engineer', description: 'Unlock Full Orchestration ops tier.', icon: '🚀' },
  { id: 'lights_out', label: 'Lights Out', description: 'Auto-resolve 20 incidents via ops automation.', icon: '💡' },
]

export interface EnvironmentConfig {
  label: string           // Short display label (e.g. "PROD")
  name: string            // Full name
  revenueMultiplier: number  // fraction of base revenue (1.0 = full, 0 = none)
  heatMultiplier: number     // fraction of base heat generation
  description: string        // Short in-game description
  guidance: string           // When/why a player should build this
  color: string              // CSS color for UI badges
  frameColors: { top: number; side: number; front: number }  // Isometric frame tint
}

export const ENVIRONMENT_CONFIG: Record<CabinetEnvironment, EnvironmentConfig> = {
  production: {
    label: 'PROD',
    name: 'Production',
    revenueMultiplier: 1.0,
    heatMultiplier: 1.0,
    description: 'Revenue-generating workloads at full capacity.',
    guidance: 'Your bread and butter. Production cabinets run customer workloads and generate maximum revenue per server.',
    color: '#00ff88',
    frameColors: { top: 0x1a3a2a, side: 0x14302a, front: 0x0e2a1e },
  },
  lab: {
    label: 'LAB',
    name: 'Lab / Dev',
    revenueMultiplier: 0.25,
    heatMultiplier: 0.7,
    description: 'Development and test workloads at reduced load.',
    guidance: 'Lab cabinets earn 25% revenue running lighter dev workloads, but generate 30% less heat. Essential for testing configurations before deploying to production.',
    color: '#cc66ff',
    frameColors: { top: 0x2a1a3a, side: 0x221432, front: 0x1a0e2a },
  },
  management: {
    label: 'MGMT',
    name: 'Management',
    revenueMultiplier: 0,
    heatMultiplier: 0.5,
    description: 'Infrastructure monitoring, DCIM, and BMC controllers.',
    guidance: 'No direct revenue, but each active management server reduces cooling overhead by 3% across your entire facility (max 30%). Not needed early on, but as you scale past 6+ cabinets the cooling savings pay for themselves.',
    color: '#ffaa00',
    frameColors: { top: 0x3a3a1a, side: 0x302a14, front: 0x2a1e0e },
  },
}

export interface Cabinet {
  id: string
  col: number             // grid column position (0-based)
  row: number             // grid row position (0-based)
  environment: CabinetEnvironment
  customerType: CustomerType  // workload type affecting power/heat/revenue
  serverCount: number     // 1–4 servers per cabinet
  hasLeafSwitch: boolean  // ToR switch mounted on top
  powerStatus: boolean
  heatLevel: number       // °C, dynamic per tick
  serverAge: number       // ticks since last server refresh (for depreciation)
  facing: CabinetFacing   // direction cabinet faces (for hot/cold aisle)
}

// ── Placement Strategy Hints ────────────────────────────────────

export interface PlacementHint {
  message: string
  type: 'tip' | 'warning' | 'info'
}

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
  const limits = getSuiteLimits(suiteTier)

  // Zone adjacency hint: check if placing next to same environment/customer type cabinets
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

  // Simulate placing a cabinet here to check adjacency
  const orthogonalNeighbors = cabinets.filter(
    (c) => (c.col === col && Math.abs(c.row - row) === 1) || (c.row === row && Math.abs(c.col - col) === 1)
  )
  const allNeighbors = cabinets.filter(
    (c) => Math.abs(c.col - col) <= 1 && Math.abs(c.row - row) <= 1 && (c.col !== col || c.row !== row)
  )

  // Heat warnings from hot neighbors
  const hotNeighbors = allNeighbors.filter((c) => c.heatLevel >= 60)
  const critNeighbors = allNeighbors.filter((c) => c.heatLevel >= SIM.throttleTemp)
  if (critNeighbors.length > 0) {
    hints.push({ message: 'Adjacent to overheating cabinets — risk of thermal throttle', type: 'warning' })
  } else if (hotNeighbors.length > 0) {
    hints.push({ message: 'Warm neighbors nearby — monitor cooling capacity', type: 'warning' })
  }

  // Spacing and density analysis
  if (orthogonalNeighbors.length >= 3) {
    hints.push({ message: 'Surrounded on 3+ sides — trapped hot air, poor maintenance access', type: 'warning' })
  } else if (orthogonalNeighbors.length === 0) {
    hints.push({ message: 'Open placement — good airflow and maintenance access', type: 'tip' })
  }

  // Maintenance access check: would placing here block neighbors' access?
  for (const neighbor of orthogonalNeighbors) {
    const neighborAdjacentEmpty = [
      { col: neighbor.col, row: neighbor.row - 1 },
      { col: neighbor.col, row: neighbor.row + 1 },
      { col: neighbor.col - 1, row: neighbor.row },
      { col: neighbor.col + 1, row: neighbor.row },
    ].filter((d) => {
      if (d.col < 0 || d.col >= limits.cols || d.row < 0 || d.row >= limits.rows) return false
      if (d.col === col && d.row === row) return false // this tile would be occupied
      return !cabinets.some((c) => c.col === d.col && c.row === d.row)
    })
    if (neighborAdjacentEmpty.length === 0) {
      hints.push({ message: `Would block maintenance access to ${neighbor.id}`, type: 'warning' })
      break
    }
  }

  // Aisle gap guidance
  const rowCabs = cabinets.filter((c) => c.row === row)
  const colCabs = cabinets.filter((c) => c.col === col)
  const adjacentRowNorth = cabinets.filter((c) => c.row === row - 1)
  const adjacentRowSouth = cabinets.filter((c) => c.row === row + 1)
  const adjacentColWest = cabinets.filter((c) => c.col === col - 1)
  const adjacentColEast = cabinets.filter((c) => c.col === col + 1)
  if (adjacentRowNorth.length > 0 && adjacentRowSouth.length > 0) {
    hints.push({ message: 'Between two cabinet rows — consider leaving as an aisle for DC techs', type: 'warning' })
  }
  if (adjacentColWest.length > 0 && adjacentColEast.length > 0) {
    hints.push({ message: 'Between two cabinet columns — consider leaving as an aisle', type: 'warning' })
  }

  // Row/column facing consistency
  if (rowCabs.length > 0) {
    const rowFacings = new Set(rowCabs.map((c) => c.facing))
    if (rowFacings.size === 1) {
      const facing = rowCabs[0].facing
      hints.push({ message: `Row faces ${facing} — match facing for aisle consistency`, type: 'info' })
    }
  }
  if (colCabs.length > 0) {
    const colFacings = new Set(colCabs.filter((c) => c.facing === 'east' || c.facing === 'west').map((c) => c.facing))
    if (colFacings.size === 1) {
      const facing = [...colFacings][0]
      hints.push({ message: `Column faces ${facing} — match facing for aisle consistency`, type: 'info' })
    }
  }

  // Aisle spacing hint: suggest leaving gaps between cabinet groups
  if (cabinets.length === 0) {
    hints.push({ message: 'Leave gaps between cabinets for aisles — DC techs need walkway access', type: 'tip' })
  } else if (cabinets.length >= 2 && cabinets.length < 6) {
    const cabRows = [...new Set(cabinets.map((c) => c.row))].sort((a, b) => a - b)
    if (cabRows.length >= 2) {
      const hasGap = cabRows.some((r, i) => i > 0 && r - cabRows[i - 1] >= 2)
      if (!hasGap && row !== cabRows[0] && row !== cabRows[cabRows.length - 1]) {
        hints.push({ message: 'Skip a row between cabinet rows for proper hot/cold aisles', type: 'tip' })
      }
    }
  }

  // Dense row warning
  if (rowCabs.length >= limits.cols - 2) {
    hints.push({ message: 'Row nearly full — start a new row with aisle gap for airflow', type: 'info' })
  }

  return hints
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

// ── Infrastructure Layout Helpers ──────────────────────────────────

/** Calculate Manhattan distance between two grid positions */
function manhattanDist(c1: number, r1: number, c2: number, r2: number): number {
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

/** Calculate the cable length (Manhattan distance) between a cabinet and the spine row */
function calcCableLength(cabCol: number, cabRow: number, _spineSlot: number, gridRows: number): number {
  // Cable goes from cabinet to edge of grid (row 0) plus overhead distance to spine row
  return cabRow + 1 + Math.abs(cabCol - Math.floor(gridRows / 2))
}

/** Get the front (intake) and rear (exhaust) tile offsets for a given facing direction.
 *  For N/S facing: front/rear are row offsets, sides are column offsets.
 *  For E/W facing: front/rear are column offsets, sides are row offsets. */
export function getFacingOffsets(facing: CabinetFacing, col: number, row: number) {
  switch (facing) {
    case 'north': return { front: { col, row: row - 1 }, rear: { col, row: row + 1 }, sides: [{ col: col - 1, row }, { col: col + 1, row }] }
    case 'south': return { front: { col, row: row + 1 }, rear: { col, row: row - 1 }, sides: [{ col: col - 1, row }, { col: col + 1, row }] }
    case 'east':  return { front: { col: col + 1, row }, rear: { col: col - 1, row }, sides: [{ col, row: row - 1 }, { col, row: row + 1 }] }
    case 'west':  return { front: { col: col - 1, row }, rear: { col: col + 1, row }, sides: [{ col, row: row - 1 }, { col, row: row + 1 }] }
  }
}

/** Check if a facing direction aligns along the row axis (N/S) or column axis (E/W) */
function isRowAligned(facing: CabinetFacing): boolean {
  return facing === 'north' || facing === 'south'
}

/** Calculate hot/cold aisle cooling bonus based on cabinet layout.
 *  Enhanced: rewards actual physical gaps between cabinet rows/columns (proper aisles for walkways).
 *  Supports both row-aligned (N/S) and column-aligned (E/W) aisle patterns. */
export function calcAisleBonus(cabinets: Cabinet[]): number {
  if (cabinets.length < 2) return 0

  let bonus = 0

  // ── Row-based aisles (N/S facing cabinets) ──
  const rowAligned = cabinets.filter((c) => isRowAligned(c.facing))
  if (rowAligned.length >= 2) {
    const rowMap = new Map<number, Cabinet[]>()
    for (const cab of rowAligned) {
      const list = rowMap.get(cab.row) ?? []
      list.push(cab)
      rowMap.set(cab.row, list)
    }
    const rows = [...rowMap.keys()].sort((a, b) => a - b)
    for (let i = 0; i < rows.length - 1; i++) {
      const thisRow = rowMap.get(rows[i])!
      const nextRow = rowMap.get(rows[i + 1])!
      const gap = rows[i + 1] - rows[i]

      const thisFacingSouth = thisRow.every((c) => c.facing === 'south')
      const nextFacingNorth = nextRow.every((c) => c.facing === 'north')
      const pattern1 = thisFacingSouth && nextFacingNorth

      const thisFacingNorth = thisRow.every((c) => c.facing === 'north')
      const nextFacingSouth = nextRow.every((c) => c.facing === 'south')
      const pattern2 = thisFacingNorth && nextFacingSouth

      if (pattern1 || pattern2) {
        bonus += gap >= 2 ? SPACING_CONFIG.properAisleBonusPerPair : SPACING_CONFIG.narrowAisleBonusPerPair
      }
    }
  }

  // ── Column-based aisles (E/W facing cabinets) ──
  const colAligned = cabinets.filter((c) => !isRowAligned(c.facing))
  if (colAligned.length >= 2) {
    const colMap = new Map<number, Cabinet[]>()
    for (const cab of colAligned) {
      const list = colMap.get(cab.col) ?? []
      list.push(cab)
      colMap.set(cab.col, list)
    }
    const cols = [...colMap.keys()].sort((a, b) => a - b)
    for (let i = 0; i < cols.length - 1; i++) {
      const thisCol = colMap.get(cols[i])!
      const nextCol = colMap.get(cols[i + 1])!
      const gap = cols[i + 1] - cols[i]

      const thisFacingEast = thisCol.every((c) => c.facing === 'east')
      const nextFacingWest = nextCol.every((c) => c.facing === 'west')
      const pattern1 = thisFacingEast && nextFacingWest

      const thisFacingWest = thisCol.every((c) => c.facing === 'west')
      const nextFacingEast = nextCol.every((c) => c.facing === 'east')
      const pattern2 = thisFacingWest && nextFacingEast

      if (pattern1 || pattern2) {
        bonus += gap >= 2 ? SPACING_CONFIG.properAisleBonusPerPair : SPACING_CONFIG.narrowAisleBonusPerPair
      }
    }
  }

  return Math.min(SPACING_CONFIG.maxAisleSpacingBonus, bonus)
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
    // Check if the tile is within grid bounds
    if (dir.col < 0 || dir.col >= gridCols || dir.row < 0 || dir.row >= gridRows) continue
    // Check if the tile is empty (no cabinet there)
    const occupied = cabinets.some((c) => c.col === dir.col && c.row === dir.row)
    if (!occupied) return true
  }
  return false
}

/** Calculate spacing heat effect for a cabinet (penalty from adjacent cabinets, bonus from open faces).
 *  Returns a net °C/tick adjustment (positive = more heat, negative = better cooling). */
export function calcSpacingHeatEffect(cab: Cabinet, cabinets: Cabinet[]): number {
  if (!cab.powerStatus) return 0

  const adjacent = getAdjacentCabinets(cab, cabinets)
  let effect = 0

  // Adjacent heat penalty: each neighboring cabinet traps hot air
  effect += adjacent.length * SPACING_CONFIG.adjacentHeatPenalty

  // Surrounded penalty: 3+ neighbors means severely restricted airflow
  if (adjacent.length >= 3) {
    effect += SPACING_CONFIG.surroundedHeatBonus
  }

  // Airflow bonus: cabinet's intake (front) or exhaust (rear) facing an empty tile
  const offsets = getFacingOffsets(cab.facing, cab.col, cab.row)
  const frontOccupied = cabinets.some((c) => c.col === offsets.front.col && c.row === offsets.front.row)
  const rearOccupied = cabinets.some((c) => c.col === offsets.rear.col && c.row === offsets.rear.row)

  if (!frontOccupied) effect -= SPACING_CONFIG.openFrontCoolingBonus
  if (!rearOccupied) effect -= SPACING_CONFIG.openRearCoolingBonus

  return effect
}

/** Count how many rows/columns violate aisle layout (mixed facing in the same row/column).
 *  N/S cabinets in the same row should all face the same direction.
 *  E/W cabinets in the same column should all face the same direction.
 *  Mixing N/S and E/W in the same row or column is also a violation. */
export function countAisleViolations(cabinets: Cabinet[]): number {
  // Check rows: all cabinets in a row should face the same N/S direction (or all be E/W-aligned)
  const rowMap = new Map<number, Set<CabinetFacing>>()
  for (const cab of cabinets) {
    const facings = rowMap.get(cab.row) ?? new Set()
    facings.add(cab.facing)
    rowMap.set(cab.row, facings)
  }
  let violations = 0
  for (const facings of rowMap.values()) {
    if (facings.size > 1) violations++
  }
  // Check columns: all E/W cabinets in a column should face the same direction
  const colMap = new Map<number, Set<CabinetFacing>>()
  for (const cab of cabinets.filter((c) => !isRowAligned(c.facing))) {
    const facings = colMap.get(cab.col) ?? new Set()
    facings.add(cab.facing)
    colMap.set(cab.col, facings)
  }
  for (const facings of colMap.values()) {
    if (facings.size > 1) violations++
  }
  return violations
}

/** Check how many cable runs are not routed through trays */
export function countMessyCables(cableRuns: CableRun[]): number {
  return cableRuns.filter((c) => !c.usesTrays).length
}

// ── Zone Adjacency Bonus ────────────────────────────────────────

export interface Zone {
  id: string
  type: 'environment' | 'customer'
  key: CabinetEnvironment | CustomerType       // which env or customer type
  cabinetIds: string[]                          // cabinet IDs in this zone
  tiles: { col: number; row: number }[]         // tile positions for rendering
  bonus: number                                 // revenue/heat multiplier bonus (0–1)
}

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

/** Find connected clusters of cabinets sharing the same key using flood-fill adjacency */
function findClusters(cabinets: Cabinet[], keyFn: (c: Cabinet) => string): Map<string, Cabinet[][]> {
  const result = new Map<string, Cabinet[][]>()
  const visited = new Set<string>()

  // Build a lookup map: "col,row" → cabinet
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

    // BFS flood-fill for adjacent (4-directional) cabinets with same key
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

  // Environment zones
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

  // Customer type zones (only among production cabinets — lab/mgmt don't serve customers)
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

// ── Existing Constants ────────────────────────────────────────────

export const DEFAULT_COLORS: Record<NodeType, LayerColors> = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

export const MAX_SERVERS_PER_CABINET = 4
// These are the absolute max (enterprise tier). Per-suite limits enforced via getSuiteConfig().
export const MAX_CABINETS = 50
export const MAX_SPINES = 8

/** Get the effective limits for a given suite tier */
export function getSuiteLimits(tier: SuiteTier) {
  const config = SUITE_TIERS[tier]
  return { maxCabinets: config.maxCabinets, maxSpines: config.maxSpines, cols: config.cols, rows: config.rows }
}

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
  gbpsPerServer: 1,         // each active server generates 1 Gbps of east-west traffic (at 1.0x demand)
  linkCapacityGbps: 10,     // each leaf→spine uplink is 10 Gbps
}

export { TRAFFIC }

// ── Insurance System Types ──────────────────────────────────────

export type InsurancePolicyType = 'fire_insurance' | 'power_insurance' | 'cyber_insurance' | 'equipment_insurance'

export interface InsurancePolicyConfig {
  type: InsurancePolicyType
  label: string
  description: string
  premiumPerTick: number
  coverageAmount: number
  coveredEffects: string[]
}

export const INSURANCE_OPTIONS: InsurancePolicyConfig[] = [
  { type: 'fire_insurance', label: 'Fire Insurance', description: 'Covers equipment damage from fire events. Pays out when fire suppression activates.', premiumPerTick: 3, coverageAmount: 15000, coveredEffects: ['heat_spike'] },
  { type: 'power_insurance', label: 'Power Insurance', description: 'Covers losses from power surges and outages. Reduced outage revenue penalty.', premiumPerTick: 4, coverageAmount: 10000, coveredEffects: ['power_surge'] },
  { type: 'cyber_insurance', label: 'Cyber Insurance', description: 'Covers revenue loss from cyber incidents. Faster recovery from DDoS and ransomware.', premiumPerTick: 5, coverageAmount: 20000, coveredEffects: ['revenue_penalty'] },
  { type: 'equipment_insurance', label: 'Equipment Insurance', description: 'Covers cooling system failures. Reduces heat impact from cooling incidents.', premiumPerTick: 3, coverageAmount: 12000, coveredEffects: ['cooling_failure'] },
]

// ── DR Drill Types ──────────────────────────────────────────────

export interface DrillResult {
  passed: boolean
  score: number
  findings: string[]
  tick: number
}

export const DRILL_CONFIG = {
  cost: 2000,
  cooldownTicks: 100,
  passThreshold: 60,
  reputationBonus: 3,
  reputationPenalty: -2,
}

// ── Stock Price / Valuation Types ────────────────────────────────

export interface ValuationMilestone {
  id: string
  label: string
  targetPrice: number
  reward: number
}

export const VALUATION_MILESTONES: ValuationMilestone[] = [
  { id: 'ipo', label: 'IPO', targetPrice: 50, reward: 10000 },
  { id: 'growth', label: 'Growth Stock', targetPrice: 100, reward: 25000 },
  { id: 'blue_chip', label: 'Blue Chip', targetPrice: 250, reward: 50000 },
  { id: 'mega_cap', label: 'Mega Cap', targetPrice: 500, reward: 100000 },
  { id: 'trillion', label: 'Trillion Dollar Club', targetPrice: 1000, reward: 250000 },
]

// ── Patent System Types ─────────────────────────────────────────

export interface Patent {
  techId: string
  label: string
  incomePerTick: number
  grantedAtTick: number
}

export const PATENT_CONFIG = {
  cost: 5000,
  incomePerTick: 8,
  maxPatents: 9,
}

// ── RFP Bidding Types ───────────────────────────────────────────

export interface RFPOffer {
  id: string
  def: ContractDef
  bidWindowTicks: number
  competitorName: string
  competitorStrength: number
}

export const RFP_CONFIG = {
  offerInterval: 80,
  bidWindowTicks: 15,
  competitorNames: ['NexGen Data', 'CloudVault Inc', 'TerraHost', 'IronCloud', 'DataForge'],
}

let nextRFPId = 1

// ── Infrastructure Entity Types ─────────────────────────────────

export interface Busway {
  id: string
  col: number
  row: number
  capacityKW: number
  label: string
}

export interface BuswayConfig {
  label: string
  cost: number
  capacityKW: number
  range: number
  description: string
}

export const BUSWAY_OPTIONS: BuswayConfig[] = [
  { label: 'Light Busway', cost: 5000, capacityKW: 20, range: 3, description: 'Overhead busway for light power distribution. Serves nearby cabinets.' },
  { label: 'Medium Busway', cost: 12000, capacityKW: 50, range: 4, description: 'Standard overhead busway. Good coverage and capacity.' },
  { label: 'Heavy Busway', cost: 25000, capacityKW: 120, range: 5, description: 'Heavy-duty overhead busway. Maximum power distribution for dense deployments.' },
]

export interface CrossConnect {
  id: string
  col: number
  row: number
  portCount: number
  label: string
}

export interface CrossConnectConfig {
  label: string
  cost: number
  portCount: number
  bandwidthBonus: number
  description: string
}

export const CROSSCONNECT_OPTIONS: CrossConnectConfig[] = [
  { label: 'Small Patch Panel', cost: 2000, portCount: 12, bandwidthBonus: 0.05, description: 'Basic cross-connect with 12 ports. Improves local traffic routing.' },
  { label: 'Medium Patch Panel', cost: 5000, portCount: 24, bandwidthBonus: 0.10, description: 'Standard patch panel with 24 ports. Better traffic optimization.' },
  { label: 'HD Patch Panel', cost: 10000, portCount: 48, bandwidthBonus: 0.15, description: 'High-density panel with 48 ports. Maximum network optimization.' },
]

export interface InRowCooling {
  id: string
  col: number
  row: number
  coolingBonus: number
  label: string
}

export interface InRowCoolingConfig {
  label: string
  cost: number
  coolingBonus: number
  range: number
  description: string
}

export const INROW_COOLING_OPTIONS: InRowCoolingConfig[] = [
  { label: 'Small In-Row Unit', cost: 8000, coolingBonus: 1.0, range: 1, description: 'Compact in-row cooling unit. Provides targeted cooling to adjacent cabinets.' },
  { label: 'Standard In-Row Unit', cost: 18000, coolingBonus: 2.0, range: 2, description: 'Standard in-row cooling. Good cooling radius for mid-size deployments.' },
  { label: 'High-Capacity In-Row', cost: 35000, coolingBonus: 3.5, range: 3, description: 'Enterprise in-row cooling with maximum capacity and wide coverage.' },
]

// ── Scenario Challenge Types ────────────────────────────────────

export interface ScenarioDef {
  id: string
  label: string
  description: string
  startingMoney: number
  objectives: ScenarioObjective[]
  specialRules: string[]
}

export interface ScenarioObjective {
  id: string
  description: string
  type: 'money' | 'cabinets' | 'revenue' | 'pue' | 'reputation' | 'contracts' | 'temperature' | 'ticks'
  target: number
  comparison: 'gte' | 'lte'
}

export const SCENARIO_CATALOG: ScenarioDef[] = [
  {
    id: 'disaster_recovery',
    label: 'Disaster Recovery',
    description: 'Your facility was hit by a major disaster. Rebuild from the ashes with limited funds and restore service.',
    startingMoney: 15000,
    objectives: [
      { id: 'dr_cabs', description: 'Deploy 8 cabinets', type: 'cabinets', target: 8, comparison: 'gte' },
      { id: 'dr_money', description: 'Accumulate $100,000', type: 'money', target: 100000, comparison: 'gte' },
      { id: 'dr_rep', description: 'Reach Good reputation', type: 'reputation', target: 50, comparison: 'gte' },
    ],
    specialRules: ['Incidents spawn 2x more frequently', 'Starting reputation: 10'],
  },
  {
    id: 'green_facility',
    label: 'Zero Emission Facility',
    description: 'Build a data center with the lowest possible PUE. Efficiency is everything.',
    startingMoney: 80000,
    objectives: [
      { id: 'green_pue', description: 'Achieve PUE of 1.20 or lower', type: 'pue', target: 1.20, comparison: 'lte' },
      { id: 'green_cabs', description: 'Run 15 cabinets', type: 'cabinets', target: 15, comparison: 'gte' },
      { id: 'green_temp', description: 'Keep avg temp below 40°C', type: 'temperature', target: 40, comparison: 'lte' },
    ],
    specialRules: ['Air cooling only — water cooling disabled', 'Heat generation +25%'],
  },
  {
    id: 'black_friday',
    label: 'Black Friday Surge',
    description: 'Handle a massive traffic surge during the biggest shopping day of the year. Keep SLAs or lose everything.',
    startingMoney: 60000,
    objectives: [
      { id: 'bf_contracts', description: 'Complete 3 contracts', type: 'contracts', target: 3, comparison: 'gte' },
      { id: 'bf_revenue', description: 'Earn $500/tick revenue', type: 'revenue', target: 500, comparison: 'gte' },
      { id: 'bf_survive', description: 'Survive 200 ticks', type: 'ticks', target: 200, comparison: 'gte' },
    ],
    specialRules: ['Demand multiplier permanently +0.5', 'Contract SLAs are 20% stricter'],
  },
  {
    id: 'budget_build',
    label: 'Bootstrapped',
    description: 'Start with almost nothing and build an empire. Every dollar counts.',
    startingMoney: 8000,
    objectives: [
      { id: 'bb_money', description: 'Accumulate $500,000', type: 'money', target: 500000, comparison: 'gte' },
      { id: 'bb_cabs', description: 'Deploy 20 cabinets', type: 'cabinets', target: 20, comparison: 'gte' },
      { id: 'bb_contracts', description: 'Complete 5 contracts', type: 'contracts', target: 5, comparison: 'gte' },
    ],
    specialRules: ['No loans available', 'Equipment costs +50%'],
  },
  {
    id: 'speed_run',
    label: 'Speed Run',
    description: 'Reach enterprise tier as fast as possible. Time is money — literally.',
    startingMoney: 50000,
    objectives: [
      { id: 'sr_suite', description: 'Reach Enterprise suite', type: 'cabinets', target: 50, comparison: 'gte' },
      { id: 'sr_ticks', description: 'Complete within 500 ticks', type: 'ticks', target: 500, comparison: 'lte' },
    ],
    specialRules: ['Revenue +50%', 'Incident frequency doubled'],
  },
]

// ── Network Topology Types ──────────────────────────────────────

export interface NetworkLink {
  id: string
  sourceId: string
  targetId: string
  sourceType: 'leaf' | 'spine'
  targetType: 'leaf' | 'spine'
  bandwidthGbps: number
  capacityGbps: number
  utilization: number
  healthy: boolean
}

export interface NetworkTopologyStats {
  totalLinks: number
  healthyLinks: number
  oversubscriptionRatio: number
  avgUtilization: number
  redundancyLevel: number
}

// ── Time-of-Day / Demand Constants ──────────────────────────────

/** Minutes of in-game time that pass per tick (96 ticks = 1 full day) */
const MINUTES_PER_TICK = 15

/** Chance per tick of a random traffic spike starting (when none is active) */
const SPIKE_CHANCE = 0.05

/** Duration range for a traffic spike (in ticks) */
const SPIKE_MIN_TICKS = 3
const SPIKE_MAX_TICKS = 8

/** Magnitude range of a traffic spike (additive on top of base demand) */
const SPIKE_MIN_MAG = 0.2
const SPIKE_MAX_MAG = 0.5

/**
 * Base demand curve: [hour, multiplier] pairs (linearly interpolated).
 * Models a typical data center traffic pattern:
 * - Quiet overnight (0.25x–0.3x)
 * - Morning ramp-up
 * - Business hours plateau (~0.9x–1.0x)
 * - Evening peak (~1.3x–1.4x) driven by streaming/consumer traffic
 * - Late-night decline
 */
const DEMAND_CURVE: [number, number][] = [
  [0, 0.30],
  [5, 0.25],
  [7, 0.60],
  [9, 0.85],
  [12, 0.95],
  [15, 1.10],
  [18, 1.30],
  [20, 1.40],
  [21, 1.20],
  [23, 0.50],
  [24, 0.30],
]

/** Interpolate the base demand multiplier for a given hour (0–24) */
function baseDemand(hour: number): number {
  const h = ((hour % 24) + 24) % 24 // normalise to 0–24
  for (let i = 0; i < DEMAND_CURVE.length - 1; i++) {
    const [h0, d0] = DEMAND_CURVE[i]
    const [h1, d1] = DEMAND_CURVE[i + 1]
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0)
      return d0 + t * (d1 - d0)
    }
  }
  return DEMAND_CURVE[0][1]
}

/** Format a game hour (float 0–24) as "HH:MM" */
export function formatGameTime(hour: number): string {
  const h = ((Math.floor(hour) % 24) + 24) % 24
  const m = Math.floor((hour % 1) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export { MINUTES_PER_TICK }

/** Calculate traffic flows across the leaf-spine fabric */
function calcTraffic(cabinets: Cabinet[], spines: SpineSwitch[], demandMultiplier = 1): TrafficStats {
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
  mgmtBonus: number       // management cooling bonus (0–0.30)

  // Simulation
  gameSpeed: GameSpeed
  tickCount: number
  revenue: number         // revenue earned last tick
  expenses: number        // total expenses last tick
  powerCost: number       // power portion of expenses
  coolingCost: number     // cooling portion of expenses

  // Cooling
  coolingType: CoolingType

  // Loans
  loans: Loan[]
  loanPayments: number    // total loan payments last tick

  // Incidents
  activeIncidents: ActiveIncident[]
  incidentLog: string[]   // recent incident messages
  resolvedCount: number   // total incidents resolved (for achievements)

  // Achievements
  achievements: Achievement[]
  newAchievement: Achievement | null  // most recently unlocked (for toast)

  // Contracts
  contractOffers: ContractDef[]        // available contracts to accept
  activeContracts: ActiveContract[]    // accepted contracts
  contractLog: string[]                // recent contract messages
  contractRevenue: number              // contract bonus revenue last tick
  contractPenalties: number            // contract penalties last tick
  completedContracts: number           // total contracts completed successfully

  // Visual
  layerVisibility: LayerVisibility
  layerOpacity: LayerOpacity
  layerColors: LayerColorOverrides

  // Traffic
  trafficStats: TrafficStats
  trafficVisible: boolean

  // Time-of-day / demand
  gameHour: number              // 0–24 float, current in-game time
  demandMultiplier: number      // effective demand (base curve + spike), affects traffic
  spikeActive: boolean          // whether a random traffic spike is in progress
  spikeTicks: number            // ticks remaining on current spike
  spikeMagnitude: number        // additive demand from current spike

  // Backup Generators
  generators: Generator[]
  generatorFuelCost: number     // fuel cost last tick
  powerOutage: boolean          // whether a grid power outage is active
  outageTicksRemaining: number  // ticks remaining on current outage

  // Fire Suppression
  suppressionType: SuppressionType
  fireActive: boolean           // whether a fire event is in progress
  fireDamageTaken: number       // total $ of equipment damage from fires

  // Tech Tree
  unlockedTech: string[]         // IDs of researched technologies
  activeResearch: ActiveResearch | null
  rdSpent: number                // total R&D investment for stats

  // Reputation
  reputationScore: number        // 0–100
  uptimeTicks: number            // ticks with all SLAs met
  totalOperatingTicks: number    // total ticks with equipment running

  // Spot Power Pricing
  powerPriceMultiplier: number   // current market rate multiplier (around 1.0)
  powerPriceSpikeActive: boolean
  powerPriceSpikeTicks: number

  // Hardware Depreciation
  totalRefreshes: number         // total server refreshes done

  // Suite / Facility
  suiteTier: SuiteTier           // current facility tier

  // Infrastructure Layout
  pdus: PDU[]                                 // placed power distribution units
  cableTrays: CableTray[]                     // placed cable trays
  cableRuns: CableRun[]                       // structured cable connections
  aisleBonus: number                          // current hot/cold aisle cooling bonus (0–0.25)
  aisleViolations: number                     // number of rows with mixed facings
  messyCableCount: number                     // cables not routed through trays
  pduOverloaded: boolean                      // whether any PDU is overloaded
  infraIncidentBonus: number                  // extra incident chance from messy cables

  // Zone adjacency bonuses
  zones: Zone[]                               // active zones from cabinet clustering
  zoneBonusRevenue: number                    // total zone revenue bonus last tick

  // Cabinet selection
  selectedCabinetId: string | null            // currently selected cabinet (clicked in canvas)

  // Placement mode
  placementMode: boolean                      // whether user is in placement mode
  placementEnvironment: CabinetEnvironment    // selected environment for next placement
  placementCustomerType: CustomerType         // selected customer type for next placement
  placementFacing: CabinetFacing              // selected facing for next placement

  // Insurance
  insurancePolicies: InsurancePolicyType[]    // active insurance policies
  insuranceCost: number                       // insurance premiums last tick
  insurancePayouts: number                    // total lifetime payouts received

  // DR Drills
  drillCooldown: number                       // ticks until next drill allowed
  lastDrillResult: DrillResult | null         // result of last drill
  drillsCompleted: number                     // total drills completed
  drillsPassed: number                        // total drills passed

  // Stock Price / Valuation
  stockPrice: number                          // current stock price
  stockHistory: number[]                      // recent stock prices (last 50 ticks)
  valuationMilestonesReached: string[]        // IDs of reached milestones

  // Patent System
  patents: Patent[]                           // held patents
  patentIncome: number                        // patent royalty income last tick

  // RFP Bidding
  rfpOffers: RFPOffer[]                       // available RFP offers
  rfpsWon: number                             // total RFPs won
  rfpsLost: number                            // total RFPs lost

  // Infrastructure Entities
  busways: Busway[]
  crossConnects: CrossConnect[]
  inRowCoolers: InRowCooling[]

  // Sandbox Mode
  sandboxMode: boolean

  // Scenario System
  activeScenario: ScenarioDef | null
  scenarioProgress: Record<string, boolean>   // objective ID → completed
  scenariosCompleted: string[]                // IDs of completed scenarios

  // Network Topology
  networkTopology: NetworkTopologyStats

  // Staff & HR
  staff: StaffMember[]
  shiftPattern: ShiftPattern
  trainingQueue: StaffTraining[]
  staffCostPerTick: number          // total staff salaries + shift overhead
  staffIncidentsResolved: number    // lifetime count without burnout (for achievement)
  staffBurnouts: number             // lifetime burnout count

  // Heat Map
  heatMapVisible: boolean

  // Supply Chain & Procurement
  pendingOrders: HardwareOrder[]
  inventory: Record<string, number>
  supplyShortageActive: boolean
  shortagePriceMultiplier: number
  shortageTicksRemaining: number

  // Weather System
  currentSeason: Season
  currentCondition: WeatherCondition
  weatherAmbientModifier: number
  weatherConditionTicksRemaining: number
  seasonTickCounter: number
  seasonsExperienced: Season[]

  // Interconnection / Meet-Me Room
  meetMeRoomTier: number | null
  interconnectPorts: InterconnectPort[]
  meetMeRevenue: number
  meetMeMaintenanceCost: number

  // Custom Server Configurations
  defaultServerConfig: ServerConfig

  // Network Peering & Transit
  peeringAgreements: PeeringAgreement[]
  peeringCostPerTick: number
  avgLatencyMs: number

  // Maintenance Windows
  maintenanceWindows: MaintenanceWindow[]
  maintenanceCompletedCount: number
  maintenanceCoolingBoostTicks: number

  // Power Redundancy
  powerRedundancy: PowerRedundancy
  powerRedundancyCost: number

  // Noise & Community Relations
  noiseLevel: number
  communityRelations: number
  noiseComplaints: number
  noiseFinesAccumulated: number
  soundBarriersInstalled: number
  zoningRestricted: boolean

  // Spot Compute Market
  spotPriceMultiplier: number
  spotCapacityAllocated: number
  spotRevenue: number
  spotDemand: number
  spotHistoryPrices: number[]

  // Event Log
  eventLog: EventLogEntry[]
  eventLogFilterCategory: EventCategory | null

  // Capacity Planning
  capacityHistory: HistoryPoint[]

  // Lifetime Statistics
  lifetimeStats: LifetimeStats

  // Tutorial System
  seenTips: string[]
  activeTip: TutorialTip | null
  tutorialEnabled: boolean

  // Phase 4B — Carbon & Environmental
  energySource: EnergySource
  carbonEmissionsPerTick: number
  lifetimeCarbonEmissions: number
  carbonTaxRate: number
  carbonTaxPerTick: number
  greenCertifications: GreenCert[]
  greenCertEligibleTicks: number        // consecutive ticks meeting current cert requirements
  waterUsagePerTick: number
  waterCostPerTick: number
  eWasteStockpile: number
  eWasteDisposed: number                // lifetime proper disposals
  droughtActive: boolean

  // Phase 4C — Security & Compliance
  securityTier: SecurityTier
  installedSecurityFeatures: SecurityFeatureId[]
  complianceCerts: ActiveComplianceCert[]
  securityMaintenanceCost: number
  intrusionsBlocked: number
  auditCooldown: number

  // Phase 4D — Competitor AI
  competitors: Competitor[]
  competitorBids: CompetitorBid[]
  playerMarketShare: number
  competitorContractsWon: number        // contracts won against competitor bids
  competitorContractsLost: number
  competitorOutperformTicks: number     // consecutive ticks outperforming all competitors
  priceWarActive: boolean
  priceWarTicksRemaining: number
  poachTarget: string | null            // staff ID being poached

  // Operations Progression
  opsTier: OpsTier
  opsAutoResolvedCount: number          // lifetime incidents auto-resolved by ops automation
  opsPreventedCount: number             // lifetime incidents prevented by ops automation

  // Save / Load
  hasSaved: boolean
  activeSlotId: number | null
  saveSlots: SaveSlotMeta[]

  // Demo mode
  isDemo: boolean

  // Actions
  selectCabinet: (id: string | null) => void
  addCabinet: (col: number, row: number, environment: CabinetEnvironment, customerType?: CustomerType, facing?: CabinetFacing) => void
  enterPlacementMode: (environment: CabinetEnvironment, customerType: CustomerType, facing?: CabinetFacing) => void
  exitPlacementMode: () => void
  togglePlacementFacing: () => void
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
  upgradeCooling: (type: CoolingType) => void
  takeLoan: (optionIndex: number) => void
  resolveIncident: (id: string) => void
  acceptContract: (index: number) => void
  dismissAchievement: () => void
  buyGenerator: (optionIndex: number) => void
  activateGenerator: (id: string) => void
  upgradeSuppression: (type: SuppressionType) => void
  startResearch: (techId: string) => void
  refreshServers: (cabinetId: string) => void
  upgradeSuite: (tier: SuiteTier) => void
  // Infrastructure actions
  placePDU: (col: number, row: number, optionIndex: number) => void
  placeCableTray: (col: number, row: number, optionIndex: number) => void
  autoRouteCables: () => void
  toggleCabinetFacing: (cabinetId: string) => void
  // Insurance actions
  buyInsurance: (type: InsurancePolicyType) => void
  cancelInsurance: (type: InsurancePolicyType) => void
  // DR Drill actions
  runDrill: () => void
  // Patent actions
  patentTech: (techId: string) => void
  // RFP actions
  bidOnRFP: (rfpId: string) => void
  // Infrastructure entity actions
  placeBusway: (col: number, row: number, optionIndex: number) => void
  placeCrossConnect: (col: number, row: number, optionIndex: number) => void
  placeInRowCooling: (col: number, row: number, optionIndex: number) => void
  // Sandbox mode
  toggleSandboxMode: () => void
  // Scenario actions
  startScenario: (scenarioId: string) => void
  abandonScenario: () => void
  // Staff & HR actions
  hireStaff: (role: StaffRole, skillLevel: StaffSkillLevel) => void
  fireStaff: (staffId: string) => void
  setShiftPattern: (pattern: ShiftPattern) => void
  startTraining: (staffId: string, certId: string) => void
  // Heat map
  toggleHeatMap: () => void
  // Supply Chain actions
  placeOrder: (itemType: string, quantity: number) => void
  // Interconnection actions
  installMeetMeRoom: (tier: number) => void
  addInterconnectPort: (portType: InterconnectPortType) => void
  // Server config actions
  setDefaultServerConfig: (config: ServerConfig) => void
  // Peering actions
  addPeeringAgreement: (optionIndex: number) => void
  removePeeringAgreement: (id: string) => void
  // Maintenance actions
  scheduleMaintenance: (targetType: MaintenanceTargetType, targetId: string) => void
  // Power redundancy actions
  upgradePowerRedundancy: (level: PowerRedundancy) => void
  // Noise actions
  installSoundBarrier: () => void
  // Spot compute actions
  setSpotCapacity: (count: number) => void
  // Phase 4B — Carbon & Environmental actions
  setEnergySource: (source: EnergySource) => void
  applyForGreenCert: (certId: GreenCert) => void
  disposeEWaste: (proper: boolean) => void
  // Phase 4C — Security & Compliance actions
  upgradeSecurityTier: (tier: SecurityTier) => void
  startComplianceAudit: (certId: ComplianceCertId) => void
  // Phase 4D — Competitor AI actions
  counterPoachOffer: () => void
  // Operations Progression actions
  upgradeOpsTier: () => void
  // Tutorial actions
  dismissTip: (tipId: string) => void
  toggleTutorial: () => void
  // Demo
  loadDemoState: () => void
  exitDemo: () => void
  // Save / Load
  saveGame: (slotId: number, name?: string) => void
  loadGame: (slotId: number) => boolean
  deleteGame: (slotId: number) => void
  resetGame: () => void
  refreshSaveSlots: () => void
  tick: () => void
}

let nextCabId = 1
let nextSpineId = 1
let nextLoanId = 1
let nextIncidentId = 1
let nextContractId = 1
let nextGeneratorId = 1
let nextStaffId = 1
let nextCompetitorId = 1

function maxIdNum(items: { id: string }[], prefix: string): number {
  let max = 0
  for (const item of items) {
    const n = parseInt(item.id.replace(prefix, ''), 10)
    if (n > max) max = n
  }
  return max
}

function restoreIdCounters(data: Record<string, unknown>) {
  const cabinets = (data.cabinets ?? []) as { id: string }[]
  const spines = (data.spineSwitches ?? []) as { id: string }[]
  const loans = (data.loans ?? []) as { id: string }[]
  const generators = (data.generators ?? []) as { id: string }[]
  nextCabId = maxIdNum(cabinets, 'cab-') + 1
  nextSpineId = maxIdNum(spines, 'spine-') + 1
  nextLoanId = maxIdNum(loans, 'loan-') + 1
  nextGeneratorId = maxIdNum(generators, 'gen-') + 1
  nextIncidentId = 1
  nextContractId = 1
}

export const useGameStore = create<GameState>((set) => ({
  cabinets: [],
  spineSwitches: [],
  totalPower: 0,
  coolingPower: 0,
  money: 50000,
  pue: 0,
  avgHeat: SIM.ambientTemp,
  mgmtBonus: 0,

  // Simulation
  gameSpeed: 1,
  tickCount: 0,
  revenue: 0,
  expenses: 0,
  powerCost: 0,
  coolingCost: 0,

  // Cooling
  coolingType: 'air',

  // Loans
  loans: [],
  loanPayments: 0,

  // Incidents
  activeIncidents: [],
  incidentLog: [],
  resolvedCount: 0,

  // Achievements
  achievements: [],
  newAchievement: null,

  // Contracts
  contractOffers: [],
  activeContracts: [],
  contractLog: [],
  contractRevenue: 0,
  contractPenalties: 0,
  completedContracts: 0,

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

  // Time-of-day / demand
  gameHour: 8,                // start at 8:00 AM
  demandMultiplier: baseDemand(8),
  spikeActive: false,
  spikeTicks: 0,
  spikeMagnitude: 0,

  // Backup Generators
  generators: [],
  generatorFuelCost: 0,
  powerOutage: false,
  outageTicksRemaining: 0,

  // Fire Suppression
  suppressionType: 'none' as SuppressionType,
  fireActive: false,
  fireDamageTaken: 0,

  // Tech Tree
  unlockedTech: [],
  activeResearch: null,
  rdSpent: 0,

  // Reputation
  reputationScore: 20,         // start as "unknown" tier
  uptimeTicks: 0,
  totalOperatingTicks: 0,

  // Spot Power Pricing
  powerPriceMultiplier: 1.0,
  powerPriceSpikeActive: false,
  powerPriceSpikeTicks: 0,

  // Hardware Depreciation
  totalRefreshes: 0,

  // Suite / Facility
  suiteTier: 'starter' as SuiteTier,

  // Infrastructure Layout
  pdus: [],
  cableTrays: [],
  cableRuns: [],
  aisleBonus: 0,
  aisleViolations: 0,
  messyCableCount: 0,
  pduOverloaded: false,
  infraIncidentBonus: 0,

  // Zone adjacency bonuses
  zones: [],
  zoneBonusRevenue: 0,

  // Cabinet selection
  selectedCabinetId: null,

  // Placement mode
  placementMode: false,
  placementEnvironment: 'production' as CabinetEnvironment,
  placementCustomerType: 'general' as CustomerType,
  placementFacing: 'north' as CabinetFacing,

  // Insurance
  insurancePolicies: [],
  insuranceCost: 0,
  insurancePayouts: 0,

  // DR Drills
  drillCooldown: 0,
  lastDrillResult: null,
  drillsCompleted: 0,
  drillsPassed: 0,

  // Stock Price / Valuation
  stockPrice: 10,
  stockHistory: [10],
  valuationMilestonesReached: [],

  // Patent System
  patents: [],
  patentIncome: 0,

  // RFP Bidding
  rfpOffers: [],
  rfpsWon: 0,
  rfpsLost: 0,

  // Infrastructure Entities
  busways: [],
  crossConnects: [],
  inRowCoolers: [],

  // Sandbox Mode
  sandboxMode: false,

  // Scenario System
  activeScenario: null,
  scenarioProgress: {},
  scenariosCompleted: [],

  // Network Topology
  networkTopology: { totalLinks: 0, healthyLinks: 0, oversubscriptionRatio: 0, avgUtilization: 0, redundancyLevel: 0 },

  // Staff & HR
  staff: [],
  shiftPattern: 'day_only' as ShiftPattern,
  trainingQueue: [],
  staffCostPerTick: 0,
  staffIncidentsResolved: 0,
  staffBurnouts: 0,

  // Heat Map
  heatMapVisible: false,

  // Supply Chain & Procurement
  pendingOrders: [],
  inventory: { server: 0, leaf_switch: 0, spine_switch: 0, cabinet: 0 },
  supplyShortageActive: false,
  shortagePriceMultiplier: 1.0,
  shortageTicksRemaining: 0,

  // Weather System
  currentSeason: 'spring' as Season,
  currentCondition: 'clear' as WeatherCondition,
  weatherAmbientModifier: 2,
  weatherConditionTicksRemaining: 15,
  seasonTickCounter: 0,
  seasonsExperienced: ['spring'] as Season[],

  // Interconnection / Meet-Me Room
  meetMeRoomTier: null,
  interconnectPorts: [],
  meetMeRevenue: 0,
  meetMeMaintenanceCost: 0,

  // Custom Server Configurations
  defaultServerConfig: 'balanced' as ServerConfig,

  // Network Peering & Transit
  peeringAgreements: [],
  peeringCostPerTick: 0,
  avgLatencyMs: 50,

  // Maintenance Windows
  maintenanceWindows: [],
  maintenanceCompletedCount: 0,
  maintenanceCoolingBoostTicks: 0,

  // Power Redundancy
  powerRedundancy: 'N' as PowerRedundancy,
  powerRedundancyCost: 0,

  // Noise & Community Relations
  noiseLevel: 0,
  communityRelations: 80,
  noiseComplaints: 0,
  noiseFinesAccumulated: 0,
  soundBarriersInstalled: 0,
  zoningRestricted: false,

  // Spot Compute Market
  spotPriceMultiplier: 1.0,
  spotCapacityAllocated: 0,
  spotRevenue: 0,
  spotDemand: 0.5,
  spotHistoryPrices: [1.0],

  // Event Log
  eventLog: [],
  eventLogFilterCategory: null,

  // Capacity Planning
  capacityHistory: [],

  // Lifetime Statistics
  lifetimeStats: {
    totalRevenueEarned: 0, totalExpensesPaid: 0, totalIncidentsSurvived: 0,
    totalServersDeployed: 0, totalSpinesDeployed: 0, peakTemperatureReached: 22,
    longestUptimeStreak: 0, currentUptimeStreak: 0, totalFiresSurvived: 0,
    totalPowerOutages: 0, totalContractsCompleted: 0, totalContractsTerminated: 0,
    peakRevenueTick: 0, peakCabinetCount: 0, totalMoneyEarned: 0,
  },

  // Tutorial System
  seenTips: [],
  activeTip: null,
  tutorialEnabled: true,

  // Phase 4B — Carbon & Environmental
  energySource: 'grid_mixed' as EnergySource,
  carbonEmissionsPerTick: 0,
  lifetimeCarbonEmissions: 0,
  carbonTaxRate: 0,
  carbonTaxPerTick: 0,
  greenCertifications: [] as GreenCert[],
  greenCertEligibleTicks: 0,
  waterUsagePerTick: 0,
  waterCostPerTick: 0,
  eWasteStockpile: 0,
  eWasteDisposed: 0,
  droughtActive: false,

  // Phase 4C — Security & Compliance
  securityTier: 'basic' as SecurityTier,
  installedSecurityFeatures: ['badge_access'] as SecurityFeatureId[],
  complianceCerts: [] as ActiveComplianceCert[],
  securityMaintenanceCost: 0,
  intrusionsBlocked: 0,
  auditCooldown: 0,

  // Phase 4D — Competitor AI
  competitors: [] as Competitor[],
  competitorBids: [] as CompetitorBid[],
  playerMarketShare: 100,
  competitorContractsWon: 0,
  competitorContractsLost: 0,
  competitorOutperformTicks: 0,
  priceWarActive: false,
  priceWarTicksRemaining: 0,
  poachTarget: null as string | null,

  // Operations Progression
  opsTier: 'manual' as OpsTier,
  opsAutoResolvedCount: 0,
  opsPreventedCount: 0,

  // Demo mode
  isDemo: false,

  // Save / Load
  hasSaved: false,
  activeSlotId: null,
  saveSlots: getSaveIndex(),

  // ── Cabinet Selection ────────────────────────────────────────

  selectCabinet: (id: string | null) =>
    set({ selectedCabinetId: id }),

  // ── Build Actions ───────────────────────────────────────────

  addCabinet: (col: number, row: number, environment: CabinetEnvironment, customerType: CustomerType = 'general', facing: CabinetFacing = 'north') =>
    set((state) => {
      if (state.money < COSTS.cabinet) return state
      const suiteLimits = getSuiteLimits(state.suiteTier)
      if (state.cabinets.length >= suiteLimits.maxCabinets) return state
      // Validate grid bounds
      if (col < 0 || col >= suiteLimits.cols || row < 0 || row >= suiteLimits.rows) return state
      // Validate tile is not occupied (by cabinets, PDUs, or cable trays)
      if (state.cabinets.some((c) => c.col === col && c.row === row)) return state
      const cab: Cabinet = {
        id: `cab-${nextCabId++}`,
        col,
        row,
        environment,
        customerType,
        serverCount: 1,
        hasLeafSwitch: false,
        powerStatus: true,
        heatLevel: SIM.ambientTemp,
        serverAge: 0,
        facing,
      }
      const newCabinets = [...state.cabinets, cab]
      const newAisleBonus = calcAisleBonus(newCabinets)
      const newAisleViolations = countAisleViolations(newCabinets)
      const newZones = calcZones(newCabinets)
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.cabinet,
        placementMode: false,
        aisleBonus: newAisleBonus,
        aisleViolations: newAisleViolations,
        zones: newZones,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  enterPlacementMode: (environment: CabinetEnvironment, customerType: CustomerType, facing?: CabinetFacing) =>
    set((state) => ({ placementMode: true, placementEnvironment: environment, placementCustomerType: customerType, placementFacing: facing ?? state.placementFacing })),

  exitPlacementMode: () =>
    set({ placementMode: false }),

  togglePlacementFacing: () =>
    set((state) => {
      const cycle: CabinetFacing[] = ['north', 'east', 'south', 'west']
      const idx = cycle.indexOf(state.placementFacing)
      return { placementFacing: cycle[(idx + 1) % cycle.length] }
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
      const suiteLimits = getSuiteLimits(state.suiteTier)
      if (state.spineSwitches.length >= suiteLimits.maxSpines) return state
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
        trafficStats: calcTraffic(newCabinets, state.spineSwitches, state.demandMultiplier),
      }
    }),

  toggleSpinePower: (id) =>
    set((state) => {
      // Prevent toggling hardware that is failed due to an incident
      const hwIncident = state.activeIncidents.find(
        (i) => !i.resolved && i.def.effect === 'hardware_failure' && i.affectedHardwareId === id
      )
      if (hwIncident) return state
      const newSpines = state.spineSwitches.map((s) =>
        s.id === id ? { ...s, powerStatus: !s.powerStatus } : s
      )
      return {
        spineSwitches: newSpines,
        ...calcStats(state.cabinets, newSpines),
        trafficStats: calcTraffic(state.cabinets, newSpines, state.demandMultiplier),
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

  upgradeCooling: (type: CoolingType) =>
    set((state) => {
      if (state.coolingType === type) return state
      const config = COOLING_CONFIG[type]
      if (state.money < config.upgradeCost) return state
      return {
        coolingType: type,
        money: state.money - config.upgradeCost,
        ...calcStats(state.cabinets, state.spineSwitches),
      }
    }),

  takeLoan: (optionIndex: number) =>
    set((state) => {
      const opt = LOAN_OPTIONS[optionIndex]
      if (!opt) return state
      // Max 3 active loans
      if (state.loans.length >= 3) return state
      const totalPayment = opt.principal * (1 + opt.interestRate * opt.termTicks)
      const paymentPerTick = totalPayment / opt.termTicks
      const loan: Loan = {
        id: `loan-${nextLoanId++}`,
        principal: opt.principal,
        remaining: totalPayment,
        interestRate: opt.interestRate,
        paymentPerTick: +paymentPerTick.toFixed(2),
        ticksRemaining: opt.termTicks,
        label: opt.label,
      }
      return {
        loans: [...state.loans, loan],
        money: state.money + opt.principal,
      }
    }),

  resolveIncident: (id: string) =>
    set((state) => {
      const incident = state.activeIncidents.find((i) => i.id === id)
      if (!incident || incident.resolved) return state
      // Apply ops tier resolve cost reduction
      const opsConfig = OPS_TIER_CONFIG.find((c) => c.id === state.opsTier)
      const costReduction = opsConfig?.benefits.resolveCostReduction ?? 0
      const effectiveCost = Math.round(incident.def.resolveCost * (1 - costReduction))
      if (state.money < effectiveCost) return state

      // Restore hardware if this was a hardware_failure incident
      let cabinets = state.cabinets
      let spineSwitches = state.spineSwitches
      if (incident.def.effect === 'hardware_failure' && incident.affectedHardwareId) {
        if (incident.def.hardwareTarget === 'spine') {
          spineSwitches = state.spineSwitches.map((s) =>
            s.id === incident.affectedHardwareId ? { ...s, powerStatus: true } : s
          )
        } else if (incident.def.hardwareTarget === 'leaf') {
          cabinets = state.cabinets.map((c) =>
            c.id === incident.affectedHardwareId ? { ...c, hasLeafSwitch: true } : c
          )
        }
      }

      return {
        activeIncidents: state.activeIncidents.map((i) =>
          i.id === id ? { ...i, resolved: true, ticksRemaining: 0 } : i
        ),
        cabinets,
        spineSwitches,
        money: state.money - effectiveCost,
        resolvedCount: state.resolvedCount + 1,
        incidentLog: [`Resolved: ${incident.def.label}${costReduction > 0 ? ` (${Math.round(costReduction * 100)}% ops discount)` : ''}`, ...state.incidentLog].slice(0, 10),
        ...calcStats(cabinets, spineSwitches),
        trafficStats: calcTraffic(cabinets, spineSwitches, state.demandMultiplier),
      }
    }),

  acceptContract: (index: number) =>
    set((state) => {
      const def = state.contractOffers[index]
      if (!def) return state
      if (state.activeContracts.length >= MAX_ACTIVE_CONTRACTS) return state
      const contract: ActiveContract = {
        id: `contract-${nextContractId++}`,
        def,
        ticksRemaining: def.durationTicks,
        consecutiveViolations: 0,
        totalViolationTicks: 0,
        totalEarned: 0,
        totalPenalties: 0,
        status: 'active',
      }
      // Phase 4D: track wins against competitor bids
      const hadCompetitorBid = state.competitorBids.some((b) => b.contractType === def.type)
      return {
        activeContracts: [...state.activeContracts, contract],
        contractOffers: state.contractOffers.filter((_, i) => i !== index),
        contractLog: [`Accepted: ${def.company} — ${def.description}`, ...state.contractLog].slice(0, 10),
        competitorBids: state.competitorBids.filter((b) => b.contractType !== def.type),
        competitorContractsWon: hadCompetitorBid ? state.competitorContractsWon + 1 : state.competitorContractsWon,
      }
    }),

  dismissAchievement: () => set({ newAchievement: null }),

  buyGenerator: (optionIndex: number) =>
    set((state) => {
      const config = GENERATOR_OPTIONS[optionIndex]
      if (!config) return state
      if (state.money < config.cost) return state
      if (state.generators.length >= 3) return state
      const gen: Generator = {
        id: `gen-${nextGeneratorId++}`,
        config,
        status: 'standby',
        fuelRemaining: config.fuelCapacity,
        ticksUntilReady: 0,
      }
      return {
        generators: [...state.generators, gen],
        money: state.money - config.cost,
      }
    }),

  activateGenerator: (id: string) =>
    set((state) => {
      return {
        generators: state.generators.map((g) =>
          g.id === id && g.status === 'standby' && g.fuelRemaining > 0
            ? { ...g, status: 'running' as GeneratorStatus, ticksUntilReady: 0 }
            : g
        ),
      }
    }),

  upgradeSuppression: (type: SuppressionType) =>
    set((state) => {
      const config = SUPPRESSION_CONFIG[type]
      if (state.money < config.cost) return state
      if (state.suppressionType === type) return state
      return {
        suppressionType: type,
        money: state.money - config.cost,
      }
    }),

  startResearch: (techId: string) =>
    set((state) => {
      if (state.activeResearch) return state
      const tech = TECH_TREE.find((t) => t.id === techId)
      if (!tech) return state
      if (state.unlockedTech.includes(techId)) return state
      if (tech.prereqId && !state.unlockedTech.includes(tech.prereqId)) return state
      if (state.money < tech.cost) return state
      return {
        activeResearch: { techId, ticksRemaining: tech.researchTicks },
        money: state.money - tech.cost,
        rdSpent: state.rdSpent + tech.cost,
      }
    }),

  refreshServers: (cabinetId: string) =>
    set((state) => {
      const cab = state.cabinets.find((c) => c.id === cabinetId)
      if (!cab) return state
      const cost = DEPRECIATION.refreshCost * cab.serverCount
      if (state.money < cost) return state
      return {
        cabinets: state.cabinets.map((c) =>
          c.id === cabinetId ? { ...c, serverAge: 0 } : c
        ),
        money: state.money - cost,
        totalRefreshes: state.totalRefreshes + 1,
        eWasteStockpile: state.eWasteStockpile + cab.serverCount, // Phase 4B: old hardware becomes e-waste
      }
    }),

  upgradeSuite: (tier: SuiteTier) =>
    set((state) => {
      const currentIdx = SUITE_TIER_ORDER.indexOf(state.suiteTier)
      const targetIdx = SUITE_TIER_ORDER.indexOf(tier)
      // Can only upgrade, not downgrade
      if (targetIdx <= currentIdx) return state
      const config = SUITE_TIERS[tier]
      if (state.money < config.upgradeCost) return state
      return {
        suiteTier: tier,
        money: state.money - config.upgradeCost,
      }
    }),

  // ── Infrastructure Actions ────────────────────────────────────

  placePDU: (col: number, row: number, optionIndex: number) =>
    set((state) => {
      const config = PDU_OPTIONS[optionIndex]
      if (!config) return state
      if (state.money < config.cost) return state
      // Max 6 PDUs
      if (state.pdus.length >= 6) return state
      // Can't place on occupied tile (cabinets)
      if (state.cabinets.some((c) => c.col === col && c.row === row)) return state
      if (state.pdus.some((p) => p.col === col && p.row === row)) return state
      const pdu: PDU = {
        id: `pdu-${state.pdus.length + 1}`,
        col,
        row,
        maxCapacityKW: config.maxCapacityKW,
        label: config.label,
      }
      return {
        pdus: [...state.pdus, pdu],
        money: state.money - config.cost,
      }
    }),

  placeCableTray: (col: number, row: number, optionIndex: number) =>
    set((state) => {
      const config = CABLE_TRAY_OPTIONS[optionIndex]
      if (!config) return state
      if (state.money < config.cost) return state
      // Max 20 cable trays
      if (state.cableTrays.length >= 20) return state
      // Can't stack on existing tray
      if (state.cableTrays.some((t) => t.col === col && t.row === row)) return state
      const tray: CableTray = {
        id: `tray-${state.cableTrays.length + 1}`,
        col,
        row,
        capacityUnits: config.capacityUnits,
      }
      return {
        cableTrays: [...state.cableTrays, tray],
        money: state.money - config.cost,
      }
    }),

  autoRouteCables: () =>
    set((state) => {
      // Automatically create cable runs for all leaf-to-spine connections
      const leafCabinets = state.cabinets.filter((c) => c.hasLeafSwitch)
      const suiteLimits = getSuiteLimits(state.suiteTier)
      const newCableRuns: CableRun[] = []
      let cableId = 1

      for (const cab of leafCabinets) {
        for (let si = 0; si < state.spineSwitches.length; si++) {
          const spine = state.spineSwitches[si]
          const length = calcCableLength(cab.col, cab.row, si, suiteLimits.rows)

          // Check if cable path passes through any cable tray
          const usesTrays = state.cableTrays.some((tray) =>
            manhattanDist(tray.col, tray.row, cab.col, cab.row) <= 2
          )

          const capacityGbps = length > AISLE_CONFIG.maxCableLength
            ? TRAFFIC.linkCapacityGbps * (1 - AISLE_CONFIG.degradedCablePenalty)
            : TRAFFIC.linkCapacityGbps

          newCableRuns.push({
            id: `cable-${cableId++}`,
            leafCabinetId: cab.id,
            spineId: spine.id,
            length,
            capacityGbps: +capacityGbps.toFixed(1),
            usesTrays,
          })
        }
      }

      const messyCableCount = countMessyCables(newCableRuns)
      const infraIncidentBonus = messyCableCount * AISLE_CONFIG.messyCablingPenalty

      return {
        cableRuns: newCableRuns,
        messyCableCount,
        infraIncidentBonus,
      }
    }),

  toggleCabinetFacing: (cabinetId: string) =>
    set((state) => {
      const cycle: CabinetFacing[] = ['north', 'east', 'south', 'west']
      const newCabinets = state.cabinets.map((c) => {
        if (c.id !== cabinetId) return c
        const idx = cycle.indexOf(c.facing)
        return { ...c, facing: cycle[(idx + 1) % cycle.length] }
      })
      return {
        cabinets: newCabinets,
        aisleBonus: calcAisleBonus(newCabinets),
        aisleViolations: countAisleViolations(newCabinets),
      }
    }),

  // ── Insurance Actions ──────────────────────────────────────────

  buyInsurance: (type: InsurancePolicyType) =>
    set((state) => {
      if (state.insurancePolicies.includes(type)) return state
      const config = INSURANCE_OPTIONS.find((o) => o.type === type)
      if (!config) return state
      return { insurancePolicies: [...state.insurancePolicies, type] }
    }),

  cancelInsurance: (type: InsurancePolicyType) =>
    set((state) => ({
      insurancePolicies: state.insurancePolicies.filter((p) => p !== type),
    })),

  // ── DR Drill Actions ───────────────────────────────────────────

  runDrill: () =>
    set((state) => {
      if (state.drillCooldown > 0) return state
      if (!state.sandboxMode && state.money < DRILL_CONFIG.cost) return state

      const findings: string[] = []
      let score = 100

      // Check backup generators
      if (state.generators.length === 0) { findings.push('No backup generators installed'); score -= 20 }
      else {
        const readyGens = state.generators.filter((g) => g.status === 'standby' && g.fuelRemaining > 5)
        if (readyGens.length === 0) { findings.push('No generators ready with fuel'); score -= 15 }
      }
      // Check fire suppression
      if (state.suppressionType === 'none') { findings.push('No fire suppression system'); score -= 15 }
      // Check cooling
      if (state.avgHeat > 60) { findings.push('Average temperature too high'); score -= 10 }
      // Check redundancy
      const activeSpines = state.spineSwitches.filter((s) => s.powerStatus).length
      if (activeSpines < 2) { findings.push('Insufficient spine switch redundancy'); score -= 10 }
      // Check cable management
      if (state.messyCableCount > 3) { findings.push('Too many messy cable runs'); score -= 10 }
      // Check PDU overload
      if (state.pduOverloaded) { findings.push('PDU overload detected'); score -= 10 }
      // Check reputation
      if (state.reputationScore < 30) { findings.push('Reputation score is low'); score -= 10 }

      if (findings.length === 0) findings.push('All systems nominal — excellent preparedness!')
      score = Math.max(0, score)
      const passed = score >= DRILL_CONFIG.passThreshold

      const result: DrillResult = { passed, score, findings, tick: state.tickCount }

      return {
        money: state.sandboxMode ? state.money : state.money - DRILL_CONFIG.cost,
        drillCooldown: DRILL_CONFIG.cooldownTicks,
        lastDrillResult: result,
        drillsCompleted: state.drillsCompleted + 1,
        drillsPassed: state.drillsPassed + (passed ? 1 : 0),
        reputationScore: Math.max(0, Math.min(100, state.reputationScore + (passed ? DRILL_CONFIG.reputationBonus : DRILL_CONFIG.reputationPenalty))),
        incidentLog: [`DR Drill ${passed ? 'PASSED' : 'FAILED'} (Score: ${score}%)`, ...state.incidentLog].slice(0, 10),
      }
    }),

  // ── Patent Actions ─────────────────────────────────────────────

  patentTech: (techId: string) =>
    set((state) => {
      if (!state.unlockedTech.includes(techId)) return state
      if (state.patents.some((p) => p.techId === techId)) return state
      if (state.patents.length >= PATENT_CONFIG.maxPatents) return state
      if (!state.sandboxMode && state.money < PATENT_CONFIG.cost) return state

      const tech = TECH_TREE.find((t) => t.id === techId)
      if (!tech) return state

      const patent: Patent = {
        techId,
        label: tech.label,
        incomePerTick: PATENT_CONFIG.incomePerTick,
        grantedAtTick: state.tickCount,
      }

      return {
        patents: [...state.patents, patent],
        money: state.sandboxMode ? state.money : state.money - PATENT_CONFIG.cost,
      }
    }),

  // ── RFP Bidding Actions ────────────────────────────────────────

  bidOnRFP: (rfpId: string) =>
    set((state) => {
      const rfp = state.rfpOffers.find((r) => r.id === rfpId)
      if (!rfp) return state
      if (state.activeContracts.length >= MAX_ACTIVE_CONTRACTS) return state

      // Win chance based on reputation vs competitor
      const playerStrength = state.reputationScore + state.cabinets.length * 2
      const competitorStrength = rfp.competitorStrength
      const winChance = playerStrength / (playerStrength + competitorStrength)
      const won = Math.random() < winChance

      if (won) {
        const contract: ActiveContract = {
          id: `contract-${nextContractId++}`,
          def: rfp.def,
          ticksRemaining: rfp.def.durationTicks,
          consecutiveViolations: 0,
          totalViolationTicks: 0,
          totalEarned: 0,
          totalPenalties: 0,
          status: 'active',
        }
        return {
          activeContracts: [...state.activeContracts, contract],
          rfpOffers: state.rfpOffers.filter((r) => r.id !== rfpId),
          rfpsWon: state.rfpsWon + 1,
          contractLog: [`WON RFP: ${rfp.def.company} — beat ${rfp.competitorName}!`, ...state.contractLog].slice(0, 10),
        }
      } else {
        return {
          rfpOffers: state.rfpOffers.filter((r) => r.id !== rfpId),
          rfpsLost: state.rfpsLost + 1,
          contractLog: [`LOST RFP: ${rfp.competitorName} won the ${rfp.def.company} contract`, ...state.contractLog].slice(0, 10),
        }
      }
    }),

  // ── Infrastructure Entity Actions ──────────────────────────────

  placeBusway: (col: number, row: number, optionIndex: number) =>
    set((state) => {
      const config = BUSWAY_OPTIONS[optionIndex]
      if (!config) return state
      if (!state.sandboxMode && state.money < config.cost) return state
      if (state.busways.length >= 10) return state
      if (state.busways.some((b) => b.col === col && b.row === row)) return state

      const busway: Busway = {
        id: `busway-${state.busways.length + 1}`,
        col, row,
        capacityKW: config.capacityKW,
        label: config.label,
      }
      return {
        busways: [...state.busways, busway],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  placeCrossConnect: (col: number, row: number, optionIndex: number) =>
    set((state) => {
      const config = CROSSCONNECT_OPTIONS[optionIndex]
      if (!config) return state
      if (!state.sandboxMode && state.money < config.cost) return state
      if (state.crossConnects.length >= 8) return state
      if (state.crossConnects.some((c) => c.col === col && c.row === row)) return state

      const cc: CrossConnect = {
        id: `cc-${state.crossConnects.length + 1}`,
        col, row,
        portCount: config.portCount,
        label: config.label,
      }
      return {
        crossConnects: [...state.crossConnects, cc],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  placeInRowCooling: (col: number, row: number, optionIndex: number) =>
    set((state) => {
      const config = INROW_COOLING_OPTIONS[optionIndex]
      if (!config) return state
      if (!state.sandboxMode && state.money < config.cost) return state
      if (state.inRowCoolers.length >= 10) return state
      if (state.inRowCoolers.some((c) => c.col === col && c.row === row)) return state

      const cooler: InRowCooling = {
        id: `inrow-${state.inRowCoolers.length + 1}`,
        col, row,
        coolingBonus: config.coolingBonus,
        label: config.label,
      }
      return {
        inRowCoolers: [...state.inRowCoolers, cooler],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  // ── Sandbox Mode ───────────────────────────────────────────────

  toggleSandboxMode: () =>
    set((state) => ({
      sandboxMode: !state.sandboxMode,
      money: !state.sandboxMode ? 999999999 : state.money,
    })),

  // ── Scenario Actions ───────────────────────────────────────────

  startScenario: (scenarioId: string) =>
    set((state) => {
      const scenario = SCENARIO_CATALOG.find((s) => s.id === scenarioId)
      if (!scenario) return state
      if (state.activeScenario) return state

      const progress: Record<string, boolean> = {}
      for (const obj of scenario.objectives) {
        progress[obj.id] = false
      }

      return {
        activeScenario: scenario,
        scenarioProgress: progress,
        money: scenario.startingMoney,
      }
    }),

  abandonScenario: () =>
    set({ activeScenario: null, scenarioProgress: {} }),

  // ── Heat Map ───────────────────────────────────────────────────

  // ── Staff & HR Actions ─────────────────────────────────────────

  hireStaff: (role: StaffRole, skillLevel: StaffSkillLevel) =>
    set((state) => {
      const config = STAFF_ROLE_CONFIG.find((c) => c.role === role)
      if (!config) return state
      const maxStaff = MAX_STAFF_BY_TIER[state.suiteTier]
      if (state.staff.length >= maxStaff) return state
      const salary = +(config.baseSalary * config.salaryMultiplier[skillLevel - 1]).toFixed(2)
      if (state.money < config.hireCost) return state
      const member: StaffMember = {
        id: `staff-${nextStaffId++}`,
        name: generateStaffName(),
        role,
        skillLevel,
        salaryPerTick: salary,
        hiredAtTick: state.tickCount,
        onShift: true,
        certifications: [],
        incidentsResolved: 0,
        fatigueLevel: 0,
      }
      return {
        staff: [...state.staff, member],
        money: state.money - config.hireCost,
      }
    }),

  fireStaff: (staffId: string) =>
    set((state) => {
      const member = state.staff.find((s) => s.id === staffId)
      if (!member) return state
      return {
        staff: state.staff.filter((s) => s.id !== staffId),
        trainingQueue: state.trainingQueue.filter((t) => t.staffId !== staffId),
      }
    }),

  setShiftPattern: (pattern: ShiftPattern) =>
    set({ shiftPattern: pattern }),

  startTraining: (staffId: string, certId: string) =>
    set((state) => {
      const member = state.staff.find((s) => s.id === staffId)
      if (!member) return state
      // Already has this cert
      if (member.certifications.includes(certId)) return state
      // Already in training
      if (state.trainingQueue.some((t) => t.staffId === staffId)) return state
      const certConfig = STAFF_CERT_CONFIG.find((c) => c.id === certId)
      if (!certConfig) return state
      // Check role requirement
      if (certConfig.requiredRole && member.role !== certConfig.requiredRole) return state
      if (state.money < certConfig.cost) return state
      const training: StaffTraining = {
        staffId,
        certification: certId,
        ticksRemaining: certConfig.durationTicks,
        cost: certConfig.cost,
      }
      return {
        trainingQueue: [...state.trainingQueue, training],
        money: state.money - certConfig.cost,
      }
    }),

  toggleHeatMap: () =>
    set((state) => ({ heatMapVisible: !state.heatMapVisible })),

  // ── Supply Chain Actions ────────────────────────────────────────

  placeOrder: (itemType: string, quantity: number) =>
    set((state) => {
      const config = SUPPLY_CHAIN_CONFIG.find((c) => c.itemType === itemType)
      if (!config) return state

      const baseCost = itemType === 'server' ? COSTS.server
        : itemType === 'leaf_switch' ? COSTS.leaf_switch
          : itemType === 'spine_switch' ? COSTS.spine_switch
            : COSTS.cabinet
      const shortageMult = state.supplyShortageActive ? state.shortagePriceMultiplier : 1
      const bulkMult = quantity >= config.bulkThreshold ? config.bulkDiscount : 1
      const unitCost = Math.round(baseCost * shortageMult * bulkMult)
      const totalCost = unitCost * quantity
      if (!state.sandboxMode && state.money < totalCost) return state

      const leadTime = state.supplyShortageActive ? config.shortageLeadTime : config.baseLeadTime
      const order: HardwareOrder = {
        id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        itemType: itemType as HardwareOrder['itemType'],
        quantity,
        unitCost,
        totalCost,
        leadTimeTicks: leadTime,
        ticksRemaining: leadTime,
        status: 'pending',
        orderedAtTick: state.tickCount,
      }
      return {
        pendingOrders: [...state.pendingOrders, order],
        money: state.sandboxMode ? state.money : state.money - totalCost,
      }
    }),

  // ── Interconnection Actions ─────────────────────────────────────

  installMeetMeRoom: (tier: number) =>
    set((state) => {
      const config = MEETME_ROOM_CONFIG[tier]
      if (!config) return state
      if (state.meetMeRoomTier !== null) return state
      const tierIdx = SUITE_TIER_ORDER.indexOf(state.suiteTier)
      if (tierIdx < 1) return state // requires at least Standard tier
      if (!state.sandboxMode && state.money < config.installCost) return state
      return {
        meetMeRoomTier: tier,
        money: state.sandboxMode ? state.money : state.money - config.installCost,
      }
    }),

  addInterconnectPort: (portType: InterconnectPortType) =>
    set((state) => {
      if (state.meetMeRoomTier === null) return state
      const roomConfig = MEETME_ROOM_CONFIG[state.meetMeRoomTier]
      if (!roomConfig) return state
      const portConfig = INTERCONNECT_PORT_CONFIG.find((p) => p.portType === portType)
      if (!portConfig) return state
      const usedPorts = state.interconnectPorts.reduce((sum, p) => {
        const pc = INTERCONNECT_PORT_CONFIG.find((c) => c.portType === p.portType)
        return sum + (pc?.capacityUsed ?? 1)
      }, 0)
      if (usedPorts + portConfig.capacityUsed > roomConfig.portCapacity) return state
      if (!state.sandboxMode && state.money < portConfig.installCost) return state
      const tenant = INTERCONNECT_TENANTS[Math.floor(Math.random() * INTERCONNECT_TENANTS.length)]
      const port: InterconnectPort = {
        id: `port-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tenantName: tenant,
        portType,
        revenuePerTick: portConfig.revenuePerTick,
        installedAtTick: state.tickCount,
      }
      return {
        interconnectPorts: [...state.interconnectPorts, port],
        money: state.sandboxMode ? state.money : state.money - portConfig.installCost,
      }
    }),

  // ── Server Config Actions ───────────────────────────────────────

  setDefaultServerConfig: (config: ServerConfig) =>
    set({ defaultServerConfig: config }),

  // ── Peering Actions ─────────────────────────────────────────────

  addPeeringAgreement: (optionIndex: number) =>
    set((state) => {
      const config = PEERING_OPTIONS[optionIndex]
      if (!config) return state
      if (state.peeringAgreements.length >= 4) return state
      if (state.peeringAgreements.some((p) => p.type === config.type)) return state
      const agreement: PeeringAgreement = {
        id: `peering-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        provider: config.provider,
        type: config.type,
        bandwidthGbps: config.bandwidthGbps,
        costPerTick: config.costPerTick,
        latencyMs: config.latencyMs,
        installedAtTick: state.tickCount,
      }
      return { peeringAgreements: [...state.peeringAgreements, agreement] }
    }),

  removePeeringAgreement: (id: string) =>
    set((state) => ({
      peeringAgreements: state.peeringAgreements.filter((p) => p.id !== id),
    })),

  // ── Maintenance Actions ─────────────────────────────────────────

  scheduleMaintenance: (targetType: MaintenanceTargetType, targetId: string) =>
    set((state) => {
      const config = MAINTENANCE_CONFIG.find((c) => c.targetType === targetType)
      if (!config) return state

      // Maintenance access check: cabinets without adjacent empty space cost more
      let costMult = 1.0
      let durationMult = 1.0
      if (targetType === 'cabinet') {
        const targetCab = state.cabinets.find((c) => c.id === targetId)
        if (targetCab) {
          const suiteLimits = getSuiteLimits(state.suiteTier)
          if (!hasMaintenanceAccess(targetCab, state.cabinets, suiteLimits.cols, suiteLimits.rows)) {
            costMult = SPACING_CONFIG.noAccessMaintenanceCostMult
            durationMult = SPACING_CONFIG.noAccessResolutionMult
          }
        }
      }

      const adjustedCost = Math.round(config.cost * costMult)
      if (!state.sandboxMode && state.money < adjustedCost) return state
      if (state.maintenanceWindows.filter((w) => w.status !== 'completed').length >= 3) return state
      const window: MaintenanceWindow = {
        id: `maint-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        targetType,
        targetId,
        scheduledTick: state.tickCount + 1,
        durationTicks: Math.ceil(config.durationTicks * durationMult),
        cost: adjustedCost,
        status: 'scheduled',
        benefitApplied: false,
      }
      return {
        maintenanceWindows: [...state.maintenanceWindows, window],
        money: state.sandboxMode ? state.money : state.money - adjustedCost,
      }
    }),

  // ── Power Redundancy Actions ────────────────────────────────────

  upgradePowerRedundancy: (level: PowerRedundancy) =>
    set((state) => {
      const config = POWER_REDUNDANCY_CONFIG.find((c) => c.level === level)
      if (!config) return state
      const currentIdx = POWER_REDUNDANCY_CONFIG.findIndex((c) => c.level === state.powerRedundancy)
      const targetIdx = POWER_REDUNDANCY_CONFIG.findIndex((c) => c.level === level)
      if (targetIdx <= currentIdx) return state
      if (!state.sandboxMode && state.money < config.upgradeCost) return state
      return {
        powerRedundancy: level,
        money: state.sandboxMode ? state.money : state.money - config.upgradeCost,
      }
    }),

  // ── Noise Actions ───────────────────────────────────────────────

  installSoundBarrier: () =>
    set((state) => {
      if (state.soundBarriersInstalled >= NOISE_CONFIG.maxSoundBarriers) return state
      if (!state.sandboxMode && state.money < NOISE_CONFIG.soundBarrierCost) return state
      return {
        soundBarriersInstalled: state.soundBarriersInstalled + 1,
        money: state.sandboxMode ? state.money : state.money - NOISE_CONFIG.soundBarrierCost,
      }
    }),

  // ── Spot Compute Actions ────────────────────────────────────────

  setSpotCapacity: (count: number) =>
    set((state) => {
      const totalServers = state.cabinets.reduce((sum, c) => sum + (c.powerStatus ? c.serverCount : 0), 0)
      return { spotCapacityAllocated: Math.max(0, Math.min(count, totalServers)) }
    }),

  // ── Phase 4B: Carbon & Environmental Actions ───────────────────

  setEnergySource: (source: EnergySource) =>
    set((state) => {
      const config = ENERGY_SOURCE_CONFIG[source]
      if (state.money < config.installCost) return state
      return {
        energySource: source,
        money: state.money - config.installCost,
      }
    }),

  applyForGreenCert: (certId: GreenCert) =>
    set((state) => {
      if (state.greenCertifications.includes(certId)) return state
      const config = GREEN_CERT_CONFIG.find((c) => c.id === certId)
      if (!config || state.money < config.cost) return state
      // Check prerequisites: higher certs require lower ones
      const certOrder: GreenCert[] = ['energy_star', 'leed_silver', 'leed_gold', 'carbon_neutral']
      const targetIdx = certOrder.indexOf(certId)
      if (targetIdx > 0 && !state.greenCertifications.includes(certOrder[targetIdx - 1])) return state
      // Check eligibility ticks
      if (state.greenCertEligibleTicks < config.requirements.minConsecutiveTicks) return state
      return {
        greenCertifications: [...state.greenCertifications, certId],
        money: state.money - config.cost,
      }
    }),

  disposeEWaste: (proper: boolean) =>
    set((state) => {
      if (state.eWasteStockpile <= 0) return state
      const count = state.eWasteStockpile
      const cost = proper ? count * EWASTE_CONFIG.properDisposalCost : count * EWASTE_CONFIG.improperDisposalCost
      if (state.money < cost) return state
      const repChange = proper ? 1 : -EWASTE_CONFIG.improperDisposalReputationPenalty
      return {
        eWasteStockpile: 0,
        eWasteDisposed: state.eWasteDisposed + (proper ? count : 0),
        money: state.money - cost,
        reputationScore: Math.max(0, Math.min(100, state.reputationScore + repChange)),
      }
    }),

  // ── Phase 4C: Security & Compliance Actions ───────────────────

  upgradeSecurityTier: (tier: SecurityTier) =>
    set((state) => {
      const tierOrder: SecurityTier[] = ['basic', 'enhanced', 'high_security', 'maximum']
      const currentIdx = tierOrder.indexOf(state.securityTier)
      const targetIdx = tierOrder.indexOf(tier)
      if (targetIdx <= currentIdx) return state // can only upgrade
      const config = SECURITY_TIER_CONFIG.find((c) => c.tier === tier)
      if (!config || state.money < config.cost) return state
      return {
        securityTier: tier,
        installedSecurityFeatures: [...config.featuresIncluded],
        money: state.money - config.cost,
      }
    }),

  startComplianceAudit: (certId: ComplianceCertId) =>
    set((state) => {
      if (state.auditCooldown > 0) return state
      const config = COMPLIANCE_CERT_CONFIG.find((c) => c.id === certId)
      if (!config || state.money < config.auditCost) return state
      // Check requirements
      const tierOrder: SecurityTier[] = ['basic', 'enhanced', 'high_security', 'maximum']
      if (tierOrder.indexOf(state.securityTier) < tierOrder.indexOf(config.requirements.minSecurityTier)) return state
      if (!config.requirements.requiredFeatures.every((f) => state.installedSecurityFeatures.includes(f))) return state
      if (state.reputationScore < config.requirements.minReputation) return state
      const secOfficers = state.staff.filter((s) => s.role === 'security_officer').length
      if (secOfficers < config.requirements.minSecurityOfficers) return state
      // Check if already auditing
      if (state.complianceCerts.some((c) => c.certId === certId && c.auditInProgress)) return state
      // Start or renew audit
      const existing = state.complianceCerts.filter((c) => c.certId !== certId)
      const newCert: ActiveComplianceCert = {
        certId,
        grantedAtTick: 0, // will be set when audit completes
        expiresAtTick: 0,
        auditInProgress: true,
        auditStartedTick: state.tickCount,
      }
      return {
        complianceCerts: [...existing, newCert],
        money: state.money - config.auditCost,
        auditCooldown: 20,
      }
    }),

  // ── Phase 4D: Competitor AI Actions ────────────────────────────

  counterPoachOffer: () =>
    set((state) => {
      if (!state.poachTarget) return state
      const staff = state.staff.find((s) => s.id === state.poachTarget)
      if (!staff) return { poachTarget: null }
      const counterCost = staff.salaryPerTick * 40 // 2x salary for 20 ticks
      if (state.money < counterCost) return state
      return {
        money: state.money - counterCost,
        poachTarget: null,
      }
    }),

  // ── Operations Progression Actions ─────────────────────────────

  upgradeOpsTier: () =>
    set((state) => {
      const currentIdx = OPS_TIER_ORDER.indexOf(state.opsTier)
      if (currentIdx >= OPS_TIER_ORDER.length - 1) return state // already at max tier
      const nextTierId = OPS_TIER_ORDER[currentIdx + 1]
      const nextConfig = OPS_TIER_CONFIG.find((c) => c.id === nextTierId)
      if (!nextConfig) return state
      // Check requirements
      const { minStaff, requiredTechs, minReputation, minSuiteTier } = nextConfig.unlockRequirements
      if (state.staff.length < minStaff) return state
      if (!requiredTechs.every((t) => state.unlockedTech.includes(t))) return state
      if (state.reputationScore < minReputation) return state
      const suiteTierOrder: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']
      if (suiteTierOrder.indexOf(state.suiteTier) < suiteTierOrder.indexOf(minSuiteTier)) return state
      if (state.money < nextConfig.upgradeCost) return state
      return {
        opsTier: nextTierId,
        money: state.money - nextConfig.upgradeCost,
      }
    }),

  // ── Tutorial Actions ────────────────────────────────────────────

  dismissTip: (tipId: string) =>
    set((state) => ({
      seenTips: [...state.seenTips, tipId],
      activeTip: state.activeTip?.id === tipId ? null : state.activeTip,
    })),

  toggleTutorial: () =>
    set((state) => ({ tutorialEnabled: !state.tutorialEnabled, activeTip: null })),

  // ── Demo Mode ─────────────────────────────────────────────────

  loadDemoState: () => {
    // Build a professional-tier data center with a diverse, fully-operational layout
    const demoCabinets: Cabinet[] = []
    const customerTypes: CustomerType[] = ['general', 'ai_training', 'streaming', 'crypto', 'enterprise']
    const environments: CabinetEnvironment[] = ['production', 'production', 'production', 'lab', 'management']
    let cabId = 1

    // Professional tier: 10 cols x 9 rows — laid out with proper aisles
    // Row 0: north-facing cabinets
    // Row 1: (aisle)
    // Row 2: south-facing cabinets
    // Row 3: (aisle)
    // Row 4: north-facing cabinets
    // Row 5: (aisle)
    // Row 6: south-facing management/lab
    const positions: [number, number][] = [
      [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],
      [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],
      [2,4],[3,4],[4,4],[5,4],[6,4],
      [3,6],[4,6],[5,6],
    ]

    for (let i = 0; i < positions.length; i++) {
      const [col, row] = positions[i]
      const env = environments[i % environments.length]
      const cust = env === 'management' ? 'general' : customerTypes[i % customerTypes.length]
      const serverCount = env === 'management' ? 2 : 4
      demoCabinets.push({
        id: `cab-${cabId++}`,
        col,
        row,
        environment: env,
        customerType: cust as CustomerType,
        serverCount,
        hasLeafSwitch: env !== 'management' && i < 20,
        powerStatus: true,
        heatLevel: 35 + Math.floor(i * 1.3),
        serverAge: Math.floor(i * 20),
        facing: (row === 0 || row === 4) ? 'north' as CabinetFacing : 'south' as CabinetFacing,
      })
    }

    const demoSpines: SpineSwitch[] = [
      { id: 'spine-1', powerStatus: true },
      { id: 'spine-2', powerStatus: true },
      { id: 'spine-3', powerStatus: true },
      { id: 'spine-4', powerStatus: true },
      { id: 'spine-5', powerStatus: true },
    ]

    const demoGenerators: Generator[] = [
      {
        id: 'gen-1',
        config: GENERATOR_OPTIONS[1],
        status: 'standby' as GeneratorStatus,
        fuelRemaining: 50,
        ticksUntilReady: 0,
      },
    ]

    const demoAchievements: Achievement[] = [
      'first_cabinet', 'first_spine', 'full_rack', 'ten_cabinets',
      'water_cooling', 'hundred_k', 'suite_upgrade', 'first_generator',
      'fire_ready', 'first_research', 'survive_incident',
      'twenty_cabinets', 'connected', 'redundant', 'first_staff',
    ].map((id, i) => ({
      def: ACHIEVEMENT_CATALOG.find((a) => a.id === id)!,
      unlockedAtTick: (i + 1) * 50,
    })).filter((a) => a.def)

    const demoUnlockedTech = ['hot_aisle', 'variable_fans', 'high_density', 'ups_upgrade', 'redundant_cooling']

    // ── Infrastructure: PDUs, cable trays, busways, cross-connects, in-row coolers
    const demoPDUs: PDU[] = [
      { id: 'pdu-1', col: 4, row: 1, maxCapacityKW: 30, label: 'Metered PDU' },
      { id: 'pdu-2', col: 7, row: 1, maxCapacityKW: 30, label: 'Metered PDU' },
      { id: 'pdu-3', col: 3, row: 3, maxCapacityKW: 80, label: 'Intelligent PDU' },
      { id: 'pdu-4', col: 6, row: 5, maxCapacityKW: 80, label: 'Intelligent PDU' },
    ]

    const demoCableTrays: CableTray[] = [
      { id: 'tray-1', col: 1, row: 1, capacityUnits: 8 },
      { id: 'tray-2', col: 3, row: 1, capacityUnits: 8 },
      { id: 'tray-3', col: 5, row: 3, capacityUnits: 16 },
      { id: 'tray-4', col: 2, row: 5, capacityUnits: 8 },
      { id: 'tray-5', col: 3, row: 3, capacityUnits: 16 },
    ]

    // Cable runs connecting leaf cabinets to spines (auto-routed style)
    const demoCableRuns: CableRun[] = []
    const leafCabs = demoCabinets.filter((c) => c.hasLeafSwitch)
    for (const cab of leafCabs) {
      for (const spine of demoSpines) {
        demoCableRuns.push({
          id: `cable-${cab.id}-${spine.id}`,
          leafCabinetId: cab.id,
          spineId: spine.id,
          length: 3 + cab.row,
          capacityGbps: 10,
          usesTrays: demoCableTrays.some((t) => t.col === cab.col || t.row === cab.row),
        })
      }
    }

    const demoBusways: Busway[] = [
      { id: 'bus-1', col: 2, row: 1, capacityKW: 50, label: 'Medium Busway' },
      { id: 'bus-2', col: 6, row: 3, capacityKW: 120, label: 'Heavy Busway' },
    ]

    const demoCrossConnects: CrossConnect[] = [
      { id: 'xc-1', col: 5, row: 1, portCount: 24, label: 'Medium Patch Panel' },
      { id: 'xc-2', col: 8, row: 3, portCount: 48, label: 'HD Patch Panel' },
    ]

    const demoInRowCoolers: InRowCooling[] = [
      { id: 'irc-1', col: 4, row: 1, coolingBonus: 2.0, label: 'Standard In-Row Unit' },
      { id: 'irc-2', col: 7, row: 3, coolingBonus: 3.5, label: 'High-Capacity In-Row' },
    ]

    // ── Staff
    const demoStaff: StaffMember[] = [
      { id: 'staff-1', name: 'Alex Chen', role: 'network_engineer', skillLevel: 2, salaryPerTick: 6, hiredAtTick: 200, onShift: true, certifications: ['ccna'], incidentsResolved: 12, fatigueLevel: 25 },
      { id: 'staff-2', name: 'Jordan Patel', role: 'electrician', skillLevel: 2, salaryPerTick: 4.2, hiredAtTick: 350, onShift: true, certifications: [], incidentsResolved: 8, fatigueLevel: 15 },
      { id: 'staff-3', name: 'Sam Nakamura', role: 'cooling_specialist', skillLevel: 1, salaryPerTick: 3, hiredAtTick: 500, onShift: true, certifications: [], incidentsResolved: 5, fatigueLevel: 30 },
      { id: 'staff-4', name: 'Casey Garcia', role: 'security_officer', skillLevel: 1, salaryPerTick: 5, hiredAtTick: 600, onShift: true, certifications: [], incidentsResolved: 3, fatigueLevel: 10 },
    ]
    const demoStaffCost = demoStaff.reduce((sum, s) => sum + s.salaryPerTick, 0)

    // ── Contracts (2 active)
    const demoActiveContracts: ActiveContract[] = [
      {
        id: 'contract-1',
        def: CONTRACT_CATALOG[3], // streaming_cdn (silver)
        ticksRemaining: 120,
        consecutiveViolations: 0,
        totalViolationTicks: 0,
        totalEarned: 2000,
        totalPenalties: 0,
        status: 'active',
      },
      {
        id: 'contract-2',
        def: CONTRACT_CATALOG[5], // saas_platform (silver)
        ticksRemaining: 180,
        consecutiveViolations: 0,
        totalViolationTicks: 0,
        totalEarned: 1500,
        totalPenalties: 0,
        status: 'active',
      },
    ]

    // ── Interconnection: meet-me room with ports
    const demoInterconnectPorts: InterconnectPort[] = [
      { id: 'port-1', tenantName: 'CloudFlare', portType: 'fiber_10g', revenuePerTick: 10, installedAtTick: 400 },
      { id: 'port-2', tenantName: 'AWS Direct', portType: 'fiber_10g', revenuePerTick: 10, installedAtTick: 500 },
      { id: 'port-3', tenantName: 'Netflix OCA', portType: 'fiber_100g', revenuePerTick: 35, installedAtTick: 700 },
      { id: 'port-4', tenantName: 'Akamai', portType: 'copper_1g', revenuePerTick: 3, installedAtTick: 800 },
      { id: 'port-5', tenantName: 'Google Cloud', portType: 'fiber_10g', revenuePerTick: 10, installedAtTick: 900 },
    ]

    // ── Peering agreements (2 active)
    const demoPeeringAgreements: PeeringAgreement[] = [
      { id: 'peering-1', provider: 'FastPipe Inc', type: 'premium_transit', bandwidthGbps: 10, costPerTick: 15, latencyMs: 8, installedAtTick: 300 },
      { id: 'peering-2', provider: 'Metro IX', type: 'public_peering', bandwidthGbps: 20, costPerTick: 8, latencyMs: 5, installedAtTick: 600 },
    ]

    // ── Traffic stats (pre-calculated for the demo)
    const demoTrafficStats = calcTraffic(demoCabinets, demoSpines)

    // ── Event log — recent history
    const demoEventLog: EventLogEntry[] = [
      { tick: 1180, gameHour: 12, category: 'contract', message: 'StreamFlix SLA met — bonus revenue earned', severity: 'success' },
      { tick: 1150, gameHour: 10, category: 'incident', message: 'Cooling sensor alarm resolved by Sam Nakamura', severity: 'info' },
      { tick: 1120, gameHour: 8, category: 'finance', message: 'Revenue milestone: $400,000 lifetime earnings', severity: 'success' },
      { tick: 1080, gameHour: 6, category: 'staff', message: 'Alex Chen completed CCNA certification', severity: 'success' },
      { tick: 1050, gameHour: 4, category: 'infrastructure', message: 'High-Capacity In-Row cooling unit installed', severity: 'info' },
      { tick: 1000, gameHour: 22, category: 'incident', message: 'Power fluctuation resolved by Jordan Patel', severity: 'info' },
      { tick: 950, gameHour: 18, category: 'research', message: 'Redundant Cooling technology unlocked', severity: 'success' },
      { tick: 900, gameHour: 14, category: 'contract', message: 'DevForge contract completed — $1,200 bonus', severity: 'success' },
      { tick: 850, gameHour: 10, category: 'achievement', message: 'Achievement unlocked: Twenty Cabinets', severity: 'success' },
      { tick: 800, gameHour: 6, category: 'system', message: 'DR drill passed — reputation increased', severity: 'success' },
    ]

    // ── Capacity history — recent snapshots for graphs
    const demoCapacityHistory: HistoryPoint[] = Array.from({ length: 80 }, (_, i) => {
      const tick = 400 + i * 10
      const cabCount = Math.min(24, 8 + Math.floor(i / 5))
      return {
        tick,
        power: 8000 + cabCount * 200 + Math.floor(Math.random() * 500),
        heat: 35 + Math.floor(Math.random() * 15),
        revenue: 80 + cabCount * 8 + Math.floor(Math.random() * 20),
        cabinets: cabCount,
        money: 100000 + i * 4800 + Math.floor(Math.random() * 5000),
      }
    })

    // ── Competitors (2 active)
    const demoCompetitors: Competitor[] = [
      { id: 'comp-1', name: 'BudgetHost', personality: 'budget', strength: 45, specialization: 'general', reputationScore: 40, securityTier: 'basic', greenCert: null, aggression: 0.3, techLevel: 1, marketShare: 18 },
      { id: 'comp-2', name: 'GreenCloud Co', personality: 'green', strength: 55, specialization: 'enterprise', reputationScore: 60, securityTier: 'enhanced', greenCert: 'leed_silver', aggression: 0.2, techLevel: 2, marketShare: 14 },
    ]

    // Set module-level ID counters
    nextCabId = cabId
    nextSpineId = 6
    nextLoanId = 1
    nextIncidentId = 1
    nextContractId = 3
    nextGeneratorId = 2
    nextStaffId = 5

    set({
      isDemo: true,
      cabinets: demoCabinets,
      spineSwitches: demoSpines,
      money: 487250,
      tickCount: 1200,
      gameHour: 14,
      gameSpeed: 0 as GameSpeed,  // start paused so user can explore
      coolingType: 'water' as CoolingType,
      suiteTier: 'professional' as SuiteTier,
      generators: demoGenerators,
      suppressionType: 'gas_suppression' as SuppressionType,
      unlockedTech: demoUnlockedTech,
      activeResearch: null,
      rdSpent: 75000,
      reputationScore: 72,
      uptimeTicks: 950,
      totalOperatingTicks: 1200,
      totalRefreshes: 3,
      achievements: demoAchievements,
      newAchievement: null,
      loans: [],
      loanPayments: 0,
      activeIncidents: [],
      incidentLog: ['Cooling sensor alarm cleared', 'Power fluctuation resolved', 'Network loop detected and resolved'],
      resolvedCount: 8,
      contractOffers: [],
      activeContracts: demoActiveContracts,
      contractLog: ['DevForge contract completed', 'StartupCo contract completed', 'PixelDream contract completed', 'ShopEngine contract completed'],
      contractRevenue: 3500,
      contractPenalties: 0,
      completedContracts: 4,
      insurancePolicies: ['fire_insurance' as InsurancePolicyType, 'power_insurance' as InsurancePolicyType, 'cyber_insurance' as InsurancePolicyType],
      insurancePayouts: 15000,
      stockPrice: 85,
      stockHistory: Array.from({ length: 50 }, (_, i) => 30 + i + Math.floor(Math.random() * 10)),
      drillsCompleted: 2,
      drillsPassed: 2,
      // Infrastructure
      pdus: demoPDUs,
      cableTrays: demoCableTrays,
      cableRuns: demoCableRuns,
      busways: demoBusways,
      crossConnects: demoCrossConnects,
      inRowCoolers: demoInRowCoolers,
      // Staff
      staff: demoStaff,
      shiftPattern: 'day_night' as ShiftPattern,
      trainingQueue: [],
      staffCostPerTick: demoStaffCost,
      staffIncidentsResolved: 28,
      staffBurnouts: 0,
      // Traffic
      trafficStats: demoTrafficStats,
      trafficVisible: true,
      // Meet-me room & interconnects
      meetMeRoomTier: 1, // Standard tier (24 ports)
      interconnectPorts: demoInterconnectPorts,
      meetMeRevenue: 68,
      meetMeMaintenanceCost: 12,
      // Peering
      peeringAgreements: demoPeeringAgreements,
      peeringCostPerTick: 23,
      avgLatencyMs: 7,
      // Power redundancy
      powerRedundancy: 'N+1' as PowerRedundancy,
      powerRedundancyCost: 15,
      // Noise management
      noiseLevel: 45,
      communityRelations: 70,
      noiseComplaints: 2,
      noiseFinesAccumulated: 500,
      soundBarriersInstalled: 1,
      zoningRestricted: false,
      // Spot compute
      spotPriceMultiplier: 1.1,
      spotCapacityAllocated: 4,
      spotRevenue: 8,
      spotDemand: 0.65,
      spotHistoryPrices: Array.from({ length: 30 }, (_, i) => 0.8 + (i % 10) * 0.05 + Math.random() * 0.1),
      // Supply chain
      pendingOrders: [],
      inventory: { server: 3, leaf_switch: 1, spine_switch: 0, cabinet: 2 },
      supplyShortageActive: false,
      shortagePriceMultiplier: 1.0,
      shortageTicksRemaining: 0,
      // Weather
      currentSeason: 'summer' as Season,
      currentCondition: 'clear' as WeatherCondition,
      weatherAmbientModifier: 5,
      weatherConditionTicksRemaining: 8,
      seasonTickCounter: 40,
      seasonsExperienced: ['spring', 'summer'] as Season[],
      // Server config
      defaultServerConfig: 'balanced' as ServerConfig,
      // Maintenance
      maintenanceWindows: [],
      maintenanceCompletedCount: 6,
      maintenanceCoolingBoostTicks: 0,
      // Carbon & environmental
      energySource: 'grid_green' as EnergySource,
      carbonEmissionsPerTick: 3.5,
      lifetimeCarbonEmissions: 4200,
      carbonTaxRate: 2,
      carbonTaxPerTick: 7,
      greenCertifications: ['energy_star'] as GreenCert[],
      greenCertEligibleTicks: 50,
      waterUsagePerTick: 48,
      waterCostPerTick: 4.8,
      eWasteStockpile: 3,
      eWasteDisposed: 9,
      droughtActive: false,
      // Security & compliance
      securityTier: 'enhanced' as SecurityTier,
      installedSecurityFeatures: ['badge_access', 'cctv', 'biometric'] as SecurityFeatureId[],
      complianceCerts: [{ certId: 'soc2_type1' as ComplianceCertId, grantedAtTick: 800, expiresAtTick: 2000, auditInProgress: false, auditStartedTick: 0 }],
      securityMaintenanceCost: 18,
      intrusionsBlocked: 4,
      auditCooldown: 0,
      // Competitor AI
      competitors: demoCompetitors,
      competitorBids: [],
      playerMarketShare: 68,
      competitorContractsWon: 3,
      competitorContractsLost: 1,
      competitorOutperformTicks: 0,
      priceWarActive: false,
      priceWarTicksRemaining: 0,
      poachTarget: null,
      // Event log & history
      eventLog: demoEventLog,
      eventLogFilterCategory: null,
      capacityHistory: demoCapacityHistory,
      lifetimeStats: {
        totalRevenueEarned: 412500, totalExpensesPaid: 198300, totalIncidentsSurvived: 8,
        totalServersDeployed: 82, totalSpinesDeployed: 5, peakTemperatureReached: 78,
        longestUptimeStreak: 350, currentUptimeStreak: 250, totalFiresSurvived: 1,
        totalPowerOutages: 2, totalContractsCompleted: 4, totalContractsTerminated: 0,
        peakRevenueTick: 380, peakCabinetCount: 24, totalMoneyEarned: 487250,
      },
      // Tutorial (seen some tips already)
      seenTips: ['tip_first_cabinet', 'tip_first_server', 'tip_leaf_switch', 'tip_spine', 'tip_cooling', 'tip_heat', 'tip_contracts', 'tip_staff'],
      activeTip: null,
      tutorialEnabled: true,
      // Misc
      sandboxMode: false,
      fireActive: false,
      fireDamageTaken: 0,
      powerOutage: false,
      outageTicksRemaining: 0,
      powerPriceMultiplier: 1.05,
      powerPriceSpikeActive: false,
      powerPriceSpikeTicks: 0,
      placementMode: false,
      heatMapVisible: false,
      hasSaved: false,
      activeSlotId: null,
      ...calcStats(demoCabinets, demoSpines),
    })
  },

  exitDemo: () => {
    // Reset everything back to fresh game state
    nextCabId = 1
    nextSpineId = 1
    nextLoanId = 1
    nextIncidentId = 1
    nextContractId = 1
    nextGeneratorId = 1
    nextStaffId = 1
    set({
      isDemo: false,
      cabinets: [],
      spineSwitches: [],
      totalPower: 0,
      coolingPower: 0,
      money: 50000,
      pue: 0,
      avgHeat: SIM.ambientTemp,
      mgmtBonus: 0,
      gameSpeed: 1 as GameSpeed,
      tickCount: 0,
      revenue: 0,
      expenses: 0,
      powerCost: 0,
      coolingCost: 0,
      coolingType: 'air' as CoolingType,
      loans: [],
      loanPayments: 0,
      activeIncidents: [],
      incidentLog: [],
      resolvedCount: 0,
      achievements: [],
      newAchievement: null,
      contractOffers: [],
      activeContracts: [],
      contractLog: [],
      contractRevenue: 0,
      contractPenalties: 0,
      completedContracts: 0,
      generators: [],
      generatorFuelCost: 0,
      powerOutage: false,
      outageTicksRemaining: 0,
      suppressionType: 'none' as SuppressionType,
      fireActive: false,
      fireDamageTaken: 0,
      unlockedTech: [],
      activeResearch: null,
      rdSpent: 0,
      reputationScore: 20,
      uptimeTicks: 0,
      totalOperatingTicks: 0,
      powerPriceMultiplier: 1.0,
      powerPriceSpikeActive: false,
      powerPriceSpikeTicks: 0,
      totalRefreshes: 0,
      suiteTier: 'starter' as SuiteTier,
      pdus: [],
      cableTrays: [],
      cableRuns: [],
      aisleBonus: 0,
      aisleViolations: 0,
      messyCableCount: 0,
      pduOverloaded: false,
      infraIncidentBonus: 0,
      zones: [],
      zoneBonusRevenue: 0,
      placementMode: false,
      insurancePolicies: [],
      insuranceCost: 0,
      insurancePayouts: 0,
      drillCooldown: 0,
      lastDrillResult: null,
      drillsCompleted: 0,
      drillsPassed: 0,
      stockPrice: 10,
      stockHistory: [10],
      valuationMilestonesReached: [],
      patents: [],
      patentIncome: 0,
      rfpOffers: [],
      rfpsWon: 0,
      rfpsLost: 0,
      busways: [],
      crossConnects: [],
      inRowCoolers: [],
      sandboxMode: false,
      activeScenario: null,
      scenarioProgress: {},
      scenariosCompleted: [],
      networkTopology: { totalLinks: 0, healthyLinks: 0, oversubscriptionRatio: 0, avgUtilization: 0, redundancyLevel: 0 },
      heatMapVisible: false,
      hasSaved: false,
      staff: [],
      shiftPattern: 'day_only' as ShiftPattern,
      trainingQueue: [],
      staffCostPerTick: 0,
      staffIncidentsResolved: 0,
      staffBurnouts: 0,
      // Phase 5 resets
      pendingOrders: [],
      inventory: { server: 0, leaf_switch: 0, spine_switch: 0, cabinet: 0 },
      supplyShortageActive: false,
      shortagePriceMultiplier: 1.0,
      shortageTicksRemaining: 0,
      currentSeason: 'spring' as Season,
      currentCondition: 'clear' as WeatherCondition,
      weatherAmbientModifier: 2,
      weatherConditionTicksRemaining: 15,
      seasonTickCounter: 0,
      seasonsExperienced: ['spring'] as Season[],
      meetMeRoomTier: null,
      interconnectPorts: [],
      meetMeRevenue: 0,
      meetMeMaintenanceCost: 0,
      defaultServerConfig: 'balanced' as ServerConfig,
      peeringAgreements: [],
      peeringCostPerTick: 0,
      avgLatencyMs: 50,
      maintenanceWindows: [],
      maintenanceCompletedCount: 0,
      maintenanceCoolingBoostTicks: 0,
      powerRedundancy: 'N' as PowerRedundancy,
      powerRedundancyCost: 0,
      noiseLevel: 0,
      communityRelations: 80,
      noiseComplaints: 0,
      noiseFinesAccumulated: 0,
      soundBarriersInstalled: 0,
      zoningRestricted: false,
      spotPriceMultiplier: 1.0,
      spotCapacityAllocated: 0,
      spotRevenue: 0,
      spotDemand: 0.5,
      spotHistoryPrices: [1.0],
      eventLog: [],
      eventLogFilterCategory: null,
      capacityHistory: [],
      lifetimeStats: {
        totalRevenueEarned: 0, totalExpensesPaid: 0, totalIncidentsSurvived: 0,
        totalServersDeployed: 0, totalSpinesDeployed: 0, peakTemperatureReached: 22,
        longestUptimeStreak: 0, currentUptimeStreak: 0, totalFiresSurvived: 0,
        totalPowerOutages: 0, totalContractsCompleted: 0, totalContractsTerminated: 0,
        peakRevenueTick: 0, peakCabinetCount: 0, totalMoneyEarned: 0,
      },
      seenTips: [],
      activeTip: null,
      tutorialEnabled: true,
      activeSlotId: null,
      // Phase 4B — Carbon & Environmental
      energySource: 'grid_mixed' as EnergySource,
      carbonEmissionsPerTick: 0,
      lifetimeCarbonEmissions: 0,
      carbonTaxRate: 0,
      carbonTaxPerTick: 0,
      greenCertifications: [] as GreenCert[],
      greenCertEligibleTicks: 0,
      waterUsagePerTick: 0,
      waterCostPerTick: 0,
      eWasteStockpile: 0,
      eWasteDisposed: 0,
      droughtActive: false,
      // Phase 4C — Security & Compliance
      securityTier: 'basic' as SecurityTier,
      installedSecurityFeatures: ['badge_access'] as SecurityFeatureId[],
      complianceCerts: [] as ActiveComplianceCert[],
      securityMaintenanceCost: 0,
      intrusionsBlocked: 0,
      auditCooldown: 0,
      // Phase 4D — Competitor AI
      competitors: [] as Competitor[],
      competitorBids: [] as CompetitorBid[],
      playerMarketShare: 100,
      competitorContractsWon: 0,
      competitorContractsLost: 0,
      competitorOutperformTicks: 0,
      priceWarActive: false,
      priceWarTicksRemaining: 0,
      poachTarget: null,
    })
  },

  // ── Save / Load ────────────────────────────────────────────────

  saveGame: (slotId: number, name?: string) =>
    set((state) => {
      const saveData = {
        version: 'v0.3.0',
        timestamp: Date.now(),
        cabinets: state.cabinets,
        spineSwitches: state.spineSwitches,
        money: state.money,
        tickCount: state.tickCount,
        gameHour: state.gameHour,
        coolingType: state.coolingType,
        loans: state.loans,
        achievements: state.achievements,
        activeContracts: state.activeContracts,
        contractOffers: state.contractOffers,
        completedContracts: state.completedContracts,
        generators: state.generators,
        suppressionType: state.suppressionType,
        unlockedTech: state.unlockedTech,
        activeResearch: state.activeResearch,
        rdSpent: state.rdSpent,
        reputationScore: state.reputationScore,
        uptimeTicks: state.uptimeTicks,
        totalOperatingTicks: state.totalOperatingTicks,
        totalRefreshes: state.totalRefreshes,
        suiteTier: state.suiteTier,
        pdus: state.pdus,
        cableTrays: state.cableTrays,
        resolvedCount: state.resolvedCount,
        insurancePolicies: state.insurancePolicies,
        insurancePayouts: state.insurancePayouts,
        patents: state.patents,
        rfpsWon: state.rfpsWon,
        rfpsLost: state.rfpsLost,
        busways: state.busways,
        crossConnects: state.crossConnects,
        inRowCoolers: state.inRowCoolers,
        sandboxMode: state.sandboxMode,
        stockPrice: state.stockPrice,
        stockHistory: state.stockHistory,
        valuationMilestonesReached: state.valuationMilestonesReached,
        drillsCompleted: state.drillsCompleted,
        drillsPassed: state.drillsPassed,
        scenariosCompleted: state.scenariosCompleted,
        // Staff & HR
        staff: state.staff,
        shiftPattern: state.shiftPattern,
        trainingQueue: state.trainingQueue,
        staffIncidentsResolved: state.staffIncidentsResolved,
        staffBurnouts: state.staffBurnouts,
      }
      try {
        localStorage.setItem(SAVE_SLOT_PREFIX + slotId, JSON.stringify(saveData))

        // Update save index
        const index = getSaveIndex()
        const existing = index.find((s) => s.slotId === slotId)
        const meta: SaveSlotMeta = {
          slotId,
          name: name ?? existing?.name ?? `Save ${slotId}`,
          timestamp: Date.now(),
          money: state.money,
          tickCount: state.tickCount,
          suiteTier: state.suiteTier,
          cabinetCount: state.cabinets.length,
        }
        const newIndex = existing
          ? index.map((s) => (s.slotId === slotId ? meta : s))
          : [...index, meta]
        setSaveIndex(newIndex)

        return { hasSaved: true, activeSlotId: slotId, saveSlots: newIndex }
      } catch {
        return {}
      }
    }),

  loadGame: (slotId: number) => {
    try {
      const raw = localStorage.getItem(SAVE_SLOT_PREFIX + slotId)
      if (!raw) return false
      const data = JSON.parse(raw)
      restoreIdCounters(data)
      set((state) => ({
        ...state,
        cabinets: data.cabinets ?? state.cabinets,
        spineSwitches: data.spineSwitches ?? state.spineSwitches,
        money: data.money ?? state.money,
        tickCount: data.tickCount ?? state.tickCount,
        gameHour: data.gameHour ?? state.gameHour,
        coolingType: data.coolingType ?? state.coolingType,
        loans: data.loans ?? state.loans,
        achievements: data.achievements ?? state.achievements,
        activeContracts: data.activeContracts ?? state.activeContracts,
        contractOffers: data.contractOffers ?? state.contractOffers,
        completedContracts: data.completedContracts ?? state.completedContracts,
        generators: data.generators ?? state.generators,
        suppressionType: data.suppressionType ?? state.suppressionType,
        unlockedTech: data.unlockedTech ?? state.unlockedTech,
        activeResearch: data.activeResearch ?? state.activeResearch,
        rdSpent: data.rdSpent ?? state.rdSpent,
        reputationScore: data.reputationScore ?? state.reputationScore,
        uptimeTicks: data.uptimeTicks ?? state.uptimeTicks,
        totalOperatingTicks: data.totalOperatingTicks ?? state.totalOperatingTicks,
        totalRefreshes: data.totalRefreshes ?? state.totalRefreshes,
        suiteTier: data.suiteTier ?? state.suiteTier,
        pdus: data.pdus ?? state.pdus,
        cableTrays: data.cableTrays ?? state.cableTrays,
        resolvedCount: data.resolvedCount ?? state.resolvedCount,
        insurancePolicies: data.insurancePolicies ?? state.insurancePolicies,
        insurancePayouts: data.insurancePayouts ?? state.insurancePayouts,
        patents: data.patents ?? state.patents,
        rfpsWon: data.rfpsWon ?? state.rfpsWon,
        rfpsLost: data.rfpsLost ?? state.rfpsLost,
        busways: data.busways ?? state.busways,
        crossConnects: data.crossConnects ?? state.crossConnects,
        inRowCoolers: data.inRowCoolers ?? state.inRowCoolers,
        sandboxMode: data.sandboxMode ?? state.sandboxMode,
        stockPrice: data.stockPrice ?? state.stockPrice,
        stockHistory: data.stockHistory ?? state.stockHistory,
        valuationMilestonesReached: data.valuationMilestonesReached ?? state.valuationMilestonesReached,
        drillsCompleted: data.drillsCompleted ?? state.drillsCompleted,
        drillsPassed: data.drillsPassed ?? state.drillsPassed,
        scenariosCompleted: data.scenariosCompleted ?? state.scenariosCompleted,
        // Staff & HR
        staff: data.staff ?? state.staff,
        shiftPattern: data.shiftPattern ?? state.shiftPattern,
        trainingQueue: data.trainingQueue ?? state.trainingQueue,
        staffIncidentsResolved: data.staffIncidentsResolved ?? state.staffIncidentsResolved,
        staffBurnouts: data.staffBurnouts ?? state.staffBurnouts,
        activeSlotId: slotId,
        hasSaved: true,
        ...calcStats(data.cabinets ?? state.cabinets, data.spineSwitches ?? state.spineSwitches),
      }))
      return true
    } catch {
      return false
    }
  },

  deleteGame: (slotId: number) => {
    localStorage.removeItem(SAVE_SLOT_PREFIX + slotId)
    const newIndex = getSaveIndex().filter((s) => s.slotId !== slotId)
    setSaveIndex(newIndex)
    set((state) => ({
      saveSlots: newIndex,
      activeSlotId: state.activeSlotId === slotId ? null : state.activeSlotId,
    }))
  },

  resetGame: () => {
    nextCabId = 1
    nextSpineId = 1
    nextLoanId = 1
    nextIncidentId = 1
    nextContractId = 1
    nextGeneratorId = 1
    nextCompetitorId = 1
    set({
      cabinets: [],
      spineSwitches: [],
      totalPower: 0,
      coolingPower: 0,
      money: 50000,
      pue: 0,
      avgHeat: SIM.ambientTemp,
      mgmtBonus: 0,
      gameSpeed: 1 as GameSpeed,
      tickCount: 0,
      revenue: 0,
      expenses: 0,
      powerCost: 0,
      coolingCost: 0,
      coolingType: 'air' as CoolingType,
      loans: [],
      loanPayments: 0,
      activeIncidents: [],
      incidentLog: [],
      resolvedCount: 0,
      achievements: [],
      newAchievement: null,
      contractOffers: [],
      activeContracts: [],
      contractLog: [],
      contractRevenue: 0,
      contractPenalties: 0,
      completedContracts: 0,
      generators: [],
      generatorFuelCost: 0,
      powerOutage: false,
      outageTicksRemaining: 0,
      suppressionType: 'none' as SuppressionType,
      fireActive: false,
      fireDamageTaken: 0,
      unlockedTech: [],
      activeResearch: null,
      rdSpent: 0,
      reputationScore: 20,
      uptimeTicks: 0,
      totalOperatingTicks: 0,
      powerPriceMultiplier: 1.0,
      powerPriceSpikeActive: false,
      powerPriceSpikeTicks: 0,
      totalRefreshes: 0,
      suiteTier: 'starter' as SuiteTier,
      pdus: [],
      cableTrays: [],
      cableRuns: [],
      aisleBonus: 0,
      aisleViolations: 0,
      messyCableCount: 0,
      pduOverloaded: false,
      infraIncidentBonus: 0,
      zones: [],
      zoneBonusRevenue: 0,
      selectedCabinetId: null,
      placementMode: false,
      insurancePolicies: [],
      insuranceCost: 0,
      insurancePayouts: 0,
      drillCooldown: 0,
      lastDrillResult: null,
      drillsCompleted: 0,
      drillsPassed: 0,
      stockPrice: 10,
      stockHistory: [10],
      valuationMilestonesReached: [],
      patents: [],
      patentIncome: 0,
      rfpOffers: [],
      rfpsWon: 0,
      rfpsLost: 0,
      busways: [],
      crossConnects: [],
      inRowCoolers: [],
      sandboxMode: false,
      activeScenario: null,
      scenarioProgress: {},
      scenariosCompleted: [],
      networkTopology: { totalLinks: 0, healthyLinks: 0, oversubscriptionRatio: 0, avgUtilization: 0, redundancyLevel: 0 },
      heatMapVisible: false,
      hasSaved: false,
      // Staff & HR
      staff: [],
      shiftPattern: 'day_only' as ShiftPattern,
      trainingQueue: [],
      staffCostPerTick: 0,
      staffIncidentsResolved: 0,
      staffBurnouts: 0,
      // Phase 5 resets
      pendingOrders: [],
      inventory: { server: 0, leaf_switch: 0, spine_switch: 0, cabinet: 0 },
      supplyShortageActive: false,
      shortagePriceMultiplier: 1.0,
      shortageTicksRemaining: 0,
      currentSeason: 'spring' as Season,
      currentCondition: 'clear' as WeatherCondition,
      weatherAmbientModifier: 2,
      weatherConditionTicksRemaining: 15,
      seasonTickCounter: 0,
      seasonsExperienced: ['spring'] as Season[],
      meetMeRoomTier: null,
      interconnectPorts: [],
      meetMeRevenue: 0,
      meetMeMaintenanceCost: 0,
      defaultServerConfig: 'balanced' as ServerConfig,
      peeringAgreements: [],
      peeringCostPerTick: 0,
      avgLatencyMs: 50,
      maintenanceWindows: [],
      maintenanceCompletedCount: 0,
      maintenanceCoolingBoostTicks: 0,
      powerRedundancy: 'N' as PowerRedundancy,
      powerRedundancyCost: 0,
      noiseLevel: 0,
      communityRelations: 80,
      noiseComplaints: 0,
      noiseFinesAccumulated: 0,
      soundBarriersInstalled: 0,
      zoningRestricted: false,
      spotPriceMultiplier: 1.0,
      spotCapacityAllocated: 0,
      spotRevenue: 0,
      spotDemand: 0.5,
      spotHistoryPrices: [1.0],
      eventLog: [],
      eventLogFilterCategory: null,
      capacityHistory: [],
      lifetimeStats: {
        totalRevenueEarned: 0, totalExpensesPaid: 0, totalIncidentsSurvived: 0,
        totalServersDeployed: 0, totalSpinesDeployed: 0, peakTemperatureReached: 22,
        longestUptimeStreak: 0, currentUptimeStreak: 0, totalFiresSurvived: 0,
        totalPowerOutages: 0, totalContractsCompleted: 0, totalContractsTerminated: 0,
        peakRevenueTick: 0, peakCabinetCount: 0, totalMoneyEarned: 0,
      },
      seenTips: [],
      activeTip: null,
      tutorialEnabled: true,
      activeSlotId: null,
      // Operations Progression
      opsTier: 'manual' as OpsTier,
      opsAutoResolvedCount: 0,
      opsPreventedCount: 0,
    })
  },

  refreshSaveSlots: () =>
    set({ saveSlots: getSaveIndex() }),

  tick: () =>
    set((state) => {
      const newTickCount = state.tickCount + 1

      // Advance in-game clock (wraps at 24)
      const newHour = (state.gameHour + MINUTES_PER_TICK / 60) % 24

      // Calculate base demand from time-of-day curve
      const base = baseDemand(newHour)

      // Manage traffic spikes
      let spikeActive = state.spikeActive
      let spikeTicks = state.spikeTicks
      let spikeMagnitude = state.spikeMagnitude

      if (spikeActive) {
        spikeTicks--
        if (spikeTicks <= 0) {
          spikeActive = false
          spikeTicks = 0
          spikeMagnitude = 0
        }
      } else if (Math.random() < SPIKE_CHANCE) {
        // Start a new spike
        spikeActive = true
        spikeTicks = SPIKE_MIN_TICKS + Math.floor(Math.random() * (SPIKE_MAX_TICKS - SPIKE_MIN_TICKS + 1))
        spikeMagnitude = +(SPIKE_MIN_MAG + Math.random() * (SPIKE_MAX_MAG - SPIKE_MIN_MAG)).toFixed(2)
      }

      const demandMultiplier = +(base + (spikeActive ? spikeMagnitude : 0)).toFixed(2)

      // ── Incident system ────────────────────────────────────
      let activeIncidents = [...state.activeIncidents]
      let incidentLog = [...state.incidentLog]
      const resolvedCount = state.resolvedCount

      // Clean up resolved incidents and track hardware that needs restoration
      const justResolved = activeIncidents.filter((i) => i.resolved)
      activeIncidents = activeIncidents.filter((i) => !i.resolved)

      // Restore hardware from incidents resolved in the previous tick
      const restoredLeafCabIds = new Set<string>()
      const restoredSpineIds = new Set<string>()
      for (const inc of justResolved) {
        if (inc.def.effect === 'hardware_failure' && inc.affectedHardwareId) {
          if (inc.def.hardwareTarget === 'leaf') restoredLeafCabIds.add(inc.affectedHardwareId)
          if (inc.def.hardwareTarget === 'spine') restoredSpineIds.add(inc.affectedHardwareId)
        }
      }

      // ── Operations tier benefits ──────────────────────────────
      const opsTierConfig = OPS_TIER_CONFIG.find((c) => c.id === state.opsTier)
      const opsSpawnReduction = opsTierConfig?.benefits.incidentSpawnReduction ?? 0
      const opsAutoResolveBonus = opsTierConfig?.benefits.autoResolveSpeedBonus ?? 0
      const opsRevenuePenaltyReduction = opsTierConfig?.benefits.revenuePenaltyReduction ?? 0
      const opsStaffBonus = opsTierConfig?.benefits.staffEffectivenessBonus ?? 0
      let opsAutoResolvedCount = state.opsAutoResolvedCount
      let opsPreventedCount = state.opsPreventedCount

      // Spawn new incidents (only if we have equipment and fewer than max active)
      if (state.cabinets.length > 0 && activeIncidents.length < MAX_ACTIVE_INCIDENTS) {
        // Scale chance with facility size + messy cable penalty, reduced by ops tier
        const sizeMultiplier = Math.min(2, state.cabinets.length / 8)
        const cablingPenalty = state.infraIncidentBonus
        const baseSpawnChance = INCIDENT_CHANCE * sizeMultiplier + cablingPenalty
        const adjustedSpawnChance = baseSpawnChance * (1 - opsSpawnReduction)
        if (Math.random() < adjustedSpawnChance) {
          let selectedDef = INCIDENT_CATALOG[Math.floor(Math.random() * INCIDENT_CATALOG.length)]
          let affectedHwId: string | undefined

          // Hardware failure incidents need a valid target
          if (selectedDef.effect === 'hardware_failure') {
            const alreadyFailedIds = new Set(
              activeIncidents
                .filter(i => !i.resolved && i.def.effect === 'hardware_failure' && i.affectedHardwareId)
                .map(i => i.affectedHardwareId!)
            )
            if (selectedDef.hardwareTarget === 'spine') {
              const candidates = state.spineSwitches.filter(s => s.powerStatus && !alreadyFailedIds.has(s.id))
              if (candidates.length > 1) { // keep at least 1 spine alive
                affectedHwId = candidates[Math.floor(Math.random() * candidates.length)].id
              }
            } else if (selectedDef.hardwareTarget === 'leaf') {
              const candidates = state.cabinets.filter(c => c.hasLeafSwitch && c.powerStatus && !alreadyFailedIds.has(c.id))
              if (candidates.length > 0) {
                affectedHwId = candidates[Math.floor(Math.random() * candidates.length)].id
              }
            }
            if (!affectedHwId) {
              // No valid target — fall back to a non-hardware incident
              const fallbackDefs = INCIDENT_CATALOG.filter(d => d.effect !== 'hardware_failure')
              selectedDef = fallbackDefs[Math.floor(Math.random() * fallbackDefs.length)]
            }
          }

          const incident: ActiveIncident = {
            id: `inc-${nextIncidentId++}`,
            def: selectedDef,
            ticksRemaining: selectedDef.durationTicks,
            resolved: false,
            ...(affectedHwId ? { affectedHardwareId: affectedHwId } : {}),
          }
          activeIncidents.push(incident)
          incidentLog = [`New: ${selectedDef.label} — ${selectedDef.description}`, ...incidentLog].slice(0, 10)
        } else if (opsSpawnReduction > 0 && Math.random() < baseSpawnChance) {
          // Incident was prevented by ops tier
          opsPreventedCount++
        }
      }

      // Apply hardware failure incidents — disable affected equipment
      const failedSpineIds = new Set<string>()
      const failedLeafCabIds = new Set<string>()
      for (const inc of activeIncidents) {
        if (inc.resolved || inc.def.effect !== 'hardware_failure' || !inc.affectedHardwareId) continue
        if (inc.def.hardwareTarget === 'spine') failedSpineIds.add(inc.affectedHardwareId)
        if (inc.def.hardwareTarget === 'leaf') failedLeafCabIds.add(inc.affectedHardwareId)
      }
      // Don't restore hardware if another failure incident still targets it
      for (const id of failedSpineIds) restoredSpineIds.delete(id)
      for (const id of failedLeafCabIds) restoredLeafCabIds.delete(id)

      const spineSwitches = (failedSpineIds.size > 0 || restoredSpineIds.size > 0)
        ? state.spineSwitches.map(s => {
            if (failedSpineIds.has(s.id)) return { ...s, powerStatus: false }
            if (restoredSpineIds.has(s.id)) return { ...s, powerStatus: true }
            return s
          })
        : [...state.spineSwitches]

      // Calculate incident effects
      let incidentRevenueMult = 1
      let incidentPowerMult = 1
      let incidentCoolingMult = 1
      let incidentHeatAdd = 0
      let incidentTrafficMult = 1

      for (const inc of activeIncidents) {
        if (inc.resolved) continue
        switch (inc.def.effect) {
          case 'revenue_penalty': {
            // Ops tier reduces the severity of revenue penalties
            const reducedMag = inc.def.effectMagnitude + (1 - inc.def.effectMagnitude) * opsRevenuePenaltyReduction
            incidentRevenueMult *= reducedMag
            break
          }
          case 'power_surge': incidentPowerMult *= inc.def.effectMagnitude; break
          case 'cooling_failure': incidentCoolingMult *= inc.def.effectMagnitude; break
          case 'heat_spike': incidentHeatAdd += inc.def.effectMagnitude; break
          case 'traffic_drop': incidentTrafficMult *= inc.def.effectMagnitude; break
        }
      }

      // ── Tech tree effect helpers ──────────────────────────
      const hasTech = (id: string) => state.unlockedTech.includes(id)
      const techCoolingBonus = (hasTech('hot_aisle') ? 0.5 : 0) + (hasTech('immersion_cooling') ? 1.5 : 0)
      const techOverheadReduction = (hasTech('variable_fans') ? 0.15 : 0) + (hasTech('immersion_cooling') ? 0.25 : 0)
      const techRevenueBonus = hasTech('high_density') ? 0.15 : 0
      const techAiBonus = hasTech('gpu_clusters') ? 0.30 : 0
      const techLinkCapacity = hasTech('optical_interconnect') ? TRAFFIC.linkCapacityGbps * 2 : TRAFFIC.linkCapacityGbps
      const techCoolingFailureReduction = hasTech('redundant_cooling') ? 0.5 : 0

      // ── Staff & HR system ──────────────────────────────────
      let updatedStaff = [...state.staff]
      let trainingQueue = [...state.trainingQueue]
      let staffIncidentsResolved = state.staffIncidentsResolved
      let staffBurnouts = state.staffBurnouts

      // Determine shift coverage
      const isNightTime = newHour < 6 || newHour >= 22
      const shiftCoverage = state.shiftPattern === 'day_only'
        ? (isNightTime ? 0 : 1)
        : state.shiftPattern === 'day_night'
          ? (isNightTime ? 0.8 : 1)  // night shift at 80% effectiveness
          : 1  // round_the_clock: full coverage

      // Update staff on-shift status
      updatedStaff = updatedStaff.map((s) => ({
        ...s,
        onShift: state.shiftPattern === 'day_only' ? !isNightTime : true,
      }))

      // Staff cooling bonus: cooling specialists improve cooling efficiency
      const coolingSpecialists = updatedStaff.filter((s) => s.role === 'cooling_specialist' && s.onShift)
      const staffCoolingBonus = coolingSpecialists.reduce((sum, s) => {
        const bonus = s.skillLevel === 1 ? 0.05 : s.skillLevel === 2 ? 0.10 : 0.15
        return sum + bonus
      }, 0) * shiftCoverage

      // Staff incident resolution speed bonus
      const onShiftStaff = updatedStaff.filter((s) => s.onShift && s.fatigueLevel < 100)
      const networkEngineers = onShiftStaff.filter((s) => s.role === 'network_engineer')
      const electricians = onShiftStaff.filter((s) => s.role === 'electrician')

      // Calculate per-incident-type speed multipliers from staff (boosted by ops tier)
      const staffTrafficResolution = networkEngineers.reduce((sum, s) => {
        const bonus = s.skillLevel === 1 ? 0.25 : s.skillLevel === 2 ? 0.40 : 0.60
        return sum + bonus
      }, 0) * shiftCoverage * (1 + opsStaffBonus)
      const staffPowerResolution = electricians.reduce((sum, s) => {
        const bonus = s.skillLevel === 1 ? 0.25 : s.skillLevel === 2 ? 0.40 : 0.60
        return sum + bonus
      }, 0) * shiftCoverage * (1 + opsStaffBonus)

      // Apply staff-based incident speed reduction (in addition to tech bonuses)
      if (onShiftStaff.length > 0) {
        activeIncidents = activeIncidents.map((i) => {
          if (i.resolved) return i
          let staffSpeedBonus = 0
          if (i.def.effect === 'traffic_drop') staffSpeedBonus = staffTrafficResolution
          else if (i.def.effect === 'power_surge') staffSpeedBonus = staffPowerResolution
          // Generic small bonus from any staff for other incident types
          else staffSpeedBonus = Math.min(0.3, onShiftStaff.length * 0.05) * shiftCoverage * (1 + opsStaffBonus)
          const extraReduction = Math.random() < Math.min(0.8, staffSpeedBonus) ? 1 : 0
          if (extraReduction === 0) return i
          const remaining = i.ticksRemaining - extraReduction
          if (remaining <= 0) {
            incidentLog = [`Staff resolved: ${i.def.label}`, ...incidentLog].slice(0, 10)
            // Track resolved count for staff
            staffIncidentsResolved++
            // Track hardware restoration for staff-resolved incidents
            if (i.def.effect === 'hardware_failure' && i.affectedHardwareId) {
              if (i.def.hardwareTarget === 'leaf') restoredLeafCabIds.add(i.affectedHardwareId)
              if (i.def.hardwareTarget === 'spine') restoredSpineIds.add(i.affectedHardwareId)
            }
            // Add fatigue to responding staff
            const responders = i.def.effect === 'traffic_drop' ? networkEngineers
              : i.def.effect === 'power_surge' ? electricians
                : onShiftStaff.slice(0, 1)
            for (const resp of responders) {
              const idx = updatedStaff.findIndex((s) => s.id === resp.id)
              if (idx >= 0) {
                const newFatigue = Math.min(100, updatedStaff[idx].fatigueLevel + 15)
                updatedStaff[idx] = {
                  ...updatedStaff[idx],
                  fatigueLevel: newFatigue,
                  incidentsResolved: updatedStaff[idx].incidentsResolved + 1,
                }
                if (newFatigue >= 100) {
                  staffBurnouts++
                  incidentLog = [`Burnout: ${updatedStaff[idx].name} is exhausted!`, ...incidentLog].slice(0, 10)
                }
              }
            }
            return { ...i, ticksRemaining: 0, resolved: true }
          }
          return { ...i, ticksRemaining: remaining }
        })
      }

      // Natural incident tick-down — all unresolved incidents decrease timer each tick
      // auto_failover tech grants 30% chance of extra tick reduction
      // ops tier grants additional auto-resolve speed bonus
      const hasAutoFailover = state.unlockedTech.includes('auto_failover')
      activeIncidents = activeIncidents.map((i) => {
        if (i.resolved) return i
        const autoBonus = hasAutoFailover && Math.random() < 0.3 ? 1 : 0
        const opsBonus = opsAutoResolveBonus > 0 && Math.random() < opsAutoResolveBonus ? 1 : 0
        const remaining = i.ticksRemaining - 1 - autoBonus - opsBonus
        if (remaining <= 0) {
          if (opsBonus > 0) {
            incidentLog = [`Auto-resolved: ${i.def.label}`, ...incidentLog].slice(0, 10)
            opsAutoResolvedCount++
          } else {
            incidentLog = [`Expired: ${i.def.label}`, ...incidentLog].slice(0, 10)
          }
          // Track hardware restoration for incidents expiring this tick
          if (i.def.effect === 'hardware_failure' && i.affectedHardwareId) {
            if (i.def.hardwareTarget === 'leaf') restoredLeafCabIds.add(i.affectedHardwareId)
            if (i.def.hardwareTarget === 'spine') restoredSpineIds.add(i.affectedHardwareId)
          }
          return { ...i, ticksRemaining: 0, resolved: true }
        }
        return { ...i, ticksRemaining: remaining }
      })

      // Fatigue recovery: -2 per tick for on-shift staff (slow recovery), -5 for off-shift
      updatedStaff = updatedStaff.map((s) => ({
        ...s,
        fatigueLevel: Math.max(0, s.fatigueLevel - (s.onShift ? 2 : 5)),
      }))

      // Process training queue
      const completedTraining: string[] = []
      trainingQueue = trainingQueue
        .map((t) => ({ ...t, ticksRemaining: t.ticksRemaining - 1 }))
        .filter((t) => {
          if (t.ticksRemaining <= 0) {
            completedTraining.push(`${t.staffId}:${t.certification}`)
            return false
          }
          return true
        })

      // Apply completed certifications
      for (const ct of completedTraining) {
        const [staffId, certId] = ct.split(':')
        updatedStaff = updatedStaff.map((s) => {
          if (s.id === staffId && !s.certifications.includes(certId)) {
            incidentLog = [`Training complete: ${s.name} earned ${certId.toUpperCase()}`, ...incidentLog].slice(0, 10)
            return { ...s, certifications: [...s.certifications, certId] }
          }
          return s
        })
      }

      // Staff salary costs (calculated in final expenses)
      const staffSalaryCost = updatedStaff.reduce((sum, s) => sum + s.salaryPerTick, 0)
      const shiftOverhead = SHIFT_PATTERN_CONFIG[state.shiftPattern].costPerTick
      const staffCostPerTick = staffSalaryCost + shiftOverhead

      // ── Spot power pricing ───────────────────────────────
      let powerPriceMultiplier = state.powerPriceMultiplier
      let powerPriceSpikeActive = state.powerPriceSpikeActive
      let powerPriceSpikeTicks = state.powerPriceSpikeTicks

      if (powerPriceSpikeActive) {
        powerPriceSpikeTicks--
        if (powerPriceSpikeTicks <= 0) {
          powerPriceSpikeActive = false
          powerPriceSpikeTicks = 0
        }
      } else if (Math.random() < POWER_MARKET.spikeChance) {
        powerPriceSpikeActive = true
        powerPriceSpikeTicks = POWER_MARKET.spikeDuration
      }

      // Random walk with mean reversion
      const priceChange = (Math.random() - 0.5) * 2 * POWER_MARKET.volatility
      const reversion = (1.0 - powerPriceMultiplier) * POWER_MARKET.meanReversion
      powerPriceMultiplier = Math.max(
        POWER_MARKET.minMultiplier,
        Math.min(POWER_MARKET.maxMultiplier,
          +(powerPriceMultiplier + priceChange + reversion).toFixed(3)
        )
      )
      const effectivePowerPrice = powerPriceSpikeActive
        ? +(powerPriceMultiplier * POWER_MARKET.spikeMultiplier).toFixed(3)
        : powerPriceMultiplier

      // ── Power outage system ──────────────────────────────
      let powerOutage = state.powerOutage
      let outageTicksRemaining = state.outageTicksRemaining

      if (powerOutage) {
        outageTicksRemaining--
        if (outageTicksRemaining <= 0) {
          powerOutage = false
          outageTicksRemaining = 0
          incidentLog = ['Grid power restored.', ...incidentLog].slice(0, 10)
        }
      }

      // Power outages triggered by power_surge incidents (10% chance per tick while active)
      const hasPowerSurge = activeIncidents.some((i) => !i.resolved && i.def.effect === 'power_surge')
      if (!powerOutage && hasPowerSurge && Math.random() < 0.10) {
        powerOutage = true
        outageTicksRemaining = 5 + Math.floor(Math.random() * 8)
        incidentLog = ['GRID POWER OUTAGE! Generators needed!', ...incidentLog].slice(0, 10)
      }

      // ── Generator system ─────────────────────────────────
      let generatorFuelCost = 0
      let generatorPowerAvailable = 0

      const updatedGenerators = state.generators.map((gen) => {
        const g = { ...gen }
        if (g.status === 'running') {
          if (g.fuelRemaining <= 0) {
            g.status = 'cooldown'
            g.ticksUntilReady = g.config.cooldownTicks
          } else {
            g.fuelRemaining--
            generatorFuelCost += g.config.fuelCostPerTick
            generatorPowerAvailable += g.config.powerCapacityW
          }
        } else if (g.status === 'cooldown') {
          g.ticksUntilReady--
          if (g.ticksUntilReady <= 0) {
            g.status = 'standby'
            g.ticksUntilReady = 0
          }
        }
        // Auto-start generators during outage if on standby
        if (powerOutage && g.status === 'standby' && g.fuelRemaining > 0) {
          g.status = 'running'
          g.ticksUntilReady = 0
        }
        return g
      })

      // During outage: if generators can't cover total power, reduce revenue
      let outagePenalty = 1.0
      if (powerOutage) {
        // UPS bridge from tech tree
        const hasUpsBridge = hasTech('ups_upgrade')
        if (hasUpsBridge && outageTicksRemaining > (state.outageTicksRemaining - 5)) {
          // UPS covers first 5 ticks
          outagePenalty = 1.0
        } else if (generatorPowerAvailable <= 0) {
          outagePenalty = 0 // total blackout — no revenue
        } else {
          const totalDraw = (state.totalPower + state.coolingPower) || 1
          outagePenalty = Math.min(1.0, generatorPowerAvailable / totalDraw)
        }
      }

      // ── Fire system ──────────────────────────────────────
      let fireActive = state.fireActive
      let fireDamageTaken = state.fireDamageTaken

      // Fires triggered by critical temps or heat_spike incidents (3% per tick)
      const hasCriticalTemp = state.cabinets.some((c) => c.heatLevel >= SIM.criticalTemp)
      if (!fireActive && hasCriticalTemp && Math.random() < 0.03) {
        fireActive = true
        incidentLog = ['FIRE DETECTED! Suppression system activating...', ...incidentLog].slice(0, 10)
      }

      // ── Main simulation ────────────────────────────────────
      const coolingConfig = COOLING_CONFIG[state.coolingType]

      if (state.cabinets.length === 0 && state.spineSwitches.length === 0) {
        // Process loan payments even with no equipment
        let loanPayments = 0
        const updatedLoans = state.loans
          .map((loan) => {
            const payment = Math.min(loan.paymentPerTick, loan.remaining)
            loanPayments += payment
            return {
              ...loan,
              remaining: +(loan.remaining - payment).toFixed(2),
              ticksRemaining: loan.ticksRemaining - 1,
            }
          })
          .filter((loan) => loan.remaining > 0.01)

        // Progress research even with no equipment
        let activeResearch = state.activeResearch
        let unlockedTech = [...state.unlockedTech]
        if (activeResearch) {
          const remaining = activeResearch.ticksRemaining - 1
          if (remaining <= 0) {
            unlockedTech = [...unlockedTech, activeResearch.techId]
            incidentLog = [`Research complete: ${TECH_TREE.find((t) => t.id === activeResearch!.techId)?.label}`, ...incidentLog].slice(0, 10)
            activeResearch = null
          } else {
            activeResearch = { ...activeResearch, ticksRemaining: remaining }
          }
        }

        return {
          tickCount: newTickCount,
          gameHour: newHour,
          demandMultiplier,
          spikeActive,
          spikeTicks,
          spikeMagnitude,
          loans: updatedLoans,
          loanPayments: +loanPayments.toFixed(2),
          money: state.sandboxMode ? 999999999 : Math.round((state.money - loanPayments) * 100) / 100,
          activeIncidents,
          incidentLog,
          resolvedCount,
          powerPriceMultiplier,
          powerPriceSpikeActive,
          powerPriceSpikeTicks,
          generators: updatedGenerators,
          generatorFuelCost: 0,
          powerOutage,
          outageTicksRemaining,
          activeResearch,
          unlockedTech,
          drillCooldown: Math.max(0, state.drillCooldown - 1),
          rfpOffers: state.rfpOffers.map((r) => ({ ...r, bidWindowTicks: r.bidWindowTicks - 1 })).filter((r) => r.bidWindowTicks > 0),
        }
      }

      // Reduce cooling failure effect with redundant cooling tech
      if (techCoolingFailureReduction > 0) {
        incidentCoolingMult = 1 - (1 - incidentCoolingMult) * (1 - techCoolingFailureReduction)
      }

      // ── Infrastructure layout effects ──────────────────────
      const currentAisleBonus = calcAisleBonus(state.cabinets)
      const currentAisleViolations = countAisleViolations(state.cabinets)
      const currentZones = calcZones(state.cabinets)

      // Build lookup: cabinet ID → zone bonuses for quick per-cabinet access in revenue/heat loops
      const cabinetZoneBonuses = new Map<string, { revenueBonus: number; heatReduction: number }>()
      for (const zone of currentZones) {
        const cfg = zone.type === 'environment'
          ? ZONE_BONUS_CONFIG.environmentBonus[zone.key as CabinetEnvironment]
          : ZONE_BONUS_CONFIG.customerBonus[zone.key as CustomerType]
        for (const cabId of zone.cabinetIds) {
          const existing = cabinetZoneBonuses.get(cabId) ?? { revenueBonus: 0, heatReduction: 0 }
          // Stack both env and customer zone bonuses (a cabinet can be in both)
          existing.revenueBonus += cfg.revenueBonus
          existing.heatReduction += cfg.heatReduction
          cabinetZoneBonuses.set(cabId, existing)
        }
      }

      // Check PDU overloads
      let anyPDUOverloaded = false
      for (const pdu of state.pdus) {
        const pduConfig = PDU_OPTIONS.find((o) => o.label === pdu.label)
        if (pduConfig && isPDUOverloaded(pdu, state.cabinets, pduConfig)) {
          anyPDUOverloaded = true
        }
      }

      // Auto-route cables periodically (every 10 ticks)
      let cableRuns = state.cableRuns
      let messyCableCount = state.messyCableCount
      let infraIncidentBonus = state.infraIncidentBonus
      if (newTickCount % 10 === 0) {
        const leafCabinets = state.cabinets.filter((c) => c.hasLeafSwitch)
        const suiteLimits = getSuiteLimits(state.suiteTier)
        const newRuns: CableRun[] = []
        let cid = 1
        for (const cab of leafCabinets) {
          for (let si = 0; si < state.spineSwitches.length; si++) {
            const spine = state.spineSwitches[si]
            const length = calcCableLength(cab.col, cab.row, si, suiteLimits.rows)
            const usesTrays = state.cableTrays.some((tray) =>
              manhattanDist(tray.col, tray.row, cab.col, cab.row) <= 2
            )
            const capacityGbps = length > AISLE_CONFIG.maxCableLength
              ? TRAFFIC.linkCapacityGbps * (1 - AISLE_CONFIG.degradedCablePenalty)
              : TRAFFIC.linkCapacityGbps
            newRuns.push({
              id: `cable-${cid++}`,
              leafCabinetId: cab.id,
              spineId: spine.id,
              length,
              capacityGbps: +capacityGbps.toFixed(1),
              usesTrays,
            })
          }
        }
        cableRuns = newRuns
        messyCableCount = countMessyCables(newRuns)
        infraIncidentBonus = messyCableCount * AISLE_CONFIG.messyCablingPenalty
      }

      // 1. Update heat per cabinet (with customer type, spacing, and tech modifiers)
      const newCabinets = state.cabinets.map((cab) => {
        let heat = cab.heatLevel
        const envConfig = ENVIRONMENT_CONFIG[cab.environment]
        const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]

        if (cab.powerStatus) {
          // Heat generation scaled by environment AND customer type
          heat += cab.serverCount * SIM.heatPerServer * envConfig.heatMultiplier * custConfig.heatMultiplier
          if (cab.hasLeafSwitch) heat += SIM.heatPerLeaf

          // Aisle violation penalty: mixed facings in a row add extra heat
          const rowCabs = state.cabinets.filter((c) => c.row === cab.row)
          const rowFacings = new Set(rowCabs.map((c) => c.facing))
          if (rowFacings.size > 1) {
            heat += AISLE_CONFIG.heatPenaltyViolation
          }

          // Spacing heat effects: adjacency penalties and airflow bonuses
          heat += calcSpacingHeatEffect(cab, state.cabinets)

          // PDU overload: cabinets on overloaded PDUs generate extra heat
          if (anyPDUOverloaded) {
            const cabinetPDUs = state.pdus.filter((pdu) => {
              const cfg = PDU_OPTIONS.find((o) => o.label === pdu.label)
              return cfg && manhattanDist(pdu.col, pdu.row, cab.col, cab.row) <= cfg.range
            })
            for (const pdu of cabinetPDUs) {
              const cfg = PDU_OPTIONS.find((o) => o.label === pdu.label)
              if (cfg && isPDUOverloaded(pdu, state.cabinets, cfg)) {
                heat += 2.0 // overloaded PDU adds significant heat
              }
            }
          }
        }

        // In-row cooling bonus: nearby in-row coolers provide extra cooling
        let inRowBonus = 0
        for (const cooler of state.inRowCoolers) {
          const config = INROW_COOLING_OPTIONS.find((o) => o.label === cooler.label)
          if (config && manhattanDist(cooler.col, cooler.row, cab.col, cab.row) <= config.range) {
            inRowBonus += cooler.coolingBonus
          }
        }

        // Zone adjacency heat reduction
        const zoneBonus = cabinetZoneBonuses.get(cab.id)
        const zoneHeatReduction = zoneBonus ? zoneBonus.heatReduction : 0

        // Cooling dissipation (base + tech bonus + aisle bonus + in-row cooling + zone bonus; reduced by incident effects)
        const aisleCoolingBoost = currentAisleBonus * 2 // up to +0.6°C/tick extra cooling
        const zoneHeatBoost = zoneHeatReduction * SIM.heatPerServer // scale zone heat reduction relative to heat generation
        heat -= (coolingConfig.coolingRate + techCoolingBonus + aisleCoolingBoost + inRowBonus + staffCoolingBonus + zoneHeatBoost) * incidentCoolingMult

        // Incident heat spike
        heat += incidentHeatAdd

        // Fire adds extra heat
        if (fireActive) heat += 5

        // Clamp to ambient minimum and 100 max
        heat = Math.max(SIM.ambientTemp, Math.min(100, heat))

        // Age servers (depreciation)
        const newAge = cab.powerStatus ? cab.serverAge + 1 : cab.serverAge

        // Disable leaf switch if affected by hardware failure incident, restore if just resolved
        const leafFailed = failedLeafCabIds.has(cab.id)
        const leafRestored = restoredLeafCabIds.has(cab.id)
        return { ...cab, heatLevel: Math.round(heat * 10) / 10, serverAge: newAge, ...(leafFailed ? { hasLeafSwitch: false } : leafRestored ? { hasLeafSwitch: true } : {}) }
      })

      // Handle fire suppression
      let fireEquipmentDamage = 0
      if (fireActive) {
        const suppConfig = SUPPRESSION_CONFIG[state.suppressionType]
        if (suppConfig.effectiveness > 0 && Math.random() < suppConfig.effectiveness) {
          // Fire suppressed
          fireActive = false
          if (suppConfig.equipmentDamage) {
            // Water suppression damages equipment — lose ~25% of a random cabinet's servers
            const targetIdx = Math.floor(Math.random() * newCabinets.length)
            const target = newCabinets[targetIdx]
            if (target && target.serverCount > 1) {
              const lost = Math.ceil(target.serverCount * 0.25)
              newCabinets[targetIdx] = { ...target, serverCount: Math.max(1, target.serverCount - lost) }
              fireEquipmentDamage = lost * COSTS.server
              fireDamageTaken += fireEquipmentDamage
              incidentLog = [`Fire suppressed (water) — ${lost} server(s) destroyed`, ...incidentLog].slice(0, 10)
            } else {
              incidentLog = ['Fire suppressed (water) — minimal damage', ...incidentLog].slice(0, 10)
            }
          } else {
            incidentLog = ['Fire suppressed (gas) — no equipment damage', ...incidentLog].slice(0, 10)
          }
        } else if (state.suppressionType === 'none') {
          // No suppression — fire burns for longer and causes damage
          const targetIdx = Math.floor(Math.random() * newCabinets.length)
          const target = newCabinets[targetIdx]
          if (target && Math.random() < 0.15) {
            newCabinets[targetIdx] = { ...target, serverCount: Math.max(1, target.serverCount - 1) }
            fireEquipmentDamage = COSTS.server
            fireDamageTaken += fireEquipmentDamage
            incidentLog = ['Fire damage — server destroyed!', ...incidentLog].slice(0, 10)
          }
          // Fire burns out eventually (20% chance per tick)
          if (Math.random() < 0.20) {
            fireActive = false
            incidentLog = ['Fire burned out on its own.', ...incidentLog].slice(0, 10)
          }
        }
      }

      // Fire spread to adjacent cabinets (dense placement = faster spread)
      if (fireActive && newCabinets.length > 1) {
        const criticalCabs = newCabinets.filter((c) => c.heatLevel >= SIM.criticalTemp)
        let spreadCount = 0
        for (const hotCab of criticalCabs) {
          if (spreadCount >= SPACING_CONFIG.fireSpreadMaxPerTick) break
          const adjacents = getAdjacentCabinets(hotCab, newCabinets)
          for (const adj of adjacents) {
            if (spreadCount >= SPACING_CONFIG.fireSpreadMaxPerTick) break
            if (adj.heatLevel < SIM.criticalTemp - 10 && Math.random() < SPACING_CONFIG.fireSpreadChance) {
              const adjIdx = newCabinets.findIndex((c) => c.id === adj.id)
              if (adjIdx >= 0) {
                newCabinets[adjIdx] = { ...newCabinets[adjIdx], heatLevel: Math.min(100, newCabinets[adjIdx].heatLevel + 8) }
                spreadCount++
              }
            }
          }
        }
        if (spreadCount > 0) {
          incidentLog = [`Fire spreading to adjacent cabinets! (${spreadCount} affected)`, ...incidentLog].slice(0, 10)
        }
      }

      // 2. Calculate stats with updated heat
      const stats = calcStats(newCabinets, spineSwitches)

      // Apply cooling type overhead reduction + tech overhead reduction + aisle bonus
      const totalOverheadReduction = Math.min(0.9, coolingConfig.overheadReduction + techOverheadReduction + currentAisleBonus)
      const adjustedCoolingPower = Math.round(
        stats.coolingPower * (1 - totalOverheadReduction) * coolingConfig.operatingCostMult
      )

      // 3. Calculate revenue (with customer type, depreciation, tech bonuses, outage penalty)
      let revenue = 0
      for (const cab of newCabinets) {
        if (cab.powerStatus) {
          const envConfig = ENVIRONMENT_CONFIG[cab.environment]
          const custConfig = CUSTOMER_TYPE_CONFIG[cab.customerType]

          // Depreciation efficiency: decays after revenueDecayStart of lifespan
          let depreciationEff = 1.0
          const lifeProgress = cab.serverAge / DEPRECIATION.serverLifespanTicks
          if (lifeProgress > DEPRECIATION.revenueDecayStart) {
            const decayProgress = (lifeProgress - DEPRECIATION.revenueDecayStart) / (1 - DEPRECIATION.revenueDecayStart)
            depreciationEff = Math.max(DEPRECIATION.efficiencyFloor, 1 - decayProgress * (1 - DEPRECIATION.efficiencyFloor))
          }

          let baseRevenue = cab.serverCount * SIM.revenuePerServer
            * envConfig.revenueMultiplier
            * custConfig.revenueMultiplier
            * depreciationEff

          // Tech bonuses
          baseRevenue *= (1 + techRevenueBonus)
          if (cab.customerType === 'ai_training') baseRevenue *= (1 + techAiBonus)

          // Zone adjacency bonus: cabinets in organized zones earn more
          const cabZoneBonus = cabinetZoneBonuses.get(cab.id)
          if (cabZoneBonus && cabZoneBonus.revenueBonus > 0) {
            baseRevenue *= (1 + cabZoneBonus.revenueBonus)
          }

          // PDU overload penalty: cabinets on tripped PDUs earn nothing
          if (anyPDUOverloaded) {
            const cabinetPDUs = state.pdus.filter((pdu) => {
              const cfg = PDU_OPTIONS.find((o) => o.label === pdu.label)
              return cfg && manhattanDist(pdu.col, pdu.row, cab.col, cab.row) <= cfg.range
            })
            const isOnOverloaded = cabinetPDUs.some((pdu) => {
              const cfg = PDU_OPTIONS.find((o) => o.label === pdu.label)
              return cfg && isPDUOverloaded(pdu, state.cabinets, cfg)
            })
            if (isOnOverloaded && cabinetPDUs.length > 0) {
              baseRevenue *= 0.5 // 50% revenue penalty for overloaded PDU
            }
          }

          // Throttled servers earn half revenue
          const throttled = cab.heatLevel >= SIM.throttleTemp
          revenue += throttled ? baseRevenue * 0.5 : baseRevenue
        }
      }
      revenue *= incidentRevenueMult * outagePenalty

      // Calculate zone bonus revenue for display (difference vs. what revenue would be without zone bonuses)
      let zoneBonusRevenue = 0
      for (const cab of newCabinets) {
        if (cab.powerStatus) {
          const cabZoneBonus = cabinetZoneBonuses.get(cab.id)
          if (cabZoneBonus && cabZoneBonus.revenueBonus > 0) {
            const envCfg = ENVIRONMENT_CONFIG[cab.environment]
            const custCfg = CUSTOMER_TYPE_CONFIG[cab.customerType]
            const baseRev = cab.serverCount * SIM.revenuePerServer * envCfg.revenueMultiplier * custCfg.revenueMultiplier
            zoneBonusRevenue += baseRev * cabZoneBonus.revenueBonus
          }
        }
      }

      // Reputation bonus on contract revenue
      const repTier = getReputationTier(state.reputationScore)

      // 4. Calculate expenses (with spot pricing, incident power surge, customer type power draw)
      const effectivePower = Math.round(stats.totalPower * incidentPowerMult)
      const spotPowerCost = SIM.powerCostPerKW * effectivePowerPrice
      const powerCost = +(effectivePower / 1000 * spotPowerCost).toFixed(2)
      const coolingCost = +(adjustedCoolingPower / 1000 * spotPowerCost).toFixed(2)
      const expenses = +(powerCost + coolingCost + generatorFuelCost).toFixed(2)

      // 5. Process loan payments
      let loanPayments = 0
      const updatedLoans = state.loans
        .map((loan) => {
          const payment = Math.min(loan.paymentPerTick, loan.remaining)
          loanPayments += payment
          return {
            ...loan,
            remaining: +(loan.remaining - payment).toFixed(2),
            ticksRemaining: loan.ticksRemaining - 1,
          }
        })
        .filter((loan) => loan.remaining > 0.01)

      // 6. Process contracts — SLA checks, revenue, penalties
      const activeProductionServers = newCabinets
        .filter((c) => c.environment === 'production' && c.powerStatus)
        .reduce((sum, c) => sum + c.serverCount, 0)

      let contractRevenue = 0
      let contractPenalties = 0
      let contractLog = [...state.contractLog]
      let completedContracts = state.completedContracts

      const updatedContracts = state.activeContracts
        .map((contract) => {
          if (contract.status !== 'active') return contract

          // Check SLA: enough production servers online AND avg temp within limits
          const slaMet = activeProductionServers >= contract.def.minServers &&
            stats.avgHeat <= contract.def.maxTemp

          let consecutiveViolations = contract.consecutiveViolations
          let totalViolationTicks = contract.totalViolationTicks
          let totalEarned = contract.totalEarned
          let totalPenalties = contract.totalPenalties
          let status: 'active' | 'completed' | 'terminated' = contract.status

          if (slaMet) {
            consecutiveViolations = 0
            const tickRev = contract.def.revenuePerTick * (1 + repTier.contractBonus)
            contractRevenue += tickRev
            totalEarned += tickRev
          } else {
            consecutiveViolations++
            totalViolationTicks++
            contractPenalties += contract.def.penaltyPerTick
            totalPenalties += contract.def.penaltyPerTick
          }

          // Check for termination
          if (consecutiveViolations >= contract.def.terminationTicks) {
            status = 'terminated'
            contractLog = [`TERMINATED: ${contract.def.company} — SLA violated for ${consecutiveViolations} consecutive ticks`, ...contractLog].slice(0, 10)
            return { ...contract, consecutiveViolations, totalViolationTicks, totalEarned, totalPenalties, status: status as 'terminated', ticksRemaining: 0 }
          }

          // Check for completion
          const ticksRemaining = contract.ticksRemaining - 1
          if (ticksRemaining <= 0) {
            status = 'completed'
            completedContracts++
            contractRevenue += contract.def.completionBonus
            totalEarned += contract.def.completionBonus
            contractLog = [`COMPLETED: ${contract.def.company} — Bonus $${contract.def.completionBonus.toLocaleString()}!`, ...contractLog].slice(0, 10)
            return { ...contract, consecutiveViolations, totalViolationTicks, totalEarned, totalPenalties, status: status as 'completed', ticksRemaining: 0 }
          }

          return { ...contract, consecutiveViolations, totalViolationTicks, totalEarned, totalPenalties, ticksRemaining }
        })
        .filter((c) => c.status === 'active') // Remove completed/terminated

      // Generate new contract offers periodically (reputation affects quality)
      let contractOffers = state.contractOffers
      if (newTickCount % CONTRACT_OFFER_INTERVAL === 0 || (state.contractOffers.length === 0 && newCabinets.length >= 2)) {
        const eligible = CONTRACT_CATALOG.filter((def) => {
          const totalProdServers = newCabinets
            .filter((c) => c.environment === 'production')
            .reduce((sum, c) => sum + c.serverCount, 0)
          // Reputation gates higher-tier contracts
          if (def.tier === 'gold' && state.reputationScore < 50) return false
          if (def.tier === 'silver' && state.reputationScore < 25) return false
          return totalProdServers >= Math.ceil(def.minServers * 0.5)
        })
        if (eligible.length > 0) {
          const activeTypes = new Set(updatedContracts.map((c) => c.def.type))
          const available = eligible.filter((d) => !activeTypes.has(d.type))
          const shuffled = [...available].sort(() => Math.random() - 0.5)
          contractOffers = shuffled.slice(0, CONTRACT_OFFER_COUNT)
        }
      }

      // 7. Update money (now includes contract revenue/penalties)
      const netIncome = revenue + contractRevenue - expenses - loanPayments - contractPenalties
      const newMoney = Math.round((state.money + netIncome) * 100) / 100

      // 8. Calculate traffic flows (with tech link capacity override)
      const effectiveDemand = demandMultiplier * incidentTrafficMult
      const trafficStats = hasTech('optical_interconnect')
        ? calcTrafficWithCapacity(newCabinets, spineSwitches, effectiveDemand, techLinkCapacity)
        : calcTraffic(newCabinets, spineSwitches, effectiveDemand)

      // 9. Progress tech research
      let activeResearch = state.activeResearch
      let unlockedTech = [...state.unlockedTech]
      if (activeResearch) {
        const remaining = activeResearch.ticksRemaining - 1
        if (remaining <= 0) {
          unlockedTech = [...unlockedTech, activeResearch.techId]
          const techDef = TECH_TREE.find((t) => t.id === activeResearch!.techId)
          incidentLog = [`Research complete: ${techDef?.label}`, ...incidentLog].slice(0, 10)
          activeResearch = null
        } else {
          activeResearch = { ...activeResearch, ticksRemaining: remaining }
        }
      }

      // 10. Update reputation score
      const totalOperatingTicks = state.totalOperatingTicks + 1
      let reputationScore = state.reputationScore
      let uptimeTicks = state.uptimeTicks

      // Reputation increases with good operations, decreases with problems
      const allContractsSlasMet = updatedContracts.every((c) => c.consecutiveViolations === 0)
      if (allContractsSlasMet && !powerOutage && !fireActive) {
        uptimeTicks++
        // Slowly increase reputation
        if (reputationScore < 100) {
          reputationScore = Math.min(100, +(reputationScore + 0.05).toFixed(2))
        }
      } else {
        // Decrease reputation for problems
        if (powerOutage) reputationScore = Math.max(0, +(reputationScore - 0.3).toFixed(2))
        if (fireActive) reputationScore = Math.max(0, +(reputationScore - 0.5).toFixed(2))
        if (!allContractsSlasMet) reputationScore = Math.max(0, +(reputationScore - 0.15).toFixed(2))
      }
      // Bonus for completed contracts
      if (completedContracts > state.completedContracts) {
        reputationScore = Math.min(100, +(reputationScore + 2).toFixed(2))
      }
      // Penalty for terminated contracts
      const terminatedThisTick = state.activeContracts.length - updatedContracts.length -
        (completedContracts - state.completedContracts)
      if (terminatedThisTick > 0) {
        reputationScore = Math.max(0, +(reputationScore - 5 * terminatedThisTick).toFixed(2))
      }

      // ── Achievement checks ─────────────────────────────────
      const unlockedIds = new Set(state.achievements.map((a) => a.def.id))
      let newAchievement = state.newAchievement
      const newAchievements = [...state.achievements]

      const unlock = (id: string) => {
        if (unlockedIds.has(id)) return
        const def = ACHIEVEMENT_CATALOG.find((a) => a.id === id)
        if (!def) return
        const ach: Achievement = { def, unlockedAtTick: newTickCount }
        newAchievements.push(ach)
        unlockedIds.add(id)
        newAchievement = ach
      }

      if (newCabinets.length >= 1) unlock('first_cabinet')
      if (newCabinets.length >= 10) unlock('ten_cabinets')
      if (newCabinets.length >= getSuiteLimits(state.suiteTier).maxCabinets) unlock('full_grid')
      if (state.spineSwitches.length >= 1) unlock('first_spine')
      if (state.spineSwitches.length >= getSuiteLimits(state.suiteTier).maxSpines) unlock('max_spines')
      if (newCabinets.some((c) => c.serverCount >= MAX_SERVERS_PER_CABINET && c.hasLeafSwitch)) unlock('full_rack')
      if (state.coolingType === 'water') unlock('water_cooling')
      if (state.loans.length > 0 || updatedLoans.length > 0) unlock('first_loan')
      if (state.loans.length > 0 && updatedLoans.length === 0) unlock('debt_free')
      if (resolvedCount > state.resolvedCount || justResolved.length > 0) unlock('survive_incident')
      if (resolvedCount >= 5) unlock('five_incidents')
      if (newMoney >= 100000) unlock('hundred_k')
      if (newMoney >= 1000000) unlock('million')
      if (stats.pue > 0 && stats.pue <= 1.30) unlock('low_pue')
      if (newCabinets.some((c) => c.heatLevel >= SIM.criticalTemp)) unlock('thermal_crisis')
      if (state.activeContracts.length > 0 || updatedContracts.length > 0) unlock('first_contract')
      if (completedContracts > 0) unlock('contract_complete')
      if (state.activeContracts.some((c) => c.def.tier === 'gold') || updatedContracts.some((c) => c.def.tier === 'gold')) unlock('gold_contract')
      if (updatedContracts.length >= 3) unlock('three_contracts')
      // New achievements for Phase 2/3 features
      if (updatedGenerators.length >= 1) unlock('first_generator')
      if (state.suppressionType !== 'none') unlock('fire_ready')
      if (unlockedTech.length >= 1) unlock('first_research')
      if (unlockedTech.length >= 6) unlock('tech_savvy')
      if (reputationScore >= 75) unlock('excellent_rep')
      if (state.totalRefreshes >= 1) unlock('hardware_refresh')
      if (state.suiteTier !== 'starter') unlock('suite_upgrade')
      if (state.suiteTier === 'enterprise') unlock('enterprise_suite')
      // Infrastructure achievements
      if (state.pdus.length >= 1) unlock('first_pdu')
      if (state.cableTrays.length >= 1) unlock('first_cable_tray')
      if (currentAisleBonus > 0) unlock('proper_aisles')
      if (currentZones.length > 0) unlock('first_zone')
      if (cableRuns.length > 0 && messyCableCount === 0) unlock('clean_cabling')

      // ── Insurance system ──────────────────────────────────────
      let insuranceCost = 0
      let insurancePayouts = state.insurancePayouts
      for (const policyType of state.insurancePolicies) {
        const config = INSURANCE_OPTIONS.find((o) => o.type === policyType)
        if (config) {
          insuranceCost += config.premiumPerTick
          // Check for payouts — match incident effects to policy coverage
          for (const inc of activeIncidents) {
            if (!inc.resolved && config.coveredEffects.includes(inc.def.effect)) {
              // Reduce incident effects based on insurance (first tick only via random)
              if (Math.random() < 0.1) {
                insurancePayouts += config.coverageAmount
                incidentLog = [`Insurance payout: $${config.coverageAmount.toLocaleString()} (${config.label})`, ...incidentLog].slice(0, 10)
              }
            }
          }
        }
      }

      // ── DR Drill cooldown ─────────────────────────────────────
      const drillCooldown = Math.max(0, state.drillCooldown - 1)

      // ── Patent income ─────────────────────────────────────────
      let patentIncome = 0
      for (const patent of state.patents) {
        patentIncome += patent.incomePerTick
      }

      // ── Stock price calculation ───────────────────────────────
      const totalRev = revenue + contractRevenue + patentIncome
      const totalExp = expenses + loanPayments + contractPenalties + insuranceCost + staffCostPerTick
      const profitability = totalRev - totalExp
      const basePrice = Math.max(1,
        (state.reputationScore * 0.5) +
        (newCabinets.length * 2) +
        (profitability * 0.3) +
        (completedContracts * 5) +
        (state.unlockedTech.length * 3) +
        (state.patents.length * 8)
      )
      // Add some volatility
      const stockVolatility = (Math.random() - 0.5) * 4
      const newStockPrice = Math.max(1, +(basePrice + stockVolatility).toFixed(2))
      const stockHistory = [...state.stockHistory, newStockPrice].slice(-50)

      // Check valuation milestones
      const valuationMilestonesReached = [...state.valuationMilestonesReached]
      let milestoneMoney = 0
      for (const milestone of VALUATION_MILESTONES) {
        if (!valuationMilestonesReached.includes(milestone.id) && newStockPrice >= milestone.targetPrice) {
          valuationMilestonesReached.push(milestone.id)
          milestoneMoney += milestone.reward
          incidentLog = [`Milestone: ${milestone.label}! Stock hit $${milestone.targetPrice} — bonus $${milestone.reward.toLocaleString()}`, ...incidentLog].slice(0, 10)
        }
      }

      // ── RFP offers ────────────────────────────────────────────
      let rfpOffers = state.rfpOffers
        .map((rfp) => ({ ...rfp, bidWindowTicks: rfp.bidWindowTicks - 1 }))
        .filter((rfp) => rfp.bidWindowTicks > 0)

      // Generate new RFP offers periodically
      if (newTickCount % RFP_CONFIG.offerInterval === 0 && newCabinets.length >= 4) {
        const eligible = CONTRACT_CATALOG.filter((def) => {
          if (def.tier === 'gold' && state.reputationScore < 50) return false
          if (def.tier === 'silver' && state.reputationScore < 25) return false
          return true
        })
        if (eligible.length > 0) {
          const def = eligible[Math.floor(Math.random() * eligible.length)]
          const competitor = RFP_CONFIG.competitorNames[Math.floor(Math.random() * RFP_CONFIG.competitorNames.length)]
          const competitorStrength = 20 + Math.floor(Math.random() * 60) + Math.floor(newTickCount / 50)
          const rfp: RFPOffer = {
            id: `rfp-${nextRFPId++}`,
            def,
            bidWindowTicks: RFP_CONFIG.bidWindowTicks,
            competitorName: competitor,
            competitorStrength: Math.min(100, competitorStrength),
          }
          rfpOffers = [...rfpOffers, rfp]
        }
      }

      // ── In-row cooling bonus ──────────────────────────────────
      // Applied during heat calculation above via per-cabinet proximity check
      // Here we just track the network topology stats

      // ── Network topology stats ────────────────────────────────
      const activeSpinesForTopo = spineSwitches.filter((s) => s.powerStatus)
      const leafCabsForTopo = newCabinets.filter((c) => c.hasLeafSwitch && c.powerStatus)
      const topoTotalLinks = leafCabsForTopo.length * activeSpinesForTopo.length
      const topoHealthyLinks = trafficStats.links.filter((l) => l.utilization < 0.95).length
      const topoAvgUtil = trafficStats.links.length > 0
        ? trafficStats.links.reduce((sum, l) => sum + l.utilization, 0) / trafficStats.links.length
        : 0
      const topoOversubRatio = leafCabsForTopo.length > 0 && activeSpinesForTopo.length > 0
        ? +(leafCabsForTopo.length / activeSpinesForTopo.length).toFixed(2)
        : 0
      const topoRedundancy = activeSpinesForTopo.length >= 2 ? Math.min(1, (activeSpinesForTopo.length - 1) / activeSpinesForTopo.length) : 0
      const networkTopology: NetworkTopologyStats = {
        totalLinks: topoTotalLinks,
        healthyLinks: topoHealthyLinks,
        oversubscriptionRatio: topoOversubRatio,
        avgUtilization: +topoAvgUtil.toFixed(3),
        redundancyLevel: +topoRedundancy.toFixed(2),
      }

      // ── Cross-connect bandwidth bonus ─────────────────────────
      const crossConnectBonus = state.crossConnects.reduce((sum, cc) => {
        const config = CROSSCONNECT_OPTIONS.find((o) => o.label === cc.label)
        return sum + (config?.bandwidthBonus ?? 0)
      }, 0)
      // Boost revenue slightly based on cross-connect optimization
      revenue *= (1 + Math.min(0.25, crossConnectBonus))

      // ── Scenario progress check ───────────────────────────────
      const scenarioProgress = { ...state.scenarioProgress }
      let scenariosCompleted = [...state.scenariosCompleted]
      if (state.activeScenario) {
        let allComplete = true
        for (const obj of state.activeScenario.objectives) {
          if (scenarioProgress[obj.id]) continue
          let value = 0
          switch (obj.type) {
            case 'money': value = newMoney + milestoneMoney + insurancePayouts - state.insurancePayouts; break
            case 'cabinets': value = newCabinets.length; break
            case 'revenue': value = revenue; break
            case 'pue': value = stats.pue; break
            case 'reputation': value = reputationScore; break
            case 'contracts': value = completedContracts; break
            case 'temperature': value = stats.avgHeat; break
            case 'ticks': value = newTickCount; break
          }
          const met = obj.comparison === 'gte' ? value >= obj.target : value <= obj.target
          if (met) scenarioProgress[obj.id] = true
          else allComplete = false
        }
        if (allComplete && !scenariosCompleted.includes(state.activeScenario.id)) {
          scenariosCompleted = [...scenariosCompleted, state.activeScenario.id]
          incidentLog = [`SCENARIO COMPLETE: ${state.activeScenario.label}!`, ...incidentLog].slice(0, 10)
        }
      }

      // ── Supply Chain system ─────────────────────────────────────
      let pendingOrders = [...state.pendingOrders]
      const inventory = { ...state.inventory }
      let supplyShortageActive = state.supplyShortageActive
      let shortagePriceMultiplier = state.shortagePriceMultiplier
      let shortageTicksRemaining = state.shortageTicksRemaining

      // Process orders
      pendingOrders = pendingOrders.map((order) => {
        if (order.status === 'delivered') return order
        const remaining = order.ticksRemaining - 1
        if (remaining <= 0) {
          inventory[order.itemType] = (inventory[order.itemType] ?? 0) + order.quantity
          return { ...order, ticksRemaining: 0, status: 'delivered' as OrderStatus }
        }
        const status: OrderStatus = remaining <= Math.ceil(order.leadTimeTicks / 2) ? 'in_transit' : 'pending'
        return { ...order, ticksRemaining: remaining, status }
      })
      pendingOrders = pendingOrders.filter((o) => o.status !== 'delivered' || o.ticksRemaining > -5)

      // Supply shortage events
      if (supplyShortageActive) {
        shortageTicksRemaining--
        if (shortageTicksRemaining <= 0) {
          supplyShortageActive = false
          shortagePriceMultiplier = 1.0
          incidentLog = ['Supply shortage ended — prices normalized.', ...incidentLog].slice(0, 10)
        }
      } else if (Math.random() < 0.005 && newCabinets.length >= 4) {
        supplyShortageActive = true
        shortageTicksRemaining = 30 + Math.floor(Math.random() * 20)
        shortagePriceMultiplier = +(1.5 + Math.random() * 1.5).toFixed(2)
        incidentLog = [`CHIP SHORTAGE! Equipment prices at ${shortagePriceMultiplier}x for ${shortageTicksRemaining} ticks.`, ...incidentLog].slice(0, 10)
      }

      // ── Weather system ────────────────────────────────────────────
      let currentSeason = state.currentSeason
      let currentCondition = state.currentCondition
      let weatherAmbientModifier = state.weatherAmbientModifier
      let weatherConditionTicksRemaining = state.weatherConditionTicksRemaining - 1
      let seasonTickCounter = state.seasonTickCounter + 1
      const seasonsExperienced = [...state.seasonsExperienced]

      // Season rotation
      const seasonConfig = SEASON_CONFIG.find((s) => s.season === currentSeason)
      if (seasonConfig && seasonTickCounter >= seasonConfig.durationTicks) {
        const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter']
        const idx = seasonOrder.indexOf(currentSeason)
        currentSeason = seasonOrder[(idx + 1) % 4]
        seasonTickCounter = 0
        if (!seasonsExperienced.includes(currentSeason)) seasonsExperienced.push(currentSeason)
        incidentLog = [`Season changed to ${SEASON_CONFIG.find((s) => s.season === currentSeason)?.label ?? currentSeason}.`, ...incidentLog].slice(0, 10)
      }

      // Weather condition rotation
      if (weatherConditionTicksRemaining <= 0) {
        const roll = Math.random()
        let cumulative = 0
        for (const wc of WEATHER_CONDITION_CONFIG) {
          cumulative += wc.chance
          if (roll <= cumulative) {
            currentCondition = wc.condition
            weatherConditionTicksRemaining = wc.minDuration + Math.floor(Math.random() * (wc.maxDuration - wc.minDuration))
            break
          }
        }
      }

      // Calculate ambient modifier
      const seasonMod = SEASON_CONFIG.find((s) => s.season === currentSeason)?.ambientModifier ?? 0
      const weatherMod = WEATHER_CONDITION_CONFIG.find((w) => w.condition === currentCondition)?.ambientModifier ?? 0
      weatherAmbientModifier = seasonMod + weatherMod

      // Storm events can trigger power incidents
      if (currentCondition === 'storm' && Math.random() < 0.08 && !powerOutage) {
        incidentLog = ['Storm causing power grid instability!', ...incidentLog].slice(0, 10)
      }

      // ── Meet-Me Room revenue ──────────────────────────────────────
      let meetMeRevenue = 0
      let meetMeMaintenanceCost = 0
      if (state.meetMeRoomTier !== null) {
        const roomConfig = MEETME_ROOM_CONFIG[state.meetMeRoomTier]
        if (roomConfig) meetMeMaintenanceCost = roomConfig.maintenanceCostPerTick
        // Network effect: +2% per 4 ports
        const networkBonus = 1 + Math.floor(state.interconnectPorts.length / 4) * 0.02
        for (const port of state.interconnectPorts) {
          meetMeRevenue += port.revenuePerTick * networkBonus
        }
      }

      // ── Network peering costs ─────────────────────────────────────
      let peeringCostPerTick = 0
      let avgLatencyMs = 50
      if (state.peeringAgreements.length > 0) {
        peeringCostPerTick = state.peeringAgreements.reduce((sum, p) => sum + p.costPerTick, 0)
        avgLatencyMs = Math.round(state.peeringAgreements.reduce((sum, p) => sum + p.latencyMs, 0) / state.peeringAgreements.length)
      }

      // ── Maintenance windows ───────────────────────────────────────
      let maintenanceCoolingBoostTicks = Math.max(0, state.maintenanceCoolingBoostTicks - 1)
      let maintenanceCompletedCount = state.maintenanceCompletedCount
      const maintenanceWindows = state.maintenanceWindows.map((w) => {
        if (w.status === 'completed') return w
        if (w.status === 'scheduled' && newTickCount >= w.scheduledTick) {
          return { ...w, status: 'in_progress' as MaintenanceStatus }
        }
        if (w.status === 'in_progress') {
          const remaining = w.durationTicks - (newTickCount - w.scheduledTick)
          if (remaining <= 0) {
            maintenanceCompletedCount++
            if (w.targetType === 'cooling') maintenanceCoolingBoostTicks = 50
            return { ...w, status: 'completed' as MaintenanceStatus, benefitApplied: true }
          }
        }
        return w
      }).filter((w) => w.status !== 'completed' || newTickCount - w.scheduledTick < 20)

      // ── Power redundancy costs ────────────────────────────────────
      const powerRedConfig = POWER_REDUNDANCY_CONFIG.find((c) => c.level === state.powerRedundancy)
      const powerRedundancyCost = powerRedConfig?.maintenanceCostPerTick ?? 0

      // ── Noise & Community ─────────────────────────────────────────
      const runningGens = updatedGenerators.filter((g) => g.status === 'running').length
      const noiseFromCooling = state.coolingType === 'air'
        ? newCabinets.length * NOISE_CONFIG.airCoolingPerCabinet
        : newCabinets.length * NOISE_CONFIG.waterCoolingPerCabinet
      const noiseFromGens = runningGens * NOISE_CONFIG.generatorNoise
      const noiseFromSpines = spineSwitches.filter((s) => s.powerStatus).length * NOISE_CONFIG.spineNoise
      const barrierReduction = state.soundBarriersInstalled * NOISE_CONFIG.soundBarrierReduction
      const noiseLevel = Math.max(0, noiseFromCooling + noiseFromGens + noiseFromSpines - barrierReduction)

      let noiseComplaints = state.noiseComplaints
      let noiseFinesAccumulated = state.noiseFinesAccumulated
      let communityRelations = state.communityRelations
      let zoningRestricted = state.zoningRestricted

      if (noiseLevel > NOISE_CONFIG.noiseLimit) {
        if (newTickCount % NOISE_CONFIG.complaintInterval === 0) {
          noiseComplaints++
          communityRelations = Math.max(0, communityRelations - NOISE_CONFIG.reputationPenaltyPerComplaint)
          incidentLog = [`Noise complaint #${noiseComplaints}! Noise: ${noiseLevel}dB (limit: ${NOISE_CONFIG.noiseLimit}dB)`, ...incidentLog].slice(0, 10)
          if (noiseComplaints >= NOISE_CONFIG.fineThreshold && noiseComplaints % NOISE_CONFIG.fineThreshold === 0) {
            noiseFinesAccumulated += NOISE_CONFIG.fineAmount
          }
          if (noiseComplaints >= NOISE_CONFIG.zoningRestrictionThreshold) {
            zoningRestricted = true
          }
        }
      } else {
        communityRelations = Math.min(100, communityRelations + 0.1)
        if (zoningRestricted && noiseLevel < NOISE_CONFIG.noiseLimit - 10) zoningRestricted = false
      }

      // ── Phase 4B: Carbon & Environmental ──────────────────────────
      const energyConfig = ENERGY_SOURCE_CONFIG[state.energySource]
      const carbonTaxBracket = CARBON_TAX_SCHEDULE.find((b) => newTickCount >= b.minTick && newTickCount < b.maxTick)
      const baseCarbonTaxRate = carbonTaxBracket?.rate ?? 0

      // Calculate carbon emissions based on total power and energy source
      const totalPowerKW = stats.totalPower / 1000
      const carbonEmissionsPerTick = +(totalPowerKW * energyConfig.carbonPerKW).toFixed(6)
      const lifetimeCarbonEmissions = +(state.lifetimeCarbonEmissions + carbonEmissionsPerTick).toFixed(4)

      // Carbon tax (reduced by green certs)
      const certTaxReduction = state.greenCertifications.reduce((sum, certId) => {
        const certConfig = GREEN_CERT_CONFIG.find((c) => c.id === certId)
        return sum + (certConfig?.carbonTaxReduction ?? 0)
      }, 0)
      const effectiveCarbonTaxRate = Math.max(0, baseCarbonTaxRate * (1 - Math.min(1, certTaxReduction)))
      const carbonTaxPerTick = +(carbonEmissionsPerTick * effectiveCarbonTaxRate).toFixed(4)

      // Water usage (only water cooling, affected by drought)
      const isDrought = state.activeIncidents.some((i) => i.def.type === 'drought' && !i.resolved)
      const waterMultiplier = isDrought ? WATER_USAGE_CONFIG.droughtPriceMultiplier : 1
      const waterCabinets = state.coolingType === 'water' ? newCabinets.filter((c) => c.powerStatus).length : 0
      const waterUsagePerTick = waterCabinets * WATER_USAGE_CONFIG.gallonsPerCabinetPerTick
      const waterCostPerTick = +(waterUsagePerTick * WATER_USAGE_CONFIG.costPerGallon * waterMultiplier).toFixed(2)

      // E-waste reputation penalty
      if (state.eWasteStockpile > EWASTE_CONFIG.reputationPenaltyThreshold) {
        reputationScore = Math.max(0, +(reputationScore - EWASTE_CONFIG.reputationPenaltyPerTick).toFixed(2))
      }

      // Green cert eligibility tracking
      let greenCertEligibleTicks = state.greenCertEligibleTicks
      const pueOk = stats.pue > 0 && stats.pue <= 1.4
      const isNonMixed = state.energySource !== 'grid_mixed'
      if (pueOk && (isNonMixed || carbonEmissionsPerTick < 0.001)) {
        greenCertEligibleTicks++
      } else {
        greenCertEligibleTicks = 0
      }

      // ── Phase 4C: Security & Compliance ───────────────────────────
      const securityTierConfig = SECURITY_TIER_CONFIG.find((c) => c.tier === state.securityTier)
      const securityMaintenanceCost = securityTierConfig?.maintenancePerTick ?? 0

      // Process compliance audits
      let complianceCerts = state.complianceCerts.map((cert) => {
        if (cert.auditInProgress) {
          const auditConfig = COMPLIANCE_CERT_CONFIG.find((c) => c.id === cert.certId)
          if (auditConfig && newTickCount - cert.auditStartedTick >= auditConfig.auditDurationTicks) {
            // Audit complete — grant cert
            return {
              ...cert,
              auditInProgress: false,
              grantedAtTick: newTickCount,
              expiresAtTick: newTickCount + auditConfig.auditInterval,
            }
          }
        }
        return cert
      })

      // Expire old certifications
      complianceCerts = complianceCerts.filter((cert) => {
        if (cert.auditInProgress) return true
        return cert.expiresAtTick > newTickCount
      })

      // Compliance revenue bonus on contracts
      const complianceRevenueBonus = complianceCerts
        .filter((c) => !c.auditInProgress && c.grantedAtTick > 0)
        .reduce((sum, cert) => {
          const config = COMPLIANCE_CERT_CONFIG.find((c) => c.id === cert.certId)
          return sum + (config?.revenueBonus ?? 0)
        }, 0)

      // Security intrusion chance reduction
      const totalIntrusionDefense = state.installedSecurityFeatures.reduce((sum, fId) => {
        const feat = SECURITY_FEATURE_CONFIG.find((f) => f.id === fId)
        return sum + (feat?.intrusionDefense ?? 0)
      }, 0)

      // Block security intrusion incidents based on defense
      let intrusionsBlocked = state.intrusionsBlocked
      const securityIncidentTypes = ['tailgating', 'social_engineering', 'break_in']
      activeIncidents = activeIncidents.map((inc) => {
        if (securityIncidentTypes.includes(inc.def.type) && !inc.resolved) {
          if (Math.random() < totalIntrusionDefense) {
            intrusionsBlocked++
            incidentLog = [`Security blocked: ${inc.def.label}`, ...incidentLog].slice(0, 10)
            return { ...inc, resolved: true }
          }
        }
        return inc
      })

      const auditCooldown = Math.max(0, state.auditCooldown - 1)

      // ── Phase 4D: Competitor AI ───────────────────────────────────
      let competitors = [...state.competitors]
      let competitorBids = [...state.competitorBids]
      const competitorContractsWon = state.competitorContractsWon
      let competitorContractsLost = state.competitorContractsLost
      let priceWarActive = state.priceWarActive
      let priceWarTicksRemaining = state.priceWarTicksRemaining
      let poachTarget = state.poachTarget

      // Spawn competitors over time
      const personalities: CompetitorPersonality[] = ['budget', 'premium', 'green', 'aggressive', 'steady']
      const customerSpecs: CustomerType[] = ['general', 'ai_training', 'streaming', 'crypto', 'enterprise']

      if (competitors.length < 1 && newTickCount >= COMPETITOR_SCALE_CONFIG.firstCompetitorTick) {
        competitors.push({
          id: `comp-${nextCompetitorId++}`,
          name: COMPETITOR_NAMES[0],
          personality: 'budget',
          strength: 15,
          specialization: customerSpecs[Math.floor(Math.random() * customerSpecs.length)],
          reputationScore: 20,
          securityTier: 'basic',
          greenCert: null,
          aggression: 0.4,
          techLevel: 0,
          marketShare: 0,
        })
        incidentLog = [`New competitor entered the market: ${COMPETITOR_NAMES[0]}`, ...incidentLog].slice(0, 10)
      }
      if (competitors.length < 2 && newTickCount >= COMPETITOR_SCALE_CONFIG.secondCompetitorTick) {
        const p = personalities[1 + Math.floor(Math.random() * 4)]
        competitors.push({
          id: `comp-${nextCompetitorId++}`,
          name: COMPETITOR_NAMES[competitors.length],
          personality: p,
          strength: 25,
          specialization: customerSpecs[Math.floor(Math.random() * customerSpecs.length)],
          reputationScore: 30,
          securityTier: 'basic',
          greenCert: null,
          aggression: COMPETITOR_PERSONALITIES[p].bidModifier + 0.5,
          techLevel: 1,
          marketShare: 0,
        })
        incidentLog = [`New competitor: ${COMPETITOR_NAMES[competitors.length - 1]}`, ...incidentLog].slice(0, 10)
      }
      if (competitors.length < 3 && newTickCount >= COMPETITOR_SCALE_CONFIG.thirdCompetitorTick) {
        const p = personalities[Math.floor(Math.random() * personalities.length)]
        competitors.push({
          id: `comp-${nextCompetitorId++}`,
          name: COMPETITOR_NAMES[competitors.length],
          personality: p,
          strength: 35,
          specialization: customerSpecs[Math.floor(Math.random() * customerSpecs.length)],
          reputationScore: 40,
          securityTier: 'enhanced',
          greenCert: null,
          aggression: COMPETITOR_PERSONALITIES[p].bidModifier + 0.5,
          techLevel: 2,
          marketShare: 0,
        })
        incidentLog = [`New competitor: ${COMPETITOR_NAMES[competitors.length - 1]}`, ...incidentLog].slice(0, 10)
      }

      // Grow competitors (rubber-banding)
      const playerStrength = newCabinets.length * 2 + state.reputationScore
      competitors = competitors.map((comp) => {
        const personality = COMPETITOR_PERSONALITIES[comp.personality]
        const rubberBand = playerStrength > comp.strength
          ? COMPETITOR_SCALE_CONFIG.rubberBandStrength
          : -COMPETITOR_SCALE_CONFIG.rubberBandStrength * 0.5
        const growth = COMPETITOR_SCALE_CONFIG.strengthGrowthRate * personality.growthRate + rubberBand
        const newStrength = Math.min(90, comp.strength + growth)
        const repGrowth = comp.personality === 'budget' ? -0.01 : 0.03
        return {
          ...comp,
          strength: +newStrength.toFixed(2),
          reputationScore: Math.min(85, Math.max(5, +(comp.reputationScore + repGrowth).toFixed(2))),
          techLevel: Math.min(9, comp.techLevel + (Math.random() < 0.005 ? 1 : 0)),
        }
      })

      // Competitor bidding on contracts
      if (contractOffers.length > 0 && competitors.length > 0) {
        // Remove expired bids
        competitorBids = competitorBids
          .map((b) => ({ ...b, ticksRemaining: b.ticksRemaining - 1 }))
          .filter((b) => b.ticksRemaining > 0)

        // Competitors may bid on open contracts
        for (const offer of contractOffers) {
          if (competitorBids.some((b) => b.contractType === offer.type)) continue
          for (const comp of competitors) {
            if (Math.random() < comp.aggression * 0.15) {
              const winChance = Math.min(0.8, (comp.strength + comp.reputationScore) /
                (playerStrength + state.reputationScore + 20) * 0.5)
              competitorBids.push({
                competitorId: comp.id,
                competitorName: comp.name,
                contractType: offer.type,
                winChance: +winChance.toFixed(2),
                ticksRemaining: COMPETITOR_SCALE_CONFIG.bidWindowTicks,
              })
              break // only one competitor per contract
            }
          }
        }

        // Check if competitors win any bids (contracts player hasn't accepted)
        const expiredBids = competitorBids.filter((b) => b.ticksRemaining <= 1)
        for (const bid of expiredBids) {
          if (Math.random() < bid.winChance) {
            competitorContractsLost++
            contractOffers = contractOffers.filter((o) => o.type !== bid.contractType)
            incidentLog = [`${bid.competitorName} won the ${bid.contractType} contract!`, ...incidentLog].slice(0, 10)
          }
        }
      }

      // Price war events
      if (priceWarActive) {
        priceWarTicksRemaining--
        if (priceWarTicksRemaining <= 0) priceWarActive = false
      } else if (competitors.length > 0 && Math.random() < COMPETITOR_SCALE_CONFIG.priceWarChance) {
        priceWarActive = true
        priceWarTicksRemaining = 30
        incidentLog = ['Price war! Competitor slashing rates — contract revenue reduced.', ...incidentLog].slice(0, 10)
      }

      // Staff poaching attempts
      if (!poachTarget && competitors.length > 0 && updatedStaff.length > 0 && Math.random() < COMPETITOR_SCALE_CONFIG.poachAttemptChance) {
        const target = updatedStaff[Math.floor(Math.random() * updatedStaff.length)]
        poachTarget = target.id
        incidentLog = [`Competitor trying to poach ${target.name}! Counter-offer or lose them.`, ...incidentLog].slice(0, 10)
      }

      // Process unresolved poach (staff leaves after 15 ticks if no counter)
      if (poachTarget && newTickCount % 15 === 0) {
        const targetStaff = updatedStaff.find((s) => s.id === poachTarget)
        if (targetStaff) {
          updatedStaff = updatedStaff.filter((s) => s.id !== poachTarget)
          incidentLog = [`${targetStaff.name} was poached by a competitor!`, ...incidentLog].slice(0, 10)
        }
        poachTarget = null
      }

      // Calculate market share
      const totalMarketStrength = competitors.reduce((sum, c) => sum + c.strength, 0) + playerStrength
      const playerMarketShare = totalMarketStrength > 0 ? Math.round(playerStrength / totalMarketStrength * 100) : 100
      competitors = competitors.map((comp) => ({
        ...comp,
        marketShare: totalMarketStrength > 0 ? Math.round(comp.strength / totalMarketStrength * 100) : 0,
      }))

      // Competitor outperform tracking
      let competitorOutperformTicks = state.competitorOutperformTicks
      if (competitors.length > 0 && competitors.every((c) => playerStrength > c.strength)) {
        competitorOutperformTicks++
      } else {
        competitorOutperformTicks = 0
      }

      // Price war revenue penalty (applied to contract revenue)
      const priceWarPenalty = priceWarActive ? 0.85 : 1.0

      // Green cert revenue bonus on contracts
      const greenCertRevenueBonus = state.greenCertifications.reduce((sum, certId) => {
        const config = GREEN_CERT_CONFIG.find((c) => c.id === certId)
        return sum + (config?.revenueBonus ?? 0)
      }, 0)

      // ── Spot Compute Market ───────────────────────────────────────
      let spotPriceMultiplier = state.spotPriceMultiplier
      const spotDemand = Math.max(0, Math.min(1, 1 - demandMultiplier * 0.5 + (Math.random() - 0.5) * 0.2))
      const spotPriceChange = (Math.random() - 0.5) * 2 * SPOT_COMPUTE_CONFIG.volatility
      const spotReversion = (1.0 - spotPriceMultiplier) * SPOT_COMPUTE_CONFIG.meanReversion
      const demandEffect = (spotDemand - 0.5) * SPOT_COMPUTE_CONFIG.baseDemandCorrelation * -1
      spotPriceMultiplier = Math.max(
        SPOT_COMPUTE_CONFIG.minPriceMultiplier,
        Math.min(SPOT_COMPUTE_CONFIG.maxPriceMultiplier,
          +(spotPriceMultiplier + spotPriceChange + spotReversion + demandEffect).toFixed(3)
        )
      )
      const spotCapacity = Math.min(state.spotCapacityAllocated,
        newCabinets.reduce((sum, c) => sum + (c.powerStatus ? c.serverCount : 0), 0))
      const spotRevenue = +(spotCapacity * SIM.revenuePerServer * spotPriceMultiplier).toFixed(2)
      const spotHistoryPrices = [...state.spotHistoryPrices, spotPriceMultiplier].slice(-50)

      // ── Event log ─────────────────────────────────────────────────
      const eventLog = [...state.eventLog]
      const logEvent = (category: EventCategory, message: string, severity: EventSeverity = 'info') => {
        eventLog.push({ tick: newTickCount, gameHour: newHour, category, message, severity })
        if (eventLog.length > 200) eventLog.splice(0, eventLog.length - 200)
      }
      // Log key events
      if (fireActive && !state.fireActive) logEvent('incident', 'Fire detected!', 'error')
      if (powerOutage && !state.powerOutage) logEvent('incident', 'Power outage!', 'error')
      if (supplyShortageActive && !state.supplyShortageActive) logEvent('system', `Chip shortage active (${shortagePriceMultiplier}x prices)`, 'warning')
      if (completedContracts > state.completedContracts) logEvent('contract', 'Contract completed!', 'success')
      if (currentSeason !== state.currentSeason) logEvent('system', `Season changed to ${currentSeason}`, 'info')
      // Phase 4 event logging
      if (state.energySource !== 'grid_mixed' && carbonTaxPerTick > 0) logEvent('finance', `Carbon tax: $${carbonTaxPerTick.toFixed(2)}/tick`, 'warning')
      if (priceWarActive && !state.priceWarActive) logEvent('system', 'Competitor price war started!', 'warning')
      if (competitors.length > state.competitors.length) logEvent('system', 'New competitor entered the market', 'info')
      if (intrusionsBlocked > state.intrusionsBlocked) logEvent('incident', 'Security intrusion blocked', 'success')
      if (complianceCerts.some((c) => !c.auditInProgress && c.grantedAtTick === newTickCount)) logEvent('achievement', 'Compliance certification granted!', 'success')
      if (opsAutoResolvedCount > state.opsAutoResolvedCount) logEvent('system', 'Ops automation auto-resolved an incident', 'success')
      if (opsPreventedCount > state.opsPreventedCount) logEvent('system', 'Ops monitoring prevented an incident', 'info')

      // ── Capacity history ──────────────────────────────────────────
      const capacityHistory = [...state.capacityHistory, {
        tick: newTickCount, power: stats.totalPower, heat: stats.avgHeat,
        revenue, cabinets: newCabinets.length, money: state.money,
      }].slice(-100)

      // ── Lifetime stats ────────────────────────────────────────────
      const lifetimeStats = { ...state.lifetimeStats }
      lifetimeStats.totalRevenueEarned += revenue + contractRevenue + spotRevenue + meetMeRevenue
      lifetimeStats.totalExpensesPaid += expenses + loanPayments + contractPenalties + insuranceCost + staffCostPerTick + peeringCostPerTick + powerRedundancyCost + meetMeMaintenanceCost + carbonTaxPerTick + waterCostPerTick + securityMaintenanceCost
      lifetimeStats.totalMoneyEarned += revenue + contractRevenue + spotRevenue + meetMeRevenue + patentIncome
      lifetimeStats.peakTemperatureReached = Math.max(lifetimeStats.peakTemperatureReached, stats.avgHeat)
      lifetimeStats.peakRevenueTick = Math.max(lifetimeStats.peakRevenueTick, revenue)
      lifetimeStats.peakCabinetCount = Math.max(lifetimeStats.peakCabinetCount, newCabinets.length)
      lifetimeStats.totalContractsCompleted = completedContracts
      if (powerOutage && !state.powerOutage) lifetimeStats.totalPowerOutages++
      if (fireActive && !state.fireActive) lifetimeStats.totalFiresSurvived++
      if (!fireActive && !powerOutage && activeIncidents.filter((i) => !i.resolved).length === 0) {
        lifetimeStats.currentUptimeStreak++
        lifetimeStats.longestUptimeStreak = Math.max(lifetimeStats.longestUptimeStreak, lifetimeStats.currentUptimeStreak)
      } else {
        lifetimeStats.currentUptimeStreak = 0
      }

      // ── Tutorial tip checks ───────────────────────────────────────
      let activeTip = state.activeTip
      if (state.tutorialEnabled && !activeTip) {
        const unseen = TUTORIAL_TIPS.filter((t) => !state.seenTips.includes(t.id))
        for (const tip of unseen) {
          let trigger = false
          if (tip.id === 'first_overheat' && newCabinets.some((c) => c.heatLevel > 60)) trigger = true
          if (tip.id === 'first_throttle' && newCabinets.some((c) => c.heatLevel >= 80)) trigger = true
          if (tip.id === 'first_low_money' && state.money < 1000 && newCabinets.length > 0) trigger = true
          if (tip.id === 'no_leaf_switch' && newCabinets.filter((c) => !c.hasLeafSwitch).length >= 3) trigger = true
          if (tip.id === 'no_spine' && newCabinets.some((c) => c.hasLeafSwitch) && spineSwitches.length === 0) trigger = true
          if (tip.id === 'first_incident' && activeIncidents.length > 0 && state.activeIncidents.length === 0) trigger = true
          if (tip.id === 'aisle_hint' && newCabinets.length >= 4 && state.aisleBonus === 0) trigger = true
          if (tip.id === 'zone_hint' && newCabinets.length >= 3 && currentZones.length === 0) trigger = true
          if (tip.id === 'first_contract' && state.contractOffers.length > 0 && state.activeContracts.length === 0 && completedContracts === 0) trigger = true
          if (tip.id === 'first_order_arrived' && pendingOrders.some(o => o.status === 'delivered')) trigger = true
          if (tip.id === 'weather_hot' && weatherAmbientModifier >= 3) trigger = true
          if (tip.id === 'weather_cold' && weatherAmbientModifier <= -3) trigger = true
          if (tip.id === 'supply_shortage' && supplyShortageActive) trigger = true
          if (tip.id === 'meet_me_room' && meetMeRevenue > 0) trigger = true
          if (tip.id === 'peering_active' && state.peeringAgreements.length > 0) trigger = true
          if (tip.id === 'maintenance_done' && maintenanceCompletedCount > 0 && state.maintenanceCompletedCount === 0) trigger = true
          if (tip.id === 'noise_warning' && noiseComplaints > state.noiseComplaints) trigger = true
          if (tip.id === 'spot_high' && spotPriceMultiplier > 1.5 && state.spotCapacityAllocated === 0) trigger = true
          if (tip.id === 'redundancy_hint' && state.powerRedundancy === 'N' && newCabinets.length >= 10) trigger = true
          if (tip.id === 'capacity_warning' && newCabinets.length >= getSuiteLimits(state.suiteTier).maxCabinets * 0.8) trigger = true
          // Phase 4B — Carbon tips
          if (tip.id === 'carbon_tax_rising' && baseCarbonTaxRate >= 5 && state.energySource === 'grid_mixed') trigger = true
          if (tip.id === 'ewaste_piling' && state.eWasteStockpile >= 8) trigger = true
          if (tip.id === 'green_cert_eligible' && greenCertEligibleTicks >= 100 && state.greenCertifications.length === 0) trigger = true
          // Phase 4C — Security tips
          if (tip.id === 'security_upgrade' && state.securityTier === 'basic' && newCabinets.length >= 8) trigger = true
          if (tip.id === 'intrusion_detected' && activeIncidents.some((i) => securityIncidentTypes.includes(i.def.type))) trigger = true
          if (tip.id === 'compliance_expiring' && complianceCerts.some((c) => !c.auditInProgress && c.expiresAtTick - newTickCount < 30)) trigger = true
          // Phase 4D — Competitor tips
          if (tip.id === 'competitor_appeared' && competitors.length === 1 && state.competitors.length === 0) trigger = true
          if (tip.id === 'competitor_bidding' && competitorBids.length > 0 && state.competitorBids.length === 0) trigger = true
          if (tip.id === 'price_war' && priceWarActive && !state.priceWarActive) trigger = true
          // Operations Progression tips
          if (tip.id === 'ops_upgrade_available' && state.opsTier !== 'orchestration') {
            const nextIdx = OPS_TIER_ORDER.indexOf(state.opsTier) + 1
            if (nextIdx < OPS_TIER_ORDER.length) {
              const nextConfig = OPS_TIER_CONFIG[nextIdx]
              const { minStaff, requiredTechs, minReputation, minSuiteTier } = nextConfig.unlockRequirements
              const suiteTierOrder: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']
              if (updatedStaff.length >= minStaff && requiredTechs.every((t) => state.unlockedTech.includes(t)) && reputationScore >= minReputation && suiteTierOrder.indexOf(state.suiteTier) >= suiteTierOrder.indexOf(minSuiteTier)) trigger = true
            }
          }
          if (trigger) { activeTip = tip; break }
        }
      }

      // ── Sandbox mode money ────────────────────────────────────
      const sandboxMoneyAdjust = state.sandboxMode ? 999999999 : 0

      // ── New feature achievements ──────────────────────────────
      if (state.insurancePolicies.length >= 1) unlock('first_insurance')
      if (state.insurancePolicies.length >= 4) unlock('fully_insured')
      if (state.drillsPassed >= 1) unlock('drill_passed')
      if (newStockPrice >= 100) unlock('stock_100')
      if (newStockPrice >= 500) unlock('stock_500')
      if (state.patents.length >= 1) unlock('first_patent')
      if (state.patents.length >= 5) unlock('all_patents')
      if (state.rfpsWon >= 1) unlock('rfp_won')
      if (state.busways.length >= 1) unlock('first_busway')
      if (state.crossConnects.length >= 1) unlock('first_crossconnect')
      if (state.inRowCoolers.length >= 1) unlock('first_inrow')
      if (state.sandboxMode) unlock('sandbox_activated')
      if (state.hasSaved) unlock('game_saved')
      if (scenariosCompleted.length > state.scenariosCompleted.length) unlock('scenario_complete')
      if (state.heatMapVisible) unlock('heat_map_used')
      // Staff & HR achievements
      if (updatedStaff.length >= 1) unlock('first_hire')
      if (updatedStaff.length >= MAX_STAFF_BY_TIER[state.suiteTier]) unlock('full_staff')
      if (staffIncidentsResolved >= 10 && staffBurnouts === 0) unlock('zero_fatigue')
      if (updatedStaff.length > 0 && updatedStaff.every((s) => s.certifications.length > 0)) unlock('certified_team')
      // Phase 5 achievements
      if (state.pendingOrders.length >= 1) unlock('first_order')
      if (Object.values(inventory).reduce((s, v) => s + v, 0) >= 20) unlock('stockpile')
      if (seasonsExperienced.length >= 4) unlock('four_seasons')
      if (state.meetMeRoomTier !== null) unlock('peering_point')
      if (state.interconnectPorts.length >= (MEETME_ROOM_CONFIG[state.meetMeRoomTier ?? 0]?.portCapacity ?? 99)) unlock('network_hub')
      if (state.peeringAgreements.length >= 1) unlock('connected')
      if (avgLatencyMs <= 5) unlock('zero_latency')
      if (maintenanceCompletedCount >= 5) unlock('preventive_care')
      if (state.powerRedundancy === 'N+1') unlock('redundant')
      if (state.powerRedundancy === '2N') unlock('belt_suspenders')
      if (noiseLevel <= NOISE_CONFIG.noiseLimit && newCabinets.length >= 10) unlock('good_neighbor')
      if (state.soundBarriersInstalled >= NOISE_CONFIG.maxSoundBarriers) unlock('sound_barrier')
      if (lifetimeStats.totalMoneyEarned >= 10000 && spotRevenue > 0) unlock('spot_trader')
      if (lifetimeStats.longestUptimeStreak >= 1000) unlock('ironman')
      if (state.seenTips.length >= 5) unlock('student')
      if (state.seenTips.length >= TUTORIAL_TIPS.length) unlock('graduate')
      // Phase 4B — Carbon & Environmental achievements
      if (state.energySource !== 'grid_mixed') unlock('green_power')
      if (state.greenCertifications.includes('carbon_neutral')) unlock('carbon_neutral_cert')
      if (state.coolingType === 'air' && newTickCount >= 100 && waterUsagePerTick === 0) unlock('water_wise')
      if (state.eWasteDisposed >= 20) unlock('clean_sweep')
      // Phase 4C — Security & Compliance achievements
      if (state.securityTier === 'high_security' || state.securityTier === 'maximum') unlock('locked_down')
      if (complianceCerts.filter((c) => !c.auditInProgress && c.grantedAtTick > 0).length >= 3) unlock('fully_compliant')
      if (intrusionsBlocked >= 10) unlock('fort_knox')
      // Check government contractor (completed a FedRAMP-gated contract)
      if (completedContracts > state.completedContracts) {
        const justCompleted = state.activeContracts.find((c) => c.status === 'active' && c.ticksRemaining <= 1)
        if (justCompleted && COMPLIANCE_CONTRACT_REQUIREMENTS[justCompleted.def.type] === 'fedramp') {
          unlock('gov_contractor')
        }
      }
      // Phase 4D — Competitor AI achievements
      if (playerMarketShare >= 50) unlock('market_leader')
      if (competitorContractsWon >= 5) unlock('monopoly')
      // Underdog: won a contract and any competitor has higher reputation
      if (competitorContractsWon > 0 && competitors.some((c) => c.reputationScore > state.reputationScore)) unlock('underdog')
      if (competitorOutperformTicks >= 100) unlock('rivalry')
      // Operations Progression achievements
      if (state.opsTier === 'monitoring' || OPS_TIER_ORDER.indexOf(state.opsTier) >= 1) unlock('script_kiddie')
      if (state.opsTier === 'automation' || OPS_TIER_ORDER.indexOf(state.opsTier) >= 2) unlock('sre')
      if (state.opsTier === 'orchestration') unlock('platform_engineer')
      if (opsAutoResolvedCount >= 20) unlock('lights_out')

      // Apply Phase 4 bonuses to contract revenue
      const adjustedContractRevenue = +(contractRevenue * (1 + complianceRevenueBonus + greenCertRevenueBonus) * priceWarPenalty).toFixed(2)

      // Recalculate final money with all income/expenses (Phase 4 + 5 included)
      const phase5Income = spotRevenue + meetMeRevenue
      const phase5Expenses = peeringCostPerTick + powerRedundancyCost + meetMeMaintenanceCost + (noiseComplaints > state.noiseComplaints && noiseComplaints % NOISE_CONFIG.fineThreshold === 0 ? NOISE_CONFIG.fineAmount : 0)
      const phase4Expenses = carbonTaxPerTick + waterCostPerTick + securityMaintenanceCost
      const finalNewMoney = state.sandboxMode
        ? 999999999
        : Math.round((state.money + revenue + adjustedContractRevenue + patentIncome + milestoneMoney + phase5Income + (insurancePayouts - state.insurancePayouts) - expenses - loanPayments - contractPenalties - insuranceCost - staffCostPerTick - phase5Expenses - phase4Expenses) * 100) / 100

      return {
        cabinets: newCabinets,
        spineSwitches,
        tickCount: newTickCount,
        revenue: +revenue.toFixed(2),
        expenses,
        powerCost,
        coolingCost,
        money: sandboxMoneyAdjust > 0 ? sandboxMoneyAdjust : finalNewMoney,
        trafficStats,
        gameHour: newHour,
        demandMultiplier,
        spikeActive,
        spikeTicks,
        spikeMagnitude,
        loans: updatedLoans,
        loanPayments: +loanPayments.toFixed(2),
        activeIncidents,
        incidentLog,
        resolvedCount,
        activeContracts: updatedContracts,
        contractOffers,
        contractLog,
        contractPenalties: +contractPenalties.toFixed(2),
        completedContracts,
        achievements: newAchievements,
        newAchievement,
        // New system states
        generators: updatedGenerators,
        generatorFuelCost: +generatorFuelCost.toFixed(2),
        powerOutage,
        outageTicksRemaining,
        fireActive,
        fireDamageTaken,
        unlockedTech,
        activeResearch,
        reputationScore,
        uptimeTicks,
        totalOperatingTicks,
        powerPriceMultiplier,
        powerPriceSpikeActive,
        powerPriceSpikeTicks,
        ...stats,
        coolingPower: adjustedCoolingPower,
        // Infrastructure state
        aisleBonus: currentAisleBonus,
        aisleViolations: currentAisleViolations,
        zones: currentZones,
        zoneBonusRevenue: +zoneBonusRevenue.toFixed(2),
        pduOverloaded: anyPDUOverloaded,
        cableRuns,
        messyCableCount,
        infraIncidentBonus,
        // New feature state
        insuranceCost: +insuranceCost.toFixed(2),
        insurancePayouts,
        drillCooldown,
        patentIncome: +patentIncome.toFixed(2),
        stockPrice: newStockPrice,
        stockHistory,
        valuationMilestonesReached,
        rfpOffers,
        networkTopology,
        scenarioProgress,
        scenariosCompleted,
        // Staff & HR
        staff: updatedStaff,
        trainingQueue,
        staffCostPerTick: +staffCostPerTick.toFixed(2),
        staffIncidentsResolved,
        staffBurnouts,
        // Phase 5 — Supply Chain
        pendingOrders,
        inventory,
        supplyShortageActive,
        shortagePriceMultiplier,
        shortageTicksRemaining,
        // Phase 5 — Weather
        currentSeason,
        currentCondition,
        weatherAmbientModifier,
        weatherConditionTicksRemaining,
        seasonTickCounter,
        seasonsExperienced,
        // Phase 5 — Interconnection
        meetMeRevenue: +meetMeRevenue.toFixed(2),
        meetMeMaintenanceCost: +meetMeMaintenanceCost.toFixed(2),
        // Phase 5 — Peering
        peeringCostPerTick: +peeringCostPerTick.toFixed(2),
        avgLatencyMs,
        // Phase 5 — Maintenance
        maintenanceWindows,
        maintenanceCompletedCount,
        maintenanceCoolingBoostTicks,
        // Phase 5 — Power Redundancy
        powerRedundancyCost: +powerRedundancyCost.toFixed(2),
        // Phase 5 — Noise
        noiseLevel,
        communityRelations: +communityRelations.toFixed(1),
        noiseComplaints,
        noiseFinesAccumulated,
        zoningRestricted,
        // Phase 5 — Spot Compute
        spotPriceMultiplier,
        spotRevenue,
        spotDemand: +spotDemand.toFixed(3),
        spotHistoryPrices,
        // Phase 5 — Event Log
        eventLog,
        // Phase 5 — Capacity
        capacityHistory,
        // Phase 5 — Statistics
        lifetimeStats,
        // Phase 5 — Tutorial
        activeTip,
        // Phase 4B — Carbon & Environmental
        carbonEmissionsPerTick,
        lifetimeCarbonEmissions,
        carbonTaxRate: effectiveCarbonTaxRate,
        carbonTaxPerTick,
        greenCertEligibleTicks,
        waterUsagePerTick,
        waterCostPerTick,
        droughtActive: isDrought,
        // Phase 4C — Security & Compliance
        complianceCerts,
        securityMaintenanceCost,
        intrusionsBlocked,
        auditCooldown,
        // Phase 4D — Competitor AI
        competitors,
        competitorBids,
        playerMarketShare,
        competitorContractsWon,
        competitorContractsLost,
        competitorOutperformTicks,
        priceWarActive,
        priceWarTicksRemaining,
        poachTarget,
        // Updated contract revenue (with Phase 4 bonuses)
        contractRevenue: +adjustedContractRevenue.toFixed(2),
        // Operations Progression
        opsAutoResolvedCount,
        opsPreventedCount,
      }
    }),
}))

/** Variant of calcTraffic that uses a custom link capacity (for optical interconnect tech) */
function calcTrafficWithCapacity(cabinets: Cabinet[], spines: SpineSwitch[], demandMultiplier: number, linkCapacity: number): TrafficStats {
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
