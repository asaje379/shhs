# Definition of Done

**Version:** 1.0.0
**Authority:** Constitution Article VI
**Status:** ENFORCED

---

## Purpose

This document defines the **mandatory conditions** that MUST be satisfied before any code can be merged.

No shortcuts. No exceptions. No "I'll fix it later."

---

## Merge Gates

Code cannot be merged unless it passes ALL gates in sequence.

```
Gate 1: Contractual Compliance
    ↓
Gate 2: Structural Compliance
    ↓
Gate 3: Behavioral Compliance
    ↓
Gate 4: Domain Approval
    ↓
Gate 5: Fitness Compliance
    ↓
MERGE ALLOWED
```

Any gate failure = **automatic merge block**.

---

## Gate 1: Contractual Compliance

**Enforced By:** Root Architect / Automated Check

### Conditions

- [ ] Feature contract exists in `.ai/features/[feature-name].feature`
- [ ] All cucumber scenarios in the contract pass
- [ ] Implementation scope matches contract (no undocumented features added)
- [ ] No contract scenarios are skipped or marked pending

### Validation Command

```bash
npm run test:cucumber -- .ai/features/[feature-name].feature
```

### Failure Actions

If cucumber scenarios fail:
1. BLOCK merge
2. Developer must fix implementation to satisfy contract
3. Re-run validation

If scope exceeds contract:
1. BLOCK merge
2. Options:
   - Remove out-of-scope code
   - Root Architect amends contract via ADR

### Veto Authority

Root Architect can veto if:
- Contract was bypassed
- Scope creep detected
- Feature diverges from architectural intent

---

## Gate 2: Structural Compliance

**Enforced By:** Static Reviewer + Fitness Enforcer

### Conditions

#### Static Reviewer Checks

- [ ] No layer violations (e.g., presentation importing database)
- [ ] No forbidden imports (per `.ai/memory/anti-patterns.md`)
- [ ] No boundary breaches (bounded contexts remain isolated)
- [ ] Complexity metrics within bounds (functions <15 cyclomatic complexity)
- [ ] TDD evidence (test files committed before implementation files)

#### Fitness Enforcer Checks

- [ ] All fitness functions pass (no BLOCK-severity violations)
- [ ] Dependency limits respected (per `.ai/architecture/governance/fitness/rules.json`)
- [ ] No cross-domain database access
- [ ] Module centrality within threshold

### Validation Commands

```bash
# Static Review
npm run lint:architecture

# Fitness Enforcement
npm run fitness:enforce -- --mode prevent
```

### Failure Actions

If Static Reviewer fails:
1. BLOCK merge
2. Developer must refactor to fix violations
3. Violations must be documented in report

If Fitness Enforcer fails (PREVENT mode):
1. BLOCK merge
2. Options:
   - Fix violation
   - Request ADR exemption (requires justification)

### Veto Authority

Static Reviewer: VETO on layer violations
Fitness Enforcer: VETO on BLOCK-severity fitness violations

---

## Gate 3: Behavioral Compliance

**Enforced By:** QA Validator

### Conditions

- [ ] All cucumber scenarios pass
- [ ] All Playwright E2E tests pass (if applicable to critical flow)
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Code coverage ≥ threshold (project default: 80%)
- [ ] No regressions (previously passing tests still pass)
- [ ] No flaky tests (tests pass 3 consecutive runs)

### Validation Commands

```bash
# Unit + Integration Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage
npm test -- --coverage
```

### Failure Actions

If tests fail:
1. BLOCK merge
2. Developer must fix failing tests
3. Re-run full test suite

If coverage below threshold:
1. BLOCK merge
2. Developer must add tests to meet threshold

If regressions detected:
1. BLOCK merge
2. Options:
   - Fix implementation to restore passing tests
   - Update tests if requirements changed (requires ADR)

### Veto Authority

QA Validator: VETO on any test failure or coverage miss

---

## Gate 4: Domain Approval

**Enforced By:** Domain Architect

### Conditions

- [ ] Bounded context integrity maintained
- [ ] No unauthorized cross-domain coupling
- [ ] Public API contracts respected
- [ ] Domain models remain consistent
- [ ] No domain logic leaked into infrastructure layer

### Validation Process

Domain Architect manually reviews:
1. Changes to domain models
2. New cross-domain dependencies
3. Public API modifications
4. Domain event flows

### Failure Actions

If domain integrity violated:
1. BLOCK merge
2. Domain Architect provides feedback
3. Developer refactors to maintain domain boundaries

If cross-domain coupling introduced:
1. BLOCK merge
2. Options:
   - Remove coupling
   - Create ADR to justify coupling (requires strong rationale)

### Veto Authority

Domain Architect: VETO on domain boundary violations

---

## Gate 5: Fitness Compliance

**Enforced By:** Fitness Enforcer (automated)

### Conditions

- [ ] No BLOCK-severity fitness violations
- [ ] Dependency graph complexity within limits
- [ ] Module coupling score acceptable
- [ ] No god modules detected (>30% incoming dependencies)

### Validation Command

```bash
npm run fitness:enforce -- --mode prevent
```

### Failure Actions

If fitness violations detected:
1. BLOCK merge
2. Report generated in `.ai/reports/fitness-violations.json`
3. Developer must remediate violations

### Veto Authority

Fitness Enforcer: VETO on BLOCK-severity violations (unless ADR exemption exists)

---

## Artefacts Required

Before merge, the following artefacts must exist:

| Artefact | Location | Owner |
|----------|----------|-------|
| Feature contract | `.ai/features/[name].feature` | Root Architect |
| ADR (if architectural) | `.ai/ADR/ADR-XXXX-title.md` | Root Architect |
| Test files | `src/**/*.test.ts` | Developer |
| Cucumber scenarios | `.ai/features/*.feature` | Root Architect |
| Playwright tests (if critical flow) | `tests/e2e/**/*.spec.ts` | Developer |
| Static review report | `.ai/reports/static-review.json` | Static Reviewer |
| QA validation report | `.ai/reports/qa-validation.json` | QA Validator |
| Fitness enforcement report | `.ai/reports/fitness-results.json` | Fitness Enforcer |
| Domain approval | `.ai/reports/domain-approval.md` | Domain Architect |

---

## Merge Process

### Step 1: Developer Self-Check

Before requesting review:

```bash
# Run all validations locally
npm run validate:all
```

This runs:
- Linting
- Tests
- Coverage check
- Fitness enforcement (DETECT mode)

### Step 2: Submit for Review

Create pull request with:
- Link to feature contract
- Summary of changes
- Test coverage report
- Any ADR references

### Step 3: Automated Gate Checks

CI/CD pipeline runs:
1. Static Reviewer
2. Fitness Enforcer
3. QA Validator (tests)

### Step 4: Manual Reviews

- Domain Architect reviews domain changes
- Root Architect reviews if ADR compliance questioned

### Step 5: Merge Decision

Merge ONLY IF:
- All automated gates: ✅ PASS
- All manual reviews: ✅ APPROVED
- All artefacts present

---

## Bypass Conditions

### Emergency Hotfix

**Criteria:**
- Production is down
- Critical security vulnerability
- Data loss imminent

**Process:**
1. Incident declared by on-call engineer
2. Hotfix branch created
3. Minimum fix implemented
4. Only Gate 3 (tests) enforced
5. Post-incident: Full gate compliance required in follow-up PR

**Authority:** Requires approval from:
- Domain Architect
- Root Architect
- Engineering lead

### Legacy Code Migration

**Criteria:**
- Code pre-dates SHHS adoption
- Incremental migration in progress

**Process:**
1. ADR created documenting migration plan
2. Exemptions granted in `.ai/architecture/governance/fitness/exemptions.json`
3. Each exemption has expiration date
4. Monthly review of exemptions

**Authority:** Root Architect + Architecture Reviewer

---

## Continuous Improvement

### Quarterly Gate Review

Every 3 months, Architecture Reviewer evaluates:
- Are gates too strict? (blocking valid work)
- Are gates too lenient? (letting debt through)
- Should new gates be added?
- Should thresholds be adjusted?

### Metrics Tracking

Track over time:
- Merge success rate (first attempt)
- Most common gate failures
- Time from PR creation to merge
- Gate bypass frequency

Metrics inform gate tuning.

---

## Roles and Veto Rights

| Role | Gate | Veto Power | Override Condition |
|------|------|------------|-------------------|
| Root Architect | 1 | ✅ YES | Unanimous Architecture Review Board |
| Static Reviewer | 2 | ✅ YES | ADR exemption |
| Fitness Enforcer | 2, 5 | ✅ YES | ADR exemption |
| QA Validator | 3 | ✅ YES | None (tests must pass) |
| Domain Architect | 4 | ✅ YES | ADR + unanimous approval |

**Architecture Review Board:** Root Architect + Domain Architect + Architecture Reviewer

---

## Enforcement

### Automated Enforcement

CI/CD pipeline **blocks merge** if gates fail.

```yaml
# .github/workflows/gates.yml
name: Merge Gates

on: pull_request

jobs:
  gate-1-contract:
    runs-on: ubuntu-latest
    steps:
      - name: Validate Feature Contract
        run: npm run validate:contract

  gate-2-structure:
    runs-on: ubuntu-latest
    steps:
      - name: Static Review
        run: npm run lint:architecture
      - name: Fitness Enforcement
        run: npm run fitness:enforce -- --mode prevent

  gate-3-behavior:
    runs-on: ubuntu-latest
    steps:
      - name: Run Tests
        run: npm test -- --coverage
      - name: Run E2E Tests
        run: npm run test:e2e

  gate-4-domain:
    runs-on: ubuntu-latest
    steps:
      - name: Domain Review Required
        run: echo "Manual review required"

  gate-5-fitness:
    runs-on: ubuntu-latest
    steps:
      - name: Final Fitness Check
        run: npm run fitness:enforce -- --mode prevent
```

### Manual Enforcement

Domain Architect review is REQUIRED for merge.

GitHub branch protection rules:
- Require status checks to pass
- Require review from Domain Architect
- Require linear history (no merge commits)

---

## Consequences of Bypass

If code is merged without satisfying Definition of Done:

1. **Immediate Rollback**
   - Code reverted immediately
   - Incident created

2. **Post-Mortem**
   - Why were gates bypassed?
   - What prevented gates from catching the issue?

3. **Process Improvement**
   - Update gates to prevent recurrence
   - Add new fitness function if needed

---

## Summary Checklist

Before merging, verify:

- [ ] Gate 1: Feature contract exists and passes
- [ ] Gate 2: Static review and fitness enforcement pass
- [ ] Gate 3: All tests pass, coverage meets threshold
- [ ] Gate 4: Domain Architect approval
- [ ] Gate 5: No fitness violations
- [ ] All required artefacts generated
- [ ] No exemptions expired
- [ ] CI/CD pipeline green

**If ALL boxes checked: MERGE ALLOWED**

**If ANY box unchecked: MERGE BLOCKED**

---

**END OF DEFINITION OF DONE**
