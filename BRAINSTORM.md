# Fabric Tycoon — Feature Brainstorm

A comprehensive catalog of potential features, evaluated by gameplay impact, implementation effort, and strategic usefulness. Use this document as a reference when planning sprints and deciding what to build next.

---

## Evaluation Criteria

| Rating | Impact | Effort |
|--------|--------|--------|
| **High** | Core to the gameplay loop; without it the game feels incomplete | Multiple systems, new data models, significant UI work |
| **Medium** | Adds meaningful depth or replayability; enriches existing mechanics | Moderate scope; builds on existing infrastructure |
| **Low** | Nice-to-have; polish, flavor, or niche appeal | Small, self-contained; can be shipped independently |

---

## Tier 1 — High Impact, High Usefulness

These features are essential to making the game feel like a real tycoon experience. They directly feed the core loop of build, manage, and scale.

### Customer & Contract System

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Tenant contracts | Companies rent capacity with SLA requirements (uptime %, latency, bandwidth); missing SLAs means penalties or lost contracts | High | High | Gives revenue a *purpose*. Without customers, there's no reason to build well. This is the missing demand side of the economy. |
| Customer types | AI training (GPU-heavy), streaming (high bandwidth), crypto (cheap power), enterprise (high security); each with different demands and revenue profiles | High | Medium | Forces strategic specialization. Players can't min-max one build — different customers pull in different directions. |
| RFP bidding | Compete against rival data centers for large contracts by offering better pricing, uptime, or green certifications | Medium | Medium | Adds competitive tension and makes reputation/certifications feel rewarding. |

### Simulation & Economy Core

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Revenue generation | Servers generate income based on workload type, uptime, and SLA fulfillment | High | Medium | The game currently has costs but no income. Revenue closes the economic loop and makes every decision feel consequential. |
| Operating costs | Power bills, cooling costs, staff salaries — recurring expenses that scale with your facility | High | Medium | Creates the tycoon tension: grow too fast and costs eat you alive; grow too slow and competitors take your contracts. |
| Heat simulation | Heat levels update over time based on load, cooling type, and ambient temp; overheating damages or throttles equipment | High | Medium | Already partially built. Bringing it to life makes cooling a real strategic choice, not just a number on screen. |
| Cooling mechanics | Air vs. water vs. immersion; each with efficiency curves, failure modes, and cost profiles | High | Medium | Core to the game's identity ("The Heat/Water/Power Triangle"). This is what makes Fabric Tycoon unique. |

### Incident System

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Timer-based random events | Random event roller triggering incidents at intervals based on facility size and tier | High | Medium | Without incidents, the game is a builder with no challenge. Events create the "manage" part of the core loop. |
| Real-world incidents | Fiber cuts, squirrels chewing cables, DDoS attacks, pipe leaks, power grid brownouts | High | Medium | Grounded, relatable scenarios that data center operators actually face. Educational and fun. |
| Creative incidents | Sentient AI outbreaks, solar flares, quantum decoherence, alien signal interference | Medium | Medium | The sci-fi flavor that sets this apart from a dry simulator. Great for late-game surprise. |
| Incident resolution UI | Notification popups, resolution options (quick fix vs. proper fix), cascading failure if ignored | High | Medium | The player needs agency in how they respond. Quick fixes are cheap but risky; proper fixes cost time and money. |

---

## Tier 2 — Medium Impact, High Usefulness

These features add significant depth and replayability. They're not strictly required for an MVP but make the difference between "interesting prototype" and "game I want to keep playing."

### Research & Tech Tree

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| R&D lab | Invest money to unlock technologies: liquid immersion cooling, optical interconnects, ARM servers, custom ASICs | Medium | High | Gives players a long-term investment strategy beyond just buying more racks. |
| Tech tree branching | Three branches: efficiency (lower PUE), performance (higher compute density), resilience (better failover and redundancy) | Medium | High | Creates distinct playstyles and replayability. An efficiency-focused run plays very differently from a resilience run. |
| Patent system | Developed tech can be patented for passive income, or license others' tech at a cost | Low | Medium | Adds a secondary income stream and strategic depth, but not essential to core gameplay. |

### Economy & Finance

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Spot pricing for power | Electricity costs fluctuate with market rates; players can buy long-term contracts (stable, premium) or gamble on spot pricing (volatile, potentially cheap) | Medium | Medium | Adds a market-timing minigame. Players who pay attention to cycles get rewarded. |
| Hardware depreciation | Servers lose efficiency and value over time; refresh cycles become a strategic decision (replace now at high cost or squeeze more life out of aging hardware) | Medium | Medium | Prevents infinite scaling. Forces periodic reinvestment and creates natural decision points. |
| Loan system | Take loans for rapid expansion; interest payments eat into profit margins | Medium | Low | Simple to implement, adds meaningful early-game strategy: bootstrap slowly or leverage up and risk debt. |
| Insurance policies | Insure against specific disaster types; cheaper premiums with good safety records | Low | Low | Nice flavor and risk management layer, but not core to the experience. |

