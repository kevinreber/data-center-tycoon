# /update-build-logs — Update the What's New Panel

Use this skill after shipping a major feature, a batch of improvements, or a new version release. It updates the user-facing "What's New" changelog panel so players can see what's changed.

## When to Use

- After completing a new feature or set of features via `/add-feature`
- When bumping the version number
- When the user explicitly asks to update the build logs or changelog

## Instructions

### Step 1: Identify What Changed

Review recent work to understand what was added or changed. Check:

- Recent git commits on the current branch: `git log --oneline -20`
- Any new or modified game systems, UI panels, or mechanics
- Ask the user if the description isn't clear from context

### Step 2: Determine Version Handling

Open `src/components/sidebar/BuildLogsPanel.tsx` and check the `CHANGELOG` array.

- **New version release:** If the user is shipping a new version, add a new `VersionEntry` at the **top** of the `CHANGELOG` array (index 0, so it appears first/latest).
- **Adding to current version:** If this is an incremental addition to the current release, add new `ChangeEntry` items to the existing top entry's `changes` array.

Ask the user which approach to take if it's not obvious.

### Step 3: Write User-Friendly Descriptions

This is the most important step. The audience is **players, not developers**. Follow these rules:

- **DO** describe what the player can now do or experience
- **DO** use plain language — no code references, no file names, no technical jargon
- **DO** keep each entry to one short sentence
- **DO** mention gameplay impact (e.g., "earn passive revenue", "reduce cooling costs")
- **DON'T** mention implementation details (stores, components, hooks, APIs)
- **DON'T** use developer terms (refactor, migrate, deprecate, endpoint)
- **DON'T** include bug fix details unless they affect gameplay noticeably

**Good examples:**
- "Staff & HR — hire engineers, electricians, and security officers to run your data center"
- "Weather system — seasons and weather conditions now affect your cooling needs"
- "Spot compute market — sell spare server capacity at dynamic market prices"

**Bad examples:**
- "Added StaffMember type to gameStore.ts with role/skill/fatigue fields"
- "Refactored tick() to process weather before heat calculations"
- "Fixed calcStats() power computation for edge case"

### Step 4: Choose the Right Change Type

Each change entry has a `type` field. Use the correct one:

| Type | Icon | When to Use |
|------|------|-------------|
| `'new'` | Sparkles (green) | Brand new feature, system, or mechanic the player hasn't seen before |
| `'improved'` | Wrench (blue) | Enhancement to an existing feature — more options, better UI, balance changes |
| `'system'` | Zap (purple) | Infrastructure/platform changes players benefit from but don't directly interact with (performance, save system, rendering) |

### Step 5: Update the File

Edit `src/components/sidebar/BuildLogsPanel.tsx` and modify the `CHANGELOG` array.

**For a new version**, add a new entry at the top of the array:

```typescript
{
  version: 'v0.X.0',
  date: 'Mon YYYY',
  title: 'Short Thematic Title',
  highlights: 'One sentence summarizing the major theme of this release.',
  changes: [
    { text: 'Description of what players can do', type: 'new' },
    { text: 'Description of improvement', type: 'improved' },
  ],
},
```

**For the version title**, pick a thematic name that captures the release:
- "The Longevity Update", "The Living World Update", etc.
- Keep it short (2-4 words) and evocative of the main additions

**For the date**, use the abbreviated format: `'Feb 2026'`, `'Mar 2026'`, etc.

### Step 6: Update Version References (if new version)

If this is a new version number, also update:

- `src/components/StatusBar.tsx` — find the version string (e.g., `v0.3.0`) and update it
- `CLAUDE.md` — update the "Current version" line at the top

### Step 7: Verify

- Run `npm run build` to ensure TypeScript compiles
- Visually review the changelog entries — read them as a player would
- Confirm the latest entry has the auto-expanded behavior (it's always index 0)

## Data Structure Reference

```typescript
interface ChangeEntry {
  text: string                    // User-friendly description
  type: 'new' | 'improved' | 'system'  // Badge type
}

interface VersionEntry {
  version: string    // e.g., 'v0.4.0'
  date: string       // e.g., 'Mar 2026'
  title: string      // e.g., 'The Scaling Update'
  highlights: string // One-sentence summary
  changes: ChangeEntry[]
}
```
