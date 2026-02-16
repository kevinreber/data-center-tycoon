# Fabric Tycoon — Consolidated Feature Tracker

> Single source of truth for all features — completed, in progress, and pending.
> Last audited: 2026-02-15

---

## Phase 1 — Close the Loop (Playable Tycoon) ✅

All complete. Core economic loop works.

- [x] Revenue generation from running servers ($12/tick per server)
- [x] Operating cost simulation (power bills, cooling costs)
- [x] Heat simulation (dynamic, load-based, per-tick updates)
- [x] Cooling mechanics (air vs. water trade-offs)
- [x] Basic tenant contracts (SLA + income, bronze/silver/gold tiers)
- [x] Game tick system with speed controls (Pause, 1x, 2x, 3x)
- [x] Thermal throttling (servers above 80°C earn half revenue)
- [x] Finance panel (revenue/expense breakdown per tick)

## Phase 2 — Add Challenge (Engaging) ✅

All complete. Incidents and variety make the game engaging.

- [x] Timer-based random incident system (20+ incident types)
- [x] Real-world incidents: fiber cuts, squirrels, DDoS, pipe leaks
- [x] Creative incidents: sentient AI, solar flares, quantum decoherence
- [x] Incident notification UI and resolution mechanics
- [x] Backup generators (3 tiers: Small Diesel, Large Diesel, Natural Gas) with fuel and auto-start
- [x] Fire suppression (water vs. gas) with equipment damage trade-offs
- [x] Customer types (general, ai_training, streaming, crypto, enterprise) with different demands
- [x] Day/night traffic patterns with peak hours and demand curves

## Phase 3 — Add Depth (Strategic) ✅

All complete. Tech tree, economy, and infrastructure provide strategic depth.

- [x] Tech tree with 9 technologies across 3 branches (efficiency/performance/resilience)
- [x] Spot power pricing with market fluctuations, mean reversion, and price spikes
- [x] Hardware depreciation and server refresh cycle (800-tick lifespan)
- [x] Reputation score (0–100) affecting contract quality and revenue bonuses
- [x] Loan system — Small/Medium/Large with interest rates, max 3 active
- [x] PDU (Power Distribution Unit) — 3 tiers with capacity limits and overload detection
- [x] Structured cabling — auto-routed cable runs with length/capacity constraints
- [x] Cable tray / ladder rack entity — pathway system reducing messy cable incident risk
- [x] Hot/Cold Aisle Enforcement — cabinet facing direction affects cooling efficiency

## Phase 4 — Add World (Immersive) ✅

All complete. Staff, environment, security, and competitors create a living world.

### 4A. Staff & HR System ✅
- [x] `StaffMember` type with role, skill level, salary, fatigue, certifications
- [x] 4 staff roles: network_engineer, electrician, cooling_specialist, security_officer
- [x] 3 skill levels (junior/mid/senior) with hire costs and salary scaling
- [x] Hiring UI panel with available candidates and role filters
- [x] Staff roster display showing names, roles, skill, shift status, fatigue
- [x] Incident resolution speed bonus based on relevant staff on shift
- [x] Fatigue system — back-to-back incidents increase fatigue, burnout at 100
- [x] Shift patterns: day_only (free), day_night ($500/tick), round_the_clock ($1200/tick)
- [x] Night shift effectiveness penalty (-20%) when on day_night pattern
- [x] Training system — send staff to certifications (CCNA, DCIM, Fire Safety, etc.)
- [x] Suite tier gates on max staff count (starter=2, standard=4, professional=8, enterprise=16)
- [x] 4 achievements: First Hire, Full Staff, Zero Fatigue, Certified Team

### 4B. Carbon Footprint & Environmental ✅
- [x] Energy source types: grid_mixed, grid_green, onsite_solar, onsite_wind
- [x] Energy source configs with cost multiplier, carbon per kW, reliability
- [x] Carbon emissions tracking per tick and lifetime cumulative
- [x] Carbon tax escalation over game time ($0→$2→$5→$10 per ton)
- [x] Green certifications: Energy Star, LEED Silver, LEED Gold, Carbon Neutral
- [x] Certification requirements (PUE, energy source, consecutive ticks)
- [x] Green certifications unlock contract revenue bonuses (+10% to +40%)
- [x] Water usage system for water cooling (2 gal/tick per cabinet, $0.10/gal)
- [x] Drought incident type — water prices spike or force switch to air cooling
- [x] E-waste stockpile from server refreshes — proper vs improper disposal
- [x] E-waste reputation penalty when stockpile > 10 items
- [x] Energy source selector panel (Carbon sidebar panel)
- [x] Carbon tracker display (emissions, tax, certifications)
- [x] 4 achievements: Green Power, Carbon Neutral, Water Wise, Clean Sweep

