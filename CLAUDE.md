# CLAUDE.md — AI Assistant Guide for Fabric Tycoon

## Project Overview

**Fabric Tycoon: Data Center Simulator** is a web-based isometric tycoon game where players build and manage a data center. Players place cabinets, install servers and network switches, design a Clos (spine-leaf) network fabric, and balance power, heat, and revenue to scale from a single rack to a global operation.

**Current version:** v0.5.2

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 |
| Game Engine | Phaser 3 (isometric 2D rendering) |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York style) |
| Build Tool | Vite 7 |
| Language | TypeScript 5.9 (strict mode) |
| Icons | lucide-react |
| Linting | ESLint 9 (flat config) |
| Testing | Vitest 4 (jsdom environment) |

## Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # Type-check (tsc -b) then production build (vite build)
npm run lint      # Lint all .ts/.tsx files with ESLint
npm run test      # Run Vitest test suite
npm run preview   # Serve production build locally
```

Linting (`npm run lint`) and tests (`npm run test`) are the primary code quality checks. Always run both before submitting changes.

## Project Structure

```
src/
├── main.tsx                    # React entry point (StrictMode + root render)
├── App.tsx                     # Root component: header bar, speed controls, game loop, achievement toasts
├── index.css                   # Global styles, Tailwind imports, neon color theme
├── components/
│   ├── GameCanvas.tsx          # Phaser <-> React bridge; syncs Zustand state to Phaser scene
│   ├── Sidebar.tsx             # Icon-rail sidebar with 18 slide-out panels
│   ├── HUD.tsx                 # Legacy control panel (build, layers, finance, traffic, equipment)
│   ├── CabinetDetailPanel.tsx  # Floating detail panel for selected cabinet (stats, actions)
│   ├── LayersPopup.tsx         # Layer visibility/opacity/color controls popup
│   ├── StatusBar.tsx           # Bottom footer bar (status, nodes, tick, speed, suite tier, version)
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── tooltip.tsx
│   └── sidebar/                # Individual sidebar panel components
│       ├── BuildPanel.tsx      # Cabinet placement, environment, customer type
│       ├── EquipmentPanel.tsx  # Server/switch upgrades, server configs
│       ├── FinancePanel.tsx    # Revenue, expenses, loans, stock price
│       ├── NetworkPanel.tsx    # Traffic, peering, meet-me rooms, interconnects
│       ├── OperationsPanel.tsx # Power, cooling, generators, maintenance
│       ├── InfrastructurePanel.tsx # PDUs, cable trays, busways, cross-connects
│       ├── ResearchPanel.tsx   # Tech tree, patents
│       ├── ContractsPanel.tsx  # Contracts, RFP bidding, multi-site global contracts
│       ├── IncidentsPanel.tsx  # Active incidents, DR drills, insurance
│       ├── FacilityPanel.tsx   # Suite upgrades, noise, sound barriers, power redundancy
│       ├── CarbonPanel.tsx     # Energy source, carbon tracker, green certs, e-waste
│       ├── SecurityPanel.tsx   # Security tier, features, compliance certs
│       ├── MarketPanel.tsx     # Competitors, market share, bids, events, regional presence
│       ├── CapacityPanel.tsx   # Capacity planning dashboard, trends, projections, alerts
│       ├── ProgressPanel.tsx   # Achievements, reputation, lifetime stats
│       ├── SettingsPanel.tsx   # Save/load, sandbox mode, reset, demo
│       ├── GuidePanel.tsx      # How to play / tutorial (with Phase 4-6 system guides)
│       ├── BuildLogsPanel.tsx  # What's New changelog (version history, player-facing)
│       └── ScenarioPanel.tsx    # Scenario select screen with cards, star ratings, locked progression
├── game/
│   ├── PhaserGame.ts           # Phaser scene: isometric rendering, traffic visualization, placement mode
│   └── CLAUDE.md               # Phaser-specific coding rules (see Sub-module Rules below)
├── stores/
│   ├── gameStore.ts            # Single Zustand store (~6500 lines): game state, actions, tick loop
│   ├── types.ts                # All TypeScript type definitions (~1325 lines)
│   ├── constants.ts            # Simulation constants (SIM, POWER_DRAW, TRAFFIC, etc.)
│   ├── calculations.ts         # Pure calculation functions (calcStats, calcCabinetCooling, etc.)
│   ├── chiller.ts              # Chiller plant connection algorithm (BFS through pipes)
│   ├── configs/
│   │   ├── economy.ts          # Loan, depreciation, power market, insurance, valuation configs
│   │   ├── equipment.ts        # Cooling, server config, PDU, cable tray, aisle configs
│   │   ├── features.ts         # Row-end slots, aisle widths, raised floor, cable mgmt, workloads, advanced tiers, rack equipment, audio
│   │   ├── infrastructure.ts   # Busway, cross-connect, in-row cooling, spacing, zone configs
│   │   ├── progression.ts      # Tech tree, achievements (103), incidents (17), contracts, scenarios, tutorial tips (42)
│   │   └── world.ts            # Staff, supply chain, weather, interconnection, peering, competitors, regions, sites, sovereignty, demand
│   ├── gameStore.test.ts       # Vitest tests for cabinet placement and placement hints
│   ├── __tests__/
│   │   └── gameStore.test.ts   # Vitest tests for Phase 5+ systems (310 tests)
│   └── CLAUDE.md               # Store-specific coding rules (see Sub-module Rules below)
└── lib/
    └── utils.ts                # cn() utility for Tailwind class merging
