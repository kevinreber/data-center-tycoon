import { useState } from 'react'
import { useGameStore, SIM, DEPRECIATION, POWER_DRAW, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, MAX_SERVERS_PER_CABINET, ZONE_BONUS_CONFIG, calcMixedEnvPenalties, DEDICATED_ROW_BONUS_CONFIG, RACK_EQUIPMENT_CONFIG, RACK_TOTAL_U, RACK_COST } from '@/stores/gameStore'
import type { Cabinet, RackEquipmentType } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  X, Power, Thermometer, Clock, RefreshCw, Server, Plus,
  Network, ArrowUpDown, Cpu, Zap, DollarSign, LayoutGrid, AlertTriangle,
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
  const [showRackDetail, setShowRackDetail] = useState(false)
  const {
    toggleCabinetPower, refreshServers, money,
    selectCabinet, coolingType, trafficStats, zones, cabinets, dedicatedRows,
    rackDetails, installRackEquipment, removeRackEquipment,
    addServerToCabinet, addLeafToCabinet,
  } = useGameStore()

  const envConfig = ENVIRONMENT_CONFIG[cabinet.environment]
  const cabinetZones = zones.filter((z) => z.cabinetIds.includes(cabinet.id))
  const hasMixedPenalty = calcMixedEnvPenalties(cabinets).has(cabinet.id)
  const inDedicatedRow = dedicatedRows.some((r) => r.gridRow === cabinet.row)
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
              value={cabinet.facing.charAt(0).toUpperCase() + cabinet.facing.slice(1)}
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

            {cabinetZones.length > 0 ? (
              cabinetZones.map((z) => {
                const cfg = z.type === 'environment'
                  ? ZONE_BONUS_CONFIG.environmentBonus[z.key as keyof typeof ZONE_BONUS_CONFIG.environmentBonus]
                  : ZONE_BONUS_CONFIG.customerBonus[z.key as keyof typeof ZONE_BONUS_CONFIG.customerBonus]
                return (
                  <StatRow
                    key={z.id}
                    icon={LayoutGrid}
                    label={cfg.label}
                    value={cfg.revenueBonus > 0 ? `+${Math.round(cfg.revenueBonus * 100)}% rev` : `-${Math.round(cfg.heatReduction * 100)}% heat`}
                    color="#00ffff"
                  />
                )
              })
            ) : (
              <div className="text-[10px] text-muted-foreground/50 italic mt-0.5">
                Not in a zone
              </div>
            )}

            {inDedicatedRow && (
              <StatRow
                icon={LayoutGrid}
                label="Dedicated Row"
                value={`+${Math.round(DEDICATED_ROW_BONUS_CONFIG.efficiencyBonus * 100)}%`}
                color="#00ff88"
              />
            )}

            {hasMixedPenalty && (
              <StatRow
                icon={AlertTriangle}
                label="Mixed-Env Penalty"
                value="+5% heat, -3% rev"
                color="#ff4444"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Actions</div>

            {/* Install Server / Install Leaf */}
            <div className="flex gap-1.5">
              {cabinet.serverCount < MAX_SERVERS_PER_CABINET && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      className="flex-1 text-[10px] gap-1 border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                      onClick={() => addServerToCabinet(cabinet.id)}
                      disabled={money < RACK_COST.server}
                    >
                      <Plus className="size-3" />
                      <Server className="size-3" />
                      Server (${RACK_COST.server.toLocaleString()})
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Install a server in this cabinet ({cabinet.serverCount}/{MAX_SERVERS_PER_CABINET} slots used)
                    {money < RACK_COST.server && <><br /><span className="text-neon-red">Insufficient funds</span></>}
                  </TooltipContent>
                </Tooltip>
              )}
              {!cabinet.hasLeafSwitch && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      className="flex-1 text-[10px] gap-1 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                      onClick={() => addLeafToCabinet(cabinet.id)}
                      disabled={money < RACK_COST.leaf_switch}
                    >
                      <Plus className="size-3" />
                      <Network className="size-3" />
                      Leaf (${RACK_COST.leaf_switch.toLocaleString()})
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Install a leaf switch in this cabinet
                    {money < RACK_COST.leaf_switch && <><br /><span className="text-neon-red">Insufficient funds</span></>}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

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
                  <span className="flex-1 text-[10px] gap-1 border border-border rounded px-2 py-1 text-center text-muted-foreground/50 font-mono">
                    {cabinet.facing === 'north' ? '▲ N' : '▼ S'}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Facing {cabinet.facing} (set by row layout)
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

          {/* 42U Rack Detail */}
          <div className="border-t border-border/30 pt-2 mt-1">
            <Button variant="ghost" size="xs" className="text-[10px] w-full justify-start text-muted-foreground hover:text-neon-cyan"
              onClick={() => setShowRackDetail(!showRackDetail)}>
              {showRackDetail ? '▼' : '►'} 42U Rack Detail ({rackDetails[cabinet.id]?.totalUsedU ?? 0}/{RACK_TOTAL_U}U)
            </Button>
            {showRackDetail && (
              <div className="mt-1">
                <div className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
                  {Array.from({ length: RACK_TOTAL_U }, (_, i) => {
                    const slot = rackDetails[cabinet.id]?.slots.find(s => s.position === i + 1)
                    const equip = slot?.equipment ? RACK_EQUIPMENT_CONFIG.find(c => c.type === slot.equipment) : null
                    return (
                      <div key={i} className={`flex items-center text-[9px] px-1 py-0.5 rounded ${equip ? 'bg-neon-green/10' : 'bg-muted/10'}`}>
                        <span className="w-4 text-muted-foreground tabular-nums">{i + 1}U</span>
                        {equip ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ background: equip.color }} />
                            <span className="ml-1 text-muted-foreground">{equip.label}</span>
                            <Button variant="ghost" size="xs" className="ml-auto h-3 px-0.5 text-[8px] text-neon-red/60 hover:text-neon-red"
                              onClick={() => removeRackEquipment(cabinet.id, i + 1)}>x</Button>
                          </>
                        ) : (
                          <span className="ml-1 text-muted-foreground/30">empty</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {RACK_EQUIPMENT_CONFIG.filter(c => c.type !== 'blank_1u').slice(0, 4).map((config) => (
                    <Button key={config.type} variant="outline" size="xs" className="text-[8px] h-4 px-1"
                      disabled={money < config.cost}
                      onClick={() => {
                        const detail = rackDetails[cabinet.id]
                        const usedPositions = new Set(detail?.slots.flatMap(s => Array.from({ length: s.height }, (_, k) => s.position + k)) ?? [])
                        for (let pos = 1; pos <= RACK_TOTAL_U - config.heightU + 1; pos++) {
                          const fits = Array.from({ length: config.heightU }, (_, k) => pos + k).every(p => !usedPositions.has(p))
                          if (fits) { installRackEquipment(cabinet.id, pos, config.type as RackEquipmentType); break }
                        }
                      }}>
                      <span className="w-1 h-1 rounded-full mr-0.5" style={{ background: config.color }} />
                      {config.label.split(' ').slice(0, 2).join(' ')}
                    </Button>
                  ))}
                </div>
              </div>
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
