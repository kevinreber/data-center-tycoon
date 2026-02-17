import type {
  InsurancePolicyConfig,
  ValuationMilestone,
  MaintenanceConfig,
  MaintenanceTargetType,
  PeeringConfig,
  PeeringType,
  InterconnectPortConfig,
  InterconnectPortType,
  MeetMeRoomConfig,
  SupplyChainConfig,
  SeasonConfig,
  WeatherConditionConfig,
  StaffRoleConfig,
  StaffCertConfig,
  ShiftPattern,
  SuiteTier,
} from '../types'

// ── Loan System ─────────────────────────────────────────────────

export const LOAN_OPTIONS: { label: string; principal: number; interestRate: number; termTicks: number }[] = [
  { label: 'Small Loan', principal: 10000, interestRate: 0.0008, termTicks: 200 },
  { label: 'Medium Loan', principal: 30000, interestRate: 0.0012, termTicks: 400 },
  { label: 'Large Loan', principal: 75000, interestRate: 0.0018, termTicks: 600 },
]

// ── Spot Power Pricing ──────────────────────────────────────────

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

// ── Hardware Depreciation ───────────────────────────────────────

export const DEPRECIATION = {
  serverLifespanTicks: 800,   // server reaches end-of-life after this many ticks
  efficiencyFloor: 0.5,       // minimum efficiency (50% at end of life)
  refreshCost: 1500,          // cost to refresh a server back to 100%
  revenueDecayStart: 0.3,     // efficiency starts declining after 30% of lifespan
}

// ── Insurance System ────────────────────────────────────────────

export const INSURANCE_OPTIONS: InsurancePolicyConfig[] = [
  { type: 'fire_insurance', label: 'Fire Insurance', description: 'Covers equipment damage from fire events. Pays out when fire suppression activates.', premiumPerTick: 3, coverageAmount: 15000, coveredEffects: ['heat_spike'] },
  { type: 'power_insurance', label: 'Power Insurance', description: 'Covers losses from power surges and outages. Reduced outage revenue penalty.', premiumPerTick: 4, coverageAmount: 10000, coveredEffects: ['power_surge'] },
  { type: 'cyber_insurance', label: 'Cyber Insurance', description: 'Covers revenue loss from cyber incidents. Faster recovery from DDoS and ransomware.', premiumPerTick: 5, coverageAmount: 20000, coveredEffects: ['revenue_penalty'] },
  { type: 'equipment_insurance', label: 'Equipment Insurance', description: 'Covers cooling system failures. Reduces heat impact from cooling incidents.', premiumPerTick: 3, coverageAmount: 12000, coveredEffects: ['cooling_failure'] },
]

// ── DR Drill System ─────────────────────────────────────────────

export const DRILL_CONFIG = {
  cost: 2000,
  cooldownTicks: 100,
  passThreshold: 60,
  reputationBonus: 3,
  reputationPenalty: -2,
}

// ── Stock Price / Valuation ─────────────────────────────────────

export const VALUATION_MILESTONES: ValuationMilestone[] = [
  { id: 'ipo', label: 'IPO', targetPrice: 50, reward: 10000 },
  { id: 'growth', label: 'Growth Stock', targetPrice: 100, reward: 25000 },
  { id: 'blue_chip', label: 'Blue Chip', targetPrice: 250, reward: 50000 },
  { id: 'mega_cap', label: 'Mega Cap', targetPrice: 500, reward: 100000 },
  { id: 'trillion', label: 'Trillion Dollar Club', targetPrice: 1000, reward: 250000 },
]

// ── Patent System ───────────────────────────────────────────────

export const PATENT_CONFIG = {
  cost: 5000,
  incomePerTick: 8,
  maxPatents: 9,
}

// ── RFP Bidding ─────────────────────────────────────────────────

export const RFP_CONFIG = {
  offerInterval: 80,
  bidWindowTicks: 15,
  competitorNames: ['NexGen Data', 'CloudVault Inc', 'TerraHost', 'IronCloud', 'DataForge'],
}

