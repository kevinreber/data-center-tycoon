import { useGameStore, SIM, DEPRECIATION, POWER_DRAW, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, MAX_SERVERS_PER_CABINET } from '@/stores/gameStore'
import type { Cabinet } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  X, Power, Thermometer, Clock, RefreshCw, Server,
  Network, ArrowUpDown, Cpu, Zap, DollarSign,
} from 'lucide-react'

function ServerSlot({ index, filled, powerOn }: { index: number; filled: boolean; powerOn: boolean }) {
  return (
    <div
      className={`h-7 rounded border text-[10px] font-mono flex items-center px-2 gap-1.5 transition-all ${
        filled
          ? powerOn
            ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
            : 'border-muted-foreground/30 bg-muted/30 text-muted-foreground'
          : 'border-dashed border-border/40 bg-transparent text-muted-foreground/30'
      }`}
    >
      <Cpu className="size-3 shrink-0" />
      <span>{filled ? `Server ${index + 1}` : 'Empty Slot'}</span>
      {filled && powerOn && (
        <span className="ml-auto flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
        </span>
      )}
    </div>
  )
}

function LeafSwitchSlot({ installed, powerOn }: { installed: boolean; powerOn: boolean }) {
  return (
    <div
      className={`h-7 rounded border text-[10px] font-mono flex items-center px-2 gap-1.5 transition-all ${
        installed
          ? powerOn
            ? 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan'
            : 'border-muted-foreground/30 bg-muted/30 text-muted-foreground'
          : 'border-dashed border-border/40 bg-transparent text-muted-foreground/30'
      }`}
    >
      <Network className="size-3 shrink-0" />
      <span>{installed ? 'Leaf Switch (ToR)' : 'No Leaf Switch'}</span>
      {installed && powerOn && (
        <span className="ml-auto flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
        </span>
      )}
    </div>
  )
}

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

