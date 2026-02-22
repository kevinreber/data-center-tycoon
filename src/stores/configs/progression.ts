import type { TechBranch, TechDef, OpsTierConfig, OpsTier, ReputationTier, ContractDef, ContractTier, ComplianceCertId, AchievementDef, IncidentDef, ScenarioDef, TutorialTip, ZoneRequirement } from '../types'

// ── Tech Tree ──────────────────────────────────────────────────

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

// ── Reputation System ─────────────────────────────────────────

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

// ── Contract / Tenant System ────────────────────────────────────

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

export const CONTRACT_TIER_COLORS: Record<ContractTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
}

/** How often (in ticks) new contract offers refresh */
export const CONTRACT_OFFER_INTERVAL = 50
/** Max contracts a player can have active at once */
export const MAX_ACTIVE_CONTRACTS = 3
/** Number of offers available at a time */
export const CONTRACT_OFFER_COUNT = 3

// ── Compliance-Gated Contracts ──────────────────────────────────

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

// ── Zone-Gated Contracts ────────────────────────────────────────

export const ZONE_CONTRACT_CATALOG: ContractDef[] = [
  { type: 'enterprise_sla', company: 'EnterpriseOne', tier: 'silver', description: 'Enterprise SLA hosting. Requires a production zone of 4+ adjacent cabinets.', minServers: 6, maxTemp: 75, revenuePerTick: 35, durationTicks: 200, penaltyPerTick: 20, terminationTicks: 8, completionBonus: 10000 },
  { type: 'ai_cluster', company: 'NeuralScale AI', tier: 'silver', description: 'AI training cluster. Requires 3+ adjacent AI training cabinets.', minServers: 4, maxTemp: 78, revenuePerTick: 40, durationTicks: 180, penaltyPerTick: 25, terminationTicks: 8, completionBonus: 12000 },
  { type: 'data_vault', company: 'VaultGuard', tier: 'gold', description: 'Enterprise data vault. Requires 4+ adjacent enterprise customer cabinets.', minServers: 8, maxTemp: 68, revenuePerTick: 65, durationTicks: 300, penaltyPerTick: 40, terminationTicks: 5, completionBonus: 25000 },
  { type: 'crypto_farm', company: 'CryptoMine', tier: 'silver', description: 'Crypto mining operation. Requires 3+ adjacent crypto cabinets.', minServers: 4, maxTemp: 82, revenuePerTick: 30, durationTicks: 150, penaltyPerTick: 15, terminationTicks: 10, completionBonus: 8000 },
]

export const ZONE_CONTRACT_REQUIREMENTS: Record<string, ZoneRequirement> = {
  enterprise_sla: { type: 'environment', key: 'production', minSize: 4 },
  ai_cluster: { type: 'customer', key: 'ai_training', minSize: 3 },
  data_vault: { type: 'customer', key: 'enterprise', minSize: 4 },
  crypto_farm: { type: 'customer', key: 'crypto', minSize: 3 },
}

