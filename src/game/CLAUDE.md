# Phaser Rules

Rules for working in `src/game/`.

## Graphics Only — No Sprites

All visuals are drawn procedurally with `Phaser.GameObjects.Graphics`. Do not import image assets, spritesheets, or use `this.load.image()`. This keeps the game zero-asset and fast to load.

## Isometric Coordinate System

The grid uses isometric projection with:
- `TILE_W = 64`, `TILE_H = 32`
- Conversion: `toIso(col, row)` maps grid positions to screen coordinates
- All positioned elements must go through the isometric transform

## Use `drawIsoCube()` for 3D Elements

For any equipment that should look three-dimensional (cabinets, switches, PDUs), use the `drawIsoCube()` helper which draws a consistent three-face isometric cube with top, left, and right faces.

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

## Data Flow Direction

**React/Zustand → Phaser only.** The Phaser scene is a rendering target. It receives state and renders it. It does not read from or write to the Zustand store directly.

The one exception is placement mode, where Phaser emits tile click/hover callbacks that `GameCanvas.tsx` routes to store actions.

## Dynamic Grid

The grid size changes when the suite tier upgrades via `setGridSize(cols, rows, spineSlots)`. All rendering logic must handle dynamic grid dimensions — don't hardcode grid sizes.

## Text Rendering

Use monospace font for all Phaser text to match the terminal/cyberpunk UI aesthetic. Keep text small and use the neon color palette.
