interface StatusBarProps {
  activeNodes: number
  totalNodes: number
}

export function StatusBar({ activeNodes, totalNodes }: StatusBarProps) {
  return (
    <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-card text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
          SYSTEM ONLINE
        </span>
        <span>
          NODES: {activeNodes}/{totalNodes}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>TIER: SOLAR</span>
        <span>COOLING: AIR</span>
        <span className="text-muted-foreground/50">v0.1.0</span>
      </div>
    </footer>
  )
}
