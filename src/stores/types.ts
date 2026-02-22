// ── Core Types ─────────────────────────────────────────────────
export type NodeType = 'server' | 'leaf_switch' | 'spine_switch'
export type GameSpeed = 0 | 1 | 2 | 3
export type CabinetEnvironment = 'production' | 'lab' | 'management'
export type CoolingType = 'air' | 'water'
export type CoolingUnitType = 'fan_tray' | 'crac' | 'crah' | 'immersion_pod'
export type CustomerType = 'general' | 'ai_training' | 'streaming' | 'crypto' | 'enterprise'
export type GeneratorStatus = 'standby' | 'running' | 'cooldown'
export type SuppressionType = 'none' | 'water_suppression' | 'gas_suppression'
export type TechBranch = 'efficiency' | 'performance' | 'resilience'
export type SuiteTier = 'starter' | 'standard' | 'professional' | 'enterprise'
export type StaffRole = 'network_engineer' | 'electrician' | 'cooling_specialist' | 'security_officer'
export type StaffSkillLevel = 1 | 2 | 3
export type ShiftPattern = 'day_only' | 'day_night' | 'round_the_clock'

// ── Carbon & Environmental Types ───────────────────────────────
export type EnergySource = 'grid_mixed' | 'grid_green' | 'onsite_solar' | 'onsite_wind'
export type GreenCert = 'energy_star' | 'leed_silver' | 'leed_gold' | 'carbon_neutral'

// ── Security & Compliance Types ────────────────────────────────
export type SecurityTier = 'basic' | 'enhanced' | 'high_security' | 'maximum'
export type SecurityFeatureId = 'cctv' | 'badge_access' | 'biometric' | 'mantrap' | 'cage_isolation' | 'encrypted_network' | 'security_noc'
export type ComplianceCertId = 'soc2_type1' | 'soc2_type2' | 'hipaa' | 'pci_dss' | 'fedramp'

// ── Competitor AI Types ────────────────────────────────────────
export type CompetitorPersonality = 'budget' | 'premium' | 'green' | 'aggressive' | 'steady'

// ── Operations Progression Types ───────────────────────────────
export type OpsTier = 'manual' | 'monitoring' | 'automation' | 'orchestration'

// ── Multi-Site Expansion Types ─────────────────────────────────
export type SiteType = 'headquarters' | 'edge_pop' | 'colocation' | 'hyperscale' | 'network_hub' | 'disaster_recovery'
export type Continent = 'north_america' | 'south_america' | 'europe' | 'asia_pacific' | 'middle_east_africa'
export type RegionId =
  | 'ashburn' | 'bay_area' | 'dallas' | 'chicago' | 'portland'
  | 'sao_paulo'
  | 'london' | 'amsterdam' | 'frankfurt' | 'nordics'
  | 'singapore' | 'tokyo' | 'mumbai'
  | 'dubai' | 'johannesburg'

export interface RegionProfile {
  powerCostMultiplier: number
  laborCostMultiplier: number
  landCostMultiplier: number
  coolingEfficiency: number
  networkConnectivity: number
  regulatoryBurden: number
  carbonTaxMultiplier: number
  taxIncentiveDiscount: number
  solarEfficiency: number
  windEfficiency: number
}

export interface RegionDemandProfile {
  general: number
  ai_training: number
  streaming: number
  crypto: number
  enterprise: number
}

export interface RegionDisasterProfile {
  earthquakeRisk: number
  floodRisk: number
  hurricaneRisk: number
  heatwaveRisk: number
  gridInstability: number
}

export interface Region {
  id: RegionId
  name: string
  continent: Continent
  coordinates: { x: number; y: number }
  profile: RegionProfile
  demandProfile: RegionDemandProfile
  disasterProfile: RegionDisasterProfile
  description: string
}

export interface SiteTypeConfig {
  type: SiteType
  label: string
  purchaseCost: number
  constructionTicks: number
  maxSuiteTier: SuiteTier
  maxCabinets: number
  maxStaff: number
  maintenanceCostPerTick: number
  description: string
}

