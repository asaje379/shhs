# SHHS Constitution

**Version:** 1.0.0
**Status:** IMMUTABLE
**Last Updated:** 2026-02-24

---

## Article I — Supremacy Clause

This Constitution is the supreme governance document of the Self-Healing Hybrid Swarm.

**Hierarchy of Authority:**

```
Constitution > ADR > Patterns > Code
```

1. **Constitution** — Immutable rules. Cannot be overridden.
2. **ADR** — Architectural decisions. Can extend but not contradict Constitution.
3. **Patterns** — Implementation guidance. Must align with ADRs.
4. **Code** — Must comply with all above layers.

Any conflict between layers is resolved by promoting the higher-level rule.

---

## Article II — Source Code Location (Non-Negotiable)

All application source code MUST be located in the `app/` directory.

### Directory Structure Mandate

```
project-root/
├── app/                    # ALL application code goes here
│   ├── domain/            # Domain models and business logic
│   ├── application/       # Application services and use cases
│   ├── presentation/      # UI components, controllers
│   ├── infrastructure/    # Database, external services
│   └── ...                # Other application modules
├── .ai/                   # SHHS governance (never in app/)
├── tests/                 # Test files (can mirror app/ structure)
├── scripts/               # Build/deployment scripts
├── docs/                  # Documentation
└── config/                # Configuration files
```

### Rules

1. **All production code** → `app/`
2. **All test code** → `tests/` or `app/**/*.test.ts` (co-located)
3. **No application logic** outside `app/` (except tests)
4. **No governance files** inside `app/` (`.ai/` stays separate)

### Rationale

- **Clear separation:** Governance vs application code
- **Tooling compatibility:** Build tools can target `app/` exclusively
- **Cognitive load reduction:** Developers know where to find all code
- **Deployment simplicity:** `app/` is self-contained deployable unit

### Enforcement

- Static Reviewer MUST verify all new `.ts`, `.js`, `.tsx`, `.jsx` files are in `app/`
- Fitness Enforcer rule: `source-code-location` (BLOCK severity)
- Exception: Configuration files (`package.json`, `tsconfig.json`) at root

### Violations

Creating source code outside `app/` is a **Type 1 violation** (process bypass).

**Consequence:** Immediate rollback + re-implementation in `app/`.

---

## Article III — Test-Driven Development (Non-Negotiable)

All feature development MUST follow TDD cycle:

```
RED → GREEN → REFACTOR
```

### RED Phase

- Write a failing test BEFORE writing any implementation code
- Test must fail for the right reason (missing functionality, not syntax error)
- Test must be executable and produce a clear failure message

### GREEN Phase

- Write minimal code to make the test pass
- No refactoring during this phase
- Implementation may be naive — optimization comes later

### REFACTOR Phase

- Improve code structure WITHOUT changing behavior
- All tests must remain green
- Extract patterns, remove duplication, clarify intent

### Enforcement

- No merge request is valid without proof of TDD cycle
- Static Reviewer MUST verify test files were modified BEFORE implementation files (git commit order)
- QA Validator MUST verify test coverage meets threshold

### Exceptions

NONE. No bypass allowed. If TDD is impractical, the feature is incorrectly scoped.

---

## Article IV — End-to-End Testing (Critical Paths)

All user-facing critical flows MUST have Playwright end-to-end tests.

### What Qualifies as Critical

- Authentication flows
- Payment/transaction flows
- Data mutation operations
- Primary user journeys (signup → activation → core action)

### Playwright Requirements

- Tests must run in CI/CD pipeline
- Tests must use realistic data (no mocks for external services in E2E layer)
- Tests must verify UI state, not just HTTP responses
- Tests must be idempotent (repeatable without manual cleanup)

### Enforcement

- QA Validator MUST run Playwright tests as part of validation
- No critical feature merge without passing E2E tests
- Flaky tests are treated as failing tests

---

## Article V — Knowledge Curator (Pre-Architectural Gate)

No architectural decision may proceed without Knowledge Curator validation.

### Curator Responsibilities

1. **Query Live Documentation**
   - Use Context7 or equivalent to fetch current library documentation
   - Verify framework capabilities against architectural assumptions
   - Identify deprecated patterns in proposed stack

