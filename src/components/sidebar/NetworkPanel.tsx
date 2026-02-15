import { useGameStore, formatGameTime } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Clock, Zap, ArrowRightLeft, AlertTriangle, Network, Map } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function NetworkPanel() {
  const {
    trafficStats,
    gameHour, demandMultiplier, spikeActive,
    networkTopology,
    heatMapVisible, toggleHeatMap,
  } = useGameStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Time & Demand */}
      <div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              Time
            </span>
            <span className="text-foreground tabular-nums font-bold">{formatGameTime(gameHour)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-muted-foreground cursor-help">
                  <Zap className="size-3" />
                  Demand
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                Traffic demand follows a 24h cycle: low overnight, peak in the evening.
              </TooltipContent>
            </Tooltip>
            <span className={`tabular-nums font-bold ${
              demandMultiplier > 1.2 ? 'text-neon-red' : demandMultiplier > 0.8 ? 'text-neon-yellow' : 'text-neon-green'
            }`}>
              {Math.round(demandMultiplier * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round(demandMultiplier / 1.5 * 100))}%`,
                backgroundColor: demandMultiplier > 1.2 ? '#ff4444' : demandMultiplier > 0.8 ? '#ffaa00' : '#00ff88',
              }}
            />
          </div>
          {spikeActive && (
            <p className="text-xs text-neon-red font-bold animate-pulse flex items-center gap-1">
              <AlertTriangle className="size-3" />
              TRAFFIC SPIKE
            </p>
          )}
        </div>
      </div>

      {/* Traffic Stats */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Network className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">TRAFFIC</span>
        </div>
        {trafficStats.totalFlows === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No traffic flows. Add leaf &amp; spine switches to see traffic.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Flows</span>
              <span className="text-neon-cyan tabular-nums">{trafficStats.totalFlows}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Bandwidth</span>
              <span className="text-neon-green tabular-nums">{trafficStats.totalBandwidthGbps} Gbps</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Capacity</span>
              <span className="text-foreground tabular-nums">{trafficStats.totalCapacityGbps} Gbps</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Utilization</span>
              <span className={`tabular-nums ${
                trafficStats.totalCapacityGbps > 0 && trafficStats.totalBandwidthGbps / trafficStats.totalCapacityGbps > 0.8
                  ? 'text-neon-red'
                  : trafficStats.totalCapacityGbps > 0 && trafficStats.totalBandwidthGbps / trafficStats.totalCapacityGbps > 0.5
                    ? 'text-neon-yellow'
                    : 'text-neon-green'
              }`}>
                {trafficStats.totalCapacityGbps > 0
                  ? Math.round((trafficStats.totalBandwidthGbps / trafficStats.totalCapacityGbps) * 100)
                  : 0}%
              </span>
            </div>
            {trafficStats.redirectedFlows > 0 && (
              <>
                <div className="border-t border-neon-orange/30 my-0.5" />
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-neon-orange">
                    <ArrowRightLeft className="size-3" />
                    Redirected
                  </span>
                  <span className="text-neon-orange tabular-nums animate-pulse">
                    {trafficStats.redirectedFlows}
                  </span>
                </div>
                <p className="text-xs text-neon-orange/80 font-bold animate-pulse">
                  SPINE DOWN &mdash; TRAFFIC REROUTED
                </p>
              </>
            )}
            {Object.keys(trafficStats.spineUtilization).length > 0 && (
              <>
                <div className="border-t border-border my-0.5" />
                <span className="text-xs text-muted-foreground">Per-Spine Load</span>
                {Object.entries(trafficStats.spineUtilization).map(([spineId, util]) => (
                  <div key={spineId} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground truncate flex-1">
                      {spineId.replace('spine-', 'S')}
                    </span>
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round(util * 100)}%`,
                          backgroundColor: util > 0.8 ? '#ff4444' : util > 0.5 ? '#ffaa00' : '#00ff88',
                        }}
                      />
                    </div>
                    <span className={`tabular-nums w-8 text-right ${
                      util > 0.8 ? 'text-neon-red' : util > 0.5 ? 'text-neon-yellow' : 'text-neon-green'
                    }`}>
                      {Math.round(util * 100)}%
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Network Topology */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Network className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">TOPOLOGY</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Total Links</span><span>{networkTopology.totalLinks}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Healthy</span><span className="text-neon-green">{networkTopology.healthyLinks}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Oversub Ratio</span><span>{networkTopology.oversubscriptionRatio}:1</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Avg Utilization</span><span className={networkTopology.avgUtilization > 0.8 ? 'text-neon-red' : 'text-neon-green'}>{(networkTopology.avgUtilization * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Redundancy</span><span>{(networkTopology.redundancyLevel * 100).toFixed(0)}%</span></div>
        </div>
        <Button
          variant="outline"
          size="xs"
          className={`w-full text-[10px] mt-2 ${heatMapVisible ? 'text-neon-red' : ''}`}
          onClick={() => toggleHeatMap()}
        >
          <Map className="size-2.5 mr-1" />{heatMapVisible ? 'Hide Heat Map' : 'Show Heat Map'}
        </Button>
      </div>
    </div>
  )
}
