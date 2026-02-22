# /update-docs — Post-Change Documentation Refresh

Use this skill after committing a major feature or update to refresh all documentation and user-facing guidebooks in one pass. This combines the work of `/validate-pr-docs` and `/update-build-logs` with additional guidebook updates.

## When to Use

- After completing and committing a feature via `/add-feature`
- When the post-commit hook reminds you that docs may be stale
- Before creating a PR (as a superset of `/validate-pr-docs`)
- When the user asks to update docs, refresh documentation, or sync guides

## Instructions

When invoked, work through **all phases below in order**. Report what was updated at the end.

---

### Phase 1: Identify What Changed

Determine the scope of recent changes:

```bash
# Recent commits on the current branch
git log --oneline -20

# Files changed in the last commit
git diff-tree --no-commit-id --name-only -r HEAD

# Files changed vs main branch (for full PR scope)
git diff --name-only main...HEAD 2>/dev/null || git diff --name-only HEAD~5...HEAD
```

Categorize changes into:
- **Store changes** (gameStore.ts, types.ts, constants.ts, configs/*)
- **Phaser changes** (PhaserGame.ts)
- **UI changes** (sidebar panels, GameCanvas.tsx, HUD.tsx)
- **Test changes** (__tests__/*)

---

### Phase 2: Update CLAUDE.md

For each category of change detected, update the relevant sections:

#### 2a. Catalog Counts

Run the count script from `/validate-pr-docs` Check 1 and update any stale counts in CLAUDE.md for:
- Achievements count
- Incident types count
- Tutorial tips count
- Tech tree count
- Contract count
- Scenario count

#### 2b. Store Metrics

```bash
wc -l src/stores/gameStore.ts
wc -l src/stores/types.ts
```

Update the `~NNN lines` references in CLAUDE.md (Project Structure and Architecture sections).

#### 2c. Store Actions Table

```bash
grep -oP '(\w+):\s*\(' src/stores/gameStore.ts | head -80
```

Add any new actions to the Store Actions table in CLAUDE.md under the correct category.

#### 2d. Tick System Ordering

Read the `tick()` function and verify the numbered list in CLAUDE.md "Game Tick Loop" section matches. Also update the ordering in `.claude/skills/add-feature/SKILL.md` Step 3 if changed.

#### 2e. Types Section

If types.ts or type definitions changed, verify the Types section lists all current types, interfaces, and union types.

#### 2f. Phaser Public API

If PhaserGame.ts changed, update the "Public API methods" list in the Phaser Rendering section.

#### 2g. Sidebar Panel Count

```bash
grep "type PanelId" src/components/Sidebar.tsx
```

Update panel counts in Project Structure and UI Architecture sections. Add any new panel files to the file tree listing.

#### 2h. Sync Effects Count

If GameCanvas.tsx changed, count the `useEffect` hooks and update the "Sync effects (N total)" line.

#### 2i. Domain Concepts

If new game systems or terminology were introduced, add entries to the Domain Concepts table.

#### 2j. Simulation Parameters

If constants.ts or SIM values changed, update the Simulation Parameters section.

---

### Phase 3: Update Player-Facing Content

#### 3a. BuildLogsPanel.tsx (What's New)

Follow the `/update-build-logs` skill instructions:
- Determine if this is a new version or addition to the current version
- Write player-friendly descriptions (no code references, no jargon)
- Use correct change types: `'new'`, `'improved'`, or `'system'`

#### 3b. GuidePanel.tsx (How to Play)

If new game systems were added:
- Add a new section to the guide explaining the system to players
- Use the same plain-language, player-focused style as existing sections
- Include gameplay tips and key numbers players need to know

#### 3c. README.md

If major features were added, update the feature descriptions in README.md.

---

### Phase 4: Version Consistency

Verify the version string is the same across:
- `CLAUDE.md` — "Current version" line
- `src/components/StatusBar.tsx` — version display
- `src/components/sidebar/BuildLogsPanel.tsx` — latest changelog entry

If a version bump is needed, ask the user before changing it.

---

### Phase 5: Validate

Run all quality checks:

```bash
npm run lint
npm run test
npm run build
```

All three must pass. Fix any failures caused by doc/content changes.

---

### Output

After all phases complete, report a summary:

```
Documentation Refresh — COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: Scope identified — N files changed across [categories]
Phase 2: CLAUDE.md updated
  • [list each subsection that was updated or confirmed current]
Phase 3: Player content updated
  • BuildLogsPanel: [updated/already current]
  • GuidePanel: [updated/already current]
  • README: [updated/already current]
Phase 4: Version consistency — ✓ (vX.Y.Z)
Phase 5: Build — ✓ (lint, test, build all pass)
```

If any files were modified, list them so the user can review and commit.
