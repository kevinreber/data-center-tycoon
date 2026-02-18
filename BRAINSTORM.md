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

### Multi-Site Expansion (see Phase 6 Detailed Design below)

| Feature | Description | Impact | Effort | Why it matters |
|---------|-------------|--------|--------|----------------|
| World map view | Stylized global map showing all sites, demand heat maps, inter-site connections; neon/terminal aesthetic with glowing nodes and animated links | High | High | Transforms the game from facility management into global infrastructure strategy. The visual anchor for the entire multi-site system. |
| Metro regions with trade-offs | 12-15 named locations with distinct profiles (power cost, climate, disaster risk, labor market, customer demand, regulations, tax incentives) | High | High | Location-based strategy is the core of multi-site. Bay Area = premium customers + earthquake risk; Iceland = free cooling + high latency. Every location is a trade-off. |
| Site types (Edge/Colo/Hyperscale/IXP/DR) | Multiple facility types serving different strategic purposes — from lightweight edge PoPs to full hyperscale campuses | High | High | Not every site needs to be a full DC. Edge PoPs are cheap entry points; IXPs generate peering revenue; DR sites enable compliance contracts. |
| Inter-site networking (DCN) | Dark fiber, leased wavelengths, IP transit, submarine cables connecting sites; latency modeling matters for multi-region contracts | Medium | High | The connective tissue of multi-site. Enables multi-region contracts and DR failover. |
| Customer demand geography | Demand heat maps showing where customer types concentrate; proximity to demand = latency bonuses + contract priority | Medium | Medium | Drives strategic site selection — build where the customers are, or build cheap and accept higher latency. |
| Location-specific incidents | Earthquakes (Bay Area), hurricanes (Gulf), grid instability (Texas), volcanic activity (Iceland), monsoons (Singapore) | Medium | Medium | Gives location choice real consequences. Cheap Nordic cooling is great until a volcanic event threatens your site. |
| Edge PoPs & CDN | Lightweight 1-2 cabinet sites for low-latency content delivery; per-Gbps transit fees; backhaul to core sites | Medium | Medium | Easiest entry point to multi-site thinking. Teaches players network topology at a global scale before committing to full expansion. |

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

### Phase 1 — Close the Loop (make it a playable tycoon) ✅
1. ~~Revenue generation from running servers~~
2. ~~Operating cost simulation (power bills, cooling)~~
3. ~~Heat simulation (dynamic, load-based)~~
4. ~~Cooling mechanics (air vs. water trade-offs)~~
5. ~~Basic tenant contracts (SLA + income)~~

### Phase 2 — Add Challenge (make it engaging) ✅
6. ~~Incident system (random events + resolution UI)~~
7. ~~Backup generators and fire suppression~~
8. ~~Customer types with different demands~~
9. ~~Day/night traffic patterns~~

### Phase 3 — Add Depth (make it strategic) ✅
10. ~~Tech tree with R&D investment~~
11. ~~Spot power pricing and hardware depreciation~~
12. ~~Reputation score affecting customer quality~~
13. ~~Loan system for early expansion~~
14. ~~Power distribution and structured cabling~~

### Phase 4 — Add World (make it immersive) ✅
15. ~~Staff & HR with skill levels~~
16. ~~Carbon footprint and environmental regulation~~
17. ~~Security tiers and compliance certifications~~
18. ~~Competitor AI~~

### Phase 5 — Add Longevity (make it replayable) ✅
19. ~~Achievement system~~ (89 achievements implemented)
20. ~~Sandbox mode~~
21. ~~Scenario challenges~~ (5 scenarios)
22. Multi-site expansion (Phase 6A store/types done, 6B–6D pending)

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

---

## Phase 4 — Detailed Design: Add World (make it immersive)

Phases 1–3 are complete. The game has a working economic loop (revenue, costs, contracts), challenge layer (incidents, generators, fire suppression), and strategic depth (tech tree, spot pricing, depreciation, reputation, loans). Phase 4 adds the "world" around your data center — people who work there, the environment you operate in, the regulations you must comply with, and competitors vying for the same customers.

---

### 4A. Staff & HR System

**Goal:** Make your data center feel *staffed*. Technicians respond to incidents, manage equipment, and unlock advanced operations. Understaffing creates risk; overstaffing eats margins.

#### Data Models

```typescript
type StaffRole = 'network_engineer' | 'electrician' | 'cooling_specialist' | 'security_officer'
type StaffSkillLevel = 1 | 2 | 3  // junior, mid, senior

interface StaffMember {
  id: string
  name: string                    // procedurally generated
  role: StaffRole
  skillLevel: StaffSkillLevel
  salaryPerTick: number           // recurring cost
  hiredAtTick: number             // when they joined
  onShift: boolean                // whether currently working
  certifications: string[]        // unlocked via training (ties to tech tree)
  incidentsResolved: number       // track record
  fatigueLevel: number            // 0–100, increases during incidents
}

interface StaffRoster {
  members: StaffMember[]
  maxStaff: number                // limited by suite tier
  shiftPattern: 'day_only' | 'day_night' | 'round_the_clock'
  trainingQueue: StaffTraining[]
}

interface StaffTraining {
  staffId: string
  certification: string           // e.g. 'ccna', 'dcim_certified', 'fire_safety'
  ticksRemaining: number
  cost: number
}
```

#### Staff Role Configs

| Role | Base Salary/tick | Effect | Scaling |
|------|-----------------|--------|---------|
| Network Engineer | $4/tick | Incidents with `traffic_drop` or `power_surge` effects resolve 25%/40%/60% faster (by skill level) | Each NE also adds +2% traffic capacity |
| Electrician | $3/tick | Reduces power surge damage, generator startup 1 tick faster per skill level | Enables PDU maintenance (prevents overload incidents) |
| Cooling Specialist | $3/tick | Cooling efficiency +5%/10%/15% per specialist | Required for immersion cooling (tech tree gate) |
| Security Officer | $5/tick | Required for security tier compliance (see 4C), reduces physical intrusion events | Enables biometric/mantrap upgrades |

#### Shift System

- **Day Only** (free): Staff work during game hours 06:00–22:00. Incidents at night have no staff response — resolution takes 2x longer or auto-resolves with penalties.
- **Day + Night** ($500/tick overhead): Two shifts. Night shift staff have -20% effectiveness (fatigue). Covers full 24h.
- **Round the Clock** ($1200/tick overhead): Three 8-hour shifts. Full effectiveness 24/7. Requires 50% more staff.

#### Training & Certifications

| Certification | Cost | Duration | Prereq | Effect |
|--------------|------|----------|--------|--------|
| CCNA | $3,000 | 30 ticks | Network Engineer | +15% traffic optimization |
| DCIM Certified | $2,500 | 25 ticks | Any role | Staff member monitors 2x equipment range |
| Fire Safety | $1,500 | 15 ticks | Any role | +10% fire suppression effectiveness |
| Immersion Cert | $5,000 | 40 ticks | Cooling Specialist | Required to operate immersion cooling |
| High Voltage | $4,000 | 35 ticks | Electrician | Can manage enterprise-tier power loads |

#### Gameplay Integration

- **Incident resolution:** Without staff, incidents auto-resolve at their normal duration. Each relevant staff member reduces resolution time by their skill percentage. Unresolved critical incidents with no staff on shift trigger cascading failures.
- **Fatigue:** Staff handling back-to-back incidents accumulate fatigue. At 80+ fatigue, effectiveness drops 50%. At 100, staff member is unavailable for 20 ticks (burnout recovery).
- **Suite tier gates:** Starter = 2 max staff, Standard = 4, Professional = 8, Enterprise = 16.
- **Achievements:** "First Hire", "Full Staff", "Zero Fatigue" (complete 10 incidents without any staff burnout), "Certified Team" (all staff have at least one certification).

---

### 4B. Carbon Footprint & Environmental Regulation

**Goal:** Create a tension between cheap fossil power and expensive green energy. Carbon taxes scale up over time, and green certifications unlock premium customers.

#### Data Models

```typescript
type EnergySource = 'grid_mixed' | 'grid_green' | 'onsite_solar' | 'onsite_wind'

interface CarbonState {
  currentSource: EnergySource
  carbonEmissionsPerTick: number     // tons CO2 equivalent per tick
  lifetimeEmissions: number          // cumulative total
  carbonTaxRate: number              // $/ton, increases over time
  carbonTaxPerTick: number           // current carbon tax bill per tick
  greenCertification: GreenCert | null
  waterUsagePerTick: number          // gallons/tick (for water cooling)
  waterCostPerTick: number           // water utility bill
  eWasteStockpile: number           // decommissioned equipment count
  eWasteDisposalCost: number        // cost to properly recycle
}

type GreenCert = 'energy_star' | 'leed_silver' | 'leed_gold' | 'carbon_neutral'

interface EnergySourceConfig {
  source: EnergySource
  label: string
  description: string
  costMultiplier: number        // multiplier on base power cost
  carbonPerKW: number           // CO2 tons per kW per tick
  installCost: number           // one-time cost to switch
  reliability: number           // 0–1, chance of availability per tick (solar/wind are variable)
  color: string
}
```

#### Energy Source Configs

| Source | Cost Mult | Carbon/kW | Install Cost | Reliability | Notes |
|--------|-----------|-----------|-------------|-------------|-------|
| Grid (Mixed) | 1.0x | 0.0008 | $0 | 1.0 | Default. Coal/gas/nuclear mix. |
| Grid (Green) | 1.4x | 0.0001 | $5,000 | 1.0 | Contract for renewable grid power. Premium price. |
| On-site Solar | 0.6x | 0.0 | $80,000 | 0.35 | Free power when available but only 35% of the time. Need grid backup. |
| On-site Wind | 0.7x | 0.0 | $60,000 | 0.45 | Slightly better availability than solar. |

#### Carbon Tax Escalation

```
Ticks 0–200:    $0/ton (grace period)
Ticks 200–500:  $2/ton (introduction)
Ticks 500–1000: $5/ton (regulation tightens)
Ticks 1000+:    $10/ton (aggressive policy)
```

Carbon tax scales with facility size — a 50-cabinet hyperscale on grid_mixed will pay significantly more than a smaller green facility.

#### Green Certifications

| Certification | Requirement | Cost | Effect |
|--------------|-------------|------|--------|
| Energy Star | PUE ≤ 1.4 for 100 consecutive ticks | $10,000 | +10% contract revenue, unlock green customer type |
| LEED Silver | Energy Star + ≤50% grid_mixed usage | $25,000 | +15% contract revenue, -5% carbon tax |
| LEED Gold | LEED Silver + on-site renewable covering ≥30% load | $50,000 | +25% contract revenue, -15% carbon tax |
| Carbon Neutral | Zero net carbon for 200 consecutive ticks | $100,000 | +40% contract revenue, carbon tax exempt, unlock "Green Data Center" customer tier |

#### Water Usage (ties to existing cooling system)

