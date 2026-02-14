import { GameCanvas } from '@/components/GameCanvas'
import { HUD } from '@/components/HUD'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-mono">
      <h1 className="text-2xl font-bold mb-1 text-primary">
        Fabric Tycoon: Data Center Simulator
      </h1>
      <p className="text-xs text-muted-foreground font-mono mb-4">
        Build servers, design network fabrics, and manage power to scale your data center.
      </p>
      <GameCanvas />
      <HUD />
    </div>
  )
}

export default App
