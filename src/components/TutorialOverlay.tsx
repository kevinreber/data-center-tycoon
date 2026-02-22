import { useGameStore, TUTORIAL_STEPS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, BookOpen, Lightbulb } from 'lucide-react'

export function TutorialOverlay() {
  const tutorialEnabled = useGameStore((s) => s.tutorialEnabled)
  const tutorialStepIndex = useGameStore((s) => s.tutorialStepIndex)
  const tutorialCompleted = useGameStore((s) => s.tutorialCompleted)
  const showWelcomeModal = useGameStore((s) => s.showWelcomeModal)
  const activeTip = useGameStore((s) => s.activeTip)
  const skipTutorial = useGameStore((s) => s.skipTutorial)
  const dismissTip = useGameStore((s) => s.dismissTip)
  const advanceTutorialStep = useGameStore((s) => s.advanceTutorialStep)

  // Don't show if welcome modal is open
  if (showWelcomeModal) return null

  // Show guided step overlay
  if (tutorialEnabled && tutorialStepIndex >= 0 && !tutorialCompleted) {
    const currentStep = TUTORIAL_STEPS[tutorialStepIndex]
    if (!currentStep) return null

    // Auto-advance the final "always" step after rendering it briefly
    const isFinalStep = currentStep.completionCheck === 'always'

    return (
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
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

          {/* Progress dots */}
          <div className="flex gap-1 mb-3">
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

          {/* Objective */}
          <p className="text-sm font-mono font-bold text-foreground mb-1">
            {currentStep.objective}
          </p>

          {/* Description */}
          <p className="text-xs font-mono text-muted-foreground mb-3">
            {currentStep.description}
          </p>

          {/* Hint panel reference */}
          {currentStep.highlightPanel && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neon-cyan">
              <ChevronRight className="size-3" />
              <span>
                Open the <strong className="uppercase">{currentStep.highlightPanel}</strong> panel in the sidebar
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
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
        <div className="rounded-lg border border-neon-yellow/30 bg-card/95 backdrop-blur-sm p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="size-3.5 text-neon-yellow shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono font-bold text-neon-yellow mb-0.5">
                {activeTip.title}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
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
