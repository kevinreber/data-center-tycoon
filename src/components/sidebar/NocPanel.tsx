import { useState } from 'react'
import { useGameStore, TRAINING_JOB_CONFIG } from '@/stores/gameStore'
import type { IBLink, IBLinkStatus } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, ChevronLeft, Wrench, Power, ZapOff, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type NocTab = 'links' | 'jobs'
type StatusFilter = 'all' | IBLinkStatus

const STATUS_COLOR: Record<IBLinkStatus, string> = {
  healthy: 'text-neon-green',
  flapping: 'text-neon-yellow',
  down: 'text-neon-red',
}

const STATUS_DOT: Record<IBLinkStatus, string> = {
  healthy: 'bg-neon-green',
  flapping: 'bg-neon-yellow',
  down: 'bg-neon-red',
}

function statusRank(s: IBLinkStatus): number {
  // Sort: down → flapping → healthy so the operator's eye lands on real problems.
  return s === 'down' ? 0 : s === 'flapping' ? 1 : 2
}

/** Minimal inline sparkline. samples expected in 0..100. */
function Sparkline({ samples, color = '#aa44ff' }: { samples: number[]; color?: string }) {
  if (samples.length === 0) {
    return <div className="text-[10px] text-muted-foreground italic">No samples yet</div>
  }
  const W = 200
  const H = 36
  const pad = 2
  const max = 100
  const stepX = samples.length > 1 ? (W - pad * 2) / (samples.length - 1) : 0
  const points = samples
    .map((v, i) => `${pad + i * stepX},${H - pad - (v / max) * (H - pad * 2)}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-9" preserveAspectRatio="none" aria-label="Utilization sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.25} />
    </svg>
  )
}

export function NocPanel() {
  const ibLinks = useGameStore((s) => s.ibLinks)
  const ibSwitches = useGameStore((s) => s.ibSwitches)
  const ibLinkRepairs = useGameStore((s) => s.ibLinkRepairs)
  const infiniBandFabrics = useGameStore((s) => s.infiniBandFabrics)
  const gpuPods = useGameStore((s) => s.gpuPods)
  const selectedNocLinkId = useGameStore((s) => s.selectedNocLinkId)
  const openNocDrawer = useGameStore((s) => s.openNocDrawer)
  const drainPort = useGameStore((s) => s.drainPort)
  const resetSwitch = useGameStore((s) => s.resetSwitch)
  const replaceOptic = useGameStore((s) => s.replaceOptic)
  const dispatchElectrician = useGameStore((s) => s.dispatchElectrician)
  const tickCount = useGameStore((s) => s.tickCount)
  const money = useGameStore((s) => s.money)
  const staff = useGameStore((s) => s.staff)
  // Phase 8D: filter active fabric/cabinet incidents to show in the NOC.
  const activeIncidents = useGameStore((s) => s.activeIncidents)
  // Phase 8E: training jobs for the Jobs tab
  const trainingJobs = useGameStore((s) => s.trainingJobs)
  const restartTrainingJob = useGameStore((s) => s.restartTrainingJob)
  const cancelTrainingJob = useGameStore((s) => s.cancelTrainingJob)

  const [tab, setTab] = useState<NocTab>('links')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [fabricFilter, setFabricFilter] = useState<string>('all')

  // Empty-state: no pods → nothing to triage.
  if (gpuPods.length === 0 || infiniBandFabrics.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-neon-purple">
          <Activity className="size-3.5" />
          <span className="text-xs font-bold tracking-widest">NOC — TRAFFIC TRIAGE</span>
        </div>
        <p className="text-xs text-muted-foreground italic leading-relaxed">
          The Network Operations Center activates once a GPU pod is built and its InfiniBand backend
          fabric comes online. Until then, there's no fabric to triage.
        </p>
        <div className="text-[11px] text-muted-foreground border border-border/40 rounded p-2 bg-card/40 leading-relaxed">
          <span className="text-neon-cyan">Tip:</span> open the <span className="text-neon-pink">Build</span> panel
          and place a Small or Medium GPU pod. The NOC will populate with rail-isolated IB links the moment the
          fabric initializes.
        </div>
      </div>
    )
  }

  const selectedLink = selectedNocLinkId ? ibLinks.find((l) => l.id === selectedNocLinkId) ?? null : null

  // ── Drawer view ──
  if (selectedLink) {
    return <LinkDrawer
      link={selectedLink}
      switches={ibSwitches}
      tickCount={tickCount}
      money={money}
      hasOnShiftElectrician={staff.some((s) => s.role === 'electrician' && s.onShift)}
      repair={ibLinkRepairs.find((r) => r.linkId === selectedLink.id) ?? null}
      onClose={() => openNocDrawer(null)}
      onDrain={() => drainPort(selectedLink.id)}
      onResetFrom={() => resetSwitch(selectedLink.fromSwitchId)}
      onResetTo={() => resetSwitch(selectedLink.toSwitchId)}
      onReplaceOptic={() => replaceOptic(selectedLink.id)}
      onDispatchElectrician={() => dispatchElectrician(selectedLink.id)}
    />
  }

  // ── List view ──
  // Per-pod health summary.
  const podSummaries = gpuPods.map((pod) => {
    const fabric = infiniBandFabrics.find((f) => f.podId === pod.id)
    const links = fabric ? ibLinks.filter((l) => l.fabricId === fabric.id) : []
    return {
      pod,
      fabricId: fabric?.id ?? null,
      health: fabric?.health ?? 'healthy',
      total: links.length,
      healthy: links.filter((l) => l.status === 'healthy').length,
      flapping: links.filter((l) => l.status === 'flapping').length,
      down: links.filter((l) => l.status === 'down').length,
    }
  })

  // Filter + sort link table.
  const visibleLinks = ibLinks
    .filter((l) => statusFilter === 'all' || l.status === statusFilter)
    .filter((l) => fabricFilter === 'all' || l.fabricId === fabricFilter)
    .sort((a, b) => statusRank(a.status) - statusRank(b.status) || b.errorCount - a.errorCount)

  return (
    <div className="flex flex-col gap-3">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-1">
        <button
          onClick={() => setTab('links')}
          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            tab === 'links' ? 'bg-neon-purple/20 text-neon-purple' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          LINKS ({ibLinks.length})
        </button>
        <button
          onClick={() => setTab('jobs')}
          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            tab === 'jobs' ? 'bg-neon-purple/20 text-neon-purple' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          JOBS
        </button>
      </div>

      {tab === 'jobs' && (() => {
        const activeJobs = trainingJobs.filter((j) => j.status === 'running' || j.status === 'restarting')
        const totalValueAtRisk = activeJobs.reduce((s, j) => s + j.valueAtRisk, 0)
        const totalIncidentsSeen = activeJobs.reduce((s, j) => s + j.incidentsSeen, 0)
        if (activeJobs.length === 0) {
          return (
            <div className="text-xs text-muted-foreground italic leading-relaxed border border-dashed border-border/40 rounded p-3">
              No training jobs running. Accept a training contract from the Build panel to put your GPU pods to work.
            </div>
          )
        }
        return (
          <div className="flex flex-col gap-2">
            {/* Aggregate header */}
            <div className="rounded border border-neon-pink/30 bg-neon-pink/5 p-2 text-[10px] font-mono grid grid-cols-3 gap-2">
              <div>
                <div className="text-muted-foreground tracking-widest">JOBS</div>
                <div className="text-neon-pink text-sm">{activeJobs.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground tracking-widest">VALUE AT RISK</div>
                <div className="text-neon-yellow text-sm">${Math.round(totalValueAtRisk / 1000)}K</div>
              </div>
              <div>
                <div className="text-muted-foreground tracking-widest">INCIDENTS</div>
                <div className={`text-sm ${totalIncidentsSeen > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>{totalIncidentsSeen}</div>
              </div>
            </div>
            {/* Per-job cards */}
            {activeJobs.map((job) => {
              const cfg = TRAINING_JOB_CONFIG[job.jobType]
              const fabric = infiniBandFabrics.find((f) => f.podId === job.podId)
              const pod = gpuPods.find((p) => p.id === job.podId)
              const restartsLeft = job.slaRequirements.maxRestarts - job.restartCount
              const activityPct = fabric ? Math.round(fabric.activityLevel * 100) : 0
              const allReduceOk = fabric && fabric.activityLevel >= cfg.fabricLoadTarget * 0.9
              return (
                <div key={job.id} className="rounded border border-border/40 bg-card/40 p-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-muted-foreground">{pod?.name ?? job.podId}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{job.customerName}</div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded bg-card overflow-hidden border border-border/30">
                    <div className="h-full bg-neon-green/60 transition-all" style={{ width: `${Math.min(100, job.progressPct)}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[10px] font-mono">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-right">{job.progressPct.toFixed(0)}%</span>
                    <span className="text-muted-foreground">ETA</span>
                    <span className="text-right">{Math.ceil(job.ticksRemaining)}t</span>
                    <span className="text-muted-foreground">Value at risk</span>
                    <span className="text-right text-neon-yellow">${Math.round(job.valueAtRisk / 1000)}K</span>
                    <span className="text-muted-foreground">Fabric activity</span>
                    <span className={`text-right ${allReduceOk ? 'text-neon-green' : 'text-neon-orange'}`}>{activityPct}%</span>
                    <span className="text-muted-foreground">AllReduce ring</span>
                    <span className={`text-right ${allReduceOk ? 'text-neon-green' : 'text-neon-orange'}`}>{allReduceOk ? 'HEALTHY' : 'DEGRADED'}</span>
                    <span className="text-muted-foreground">Restarts</span>
                    <span className={`text-right ${restartsLeft === 0 ? 'text-neon-red' : 'text-foreground'}`}>{job.restartCount}/{job.slaRequirements.maxRestarts}</span>
                    {job.incidentsSeen > 0 && (
                      <>
                        <span className="text-muted-foreground">Incidents seen</span>
                        <span className="text-right text-neon-orange">{job.incidentsSeen}</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => restartTrainingJob(job.id)}
                      disabled={restartsLeft <= 0}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      Restart ({restartsLeft} left)
                    </button>
                    <button
                      onClick={() => cancelTrainingJob(job.id)}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-neon-red/30 text-neon-red hover:bg-neon-red/10"
                    >
                      Abandon
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {tab === 'links' && (
        <>
          {/* Phase 8D: active fabric / cabinet AI incidents */}
          {(() => {
            const aiIncidents = activeIncidents.filter(
              (i) => !i.resolved && (i.def.effect === 'ai_fabric' || i.def.effect === 'ai_cabinet')
            )
            if (aiIncidents.length === 0) return null
            return (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest">ACTIVE FABRIC INCIDENTS</span>
                {aiIncidents.map((inc) => {
                  const sevColor =
                    inc.def.severity === 'critical' ? 'border-neon-red/40 bg-neon-red/10 text-neon-red'
                    : inc.def.severity === 'major' ? 'border-neon-orange/40 bg-neon-orange/10 text-neon-orange'
                    : 'border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow'
                  return (
                    <div key={inc.id} className={`rounded border p-2 text-[11px] font-mono ${sevColor}`}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold flex items-center gap-1">
                          <AlertTriangle className="size-3" /> {inc.def.label}
                        </span>
                        <span className="text-[10px] tabular-nums">{inc.ticksRemaining}t</span>
                      </div>
                      <p className="text-muted-foreground leading-snug text-[10px]">{inc.def.description}</p>
                      {inc.affectedIbLinkId && (
                        <button
                          onClick={() => openNocDrawer(inc.affectedIbLinkId!)}
                          className="mt-1 text-[10px] underline hover:no-underline"
                        >
                          Inspect {inc.affectedIbLinkId} →
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}

          {/* Fabric health summary */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest">FABRIC HEALTH</span>
            {podSummaries.map(({ pod, fabricId, health, total, healthy, flapping, down }) => (
              <div
                key={pod.id}
                className={`flex items-center justify-between rounded border p-2 text-xs ${
                  health === 'critical' ? 'border-neon-red/40 bg-neon-red/5'
                  : health === 'degraded' ? 'border-neon-yellow/40 bg-neon-yellow/5'
                  : 'border-border/40 bg-card/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu className="size-3 text-neon-pink shrink-0" />
                  <span className="font-mono text-neon-pink truncate">{pod.name}</span>
                  <Badge className={`text-[9px] px-1 py-0 ${
                    health === 'critical' ? 'bg-neon-red/20 text-neon-red border-neon-red/40' :
                    health === 'degraded' ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40' :
                    'bg-neon-green/20 text-neon-green border-neon-green/40'
                  }`}>
                    {health.toUpperCase()}
                  </Badge>
                </div>
                <button
                  onClick={() => fabricId && setFabricFilter(fabricFilter === fabricId ? 'all' : fabricId)}
                  className="flex items-center gap-2 text-[10px] tabular-nums font-mono shrink-0 hover:underline"
                  title="Filter link list by this fabric"
                  disabled={!fabricId}
                >
                  <span className="text-neon-green">{healthy}</span>
                  <span className="text-neon-yellow">{flapping}</span>
                  <span className="text-neon-red">{down}</span>
                  <span className="text-muted-foreground">/ {total}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-muted-foreground tracking-widest mr-1">FILTER</span>
            {(['all', 'down', 'flapping', 'healthy'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  statusFilter === s
                    ? s === 'down' ? 'bg-neon-red/20 text-neon-red border-neon-red/40'
                      : s === 'flapping' ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40'
                      : s === 'healthy' ? 'bg-neon-green/20 text-neon-green border-neon-green/40'
                      : 'bg-neon-purple/20 text-neon-purple border-neon-purple/40'
                    : 'border-border/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
            {fabricFilter !== 'all' && (
              <button
                onClick={() => setFabricFilter('all')}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10"
              >
                FABRIC: {fabricFilter.replace('ibf-', '')} ✕
              </button>
            )}
          </div>

          {/* Link table */}
          <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-1.5 py-0.5 text-[9px] text-muted-foreground tracking-widest sticky top-0 bg-card/95 z-10 border-b border-border/40">
              <span>LINK</span>
              <span className="text-right">UTIL</span>
              <span className="text-right">ERR</span>
              <span className="text-right">STATUS</span>
            </div>
            {visibleLinks.length === 0 && (
              <p className="text-[11px] text-muted-foreground italic px-1.5 py-2">No links match the current filters.</p>
            )}
            {visibleLinks.map((link) => {
              const repair = ibLinkRepairs.find((r) => r.linkId === link.id)
              const drained = (link.drainTicksRemaining ?? 0) > 0
              return (
                <button
                  key={link.id}
                  onClick={() => openNocDrawer(link.id)}
                  className={`grid grid-cols-[1fr_auto_auto_auto] gap-2 px-1.5 py-1 text-[10px] font-mono rounded hover:bg-neon-purple/10 text-left items-center ${
                    link.status === 'down' ? 'text-neon-red' :
                    link.status === 'flapping' ? 'text-neon-yellow' :
                    'text-foreground'
                  }`}
                >
                  <span className="truncate flex items-center gap-1">
                    <span className={`inline-block size-1.5 rounded-full ${STATUS_DOT[link.status]}`} />
                    {link.id} <span className="text-muted-foreground">· rail {link.rail}</span>
                    {drained && <Badge className="text-[8px] px-1 py-0 bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40">DRAIN</Badge>}
                    {repair && <Badge className="text-[8px] px-1 py-0 bg-neon-orange/20 text-neon-orange border-neon-orange/40">REPAIR {repair.ticksRemaining}t</Badge>}
                  </span>
                  <span className="text-right tabular-nums">{link.utilizationPct.toFixed(0)}%</span>
                  <span className="text-right tabular-nums">{link.errorCount}</span>
                  <span className={`text-right text-[9px] uppercase tracking-wider ${STATUS_COLOR[link.status]}`}>{link.status}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ── Detail drawer ────────────────────────────────────────────────
function LinkDrawer({
  link,
  switches,
  tickCount,
  money,
  hasOnShiftElectrician,
  repair,
  onClose,
  onDrain,
  onResetFrom,
  onResetTo,
  onReplaceOptic,
  onDispatchElectrician,
}: {
  link: IBLink
  switches: { id: string; type: string; rail: number; lastResetTick?: number }[]
  tickCount: number
  money: number
  hasOnShiftElectrician: boolean
  repair: { id: string; ticksRemaining: number } | null
  onClose: () => void
  onDrain: () => void
  onResetFrom: () => void
  onResetTo: () => void
  onReplaceOptic: () => void
  onDispatchElectrician: () => void
}) {
  const fromSw = switches.find((s) => s.id === link.fromSwitchId)
  const toSw = switches.find((s) => s.id === link.toSwitchId)
  const fromCooldownLeft = fromSw?.lastResetTick != null ? Math.max(0, 5 - (tickCount - fromSw.lastResetTick)) : 0
  const toCooldownLeft = toSw?.lastResetTick != null ? Math.max(0, 5 - (tickCount - toSw.lastResetTick)) : 0
  const drained = (link.drainTicksRemaining ?? 0) > 0
  const inBoost = link.lastReplaceTick != null && tickCount - link.lastReplaceTick < 50
  const boostTicksLeft = inBoost ? 50 - (tickCount - link.lastReplaceTick!) : 0
  const samples = link.utilizationHistory ?? []
  const canAffordOptic = money >= 2000

  const StatusIcon = link.status === 'healthy' ? CheckCircle2 : AlertTriangle

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" onClick={onClose} className="p-1 h-auto text-muted-foreground hover:text-neon-purple">
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="text-xs font-bold tracking-widest text-neon-purple">LINK DETAIL</span>
        <Badge className={`text-[9px] ml-auto px-1 py-0 ${
          link.status === 'down' ? 'bg-neon-red/20 text-neon-red border-neon-red/40' :
          link.status === 'flapping' ? 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40' :
          'bg-neon-green/20 text-neon-green border-neon-green/40'
        }`}>
          <StatusIcon className="size-2.5 mr-0.5" />
          {link.status.toUpperCase()}
        </Badge>
      </div>

      {/* Identity card */}
      <div className="rounded border border-border/40 bg-card/40 p-2 flex flex-col gap-1 text-[11px] font-mono">
        <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span>{link.id}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fabric</span><span>{link.fabricId}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Rail</span><span>{link.rail}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Bandwidth</span><span>{link.bandwidthGbps} Gbps NDR</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">From</span><span>{fromSw?.id ?? link.fromSwitchId}{fromSw ? ` (${fromSw.type} R${fromSw.rail})` : ''}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">To</span><span>{toSw?.id ?? link.toSwitchId}{toSw ? ` (${toSw.type} R${toSw.rail})` : ''}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Errors</span><span className={link.errorCount > 10 ? 'text-neon-yellow' : link.errorCount > 30 ? 'text-neon-red' : 'text-neon-green'}>{link.errorCount}</span></div>
        {inBoost && (
          <div className="flex justify-between text-neon-cyan">
            <span>Fresh optic</span>
            <span>{boostTicksLeft}t left of error suppression</span>
          </div>
        )}
        {drained && (
          <div className="flex justify-between text-neon-cyan">
            <span>Drained</span>
            <span>{link.drainTicksRemaining}t until traffic resumes</span>
          </div>
        )}
        {repair && (
          <div className="flex justify-between text-neon-orange">
            <span>Electrician dispatched</span>
            <span>{repair.ticksRemaining}t until repair complete</span>
          </div>
        )}
      </div>

      {/* Sparkline */}
      <div className="rounded border border-border/40 bg-card/40 p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground tracking-widest">UTILIZATION ({samples.length}/50t)</span>
          <span className="text-[10px] text-neon-purple tabular-nums">{link.utilizationPct.toFixed(0)}%</span>
        </div>
        <Sparkline samples={samples} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-muted-foreground tracking-widest">ACTIONS</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDrain}
              disabled={drained || link.status === 'down'}
              className="justify-between font-mono text-xs border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan"
            >
              <span className="flex items-center gap-1.5"><ZapOff className="size-3" />Drain port</span>
              <span className="text-muted-foreground">20t</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-56">
            Force utilization to 0 for 20 ticks so the link is safe to work on. Free.
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFrom}
              disabled={fromCooldownLeft > 0 || !fromSw}
              className="justify-between font-mono text-xs border-neon-purple/20 hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple"
            >
              <span className="flex items-center gap-1.5"><Power className="size-3" />Reset switch {fromSw?.id ?? link.fromSwitchId}</span>
              <span className="text-muted-foreground">{fromCooldownLeft > 0 ? `${fromCooldownLeft}t cooldown` : '5t cooldown'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-56">
            Clears errorCount on every link attached to this switch. Won't recover down links — those need an optic.
          </TooltipContent>
        </Tooltip>

        {fromSw?.id !== toSw?.id && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetTo}
                disabled={toCooldownLeft > 0 || !toSw}
                className="justify-between font-mono text-xs border-neon-purple/20 hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple"
              >
                <span className="flex items-center gap-1.5"><Power className="size-3" />Reset switch {toSw?.id ?? link.toSwitchId}</span>
                <span className="text-muted-foreground">{toCooldownLeft > 0 ? `${toCooldownLeft}t cooldown` : '5t cooldown'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-56">Reset the far-end switch.</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReplaceOptic}
              disabled={!canAffordOptic}
              className="justify-between font-mono text-xs border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green"
            >
              <span className="flex items-center gap-1.5"><Wrench className="size-3" />Replace optic</span>
              <span className="text-muted-foreground">$2K · 50t boost</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-56">
            Swap in a fresh optic. Instantly resets the link to healthy and suppresses new errors for 50 ticks.
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDispatchElectrician}
              disabled={!hasOnShiftElectrician || repair != null}
              className="justify-between font-mono text-xs border-neon-orange/20 hover:border-neon-orange/50 hover:bg-neon-orange/10 hover:text-neon-orange"
            >
              <span className="flex items-center gap-1.5"><Wrench className="size-3" />Dispatch electrician</span>
              <span className="text-muted-foreground">10t · staff required</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-56">
            {hasOnShiftElectrician
              ? 'Hands-on repair. Takes 10 ticks; the link returns to healthy with errorCount cleared.'
              : 'No on-shift electrician available. Hire one in the Operations panel or change shift coverage.'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
