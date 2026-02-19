import { useState } from 'react'
import { useGameStore, SCENARIO_CATALOG } from '@/stores/gameStore'
import type { ScenarioDef } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Play, Star, Lock, Trophy, X, AlertTriangle, Target, CheckCircle } from 'lucide-react'

// Star rating based on completion speed relative to a baseline
function getStars(scenarioId: string, bestTicks: number | undefined): number {
  if (!bestTicks) return 0
  // Each scenario has a rough "par" tick count for 3-star rating
  const parTicks: Record<string, number> = {
    disaster_recovery: 300,
    green_facility: 250,
    black_friday: 200,
    budget_build: 400,
    speed_run: 350,
  }
  const par = parTicks[scenarioId] ?? 300
  if (bestTicks <= par) return 3
  if (bestTicks <= par * 1.5) return 2
  return 1
}

// Scenarios unlock sequentially: each requires the previous one to be completed
function isUnlocked(index: number, completedIds: string[]): boolean {
  if (index === 0) return true
  const prevId = SCENARIO_CATALOG[index - 1]?.id
  return prevId ? completedIds.includes(prevId) : true
}

function ScenarioCard({ scenario, index, isCompleted, isActive, bestTicks, locked, onStart }: {
  scenario: ScenarioDef
  index: number
  isCompleted: boolean
  isActive: boolean
  bestTicks: number | undefined
  locked: boolean
  onStart: () => void
}) {
  const stars = getStars(scenario.id, bestTicks)

  return (
    <div className={`border rounded-md p-3 font-mono text-xs transition-all ${
      isActive ? 'border-neon-green/60 bg-neon-green/5 ring-1 ring-neon-green/20' :
      locked ? 'border-border/30 bg-card/20 opacity-50' :
      isCompleted ? 'border-neon-green/30 bg-neon-green/5' :
      'border-border bg-card/50 hover:border-neon-green/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {locked ? (
            <Lock size={12} className="text-muted-foreground" />
          ) : isCompleted ? (
            <Trophy size={12} className="text-neon-green" />
          ) : (
            <Target size={12} className="text-neon-orange" />
          )}
          <span className="font-bold text-foreground">{scenario.label}</span>
        </div>
        <span className="text-[9px] text-muted-foreground">#{index + 1}</span>
      </div>

      {/* Description */}
      <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
        {locked ? 'Complete the previous scenario to unlock.' : scenario.description}
      </p>

      {/* Star rating (if completed) */}
      {isCompleted && (
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3].map(s => (
            <Star key={s} size={12} className={s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
          ))}
          {bestTicks && (
            <span className="text-[9px] text-muted-foreground ml-2">Best: {bestTicks} ticks</span>
          )}
        </div>
      )}

      {/* Objectives preview (if not locked) */}
      {!locked && (
        <div className="space-y-0.5 mb-2">
          {scenario.objectives.map(obj => (
            <div key={obj.id} className="flex items-center gap-1 text-[9px]">
              <CheckCircle size={8} className={isCompleted ? 'text-neon-green' : 'text-muted-foreground/40'} />
              <span className="text-muted-foreground">{obj.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Special rules */}
      {!locked && scenario.specialRules.length > 0 && (
        <div className="space-y-0.5 mb-2">
          {scenario.specialRules.map((rule, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px]">
              <AlertTriangle size={8} className="text-yellow-500/60" />
              <span className="text-yellow-500/60">{rule}</span>
            </div>
          ))}
        </div>
      )}

      {/* Starting money */}
      {!locked && (
        <div className="text-[9px] text-muted-foreground mb-2">
          Starting funds: ${scenario.startingMoney.toLocaleString()}
        </div>
      )}

      {/* Action button */}
      <div className="flex gap-2">
        {isActive ? (
          <span className="text-[9px] text-neon-green font-bold py-1">IN PROGRESS...</span>
        ) : locked ? null : (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-[10px] border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            onClick={onStart}
          >
            <Play size={10} className="mr-1" />
            {isCompleted ? 'Replay' : 'Start'}
          </Button>
        )}
      </div>
    </div>
  )
}

export function ScenarioPanel() {
  const activeScenario = useGameStore(s => s.activeScenario)
  const scenariosCompleted = useGameStore(s => s.scenariosCompleted)
  const scenarioBestTicks = useGameStore(s => s.scenarioBestTicks)
  const scenarioProgress = useGameStore(s => s.scenarioProgress)
  const startScenario = useGameStore(s => s.startScenario)
  const abandonScenario = useGameStore(s => s.abandonScenario)
  const tickCount = useGameStore(s => s.tickCount)
  const scenarioStartTick = useGameStore(s => s.scenarioStartTick)
  const [confirmAbandon, setConfirmAbandon] = useState(false)

  // Active scenario progress view
  if (activeScenario) {
    const elapsed = tickCount - scenarioStartTick
    const completedCount = Object.values(scenarioProgress).filter(Boolean).length
    const totalCount = activeScenario.objectives.length
    const allComplete = completedCount === totalCount

    return (
      <div className="space-y-3">
        {/* Active scenario header */}
        <div className="border border-neon-green/40 rounded-md p-3 bg-neon-green/5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-neon-green text-xs">{activeScenario.label}</span>
            <span className="text-[9px] text-muted-foreground">{elapsed} ticks</span>
          </div>
          <p className="text-[9px] text-muted-foreground mb-2">{activeScenario.description}</p>

          {/* Objectives with progress */}
          <div className="space-y-1.5 mb-3">
            {activeScenario.objectives.map(obj => {
              const done = scenarioProgress[obj.id]
              return (
                <div key={obj.id} className={`flex items-center gap-1.5 text-[10px] ${done ? 'text-neon-green' : 'text-muted-foreground'}`}>
                  {done ? <CheckCircle size={10} className="text-neon-green" /> : <Target size={10} className="text-muted-foreground/50" />}
                  <span>{obj.description}</span>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-black/40 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-neon-green/80 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>

          {/* Victory screen */}
          {allComplete && (
            <div className="border border-neon-green/40 rounded p-2 mb-2 bg-neon-green/10 text-center">
              <Trophy size={16} className="text-neon-green mx-auto mb-1" />
              <div className="text-xs font-bold text-neon-green">SCENARIO COMPLETE!</div>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3].map(s => (
                  <Star key={s} size={14} className={s <= getStars(activeScenario.id, elapsed) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
                ))}
              </div>
              <div className="text-[9px] text-muted-foreground mt-1">Completed in {elapsed} ticks</div>
            </div>
          )}

          {/* Abandon */}
          {!allComplete && (
            confirmAbandon ? (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-red-400">Are you sure?</span>
                <Button size="sm" variant="outline" className="h-5 text-[9px] border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => { abandonScenario(); setConfirmAbandon(false) }}>
                  Yes, abandon
                </Button>
                <Button size="sm" variant="outline" className="h-5 text-[9px]" onClick={() => setConfirmAbandon(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="h-6 text-[10px] border-red-500/20 text-red-400/70 hover:bg-red-500/10" onClick={() => setConfirmAbandon(true)}>
                <X size={10} className="mr-1" /> Abandon Scenario
              </Button>
            )
          )}
        </div>
      </div>
    )
  }

  // Scenario selection view
  const totalStars = SCENARIO_CATALOG.reduce((sum, s) => sum + getStars(s.id, scenarioBestTicks[s.id]), 0)
  const maxStars = SCENARIO_CATALOG.length * 3

  return (
    <div className="space-y-3">
      {/* Header stats */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-muted-foreground">{totalStars}/{maxStars} stars</span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          {scenariosCompleted.length}/{SCENARIO_CATALOG.length} completed
        </span>
      </div>

      {/* Scenario cards */}
      <div className="space-y-2">
        {SCENARIO_CATALOG.map((scenario, index) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={index}
            isCompleted={scenariosCompleted.includes(scenario.id)}
            isActive={false}
            bestTicks={scenarioBestTicks[scenario.id]}
            locked={!isUnlocked(index, scenariosCompleted)}
            onStart={() => startScenario(scenario.id)}
          />
        ))}
      </div>
    </div>
  )
}
