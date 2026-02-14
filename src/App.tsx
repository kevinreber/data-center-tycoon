import { GameCanvas } from '@/components/GameCanvas'
import { HUD } from '@/components/HUD'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-mono">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Fabric Tycoon: Data Center Simulator
      </h1>
      <GameCanvas />
      <HUD />
    </div>
  )
}

export default App
