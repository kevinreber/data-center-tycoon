import type {
  EnergySource,
  EnergySourceConfig,
  GreenCertConfig,
  SecurityFeatureConfig,
  SecurityTierConfig,
  ComplianceCertConfig,
  CompetitorPersonality,
  SuiteTier,
  SiteType,
  SiteTypeConfig,
  Region,
} from '../types'

// ── Carbon & Environmental Config ───────────────────────────────────

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

// ── Security & Compliance Config ────────────────────────────────────

export const SECURITY_FEATURE_CONFIG: SecurityFeatureConfig[] = [
  { id: 'badge_access', label: 'Badge Access', description: 'Electronic badge readers on all entry points.', cost: 0, maintenanceCost: 0, requiredTier: 'basic', intrusionDefense: 0.05 },
  { id: 'cctv', label: 'CCTV', description: '24/7 camera surveillance of facility perimeter and server halls.', cost: 8000, maintenanceCost: 3, requiredTier: 'enhanced', intrusionDefense: 0.20 },
  { id: 'biometric', label: 'Biometric Scanners', description: 'Fingerprint and retinal scanners for sensitive areas.', cost: 20000, maintenanceCost: 5, requiredTier: 'high_security', intrusionDefense: 0.25 },
  { id: 'mantrap', label: 'Mantrap Entry', description: 'Dual-door mantrap prevents tailgating.', cost: 25000, maintenanceCost: 4, requiredTier: 'high_security', intrusionDefense: 0.30 },
  { id: 'cage_isolation', label: 'Cage Isolation', description: 'Individual customer cages with locked access.', cost: 35000, maintenanceCost: 6, requiredTier: 'high_security', intrusionDefense: 0.15 },
  { id: 'encrypted_network', label: 'Encrypted Network', description: 'Full network encryption at the facility level.', cost: 40000, maintenanceCost: 8, requiredTier: 'maximum', intrusionDefense: 0.10 },
  { id: 'security_noc', label: 'Security NOC', description: '24/7 security operations center with dedicated monitoring staff.', cost: 60000, maintenanceCost: 15, requiredTier: 'maximum', intrusionDefense: 0.10 },
]

export const SECURITY_TIER_CONFIG: SecurityTierConfig[] = [
  { tier: 'basic', label: 'Basic', description: 'Badge access only. Standard contracts available.', cost: 0, maintenancePerTick: 0, featuresIncluded: ['badge_access'], color: '#888888' },
  { tier: 'enhanced', label: 'Enhanced', description: 'CCTV + badge access. SOC 2 eligible, enterprise contracts.', cost: 15000, maintenancePerTick: 8, featuresIncluded: ['badge_access', 'cctv'], color: '#44aaff' },
  { tier: 'high_security', label: 'High Security', description: 'Biometric, mantrap, cages. HIPAA/PCI-DSS eligible.', cost: 50000, maintenancePerTick: 20, featuresIncluded: ['badge_access', 'cctv', 'biometric', 'mantrap', 'cage_isolation'], color: '#ff8844' },
  { tier: 'maximum', label: 'Maximum', description: 'Full suite including encrypted network and Security NOC. FedRAMP eligible.', cost: 150000, maintenancePerTick: 45, featuresIncluded: ['badge_access', 'cctv', 'biometric', 'mantrap', 'cage_isolation', 'encrypted_network', 'security_noc'], color: '#ff4444' },
]

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

// ── Competitor AI Config ────────────────────────────────────────────

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

export const COMPETITOR_NAMES = [
  'NexGen Data', 'CloudVault Inc', 'TerraHost', 'IronGrid Systems', 'ArcticCore',
  'DataForge', 'SkyBridge DC', 'VoltStack', 'ByteHaven', 'CoreFlux',
]

