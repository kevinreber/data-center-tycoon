# Fabric Tycoon — Consolidated Feature Tracker

> Single source of truth for all features — completed, in progress, and pending.
> Last audited: 2026-02-18

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

- [x] Timer-based random incident system (17 incident types)
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
- [x] Network Access Control Lists (NACLs) — 4 policy tiers (Open, Standard, Strict, Zero Trust)
- [x] NACL bandwidth overhead tradeoff (0–10% throughput reduction for packet inspection)
- [x] NACL network defense — blocks DDoS and ransomware incidents per tick
- [x] NACL policies gated by security tier (Enhanced+ for Standard, Maximum for Zero Trust)
- [x] NACL UI in Security panel with policy selection, defense stats, and attack counter
- [x] 3 NACL achievements: Firewall Admin, Zero Trust Architect, DDoS Denied
- [x] NACL tutorial tip triggers when security tier supports filtering

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

### Sub-Floor View (Rendering) ✅

A third view mode showing the space below the raised floor.

- [x] Third view mode: raised floor plenum (`sub_floor` view mode)
- [x] Cooling pipes and chilled air flow visualization
- [x] Power conduit routing
- [x] Dashed cabinet outlines from below

---

### 42U Rack Model ✅

Detailed rack unit overlay for cabinets (optional detail view, preserves core 4-server model).

- [x] 42U rack slot model with per-U equipment placement
- [x] 8 equipment types: 1U server, 2U server, 4U storage, 1U switch, 2U patch panel, 1U PDU, 3U UPS, 2U cable management
- [x] Per-U slot equipment placement with overlap detection
- [x] Cabinet detail panel showing 42U slot layout with install/remove controls

---

### Advanced Scaling Tiers ✅

Late-game sci-fi progression beyond the current 4 suite tiers.

- [x] Nuclear tier: Modular Nuclear (SMR) — $150k unlock, +100 cabinets, 50% cooling bonus
- [x] Fusion tier: Fusion/Kugelblitz — $500k unlock (requires Nuclear), +200 cabinets, 75% cooling bonus, zero carbon
- [x] Tier unlock progression with sequential gating (Enterprise → Nuclear → Fusion)
- [x] UI in Facility panel showing advanced tier options

---

### Operations Progression — Manual to Automated ✅

A progression system for incident and infrastructure management, inspired by the journey from manual ops to Kubernetes-style orchestration. Early game forces hands-on management; later tiers unlock automation.

- [x] **Tier 1 — Manual Ops (default):** Base tier with no automation. Incidents require manual resolution or expire naturally.
- [x] **Tier 2 — Monitoring & Alerting:** Requires 2+ staff, `ups_upgrade` tech, reputation 25+. Benefits: -10% incident spawn, -20% resolve cost, +10% staff effectiveness, +5% auto-resolve speed.
- [x] **Tier 3 — Basic Automation:** Requires 4+ staff, all 3 resilience techs, reputation 45+, Standard suite. Benefits: -25% incident spawn, -35% resolve cost, +20% auto-resolve speed, +20% staff effectiveness, -15% revenue penalty from incidents.
- [x] **Tier 4 — Full Orchestration:** Requires 8+ staff, 5 techs (resilience + efficiency), reputation 65+, Professional suite. Benefits: -40% spawn, -50% resolve cost, +40% auto-resolve speed, +35% staff effectiveness, -30% revenue penalty.
- [x] Gated behind tech tree, reputation, suite tier, staff count, and upgrade cost milestones
- [x] Ops tier UI section in Operations panel with current benefits, stats, and upgrade path with requirement checklist
- [x] Achievements: "Script Kiddie" (Monitoring), "SRE" (Automation), "Platform Engineer" (Orchestration), "Lights Out" (20 auto-resolves)
- [x] Incident resolve cost discount shown in Incidents panel with strikethrough pricing
- [x] Tutorial tip triggers when next ops tier requirements are met
- [x] Event logging for auto-resolved and prevented incidents
- [x] Tests for upgrade mechanics, cost deduction, sequential progression, and resolve cost reduction

**Effort:** Medium-High | **Impact:** High — Transforms incident management from a passive system into a core progression mechanic. Gives players a strong sense of advancement and makes early game meaningfully challenging.

---

### Cooling Infrastructure Redesign ✅

