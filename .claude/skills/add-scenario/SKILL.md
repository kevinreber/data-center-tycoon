# /add-scenario — Add a New Scenario Challenge

Use this skill when adding a new scenario challenge to Fabric Tycoon. Scenarios are predefined challenges with special rules and objectives that provide structured replayability.

## When to Use

- When adding a new gameplay challenge or scenario
- When the user describes a "what if" game mode or challenge variant
- When the user says "add a scenario"

## Instructions

### Step 1: Design the Scenario

Ask the user for these details if not provided:

| Field | Description | Guidelines |
|-------|-------------|------------|
| `id` | Unique snake_case ID | Short, descriptive |
| `label` | Display name | 1-3 words, evocative |
| `description` | Player-facing pitch | 2 sentences max — set the scene and the challenge |
| `startingMoney` | Initial budget | Low = harder ($8k-15k), Normal = $50k, High = $80k+ |
| `objectives` | Win conditions (2-3) | Mix of resource, progression, and survival goals |
| `specialRules` | Rule modifiers (1-3) | Clear, one-line descriptions players can understand |

**Objective types available:**
| `type` | What it checks | Example |
|--------|---------------|---------|
| `'money'` | Current cash | "Accumulate $500,000" |
| `'cabinets'` | Cabinet count | "Deploy 20 cabinets" |
| `'revenue'` | Revenue per tick | "Earn $500/tick" |
| `'pue'` | Power efficiency | "Achieve PUE 1.20" |
| `'reputation'` | Reputation score | "Reach Good reputation" |
| `'contracts'` | Completed contracts | "Complete 5 contracts" |
| `'temperature'` | Avg temperature | "Keep avg temp below 40°C" |
| `'ticks'` | Ticks survived | "Survive 200 ticks" |

**Comparison operators:**
- `'gte'` — greater than or equal (most goals: "reach X")
- `'lte'` — less than or equal (efficiency/speed goals: "keep below X" or "complete within X")

**Design tips:**
- Each scenario should feel distinct from existing ones — different starting conditions and constraints
- 2-3 objectives create enough challenge without being overwhelming
- Special rules should fundamentally change how the player approaches the game
- Balance: the scenario should be completable but require deliberate strategy

### Step 2: Add to the Catalog

File: `src/stores/configs/progression.ts`

Add the new scenario to the `SCENARIO_CATALOG` array:

```typescript
{
  id: 'your_scenario',
  label: 'Your Scenario',
  description: 'Set the scene. Describe the challenge.',
  startingMoney: 50000,
  objectives: [
    { id: 'ys_obj1', description: 'First objective', type: 'cabinets', target: 20, comparison: 'gte' },
    { id: 'ys_obj2', description: 'Second objective', type: 'money', target: 200000, comparison: 'gte' },
  ],
  specialRules: ['Rule modifier description', 'Another rule modifier'],
},
```

**Objective ID convention:** Use the scenario's initials as a prefix (e.g., `dr_` for disaster_recovery, `bb_` for budget_build).

### Step 3: Implement Special Rules

File: `src/stores/gameStore.ts`

Special rules need to be enforced in the game logic. Find the `startScenario` action and the relevant sections of `tick()`:

1. **Starting conditions** — Set in `startScenario` (e.g., starting money, starting reputation)
2. **Ongoing modifiers** — Apply in `tick()` where the relevant system is processed (e.g., incident frequency in the incidents section, revenue multipliers in the revenue section)
3. **Disabled features** — Check in the relevant action (e.g., disable loans by checking `activeScenario` in `takeLoan`)

Look for existing `activeScenario` checks in the codebase to see the pattern:

```typescript
// Example: modify incident rate during a scenario
const scenarioIncidentMult = state.activeScenario?.id === 'your_scenario' ? 2.0 : 1.0;
```

### Step 4: Scenario Progression Gating

Scenarios unlock sequentially — each requires completing the previous one. The new scenario is automatically gated because `ScenarioPanel.tsx` checks `completedScenarios` to determine which scenarios are locked.

If you want to gate the scenario behind a specific prerequisite (not just sequential ordering), add custom logic in `ScenarioPanel.tsx`.

### Step 5: Objective Checking

Objective completion is checked automatically in `tick()` based on the `type` and `comparison` fields. Verify that the objective types you're using are already handled. If you need a new objective type:

1. Add the new type to the `ScenarioObjective` type union in `src/stores/types.ts`
2. Add the check logic in the scenario objective evaluation section of `tick()`

### Step 6: Update Documentation

Update the scenario count in:
- `CLAUDE.md` — "5 predefined challenges" and "Scenarios (5)" references
- `TODO.md` — scenario count if mentioned

### Step 7: Add Tests

File: `src/stores/__tests__/gameStore.test.ts`

Test at minimum:
- Starting the scenario sets correct initial state
- Special rules are enforced during tick
- Objectives complete when conditions are met
- Scenario can be abandoned

### Step 8: Verify

```bash
npm run lint
npm run test
npm run build
```

All three must pass.

## Existing Scenarios (for reference)

| ID | Label | Theme | Difficulty |
|----|-------|-------|-----------|
| `disaster_recovery` | Disaster Recovery | Rebuild from ashes | Hard |
| `green_facility` | Zero Emission Facility | Efficiency challenge | Medium |
| `black_friday` | Black Friday Surge | Traffic/SLA pressure | Medium |
| `budget_build` | Bootstrapped | Extreme poverty start | Hard |
| `speed_run` | Speed Run | Time pressure | Medium-Hard |

Design new scenarios to fill gaps — e.g., security-focused, competitor-focused, cooling-focused, or late-game challenges.
