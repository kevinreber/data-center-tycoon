# Store Rules

Rules for working in `src/stores/`.

## Immutable Updates

Always use spread operators to create new arrays and objects. Never mutate state directly.

```typescript
// Correct
set({ cabinets: [...state.cabinets, newCabinet] })

// Wrong — direct mutation
state.cabinets.push(newCabinet)
```

## Always Recalculate After Mutations

Every action that changes power, heat, server count, or equipment state **must** call `calcStats()` at the end. If it changes network topology or bandwidth, also call `calcTraffic()`.

## No `enum` or `namespace`

TypeScript is configured with `erasableSyntaxOnly`. Use union types instead:

```typescript
// Correct
type CustomerType = 'general' | 'ai_training' | 'streaming'

// Wrong — will fail compilation
enum CustomerType { General, AiTraining, Streaming }
```

## Use `import type` for Type-Only Imports

`verbatimModuleSyntax` is enabled. Imports used only as types must use `import type`:

```typescript
import type { Cabinet, SpineSwitch } from './gameStore'
```

## Naming Conventions

- Types and interfaces: `PascalCase`
- Constants and config objects: `UPPER_SNAKE_CASE`
- Actions (functions): `camelCase`
- Module-level ID counters: `let nextXId = 1`

## Catalog Pattern

When adding catalog-style data (incidents, achievements, techs, contracts), follow the existing catalog array pattern. The `tick()` function handles spawning/checking automatically based on catalog entries.

## `tick()` Organization

The `tick()` function processes systems in a specific order. Add new systems in the appropriate section — don't append to the end randomly. The order matters because later systems depend on values computed by earlier ones (e.g., revenue depends on heat, which depends on power).
