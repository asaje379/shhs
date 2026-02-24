# Skill: Playwright End-to-End Testing

**ID:** `playwright`
**Version:** 1.0.0
**Status:** MANDATORY for critical paths
**Authority:** Constitution Article III

---

## When to Apply

This skill is MANDATORY for:

- Authentication flows
- Payment/transaction flows
- Data mutation operations
- Primary user journeys (signup → activation → core action)

---

## What Is E2E Testing?

End-to-End testing validates the **entire user flow** from UI to database and back.

Unlike unit tests (which test functions in isolation), E2E tests verify:
- UI renders correctly
- User interactions work (clicks, typing, navigation)
- Backend processes data correctly
- Database persists changes
- Edge cases and error states

---

## Setup

### Install Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### Directory Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── billing/
│   │   ├── checkout.spec.ts
│   │   └── subscription.spec.ts
│   └── fixtures/
│       ├── test-users.json
│       └── test-data.ts
└── playwright.config.ts
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Writing E2E Tests

### Anatomy of a Playwright Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {

  test('should log in with valid credentials', async ({ page }) => {
    // ARRANGE: Navigate to login page
    await page.goto('/login');

    // ACT: Fill in form and submit
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.click('button[type="submit"]');

    // ASSERT: Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

});
```

### Arrange-Act-Assert Pattern

| Phase | Purpose | Example |
|-------|---------|---------|
| **Arrange** | Set up initial state | Navigate to page, seed database |
| **Act** | Perform user action | Click button, fill form, submit |
| **Assert** | Verify outcome | Check URL, verify text, validate data |

---

## Best Practices

### 1. Use Data-Testid for Stable Selectors

❌ **Fragile:**
```typescript
await page.click('button:nth-child(3)'); // Breaks if button order changes
await page.click('.btn-primary'); // Breaks if CSS class changes
```

✅ **Robust:**
```typescript
await page.click('[data-testid="submit-button"]');
```

**Implementation:**
```html
<button data-testid="submit-button" class="btn-primary">
  Submit
</button>
```

### 2. Test User Flows, Not Implementation

❌ **Wrong:**
```typescript
test('should call POST /api/users with correct payload', async ({ page }) => {
  // Testing API implementation, not user experience
});
```

✅ **Correct:**
```typescript
test('should display success message after user signup', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', 'new@example.com');
  await page.fill('[data-testid="password"]', 'Password123');
  await page.click('[data-testid="signup-button"]');

  await expect(page.locator('[data-testid="success-message"]'))
    .toContainText('Account created successfully');
});
```

### 3. Use Fixtures for Reusable Setup

```typescript
// tests/e2e/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Log in before each test
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    await use(page);
  },
});
```

**Usage:**
```typescript
import { test } from './fixtures/auth.fixture';

test('should access protected dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL('/dashboard');
  // No need to log in manually - fixture handles it
});
```

### 4. Test Edge Cases and Error States

Don't just test happy paths.

```typescript
test.describe('Login Error Handling', () => {

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'wrong@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid email or password');
  });

  test('should disable submit while request is pending', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password');

    const submitButton = page.locator('[data-testid="login-button"]');
    await submitButton.click();

    // Button should be disabled during request
    await expect(submitButton).toBeDisabled();
  });

});
```

### 5. Ensure Idempotency

Tests must be repeatable without manual cleanup.

❌ **Non-idempotent:**
```typescript
test('should create new user', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', 'test@example.com'); // Fails on second run!
  // ...
});
```

✅ **Idempotent:**
```typescript
import { randomUUID } from 'crypto';

test('should create new user', async ({ page }) => {
  const uniqueEmail = `test-${randomUUID()}@example.com`;
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', uniqueEmail);
  // ...
});
```

**Or use database cleanup:**
```typescript
test.beforeEach(async () => {
  // Clean up test data before each test
  await database.query('DELETE FROM users WHERE email LIKE "test-%"');
});
```

---

## Critical Flow Examples

### Example 1: Authentication Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Complete Authentication Flow', () => {

  test('should sign up, verify email, and log in', async ({ page, context }) => {
    const email = `user-${Date.now()}@example.com`;

    // Step 1: Sign up
    await page.goto('/signup');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecurePass123');
    await page.click('[data-testid="signup-button"]');

    // Step 2: Verify redirect to email verification page
    await expect(page).toHaveURL('/verify-email');
    await expect(page.locator('[data-testid="verification-message"]'))
      .toContainText('Check your email');

    // Step 3: Simulate email verification (use test API or direct DB update)
    await page.goto(`/api/test/verify-email?email=${email}`);

    // Step 4: Log in
    await page.goto('/login');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecurePass123');
    await page.click('[data-testid="login-button"]');

    // Step 5: Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-email"]'))
      .toContainText(email);
  });

});
```