// Per-site state snapshot — captures all site-specific arrays and fields
// so that switching between sites preserves full state
export interface SiteSnapshot {
  cabinets: Cabinet[]
  spineSwitches: SpineSwitch[]
  pdus: PDU[]
  cableTrays: CableTray[]
  cableRuns: CableRun[]
  coolingUnits: CoolingUnit[]
  chillerPlants: ChillerPlant[]
  coolingPipes: CoolingPipe[]
  busways: Busway[]
  crossConnects: CrossConnect[]
  inRowCoolers: InRowCooling[]
  rowEndSlots: RowEndSlot[]
  aisleContainments: number[]
  aisleWidths: Record<number, AisleWidth>
  raisedFloorTier: RaisedFloorTier
  cableManagementType: CableManagementType
  coolingType: CoolingType
  suiteTier: SuiteTier
  // Computed fields (restored for quick display, recalculated on tick)
  totalPower: number
  avgHeat: number
  revenue: number
  expenses: number
}

export interface Site {
  id: string
  name: string
  type: SiteType
  regionId: RegionId
  purchasedAtTick: number
  constructionTicksRemaining: number
  operational: boolean
  cabinets: number
  servers: number
  revenue: number
  expenses: number
  heat: number
  suiteTier: SuiteTier
  snapshot: SiteSnapshot | null  // full state when not active; null for HQ or not-yet-built
}

// ── Regional Incidents & Disaster Preparedness (Phase 6C) ─────
export type RegionalIncidentType =
  | 'earthquake' | 'wildfire_smoke' | 'tornado' | 'grid_collapse'
  | 'hurricane' | 'volcanic_eruption' | 'submarine_cable_cut'
  | 'monsoon_flooding' | 'extreme_heat' | 'grid_load_shedding'
  | 'thames_flooding' | 'amsterdam_flood'

export type DisasterPrepType = 'seismic_reinforcement' | 'flood_barriers' | 'hurricane_hardening' | 'elevated_equipment'

export interface RegionalIncidentDef {
  type: RegionalIncidentType
  label: string
  severity: IncidentSeverity
  description: string
  durationTicks: number
  resolveCost: number
  effect: 'heat_spike' | 'revenue_penalty' | 'power_surge' | 'traffic_drop' | 'cooling_failure' | 'hardware_failure' | 'cabinet_destruction' | 'supply_chain_halt'
  effectMagnitude: number
  /** Which regions can spawn this incident */
  regions: RegionId[]
  /** Which disaster risk profile key determines spawn chance */
  riskKey: keyof RegionDisasterProfile
  /** Base chance per tick (multiplied by region risk) */
  baseChance: number
  /** Which season(s) increase chance, if any */
  seasonalBoost?: Season[]
  /** Which disaster prep type mitigates this */
  mitigatedBy?: DisasterPrepType
  /** Damage reduction factor when mitigated (0–1, where 1 = fully mitigated) */
  mitigationFactor?: number
}

export interface DisasterPrepConfig {
  type: DisasterPrepType
  label: string
  description: string
  cost: number
  mitigates: keyof RegionDisasterProfile
  damageReduction: number   // 0–1 fraction of damage/severity prevented
  maintenanceCostPerTick: number
}

export interface SiteDisasterPrep {
  siteId: string
  type: DisasterPrepType
  installedAtTick: number
}

// ── Global Strategy Layer (Phase 6D) ──────────────────────────
export type DemandTrend = 'emerging' | 'stable' | 'saturated'
export type SovereigntyRegime = 'gdpr' | 'lgpd' | 'pdpa' | 'none'

export interface DataSovereigntyRule {
  regime: SovereigntyRegime
  label: string
  description: string
  regions: RegionId[]
  revenueBonus: number          // bonus for contracts that require local presence
  nonCompliancePenalty: number   // revenue penalty if data leaves jurisdiction
}

export interface MultiSiteContractDef {
  id: string
  company: string
  label: string
  description: string
  requiredRegions: RegionId[]           // must have operational sites in ALL these regions
  requiredSiteTypes?: SiteType[]        // optional: specific site types needed
  sovereigntyRegime?: SovereigntyRegime // optional: data sovereignty compliance
  revenuePerTick: number
  durationTicks: number
  completionBonus: number
  penaltyPerTick: number                // penalty if requirements stop being met
}

export interface ActiveMultiSiteContract {
  id: string
  def: MultiSiteContractDef
  acceptedAtTick: number
  ticksRemaining: number
  totalEarned: number
  totalPenalties: number
  consecutiveViolations: number
  status: 'active' | 'completed' | 'terminated'
}

export interface StaffTransfer {
  id: string
  staffId: string
  staffName: string
  staffRole: StaffRole
  fromSiteId: string | null     // null = HQ
  toSiteId: string | null       // null = HQ
  cost: number
  ticksRemaining: number
  startedAtTick: number
}

