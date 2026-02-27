import { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles, Wrench, Zap } from 'lucide-react'

interface ChangeEntry {
  text: string
  type: 'new' | 'improved' | 'system'
}

interface VersionEntry {
  version: string
  date: string
  title: string
  highlights: string
  changes: ChangeEntry[]
}

const CHANGELOG: VersionEntry[] = [
  {
    version: 'v0.5.3',
    date: 'Feb 2026',
    title: 'The Network Security Update',
    highlights: 'Network Access Control Lists (NACLs) add network-level defense against DDoS and ransomware. Choose from 4 NACL policies with tradeoffs between security and bandwidth.',
    changes: [
      { text: 'NACL policies — 4 tiers (Open, Standard, Strict, Zero Trust) with increasing network defense and bandwidth overhead', type: 'new' },
      { text: 'Network attack blocking — NACLs automatically block DDoS and ransomware incidents each tick based on defense rating', type: 'new' },
      { text: 'Bandwidth tradeoff — stricter NACL policies reduce effective traffic throughput (3–10% overhead)', type: 'new' },
      { text: '3 new achievements: Firewall Admin, Zero Trust Architect, DDoS Denied', type: 'new' },
      { text: 'NACL tutorial tip triggers when security tier supports filtering but no policy is set', type: 'new' },
      { text: 'Security panel updated with dedicated NACL section showing policy selection, defense stats, and attack counter', type: 'improved' },
      { text: 'In-game guide updated with NACL documentation showing all policy tiers and tradeoffs', type: 'improved' },
    ],
  },
  {
    version: 'v0.5.2',
    date: 'Feb 2026',
    title: 'The Global Strategy Update',
    highlights: 'Regional demand dynamics, data sovereignty laws, multi-site contracts, staff transfers between sites, competitor regional expansion, and regional disaster preparedness.',
    changes: [
      { text: 'Regional incidents — 13 disaster types (earthquakes, hurricanes, floods, grid collapse) affecting specific regions based on risk profiles', type: 'new' },
      { text: 'Disaster preparedness — install seismic reinforcement, flood barriers, hurricane hardening, or elevated equipment to mitigate regional disasters', type: 'new' },
      { text: 'Demand growth dynamics — regions evolve through emerging, stable, and saturated market phases over time', type: 'new' },
      { text: 'Data sovereignty — GDPR (EU), LGPD (Brazil), and PDPA (Singapore) rules grant revenue bonuses for compliant contracts', type: 'new' },
      { text: 'Multi-site contracts — 6 global contracts requiring operational presence in specific regions with completion bonuses up to $100K', type: 'new' },
      { text: 'Staff transfers — relocate staff between sites with same-continent (8 ticks) or cross-continent (15 ticks) travel time', type: 'new' },
      { text: 'Competitor regional expansion — AI competitors expand into regions, competing for market share globally', type: 'new' },
      { text: 'Regional competitor presence visualization in the Market panel', type: 'new' },
      { text: '5 new achievements for global strategy milestones (Global Deal, Data Sovereign, Staff Mobility, Demand Surfer, Global Empire)', type: 'new' },
      { text: 'In-game guide updated with demand growth, sovereignty, disaster prep, global contracts, and staff transfer sections', type: 'improved' },
      { text: '4 new tutorial tips for multi-site contracts, sovereignty, staff transfers, and demand growth', type: 'improved' },
      { text: 'World Map panel enhanced with demand trend indicators, sovereignty badges, and competitor presence', type: 'improved' },
      { text: 'Contracts panel now shows global contract offers alongside standard contracts', type: 'improved' },
    ],
  },
  {
    version: 'v0.5.1',
    date: 'Feb 2026',
    title: 'The Global Expansion Update',
    highlights: 'Build a worldwide data center empire — multi-site expansion across 15 regions, inter-site networking with 4 link types, edge PoP CDN revenue, and comprehensive in-game guide.',
    changes: [
      { text: 'Multi-site expansion — purchase and build data centers across 15 global regions from Ashburn to Tokyo', type: 'new' },
      { text: '6 site types — Headquarters, Edge PoP, Colocation, Hyperscale, Network Hub/IXP, and Disaster Recovery', type: 'new' },
      { text: 'World map panel — interactive SVG map showing all sites, links, and regional stats', type: 'new' },
      { text: 'Region profiles — unique power costs, labor rates, climate, demand patterns, and disaster risks per location', type: 'new' },
      { text: 'Inter-site networking — connect sites with IP Transit, Leased Wavelength, Dark Fiber, or Submarine Cable links', type: 'new' },
      { text: 'Edge PoP CDN revenue — edge sites earn passive income per Gbps of backhaul bandwidth', type: 'new' },
      { text: 'Link reliability — links can go down based on type reliability, with automatic recovery', type: 'new' },
      { text: 'Geographic link constraints — dark fiber/wavelength for same-continent, submarine cable for cross-continent only', type: 'new' },
      { text: '5 new achievements for inter-site networking milestones', type: 'new' },
      { text: 'In-game guide updated with 10 new sections covering all game systems', type: 'improved' },
      { text: '2 new tutorial tips for first link and edge PoP backhaul', type: 'improved' },
    ],
  },
  {
    version: 'v0.5.0',
    date: 'Feb 2026',
    title: 'The Game Feel Update',
    highlights: 'Worker sprites walk your corridors, particle effects bring events to life, weather overlays, day/night cycle, scenario select screen, and polished animations throughout.',
    changes: [
      { text: 'Animated worker sprites ("peeps") — staff walk corridors, respond to incidents, and patrol when idle with role-colored uniforms', type: 'new' },
      { text: 'Particle effects — fire flickering, PDU sparks, cooling mist, heat shimmer, server refresh sparkles, incident pulse rings, achievement gold shower', type: 'new' },
      { text: 'Weather particle overlays — rain streaks during storms, snow in winter, heat shimmer during heatwaves', type: 'new' },
      { text: 'Day/night ambient light cycle — facility darkens at night (20:00–06:00) with dawn/dusk transitions', type: 'new' },
      { text: 'Scenario select screen — dedicated panel with scenario cards, 1-3 star ratings, locked progression, and victory/defeat results', type: 'new' },
      { text: 'Server install animation — scale pulse + green particle burst when adding servers to cabinets', type: 'new' },
      { text: 'Leaf switch install animation — cyan flash effect on top of cabinet', type: 'new' },
      { text: 'Equipment removal animation — red flash + shrink effect', type: 'new' },
      { text: 'Smooth camera pan to newly placed cabinets', type: 'new' },
      { text: 'Enhanced sound effects — metallic slide for server install, switch click for leaf/spine, fire alarm, cash register ding, HVAC burst, UI click, removal sound', type: 'improved' },
      { text: 'Scenario system now tracks best completion times and calculates star ratings', type: 'improved' },
      { text: 'Scenarios panel added to sidebar with Target icon', type: 'improved' },
    ],
  },
  {
    version: 'v0.4.1',
    date: 'Feb 2026',
    title: 'Visual State Differentiation',
    highlights: 'Cabinets now visually communicate their state — see throttling, fires, incidents, maintenance, and aging at a glance.',
    changes: [
      { text: 'Throttled cabinets show red/orange tint overlay with THROTTLED label', type: 'new' },
      { text: 'Cabinets on fire display orange tint with FIRE label directly on the grid', type: 'new' },
      { text: 'Active incidents show yellow warning triangle icon above affected cabinets', type: 'new' },
      { text: 'Maintenance in progress shown with blue wrench icon and blue tint overlay', type: 'new' },
      { text: 'Powered-off cabinets appear dimmed with dark overlay and OFFLINE label', type: 'new' },
      { text: 'Aged/deprecated servers get yellowed tint with AGING label past 80% lifespan', type: 'new' },
      { text: 'Newly placed cabinets get a green highlight glow that fades over 3 seconds', type: 'new' },
      { text: 'Heat map now uses actual cabinet temperature instead of server count', type: 'improved' },
      { text: 'Heat map shows green-to-yellow-to-red gradient with per-cabinet temperature labels', type: 'improved' },
    ],
  },
  {
    version: 'v0.4.0',
    date: 'Feb 2026',
    title: 'The Infrastructure Update',
    highlights: 'Sub-floor views, 42U rack detail, workloads, advanced tiers, sound, and deep infrastructure upgrades.',
    changes: [
      { text: 'Sub-floor view mode — see cooling pipes, power conduits, and infrastructure beneath the raised floor', type: 'new' },
      { text: '42U rack model — detailed per-U equipment placement with 8 equipment types in the cabinet detail panel', type: 'new' },
      { text: 'Advanced scaling tiers — Nuclear (SMR) and Fusion/Kugelblitz late-game progression beyond Enterprise', type: 'new' },
      { text: 'Workload simulation — assign AI training, batch processing, rendering, and database migration jobs to cabinets', type: 'new' },
      { text: 'Sound effects — procedural Web Audio API synthesis for placement, alerts, achievements, and ambient hum', type: 'new' },
      { text: 'Placement animations — expanding neon ring effect when building equipment', type: 'new' },
      { text: 'Leaderboards — local leaderboard tracking revenue, uptime, and cabinet count across sessions', type: 'new' },
      { text: 'Row-end infrastructure slots — mount PDUs, coolers, fire panels, or patch panels at row ends', type: 'new' },
      { text: 'Aisle width upgrades — widen aisles for better maintenance speed and cooling airflow', type: 'new' },
      { text: 'Raised floor system — install 12" or 24" raised floors for underfloor cooling distribution', type: 'new' },
      { text: 'Cable management tiers — overhead trays or underfloor conduits to reduce cable mess incidents', type: 'new' },
      { text: 'Chiller plants & cooling pipes — connect chillers to CRAH units for boosted cooling efficiency', type: 'new' },
      { text: 'Cooling failure incidents — cooling units can now malfunction, requiring repair', type: 'new' },
      { text: 'Mixed-environment penalty and dedicated row bonus for cabinet organization', type: 'new' },
      { text: 'Zone contracts — high-tier contracts require organized cabinet zones', type: 'new' },
      { text: 'Placeable cooling units — fan trays, CRACs, CRAHs, and immersion pods with coverage zones', type: 'improved' },
      { text: 'Operations progression — 4 ops tiers from Manual to Orchestration with automation benefits', type: 'improved' },
      { text: '89 total achievements (19 new) across all game systems', type: 'improved' },
      { text: '34 contextual tutorial tips including cooling, infrastructure, and operations guidance', type: 'improved' },
      { text: 'Codebase refactored — gameStore split into modular files for maintainability', type: 'system' },
    ],
  },
  {
    version: 'v0.3.0',
    date: 'Feb 2026',
    title: 'The Longevity Update',
    highlights: 'Supply chain, weather, interconnections, and much more for long-term replayability.',
    changes: [
      { text: 'Supply chain & procurement — order hardware in bulk for discounts and manage lead times', type: 'new' },
      { text: 'Weather system — seasons and weather conditions now affect your cooling needs', type: 'new' },
      { text: 'Meet-me room & interconnections — install a shared facility and earn passive revenue from network tenants', type: 'new' },
      { text: 'Custom server configs — choose from 5 server builds (Balanced, CPU, GPU, Storage, Memory) to match customer needs', type: 'new' },
      { text: 'Network peering & transit — establish peering agreements to reduce latency and costs', type: 'new' },
      { text: 'Maintenance windows — schedule preventive maintenance for reliability and cooling boosts', type: 'new' },
      { text: 'Power redundancy tiers — upgrade from N to N+1 or 2N for backup power protection', type: 'new' },
      { text: 'Noise & community relations — manage noise levels, install sound barriers, and avoid fines', type: 'new' },
      { text: 'Spot compute market — sell spare server capacity at dynamic market prices', type: 'new' },
      { text: 'Insurance policies — protect against fire, power, cyber, and equipment incidents', type: 'new' },
      { text: 'Patent system — patent your research for ongoing royalty income', type: 'new' },
      { text: 'Scenario challenges — 5 themed challenges with unique goals and constraints', type: 'new' },
      { text: 'Sandbox mode — unlimited funds for creative building and experimentation', type: 'new' },
      { text: 'Demo mode — try a pre-built data center instantly with ?demo=true', type: 'new' },
      { text: 'Busways, cross-connects, and in-row cooling infrastructure', type: 'new' },
      { text: 'Event log with filtering — track everything happening in your data center', type: 'improved' },
      { text: 'Lifetime statistics dashboard — cumulative stats across your entire run', type: 'improved' },
      { text: 'Tutorial system — 30 contextual tips that appear as you discover new mechanics', type: 'improved' },
      { text: '30+ new achievements to unlock across all new systems', type: 'improved' },
    ],
  },
  {
    version: 'v0.2.0',
    date: 'Jan 2026',
    title: 'The Living World Update',
    highlights: 'Staff, environment, security, and AI competitors bring your data center to life.',
    changes: [
      { text: 'Staff & HR — hire engineers, electricians, cooling specialists, and security officers', type: 'new' },
      { text: 'Staff training & certifications — send your team to earn CCNA, DCIM, and more', type: 'new' },
      { text: 'Shift patterns — choose day-only, day-night, or 24/7 coverage', type: 'new' },
      { text: 'Carbon footprint tracking — monitor emissions and earn green certifications', type: 'new' },
      { text: 'Energy source selection — switch from grid power to solar or wind', type: 'new' },
      { text: 'Green certifications — earn Energy Star, LEED Silver/Gold, or Carbon Neutral status for revenue bonuses', type: 'new' },
      { text: 'E-waste management — recycle old servers responsibly or face reputation penalties', type: 'new' },
      { text: 'Security tiers — upgrade from Basic to Maximum security with 7 security features', type: 'new' },
      { text: 'Compliance certifications — audit for SOC 2, HIPAA, PCI-DSS, or FedRAMP', type: 'new' },
      { text: 'Premium contracts — compliance certs unlock high-value healthcare, finance, and government contracts', type: 'new' },
      { text: 'AI competitors — rival data centers appear, compete for contracts, and may poach your staff', type: 'new' },
      { text: 'Market share tracking — see how you stack up against the competition', type: 'new' },
      { text: 'Competitor events — price wars, staff poaching, and competitor outages add unpredictability', type: 'new' },
      { text: '16 new achievements across staff, carbon, security, and market systems', type: 'improved' },
    ],
  },
  {
    version: 'v0.1.0',
    date: 'Dec 2025',
    title: 'Launch — The Foundation',
    highlights: 'The core data center simulation with building, networking, economy, and incidents.',
    changes: [
      { text: 'Build cabinets and fill them with servers, leaf switches, and spine switches', type: 'new' },
      { text: 'Clos (spine-leaf) network fabric with ECMP traffic routing', type: 'new' },
      { text: 'Revenue from running servers — earn $12/tick per active server', type: 'new' },
      { text: 'Heat simulation — servers generate heat, cooling keeps things under control', type: 'new' },
      { text: 'Air vs water cooling trade-offs', type: 'new' },
      { text: 'Thermal throttling — overheated servers earn half revenue', type: 'new' },
      { text: 'Game speed controls — pause, 1x, 2x, or 3x simulation speed', type: 'new' },
      { text: '20+ random incidents — fiber cuts, DDoS, squirrels, and even sentient AI outbreaks', type: 'new' },
      { text: 'Backup generators with fuel management for power outages', type: 'new' },
      { text: 'Fire suppression systems — water (cheap) vs gas (minimal damage)', type: 'new' },
      { text: '5 customer types — General, AI Training, Streaming, Crypto, Enterprise', type: 'new' },
      { text: 'Day/night traffic patterns with peak hours', type: 'new' },
      { text: 'Tech tree with 9 technologies across 3 research branches', type: 'new' },
      { text: 'Dynamic power market pricing with fluctuations and spikes', type: 'new' },
      { text: 'Server depreciation and hardware refresh cycles', type: 'new' },
      { text: 'Reputation system — build your score from Unknown to Legendary', type: 'new' },
      { text: 'Loan system with 3 tiers', type: 'new' },
      { text: 'PDUs, cable trays, and hot/cold aisle management', type: 'new' },
      { text: 'Bronze, Silver, and Gold contracts with SLA requirements', type: 'new' },
      { text: 'Suite tier upgrades — grow from Starter (4x2) to Enterprise (10x5)', type: 'new' },
      { text: 'Isometric game view with traffic animations and heat map overlay', type: 'system' },
      { text: 'Save/load system with 3 save slots', type: 'system' },
    ],
  },
]

