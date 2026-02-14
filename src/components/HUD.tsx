import { useState } from 'react'
import { useGameStore, DEFAULT_COLORS, RACK_COST, MAX_SERVERS_PER_CABINET, MAX_CABINETS, MAX_SPINES, SIM } from '@/stores/gameStore'
import type { NodeType, LayerColors } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Network, Power, Cpu, Eye, SlidersHorizontal, EyeOff, RotateCcw, HardDrive, Plus, TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, AlertTriangle, Radio } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const LAYER_DEFS: { type: NodeType; label: string; colorClass: string; glowClass: string; neonVar: string }[] = [
  { type: 'server', label: 'Servers', colorClass: 'neon-green', glowClass: 'text-neon-green', neonVar: '#00ff88' },
  { type: 'leaf_switch', label: 'Leaf Switches', colorClass: 'neon-cyan', glowClass: 'text-neon-cyan', neonVar: '#00aaff' },
  { type: 'spine_switch', label: 'Spine Switches', colorClass: 'neon-orange', glowClass: 'text-neon-orange', neonVar: '#ff6644' },
]

/** Convert hex number (0xRRGGBB) to CSS hex string (#RRGGBB) */
function hexToStr(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`
}

/** Convert CSS hex string (#RRGGBB) to hex number */
function strToHex(str: string): number {
  return parseInt(str.replace('#', ''), 16)
}

/** Derive side/front shades from a top color by darkening */
function deriveColors(topHex: number): LayerColors {
  const r = (topHex >> 16) & 0xff
  const g = (topHex >> 8) & 0xff
  const b = topHex & 0xff
  const side = ((Math.round(r * 0.8) << 16) | (Math.round(g * 0.8) << 8) | Math.round(b * 0.8))
  const front = ((Math.round(r * 0.6) << 16) | (Math.round(g * 0.6) << 8) | Math.round(b * 0.6))
  return { top: topHex, side, front }
}

export function HUD() {
  const {
    cabinets, spineSwitches, totalPower, coolingPower, money,
    layerVisibility, layerOpacity, layerColors,
    addCabinet, upgradeNextCabinet, addLeafToNextCabinet, addSpineSwitch,
    toggleCabinetPower, toggleSpinePower,
    toggleLayerVisibility, setLayerOpacity, setLayerColor,
    revenue, expenses, powerCost, coolingCost, avgHeat,
    trafficStats, trafficVisible, toggleTrafficVisible,
  } = useGameStore()
  const [showGuide, setShowGuide] = useState(true)

  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)
  const netIncome = revenue - expenses
  const activeServers = cabinets.filter((c) => c.powerStatus).reduce((sum, c) => sum + c.serverCount, 0)
  const throttledCount = cabinets.filter((c) => c.powerStatus && c.heatLevel >= SIM.throttleTemp).reduce((sum, c) => sum + c.serverCount, 0)

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
                <strong className="text-foreground">Build cabinets</strong>
                {' '}&mdash; Each grid square is a cabinet slot. Add cabinets to start.
              </li>
              <li>
                <strong className="text-foreground">Fill cabinets</strong>
                {' '}&mdash; Add <span className="text-neon-green">Servers</span> (up to 4 per cabinet)
                and <span className="text-neon-cyan">Leaf Switches</span> (ToR, 1 per cabinet on top).
              </li>
              <li>
                <strong className="text-foreground">Build the fabric</strong>
                {' '}&mdash; Add <span className="text-neon-orange">Spine Switches</span> in the
                elevated row above to link leaf switches together.
              </li>
              <li>
                <strong className="text-foreground">Earn revenue</strong>
                {' '}&mdash; Active servers generate <span className="text-neon-yellow">${SIM.revenuePerServer}/tick</span>.
                Watch your heat &mdash; overheating throttles income!
              </li>
            </ol>
          </div>
        )}

        {/* Layer filters */}
        <div className="rounded-lg border border-border bg-card p-3 glow-green">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="size-3.5 text-neon-purple" />
            <span className="text-xs font-bold text-neon-purple tracking-widest">LAYERS</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {LAYER_DEFS.map(({ type, label, colorClass, glowClass, neonVar }) => {
              const visible = layerVisibility[type]
              const opacity = layerOpacity[type]
              const colorOverride = layerColors[type]
              const currentTopHex = colorOverride ? colorOverride.top : DEFAULT_COLORS[type].top
              const hasColorOverride = colorOverride !== null

              return (
                <div key={type} className="flex items-center gap-2">
                  {/* Visibility toggle chip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => toggleLayerVisibility(type)}
                        className={`font-mono text-xs transition-all min-w-[120px] justify-start gap-1.5 ${
                          visible
                            ? `bg-${colorClass}/20 ${glowClass} border border-${colorClass}/40`
                            : 'text-muted-foreground line-through opacity-50'
                        }`}
                      >
                        {visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                        {label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {visible ? 'Hide' : 'Show'} {label.toLowerCase()} layer
                    </TooltipContent>
                  </Tooltip>

                  {/* Opacity slider */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(opacity * 100)}
                        onChange={(e) => setLayerOpacity(type, Number(e.target.value) / 100)}
                        disabled={!visible}
                        className="w-20 h-1 accent-current disabled:opacity-30 cursor-pointer"
                        style={{ color: neonVar }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Opacity: {Math.round(opacity * 100)}%
                    </TooltipContent>
                  </Tooltip>
                  <span className={`text-xs tabular-nums w-8 text-right ${visible ? glowClass : 'text-muted-foreground opacity-50'}`}>
                    {Math.round(opacity * 100)}%
                  </span>

                  {/* Color picker */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <input
                        type="color"
                        value={hexToStr(currentTopHex)}
                        onChange={(e) => setLayerColor(type, deriveColors(strToHex(e.target.value)))}
                        disabled={!visible}
                        className="w-6 h-6 rounded border border-border bg-transparent cursor-pointer disabled:opacity-30 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Custom layer color
                    </TooltipContent>
                  </Tooltip>

                  {/* Reset color button */}
                  {hasColorOverride && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setLayerColor(type, null)}
                          className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
                        >
                          <RotateCcw className="size-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Reset to default color
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )
            })}
            {/* Traffic visibility toggle */}
            <div className="flex items-center gap-2 mt-1 pt-2 border-t border-border/50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleTrafficVisible()}
                    className={`font-mono text-xs transition-all min-w-[120px] justify-start gap-1.5 ${
                      trafficVisible
                        ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40'
                        : 'text-muted-foreground line-through opacity-50'
                    }`}
                  >
                    {trafficVisible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    Traffic
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {trafficVisible ? 'Hide' : 'Show'} traffic flow visualization
                </TooltipContent>
              </Tooltip>
              {trafficStats.redirectedFlows > 0 && (
                <span className="flex items-center gap-1 text-xs text-neon-orange animate-pulse">
                  <AlertTriangle className="size-3" />
                  REDIRECT
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] gap-3">
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
                    onClick={() => addCabinet()}
                    disabled={money < RACK_COST.cabinet || cabinets.length >= MAX_CABINETS}
                    className="justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="size-3" />
                      New Cabinet
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.cabinet.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Place a new cabinet with 1 server ({cabinets.length}/{MAX_CABINETS} slots used)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => upgradeNextCabinet()}
                    disabled={money < RACK_COST.server || !canUpgrade}
                    className="justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Plus className="size-3" />
                      <Server className="size-3" />
                      Add Server
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.server.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Add a server to the next cabinet with space (max {MAX_SERVERS_PER_CABINET} per cabinet, 450W)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLeafToNextCabinet()}
                    disabled={money < RACK_COST.leaf_switch || !canAddLeaf}
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
                  Mount a ToR leaf switch on the next cabinet without one (150W)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSpineSwitch()}
                    disabled={money < RACK_COST.spine_switch || spineSwitches.length >= MAX_SPINES}
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
                  Backbone switch in elevated row &mdash; links leaf switches ({spineSwitches.length}/{MAX_SPINES}, 250W)
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
              <p className="text-xs text-muted-foreground mt-0.5">IT WATTS</p>
            </div>
            <div className="w-full mt-3 pt-2 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cooling</span>
                <span className="text-neon-cyan">{coolingPower.toLocaleString()}W</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Total Draw</span>
                <span className="text-foreground">{(totalPower + coolingPower).toLocaleString()}W</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Active</span>
                <span className="text-neon-green">
                  {cabinets.filter((c) => c.powerStatus).length + spineSwitches.filter((s) => s.powerStatus).length}
                </span>
              </div>
            </div>
          </div>

          {/* FINANCE panel */}
          <div className="rounded-lg border border-border bg-card p-3 w-48 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">FINANCE</span>
              <span className="text-xs text-muted-foreground ml-auto">/tick</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-neon-green">
                  <TrendingUp className="size-3" />
                  Revenue
                </span>
                <span className="text-neon-green tabular-nums">+${revenue.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground ml-4">Servers ({activeServers})</span>
                <span className="text-muted-foreground tabular-nums">${(activeServers * SIM.revenuePerServer).toFixed(0)}</span>
              </div>
              {throttledCount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-neon-red ml-4">Throttled ({throttledCount})</span>
                  <span className="text-neon-red tabular-nums">-50%</span>
                </div>
              )}
              <div className="border-t border-border my-0.5" />
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-neon-red">
                  <TrendingDown className="size-3" />
                  Expenses
                </span>
                <span className="text-neon-red tabular-nums">-${expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground ml-4">Power</span>
                <span className="text-muted-foreground tabular-nums">${powerCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground ml-4">Cooling</span>
                <span className="text-muted-foreground tabular-nums">${coolingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-border my-0.5" />
              <div className="flex justify-between text-xs font-bold">
                <span className={netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}>
                  Net
                </span>
                <span className={`tabular-nums ${netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                  {netIncome >= 0 ? '+' : ''}{netIncome.toFixed(2)}
                </span>
              </div>
            </div>
            {avgHeat >= SIM.throttleTemp && (
              <div className="mt-2 pt-2 border-t border-neon-red/30">
                <p className="text-xs text-neon-red font-bold animate-pulse">
                  THERMAL THROTTLE &gt;{SIM.throttleTemp}°C
                </p>
              </div>
            )}
          </div>

          {/* TRAFFIC panel */}
          <div className="rounded-lg border border-border bg-card p-3 w-48 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">TRAFFIC</span>
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
                    <p className="text-xs text-neon-orange/80 font-bold animate-pulse mt-0.5">
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

          {/* EQUIPMENT panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-3">
              <Server className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">EQUIPMENT</span>
              {(cabinets.length + spineSwitches.length) > 0 && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {cabinets.length} cab + {spineSwitches.length} spine
                </span>
              )}
            </div>
            {cabinets.length === 0 && spineSwitches.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No equipment deployed yet. Use BUILD to add cabinets.</p>
            ) : (
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto">
                {cabinets.map((c) => {
                  const leafTag = c.hasLeafSwitch ? '+L' : ''
                  const isThrottled = c.powerStatus && c.heatLevel >= SIM.throttleTemp
                  const label = `C${c.id.replace('cab-', '')} ×${c.serverCount}${leafTag}`
                  const colorClass = isThrottled
                    ? 'bg-neon-red/20 text-neon-red border-neon-red/30 hover:bg-neon-red/30'
                    : c.powerStatus
                      ? 'bg-neon-green/20 text-neon-green border-neon-green/30 hover:bg-neon-green/30'
                      : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'

                  return (
                    <Tooltip key={c.id}>
                      <TooltipTrigger asChild>
                        <Badge
                          className={`cursor-pointer font-mono text-xs border transition-all ${colorClass}`}
                          onClick={() => toggleCabinetPower(c.id)}
                        >
                          {label}
                          {!c.powerStatus && ' OFF'}
                          {isThrottled && ' HOT'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {c.serverCount} server{c.serverCount > 1 ? 's' : ''}
                        {c.hasLeafSwitch ? ' + leaf' : ''}
                        {' — '}{Math.round(c.heatLevel)}°C
                        {isThrottled ? ' (THROTTLED)' : ''}
                        {' — click to toggle power'}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
                {spineSwitches.map((s) => {
                  const colorClass = s.powerStatus
                    ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/30'
                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'

                  return (
                    <Tooltip key={s.id}>
                      <TooltipTrigger asChild>
                        <Badge
                          className={`cursor-pointer font-mono text-xs border transition-all ${colorClass}`}
                          onClick={() => toggleSpinePower(s.id)}
                        >
                          SPINE
                          {!s.powerStatus && ' OFF'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Spine switch &mdash; click to toggle power
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
