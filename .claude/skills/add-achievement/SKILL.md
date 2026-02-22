# /add-achievement — Add a New Achievement

Use this skill when adding a new achievement to Fabric Tycoon. Achievements reward players for milestones and are checked every tick automatically.

## When to Use

- When adding a new player milestone or reward
- When a new feature should have associated achievements
- When the user says "add an achievement" or describes a milestone to track

## Instructions

### Step 1: Design the Achievement

Ask the user for these details if not provided:

| Field | Description | Guidelines |
|-------|-------------|------------|
| `id` | Unique snake_case ID | Descriptive, won't conflict with existing IDs |
| `label` | Display name | Short, catchy (1-3 words) — think Xbox/Steam achievement names |
| `description` | What the player did | One sentence, starts with a verb |
| `icon` | Emoji icon | Single emoji that represents the achievement |

**Naming conventions (from existing achievements):**
- Use evocative names, not literal descriptions: "Hello World" not "First Cabinet"
- Reference industry/tech culture: "Six Figures", "Leveraged", "Green Machine"
- Keep labels to 1-3 words when possible

### Step 2: Add to the Catalog

File: `src/stores/configs/progression.ts`

Add the new achievement to the `ACHIEVEMENT_CATALOG` array. Group it with related achievements using a comment.

```typescript
// Example:
{ id: 'your_achievement', label: 'Cool Name', description: 'Do something impressive.', icon: '🏆' },
```

### Step 3: Add the Unlock Condition

File: `src/stores/gameStore.ts`

Find the achievements section in the `tick()` function (look for the comment `// ── Achievements` or search for `ACHIEVEMENT_CATALOG`). Add a condition check following the existing pattern:

```typescript
// Pattern: check if not already unlocked, then check condition
if (!achievements.some(a => a.def.id === 'your_achievement') && YOUR_CONDITION) {
  newAchievements.push({ def: ACHIEVEMENT_CATALOG.find(a => a.id === 'your_achievement')!, unlockedAtTick: tick });
}
```

**Common condition patterns (from existing achievements):**
- Count-based: `cabinets.length >= 10`
- Money-based: `money >= 1000000`
- State-based: `coolingType === 'water'`
- Stat-based: `stats.pue <= 1.30`
- Streak-based: `lifetimeStats.maxUptimeStreak >= 100`
- Combination: `staff.length >= 8 && staff.every(s => s.fatigue < 20)`

### Step 4: Update Documentation

Update the achievement count in:
- `CLAUDE.md` — "89 achievements" references (update the number)
- `TODO.md` — achievement count in the Summary section

### Step 5: Add Tests

File: `src/stores/__tests__/gameStore.test.ts`

Add a test that:
1. Sets up the game state to meet the achievement condition
2. Runs `tick()`
3. Verifies the achievement was unlocked

```typescript
it('should unlock your_achievement when condition is met', () => {
  // Setup: create state that meets the condition
  setState({ /* ... */ });
  getState().tick();
  expect(getState().achievements.some(a => a.def.id === 'your_achievement')).toBe(true);
});
```

### Step 6: Verify

```bash
npm run lint
npm run test
npm run build
```

All three must pass.

## Notes

- Achievements are displayed as toast notifications via `App.tsx` — no UI changes needed
- The gold particle shower effect triggers automatically for any new achievement
- Achievement state is persisted via the save/load system — no save changes needed
- The `resetGame()` function resets achievements to `[]` — no reset changes needed