- Air cooling: 0 gallons/tick water usage.
- Water cooling: 2 gallons/tick per cabinet. Water costs $0.10/gallon/tick.
- **Drought events** (new incident type): Water supply reduced. Water-cooled facilities must either pay premium water rates (3x) or temporarily switch to air cooling at reduced capacity.
- Immersion cooling (tech tree): Uses sealed dielectric fluid — zero water, zero carbon from cooling.

#### E-Waste

- When servers are refreshed (depreciation system), old hardware goes to the e-waste stockpile.
- Stockpile > 10 items: -2 reputation per tick (environmental concern).
- Proper disposal: $500/unit, clears stockpile, +1 reputation.
- Improper disposal: $100/unit, clears stockpile, -5 reputation, chance of "EPA Investigation" incident.

#### Gameplay Integration

- **Carbon tax** is a new line item in the per-tick expenses (alongside power, cooling, loans, staff).
- **Green certifications** act like reputation tiers but specific to environmental performance. They attract a new "Green Enterprise" customer type with premium revenue but strict environmental SLAs.
- **Water costs** add meaningful expense to water cooling, creating a genuine trade-off (better cooling vs. higher water bill + drought vulnerability).
- **Achievements:** "First Solar Panel", "Carbon Neutral" (zero emissions for 200 ticks), "Water Wise" (operate 100 ticks with no water usage), "Clean Sweep" (dispose of 50 e-waste units properly).

---

### 4C. Security Tiers & Compliance Certifications

**Goal:** Gate premium customer types (government, finance, healthcare) behind security investments. Create a spending category with clear ROI — security infrastructure is expensive but unlocks the most lucrative contracts.

#### Data Models

```typescript
type SecurityTier = 'basic' | 'enhanced' | 'high_security' | 'maximum'

interface SecurityState {
  currentTier: SecurityTier
  installedFeatures: SecurityFeature[]
  complianceCerts: ComplianceCert[]
  auditCooldown: number              // ticks until next audit allowed
  lastAuditResult: 'pass' | 'fail' | null
  intrusionAttempts: number          // lifetime count
  intrusionsBlocked: number          // lifetime count
}

type SecurityFeatureId = 'cctv' | 'badge_access' | 'biometric' | 'mantrap' | 'cage_isolation' | 'encrypted_network' | 'security_noc'

interface SecurityFeature {
  id: SecurityFeatureId
  label: string
  description: string
  cost: number                  // one-time install cost
  maintenanceCost: number       // per-tick operating cost
  requiredTier: SecurityTier    // minimum tier this feature belongs to
  intrusionDefense: number      // 0–1, reduction in intrusion event chance
}

type ComplianceCertId = 'soc2_type1' | 'soc2_type2' | 'hipaa' | 'pci_dss' | 'fedramp'

interface ComplianceCert {
  id: ComplianceCertId
  label: string
  description: string
  requirements: {
    minSecurityTier: SecurityTier
    requiredFeatures: SecurityFeatureId[]
    minReputation: number
    minStaff: number              // security officers required
  }
  auditCost: number              // cost per audit
  auditInterval: number          // must re-audit every N ticks
  contractTypes: string[]        // unlocks these contract types
  revenueBonus: number           // multiplier on qualifying contracts
}
```

#### Security Tier Progression

| Tier | Cost | Maintenance/tick | Features Included | Unlocks |
|------|------|-----------------|-------------------|---------|
| Basic | $0 | $0 | Badge access | Standard contracts |
| Enhanced | $15,000 | $8/tick | + CCTV, badge access | SOC 2 Type I eligible, enterprise contracts |
| High Security | $50,000 | $20/tick | + Biometric, mantrap | HIPAA/PCI-DSS eligible, finance contracts |
| Maximum | $150,000 | $45/tick | + Cage isolation, encrypted network, security NOC | FedRAMP eligible, government contracts |

#### Compliance Certifications

| Cert | Security Tier | Required Features | Min Reputation | Audit Cost | Audit Interval | Revenue Bonus | Unlocked Contracts |
|------|--------------|-------------------|---------------|------------|----------------|---------------|-------------------|
| SOC 2 Type I | Enhanced | CCTV, badge_access | 40 | $8,000 | 200 ticks | +15% | Enterprise SaaS |
| SOC 2 Type II | Enhanced | CCTV, badge_access | 50 | $15,000 | 300 ticks | +25% | Enterprise + Financial |
| HIPAA | High Security | biometric, cage_isolation | 60 | $20,000 | 250 ticks | +30% | Healthcare data |
| PCI-DSS | High Security | encrypted_network, cage_isolation | 55 | $18,000 | 200 ticks | +35% | Payment processing |
| FedRAMP | Maximum | All features | 75 | $50,000 | 400 ticks | +50% | Government contracts |

#### Physical Intrusion Events (new incident type)

- **Tailgating** (minor): Someone follows an employee through a secure door. -2 reputation. Basic security has no defense; each tier above reduces chance by 30%.
- **Social Engineering** (major): Attacker tricks staff into granting access. Revenue penalty for 10 ticks. Security officers reduce chance by 20% per officer.
- **Break-in Attempt** (critical): Physical intrusion attempt. If successful: equipment damage + data breach (massive reputation hit). Security features stack defense: CCTV (20%), biometric (25%), mantrap (30%), cage isolation (15%), security NOC (10%).

#### Compliance Audit Mechanic

- Player can trigger an audit when requirements are met.
- Audit costs money and takes 10 ticks.
- If requirements aren't met during the audit window, audit fails — money lost, must wait cooldown before retrying.
- Certifications expire if not re-audited, losing access to gated contracts.
- Passing audits grants reputation bonus (+5 per cert).

#### New Contract Types (gated by security)

| Contract | Required Cert | Revenue/tick | Duration | SLA |
|----------|--------------|-------------|----------|-----|
| HealthNet EMR | HIPAA | $80/tick | 400 ticks | max temp 68°C, 99.9% uptime |
| TradeFast HFT | PCI-DSS | $90/tick | 350 ticks | max temp 65°C, zero incidents |
| GovSecure Cloud | FedRAMP | $120/tick | 500 ticks | max temp 65°C, max 1 incident |
| PayStream Processing | PCI-DSS | $75/tick | 300 ticks | max temp 70°C, zero security events |

#### Gameplay Integration

- **Expense layer:** Security maintenance is a new per-tick cost line, sitting alongside power, cooling, staff, and carbon tax.
- **Contract gating:** The most lucrative contracts (government, healthcare, finance) are unavailable until you achieve the required security tier and compliance certification. This creates a clear investment→return pipeline.
- **Reputation interaction:** Security incidents tank reputation faster than operational incidents. Compliance certifications provide a reputation floor (can't drop below cert's min reputation while certified).
- **Staff requirement:** Security officers are required for higher tiers and compliance. Ties directly into the Staff & HR system.
- **Achievements:** "Locked Down" (reach High Security tier), "Fully Compliant" (hold 3+ certifications simultaneously), "Fort Knox" (block 10 intrusion attempts), "Government Contractor" (complete a FedRAMP contract).

---

### 4D. Competitor AI

**Goal:** Add competitive pressure. Rival data center companies bid on the same contracts, race to adopt technology, and keep the player from getting complacent. The competitor isn't a full simulation — it's a "ghost" that creates market pressure through contract competition and market pricing.

#### Data Models

```typescript
interface Competitor {
  id: string
  name: string                    // e.g. "NexGen Data", "CloudVault Inc", "TerraHost"
  personality: CompetitorPersonality
  strength: number                // 0–100, overall capability score (scales with game time)
  specialization: CustomerType    // what market segment they focus on
  reputationScore: number         // their public reputation
  securityTier: SecurityTier      // their security level
  greenCert: GreenCert | null     // their environmental status
  aggression: number              // 0–1, how aggressively they bid on contracts
  techLevel: number               // 0–9, how many techs they've "researched"
}

type CompetitorPersonality =
  | 'budget'       // undercuts on price, low quality
  | 'premium'      // high quality, charges more
  | 'green'        // environmental focus
  | 'aggressive'   // rapid expansion, risky plays
  | 'steady'       // slow and reliable growth

interface CompetitorBid {
  competitorId: string
  contractType: string
  bidMultiplier: number           // 0.7–1.3, where 1.0 is fair market rate
  winChance: number               // 0–1, calculated from competitor stats vs player
}
```

#### Competitor Behaviors

| Personality | Bidding | Growth | Weakness |
|-------------|---------|--------|----------|
| Budget | Undercuts by 20–30%, wins on price | Slow, cheap infrastructure | Frequent incidents, low reputation → loses premium clients |
| Premium | Bids at market rate, wins on quality | Invests heavily in security + cooling | Slow to scale, vulnerable to being outgrown |
| Green | Premium pricing, targets eco-conscious clients | Invests in renewables early | High costs, can't compete on price for standard contracts |
| Aggressive | Outbids by 10–15% | Fast expansion, takes loans | High debt, collapses if hit by major incidents |
| Steady | Fair pricing, consistent | Gradual scaling, good reputation | Never dominates any segment, beatable by specialization |

#### Contract Competition

When contracts appear in the offer pool, competitors may also bid:
- Player sees "CompetitorX is also bidding on this contract" in the contract UI.
- If the player doesn't accept within a window (10 ticks), the competitor may win it.
- Competitor win chance = `(competitor.strength + competitor.reputation) / (player.reputation + player.cabinets * 2 + player.securityTier_bonus)`.
- Lost contracts to competitors generate a notification: "NexGen Data won the MegaBank contract."

#### Competitor Scaling

Competitors grow over time to match the player:
```
Ticks 0–100:     1 competitor (Budget personality, weak)
Ticks 100–300:   2 competitors (+ a random personality)
Ticks 300–600:   3 competitors (all strengthening)
Ticks 600+:      3 competitors at near-player strength
```

Competitors grow faster when the player is doing well (rubber-banding) and slower when the player is struggling (mercy mechanic). This keeps the game challenging without being punishing.

#### Competitor Events

- **Price War:** An aggressive competitor slashes prices. All contract revenue reduced by 15% for 30 ticks.
- **Poaching Attempt:** A competitor tries to hire one of your staff. If you don't counter-offer (2x salary for 20 ticks), you lose the staff member.
- **Market Report:** Quarterly report shows market share pie chart (player vs. competitors). Reaching 50% market share unlocks "Market Leader" achievement.
- **Competitor Incident:** A competitor has a major outage. Their contracts become available to you at premium rates for 20 ticks.

#### Gameplay Integration

- **Contract system:** Competitors add time pressure to accepting contracts. The "bid window" mechanic prevents players from hoarding offers.
- **Reputation:** Competitors with higher reputation steal better contracts. Motivates maintaining high uptime and resolving incidents quickly.
- **Difficulty scaling:** Competitors provide natural difficulty progression without arbitrary difficulty settings.
- **Info panel:** New "Market" tab in HUD showing competitor status, market share, and active bids.
- **Achievements:** "Market Leader" (50% market share), "Monopoly" (win 5 contracts competitors bid on), "Underdog" (win a contract against a competitor with higher reputation), "Rivalry" (outperform all competitors for 100 consecutive ticks).