### 4C. Security Tiers & Compliance ✅
- [x] Security tiers: basic, enhanced, high_security, maximum
- [x] 7 security features: CCTV, badge_access, biometric, mantrap, cage_isolation, encrypted_network, security_noc
- [x] Security tier progression with install costs and maintenance/tick
- [x] Compliance certifications: SOC 2 Type I/II, HIPAA, PCI-DSS, FedRAMP
- [x] Certification requirements (security tier, features, reputation, staff)
- [x] Audit mechanic — pay to audit, must maintain requirements during audit window
- [x] Certification expiry if not re-audited within interval
- [x] 3 new intrusion incident types: tailgating, social_engineering, break_in
- [x] Security features reduce intrusion chance (stacking defense bonuses)
- [x] 4 premium contract types gated by compliance (healthcare, finance, government)
- [x] Security panel with tier, features, and compliance status
- [x] 4 achievements: Locked Down, Fully Compliant, Fort Knox, Government Contractor

### 4D. Competitor AI ✅
- [x] Competitor type with name, personality, strength, specialization, reputation
- [x] 5 competitor personalities: budget, premium, green, aggressive, steady
- [x] Competitor scaling — 1 competitor at tick 100, up to 3 by tick 600
- [x] Rubber-banding: competitors grow faster when player is strong, slower when weak
- [x] Contract competition — competitors bid on same contracts with timer pressure
- [x] Competitor bid UI showing who else is bidding and their win chance
- [x] Competitor events: price wars, staff poaching, competitor outages
- [x] Market share tracking (player vs competitors)
- [x] Market panel showing competitor status and market share
- [x] 4 achievements: Market Leader, Monopoly, Underdog, Rivalry

## Phase 5 — Add Longevity (Replayable) ✅

All Phase 5 store/tick systems are implemented.

### 5A. Supply Chain & Procurement ✅
- [x] Hardware orders with lead times and bulk discounts
- [x] Supply shortage events (chip shortage) with price multipliers and extended lead times
- [x] Inventory management (server, leaf_switch, spine_switch, cabinet)
- [x] Procurement panel in sidebar
- [x] 4 achievements: Bulk Buyer, Stockpile, Shortage Survivor, Just In Time

### 5B. Weather System ✅
- [x] 4 seasons (spring → summer → autumn → winter) with cyclical rotation
- [x] 6 weather conditions (clear, cloudy, rain, storm, heatwave, cold_snap)
- [x] Ambient temperature modifiers affecting cooling requirements
- [x] Solar/wind efficiency varies with weather
- [x] Storm events can trigger power-related incidents
- [x] 3 achievements: Four Seasons, Heatwave Survivor, Free Cooling

### 5C. Interconnection / Meet-Me Room ✅
- [x] Meet-me rooms (3 tiers: basic, standard, premium) with port capacity limits
- [x] 3 interconnect port types (copper_1g, fiber_10g, fiber_100g) generating passive revenue
- [x] Network effects — revenue per port increases with more active ports
- [x] Requires Standard suite tier or higher
- [x] 3 achievements: Peering Point, Network Hub, Interconnection Revenue

### 5D. Custom Server Configurations ✅
- [x] 5 server types: balanced, cpu_optimized, gpu_accelerated, storage_dense, memory_optimized
- [x] Each type has cost/power/heat/revenue multipliers
- [x] Customer type matching yields bonus revenue
- [x] Server config selector in Equipment panel
- [x] 3 achievements: Custom Build, GPU Farm, Optimized Fleet

### 5E. Network Peering & Transit ✅
- [x] 4 agreement types: budget_transit, premium_transit, public_peering, private_peering
- [x] Each with bandwidth, latency, and cost-per-tick trade-offs
- [x] Maximum 4 concurrent agreements
- [x] 3 achievements: Connected, IX Member, Zero Latency

### 5F. Maintenance Windows ✅
- [x] Schedule preventive maintenance on cabinets, spines, cooling, or power systems
- [x] Each type has configurable duration and cost
- [x] Maximum 3 concurrent maintenance windows
- [x] Cooling/reliability benefits on completion
- [x] 2 achievements: Preventive Care, Night Owl

