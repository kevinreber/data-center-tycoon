import type {
  CabinetEnvironment,
  ChillerPlantConfig,
  CoolingType,
  CoolingUnitConfig,
  CustomerType,
  CustomerTypeConfig,
  EnvironmentConfig,
  GeneratorConfig,
  ServerConfigDef,
  SuppressionConfig,
  SuppressionType,
} from '../types'

// ── Customer Type Config ──────────────────────────────────────

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

export const GENERATOR_OPTIONS: GeneratorConfig[] = [
  { label: 'Small Diesel', cost: 15000, fuelCapacity: 30, fuelCostPerTick: 8, powerCapacityW: 50000, startupTicks: 2, cooldownTicks: 5, description: 'Small diesel generator. Covers a few cabinets during short outages.' },
  { label: 'Large Diesel', cost: 40000, fuelCapacity: 50, fuelCostPerTick: 15, powerCapacityW: 150000, startupTicks: 3, cooldownTicks: 8, description: 'Industrial diesel generator. Covers most medium facilities.' },
  { label: 'Natural Gas', cost: 75000, fuelCapacity: 100, fuelCostPerTick: 10, powerCapacityW: 300000, startupTicks: 4, cooldownTicks: 10, description: 'Natural gas turbine. Long runtime, high capacity, but slow to start.' },
]

// ── Fire Suppression Config ───────────────────────────────────

export const SUPPRESSION_CONFIG: Record<SuppressionType, SuppressionConfig> = {
  none: { label: 'None', cost: 0, effectiveness: 0, equipmentDamage: false, description: 'No fire suppression. Fires will cause maximum damage.', color: '#666666' },
  water_suppression: { label: 'Water Sprinkler', cost: 8000, effectiveness: 0.85, equipmentDamage: true, description: 'Cheap and effective at stopping fires, but water destroys server equipment. Expect losses.', color: '#4488ff' },
  gas_suppression: { label: 'Inert Gas (FM-200)', cost: 35000, effectiveness: 0.95, equipmentDamage: false, description: 'Premium gas-based suppression. Electronics-safe — stops fires without equipment damage.', color: '#44ff88' },
}

// ── Facility Cooling Config ───────────────────────────────────

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

// ── Cooling Unit Infrastructure ───────────────────────────────

export const COOLING_UNIT_CONFIG: CoolingUnitConfig[] = [
  {
    type: 'fan_tray',
    label: 'Fan Tray',
    cost: 3000,
    coolingRate: 1.5,
    range: 1,
    maxCabinets: 3,
    powerDraw: 100,
    waterUsage: 0,
    color: '#88ccff',
    description: 'Basic fan array. Cheap and easy to deploy but limited cooling capacity.',
    requiresTech: null,
  },
  {
    type: 'crac',
    label: 'CRAC Unit',
    cost: 15000,
    coolingRate: 3.0,
    range: 2,
    maxCabinets: 6,
    powerDraw: 300,
    waterUsage: 0,
    color: '#44aaff',
    description: 'Computer Room Air Conditioner. Reliable air-based cooling with good coverage.',
    requiresTech: null,
  },
  {
    type: 'crah',
    label: 'CRAH Unit',
    cost: 35000,
    coolingRate: 5.0,
    range: 3,
    maxCabinets: 10,
    powerDraw: 400,
    waterUsage: 3,
    color: '#00ccff',
    description: 'Computer Room Air Handler with chilled water. Superior cooling for dense deployments.',
    requiresTech: 'hot_aisle',
  },
  {
    type: 'immersion_pod',
    label: 'Immersion Pod',
    cost: 60000,
    coolingRate: 8.0,
    range: 0,
    maxCabinets: 1,
    powerDraw: 200,
    waterUsage: 5,
    color: '#cc66ff',
    description: 'Liquid immersion cooling for a single cabinet. Extreme heat removal for high-density workloads.',
    requiresTech: 'immersion_cooling',
  },
]

// ── Chiller Plant Config ──────────────────────────────────────

export const CHILLER_PLANT_CONFIG: ChillerPlantConfig[] = [
  {
    tier: 'basic',
    label: 'Basic Chiller Plant',
    cost: 50000,
    range: 3,
    efficiencyBonus: 0.25,
    powerDraw: 500,
    requiresTech: 'hot_aisle',
    description: 'Central chilled water plant. Boosts connected CRAH units within range by 25%.',
  },
  {
    tier: 'advanced',
    label: 'Advanced Chiller Plant',
    cost: 120000,
    range: 5,
    efficiencyBonus: 0.40,
    powerDraw: 800,
    requiresTech: 'immersion_cooling',
    description: 'High-capacity chiller with extended range. 40% efficiency boost to connected units.',
  },
]

// ── Cooling Pipe Config ───────────────────────────────────────

export const COOLING_PIPE_CONFIG = {
  cost: 2000,
  maxPipes: 20,
  color: '#00ccff',
  description: 'Chilled water pipe segment. Extends chiller coverage to reach distant cooling units.',
}

// ── Environment Config ────────────────────────────────────────

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

// ── Server Configuration Options ──────────────────────────────

export const SERVER_CONFIG_OPTIONS: ServerConfigDef[] = [
  { id: 'balanced', label: 'Balanced', description: 'Standard general-purpose configuration.', costMultiplier: 1.0, powerMultiplier: 1.0, heatMultiplier: 1.0, revenueMultiplier: 1.0, bestFor: ['general', 'enterprise'], customerBonus: 0.10, color: '#88aacc' },
  { id: 'cpu_optimized', label: 'CPU Optimized', description: 'High core count for compute-heavy workloads.', costMultiplier: 1.2, powerMultiplier: 1.3, heatMultiplier: 1.2, revenueMultiplier: 1.3, bestFor: ['enterprise', 'streaming'], customerBonus: 0.20, color: '#44ff88' },
  { id: 'gpu_accelerated', label: 'GPU Accelerated', description: 'NVIDIA GPU clusters for AI/ML and crypto workloads.', costMultiplier: 1.8, powerMultiplier: 2.0, heatMultiplier: 2.2, revenueMultiplier: 2.0, bestFor: ['ai_training', 'crypto'], customerBonus: 0.30, color: '#ff66ff' },
  { id: 'storage_dense', label: 'Storage Dense', description: 'High-capacity storage for CDN and archival workloads.', costMultiplier: 1.3, powerMultiplier: 0.8, heatMultiplier: 0.7, revenueMultiplier: 1.1, bestFor: ['streaming', 'general'], customerBonus: 0.15, color: '#ffaa44' },
  { id: 'memory_optimized', label: 'Memory Optimized', description: 'Large RAM configurations for in-memory databases.', costMultiplier: 1.4, powerMultiplier: 1.1, heatMultiplier: 1.0, revenueMultiplier: 1.2, bestFor: ['enterprise', 'ai_training'], customerBonus: 0.15, color: '#44aaff' },
]

// ── Cooling Constants ─────────────────────────────────────────

/** °C/tick ambient heat loss even without cooling units */
export const BASE_AMBIENT_DISSIPATION = 0.3

/** CRAH units not connected to a chiller operate at this fraction of their base cooling rate */
export const UNCONNECTED_CRAH_PENALTY = 0.6

/** Max chiller plants allowed per facility */
export const MAX_CHILLER_PLANTS = 2
