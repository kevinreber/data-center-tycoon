# Visual References — Hardware Art Direction

Reference projects for making the isometric hardware (cabinets, servers, leaf/spine switches, routers, GPU nodes) look more polished and realistic. Use these as targets for style, not as assets to copy — nothing from these projects is licensed for reuse here.

## The references

### 1. Designed to Scale — interactive system design course

- URL: https://designed-to-scale.vercel.app/#/sql-nosql/3
- Author: Dilum Sanjaya
- Look: dark warm-gray canvas, isometric shapes with a thick light outline, rounded corners, gradient faces, a soft glow around "hot" objects, animated request/response dots travelling along dashed paths, monospace labels in pill-shaped badges.
- Tech (inspected from the production bundle, Nov 2026):
  - Vanilla JavaScript built with Vite — no React/Vue/Svelte and no rendering library (no Three.js, Pixi, D3, GSAP).
  - Every diagram is **SVG built at runtime** with a tiny `createElementNS` helper that sets attributes from an object.
  - Depth and glow come from SVG `<linearGradient>` fills and `<filter>` blurs (`feGaussianBlur` at 2.2 / 4 / 6.5 px) layered under shapes, plus a CSS `drop-shadow`.
  - Animation is hand-rolled: `requestAnimationFrame` plus custom cubic easing functions (`inOut`, `out`, `back`).
  - Icons on faces are inlined Lucide icon paths.
  - Font: JetBrains Mono. Palette is defined as CSS variables (`--paper`, `--ink`, `--edge`, `--green-*`, `--violet-*`), with light and dark themes.

### 2. Protocol Explorer — learn how the internet works

- URL: https://protocol-explorer-alpha.vercel.app/
- Author: Dilum Sanjaya (same author as above)
- Look: blueprint style — white canvas with a faint isometric grid, navy line-art hardware (router with antenna, rack servers with drive bays, laptop, cloud), light blue face fills, soft offset floor shadow, dashed arrows for packet flow.
- **Most relevant to our hardware**: its server and DNS-resolver racks show exactly the level of front-panel detail (stacked 1U units, drive-bay slots, vents) we want for cabinets and servers.
- Tech (inspected from the production bundle, Nov 2026):
  - Vanilla JavaScript + Vite, SVG generated as strings (`<polygon points="…">`, `<polyline>`).
  - Hand-written isometric projection: a function of the form `(x, y, z) => [ox + (x - y) * cos30, oy + (x + y) * sin30 - z]`, then each face is emitted as a polygon. This is the same math as our `toIso()` / `drawIsoCube()` — the difference is entirely in the detail drawn on each face.
  - `<linearGradient>` fills for subtle face shading; no blur filters (the look is crisp line art).
  - Font: Iosevka. Light and dark themes.

### 3. Shelf-Made Tycoon — warehouse tycoon game (Steam)

- Source: Steam store page / trailer (screenshot shared Nov 2026).
- Look: clean low-poly 3D seen from a fixed isometric angle, flat colors with gentle shading, thin dark outlines on edges, bold readable numbers on objects (dock doors "8", "9"), yellow/black safety striping, translucent "ghost" preview when placing a building, floating `-$900` cost text.
- Tech: not inspected (native game, not a web bundle). It appears to be real 3D with an orthographic camera and outline shading, which is why it looks solid from every angle and supports a Rotate (R) action.
- UI ideas worth borrowing independent of rendering: compact top-left cash pill with "due" amount, day/season clock with 1×/2×/4× speed buttons, objective banner ("Survive the first week · 0/7 days"), right-side build rail with per-item counters (`19/42`), minimap, and keyboard hints in the bottom bar.

### 4. WareTrack (concept dashboard)

- Source: a design screenshot shared Nov 2026 (no URL).
- Look: bright, soft-lit 3D models (ambient occlusion, soft shadows) under an orthographic camera, with floating KPI cards and map pins over the scene. This is pre-rendered or real-time 3D lighting, which cannot be reproduced with flat polygons alone.

## What this means for Fabric Tycoon

> Status (v0.6.2): implemented as the v2 hardware renderer, now the default. Everything below is the original analysis; see `docs/HARDWARE_VISUALS_PLAN.md` for what was built and how it differs (Canvas 2D textures rather than `generateTexture`, no perforated door mesh).

Our renderer (`src/game/PhaserGame.ts`) already uses the same isometric projection as references 1 and 2. They look better because of what is drawn on each face, not because of better technology. In rough order of impact:

1. **Outlines** — a 1–2 px stroke around each cube silhouette (darker than the fill in a light theme, lighter in a dark theme).
2. **Face gradients** — shade each face from light to dark instead of one flat color.
3. **Front-panel detail** — 1U/2U bezels, drive bays, vent grilles, port rows with link LEDs, a perforated cabinet door, GPU heatsink fins, coolant hoses.
4. **Contact shadow** — a soft offset ellipse or parallelogram under each object.
5. **Glow for state** — a blurred colored halo for hot, overloaded or alerting hardware (in Phaser: a pre-blurred texture or the FX pipeline's glow, not a per-frame blur).
6. **Rounded corners and readable labels** — big IDs on the face, like the dock numbers in Shelf-Made Tycoon.

The implementation plan is in `docs/HARDWARE_VISUALS_PLAN.md`.

The polish level of references 1 and 2 is reachable in Phaser by upgrading `drawIsoCube()` and caching each hardware variant as a texture (`generateTexture`) so the extra detail doesn't cost performance. The soft-lit 3D look of references 3 and 4 needs pre-rendered sprites (Blender, rendered at our 2:1 isometric angle) or a move to a real 3D engine such as Three.js — a much larger change.
