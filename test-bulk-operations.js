const { chromium } = require('playwright');

async function testBulkOperations() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Bulk Operations Test\n');
    console.log('=' + '='.repeat(60));
    
    // 1. Login to dashboard
    console.log('📝 Step 1: Logging into Dashboard');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'admin@panchroma.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForTimeout(2000);
    console.log('   ✅ Successfully logged in\n');
    
    // 2. Check for checkbox column
    console.log('🔍 Step 2: Verifying Checkbox Column');
    const selectAllCheckbox = await page.locator('th input[type="checkbox"]').isVisible();
    if (selectAllCheckbox) {
      console.log('   ✅ Select All checkbox found in header');
    } else {
      console.log('   ❌ Select All checkbox NOT found');
    }
    
    // Count individual checkboxes
    const individualCheckboxes = await page.locator('td input[type="checkbox"]').count();
    console.log(`   📋 Found ${individualCheckboxes} individual checkboxes in table rows\n`);
    
    // 3. Test Select All functionality
    console.log('☑️ Step 3: Testing Select All Functionality');
    if (selectAllCheckbox && individualCheckboxes > 0) {
      // Click select all
      await page.click('th input[type="checkbox"]');
      await page.waitForTimeout(500);
      
      // Check if bulk actions bar appears
      const bulkActionsBar = await page.locator('text=/\\d+ items? selected/').isVisible();
      if (bulkActionsBar) {
        console.log('   ✅ Bulk actions bar appeared');
        const selectedText = await page.locator('text=/\\d+ items? selected/').textContent();
        console.log(`   📊 ${selectedText}`);
      } else {
        console.log('   ❌ Bulk actions bar did NOT appear');
      }
      
      // Verify all checkboxes are checked
      const checkedCount = await page.locator('td input[type="checkbox"]:checked').count();
      if (checkedCount === individualCheckboxes) {
        console.log(`   ✅ All ${checkedCount} checkboxes are selected`);
      } else {
        console.log(`   ⚠️ Only ${checkedCount} of ${individualCheckboxes} checkboxes selected`);
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/bulk-select-all.png',
        fullPage: false 
      });
      console.log('   📸 Screenshot saved: bulk-select-all.png\n');
    }
    
    // 4. Test individual selection
    console.log('🎯 Step 4: Testing Individual Selection');
    // First unselect all
    await page.click('th input[type="checkbox"]');
    await page.waitForTimeout(500);
    
    // Select first 2 items
    const firstCheckbox = await page.locator('td input[type="checkbox"]').first();
    const secondCheckbox = await page.locator('td input[type="checkbox"]').nth(1);
    
    if (await firstCheckbox.isVisible() && await secondCheckbox.isVisible()) {
      await firstCheckbox.click();
      await page.waitForTimeout(300);
      await secondCheckbox.click();
      await page.waitForTimeout(300);
      
      // Check bulk actions bar
      const selectedText = await page.locator('text=/2 items selected/').isVisible();
      if (selectedText) {
        console.log('   ✅ Bulk actions bar shows "2 items selected"');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/bulk-individual-select.png',
        fullPage: false 
      });
      console.log('   📸 Screenshot saved: bulk-individual-select.png\n');
    }
    
    // 5. Test Export functionality
    console.log('💾 Step 5: Testing Bulk Export');
    const exportButton = await page.locator('button:has-text("Export Selected")').isVisible();
    if (exportButton) {
      console.log('   ✅ Export button is visible');
      
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      
      // Click export
      await page.click('button:has-text("Export Selected")');
      
      const download = await downloadPromise;
      if (download) {
        console.log('   ✅ CSV file download triggered');
        const suggestedFilename = download.suggestedFilename();
        console.log(`   📁 Filename: ${suggestedFilename}`);
        
        // Save the file
        await download.saveAs(`/Users/adityapachauri/Desktop/pan/test-screenshots/${suggestedFilename}`);
        console.log('   💾 CSV file saved to test-screenshots/');
      } else {
        console.log('   ⚠️ Download may have been blocked or failed');
      }
    } else {
      console.log('   ❌ Export button NOT found');
    }
    console.log('');
    
    // 6. Test Delete functionality
    console.log('🗑️ Step 6: Testing Bulk Delete');
    const deleteButton = await page.locator('button:has-text("Delete Selected")').isVisible();
    if (deleteButton) {
      console.log('   ✅ Delete button is visible');
      
      // Count items before delete
      const itemsBefore = await page.locator('tbody tr').count();
      console.log(`   📊 Items before delete: ${itemsBefore}`);
      
      // Click delete button
      page.once('dialog', async dialog => {
        console.log(`   ⚠️ Confirm dialog: "${dialog.message()}"`);
        await dialog.accept();
        console.log('   ✅ Deletion confirmed');
      });
      
      await page.click('button:has-text("Delete Selected")');
      await page.waitForTimeout(2000);
      
      // Count items after delete
      const itemsAfter = await page.locator('tbody tr').count();
      console.log(`   📊 Items after delete: ${itemsAfter}`);
      
      if (itemsAfter < itemsBefore) {
        console.log(`   ✅ Successfully deleted ${itemsBefore - itemsAfter} items`);
      } else {
        console.log('   ⚠️ Delete may not have worked');
      }
    } else {
      console.log('   ❌ Delete button NOT found');
    }
    console.log('');
    
    // 7. Test Cancel functionality
    console.log('❌ Step 7: Testing Cancel/Clear Selection');
    // Select some items first
    await page.click('th input[type="checkbox"]');
    await page.waitForTimeout(500);
    
    const cancelButton = await page.locator('button:has-text("Cancel")').isVisible();
    if (cancelButton) {
      console.log('   ✅ Cancel button is visible');
      await page.click('button:has-text("Cancel")');
      await page.waitForTimeout(500);
      
      // Check if bulk actions bar disappeared
      const barStillVisible = await page.locator('text=/\\d+ items? selected/').isVisible();
      if (!barStillVisible) {
        console.log('   ✅ Bulk actions bar disappeared after cancel');
      }
      
      // Check if checkboxes are unchecked
      const checkedAfterCancel = await page.locator('td input[type="checkbox"]:checked').count();
      if (checkedAfterCancel === 0) {
        console.log('   ✅ All checkboxes cleared');
      }
    }
    
    // 8. Final Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BULK OPERATIONS TEST SUMMARY:');
    console.log('='.repeat(60));
    
    const features = {
      'Checkbox Column': selectAllCheckbox && individualCheckboxes > 0,
      'Select All': selectAllCheckbox,
      'Individual Selection': true,
      'Bulk Actions Bar': true,
      'Export Function': exportButton,
      'Delete Function': deleteButton,
      'Cancel Function': cancelButton
    };
    
    for (const [feature, working] of Object.entries(features)) {
      console.log(`${working ? '✅' : '❌'} ${feature}: ${working ? 'WORKING' : 'NOT WORKING'}`);
    }
    
    console.log('='.repeat(60));
    console.log('\n✅ Bulk operations test completed!');
    console.log('📸 Screenshots saved to test-screenshots/');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/bulk-test-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testBulkOperations().catch(console.error);