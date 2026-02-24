# SHHS — app/ Directory Rule

**Constitutional Basis:** Article II
**Version:** 1.1.0
**Status:** NON-NEGOTIABLE

---

## Rule

**All application source code MUST be located in the `app/` directory.**

No exceptions. This is enforced by:
- Constitution Article II
- Fitness Function: `source-code-location` (BLOCK severity)
- Static Reviewer validation

---

## Directory Structure

```
project-root/
├── app/                    # ✅ ALL application code
│   ├── domain/            # Domain models and business logic
│   ├── application/       # Application services and use cases
│   ├── presentation/      # UI components, controllers
│   ├── infrastructure/    # Database, external services
│   └── ...                # Other application modules
│
├── tests/                 # ✅ Test files
│   └── e2e/              # End-to-end tests (Playwright)
│
├── .ai/                   # ✅ SHHS governance (NEVER in app/)
├── scripts/               # ✅ Build/deployment scripts
├── bin/                   # ✅ CLI executables
├── config/                # ✅ Configuration files
├── docs/                  # ✅ Documentation
│
├── package.json           # ✅ Root config
├── tsconfig.json          # ✅ Root config
└── README.md              # ✅ Documentation
```

---

## What Goes in app/

### ✅ Allowed in app/

- **TypeScript/JavaScript source:** `.ts`, `.js`, `.tsx`, `.jsx`
- **Domain models:** Business entities, value objects
- **Application logic:** Services, use cases, commands, queries
- **Presentation layer:** UI components, controllers, routes
- **Infrastructure:** Database access, external APIs, messaging
- **Utilities:** Helpers, validators, formatters (app-specific)

### ❌ NOT Allowed in app/

- `.ai/` governance files
- `tests/` (dedicated test directory)
- Build scripts
- Configuration files (at root)
- Documentation

---

## What Goes Outside app/

### tests/

```
tests/
├── unit/              # Unit tests (or co-located in app/)
├── integration/       # Integration tests
└── e2e/              # Playwright E2E tests
```

**Alternative:** Co-located tests in `app/`
```
app/
├── services/
│   ├── user.service.ts
│   └── user.service.test.ts    # ✅ Co-located test
```

### scripts/

```
scripts/
├── build.sh           # Build scripts
├── deploy.sh          # Deployment scripts
└── migrate.sh         # Database migrations
```

### .ai/

```
.ai/
├── agents/            # Agent definitions
├── ADR/              # Architectural decisions
├── features/         # Feature contracts
└── ...               # All SHHS governance
```

**NEVER mix governance with application code.**

---

## Rationale

### 1. Clear Separation

**Problem:** Mixed code creates cognitive overhead.

**Solution:** Developers know exactly where to find code: `app/`.

### 2. Tooling Compatibility

**Problem:** Build tools struggle with scattered code.

**Solution:** Build tools target `app/` exclusively:

```json
// tsconfig.json
{
  "include": ["app/**/*"],
  "exclude": ["tests", ".ai", "scripts"]
}
```

### 3. Deployment Simplicity

**Problem:** Deploying requires filtering files.

**Solution:** `app/` is self-contained deployable unit:

```bash
# Deploy only app/
docker build --context app/
```

### 4. Clean Architecture Enforcement

**Problem:** Easy to violate layer boundaries with scattered files.

**Solution:** `app/` structure enforces clean architecture:

```
app/
├── domain/            # Core business logic
├── application/       # Use cases
├── presentation/      # UI/API
└── infrastructure/    # External dependencies
```

Fitness functions enforce:
- Domain cannot import infrastructure
- Presentation cannot import database

---

## Migration from src/

If your project uses `src/` instead of `app/`:

### Option 1: Rename (Simple)

```bash
git mv src app
```

### Option 2: Gradual Migration

```bash
# Move modules incrementally
git mv src/domain app/domain
git mv src/services app/application
# Update imports
# Run tests
```

### Option 3: SHHS Exemption (Temporary)

Create exemption in `.ai/architecture/governance/fitness/exemptions.json`:

```json
{
  "exemptions": [
    {
      "rule_id": "source-code-location",
      "file": "src/**/*",
      "reason": "Legacy code pending migration to app/",
      "expires": "2026-06-01",
      "adr": "ADR-XXXX-migrate-to-app-directory.md"
    }
  ]
}
```

**Must have:**
- ADR documenting migration plan
- Expiration date (max 6 months)
- No new code in `src/` (only `app/`)

---

## Enforcement

### Fitness Enforcer

Rule: `source-code-location`

**Checks:**
- All `.ts`, `.js`, `.tsx`, `.jsx` files in `app/` or `tests/`
- Exceptions: Root config files (`package.json`, `tsconfig.json`)

