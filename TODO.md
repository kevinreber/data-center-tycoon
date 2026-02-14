# Fabric Tycoon — Feature Backlog

## Current PR: Cabinet View + Above-Cabinet View
- [ ] Add `viewMode` state to Zustand store (`cabinet` | `above_cabinet`)
- [ ] Cabinet View: solid cabinets/servers, dashed overhead infrastructure
- [ ] Above-Cabinet View: solid switches/cable trays/cabling, dashed cabinet outlines
- [ ] View toggle UI in HUD
- [ ] Architectural dashed-line rendering for "other plane" objects

## Next PR: Layer Filters
- [ ] Toggle visibility of individual layers within a view (cables, switches, servers, power)
- [ ] Filter UI (checkboxes or toggle chips in HUD)
- [ ] Per-layer opacity/color controls

## Future: Sub-Floor View (Plane 1)
- [ ] Third view mode: raised floor plenum
- [ ] Cooling pipes, chilled air flow visualization
- [ ] Power conduit routing
- [ ] Dashed cabinet outlines from below

## Infrastructure & Entities
- [ ] Cable tray / ladder rack entity (overhead)
- [ ] Overhead busway (power distribution) entity
- [ ] Cross-connect / patch panel entity
- [ ] Proper Rack model with 42U slots (per SPEC.md)
- [ ] ToR leaf switch placement inside rack vs. spine switches overhead
- [ ] PDU (Power Distribution Unit) entity
- [ ] In-row cooling unit entity

## Network / CLOS Fabric
- [ ] Network topology data model (connections between nodes)
- [ ] Cabling visualization (lines between connected switches)
- [ ] Spine-leaf wiring validation (over-subscription ratio)
- [ ] Traffic flow animation (packet dots moving along cables)
- [ ] Shortest-path routing with failover when a node goes down
- [ ] Bandwidth capacity and current traffic tracking

## Simulation
- [ ] Heat simulation (heat levels update over time based on load/cooling)
- [ ] Realistic PUE calculation (based on cooling type, load, ambient temp)
- [ ] Revenue generation from running servers
- [ ] Operating cost simulation (power bills, cooling costs)
- [ ] Cooling mechanics (air vs. water, efficiency trade-offs)

## Incident System
- [ ] Timer-based random event roller
- [ ] Real-world incidents: fiber cuts, squirrels, DDoS, pipe leaks
- [ ] Creative incidents: sentient AI, solar flares, quantum decoherence
- [ ] Incident notification UI and resolution mechanics

## Scaling Tiers
- [ ] Tier 1: Solar/Grid Power + Air Cooling
- [ ] Tier 2: Modular Nuclear (SMR) + Water Cooling
- [ ] Tier 3: Fusion/Kugelblitz + Alien Cryo-Fluid
- [ ] Tier unlock progression and costs

## UX / Camera
- [ ] Pan and zoom controls for isometric view
- [ ] Click-to-select cabinets/switches
- [ ] Drag-and-drop placement on grid
- [ ] Cabinet detail panel (open a rack to see 42U slots)
- [ ] Heat map overlay toggle

## Polish
- [ ] Save/load game state (localStorage or IndexedDB)
- [ ] Sound effects
- [ ] Placement animations
- [ ] Tutorial / guided first-time experience
