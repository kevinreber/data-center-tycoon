# Hardware Visuals v2 — Plan

Goal: make the isometric hardware (cabinets, servers, leaf/spine switches, GPU nodes, InfiniBand switches, PDUs, cooling) look like the polished isometric style of Designed to Scale and Protocol Explorer (see `docs/VISUAL_REFERENCES.md`). This must not change what production players see until we explicitly flip it on.

Status: phases 0–5 implemented. The v2 renderer ships behind the `rendererStyle` flag (default `classic`). Phase 6 (flip the default) is the remaining step. See "Implementation notes" at the end.

## Principles

- **Isolated until approved.** All new art is developed on a standalone Hardware Lab page that production players can't reach. It then ships into the real game behind a flag that is off by default.
- **One drawing code path.** The Lab and the game call the same hardware drawing functions, so what we approve in the Lab is exactly what ships.
- **Additive.** The current renderer stays as the "classic" style and remains the default. Nothing is removed until v2 has been the default for a while.
- **No change to game logic.** The store, tick loop, tests and React-to-Phaser data flow are untouched. This is purely a rendering change.

## Key technical decision: draw with Canvas 2D, then cache as textures

Both reference sites get their look from SVG gradients, blur glows and crisp outlines. Phaser's `Graphics` object can't do per-face gradients on arbitrary polygons or soft blur well. The browser's Canvas 2D API can do all of it natively: `createLinearGradient` for face shading, `shadowBlur` for glow and contact shadows, `roundRect` and `lineJoin` for soft corners.

So each hardware variant is drawn once into an offscreen canvas (`this.textures.createCanvas(key, w, h)`) at 2× or 3× resolution and then shown as a regular Phaser `Image`. This gives:

- the reference look, because the drawing primitives are the same ones SVG uses,
- better performance than today: one textured quad per object instead of re-tessellating dozens of vector paths every time a cabinet changes,
- a cache we can later fill with pre-rendered Blender sprites instead, if we ever want the soft-lit 3D look, without touching callers.

Only things that animate (blinking LEDs, alert pulses, heat glow intensity, traffic packets, selection outlines) stay as live `Graphics`/`Image` overlays on top of the cached texture.

## The test route: Hardware Lab

### How it's served

Add a second Vite page rather than a route inside the game:

- `lab.html` at the repo root, entry `src/lab/main.tsx`, registered in `vite.config.ts` under `build.rollupOptions.input`.
- Reachable at `/lab.html` in dev (`npm run dev`) and on Vercel preview deployments.
- Excluded from production: the multi-page input is only added when `import.meta.env.DEV` is true or `VITE_ENABLE_LAB=true`. Set that variable for the Vercel **Preview** environment only, so every PR preview gets a Lab and production never builds it. Add `<meta name="robots" content="noindex">` as a backstop.

Why a separate page instead of `?lab=1` inside the app: it doesn't load the game store, landing page, analytics or save data, so it can't disturb a player's saved game or skew GA4 funnel numbers, and it boots instantly.

### What it shows

A single Phaser scene (`LabScene`) on the same isometric grid as the game, with a small React control bar:

- **Specimen grid**: every hardware variant laid out in labeled rows.
  - Cabinets with 0–4 servers, with and without a leaf switch, for each environment (production / lab / management), each density (standard / high / extreme), both facings, powered on and off.
  - Spine switch, InfiniBand leaf and spine, PDU (normal and overloaded), each cooling unit type, chiller plant, cable tray.
