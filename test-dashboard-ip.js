const { chromium } = require('playwright');

async function testDashboardIP() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Testing Dashboard IP & Location Display\n');
    
    // 1. Go directly to login
    console.log('🔐 Step 1: Logging into Dashboard');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Login
    await page.fill('input[type="email"]', 'admin@panchroma.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 2. Wait for dashboard
    console.log('\n📊 Step 2: Checking Dashboard Table');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // 3. Check table headers
    console.log('\n📋 Step 3: Verifying Table Headers');
    const headers = await page.locator('th').allTextContents();
    console.log('   Table headers found:', headers);
    
    const hasIPColumn = headers.some(h => h.includes('IP Address'));
    const hasLocationColumn = headers.some(h => h.includes('Location'));
    
    if (hasIPColumn) {
      console.log('   ✅ IP Address column EXISTS');
    } else {
      console.log('   ❌ IP Address column MISSING');
    }
    
    if (hasLocationColumn) {
      console.log('   ✅ Location column EXISTS');
    } else {
      console.log('   ❌ Location column MISSING');
    }
    
    // 4. Check for IP addresses in table cells
    console.log('\n🔍 Step 4: Looking for IP Addresses in Table');
    
    // Get all table cells
    const cells = await page.locator('td').allTextContents();
    
    // Look for IP address pattern
    const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    const ipAddresses = cells.filter(cell => ipPattern.test(cell));
    
    if (ipAddresses.length > 0) {
      console.log(`   ✅ Found ${ipAddresses.length} IP addresses:`);
      ipAddresses.forEach(ip => console.log(`      - ${ip}`));
    } else {
      console.log('   ❌ No IP addresses found in table');
    }
    
    // 5. Check for locations
    console.log('\n🌍 Step 5: Looking for Location Data');
    const locations = cells.filter(cell => 
      cell.includes('Hyderabad') || 
      cell.includes('Local') || 
      cell.includes('Unknown')
    );
    
    if (locations.length > 0) {
      console.log(`   ✅ Found ${locations.length} location entries:`);
      locations.forEach(loc => console.log(`      - ${loc}`));
    } else {
      console.log('   ❌ No location data found');
    }
    
    // 6. Take screenshot
    console.log('\n📸 Step 6: Taking Dashboard Screenshot');
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/dashboard-ip-test.png',
      fullPage: false 
    });
    console.log('   ✅ Screenshot saved');
    
    // 7. Open first submission details
    console.log('\n📋 Step 7: Checking Submission Details Modal');
    const viewButtons = await page.locator('button').filter({ has: page.locator('svg') });
    const firstViewButton = await viewButtons.first();
    
    if (await firstViewButton.isVisible()) {
      await firstViewButton.click();
      await page.waitForTimeout(1500);
      
      // Look for IP in modal
      const modalText = await page.textContent('body');
      
      if (modalText.includes('IP Address')) {
        console.log('   ✅ IP Address field found in modal');
        
        // Try to find the actual IP
        const modalIPs = modalText.match(ipPattern);
        if (modalIPs && modalIPs.length > 0) {
          console.log(`   📡 IP in modal: ${modalIPs[0]}`);
        }
      } else {
        console.log('   ❌ IP Address field NOT found in modal');
      }
      
      if (modalText.includes('Location')) {
        console.log('   ✅ Location field found in modal');
      }
      
      // Screenshot modal
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/modal-ip-test.png',
        fullPage: false 
      });
    }
    
    // 8. Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL TEST RESULTS:');
    console.log('='.repeat(50));
    
    if (hasIPColumn && ipAddresses.length > 0) {
      console.log('✅ IP RECORDING: WORKING');
      console.log('   - IP column present in dashboard');
      console.log('   - IP addresses displayed in table');
    } else {
      console.log('❌ IP RECORDING: NOT WORKING');
      if (!hasIPColumn) console.log('   - IP column missing from dashboard');
      if (ipAddresses.length === 0) console.log('   - No IP addresses displayed');
    }
    
    if (hasLocationColumn && locations.length > 0) {
      console.log('✅ LOCATION TRACKING: WORKING');
      console.log('   - Location column present');
      console.log('   - Location data displayed');
    } else {
      console.log('❌ LOCATION TRACKING: NOT WORKING');
    }
    
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/dashboard-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testDashboardIP().catch(console.error);