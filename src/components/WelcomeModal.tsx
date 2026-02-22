import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Server, Zap, Thermometer, DollarSign } from 'lucide-react'

export function WelcomeModal() {
  const showWelcomeModal = useGameStore((s) => s.showWelcomeModal)
  const startTutorial = useGameStore((s) => s.startTutorial)
  const skipTutorial = useGameStore((s) => s.skipTutorial)

  if (!showWelcomeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-xl border border-neon-green/30 bg-card p-6 shadow-2xl glow-green">
        {/* Title */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold tracking-wider text-neon-green font-mono">
            FABRIC TYCOON
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Data Center Simulator
          </p>
        </div>

        {/* Intro */}
        <p className="text-sm font-mono text-muted-foreground mb-4 text-center">
          Build and manage your own data center empire. Place cabinets, install servers,
          design a network fabric, and scale from a single rack to a global operation.
        </p>

        {/* Goals */}
        <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3 mb-4">
          <p className="text-xs font-bold text-neon-cyan mb-2 font-mono">YOUR MISSION</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <DollarSign className="size-3.5 text-neon-yellow shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-muted-foreground">
                <strong className="text-foreground">Maximize revenue</strong> — deploy servers that earn money every tick
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Thermometer className="size-3.5 text-neon-red shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-muted-foreground">
                <strong className="text-foreground">Manage heat</strong> — keep temperatures under control or face throttling and fires
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="size-3.5 text-neon-orange shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-muted-foreground">
                <strong className="text-foreground">Balance power</strong> — every server draws electricity that costs money
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Server className="size-3.5 text-neon-green shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-muted-foreground">
                <strong className="text-foreground">Scale smart</strong> — grow from starter suite to enterprise-grade facility
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial prompt */}
        <p className="text-xs font-mono text-center text-muted-foreground mb-4">
          Would you like a guided walkthrough to learn the basics?
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={startTutorial}
            className="bg-neon-green/20 border border-neon-green/40 text-neon-green hover:bg-neon-green/30 font-mono text-sm px-6"
          >
            Start Tutorial
          </Button>
          <Button
            variant="ghost"
            onClick={skipTutorial}
            className="text-muted-foreground hover:text-foreground font-mono text-sm"
          >
            Skip Tutorial
          </Button>
        </div>
      </div>
    </div>
  )
}
