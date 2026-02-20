# Self-Healing Hybrid Swarm — Setup Guide

This guide explains how to install SHHS (Self-Healing Hybrid Swarm) AI governance system into an existing project.

---

## Installation Methods

### Method 1: NPX (Fastest) ⚡

Use this method for instant installation without cloning the repository.

```bash
# Navigate to your project root
cd /path/to/your/project

# Install with NPX
npx create-shhs

# Commit the changes
git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md
git commit -m "chore: add SHHS AI governance system"
```

**Benefits:**
- One-command installation
- No repository cloning needed
- Always uses latest published version
- Works in any directory

**Use when:**
- You want the fastest setup
- You don't need to track SHHS source code
- You trust NPM registry updates

---

### Method 2: Git Submodule (Recommended for Updates) 🔄

Use this method if you want to track SHHS updates and easily upgrade your governance system.

```bash
# Navigate to your project root
cd /path/to/your/project

# Add SHHS as a git submodule
git submodule add https://github.com/your-org/shhs .shhs

# Run the installation script
.shhs/scripts/install.sh

# Commit the changes
git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md .gitmodules .shhs
git commit -m "chore: add SHHS AI governance system"
```

**Benefits:**
- Track SHHS version in your repo
- Easy updates with `git pull`
- Full control over when to update
- Can inspect/modify SHHS source

**Use when:**
- You want version control of SHHS
- You may need to customize the installer
- Your team needs consistent SHHS versions

---

### Method 3: Direct Clone

Use this method for a one-time installation without tracking updates.

```bash
# Navigate to your project root
cd /path/to/your/project

# Clone SHHS temporarily
git clone https://github.com/your-org/shhs /tmp/shhs

# Run installation
/tmp/shhs/scripts/install.sh .

# Clean up
rm -rf /tmp/shhs

# Commit the changes
git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md
git commit -m "chore: add SHHS AI governance system"
```

**Benefits:**
- No submodule complexity
- Clean installation
- No SHHS source in your repo

**Use when:**
- You want a one-time setup
- You don't need to track SHHS updates
- You prefer simplicity over update control

---

### Method 4: Manual Copy

For complete control or customization:

```bash
# Clone the repository
git clone https://github.com/your-org/shhs /tmp/shhs

# Copy template files to your project
cp -r /tmp/shhs/template/.ai /path/to/your/project/
cp /tmp/shhs/template/CLAUDE.md /path/to/your/project/
cp /tmp/shhs/template/ARCHITECTURE.md /path/to/your/project/
cp /tmp/shhs/template/README.ai.md /path/to/your/project/

# Clean up
rm -rf /tmp/shhs
```

---

## What Gets Installed

The installation creates the following structure in your project:

```
your-project/
├── .ai/
│   ├── agents/              # AI role definitions
│   │   ├── architect.md
│   │   ├── domain-architect.md
│   │   ├── developer.md
│   │   ├── static-reviewer.md
│   │   ├── qa.md
│   │   └── debt-observer.md
│   ├── ADR/                 # Architectural Decision Records
│   ├── contracts/           # Public interface definitions
│   ├── features/            # Cucumber feature contracts
│   ├── memory/
│   │   ├── patterns.md      # Approved patterns
│   │   └── anti-patterns.md # Known anti-patterns
│   ├── reports/             # Analysis reports
│   └── debt/                # Technical debt tracking
├── CLAUDE.md                # AI governance rules
├── ARCHITECTURE.md          # System architecture template
└── README.ai.md             # Quick reference guide
```

### Safe Installation

The installation script is **idempotent** — running it multiple times is safe:

- Existing files are **never overwritten**
- Only missing files are added
- You can safely re-run after updates

---

## Post-Installation Setup

### 1. Review Governance Files

Read the core governance files to understand the system:

```bash
cat CLAUDE.md           # Governance rules and agent roles
cat README.ai.md        # Quick reference guide
cat ARCHITECTURE.md     # Architecture template
```

### 2. Bootstrap Your Architecture

Load the Root Architect agent and define your system:

```bash
cat .ai/agents/architect.md
```

Work with your AI to:

1. Update `ARCHITECTURE.md` with:
   - System vision and principles
   - Bounded contexts
   - Technology stack
   - Initial ADRs

2. Define architectural patterns in `.ai/memory/patterns.md`

3. Document known anti-patterns in `.ai/memory/anti-patterns.md`

### 3. Create Your First Feature Contract

Use the Root Architect to create a feature contract:

```bash
# Example: Create a user authentication feature
# Agent creates: .ai/features/001-user-authentication.feature
```

### 4. Implement Using the Pipeline