### 5G. Power Redundancy Tiers ✅
- [x] 3 levels: N (none), N+1, 2N
- [x] Higher levels provide power resilience at increased cost
- [x] Upgrade path: N → N+1 → 2N (no downgrades)
- [x] 3 achievements: Redundant, Belt and Suspenders, Bulletproof

### 5H. Noise & Community Relations ✅
- [x] Noise generated by server/cooling activity and generators
- [x] Noise complaints escalate to fines if threshold exceeded
- [x] Sound barriers reduce noise (configurable max count)
- [x] Zoning restrictions triggered by persistent noise violations
- [x] 2 achievements: Good Neighbor, Sound Barrier

### 5I. Dynamic Pricing / Spot Compute Market ✅
- [x] Allocate spare server capacity to dynamic spot market
- [x] Price fluctuates with mean reversion and volatility
- [x] Revenue based on allocated capacity × current spot price
- [x] 2 achievements: Spot Trader, Market Timer

### 5J. Event Log / History ✅
- [x] Structured event log with category, severity, timestamps
- [x] Filterable by category (incident, finance, contract, achievement, etc.)
- [x] Capped at 200 entries
- [x] 2 achievements: Historian, Clean Record

### 5K. Statistics Dashboard ✅
- [x] Lifetime stats: revenue, expenses, peak temp, uptime streaks, fires, etc.
- [x] Per-tick snapshot capacity history (capped at 100 entries)
- [x] Progress panel in sidebar
- [x] 3 achievements: Statistician, Ironman, Big Spender

### 5L. Tooltip Tutorial System ✅
- [x] 27 contextual tips triggered during gameplay
- [x] Dismissible toast notifications, never repeat
- [x] Can be disabled entirely in settings
- [x] Covers carbon, security, and market tips
- [x] 2 achievements: Student, Graduate

### 5M. Additional Economy Systems ✅
- [x] Insurance policies — 4 types (fire, power, cyber, equipment) with premiums
- [x] DR Drills — periodic failover tests, affects reputation
- [x] Patent system — patent unlocked technologies for ongoing royalty income
- [x] RFP Bidding — compete for contract wins via bid mechanic
- [x] Stock price / valuation — live ticker with 15 valuation milestones
- [x] Scenario challenges — 5 predefined challenges with objectives and special rules
- [x] Sandbox mode — unlimited funds for creative building
- [x] Demo mode — pre-populated professional-tier state (?demo=true)

### 5N. Infrastructure Entities ✅
- [x] Busway — overhead power distribution (3 tiers: Light/Medium/Heavy)
- [x] Cross-connect — direct physical cable connections between equipment
- [x] In-row cooling — additional cooling units placed on grid (3 options)

## Rendering & Views

### Cabinet View + Above-Cabinet View ✅
- [x] `viewMode` state (`cabinet` | `above_cabinet`)
- [x] Cabinet View: solid cabinets/servers, dashed overhead infrastructure
- [x] Above-Cabinet View: solid switches/cable trays/cabling, dashed cabinet outlines
- [x] View toggle UI
- [x] Architectural dashed-line rendering for "other plane" objects

### Layer Filters ✅
- [x] Toggle visibility of individual layers within a view
- [x] Filter UI (checkboxes or toggle chips)
- [x] Per-layer opacity/color controls

### Network / CLOS Fabric Rendering ✅
- [x] Network topology data model (connections between nodes)
- [x] Cabling visualization (lines between connected switches)
- [x] Spine-leaf wiring validation (over-subscription ratio)
- [x] Traffic flow animation (packet dots moving along cables)
- [x] Shortest-path routing with failover when a node goes down
- [x] Bandwidth capacity and current traffic tracking

### UX / Camera ✅ (mostly)
- [x] Pan controls (mouse drag, middle/right-click drag)
- [x] Zoom controls (scroll wheel, 0.3x–2.5x range)
- [x] Camera reset to default
- [x] Click-to-select cabinets with floating detail panel
- [x] Tile-based click-to-place placement mode (cabinets, PDUs, cable trays)
- [x] Heat map overlay toggle

---

## PENDING FEATURES

Everything below is **not yet implemented**. Organized by priority/effort.

---

### Sub-Floor View (Rendering)

A third view mode showing the space below the raised floor.

- [ ] Third view mode: raised floor plenum
- [ ] Cooling pipes and chilled air flow visualization
- [ ] Power conduit routing
- [ ] Dashed cabinet outlines from below

**Effort:** Medium | **Impact:** Medium — Adds visual depth but not critical for gameplay.

