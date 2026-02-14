import { useState } from 'react'
import { useGameStore, DEFAULT_COLORS, RACK_COST, MAX_SERVERS_PER_CABINET, MAX_CABINETS, MAX_SPINES, SIM, ENVIRONMENT_CONFIG, formatGameTime, COOLING_CONFIG, LOAN_OPTIONS, ACHIEVEMENT_CATALOG } from '@/stores/gameStore'
import type { NodeType, LayerColors, CabinetEnvironment } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Network, Power, Cpu, Eye, SlidersHorizontal, EyeOff, RotateCcw, HardDrive, Plus, TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, AlertTriangle, Radio, Info, Shield, Clock, Zap, Droplets, Landmark, Siren, Trophy, Wrench } from 'lucide-react'
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
    revenue, expenses, powerCost, coolingCost, avgHeat, mgmtBonus,
    trafficStats, trafficVisible, toggleTrafficVisible,
    gameHour, demandMultiplier, spikeActive,
    coolingType, upgradeCooling,
    loans, loanPayments, takeLoan,
    activeIncidents, resolveIncident,
    achievements,
  } = useGameStore()
  const [showGuide, setShowGuide] = useState(true)
  const [selectedEnv, setSelectedEnv] = useState<CabinetEnvironment>('production')

  const envEntries = Object.entries(ENVIRONMENT_CONFIG) as [CabinetEnvironment, typeof ENVIRONMENT_CONFIG['production']][]
  const prodCount = cabinets.filter((c) => c.environment === 'production').length
  const labCount = cabinets.filter((c) => c.environment === 'lab').length
  const mgmtCount = cabinets.filter((c) => c.environment === 'management').length

  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)
  const netIncome = revenue - expenses - loanPayments
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
                {' '}&mdash; Choose an environment type, then add cabinets to the grid.
              </li>
              <li>
                <strong className="text-foreground">Choose environments</strong>
                {' '}&mdash; <span style={{ color: ENVIRONMENT_CONFIG.production.color }}>Production</span> earns full revenue.
                {' '}<span style={{ color: ENVIRONMENT_CONFIG.lab.color }}>Lab</span> runs cooler at 25% revenue.
                {' '}<span style={{ color: ENVIRONMENT_CONFIG.management.color }}>Management</span> reduces cooling costs facility-wide.
              </li>
              <li>
                <strong className="text-foreground">Fill &amp; connect</strong>
                {' '}&mdash; Add <span className="text-neon-green">Servers</span> (up to 4/cabinet),
                {' '}<span className="text-neon-cyan">Leaf Switches</span> (ToR), and
                {' '}<span className="text-neon-orange">Spine Switches</span> for the fabric.
              </li>
              <li>
                <strong className="text-foreground">Scale smart</strong>
                {' '}&mdash; Servers generate <span className="text-neon-yellow">${SIM.revenuePerServer}/tick</span>.
                As you grow, add Management cabinets to control rising cooling costs.
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
              {/* Environment selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Environment:</span>
                <div className="flex gap-1">
                  {envEntries.map(([env, config]) => (
                    <Tooltip key={env}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedEnv(env)}
                          className={`font-mono text-xs flex-1 transition-all ${
                            selectedEnv === env
                              ? 'border-2'
                              : 'border border-border/50 opacity-50 hover:opacity-80'
                          }`}
                          style={{
                            borderColor: selectedEnv === env ? config.color : undefined,
                            color: selectedEnv === env ? config.color : undefined,
                            backgroundColor: selectedEnv === env ? `${config.color}15` : undefined,
                          }}
                        >
                          {config.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-52">
                        <p className="font-bold" style={{ color: config.color }}>{config.name}</p>
                        <p className="text-xs mt-1">{config.guidance}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCabinet(selectedEnv)}
                    disabled={money < RACK_COST.cabinet || cabinets.length >= MAX_CABINETS}
                    className="justify-between font-mono text-xs transition-all"
                    style={{
                      borderColor: `${ENVIRONMENT_CONFIG[selectedEnv].color}33`,
                      '--hover-border': `${ENVIRONMENT_CONFIG[selectedEnv].color}80`,
                      '--hover-bg': `${ENVIRONMENT_CONFIG[selectedEnv].color}1a`,
                      color: undefined,
                    } as React.CSSProperties}
                  >
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="size-3" />
                      New {ENVIRONMENT_CONFIG[selectedEnv].name}
                    </span>
                    <span className="text-muted-foreground">${RACK_COST.cabinet.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Place a new {ENVIRONMENT_CONFIG[selectedEnv].name.toLowerCase()} cabinet with 1 server ({cabinets.length}/{MAX_CABINETS} slots used)
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
              {mgmtBonus > 0 && (
                <div className="flex justify-between text-xs mt-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help" style={{ color: ENVIRONMENT_CONFIG.management.color }}>
                        <Shield className="size-3" />
                        MGMT Bonus
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-48">
                      Management servers are reducing cooling overhead across your entire facility
                    </TooltipContent>
                  </Tooltip>
                  <span style={{ color: ENVIRONMENT_CONFIG.management.color }}>
                    -{Math.round(mgmtBonus * 100)}%
                  </span>
                </div>
              )}
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
              {loanPayments > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground ml-4">Loans</span>
                  <span className="text-muted-foreground tabular-nums">${loanPayments.toFixed(2)}</span>
                </div>
              )}
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
            {/* Contextual environment guidance */}
            {cabinets.length >= 6 && mgmtCount === 0 && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: `${ENVIRONMENT_CONFIG.management.color}30` }}>
                <p className="text-xs flex items-start gap-1" style={{ color: ENVIRONMENT_CONFIG.management.color }}>
                  <Info className="size-3 mt-0.5 shrink-0" />
                  Your facility is growing. Management cabinets can reduce cooling costs across all equipment.
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
            {/* Time-of-day and demand indicator */}
            <div className="flex flex-col gap-1.5 mb-2 pb-2 border-b border-border/50">
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
                  <TooltipContent side="bottom" className="max-w-52">
                    Traffic demand follows a 24h cycle: low overnight, peak in the evening. Random spikes can occur at any time.
                  </TooltipContent>
                </Tooltip>
                <span className={`tabular-nums font-bold ${
                  demandMultiplier > 1.2 ? 'text-neon-red' : demandMultiplier > 0.8 ? 'text-neon-yellow' : 'text-neon-green'
                }`}>
                  {Math.round(demandMultiplier * 100)}%
                </span>
              </div>
              {/* Demand bar */}
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
                  {prodCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.production.color }}>{prodCount}P</span>}
                  {prodCount > 0 && (labCount > 0 || mgmtCount > 0) && ' '}
                  {labCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.lab.color }}>{labCount}L</span>}
                  {labCount > 0 && mgmtCount > 0 && ' '}
                  {mgmtCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.management.color }}>{mgmtCount}M</span>}
                  {cabinets.length > 0 && ' + '}{spineSwitches.length}S
                </span>
              )}
            </div>
            {cabinets.length === 0 && spineSwitches.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No equipment deployed yet. Use BUILD to add cabinets.</p>
            ) : (
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto">
                {cabinets.map((c) => {
                  const envConfig = ENVIRONMENT_CONFIG[c.environment]
                  const leafTag = c.hasLeafSwitch ? '+L' : ''
                  const isThrottled = c.powerStatus && c.heatLevel >= SIM.throttleTemp
                  const label = `C${c.id.replace('cab-', '')} ×${c.serverCount}${leafTag}`
                  const envColor = envConfig.color

                  return (
                    <Tooltip key={c.id}>
                      <TooltipTrigger asChild>
                        <Badge
                          className="cursor-pointer font-mono text-xs border transition-all"
                          style={{
                            backgroundColor: isThrottled ? 'rgba(255,68,68,0.2)' : c.powerStatus ? `${envColor}20` : undefined,
                            color: isThrottled ? '#ff4444' : c.powerStatus ? envColor : undefined,
                            borderColor: isThrottled ? 'rgba(255,68,68,0.3)' : c.powerStatus ? `${envColor}40` : undefined,
                          }}
                          onClick={() => toggleCabinetPower(c.id)}
                        >
                          <span className="opacity-60 mr-0.5">{envConfig.label}</span>
                          {label}
                          {!c.powerStatus && ' OFF'}
                          {isThrottled && ' HOT'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span style={{ color: envColor }}>{envConfig.name}</span>
                        {' — '}{c.serverCount} server{c.serverCount > 1 ? 's' : ''}
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

        {/* Second row: Cooling, Loans, Incidents, Achievements */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3">
          {/* COOLING panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">COOLING</span>
              <Badge
                className="ml-auto font-mono text-xs border"
                style={{
                  backgroundColor: `${COOLING_CONFIG[coolingType].color}20`,
                  color: COOLING_CONFIG[coolingType].color,
                  borderColor: `${COOLING_CONFIG[coolingType].color}40`,
                }}
              >
                {COOLING_CONFIG[coolingType].label}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rate</span>
                <span className="text-neon-cyan tabular-nums">{COOLING_CONFIG[coolingType].coolingRate}°C/tick</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overhead</span>
                <span className="text-neon-cyan tabular-nums">-{Math.round(COOLING_CONFIG[coolingType].overheadReduction * 100)}%</span>
              </div>
              {coolingType === 'air' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => upgradeCooling('water')}
                      disabled={money < COOLING_CONFIG.water.upgradeCost}
                      className="justify-between font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all mt-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Droplets className="size-3" />
                        Water Cooling
                      </span>
                      <span className="text-muted-foreground">${COOLING_CONFIG.water.upgradeCost.toLocaleString()}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-52">
                    {COOLING_CONFIG.water.description}
                  </TooltipContent>
                </Tooltip>
              )}
              {coolingType === 'water' && (
                <p className="text-xs text-neon-cyan/60 mt-1 italic">
                  Chilled water system active. PUE improved.
                </p>
              )}
            </div>
          </div>

          {/* LOANS panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">LOANS</span>
              {loans.length > 0 && (
                <span className="ml-auto text-xs text-neon-red tabular-nums">
                  -{loanPayments.toFixed(2)}/t
                </span>
              )}
            </div>
            {loans.length > 0 && (
              <div className="flex flex-col gap-1 mb-2">
                {loans.map((loan) => (
                  <div key={loan.id} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{loan.label}</span>
                    <span className="text-neon-red tabular-nums">${loan.remaining.toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-border my-0.5" />
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Total Debt</span>
                  <span className="text-neon-red tabular-nums">
                    ${loans.reduce((sum, l) => sum + l.remaining, 0).toFixed(0)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {LOAN_OPTIONS.map((opt, i) => (
                <Tooltip key={opt.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => takeLoan(i)}
                      disabled={loans.length >= 3}
                      className="justify-between font-mono text-xs border-neon-yellow/20 hover:border-neon-yellow/50 hover:bg-neon-yellow/10 hover:text-neon-yellow transition-all"
                    >
                      <span className="truncate">{opt.label}</span>
                      <span className="text-neon-green">+${opt.principal.toLocaleString()}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-52">
                    Borrow ${opt.principal.toLocaleString()} at {(opt.interestRate * 100).toFixed(2)}%/tick over {opt.termTicks} ticks.
                    Total repayment: ${Math.round(opt.principal * (1 + opt.interestRate * opt.termTicks)).toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              ))}
              {loans.length >= 3 && (
                <p className="text-xs text-neon-red/60 italic">Max 3 active loans</p>
              )}
            </div>
          </div>

          {/* INCIDENTS panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Siren className="size-3.5 text-neon-red" />
              <span className="text-xs font-bold text-neon-red tracking-widest">INCIDENTS</span>
              {activeIncidents.length > 0 && (
                <Badge className="ml-auto bg-neon-red/20 text-neon-red border-neon-red/30 animate-pulse font-mono text-xs">
                  {activeIncidents.length} ACTIVE
                </Badge>
              )}
            </div>
            {activeIncidents.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No active incidents. Stay vigilant.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {activeIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`rounded border p-2 ${
                      inc.def.severity === 'critical'
                        ? 'border-neon-red/40 bg-neon-red/10'
                        : inc.def.severity === 'major'
                          ? 'border-neon-orange/40 bg-neon-orange/10'
                          : 'border-neon-yellow/40 bg-neon-yellow/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${
                        inc.def.severity === 'critical' ? 'text-neon-red' :
                        inc.def.severity === 'major' ? 'text-neon-orange' : 'text-neon-yellow'
                      }`}>
                        {inc.def.label}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {inc.ticksRemaining}t
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">
                      {inc.def.description}
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveIncident(inc.id)}
                          disabled={money < inc.def.resolveCost}
                          className="w-full justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green"
                        >
                          <span className="flex items-center gap-1.5">
                            <Wrench className="size-3" />
                            Resolve
                          </span>
                          <span className="text-muted-foreground">${inc.def.resolveCost.toLocaleString()}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Pay to immediately resolve this incident
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACHIEVEMENTS panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">ACHIEVEMENTS</span>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {achievements.length}/{ACHIEVEMENT_CATALOG.length}
              </span>
            </div>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
              {ACHIEVEMENT_CATALOG.map((def) => {
                const unlocked = achievements.find((a) => a.def.id === def.id)
                return (
                  <div
                    key={def.id}
                    className={`flex items-center gap-2 text-xs rounded px-1.5 py-0.5 ${
                      unlocked ? 'text-neon-yellow' : 'text-muted-foreground/40'
                    }`}
                  >
                    <span className="text-sm">{unlocked ? def.icon : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <span className={`font-bold ${unlocked ? '' : 'line-through'}`}>{def.label}</span>
                      {unlocked && (
                        <span className="text-muted-foreground ml-1.5">— {def.description}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Loan payments in finance summary */}
        {loanPayments > 0 && expenses > 0 && (
          <div className="text-xs text-neon-red/60 text-center">
            Loan payments: -${loanPayments.toFixed(2)}/tick (not included in FINANCE panel above)
          </div>
        )}

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
