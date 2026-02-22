import { Github, Bug, GitPullRequest } from 'lucide-react'
import { useGameStore, ENVIRONMENT_CONFIG, SIM, SPACING_CONFIG, COOLING_CONFIG, INROW_COOLING_OPTIONS, COOLING_UNIT_CONFIG, OPS_TIER_CONFIG, SERVER_CONFIG_OPTIONS, ZONE_BONUS_CONFIG, WORKLOAD_CONFIG, ADVANCED_TIER_CONFIG, SPOT_COMPUTE_CONFIG, SITE_TYPE_CONFIG, INTER_SITE_LINK_CONFIG, MAX_LINKS_PER_SITE, EDGE_POP_CDN_REVENUE_PER_GBPS, DATA_SOVEREIGNTY_CONFIG, MULTI_SITE_CONTRACT_CATALOG, STAFF_TRANSFER_CONFIG, DEMAND_GROWTH_CONFIG, DISASTER_PREP_CONFIG } from '@/stores/gameStore'

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
        <p className="text-xs font-bold text-neon-cyan mb-2">LAYOUT &amp; AISLES</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Your facility has pre-built <strong className="text-foreground">cabinet rows</strong> with cold aisles between them.
          Cabinet facing (N/S) is enforced by the row layout &mdash; no manual rotation needed.
          Colored overlays show airflow zones during placement.
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
            <strong className="text-foreground">Pro tip:</strong> The row layout handles hot/cold aisle separation automatically.
            Fill both sides of an aisle to earn up to {Math.round(SPACING_CONFIG.maxAisleSpacingBonus * 100)}% cooling bonus.
            At Standard tier+, upgrade aisles with <strong className="text-foreground">containment</strong> for even better cooling.
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
              <strong className="text-foreground">Fill both sides of aisles</strong> (free)
              <span className="text-muted-foreground"> &mdash; Populate cabinet rows on both sides of each aisle for up to {Math.round(SPACING_CONFIG.maxAisleSpacingBonus * 100)}% cooling bonus. Upgrade with containment ($15k/aisle) for extra efficiency.</span>
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
              <strong className="text-foreground">Cooling units</strong> ($3,000&ndash;$60,000)
              <span className="text-muted-foreground"> &mdash; Placeable infrastructure with coverage zones. {COOLING_UNIT_CONFIG.map(c => `${c.label}: ${c.coolingRate}&deg;C/tick, range ${c.range}`).join('; ')}. Units degrade when serving more cabinets than their max capacity.</span>
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

      {/* Server configurations */}
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3">
        <p className="text-xs font-bold text-neon-green mb-2">SERVER CONFIGURATIONS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Choose a server build to match your customer base. Set in the <span className="text-neon-cyan">EQUIPMENT</span> panel.
        </p>
        <div className="space-y-1.5">
          {SERVER_CONFIG_OPTIONS.map((cfg) => (
            <div key={cfg.id} className="flex gap-2 items-start">
              <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: cfg.color }} />
              <div className="text-xs font-mono">
                <strong style={{ color: cfg.color }}>{cfg.label}</strong>
                <span className="text-muted-foreground"> &mdash; {cfg.revenueMultiplier}x revenue, {cfg.heatMultiplier}x heat, {cfg.powerMultiplier}x power. Best for {cfg.bestFor.join(', ')}.</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-neon-green/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> Match server configs to customer types for up to 30% bonus revenue. GPU Accelerated is high risk/high reward &mdash; 2.2x heat!
          </p>
        </div>
      </div>

      {/* Zone bonuses */}
      <div className="rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-3">
        <p className="text-xs font-bold text-neon-yellow mb-2">ZONE BONUSES</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Place <strong className="text-foreground">{ZONE_BONUS_CONFIG.minClusterSize}+ adjacent cabinets</strong> of the same environment or customer type to form a zone. Zones grant passive bonuses.
        </p>
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-bold text-neon-yellow">ENVIRONMENT ZONES</p>
          <ul className="text-xs font-mono text-muted-foreground space-y-0.5 list-disc list-inside">
            <li><span style={{ color: ENVIRONMENT_CONFIG.production.color }}>Production</span> zone: <span className="text-neon-green">+{ZONE_BONUS_CONFIG.environmentBonus.production.revenueBonus}%</span> revenue</li>
            <li><span style={{ color: ENVIRONMENT_CONFIG.lab.color }}>Lab</span> zone: <span className="text-neon-green">-{Math.abs(ZONE_BONUS_CONFIG.environmentBonus.lab.heatReduction)}%</span> heat</li>
            <li><span style={{ color: ENVIRONMENT_CONFIG.management.color }}>Management</span> zone: <span className="text-neon-green">-{Math.abs(ZONE_BONUS_CONFIG.environmentBonus.management.heatReduction)}%</span> heat</li>
          </ul>
        </div>
        <div className="mt-1.5 space-y-1">
          <p className="text-[10px] font-mono font-bold text-neon-yellow">CUSTOMER TYPE ZONES</p>
          <p className="text-xs font-mono text-muted-foreground">
            Same customer type clusters grant <span className="text-neon-green">+5&ndash;10%</span> revenue. AI Training zones give the highest bonus (+10%).
          </p>
        </div>
      </div>

      {/* Infrastructure upgrades */}
      <div className="rounded-lg border border-[#8888ff]/20 bg-[#8888ff]/5 p-3">
        <p className="text-xs font-bold text-[#8888ff] mb-2">INFRASTRUCTURE UPGRADES</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Upgrade your facility&rsquo;s infrastructure in the <span className="text-neon-cyan">INFRASTRUCTURE</span> panel.
        </p>
        <div className="space-y-2">
          <div className="text-xs font-mono">
            <strong className="text-foreground">Row-end slots</strong>
            <span className="text-muted-foreground"> &mdash; Mount PDUs ($4k, +15% efficiency), coolers ($6k, -1&deg;C/row), fire panels ($3.5k), or patch panels ($2.5k) at row ends.</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-foreground">Aisle widths</strong>
            <span className="text-muted-foreground"> &mdash; Standard (free) &rarr; Wide ($8k, +15% maint speed, +3% cooling) &rarr; Extra Wide ($15k, +30% maint, +6% cooling).</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-foreground">Raised floor</strong>
            <span className="text-muted-foreground"> &mdash; None &rarr; Basic 12&quot; ($25k, +8% cooling) &rarr; Advanced 24&quot; ($60k, +15% cooling). Enables underfloor cable conduits.</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-foreground">Cable management</strong>
            <span className="text-muted-foreground"> &mdash; None &rarr; Overhead trays ($15k, 40% mess reduction) &rarr; Underfloor conduits ($20k, 60% reduction, requires raised floor).</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-foreground">Busways &amp; cross-connects</strong>
            <span className="text-muted-foreground"> &mdash; Overhead power distribution and direct physical connections between equipment.</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-foreground">Chiller plants &amp; pipes</strong>
            <span className="text-muted-foreground"> &mdash; Connect chiller plants to CRAH units via cooling pipes for boosted cooling efficiency.</span>
          </div>
        </div>
      </div>

      {/* Workloads */}
      <div className="rounded-lg border border-[#ff44aa]/20 bg-[#ff44aa]/5 p-3">
        <p className="text-xs font-bold text-[#ff44aa] mb-2">WORKLOADS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Assign temporary compute jobs to cabinets for bonus payouts. Found in the <span className="text-neon-cyan">EQUIPMENT</span> panel.
        </p>
        <div className="space-y-1.5">
          {WORKLOAD_CONFIG.map((wl) => (
            <div key={wl.type} className="flex gap-2 items-start">
              <div className="w-3 h-3 rounded-sm shrink-0 mt-0.5" style={{ backgroundColor: wl.color }} />
              <div className="text-xs font-mono">
                <strong style={{ color: wl.color }}>{wl.label}</strong>
                <span className="text-muted-foreground"> &mdash; {wl.durationTicks} ticks, ${wl.basePayout.toLocaleString()} payout, {wl.heatMultiplier}x heat.{wl.failOnOverheat ? ` Fails above ${wl.failTemp}\u00B0C!` : ''}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-[#ff44aa]/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Warning:</strong> Workloads multiply heat generation. Ensure adequate cooling before launching AI Training jobs &mdash; overheating kills the workload and you lose the payout.
          </p>
        </div>
      </div>

      {/* Spot compute market */}
      <div className="rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-3">
        <p className="text-xs font-bold text-neon-yellow mb-2">SPOT COMPUTE MARKET</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Allocate spare server capacity to the dynamic spot market for extra revenue. Managed in <span className="text-neon-cyan">OPERATIONS</span>.
        </p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li>Spot price fluctuates between <span className="text-neon-green">{SPOT_COMPUTE_CONFIG.minPriceMultiplier}x</span>&ndash;<span className="text-neon-green">{SPOT_COMPUTE_CONFIG.maxPriceMultiplier}x</span> base rate</li>
          <li>Prices are <strong className="text-foreground">inversely correlated</strong> with regular demand &mdash; sell when regular traffic is low</li>
          <li>Volatility: {Math.round(SPOT_COMPUTE_CONFIG.volatility * 100)}% max change per tick</li>
        </ul>
      </div>

      {/* 42U rack model */}
      <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
        <p className="text-xs font-bold text-neon-cyan mb-2">42U RACK MODEL</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Click any cabinet to open its detail panel. The <strong className="text-foreground">42U rack view</strong> shows per-U equipment placement &mdash; install servers, switches, UPS, patch panels, and more in specific rack positions.
        </p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li>8 equipment types from 1U servers to 4U storage arrays</li>
          <li>Each piece has unique power draw, heat output, and revenue</li>
          <li>Plan rack layout carefully &mdash; 42U fills up fast!</li>
        </ul>
      </div>

      {/* Advanced tiers */}
      <div className="rounded-lg border border-[#ff4444]/20 bg-[#ff4444]/5 p-3">
        <p className="text-xs font-bold text-[#ff4444] mb-2">ADVANCED SCALING TIERS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Beyond Enterprise, unlock ultra-late-game tiers in the <span className="text-neon-cyan">FACILITY</span> panel.
        </p>
        <div className="space-y-1.5">
          {ADVANCED_TIER_CONFIG.map((tier) => (
            <div key={tier.tier} className="text-xs font-mono">
              <strong className="text-foreground">{tier.label}</strong>
              <span className="text-muted-foreground"> &mdash; ${tier.unlockCost.toLocaleString()} unlock. {tier.maxCabinets} max cabinets, {tier.coolingRate}&deg;C/tick cooling, {tier.powerCostMultiplier}x power cost.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-site expansion */}
      <div className="rounded-lg border border-[#00ccff]/20 bg-[#00ccff]/5 p-3">
        <p className="text-xs font-bold text-[#00ccff] mb-2">MULTI-SITE EXPANSION</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Expand beyond a single facility! Open the <span className="text-neon-cyan">WORLD MAP</span> panel to build a global network.
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] font-mono font-bold text-[#00ccff] mb-1">SITE TYPES</p>
            <div className="space-y-1">
              {Object.values(SITE_TYPE_CONFIG).map((st) => (
                <div key={st.type} className="text-xs font-mono">
                  <strong className="text-foreground">{st.label}</strong>
                  <span className="text-muted-foreground"> &mdash; ${st.purchaseCost.toLocaleString()}, {st.constructionTicks} tick build, up to {st.maxCabinets} cabinets.</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-[#00ccff] mb-1">REGIONS</p>
            <p className="text-xs font-mono text-muted-foreground">
              15 global regions with unique profiles &mdash; power costs, labor rates, climate, demand, and disaster risks all vary by location. Research regions before expanding.
            </p>
          </div>
        </div>
      </div>

      {/* Inter-site networking */}
      <div className="rounded-lg border border-[#ff44ff]/20 bg-[#ff44ff]/5 p-3">
        <p className="text-xs font-bold text-[#ff44ff] mb-2">INTER-SITE NETWORKING</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Connect your sites with dedicated network links. Managed in the <span className="text-neon-cyan">WORLD MAP</span> panel.
        </p>
        <div className="space-y-1.5 mb-2">
          {Object.values(INTER_SITE_LINK_CONFIG).map((link) => (
            <div key={link.type} className="text-xs font-mono">
              <strong className="text-foreground">{link.label}</strong>
              <span className="text-muted-foreground"> &mdash; {link.bandwidthGbps} Gbps, {link.baseLatencyMs}ms, ${link.installCost.toLocaleString()} install, ${link.costPerTick}/tick. {Math.round(link.reliability * 100)}% uptime.{link.sameContinentOnly ? ' Same continent only.' : ''}{link.crossContinentOnly ? ' Cross-continent only.' : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-[#ff44ff]/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Edge PoPs</strong> generate <span className="text-neon-green">${EDGE_POP_CDN_REVENUE_PER_GBPS}/Gbps</span> CDN revenue when connected with a backhaul link.
            Max {MAX_LINKS_PER_SITE} links per site.
          </p>
        </div>
      </div>

      {/* Regional incidents & disaster prep */}
      <div className="rounded-lg border border-neon-red/20 bg-neon-red/5 p-3">
        <p className="text-xs font-bold text-neon-red mb-2">REGIONAL INCIDENTS &amp; DISASTER PREP</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Each region faces unique natural disasters. Prepare your sites to mitigate damage and keep operations running.
        </p>
        <div className="space-y-1.5 mb-2">
          {Object.values(DISASTER_PREP_CONFIG).map((prep) => (
            <div key={prep.type} className="text-xs font-mono">
              <strong className="text-foreground">{prep.label}</strong>
              <span className="text-muted-foreground"> &mdash; ${prep.cost.toLocaleString()}, {Math.round(prep.damageReduction * 100)}% damage reduction, ${prep.maintenanceCostPerTick}/tick upkeep.</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-neon-red/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Check each region&rsquo;s disaster profile before expanding. Earthquake-prone areas need seismic reinforcement; coastal regions need flood barriers.
          </p>
        </div>
      </div>

      {/* Demand growth & market trends */}
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3">
        <p className="text-xs font-bold text-neon-green mb-2">DEMAND GROWTH &amp; MARKET TRENDS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Regional demand changes over time. Markets cycle through three phases:
        </p>
        <div className="space-y-1.5">
          <div className="text-xs font-mono">
            <strong className="text-neon-green">&#9650; Emerging</strong>
            <span className="text-muted-foreground"> &mdash; Demand below {Math.round(DEMAND_GROWTH_CONFIG.emergingThreshold * 100)}%. Grows at +{Math.round(DEMAND_GROWTH_CONFIG.emergingGrowthRate * 100)}% every {DEMAND_GROWTH_CONFIG.growthInterval} ticks. Get in early!</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-neon-yellow">&#9679; Stable</strong>
            <span className="text-muted-foreground"> &mdash; Demand between {Math.round(DEMAND_GROWTH_CONFIG.emergingThreshold * 100)}&ndash;{Math.round(DEMAND_GROWTH_CONFIG.saturatedThreshold * 100)}%. Grows slowly at +{Math.round(DEMAND_GROWTH_CONFIG.stableGrowthRate * 100)}%.</span>
          </div>
          <div className="text-xs font-mono">
            <strong className="text-neon-red">&#9660; Saturated</strong>
            <span className="text-muted-foreground"> &mdash; Demand above {Math.round(DEMAND_GROWTH_CONFIG.saturatedThreshold * 100)}%. Decays at {Math.round(DEMAND_GROWTH_CONFIG.saturatedDecayRate * 100)}% &mdash; consider diversifying.</span>
          </div>
        </div>
      </div>

      {/* Data sovereignty */}
      <div className="rounded-lg border border-neon-orange/20 bg-neon-orange/5 p-3">
        <p className="text-xs font-bold text-neon-orange mb-2">DATA SOVEREIGNTY</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Some regions enforce data residency laws. Contracts tied to these regimes pay bonuses when you comply &mdash; or penalties if you don&rsquo;t.
        </p>
        <div className="space-y-1.5">
          {DATA_SOVEREIGNTY_CONFIG.map((rule) => (
            <div key={rule.regime} className="text-xs font-mono">
              <strong className="text-foreground">{rule.label}</strong>
              <span className="text-muted-foreground"> &mdash; {rule.description} <span className="text-neon-green">+{Math.round(rule.revenueBonus * 100)}%</span> bonus, <span className="text-neon-red">{Math.round(rule.nonCompliancePenalty * 100)}%</span> penalty.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-site contracts */}
      <div className="rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-3">
        <p className="text-xs font-bold text-neon-yellow mb-2">GLOBAL CONTRACTS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Land lucrative contracts that require operational sites in multiple regions. Found in the <span className="text-neon-cyan">CONTRACTS</span> panel.
        </p>
        <div className="space-y-1.5">
          {MULTI_SITE_CONTRACT_CATALOG.map((c) => (
            <div key={c.id} className="text-xs font-mono">
              <strong className="text-foreground">{c.company}</strong>
              <span className="text-muted-foreground"> &mdash; ${c.revenuePerTick}/tick for {c.durationTicks}t, ${c.completionBonus.toLocaleString()} bonus. Needs {c.requiredRegions.length} regions.{c.sovereigntyRegime ? ` ${c.sovereigntyRegime.toUpperCase()} required.` : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-neon-yellow/10">
          <p className="text-[10px] font-mono text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Max 3 active global contracts at once. Missing a required region triggers per-tick penalties and can terminate the contract after 20 consecutive violations.
          </p>
        </div>
      </div>

      {/* Staff transfers */}
      <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
        <p className="text-xs font-bold text-neon-cyan mb-2">STAFF TRANSFERS</p>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Move staff between sites to fill skill gaps. Initiate transfers from the <span className="text-neon-cyan">WORLD MAP</span> panel.
        </p>
        <ul className="text-xs font-mono text-muted-foreground space-y-1 list-disc list-inside">
          <li>Base cost: <span className="text-neon-yellow">${STAFF_TRANSFER_CONFIG.baseCost.toLocaleString()}</span> per transfer (scaled by skill level)</li>
          <li>Same continent: <span className="text-neon-green">{STAFF_TRANSFER_CONFIG.sameContinentTicks} ticks</span> travel time</li>
          <li>Cross continent: <span className="text-neon-orange">{STAFF_TRANSFER_CONFIG.crossContinentTicks} ticks</span> travel time</li>
          <li>Max <strong className="text-foreground">3</strong> transfers in transit simultaneously</li>
          <li>Staff are unavailable during transfer &mdash; plan ahead!</li>
        </ul>
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
