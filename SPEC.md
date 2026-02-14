# Technical Specifications: Fabric Tycoon

## 💻 Tech Stack
- **Frontend:** React (for UI, overlays, and Cabinet View).
- **Game Engine:** Phaser 3 (for the Isometric floor rendering).
- **State Management:** Zustand (to track the status of thousands of network nodes).
- **Simulation Engine:** Vanilla TypeScript (Logic for traffic flow and heat calculation).

## 🗺 Data Models

### 1. The Network Node (Switch/Server)
```typescript
interface Node {
  id: string;
  type: 'server' | 'leaf_switch' | 'spine_switch';
  powerStatus: boolean;
  heatLevel: number; // 0-100
  bandwidthCapacity: number; // in Gbps
  currentTraffic: number;
  connections: string[]; // Array of Node IDs
}
```

### 2. The Rack
```
TypeScript
interface Rack {
  id: string;
  position: { x: number; y: number };
  uSlots: (Node | null)[]; // 42 slots
  coolingType: 'air' | 'water';
  totalPowerDraw: number;
}
```


## 📐 System Requirements for MVP
Gemini said
To get you moving fast, I have split this into two files.

README.md: The "High-Level Vision" for Claude to understand the game's soul and mechanics.

SPECS.md: The technical "System Architecture" so Claude knows exactly how to write the code (React, Phaser, and the Logic Engine).

Copy and paste these into two separate files in a folder, then tell Claude: "Read README.md and SPECS.md, then start by building the Phase 1: Cabinet View."

File 1: README.md
Markdown
# Fabric Tycoon: Data Center Simulator

## 🛸 Project Vision
A web-based, 2D isometric Tycoon game (think Roller Coaster Tycoon) where the player builds and manages a data center. The goal is to scale from a single rack to a global AI powerhouse while balancing network topology, power consumption, and environmental impact.

## 🕹 Core Gameplay Loop
1. **Build:** Place racks, cooling units, and power sources in an isometric grid.
2. **Configure:** Open "Cabinet View" (2D) to snap in servers and switches.
3. **Connect:** Wire a "Clos Fabric" (Spine-and-Leaf) to ensure high availability.
4. **Manage:** Handle real-world and sci-fi incidents (Packet loss, leaks, alien signals).
5. **Scale:** Move from Coal Power to Fusion and Alien Energy to support massive AI workloads.

## 🛠 Key Mechanics
- **Clos Fabric Logic:** Unlike other sims, network topology matters. If a "Spine" switch fails, traffic must dynamically reroute to avoid packet loss.
- **The Heat/Water/Power Triangle:** High-density AI chips generate extreme heat. Players must choose between cheap Air Cooling or efficient (but risky) Water Cooling.
- **Scaling Tiers:** - Tier 1: Solar/Grid Power + Air Cooling.
  - Tier 2: Modular Nuclear (SMR) + Water Cooling.
  - Tier 3: Fusion/Kugelblitz (Black Hole) + Alien Cryo-Fluid.

## 🎲 Incident System
- **Real-World:** Squirrels chewing cables, fiber cuts, DDoSed tenants, leaking pipes.
- **Creative:** Sentient AI outbreaks, solar flares, and quantum decoherence.
File 2: SPECS.md
Markdown
# Technical Specifications: Fabric Tycoon

## 💻 Tech Stack
- **Frontend:** React (for UI, overlays, and Cabinet View).
- **Game Engine:** Phaser 3 (for the Isometric floor rendering).
- **State Management:** Zustand (to track the status of thousands of network nodes).
- **Simulation Engine:** Vanilla TypeScript (Logic for traffic flow and heat calculation).

## 🗺 Data Models

### 1. The Network Node (Switch/Server)
```typescript
interface Node {
  id: string;
  type: 'server' | 'leaf_switch' | 'spine_switch';
  powerStatus: boolean;
  heatLevel: number; // 0-100
  bandwidthCapacity: number; // in Gbps
  currentTraffic: number;
  connections: string[]; // Array of Node IDs
}
```

### 2. The Rack
```typeScript
interface Rack {
  id: string;
  position: { x: number; y: number };
  uSlots: (Node | null)[]; // 42 slots
  coolingType: 'air' | 'water';
  totalPowerDraw: number;
}
```

## 📐 System Requirements for MVP

### Phase 1: Cabinet View (2D)
A vertical 42U grid UI.

Drag-and-drop components (Servers/Switches) into slots.

A "Wiring Mode" to draw lines between ports.

Logic: Calculate "Over-subscription" ratio (Server Demand vs. Switch Uplink).

### Phase 2: Isometric Floor (The Tycoon View)
Render a grid-based room.

Place Racks and Cooling Units.

Visual "Heat Map" overlay.

Packet Animation: Small dots moving between racks to represent data flow.

### Phase 3: The Simulation "Brain"
PUE Calculator: Total Facility Power / IT Equipment Power.

Clos Fabric Router: A function that finds the shortest path between two servers. If a node is "Down," it must find an alternative path or return Packet_Loss = True.

Incident Trigger: A timer-based system that rolls for "Random Events."

🎨 Aesthetic Goal
Isometric Pixel Art: Clean, readable, and technical.

UI: Dark mode, "Terminal" style fonts, high-contrast alerts (neon red/green).

---

### Next Step for You
Once Claude reads these, you can give it this first task:
**"Claude, let's start with Phase 1. Create a React component for the 2D Cabinet View. I want to be able to drag a 'Leaf Switch' and a 'Server' into a 42U rack and see the power draw update in real-time."**

Would you like me to generate that first **React Boilerplate** for the Cabinet View to save Claude some time?