// ── Spot Compute Market ─────────────────────────────────────────

export const SPOT_COMPUTE_CONFIG = {
  minPriceMultiplier: 0.3,
  maxPriceMultiplier: 2.5,
  volatility: 0.12,
  meanReversion: 0.03,
  baseDemandCorrelation: -0.5,    // inversely correlated with regular demand
}

// ── Maintenance Windows ─────────────────────────────────────────

export const MAINTENANCE_CONFIG: MaintenanceConfig[] = [
  { targetType: 'cabinet' as MaintenanceTargetType, label: 'Cabinet Maintenance', durationTicks: 3, cost: 500, effect: 'Resets server age by 20%, -5°C heat' },
  { targetType: 'spine' as MaintenanceTargetType, label: 'Spine Maintenance', durationTicks: 2, cost: 1000, effect: 'Prevents next hardware failure incident' },
  { targetType: 'cooling' as MaintenanceTargetType, label: 'Cooling Maintenance', durationTicks: 4, cost: 2000, effect: '+0.5°C cooling rate for 50 ticks' },
  { targetType: 'power' as MaintenanceTargetType, label: 'Power Maintenance', durationTicks: 3, cost: 1500, effect: 'Prevents next power surge incident' },
]

// ── Network Peering ─────────────────────────────────────────────

export const PEERING_OPTIONS: PeeringConfig[] = [
  { type: 'budget_transit' as PeeringType, label: 'Budget Transit', provider: 'CheapNet', bandwidthGbps: 10, costPerTick: 5, latencyMs: 25, description: 'Cheap but high latency. Good for non-critical traffic.' },
  { type: 'premium_transit' as PeeringType, label: 'Premium Transit', provider: 'FastPipe Inc', bandwidthGbps: 10, costPerTick: 15, latencyMs: 8, description: 'Low latency, reliable. Good for enterprise workloads.' },
  { type: 'public_peering' as PeeringType, label: 'Public Peering (IX)', provider: 'Metro IX', bandwidthGbps: 20, costPerTick: 8, latencyMs: 5, description: 'Internet Exchange peering. Great bandwidth and latency.' },
  { type: 'private_peering' as PeeringType, label: 'Private Peering', provider: 'DirectLink', bandwidthGbps: 40, costPerTick: 20, latencyMs: 3, description: 'Direct connection to major networks. Lowest latency.' },
]

// ── Interconnection / Meet-Me Room ──────────────────────────────

export const INTERCONNECT_PORT_CONFIG: InterconnectPortConfig[] = [
  { portType: 'copper_1g' as InterconnectPortType, label: 'Copper 1G', installCost: 500, revenuePerTick: 3, capacityUsed: 1 },
  { portType: 'fiber_10g' as InterconnectPortType, label: 'Fiber 10G', installCost: 2000, revenuePerTick: 10, capacityUsed: 1 },
  { portType: 'fiber_100g' as InterconnectPortType, label: 'Fiber 100G', installCost: 8000, revenuePerTick: 35, capacityUsed: 2 },
]

export const MEETME_ROOM_CONFIG: MeetMeRoomConfig[] = [
  { label: 'Basic Meet-Me Room', installCost: 15000, portCapacity: 12, maintenanceCostPerTick: 5, description: 'Small interconnection room with 12 ports.' },
  { label: 'Standard Meet-Me Room', installCost: 40000, portCapacity: 24, maintenanceCostPerTick: 12, description: 'Standard meet-me room with 24 ports.' },
  { label: 'Premium Meet-Me Room', installCost: 100000, portCapacity: 48, maintenanceCostPerTick: 25, description: 'Large interconnection facility with 48 ports.' },
]

export const INTERCONNECT_TENANTS = ['CloudFlare', 'Akamai', 'AWS Direct', 'Azure Express', 'Google Cloud', 'Netflix OCA', 'Meta Edge', 'Fastly', 'Limelight', 'Verizon Digital', 'AT&T Peering', 'Comcast IX', 'Level3', 'Zayo', 'Cogent']

