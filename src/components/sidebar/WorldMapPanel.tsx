import { useState } from 'react'
import { useGameStore, REGION_CATALOG, SITE_TYPE_CONFIG, REGION_RESEARCH_COST, MAX_SITES, MULTI_SITE_GATE } from '@/stores/gameStore'
import type { RegionId, SiteType, Region } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, MapPin, Search, Building, Zap, Thermometer, Wifi, DollarSign, ArrowRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const CONTINENT_COLORS: Record<string, string> = {
  north_america: '#00ff88',
  south_america: '#44cc88',
  europe: '#00aaff',
  asia_pacific: '#ff66ff',
  middle_east_africa: '#ffaa00',
}

const CONTINENT_LABELS: Record<string, string> = {
  north_america: 'North America',
  south_america: 'South America',
  europe: 'Europe',
  asia_pacific: 'Asia-Pacific',
  middle_east_africa: 'Middle East & Africa',
}

const SITE_TYPE_OPTIONS: SiteType[] = ['edge_pop', 'colocation', 'hyperscale', 'network_hub', 'disaster_recovery']

function RegionDot({ region, researched, hasSite, onClick }: {
  region: Region
  researched: boolean
  hasSite: boolean
  onClick: () => void
}) {
  const color = hasSite ? '#00ff88' : researched ? CONTINENT_COLORS[region.continent] : '#556677'
  const pulseClass = hasSite ? 'animate-pulse' : ''

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {/* Glow effect */}
      <circle
        cx={region.coordinates.x}
        cy={region.coordinates.y}
        r={hasSite ? 8 : 5}
        fill={color}
        opacity={0.2}
        className={pulseClass}
      />
      {/* Core dot */}
      <circle
        cx={region.coordinates.x}
        cy={region.coordinates.y}
        r={hasSite ? 4 : 3}
        fill={color}
        stroke={color}
        strokeWidth={1}
        opacity={researched || hasSite ? 1 : 0.5}
      />
      {/* Label */}
      <text
        x={region.coordinates.x}
        y={region.coordinates.y - 10}
        textAnchor="middle"
        fill={researched || hasSite ? '#ccddee' : '#445566'}
        fontSize="8"
        fontFamily="monospace"
      >
        {region.name.split('(')[0].trim().split('/')[0].trim()}
      </text>
    </g>
  )
}

