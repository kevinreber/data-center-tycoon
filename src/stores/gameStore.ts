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
export type CabinetFacing = 'north' | 'south'

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

// ── Suite Tier Config ──────────────────────────────────────────

export interface SuiteConfig {
  tier: SuiteTier
  label: string
  description: string
  cols: number              // cabinet grid columns
  rows: number              // cabinet grid rows
  maxCabinets: number       // cols * rows
  maxSpines: number         // spine switch slots
  upgradeCost: number       // cost to upgrade to this tier (0 for starter)
  color: string
}

export const SUITE_TIERS: Record<SuiteTier, SuiteConfig> = {
  starter: {
    tier: 'starter',
    label: 'Starter Suite',
    description: 'A small colocation closet. Enough room to get started.',
    cols: 4,
    rows: 2,
    maxCabinets: 8,
    maxSpines: 2,
    upgradeCost: 0,
    color: '#88aacc',
  },
  standard: {
    tier: 'standard',
    label: 'Standard Suite',
    description: 'A proper server room with room to grow.',
    cols: 6,
    rows: 3,
    maxCabinets: 18,
    maxSpines: 4,
    upgradeCost: 40000,
    color: '#00ff88',
  },
  professional: {
    tier: 'professional',
    label: 'Professional Suite',
    description: 'A full-size data hall with enterprise-grade capacity.',
    cols: 8,
    rows: 4,
    maxCabinets: 32,
    maxSpines: 6,
    upgradeCost: 120000,
    color: '#00aaff',
  },
  enterprise: {
    tier: 'enterprise',
    label: 'Enterprise Suite',
    description: 'A massive hyperscale facility. Maximum capacity.',
    cols: 10,
    rows: 5,
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
): PlacementHint[] {
  const hints: PlacementHint[] = []
  const limits = getSuiteLimits(suiteTier)

  // Check adjacent cabinets for heat warnings
  const neighbors = cabinets.filter(
    (c) => Math.abs(c.col - col) <= 1 && Math.abs(c.row - row) <= 1 && (c.col !== col || c.row !== row)
  )
  const hotNeighbors = neighbors.filter((c) => c.heatLevel >= 60)
  const critNeighbors = neighbors.filter((c) => c.heatLevel >= SIM.throttleTemp)

  if (critNeighbors.length > 0) {
    hints.push({ message: 'Adjacent to overheating cabinets — risk of thermal throttle', type: 'warning' })
  } else if (hotNeighbors.length > 0) {
    hints.push({ message: 'Warm neighbors nearby — monitor cooling capacity', type: 'warning' })
  }

  if (neighbors.length === 0) {
    hints.push({ message: 'Isolated placement — good for airflow', type: 'tip' })
  }

  // Row length guidance (real DCs typically use rows of 4-8)
  const rowCabs = cabinets.filter((c) => c.row === row)
  if (rowCabs.length >= limits.cols - 1) {
    hints.push({ message: 'This row is nearly full — consider starting a new row for airflow', type: 'info' })
  }

  // Hot/cold aisle pattern hint
  if (cabinets.length === 0) {
    hints.push({ message: 'First cabinet — consider leaving gaps for hot/cold aisle layout', type: 'tip' })
  } else if (cabinets.length >= 3) {
    const sameRow = cabinets.filter((c) => c.row === row)
    const adjacentInRow = sameRow.filter((c) => Math.abs(c.col - col) === 1)
    if (adjacentInRow.length >= 2) {
      hints.push({ message: 'Dense row — plan cooling paths between cabinets', type: 'info' })
    }
  }

  // Aisle facing hint (reusing rowCabs from above)
  if (rowCabs.length > 0) {
    const rowFacings = new Set(rowCabs.map((c) => c.facing))
    if (rowFacings.size === 1) {
      const facing = rowCabs[0].facing
      hints.push({ message: `Row faces ${facing} — match this facing for aisle consistency`, type: 'info' })
    }
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

/** Calculate hot/cold aisle cooling bonus based on cabinet layout */
export function calcAisleBonus(cabinets: Cabinet[]): number {
  if (cabinets.length < 2) return 0

  // Group cabinets by row
  const rowMap = new Map<number, Cabinet[]>()
  for (const cab of cabinets) {
    const row = cab.row
    const list = rowMap.get(row) ?? []
    list.push(cab)
    rowMap.set(row, list)
  }

  // Check for properly formed aisle pairs (adjacent rows with opposing faces)
  let properPairs = 0
  const rows = [...rowMap.keys()].sort((a, b) => a - b)
  for (let i = 0; i < rows.length - 1; i++) {
    const thisRow = rowMap.get(rows[i])!
    const nextRow = rowMap.get(rows[i + 1])!
    // Adjacent rows (consecutive) with cabinets facing toward each other = hot aisle
    if (rows[i + 1] - rows[i] === 1) {
      const thisFacingSouth = thisRow.every((c) => c.facing === 'south')
      const nextFacingNorth = nextRow.every((c) => c.facing === 'north')
      if (thisFacingSouth && nextFacingNorth) properPairs++
      // Or the reverse orientation
      const thisFacingNorth = thisRow.every((c) => c.facing === 'north')
      const nextFacingSouth = nextRow.every((c) => c.facing === 'south')
      if (thisFacingNorth && nextFacingSouth) properPairs++
    }
  }

  return Math.min(AISLE_CONFIG.maxCoolingBonus, properPairs * AISLE_CONFIG.coolingBonusPerPair)
}

/** Count how many cabinets violate aisle layout (mixed facing in a row) */
export function countAisleViolations(cabinets: Cabinet[]): number {
  const rowMap = new Map<number, Set<CabinetFacing>>()
  for (const cab of cabinets) {
    const facings = rowMap.get(cab.row) ?? new Set()
    facings.add(cab.facing)
    rowMap.set(cab.row, facings)
  }
  let violations = 0
  for (const facings of rowMap.values()) {
    if (facings.size > 1) violations++ // mixed facings in the same row
  }
  return violations
}

/** Check how many cable runs are not routed through trays */
export function countMessyCables(cableRuns: CableRun[]): number {
  return cableRuns.filter((c) => !c.usesTrays).length
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
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.cabinet,
        placementMode: false,
        aisleBonus: newAisleBonus,
        aisleViolations: newAisleViolations,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  enterPlacementMode: (environment: CabinetEnvironment, customerType: CustomerType, facing?: CabinetFacing) =>
    set((state) => ({ placementMode: true, placementEnvironment: environment, placementCustomerType: customerType, placementFacing: facing ?? state.placementFacing })),

  exitPlacementMode: () =>
    set({ placementMode: false }),

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
      if (state.money < incident.def.resolveCost) return state

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
        money: state.money - incident.def.resolveCost,
        resolvedCount: state.resolvedCount + 1,
        incidentLog: [`Resolved: ${incident.def.label}`, ...state.incidentLog].slice(0, 10),
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
      return {
        activeContracts: [...state.activeContracts, contract],
        contractOffers: state.contractOffers.filter((_, i) => i !== index),
        contractLog: [`Accepted: ${def.company} — ${def.description}`, ...state.contractLog].slice(0, 10),
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
      const newCabinets = state.cabinets.map((c) =>
        c.id === cabinetId ? { ...c, facing: (c.facing === 'north' ? 'south' : 'north') as CabinetFacing } : c
      )
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

  // ── Demo Mode ─────────────────────────────────────────────────

  loadDemoState: () => {
    // Build a professional-tier data center with a diverse set of cabinets
    const demoCabinets: Cabinet[] = []
    const customerTypes: CustomerType[] = ['general', 'ai_training', 'streaming', 'crypto', 'enterprise']
    const environments: CabinetEnvironment[] = ['production', 'production', 'production', 'lab', 'management']
    let cabId = 1

    // Professional tier: 8 cols x 4 rows
    const positions: [number, number][] = [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
      [0,2],[1,2],[2,2],[3,2],[4,2],
      [0,3],[1,3],[2,3],
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
        facing: row % 2 === 0 ? 'north' as CabinetFacing : 'south' as CabinetFacing,
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
    ].map((id, i) => ({
      def: ACHIEVEMENT_CATALOG.find((a) => a.id === id)!,
      unlockedAtTick: (i + 1) * 50,
    })).filter((a) => a.def)

    const demoUnlockedTech = ['hot_aisle', 'variable_fans', 'high_density', 'ups_upgrade', 'redundant_cooling']

    // Set module-level ID counters
    nextCabId = cabId
    nextSpineId = 6
    nextLoanId = 1
    nextIncidentId = 1
    nextContractId = 1
    nextGeneratorId = 2
    nextStaffId = 1

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
      activeContracts: [],
      contractLog: [],
      contractRevenue: 0,
      contractPenalties: 0,
      completedContracts: 4,
      insurancePolicies: ['fire_insurance' as InsurancePolicyType, 'power_insurance' as InsurancePolicyType],
      insurancePayouts: 15000,
      stockPrice: 85,
      stockHistory: Array.from({ length: 50 }, (_, i) => 30 + i + Math.floor(Math.random() * 10)),
      drillsCompleted: 2,
      drillsPassed: 2,
      pdus: [],
      cableTrays: [],
      cableRuns: [],
      busways: [],
      crossConnects: [],
      inRowCoolers: [],
      sandboxMode: false,
      fireActive: false,
      fireDamageTaken: 0,
      powerOutage: false,
      outageTicksRemaining: 0,
      powerPriceMultiplier: 1.0,
      powerPriceSpikeActive: false,
      powerPriceSpikeTicks: 0,
      placementMode: false,
      heatMapVisible: false,
      hasSaved: false,
      activeSlotId: null,
      staff: [],
      shiftPattern: 'day_night' as ShiftPattern,
      trainingQueue: [],
      staffCostPerTick: 0,
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
      activeSlotId: null,
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
      activeSlotId: null,
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

      // Clean up manually resolved incidents
      const justResolved = activeIncidents.filter((i) => i.resolved)
      activeIncidents = activeIncidents.filter((i) => !i.resolved)

      // Spawn new incidents (only if we have equipment and fewer than max active)
      if (state.cabinets.length > 0 && activeIncidents.length < MAX_ACTIVE_INCIDENTS) {
        // Scale chance with facility size + messy cable penalty
        const sizeMultiplier = Math.min(2, state.cabinets.length / 8)
        const cablingPenalty = state.infraIncidentBonus
        if (Math.random() < INCIDENT_CHANCE * sizeMultiplier + cablingPenalty) {
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
      const spineSwitches = failedSpineIds.size > 0
        ? state.spineSwitches.map(s => failedSpineIds.has(s.id) ? { ...s, powerStatus: false } : s)
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
          case 'revenue_penalty': incidentRevenueMult *= inc.def.effectMagnitude; break
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

      // Calculate per-incident-type speed multipliers from staff
      const staffTrafficResolution = networkEngineers.reduce((sum, s) => {
        const bonus = s.skillLevel === 1 ? 0.25 : s.skillLevel === 2 ? 0.40 : 0.60
        return sum + bonus
      }, 0) * shiftCoverage
      const staffPowerResolution = electricians.reduce((sum, s) => {
        const bonus = s.skillLevel === 1 ? 0.25 : s.skillLevel === 2 ? 0.40 : 0.60
        return sum + bonus
      }, 0) * shiftCoverage

      // Apply staff-based incident speed reduction (in addition to tech bonuses)
      if (onShiftStaff.length > 0) {
        activeIncidents = activeIncidents.map((i) => {
          if (i.resolved) return i
          let staffSpeedBonus = 0
          if (i.def.effect === 'traffic_drop') staffSpeedBonus = staffTrafficResolution
          else if (i.def.effect === 'power_surge') staffSpeedBonus = staffPowerResolution
          // Generic small bonus from any staff for other incident types
          else staffSpeedBonus = Math.min(0.3, onShiftStaff.length * 0.05) * shiftCoverage
          const extraReduction = Math.random() < Math.min(0.8, staffSpeedBonus) ? 1 : 0
          if (extraReduction === 0) return i
          const remaining = i.ticksRemaining - extraReduction
          if (remaining <= 0) {
            incidentLog = [`Staff resolved: ${i.def.label}`, ...incidentLog].slice(0, 10)
            // Track resolved count for staff
            staffIncidentsResolved++
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

      // 1. Update heat per cabinet (with customer type and tech modifiers)
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

        // Cooling dissipation (base + tech bonus + aisle bonus + in-row cooling; reduced by incident effects)
        const aisleCoolingBoost = currentAisleBonus * 2 // up to +0.5°C/tick extra cooling
        heat -= (coolingConfig.coolingRate + techCoolingBonus + aisleCoolingBoost + inRowBonus + staffCoolingBonus) * incidentCoolingMult

        // Incident heat spike
        heat += incidentHeatAdd

        // Fire adds extra heat
        if (fireActive) heat += 5

        // Clamp to ambient minimum and 100 max
        heat = Math.max(SIM.ambientTemp, Math.min(100, heat))

        // Age servers (depreciation)
        const newAge = cab.powerStatus ? cab.serverAge + 1 : cab.serverAge

        // Disable leaf switch if affected by hardware failure incident
        const leafFailed = failedLeafCabIds.has(cab.id)
        return { ...cab, heatLevel: Math.round(heat * 10) / 10, serverAge: newAge, ...(leafFailed ? { hasLeafSwitch: false } : {}) }
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

      // Recalculate final money with all new income/expenses
      const finalNewMoney = state.sandboxMode
        ? 999999999
        : Math.round((state.money + revenue + contractRevenue + patentIncome + milestoneMoney + (insurancePayouts - state.insurancePayouts) - expenses - loanPayments - contractPenalties - insuranceCost - staffCostPerTick) * 100) / 100

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
        contractRevenue: +contractRevenue.toFixed(2),
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
