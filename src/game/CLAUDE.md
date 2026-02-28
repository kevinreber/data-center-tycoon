# Phaser Rules

Rules for working in `src/game/`.

## Procedural Graphics Preferred

Currently all visuals are drawn procedurally with `Phaser.GameObjects.Graphics` — the game has zero image assets. Prefer this approach for new features unless sprites/images are explicitly requested. If sprites are introduced, load them in `preload()` and place assets in `public/`.

## Isometric Coordinate System

The grid uses isometric projection with:
- `TILE_W = 64`, `TILE_H = 32`
- Conversion: `toIso(col, row)` maps grid positions to screen coordinates
- All positioned elements must go through the isometric transform

## Use `drawIsoCube()` for Procedural 3D Elements

When drawing equipment procedurally (cabinets, switches, PDUs), use the `drawIsoCube()` helper which draws a consistent three-face isometric cube with top, left, and right faces. If using sprites instead, ensure they match the isometric tile dimensions (`TILE_W`/`TILE_H`).

## Color Palette

Follow the established neon color convention:
- Servers: green (`0x00ff88`)
- Leaf switches: cyan (`0x00aaff`)
- Spine switches: orange (`0xff6644`)
- New equipment should pick a distinct neon color that doesn't conflict

## Public API Pattern

Every piece of state that React needs to push into Phaser should have:
1. An `addXToScene(id, ...)` method for initial creation
2. An `updateX(id, ...)` method for state changes
3. Both methods should be public on the `DataCenterScene` class

These are called from `GameCanvas.tsx` via `useEffect` hooks — never call store actions from inside Phaser.

## Particle Effects

Particle effects use an array-based `Particle[]` system updated each frame in `updateParticles(dt)`. Spawn helpers create particles with position, velocity, color, alpha, life, and size properties. Existing particle spawners:
- `spawnFireParticles(col, row)` / `spawnSparkParticles(col, row)` / `spawnCoolMist(col, row)` / `spawnHeatShimmer(col, row)` / `spawnRefreshSparkle(col, row)` — equipment-positioned effects
- `spawnIncidentPulse(col, row)` — incident alert ring
- `spawnConstructionDust()` — brown/gray settling particles for site construction completion
- `spawnAchievementShower()` — full-screen gold particle shower

## Camera Effects

Camera effects are dispatched from the store via `pendingCameraEffects` and consumed by `GameCanvas.tsx`:
- `cameraBankruptcyZoom()` — slow zoom out to 0.5x over 2000ms with 300ms heavy shake (triggered on game over)

## Data Flow Direction

**React/Zustand → Phaser only.** The Phaser scene is a rendering target. It receives state and renders it. It does not read from or write to the Zustand store directly.

The one exception is placement mode, where Phaser emits tile click/hover callbacks that `GameCanvas.tsx` routes to store actions.

## Dynamic Grid

The grid size changes when the suite tier upgrades via `setGridSize(cols, rows, spineSlots)`. All rendering logic must handle dynamic grid dimensions — don't hardcode grid sizes.

## Text Rendering

Use monospace font for all Phaser text to match the terminal/cyberpunk UI aesthetic. Keep text small and use the neon color palette.
