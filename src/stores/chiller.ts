import type { CoolingUnit, ChillerPlant, CoolingPipe } from './types'
import { CHILLER_PLANT_CONFIG } from './configs/equipment'

/** Check if a cooling unit is connected to an operational chiller plant.
 *  A unit is "connected" if:
 *  1. It is within Manhattan distance of a chiller's range, OR
 *  2. There is a chain of adjacent pipes from the unit to within the chiller's range.
 *  Returns the best (highest) efficiency bonus from any connected chiller. */
export function getChillerConnection(
  unit: CoolingUnit,
  chillerPlants: ChillerPlant[],
  coolingPipes: CoolingPipe[],
): { connected: boolean; efficiencyBonus: number } {
  const operationalChillers = chillerPlants.filter((c) => c.operational)
  if (operationalChillers.length === 0) return { connected: false, efficiencyBonus: 0 }

  let bestBonus = 0

  for (const chiller of operationalChillers) {
    const cfg = CHILLER_PLANT_CONFIG.find((c) => c.tier === chiller.tier)
    if (!cfg) continue

    // Direct range check
    const directDist = Math.abs(unit.col - chiller.col) + Math.abs(unit.row - chiller.row)
    if (directDist <= cfg.range) {
      bestBonus = Math.max(bestBonus, cfg.efficiencyBonus)
      continue
    }

    // Flood-fill through pipes to check extended connectivity
    if (coolingPipes.length === 0) continue

    // BFS from chiller through adjacent pipes
    const visited = new Set<string>()
    const queue: Array<{ col: number; row: number }> = [{ col: chiller.col, row: chiller.row }]
    visited.add(`${chiller.col},${chiller.row}`)

    // Also add all tiles within chiller base range as starting points
    for (const pipe of coolingPipes) {
      const pipeDist = Math.abs(pipe.col - chiller.col) + Math.abs(pipe.row - chiller.row)
      if (pipeDist <= cfg.range) {
        const key = `${pipe.col},${pipe.row}`
        if (!visited.has(key)) {
          visited.add(key)
          queue.push({ col: pipe.col, row: pipe.row })
        }
      }
    }

    // BFS through connected pipes
    let found = false
    while (queue.length > 0) {
      const curr = queue.shift()!
      // Check if this position is adjacent to the cooling unit
      if (Math.abs(curr.col - unit.col) + Math.abs(curr.row - unit.row) <= 1) {
        found = true
        break
      }
      // Expand to adjacent pipes
      for (const pipe of coolingPipes) {
        const key = `${pipe.col},${pipe.row}`
        if (visited.has(key)) continue
        if (Math.abs(pipe.col - curr.col) + Math.abs(pipe.row - curr.row) === 1) {
          visited.add(key)
          queue.push({ col: pipe.col, row: pipe.row })
        }
      }
    }

    if (found) {
      bestBonus = Math.max(bestBonus, cfg.efficiencyBonus)
    }
  }

  return bestBonus > 0
    ? { connected: true, efficiencyBonus: bestBonus }
    : { connected: false, efficiencyBonus: 0 }
}
