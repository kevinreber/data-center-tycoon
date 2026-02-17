import { useState } from 'react'
import { useGameStore, MAX_SAVE_SLOTS, SUITE_TIERS } from '@/stores/gameStore'
import type { SaveSlotMeta, LeaderboardCategory } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Save, Upload, RotateCw, Play, Trash2, Plus, AlertTriangle, Volume2, VolumeX, Trophy } from 'lucide-react'

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function SaveSlotCard({ meta, isActive, onLoad, onSave, onDelete }: {
  meta: SaveSlotMeta
  isActive: boolean
  onLoad: () => void
  onSave: () => void
  onDelete: () => void
}) {
  const tierLabel = SUITE_TIERS[meta.suiteTier]?.label ?? meta.suiteTier

  return (
    <div className={`border rounded-md p-2.5 font-mono text-xs ${
      isActive
        ? 'border-neon-green/50 bg-neon-green/5'
        : 'border-border bg-card/50'
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-bold text-foreground truncate">{meta.name}</span>
        {isActive && <span className="text-[9px] text-neon-green font-bold">ACTIVE</span>}
      </div>
      <div className="text-[10px] text-muted-foreground space-y-0.5 mb-2">
        <div className="flex justify-between">
          <span>{tierLabel}</span>
          <span>{meta.cabinetCount} cabinet{meta.cabinetCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between">
          <span>{formatMoney(meta.money)}</span>
          <span>Tick {meta.tickCount}</span>
        </div>
        <div className="text-muted-foreground/60">{formatDate(meta.timestamp)}</div>
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 flex-1"
          onClick={onLoad}
        >
          <Upload className="size-2.5" />Load
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 flex-1"
          onClick={onSave}
        >
          <Save className="size-2.5" />Overwrite
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 text-neon-red border-neon-red/20 hover:border-neon-red/50 hover:bg-neon-red/10"
          onClick={onDelete}
        >
          <Trash2 className="size-2.5" />
        </Button>
      </div>
    </div>
  )
}

function EmptySlotCard({ slotId, onSave }: { slotId: number; onSave: () => void }) {
  return (
    <div className="border border-dashed border-border/50 rounded-md p-2.5 font-mono text-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-muted-foreground/60">Slot {slotId} — Empty</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-[10px] h-6 px-2 gap-1 w-full"
        onClick={onSave}
      >
        <Plus className="size-2.5" />Save Here
      </Button>
    </div>
  )
}

export function SettingsPanel() {
  const {
    sandboxMode, toggleSandboxMode,
    saveGame, loadGame, deleteGame, resetGame,
    activeSlotId, saveSlots,
    audioSettings, setAudioSettings,
    leaderboardEntries, submitLeaderboardEntry,
  } = useGameStore()

  const [feedback, setFeedback] = useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 2000)
  }

  const handleSave = (slotId: number, name?: string) => {
    saveGame(slotId, name)
    showFeedback(`Saved to slot ${slotId}`)
  }

  const handleLoad = (slotId: number) => {
    if (!confirm('Load this save? Unsaved progress will be lost.')) return
    const success = loadGame(slotId)
    showFeedback(success ? 'Game loaded' : 'Failed to load')
  }

  const handleDelete = (slotId: number) => {
    if (!confirm('Delete this save? This cannot be undone.')) return
    deleteGame(slotId)
    showFeedback('Save deleted')
  }

  // Build slot display: show existing saves + empty slots up to MAX_SAVE_SLOTS
  const slotIds = Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => i + 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Save Slots */}
      <div>
        <span className="text-xs font-bold text-muted-foreground tracking-widest mb-2 block">SAVE SLOTS</span>

        {feedback && (
          <div className="text-[10px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/20 rounded px-2 py-1 mb-2">
            {feedback}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {slotIds.map((slotId) => {
            const meta = saveSlots.find((s) => s.slotId === slotId)
            if (meta) {
              return (
                <SaveSlotCard
                  key={slotId}
                  meta={meta}
                  isActive={activeSlotId === slotId}
                  onLoad={() => handleLoad(slotId)}
                  onSave={() => handleSave(slotId)}
                  onDelete={() => handleDelete(slotId)}
                />
              )
            }
            return (
              <EmptySlotCard
                key={slotId}
                slotId={slotId}
                onSave={() => handleSave(slotId, `Save ${slotId}`)}
              />
            )
          })}
        </div>

        {/* Browser storage warning */}
        <div className="flex gap-1.5 mt-3 p-2 rounded border border-neon-orange/20 bg-neon-orange/5">
          <AlertTriangle className="size-3 text-neon-orange shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Saves are stored in your browser's local storage. Clearing your browser data, cookies, or using a different browser/device will erase all saves.
          </p>
        </div>
      </div>

      {/* New Game / Reset */}
      <div className="border-t border-border pt-3">
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-2 justify-start font-mono w-full text-neon-red border-neon-red/20 hover:border-neon-red/50 hover:bg-neon-red/10"
          onClick={() => { if (confirm('Start a new game? Unsaved progress will be lost.')) resetGame() }}
        >
          <RotateCw className="size-3" />New Game
        </Button>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Resets to a fresh game. Existing saves are kept.
        </p>
      </div>

      {/* Audio Settings */}
      <div className="border-t border-border pt-3">
        <span className="text-xs font-bold text-muted-foreground tracking-widest mb-2 block">AUDIO</span>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={audioSettings.muted ? 'default' : 'outline'}
            size="xs"
            className="text-[9px] gap-1"
            onClick={() => setAudioSettings({ muted: !audioSettings.muted })}
          >
            {audioSettings.muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
            {audioSettings.muted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-muted-foreground flex items-center justify-between">
            Master
            <input type="range" min="0" max="100" value={Math.round(audioSettings.masterVolume * 100)}
              onChange={(e) => setAudioSettings({ masterVolume: Number(e.target.value) / 100 })}
              className="w-20 h-1 accent-neon-green" />
          </label>
          <label className="text-[10px] text-muted-foreground flex items-center justify-between">
            SFX
            <input type="range" min="0" max="100" value={Math.round(audioSettings.sfxVolume * 100)}
              onChange={(e) => setAudioSettings({ sfxVolume: Number(e.target.value) / 100 })}
              className="w-20 h-1 accent-neon-green" />
          </label>
          <label className="text-[10px] text-muted-foreground flex items-center justify-between">
            Ambient
            <input type="range" min="0" max="100" value={Math.round(audioSettings.ambientVolume * 100)}
              onChange={(e) => setAudioSettings({ ambientVolume: Number(e.target.value) / 100 })}
              className="w-20 h-1 accent-neon-green" />
          </label>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="size-3 text-neon-yellow" />
          <span className="text-xs font-bold text-neon-yellow tracking-widest">LEADERBOARD</span>
        </div>
        {leaderboardEntries.length > 0 ? (
          <div className="flex flex-col gap-1 mb-2">
            {leaderboardEntries.slice(0, 5).map((entry, i) => (
              <div key={entry.id} className="flex items-center text-[10px] gap-1">
                <span className={`font-bold ${i === 0 ? 'text-neon-yellow' : i === 1 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>#{i + 1}</span>
                <span className="text-muted-foreground truncate">{entry.playerName}</span>
                <span className="ml-auto tabular-nums text-neon-green/80">{entry.category === 'pue' ? entry.value.toFixed(2) : entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground mb-2">No entries yet.</p>
        )}
        <div className="flex gap-1">
          {(['revenue', 'uptime', 'cabinets'] as LeaderboardCategory[]).map((cat) => (
            <Button key={cat} variant="outline" size="xs" className="text-[9px] flex-1"
              onClick={() => submitLeaderboardEntry('Player', cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
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
