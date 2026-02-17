import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Cpu, Server, DollarSign, Radio, Zap, Plug,
  FlaskConical, FileText, Siren, Building, Trophy,
  Save, X, HelpCircle, Leaf, Shield, TrendingUp, Newspaper, BarChart3, Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useGameStore } from '@/stores/gameStore'

import { BuildPanel } from '@/components/sidebar/BuildPanel'
import { EquipmentPanel } from '@/components/sidebar/EquipmentPanel'
import { FinancePanel } from '@/components/sidebar/FinancePanel'
import { NetworkPanel } from '@/components/sidebar/NetworkPanel'
import { OperationsPanel } from '@/components/sidebar/OperationsPanel'
import { InfrastructurePanel } from '@/components/sidebar/InfrastructurePanel'
import { ResearchPanel } from '@/components/sidebar/ResearchPanel'
import { ContractsPanel } from '@/components/sidebar/ContractsPanel'
import { IncidentsPanel } from '@/components/sidebar/IncidentsPanel'
import { FacilityPanel } from '@/components/sidebar/FacilityPanel'
import { ProgressPanel } from '@/components/sidebar/ProgressPanel'
import { SettingsPanel } from '@/components/sidebar/SettingsPanel'
import { GuidePanel } from '@/components/sidebar/GuidePanel'
import { CarbonPanel } from '@/components/sidebar/CarbonPanel'
import { SecurityPanel } from '@/components/sidebar/SecurityPanel'
import { MarketPanel } from '@/components/sidebar/MarketPanel'
import { BuildLogsPanel } from '@/components/sidebar/BuildLogsPanel'
import { CapacityPanel } from '@/components/sidebar/CapacityPanel'
import { WorldMapPanel } from '@/components/sidebar/WorldMapPanel'

type PanelId = 'guide' | 'build' | 'equipment' | 'finance' | 'network' | 'operations' | 'infrastructure' | 'research' | 'contracts' | 'incidents' | 'facility' | 'carbon' | 'security' | 'market' | 'capacity' | 'world_map' | 'progress' | 'settings' | 'build_logs'

interface SidebarItem {
  id: PanelId
  icon: LucideIcon
  label: string
  color: string
  section?: 'top' | 'middle' | 'bottom'
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'guide', icon: HelpCircle, label: 'Guide', color: '#00ff88', section: 'top' },
  { id: 'build', icon: Cpu, label: 'Build', color: '#00ff88', section: 'top' },
  { id: 'equipment', icon: Server, label: 'Equipment', color: '#00ff88', section: 'top' },
  { id: 'finance', icon: DollarSign, label: 'Finance', color: '#ffaa00', section: 'top' },
  { id: 'network', icon: Radio, label: 'Network', color: '#00aaff', section: 'top' },
  { id: 'operations', icon: Zap, label: 'Operations', color: '#ff6644', section: 'middle' },
  { id: 'infrastructure', icon: Plug, label: 'Infrastructure', color: '#aa44ff', section: 'middle' },
  { id: 'research', icon: FlaskConical, label: 'Research', color: '#00aaff', section: 'middle' },
  { id: 'contracts', icon: FileText, label: 'Contracts', color: '#aa44ff', section: 'middle' },
  { id: 'incidents', icon: Siren, label: 'Incidents', color: '#ff4444', section: 'middle' },
  { id: 'facility', icon: Building, label: 'Facility', color: '#00aaff', section: 'middle' },
  { id: 'carbon', icon: Leaf, label: 'Carbon', color: '#44cc44', section: 'middle' },
  { id: 'security', icon: Shield, label: 'Security', color: '#ff8844', section: 'middle' },
  { id: 'market', icon: TrendingUp, label: 'Market', color: '#00aaff', section: 'middle' },
  { id: 'capacity', icon: BarChart3, label: 'Capacity', color: '#00ddff', section: 'middle' },
  { id: 'world_map', icon: Globe, label: 'World Map', color: '#00ccff', section: 'middle' },
  { id: 'progress', icon: Trophy, label: 'Progress', color: '#ffaa00', section: 'middle' },
  { id: 'build_logs', icon: Newspaper, label: "What's New", color: '#00ff88', section: 'bottom' },
  { id: 'settings', icon: Save, label: 'Settings', color: '#556677', section: 'bottom' },
]

