import { Github, Bug, GitPullRequest } from 'lucide-react'
import { useGameStore, ENVIRONMENT_CONFIG, SIM, SPACING_CONFIG, COOLING_CONFIG, INROW_COOLING_OPTIONS, OPS_TIER_CONFIG } from '@/stores/gameStore'

const REPO_URL = 'https://github.com/kevinreber/data-center-tycoon'

export function GuidePanel() {
  const money = useGameStore((s) => s.money)
  const cabinets = useGameStore((s) => s.cabinets)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3 glow-green">
        <p className="text-xs font-bold text-neon-green mb-2">GETTING STARTED</p>
        <ol className="text-xs font-mono text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            <strong className="text-foreground">Build cabinets</strong>
            {' '}&mdash; Choose an environment type, then add cabinets to the grid.
          </li>
          <li>
            <strong className="text-foreground">Choose environments</strong>
            {' '}&mdash; <span style={{ color: ENVIRONMENT_CONFIG.production.color }}>Production</span> earns full revenue.
            {' '}<span style={{ color: ENVIRONMENT_CONFIG.lab.color }}>Lab</span> runs cooler at 25% revenue.
            {' '}<span style={{ color: ENVIRONMENT_CONFIG.management.color }}>Management</span> reduces cooling costs facility-wide.
          </li>
          <li>
            <strong className="text-foreground">Fill &amp; connect</strong>
            {' '}&mdash; Add <span className="text-neon-green">Servers</span> (up to 4/cabinet),
            {' '}<span className="text-neon-cyan">Leaf Switches</span> (ToR), and
            {' '}<span className="text-neon-orange">Spine Switches</span> for the fabric.
          </li>
          <li>
            <strong className="text-foreground">Scale smart</strong>
            {' '}&mdash; Servers generate <span className="text-neon-yellow">${SIM.revenuePerServer}/tick</span>.
            As you grow, add Management cabinets to control rising cooling costs.
          </li>
          <li>
            <strong className="text-foreground">Upgrade facility</strong>
            {' '}&mdash; Start in a small suite and migrate to bigger ones in the
            {' '}<span className="text-neon-cyan">FACILITY</span> panel when you need more space.
          </li>
        </ol>
      </div>

      {/* Layout strategy guide */}
      <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
        <p className="text-xs font-bold text-neon-cyan mb-2">LAYOUT STRATEGY</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          When placing cabinets, colored overlays show airflow zones. Press <strong className="text-neon-green">R</strong> to rotate facing.
        </p>
        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: '#4488ff' }} />
            <div className="text-xs font-mono">
              <strong className="text-[#4488ff]">Cold Aisle</strong>
              <span className="text-muted-foreground"> &mdash; Intake side. Keep clear for cool air supply. Open front = <span className="text-neon-green">-{SPACING_CONFIG.openFrontCoolingBonus}&deg;C/tick</span> cooling bonus.</span>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: '#ff8844' }} />
            <div className="text-xs font-mono">
              <strong className="text-[#ff8844]">Hot Exhaust</strong>
              <span className="text-muted-foreground"> &mdash; Exhaust side. Keep clear so heat can escape. Open rear = <span className="text-neon-green">-{SPACING_CONFIG.openRearCoolingBonus}&deg;C/tick</span> cooling bonus.</span>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: '#aaaa44' }} />
            <div className="text-xs font-mono">
              <strong className="text-[#aaaa44]">Access</strong>
              <span className="text-muted-foreground"> &mdash; Side walkway for DC techs. No access = <span className="text-neon-red">{SPACING_CONFIG.noAccessMaintenanceCostMult}x</span> maintenance cost.</span>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: '#ff4444' }} />
            <div className="text-xs font-mono">
              <strong className="text-[#ff4444]">Blocked</strong>
              <span className="text-muted-foreground"> &mdash; Airflow obstructed. Causes <span className="text-neon-red">+{SPACING_CONFIG.adjacentHeatPenalty}&deg;C/tick</span> heat per neighbor. Fire can spread!</span>
            </div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-neon-cyan/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> Alternate facing (N/S or E/W) in adjacent rows/columns.
            Leave 1&ndash;2 tile gaps for proper hot/cold aisles. This earns up to {Math.round(SPACING_CONFIG.maxAisleSpacingBonus * 100)}% cooling bonus.
          </p>
        </div>
      </div>

      {/* Cooling & thermal management strategy */}
      <div className="rounded-lg border border-neon-red/20 bg-neon-red/5 p-3">
        <p className="text-xs font-bold text-neon-red mb-2">COOLING &amp; THERMAL MANAGEMENT</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Every server generates <span className="text-neon-red">+{SIM.heatPerServer}&deg;C/tick</span> of heat.
          Air cooling is always active and removes <span className="text-neon-cyan">-{COOLING_CONFIG.air.coolingRate}&deg;C/tick</span> automatically &mdash; but
          it can&rsquo;t keep up as you add more servers.
        </p>

        <div className="space-y-2 mb-2">
          <p className="text-[10px] font-mono font-bold text-neon-yellow">WHY COOLING MATTERS</p>
          <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              Above <span className="text-neon-yellow">{SIM.throttleTemp}&deg;C</span>: servers are <strong className="text-neon-red">thermally throttled</strong> and earn only <strong className="text-neon-red">50% revenue</strong>
            </li>
            <li>
              Above <span className="text-neon-red">{SIM.criticalTemp}&deg;C</span>: risk of <strong className="text-neon-red">fire</strong> that can destroy equipment
            </li>
            <li>
              Higher heat = higher <strong className="text-foreground">cooling power overhead</strong>, eating into your profits
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-mono font-bold text-neon-cyan">COOLING STRATEGIES (CHEAPEST FIRST)</p>
          <ol className="text-xs font-mono text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>
              <strong className="text-foreground">Layout optimization</strong> (free)
              <span className="text-muted-foreground"> &mdash; Alternate cabinet facing and leave gaps for hot/cold aisles. Up to {Math.round(SPACING_CONFIG.maxAisleSpacingBonus * 100)}% cooling bonus.</span>
            </li>
            <li>
              <strong className="text-foreground">Management cabinets</strong> (${(2000).toLocaleString()}/cab)
              <span className="text-muted-foreground"> &mdash; Each management server cuts cooling overhead by 3% (max 30%). Great long-term investment.</span>
            </li>
            <li>
              <strong className="text-foreground">In-row cooling units</strong> (${INROW_COOLING_OPTIONS[0].cost.toLocaleString()}&ndash;${INROW_COOLING_OPTIONS[2].cost.toLocaleString()})
              <span className="text-muted-foreground"> &mdash; Place next to hot cabinets for targeted {INROW_COOLING_OPTIONS[0].coolingBonus}&ndash;{INROW_COOLING_OPTIONS[2].coolingBonus}&deg;C/tick extra cooling.</span>
            </li>
            <li>
              <strong className="text-foreground">Water cooling upgrade</strong> (${COOLING_CONFIG.water.upgradeCost.toLocaleString()})
              <span className="text-muted-foreground"> &mdash; Facility-wide upgrade: {COOLING_CONFIG.water.coolingRate}&deg;C/tick removal and {Math.round(COOLING_CONFIG.water.overheadReduction * 100)}% lower PUE overhead. Best for 8+ cabinets.</span>
            </li>
          </ol>
        </div>

        <div className="mt-2 pt-2 border-t border-neon-red/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Rule of thumb:</strong> With air cooling, 1 cabinet handles ~1 server comfortably.
            At 3&ndash;4 servers per cabinet, you&rsquo;ll need layout bonuses or in-row cooling to stay under {SIM.throttleTemp}&deg;C.
            Water cooling is the long-term solution for any serious operation.
          </p>
        </div>
      </div>

      {/* New systems guide */}
      <div className="rounded-lg border border-[#44cc44]/20 bg-[#44cc44]/5 p-3">
        <p className="text-xs font-bold text-[#44cc44] mb-2">CARBON &amp; ENVIRONMENT</p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong className="text-foreground">Energy sources</strong> &mdash; Switch from grid to solar/wind to cut carbon.</li>
          <li><strong className="text-foreground">Carbon tax</strong> &mdash; Escalates over time. Green certs reduce it.</li>
          <li><strong className="text-foreground">E-waste</strong> &mdash; Server refreshes create e-waste. Recycle it properly!</li>
          <li><strong className="text-foreground">Green certs</strong> &mdash; Maintain low PUE &amp; clean energy for revenue bonuses.</li>
        </ul>
      </div>

      <div className="rounded-lg border border-[#ff8844]/20 bg-[#ff8844]/5 p-3">
        <p className="text-xs font-bold text-[#ff8844] mb-2">SECURITY &amp; COMPLIANCE</p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong className="text-foreground">Security tiers</strong> &mdash; Upgrade from Basic to Maximum for better defense.</li>
          <li><strong className="text-foreground">Compliance</strong> &mdash; Audit for SOC 2, HIPAA, PCI-DSS, or FedRAMP.</li>
          <li><strong className="text-foreground">Premium contracts</strong> &mdash; Compliance certs unlock high-value contracts.</li>
          <li><strong className="text-foreground">Intrusions</strong> &mdash; Security features block tailgating &amp; break-ins.</li>
        </ul>
      </div>

      <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
        <p className="text-xs font-bold text-neon-cyan mb-2">MARKET &amp; COMPETITORS</p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong className="text-foreground">Competitors</strong> &mdash; AI rivals appear as you grow (up to 3).</li>
          <li><strong className="text-foreground">Contract bidding</strong> &mdash; Accept contracts before competitors win them.</li>
          <li><strong className="text-foreground">Price wars</strong> &mdash; Competitors may slash prices, reducing market revenue.</li>
          <li><strong className="text-foreground">Staff poaching</strong> &mdash; Counter-offer or lose staff to rivals.</li>
        </ul>
      </div>

      <div className="rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-3">
        <p className="text-xs font-bold text-neon-yellow mb-2">OPERATIONS PROGRESSION</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Level up your operations maturity to handle incidents like a pro. Find it in the <span className="text-neon-cyan">OPERATIONS</span> panel.
        </p>
        <div className="space-y-1.5">
          {OPS_TIER_CONFIG.map((tier) => (
            <div key={tier.id} className="flex gap-2 items-start">
              <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: tier.color }} />
              <div className="text-xs font-mono">
                <strong style={{ color: tier.color }}>{tier.label}</strong>
                <span className="text-muted-foreground"> &mdash; {tier.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-neon-yellow/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Key benefits:</strong> Fewer incidents, faster auto-resolve, cheaper resolve costs, and boosted staff effectiveness. Unlock higher tiers by hiring staff, researching tech, and building reputation.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[#aa44ff]/20 bg-[#aa44ff]/5 p-3">
        <p className="text-xs font-bold text-[#aa44ff] mb-2">CONTRIBUTE</p>
        <p className="text-xs font-mono text-muted-foreground mb-3">
          Fabric Tycoon is open source! Help us build the ultimate data center simulator.
        </p>
        <div className="flex flex-col gap-1.5">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[#aa44ff] hover:text-[#cc66ff] transition-colors"
          >
            <Github className="size-3.5 shrink-0" />
            <span>View on GitHub</span>
          </a>
          <a
            href={`${REPO_URL}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[#aa44ff] hover:text-[#cc66ff] transition-colors"
          >
            <Bug className="size-3.5 shrink-0" />
            <span>Report a Bug</span>
          </a>
          <a
            href={`${REPO_URL}/pulls`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[#aa44ff] hover:text-[#cc66ff] transition-colors"
          >
            <GitPullRequest className="size-3.5 shrink-0" />
            <span>Submit a Pull Request</span>
          </a>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1.5 font-mono">
        <p className="text-neon-green font-bold">Quick Stats</p>
        <p>Balance: <span className="text-neon-yellow">${Math.floor(money).toLocaleString()}</span></p>
        <p>Cabinets: <span className="text-foreground">{cabinets.length}</span></p>
      </div>
    </div>
  )
}
