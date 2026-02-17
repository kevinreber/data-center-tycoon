import { useGameStore, DRILL_CONFIG, OPS_TIER_CONFIG } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, Target } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function IncidentsPanel() {
  const {
    money, sandboxMode,
    activeIncidents, resolveIncident,
    drillCooldown, lastDrillResult, drillsCompleted, drillsPassed, runDrill,
    opsTier,
  } = useGameStore()

  const opsConfig = OPS_TIER_CONFIG.find((c) => c.id === opsTier)
  const costReduction = opsConfig?.benefits.resolveCostReduction ?? 0

  return (
    <div className="flex flex-col gap-4">
      {/* Active Incidents */}
      <div>
        {activeIncidents.length > 0 && (
          <Badge className="mb-2 bg-neon-red/20 text-neon-red border-neon-red/30 animate-pulse font-mono text-xs">
            {activeIncidents.length} ACTIVE
          </Badge>
        )}
        {activeIncidents.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No active incidents. Stay vigilant.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`rounded border p-2 ${
                  inc.def.severity === 'critical'
                    ? 'border-neon-red/40 bg-neon-red/10'
                    : inc.def.severity === 'major'
                      ? 'border-neon-orange/40 bg-neon-orange/10'
                      : 'border-neon-yellow/40 bg-neon-yellow/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${
                    inc.def.severity === 'critical' ? 'text-neon-red' :
                    inc.def.severity === 'major' ? 'text-neon-orange' : 'text-neon-yellow'
                  }`}>
                    {inc.def.label}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    inc.def.severity === 'critical' ? 'text-neon-red/70' :
                    inc.def.severity === 'major' ? 'text-neon-orange/70' : 'text-neon-yellow/70'
                  }`}>
                    {inc.def.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">{inc.def.description}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveIncident(inc.id)}
                      disabled={money < Math.round(inc.def.resolveCost * (1 - costReduction))}
                      className="w-full justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green"
                    >
                      <span className="flex items-center gap-1.5"><Wrench className="size-3" />Resolve</span>
                      <span className="text-muted-foreground">
                        {costReduction > 0 ? (
                          <><s className="text-muted-foreground/50">${inc.def.resolveCost.toLocaleString()}</s> ${Math.round(inc.def.resolveCost * (1 - costReduction)).toLocaleString()}</>
                        ) : (
                          <>${inc.def.resolveCost.toLocaleString()}</>
                        )}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Pay to immediately resolve
                    {costReduction > 0 && <><br /><span className="text-neon-green">Ops discount: -{Math.round(costReduction * 100)}%</span></>}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DR Drills */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Target className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">DR DRILLS</span>
          <Badge variant="outline" className="text-[10px] ml-auto">{drillsPassed}/{drillsCompleted}</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs mb-2"
          disabled={drillCooldown > 0 || (!sandboxMode && money < DRILL_CONFIG.cost)}
          onClick={() => runDrill()}
        >
          {drillCooldown > 0 ? `Cooldown: ${drillCooldown}t` : `Run Drill ($${DRILL_CONFIG.cost})`}
        </Button>
        {lastDrillResult && (
          <div className={`text-[10px] space-y-0.5 ${lastDrillResult.passed ? 'text-neon-green' : 'text-neon-red'}`}>
            <div className="font-bold">{lastDrillResult.passed ? 'PASSED' : 'FAILED'} — Score: {lastDrillResult.score}%</div>
            {lastDrillResult.findings.slice(0, 3).map((f, i) => (
              <div key={i} className="text-muted-foreground">• {f}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
