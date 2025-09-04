const { chromium } = require('playwright');

async function testCompleteFeatures() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Complete Feature Test - IP & Location Tracking\n');
    
    // 1. Submit a test form
    console.log('📝 Step 1: Submitting Contact Form');
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    
    const timestamp = Date.now();
    const testData = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      subject: 'Testing Complete Features',
      message: 'Testing IP recording and location tracking'
    };
    
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="subject"]', testData.subject);
    await page.fill('textarea[name="message"]', testData.message);
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log('   ✅ Form submitted');
    
    // 2. Wait for thank you page
    console.log('\n🎉 Step 2: Verifying Thank You Page');
    await page.waitForURL('**/thank-you', { timeout: 10000 });
    console.log('   ✅ Redirected to thank you page');
    await page.waitForTimeout(2000);
    
    // 3. Login to dashboard
    console.log('\n🔐 Step 3: Logging into Dashboard');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@panchroma.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 4. Wait for dashboard
    console.log('\n📊 Step 4: Checking Dashboard for IP & Location');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Take screenshot of dashboard
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/complete-test-dashboard.png',
      fullPage: false 
    });
    
    // 5. Check for IP Address column
    console.log('\n🔍 Step 5: Verifying IP Address Column');
    const ipHeader = await page.locator('th:has-text("IP Address")').isVisible();
    if (ipHeader) {
      console.log('   ✅ IP Address column header found');
    } else {
      console.log('   ❌ IP Address column header NOT found');
    }
    
    // 6. Check for actual IP addresses in table
    console.log('\n📍 Step 6: Checking IP Address Data');
    const ipCells = await page.locator('td').filter({ hasText: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/ }).all();
    if (ipCells.length > 0) {
      console.log(`   ✅ Found ${ipCells.length} IP addresses in the table`);
      
      // Get first IP address text
      const firstIP = await ipCells[0].textContent();
      console.log(`   📡 Sample IP: ${firstIP}`);
    } else {
      console.log('   ⚠️ No IP addresses visible in table');
    }
    
    // 7. Check Location column
    console.log('\n🌍 Step 7: Checking Location Data');
    const locationHeader = await page.locator('th:has-text("Location")').isVisible();
    if (locationHeader) {
      console.log('   ✅ Location column header found');
      
      // Check for Hyderabad locations
      const hyderabadCells = await page.locator('td:has-text("Hyderabad")').count();
      if (hyderabadCells > 0) {
        console.log(`   ✅ Found ${hyderabadCells} submissions from Hyderabad`);
      }
    }
    
    // 8. Open submission details
    console.log('\n📋 Step 8: Checking Submission Details Modal');
    const firstViewButton = await page.locator('button').filter({ has: page.locator('svg') }).first();
    await firstViewButton.click();
    await page.waitForTimeout(1000);
    
    // Check for IP in modal
    const ipInModal = await page.locator('text=/IP Address/i').isVisible();
    if (ipInModal) {
      console.log('   ✅ IP Address section found in details modal');
      
      // Try to get the actual IP value
      const ipValue = await page.locator('p').filter({ hasText: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/ }).first();
      if (await ipValue.isVisible()) {
        const ip = await ipValue.textContent();
        console.log(`   📡 IP in modal: ${ip}`);
      }
    }
    
    // Check for Location in modal
    const locationInModal = await page.locator('text=/^Location$/i').isVisible();
    if (locationInModal) {
      console.log('   ✅ Location section found in details modal');
    }
    
    // Take screenshot of modal
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/complete-test-modal.png',
      fullPage: false 
    });
    
    // 9. Summary
    console.log('\n📊 FEATURE VERIFICATION SUMMARY:');
    console.log('   ✅ Contact form submission working');
    console.log('   ✅ Thank you page redirect working');
    console.log('   ✅ Dashboard login working');
    console.log('   ✅ Dashboard table displaying submissions');
    
    if (ipHeader) {
      console.log('   ✅ IP Address column present in dashboard');
    } else {
      console.log('   ❌ IP Address column missing in dashboard');
    }
    
    if (ipCells.length > 0) {
      console.log('   ✅ IP addresses being displayed');
    } else {
      console.log('   ❌ IP addresses NOT being displayed');
    }
    
    if (hyderabadCells > 0) {
      console.log('   ✅ Location tracking working (Hyderabad detected)');
    } else {
      console.log('   ⚠️ Location may be showing as "Local"');
    }
    
    if (ipInModal) {
      console.log('   ✅ IP Address shown in details modal');
    } else {
      console.log('   ❌ IP Address missing from details modal');
    }
    
    console.log('\n✅ Test completed!');
    console.log('📸 Screenshots saved to test-screenshots/');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/complete-test-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testCompleteFeatures().catch(console.error);