---

### Phase 4 — Recommended Implementation Order

The four Phase 4 systems have dependencies. Build them in this order:

1. **Staff & HR** (standalone, no dependencies on other Phase 4 features)
   - Adds depth to incident resolution immediately
   - Required by Security Tiers (security officers)
   - Medium effort, high integration with existing incident system

2. **Carbon Footprint & Environmental** (depends on existing cooling/power systems)
   - Adds new expense categories and energy source choices
   - Water costs add trade-off depth to water cooling
   - E-waste connects to existing hardware depreciation
   - Medium effort, builds naturally on Phase 3 systems

3. **Security Tiers & Compliance** (depends on Staff & HR for security officers)
   - Gates premium contracts behind investment
   - New incident types (intrusion events)
   - Creates clear ROI investment pipeline
   - Medium-high effort, significant new contract types

4. **Competitor AI** (benefits from all other Phase 4 systems)
   - Creates market pressure and time constraints
   - Leverages reputation, security, and green certs for bidding
   - Highest effort, but ties everything together
   - Should be last because it references all other systems

### Phase 4 — Estimated Effort Summary

| Feature | New Types | New Constants | Store Fields | Tick Logic | HUD Panels | Achievements |
|---------|-----------|--------------|-------------|------------|------------|-------------|
| Staff & HR | 5 | 3 configs | ~8 fields, 5 actions | Fatigue, shift, training | Staff panel, training UI | 4 |
| Carbon/Environment | 4 | 4 configs | ~10 fields, 4 actions | Carbon tax, water, e-waste | Energy panel, carbon tracker | 4 |
| Security & Compliance | 4 | 5 configs | ~7 fields, 4 actions | Audit, intrusion | Security panel, compliance UI | 4 |
| Competitor AI | 3 | 1 config | ~5 fields, 2 actions | Bidding, growth, events | Market panel | 4 |

---

## Phase 5 — New Feature Ideas

These features go beyond the original Phase 4 plan and add new strategic dimensions, quality-of-life improvements, and economic depth.

---

### 5A. Supply Chain & Procurement

**Goal:** Hardware has lead times, bulk discounts, and occasional shortages. Forces players to plan ahead rather than buy-on-demand.

#### Data Models

```typescript
type OrderStatus = 'pending' | 'in_transit' | 'delivered'

interface HardwareOrder {
  id: string
  itemType: 'server' | 'leaf_switch' | 'spine_switch' | 'cabinet'
  quantity: number
  unitCost: number
  totalCost: number
  leadTimeTicks: number
  ticksRemaining: number
  status: OrderStatus
  orderedAtTick: number
}

interface SupplyChainState {
  pendingOrders: HardwareOrder[]
  inventory: Record<string, number>  // itemType → count in stock
  supplyShortageActive: boolean
  shortagePriceMultiplier: number    // 1.0–3.0x
  bulkDiscountThreshold: number      // quantity for discount
  bulkDiscountRate: number           // 0.85 = 15% off
}
```

#### Supply Chain Configs

| Item | Base Lead Time | Shortage Lead Time | Bulk Threshold | Bulk Discount |
|------|---------------|-------------------|----------------|--------------|
| Server | 3 ticks | 8 ticks | 10+ | 15% off |
| Leaf Switch | 5 ticks | 12 ticks | 5+ | 10% off |
| Spine Switch | 8 ticks | 20 ticks | 3+ | 12% off |
| Cabinet | 2 ticks | 5 ticks | 8+ | 20% off |

#### Shortage Events
- **Chip Shortage** (new incident type): Server prices spike 2-3x, lead times double. Duration: 30-50 ticks.
- **Supply Glut**: Prices drop 20%, lead times halved. Duration: 20-30 ticks.

#### Gameplay Integration
- Players order hardware in advance via a Procurement panel.
- Orders arrive after lead time; delivered items go to inventory.
- Building from inventory is instant; building without inventory triggers an order with lead time.
- Bulk discounts reward planning ahead.
- **Achievements:** "Bulk Buyer" (place a bulk order), "Stockpile" (have 20+ items in inventory), "Shortage Survivor" (build 5 cabinets during a chip shortage), "Just In Time" (never have more than 2 items in inventory for 200 ticks).

---

### 5B. Weather System

**Goal:** Ambient temperature varies by season and weather events. Makes cooling strategy seasonal and adds environmental variety.

#### Data Models

```typescript
type Season = 'spring' | 'summer' | 'autumn' | 'winter'
type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'storm' | 'heatwave' | 'cold_snap'

interface WeatherState {
  currentSeason: Season
  currentCondition: WeatherCondition
  ambientTempModifier: number       // added to SIM.ambientTemp
  solarEfficiency: number           // 0–1, affects solar panel output
  windEfficiency: number            // 0–1, affects wind turbine output
  conditionTicksRemaining: number   // ticks until weather changes
  seasonTickCounter: number         // ticks into current season
}
```

#### Season Configs

| Season | Ambient Modifier | Solar Eff | Wind Eff | Duration |
|--------|-----------------|-----------|----------|----------|
| Spring | +2°C | 0.6 | 0.7 | 200 ticks |
| Summer | +8°C | 0.9 | 0.4 | 200 ticks |
| Autumn | +0°C | 0.5 | 0.8 | 200 ticks |
| Winter | -5°C | 0.3 | 0.9 | 200 ticks |

#### Weather Conditions

| Condition | Ambient Mod | Solar | Wind | Duration | Chance |
|-----------|------------|-------|------|----------|--------|
| Clear | 0°C | 1.0x | 0.8x | 10-20 ticks | 30% |
| Cloudy | -1°C | 0.5x | 1.0x | 8-15 ticks | 25% |
| Rain | -2°C | 0.3x | 1.2x | 5-12 ticks | 20% |
| Storm | -3°C | 0.1x | 0.2x | 3-8 ticks | 10% |
| Heatwave | +10°C | 1.2x | 0.3x | 8-15 ticks | 10% |
| Cold Snap | -8°C | 0.4x | 1.0x | 5-10 ticks | 5% |

#### Gameplay Integration
- Ambient temperature = SIM.ambientTemp + season modifier + weather modifier.
- Summer heatwaves stress cooling systems; winter cold snaps enable "free cooling."
- Solar/wind output (ties to Phase 4B energy sources) varies with weather.
- Storm events can trigger power-related incidents.
- **Achievements:** "Four Seasons" (survive all 4 seasons), "Heatwave Survivor" (keep all temps below 80°C during a heatwave), "Free Cooling" (operate at PUE < 1.1 during winter).

---

### 5C. Interconnection / Meet-Me Room

**Goal:** A dedicated cross-connect space where tenants peer with each other and connect to ISPs. Generates passive interconnection revenue with network effects.

#### Data Models

```typescript
interface MeetMeRoom {
  installed: boolean
  installCost: number
  portCapacity: number
  activeConnections: InterconnectPort[]
  revenuePerPort: number
  maintenanceCost: number
}

interface InterconnectPort {
  id: string
  tenantName: string
  portType: 'copper_1g' | 'fiber_10g' | 'fiber_100g'
  revenuePerTick: number
  installedAtTick: number
}
```

#### Port Configs

| Port Type | Install Cost | Revenue/tick | Capacity Used |
|-----------|-------------|-------------|---------------|
| Copper 1G | $500 | $3/tick | 1 port |
| Fiber 10G | $2,000 | $10/tick | 1 port |
| Fiber 100G | $8,000 | $35/tick | 2 ports |

#### Meet-Me Room Tiers

| Tier | Install Cost | Port Capacity | Maintenance/tick |
|------|-------------|--------------|-----------------|
| Basic | $15,000 | 12 ports | $5/tick |
| Standard | $40,000 | 24 ports | $12/tick |
| Premium | $100,000 | 48 ports | $25/tick |

#### Network Effects
- Revenue per port increases by 2% for every 4 active ports (more tenants = more valuable peering).
- Cabinets with cross-connects nearby get +5% revenue (better connectivity).

#### Gameplay Integration
- Unlocked at Standard suite tier.
- New "Interconnection" panel in HUD.
- Passive revenue stream independent of server workloads.
- **Achievements:** "Peering Point" (install meet-me room), "Network Hub" (fill all ports), "Interconnection Revenue" (earn $500 total from ports).

---

### 5D. Custom Server Configurations

**Goal:** Instead of generic servers, players spec CPU-heavy, GPU-heavy, storage-dense, or balanced builds. Different configs serve different customer types better.

#### Data Models

```typescript
type ServerConfig = 'balanced' | 'cpu_optimized' | 'gpu_accelerated' | 'storage_dense' | 'memory_optimized'

interface ServerConfigDef {
  id: ServerConfig
  label: string
  description: string
  costMultiplier: number
  powerMultiplier: number
  heatMultiplier: number
  revenueMultiplier: number
  bestFor: CustomerType[]          // customer types that get bonus revenue
  customerBonus: number            // extra revenue multiplier when matched
}
```

#### Server Config Options

| Config | Cost Mult | Power Mult | Heat Mult | Revenue Mult | Best For | Customer Bonus |
|--------|-----------|-----------|-----------|-------------|----------|---------------|
| Balanced | 1.0x | 1.0x | 1.0x | 1.0x | general, enterprise | +10% |
| CPU Optimized | 1.2x | 1.3x | 1.2x | 1.3x | enterprise, streaming | +20% |
| GPU Accelerated | 1.8x | 2.0x | 2.2x | 2.0x | ai_training, crypto | +30% |
| Storage Dense | 1.3x | 0.8x | 0.7x | 1.1x | streaming, general | +15% |
| Memory Optimized | 1.4x | 1.1x | 1.0x | 1.2x | enterprise, ai_training | +15% |

