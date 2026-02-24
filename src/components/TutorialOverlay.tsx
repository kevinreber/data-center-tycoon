import { useState, useEffect } from 'react'
import { useGameStore, TUTORIAL_STEPS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, ChevronUp, ChevronDown, BookOpen, Lightbulb, Monitor } from 'lucide-react'

/** Hook to detect mobile viewport (< 768px) */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function TutorialOverlay() {
  const tutorialEnabled = useGameStore((s) => s.tutorialEnabled)
  const tutorialStepIndex = useGameStore((s) => s.tutorialStepIndex)
  const tutorialCompleted = useGameStore((s) => s.tutorialCompleted)
  const showWelcomeModal = useGameStore((s) => s.showWelcomeModal)
  const activeTip = useGameStore((s) => s.activeTip)
  const skipTutorial = useGameStore((s) => s.skipTutorial)
  const dismissTip = useGameStore((s) => s.dismissTip)
  const advanceTutorialStep = useGameStore((s) => s.advanceTutorialStep)
  const isMobile = useIsMobile()
  const [mobileExpanded, setMobileExpanded] = useState(false)

  // Don't show if welcome modal is open
  if (showWelcomeModal) return null

  // Show guided step overlay
  if (tutorialEnabled && tutorialStepIndex >= 0 && !tutorialCompleted) {
    const currentStep = TUTORIAL_STEPS[tutorialStepIndex]
    if (!currentStep) return null

    const isFinalStep = currentStep.completionCheck === 'always'

    // ── Mobile: compact collapsed bar + expandable detail ──
    if (isMobile) {
      return (
        <div className="fixed bottom-8 left-1 right-1 z-40">
          <div className="rounded-lg border border-neon-green/30 bg-card/95 backdrop-blur-sm shadow-lg glow-green">
            {/* Collapsed bar — always visible */}
            <button
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left"
            >
              <BookOpen className="size-3 text-neon-green shrink-0" />
              <span className="text-[10px] font-mono font-bold text-neon-green shrink-0">
                {tutorialStepIndex + 1}/{TUTORIAL_STEPS.length}
              </span>
              <span className="text-[11px] font-mono font-bold text-foreground truncate flex-1">
                {currentStep.objective}
              </span>
              {mobileExpanded
                ? <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                : <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
              }
            </button>

            {/* Expanded detail */}
            {mobileExpanded && (
              <div className="px-3 pb-2.5 border-t border-border/50">
                {/* Progress bar */}
                <div className="flex gap-0.5 my-2">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        i < tutorialStepIndex
                          ? 'bg-neon-green'
                          : i === tutorialStepIndex
                            ? 'bg-neon-green/60 animate-pulse'
                            : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                <p className="text-[9px] font-mono font-bold text-neon-cyan tracking-wider mb-0.5">
                  {currentStep.title}
                </p>

                {/* Description */}
                <p className="text-[11px] font-mono text-muted-foreground mb-1.5 leading-tight">
                  {currentStep.description}
                </p>

                {/* UI hint */}
                {currentStep.uiHint && (
                  <div className="flex items-start gap-1.5 rounded border border-neon-yellow/15 bg-neon-yellow/5 p-1.5 mb-1.5">
                    <Monitor className="size-2.5 text-neon-yellow shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-neon-yellow/80 leading-tight">
                      {currentStep.uiHint}
                    </p>
                  </div>
                )}

                {/* Panel hint */}
                {currentStep.highlightPanel && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neon-cyan mb-1">
                    <ChevronRight className="size-2.5" />
                    <span>
                      Open <strong className="uppercase">{currentStep.highlightPanel}</strong> panel
                    </span>
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center justify-between mt-1">
                  {isFinalStep ? (
                    <Button
                      onClick={advanceTutorialStep}
                      className="bg-neon-green/20 border border-neon-green/40 text-neon-green hover:bg-neon-green/30 font-mono text-[11px] px-3 h-7"
                      size="sm"
                    >
                      Got it! Let me explore
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTutorial}
                    className="text-[10px] text-muted-foreground hover:text-foreground h-7 px-2"
                  >
                    Skip tutorial
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ── Desktop: full overlay ──
    return (
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
        <div className="rounded-lg border border-neon-green/30 bg-card/95 backdrop-blur-sm p-4 shadow-lg glow-green">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="size-3.5 text-neon-green" />
              <span className="text-[10px] font-mono font-bold text-neon-green tracking-wider">
                TUTORIAL — STEP {tutorialStepIndex + 1} OF {TUTORIAL_STEPS.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={skipTutorial}
              className="text-muted-foreground hover:text-foreground"
              title="Skip tutorial"
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-0.5 mb-3">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < tutorialStepIndex
                    ? 'bg-neon-green'
                    : i === tutorialStepIndex
                      ? 'bg-neon-green/60 animate-pulse'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <p className="text-[10px] font-mono font-bold text-neon-cyan tracking-wider mb-1">
            {currentStep.title}
          </p>

          {/* Objective */}
          <p className="text-sm font-mono font-bold text-foreground mb-1">
            {currentStep.objective}
          </p>

          {/* Description */}
          <p className="text-xs font-mono text-muted-foreground mb-2">
            {currentStep.description}
          </p>

          {/* UI hint */}
          {currentStep.uiHint && (
            <div className="flex items-start gap-1.5 rounded border border-neon-yellow/15 bg-neon-yellow/5 p-2 mb-2">
              <Monitor className="size-3 text-neon-yellow shrink-0 mt-0.5" />
              <p className="text-[10px] font-mono text-neon-yellow/80">
                {currentStep.uiHint}
              </p>
            </div>
          )}

          {/* Panel hint */}
          {currentStep.highlightPanel && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neon-cyan">
              <ChevronRight className="size-3" />
              <span>
                Open the <strong className="uppercase">{currentStep.highlightPanel}</strong> panel in the left sidebar
              </span>
            </div>
          )}

          {/* Final step dismiss button */}
          {isFinalStep && (
            <div className="mt-3 flex justify-center">
              <Button
                onClick={advanceTutorialStep}
                className="bg-neon-green/20 border border-neon-green/40 text-neon-green hover:bg-neon-green/30 font-mono text-xs px-4"
                size="sm"
              >
                Got it! Let me explore
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show reactive tip if one is active (and tutorial is enabled)
  if (tutorialEnabled && activeTip) {
    return (
      <div className="fixed bottom-8 md:bottom-16 left-1 md:left-1/2 right-1 md:right-auto md:-translate-x-1/2 z-40 md:w-full md:max-w-sm md:px-4">
        <div className="rounded-lg border border-neon-yellow/30 bg-card/95 backdrop-blur-sm p-2 md:p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="size-3.5 text-neon-yellow shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] md:text-xs font-mono font-bold text-neon-yellow mb-0.5">
                {activeTip.title}
              </p>
              <p className="text-[11px] md:text-xs font-mono text-muted-foreground leading-tight">
                {activeTip.message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => dismissTip(activeTip.id)}
              className="text-muted-foreground hover:text-foreground shrink-0"
              title="Dismiss tip"
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
