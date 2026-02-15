# Fabric Tycoon — Feature Backlog

## Current PR: Cabinet View + Above-Cabinet View
- [x] Add `viewMode` state to Zustand store (`cabinet` | `above_cabinet`)
- [x] Cabinet View: solid cabinets/servers, dashed overhead infrastructure
- [x] Above-Cabinet View: solid switches/cable trays/cabling, dashed cabinet outlines
- [x] View toggle UI in HUD
- [x] Architectural dashed-line rendering for "other plane" objects

## Next PR: Layer Filters
- [x] Toggle visibility of individual layers within a view (cables, switches, servers, power)
- [x] Filter UI (checkboxes or toggle chips in HUD)
- [x] Per-layer opacity/color controls

## Phase 2/3 Systems (Complete)
- [x] Customer types with differentiated power/heat/revenue/bandwidth profiles
- [x] Backup generators (3 tiers) with fuel system and auto-start on outage
- [x] Fire suppression (water vs. gas) with equipment damage trade-offs
- [x] Power outage system triggered by power surge incidents
- [x] Tech tree with 9 technologies across 3 branches (efficiency/performance/resilience)
- [x] Spot power pricing with market fluctuations and price spikes
- [x] Hardware depreciation and server refresh cycle
- [x] Reputation score affecting contract quality and revenue bonuses
- [x] 6 new achievements for Phase 2/3 features

## Phase 4: Add World (Next Up)

### 4A. Staff & HR System
- [ ] `StaffMember` type with role, skill level, salary, fatigue, certifications
- [ ] 4 staff roles: network_engineer, electrician, cooling_specialist, security_officer
- [ ] 3 skill levels (junior/mid/senior) with hire costs and salary scaling
- [ ] Hiring UI panel with available candidates and role filters
- [ ] Staff roster display showing names, roles, skill, shift status, fatigue
- [ ] Incident resolution speed bonus based on relevant staff on shift
- [ ] Fatigue system — back-to-back incidents increase fatigue, burnout at 100
- [ ] Shift patterns: day_only (free), day_night ($500/tick), round_the_clock ($1200/tick)
- [ ] Night shift effectiveness penalty (-20%) when on day_night pattern
- [ ] Training system — send staff to certifications (CCNA, DCIM, Fire Safety, etc.)
- [ ] Suite tier gates on max staff count (starter=2, standard=4, professional=8, enterprise=16)
- [ ] 4 achievements: First Hire, Full Staff, Zero Fatigue, Certified Team

### 4B. Carbon Footprint & Environmental
- [ ] `EnergySource` type: grid_mixed, grid_green, onsite_solar, onsite_wind
- [ ] Energy source configs with cost multiplier, carbon per kW, reliability
- [ ] Carbon emissions tracking per tick and lifetime cumulative
- [ ] Carbon tax escalation over game time ($0→$2→$5→$10 per ton)
- [ ] Green certifications: Energy Star, LEED Silver, LEED Gold, Carbon Neutral
- [ ] Certification requirements (PUE, energy source, consecutive ticks)
- [ ] Green certifications unlock contract revenue bonuses (+10% to +40%)
- [ ] Water usage system for water cooling (2 gal/tick per cabinet, $0.10/gal)
- [ ] Drought incident type — water prices spike or force switch to air cooling
- [ ] E-waste stockpile from server refreshes — proper vs improper disposal
- [ ] E-waste reputation penalty when stockpile > 10 items
- [ ] Energy source selector panel in HUD
- [ ] Carbon tracker display (emissions, tax, certifications)
- [ ] 4 achievements: First Solar Panel, Carbon Neutral, Water Wise, Clean Sweep

### 4C. Security Tiers & Compliance
- [ ] `SecurityTier` type: basic, enhanced, high_security, maximum
- [ ] Security feature installs: CCTV, badge_access, biometric, mantrap, cage_isolation, encrypted_network, security_noc
- [ ] Security tier progression with install costs and maintenance/tick
- [ ] Compliance certifications: SOC 2 Type I/II, HIPAA, PCI-DSS, FedRAMP
- [ ] Certification requirements (security tier, features, reputation, staff)
- [ ] Audit mechanic — pay to audit, must maintain requirements during audit window
- [ ] Certification expiry if not re-audited within interval
- [ ] 3 new intrusion incident types: tailgating, social_engineering, break_in
- [ ] Security features reduce intrusion chance (stacking defense bonuses)
- [ ] 4 new premium contract types gated by compliance (healthcare, finance, government)
- [ ] Security panel in HUD with tier, features, and compliance status
- [ ] 4 achievements: Locked Down, Fully Compliant, Fort Knox, Government Contractor

