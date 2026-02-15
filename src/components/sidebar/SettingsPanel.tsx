import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Save, Upload, RotateCw, Play } from 'lucide-react'

export function SettingsPanel() {
  const {
    sandboxMode, toggleSandboxMode,
    saveGame, loadGame, resetGame,
  } = useGameStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Save / Load / Reset */}
      <div>
        <span className="text-xs font-bold text-muted-foreground tracking-widest mb-2 block">SAVE & LOAD</span>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-2 justify-start font-mono" onClick={() => saveGame()}>
            <Save className="size-3" />Save Game
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-2 justify-start font-mono" onClick={() => loadGame()}>
            <Upload className="size-3" />Load Game
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-2 justify-start font-mono text-neon-red border-neon-red/20 hover:border-neon-red/50 hover:bg-neon-red/10"
            onClick={() => { if (confirm('Reset all progress?')) resetGame() }}
          >
            <RotateCw className="size-3" />Reset Game
          </Button>
        </div>
      </div>

      {/* Sandbox */}
      <div className="border-t border-border pt-3">
        <span className="text-xs font-bold text-muted-foreground tracking-widest mb-2 block">MODE</span>
        <Button
          variant={sandboxMode ? 'default' : 'outline'}
          size="sm"
          className={`text-xs gap-2 justify-start font-mono w-full ${
            sandboxMode ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40' : ''
          }`}
          onClick={() => toggleSandboxMode()}
        >
          <Play className="size-3" />{sandboxMode ? 'SANDBOX ON' : 'Enable Sandbox'}
        </Button>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Sandbox mode removes cost restrictions for experimentation.
        </p>
      </div>
    </div>
  )
}
