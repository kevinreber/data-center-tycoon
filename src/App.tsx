import { GameCanvas } from '@/components/GameCanvas'
import { HUD } from '@/components/HUD'
import { StatusBar } from '@/components/StatusBar'
import { useGameStore } from '@/stores/gameStore'
import { Zap, DollarSign, Thermometer, Activity } from 'lucide-react'

function App() {
  const { totalPower, money, pue, avgHeat, racks } = useGameStore()
  const activeNodes = racks.filter((r) => r.powerStatus).length

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-mono overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-neon-green text-glow-green tracking-wider">
            FABRIC TYCOON
          </h1>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Build servers, design network fabrics, and manage power to scale your data center.
          </span>
          <span className="inline-block w-2 h-4 bg-neon-green animate-blink ml-1" />
        </div>

        {/* Top-bar stats */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3.5 text-neon-yellow" />
            <span className="text-neon-yellow text-glow-orange font-bold">
              ${money.toLocaleString()}
            </span>
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

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-0 p-3 gap-3">
        {/* Phaser canvas */}
        <div className="flex-1 min-h-0">
          <GameCanvas />
        </div>

        {/* HUD controls */}
        <HUD />
      </main>

      {/* Bottom status bar */}
      <StatusBar activeNodes={activeNodes} totalNodes={racks.length} />
    </div>
  )
}

export default App