export interface StaffTransferConfig {
  baseCost: number              // base transfer cost
  sameContinentTicks: number    // travel time same continent
  crossContinentTicks: number   // travel time cross continent
  costMultiplierPerLevel: number // skill level multiplier on transfer cost
}

export interface CompetitorRegionalPresence {
  competitorId: string
  regionId: RegionId
  strength: number              // 0–1 local market strength
  establishedAtTick: number
}

// ── Inter-Site Networking Types (Phase 6B) ────────────────────
export type InterSiteLinkType = 'ip_transit' | 'leased_wavelength' | 'dark_fiber' | 'submarine_cable'

export interface InterSiteLink {
  id: string
  type: InterSiteLinkType
  siteAId: string | null    // null = HQ
  siteBId: string
  bandwidthGbps: number
  latencyMs: number
  costPerTick: number
  installedAtTick: number
  utilization: number       // 0–1, current bandwidth usage
  operational: boolean
}

export interface InterSiteLinkConfig {
  type: InterSiteLinkType
  label: string
  description: string
  bandwidthGbps: number
  baseLatencyMs: number
  installCost: number
  costPerTick: number
  crossContinentOnly: boolean   // submarine_cable requires cross-continent
  sameContinentOnly: boolean    // leased_wavelength / dark_fiber require same continent
  reliability: number           // 0–1, probability of staying operational each tick
}

// ── Save Slot Types ────────────────────────────────────────────
export interface SaveSlotMeta {
  slotId: number
  name: string
  timestamp: number
  money: number
  tickCount: number
  suiteTier: SuiteTier
  cabinetCount: number
}

// ── Customer Type Config Interface ─────────────────────────────
export interface CustomerTypeConfig {
  label: string
  description: string
  color: string
  powerMultiplier: number
  heatMultiplier: number
  revenueMultiplier: number
  bandwidthMultiplier: number
}

// ── Generator & Suppression Interfaces ─────────────────────────
export interface GeneratorConfig {
  label: string
  cost: number
  fuelCapacity: number
  fuelCostPerTick: number
  powerCapacityW: number
  startupTicks: number
  cooldownTicks: number
  description: string
}

export interface Generator {
  id: string
  config: GeneratorConfig
  status: GeneratorStatus
  fuelRemaining: number
  ticksUntilReady: number
}

export interface SuppressionConfig {
  label: string
  cost: number
  effectiveness: number
  equipmentDamage: boolean
  description: string
  color: string
}

// ── Tech Tree Types ────────────────────────────────────────────
export interface TechDef {
  id: string
  branch: TechBranch
  label: string
  description: string
  cost: number
  researchTicks: number
  prereqId: string | null
  effect: string
}

export interface ActiveResearch {
  techId: string
  ticksRemaining: number
}

// ── Operations Progression Config Interface ────────────────────
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
    incidentSpawnReduction: number
    autoResolveSpeedBonus: number
    revenuePenaltyReduction: number
    staffEffectivenessBonus: number
    resolveCostReduction: number
  }
  upgradeCost: number
}

// ── Infrastructure Layout Types ────────────────────────────────
export type CabinetFacing = 'north' | 'south' | 'east' | 'west'

export interface PDU {
  id: string
  col: number
  row: number
  maxCapacityKW: number
  label: string
}

export interface PDUConfig {
  label: string
  cost: number
  maxCapacityKW: number
  range: number
  description: string
}

export interface CableTray {
  id: string
  col: number
  row: number
  capacityUnits: number
}

export interface CableTrayConfig {
  label: string
  cost: number
  capacityUnits: number
  description: string
}

export interface CableRun {
  id: string
  leafCabinetId: string
  spineId: string
  length: number
  capacityGbps: number
  usesTrays: boolean
}

// ── Row-Based Data Center Layout ───────────────────────────────
export interface DataCenterRow {
  id: number
  gridRow: number
  facing: CabinetFacing
  slots: number
}

export type AisleType = 'cold' | 'hot' | 'neutral'

export interface Aisle {
  id: number
  gridRow: number
  type: AisleType
  betweenRows: [number, number]
}

export interface DataCenterLayout {
  cabinetRows: DataCenterRow[]
  aisles: Aisle[]
  totalGridRows: number
  corridorTop: number
  corridorBottom: number
}

export interface SuiteConfig {
  tier: SuiteTier
  label: string
  description: string
  cols: number
  rows: number
  maxCabinets: number
  maxSpines: number
  upgradeCost: number
  color: string
  layout: DataCenterLayout
}