// ── Supply Chain & Procurement ──────────────────────────────────

export const SUPPLY_CHAIN_CONFIG: SupplyChainConfig[] = [
  { itemType: 'server', baseLeadTime: 3, shortageLeadTime: 8, bulkThreshold: 10, bulkDiscount: 0.85 },
  { itemType: 'leaf_switch', baseLeadTime: 5, shortageLeadTime: 12, bulkThreshold: 5, bulkDiscount: 0.90 },
  { itemType: 'spine_switch', baseLeadTime: 8, shortageLeadTime: 20, bulkThreshold: 3, bulkDiscount: 0.88 },
  { itemType: 'cabinet', baseLeadTime: 2, shortageLeadTime: 5, bulkThreshold: 8, bulkDiscount: 0.80 },
]

// ── Weather System ──────────────────────────────────────────────

export const SEASON_CONFIG: SeasonConfig[] = [
  { season: 'spring', label: 'Spring', ambientModifier: 2, solarEfficiency: 0.6, windEfficiency: 0.7, durationTicks: 200, color: '#88ff88' },
  { season: 'summer', label: 'Summer', ambientModifier: 8, solarEfficiency: 0.9, windEfficiency: 0.4, durationTicks: 200, color: '#ffaa44' },
  { season: 'autumn', label: 'Autumn', ambientModifier: 0, solarEfficiency: 0.5, windEfficiency: 0.8, durationTicks: 200, color: '#cc8844' },
  { season: 'winter', label: 'Winter', ambientModifier: -5, solarEfficiency: 0.3, windEfficiency: 0.9, durationTicks: 200, color: '#aaddff' },
]

export const WEATHER_CONDITION_CONFIG: WeatherConditionConfig[] = [
  { condition: 'clear', label: 'Clear', ambientModifier: 0, solarMultiplier: 1.0, windMultiplier: 0.8, minDuration: 10, maxDuration: 20, chance: 0.30, color: '#ffdd44' },
  { condition: 'cloudy', label: 'Cloudy', ambientModifier: -1, solarMultiplier: 0.5, windMultiplier: 1.0, minDuration: 8, maxDuration: 15, chance: 0.25, color: '#aaaaaa' },
  { condition: 'rain', label: 'Rain', ambientModifier: -2, solarMultiplier: 0.3, windMultiplier: 1.2, minDuration: 5, maxDuration: 12, chance: 0.20, color: '#6688cc' },
  { condition: 'storm', label: 'Storm', ambientModifier: -3, solarMultiplier: 0.1, windMultiplier: 0.2, minDuration: 3, maxDuration: 8, chance: 0.10, color: '#445588' },
  { condition: 'heatwave', label: 'Heatwave', ambientModifier: 10, solarMultiplier: 1.2, windMultiplier: 0.3, minDuration: 8, maxDuration: 15, chance: 0.10, color: '#ff4444' },
  { condition: 'cold_snap', label: 'Cold Snap', ambientModifier: -8, solarMultiplier: 0.4, windMultiplier: 1.0, minDuration: 5, maxDuration: 10, chance: 0.05, color: '#44ccff' },
]

// ── Staff & HR ──────────────────────────────────────────────────

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

export const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Quinn', 'Drew', 'Blake', 'Jamie', 'Avery', 'Dakota', 'Reese', 'Skyler', 'Charlie', 'Kai', 'Sage', 'Rowan', 'Finley']
export const LAST_NAMES = ['Chen', 'Patel', 'Kim', 'Garcia', 'Murphy', 'Nakamura', 'Berg', 'Santos', 'Fischer', 'Okafor', 'Levy', 'Volkov', 'Tanaka', 'Dubois', 'Ahmed', 'Johansson', 'Rivera', 'Nguyen', 'Hoffman', 'Kowalski']

export function generateStaffName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`
}
