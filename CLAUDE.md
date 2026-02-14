# CLAUDE.md — AI Assistant Guide for Fabric Tycoon

## Project Overview

**Fabric Tycoon: Data Center Simulator** is a web-based isometric tycoon game where players build and manage a data center. Players place cabinets, install servers and network switches, design a Clos (spine-leaf) network fabric, and balance power, heat, and revenue to scale from a single rack to a global operation.

**Current version:** v0.2.0 (early prototype)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 |
| Game Engine | Phaser 3 (isometric 2D rendering) |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York style) |
| Build Tool | Vite 7 |
| Language | TypeScript 5.9 (strict mode) |
| Icons | lucide-react |
| Linting | ESLint 9 (flat config) |

## Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # Type-check (tsc -b) then production build (vite build)
npm run lint      # Lint all .ts/.tsx files with ESLint
npm run preview   # Serve production build locally
```

There is no test runner configured. Linting (`npm run lint`) is the primary code quality check.

## Project Structure

```
src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root component: header bar, speed controls, game loop
├── index.css                   # Global styles, Tailwind imports, neon color theme
├── components/
│   ├── GameCanvas.tsx          # Phaser <-> React bridge; syncs Zustand state to Phaser scene
│   ├── HUD.tsx                 # Main control panel (build, layers, finance, traffic, equipment)
│   ├── StatusBar.tsx           # Bottom footer bar (status, nodes, tick, speed, version)
│   └── ui/                     # shadcn/ui primitives (button, badge, card, tooltip)
├── game/
│   └── PhaserGame.ts           # Phaser scene: isometric rendering, traffic visualization
├── stores/
│   └── gameStore.ts            # Single Zustand store: all game state, types, constants, actions
└── lib/
    └── utils.ts                # cn() utility for Tailwind class merging
```

### Key docs in repo root

- `README.md` — Game vision and core mechanics overview
- `SPEC.md` — Technical spec (data models, MVP systems, aesthetic goals)
- `TODO.md` — Feature backlog with completed/pending items
- `BRAINSTORM.md` — 100+ potential features rated by impact/effort

## Architecture

### State Management — `src/stores/gameStore.ts`

All game state lives in a **single Zustand store** (`useGameStore`). This file contains:

- **Type definitions**: `Cabinet`, `SpineSwitch`, `TrafficLink`, `TrafficStats`, `NodeType`, `GameSpeed`
- **Simulation constants** (`SIM`): revenue rates, power costs, heat generation/dissipation, temperature thresholds
- **Equipment constants**: `MAX_SERVERS_PER_CABINET` (4), `MAX_CABINETS` (32), `MAX_SPINES` (6), costs, power draw
- **Traffic constants** (`TRAFFIC`): bandwidth per server, link capacity
- **Pure calculation functions**: `calcStats()`, `calcTraffic()`, `coolingOverheadFactor()`
- **Store actions**: build actions, power toggles, visual layer controls, `tick()` (core game loop)

**Pattern for accessing state in components:**
```typescript
// Selective subscription (standard pattern used throughout)
const { cabinets, money, addCabinet } = useGameStore()

// Outside React (e.g., in Phaser sync)
useGameStore.getState().addCabinet()
```

State updates create new arrays/objects (immutable). After mutations, dependent stats are recalculated via `calcStats()`.

### Phaser Rendering — `src/game/PhaserGame.ts`

The `DataCenterScene` class handles all isometric graphics using Phaser's Graphics API (no image assets — everything is procedurally drawn).

**Grid layout:**
- Cabinets: 8x4 isometric grid (TILE_W=64, TILE_H=32)
- Spine switches: 6-slot horizontal row above the cabinet grid

**Rendering pipeline per cabinet:** base frame → server layers (stacked) → leaf switch on top → LED indicators → ID label

**Color convention:**
- Servers: green (`0x00ff88`)
- Leaf switches: cyan (`0x00aaff`)
- Spine switches: orange (`0xff6644`)

**Traffic visualization:** Lines between leaf-spine pairs colored by utilization (green→yellow→red), with animated packet dots.

### React-Phaser Bridge — `src/components/GameCanvas.tsx`

`GameCanvas` manages the Phaser game instance lifecycle and syncs Zustand state changes to the Phaser scene via `useEffect` hooks. It tracks previous counts via `useRef` to only add new objects, not re-create existing ones.

### Game Tick Loop — `src/App.tsx`

A `setInterval` in `App.tsx` calls `tick()` at the rate determined by `gameSpeed` (0=paused, 1=1000ms, 2=500ms, 3=250ms). Each tick:
1. Updates heat per cabinet (generation from active equipment, dissipation from cooling)
2. Recalculates power/PUE stats
3. Computes revenue (with thermal throttle penalty above 80°C)
4. Computes expenses (power + cooling costs)
5. Updates money balance
6. Recalculates traffic flows (ECMP across active spines)

## Code Conventions

### TypeScript

- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Path alias: `@/` maps to `src/` (e.g., `import { useGameStore } from '@/stores/gameStore'`)
- Use `type` imports for type-only imports (`import type { ... }`)
- Exported types/interfaces use PascalCase; constants use UPPER_SNAKE_CASE
- Module format: ESM (`"type": "module"` in package.json)

### React Components

- Function components only (no class components)
- Components are default-exported from `App.tsx`, named-exported everywhere else
- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn add <component>`
- Tooltip wrapping pattern: always wrap interactive elements with `<Tooltip><TooltipTrigger asChild>...<TooltipContent>` within a `<TooltipProvider>`
- All layout uses Tailwind utility classes; no separate CSS modules

