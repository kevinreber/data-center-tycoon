# Plan: Interactive Tutorial Mode for New Players

## Overview

Add a guided, step-by-step tutorial system that welcomes new players, explains the game's goal, and walks them through building their first data center with clear objectives. Players can skip or dismiss the tutorial at any time.

## Current State

The codebase already has:
- **State fields**: `tutorialEnabled`, `activeTip`, `seenTips` in the Zustand store
- **42 contextual tips** in `TUTORIAL_TIPS` (reactive, triggered by game conditions)
- **Actions**: `dismissTip()`, `toggleTutorial()`
- **Tick-based trigger logic** for reactive tips
- **No UI rendering** of tips (they're calculated but never shown)
- **No welcome modal** or guided onboarding

What's missing:
- Welcome modal on game start
- Guided step-by-step objectives (not just reactive tips)
- UI to display active tutorial steps and tips
- Ability to skip tutorial at any point

## Implementation Plan

### Step 1: Add Tutorial Step Types & Data (`src/stores/types.ts` + `src/stores/configs/progression.ts`)

Add a new `TutorialStep` interface and `TUTORIAL_STEPS` config for the guided onboarding sequence.

**In `types.ts`**, add:
```typescript
export interface TutorialStep {
  id: string
  title: string
  objective: string       // Clear goal text: "Build your first cabinet"
  description: string     // Explanation of why/how
  highlightPanel?: string // Which sidebar panel to hint at (e.g., 'build')
  completionCheck: string // Key used in tick() to check completion
}
```

**In `configs/progression.ts`**, add `TUTORIAL_STEPS` array (~8-10 guided steps):

1. **"Build Your First Cabinet"** — Place a cabinet on the grid. Hints at Build panel.
2. **"Power Up Your Servers"** — Add a server to your cabinet. Hints at Equipment panel.
3. **"Connect to the Network"** — Add a leaf switch (ToR). Hints at Equipment panel.
4. **"Build the Backbone"** — Add a spine switch for traffic routing. Hints at Equipment panel.
5. **"Watch the Money Flow"** — Unpause the game and observe revenue coming in.
6. **"Keep Your Cool"** — Monitor temperature as heat builds up.
7. **"Scale Up"** — Build a second cabinet with servers. Hints at Build panel.
8. **"You're Ready!"** — Tutorial complete. Points to Guide panel for advanced tips.

Each step has a clear completion condition checked against game state.

### Step 2: Add Store State & Actions (`src/stores/gameStore.ts`)

Add new state fields to `GameState` interface:
```typescript
// Guided Tutorial
showWelcomeModal: boolean
tutorialStepIndex: number     // -1 = not started, 0+ = active step
tutorialCompleted: boolean
```

Add new actions:
```typescript
startTutorial: () => void
skipTutorial: () => void
advanceTutorialStep: () => void
dismissWelcomeModal: () => void
```

Set initial state: `showWelcomeModal: true, tutorialStepIndex: -1, tutorialCompleted: false`

Update `resetGame()` to reset these fields. Update `loadGame()` and `loadDemoState()` to set `showWelcomeModal: false`.

### Step 3: Add Tutorial Step Completion Checks in `tick()` (`src/stores/gameStore.ts`)

After the existing tutorial tip logic in tick(), add guided step advancement:

```typescript
if (tutorialEnabled && tutorialStepIndex >= 0 && !tutorialCompleted) {
  const currentStep = TUTORIAL_STEPS[tutorialStepIndex]
  let completed = false
  switch (currentStep.completionCheck) {
    case 'has_cabinet': completed = cabinets.length > 0; break
    case 'has_server': completed = cabinets.some(c => c.serverCount > 0); break
    case 'has_leaf': completed = cabinets.some(c => c.hasLeafSwitch); break
    case 'has_spine': completed = spineSwitches.length > 0; break
    case 'game_unpaused': completed = gameSpeed > 0; break
    case 'observed_ticks': completed = tickCount >= prevTickCount + 3; break
    case 'has_two_cabinets': completed = cabinets.length >= 2; break
    case 'always': completed = true; break
  }
  if (completed) advanceTutorialStep()
}
```

### Step 4: Create Welcome Modal Component (`src/components/WelcomeModal.tsx`)

Full-screen overlay modal on first load:
- Dark semi-transparent backdrop
- Centered card with neon cyberpunk styling
- Game title: "FABRIC TYCOON: Data Center Simulator"
- Brief intro explaining the game concept and goals
- Two buttons: **"Start Tutorial"** (primary) and **"Skip Tutorial"** (ghost)

### Step 5: Create Tutorial Overlay Component (`src/components/TutorialOverlay.tsx`)

Non-blocking bottom overlay showing current tutorial step:
- Step counter (e.g., "Step 2 of 8")
- Objective title in bold
- Description text
- Progress dots/bar
- "Skip Tutorial" button (always visible)
- Also renders reactive `activeTip` notifications when they fire

Uses `z-40` to stay above game canvas but below achievement toasts (`z-50`).

### Step 6: Integrate into App.tsx

- Import and render `WelcomeModal` conditionally on `showWelcomeModal`
- Import and render `TutorialOverlay` conditionally on tutorial being active
- Placed alongside existing achievement toast

### Step 7: Update Settings Panel (`src/components/sidebar/SettingsPanel.tsx`)

Add tutorial controls:
- Toggle tutorial on/off (existing `toggleTutorial()`)
- "Restart Tutorial" button
- Current progress display

### Step 8: Tests (`src/stores/__tests__/gameStore.test.ts`)

Add tests for:
- Welcome modal shows on fresh game
- `startTutorial()` / `skipTutorial()` behavior
- Step completion advancement
- `resetGame()` resets tutorial state
- `loadGame()` / `loadDemoState()` suppress welcome modal

### Step 9: Lint, Test, Build Validation

Run `npm run lint`, `npm run test`, and `npm run build` to verify everything passes.

## Files Modified

| File | Change |
|------|--------|
| `src/stores/types.ts` | Add `TutorialStep` interface |
| `src/stores/configs/progression.ts` | Add `TUTORIAL_STEPS` array |
| `src/stores/gameStore.ts` | Add state fields, actions, tick logic, update resetGame/loadGame/loadDemoState |
| `src/components/WelcomeModal.tsx` | **New file** — Welcome modal component |
| `src/components/TutorialOverlay.tsx` | **New file** — Tutorial step + tip display |
| `src/App.tsx` | Render WelcomeModal + TutorialOverlay |
| `src/components/sidebar/SettingsPanel.tsx` | Add tutorial controls |
| `src/stores/__tests__/gameStore.test.ts` | Add tutorial tests |

## Design Decisions

1. **Guided steps separate from reactive tips** — The 42 existing tips are contextual hints. The new steps are sequential objectives. Both coexist.
2. **Completion checks in tick()** — Steps auto-advance when the player achieves the objective. No manual "done" buttons needed.
3. **Non-blocking overlay** — Players can interact freely while following steps. Only the welcome modal blocks.
4. **Skip anytime** — Every tutorial element has a dismiss option. Tutorial can be restarted from Settings.