---

### 42U Rack Model

Replace the simple server-count cabinet with a detailed rack unit model.

- [ ] Proper Rack model with 42U slots (per SPEC.md)
- [ ] ToR leaf switch placement inside rack vs. spine switches overhead
- [ ] Per-U slot equipment placement (servers, switches, patch panels)
- [ ] Cabinet detail panel showing 42U slot layout

**Effort:** High | **Impact:** Medium — Significant data model change. Adds realism but current 4-server model works fine for gameplay.

---

### Advanced Scaling Tiers

Late-game sci-fi progression beyond the current 4 suite tiers.

- [ ] Tier 1: Solar/Grid Power + Air Cooling (current ceiling)
- [ ] Tier 2: Modular Nuclear (SMR) + Water Cooling
- [ ] Tier 3: Fusion/Kugelblitz + Alien Cryo-Fluid
- [ ] Tier unlock progression and costs
- [ ] New equipment and cooling types per tier

**Effort:** High | **Impact:** High — Extends endgame significantly. Requires new constants, rendering, and balance work.

---

### Operations Progression — Manual to Automated ✅

A progression system for incident and infrastructure management, inspired by the journey from manual ops to Kubernetes-style orchestration. Early game forces hands-on management; later tiers unlock automation.

- [x] **Tier 1 — Manual Ops (default):** Incidents persist until manually resolved (pay to fix). No auto-resolution.
- [x] **Tier 2 — Monitoring & Alerting:** Reduced resolution costs (-20%) and incident damage (-15%). Still requires manual action.
- [x] **Tier 3 — Basic Automation:** Incidents auto-resolve over time. Staff accelerates resolution. Hardware auto-restores on expiry.
- [x] **Tier 4 — Full Orchestration:** 2x auto-resolve speed, 20% incident prevention, minor incidents auto-resolve instantly.
- [x] Gate progression behind reputation, suite tier, and tech tree milestones (sequential upgrades)
- [x] Operations Progression UI section added to OperationsPanel (tier stats, upgrade button, tooltips)
- [x] 4 achievements: Eyes Everywhere (T2), SRE (T3), Platform Engineer (T4), Predictive (10 prevented)
- [x] 2 tutorial tips: ops_manual (when 2+ unresolved at T1), ops_tier_available (when upgrade is possible)
- [x] Per-tick maintenance costs ($5/$15/$30) and resolve cost multiplier applied to resolveIncident
- [x] Incident effect damage multiplier reduces penalty severity at higher tiers
- [x] 10 tests covering tier upgrades, requirements, auto-resolve behavior, cost multiplier, and reset

**Effort:** Medium-High | **Impact:** High — Transforms incident management from a passive system into a core progression mechanic. Gives players a strong sense of advancement and makes early game meaningfully challenging.

---

### Cooling Infrastructure Redesign

Rethink cooling upgrades as physical, placeable infrastructure rather than instant facility-wide toggles. Players should design their cooling layout to match their cabinet density and heat profile.

- [ ] Water cooling requires physical placement (e.g., CRAH/CRAC units on the grid) with limited range
- [ ] Cooling coverage zones — cabinets outside a cooler's range get reduced or no cooling benefit
- [ ] Cooling capacity planning — units have max BTU/kW capacity; overloading degrades performance
- [ ] Immersion cooling as a third tier — per-cabinet upgrade, extreme heat removal but very expensive
- [ ] Cooling pipe routing — connect CRAH units to a chiller plant; pipe layout affects efficiency
- [ ] Cooling failure modes — individual units can break down, creating hot spots until repaired

**Effort:** High | **Impact:** High — Transforms cooling from a one-click upgrade into a core strategic system. Forces players to think about physical layout, capacity planning, and redundancy. Aligns with the game's identity as "The Heat/Water/Power Triangle."

---

### Workload Simulation (Advanced)

Deeper workload mechanics beyond the current traffic/server model.

- [ ] AI training jobs — long-running GPU workloads generating massive heat; completion earns big payouts, failure means starting over
- [ ] Workload migration — manually or automatically migrate VMs when racks overheat or switches fail

**Effort:** Medium-High | **Impact:** Medium — AI training jobs would add high-risk/high-reward gameplay. Migration adds active management during incidents.

---

### Multi-Site Expansion (Phase 6 — see BRAINSTORM.md for full design)

Expand from a single data center to a global data center empire with a world map view, location-based strategy, and inter-site networking. Full detailed design in BRAINSTORM.md Phase 6.

