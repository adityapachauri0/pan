const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Panchroma/);
    
    // Check login form elements
    await expect(page.locator('h2')).toContainText('Panchroma Dashboard');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="rememberMe"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
    
    // Check demo credentials are displayed
    await expect(page.locator('text=Demo Credentials')).toBeVisible();
    await expect(page.locator('text=admin')).toBeVisible();
    await expect(page.locator('text=admin123')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=Username and password are required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'invalidpass');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid username or password')).toBeVisible({ timeout: 10000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill form with valid credentials
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Verify we're on dashboard
    await expect(page.locator('h1')).toContainText('Panchroma');
    await expect(page.locator('text=Welcome back, admin')).toBeVisible();
  });

  test('should remember login when checkbox is checked', async ({ page }) => {
    // Fill form with remember me checked
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.check('input[name="rememberMe"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Check localStorage has token (this would be checked in browser context)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should toggle password visibility', async ({ page }) => {
    // Fill password field
    await page.fill('input[name="password"]', 'testpassword');
    
    // Check password is hidden initially
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click show password button
    await page.click('button[aria-label*="password"], .fa-eye, [data-testid="show-password"]');
    
    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should redirect already authenticated users', async ({ page }) => {
    // First login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Try to go back to login page
    await page.goto('/login');
    
    // Should be redirected back to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });
});