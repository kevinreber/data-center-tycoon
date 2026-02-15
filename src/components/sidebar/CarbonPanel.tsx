import { useGameStore, ENERGY_SOURCE_CONFIG, GREEN_CERT_CONFIG, EWASTE_CONFIG, CARBON_TAX_SCHEDULE } from '@/stores/gameStore'
import type { EnergySource, GreenCert } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, Droplets, Recycle, Award, Factory, Wind, Sun } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function CarbonPanel() {
  const {
    energySource, setEnergySource, money,
    carbonEmissionsPerTick, lifetimeCarbonEmissions, carbonTaxRate, carbonTaxPerTick,
    greenCertifications, greenCertEligibleTicks, applyForGreenCert,
    waterUsagePerTick, waterCostPerTick, droughtActive,
    eWasteStockpile, eWasteDisposed, disposeEWaste,
    coolingType, tickCount,
  } = useGameStore()

  const energyConfig = ENERGY_SOURCE_CONFIG[energySource]
  const currentTaxBracket = CARBON_TAX_SCHEDULE.find((b) => tickCount >= b.minTick && tickCount < b.maxTick)

  const sourceIcon = (src: EnergySource) => {
    switch (src) {
      case 'grid_mixed': return <Factory className="size-3" />
      case 'grid_green': return <Leaf className="size-3" />
      case 'onsite_solar': return <Sun className="size-3" />
      case 'onsite_wind': return <Wind className="size-3" />
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Energy Source */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">ENERGY SOURCE</span>
          <Badge
            className="ml-auto font-mono text-xs border"
            style={{
              backgroundColor: `${energyConfig.color}20`,
              color: energyConfig.color,
              borderColor: `${energyConfig.color}40`,
            }}
          >
            {energyConfig.label}
          </Badge>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cost Multiplier</span>
            <span className="text-foreground tabular-nums">{energyConfig.costMultiplier}x</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Carbon/kW</span>
            <span className="text-foreground tabular-nums">{energyConfig.carbonPerKW}</span>
          </div>
          {energyConfig.reliability < 1 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Availability</span>
              <span className="text-neon-yellow tabular-nums">{Math.round(energyConfig.reliability * 100)}%</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {(Object.entries(ENERGY_SOURCE_CONFIG) as [EnergySource, typeof ENERGY_SOURCE_CONFIG['grid_mixed']][])
            .filter(([src]) => src !== energySource)
            .map(([src, config]) => (
              <Tooltip key={src}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEnergySource(src)}
                    disabled={money < config.installCost}
                    className="justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green transition-all"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {sourceIcon(src)}
                      {config.label}
                    </span>
                    <span className="text-muted-foreground">
                      {config.installCost > 0 ? `$${config.installCost.toLocaleString()}` : 'Free'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  {config.description}
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
      </div>

      {/* Carbon Tracker */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Factory className="size-3 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground">CARBON TRACKER</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Emissions/tick</span>
            <span className={`tabular-nums ${carbonEmissionsPerTick > 0 ? 'text-neon-red' : 'text-neon-green'}`}>
              {carbonEmissionsPerTick.toFixed(4)} tons
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lifetime</span>
            <span className="text-foreground tabular-nums">{lifetimeCarbonEmissions.toFixed(2)} tons</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tax Rate</span>
            <span className="text-neon-orange tabular-nums">${carbonTaxRate.toFixed(2)}/ton</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tax Cost</span>
            <span className="text-neon-orange tabular-nums">${carbonTaxPerTick.toFixed(4)}/tick</span>
          </div>
          {currentTaxBracket && currentTaxBracket.rate < (CARBON_TAX_SCHEDULE[CARBON_TAX_SCHEDULE.indexOf(currentTaxBracket) + 1]?.rate ?? Infinity) && (
            <p className="text-xs text-neon-yellow/60 italic mt-1">
              Tax rate increases at tick {currentTaxBracket.maxTick === Infinity ? 'N/A' : currentTaxBracket.maxTick}
            </p>
          )}
        </div>
      </div>

      {/* Water Usage */}
      {coolingType === 'water' && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="size-3 text-neon-cyan" />
            <span className="text-xs font-bold text-neon-cyan">WATER USAGE</span>
            {droughtActive && (
              <Badge className="ml-auto bg-neon-red/20 text-neon-red border-neon-red/30 font-mono text-xs animate-pulse">
                DROUGHT
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Usage</span>
              <span className="text-neon-cyan tabular-nums">{waterUsagePerTick} gal/tick</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cost</span>
              <span className="text-neon-cyan tabular-nums">${waterCostPerTick.toFixed(2)}/tick</span>
            </div>
          </div>
        </div>
      )}

      {/* Green Certifications */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Award className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">GREEN CERTS</span>
          {greenCertifications.length > 0 && (
            <Badge className="ml-auto bg-neon-green/20 text-neon-green border-neon-green/30 font-mono text-xs">
              {greenCertifications.length}
            </Badge>
          )}
        </div>
        {greenCertEligibleTicks > 0 && (
          <p className="text-xs text-neon-green/60 mb-2">
            Eligible streak: {greenCertEligibleTicks} ticks
          </p>
        )}
        <div className="flex flex-col gap-1">
          {GREEN_CERT_CONFIG.map((cert) => {
            const held = greenCertifications.includes(cert.id)
            const eligible = greenCertEligibleTicks >= cert.requirements.minConsecutiveTicks
            const certOrder: GreenCert[] = ['energy_star', 'leed_silver', 'leed_gold', 'carbon_neutral']
            const idx = certOrder.indexOf(cert.id)
            const preReqMet = idx === 0 || greenCertifications.includes(certOrder[idx - 1])

            return (
              <Tooltip key={cert.id}>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between text-xs p-1.5 rounded border border-border/50">
                    <span className={held ? 'text-neon-green' : 'text-muted-foreground'}>
                      {cert.label}
                    </span>
                    {held ? (
                      <Badge className="bg-neon-green/20 text-neon-green text-xs border-neon-green/30">HELD</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => applyForGreenCert(cert.id)}
                        disabled={!eligible || !preReqMet || money < cert.cost}
                        className="text-xs p-0.5 h-auto text-neon-green"
                      >
                        ${cert.cost.toLocaleString()}
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  {cert.description}
                  <br />Revenue bonus: +{Math.round(cert.revenueBonus * 100)}%
                  {cert.carbonTaxReduction > 0 && <><br />Tax reduction: -{Math.round(cert.carbonTaxReduction * 100)}%</>}
                  <br />Requires: PUE ≤ {cert.requirements.maxPUE}, {cert.requirements.minConsecutiveTicks} ticks
                  {!preReqMet && <><br /><span className="text-neon-orange">Requires: {certOrder[idx - 1]}</span></>}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* E-Waste */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Recycle className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">E-WASTE</span>
          {eWasteStockpile > 0 && (
            <Badge className={`ml-auto font-mono text-xs border ${
              eWasteStockpile > EWASTE_CONFIG.reputationPenaltyThreshold
                ? 'bg-neon-red/20 text-neon-red border-neon-red/30'
                : 'bg-neon-orange/20 text-neon-orange border-neon-orange/30'
            }`}>
              {eWasteStockpile} units
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stockpile</span>
            <span className={eWasteStockpile > EWASTE_CONFIG.reputationPenaltyThreshold ? 'text-neon-red' : 'text-foreground'}>
              {eWasteStockpile} units
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Properly Disposed</span>
            <span className="text-neon-green tabular-nums">{eWasteDisposed}</span>
          </div>
        </div>
        {eWasteStockpile > EWASTE_CONFIG.reputationPenaltyThreshold && (
          <p className="text-xs text-neon-red/80 mb-2 italic">Reputation penalty active! Dispose of e-waste.</p>
        )}
        {eWasteStockpile > 0 && (
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disposeEWaste(true)}
                  disabled={money < eWasteStockpile * EWASTE_CONFIG.properDisposalCost}
                  className="flex-1 font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green"
                >
                  Recycle ${(eWasteStockpile * EWASTE_CONFIG.properDisposalCost).toLocaleString()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                Properly recycle all e-waste. Costs more but boosts reputation.
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disposeEWaste(false)}
                  disabled={money < eWasteStockpile * EWASTE_CONFIG.improperDisposalCost}
                  className="flex-1 font-mono text-xs border-neon-red/20 hover:border-neon-red/50 hover:bg-neon-red/10 hover:text-neon-red"
                >
                  Dump ${(eWasteStockpile * EWASTE_CONFIG.improperDisposalCost).toLocaleString()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                Cheap disposal. Hurts reputation.
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}
