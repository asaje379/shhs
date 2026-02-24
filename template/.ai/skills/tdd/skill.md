# Skill: Test-Driven Development (TDD)

**ID:** `tdd`
**Version:** 1.0.0
**Status:** MANDATORY
**Authority:** Constitution Article II

---

## When to Apply

This skill is MANDATORY for ALL feature development.

No exceptions. If you believe TDD is impractical, the feature is incorrectly scoped.

---

## The Cycle

```
RED → GREEN → REFACTOR
```

Every feature must go through this cycle at least once.

---

## Phase 1: RED

### Objective

Write a failing test that specifies the desired behavior.

### Steps

1. **Create test file**
   - Convention: `[module].test.ts` or `[module].spec.ts`
   - Location: Mirror source structure (e.g., `src/services/user.service.ts` → `src/services/user.service.test.ts`)

2. **Write the test**
   ```typescript
   describe('UserService', () => {
     it('should create a new user with valid email', async () => {
       const userService = new UserService();
       const user = await userService.createUser({
         email: 'test@example.com',
         name: 'Test User'
       });

       expect(user).toBeDefined();
       expect(user.email).toBe('test@example.com');
       expect(user.id).toBeTruthy();
     });
   });
   ```

3. **Run the test**
   ```bash
   npm test -- user.service.test.ts
   ```

4. **Verify it fails for the right reason**
   - ✅ Good failure: "UserService is not defined"
   - ✅ Good failure: "createUser is not a function"
   - ❌ Bad failure: "SyntaxError: unexpected token"
   - ❌ Bad failure: "Cannot import module" (setup issue, not test failure)

### Validation Checklist

- [ ] Test file created
- [ ] Test executes (even if it fails)
- [ ] Failure message clearly indicates missing functionality
- [ ] No syntax errors or import issues

---

## Phase 2: GREEN

### Objective

Write the MINIMUM code to make the test pass.

### Steps

