# CLAUDE.md — AI Assistant Guide for Fabric Tycoon

## Project Overview

**Fabric Tycoon: Data Center Simulator** is a web-based isometric tycoon game where players build and manage a data center. Players place cabinets, install servers and network switches, design a Clos (spine-leaf) network fabric, and balance power, heat, and revenue to scale from a single rack to a global operation.

**Current version:** v0.3.0

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
├── main.tsx                    # React entry point (StrictMode + root render)
├── App.tsx                     # Root component: header bar, speed controls, game loop, achievement toasts
├── index.css                   # Global styles, Tailwind imports, neon color theme
├── components/
│   ├── GameCanvas.tsx          # Phaser <-> React bridge; syncs Zustand state to Phaser scene
│   ├── HUD.tsx                 # Main control panel (build, layers, finance, traffic, equipment)
│   ├── StatusBar.tsx           # Bottom footer bar (status, nodes, tick, speed, suite tier, version)
│   └── ui/                     # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── tooltip.tsx
├── game/
│   └── PhaserGame.ts           # Phaser scene: isometric rendering, traffic visualization, placement mode
├── stores/
│   └── gameStore.ts            # Single Zustand store (~2500 lines): all game state, types, constants, actions
└── lib/
    └── utils.ts                # cn() utility for Tailwind class merging
```

### Key docs in repo root

- `README.md` — Game vision and core mechanics overview
- `SPEC.md` — Technical spec (data models, MVP systems, aesthetic goals)
- `TODO.md` — Feature backlog with completed/pending items
- `BRAINSTORM.md` — 100+ potential features rated by impact/effort

### Configuration files

- `eslint.config.js` — ESLint 9 flat config (tseslint, react-hooks, react-refresh plugins)
- `components.json` — shadcn/ui config (New York style, neutral base, CSS variables, lucide icons)
- `vite.config.ts` — Vite config with `@/` alias and Phaser manual chunk splitting
- `tsconfig.json` — Project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — App TypeScript config (strict, ES2022, bundler resolution, `verbatimModuleSyntax`)

## Architecture

### State Management — `src/stores/gameStore.ts`

All game state lives in a **single Zustand store** (`useGameStore`). This ~2500-line file contains:

- **Type definitions** (see Types section below)
- **Simulation constants** (`SIM`): revenue rates, power costs, heat generation/dissipation, temperature thresholds
- **Equipment constants**: `MAX_SERVERS_PER_CABINET` (4), `MAX_CABINETS` (50), `MAX_SPINES` (8), costs, power draw
- **Suite tier configs** (`SUITE_TIERS`): grid dimensions and spine slots per tier
- **Customer type configs** (`CUSTOMER_TYPE_CONFIG`): power/heat/revenue/bandwidth multipliers per customer
- **Infrastructure configs**: PDU options, cable tray options, aisle configuration
- **Economy configs**: loan options, depreciation, power market parameters
- **Progression configs**: tech tree (9 techs), contracts (9 contracts), achievements (25), incidents (8 types)
- **Traffic constants** (`TRAFFIC`): bandwidth per server, link capacity
- **Pure calculation functions**: `calcStats()`, `calcTraffic()`, `calcTrafficWithCapacity()`, `coolingOverheadFactor()`, `calcManagementBonus()`, `calcAisleBonus()`, and more
- **Store actions**: build, power, visual, simulation, finance, infrastructure, incidents, contracts, research

**Pattern for accessing state in components:**
```typescript
// Selective subscription (standard pattern used throughout)
const { cabinets, money, addCabinet } = useGameStore()

