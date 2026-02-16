import { useEffect, useRef, useState } from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { Sidebar } from '@/components/Sidebar'
import { LayersPopup } from '@/components/LayersPopup'
import { StatusBar } from '@/components/StatusBar'
import { useGameStore } from '@/stores/gameStore'
import type { GameSpeed } from '@/stores/gameStore'
import { Zap, DollarSign, Thermometer, Activity, Pause, Play, FastForward, Trophy, X, Flame, Plus, Minus, RotateCcw, Cpu, Server, Radio, Plug, Building, Save, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

const SPEED_LABELS: Record<GameSpeed, string> = {
  0: 'PAUSED',
  1: '1x',
  2: '2x',
  3: '3x',
}

const TICK_INTERVALS: Record<GameSpeed, number> = {
  0: 0,
  1: 1000,
  2: 500,
  3: 250,
}

/** On-screen zoom/reset controls overlaid on the game canvas for mobile */
function MobileCanvasControls() {
  const placementMode = useGameStore((s) => s.placementMode)
  const exitPlacementMode = useGameStore((s) => s.exitPlacementMode)

  const handleZoom = (delta: number) => {
    // Access the Phaser game instance through the container
    const container = document.getElementById('phaser-container')
    if (!container) return
    const canvas = container.querySelector('canvas')
    if (!canvas) return
    // Use a custom event to communicate with Phaser
    canvas.dispatchEvent(new CustomEvent('mobile-zoom', { detail: { delta } }))
  }

  const handleReset = () => {
    const container = document.getElementById('phaser-container')
    if (!container) return
    const canvas = container.querySelector('canvas')
    if (!canvas) return
    canvas.dispatchEvent(new CustomEvent('mobile-reset'))
  }

  return (
    <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1.5 md:hidden">
      {placementMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => exitPlacementMode()}
          className="font-mono text-xs border-neon-red/40 bg-card/90 hover:bg-neon-red/20 text-neon-red backdrop-blur-sm min-h-[40px] min-w-[40px] px-2"
        >
          <X className="size-4 mr-1" />
          Cancel
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleZoom(0.2)}
        className="font-mono text-xs border-border/60 bg-card/90 hover:bg-card text-foreground backdrop-blur-sm min-h-[40px] min-w-[40px] p-0"
      >
        <Plus className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleZoom(-0.2)}
        className="font-mono text-xs border-border/60 bg-card/90 hover:bg-card text-foreground backdrop-blur-sm min-h-[40px] min-w-[40px] p-0"
      >
        <Minus className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="font-mono text-xs border-border/60 bg-card/90 hover:bg-card text-muted-foreground backdrop-blur-sm min-h-[40px] min-w-[40px] p-0"
      >
        <RotateCcw className="size-3.5" />
      </Button>
    </div>
  )
}

