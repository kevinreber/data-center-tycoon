import { useState } from 'react'
import type { NodeType, LayerColors } from '@/stores/gameStore'
import { useGameStore, DEFAULT_COLORS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, SlidersHorizontal, RotateCcw, AlertTriangle, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const LAYER_DEFS: { type: NodeType; label: string; colorClass: string; glowClass: string; neonVar: string }[] = [
  { type: 'server', label: 'Servers', colorClass: 'neon-green', glowClass: 'text-neon-green', neonVar: '#00ff88' },
  { type: 'leaf_switch', label: 'Leaf Switches', colorClass: 'neon-cyan', glowClass: 'text-neon-cyan', neonVar: '#00aaff' },
  { type: 'spine_switch', label: 'Spine Switches', colorClass: 'neon-orange', glowClass: 'text-neon-orange', neonVar: '#ff6644' },
]

function hexToStr(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`
}

function strToHex(str: string): number {
  return parseInt(str.replace('#', ''), 16)
}

function deriveColors(topHex: number): LayerColors {
  const r = (topHex >> 16) & 0xff
  const g = (topHex >> 8) & 0xff
  const b = topHex & 0xff
  const side = ((Math.round(r * 0.8) << 16) | (Math.round(g * 0.8) << 8) | Math.round(b * 0.8))
  const front = ((Math.round(r * 0.6) << 16) | (Math.round(g * 0.6) << 8) | Math.round(b * 0.6))
  return { top: topHex, side, front }
}

export function LayersPopup() {
  const [open, setOpen] = useState(false)

  const layerVisibility = useGameStore((s) => s.layerVisibility)
  const layerOpacity = useGameStore((s) => s.layerOpacity)
  const layerColors = useGameStore((s) => s.layerColors)
  const trafficVisible = useGameStore((s) => s.trafficVisible)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const toggleLayerVisibility = useGameStore((s) => s.toggleLayerVisibility)
  const setLayerOpacity = useGameStore((s) => s.setLayerOpacity)
  const setLayerColor = useGameStore((s) => s.setLayerColor)
  const toggleTrafficVisible = useGameStore((s) => s.toggleTrafficVisible)

  return (
    <TooltipProvider>
      <div className="absolute top-3 right-3 z-10">
        {/* Toggle button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setOpen(!open)}
              className={`font-mono text-xs gap-1.5 border backdrop-blur-sm ${
                open
                  ? 'bg-card/90 border-neon-purple/50 text-neon-purple'
                  : 'bg-card/70 border-border/60 text-muted-foreground hover:text-neon-purple hover:border-neon-purple/40'
              }`}
            >
              <SlidersHorizontal className="size-3" />
              LAYERS
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Toggle layer controls</TooltipContent>
        </Tooltip>

        {/* Popup panel */}
        {open && (
          <div className="absolute top-9 right-0 w-80 rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 glow-green shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-neon-purple" />
                <span className="text-xs font-bold text-neon-purple tracking-widest">LAYERS</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
              >
                <X className="size-3.5" />
              </Button>
            </div>

            <div className="flex flex-col gap-2.5">
              {LAYER_DEFS.map(({ type, label, colorClass, glowClass, neonVar }) => {
                const visible = layerVisibility[type]
                const opacity = layerOpacity[type]
                const colorOverride = layerColors[type]
                const currentTopHex = colorOverride ? colorOverride.top : DEFAULT_COLORS[type].top
                const hasColorOverride = colorOverride !== null

                return (
                  <div key={type} className="flex items-center gap-2">
                    {/* Visibility toggle chip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => toggleLayerVisibility(type)}
                          className={`font-mono text-xs transition-all min-w-[120px] justify-start gap-1.5 ${
                            visible
                              ? `bg-${colorClass}/20 ${glowClass} border border-${colorClass}/40`
                              : 'text-muted-foreground line-through opacity-50'
                          }`}
                        >
                          {visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                          {label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {visible ? 'Hide' : 'Show'} {label.toLowerCase()} layer
                      </TooltipContent>
                    </Tooltip>

                    {/* Opacity slider */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round(opacity * 100)}
                          onChange={(e) => setLayerOpacity(type, Number(e.target.value) / 100)}
                          disabled={!visible}
                          className="w-20 h-1 accent-current disabled:opacity-30 cursor-pointer"
                          style={{ color: neonVar }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Opacity: {Math.round(opacity * 100)}%
                      </TooltipContent>
                    </Tooltip>
                    <span className={`text-xs tabular-nums w-8 text-right ${visible ? glowClass : 'text-muted-foreground opacity-50'}`}>
                      {Math.round(opacity * 100)}%
                    </span>

                    {/* Color picker */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <input
                          type="color"
                          value={hexToStr(currentTopHex)}
                          onChange={(e) => setLayerColor(type, deriveColors(strToHex(e.target.value)))}
                          disabled={!visible}
                          className="w-6 h-6 rounded border border-border bg-transparent cursor-pointer disabled:opacity-30 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Custom layer color
                      </TooltipContent>
                    </Tooltip>

                    {/* Reset color button */}
                    {hasColorOverride && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setLayerColor(type, null)}
                            className="text-muted-foreground hover:text-foreground p-0.5 h-auto"
                          >
                            <RotateCcw className="size-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Reset to default color
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )
              })}

              {/* Traffic visibility toggle */}
              <div className="flex items-center gap-2 mt-1 pt-2 border-t border-border/50">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => toggleTrafficVisible()}
                      className={`font-mono text-xs transition-all min-w-[120px] justify-start gap-1.5 ${
                        trafficVisible
                          ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40'
                          : 'text-muted-foreground line-through opacity-50'
                      }`}
                    >
                      {trafficVisible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      Traffic
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {trafficVisible ? 'Hide' : 'Show'} traffic flow visualization
                  </TooltipContent>
                </Tooltip>
                {trafficStats.redirectedFlows > 0 && (
                  <span className="flex items-center gap-1 text-xs text-neon-orange animate-pulse">
                    <AlertTriangle className="size-3" />
                    REDIRECT
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