// Outside React (e.g., in Phaser sync)
useGameStore.getState().addCabinet()
```

State updates create new arrays/objects (immutable). After mutations, dependent stats are recalculated via `calcStats()`.

#### Types

Core types:
- `NodeType` = `'server' | 'leaf_switch' | 'spine_switch'`
- `GameSpeed` = `0 | 1 | 2 | 3`
- `CabinetEnvironment` = `'production' | 'lab' | 'management'`
- `CoolingType` = `'air' | 'water'`
- `CustomerType` = `'general' | 'ai_training' | 'streaming' | 'crypto' | 'enterprise'`
- `CabinetFacing` = `'north' | 'south'`
- `SuiteTier` = `'starter' | 'standard' | 'professional' | 'enterprise'`

Progression types:
- `TechBranch` = `'efficiency' | 'performance' | 'resilience'`
- `ReputationTier` = `'unknown' | 'poor' | 'average' | 'good' | 'excellent' | 'legendary'`
- `ContractTier` = `'bronze' | 'silver' | 'gold'`
- `IncidentSeverity` = `'minor' | 'major' | 'critical'`
- `GeneratorStatus` = `'standby' | 'running' | 'cooldown'`
- `SuppressionType` = `'none' | 'water_suppression' | 'gas_suppression'`

Key interfaces:
- `Cabinet` — grid position (col/row), environment, customerType, serverCount, hasLeafSwitch, powerStatus, heatLevel, serverAge, facing
- `SpineSwitch` — id, powerStatus
- `TrafficLink` — leafCabinetId, spineId, bandwidthGbps, capacityGbps, utilization, redirected
- `TrafficStats` — totalFlows, totalBandwidthGbps, totalCapacityGbps, redirectedFlows, links, spineUtilization
- `PDU`, `CableTray`, `CableRun` — infrastructure types
- `Loan`, `Generator`, `ActiveIncident`, `ActiveContract`, `Achievement`, `ActiveResearch`

Layer control types: `LayerVisibility`, `LayerOpacity`, `LayerColorOverrides`

#### Store Actions

| Category | Actions |
|----------|---------|
| Build | `addCabinet`, `enterPlacementMode`, `exitPlacementMode`, `upgradeNextCabinet`, `addLeafToNextCabinet`, `addSpineSwitch` |
| Power | `toggleCabinetPower`, `toggleSpinePower` |
| Visual | `toggleLayerVisibility`, `setLayerOpacity`, `setLayerColor`, `toggleTrafficVisible` |
| Simulation | `setGameSpeed`, `upgradeCooling`, `tick` |
| Finance | `takeLoan`, `refreshServers`, `upgradeSuite` |
| Infrastructure | `placePDU`, `placeCableTray`, `autoRouteCables`, `toggleCabinetFacing` |
| Incidents | `resolveIncident`, `buyGenerator`, `activateGenerator`, `upgradeSuppression` |
| Contracts | `acceptContract` |
| Research | `startResearch` |
| Misc | `dismissAchievement` |

### Phaser Rendering — `src/game/PhaserGame.ts`

The `DataCenterScene` class handles all isometric graphics using Phaser's Graphics API (no image assets — everything is procedurally drawn).

**Module-level exports:**
- `createGame(parent: string): Phaser.Game` — creates and returns Phaser game instance
- `getScene(game: Phaser.Game): DataCenterScene | undefined` — retrieves scene from game

**Grid layout (dynamic, based on suite tier):**
- Default: 4x2 cabinet grid (starter tier), up to 10x5 (enterprise tier)
- Tile dimensions: TILE_W=64, TILE_H=32
- Spine switches: horizontal row above the cabinet grid (2–8 slots by tier)

**Suite tier grid dimensions:**
| Tier | Cols x Rows | Max Cabinets | Spine Slots |
|------|-------------|-------------|-------------|
| Starter | 4x2 | 8 | 2 |
| Standard | 6x3 | 18 | 4 |
| Professional | 8x4 | 32 | 6 |
| Enterprise | 10x5 | 50 | 8 |

**Rendering pipeline per cabinet:** base frame → server layers (stacked) → leaf switch on top → LED indicators → ID label

**Color convention:**
- Servers: green (`0x00ff88`)
- Leaf switches: cyan (`0x00aaff`)
- Spine switches: orange (`0xff6644`)

**Traffic visualization:** Lines between leaf-spine pairs colored by utilization (green → yellow → red), with animated packet dots.

**Placement mode:** Interactive tile highlighting, hover hints, and click-to-place functionality for cabinets, PDUs, and cable trays.

**Public API methods:**
- `addCabinetToScene(id, col, row, serverCount, hasLeafSwitch, environment, facing)`
- `updateCabinet(id, serverCount, hasLeafSwitch, powerOn, environment, facing)`
- `addSpineToScene(id)` / `updateSpine(id, powerOn)`
- `setLayerVisibility(visibility)` / `setLayerOpacity(opacity)` / `setLayerColors(colors)`
- `setTrafficLinks(links)` / `setTrafficVisible(visible)`
- `setGridSize(cols, rows, spineSlots)` — rebuilds layout on suite upgrade
- `setPlacementMode(active)` — enter/exit interactive placement
- `setOnTileClick(callback)` / `setOnTileHover(callback)` — placement callbacks
- `syncOccupiedTiles(occupied)` — mark blocked positions
- `addPDUToScene(id, col, row, label, overloaded)` / `updatePDU(id, overloaded)`
- `addCableTrayToScene(id, col, row)`
- `clearInfrastructure()` — clears PDUs and cable trays

### React-Phaser Bridge — `src/components/GameCanvas.tsx`

`GameCanvas` manages the Phaser game instance lifecycle and syncs Zustand state changes to the Phaser scene via `useEffect` hooks. It tracks previous counts via `useRef` to only add new objects, not re-create existing ones.

**Sync effects (10 total):**
1. Initialize/destroy Phaser game on mount
2. Register tile click/hover callbacks for placement
3. Sync placement mode to Phaser
4. Sync suite tier (grid dimensions) on upgrade
5. Sync cabinets (add new, update existing, sync occupied tiles)
6. Sync spine switches (add new, update power status)
7. Sync layer visibility/opacity/colors
8. Sync traffic data
9. Sync PDUs and cable trays
10. Sync traffic visibility

### Game Tick Loop — `src/App.tsx`

A `setInterval` in `App.tsx` calls `tick()` at the rate determined by `gameSpeed` (0=paused, 1=1000ms, 2=500ms, 3=250ms). The `tick()` function (~730 lines) processes these systems per tick:

1. **Time-of-day**: Advances `gameHour` (0–23), applies demand curve and random traffic spikes
2. **Incidents**: Spawns random incidents (8 types), ticks active incidents, applies effects (revenue penalty, power surge, cooling failure, heat spike, traffic drop)
3. **Tech tree**: Ticks active research progress
4. **Power market**: Updates spot pricing with random walk, mean reversion, and price spikes (0.6–2.0x multiplier)
5. **Generators**: Manages fuel consumption, startup/cooldown, auto-activation during outages
6. **Fire system**: Triggers fires at critical temps (95°C), applies suppression logic
7. **Heat**: Generates heat per server (+1.5°C), cools via system (-2.0 to -3.5°C), affected by environment/customer type/incidents/aisle violations/PDU overloads
8. **Revenue**: $12/tick per server, modified by throttling, environment, customer type, depreciation, tech bonuses, outage/incident penalties
9. **Expenses**: Power costs with market pricing, cooling costs, loan repayments
10. **Infrastructure**: Checks aisle bonuses, cable mess penalties, PDU overloads
11. **Contracts**: Checks SLA compliance, termination/completion logic
12. **Reputation**: Adjusts score based on SLAs, outages, fires, violations
13. **Depreciation**: Ages servers, reduces efficiency after 30% of 800-tick lifespan
14. **Achievements**: Checks 25 achievement conditions
15. **Traffic**: ECMP distribution across active spines

## Game Systems

### Progression

Players upgrade through **suite tiers** (starter → standard → professional → enterprise), unlocking larger grids and more spine slots. **Reputation** (unknown → legendary) gates access to higher-tier contracts. The **tech tree** has 3 branches (efficiency, performance, resilience) with 3 techs each.

### Economy

- **Revenue** from servers, modified by customer type, environment, throttling, depreciation, and tech bonuses
- **Expenses** from power (dynamic market pricing), cooling, and loan repayments
- **Loans** available in 3 tiers with different amounts/interest/terms
- **Contracts** (bronze/silver/gold) provide bonus revenue with SLA requirements
- **Power market** fluctuates with random walk, mean reversion, and spike events

### Infrastructure

- **Cabinet environments**: production (baseline), lab (low revenue, low heat), management (3% bonus per server, capped at 30%)
- **Customer types**: general, ai_training, streaming, crypto, enterprise — each with power/heat/revenue/bandwidth multipliers
- **Cooling**: air (2.0°C/tick, free) or water (3.5°C/tick, $25,000 upgrade)
- **PDUs**: Power distribution units with capacity limits; overloaded PDUs cause heat and revenue penalties
- **Cable trays**: Organized cabling reduces messy cable penalties
- **Hot/cold aisles**: Proper cabinet facing (alternating north/south) provides cooling bonuses
- **Server depreciation**: Efficiency decays over time, refreshable for a cost

### Incidents & Resilience

- **8 incident types** with minor/major/critical severity
- **Generators**: 3 options (Small Diesel, Large Diesel, Natural Gas) with fuel management
- **Fire suppression**: none, water (cheap, some damage), gas (expensive, minimal damage)
- **Fires** trigger at critical temperature (95°C)

## Code Conventions

### TypeScript

- **Strict mode** enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax` enabled — use `import type` for type-only imports
- `erasableSyntaxOnly` enabled — no `enum` or `namespace` declarations
- Path alias: `@/` maps to `src/` (e.g., `import { useGameStore } from '@/stores/gameStore'`)
- Exported types/interfaces use PascalCase; constants use UPPER_SNAKE_CASE
- Module format: ESM (`"type": "module"` in package.json)
- Target: ES2022

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
- Dynamic grid resizing via `setGridSize()` on suite tier upgrades
- Interactive placement mode with tile hover/click callbacks