### Physical Infrastructure Layout

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Power Distribution Units (PDUs) | Place PDUs on the grid to provide power to nearby cabinets. Each PDU has a max circuit capacity (kW). Cabinets must be connected to a PDU within range. Overloading a PDU triggers breaker trips and outages. | Medium | High | Adds a real constraint to cabinet placement — you can't just build anywhere without power infrastructure. Creates circuit planning puzzles. |
| Structured Cabling | Run network cables from leaf switches to spine switches via cable trays. Cable runs have length limits and capacity constraints. Messy cabling increases incident risk (fiber cuts, accidental disconnects). | Medium | High | Makes the physical topology visible and strategic. Long or tangled cable runs are a real DC headache — modeling this adds authenticity. |
| Cable Tray System | Place overhead or under-floor cable trays as pathways for network cables. Cables must follow tray routes. Tray capacity limits force players to plan pathways and avoid bottlenecks. | Low | Medium | Visual and strategic infrastructure layer. Connects naturally to the manual cabinet placement system. |
| Hot/Cold Aisle Enforcement | Cabinets facing the same direction share a hot aisle (exhaust) or cold aisle (intake). Proper aisle separation reduces cooling costs; violations increase heat. Incentivizes row-based placement patterns. | Medium | Medium | Ties cabinet placement directly to cooling efficiency. Rewards players who plan their layout like real DC operators. |

### Workload Simulation

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| AI training jobs | Long-running GPU workloads that generate massive heat and need uninterrupted power; completion earns big payouts but failure means starting over | Medium | Medium | High-risk, high-reward mechanic that makes power and cooling failures feel devastating. |
| Traffic patterns | Day/night cycles with peak hours; streaming traffic spikes in evening, batch processing overnight | Medium | Medium | Makes time management matter. Players need to plan capacity for peaks, not just averages. |
| Workload migration | Manually or automatically migrate VMs when racks overheat or switches fail | Medium | High | Adds an active management layer during incidents. Skilled players can save workloads; new players learn the hard way. |

### Disaster & Recovery

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Backup generators | Diesel or natural gas generators with finite fuel; power outages test UPS and generator capacity | Medium | Medium | Natural extension of the incident system. Creates a preparedness mechanic: did you invest in backup power? |
| Fire suppression | Gas-based (expensive, electronics-safe) vs. water-based (cheap but destroys equipment); fires from overloaded circuits | Medium | Medium | High-stakes choice with real consequences. A water suppression system saves the building but fries the servers. |
| DR drills | Periodic failover tests; passing drills boosts reputation, failing reveals weaknesses before real incidents hit | Low | Low | Nice realism touch. Ties into reputation and compliance systems. |

---

## Tier 3 — Medium Impact, Medium Usefulness

These features enrich the world and add strategic layers, but the game can ship and be fun without them. Best added after Tier 1 and 2 are solid.

### Reputation & Market

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Reputation score | Uptime history, green energy usage, and incident response build a public reputation score affecting which customers approach you | Medium | Medium | Creates a feedback loop: good operations attract better customers, which fund better operations. |
| Stock price / valuation | A live ticker reflecting your overall performance; hitting valuation milestones unlocks investor funding rounds | Medium | Medium | Fun visual feedback and adds a secondary progression system (valuation milestones). |
| Competitor AI | Rival data center companies that bid on the same contracts, race to adopt new tech, and can poach your staff | Medium | High | Adds competitive pressure, but is complex to balance and implement well. Better as a post-launch feature. |

### Staff & HR

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Hire technicians | Network engineers, electricians, cooling specialists; each with skill levels affecting repair speed and incident prevention | Medium | Medium | Makes incident response more interesting: do you have the right person on shift? |
| Training programs | Send staff to certifications (CCNA, DCIM training) to unlock advanced infrastructure options | Low | Low | Ties into tech tree and progression, but secondary to the core mechanics. |
| Shift management | Night shift staff are cheaper but slower; understaffing during incidents causes cascading failures | Medium | Medium | Adds a resource management layer. Connects staffing decisions to incident outcomes. |

### Environmental & Regulatory

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Carbon footprint tracker | Government carbon taxes scale with fossil fuel usage; green certifications (LEED, Energy Star) attract premium tenants | Medium | Medium | Timely and relevant. Creates a real trade-off between cheap fossil power and expensive-but-marketable green energy. |
| Water usage management | Water-cooled systems draw from local supply; droughts create crises and force fallback to less efficient air cooling | Medium | Medium | Connects to real-world concerns and ties nicely into the cooling mechanics. |
| Zoning & permits | Expanding requires city permits that take time and money; community opposition if too noisy or power-hungry | Low | Medium | Adds realism but can feel like busywork if not carefully designed. |
| E-waste disposal | Decommissioned hardware must be recycled or disposed of properly, with cost and reputation implications | Low | Low | Nice flavor, connects to reputation and environmental systems. |

### Physical Security & Compliance

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Security tiers | Biometric access, mantrap entries, CCTV coverage; higher security unlocks government and finance contracts | Medium | Medium | Ties into customer types — government contracts require high security. Adds a spending category with clear ROI. |
| Compliance certifications | SOC 2, HIPAA, PCI-DSS; each requires specific infrastructure (isolated cages, encrypted networking) and ongoing audits | Medium | Medium | Creates infrastructure requirements that constrain building choices in interesting ways. |
| Physical intrusion events | Social engineering attempts, tailgating incidents, break-in attempts | Low | Low | Fun incident variety, but niche compared to operational incidents. |

