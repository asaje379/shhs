# Fitness Functions — Usage Guide

**Purpose:** Automate enforcement of architectural constraints to prevent decay.

**Owner:** Fitness Enforcer Agent

---

## What Are Fitness Functions?

Architectural fitness functions are automated tests of structural properties.

Unlike traditional tests (which verify behavior), fitness functions verify **architecture compliance**.

**Examples:**
- "Presentation layer cannot import database layer"
- "No module may have >10 dependencies"
- "Domain boundaries must not leak"

---

## Directory Structure

```
.ai/architecture/governance/fitness/
├── README.md               # This file
├── config.json            # Enforcement mode and settings
├── rules.json             # Fitness function definitions
└── exemptions.json        # Temporary overrides
```

---

## Configuration

### `config.json`

```json
{
  "mode": "PREVENT",
  "exemptions_enabled": true,
  "metrics_retention_days": 365,
  "report_output": ".ai/reports/fitness-violations.json",
  "trend_analysis_enabled": true
}
```

**Mode:**
- `DETECT`: Log violations, allow merge (for legacy codebases)
- `PREVENT`: Block merge on BLOCK-severity violations (for strict governance)

---

## Defining Fitness Rules

### `rules.json`

Each rule has:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (kebab-case) |
| `description` | Human-readable explanation |
| `condition` | What to measure |
| `threshold` | Acceptable limit |
| `severity` | `WARN` or `BLOCK` |
| `scope` | Glob pattern for files |

### Condition Types

#### 1. Import Pattern

Detects forbidden imports.

```json
{
  "type": "import_pattern",
  "pattern": "src/presentation/.*\\.ts imports (prisma|database).*"
}
```

#### 2. Dependency Count

Counts direct dependencies per file.

```json
{
  "type": "dependency_count",
  "target": "file"
}
```

#### 3. Centrality

Measures how many modules import a given module.

```json
{
  "type": "centrality",
  "metric": "incoming_dependencies_percentage"
}
```

#### 4. Complexity

Cyclomatic complexity of functions.

```json
{
  "type": "complexity",
  "metric": "cyclomatic"
}
```

---

## Example Rules

### Rule: No Cross-Domain Database Access

```json
{
  "id": "cross-domain-db-access",
  "description": "Domain modules must not directly access other domain databases",
  "condition": {
    "type": "import_pattern",
    "pattern": "src/domain-a/.*\\.ts imports @prisma/client.*domain_b.*"
  },
  "threshold": 0,
  "severity": "BLOCK",
  "scope": "src/domain-*/**/*.ts"
}
```

### Rule: Max Module Dependencies

```json
{
  "id": "max-module-dependencies",
  "description": "No module may have more than 10 direct dependencies",
  "condition": {
    "type": "dependency_count",
    "target": "file"
  },
  "threshold": 10,
  "severity": "WARN",
  "scope": "src/**/*.ts"
}
```

---

## Exemptions

Temporary overrides for legacy code or justified exceptions.

### `exemptions.json`

```json
{
  "exemptions": [
    {
      "rule_id": "cross-domain-db-access",
      "file": "src/legacy/old-service.ts",
      "reason": "Legacy code pending migration",
      "expires": "2026-06-01",
      "adr": "ADR-0042-legacy-migration-plan.md"
    }
  ]
}
```

**Rules for Exemptions:**
- Must reference an ADR
- Must have expiration date
- Reviewed monthly

---

## Running Fitness Functions

### Manual Execution

```bash
# Run in DETECT mode (log violations)
fitness-enforcer --mode detect

# Run in PREVENT mode (block on violations)
fitness-enforcer --mode prevent

# Run for specific files
fitness-enforcer --files "src/domain-billing/**/*.ts"
```

### CI/CD Integration

Add to pull request pipeline:

```yaml
# .github/workflows/fitness.yml
name: Architectural Fitness

on: pull_request

jobs:
  fitness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Fitness Enforcer
        run: |
          npm run fitness:enforce
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: fitness-report
          path: .ai/reports/fitness-violations.json
```

