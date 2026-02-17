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
- **Cooling** — Air cooling (free, basic) or Water cooling ($25K upgrade, 75% more effective). Weather and season affect cooling demand.
- **PDUs & Cable Trays** — Place power distribution units and cable management. Overloaded PDUs cause heat; messy cables reduce revenue.
- **Hot/Cold Aisles** — Alternate cabinet facing for cooling efficiency bonuses.

### Networking
- **Clos Fabric** — Build a Spine-Leaf network. Every leaf switch connects to every spine via ECMP for fault-tolerant traffic routing.
- **Meet-Me Room** — Install an interconnection facility to earn passive revenue from network tenants. Add ports to increase capacity.
- **Network Peering** — Establish peering agreements (Free Peering, Paid Peering, Transit, IX Port) to reduce latency and improve reputation.

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
- **Suite Tiers** — Scale from Starter (4x2 grid) to Enterprise (10x5 grid) by purchasing upgrades.
- **Tech Tree** — Research 9 technologies across Efficiency, Performance, and Resilience branches.
- **Reputation** — Build reputation from Unknown to Legendary through uptime, SLA compliance, and incident management.
- **Achievements** — Unlock 67 achievements for milestones across all game systems.
- **Scenarios** — Play themed challenges with specific goals and constraints.

### Staff & Operations
- **Hiring** — Recruit Network Engineers, System Admins, Security Specialists, and Facilities Managers.
- **Training & Certifications** — Enroll staff in certification programs to boost their effectiveness.
- **Shift Patterns** — Choose Day Only, Extended, or 24/7 coverage with different cost trade-offs.
- **Operations Progression** — Advance through 4 ops tiers (Manual → Monitoring → Automation → Orchestration). Higher tiers reduce incident frequency, speed up auto-resolution, lower resolve costs, and boost staff effectiveness. Unlock tiers by hiring staff, researching tech, and building reputation.

### Monitoring & Analytics
- **Event Log** — Chronological record of all data center events with severity-based color coding.
- **Capacity Planning** — Track space, power, heat, and financial runway. Monitor revenue trends over time.
- **Lifetime Statistics** — Cumulative stats including total revenue, expenses, peak temperature, uptime streaks, and more.
- **Tutorial System** — Contextual tips that appear as you encounter new game mechanics for the first time.

## 🎲 Incident System
- **Real-World:** Squirrels chewing cables, fiber cuts, DDoSed tenants, leaking pipes.
- **Creative:** Sentient AI outbreaks, solar flares, and quantum decoherence.