function WorldMapSVG({ onRegionClick, researchedRegions, sites }: {
  onRegionClick: (regionId: RegionId) => void
  researchedRegions: RegionId[]
  sites: { regionId: RegionId }[]
}) {
  const siteRegions = new Set(sites.map((s) => s.regionId))

  return (
    <svg
      viewBox="0 0 1000 500"
      className="w-full h-auto border border-border rounded bg-[#0a0f14]"
      style={{ maxHeight: '220px' }}
    >
      {/* Grid lines for terminal aesthetic */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`vg-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={500} stroke="#112233" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`hg-${i}`} x1={0} y1={i * 50} x2={1000} y2={i * 50} stroke="#112233" strokeWidth={0.5} />
      ))}
      {/* Simplified continent outlines (neon wireframe style) */}
      {/* North America */}
      <path d="M120,80 L280,80 L300,140 L280,200 L240,240 L190,250 L160,230 L130,200 L110,150 Z" fill="none" stroke="#1a3322" strokeWidth={1} />
      {/* South America */}
      <path d="M250,270 L340,260 L360,300 L350,370 L320,400 L280,390 L260,350 L250,300 Z" fill="none" stroke="#1a3322" strokeWidth={1} />
      {/* Europe */}
      <path d="M450,100 L540,90 L560,130 L540,180 L500,190 L460,180 L440,140 Z" fill="none" stroke="#1a2233" strokeWidth={1} />
      {/* Africa */}
      <path d="M460,210 L560,200 L580,280 L560,380 L520,410 L480,390 L460,320 L450,260 Z" fill="none" stroke="#33221a" strokeWidth={1} />
      {/* Asia */}
      <path d="M570,80 L780,70 L840,140 L830,220 L760,260 L680,280 L620,250 L580,200 L560,140 Z" fill="none" stroke="#2a1a33" strokeWidth={1} />
      {/* Australia/Oceania */}
      <path d="M740,320 L800,310 L820,340 L800,370 L750,370 L730,350 Z" fill="none" stroke="#1a2233" strokeWidth={1} />
      {/* Equator line */}
      <line x1={0} y1={280} x2={1000} y2={280} stroke="#223344" strokeWidth={0.5} strokeDasharray="4,4" />
      <text x={960} y={275} fill="#334455" fontSize="7" fontFamily="monospace" textAnchor="end">EQ</text>
      {/* Region dots */}
      {REGION_CATALOG.map((region) => (
        <RegionDot
          key={region.id}
          region={region}
          researched={researchedRegions.includes(region.id)}
          hasSite={siteRegions.has(region.id)}
          onClick={() => onRegionClick(region.id)}
        />
      ))}
    </svg>
  )
}

function RegionDetail({ region, researched, site, onResearch, onPurchase, money }: {
  region: Region
  researched: boolean
  site: { id: string; type: SiteType; operational: boolean; constructionTicksRemaining: number; cabinets: number; servers: number; revenue: number; expenses: number } | null
  onResearch: () => void
  onPurchase: (siteType: SiteType, name: string) => void
  money: number
}) {
  const [selectedType, setSelectedType] = useState<SiteType>('edge_pop')
  const continentColor = CONTINENT_COLORS[region.continent]

  if (!researched) {
    return (
      <div className="border border-border rounded p-3 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="size-3" style={{ color: continentColor }} />
          <span className="text-xs font-bold" style={{ color: continentColor }}>{region.name}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Region not yet scouted. Research to reveal full profile.</p>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs font-mono"
          disabled={money < REGION_RESEARCH_COST}
          onClick={onResearch}
        >
          <Search className="size-3 mr-1" />
          RESEARCH — ${REGION_RESEARCH_COST.toLocaleString()}
        </Button>
      </div>
    )
  }

  const p = region.profile

  return (
    <div className="border border-border rounded p-3 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="size-3" style={{ color: continentColor }} />
        <span className="text-xs font-bold" style={{ color: continentColor }}>{region.name}</span>
        <Badge className="ml-auto text-[10px] font-mono border" style={{ backgroundColor: `${continentColor}20`, color: continentColor, borderColor: `${continentColor}40` }}>
          {CONTINENT_LABELS[region.continent]}
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{region.description}</p>

      {/* Region Profile Stats */}
      <div className="grid grid-cols-2 gap-1 mb-2 text-[10px]">
        <div className="flex items-center gap-1">
          <Zap className="size-2.5 text-neon-orange" />
          <span className="text-muted-foreground">Power:</span>
          <span className={p.powerCostMultiplier <= 0.8 ? 'text-neon-green' : p.powerCostMultiplier >= 1.3 ? 'text-red-400' : 'text-foreground'}>
            {p.powerCostMultiplier.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="size-2.5 text-neon-orange" />
          <span className="text-muted-foreground">Labor:</span>
          <span className={p.laborCostMultiplier <= 0.8 ? 'text-neon-green' : p.laborCostMultiplier >= 1.3 ? 'text-red-400' : 'text-foreground'}>
            {p.laborCostMultiplier.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="size-2.5 text-neon-cyan" />
          <span className="text-muted-foreground">Cooling:</span>
          <span className={p.coolingEfficiency <= -3 ? 'text-neon-green' : p.coolingEfficiency >= 5 ? 'text-red-400' : 'text-foreground'}>
            {p.coolingEfficiency > 0 ? '+' : ''}{p.coolingEfficiency}°C
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Wifi className="size-2.5 text-neon-cyan" />
          <span className="text-muted-foreground">Network:</span>
          <span className={p.networkConnectivity >= 0.9 ? 'text-neon-green' : p.networkConnectivity <= 0.5 ? 'text-red-400' : 'text-foreground'}>
            {(p.networkConnectivity * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Building className="size-2.5 text-muted-foreground" />
          <span className="text-muted-foreground">Land:</span>
          <span className={p.landCostMultiplier <= 0.8 ? 'text-neon-green' : p.landCostMultiplier >= 2.0 ? 'text-red-400' : 'text-foreground'}>
            {p.landCostMultiplier.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Tax:</span>
          <span className={p.taxIncentiveDiscount >= 0.2 ? 'text-neon-green' : 'text-foreground'}>
            -{(p.taxIncentiveDiscount * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Demand Profile */}
      <div className="mb-2">
        <span className="text-[10px] text-muted-foreground">Demand:</span>
        <div className="flex gap-1 mt-0.5">
          {Object.entries(region.demandProfile).map(([key, val]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div
                  className="h-2 rounded-sm"
                  style={{
                    width: `${val * 100}%`,
                    maxWidth: '60px',
                    backgroundColor: val >= 0.7 ? '#00ff88' : val >= 0.4 ? '#ffaa00' : '#445566',
                    opacity: 0.8,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-xs">
                {key}: {(val * 100).toFixed(0)}%
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Existing site or purchase options */}
      {site ? (
        <div className="border border-border rounded p-2 bg-background">
          <div className="flex items-center gap-2 mb-1">
            <Building className="size-3 text-neon-green" />
            <span className="text-xs font-bold text-neon-green">{SITE_TYPE_CONFIG[site.type].label}</span>
            <Badge className={`ml-auto text-[10px] font-mono ${site.operational ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-yellow-900/30 text-yellow-400 border-yellow-800'}`}>
              {site.operational ? 'ONLINE' : `BUILDING (${site.constructionTicksRemaining}t)`}
            </Badge>
          </div>
          {site.operational && (
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className="text-muted-foreground">Cabinets: {site.cabinets}</span>
              <span className="text-muted-foreground">Servers: {site.servers}</span>
              <span className="text-neon-green">Rev: ${site.revenue.toFixed(0)}/t</span>
              <span className="text-red-400">Exp: ${site.expenses.toFixed(0)}/t</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <span className="text-[10px] text-muted-foreground block mb-1">Purchase site:</span>
          <div className="flex flex-col gap-1">
            {SITE_TYPE_OPTIONS.map((st) => {
              const cfg = SITE_TYPE_CONFIG[st]
              const cost = Math.round(cfg.purchaseCost * p.landCostMultiplier)
              const isSelected = selectedType === st
              return (
                <button
                  key={st}
                  className={`text-left p-1.5 rounded border text-[10px] font-mono transition-colors ${isSelected ? 'border-neon-green bg-green-900/20' : 'border-border bg-background hover:border-muted-foreground'}`}
                  onClick={() => setSelectedType(st)}
                >
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? 'text-neon-green' : 'text-foreground'}>{cfg.label}</span>
                    <span className="text-muted-foreground">${cost.toLocaleString()}</span>
                  </div>
                  <span className="text-muted-foreground">{cfg.maxCabinets} cabs · {cfg.constructionTicks}t build</span>
                </button>
              )
            })}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs font-mono mt-2 text-neon-green border-neon-green/40 hover:bg-green-900/20"
            disabled={money < Math.round(SITE_TYPE_CONFIG[selectedType].purchaseCost * p.landCostMultiplier)}
            onClick={() => onPurchase(selectedType, `${region.name.split('(')[0].trim()} ${SITE_TYPE_CONFIG[selectedType].label}`)}
          >
            <ArrowRight className="size-3 mr-1" />
            PURCHASE — ${Math.round(SITE_TYPE_CONFIG[selectedType].purchaseCost * p.landCostMultiplier).toLocaleString()}
          </Button>
        </div>
      )}
    </div>
  )
}

export function WorldMapPanel() {
  const {
    multiSiteUnlocked, worldMapOpen, sites, activeSiteId,
    researchedRegions, money, suiteTier, reputationScore,
    researchRegion, purchaseSite, switchSite, toggleWorldMap,
    totalSiteRevenue, totalSiteExpenses,
  } = useGameStore()
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null)

  const selectedRegionData = selectedRegion ? REGION_CATALOG.find((r) => r.id === selectedRegion) : null
  const selectedSite = selectedRegion ? sites.find((s) => s.regionId === selectedRegion) ?? null : null
  const operationalSites = sites.filter((s) => s.operational)

  if (!multiSiteUnlocked) {
    const suiteTierOrder = ['starter', 'standard', 'professional', 'enterprise']
    const hasTier = suiteTierOrder.indexOf(suiteTier) >= suiteTierOrder.indexOf(MULTI_SITE_GATE.minSuiteTier)
    const hasCash = money >= MULTI_SITE_GATE.minCash
    const hasRep = reputationScore >= MULTI_SITE_GATE.minReputation

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground">MULTI-SITE EXPANSION</span>
          <Badge className="ml-auto text-[10px] font-mono bg-red-900/30 text-red-400 border-red-800">LOCKED</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Expand from a single data center to a global empire. Unlock requirements:
        </p>
        <div className="flex flex-col gap-1 text-xs font-mono">
          <div className={`flex items-center gap-2 ${hasTier ? 'text-neon-green' : 'text-red-400'}`}>
            <span>{hasTier ? '✓' : '✗'}</span>
            <span>Enterprise Suite Tier</span>
          </div>
          <div className={`flex items-center gap-2 ${hasCash ? 'text-neon-green' : 'text-red-400'}`}>
            <span>{hasCash ? '✓' : '✗'}</span>
            <span>$500,000+ Cash</span>
          </div>
          <div className={`flex items-center gap-2 ${hasRep ? 'text-neon-green' : 'text-red-400'}`}>
            <span>{hasRep ? '✓' : '✗'}</span>
            <span>Excellent Reputation (75+)</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Globe className="size-4 text-neon-cyan" />
        <span className="text-xs font-bold text-neon-cyan">GLOBAL OPERATIONS</span>
        <Badge className="ml-auto text-[10px] font-mono bg-cyan-900/30 text-cyan-400 border-cyan-800">
          {sites.length}/{MAX_SITES} SITES
        </Badge>
      </div>

      {/* Aggregate Stats */}
      {operationalSites.length > 0 && (
        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono p-2 border border-border rounded bg-background">
          <span className="text-muted-foreground">Active Sites:</span>
          <span className="text-neon-green">{operationalSites.length}</span>
          <span className="text-muted-foreground">Site Revenue:</span>
          <span className="text-neon-green">${totalSiteRevenue.toFixed(0)}/t</span>
          <span className="text-muted-foreground">Site Expenses:</span>
          <span className="text-red-400">${totalSiteExpenses.toFixed(0)}/t</span>
          <span className="text-muted-foreground">Regions Scouted:</span>
          <span>{researchedRegions.length}/{REGION_CATALOG.length}</span>
        </div>
      )}

      {/* World Map Toggle */}
      <Button
        size="sm"
        variant={worldMapOpen ? 'default' : 'outline'}
        className="w-full text-xs font-mono"
        onClick={toggleWorldMap}
      >
        <Globe className="size-3 mr-1" />
        {worldMapOpen ? 'CLOSE WORLD MAP' : 'OPEN WORLD MAP'}
      </Button>

      {/* Inline Map */}
      <WorldMapSVG
        onRegionClick={setSelectedRegion}
        researchedRegions={researchedRegions}
        sites={sites}
      />

      {/* Site Switcher */}
      {operationalSites.length > 0 && (
        <div>
          <span className="text-[10px] text-muted-foreground font-bold mb-1 block">SITE SWITCHER</span>
          <div className="flex flex-col gap-1">
            <button
              className={`text-left p-1.5 rounded border text-[10px] font-mono transition-colors ${activeSiteId === null ? 'border-neon-green bg-green-900/20 text-neon-green' : 'border-border bg-background text-foreground hover:border-muted-foreground'}`}
              onClick={() => switchSite(null)}
            >
              HQ (Original Site)
            </button>
            {operationalSites.map((site) => {
              const region = REGION_CATALOG.find((r) => r.id === site.regionId)
              return (
                <button
                  key={site.id}
                  className={`text-left p-1.5 rounded border text-[10px] font-mono transition-colors ${activeSiteId === site.id ? 'border-neon-green bg-green-900/20 text-neon-green' : 'border-border bg-background text-foreground hover:border-muted-foreground'}`}
                  onClick={() => switchSite(site.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{site.name}</span>
                    <Badge className="text-[8px] font-mono" style={{ backgroundColor: `${CONTINENT_COLORS[region?.continent ?? 'north_america']}20`, color: CONTINENT_COLORS[region?.continent ?? 'north_america'] }}>
                      {SITE_TYPE_CONFIG[site.type].label}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Region Detail */}
      {selectedRegionData && (
        <RegionDetail
          region={selectedRegionData}
          researched={researchedRegions.includes(selectedRegionData.id)}
          site={selectedSite}
          onResearch={() => researchRegion(selectedRegionData.id)}
          onPurchase={(siteType, name) => purchaseSite(selectedRegionData.id, siteType, name)}
          money={money}
        />
      )}
    </div>
  )
}