2. **Produce Technical Constraints**
   - List hard limitations (e.g., "React Server Components cannot use `useState`")
   - Document anti-patterns specific to chosen libraries
   - Flag unrealistic abstractions

3. **Block Invalid Architectures**
   - VETO power over architectures that violate documented library constraints
   - Must provide evidence (docs link + quote) for all vetoes

### Workflow Integration

```
Feature Request
    ↓
Knowledge Curator validates tech feasibility
    ↓
Root Architect defines ADR (if Curator approves)
    ↓
Developer implements
```

### Knowledge Base Maintenance

- Curator MUST update `.ai/knowledge/knowledge-base.md` with findings
- All stack-specific constraints must be versioned
- Outdated knowledge triggers re-validation

---

## Article VI — Skills as Enforceable Procedures

Skills are NOT guidelines. They are MANDATORY operating procedures.

### Skill Definition

A skill is a documented procedure for:
- TDD workflow
- Playwright test authoring
- Context7 documentation queries
- Debugging protocols
- Refactoring sequences

### Skill Invocation

- Any agent performing a task covered by a skill MUST invoke that skill
- Deviation from skill procedure without explicit ADR override is a violation
- Skills are versioned and stored in `.ai/skills/`

### Skill Authority

Skills have peer authority with Patterns. When conflict arises:
- If skill contradicts pattern → raise to ADR for resolution
- If skill contradicts ADR → ADR wins
- If skill contradicts Constitution → Constitution wins

---

## Article VII — Merge Gates (Definition of Done)

No code may be merged without satisfying ALL merge gate conditions.

### Gate 1: Contractual Compliance

- Feature contract exists in `.ai/features/`
- All cucumber scenarios pass
- Implementation scope matches contract (no scope creep)

### Gate 2: Structural Compliance

- Static Reviewer: PASS
- No layer violations
- No forbidden imports
- Complexity metrics within bounds

### Gate 3: Behavioral Compliance

- QA Validator: PASS
- All tests green (unit + integration + E2E)
- Coverage threshold met
- No regressions

### Gate 4: Domain Approval

- Domain Architect: APPROVED
- Bounded context integrity maintained
- No unauthorized cross-domain coupling

### Gate 5: Fitness Compliance

- Fitness Enforcer: PASS (if applicable)
- No architectural fitness rule violations
- Dependency limits respected

### Veto Authority

Any gate failure = automatic merge block. No exceptions.

---

## Article VIII — Immutability and Amendment

### Immutability

This Constitution is IMMUTABLE for:
- Source code location requirement (Article II)
- TDD requirement (Article III)
- Knowledge Curator gate (Article V)
- Merge gate structure (Article VII)

### Amendment Process

Non-immutable articles may be amended via:

1. Proposal by Architecture Reviewer
2. Impact analysis by all agents
3. Unanimous approval by:
   - Root Architect
   - Domain Architect
   - Fitness Enforcer
   - Knowledge Curator

Amendments MUST NOT weaken governance. Only clarifications or extensions allowed.

---

## Article IX — Enforcement and Violations

### Violation Types

- **Type 1: Process Bypass** — Skipping TDD, missing contracts, unapproved merges
- **Type 2: Scope Violation** — Agents acting outside defined role
- **Type 3: Knowledge Neglect** — Ignoring Curator findings, outdated assumptions

### Consequences

- Type 1: Immediate rollback + mandatory re-implementation
- Type 2: Agent role suspension + manual review
- Type 3: Knowledge base audit + architecture review

### Violation Reporting

Any agent may file a violation report in `.ai/governance/violations/YYYY-MM-DD-description.md`

---

## Article X — Bootstrap and Adoption

New projects adopting SHHS MUST:

1. Copy this Constitution to `.ai/governance/constitution.md`
2. Initialize all required directories (`.ai/agents/`, `.ai/skills/`, `.ai/knowledge/`)
3. Appoint initial agents (minimum: Architect, Developer, QA, Curator)
4. Complete Knowledge Base bootstrap (stack validation)

Partial adoption is NOT permitted. SHHS is all-or-nothing.

---

**END OF CONSTITUTION**
