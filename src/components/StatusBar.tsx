import { useGameStore, formatGameTime, COOLING_CONFIG, SUITE_TIERS } from '@/stores/gameStore'

interface StatusBarProps {
  activeNodes: number
  totalNodes: number
}

const SPEED_LABELS = ['PAUSED', '1x', '2x', '3x']

export function StatusBar({ activeNodes, totalNodes }: StatusBarProps) {
  const { gameSpeed, tickCount, gameHour, demandMultiplier, spikeActive, coolingType, activeIncidents, loans, suiteTier } = useGameStore()

  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-card text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${
            gameSpeed === 0 ? 'bg-neon-red' : activeIncidents.length > 0 ? 'bg-neon-orange animate-pulse' : 'bg-neon-green animate-pulse-glow'
          }`} />
          {gameSpeed === 0 ? 'PAUSED' : activeIncidents.length > 0 ? `${activeIncidents.length} INCIDENT${activeIncidents.length > 1 ? 'S' : ''}` : 'SYSTEM ONLINE'}
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
        <span style={{ color: SUITE_TIERS[suiteTier].color }}>
          SUITE: {SUITE_TIERS[suiteTier].label.split(' ')[0].toUpperCase()}
        </span>
        <span style={{ color: COOLING_CONFIG[coolingType].color }}>
          COOLING: {COOLING_CONFIG[coolingType].label}
        </span>
        {loans.length > 0 && (
          <span className="text-neon-red">
            DEBT: ${loans.reduce((s, l) => s + l.remaining, 0).toFixed(0)}
          </span>
        )}
        <span className="text-muted-foreground/50">v0.3.0</span>
      </div>
    </footer>
  )
}
