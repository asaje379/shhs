# System Architecture

## Vision

_This section should be updated by the Root Architect with the system's purpose, core principles, and long-term direction._

## Architectural Principles

1. **Bounded Context Isolation** — Each domain owns its data and logic. No cross-context access without explicit contracts.
2. **Dependency Inversion** — Dependencies point inward. Domain core never depends on infrastructure.
3. **Contract-Driven Development** — Public interfaces are defined before implementation. Changes require ADR approval.
4. **Architectural Memory** — All decisions are recorded in ADRs. Patterns and anti-patterns are tracked in `.ai/memory/`.

## Bounded Contexts

_Define bounded contexts here as the system grows. Each context should specify:_

```markdown
### Context Name
- **Owner**: Domain Architect responsible
- **Purpose**: What this context handles
- **Public Interface**: Reference to `.ai/contracts/context-name.md`
- **Dependencies**: Which other contexts it depends on (must have ADR justification)
- **Key ADRs**: List of relevant ADR numbers
```

_No bounded contexts defined yet._

## Layer Structure

```
┌─────────────────────────────┐
│       Presentation          │  UI, API endpoints
├─────────────────────────────┤
│       Application           │  Use cases, orchestration
├─────────────────────────────┤
│         Domain              │  Business logic, entities
├─────────────────────────────┤
│      Infrastructure         │  Database, external services
└─────────────────────────────┘

Dependency direction: top → bottom
Domain layer has ZERO outward dependencies
```

## ADR Index

_All Architectural Decision Records are stored in `.ai/ADR/`. Reference them here as they are created._

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| _none yet_ | | | |

## Technology Stack

_To be defined by the Root Architect via ADR._