Follow the mandatory execution pipeline:

```
Root Architect → Developer → Static Reviewer → QA Validator → Domain Architect
```

Each agent loads its role definition before acting:

```bash
# Developer reads their role
cat .ai/agents/developer.md

# Static Reviewer reads their role
cat .ai/agents/static-reviewer.md

# And so on...
```

---

## Version Control Recommendations

### Track the `.ai` Directory

**Recommended:** Commit `.ai` to version control for team collaboration.

```bash
git add .ai
git commit -m "chore: add AI governance structure"
```

Benefits:
- Shared architectural memory across team
- ADRs tracked in version history
- Consistent governance rules
- Feature contracts versioned with code

### Keep SHHS Submodule Updated

If using git submodule method:

```bash
# Update to latest SHHS version
cd .shhs
git pull origin main
cd ..

# Re-run installation (safe, only adds new files)
.shhs/scripts/install.sh

# Commit submodule update
git add .shhs
git commit -m "chore: update SHHS governance system"
```

---

## Customization

### Adapting Agent Roles

You can customize agent roles by editing files in `.ai/agents/`:

```bash
# Example: Add project-specific rules to developer agent
vim .ai/agents/developer.md
```

**Important:** Maintain role separation and governance principles.

### Defining Bounded Contexts

Update `ARCHITECTURE.md` with your bounded contexts:

```markdown
### User Management Context
- **Owner**: Domain Architect (authentication)
- **Purpose**: Handle user accounts, authentication, authorization
- **Public Interface**: `.ai/contracts/user-management.md`
- **Dependencies**: None
- **Key ADRs**: ADR-001, ADR-003
```

### Creating ADR Templates

Create ADR templates in `.ai/ADR/`:

```bash
# Example ADR template
cat > .ai/ADR/000-template.md << 'EOF'
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Describe the issue motivating this decision]

## Decision
[Describe the decision and rationale]

## Consequences
[Positive and negative impacts]
EOF
```

---

## Troubleshooting

### Installation Fails

```bash
# Check template directory exists
ls -la /path/to/shhs/template

# Run with explicit target directory
/path/to/shhs/scripts/install.sh /path/to/your/project
```

### Files Already Exist

The installer skips existing files. To force reinstall:

```bash
# Backup existing files
mv .ai .ai.backup
mv CLAUDE.md CLAUDE.md.backup

# Re-run installation
.shhs/scripts/install.sh

# Compare and merge if needed
diff -r .ai.backup .ai
```

### .ai Directory in .gitignore

If `.ai` is ignored:

```bash
# Remove from .gitignore
sed -i '' '/^\.ai/d' .gitignore

# Or add exception
echo '!.ai/' >> .gitignore
```

---

## Example Workflows

### Starting a New Feature

```bash
# 1. Architect creates contract
cat .ai/agents/architect.md
# → Creates .ai/features/042-payment-integration.feature

# 2. Developer implements
cat .ai/agents/developer.md
# → Reads contract, implements feature

# 3. Static review
cat .ai/agents/static-reviewer.md
# → Validates architecture compliance

# 4. QA validation
cat .ai/agents/qa.md
# → Runs tests, checks coverage

# 5. Domain approval
cat .ai/agents/domain-architect.md
# → Reviews and approves
```

### Making Architectural Changes

```bash
# 1. Create ADR
cat .ai/agents/architect.md
# → Creates .ai/ADR/007-adopt-event-sourcing.md

# 2. Update ARCHITECTURE.md
vim ARCHITECTURE.md

# 3. Update contracts if needed
ls .ai/contracts/

# 4. Implement via feature contracts
# → Follow standard pipeline
```

### Periodic Debt Analysis

```bash
# Run debt observer
cat .ai/agents/debt-observer.md
# → Generates report in .ai/debt/YYYY-MM-DD-analysis.md

# Review findings
cat .ai/debt/$(ls -t .ai/debt | head -1)

# Create refactor contracts
cat .ai/agents/architect.md
# → Creates features to address debt
```

---

## Next Steps

1. **Read the docs** — Familiarize yourself with governance model
2. **Bootstrap architecture** — Work with Root Architect to define system
3. **Create first feature** — Test the pipeline with a small feature
4. **Establish patterns** — Document approved patterns as you build
5. **Monitor debt** — Run periodic analyses to catch issues early

---

## Support

For issues, questions, or contributions:

- **Repository:** https://github.com/your-org/shhs
- **Issues:** https://github.com/your-org/shhs/issues
- **Docs:** https://github.com/your-org/shhs/docs

---

**Version:** 1.0.0
**Last Updated:** 2024-02-20
