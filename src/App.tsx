import { useEffect, useRef } from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { Sidebar } from '@/components/Sidebar'
import { LayersPopup } from '@/components/LayersPopup'
import { CabinetDetailPanel } from '@/components/CabinetDetailPanel'
import { StatusBar } from '@/components/StatusBar'
import { useGameStore } from '@/stores/gameStore'
import type { GameSpeed } from '@/stores/gameStore'
import { Zap, DollarSign, Thermometer, Activity, Pause, Play, FastForward, Trophy, X, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const SPEED_LABELS: Record<GameSpeed, string> = {
  0: 'PAUSED',
  1: '1x',
  2: '2x',
  3: '3x',
}

const TICK_INTERVALS: Record<GameSpeed, number> = {
  0: 0,
  1: 1000,
  2: 500,
  3: 250,
}

function App() {
  const {
    totalPower, money, pue, avgHeat, cabinets, spineSwitches,
    gameSpeed, setGameSpeed, tick, revenue, expenses,
    newAchievement, dismissAchievement, loanPayments,
    powerOutage, outageTicksRemaining, fireActive, suppressionType,
  } = useGameStore()
  const totalNodes = cabinets.length + spineSwitches.length
  const activeNodes = cabinets.filter((c) => c.powerStatus).length + spineSwitches.filter((s) => s.powerStatus).length
  const netIncome = revenue - expenses - loanPayments
  const tickRef = useRef(tick)
  tickRef.current = tick

  // Game tick loop
  useEffect(() => {
    if (gameSpeed === 0) return
    const interval = setInterval(() => tickRef.current(), TICK_INTERVALS[gameSpeed])
    return () => clearInterval(interval)
  }, [gameSpeed])

  // Escape key exits placement mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const state = useGameStore.getState()
        if (state.placementMode) {
          state.exitPlacementMode()
        } else if (state.selectedCabinetId) {
          state.selectCabinet(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const cycleSpeed = () => {
    const next = ((gameSpeed + 1) % 4) as GameSpeed
    setGameSpeed(next)
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background text-foreground font-mono overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-neon-green text-glow-green tracking-wider">
              FABRIC TYCOON
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Build cabinets, design network fabrics, and manage power to scale your data center.
            </span>
            <span className="inline-block w-2 h-4 bg-neon-green animate-blink ml-1" />
          </div>

          {/* Top-bar stats */}
          <div className="flex items-center gap-5 text-xs">
            {/* Game speed control */}
            <div className="flex items-center gap-1.5 border-r border-border pr-4 mr-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={cycleSpeed}
                    className={`font-mono text-xs px-2 gap-1.5 ${
                      gameSpeed === 0
                        ? 'text-neon-red'
                        : 'text-neon-green'
                    }`}
                  >
                    {gameSpeed === 0 ? (
                      <Pause className="size-3" />
                    ) : gameSpeed >= 2 ? (
                      <FastForward className="size-3" />
                    ) : (
                      <Play className="size-3" />
                    )}
                    {SPEED_LABELS[gameSpeed]}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Click to cycle: Pause → 1x → 2x → 3x
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-neon-yellow" />
              <span className="text-neon-yellow text-glow-orange font-bold">
                ${Math.floor(money).toLocaleString()}
              </span>
              {(revenue > 0 || expenses > 0) && (
                <span className={`text-xs ${netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                  {netIncome >= 0 ? '+' : ''}{netIncome.toFixed(0)}/t
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-neon-green" />
              <span className="text-neon-green">
                {totalPower.toLocaleString()}W
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="size-3.5 text-neon-orange" />
              <span className={avgHeat > 60 ? 'text-neon-red text-glow-red' : 'text-neon-orange'}>
                {avgHeat}°C
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-neon-cyan" />
              <span className="text-neon-cyan">
                PUE {pue || '—'}
              </span>
            </div>
          </div>
        </header>

        {/* Main content area: sidebar + canvas */}
        <main className="flex-1 flex min-h-0">
          {/* Left sidebar */}
          <Sidebar />

          {/* Canvas area */}
          <div className="flex-1 min-h-0 flex flex-col p-3 gap-2">
            {/* Alert banners */}
            {powerOutage && (
              <div className="rounded-lg border border-neon-red/40 bg-neon-red/10 p-2 flex items-center gap-2 animate-pulse shrink-0">
                <Zap className="size-4 text-neon-red" />
                <span className="text-xs font-bold text-neon-red tracking-widest">GRID POWER OUTAGE</span>
                <span className="text-xs text-neon-red tabular-nums ml-auto">{outageTicksRemaining}t remaining</span>
              </div>
            )}
            {fireActive && (
              <div className="rounded-lg border border-neon-orange/40 bg-neon-orange/10 p-2 flex items-center gap-2 animate-pulse shrink-0">
                <Flame className="size-4 text-neon-orange" />
                <span className="text-xs font-bold text-neon-orange tracking-widest">FIRE IN PROGRESS</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Suppression: {suppressionType === 'none' ? 'None' : suppressionType === 'water_suppression' ? 'Water' : 'Gas'}
                </span>
              </div>
            )}

            {/* Phaser canvas */}
            <div className="flex-1 min-h-0 relative">
              <GameCanvas />
              <LayersPopup />
              <CabinetDetailPanel />
            </div>
          </div>
        </main>

        {/* Bottom status bar */}
        <StatusBar activeNodes={activeNodes} totalNodes={totalNodes} />

        {/* Achievement toast */}
        {newAchievement && (
          <div className="fixed bottom-16 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="rounded-lg border border-neon-yellow/40 bg-card p-3 shadow-lg glow-green flex items-center gap-3 min-w-64">
              <span className="text-2xl">{newAchievement.def.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Trophy className="size-3 text-neon-yellow" />
                  <span className="text-xs font-bold text-neon-yellow tracking-wider">ACHIEVEMENT UNLOCKED</span>
                </div>
                <p className="text-sm font-bold text-foreground">{newAchievement.def.label}</p>
                <p className="text-xs text-muted-foreground">{newAchievement.def.description}</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => dismissAchievement()}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default App