```

### Key docs in repo root

- `README.md` — Game vision and core mechanics overview
- `SPEC.md` — Technical spec (data models, MVP systems, aesthetic goals)
- `TODO.md` — Feature backlog with completed/pending items
- `BRAINSTORM.md` — 100+ potential features rated by impact/effort

### Configuration files

- `eslint.config.js` — ESLint 9 flat config (tseslint, react-hooks, react-refresh plugins)
- `vitest.config.ts` — Vitest config (jsdom environment, globals enabled, `@/` alias)
- `components.json` — shadcn/ui config (New York style, neutral base, CSS variables, lucide icons)
- `vite.config.ts` — Vite config with `@/` alias, Phaser manual chunk splitting, base path `/data-center-tycoon/`
- `tsconfig.json` — Project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — App TypeScript config (strict, ES2022, bundler resolution, `verbatimModuleSyntax`)

### Claude Code configuration

- `.claude/settings.json` — Hooks: pre-commit code review on `git commit`; ESLint runs after Edit/Write on `.ts/.tsx` files; lint + type-check on session start; post-commit doc staleness check
- `.claude/hooks/pre-commit-review.sh` — Pre-commit code review: analyzes staged changes for security issues (secrets, credentials), convention violations (enum/namespace, debugger, console.log, any types), store-specific checks (immutability, calcStats), and code quality (large changes, TODOs). Blocks commit on critical issues.
- `.claude/hooks/post-commit-doc-check.sh` — Detects commits touching core game files and prints reminders about which docs may need updating
- `.claude/skills/add-feature/SKILL.md` — 9-step feature addition checklist (invoked with `/add-feature`)
- `.claude/skills/add-incident/SKILL.md` — Guided incident type creation (invoked with `/add-incident`)
- `.claude/skills/add-achievement/SKILL.md` — Guided achievement creation (invoked with `/add-achievement`)
- `.claude/skills/add-scenario/SKILL.md` — Guided scenario challenge creation (invoked with `/add-scenario`)
- `.claude/skills/update-build-logs/SKILL.md` — Changelog update checklist (invoked with `/update-build-logs`)
- `.claude/skills/update-docs/SKILL.md` — Combined post-change documentation refresh (invoked with `/update-docs`)
- `.claude/skills/validate-pr-docs/SKILL.md` — Pre-PR documentation validation (invoked with `/validate-pr-docs`)

## Sub-module Rules

The codebase has module-specific `CLAUDE.md` files with focused rules:

- **`src/game/CLAUDE.md`** — Phaser rendering rules: procedural graphics only, isometric coordinate system, `drawIsoCube()` usage, neon color palette, public API pattern (add/update methods), one-way data flow (React → Phaser), dynamic grid handling, monospace text
- **`src/stores/CLAUDE.md`** — Store rules: immutable updates via spread operators, always recalculate after mutations (`calcStats()`/`calcTraffic()`), no `enum`/`namespace`, `import type` for type-only imports, naming conventions, catalog pattern for data-driven features, `tick()` ordering

## Architecture

### State Management — `src/stores/gameStore.ts`

All game state lives in a **single Zustand store** (`useGameStore`). The store (~5600 lines) plus modular config/type files contain:

- **Type definitions** (see Types section below)
- **Simulation constants** (`SIM`): revenue rates, power costs, heat generation/dissipation, temperature thresholds
- **Equipment constants**: `MAX_SERVERS_PER_CABINET` (4), `MAX_CABINETS` (50), `MAX_SPINES` (8), costs, power draw
- **Suite tier configs** (`SUITE_TIERS`): grid dimensions and spine slots per tier
- **Customer type configs** (`CUSTOMER_TYPE_CONFIG`): power/heat/revenue/bandwidth multipliers per customer
- **Infrastructure configs**: PDU options, cable tray options, aisle containment (`AISLE_CONTAINMENT_CONFIG`), busway options, cross-connect options, in-row cooling options
- **Cooling unit configs** (`COOLING_UNIT_CONFIG`): 4 placeable cooling unit types (fan_tray, crac, crah, immersion_pod) with cost, coolingRate, range, maxCabinets, powerDraw, waterUsage, tech requirements
- **Spacing & layout configs** (`SPACING_CONFIG`): adjacency heat penalties, aisle bonuses, airflow bonuses, maintenance access, fire spread mechanics
- **Zone bonus configs** (`ZONE_BONUS_CONFIG`): minimum cluster size (3), environment and customer type bonuses
- **Economy configs**: loan options, depreciation, power market parameters, insurance options, valuation milestones
- **Progression configs**: tech tree (9 techs), contracts (9 base + 4 compliance-gated + zone contracts), achievements (89), incidents (17 types), scenarios (5)
- **Staff configs** (`STAFF_ROLE_CONFIG`, `STAFF_CERT_CONFIG`, `SHIFT_PATTERN_CONFIG`): roles, certifications, shift costs
- **Supply chain configs** (`SUPPLY_CHAIN_CONFIG`): lead times, bulk discounts, shortage mechanics
- **Weather configs** (`SEASON_CONFIG`, `WEATHER_CONDITION_CONFIG`): seasonal/weather ambient modifiers
- **Interconnection configs** (`MEETME_ROOM_CONFIG`, `INTERCONNECT_PORT_CONFIG`): meet-me room tiers, port types
- **Server configuration options** (`SERVER_CONFIG_OPTIONS`): 5 server types with cost/power/heat/revenue multipliers
- **Peering options** (`PEERING_OPTIONS`): 4 transit/peering agreement types
- **Maintenance configs** (`MAINTENANCE_CONFIG`): preventive maintenance for 4 target types
- **Power redundancy configs** (`POWER_REDUNDANCY_CONFIG`): N, N+1, 2N levels
- **Noise configs** (`NOISE_CONFIG`): noise generation, complaints, fines, sound barriers
- **Spot compute configs** (`SPOT_COMPUTE_CONFIG`): dynamic spot market pricing
- **Tutorial tips** (`TUTORIAL_TIPS`): 34 contextual gameplay tips (including carbon, security, market, operations, cooling, and infrastructure tips)
- **Energy source configs** (`ENERGY_SOURCE_CONFIG`): 4 energy sources with cost/carbon/reliability
- **Green cert configs** (`GREEN_CERT_CONFIG`): 4 green certifications with requirements and bonuses
- **Carbon tax schedule** (`CARBON_TAX_SCHEDULE`): escalating carbon tax brackets
- **Security tier configs** (`SECURITY_TIER_CONFIG`): 4 security tiers with costs and included features
- **Security feature configs** (`SECURITY_FEATURE_CONFIG`): 7 security features with defense bonuses
- **Compliance cert configs** (`COMPLIANCE_CERT_CONFIG`): 5 compliance certifications with audit mechanics
- **Competitor configs** (`COMPETITOR_PERSONALITIES`): 5 AI competitor personality profiles
- **Operations Progression configs** (`OPS_TIER_CONFIG`): 4 ops tiers with unlock requirements, benefits, and upgrade costs
- **Row-end slot configs** (`ROW_END_SLOT_CONFIG`): 4 row-end infrastructure types with costs and effects
- **Aisle width configs** (`AISLE_WIDTH_CONFIG`): 3 width options with maintenance/cooling bonuses
- **Raised floor configs** (`RAISED_FLOOR_CONFIG`): 3 tiers with cooling distribution bonuses
- **Cable management configs** (`CABLE_MANAGEMENT_CONFIG`): 3 types with cable mess reduction
- **Workload configs** (`WORKLOAD_CONFIG`): 5 workload types with duration, payout, heat multiplier
- **Advanced tier configs** (`ADVANCED_TIER_CONFIG`): Nuclear and Fusion late-game tiers
- **Rack equipment configs** (`RACK_EQUIPMENT_CONFIG`): 8 equipment types for 42U rack model
- **Chiller plant configs** (`CHILLER_PLANT_CONFIG`): 2 tiers (basic/advanced) with range and efficiency
- **Region catalog** (`REGION_CATALOG`): 15 global regions with profiles (power cost, labor, climate, demand, disasters)
- **Site type configs** (`SITE_TYPE_CONFIG`): 6 site types (HQ, edge_pop, colocation, hyperscale, network_hub, disaster_recovery)
- **Inter-site link configs** (`INTER_SITE_LINK_CONFIG`): 4 link types with bandwidth, latency, cost, reliability
- **Disaster prep configs** (`DISASTER_PREP_CONFIG`): 4 disaster preparedness types with mitigation factors
- **Regional incident catalog** (`REGIONAL_INCIDENT_CATALOG`): 13 regional incident types with affected regions and risks
- **Data sovereignty configs** (`DATA_SOVEREIGNTY_CONFIG`): 3 sovereignty regimes (GDPR, LGPD, PDPA) with revenue bonuses
- **Multi-site contract catalog** (`MULTI_SITE_CONTRACT_CATALOG`): 6 global contracts requiring multi-region presence
- **Staff transfer configs** (`STAFF_TRANSFER_CONFIG`): Cross-site/cross-continent transfer mechanics
- **Demand growth configs** (`DEMAND_GROWTH_CONFIG`): Emerging/stable/saturated market dynamics
- **Competitor regional configs** (`COMPETITOR_REGIONAL_CONFIG`): Competitor expansion into regions
- **Traffic constants** (`TRAFFIC`): bandwidth per server, link capacity
- **Pure calculation functions**: `calcStats()`, `calcTraffic()`, `calcTrafficWithCapacity()`, `coolingOverheadFactor()`, `calcManagementBonus()`, `calcAisleBonus()`, `calcCabinetCooling()`, `getPlacementHints()`, and more
- **Store actions**: build, power, visual, simulation, finance, infrastructure, incidents, contracts, research, staff, supply chain, interconnection, peering, maintenance, operations progression, multi-site expansion, save/load, and more

**Pattern for accessing state in components:**
```typescript
// Selective subscription (standard pattern used throughout)
const { cabinets, money, addCabinet } = useGameStore()

