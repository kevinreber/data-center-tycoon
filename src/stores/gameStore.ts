import { create } from 'zustand'

// ── Re-export types for backward compatibility ─────────────────
export type {
  NodeType, GameSpeed, CabinetEnvironment, CoolingType, CoolingUnitType, CustomerType,
  GeneratorStatus, SuppressionType, TechBranch, SuiteTier, StaffRole, StaffSkillLevel,
  ShiftPattern, EnergySource, GreenCert, SecurityTier, SecurityFeatureId, ComplianceCertId,
  CompetitorPersonality, OpsTier, SiteType, Continent, RegionId,
  RegionProfile, RegionDemandProfile, RegionDisasterProfile, Region, SiteTypeConfig, Site,
  InterSiteLinkType, InterSiteLink, InterSiteLinkConfig,
  RegionalIncidentType, DisasterPrepType, RegionalIncidentDef, DisasterPrepConfig, SiteDisasterPrep,
  DemandTrend, SovereigntyRegime, DataSovereigntyRule, MultiSiteContractDef, ActiveMultiSiteContract,
  StaffTransfer, StaffTransferConfig, CompetitorRegionalPresence,
  SaveSlotMeta, CustomerTypeConfig, GeneratorConfig, Generator, SuppressionConfig,
  TechDef, ActiveResearch, OpsTierConfig, CabinetFacing,
  PDU, PDUConfig, CableTray, CableTrayConfig, CableRun,
  DataCenterRow, AisleType, Aisle, DataCenterLayout, SuiteConfig,
  StaffMember, StaffTraining, StaffRoleConfig, StaffCertConfig,
  OrderStatus, HardwareOrder, SupplyChainConfig,
  Season, WeatherCondition, SeasonConfig, WeatherConditionConfig,
  InterconnectPortType, InterconnectPort, InterconnectPortConfig, MeetMeRoomConfig,
  ServerConfig, ServerConfigDef, PeeringType, PeeringAgreement, PeeringConfig,
  MaintenanceTargetType, MaintenanceStatus, MaintenanceWindow, MaintenanceConfig,
  PowerRedundancy, PowerRedundancyConfig, EnergySourceConfig, GreenCertConfig,
  SecurityFeatureConfig, SecurityTierConfig, ComplianceCertConfig, ActiveComplianceCert,
  Competitor, CompetitorBid, EventCategory, EventSeverity, EventLogEntry,
  CapacityProjection, HistoryPoint, LifetimeStats, TutorialTip,
  CoolingUnit, CoolingUnitConfig, ChillerTier, ChillerPlant, ChillerPlantConfig, CoolingPipe,
  Loan, IncidentSeverity, IncidentDef, ActiveIncident,
  ContractTier, ContractDef, ActiveContract, AchievementDef, Achievement,
  EnvironmentConfig, Cabinet, PlacementHint, SpineSwitch,
  TrafficLink, TrafficStats, LayerColors, LayerVisibility, LayerOpacity, LayerColorOverrides,
  InsurancePolicyType, InsurancePolicyConfig, DrillResult, ValuationMilestone, Patent, RFPOffer,
  Busway, BuswayConfig, CrossConnect, CrossConnectConfig, InRowCooling, InRowCoolingConfig,
  ScenarioDef, ScenarioObjective, NetworkLink, NetworkTopologyStats,
  Zone, ZoneRequirement, DedicatedRowInfo, ReputationTier,
  // New feature types
  ViewMode, RowEndSlotType, RowEndSlot, RowEndSlotConfig,
  AisleWidth, AisleWidthConfig, RaisedFloorTier, RaisedFloorConfig,
  CableManagementType, CableManagementConfig,
  WorkloadType, WorkloadStatus, Workload, WorkloadConfig,
  AdvancedTier, AdvancedTierConfig,
  CustomRow, RackEquipmentType, RackSlot, RackEquipmentConfig, RackDetail,
  LeaderboardCategory, LeaderboardEntry, AudioSettings,
  FloatingTextEvent, CameraEffect, CameraEffectType,
  PrestigeBonuses, PrestigeState,
} from './types'

import type {
  GameSpeed, CabinetEnvironment, CoolingType, CoolingUnitType, CustomerType,
  GeneratorStatus, SuppressionType, SuiteTier, StaffRole, StaffSkillLevel, ShiftPattern,
  EnergySource, GreenCert, SecurityTier, SecurityFeatureId, ComplianceCertId, OpsTier,
  CompetitorPersonality, SiteType, RegionId, CabinetFacing, ServerConfig, InterSiteLinkType,
  InterconnectPortType, MaintenanceTargetType, MaintenanceStatus, PowerRedundancy, InsurancePolicyType,
  OrderStatus, Season, WeatherCondition, EventSeverity,
  ChillerTier, Cabinet, SpineSwitch, TrafficStats, LayerColors,
  LayerVisibility, LayerOpacity, LayerColorOverrides, NodeType,
  ContractDef, ActiveResearch,
  Generator, Loan, IncidentDef, ActiveIncident, ActiveContract, Achievement,
  PDU, CableTray, CableRun, Busway, CrossConnect, InRowCooling,
  CoolingUnit, ChillerPlant, CoolingPipe, Zone, DedicatedRowInfo,
  StaffMember, StaffTraining, HardwareOrder, InterconnectPort, PeeringAgreement,
  MaintenanceWindow, ActiveComplianceCert, Competitor, CompetitorBid,
  EventLogEntry, EventCategory, HistoryPoint, LifetimeStats, TutorialTip,
  ScenarioDef, Site, SiteSnapshot, Patent, RFPOffer, DrillResult, NetworkTopologyStats, InterSiteLink,
  SiteDisasterPrep, DisasterPrepType,
  ActiveMultiSiteContract, StaffTransfer, CompetitorRegionalPresence,
  SaveSlotMeta,
  // New feature types
  ViewMode, RowEndSlotType, RowEndSlot, AisleWidth, RaisedFloorTier,
  CableManagementType, WorkloadType, Workload, AdvancedTier,
  RackDetail, LeaderboardEntry, LeaderboardCategory, AudioSettings,
  FloatingTextEvent, CameraEffect,
  DataCenterLayout, DataCenterRow,
  PrestigeState,
} from './types'

// ── Re-export constants ────────────────────────────────────────
export { SIM, POWER_DRAW, RACK_COST, TRAFFIC, MAX_SERVERS_PER_CABINET, MAX_CABINETS, MAX_SPINES, MAX_SAVE_SLOTS, DEFAULT_COLORS, MINUTES_PER_TICK, COSTS } from './constants'
import { SIM, POWER_DRAW, COSTS, TRAFFIC, MAX_SERVERS_PER_CABINET, MINUTES_PER_TICK } from './constants'

// ── Re-export configs ──────────────────────────────────────────
export { CUSTOMER_TYPE_CONFIG, GENERATOR_OPTIONS, SUPPRESSION_CONFIG, COOLING_CONFIG, COOLING_UNIT_CONFIG, CHILLER_PLANT_CONFIG, COOLING_PIPE_CONFIG, ENVIRONMENT_CONFIG, SERVER_CONFIG_OPTIONS, BASE_AMBIENT_DISSIPATION, UNCONNECTED_CRAH_PENALTY, MAX_CHILLER_PLANTS } from './configs/equipment'
import { CUSTOMER_TYPE_CONFIG, GENERATOR_OPTIONS, SUPPRESSION_CONFIG, COOLING_CONFIG, COOLING_UNIT_CONFIG, CHILLER_PLANT_CONFIG, COOLING_PIPE_CONFIG, ENVIRONMENT_CONFIG, MAX_CHILLER_PLANTS } from './configs/equipment'

export { PDU_OPTIONS, CABLE_TRAY_OPTIONS, AISLE_CONFIG, AISLE_CONTAINMENT_CONFIG, SPACING_CONFIG, generateLayout, SUITE_TIERS, SUITE_TIER_ORDER, BUSWAY_OPTIONS, CROSSCONNECT_OPTIONS, INROW_COOLING_OPTIONS, NOISE_CONFIG, POWER_REDUNDANCY_CONFIG, ZONE_BONUS_CONFIG, MIXED_ENV_PENALTY_CONFIG, DEDICATED_ROW_BONUS_CONFIG, FLOOR_PLAN_CONFIG, WIDE_AISLE_COOLING_BONUS, MIN_ROW_GAP, buildLayoutFromRows } from './configs/infrastructure'
import { PDU_OPTIONS, CABLE_TRAY_OPTIONS, AISLE_CONFIG, AISLE_CONTAINMENT_CONFIG, SPACING_CONFIG, SUITE_TIERS, SUITE_TIER_ORDER, BUSWAY_OPTIONS, CROSSCONNECT_OPTIONS, INROW_COOLING_OPTIONS, NOISE_CONFIG, POWER_REDUNDANCY_CONFIG, ZONE_BONUS_CONFIG, MIXED_ENV_PENALTY_CONFIG, DEDICATED_ROW_BONUS_CONFIG, FLOOR_PLAN_CONFIG, MIN_ROW_GAP, buildLayoutFromRows } from './configs/infrastructure'

export { TECH_TREE, TECH_BRANCH_COLORS, OPS_TIER_CONFIG, OPS_TIER_ORDER, REPUTATION_TIERS, CONTRACT_CATALOG, CONTRACT_TIER_COLORS, CONTRACT_OFFER_INTERVAL, MAX_ACTIVE_CONTRACTS, CONTRACT_OFFER_COUNT, COMPLIANCE_CONTRACT_CATALOG, COMPLIANCE_CONTRACT_REQUIREMENTS, ZONE_CONTRACT_CATALOG, ZONE_CONTRACT_REQUIREMENTS, ACHIEVEMENT_CATALOG, INCIDENT_CATALOG, INCIDENT_CHANCE, MAX_ACTIVE_INCIDENTS, SCENARIO_CATALOG, TUTORIAL_TIPS, TUTORIAL_STEPS } from './configs/progression'
import { TECH_TREE, OPS_TIER_CONFIG, OPS_TIER_ORDER, CONTRACT_CATALOG, CONTRACT_OFFER_INTERVAL, MAX_ACTIVE_CONTRACTS, CONTRACT_OFFER_COUNT, COMPLIANCE_CONTRACT_REQUIREMENTS, ZONE_CONTRACT_CATALOG, ZONE_CONTRACT_REQUIREMENTS, ACHIEVEMENT_CATALOG, INCIDENT_CATALOG, INCIDENT_CHANCE, MAX_ACTIVE_INCIDENTS, SCENARIO_CATALOG, TUTORIAL_TIPS, TUTORIAL_STEPS } from './configs/progression'

export { LOAN_OPTIONS, POWER_MARKET, DEPRECIATION, INSURANCE_OPTIONS, DRILL_CONFIG, VALUATION_MILESTONES, PATENT_CONFIG, RFP_CONFIG, SPOT_COMPUTE_CONFIG, MAINTENANCE_CONFIG, PEERING_OPTIONS, INTERCONNECT_PORT_CONFIG, MEETME_ROOM_CONFIG, INTERCONNECT_TENANTS, SUPPLY_CHAIN_CONFIG, SEASON_CONFIG, WEATHER_CONDITION_CONFIG, STAFF_ROLE_CONFIG, STAFF_CERT_CONFIG, SHIFT_PATTERN_CONFIG, MAX_STAFF_BY_TIER, FIRST_NAMES, LAST_NAMES, generateStaffName } from './configs/economy'
import { LOAN_OPTIONS, POWER_MARKET, DEPRECIATION, INSURANCE_OPTIONS, DRILL_CONFIG, VALUATION_MILESTONES, PATENT_CONFIG, RFP_CONFIG, SPOT_COMPUTE_CONFIG, MAINTENANCE_CONFIG, PEERING_OPTIONS, INTERCONNECT_PORT_CONFIG, MEETME_ROOM_CONFIG, INTERCONNECT_TENANTS, SUPPLY_CHAIN_CONFIG, SEASON_CONFIG, WEATHER_CONDITION_CONFIG, STAFF_ROLE_CONFIG, STAFF_CERT_CONFIG, SHIFT_PATTERN_CONFIG, MAX_STAFF_BY_TIER, generateStaffName } from './configs/economy'

export { ENERGY_SOURCE_CONFIG, GREEN_CERT_CONFIG, CARBON_TAX_SCHEDULE, WATER_USAGE_CONFIG, EWASTE_CONFIG, SECURITY_FEATURE_CONFIG, SECURITY_TIER_CONFIG, COMPLIANCE_CERT_CONFIG, COMPETITOR_PERSONALITIES, COMPETITOR_NAMES, COMPETITOR_SCALE_CONFIG, MULTI_SITE_GATE, SITE_TYPE_CONFIG, REGION_CATALOG, REGION_RESEARCH_COST, MAX_SITES, INTER_SITE_LINK_CONFIG, DISTANCE_LATENCY_MODIFIER, EDGE_POP_CDN_REVENUE_PER_GBPS, MAX_LINKS_PER_SITE, BANDWIDTH_OVERAGE_COST, REGIONAL_INCIDENT_CATALOG, DISASTER_PREP_CONFIG, MAX_REGIONAL_INCIDENTS, DATA_SOVEREIGNTY_CONFIG, MULTI_SITE_CONTRACT_CATALOG, MAX_MULTI_SITE_CONTRACTS, STAFF_TRANSFER_CONFIG, MAX_STAFF_TRANSFERS, DEMAND_GROWTH_CONFIG, COMPETITOR_REGIONAL_CONFIG, getRegionSovereignty } from './configs/world'
import { ENERGY_SOURCE_CONFIG, GREEN_CERT_CONFIG, CARBON_TAX_SCHEDULE, WATER_USAGE_CONFIG, EWASTE_CONFIG, SECURITY_FEATURE_CONFIG, SECURITY_TIER_CONFIG, COMPLIANCE_CERT_CONFIG, COMPETITOR_PERSONALITIES, COMPETITOR_NAMES, COMPETITOR_SCALE_CONFIG, MULTI_SITE_GATE, SITE_TYPE_CONFIG, REGION_CATALOG, REGION_RESEARCH_COST, MAX_SITES, INTER_SITE_LINK_CONFIG, DISTANCE_LATENCY_MODIFIER, EDGE_POP_CDN_REVENUE_PER_GBPS, MAX_LINKS_PER_SITE, REGIONAL_INCIDENT_CATALOG, DISASTER_PREP_CONFIG, MAX_REGIONAL_INCIDENTS, DATA_SOVEREIGNTY_CONFIG, MULTI_SITE_CONTRACT_CATALOG, MAX_MULTI_SITE_CONTRACTS, STAFF_TRANSFER_CONFIG, MAX_STAFF_TRANSFERS, DEMAND_GROWTH_CONFIG, COMPETITOR_REGIONAL_CONFIG } from './configs/world'

// ── Re-export calculations ─────────────────────────────────────
export { coolingOverheadFactor, calcManagementBonus, calcTrafficWithCapacity, calcCabinetCooling, getCabinetsInPDURange, getPDULoad, isPDUOverloaded, calcCableLength, getFacingOffsets, calcAisleBonus, countAisleViolations, getAdjacentCabinets, hasMaintenanceAccess, calcSpacingHeatEffect, countMessyCables, calcZones, isZoneRequirementMet, calcMixedEnvPenalties, calcDedicatedRows, getSuiteLimits, getCabinetRowAtGrid, getValidCabinetGridRows, getRowFacing, getPlacementHints, getActiveLayout, formatGameTime, getReputationTier } from './calculations'
import { calcStats, calcTraffic, calcTrafficWithCapacity, calcCabinetCooling, isPDUOverloaded, calcCableLength, calcAisleBonus, countAisleViolations, calcSpacingHeatEffect, countMessyCables, calcZones, isZoneRequirementMet, calcMixedEnvPenalties, calcDedicatedRows, getSuiteLimits, getCabinetRowAtGrid, getReputationTier, getAdjacentCabinets, hasMaintenanceAccess, manhattanDist } from './calculations'

export { getChillerConnection } from './chiller'
import { getChillerConnection } from './chiller'

// ── Re-export new feature configs ─────────────────────────────
export { ROW_END_SLOT_CONFIG, MAX_ROW_END_SLOTS, AISLE_WIDTH_CONFIG, RAISED_FLOOR_CONFIG, CABLE_MANAGEMENT_CONFIG, WORKLOAD_CONFIG, MAX_WORKLOADS_PER_CABINET, MAX_ACTIVE_WORKLOADS, ADVANCED_TIER_CONFIG, RACK_EQUIPMENT_CONFIG, RACK_TOTAL_U, DEFAULT_AUDIO_SETTINGS, LEADERBOARD_STORAGE_KEY, MAX_LEADERBOARD_ENTRIES, PRESTIGE_STORAGE_KEY, PRESTIGE_REQUIREMENTS, PRESTIGE_BONUSES_PER_LEVEL, MAX_PRESTIGE_LEVEL, PRESTIGE_POINT_WEIGHTS, DEFAULT_PRESTIGE_STATE, calcPrestigeBonuses, calcPrestigePoints } from './configs/features'
import { ROW_END_SLOT_CONFIG, AISLE_WIDTH_CONFIG, RAISED_FLOOR_CONFIG, CABLE_MANAGEMENT_CONFIG, WORKLOAD_CONFIG, MAX_ACTIVE_WORKLOADS, ADVANCED_TIER_CONFIG, RACK_EQUIPMENT_CONFIG, RACK_TOTAL_U, DEFAULT_AUDIO_SETTINGS, LEADERBOARD_STORAGE_KEY, MAX_LEADERBOARD_ENTRIES, PRESTIGE_STORAGE_KEY, PRESTIGE_REQUIREMENTS, DEFAULT_PRESTIGE_STATE, calcPrestigeBonuses, calcPrestigePoints, MAX_PRESTIGE_LEVEL } from './configs/features'


// ── Save/Load Helpers (private) ─────────────────────────────────
const SAVE_INDEX_KEY = 'fabric-tycoon-saves-index'
const SAVE_SLOT_PREFIX = 'fabric-tycoon-save-slot-'

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

let nextRFPId = 1

