const { chromium } = require('playwright');

async function runLoginTest() {
    let browser;
    try {
        console.log('🚀 Starting Playwright login automation...');
        
        // Launch browser
        browser = await chromium.launch({
            headless: false, // Show browser for debugging
            slowMo: 1000 // Slow down operations for visibility
        });
        
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        
        const page = await context.newPage();
        
        console.log('📍 Step 1: Navigating to login page...');
        await page.goto('http://localhost:3000/login');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        console.log('📸 Step 2: Taking screenshot of login page...');
        await page.screenshot({ 
            path: 'login-page-screenshot.png',
            type: 'jpeg',
            quality: 80,
            fullPage: false
        });
        
        console.log('🔍 Step 3: Inspecting login form elements...');
        
        // Try different possible selectors for username/email field
        const usernameSelectors = [
            'input[name="username"]',
            'input[name="email"]', 
            'input[type="text"]',
            'input[placeholder*="username" i]',
            'input[placeholder*="email" i]',
            '#username',
            '#email',
            '.username-input',
            '.email-input'
        ];
        
        let usernameField = null;
        for (const selector of usernameSelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    usernameField = selector;
                    console.log(`✅ Found username field with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue trying next selector
            }
        }
        
        // Try different possible selectors for password field
        const passwordSelectors = [
            'input[name="password"]',
            'input[type="password"]',
            '#password',
            '.password-input'
        ];
        
        let passwordField = null;
        for (const selector of passwordSelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    passwordField = selector;
                    console.log(`✅ Found password field with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue trying next selector
            }
        }
        
        // Try different possible selectors for submit button
        const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Sign In")',
            'button:has-text("Login")',
            'button:has-text("Log In")',
            '.login-button',
            '.signin-button',
            '#login-button',
            '#signin-button'
        ];
        
        let submitButton = null;
        for (const selector of submitSelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    submitButton = selector;
                    console.log(`✅ Found submit button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue trying next selector
            }
        }
        
        if (!usernameField || !passwordField || !submitButton) {
            console.log('❌ Could not find all required form elements');
            console.log(`Username field found: ${!!usernameField}`);
            console.log(`Password field found: ${!!passwordField}`);
            console.log(`Submit button found: ${!!submitButton}`);
            
            // Let's inspect the page content
            console.log('📋 Page content analysis:');
            const pageContent = await page.content();
            console.log('Page title:', await page.title());
            
            // Look for form elements
            const forms = await page.$$('form');
            console.log(`Found ${forms.length} form(s) on page`);
            
            const inputs = await page.$$('input');
            console.log(`Found ${inputs.length} input(s) on page`);
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                const type = await input.getAttribute('type');
                const name = await input.getAttribute('name');
                const placeholder = await input.getAttribute('placeholder');
                const id = await input.getAttribute('id');
                console.log(`  Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`);
            }
            
            const buttons = await page.$$('button');
            console.log(`Found ${buttons.length} button(s) on page`);
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                const text = await button.textContent();
                const type = await button.getAttribute('type');
                const className = await button.getAttribute('class');
                console.log(`  Button ${i}: text="${text}", type="${type}", class="${className}"`);
            }
            
            return;
        }
        
        console.log('✏️  Step 4: Filling in login form...');
        await page.fill(usernameField, 'admin');
        await page.fill(passwordField, 'admin123');
        
        console.log('🖱️  Step 5: Clicking Sign In button...');
        await page.click(submitButton);
        
        console.log('⏳ Step 6: Waiting for navigation...');
        try {
            await page.waitForNavigation({ timeout: 10000 });
            console.log('✅ Navigation completed');
        } catch (e) {
            console.log('⚠️  Navigation timeout, checking current URL...');
        }
        
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);
        
        console.log('📸 Step 7: Taking screenshot of current page...');
        await page.screenshot({ 
            path: 'dashboard-screenshot.png',
            type: 'jpeg',
            quality: 80,
            fullPage: false
        });
        
        console.log('📋 Step 8: Analyzing dashboard content...');
        const title = await page.title();
        console.log(`Page title: ${title}`);
        
        // Look for common dashboard elements
        const dashboardElements = await page.$$eval('*', (elements) => {
            const texts = [];
            elements.forEach(el => {
                if (el.textContent && el.textContent.trim().length > 0 && el.textContent.trim().length < 100) {
                    texts.push(el.textContent.trim());
                }
            });
            return [...new Set(texts)].slice(0, 20); // Get unique texts, limited to 20
        });
        
        console.log('📄 Visible text content on page:');
        dashboardElements.forEach((text, index) => {
            if (text && text.length > 2) {
                console.log(`  ${index + 1}. ${text}`);
            }
        });
        
        // Check for any error messages
        const errorSelectors = [
            '.error',
            '.alert',
            '.warning',
            '[class*="error"]',
            '[class*="alert"]'
        ];
        
        for (const selector of errorSelectors) {
            try {
                const errorElement = await page.$(selector);
                if (errorElement) {
                    const errorText = await errorElement.textContent();
                    console.log(`⚠️  Error message found: ${errorText}`);
                }
            } catch (e) {
                // Continue
            }
        }
        
        console.log('✅ Login automation completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during automation:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
runLoginTest();