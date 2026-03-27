import { useGameStore, POWER_DRAW, TRAFFIC } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { X, Power, Network, Zap, ArrowUpDown, Activity } from 'lucide-react'

function StatRow({ icon: Icon, label, value, color, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color?: string
  sub?: string
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="font-mono tabular-nums" style={color ? { color } : undefined}>
        {value}
        {sub && <span className="text-muted-foreground ml-1 text-[10px]">{sub}</span>}
      </span>
    </div>
  )
}

export function SpineDetailPanel() {
  const selectedSpineId = useGameStore((s) => s.selectedSpineId)
  const spineSwitches = useGameStore((s) => s.spineSwitches)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const cabinets = useGameStore((s) => s.cabinets)
  const selectSpine = useGameStore((s) => s.selectSpine)
  const toggleSpinePower = useGameStore((s) => s.toggleSpinePower)

  if (!selectedSpineId) return null

  const spine = spineSwitches.find((s) => s.id === selectedSpineId)
  if (!spine) return null

  const spineIndex = spineSwitches.indexOf(spine)
  const powerW = spine.powerStatus ? POWER_DRAW.spine_switch : 0

  // Traffic stats for this spine
  const spineLinks = trafficStats.links.filter((l) => l.spineId === spine.id)
  const totalBandwidth = spineLinks.reduce((sum, l) => sum + l.bandwidthGbps, 0)
  const totalCapacity = spineLinks.reduce((sum, l) => sum + l.capacityGbps, 0)
  const utilization = trafficStats.spineUtilization[spine.id] ?? 0

  // Connected leaf count
  const connectedLeafs = new Set(spineLinks.map((l) => l.leafCabinetId)).size
  const totalLeafs = cabinets.filter((c) => c.hasLeafSwitch && c.powerStatus).length

  const utilizationColor = utilization > 0.8 ? '#ff4444' : utilization > 0.5 ? '#ffaa00' : '#00ff88'

  return (
    <TooltipProvider>
      <div className="absolute bottom-1.5 right-1.5 left-1.5 md:left-auto md:bottom-3 md:right-3 w-auto md:w-72 z-30 rounded-lg border border-neon-orange/30 bg-card/95 backdrop-blur-sm shadow-lg max-h-[60vh] md:max-h-none overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Network className="size-3.5 text-neon-orange" />
            <span className="text-xs font-bold text-neon-orange tracking-widest">
              SPINE {spineIndex + 1}
            </span>
            <Badge
              className="text-[9px] px-1.5 py-0 h-4 border"
              style={{
                backgroundColor: spine.powerStatus ? '#ff664420' : '#ff444420',
                color: spine.powerStatus ? '#ff6644' : '#ff4444',
                borderColor: spine.powerStatus ? '#ff664440' : '#ff444440',
              }}
            >
              {spine.powerStatus ? 'ONLINE' : 'OFFLINE'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => selectSpine(null)}
            className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="p-3 flex flex-col gap-3">
          {/* Stats */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Status</div>

            <StatRow
              icon={Power}
              label="Power"
              value={spine.powerStatus ? `${powerW}W` : 'OFF'}
              color={spine.powerStatus ? '#00ff88' : '#ff4444'}
            />

            <StatRow
              icon={ArrowUpDown}
              label="Bandwidth"
              value={`${totalBandwidth.toFixed(1)} / ${totalCapacity.toFixed(0)} Gbps`}
              color="#00aaff"
            />

            <StatRow
              icon={Activity}
              label="Utilization"
              value={`${Math.round(utilization * 100)}%`}
              color={utilizationColor}
            />

            <StatRow
              icon={Network}
              label="Connected Leafs"
              value={`${connectedLeafs} / ${totalLeafs}`}
              color="#00aaff"
            />

            <StatRow
              icon={Zap}
              label="Link Capacity"
              value={`${TRAFFIC.linkCapacityGbps} Gbps/link`}
            />
          </div>

          {/* Connected cabinets list */}
          {spineLinks.length > 0 && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Traffic Links</div>
              <div className="flex flex-col gap-0.5 rounded border border-border/50 bg-black/20 p-2 max-h-32 overflow-y-auto">
                {spineLinks.map((link) => {
                  const linkUtil = link.capacityGbps > 0 ? link.bandwidthGbps / link.capacityGbps : 0
                  const linkColor = linkUtil > 0.8 ? '#ff4444' : linkUtil > 0.5 ? '#ffaa00' : '#00ff88'
                  return (
                    <div key={link.leafCabinetId} className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">
                        {link.leafCabinetId.replace('cab-', 'Cab #')}
                      </span>
                      <span style={{ color: linkColor }}>
                        {link.bandwidthGbps.toFixed(1)}/{link.capacityGbps.toFixed(0)} Gbps
                        {link.redirected && <span className="text-yellow-400 ml-1">(R)</span>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSpinePower(spine.id)}
                  className={`flex-1 h-7 text-[10px] gap-1.5 ${
                    spine.powerStatus
                      ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                      : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'
                  }`}
                >
                  <Power className="size-3" />
                  {spine.powerStatus ? 'Power Off' : 'Power On'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {spine.powerStatus
                  ? 'Shut down this spine switch — traffic will redistribute to remaining spines'
                  : 'Power on this spine switch to add backbone capacity'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
