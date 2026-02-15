import { useGameStore, CONTRACT_TIER_COLORS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Check, Briefcase } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ContractsPanel() {
  const {
    cabinets,
    contractOffers, activeContracts, acceptContract, contractRevenue, contractPenalties, completedContracts,
    rfpOffers, rfpsWon, bidOnRFP,
  } = useGameStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Active contracts */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {activeContracts.length > 0 && (
            <Badge className="ml-auto bg-neon-purple/20 text-neon-purple border-neon-purple/30 font-mono text-xs">
              {activeContracts.length} ACTIVE
            </Badge>
          )}
        </div>
        {activeContracts.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-3 pb-3 border-b border-border/50">
            {activeContracts.map((contract) => {
              const tierColor = CONTRACT_TIER_COLORS[contract.def.tier]
              const isViolating = contract.consecutiveViolations > 0
              return (
                <Tooltip key={contract.id}>
                  <TooltipTrigger asChild>
                    <div className={`rounded border p-1.5 cursor-help ${
                      isViolating ? 'border-neon-red/40 bg-neon-red/5' : 'border-border/50 bg-card'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate" style={{ color: tierColor }}>
                          {contract.def.company}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">{contract.ticksRemaining}t</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-neon-green tabular-nums">+${contract.def.revenuePerTick}/t</span>
                        {isViolating && (
                          <span className="text-xs text-neon-red animate-pulse flex items-center gap-0.5">
                            <AlertTriangle className="size-2.5" />
                            SLA {contract.consecutiveViolations}/{contract.def.terminationTicks}
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round((1 - contract.ticksRemaining / contract.def.durationTicks) * 100)}%`,
                            backgroundColor: isViolating ? '#ff4444' : tierColor,
                          }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-60">
                    <p className="font-bold" style={{ color: tierColor }}>{contract.def.company} ({contract.def.tier.toUpperCase()})</p>
                    <p className="text-xs mt-1">{contract.def.description}</p>
                    <p className="text-xs mt-1">Requires: {contract.def.minServers} servers, &lt;{contract.def.maxTemp}°C</p>
                    <p className="text-xs">Earned: ${contract.totalEarned.toFixed(0)} | Penalties: ${contract.totalPenalties.toFixed(0)}</p>
                    <p className="text-xs">Completion bonus: ${contract.def.completionBonus.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
        {/* Contract offers */}
        {contractOffers.length > 0 ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground mb-0.5">Available:</span>
            {contractOffers.map((def, i) => {
              const tierColor = CONTRACT_TIER_COLORS[def.tier]
              const activeProductionServers = cabinets
                .filter((c) => c.environment === 'production' && c.powerStatus)
                .reduce((sum, c) => sum + c.serverCount, 0)
              const canAccept = activeContracts.length < 3 && activeProductionServers >= def.minServers
              return (
                <Tooltip key={`${def.type}-${i}`}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptContract(i)}
                      disabled={activeContracts.length >= 3}
                      className="justify-between font-mono text-xs transition-all w-full"
                      style={{ borderColor: `${tierColor}33` }}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tierColor }} />
                        {def.company}
                      </span>
                      <span className="text-neon-green shrink-0">+${def.revenuePerTick}/t</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-60">
                    <p className="font-bold" style={{ color: tierColor }}>{def.company} ({def.tier.toUpperCase()})</p>
                    <p className="text-xs mt-1">{def.description}</p>
                    <p className="text-xs mt-1">Requires: {def.minServers} prod servers, &lt;{def.maxTemp}°C</p>
                    <p className="text-xs">Duration: {def.durationTicks}t | Bonus: ${def.completionBonus.toLocaleString()}</p>
                    {!canAccept && activeContracts.length < 3 && (
                      <p className="text-xs text-neon-red mt-1">Need {def.minServers} online prod servers (have {activeProductionServers})</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {cabinets.length < 2 ? 'Build at least 2 cabinets to attract tenants.' : 'New offers coming soon...'}
          </p>
        )}
        {activeContracts.length >= 3 && <p className="text-xs text-neon-purple/60 italic mt-1">Max 3 active contracts</p>}
        {completedContracts > 0 && (
          <div className="flex justify-between text-xs mt-2 pt-1.5 border-t border-border/50">
            <span className="flex items-center gap-1 text-muted-foreground"><Check className="size-3" />Completed</span>
            <span className="text-neon-green tabular-nums">{completedContracts}</span>
          </div>
        )}
      </div>

      {/* RFP Bidding */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">RFP BIDS</span>
          <Badge variant="outline" className="text-[10px] ml-auto">Won: {rfpsWon}</Badge>
        </div>
        {rfpOffers.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic">No active RFPs. New ones appear periodically.</p>
        ) : (
          <div className="space-y-2">
            {rfpOffers.map((rfp) => (
              <div key={rfp.id} className="border border-border/50 rounded p-1.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-foreground font-bold">{rfp.def.company}</span>
                  <span className="text-neon-red">{rfp.bidWindowTicks}t left</span>
                </div>
                <div className="text-[9px] text-muted-foreground">vs {rfp.competitorName} (str: {rfp.competitorStrength})</div>
                <div className="text-[9px] text-neon-green">+${rfp.def.revenuePerTick}/t for {rfp.def.durationTicks}t</div>
                <Button variant="outline" size="xs" className="w-full text-[10px]" onClick={() => bidOnRFP(rfp.id)}>
                  Place Bid
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue summary */}
      {(contractRevenue > 0 || contractPenalties > 0) && (
        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Contract Revenue</span>
            <span className="text-neon-green tabular-nums">+${contractRevenue.toFixed(0)}/t</span>
          </div>
          {contractPenalties > 0 && (
            <div className="flex justify-between text-xs mt-0.5">
              <span className="text-neon-red">SLA Penalties</span>
              <span className="text-neon-red tabular-nums">-${contractPenalties.toFixed(0)}/t</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
