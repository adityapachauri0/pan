const { test, expect } = require('@playwright/test');

test.describe('Dashboard Tests', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
  });

  test('should display dashboard layout correctly', async ({ page }) => {
    // Check sidebar navigation
    await expect(page.locator('h1')).toContainText('Panchroma');
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Contacts')).toBeVisible();
    await expect(page.locator('text=Projects')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
    
    // Check user profile section
    await expect(page.locator('text=Welcome back, admin')).toBeVisible();
    
    // Check logout button is present
    await expect(page.locator('button[title="Logout"]')).toBeVisible();
  });

  test('should display overview metrics', async ({ page }) => {
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="total-contacts"], .metric-card, h3', { timeout: 10000 });
    
    // Check for metric cards (they should have numbers)
    const metricCards = page.locator('.bg-white.rounded-lg.shadow-sm.p-6');
    await expect(metricCards).toHaveCount(4, { timeout: 10000 });
    
    // Check for chart container
    await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate between tabs', async ({ page }) => {
    // Click on Contacts tab
    await page.click('text=Contacts');
    await expect(page.locator('text=All Contacts')).toBeVisible({ timeout: 10000 });
    
    // Click on Projects tab  
    await page.click('text=Projects');
    await expect(page.locator('text=All Projects')).toBeVisible({ timeout: 10000 });
    
    // Click back to Overview tab
    await page.click('text=Overview');
    await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 10000 });
  });

  test('should display contacts in contacts tab', async ({ page }) => {
    // Navigate to contacts tab
    await page.click('text=Contacts');
    await page.waitForSelector('text=All Contacts', { timeout: 10000 });
    
    // Check search functionality exists
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check for contacts table or cards
    await expect(page.locator('text=No contacts found').or(page.locator('.contact-item, .contact-card, tbody tr'))).toBeVisible({ timeout: 10000 });
  });

  test('should display projects in projects tab', async ({ page }) => {
    // Navigate to projects tab
    await page.click('text=Projects');
    await page.waitForSelector('text=All Projects', { timeout: 10000 });
    
    // Check search functionality exists
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check for projects table or cards
    await expect(page.locator('text=No projects found').or(page.locator('.project-item, .project-card, tbody tr'))).toBeVisible({ timeout: 10000 });
  });

  test('should handle search functionality', async ({ page }) => {
    // Go to contacts tab
    await page.click('text=Contacts');
    await page.waitForSelector('text=All Contacts', { timeout: 10000 });
    
    // Search for something
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('test');
    
    // Results should update (even if no results)
    await page.waitForTimeout(1000); // Allow debounce
    
    // Clear search
    await searchInput.fill('');
  });

  test('should handle mobile sidebar toggle', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu button is visible
    await expect(page.locator('button[aria-label*="menu"], .lg\\:hidden button')).toBeVisible();
    
    // Click mobile menu button
    await page.click('button[aria-label*="menu"], .lg\\:hidden button');
    
    // Sidebar should be visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Click logout button
    await page.click('button[title="Logout"]');
    
    // Should redirect to login page
    await page.waitForURL('/login', { timeout: 10000 });
    
    // Should see login form
    await expect(page.locator('text=Sign in to access your dashboard')).toBeVisible();
  });

  test('should show activity feed', async ({ page }) => {
    // Check if activity feed section exists
    await expect(page.locator('text=Recent Activity').or(page.locator('text=Activity Feed'))).toBeVisible({ timeout: 10000 });
    
    // Should show some activity items or empty state
    await expect(
      page.locator('text=No recent activity').or(
        page.locator('.activity-item, .activity-card, [data-testid="activity-item"]')
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display responsive design correctly', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toContainText('Panchroma');
    
    // Test tablet view  
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('Panchroma');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('Panchroma');
  });
});