#### Phase 6A — World Map UI + Site Selection
- [ ] World map view (React + SVG) with neon/terminal aesthetic
- [ ] 12-15 metro regions with distinct profiles (power cost, climate, labor, demand, disaster risk)
- [ ] Region info panel with research mechanic (pay to reveal full profile)
- [ ] Purchase and build first expansion site (edge PoP)
- [ ] Site switcher to toggle floor view between sites
- [ ] Per-site game state instances (separate cabinets, infrastructure, staff)

#### Phase 6B — Inter-Site Networking + Edge PoPs
- [ ] Link types: IP transit, leased wavelength, dark fiber, submarine cable
- [ ] Edge PoP site type with simplified management (1-4 cabinets)
- [ ] Backhaul requirement (edge PoP → core site link)
- [ ] Latency modeling between sites based on distance
- [ ] CDN/content delivery revenue model for edge PoPs

#### Phase 6C — Full Site Types + Regional Incidents
- [ ] 5 site types: edge_pop, colocation, hyperscale, network_hub, disaster_recovery
- [ ] Location-specific incidents (earthquakes, hurricanes, grid collapse, monsoons, volcanic eruptions)
- [ ] Disaster preparedness investments (seismic reinforcement, flood barriers, hurricane hardening)
- [ ] Construction time for new sites

#### Phase 6D — Global Strategy Layer
- [ ] Customer demand heat maps on world map (by customer type)
- [ ] Demand growth over time (emerging vs. saturated markets)
- [ ] Multi-site contracts requiring presence in multiple regions
- [ ] Data sovereignty mechanics (GDPR, LGPD — certain contracts require local presence)
- [ ] Staff transfers between sites (cost + relocation time)
- [ ] Regional competitor presence and market share per region

**Effort:** Very High | **Impact:** High — Transforms the game from facility management into global infrastructure strategy. Phased delivery: each sub-phase delivers standalone value. Gate: Enterprise tier + $500K+ cash + excellent reputation.

---

### Capacity Planning Dashboard ✅

Forecasting tools for proactive management.

- [x] Projected power/cooling/space exhaustion with trend analysis
- [x] Utilization bar charts with trend arrows per metric
- [x] Alerts when any metric exceeds 80% utilization
- [x] Historical sparkline charts
- [x] Financial runway projection (ticks until money runs out)
- [x] Server lifespan overview (oldest servers, refresh scheduling)

---

### Sound Effects & Audio

Audio feedback for game events.

- [ ] Placement sounds (cabinet, server, switch)
- [ ] Incident alert sounds
- [ ] Achievement unlock chime
- [ ] Ambient data center hum
- [ ] UI interaction sounds (clicks, toggles)
- [ ] Volume controls in settings

**Effort:** Medium | **Impact:** Low-Medium — Polish feature. Adds atmosphere but not gameplay depth.

---

### Placement Animations

Visual feedback when placing or building equipment.

- [ ] Build/place animation for cabinets
- [ ] Server install animation
- [ ] Equipment removal animation
- [ ] Construction progress indicator

**Effort:** Low-Medium | **Impact:** Low — Pure polish. Nice-to-have visual feedback.

---

### Leaderboards

Compare performance metrics with other players.

- [ ] PUE comparison
- [ ] Uptime percentage ranking
- [ ] Revenue leaderboard
- [ ] Green energy percentage ranking
- [ ] Requires backend infrastructure

**Effort:** High | **Impact:** Low — Requires server infrastructure. Only meaningful with an active player base.

---

## Summary

| Category | Total | Done | Pending |
|----------|-------|------|---------|
| Phase 1 (Core Loop) | 8 | 8 | 0 |
| Phase 2 (Challenge) | 8 | 8 | 0 |
| Phase 3 (Depth) | 9 | 9 | 0 |
| Phase 4 (World) | 44 | 44 | 0 |
| Phase 5 (Longevity) | 60+ | 60+ | 0 |
| Rendering & Views | 17 | 17 | 0 |
| UX / Camera | 6 | 6 | 0 |
| **Pending Features** | **~31** | **7** | **~24** |

**Implemented features:** 157+ items across Phases 1–5, rendering, UX, capacity planning, and operations progression.
**Remaining features:** ~24 items, including cooling infrastructure redesign, high-effort late-game content (multi-site, scaling tiers, 42U racks), visualization (sub-floor view, sound), and advanced simulation (workload migration, AI training jobs, leaderboards).
