const { chromium } = require('playwright');

async function testDeleteFunction() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Delete Selected Function\n');
    console.log('='.repeat(60));
    
    // 1. Login
    console.log('📝 Step 1: Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'admin@panchroma.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForTimeout(1000);
    console.log('   ✅ Logged in successfully\n');
    
    // 2. Count initial submissions
    console.log('📊 Step 2: Counting initial submissions');
    const initialCount = await page.locator('tbody tr').count();
    console.log(`   📋 Initial submission count: ${initialCount}`);
    
    if (initialCount === 0) {
      console.log('   ⚠️ No submissions to test with. Creating test submissions...');
      // Navigate to contact form and create some
      await page.goto('http://localhost:3000/contact');
      for (let i = 0; i < 3; i++) {
        await page.fill('input[name="name"]', `Test User ${Date.now() + i}`);
        await page.fill('input[name="email"]', `test${Date.now() + i}@example.com`);
        await page.fill('input[name="subject"]', `Test Subject ${i}`);
        await page.fill('textarea[name="message"]', `Test message for deletion ${i}`);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/thank-you');
        await page.goto('http://localhost:3000/contact');
      }
      // Go back to dashboard
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForSelector('table');
    }
    console.log('');
    
    // 3. Select specific items
    console.log('☑️ Step 3: Selecting items for deletion');
    const checkboxes = await page.locator('td input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`   📋 Found ${checkboxCount} checkboxes`);
    
    // Select first 2 items
    if (checkboxCount >= 2) {
      await checkboxes.nth(0).check();
      await page.waitForTimeout(300);
      await checkboxes.nth(1).check();
      await page.waitForTimeout(300);
      console.log('   ✅ Selected 2 items');
    } else if (checkboxCount > 0) {
      await checkboxes.nth(0).check();
      console.log('   ✅ Selected 1 item');
    }
    
    // Check if bulk actions bar appeared
    const bulkBar = await page.locator('text=/\\d+ items? selected/').isVisible();
    console.log(`   📊 Bulk actions bar visible: ${bulkBar ? 'YES' : 'NO'}\n`);
    
    // 4. Look for delete button
    console.log('🔍 Step 4: Finding Delete Button');
    const deleteButtons = await page.locator('button:has-text("Delete")').all();
    console.log(`   📋 Found ${deleteButtons.length} buttons with "Delete" text`);
    
    // Try to find the bulk delete button specifically
    const bulkDeleteButton = await page.locator('button:has-text("Delete Selected")').isVisible();
    console.log(`   🗑️ "Delete Selected" button visible: ${bulkDeleteButton ? 'YES' : 'NO'}`);
    
    if (!bulkDeleteButton) {
      // Check if button exists but might be hidden
      const buttonExists = await page.locator('button:has-text("Delete Selected")').count();
      console.log(`   ⚠️ Button exists in DOM: ${buttonExists > 0 ? 'YES' : 'NO'}`);
      
      // Take screenshot to see current state
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/delete-button-missing.png',
        fullPage: false 
      });
      console.log('   📸 Screenshot saved: delete-button-missing.png\n');
    }
    
    // 5. Try to click delete
    console.log('🗑️ Step 5: Attempting to Delete');
    if (bulkDeleteButton) {
      const countBefore = await page.locator('tbody tr').count();
      console.log(`   📊 Items before delete: ${countBefore}`);
      
      // Setup dialog handler
      let dialogHandled = false;
      page.once('dialog', async dialog => {
        console.log(`   ⚠️ Dialog appeared: "${dialog.message()}"`);
        dialogHandled = true;
        await dialog.accept();
        console.log('   ✅ Dialog accepted');
      });
      
      // Click delete button
      await page.click('button:has-text("Delete Selected")');
      
      // Wait for dialog or response
      await page.waitForTimeout(2000);
      
      if (!dialogHandled) {
        console.log('   ❌ No confirmation dialog appeared');
      }
      
      // Check count after
      const countAfter = await page.locator('tbody tr').count();
      console.log(`   📊 Items after delete: ${countAfter}`);
      
      if (countAfter < countBefore) {
        console.log(`   ✅ Successfully deleted ${countBefore - countAfter} items`);
      } else {
        console.log('   ❌ Delete did not work - count unchanged');
        
        // Check for any error messages
        const toastError = await page.locator('.Toastify__toast--error').isVisible();
        if (toastError) {
          const errorText = await page.locator('.Toastify__toast--error').textContent();
          console.log(`   ❌ Error toast: ${errorText}`);
        }
      }
    } else {
      console.log('   ❌ Cannot test delete - button not found');
    }
    
    // 6. Check network tab for API errors
    console.log('\n🌐 Step 6: Checking for API errors');
    // Monitor network for delete requests
    const deleteRequests = [];
    page.on('response', response => {
      if (response.url().includes('/api/contact/submissions/') && response.request().method() === 'DELETE') {
        deleteRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Try delete again while monitoring
    if (checkboxCount > 0) {
      await checkboxes.nth(0).check();
      await page.waitForTimeout(300);
      
      if (await page.locator('button:has-text("Delete Selected")').isVisible()) {
        page.once('dialog', async dialog => await dialog.accept());
        await page.click('button:has-text("Delete Selected")');
        await page.waitForTimeout(2000);
        
        if (deleteRequests.length > 0) {
          console.log('   📡 Delete API calls made:');
          deleteRequests.forEach(req => {
            console.log(`      - ${req.url}`);
            console.log(`        Status: ${req.status} ${req.statusText}`);
          });
        } else {
          console.log('   ❌ No DELETE API calls were made');
        }
      }
    }
    
    // 7. Final screenshot
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/delete-test-final.png',
      fullPage: false 
    });
    console.log('\n📸 Final screenshot saved');
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DELETE FUNCTION TEST SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Bulk Delete Button Found: ${bulkDeleteButton ? '✅' : '❌'}`);
    console.log(`Delete API Calls Made: ${deleteRequests.length > 0 ? '✅' : '❌'}`);
    console.log(`Items Actually Deleted: ${deleteRequests.some(r => r.status === 200) ? '✅' : '❌'}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/delete-test-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testDeleteFunction().catch(console.error);