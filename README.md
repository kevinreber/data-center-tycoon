# Fabric Tycoon: Data Center Simulator

## 🛸 Project Vision
A web-based, 2D isometric Tycoon game (think Roller Coaster Tycoon) where the player builds and manages a data center. The goal is to scale from a single rack to a global AI powerhouse while balancing network topology, power consumption, and environmental impact.

<img width="1619" height="990" alt="image" src="https://github.com/user-attachments/assets/72e1c54c-6041-44f6-bb95-325f67709124" />


## 🕹 Core Gameplay Loop
1. **Build:** Place racks, cooling units, and power sources in an isometric grid.
2. **Configure:** Open "Cabinet View" (2D) to snap in servers and switches.
3. **Connect:** Wire a "Clos Fabric" (Spine-and-Leaf) to ensure high availability.
4. **Manage:** Handle real-world and sci-fi incidents (Packet loss, leaks, alien signals).
5. **Scale:** Move from Coal Power to Fusion and Alien Energy to support massive AI workloads.

## 🛠 Key Mechanics
- **Clos Fabric Logic:** Unlike other sims, network topology matters. If a "Spine" switch fails, traffic must dynamically reroute to avoid packet loss.
- **The Heat/Water/Power Triangle:** High-density AI chips generate extreme heat. Players must choose between cheap Air Cooling or efficient (but risky) Water Cooling.
- **Scaling Tiers:** - Tier 1: Solar/Grid Power + Air Cooling.
  - Tier 2: Modular Nuclear (SMR) + Water Cooling.
  - Tier 3: Fusion/Kugelblitz (Black Hole) + Alien Cryo-Fluid.

## 🔧 Game Systems

### Economy & Finance
- **Revenue** — Earn money from servers running workloads. Revenue varies by customer type (General, AI Training, Streaming, Crypto, Enterprise) and server configuration.
- **Expenses** — Pay for power (dynamic market pricing), cooling, loan repayments, staff salaries, and infrastructure maintenance.
- **Loans** — Borrow money in Bronze, Silver, or Gold tiers with varying interest rates and terms.
- **Contracts** — Accept SLA-backed contracts for bonus revenue. Meet uptime and temperature targets or face penalties.
- **Spot Compute Market** — Allocate spare servers to the spot market. Prices fluctuate with demand — sell when rates are high!
- **Stock Price** — Your company valuation rises and falls based on performance. Hit milestones to unlock achievements.

### Infrastructure
- **Cabinet Environments** — Set cabinets to Production (standard), Lab (low heat/revenue), or Management (bonus to all servers).
- **Custom Server Configs** — Choose from Balanced, CPU-Optimized, GPU-Accelerated, Storage-Dense, or Memory-Optimized builds for new servers.
- **42U Rack Model** — Detailed per-U equipment slots in the cabinet detail view with 8 equipment types (servers, switches, patch panels, UPS, etc.).
- **Cooling** — Air cooling (free, basic) or Water cooling ($25K upgrade, 75% more effective). Placeable cooling units (fan trays, CRACs, CRAHs, immersion pods) with coverage zones. Chiller plants boost CRAH efficiency via cooling pipe networks.
- **PDUs & Cable Management** — Place power distribution units, overhead trays, or underfloor conduits. Overloaded PDUs cause heat; cable management tiers reduce mess incidents.
- **Hot/Cold Aisles** — Alternate cabinet facing for cooling efficiency bonuses. Aisle containment and width upgrades for additional cooling.
- **Raised Floor** — Install 12" or 24" raised floors for underfloor cooling distribution and cable routing.
- **Row-End Slots** — Mount PDUs, coolers, fire panels, or network patch panels at row ends for per-row bonuses.
- **Workloads** — Assign AI training, batch processing, rendering, or database migration jobs to cabinets for completion payouts.

### Networking
- **Clos Fabric** — Build a Spine-Leaf network. Every leaf switch connects to every spine via ECMP for fault-tolerant traffic routing.
- **Meet-Me Room** — Install an interconnection facility to earn passive revenue from network tenants. Add ports to increase capacity.
- **Network Peering** — Establish peering agreements (Free Peering, Paid Peering, Transit, IX Port) to reduce latency and improve reputation.
- **Network ACLs** — Configure network access control policies from Open to Zero Trust. Higher policies add network defense against DDoS and ransomware but cost bandwidth overhead. Strict and Zero Trust enable compliance certifications like PCI-DSS, HIPAA, and FedRAMP.