// ── Achievement System ──────────────────────────────────────────

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
  // Cooling Infrastructure achievements
  { id: 'first_cooling_unit', label: 'Stay Cool', description: 'Place your first cooling unit.', icon: '🧊' },
  { id: 'cooling_fleet', label: 'Cooling Fleet', description: 'Have 10 or more cooling units operational.', icon: '❄️' },
  { id: 'immersion_pioneer', label: 'Immersion Pioneer', description: 'Deploy an immersion cooling pod.', icon: '🌊' },
  // Cabinet Organization Incentives achievements
  { id: 'no_mixed_penalty', label: 'Clean Segregation', description: 'Have 5+ cabinets with zero mixed-environment penalties.', icon: '🧹' },
  { id: 'dedicated_row', label: 'Dedicated Row', description: 'Fill an entire row with the same environment type.', icon: '📏' },
  { id: 'zone_contract', label: 'Zone Landlord', description: 'Complete a zone-gated contract.', icon: '🏘️' },
  // Chiller Plant & Cooling Pipe achievements
  { id: 'chiller_installed', label: 'Piped Up', description: 'Install a chiller plant.', icon: '🏭' },
  { id: 'cold_chain', label: 'Cold Chain', description: 'Connect 3 or more CRAH units to a chiller plant.', icon: '🔗' },
  { id: 'pipe_network', label: 'Pipe Dream', description: 'Place 10 or more cooling pipes.', icon: '🔧' },
  // Phase 6 — Multi-Site Expansion achievements
  { id: 'multi_site_unlocked', label: 'Global Ambitions', description: 'Unlock multi-site expansion.', icon: '🌐' },
  { id: 'first_expansion', label: 'First Expansion', description: 'Purchase your first expansion site.', icon: '📍' },
  { id: 'global_network', label: 'Global Network', description: 'Have 3 or more operational sites.', icon: '🗺️' },
  { id: 'three_continents', label: 'Three Continents', description: 'Operate sites on 3 different continents.', icon: '✈️' },
  { id: 'world_domination', label: 'World Domination', description: 'Fill all available site slots.', icon: '👑' },
  // Phase 6B — Inter-Site Networking achievements
  { id: 'first_link', label: 'Connected', description: 'Install your first inter-site network link.', icon: '🔗' },
  { id: 'network_architect', label: 'Network Architect', description: 'Have 3 operational inter-site links simultaneously.', icon: '🕸️' },
  { id: 'dark_fiber', label: 'Dark Fiber', description: 'Install a dark fiber connection between sites.', icon: '🌑' },
  { id: 'submarine_cable', label: 'Submarine Cable', description: 'Lay a submarine cable across continents.', icon: '🌊' },
  { id: 'cdn_revenue', label: 'CDN Revenue', description: 'Earn CDN revenue from an Edge PoP with backhaul.', icon: '📡' },
  // Phase 6C — Regional Incidents & Disaster Preparedness achievements
  { id: 'disaster_survivor', label: 'Disaster Survivor', description: 'Survive a critical regional incident at an expansion site.', icon: '🌪️' },
  { id: 'disaster_prepped', label: 'Disaster Prepped', description: 'Install your first disaster preparedness investment.', icon: '🛡️' },
  { id: 'fully_hardened', label: 'Fully Hardened', description: 'Install all 4 disaster prep types across your sites.', icon: '🏰' },
  { id: 'regional_blocker', label: 'Disaster Deflected', description: 'Block 5 regional incidents with disaster preparedness.', icon: '⛑️' },
  // Phase 6D — Global Strategy Layer achievements
  { id: 'first_multisite_contract', label: 'Global Deal', description: 'Accept your first multi-site contract.', icon: '🤝' },
  { id: 'sovereignty_compliant', label: 'Data Sovereign', description: 'Complete a contract with data sovereignty requirements.', icon: '🏛️' },
  { id: 'staff_transferred', label: 'Staff Mobility', description: 'Complete your first staff transfer between sites.', icon: '🧳' },
  { id: 'demand_surfer', label: 'Demand Surfer', description: 'Have a site in an emerging market with growing demand.', icon: '📈' },
  { id: 'global_empire', label: 'Global Empire', description: 'Have active multi-site contracts generating $300+/tick total.', icon: '🏰' },
  // New Feature achievements
  { id: 'first_workload', label: 'Job Runner', description: 'Complete your first workload job.', icon: '🏋️' },
  { id: 'workload_master', label: 'Workload Master', description: 'Complete 10 workload jobs.', icon: '🎯' },
  { id: 'raised_floor', label: 'Floor Upgrade', description: 'Install an advanced raised floor.', icon: '🏗️' },
  { id: 'nuclear_power', label: 'Nuclear Age', description: 'Unlock the Nuclear (SMR) advanced tier.', icon: '☢️' },
  { id: 'fusion_power', label: 'Fusion Era', description: 'Unlock the Fusion advanced tier.', icon: '⚡' },
  { id: 'row_end_equipped', label: 'End Cap Pro', description: 'Install 4 or more row-end infrastructure slots.', icon: '🔌' },
  { id: 'wide_aisles', label: 'Room to Breathe', description: 'Upgrade 2 or more aisles to wider widths.', icon: '↔️' },
  { id: 'rack_detailed', label: 'Rack Architect', description: 'Configure a cabinet with 42U rack detail.', icon: '🗄️' },
]

