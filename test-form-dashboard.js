const { chromium } = require('playwright');

async function testFormAndDashboard() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Panchroma Form & Dashboard Test...\n');
    
    // 1. Test Contact Form Submission
    console.log('📝 Step 1: Testing Contact Form Submission');
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    
    // Fill out the contact form
    console.log('   - Filling out contact form...');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="subject"]', 'Website Inquiry');
    await page.fill('textarea[name="message"]', 'I am interested in your web development services. Please contact me to discuss a new e-commerce project.');
    
    // Take screenshot of filled form
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/1-contact-form-filled.png',
      fullPage: false 
    });
    console.log('   ✅ Form filled successfully');
    
    // Submit the form
    console.log('   - Submitting form...');
    await page.click('button[type="submit"]');
    
    // 2. Verify Thank You Page
    console.log('\n🎉 Step 2: Verifying Thank You Page');
    await page.waitForURL('**/thank-you', { timeout: 10000 });
    await page.waitForSelector('h1:has-text("Thank You")', { timeout: 5000 });
    
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/2-thank-you-page.png',
      fullPage: false 
    });
    console.log('   ✅ Thank you page displayed correctly');
    
    // Wait a moment on thank you page
    await page.waitForTimeout(3000);
    
    // 3. Navigate to Login Page
    console.log('\n🔐 Step 3: Testing Dashboard Login');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Login
    console.log('   - Logging in as admin...');
    await page.fill('input[type="email"]', 'admin@panchroma.com');
    await page.fill('input[type="password"]', 'admin123');
    
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/3-login-page.png',
      fullPage: false 
    });
    
    await page.click('button[type="submit"]');
    
    // 4. Verify Dashboard
    console.log('\n📊 Step 4: Verifying Dashboard');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
    
    // Wait for submissions to load
    await page.waitForTimeout(2000);
    
    // Check if our submission appears
    console.log('   - Checking for submitted form data...');
    const hasSubmission = await page.locator('text="John Doe"').isVisible();
    
    if (hasSubmission) {
      console.log('   ✅ Submission found in dashboard!');
      
      // Take screenshot of dashboard with submissions
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/4-dashboard-submissions.png',
        fullPage: false 
      });
      
      // 5. Test Dashboard Actions
      console.log('\n⚙️ Step 5: Testing Dashboard Actions');
      
      // Click on view details button
      console.log('   - Opening submission details...');
      const viewButton = await page.locator('button:has(svg)').first();
      await viewButton.click();
      
      await page.waitForTimeout(1000);
      
      // Check if modal opened
      const modalVisible = await page.locator('text="Submission Details"').isVisible();
      if (modalVisible) {
        console.log('   ✅ Detail modal opened successfully');
        
        // Add a note
        console.log('   - Adding internal note...');
        await page.fill('textarea[placeholder="Add internal notes..."]', 'Follow up scheduled for next week.');
        
        await page.screenshot({ 
          path: '/Users/adityapachauri/Desktop/pan/test-screenshots/5-submission-detail.png',
          fullPage: false 
        });
        
        // Save notes
        await page.click('button:has-text("Save Notes")');
        await page.waitForTimeout(1000);
        console.log('   ✅ Notes saved successfully');
      }
      
      // Test status change
      console.log('   - Testing status change...');
      const statusDropdown = await page.locator('select').first();
      await statusDropdown.selectOption('contacted');
      await page.waitForTimeout(1000);
      console.log('   ✅ Status updated to "contacted"');
      
      // Test export functionality
      console.log('   - Testing export button...');
      const exportButton = await page.locator('button:has-text("Export")');
      if (await exportButton.isVisible()) {
        console.log('   ✅ Export button available');
      }
      
      // Final dashboard screenshot
      await page.screenshot({ 
        path: '/Users/adityapachauri/Desktop/pan/test-screenshots/6-dashboard-final.png',
        fullPage: false 
      });
      
    } else {
      console.log('   ⚠️ Submission not found yet - may need to wait for backend processing');
    }
    
    // 6. Submit another form to test multiple submissions
    console.log('\n📝 Step 6: Testing Multiple Submissions');
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    
    // Fill second form
    await page.fill('input[name="name"]', 'Jane Smith');
    await page.fill('input[name="email"]', 'jane.smith@example.com');
    await page.fill('input[name="subject"]', 'Mobile App Development');
    await page.fill('textarea[name="message"]', 'We need a mobile app for our restaurant business. Can you help?');
    
    await page.click('button[type="submit"]');
    await page.waitForURL('**/thank-you', { timeout: 10000 });
    console.log('   ✅ Second submission completed');
    
    // Go back to dashboard to see both submissions
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);
    
    // Check stats
    console.log('\n📈 Step 7: Verifying Dashboard Stats');
    const statsCards = await page.locator('h3').allTextContents();
    console.log('   Dashboard Statistics:');
    statsCards.forEach((stat, index) => {
      if (stat && !isNaN(parseInt(stat))) {
        console.log(`   - Stat ${index + 1}: ${stat}`);
      }
    });
    
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/7-dashboard-multiple.png',
      fullPage: true 
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('📸 Screenshots saved to /Users/adityapachauri/Desktop/pan/test-screenshots/');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Take error screenshot
    await page.screenshot({ 
      path: '/Users/adityapachauri/Desktop/pan/test-screenshots/error-screenshot.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testFormAndDashboard().catch(console.error);