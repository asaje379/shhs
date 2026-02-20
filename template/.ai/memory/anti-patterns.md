# Known Anti-Patterns

This file stores anti-patterns that have been identified and must be avoided. All agents MUST consult this file to prevent introducing known architectural mistakes.

## How to Use

- **Developer Agent**: Check here before implementing. Avoid these patterns.
- **Domain Architect**: Reject changes that introduce these anti-patterns.
- **Static Reviewer**: Flag any occurrence of these anti-patterns as a FAIL.
- **Debt Observer**: Detect existing instances of these anti-patterns in the codebase.

## How to Add Anti-Patterns

Any agent may propose an anti-pattern. The Root Architect must approve and add it, backed by an ADR or debt report reference.

Format:

```markdown
### Anti-Pattern Name
- **Reference**: ADR-XXXX or DEBT-XXXX
- **Description**: What the anti-pattern is
- **Why it's harmful**: Specific consequences
- **Detection**: How to identify it in code
- **Alternative**: What to do instead (reference patterns.md)
```

---

## Identified Anti-Patterns

_No anti-patterns registered yet. They will be added here as the project evolves and architectural violations are identified._
