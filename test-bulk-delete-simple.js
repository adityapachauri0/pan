const { chromium } = require('playwright');

async function testBulkDelete() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Bulk Delete Functionality\n');
    console.log('='.repeat(60));
    
    // 1. Navigate directly to dashboard with credentials
    console.log('📝 Step 1: Going to Dashboard');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(1000);
    
    // Check if we need to login
    if (page.url().includes('/login')) {
      console.log('   🔐 Need to login first...');
      await page.fill('input[type="email"]', 'admin@panchroma.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    }
    
    await page.waitForSelector('table', { timeout: 10000 });
    console.log('   ✅ Dashboard loaded\n');
    
    // 2. Count current submissions
    console.log('📊 Step 2: Counting Submissions');
    const initialCount = await page.locator('tbody tr').count();
    console.log(`   📋 Current submissions: ${initialCount}`);
    
    if (initialCount === 0) {
      console.log('   ⚠️ No submissions found. Please add some first.');
      return;
    }
    console.log('');
    
    // 3. Select items for deletion
    console.log('☑️ Step 3: Selecting Items');
    
    // Select first 2 checkboxes
    const checkboxes = await page.locator('td input[type="checkbox"]');
    const toSelect = Math.min(2, initialCount);
    
    for (let i = 0; i < toSelect; i++) {
      await checkboxes.nth(i).check();
      await page.waitForTimeout(300);
    }
    console.log(`   ✅ Selected ${toSelect} items\n`);
    
    // 4. Verify bulk actions bar appears
    console.log('📋 Step 4: Checking Bulk Actions Bar');
    const bulkBar = await page.locator('text=/\\d+ items? selected/').first().isVisible();
    console.log(`   📊 Bulk actions bar visible: ${bulkBar ? 'YES ✅' : 'NO ❌'}`);
    
    const deleteButton = await page.locator('button:has-text("Delete Selected")').isVisible();
    console.log(`   🗑️ Delete button visible: ${deleteButton ? 'YES ✅' : 'NO ❌'}\n`);
    
    if (!deleteButton) {
      console.log('   ❌ Cannot proceed - Delete button not found');
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/no-delete-button.png',
        fullPage: false 
      });
      return;
    }
    
    // 5. Click delete and handle confirmation
    console.log('🗑️ Step 5: Performing Delete');
    
    // Setup dialog handler
    let dialogHandled = false;
    page.once('dialog', async dialog => {
      console.log(`   ⚠️ Confirmation: "${dialog.message()}"`);
      await dialog.accept();
      dialogHandled = true;
      console.log('   ✅ Confirmed deletion');
    });
    
    // Click delete
    await page.click('button:has-text("Delete Selected")');
    
    // Wait for dialog and processing
    await page.waitForTimeout(3000);
    
    if (!dialogHandled) {
      console.log('   ❌ No confirmation dialog appeared!');
    }
    
    // 6. Verify deletion
    console.log('\n📊 Step 6: Verifying Deletion');
    const finalCount = await page.locator('tbody tr').count();
    console.log(`   📋 Submissions after delete: ${finalCount}`);
    console.log(`   📉 Items deleted: ${initialCount - finalCount}`);
    
    if (finalCount < initialCount) {
      console.log('   ✅ DELETE SUCCESSFUL!');
      
      // Check if bulk actions bar disappeared
      const barGone = !(await page.locator('div').filter({ hasText: /\d+ items? selected/ }).isVisible());
      console.log(`   📊 Bulk bar cleared: ${barGone ? 'YES ✅' : 'NO ❌'}`);
    } else {
      console.log('   ❌ DELETE FAILED - Count unchanged');
      
      // Look for error messages
      const toastError = await page.locator('.Toastify__toast--error').isVisible();
      if (toastError) {
        const errorText = await page.locator('.Toastify__toast--error').textContent();
        console.log(`   ❌ Error message: ${errorText}`);
      }
    }
    
    // 7. Take final screenshot
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/delete-test-complete.png',
      fullPage: false 
    });
    console.log('\n📸 Screenshot saved: delete-test-complete.png');
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY:');
    console.log('='.repeat(60));
    const success = finalCount < initialCount;
    console.log(`Overall Result: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Items selected: ${toSelect}`);
    console.log(`- Items deleted: ${initialCount - finalCount}`);
    console.log(`- Delete function: ${success ? 'WORKING ✅' : 'NOT WORKING ❌'}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/delete-test-error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Test completed');
    await browser.close();
  }
}

// Run test
testBulkDelete().catch(console.error);