import { useGameStore, ACHIEVEMENT_CATALOG, getReputationTier, PRESTIGE_REQUIREMENTS, MAX_PRESTIGE_LEVEL, calcPrestigePoints, canPrestige } from '@/stores/gameStore'
import { Star, RefreshCw, RotateCw, Zap, DollarSign, Thermometer, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProgressPanel() {
  const {
    achievements,
    reputationScore, uptimeTicks, totalOperatingTicks,
    completedContracts, totalRefreshes,
    prestige: prestigeState,
    cabinets, money, suiteTier, sites,
    doPrestige,
  } = useGameStore()

  const tier = getReputationTier(reputationScore)
  const canPrestigeNow = canPrestige({ suiteTier, money, reputationScore, cabinets, prestige: prestigeState })

  const estimatedPoints = calcPrestigePoints({
    cabinets,
    achievements,
    completedContracts,
    money,
    sites,
  })

  const tierOrder = ['starter', 'standard', 'professional', 'enterprise']
  const playerTierIdx = tierOrder.indexOf(suiteTier)
  const requiredTierIdx = tierOrder.indexOf(PRESTIGE_REQUIREMENTS.minSuiteTier)

  return (
    <div className="flex flex-col gap-4">
      {/* Prestige / New Game+ */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <RotateCw className="size-3 text-neon-purple" />
          <span className="text-xs font-bold text-neon-purple">PRESTIGE</span>
          {prestigeState.level > 0 && (
            <span className="ml-auto text-xs font-bold text-neon-purple tabular-nums">
              Lv.{prestigeState.level}
            </span>
          )}
        </div>

        {prestigeState.level > 0 ? (
          <div className="flex flex-col gap-1 mb-2">
            <div className="text-center mb-1">
              <p className="text-2xl font-bold text-neon-purple tabular-nums">
                {prestigeState.totalPrestigePoints.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">LIFETIME PRESTIGE POINTS</p>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-neon-purple transition-all"
                style={{ width: `${(prestigeState.level / MAX_PRESTIGE_LEVEL) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Level {prestigeState.level} / {MAX_PRESTIGE_LEVEL}
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground">ACTIVE BONUSES</span>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="size-2.5" />Revenue
                </span>
                <span className="text-neon-green tabular-nums">+{Math.round(prestigeState.bonuses.revenueMultiplier * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="size-2.5" />Power Cost
                </span>
                <span className="text-neon-green tabular-nums">-{Math.round(prestigeState.bonuses.powerCostReduction * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Thermometer className="size-2.5" />Cooling
                </span>
                <span className="text-neon-green tabular-nums">+{Math.round(prestigeState.bonuses.coolingEfficiency * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="size-2.5" />Start Money
                </span>
                <span className="text-neon-green tabular-nums">+${prestigeState.bonuses.startingMoneyBonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Award className="size-2.5" />Start Rep
                </span>
                <span className="text-neon-green tabular-nums">+{prestigeState.bonuses.reputationStartBonus}</span>
              </div>
            </div>
            {prestigeState.totalRunsCompleted > 0 && (
              <div className="mt-1 pt-1 border-t border-border/50 flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-muted-foreground">STATS</span>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Runs Completed</span>
                  <span className="tabular-nums">{prestigeState.totalRunsCompleted}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Best Run Length</span>
                  <span className="tabular-nums">{prestigeState.highestTickReached} ticks</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-2">
            Reach Enterprise tier with $500K+, 75+ reputation, and 30+ cabinets to prestige. Restart with permanent bonuses!
          </p>
        )}

        {prestigeState.level < MAX_PRESTIGE_LEVEL && (
          <div className="flex flex-col gap-1.5">
            {/* Requirements checklist */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground">
                {canPrestigeNow ? 'READY TO PRESTIGE' : 'REQUIREMENTS'}
              </span>
              <div className={`text-[10px] ${playerTierIdx >= requiredTierIdx ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {playerTierIdx >= requiredTierIdx ? '✓' : '○'} Enterprise suite tier
              </div>
              <div className={`text-[10px] ${money >= PRESTIGE_REQUIREMENTS.minMoney ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {money >= PRESTIGE_REQUIREMENTS.minMoney ? '✓' : '○'} ${PRESTIGE_REQUIREMENTS.minMoney.toLocaleString()}+ cash ({money >= PRESTIGE_REQUIREMENTS.minMoney ? 'met' : `$${Math.round(money).toLocaleString()}`})
              </div>
              <div className={`text-[10px] ${reputationScore >= PRESTIGE_REQUIREMENTS.minReputation ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {reputationScore >= PRESTIGE_REQUIREMENTS.minReputation ? '✓' : '○'} {PRESTIGE_REQUIREMENTS.minReputation}+ reputation ({reputationScore >= PRESTIGE_REQUIREMENTS.minReputation ? 'met' : `${Math.round(reputationScore)}`})
              </div>
              <div className={`text-[10px] ${cabinets.length >= PRESTIGE_REQUIREMENTS.minCabinets ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {cabinets.length >= PRESTIGE_REQUIREMENTS.minCabinets ? '✓' : '○'} {PRESTIGE_REQUIREMENTS.minCabinets}+ cabinets ({cabinets.length >= PRESTIGE_REQUIREMENTS.minCabinets ? 'met' : `${cabinets.length}`})
              </div>
            </div>
            {canPrestigeNow && (
              <div className="text-xs text-muted-foreground">
                Points earned: <span className="text-neon-purple font-bold tabular-nums">{estimatedPoints.toLocaleString()}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="xs"
              className={`text-[10px] gap-1 ${canPrestigeNow ? 'text-neon-purple border-neon-purple/50 hover:bg-neon-purple/10' : 'opacity-50'}`}
              disabled={!canPrestigeNow}
              onClick={() => {
                if (confirm(`Prestige to level ${prestigeState.level + 1}? This will reset your game but grant permanent bonuses. You'll earn ${estimatedPoints.toLocaleString()} prestige points.`)) {
                  doPrestige()
                }
              }}
            >
              <RotateCw className="size-3" />
              Prestige to Lv.{prestigeState.level + 1}
            </Button>
          </div>
        )}
        {prestigeState.level >= MAX_PRESTIGE_LEVEL && (
          <p className="text-xs text-neon-purple font-bold text-center">
            Maximum prestige reached! All bonuses active.
          </p>
        )}
      </div>

      {/* Reputation */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Star className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow">REPUTATION</span>
        </div>
        <div className="text-center mb-2">
          <p className="text-3xl font-bold tabular-nums" style={{ color: tier.color }}>
            {Math.round(reputationScore)}
          </p>
          <p className="text-xs font-bold tracking-wider" style={{ color: tier.color }}>
            {tier.label.toUpperCase()}
          </p>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${reputationScore}%`, backgroundColor: tier.color }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Contract Bonus</span>
            <span className={`tabular-nums ${tier.contractBonus >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {tier.contractBonus >= 0 ? '+' : ''}{Math.round(tier.contractBonus * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Uptime</span>
            <span className="text-foreground tabular-nums">
              {totalOperatingTicks > 0 ? Math.round((uptimeTicks / totalOperatingTicks) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Contracts Done</span>
            <span className="text-neon-green tabular-nums">{completedContracts}</span>
          </div>
          {totalRefreshes > 0 && (
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <RefreshCw className="size-3" />HW Refreshes
              </span>
              <span className="text-neon-cyan tabular-nums">{totalRefreshes}</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {reputationScore < 25 && 'Only bronze contracts available. Keep SLAs met to improve.'}
            {reputationScore >= 25 && reputationScore < 50 && 'Silver contracts unlocked. Maintain uptime for gold.'}
            {reputationScore >= 50 && reputationScore < 75 && 'Gold contracts unlocked. Push for Excellent status.'}
            {reputationScore >= 75 && 'Premium reputation. Maximum contract bonuses active.'}
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-neon-yellow">ACHIEVEMENTS</span>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {achievements.length}/{ACHIEVEMENT_CATALOG.length}
          </span>
        </div>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {ACHIEVEMENT_CATALOG.map((def) => {
            const unlocked = achievements.find((a) => a.def.id === def.id)
            return (
              <div
                key={def.id}
                className={`flex items-center gap-2 text-xs rounded px-1.5 py-0.5 ${
                  unlocked ? 'text-neon-yellow' : 'text-muted-foreground/40'
                }`}
              >
                <span className="text-sm">{unlocked ? def.icon : '🔒'}</span>
                <div className="flex-1 min-w-0">
                  <span className={`font-bold ${unlocked ? '' : 'line-through'}`}>{def.label}</span>
                  {unlocked && <span className="text-muted-foreground ml-1.5 text-[10px]">— {def.description}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