---

## Tier 4 — Lower Impact, Nice-to-Have

These features add polish, replayability, and community value. They're best tackled once core gameplay is strong.

### Multi-Site Expansion

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Multiple locations | Build data centers in different regions (US-East, EU-West, Asia-Pacific) with different power costs, climate, and regulations | Medium | High | Massive scope expansion. Exciting but essentially a "game 2" built on top of the core. Save for late development. |
| Inter-site networking | Connect sites via dark fiber or leased lines; latency matters for workloads that span regions | Low | High | Only relevant once multi-site exists. Cool but very complex. |
| Edge deployments | Small edge PoPs in cities for low-latency content delivery, feeding into main facilities | Low | Medium | Interesting concept but requires multi-site to be meaningful. |

### Social & Meta

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| Achievement system | Milestone badges: "365 days without downtime", "Reached Tier 3 in under 1 hour", "Zero carbon footprint" | Medium | Low | Cheap to implement, adds replayability and goals for completionists. High value-to-effort ratio. |
| Sandbox mode | Unlimited budget, all tech unlocked, no incidents — pure creative building | Medium | Low | Easy to implement (just disable constraints). Great for players who want to experiment. |
| Scenario challenges | Pre-built scenarios: "Recover from catastrophic flood", "Build zero-emission facility", "Handle Black Friday traffic surge" | Medium | Medium | Structured gameplay that doesn't require the full sandbox. Good for onboarding advanced mechanics. |
| Leaderboards | Compare PUE, uptime, revenue, or green energy % with other players | Low | Medium | Requires backend infrastructure. Fun but only meaningful with an active player base. |

---

## Recommended Build Order

A suggested sequencing that layers features for maximum impact at each stage:

### Phase 1 — Close the Loop (make it a playable tycoon)
1. Revenue generation from running servers
2. Operating cost simulation (power bills, cooling)
3. Heat simulation (dynamic, load-based)
4. Cooling mechanics (air vs. water trade-offs)
5. Basic tenant contracts (SLA + income)

### Phase 2 — Add Challenge (make it engaging)
6. Incident system (random events + resolution UI)
7. Backup generators and fire suppression
8. Customer types with different demands
9. Day/night traffic patterns

### Phase 3 — Add Depth (make it strategic)
10. Tech tree with R&D investment
11. Spot power pricing and hardware depreciation
12. Reputation score affecting customer quality
13. Loan system for early expansion
14. Power distribution and structured cabling (builds on manual cabinet placement)

### Phase 4 — Add World (make it immersive)
14. Staff & HR with skill levels
15. Carbon footprint and environmental regulation
16. Security tiers and compliance certifications
17. Competitor AI

### Phase 5 — Add Longevity (make it replayable)
18. Achievement system
19. Sandbox mode
20. Scenario challenges
21. Multi-site expansion

---

## Quick Reference: Effort vs. Impact Matrix

```
                        LOW EFFORT          MEDIUM EFFORT         HIGH EFFORT
                   ┌──────────────────┬──────────────────┬──────────────────┐
                   │                  │                  │                  │
    HIGH IMPACT    │  Loan system     │  Revenue gen     │  Tenant          │
                   │                  │  Operating costs │   contracts      │
                   │                  │  Heat simulation │                  │
                   │                  │  Incidents       │                  │
                   │                  │  Cooling mechs   │                  │
                   ├──────────────────┼──────────────────┼──────────────────┤
                   │                  │                  │                  │
    MEDIUM IMPACT  │  Achievements    │  Spot pricing    │  Tech tree       │
                   │  Sandbox mode    │  Depreciation    │  Competitor AI   │
                   │  DR drills       │  Traffic patterns│  Workload        │
                   │  Insurance       │  Reputation      │   migration      │
                   │  Training progs  │  Backup gens     │  PDUs & Power    │
                   │                  │  Fire suppress   │   distribution   │
                   │                  │  Carbon tracker  │  Structured      │
                   │                  │  Security tiers  │   cabling        │
                   │                  │  Hot/cold aisle  │                  │
                   ├──────────────────┼──────────────────┼──────────────────┤
                   │                  │                  │                  │
    LOW IMPACT     │  E-waste         │  Zoning/permits  │  Inter-site      │
                   │  Intrusion evts  │  Scenarios       │   networking     │
                   │                  │  Edge deploys    │                  │
                   │                  │  Leaderboards    │                  │
                   │                  │  Water mgmt      │                  │
                   └──────────────────┴──────────────────┴──────────────────┘
```

**Best bets (high impact, low-medium effort):** Revenue generation, operating costs, heat simulation, cooling mechanics, incidents, loan system.

**Hidden gems (medium impact, low effort):** Achievements, sandbox mode, DR drills, training programs.

**Avoid early (high effort, lower payoff):** Multi-site expansion, inter-site networking, competitor AI.