## Domain Concepts

| Term | Meaning |
|------|---------|
| Cabinet | A rack unit on the grid. Holds up to 4 servers and 1 leaf switch. Has environment and customer type. |
| Server | Compute node inside a cabinet. Generates revenue, heat, and traffic. Subject to depreciation. |
| Leaf Switch | Top-of-rack (ToR) network switch. Connects cabinet servers to spines. |
| Spine Switch | Backbone switch in the elevated row. Connects all leaf switches together. |
| Clos Fabric | Spine-leaf network topology. Every leaf connects to every spine. |
| ECMP | Equal-Cost Multipath — traffic distributed evenly across active spines. |
| PUE | Power Usage Effectiveness = (IT + Cooling) / IT. Lower is better (1.0 = perfect). |
| Thermal Throttle | Servers above 80°C earn only 50% revenue. |
| Tick | One simulation step. All systems update per tick. |
| Suite Tier | Data center size tier (starter → enterprise). Determines grid size and spine slots. |
| PDU | Power Distribution Unit. Distributes power to cabinets; can overload. |
| Hot/Cold Aisle | Cabinet facing pattern. Proper alternation provides cooling bonus. |
| Reputation | Score (0–100) that unlocks contracts and affects gameplay. |

## Simulation Parameters (quick reference)

