import type {
  RowEndSlotConfig,
  AisleWidthConfig,
  RaisedFloorConfig,
  CableManagementConfig,
  WorkloadConfig,
  AdvancedTierConfig,
  RackEquipmentConfig,
  AudioSettings,
} from '../types'

// ── Row-End Infrastructure Slot Configs ────────────────────────

export const ROW_END_SLOT_CONFIG: RowEndSlotConfig[] = [
  { type: 'pdu_slot', label: 'End-of-Row PDU', cost: 4000, effect: '+15% PDU efficiency for the row', description: 'Dedicated PDU mounting at row end. Reduces cable runs and improves power distribution.', color: '#ffaa00' },
  { type: 'cooling_slot', label: 'End-of-Row Cooler', cost: 6000, effect: '-1.0°C for all cabinets in row', description: 'In-row cooling unit at the row end. Provides targeted airflow for the entire row.', color: '#00ccff' },
  { type: 'fire_panel', label: 'Fire Suppression Panel', cost: 3500, effect: '+20% fire suppression for row', description: 'Localized fire detection and suppression panel at row end.', color: '#ff4444' },
  { type: 'network_patch', label: 'Network Patch Panel', cost: 2500, effect: '-10% cable mess for row', description: 'Structured patching at row end reduces cable clutter and improves organization.', color: '#00ff88' },
]

export const MAX_ROW_END_SLOTS = 2  // max per row (one per side)

// ── Aisle Width Configs ────────────────────────────────────────

export const AISLE_WIDTH_CONFIG: AisleWidthConfig[] = [
  { width: 'standard', label: 'Standard (1-tile)', cost: 0, maintenanceSpeedBonus: 0, coolingBonus: 0, description: 'Default aisle width. Basic access for personnel.' },
  { width: 'wide', label: 'Wide (1.5-tile)', cost: 8000, maintenanceSpeedBonus: 0.15, coolingBonus: 0.03, description: 'Wider aisle allows equipment carts. Faster maintenance, better airflow.' },
  { width: 'extra_wide', label: 'Extra Wide (2-tile)', cost: 15000, maintenanceSpeedBonus: 0.30, coolingBonus: 0.06, description: 'Maximum width aisle for forklift access. Best maintenance speed and cooling.' },
]

// ── Raised Floor & Cable Management Configs ────────────────────

export const RAISED_FLOOR_CONFIG: RaisedFloorConfig[] = [
  { tier: 'none', label: 'No Raised Floor', cost: 0, coolingDistributionBonus: 0, description: 'Standard concrete floor. No underfloor infrastructure.' },
  { tier: 'basic', label: 'Basic Raised Floor (12")', cost: 25000, coolingDistributionBonus: 0.08, description: '12-inch raised floor. Basic cold air plenum for improved cooling distribution.' },
  { tier: 'advanced', label: 'Advanced Raised Floor (24")', cost: 60000, coolingDistributionBonus: 0.15, description: '24-inch raised floor. Full plenum with room for power conduits and chilled water pipes.' },
]

export const CABLE_MANAGEMENT_CONFIG: CableManagementConfig[] = [
  { type: 'none', label: 'No Cable Management', cost: 0, cableMessReduction: 0, description: 'Cables routed ad-hoc. Higher risk of messy cable incidents.' },
  { type: 'overhead', label: 'Overhead Cable Trays', cost: 15000, cableMessReduction: 0.40, description: 'Ceiling-mounted cable tray system. Reduces cable mess by 40%.' },
  { type: 'underfloor', label: 'Underfloor Conduits', cost: 20000, cableMessReduction: 0.60, description: 'Under-raised-floor cable routing. Maximum cable organization. Requires raised floor.' },
]

// ── Workload Simulation Configs ────────────────────────────────

export const WORKLOAD_CONFIG: WorkloadConfig[] = [
  {
    type: 'ai_training',
    label: 'AI Training Job',
    description: 'Long-running GPU workload. Generates massive heat. Huge payout on completion but fails if cabinet overheats.',
    minServers: 2,
    durationTicks: 60,
    basePayout: 15000,
    heatMultiplier: 2.5,
    failOnOverheat: true,
    failTemp: 85,
    color: '#ff00ff',
  },
  {
    type: 'batch_processing',
    label: 'Batch Processing Job',
    description: 'Medium-duration batch workload. Moderate heat, solid payout. Tolerates brief overheating.',
    minServers: 1,
    durationTicks: 30,
    basePayout: 5000,
    heatMultiplier: 1.5,
    failOnOverheat: true,
    failTemp: 92,
    color: '#ffaa00',
  },
  {
    type: 'live_migration',
    label: 'Live Migration',
    description: 'Move a workload to another cabinet. Brief performance hit but saves workload from thermal danger.',
    minServers: 1,
    durationTicks: 5,
    basePayout: 0,
    heatMultiplier: 0.5,
    failOnOverheat: false,
    failTemp: 999,
    color: '#00ccff',
  },
]

