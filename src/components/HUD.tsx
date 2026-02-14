import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function HUD() {
  const { racks, totalPower, addRack, togglePower } = useGameStore()
  const [showGuide, setShowGuide] = useState(true)

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 mt-4">
        {showGuide && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono flex items-center justify-between">
                <span>HOW TO PLAY</span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="font-mono text-xs text-muted-foreground"
                  onClick={() => setShowGuide(false)}
                >
                  Dismiss
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-xs font-mono text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>
                  <strong className="text-foreground">Build your data center</strong>
                  {' '}&mdash; Use the BUILD panel to deploy servers and network switches.
                </li>
                <li>
                  <strong className="text-foreground">Design a network fabric</strong>
                  {' '}&mdash; Add <span className="text-green-500">Servers</span> to handle
                  compute, <span className="text-blue-500">Leaf Switches</span> to connect
                  them, and <span className="text-orange-500">Spine Switches</span> to link
                  leaves together.
                </li>
                <li>
                  <strong className="text-foreground">Manage power</strong>
                  {' '}&mdash; Each node draws 450W. Click a node badge in NODES to toggle
                  its power on/off.
                </li>
                <li>
                  <strong className="text-foreground">Watch your floor</strong>
                  {' '}&mdash; The isometric view above shows your deployed nodes. Keep an
                  eye on power and heat as you scale up.
                </li>
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono">BUILD</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRack('server')}
                    className="font-mono text-xs"
                  >
                    + Server
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
                    className="font-mono text-xs"
                  >
                    + Leaf Switch
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Connects servers to the network fabric (450W)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRack('spine_switch')}
                    className="font-mono text-xs"
                  >
                    + Spine Switch
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Backbone switch &mdash; links leaf switches together (450W)
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card className="w-48">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono">POWER</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold">{totalPower}W</p>
              <p className="text-xs text-muted-foreground font-mono">
                {racks.length} nodes deployed
              </p>
            </CardContent>
          </Card>

          {racks.length > 0 && (
            <Card className="flex-1 max-w-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">NODES</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 flex-wrap max-h-24 overflow-y-auto">
                {racks.map((r) => (
                  <Tooltip key={r.id}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={r.powerStatus ? 'default' : 'secondary'}
                        className="cursor-pointer font-mono text-xs"
                        onClick={() => togglePower(r.id)}
                      >
                        {r.type === 'server'
                          ? 'SRV'
                          : r.type === 'leaf_switch'
                            ? 'LEAF'
                            : 'SPINE'}
                        {r.powerStatus ? '' : ' OFF'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Click to toggle power {r.powerStatus ? 'off' : 'on'}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {!showGuide && (
          <Button
            variant="link"
            size="sm"
            className="font-mono text-xs self-start text-muted-foreground"
            onClick={() => setShowGuide(true)}
          >
            Show instructions
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}
