# /add-feature — Add a New Game System

Use this skill when adding a new game system, equipment type, mechanic, or feature to Fabric Tycoon. It enforces the 7-step integration checklist from CLAUDE.md so nothing gets missed.

## Instructions

When the user invokes `/add-feature`, ask them to describe the feature if they haven't already. Then follow **every step below in order**, confirming each is complete before moving on.

### Step 1: Define Types & Constants

File: `src/stores/gameStore.ts`

- Add any new TypeScript types or interfaces (PascalCase)
- Add simulation constants to the `SIM` object or a new config object (UPPER_SNAKE_CASE)
- If it's a catalog-style feature (like incidents or achievements), create a `*_CATALOG` array
- Remember: no `enum` or `namespace` (erasableSyntaxOnly is enabled)

### Step 2: Add State & Actions

File: `src/stores/gameStore.ts`

- Add new state fields to the `GameState` interface
- Add initial values in the `create<GameState>()` call
- Write action functions following the immutable update pattern (spread operators)
- Call `calcStats()` at the end of any action that changes power/heat-relevant state

### Step 3: Update `tick()`

File: `src/stores/gameStore.ts`

- Add processing logic in the `tick()` function (~730 lines)
- Place it in the correct section among the existing systems:
  1. Time-of-day
  2. Incidents
  3. Tech tree
  4. Power market
  5. Generators
  6. Fire system
  7. Heat
  8. Revenue
  9. Expenses
  10. Infrastructure
  11. Contracts
  12. Reputation
  13. Depreciation
  14. Achievements
  15. Traffic

### Step 4: Update `calcStats()` (if applicable)

File: `src/stores/gameStore.ts`

- If the feature affects power draw, heat generation, or other computed stats, update `calcStats()` and/or `calcTraffic()`
- Ensure the pure function signature stays clean

### Step 5: Add Phaser Rendering

File: `src/game/PhaserGame.ts`

- Add a public API method on `DataCenterScene` (e.g., `addXToScene()`, `updateX()`)
- Use `Phaser.GameObjects.Graphics` only — no sprites or images
- Follow the isometric drawing conventions (`drawIsoCube()` for 3D elements)
- Choose colors consistent with the neon palette (green=servers, cyan=leaf, orange=spine)

### Step 6: Bridge in GameCanvas

File: `src/components/GameCanvas.tsx`

- Add a `useEffect` hook to sync the new state to Phaser
- Use `useRef` to track previous counts if adding incremental objects
- Follow the existing pattern of the 10 sync effects

### Step 7: Add UI Controls

File: `src/components/HUD.tsx`

- Add controls in the appropriate HUD panel section
- Follow existing patterns: shadcn/ui buttons, Tailwind classes, neon color theme
- Wrap interactive elements with `<Tooltip>` using the established pattern
- Use `lucide-react` icons

### Final Checklist

Before marking complete, verify:

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` succeeds (TypeScript + Vite)
- [ ] New types use `import type` where appropriate (`verbatimModuleSyntax`)
- [ ] No unused variables or parameters (strict mode)
- [ ] Constants use UPPER_SNAKE_CASE, types use PascalCase
- [ ] State updates are immutable (spread operators, new arrays/objects)
- [ ] `calcStats()` called after relevant mutations
