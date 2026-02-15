import { useGameStore, COMPETITOR_PERSONALITIES } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Swords, ShieldAlert, DollarSign } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function MarketPanel() {
  const {
    competitors, competitorBids, playerMarketShare,
    competitorContractsWon, competitorContractsLost,
    competitorOutperformTicks,
    priceWarActive, priceWarTicksRemaining,
    poachTarget, counterPoachOffer, money,
    staff, reputationScore,
  } = useGameStore()

  const poachStaff = staff.find((s) => s.id === poachTarget)

  return (
    <div className="flex flex-col gap-4">
      {/* Market Share */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">MARKET SHARE</span>
        </div>
        <div className="text-center mb-3">
          <p className="text-3xl font-bold text-neon-cyan text-glow-cyan tabular-nums">
            {playerMarketShare}%
          </p>
          <p className="text-xs text-muted-foreground">YOUR SHARE</p>
        </div>

        {/* Market share bar */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-card border border-border flex mb-2">
          <div
            className="h-full transition-all"
            style={{ width: `${playerMarketShare}%`, backgroundColor: '#00aaff' }}
          />
          {competitors.map((comp) => {
            const personality = COMPETITOR_PERSONALITIES[comp.personality]
            return (
              <div
                key={comp.id}
                className="h-full transition-all"
                style={{ width: `${comp.marketShare}%`, backgroundColor: personality.color }}
              />
            )
          })}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-cyan" />
              <span className="text-neon-cyan">You</span>
            </span>
            <span className="text-foreground tabular-nums">{playerMarketShare}%</span>
          </div>
          {competitors.map((comp) => {
            const personality = COMPETITOR_PERSONALITIES[comp.personality]
            return (
              <div key={comp.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: personality.color }} />
                  <span style={{ color: personality.color }}>{comp.name}</span>
                </span>
                <span className="text-foreground tabular-nums">{comp.marketShare}%</span>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between text-xs mt-2">
          <span className="text-muted-foreground">Outperform Streak</span>
          <span className="text-neon-green tabular-nums">{competitorOutperformTicks}t</span>
        </div>
      </div>

      {/* Active Events */}
      {(priceWarActive || poachTarget) && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="size-3 text-neon-red" />
            <span className="text-xs font-bold text-neon-red">ACTIVE EVENTS</span>
          </div>
          {priceWarActive && (
            <div className="rounded border border-neon-orange/40 bg-neon-orange/10 p-2 mb-2 animate-pulse">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neon-orange">PRICE WAR</span>
                <span className="text-xs text-neon-orange tabular-nums">{priceWarTicksRemaining}t</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Contract revenue reduced by 15%</p>
            </div>
          )}
          {poachTarget && poachStaff && (
            <div className="rounded border border-neon-red/40 bg-neon-red/10 p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neon-red">POACH ATTEMPT</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {poachStaff.name} ({poachStaff.role}) is being recruited by a competitor!
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={counterPoachOffer}
                    disabled={money < poachStaff.salaryPerTick * 40}
                    className="w-full font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                  >
                    <DollarSign className="size-3 mr-1" />
                    Counter-Offer ${(poachStaff.salaryPerTick * 40).toLocaleString()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  Pay a retention bonus to keep your staff member. If you don&apos;t counter, they leave after 15 ticks.
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      )}

      {/* Competitors */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">COMPETITORS</span>
          <Badge className="ml-auto bg-neon-orange/20 text-neon-orange border-neon-orange/30 font-mono text-xs">
            {competitors.length}
          </Badge>
        </div>
        {competitors.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No competitors yet. They appear as you grow.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {competitors.map((comp) => {
              const personality = COMPETITOR_PERSONALITIES[comp.personality]
              return (
                <Tooltip key={comp.id}>
                  <TooltipTrigger asChild>
                    <div className="rounded border border-border/50 p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: personality.color }}>
                          {comp.name}
                        </span>
                        <Badge
                          className="text-xs border"
                          style={{
                            backgroundColor: `${personality.color}20`,
                            color: personality.color,
                            borderColor: `${personality.color}40`,
                          }}
                        >
                          {personality.label}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Strength</span>
                          <span className="text-foreground tabular-nums">{Math.round(comp.strength)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reputation</span>
                          <span className="text-foreground tabular-nums">{Math.round(comp.reputationScore)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Focus</span>
                          <span className="text-foreground capitalize">{comp.specialization.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    {personality.description}
                    <br />Security: {comp.securityTier}
                    <br />Tech Level: {comp.techLevel}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
      </div>

      {/* Active Bids */}
      {competitorBids.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="size-3 text-neon-yellow" />
            <span className="text-xs font-bold text-neon-yellow">COMPETING BIDS</span>
          </div>
          <div className="flex flex-col gap-1">
            {competitorBids.map((bid, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded border border-neon-yellow/20 bg-neon-yellow/5">
                <div>
                  <span className="text-neon-yellow">{bid.competitorName}</span>
                  <span className="text-muted-foreground ml-1">→ {bid.contractType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground tabular-nums">{bid.ticksRemaining}t</span>
                  <span className={`tabular-nums ${bid.winChance > 0.5 ? 'text-neon-red' : 'text-neon-green'}`}>
                    {Math.round(bid.winChance * 100)}%
                  </span>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground italic mt-1">Accept contracts before competitors win them!</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-3 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground">COMPETITION STATS</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Contracts Won vs AI</span>
            <span className="text-neon-green tabular-nums">{competitorContractsWon}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Contracts Lost to AI</span>
            <span className="text-neon-red tabular-nums">{competitorContractsLost}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Your Reputation</span>
            <span className="text-neon-cyan tabular-nums">{Math.round(reputationScore)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