### Global Expansion
- **Multi-Site Empire** — Expand beyond a single facility to build data centers across 15 global regions from Ashburn to Tokyo. 6 site types: Headquarters, Edge PoP, Colocation, Hyperscale, Network Hub, and Disaster Recovery.
- **Inter-Site Networking** — Connect your sites with IP Transit, Leased Wavelength, Dark Fiber, or Submarine Cable links. Geographic constraints apply (dark fiber same-continent only, submarine cable cross-continent only).
- **Regional Profiles** — Each region has unique power costs, labor rates, climate, cooling efficiency, demand patterns, and disaster risks.
- **Regional Incidents** — 13 region-specific disasters (earthquakes, hurricanes, floods, grid collapse) based on each region's risk profile. Install disaster preparedness to mitigate damage.
- **Demand Dynamics** — Regional markets evolve through emerging, stable, and saturated phases. Get into emerging markets early for maximum growth.
- **Data Sovereignty** — GDPR (EU), LGPD (Brazil), and PDPA (Singapore) rules grant revenue bonuses for compliant global contracts.
- **Global Contracts** — Land lucrative contracts requiring operational sites in multiple specific regions, with completion bonuses up to $100K.
- **Staff Transfers** — Relocate staff between sites to fill skill gaps. Same-continent transfers take 8 ticks; cross-continent take 15.
- **Competitor Expansion** — AI competitors expand into regions, competing for global market share.

### Weather & Supply Chain
- **Seasons** — Spring, Summer, Fall, Winter rotate automatically, each affecting ambient temperature and cooling load.
- **Weather Events** — Clear skies, clouds, rain, storms, heatwaves, and cold snaps create temporary temperature shifts.
- **Supply Chain** — Order servers, switches, PDUs, and cooling units in advance. Bulk orders get discounts. Watch out for supply shortages that inflate prices!

### Reliability & Protection
- **Power Redundancy** — Upgrade from N (none) to N+1 (one backup) or 2N (full duplication) to protect against failures.
- **Generators** — Buy diesel or natural gas backup generators with fuel management for power outage resilience.
- **Fire Suppression** — Choose water (cheap, some damage) or gas (expensive, minimal damage) suppression systems.
- **Maintenance Windows** — Schedule preventive maintenance on cabinets, spines, cooling, or power systems for reliability and a cooling boost.
- **Insurance** — Purchase policies to cover incidents, with DR drills to test readiness.

### Noise & Community
- **Noise Levels** — Your data center generates noise proportional to active equipment. Exceeding limits triggers complaints.
- **Community Relations** — Keep neighbors happy or face fines and zoning restrictions that block expansion.
- **Sound Barriers** — Install barriers to reduce noise output and stay within limits.

### Progression
- **Suite Tiers** — Scale from Starter (4x2 grid) to Enterprise (10x5 grid), then unlock Nuclear and Fusion advanced tiers.
- **Tech Tree** — Research 9 technologies across Efficiency, Performance, and Resilience branches.
- **Reputation** — Build reputation from Unknown to Legendary through uptime, SLA compliance, and incident management.
- **Achievements** — Unlock 103 achievements for milestones across all game systems.
- **Scenarios** — Play themed challenges with specific goals and constraints.
- **Leaderboards** — Track your best revenue, uptime, and cabinet count across sessions.
- **Bankruptcy** — If cash reserves fall below -$10,000 for 30 consecutive ticks, the company goes bankrupt and the game ends. Manage finances carefully or face a forced restart.

### Staff & Operations
- **Hiring** — Recruit Network Engineers, System Admins, Security Specialists, and Facilities Managers.
- **Training & Certifications** — Enroll staff in certification programs to boost their effectiveness.
- **Shift Patterns** — Choose Day Only, Extended, or 24/7 coverage with different cost trade-offs.
- **Operations Progression** — Advance through 4 ops tiers (Manual → Monitoring → Automation → Orchestration). Higher tiers reduce incident frequency, speed up auto-resolution, lower resolve costs, and boost staff effectiveness. Unlock tiers by hiring staff, researching tech, and building reputation.

### Monitoring & Analytics
- **Event Log** — Chronological record of all data center events with severity-based color coding.
- **Capacity Planning** — Track space, power, heat, and financial runway. Monitor revenue trends over time.
- **Lifetime Statistics** — Cumulative stats including total revenue, expenses, peak temperature, uptime streaks, and more.
- **Tutorial System** — 42 contextual tips that appear as you encounter new game mechanics for the first time.

### Views & Audio
- **Cabinet View** — Standard isometric view of your data center floor.
- **Sub-Floor View** — See cooling pipes, power conduits, and infrastructure beneath the raised floor.
- **Sound Effects** — Procedural audio feedback for placement, alerts, achievements, and ambient data center hum with volume controls.

## 🎲 Incident System
- **Real-World:** Squirrels chewing cables, fiber cuts, DDoSed tenants, leaking pipes.
- **Creative:** Sentient AI outbreaks, solar flares, and quantum decoherence.
