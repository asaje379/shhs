# 🤖 Self-Healing Hybrid Swarm — AI Engineering Workflow

This repository uses an AI governance system designed to safely scale development with AI agents on large and long-living projects.

The goal is to prevent architectural drift, uncontrolled refactors, and technical debt accumulation when
while allowing fast feature delivery.

---

## 🧠 Concept

Instead of a single AI doing everything, development is organized as a **structured multi-role workflow**.

Each AI role has a strict responsibility and limited authority.

This mimics a mature engineering organization:

- Architecture is protected
- Development is fast
- Validation is objective
- Technical debt is continuously monitored

---

## 🏗️ Core Principles

### 1. Role Separation

No AI agent is allowed to plan, implement, and validate simultaneously.

### 2. Contract-Driven Development

Features are defined using Cucumber `.feature` contracts before implementation.

### 3. Architecture as Source of Truth

All major decisions are stored as ADRs (Architecture Decision Records).

### 4. Structural Enforcement

Architecture rules are validated independently from functionality.

### 5. Self-Healing System

The repository is periodically analyzed to detect emerging technical debt.

---

## 📁 AI Workspace Structure

```
.ai/
  agents/        → AI role definitions
  memory/        → long-term architectural knowledge
  contracts/     → feature specifications
  reports/       → audits and debt analysis
  bootstrap/     → project initialization workflow
```

Key files:

- `CLAUDE.md` → governance rules
- `ARCHITECTURE.md` → system overview
- `.ai/memory/ADR/` → architecture decisions

---

## 👥 AI Roles

### 🧠 Root Architect

Defines system structure and creates feature contracts.

Never writes production code.

---

### 🧩 Domain Architect

Owns a bounded context and approves merges for that domain.

---

### 🔧 Developer Agent

Implements a single feature within strict boundaries.

Cannot change architecture.

---

### 🧬 Static Reviewer

Validates architectural rules
