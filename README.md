# Self-Healing Hybrid Swarm (SHHS)

**A reusable AI governance system for software engineering projects**

SHHS is a structured multi-agent AI workflow that prevents architectural drift, controls technical debt, and enables safe AI-assisted development at scale.

---

## What is SHHS?

SHHS organizes AI development through **role separation** and **contract-driven workflows**:

- **Architecture is protected** through ADRs and governance rules
- **Development is fast** with clear feature contracts
- **Validation is objective** using independent review agents
- **Technical debt is monitored** continuously

Instead of one AI doing everything, SHHS mimics a mature engineering organization with distinct roles and responsibilities.

---

## Quick Start

### Installation

Install SHHS into any existing project:

```bash
# NPX (recommended)
npx create-shhs

# Or install in specific directory
npx create-shhs /path/to/your/project
```

### Updating

Update to the latest SHHS version:

```bash
# Update to latest
npx create-shhs update

# Preview changes first
npx create-shhs update --dry-run
```

📖 See [UPDATE-GUIDE.md](UPDATE-GUIDE.md) for detailed update instructions.

### What Gets Installed

```
your-project/
├── .ai/
│   ├── agents/              # AI role definitions
│   ├── ADR/                 # Architectural Decision Records
│   ├── contracts/           # Public interfaces
│   ├── features/            # Cucumber feature contracts
│   └── memory/              # Patterns and anti-patterns
├── CLAUDE.md                # Governance rules
├── ARCHITECTURE.md          # Architecture template
└── README.ai.md             # Quick reference
```

### Next Steps

1. **Read governance rules:** `cat CLAUDE.md`
2. **Bootstrap architecture:** Load Root Architect from `.ai/agents/architect.md`
3. **Create first feature:** Define contract in `.ai/features/`
4. **Follow the pipeline:** Architect → Developer → Reviewer → QA → Approval

Full setup guide: **[docs/setup.md](docs/setup.md)**

---

## Core Concepts

### Role Separation

Six specialized agents with strict boundaries:

| Agent | File | Purpose |
|-------|------|---------|
| **Root Architect** | [.ai/agents/architect.md](template/.ai/agents/architect.md) | Defines architecture, creates ADRs and feature contracts |
| **Domain Architect** | [.ai/agents/domain-architect.md](template/.ai/agents/domain-architect.md) | Maintains bounded context consistency |
| **Developer** | [.ai/agents/developer.md](template/.ai/agents/developer.md) | Implements features within defined boundaries |
| **Static Reviewer** | [.ai/agents/static-reviewer.md](template/.ai/agents/static-reviewer.md) | Validates structural compliance |
| **QA Validator** | [.ai/agents/qa.md](template/.ai/agents/qa.md) | Validates test results and coverage |
| **Debt Observer** | [.ai/agents/debt-observer.md](template/.ai/agents/debt-observer.md) | Detects emerging technical debt |

### Mandatory Pipeline

Every feature follows this sequence:

```
┌─────────────────┐
│ Root Architect  │ Creates feature contract
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Developer     │ Implements feature
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Static Reviewer │ Validates structure
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  QA Validator   │ Validates behavior
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Domain Architect │ Approves merge
└─────────────────┘
```

**No step may be skipped.**

### Contract-Driven Development

Features are defined as Cucumber `.feature` files before implementation:

```gherkin
# .ai/features/042-user-authentication.feature
Feature: User Authentication

  Scenario: User logs in with valid credentials
    Given a registered user exists
    When they submit valid credentials
    Then they receive an auth token
```

Developer agents implement to satisfy contracts. QA agents validate against them.

### Architectural Memory

Decisions and patterns are preserved:

- **ADRs** (`.ai/ADR/`) record architectural decisions
- **Patterns** (`.ai/memory/patterns.md`) capture approved solutions
- **Anti-patterns** (`.ai/memory/anti-patterns.md`) prevent known mistakes

---

## Example Workflow

### Starting a New Feature

```bash
# 1. Load Root Architect
cat .ai/agents/architect.md

# 2. Architect creates contract
# Output: .ai/features/042-payment-integration.feature

# 3. Load Developer
cat .ai/agents/developer.md

# 4. Developer reads contract and implements
# Developer follows patterns from .ai/memory/patterns.md

# 5. Load Static Reviewer
cat .ai/agents/static-reviewer.md

# 6. Reviewer validates structure → PASS/FAIL

# 7. Load QA Validator
cat .ai/agents/qa.md

# 8. QA runs tests → PASS/FAIL

# 9. Load Domain Architect
cat .ai/agents/domain-architect.md

# 10. Domain Architect approves → APPROVED/REJECTED
```

### Making Architectural Changes

```bash
# 1. Create ADR via Root Architect
# Output: .ai/ADR/007-adopt-event-sourcing.md

# 2. Update ARCHITECTURE.md with new decision

# 3. Update affected contracts in .ai/contracts/

# 4. Implement changes via feature pipeline
```

---

## Key Features

### ✅ Prevents Architectural Drift

- All structural changes require ADRs
- Static Reviewer enforces layer boundaries
- Domain Architects protect bounded contexts

### ✅ Objective Validation

- QA Validator checks measurable results (tests, coverage)
- Static Reviewer validates structure independently
- No single agent both implements and validates

### ✅ Technical Debt Monitoring

- Debt Observer analyzes codebase periodically
- Generates reports in `.ai/debt/`
- Proposes refactor contracts

### ✅ Team Collaboration

- Governance rules in version control
- ADRs provide decision history
- Contracts define clear expectations

### ✅ Reusable Across Projects

- Project-agnostic template
- Easy installation via script
- Customizable agent roles

---

## Documentation

- **[Setup Guide](docs/setup.md)** — Complete installation and configuration guide
- **[CLAUDE.md](template/CLAUDE.md)** — Governance rules (installed in projects)
- **[ARCHITECTURE.md](template/ARCHITECTURE.md)** — Architecture template
- **[Agent Roles](template/.ai/agents/)** — Definitions for all agents

---

## Requirements

- **Bash** (for installation script)
- **Git** (optional, for submodule method)
- **AI assistant** (Claude, GPT, or compatible)

Works with any tech stack — SHHS is language and framework agnostic.

---

## Philosophy

### Why Multi-Agent?

Single AI agents face conflicting incentives:

- Fast delivery vs. architectural discipline
- Shipping features vs. maintaining quality
- Implementing vs. validating objectively

SHHS separates these concerns into distinct roles with clear authority.

### Why Contracts?

Feature contracts create clear expectations:

- Developers know what to build
- QA knows what to validate
- Architects define scope upfront

This prevents scope creep and misalignment.

### Why Governance?

Long-lived projects accumulate decisions. Without governance:

- Decisions are lost or forgotten
- Patterns aren't reused
- Anti-patterns repeat

SHHS preserves institutional knowledge in `.ai/memory/`.

---

## Contributing

Contributions welcome! Please:

1. Open an issue first for discussion
2. Follow existing agent role patterns
3. Test installation script on sample projects
4. Update documentation

---

## License

MIT License — see [LICENSE](LICENSE) for details

---

## Support

- **Issues:** https://github.com/your-org/shhs/issues
- **Discussions:** https://github.com/your-org/shhs/discussions
- **Docs:** [docs/setup.md](docs/setup.md)

---

**Built for teams that want AI speed without sacrificing architectural discipline.**