---

## Interpreting Reports

### Sample Report

```json
{
  "timestamp": "2026-02-24T10:30:00Z",
  "mode": "PREVENT",
  "status": "FAIL",
  "violations": [
    {
      "rule_id": "cross-domain-db-access",
      "severity": "BLOCK",
      "file": "src/domain-billing/services/invoice.service.ts",
      "line": 42,
      "measured_value": "import { PrismaClient } from '@prisma/client'",
      "threshold": 0,
      "remedy": "Use domain-user's public API instead of direct DB access"
    }
  ],
  "metrics": {
    "total_violations": 1,
    "block_violations": 1,
    "warn_violations": 0
  }
}
```

**Actions:**
- `BLOCK` violations → Fix before merge
- `WARN` violations → Log technical debt, plan remediation

---

## Gradual Adoption

For existing codebases with violations:

### Step 1: Baseline

```bash
fitness-enforcer --mode detect --baseline
```

Creates `.ai/reports/fitness-baseline.json` with current violation counts.

### Step 2: Prevent New Violations

Switch to PREVENT mode but only for **new or modified files**.

### Step 3: Set Reduction Targets

Commit to reducing baseline violations by X% per month.

### Step 4: Tighten Thresholds

Once violations are controlled, lower thresholds progressively.

---

## Common Violations and Fixes

### Violation: Cross-Domain Database Access

**Problem:**
```typescript
// domain-billing accesses domain-user DB directly
import { PrismaClient } from '@prisma/client';
const users = await prisma.users.findMany();
```

**Fix:**
```typescript
// Use domain-user's public service
import { UserService } from '@/domain-user/services';
const users = await UserService.getAll();
```

### Violation: Too Many Dependencies

**Problem:**
```typescript
// god-module.ts has 15 imports
```

**Fix:**
- Split into smaller modules by responsibility
- Extract cross-cutting concerns to shared utilities

### Violation: Presentation Layer Importing Database

**Problem:**
```typescript
// React component imports Prisma
import { PrismaClient } from '@prisma/client';
```

**Fix:**
```typescript
// Use application layer hook
import { useUsers } from '@/application/hooks/useUsers';
```

---

## Fitness Metrics Dashboard

Track architectural health over time.

### Metrics Collected

- Total violations (trend)
- BLOCK vs WARN ratio
- Dependency graph complexity
- Module coupling score
- Domain boundary leak count

### Visualization

```bash
fitness-enforcer --report dashboard
```

Generates `.ai/reports/fitness-dashboard.html` with charts.

---

## When to Add New Fitness Functions

Add a fitness function when:

1. **Recurring Violation Pattern**
   - Code reviews repeatedly catch the same structural issue
   - Automate the check

2. **ADR Introduces Constraint**
   - ADR mandates architectural rule
   - Encode as fitness function

3. **Architectural Review Recommendation**
   - Architecture Reviewer identifies decay pattern
   - Prevent recurrence with fitness function

4. **Bounded Context Addition**
   - New domain added
   - Enforce boundary isolation

---

## Fitness Function Lifecycle

```
1. Identify architectural constraint
    ↓
2. Encode as fitness rule in rules.json
    ↓
3. Run in DETECT mode to establish baseline
    ↓
4. Switch to PREVENT mode for new code
    ↓
5. Review quarterly — adjust thresholds
```

---

## Integration with SHHS

Fitness Enforcer runs **after Static Reviewer, before Domain Architect**.

```
Developer → Static Reviewer → Fitness Enforcer → QA → Domain Architect
```

**Rationale:** Structural compliance must pass before behavioral testing.

---

## Support

For questions on fitness functions:

1. Consult this README
2. Review existing rules in `rules.json`
3. Check Architecture Review reports in `.ai/architecture/governance/`
4. Escalate to Architecture Reviewer for new constraint proposals

---

**END OF FITNESS FUNCTIONS GUIDE**
