# Realistic Data Center Layout — Implementation Plan

## Overview

Replace the flat grid where every tile is a valid cabinet position with a **structured row-based layout** that has physical aisles, corridors, and designated cabinet slots — like a real data center floor.

### Design Principles
- **Pre-built rows**: Suite tiers define fixed row positions with aisles between them
- **Physical aisles**: Visible walkways between cabinet rows (cold = blue, hot = red/orange)
- **Row-level facing**: All cabinets in a row face the same direction (enforced)
- **Aisle containment**: Purchasable upgrade per aisle for cooling bonus (unlocked later in game)
- **Corridors**: Main walkways at the perimeter of the data center floor

---

## Step 1: Define Row Layout Data Model (gameStore.ts)

Add new types and config for the row-based layout:

```typescript
// Row layout — each suite tier pre-defines cabinet row positions
export interface DataCenterRow {
  id: number              // row index (0, 1, 2, ...)
  gridRow: number         // actual grid Y position (accounting for aisle gaps)
  facing: CabinetFacing   // all cabinets in this row face the same direction
  slots: number           // number of cabinet slots in this row
}

// Aisle between two adjacent cabinet rows
export type AisleType = 'cold' | 'hot' | 'neutral'

export interface Aisle {
  id: number
  gridRow: number         // the grid Y position of the aisle walkway
  type: AisleType         // determined by facing of adjacent rows
  containment: boolean    // whether containment panels are installed
}

// Aisle containment upgrade config
export interface AisleContainmentConfig {
  cost: number
  coolingBonus: number         // additional cooling bonus per contained aisle
  description: string
  minSuiteTier: SuiteTier      // minimum tier to unlock
}
```

Update `SuiteConfig` to include row layout definition:

```typescript
export interface SuiteConfig {
  // ... existing fields ...
  rowLayout: {
    rows: DataCenterRow[]      // pre-defined cabinet rows
    aisles: Aisle[]            // pre-defined aisle positions
    totalGridRows: number      // total visual grid rows (cabinet rows + aisle rows + corridors)
    corridorRows: number       // corridor rows at top/bottom
  }
}
```

### Suite Tier Row Layouts

**Starter (2 cabinet rows, 4 slots each = 8 cabinets)**
```
 [corridor]
 Row 0: [_][_][_][_]  facing south
 {cold aisle}
 Row 1: [_][_][_][_]  facing north
 [corridor]
```
Total visual grid: 6 rows (1 corridor + row + aisle + row + 1 corridor)

**Standard (3 cabinet rows, 6 slots each = 18 cabinets)**
```
 [corridor]
 Row 0: [_][_][_][_][_][_]  facing south
 {cold aisle}
 Row 1: [_][_][_][_][_][_]  facing north
 {hot aisle}
 Row 2: [_][_][_][_][_][_]  facing south
 [corridor]
```
Total visual grid: 9 rows

**Professional (4 cabinet rows, 8 slots each = 32 cabinets)**
```
 [corridor]
 Row 0: facing south
 {cold aisle}
 Row 1: facing north
 {hot aisle}
 Row 2: facing south
 {cold aisle}
 Row 3: facing north
 [corridor]
```
Total visual grid: 12 rows

**Enterprise (5 cabinet rows, 10 slots each = 50 cabinets)**
```
 [corridor]
 Row 0: facing south
 {cold aisle}
 Row 1: facing north
 {hot aisle}
 Row 2: facing south
 {cold aisle}
 Row 3: facing north
 {hot aisle}
 Row 4: facing south
 [corridor]
```
Total visual grid: 15 rows

### State Fields to Add

```typescript
// In GameState interface:
aisleContainments: Set<number>   // set of aisle IDs that have containment installed

// New action:
installAisleContainment: (aisleId: number) => void
```

### Containment Config

```typescript
export const AISLE_CONTAINMENT_CONFIG: AisleContainmentConfig = {
  cost: 15000,
  coolingBonus: 0.06,         // 6% extra cooling per contained aisle (stacks)
  description: 'Install physical containment panels (doors/curtains) on this aisle to prevent hot/cold air mixing',
  minSuiteTier: 'standard',   // not available at starter tier
}
```

