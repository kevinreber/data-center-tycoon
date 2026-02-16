import { useGameStore, SIM, LOAN_OPTIONS, POWER_MARKET, ENVIRONMENT_CONFIG, INSURANCE_OPTIONS, VALUATION_MILESTONES } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Zap, Shield, Landmark, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function FinancePanel() {
  const {
    cabinets, revenue, expenses, powerCost, coolingCost, mgmtBonus,
    contractRevenue, contractPenalties, zoneBonusRevenue,
    loanPayments, loans, takeLoan,
    generatorFuelCost,
    powerPriceMultiplier, powerPriceSpikeActive,
    insurancePolicies, insuranceCost, buyInsurance, cancelInsurance,
    stockPrice, stockHistory, valuationMilestonesReached,
  } = useGameStore()

  const activeServers = cabinets.filter((c) => c.powerStatus).reduce((sum, c) => sum + c.serverCount, 0)
  const throttledCount = cabinets.filter((c) => c.powerStatus && c.heatLevel >= SIM.throttleTemp).reduce((sum, c) => sum + c.serverCount, 0)
  const netIncome = revenue + contractRevenue - expenses - loanPayments - contractPenalties

  return (
    <div className="flex flex-col gap-4">
      {/* Revenue & Expenses */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-muted-foreground">INCOME / EXPENSES</span>
          <span className="text-xs text-muted-foreground ml-auto">/tick</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neon-green">Revenue</span>
            <span className="text-neon-green tabular-nums">+${revenue.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground ml-3">Servers ({activeServers})</span>
            <span className="text-muted-foreground tabular-nums">${(activeServers * SIM.revenuePerServer).toFixed(0)}</span>
          </div>
          {throttledCount > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-neon-red ml-3">Throttled ({throttledCount})</span>
              <span className="text-neon-red tabular-nums">-50%</span>
            </div>
          )}
          {contractRevenue > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground ml-3">Contracts</span>
              <span className="text-neon-green tabular-nums">+${contractRevenue.toFixed(0)}</span>
            </div>
          )}
          {zoneBonusRevenue > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-neon-cyan ml-3">Zone Bonuses</span>
              <span className="text-neon-cyan tabular-nums">+${zoneBonusRevenue.toFixed(0)}</span>
            </div>
          )}
          <div className="border-t border-border my-0.5" />
          <div className="flex justify-between text-xs">
            <span className="text-neon-red flex items-center gap-1"><TrendingDown className="size-3" />Expenses</span>
            <span className="text-neon-red tabular-nums">-${expenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground ml-3">Power</span>
            <span className="text-muted-foreground tabular-nums">${powerCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground ml-3">Cooling</span>
            <span className="text-muted-foreground tabular-nums">${coolingCost.toFixed(2)}</span>
          </div>
          {loanPayments > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground ml-3">Loans</span>
              <span className="text-muted-foreground tabular-nums">${loanPayments.toFixed(2)}</span>
            </div>
          )}
          {contractPenalties > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-neon-red ml-3">SLA Penalties</span>
              <span className="text-neon-red tabular-nums">${contractPenalties.toFixed(0)}</span>
            </div>
          )}
          {generatorFuelCost > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground ml-3">Generator Fuel</span>
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
              <TooltipContent side="right" className="max-w-52">
                Electricity spot price fluctuates. Base: ${POWER_MARKET.baseCost}/kW
              </TooltipContent>
            </Tooltip>
            <span className={`tabular-nums ${
              powerPriceMultiplier > 1.3 ? 'text-neon-red' : powerPriceMultiplier < 0.8 ? 'text-neon-green' : 'text-foreground'
            }`}>
              {Math.round(powerPriceMultiplier * 100)}%{powerPriceSpikeActive ? ' SPIKE' : ''}
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
          <div className="border-t border-border my-0.5" />
          <div className="flex justify-between text-xs font-bold">
            <span className={netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}>Net</span>
            <span className={`tabular-nums ${netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {netIncome >= 0 ? '+' : ''}{netIncome.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Loans */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Landmark className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow tracking-widest">LOANS</span>
          {loans.length > 0 && (
            <span className="ml-auto text-xs text-neon-red tabular-nums">-{loanPayments.toFixed(2)}/t</span>
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
              <TooltipContent side="right" className="max-w-52">
                Borrow ${opt.principal.toLocaleString()} at {(opt.interestRate * 100).toFixed(2)}%/tick over {opt.termTicks} ticks.
              </TooltipContent>
            </Tooltip>
          ))}
          {loans.length >= 3 && <p className="text-xs text-neon-red/60 italic">Max 3 active loans</p>}
        </div>
      </div>

      {/* Stock Price */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow tracking-widest">STOCK</span>
          <span className="text-xs font-bold text-neon-yellow ml-auto">${stockPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-end gap-px h-8 mb-2">
          {stockHistory.slice(-30).map((price, i) => {
            const slice = stockHistory.slice(-30)
            const max = Math.max(...slice)
            const min = Math.min(...slice)
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

      {/* Insurance */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan tracking-widest">INSURANCE</span>
          {insuranceCost > 0 && <Badge variant="outline" className="text-neon-red text-[10px] ml-auto">-${insuranceCost.toFixed(0)}/t</Badge>}
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
                  <TooltipContent side="right">{opt.description}</TooltipContent>
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
    </div>
  )
}
