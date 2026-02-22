# /add-incident — Add a New Incident Type

Use this skill when adding a new incident type to Fabric Tycoon. Incidents are random events that challenge the player — everything from fiber cuts to sentient AI outbreaks.

## When to Use

- When adding a new random event or disaster to the game
- When the user says "add an incident" or describes a new type of problem/event

## Instructions

### Step 1: Design the Incident

Ask the user for these details if not provided:

| Field | Description | Guidelines |
|-------|-------------|------------|
| `type` | Unique snake_case ID | Must not conflict with existing types (check `INCIDENT_CATALOG` in `src/stores/configs/progression.ts`) |
| `label` | Display name | Short, punchy (2-4 words) |
| `severity` | `'minor'` / `'major'` / `'critical'` | Minor: nuisance. Major: real impact. Critical: existential threat. |
| `description` | Flavor text | One sentence, dramatic, tells the player what's happening |
| `durationTicks` | How long it lasts | Minor: 5-8, Major: 10-20, Critical: 12-18 |
| `resolveCost` | Cost to resolve early | Minor: $500-2,000, Major: $3,000-10,000, Critical: $10,000-15,000 |
| `effect` | Effect type | One of: `'heat_spike'`, `'revenue_penalty'`, `'power_surge'`, `'traffic_drop'`, `'cooling_failure'`, `'hardware_failure'`, `'chiller_failure'`, `'pipe_failure'` |
| `effectMagnitude` | Severity multiplier | Depends on effect (see existing catalog for examples) |
| `hardwareTarget` | _(optional)_ | Only for `hardware_failure`: `'spine'` or `'leaf'` |

**Effect magnitude guidelines:**
- `revenue_penalty`: 0.0 = total loss, 1.0 = no effect (e.g., 0.7 = 30% revenue reduction)
- `power_surge`: multiplier on power draw (e.g., 1.3 = 30% more power)
- `traffic_drop`: remaining traffic fraction (e.g., 0.5 = 50% traffic loss)
- `cooling_failure`: remaining cooling fraction (e.g., 0.4 = 60% cooling reduction)
- `heat_spike`: degrees Celsius added per tick (e.g., 8 = +8°C/tick)
- `hardware_failure`: set to 0 (uses hardwareTarget instead)
- `chiller_failure` / `pipe_failure`: set to 0

### Step 2: Add to the Catalog

File: `src/stores/configs/progression.ts`

Add the new incident to the `INCIDENT_CATALOG` array. Group it with similar incidents using a comment if it starts a new category.

```typescript
// Example:
{ type: 'your_incident', label: 'Your Incident', severity: 'major', description: 'Something dramatic happened.', durationTicks: 12, resolveCost: 6000, effect: 'revenue_penalty', effectMagnitude: 0.6 },
```

### Step 3: Handle Special Effects (if needed)

If the incident has a unique effect beyond the standard effect types, you need to add handling in the `tick()` function in `src/stores/gameStore.ts`. Look for where other incidents of the same `effect` type are processed.

Standard effects (`revenue_penalty`, `power_surge`, `heat_spike`, `traffic_drop`, `cooling_failure`) are already handled generically — no tick changes needed.

For `hardware_failure`, `chiller_failure`, or `pipe_failure`, check the existing handling in `tick()` to see if your new incident needs special logic.

### Step 4: Security Blocking (if applicable)

If this is a security-related incident (like `tailgating`, `social_engineering`, `break_in`), add blocking logic in the incident spawning section of `tick()`. Security features can reduce or prevent these incidents. Check the existing pattern for intrusion incidents.

### Step 5: Add Achievement (if warranted)

If the incident is significant enough to warrant a "survive this" achievement, add one. Use the `/add-achievement` skill for this.

### Step 6: Add Tutorial Tip (optional)

If the incident introduces a new concept, add a contextual tip to `TUTORIAL_TIPS` in `src/stores/configs/progression.ts` and add the trigger logic in the tutorial section of `tick()`.

### Step 7: Update Documentation

Update the incident count in:
- `CLAUDE.md` — "17 incident types" and "Incidents (17 types)" references (update the number)

### Step 8: Add Tests

File: `src/stores/__tests__/gameStore.test.ts`

Add at minimum:
- A test that verifies the incident spawns and resolves correctly
- A test for any special effect behavior

### Step 9: Verify

```bash
npm run lint
npm run test
npm run build
```

All three must pass.
