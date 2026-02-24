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
| Knowledge Curator | `.ai/agents/knowledge-curator.md` | Validates technical feasibility via live documentation queries (Context7) |
| Fitness Enforcer | `.ai/agents/fitness-enforcer.md` | Enforces architectural fitness functions, blocks violations |

## Mandatory Execution Order

Every feature MUST follow this pipeline. No step may be skipped.

```
0. Knowledge Curator validates technical feasibility
       |
       v
1. Architect defines contract
       |
       v
2. Developer implements (using TDD skill)
       |
       v
3. Static Reviewer validates structure
       |
       v
4. Fitness Enforcer validates architectural rules
       |
       v
5. QA Validator validates behavior
       |
       v
6. Domain Architect approves
```

### Step Details

0. **Knowledge Curator validates feasibility** — Before any architectural decision, the Knowledge Curator queries live documentation (Context7) to verify technical claims. Produces validation report. Output: APPROVED, REJECTED, or CONDITIONAL.

1. **Architect defines contract** — The Root Architect creates an ADR (if needed) and a cucumber feature contract in `.ai/features/`. No implementation begins without a contract.

2. **Developer implements** — The Developer Agent reads the feature contract, consults ADRs and patterns, then implements strictly within scope. MUST follow TDD skill (RED → GREEN → REFACTOR). MUST write Playwright E2E tests for critical flows.

3. **Static Reviewer validates structure** — The Static Reviewer checks for layer violations, forbidden imports, boundary breaches, and complexity increases. Output: PASS or FAIL.

4. **Fitness Enforcer validates architectural rules** — Runs automated fitness functions (cross-domain access, dependency limits, module centrality, complexity). Output: PASS or FAIL.

5. **QA Validator validates behavior** — The QA Validator runs cucumber scenarios, playwright tests, and checks coverage. Output: PASS or FAIL.

6. **Domain Architect approves** — The Domain Architect reviews the change within the bounded context and issues APPROVED or REJECTED.

## Agent Loading Rule

**Every agent MUST load its role file from `.ai/agents/` before performing any action.** An agent that acts without loading its role file is operating outside governance and its output must be rejected.

## Governance Files

| Path | Purpose |
|------|---------|
| `ARCHITECTURE.md` | System architecture and bounded contexts |
| `.ai/governance/constitution.md` | Immutable governance rules (TDD, E2E, Knowledge Curator) |
| `.ai/governance/definition-of-done.md` | Merge gate conditions (mandatory) |
| `.ai/ADR/` | Architectural Decision Records |
| `.ai/contracts/` | Public interface definitions |
| `.ai/features/` | Cucumber feature contracts |
| `.ai/memory/patterns.md` | Approved architectural patterns |
| `.ai/memory/anti-patterns.md` | Known anti-patterns to avoid |
| `.ai/knowledge/knowledge-base.md` | Verified technical constraints (Context7 cache) |
| `.ai/knowledge/validation-reports/` | Knowledge Curator validation reports |
| `.ai/reports/` | Review and analysis reports |
| `.ai/debt/` | Technical debt reports |
| `.ai/architecture/governance/` | Architecture review reports and governance audits |
| `.ai/architecture/governance/fitness/` | Fitness function rules and configuration |
| `.ai/skills/` | Mandatory workflows (TDD, Playwright, Context7) |

## Periodic Governance Review

The **Architecture Reviewer** operates outside the standard feature pipeline. It should be invoked:

- After every milestone
- Before major feature additions
- When technical debt reports accumulate
- When team velocity decreases
- On request from any stakeholder

The Architecture Reviewer produces governance reports in `.ai/architecture/governance/` and may propose corrective ADRs.

## Rules for All Agents

1. **Supremacy Hierarchy:** Constitution > ADR > Patterns > Code. When conflict arises, higher level wins.
2. Never act outside your defined role
3. Always reference ADR decisions when making structural choices
4. Never introduce cross-domain dependencies without an ADR
5. Consult `patterns.md` before implementing any solution
6. Consult `anti-patterns.md` to avoid known mistakes
7. All architectural changes require an ADR — no exceptions
8. Feature work requires a contract — no exceptions
9. **TDD is mandatory** (Constitution Article II) — RED → GREEN → REFACTOR, no bypass
10. **E2E tests mandatory for critical flows** (Constitution Article III) — Playwright required
11. **Knowledge Curator gate mandatory** (Constitution Article IV) — No architectural decision without technical validation
12. **Skills are mandatory procedures** (Constitution Article V) — Not guidelines, enforceable workflows
13. **Definition of Done is enforced** (Constitution Article VI) — All 6 gates must pass, no merge otherwise
