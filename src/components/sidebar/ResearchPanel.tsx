import { useGameStore, TECH_TREE, TECH_BRANCH_COLORS, PATENT_CONFIG } from '@/stores/gameStore'
import type { TechBranch } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, Check, Lock, Award } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ResearchPanel() {
  const {
    money, sandboxMode,
    unlockedTech, activeResearch, startResearch, rdSpent,
    patents, patentIncome, patentTech,
  } = useGameStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Active research progress */}
      {activeResearch && (() => {
        const tech = TECH_TREE.find((t) => t.id === activeResearch.techId)
        if (!tech) return null
        const progress = 1 - activeResearch.ticksRemaining / tech.researchTicks
        return (
          <div className="mb-1 pb-3 border-b border-border/50">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold" style={{ color: TECH_BRANCH_COLORS[tech.branch] }}>
                Researching: {tech.label}
              </span>
              <span className="text-muted-foreground tabular-nums">{activeResearch.ticksRemaining}t</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: TECH_BRANCH_COLORS[tech.branch] }}
              />
            </div>
          </div>
        )
      })()}

      {/* Tech tree by branch */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">TECH TREE</span>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {unlockedTech.length}/{TECH_TREE.length}
          </span>
        </div>
        {(['efficiency', 'performance', 'resilience'] as TechBranch[]).map((branch) => (
          <div key={branch} className="mb-3">
            <span className="text-xs font-bold tracking-wider" style={{ color: TECH_BRANCH_COLORS[branch] }}>
              {branch.toUpperCase()}
            </span>
            <div className="flex flex-col gap-0.5 mt-0.5">
              {TECH_TREE.filter((t) => t.branch === branch).map((tech) => {
                const isUnlocked = unlockedTech.includes(tech.id)
                const isResearching = activeResearch?.techId === tech.id
                const prereqMet = !tech.prereqId || unlockedTech.includes(tech.prereqId)
                const canResearch = !isUnlocked && !activeResearch && prereqMet && money >= tech.cost
                return (
                  <Tooltip key={tech.id}>
                    <TooltipTrigger asChild>
                      <div className={`flex items-center justify-between text-xs rounded px-1.5 py-0.5 ${
                        isUnlocked ? 'text-foreground' : isResearching ? 'text-neon-cyan' : prereqMet ? 'text-muted-foreground' : 'text-muted-foreground/40'
                      }`}>
                        <span className="flex items-center gap-1.5 truncate">
                          {isUnlocked ? <Check className="size-3 text-neon-green" /> : !prereqMet ? <Lock className="size-3" /> : <FlaskConical className="size-3" />}
                          {tech.label}
                        </span>
                        {!isUnlocked && !isResearching && prereqMet && (
                          <Button
                            variant="ghost"
                            size="xs"
                            disabled={!canResearch}
                            onClick={() => startResearch(tech.id)}
                            className="text-xs p-0 h-auto ml-1"
                            style={{ color: canResearch ? TECH_BRANCH_COLORS[branch] : undefined }}
                          >
                            ${(tech.cost / 1000).toFixed(0)}k
                          </Button>
                        )}
                        {isResearching && <span className="text-neon-cyan animate-pulse text-xs">...</span>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-52">
                      <p className="font-bold" style={{ color: TECH_BRANCH_COLORS[branch] }}>{tech.label}</p>
                      <p className="text-xs mt-1">{tech.description}</p>
                      <p className="text-xs mt-1 text-neon-green">{tech.effect}</p>
                      {tech.prereqId && !unlockedTech.includes(tech.prereqId) && (
                        <p className="text-xs mt-1 text-neon-red">Requires: {TECH_TREE.find((t) => t.id === tech.prereqId)?.label}</p>
                      )}
                      <p className="text-xs mt-1">Cost: ${tech.cost.toLocaleString()} | Time: {tech.researchTicks}t</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        ))}
        {rdSpent > 0 && (
          <div className="flex justify-between text-xs pt-1.5 border-t border-border/50">
            <span className="text-muted-foreground">Total R&D</span>
            <span className="text-neon-cyan tabular-nums">${rdSpent.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Patents */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Award className="size-3 text-neon-purple" />
          <span className="text-xs font-bold text-neon-purple">PATENTS</span>
          {patentIncome > 0 && <Badge variant="outline" className="text-neon-green text-[10px] ml-auto">+${patentIncome.toFixed(0)}/t</Badge>}
        </div>
        <div className="space-y-1">
          {unlockedTech.map((techId) => {
            const tech = TECH_TREE.find((t) => t.id === techId)
            const patented = patents.some((p) => p.techId === techId)
            if (!tech) return null
            return (
              <div key={techId} className="flex items-center justify-between text-[10px]">
                <span className={patented ? 'text-neon-green' : 'text-muted-foreground'}>{tech.label}</span>
                {patented ? (
                  <Badge variant="outline" className="text-neon-green text-[9px]">Patented</Badge>
                ) : (
                  <Button variant="ghost" size="xs" className="text-[9px] text-neon-purple px-1"
                    onClick={() => patentTech(techId)}
                    disabled={!sandboxMode && money < PATENT_CONFIG.cost}
                  >
                    Patent ${PATENT_CONFIG.cost}
                  </Button>
                )}
              </div>
            )
          })}
          {unlockedTech.length === 0 && <p className="text-[10px] text-muted-foreground italic">Research tech to patent it</p>}
        </div>
      </div>
    </div>
  )
}