Previously implemented. Cooling units (fan trays, CRACs, CRAHs, immersion pods) are placeable infrastructure with range, capacity, and per-cabinet coverage zones. Chiller plants and cooling pipes connect the system.

---

### Workload Simulation ✅

Deeper workload mechanics beyond the current traffic/server model.

- [x] 4 workload types: batch_compute (60 ticks, $5k), ai_training (120 ticks, $15k), rendering (40 ticks, $3k), database_migration (80 ticks, $8k)
- [x] Per-cabinet workload assignment with progress tracking
- [x] Overheat failure — workloads fail if cabinet exceeds failure temperature
- [x] Workload migration between cabinets
- [x] Revenue payout on completion, event logging for completion/failure
- [x] UI in Equipment panel showing active workloads and launch controls

---

### Multi-Site Expansion (Phase 6 — see BRAINSTORM.md for full design)

Expand from a single data center to a global data center empire with a world map view, location-based strategy, and inter-site networking. Full detailed design in BRAINSTORM.md Phase 6.

#### Phase 6A — World Map UI + Site Selection ✅
- [x] World map view (React + SVG) with neon/terminal aesthetic
- [x] 12-15 metro regions with distinct profiles (power cost, climate, labor, demand, disaster risk)
- [x] Region info panel with research mechanic (pay to reveal full profile)
- [x] Purchase and build first expansion site (edge PoP)
- [x] Site switcher to toggle floor view between sites
- [x] Per-site game state instances (separate cabinets, infrastructure, staff)

#### Phase 6B — Inter-Site Networking + Edge PoPs ✅
- [x] Link types: IP transit, leased wavelength, dark fiber, submarine cable
- [x] Edge PoP site type with simplified management (1-4 cabinets)
- [x] Backhaul requirement (edge PoP → core site link)
- [x] Latency modeling between sites based on distance
- [x] CDN/content delivery revenue model for edge PoPs

#### Phase 6C — Full Site Types + Regional Incidents ✅
- [x] 5 site types: edge_pop, colocation, hyperscale, network_hub, disaster_recovery
- [x] Location-specific incidents (earthquakes, hurricanes, grid collapse, monsoons, volcanic eruptions)
- [x] Disaster preparedness investments (seismic reinforcement, flood barriers, hurricane hardening)
- [x] Construction time for new sites

#### Phase 6D — Global Strategy Layer ✅
- [x] Customer demand heat maps on world map (by customer type) ✅
- [x] Demand growth over time (emerging vs. saturated markets) ✅
- [x] Multi-site contracts requiring presence in multiple regions ✅
- [x] Data sovereignty mechanics (GDPR, LGPD — certain contracts require local presence) ✅
- [x] Staff transfers between sites (cost + relocation time) ✅
- [x] Regional competitor presence and market share per region ✅

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

### Sound Effects & Audio ✅

Audio feedback for game events using procedural Web Audio API synthesis.

- [x] Placement sounds (build — rising tone)
- [x] Incident alert sounds (alert — descending tone)
- [x] Achievement unlock chime (upgrade — ascending arpeggio)
- [x] Ambient data center hum (60Hz sawtooth)
- [x] Error sound (error — low buzz)
- [x] Volume controls in Settings panel (master, SFX, ambient, mute toggle)

---

### Placement Animations ✅

Visual feedback when placing or building equipment.

- [x] Expanding ring animation on cabinet/equipment placement
- [x] Neon cyan color with fade-out effect
- [x] Phaser time event driven animation

---

### Game Feel & Polish — RCT-Style Improvements

Inspired by RollerCoaster Tycoon's feedback loops and "aliveness." Full design details in BRAINSTORM.md under "Game Feel & Polish — RCT-Style Improvements."

#### Animated Worker Sprites ("Peeps") ✅

Procedurally-drawn technician sprites that walk corridors, respond to incidents, and install equipment. Role-colored uniforms (green/yellow/blue/red by role). The single highest-impact "game feel" feature.

- [x] Worker sprite rendering (procedural `Graphics`, consistent with no-asset approach)
- [x] Pathfinding along corridors and aisles
- [x] Walk-to-incident behavior when incident fires
- [x] Walk-to-cabinet behavior during placement/maintenance
- [x] Idle patrol behavior for on-shift staff
- [x] Role-colored uniforms and busy/idle indicators

**Effort:** High | **Impact:** High — Makes the data center feel alive. Workers create ambient motion and make staffing visible.

---

#### Floating World-Space Text ("Damage Numbers") ✅

