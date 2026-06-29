import { useMemo } from 'react'
import { useGameStore, OPS_TIER_CONFIG, TICKET_SLA_TICKS } from '@/stores/gameStore'
import type { IncidentTicket, TicketPriority } from '@/stores/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Ticket, Wrench, Clock, AlertTriangle, CheckCircle2, Cpu } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const PRIORITY_COLOR: Record<TicketPriority, string> = {
  P1: 'text-neon-red',
  P2: 'text-neon-orange',
  P3: 'text-neon-yellow',
}
const PRIORITY_BG: Record<TicketPriority, string> = {
  P1: 'border-neon-red/40 bg-neon-red/10',
  P2: 'border-neon-orange/40 bg-neon-orange/10',
  P3: 'border-neon-yellow/40 bg-neon-yellow/10',
}

export function TicketsPanel() {
  const {
    money, sandboxMode, tickCount, opsTier,
    tickets, activeIncidents, resolveIncident,
    ticketsOpenedTotal, ticketsResolvedTotal, ticketResolutionTickSum, ticketsSlaBreachedTotal,
  } = useGameStore()

  const costReduction = OPS_TIER_CONFIG.find((c) => c.id === opsTier)?.benefits.resolveCostReduction ?? 0

  // Map incidentId → active incident so open tickets can expose a Resolve action.
  const activeById = useMemo(
    () => new Map(activeIncidents.map((i) => [i.id, i])),
    [activeIncidents]
  )

  const open = tickets.filter((t) => t.status === 'open')
  const inProgress = tickets.filter((t) => t.status === 'in_progress')
  const resolved = tickets.filter((t) => t.status === 'resolved')
  const backlog = open.length + inProgress.length

  const mttr = ticketsResolvedTotal > 0 ? Math.round(ticketResolutionTickSum / ticketsResolvedTotal) : 0
  const p1Open = [...open, ...inProgress].filter((t) => t.priority === 'P1').length

  const renderTicket = (t: IncidentTicket) => {
    const inc = activeById.get(t.incidentId)
    const age = t.status === 'resolved'
      ? t.resolutionTicks ?? 0
      : Math.max(0, tickCount - t.createdTick)
    const sla = TICKET_SLA_TICKS[t.priority]
    const effectiveCost = inc ? Math.round(inc.def.resolveCost * (1 - costReduction)) : 0
    return (
      <div key={t.id} className={`rounded border p-2 ${t.status === 'resolved' ? 'border-border bg-muted/20 opacity-80' : PRIORITY_BG[t.priority]}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
            <Badge variant="outline" className={`text-[9px] px-1 py-0 font-bold ${PRIORITY_COLOR[t.priority]} border-current/40`}>
              {t.priority}
            </Badge>
            {t.slaBreached && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-neon-red uppercase">
                <AlertTriangle className="size-2.5" />SLA
              </span>
            )}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">
            {t.status === 'resolved' ? `done ${age}t` : `${age}/${sla}t`}
          </span>
        </div>
        <div className={`text-xs font-bold ${t.status === 'resolved' ? 'text-muted-foreground' : PRIORITY_COLOR[t.priority]}`}>
          {t.title}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1"><Cpu className="size-2.5" />{t.affectedAsset}</span>
          <span className="flex items-center gap-1"><Wrench className="size-2.5" />{t.workType}</span>
        </div>
        {t.status !== 'resolved' && inc && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => resolveIncident(inc.id)}
                disabled={!sandboxMode && money < effectiveCost}
                className="w-full justify-between font-mono text-xs mt-1.5 border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/10 hover:text-neon-green"
              >
                <span className="flex items-center gap-1.5"><Wrench className="size-3" />Dispatch fix</span>
                <span className="text-muted-foreground">
                  {costReduction > 0 ? (
                    <><s className="text-muted-foreground/50">${inc.def.resolveCost.toLocaleString()}</s> ${effectiveCost.toLocaleString()}</>
                  ) : (
                    <>${inc.def.resolveCost.toLocaleString()}</>
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Pay to immediately close this ticket
              {costReduction > 0 && <><br /><span className="text-neon-green">Ops discount: -{Math.round(costReduction * 100)}%</span></>}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Metrics dashboard */}
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Backlog" value={backlog} accent={backlog > 0 ? 'text-neon-orange' : 'text-neon-green'} />
        <Metric label="Resolved" value={ticketsResolvedTotal} accent="text-neon-green" />
        <Metric label="Avg MTTR" value={`${mttr}t`} accent="text-neon-cyan" />
        <Metric label="Filed" value={ticketsOpenedTotal} accent="text-foreground" />
        <Metric label="SLA Breach" value={ticketsSlaBreachedTotal} accent={ticketsSlaBreachedTotal > 0 ? 'text-neon-red' : 'text-neon-green'} />
        <Metric label="P1 Open" value={p1Open} accent={p1Open > 0 ? 'text-neon-red' : 'text-neon-green'} />
      </div>

      {tickets.length === 0 && (
        <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
          <Ticket className="size-3" />No tickets yet. Tickets are filed automatically when incidents occur.
        </p>
      )}

      {/* Open column */}
      {open.length > 0 && (
        <Section icon={<AlertTriangle className="size-3 text-neon-red" />} title="OPEN" count={open.length} color="text-neon-red">
          {open.map(renderTicket)}
        </Section>
      )}

      {/* In progress column */}
      {inProgress.length > 0 && (
        <Section icon={<Clock className="size-3 text-neon-orange" />} title="IN PROGRESS" count={inProgress.length} color="text-neon-orange">
          {inProgress.map(renderTicket)}
        </Section>
      )}

      {/* Resolved column */}
      {resolved.length > 0 && (
        <Section icon={<CheckCircle2 className="size-3 text-neon-green" />} title="RESOLVED" count={resolved.length} color="text-neon-green">
          {resolved.slice(0, 12).map(renderTicket)}
        </Section>
      )}
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="rounded border border-border bg-muted/20 p-2 text-center">
      <div className={`text-base font-bold font-mono leading-none ${accent}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function Section({ icon, title, count, color, children }: {
  icon: React.ReactNode; title: string; count: number; color: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`text-xs font-bold ${color}`}>{title}</span>
        <Badge variant="outline" className="text-[10px] ml-auto">{count}</Badge>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
