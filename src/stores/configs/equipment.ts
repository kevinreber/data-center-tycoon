import type {
  CabinetEnvironment,
  ChillerPlantConfig,
  CoolingType,
  CoolingUnitConfig,
  CustomerType,
  CustomerTypeConfig,
  EnvironmentConfig,
  GeneratorConfig,
  GPUPodConfig,
  GPUPodSize,
  IBSwitchConfig,
  IBSwitchType,
  LiquidCoolingConfig,
  LiquidCoolingType,
  ServerConfigDef,
  SuppressionConfig,
  SuppressionType,
  TrainingJobConfig,
  TrainingJobType,
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
  ai_lab: {
    label: 'AI Lab',
    description: 'Frontier AI training labs. Massive GPU pods, extreme power and heat, premium per-GPU payouts. Demands liquid cooling.',
    color: '#cc44ff',
    powerMultiplier: 2.5,
    heatMultiplier: 2.5,
    revenueMultiplier: 4.0,
    bandwidthMultiplier: 0.5,
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

// ── GPU Pods & Liquid Cooling (Phase 8A) ──────────────────────

export const GPU_POD_CONFIG: Record<GPUPodSize, GPUPodConfig> = {
  small: {
    size: 'small',
    label: 'Small Pod (64 GPU)',
    description: '4-cabinet training cluster with 64 GPUs. Entry-level AI infrastructure.',
    cabinetCount: 4,
    gpuCount: 64,
    installCost: 200_000,
    powerDrawKW: 30,
    requiredLiquidCooling: 'rear_door_hx',
    density: 'high_density',
    color: '#cc66ff',
  },
  medium: {
    size: 'medium',
    label: 'Medium Pod (128 GPU)',
    description: '8-cabinet cluster with 128 GPUs. Direct-to-chip cooling required.',
    cabinetCount: 8,
    gpuCount: 128,
    installCost: 450_000,
    powerDrawKW: 35,
    requiredLiquidCooling: 'direct_to_chip',
    density: 'high_density',
    color: '#dd44ff',
  },
  large: {
    size: 'large',
    label: 'Large Pod (256 GPU)',
    description: '16-cabinet cluster with 256 GPUs. Production-scale frontier training.',
    cabinetCount: 16,
    gpuCount: 256,
    installCost: 1_200_000,
    powerDrawKW: 45,
    requiredLiquidCooling: 'direct_to_chip',
    density: 'extreme_density',
    color: '#ee44ff',
  },
  hyperpod: {
    size: 'hyperpod',
    label: 'Hyperpod (512 GPU)',
    description: '32-cabinet immersion-cooled hyperscale cluster. The whale. Reserved for frontier AI labs.',
    cabinetCount: 32,
    gpuCount: 512,
    installCost: 3_000_000,
    powerDrawKW: 50,
    requiredLiquidCooling: 'single_phase_immersion',
    density: 'extreme_density',
    color: '#ff44ff',
  },
}

export const LIQUID_COOLING_CONFIG: Record<LiquidCoolingType, LiquidCoolingConfig> = {
  none: {
    type: 'none',
    label: 'None',
    description: 'No liquid cooling. Standard air cooling only.',
    costPerCabinet: 0,
    maxKWPerCabinet: 6,
    heatDissipationBonus: 0,
    maintenanceCostPerTick: 0,
    requiresTech: null,
    color: '#888888',
  },
  rear_door_hx: {
    type: 'rear_door_hx',
    label: 'Rear-Door Heat Exchanger',
    description: 'Chilled water coil in the rear door extracts heat at the cabinet. Handles up to 35kW.',
    costPerCabinet: 30_000,
    maxKWPerCabinet: 35,
    heatDissipationBonus: 4.0,
    maintenanceCostPerTick: 1.0,
    requiresTech: 'ai_infrastructure',
    color: '#44aaff',
  },
  direct_to_chip: {
    type: 'direct_to_chip',
    label: 'Direct-to-Chip',
    description: 'Cold plates bolted directly to CPU/GPU dies. CDU + manifolds. Handles up to 50kW.',
    costPerCabinet: 80_000,
    maxKWPerCabinet: 50,
    heatDissipationBonus: 7.0,
    maintenanceCostPerTick: 2.5,
    requiresTech: 'ai_infrastructure',
    color: '#00ccff',
  },
  single_phase_immersion: {
    type: 'single_phase_immersion',
    label: 'Single-Phase Immersion',
    description: 'Entire cabinet submerged in dielectric fluid. Handles 100kW+. Requires existing immersion tech.',
    costPerCabinet: 150_000,
    maxKWPerCabinet: 100,
    heatDissipationBonus: 12.0,
    maintenanceCostPerTick: 4.0,
    requiresTech: 'immersion_cooling',
    color: '#cc66ff',
  },
}

// ── InfiniBand Backend Fabric (Phase 8B) ──────────────────────

export const IB_SWITCH_CONFIG: Record<IBSwitchType, IBSwitchConfig> = {
  ib_leaf: {
    type: 'ib_leaf',
    label: 'IB Leaf (NDR 400G)',
    description: 'InfiniBand top-of-rack leaf switch. 32× 400Gb NDR ports. One leaf per rail per pod.',
    cost: 30_000,
    portsTotal: 32,
    powerDraw: 350,
    bandwidthPerPortGbps: 400,
    color: '#aa44ff',
  },
  ib_spine: {
    type: 'ib_spine',
    label: 'IB Spine (NDR 400G)',
    description: 'Non-blocking 64-port spine switch. One spine per rail; cross-pod rails stay isolated.',
    cost: 80_000,
    portsTotal: 64,
    powerDraw: 600,
    bandwidthPerPortGbps: 400,
    color: '#cc44ff',
  },
}

/** Number of parallel rails per pod size. More rails = better AllReduce throughput
 *  and graceful degradation when a single rail fails. */
export const RAIL_COUNT_BY_POD_SIZE: Record<GPUPodSize, 4 | 8> = {
  small: 4,
  medium: 4,
  large: 4,
  hyperpod: 8,
}

/** Default link bandwidth between IB switches and IB endpoints (Gbps). */
export const IB_DEFAULT_BANDWIDTH_GBPS = 400 as const

/** Base error rate accumulation per tick per active link (chance of an error event).
 *  Errors at this rate accumulate slowly; an incident or aging fabric raises them. */
export const IB_BASE_LINK_ERROR_RATE = 0.0002

// ── Cabinet Density Scaling (Phase 8A) ────────────────────────

/** Multipliers applied to per-cabinet power draw and heat based on density tier */
export const DENSITY_SCALING: Record<'standard' | 'high_density' | 'extreme_density', {
  powerMultiplier: number     // multiplier on base server power draw
  heatMultiplier: number      // multiplier on base heat generation
  maxServers: number          // max servers per cabinet at this density
  label: string
}> = {
  standard: { powerMultiplier: 1.0, heatMultiplier: 1.0, maxServers: 4, label: 'Standard 6kW' },
  high_density: { powerMultiplier: 5.0, heatMultiplier: 4.5, maxServers: 8, label: 'High Density 30-35kW' },
  extreme_density: { powerMultiplier: 8.0, heatMultiplier: 7.0, maxServers: 8, label: 'Extreme 45-50kW' },
}

// ── Training Jobs (Phase 8E) ──────────────────────────────────

export const TRAINING_JOB_CONFIG: Record<TrainingJobType, TrainingJobConfig> = {
  pretraining: {
    type: 'pretraining',
    label: 'Foundation Pretraining',
    description: 'Multi-hundred-billion-parameter pretraining run. The whale — single restart loses everything.',
    minDuration: 150,
    maxDuration: 200,
    minPayout: 2_000_000,
    maxPayout: 5_000_000,
    maxRestarts: 0,
    minThroughputPct: 90,
    fabricLoadTarget: 0.95,
    color: '#ff44ff',
  },
  fine_tuning: {
    type: 'fine_tuning',
    label: 'Fine-Tune',
    description: 'Customer-specific model fine-tune. Forgiving SLA, steady revenue.',
    minDuration: 50,
    maxDuration: 80,
    minPayout: 500_000,
    maxPayout: 1_000_000,
    maxRestarts: 1,
    minThroughputPct: 80,
    fabricLoadTarget: 0.75,
    color: '#cc88ff',
  },
  inference_batch: {
    type: 'inference_batch',
    label: 'Inference Batch',
    description: 'Steady inference fill between training runs. Low payout, low risk, fills idle GPU time.',
    minDuration: 30,
    maxDuration: 30,
    minPayout: 200_000,
    maxPayout: 200_000,
    maxRestarts: 2,
    minThroughputPct: 70,
    fabricLoadTarget: 0.4,
    color: '#88ccff',
  },
  rl_training: {
    type: 'rl_training',
    label: 'RL Training',
    description: 'Reinforcement-learning run. Bursty traffic, harder on the fabric, premium payout.',
    minDuration: 100,
    maxDuration: 100,
    minPayout: 1_000_000,
    maxPayout: 1_000_000,
    maxRestarts: 1,
    minThroughputPct: 85,
    fabricLoadTarget: 0.85,
    color: '#ffaa88',
  },
}

/** Number of ticks between training-job offer refreshes. */
export const TRAINING_JOB_OFFER_INTERVAL = 40
/** Number of offers in the pool at any time. */
export const TRAINING_JOB_OFFER_POOL_SIZE = 4
/** Ticks an offer stays available before it expires. */
export const TRAINING_JOB_OFFER_TTL = 120

/** Procedural customer pool used to roll TrainingJobOffer.customerName. */
export const TRAINING_JOB_CUSTOMERS = [
  'Helios AI Labs', 'QuantStack Research', 'Nimbus Cognition', 'Orchid Foundation',
  'Cipher Models', 'Vector Diligence', 'Pinnacle Inference', 'Arcadia Synthesis',
  'Lattice Reasoning', 'Helix BioCompute', 'Stratus Vision', 'Quanta Cortex',
]

/** Reputation gain on completion of each job type (scaled by progress at fail). */
export const TRAINING_JOB_REPUTATION = {
  pretraining: 6,
  fine_tuning: 2,
  inference_batch: 0.5,
  rl_training: 3,
}

/** Reputation lost on outright failure (max-restarts exceeded). */
export const TRAINING_JOB_FAIL_REPUTATION = -8