Revenue/expense/warning text that rises from game objects each tick.

- [x] `+$` revenue text rising from cabinets on tick (sampled every 4 ticks)
- [x] `THROTTLED` / temperature warnings above hot cabinets
- [x] `FIRE!` text above burning cabinets
- [x] `⚠ INCIDENT` / `RESOLVED ✓` text for incidents
- [x] `★ ACHIEVEMENT` text on unlock
- [x] `CONTRACT COMPLETE` text on contract completion
- [x] Text pooling and recycling for performance (30-object pool with recycling)

**Effort:** Low-Medium | **Impact:** High — Constant visual heartbeat. Players see the simulation running without opening panels.

---

#### Placement Pop & Build Animations (Enhanced) ✅

Enhanced tweens and visual feedback beyond the current expanding ring animation.

- [x] Cabinet place: expanding ring + green flash + alpha fade-in with `Back.easeOut`
- [x] Spine switch add: orange expanding ring + flash + fade-in
- [x] Server install: scale pulse on cabinet + green particle burst
- [x] Leaf switch add: cyan flash on top of cabinet
- [x] Equipment removal: scale 1→0 with red flash
- [x] Suite tier upgrade: camera zoom out reveal animation

**Effort:** Low | **Impact:** Medium — Makes building feel satisfying instead of instant.

---

#### Particle Effects for Events ✅

Phaser particle system (`Phaser.GameObjects.Particles`) for physical event feedback.

- [x] Fire: orange/red flickering particles over burning cabinet
- [x] Overloaded PDU: electric spark particles (yellow/white bursts)
- [x] Cooling units: subtle blue mist/cold air particles
- [x] Thermal throttle: heat shimmer (wavy transparent particles rising)
- [x] Server refresh: cyan sparkle burst
- [x] Critical incident: red warning pulse ring expanding outward
- [x] Achievement: gold particle shower from top of screen

**Effort:** Medium | **Impact:** Medium — Makes events feel physical rather than just notifications.

---

#### Ambient Animations & Visual Life (Partial) ✅

Small animations that make the facility feel like a living, operational space.

- [x] Cabinet LED pulse tweens (slow when idle, fast under load, off when powered down)
- [x] Cooling unit fan rotation indicators
- [x] Spine switch glow pulse when handling traffic
- [x] Power-off cabinet dimming (darkened graphic, LEDs off)
- [x] Throttled cabinet red/orange tint overlay
- [x] Weather particle overlays (rain, snow, heat shimmer)
- [x] Day/night ambient light shift

**Effort:** Low-Medium | **Impact:** Medium — The data center equivalent of RCT rides running and guests wandering.

---

#### Enhanced Sound Effects & Audio ✅

Additional audio feedback beyond the current procedural synthesis system.

- [x] HVAC white noise for cooling
- [x] Placement sounds (click/thunk for cabinet, metallic slide for server, switch click for leaf/spine)
- [x] Alert sounds (alarm for fire/critical, warning tone for throttling)
- [x] Economy sounds (cash register ding on contract, coin sound on milestone)
- [x] UI interaction sounds (button click, panel slide, toggle)

**Effort:** Medium | **Impact:** Medium — Sound creates subconscious connection to game state.

---

#### Camera Juice ✅

Camera effects tied to significant game events.

- [x] Screen shake on critical incidents (fire, major outage) — 3 intensity levels
- [x] Smooth camera pan to newly placed cabinet
- [x] Zoom pulse on achievement unlock
- [x] Camera zoom out on suite tier upgrade to reveal expanded grid
- [x] Larger screen shake for explosions/fire suppression

**Effort:** Low | **Impact:** Low-Medium — Draws attention to important events.

---

#### Visual State Differentiation ✅

Make important game states visible on the isometric grid without opening panels.

- [x] Throttled cabinets: red/orange tint overlay with THROTTLED label
- [x] Powered-off cabinets: darkened/dimmed graphic with OFFLINE label
- [x] Cabinets on fire: orange tint + FIRE label on the grid
- [x] Active incident: yellow warning triangle icon above cabinet
- [x] Maintenance in progress: blue wrench icon + blue tint overlay
- [x] Recently placed: green highlight glow fading over 3s
- [x] Aged/deprecated servers: yellowed tint on cabinet with AGING label
- [x] Fix heat map to use actual `heatLevel` from store (green→yellow→red gradient with temperature labels)

