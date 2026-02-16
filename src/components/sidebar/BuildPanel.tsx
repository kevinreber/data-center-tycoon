import { useState, useEffect } from 'react'
import { useGameStore, RACK_COST, MAX_SERVERS_PER_CABINET, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, getSuiteLimits } from '@/stores/gameStore'
import type { CabinetEnvironment, CustomerType, CabinetFacing } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Server, Network, Plus, MousePointer, X, ArrowUpDown } from 'lucide-react'
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
    placementMode, placementFacing, enterPlacementMode, exitPlacementMode,
  } = useGameStore()

  const [selectedEnv, setSelectedEnv] = useState<CabinetEnvironment>('production')
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>('general')
  const [selectedFacing, setSelectedFacing] = useState<CabinetFacing>('north')

  // Keep local facing in sync with store (updated by R key shortcut)
  useEffect(() => {
    setSelectedFacing(placementFacing)
  }, [placementFacing])

  const suiteLimits = getSuiteLimits(suiteTier)
  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)

  const envEntries = Object.entries(ENVIRONMENT_CONFIG) as [CabinetEnvironment, typeof ENVIRONMENT_CONFIG['production']][]

  return (
    <div className="flex flex-col gap-3">
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

      {/* Cabinet facing selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Facing:</span>
        <div className="flex gap-1">
          {(['north', 'south'] as CabinetFacing[]).map((dir) => (
            <Tooltip key={dir}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedFacing(dir)}
                  className={`font-mono text-xs flex-1 transition-all ${
                    selectedFacing === dir
                      ? 'border-2 border-neon-cyan/60 text-neon-cyan bg-neon-cyan/10'
                      : 'border border-border/50 opacity-50 hover:opacity-80'
                  }`}
                >
                  <ArrowUpDown className="size-3 mr-1" />
                  {dir === 'north' ? 'North' : 'South'}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                <p className="font-bold">Face {dir === 'north' ? 'North' : 'South'}</p>
                <p className="text-xs mt-1">
                  Cabinet exhaust faces {dir}. Align adjacent rows with opposing faces to create proper hot/cold aisles for cooling efficiency.
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Placement / Build Actions */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
        {placementMode ? (
          <div className="flex gap-1.5">
            <div className="flex-1 rounded border border-neon-green/40 bg-neon-green/10 px-2 py-1.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <MousePointer className="size-3 text-neon-green animate-pulse" />
                <span className="text-xs font-mono text-neon-green">Click grid tile</span>
              </div>
              <span className="text-[10px] font-mono text-neon-green/60">R = rotate | Esc = cancel</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exitPlacementMode()}
                  className="font-mono text-xs border-neon-red/30 hover:border-neon-red/60 hover:bg-neon-red/10 text-neon-red px-2"
                >
                  <X className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Cancel placement (Esc)</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => enterPlacementMode(selectedEnv, selectedCustomerType, selectedFacing)}
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
              Click to enter placement mode ({cabinets.length}/{suiteLimits.maxCabinets} slots)
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
