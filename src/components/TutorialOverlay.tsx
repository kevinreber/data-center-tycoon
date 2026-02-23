import { useState } from 'react'
import { useGameStore, TUTORIAL_STEPS } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, BookOpen, Lightbulb, Monitor, RotateCw } from 'lucide-react'

export function TutorialOverlay() {
  const tutorialEnabled = useGameStore((s) => s.tutorialEnabled)
  const tutorialStepIndex = useGameStore((s) => s.tutorialStepIndex)
  const tutorialCompleted = useGameStore((s) => s.tutorialCompleted)
  const showWelcomeModal = useGameStore((s) => s.showWelcomeModal)
  const showRegionSelect = useGameStore((s) => s.showRegionSelect)
  const activeTip = useGameStore((s) => s.activeTip)
  const skipTutorial = useGameStore((s) => s.skipTutorial)
  const dismissTip = useGameStore((s) => s.dismissTip)
  const advanceTutorialStep = useGameStore((s) => s.advanceTutorialStep)
  const replayTutorial = useGameStore((s) => s.replayTutorial)
  const [completionDismissed, setCompletionDismissed] = useState(false)

  // Don't show if welcome modal or region select is open
  if (showWelcomeModal || showRegionSelect) return null

  // Show guided step overlay
  if (tutorialEnabled && tutorialStepIndex >= 0 && !tutorialCompleted) {
    const currentStep = TUTORIAL_STEPS[tutorialStepIndex]
    if (!currentStep) return null

    const isFinalStep = currentStep.completionCheck === 'always'

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

  // Show completion banner with replay option
  if (tutorialCompleted && !completionDismissed) {
    return (
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
        <div className="rounded-lg border border-neon-green/30 bg-card/95 backdrop-blur-sm p-4 shadow-lg glow-green">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="size-3.5 text-neon-green" />
              <span className="text-[10px] font-mono font-bold text-neon-green tracking-wider">
                TUTORIAL COMPLETE
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setCompletionDismissed(true)}
              className="text-muted-foreground hover:text-foreground"
              title="Dismiss"
            >
              <X className="size-3" />
            </Button>
          </div>
          <p className="text-xs font-mono text-muted-foreground mb-3">
            You&rsquo;ve completed the guided tutorial. You can replay it anytime from the
            {' '}<strong className="text-neon-cyan">GUIDE</strong> panel in the sidebar.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => { replayTutorial(); setCompletionDismissed(false) }}
              variant="outline"
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 font-mono text-xs px-4 gap-1.5"
              size="sm"
            >
              <RotateCw className="size-3" />
              Replay Tutorial
            </Button>
            <Button
              onClick={() => setCompletionDismissed(true)}
              className="bg-neon-green/20 border border-neon-green/40 text-neon-green hover:bg-neon-green/30 font-mono text-xs px-4"
              size="sm"
            >
              Got it!
            </Button>
          </div>
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