function CabinetDetail({ cabinet }: { cabinet: Cabinet }) {
  const {
    toggleCabinetPower, toggleCabinetFacing, refreshServers, money,
    selectCabinet, coolingType, trafficStats,
  } = useGameStore()

  const envConfig = ENVIRONMENT_CONFIG[cabinet.environment]
  const custConfig = CUSTOMER_TYPE_CONFIG[cabinet.customerType]

  // Power calculations
  const serverPower = cabinet.serverCount * POWER_DRAW.server * custConfig.powerMultiplier
  const leafPower = cabinet.hasLeafSwitch ? POWER_DRAW.leaf_switch : 0
  const totalPowerW = cabinet.powerStatus ? serverPower + leafPower : 0

  // Heat status
  const isThrottled = cabinet.powerStatus && cabinet.heatLevel >= SIM.throttleTemp
  const isCritical = cabinet.powerStatus && cabinet.heatLevel >= SIM.criticalTemp
  const heatColor = isCritical ? '#ff4444' : isThrottled ? '#ff6644' : cabinet.heatLevel > 60 ? '#ffaa00' : '#00ff88'

  // Depreciation
  const lifeProgress = cabinet.serverAge / DEPRECIATION.serverLifespanTicks
  const isAging = lifeProgress > 0.6
  const isEndOfLife = lifeProgress > 0.9
  const efficiency = lifeProgress > DEPRECIATION.revenueDecayStart
    ? Math.max(DEPRECIATION.efficiencyFloor, 1 - ((lifeProgress - DEPRECIATION.revenueDecayStart) / (1 - DEPRECIATION.revenueDecayStart)) * (1 - DEPRECIATION.efficiencyFloor))
    : 1.0
  const refreshCost = DEPRECIATION.refreshCost * cabinet.serverCount

  // Revenue per tick for this cabinet
  const baseRevenue = cabinet.serverCount * SIM.revenuePerServer * envConfig.revenueMultiplier * custConfig.revenueMultiplier
  const effectiveRevenue = cabinet.powerStatus ? baseRevenue * efficiency * (isThrottled ? 0.5 : 1) : 0

  // Cooling rate
  const coolingRate = coolingType === 'water' ? 3.5 : SIM.airCoolingRate

  // Traffic from this cabinet
  const cabTrafficLinks = trafficStats.links.filter((l) => l.leafCabinetId === cabinet.id)
  const cabBandwidth = cabTrafficLinks.reduce((sum, l) => sum + l.bandwidthGbps, 0)

  return (
    <TooltipProvider>
      <div className="absolute bottom-3 right-3 w-72 z-30 rounded-lg border border-neon-cyan/30 bg-card/95 backdrop-blur-sm shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Server className="size-3.5 text-neon-cyan" />
            <span className="text-xs font-bold text-neon-cyan tracking-widest">
              CABINET {cabinet.id.replace('cab-', '#')}
            </span>
            <Badge
              className="text-[9px] px-1.5 py-0 h-4 border"
              style={{ backgroundColor: `${envConfig.color}20`, color: envConfig.color, borderColor: `${envConfig.color}40` }}
            >
              {envConfig.label}
            </Badge>
            {cabinet.customerType !== 'general' && (
              <Badge
                className="text-[9px] px-1.5 py-0 h-4 border"
                style={{ backgroundColor: `${custConfig.color}20`, color: custConfig.color, borderColor: `${custConfig.color}40` }}
              >
                {custConfig.label}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => selectCabinet(null)}
            className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="p-3 flex flex-col gap-3">
          {/* Hardware slots visualization */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Hardware</div>
            <div className="flex flex-col gap-1 rounded border border-border/50 bg-black/20 p-2">
              <LeafSwitchSlot installed={cabinet.hasLeafSwitch} powerOn={cabinet.powerStatus} />
              <div className="w-full h-px bg-border/30 my-0.5" />
              {Array.from({ length: MAX_SERVERS_PER_CABINET }).map((_, i) => (
                <ServerSlot
                  key={i}
                  index={i}
                  filled={i < cabinet.serverCount}
                  powerOn={cabinet.powerStatus}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Status</div>

            <StatRow
              icon={Power}
              label="Power"
              value={cabinet.powerStatus ? `${totalPowerW.toFixed(0)}W` : 'OFF'}
              color={cabinet.powerStatus ? '#00ff88' : '#ff4444'}
            />

            <StatRow
              icon={Thermometer}
              label="Temperature"
              value={`${Math.round(cabinet.heatLevel)}°C`}
              color={heatColor}
              sub={isThrottled ? 'THROTTLED' : isCritical ? 'CRITICAL' : `${coolingType} cooling −${coolingRate}°C/t`}
            />

            <StatRow
              icon={DollarSign}
              label="Revenue"
              value={cabinet.powerStatus ? `$${effectiveRevenue.toFixed(1)}/t` : '$0/t'}
              color="#ffaa00"
              sub={efficiency < 1 ? `${Math.round(efficiency * 100)}% eff` : undefined}
            />

            <StatRow
              icon={Clock}
              label="Server Age"
              value={`${cabinet.serverAge}/${DEPRECIATION.serverLifespanTicks}t`}
              color={isEndOfLife ? '#ff4444' : isAging ? '#ffaa00' : undefined}
              sub={`${Math.round(lifeProgress * 100)}%`}
            />

            <StatRow
              icon={ArrowUpDown}
              label="Facing"
              value={cabinet.facing === 'north' ? 'North' : 'South'}
            />

            {cabinet.hasLeafSwitch && (
              <StatRow
                icon={Network}
                label="Traffic"
                value={`${cabBandwidth.toFixed(1)} Gbps`}
                color="#00aaff"
              />
            )}

            <StatRow
              icon={Zap}
              label="Grid Position"
              value={`(${cabinet.col}, ${cabinet.row})`}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Actions</div>

            <div className="flex gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className={`flex-1 text-[10px] gap-1 ${
                      cabinet.powerStatus
                        ? 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'
                        : 'border-neon-red/30 text-neon-red hover:bg-neon-red/10'
                    }`}
                    onClick={() => toggleCabinetPower(cabinet.id)}
                  >
                    <Power className="size-3" />
                    {cabinet.powerStatus ? 'Power Off' : 'Power On'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Toggle cabinet power</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className="flex-1 text-[10px] gap-1 border-border hover:bg-muted"
                    onClick={() => toggleCabinetFacing(cabinet.id)}
                  >
                    <ArrowUpDown className="size-3" />
                    Flip
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Toggle facing ({cabinet.facing === 'north' ? 'N→S' : 'S→N'}) for hot/cold aisle
                </TooltipContent>
              </Tooltip>
            </div>

            {isAging && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="xs"
                    className={`w-full text-[10px] gap-1 ${
                      money >= refreshCost
                        ? 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10'
                        : 'border-border text-muted-foreground opacity-50'
                    }`}
                    onClick={() => refreshServers(cabinet.id)}
                    disabled={money < refreshCost}
                  >
                    <RefreshCw className="size-3" />
                    Refresh Servers (${refreshCost.toLocaleString()})
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Reset server age to 0 and restore 100% efficiency
                  <br />
                  {money < refreshCost && <span className="text-neon-red">Insufficient funds</span>}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export function CabinetDetailPanel() {
  const selectedCabinetId = useGameStore((s) => s.selectedCabinetId)
  const cabinets = useGameStore((s) => s.cabinets)

  if (!selectedCabinetId) return null

  const cabinet = cabinets.find((c) => c.id === selectedCabinetId)
  if (!cabinet) return null

  return <CabinetDetail cabinet={cabinet} />
}
