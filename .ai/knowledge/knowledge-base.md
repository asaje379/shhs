# Knowledge Base

**Last Updated:** 2026-02-24
**Maintained By:** Knowledge Curator
**Status:** Living Document

---

## Purpose

This document contains verified technical constraints, library-specific anti-patterns, and stack limitations discovered through Context7 queries and architectural validation.

**Source of Truth Hierarchy:**
1. Official library documentation (via Context7)
2. This knowledge base (as cache)
3. Developer assumptions (lowest priority)

---

## Stack Constraints

### [Library Name] — Version X.Y.Z

**Last Validated:** YYYY-MM-DD

#### Hard Constraints

| Constraint | Evidence | Impact |
|------------|----------|--------|
| [Description of limitation] | [Docs URL + quote] | [Architectural implications] |

**Example:**
| Constraint | Evidence | Impact |
|------------|----------|--------|
| React Server Components cannot use `useState` or `useEffect` | [React Docs: Server Components](https://react.dev/reference/rsc/server-components) — "Server Components run only on the server and cannot use hooks" | Any interactive UI must be split into Client Components |

#### Recommended Patterns

- **Pattern:** [Name]
  - **Use Case:** [When to apply]
  - **Implementation:** [Code example or reference]
  - **Source:** [Docs URL]

#### Anti-Patterns

- **Anti-Pattern:** [Name]
  - **Symptom:** [What developers try to do]
  - **Why It Fails:** [Technical reason]
  - **Evidence:** [Docs quote]
  - **Correct Approach:** [Alternative]

---

## Framework-Specific Knowledge

### Next.js

**Version:** [Current project version]
**Last Validated:** YYYY-MM-DD

#### Constraints

- [Constraint 1]
- [Constraint 2]

#### Recommended Patterns

- [Pattern 1]
- [Pattern 2]

#### Anti-Patterns

- [Anti-Pattern 1]
- [Anti-Pattern 2]

---

### Playwright

**Version:** [Current project version]
**Last Validated:** YYYY-MM-DD

#### Constraints

- [Constraint 1]
- [Constraint 2]

#### Recommended Patterns

- [Pattern 1]
- [Pattern 2]

#### Anti-Patterns

- [Anti-Pattern 1]
- [Anti-Pattern 2]

---

## Database Constraints

### PostgreSQL

**Version:** [Current project version]
**Last Validated:** YYYY-MM-DD

#### Constraints

- [Constraint 1]
- [Constraint 2]

#### Recommended Patterns

- [Pattern 1]
- [Pattern 2]

#### Anti-Patterns

- [Anti-Pattern 1]
- [Anti-Pattern 2]

---

## Testing Stack

### Jest

**Version:** [Current project version]
**Last Validated:** YYYY-MM-DD

#### Constraints

- [Constraint 1]
- [Constraint 2]

#### Recommended Patterns

- [Pattern 1]
- [Pattern 2]

#### Anti-Patterns

- [Anti-Pattern 1]
- [Anti-Pattern 2]

---

## Validation History

| Date | Library | Version | Validator | Status |
|------|---------|---------|-----------|--------|
| YYYY-MM-DD | [Name] | X.Y.Z | Knowledge Curator | ✅ Validated |

---

## Invalidation Schedule

Libraries require revalidation when:

1. **Version Upgrade:** Immediately upon dependency version change
2. **Major Framework Release:** Within 1 week of release
3. **Time Decay:** Every 6 months if no changes

### Next Revalidation Dates

| Library | Current Version | Next Revalidation | Reason |
|---------|-----------------|-------------------|--------|
| [Name] | X.Y.Z | YYYY-MM-DD | 6-month cycle |

---

## Curator Notes

### [Date: YYYY-MM-DD]

**Topic:** [What was validated]
**Finding:** [Key insight]
**Action Taken:** [Update to knowledge base or ADR flagged]

---

## Bootstrap Instructions

When adopting SHHS for a new project:

1. **Identify Stack:** List all major dependencies
2. **Query Context7:** For each dependency, query current version constraints
3. **Populate Constraints:** Fill in framework-specific sections above
4. **Validate ADRs:** Ensure existing ADRs don't violate discovered constraints
5. **Set Revalidation Schedule:** Add all libraries to invalidation schedule

---

## Integration with SHHS Pipeline

```
Knowledge Curator validates proposal
    ↓
Updates this knowledge base
    ↓
Root Architect references constraints in ADR
    ↓
Developer implements within documented constraints
```

This knowledge base is the immune system against outdated assumptions.

---

**END OF KNOWLEDGE BASE**
