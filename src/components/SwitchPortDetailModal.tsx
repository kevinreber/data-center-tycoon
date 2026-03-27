import { useGameStore, TRAFFIC } from '@/stores/gameStore'
import type { TrafficLink, ActiveIncident } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { X, Network, AlertTriangle, Activity, ArrowUpDown, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ── Port status derivation ─────────────────────────────────────

type PortStatus = 'active' | 'high_util' | 'flapping' | 'down' | 'empty'

interface PortInfo {
  label: string
  status: PortStatus
  utilization: number
  bandwidthGbps: number
  capacityGbps: number
  /** The link key (leafCabinetId:spineId) for this port, if applicable */
  linkKey?: string
  tooltip: string
}

function getPortColor(status: PortStatus): string {
  switch (status) {
    case 'active': return '#00ff88'
    case 'high_util': return '#ffaa00'
    case 'flapping': return '#ff4444'
    case 'down': return '#ff4444'
    case 'empty': return '#333333'
  }
}

function getPortLabel(status: PortStatus): string {
  switch (status) {
    case 'active': return 'UP'
    case 'high_util': return 'HIGH'
    case 'flapping': return 'FLAP'
    case 'down': return 'DOWN'
    case 'empty': return '---'
  }
}

// ── Derive port info for a leaf switch ─────────────────────────

function getLeafPorts(
  cabinetId: string,
  links: TrafficLink[],
  spineCount: number,
  serverCount: number,
  powerOn: boolean,
  flappingKeys: Set<string>,
): { uplinks: PortInfo[]; downlinks: PortInfo[] } {
  const uplinks: PortInfo[] = []
  for (let i = 0; i < spineCount; i++) {
    const spineId = `spine-${i + 1}`
    const link = links.find(l => l.leafCabinetId === cabinetId && l.spineId === spineId)
    const linkKey = `${cabinetId}:${spineId}`
    const isFlapping = flappingKeys.has(linkKey)

    if (!powerOn) {
      uplinks.push({
        label: `UP${i + 1}`,
        status: 'down',
        utilization: 0,
        bandwidthGbps: 0,
        capacityGbps: 0,
        linkKey,
        tooltip: `Uplink ${i + 1} to ${spineId} — switch powered off`,
      })
    } else if (isFlapping) {
      uplinks.push({
        label: `UP${i + 1}`,
        status: 'flapping',
        utilization: link ? link.utilization : 0,
        bandwidthGbps: link ? link.bandwidthGbps : 0,
        capacityGbps: link ? link.capacityGbps : 0,
        linkKey,
        tooltip: `Uplink ${i + 1} to ${spineId} — PORT FLAPPING! Intermittent connectivity`,
      })
    } else if (link) {
      const util = link.utilization
      uplinks.push({
        label: `UP${i + 1}`,
        status: util > 0.8 ? 'high_util' : 'active',
        utilization: util,
        bandwidthGbps: link.bandwidthGbps,
        capacityGbps: link.capacityGbps,
        linkKey,
        tooltip: `Uplink ${i + 1} to ${spineId} — ${link.bandwidthGbps.toFixed(1)}/${link.capacityGbps.toFixed(0)} Gbps (${Math.round(util * 100)}%)`,
      })
    } else {
      uplinks.push({
        label: `UP${i + 1}`,
        status: 'empty',
        utilization: 0,
        bandwidthGbps: 0,
        capacityGbps: 0,
        linkKey,
        tooltip: `Uplink ${i + 1} to ${spineId} — no link (spine may be offline)`,
      })
    }
  }

  // Downlink ports (one per server slot)
  const downlinks: PortInfo[] = []
  for (let i = 0; i < 4; i++) {
    const filled = i < serverCount
    downlinks.push({
      label: `DN${i + 1}`,
      status: !powerOn ? 'down' : filled ? 'active' : 'empty',
      utilization: filled && powerOn ? 0.5 : 0, // servers always generate some traffic
      bandwidthGbps: filled && powerOn ? TRAFFIC.gbpsPerServer : 0,
      capacityGbps: TRAFFIC.gbpsPerServer,
      tooltip: filled
        ? `Downlink ${i + 1} — Server ${i + 1} (${TRAFFIC.gbpsPerServer} Gbps)`
        : `Downlink ${i + 1} — empty slot`,
    })
  }

  return { uplinks, downlinks }
}

// ── Derive port info for a spine switch ────────────────────────

function getSpinePorts(
  spineId: string,
  links: TrafficLink[],
  leafCabinetIds: string[],
  powerOn: boolean,
  flappingKeys: Set<string>,
): PortInfo[] {
  const ports: PortInfo[] = []
  for (let i = 0; i < leafCabinetIds.length; i++) {
    const cabId = leafCabinetIds[i]
    const link = links.find(l => l.leafCabinetId === cabId && l.spineId === spineId)
    const linkKey = `${cabId}:${spineId}`
    const isFlapping = flappingKeys.has(linkKey)
    const portLabel = `P${i + 1}`

    if (!powerOn) {
      ports.push({
        label: portLabel,
        status: 'down',
        utilization: 0,
        bandwidthGbps: 0,
        capacityGbps: 0,
        linkKey,
        tooltip: `Port ${i + 1} to ${cabId.replace('cab-', 'Cab #')} — switch powered off`,
      })
    } else if (isFlapping) {
      ports.push({
        label: portLabel,
        status: 'flapping',
        utilization: link ? link.utilization : 0,
        bandwidthGbps: link ? link.bandwidthGbps : 0,
        capacityGbps: link ? link.capacityGbps : 0,
        linkKey,
        tooltip: `Port ${i + 1} to ${cabId.replace('cab-', 'Cab #')} — PORT FLAPPING!`,
      })
    } else if (link) {
      const util = link.utilization
      ports.push({
        label: portLabel,
        status: util > 0.8 ? 'high_util' : 'active',
        utilization: util,
        bandwidthGbps: link.bandwidthGbps,
        capacityGbps: link.capacityGbps,
        linkKey,
        tooltip: `Port ${i + 1} to ${cabId.replace('cab-', 'Cab #')} — ${link.bandwidthGbps.toFixed(1)}/${link.capacityGbps.toFixed(0)} Gbps (${Math.round(util * 100)}%)`,
      })
    } else {
      ports.push({
        label: portLabel,
        status: 'empty',
        utilization: 0,
        bandwidthGbps: 0,
        capacityGbps: 0,
        linkKey,
        tooltip: `Port ${i + 1} to ${cabId.replace('cab-', 'Cab #')} — no traffic`,
      })
    }
  }
  return ports
}

// ── Port LED component ────────────────────────────────────────

function PortLed({ port }: { port: PortInfo }) {
  const color = getPortColor(port.status)
  const isFlapping = port.status === 'flapping'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center gap-0.5 cursor-default">
          {/* Port housing */}
          <div
            className={`w-8 h-6 rounded-sm border flex items-center justify-center transition-all ${
              isFlapping ? 'animate-pulse' : ''
            }`}
            style={{
              borderColor: `${color}60`,
              backgroundColor: `${color}15`,
              boxShadow: port.status !== 'empty' ? `0 0 6px ${color}40` : 'none',
            }}
          >
            {/* LED indicator */}
            <div
              className={`w-2 h-2 rounded-full ${isFlapping ? 'animate-ping' : ''}`}
              style={{ backgroundColor: color }}
            />
          </div>
          {/* Port label */}
          <span
            className="text-[8px] font-mono tabular-nums"
            style={{ color: `${color}cc` }}
          >
            {port.label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-52">
        <p className="text-[10px] font-mono">{port.tooltip}</p>
        {port.status !== 'empty' && (
          <p className="text-[10px] font-mono mt-0.5" style={{ color }}>
            Status: {getPortLabel(port.status)}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Port row (visual group of ports) ───────────────────────────

function PortRow({ label, ports }: { label: string; ports: PortInfo[] }) {
  return (
    <div>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {ports.map((port, i) => (
          <PortLed key={i} port={port} />
        ))}
      </div>
    </div>
  )
}

// ── Main modal component ──────────────────────────────────────

export function SwitchPortDetailModal() {
  const switchDetailTarget = useGameStore((s) => s.switchDetailTarget)
  const closeSwitchDetail = useGameStore((s) => s.closeSwitchDetail)
  const cabinets = useGameStore((s) => s.cabinets)
  const spineSwitches = useGameStore((s) => s.spineSwitches)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const activeIncidents = useGameStore((s) => s.activeIncidents)

  if (!switchDetailTarget) return null

  // Collect flapping link keys from active incidents
  const flappingKeys = new Set<string>()
  for (const inc of activeIncidents) {
    if (!inc.resolved && inc.def.effect === 'link_flap' && inc.affectedLinkKey) {
      flappingKeys.add(inc.affectedLinkKey)
    }
  }

  // Get link_flap incidents for display
  const flapIncidents = activeIncidents.filter(
    (i): i is ActiveIncident & { affectedLinkKey: string } =>
      !i.resolved && i.def.effect === 'link_flap' && !!i.affectedLinkKey
  )

  const isLeaf = switchDetailTarget.type === 'leaf'
  const leafCabinetIds = cabinets
    .filter(c => c.hasLeafSwitch)
    .map(c => c.id)

  if (isLeaf) {
    const cabinet = cabinets.find(c => c.id === switchDetailTarget.id)
    if (!cabinet || !cabinet.hasLeafSwitch) return null

    const { uplinks, downlinks } = getLeafPorts(
      cabinet.id,
      trafficStats.links,
      spineSwitches.length,
      cabinet.serverCount,
      cabinet.powerStatus,
      flappingKeys,
    )

    const hasIssue = uplinks.some(p => p.status === 'flapping') || downlinks.some(p => p.status === 'flapping')
    const relevantFlaps = flapIncidents.filter(i => i.affectedLinkKey.startsWith(cabinet.id + ':'))

    return (
      <TooltipProvider>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={closeSwitchDetail}>
          <div
            className="mx-4 w-full max-w-md rounded-xl border bg-card shadow-2xl"
            style={{ borderColor: hasIssue ? '#ff444460' : '#00aaff30' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Network className="size-4 text-neon-cyan" />
                <span className="text-sm font-bold text-neon-cyan tracking-widest">
                  LEAF SWITCH
                </span>
                <Badge
                  className="text-[9px] px-1.5 py-0 h-4 border"
                  style={{
                    backgroundColor: cabinet.powerStatus ? '#00aaff15' : '#ff444415',
                    color: cabinet.powerStatus ? '#00aaff' : '#ff4444',
                    borderColor: cabinet.powerStatus ? '#00aaff40' : '#ff444440',
                  }}
                >
                  {cabinet.powerStatus ? 'ONLINE' : 'OFFLINE'}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {cabinet.id.replace('cab-', 'Cabinet #')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSwitchDetail}
                className="text-muted-foreground hover:text-foreground p-1 h-auto"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* Switch front panel visualization */}
              <div className="rounded-lg border border-border/50 bg-black/40 p-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Zap className="size-3" />
                  SWITCH FRONT PANEL
                </div>

                {/* Switch body */}
                <div className="rounded border border-border/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-3 flex flex-col gap-3">
                  {/* Model label */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neon-cyan/60">ToR-48X • Leaf Switch</span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {uplinks.length} uplinks / {downlinks.length} downlinks
                    </span>
                  </div>

                  {/* Uplink ports (to spines) */}
                  <PortRow label="Uplink Ports (to Spines)" ports={uplinks} />

                  <div className="w-full h-px bg-border/20" />

                  {/* Downlink ports (to servers) */}
                  <PortRow label="Downlink Ports (to Servers)" ports={downlinks} />
                </div>
              </div>

              {/* Active flapping alerts */}
              {relevantFlaps.length > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="size-3.5 text-red-400" />
                    <span className="text-xs font-bold text-red-400">PORT ISSUES DETECTED</span>
                  </div>
                  {relevantFlaps.map(inc => {
                    const [, spineId] = inc.affectedLinkKey.split(':')
                    return (
                      <div key={inc.id} className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-red-400 animate-pulse">
                          Link to {spineId} flapping
                        </span>
                        <span className="text-muted-foreground">
                          {inc.ticksRemaining} ticks remaining
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Port legend */}
              <div className="flex flex-wrap gap-3 text-[9px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff88' }} /> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffaa00' }} /> High Util
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#ff4444' }} /> Flapping
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#333333' }} /> Empty
                </span>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  // ── Spine switch view ──────────────────────────────────────

  const spine = spineSwitches.find(s => s.id === switchDetailTarget.id)
  if (!spine) return null

  const spineIndex = spineSwitches.indexOf(spine)
  const ports = getSpinePorts(
    spine.id,
    trafficStats.links,
    leafCabinetIds,
    spine.powerStatus,
    flappingKeys,
  )

  const hasIssue = ports.some(p => p.status === 'flapping')
  const relevantFlaps = flapIncidents.filter(i => i.affectedLinkKey.endsWith(':' + spine.id))
  const utilization = trafficStats.spineUtilization[spine.id] ?? 0

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={closeSwitchDetail}>
        <div
          className="mx-4 w-full max-w-md rounded-xl border bg-card shadow-2xl"
          style={{ borderColor: hasIssue ? '#ff444460' : '#ff664430' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Network className="size-4 text-neon-orange" />
              <span className="text-sm font-bold text-neon-orange tracking-widest">
                SPINE {spineIndex + 1}
              </span>
              <Badge
                className="text-[9px] px-1.5 py-0 h-4 border"
                style={{
                  backgroundColor: spine.powerStatus ? '#ff664415' : '#ff444415',
                  color: spine.powerStatus ? '#ff6644' : '#ff4444',
                  borderColor: spine.powerStatus ? '#ff664440' : '#ff444440',
                }}
              >
                {spine.powerStatus ? 'ONLINE' : 'OFFLINE'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSwitchDetail}
              className="text-muted-foreground hover:text-foreground p-1 h-auto"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Spine stats summary */}
            <div className="flex gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Activity className="size-3" />
                Utilization:
                <span style={{
                  color: utilization > 0.8 ? '#ff4444' : utilization > 0.5 ? '#ffaa00' : '#00ff88'
                }}>
                  {Math.round(utilization * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowUpDown className="size-3" />
                Ports: <span className="text-foreground">{ports.length}</span>
              </div>
            </div>

            {/* Switch front panel */}
            <div className="rounded-lg border border-border/50 bg-black/40 p-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Zap className="size-3" />
                SWITCH FRONT PANEL
              </div>

              <div className="rounded border border-border/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neon-orange/60">CLX-9000 • Spine Switch</span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {ports.length} downlink ports
                  </span>
                </div>

                <PortRow label="Downlink Ports (to Leaf Switches)" ports={ports} />
              </div>
            </div>

            {/* Active flapping alerts */}
            {relevantFlaps.length > 0 && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="size-3.5 text-red-400" />
                  <span className="text-xs font-bold text-red-400">PORT ISSUES DETECTED</span>
                </div>
                {relevantFlaps.map(inc => {
                  const [cabId] = inc.affectedLinkKey.split(':')
                  return (
                    <div key={inc.id} className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-red-400 animate-pulse">
                        Port to {cabId.replace('cab-', 'Cab #')} flapping
                      </span>
                      <span className="text-muted-foreground">
                        {inc.ticksRemaining} ticks remaining
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Port legend */}
            <div className="flex flex-wrap gap-3 text-[9px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff88' }} /> Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffaa00' }} /> High Util
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#ff4444' }} /> Flapping
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#333333' }} /> Empty
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
