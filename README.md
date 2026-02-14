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