// ── Incident System ─────────────────────────────────────────────

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
  // Cooling infrastructure incidents
  { type: 'compressor_failure', label: 'Compressor Failure', severity: 'major', description: 'A cooling unit compressor has seized. Unit offline until repaired.', durationTicks: 14, resolveCost: 10000, effect: 'cooling_failure', effectMagnitude: 0.5 },
  { type: 'refrigerant_leak', label: 'Refrigerant Leak', severity: 'major', description: 'Refrigerant leaking from a cooling unit. Cooling capacity degraded facility-wide.', durationTicks: 16, resolveCost: 8000, effect: 'cooling_failure', effectMagnitude: 0.6 },
  { type: 'chiller_malfunction', label: 'Chiller Plant Malfunction', severity: 'critical', description: 'Central chiller plant offline. Connected cooling units lose efficiency bonus.', durationTicks: 18, resolveCost: 15000, effect: 'chiller_failure', effectMagnitude: 0 },
  { type: 'pipe_burst', label: 'Cooling Pipe Burst', severity: 'minor', description: 'A chilled water pipe has burst. Pipe segment destroyed — must be rebuilt.', durationTicks: 6, resolveCost: 3000, effect: 'pipe_failure', effectMagnitude: 0 },
]

/** Chance per tick of an incident occurring (when fewer than max active) */
export const INCIDENT_CHANCE = 0.02
export const MAX_ACTIVE_INCIDENTS = 3

// ── Scenario System ─────────────────────────────────────────────

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

// ── Tutorial System ─────────────────────────────────────────────

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
  // Cooling Infrastructure tips
  { id: 'cooling_units_hint', title: 'Cooling Units', message: 'Place cooling units near cabinets for targeted heat removal. Different units have different range and capacity — plan your layout!', category: 'cooling' },
  { id: 'cooling_overloaded', title: 'Cooling Overloaded', message: 'A cooling unit is serving more cabinets than its max capacity. Efficiency is degraded — add more units or spread out cabinets.', category: 'cooling' },
  // Phase 6 — Multi-Site Expansion tips
  { id: 'multi_site_unlocked', title: 'Global Expansion', message: 'You\'ve unlocked multi-site expansion! Open the Global Expansion panel to research regions and purchase your first expansion site.', category: 'build' },
  { id: 'site_under_construction', title: 'Site Building', message: 'Your new site is under construction. It will become operational after the build timer completes.', category: 'build' },
  // Phase 6B — Inter-Site Networking tips
  { id: 'first_link_hint', title: 'Inter-Site Links', message: 'Connect your sites with network links! IP Transit is cheapest, Dark Fiber offers the best latency, and Submarine Cables cross continents.', category: 'network' },
  { id: 'edge_pop_backhaul', title: 'Edge PoP Backhaul', message: 'Edge PoPs need a backhaul link to earn CDN revenue. Connect them to HQ or another core site.', category: 'network' },
  // Phase 6C — Regional Incidents & Disaster Preparedness tips
  { id: 'regional_incident_hint', title: 'Regional Disasters', message: 'Expansion sites face region-specific disasters! Earthquakes in Bay Area/Tokyo, monsoons in Singapore/Mumbai, grid instability in Johannesburg. Check disaster risk before building.', category: 'incidents' },
  { id: 'disaster_prep_hint', title: 'Disaster Preparedness', message: 'Invest in disaster preparedness to mitigate regional risks. Seismic reinforcement, flood barriers, and hurricane hardening can significantly reduce damage.', category: 'incidents' },
  // Phase 6D — Global Strategy Layer tips
  { id: 'multisite_contracts_hint', title: 'Multi-Site Contracts', message: 'With sites in multiple regions, you can accept lucrative multi-site contracts! Check the Contracts panel for global deals requiring presence in specific regions.', category: 'contracts' },
  { id: 'sovereignty_hint', title: 'Data Sovereignty', message: 'Some regions have data sovereignty laws (GDPR, LGPD). Contracts requiring local data residency pay premium rates but need a site in the right region.', category: 'contracts' },
  { id: 'staff_transfer_hint', title: 'Staff Transfers', message: 'Transfer staff between sites to fill critical gaps. Cross-continent transfers take longer but let you leverage experienced engineers globally.', category: 'incidents' },
  { id: 'demand_growth_hint', title: 'Market Dynamics', message: 'Regional demand changes over time! Emerging markets grow fast while saturated markets slow down. Expand early into high-growth regions for maximum returns.', category: 'market' },
]
