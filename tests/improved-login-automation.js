const { chromium } = require('playwright');

async function runImprovedLoginTest() {
    let browser;
    try {
        console.log('🚀 Starting improved Playwright login automation...');
        
        // Launch browser
        browser = await chromium.launch({
            headless: false,
            slowMo: 500
        });
        
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        
        const page = await context.newPage();
        
        console.log('📍 Step 1: Navigating to login page...');
        await page.goto('http://localhost:3000/login');
        
        // Wait for page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Extra wait for any animations
        
        console.log('📸 Step 2: Taking detailed screenshot of login page...');
        await page.screenshot({ 
            path: 'login-page-detailed.png',
            type: 'png',
            fullPage: true
        });
        
        // Also take a viewport screenshot
        await page.screenshot({ 
            path: 'login-page-viewport.png',
            type: 'jpeg',
            quality: 80,
            fullPage: false
        });
        
        console.log('🔍 Step 3: Analyzing login page...');
        const pageTitle = await page.title();
        console.log(`Login page title: ${pageTitle}`);
        
        // Fill the form
        console.log('✏️  Step 4: Filling in login form...');
        await page.fill('input[type="text"]', 'admin');
        await page.fill('input[type="password"]', 'admin123');
        
        console.log('🖱️  Step 5: Clicking Sign In button...');
        await page.click('button[type="submit"]');
        
        console.log('⏳ Step 6: Waiting for navigation...');
        await page.waitForTimeout(3000); // Wait for navigation
        
        const currentUrl = page.url();
        console.log(`📍 Current URL after login: ${currentUrl}`);
        
        console.log('📸 Step 7: Taking comprehensive dashboard screenshots...');
        
        // Take full page screenshot
        await page.screenshot({ 
            path: 'dashboard-fullpage.png',
            type: 'png',
            fullPage: true
        });
        
        // Take viewport screenshot  
        await page.screenshot({ 
            path: 'dashboard-viewport.png',
            type: 'jpeg',
            quality: 80,
            fullPage: false
        });
        
        console.log('📋 Step 8: Detailed dashboard analysis...');
        const dashboardTitle = await page.title();
        console.log(`Dashboard page title: ${dashboardTitle}`);
        
        // Extract all visible text
        const allText = await page.evaluate(() => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            
            while (node = walker.nextNode()) {
                if (node.textContent.trim().length > 0) {
                    textNodes.push(node.textContent.trim());
                }
            }
            
            return textNodes;
        });
        
        console.log('📄 All text content found on dashboard:');
        const uniqueTexts = [...new Set(allText)].filter(text => text.length > 1);
        uniqueTexts.forEach((text, index) => {
            console.log(`  ${index + 1}. "${text}"`);
        });
        
        // Look for specific dashboard elements
        console.log('🎯 Dashboard elements analysis:');
        
        // Check for navigation items
        const navItems = await page.$$eval('nav a, .nav a, [role="navigation"] a', 
            elements => elements.map(el => el.textContent.trim()));
        if (navItems.length > 0) {
            console.log(`Navigation items: ${navItems.join(', ')}`);
        }
        
        // Check for buttons
        const buttons = await page.$$eval('button', 
            elements => elements.map(el => el.textContent.trim()).filter(text => text.length > 0));
        if (buttons.length > 0) {
            console.log(`Buttons found: ${buttons.join(', ')}`);
        }
        
        // Check for user info
        const userElements = await page.$eval('body', () => {
            const text = document.body.textContent;
            const matches = [];
            if (text.includes('Admin User')) matches.push('Admin User found');
            if (text.includes('admin')) matches.push('admin username found');
            if (text.includes('Welcome')) matches.push('Welcome message found');
            if (text.includes('Dashboard')) matches.push('Dashboard text found');
            return matches;
        });
        console.log(`User-related elements: ${userElements.join(', ')}`);
        
        console.log('✅ Improved login automation completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during automation:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the improved test
runImprovedLoginTest();