### 4D. Competitor AI
- [ ] `Competitor` type with name, personality, strength, specialization, reputation
- [ ] 5 competitor personalities: budget, premium, green, aggressive, steady
- [ ] Competitor scaling — 1 competitor at start, up to 3 by mid-game
- [ ] Rubber-banding: competitors grow faster when player is strong, slower when weak
- [ ] Contract competition — competitors bid on the same contracts with timer pressure
- [ ] Competitor bid UI showing who else is bidding and their win chance
- [ ] Competitor events: price wars, staff poaching, competitor outages
- [ ] Market share tracking (player vs competitors)
- [ ] Market panel in HUD showing competitor status and market share
- [ ] 4 achievements: Market Leader, Monopoly, Underdog, Rivalry

## Future: Sub-Floor View (Plane 1)
- [ ] Third view mode: raised floor plenum
- [ ] Cooling pipes, chilled air flow visualization
- [ ] Power conduit routing
- [ ] Dashed cabinet outlines from below

## Infrastructure & Entities
- [x] PDU (Power Distribution Unit) — 3 tiers with capacity limits, range, and overload detection
- [x] Structured Cabling — auto-routed cable runs with length/capacity constraints
- [x] Cable tray / ladder rack entity — pathway system reducing messy cable incident risk
- [x] Hot/Cold Aisle Enforcement — cabinet facing direction affects cooling efficiency
- [ ] Overhead busway (power distribution) entity
- [ ] Cross-connect / patch panel entity
- [ ] Proper Rack model with 42U slots (per SPEC.md)
- [ ] ToR leaf switch placement inside rack vs. spine switches overhead
- [ ] In-row cooling unit entity

## Network / CLOS Fabric
- [ ] Network topology data model (connections between nodes)
- [ ] Cabling visualization (lines between connected switches)
- [ ] Spine-leaf wiring validation (over-subscription ratio)
- [ ] Traffic flow animation (packet dots moving along cables)
- [ ] Shortest-path routing with failover when a node goes down
- [ ] Bandwidth capacity and current traffic tracking

## Simulation
- [x] Heat simulation (heat levels update over time based on load/cooling)
- [x] Realistic PUE calculation (based on cooling type, load, ambient temp)
- [x] Revenue generation from running servers
- [x] Operating cost simulation (power bills, cooling costs)
- [x] Cooling mechanics — air cooling implemented; water cooling TBD
- [x] Game tick system with speed controls (Pause, 1x, 2x, 3x)
- [x] Thermal throttling (servers above 80°C earn half revenue)
- [x] Finance panel (revenue/expense breakdown per tick)
- [x] Water cooling upgrade (higher efficiency, different trade-offs)

## Incident System
- [x] Timer-based random event roller
- [x] Real-world incidents: fiber cuts, squirrels, DDoS, pipe leaks
- [ ] Creative incidents: sentient AI, solar flares, quantum decoherence
- [x] Incident notification UI and resolution mechanics

## Loan System
- [x] Small/Medium/Large loan options with interest rates
- [x] Per-tick loan repayment deducted from income
- [x] Max 3 active loans, finance panel integration
- [x] Spot pricing for power (market rate fluctuations with random walk and spikes)

## Achievement System
- [x] 15 achievements + 6 Phase 2/3 achievements tracking milestones
- [x] Achievement unlock toast notifications
- [x] Full achievements panel in HUD
- [ ] Sandbox mode (unlimited budget, all tech unlocked)

## Scaling Tiers
- [ ] Tier 1: Solar/Grid Power + Air Cooling
- [ ] Tier 2: Modular Nuclear (SMR) + Water Cooling
- [ ] Tier 3: Fusion/Kugelblitz + Alien Cryo-Fluid
- [ ] Tier unlock progression and costs

## UX / Camera
- [ ] Pan and zoom controls for isometric view
- [ ] Click-to-select cabinets/switches
- [ ] Drag-and-drop placement on grid
- [ ] Cabinet detail panel (open a rack to see 42U slots)
- [ ] Heat map overlay toggle

## Polish
- [ ] Save/load game state (localStorage or IndexedDB)
- [ ] Sound effects
- [ ] Placement animations
- [ ] Tutorial / guided first-time experience