export const MAX_WORKLOADS_PER_CABINET = 1
export const MAX_ACTIVE_WORKLOADS = 10

// ── Advanced Scaling Tier Configs ──────────────────────────────

export const ADVANCED_TIER_CONFIG: AdvancedTierConfig[] = [
  {
    tier: 'nuclear',
    label: 'Nuclear (SMR)',
    description: 'Small Modular Reactor provides ultra-reliable, zero-carbon baseload power. Unlocks expanded grid with advanced water cooling.',
    prerequisiteSuiteTier: 'enterprise',
    unlockCost: 750000,
    cols: 18,
    maxCabinets: 80,
    maxSpines: 12,
    powerType: 'Small Modular Reactor (SMR)',
    coolingType: 'Reactor Coolant Loop',
    coolingRate: 5.0,
    powerCostMultiplier: 0.3,
    carbonPerKW: 0,
    color: '#00ffaa',
  },
  {
    tier: 'fusion',
    label: 'Fusion / Kugelblitz',
    description: 'Experimental fusion reactor with alien cryo-fluid cooling. Near-unlimited power at minimal cost. The endgame.',
    prerequisiteSuiteTier: 'enterprise',
    unlockCost: 2000000,
    cols: 24,
    maxCabinets: 150,
    maxSpines: 16,
    powerType: 'Tokamak Fusion Reactor',
    coolingType: 'Alien Cryo-Fluid',
    coolingRate: 8.0,
    powerCostMultiplier: 0.1,
    carbonPerKW: 0,
    color: '#ff00ff',
  },
]

// ── 42U Rack Equipment Configs ─────────────────────────────────

export const RACK_EQUIPMENT_CONFIG: RackEquipmentConfig[] = [
  { type: 'server_1u', label: '1U Server', heightU: 1, cost: 800, powerDraw: 200, heatOutput: 0.3, revenuePerTick: 3, description: 'Compact 1U rackmount server.', color: '#00ff88' },
  { type: 'server_2u', label: '2U Server', heightU: 2, cost: 2000, powerDraw: 450, heatOutput: 0.75, revenuePerTick: 6, description: 'Standard 2U server with dual CPUs.', color: '#00ff88' },
  { type: 'server_4u', label: '4U GPU Server', heightU: 4, cost: 8000, powerDraw: 1200, heatOutput: 2.0, revenuePerTick: 15, description: 'High-density 4U GPU server for AI/ML workloads.', color: '#ff00ff' },
  { type: 'switch_1u', label: '1U Network Switch', heightU: 1, cost: 3000, powerDraw: 150, heatOutput: 0.15, revenuePerTick: 0, description: 'Top-of-rack network switch.', color: '#00aaff' },
  { type: 'patch_panel_1u', label: '1U Patch Panel', heightU: 1, cost: 500, powerDraw: 0, heatOutput: 0, revenuePerTick: 0, description: 'Cable management patch panel. Reduces cable mess.', color: '#888888' },
  { type: 'ups_2u', label: '2U UPS', heightU: 2, cost: 4000, powerDraw: 50, heatOutput: 0.1, revenuePerTick: 0, description: 'Inline UPS for rack-level power protection.', color: '#ffaa00' },
  { type: 'blank_1u', label: '1U Blank Panel', heightU: 1, cost: 50, powerDraw: 0, heatOutput: 0, revenuePerTick: 0, description: 'Blank filler panel for proper airflow management.', color: '#333333' },
  { type: 'storage_2u', label: '2U Storage Array', heightU: 2, cost: 3000, powerDraw: 300, heatOutput: 0.4, revenuePerTick: 4, description: 'Direct-attached storage array.', color: '#44cc44' },
]

export const RACK_TOTAL_U = 42

// ── Default Audio Settings ─────────────────────────────────────

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.5,
  sfxVolume: 0.7,
  ambientVolume: 0.3,
  muted: false,
}

// ── Leaderboard Config ─────────────────────────────────────────

export const LEADERBOARD_STORAGE_KEY = 'fabric-tycoon-leaderboard'
export const MAX_LEADERBOARD_ENTRIES = 10
