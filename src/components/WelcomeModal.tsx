import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Server, Zap, Thermometer, DollarSign, Network, TrendingUp } from 'lucide-react'

export function WelcomeModal() {
  const showWelcomeModal = useGameStore((s) => s.showWelcomeModal)
  const startTutorial = useGameStore((s) => s.startTutorial)
  const skipTutorial = useGameStore((s) => s.skipTutorial)

  if (!showWelcomeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-xl border border-neon-green/30 bg-card p-6 shadow-2xl glow-green">
        {/* Title */}
        <div className="mb-3 text-center">
          <h1 className="text-2xl font-bold tracking-wider text-neon-green font-mono">
            FABRIC TYCOON
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Data Center Simulator
          </p>
        </div>

        {/* Story intro */}
        <div className="rounded-lg border border-neon-green/10 bg-neon-green/5 p-3 mb-3">
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            You've just signed the lease on an empty data center suite. Your first customer is
            waiting for compute power. With <strong className="text-neon-yellow">$50,000</strong> in
            the bank, it's time to build your infrastructure, go live, and start earning revenue.
          </p>
        </div>

        {/* What you'll manage */}
        <div className="rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3 mb-3">
          <p className="text-xs font-bold text-neon-cyan mb-2 font-mono">YOUR JOB</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start gap-1.5">
              <Server className="size-3 text-neon-green shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Build racks</strong> with servers that earn money
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <Network className="size-3 text-neon-cyan shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Wire the network</strong> so customers can connect
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <Thermometer className="size-3 text-neon-red shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Manage heat</strong> before servers throttle or catch fire
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <Zap className="size-3 text-neon-orange shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Balance power</strong> as electricity eats into profits
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <DollarSign className="size-3 text-neon-yellow shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Land contracts</strong> for bonus revenue from clients
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <TrendingUp className="size-3 text-neon-green shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-muted-foreground">
                <strong className="text-foreground">Scale globally</strong> from one rack to a world empire
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial prompt */}
        <p className="text-xs font-mono text-center text-muted-foreground mb-4">
          New here? The tutorial will walk you through building your first rack,
          going live, and reading your dashboard — step by step.
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
            I know what I'm doing
          </Button>
        </div>
      </div>
    </div>
  )
}