const TYPE_CONFIG = {
  new: { icon: Sparkles, label: 'New', color: '#00ff88' },
  improved: { icon: Wrench, label: 'Improved', color: '#00aaff' },
  system: { icon: Zap, label: 'System', color: '#aa44ff' },
} as const

export function BuildLogsPanel() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(CHANGELOG[0].version)

  const toggleVersion = (version: string) => {
    setExpandedVersion(prev => prev === version ? null : version)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        See what&apos;s been added and improved in each update.
      </p>

      {CHANGELOG.map((entry) => {
        const isExpanded = expandedVersion === entry.version
        return (
          <div
            key={entry.version}
            className="rounded-lg border border-border/60 overflow-hidden"
          >
            {/* Version header */}
            <button
              onClick={() => toggleVersion(entry.version)}
              className="w-full flex items-start gap-2 p-2.5 hover:bg-muted/30 transition-colors text-left"
            >
              {isExpanded ? (
                <ChevronDown className="size-3.5 text-neon-green mt-0.5 shrink-0" />
              ) : (
                <ChevronRight className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-neon-green">{entry.version}</span>
                  {entry === CHANGELOG[0] && (
                    <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-neon-green/15 text-neon-green border border-neon-green/30">
                      LATEST
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{entry.date}</span>
                </div>
                <p className="text-xs font-bold text-foreground">{entry.title}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                  {entry.highlights}
                </p>
              </div>
            </button>

            {/* Expanded changes */}
            {isExpanded && (
              <div className="border-t border-border/40 px-2.5 py-2 flex flex-col gap-1.5">
                {entry.changes.map((change, i) => {
                  const config = TYPE_CONFIG[change.type]
                  const Icon = config.icon
                  return (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <Icon
                        className="size-3 mt-0.5 shrink-0"
                        style={{ color: config.color }}
                      />
                      <span className="text-muted-foreground leading-relaxed">
                        {change.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
