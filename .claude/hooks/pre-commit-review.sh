#!/usr/bin/env bash
set -uo pipefail

# Pre-Commit Code Review for Data Center Tycoon
# Runs automatically before git commit via Claude Code PreToolUse hook.
# Analyzes staged changes for security issues, convention violations,
# and code quality problems.

cd /home/user/data-center-tycoon

STAGED_DIFF=$(git diff --cached --diff-filter=ACMR 2>/dev/null || true)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)

if [ -z "$STAGED_DIFF" ] && [ -z "$STAGED_FILES" ]; then
    exit 0
fi

CRITICAL=0
WARNINGS=0
NOTES=0

# Only check added lines (lines starting with +, excluding diff headers)
ADDED_LINES=$(echo "$STAGED_DIFF" | grep -E '^\+[^+]' || true)
# Get added lines only from .ts/.tsx files
TS_DIFF=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx)$' | while read -r f; do
    git diff --cached -- "$f" 2>/dev/null || true
done)
TS_ADDED=$(echo "$TS_DIFF" | grep -E '^\+[^+]' || true)

echo "=== Pre-Commit Code Review ==="
echo "Reviewing $(echo "$STAGED_FILES" | wc -l | tr -d ' ') staged file(s)..."
echo ""

# ──────────────────────────────────────────────
# CRITICAL: Security & Secrets
# ──────────────────────────────────────────────

# Check for .env files being committed
ENV_FILES=$(echo "$STAGED_FILES" | grep -E '\.env(\..+)?$' || true)
if [ -n "$ENV_FILES" ]; then
    echo "CRITICAL: Environment files staged for commit:"
    echo "$ENV_FILES" | sed 's/^/  /'
    echo "  -> These likely contain secrets. Remove with: git reset HEAD <file>"
    echo ""
    CRITICAL=$((CRITICAL + 1))
fi

# Check for hardcoded secrets/keys/passwords in added lines
SECRET_MATCHES=$(echo "$ADDED_LINES" | grep -iE '(api[_-]?key|secret[_-]?key|password|private[_-]?key|access[_-]?token)\s*[:=]\s*["\x27][A-Za-z0-9+/=_-]{8,}' 2>/dev/null || true)
if [ -n "$SECRET_MATCHES" ]; then
    echo "CRITICAL: Possible hardcoded secrets detected in added lines:"
    echo "$SECRET_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    CRITICAL=$((CRITICAL + 1))
fi

# Check for credential files
CRED_FILES=$(echo "$STAGED_FILES" | grep -iE '(credentials|\.pem|\.key|\.p12|\.pfx|id_rsa|id_ed25519)$' || true)
if [ -n "$CRED_FILES" ]; then
    echo "CRITICAL: Credential/key files staged for commit:"
    echo "$CRED_FILES" | sed 's/^/  /'
    echo ""
    CRITICAL=$((CRITICAL + 1))
fi

# ──────────────────────────────────────────────
# WARNING: Project Convention Violations
# ──────────────────────────────────────────────

# Check for enum usage (forbidden by erasableSyntaxOnly)
ENUM_MATCHES=$(echo "$TS_ADDED" | grep -E '\benum\s+[A-Z]' 2>/dev/null || true)
if [ -n "$ENUM_MATCHES" ]; then
    echo "WARNING: 'enum' usage detected (project uses erasableSyntaxOnly — use union types instead):"
    echo "$ENUM_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# Check for namespace usage (forbidden by erasableSyntaxOnly)
NAMESPACE_MATCHES=$(echo "$TS_ADDED" | grep -E '\bnamespace\s+[A-Z]' 2>/dev/null || true)
if [ -n "$NAMESPACE_MATCHES" ]; then
    echo "WARNING: 'namespace' usage detected (forbidden by erasableSyntaxOnly):"
    echo "$NAMESPACE_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# Check for debugger statements
DEBUGGER_MATCHES=$(echo "$TS_ADDED" | grep -E '\bdebugger\b' 2>/dev/null || true)
if [ -n "$DEBUGGER_MATCHES" ]; then
    echo "WARNING: 'debugger' statement found — remove before committing:"
    echo "$DEBUGGER_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# Check for console.log in non-test files
NON_TEST_TS=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx)$' | grep -v '\.test\.' | grep -v '__tests__' || true)
if [ -n "$NON_TEST_TS" ]; then
    CONSOLE_MATCHES=""
    while IFS= read -r f; do
        [ -z "$f" ] && continue
        FILE_ADDED=$(git diff --cached -- "$f" 2>/dev/null | grep -E '^\+[^+]' || true)
        FILE_CONSOLE=$(echo "$FILE_ADDED" | grep -E '\bconsole\.(log|debug|info)\b' | grep -v '\/\/' || true)
        if [ -n "$FILE_CONSOLE" ]; then
            CONSOLE_MATCHES="${CONSOLE_MATCHES}${f}:
${FILE_CONSOLE}
"
        fi
    done <<< "$NON_TEST_TS"
    if [ -n "$CONSOLE_MATCHES" ]; then
        echo "WARNING: console.log/debug/info found in production code:"
        echo "$CONSOLE_MATCHES" | head -10 | sed 's/^/  /'
        echo ""
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Check for 'any' type usage
ANY_MATCHES=$(echo "$TS_ADDED" | grep -E ':\s*any\b|<any>|as\s+any\b' 2>/dev/null || true)
if [ -n "$ANY_MATCHES" ]; then
    echo "WARNING: 'any' type usage detected — prefer specific types:"
    echo "$ANY_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# Check for class components (project uses function components only)
