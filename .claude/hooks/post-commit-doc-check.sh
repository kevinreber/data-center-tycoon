#!/usr/bin/env bash
# Post-commit documentation staleness checker
# Triggered by Claude Code PostToolUse hook when a git commit is detected.
# Compares committed file paths against documentation-sensitive areas and
# prints actionable reminders when docs may need updating.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# --- Gather changed files from the last commit ---
CHANGED_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD 2>/dev/null || true)

if [ -z "$CHANGED_FILES" ]; then
  exit 0
fi

# --- Flags for what kind of changes were detected ---
STORE_CHANGED=false
PHASER_CHANGED=false
SIDEBAR_CHANGED=false
TYPES_CHANGED=false
CONFIGS_CHANGED=false
TESTS_CHANGED=false
GAME_CANVAS_CHANGED=false

while IFS= read -r file; do
  case "$file" in
    src/stores/gameStore.ts)      STORE_CHANGED=true ;;
    src/stores/types.ts)          TYPES_CHANGED=true ;;
    src/stores/constants.ts)      CONFIGS_CHANGED=true ;;
    src/stores/configs/*)         CONFIGS_CHANGED=true ;;
    src/stores/calculations.ts)   CONFIGS_CHANGED=true ;;
    src/game/PhaserGame.ts)       PHASER_CHANGED=true ;;
    src/components/sidebar/*)     SIDEBAR_CHANGED=true ;;
    src/components/GameCanvas.tsx) GAME_CANVAS_CHANGED=true ;;
    src/stores/__tests__/*)       TESTS_CHANGED=true ;;
    src/stores/gameStore.test.ts) TESTS_CHANGED=true ;;
  esac
done <<< "$CHANGED_FILES"

# --- If nothing documentation-sensitive changed, exit silently ---
if ! $STORE_CHANGED && ! $PHASER_CHANGED && ! $SIDEBAR_CHANGED && \
   ! $TYPES_CHANGED && ! $CONFIGS_CHANGED && ! $GAME_CANVAS_CHANGED; then
  exit 0
fi

# --- Build the reminder message ---
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  📋 DOCS UPDATE REMINDER — changes detected in core    ║"
echo "║     game files. The following docs may need updating:   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

if $STORE_CHANGED; then
  echo "  ▸ gameStore.ts changed — check these in CLAUDE.md:"
  echo "    • Store line count (~NNN lines)"
  echo "    • Store Actions table (new actions?)"
  echo "    • Tick system ordering (new tick systems?)"
  echo "    • Catalog counts (achievements, incidents, tips, techs, contracts)"
  echo "    • Simulation Parameters section"
  echo "    • resetGame() coverage"
  echo ""
fi

if $TYPES_CHANGED; then
  echo "  ▸ types.ts changed — check these in CLAUDE.md:"
  echo "    • Types section (new types/interfaces?)"
  echo "    • Architecture section references"
  echo ""
fi

if $CONFIGS_CHANGED; then
  echo "  ▸ Config files changed — check these in CLAUDE.md:"
  echo "    • Constants/configs listed in Architecture section"
  echo "    • Simulation Parameters section"
  echo "    • Domain Concepts table"
  echo ""
fi

if $SIDEBAR_CHANGED; then
  # Count actual sidebar panels
  PANEL_COUNT=$(grep -c "'id'" src/components/Sidebar.tsx 2>/dev/null || echo "?")
  echo "  ▸ Sidebar panels changed — check these in CLAUDE.md:"
  echo "    • Panel count (currently ~${PANEL_COUNT} panels in Sidebar.tsx)"
  echo "    • Project Structure file tree"
  echo "    • UI Architecture panel list"
  echo ""
fi

if $PHASER_CHANGED; then
  echo "  ▸ PhaserGame.ts changed — check these in CLAUDE.md:"
  echo "    • Phaser Rendering section (public API methods)"
  echo "    • Color conventions"
  echo "    • Grid layout docs"
  echo ""
fi

if $GAME_CANVAS_CHANGED; then
  echo "  ▸ GameCanvas.tsx changed — check these in CLAUDE.md:"
  echo "    • React-Phaser Bridge section (sync effects count)"
  echo ""
fi

echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Also consider updating:"
echo "    • BuildLogsPanel.tsx — player-facing What's New changelog"
echo "    • GuidePanel.tsx — in-game guide/tutorial content"
echo "    • README.md — feature descriptions"
echo ""
echo "  Run /validate-pr-docs for a full audit before creating a PR."
echo "  Run /update-build-logs to update the player changelog."
echo "  Run /update-docs for a combined doc refresh."
echo ""
