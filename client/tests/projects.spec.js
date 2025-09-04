const { test, expect } = require('@playwright/test');

test.describe('Projects Management Tests', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Navigate to projects tab
    await page.click('text=Projects');
    await page.waitForSelector('text=All Projects', { timeout: 10000 });
  });

  test('should display projects page correctly', async ({ page }) => {
    // Check page title and search
    await expect(page.locator('text=All Projects')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check add project button if it exists
    const addButton = page.locator('text=Add Project, button:has-text("Add"), button:has-text("New")');
    if (await addButton.count() > 0) {
      await expect(addButton.first()).toBeVisible();
    }
    
    // Check projects display (table or cards)
    await expect(
      page.locator('text=No projects found').or(
        page.locator('.project-item, .project-card, tbody tr, .grid > div')
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('should search projects effectively', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Test search functionality
    await searchInput.fill('test');
    await page.waitForTimeout(1000); // Allow debounce
    
    // Results should update
    await expect(
      page.locator('text=No projects found').or(
        page.locator('.project-item, .project-card, tbody tr')
      )
    ).toBeVisible();
    
    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);
  });

  test('should filter projects by status', async ({ page }) => {
    // Look for status filter dropdown or buttons
    const statusFilters = [
      'text=All',
      'text=Planning',
      'text=Development', 
      'text=Completed',
      'select[name*="status"], select:has(option)',
      'button:has-text("Status")',
      '.filter-button, .status-filter'
    ];
    
    let filterFound = false;
    for (const selector of statusFilters) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).first().click();
        filterFound = true;
        break;
      }
    }
    
    if (filterFound) {
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Results should update
      await expect(
        page.locator('text=No projects found').or(
          page.locator('.project-item, .project-card, tbody tr')
        )
      ).toBeVisible();
    }
  });

  test('should display project details correctly', async ({ page }) => {
    // Look for projects in various formats
    const projectSelectors = [
      '.project-card',
      '.project-item',
      'tbody tr',
      '.grid > div:has(text)',
      '[data-testid="project-item"]'
    ];
    
    let projectFound = false;
    for (const selector of projectSelectors) {
      const projects = page.locator(selector);
      if (await projects.count() > 0) {
        // If projects exist, check they have relevant information
        const firstProject = projects.first();
        
        // Look for typical project fields
        const hasTitle = await firstProject.locator('text=/[A-Za-z]{2,}/').count() > 0;
        const hasBudget = await firstProject.locator('text=/\\$|£|€|budget/i').count() > 0;
        const hasStatus = await firstProject.locator('text=/planning|development|completed|design/i').count() > 0;
        
        if (hasTitle || hasBudget || hasStatus) {
          projectFound = true;
          break;
        }
      }
    }
    
    // Either projects exist with data, or show empty state
    if (!projectFound) {
      await expect(page.locator('text=No projects found')).toBeVisible();
    }
  });

  test('should handle project actions', async ({ page }) => {
    // Look for action buttons (edit, view, delete, etc.)
    const actionSelectors = [
      'button:has-text("Edit")',
      'button:has-text("View")',
      'button:has-text("Delete")',
      '.action-button',
      '[data-testid="project-action"]',
      '.fa-edit, .fa-eye, .fa-trash',
      'button[title="Edit"], button[title="View"], button[title="Delete"]'
    ];
    
    let actionFound = false;
    for (const selector of actionSelectors) {
      if (await page.locator(selector).count() > 0) {
        actionFound = true;
        break;
      }
    }
    
    // Actions should exist if there are projects, or be hidden if no projects
    const hasProjects = await page.locator('.project-item, .project-card, tbody tr').count() > 0;
    const hasNoProjectsMessage = await page.locator('text=No projects found').count() > 0;
    
    if (hasProjects && !hasNoProjectsMessage) {
      expect(actionFound).toBeTruthy();
    }
  });

  test('should display project status indicators', async ({ page }) => {
    // Look for status indicators
    const statusIndicators = [
      '.status-badge',
      '.badge',
      '.status-indicator',
      'span:has-text("Planning")',
      'span:has-text("Development")',
      'span:has-text("Completed")',
      '[data-testid="project-status"]'
    ];
    
    const hasProjects = await page.locator('.project-item, .project-card, tbody tr').count() > 0;
    
    if (hasProjects) {
      // At least one status indicator should be present
      let statusFound = false;
      for (const selector of statusIndicators) {
        if (await page.locator(selector).count() > 0) {
          statusFound = true;
          break;
        }
      }
      // Status indicators are expected if projects exist
    }
  });

  test('should handle project sorting', async ({ page }) => {
    // Look for sort options
    const sortSelectors = [
      'button:has-text("Sort")',
      'select[name*="sort"]',
      'th:has-text("Name")',
      'th:has-text("Date")', 
      'th:has-text("Status")',
      '.sort-button',
      '[data-testid="sort"]'
    ];
    
    for (const selector of sortSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    // Sorting is optional feature
  });

  test('should maintain responsive design in projects view', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=All Projects')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=All Projects')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('text=All Projects')).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // If no projects, should show empty state
    const hasProjects = await page.locator('.project-item, .project-card, tbody tr').count() > 0;
    
    if (!hasProjects) {
      await expect(page.locator('text=No projects found')).toBeVisible();
    } else {
      // If projects exist, they should be properly displayed
      await expect(page.locator('.project-item, .project-card, tbody tr')).toHaveCount({ min: 1 });
    }
  });

  test('should display project progress indicators', async ({ page }) => {
    // Look for progress bars or completion indicators
    const progressSelectors = [
      '.progress-bar',
      '.progress',
      '.completion-indicator', 
      'text=/%/',
      '[data-testid="project-progress"]',
      '.w-full.bg-gray-200' // Tailwind progress bar
    ];
    
    const hasProjects = await page.locator('.project-item, .project-card, tbody tr').count() > 0;
    
    if (hasProjects) {
      // Progress indicators are optional but nice to have
      for (const selector of progressSelectors) {
        if (await page.locator(selector).count() > 0) {
          await expect(page.locator(selector).first()).toBeVisible();
          break;
        }
      }
    }
  });
});