#### Gameplay Integration
- Server config selected when adding servers to a cabinet.
- Config affects cost, power draw, heat generation, and revenue.
- Matching server config to customer type yields bonus revenue.
- **Achievements:** "Custom Build" (deploy a non-balanced server), "GPU Farm" (deploy 10 GPU-accelerated servers), "Optimized Fleet" (have all servers matched to their cabinet's customer type).

---

### 5E. Capacity Planning Dashboard

**Goal:** Forecasting tools showing projected power/cooling/space exhaustion. Turns reactive management into proactive planning.

#### Data Models

```typescript
interface CapacityProjection {
  metric: string
  currentValue: number
  maxValue: number
  utilizationPct: number
  projectedFullTick: number | null  // tick at which capacity is exhausted (null = never)
  trend: 'increasing' | 'stable' | 'decreasing'
}

interface CapacityPlanningState {
  projections: CapacityProjection[]
  alerts: CapacityAlert[]
  historicalData: HistoryPoint[]     // last 100 ticks of key metrics
}

interface CapacityAlert {
  metric: string
  severity: 'info' | 'warning' | 'critical'
  message: string
}

interface HistoryPoint {
  tick: number
  power: number
  heat: number
  revenue: number
  cabinets: number
  money: number
}
```

#### Tracked Metrics
- **Power capacity** — current draw vs. PDU/grid capacity
- **Cooling capacity** — current heat load vs. cooling capability
- **Space** — cabinets used vs. suite tier max
- **Bandwidth** — traffic vs. spine capacity
- **Financial runway** — ticks until money runs out at current burn rate
- **Server lifespan** — oldest servers and when they'll need refresh

#### Gameplay Integration
- New "Capacity" panel in HUD with bar charts and trend arrows.
- Alerts fire when any metric exceeds 80% utilization.
- Historical data displayed as simple sparkline charts.
- **Achievements:** "Planner" (view capacity dashboard 10 times), "Early Warning" (respond to a capacity alert before hitting 95%).

---

### 5F. Network Peering & Transit

**Goal:** Establish BGP peering agreements with ISPs and Internet Exchanges. Adds a networking cost layer beyond just spine-leaf topology.

#### Data Models

```typescript
type PeeringType = 'transit' | 'peering' | 'private_peering'

interface PeeringAgreement {
  id: string
  provider: string
  type: PeeringType
  bandwidthGbps: number
  costPerTick: number
  latencyMs: number
  installedAtTick: number
}
```

#### Peering Options

| Type | Bandwidth | Cost/tick | Latency | Description |
|------|-----------|----------|---------|-------------|
| Budget Transit | 10 Gbps | $5/tick | 25ms | Cheap but high latency |
| Premium Transit | 10 Gbps | $15/tick | 8ms | Low latency, reliable |
| Public Peering (IX) | 20 Gbps | $8/tick | 5ms | Internet Exchange peering |
| Private Peering | 40 Gbps | $20/tick | 3ms | Direct connection to major networks |

#### Gameplay Integration
- Peering affects SLA compliance (latency-sensitive contracts require low latency).
- Bandwidth overages incur burst charges ($2/Gbps over limit per tick).
- Better peering improves contract revenue (latency bonus).
- **Achievements:** "Connected" (establish first peering), "IX Member" (join an Internet Exchange), "Zero Latency" (achieve < 5ms average latency).

---

### 5G. Maintenance Windows

**Goal:** Schedule planned downtime for equipment maintenance. Properly scheduled maintenance prevents incidents and extends equipment life.

#### Data Models

```typescript
interface MaintenanceWindow {
  id: string
  targetType: 'cabinet' | 'spine' | 'cooling' | 'power'
  targetId: string
  scheduledTick: number
  durationTicks: number
  status: 'scheduled' | 'in_progress' | 'completed'
  benefitApplied: boolean
}
```

#### Maintenance Types

| Target | Duration | Cost | Effect |
|--------|----------|------|--------|
| Cabinet | 3 ticks | $500 | Resets server age by 20%, -5°C heat |
| Spine Switch | 2 ticks | $1,000 | Prevents next hardware failure incident |
| Cooling System | 4 ticks | $2,000 | +0.5°C cooling rate for 50 ticks |
| Power System | 3 ticks | $1,500 | Prevents next power surge incident |

#### Gameplay Integration
- Equipment is offline during maintenance windows.
- Scheduling during peak hours (18:00-22:00) angers customers (-reputation).
- Regular maintenance reduces incident frequency by 30%.
- **Achievements:** "Preventive Care" (complete 5 maintenance windows), "Night Owl" (schedule all maintenance between 02:00-06:00).

---

### 5H. Power Redundancy Tiers (N, N+1, 2N)

**Goal:** Players choose redundancy level for power paths. Higher redundancy is expensive but required for enterprise SLAs.

#### Data Models

```typescript
type PowerRedundancy = 'N' | 'N+1' | '2N'

interface PowerRedundancyConfig {
  level: PowerRedundancy
  label: string
  costMultiplier: number           // multiplier on power infrastructure cost
  failureProtection: number        // 0–1, chance of surviving a power incident unscathed
  upgradeCost: number
  maintenanceCostPerTick: number
  description: string
}
```

#### Redundancy Configs

| Level | Cost Mult | Failure Protection | Upgrade Cost | Maintenance/tick | Description |
|-------|-----------|-------------------|-------------|-----------------|-------------|
| N | 1.0x | 0% | $0 | $0 | No redundancy. Any power failure = full outage. |
| N+1 | 1.3x | 70% | $30,000 | $8/tick | One backup path. Survives most single failures. |
| 2N | 2.0x | 95% | $80,000 | $20/tick | Fully redundant. Required for gold contracts. |

#### Gameplay Integration
- Gold-tier contracts and FedRAMP compliance require N+1 minimum.
- 2N required for "maximum" security tier.
- Power redundancy affects outage severity — higher redundancy means shorter/no outages.
- **Achievements:** "Redundant" (upgrade to N+1), "Belt and Suspenders" (upgrade to 2N), "Bulletproof" (survive 10 power incidents with 2N).

---

### 5I. Noise & Community Relations

**Goal:** Generators and cooling create noise. Exceeding noise limits triggers community complaints, fines, and eventually zoning restrictions.

#### Data Models

```typescript
interface NoiseState {
  currentNoiseLevel: number         // decibels, calculated from equipment
  noiseLimit: number                // max allowed dB (starts at 70)
  communityRelations: number        // 0–100 score
  complaints: number                // lifetime complaint count
  finesAccumulated: number          // total fines paid
  soundBarriersInstalled: number    // each reduces noise by 5 dB
}
```

#### Noise Sources

| Source | Noise (dB) |
|--------|-----------|
| Air Cooling (per cabinet) | 2 dB |
| Water Cooling (per cabinet) | 1 dB |
| Running Generator | 15 dB |
| Spine Switch | 1 dB |

#### Sound Barriers
- Cost: $5,000 each, max 5
- Each reduces noise by 5 dB
- Water cooling generates less noise than air (incentive to upgrade)

#### Gameplay Integration
- Noise exceeding limit: community complaint every 10 ticks, -2 reputation each.
- 5+ complaints: fine of $5,000.
- 10+ complaints: zoning restriction — can't add more cabinets until noise is resolved.
- **Achievements:** "Good Neighbor" (keep noise below limit for 200 ticks), "Sound Barrier" (install all 5 sound barriers).

---

### 5J. Dynamic Pricing / Spot Compute Market

**Goal:** Sell unused capacity at variable spot rates. Creates a secondary revenue stream that rewards having excess capacity during peak times.

#### Data Models

```typescript
interface SpotComputeState {
  spotPriceMultiplier: number       // 0.3–2.5x of base server revenue
  spotCapacityAllocated: number     // servers allocated to spot market
  spotRevenue: number               // revenue from spot sales last tick
  spotDemand: number                // 0–1, current market demand
  spotHistoryPrices: number[]       // last 50 ticks of spot prices
}
```

#### Spot Market Mechanics
- Players allocate idle servers to the spot market.
- Spot price fluctuates based on demand (correlated with time-of-day demand curve but inversely — when demand is low, spot prices are high because fewer providers are available).
- High demand periods: 0.3-0.8x base revenue (many providers, competitive).
- Low demand periods: 1.5-2.5x base revenue (few providers, premium).
- Spot instances can be reclaimed at any time (no SLA guarantees).

#### Gameplay Integration
- New "Spot Market" section in Finance panel.
- Players set how many servers to allocate to spot vs. reserved.
- Spot revenue is volatile but can be very profitable during off-peak hours.
- **Achievements:** "Spot Trader" (earn $10,000 from spot market), "Market Timer" (earn 2x base revenue from a spot sale).

---

### 5K. Event Log / History

**Goal:** Scrollable log of everything that happened. Useful for understanding what went wrong and when.

#### Data Models

```typescript
interface EventLogEntry {
  tick: number
  gameHour: number
  category: 'incident' | 'finance' | 'contract' | 'achievement' | 'infrastructure' | 'staff' | 'research' | 'system'
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
}

interface EventLogState {
  entries: EventLogEntry[]           // last 200 entries
  filterCategory: string | null     // active filter
}
```

#### Gameplay Integration
- All game events (incidents, contract changes, achievements, financial milestones, staff events) are logged with timestamps.
- Filterable by category.
- New "Log" panel in HUD.
- Replaces the current `incidentLog` string array with richer structured data.
- **Achievements:** "Historian" (view event log), "Clean Record" (no error-level events for 100 ticks).

---

### 5L. Statistics Dashboard

**Goal:** Lifetime stats providing a comprehensive overview of your data center's history.

#### Data Models

```typescript
interface LifetimeStats {
  totalRevenueEarned: number
  totalExpensesPaid: number
  totalIncidentsSurvived: number
  totalServersDeployed: number
  totalSpinesDeployed: number
  peakTemperatureReached: number
  longestUptimeStreak: number       // consecutive ticks with no incidents
  currentUptimeStreak: number
  totalFiresSurvived: number
  totalPowerOutages: number
  totalContractsCompleted: number
  totalContractsTerminated: number
  peakRevenueTick: number           // highest revenue in a single tick
  peakCabinetCount: number
  totalMoneyEarned: number          // gross income lifetime
}
```

#### Gameplay Integration
- New "Stats" panel in HUD showing lifetime statistics.
- Stats are tracked passively during tick processing.
- **Achievements:** "Statistician" (view stats dashboard), "Ironman" (1000-tick uptime streak), "Big Spender" (total expenses exceed $1M).

---

### 5M. Tooltip Tutorial System

**Goal:** Contextual hints that appear as players encounter mechanics for the first time. Low-effort alternative to a full tutorial.

#### Data Models

```typescript
interface TutorialState {
  seenTips: string[]                // IDs of tips already dismissed
  activeTip: TutorialTip | null
  tutorialEnabled: boolean
}

interface TutorialTip {
  id: string
  trigger: string                   // condition that triggers this tip
  title: string
  message: string
  category: 'build' | 'cooling' | 'finance' | 'network' | 'incidents' | 'contracts'
}
```

#### Tutorial Tips

| ID | Trigger | Message |
|----|---------|---------|
| first_overheat | Any cabinet > 60°C | "Your cabinet is heating up! Consider upgrading to water cooling or adding management cabinets." |
| first_throttle | Any cabinet > 80°C | "Thermal throttling! This server is earning only 50% revenue. Cool it down fast." |
| first_bankruptcy | Money < $1,000 | "Running low on funds! Consider taking a loan or reducing expenses." |
| no_leaf | 3+ cabinets without leaf | "Cabinets without leaf switches can't connect to the network fabric." |
| no_spine | Leaf switches but no spines | "You need spine switches to complete the network fabric." |
| first_incident | First incident spawns | "Incidents happen! Resolve them quickly to minimize damage." |
| aisle_hint | 4+ cabinets | "Tip: Alternate cabinet facing (N/S) in adjacent rows for hot/cold aisle cooling bonus." |

#### Gameplay Integration
- Tips appear as dismissible toast notifications.
- Once dismissed, a tip never shows again.
- Can be disabled entirely in settings.
- **Achievements:** "Student" (dismiss 5 tutorial tips), "Graduate" (dismiss all tutorial tips).

---

### Phase 5 — Recommended Implementation Order

1. **Event Log / History** (low effort, improves all other features by providing visibility)
2. **Statistics Dashboard** (low effort, computed from existing state)
3. **Tooltip Tutorial System** (low effort, improves new player experience)
4. **Custom Server Configurations** (medium effort, deepens every equipment decision)
5. **Dynamic Pricing / Spot Compute Market** (medium effort, adds economic depth)
6. **Weather System** (medium effort, affects cooling strategy seasonally)
7. **Maintenance Windows** (medium effort, adds planning gameplay)
8. **Power Redundancy Tiers** (medium effort, ties into contracts/compliance)
9. **Supply Chain & Procurement** (medium-high effort, adds planning tension)
10. **Noise & Community Relations** (medium effort, adds environmental constraint)
11. **Interconnection / Meet-Me Room** (medium effort, new revenue stream)
12. **Network Peering & Transit** (medium effort, networking cost layer)
13. **Capacity Planning Dashboard** (medium effort, computed projections)

---

## Layout & Physical Design — Future Ideas

These are ideas that expand on the row-based layout system introduced with the realistic data center layout feature.

### Player-Built Rows
**Impact: High | Effort: Medium** — *Not yet implemented*
Instead of pre-defined rows per suite tier, let the player choose where to place rows on the floor plan. This adds another layer of strategic planning — players decide row count, spacing, and orientation. Could introduce constraints like minimum aisle width, maximum row length, and fire code compliance.

### Flexible Row Placement
**Impact: Medium | Effort: High** — *Not yet implemented*
Semi-free-form row positioning on a larger floor plan grid. Players could drag and drop rows, adjust row length, and create non-uniform layouts. Would require significant UI work for a row-placement editor and more complex validation logic.

### Row-End Infrastructure Slots ✅
**Impact: Medium | Effort: Low** — *Implemented*
Dedicated positions at the end of each cabinet row for PDUs, in-row cooling units, network panels, and fire suppression equipment. 4 slot types: cooling_slot, pdu_slot, network_panel, fire_suppression. UI in Infrastructure panel.

### Aisle Width Upgrades ✅
**Impact: Low | Effort: Low** — *Implemented*
3 aisle width tiers: standard (1-tile), wide (2-tile, +0.5°C cooling), extra-wide (3-tile, +1.0°C cooling). Per-aisle upgrades with cost scaling. UI in Infrastructure panel.

### Raised Floor / Overhead Cable Management ✅
**Impact: Medium | Effort: Medium** — *Implemented*
3 raised floor tiers (none, standard, advanced) providing cooling distribution bonuses. 3 cable management types (none, overhead, underfloor — underfloor requires raised floor). Sub-floor view mode shows cooling pipes and power conduits. UI in Infrastructure panel.

---

### Phase 5 — Estimated Effort Summary

| Feature | New Types | New Constants | Store Fields | Tick Logic | HUD Panels | Achievements |
|---------|-----------|--------------|-------------|------------|------------|-------------|
| Supply Chain | 3 | 2 configs | ~6 fields, 3 actions | Orders, delivery, shortages | Procurement panel | 4 |
| Weather System | 2 | 2 configs | ~7 fields, 0 actions | Season/weather rotation | Weather display | 3 |
| Interconnection | 2 | 2 configs | ~4 fields, 3 actions | Port revenue, network effects | Interconnection panel | 3 |
| Custom Servers | 1 | 1 config | ~2 fields, 1 action | Revenue calculation | Server config selector | 3 |
| Capacity Planning | 3 | 0 | ~3 fields, 0 actions | Projection calculation | Capacity panel | 2 |
| Network Peering | 2 | 1 config | ~3 fields, 2 actions | Latency, bandwidth costs | Peering panel | 3 |
| Maintenance Windows | 1 | 1 config | ~2 fields, 2 actions | Window execution | Maintenance panel | 2 |
| Power Redundancy | 1 | 1 config | ~2 fields, 1 action | Outage protection | Power panel update | 3 |
| Noise & Community | 1 | 1 config | ~5 fields, 1 action | Noise calc, complaints | Noise panel | 2 |
| Spot Compute | 1 | 0 | ~5 fields, 1 action | Spot pricing, revenue | Spot market panel | 2 |
| Event Log | 2 | 0 | ~2 fields, 0 actions | Logging | Log panel | 2 |
| Statistics Dashboard | 1 | 0 | ~15 fields, 0 actions | Stats tracking | Stats panel | 3 |
| Tooltip Tutorial | 2 | 1 config | ~3 fields, 1 action | Trigger checks | Toast tips | 2 |

---

## Phase 6 — Detailed Design: Multi-Site Expansion (World Map & Global Strategy)

**Goal:** Transform the game from managing a single data center into building a global data center empire. Players expand from one facility to a network of strategically placed sites — hyperscale campuses, colocation facilities, edge PoPs, and network hubs — connected by inter-site networking. A world map view provides the strategic overview, while the existing isometric floor view remains the per-site management interface.

**Progression gate:** Enterprise suite tier + $500K+ cash + reputation "excellent" or higher. First expansion is domestic (same continent), international unlocks later at higher reputation/money thresholds. Edge PoPs unlock earliest as the gentlest introduction to multi-site thinking.

---

### 6A. World Map View

**Goal:** A new top-level view mode that sits alongside the existing isometric floor view. The world map is the strategic command center for multi-site operations.

#### View Architecture

The game gains a **view switcher** with two modes:

1. **Floor View** (existing) — Manage a single site's cabinets, infrastructure, staff, etc.
2. **World Map View** (new) — See all sites globally, plan expansion, manage inter-site networking, monitor demand

#### Visual Design

The world map should match the game's neon/terminal aesthetic:
- Dark background with a stylized continental outline (glowing border lines, not photorealistic)
- Site nodes rendered as glowing dots (color-coded by site type)
- Inter-site connections as animated lines (color = utilization, animated pulse = active traffic)
- Demand heat map overlay (toggleable) showing customer concentration by region
- Weather/disaster overlays showing active events per region
- Minimalist — think "war room command screen," not Google Maps

#### Implementation Notes

Two viable approaches:
- **Phaser scene** — A second Phaser scene (`WorldMapScene`) alongside `DataCenterScene`, swapped via the view toggle. Keeps all rendering in one engine; consistent visual style.
- **React component** — A full-screen React component with SVG/Canvas for the map. Simpler to build, easier to integrate with UI panels, but different rendering pipeline.

Recommendation: Start with a **React + SVG approach** for faster iteration. The world map is mostly static geography with overlaid data points — it doesn't need Phaser's game loop. If performance becomes an issue with many animated connections, migrate to a Phaser scene later.

#### Data Models

```typescript
type RegionId = string  // e.g. 'us_east', 'eu_west', 'apac_singapore'

interface WorldMapState {
  regions: Region[]
  sites: Site[]
  interSiteLinks: InterSiteLink[]
  selectedRegionId: RegionId | null
  selectedSiteId: string | null
  demandHeatMapVisible: boolean
  weatherOverlayVisible: boolean
  activeSiteId: string              // which site the floor view is showing
}
```

---

### 6B. Metro Regions & Location Profiles

**Goal:** Define 12-15 named metro regions around the world, each with a distinct profile that creates meaningful trade-offs for site placement decisions.

#### Data Models

```typescript
interface Region {
  id: RegionId
  name: string                      // e.g. "Northern Virginia (Ashburn)"
  continent: Continent
  coordinates: { x: number; y: number }  // position on world map (normalized 0-1)
  profile: RegionProfile
  demandProfile: DemandProfile
  disasterProfile: DisasterProfile
  description: string               // flavor text for the region
}

type Continent = 'north_america' | 'south_america' | 'europe' | 'asia_pacific' | 'middle_east_africa'

interface RegionProfile {
  powerCostMultiplier: number       // multiplier on base $/kWh (0.5–2.0)
  laborCostMultiplier: number       // multiplier on staff salaries (0.7–1.8)
  landCostMultiplier: number        // multiplier on site purchase price (0.5–3.0)
  coolingEfficiency: number         // ambient temp modifier (-10 to +15°C)
  networkConnectivity: number       // 0–1, fiber availability / IX proximity
  regulatoryBurden: number          // 0–1, permit costs and compliance overhead
  carbonTaxMultiplier: number       // multiplier on carbon tax rate (0–2.0)
  taxIncentiveDiscount: number      // 0–0.3, operating cost reduction from local incentives
  solarEfficiency: number           // 0–1, baseline solar availability
  windEfficiency: number            // 0–1, baseline wind availability
}

interface DemandProfile {
  general: number                   // 0–1, demand level per customer type
  ai_training: number
  streaming: number
  crypto: number
  enterprise: number
  government: number                // new customer type, region-specific
}

interface DisasterProfile {
  earthquake: number                // 0–1, probability multiplier
  hurricane: number
  tornado: number
  flood: number
  volcanic: number
  gridInstability: number
  extremeHeat: number
  extremeCold: number
  politicalRisk: number             // regulatory changes, instability
}
```

#### Region Catalog

| Region | Power | Labor | Land | Cooling | Network | Key Demand | Key Risk | Notes |
|--------|-------|-------|------|---------|---------|-----------|----------|-------|
| **Northern Virginia (Ashburn)** | 0.8x | 1.2x | 1.5x | +5°C | 0.95 | Enterprise, Streaming | Saturated market | "Data Center Alley" — highest IX density in the world |
| **Bay Area (Santa Clara)** | 1.3x | 1.8x | 3.0x | +8°C | 0.90 | AI Training, Enterprise | Earthquake (0.7) | Premium AI/tech customers, expensive everything |
| **Dallas/Fort Worth** | 0.7x | 0.9x | 0.6x | +12°C | 0.80 | General, Streaming | Tornado (0.4), Grid instability (0.5) | Cheap land, central US network hub |
| **Chicago** | 0.9x | 1.1x | 1.2x | +2°C | 0.85 | Enterprise, Streaming | Extreme cold (0.3) | Major financial hub, CME/CBOE proximity |
| **Portland/Oregon** | 0.6x | 1.0x | 0.8x | +3°C | 0.75 | AI Training, Crypto | Earthquake (0.3) | Cheap hydropower, tax incentives |
| **São Paulo** | 1.1x | 0.7x | 0.7x | +10°C | 0.60 | General, Enterprise | Political risk (0.4), Flood (0.3) | LATAM gateway, data sovereignty demand |
| **London** | 1.4x | 1.5x | 2.5x | +2°C | 0.90 | Enterprise, Streaming | Flood (0.2) | European finance hub, GDPR compliance |
| **Amsterdam** | 1.2x | 1.3x | 1.8x | +1°C | 0.95 | Enterprise, Streaming | Flood (0.3) | AMS-IX — one of the world's largest IXPs |
| **Frankfurt** | 1.3x | 1.4x | 2.0x | +3°C | 0.90 | Enterprise, General | — | DE-CIX, European backbone |
| **Nordics (Stockholm/Helsinki)** | 0.5x | 1.2x | 0.7x | -8°C | 0.70 | Crypto, AI Training | Volcanic (0.1, Iceland nearby), Extreme cold (0.4) | Near-free cooling, cheap hydro/geothermal, remote |
| **Singapore** | 1.5x | 1.3x | 2.5x | +15°C | 0.85 | Enterprise, Streaming | Monsoon/flood (0.3) | APAC gateway, strict regulations, hot climate |
| **Tokyo** | 1.6x | 1.5x | 3.0x | +8°C | 0.85 | Enterprise, AI Training | Earthquake (0.8) | Premium market, highest disaster risk |
| **Mumbai** | 0.8x | 0.5x | 0.5x | +14°C | 0.55 | General, Streaming | Monsoon/flood (0.5), Extreme heat (0.6) | Massive growth market, cheap labor, hot and wet |
| **Dubai** | 1.0x | 1.0x | 1.5x | +18°C | 0.70 | Enterprise, Government | Extreme heat (0.8) | Middle East hub, government contracts, brutal cooling costs |
| **Johannesburg** | 0.7x | 0.6x | 0.4x | +6°C | 0.40 | General, Government | Grid instability (0.6) | African gateway, poor grid reliability, cheap land |

#### Gameplay Integration

- Regions are **visible on the world map** with their profiles shown on hover/click.
- Players **research regions** before committing to build (costs money, reveals full profile).
- Some regions have **data sovereignty laws** requiring local presence to serve certain contract types (e.g., EU GDPR contracts require an EU site, Brazilian LGPD requires São Paulo).
- **Tax incentives** expire after a set number of ticks, creating urgency to build while incentives last.

---

### 6C. Site Types

**Goal:** Not every facility needs to be a full data center. Different site types serve different strategic purposes at different price points and complexity levels.

#### Data Models

```typescript
type SiteType = 'edge_pop' | 'colocation' | 'hyperscale' | 'network_hub' | 'disaster_recovery'

interface Site {
  id: string
  name: string                      // player-named
  type: SiteType
  regionId: RegionId
  purchasedAtTick: number
  constructionTicksRemaining: number  // 0 = operational
  operational: boolean
  siteState: SiteGameState          // per-site instance of core game state
}

interface SiteTypeConfig {
  type: SiteType
  label: string
  description: string
  purchaseCost: number              // base cost (modified by region land cost)
  constructionTicks: number         // time to build
  maxSuiteTier: SuiteTier           // highest tier this site type supports
  maxCabinets: number
  maxStaff: number
  revenueModel: string              // description of how it generates money
  maintenanceCostPerTick: number    // base operating overhead
}
```

#### Site Type Configs

| Type | Purchase Cost | Build Time | Max Tier | Max Cabinets | Revenue Model | Maintenance |
|------|-------------|-----------|----------|-------------|---------------|-------------|
| **Edge PoP** | $25,000 | 10 ticks | Starter | 4 | Per-Gbps transit fees, latency bonuses on contracts | $5/tick |
| **Colocation** | $150,000 | 30 ticks | Standard | 18 | Standard customer contracts + meet-me room interconnection | $20/tick |
| **Hyperscale Campus** | $500,000 | 60 ticks | Enterprise | 50 | Volume contracts, AI training, bulk compute | $50/tick |
| **Network Hub / IXP** | $200,000 | 25 ticks | Standard | 8 | Interconnection revenue, transit fees, peering agreements | $30/tick |
| **Disaster Recovery** | $300,000 | 40 ticks | Professional | 32 | Enables DR contracts, required for certain compliance certs | $40/tick |

#### Site Type Details

**Edge PoP:**
- Smallest and cheapest footprint. 1-4 cabinets in leased space.
- Primary purpose: reduce latency to end users in a metro area.
- Revenue from per-Gbps transit fees and latency-sensitive contract bonuses.
- Requires backhaul connection to a core site (colo or hyperscale).
- Simplest management — no complex infrastructure, minimal staff.
- **Best introduction to multi-site:** cheap enough to experiment, teaches network topology thinking.

**Colocation Facility:**
- Mid-size facility for regional presence.
- Serves local customers with standard contracts + meet-me room revenue.
- Full infrastructure management (PDUs, cooling, cabling) but at standard tier cap.
- Good for establishing presence in high-demand regions without hyperscale investment.

**Hyperscale Campus:**
- Full-size data center with all features unlocked.
- Same management complexity as the player's primary site.
- Highest revenue potential but also highest cost and management overhead.
- Only worth building in regions with strong demand or strategic importance.

**Network Hub / IXP:**
- Specialized for interconnection and peering.
- Limited cabinet space but premium meet-me room facilities.
- Generates revenue primarily through interconnection ports and transit agreements.
- Most valuable in regions with high network connectivity scores (Ashburn, Amsterdam).
- Provides latency benefits to all other sites connected through it.

**Disaster Recovery Site:**
- Mirror of a primary site, mostly idle.
- Required by certain compliance certifications (SOC 2 Type II, FedRAMP) for DR contracts.
- Data replication from primary site consumes inter-site bandwidth.
- Activates during major incidents at the primary site — workloads fail over.
- Revenue comes from enabling premium DR-required contracts, not direct compute.

#### Progression

```
Reputation "excellent" + Enterprise tier + $500K → Unlock first Edge PoP
First Edge PoP operational → Unlock Colocation and Network Hub
Any Colocation operational → Unlock Hyperscale Campus and DR Site
3+ sites operational → Unlock international expansion (cross-continent)
```

---

### 6D. Inter-Site Networking (DCN)

**Goal:** The connections between sites are a strategic layer. Players choose connection types based on bandwidth needs, latency requirements, and budget.

#### Data Models

```typescript
type LinkType = 'ip_transit' | 'leased_wavelength' | 'dark_fiber' | 'submarine_cable'

interface InterSiteLink {
  id: string
  type: LinkType
  siteAId: string
  siteBId: string
  bandwidthGbps: number
  latencyMs: number
  costPerTick: number
  installedAtTick: number
  utilization: number               // 0–1, current bandwidth usage
}

interface LinkTypeConfig {
  type: LinkType
  label: string
  description: string
  bandwidthGbps: number
  latencyMs: number                 // base latency (modified by distance)
  installCost: number
  costPerTick: number
  maxDistance: number                // max distance between sites (0 = unlimited)
  reliability: number               // 0–1, uptime probability
}
```

#### Link Type Configs

| Type | Bandwidth | Base Latency | Install Cost | Cost/tick | Max Distance | Reliability | Notes |
|------|-----------|-------------|-------------|----------|-------------|-------------|-------|
| **IP Transit** | 10 Gbps | 30ms | $5,000 | $8/tick | Unlimited | 0.95 | Cheapest, highest latency, uses public internet |
| **Leased Wavelength** | 40 Gbps | 15ms | $50,000 | $25/tick | Same continent | 0.98 | Leased capacity on existing fiber |
| **Dark Fiber** | 100 Gbps | 5ms | $200,000 | $15/tick | Same continent | 0.99 | Own the fiber. Highest capacity, lowest latency |
| **Submarine Cable** | 100 Gbps | 80ms | $500,000 | $40/tick | Cross-continent only | 0.97 | Required for intercontinental links. Expensive but essential |

#### Latency Modeling

Latency between two sites = `baseLinkLatency + distanceModifier`

Distance categories:
- **Same metro** (e.g., two sites in Northern Virginia): +0ms
- **Same region** (e.g., Virginia to Chicago): +5-15ms
- **Same continent** (e.g., Virginia to Portland): +20-40ms
- **Cross-continent** (e.g., Virginia to London): +60-120ms
- **Cross-Pacific** (e.g., Virginia to Tokyo): +100-180ms

#### Gameplay Integration

- **Multi-region contracts** require latency below a threshold to qualifying regions (e.g., "Serve US and EU users with <80ms latency").
- **DR failover** requires sufficient bandwidth between primary and DR sites to replicate data.
- **Edge PoP backhaul** — every edge PoP must have at least one link back to a core site.
- **Link failures** — submarine cable cuts, fiber breaks as incident types affecting inter-site links.
- **Bandwidth overage** — exceeding link capacity incurs burst charges ($2/Gbps over limit per tick).

---

### 6E. Customer Demand Geography

**Goal:** Drive strategic site selection by showing players where different customer types are concentrated. Proximity to demand = better contracts.

#### Demand Heat Maps

The world map displays toggleable demand overlays:
- Each customer type has a geographic demand distribution.
- Demand is concentrated in certain regions but exists everywhere at lower levels.
- Demand **grows over time** — emerging markets (Mumbai, São Paulo) see faster demand growth than saturated markets (Ashburn, London).

#### Demand Concentration by Customer Type

| Customer Type | Primary Regions | Secondary Regions | Growth Rate |
|--------------|----------------|-------------------|-------------|
| **General** | Everywhere | — | Slow, steady |
| **AI Training** | Bay Area, Portland, Nordics | Tokyo, London | Fast |
| **Streaming** | N. Virginia, London, Singapore, São Paulo | All metros | Medium |
| **Crypto** | Nordics, Portland, Dallas | Dubai, Johannesburg | Volatile |
| **Enterprise** | N. Virginia, London, Frankfurt, Tokyo, Singapore | Chicago, Mumbai | Medium |
| **Government** | N. Virginia, London, Tokyo, Dubai | São Paulo, Frankfurt | Slow |

#### Proximity Bonuses

Sites near high-demand regions for their customer types receive:
- **Contract priority** — more contracts of that type appear for bidding.
- **Latency bonus** — revenue multiplier for being close to end users (up to +20%).
- **Competitive advantage** — easier to win bids against competitors in that region.

Sites far from demand centers can still serve customers, but at reduced revenue (latency penalty, -5% to -15%) and fewer contract opportunities.

---

### 6F. Location-Specific Incidents

**Goal:** Each region has unique disaster types that make location selection feel consequential. These are in addition to the standard incident pool that affects all sites.

#### Regional Incident Catalog

| Region | Incident | Severity | Effect | Frequency |
|--------|----------|----------|--------|-----------|
| **Bay Area** | Earthquake | Critical | Structural damage to cabinets (destroy 10-30%), power outage, 50-100 tick recovery | Rare (0.3% per tick) |
| **Bay Area** | Wildfire smoke | Minor | Increased cooling load (+5°C ambient) for 20-40 ticks, air filter replacement cost | Seasonal (summer) |
| **Dallas** | Tornado | Major | Destroys outdoor equipment (generators, solar), 20-40 tick repair | Low (0.2% per tick) |
| **Dallas/Texas** | Grid collapse | Critical | Complete power outage, generators are only option, 30-60 ticks | Low (0.15% per tick) |
| **Gulf/Florida** | Hurricane | Critical | Multi-day event: ramp-up warning → full impact → recovery. Flood damage, power loss | Seasonal (summer/autumn) |
| **Iceland/Nordics** | Volcanic eruption | Critical | Ash clouds ground flights (supply chain halt), potential lava flow threat | Very rare (0.05% per tick) |
| **Iceland** | Submarine cable cut | Major | Loss of intercontinental connectivity for 40-80 ticks (reroute via other links) | Low |
| **Singapore** | Monsoon flooding | Major | Ground floor flooding, power equipment damage if not elevated, 15-30 ticks | Seasonal |
| **Tokyo** | Earthquake | Critical | Similar to Bay Area but higher frequency (0.5% per tick) | Higher than Bay Area |
| **Mumbai** | Monsoon + extreme heat | Major | Dual threat: flooding and cooling stress simultaneously | Seasonal |
| **Dubai** | Extreme heat event | Major | Ambient temp +25°C for 15-30 ticks, cooling costs spike dramatically | Seasonal (summer) |
| **Johannesburg** | Grid load shedding | Major | Scheduled rolling blackouts, 10-20 ticks, generators required | Frequent (0.5% per tick) |
| **London** | Thames flooding | Minor | Basement/ground floor water damage risk | Low |
| **Amsterdam** | Flood risk | Major | Below sea level — severe flooding if defenses fail | Very rare but catastrophic |

#### Disaster Preparedness

Players can mitigate regional risks through investment:
- **Seismic reinforcement** (earthquake regions): $100K, reduces structural damage by 60%
- **Flood barriers** (flood regions): $50K, prevents ground-floor flooding
- **Hurricane hardening** (gulf/coastal): $75K, reduces wind/water damage
- **Elevated equipment** (flood/monsoon): $25K, protects power equipment from water

These create another layer of trade-offs: do you invest in disaster prep upfront, or gamble and save the money?

---

### 6G. Global Resource Sharing

**Goal:** Define which resources are shared across all sites and which are per-site, to keep multi-site manageable without losing depth.

#### Shared (Global) Resources

| Resource | Why Global | Notes |
|----------|-----------|-------|
| **Money** | Single treasury | All sites draw from and contribute to the same bank account |
| **Tech tree** | Research once, apply everywhere | Unlocked techs benefit all sites instantly |
| **Reputation** | Public-facing metric | One reputation score, but regional modifiers apply |
| **Compliance certs** | Company-wide certification | Audit once at company level, but each site must meet requirements |
| **Competitor relationships** | Market-level competition | Competitors operate globally, competing across regions |
| **Patents** | IP is company-wide | Patent royalties pool into global revenue |

#### Per-Site Resources

| Resource | Why Per-Site | Notes |
|----------|------------|-------|
| **Cabinets & infrastructure** | Physical equipment | Each site has its own floor, PDUs, cooling, cabling |
| **Staff** | People are located somewhere | Staff assigned to a site; can transfer (cost + relocation time) |
| **Contracts** | Serve from specific locations | Contracts bound to a site (or multi-site for premium ones) |
| **Incidents** | Local events | Incidents affect one site (except market-wide events like price wars) |
| **Weather** | Regional climate | Each site has its own weather based on region |
| **Power/cooling** | Local utilities | Power costs, cooling efficiency are per-site based on region |
| **Meet-me rooms** | Physical infrastructure | Each site has its own interconnection facilities |

#### Staff Transfers

Staff can be reassigned between sites:
- **Transfer cost**: 2x monthly salary (relocation expenses)
- **Transfer time**: 5-15 ticks depending on distance (same continent vs. international)
- **Staff unavailable** during transfer — neither site benefits
- Creates strategic decisions: do you hire locally (faster, but regional salary rates) or transfer experienced staff?

---

### 6H. Multi-Site Contracts

**Goal:** Premium contracts that require presence in multiple regions, providing strong incentive to expand globally.

#### Contract Types

| Contract | Regions Required | Revenue/tick | Duration | Requirements | Description |
|----------|-----------------|-------------|----------|-------------|-------------|
| **CDN Distribution** | Any 3 sites | $150/tick | 500 ticks | Edge PoP in each region, <30ms latency | Distribute content globally |
| **Global Enterprise SaaS** | US + EU sites | $200/tick | 600 ticks | Colo or Hyperscale in both, SOC 2 | Multi-region enterprise hosting |
| **GDPR-Compliant EU Hosting** | EU site required | $120/tick | 400 ticks | EU site, data sovereignty compliance | EU data must stay in EU |
| **Asia-Pacific Expansion** | APAC site required | $180/tick | 500 ticks | Singapore or Tokyo site | Serve APAC enterprise customers |
| **Global DR Contract** | Primary + DR site | $250/tick | 800 ticks | Hyperscale + DR, 2N power, FedRAMP | Mission-critical global failover |
| **Transcontinental AI Training** | 2+ continents | $300/tick | 400 ticks | GPU servers, dark fiber links | Distributed AI training across sites |

---

### 6I. Implementation Phases

Multi-site is the largest feature in the game's roadmap. Break it into sub-phases to ship incrementally:

#### Phase 6A — World Map UI + Site Selection (Foundation)
- Add the world map view (React + SVG component)
- Define 12-15 metro regions with full profiles
- Region info panel on hover/click
- "Research Region" action (costs money, reveals full profile)
- Purchase first site (edge PoP only)
- Site switcher to toggle floor view between sites
- Each site is a separate instance of core game state

**Effort:** High | **Delivers:** The visual foundation and basic expansion

#### Phase 6B — Inter-Site Networking + Edge PoPs
- Implement link types (IP transit, leased wavelength, dark fiber)
- Edge PoP site type with simplified management
- Backhaul requirement (edge → core link)
- Latency modeling between sites
- Basic bandwidth tracking on inter-site links
- CDN/content delivery revenue model for edge PoPs

**Effort:** High | **Delivers:** Functional multi-site with lightweight edge expansion

#### Phase 6C — Full Site Types + Regional Incidents
- Colocation, Hyperscale, Network Hub, DR site types
- Per-region incident catalogs
- Disaster preparedness investments
- Construction time for new sites
- Site-specific weather based on region climate

**Effort:** High | **Delivers:** Full site variety with regional risk/reward

#### Phase 6D — Global Strategy Layer
- Customer demand heat maps on world map
- Demand growth over time
- Multi-site contracts
- Submarine cables for intercontinental links
- Data sovereignty mechanics
- Staff transfers between sites
- Regional competitor presence
- International expansion unlock gate

**Effort:** Very High | **Delivers:** The complete global strategy endgame

### Phase 6 — Estimated Effort Summary

| Sub-phase | New Types | New Constants | Store Fields | Tick Logic | UI | Achievements |
|-----------|-----------|--------------|-------------|------------|-----|-------------|
| 6A: World Map + Sites | 5+ | 15+ region configs | ~15 fields, 5 actions | Site switching, construction | World map component, region panel, site switcher | 4 |
| 6B: DCN + Edge | 3 | 4 link configs | ~8 fields, 4 actions | Latency calc, bandwidth tracking, edge revenue | Link management panel, network overlay on map | 3 |
| 6C: Site Types + Disasters | 3 | 5 site configs, 15+ incidents | ~10 fields, 5 actions | Regional incidents, disaster prep, construction | Site type selector, disaster prep panel | 4 |
| 6D: Global Strategy | 4 | 6+ contract configs | ~12 fields, 6 actions | Demand growth, multi-site contracts, transfers | Demand heat map, contract panel updates, transfer UI | 5 |

### Risk Assessment

**Why this is worth it despite the effort:**
- Transforms a "manage one building" game into "build an empire" — this is the transition from mid-game to true endgame.
- Location-based trade-offs add strategic depth that can't be replicated by adding more systems to a single site.
- PoP/Edge/CDN concepts teach real-world infrastructure strategy in an accessible way.
- Each sub-phase delivers standalone value — even Phase 6A alone (world map + one expansion) adds significant gameplay.

**What could go wrong:**
- **Scope creep** — each sub-phase is large. Strict scoping per phase is critical.
- **Performance** — managing multiple site states simultaneously could get heavy. Solution: only fully simulate the active site; background sites run a simplified tick (revenue/expenses/incidents only).
- **UI complexity** — players need to manage multiple sites without feeling overwhelmed. Solution: world map shows site summaries (health, revenue, alerts); only drill into floor view for active management.
- **Balance** — multi-site revenue must be balanced so that expanding is rewarding but not trivially better than optimizing one site. Single-site mastery should remain viable.

---

## Game Feel & Polish — RCT-Style Improvements

Inspired by the feedback loops and "aliveness" of RollerCoaster Tycoon. These features transform a functional simulation into a game that *feels good to play*. Currently the Phaser scene is almost entirely static — no tweens, no particles, no ambient animation, no sound. These changes target that gap.

---

### Animated Worker Sprites ("Peeps")

**Impact: High | Effort: High**

RCT's soul is its guests. The equivalent here is **technicians walking the floor**. Small procedurally-drawn sprites (using `Graphics`, consistent with the no-asset approach) that move along corridors and aisles.

| Trigger | Behavior |
|---------|----------|
| Staff hired | Worker appears at corridor entrance, walks to a "station" position |
| Incident fires | Nearest qualified tech walks to the affected cabinet |
| Cabinet placed | A worker "installs" it (walks to tile, brief animation, cabinet appears) |
| Maintenance window | Tech walks to target equipment, stays for duration |
| Idle | Workers patrol corridors, occasionally stop at cabinets |

Workers should have role-colored uniforms (green = network engineer, yellow = electrician, blue = cooling specialist, red = security officer). When busy resolving an incident, a small wrench/tool icon appears above them.

**Why it matters:** This single feature would make the data center feel *alive*. Right now the floor is completely static between placement actions. Workers create ambient motion and make staffing decisions feel tangible — you can *see* your team responding to incidents.

---

### Floating World-Space Text ("Damage Numbers")

**Impact: High | Effort: Low-Medium**

Tycoon staple: text that rises from game objects to give constant feedback that the simulation is running.

| Event | Text | Color | Position |
|-------|------|-------|----------|
| Revenue tick | `+$144` | Green | Rises from cabinets |
| Expense tick | `-$50` | Red | Rises from expense source |
| Thermal throttle | `THROTTLED` | Orange | Above affected cabinet |
| Fire | `FIRE!` | Red, pulsing | Above burning cabinet |
| Incident spawn | `⚠ INCIDENT` | Yellow | Above affected area |
| Incident resolved | `RESOLVED ✓` | Green | Above resolved cabinet |
| Achievement | `★ ACHIEVEMENT` | Gold | Center screen |
| Contract completed | `CONTRACT COMPLETE` | Cyan | Top of screen |
| Temperature warning | `82°C ▲` | Orange/Red | Above hot cabinet |
| Server refresh | `REFRESHED` | Cyan | Above cabinet |

Implementation: Phaser `Text` objects with `this.tweens.add({ y: y - 40, alpha: 0, duration: 1500, ease: 'Power2' })`. Pool and recycle text objects to avoid GC pressure.

**Why it matters:** Creates a constant visual heartbeat. Players can *see* money flowing in, problems developing, and issues being resolved without opening any panel.

---

### Placement Pop & Build Animations

**Impact: Medium | Effort: Low**

Currently cabinets just appear instantly via `renderCabinet()`. Adding tweens makes building feel *satisfying*.

| Action | Animation |
|--------|-----------|
| Place cabinet | Scale 0→1 with `Back.easeOut` (bounce), brief green flash overlay |
| Add server | Small scale pulse on cabinet + green particle burst |
| Add leaf switch | Cyan flash on top of cabinet |
| Add spine | Orange scale-in with glow |
| Remove/destroy | Scale 1→0 with `Power2.easeIn`, red flash |
| Upgrade suite | Camera zoom out, grid expands with wave animation |

Implementation: Wrap `renderCabinet()` calls with `this.tweens.add({ scaleX: [0, 1], scaleY: [0, 1], duration: 300, ease: 'Back.easeOut' })`. Store graphics in containers for transform support.

**Why it matters:** RCT has that signature "chunk" when you place a ride segment. Even a simple scale tween transforms placement from "clicking a spreadsheet" to "building something."

---

### Particle Effects for Events

**Impact: Medium | Effort: Medium**

Phaser has a built-in particle system (`Phaser.GameObjects.Particles`) that's currently unused.

| Event | Particle Effect |
|-------|----------------|
| Fire active | Orange/red emitter over burning cabinet tile — flickering upward particles |
| Overloaded PDU | Electric spark particles (yellow/white, short bursts) |
| Cooling units running | Subtle blue mist/cold air particles drifting from unit |
| Thermal throttle | Heat shimmer — wavy transparent particles rising from cabinet |
| Server refresh | Brief sparkle/confetti burst (cyan) |
| Critical incident | Red warning pulse ring expanding outward from source |
| Achievement unlock | Gold particle shower from top of screen |
| Construction complete | Dust cloud settling (gray/brown particles) |

**Why it matters:** Particles make events feel *physical*. A fire that only shows a React banner feels like a notification. A fire with flickering orange particles rising from a cabinet tile feels like an emergency.

---

### Ambient Animations & Visual Life

**Impact: Medium | Effort: Low-Medium**

The isometric scene is completely static between state changes. Small ambient animations make it feel like a living facility.

| Element | Animation |
|---------|-----------|
| Cabinet LEDs | Slow pulse tween (alpha 0.4→1.0, 2s loop) when operational; fast blink (200ms) under load; off when powered down |
| Cooling unit fans | Small rotating line indicator (or animated circle) on operational cooling units |
| Spine switch activity | Subtle glow pulse when handling traffic |
| Power-off cabinets | Dim/darken the entire cabinet graphic (tint or alpha reduction) |
| Throttled cabinets | Red/orange tint overlay pulsing slowly, visually distinct from healthy cabinets |
| Weather effects | Rain particle overlay during rain/storm; heat shimmer during heatwave; snow particles during cold_snap |
| Day/night cycle | Subtle ambient light shift — slightly brighter during day hours, dimmer at night |
| Traffic links | Already animated (packet dots) — extend with glow pulse on active connections |

**Why it matters:** In RCT, rides run continuously, guests wander, and the park never feels "paused" even when you're not doing anything. The data center equivalent is servers humming, LEDs blinking, cooling running, and traffic flowing.

---

### Sound Design

**Impact: Medium | Effort: Medium**

RCT's ambient park audio is iconic. Even minimal procedural audio would add atmosphere.

| Category | Sounds |
|----------|--------|
| Ambient | Low server hum (looped, volume scales with cabinet count); HVAC white noise for cooling |
| Placement | Click/thunk on cabinet place; metallic slide for server install; switch click for leaf/spine |
| Alerts | Chime for achievement; alarm for fire/critical incident; warning tone for throttling |
| Economy | Cash register ding on contract completion; coin sound on revenue milestone |
| UI | Subtle click on button press; panel slide sound; toggle switch sound |

Implementation options: Web Audio API for procedural tones (low effort, no assets), or Phaser audio with small sound files. Volume controls in Settings panel. Master mute toggle.

**Why it matters:** Sound creates a subconscious connection to the game state. Players learn to recognize the "something's wrong" alarm tone before they even look at the screen.

---

### Camera Juice

**Impact: Low-Medium | Effort: Low**

Camera effects tied to significant game events.

| Event | Camera Effect |
|-------|--------------|
| Critical incident (fire, major outage) | Brief screen shake (2-3 frames, small amplitude) |
| Cabinet placed | Smooth camera pan to placed cabinet |
| Achievement unlocked | Subtle zoom pulse (quick zoom in 2%, back out) |
| Suite tier upgrade | Camera zooms out to reveal expanded grid |
| Explosion/fire suppression | Larger screen shake |
| Game over / bankruptcy | Slow zoom out, desaturation |

Implementation: `this.cameras.main.shake(100, 0.005)` for screen shake; `this.cameras.main.pan(x, y, 500)` for smooth pan.

**Why it matters:** Camera movement draws attention to important events and makes the world feel reactive to what's happening.

---

### Visual State Differentiation

**Impact: Medium | Effort: Low**

Currently many important states are invisible on the isometric grid. Players must open panels to see them.

| State | Current Visual | Proposed Visual |
|-------|---------------|----------------|
| Throttled cabinet (>80°C) | Identical to healthy | Red/orange tint overlay, pulsing glow |
| Powered-off cabinet | Identical to powered-on | Darkened/dimmed graphic, LEDs off |
| Cabinet on fire | No Phaser visual (React banner only) | Orange tint + fire particles |
| Overloaded PDU | Red color (exists) | Add spark particles |
| Active incident on cabinet | No visual | Yellow warning triangle icon above cabinet |
| Maintenance in progress | No visual | Blue wrench icon above cabinet, dimmed graphic |
| New/recently placed | No visual | Brief green highlight glow that fades over 3s |
| Server depreciation (old servers) | No visual | Slightly yellowed/aged tint on cabinet |
| Heat map | Uses server count (wrong) | Use actual `heatLevel` from store |

**Why it matters:** If you can't *see* that a cabinet is throttled or on fire without opening a panel, you lose the "glance and react" gameplay that RCT excels at.

---

### Sidebar Panel Slide Animation

**Impact: Low | Effort: Low**

Panels currently pop in/out via React conditional rendering with no transition. Adding a CSS slide animation makes the UI feel polished.

- Panel slides in from left: `transform: translateX(-100%) → translateX(0)` with `transition: transform 200ms ease-out`
- Panel slides out on close: reverse animation
- Content fades in slightly after panel reaches position (staggered, 50ms delay)

**Why it matters:** Small UI polish that eliminates the "jarring pop" feeling and makes the interface feel more game-like.

---

### Scenario Presentation & Framing

**Impact: Medium | Effort: Medium**

The game has 5 scenarios but they're accessed through a settings panel. RCT's scenario select screen with preview images, star ratings, and locked/unlocked progression is a major hook.

| Improvement | Description |
|-------------|-------------|
| Scenario select screen | Dedicated full-screen selector with scenario cards showing name, description, difficulty rating, objectives |
| Star ratings | 1-3 stars per scenario based on completion quality (e.g., finished early = 3 stars, barely made it = 1 star) |
| Locked progression | Later scenarios locked until earlier ones are completed |
| Scenario preview | Small isometric preview showing the starting state of each scenario |
| Victory/defeat screen | Dedicated results screen showing stats, time taken, score |
| Scenario leaderboard (local) | Best times/scores per scenario saved locally |

**Why it matters:** RCT's "one more scenario" pull is driven by the scenario select screen showing your progress. Making scenarios a first-class feature rather than a settings toggle adds significant replayability.

---

### Quick Reference: Game Feel Effort vs. Impact

```
                        LOW EFFORT          MEDIUM EFFORT         HIGH EFFORT
                   ┌──────────────────┬──────────────────┬──────────────────┐
                   │                  │                  │                  │
    HIGH IMPACT    │  Floating text   │                  │  Worker sprites  │
                   │                  │                  │   ("Peeps")      │
                   │                  │                  │                  │
                   ├──────────────────┼──────────────────┼──────────────────┤
                   │                  │                  │                  │
    MEDIUM IMPACT  │  Placement pop   │  Particle FX     │                  │
                   │  Visual states   │  Ambient anims   │                  │
                   │  Camera juice    │  Sound design    │                  │
                   │                  │  Scenario framing│                  │
                   ├──────────────────┼──────────────────┼──────────────────┤
                   │                  │                  │                  │
    LOW IMPACT     │  Panel slide     │                  │                  │
                   │   animation      │                  │                  │
                   │                  │                  │                  │
                   └──────────────────┴──────────────────┴──────────────────┘
```

**Best bets (high impact, low-medium effort):** Floating world-space text, placement pop animations, visual state differentiation.

**The big one (high impact, high effort):** Animated worker sprites — the single feature that would most transform the game's feel.

**Quick wins (low effort):** Placement tweens, camera juice, panel slide animation, visual state fixes (heat map using actual temp).

---

## Deferred Design Ideas

Ideas that were considered but deferred in favor of other approaches. Kept here for future reference.

### Structured Row Layout (Option A) — Data Center Floor Plan

**Context:** When redesigning the cabinet placement grid for realism (v0.4.0), two approaches were considered:
- **Option A (this one):** Structured row system with fixed aisle placement
- **Option B (implemented):** Free-form grid with soft constraints (bonuses/penalties)

**Concept:** Instead of a free-form grid where players choose where to place cabinets with soft incentives, the grid is pre-structured with fixed **cabinet rows** separated by fixed **aisle rows**. Players choose which cabinet row to place in, but aisles are guaranteed.

**Layout pattern:**
```
Row 0 (cabinets)  ← facing south (exhaust →)
--- Hot Aisle ---  ← 1-tile gap (maintenance + exhaust collection)
Row 1 (cabinets)  ← facing north (exhaust →)
--- Cold Aisle --- ← 1-tile gap (intake air supply)
Row 2 (cabinets)  ← facing south (exhaust →)
--- Hot Aisle ---
Row 3 (cabinets)  ← facing north (exhaust →)
```

**Pros:**
- Guarantees realistic layout — impossible to make bad aisle decisions
- Simpler to balance (always have proper airflow)
- More visually consistent and "real data center" looking
- Easier to implement containment systems (hot/cold aisle containment doors)
- Better foundation for a future "containment" upgrade system

**Cons:**
- Less player agency — can't make mistakes and learn from them
- Less strategic depth — layout decisions are largely made for you
- Harder to implement variable row widths or custom aisle configurations
- May feel restrictive for sandbox/creative play

**Why deferred:** Option B (free-form with soft constraints) was chosen because it preserves player agency — you can make bad decisions and learn from them, which is better tycoon gameplay. The penalty/bonus system creates more strategic depth and encourages learning real DC layout principles organically.

**Possible future use:**
- Could be offered as a "guided layout" toggle in settings for newer players
- Could be a tutorial scenario ("Design a proper data center from scratch")
- Could be the default for a future "enterprise" or "colocation" game mode where clients expect structured layouts

**Effort:** Medium | **Impact:** Medium — Would replace the soft-constraint system, not complement it.