- **Side-by-side toggle**: classic vs v2 for the same specimen, so we can judge the improvement directly.
- **State toggles**: hot (above 80°C), critical / on fire, alert pulse, selected, hovered, ECC-faulted GPUs.
- **Theme toggle**: dark neon (our current palette, in the Designed to Scale style) vs light blueprint (Protocol Explorer style).
- **Zoom slider** from 0.3× to 2.5× (the game's range) to check crispness, plus an FPS readout.
- **Stress button**: fill an enterprise-size grid (50 cabinets, 8 spines, 2 GPU pods) and show the FPS readout.

## Code structure

New folder `src/game/hardware/`:

| File | Purpose |
|------|---------|
| `iso.ts` | Shared projection helpers (`project(x, y, z)`), face polygons for a box, and a `drawIsoBox(ctx, box, style)` Canvas 2D primitive with gradient faces, outline, rounded top edge and optional contact shadow. |
| `styles.ts` | `HardwareStyle` definitions: palettes, outline width and color, glow strength, shadow offset. Two styles to start: `neon` (dark) and `blueprint` (light). |
| `pieces/*.ts` | One file per hardware type, each drawing its front-panel detail: `cabinet.ts` (frame, perforated door, side panels), `server.ts` (1U/2U bezel, drive bays, status LED positions), `leafSwitch.ts` (port row, link-light positions), `spineSwitch.ts` (taller chassis with line-card slots), `gpuNode.ts` (heatsink fins, magenta light bar, coolant hoses when liquid-cooled), `ibSwitch.ts`, `pdu.ts`, `cooling.ts`, `chiller.ts`. |
| `textureCache.ts` | Builds and caches canvas textures keyed by variant, for example `cab:std:prod:S:on:3srv:leaf:neon@2x`. Also returns LED anchor points for each texture so live overlays line up. |
| `index.ts` | `getHardwareTexture(scene, spec, style)` — the only function the scenes call. |

Changes to existing code:

- `PhaserGame.ts`: add a `rendererStyle: 'classic' | 'v2'` field and a public `setRendererStyle()` method (following the existing public API pattern). `renderCabinet`, `renderSpine`, `renderPDU`, `renderCoolingUnit`, `renderChillerPlant` and `drawIBSwitches` each branch at the top: classic keeps today's code unchanged, v2 places a cached image plus live overlays. Depth sorting (`baseDepth`), labels and hit areas stay the same.
- `GameCanvas.tsx`: one new effect that pushes the style into the scene.
- Store: a `rendererStyle` UI preference persisted to localStorage, initialised from `?renderer=v2` so we can share test links. No tick or save-format changes.
- Player-chosen layer colors (LayersPopup): include the chosen color in the texture cache key, so custom colors still work.

## Phases

| Phase | Work | Exit criteria | Estimate |
|-------|------|---------------|----------|
| 0. Lab scaffold | `lab.html`, Vite input gating, `LabScene` with the specimen grid using the **classic** renderer, control bar, FPS readout. | Lab runs in dev and on a PR preview. Production build output contains no `lab.html`. | 1 day |
| 1. Primitives and style | `iso.ts`, `drawIsoBox`, `styles.ts`, texture cache, classic-vs-v2 toggle working on plain boxes. | A plain v2 box shows outline, gradient faces and contact shadow, and stays crisp at 2.5× zoom. | 1–2 days |
| 2. Cabinet and server | Cabinet frame and door, 1U/2U servers, leaf switch, power-off dimming, GPU/high-density variant, environment accent. | Every cabinet specimen in the Lab is approved by eye against the references. | 2–3 days |
| 3. Remaining hardware | Spine, InfiniBand switches, PDU, cooling units, chiller, cable tray. | All specimens drawn in v2. | 2 days |
| 4. Live overlays | Blinking LEDs at texture anchor points, heat glow, alert pulse, selection and hover outlines, ECC fault markers. | State toggles in the Lab all look right. | 1–2 days |
| 5. In-game behind a flag | `rendererStyle` preference, `?renderer=v2`, `setRendererStyle()`, branches in the render methods, hidden toggle in Settings. | Demo mode (`?demo=true&renderer=v2`) looks right. Placement mode, sub-floor view, heat map and traffic lines all still work. Enterprise demo holds 60 fps on a mid-range laptop. Lint, tests and build pass. | 2 days |
| 6. Rollout | Collect feedback from preview links. Flip the default to v2 when happy. Keep classic selectable for one release, then delete it. | Default flipped in a separate, easily reverted PR. | — |

Total: roughly 1.5–2.5 weeks of focused work. Phases 0–4 never touch production code paths. Phase 5 touches them, but behind a flag that defaults to off.

## Risks and how we handle them

- **Too many texture variants.** Cabinets have many combinations. Mitigation: compose cabinets from a few layers (back shell, one texture per server slot, front frame) instead of one texture per full combination, and build textures lazily on first use. Budget: under ~150 textures and under ~40 MB of GPU memory at 2×.
- **Blurry at high zoom.** Mitigation: render textures at 2× by default, 3× on high-DPI screens, and test at 2.5× in the Lab.
- **Draw order bugs.** Images must use the same `baseDepth` formula the Graphics objects use today. The Lab grid exercises adjacent cabinets and rows so overlaps show up early.
- **Theme clash.** The light blueprint style won't match the dark UI chrome. Recommendation: ship the dark neon v2 style first. Treat the blueprint style as an experiment that would only make sense alongside a light UI theme.
- **Launch timing.** The project is in a launch-polish phase. Phases 0–4 are safe to run in parallel because production can't reach them. Merge Phase 5 only when we're comfortable with a flagged rendering change near launch, or schedule it right after.

## Implementation notes

Where the build differs from the plan above, and what was learned:

- **The Lab drives the real scene.** `src/lab/LabApp.tsx` creates a real `DataCenterScene` (one per view in split mode) and feeds it specimens through the scene's public API, the same calls `GameCanvas.tsx` makes. That guarantees the Lab shows exactly what ships. It imports the game store module only for its configs and types; it never calls store actions, so saves and analytics are untouched. In a hidden browser tab Phaser pauses its frame loop; `window.__labGames` (dev) lets automation step frames.
- **Cabinets are layered textures.** Chassis, servers, leaf and (for rear-door heat exchangers) a door layer are separate cached images inside one Container, so layer opacity and visibility still work. Texture keys include facing, density, power, colors and liquid cooling. An enterprise demo uses about 18 textures; the full Lab specimen grid about 55.
- **Texture resolution follows zoom.** `textureScaleForZoom` picks 1×/2×/3× textures; crossing a bucket re-renders hardware and prunes the old scale.
- **The perforated door mesh was dropped.** At game zoom it shimmered (moiré) and hid the server bezels. Racks are drawn open-frame with rails, blanking panels and a door handle instead.
- **Opaque racks changed overlay rules.** Classic racks are 60% transparent, so overlays drawn below them still showed through. In v2:
  - Selection and hover draw an outline above the hardware.
  - Equipment-placement targets are tinted inside each cabinet's container.
  - The heat map tints racks directly, with its labels above.
  - Floor overlays (heat tiles, pod outlines, InfiniBand cables, the selection floor marker) move beneath all hardware (`floorOverlayDepth`).
- **Animated parts are Images, not Graphics.** The first version redrew one Graphics object per rack each frame. That forced a WebGL batch flush per rack and doubled frame time (11 ms vs 5.5 ms classic on the enterprise demo). LEDs are now pre-colored LED sprites that batch with the hardware art; only alert outlines and cooling-unit fan blades use Graphics. Result: v2 4.6 ms/frame vs classic 5.5 ms/frame.
- **New data passed to the scene (v2 only):** cabinet `liquidCooling` (hoses, rear-door coil), `eccFaultedGpus` and `gpuCount` (red wash and red LEDs on faulted GPU nodes). Classic ignores them.
- **Not converted:** row-end slots, cooling pipes, busways and the sub-floor view still use classic drawing in both renderers. Worker sprites, particles and traffic lines are shared.
- **Blueprint theme** works for all hardware but is Lab-only; the floor and UI stay dark.

## Out of scope for v2

- A real 3D engine (Three.js) or camera rotation.
- Pre-rendered Blender sprites. The texture cache keeps this possible later.
- UI chrome restyling inspired by Shelf-Made Tycoon (cash pill, objective banner, build rail counters). Track that separately.