// ── Staff & HR Types ───────────────────────────────────────────
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
  fatigueLevel: number
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
  baseSalary: number
  salaryMultiplier: number[]
  hireCost: number
  effect: string
}

export interface StaffCertConfig {
  id: string
  label: string
  cost: number
  durationTicks: number
  requiredRole: StaffRole | null
  effect: string
}

// ── Supply Chain & Procurement Types ───────────────────────────
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

// ── Weather System Types ───────────────────────────────────────
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

// ── Interconnection / Meet-Me Room Types ───────────────────────
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

export interface MeetMeRoomConfig {
  label: string
  installCost: number
  portCapacity: number
  maintenanceCostPerTick: number
  description: string
}

// ── Server Configuration Types ─────────────────────────────────
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

// ── Peering & Transit Types ────────────────────────────────────
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

// ── Maintenance Types ──────────────────────────────────────────
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

// ── Power Redundancy Types ─────────────────────────────────────
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

// ── Carbon & Environmental Config Interfaces ───────────────────
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

// ── Security & Compliance Config Interfaces ────────────────────
export interface SecurityFeatureConfig {
  id: SecurityFeatureId
  label: string
  description: string
  cost: number
  maintenanceCost: number
  requiredTier: SecurityTier
  intrusionDefense: number
}

export interface SecurityTierConfig {
  tier: SecurityTier
  label: string
  description: string
  cost: number
  maintenancePerTick: number
  featuresIncluded: SecurityFeatureId[]
  color: string
}

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

export interface ActiveComplianceCert {
  certId: ComplianceCertId
  grantedAtTick: number
  expiresAtTick: number
  auditInProgress: boolean
  auditStartedTick: number
}

// ── Competitor AI Types ────────────────────────────────────────
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

// ── Event Log Types ────────────────────────────────────────────
export type EventCategory = 'incident' | 'finance' | 'contract' | 'achievement' | 'infrastructure' | 'staff' | 'research' | 'system'
export type EventSeverity = 'info' | 'warning' | 'error' | 'success'

export interface EventLogEntry {
  tick: number
  gameHour: number
  category: EventCategory
  message: string
  severity: EventSeverity
}

// ── Capacity Planning Types ────────────────────────────────────
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

// ── Statistics Dashboard Types ─────────────────────────────────
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

// ── Tutorial System Types ──────────────────────────────────────
export interface TutorialTip {
  id: string
  title: string
  message: string
  category: 'build' | 'cooling' | 'finance' | 'network' | 'incidents' | 'contracts' | 'carbon' | 'security' | 'market'
}

export interface TutorialStep {
  id: string
  title: string
  objective: string
  description: string
  highlightPanel?: string
  completionCheck: string
  uiHint?: string
}

// ── Cooling Unit & Chiller Types ───────────────────────────────
export interface CoolingUnit {
  id: string
  type: CoolingUnitType
  col: number
  row: number
  operational: boolean
}

export interface CoolingUnitConfig {
  type: CoolingUnitType
  label: string
  cost: number
  coolingRate: number
  range: number
  maxCabinets: number
  powerDraw: number
  waterUsage: number
  color: string
  description: string
  requiresTech: string | null
}

export type ChillerTier = 'basic' | 'advanced'

export interface ChillerPlant {
  id: string
  col: number
  row: number
  tier: ChillerTier
  operational: boolean
}

export interface ChillerPlantConfig {
  tier: ChillerTier
  label: string
  cost: number
  range: number
  efficiencyBonus: number
  powerDraw: number
  requiresTech: string | null
  description: string
}

export interface CoolingPipe {
  id: string
  col: number
  row: number
}

// ── Loan Types ─────────────────────────────────────────────────
export interface Loan {
  id: string
  principal: number
  remaining: number
  interestRate: number
  paymentPerTick: number
  ticksRemaining: number
  label: string
}

// ── Incident System Types ──────────────────────────────────────
export type IncidentSeverity = 'minor' | 'major' | 'critical'

export interface IncidentDef {
  type: string
  label: string
  severity: IncidentSeverity
  description: string
  durationTicks: number
  resolveCost: number
  effect: 'heat_spike' | 'revenue_penalty' | 'power_surge' | 'traffic_drop' | 'cooling_failure' | 'hardware_failure' | 'chiller_failure' | 'pipe_failure'
  effectMagnitude: number
  hardwareTarget?: 'spine' | 'leaf'
}

export interface ActiveIncident {
  id: string
  def: IncidentDef
  ticksRemaining: number
  resolved: boolean
  affectedHardwareId?: string
}

