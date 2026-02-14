import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Network, Power, Cpu } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const RACK_COST: Record<string, number> = {
  server: 2000,
  leaf_switch: 5000,
  spine_switch: 12000,
}

export function HUD() {
  const { racks, totalPower, money, addRack, togglePower } = useGameStore()
  const [showGuide, setShowGuide] = useState(true)

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3">
        {showGuide && (
          <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3 glow-green">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neon-green tracking-widest">HOW TO PLAY</span>
              <Button
                variant="ghost"
                size="xs"
                className="font-mono text-xs text-muted-foreground hover:text-neon-green"
                onClick={() => setShowGuide(false)}
              >
                Dismiss
              </Button>
            </div>
            <ol className="text-xs font-mono text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>
                <strong className="text-foreground">Build your data center</strong>
                {' '}&mdash; Use the BUILD panel to deploy servers and network switches.
              </li>
              <li>
                <strong className="text-foreground">Design a network fabric</strong>
                {' '}&mdash; Add <span className="text-neon-green">Servers</span> to handle
                compute, <span className="text-neon-cyan">Leaf Switches</span> to connect
                them, and <span className="text-neon-orange">Spine Switches</span> to link
                leaves together.
              </li>
              <li>
                <strong className="text-foreground">Manage power</strong>
                {' '}&mdash; Each node draws power. Click a node badge in NODES to toggle
                its power on/off.
              </li>
              <li>
                <strong className="text-foreground">Watch your floor</strong>
                {' '}&mdash; The isometric view above shows your deployed nodes. Keep an
                eye on power and heat as you scale up.
              </li>
            </ol>
          </div>
        )}

        <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
          {/* BUILD panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">BUILD</span>
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRack('server')}
                    disabled={money < RACK_COST.server}
                    className="justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Server className="size-3" />
                      Server
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.server.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Compute node &mdash; handles workloads (450W)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRack('leaf_switch')}
                    disabled={money < RACK_COST.leaf_switch}
                    className="justify-between font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Network className="size-3" />
                      Leaf Switch
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.leaf_switch.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Connects servers to the network fabric (150W)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRack('spine_switch')}
                    disabled={money < RACK_COST.spine_switch}
                    className="justify-between font-mono text-xs border-neon-orange/20 hover:border-neon-orange/50 hover:bg-neon-orange/10 hover:text-neon-orange transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Network className="size-3" />
                      Spine Switch
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.spine_switch.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Backbone switch &mdash; links leaf switches together (250W)
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* POWER panel */}
          <div className="rounded-lg border border-border bg-card p-3 w-44 glow-green flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Power className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">POWER</span>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-green text-glow-green tabular-nums">
                {totalPower.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">WATTS</p>
            </div>
            <div className="w-full mt-3 pt-2 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nodes</span>
                <span className="text-foreground">{racks.length}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Active</span>
                <span className="text-neon-green">{racks.filter((r) => r.powerStatus).length}</span>
              </div>
            </div>
          </div>

          {/* NODES panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-3">
              <Server className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">NODES</span>
              {racks.length > 0 && (
                <span className="text-xs text-muted-foreground ml-auto">{racks.length} deployed</span>
              )}
            </div>
            {racks.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No nodes deployed yet. Use BUILD to add equipment.</p>
            ) : (
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto">
                {racks.map((r) => {
                  const label =
                    r.type === 'server' ? 'SRV' : r.type === 'leaf_switch' ? 'LEAF' : 'SPINE'
                  const colorClass =
                    r.type === 'server'
                      ? 'bg-neon-green/20 text-neon-green border-neon-green/30 hover:bg-neon-green/30'
                      : r.type === 'leaf_switch'
                        ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/30'
                        : 'bg-neon-orange/20 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/30'
                  const offClass = 'bg-muted text-muted-foreground border-border hover:bg-muted/80'

                  return (
                    <Tooltip key={r.id}>
                      <TooltipTrigger asChild>
                        <Badge
                          className={`cursor-pointer font-mono text-xs border transition-all ${r.powerStatus ? colorClass : offClass}`}
                          onClick={() => togglePower(r.id)}
                        >
                          {label}
                          {!r.powerStatus && ' OFF'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Click to toggle power {r.powerStatus ? 'off' : 'on'}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {!showGuide && (
          <Button
            variant="link"
            size="sm"
            className="font-mono text-xs self-start text-muted-foreground hover:text-neon-green"
            onClick={() => setShowGuide(true)}
          >
            Show instructions
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}