export const COMPETITOR_SCALE_CONFIG = {
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

// ── Multi-Site Expansion Config ─────────────────────────────────────

export const MULTI_SITE_GATE = {
  minSuiteTier: 'enterprise' as SuiteTier,
  minCash: 500000,
  minReputation: 75,   // 'excellent' tier
}

export const SITE_TYPE_CONFIG: Record<SiteType, SiteTypeConfig> = {
  headquarters: {
    type: 'headquarters',
    label: 'Headquarters',
    purchaseCost: 0,
    constructionTicks: 0,
    maxSuiteTier: 'enterprise',
    maxCabinets: 50,
    maxStaff: 16,
    maintenanceCostPerTick: 0,
    description: 'Your original data center. Full management capabilities.',
  },
  edge_pop: {
    type: 'edge_pop',
    label: 'Edge PoP',
    purchaseCost: 25000,
    constructionTicks: 10,
    maxSuiteTier: 'starter',
    maxCabinets: 4,
    maxStaff: 2,
    maintenanceCostPerTick: 5,
    description: 'Small edge presence for low-latency content delivery. Requires backhaul link to core site.',
  },
  colocation: {
    type: 'colocation',
    label: 'Colocation',
    purchaseCost: 150000,
    constructionTicks: 30,
    maxSuiteTier: 'standard',
    maxCabinets: 18,
    maxStaff: 4,
    maintenanceCostPerTick: 20,
    description: 'Shared facility with meet-me room potential. Standard contracts and interconnection.',
  },
  hyperscale: {
    type: 'hyperscale',
    label: 'Hyperscale',
    purchaseCost: 500000,
    constructionTicks: 60,
    maxSuiteTier: 'enterprise',
    maxCabinets: 50,
    maxStaff: 16,
    maintenanceCostPerTick: 50,
    description: 'Massive facility for volume contracts, AI training, and bulk workloads.',
  },
  network_hub: {
    type: 'network_hub',
    label: 'Network Hub / IXP',
    purchaseCost: 200000,
    constructionTicks: 25,
    maxSuiteTier: 'standard',
    maxCabinets: 8,
    maxStaff: 4,
    maintenanceCostPerTick: 30,
    description: 'Internet exchange point. Revenue from interconnection and transit fees.',
  },
  disaster_recovery: {
    type: 'disaster_recovery',
    label: 'Disaster Recovery',
    purchaseCost: 300000,
    constructionTicks: 40,
    maxSuiteTier: 'professional',
    maxCabinets: 32,
    maxStaff: 8,
    maintenanceCostPerTick: 40,
    description: 'DR site for compliance contracts and failover. Enables DR-gated contracts.',
  },
}

export const REGION_RESEARCH_COST = 10000

export const REGION_CATALOG: Region[] = [
  // ── North America ──────────────────────────
  {
    id: 'ashburn', name: 'Northern Virginia (Ashburn)', continent: 'north_america',
    coordinates: { x: 260, y: 195 },
    profile: { powerCostMultiplier: 0.8, laborCostMultiplier: 1.2, landCostMultiplier: 1.5, coolingEfficiency: 2, networkConnectivity: 1.0, regulatoryBurden: 0.3, carbonTaxMultiplier: 0.5, taxIncentiveDiscount: 0.15, solarEfficiency: 0.5, windEfficiency: 0.4 },
    demandProfile: { general: 0.9, ai_training: 0.6, streaming: 0.9, crypto: 0.3, enterprise: 0.9 },
    disasterProfile: { earthquakeRisk: 0.05, floodRisk: 0.15, hurricaneRisk: 0.2, heatwaveRisk: 0.3, gridInstability: 0.05 },
    description: 'The data center capital of the world. Excellent network connectivity, moderate power costs, and strong enterprise demand.',
  },
  {
    id: 'bay_area', name: 'Bay Area (Santa Clara)', continent: 'north_america',
    coordinates: { x: 135, y: 195 },
    profile: { powerCostMultiplier: 1.4, laborCostMultiplier: 1.8, landCostMultiplier: 3.0, coolingEfficiency: 0, networkConnectivity: 0.9, regulatoryBurden: 0.6, carbonTaxMultiplier: 1.5, taxIncentiveDiscount: 0.1, solarEfficiency: 0.8, windEfficiency: 0.5 },
    demandProfile: { general: 0.7, ai_training: 1.0, streaming: 0.5, crypto: 0.5, enterprise: 0.8 },
    disasterProfile: { earthquakeRisk: 0.7, floodRisk: 0.1, hurricaneRisk: 0, heatwaveRisk: 0.4, gridInstability: 0.15 },
    description: 'Tech hub with massive AI training demand. Expensive real estate and labor but unmatched innovation ecosystem.',
  },
  {
    id: 'dallas', name: 'Dallas / Fort Worth', continent: 'north_america',
    coordinates: { x: 200, y: 215 },
    profile: { powerCostMultiplier: 0.7, laborCostMultiplier: 0.9, landCostMultiplier: 0.6, coolingEfficiency: 5, networkConnectivity: 0.8, regulatoryBurden: 0.2, carbonTaxMultiplier: 0.2, taxIncentiveDiscount: 0.2, solarEfficiency: 0.7, windEfficiency: 0.8 },
    demandProfile: { general: 0.7, ai_training: 0.4, streaming: 0.6, crypto: 0.7, enterprise: 0.6 },
    disasterProfile: { earthquakeRisk: 0.05, floodRisk: 0.2, hurricaneRisk: 0.15, heatwaveRisk: 0.6, gridInstability: 0.2 },
    description: 'Low-cost power hub in tornado alley. Strong wind energy potential but grid reliability concerns.',
  },
  {
    id: 'chicago', name: 'Chicago', continent: 'north_america',
    coordinates: { x: 235, y: 180 },
    profile: { powerCostMultiplier: 0.9, laborCostMultiplier: 1.1, landCostMultiplier: 1.0, coolingEfficiency: -3, networkConnectivity: 0.85, regulatoryBurden: 0.4, carbonTaxMultiplier: 0.8, taxIncentiveDiscount: 0.1, solarEfficiency: 0.4, windEfficiency: 0.7 },
    demandProfile: { general: 0.8, ai_training: 0.5, streaming: 0.6, crypto: 0.4, enterprise: 0.8 },
    disasterProfile: { earthquakeRisk: 0.02, floodRisk: 0.2, hurricaneRisk: 0, heatwaveRisk: 0.2, gridInstability: 0.1 },
    description: 'Major financial and network exchange hub. Cold winters provide natural cooling advantage.',
  },
  {
    id: 'portland', name: 'Portland / Oregon', continent: 'north_america',
    coordinates: { x: 130, y: 170 },
    profile: { powerCostMultiplier: 0.5, laborCostMultiplier: 1.0, landCostMultiplier: 0.7, coolingEfficiency: -5, networkConnectivity: 0.7, regulatoryBurden: 0.4, carbonTaxMultiplier: 1.0, taxIncentiveDiscount: 0.2, solarEfficiency: 0.3, windEfficiency: 0.8 },
    demandProfile: { general: 0.5, ai_training: 0.7, streaming: 0.4, crypto: 0.8, enterprise: 0.4 },
    disasterProfile: { earthquakeRisk: 0.3, floodRisk: 0.15, hurricaneRisk: 0, heatwaveRisk: 0.1, gridInstability: 0.05 },
    description: 'Cheap hydroelectric power and cool climate. Favored by crypto miners and AI training workloads.',
  },
  // ── South America ──────────────────────────
  {
    id: 'sao_paulo', name: 'São Paulo', continent: 'south_america',
    coordinates: { x: 330, y: 355 },
    profile: { powerCostMultiplier: 1.1, laborCostMultiplier: 0.7, landCostMultiplier: 0.8, coolingEfficiency: 3, networkConnectivity: 0.6, regulatoryBurden: 0.7, carbonTaxMultiplier: 0.3, taxIncentiveDiscount: 0.1, solarEfficiency: 0.6, windEfficiency: 0.3 },
    demandProfile: { general: 0.6, ai_training: 0.3, streaming: 0.8, crypto: 0.4, enterprise: 0.5 },
    disasterProfile: { earthquakeRisk: 0.02, floodRisk: 0.4, hurricaneRisk: 0, heatwaveRisk: 0.3, gridInstability: 0.25 },
    description: 'Gateway to Latin America. LGPD data sovereignty requirements make local presence essential for regional contracts.',
  },
  // ── Europe ─────────────────────────────────
  {
    id: 'london', name: 'London', continent: 'europe',
    coordinates: { x: 470, y: 165 },
    profile: { powerCostMultiplier: 1.3, laborCostMultiplier: 1.5, landCostMultiplier: 2.5, coolingEfficiency: -4, networkConnectivity: 0.95, regulatoryBurden: 0.7, carbonTaxMultiplier: 1.5, taxIncentiveDiscount: 0.05, solarEfficiency: 0.2, windEfficiency: 0.6 },
    demandProfile: { general: 0.8, ai_training: 0.5, streaming: 0.8, crypto: 0.3, enterprise: 0.9 },
    disasterProfile: { earthquakeRisk: 0.01, floodRisk: 0.25, hurricaneRisk: 0, heatwaveRisk: 0.15, gridInstability: 0.05 },
    description: 'Europe\'s financial hub. Excellent connectivity but expensive. GDPR compliance required.',
  },
  {
    id: 'amsterdam', name: 'Amsterdam', continent: 'europe',
    coordinates: { x: 490, y: 155 },
    profile: { powerCostMultiplier: 1.1, laborCostMultiplier: 1.3, landCostMultiplier: 1.8, coolingEfficiency: -5, networkConnectivity: 0.95, regulatoryBurden: 0.6, carbonTaxMultiplier: 1.2, taxIncentiveDiscount: 0.1, solarEfficiency: 0.3, windEfficiency: 0.8 },
    demandProfile: { general: 0.7, ai_training: 0.4, streaming: 0.7, crypto: 0.5, enterprise: 0.7 },
    disasterProfile: { earthquakeRisk: 0.01, floodRisk: 0.4, hurricaneRisk: 0, heatwaveRisk: 0.1, gridInstability: 0.03 },
    description: 'Europe\'s internet exchange capital. AMS-IX provides unmatched peering. Flood risk from below sea level geography.',
  },
  {
    id: 'frankfurt', name: 'Frankfurt', continent: 'europe',
    coordinates: { x: 505, y: 160 },
    profile: { powerCostMultiplier: 1.2, laborCostMultiplier: 1.4, landCostMultiplier: 1.5, coolingEfficiency: -3, networkConnectivity: 0.9, regulatoryBurden: 0.8, carbonTaxMultiplier: 1.8, taxIncentiveDiscount: 0.05, solarEfficiency: 0.4, windEfficiency: 0.6 },
    demandProfile: { general: 0.8, ai_training: 0.5, streaming: 0.5, crypto: 0.2, enterprise: 0.9 },
    disasterProfile: { earthquakeRisk: 0.05, floodRisk: 0.2, hurricaneRisk: 0, heatwaveRisk: 0.2, gridInstability: 0.03 },
    description: 'Germany\'s financial center with strict data protection laws. DE-CIX is the world\'s largest IX by throughput.',
  },
  {
    id: 'nordics', name: 'Nordics (Stockholm)', continent: 'europe',
    coordinates: { x: 520, y: 125 },
    profile: { powerCostMultiplier: 0.6, laborCostMultiplier: 1.3, landCostMultiplier: 0.8, coolingEfficiency: -10, networkConnectivity: 0.7, regulatoryBurden: 0.5, carbonTaxMultiplier: 2.0, taxIncentiveDiscount: 0.25, solarEfficiency: 0.2, windEfficiency: 0.9 },
    demandProfile: { general: 0.4, ai_training: 0.8, streaming: 0.3, crypto: 0.9, enterprise: 0.5 },
    disasterProfile: { earthquakeRisk: 0.02, floodRisk: 0.1, hurricaneRisk: 0, heatwaveRisk: 0.02, gridInstability: 0.02 },
    description: 'Arctic-adjacent cooling paradise. Cheap renewable energy and excellent climate for heat-intensive workloads.',
  },
  // ── Asia-Pacific ───────────────────────────
  {
    id: 'singapore', name: 'Singapore', continent: 'asia_pacific',
    coordinates: { x: 720, y: 305 },
    profile: { powerCostMultiplier: 1.3, laborCostMultiplier: 1.2, landCostMultiplier: 2.0, coolingEfficiency: 12, networkConnectivity: 0.9, regulatoryBurden: 0.4, carbonTaxMultiplier: 1.0, taxIncentiveDiscount: 0.15, solarEfficiency: 0.7, windEfficiency: 0.1 },
    demandProfile: { general: 0.7, ai_training: 0.5, streaming: 0.8, crypto: 0.4, enterprise: 0.8 },
    disasterProfile: { earthquakeRisk: 0.01, floodRisk: 0.3, hurricaneRisk: 0, heatwaveRisk: 0.5, gridInstability: 0.02 },
    description: 'Southeast Asia\'s digital hub. Tropical heat challenges cooling but excellent connectivity and stable politics.',
  },
  {
    id: 'tokyo', name: 'Tokyo', continent: 'asia_pacific',
    coordinates: { x: 815, y: 195 },
    profile: { powerCostMultiplier: 1.5, laborCostMultiplier: 1.4, landCostMultiplier: 2.5, coolingEfficiency: 2, networkConnectivity: 0.85, regulatoryBurden: 0.5, carbonTaxMultiplier: 0.8, taxIncentiveDiscount: 0.1, solarEfficiency: 0.5, windEfficiency: 0.3 },
    demandProfile: { general: 0.8, ai_training: 0.6, streaming: 0.7, crypto: 0.3, enterprise: 0.8 },
    disasterProfile: { earthquakeRisk: 0.8, floodRisk: 0.3, hurricaneRisk: 0.2, heatwaveRisk: 0.3, gridInstability: 0.05 },
    description: 'Japan\'s tech capital. High earthquake risk but world-class infrastructure and enterprise demand.',
  },
  {
    id: 'mumbai', name: 'Mumbai', continent: 'asia_pacific',
    coordinates: { x: 660, y: 260 },
    profile: { powerCostMultiplier: 0.8, laborCostMultiplier: 0.7, landCostMultiplier: 1.0, coolingEfficiency: 10, networkConnectivity: 0.6, regulatoryBurden: 0.6, carbonTaxMultiplier: 0.3, taxIncentiveDiscount: 0.2, solarEfficiency: 0.8, windEfficiency: 0.4 },
    demandProfile: { general: 0.7, ai_training: 0.5, streaming: 0.8, crypto: 0.3, enterprise: 0.6 },
    disasterProfile: { earthquakeRisk: 0.15, floodRisk: 0.6, hurricaneRisk: 0.1, heatwaveRisk: 0.7, gridInstability: 0.35 },
    description: 'India\'s fastest-growing digital market. Cheap labor, high heat, monsoon flooding risk, and unreliable grid.',
  },
  // ── Middle East & Africa ───────────────────
  {
    id: 'dubai', name: 'Dubai', continent: 'middle_east_africa',
    coordinates: { x: 610, y: 240 },
    profile: { powerCostMultiplier: 0.9, laborCostMultiplier: 1.0, landCostMultiplier: 1.2, coolingEfficiency: 15, networkConnectivity: 0.7, regulatoryBurden: 0.3, carbonTaxMultiplier: 0.1, taxIncentiveDiscount: 0.3, solarEfficiency: 0.95, windEfficiency: 0.2 },
    demandProfile: { general: 0.5, ai_training: 0.3, streaming: 0.5, crypto: 0.6, enterprise: 0.7 },
    disasterProfile: { earthquakeRisk: 0.05, floodRisk: 0.1, hurricaneRisk: 0, heatwaveRisk: 0.9, gridInstability: 0.1 },
    description: 'Middle East digital hub with extreme heat challenges. Strong tax incentives and solar potential.',
  },
  {
    id: 'johannesburg', name: 'Johannesburg', continent: 'middle_east_africa',
    coordinates: { x: 545, y: 380 },
    profile: { powerCostMultiplier: 0.7, laborCostMultiplier: 0.8, landCostMultiplier: 0.5, coolingEfficiency: 0, networkConnectivity: 0.4, regulatoryBurden: 0.4, carbonTaxMultiplier: 0.5, taxIncentiveDiscount: 0.15, solarEfficiency: 0.8, windEfficiency: 0.5 },
    demandProfile: { general: 0.4, ai_training: 0.2, streaming: 0.5, crypto: 0.3, enterprise: 0.4 },
    disasterProfile: { earthquakeRisk: 0.05, floodRisk: 0.15, hurricaneRisk: 0, heatwaveRisk: 0.3, gridInstability: 0.6 },
    description: 'Africa\'s emerging tech hub. Cheap land but severe grid instability with rolling load shedding.',
  },
]

export const MAX_SITES = 8
