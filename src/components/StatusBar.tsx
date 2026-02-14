import { useGameStore, formatGameTime } from '@/stores/gameStore'

interface StatusBarProps {
  activeNodes: number
  totalNodes: number
}

const SPEED_LABELS = ['PAUSED', '1x', '2x', '3x']

export function StatusBar({ activeNodes, totalNodes }: StatusBarProps) {
  const { gameSpeed, tickCount, gameHour, demandMultiplier, spikeActive } = useGameStore()

  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-card text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${
            gameSpeed === 0 ? 'bg-neon-red' : 'bg-neon-green animate-pulse-glow'
          }`} />
          {gameSpeed === 0 ? 'PAUSED' : 'SYSTEM ONLINE'}
        </span>
        <span>
          NODES: {activeNodes}/{totalNodes}
        </span>
        <span className="tabular-nums">
          TICK: {tickCount.toLocaleString()}
        </span>
        <span className="tabular-nums">
          TIME: {formatGameTime(gameHour)}
        </span>
        <span className={`tabular-nums ${
          spikeActive ? 'text-neon-red animate-pulse' : demandMultiplier > 1.0 ? 'text-neon-yellow' : ''
        }`}>
          DEMAND: {Math.round(demandMultiplier * 100)}%{spikeActive ? ' SPIKE' : ''}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>SPEED: {SPEED_LABELS[gameSpeed]}</span>
        <span>TIER: SOLAR</span>
        <span>COOLING: AIR</span>
        <span className="text-muted-foreground/50">v0.2.0</span>
      </div>
    </footer>
  )
}