---

## Step 2: Update Cabinet Placement Logic (gameStore.ts)

### Changes to `addCabinet()`

Instead of accepting arbitrary `(col, row)`, validate that the position is a valid cabinet slot in a defined row:

```typescript
addCabinet: (col: number, row: number, environment, customerType, facing) => {
  // Get the row layout for current suite tier
  const layout = SUITE_TIERS[state.suiteTier].rowLayout

  // Find which cabinet row this grid position belongs to
  const cabinetRow = layout.rows.find(r => r.gridRow === row)
  if (!cabinetRow) return state  // Not a valid cabinet row (it's an aisle or corridor)

  // Validate col is within row slot count
  if (col < 0 || col >= cabinetRow.slots) return state

  // Enforce row-level facing (override user selection)
  const enforcedFacing = cabinetRow.facing

  // ... rest of existing validation (money, occupancy, etc.)
  // Create cabinet with enforcedFacing instead of user-selected facing
}
```

### Changes to `getPlacementHints()`

Update to work with row-based layout — hints reference aisles and row structure rather than generic adjacency.

### Changes to `calcAisleBonus()`

Simplify — now that rows have fixed positions and facing, the bonus is deterministic based on the layout. Add containment bonus on top.

### Changes to `countAisleViolations()`

This becomes trivial or can be removed — row-level facing enforcement means violations can't happen within a row. Cross-row violations are handled by the pre-defined layout.

---

## Step 3: Update Phaser Rendering (PhaserGame.ts)

### New `drawFloor()` — Row-Aware Floor

Instead of a uniform checkerboard, render distinct zones:

- **Cabinet row tiles**: Dark floor (existing colors), with subtle row boundary markers
- **Aisle tiles**: Distinct visual treatment:
  - Cold aisles: Blue-tinted floor (`0x001a33`) with cyan border
  - Hot aisles: Red-tinted floor (`0x1a0800`) with orange border
  - Show "COLD AISLE" / "HOT AISLE" labels
- **Corridor tiles**: Lighter floor (`0x0f1520`) with dashed border
- **Containment panels**: When installed, draw side walls/barriers on contained aisles

### Update `setGridSize()`

Accept the new row layout structure to properly position rows with aisle gaps between them.

```typescript
setGridSize(cols: number, totalRows: number, spineSlots: number, layout: RowLayout) {
  // Store row layout for position lookups
  this.rowLayout = layout
  // ... rebuild floor, grid, aisles, corridors
}
```

### Update `isoToScreen()` / `screenToIso()`

These stay the same — `(col, row)` still maps to isometric coordinates. The key difference is that cabinet rows are no longer adjacent; there are aisle/corridor rows between them.

### Update placement mode highlighting

Only highlight valid cabinet slot tiles (skip aisles and corridors). Show aisle type when hovering near an aisle.

### Add aisle rendering methods

```typescript
private drawAisles() {
  // Render cold aisles (blue), hot aisles (red/orange)
  // Label each aisle type
  // Draw containment panels if installed
}

private drawCorridors() {
  // Render main walkways at top/bottom
  // Subtle dashed border
}

private renderContainment(aisleId: number) {
  // Draw physical barrier graphics on contained aisles
  // Small isometric wall/curtain panels on aisle edges
}
```

### New public API methods

```typescript
setAisleContainment(aisleId: number, installed: boolean): void
```

---

## Step 4: Update GameCanvas Bridge (GameCanvas.tsx)

### Sync layout to Phaser

Update the suite tier sync effect to pass the full row layout:

```typescript
useEffect(() => {
  const layout = SUITE_TIERS[suiteTier].rowLayout
  scene.setGridSize(layout.rows[0].slots, layout.totalGridRows, limits.maxSpines, layout)
}, [suiteTier, sceneReady])
```

### Sync aisle containment

Add new effect to sync containment state to Phaser.

