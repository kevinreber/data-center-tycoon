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
