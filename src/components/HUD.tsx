import { useState } from 'react'
import { useGameStore, RACK_COST, MAX_SERVERS_PER_CABINET, SIM, ENVIRONMENT_CONFIG, formatGameTime, COOLING_CONFIG, LOAN_OPTIONS, ACHIEVEMENT_CATALOG, CONTRACT_TIER_COLORS, CUSTOMER_TYPE_CONFIG, GENERATOR_OPTIONS, SUPPRESSION_CONFIG, TECH_TREE, TECH_BRANCH_COLORS, DEPRECIATION, getReputationTier, POWER_MARKET, SUITE_TIERS, SUITE_TIER_ORDER, getSuiteLimits, PDU_OPTIONS, CABLE_TRAY_OPTIONS, AISLE_CONFIG, getPDULoad, isPDUOverloaded, INSURANCE_OPTIONS, DRILL_CONFIG, VALUATION_MILESTONES, PATENT_CONFIG, BUSWAY_OPTIONS, CROSSCONNECT_OPTIONS, INROW_COOLING_OPTIONS, SCENARIO_CATALOG, STAFF_ROLE_CONFIG, STAFF_CERT_CONFIG, SHIFT_PATTERN_CONFIG, MAX_STAFF_BY_TIER } from '@/stores/gameStore'
import type { CabinetEnvironment, CustomerType, SuppressionType, TechBranch, CabinetFacing, StaffRole, StaffSkillLevel, ShiftPattern } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Server, Network, Power, Cpu, Plus, TrendingUp, TrendingDown, DollarSign, ArrowRightLeft, AlertTriangle, Radio, Info, Shield, Clock, Zap, Droplets, Landmark, Siren, Trophy, Wrench, FileText, Check, Fuel, Flame, FlaskConical, Star, RefreshCw, Lock, Building, MousePointer, X, Plug, Cable, ArrowUpDown, Thermometer, Save, Upload, RotateCw, Play, Map, Target, Briefcase, Snowflake, Wifi, Award, Users, UserPlus, GraduationCap, Moon, Sun, Trash2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function HUD() {
  const {
    cabinets, spineSwitches, totalPower, coolingPower, money,
    upgradeNextCabinet, addLeafToNextCabinet, addSpineSwitch,
    toggleCabinetPower, toggleSpinePower,
    revenue, expenses, powerCost, coolingCost, avgHeat, mgmtBonus,
    trafficStats,
    gameHour, demandMultiplier, spikeActive,
    coolingType, upgradeCooling,
    loans, loanPayments, takeLoan,
    activeIncidents, resolveIncident,
    achievements,
    contractOffers, activeContracts, acceptContract, contractRevenue, contractPenalties, completedContracts,
    // Phase 2/3
    generators, generatorFuelCost, powerOutage, outageTicksRemaining,
    buyGenerator, activateGenerator,
    suppressionType, fireActive, upgradeSuppression,
    unlockedTech, activeResearch, startResearch, rdSpent,
    reputationScore, uptimeTicks, totalOperatingTicks,
    powerPriceMultiplier, powerPriceSpikeActive,
    refreshServers, totalRefreshes,
    suiteTier, upgradeSuite,
    // Placement mode
    placementMode, enterPlacementMode, exitPlacementMode,
    // Infrastructure
    pdus, cableTrays, cableRuns, aisleBonus, aisleViolations,
    messyCableCount, pduOverloaded, infraIncidentBonus,
    placePDU, placeCableTray, autoRouteCables, toggleCabinetFacing,
    // Insurance
    insurancePolicies, insuranceCost, buyInsurance, cancelInsurance,
    // DR Drills
    drillCooldown, lastDrillResult, drillsCompleted, drillsPassed, runDrill,
    // Stock Price
    stockPrice, stockHistory, valuationMilestonesReached,
    // Patents
    patents, patentIncome, patentTech,
    // RFP Bidding
    rfpOffers, rfpsWon, bidOnRFP,
    // Infrastructure entities
    busways, crossConnects, inRowCoolers,
    placeBusway, placeCrossConnect, placeInRowCooling,
    // Sandbox
    sandboxMode, toggleSandboxMode,
    // Scenarios
    activeScenario, scenarioProgress, scenariosCompleted,
    startScenario, abandonScenario,
    // Network topology
    networkTopology,
    // Heat map
    heatMapVisible, toggleHeatMap,
    // Staff & HR
    staff, shiftPattern, trainingQueue, staffCostPerTick, staffIncidentsResolved, staffBurnouts,
    hireStaff, fireStaff, setShiftPattern, startTraining,
    // Save / Load
    saveGame, loadGame, resetGame,
  } = useGameStore()
  const [showGuide, setShowGuide] = useState(true)
  const [selectedEnv, setSelectedEnv] = useState<CabinetEnvironment>('production')
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>('general')
  const [selectedFacing, setSelectedFacing] = useState<CabinetFacing>('north')
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole>('network_engineer')
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<StaffSkillLevel>(1)

  const suiteLimits = getSuiteLimits(suiteTier)
  const suiteConfig = SUITE_TIERS[suiteTier]
  const currentTierIdx = SUITE_TIER_ORDER.indexOf(suiteTier)
  const nextTier = currentTierIdx < SUITE_TIER_ORDER.length - 1 ? SUITE_TIER_ORDER[currentTierIdx + 1] : null
  const nextSuiteConfig = nextTier ? SUITE_TIERS[nextTier] : null

  const envEntries = Object.entries(ENVIRONMENT_CONFIG) as [CabinetEnvironment, typeof ENVIRONMENT_CONFIG['production']][]
  const prodCount = cabinets.filter((c) => c.environment === 'production').length
  const labCount = cabinets.filter((c) => c.environment === 'lab').length
  const mgmtCount = cabinets.filter((c) => c.environment === 'management').length

  const canUpgrade = cabinets.some((c) => c.serverCount < MAX_SERVERS_PER_CABINET)
  const canAddLeaf = cabinets.some((c) => !c.hasLeafSwitch)
  const netIncome = revenue + contractRevenue - expenses - loanPayments - contractPenalties
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
                {' '}&mdash; Choose an environment type, then place empty cabinet frames on the grid.
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
              <li>
                <strong className="text-foreground">Upgrade facility</strong>
                {' '}&mdash; Start in a small suite and migrate to bigger ones in the
                {' '}<span className="text-neon-cyan">FACILITY</span> panel when you need more space.
              </li>
            </ol>
          </div>
        )}

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
                      <TooltipContent side="bottom" className="max-w-52">
                        <p className="font-bold" style={{ color: config.color }}>{config.label}</p>
                        <p className="text-xs mt-1">{config.description}</p>
                        <p className="text-xs mt-1">Power: {Math.round(config.powerMultiplier * 100)}% | Heat: {Math.round(config.heatMultiplier * 100)}%</p>
                        <p className="text-xs">Revenue: {Math.round(config.revenueMultiplier * 100)}% | Bandwidth: {Math.round(config.bandwidthMultiplier * 100)}%</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              {/* Cabinet facing selector (hot/cold aisle) */}
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
                      <TooltipContent side="bottom" className="max-w-52">
                        <p className="font-bold">Face {dir === 'north' ? 'North' : 'South'}</p>
                        <p className="text-xs mt-1">
                          Cabinet exhaust faces {dir}. Align adjacent rows with opposing faces to create proper hot/cold aisles for cooling efficiency.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              {placementMode ? (
                <div className="flex gap-1.5">
                  <div className="flex-1 rounded border border-neon-green/40 bg-neon-green/10 px-2 py-1.5 flex items-center gap-1.5">
                    <MousePointer className="size-3 text-neon-green animate-pulse" />
                    <span className="text-xs font-mono text-neon-green">Click tile to place empty cabinet</span>
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
                    <TooltipContent side="bottom">Cancel placement (Esc)</TooltipContent>
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
                        '--hover-border': `${ENVIRONMENT_CONFIG[selectedEnv].color}80`,
                        '--hover-bg': `${ENVIRONMENT_CONFIG[selectedEnv].color}1a`,
                        color: undefined,
                      } as React.CSSProperties}
                    >
                      <span className="flex items-center gap-1.5">
                        <MousePointer className="size-3" />
                        Place {ENVIRONMENT_CONFIG[selectedEnv].name}
                      </span>
                      <span className="text-muted-foreground">${RACK_COST.cabinet.toLocaleString()}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-56">
                    <p>Places an empty cabinet frame on the grid.</p>
                    <p className="text-xs mt-1 text-muted-foreground">Add servers &amp; a leaf switch separately after placing. ({cabinets.length}/{suiteLimits.maxCabinets} slots used)</p>
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
                <TooltipContent side="bottom">
                  Backbone switch in elevated row &mdash; links leaf switches ({spineSwitches.length}/{suiteLimits.maxSpines}, 250W)
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
              {contractRevenue > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground ml-4">Contracts</span>
                  <span className="text-neon-green tabular-nums">+${contractRevenue.toFixed(0)}</span>
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
              {contractPenalties > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-neon-red ml-4">SLA Penalties</span>
                  <span className="text-neon-red tabular-nums">${contractPenalties.toFixed(0)}</span>
                </div>
              )}
              {generatorFuelCost > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground ml-4">Generator Fuel</span>
                  <span className="text-muted-foreground tabular-nums">${generatorFuelCost.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border my-0.5" />
              <div className="flex justify-between text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`flex items-center gap-1 cursor-help ${
                      powerPriceSpikeActive ? 'text-neon-red animate-pulse' : 'text-muted-foreground'
                    }`}>
                      <Zap className="size-3" />
                      Power Rate
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-52">
                    Electricity spot price fluctuates with the market. Base: ${POWER_MARKET.baseCost}/kW
                  </TooltipContent>
                </Tooltip>
                <span className={`tabular-nums ${
                  powerPriceMultiplier > 1.3 ? 'text-neon-red' : powerPriceMultiplier < 0.8 ? 'text-neon-green' : 'text-foreground'
                }`}>
                  {Math.round(powerPriceMultiplier * 100)}%{powerPriceSpikeActive ? ' SPIKE' : ''}
                </span>
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
            {/* Suite upgrade prompt when nearing capacity */}
            {nextTier && cabinets.length >= suiteLimits.maxCabinets - 2 && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: `${nextSuiteConfig!.color}30` }}>
                <p className="text-xs flex items-start gap-1" style={{ color: nextSuiteConfig!.color }}>
                  <Building className="size-3 mt-0.5 shrink-0" />
                  Running out of space. Upgrade to {nextSuiteConfig!.label} for {nextSuiteConfig!.maxCabinets} cabinet slots.
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
                  const custConfig = CUSTOMER_TYPE_CONFIG[c.customerType]
                  const leafTag = c.hasLeafSwitch ? '+L' : ''
                  const isThrottled = c.powerStatus && c.heatLevel >= SIM.throttleTemp
                  const lifeProgress = c.serverAge / DEPRECIATION.serverLifespanTicks
                  const isAging = lifeProgress > 0.6
                  const isEndOfLife = lifeProgress > 0.9
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
                            borderColor: isEndOfLife ? 'rgba(255,170,0,0.5)' : isThrottled ? 'rgba(255,68,68,0.3)' : c.powerStatus ? `${envColor}40` : undefined,
                          }}
                          onClick={() => toggleCabinetPower(c.id)}
                        >
                          <span className="opacity-60 mr-0.5">{envConfig.label}</span>
                          {c.customerType !== 'general' && (
                            <span className="opacity-60 mr-0.5" style={{ color: custConfig.color }}>
                              {custConfig.label.charAt(0)}
                            </span>
                          )}
                          {label}
                          {!c.powerStatus && ' OFF'}
                          {isThrottled && ' HOT'}
                          {isEndOfLife && ' OLD'}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-60">
                        <span style={{ color: envColor }}>{envConfig.name}</span>
                        {' — '}<span style={{ color: custConfig.color }}>{custConfig.label}</span>
                        {' — '}{c.serverCount} server{c.serverCount > 1 ? 's' : ''}
                        {c.hasLeafSwitch ? ' + leaf' : ''}
                        {' — '}{Math.round(c.heatLevel)}°C
                        {isThrottled ? ' (THROTTLED)' : ''}
                        <br />Age: {c.serverAge}/{DEPRECIATION.serverLifespanTicks}t ({Math.round(lifeProgress * 100)}%)
                        {isAging && <><br /><span className="text-neon-orange">Efficiency declining — consider refresh (${(DEPRECIATION.refreshCost * c.serverCount).toLocaleString()})</span></>}
                        <br />Click to toggle power
                        {isAging && <><br /><Button variant="link" size="sm" className="text-xs text-neon-cyan p-0 h-auto" onClick={(e) => { e.stopPropagation(); refreshServers(c.id) }}>Refresh Servers</Button></>}
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

        {/* Alert banners for outage/fire */}
        {powerOutage && (
          <div className="rounded-lg border border-neon-red/40 bg-neon-red/10 p-2 flex items-center gap-2 animate-pulse">
            <Zap className="size-4 text-neon-red" />
            <span className="text-xs font-bold text-neon-red tracking-widest">GRID POWER OUTAGE</span>
            <span className="text-xs text-neon-red tabular-nums ml-auto">{outageTicksRemaining}t remaining</span>
            {generators.filter((g) => g.status === 'running').length > 0 && (
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 font-mono text-xs">
                GENERATORS RUNNING
              </Badge>
            )}
          </div>
        )}
        {fireActive && (
          <div className="rounded-lg border border-neon-orange/40 bg-neon-orange/10 p-2 flex items-center gap-2 animate-pulse">
            <Flame className="size-4 text-neon-orange" />
            <span className="text-xs font-bold text-neon-orange tracking-widest">FIRE IN PROGRESS</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Suppression: {SUPPRESSION_CONFIG[suppressionType].label}
            </span>
          </div>
        )}

        {/* Second row: Contracts, Cooling, Loans, Incidents, Achievements */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3">
          {/* CONTRACTS panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="size-3.5 text-neon-purple" />
              <span className="text-xs font-bold text-neon-purple tracking-widest">CONTRACTS</span>
              {activeContracts.length > 0 && (
                <Badge className="ml-auto bg-neon-purple/20 text-neon-purple border-neon-purple/30 font-mono text-xs">
                  {activeContracts.length} ACTIVE
                </Badge>
              )}
            </div>
            {/* Active contracts */}
            {activeContracts.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2 pb-2 border-b border-border/50">
                {activeContracts.map((contract) => {
                  const tierColor = CONTRACT_TIER_COLORS[contract.def.tier]
                  const isViolating = contract.consecutiveViolations > 0
                  return (
                    <Tooltip key={contract.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`rounded border p-1.5 cursor-help ${
                            isViolating
                              ? 'border-neon-red/40 bg-neon-red/5'
                              : 'border-border/50 bg-card'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate" style={{ color: tierColor }}>
                              {contract.def.company}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {contract.ticksRemaining}t
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs text-neon-green tabular-nums">
                              +${contract.def.revenuePerTick}/t
                            </span>
                            {isViolating && (
                              <span className="text-xs text-neon-red animate-pulse flex items-center gap-0.5">
                                <AlertTriangle className="size-2.5" />
                                SLA {contract.consecutiveViolations}/{contract.def.terminationTicks}
                              </span>
                            )}
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.round((1 - contract.ticksRemaining / contract.def.durationTicks) * 100)}%`,
                                backgroundColor: isViolating ? '#ff4444' : tierColor,
                              }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-60">
                        <p className="font-bold" style={{ color: tierColor }}>{contract.def.company} ({contract.def.tier.toUpperCase()})</p>
                        <p className="text-xs mt-1">{contract.def.description}</p>
                        <p className="text-xs mt-1">Requires: {contract.def.minServers} servers, &lt;{contract.def.maxTemp}°C</p>
                        <p className="text-xs">Earned: ${contract.totalEarned.toFixed(0)} | Penalties: ${contract.totalPenalties.toFixed(0)}</p>
                        <p className="text-xs">Completion bonus: ${contract.def.completionBonus.toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            )}
            {/* Contract offers */}
            {contractOffers.length > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground mb-0.5">Available:</span>
                {contractOffers.map((def, i) => {
                  const tierColor = CONTRACT_TIER_COLORS[def.tier]
                  const activeProductionServers = cabinets
                    .filter((c) => c.environment === 'production' && c.powerStatus)
                    .reduce((sum, c) => sum + c.serverCount, 0)
                  const canAccept = activeContracts.length < 3 &&
                    activeProductionServers >= def.minServers
                  return (
                    <Tooltip key={`${def.type}-${i}`}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acceptContract(i)}
                          disabled={activeContracts.length >= 3}
                          className="justify-between font-mono text-xs transition-all w-full"
                          style={{
                            borderColor: `${tierColor}33`,
                          }}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: tierColor }}
                            />
                            {def.company}
                          </span>
                          <span className="text-neon-green shrink-0">+${def.revenuePerTick}/t</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-60">
                        <p className="font-bold" style={{ color: tierColor }}>{def.company} ({def.tier.toUpperCase()})</p>
                        <p className="text-xs mt-1">{def.description}</p>
                        <p className="text-xs mt-1">Requires: {def.minServers} prod servers, &lt;{def.maxTemp}°C avg temp</p>
                        <p className="text-xs">Duration: {def.durationTicks} ticks | Bonus: ${def.completionBonus.toLocaleString()}</p>
                        <p className="text-xs">Penalty: -${def.penaltyPerTick}/tick if SLA violated</p>
                        {!canAccept && activeContracts.length < 3 && (
                          <p className="text-xs text-neon-red mt-1">Need {def.minServers} online production servers (have {activeProductionServers})</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {cabinets.length < 2
                  ? 'Build at least 2 cabinets to attract tenants.'
                  : 'New offers coming soon...'}
              </p>
            )}
            {activeContracts.length >= 3 && (
              <p className="text-xs text-neon-purple/60 italic mt-1">Max 3 active contracts</p>
            )}
            {completedContracts > 0 && (
              <div className="flex justify-between text-xs mt-2 pt-1.5 border-t border-border/50">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Check className="size-3" />
                  Completed
                </span>
                <span className="text-neon-green tabular-nums">{completedContracts}</span>
              </div>
            )}
          </div>
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

        {/* Third row: Facility, Generators, Tech Tree, Reputation */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3">
          {/* FACILITY panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Building className="size-3.5" style={{ color: suiteConfig.color }} />
              <span className="text-xs font-bold tracking-widest" style={{ color: suiteConfig.color }}>FACILITY</span>
              <Badge
                className="ml-auto font-mono text-xs border"
                style={{
                  backgroundColor: `${suiteConfig.color}20`,
                  color: suiteConfig.color,
                  borderColor: `${suiteConfig.color}40`,
                }}
              >
                {suiteConfig.label.split(' ')[0].toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cabinets</span>
                <span className="text-foreground tabular-nums">{cabinets.length}/{suiteLimits.maxCabinets}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Spines</span>
                <span className="text-foreground tabular-nums">{spineSwitches.length}/{suiteLimits.maxSpines}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Grid</span>
                <span className="text-foreground tabular-nums">{suiteLimits.cols}&times;{suiteLimits.rows}</span>
              </div>
              {/* Suite progression */}
              {nextSuiteConfig && nextTier && (
                <>
                  <div className="border-t border-border my-0.5" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => upgradeSuite(nextTier)}
                        disabled={money < nextSuiteConfig.upgradeCost}
                        className="justify-between font-mono text-xs transition-all"
                        style={{
                          borderColor: `${nextSuiteConfig.color}33`,
                        }}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Building className="size-3" />
                          {nextSuiteConfig.label}
                        </span>
                        <span className="text-muted-foreground">${nextSuiteConfig.upgradeCost.toLocaleString()}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-60">
                      <p className="font-bold" style={{ color: nextSuiteConfig.color }}>{nextSuiteConfig.label}</p>
                      <p className="text-xs mt-1">{nextSuiteConfig.description}</p>
                      <p className="text-xs mt-1">Grid: {nextSuiteConfig.cols}&times;{nextSuiteConfig.rows} ({nextSuiteConfig.maxCabinets} cabinets, {nextSuiteConfig.maxSpines} spines)</p>
                      <p className="text-xs mt-1">All existing equipment is preserved during migration.</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              {/* Show remaining upgrade path */}
              {SUITE_TIER_ORDER.slice(currentTierIdx + 2).length > 0 && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {SUITE_TIER_ORDER.slice(currentTierIdx + 2).map((tier) => {
                    const cfg = SUITE_TIERS[tier]
                    return (
                      <div key={tier} className="flex items-center justify-between text-xs text-muted-foreground/40">
                        <span className="flex items-center gap-1">
                          <Lock className="size-3" />
                          {cfg.label}
                        </span>
                        <span className="tabular-nums">${cfg.upgradeCost.toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {!nextTier && (
                <p className="text-xs italic mt-1" style={{ color: `${suiteConfig.color}80` }}>
                  Maximum facility tier reached.
                </p>
              )}
            </div>
          </div>

          {/* GENERATORS & SUPPRESSION panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="size-3.5 text-neon-orange" />
              <span className="text-xs font-bold text-neon-orange tracking-widest">POWER BACKUP</span>
              {generators.length > 0 && (
                <Badge className="ml-auto bg-neon-orange/20 text-neon-orange border-neon-orange/30 font-mono text-xs">
                  {generators.filter((g) => g.status === 'running').length} RUNNING
                </Badge>
              )}
            </div>
            {/* Active generators */}
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
                        {gen.status === 'running' ? `${gen.fuelRemaining}t fuel` :
                         gen.status === 'cooldown' ? `cooling ${gen.ticksUntilReady}t` : 'STANDBY'}
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
            {/* Buy generators */}
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
                  <TooltipContent side="bottom" className="max-w-52">
                    {opt.description}
                    <br />Capacity: {(opt.powerCapacityW / 1000).toFixed(0)}kW | Fuel: {opt.fuelCapacity} ticks | Cost: ${opt.fuelCostPerTick}/tick
                  </TooltipContent>
                </Tooltip>
              ))}
              {generators.length >= 3 && (
                <p className="text-xs text-neon-orange/60 italic">Max 3 generators</p>
              )}
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
                    <TooltipContent side="bottom" className="max-w-52">
                      {config.description}
                      <br />Effectiveness: {Math.round(config.effectiveness * 100)}%
                      {config.equipmentDamage && <><br /><span className="text-neon-red">Warning: Damages equipment on activation</span></>}
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>

          {/* TECH TREE panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">R&D LAB</span>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {unlockedTech.length}/{TECH_TREE.length}
              </span>
            </div>
            {/* Active research progress */}
            {activeResearch && (() => {
              const tech = TECH_TREE.find((t) => t.id === activeResearch.techId)
              if (!tech) return null
              const progress = 1 - activeResearch.ticksRemaining / tech.researchTicks
              return (
                <div className="mb-2 pb-2 border-b border-border/50">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold" style={{ color: TECH_BRANCH_COLORS[tech.branch] }}>
                      Researching: {tech.label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">{activeResearch.ticksRemaining}t</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: TECH_BRANCH_COLORS[tech.branch] }}
                    />
                  </div>
                </div>
              )
            })()}
            {/* Tech tree by branch */}
            {(['efficiency', 'performance', 'resilience'] as TechBranch[]).map((branch) => (
              <div key={branch} className="mb-2">
                <span className="text-xs font-bold tracking-wider" style={{ color: TECH_BRANCH_COLORS[branch] }}>
                  {branch.toUpperCase()}
                </span>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {TECH_TREE.filter((t) => t.branch === branch).map((tech) => {
                    const isUnlocked = unlockedTech.includes(tech.id)
                    const isResearching = activeResearch?.techId === tech.id
                    const prereqMet = !tech.prereqId || unlockedTech.includes(tech.prereqId)
                    const canResearch = !isUnlocked && !activeResearch && prereqMet && money >= tech.cost
                    return (
                      <Tooltip key={tech.id}>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center justify-between text-xs rounded px-1.5 py-0.5 ${
                            isUnlocked ? 'text-foreground' : isResearching ? 'text-neon-cyan' : prereqMet ? 'text-muted-foreground' : 'text-muted-foreground/40'
                          }`}>
                            <span className="flex items-center gap-1.5 truncate">
                              {isUnlocked ? <Check className="size-3 text-neon-green" /> : !prereqMet ? <Lock className="size-3" /> : <FlaskConical className="size-3" />}
                              {tech.label}
                            </span>
                            {!isUnlocked && !isResearching && prereqMet && (
                              <Button
                                variant="ghost"
                                size="xs"
                                disabled={!canResearch}
                                onClick={() => startResearch(tech.id)}
                                className="text-xs p-0 h-auto ml-1"
                                style={{ color: canResearch ? TECH_BRANCH_COLORS[branch] : undefined }}
                              >
                                ${(tech.cost / 1000).toFixed(0)}k
                              </Button>
                            )}
                            {isResearching && <span className="text-neon-cyan animate-pulse text-xs">...</span>}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-52">
                          <p className="font-bold" style={{ color: TECH_BRANCH_COLORS[branch] }}>{tech.label}</p>
                          <p className="text-xs mt-1">{tech.description}</p>
                          <p className="text-xs mt-1 text-neon-green">{tech.effect}</p>
                          {tech.prereqId && !unlockedTech.includes(tech.prereqId) && (
                            <p className="text-xs mt-1 text-neon-red">Requires: {TECH_TREE.find((t) => t.id === tech.prereqId)?.label}</p>
                          )}
                          <p className="text-xs mt-1">Cost: ${tech.cost.toLocaleString()} | Time: {tech.researchTicks} ticks</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            ))}
            {rdSpent > 0 && (
              <div className="flex justify-between text-xs pt-1.5 border-t border-border/50">
                <span className="text-muted-foreground">Total R&D</span>
                <span className="text-neon-cyan tabular-nums">${rdSpent.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* REPUTATION panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Star className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">REPUTATION</span>
            </div>
            {(() => {
              const tier = getReputationTier(reputationScore)
              return (
                <>
                  <div className="text-center mb-2">
                    <p className="text-3xl font-bold tabular-nums" style={{ color: tier.color }}>
                      {Math.round(reputationScore)}
                    </p>
                    <p className="text-xs font-bold tracking-wider" style={{ color: tier.color }}>
                      {tier.label.toUpperCase()}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${reputationScore}%`, backgroundColor: tier.color }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Contract Bonus</span>
                      <span className={`tabular-nums ${tier.contractBonus >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                        {tier.contractBonus >= 0 ? '+' : ''}{Math.round(tier.contractBonus * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="text-foreground tabular-nums">
                        {totalOperatingTicks > 0 ? Math.round((uptimeTicks / totalOperatingTicks) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Contracts Done</span>
                      <span className="text-neon-green tabular-nums">{completedContracts}</span>
                    </div>
                    {totalRefreshes > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <RefreshCw className="size-3" />
                          HW Refreshes
                        </span>
                        <span className="text-neon-cyan tabular-nums">{totalRefreshes}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      {reputationScore < 25 && 'Only bronze contracts available. Keep SLAs met to improve.'}
                      {reputationScore >= 25 && reputationScore < 50 && 'Silver contracts unlocked. Maintain uptime for gold.'}
                      {reputationScore >= 50 && reputationScore < 75 && 'Gold contracts unlocked. Push for Excellent status.'}
                      {reputationScore >= 75 && 'Premium reputation. Maximum contract bonuses active.'}
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Fourth row: Infrastructure Layout */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3">
          {/* PDU panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Plug className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">PDUs</span>
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
                        // Place PDU at first available edge position
                        const limits = getSuiteLimits(suiteTier)
                        for (let r = 0; r < limits.rows; r++) {
                          for (let c = 0; c < limits.cols; c++) {
                            const occupied = cabinets.some((cab) => cab.col === c && cab.row === r) ||
                              pdus.some((p) => p.col === c && p.row === r)
                            if (!occupied) {
                              placePDU(c, r, i)
                              return
                            }
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
                  <TooltipContent side="bottom" className="max-w-52">
                    {opt.description}
                    <br />Capacity: {opt.maxCapacityKW}kW | Range: {opt.range} tiles
                  </TooltipContent>
                </Tooltip>
              ))}
              {pdus.length >= 6 && (
                <p className="text-xs text-neon-yellow/60 italic">Max 6 PDUs</p>
              )}
            </div>
            {pduOverloaded && (
              <div className="mt-2 pt-2 border-t border-neon-red/30">
                <p className="text-xs text-neon-red font-bold animate-pulse flex items-center gap-1">
                  <AlertTriangle className="size-3" />
                  PDU OVERLOADED — breaker trip risk
                </p>
              </div>
            )}
          </div>

          {/* CABLING panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Cable className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">CABLING</span>
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
                <span className="text-muted-foreground">Messy (untray&apos;d)</span>
                <span className={`tabular-nums ${messyCableCount > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>
                  {messyCableCount}
                </span>
              </div>
              {messyCableCount > 0 && (
                <div className="flex justify-between text-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 text-neon-orange cursor-help">
                        <AlertTriangle className="size-3" />
                        Incident Risk
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-52">
                      Messy cables increase incident risk by {(infraIncidentBonus * 100).toFixed(0)}%.
                      Route cables through trays to reduce risk.
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-neon-orange tabular-nums">+{(infraIncidentBonus * 100).toFixed(0)}%</span>
                </div>
              )}
              {cableRuns.some((c) => c.length > AISLE_CONFIG.maxCableLength) && (
                <div className="flex justify-between text-xs">
                  <span className="text-neon-red flex items-center gap-1">
                    <Info className="size-3" />
                    Long runs
                  </span>
                  <span className="text-neon-red tabular-nums">
                    {cableRuns.filter((c) => c.length > AISLE_CONFIG.maxCableLength).length} degraded
                  </span>
                </div>
              )}
              <div className="border-t border-border/50 my-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => autoRouteCables()}
                    disabled={cabinets.filter((c) => c.hasLeafSwitch).length === 0 || spineSwitches.length === 0}
                    className="justify-between font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Cable className="size-3" />
                      Auto-Route
                    </span>
                    <span className="text-muted-foreground">Free</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-52">
                  Automatically route cables between all leaf and spine switches.
                  Cables near trays are routed through them.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* CABLE TRAYS panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Network className="size-3.5 text-neon-purple" />
              <span className="text-xs font-bold text-neon-purple tracking-widest">CABLE TRAYS</span>
              {cableTrays.length > 0 && (
                <Badge className="ml-auto bg-neon-purple/20 text-neon-purple border-neon-purple/30 font-mono text-xs">
                  {cableTrays.length} PLACED
                </Badge>
              )}
            </div>
            {cableTrays.length > 0 && (
              <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
                {cableTrays.map((tray) => (
                  <div key={tray.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate">
                      Tray ({tray.col},{tray.row})
                    </span>
                    <span className="text-neon-purple tabular-nums">{tray.capacityUnits}u cap</span>
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
                        // Place tray at first available grid position
                        const limits = getSuiteLimits(suiteTier)
                        for (let r = 0; r < limits.rows; r++) {
                          for (let c = 0; c < limits.cols; c++) {
                            const occupied = cableTrays.some((t) => t.col === c && t.row === r)
                            if (!occupied) {
                              placeCableTray(c, r, i)
                              return
                            }
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
                  <TooltipContent side="bottom" className="max-w-52">
                    {opt.description}
                    <br />Capacity: {opt.capacityUnits} cable runs
                  </TooltipContent>
                </Tooltip>
              ))}
              {cableTrays.length >= 20 && (
                <p className="text-xs text-neon-purple/60 italic">Max 20 cable trays</p>
              )}
            </div>
          </div>

          {/* HOT/COLD AISLE panel */}
          <div className="rounded-lg border border-border bg-card p-3 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">AISLES</span>
              {aisleBonus > 0 && (
                <Badge className="ml-auto bg-neon-green/20 text-neon-green border-neon-green/30 font-mono text-xs">
                  -{Math.round(aisleBonus * 100)}% COOLING
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 text-muted-foreground cursor-help">
                      <Info className="size-3" />
                      Aisle Bonus
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-52">
                    Proper hot/cold aisle separation reduces cooling overhead.
                    Align adjacent rows with opposing cabinet facings.
                    Max bonus: {Math.round(AISLE_CONFIG.maxCoolingBonus * 100)}%
                  </TooltipContent>
                </Tooltip>
                <span className={`tabular-nums ${aisleBonus > 0 ? 'text-neon-green' : 'text-muted-foreground'}`}>
                  -{Math.round(aisleBonus * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Row Violations</span>
                <span className={`tabular-nums ${aisleViolations > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>
                  {aisleViolations}
                </span>
              </div>
              {aisleViolations > 0 && (
                <p className="text-xs text-neon-orange/80 flex items-center gap-1">
                  <AlertTriangle className="size-3" />
                  Mixed facings in {aisleViolations} row{aisleViolations > 1 ? 's' : ''} — extra heat generated
                </p>
              )}
              {/* Aisle layout diagram */}
              {cabinets.length > 0 && (
                <div className="border-t border-border/50 pt-2 mt-1">
                  <span className="text-xs text-muted-foreground mb-1 block">Cabinet Facings:</span>
                  <div className="flex flex-col gap-0.5 max-h-20 overflow-y-auto">
                    {cabinets.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          C{c.id.replace('cab-', '')} ({c.col},{c.row})
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => toggleCabinetFacing(c.id)}
                              className={`text-xs p-0 h-auto ${c.facing === 'north' ? 'text-neon-cyan' : 'text-neon-orange'}`}
                            >
                              {c.facing === 'north' ? '↑ N' : '↓ S'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Click to flip facing</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {cabinets.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Place cabinets with consistent facings per row for aisle bonuses.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loan payments in finance summary */}
        {loanPayments > 0 && expenses > 0 && (
          <div className="text-xs text-neon-red/60 text-center">
            Loan payments: -${loanPayments.toFixed(2)}/tick (not included in FINANCE panel above)
          </div>
        )}

        {/* Insurance, DR Drills, Stock, Patents, RFP, Infrastructure Entities, Scenarios, Save/Load */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Insurance Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">INSURANCE</span>
              {insuranceCost > 0 && <Badge variant="outline" className="text-neon-red text-[10px]">-${insuranceCost.toFixed(0)}/t</Badge>}
            </div>
            <div className="space-y-1.5">
              {INSURANCE_OPTIONS.map((opt) => {
                const held = insurancePolicies.includes(opt.type)
                return (
                  <div key={opt.type} className="flex items-center justify-between text-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={held ? 'text-neon-green' : 'text-muted-foreground'}>{opt.label}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{opt.description}</TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="xs"
                      className={`text-[10px] px-1.5 ${held ? 'text-neon-red' : 'text-neon-green'}`}
                      onClick={() => held ? cancelInsurance(opt.type) : buyInsurance(opt.type)}
                    >
                      {held ? 'Cancel' : `$${opt.premiumPerTick}/t`}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* DR Drills Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="size-3.5 text-neon-orange" />
              <span className="text-xs font-bold text-neon-orange tracking-widest">DR DRILLS</span>
              <Badge variant="outline" className="text-[10px]">{drillsPassed}/{drillsCompleted}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs mb-2"
              disabled={drillCooldown > 0 || (!sandboxMode && money < DRILL_CONFIG.cost)}
              onClick={() => runDrill()}
            >
              {drillCooldown > 0 ? `Cooldown: ${drillCooldown}t` : `Run Drill ($${DRILL_CONFIG.cost})`}
            </Button>
            {lastDrillResult && (
              <div className={`text-[10px] space-y-0.5 ${lastDrillResult.passed ? 'text-neon-green' : 'text-neon-red'}`}>
                <div className="font-bold">{lastDrillResult.passed ? 'PASSED' : 'FAILED'} — Score: {lastDrillResult.score}%</div>
                {lastDrillResult.findings.slice(0, 3).map((f, i) => (
                  <div key={i} className="text-muted-foreground">• {f}</div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Price Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">STOCK</span>
              <span className="text-xs font-bold text-neon-yellow">${stockPrice.toFixed(2)}</span>
            </div>
            {/* Mini sparkline */}
            <div className="flex items-end gap-px h-8 mb-2">
              {stockHistory.slice(-30).map((price, i) => {
                const max = Math.max(...stockHistory.slice(-30))
                const min = Math.min(...stockHistory.slice(-30))
                const range = max - min || 1
                const h = Math.max(2, ((price - min) / range) * 28)
                return <div key={i} className="flex-1 bg-neon-yellow/40 rounded-t" style={{ height: `${h}px` }} />
              })}
            </div>
            <div className="space-y-0.5">
              {VALUATION_MILESTONES.map((m) => (
                <div key={m.id} className={`flex items-center justify-between text-[10px] ${valuationMilestonesReached.includes(m.id) ? 'text-neon-green' : 'text-muted-foreground'}`}>
                  <span>{m.label} (${m.targetPrice})</span>
                  {valuationMilestonesReached.includes(m.id) ? <Check className="size-3" /> : <span>${m.reward.toLocaleString()}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Patents Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="size-3.5 text-neon-purple" />
              <span className="text-xs font-bold text-neon-purple tracking-widest">PATENTS</span>
              {patentIncome > 0 && <Badge variant="outline" className="text-neon-green text-[10px]">+${patentIncome.toFixed(0)}/t</Badge>}
            </div>
            <div className="space-y-1">
              {unlockedTech.map((techId) => {
                const tech = TECH_TREE.find((t) => t.id === techId)
                const patented = patents.some((p) => p.techId === techId)
                if (!tech) return null
                return (
                  <div key={techId} className="flex items-center justify-between text-[10px]">
                    <span className={patented ? 'text-neon-green' : 'text-muted-foreground'}>{tech.label}</span>
                    {patented ? (
                      <Badge variant="outline" className="text-neon-green text-[9px]">Patented</Badge>
                    ) : (
                      <Button variant="ghost" size="xs" className="text-[9px] text-neon-purple px-1" onClick={() => patentTech(techId)} disabled={!sandboxMode && money < PATENT_CONFIG.cost}>
                        Patent ${PATENT_CONFIG.cost}
                      </Button>
                    )}
                  </div>
                )
              })}
              {unlockedTech.length === 0 && <p className="text-[10px] text-muted-foreground italic">Research tech to patent it</p>}
            </div>
          </div>

          {/* RFP Bidding Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">RFP BIDS</span>
              <Badge variant="outline" className="text-[10px]">Won: {rfpsWon}</Badge>
            </div>
            {rfpOffers.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No active RFPs. New ones appear periodically.</p>
            ) : (
              <div className="space-y-2">
                {rfpOffers.map((rfp) => (
                  <div key={rfp.id} className="border border-border/50 rounded p-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-foreground font-bold">{rfp.def.company}</span>
                      <span className="text-neon-red">{rfp.bidWindowTicks}t left</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground">vs {rfp.competitorName} (str: {rfp.competitorStrength})</div>
                    <div className="text-[9px] text-neon-green">+${rfp.def.revenuePerTick}/t for {rfp.def.durationTicks}t</div>
                    <Button variant="outline" size="xs" className="w-full text-[10px]" onClick={() => bidOnRFP(rfp.id)}>
                      Place Bid
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infrastructure Entities Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Plug className="size-3.5 text-neon-orange" />
              <span className="text-xs font-bold text-neon-orange tracking-widest">INFRASTRUCTURE</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="text-muted-foreground">
                Busways: {busways.length} | Cross-connects: {crossConnects.length} | In-row: {inRowCoolers.length}
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                      const sl = getSuiteLimits(suiteTier)
                      placeBusway(Math.floor(Math.random() * sl.cols), Math.floor(Math.random() * sl.rows), 0)
                    }} disabled={!sandboxMode && money < BUSWAY_OPTIONS[0].cost}>
                      <Zap className="size-2.5 mr-0.5" />Busway
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{BUSWAY_OPTIONS[0].description} (${BUSWAY_OPTIONS[0].cost})</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                      const sl = getSuiteLimits(suiteTier)
                      placeCrossConnect(Math.floor(Math.random() * sl.cols), Math.floor(Math.random() * sl.rows), 0)
                    }} disabled={!sandboxMode && money < CROSSCONNECT_OPTIONS[0].cost}>
                      <Wifi className="size-2.5 mr-0.5" />Patch
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{CROSSCONNECT_OPTIONS[0].description} (${CROSSCONNECT_OPTIONS[0].cost})</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="xs" className="text-[9px]" onClick={() => {
                      const sl = getSuiteLimits(suiteTier)
                      placeInRowCooling(Math.floor(Math.random() * sl.cols), Math.floor(Math.random() * sl.rows), 0)
                    }} disabled={!sandboxMode && money < INROW_COOLING_OPTIONS[0].cost}>
                      <Snowflake className="size-2.5 mr-0.5" />Cooling
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{INROW_COOLING_OPTIONS[0].description} (${INROW_COOLING_OPTIONS[0].cost})</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Network Topology Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Network className="size-3.5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green tracking-widest">NETWORK</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Links</span><span>{networkTopology.totalLinks}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Healthy</span><span className="text-neon-green">{networkTopology.healthyLinks}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Oversub Ratio</span><span>{networkTopology.oversubscriptionRatio}:1</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg Utilization</span><span className={networkTopology.avgUtilization > 0.8 ? 'text-neon-red' : 'text-neon-green'}>{(networkTopology.avgUtilization * 100).toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Redundancy</span><span>{(networkTopology.redundancyLevel * 100).toFixed(0)}%</span></div>
            </div>
            <Button variant="outline" size="xs" className={`w-full text-[10px] mt-2 ${heatMapVisible ? 'text-neon-red' : ''}`} onClick={() => toggleHeatMap()}>
              <Map className="size-2.5 mr-1" />{heatMapVisible ? 'Hide Heat Map' : 'Show Heat Map'}
            </Button>
          </div>

          {/* Scenarios Panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">SCENARIOS</span>
              <Badge variant="outline" className="text-[10px]">{scenariosCompleted.length}/{SCENARIO_CATALOG.length}</Badge>
            </div>
            {activeScenario ? (
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">{activeScenario.label}</div>
                <div className="text-[10px] text-muted-foreground">{activeScenario.description}</div>
                {activeScenario.objectives.map((obj) => (
                  <div key={obj.id} className={`flex items-center gap-1 text-[10px] ${scenarioProgress[obj.id] ? 'text-neon-green' : 'text-muted-foreground'}`}>
                    {scenarioProgress[obj.id] ? <Check className="size-2.5" /> : <Clock className="size-2.5" />}
                    {obj.description}
                  </div>
                ))}
                <Button variant="ghost" size="xs" className="text-[10px] text-neon-red" onClick={() => abandonScenario()}>Abandon</Button>
              </div>
            ) : (
              <div className="space-y-1">
                {SCENARIO_CATALOG.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-[10px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={scenariosCompleted.includes(s.id) ? 'text-neon-green' : 'text-muted-foreground'}>{s.label}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{s.description}</TooltipContent>
                    </Tooltip>
                    {scenariosCompleted.includes(s.id) ? (
                      <Check className="size-3 text-neon-green" />
                    ) : (
                      <Button variant="ghost" size="xs" className="text-[9px] text-neon-yellow px-1" onClick={() => startScenario(s.id)}>Start</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Staff & HR row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* HIRING panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="size-3.5 text-neon-purple" />
              <span className="text-xs font-bold text-neon-purple tracking-widest">STAFF</span>
              <Badge variant="outline" className="ml-auto text-[10px] font-mono text-neon-purple border-neon-purple/30">
                {staff.length}/{MAX_STAFF_BY_TIER[suiteTier]}
              </Badge>
            </div>
            <div className="space-y-1.5 mb-2">
              <div className="flex gap-1 flex-wrap">
                {STAFF_ROLE_CONFIG.map((cfg) => (
                  <Button
                    key={cfg.role}
                    variant={selectedStaffRole === cfg.role ? 'default' : 'outline'}
                    size="xs"
                    className={`text-[10px] ${selectedStaffRole === cfg.role ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/40' : ''}`}
                    onClick={() => setSelectedStaffRole(cfg.role)}
                  >
                    {cfg.label.split(' ')[0]}
                  </Button>
                ))}
              </div>
              <div className="flex gap-1">
                {([1, 2, 3] as StaffSkillLevel[]).map((lvl) => (
                  <Button
                    key={lvl}
                    variant={selectedSkillLevel === lvl ? 'default' : 'outline'}
                    size="xs"
                    className={`text-[10px] flex-1 ${selectedSkillLevel === lvl ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40' : ''}`}
                    onClick={() => setSelectedSkillLevel(lvl)}
                  >
                    {lvl === 1 ? 'Junior' : lvl === 2 ? 'Mid' : 'Senior'}
                  </Button>
                ))}
              </div>
              {(() => {
                const cfg = STAFF_ROLE_CONFIG.find((c) => c.role === selectedStaffRole)
                if (!cfg) return null
                const salary = +(cfg.baseSalary * cfg.salaryMultiplier[selectedSkillLevel - 1]).toFixed(2)
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between font-mono text-xs border-neon-purple/20 hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple transition-all"
                        disabled={money < cfg.hireCost || staff.length >= MAX_STAFF_BY_TIER[suiteTier]}
                        onClick={() => hireStaff(selectedStaffRole, selectedSkillLevel)}
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="size-3" />
                          Hire {cfg.label}
                        </span>
                        <span className="text-muted-foreground">${cfg.hireCost.toLocaleString()} + ${salary}/t</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-52">
                      <p className="text-xs">{cfg.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cfg.effect}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })()}
            </div>
            {/* Shift pattern selector */}
            <div className="border-t border-border/50 pt-2">
              <div className="flex items-center gap-1 mb-1">
                {shiftPattern === 'day_only' && !((gameHour >= 6 && gameHour < 22)) ? (
                  <Moon className="size-3 text-neon-yellow" />
                ) : (
                  <Sun className="size-3 text-neon-yellow" />
                )}
                <span className="text-[10px] font-bold text-neon-yellow">SHIFT PATTERN</span>
              </div>
              <div className="flex gap-1">
                {(Object.entries(SHIFT_PATTERN_CONFIG) as [ShiftPattern, typeof SHIFT_PATTERN_CONFIG['day_only']][]).map(([pattern, cfg]) => (
                  <Tooltip key={pattern}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={shiftPattern === pattern ? 'default' : 'outline'}
                        size="xs"
                        className={`text-[10px] flex-1 ${shiftPattern === pattern ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40' : ''}`}
                        onClick={() => setShiftPattern(pattern)}
                      >
                        {cfg.label.split(' ')[0]}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-52">
                      <p className="text-xs">{cfg.description}</p>
                      {cfg.costPerTick > 0 && <p className="text-xs text-neon-red mt-1">Overhead: ${cfg.costPerTick}/tick</p>}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* ROSTER panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="size-3.5 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan tracking-widest">ROSTER</span>
              {staffCostPerTick > 0 && <Badge variant="outline" className="ml-auto text-[10px] text-neon-red">-${staffCostPerTick.toFixed(0)}/t</Badge>}
            </div>
            {staff.length === 0 ? (
              <p className="text-xs text-muted-foreground">No staff hired yet.</p>
            ) : (
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {staff.map((s) => {
                  const roleConfig = STAFF_ROLE_CONFIG.find((c) => c.role === s.role)
                  const isTraining = trainingQueue.some((t) => t.staffId === s.id)
                  const isBurntOut = s.fatigueLevel >= 100
                  return (
                    <div key={s.id} className="flex items-center gap-1.5 text-[10px] border border-border/30 rounded px-1.5 py-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`font-bold truncate ${isBurntOut ? 'text-neon-red' : s.onShift ? 'text-neon-green' : 'text-muted-foreground'}`}>
                            {s.name}
                          </span>
                          <Badge variant="outline" className="text-[8px] py-0 px-1 shrink-0">
                            L{s.skillLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span>{roleConfig?.label ?? s.role}</span>
                          <span>·</span>
                          <span>${s.salaryPerTick}/t</span>
                          {isTraining && <><span>·</span><GraduationCap className="size-2.5 text-neon-yellow" /></>}
                          {s.certifications.length > 0 && <><span>·</span><span className="text-neon-green">{s.certifications.length} cert{s.certifications.length > 1 ? 's' : ''}</span></>}
                        </div>
                        {/* Fatigue bar */}
                        <div className="w-full h-1 bg-border/50 rounded-full mt-0.5">
                          <div
                            className={`h-full rounded-full transition-all ${s.fatigueLevel > 80 ? 'bg-neon-red' : s.fatigueLevel > 40 ? 'bg-neon-yellow' : 'bg-neon-green'}`}
                            style={{ width: `${s.fatigueLevel}%` }}
                          />
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="xs" className="text-neon-red/50 hover:text-neon-red p-0 h-5 w-5" onClick={() => fireStaff(s.id)}>
                            <Trash2 className="size-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Fire {s.name}</TooltipContent>
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            )}
            {/* Staff stats */}
            {staff.length > 0 && (
              <div className="border-t border-border/50 pt-1.5 mt-1.5 space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Incidents (staff)</span>
                  <span className="text-neon-green tabular-nums">{staffIncidentsResolved}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Burnouts</span>
                  <span className={`tabular-nums ${staffBurnouts > 0 ? 'text-neon-red' : 'text-neon-green'}`}>{staffBurnouts}</span>
                </div>
              </div>
            )}
          </div>

          {/* TRAINING panel */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="size-3.5 text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow tracking-widest">TRAINING</span>
              {trainingQueue.length > 0 && <Badge variant="outline" className="ml-auto text-[10px] text-neon-yellow border-neon-yellow/30">{trainingQueue.length} active</Badge>}
            </div>
            {staff.length === 0 ? (
              <p className="text-xs text-muted-foreground">Hire staff to enroll in training.</p>
            ) : (
              <div className="space-y-1.5">
                {/* Available certifications */}
                {STAFF_CERT_CONFIG.map((cert) => {
                  // Find eligible staff not already certified and not in training
                  const eligible = staff.filter((s) =>
                    !s.certifications.includes(cert.id) &&
                    !trainingQueue.some((t) => t.staffId === s.id) &&
                    (!cert.requiredRole || s.role === cert.requiredRole)
                  )
                  if (eligible.length === 0) return null
                  return (
                    <div key={cert.id} className="border border-border/30 rounded p-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-neon-yellow">{cert.label}</span>
                        <span className="text-[10px] text-muted-foreground">${cert.cost.toLocaleString()} · {cert.durationTicks}t</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-1">{cert.effect}</p>
                      <div className="flex gap-1 flex-wrap">
                        {eligible.slice(0, 3).map((s) => (
                          <Button
                            key={s.id}
                            variant="outline"
                            size="xs"
                            className="text-[10px] border-neon-yellow/20 hover:border-neon-yellow/50 hover:bg-neon-yellow/10"
                            disabled={money < cert.cost}
                            onClick={() => startTraining(s.id, cert.id)}
                          >
                            {s.name.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {/* Active training progress */}
                {trainingQueue.length > 0 && (
                  <div className="border-t border-border/50 pt-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground">IN PROGRESS</span>
                    {trainingQueue.map((t) => {
                      const s = staff.find((s) => s.id === t.staffId)
                      const cert = STAFF_CERT_CONFIG.find((c) => c.id === t.certification)
                      const totalTicks = cert?.durationTicks ?? 1
                      const progress = ((totalTicks - t.ticksRemaining) / totalTicks) * 100
                      return (
                        <div key={`${t.staffId}-${t.certification}`} className="flex items-center gap-1 text-[10px] mt-1">
                          <span className="text-muted-foreground truncate">{s?.name?.split(' ')[0]} → {cert?.label}</span>
                          <div className="flex-1 h-1 bg-border/50 rounded-full">
                            <div className="h-full bg-neon-yellow rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-neon-yellow tabular-nums">{t.ticksRemaining}t</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save/Load & Sandbox bar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" className="text-[10px] gap-1" onClick={() => saveGame()}>
              <Save className="size-3" />Save
            </Button>
            <Button variant="outline" size="xs" className="text-[10px] gap-1" onClick={() => loadGame()}>
              <Upload className="size-3" />Load
            </Button>
            <Button variant="outline" size="xs" className="text-[10px] gap-1 text-neon-red" onClick={() => { if (confirm('Reset all progress?')) resetGame() }}>
              <RotateCw className="size-3" />Reset
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={sandboxMode ? 'default' : 'outline'}
              size="xs"
              className={`text-[10px] gap-1 ${sandboxMode ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40' : ''}`}
              onClick={() => toggleSandboxMode()}
            >
              <Play className="size-3" />{sandboxMode ? 'SANDBOX ON' : 'Sandbox'}
            </Button>
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