### Base rates
- Revenue: $12/tick per active server (half if throttled)
- Power cost: $0.50/tick per kW (modified by power market spot price)
- Server power: 450W, Leaf: 150W, Spine: 250W
- Heat: +1.5°C/server/tick, +0.3°C/leaf/tick
- Air cooling: -2.0°C/tick (free), Water cooling: -3.5°C/tick ($25,000 upgrade)
- Ambient: 22°C, Throttle: 80°C, Critical: 95°C (fire trigger)
- Starting money: $50,000
- Traffic: 1 Gbps/server, 10 Gbps/link capacity

### Equipment costs
- Cabinet: $2,000, Server: $2,000, Leaf switch: $5,000, Spine switch: $12,000

### Depreciation
- Server lifespan: 800 ticks, efficiency decay starts at 30% of lifespan

### Customer type multipliers
Each customer type (general, ai_training, streaming, crypto, enterprise) has different power, heat, revenue, and bandwidth multipliers applied to base rates.

### Environment multipliers
- Production: baseline (1x revenue, 1x heat)
- Lab: reduced revenue, reduced heat
- Management: 3% bonus per management server (capped at 30%)

## Adding New Features

When adding new game systems or equipment types:

1. **Define types and constants** in `src/stores/gameStore.ts`
2. **Add state fields and actions** to the `GameState` interface and store
3. **Update `tick()`** if the feature affects per-tick simulation (~730-line function, add new system processing in the appropriate section)
4. **Update `calcStats()`** if it affects power/heat calculations
5. **Add Phaser rendering** in `src/game/PhaserGame.ts` with a public API method
6. **Bridge in `GameCanvas.tsx`** — add `useEffect` hooks to sync new state to Phaser
7. **Add UI controls** in `src/components/HUD.tsx` following existing panel patterns

For new shadcn/ui components: `npx shadcn add <component-name>` (configured in `components.json`).

### Adding new incident types

Add to `INCIDENT_CATALOG` in `gameStore.ts`. The `tick()` function handles spawning, ticking, and resolving incidents automatically based on catalog entries.

### Adding new achievements

Add to `ACHIEVEMENT_CATALOG` in `gameStore.ts`. The `tick()` function checks all achievement conditions each tick and unlocks them when met. `App.tsx` handles displaying the toast notification.

### Adding new tech tree entries

Add to `TECH_TREE` in `gameStore.ts`. Research is managed by `startResearch` action, progress ticked in `tick()`, and bonuses applied where relevant in the tick loop.

## Build & Deployment

- Phaser is split into a separate chunk via `manualChunks` in `vite.config.ts`
- Production build: `npm run build` outputs to `dist/`
- No CI/CD pipeline configured — development uses PR-based workflow
- No test suite — validate changes with `npm run lint` and `npm run build`
