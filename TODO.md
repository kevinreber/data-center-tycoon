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
- [ ] Spot pricing for power (market rate fluctuations)

## Achievement System
- [x] 15 achievements tracking milestones (equipment, money, incidents, cooling)
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
- [ ] Tenant contracts — Companies rent capacity with SLA requirements (uptime %, latency, bandwidth); missing SLAs means penalties or lost contracts
- [ ] Customer types — AI training (GPU-heavy), streaming (high bandwidth), crypto (cheap power), enterprise (high security); each with different demands and revenue
- [ ] RFP bidding — Compete against rival data centers for large contracts by offering better pricing, uptime, or green certifications

### Staff & HR
- [ ] Hire technicians — Network engineers, electricians, cooling specialists with skill levels affecting repair speed and incident prevention
- [ ] Training programs — Send staff to certifications (CCNA, DCIM) to unlock advanced infrastructure options
- [ ] Shift management — Night shift staff cheaper but slower; understaffing during incidents causes cascading failures

### Research & Tech Tree
- [ ] R&D lab — Invest to unlock technologies: liquid immersion cooling, optical interconnects, ARM servers, custom ASICs
- [ ] Tech tree progression — Branch between efficiency (lower PUE), performance (higher density), or resilience (better failover)
- [ ] Patent system — Developed tech can be patented for passive income or license others' tech

### Reputation & Market
- [ ] Reputation score — Uptime history, green energy, and incident response build public reputation affecting which customers approach you
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
- [ ] Backup generators — Diesel or natural gas with finite fuel; power outages test UPS and generator capacity
- [ ] Fire suppression systems — Gas-based (expensive, electronics-safe) vs. water-based (cheap, destructive); fires from overloaded circuits
- [ ] Disaster recovery drills — Periodic failover tests; passing boosts reputation, failing reveals weaknesses

### Economy & Finance
- [x] Loan system — Take loans for rapid expansion; interest payments eat into margins
- [ ] Spot pricing for power — Electricity costs fluctuate with market rates; buy long-term contracts or gamble on spot pricing
- [ ] Hardware depreciation — Servers lose value and efficiency over time; refresh cycles are strategic decisions
- [ ] Insurance policies — Insure against specific disasters; cheaper premiums with good safety records

### Social & Meta
- [ ] Leaderboards — Compare PUE, uptime, revenue, or green energy % with other players
- [x] Achievement system — "365 days without downtime", "Reached Tier 3 in under 1 hour", "Zero carbon footprint"
- [ ] Sandbox mode — Unlimited budget, all tech unlocked for creative building
- [ ] Scenario challenges — "Recover from catastrophic flood", "Build zero-emission facility", "Handle Black Friday traffic surge"