---

## Brainstorm: Additional Features

### Customer & Contract System
- [x] Tenant contracts — Companies rent capacity with SLA requirements (uptime %, latency, bandwidth); missing SLAs means penalties or lost contracts
- [x] Customer types — AI training (GPU-heavy), streaming (high bandwidth), crypto (cheap power), enterprise (high security); each with different demands and revenue
- [ ] RFP bidding — Compete against rival data centers for large contracts by offering better pricing, uptime, or green certifications

### Staff & HR
- [ ] Hire technicians — Network engineers, electricians, cooling specialists with skill levels affecting repair speed and incident prevention
- [ ] Training programs — Send staff to certifications (CCNA, DCIM) to unlock advanced infrastructure options
- [ ] Shift management — Night shift staff cheaper but slower; understaffing during incidents causes cascading failures

### Research & Tech Tree
- [x] R&D lab — Invest to unlock technologies: immersion cooling, optical interconnects, GPU clusters, UPS upgrades
- [x] Tech tree progression — 3 branches: efficiency (lower PUE), performance (higher density), resilience (better failover)
- [ ] Patent system — Developed tech can be patented for passive income or license others' tech

### Reputation & Market
- [x] Reputation score — Uptime history and incident response build reputation affecting contract quality and revenue bonuses
- [ ] Stock price / company valuation — Live ticker reflecting performance, unlocking investor funding for expansion
- [ ] Competitor AI — Rival data center companies bid on same contracts, race to adopt tech, and poach your staff

### Environmental & Regulatory
- [ ] Carbon footprint tracker — Government carbon taxes scale with fossil fuel usage; green certifications (LEED, Energy Star) attract premium tenants
- [ ] Zoning & permits — Expanding requires city permits; community opposition if facility is too noisy or power-hungry
- [ ] Water usage management — Water-cooled systems draw from local supply; droughts force switches to air cooling
- [ ] E-waste disposal — Decommissioned hardware must be recycled properly with cost and reputation implications

### Physical Security & Compliance
- [ ] Security tiers — Biometric access, mantrap entries, CCTV; higher security unlocks government and finance contracts
- [ ] Compliance certifications — SOC 2, HIPAA, PCI-DSS; each requires specific infrastructure (isolated cages, encrypted networking)
- [ ] Physical intrusion events — Social engineering attempts, tailgating, break-ins that test your security setup

### Multi-Site Expansion
- [ ] Multiple locations — Build data centers in different regions (US-East, EU-West, Asia-Pacific) with different costs, weather, and regulations
- [ ] Inter-site networking — Connect sites via dark fiber or leased lines; latency matters for multi-region workloads
- [ ] Edge deployments — Small edge PoPs in cities for low-latency delivery, feeding into main facilities

### Workload Simulation
- [ ] AI training jobs — Long-running GPU workloads generating massive heat, needing uninterrupted power; completion earns big payouts
- [ ] Traffic patterns — Day/night cycles with peak hours; streaming spikes in evening, batch processing runs overnight
- [ ] Workload migration — Manually or automatically migrate VMs when racks overheat or switches fail

### Disaster & Recovery
- [x] Backup generators — Diesel, large diesel, and natural gas with finite fuel; auto-start on power outages
- [x] Fire suppression systems — Gas-based (FM-200, electronics-safe) vs. water-based (cheap, destructive); fires from critical temps
- [ ] Disaster recovery drills — Periodic failover tests; passing boosts reputation, failing reveals weaknesses

### Economy & Finance
- [x] Loan system — Take loans for rapid expansion; interest payments eat into margins
- [x] Spot pricing for power — Electricity costs fluctuate with random walk, mean reversion, and price spikes
- [x] Hardware depreciation — Servers lose efficiency over time; refresh cycles restore performance at a cost
- [ ] Insurance policies — Insure against specific disasters; cheaper premiums with good safety records

### Social & Meta
- [ ] Leaderboards — Compare PUE, uptime, revenue, or green energy % with other players
- [x] Achievement system — "365 days without downtime", "Reached Tier 3 in under 1 hour", "Zero carbon footprint"
- [ ] Sandbox mode — Unlimited budget, all tech unlocked for creative building
- [ ] Scenario challenges — "Recover from catastrophic flood", "Build zero-emission facility", "Handle Black Friday traffic surge"
