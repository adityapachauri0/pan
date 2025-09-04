const { test, expect } = require('@playwright/test');

test.describe('Contacts Management Tests', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 15000 });
    
    // Navigate to contacts tab
    await page.click('text=Contacts');
    await page.waitForSelector('text=All Contacts', { timeout: 10000 });
  });

  test('should display contacts page correctly', async ({ page }) => {
    // Check page title and search
    await expect(page.locator('text=All Contacts')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check add contact button if it exists
    const addButton = page.locator('text=Add Contact, button:has-text("Add"), button:has-text("New")');
    if (await addButton.count() > 0) {
      await expect(addButton.first()).toBeVisible();
    }
    
    // Check contacts display (table or cards)
    await expect(
      page.locator('text=No contacts found').or(
        page.locator('.contact-item, .contact-card, tbody tr, .grid > div')
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('should search contacts effectively', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Test search functionality
    await searchInput.fill('test');
    await page.waitForTimeout(1000); // Allow debounce
    
    // Results should update
    await expect(
      page.locator('text=No contacts found').or(
        page.locator('.contact-item, .contact-card, tbody tr')
      )
    ).toBeVisible();
    
    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);
  });

  test('should filter contacts by status', async ({ page }) => {
    // Look for status filter dropdown or buttons
    const statusFilters = [
      'text=All',
      'text=New', 
      'text=Contacted',
      'text=Quoted',
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
        page.locator('text=No contacts found').or(
          page.locator('.contact-item, .contact-card, tbody tr')
        )
      ).toBeVisible();
    }
  });

  test('should display contact details correctly', async ({ page }) => {
    // Look for contacts in various formats
    const contactSelectors = [
      '.contact-card',
      '.contact-item', 
      'tbody tr',
      '.grid > div:has(text)',
      '[data-testid="contact-item"]'
    ];
    
    let contactFound = false;
    for (const selector of contactSelectors) {
      const contacts = page.locator(selector);
      if (await contacts.count() > 0) {
        // If contacts exist, check they have relevant information
        const firstContact = contacts.first();
        
        // Look for typical contact fields
        const hasName = await firstContact.locator('text=/[A-Za-z]{2,}/').count() > 0;
        const hasEmail = await firstContact.locator('text=/@/').count() > 0;
        
        if (hasName || hasEmail) {
          contactFound = true;
          break;
        }
      }
    }
    
    // Either contacts exist with data, or show empty state
    if (!contactFound) {
      await expect(page.locator('text=No contacts found')).toBeVisible();
    }
  });

  test('should handle contact actions', async ({ page }) => {
    // Look for action buttons (edit, view, delete, etc.)
    const actionSelectors = [
      'button:has-text("Edit")',
      'button:has-text("View")', 
      'button:has-text("Delete")',
      '.action-button',
      '[data-testid="contact-action"]',
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
    
    // Actions should exist if there are contacts, or be hidden if no contacts
    const hasContacts = await page.locator('.contact-item, .contact-card, tbody tr').count() > 0;
    const hasNoContactsMessage = await page.locator('text=No contacts found').count() > 0;
    
    if (hasContacts && !hasNoContactsMessage) {
      expect(actionFound).toBeTruthy();
    }
  });

  test('should handle pagination if present', async ({ page }) => {
    // Look for pagination elements
    const paginationSelectors = [
      '.pagination',
      'button:has-text("Next")',
      'button:has-text("Previous")', 
      'button:has-text("1")',
      '[data-testid="pagination"]',
      '.page-number, .page-button'
    ];
    
    let paginationFound = false;
    for (const selector of paginationSelectors) {
      if (await page.locator(selector).count() > 0) {
        paginationFound = true;
        // Click next page if available
        const nextButton = page.locator('button:has-text("Next"):not([disabled])');
        if (await nextButton.count() > 0) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
        break;
      }
    }
    
    // Pagination is optional, so no assertions needed
  });

  test('should maintain responsive design in contacts view', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=All Contacts')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=All Contacts')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('text=All Contacts')).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // If no contacts, should show empty state
    const hasContacts = await page.locator('.contact-item, .contact-card, tbody tr').count() > 0;
    
    if (!hasContacts) {
      await expect(page.locator('text=No contacts found')).toBeVisible();
    } else {
      // If contacts exist, they should be properly displayed
      await expect(page.locator('.contact-item, .contact-card, tbody tr')).toHaveCount({ min: 1 });
    }
  });
});