**Effort:** Low | **Impact:** Medium — Enables "glance and react" gameplay.

---

#### Sidebar Panel Slide Animation ✅

- [x] CSS width transition on panel open/close (200ms ease-out)
- [x] Slide-out animation on panel close with content persistence during transition
- [x] Opacity fade-in synchronized with width transition

**Effort:** Low | **Impact:** Low — Small UI polish eliminating jarring pop-in.

---

#### Scenario Presentation & Framing ✅

Make scenarios a first-class feature rather than a settings toggle.

- [x] Dedicated scenario select screen with scenario cards
- [x] 1-3 star ratings based on completion quality
- [x] Locked progression (later scenarios require completing earlier ones)
- [x] Scenario preview showing starting state
- [x] Victory/defeat results screen with stats
- [x] Local best times/scores per scenario

**Effort:** Medium | **Impact:** Medium — RCT's "one more scenario" pull driven by visible progress.

---

### Leaderboards ✅

Local leaderboard system using localStorage.

- [x] Revenue, uptime, and cabinets categories
- [x] Submit entries from Settings panel
- [x] Persistent storage across sessions

---

### Cabinet Organization Incentives (Future Ideas)

Ideas for further encouraging organized cabinet layouts. Zone Adjacency Bonus (with visual zone outlines) was implemented first. These remain as future options:

- [x] **Mixed-Environment Penalty** — If a cabinet is surrounded by cabinets of a *different* environment type, apply a small penalty: +5% heat (incompatible airflow profiles) and -3% revenue (operational complexity overhead). Lighter touch "stick" approach that creates a subtle push toward clustering.
- [x] **Dedicated Row Bonus** — If an entire row is the same environment type, grant a "dedicated row" bonus: +8% efficiency (revenue or cooling depending on type) with a visual row highlight on the isometric grid. Simpler to reason about than adjacency and maps well to the existing row-based aisle system.
- [x] **Zone Contracts** — Higher-tier contracts require organized zones: e.g., "Enterprise SLA: Requires a production zone of 4+ adjacent cabinets" or "AI Training Cluster: Requires 3+ adjacent GPU cabinets of the same customer type." Gates reward behind contracts rather than changing base mechanics, keeping early game freeform.

**Effort:** Low-Medium each | **Impact:** Medium — Each builds on the zone adjacency system and adds strategic depth to cabinet placement.

---

## Summary

| Category | Total | Done | Pending |
|----------|-------|------|---------|
| Phase 1 (Core Loop) | 8 | 8 | 0 |
| Phase 2 (Challenge) | 8 | 8 | 0 |
| Phase 3 (Depth) | 9 | 9 | 0 |
| Phase 4 (World) | 44 | 44 | 0 |
| Phase 5 (Longevity) | 60+ | 60+ | 0 |
| Rendering & Views | 21 | 21 | 0 |
| UX / Camera | 6 | 6 | 0 |
| Game Feel & Polish (RCT-Style) | ~60 | ~57 | ~3 |
| **Other Pending Features** | **~35** | **~32** | **~3** |

**Current version:** v0.5.0 — 89 achievements, 34 tutorial tips, 250 tests passing.

**Implemented features:** 230+ items across Phases 1–5, rendering, UX, capacity planning, operations progression, cooling infrastructure (placeable units + chiller plants + pipes), cabinet organization incentives, sub-floor view, 42U rack model, advanced scaling tiers (Nuclear/Fusion), workload simulation, sound effects, enhanced sound effects (HVAC noise, per-equipment placement sounds, alert/economy/UI sounds), placement animations with Phaser tweens, enhanced build animations (server install pulse, leaf switch flash, equipment removal), camera juice effects (shake/zoom pulse/zoom reveal/smooth pan to placed cabinet), ambient animations (LED pulses, fan rotation, spine glow), weather particle overlays (rain, snow, heat shimmer), day/night ambient light cycle, particle effects for events (fire, sparks, cooling mist, heat shimmer, sparkle bursts, warning pulses, achievement showers), worker sprites with pathfinding and role-colored uniforms, scenario presentation with star ratings and progression, sidebar slide transitions, leaderboards, row-end slots, aisle width upgrades, raised floor, cable management, floating world-space text, and visual state differentiation.

**Remaining features:** ~20 items, primarily multi-site expansion (Phase 6A–6D) and a couple of ambient animation items already covered by visual state differentiation.
