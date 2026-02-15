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

## Future: Sub-Floor View (Plane 1)
- [ ] Third view mode: raised floor plenum
- [ ] Cooling pipes, chilled air flow visualization
- [ ] Power conduit routing
- [ ] Dashed cabinet outlines from below

## Infrastructure & Entities
- [ ] Cable tray / ladder rack entity (overhead)
- [ ] Overhead busway (power distribution) entity
- [ ] Cross-connect / patch panel entity
- [ ] Proper Rack model with 42U slots (per SPEC.md)
- [ ] ToR leaf switch placement inside rack vs. spine switches overhead
- [ ] PDU (Power Distribution Unit) entity
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
