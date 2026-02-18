import { useGameStore, SUITE_TIERS, SUITE_TIER_ORDER, getSuiteLimits, SCENARIO_CATALOG, AISLE_CONTAINMENT_CONFIG, ADVANCED_TIER_CONFIG } from '@/stores/gameStore'
import type { AdvancedTier, ViewMode } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, Lock, Target, Check, Clock, Shield, Atom, Eye } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function FacilityPanel() {
  const {
    cabinets, spineSwitches, money, suiteTier, upgradeSuite,
    aisleContainments, installAisleContainment,
    activeScenario, scenarioProgress, scenariosCompleted,
    startScenario, abandonScenario,
    sandboxMode,
    advancedTier, unlockAdvancedTier,
    viewMode, setViewMode,
  } = useGameStore()

  const suiteLimits = getSuiteLimits(suiteTier)
  const suiteConfig = SUITE_TIERS[suiteTier]
  const currentTierIdx = SUITE_TIER_ORDER.indexOf(suiteTier)
  const nextTier = currentTierIdx < SUITE_TIER_ORDER.length - 1 ? SUITE_TIER_ORDER[currentTierIdx + 1] : null
  const nextSuiteConfig = nextTier ? SUITE_TIERS[nextTier] : null

  return (
    <div className="flex flex-col gap-4">
      {/* Current facility */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building className="size-3" style={{ color: suiteConfig.color }} />
          <span className="text-xs font-bold" style={{ color: suiteConfig.color }}>
            {suiteConfig.label.toUpperCase()}
          </span>
          <Badge
            className="ml-auto font-mono text-xs border"
            style={{
              backgroundColor: `${suiteConfig.color}20`,
              color: suiteConfig.color,
              borderColor: `${suiteConfig.color}40`,
            }}
          >
            {suiteConfig.label.split(' ')[0].toUpperCase()}
          </Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cabinets</span>
            <span className="text-foreground tabular-nums">{cabinets.length}/{suiteLimits.maxCabinets}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Spines</span>
            <span className="text-foreground tabular-nums">{spineSwitches.length}/{suiteLimits.maxSpines}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Layout</span>
            <span className="text-foreground tabular-nums">{suiteLimits.rows} rows &times; {suiteLimits.cols} slots</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Aisles</span>
            <span className="text-foreground tabular-nums">{SUITE_TIERS[suiteTier].layout.aisles.length}</span>
          </div>

          {/* Suite progression */}
          {nextSuiteConfig && nextTier && (
            <>
              <div className="border-t border-border my-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => upgradeSuite(nextTier)}
                    disabled={money < nextSuiteConfig.upgradeCost}
                    className="justify-between font-mono text-xs transition-all"
                    style={{ borderColor: `${nextSuiteConfig.color}33` }}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Building className="size-3" />
                      {nextSuiteConfig.label}
                    </span>
                    <span className="text-muted-foreground">${nextSuiteConfig.upgradeCost.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-60">
                  <p className="font-bold" style={{ color: nextSuiteConfig.color }}>{nextSuiteConfig.label}</p>
                  <p className="text-xs mt-1">{nextSuiteConfig.description}</p>
                  <p className="text-xs mt-1">Grid: {nextSuiteConfig.cols}&times;{nextSuiteConfig.rows} ({nextSuiteConfig.maxCabinets} cabinets, {nextSuiteConfig.maxSpines} spines)</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {/* Remaining tiers */}
          {SUITE_TIER_ORDER.slice(currentTierIdx + 2).length > 0 && (
            <div className="flex flex-col gap-0.5 mt-0.5">
              {SUITE_TIER_ORDER.slice(currentTierIdx + 2).map((tier) => {
                const cfg = SUITE_TIERS[tier]
                return (
                  <div key={tier} className="flex items-center justify-between text-xs text-muted-foreground/40">
                    <span className="flex items-center gap-1"><Lock className="size-3" />{cfg.label}</span>
                    <span className="tabular-nums">${cfg.upgradeCost.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          )}
          {!nextTier && (
            <p className="text-xs italic mt-1" style={{ color: `${suiteConfig.color}80` }}>Maximum facility tier reached.</p>
          )}
        </div>
      </div>

      {/* Aisle Containment */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">AISLE CONTAINMENT</span>
        </div>
        {(() => {
          const layout = SUITE_TIERS[suiteTier].layout
          const minTierIdx = SUITE_TIER_ORDER.indexOf(AISLE_CONTAINMENT_CONFIG.minSuiteTier)
          const currentTierIdxC = SUITE_TIER_ORDER.indexOf(suiteTier)
          const isLocked = currentTierIdxC < minTierIdx

          if (isLocked) {
            return (
              <div className="text-xs text-muted-foreground/50 flex items-center gap-1">
                <Lock className="size-3" />
                Requires {SUITE_TIERS[AISLE_CONTAINMENT_CONFIG.minSuiteTier].label}
              </div>
            )
          }

          if (layout.aisles.length === 0) {
            return <p className="text-xs text-muted-foreground/50">No aisles in current layout</p>
          }

          return (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] text-muted-foreground">{AISLE_CONTAINMENT_CONFIG.description}</p>
              <div className="text-[10px] text-muted-foreground/70 mb-1">
                {AISLE_CONTAINMENT_CONFIG.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-neon-green">+</span> {b}
                  </div>
                ))}
              </div>
              {layout.aisles.map((aisle) => {
                const installed = aisleContainments.includes(aisle.id)
                const aisleColor = aisle.type === 'cold' ? '#00aaff' : aisle.type === 'hot' ? '#ff6644' : '#888888'
                const typeLabel = aisle.type === 'cold' ? 'Cold' : aisle.type === 'hot' ? 'Hot' : 'Neutral'
                const canAfford = sandboxMode || money >= AISLE_CONTAINMENT_CONFIG.cost
                return (
                  <div key={aisle.id} className="flex items-center justify-between">
                    <span className="text-xs font-mono" style={{ color: aisleColor }}>
                      {typeLabel} Aisle {aisle.id + 1}
                    </span>
                    {installed ? (
                      <Badge className="text-[9px] font-mono border" style={{ backgroundColor: `${aisleColor}20`, color: aisleColor, borderColor: `${aisleColor}40` }}>
                        CONTAINED
                      </Badge>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => installAisleContainment(aisle.id)}
                            disabled={!canAfford}
                            className="font-mono text-[10px]"
                            style={{ borderColor: `${aisleColor}33` }}
                          >
                            Install ${AISLE_CONTAINMENT_CONFIG.cost.toLocaleString()}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Install containment on this {typeLabel.toLowerCase()} aisle</p>
                          <p className="text-xs text-muted-foreground mt-1">+{Math.round(AISLE_CONTAINMENT_CONFIG.coolingBonusPerAisle * 100)}% cooling efficiency</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Scenarios */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Target className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow">SCENARIOS</span>
          <Badge variant="outline" className="text-[10px] ml-auto">{scenariosCompleted.length}/{SCENARIO_CATALOG.length}</Badge>
        </div>
        {activeScenario ? (
          <div className="space-y-1">
            <div className="text-xs font-bold text-foreground">{activeScenario.label}</div>
            <div className="text-[10px] text-muted-foreground">{activeScenario.description}</div>
            {activeScenario.objectives.map((obj) => (
              <div key={obj.id} className={`flex items-center gap-1 text-[10px] ${scenarioProgress[obj.id] ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {scenarioProgress[obj.id] ? <Check className="size-2.5" /> : <Clock className="size-2.5" />}
                {obj.description}
              </div>
            ))}
            <Button variant="ghost" size="xs" className="text-[10px] text-neon-red" onClick={() => abandonScenario()}>Abandon</Button>
          </div>
        ) : (
          <div className="space-y-1">
            {SCENARIO_CATALOG.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={scenariosCompleted.includes(s.id) ? 'text-neon-green' : 'text-muted-foreground'}>{s.label}</span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{s.description}</TooltipContent>
                </Tooltip>
                {scenariosCompleted.includes(s.id) ? (
                  <Check className="size-3 text-neon-green" />
                ) : (
                  <Button variant="ghost" size="xs" className="text-[9px] text-neon-yellow px-1" onClick={() => startScenario(s.id)}>Start</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Mode */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">View Mode</span>
        </div>
        <div className="flex gap-1">
          {(['cabinet', 'above_cabinet', 'sub_floor'] as ViewMode[]).map((mode) => (
            <Button key={mode} variant={viewMode === mode ? 'default' : 'outline'} size="xs"
              className={`text-[9px] flex-1 ${viewMode === mode ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40' : ''}`}
              onClick={() => setViewMode(mode)}>
              {mode === 'cabinet' ? 'Normal' : mode === 'above_cabinet' ? 'Top-Down' : 'Sub-Floor'}
            </Button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Sub-floor view shows cooling pipes, power conduits, and cable routing.</p>
      </div>

      {/* Advanced Scaling Tiers */}
      {suiteTier === 'enterprise' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Atom className="size-3 text-neon-green" />
            <span className="text-xs font-bold text-neon-green">ADVANCED POWER</span>
            {advancedTier && (
              <Badge className="ml-auto font-mono text-xs border bg-neon-green/20 text-neon-green border-neon-green/30">
                {advancedTier.toUpperCase()}
              </Badge>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">Sci-fi power tiers unlock expanded capacity and zero-carbon energy.</p>
          <div className="flex flex-col gap-1">
            {ADVANCED_TIER_CONFIG.map((config) => {
              const locked = config.tier === 'fusion' && advancedTier !== 'nuclear'
              const active = advancedTier === config.tier
              return (
                <Tooltip key={config.tier}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="xs" className={`text-[9px] w-full justify-start ${active ? 'border-neon-green/50 text-neon-green' : ''}`}
                      disabled={active || locked || (!sandboxMode && money < config.unlockCost)}>
                      <Atom className="size-2.5 mr-1" />
                      <span onClick={() => { if (!active && !locked) unlockAdvancedTier(config.tier as AdvancedTier) }}>
                        {config.label} — ${(config.unlockCost / 1000).toFixed(0)}k
                      </span>
                      {active && <span className="ml-auto text-neon-green">ACTIVE</span>}
                      {locked && <Lock className="size-2.5 ml-auto text-muted-foreground" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {config.description}
                    {locked ? ' (Requires Nuclear first)' : ''}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
