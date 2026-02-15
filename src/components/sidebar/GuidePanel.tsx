import { useGameStore, ENVIRONMENT_CONFIG, SIM } from '@/stores/gameStore'

export function GuidePanel() {
  const money = useGameStore((s) => s.money)
  const cabinets = useGameStore((s) => s.cabinets)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3 glow-green">
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

      <div className="text-xs text-muted-foreground space-y-1.5 font-mono">
        <p className="text-neon-green font-bold">Quick Stats</p>
        <p>Balance: <span className="text-neon-yellow">${Math.floor(money).toLocaleString()}</span></p>
        <p>Cabinets: <span className="text-foreground">{cabinets.length}</span></p>
      </div>
    </div>
  )
}