// ── Time-of-Day / Demand (private) ─────────────────────────────

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
  aisleBonus: number                          // current hot/cold aisle cooling bonus (0–0.25+)
  aisleViolations: number                     // number of rows with mixed facings (always 0 with enforced layout)
  aisleContainments: number[]                 // aisle IDs that have containment installed
  messyCableCount: number                     // cables not routed through trays
  pduOverloaded: boolean                      // whether any PDU is overloaded
  infraIncidentBonus: number                  // extra incident chance from messy cables

  // Zone adjacency bonuses
  zones: Zone[]                               // active zones from cabinet clustering
  zoneBonusRevenue: number                    // total zone revenue bonus last tick

  // Cabinet Organization Incentives
  mixedEnvPenaltyCount: number                // cabinets currently suffering mixed-env penalty
  dedicatedRows: DedicatedRowInfo[]           // rows with uniform environment (fully filled)
  dedicatedRowBonusRevenue: number            // revenue from dedicated row bonus last tick

  // Cabinet selection
  selectedCabinetId: string | null            // currently selected cabinet (clicked in canvas)

  // Placement mode
  placementMode: boolean                      // whether user is in placement mode
  placementEnvironment: CabinetEnvironment    // selected environment for next placement
  placementCustomerType: CustomerType         // selected customer type for next placement
  placementFacing: CabinetFacing              // selected facing for next placement

  // Equipment placement mode (server/leaf targeting)
  equipmentPlacementMode: 'server' | 'leaf' | null  // which equipment type is being placed

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
  coolingUnits: CoolingUnit[]
  chillerPlants: ChillerPlant[]
  coolingPipes: CoolingPipe[]

  // Sandbox Mode
  sandboxMode: boolean

  // Scenario System
  activeScenario: ScenarioDef | null
  scenarioProgress: Record<string, boolean>   // objective ID → completed
  scenariosCompleted: string[]                // IDs of completed scenarios
  scenarioBestTicks: Record<string, number>   // scenario ID → best completion tick count
  scenarioStartTick: number                   // tick when current scenario was started

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
  showWelcomeModal: boolean
  showRegionSelect: boolean
  hqRegionId: RegionId
  tutorialStepIndex: number
  tutorialCompleted: boolean
  tutorialPanelsOpened: string[]

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

  // Phase 6 — Multi-Site Expansion
  multiSiteUnlocked: boolean
  worldMapOpen: boolean
  sites: Site[]
  activeSiteId: string | null            // null = HQ (original site)
  hqSnapshot: SiteSnapshot | null        // HQ state stored here when visiting a remote site
  researchedRegions: RegionId[]          // regions with revealed profiles
  totalSiteRevenue: number               // aggregate revenue from background sites per tick
  totalSiteExpenses: number              // aggregate expenses from background sites per tick

  // Phase 6B — Inter-Site Networking
  interSiteLinks: InterSiteLink[]        // connections between sites
  interSiteLinkCost: number              // total link costs per tick
  edgePopCDNRevenue: number              // CDN revenue from edge PoPs with backhaul

  // Phase 6C — Regional Incidents & Disaster Preparedness
  siteDisasterPreps: SiteDisasterPrep[]   // disaster prep investments per site
  regionalIncidentCount: number           // lifetime regional incidents spawned
  disasterPrepMaintenanceCost: number     // total maintenance cost per tick for all disaster preps
  regionalIncidentsBlocked: number        // lifetime regional incidents fully mitigated

  // Phase 6D — Global Strategy Layer
  demandGrowthMultipliers: Record<string, Record<string, number>>  // regionId → customerType → growth multiplier
  multiSiteContracts: ActiveMultiSiteContract[]
  multiSiteContractRevenue: number        // aggregate per-tick revenue from multi-site contracts
  staffTransfers: StaffTransfer[]          // staff currently in transit between sites
  staffTransfersCompleted: number          // lifetime completed transfers
  competitorRegionalPresence: CompetitorRegionalPresence[]  // competitors in regions

  // ── New Features ─────────────────────────────────────────────

  // View Mode (sub-floor view)
  viewMode: ViewMode

  // Row-End Infrastructure Slots
  rowEndSlots: RowEndSlot[]

  // Aisle Width Upgrades
  aisleWidths: Record<number, AisleWidth>  // aisle ID → width

  // Raised Floor & Cable Management
  raisedFloorTier: RaisedFloorTier
  cableManagementType: CableManagementType

  // Workload Simulation
  activeWorkloads: Workload[]
  completedWorkloads: number
  failedWorkloads: number
  workloadRevenue: number

  // Advanced Scaling Tiers
  advancedTier: AdvancedTier | null

  // Player-Built Rows (custom row mode)
  customRowMode: boolean
  customLayout: DataCenterLayout | null
  rowPlacementMode: boolean
  rowPlacementFacing: CabinetFacing

  // 42U Rack Model
  rackDetails: Record<string, RackDetail>   // cabinet ID → rack detail

  // Leaderboards (local)
  leaderboardEntries: LeaderboardEntry[]

  // Audio Settings
  audioSettings: AudioSettings

  // Floating Text Events (consumed by GameCanvas → Phaser each tick)
  pendingFloatingTexts: FloatingTextEvent[]

  // Camera Effects (consumed by GameCanvas → Phaser each tick)
  pendingCameraEffects: CameraEffect[]

  // Save / Load
  hasSaved: boolean
  activeSlotId: number | null
  saveSlots: SaveSlotMeta[]

  // Demo mode
  isDemo: boolean

  // Prestige / New Game+
  prestige: PrestigeState

  // Actions
  selectCabinet: (id: string | null) => void
  addCabinet: (col: number, row: number, environment: CabinetEnvironment, customerType?: CustomerType, facing?: CabinetFacing) => void
  enterPlacementMode: (environment: CabinetEnvironment, customerType: CustomerType, facing?: CabinetFacing) => void
  exitPlacementMode: () => void
  togglePlacementFacing: () => void
  upgradeNextCabinet: () => void
  addLeafToNextCabinet: () => void
  addServerToCabinet: (cabinetId: string) => void
  addLeafToCabinet: (cabinetId: string) => void
  enterEquipmentPlacementMode: (type: 'server' | 'leaf') => void
  exitEquipmentPlacementMode: () => void
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
  placeCoolingUnit: (type: CoolingUnitType, col: number, row: number) => void
  removeCoolingUnit: (id: string) => void
  placeChillerPlant: (tier: ChillerTier, col: number, row: number) => void
  removeChillerPlant: (id: string) => void
  placeCoolingPipe: (col: number, row: number) => void
  removeCoolingPipe: (id: string) => void
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
  // Aisle containment actions
  installAisleContainment: (aisleId: number) => void
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
  // Phase 6 — Multi-Site Expansion actions
  toggleWorldMap: () => void
  researchRegion: (regionId: RegionId) => void
  purchaseSite: (regionId: RegionId, siteType: SiteType, name: string) => void
  switchSite: (siteId: string | null) => void
  // Phase 6B — Inter-Site Networking actions
  installInterSiteLink: (siteAId: string | null, siteBId: string, linkType: InterSiteLinkType) => void
  removeInterSiteLink: (linkId: string) => void
  // Phase 6C — Disaster Preparedness actions
  installDisasterPrep: (siteId: string, prepType: DisasterPrepType) => void
  removeDisasterPrep: (siteId: string, prepType: DisasterPrepType) => void
  // Phase 6D — Global Strategy Layer actions
  acceptMultiSiteContract: (contractId: string) => void
  transferStaff: (staffId: string, toSiteId: string | null) => void
  cancelStaffTransfer: (transferId: string) => void
  // New Feature Actions
  setViewMode: (mode: ViewMode) => void
  placeRowEndSlot: (rowId: number, side: 'left' | 'right', type: RowEndSlotType) => void
  removeRowEndSlot: (slotId: string) => void
  upgradeAisleWidth: (aisleId: number, width: AisleWidth) => void
  installRaisedFloor: (tier: RaisedFloorTier) => void
  setCableManagement: (type: CableManagementType) => void
  startWorkload: (type: WorkloadType, cabinetId: string) => void
  migrateWorkload: (workloadId: string, targetCabinetId: string) => void
  cancelWorkload: (workloadId: string) => void
  unlockAdvancedTier: (tier: AdvancedTier) => void
  toggleCustomRowMode: () => void
  placeCustomRow: (gridRow: number, facing: CabinetFacing) => void
  removeCustomRow: (gridRow: number) => void
  autoLayoutRows: () => void
  enterRowPlacementMode: (facing: CabinetFacing) => void
  exitRowPlacementMode: () => void
  toggleRowPlacementFacing: () => void
  installRackEquipment: (cabinetId: string, position: number, equipmentType: string) => void
  removeRackEquipment: (cabinetId: string, position: number) => void
  submitLeaderboardEntry: (playerName: string, category: LeaderboardCategory) => void
  setAudioSettings: (settings: Partial<AudioSettings>) => void
  // Tutorial actions
  dismissTip: (tipId: string) => void
  toggleTutorial: () => void
  selectHqRegion: (regionId: RegionId) => void
  startTutorial: () => void
  skipTutorial: () => void
  advanceTutorialStep: () => void
  restartTutorial: () => void
  replayTutorial: () => void
  trackPanelOpen: (panelId: string) => void
  // Demo
  loadDemoState: () => void
  exitDemo: () => void
  // Save / Load
  saveGame: (slotId: number, name?: string) => void
  loadGame: (slotId: number) => boolean
  deleteGame: (slotId: number) => void
  resetGame: () => void
  refreshSaveSlots: () => void
  // Prestige / New Game+
  doPrestige: () => void
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
let nextSiteId = 1
let nextLinkId = 1

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

// ── Prestige persistence helpers ──────────────────────────────
function loadPrestige(): PrestigeState {
  try {
    const raw = localStorage.getItem(PRESTIGE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PRESTIGE_STATE }
    const data = JSON.parse(raw) as PrestigeState
    return { ...DEFAULT_PRESTIGE_STATE, ...data }
  } catch {
    return { ...DEFAULT_PRESTIGE_STATE }
  }
}