// ── Contract / Tenant System Types ─────────────────────────────
export type ContractTier = 'bronze' | 'silver' | 'gold'

export interface ContractDef {
  type: string
  company: string
  tier: ContractTier
  description: string
  minServers: number
  maxTemp: number
  revenuePerTick: number
  durationTicks: number
  penaltyPerTick: number
  terminationTicks: number
  completionBonus: number
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

// ── Achievement System Types ───────────────────────────────────
export interface AchievementDef {
  id: string
  label: string
  description: string
  icon: string
}

export interface Achievement {
  def: AchievementDef
  unlockedAtTick: number
}

// ── Environment Config Interface ───────────────────────────────
export interface EnvironmentConfig {
  label: string
  name: string
  revenueMultiplier: number
  heatMultiplier: number
  description: string
  guidance: string
  color: string
  frameColors: { top: number; side: number; front: number }
}

// ── Cabinet & Spine Types ──────────────────────────────────────
export interface Cabinet {
  id: string
  col: number
  row: number
  environment: CabinetEnvironment
  customerType: CustomerType
  serverCount: number
  hasLeafSwitch: boolean
  powerStatus: boolean
  heatLevel: number
  serverAge: number
  facing: CabinetFacing
}

export interface PlacementHint {
  message: string
  type: 'tip' | 'warning' | 'info'
}

export interface SpineSwitch {
  id: string
  powerStatus: boolean
}

// ── Traffic / Network Types ────────────────────────────────────
export interface TrafficLink {
  leafCabinetId: string
  spineId: string
  bandwidthGbps: number
  capacityGbps: number
  utilization: number
  redirected: boolean
}

export interface TrafficStats {
  totalFlows: number
  totalBandwidthGbps: number
  totalCapacityGbps: number
  redirectedFlows: number
  links: TrafficLink[]
  spineUtilization: Record<string, number>
}

export interface LayerColors {
  top: number
  side: number
  front: number
}

export type LayerVisibility = Record<NodeType, boolean>
export type LayerOpacity = Record<NodeType, number>
export type LayerColorOverrides = Record<NodeType, LayerColors | null>

// ── Insurance Types ────────────────────────────────────────────
export type InsurancePolicyType = 'fire_insurance' | 'power_insurance' | 'cyber_insurance' | 'equipment_insurance'

export interface InsurancePolicyConfig {
  type: InsurancePolicyType
  label: string
  description: string
  premiumPerTick: number
  coverageAmount: number
  coveredEffects: string[]
}

// ── DR Drill Types ─────────────────────────────────────────────
export interface DrillResult {
  passed: boolean
  score: number
  findings: string[]
  tick: number
}

// ── Stock Price / Valuation Types ──────────────────────────────
export interface ValuationMilestone {
  id: string
  label: string
  targetPrice: number
  reward: number
}

// ── Patent Types ───────────────────────────────────────────────
export interface Patent {
  techId: string
  label: string
  incomePerTick: number
  grantedAtTick: number
}

// ── RFP Bidding Types ──────────────────────────────────────────
export interface RFPOffer {
  id: string
  def: ContractDef
  bidWindowTicks: number
  competitorName: string
  competitorStrength: number
}

// ── Infrastructure Entity Types ────────────────────────────────
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

// ── Scenario Types ─────────────────────────────────────────────
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

// ── Network Topology Types ─────────────────────────────────────
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

// ── Zone Adjacency Types ───────────────────────────────────────
export interface Zone {
  id: string
  type: 'environment' | 'customer'
  key: CabinetEnvironment | CustomerType
  cabinetIds: string[]
  tiles: { col: number; row: number }[]
  bonus: number
}

export interface ZoneRequirement {
  type: 'environment' | 'customer'
  key: string
  minSize: number
}

// ── Dedicated Row Types ────────────────────────────────────────
export interface DedicatedRowInfo {
  rowId: number
  gridRow: number
  environment: CabinetEnvironment
  cabinetCount: number
}

// ── Reputation Types ───────────────────────────────────────────
export type ReputationTier = 'unknown' | 'poor' | 'average' | 'good' | 'excellent' | 'legendary'

// ── View Mode Types ──────────────────────────────────────────
export type ViewMode = 'cabinet' | 'above_cabinet' | 'sub_floor'

// ── Row-End Infrastructure Slot Types ────────────────────────
export type RowEndSlotType = 'pdu_slot' | 'cooling_slot' | 'fire_panel' | 'network_patch'

export interface RowEndSlot {
  id: string
  rowId: number
  side: 'left' | 'right'
  type: RowEndSlotType
  col: number
  row: number
}

export interface RowEndSlotConfig {
  type: RowEndSlotType
  label: string
  cost: number
  effect: string
  description: string
  color: string
}

// ── Aisle Width Types ────────────────────────────────────────
export type AisleWidth = 'standard' | 'wide' | 'extra_wide'

export interface AisleWidthConfig {
  width: AisleWidth
  label: string
  cost: number
  maintenanceSpeedBonus: number
  coolingBonus: number
  description: string
}

// ── Raised Floor & Cable Management Types ────────────────────
export type RaisedFloorTier = 'none' | 'basic' | 'advanced'
export type CableManagementType = 'none' | 'overhead' | 'underfloor'

export interface RaisedFloorConfig {
  tier: RaisedFloorTier
  label: string
  cost: number
  coolingDistributionBonus: number
  description: string
}

export interface CableManagementConfig {
  type: CableManagementType
  label: string
  cost: number
  cableMessReduction: number
  description: string
}

// ── Workload Simulation Types ────────────────────────────────
export type WorkloadType = 'ai_training' | 'batch_processing' | 'live_migration'
export type WorkloadStatus = 'queued' | 'running' | 'migrating' | 'completed' | 'failed'

export interface Workload {
  id: string
  type: WorkloadType
  cabinetId: string
  serversRequired: number
  ticksTotal: number
  ticksRemaining: number
  status: WorkloadStatus
  heatMultiplier: number
  payoutOnComplete: number
  startedAtTick: number
}

export interface WorkloadConfig {
  type: WorkloadType
  label: string
  description: string
  minServers: number
  durationTicks: number
  basePayout: number
  heatMultiplier: number
  failOnOverheat: boolean
  failTemp: number
  color: string
}

// ── Advanced Scaling Tier Types ──────────────────────────────
export type AdvancedTier = 'nuclear' | 'fusion'

export interface AdvancedTierConfig {
  tier: AdvancedTier
  label: string
  description: string
  prerequisiteSuiteTier: SuiteTier
  unlockCost: number
  cols: number
  maxCabinets: number
  maxSpines: number
  powerType: string
  coolingType: string
  coolingRate: number
  powerCostMultiplier: number
  carbonPerKW: number
  color: string
}

// ── Player-Built Row Types ───────────────────────────────────
export interface CustomRow {
  id: number
  gridRow: number
  facing: CabinetFacing
  placedByPlayer: boolean
}

// ── 42U Rack Model Types ─────────────────────────────────────
export type RackEquipmentType = 'server_1u' | 'server_2u' | 'server_4u' | 'switch_1u' | 'patch_panel_1u' | 'ups_2u' | 'blank_1u' | 'storage_2u'

export interface RackSlot {
  position: number
  height: number
  equipment: RackEquipmentType | null
}

export interface RackEquipmentConfig {
  type: RackEquipmentType
  label: string
  heightU: number
  cost: number
  powerDraw: number
  heatOutput: number
  revenuePerTick: number
  description: string
  color: string
}

export interface RackDetail {
  cabinetId: string
  slots: RackSlot[]
  totalUsedU: number
  totalCapacityU: number
}

// ── Leaderboard Types ────────────────────────────────────────
export type LeaderboardCategory = 'revenue' | 'uptime' | 'pue' | 'cabinets' | 'green_energy' | 'net_worth'

export interface LeaderboardEntry {
  id: string
  playerName: string
  category: LeaderboardCategory
  value: number
  suiteTier: SuiteTier
  tickCount: number
  timestamp: number
}

// ── Audio Settings Types ─────────────────────────────────────
export interface AudioSettings {
  masterVolume: number
  sfxVolume: number
  ambientVolume: number
  muted: boolean
}

// ── Floating Text Event Types ────────────────────────────────
export interface FloatingTextEvent {
  col?: number       // grid col (for positioned text); omit for center-screen text
  row?: number       // grid row (for positioned text); omit for center-screen text
  text: string       // display text
  color: string      // CSS hex color string (e.g., '#00ff88')
  fontSize?: string  // optional font size override (default '11px')
  center?: boolean   // if true, display at viewport center
}

export type CameraEffectType = 'shake_light' | 'shake_medium' | 'shake_heavy' | 'zoom_pulse' | 'zoom_reveal'

export interface CameraEffect {
  type: CameraEffectType
  col?: number       // optional grid target for pan effects
  row?: number
}
