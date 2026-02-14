import { create } from 'zustand'

export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'
export type GameSpeed = 0 | 1 | 2 | 3
export type CabinetEnvironment = 'production' | 'lab' | 'management'
export type CoolingType = 'air' | 'water'

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
  effect: 'heat_spike' | 'revenue_penalty' | 'power_surge' | 'traffic_drop' | 'cooling_failure'
  effectMagnitude: number     // severity-dependent multiplier
}

export interface ActiveIncident {
  id: string
  def: IncidentDef
  ticksRemaining: number
  resolved: boolean
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
]

/** Chance per tick of an incident occurring (when fewer than max active) */
const INCIDENT_CHANCE = 0.02
const MAX_ACTIVE_INCIDENTS = 3

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
  environment: CabinetEnvironment
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
  gbpsPerServer: 1,         // each active server generates 1 Gbps of east-west traffic (at 1.0x demand)
  linkCapacityGbps: 10,     // each leaf→spine uplink is 10 Gbps
}

export { TRAFFIC }

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
    const cabTraffic = cab.serverCount * TRAFFIC.gbpsPerServer * demandMultiplier
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

  // Actions
  addCabinet: (environment: CabinetEnvironment) => void
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
  dismissAchievement: () => void
  tick: () => void
}

let nextCabId = 1
let nextSpineId = 1
let nextLoanId = 1
let nextIncidentId = 1

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

  // ── Build Actions ───────────────────────────────────────────

  addCabinet: (environment: CabinetEnvironment) =>
    set((state) => {
      if (state.money < COSTS.cabinet) return state
      if (state.cabinets.length >= MAX_CABINETS) return state
      const cab: Cabinet = {
        id: `cab-${nextCabId++}`,
        environment,
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
        trafficStats: calcTraffic(newCabinets, state.spineSwitches, state.demandMultiplier),
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
      return {
        activeIncidents: state.activeIncidents.map((i) =>
          i.id === id ? { ...i, resolved: true, ticksRemaining: 0 } : i
        ),
        money: state.money - incident.def.resolveCost,
        resolvedCount: state.resolvedCount + 1,
        incidentLog: [`Resolved: ${incident.def.label}`, ...state.incidentLog].slice(0, 10),
      }
    }),

  dismissAchievement: () => set({ newAchievement: null }),

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
      let resolvedCount = state.resolvedCount

      // Tick down active incidents
      activeIncidents = activeIncidents
        .map((i) => {
          if (i.resolved) return i
          const remaining = i.ticksRemaining - 1
          if (remaining <= 0) {
            incidentLog = [`Expired: ${i.def.label}`, ...incidentLog].slice(0, 10)
            return { ...i, ticksRemaining: 0, resolved: true }
          }
          return { ...i, ticksRemaining: remaining }
        })

      // Clean up resolved incidents (keep for 1 tick for UI display, then remove)
      activeIncidents = activeIncidents.filter((i) => !i.resolved || i.ticksRemaining >= 0)
      // Actually remove fully resolved ones after this tick
      const justResolved = activeIncidents.filter((i) => i.resolved)
      activeIncidents = activeIncidents.filter((i) => !i.resolved)

      // Spawn new incidents (only if we have equipment and fewer than max active)
      if (state.cabinets.length > 0 && activeIncidents.length < MAX_ACTIVE_INCIDENTS) {
        // Scale chance with facility size
        const sizeMultiplier = Math.min(2, state.cabinets.length / 8)
        if (Math.random() < INCIDENT_CHANCE * sizeMultiplier) {
          const def = INCIDENT_CATALOG[Math.floor(Math.random() * INCIDENT_CATALOG.length)]
          const incident: ActiveIncident = {
            id: `inc-${nextIncidentId++}`,
            def,
            ticksRemaining: def.durationTicks,
            resolved: false,
          }
          activeIncidents.push(incident)
          incidentLog = [`New: ${def.label} — ${def.description}`, ...incidentLog].slice(0, 10)
        }
      }

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

        return {
          tickCount: newTickCount,
          gameHour: newHour,
          demandMultiplier,
          spikeActive,
          spikeTicks,
          spikeMagnitude,
          loans: updatedLoans,
          loanPayments: +loanPayments.toFixed(2),
          money: Math.round((state.money - loanPayments) * 100) / 100,
          activeIncidents,
          incidentLog,
          resolvedCount,
        }
      }

      // 1. Update heat per cabinet
      const newCabinets = state.cabinets.map((cab) => {
        let heat = cab.heatLevel
        const envConfig = ENVIRONMENT_CONFIG[cab.environment]

        if (cab.powerStatus) {
          // Heat generation from active equipment (scaled by environment)
          heat += cab.serverCount * SIM.heatPerServer * envConfig.heatMultiplier
          if (cab.hasLeafSwitch) heat += SIM.heatPerLeaf
        }

        // Cooling dissipation (based on cooling type; reduced by incident effects)
        heat -= coolingConfig.coolingRate * incidentCoolingMult

        // Incident heat spike
        heat += incidentHeatAdd

        // Clamp to ambient minimum and 100 max
        heat = Math.max(SIM.ambientTemp, Math.min(100, heat))

        return { ...cab, heatLevel: Math.round(heat * 10) / 10 }
      })

      // 2. Calculate stats with updated heat
      const stats = calcStats(newCabinets, state.spineSwitches)

      // Apply cooling type overhead reduction
      const adjustedCoolingPower = Math.round(
        stats.coolingPower * (1 - coolingConfig.overheadReduction) * coolingConfig.operatingCostMult
      )

      // 3. Calculate revenue (scaled by environment and demand, modified by incidents)
      let revenue = 0
      for (const cab of newCabinets) {
        if (cab.powerStatus) {
          const envConfig = ENVIRONMENT_CONFIG[cab.environment]
          const baseRevenue = cab.serverCount * SIM.revenuePerServer * envConfig.revenueMultiplier
          // Throttled servers earn half revenue
          const throttled = cab.heatLevel >= SIM.throttleTemp
          revenue += throttled ? baseRevenue * 0.5 : baseRevenue
        }
      }
      revenue *= incidentRevenueMult

      // 4. Calculate expenses (with incident power surge effect)
      const effectivePower = Math.round(stats.totalPower * incidentPowerMult)
      const powerCost = +(effectivePower / 1000 * SIM.powerCostPerKW).toFixed(2)
      const coolingCost = +(adjustedCoolingPower / 1000 * SIM.powerCostPerKW).toFixed(2)
      const expenses = +(powerCost + coolingCost).toFixed(2)

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

      // 6. Update money
      const netIncome = revenue - expenses - loanPayments
      const newMoney = Math.round((state.money + netIncome) * 100) / 100

      // 7. Calculate traffic flows (scaled by demand multiplier, modified by incidents)
      const effectiveDemand = demandMultiplier * incidentTrafficMult
      const trafficStats = calcTraffic(newCabinets, state.spineSwitches, effectiveDemand)

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
      if (newCabinets.length >= MAX_CABINETS) unlock('full_grid')
      if (state.spineSwitches.length >= 1) unlock('first_spine')
      if (state.spineSwitches.length >= MAX_SPINES) unlock('max_spines')
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

      return {
        cabinets: newCabinets,
        tickCount: newTickCount,
        revenue: +revenue.toFixed(2),
        expenses,
        powerCost,
        coolingCost,
        money: newMoney,
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
        achievements: newAchievements,
        newAchievement,
        ...stats,
        coolingPower: adjustedCoolingPower,
      }
    }),
}))
