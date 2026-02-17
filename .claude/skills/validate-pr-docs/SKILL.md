# /validate-pr-docs — Pre-PR Documentation Validation

Use this skill before creating a pull request to ensure all documentation, guidelines, and user-facing content are consistent with the current codebase. Run this after any feature work and before opening a PR.

## When to Use

- Before creating any pull request
- After completing feature work via `/add-feature`
- After any changes to game systems, catalogs, configs, or UI panels
- When the user asks to validate or audit docs

## Instructions

When invoked, run through **every check below**. Report all discrepancies found, fix them, and confirm each section passes before finishing.

### Check 1: Catalog Counts

Run this script to get actual counts from the codebase:

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/stores/gameStore.ts', 'utf8');

const count = (pattern, regex) => {
  const match = content.match(pattern);
  return match ? (match[0].match(regex) || []).length : 0;
};

console.log('Achievements:', count(/ACHIEVEMENT_CATALOG.*?\n\](;|\n)/s, /\{ id:/g));
console.log('Tutorial Tips:', count(/TUTORIAL_TIPS.*?\n\](;|\n)/s, /\{ id:/g));
console.log('Incidents:', count(/INCIDENT_CATALOG.*?\n\](;|\n)/s, /\{ type:/g));
console.log('Base Contracts:', count(/export const CONTRACT_CATALOG.*?\n\](;|\n)/s, /\{ type:/g));
console.log('Compliance Contracts:', count(/COMPLIANCE_CONTRACT_CATALOG.*?\n\](;|\n)/s, /\{ type:/g));
console.log('Tech Tree:', count(/TECH_TREE.*?\n\](;|\n)/s, /\{ id:/g));
console.log('Scenarios:', count(/SCENARIO_CATALOG.*?\n\](;|\n)/s, /\{ id:/g));
"
```

Then verify these counts match what's stated in:
- `CLAUDE.md` — Progression configs line, Tutorial tips line, Incidents & Resilience section, Achievements tick line, Additional Systems section
- `README.md` — Achievements line
- `TODO.md` — Incident count in Phase 2
- `src/components/sidebar/BuildLogsPanel.tsx` — Any changelog entries referencing counts (e.g., "30 contextual tips", "67 achievements")

**Fix any mismatches immediately.**

### Check 2: Sidebar Panel Count

Run:

```bash
grep -c "id:" src/components/Sidebar.tsx | head -1
grep "type PanelId" src/components/Sidebar.tsx
```

Verify the panel count and panel list in `CLAUDE.md` matches:
- Line with "Icon-rail sidebar with N slide-out panels" (Project Structure section)
- Line with "renders an icon rail on the left with N panel icons" (UI Architecture section)
- The `sidebar/*.tsx` component list in both Project Structure and UI Architecture sections

**If a new panel was added**, ensure it appears in:
1. Project Structure file tree in `CLAUDE.md`
2. UI Architecture panel list in `CLAUDE.md`
3. The panel count in both locations

### Check 3: Store Line Count

Run:

```bash
wc -l src/stores/gameStore.ts
```

Verify the approximate line count in `CLAUDE.md` matches (round to nearest 100):
- Project Structure: `gameStore.ts # Single Zustand store (~NNN lines)`
- Architecture section: "This ~NNN-line file contains"

### Check 4: Tick System Ordering

Read the `tick()` function in `src/stores/gameStore.ts` and verify the numbered system list in `CLAUDE.md` (Game Tick Loop section) matches the actual processing order. Also verify the tick ordering in `.claude/skills/add-feature/SKILL.md` Step 3 matches.

If new systems were added to `tick()`, update both locations.

### Check 5: Store Actions Table

Check if any new actions were added to the store that aren't listed in the Store Actions table in `CLAUDE.md`. Run:

```bash
grep -oP '(\w+):\s*\(' src/stores/gameStore.ts | head -80
```

Cross-reference with the actions table and add any missing entries.

### Check 6: User-Facing Content

Check these files for any player-visible counts or descriptions that reference catalog sizes:
- `src/components/sidebar/BuildLogsPanel.tsx` — Changelog entries
- `src/components/sidebar/GuidePanel.tsx` — Tutorial/guide content
- `README.md` — Feature descriptions

### Check 7: Version Consistency

Verify the version string is consistent across:
- `CLAUDE.md` — "Current version" line
- `src/components/StatusBar.tsx` — Version display
- `src/components/sidebar/BuildLogsPanel.tsx` — Latest changelog entry version

### Check 8: Skills and Hooks Documentation

Verify `.claude/settings.json` hooks and `.claude/skills/*/SKILL.md` are listed in `CLAUDE.md` under "Claude Code configuration".

### Check 9: Build Verification

Run the following to confirm everything compiles:

```bash
npm run lint
npm run test
npm run build
```

All three must pass. If any fail due to doc/content changes, fix them.

### Output

After all checks pass, report a summary:

```
PR Doc Validation — PASSED
- Catalog counts: ✓ (N achievements, N incidents, N tips, ...)
- Sidebar panels: ✓ (N panels)
- Store line count: ✓ (~N lines)
- Tick ordering: ✓ (N systems)
- Store actions: ✓
- User-facing content: ✓
- Version consistency: ✓ (vX.Y.Z)
- Skills/hooks docs: ✓
- Build: ✓
```

If any fixes were made, list them so the user can review before committing.