**Violation Detection:**
```bash
# Example violation
src/services/user.service.ts    # ❌ BLOCKED

# Correct
app/services/user.service.ts    # ✅ PASS
```

**Severity:** BLOCK

**Action:** Merge blocked until file moved to `app/`.

### Static Reviewer

**Checks:**
- New files created in correct location
- No application logic outside `app/`

### CI/CD

```yaml
# .github/workflows/fitness.yml
- name: Verify Source Code Location
  run: |
    # Fail if .ts/.js files outside app/ or tests/
    VIOLATIONS=$(find . -name "*.ts" -o -name "*.js" \
      | grep -v "app/" \
      | grep -v "tests/" \
      | grep -v "node_modules" \
      | grep -v ".ai/" \
      | grep -v "scripts/" \
      | grep -v "config/")

    if [ -n "$VIOLATIONS" ]; then
      echo "❌ Source code outside app/ detected:"
      echo "$VIOLATIONS"
      exit 1
    fi
```

---

## FAQ

### Q: Why app/ instead of src/?

**A:** Clarity. `src/` is generic. `app/` explicitly means "application code". Also:
- `src/` often mixes config, tests, scripts
- `app/` enforces clean separation

### Q: Can I use src/ if I prefer?

**A:** No. Constitution Article II is immutable. Exemptions require ADR + expiration date.

### Q: What about monorepos?

**A:** Each package has its own `app/`:

```
packages/
├── api/
│   └── app/           # API application code
├── web/
│   └── app/           # Web application code
└── shared/
    └── app/           # Shared library code
```

### Q: Tests co-located or separate?

**A:** Your choice:

**Option 1: Separate `tests/`**
```
app/services/user.service.ts
tests/unit/services/user.service.test.ts
```

**Option 2: Co-located**
```
app/services/user.service.ts
app/services/user.service.test.ts
```

Both valid. Choose based on team preference.

### Q: Where do migration scripts go?

**A:** `scripts/` or `app/infrastructure/migrations/`

**Recommendation:** `app/infrastructure/migrations/` if migrations are code-driven.

### Q: What about generated code?

**A:** Generated code goes in `app/`:

```
app/generated/
├── graphql/          # GraphQL types
├── prisma/           # Prisma client
└── api-client/       # OpenAPI client
```

Mark in `.gitignore` but enforce location.

---

## Benefits in Practice

### Before (src/ chaos)

```
project/
├── src/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── config.ts      # ❌ Mixed with app code
├── lib/               # ❌ What's the difference?
├── helpers/           # ❌ More utils?
├── tests/
└── scripts/
```

**Problems:**
- Where do new files go? `src/utils/` or `helpers/`?
- Is `lib/` application code or third-party?
- Config mixed with source

### After (app/ clarity)

```
project/
├── app/               # ✅ ALL application code
│   ├── domain/
│   ├── application/
│   ├── presentation/
│   └── infrastructure/
├── tests/             # ✅ Clear separation
├── scripts/           # ✅ Build/deploy only
├── .ai/               # ✅ Governance only
└── config/            # ✅ Config only
```

**Benefits:**
- Zero ambiguity: new code → `app/`
- Clean separation: governance vs application
- Build tools simplified: target `app/` only

---

## Exceptions

### Root-Level Config Files

**Allowed:**
- `package.json`
- `tsconfig.json`
- `jest.config.js`
- `playwright.config.ts`
- `.eslintrc.js`
- `next.config.js`
- `vite.config.ts`

**Rationale:** Tooling expects these at root.

### Scripts and Build

**Allowed:**
- `scripts/` directory
- `bin/` directory (CLI executables)

**Rationale:** Not application logic.

### Tests

**Allowed:**
- `tests/` directory (separate)
- `app/**/*.test.ts` (co-located)

**Rationale:** Testing infrastructure, not application code.

---

## Constitutional Protection

This rule is **IMMUTABLE** (Constitution Article VIII).

Cannot be changed without:
1. Unanimous approval (Root Architect, Domain Architect, Architecture Reviewer)
2. ADR documenting why change is necessary
3. Impact analysis on all existing code

**In practice:** This rule will never change. It's foundational.

---

## Summary

| Location | Purpose | Examples |
|----------|---------|----------|
| `app/` | **ALL application code** | Services, models, controllers, UI |
| `tests/` | Test infrastructure | E2E tests, integration tests |
| `.ai/` | SHHS governance | Agents, ADRs, features |
| `scripts/` | Build/deploy | CI/CD scripts, migrations |
| `config/` | Configuration | Environment configs |
| Root | Tooling config | `package.json`, `tsconfig.json` |

**Golden Rule:** If it's application code → `app/`. No exceptions.

---

**END OF APP DIRECTORY RULE**
