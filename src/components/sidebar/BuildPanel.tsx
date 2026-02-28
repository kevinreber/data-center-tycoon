import { useState } from 'react'
import { useGameStore, RACK_COST, MAX_SERVERS_PER_CABINET, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, SUITE_TIERS, getSuiteLimits, DEDICATED_ROW_BONUS_CONFIG, MIXED_ENV_PENALTY_CONFIG, FLOOR_PLAN_CONFIG } from '@/stores/gameStore'
import type { CabinetEnvironment, CustomerType } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Server, Network, Plus, MousePointer, Rows3, LayoutGrid, Trash2, Wand2, ArrowUp, ArrowDown, FlipVertical, Minus } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function BuildPanel() {
  const {
    cabinets, spineSwitches, money,
    addSpineSwitch,
    suiteTier,
    placementMode, enterPlacementMode,
    equipmentPlacementMode, enterEquipmentPlacementMode, exitEquipmentPlacementMode,
    mixedEnvPenaltyCount, dedicatedRows, zones,
    customRowMode, customLayout, rowPlacementMode,
    toggleCustomRowMode, removeCustomRow, moveCustomRow, resizeCustomRow, flipCustomRow, autoLayoutRows,
    enterRowPlacementMode, exitRowPlacementMode, toggleRowPlacementFacing,
    rowPlacementFacing,
  } = useGameStore()

  const [selectedEnv, setSelectedEnv] = useState<CabinetEnvironment>('production')
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>('general')

  const suiteLimits = getSuiteLimits(suiteTier)
  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)

  const envEntries = Object.entries(ENVIRONMENT_CONFIG) as [CabinetEnvironment, typeof ENVIRONMENT_CONFIG['production']][]

  // Row layout info for display
  const layout = customLayout ?? SUITE_TIERS[suiteTier].layout
  const floorPlan = FLOOR_PLAN_CONFIG[suiteTier]

  return (
    <div className="flex flex-col gap-3">
      {/* Row layout info */}
      <div className="flex flex-col gap-1 rounded border border-border/30 bg-card/30 px-2 py-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Rows3 className="size-3 text-neon-cyan/70" />
            <span className="text-xs font-mono text-muted-foreground">
              {layout.cabinetRows.length}{customRowMode ? `/${floorPlan.maxCabinetRows}` : ''} rows · {layout.aisles.length} aisles
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                onClick={toggleCustomRowMode}
                className={`text-[9px] font-mono h-4 px-1.5 ${customRowMode ? 'text-neon-cyan border-neon-cyan/40' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="size-2.5 mr-0.5" />
                {customRowMode ? 'Custom' : 'Auto'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-52">
              <p className="font-bold">{customRowMode ? 'Custom Row Layout' : 'Auto Row Layout'}</p>
              <p className="text-xs mt-1">{customRowMode ? 'Design your own row layout. Place and remove rows on the expanded floor plan.' : 'Switch to custom mode to place rows manually for strategic spacing.'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-1">
          {layout.cabinetRows.map((row) => {
            const rowCabs = cabinets.filter(c => c.row === row.gridRow)
            const fill = rowCabs.length
            const canRemove = customRowMode && fill === 0
            const maxCols = suiteLimits.cols
            return (
              <div key={row.id} className={`flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded border ${
                fill > 0 ? 'border-neon-green/30 text-neon-green/80' : 'border-border/30 text-muted-foreground/50'
              }`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-0.5 min-w-0 flex-1">
                      R{row.id + 1} {row.facing === 'north' ? '▲' : '▼'} {fill}/{row.slots}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-48">
                    <p className="font-bold">Row {row.id + 1} (grid row {row.gridRow})</p>
                    <p className="text-xs mt-1">Facing {row.facing} — {fill}/{row.slots} slots filled</p>
                    {customRowMode && fill === 0 && <p className="text-xs text-neon-red/80 mt-1">Remove empty row or move it</p>}
                    {customRowMode && fill > 0 && <p className="text-xs text-muted-foreground mt-1">Remove cabinets to delete/resize row</p>}
                  </TooltipContent>
                </Tooltip>
                {customRowMode && (
                  <div className="flex items-center gap-0.5 ml-auto shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveCustomRow(row.gridRow, row.gridRow - 1) }}
                          className="text-muted-foreground/60 hover:text-neon-cyan p-0.5"
                          title="Move up"
                        >
                          <ArrowUp className="size-2.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Move row up</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveCustomRow(row.gridRow, row.gridRow + 1) }}
                          className="text-muted-foreground/60 hover:text-neon-cyan p-0.5"
                          title="Move down"
                        >
                          <ArrowDown className="size-2.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Move row down</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => { e.stopPropagation(); flipCustomRow(row.gridRow) }}
                          className="text-muted-foreground/60 hover:text-neon-orange p-0.5"
                          title="Flip facing"
                        >
                          <FlipVertical className="size-2.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Flip row facing ({row.facing === 'north' ? '▲→▼' : '▼→▲'})</p></TooltipContent>
                    </Tooltip>
                    {row.slots > 1 && fill === 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => { e.stopPropagation(); resizeCustomRow(row.gridRow, row.slots - 1) }}
                            className="text-muted-foreground/60 hover:text-neon-yellow p-0.5"
                            title="Shrink"
                          >
                            <Minus className="size-2.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Shrink row ({row.slots}→{row.slots - 1} slots)</p></TooltipContent>
                      </Tooltip>
                    )}
                    {row.slots < maxCols && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => { e.stopPropagation(); resizeCustomRow(row.gridRow, row.slots + 1) }}
                            className="text-muted-foreground/60 hover:text-neon-yellow p-0.5"
                            title="Expand"
                          >
                            <Plus className="size-2.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top"><p>Expand row ({row.slots}→{row.slots + 1} slots)</p></TooltipContent>
                      </Tooltip>
                    )}
                    {canRemove && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeCustomRow(row.gridRow) }}
                        className="text-neon-red/60 hover:text-neon-red p-0.5"
                      >
                        <Trash2 className="size-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Custom row mode controls */}
        {customRowMode && (
          <div className="flex gap-1 mt-1 pt-1 border-t border-border/20">
            {rowPlacementMode ? (
              <div className="flex-1 flex items-center gap-1">
                <span className="text-[10px] font-mono text-neon-cyan animate-pulse">Click row to place</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={toggleRowPlacementFacing}
                  className="text-[9px] font-mono h-4 px-1 text-neon-cyan"
                >
                  {rowPlacementFacing === 'south' ? '▼ S' : '▲ N'}
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={exitRowPlacementMode}
                  className="text-[9px] font-mono h-4 px-1 text-neon-red/60"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={layout.cabinetRows.length >= floorPlan.maxCabinetRows}
                      onClick={() => enterRowPlacementMode('south')}
                      className="text-[9px] font-mono h-5 flex-1 border-neon-cyan/30 hover:border-neon-cyan/60 hover:text-neon-cyan"
                    >
                      <Plus className="size-2.5 mr-0.5" />
                      Add Row
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Click on the floor plan to place a new cabinet row</p>
                    <p className="text-xs text-muted-foreground mt-1">Min 1-row gap between rows (fire code)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={cabinets.length > 0}
                      onClick={autoLayoutRows}
                      className="text-[9px] font-mono h-5 border-border/30 hover:border-neon-green/40 hover:text-neon-green"
                    >
                      <Wand2 className="size-2.5 mr-0.5" />
                      Auto
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Auto-arrange rows with optimal spacing</p>
                    {cabinets.length > 0 && <p className="text-xs text-neon-red/80 mt-1">Remove all cabinets first</p>}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        )}
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

        {equipmentPlacementMode === 'server' ? (
          <div className="flex gap-1.5">
            <div className="flex-1 rounded border border-neon-green/40 bg-neon-green/10 px-2 py-1.5 flex items-center gap-1.5">
              <Server className="size-3 text-neon-green animate-pulse" />
              <span className="text-xs font-mono text-neon-green">Click a cabinet</span>
            </div>
            <Button variant="ghost" size="sm" onClick={exitEquipmentPlacementMode} className="text-xs text-muted-foreground">
              Cancel
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => enterEquipmentPlacementMode('server')}
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
              Click a cabinet to install a server (max {MAX_SERVERS_PER_CABINET}/cabinet, 450W)
            </TooltipContent>
          </Tooltip>
        )}

        {equipmentPlacementMode === 'leaf' ? (
          <div className="flex gap-1.5">
            <div className="flex-1 rounded border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-1.5 flex items-center gap-1.5">
              <Network className="size-3 text-neon-cyan animate-pulse" />
              <span className="text-xs font-mono text-neon-cyan">Click a cabinet</span>
            </div>
            <Button variant="ghost" size="sm" onClick={exitEquipmentPlacementMode} className="text-xs text-muted-foreground">
              Cancel
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => enterEquipmentPlacementMode('leaf')}
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
              Click a cabinet to mount a ToR leaf switch (150W)
            </TooltipContent>
          </Tooltip>
        )}

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

      {/* Organization Status */}
      {cabinets.length >= 2 && (
        <div className="border-t border-border/50 pt-2">
          <span className="text-[10px] font-bold text-muted-foreground">ORGANIZATION</span>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Zones</span>
              <span className={zones.length > 0 ? 'text-neon-cyan' : 'text-muted-foreground'}>{zones.length}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground cursor-help">Dedicated Rows</span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  <p className="text-xs">Fill an entire row with the same environment type for +{(DEDICATED_ROW_BONUS_CONFIG.efficiencyBonus * 100).toFixed(0)}% efficiency (revenue for production, cooling for lab/management).</p>
                </TooltipContent>
              </Tooltip>
              <span className={dedicatedRows.length > 0 ? 'text-neon-green' : 'text-muted-foreground'}>{dedicatedRows.length}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`cursor-help ${mixedEnvPenaltyCount > 0 ? 'text-neon-red' : 'text-muted-foreground'}`}>Mixed-Env Penalties</span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  <p className="text-xs">Cabinets surrounded by different environment types get +{(MIXED_ENV_PENALTY_CONFIG.heatPenalty * 100).toFixed(0)}% heat and -{(MIXED_ENV_PENALTY_CONFIG.revenuePenalty * 100).toFixed(0)}% revenue. Cluster same types together to avoid.</p>
                </TooltipContent>
              </Tooltip>
              <span className={mixedEnvPenaltyCount > 0 ? 'text-neon-red' : 'text-neon-green'}>{mixedEnvPenaltyCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