### Example 2: Payment Flow

```typescript
test.describe('Checkout and Payment', () => {

  test('should complete purchase with credit card', async ({ page }) => {
    // Arrange: Log in and add item to cart
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'buyer@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    await page.goto('/products/premium-plan');
    await page.click('[data-testid="add-to-cart"]');

    // Act: Proceed to checkout
    await page.goto('/checkout');
    await page.fill('[data-testid="card-number"]', '4242424242424242'); // Test card
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    await page.click('[data-testid="complete-purchase"]');

    // Assert: Verify successful payment
    await expect(page).toHaveURL(/\/success/);
    await expect(page.locator('[data-testid="order-confirmation"]'))
      .toBeVisible();

    // Assert: Verify order in database
    const response = await page.request.get('/api/orders/latest');
    const order = await response.json();
    expect(order.status).toBe('completed');
    expect(order.amount).toBe(9900); // $99.00
  });

});
```

---

## Assertions

### Common Assertions

| Assertion | Purpose |
|-----------|---------|
| `await expect(page).toHaveURL('/dashboard')` | Check URL |
| `await expect(locator).toContainText('Welcome')` | Check text content |
| `await expect(locator).toBeVisible()` | Check visibility |
| `await expect(locator).toBeDisabled()` | Check disabled state |
| `await expect(locator).toHaveCount(3)` | Check number of elements |
| `await expect(locator).toHaveAttribute('href', '/profile')` | Check attribute |

### API Assertions

```typescript
test('should create order in database', async ({ page }) => {
  // Perform UI action
  await page.click('[data-testid="submit-order"]');

  // Assert via API
  const response = await page.request.get('/api/orders/latest');
  expect(response.status()).toBe(200);

  const order = await response.json();
  expect(order).toMatchObject({
    status: 'pending',
    userId: 'user-123',
  });
});
```

---

## Debugging

### Visual Debugging

```bash
# Run with headed browser (see what's happening)
npx playwright test --headed

# Run in debug mode (pause and step through)
npx playwright test --debug
```

### Screenshots on Failure

```typescript
test('should display dashboard', async ({ page }) => {
  await page.goto('/dashboard');

  // Automatically capture screenshot on failure
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

Configure in `playwright.config.ts`:
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### Trace Viewer

```bash
# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Validation Criteria

Before considering Playwright testing complete:

- [ ] All critical flows have E2E tests
- [ ] Tests pass in CI/CD pipeline
- [ ] Tests are idempotent (can run repeatedly)
- [ ] Error states are tested
- [ ] Tests use stable selectors (data-testid)
- [ ] No flaky tests (tests pass consistently)

---

## Common Mistakes

### Mistake 1: Testing Too Much in One Test

❌ **Wrong:**
```typescript
test('should do everything', async ({ page }) => {
  // Signup + login + profile update + logout = too much
});
```

✅ **Correct:**
```typescript
test('should sign up', async ({ page }) => { /* ... */ });
test('should log in', async ({ page }) => { /* ... */ });
test('should update profile', async ({ page }) => { /* ... */ });
```

### Mistake 2: Hardcoding Waits

❌ **Wrong:**
```typescript
await page.click('[data-testid="submit"]');
await page.waitForTimeout(3000); // Fragile!
```

✅ **Correct:**
```typescript
await page.click('[data-testid="submit"]');
await page.waitForURL('/success'); // Wait for specific condition
```

### Mistake 3: Not Cleaning Up Test Data

❌ **Wrong:**
```typescript
test('should create user', async ({ page }) => {
  // Creates user but never deletes it → subsequent runs fail
});
```

✅ **Correct:**
```typescript
test.afterEach(async () => {
  await database.query('DELETE FROM users WHERE email LIKE "test-%"');
});
```

---

## Integration with SHHS

### Pipeline Position

E2E tests run during **QA Validator** phase.

```
Developer implements feature
    ↓
Static Reviewer validates structure
    ↓
QA Validator runs E2E tests ← Playwright runs here
    ↓
Domain Architect approves
```

### Enforcement by QA Validator

QA Validator MUST verify:
- All critical paths have Playwright tests
- All tests pass
- No flaky tests (tests pass 3 consecutive runs)

---

## References

- Constitution Article III (E2E testing mandate)
- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**END OF PLAYWRIGHT SKILL**
