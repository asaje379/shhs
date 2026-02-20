# SHHS Installation Package — Quick Reference

This document provides a quick overview of the SHHS installation package structure.

---

## Repository Structure

```
shhs/
├── README.md                    # Main documentation and overview
├── LICENSE                      # MIT License
├── CONTRIBUTING.md              # Contribution guidelines
├── INSTALLATION.md              # This file
│
├── template/                    # Files installed into target projects
│   ├── .ai/                     # AI governance structure
│   │   ├── agents/              # Agent role definitions
│   │   ├── ADR/                 # Architectural Decision Records
│   │   ├── contracts/           # Public interface contracts
│   │   ├── features/            # Cucumber feature contracts
│   │   ├── memory/              # Patterns and anti-patterns
│   │   ├── debt/                # Technical debt reports
│   │   └── reports/             # Analysis reports
│   ├── CLAUDE.md                # AI governance rules
│   ├── ARCHITECTURE.md          # Architecture template
│   └── README.ai.md             # Quick reference for installed projects
│
├── scripts/
│   └── install.sh               # Installation script
│
├── docs/
│   └── setup.md                 # Complete setup guide
│
├── .ai/                         # Example governance (for this repo)
├── CLAUDE.md                    # Governance for this repo
└── ARCHITECTURE.md              # Architecture for this repo
```

---

## Installation Commands

### Method 1: NPX (Fastest) ⚡

```bash
cd /path/to/your/project
npx create-shhs
```

**One command. No cloning. Always latest version.**

### Method 2: Git Submodule (For Version Control)

```bash
cd /path/to/your/project
git submodule add https://github.com/your-org/shhs .shhs
.shhs/scripts/install.sh
```

**Track SHHS version. Easy updates.**

### Method 3: Direct Installation

```bash
cd /path/to/your/project
git clone https://github.com/your-org/shhs /tmp/shhs
/tmp/shhs/scripts/install.sh .
rm -rf /tmp/shhs
```

**One-time setup. Clean installation.**

### Method 4: Manual Copy

```bash
cp -r /path/to/shhs/template/.ai /path/to/your/project/
cp /path/to/shhs/template/CLAUDE.md /path/to/your/project/
cp /path/to/shhs/template/ARCHITECTURE.md /path/to/your/project/
cp /path/to/shhs/template/README.ai.md /path/to/your/project/
```

**Complete control. Custom modifications.**

---

## What Gets Installed

When you run `scripts/install.sh`, it copies from `template/` to your project:

| Source | Destination | Description |
|--------|-------------|-------------|
| `template/.ai/` | `.ai/` | Full governance structure |
| `template/CLAUDE.md` | `CLAUDE.md` | Governance rules |
| `template/ARCHITECTURE.md` | `ARCHITECTURE.md` | Architecture template |
| `template/README.ai.md` | `README.ai.md` | Quick reference |

**Important:** Existing files are **never overwritten**. The script is idempotent.

---

## Post-Installation

After installation, users should:

1. **Review governance:**
   ```bash
   cat CLAUDE.md
   cat README.ai.md
   ```

2. **Bootstrap architecture:**
   ```bash
   cat .ai/agents/architect.md
   # Work with AI to define system vision
   ```

3. **Commit to version control:**
   ```bash
   git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md
   git commit -m "chore: add SHHS AI governance"
   ```

---

## Updating SHHS

### If installed via submodule:

```bash
cd .shhs
git pull origin main
cd ..
.shhs/scripts/install.sh  # Adds any new files
git add .shhs
git commit -m "chore: update SHHS"
```

### If installed directly:

```bash
# Backup customizations
cp -r .ai .ai.backup

# Pull latest
git clone https://github.com/your-org/shhs /tmp/shhs
/tmp/shhs/scripts/install.sh .

# Merge customizations if needed
rm -rf /tmp/shhs
```

---

## Customization

Users can customize their installation:

### Agent Roles
Edit `.ai/agents/*.md` to add project-specific rules

### Patterns
Add approved patterns to `.ai/memory/patterns.md`

### Anti-Patterns
Document mistakes to avoid in `.ai/memory/anti-patterns.md`

### Architecture
Update `ARCHITECTURE.md` with bounded contexts and decisions

---

## Testing Installation

Test the installation in a temporary directory:

```bash
mkdir /tmp/test-shhs
cd /tmp/test-shhs
/path/to/shhs/scripts/install.sh .
ls -la  # Should see .ai, CLAUDE.md, ARCHITECTURE.md, README.ai.md
```

Test idempotency:

```bash
/path/to/shhs/scripts/install.sh .  # Run again
# Should skip existing files
```

---

## Troubleshooting

### Script fails
```bash
# Ensure script is executable
chmod +x scripts/install.sh

# Run with explicit paths
bash /full/path/to/shhs/scripts/install.sh /target/directory
```

### Files not copied
```bash
# Check template directory exists
ls -la template/

# Check target directory is valid
cd /target/directory && pwd
```

---

## Documentation Links

- **[README.md](README.md)** — Main overview and philosophy
- **[docs/setup.md](docs/setup.md)** — Complete setup guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute
- **[template/CLAUDE.md](template/CLAUDE.md)** — Governance rules
- **[template/README.ai.md](template/README.ai.md)** — Quick reference

---

## Version

**Current Version:** 1.0.0
**Last Updated:** 2024-02-20

---

**Ready to install SHHS in your project? See [docs/setup.md](docs/setup.md) for the complete guide.**