---

## Step 5: Update Build Panel UI (BuildPanel.tsx)

### Remove facing selector from BuildPanel

Since facing is now enforced per-row, the manual facing selector is no longer needed during placement. Instead, show which row the player is about to place in and its facing direction.

### Add row info display

During placement mode, show:
- Which cabinet row the cursor is over
- The row's facing direction
- The aisle types on either side
- How many slots are filled vs. available in that row

### Add aisle containment to FacilityPanel or InfrastructurePanel

Add a section for purchasing aisle containment:
- List all aisles with their type (hot/cold)
- Show whether containment is installed
- "Install Containment" button with cost and benefits
- Disabled if below minimum suite tier or already installed

---

## Step 6: Update Tick & Stats (gameStore.ts)

### Update `calcAisleBonus()`

The new version uses the structured layout:

```typescript
export function calcAisleBonus(cabinets: Cabinet[], suiteTier: SuiteTier, containments: Set<number>): number {
  const layout = SUITE_TIERS[suiteTier].rowLayout
  let bonus = 0

  // Base bonus: proper hot/cold aisle pairs are built into the layout
  // Each aisle that has cabinets on both sides gets the pair bonus
  for (const aisle of layout.aisles) {
    const rowAbove = layout.rows.find(r => r.gridRow === aisle.gridRow - 1)
    const rowBelow = layout.rows.find(r => r.gridRow === aisle.gridRow + 1)
    if (!rowAbove || !rowBelow) continue

    const hasAboveCabs = cabinets.some(c => c.row === rowAbove.gridRow)
    const hasBelowCabs = cabinets.some(c => c.row === rowBelow.gridRow)

    if (hasAboveCabs && hasBelowCabs) {
      bonus += AISLE_CONFIG.coolingBonusPerPair
    }

    // Containment bonus on top
    if (containments.has(aisle.id)) {
      bonus += AISLE_CONTAINMENT_CONFIG.coolingBonus
    }
  }

  return Math.min(AISLE_CONFIG.maxCoolingBonus + 0.15, bonus)  // higher cap with containment
}
```

### Remove `countAisleViolations()` usage

Since facing is enforced per-row, no more mixed-facing violations.

### Update `toggleCabinetFacing()`

Remove or repurpose — individual cabinets no longer have independent facing. Could be replaced with a "rotate row" action if desired.

---

## Step 7: Update Save/Load & Reset (gameStore.ts)

### `resetGame()`

Add `aisleContainments: new Set()` to reset.

### Save/Load

Serialize `aisleContainments` as an array (Sets don't JSON.stringify). Deserialize back to Set on load.

---

## Step 8: Update Tests (gameStore.test.ts)

- Update cabinet placement tests to use valid row positions
- Add tests for aisle containment purchase
- Add tests that placement is rejected on aisle/corridor tiles
- Update `setupBasicDataCenter()` helper to use valid row grid positions

---

## Step 9: Update Existing Tests & Demo Mode

- Update demo state (`loadDemoState`) to place cabinets at valid row positions
- Update any hardcoded `(col, row)` positions throughout the codebase

---

## Migration & Backward Compatibility

Cabinet `(col, row)` coordinates change meaning — `row` now maps to the actual grid row which includes aisle gaps. Existing save files will need migration or a compatibility layer.

Approach: On load, if the save doesn't include the new layout data, remap old row indices to new grid rows using the suite tier's row layout mapping.

---

## Future Exploration (Brainstorm Items)

These are explicitly deferred for later:

1. **Player-built rows**: Instead of pre-defined rows, player chooses where to place rows on the floor plan, adding another layer of strategic planning
2. **Flexible row placement**: Semi-free-form row positioning on a larger floor plan grid
3. **Row-end infrastructure slots**: Dedicated positions at row ends for PDUs, in-row cooling, network panels
4. **Aisle width upgrades**: Wider aisles for equipment cart access, reducing maintenance time
5. **Raised floor / overhead cable management**: Visual and mechanical distinction between under-floor and overhead cabling