### Styling

- Dark terminal/cyberpunk aesthetic with neon colors
- Custom CSS variables defined in `src/index.css` for neon colors (`--neon-green`, `--neon-cyan`, `--neon-orange`, etc.)
- Tailwind custom classes: `text-neon-green`, `text-glow-green`, `glow-green`, `animate-blink`, etc.
- Font: monospace throughout (both UI and Phaser text)
- shadcn config: New York style, neutral base color, CSS variables enabled, no RSC

### Zustand Store

- Single store pattern — all state in one `create<GameState>()` call
- Actions defined inline in the store creator
- Immutable updates: spread operators to create new arrays/objects
- Stats recalculated after every mutation via `calcStats()` and `calcTraffic()`
- Module-level `let` counters for auto-incrementing IDs (`nextCabId`, `nextSpineId`)

### Phaser

- Single scene (`DataCenterScene`) handles all rendering
- All visuals drawn with `Phaser.GameObjects.Graphics` (no sprites/images)
- Three-face isometric cube rendering via `drawIsoCube()` for consistent 3D look
- Public API methods on the scene class called from `GameCanvas.tsx`
- Traffic packet animation driven by Phaser's `update()` loop with a phase counter

## Domain Concepts

| Term | Meaning |
|------|---------|
| Cabinet | A rack unit on the grid. Holds up to 4 servers and 1 leaf switch. |
| Server | Compute node inside a cabinet. Generates revenue, heat, and traffic. |
| Leaf Switch | Top-of-rack (ToR) network switch. Connects cabinet servers to spines. |
| Spine Switch | Backbone switch in the elevated row. Connects all leaf switches together. |
| Clos Fabric | Spine-leaf network topology. Every leaf connects to every spine. |
| ECMP | Equal-Cost Multipath — traffic distributed evenly across active spines. |
| PUE | Power Usage Effectiveness = (IT + Cooling) / IT. Lower is better (1.0 = perfect). |
| Thermal Throttle | Servers above 80°C earn only 50% revenue. |
| Tick | One simulation step. Revenue, expenses, heat, and traffic update per tick. |

## Simulation Parameters (quick reference)

- Revenue: $12/tick per active server (half if throttled)
- Power cost: $0.50/tick per kW
- Server power: 450W, Leaf: 150W, Spine: 250W
- Heat: +1.5°C/server/tick, +0.3°C/leaf/tick, -2.0°C/tick air cooling
- Ambient: 22°C, Throttle: 80°C, Critical: 95°C
- Starting money: $50,000
- Traffic: 1 Gbps/server, 10 Gbps/link capacity

## Adding New Features

When adding new game systems or equipment types:

1. **Define types and constants** in `src/stores/gameStore.ts`
2. **Add state fields and actions** to the `GameState` interface and store
3. **Update `tick()`** if the feature affects per-tick simulation
4. **Update `calcStats()`** if it affects power/heat calculations
5. **Add Phaser rendering** in `src/game/PhaserGame.ts` with a public API method
6. **Bridge in `GameCanvas.tsx`** — add `useEffect` hooks to sync new state to Phaser
7. **Add UI controls** in `src/components/HUD.tsx` following existing panel patterns

For new shadcn/ui components: `npx shadcn add <component-name>` (configured in `components.json`).

## Build & Deployment

- Phaser is split into a separate chunk via `manualChunks` in `vite.config.ts`
- Production build: `npm run build` outputs to `dist/`
- No CI/CD pipeline configured — development uses PR-based workflow
- No test suite — validate changes with `npm run lint` and `npm run build`