const PANEL_TITLES: Record<PanelId, string> = {
  guide: 'HOW TO PLAY',
  build: 'BUILD',
  equipment: 'EQUIPMENT',
  finance: 'FINANCE',
  network: 'NETWORK',
  operations: 'OPERATIONS',
  infrastructure: 'INFRASTRUCTURE',
  research: 'R&D LAB',
  contracts: 'CONTRACTS',
  incidents: 'INCIDENTS',
  facility: 'FACILITY',
  carbon: 'CARBON & ENVIRONMENT',
  security: 'SECURITY & COMPLIANCE',
  market: 'MARKET & COMPETITORS',
  capacity: 'CAPACITY PLANNING',
  world_map: 'GLOBAL EXPANSION',
  progress: 'PROGRESS',
  build_logs: "WHAT'S NEW",
  settings: 'SETTINGS',
}

function PanelContent({ panelId }: { panelId: PanelId }) {
  switch (panelId) {
    case 'guide': return <GuidePanel />
    case 'build': return <BuildPanel />
    case 'equipment': return <EquipmentPanel />
    case 'finance': return <FinancePanel />
    case 'network': return <NetworkPanel />
    case 'operations': return <OperationsPanel />
    case 'infrastructure': return <InfrastructurePanel />
    case 'research': return <ResearchPanel />
    case 'contracts': return <ContractsPanel />
    case 'incidents': return <IncidentsPanel />
    case 'facility': return <FacilityPanel />
    case 'carbon': return <CarbonPanel />
    case 'security': return <SecurityPanel />
    case 'market': return <MarketPanel />
    case 'capacity': return <CapacityPanel />
    case 'world_map': return <WorldMapPanel />
    case 'progress': return <ProgressPanel />
    case 'build_logs': return <BuildLogsPanel />
    case 'settings': return <SettingsPanel />
  }
}

export function Sidebar() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)
  const incidentCount = useGameStore((s) => s.activeIncidents.filter((i) => !i.resolved).length)

  const togglePanel = (id: PanelId) => {
    setActivePanel(prev => prev === id ? null : id)
  }

  const topItems = SIDEBAR_ITEMS.filter(i => i.section === 'top')
  const middleItems = SIDEBAR_ITEMS.filter(i => i.section === 'middle')
  const bottomItems = SIDEBAR_ITEMS.filter(i => i.section === 'bottom')

  const activeItem = SIDEBAR_ITEMS.find(i => i.id === activePanel)

  return (
    <TooltipProvider>
      <div className="flex h-full">
        {/* Icon rail */}
        <div className="w-11 bg-card border-r border-border flex flex-col items-center py-2 shrink-0">
          {/* Top section */}
          <div className="flex flex-col items-center gap-0.5">
            {topItems.map(item => (
              <SidebarIcon
                key={item.id}
                item={item}
                isActive={activePanel === item.id}
                onClick={() => togglePanel(item.id)}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="w-6 h-px bg-border my-2" />

          {/* Middle section */}
          <div className="flex flex-col items-center gap-0.5 flex-1">
            {middleItems.map(item => (
              <SidebarIcon
                key={item.id}
                item={item}
                isActive={activePanel === item.id}
                onClick={() => togglePanel(item.id)}
                badgeCount={item.id === 'incidents' ? incidentCount : undefined}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="w-6 h-px bg-border my-2" />

          {/* Bottom section */}
          <div className="flex flex-col items-center gap-0.5">
            {bottomItems.map(item => (
              <SidebarIcon
                key={item.id}
                item={item}
                isActive={activePanel === item.id}
                onClick={() => togglePanel(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Panel slide-out */}
        {activePanel && activeItem && (
          <div className="w-80 bg-card/95 border-r border-border flex flex-col shrink-0 overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <activeItem.icon className="size-3.5" style={{ color: activeItem.color }} />
                <span
                  className="text-xs font-bold tracking-widest"
                  style={{ color: activeItem.color }}
                >
                  {PANEL_TITLES[activePanel]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setActivePanel(null)}
                className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
              >
                <X className="size-3.5" />
              </Button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-3">
              <PanelContent panelId={activePanel} />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

function SidebarIcon({
  item,
  isActive,
  onClick,
  badgeCount,
}: {
  item: SidebarItem
  isActive: boolean
  onClick: () => void
  badgeCount?: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`relative w-8 h-8 rounded-md flex items-center justify-center transition-all ${
            isActive
              ? 'bg-opacity-20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={
            isActive
              ? {
                  color: item.color,
                  backgroundColor: `${item.color}20`,
                  boxShadow: `0 0 8px ${item.color}33`,
                }
              : undefined
          }
        >
          <item.icon className="size-4" />
          {badgeCount != null && badgeCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-neon-red text-[9px] font-bold text-black flex items-center justify-center leading-none animate-pulse">
              {badgeCount}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-mono">
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}
