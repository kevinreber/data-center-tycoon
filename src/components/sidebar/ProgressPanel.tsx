import { useGameStore, ACHIEVEMENT_CATALOG, getReputationTier } from '@/stores/gameStore'
import { Star, RefreshCw } from 'lucide-react'

export function ProgressPanel() {
  const {
    achievements,
    reputationScore, uptimeTicks, totalOperatingTicks,
    completedContracts, totalRefreshes,
  } = useGameStore()

  const tier = getReputationTier(reputationScore)

  return (
    <div className="flex flex-col gap-4">
      {/* Reputation */}
      <div>
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
