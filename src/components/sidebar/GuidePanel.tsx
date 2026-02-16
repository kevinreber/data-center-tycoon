import { Github, Bug, GitPullRequest } from 'lucide-react'
import { useGameStore, ENVIRONMENT_CONFIG, SIM } from '@/stores/gameStore'

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
