import { useGameStore, COOLING_CONFIG, ENVIRONMENT_CONFIG, GENERATOR_OPTIONS, SUPPRESSION_CONFIG, OPS_TIER_CONFIG, OPS_TIER_ORDER } from '@/stores/gameStore'
import type { SuppressionType, OpsTier, SuiteTier } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Power, Droplets, Shield, Fuel, Flame, Cpu } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const SUITE_TIER_ORDER: SuiteTier[] = ['starter', 'standard', 'professional', 'enterprise']

function getNextOpsTier(current: OpsTier): OpsTier | null {
  const idx = OPS_TIER_ORDER.indexOf(current)
  return idx < OPS_TIER_ORDER.length - 1 ? OPS_TIER_ORDER[idx + 1] : null
}

export function OperationsPanel() {
  const {
    cabinets, spineSwitches, totalPower, coolingPower, mgmtBonus,
    coolingType, upgradeCooling, money,
    generators, generatorFuelCost, powerOutage, outageTicksRemaining,
    buyGenerator, activateGenerator,
    suppressionType, fireActive, upgradeSuppression,
    opsTier, opsAutoResolvedCount, opsPreventedCount,
    upgradeOpsTier,
    staff, unlockedTech, reputationScore, suiteTier,
  } = useGameStore()

  const currentConfig = OPS_TIER_CONFIG.find((c) => c.id === opsTier)!
  const nextTierId = getNextOpsTier(opsTier)
  const nextConfig = nextTierId ? OPS_TIER_CONFIG.find((c) => c.id === nextTierId) : null

  // Check if next tier requirements are met
  const canUpgrade = nextConfig ? (
    staff.length >= nextConfig.unlockRequirements.minStaff &&
    nextConfig.unlockRequirements.requiredTechs.every((t) => unlockedTech.includes(t)) &&
    reputationScore >= nextConfig.unlockRequirements.minReputation &&
    SUITE_TIER_ORDER.indexOf(suiteTier) >= SUITE_TIER_ORDER.indexOf(nextConfig.unlockRequirements.minSuiteTier) &&
    money >= nextConfig.upgradeCost
  ) : false

  const reqsMet = nextConfig ? {
    staff: staff.length >= nextConfig.unlockRequirements.minStaff,
    techs: nextConfig.unlockRequirements.requiredTechs.every((t) => unlockedTech.includes(t)),
    reputation: reputationScore >= nextConfig.unlockRequirements.minReputation,
    suite: SUITE_TIER_ORDER.indexOf(suiteTier) >= SUITE_TIER_ORDER.indexOf(nextConfig.unlockRequirements.minSuiteTier),
    money: money >= nextConfig.upgradeCost,
  } : null

  return (
    <div className="flex flex-col gap-4">
      {/* Operations Tier */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="size-3" style={{ color: currentConfig.color }} />
          <span className="text-xs font-bold" style={{ color: currentConfig.color }}>OPS TIER</span>
          <Badge
            className="ml-auto font-mono text-xs border"
            style={{
              backgroundColor: `${currentConfig.color}20`,
              color: currentConfig.color,
              borderColor: `${currentConfig.color}40`,
            }}
          >
            {currentConfig.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{currentConfig.description}</p>

        {/* Current tier benefits */}
        {opsTier !== 'manual' && (
          <div className="flex flex-col gap-1 mb-2">
            {currentConfig.benefits.incidentSpawnReduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Incident prevention</span>
                <span style={{ color: currentConfig.color }}>-{Math.round(currentConfig.benefits.incidentSpawnReduction * 100)}%</span>
              </div>
            )}
            {currentConfig.benefits.autoResolveSpeedBonus > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Auto-resolve speed</span>
                <span style={{ color: currentConfig.color }}>+{Math.round(currentConfig.benefits.autoResolveSpeedBonus * 100)}%</span>
              </div>
            )}
            {currentConfig.benefits.resolveCostReduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Resolve cost discount</span>
                <span style={{ color: currentConfig.color }}>-{Math.round(currentConfig.benefits.resolveCostReduction * 100)}%</span>
              </div>
            )}
            {currentConfig.benefits.staffEffectivenessBonus > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Staff effectiveness</span>
                <span style={{ color: currentConfig.color }}>+{Math.round(currentConfig.benefits.staffEffectivenessBonus * 100)}%</span>
              </div>
            )}
            {currentConfig.benefits.revenuePenaltyReduction > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Revenue impact reduction</span>
                <span style={{ color: currentConfig.color }}>-{Math.round(currentConfig.benefits.revenuePenaltyReduction * 100)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {(opsAutoResolvedCount > 0 || opsPreventedCount > 0) && (
          <div className="flex flex-col gap-1 mb-2">
            {opsAutoResolvedCount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Auto-resolved</span>
                <span className="text-neon-green tabular-nums">{opsAutoResolvedCount}</span>
              </div>
            )}
            {opsPreventedCount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Prevented</span>
                <span className="text-neon-green tabular-nums">{opsPreventedCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Next tier upgrade */}
        {nextConfig && (
          <div className="mt-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={upgradeOpsTier}
                  disabled={!canUpgrade}
                  className="justify-between font-mono text-xs w-full transition-all"
                  style={{
                    borderColor: canUpgrade ? `${nextConfig.color}50` : undefined,
                    ...(canUpgrade ? { color: nextConfig.color } : {}),
                  }}
                >
                  <span className="truncate">{nextConfig.label}</span>
                  <span className="text-muted-foreground">${nextConfig.upgradeCost.toLocaleString()}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-64">
                <p className="font-bold mb-1">{nextConfig.label}</p>
                <p className="text-xs mb-2">{nextConfig.description}</p>
                <p className="text-xs font-bold mb-1">Requirements:</p>
                <ul className="text-xs space-y-0.5">
                  <li className={reqsMet?.staff ? 'text-neon-green' : 'text-neon-red'}>
                    {reqsMet?.staff ? '✓' : '✗'} {nextConfig.unlockRequirements.minStaff}+ staff hired
                  </li>
                  <li className={reqsMet?.techs ? 'text-neon-green' : 'text-neon-red'}>
                    {reqsMet?.techs ? '✓' : '✗'} Techs: {nextConfig.unlockRequirements.requiredTechs.join(', ') || 'None'}
                  </li>
                  <li className={reqsMet?.reputation ? 'text-neon-green' : 'text-neon-red'}>
                    {reqsMet?.reputation ? '✓' : '✗'} Reputation {nextConfig.unlockRequirements.minReputation}+
                  </li>
                  {nextConfig.unlockRequirements.minSuiteTier !== 'starter' && (
                    <li className={reqsMet?.suite ? 'text-neon-green' : 'text-neon-red'}>
                      {reqsMet?.suite ? '✓' : '✗'} Suite: {nextConfig.unlockRequirements.minSuiteTier}+
                    </li>
                  )}
                  <li className={reqsMet?.money ? 'text-neon-green' : 'text-neon-red'}>
                    {reqsMet?.money ? '✓' : '✗'} ${nextConfig.upgradeCost.toLocaleString()} funds
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {opsTier === 'orchestration' && (
          <p className="text-xs mt-1 italic" style={{ color: `${currentConfig.color}80` }}>
            Full orchestration active. Self-healing infrastructure online.
          </p>
        )}
      </div>

      {/* Power */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Power className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">POWER</span>
        </div>
        <div className="text-center mb-2">
          <p className="text-3xl font-bold text-neon-green text-glow-green tabular-nums">
            {totalPower.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">IT WATTS</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cooling</span>
            <span className="text-neon-cyan">{coolingPower.toLocaleString()}W</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total Draw</span>
            <span className="text-foreground">{(totalPower + coolingPower).toLocaleString()}W</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Active</span>
            <span className="text-neon-green">
              {cabinets.filter((c) => c.powerStatus).length + spineSwitches.filter((s) => s.powerStatus).length}
            </span>
          </div>
          {mgmtBonus > 0 && (
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1" style={{ color: ENVIRONMENT_CONFIG.management.color }}>
                <Shield className="size-3" />
                MGMT Bonus
              </span>
              <span style={{ color: ENVIRONMENT_CONFIG.management.color }}>
                -{Math.round(mgmtBonus * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Outage alert */}
        {powerOutage && (
          <div className="rounded border border-neon-red/40 bg-neon-red/10 p-2 mt-2 flex items-center gap-2 animate-pulse">
            <span className="text-xs font-bold text-neon-red">GRID OUTAGE</span>
            <span className="text-xs text-neon-red tabular-nums ml-auto">{outageTicksRemaining}t</span>
          </div>
        )}
      </div>

      {/* Cooling */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">COOLING</span>
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
              <TooltipContent side="right" className="max-w-52">
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

      {/* Generators */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Fuel className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">POWER BACKUP</span>
          {generators.length > 0 && (
            <Badge className="ml-auto bg-neon-orange/20 text-neon-orange border-neon-orange/30 font-mono text-xs">
              {generators.filter((g) => g.status === 'running').length} RUN
            </Badge>
          )}
        </div>
        {generators.length > 0 && (
          <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
            {generators.map((gen) => (
              <div key={gen.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{gen.config.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`tabular-nums ${
                    gen.status === 'running' ? 'text-neon-green' :
                    gen.status === 'cooldown' ? 'text-neon-orange' : 'text-muted-foreground'
                  }`}>
                    {gen.status === 'running' ? `${gen.fuelRemaining}t` :
                     gen.status === 'cooldown' ? `cool ${gen.ticksUntilReady}t` : 'STBY'}
                  </span>
                  {gen.status === 'standby' && gen.fuelRemaining > 0 && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-neon-green text-xs p-0 h-auto"
                      onClick={() => activateGenerator(gen.id)}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1 mb-2">
          {GENERATOR_OPTIONS.map((opt, i) => (
            <Tooltip key={opt.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => buyGenerator(i)}
                  disabled={money < opt.cost || generators.length >= 3}
                  className="justify-between font-mono text-xs border-neon-orange/20 hover:border-neon-orange/50 hover:bg-neon-orange/10 hover:text-neon-orange transition-all"
                >
                  <span className="truncate">{opt.label}</span>
                  <span className="text-muted-foreground">${opt.cost.toLocaleString()}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-52">
                {opt.description}
                <br />Capacity: {(opt.powerCapacityW / 1000).toFixed(0)}kW | Fuel: {opt.fuelCapacity}t
              </TooltipContent>
            </Tooltip>
          ))}
          {generators.length >= 3 && <p className="text-xs text-neon-orange/60 italic">Max 3 generators</p>}
        </div>

        {/* Fire suppression */}
        <div className="border-t border-border/50 pt-2">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="size-3 text-neon-red" />
            <span className="text-xs font-bold text-neon-red">FIRE SUPPRESSION</span>
            <Badge
              className="ml-auto font-mono text-xs border"
              style={{
                backgroundColor: `${SUPPRESSION_CONFIG[suppressionType].color}20`,
                color: SUPPRESSION_CONFIG[suppressionType].color,
                borderColor: `${SUPPRESSION_CONFIG[suppressionType].color}40`,
              }}
            >
              {SUPPRESSION_CONFIG[suppressionType].label}
            </Badge>
          </div>
          {fireActive && (
            <div className="rounded border border-neon-orange/40 bg-neon-orange/10 p-1.5 mb-2 animate-pulse">
              <span className="text-xs font-bold text-neon-orange">FIRE IN PROGRESS</span>
            </div>
          )}
          {(Object.entries(SUPPRESSION_CONFIG) as [SuppressionType, typeof SUPPRESSION_CONFIG['none']][])
            .filter(([type]) => type !== 'none' && type !== suppressionType)
            .map(([type, config]) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => upgradeSuppression(type)}
                    disabled={money < config.cost}
                    className="justify-between font-mono text-xs w-full mt-1 border-neon-red/20 hover:border-neon-red/50 hover:bg-neon-red/10 hover:text-neon-red transition-all"
                  >
                    <span className="truncate">{config.label}</span>
                    <span className="text-muted-foreground">${config.cost.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-52">
                  {config.description}
                  <br />Effectiveness: {Math.round(config.effectiveness * 100)}%
                  {config.equipmentDamage && <><br /><span className="text-neon-red">Warning: Damages equipment</span></>}
                </TooltipContent>
              </Tooltip>
            ))}
          {generatorFuelCost > 0 && (
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">Fuel Cost</span>
              <span className="text-neon-orange tabular-nums">${generatorFuelCost.toFixed(2)}/t</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