1. **Create implementation file** (if it doesn't exist)
   ```typescript
   // src/services/user.service.ts
   export class UserService {
     async createUser(data: { email: string; name: string }) {
       // MINIMAL implementation
       return {
         id: '1',
         email: data.email,
         name: data.name
       };
     }
   }
   ```

2. **Run the test again**
   ```bash
   npm test -- user.service.test.ts
   ```

3. **Verify it passes**
   - ✅ All assertions pass
   - ✅ No warnings or errors

### Anti-Patterns to Avoid

❌ **Over-engineering during GREEN phase**
```typescript
// BAD: Adding features not required by test
async createUser(data: UserInput) {
  await this.validateEmail(data.email); // Not tested yet!
  await this.checkDuplicates(data.email); // Not tested yet!
  return this.repository.save(data); // Not tested yet!
}
```

✅ **Correct GREEN phase**
```typescript
// GOOD: Minimal code to pass current test
async createUser(data: { email: string; name: string }) {
  return {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name
  };
}
```

### Validation Checklist

- [ ] Test passes
- [ ] No additional functionality beyond what test requires
- [ ] No refactoring done yet (save for next phase)

---

## Phase 3: REFACTOR

### Objective

Improve code structure WITHOUT changing behavior.

### Steps

1. **Identify code smells**
   - Duplication
   - Long functions
   - Unclear variable names
   - Hard-coded values
   - Poor separation of concerns

2. **Refactor incrementally**
   ```typescript
   // Before refactoring
   async createUser(data: { email: string; name: string }) {
     return {
       id: crypto.randomUUID(),
       email: data.email,
       name: data.name
     };
   }

   // After refactoring
   async createUser(data: CreateUserInput): Promise<User> {
     const id = this.generateId();
     return this.buildUserObject(id, data);
   }

   private generateId(): string {
     return crypto.randomUUID();
   }

   private buildUserObject(id: string, data: CreateUserInput): User {
     return { id, ...data };
   }
   ```

3. **Run tests after EACH refactoring**
   ```bash
   npm test
   ```

4. **Verify tests still pass**
   - ✅ All tests green
   - ✅ No new warnings
   - ✅ Code is cleaner

### Refactoring Patterns

| Smell | Refactoring |
|-------|-------------|
| Duplicated code | Extract method |
| Long function | Split into smaller functions |
| Magic numbers | Extract to named constants |
| Unclear names | Rename variable/function |
| God class | Extract class |

### Validation Checklist

- [ ] Code is clearer than before
- [ ] All tests still pass
- [ ] No new functionality added
- [ ] Committed separately from GREEN phase

---

## Iteration

After REFACTOR, return to RED to add the next increment of functionality.

**Example Iteration:**
1. RED: Test user email validation
2. GREEN: Add email regex check
3. REFACTOR: Extract validation to separate validator class
4. RED: Test duplicate email detection
5. GREEN: Add database query for existing email
6. REFACTOR: Extract database logic to repository
7. Continue...

---

## Integration with SHHS

### Pipeline Position

TDD occurs during **Developer Agent** phase.

```
Architect defines contract
    ↓
Developer applies TDD skill ← YOU ARE HERE
    ↓
Static Reviewer validates structure
    ↓
QA Validator runs tests
```

### Validation by Static Reviewer

Static Reviewer MUST verify git history shows test files modified BEFORE implementation files.

```bash
# Validation command
git log --oneline --name-status | grep -E "(test|spec)\."
```

Expected pattern:
```
M  src/services/user.service.test.ts  (commit 1 - RED)
M  src/services/user.service.ts       (commit 2 - GREEN)
M  src/services/user.service.ts       (commit 3 - REFACTOR)
```

---

## Common Mistakes

### Mistake 1: Writing Implementation First

❌ **Wrong:**
```
1. Write UserService.createUser()
2. Write test for createUser()
```

✅ **Correct:**
```
1. Write test for createUser() (RED)
2. Watch it fail
3. Write UserService.createUser() (GREEN)
4. Watch it pass
```

### Mistake 2: Testing Implementation Details

❌ **Wrong:**
```typescript
it('should call database.insert with correct params', () => {
  const spy = jest.spyOn(database, 'insert');
  userService.createUser(data);
  expect(spy).toHaveBeenCalledWith('users', data);
});
```

✅ **Correct:**
```typescript
it('should persist user to database', async () => {
  const user = await userService.createUser(data);
  const saved = await database.findById(user.id);
  expect(saved).toEqual(user);
});
```

### Mistake 3: Skipping Refactor

❌ **Wrong:**
```
RED → GREEN → RED → GREEN → RED → GREEN (refactor never happens)
```

✅ **Correct:**
```
RED → GREEN → REFACTOR → RED → GREEN → REFACTOR
```

### Mistake 4: Refactoring During GREEN

❌ **Wrong:**
```typescript
// Making test pass AND refactoring simultaneously
async createUser(data: CreateUserInput): Promise<User> {
  await this.validator.validate(data); // Refactoring during GREEN!
  return this.repository.save(data);
}
```

✅ **Correct:**
```typescript
// GREEN: Minimal code
async createUser(data: CreateUserInput): Promise<User> {
  return { id: crypto.randomUUID(), ...data };
}

// REFACTOR: Improve later
async createUser(data: CreateUserInput): Promise<User> {
  const id = this.idGenerator.generate();
  return this.userFactory.create(id, data);
}
```

---

## Validation Criteria

Before considering TDD complete for a feature:

- [ ] At least one full RED → GREEN → REFACTOR cycle completed
- [ ] Test coverage ≥ 80% for new code
- [ ] Git history shows test commits before implementation commits
- [ ] All tests pass
- [ ] Code is refactored (no "I'll clean it up later")

---

## Tools

### Test Runners

- **Jest:** Node.js (recommended)
- **Vitest:** Vite projects
- **Mocha + Chai:** Alternative for Node.js

### Coverage Tools

```bash
# Jest
npm test -- --coverage

# Vitest
npm test -- --coverage
```

### Watch Mode

```bash
# Jest
npm test -- --watch

# Vitest
npm test -- --watch
```

Run tests continuously during development.

---

## Anti-TDD Patterns (Forbidden)

1. **Test-After Development (TAD)**
   - Writing implementation first, tests second
   - Violates RED-first principle

2. **Test-Last Development (TLD)**
   - Writing all features, then writing all tests
   - Loses feedback loop benefit

3. **Test-Never Development (TND)**
   - "Tests slow me down"
   - Rejected by Constitution

---

## Exemptions

NONE. Constitution Article II declares TDD non-negotiable.

If TDD feels impractical:
1. Feature is too large (break it down)
2. Feature is poorly defined (return to Architect for clarification)
3. Technical constraints exist (Knowledge Curator must validate)

---

## References

- Constitution Article II (TDD mandate)
- Martin Fowler: "Refactoring: Improving the Design of Existing Code"
- Kent Beck: "Test-Driven Development: By Example"

---

**END OF TDD SKILL**
