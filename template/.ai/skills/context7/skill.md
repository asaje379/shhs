# Skill: Context7 Documentation Query

**ID:** `context7`
**Version:** 1.0.0
**Status:** MANDATORY before architectural decisions
**Authority:** Constitution Article IV (Knowledge Curator)

---

## When to Apply

This skill is MANDATORY when:

- Proposing a new architectural pattern
- Adding a new library dependency
- Making claims about framework capabilities
- Resolving technical feasibility questions
- Validating assumptions during ADR creation

---

## What Is Context7?

Context7 is a live documentation query service that provides:
- Current library documentation
- API signatures and behavior
- Version-specific constraints
- Code examples from official sources

It prevents architectural decisions based on outdated or incorrect assumptions.

---

## Workflow

### Step 1: Identify Technical Claim

Before querying Context7, clearly state the assumption you need to validate.

**Examples:**
- "React Server Components can use `useState` hook"
- "Playwright can test WebSocket connections"
- "Next.js App Router supports middleware for all routes"
- "PostgreSQL JSON columns support path queries with `->>`"

### Step 2: Formulate Query

Structure your query as:

```
Library: [name + version if known]
Question: [specific capability]
Context: [what you're trying to build]
```

**Example:**
```
Library: React 18
Question: Can Server Components use useState hook?
Context: Building a form component that needs to be rendered on the server
```

### Step 3: Execute Context7 Query

Use the MCP tool to query Context7:

```typescript
// Via MCP tool (exact syntax depends on MCP integration)
const result = await mcp.context7.query({
  library: 'react',
  version: '18',
  query: 'Can Server Components use useState hook?'
});
```

### Step 4: Extract Evidence

From the response, extract:

1. **Direct Quote:** Exact text from documentation
2. **Source URL:** Link to official docs
3. **Verdict:** Does documentation support or contradict the claim?
4. **Constraints:** Any limitations or caveats mentioned

**Example Response Processing:**
```
Query: Can React Server Components use useState?

Evidence Found:
- Source: https://react.dev/reference/rsc/server-components
- Quote: "Server Components run only on the server and cannot use hooks like useState or useEffect."
- Verdict: ❌ CLAIM REJECTED
- Constraint: State management must be done in Client Components
```

### Step 5: Document Findings

Update `.ai/knowledge/knowledge-base.md` with findings.

```markdown
### React Server Components

**Version:** 18.x
**Last Validated:** 2026-02-24

#### Hard Constraints

| Constraint | Evidence | Impact |
|------------|----------|--------|
| Cannot use `useState` or `useEffect` | [React Docs](https://react.dev/reference/rsc/server-components) — "Server Components run only on the server and cannot use hooks" | Interactive UI must use Client Components |
```

---

## Query Patterns

### Pattern 1: Feature Existence

**Question:** "Does [library] support [feature]?"

**Example:**
```
Library: Playwright 1.40
Question: Does Playwright support testing WebSocket connections?
Context: Need to test real-time chat feature
```

**Expected Evidence:**
- API documentation showing WebSocket test methods
- Code examples
- Or absence of such features

### Pattern 2: Behavior Validation

**Question:** "How does [library] handle [scenario]?"

**Example:**
```
Library: Next.js 14
Question: How does Next.js handle revalidation in App Router?
Context: Need to invalidate cached product pages after updates
```

**Expected Evidence:**
- Official documentation on `revalidatePath()` and `revalidateTag()`
- Constraints on when revalidation occurs
- Edge cases

### Pattern 3: Version Compatibility

**Question:** "Does [feature] work in [version]?"

**Example:**
```
Library: Next.js
Question: Are Server Actions available in Next.js 13.4?
Context: Project uses Next.js 13.4, proposal requires Server Actions
```

**Expected Evidence:**
- Changelog or docs indicating version requirements
- Clear answer: YES with version X.Y.Z or later

### Pattern 4: Anti-Pattern Detection

**Question:** "Is [approach] recommended by [library]?"

**Example:**
```
Library: React
Question: Is it recommended to fetch data in useEffect for SSR?
Context: Proposal suggests fetching user data in useEffect on dashboard
```

**Expected Evidence:**
- Official guidance discouraging this pattern
- Recommended alternative (e.g., Server Components, getServerSideProps)

---

## Evidence Quality Criteria

### High-Quality Evidence

✅ **Official documentation**
- react.dev, nextjs.org, playwright.dev
- Published by library maintainers

✅ **Version-specific**
- Clearly states which version the information applies to
- Includes version compatibility notes

✅ **Direct quotes**
- Exact text from docs, not paraphrased
- Includes link to source

✅ **Code examples**
- Runnable code from official docs
- Demonstrates stated behavior

### Low-Quality Evidence

❌ **Blog posts or Stack Overflow**
- Not official sources
- May be outdated

❌ **Vague statements**
- "It should work"
- "I think this is possible"

❌ **Undated documentation**
- Can't determine if it's current

❌ **Inferred behavior**
- "Since feature X exists, Y should also work"

---

## Integration with SHHS Pipeline

### Pipeline Position

Context7 queries occur BEFORE architectural decisions.

```
Feature request received
    ↓
Knowledge Curator queries Context7 ← YOU ARE HERE
    ↓
    ├─→ Evidence SUPPORTS claim → Root Architect creates ADR
    └─→ Evidence REJECTS claim → Return to stakeholder
```

### Validation Report Format

After querying Context7, Knowledge Curator produces:

```markdown
# Knowledge Validation Report

**Proposal:** Add real-time notifications using Server Components
**Date:** 2026-02-24
**Status:** REJECTED

## Technical Claims Validated

### Claim 1: React Server Components can maintain WebSocket connections

- **Status:** ❌ INVALID
- **Source:** https://react.dev/reference/rsc/server-components
- **Evidence:** "Server Components run only on the server and cannot maintain client-side connections like WebSockets."
- **Constraint:** Real-time features require Client Components

## Recommendation

REJECT proposal. Server Components cannot handle real-time connections.

**Alternative:** Use Client Components with `useEffect` to establish WebSocket connection.

## Knowledge Base Updates

- [x] Updated `.ai/knowledge/knowledge-base.md` with React Server Component constraints
```

---

## Common Queries and Answers

### Query: React Server Components and Hooks

**Question:** Can Server Components use hooks?

**Answer:**
- `useState`, `useEffect`, `useContext`: ❌ NO
- Custom hooks that don't use state: ✅ YES (if they're pure functions)
- **Source:** https://react.dev/reference/rsc/server-components

### Query: Next.js Middleware Scope

**Question:** Does Next.js middleware run on all routes?

**Answer:**
- Middleware runs on ALL routes by default
- Can be scoped with `matcher` config
- **Source:** https://nextjs.org/docs/app/building-your-application/routing/middleware

### Query: Playwright WebSocket Testing

**Question:** Can Playwright test WebSocket connections?

**Answer:**
- ✅ YES via `page.on('websocket')`
- Can intercept and mock WebSocket messages
- **Source:** https://playwright.dev/docs/api/class-websocket

### Query: PostgreSQL JSON Operators

**Question:** Does PostgreSQL support JSON path queries?

**Answer:**
- ✅ YES via `->` (returns JSON) and `->>` (returns text)
- Available since PostgreSQL 9.3
- **Source:** https://www.postgresql.org/docs/current/functions-json.html

---

## Updating Knowledge Base

After each Context7 query, update `.ai/knowledge/knowledge-base.md`.

### Update Template

```markdown
### [Library Name]

**Version:** [X.Y.Z]
**Last Validated:** [YYYY-MM-DD]

#### Hard Constraints

| Constraint | Evidence | Impact |
|------------|----------|--------|
| [What doesn't work] | [Docs URL + quote] | [Architectural implication] |

#### Recommended Patterns

- **Pattern:** [Name]
  - **Use Case:** [When to apply]
  - **Source:** [Docs URL]

#### Anti-Patterns

- **Anti-Pattern:** [Name]
  - **Symptom:** [What developers try]
  - **Why It Fails:** [Technical reason from docs]
  - **Correct Approach:** [Alternative]
```

---

## Validation Criteria

Before approving an architectural decision:

- [ ] All technical claims queried via Context7
- [ ] Evidence extracted (quote + URL)
- [ ] Findings documented in knowledge base
- [ ] No contradictions between docs and proposal
- [ ] Version compatibility verified

---

## Common Mistakes

### Mistake 1: Trusting Assumptions Without Verification

❌ **Wrong:**
```
Architect: "Let's use Server Components for the dashboard. They can handle state."
Knowledge Curator: [doesn't check] "Sounds good."
```

✅ **Correct:**
```
Architect: "Let's use Server Components for the dashboard. They can handle state."
Knowledge Curator: "Let me verify that via Context7..."
[Queries Context7, finds Server Components can't use useState]
Knowledge Curator: "REJECTED. Server Components cannot use state hooks."
```

### Mistake 2: Using Outdated Documentation

❌ **Wrong:**
```
Knowledge Curator: "According to this 2019 blog post, Next.js doesn't support middleware."
```

✅ **Correct:**
```
Knowledge Curator queries Context7 for current Next.js docs
Context7 returns: "Middleware is supported since Next.js 12.0"
```

### Mistake 3: Not Documenting Findings

❌ **Wrong:**
```
Knowledge Curator queries Context7, gets answer, verbally tells Architect
[6 months later, same question arises, must re-query]
```

✅ **Correct:**
```
Knowledge Curator queries Context7
Updates `.ai/knowledge/knowledge-base.md` with findings
[6 months later, constraint is already documented]
```

---

## MCP Tool Usage

If Context7 is integrated via MCP (Model Context Protocol):

### Resolve Library ID

```typescript
// First, resolve library name to Context7 ID
const libraries = await mcp.context7.resolveLibraryId({
  libraryName: 'react',
  query: 'React Server Components hooks'
});

// Returns:
// [{ libraryId: '/facebook/react', version: '18.2.0', ... }]
```

### Query Documentation

```typescript
const docs = await mcp.context7.queryDocs({
  libraryId: '/facebook/react',
  query: 'Can Server Components use useState hook?'
});

// Returns:
// { answer: '...', sources: [...], codeExamples: [...] }
```

### Extract Evidence

From the response:
1. Read `answer` field
2. Extract quotes from `sources`
3. Review `codeExamples` for practical demonstrations

---

## Exemptions

NONE. Constitution Article IV mandates Knowledge Curator validation before architectural decisions.

If Context7 is unavailable:
1. Manually query official documentation
2. Document source URL and quote
3. Treat as temporary — revalidate when Context7 is available

---

## References

- Constitution Article IV (Knowledge Curator mandate)
- `.ai/agents/knowledge-curator.md` (agent definition)
- `.ai/knowledge/knowledge-base.md` (knowledge cache)

---

**END OF CONTEXT7 SKILL**
