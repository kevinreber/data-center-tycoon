import { useGameStore, SUITE_TIERS, DEPRECIATION, SIM, POWER_DRAW, TRAFFIC, MAX_SERVERS_PER_CABINET } from '@/stores/gameStore'
import type { HistoryPoint } from '@/stores/gameStore'
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle, Activity, Server, Thermometer, DollarSign } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ── Helpers ─────────────────────────────────────────────────────

/** Compute a simple linear trend from history points. Returns per-tick slope. */
function trend(history: HistoryPoint[], key: keyof Omit<HistoryPoint, 'tick'>): number {
  if (history.length < 2) return 0
  const n = history.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += history[i][key]
    sumXY += i * history[i][key]
    sumX2 += i * i
  }
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

/** Estimate how many ticks until a metric exceeds a threshold, based on current value + trend. */
function ticksUntilThreshold(current: number, slope: number, threshold: number): number | null {
  if (slope <= 0) return null // not trending toward threshold
  if (current >= threshold) return 0
  return Math.ceil((threshold - current) / slope)
}

/** Render a mini ASCII-style sparkline from history values */
function Sparkline({ history, dataKey, color }: { history: HistoryPoint[]; dataKey: keyof Omit<HistoryPoint, 'tick'>; color: string }) {
  if (history.length < 2) return <span className="text-[10px] text-muted-foreground">No data</span>

  const values = history.map(h => h[dataKey])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 120
  const height = 24
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

/** Trend arrow component */
function TrendArrow({ slope, unit = '' }: { slope: number; unit?: string }) {
  if (Math.abs(slope) < 0.01) return <Minus className="size-3 text-muted-foreground" />
  const positive = slope > 0
  return (
    <span className={`flex items-center gap-0.5 text-[10px] ${positive ? 'text-neon-green' : 'text-neon-red'}`}>
      {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {Math.abs(slope).toFixed(1)}{unit}/t
    </span>
  )
}

/** Utilization bar with color coding */
function UtilBar({ value, max, label, unit = '', warn = 0.8 }: { value: number; max: number; label: string; unit?: string; warn?: number }) {
  const pct = max > 0 ? value / max : 0
  const overWarn = pct >= warn
  const barColor = pct >= 0.95 ? '#ff4444' : overWarn ? '#ffaa00' : '#00ff88'

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums" style={{ color: barColor }}>
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{unit} / {max}{unit}
          <span className="text-muted-foreground ml-1">({(pct * 100).toFixed(0)}%)</span>
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct * 100, 100)}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────

export function CapacityPanel() {
  const {
    cabinets, spineSwitches, suiteTier, money, revenue, expenses,
    totalPower, coolingPower, avgHeat, pue, capacityHistory,
    contractRevenue, contractPenalties, loanPayments,
    coolingType, trafficStats,
  } = useGameStore()

  const suiteConfig = SUITE_TIERS[suiteTier]

  // ── Current metrics ──

  const totalServers = cabinets.reduce((s, c) => s + c.serverCount, 0)
  const maxServers = suiteConfig.maxCabinets * MAX_SERVERS_PER_CABINET
  const activeSpines = spineSwitches.filter(s => s.powerStatus).length

  const totalPowerKW = (totalPower + coolingPower) / 1000
  // Rough capacity estimate: max possible power if all slots filled
  const maxPowerKW = (
    suiteConfig.maxCabinets * MAX_SERVERS_PER_CABINET * POWER_DRAW.server +
    suiteConfig.maxCabinets * POWER_DRAW.leaf_switch +
    suiteConfig.maxSpines * POWER_DRAW.spine_switch
  ) / 1000 * 1.5 // ~1.5x for cooling overhead

  const maxCoolingTemp = coolingType === 'water' ? 3.5 : 2.0
  const coolingHeadroom = Math.max(0, SIM.throttleTemp - avgHeat)

  // Traffic capacity
  const totalBandwidth = trafficStats?.totalBandwidthGbps ?? 0
  const totalCapacity = trafficStats?.totalCapacityGbps ?? (activeSpines * cabinets.filter(c => c.hasLeafSwitch && c.powerStatus).length * TRAFFIC.linkCapacityGbps)

  // ── Trends from history ──

  const history = capacityHistory
  const heatTrend = trend(history, 'heat')
  const revenueTrend = trend(history, 'revenue')
  const moneyTrend = trend(history, 'money')

  // ── Projections ──

  const netIncome = revenue + contractRevenue - expenses - loanPayments - contractPenalties
  const ticksUntilBroke = netIncome < 0 ? Math.ceil(money / Math.abs(netIncome)) : null
  const ticksUntilThrottle = ticksUntilThreshold(avgHeat, heatTrend, SIM.throttleTemp)
  const ticksUntilCritical = ticksUntilThreshold(avgHeat, heatTrend, SIM.criticalTemp)

  // ── Server lifespan analysis ──

  const serverCabs = cabinets.filter(c => c.serverCount > 0)
  const avgAge = serverCabs.length > 0
    ? serverCabs.reduce((s, c) => s + c.serverAge, 0) / serverCabs.length
    : 0
  const oldestAge = serverCabs.length > 0
    ? Math.max(...serverCabs.map(c => c.serverAge))
    : 0
  const cabsNeedingRefresh = serverCabs.filter(c =>
    c.serverAge / DEPRECIATION.serverLifespanTicks > 0.7
  ).length
  const cabsDeprecating = serverCabs.filter(c =>
    c.serverAge / DEPRECIATION.serverLifespanTicks > DEPRECIATION.revenueDecayStart
  ).length

  // ── Alerts ──

  const alerts: { message: string; severity: 'warning' | 'critical' }[] = []

  if (cabinets.length / suiteConfig.maxCabinets >= 0.8) {
    alerts.push({ message: `Cabinet space at ${(cabinets.length / suiteConfig.maxCabinets * 100).toFixed(0)}%`, severity: cabinets.length >= suiteConfig.maxCabinets ? 'critical' : 'warning' })
  }
  if (avgHeat >= SIM.throttleTemp) {
    alerts.push({ message: `Thermal throttling active (${avgHeat}°C)`, severity: 'critical' })
  } else if (avgHeat >= SIM.throttleTemp * 0.85) {
    alerts.push({ message: `Temperature approaching throttle (${avgHeat}°C)`, severity: 'warning' })
  }
  if (totalCapacity > 0 && totalBandwidth / totalCapacity >= 0.8) {
    alerts.push({ message: `Network at ${(totalBandwidth / totalCapacity * 100).toFixed(0)}% capacity`, severity: totalBandwidth / totalCapacity >= 0.95 ? 'critical' : 'warning' })
  }
  if (ticksUntilBroke !== null && ticksUntilBroke < 50) {
    alerts.push({ message: `Cash runway: ${ticksUntilBroke} ticks`, severity: ticksUntilBroke < 20 ? 'critical' : 'warning' })
  }
  if (cabsNeedingRefresh > 0) {
    alerts.push({ message: `${cabsNeedingRefresh} cabinet(s) need server refresh soon`, severity: 'warning' })
  }
  if (pue > 2.0) {
    alerts.push({ message: `Poor PUE: ${pue} (target < 1.6)`, severity: 'warning' })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-3 text-neon-orange" />
            <span className="text-xs font-bold text-neon-orange">ALERTS</span>
          </div>
          <div className="flex flex-col gap-1">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`text-[11px] px-2 py-1 rounded border ${
                  a.severity === 'critical'
                    ? 'border-red-500/40 bg-red-500/10 text-neon-red'
                    : 'border-yellow-500/40 bg-yellow-500/10 text-neon-orange'
                }`}
              >
                {a.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Utilization Bars */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">UTILIZATION</span>
        </div>
        <div className="flex flex-col gap-2">
          <UtilBar label="Cabinets" value={cabinets.length} max={suiteConfig.maxCabinets} />
          <UtilBar label="Servers" value={totalServers} max={maxServers} />
          <UtilBar label="Spines" value={spineSwitches.length} max={suiteConfig.maxSpines} />
          <UtilBar label="Power" value={+totalPowerKW.toFixed(1)} max={+maxPowerKW.toFixed(1)} unit="kW" />
          {totalCapacity > 0 && (
            <UtilBar label="Bandwidth" value={+totalBandwidth.toFixed(1)} max={+totalCapacity.toFixed(1)} unit=" Gbps" />
          )}
        </div>
      </div>

      {/* Thermal & Efficiency */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="size-3 text-neon-orange" />
          <span className="text-xs font-bold text-neon-orange">THERMAL & EFFICIENCY</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Avg Temperature</span>
            <span className="flex items-center gap-1.5">
              <TrendArrow slope={heatTrend} unit="°C" />
              <span className={`tabular-nums ${avgHeat >= SIM.throttleTemp ? 'text-neon-red' : avgHeat >= SIM.throttleTemp * 0.85 ? 'text-neon-orange' : 'text-neon-green'}`}>
                {avgHeat}°C
              </span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cooling Headroom</span>
            <span className={`tabular-nums ${coolingHeadroom < 10 ? 'text-neon-red' : coolingHeadroom < 20 ? 'text-neon-orange' : 'text-neon-green'}`}>
              {coolingHeadroom.toFixed(1)}°C
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cooling Type</span>
            <span className="text-muted-foreground">{coolingType === 'water' ? 'Water' : 'Air'} ({maxCoolingTemp}°C/t)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">PUE</span>
            <span className={`tabular-nums ${pue > 2.0 ? 'text-neon-red' : pue > 1.6 ? 'text-neon-orange' : 'text-neon-green'}`}>
              {pue || '—'}
            </span>
          </div>
          {ticksUntilThrottle !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Est. Throttle In</span>
              <span className="text-neon-orange tabular-nums">{ticksUntilThrottle} ticks</span>
            </div>
          )}
          {ticksUntilCritical !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Est. Critical In</span>
              <span className="text-neon-red tabular-nums">{ticksUntilCritical} ticks</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Runway */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="size-3 text-neon-green" />
          <span className="text-xs font-bold text-neon-green">FINANCIAL OUTLOOK</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Balance</span>
            <span className="flex items-center gap-1.5">
              <TrendArrow slope={moneyTrend} unit="$" />
              <span className={`tabular-nums ${money < 5000 ? 'text-neon-red' : 'text-neon-green'}`}>
                ${money.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Net Income / tick</span>
            <span className={`tabular-nums ${netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {netIncome >= 0 ? '+' : ''}${netIncome.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Revenue Trend</span>
            <TrendArrow slope={revenueTrend} unit="$" />
          </div>
          {ticksUntilBroke !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cash Runway</span>
              <span className={`tabular-nums ${ticksUntilBroke < 20 ? 'text-neon-red' : 'text-neon-orange'}`}>
                {ticksUntilBroke} ticks
              </span>
            </div>
          )}
          {ticksUntilBroke === null && netIncome >= 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cash Runway</span>
              <span className="text-neon-green">Profitable</span>
            </div>
          )}
        </div>
      </div>

      {/* Server Lifespan */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Server className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">SERVER LIFESPAN</span>
        </div>
        {serverCabs.length === 0 ? (
          <p className="text-[10px] text-muted-foreground">No servers deployed.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Average Age</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="tabular-nums text-muted-foreground cursor-help">
                    {Math.round(avgAge)} / {DEPRECIATION.serverLifespanTicks} ticks
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{((avgAge / DEPRECIATION.serverLifespanTicks) * 100).toFixed(0)}% of lifespan</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Oldest Cabinet</span>
              <span className={`tabular-nums ${oldestAge / DEPRECIATION.serverLifespanTicks > 0.7 ? 'text-neon-orange' : 'text-muted-foreground'}`}>
                {oldestAge} ticks ({((oldestAge / DEPRECIATION.serverLifespanTicks) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Depreciating</span>
              <span className={`tabular-nums ${cabsDeprecating > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>
                {cabsDeprecating} cabinet(s)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Need Refresh (&gt;70%)</span>
              <span className={`tabular-nums ${cabsNeedingRefresh > 0 ? 'text-neon-red' : 'text-neon-green'}`}>
                {cabsNeedingRefresh} cabinet(s)
              </span>
            </div>
            {cabsNeedingRefresh > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Refresh Cost Est.</span>
                <span className="tabular-nums text-neon-orange">
                  ${(cabsNeedingRefresh * DEPRECIATION.refreshCost).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historical Sparklines */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">TRENDS</span>
          {history.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
              Last {history.length} ticks
            </span>
          )}
        </div>
        {history.length < 2 ? (
          <p className="text-[10px] text-muted-foreground">Collecting data... (need 2+ ticks)</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>Revenue</span>
                <span className="text-neon-green tabular-nums">${history[history.length - 1].revenue.toFixed(0)}/t</span>
              </div>
              <Sparkline history={history} dataKey="revenue" color="#00ff88" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>Power (W)</span>
                <span className="text-neon-orange tabular-nums">{history[history.length - 1].power}W</span>
              </div>
              <Sparkline history={history} dataKey="power" color="#ff6644" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>Temp (°C)</span>
                <span className="text-neon-orange tabular-nums">{history[history.length - 1].heat}°C</span>
              </div>
              <Sparkline history={history} dataKey="heat" color="#ffaa00" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>Balance ($)</span>
                <span className="text-neon-green tabular-nums">${history[history.length - 1].money.toLocaleString()}</span>
              </div>
              <Sparkline history={history} dataKey="money" color="#00aaff" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
