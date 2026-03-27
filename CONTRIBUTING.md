# Contributing to Fabric Tycoon

Thanks for your interest in contributing to Fabric Tycoon! This guide will help you get set up and make your first contribution.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Adding Game Features](#adding-game-features)

## Getting Started

### Prerequisites

- **Node.js** >= 18 (tested with v22)
- **npm** >= 9

### Local Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/data-center-tycoon.git
cd data-center-tycoon

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/data-center-tycoon/`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check (tsc) then production build |
| `npm run lint` | Lint all `.ts`/`.tsx` files with ESLint |
| `npm run test` | Run Vitest test suite |
| `npm run preview` | Serve the production build locally |

### Demo Mode

Append `?demo=true` to the URL to load a pre-populated professional-tier data center for quick exploration.

## Development Workflow

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes (see [Code Style](#code-style) below).
3. Run quality checks:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
4. Commit with a clear message describing **what** and **why**.
5. Push and open a pull request against `main`.

## Project Structure

```
src/
├── components/          # React UI components
│   ├── ui/              # shadcn/ui primitives (button, card, tooltip, etc.)
│   └── sidebar/         # Game panel components (Build, Finance, Network, etc.)
├── game/
│   └── PhaserGame.ts    # Isometric Phaser 3 rendering (no image assets)
├── stores/
│   ├── gameStore.ts     # Single Zustand store — all game state and actions
│   ├── types.ts         # TypeScript type definitions
│   ├── constants.ts     # Simulation constants
│   ├── calculations.ts  # Pure calculation functions
│   └── configs/         # Data-driven config catalogs (economy, equipment, etc.)
└── lib/
    └── utils.ts         # Tailwind class merge utility
```

Key files to know:

- **`src/stores/gameStore.ts`** — The single source of truth for all game state. Start here when understanding any game system.
- **`src/game/PhaserGame.ts`** — All isometric rendering. Uses procedural graphics only (no sprites/images).
- **`src/components/GameCanvas.tsx`** — Bridge between React (Zustand) and Phaser. Syncs state via `useEffect` hooks.
- **`src/App.tsx`** — Game tick loop, achievement toasts, top-level layout.

## Code Style

### TypeScript

- **Strict mode** is enabled. No `any` types, no unused variables.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is on).
- Do **not** use `enum` or `namespace` — use union types and plain objects instead.
- Path alias: `@/` maps to `src/` (e.g., `import { useGameStore } from '@/stores/gameStore'`).

### React

- Function components only.
- Use Tailwind utility classes for styling — no CSS modules.
- Follow the existing sidebar panel pattern in `src/components/sidebar/` for new UI.

### Zustand Store

- All state updates must be **immutable** (spread operators, not mutation).
- Always call `calcStats()` and/or `calcTraffic()` after state mutations that affect power, heat, or traffic.
- Reset new state fields in `resetGame()`.

### Phaser

- All visuals use `Phaser.GameObjects.Graphics` — no image assets or sprites.
- Use `drawIsoCube()` for consistent 3D isometric rendering.
- Expose public API methods on the scene class; call them from `GameCanvas.tsx`.

### Formatting

- Monospace font throughout the UI.
- Dark terminal/cyberpunk aesthetic with neon colors (`--neon-green`, `--neon-cyan`, `--neon-orange`).
- Use shadcn/ui components from `src/components/ui/` for consistency.

## Making Changes

### Modifying Game Logic

Most game logic lives in `src/stores/gameStore.ts`. The `tick()` function runs every game tick and processes all systems in a specific order — be mindful of where you add new logic.

### Modifying the UI

- Sidebar panels are in `src/components/sidebar/`.
- To add a new panel, create a component and register it in `Sidebar.tsx` (add to `PanelId`, `SIDEBAR_ITEMS`, `PANEL_TITLES`, and the `PanelContent` switch).

### Modifying Rendering

- Phaser rendering is in `src/game/PhaserGame.ts`.
- React-Phaser sync is in `src/components/GameCanvas.tsx` — add a `useEffect` hook for new state that needs rendering.

## Testing

Tests use **Vitest** with a `jsdom` environment.

```bash
# Run all tests
npm run test

# Run tests in watch mode (useful during development)
npx vitest
```

- Test files: `src/stores/gameStore.test.ts` and `src/stores/__tests__/gameStore.test.ts`
- Use the `setupBasicDataCenter()` helper for a standard test fixture.
- Each `describe()` block covers a game system. Add tests for new store actions and tick behavior.

## Submitting a Pull Request

1. Ensure all checks pass:
   ```bash
   npm run lint && npm run test && npm run build
   ```
2. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely.
3. Mark which systems are affected.
4. Describe your manual testing steps.
5. Update documentation if needed:
   - `CLAUDE.md` — for new types, actions, systems, or count changes
   - `TODO.md` — if feature status changed
   - `src/components/sidebar/BuildLogsPanel.tsx` — for player-visible changes (changelog)

### PR Review

All PRs require approval from a code owner. CI runs lint, test, and build automatically on every PR.

## Adding Game Features

Follow the 9-step checklist for new game systems:

1. **Define types and constants** in `src/stores/types.ts` and `src/stores/constants.ts` (or the relevant config file)
2. **Add state fields and actions** to the `GameState` interface and store
3. **Update `tick()`** if the feature affects per-tick simulation
4. **Update `calcStats()`** if it affects power/heat calculations
5. **Add Phaser rendering** in `src/game/PhaserGame.ts`
6. **Bridge in `GameCanvas.tsx`** — add `useEffect` hooks to sync state to Phaser
7. **Add UI controls** in the appropriate sidebar panel
8. **Add tests** in `src/stores/__tests__/gameStore.test.ts`
9. **Update `resetGame()`** to reset new state fields

### Adding Specific Content

| Content Type | Where to Add | Auto-handled |
|-------------|-------------|-------------|
| Incident types | `INCIDENT_CATALOG` in configs | Spawning, ticking, resolving via `tick()` |
| Achievements | `ACHIEVEMENT_CATALOG` in configs | Condition checking via `tick()` |
| Tech tree entries | `TECH_TREE` in configs | Research progress via `tick()` |
| Sidebar panels | `src/components/sidebar/` | Register in `Sidebar.tsx` |

## Questions?

Open an issue on GitHub if you have questions or need help getting started. We're happy to help!
