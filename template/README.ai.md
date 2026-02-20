# AI Governance — Self-Healing Hybrid Swarm

This project uses **Self-Healing Hybrid Swarm (SHHS)** for AI-assisted development.

## Quick Reference

### Governance Files

- **[CLAUDE.md](CLAUDE.md)** — Agent roles and mandatory execution pipeline
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System architecture and bounded contexts
- **[.ai/agents/](.ai/agents/)** — Role definitions for all AI agents
- **[.ai/ADR/](.ai/ADR/)** — Architectural Decision Records
- **[.ai/memory/](.ai/memory/)** — Patterns and anti-patterns
- **[.ai/features/](.ai/features/)** — Cucumber feature contracts
- **[.ai/contracts/](.ai/contracts/)** — Public interface definitions

### Agent Roles

| Agent | File | Purpose |
|-------|------|---------|
| Root Architect | [.ai/agents/architect.md](.ai/agents/architect.md) | Defines architecture, produces ADRs and feature contracts |
| Domain Architect | [.ai/agents/domain-architect.md](.ai/agents/domain-architect.md) | Maintains bounded context consistency |
| Developer | [.ai/agents/developer.md](.ai/agents/developer.md) | Implements features within defined boundaries |
| Static Reviewer | [.ai/agents/static-reviewer.md](.ai/agents/static-reviewer.md) | Validates structural compliance |
| QA Validator | [.ai/agents/qa.md](.ai/agents/qa.md) | Validates measurable test results |
| Debt Observer | [.ai/agents/debt-observer.md](.ai/agents/debt-observer.md) | Detects structural debt and proposes refactors |

### Mandatory Pipeline

Every feature MUST follow this pipeline:

```
Architect → Developer → Static Reviewer → QA Validator → Domain Architect
```

No step may be skipped.

### Getting Started

1. **Bootstrap architecture** — Run the Root Architect to define system vision and initial bounded contexts
2. **Create first feature** — Architect creates a feature contract in `.ai/features/`
3. **Implement** — Developer reads contract and implements
4. **Validate** — Static Reviewer + QA Validator check correctness
5. **Approve** — Domain Architect approves merge

### Rules

- Every agent MUST load its role file from `.ai/agents/` before acting
- All architectural changes require an ADR
- Feature work requires a contract
- Never skip validation steps
- Consult `.ai/memory/patterns.md` before implementing
- Consult `.ai/memory/anti-patterns.md` to avoid known mistakes

---

**Installed from:** [Self-Healing Hybrid Swarm](https://github.com/your-org/shhs)