/** Bottom tab bar for mobile navigation — replaces sidebar */
function MobileNav() {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  const togglePanel = (id: string) => {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  const tabs = [
    { id: 'build', icon: Cpu, label: 'Build', color: '#00ff88' },
    { id: 'equipment', icon: Server, label: 'Equip', color: '#00ff88' },
    { id: 'finance', icon: DollarSign, label: 'Finance', color: '#ffaa00' },
    { id: 'network', icon: Radio, label: 'Network', color: '#00aaff' },
    { id: 'more', icon: Menu, label: 'More', color: '#556677' },
  ]

  // Lazy-load sidebar panel components
  const panelMap: Record<string, string> = {
    build: 'build',
    equipment: 'equipment',
    finance: 'finance',
    network: 'network',
    operations: 'operations',
    infrastructure: 'infrastructure',
    research: 'research',
    contracts: 'contracts',
    incidents: 'incidents',
    facility: 'facility',
    progress: 'progress',
    settings: 'settings',
  }

  const moreTabs = [
    { id: 'operations', icon: Zap, label: 'Operations', color: '#ff6644' },
    { id: 'infrastructure', icon: Plug, label: 'Infra', color: '#aa44ff' },
    { id: 'facility', icon: Building, label: 'Facility', color: '#00aaff' },
    { id: 'settings', icon: Save, label: 'Settings', color: '#556677' },
  ]

  return (
    <div className="md:hidden">
      {/* Slide-up panel content */}
      {activePanel && activePanel !== 'more' && panelMap[activePanel] && (
        <div className="border-t border-border bg-card/95 backdrop-blur-sm max-h-[50vh] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border sticky top-0 bg-card z-10">
            <span className="text-xs font-bold tracking-widest text-neon-green">
              {activePanel.toUpperCase()}
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setActivePanel(null)}
              className="text-muted-foreground hover:text-foreground p-1 h-auto min-h-[32px]"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="p-3">
            <MobilePanelContent panelId={activePanel} />
          </div>
        </div>
      )}

      {/* "More" sub-menu */}
      {activePanel === 'more' && (
        <div className="border-t border-border bg-card/95 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-1 p-2">
            {moreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                style={{ color: undefined }}
              >
                <tab.icon className="size-5" style={{ color: tab.color }} />
                <span className="text-xs font-mono">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="flex items-center justify-around border-t border-border bg-card px-1 py-1 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = activePanel === tab.id || (tab.id === 'more' && activePanel !== null && !['build', 'equipment', 'finance', 'network'].includes(activePanel))
          return (
            <button
              key={tab.id}
              onClick={() => togglePanel(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-md transition-all min-h-[44px] min-w-[44px] ${
                isActive ? 'bg-opacity-20' : 'text-muted-foreground'
              }`}
              style={isActive ? { color: tab.color, backgroundColor: `${tab.color}15` } : undefined}
            >
              <tab.icon className="size-5" />
              <span className="text-[10px] font-mono">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/** Renders sidebar panel content for mobile bottom sheet */
function MobilePanelContent({ panelId }: { panelId: string }) {
  switch (panelId) {
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
    case 'progress': return <ProgressPanel />
    case 'settings': return <SettingsPanel />
    default: return null
  }
}

function App() {
  const {
    totalPower, money, pue, avgHeat, cabinets, spineSwitches,
    gameSpeed, setGameSpeed, tick, revenue, expenses,
    newAchievement, dismissAchievement, loanPayments,
    powerOutage, outageTicksRemaining, fireActive, suppressionType,
  } = useGameStore()
  const totalNodes = cabinets.length + spineSwitches.length
  const activeNodes = cabinets.filter((c) => c.powerStatus).length + spineSwitches.filter((s) => s.powerStatus).length
  const netIncome = revenue - expenses - loanPayments
  const tickRef = useRef(tick)
  tickRef.current = tick

  // Game tick loop
  useEffect(() => {
    if (gameSpeed === 0) return
    const interval = setInterval(() => tickRef.current(), TICK_INTERVALS[gameSpeed])
    return () => clearInterval(interval)
  }, [gameSpeed])

  // Escape key exits placement mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const state = useGameStore.getState()
        if (state.placementMode) {
          state.exitPlacementMode()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const cycleSpeed = () => {
    const next = ((gameSpeed + 1) % 4) as GameSpeed
    setGameSpeed(next)
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background text-foreground font-mono overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 border-b border-border bg-card">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-neon-green text-glow-green tracking-wider whitespace-nowrap">
              FABRIC TYCOON
            </h1>
            <span className="text-xs text-muted-foreground hidden lg:inline">
              Build cabinets, design network fabrics, and manage power to scale your data center.
            </span>
            <span className="inline-block w-2 h-4 bg-neon-green animate-blink ml-1 hidden sm:inline-block" />
          </div>

          {/* Top-bar stats */}
          <div className="flex items-center gap-2 sm:gap-5 text-xs shrink-0">
            {/* Game speed control */}
            <div className="flex items-center gap-1.5 border-r border-border pr-2 sm:pr-4 mr-0.5 sm:mr-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={cycleSpeed}
                    className={`font-mono text-xs px-1.5 sm:px-2 gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-0 ${
                      gameSpeed === 0
                        ? 'text-neon-red'
                        : 'text-neon-green'
                    }`}
                  >
                    {gameSpeed === 0 ? (
                      <Pause className="size-3.5 sm:size-3" />
                    ) : gameSpeed >= 2 ? (
                      <FastForward className="size-3.5 sm:size-3" />
                    ) : (
                      <Play className="size-3.5 sm:size-3" />
                    )}
                    <span className="hidden sm:inline">{SPEED_LABELS[gameSpeed]}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Click to cycle: Pause → 1x → 2x → 3x
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <DollarSign className="size-3.5 text-neon-yellow" />
              <span className="text-neon-yellow text-glow-orange font-bold">
                ${Math.floor(money).toLocaleString()}
              </span>
              {(revenue > 0 || expenses > 0) && (
                <span className={`text-xs hidden sm:inline ${netIncome >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                  {netIncome >= 0 ? '+' : ''}{netIncome.toFixed(0)}/t
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Zap className="size-3.5 text-neon-green" />
              <span className="text-neon-green">
                {totalPower.toLocaleString()}W
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Thermometer className="size-3.5 text-neon-orange" />
              <span className={avgHeat > 60 ? 'text-neon-red text-glow-red' : 'text-neon-orange'}>
                {avgHeat}°C
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Activity className="size-3.5 text-neon-cyan" />
              <span className="text-neon-cyan">
                PUE {pue || '—'}
              </span>
            </div>
          </div>
        </header>

        {/* Main content area: sidebar + canvas */}
        <main className="flex-1 flex min-h-0">
          {/* Left sidebar — hidden on mobile, shown via MobileNav */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          {/* Canvas area */}
          <div className="flex-1 min-h-0 flex flex-col p-1.5 sm:p-3 gap-1 sm:gap-2">
            {/* Alert banners */}
            {powerOutage && (
              <div className="rounded-lg border border-neon-red/40 bg-neon-red/10 p-1.5 sm:p-2 flex items-center gap-2 animate-pulse shrink-0">
                <Zap className="size-4 text-neon-red" />
                <span className="text-xs font-bold text-neon-red tracking-widest">POWER OUTAGE</span>
                <span className="text-xs text-neon-red tabular-nums ml-auto">{outageTicksRemaining}t</span>
              </div>
            )}
            {fireActive && (
              <div className="rounded-lg border border-neon-orange/40 bg-neon-orange/10 p-1.5 sm:p-2 flex items-center gap-2 animate-pulse shrink-0">
                <Flame className="size-4 text-neon-orange" />
                <span className="text-xs font-bold text-neon-orange tracking-widest">FIRE</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {suppressionType === 'none' ? 'No suppression' : suppressionType === 'water_suppression' ? 'Water' : 'Gas'}
                </span>
              </div>
            )}

            {/* Phaser canvas */}
            <div className="flex-1 min-h-0 relative">
              <GameCanvas />
              <LayersPopup />
              {/* Mobile on-screen controls */}
              <MobileCanvasControls />
            </div>
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileNav />

        {/* Bottom status bar — hidden on mobile (replaced by MobileNav) */}
        <div className="hidden md:block">
          <StatusBar activeNodes={activeNodes} totalNodes={totalNodes} />
        </div>

        {/* Achievement toast */}
        {newAchievement && (
          <div className="fixed bottom-16 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="rounded-lg border border-neon-yellow/40 bg-card p-3 shadow-lg glow-green flex items-center gap-3 min-w-64">
              <span className="text-2xl">{newAchievement.def.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Trophy className="size-3 text-neon-yellow" />
                  <span className="text-xs font-bold text-neon-yellow tracking-wider">ACHIEVEMENT UNLOCKED</span>
                </div>
                <p className="text-sm font-bold text-foreground">{newAchievement.def.label}</p>
                <p className="text-xs text-muted-foreground">{newAchievement.def.description}</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => dismissAchievement()}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default App