CLASS_COMPONENT=$(echo "$TS_ADDED" | grep -E '\bclass\s+\w+\s+extends\s+(React\.)?(Component|PureComponent)' 2>/dev/null || true)
if [ -n "$CLASS_COMPONENT" ]; then
    echo "WARNING: Class component detected — project uses function components only:"
    echo "$CLASS_COMPONENT" | head -3 | sed 's/^/  /'
    echo ""
    WARNINGS=$((WARNINGS + 1))
fi

# ──────────────────────────────────────────────
# WARNING: Store-Specific Checks
# ──────────────────────────────────────────────

STORE_CHANGED=$(echo "$STAGED_FILES" | grep -E 'stores/gameStore\.ts$' || true)
if [ -n "$STORE_CHANGED" ]; then
    STORE_ADDED=$(git diff --cached -- src/stores/gameStore.ts 2>/dev/null | grep -E '^\+[^+]' || true)

    # Check for direct array mutations (push/splice/pop/shift/unshift on state)
    MUTATION_MATCHES=$(echo "$STORE_ADDED" | grep -E '\.(push|splice|pop|shift|unshift|sort|reverse)\(' 2>/dev/null | grep -v '\/\/' || true)
    if [ -n "$MUTATION_MATCHES" ]; then
        echo "WARNING: Possible direct array mutation in store (use spread operators for immutable updates):"
        echo "$MUTATION_MATCHES" | head -5 | sed 's/^/  /'
        echo ""
        WARNINGS=$((WARNINGS + 1))
    fi

    # Check if new set() calls exist without calcStats() nearby
    SET_CALLS=$(echo "$STORE_ADDED" | grep -c 'set({' 2>/dev/null || echo "0")
    CALC_CALLS=$(echo "$STORE_ADDED" | grep -c 'calcStats\|calcTraffic' 2>/dev/null || echo "0")
    if [ "$SET_CALLS" -gt 0 ] && [ "$CALC_CALLS" -eq 0 ]; then
        echo "NOTE: Store state updates detected without calcStats()/calcTraffic() calls."
        echo "  -> Ensure dependent stats are recalculated after mutations."
        echo ""
        NOTES=$((NOTES + 1))
    fi

    # Check that resetGame() is updated if new state fields are added
    NEW_STATE_FIELDS=$(echo "$STORE_ADDED" | grep -E '^\+\s+\w+:' | grep -v 'function\|const\|let\|var\|return\|if\|else\|for\|while\|case\|import\|export\|type\|interface' 2>/dev/null || true)
    if [ -n "$NEW_STATE_FIELDS" ]; then
        RESET_CHANGED=$(echo "$STORE_ADDED" | grep -c 'resetGame' 2>/dev/null || echo "0")
        if [ "$RESET_CHANGED" -eq 0 ]; then
            echo "NOTE: New state fields may have been added to the store without updating resetGame()."
            echo "  -> Verify all new fields are reset to defaults in resetGame()."
            echo ""
            NOTES=$((NOTES + 1))
        fi
    fi
fi

# ──────────────────────────────────────────────
# NOTE: Code Quality
# ──────────────────────────────────────────────

# Check for large additions (>300 added lines in a single file)
while IFS= read -r f; do
    [ -z "$f" ] && continue
    ADDED_COUNT=$(git diff --cached --stat -- "$f" 2>/dev/null | tail -1 | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+' || echo "0")
    if [ "$ADDED_COUNT" -gt 300 ]; then
        echo "NOTE: Large change detected in $f ($ADDED_COUNT lines added)."
        echo "  -> Consider if this can be broken into smaller, focused changes."
        echo ""
        NOTES=$((NOTES + 1))
    fi
done <<< "$STAGED_FILES"

# Check for TODO/FIXME/HACK in new code
TODO_MATCHES=$(echo "$ADDED_LINES" | grep -iE '\b(TODO|FIXME|HACK|XXX)\b' 2>/dev/null || true)
if [ -n "$TODO_MATCHES" ]; then
    echo "NOTE: TODO/FIXME/HACK comments in new code:"
    echo "$TODO_MATCHES" | head -5 | sed 's/^/  /'
    echo ""
    NOTES=$((NOTES + 1))
fi

# Check for Phaser-specific issues (no image/sprite loading)
PHASER_CHANGED=$(echo "$STAGED_FILES" | grep -E 'game/PhaserGame\.ts$' || true)
if [ -n "$PHASER_CHANGED" ]; then
    PHASER_ADDED=$(git diff --cached -- src/game/PhaserGame.ts 2>/dev/null | grep -E '^\+[^+]' || true)
    SPRITE_MATCHES=$(echo "$PHASER_ADDED" | grep -E '\b(this\.load\.(image|spritesheet|atlas|audio)|this\.add\.(sprite|image))\b' 2>/dev/null || true)
    if [ -n "$SPRITE_MATCHES" ]; then
        echo "WARNING: Phaser asset loading detected — project uses procedural graphics only (no sprites/images):"
        echo "$SPRITE_MATCHES" | head -3 | sed 's/^/  /'
        echo ""
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# ──────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────

echo "--- Review Summary ---"
TOTAL=$((CRITICAL + WARNINGS + NOTES))
if [ "$TOTAL" -eq 0 ]; then
    echo "No issues found. Code looks good to commit."
    exit 0
fi

[ "$CRITICAL" -gt 0 ] && echo "  CRITICAL: $CRITICAL (must fix before committing)"
[ "$WARNINGS" -gt 0 ] && echo "  WARNINGS: $WARNINGS (should fix or justify)"
[ "$NOTES" -gt 0 ] && echo "  NOTES:    $NOTES (consider addressing)"

if [ "$CRITICAL" -gt 0 ]; then
    echo ""
    echo "COMMIT BLOCKED: Fix critical issues before committing."
    exit 1
fi

echo ""
echo "Review complete. Warnings are advisory — proceed if justified."
exit 0
