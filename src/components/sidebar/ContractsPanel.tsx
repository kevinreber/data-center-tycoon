import { useGameStore, CONTRACT_TIER_COLORS, ZONE_CONTRACT_REQUIREMENTS, MULTI_SITE_CONTRACT_CATALOG, REGION_CATALOG, MAX_MULTI_SITE_CONTRACTS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Check, Briefcase, Globe } from 'lucide-react'
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
    // Phase 6D — multi-site contracts
    multiSiteUnlocked, multiSiteContracts, multiSiteContractRevenue,
    acceptMultiSiteContract, sites,
  } = useGameStore()

  const operationalSiteRegions = sites.filter((s) => s.operational).map((s) => s.regionId)
  const allPlayerRegions = ['ashburn' as const, ...operationalSiteRegions]
  const activeMultiSite = multiSiteContracts.filter((c) => c.status === 'active')

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
                    {ZONE_CONTRACT_REQUIREMENTS[contract.def.type] && (
                      <p className="text-xs text-neon-cyan">Zone: {ZONE_CONTRACT_REQUIREMENTS[contract.def.type].minSize}+ adjacent {ZONE_CONTRACT_REQUIREMENTS[contract.def.type].key.replace('_', ' ')} cabinets</p>
                    )}
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
                    {ZONE_CONTRACT_REQUIREMENTS[def.type] && (
                      <p className="text-xs text-neon-cyan mt-0.5">Zone: {ZONE_CONTRACT_REQUIREMENTS[def.type].minSize}+ adjacent {ZONE_CONTRACT_REQUIREMENTS[def.type].key.replace('_', ' ')} cabinets</p>
                    )}
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

      {/* Multi-Site Global Contracts */}
      {multiSiteUnlocked && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="size-3 text-neon-cyan" />
            <span className="text-xs font-bold text-neon-cyan">GLOBAL CONTRACTS</span>
            {activeMultiSite.length > 0 && (
              <Badge className="ml-auto bg-cyan-900/20 text-cyan-400 border-cyan-800 font-mono text-[10px]">
                {activeMultiSite.length}/{MAX_MULTI_SITE_CONTRACTS}
              </Badge>
            )}
          </div>
          {/* Active multi-site contracts */}
          {activeMultiSite.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              {activeMultiSite.map((c) => (
                <div key={c.id} className="rounded border border-border/50 bg-card p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neon-cyan">{c.def.company}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{c.ticksRemaining}t</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{c.def.label}</div>
                  <div className="flex items-center gap-2 text-[10px] mt-0.5">
                    <span className="text-neon-green">+${c.def.revenuePerTick}/t</span>
                    <span className="text-muted-foreground">Earned: ${c.totalEarned.toFixed(0)}</span>
                    {c.consecutiveViolations > 0 && (
                      <span className="text-red-400">
                        <AlertTriangle className="size-2.5 inline" /> {c.consecutiveViolations}/20
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-neon-cyan" style={{ width: `${(1 - c.ticksRemaining / c.def.durationTicks) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Available multi-site contracts */}
          {activeMultiSite.length < MAX_MULTI_SITE_CONTRACTS && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground mb-0.5">Available global deals:</span>
              {MULTI_SITE_CONTRACT_CATALOG.filter((def) =>
                !multiSiteContracts.some((c) => c.def.id === def.id && c.status === 'active')
              ).map((def) => {
                const regionsMet = def.requiredRegions.every((r) => allPlayerRegions.includes(r))
                const missingRegions = def.requiredRegions.filter((r) => !allPlayerRegions.includes(r))
                return (
                  <Tooltip key={def.id}>
                    <TooltipTrigger asChild>
                      <div className={`p-1.5 rounded border text-[10px] font-mono ${regionsMet ? 'border-neon-cyan/40 bg-cyan-900/10' : 'border-border bg-card opacity-60'}`}>
                        <div className="flex items-center justify-between">
                          <span className={regionsMet ? 'text-neon-cyan font-bold' : 'text-muted-foreground'}>{def.company}</span>
                          <span className="text-neon-green">+${def.revenuePerTick}/t</span>
                        </div>
                        <div className="text-muted-foreground">{def.label}</div>
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {def.requiredRegions.map((r) => {
                            const met = allPlayerRegions.includes(r)
                            const regionName = REGION_CATALOG.find((reg) => reg.id === r)?.name.split('(')[0].trim() ?? r
                            return (
                              <span key={r} className={`text-[8px] px-1 py-0 rounded border ${met ? 'border-green-800 text-green-400 bg-green-900/10' : 'border-red-800 text-red-400 bg-red-900/10'}`}>
                                {regionName} {met ? '✓' : '✗'}
                              </span>
                            )
                          })}
                          {def.sovereigntyRegime && def.sovereigntyRegime !== 'none' && (
                            <span className="text-[8px] px-1 py-0 rounded border border-blue-800 text-blue-400 bg-blue-900/10">
                              {def.sovereigntyRegime.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {regionsMet && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-1 text-[10px] h-5 text-neon-cyan border-neon-cyan/40"
                            onClick={() => acceptMultiSiteContract(def.id)}
                          >
                            ACCEPT
                          </Button>
                        )}
                        {!regionsMet && missingRegions.length > 0 && (
                          <span className="text-[9px] text-red-400 mt-0.5 block">
                            Need sites in: {missingRegions.map((r) => REGION_CATALOG.find((reg) => reg.id === r)?.name.split('(')[0].trim() ?? r).join(', ')}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-60 font-mono text-xs">
                      <p className="font-bold text-neon-cyan">{def.company}</p>
                      <p className="mt-1">{def.description}</p>
                      <p className="mt-1">Duration: {def.durationTicks}t | Bonus: ${def.completionBonus.toLocaleString()}</p>
                      <p>Penalty: ${def.penaltyPerTick}/t if non-compliant</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          )}
          {multiSiteContractRevenue > 0 && (
            <div className="flex justify-between text-xs mt-2 pt-1 border-t border-border/50">
              <span className="text-muted-foreground">Global Contract Revenue</span>
              <span className="text-neon-green tabular-nums">+${multiSiteContractRevenue.toFixed(0)}/t</span>
            </div>
          )}
        </div>
      )}

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
