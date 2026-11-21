import type { LucideIcon } from 'lucide-react'
import { Activity, Network, Thermometer, Server } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ToggleDef {
  label: string
  icon: LucideIcon
  active: boolean
  onToggle: () => void
  activeClass: string
  tooltip: string
  disabled?: boolean
}

/** Quick overlay toggles along the top of the game view (same store state as the Layers popup and Network panel) */
export function ViewToggles() {
  const trafficVisible = useGameStore((s) => s.trafficVisible)
  const backendFabricVisible = useGameStore((s) => s.backendFabricVisible)
  const gpuPodCount = useGameStore((s) => s.gpuPods.length)
  const heatMapVisible = useGameStore((s) => s.heatMapVisible)
  const serverSlotsVisible = useGameStore((s) => s.serverSlotsVisible)
  const toggleTrafficVisible = useGameStore((s) => s.toggleTrafficVisible)
  const toggleBackendFabricVisible = useGameStore((s) => s.toggleBackendFabricVisible)
  const toggleHeatMap = useGameStore((s) => s.toggleHeatMap)
  const toggleServerSlotsVisible = useGameStore((s) => s.toggleServerSlotsVisible)

  const toggles: ToggleDef[] = [
    {
      label: 'Traffic',
      icon: Activity,
      active: trafficVisible,
      onToggle: toggleTrafficVisible,
      activeClass: 'bg-neon-yellow/15 text-neon-yellow border-neon-yellow/40',
      tooltip: 'Leaf-to-spine traffic, colored by link load',
    },
    {
      label: 'InfiniBand',
      icon: Network,
      active: backendFabricVisible && gpuPodCount > 0,
      onToggle: toggleBackendFabricVisible,
      activeClass: 'bg-neon-purple/15 text-neon-purple border-neon-purple/40',
      tooltip: gpuPodCount > 0 ? 'GPU pod backend fabric: InfiniBand switches and cables' : 'Build a GPU pod to see its InfiniBand fabric',
      disabled: gpuPodCount === 0,
    },
    {
      label: 'Heat map',
      icon: Thermometer,
      active: heatMapVisible,
      onToggle: toggleHeatMap,
      activeClass: 'bg-neon-red/15 text-neon-red border-neon-red/40',
      tooltip: 'Color cabinets by temperature',
    },
    {
      label: 'Free slots',
      icon: Server,
      active: serverSlotsVisible,
      onToggle: toggleServerSlotsVisible,
      activeClass: 'bg-neon-green/15 text-neon-green border-neon-green/40',
      tooltip: 'Highlight cabinets with room for another server',
    },
  ]

  return (
    <TooltipProvider>
      <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex items-center gap-1 rounded-md border border-border/60 bg-card/70 backdrop-blur-sm p-0.5">
        {toggles.map(({ label, icon: Icon, active, onToggle, activeClass, tooltip, disabled }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggle}
                disabled={disabled}
                aria-pressed={active}
                aria-label={label}
                className={`flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-xs transition-colors ${
                  active
                    ? activeClass
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Icon className="size-3" />
                <span className="hidden md:inline">{label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
