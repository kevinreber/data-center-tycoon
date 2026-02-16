import { useGameStore, PDU_OPTIONS, CABLE_TRAY_OPTIONS, AISLE_CONFIG, getSuiteLimits, getPDULoad, isPDUOverloaded, BUSWAY_OPTIONS, CROSSCONNECT_OPTIONS, INROW_COOLING_OPTIONS, ZONE_BONUS_CONFIG, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plug, Cable, Network, Thermometer, AlertTriangle, Info, ArrowUpDown, Zap, Wifi, Snowflake, LayoutGrid } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function InfrastructurePanel() {
  const {
    cabinets, spineSwitches, money, suiteTier, sandboxMode,
    pdus, cableTrays, cableRuns, aisleBonus, aisleViolations,
    messyCableCount, pduOverloaded, infraIncidentBonus,
    placePDU, placeCableTray, autoRouteCables, toggleCabinetFacing,
    busways, crossConnects, inRowCoolers,
    placeBusway, placeCrossConnect, placeInRowCooling,
    zones, zoneBonusRevenue,
  } = useGameStore()

  const suiteLimits = getSuiteLimits(suiteTier)

  return (
    <div className="flex flex-col gap-4">
      {/* PDUs */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Plug className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow">PDUs</span>
          {pdus.length > 0 && (
            <Badge className={`ml-auto font-mono text-xs border ${
              pduOverloaded
                ? 'bg-neon-red/20 text-neon-red border-neon-red/30 animate-pulse'
                : 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30'
            }`}>
              {pdus.length} PLACED
            </Badge>
          )}
        </div>
        {pdus.length > 0 && (
          <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
            {pdus.map((pdu) => {
              const config = PDU_OPTIONS.find((o) => o.label === pdu.label)
              const load = config ? getPDULoad(pdu, cabinets, config) : 0
              const overloaded = config ? isPDUOverloaded(pdu, cabinets, config) : false
              return (
                <div key={pdu.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{pdu.label}</span>
                  <span className={`tabular-nums ${
                    overloaded ? 'text-neon-red animate-pulse' : load / pdu.maxCapacityKW > 0.8 ? 'text-neon-orange' : 'text-neon-green'
                  }`}>
                    {load.toFixed(1)}/{pdu.maxCapacityKW}kW
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {PDU_OPTIONS.map((opt, i) => (
            <Tooltip key={opt.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    for (let r = 0; r < suiteLimits.rows; r++) {
                      for (let c = 0; c < suiteLimits.cols; c++) {
                        const occupied = cabinets.some((cab) => cab.col === c && cab.row === r) ||
                          pdus.some((p) => p.col === c && p.row === r)
                        if (!occupied) { placePDU(c, r, i); return }
                      }
                    }
                  }}
                  disabled={money < opt.cost || pdus.length >= 6}
                  className="justify-between font-mono text-xs border-neon-yellow/20 hover:border-neon-yellow/50 hover:bg-neon-yellow/10 hover:text-neon-yellow transition-all"
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="text-muted-foreground">${opt.cost.toLocaleString()}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                {opt.description}<br />Capacity: {opt.maxCapacityKW}kW | Range: {opt.range} tiles
              </TooltipContent>
            </Tooltip>
          ))}
          {pduOverloaded && (
            <p className="text-xs text-neon-red font-bold animate-pulse flex items-center gap-1 mt-1">
              <AlertTriangle className="size-3" />PDU OVERLOADED
            </p>
          )}
        </div>
      </div>

      {/* Cabling */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Cable className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">CABLING</span>
          {cableRuns.length > 0 && (
            <Badge className={`ml-auto font-mono text-xs border ${
              messyCableCount > 0
                ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/30'
                : 'bg-neon-green/20 text-neon-green border-neon-green/30'
            }`}>
              {cableRuns.length} RUNS
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cable Runs</span>
            <span className="text-foreground tabular-nums">{cableRuns.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Messy</span>
            <span className={`tabular-nums ${messyCableCount > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>{messyCableCount}</span>
          </div>
          {messyCableCount > 0 && (
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1 text-neon-orange">
                <AlertTriangle className="size-3" />Incident Risk
              </span>
              <span className="text-neon-orange tabular-nums">+{(infraIncidentBonus * 100).toFixed(0)}%</span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => autoRouteCables()}
                disabled={cabinets.filter((c) => c.hasLeafSwitch).length === 0 || spineSwitches.length === 0}
                className="justify-between font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all"
              >
                <span className="flex items-center gap-1.5"><Cable className="size-3" />Auto-Route</span>
                <span className="text-muted-foreground">Free</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-52">
              Automatically route cables between all leaf and spine switches.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Cable Trays */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Network className="size-3 text-neon-purple" />
          <span className="text-xs font-bold text-neon-purple">CABLE TRAYS</span>
          {cableTrays.length > 0 && (
            <Badge className="ml-auto bg-neon-purple/20 text-neon-purple border-neon-purple/30 font-mono text-xs">
              {cableTrays.length}
            </Badge>
          )}
        </div>
        {cableTrays.length > 0 && (
          <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
            {cableTrays.map((tray) => (
              <div key={tray.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">Tray ({tray.col},{tray.row})</span>
                <span className="text-neon-purple tabular-nums">{tray.capacityUnits}u</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {CABLE_TRAY_OPTIONS.map((opt, i) => (
            <Tooltip key={opt.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    for (let r = 0; r < suiteLimits.rows; r++) {
                      for (let c = 0; c < suiteLimits.cols; c++) {
                        if (!cableTrays.some((t) => t.col === c && t.row === r)) { placeCableTray(c, r, i); return }
                      }
                    }
                  }}
                  disabled={money < opt.cost || cableTrays.length >= 20}
                  className="justify-between font-mono text-xs border-neon-purple/20 hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple transition-all"
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="text-muted-foreground">${opt.cost.toLocaleString()}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                {opt.description}<br />Capacity: {opt.capacityUnits} runs
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Hot/Cold Aisles */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">AISLES</span>
          {aisleBonus > 0 && (
            <Badge className="ml-auto bg-neon-green/20 text-neon-green border-neon-green/30 font-mono text-xs">
              -{Math.round(aisleBonus * 100)}%
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-muted-foreground cursor-help">
                  <Info className="size-3" />Aisle Bonus
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                Proper hot/cold aisle separation. Max: {Math.round(AISLE_CONFIG.maxCoolingBonus * 100)}%
              </TooltipContent>
            </Tooltip>
            <span className={`tabular-nums ${aisleBonus > 0 ? 'text-neon-green' : 'text-muted-foreground'}`}>
              -{Math.round(aisleBonus * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Violations</span>
            <span className={`tabular-nums ${aisleViolations > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>{aisleViolations}</span>
          </div>
          {aisleViolations > 0 && (
            <p className="text-xs text-neon-orange/80 flex items-center gap-1">
              <AlertTriangle className="size-3" />Mixed facings in {aisleViolations} row{aisleViolations > 1 ? 's' : ''}
            </p>
          )}
          {cabinets.length > 0 && (
            <div className="border-t border-border/50 pt-2 mt-1">
              <span className="text-xs text-muted-foreground mb-1 block">Cabinet Facings:</span>
              <div className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
                {cabinets.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">C{c.id.replace('cab-', '')} ({c.col},{c.row})</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => toggleCabinetFacing(c.id)}
                          className={`text-xs p-0 h-auto ${c.facing === 'north' ? 'text-neon-cyan' : 'text-neon-orange'}`}
                        >
                          <ArrowUpDown className="size-3 mr-0.5" />
                          {c.facing === 'north' ? '↑ N' : '↓ S'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Click to flip</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone Adjacency Bonuses */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">ZONES</span>
          {zones.length > 0 && (
            <Badge className="ml-auto bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 font-mono text-xs">
              {zones.length}
            </Badge>
          )}
        </div>
        {zones.length === 0 ? (
          <p className="text-xs text-muted-foreground/60 italic">
            Place {ZONE_BONUS_CONFIG.minClusterSize}+ adjacent cabinets of the same type to form a zone and earn bonuses.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {zoneBonusRevenue > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Zone Revenue</span>
                <span className="text-neon-green tabular-nums">+${zoneBonusRevenue.toFixed(2)}/t</span>
              </div>
            )}
            {zones.map((z) => {
              const cfg = z.type === 'environment'
                ? ZONE_BONUS_CONFIG.environmentBonus[z.key as keyof typeof ZONE_BONUS_CONFIG.environmentBonus]
                : ZONE_BONUS_CONFIG.customerBonus[z.key as keyof typeof ZONE_BONUS_CONFIG.customerBonus]
              const color = z.type === 'environment'
                ? ENVIRONMENT_CONFIG[z.key as keyof typeof ENVIRONMENT_CONFIG].color
                : CUSTOMER_TYPE_CONFIG[z.key as keyof typeof CUSTOMER_TYPE_CONFIG].color
              return (
                <Tooltip key={z.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between text-xs cursor-help rounded px-1 py-0.5 hover:bg-white/5">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                        <span style={{ color }}>{cfg.label}</span>
                      </span>
                      <span className="text-muted-foreground tabular-nums">{z.cabinetIds.length} cabs</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    {cfg.description}
                    <br /><span className="text-neon-cyan">{z.cabinetIds.length} cabinets in zone</span>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
      </div>

      {/* Infrastructure Entities */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Plug className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">EXTRAS</span>
        </div>
        <div className="text-[10px] text-muted-foreground mb-2">
          Busways: {busways.length} | Cross-connects: {crossConnects.length} | In-row: {inRowCoolers.length}
        </div>
        <div className="grid grid-cols-3 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                placeBusway(Math.floor(Math.random() * suiteLimits.cols), Math.floor(Math.random() * suiteLimits.rows), 0)
              }} disabled={!sandboxMode && money < BUSWAY_OPTIONS[0].cost}>
                <Zap className="size-2.5 mr-0.5" />Busway
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{BUSWAY_OPTIONS[0].description} (${BUSWAY_OPTIONS[0].cost})</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                placeCrossConnect(Math.floor(Math.random() * suiteLimits.cols), Math.floor(Math.random() * suiteLimits.rows), 0)
              }} disabled={!sandboxMode && money < CROSSCONNECT_OPTIONS[0].cost}>
                <Wifi className="size-2.5 mr-0.5" />Patch
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{CROSSCONNECT_OPTIONS[0].description} (${CROSSCONNECT_OPTIONS[0].cost})</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                placeInRowCooling(Math.floor(Math.random() * suiteLimits.cols), Math.floor(Math.random() * suiteLimits.rows), 0)
              }} disabled={!sandboxMode && money < INROW_COOLING_OPTIONS[0].cost}>
                <Snowflake className="size-2.5 mr-0.5" />Cool
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{INROW_COOLING_OPTIONS[0].description} (${INROW_COOLING_OPTIONS[0].cost})</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