function savePrestige(state: PrestigeState): void {
  try {
    localStorage.setItem(PRESTIGE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

// ── Prestige eligibility check (standalone, not a store action) ──
export function canPrestige(state: Pick<GameState, 'suiteTier' | 'money' | 'reputationScore' | 'cabinets' | 'prestige'>): boolean {
  const tierOrder = ['starter', 'standard', 'professional', 'enterprise']
  const playerTierIdx = tierOrder.indexOf(state.suiteTier)
  const requiredTierIdx = tierOrder.indexOf(PRESTIGE_REQUIREMENTS.minSuiteTier)
  return (
    playerTierIdx >= requiredTierIdx &&
    state.money >= PRESTIGE_REQUIREMENTS.minMoney &&
    state.reputationScore >= PRESTIGE_REQUIREMENTS.minReputation &&
    state.cabinets.length >= PRESTIGE_REQUIREMENTS.minCabinets &&
    state.prestige.level < MAX_PRESTIGE_LEVEL
  )
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
  aisleContainments: [] as number[],
  messyCableCount: 0,
  pduOverloaded: false,
  infraIncidentBonus: 0,

  // Zone adjacency bonuses
  zones: [],
  zoneBonusRevenue: 0,

  // Cabinet Organization Incentives
  mixedEnvPenaltyCount: 0,
  dedicatedRows: [],
  dedicatedRowBonusRevenue: 0,

  // Cabinet selection
  selectedCabinetId: null,

  // Placement mode
  placementMode: false,
  placementEnvironment: 'production' as CabinetEnvironment,
  placementCustomerType: 'general' as CustomerType,
  placementFacing: 'north' as CabinetFacing,
  equipmentPlacementMode: null,

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
  coolingUnits: [],
  chillerPlants: [],
  coolingPipes: [],

  // Sandbox Mode
  sandboxMode: false,

  // Scenario System
  activeScenario: null,
  scenarioProgress: {},
  scenariosCompleted: [],
  scenarioBestTicks: {},
  scenarioStartTick: 0,

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
  showWelcomeModal: true,
  showRegionSelect: false,
  hqRegionId: 'ashburn' as RegionId,
  tutorialStepIndex: -1,
  tutorialCompleted: false,
  tutorialPanelsOpened: [],

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

  // Phase 6 — Multi-Site Expansion
  multiSiteUnlocked: false,
  worldMapOpen: false,
  sites: [] as Site[],
  activeSiteId: null as string | null,
  hqSnapshot: null as SiteSnapshot | null,
  researchedRegions: [] as RegionId[],
  totalSiteRevenue: 0,
  totalSiteExpenses: 0,

  // Phase 6B — Inter-Site Networking
  interSiteLinks: [] as InterSiteLink[],
  interSiteLinkCost: 0,
  edgePopCDNRevenue: 0,

  // Phase 6C — Regional Incidents & Disaster Preparedness
  siteDisasterPreps: [] as SiteDisasterPrep[],
  regionalIncidentCount: 0,
  disasterPrepMaintenanceCost: 0,
  regionalIncidentsBlocked: 0,

  // Phase 6D — Global Strategy Layer
  demandGrowthMultipliers: {} as Record<string, Record<string, number>>,
  multiSiteContracts: [] as ActiveMultiSiteContract[],
  multiSiteContractRevenue: 0,
  staffTransfers: [] as StaffTransfer[],
  staffTransfersCompleted: 0,
  competitorRegionalPresence: [] as CompetitorRegionalPresence[],

  // ── New Features ────────────────────────────────────────────

  // View Mode
  viewMode: 'cabinet' as ViewMode,

  // Row-End Infrastructure Slots
  rowEndSlots: [] as RowEndSlot[],

  // Aisle Width Upgrades
  aisleWidths: {} as Record<number, AisleWidth>,

  // Raised Floor & Cable Management
  raisedFloorTier: 'none' as RaisedFloorTier,
  cableManagementType: 'none' as CableManagementType,

  // Workload Simulation
  activeWorkloads: [] as Workload[],
  completedWorkloads: 0,
  failedWorkloads: 0,
  workloadRevenue: 0,

  // Advanced Scaling Tiers
  advancedTier: null as AdvancedTier | null,

  // Player-Built Rows
  customRowMode: false,
  customLayout: null as DataCenterLayout | null,
  rowPlacementMode: false,
  rowPlacementFacing: 'south' as CabinetFacing,

  // 42U Rack Model
  rackDetails: {} as Record<string, RackDetail>,

  // Leaderboards
  leaderboardEntries: [] as LeaderboardEntry[],

  // Audio Settings
  audioSettings: { ...DEFAULT_AUDIO_SETTINGS },

  // Floating Text Events
  pendingFloatingTexts: [],

  // Camera Effects
  pendingCameraEffects: [] as CameraEffect[],

  // Demo mode
  isDemo: false,

  // Prestige / New Game+
  prestige: loadPrestige(),

  // Save / Load
  hasSaved: false,
  activeSlotId: null,
  saveSlots: getSaveIndex(),

  // ── Cabinet Selection ────────────────────────────────────────

  selectCabinet: (id: string | null) =>
    set({ selectedCabinetId: id }),

  // ── Build Actions ───────────────────────────────────────────

  addCabinet: (...[col, row, environment, customerType = 'general']: [col: number, row: number, environment: CabinetEnvironment, customerType?: CustomerType, facing?: CabinetFacing]) =>
    set((state) => {
      if (state.money < COSTS.cabinet) return state
      const suiteLimits = getSuiteLimits(state.suiteTier)
      if (state.cabinets.length >= suiteLimits.maxCabinets) return state

      // Row-based validation: check that the grid row is a valid cabinet row
      const layout = state.customLayout ?? suiteLimits.layout
      const cabinetRow = getCabinetRowAtGrid(row, layout)
      if (!cabinetRow) return state // Not a cabinet row (aisle or corridor)

      // Validate col is within row slot count
      if (col < 0 || col >= cabinetRow.slots) return state

      // Validate tile is not occupied
      if (state.cabinets.some((c) => c.col === col && c.row === row)) return state

      // Enforce row-level facing (ignore user's facing selection)
      const enforcedFacing = cabinetRow.facing

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
        facing: enforcedFacing,
      }
      const newCabinets = [...state.cabinets, cab]
      const activeLayout = state.customLayout ?? suiteLimits.layout
      const newAisleBonus = calcAisleBonus(newCabinets, state.suiteTier, state.aisleContainments, activeLayout)
      const newAisleViolations = countAisleViolations()
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
    set((state) => ({ placementMode: true, equipmentPlacementMode: null, placementEnvironment: environment, placementCustomerType: customerType, placementFacing: facing ?? state.placementFacing })),

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

  addServerToCabinet: (cabinetId: string) =>
    set((state) => {
      if (state.money < COSTS.server) return state
      const idx = state.cabinets.findIndex((c) => c.id === cabinetId)
      if (idx === -1) return state
      const cab = state.cabinets[idx]
      if (cab.serverCount >= MAX_SERVERS_PER_CABINET) return state
      const newCabinets = state.cabinets.map((c, i) =>
        i === idx ? { ...c, serverCount: c.serverCount + 1 } : c
      )
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.server,
        equipmentPlacementMode: null,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  addLeafToCabinet: (cabinetId: string) =>
    set((state) => {
      if (state.money < COSTS.leaf_switch) return state
      const idx = state.cabinets.findIndex((c) => c.id === cabinetId)
      if (idx === -1) return state
      const cab = state.cabinets[idx]
      if (cab.hasLeafSwitch) return state
      const newCabinets = state.cabinets.map((c, i) =>
        i === idx ? { ...c, hasLeafSwitch: true } : c
      )
      return {
        cabinets: newCabinets,
        money: state.money - COSTS.leaf_switch,
        equipmentPlacementMode: null,
        ...calcStats(newCabinets, state.spineSwitches),
      }
    }),

  enterEquipmentPlacementMode: (type: 'server' | 'leaf') =>
    set({ equipmentPlacementMode: type, placementMode: false, selectedCabinetId: null }),

  exitEquipmentPlacementMode: () =>
    set({ equipmentPlacementMode: null }),

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

      // If custom row mode is active, rebuild layout for the new tier's floor plan
      let customLayout: DataCenterLayout | null = null
      if (state.customRowMode && state.customLayout) {
        const newFloorPlan = FLOOR_PLAN_CONFIG[tier]
        const newCols = config.cols
        // Remap existing custom rows to new floor plan, preserving relative positions
        const oldFloorPlan = FLOOR_PLAN_CONFIG[state.suiteTier]
        const scale = (newFloorPlan.totalGridRows - 2) / (oldFloorPlan.totalGridRows - 2)
        const remappedRows: DataCenterRow[] = state.customLayout.cabinetRows.map(r => ({
          ...r,
          gridRow: Math.min(
            Math.max(1, Math.round(1 + (r.gridRow - 1) * scale)),
            newFloorPlan.totalGridRows - 2
          ),
          slots: newCols,
        }))
        // Deduplicate any rows that mapped to same gridRow
        const seen = new Set<number>()
        const deduped = remappedRows.filter(r => {
          if (seen.has(r.gridRow)) return false
          seen.add(r.gridRow)
          return true
        })
        customLayout = buildLayoutFromRows(deduped, newFloorPlan.totalGridRows)
      }

      return {
        suiteTier: tier,
        money: state.money - config.upgradeCost,
        ...(customLayout ? { customLayout } : {}),
        pendingCameraEffects: [...state.pendingCameraEffects, { type: 'zoom_reveal' as const }],
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
      // With row-enforced facing, toggling individual cabinet facing is a no-op
      // Facing is determined by the row layout
      const cab = state.cabinets.find(c => c.id === cabinetId)
      if (!cab) return state
      const layout = SUITE_TIERS[state.suiteTier].layout
      const cabinetRow = getCabinetRowAtGrid(cab.row, layout)
      // If somehow the cabinet is not on a valid row, allow toggle for backward compat
      if (cabinetRow) return state // facing is enforced, no change needed
      const newCabinets = state.cabinets.map((c) =>
        c.id === cabinetId ? { ...c, facing: (c.facing === 'north' ? 'south' : 'north') as CabinetFacing } : c
      )
      return {
        cabinets: newCabinets,
        aisleBonus: calcAisleBonus(newCabinets, state.suiteTier, state.aisleContainments, state.customLayout ?? undefined),
        aisleViolations: countAisleViolations(),
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

  placeCoolingUnit: (type: CoolingUnitType, col: number, row: number) =>
    set((state) => {
      const config = COOLING_UNIT_CONFIG.find((c) => c.type === type)
      if (!config) return state
      if (!state.sandboxMode && state.money < config.cost) return state
      if (config.requiresTech && !state.unlockedTech.includes(config.requiresTech)) return state
      // Max 20 cooling units total
      if (state.coolingUnits.length >= 20) return state
      // No duplicate placement on same tile (except immersion pods can share with cabinets)
      if (state.coolingUnits.some((u) => u.col === col && u.row === row)) return state

      const unit: CoolingUnit = {
        id: `cu-${Date.now()}-${state.coolingUnits.length}`,
        type,
        col, row,
        operational: true,
      }
      return {
        coolingUnits: [...state.coolingUnits, unit],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  removeCoolingUnit: (id: string) =>
    set((state) => ({
      coolingUnits: state.coolingUnits.filter((u) => u.id !== id),
    })),

  placeChillerPlant: (tier: ChillerTier, col: number, row: number) =>
    set((state) => {
      const config = CHILLER_PLANT_CONFIG.find((c) => c.tier === tier)
      if (!config) return state
      if (!state.sandboxMode && state.money < config.cost) return state
      if (config.requiresTech && !state.unlockedTech.includes(config.requiresTech)) return state
      if (state.chillerPlants.length >= MAX_CHILLER_PLANTS) return state
      // No duplicate placement on same tile
      if (state.chillerPlants.some((p) => p.col === col && p.row === row)) return state
      if (state.coolingUnits.some((u) => u.col === col && u.row === row)) return state

      const plant: ChillerPlant = {
        id: `chiller-${Date.now()}-${state.chillerPlants.length}`,
        col, row,
        tier,
        operational: true,
      }
      return {
        chillerPlants: [...state.chillerPlants, plant],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  removeChillerPlant: (id: string) =>
    set((state) => ({
      chillerPlants: state.chillerPlants.filter((p) => p.id !== id),
    })),

  placeCoolingPipe: (col: number, row: number) =>
    set((state) => {
      if (!state.sandboxMode && state.money < COOLING_PIPE_CONFIG.cost) return state
      if (state.coolingPipes.length >= COOLING_PIPE_CONFIG.maxPipes) return state
      // No duplicate placement
      if (state.coolingPipes.some((p) => p.col === col && p.row === row)) return state

      const pipe: CoolingPipe = {
        id: `pipe-${Date.now()}-${state.coolingPipes.length}`,
        col, row,
      }
      return {
        coolingPipes: [...state.coolingPipes, pipe],
        money: state.sandboxMode ? state.money : state.money - COOLING_PIPE_CONFIG.cost,
      }
    }),

  removeCoolingPipe: (id: string) =>
    set((state) => ({
      coolingPipes: state.coolingPipes.filter((p) => p.id !== id),
    })),

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
        scenarioStartTick: state.tickCount,
      }
    }),

  abandonScenario: () =>
    set({ activeScenario: null, scenarioProgress: {}, scenarioStartTick: 0 }),

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

  // ── Aisle Containment Actions ───────────────────────────────────

  installAisleContainment: (aisleId: number) =>
    set((state) => {
      const layout = SUITE_TIERS[state.suiteTier].layout
      // Validate aisle exists
      const aisle = layout.aisles.find(a => a.id === aisleId)
      if (!aisle) return state
      // Already installed
      if (state.aisleContainments.includes(aisleId)) return state
      // Check minimum suite tier
      const minTierIdx = SUITE_TIER_ORDER.indexOf(AISLE_CONTAINMENT_CONFIG.minSuiteTier)
      const currentTierIdx = SUITE_TIER_ORDER.indexOf(state.suiteTier)
      if (currentTierIdx < minTierIdx) return state
      // Check funds
      if (!state.sandboxMode && state.money < AISLE_CONTAINMENT_CONFIG.cost) return state

      const newContainments = [...state.aisleContainments, aisleId]
      const newAisleBonus = calcAisleBonus(state.cabinets, state.suiteTier, newContainments, state.customLayout ?? undefined)
      return {
        aisleContainments: newContainments,
        aisleBonus: newAisleBonus,
        money: state.sandboxMode ? state.money : state.money - AISLE_CONTAINMENT_CONFIG.cost,
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

  // ── Phase 6: Multi-Site Expansion Actions ──────────────────────

  toggleWorldMap: () =>
    set((state) => ({ worldMapOpen: !state.worldMapOpen })),

  researchRegion: (regionId: RegionId) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      if (state.researchedRegions.includes(regionId)) return state
      if (state.money < REGION_RESEARCH_COST) return state
      const region = REGION_CATALOG.find((r) => r.id === regionId)
      if (!region) return state
      return {
        researchedRegions: [...state.researchedRegions, regionId],
        money: state.money - REGION_RESEARCH_COST,
      }
    }),

  purchaseSite: (regionId: RegionId, siteType: SiteType, name: string) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      if (siteType === 'headquarters') return state  // can't buy another HQ
      if (state.sites.length >= MAX_SITES) return state
      if (!state.researchedRegions.includes(regionId)) return state
      // Check if already have a site in this region
      if (state.sites.some((s) => s.regionId === regionId)) return state
      const region = REGION_CATALOG.find((r) => r.id === regionId)
      if (!region) return state
      const config = SITE_TYPE_CONFIG[siteType]
      const landCost = Math.round(config.purchaseCost * region.profile.landCostMultiplier)
      if (state.money < landCost) return state
      const newSite: Site = {
        id: `site-${nextSiteId++}`,
        name: name || `${region.name} ${config.label}`,
        type: siteType,
        regionId,
        purchasedAtTick: state.tickCount,
        constructionTicksRemaining: config.constructionTicks,
        operational: false,
        cabinets: 0,
        servers: 0,
        revenue: 0,
        expenses: 0,
        heat: region.profile.coolingEfficiency + 22, // ambient based on region
        suiteTier: 'starter',
        snapshot: null,
      }
      return {
        sites: [...state.sites, newSite],
        money: state.money - landCost,
      }
    }),

  switchSite: (siteId: string | null) =>
    set((state) => {
      // Already on the requested site
      if (siteId === state.activeSiteId) return state

      // If switching to a remote site, validate it
      if (siteId !== null) {
        const target = state.sites.find((s) => s.id === siteId)
        if (!target || !target.operational) return state
      }

      // ── Snapshot current site state ───────────────────────────
      const currentSnapshot: SiteSnapshot = {
        cabinets: state.cabinets,
        spineSwitches: state.spineSwitches,
        pdus: state.pdus,
        cableTrays: state.cableTrays,
        cableRuns: state.cableRuns,
        coolingUnits: state.coolingUnits,
        chillerPlants: state.chillerPlants,
        coolingPipes: state.coolingPipes,
        busways: state.busways,
        crossConnects: state.crossConnects,
        inRowCoolers: state.inRowCoolers,
        rowEndSlots: state.rowEndSlots,
        aisleContainments: state.aisleContainments,
        aisleWidths: state.aisleWidths,
        raisedFloorTier: state.raisedFloorTier,
        cableManagementType: state.cableManagementType,
        coolingType: state.coolingType,
        suiteTier: state.suiteTier,
        totalPower: state.totalPower,
        avgHeat: state.avgHeat,
        revenue: state.revenue,
        expenses: state.expenses,
      }

      // Save snapshot into the current site's entry
      let updatedSites = state.sites
      if (state.activeSiteId === null) {
        // Currently at HQ — store snapshot in a special 'hq' site field on the store
        // We don't have an HQ site in the sites array, so we use hqSnapshot
      } else {
        // Currently at a remote site — update its snapshot
        updatedSites = state.sites.map((s) =>
          s.id === state.activeSiteId
            ? {
                ...s,
                snapshot: currentSnapshot,
                cabinets: state.cabinets.length,
                servers: state.cabinets.reduce((sum, c) => sum + c.serverCount, 0),
                suiteTier: state.suiteTier,
              }
            : s
        )
      }

      // ── Restore target site state ─────────────────────────────
      if (siteId === null) {
        // Switching back to HQ — restore from hqSnapshot
        const hq = state.hqSnapshot
        if (!hq) return { activeSiteId: null, sites: updatedSites }
        return {
          activeSiteId: null,
          sites: updatedSites,
          cabinets: hq.cabinets,
          spineSwitches: hq.spineSwitches,
          pdus: hq.pdus,
          cableTrays: hq.cableTrays,
          cableRuns: hq.cableRuns,
          coolingUnits: hq.coolingUnits,
          chillerPlants: hq.chillerPlants,
          coolingPipes: hq.coolingPipes,
          busways: hq.busways,
          crossConnects: hq.crossConnects,
          inRowCoolers: hq.inRowCoolers,
          rowEndSlots: hq.rowEndSlots,
          aisleContainments: hq.aisleContainments,
          aisleWidths: hq.aisleWidths,
          raisedFloorTier: hq.raisedFloorTier,
          cableManagementType: hq.cableManagementType,
          coolingType: hq.coolingType,
          suiteTier: hq.suiteTier,
          hqSnapshot: null,
          ...calcStats(hq.cabinets, hq.spineSwitches),
          trafficStats: calcTraffic(hq.cabinets, hq.spineSwitches),
        }
      }

      // Switching to a remote site — restore its snapshot
      const target = updatedSites.find((s) => s.id === siteId)!
      const snap = target.snapshot
      // Save HQ snapshot if leaving HQ
      const hqSnap = state.activeSiteId === null ? currentSnapshot : state.hqSnapshot

      if (snap) {
        return {
          activeSiteId: siteId,
          sites: updatedSites,
          hqSnapshot: hqSnap,
          cabinets: snap.cabinets,
          spineSwitches: snap.spineSwitches,
          pdus: snap.pdus,
          cableTrays: snap.cableTrays,
          cableRuns: snap.cableRuns,
          coolingUnits: snap.coolingUnits,
          chillerPlants: snap.chillerPlants,
          coolingPipes: snap.coolingPipes,
          busways: snap.busways,
          crossConnects: snap.crossConnects,
          inRowCoolers: snap.inRowCoolers,
          rowEndSlots: snap.rowEndSlots,
          aisleContainments: snap.aisleContainments,
          aisleWidths: snap.aisleWidths,
          raisedFloorTier: snap.raisedFloorTier,
          cableManagementType: snap.cableManagementType,
          coolingType: snap.coolingType,
          suiteTier: snap.suiteTier,
          ...calcStats(snap.cabinets, snap.spineSwitches),
          trafficStats: calcTraffic(snap.cabinets, snap.spineSwitches),
        }
      }

      // No snapshot yet (freshly built site) — start with empty state
      return {
        activeSiteId: siteId,
        sites: updatedSites,
        hqSnapshot: hqSnap,
        cabinets: [],
        spineSwitches: [],
        pdus: [],
        cableTrays: [],
        cableRuns: [],
        coolingUnits: [],
        chillerPlants: [],
        coolingPipes: [],
        busways: [],
        crossConnects: [],
        inRowCoolers: [],
        rowEndSlots: [],
        aisleContainments: [],
        aisleWidths: {},
        raisedFloorTier: 'none' as RaisedFloorTier,
        cableManagementType: 'none' as CableManagementType,
        coolingType: 'air' as CoolingType,
        suiteTier: target.suiteTier,
        ...calcStats([], []),
        trafficStats: calcTraffic([], []),
      }
    }),

  // ── Phase 6B — Inter-Site Networking Actions ─────────────────────

  installInterSiteLink: (siteAId: string | null, siteBId: string, linkType: InterSiteLinkType) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      // Validate sites exist and are operational
      if (siteAId !== null) {
        const siteA = state.sites.find((s) => s.id === siteAId)
        if (!siteA || !siteA.operational) return state
      }
      const siteB = state.sites.find((s) => s.id === siteBId)
      if (!siteB || !siteB.operational) return state

      // Can't link a site to itself
      if (siteAId === siteBId) return state

      // Check max links per site
      const linksForA = state.interSiteLinks.filter((l) => l.siteAId === siteAId || l.siteBId === siteAId || (siteAId === null && (l.siteAId === null)))
      const linksForB = state.interSiteLinks.filter((l) => l.siteAId === siteBId || l.siteBId === siteBId)
      if (linksForA.length >= MAX_LINKS_PER_SITE || linksForB.length >= MAX_LINKS_PER_SITE) return state

      // Check if link already exists between these two sites
      if (state.interSiteLinks.some((l) =>
        (l.siteAId === siteAId && l.siteBId === siteBId) ||
        (l.siteAId === siteBId && l.siteBId === siteAId) ||
        (siteAId === null && l.siteAId === null && l.siteBId === siteBId) ||
        (siteAId === null && l.siteBId === siteAId && l.siteAId === siteBId)
      )) return state

      const config = INTER_SITE_LINK_CONFIG[linkType]
      if (state.money < config.installCost && !state.sandboxMode) return state

      // Determine continents of both sites
      const regionA = siteAId === null ? null : REGION_CATALOG.find((r) => r.id === state.sites.find((s) => s.id === siteAId)?.regionId)
      const regionB = REGION_CATALOG.find((r) => r.id === siteB.regionId)
      // For HQ, use the first site's region or default to 'ashburn' (HQ is the original data center)
      const continentA = siteAId === null ? 'north_america' : regionA?.continent
      const continentB = regionB?.continent
      const sameCont = continentA === continentB

      // Validate continent constraints
      if (config.crossContinentOnly && sameCont) return state
      if (config.sameContinentOnly && !sameCont) return state

      // Calculate latency based on distance
      let distLatency = DISTANCE_LATENCY_MODIFIER.same_continent
      if (sameCont) {
        // Check if same region (metro)
        const regionIdA = siteAId === null ? 'ashburn' : state.sites.find((s) => s.id === siteAId)?.regionId
        const regionIdB = siteB.regionId
        distLatency = regionIdA === regionIdB ? DISTANCE_LATENCY_MODIFIER.same_metro : DISTANCE_LATENCY_MODIFIER.same_continent
      } else {
        distLatency = DISTANCE_LATENCY_MODIFIER.cross_continent
      }

      const newLink: InterSiteLink = {
        id: `link-${nextLinkId++}`,
        type: linkType,
        siteAId,
        siteBId,
        bandwidthGbps: config.bandwidthGbps,
        latencyMs: config.baseLatencyMs + distLatency,
        costPerTick: config.costPerTick,
        installedAtTick: state.tickCount,
        utilization: 0,
        operational: true,
      }
      return {
        interSiteLinks: [...state.interSiteLinks, newLink],
        money: state.sandboxMode ? state.money : state.money - config.installCost,
      }
    }),

  removeInterSiteLink: (linkId: string) =>
    set((state) => {
      const link = state.interSiteLinks.find((l) => l.id === linkId)
      if (!link) return state
      return {
        interSiteLinks: state.interSiteLinks.filter((l) => l.id !== linkId),
      }
    }),

  // ── Phase 6C — Disaster Preparedness Actions ─────────────────────

  installDisasterPrep: (siteId: string, prepType: DisasterPrepType) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      // Check site exists
      const site = state.sites.find((s) => s.id === siteId)
      if (!site) return state
      // Check not already installed for this site
      if (state.siteDisasterPreps.some((p) => p.siteId === siteId && p.type === prepType)) return state
      const config = DISASTER_PREP_CONFIG[prepType]
      if (!state.sandboxMode && state.money < config.cost) return state
      return {
        siteDisasterPreps: [...state.siteDisasterPreps, { siteId, type: prepType, installedAtTick: state.tickCount }],
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  removeDisasterPrep: (siteId: string, prepType: DisasterPrepType) =>
    set((state) => {
      return {
        siteDisasterPreps: state.siteDisasterPreps.filter((p) => !(p.siteId === siteId && p.type === prepType)),
      }
    }),

  // ── Phase 6D — Global Strategy Layer Actions ───────────────────────

  acceptMultiSiteContract: (contractId: string) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      // Check max active
      const activeContracts = state.multiSiteContracts.filter((c) => c.status === 'active')
      if (activeContracts.length >= MAX_MULTI_SITE_CONTRACTS) return state
      // Find contract def
      const def = MULTI_SITE_CONTRACT_CATALOG.find((c) => c.id === contractId)
      if (!def) return state
      // Check not already active
      if (state.multiSiteContracts.some((c) => c.def.id === contractId && c.status === 'active')) return state
      // Check all required regions have operational sites
      const operationalSiteRegions = state.sites.filter((s) => s.operational).map((s) => s.regionId)
      // HQ is always in ashburn
      const allRegions = ['ashburn' as const, ...operationalSiteRegions]
      if (!def.requiredRegions.every((r) => allRegions.includes(r))) return state
      // Check required site types if specified
      if (def.requiredSiteTypes && def.requiredSiteTypes.length > 0) {
        const operationalSiteTypes = state.sites.filter((s) => s.operational).map((s) => s.type)
        operationalSiteTypes.push('headquarters')
        if (!def.requiredSiteTypes.some((t) => operationalSiteTypes.includes(t))) return state
      }
      const newContract: ActiveMultiSiteContract = {
        id: `msc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        def,
        acceptedAtTick: state.tickCount,
        ticksRemaining: def.durationTicks,
        totalEarned: 0,
        totalPenalties: 0,
        consecutiveViolations: 0,
        status: 'active',
      }
      return {
        multiSiteContracts: [...state.multiSiteContracts, newContract],
      }
    }),

  transferStaff: (staffId: string, toSiteId: string | null) =>
    set((state) => {
      if (!state.multiSiteUnlocked) return state
      // Check max transfers
      if (state.staffTransfers.length >= MAX_STAFF_TRANSFERS) return state
      // Staff must exist
      const staff = state.staff.find((s) => s.id === staffId)
      if (!staff) return state
      // Staff can't already be in transit
      if (state.staffTransfers.some((t) => t.staffId === staffId)) return state
      // Determine destination region and from site
      const fromSiteId = state.activeSiteId
      if (fromSiteId === toSiteId) return state
      // Calculate cost and duration
      const cost = STAFF_TRANSFER_CONFIG.baseCost * (1 + STAFF_TRANSFER_CONFIG.costMultiplierPerLevel * (staff.skillLevel - 1))
      if (!state.sandboxMode && state.money < cost) return state
      // Determine if same/cross continent
      const fromRegion = fromSiteId ? state.sites.find((s) => s.id === fromSiteId)?.regionId : 'ashburn'
      const toRegion = toSiteId ? state.sites.find((s) => s.id === toSiteId)?.regionId : 'ashburn'
      const fromContinent = REGION_CATALOG.find((r) => r.id === fromRegion)?.continent
      const toContinent = REGION_CATALOG.find((r) => r.id === toRegion)?.continent
      const ticks = fromContinent === toContinent ? STAFF_TRANSFER_CONFIG.sameContinentTicks : STAFF_TRANSFER_CONFIG.crossContinentTicks
      const transfer: StaffTransfer = {
        id: `xfr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        staffId,
        staffName: staff.name,
        staffRole: staff.role,
        fromSiteId,
        toSiteId,
        cost,
        ticksRemaining: ticks,
        startedAtTick: state.tickCount,
      }
      return {
        staffTransfers: [...state.staffTransfers, transfer],
        staff: state.staff.filter((s) => s.id !== staffId),  // remove from current site roster
        money: state.sandboxMode ? state.money : state.money - cost,
      }
    }),

  cancelStaffTransfer: (transferId: string) =>
    set((state) => {
      const transfer = state.staffTransfers.find((t) => t.id === transferId)
      if (!transfer) return state
      // Return staff to origin if cancelling (no refund)
      return {
        staffTransfers: state.staffTransfers.filter((t) => t.id !== transferId),
      }
    }),

  // ── New Feature Actions ──────────────────────────────────────────

  setViewMode: (mode: ViewMode) =>
    set({ viewMode: mode }),

  placeRowEndSlot: (rowId: number, side: 'left' | 'right', type: RowEndSlotType) =>
    set((state) => {
      const config = ROW_END_SLOT_CONFIG.find((c) => c.type === type)
      if (!config) return state
      if (state.money < config.cost && !state.sandboxMode) return state
      // Check if slot already occupied
      if (state.rowEndSlots.some((s) => s.rowId === rowId && s.side === side)) return state
      const layout = SUITE_TIERS[state.suiteTier].layout
      const cabRow = layout.cabinetRows.find((r) => r.id === rowId)
      if (!cabRow) return state
      const col = side === 'left' ? -1 : layout.cabinetRows[0].slots
      const newSlot: RowEndSlot = {
        id: `res-${rowId}-${side}`,
        rowId,
        side,
        type,
        col,
        row: cabRow.gridRow,
      }
      const stats = calcStats(state.cabinets, state.spineSwitches)
      return {
        rowEndSlots: [...state.rowEndSlots, newSlot],
        money: state.sandboxMode ? state.money : state.money - config.cost,
        ...stats,
      }
    }),

  removeRowEndSlot: (slotId: string) =>
    set((state) => ({
      rowEndSlots: state.rowEndSlots.filter((s) => s.id !== slotId),
    })),

  upgradeAisleWidth: (aisleId: number, width: AisleWidth) =>
    set((state) => {
      const config = AISLE_WIDTH_CONFIG.find((c) => c.width === width)
      if (!config) return state
      if (state.money < config.cost && !state.sandboxMode) return state
      return {
        aisleWidths: { ...state.aisleWidths, [aisleId]: width },
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  installRaisedFloor: (tier: RaisedFloorTier) =>
    set((state) => {
      const config = RAISED_FLOOR_CONFIG.find((c) => c.tier === tier)
      if (!config) return state
      if (state.money < config.cost && !state.sandboxMode) return state
      return {
        raisedFloorTier: tier,
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  setCableManagement: (type: CableManagementType) =>
    set((state) => {
      const config = CABLE_MANAGEMENT_CONFIG.find((c) => c.type === type)
      if (!config) return state
      if (state.money < config.cost && !state.sandboxMode) return state
      // Underfloor requires raised floor
      if (type === 'underfloor' && state.raisedFloorTier === 'none') return state
      return {
        cableManagementType: type,
        money: state.sandboxMode ? state.money : state.money - config.cost,
      }
    }),

  startWorkload: (type: WorkloadType, cabinetId: string) =>
    set((state) => {
      const config = WORKLOAD_CONFIG.find((c) => c.type === type)
      if (!config) return state
      const cabinet = state.cabinets.find((c) => c.id === cabinetId)
      if (!cabinet || !cabinet.powerStatus) return state
      if (cabinet.serverCount < config.minServers) return state
      if (state.activeWorkloads.length >= MAX_ACTIVE_WORKLOADS) return state
      // Only one workload per cabinet
      if (state.activeWorkloads.some((w) => w.cabinetId === cabinetId && w.status === 'running')) return state
      const newWorkload: Workload = {
        id: `wl-${state.tickCount}-${cabinetId}`,
        type,
        cabinetId,
        serversRequired: config.minServers,
        ticksTotal: config.durationTicks,
        ticksRemaining: config.durationTicks,
        status: 'running',
        heatMultiplier: config.heatMultiplier,
        payoutOnComplete: config.basePayout,
        startedAtTick: state.tickCount,
      }
      return { activeWorkloads: [...state.activeWorkloads, newWorkload] }
    }),

  migrateWorkload: (workloadId: string, targetCabinetId: string) =>
    set((state) => {
      const workload = state.activeWorkloads.find((w) => w.id === workloadId)
      if (!workload || workload.status !== 'running') return state
      const target = state.cabinets.find((c) => c.id === targetCabinetId)
      if (!target || !target.powerStatus) return state
      if (target.serverCount < workload.serversRequired) return state
      if (state.activeWorkloads.some((w) => w.cabinetId === targetCabinetId && w.status === 'running' && w.id !== workloadId)) return state
      return {
        activeWorkloads: state.activeWorkloads.map((w) =>
          w.id === workloadId ? { ...w, cabinetId: targetCabinetId, status: 'migrating' as const, ticksRemaining: w.ticksRemaining + 3 } : w
        ),
      }
    }),

  cancelWorkload: (workloadId: string) =>
    set((state) => ({
      activeWorkloads: state.activeWorkloads.filter((w) => w.id !== workloadId),
    })),

  unlockAdvancedTier: (tier: AdvancedTier) =>
    set((state) => {
      const config = ADVANCED_TIER_CONFIG.find((c) => c.tier === tier)
      if (!config) return state
      if (state.suiteTier !== config.prerequisiteSuiteTier) return state
      if (state.money < config.unlockCost && !state.sandboxMode) return state
      if (state.advancedTier === tier) return state
      // Nuclear requires completing enterprise; fusion requires nuclear
      if (tier === 'fusion' && state.advancedTier !== 'nuclear') return state
      return {
        advancedTier: tier,
        money: state.sandboxMode ? state.money : state.money - config.unlockCost,
      }
    }),

  toggleCustomRowMode: () =>
    set((state) => {
      const enabling = !state.customRowMode
      if (enabling && !state.customLayout) {
        // Initialize custom layout from current default layout
        const defaultLayout = SUITE_TIERS[state.suiteTier].layout
        const floorPlan = FLOOR_PLAN_CONFIG[state.suiteTier]
        // Rebuild rows repositioned into the expanded floor plan using auto-layout
        const cols = SUITE_TIERS[state.suiteTier].cols
        const maxRows = floorPlan.maxCabinetRows
        const interiorRows = floorPlan.totalGridRows - 2 // exclude corridors
        const spacing = Math.max(2, Math.floor(interiorRows / maxRows))
        const placedRows: DataCenterRow[] = []
        for (let i = 0; i < maxRows; i++) {
          const gridRow = 1 + Math.min(i * spacing, interiorRows - 1)
          const facing: CabinetFacing = i % 2 === 0 ? 'south' : 'north'
          placedRows.push({ id: i, gridRow, facing, slots: cols })
        }
        const layout = buildLayoutFromRows(placedRows, floorPlan.totalGridRows)
        // Remap existing cabinets from old gridRows to new gridRows
        const oldRows = defaultLayout.cabinetRows
        const cabinets = state.cabinets.map(cab => {
          const oldRow = oldRows.find(r => r.gridRow === cab.row)
          if (!oldRow) return cab
          const newRow = placedRows.find(r => r.id === oldRow.id)
          if (!newRow || newRow.gridRow === cab.row) return cab
          return { ...cab, row: newRow.gridRow, facing: newRow.facing }
        })
        return {
          customRowMode: true,
          customLayout: layout,
          cabinets,
          ...calcStats(cabinets, state.spineSwitches),
        }
      } else if (!enabling) {
        // Switching back to default layout — remap cabinets back
        const defaultLayout = SUITE_TIERS[state.suiteTier].layout
        const customRows = state.customLayout?.cabinetRows ?? []
        const cabinets = state.cabinets.map(cab => {
          const customRow = customRows.find(r => r.gridRow === cab.row)
          if (!customRow) return cab
          const defaultRow = defaultLayout.cabinetRows.find(r => r.id === customRow.id)
          if (!defaultRow || defaultRow.gridRow === cab.row) return cab
          return { ...cab, row: defaultRow.gridRow, facing: defaultRow.facing }
        })
        return {
          customRowMode: false,
          customLayout: null,
          rowPlacementMode: false,
          cabinets,
          ...calcStats(cabinets, state.spineSwitches),
        }
      }
      return { customRowMode: enabling }
    }),

  placeCustomRow: (gridRow: number, facing: CabinetFacing) =>
    set((state) => {
      if (!state.customRowMode) return state
      const floorPlan = FLOOR_PLAN_CONFIG[state.suiteTier]
      const cols = SUITE_TIERS[state.suiteTier].cols
      const existingRows = state.customLayout?.cabinetRows ?? []

      // Validate: not in corridor
      if (gridRow <= 0 || gridRow >= floorPlan.totalGridRows - 1) return state
      // Validate: max rows not exceeded
      if (existingRows.length >= floorPlan.maxCabinetRows) return state
      // Validate: not already a cabinet row
      if (existingRows.some(r => r.gridRow === gridRow)) return state
      // Validate: minimum gap from other rows (fire code)
      const tooClose = existingRows.some(r => Math.abs(r.gridRow - gridRow) < MIN_ROW_GAP + 1)
      if (tooClose) return state

      const newId = existingRows.length > 0 ? Math.max(...existingRows.map(r => r.id)) + 1 : 0
      const newRow: DataCenterRow = { id: newId, gridRow, facing, slots: cols }
      const allRows = [...existingRows, newRow]
      const layout = buildLayoutFromRows(allRows, floorPlan.totalGridRows)

      return {
        customLayout: layout,
        rowPlacementMode: false,
        aisleBonus: calcAisleBonus(state.cabinets, state.suiteTier, state.aisleContainments, layout),
      }
    }),

  removeCustomRow: (gridRow: number) =>
    set((state) => {
      if (!state.customRowMode || !state.customLayout) return state
      const existingRows = state.customLayout.cabinetRows
      const rowToRemove = existingRows.find(r => r.gridRow === gridRow)
      if (!rowToRemove) return state

      // Cannot remove a row that has cabinets on it
      if (state.cabinets.some(c => c.row === gridRow)) return state

      const remaining = existingRows.filter(r => r.gridRow !== gridRow)
      // Re-assign sequential IDs
      const reindexed = remaining
        .sort((a, b) => a.gridRow - b.gridRow)
        .map((r, i) => ({ ...r, id: i }))
      const floorPlan = FLOOR_PLAN_CONFIG[state.suiteTier]
      const layout = buildLayoutFromRows(reindexed, floorPlan.totalGridRows)

      return {
        customLayout: layout,
        aisleBonus: calcAisleBonus(state.cabinets, state.suiteTier, state.aisleContainments, layout),
      }
    }),

  autoLayoutRows: () =>
    set((state) => {
      if (!state.customRowMode) return state
      // Only auto-layout if no cabinets placed (otherwise it's too disruptive)
      if (state.cabinets.length > 0) return state

      const floorPlan = FLOOR_PLAN_CONFIG[state.suiteTier]
      const cols = SUITE_TIERS[state.suiteTier].cols
      const maxRows = floorPlan.maxCabinetRows
      const interiorRows = floorPlan.totalGridRows - 2
      const spacing = Math.max(2, Math.floor(interiorRows / maxRows))
      const placedRows: DataCenterRow[] = []
      for (let i = 0; i < maxRows; i++) {
        const gridRow = 1 + Math.min(i * spacing, interiorRows - 1)
        const facing: CabinetFacing = i % 2 === 0 ? 'south' : 'north'
        placedRows.push({ id: i, gridRow, facing, slots: cols })
      }
      const layout = buildLayoutFromRows(placedRows, floorPlan.totalGridRows)

      return { customLayout: layout }
    }),

  enterRowPlacementMode: (facing: CabinetFacing) =>
    set({ rowPlacementMode: true, rowPlacementFacing: facing, placementMode: false }),

  exitRowPlacementMode: () =>
    set({ rowPlacementMode: false }),

  toggleRowPlacementFacing: () =>
    set((state) => ({
      rowPlacementFacing: state.rowPlacementFacing === 'south' ? 'north' : 'south',
    })),

  installRackEquipment: (cabinetId: string, position: number, equipmentType: string) =>
    set((state) => {
      const cabinet = state.cabinets.find((c) => c.id === cabinetId)
      if (!cabinet) return state
      const equipConfig = RACK_EQUIPMENT_CONFIG.find((c) => c.type === equipmentType)
      if (!equipConfig) return state
      if (state.money < equipConfig.cost && !state.sandboxMode) return state
      if (position < 1 || position + equipConfig.heightU - 1 > RACK_TOTAL_U) return state
      const existing = state.rackDetails[cabinetId] ?? { cabinetId, slots: [], totalUsedU: 0, totalCapacityU: RACK_TOTAL_U }
      // Check for overlap
      for (const slot of existing.slots) {
        if (slot.equipment && position < slot.position + slot.height && position + equipConfig.heightU > slot.position) return state
      }
      const newSlot = { position, height: equipConfig.heightU, equipment: equipmentType as RackDetail['slots'][0]['equipment'] }
      const newSlots = [...existing.slots, newSlot].sort((a, b) => a.position - b.position)
      const totalUsedU = newSlots.reduce((sum, s) => sum + (s.equipment ? s.height : 0), 0)
      return {
        rackDetails: { ...state.rackDetails, [cabinetId]: { ...existing, slots: newSlots, totalUsedU, totalCapacityU: RACK_TOTAL_U } },
        money: state.sandboxMode ? state.money : state.money - equipConfig.cost,
      }
    }),

  removeRackEquipment: (cabinetId: string, position: number) =>
    set((state) => {
      const detail = state.rackDetails[cabinetId]
      if (!detail) return state
      const newSlots = detail.slots.filter((s) => s.position !== position)
      const totalUsedU = newSlots.reduce((sum, s) => sum + (s.equipment ? s.height : 0), 0)
      return {
        rackDetails: { ...state.rackDetails, [cabinetId]: { ...detail, slots: newSlots, totalUsedU } },
      }
    }),

  submitLeaderboardEntry: (playerName: string, category: LeaderboardCategory) =>
    set((state) => {
      let value = 0
      switch (category) {
        case 'revenue': value = state.lifetimeStats.totalRevenueEarned; break
        case 'uptime': value = state.lifetimeStats.longestUptimeStreak; break
        case 'pue': value = state.pue > 0 ? state.pue : 999; break
        case 'cabinets': value = state.cabinets.length; break
        case 'green_energy': value = state.greenCertifications.length; break
        case 'net_worth': value = state.money; break
      }
      const entry: LeaderboardEntry = {
        id: `lb-${Date.now()}`,
        playerName,
        category,
        value,
        suiteTier: state.suiteTier,
        tickCount: state.tickCount,
        timestamp: Date.now(),
      }
      const entries = [...state.leaderboardEntries, entry]
        .sort((a, b) => category === 'pue' ? a.value - b.value : b.value - a.value)
        .slice(0, MAX_LEADERBOARD_ENTRIES)
      // Persist to localStorage
      try { localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries)) } catch { /* ignore */ }
      return { leaderboardEntries: entries }
    }),

  setAudioSettings: (settings: Partial<AudioSettings>) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings },
    })),

  // ── Tutorial Actions ────────────────────────────────────────────

  dismissTip: (tipId: string) =>
    set((state) => ({
      seenTips: [...state.seenTips, tipId],
      activeTip: state.activeTip?.id === tipId ? null : state.activeTip,
    })),

  toggleTutorial: () =>
    set((state) => ({ tutorialEnabled: !state.tutorialEnabled, activeTip: null })),

  startTutorial: () =>
    set({ showWelcomeModal: false, showRegionSelect: true, tutorialEnabled: true, tutorialCompleted: false }),

  skipTutorial: () =>
    set({ showWelcomeModal: false, showRegionSelect: true, tutorialEnabled: false, tutorialCompleted: false }),

  selectHqRegion: (regionId: RegionId) =>
    set((state) => ({
      showRegionSelect: false,
      hqRegionId: regionId,
      tutorialStepIndex: state.tutorialEnabled ? 0 : -1,
    })),

  advanceTutorialStep: () =>
    set((state) => {
      const nextIndex = state.tutorialStepIndex + 1
      if (nextIndex >= TUTORIAL_STEPS.length) {
        return { tutorialStepIndex: nextIndex, tutorialCompleted: true }
      }
      return { tutorialStepIndex: nextIndex }
    }),

  restartTutorial: () =>
    set({ showWelcomeModal: true, showRegionSelect: false, tutorialEnabled: true, tutorialStepIndex: -1, tutorialCompleted: false, seenTips: [], activeTip: null, tutorialPanelsOpened: [] }),

  replayTutorial: () =>
    set({ tutorialEnabled: true, tutorialStepIndex: 0, tutorialCompleted: false, tutorialPanelsOpened: [] }),

  trackPanelOpen: (panelId: string) =>
    set((state) => {
      if (state.tutorialPanelsOpened.includes(panelId)) return state
      return { tutorialPanelsOpened: [...state.tutorialPanelsOpened, panelId] }
    }),

  // ── Demo Mode ─────────────────────────────────────────────────

  loadDemoState: () => {
    // Build a professional-tier data center with a diverse, fully-operational layout
    const demoCabinets: Cabinet[] = []
    const customerTypes: CustomerType[] = ['general', 'ai_training', 'streaming', 'crypto', 'enterprise']
    const environments: CabinetEnvironment[] = ['production', 'production', 'production', 'lab', 'management']
    let cabId = 1

    // Professional tier: 10 cols x 4 rows — uses row-based layout grid positions
    // Professional layout: Row 0 (gridRow=1), Row 1 (gridRow=3), Row 2 (gridRow=5), Row 3 (gridRow=7)
    const proLayout = SUITE_TIERS.professional.layout
    const gridRows = proLayout.cabinetRows.map(r => r.gridRow) // [1, 3, 5, 7]
    const positions: [number, number][] = [
      // Row 0 (gridRow 1) — full (10 cols)
      [0,gridRows[0]],[1,gridRows[0]],[2,gridRows[0]],[3,gridRows[0]],[4,gridRows[0]],[5,gridRows[0]],[6,gridRows[0]],[7,gridRows[0]],
      // Row 1 (gridRow 3) — full
      [0,gridRows[1]],[1,gridRows[1]],[2,gridRows[1]],[3,gridRows[1]],[4,gridRows[1]],[5,gridRows[1]],[6,gridRows[1]],[7,gridRows[1]],
      // Row 2 (gridRow 5) — partial
      [0,gridRows[2]],[1,gridRows[2]],[2,gridRows[2]],[3,gridRows[2]],[4,gridRows[2]],
      // Row 3 (gridRow 7) — partial
      [0,gridRows[3]],[1,gridRows[3]],[2,gridRows[3]],
    ]

    for (let i = 0; i < positions.length; i++) {
      const [col, row] = positions[i]
      const env = environments[i % environments.length]
      const cust = env === 'management' ? 'general' : customerTypes[i % customerTypes.length]
      const serverCount = env === 'management' ? 2 : 4
      // Determine facing from layout
      const cabRow = getCabinetRowAtGrid(row, proLayout)
      const facing = cabRow ? cabRow.facing : 'north' as CabinetFacing
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
        facing,
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
    // PDUs placed at aisle rows (between cabinet rows) for realism
    const aisleRows = proLayout.aisles.map(a => a.gridRow) // [2, 4, 6]
    const demoPDUs: PDU[] = [
      { id: 'pdu-1', col: 3, row: aisleRows[0], maxCapacityKW: 30, label: 'Metered PDU' },
      { id: 'pdu-2', col: 6, row: aisleRows[0], maxCapacityKW: 30, label: 'Metered PDU' },
      { id: 'pdu-3', col: 2, row: aisleRows[1], maxCapacityKW: 80, label: 'Intelligent PDU' },
      { id: 'pdu-4', col: 5, row: aisleRows[2], maxCapacityKW: 80, label: 'Intelligent PDU' },
    ]

    const demoCableTrays: CableTray[] = [
      { id: 'tray-1', col: 0, row: aisleRows[0], capacityUnits: 8 },
      { id: 'tray-2', col: 2, row: aisleRows[0], capacityUnits: 8 },
      { id: 'tray-3', col: 4, row: aisleRows[1], capacityUnits: 16 },
      { id: 'tray-4', col: 1, row: aisleRows[1], capacityUnits: 8 },
      { id: 'tray-5', col: 3, row: aisleRows[2], capacityUnits: 16 },
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
      { id: 'bus-1', col: 1, row: aisleRows[0], capacityKW: 50, label: 'Medium Busway' },
      { id: 'bus-2', col: 5, row: aisleRows[1], capacityKW: 120, label: 'Heavy Busway' },
    ]

    const demoCrossConnects: CrossConnect[] = [
      { id: 'xc-1', col: 4, row: aisleRows[0], portCount: 24, label: 'Medium Patch Panel' },
      { id: 'xc-2', col: 7, row: aisleRows[1], portCount: 48, label: 'HD Patch Panel' },
    ]

    const demoInRowCoolers: InRowCooling[] = [
      { id: 'irc-1', col: 3, row: aisleRows[0], coolingBonus: 2.0, label: 'Standard In-Row Unit' },
      { id: 'irc-2', col: 6, row: aisleRows[1], coolingBonus: 3.5, label: 'High-Capacity In-Row' },
    ]

    // Cooling units placed in aisles for coverage of adjacent cabinet rows
    const demoCoolingUnits: CoolingUnit[] = [
      { id: 'cu-demo-1', type: 'crac', col: 2, row: aisleRows[0], operational: true },
      { id: 'cu-demo-2', type: 'crac', col: 7, row: aisleRows[1], operational: true },
      { id: 'cu-demo-3', type: 'fan_tray', col: 0, row: aisleRows[2], operational: true },
      { id: 'cu-demo-4', type: 'fan_tray', col: 9, row: aisleRows[0], operational: true },
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
      coolingUnits: demoCoolingUnits,
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
      showWelcomeModal: false,
      showRegionSelect: false,
      hqRegionId: 'ashburn' as RegionId,
      tutorialStepIndex: -1,
      tutorialCompleted: true,
      tutorialPanelsOpened: [],
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
      equipmentPlacementMode: null,
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
      aisleContainments: [],
      messyCableCount: 0,
      pduOverloaded: false,
      infraIncidentBonus: 0,
      zones: [],
      zoneBonusRevenue: 0,
      placementMode: false,
      equipmentPlacementMode: null,
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
      coolingUnits: [],
      chillerPlants: [],
      coolingPipes: [],
      sandboxMode: false,
      activeScenario: null,
      scenarioProgress: {},
      scenariosCompleted: [],
      scenarioBestTicks: {},
      scenarioStartTick: 0,
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
        version: 'v0.4.0',
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
        coolingUnits: state.coolingUnits,
        chillerPlants: state.chillerPlants,
        coolingPipes: state.coolingPipes,
        sandboxMode: state.sandboxMode,
        aisleContainments: state.aisleContainments,
        customRowMode: state.customRowMode,
        customLayout: state.customLayout,
        stockPrice: state.stockPrice,
        stockHistory: state.stockHistory,
        valuationMilestonesReached: state.valuationMilestonesReached,
        drillsCompleted: state.drillsCompleted,
        drillsPassed: state.drillsPassed,
        scenariosCompleted: state.scenariosCompleted,
        scenarioBestTicks: state.scenarioBestTicks,
        // Staff & HR
        staff: state.staff,
        shiftPattern: state.shiftPattern,
        trainingQueue: state.trainingQueue,
        staffIncidentsResolved: state.staffIncidentsResolved,
        staffBurnouts: state.staffBurnouts,
        // Tutorial
        tutorialEnabled: state.tutorialEnabled,
        tutorialStepIndex: state.tutorialStepIndex,
        tutorialCompleted: state.tutorialCompleted,
        seenTips: state.seenTips,
        // Region
        hqRegionId: state.hqRegionId,
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
        coolingUnits: data.coolingUnits ?? state.coolingUnits,
        chillerPlants: data.chillerPlants ?? state.chillerPlants,
        coolingPipes: data.coolingPipes ?? state.coolingPipes,
        sandboxMode: data.sandboxMode ?? state.sandboxMode,
        aisleContainments: data.aisleContainments ?? state.aisleContainments,
        customRowMode: data.customRowMode ?? false,
        customLayout: data.customLayout ?? null,
        stockPrice: data.stockPrice ?? state.stockPrice,
        stockHistory: data.stockHistory ?? state.stockHistory,
        valuationMilestonesReached: data.valuationMilestonesReached ?? state.valuationMilestonesReached,
        drillsCompleted: data.drillsCompleted ?? state.drillsCompleted,
        drillsPassed: data.drillsPassed ?? state.drillsPassed,
        scenariosCompleted: data.scenariosCompleted ?? state.scenariosCompleted,
        scenarioBestTicks: data.scenarioBestTicks ?? state.scenarioBestTicks,
        // Staff & HR
        staff: data.staff ?? state.staff,
        shiftPattern: data.shiftPattern ?? state.shiftPattern,
        trainingQueue: data.trainingQueue ?? state.trainingQueue,
        staffIncidentsResolved: data.staffIncidentsResolved ?? state.staffIncidentsResolved,
        staffBurnouts: data.staffBurnouts ?? state.staffBurnouts,
        // Tutorial
        tutorialEnabled: data.tutorialEnabled ?? state.tutorialEnabled,
        seenTips: data.seenTips ?? state.seenTips,
        tutorialStepIndex: data.tutorialStepIndex ?? -1,
        tutorialCompleted: data.tutorialCompleted ?? true,
        showWelcomeModal: false,
        showRegionSelect: false,
        hqRegionId: (data.hqRegionId as RegionId) ?? state.hqRegionId,
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
    nextSiteId = 1
    nextLinkId = 1
    const prestigeState = loadPrestige()
    set({
      cabinets: [],
      spineSwitches: [],
      totalPower: 0,
      coolingPower: 0,
      money: 50000 + prestigeState.bonuses.startingMoneyBonus,
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
      reputationScore: 20 + prestigeState.bonuses.reputationStartBonus,
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
      aisleContainments: [],
      messyCableCount: 0,
      pduOverloaded: false,
      infraIncidentBonus: 0,
      zones: [],
      zoneBonusRevenue: 0,
      mixedEnvPenaltyCount: 0,
      dedicatedRows: [],
      dedicatedRowBonusRevenue: 0,
      selectedCabinetId: null,
      placementMode: false,
      equipmentPlacementMode: null,
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
      coolingUnits: [],
      chillerPlants: [],
      coolingPipes: [],
      sandboxMode: false,
      activeScenario: null,
      scenarioProgress: {},
      scenariosCompleted: [],
      scenarioBestTicks: {},
      scenarioStartTick: 0,
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
      showWelcomeModal: true,
      showRegionSelect: false,
      hqRegionId: 'ashburn' as RegionId,
      tutorialStepIndex: -1,
      tutorialCompleted: false,
      tutorialPanelsOpened: [],
      activeSlotId: null,
      // Operations Progression
      opsTier: 'manual' as OpsTier,
      opsAutoResolvedCount: 0,
      opsPreventedCount: 0,
      // Phase 6 — Multi-Site Expansion
      multiSiteUnlocked: false,
      worldMapOpen: false,
      sites: [],
      activeSiteId: null,
      hqSnapshot: null,
      researchedRegions: [],
      totalSiteRevenue: 0,
      totalSiteExpenses: 0,
      // Phase 6B — Inter-Site Networking
      interSiteLinks: [],
      interSiteLinkCost: 0,
      edgePopCDNRevenue: 0,
      // Phase 6C — Regional Incidents & Disaster Preparedness
      siteDisasterPreps: [],
      regionalIncidentCount: 0,
      disasterPrepMaintenanceCost: 0,
      regionalIncidentsBlocked: 0,
      // Phase 6D — Global Strategy Layer
      demandGrowthMultipliers: {},
      multiSiteContracts: [],
      multiSiteContractRevenue: 0,
      staffTransfers: [],
      staffTransfersCompleted: 0,
      competitorRegionalPresence: [],
      // New Features
      viewMode: 'cabinet' as ViewMode,
      rowEndSlots: [],
      aisleWidths: {},
      raisedFloorTier: 'none' as RaisedFloorTier,
      cableManagementType: 'none' as CableManagementType,
      activeWorkloads: [],
      completedWorkloads: 0,
      failedWorkloads: 0,
      workloadRevenue: 0,
      advancedTier: null,
      customRowMode: false,
      customLayout: null,
      rowPlacementMode: false,
      rowPlacementFacing: 'south' as CabinetFacing,
      rackDetails: {},
      audioSettings: { ...DEFAULT_AUDIO_SETTINGS },
      pendingFloatingTexts: [],
      pendingCameraEffects: [],
      prestige: prestigeState,
    })
  },

  refreshSaveSlots: () =>
    set({ saveSlots: getSaveIndex() }),

  // ── Prestige / New Game+ ──────────────────────────────────────
  doPrestige: () => {
    // Read current state to compute prestige points
    let didPrestige = false
    set((state) => {
      if (!canPrestige(state)) return {}

      const currentPrestige = state.prestige
      const pointsEarned = calcPrestigePoints({
        cabinets: state.cabinets,
        achievements: state.achievements,
        completedContracts: state.completedContracts,
        money: state.money,
        sites: state.sites,
      })

      const newLevel = Math.min(currentPrestige.level + 1, MAX_PRESTIGE_LEVEL)
      const newBonuses = calcPrestigeBonuses(newLevel)
      const newPrestige: PrestigeState = {
        level: newLevel,
        totalPrestigePoints: currentPrestige.totalPrestigePoints + pointsEarned,
        bonuses: newBonuses,
        highestTickReached: Math.max(currentPrestige.highestTickReached, state.tickCount),
        highestRevenueReached: Math.max(currentPrestige.highestRevenueReached, state.revenue),
        totalRunsCompleted: currentPrestige.totalRunsCompleted + 1,
      }

      // Persist prestige to localStorage before reset
      savePrestige(newPrestige)
      didPrestige = true
      return {}
    })
    // After saving prestige to localStorage, do a full game reset
    // resetGame() reads the new prestige from localStorage and applies bonuses
    if (didPrestige) {
      useGameStore.getState().resetGame()
    }
  },

  tick: () =>
    set((state) => {
      const newTickCount = state.tickCount + 1
      const floatingTexts: FloatingTextEvent[] = []
      const cameraEffects: CameraEffect[] = []

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
      let coolingUnits = [...state.coolingUnits]
      let chillerPlants = [...state.chillerPlants]
      let coolingPipes = [...state.coolingPipes]
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
        // Restore a disabled cooling unit when a cooling_failure incident resolves
        if (inc.def.effect === 'cooling_failure') {
          const disabled = coolingUnits.find((u) => !u.operational)
          if (disabled) {
            coolingUnits = coolingUnits.map((u) => u.id === disabled.id ? { ...u, operational: true } : u)
          }
        }
        // Restore a disabled chiller plant when a chiller_failure incident resolves
        if (inc.def.effect === 'chiller_failure') {
          const disabled = chillerPlants.find((p) => !p.operational)
          if (disabled) {
            chillerPlants = chillerPlants.map((p) => p.id === disabled.id ? { ...p, operational: true } : p)
          }
        }
        // pipe_failure: no restore — pipe was destroyed, must be rebuilt
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

          // Chiller failure needs an operational chiller plant — fall back if none
          if (selectedDef.effect === 'chiller_failure' && chillerPlants.filter(p => p.operational).length === 0) {
            const fallbackDefs = INCIDENT_CATALOG.filter(d => d.effect !== 'chiller_failure' && d.effect !== 'hardware_failure' && d.effect !== 'pipe_failure')
            selectedDef = fallbackDefs[Math.floor(Math.random() * fallbackDefs.length)]
          }

          // Pipe failure needs pipes — fall back if none
          if (selectedDef.effect === 'pipe_failure' && coolingPipes.length === 0) {
            const fallbackDefs = INCIDENT_CATALOG.filter(d => d.effect !== 'pipe_failure' && d.effect !== 'hardware_failure' && d.effect !== 'chiller_failure')
            selectedDef = fallbackDefs[Math.floor(Math.random() * fallbackDefs.length)]
          }

          const incident: ActiveIncident = {
            id: `inc-${nextIncidentId++}`,
            def: selectedDef,
            ticksRemaining: selectedDef.durationTicks,
            resolved: false,
            ...(affectedHwId ? { affectedHardwareId: affectedHwId } : {}),
          }
          activeIncidents.push(incident)
          // Cooling failure incidents disable a random operational cooling unit
          if (selectedDef.effect === 'cooling_failure' && coolingUnits.length > 0) {
            const operational = coolingUnits.filter((u) => u.operational)
            if (operational.length > 0) {
              const target = operational[Math.floor(Math.random() * operational.length)]
              coolingUnits = coolingUnits.map((u) => u.id === target.id ? { ...u, operational: false } : u)
              incidentLog = [`Cooling unit offline: ${COOLING_UNIT_CONFIG.find(c => c.type === target.type)?.label ?? target.type} at (${target.col},${target.row})`, ...incidentLog].slice(0, 10)
            }
          }
          // Chiller failure: disable a random operational chiller plant
          if (selectedDef.effect === 'chiller_failure') {
            const operational = chillerPlants.filter((p) => p.operational)
            if (operational.length > 0) {
              const target = operational[Math.floor(Math.random() * operational.length)]
              chillerPlants = chillerPlants.map((p) => p.id === target.id ? { ...p, operational: false } : p)
              incidentLog = [`Chiller plant offline: ${target.tier} at (${target.col},${target.row})`, ...incidentLog].slice(0, 10)
            }
          }
          // Pipe failure: destroy a random cooling pipe
          if (selectedDef.effect === 'pipe_failure') {
            if (coolingPipes.length > 0) {
              const target = coolingPipes[Math.floor(Math.random() * coolingPipes.length)]
              coolingPipes = coolingPipes.filter((p) => p.id !== target.id)
              incidentLog = [`Cooling pipe destroyed at (${target.col},${target.row}) — must be rebuilt`, ...incidentLog].slice(0, 10)
            }
          }
          incidentLog = [`New: ${selectedDef.label} — ${selectedDef.description}`, ...incidentLog].slice(0, 10)
          // Floating text for new incident
          const sevColor = selectedDef.severity === 'critical' ? '#ff4444' : selectedDef.severity === 'major' ? '#ff8844' : '#ffcc00'
          floatingTexts.push({ text: `⚠ ${selectedDef.label}`, color: sevColor, center: true, fontSize: '13px' })
          // Camera shake for critical/major incidents
          if (selectedDef.severity === 'critical') cameraEffects.push({ type: 'shake_heavy' })
          else if (selectedDef.severity === 'major') cameraEffects.push({ type: 'shake_medium' })
        } else if (opsSpawnReduction > 0 && Math.random() < baseSpawnChance) {
          // Incident was prevented by ops tier
          opsPreventedCount++
        }
      }

      // ── Phase 6C — Regional Incident Spawning ────────────────────
      // For each operational site, check region-specific disaster risk and spawn regional incidents
      let regionalIncidentCount = state.regionalIncidentCount
      let regionalIncidentsBlocked = state.regionalIncidentsBlocked
      let disasterPrepMaintenanceCost = 0
      if (state.multiSiteUnlocked && state.sites.length > 0) {
        // Calculate disaster prep maintenance cost
        for (const prep of state.siteDisasterPreps) {
          const prepConfig = DISASTER_PREP_CONFIG[prep.type]
          disasterPrepMaintenanceCost += prepConfig.maintenanceCostPerTick
        }
        // Check each operational site for regional incidents
        for (const site of state.sites) {
          if (!site.operational) continue
          const region = REGION_CATALOG.find((r) => r.id === site.regionId)
          if (!region) continue
          // Count regional incidents already active for this site
          const siteRegionalIncidents = activeIncidents.filter((i) =>
            !i.resolved && i.def.type.startsWith('regional_') && i.affectedHardwareId === site.id
          ).length
          if (siteRegionalIncidents >= MAX_REGIONAL_INCIDENTS) continue
          // Check each regional incident type that can spawn in this region
          for (const riDef of REGIONAL_INCIDENT_CATALOG) {
            if (!riDef.regions.includes(site.regionId)) continue
            const riskLevel = region.disasterProfile[riDef.riskKey]
            if (riskLevel <= 0) continue
            let spawnChance = riDef.baseChance * riskLevel
            // Seasonal boost
            if (riDef.seasonalBoost && riDef.seasonalBoost.includes(state.currentSeason)) {
              spawnChance *= 2
            }
            if (Math.random() >= spawnChance) continue
            // Check if disaster prep mitigates this
            const sitePreps = state.siteDisasterPreps.filter((p) => p.siteId === site.id)
            const hasMitigation = riDef.mitigatedBy && sitePreps.some((p) => p.type === riDef.mitigatedBy)
            const mitigationFactor = hasMitigation ? (riDef.mitigationFactor ?? 0.5) : 0
            // If fully mitigated (mitigationFactor >= 0.9), block the incident entirely
            if (mitigationFactor >= 0.9) {
              regionalIncidentsBlocked++
              incidentLog = [`[${site.name}] ${riDef.label} — blocked by ${DISASTER_PREP_CONFIG[riDef.mitigatedBy!].label}`, ...incidentLog].slice(0, 10)
              floatingTexts.push({ text: `${riDef.label} BLOCKED`, color: '#00ff88', center: true })
              continue
            }
            // Create the incident — use affectedHardwareId to track which site it targets
            const adjustedMagnitude = riDef.effectMagnitude * (1 - mitigationFactor)
            const adjustedDuration = Math.round(riDef.durationTicks * (1 - mitigationFactor * 0.3))
            const adjustedCost = Math.round(riDef.resolveCost * (1 - mitigationFactor * 0.4))
            const incidentDef: IncidentDef = {
              type: `regional_${riDef.type}`,
              label: `[${site.name}] ${riDef.label}`,
              severity: riDef.severity,
              description: riDef.description,
              durationTicks: adjustedDuration,
              resolveCost: adjustedCost,
              effect: riDef.effect === 'cabinet_destruction' ? 'revenue_penalty'
                : riDef.effect === 'supply_chain_halt' ? 'revenue_penalty'
                : riDef.effect,
              effectMagnitude: riDef.effect === 'cabinet_destruction' ? (1 - adjustedMagnitude)
                : riDef.effect === 'supply_chain_halt' ? 0.5
                : adjustedMagnitude,
            }
            const incident: ActiveIncident = {
              id: `rinc-${nextIncidentId++}`,
              def: incidentDef,
              ticksRemaining: incidentDef.durationTicks,
              resolved: false,
              affectedHardwareId: site.id,
            }
            activeIncidents.push(incident)
            regionalIncidentCount++
            incidentLog = [`[${site.name}] New: ${riDef.label} — ${riDef.description}${hasMitigation ? ' (damage reduced by ' + DISASTER_PREP_CONFIG[riDef.mitigatedBy!].label + ')' : ''}`, ...incidentLog].slice(0, 10)
            const sevColor = riDef.severity === 'critical' ? '#ff4444' : riDef.severity === 'major' ? '#ff8844' : '#ffcc00'
            floatingTexts.push({ text: `⚠ ${riDef.label} [${site.name}]`, color: sevColor, center: true, fontSize: '13px' })
            if (riDef.severity === 'critical') cameraEffects.push({ type: 'shake_heavy' })
            else if (riDef.severity === 'major') cameraEffects.push({ type: 'shake_medium' })
            break // Max one regional incident per site per tick
          }
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

      // Calculate incident effects (ops tier reduces damage via incidentEffectMultiplier)
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
          case 'chiller_failure': break  // effect handled via disabled chiller plant
          case 'pipe_failure': break     // effect handled via destroyed pipe
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
            floatingTexts.push({ text: `RESOLVED ✓ ${i.def.label}`, color: '#00ff88', center: true })
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

      // Natural incident tick-down — only at Ops Tier 3+ (Basic Automation and above)
      // At Tier 1-2, incidents do NOT auto-resolve — player must pay to resolve manually
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
            floatingTexts.push({ text: `RESOLVED ✓ ${i.def.label}`, color: '#00ff88', center: true })
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
        // Show fire text above hottest cabinet
        const hottest = state.cabinets.reduce((a, b) => a.heatLevel > b.heatLevel ? a : b)
        floatingTexts.push({ col: hottest.col, row: hottest.row, text: 'FIRE!', color: '#ff4444', fontSize: '16px' })
        cameraEffects.push({ type: 'shake_heavy' })
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

        // Phase 6 — site construction still ticks even with no equipment
        const earlyEventLog = [...state.eventLog]
        const earlyReturnSites = state.sites.map((site) => {
          if (!site.operational && site.constructionTicksRemaining > 0) {
            const remaining = site.constructionTicksRemaining - 1
            if (remaining <= 0) {
              const emptySnapshot: SiteSnapshot = {
                cabinets: [], spineSwitches: [], pdus: [], cableTrays: [], cableRuns: [],
                coolingUnits: [], chillerPlants: [], coolingPipes: [],
                busways: [], crossConnects: [], inRowCoolers: [],
                rowEndSlots: [], aisleContainments: [], aisleWidths: {},
                raisedFloorTier: 'none', cableManagementType: 'none',
                coolingType: 'air', suiteTier: 'starter' as SuiteTier,
                totalPower: 0, avgHeat: SIM.ambientTemp, revenue: 0, expenses: 0,
              }
              earlyEventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'infrastructure' as EventCategory, message: `${site.name} construction complete — site is now operational!`, severity: 'success' as EventSeverity })
              floatingTexts.push({ text: `${site.name} ONLINE`, color: '#00ff88', center: true })
              return { ...site, constructionTicksRemaining: 0, operational: true, snapshot: emptySnapshot }
            }
            return { ...site, constructionTicksRemaining: remaining }
          }
          return site
        })
        if (earlyEventLog.length > 200) earlyEventLog.splice(0, earlyEventLog.length - 200)
        const earlyMultiSiteUnlocked = state.multiSiteUnlocked || (
          state.suiteTier === 'enterprise' &&
          state.money >= MULTI_SITE_GATE.minCash &&
          state.reputationScore >= MULTI_SITE_GATE.minReputation
        )

        // Phase 6B — tick inter-site links (even with no equipment)
        let earlyLinkCost = 0
        let earlyEdgePopCDNRevenue = 0
        const earlyUpdatedLinks = state.interSiteLinks.map((link) => {
          const linkConfig = INTER_SITE_LINK_CONFIG[link.type]
          let operational = link.operational
          if (operational && Math.random() > linkConfig.reliability) {
            operational = false
          } else if (!operational && Math.random() < 0.2) {
            operational = true
          }
          if (operational) earlyLinkCost += link.costPerTick
          return { ...link, operational, utilization: 0 }
        })

        // Edge PoP CDN revenue in early return path
        for (const ep of earlyReturnSites.filter((s) => s.type === 'edge_pop' && s.operational)) {
          const hasBackhaul = earlyUpdatedLinks.some((l) => l.operational && (l.siteAId === ep.id || l.siteBId === ep.id))
          if (hasBackhaul) {
            const bestLink = earlyUpdatedLinks
              .filter((l) => l.operational && (l.siteAId === ep.id || l.siteBId === ep.id))
              .sort((a, b) => b.bandwidthGbps - a.bandwidthGbps)[0]
            if (bestLink) {
              const region = REGION_CATALOG.find((r) => r.id === ep.regionId)
              const demandBonus = region ? Math.max(region.demandProfile.streaming, region.demandProfile.general) : 0.5
              earlyEdgePopCDNRevenue += bestLink.bandwidthGbps * EDGE_POP_CDN_REVENUE_PER_GBPS * demandBonus
            }
          }
        }

        // Tutorial step advancement (also needed in early return path)
        let earlyTutorialStepIndex = state.tutorialStepIndex
        let earlyTutorialCompleted = state.tutorialCompleted
        if (state.tutorialEnabled && earlyTutorialStepIndex >= 0 && !earlyTutorialCompleted) {
          const currentStep = TUTORIAL_STEPS[earlyTutorialStepIndex]
          if (currentStep) {
            let stepDone = false
            switch (currentStep.completionCheck) {
              case 'game_unpaused': stepDone = state.gameSpeed > 0; break
              case 'always': stepDone = true; break
            }
            if (stepDone) {
              earlyTutorialStepIndex = earlyTutorialStepIndex + 1
              if (earlyTutorialStepIndex >= TUTORIAL_STEPS.length) {
                earlyTutorialCompleted = true
              }
            }
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
          money: state.sandboxMode ? 999999999 : Math.round((state.money - loanPayments - earlyLinkCost + earlyEdgePopCDNRevenue) * 100) / 100,
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
          // Phase 6
          sites: earlyReturnSites,
          multiSiteUnlocked: earlyMultiSiteUnlocked,
          eventLog: earlyEventLog,
          pendingFloatingTexts: floatingTexts,
          // Phase 6B
          interSiteLinks: earlyUpdatedLinks,
          interSiteLinkCost: +earlyLinkCost.toFixed(2),
          edgePopCDNRevenue: +earlyEdgePopCDNRevenue.toFixed(2),
          // Tutorial
          tutorialStepIndex: earlyTutorialStepIndex,
          tutorialCompleted: earlyTutorialCompleted,
        }
      }

      // Reduce cooling failure effect with redundant cooling tech
      if (techCoolingFailureReduction > 0) {
        incidentCoolingMult = 1 - (1 - incidentCoolingMult) * (1 - techCoolingFailureReduction)
      }

      // ── Infrastructure layout effects ──────────────────────
      const currentAisleBonus = calcAisleBonus(state.cabinets, state.suiteTier, state.aisleContainments, state.customLayout ?? undefined)
      const currentAisleViolations = countAisleViolations()
      const currentZones = calcZones(state.cabinets)

      // Build lookup: cabinet ID → zone bonuses for quick per-cabinet access in revenue/heat loops
      const cabinetZoneBonuses = new Map<string, { revenueBonus: number; heatReduction: number }>()
      for (const zone of currentZones) {
        const cfg = zone.type === 'environment'
          ? ZONE_BONUS_CONFIG.environmentBonus[zone.key as CabinetEnvironment]
          : ZONE_BONUS_CONFIG.customerBonus[zone.key as CustomerType]
        for (const cabId of zone.cabinetIds) {
          const existing = cabinetZoneBonuses.get(cabId) ?? { revenueBonus: 0, heatReduction: 0 }
          existing.revenueBonus += cfg.revenueBonus
          existing.heatReduction += cfg.heatReduction
          cabinetZoneBonuses.set(cabId, existing)
        }
      }

      // Cabinet Organization Incentives: mixed-env penalties and dedicated row bonuses
      const mixedEnvPenalties = calcMixedEnvPenalties(state.cabinets)
      const currentDedicatedRows = calcDedicatedRows(state.cabinets, state.suiteTier)
      const dedicatedRowGridRows = new Set(currentDedicatedRows.map((r) => r.gridRow))

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

      // ── Row-End Slot Effects ──────────────────────────────────────────
      let facilityRowEndCooling = 0
      for (const slot of state.rowEndSlots) {
        if (slot.type === 'cooling_slot') facilityRowEndCooling += 1.0
      }

      // ── Aisle Width Effects ───────────────────────────────────────────
      let facilityAisleWidthCooling = 0
      for (const [, width] of Object.entries(state.aisleWidths)) {
        const config = AISLE_WIDTH_CONFIG.find((c) => c.width === width)
        if (config) facilityAisleWidthCooling += config.coolingBonus
      }

      // ── Raised Floor Effects ──────────────────────────────────────────
      const raisedFloorConfig = RAISED_FLOOR_CONFIG.find((c) => c.tier === state.raisedFloorTier)
      const facilityRaisedFloorCooling = raisedFloorConfig?.coolingDistributionBonus ?? 0

      // ── Cable Management Effects ──────────────────────────────────────
      const cableMgmtConfig = CABLE_MANAGEMENT_CONFIG.find((c) => c.type === state.cableManagementType)
      const facilityCableMessReduction = cableMgmtConfig?.cableMessReduction ?? 0

      // Regional ambient modifier: all sites have ambient temp shifted by region's coolingEfficiency
      const activeSiteRegion = state.activeSiteId
        ? REGION_CATALOG.find((r) => r.id === state.sites.find((s) => s.id === state.activeSiteId)?.regionId)
        : REGION_CATALOG.find((r) => r.id === state.hqRegionId)
      const regionalAmbientOffset = activeSiteRegion ? activeSiteRegion.profile.coolingEfficiency : 0
      const effectiveAmbientTemp = SIM.ambientTemp + regionalAmbientOffset

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

          // Mixed-environment penalty: cabinets surrounded by different env types generate extra heat
          if (mixedEnvPenalties.has(cab.id)) {
            heat += cab.serverCount * SIM.heatPerServer * envConfig.heatMultiplier * custConfig.heatMultiplier * MIXED_ENV_PENALTY_CONFIG.heatPenalty
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

        // In-row cooling bonus: nearby in-row coolers provide extra cooling (legacy system)
        let inRowBonus = 0
        for (const cooler of state.inRowCoolers) {
          const config = INROW_COOLING_OPTIONS.find((o) => o.label === cooler.label)
          if (config && manhattanDist(cooler.col, cooler.row, cab.col, cab.row) <= config.range) {
            inRowBonus += cooler.coolingBonus
          }
        }

        // Cooling unit infrastructure: per-cabinet coverage from placed cooling units
        const unitCooling = calcCabinetCooling(cab, coolingUnits, state.cabinets, chillerPlants, coolingPipes)

        // Zone adjacency heat reduction
        const zoneBonus = cabinetZoneBonuses.get(cab.id)
        const zoneHeatReduction = zoneBonus ? zoneBonus.heatReduction : 0

        // Dedicated row cooling bonus: lab/management dedicated rows get extra cooling
        const dedicatedRowCoolingBonus = (dedicatedRowGridRows.has(cab.row) && cab.environment !== 'production')
          ? DEDICATED_ROW_BONUS_CONFIG.efficiencyBonus * SIM.heatPerServer : 0

        // Cooling dissipation: facility-wide base + cooling units + in-row + tech + aisle + zone + staff + dedicated row
        // When cooling units are placed, they provide the primary cooling via unitCooling (which includes BASE_AMBIENT_DISSIPATION)
        // The facility-wide coolingConfig.coolingRate still applies as legacy/base layer
        const aisleCoolingBoost = currentAisleBonus * 2 // up to +0.6°C/tick extra cooling
        const zoneHeatBoost = zoneHeatReduction * SIM.heatPerServer // scale zone heat reduction relative to heat generation
        const baseCooling = state.coolingUnits.length > 0 ? unitCooling : coolingConfig.coolingRate
        const infraCooling = facilityRowEndCooling + facilityAisleWidthCooling + facilityRaisedFloorCooling + facilityCableMessReduction
        const prestigeCoolingBoost = state.prestige.level > 0 ? (1 + state.prestige.bonuses.coolingEfficiency) : 1
        heat -= (baseCooling + techCoolingBonus + aisleCoolingBoost + inRowBonus + staffCoolingBonus + zoneHeatBoost + dedicatedRowCoolingBonus + infraCooling) * incidentCoolingMult * prestigeCoolingBoost

        // Incident heat spike
        heat += incidentHeatAdd

        // Fire adds extra heat
        if (fireActive) heat += 5

        // Clamp to ambient minimum (adjusted by regional cooling efficiency) and 100 max
        heat = Math.max(effectiveAmbientTemp, Math.min(100, heat))

        // Age servers (depreciation)
        const newAge = cab.powerStatus ? cab.serverAge + 1 : cab.serverAge

        // Disable leaf switch if affected by hardware failure incident, restore if just resolved
        const leafFailed = failedLeafCabIds.has(cab.id)
        const leafRestored = restoredLeafCabIds.has(cab.id)
        return { ...cab, heatLevel: Math.round(heat * 10) / 10, serverAge: newAge, ...(leafFailed ? { hasLeafSwitch: false } : leafRestored ? { hasLeafSwitch: true } : {}) }
      })

      // Floating text: temperature warnings for hot cabinets (every 8 ticks, limit to 3)
      if (newTickCount % 8 === 0) {
        const hotCabs = newCabinets
          .filter((c) => c.heatLevel >= 70 && c.heatLevel < SIM.throttleTemp && c.powerStatus)
          .sort((a, b) => b.heatLevel - a.heatLevel)
          .slice(0, 3)
        for (const cab of hotCabs) {
          floatingTexts.push({ col: cab.col, row: cab.row, text: `${Math.round(cab.heatLevel)}°C ▲`, color: '#ff8844' })
        }
      }

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

          // Dedicated row bonus: cabinets in fully uniform rows earn more
          if (dedicatedRowGridRows.has(cab.row)) {
            baseRevenue *= (1 + DEDICATED_ROW_BONUS_CONFIG.efficiencyBonus)
          }

          // Mixed-environment penalty: cabinets surrounded by different env types earn less
          if (mixedEnvPenalties.has(cab.id)) {
            baseRevenue *= (1 - MIXED_ENV_PENALTY_CONFIG.revenuePenalty)
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

          // Floating text: throttle warning (only when transitioning into throttle)
          if (throttled) {
            const prevCab = state.cabinets.find((c) => c.id === cab.id)
            if (prevCab && prevCab.heatLevel < SIM.throttleTemp) {
              floatingTexts.push({ col: cab.col, row: cab.row, text: 'THROTTLED', color: '#ff8844' })
            }
          }
        }
      }
      revenue *= incidentRevenueMult * outagePenalty

      // Prestige revenue bonus
      if (state.prestige.level > 0) {
        revenue *= (1 + state.prestige.bonuses.revenueMultiplier)
      }

      // Floating text: aggregate revenue (show every 4th tick to reduce visual noise)
      if (revenue > 0 && newTickCount % 4 === 0) {
        // Pick a random active cabinet to show revenue above
        const activeCabs = newCabinets.filter((c) => c.powerStatus && c.serverCount > 0)
        if (activeCabs.length > 0) {
          const sample = activeCabs[Math.floor(Math.random() * activeCabs.length)]
          floatingTexts.push({ col: sample.col, row: sample.row, text: `+$${Math.round(revenue * 4)}`, color: '#00ff88' })
        }
      }

      // Calculate zone bonus revenue for display (difference vs. what revenue would be without zone bonuses)
      let zoneBonusRevenue = 0
      let dedicatedRowBonusRevenue = 0
      for (const cab of newCabinets) {
        if (cab.powerStatus) {
          const cabZoneBonus = cabinetZoneBonuses.get(cab.id)
          if (cabZoneBonus && cabZoneBonus.revenueBonus > 0) {
            const envCfg = ENVIRONMENT_CONFIG[cab.environment]
            const custCfg = CUSTOMER_TYPE_CONFIG[cab.customerType]
            const baseRev = cab.serverCount * SIM.revenuePerServer * envCfg.revenueMultiplier * custCfg.revenueMultiplier
            zoneBonusRevenue += baseRev * cabZoneBonus.revenueBonus
          }
          // Dedicated row bonus revenue (production rows only — lab/management get cooling bonus instead)
          if (dedicatedRowGridRows.has(cab.row) && cab.environment === 'production') {
            const envCfg = ENVIRONMENT_CONFIG[cab.environment]
            const custCfg = CUSTOMER_TYPE_CONFIG[cab.customerType]
            const baseRev = cab.serverCount * SIM.revenuePerServer * envCfg.revenueMultiplier * custCfg.revenueMultiplier
            dedicatedRowBonusRevenue += baseRev * DEDICATED_ROW_BONUS_CONFIG.efficiencyBonus
          }
        }
      }

      // Reputation bonus on contract revenue
      const repTier = getReputationTier(state.reputationScore)

      // 4. Calculate expenses (with spot pricing, incident power surge, customer type power draw)
      const regionalPowerMult = activeSiteRegion ? activeSiteRegion.profile.powerCostMultiplier : 1
      const effectivePower = Math.round(stats.totalPower * incidentPowerMult)
      const prestigePowerDiscount = state.prestige.level > 0 ? (1 - state.prestige.bonuses.powerCostReduction) : 1
      const spotPowerCost = SIM.powerCostPerKW * effectivePowerPrice * regionalPowerMult * prestigePowerDiscount
      const powerCost = +(effectivePower / 1000 * spotPowerCost).toFixed(2)
      const coolingCost = +(adjustedCoolingPower / 1000 * spotPowerCost).toFixed(2)
      // Cooling unit power draw
      const coolingUnitPower = coolingUnits.filter((u) => u.operational).reduce((sum, u) => {
        const cfg = COOLING_UNIT_CONFIG.find((c) => c.type === u.type)
        return sum + (cfg?.powerDraw ?? 0)
      }, 0)
      const coolingUnitPowerCost = +(coolingUnitPower / 1000 * spotPowerCost).toFixed(2)
      // Chiller plant power draw
      const chillerPower = state.chillerPlants.filter((p) => p.operational).reduce((sum, p) => {
        const cfg = CHILLER_PLANT_CONFIG.find((c) => c.tier === p.tier)
        return sum + (cfg?.powerDraw ?? 0)
      }, 0)
      const chillerPowerCost = +(chillerPower / 1000 * spotPowerCost).toFixed(2)
      const expenses = +(powerCost + coolingCost + coolingUnitPowerCost + chillerPowerCost + generatorFuelCost).toFixed(2)

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

          // Check SLA: enough production servers online AND avg temp within limits AND zone requirement met (if any)
          const zoneReq = ZONE_CONTRACT_REQUIREMENTS[contract.def.type]
          const zoneSatisfied = !zoneReq || isZoneRequirementMet(currentZones, zoneReq)
          const slaMet = activeProductionServers >= contract.def.minServers &&
            stats.avgHeat <= contract.def.maxTemp && zoneSatisfied

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
            floatingTexts.push({ text: `CONTRACT COMPLETE +$${contract.def.completionBonus.toLocaleString()}`, color: '#00ccff', center: true, fontSize: '13px' })
            return { ...contract, consecutiveViolations, totalViolationTicks, totalEarned, totalPenalties, status: status as 'completed', ticksRemaining: 0 }
          }

          return { ...contract, consecutiveViolations, totalViolationTicks, totalEarned, totalPenalties, ticksRemaining }
        })
        .filter((c) => c.status === 'active') // Remove completed/terminated

      // Generate new contract offers periodically (reputation affects quality)
      let contractOffers = state.contractOffers
      if (newTickCount % CONTRACT_OFFER_INTERVAL === 0 || (state.contractOffers.length === 0 && newCabinets.length >= 2)) {
        const totalProdServers = newCabinets
          .filter((c) => c.environment === 'production')
          .reduce((sum, c) => sum + c.serverCount, 0)
        const eligible = CONTRACT_CATALOG.filter((def) => {
          // Reputation gates higher-tier contracts
          if (def.tier === 'gold' && state.reputationScore < 50) return false
          if (def.tier === 'silver' && state.reputationScore < 25) return false
          return totalProdServers >= Math.ceil(def.minServers * 0.5)
        })
        // Zone-gated contracts: only offer if player has the required zone
        const eligibleZoneContracts = ZONE_CONTRACT_CATALOG.filter((def) => {
          const req = ZONE_CONTRACT_REQUIREMENTS[def.type]
          if (!req) return false
          if (!isZoneRequirementMet(currentZones, req)) return false
          if (def.tier === 'gold' && state.reputationScore < 50) return false
          if (def.tier === 'silver' && state.reputationScore < 25) return false
          return totalProdServers >= Math.ceil(def.minServers * 0.5)
        })
        const allEligible = [...eligible, ...eligibleZoneContracts]
        if (allEligible.length > 0) {
          const activeTypes = new Set(updatedContracts.map((c) => c.def.type))
          const available = allEligible.filter((d) => !activeTypes.has(d.type))
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
        floatingTexts.push({ text: `★ ${def.label}`, color: '#ffd700', center: true, fontSize: '14px' })
        cameraEffects.push({ type: 'zoom_pulse' })
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
      // Cabinet Organization Incentives achievements
      if (newCabinets.length >= 5 && mixedEnvPenalties.size === 0) unlock('no_mixed_penalty')
      if (currentDedicatedRows.length > 0) unlock('dedicated_row')
      if (completedContracts > state.completedContracts) {
        const justCompletedContract = state.activeContracts.find((c) => c.status === 'active' && c.ticksRemaining <= 1)
        if (justCompletedContract && ZONE_CONTRACT_REQUIREMENTS[justCompletedContract.def.type]) {
          unlock('zone_contract')
        }
      }
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
      let scenarioBestTicks = { ...state.scenarioBestTicks }
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
          const elapsedTicks = newTickCount - state.scenarioStartTick
          const prevBest = state.scenarioBestTicks[state.activeScenario.id]
          if (!prevBest || elapsedTicks < prevBest) {
            scenarioBestTicks = { ...state.scenarioBestTicks, [state.activeScenario.id]: elapsedTicks }
          }
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

      // Water usage (facility-wide water cooling + cooling unit water usage, affected by drought)
      const isDrought = state.activeIncidents.some((i) => i.def.type === 'drought' && !i.resolved)
      const waterMultiplier = isDrought ? WATER_USAGE_CONFIG.droughtPriceMultiplier : 1
      const waterCabinets = state.coolingType === 'water' ? newCabinets.filter((c) => c.powerStatus).length : 0
      const coolingUnitWaterUsage = coolingUnits.filter((u) => u.operational).reduce((sum, u) => {
        const cfg = COOLING_UNIT_CONFIG.find((c) => c.type === u.type)
        return sum + (cfg?.waterUsage ?? 0)
      }, 0)
      const waterUsagePerTick = waterCabinets * WATER_USAGE_CONFIG.gallonsPerCabinetPerTick + coolingUnitWaterUsage
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

      // ── Workload Simulation ──────────────────────────────────────────
      let activeWorkloads = [...state.activeWorkloads]
      let completedWorkloads = state.completedWorkloads
      let failedWorkloads = state.failedWorkloads
      let workloadRevenue = 0
      activeWorkloads = activeWorkloads.map((w) => {
        if (w.status === 'completed' || w.status === 'failed') return w
        if (w.status === 'migrating') {
          // Migration takes 3 ticks then resumes as running
          return w.ticksRemaining <= w.ticksTotal - 3
            ? { ...w, status: 'running' as const }
            : { ...w, ticksRemaining: w.ticksRemaining - 1 }
        }
        // Running workload
        const cabinet = newCabinets.find((c) => c.id === w.cabinetId)
        if (!cabinet || !cabinet.powerStatus) {
          failedWorkloads++
          return { ...w, status: 'failed' as const }
        }
        // Check overheat failure
        const wConfig = WORKLOAD_CONFIG.find((c) => c.type === w.type)
        if (wConfig?.failOnOverheat && cabinet.heatLevel >= wConfig.failTemp) {
          failedWorkloads++
          return { ...w, status: 'failed' as const }
        }
        const remaining = w.ticksRemaining - 1
        if (remaining <= 0) {
          completedWorkloads++
          workloadRevenue += w.payoutOnComplete
          return { ...w, ticksRemaining: 0, status: 'completed' as const }
        }
        return { ...w, ticksRemaining: remaining }
      })
      // Clean up finished workloads (keep last 5 for display, remove old completed/failed)
      const finishedCount = activeWorkloads.filter((w) => w.status === 'completed' || w.status === 'failed').length
      if (finishedCount > 5) {
        const toRemove = finishedCount - 5
        let removed = 0
        activeWorkloads = activeWorkloads.filter((w) => {
          if (removed >= toRemove) return true
          if (w.status === 'completed' || w.status === 'failed') { removed++; return false }
          return true
        })
      }

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
      // Workload events
      if (completedWorkloads > state.completedWorkloads) logEvent('finance', `Workload completed! +$${workloadRevenue.toFixed(0)}`, 'success')
      if (failedWorkloads > state.failedWorkloads) logEvent('incident', 'Workload failed due to overheating!', 'error')

      // ── Capacity history ──────────────────────────────────────────
      const capacityHistory = [...state.capacityHistory, {
        tick: newTickCount, power: stats.totalPower, heat: stats.avgHeat,
        revenue, cabinets: newCabinets.length, money: state.money,
      }].slice(-100)

      // ── Lifetime stats ────────────────────────────────────────────
      const lifetimeStats = { ...state.lifetimeStats }
      lifetimeStats.totalRevenueEarned += revenue + contractRevenue + spotRevenue + meetMeRevenue + workloadRevenue
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
          // Cooling Infrastructure tips
          if (tip.id === 'cooling_units_hint' && newCabinets.length >= 3 && coolingUnits.length === 0) trigger = true
          if (tip.id === 'cooling_overloaded' && coolingUnits.length > 0) {
            for (const unit of coolingUnits) {
              if (!unit.operational) continue
              const cfg = COOLING_UNIT_CONFIG.find((c) => c.type === unit.type)
              if (!cfg) continue
              const served = newCabinets.filter((c) => c.powerStatus && Math.abs(unit.col - c.col) + Math.abs(unit.row - c.row) <= cfg.range).length
              if (served > cfg.maxCabinets) { trigger = true; break }
            }
          }
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
          // Phase 6 — Multi-Site tips
          if (tip.id === 'multi_site_unlocked' && !state.multiSiteUnlocked && state.suiteTier === 'enterprise' && state.money >= MULTI_SITE_GATE.minCash && reputationScore >= MULTI_SITE_GATE.minReputation) trigger = true
          if (tip.id === 'site_under_construction' && state.sites.some((s) => !s.operational && s.constructionTicksRemaining > 0)) trigger = true
          // Phase 6B — Inter-Site Networking tips
          if (tip.id === 'first_link_hint' && state.sites.filter((s) => s.operational).length >= 1 && state.interSiteLinks.length === 0) trigger = true
          if (tip.id === 'edge_pop_backhaul' && state.sites.some((s) => s.type === 'edge_pop' && s.operational) && !state.interSiteLinks.some((l) => l.operational && state.sites.some((ep) => ep.type === 'edge_pop' && (l.siteAId === ep.id || l.siteBId === ep.id)))) trigger = true
          // Phase 6C — Regional Incidents & Disaster Preparedness tips
          if (tip.id === 'regional_incident_hint' && state.sites.filter((s) => s.operational).length >= 1 && state.regionalIncidentCount === 0) trigger = true
          if (tip.id === 'disaster_prep_hint' && regionalIncidentCount > 0 && state.siteDisasterPreps.length === 0) trigger = true
          // Phase 6D — Global Strategy Layer tips
          if (tip.id === 'multisite_contracts_hint' && state.sites.filter((s) => s.operational).length >= 2 && state.multiSiteContracts.length === 0) trigger = true
          if (tip.id === 'sovereignty_hint' && state.sites.some((s) => s.operational && ['london', 'amsterdam', 'frankfurt', 'nordics', 'sao_paulo', 'singapore'].includes(s.regionId)) && !state.multiSiteContracts.some((c) => c.def.sovereigntyRegime)) trigger = true
          if (tip.id === 'staff_transfer_hint' && state.sites.filter((s) => s.operational).length >= 2 && state.staffTransfersCompleted === 0) trigger = true
          if (tip.id === 'demand_growth_hint' && Object.keys(state.demandGrowthMultipliers).length > 0 && state.multiSiteContracts.length === 0) trigger = true
          if (trigger) { activeTip = tip; break }
        }
      }

      // ── Guided tutorial step advancement ────────────────────────
      let tutorialStepIndex = state.tutorialStepIndex
      let tutorialCompleted = state.tutorialCompleted
      if (state.tutorialEnabled && tutorialStepIndex >= 0 && !tutorialCompleted) {
        const currentStep = TUTORIAL_STEPS[tutorialStepIndex]
        if (currentStep) {
          let stepDone = false
          const panelsOpened = state.tutorialPanelsOpened
          switch (currentStep.completionCheck) {
            case 'has_cabinet': stepDone = newCabinets.length > 0; break
            case 'has_server': stepDone = newCabinets.some((c) => c.serverCount > 0); break
            case 'has_leaf': stepDone = newCabinets.some((c) => c.hasLeafSwitch); break
            case 'has_spine': stepDone = spineSwitches.length > 0; break
            case 'game_unpaused': stepDone = state.gameSpeed > 0; break
            case 'earned_revenue': stepDone = state.money > 50000; break
            case 'heat_rising': stepDone = stats.avgHeat > SIM.ambientTemp + 2; break
            case 'has_two_equipped_cabinets': stepDone = newCabinets.filter((c) => c.serverCount > 0).length >= 2; break
            case 'opened_finance': stepDone = panelsOpened.includes('finance'); break
            case 'opened_operations': stepDone = panelsOpened.includes('operations'); break
            case 'opened_contracts': stepDone = panelsOpened.includes('contracts'); break
            case 'explored_panels': {
              // Exclude panels already required by earlier steps and the core build/equipment
              const explorationPanels = panelsOpened.filter((p) => !['build', 'equipment', 'finance', 'operations', 'contracts'].includes(p))
              stepDone = explorationPanels.length >= 3
              break
            }
            case 'always': stepDone = true; break
          }
          if (stepDone) {
            tutorialStepIndex = tutorialStepIndex + 1
            if (tutorialStepIndex >= TUTORIAL_STEPS.length) {
              tutorialCompleted = true
            }
          }
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
      if (coolingUnits.length >= 1) unlock('first_cooling_unit')
      if (coolingUnits.filter((u) => u.operational).length >= 10) unlock('cooling_fleet')
      if (coolingUnits.some((u) => u.type === 'immersion_pod')) unlock('immersion_pioneer')
      // Chiller & pipe achievements
      if (chillerPlants.length >= 1) unlock('chiller_installed')
      if (coolingPipes.length >= 10) unlock('pipe_network')
      {
        const connectedCrahCount = coolingUnits
          .filter((u) => u.operational && u.type === 'crah')
          .filter((u) => getChillerConnection(u, chillerPlants, coolingPipes).connected)
          .length
        if (connectedCrahCount >= 3) unlock('cold_chain')
      }
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
      // New Feature achievements
      if (completedWorkloads >= 1) unlock('first_workload')
      if (completedWorkloads >= 10) unlock('workload_master')
      if (state.raisedFloorTier === 'advanced') unlock('raised_floor')
      if (state.advancedTier === 'nuclear') unlock('nuclear_power')
      if (state.advancedTier === 'fusion') unlock('fusion_power')
      if (state.rowEndSlots.length >= 4) unlock('row_end_equipped')
      if (Object.keys(state.aisleWidths).length >= 2) unlock('wide_aisles')
      if (Object.keys(state.rackDetails).length >= 1) unlock('rack_detailed')
      // Prestige achievements
      if (state.prestige.level >= 1) unlock('first_prestige')
      if (state.prestige.level >= 3) unlock('prestige_3')
      if (state.prestige.level >= 5) unlock('prestige_5')
      if (state.prestige.level >= MAX_PRESTIGE_LEVEL) unlock('prestige_max')

      // ── Phase 6 — Multi-Site Expansion Tick ────────────────────
      const suiteTierOrder: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']
      const multiSiteUnlocked = state.multiSiteUnlocked || (
        suiteTierOrder.indexOf(state.suiteTier) >= suiteTierOrder.indexOf(MULTI_SITE_GATE.minSuiteTier) &&
        state.money >= MULTI_SITE_GATE.minCash &&
        reputationScore >= MULTI_SITE_GATE.minReputation
      )

      // Tick site construction and calculate background site income/expenses
      let totalSiteRevenue = 0
      let totalSiteExpenses = 0
      const updatedSites = state.sites.map((site) => {
        // Tick construction
        if (!site.operational && site.constructionTicksRemaining > 0) {
          const remaining = site.constructionTicksRemaining - 1
          if (remaining <= 0) {
            // Site construction complete — initialize with empty snapshot
            const emptySnapshot: SiteSnapshot = {
              cabinets: [], spineSwitches: [], pdus: [], cableTrays: [], cableRuns: [],
              coolingUnits: [], chillerPlants: [], coolingPipes: [],
              busways: [], crossConnects: [], inRowCoolers: [],
              rowEndSlots: [], aisleContainments: [], aisleWidths: {},
              raisedFloorTier: 'none', cableManagementType: 'none',
              coolingType: 'air', suiteTier: 'starter' as SuiteTier,
              totalPower: 0, avgHeat: SIM.ambientTemp, revenue: 0, expenses: 0,
            }
            eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'infrastructure' as EventCategory, message: `${site.name} construction complete — site is now operational!`, severity: 'success' as EventSeverity })
            floatingTexts.push({ text: `${site.name} ONLINE`, color: '#00ff88', center: true })
            return { ...site, constructionTicksRemaining: 0, operational: true, snapshot: emptySnapshot }
          }
          return { ...site, constructionTicksRemaining: remaining }
        }
        // Background site revenue/expenses (only for operational non-active sites with snapshots)
        if (site.operational && site.id !== state.activeSiteId) {
          const region = REGION_CATALOG.find((r) => r.id === site.regionId)
          const siteConfig = SITE_TYPE_CONFIG[site.type]
          const regionPowerMult = region ? region.profile.powerCostMultiplier : 1
          // Use snapshot data for more accurate calculation if available
          const srvCount = site.snapshot ? site.snapshot.cabinets.reduce((sum, c) => sum + c.serverCount, 0) : site.servers
          const demandBonus = region ? Math.max(region.demandProfile.general, region.demandProfile.ai_training, region.demandProfile.streaming, region.demandProfile.enterprise, region.demandProfile.crypto) : 0.5
          const siteRev = srvCount * SIM.revenuePerServer * (0.5 + demandBonus)
          const siteExp = srvCount * POWER_DRAW.server * 0.001 * POWER_MARKET.baseCost * regionPowerMult + siteConfig.maintenanceCostPerTick
          totalSiteRevenue += siteRev
          totalSiteExpenses += siteExp
          return {
            ...site,
            cabinets: site.snapshot ? site.snapshot.cabinets.length : site.cabinets,
            servers: srvCount,
            revenue: +siteRev.toFixed(2),
            expenses: +siteExp.toFixed(2),
          }
        }
        // Active remote site — sync live stats from current state
        if (site.operational && site.id === state.activeSiteId) {
          return {
            ...site,
            cabinets: newCabinets.length,
            servers: newCabinets.reduce((sum, c) => sum + c.serverCount, 0),
            suiteTier: state.suiteTier,
            revenue: +revenue.toFixed(2),
            expenses: +expenses.toFixed(2),
            heat: Math.round(newCabinets.reduce((sum, c) => sum + c.heatLevel, 0) / Math.max(1, newCabinets.length)),
          }
        }
        return site
      })

      // Phase 6 achievements
      if (multiSiteUnlocked && !state.multiSiteUnlocked) unlock('multi_site_unlocked')
      if (updatedSites.length >= 1) unlock('first_expansion')
      if (updatedSites.filter((s) => s.operational).length >= 3) unlock('global_network')
      if (updatedSites.filter((s) => s.operational).length >= MAX_SITES) unlock('world_domination')
      const continentsWithSites = new Set(updatedSites.filter((s) => s.operational).map((s) => REGION_CATALOG.find((r) => r.id === s.regionId)?.continent).filter(Boolean))
      if (continentsWithSites.size >= 3) unlock('three_continents')

      // ── Phase 6B — Inter-Site Networking Tick ──────────────────────
      let interSiteLinkCost = 0
      let edgePopCDNRevenue = 0
      const updatedLinks = state.interSiteLinks.map((link) => {
        // Link reliability check — occasionally take links offline
        const linkConfig = INTER_SITE_LINK_CONFIG[link.type]
        let operational = link.operational
        if (operational && Math.random() > linkConfig.reliability) {
          operational = false
          eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'infrastructure' as EventCategory, message: `Inter-site link ${linkConfig.label} went offline!`, severity: 'warning' as EventSeverity })
        } else if (!operational && Math.random() < 0.2) {
          // 20% chance per tick to come back online
          operational = true
          eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'infrastructure' as EventCategory, message: `Inter-site link ${linkConfig.label} restored.`, severity: 'success' as EventSeverity })
        }

        // Calculate utilization based on connected site server counts
        let util = 0
        if (operational) {
          const siteAServers = link.siteAId === null
            ? newCabinets.reduce((sum, c) => sum + c.serverCount, 0)
            : (() => { const s = updatedSites.find((st) => st.id === link.siteAId); return s ? s.servers : 0 })()
          const siteBServers = (() => { const s = updatedSites.find((st) => st.id === link.siteBId); return s ? s.servers : 0 })()
          const totalTraffic = (siteAServers + siteBServers) * TRAFFIC.gbpsPerServer * 0.1 // 10% of local traffic goes inter-site
          util = Math.min(1, totalTraffic / link.bandwidthGbps)
        }

        // Link cost
        if (operational) interSiteLinkCost += link.costPerTick

        return { ...link, operational, utilization: +util.toFixed(3) }
      })

      // Edge PoP CDN revenue — edge PoPs with a backhaul link to HQ or a core site earn CDN revenue
      const operationalEdgePops = updatedSites.filter((s) => s.type === 'edge_pop' && s.operational)
      for (const ep of operationalEdgePops) {
        // Check if this edge PoP has a backhaul link to any other operational site
        const hasBackhaul = updatedLinks.some((l) =>
          l.operational &&
          ((l.siteAId === ep.id || l.siteBId === ep.id))
        )
        if (hasBackhaul) {
          // CDN revenue based on the bandwidth of the best link to this edge PoP
          const bestLink = updatedLinks
            .filter((l) => l.operational && (l.siteAId === ep.id || l.siteBId === ep.id))
            .sort((a, b) => b.bandwidthGbps - a.bandwidthGbps)[0]
          if (bestLink) {
            const region = REGION_CATALOG.find((r) => r.id === ep.regionId)
            const demandBonus = region ? Math.max(region.demandProfile.streaming, region.demandProfile.general) : 0.5
            edgePopCDNRevenue += bestLink.bandwidthGbps * EDGE_POP_CDN_REVENUE_PER_GBPS * demandBonus
          }
        }
      }

      // Phase 6B achievements
      if (updatedLinks.length >= 1) unlock('first_link')
      if (updatedLinks.filter((l) => l.operational).length >= 3) unlock('network_architect')
      if (updatedLinks.some((l) => l.type === 'dark_fiber')) unlock('dark_fiber')
      if (updatedLinks.some((l) => l.type === 'submarine_cable')) unlock('submarine_cable')
      if (edgePopCDNRevenue > 0) unlock('cdn_revenue')

      // Phase 6C achievements
      if (regionalIncidentCount > 0) {
        // Check if any critical regional incident was survived (resolved or expired)
        const hadCriticalRegional = activeIncidents.some((i) => i.def.type.startsWith('regional_') && i.def.severity === 'critical')
        if (hadCriticalRegional || state.regionalIncidentCount > 0) unlock('disaster_survivor')
      }
      if (state.siteDisasterPreps.length >= 1) unlock('disaster_prepped')
      const prepTypes = new Set(state.siteDisasterPreps.map((p) => p.type))
      if (prepTypes.size >= 4) unlock('fully_hardened')
      if (regionalIncidentsBlocked >= 5) unlock('regional_blocker')

      // ── Phase 6D — Global Strategy Layer Tick ──────────────────────
      // Demand growth — update regional demand multipliers periodically
      const demandGrowthMultipliers = { ...state.demandGrowthMultipliers }
      if (multiSiteUnlocked && newTickCount % DEMAND_GROWTH_CONFIG.growthInterval === 0) {
        const customerTypes = ['general', 'ai_training', 'streaming', 'crypto', 'enterprise'] as const
        for (const region of REGION_CATALOG) {
          if (!demandGrowthMultipliers[region.id]) {
            demandGrowthMultipliers[region.id] = {}
            for (const ct of customerTypes) demandGrowthMultipliers[region.id][ct] = 0
          }
          for (const ct of customerTypes) {
            const baseDemand = region.demandProfile[ct]
            const currentGrowth = demandGrowthMultipliers[region.id][ct] || 0
            const effectiveDemand = baseDemand + currentGrowth
            let delta = 0
            if (effectiveDemand < DEMAND_GROWTH_CONFIG.emergingThreshold) {
              delta = DEMAND_GROWTH_CONFIG.emergingGrowthRate
            } else if (effectiveDemand > DEMAND_GROWTH_CONFIG.saturatedThreshold) {
              delta = DEMAND_GROWTH_CONFIG.saturatedDecayRate
            } else {
              delta = DEMAND_GROWTH_CONFIG.stableGrowthRate
            }
            // Random variation ±50%
            delta *= (0.5 + Math.random())
            const newGrowth = Math.max(
              DEMAND_GROWTH_CONFIG.minDemand - baseDemand,
              Math.min(DEMAND_GROWTH_CONFIG.maxDemand - baseDemand, currentGrowth + delta)
            )
            demandGrowthMultipliers[region.id][ct] = +newGrowth.toFixed(4)
          }
        }
      }

      // Multi-site contracts — tick active contracts, check compliance
      let multiSiteContractRevenue = 0
      let multiSiteContractPenalties = 0
      const operationalSiteRegions = updatedSites.filter((s) => s.operational).map((s) => s.regionId)
      const allPlayerRegions = ['ashburn' as const, ...operationalSiteRegions]
      const operationalSiteTypes = updatedSites.filter((s) => s.operational).map((s) => s.type)
      operationalSiteTypes.push('headquarters')
      const updatedMultiSiteContracts = state.multiSiteContracts.map((contract) => {
        if (contract.status !== 'active') return contract
        const def = contract.def
        // Check region compliance
        const regionsMet = def.requiredRegions.every((r) => allPlayerRegions.includes(r))
        const siteTypesMet = !def.requiredSiteTypes || def.requiredSiteTypes.length === 0 || def.requiredSiteTypes.some((t) => operationalSiteTypes.includes(t))
        const compliant = regionsMet && siteTypesMet
        const ticks = contract.ticksRemaining - 1
        if (compliant) {
          // Apply sovereignty bonus
          let sovereigntyBonus = 1
          if (def.sovereigntyRegime && def.sovereigntyRegime !== 'none') {
            const rule = DATA_SOVEREIGNTY_CONFIG.find((r) => r.regime === def.sovereigntyRegime)
            if (rule) sovereigntyBonus = 1 + rule.revenueBonus
          }
          const rev = def.revenuePerTick * sovereigntyBonus
          multiSiteContractRevenue += rev
          if (ticks <= 0) {
            multiSiteContractRevenue += 0 // completion bonus added to money directly
            eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'contract' as EventCategory, message: `Multi-site contract "${def.label}" completed! Bonus: $${def.completionBonus.toLocaleString()}`, severity: 'success' as EventSeverity })
            floatingTexts.push({ text: `CONTRACT COMPLETE: ${def.label}`, color: '#00ff88', center: true })
            return { ...contract, ticksRemaining: 0, totalEarned: contract.totalEarned + rev + def.completionBonus, status: 'completed' as const, consecutiveViolations: 0 }
          }
          return { ...contract, ticksRemaining: ticks, totalEarned: contract.totalEarned + rev, consecutiveViolations: 0 }
        } else {
          // Non-compliant — apply penalty
          multiSiteContractPenalties += def.penaltyPerTick
          const violations = contract.consecutiveViolations + 1
          // Terminate after 20 consecutive violations
          if (violations >= 20) {
            eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'contract' as EventCategory, message: `Multi-site contract "${def.label}" terminated due to non-compliance!`, severity: 'error' as EventSeverity })
            floatingTexts.push({ text: `CONTRACT TERMINATED: ${def.label}`, color: '#ff4444', center: true })
            return { ...contract, ticksRemaining: ticks, totalPenalties: contract.totalPenalties + def.penaltyPerTick, consecutiveViolations: violations, status: 'terminated' as const }
          }
          return { ...contract, ticksRemaining: ticks, totalPenalties: contract.totalPenalties + def.penaltyPerTick, consecutiveViolations: violations }
        }
      })
      // Add completion bonuses to money
      const completionBonuses = updatedMultiSiteContracts.filter((c) => c.status === 'completed' && state.multiSiteContracts.find((sc) => sc.id === c.id)?.status === 'active').reduce((sum, c) => sum + c.def.completionBonus, 0)

      // Staff transfers — tick in-transit staff, deliver arrived staff
      let staffTransfersCompleted = state.staffTransfersCompleted
      const pendingTransfers: StaffTransfer[] = []
      const arrivedStaff: StaffTransfer[] = []
      for (const transfer of state.staffTransfers) {
        const remaining = transfer.ticksRemaining - 1
        if (remaining <= 0) {
          arrivedStaff.push(transfer)
          staffTransfersCompleted++
        } else {
          pendingTransfers.push({ ...transfer, ticksRemaining: remaining })
        }
      }
      // Note: arrived staff will be added to the target site's roster when player switches to that site
      // For now, log the arrival
      for (const arrived of arrivedStaff) {
        const destName = arrived.toSiteId ? updatedSites.find((s) => s.id === arrived.toSiteId)?.name ?? 'site' : 'HQ'
        eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'staff' as EventCategory, message: `${arrived.staffName} (${arrived.staffRole}) arrived at ${destName}.`, severity: 'success' as EventSeverity })
        floatingTexts.push({ text: `STAFF ARRIVED: ${arrived.staffName}`, color: '#00aaff', center: true })
        // If arriving at HQ (activeSiteId === null) or current active site, add to staff
        if (arrived.toSiteId === state.activeSiteId) {
          // Will be handled below via updatedStaffWithArrivals
        }
      }
      const staffArrivingHere = arrivedStaff.filter((a) => a.toSiteId === state.activeSiteId)
      // Recreate arrived staff members (basic reconstruction)
      const arrivedStaffMembers: StaffMember[] = staffArrivingHere.map((a) => ({
        id: a.staffId,
        name: a.staffName,
        role: a.staffRole,
        skillLevel: 1 as StaffSkillLevel,
        salaryPerTick: STAFF_ROLE_CONFIG.find((r) => r.role === a.staffRole)?.baseSalary ?? 5,
        hiredAtTick: a.startedAtTick,
        onShift: true,
        certifications: [],
        incidentsResolved: 0,
        fatigueLevel: 0,
      }))

      // Competitor regional presence — competitors expand into regions
      let competitorRegionalPresence = [...state.competitorRegionalPresence]
      if (multiSiteUnlocked) {
        for (const comp of competitors) {
          const compPresence = competitorRegionalPresence.filter((p) => p.competitorId === comp.id)
          // Grow existing presence
          competitorRegionalPresence = competitorRegionalPresence.map((p) => {
            if (p.competitorId !== comp.id) return p
            const newStrength = Math.min(COMPETITOR_REGIONAL_CONFIG.maxRegionalStrength, p.strength + COMPETITOR_REGIONAL_CONFIG.regionalStrengthGrowth)
            return { ...p, strength: +newStrength.toFixed(3) }
          })
          // Chance to expand to new region
          if (compPresence.length < COMPETITOR_REGIONAL_CONFIG.maxRegionsPerCompetitor && Math.random() < COMPETITOR_REGIONAL_CONFIG.expansionChance) {
            // Pick a region the competitor isn't in yet, weighted by demand matching their specialization
            const existingRegions = new Set(compPresence.map((p) => p.regionId))
            const candidates = REGION_CATALOG.filter((r) => !existingRegions.has(r.id))
            if (candidates.length > 0) {
              const specKey = comp.specialization as keyof typeof candidates[0]['demandProfile']
              const sorted = candidates.sort((a, b) => (b.demandProfile[specKey] || 0) - (a.demandProfile[specKey] || 0))
              const chosen = sorted[0]
              competitorRegionalPresence = [...competitorRegionalPresence, {
                competitorId: comp.id,
                regionId: chosen.id,
                strength: 0.1,
                establishedAtTick: newTickCount,
              }]
              eventLog.push({ tick: newTickCount, gameHour: +(newHour.toFixed(1)), category: 'system' as EventCategory, message: `Competitor ${comp.name} expanded to ${chosen.name}!`, severity: 'warning' as EventSeverity })
            }
          }
        }
      }

      // Phase 6D achievements
      if (updatedMultiSiteContracts.some((c) => c.status === 'active' || c.status === 'completed')) unlock('first_multisite_contract')
      if (updatedMultiSiteContracts.some((c) => (c.status === 'completed') && c.def.sovereigntyRegime && c.def.sovereigntyRegime !== 'none')) unlock('sovereignty_compliant')
      if (staffTransfersCompleted >= 1) unlock('staff_transferred')
      // Demand surfer — site in emerging market
      for (const site of updatedSites.filter((s) => s.operational)) {
        const growth = demandGrowthMultipliers[site.regionId]
        if (growth) {
          const hasEmerging = Object.values(growth).some((g) => g > 0.01)
          if (hasEmerging) { unlock('demand_surfer'); break }
        }
      }
      const totalMSCRevenue = updatedMultiSiteContracts.filter((c) => c.status === 'active').reduce((sum, c) => {
        let bonus = 1
        if (c.def.sovereigntyRegime && c.def.sovereigntyRegime !== 'none') {
          const rule = DATA_SOVEREIGNTY_CONFIG.find((r) => r.regime === c.def.sovereigntyRegime)
          if (rule) bonus = 1 + rule.revenueBonus
        }
        return sum + c.def.revenuePerTick * bonus
      }, 0)
      if (totalMSCRevenue >= 300) unlock('global_empire')

      // Apply Phase 4 bonuses to contract revenue
      const adjustedContractRevenue = +(contractRevenue * (1 + complianceRevenueBonus + greenCertRevenueBonus) * priceWarPenalty).toFixed(2)

      // Recalculate final money with all income/expenses (Phase 4 + 5 + 6 + 6B + 6D + workloads + ops included)
      const phase5Income = spotRevenue + meetMeRevenue
      const phase5Expenses = peeringCostPerTick + powerRedundancyCost + meetMeMaintenanceCost + (noiseComplaints > state.noiseComplaints && noiseComplaints % NOISE_CONFIG.fineThreshold === 0 ? NOISE_CONFIG.fineAmount : 0)
      const phase4Expenses = carbonTaxPerTick + waterCostPerTick + securityMaintenanceCost
      const phase6Income = totalSiteRevenue + edgePopCDNRevenue
      const phase6Expenses = totalSiteExpenses + interSiteLinkCost + disasterPrepMaintenanceCost
      const phase6DIncome = multiSiteContractRevenue + completionBonuses
      const phase6DExpenses = multiSiteContractPenalties
      const newFeatureIncome = workloadRevenue
      const finalNewMoney = state.sandboxMode
        ? 999999999
        : Math.round((state.money + revenue + adjustedContractRevenue + patentIncome + milestoneMoney + phase5Income + phase6Income + phase6DIncome + newFeatureIncome + (insurancePayouts - state.insurancePayouts) - expenses - loanPayments - contractPenalties - insuranceCost - staffCostPerTick - phase5Expenses - phase4Expenses - phase6Expenses - phase6DExpenses) * 100) / 100

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
        mixedEnvPenaltyCount: mixedEnvPenalties.size,
        dedicatedRows: currentDedicatedRows,
        dedicatedRowBonusRevenue: +dedicatedRowBonusRevenue.toFixed(2),
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
        scenarioBestTicks,
        // Staff & HR (include arrived transfers)
        staff: [...updatedStaff, ...arrivedStaffMembers],
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
        tutorialStepIndex,
        tutorialCompleted,
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
        // Cooling infrastructure
        coolingUnits,
        chillerPlants,
        coolingPipes,
        // Phase 6 — Multi-Site Expansion
        multiSiteUnlocked,
        sites: updatedSites,
        totalSiteRevenue: +totalSiteRevenue.toFixed(2),
        totalSiteExpenses: +totalSiteExpenses.toFixed(2),
        // Phase 6B — Inter-Site Networking
        interSiteLinks: updatedLinks,
        interSiteLinkCost: +interSiteLinkCost.toFixed(2),
        edgePopCDNRevenue: +edgePopCDNRevenue.toFixed(2),
        // Phase 6C — Regional Incidents & Disaster Preparedness
        regionalIncidentCount,
        regionalIncidentsBlocked,
        disasterPrepMaintenanceCost: +disasterPrepMaintenanceCost.toFixed(2),
        // Phase 6D — Global Strategy Layer
        demandGrowthMultipliers,
        multiSiteContracts: updatedMultiSiteContracts,
        multiSiteContractRevenue: +multiSiteContractRevenue.toFixed(2),
        staffTransfers: pendingTransfers,
        staffTransfersCompleted,
        competitorRegionalPresence,
        // New Features
        activeWorkloads,
        completedWorkloads,
        failedWorkloads,
        workloadRevenue: +workloadRevenue.toFixed(2),
        // Floating text events
        pendingFloatingTexts: floatingTexts,
        // Camera effects
        pendingCameraEffects: cameraEffects,
      }
    }),
}))

