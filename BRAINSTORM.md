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
14. Power distribution and structured cabling (builds on manual cabinet placement)

### Phase 4 — Add World (make it immersive) ← NEXT
15. Staff & HR with skill levels
16. Carbon footprint and environmental regulation
17. Security tiers and compliance certifications
18. Competitor AI

### Phase 5 — Add Longevity (make it replayable)
19. ~~Achievement system~~ (moved earlier — already implemented)
20. Sandbox mode
21. Scenario challenges
22. Multi-site expansion

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