// Outside React (e.g., in Phaser sync)
useGameStore.getState().addCabinet()
```

State updates create new arrays/objects (immutable). After mutations, dependent stats are recalculated via `calcStats()`.

#### Types

Core types:
- `NodeType` = `'server' | 'leaf_switch' | 'spine_switch'`
- `GameSpeed` = `0 | 1 | 2 | 3`
- `CabinetEnvironment` = `'production' | 'lab' | 'management'`
- `CoolingType` = `'air' | 'water'`
- `CoolingUnitType` = `'fan_tray' | 'crac' | 'crah' | 'immersion_pod'`
- `CustomerType` = `'general' | 'ai_training' | 'streaming' | 'crypto' | 'enterprise'`
- `CabinetFacing` = `'north' | 'south' | 'east' | 'west'` (only N/S used by row-enforced layout)
- `SuiteTier` = `'starter' | 'standard' | 'professional' | 'enterprise'`

Progression types:
- `TechBranch` = `'efficiency' | 'performance' | 'resilience'`
- `ReputationTier` = `'unknown' | 'poor' | 'average' | 'good' | 'excellent' | 'legendary'`
- `ContractTier` = `'bronze' | 'silver' | 'gold'`
- `IncidentSeverity` = `'minor' | 'major' | 'critical'`
- `GeneratorStatus` = `'standby' | 'running' | 'cooldown'`
- `SuppressionType` = `'none' | 'water_suppression' | 'gas_suppression'`

Staff & HR types:
- `StaffRole` = `'network_engineer' | 'electrician' | 'cooling_specialist' | 'security_officer'`
- `StaffSkillLevel` = `1 | 2 | 3`
- `ShiftPattern` = `'day_only' | 'day_night' | 'round_the_clock'`
- `StaffMember`, `StaffTraining` interfaces

Supply chain & procurement types:
- `OrderStatus` = `'pending' | 'in_transit' | 'delivered'`
- `HardwareOrder`, `SupplyChainConfig` interfaces

Weather types:
- `Season` = `'spring' | 'summer' | 'autumn' | 'winter'`
- `WeatherCondition` = `'clear' | 'cloudy' | 'rain' | 'storm' | 'heatwave' | 'cold_snap'`

Interconnection types:
- `InterconnectPortType` = `'copper_1g' | 'fiber_10g' | 'fiber_100g'`
- `InterconnectPort`, `MeetMeRoomConfig` interfaces

Server configuration types:
- `ServerConfig` = `'balanced' | 'cpu_optimized' | 'gpu_accelerated' | 'storage_dense' | 'memory_optimized'`

Network peering types:
- `PeeringType` = `'budget_transit' | 'premium_transit' | 'public_peering' | 'private_peering'`
- `PeeringAgreement`, `PeeringConfig` interfaces

Maintenance types:
- `MaintenanceTargetType` = `'cabinet' | 'spine' | 'cooling' | 'power'`
- `MaintenanceStatus` = `'scheduled' | 'in_progress' | 'completed'`
- `MaintenanceWindow` interface

Carbon & environmental types:
- `EnergySource` = `'grid_mixed' | 'grid_green' | 'onsite_solar' | 'onsite_wind'`
- `GreenCert` = `'energy_star' | 'leed_silver' | 'leed_gold' | 'carbon_neutral'`
- `EnergySourceConfig`, `GreenCertConfig` interfaces

Security & compliance types:
- `SecurityTier` = `'basic' | 'enhanced' | 'high_security' | 'maximum'`
- `SecurityFeatureId` = `'cctv' | 'badge_access' | 'biometric' | 'mantrap' | 'cage_isolation' | 'encrypted_network' | 'security_noc'`
- `ComplianceCertId` = `'soc2_type1' | 'soc2_type2' | 'hipaa' | 'pci_dss' | 'fedramp'`
- `ActiveComplianceCert`, `SecurityFeatureConfig`, `SecurityTierConfig`, `ComplianceCertConfig` interfaces

Competitor AI types:
- `CompetitorPersonality` = `'budget' | 'premium' | 'green' | 'aggressive' | 'steady'`

Operations Progression types:
- `OpsTier` = `'manual' | 'monitoring' | 'automation' | 'orchestration'`
- `OpsTierConfig` interface: unlock requirements (minStaff, requiredTechs, minReputation, minSuiteTier), benefits (incidentSpawnReduction, autoResolveSpeedBonus, revenuePenaltyReduction, staffEffectivenessBonus, resolveCostReduction), upgradeCost
- `Competitor`, `CompetitorBid` interfaces

Multi-site expansion types:
- `RegionId` = 15 region IDs (ashburn, bay_area, dallas, chicago, portland, sao_paulo, london, amsterdam, frankfurt, nordics, singapore, tokyo, mumbai, dubai, johannesburg)
- `Continent` = `'north_america' | 'south_america' | 'europe' | 'asia_pacific' | 'middle_east_africa'`
- `SiteType` = `'headquarters' | 'edge_pop' | 'colocation' | 'hyperscale' | 'network_hub' | 'disaster_recovery'`
- `Region` — id, name, continent, coordinates, profile (power/labor/cooling/connectivity), demandProfile, disasterProfile
- `Site` — id, name, type, regionId, constructionTicksRemaining, operational, cabinets/servers/revenue/expenses, suiteTier, snapshot
- `SiteSnapshot` — full per-site state preservation (cabinets, spines, PDUs, cooling, infrastructure)
- `InterSiteLinkType` = `'ip_transit' | 'leased_wavelength' | 'dark_fiber' | 'submarine_cable'`
- `InterSiteLink` — network link between sites with bandwidth, latency, cost, utilization, reliability
- `DisasterPrepType` = `'seismic_reinforcement' | 'flood_barriers' | 'hurricane_hardening' | 'elevated_equipment'`
- `RegionalIncidentType` — 12 regional incident types (earthquake, wildfire, hurricane, etc.)
- `RegionalIncidentDef`, `SiteDisasterPrep` interfaces

Global strategy types:
- `DemandTrend` = `'emerging' | 'stable' | 'saturated'`
- `SovereigntyRegime` = `'gdpr' | 'lgpd' | 'pdpa' | 'none'`
- `DataSovereigntyRule` — sovereignty regime with applicable regions, revenue bonus, non-compliance penalty
- `MultiSiteContractDef` — global contracts requiring multi-region presence with sovereignty requirements
- `ActiveMultiSiteContract` — active contract tracking with violations, earnings, status
- `StaffTransfer` — staff relocation between sites with travel time and cost
- `StaffTransferConfig` — base cost, travel times, skill level cost multiplier
- `CompetitorRegionalPresence` — competitor presence in regions with strength tracking

Power & insurance types:
- `PowerRedundancy` = `'N' | 'N+1' | '2N'`
- `InsurancePolicyType` = `'fire_insurance' | 'power_insurance' | 'cyber_insurance' | 'equipment_insurance'`

Infrastructure entity types:
- `CoolingUnit` — id, type (CoolingUnitType), col, row, operational
- `CoolingUnitConfig` — type, label, cost, coolingRate, range, maxCabinets, powerDraw, waterUsage, requiresTech
- `ChillerPlant` — id, col, row, tier (ChillerTier), operational
- `CoolingPipe` — id, col, row
- `Busway`, `CrossConnect`, `InRowCooling` interfaces

View & rendering types:
- `ViewMode` = `'cabinet' | 'above_cabinet' | 'sub_floor'`

Infrastructure upgrade types:
- `RowEndSlotType` = `'pdu_slot' | 'cooling_slot' | 'fire_panel' | 'network_patch'`
- `AisleWidthType` = `'standard' | 'wide' | 'extra_wide'`
- `RaisedFloorTier` = `'none' | 'basic' | 'advanced'`
- `CableManagementType` = `'none' | 'overhead' | 'underfloor'`

Workload types:
- `WorkloadType` = `'ai_training' | 'batch_processing' | 'live_migration' | 'rendering' | 'database_migration'`
- `Workload` — id, type, cabinetId, progress, durationTicks, basePayout, status

Advanced tier types:
- `AdvancedTier` = `'nuclear' | 'fusion'`
- `AdvancedTierConfig` — tier, label, cost, maxCabinets, coolingBonus, carbonMultiplier, requiresTier

42U rack types:
- `RackEquipmentType` = `'1u_server' | '2u_server' | '4u_storage' | '1u_switch' | '2u_patch_panel' | '1u_pdu' | '3u_ups' | '2u_cable_mgmt'`
- `RackSlot` — u position, equipment type, equipment label

Audio types:
- `AudioSettings` — masterVolume, sfxVolume, ambientVolume, muted

Event & analytics types:
- `EventCategory` = `'incident' | 'finance' | 'contract' | 'achievement' | 'infrastructure' | 'staff' | 'research' | 'system'`
- `EventSeverity` = `'info' | 'warning' | 'error' | 'success'`
- `EventLogEntry`, `HistoryPoint`, `LifetimeStats` interfaces

Other types:
- `ScenarioDef`, `ScenarioObjective` — challenge scenarios
- `DrillResult`, `Patent`, `RFPOffer` — DR drills, patents, RFP bidding
- `ValuationMilestone` — stock price milestones
- `TutorialTip`, `SaveSlotMeta` — tutorial system, save slots

Key interfaces (core):
- `Cabinet` — grid position (col/row), environment, customerType, serverCount, hasLeafSwitch, powerStatus, heatLevel, serverAge, facing
- `SpineSwitch` — id, powerStatus
- `TrafficLink` — leafCabinetId, spineId, bandwidthGbps, capacityGbps, utilization, redirected
- `TrafficStats` — totalFlows, totalBandwidthGbps, totalCapacityGbps, redirectedFlows, links, spineUtilization
- `PDU`, `CableTray`, `CableRun` — infrastructure types
- `Loan`, `Generator`, `ActiveIncident`, `ActiveContract`, `Achievement`, `ActiveResearch`
- `LayerVisibility`, `LayerOpacity`, `LayerColorOverrides`

#### Store Actions

| Category | Actions |
|----------|---------|
| Build | `addCabinet`, `enterPlacementMode`, `exitPlacementMode`, `upgradeNextCabinet`, `addLeafToNextCabinet`, `addSpineSwitch` |
| Power | `toggleCabinetPower`, `toggleSpinePower` |
| Visual | `toggleLayerVisibility`, `setLayerOpacity`, `setLayerColor`, `toggleTrafficVisible`, `toggleHeatMap` |
| Simulation | `setGameSpeed`, `upgradeCooling`, `tick` |
| Finance | `takeLoan`, `refreshServers`, `upgradeSuite` |
| Infrastructure | `placePDU`, `placeCableTray`, `autoRouteCables`, `toggleCabinetFacing`, `installAisleContainment`, `placeBusway`, `placeCrossConnect`, `placeInRowCooling` |
| Cooling Units | `placeCoolingUnit`, `removeCoolingUnit`, `placeChillerPlant`, `removeChillerPlant`, `placeCoolingPipe`, `removeCoolingPipe` |
| Incidents | `resolveIncident`, `buyGenerator`, `activateGenerator`, `upgradeSuppression` |
| Operations Progression | `upgradeOpsTier` |
| Contracts | `acceptContract` |
| Research | `startResearch` |
| Staff | `hireStaff`, `fireStaff`, `setShiftPattern`, `startTraining` |
| Supply Chain | `placeOrder` |
| Interconnection | `installMeetMeRoom`, `addInterconnectPort` |
| Server Config | `setDefaultServerConfig` |
| Peering | `addPeeringAgreement`, `removePeeringAgreement` |
| Maintenance | `scheduleMaintenance` |
| Power Redundancy | `upgradePowerRedundancy` |
| Noise | `installSoundBarrier` |
| Spot Compute | `setSpotCapacity` |
| Insurance | `buyInsurance`, `cancelInsurance` |
| DR Drills | `runDrill` |
| Patents | `patentTech` |
| RFP Bidding | `bidOnRFP` |
| Scenarios | `startScenario`, `abandonScenario` |
| Carbon/Environment | `setEnergySource`, `applyForGreenCert`, `disposeEWaste` |
| Security/Compliance | `upgradeSecurityTier`, `startComplianceAudit` |
| Operations | `upgradeOpsTier` |
| Competitor AI | `counterPoachOffer` |
| Multi-Site Expansion | `toggleWorldMap`, `researchRegion`, `purchaseSite`, `switchSite`, `installInterSiteLink`, `installDisasterPrep` |
| Global Strategy | `acceptMultiSiteContract`, `transferStaff`, `cancelStaffTransfer` |
| Tutorial | `dismissTip`, `toggleTutorial` |
| Save/Load | `saveGame`, `loadGame`, `deleteGame`, `resetGame`, `refreshSaveSlots` |
| Workloads | `launchWorkload`, `migrateWorkload` |
| Row-End Slots | `installRowEndSlot` |
| Aisle Widths | `upgradeAisleWidth` |
| Raised Floor | `upgradeRaisedFloor` |
| Cable Management | `upgradeCableManagement` |
| Advanced Tiers | `unlockAdvancedTier` |
| 42U Rack | `installRackEquipment`, `removeRackEquipment` |
| View Mode | `setViewMode` |
| Audio | `updateAudioSettings` |
| Leaderboard | `submitLeaderboardEntry` |
| Sandbox/Demo | `toggleSandboxMode`, `loadDemoState`, `exitDemo` |
| Misc | `dismissAchievement`, `selectCabinet` |

#### Exported Functions

- `getPlacementHints(col, row, cabinets, suiteTier)` — contextual placement strategy hints during cabinet placement (includes row info, aisle/corridor detection, zone adjacency hints)
- `calcTrafficWithCapacity(cabinets, spines, demandMultiplier, linkCapacity)` — traffic calculation with custom link capacity
- `calcCabinetCooling(cab, coolingUnits, allCabinets)` — per-cabinet cooling from nearby cooling units with capacity degradation
- `calcAisleBonus(cabinets, suiteTier, aisleContainments)` — hot/cold aisle cooling bonus from layout pairs + containment
- `calcZones(cabinets)` — detects zone adjacency clusters (environment + customer type)
- `getAdjacentCabinets(cab, cabinets)` — orthogonal neighbors for spacing calculations
- `hasMaintenanceAccess(cab, cabinets, cols, rows)` — checks if cabinet has at least one empty adjacent tile
- `calcSpacingHeatEffect(cab, cabinets)` — heat penalty from adjacent cabinets + airflow bonuses
- `getFacingOffsets(facing, col, row)` — front/rear tile positions based on cabinet facing
- `generateLayout(numRows, cols)` — generates row-based data center layout for a given tier

### Phaser Rendering — `src/game/PhaserGame.ts`

The `DataCenterScene` class handles all isometric graphics using Phaser's Graphics API (no image assets — everything is procedurally drawn).

**Module-level exports:**
- `createGame(parent: string): Phaser.Game` — creates and returns Phaser game instance
- `getScene(game: Phaser.Game): DataCenterScene | undefined` — retrieves scene from game

**Grid layout (dynamic, row-based, suite tier dependent):**
- Each tier has a pre-built layout generated by `generateLayout(numRows, cols)`:
  - **Cabinet rows**: Designated rows where cabinets can be placed. Facing (N/S) is enforced by the row.
  - **Aisles**: Physical cold aisles between cabinet row pairs. Can be upgraded with containment.
  - **Corridors**: Top and bottom access corridors. No cabinet placement.
- Tile dimensions: TILE_W=64, TILE_H=32
- Spine switches: horizontal row above the cabinet grid (2–8 slots by tier)

**Row-based layout pattern** (starter tier example with 2 cabinet rows):
```
gridRow 0: Corridor (top access)
gridRow 1: Cabinet Row 0 (facing south ▼)
gridRow 2: Cold Aisle 0
gridRow 3: Cabinet Row 1 (facing north ▲)
gridRow 4: Corridor (bottom access)
```

**Suite tier grid dimensions:**
| Tier | Cols | Cabinet Rows | Total Grid Rows | Max Cabinets | Spine Slots |
|------|------|-------------|-----------------|-------------|-------------|
| Starter | 5 | 2 | 5 | 8 | 2 |
| Standard | 8 | 3 | 7 | 18 | 4 |
| Professional | 10 | 4 | 9 | 32 | 6 |
| Enterprise | 14 | 5 | 11 | 50 | 8 |

**Layout types:**
- `DataCenterRow` — `{ id, gridRow, facing, slots }` — a cabinet row
- `Aisle` — `{ id, gridRow, type, betweenRows }` — aisle between two cabinet rows
- `DataCenterLayout` — `{ cabinetRows, aisles, totalGridRows, corridorTop, corridorBottom }`

**Rendering pipeline per cabinet:** base frame → server layers (stacked) → leaf switch on top → LED indicators → ID label

**Color convention:**
- Servers: green (`0x00ff88`)
- Leaf switches: cyan (`0x00aaff`)
- Spine switches: orange (`0xff6644`)

**Traffic visualization:** Lines between leaf-spine pairs colored by utilization (green → yellow → red), with animated packet dots.

**Placement mode:** Interactive tile highlighting, hover hints, and click-to-place functionality for cabinets, PDUs, and cable trays.

**Public API methods:**
- `addCabinetToScene(id, col, row, serverCount, hasLeafSwitch, environment, facing)`
- `updateCabinet(id, serverCount, hasLeafSwitch, powerOn, environment, facing)`
- `addSpineToScene(id)` / `updateSpine(id, powerOn)`
- `setLayerVisibility(visibility)` / `setLayerOpacity(opacity)` / `setLayerColors(colors)`
- `setTrafficLinks(links)` / `setTrafficVisible(visible)`
- `setGridSize(cols, rows, spineSlots)` — rebuilds layout on suite upgrade
- `setPlacementMode(active)` — enter/exit interactive placement
- `setOnTileClick(callback)` / `setOnTileHover(callback)` — placement callbacks
- `syncOccupiedTiles(occupied)` — mark blocked positions
- `addPDUToScene(id, col, row, label, overloaded)` / `updatePDU(id, overloaded)`
- `addCableTrayToScene(id, col, row)`
- `addCoolingUnitToScene(id, col, row, type, operational)` / `updateCoolingUnit(id, operational)` / `removeCoolingUnitFromScene(id)` / `clearCoolingUnits()`
- `clearInfrastructure()` — clears PDUs, cable trays, and cooling units
- `syncWorkers(staffList)` — sync staff to animated worker sprites
- `dispatchWorkerToIncident(col, row)` — send nearest idle worker to incident
- `setWeatherCondition(weather, season, gameHour)` — set weather/day-night state
- `spawnFireParticles(col, row)` / `spawnSparkParticles(col, row)` / `spawnCoolMist(col, row)` / `spawnHeatShimmer(col, row)` / `spawnRefreshSparkle(col, row)` — particle effects
- `spawnIncidentPulse(col, row)` / `spawnAchievementShower()` — event particles
- `playRemovalEffect(col, row)` — equipment removal animation

### UI Architecture

The UI uses a **sidebar-driven navigation pattern**:

- **`Sidebar.tsx`** renders an icon rail on the left with 18 panel icons organized into top/middle/bottom sections. Clicking an icon slides out the corresponding panel.
- **`sidebar/*.tsx`** — Each panel is a separate component: `BuildPanel`, `EquipmentPanel`, `FinancePanel`, `NetworkPanel`, `OperationsPanel`, `InfrastructurePanel`, `ResearchPanel`, `ContractsPanel`, `IncidentsPanel`, `FacilityPanel`, `CarbonPanel`, `SecurityPanel`, `MarketPanel`, `CapacityPanel`, `ProgressPanel`, `SettingsPanel`, `GuidePanel`, `BuildLogsPanel`
- **`CabinetDetailPanel.tsx`** — Floating detail panel shown when a cabinet is selected; displays hardware slots, real-time stats (power, temp, revenue, age, traffic), and actions (power toggle, flip facing, refresh servers)
- **`LayersPopup.tsx`** — Layer controls popup for toggling visibility, opacity, and custom colors per network layer
- **`HUD.tsx`** — Legacy monolithic control panel (still present, ~2940 lines)
- **`ScenarioPanel.tsx`** — Scenario select screen with cards, star ratings, locked progression, and victory/defeat results

### React-Phaser Bridge — `src/components/GameCanvas.tsx`

`GameCanvas` manages the Phaser game instance lifecycle and syncs Zustand state changes to the Phaser scene via `useEffect` hooks. It tracks previous counts via `useRef` to only add new objects, not re-create existing ones.

**Sync effects (16 total):**
1. Initialize/destroy Phaser game on mount
2. Register tile click/hover callbacks for placement
3. Sync placement mode to Phaser
4. Sync suite tier (grid dimensions) on upgrade
5. Sync cabinets (add new, update existing, sync occupied tiles)
6. Sync spine switches (add new, update power status)
7. Sync layer visibility/opacity/colors
8. Sync traffic data
9. Sync PDUs and cable trays
10. Sync traffic visibility
11. Sync worker sprites from staff state
12. Dispatch workers to active incidents
13. Sync weather/day-night conditions
14. Spawn particle effects for fires, throttling, PDU overloads, cooling
15. Spawn achievement gold shower particles

### Game Tick Loop — `src/App.tsx`

A `setInterval` in `App.tsx` calls `tick()` at the rate determined by `gameSpeed` (0=paused, 1=1000ms, 2=500ms, 3=250ms). The `tick()` function processes these systems per tick:

1. **Time-of-day**: Advances `gameHour` (0–23), applies demand curve and random traffic spikes
2. **Weather**: Season rotation, weather condition changes, ambient temperature modifiers
3. **Supply chain**: Ticks pending orders, delivery processing, supply shortage events
4. **Incidents & Ops Tier**: Spawns random incidents (17 types, reduced by ops tier), ticks active incidents, applies effects (revenue penalties reduced by ops tier), ops tier auto-resolve bonus, prevented incident tracking
5. **Tech tree**: Ticks active research progress
6. **Power market**: Updates spot pricing with random walk, mean reversion, and price spikes
7. **Generators**: Manages fuel consumption, startup/cooldown, auto-activation during outages
8. **Fire system**: Triggers fires at critical temps (95°C), applies suppression logic
9. **Heat**: Generates heat per server (+1.5°C), cools via system (-2.0 to -3.5°C), affected by environment/customer type/incidents/aisle violations/PDU overloads/weather
10. **Revenue**: $12/tick per server, modified by throttling, environment, customer type, depreciation, tech bonuses, outage/incident penalties, meet-me room income, patent royalties, spot compute revenue
11. **Expenses**: Power costs with market pricing, cooling costs, loan repayments, staff salaries, peering costs, insurance premiums, maintenance costs, power redundancy overhead
12. **Noise**: Calculates noise level, tracks complaints, applies fines if over threshold, zoning restrictions
13. **Spot compute**: Updates spot market price, calculates spot revenue based on allocated capacity
14. **Staff**: Processes fatigue, training, shift coverage, incident auto-resolution
15. **Maintenance**: Ticks scheduled maintenance windows, applies benefits on completion
16. **Infrastructure**: Checks aisle bonuses, cable mess penalties, PDU overloads
17. **Contracts**: Checks SLA compliance, termination/completion logic
18. **Reputation**: Adjusts score based on SLAs, outages, fires, violations
19. **Depreciation**: Ages servers, reduces efficiency after 30% of 800-tick lifespan
20. **Achievements**: Checks 89 achievement conditions
21. **Traffic**: ECMP distribution across active spines
22. **Capacity history**: Records snapshot of current stats each tick (capped at 100 entries)
23. **Lifetime stats**: Updates running totals (revenue, expenses, peak temp, uptime streaks, etc.)
24. **Event logging**: Records significant events (capped at 200 entries)
25. **Tutorial**: Triggers contextual tips based on game state
26. **Carbon/Environment**: Calculates emissions, carbon tax, water usage, e-waste penalties, green cert eligibility
27. **Security/Compliance**: Processes audits, expires certifications, blocks intrusion incidents, calculates security maintenance
28. **Competitor AI**: Spawns/grows competitors, processes bids, price wars, staff poaching, market share calculation
29. **Multi-site expansion**: Ticks site construction, inter-site link reliability, regional incidents, edge PoP CDN revenue, disaster prep maintenance
30. **Global strategy**: Demand growth per region (emerging/stable/saturated), multi-site contract compliance and revenue, staff transfers, competitor regional expansion

## Game Systems

### Core Systems

**Progression:** Players upgrade through **suite tiers** (starter → standard → professional → enterprise), unlocking larger grids and more spine slots. **Reputation** (unknown → legendary) gates access to higher-tier contracts. The **tech tree** has 3 branches (efficiency, performance, resilience) with 3 techs each.

**Economy:**
- **Revenue** from servers, modified by customer type, environment, throttling, depreciation, and tech bonuses
- **Additional revenue**: meet-me room interconnects, patent royalties, spot compute market, RFP contract wins, multi-site contract income, edge PoP CDN revenue
- **Expenses** from power (dynamic market pricing), cooling, loan repayments, staff salaries, peering costs, insurance premiums, maintenance, power redundancy overhead, noise fines
- **Loans** available in 3 tiers with different amounts/interest/terms
- **Contracts** (bronze/silver/gold) provide bonus revenue with SLA requirements
- **Power market** fluctuates with random walk, mean reversion, and spike events
- **Stock price** tracked with valuation milestones

**Infrastructure:**
- **Cabinet environments**: production (baseline), lab (low revenue, low heat), management (3% bonus per server, capped at 30%)
- **Customer types**: general, ai_training, streaming, crypto, enterprise — each with power/heat/revenue/bandwidth multipliers
- **Cooling**: facility-wide air (2.0°C/tick, free) or water (3.5°C/tick, $25,000 upgrade), plus placeable cooling units (fan trays, CRACs, CRAHs, immersion pods) with per-cabinet coverage zones and capacity degradation
- **PDUs**: Power distribution units with capacity limits; overloaded PDUs cause heat and revenue penalties
- **Cable trays**: Organized cabling reduces messy cable penalties
- **Hot/cold aisles**: Row-based layout enforces alternating N/S facing with physical aisles between row pairs. Aisle containment upgrade ($15k/aisle, Standard+ tier) adds +6% cooling per aisle.
- **Zone adjacency bonus**: 3+ adjacent same-type cabinets form zones with revenue/heat bonuses
- **Spacing physics**: Adjacent cabinets create heat penalties (+0.3°C/tick per neighbor); open front/rear faces provide airflow bonuses
- **Busways**: Power distribution infrastructure with capacity options
- **Cross-connects**: Direct physical connections between equipment
- **Server depreciation**: Efficiency decays over time, refreshable for a cost
- **Server configurations**: 5 types (balanced, cpu_optimized, gpu_accelerated, storage_dense, memory_optimized) with different cost/power/heat/revenue profiles

### Advanced Systems

**Operations Progression:**
- 4 ops tiers: manual → monitoring → automation → orchestration
- Each tier requires minimum staff count, researched technologies, reputation level, and suite tier
- Benefits scale per tier: incident spawn reduction (0–40%), auto-resolve speed bonus (0–40%), revenue penalty reduction (0–30%), staff effectiveness bonus (0–30%), resolve cost reduction (0–50%)
- Upgrade costs: $0 / $15,000 / $50,000 / $120,000
- 4 dedicated achievements: Script Kiddie, SRE, Platform Engineer, Lights Out
- Tracked stats: `opsAutoResolvedCount`, `opsPreventedCount`

**Staff & HR:**
- 4 roles: network_engineer, electrician, cooling_specialist, security_officer
- 3 skill levels per role, training/certification system
- Shift patterns (day_only, day_night, round_the_clock) with cost implications
- Staff fatigue and burnout tracking
- Auto-resolution of incidents by qualified staff

**Supply Chain & Procurement:**
- Hardware orders with lead times and bulk discounts
- Supply shortage events with price multipliers and extended lead times
- Inventory management (server, leaf_switch, spine_switch, cabinet)

**Weather System:**
- 4 seasons (spring → summer → autumn → winter) with cyclical rotation
- 6 weather conditions (clear, cloudy, rain, storm, heatwave, cold_snap)
- Ambient temperature modifiers affecting cooling requirements

**Interconnection / Meet-Me Rooms:**
- Install meet-me rooms (3 tiers) with port capacity limits
- 3 interconnect port types (copper_1g, fiber_10g, fiber_100g) generating passive revenue
- Requires Standard suite tier or higher

**Network Peering & Transit:**
- 4 agreement types: budget_transit, premium_transit, public_peering, private_peering
- Each with bandwidth, latency, and cost-per-tick trade-offs
- Maximum 4 concurrent agreements

**Maintenance Windows:**
- Schedule preventive maintenance on cabinets, spines, cooling, or power systems
- Each type has configurable duration and cost
- Maximum 3 concurrent maintenance windows
- Provides cooling/reliability benefits on completion

**Power Redundancy:**
- 3 levels: N (none), N+1, 2N
- Higher levels provide power resilience at increased cost
- Upgrade path: N → N+1 → 2N (no downgrades)

**Noise & Community Relations:**
- Noise generated by server/cooling activity
- Noise complaints escalate to fines if threshold exceeded
- Sound barriers reduce noise (configurable max count)
- Zoning restrictions can be triggered by persistent violations

**Spot Compute Market:**
- Allocate spare server capacity to a dynamic spot market
- Price fluctuates with mean reversion and volatility
- Revenue based on allocated capacity × current spot price

**Incidents & Resilience:**
- **17 incident types** with minor/major/critical severity
- **Generators**: 3 options (Small Diesel, Large Diesel, Natural Gas) with fuel management
- **Fire suppression**: none, water (cheap, some damage), gas (expensive, minimal damage)
- **Fires** trigger at critical temperature (95°C)
- **Insurance**: 4 policy types (fire, power, cyber, equipment)
- **DR Drills**: Test disaster readiness, affects reputation

**Carbon & Environmental:**
- **4 energy sources**: grid_mixed (default), grid_green, onsite_solar, onsite_wind with cost/carbon trade-offs
- **Carbon tax** escalates over game time ($0/$2/$5/$10 per ton)
- **Green certifications**: Energy Star, LEED Silver, LEED Gold, Carbon Neutral — grant revenue bonuses (+10% to +40%)
- **Water usage**: Water cooling consumes 2 gal/tick per cabinet at $0.10/gal
- **E-waste**: Server refreshes create e-waste; stockpile >10 items causes reputation penalty
- **Drought incident**: Triples water costs when active

**Security & Compliance:**
- **4 security tiers**: basic → enhanced → high_security → maximum with escalating costs
- **7 security features**: badge_access, CCTV, biometric, mantrap, cage_isolation, encrypted_network, security_noc
- **5 compliance certs**: SOC 2 Type I/II, HIPAA, PCI-DSS, FedRAMP with audit mechanics
- **Intrusion incidents**: tailgating, social_engineering, break_in — blocked by security features
- **4 premium contracts** gated by compliance (HealthNet EMR, TradeFast HFT, GovSecure Cloud, PayStream)

**Competitor AI:**
- **5 personalities**: budget, premium, green, aggressive, steady with different growth/bidding behavior
- **Scaling**: 1 competitor at tick 100, up to 3 by tick 600; rubber-banding adjusts growth rate
- **Contract competition**: Competitors bid on open contracts with timed windows; accept before they win
- **Events**: Price wars (15% revenue reduction), staff poaching (counter-offer or lose), competitor outages
- **Market share**: Tracked as player vs competitor strength ratio

**Multi-Site Expansion:**
- **15 regions** across 5 continents (North America, South America, Europe, Asia-Pacific, Middle East/Africa) with distinct economic/environmental profiles
- **6 site types**: headquarters (free, starting), edge_pop ($25K, CDN revenue), colocation ($150K), hyperscale ($500K), network_hub ($200K), disaster_recovery ($300K)
- **Site state preservation**: Full `SiteSnapshot` saves/restores all per-site infrastructure when switching between sites
- **Region profiles**: Each region has unique power costs, labor rates, cooling efficiency, network connectivity, regulatory burden, carbon tax, and demand profiles
- **Inter-site networking**: 4 link types (IP transit, leased wavelength, dark fiber, submarine cable) with geographic constraints
- **Edge PoP CDN revenue**: Edge sites earn passive $0.50/Gbps/tick when connected via backhaul links
- **Regional incidents**: 13 region-specific disasters (earthquake, hurricane, wildfire, grid collapse, submarine cable cut, etc.) with seasonal boosts
- **Disaster preparedness**: 4 prep types (seismic reinforcement, flood barriers, hurricane hardening, elevated equipment) with damage mitigation
- **Multi-site gate**: Requires enterprise tier, $500K cash, and 75+ reputation to unlock

**Global Strategy Layer:**
- **Demand growth**: Regions have emerging/stable/saturated market trends that shift over time, affecting revenue potential
- **Data sovereignty**: GDPR (EU regions), LGPD (Brazil), PDPA (Singapore) with revenue bonuses for compliant contracts and penalties for violations
- **Multi-site contracts**: 6 global contracts requiring operational sites in specific regions (e.g., StreamVault Global needs Ashburn+London+Singapore)
- **Staff transfers**: Relocate staff between sites with same-continent (8 ticks) or cross-continent (15 ticks) travel time and skill-based cost multipliers
- **Competitor regional presence**: Competitors expand into regions with demand-weighted selection, up to 4 regions each
- **19 Phase 6 achievements** and **10 Phase 6 tutorial tips** for global expansion guidance

**Workload Simulation:**
- 5 workload types: ai_training, batch_processing, live_migration, rendering, database_migration
- Per-cabinet workload assignment with progress tracking and overheat failure
- Revenue payout on completion; failed workloads lose progress

**Infrastructure Upgrades:**
- **Row-end slots**: 4 types (PDU, cooler, fire panel, patch panel) mountable at row ends
- **Aisle width upgrades**: standard, wide, extra_wide with maintenance/cooling bonuses
- **Raised floor**: none, basic (12"), advanced (24") for underfloor cooling distribution
- **Cable management**: none, overhead trays, underfloor conduits for cable mess reduction
- **42U rack model**: Detailed per-U equipment placement in cabinet detail view (8 equipment types)

**Advanced Progression:**
- **Advanced scaling tiers**: Nuclear (SMR, $150K) and Fusion/Kugelblitz ($500K) beyond Enterprise
- **Leaderboards**: Local localStorage-based tracking for revenue, uptime, and cabinet count

**Views & Audio:**
- **Sub-floor view**: Third view mode showing cooling pipes, power conduits, and below-floor infrastructure
- **Sound effects**: Procedural Web Audio API synthesis (placement, alerts, achievements, ambient hum)
- **Placement animations**: Expanding neon ring effect on equipment placement

**Additional Systems:**
- **Patents**: Patent unlocked technologies for ongoing royalty income
- **RFP Bidding**: Compete for contract wins/losses
- **Scenario Challenges**: 5 predefined challenges with special rules and objectives
- **Scenario Presentation**: Dedicated scenario select screen with scenario cards showing objectives and special rules; 1-3 star rating system based on completion speed; locked progression (later scenarios require completing earlier ones); victory/defeat results screen with stats and star display; best completion times tracked per scenario
- **Tutorial System**: 42 contextual tips triggered during gameplay (including carbon, security, market, operations, cooling, infrastructure, and multi-site tips)
- **Event Logging**: Filterable log of significant events (capped at 200)
- **Capacity History**: Per-tick snapshot of key metrics (capped at 100)
- **Lifetime Statistics**: Revenue, expenses, peak temp, uptime streaks, fires survived, etc.
- **Save/Load System**: 3 save slots with metadata
- **Sandbox Mode**: Unlimited funds for creative building
- **Demo Mode**: Pre-populated professional-tier state (URL param `?demo=true`)

## Code Conventions

### TypeScript

- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax` enabled — use `import type` for type-only imports
- `erasableSyntaxOnly` enabled — no `enum` or `namespace` declarations
- Path alias: `@/` maps to `src/` (e.g., `import { useGameStore } from '@/stores/gameStore'`)
- Exported types/interfaces use PascalCase; constants use UPPER_SNAKE_CASE
- Module format: ESM (`"type": "module"` in package.json)
- Target: ES2022

### React Components

- Function components only (no class components)
- Components are default-exported from `App.tsx`, named-exported everywhere else
- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn add <component>`
- Tooltip wrapping pattern: always wrap interactive elements with `<Tooltip><TooltipTrigger asChild>...<TooltipContent>` within a `<TooltipProvider>`
- All layout uses Tailwind utility classes; no separate CSS modules
- Sidebar panels follow the pattern in `src/components/sidebar/` — new game system UI should be added as a panel or within an existing panel

### Styling

- Dark terminal/cyberpunk aesthetic with neon colors
- Custom CSS variables defined in `src/index.css` for neon colors (`--neon-green`, `--neon-cyan`, `--neon-orange`, etc.)
- Tailwind custom classes: `text-neon-green`, `text-glow-green`, `glow-green`, `animate-blink`, etc.
- Font: monospace throughout (both UI and Phaser text)
- shadcn config: New York style, neutral base color, CSS variables enabled, no RSC

### Zustand Store

- Single store pattern — all state in one `create<GameState>()` call
- Actions defined inline in the store creator
- Immutable updates: spread operators to create new arrays/objects
- Stats recalculated after every mutation via `calcStats()` and `calcTraffic()`
- Module-level `let` counters for auto-incrementing IDs (`nextCabId`, `nextSpineId`)
- `resetGame()` must reset all state fields to defaults

### Phaser

- Single scene (`DataCenterScene`) handles all rendering
- All visuals drawn with `Phaser.GameObjects.Graphics` (no sprites/images)
- Three-face isometric cube rendering via `drawIsoCube()` for consistent 3D look
- Public API methods on the scene class called from `GameCanvas.tsx`
- Traffic packet animation driven by Phaser's `update()` loop with a phase counter
- Dynamic grid resizing via `setGridSize()` on suite tier upgrades
- Interactive placement mode with tile hover/click callbacks

### Testing

- Tests use **Vitest** with `jsdom` environment
- Test files located at `src/stores/gameStore.test.ts` and `src/stores/__tests__/gameStore.test.ts`
- Store tests use helper pattern: `getState()` / `setState()` wrappers around `useGameStore`
- `setupBasicDataCenter()` helper creates a standard test fixture (sandbox mode, cabinet with server + leaf + spine)
- `beforeEach` resets store state via `getState().resetGame()`
- Tests organized by game system in `describe()` blocks
- Run with `npm run test`

## Domain Concepts

| Term | Meaning |
|------|---------|
| Cabinet | A rack unit on the grid. Holds up to 4 servers and 1 leaf switch. Has environment and customer type. |
| Server | Compute node inside a cabinet. Generates revenue, heat, and traffic. Subject to depreciation. Configurable type. |
| Leaf Switch | Top-of-rack (ToR) network switch. Connects cabinet servers to spines. |
| Spine Switch | Backbone switch in the elevated row. Connects all leaf switches together. |
| Clos Fabric | Spine-leaf network topology. Every leaf connects to every spine. |
| ECMP | Equal-Cost Multipath — traffic distributed evenly across active spines. |
| PUE | Power Usage Effectiveness = (IT + Cooling) / IT. Lower is better (1.0 = perfect). |
| Thermal Throttle | Servers above 80°C earn only 50% revenue. |
| Tick | One simulation step. All systems update per tick. |
| Suite Tier | Data center size tier (starter → enterprise). Determines grid size and spine slots. |
| PDU | Power Distribution Unit. Distributes power to cabinets; can overload. |
| Hot/Cold Aisle | Cabinet facing pattern. Proper alternation provides cooling bonus. |
| Reputation | Score (0–100) that unlocks contracts and affects gameplay. |
| Meet-Me Room | Shared interconnection facility where tenants connect. Generates passive revenue. |
| Peering | Network interconnection agreement for transit/bandwidth. |
| Busway | Overhead power distribution infrastructure. |
| Cross-Connect | Direct physical cable connection between customer equipment. |
| Spot Compute | On-demand compute capacity sold at dynamic market prices. |
| Season | Time cycle (spring/summer/autumn/winter) affecting ambient temperature. |
| Ops Tier | Operations maturity level (manual → monitoring → automation → orchestration). Reduces incidents and improves staff effectiveness. |
| Region | Geographic location for data center sites. 15 regions across 5 continents with unique profiles. |
| Site | A data center facility in a region. 6 types from edge PoP to hyperscale. Players can own up to 8 sites. |
| Inter-Site Link | Network connection between two sites. 4 types with geographic constraints (same/cross-continent). |
| Edge PoP | Small edge site that generates CDN revenue per Gbps of backhaul bandwidth when connected to other sites. |
| Data Sovereignty | Regional data laws (GDPR, LGPD, PDPA) that grant revenue bonuses for compliant contracts. |
| Multi-Site Contract | Global contract requiring operational sites in multiple specific regions with SLA compliance. |
| Demand Trend | Regional market state (emerging/stable/saturated) that shifts over time, affecting revenue potential. |
| Staff Transfer | Relocating staff between sites with travel time based on distance (same vs cross-continent). |

## Simulation Parameters (quick reference)

### Base rates
- Revenue: $12/tick per active server (half if throttled)
- Power cost: $0.50/tick per kW (modified by power market spot price)
- Server power: 450W, Leaf: 150W, Spine: 250W
- Heat: +1.5°C/server/tick, +0.3°C/leaf/tick
- Air cooling: -2.0°C/tick (free), Water cooling: -3.5°C/tick ($25,000 upgrade)
- Ambient: 22°C (modified by weather), Throttle: 80°C, Critical: 95°C (fire trigger)
- Starting money: $50,000
- Traffic: 1 Gbps/server, 10 Gbps/link capacity

### Equipment costs
- Cabinet: $2,000, Server: $2,000, Leaf switch: $5,000, Spine switch: $12,000

### Depreciation
- Server lifespan: 800 ticks, efficiency decay starts at 30% of lifespan

### Customer type multipliers
Each customer type (general, ai_training, streaming, crypto, enterprise) has different power, heat, revenue, and bandwidth multipliers applied to base rates.

### Environment multipliers
- Production: baseline (1x revenue, 1x heat)
- Lab: reduced revenue, reduced heat
- Management: 3% bonus per management server (capped at 30%)

### Server config multipliers
Each server config (balanced, cpu_optimized, gpu_accelerated, storage_dense, memory_optimized) has different cost, power, heat, revenue multipliers and customer type bonuses.

## Adding New Features

When adding new game systems or equipment types, follow the 9-step checklist (also available via `/add-feature` skill):

1. **Define types and constants** in `src/stores/gameStore.ts`
2. **Add state fields and actions** to the `GameState` interface and store
3. **Update `tick()`** if the feature affects per-tick simulation (add new system processing in the appropriate section — order matters)
4. **Update `calcStats()`** if it affects power/heat calculations
5. **Add Phaser rendering** in `src/game/PhaserGame.ts` with a public API method
6. **Bridge in `GameCanvas.tsx`** — add `useEffect` hooks to sync new state to Phaser
7. **Add UI controls** in the appropriate sidebar panel in `src/components/sidebar/`, or in `src/components/HUD.tsx`
8. **Add tests** in `src/stores/__tests__/gameStore.test.ts` for new store actions and tick behavior
9. **Update `resetGame()`** to reset all new state fields to defaults

For new shadcn/ui components: `npx shadcn add <component-name>` (configured in `components.json`).

### Adding new incident types

Add to `INCIDENT_CATALOG` in `gameStore.ts`. The `tick()` function handles spawning, ticking, and resolving incidents automatically based on catalog entries.

### Adding new achievements

Add to `ACHIEVEMENT_CATALOG` in `gameStore.ts`. The `tick()` function checks all achievement conditions each tick and unlocks them when met. `App.tsx` handles displaying the toast notification.

### Adding new tech tree entries

Add to `TECH_TREE` in `gameStore.ts`. Research is managed by `startResearch` action, progress ticked in `tick()`, and bonuses applied where relevant in the tick loop.

### Adding new sidebar panels

1. Create a new component in `src/components/sidebar/YourPanel.tsx`
2. Add the panel to the `PanelId` type, `SIDEBAR_ITEMS`, and `PANEL_TITLES` in `Sidebar.tsx`
3. Add a case to the `PanelContent` switch in `Sidebar.tsx`

## Build & Deployment

- Phaser is split into a separate chunk via `manualChunks` in `vite.config.ts`
- Base path configured as `/data-center-tycoon/` for GitHub Pages
- Production build: `npm run build` outputs to `dist/`
- **CI**: GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, test, and build on every PR and push to `main`
- **CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to GitHub Pages on push to `main`
- Validate changes with `npm run lint`, `npm run test`, and `npm run build`
- **Before creating a PR**, run `/validate-pr-docs` to ensure all documentation is consistent with the codebase
- **PR template**: `.github/PULL_REQUEST_TEMPLATE.md` standardizes pull request descriptions
- Demo available at deployment URL with `?demo=true` parameter
