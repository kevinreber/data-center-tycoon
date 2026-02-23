import { useState } from 'react'
import { useGameStore, REGION_CATALOG } from '@/stores/gameStore'
import type { RegionId } from '@/stores/types'
import { MapPin, Thermometer, Zap, Globe, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Curated starter regions with diverse gameplay characteristics
const STARTER_REGIONS: { id: RegionId; tagline: string; difficulty: string; diffColor: string }[] = [
  { id: 'ashburn', tagline: 'Best connectivity, balanced costs', difficulty: 'Easy', diffColor: 'text-neon-green' },
  { id: 'nordics', tagline: 'Arctic cooling, cheap renewables', difficulty: 'Easy', diffColor: 'text-neon-green' },
  { id: 'dallas', tagline: 'Cheapest power, tornado risk', difficulty: 'Medium', diffColor: 'text-neon-yellow' },
  { id: 'london', tagline: 'Financial hub, premium market', difficulty: 'Medium', diffColor: 'text-neon-yellow' },
  { id: 'singapore', tagline: 'Asia-Pacific hub, extreme heat', difficulty: 'Hard', diffColor: 'text-neon-red' },
]

function formatCooling(efficiency: number): string {
  if (efficiency <= -5) return 'Excellent'
  if (efficiency <= -1) return 'Good'
  if (efficiency <= 3) return 'Moderate'
  if (efficiency <= 10) return 'Poor'
  return 'Extreme heat'
}

function coolingColor(efficiency: number): string {
  if (efficiency <= -5) return 'text-neon-cyan'
  if (efficiency <= -1) return 'text-neon-green'
  if (efficiency <= 3) return 'text-muted-foreground'
  if (efficiency <= 10) return 'text-neon-orange'
  return 'text-neon-red'
}

function topRisk(disaster: { earthquakeRisk: number; floodRisk: number; hurricaneRisk: number; heatwaveRisk: number; gridInstability: number }): string {
  const risks = [
    { name: 'Earthquake', val: disaster.earthquakeRisk },
    { name: 'Flood', val: disaster.floodRisk },
    { name: 'Hurricane', val: disaster.hurricaneRisk },
    { name: 'Heatwave', val: disaster.heatwaveRisk },
    { name: 'Grid failure', val: disaster.gridInstability },
  ]
  const worst = risks.sort((a, b) => b.val - a.val)[0]
  if (worst.val < 0.15) return 'Low risk'
  return worst.name
}

export function RegionSelectModal() {
  const showRegionSelect = useGameStore((s) => s.showRegionSelect)
  const selectHqRegion = useGameStore((s) => s.selectHqRegion)
  const [selected, setSelected] = useState<RegionId>('ashburn')

  if (!showRegionSelect) return null

  const selectedRegion = REGION_CATALOG.find((r) => r.id === selected)!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-neon-cyan/30 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-lg font-bold tracking-wider text-neon-cyan font-mono flex items-center justify-center gap-2">
            <MapPin className="size-4" />
            CHOOSE YOUR REGION
          </h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Where will you build your data center empire?
          </p>
        </div>

        <div className="flex gap-4">
          {/* Region list */}
          <div className="flex flex-col gap-1.5 w-[220px] shrink-0">
            {STARTER_REGIONS.map((sr) => {
              const region = REGION_CATALOG.find((r) => r.id === sr.id)!
              const isSelected = selected === sr.id
              return (
                <button
                  key={sr.id}
                  onClick={() => setSelected(sr.id)}
                  className={`text-left rounded-lg border p-2 transition-all font-mono ${
                    isSelected
                      ? 'border-neon-cyan/60 bg-neon-cyan/10'
                      : 'border-border/40 bg-background/50 hover:border-neon-cyan/30 hover:bg-neon-cyan/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-neon-cyan' : 'text-foreground'}`}>
                      {region.name.split(' (')[0].split(' /')[0]}
                    </span>
                    <span className={`text-[9px] ${sr.diffColor}`}>{sr.difficulty}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{sr.tagline}</p>
                </button>
              )
            })}
          </div>

          {/* Region details */}
          <div className="flex-1 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-neon-cyan font-mono">{selectedRegion.name}</h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-1 leading-relaxed">
                {selectedRegion.description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                <Zap className="size-3 text-neon-yellow shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono">Power Cost</p>
                  <p className="text-xs font-bold font-mono text-foreground">
                    {selectedRegion.profile.powerCostMultiplier}x
                    <span className="text-[9px] font-normal text-muted-foreground ml-1">
                      {selectedRegion.profile.powerCostMultiplier <= 0.7 ? '(cheap)' : selectedRegion.profile.powerCostMultiplier >= 1.3 ? '(expensive)' : '(moderate)'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Thermometer className="size-3 text-neon-red shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono">Cooling</p>
                  <p className={`text-xs font-bold font-mono ${coolingColor(selectedRegion.profile.coolingEfficiency)}`}>
                    {formatCooling(selectedRegion.profile.coolingEfficiency)}
                    <span className="text-[9px] font-normal text-muted-foreground ml-1">
                      ({selectedRegion.profile.coolingEfficiency > 0 ? '+' : ''}{selectedRegion.profile.coolingEfficiency}°C)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Globe className="size-3 text-neon-cyan shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono">Connectivity</p>
                  <p className="text-xs font-bold font-mono text-foreground">
                    {Math.round(selectedRegion.profile.networkConnectivity * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <AlertTriangle className="size-3 text-neon-orange shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-mono">Top Risk</p>
                  <p className="text-xs font-bold font-mono text-foreground">
                    {topRisk(selectedRegion.disasterProfile)}
                  </p>
                </div>
              </div>
            </div>

            {/* Demand bars */}
            <div className="mt-3 pt-2 border-t border-neon-cyan/10">
              <p className="text-[9px] text-muted-foreground font-mono mb-1.5">Customer Demand</p>
              <div className="space-y-1">
                {(Object.entries(selectedRegion.demandProfile) as [string, number][]).map(([type, val]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-muted-foreground w-16 shrink-0 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon-cyan/60 rounded-full"
                        style={{ width: `${val * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground w-6 text-right">
                      {Math.round(val * 100)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted-foreground">
            Region affects power costs, cooling, demand, and disaster risks from the start.
            <br />
            You can expand to other regions later via multi-site expansion.
          </p>
          <Button
            onClick={() => selectHqRegion(selected)}
            className="bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 font-mono text-sm px-6"
          >
            Build Here
          </Button>
        </div>
      </div>
    </div>
  )
}
