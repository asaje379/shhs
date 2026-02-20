# SHHS Quick Start

**Self-Healing Hybrid Swarm** — AI governance for software projects

---

## 🚀 Install in Your Project

```bash
# Fastest: NPX (one command)
npx create-shhs

# Or: Add as git submodule (for tracking updates)
git submodule add https://github.com/your-org/shhs .shhs
.shhs/scripts/install.sh

# Commit
git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md
git commit -m "chore: add SHHS AI governance"
```

**What gets installed:**
- `.ai/` — Agent roles, ADRs, contracts, patterns
- `CLAUDE.md` — Governance rules
- `ARCHITECTURE.md` — Architecture template
- `README.ai.md` — Quick reference

---

## 📖 First Steps

### 1. Read Governance
```bash
cat CLAUDE.md        # Understand the rules
cat README.ai.md     # Quick reference
```

### 2. Bootstrap Architecture
```bash
cat .ai/agents/architect.md
# Work with Root Architect to define:
# - System vision
# - Bounded contexts
# - Technology stack
# - Initial ADRs
```

### 3. Create First Feature
```bash
# Architect creates contract
# Output: .ai/features/001-your-feature.feature

# Developer implements
cat .ai/agents/developer.md

# Follow the pipeline:
# Architect → Developer → Static Reviewer → QA → Domain Architect
```

---

## 🎯 The Pipeline

Every feature follows this sequence (no steps may be skipped):

```
Root Architect      → Creates feature contract
       ↓
Developer           → Implements within contract
       ↓
Static Reviewer     → Validates architecture rules
       ↓
QA Validator        → Validates tests and behavior
       ↓
Domain Architect    → Approves and merges
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.ai/agents/architect.md` | Root Architect role |
| `.ai/agents/developer.md` | Developer role |
| `.ai/agents/static-reviewer.md` | Static review role |
| `.ai/agents/qa.md` | QA validation role |
| `.ai/agents/domain-architect.md` | Domain approval role |
| `.ai/agents/debt-observer.md` | Debt monitoring role |
| `.ai/memory/patterns.md` | Approved patterns |
| `.ai/memory/anti-patterns.md` | Known mistakes to avoid |
| `.ai/ADR/` | Architectural decisions |
| `.ai/features/` | Feature contracts |

---

## 💡 Example Workflow

```bash
# 1. Load architect
cat .ai/agents/architect.md

# 2. Create feature contract
# → .ai/features/042-user-auth.feature

# 3. Load developer
cat .ai/agents/developer.md

# 4. Implement feature
# Developer reads contract and patterns

# 5. Load static reviewer
cat .ai/agents/static-reviewer.md

# 6. Validate structure → PASS/FAIL

# 7. Load QA validator
cat .ai/agents/qa.md

# 8. Run tests → PASS/FAIL

# 9. Load domain architect
cat .ai/agents/domain-architect.md

# 10. Approve → APPROVED/REJECTED
```

---

## 🛠️ Customization

Edit files in your project to customize:

- **Agent roles:** `.ai/agents/*.md`
- **Patterns:** `.ai/memory/patterns.md`
- **Anti-patterns:** `.ai/memory/anti-patterns.md`
- **Architecture:** `ARCHITECTURE.md`

---

## 📚 Full Documentation

- **[README.md](README.md)** — Package overview
- **[docs/setup.md](docs/setup.md)** — Complete setup guide
- **[INSTALLATION.md](INSTALLATION.md)** — Installation reference

---

## ❓ Support

- **Repository:** https://github.com/your-org/shhs
- **Issues:** https://github.com/your-org/shhs/issues

---

**Built for teams that want AI speed without sacrificing discipline.**
