# Self-Healing Hybrid Swarm — AI Governance

## Overview

This project uses a multi-agent AI governance workflow called the **Self-Healing Hybrid Swarm**. All AI agents operating on this codebase MUST follow the rules defined here.

## Agent Roles

| Agent | File | Purpose |
|-------|------|---------|
| Root Architect | `.ai/agents/architect.md` | Defines architecture, produces ADRs and feature contracts |
| Domain Architect | `.ai/agents/domain-architect.md` | Maintains bounded context consistency, approves domain merges |
| Developer | `.ai/agents/developer.md` | Implements features within defined boundaries |
| Static Reviewer | `.ai/agents/static-reviewer.md` | Validates structural compliance |
| QA Validator | `.ai/agents/qa.md` | Validates measurable test results |
| Debt Observer | `.ai/agents/debt-observer.md` | Detects structural debt and proposes refactors |
| Architecture Reviewer | `.ai/agents/architecture-reviewer.md` | Independent governance review for long-term scalability risks |

## Mandatory Execution Order

Every feature MUST follow this pipeline. No step may be skipped.

```
1. Architect defines contract
       |
       v
2. Developer implements
       |
       v
3. Static Reviewer validates structure
       |
       v
4. QA Validator validates behavior
       |
       v
5. Domain Architect approves
```

### Step Details

1. **Architect defines contract** — The Root Architect creates an ADR (if needed) and a cucumber feature contract in `.ai/features/`. No implementation begins without a contract.

2. **Developer implements** — The Developer Agent reads the feature contract, consults ADRs and patterns, then implements strictly within scope.

3. **Static Reviewer validates structure** — The Static Reviewer checks for layer violations, forbidden imports, boundary breaches, and complexity increases. Output: PASS or FAIL.

4. **QA Validator validates behavior** — The QA Validator runs cucumber scenarios, playwright tests, and checks coverage. Output: PASS or FAIL.

5. **Domain Architect approves** — The Domain Architect reviews the change within the bounded context and issues APPROVED or REJECTED.

## Agent Loading Rule

**Every agent MUST load its role file from `.ai/agents/` before performing any action.** An agent that acts without loading its role file is operating outside governance and its output must be rejected.

## Governance Files

| Path | Purpose |
|------|---------|
| `ARCHITECTURE.md` | System architecture and bounded contexts |
| `.ai/ADR/` | Architectural Decision Records |
| `.ai/contracts/` | Public interface definitions |
| `.ai/features/` | Cucumber feature contracts |
| `.ai/memory/patterns.md` | Approved architectural patterns |
| `.ai/memory/anti-patterns.md` | Known anti-patterns to avoid |
| `.ai/reports/` | Review and analysis reports |
| `.ai/debt/` | Technical debt reports |
| `.ai/architecture/governance/` | Architecture review reports and governance audits |

## Periodic Governance Review

The **Architecture Reviewer** operates outside the standard feature pipeline. It should be invoked:

- After every milestone
- Before major feature additions
- When technical debt reports accumulate
- When team velocity decreases
- On request from any stakeholder

The Architecture Reviewer produces governance reports in `.ai/architecture/governance/` and may propose corrective ADRs.

## Rules for All Agents

1. Never act outside your defined role
2. Always reference ADR decisions when making structural choices
3. Never introduce cross-domain dependencies without an ADR
4. Consult `patterns.md` before implementing any solution
5. Consult `anti-patterns.md` to avoid known mistakes
6. All architectural changes require an ADR — no exceptions
7. Feature work requires a contract — no exceptions
