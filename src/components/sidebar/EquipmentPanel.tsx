import { useGameStore, SIM, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG, DEPRECIATION, WORKLOAD_CONFIG, MAX_ACTIVE_WORKLOADS } from '@/stores/gameStore'
import type { WorkloadType } from '@/stores/gameStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function EquipmentPanel() {
  const {
    cabinets, spineSwitches,
    toggleCabinetPower, toggleSpinePower, refreshServers,
    activeWorkloads, completedWorkloads, failedWorkloads, startWorkload, cancelWorkload,
  } = useGameStore()

  const prodCount = cabinets.filter((c) => c.environment === 'production').length
  const labCount = cabinets.filter((c) => c.environment === 'lab').length
  const mgmtCount = cabinets.filter((c) => c.environment === 'management').length

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      {(cabinets.length + spineSwitches.length) > 0 && (
        <div className="text-xs text-muted-foreground">
          {prodCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.production.color }}>{prodCount} Prod</span>}
          {prodCount > 0 && (labCount > 0 || mgmtCount > 0) && ' · '}
          {labCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.lab.color }}>{labCount} Lab</span>}
          {labCount > 0 && mgmtCount > 0 && ' · '}
          {mgmtCount > 0 && <span style={{ color: ENVIRONMENT_CONFIG.management.color }}>{mgmtCount} Mgmt</span>}
          {cabinets.length > 0 && ' · '}{spineSwitches.length} Spine{spineSwitches.length !== 1 ? 's' : ''}
        </div>
      )}

      {cabinets.length === 0 && spineSwitches.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No equipment deployed yet. Use BUILD to add cabinets.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {/* Cabinets */}
          {cabinets.map((c) => {
            const envConfig = ENVIRONMENT_CONFIG[c.environment]
            const custConfig = CUSTOMER_TYPE_CONFIG[c.customerType]
            const leafTag = c.hasLeafSwitch ? '+L' : ''
            const isThrottled = c.powerStatus && c.heatLevel >= SIM.throttleTemp
            const lifeProgress = c.serverAge / DEPRECIATION.serverLifespanTicks
            const isAging = lifeProgress > 0.6
            const isEndOfLife = lifeProgress > 0.9
            const label = `C${c.id.replace('cab-', '')} ×${c.serverCount}${leafTag}`

            return (
              <Tooltip key={c.id}>
                <TooltipTrigger asChild>
                  <Badge
                    className="cursor-pointer font-mono text-xs border transition-all justify-between"
                    style={{
                      backgroundColor: isThrottled ? 'rgba(255,68,68,0.2)' : c.powerStatus ? `${envConfig.color}20` : undefined,
                      color: isThrottled ? '#ff4444' : c.powerStatus ? envConfig.color : undefined,
                      borderColor: isEndOfLife ? 'rgba(255,170,0,0.5)' : isThrottled ? 'rgba(255,68,68,0.3)' : c.powerStatus ? `${envConfig.color}40` : undefined,
                    }}
                    onClick={() => toggleCabinetPower(c.id)}
                  >
                    <span>
                      <span className="opacity-60 mr-0.5">{envConfig.label}</span>
                      {c.customerType !== 'general' && (
                        <span className="opacity-60 mr-0.5" style={{ color: custConfig.color }}>
                          {custConfig.label.charAt(0)}
                        </span>
                      )}
                      {label}
                      {!c.powerStatus && ' OFF'}
                      {isThrottled && ' HOT'}
                      {isEndOfLife && ' OLD'}
                    </span>
                    <span className="text-muted-foreground text-[10px]">{Math.round(c.heatLevel)}°C</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-60">
                  <span style={{ color: envConfig.color }}>{envConfig.name}</span>
                  {' — '}<span style={{ color: custConfig.color }}>{custConfig.label}</span>
                  {' — '}{c.serverCount} server{c.serverCount > 1 ? 's' : ''}
                  {c.hasLeafSwitch ? ' + leaf' : ''}
                  {' — '}{Math.round(c.heatLevel)}°C
                  {isThrottled ? ' (THROTTLED)' : ''}
                  <br />Age: {c.serverAge}/{DEPRECIATION.serverLifespanTicks}t ({Math.round(lifeProgress * 100)}%)
                  {isAging && <><br /><span className="text-neon-orange">Efficiency declining — consider refresh</span></>}
                  <br />Click to toggle power
                  {isAging && (
                    <>
                      <br />
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-neon-cyan p-0 h-auto"
                        onClick={(e) => { e.stopPropagation(); refreshServers(c.id) }}
                      >
                        Refresh Servers
                      </Button>
                    </>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Spine switches */}
          {spineSwitches.map((s) => (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <Badge
                  className={`cursor-pointer font-mono text-xs border transition-all ${
                    s.powerStatus
                      ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/30'
                      : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                  }`}
                  onClick={() => toggleSpinePower(s.id)}
                >
                  SPINE {s.id.replace('spine-', '#')}
                  {!s.powerStatus && ' OFF'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="right">
                Spine switch — click to toggle power
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Workload Simulation */}
      {cabinets.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-neon-purple">WORKLOADS</span>
            <Badge className="ml-auto font-mono text-xs border bg-neon-purple/20 text-neon-purple border-neon-purple/30">
              {activeWorkloads.filter(w => w.status === 'running').length}/{MAX_ACTIVE_WORKLOADS}
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground mb-2">
            {completedWorkloads > 0 && <span className="text-neon-green">{completedWorkloads} completed</span>}
            {completedWorkloads > 0 && failedWorkloads > 0 && ' · '}
            {failedWorkloads > 0 && <span className="text-neon-red">{failedWorkloads} failed</span>}
          </div>

          {/* Active workloads */}
          {activeWorkloads.filter(w => w.status === 'running' || w.status === 'migrating').map((wl) => {
            const config = WORKLOAD_CONFIG.find(c => c.type === wl.type)
            const progress = ((wl.ticksTotal - wl.ticksRemaining) / wl.ticksTotal * 100).toFixed(0)
            return (
              <div key={wl.id} className="text-xs flex items-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: config?.color ?? '#888' }} />
                <span className="text-muted-foreground truncate">{config?.label ?? wl.type}</span>
                <span className="ml-auto tabular-nums text-neon-green/80">{progress}%</span>
                <Button variant="ghost" size="xs" className="text-[9px] text-neon-red/60 hover:text-neon-red h-4 px-1" onClick={() => cancelWorkload(wl.id)}>x</Button>
              </div>
            )
          })}

          {/* Start new workload */}
          <div className="flex flex-col gap-1 mt-2">
            {WORKLOAD_CONFIG.filter(c => c.type !== 'live_migration').map((config) => {
              const eligibleCab = cabinets.find(c => c.powerStatus && c.serverCount >= config.minServers && !activeWorkloads.some(w => w.cabinetId === c.id && w.status === 'running'))
              return (
                <Tooltip key={config.type}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="xs" className="text-[9px] w-full justify-start"
                      disabled={!eligibleCab || activeWorkloads.filter(w => w.status === 'running').length >= MAX_ACTIVE_WORKLOADS}
                      onClick={() => { if (eligibleCab) startWorkload(config.type as WorkloadType, eligibleCab.id) }}>
                      <span className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: config.color }} />
                      {config.label} — ${config.basePayout.toLocaleString()}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{config.description}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
