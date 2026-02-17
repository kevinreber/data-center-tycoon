import { useState } from 'react'
import { useGameStore, RACK_COST, MAX_SERVERS_PER_CABINET, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, SUITE_TIERS, getSuiteLimits } from '@/stores/gameStore'
import type { CabinetEnvironment, CustomerType } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Server, Network, Plus, MousePointer, Rows3 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function BuildPanel() {
  const {
    cabinets, spineSwitches, money,
    upgradeNextCabinet, addLeafToNextCabinet, addSpineSwitch,
    suiteTier,
    placementMode, enterPlacementMode,
  } = useGameStore()

  const [selectedEnv, setSelectedEnv] = useState<CabinetEnvironment>('production')
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>('general')

  const suiteLimits = getSuiteLimits(suiteTier)
  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)

  const envEntries = Object.entries(ENVIRONMENT_CONFIG) as [CabinetEnvironment, typeof ENVIRONMENT_CONFIG['production']][]

  // Row layout info for display
  const layout = SUITE_TIERS[suiteTier].layout

  return (
    <div className="flex flex-col gap-3">
      {/* Row layout info */}
      <div className="flex flex-col gap-1 rounded border border-border/30 bg-card/30 px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <Rows3 className="size-3 text-neon-cyan/70" />
          <span className="text-xs font-mono text-muted-foreground">
            {layout.cabinetRows.length} rows · {layout.aisles.length} aisles
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {layout.cabinetRows.map((row) => {
            const rowCabs = cabinets.filter(c => c.row === row.gridRow)
            const fill = rowCabs.length
            return (
              <Tooltip key={row.id}>
                <TooltipTrigger asChild>
                  <span className={`text-xs font-mono px-1 rounded border ${
                    fill > 0 ? 'border-neon-green/30 text-neon-green/80' : 'border-border/30 text-muted-foreground/50'
                  }`}>
                    R{row.id + 1} {row.facing === 'north' ? '▲' : '▼'} {fill}/{row.slots}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-48">
                  <p className="font-bold">Row {row.id + 1}</p>
                  <p className="text-xs mt-1">Facing {row.facing} — {fill}/{row.slots} slots filled</p>
                  <p className="text-xs text-muted-foreground">Facing is set by the facility layout</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

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
              <TooltipContent side="right" className="max-w-52">
                <p className="font-bold" style={{ color: config.color }}>{config.name}</p>
                <p className="text-xs mt-1">{config.guidance}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Customer type selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Workload:</span>
        <div className="flex gap-1 flex-wrap">
          {(Object.entries(CUSTOMER_TYPE_CONFIG) as [CustomerType, typeof CUSTOMER_TYPE_CONFIG['general']][]).map(([type, config]) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedCustomerType(type)}
                  className={`font-mono text-xs transition-all ${
                    selectedCustomerType === type
                      ? 'border-2'
                      : 'border border-border/50 opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    borderColor: selectedCustomerType === type ? config.color : undefined,
                    color: selectedCustomerType === type ? config.color : undefined,
                    backgroundColor: selectedCustomerType === type ? `${config.color}15` : undefined,
                  }}
                >
                  {config.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                <p className="font-bold" style={{ color: config.color }}>{config.label}</p>
                <p className="text-xs mt-1">{config.description}</p>
                <p className="text-xs mt-1">Power: {Math.round(config.powerMultiplier * 100)}% | Heat: {Math.round(config.heatMultiplier * 100)}%</p>
                <p className="text-xs">Revenue: {Math.round(config.revenueMultiplier * 100)}% | Bandwidth: {Math.round(config.bandwidthMultiplier * 100)}%</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Placement / Build Actions */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
        {placementMode ? (
          <div className="flex gap-1.5">
            <div className="flex-1 rounded border border-neon-green/40 bg-neon-green/10 px-2 py-1.5 flex items-center gap-1.5">
              <MousePointer className="size-3 text-neon-green animate-pulse" />
              <span className="text-xs font-mono text-neon-green">Click a row slot</span>
            </div>
            {/* Zone overlay legend */}
            <div className="rounded border border-border/30 bg-muted/30 px-2 py-1.5">
              <p className="text-[10px] font-mono text-muted-foreground mb-1">Zone overlay key:</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#4488ff' }} />
                  <span className="text-[#4488ff]">Cold Aisle</span>
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#ff8844' }} />
                  <span className="text-[#ff8844]">Hot Exhaust</span>
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#aaaa44' }} />
                  <span className="text-[#aaaa44]">Access</span>
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#ff4444' }} />
                  <span className="text-[#ff4444]">Blocked</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => enterPlacementMode(selectedEnv, selectedCustomerType)}
                disabled={money < RACK_COST.cabinet || cabinets.length >= suiteLimits.maxCabinets}
                className="justify-between font-mono text-xs transition-all"
                style={{
                  borderColor: `${ENVIRONMENT_CONFIG[selectedEnv].color}33`,
                }}
              >
                <span className="flex items-center gap-1.5">
                  <MousePointer className="size-3" />
                  Place {ENVIRONMENT_CONFIG[selectedEnv].name}
                </span>
                <span className="text-muted-foreground">${RACK_COST.cabinet.toLocaleString()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Click to enter placement mode ({cabinets.length}/{suiteLimits.maxCabinets} slots)</p>
              <p className="text-xs text-muted-foreground mt-1">Cabinet facing is set by the row layout</p>
            </TooltipContent>
          </Tooltip>
        )}

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
          <TooltipContent side="right">
            Add a server to the next cabinet with space (max {MAX_SERVERS_PER_CABINET}/cabinet, 450W)
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
          <TooltipContent side="right">
            Mount a ToR leaf switch on next cabinet without one (150W)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSpineSwitch()}
              disabled={money < RACK_COST.spine_switch || spineSwitches.length >= suiteLimits.maxSpines}
              className="justify-between font-mono text-xs border-neon-orange/20 hover:border-neon-orange/50 hover:bg-neon-orange/10 hover:text-neon-orange transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Network className="size-3" />
                Spine Switch
              </span>
              <span className="text-muted-foreground">${RACK_COST.spine_switch.toLocaleString()}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Backbone switch ({spineSwitches.length}/{suiteLimits.maxSpines}, 250W)
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
